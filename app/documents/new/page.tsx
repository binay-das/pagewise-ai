"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateSummary, storePdfSummaryAction } from "@/app/actions/upload-actions";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2
} from "lucide-react";

export default function NewDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const { edgestore } = useEdgeStore();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setMessage("Please select a PDF file.");
        setStatus("error");
        return;
      }
      setFile(selectedFile);
      setStatus("idle");
      setMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a PDF file.");
      setStatus("error");
      return;
    }

    setIsLoading(true);
    setStatus("idle");

    try {
      setMessage("Uploading...");
      const res = await edgestore.publicFiles.upload({ file });

      setMessage("Processing with AI...");
      const summaryRes = await generateSummary(res.url);
      
      if (!summaryRes.success || !summaryRes.data?.summary) {
        throw new Error("Failed to generate summary.");
      }

      setMessage("Saving...");
      const saved = await storePdfSummaryAction({
        fileUrl: res.url,
        summary: summaryRes.data.summary,
        extractedText: summaryRes.data.pdfText,
        title: file.name.replace(/\.pdf$/i, ""),
        fileName: file.name,
      });

      if (!saved.success || !saved.data) {
        throw new Error(saved.message || "Failed to save document");
      }

      setStatus("success");
      setMessage("Processing complete!");
      
      setTimeout(() => {
        router.push(`/documents/${saved.data.id}`);
      }, 1000);

    } catch (error) {
      console.error("Upload error:", error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Upload failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Upload PDF
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Transform your document into an AI chat partner
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label 
                htmlFor="file-upload" 
                className={`
                  block w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                  ${file 
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-400 bg-gray-50 dark:bg-gray-800"
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
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Click to select PDF file
                      </p>
                    </>
                  ) : (
                    <>
                      <FileText className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  )}
                </div>
              </label>
            </div>

            {message && (
              <div className={`
                flex items-center space-x-2 p-3 rounded-lg
                ${status === "success" 
                  ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200" 
                  : status === "error"
                  ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                  : "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200"
                }
              `}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : status === "success" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : status === "error" ? (
                  <AlertCircle className="w-4 h-4" />
                ) : null}
                <span className="text-sm font-medium">{message}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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

          {file && !isLoading && status === "idle" && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Next:</strong> AI will analyze your PDF and create a searchable knowledge base for intelligent conversations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
