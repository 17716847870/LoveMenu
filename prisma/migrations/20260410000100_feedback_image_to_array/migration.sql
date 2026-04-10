-- AlterTable
ALTER TABLE "Feedback"
ALTER COLUMN "image" DROP DEFAULT,
ALTER COLUMN "image" TYPE TEXT[] USING CASE
  WHEN "image" IS NULL OR btrim("image") = '' THEN ARRAY[]::TEXT[]
  ELSE ARRAY["image"]
END,
ALTER COLUMN "image" SET DEFAULT ARRAY[]::TEXT[];
