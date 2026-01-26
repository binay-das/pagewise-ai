"use server";

import { CoreMessage } from "ai";
// import { createGoogleGenerativeAI } from "@ai-sdk/google";
// import { createClient } from "@supabase/supabase-js";
// import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { streamOllamaChat, createOllamaStream, OllamaEmbeddings } from "@/lib/ollama";
import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { Prisma } from "@prisma/client";
import type { DocumentChunk as PrismaDocumentChunk } from "@prisma/client";
import { prisma } from "@/lib/prisma";


// const google = createGoogleGenerativeAI({
//   apiKey: process.env.GEMINI_API_KEY!,
// });

// const supabaseClient = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_KEY!
// );

// const embeddings = new GoogleGenerativeAIEmbeddings({
//   apiKey: process.env.GEMINI_API_KEY!,
//   modelName: "text-embedding-004",
// });

const embeddings = new OllamaEmbeddings();

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

  const relevantDocs = await vectorStore.similaritySearch(question, 4, {
    pdfSummaryId: { equals: documentId }
  });

  const context = relevantDocs.map((doc) => doc.pageContent).join("\n\n---\n\n");

  const ollamaMessages = [
    {
      role: "system",
      content:
        "You are a helpful AI assistant for the PageWise app. " +
        "Answer ONLY using the provided context. " +
        "If the answer is not found, say: 'I couldn't find an answer to that in the document.'"
    },
    {
      role: "user",
      content: `
      CONTEXT:
      ${context}

      QUESTION:
      ${question}
    `
    }
  ];


  const stream = await streamOllamaChat(ollamaMessages);
  if (!stream) throw new Error("Failed to get stream from Ollama");

  const customStream = await createOllamaStream(stream);

  return new Response(customStream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
