"use server";

import { CoreMessage, streamText } from "ai";
// import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { streamOllamaChat, createOllamaStream, OllamaEmbeddings } from "@/lib/ollama";


// const google = createGoogleGenerativeAI({
//   apiKey: process.env.GEMINI_API_KEY!,
// });

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

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

  const vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabaseClient,
    tableName: "DocumentChunk",
    queryName: "match_documents",
  });

  const relevantDocs = await vectorStore.similaritySearch(question, 4, {
    pdfSummaryId: documentId,
  });

  const context = relevantDocs.map((doc) => doc.pageContent).join("\n\n---\n\n");

  // const prompt = `You are a helpful AI assistant for the PageWise app. Your task is to answer the user's question based ONLY on the provided context from their uploaded document.
  
  // If the answer is not found in the context, clearly state "I couldn't find an answer to that in the document." Do not use any external knowledge or make up information.
  
  // CONTEXT FROM THE DOCUMENT:
  // ---
  // ${context}
  // ---
  
  // USER'S QUESTION:
  // ${question}`;

  // const result = await streamText({
  //   model: google("models/gemini-2.0-flash"),
  //   prompt,
  // });

  // return result.toTextStreamResponse();

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
