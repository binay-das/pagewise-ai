import { prisma } from "./prisma";

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

        console.error("Database Error: Failed to fetch document.", error);
        return null;
    }
}