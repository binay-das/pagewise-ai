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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-10 dark:border-slate-800/60 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight dark:text-slate-50">
                Your Documents
              </h1>
              <p className="text-slate-600 text-sm dark:text-slate-400">
                Manage and organize your document collection
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <FileText className="h-4 w-4" />
                <span>{documents.length} documents</span>
              </div>
              
              <Button 
                asChild 
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Link href="/documents/new" className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">New Document</span>
                  <span className="sm:hidden">New</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="relative">
              <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <FileText className="h-16 w-16 text-slate-400 dark:text-slate-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <PlusCircle className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div className="text-center max-w-md">
              <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                No documents yet!
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Get started by uploading your first document. Create summaries, organize your files, and boost your productivity.
              </p>
              
              <Button 
                asChild 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Link href="/documents/new" className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Upload Your First Document
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Documents</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{documents.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {documents.map((d: any, index: number) => (
                <div 
                  key={d.id} 
                  className="transform transition-all duration-200 hover:scale-105 animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <DocumentCard document={d} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;