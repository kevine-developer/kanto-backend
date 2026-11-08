-- AlterTable MarketingBanner to support targetLocation and categoryKey
ALTER TABLE "marketing_banners" ADD COLUMN IF NOT EXISTS "targetLocation" TEXT NOT NULL DEFAULT 'HOME';
ALTER TABLE "marketing_banners" ADD COLUMN IF NOT EXISTS "categoryKey" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "marketing_banners_targetLocation_idx" ON "marketing_banners"("targetLocation");
CREATE INDEX IF NOT EXISTS "marketing_banners_categoryKey_idx" ON "marketing_banners"("categoryKey");

