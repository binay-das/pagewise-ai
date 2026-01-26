import { applicationConfig } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import { readPdfFromStorage } from "@/lib/object-storage.read";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const url = searchParams.get("url");

    if (!url) {
        return new NextResponse("Missing url", { status: 400 });
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

        // check decode
        key = decodeURIComponent(key);

        const pdfBuffer = await readPdfFromStorage(key);

        return new NextResponse(pdfBuffer as any, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="${key}"`,
            },
        });

    } catch (error) {
        console.error("Error serving PDF:", error);
        return new NextResponse("Error serving PDF", { status: 500 });
    }
}
