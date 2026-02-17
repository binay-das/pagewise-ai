"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { extractTextFromPdf, PdfMetadata } from "@/lib/langchain";
import { readPdfFromStorage } from "@/lib/object-storage.read";
import { storeExtractedText } from "@/lib/object-storage-text";
import { processAndEmbedDocument } from "@/app/actions/embed-actions";
import { logger, maskId } from "@/lib/logger";
import { Result } from "@/lib/types/result";
import { getAIProvider } from "@/lib/ai";


type SummaryData = {
    summary: string | null;
    pdfText: string;
    metadata: PdfMetadata;
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
        const extraction = await extractTextFromPdf(pdfBuffer);
        logger.info({ textLength: extraction.text.length }, "PDF text extracted successfully");

        // Optimization: Skip blocking summary generation during upload.
        // Summary can be generated on-demand later.
        const summary: string | null = null;

        return {
            success: true,
            data: {
                summary,
                pdfText: extraction.text,
                metadata: extraction.metadata,
            },
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
    extractedTextKey: string | null;
    wordCount: number;
    createdAt: Date;
    updatedAt: Date;
};

export async function storePdfSummaryAction({
    fileUrl,
    summary,
    title,
    fileName,
    extractedText,
    metadata,
}: {
    fileUrl: string;
    summary: string | null;
    title: string;
    fileName: string;
    extractedText: string;
    metadata?: PdfMetadata;
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

        const currentProvider = getAIProvider();

        // Calculate word count
        const wordCount = extractedText.trim().split(/\s+/).length;

        const savedPdfSummary = await prisma.pdfSummary.create({
            data: {
                userId: user.id,
                originalFileUrl: fileUrl,
                fileName,
                summaryText: summary || "",
                title: metadata?.title || title,
                author: metadata?.author,
                creationDate: metadata?.creationDate,
                keywords: metadata?.keywords,
                wordCount,
                embeddingProvider: currentProvider.name,
            },
        });

        const textKey = await storeExtractedText(savedPdfSummary.id, extractedText);

        await prisma.pdfSummary.update({
            where: { id: savedPdfSummary.id },
            data: { extractedTextKey: textKey },
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