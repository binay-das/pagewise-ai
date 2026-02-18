import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getExtractedText } from "@/lib/object-storage-text";
import { logger, maskId } from "@/lib/logger";
import { streamOllamaChat } from "@/lib/ollama";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;

        if (!user || !user.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const rateLimit = checkRateLimit(`summary:${user.id}`, 5, 60_000);
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: "Too many requests" },
                {
                    status: 429,
                    headers: { "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)) },
                }
            );
        }

        const { id } = await context.params;

        const document = await prisma.pdfSummary.findUnique({
            where: {
                id,
                userId: user.id
            }
        });

        if (!document) {
            return NextResponse.json(
                { error: "Document not found" },
                { status: 404 }
            );
        }

        if (document.summaryText && document.summaryText.trim()) {
            return NextResponse.json(
                { error: "Summary already exists" },
                { status: 400 }
            );
        }

        if (!document.extractedTextKey) {
            return NextResponse.json(
                { error: "No extracted text available" },
                { status: 400 }
            );
        }

        // Retrieve extracted text from MinIO
        const extractedText = await getExtractedText(document.extractedTextKey);

        if (!extractedText || !extractedText.trim()) {
            return NextResponse.json(
                { error: "No extracted text available" },
                { status: 400 }
            );
        }

        logger.info({ documentId: maskId(id) }, "Generating summary for document");

        const prompt = `
        Transform the following document into an engaging, easy-to-read summary.
        - Use clear sections
        - Add contextually relevant emojis
        - Use proper Markdown formatting

        Document:
        ${extractedText}
        `;

        const ollamaStream = await streamOllamaChat([
            { role: "user", content: prompt }
        ]);

        let fullSummary = "";
        const encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const reader = ollamaStream.getReader();
                    const decoder = new TextDecoder();

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            await prisma.pdfSummary.update({
                                where: { id },
                                data: { summaryText: fullSummary }
                            });
                            logger.info({ documentId: maskId(id) }, "Summary saved to database");
                            controller.close();
                            break;
                        }

                        const chunk = decoder.decode(value, { stream: true });
                        const lines = chunk.split('\n');

                        for (const line of lines) {
                            if (!line.trim()) continue;
                            try {
                                const json = JSON.parse(line);

                                if (json.done) {
                                    continue;
                                }

                                if (json.message?.content) {
                                    const content = json.message.content;
                                    fullSummary += content;
                                    controller.enqueue(encoder.encode(content));
                                }
                            } catch (e) {
                                // Skip invalid JSON lines
                            }
                        }
                    }
                } catch (error) {
                    logger.error({ error, documentId: maskId(id) }, "Error during summary generation");
                    controller.error(error);
                }
            },
        });

        return new NextResponse(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache, no-transform",
                "X-Content-Type-Options": "nosniff",
            },
        });
    } catch (error) {
        logger.error({ error }, "Error in generate-summary API");
        return NextResponse.json(
            { error: "Failed to generate summary" },
            { status: 500 }
        );
    }
}
