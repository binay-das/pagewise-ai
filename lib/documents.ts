import { prisma } from "./prisma";

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
    console.error("Database Error: Failed to fetch documents: ", error);
    return [];
  }
}