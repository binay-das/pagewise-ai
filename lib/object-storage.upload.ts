import {
    PutObjectCommand,
    HeadBucketCommand,
    CreateBucketCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { applicationConfig } from "@/lib/config";
import { s3 } from "@/lib/object-storage.client";

async function ensureBucket(bucket: string) {
    try {
        await s3.send(new HeadBucketCommand({ Bucket: bucket }));
    } catch {
        await s3.send(new CreateBucketCommand({ Bucket: bucket }));
    }
}

export async function uploadPdfToMinio(file: File) {
    if (!file || file.type !== "application/pdf") {
        throw new Error("Invalid file");
    }

    const bucket = applicationConfig.storage.bucket;
    await ensureBucket(bucket);

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `${randomUUID()}-${file.name}`;

    await s3.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: buffer,
            ContentType: "application/pdf",
        })
    );

    return {
        key,
        url: `${applicationConfig.storage.endpoint}/${bucket}/${key}`,
    };
}
