import { prisma } from "@/lib/prisma";
import { logger, maskId } from "@/lib/logger";

export async function getDocuments(userId: string) {
  try {
    const documents = await prisma.pdfSummary.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return documents;

  } catch (error) {
    logger.error({ error, userId: maskId(userId) }, "Database error: Failed to fetch documents");
    return [];
  }
}