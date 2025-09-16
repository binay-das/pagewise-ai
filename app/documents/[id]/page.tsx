import { authOptions } from "@/lib/auth";
import { getDocumentById } from "@/lib/document";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatInterface } from "@/components/chat/chat-interface";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  FileText,
  MessageSquare,
  FileCheck,
  Brain,
  Clock,
  User,
  Download,
  Share2,
  BookOpen,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Document Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            The document you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
          </p>
          <Link
            href="/documents"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Documents</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Header */}
      <header className="flex-shrink-0 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-full mx-auto p-4">
          <div className="flex items-center justify-between mb-2">
            <Link
              href="/documents"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-2 rounded-lg group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>

            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                {document.title}
              </h1>

              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{user?.name || user?.email}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Last updated today</span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden border-2">
        <div className="w-1/2 h-full border-r border-gray-200 dark:border-gray-700">
          <Card className="h-full m-4 mr-2 shadow-xl border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardTitle className="flex items-center justify-between px-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-semibold text-gray-900 dark:text-white">
                    Document Preview
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-white/80 dark:bg-gray-800/80"
                >
                  PDF
                </Badge>
              </CardTitle>
            <CardContent className="p-0 h-full">
              <div className="relative h-full">
                <iframe
                  src={document.originalFileUrl}
                  className="w-full h-full border-0 rounded-b-lg"
                  title={document.title ?? "PDF Document"}
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/5 to-transparent rounded-b-lg" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-1/2 h-full">
          <Card className="h-full m-4 ml-2 shadow-xl border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardContent className="p-0 h-full">
              <Tabs defaultValue="chat" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-3 rounded-none rounded-t-lg bg-gradient-to-r from-gray-100 via-white to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 p-1 h-14 flex-shrink-0">
                  <TabsTrigger
                    value="chat"
                    className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-blue-400 transition-all duration-200"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">Chat</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="summary"
                    className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-purple-400 transition-all duration-200"
                  >
                    <Brain className="w-4 h-4" />
                    <span className="font-medium">Summary</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="extracted"
                    className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-green-600 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-green-400 transition-all duration-200"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span className="font-medium">Extract</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="chat"
                  className="flex-1 p-0 m-0 data-[state=inactive]:hidden overflow-hidden"
                >
                  <div className="h-full flex flex-col">
                    <div className="flex-shrink-0 p-6 border-b border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          AI Assistant
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Ask questions about your document and get instant,
                        intelligent answers powered by AI.
                      </p>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <ChatInterface documentId={id} />
                    </div>
                  </div>
                </TabsContent>

                {/* Summary Tab */}
                <TabsContent
                  value="summary"
                  className="flex-1 p-0 m-0 data-[state=inactive]:hidden overflow-hidden"
                >
                  <div className="h-full flex flex-col">
                    <div className="flex-shrink-0 p-6 border-b border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-900/10">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          AI Summary
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Key insights and main points intelligently extracted
                        from your document.
                      </p>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-6">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <MarkdownRenderer content={document.summaryText} />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Extracted Text Tab */}
                <TabsContent
                  value="extracted"
                  className="flex-1 p-0 m-0 data-[state=inactive]:hidden overflow-hidden"
                >
                  <div className="h-full flex flex-col">
                    <div className="flex-shrink-0 p-6 border-b border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-900/10">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <FileCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Raw Content
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Complete text content extracted from your PDF document.
                      </p>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-6">
                        <div className="bg-gray-50/50 dark:bg-gray-900/20 rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
                          <pre className="text-xs whitespace-pre-wrap font-mono text-gray-700 dark:text-gray-300 leading-relaxed">
                            {document.extractedText}
                          </pre>
                        </div>
                      </div>
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
