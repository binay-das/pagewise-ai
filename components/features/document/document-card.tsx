import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ExternalLink,
  Layers,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Document } from "@/types/document";

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

export default function DocumentCard({ document }: { document: Document }) {
  const createdDate = new Date(document.createdAt);
  const fileType = getFileTypeFromTitle(
    document.title || document.fileName || ""
  );
  const wordCount = document.wordCount || 0;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <Link href={`/documents/${document.id}`} className="block h-full group">
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className="h-full flex flex-col bg-card border border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md transition-all duration-200 overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-medium text-neutral-900 dark:text-neutral-50 truncate group-hover:text-black dark:group-hover:text-white transition-colors duration-200">
                  {document.title || document.fileName}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0.5 font-normal border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 bg-transparent"
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

              {/* Metadata section */}
              {(document.author || document.creationDate) && (
                <div className="flex flex-wrap items-center gap-2 text-[10px] text-neutral-400 dark:text-neutral-500">
                  {document.author && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="truncate max-w-[120px]">{document.author}</span>
                    </div>
                  )}
                  {document.creationDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(document.creationDate).toLocaleDateString()}</span>
                    </div>
                  )}
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

              <motion.div
                initial={{ opacity: 0, x: -5 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="flex items-center text-neutral-900 dark:text-white"
              >
                <ExternalLink className="h-3 w-3" />
              </motion.div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
}
