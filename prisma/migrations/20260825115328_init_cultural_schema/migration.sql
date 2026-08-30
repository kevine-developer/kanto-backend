-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('PROVERBE', 'EXPRESSION', 'DICTON');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'CONTRIBUTOR', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('TRANSLATION_ERROR', 'TYPO', 'INCORRECT_MEANING', 'INAPPROPRIATE', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "tier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "themes" (
    "id" TEXT NOT NULL,
    "nameMg" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capital" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "malagasy_items" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "malagasy" TEXT NOT NULL,
    "french" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "example" TEXT,
    "phonetic" TEXT,
    "audioUrl" TEXT,
    "category" "CategoryType" NOT NULL,
    "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'EASY',
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "origins" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "malagasy_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "malagasy_item_themes" (
    "itemId" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,

    CONSTRAINT "malagasy_item_themes_pkey" PRIMARY KEY ("itemId","themeId")
);

-- CreateTable
CREATE TABLE "dialect_variants" (
    "id" TEXT NOT NULL,
    "dialectName" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "audioUrl" TEXT,
    "notes" TEXT,
    "itemId" TEXT NOT NULL,
    "regionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dialect_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "birthYear" INTEGER,
    "deathYear" INTEGER,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "citations" (
    "id" TEXT NOT NULL,
    "citationMg" TEXT NOT NULL,
    "citationFr" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "contexte" TEXT,
    "audioUrl" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT,

    CONSTRAINT "citations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "citation_themes" (
    "citationId" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,

    CONSTRAINT "citation_themes_pkey" PRIMARY KEY ("citationId","themeId")
);

-- CreateTable
CREATE TABLE "daily_proverbs" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "editorial" TEXT,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_proverbs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT,
    "citationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT,
    "citationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "view_histories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "view_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_reports" (
    "id" TEXT NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "description" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "itemId" TEXT,
    "citationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contributions" (
    "id" TEXT NOT NULL,
    "category" "CategoryType" NOT NULL,
    "textMg" TEXT NOT NULL,
    "textFr" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "region" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contributions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "themes_slug_key" ON "themes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "regions_name_key" ON "regions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "malagasy_items_slug_key" ON "malagasy_items"("slug");

-- CreateIndex
CREATE INDEX "malagasy_items_category_status_idx" ON "malagasy_items"("category", "status");

-- CreateIndex
CREATE INDEX "malagasy_items_difficulty_idx" ON "malagasy_items"("difficulty");

-- CreateIndex
CREATE INDEX "malagasy_items_isFeatured_idx" ON "malagasy_items"("isFeatured");

-- CreateIndex
CREATE INDEX "malagasy_items_createdAt_idx" ON "malagasy_items"("createdAt");

-- CreateIndex
CREATE INDEX "dialect_variants_itemId_idx" ON "dialect_variants"("itemId");

-- CreateIndex
CREATE INDEX "dialect_variants_regionId_idx" ON "dialect_variants"("regionId");

-- CreateIndex
CREATE UNIQUE INDEX "authors_name_key" ON "authors"("name");

-- CreateIndex
CREATE INDEX "citations_authorId_idx" ON "citations"("authorId");

-- CreateIndex
CREATE INDEX "citations_status_idx" ON "citations"("status");

-- CreateIndex
CREATE INDEX "citations_createdAt_idx" ON "citations"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "daily_proverbs_date_key" ON "daily_proverbs"("date");

-- CreateIndex
CREATE INDEX "daily_proverbs_date_idx" ON "daily_proverbs"("date");

-- CreateIndex
CREATE INDEX "favorites_userId_idx" ON "favorites"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_itemId_key" ON "favorites"("userId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_citationId_key" ON "favorites"("userId", "citationId");

-- CreateIndex
CREATE INDEX "likes_userId_idx" ON "likes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_itemId_key" ON "likes"("userId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_citationId_key" ON "likes"("userId", "citationId");

-- CreateIndex
CREATE INDEX "view_histories_userId_viewedAt_idx" ON "view_histories"("userId", "viewedAt");

-- CreateIndex
CREATE INDEX "content_reports_resolved_idx" ON "content_reports"("resolved");

-- CreateIndex
CREATE INDEX "contributions_userId_idx" ON "contributions"("userId");

-- CreateIndex
CREATE INDEX "contributions_status_idx" ON "contributions"("status");

-- AddForeignKey
ALTER TABLE "malagasy_item_themes" ADD CONSTRAINT "malagasy_item_themes_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "malagasy_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malagasy_item_themes" ADD CONSTRAINT "malagasy_item_themes_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dialect_variants" ADD CONSTRAINT "dialect_variants_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "malagasy_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dialect_variants" ADD CONSTRAINT "dialect_variants_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citations" ADD CONSTRAINT "citations_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citation_themes" ADD CONSTRAINT "citation_themes_citationId_fkey" FOREIGN KEY ("citationId") REFERENCES "citations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citation_themes" ADD CONSTRAINT "citation_themes_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_proverbs" ADD CONSTRAINT "daily_proverbs_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "malagasy_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "malagasy_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_citationId_fkey" FOREIGN KEY ("citationId") REFERENCES "citations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "malagasy_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_citationId_fkey" FOREIGN KEY ("citationId") REFERENCES "citations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "view_histories" ADD CONSTRAINT "view_histories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "view_histories" ADD CONSTRAINT "view_histories_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "malagasy_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_reports" ADD CONSTRAINT "content_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_reports" ADD CONSTRAINT "content_reports_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "malagasy_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_reports" ADD CONSTRAINT "content_reports_citationId_fkey" FOREIGN KEY ("citationId") REFERENCES "citations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
