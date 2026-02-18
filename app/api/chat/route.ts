import { CoreMessage } from "ai";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { logger, maskId } from "@/lib/logger";
import { askQuestionAction } from "@/app/actions/chat-action";
import { chatRequestSchema, formatValidationError } from "@/lib/validation";
import { enqueueMessage } from "@/lib/message-queue";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    logger.warn("Unauthorized chat request attempt");
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let requestBody;
  try {
    requestBody = await req.json();
  } catch (error) {
    logger.error({ error }, "Failed to parse chat request body");
    return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const validation = chatRequestSchema.safeParse(requestBody);

  if (!validation.success) {
    const errorMessage = formatValidationError(validation.error);
    logger.warn({ errors: validation.error.issues, userId: maskId(session.user.id) }, "Chat request validation failed");
    return new Response(
      JSON.stringify({
        error: "Validation failed",
        details: errorMessage
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const { messages, documentId } = validation.data;

  const lastUserMessage = messages[messages.length - 1];

  try {
    enqueueMessage({
      role: lastUserMessage.role,
      content: lastUserMessage.content as string,
      pdfSummaryId: documentId,
    });

    logger.info(
      { userId: maskId(session.user.id), documentId },
      "Chat message queued for save"
    );

    return askQuestionAction(
      messages as CoreMessage[],
      documentId as string
    );
  } catch (error) {
    logger.error({ error, userId: maskId(session.user.id), documentId }, "Failed to process chat request");
    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
