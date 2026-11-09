-- Migration Prisma : Ajout des enums et de la table app_reviews pour les avis et témoignages utilisateurs

-- CreateEnum PublicDisplayNameType
DO $$ BEGIN
    CREATE TYPE "PublicDisplayNameType" AS ENUM ('FIRSTNAME', 'PSEUDO', 'ANONYMOUS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum ReviewModerationStatus
DO $$ BEGIN
    CREATE TYPE "ReviewModerationStatus" AS ENUM ('NOT_AUTHORIZED', 'PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable app_reviews
CREATE TABLE IF NOT EXISTS "app_reviews" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "category" TEXT DEFAULT 'general',
    "userId" TEXT,
    "authorName" TEXT,
    "authorEmail" TEXT,
    "isPublicationAuthorized" BOOLEAN NOT NULL DEFAULT false,
    "publicDisplayNameType" "PublicDisplayNameType" NOT NULL DEFAULT 'ANONYMOUS',
    "publicDisplayName" TEXT,
    "consentDate" TIMESTAMP(3),
    "consentWithdrawnDate" TIMESTAMP(3),
    "consentVersion" TEXT DEFAULT '1.0',
    "moderationStatus" "ReviewModerationStatus" NOT NULL DEFAULT 'NOT_AUTHORIZED',
    "moderatorNote" TEXT,
    "moderatedAt" TIMESTAMP(3),
    "moderatedBy" TEXT,
    "appVersion" TEXT,
    "platform" TEXT,
    "deviceInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_reviews_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "app_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Index de performance et filtrage
CREATE INDEX IF NOT EXISTS "app_reviews_rating_idx" ON "app_reviews"("rating");
CREATE INDEX IF NOT EXISTS "app_reviews_moderationStatus_idx" ON "app_reviews"("moderationStatus");
CREATE INDEX IF NOT EXISTS "app_reviews_isPublicationAuthorized_idx" ON "app_reviews"("isPublicationAuthorized");
CREATE INDEX IF NOT EXISTS "app_reviews_userId_idx" ON "app_reviews"("userId");
CREATE INDEX IF NOT EXISTS "app_reviews_createdAt_idx" ON "app_reviews"("createdAt");

