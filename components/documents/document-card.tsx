import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import { 
  FileText, 
  Calendar, 
  Clock, 
  ExternalLink,
  BookOpen,
  Layers
} from "lucide-react";
import { Badge } from "../ui/badge";

const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

const getFileTypeFromTitle = (title: string) => {
  const extension = title.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return { type: 'PDF', color: 'bg-red-100 text-red-700 border-red-200' };
    case 'doc':
    case 'docx':
      return { type: 'DOC', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    case 'txt':
      return { type: 'TXT', color: 'bg-gray-100 text-gray-700 border-gray-200' };
    default:
      return { type: 'FILE', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
};

const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months ago`;
  return `${Math.ceil(diffDays / 365)} years ago`;
};

export default function DocumentCard({ document }: { document: any }) {
  const createdDate = new Date(document.createdAt);
  const fileType = getFileTypeFromTitle(document.title);
  const wordCount = document.extractedText?.split(' ').length || 0;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute

  return (
    <Link href={`/documents/${document.id}`} className="block h-full group">
      <Card className="h-full flex flex-col bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-slate-300/60 transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors duration-200">
                {document.title}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge 
                variant="outline" 
                className={`text-xs font-medium ${fileType.color}`}
              >
                {fileType.type}
              </Badge>
              <div className="w-8 h-8 bg-slate-100 group-hover:bg-blue-50 rounded-lg flex items-center justify-center transition-colors duration-200">
                <FileText className="h-4 w-4 text-slate-600 group-hover:text-blue-600 transition-colors duration-200" />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-grow pb-4">
          <div className="space-y-4">
            <div className="relative">
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
                {document.extractedText 
                  ? truncateText(document.extractedText, 150)
                  : "No preview available for this document."
                }
              </p>
              {document.extractedText && document.extractedText.length > 150 && (
                <div className="absolute bottom-0 right-0 bg-gradient-to-l from-white/80 to-transparent pl-8 pr-2 py-1">
                  <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    Read more
                  </span>
                </div>
              )}
            </div>

            {wordCount > 0 && (
              <div className="flex items-center gap-4 text-xs text-slate-500">
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

        <CardFooter className="pt-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              <span>{getRelativeTime(createdDate)}</span>
            </div>
            
            <div className="flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-sm font-medium mr-1">Open</span>
              <ExternalLink className="h-4 w-4" />
            </div>
          </div>
        </CardFooter>

        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </Card>
    </Link>
  );
}
