"use server";

import { CoreMessage } from "ai";
import { getAIProvider } from "@/lib/ai";
import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { Prisma } from "@prisma/client";
import type { DocumentChunk as PrismaDocumentChunk } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AI_CONFIG } from "@/lib/config";

const aiProvider = getAIProvider();

export async function askQuestionAction(
  messages: CoreMessage[],
  documentId: string
) {
  const lastUserMessage = messages[messages.length - 1];
  const question = lastUserMessage.content as string;

  /*
  // Old Supabase Logic
  const vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabaseClient,
    tableName: "DocumentChunk",
    queryName: "match_documents",
  });

  const relevantDocs = await vectorStore.similaritySearch(question, 4, {
    pdfSummaryId: documentId,
  });
  */

  const vectorStore = PrismaVectorStore.withModel<PrismaDocumentChunk>(prisma).create(
    aiProvider,
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

  const relevantDocs = await vectorStore.similaritySearch(question, AI_CONFIG.SIMILARITY_SEARCH_LIMIT, {
    pdfSummaryId: { equals: documentId }
  });

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
            await prisma.message.create({
              data: {
                role: "assistant",
                content: fullResponse,
                pdfSummaryId: documentId,
              },
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
