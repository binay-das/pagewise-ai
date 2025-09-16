import { authOptions } from "@/lib/auth";
import { getDocumentById } from "@/lib/document";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Document not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The document you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have access to it.
          </p>
          <Link
            href="/documents"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Documents</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/documents"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h1
              className="text-2xl font-bold text-gray-900 dark:text-white truncate"
              title={document.title ?? ""}
            >
              {document.title}
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="w-1/2 p-4">
          <Card className="h-full shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Original Document</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-4rem)]">
              <iframe
                src={document.originalFileUrl}
                className="w-full h-full border-0 rounded-b-lg"
                title={document.title ?? "PDF Document"}
              />
            </CardContent>
          </Card>
        </div>

        <div className="w-1/2 p-4 pl-2">
          <Card className="h-full shadow-lg">
            <CardContent className="p-0 h-full">
              <Tabs defaultValue="chat" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-3 rounded-none rounded-t-lg bg-gray-100 dark:bg-gray-800 overflow-auto">
                  <TabsTrigger
                    value="chat"
                    className="flex items-center space-x-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="summary"
                    className="flex items-center space-x-2"
                  >
                    <Brain className="w-4 h-4" />
                    <span>Summary</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="extracted"
                    className="flex items-center space-x-2"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Extracted Text</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="chat"
                  className="flex-1 p-0 m-0 data-[state=inactive]:hidden overflow-auto"
                >
                  <div className="h-full">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Chat with Document
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ask questions about your document and get instant
                        answers
                      </p>
                    </div>
                    <div className="h-[calc(100%-5rem)]">
                      <ChatInterface documentId={id} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="summary"
                  className="flex-1 p-0 m-0 data-[state=inactive]:hidden overflow-auto"
                >
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        AI Generated Summary
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Key insights and main points from your document
                      </p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      {/* <div className="prose prose-sm dark:prose-invert max-w-none"> */}
                      {/* <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300 leading-relaxed"> */}
                      <MarkdownRenderer content={document.summaryText} />
                      {/* </pre> */}
                      {/* </div> */}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="extracted"
                  className="flex-1 p-0 m-0 data-[state=inactive]:hidden overflow-auto"
                >
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Extracted Text
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Complete text content extracted from your PDF
                      </p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <pre className="text-xs whitespace-pre-wrap font-mono text-gray-600 dark:text-gray-400 leading-relaxed">
                        {document.extractedText}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
