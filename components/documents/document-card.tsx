import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";

const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

export default function DocumentCard({ document }: { document: any }) {
  return (
    <Link href={`/documents/${document.id}`} className="block h-full">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="truncate">{document.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          {truncateText(document.extractedText, 120)}
        </CardContent>
        <CardFooter>
          Created on {new Date(document.createdAt).toLocaleDateString()}
        </CardFooter>
      </Card>
    </Link>
  );
}
