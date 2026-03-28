-- CreateTable
CREATE TABLE "Anniversary" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "calendarType" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "weekday" INTEGER,
    "repeatType" TEXT NOT NULL,
    "advanceDays" INTEGER NOT NULL DEFAULT 0,
    "emailTo" TEXT NOT NULL,
    "emailSubject" TEXT NOT NULL,
    "emailContent" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "nextRemindAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Anniversary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnniversaryLog" (
    "id" TEXT NOT NULL,
    "anniversaryId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailTo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "error" TEXT,

    CONSTRAINT "AnniversaryLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnniversaryLog_anniversaryId_idx" ON "AnniversaryLog"("anniversaryId");

-- AddForeignKey
ALTER TABLE "AnniversaryLog" ADD CONSTRAINT "AnniversaryLog_anniversaryId_fkey" FOREIGN KEY ("anniversaryId") REFERENCES "Anniversary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
