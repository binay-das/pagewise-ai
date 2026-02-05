import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger, maskId } from "@/lib/logger";
import { streamOllamaChat } from "@/lib/ollama";
import { NextRequest, NextResponse } from "next/server";

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

        const { id } = await context.params;

        // Fetch the document and verify ownership
        const document = await prisma.pdfSummary.findUnique({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!document) {
            return NextResponse.json(
                { error: "Document not found" },
                { status: 404 }
            );
        }

        // Check if summary already exists
        if (document.summaryText && document.summaryText.trim()) {
            return NextResponse.json(
                { error: "Summary already exists" },
                { status: 400 }
            );
        }

        // Get the extracted text
        const extractedText = document.extractedText;

        if (!extractedText || !extractedText.trim()) {
            return NextResponse.json(
                { error: "No extracted text available" },
                { status: 400 }
            );
        }

        logger.info({ documentId: maskId(id) }, "Generating summary for document");

        // Create the prompt for summary generation
        const prompt = `
        Transform the following document into an engaging, easy-to-read summary.
        - Use clear sections
        - Add contextually relevant emojis
        - Use proper Markdown formatting

        Document:
        ${extractedText}
        `;

        // Stream the summary generation
        const ollamaStream = await streamOllamaChat([
            { role: "user", content: prompt }
        ]);

        // We need to capture the streamed content to save it to the database
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
                            // Save the complete summary to the database
                            await prisma.pdfSummary.update({
                                where: { id },
                                data: { summaryText: fullSummary },
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
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
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
