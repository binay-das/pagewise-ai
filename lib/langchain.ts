import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function extractTextFromPdf(pdfBuffer: Buffer) {
    const blob = new Blob([pdfBuffer as any]);

    const loader = new PDFLoader(blob);

    const docs = await loader.load();

    return docs.map((doc) => doc.pageContent).join("\n");
}