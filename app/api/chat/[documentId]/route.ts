import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger, maskId } from "@/lib/logger";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ documentId: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const { documentId } = await params;

    const document = await prisma.pdfSummary.findFirst({
        where: { id: documentId, userId: session.user.id },
        select: { id: true },
    });

    if (!document) {
            return NextResponse.json(
                { error: "Document not found" },
                { status: 404 }
            );
    }

    try {
        const messages = await prisma.message.findMany({
            where: { pdfSummaryId: documentId },
            orderBy: { createdAt: "asc" },
            select: {
                id: true,
                role: true,
                content: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ messages, total: messages.length });
    } catch (error) {
        logger.error({ error, documentId: maskId(documentId) }, "Error fetching messages");
        return new Response(JSON.stringify({ error: "Failed to fetch messages" }), {
            status: 500
        });
    }
}
