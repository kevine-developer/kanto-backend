-- Migration Prisma : 20261118160000_add_learning_ratings_and_images
-- Ajout des colonnes ratingsCount, averageRating, coverImage sur les tracks et lessons,
-- et des tables learning_track_ratings et learning_lesson_images.

-- 1. AlterTable learning_tracks — ajout colonnes de notation et image de couverture
ALTER TABLE "learning_tracks" ADD COLUMN IF NOT EXISTS "ratingsCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "learning_tracks" ADD COLUMN IF NOT EXISTS "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
ALTER TABLE "learning_tracks" ADD COLUMN IF NOT EXISTS "coverImage" TEXT;

-- 2. AlterTable learning_lessons — ajout colonnes de notation
ALTER TABLE "learning_lessons" ADD COLUMN IF NOT EXISTS "ratingsCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "learning_lessons" ADD COLUMN IF NOT EXISTS "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- 3. CreateTable learning_track_ratings
CREATE TABLE IF NOT EXISTS "learning_track_ratings" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_track_ratings_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "learning_track_ratings_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "learning_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "learning_track_ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index pour learning_track_ratings
CREATE UNIQUE INDEX IF NOT EXISTS "learning_track_ratings_userId_trackId_key" ON "learning_track_ratings"("userId", "trackId");
CREATE INDEX IF NOT EXISTS "learning_track_ratings_trackId_rating_idx" ON "learning_track_ratings"("trackId", "rating");
CREATE INDEX IF NOT EXISTS "learning_track_ratings_userId_idx" ON "learning_track_ratings"("userId");

-- 4. CreateTable learning_lesson_images
CREATE TABLE IF NOT EXISTS "learning_lesson_images" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "captionFr" TEXT,
    "captionMg" TEXT,
    "credit" TEXT,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_lesson_images_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "learning_lesson_images_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "learning_lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index pour learning_lesson_images
CREATE INDEX IF NOT EXISTS "learning_lesson_images_lessonId_orderIndex_idx" ON "learning_lesson_images"("lessonId", "orderIndex");
