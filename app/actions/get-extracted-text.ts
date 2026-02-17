"use server";

import { prisma } from "@/lib/prisma";
import { getExtractedText } from "@/lib/object-storage-text";
import { Result } from "@/lib/types/result";
import { logger } from "@/lib/logger";

export async function getDocumentExtractedText(
    documentId: string
): Promise<Result<string>> {
    try {
        const document = await prisma.pdfSummary.findUnique({
            where: { id: documentId },
            select: { extractedTextKey: true },
        });

        if (!document) {
            return {
                success: false,
                error: "Document not found",
            };
        }

        if (!document.extractedTextKey) {
            return {
                success: false,
                error: "No extracted text available",
            };
        }

        const extractedText = await getExtractedText(document.extractedTextKey);

        return {
            success: true,
            data: extractedText,
        };
    } catch (error) {
        logger.error({ error, documentId }, "Error retrieving extracted text");
        return {
            success: false,
            error: "Failed to retrieve extracted text",
        };
    }
}
