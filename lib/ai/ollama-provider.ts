import { AIProvider } from './provider';
import { OllamaEmbeddings, streamOllamaChat, createOllamaStream, generateOllamaText } from '@/lib/ollama';

export class OllamaProvider implements AIProvider {
    readonly name = 'ollama';
    readonly dimensions = 768; 
    readonly vectorColumnName = 'embedding_ollama';
    
    async embedDocuments(texts: string[]): Promise<number[][]> {
        const embeddings = new OllamaEmbeddings();
        return embeddings.embedDocuments(texts);
    }

    async embedQuery(text: string): Promise<number[]> {
        const embeddings = new OllamaEmbeddings();
        return embeddings.embedQuery(text);
    }

    async streamChat(messages: Array<{ role: string; content: string }>): Promise<ReadableStream> {
        const stream = await streamOllamaChat(messages);
        return createOllamaStream(stream);
    }

    async generateText(prompt: string): Promise<string> {
        return generateOllamaText(prompt);
    }
}
