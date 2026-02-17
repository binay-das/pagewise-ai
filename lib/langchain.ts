import pdf from "pdf-parse";

export type PdfMetadata = {
    title?: string;
    author?: string;
    creationDate?: Date;
    keywords?: string;
};

export type PdfExtraction = {
    text: string;
    metadata: PdfMetadata;
};

export async function extractTextFromPdf(pdfBuffer: Buffer): Promise<PdfExtraction> {
    const data = await pdf(pdfBuffer);

    return {
        text: data.text,
        metadata: {
            title: data.info?.Title || undefined,
            author: data.info?.Author || undefined,
            creationDate: data.info?.CreationDate
                ? parsePdfDate(data.info.CreationDate)
                : undefined,
            keywords: data.info?.Keywords || undefined,
        },
    };
}

function parsePdfDate(pdfDate: string): Date | undefined {
    try {
        const match = pdfDate.match(/D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
        if (!match) return undefined;

        const [, year, month, day, hour, minute, second] = match;
        return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
    } catch {
        return undefined;
    }
}