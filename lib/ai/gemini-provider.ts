import { logger } from '@/lib/logger';
import { generateText, streamText } from 'ai';
import { AIProvider, ChatMessage } from './provider';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';


export class GeminiProvider implements AIProvider {
    readonly name = 'gemini';
    private readonly google: ReturnType<typeof createGoogleGenerativeAI>;
    private readonly embeddings: GoogleGenerativeAIEmbeddings;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error('GEMINI_API_KEY environment variable is required for Gemini provider');
        }

        this.google = createGoogleGenerativeAI({ apiKey });
        this.embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey,
            modelName: 'gemini-embedding-001',
        });
    }

    async embedDocuments(texts: string[]): Promise<number[][]> {
        return this.embeddings.embedDocuments(texts);
    }

    async embedQuery(text: string): Promise<number[]> {
        return this.embeddings.embedQuery(text);
    }

    async streamChat(messages: ChatMessage[]): Promise<ReadableStream> {
        const model = this.google('models/gemini-2.0-flash');

        const geminiMessages = messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : msg.role,
            content: msg.content,
        }));

        const result = await streamText({
            model,
            messages: geminiMessages as any,
        });

        return result.toTextStreamResponse().body!;
    }

    async generateText(prompt: string): Promise<string> {
        const model = this.google('models/gemini-2.0-flash');

        try {
            const { text } = await generateText({
                model,
                prompt,
                temperature: 0.7,
                maxOutputTokens: 1500,
            });

            if (!text) {
                throw new Error('Empty response from Gemini API');
            }

            return text;
        } catch (error) {
            logger.error({ error }, 'Gemini API error');
            throw error;
        }
    }
}
