"use client";

import { Button } from "@/components/ui/button";
import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";
import { generateSummary, storePdfSummaryAction } from "@/app/actions/upload-actions";

export default function NewDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const { edgestore } = useEdgeStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setMessage("Uploading...");

    // const formData = new FormData();
    // formData.append("file", file);

    console.log(file);

    const res = await edgestore.publicFiles.upload({ file });

    console.log(res);

    setMessage("Uploaded");
    const summaryRes = await generateSummary(res.url);
    if (!summaryRes.success || !summaryRes.data?.summary) {
      throw new Error("Failed to generate summary.");
    }

    // save summary and user data
    const saved = await storePdfSummaryAction({
      fileUrl: res.url,
      summary: summaryRes.data.summary,
      extractedText: summaryRes.data.pdfText,
      title: file.name.replace(/\.pdf$/i, ""),
      fileName: file.name,
    });

    console.log("Saved: ", saved);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1>Upload a PDF</h1>
      <form onSubmit={handleSubmit}>
        <p>Please select a PDF file:</p>
        <input
          type="file"
          accept=".pdf"
          className="block"
          onChange={handleFileChange}
        />
        <Button type="submit">Upload File</Button>
      </form>

      {file && (
        <p>
          <b>Selected file:</b> {file.name}
        </p>
      )}

      {message && (
        <p>
          <b>Status:</b> {message}
        </p>
      )}
    </div>
  );
}
