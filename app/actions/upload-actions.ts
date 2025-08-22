"use server";

import { authOptions } from "@/lib/auth";
import { generateSummaryFromGemini } from "@/lib/gemini";
import { fetchAndExtractText } from "@/lib/langchain";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { processAndEmbedDocument } from "./embed-actions";


export async function generateSummary(url: string) {
    if (!url) {
        return {
            success: false,
            message: "File upload failed or response is invalid",
            data: null,
        };
    }

    try {
        const pdfText = await fetchAndExtractText(url);
        console.log(pdfText);

        let summary: string | null = null;
        try {
            summary = await generateSummaryFromGemini(pdfText);
            console.log("summary", summary);
        } catch (error) {
            console.error("Summary generation failed: ", error);
        }

        if (!summary) {
            return {
                success: false,
                message: "Failed to generate summary",
                data: null,
            };
        }

        return {
            success: true,
            message: "Summary generated successfully",
            data: { summary, pdfText },
        };

    } catch (error) {
        console.error("Error generating summary:", error);
        return {
            success: false,
            message: "Failed to extract text from PDF",
            data: null,
        };
    }
}


export async function storePdfSummaryAction({
    fileUrl,
    summary,
    title,
    fileName,
    extractedText
}: {
    fileUrl: string;
    summary: string;
    title: string;
    fileName: string;
    extractedText: string;
}) {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;
        if (!user || !user.id) {
            return {
                success: false,
                message: "User not found",
            };
        }

        const savedPdfSummary = await prisma.pdfSummary.create({
            data: {
                userId: user.id,
                originalFileUrl: fileUrl,
                summaryText: summary,
                title,
                fileName,
                extractedText
            },
        });

        await processAndEmbedDocument(savedPdfSummary.id);
        
        console.log(`Kicked off embedding for PdfSummary ID: ${savedPdfSummary.id}`);

        return {
            success: true,
            message: "Summary saved successfully and embedding process started",
            data: savedPdfSummary,
        };
    } catch (error) {
        console.error("Error storing summary:", error);
        return {
            success: false,
            message: "Failed to store summary in db",
        };
    }
}