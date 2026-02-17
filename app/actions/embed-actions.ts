"use server";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getAIProvider } from "@/lib/ai";
import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { Prisma } from "@prisma/client";
import type { DocumentChunk as PrismaDocumentChunk } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getExtractedText } from "@/lib/object-storage-text";
import { logger } from "@/lib/logger";
import { AI_CONFIG } from "@/lib/config";

export async function processAndEmbedDocument(pdfSummaryId: string) {
  try {
    const pdfSummary = await prisma.pdfSummary.findUnique({
      where: { id: pdfSummaryId },
      select: { extractedTextKey: true },
    });
    if (!pdfSummary) throw new Error("PDF summary not found.");
    if (!pdfSummary.extractedTextKey) throw new Error("No extracted text key found.");

    // Retrieve extracted text from MinIO
    const extractedText = await getExtractedText(pdfSummary.extractedTextKey);

    await prisma.documentChunk.deleteMany({ where: { pdfSummaryId } });

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: AI_CONFIG.EMBEDDING_CHUNK_SIZE,
      chunkOverlap: 100,
    });

    const textChunks = await splitter.splitText(extractedText || "");
    if (textChunks.length === 0) {
      return { success: true, message: "No text to chunk." };
    }

    const aiProvider = getAIProvider();

    // create rows without embeddings
    const created = await prisma.$transaction(
      textChunks.map((content) =>
        prisma.documentChunk.create({
          data: { content, pdfSummaryId },
        })
      )
    );

    const vectorStore = PrismaVectorStore.withModel<PrismaDocumentChunk>(prisma).create(
      aiProvider,
      {
        prisma: Prisma,
        tableName: "DocumentChunk",
        vectorColumnName: aiProvider.vectorColumnName,
        columns: {
          id: PrismaVectorStore.IdColumn,
          content: PrismaVectorStore.ContentColumn,
        },
      }
    );

    await vectorStore.addModels(created);

    logger.info({ pdfSummaryId, chunkCount: created.length }, "Document chunks embedded successfully");
    return { success: true, count: created.length };
  } catch (error) {
    const { maskId } = await import("@/lib/logger");
    logger.error({ error, pdfSummaryId: maskId(pdfSummaryId) }, "Error in processAndEmbedDocument");
    throw error;
  }
}
