-- CreateTable
CREATE TABLE "ErrorLog" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'error',
    "scope" TEXT,
    "path" TEXT,
    "method" TEXT,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "url" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ErrorLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ErrorLog_source_createdAt_idx" ON "ErrorLog"("source", "createdAt");

-- CreateIndex
CREATE INDEX "ErrorLog_createdAt_idx" ON "ErrorLog"("createdAt");
