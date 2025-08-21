import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function fetchAndExtractText(fileUrl: string) {
    const response = await fetch(fileUrl);
    const blob = await response.blob();

    const loader = new PDFLoader(blob);

    const docs = await loader.load();

    return docs.map((doc) => doc.pageContent).join("\n");
}