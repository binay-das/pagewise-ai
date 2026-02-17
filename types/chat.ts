export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt?: Date;
}

export interface ChatResponse {
    success: boolean;
    message?: string;
    data?: ChatMessage;
    error?: string;
}

export interface ChatRequest {
    documentId: string;
    messages: ChatMessage[];
}
