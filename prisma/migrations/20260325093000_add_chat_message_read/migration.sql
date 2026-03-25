-- CreateTable
CREATE TABLE "ChatMessageRead" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessageRead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatMessageRead_messageId_userId_key" ON "ChatMessageRead"("messageId", "userId");

-- CreateIndex
CREATE INDEX "ChatMessageRead_userId_idx" ON "ChatMessageRead"("userId");

-- CreateIndex
CREATE INDEX "ChatMessageRead_messageId_idx" ON "ChatMessageRead"("messageId");

-- AddForeignKey
ALTER TABLE "ChatMessageRead" ADD CONSTRAINT "ChatMessageRead_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessageRead" ADD CONSTRAINT "ChatMessageRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
