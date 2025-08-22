import { authOptions } from "@/lib/auth";
import { getDocumentById } from "@/lib/document";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface } from "@/components/chat/chat-interface";
export default async function DocumentPage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const document = await getDocumentById(id, user?.id as string);
  if (!document) {
    return <div>Document not found</div>;
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="p-4 border-b">
        <div className="max-w-7xl mx-auto">
          <Link href="/documents" className="text-blue-500 hover:underline">
            &larr; Back to Dashboard
          </Link>
          <h1
            className="text-2xl mt-1 font-bold truncate"
            title={document.title ?? ""}
          >
            {document.title}
          </h1>
        </div>
      </header>

      <main className="flex flex-col gap-4 p-4">
        <Card className="h-screen w-full grid grid-cols-2 gap-4">
          <Card className="col-span-1 ">
            <CardHeader>
              <CardTitle>Original Document</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <iframe
                src={document.originalFileUrl}
                className="w-full h-full border rounded-md"
                title={document.title ?? "PDF Document"}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chat with this Document</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-0 overflow-auto">
              <ChatInterface documentId={id} />
            </CardContent>
          </Card>
        </Card>

        <Card className="h-screen w-full grid grid-cols-2 gap-4">
          <Card className="overflow-auto">
            <CardHeader>
              <CardTitle>AI Generated Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-sans">
                {document.summaryText}
              </pre>
            </CardContent>
          </Card>

          <Card className="overflow-auto">
            <CardHeader>
              <CardTitle>Extracted Text</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto">
              <pre className="text-xs whitespace-pre-wrap font-mono">
                {document.extractedText}
              </pre>
            </CardContent>
          </Card>
        </Card>
      </main>
    </div>
  );
}
