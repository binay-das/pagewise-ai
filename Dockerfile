
FROM node:20-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile


FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
ARG NEXTAUTH_SECRET=dummy
ARG NEXTAUTH_URL=http://localhost:3000
ARG S3_ENDPOINT=http://localhost:9000
ARG MINIO_ROOT_USER=dummy
ARG MINIO_ROOT_PASSWORD=dummy
ARG S3_BUCKET=pdfs
ARG AI_PROVIDER=ollama
ARG LLM_BASE_URL=http://localhost:11434
ARG LLM_TEXT_MODEL=llama3.2:3b
ARG LLM_EMBEDDING_MODEL=nomic-embed-text:v1.5

ENV DATABASE_URL=${DATABASE_URL} \
    NEXTAUTH_SECRET=${NEXTAUTH_SECRET} \
    NEXTAUTH_URL=${NEXTAUTH_URL} \
    S3_ENDPOINT=${S3_ENDPOINT} \
    MINIO_ROOT_USER=${MINIO_ROOT_USER} \
    MINIO_ROOT_PASSWORD=${MINIO_ROOT_PASSWORD} \
    S3_BUCKET=${S3_BUCKET} \
    AI_PROVIDER=${AI_PROVIDER} \
    LLM_BASE_URL=${LLM_BASE_URL} \
    LLM_TEXT_MODEL=${LLM_TEXT_MODEL} \
    LLM_EMBEDDING_MODEL=${LLM_EMBEDDING_MODEL}

RUN pnpm build


FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
