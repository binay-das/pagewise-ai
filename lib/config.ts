function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Lazy getters - only evaluate when accessed (server-side only)
export const applicationConfig = {
  database: {
    get url() { return requireEnv("DATABASE_URL"); },
    get directUrl() { return requireEnv("DIRECT_URL"); },
  },

  auth: {
    get nextAuthUrl() { return requireEnv("NEXTAUTH_URL"); },
    get secret() { return requireEnv("NEXTAUTH_SECRET"); },
  },

  ai: {
    get provider() { return requireEnv("AI_PROVIDER"); },
    get baseUrl() { return requireEnv("LLM_BASE_URL"); },
    get textModel() { return requireEnv("LLM_TEXT_MODEL"); },
    get embeddingModel() { return requireEnv("LLM_EMBEDDING_MODEL"); },
  },

  storage: {
    get endpoint() { return requireEnv("S3_ENDPOINT"); },
    get bucket() { return requireEnv("S3_BUCKET"); },
    get accessKey() { return requireEnv("MINIO_ROOT_USER"); },
    get secretKey() { return requireEnv("MINIO_ROOT_PASSWORD"); },
  },
};

export const AI_CONFIG = {
  EMBEDDING_MODEL: 'nomic-embed-text' as const,
  EMBEDDING_DIMENSIONS: 768,

  CHAT_MODEL: 'llama3.2:3b' as const,

  CHUNK_SIZE: 2000,
  CHUNK_OVERLAP: 200,

  SIMILARITY_SEARCH_LIMIT: 4,

  MAX_MESSAGE_LENGTH: 10000,

  EMBEDDING_CHUNK_SIZE: 1000,
} as const;

export const TIMEOUTS = {
  UPLOAD_TIMEOUT: 30000,
  CHAT_TIMEOUT: 60000,
  SUMMARY_TIMEOUT: 120000,
} as const;

export const UI_CONFIG = {
  TOAST_DURATION: 2000,
  REDIRECT_DELAY: 500,
  REDIRECT_DELAY_LONG: 1000,
  ANIMATION_DURATION: 300,
} as const;
