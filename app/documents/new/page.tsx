"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { useEdgeStore } from "@/lib/edgestore";
import { uploadPdfToMinio } from "@/lib/object-storage.upload";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateSummary, storePdfSummaryAction } from "@/app/actions/upload-actions";
import {
  Upload,
  FileText,
  Loader2
} from "lucide-react";
import { logger } from "@/lib/logger";
import { UI_CONFIG } from "@/lib/config";
import { toast } from "sonner";

export default function NewDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        toast.error("Please select a PDF file.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a PDF file.");
      return;
    }

    setIsLoading(true);

    let res: { key: string; url: string } | null = null;

    try {
      toast.info("Uploading...");

      res = await uploadPdfToMinio(file);
      logger.info("PDF uploaded successfully");
      const { key, url } = res;

      toast.info("Processing with AI...");
      const summaryRes = await generateSummary(key);

      if (!summaryRes.success) {
        throw new Error(summaryRes.error);
      }

      toast.info("Saving...");
      const saved = await storePdfSummaryAction({
        fileUrl: url,
        summary: summaryRes.data.summary,
        extractedText: summaryRes.data.pdfText,
        title: file.name.replace(/\.pdf$/i, ""),
        fileName: file.name,
      });

      if (!saved.success) {
        throw new Error(saved.error);
      }

      toast.success("Processing complete!");

      setTimeout(() => {
        router.push(`/documents/${saved.data.id}`);
      }, UI_CONFIG.REDIRECT_DELAY_LONG);

    } catch (error) {
      logger.error({ error }, "Upload error");

      if (res && res.key) {
        try {
          // await edgestore.publicFiles.delete({ url: uploadedUrl });
          logger.info("File deleted from storage due to failure");
        } catch (deleteError) {
          logger.error({ error: deleteError }, "Failed to delete file from storage");
        }
      }

      toast.error(error instanceof Error ? error.message : "Upload failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-neutral-200 dark:border-neutral-800 shadow-sm">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-900 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-6 h-6 text-neutral-900 dark:text-white" />
            </div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
              Upload PDF
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Transform your document into an AI chat partner
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label
                htmlFor="file-upload"
                className={`
                  block w-full p-8 border border-dashed rounded-lg cursor-pointer transition-all duration-200
                  ${file
                    ? "border-neutral-900 bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-100"
                    : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  }
                  ${isLoading ? "pointer-events-none opacity-50" : ""}
                `}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isLoading}
                />

                <div className="text-center">
                  {!file ? (
                    <>
                      <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-3" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                        Click to select PDF file
                      </p>
                    </>
                  ) : (
                    <>
                      <FileText className="w-6 h-6 text-neutral-900 dark:text-white mx-auto mb-3" />
                      <p className="font-medium text-sm text-neutral-900 dark:text-white truncate px-4">
                        {file.name}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  )}
                </div>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 transition-all duration-200"
              disabled={!file || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Process Document
                </>
              )}
            </Button>
          </form>

          {file && !isLoading && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground leading-relaxed text-center">
                AI will analyze your PDF and create a searchable knowledge base.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
