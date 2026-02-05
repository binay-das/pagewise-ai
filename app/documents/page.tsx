import DocumentCard from "@/components/documents/document-card";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getDocuments } from "@/lib/documents";
import { PlusCircle, FileText } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    redirect("/signin");
  }

  const documents = await getDocuments(user.id as string);

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                Documents
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-3 py-1.5 rounded-full">
                <FileText className="h-3.5 w-3.5" />
                <span>{documents.length} files</span>
              </div>

              <Button
                asChild
                size="sm"
                className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 shadow-sm transition-all duration-200 rounded-full px-4"
              >
                <Link href="/documents/new" className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>New Document</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6">
            <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-900 rounded-2xl flex items-center justify-center mb-6 border border-neutral-100 dark:border-neutral-800">
              <FileText className="h-8 w-8 text-neutral-400 dark:text-neutral-600" />
            </div>

            <div className="text-center max-w-sm">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                No documents yet
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed">
                Upload your first document to get started.
              </p>

              <Button
                asChild
                className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-full px-6"
              >
                <Link href="/documents/new" className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Upload Document
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {documents.map((d: any, index: number) => (
              <div
                key={d.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <DocumentCard document={d} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;