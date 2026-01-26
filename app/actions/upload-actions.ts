"use server";

import { authOptions } from "@/lib/auth";
// import { generateSummaryFromGemini } from "@/lib/gemini";
// import { generateSafeSummary, generateSummaryFromOllama } from "@/lib/ollama";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { extractTextFromPdf } from "@/lib/langchain";
import { readPdfFromStorage } from "@/lib/object-storage.read";
import { processAndEmbedDocument } from "@/app/actions/embed-actions";


export async function generateSummary(fileKey: string) {
    if (!fileKey) {
        return {
            success: false,
            message: "File upload failed or response is invalid",
            data: null,
        };
    }

    try {
        const pdfBuffer = await readPdfFromStorage(fileKey);
        const pdfText = await extractTextFromPdf(pdfBuffer);
        console.log("PDF Text Extracted, length:", pdfText.length);

        // Optimization: Skip blocking summary generation during upload.
        // Summary can be generated on-demand later.
        const summary: string | null = null;

        return {
            success: true,
            message: "Text extracted successfully",
            data: { summary, pdfText },
        };

    } catch (error) {
        console.error("Error extracted text:", error);
        return {
            success: false,
            message: "Failed to extract text from PDF",
            data: null,
        };
    }
}


export async function storePdfSummaryAction({
    fileUrl,
    summary,
    title,
    fileName,
    extractedText
}: {
    fileUrl: string;
    summary: string | null;
    title: string;
    fileName: string;
    extractedText: string;
}) {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;
        if (!user || !user.id) {
            return {
                success: false,
                message: "User not found",
            };
        }

        const savedPdfSummary = await prisma.pdfSummary.create({
            data: {
                userId: user.id,
                originalFileUrl: fileUrl,
                summaryText: summary ?? "",
                title,
                fileName,
                extractedText
            },
        });

        await processAndEmbedDocument(savedPdfSummary.id);

        console.log(`Kicked off embedding for PdfSummary ID: ${savedPdfSummary.id}`);

        return {
            success: true,
            message: "Summary saved successfully and embedding process started",
            data: savedPdfSummary,
        };
    } catch (error) {
        console.error("Error storing summary:", error);
        return {
            success: false,
            message: "Failed to store summary in db",
        };
    }
}