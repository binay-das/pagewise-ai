export interface Document {
    id: string;
    title: string;
    fileName: string;
    fileUrl: string;
    summaryText?: string;
    extractedText?: string;
    createdAt: Date;
    updatedAt: Date;
    embeddingProvider: string;
}

export interface UploadResponse {
    success: boolean;
    data?: {
        id: string;
        url: string;
        key: string;
    };
    error?: string;
}
