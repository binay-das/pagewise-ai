
export type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

export interface AIProvider {
    readonly name: string;

    embedDocuments(texts: string[]): Promise<number[][]>;

    embedQuery(text: string): Promise<number[]>;

    streamChat(messages: ChatMessage[]): Promise<ReadableStream>;

    generateText(prompt: string): Promise<string>;
}
