import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger, maskId } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ documentId: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentId } = await params;

    const document = await prisma.pdfSummary.findFirst({
        where: { id: documentId, userId: session.user.id },
        select: { id: true },
    });

    if (!document) {
        return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const rateLimit = checkRateLimit(`chat-fetch:${session.user.id}`, 60, 60_000);
    if (!rateLimit.allowed) {
        return NextResponse.json(
            { error: "Too many requests" },
            {
                status: 429,
                headers: { "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)) },
            }
        );
    }

    const { searchParams } = req.nextUrl;
    const cursor = searchParams.get("cursor") ?? undefined;
    const limitParam = parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10);
    const limit = Math.min(isNaN(limitParam) ? DEFAULT_LIMIT : limitParam, MAX_LIMIT);

    try {
        const messages = await prisma.message.findMany({
            where: { pdfSummaryId: documentId },
            orderBy: { createdAt: "asc" },
            take: limit + 1,
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
            select: {
                id: true,
                role: true,
                content: true,
                createdAt: true,
            },
        });

        const hasMore = messages.length > limit;
        const page = hasMore ? messages.slice(0, limit) : messages;
        const nextCursor = hasMore ? page[page.length - 1].id : null;

        return NextResponse.json({
            messages: page,
            nextCursor,
            hasMore,
            limit,
        });
    } catch (error) {
        logger.error({ error, documentId: maskId(documentId) }, "Error fetching messages");
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}
