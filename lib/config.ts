function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const applicationConfig = {
  database: {
    url: requireEnv("DATABASE_URL"),
    directUrl: requireEnv("DIRECT_URL"),
  },

  auth: {
    nextAuthUrl: requireEnv("NEXTAUTH_URL"),
    secret: requireEnv("NEXTAUTH_SECRET"),
  },

  ai: {
    provider: requireEnv("AI_PROVIDER"),
    baseUrl: requireEnv("LLM_BASE_URL"),
    textModel: requireEnv("LLM_TEXT_MODEL"),
    embeddingModel: requireEnv("LLM_EMBEDDING_MODEL"),
  },

  storage: {
    endpoint: requireEnv("S3_ENDPOINT"),
    bucket: requireEnv("S3_BUCKET"),
    accessKey: requireEnv("MINIO_ROOT_USER"),
    secretKey: requireEnv("MINIO_ROOT_PASSWORD"),
  },
};
