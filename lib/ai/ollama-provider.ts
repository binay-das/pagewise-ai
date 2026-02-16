import { AIProvider, ChatMessage } from './provider';
import {
    generateOllamaText,
    generateOllamaEmbeddings,
    streamOllamaChat,
    createOllamaStream,
    OllamaEmbeddings,
} from '@/lib/ollama';

export class OllamaProvider implements AIProvider {
    readonly name = 'ollama';

    async embedDocuments(texts: string[]): Promise<number[][]> {
        const embeddings = new OllamaEmbeddings();
        return embeddings.embedDocuments(texts);
    }

    async embedQuery(text: string): Promise<number[]> {
        return generateOllamaEmbeddings(text);
    }

    async streamChat(messages: ChatMessage[]): Promise<ReadableStream> {
        const ollamaMessages = messages.map(msg => ({
            role: msg.role,
            content: msg.content,
        }));

        const stream = await streamOllamaChat(ollamaMessages);
        return createOllamaStream(stream);
    }

    async generateText(prompt: string): Promise<string> {
        return generateOllamaText(prompt);
    }
}
