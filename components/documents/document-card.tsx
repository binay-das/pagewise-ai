import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  FileText,
  Calendar,
  Clock,
  ExternalLink,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

const getFileTypeFromTitle = (title: string) => {
  const extension = title.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return {
        type: "PDF",
        color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
      };
    case "doc":
    case "docx":
      return {
        type: "DOC",
        color:
          "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
      };
    case "txt":
      return {
        type: "TXT",
        color:
          "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
      };
    default:
      return {
        type: "FILE",
        color:
          "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
      };
  }
};

const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return `${diffDays} days ago`;
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months ago`;

  return `${Math.ceil(diffDays / 365)} years ago`;
};

export default function DocumentCard({ document }: { document: any }) {
  const createdDate = new Date(document.createdAt);
  const fileType = getFileTypeFromTitle(
    document.title || document.fileName || ""
  );
  const wordCount = document.extractedText?.split(" ").length || 0;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <Link href={`/documents/${document.id}`} className="block h-full group">
      <Card className="h-full flex flex-col bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-200 group-hover:-translate-y-0.5 overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold text-neutral-900 dark:text-neutral-50 truncate group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors duration-200">
                {document.title || document.fileName}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0.5 font-medium border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900`}
              >
                {fileType.type}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-grow p-4 pt-2">
          <div className="space-y-3">
            <div className="relative h-16">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
                {document.summaryText
                  ? truncateText(document.summaryText, 120)
                  : "No summary available for this document."}
              </p>
            </div>

            {wordCount > 0 && (
              <div className="flex items-center gap-3 text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                <div className="flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  <span>{wordCount.toLocaleString()} words</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 border-t-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
              <Calendar className="h-3 w-3" />
              <span>{getRelativeTime(createdDate)}</span>
            </div>

            <div className="flex items-center text-neutral-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <ExternalLink className="h-3 w-3" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
