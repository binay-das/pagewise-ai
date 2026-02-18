"use server";

import { CoreMessage } from "ai";
import { getProviderByName } from "@/lib/ai";
import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { Prisma } from "@prisma/client";
import type { DocumentChunk as PrismaDocumentChunk } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AI_CONFIG } from "@/lib/config";
import { enqueueMessage } from "@/lib/message-queue";

export async function askQuestionAction(
  messages: CoreMessage[],
  documentId: string
) {
  const lastUserMessage = messages[messages.length - 1];
  const question = lastUserMessage.content as string;

  const document = await prisma.pdfSummary.findUnique({
    where: { id: documentId },
    select: { embeddingProvider: true, title: true },
  });

  if (!document) {
    throw new Error("Document not found");
  }

  const aiProvider = getProviderByName(document.embeddingProvider);

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

  let relevantDocs;
  try {
    relevantDocs = await vectorStore.similaritySearch(question, AI_CONFIG.SIMILARITY_SEARCH_LIMIT, {
      pdfSummaryId: { equals: documentId }
    });
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string };
    if (err.message?.includes('dimensions') || err.code === 'P2010') {
      const expectedDims = document.embeddingProvider === 'gemini' ? 3072 : 768;
      throw new Error(
        `AI Provider Incompatibility Error\n\n` +
        `This document "${document.title || 'Untitled'}" was embedded using ${document.embeddingProvider.toUpperCase()}, ` +
        `which uses ${expectedDims}-dimensional vectors.\n\n` +
        `The current AI provider configuration might not match. ` +
        `Please ensure AI_PROVIDER in your .env matches the provider used to embed this document.\n\n` +
        `Quick fix: Set AI_PROVIDER=${document.embeddingProvider} in your .env file and restart the server.`
      );
    }

    throw error;
  }

  const context = relevantDocs.map((doc) => doc.pageContent).join("\n\n---\n\n");

  const chatMessages = [
    {
      role: "system" as const,
      content:
        "You are a helpful AI assistant for the PageWise app. " +
        "Answer ONLY using the provided context. " +
        "If the answer is not found, say: 'I couldn't find an answer to that in the document.'"
    },
    {
      role: "user" as const,
      content: `
      CONTEXT:
      ${context}

      QUESTION:
      ${question}
    `
    }
  ];

  const stream = await aiProvider.streamChat(chatMessages);
  if (!stream) throw new Error("Failed to get stream from AI provider");

  let fullResponse = "";
  const reader = stream.getReader();
  const encoder = new TextEncoder();

  const savableStream = new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            enqueueMessage({
              role: "assistant",
              content: fullResponse,
              pdfSummaryId: documentId,
            });
            controller.close();
            break;
          }

          const chunk = new TextDecoder().decode(value);
          fullResponse += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (error) {
        controller.error(error);
      }
    }
  });

  return new Response(savableStream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
