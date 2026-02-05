import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger, maskId } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

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

        const documents = await prisma.pdfSummary.findMany({
            where: {
                userId,
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
