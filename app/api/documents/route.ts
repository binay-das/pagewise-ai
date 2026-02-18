import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger, maskId } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
    let userId: string | null = null;

    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;

        if (!user || !user.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        userId = user.id;

        const rateLimit = checkRateLimit(`documents:${userId}`, 60, 60_000);
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: "Too many requests" },
                {
                    status: 429,
                    headers: { "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)) },
                }
            );
        }

        const documents = await prisma.pdfSummary.findMany({
            where: {
                userId,
            },
            select: {
                id: true,
                title: true,
                fileName: true,
                summaryText: true,
                originalFileUrl: true,
                wordCount: true,
                author: true,
                creationDate: true,
                keywords: true,
                embeddingProvider: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ documents });


    } catch (error) {
        logger.error(
            {
                error,
                userId: userId ? maskId(userId) : "unauthenticated",
                path: req.nextUrl.pathname,
                method: req.method,
            },
            "Failed to fetch documents"
        );

        return NextResponse.json(
            { error: "Failed to fetch documents" },
            { status: 500 }
        );
    }
}
