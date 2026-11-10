-- Migration Prisma : 20261110223000_add_learning_and_pedagogical_platform
-- Ajout des enums, tables et relations pour le module d'apprentissage didactique (Apprendre)

-- 1. CreateEnum LearningLevel
DO $$ BEGIN
    CREATE TYPE "LearningLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. CreateEnum LessonType
DO $$ BEGIN
    CREATE TYPE "LessonType" AS ENUM ('VOCABULARY', 'GRAMMAR', 'CULTURE', 'TRADITION', 'LITERATURE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. CreateEnum LessonStatus
DO $$ BEGIN
    CREATE TYPE "LessonStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. CreateTable learning_tracks
CREATE TABLE IF NOT EXISTS "learning_tracks" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleMg" TEXT NOT NULL,
    "description" TEXT,
    "descriptionMg" TEXT,
    "level" "LearningLevel" NOT NULL DEFAULT 'BEGINNER',
    "icon" TEXT,
    "color" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_tracks_pkey" PRIMARY KEY ("id")
);

-- Index pour learning_tracks
CREATE UNIQUE INDEX IF NOT EXISTS "learning_tracks_slug_key" ON "learning_tracks"("slug");
CREATE INDEX IF NOT EXISTS "learning_tracks_level_isPublished_idx" ON "learning_tracks"("level", "isPublished");
CREATE INDEX IF NOT EXISTS "learning_tracks_orderIndex_idx" ON "learning_tracks"("orderIndex");

-- 5. CreateTable learning_lessons
CREATE TABLE IF NOT EXISTS "learning_lessons" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleMg" TEXT NOT NULL,
    "summary" TEXT,
    "summaryMg" TEXT,
    "type" "LessonType" NOT NULL DEFAULT 'CULTURE',
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "durationMinutes" INTEGER NOT NULL DEFAULT 5,
    "audioUrl" TEXT,
    "illustrationUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sections" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_lessons_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "learning_lessons_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "learning_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index pour learning_lessons
CREATE UNIQUE INDEX IF NOT EXISTS "learning_lessons_slug_key" ON "learning_lessons"("slug");
CREATE INDEX IF NOT EXISTS "learning_lessons_trackId_orderIndex_idx" ON "learning_lessons"("trackId", "orderIndex");
CREATE INDEX IF NOT EXISTS "learning_lessons_isPublished_idx" ON "learning_lessons"("isPublished");

-- 6. CreateTable user_lesson_progress
CREATE TABLE IF NOT EXISTS "user_lesson_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "status" "LessonStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "score" INTEGER NOT NULL DEFAULT 100,
    "timeSpentSeconds" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_lesson_progress_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "user_lesson_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_lesson_progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "learning_lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index pour user_lesson_progress
CREATE UNIQUE INDEX IF NOT EXISTS "user_lesson_progress_userId_lessonId_key" ON "user_lesson_progress"("userId", "lessonId");
CREATE INDEX IF NOT EXISTS "user_lesson_progress_userId_status_idx" ON "user_lesson_progress"("userId", "status");

-- 7. CreateTable user_track_progress
CREATE TABLE IF NOT EXISTS "user_track_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "completedLessonsCount" INTEGER NOT NULL DEFAULT 0,
    "totalLessonsCount" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_track_progress_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "user_track_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_track_progress_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "learning_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index pour user_track_progress
CREATE UNIQUE INDEX IF NOT EXISTS "user_track_progress_userId_trackId_key" ON "user_track_progress"("userId", "trackId");
CREATE INDEX IF NOT EXISTS "user_track_progress_userId_isCompleted_idx" ON "user_track_progress"("userId", "isCompleted");

-- 8. CreateTable user_review_items
CREATE TABLE IF NOT EXISTS "user_review_items" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT,
    "termMg" TEXT NOT NULL,
    "meaningFr" TEXT NOT NULL,
    "phonetic" TEXT,
    "contextMg" TEXT,
    "contextFr" TEXT,
    "masteryLevel" INTEGER NOT NULL DEFAULT 1,
    "nextReviewDue" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "intervalDays" INTEGER NOT NULL DEFAULT 1,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_review_items_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "user_review_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_review_items_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "learning_lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Index pour user_review_items
CREATE INDEX IF NOT EXISTS "user_review_items_userId_nextReviewDue_idx" ON "user_review_items"("userId", "nextReviewDue");

