import { CoreMessage } from "ai";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { askQuestionAction } from "@/app/actions/chat-action";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { messages, documentId } = await req.json();

  const lastUserMessage = messages[messages.length - 1];

  const savedUserMessage = await prisma.message.create({
    data: {
      role: lastUserMessage.role,
      content: lastUserMessage.content,
      pdfSummaryId: documentId,
    },
  });

  return askQuestionAction(
    messages as CoreMessage[],
    documentId as string,
    savedUserMessage.id
  );
}
