import { authOptions } from "@/lib/auth";
import { getDocumentById } from "@/lib/document";
import { getServerSession } from "next-auth";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
} from "lucide-react";
import { DocumentDashboard } from "@/components/document-dashboard";

export default async function DocumentPage(props: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const { id } = await props.params;

  const document = await getDocumentById(id, user?.id as string);
  if (!document) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background">
        <div className="text-center p-4 max-w-md">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            Document Not Found
          </h1>
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
            The document doesn&apos;t exist or you don&apos;t have access to it.
          </p>
          <Link
            href="/documents"
            className="inline-flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DocumentDashboard document={document} />
  );
}
