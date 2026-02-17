"use client";

import { logger } from "@/lib/logger";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
    text: string;
    className?: string;
}

export const CopyButton = ({ text, className = "" }: CopyButtonProps) => {
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success("Copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (_error) {
            logger.error({ error: _error }, "Failed to copy");
            toast.error("Failed to copy");
        }
    };

    return (
        <Button
            onClick={handleCopy}
            className={`p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer ${className}`}
            aria-label="Copy to clipboard"
            type="button"
        >
            {copied ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
                <Copy className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            )}
        </Button>
    );
};
