import { logger } from "@/lib/logger";
import { applicationConfig } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import { readPdfFromStorage } from "@/lib/object-storage.read";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const url = searchParams.get("url");

    if (!url) {
        logger.warn("PDF request missing URL parameter");
        return new NextResponse(
            JSON.stringify({ error: "Missing url parameter" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    if (!url.trim()) {
        logger.warn("PDF request with empty URL");
        return new NextResponse(
            JSON.stringify({ error: "URL cannot be empty" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    try {
        const bucket = applicationConfig.storage.bucket;
        const bucketPart = `/${bucket}/`;
        const splitIndex = url.indexOf(bucketPart);

        let key = "";
        if (splitIndex !== -1) {
            key = url.substring(splitIndex + bucketPart.length);
        } else {
            // fallback: maybe it's just the key passed
            key = url;
        }

        key = decodeURIComponent(key);

        logger.debug({ bucket }, "Fetching PDF from storage");

        const pdfBuffer = await readPdfFromStorage(key);

        logger.info({ size: pdfBuffer.length, bucket }, "PDF served successfully");

        return new NextResponse(new Uint8Array(pdfBuffer), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="${key}"`,
            },
        });

    } catch (error) {
        logger.error({ error }, "Error serving PDF");
        return new NextResponse(
            JSON.stringify({ error: "Error serving PDF" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
