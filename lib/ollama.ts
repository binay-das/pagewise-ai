import pLimit from "p-limit";
import { logger } from "@/lib/logger";
import { AI_CONFIG } from "@/lib/config";
import { applicationConfig } from "@/lib/config";

export const llmBaseUrl = applicationConfig.ai.baseUrl;
const EMBEDDING_CONCURRENCY = 5;
const SUMMARY_CONCURRENCY = 3;

const embeddingLimit = pLimit(EMBEDDING_CONCURRENCY);
const summaryLimit = pLimit(SUMMARY_CONCURRENCY);


export async function generateOllamaText(prompt: string, model: string = applicationConfig.ai.textModel) {
    logger.info({ model }, "Generating text with Ollama");
    const response = await fetch(`${llmBaseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model,
            prompt,
            stream: false,
        }),
    });

    if (!response.ok) {
        throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
}

export async function generateOllamaEmbeddings(text: string, model: string = applicationConfig.ai.embeddingModel) {
    const response = await fetch(`${llmBaseUrl}/api/embeddings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model,
            prompt: text,
        }),
    });

    if (!response.ok) {
        throw new Error(`Ollama embedding error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embedding;
}

export interface EmbeddingsInterface {
    embedDocuments(texts: string[]): Promise<number[][]>;
    embedQuery(text: string): Promise<number[]>;
}

export class OllamaEmbeddings implements EmbeddingsInterface {
    async embedDocuments(texts: string[]): Promise<number[][]> {
        return Promise.all(
            texts.map(text =>
                embeddingLimit(() => generateOllamaEmbeddings(text))
            )
        );
    }

    async embedQuery(text: string): Promise<number[]> {
        return generateOllamaEmbeddings(text);
    }
}

export async function streamOllamaChat(messages: { role: string; content: string }[], model: string = applicationConfig.ai.textModel) {
    logger.info({ model, messageCount: messages.length }, "Streaming chat with Ollama");
    const response = await fetch(`${llmBaseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model,
            messages,
            stream: true,
        }),
    });

    if (!response.ok || !response.body) {
        throw new Error(`Ollama chat error: ${response.statusText}`);
    }

    return response.body;
}

export const generateSummaryFromOllama = async (pdfText: string) => {
    try {
        const prompt = `
        Transform the following document into an engaging, easy-to-read summary.
        - Use clear sections
        - Add contextually relevant emojis
        - Use proper Markdown formatting

        Document:
        ${pdfText}
        `;

        const text = await generateOllamaText(prompt);

        if (!text) {
            throw new Error('Empty response from Ollama API');
        }

        return text;
    } catch (error) {
        logger.error({ error }, "Ollama API error during summary generation");
        throw error;
    }
};

export async function createOllamaStream(stream: ReadableStream) {
    const reader = stream.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    return new ReadableStream({
        async start(controller) {
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');
                    for (const line of lines) {
                        if (!line.trim()) continue;
                        try {
                            const json = JSON.parse(line);

                            if (json.done) {
                                controller.close();
                                return;
                            }

                            if (json.message?.content) {
                                controller.enqueue(encoder.encode(json.message.content));
                            }
                        } catch (e) {
                            logger.warn("Failed to parse Ollama stream chunk");
                        }
                    }
                }
            } catch (error) {
                controller.error(error);
            } finally {
                controller.close();
            }
        },
    });
}








export async function generateSafeSummary(fullExtractedText: string) {
    const chunkSize = AI_CONFIG.CHUNK_SIZE;
    const chunks = [];

    for (let i = 0; i < fullExtractedText.length; i += chunkSize) {
        chunks.push(fullExtractedText.slice(i, i + chunkSize));
    }

    const partialSummaries = await Promise.all(
        chunks.map(chunk =>
            summaryLimit(() =>
                generateOllamaText(`Extract key points:\n${chunk}`)
            )
        )
    );

    return generateOllamaText(`
        Combine the following section summaries into a single clear summary.
        Use Markdown and relevant emojis.

        SUMMARIES:
        ${partialSummaries.join("\n")}
    `);
}
