import { authOptions } from "@/lib/auth";
import { getDocumentById } from "@/lib/document";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/documents">Back to Dashboard</Link>
          <h1 className="text-3xl mt-2 font-bold">{document.title}</h1>
        </div>

        <Card className="grid grid-cols-2 gap-8 mb-12">
          <Card className="h-">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Extracted Text</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-800 p-4 rounded-md max-h-[60vh] overflow-y-auto">
                {document.extractedText}
              </pre>
            </CardContent>
          </Card>
          <Card className=""></Card>
        </Card>

        <Card className="grid grid-cols-2 gap-8 mb-12">
          <Card className="h-screen">
            <iframe
              src={document.originalFileUrl}
              className="w-full h-full"
              title={document.title ?? "PDF Document"}
            />
          </Card>
          <Card className="h-full">
            <pre className="text-sm whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-800 p-4 rounded-md max-h-[60vh] overflow-y-auto">
              {document.summaryText}
            </pre>
          </Card>
        </Card>
      </div>
    </div>
  );
}
