"use client";

import { Download, FileDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportAsMarkdown, exportAsPDF } from "@/lib/export-chat";
import { toast } from "sonner";

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

interface ExportChatButtonProps {
    messages: Message[];
    documentTitle: string;
}

export const ExportChatButton = ({ messages, documentTitle }: ExportChatButtonProps) => {
    const handleExportPDF = () => {
        try {
            exportAsPDF(messages, documentTitle);
            toast.success("Chat exported as PDF!");
        } catch (error) {
            toast.error("Failed to export chat as PDF");
            console.error("Export PDF error:", error);
        }
    };

    const handleExportMarkdown = () => {
        try {
            exportAsMarkdown(messages, documentTitle);
            toast.success("Chat exported as Markdown!");
        } catch (error) {
            toast.error("Failed to export chat as Markdown");
            console.error("Export Markdown error:", error);
        }
    };

    if (messages.length === 0) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    aria-label="Export chat"
                >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
                    <FileDown className="w-4 h-4" />
                    Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportMarkdown} className="gap-2 cursor-pointer">
                    <FileText className="w-4 h-4" />
                    Export as Markdown
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
