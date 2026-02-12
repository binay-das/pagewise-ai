import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getDocumentById } from "@/lib/document";
import { DocumentDashboard } from "@/components/document-dashboard";
import { DocumentNotFound } from "@/components/document-not-found";

export default async function DocumentPage(props: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const { id } = await props.params;

  const document = await getDocumentById(id, user?.id as string);
  if (!document) {
    return <DocumentNotFound />;
  }

  return (
    <DocumentDashboard document={document} />
  );
}

