import { prisma } from "@/lib/prisma";
import { logger, maskId } from "@/lib/logger";

export async function getDocumentById(summaryId: string, userId: string) {
    try {
        const document = await prisma.pdfSummary.findUnique({
            where: {
                id: summaryId,
                userId: userId,
            }
        })
        return document;

    } catch (error) {
        logger.error({ error, documentId: maskId(summaryId) }, "Database error: Failed to fetch document");
        return null;
    }
}