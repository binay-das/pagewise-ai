import { askQuestionAction } from "@/app/actions/chat-action";
import { CoreMessage } from "ai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { messages, documentId } = await req.json();

  const stream = await askQuestionAction(
    messages as CoreMessage[],
    documentId as string
  );

  return stream; 
}
