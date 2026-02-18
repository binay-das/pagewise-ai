-- CreateIndex
CREATE INDEX "PdfSummary_userId_idx" ON "PdfSummary"("userId");

-- CreateIndex
CREATE INDEX "PdfSummary_userId_createdAt_idx" ON "PdfSummary"("userId", "createdAt" DESC);
