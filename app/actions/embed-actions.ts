"use server";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { Prisma } from "@prisma/client";
import type { DocumentChunk as PrismaDocumentChunk } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function processAndEmbedDocument(pdfSummaryId: string) {
  try {
    const pdfSummary = await prisma.pdfSummary.findUnique({
      where: { id: pdfSummaryId },
      select: { extractedText: true },
    });
    if (!pdfSummary) throw new Error("PDF summary not found.");

    await prisma.documentChunk.deleteMany({ where: { pdfSummaryId } });

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 100,
    });

    const textChunks = await splitter.splitText(pdfSummary.extractedText || "");
    if (textChunks.length === 0) {
      return { success: true, message: "No text to chunk." };
    }

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY!,
      modelName: "text-embedding-004",
    });

    // create rows without embeddings
    const created = await prisma.$transaction(
      textChunks.map((content) =>
        prisma.documentChunk.create({
          data: { content, pdfSummaryId },
        })
      )
    );

    const vectorStore = PrismaVectorStore.withModel<PrismaDocumentChunk>(prisma).create(
      embeddings,
      {
        prisma: Prisma,
        tableName: "DocumentChunk",
        vectorColumnName: "embedding",
        columns: {
          id: PrismaVectorStore.IdColumn,
          content: PrismaVectorStore.ContentColumn,
        },
      }
    );

    await vectorStore.addModels(created);

    console.log(`Embedded ${created.length} chunks for ${pdfSummaryId}`);
    return { success: true, count: created.length };
  } catch (error) {
    console.error("processAndEmbedDocument error:", error);
    throw error;
  }
}
