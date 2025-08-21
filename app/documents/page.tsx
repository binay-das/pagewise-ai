import DocumentCard from "@/components/documents/document-card";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getDocuments } from "@/lib/documents";
import { PlusCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    redirect("/signin");
  }

  const documents = await getDocuments(user.id as string);

  return (
    <div className="bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 ">
            Your Documents
          </h1>
          <Button asChild>
            <Link href="/new-document">
              <PlusCircle className="mr-2 h-4 w-4" />
              New document
            </Link>
          </Button>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700">
              No documents yet!
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Click "New Summary" to upload a PDF and get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((d: any) => (
              <DocumentCard key={d.id} document={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
