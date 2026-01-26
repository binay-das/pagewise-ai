import { S3Client } from "@aws-sdk/client-s3";
import { applicationConfig } from "@/lib/config";

export const s3 = new S3Client({
  region: "us-east-1",
  endpoint: applicationConfig.storage.endpoint,
  credentials: {
    accessKeyId: applicationConfig.storage.accessKey,
    secretAccessKey: applicationConfig.storage.secretKey,
  },
  forcePathStyle: true,
});
