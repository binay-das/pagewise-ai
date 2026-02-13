"use server";

import { authOptions } from "@/lib/auth";
// import { generateSummaryFromGemini } from "@/lib/gemini";
// import { generateSafeSummary, generateSummaryFromOllama } from "@/lib/ollama";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { extractTextFromPdf } from "@/lib/langchain";
import { readPdfFromStorage } from "@/lib/object-storage.read";
import { processAndEmbedDocument } from "@/app/actions/embed-actions";
import { logger, maskId } from "@/lib/logger";
import { Result } from "@/lib/types/result";


type SummaryData = {
    summary: string | null;
    pdfText: string;
};

export async function generateSummary(fileKey: string): Promise<Result<SummaryData>> {
    if (!fileKey) {
        return {
            success: false,
            error: "File upload failed or response is invalid",
        };
    }

    try {
        const pdfBuffer = await readPdfFromStorage(fileKey);
        const pdfText = await extractTextFromPdf(pdfBuffer);
        logger.info({ textLength: pdfText.length }, "PDF text extracted successfully");

        // Optimization: Skip blocking summary generation during upload.
        // Summary can be generated on-demand later.
        const summary: string | null = null;

        return {
            success: true,
            data: { summary, pdfText },
        };

    } catch (error) {
        logger.error({ error }, "Error extracting text from PDF");
        return {
            success: false,
            error: "Failed to extract text from PDF",
        };
    }
}


type PdfSummary = {
    id: string;
    userId: string;
    originalFileUrl: string;
    summaryText: string;
    title: string | null;
    fileName: string | null;
    extractedText: string;
    createdAt: Date;
    updatedAt: Date;
};

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
}): Promise<Result<PdfSummary>> {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;
        if (!user || !user.id) {
            return {
                success: false,
                error: "User not found",
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

        logger.info({ pdfSummaryId: savedPdfSummary.id, userId: maskId(user.id) }, "Embedding process started for PDF");

        return {
            success: true,
            data: savedPdfSummary,
        };
    } catch (error) {
        logger.error({ error }, "Error storing PDF summary in database");
        return {
            success: false,
            error: "Failed to store summary in database",
        };
    }
}