"use server";

import { generateSummaryFromGemini } from "@/lib/gemini";
import { fetchAndExtractText } from "@/lib/langchain";

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