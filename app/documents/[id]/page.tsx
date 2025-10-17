import { authOptions } from "@/lib/auth";
import { getDocumentById } from "@/lib/document";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatInterface } from "@/components/chat/chat-interface";
import {
  ArrowLeft,
  FileText,
  MessageSquare,
  FileCheck,
  Brain,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export default async function DocumentPage(props: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const { id } = await props.params;

  const document = await getDocumentById(id, user?.id as string);
  if (!document) {
    return (
        <div className="flex flex-1 items-center justify-center bg-gray-50 dark:bg-slate-950">
          <div className="text-center p-4 max-w-md">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              Document Not Found
            </h1>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
              The document doesn't exist or you don't have access to it.
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
    <div className="flex flex-1 gap-4 bg-gray-50 dark:bg-slate-950 h-full">
      <div className="w-1/3 flex flex-col border-r border-gray-200 dark:border-slate-800 relative">
        <Link
          href="/documents"
          className="absolute top-2 left-2 z-10 inline-flex items-center space-x-1 bg-white/90 dark:bg-slate-900/90 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 px-2 py-1 rounded text-xs transition-colors shadow-sm"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Back</span>
        </Link>
        <iframe
          src={`${document.originalFileUrl}#zoom=page-fit`}
          className="flex-1 w-full border-0"
          title={document.title ?? "PDF Document"}
        />
      </div>

       <div className="w-2/3 flex flex-col">
         <Tabs defaultValue="chat" className="flex-1 flex flex-col">
           <TabsList className="grid w-full grid-cols-3 rounded-none bg-gray-100 dark:bg-slate-900 p-0 h-10 flex-shrink-0 border-b border-slate-800">
             <TabsTrigger
               value="chat"
               className="flex items-center space-x-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-cyan-400 text-xs transition-all rounded-none"
             >
               <MessageSquare className="w-3 h-3" />
               <span>Chat</span>
             </TabsTrigger>
             <TabsTrigger
               value="summary"
               className="flex items-center space-x-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-violet-400 text-xs transition-all rounded-none"
             >
               <Brain className="w-3 h-3" />
               <span>Summary</span>
             </TabsTrigger>
             <TabsTrigger
               value="extracted"
               className="flex items-center space-x-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-emerald-400 text-xs transition-all rounded-none"
             >
               <FileCheck className="w-3 h-3" />
               <span>Extract</span>
             </TabsTrigger>
           </TabsList>

           <TabsContent
             value="chat"
             className="flex-1 p-0 m-0 data-[state=inactive]:hidden overflow-hidden"
           >
             <div className="h-full flex flex-col">
               <div className="flex-shrink-0 p-3 border-b border-gray-200 dark:border-slate-800 bg-blue-50/50 dark:bg-slate-900/50">
                 <div className="flex items-center space-x-2 mb-1">
                   <MessageSquare className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
                   <h3 className="text-sm font-medium text-gray-900 dark:text-slate-100">
                     AI Assistant
                   </h3>
                 </div>
                 <p className="text-xs text-gray-600 dark:text-slate-400">
                   Ask questions about your document
                 </p>
               </div>
               <div className="flex-1 overflow-hidden">
                 <ChatInterface documentId={id} />
               </div>
             </div>
           </TabsContent>

           <TabsContent
             value="summary"
             className="flex-1 p-0 m-0 data-[state=inactive]:hidden overflow-hidden"
           >
             <div className="h-full flex flex-col">
               <div className="flex-shrink-0 p-3 border-b border-gray-200 dark:border-slate-800 bg-purple-50/50 dark:bg-slate-900/50">
                 <div className="flex items-center space-x-2 mb-1">
                   <Brain className="w-3 h-3 text-purple-600 dark:text-violet-400" />
                   <h3 className="text-sm font-medium text-gray-900 dark:text-slate-100">
                     AI Summary
                   </h3>
                 </div>
                 <p className="text-xs text-gray-600 dark:text-slate-400">
                   Key insights extracted from document
                 </p>
               </div>
               <div className="flex-1 overflow-y-auto">
                 <div className="p-3">
                   <div className="prose prose-xs dark:prose-invert max-w-none">
                     <MarkdownRenderer content={document.summaryText} />
                   </div>
                 </div>
               </div>
             </div>
           </TabsContent>

           <TabsContent
             value="extracted"
             className="flex-1 p-0 m-0 data-[state=inactive]:hidden overflow-hidden"
           >
             <div className="h-full flex flex-col">
               <div className="flex-shrink-0 p-3 border-b border-gray-200 dark:border-slate-800 bg-green-50/50 dark:bg-slate-900/50">
                 <div className="flex items-center space-x-2 mb-1">
                   <FileCheck className="w-3 h-3 text-green-600 dark:text-emerald-400" />
                   <h3 className="text-sm font-medium text-gray-900 dark:text-slate-100">
                     Raw Content
                   </h3>
                 </div>
                 <p className="text-xs text-gray-600 dark:text-slate-400">
                   Complete extracted text content
                 </p>
               </div>
               <div className="flex-1 overflow-y-auto">
                 <div className="p-3">
                   <div className="bg-gray-50 dark:bg-slate-900/50 rounded p-3 border border-gray-200 dark:border-slate-800">
                     <pre className="text-xs whitespace-pre-wrap font-mono text-gray-700 dark:text-slate-300 leading-relaxed">
                       {document.extractedText}
                     </pre>
                   </div>
                 </div>
               </div>
             </div>
           </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
