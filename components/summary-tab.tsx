"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Loader2, Sparkles } from "lucide-react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

interface SummaryTabProps {
    documentId: string;
    initialSummary: string | null;
    extractedText: string | null;
}

export function SummaryTab({ documentId, initialSummary, extractedText }: SummaryTabProps) {
    const [summary, setSummary] = useState(initialSummary || "");
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hasSummary = summary && summary.trim().length > 0;

    const generateSummary = async () => {
        if (!extractedText || !extractedText.trim()) {
            setError("No extracted text available to generate summary");
            return;
        }

        setIsGenerating(true);
        setError(null);
        setSummary("");

        try {
            const response = await fetch(`/api/documents/${documentId}/generate-summary`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to generate summary");
            }

            if (!response.body) {
                throw new Error("No response body");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedSummary = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedSummary += chunk;
                setSummary(accumulatedSummary);
            }

            setIsGenerating(false);
        } catch (err) {
            console.error("Error generating summary:", err);
            setError("Failed to generate summary. Please try again.");
            setIsGenerating(false);
        }
    };

    return (
        <div className="h-full flex flex-col overflow-y-auto">
            <div className="p-4 md:p-6 max-w-3xl mx-auto w-full">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Thinking Summary</h3>
                        <p className="text-sm text-muted-foreground">AI-generated insights</p>
                    </div>
                </div>

                {!hasSummary && !isGenerating && (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-full mb-4">
                            <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h4 className="text-lg font-medium mb-2">No Summary Yet</h4>
                        <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                            Generate an AI-powered summary of this document to quickly understand its key points and insights.
                        </p>
                        <Button
                            onClick={generateSummary}
                            className="gap-2"
                            size="lg"
                        >
                            <Sparkles className="w-4 h-4" />
                            Generate AI Summary
                        </Button>
                        {error && (
                            <p className="text-sm text-red-500 mt-4">{error}</p>
                        )}
                    </div>
                )}

                {isGenerating && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400 mb-4" />
                        <p className="text-sm text-muted-foreground mb-6">Generating summary...</p>
                        {summary && (
                            <div className="prose prose-sm dark:prose-invert max-w-none w-full">
                                <MarkdownRenderer content={summary} />
                            </div>
                        )}
                    </div>
                )}

                {hasSummary && !isGenerating && (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <MarkdownRenderer content={summary} />
                    </div>
                )}
            </div>
        </div>
    );
}
