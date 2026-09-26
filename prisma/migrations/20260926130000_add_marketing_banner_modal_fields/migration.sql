-- AlterTable MarketingBanner to support actionType and in-app modal information
ALTER TABLE "marketing_banners" ADD COLUMN IF NOT EXISTS "actionType" TEXT NOT NULL DEFAULT 'DEEP_LINK';
ALTER TABLE "marketing_banners" ADD COLUMN IF NOT EXISTS "modalBodyFr" TEXT;
ALTER TABLE "marketing_banners" ADD COLUMN IF NOT EXISTS "modalBodyMg" TEXT;
ALTER TABLE "marketing_banners" ADD COLUMN IF NOT EXISTS "modalImageUrl" TEXT;
ALTER TABLE "marketing_banners" ADD COLUMN IF NOT EXISTS "modalCtaLabelFr" TEXT;
ALTER TABLE "marketing_banners" ADD COLUMN IF NOT EXISTS "modalCtaLabelMg" TEXT;
ALTER TABLE "marketing_banners" ADD COLUMN IF NOT EXISTS "modalCtaLink" TEXT;
