-- =============================================================================
-- Migration: add_missing_tables
-- Adds all models introduced after the initial migration
-- =============================================================================

-- -------------------------
-- Alter existing ENUMs
-- -------------------------

-- CategoryType: add CITATION, CONTE, KABARY
ALTER TYPE "CategoryType" ADD VALUE IF NOT EXISTS 'CITATION';
ALTER TYPE "CategoryType" ADD VALUE IF NOT EXISTS 'CONTE';
ALTER TYPE "CategoryType" ADD VALUE IF NOT EXISTS 'KABARY';

-- DifficultyLevel: add EXPERT
ALTER TYPE "DifficultyLevel" ADD VALUE IF NOT EXISTS 'EXPERT';

-- -------------------------
-- New ENUMs
-- -------------------------

CREATE TYPE "CivicSubCategory" AS ENUM ('INSTITUTION', 'DROITS_VOTE', 'ECOLOGIE_CIVISME', 'SYMBOLES_HISTOIRE', 'VIVRE_ENSEMBLE');
CREATE TYPE "TrueFalseTheme" AS ENUM ('GEN', 'CULT', 'GEO', 'HIST', 'LITT', 'PROV');
CREATE TYPE "ModuleType" AS ENUM ('GAME', 'CATEGORY', 'FEATURE');
CREATE TYPE "DuelStatus" AS ENUM ('WAITING', 'READY', 'IN_PROGRESS', 'FINISHED', 'CANCELLED');
CREATE TYPE "DuelGameType" AS ENUM ('TRUE_FALSE', 'MISSING_WORD', 'QUIZ');
CREATE TYPE "AnnouncementType" AS ENUM ('INFO', 'MAINTENANCE', 'NEW_FEATURE');
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED');

-- -------------------------
-- Alter existing tables (add missing columns)
-- -------------------------

-- users: add new columns
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "username" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "pushToken" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "banned" BOOLEAN;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "banReason" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "banExpires" TIMESTAMP(3);

-- Make "name" NOT NULL if it was nullable (careful: only if existing data allows)
-- We skip this alteration to avoid breaking existing data

-- favorites: add new columns
ALTER TABLE "favorites" ADD COLUMN IF NOT EXISTS "conteId" TEXT;
ALTER TABLE "favorites" ADD COLUMN IF NOT EXISTS "kabaryId" TEXT;
ALTER TABLE "favorites" ADD COLUMN IF NOT EXISTS "poesieId" TEXT;
ALTER TABLE "favorites" ADD COLUMN IF NOT EXISTS "recitationId" TEXT;

-- likes: add new columns
ALTER TABLE "likes" ADD COLUMN IF NOT EXISTS "conteId" TEXT;
ALTER TABLE "likes" ADD COLUMN IF NOT EXISTS "kabaryId" TEXT;
ALTER TABLE "likes" ADD COLUMN IF NOT EXISTS "poesieId" TEXT;
ALTER TABLE "likes" ADD COLUMN IF NOT EXISTS "recitationId" TEXT;
ALTER TABLE "likes" ADD COLUMN IF NOT EXISTS "civicContentId" TEXT;

-- view_histories: add new columns
ALTER TABLE "view_histories" ADD COLUMN IF NOT EXISTS "citationId" TEXT;
ALTER TABLE "view_histories" ADD COLUMN IF NOT EXISTS "conteId" TEXT;
ALTER TABLE "view_histories" ADD COLUMN IF NOT EXISTS "kabaryId" TEXT;
ALTER TABLE "view_histories" ADD COLUMN IF NOT EXISTS "poesieId" TEXT;
ALTER TABLE "view_histories" ADD COLUMN IF NOT EXISTS "recitationId" TEXT;
-- Make itemId nullable
ALTER TABLE "view_histories" ALTER COLUMN "itemId" DROP NOT NULL;

-- content_reports: add new columns
ALTER TABLE "content_reports" ADD COLUMN IF NOT EXISTS "conteId" TEXT;
ALTER TABLE "content_reports" ADD COLUMN IF NOT EXISTS "kabaryId" TEXT;
ALTER TABLE "content_reports" ADD COLUMN IF NOT EXISTS "poesieId" TEXT;
ALTER TABLE "content_reports" ADD COLUMN IF NOT EXISTS "recitationId" TEXT;

-- contributions: add new columns
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "score" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "viewCount" INTEGER NOT NULL DEFAULT 0;

-- -------------------------
-- New tables
-- -------------------------

-- sessions
CREATE TABLE IF NOT EXISTS "sessions" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- accounts
CREATE TABLE IF NOT EXISTS "accounts" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "issuer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- verifications
CREATE TABLE IF NOT EXISTS "verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- contribution_votes
CREATE TABLE IF NOT EXISTS "contribution_votes" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "contributionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contribution_votes_pkey" PRIMARY KEY ("id")
);

-- contribution_comments
CREATE TABLE IF NOT EXISTS "contribution_comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contributionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contribution_comments_pkey" PRIMARY KEY ("id")
);

-- contes
CREATE TABLE IF NOT EXISTS "contes" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "subtitle" TEXT,
    "subtitleFr" TEXT,
    "author" TEXT DEFAULT 'Angano Malagasy',
    "source" TEXT,
    "illustration" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "moralMg" TEXT,
    "moralFr" TEXT,
    "audioUrlMg" TEXT,
    "audioUrlFr" TEXT,
    "variantIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contes_pkey" PRIMARY KEY ("id")
);

-- conte_paragraphs
CREATE TABLE IF NOT EXISTS "conte_paragraphs" (
    "id" TEXT NOT NULL,
    "paragraphNumber" INTEGER NOT NULL,
    "textMg" TEXT NOT NULL,
    "textFr" TEXT NOT NULL,
    "illustration" TEXT,
    "conteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conte_paragraphs_pkey" PRIMARY KEY ("id")
);

-- conte_themes
CREATE TABLE IF NOT EXISTS "conte_themes" (
    "conteId" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,

    CONSTRAINT "conte_themes_pkey" PRIMARY KEY ("conteId","themeId")
);

-- kabaries
CREATE TABLE IF NOT EXISTS "kabaries" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "subtitle" TEXT,
    "subtitleFr" TEXT,
    "occasion" TEXT NOT NULL,
    "occasionFr" TEXT,
    "speakerRoleMg" TEXT,
    "speakerRoleFr" TEXT,
    "recipientRoleMg" TEXT,
    "recipientRoleFr" TEXT,
    "region" TEXT,
    "illustration" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "concludingProverbMg" TEXT,
    "concludingProverbFr" TEXT,
    "etiquetteNotesMg" TEXT,
    "etiquetteNotesFr" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kabaries_pkey" PRIMARY KEY ("id")
);

-- kabary_steps
CREATE TABLE IF NOT EXISTS "kabary_steps" (
    "id" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "stepNameMg" TEXT NOT NULL,
    "stepNameFr" TEXT NOT NULL,
    "explanationMg" TEXT,
    "explanationFr" TEXT,
    "textMg" TEXT NOT NULL,
    "textFr" TEXT NOT NULL,
    "kabaryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kabary_steps_pkey" PRIMARY KEY ("id")
);

-- kabary_themes
CREATE TABLE IF NOT EXISTS "kabary_themes" (
    "kabaryId" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,

    CONSTRAINT "kabary_themes_pkey" PRIMARY KEY ("kabaryId","themeId")
);

-- true_false_questions
CREATE TABLE IF NOT EXISTS "true_false_questions" (
    "id" TEXT NOT NULL,
    "questionMg" TEXT NOT NULL,
    "questionFr" TEXT,
    "isTrue" BOOLEAN NOT NULL,
    "explanationMg" TEXT NOT NULL,
    "explanationFr" TEXT,
    "theme" "TrueFalseTheme" NOT NULL DEFAULT 'GEN',
    "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'EASY',
    "source" TEXT,
    "image" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "timesPlayed" INTEGER NOT NULL DEFAULT 0,
    "timesCorrect" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "true_false_questions_pkey" PRIMARY KEY ("id")
);

-- true_false_sessions
CREATE TABLE IF NOT EXISTS "true_false_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "theme" "TrueFalseTheme" NOT NULL DEFAULT 'GEN',
    "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'EASY',
    "score" INTEGER NOT NULL DEFAULT 0,
    "totalQuestions" INTEGER NOT NULL DEFAULT 10,
    "streakMax" INTEGER NOT NULL DEFAULT 0,
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "true_false_sessions_pkey" PRIMARY KEY ("id")
);

-- true_false_answers
CREATE TABLE IF NOT EXISTS "true_false_answers" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "userAnswer" BOOLEAN NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "true_false_answers_pkey" PRIMARY KEY ("id")
);

-- module_locks
CREATE TABLE IF NOT EXISTS "module_locks" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "ModuleType" NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameMg" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockReason" TEXT,
    "imageUrl" TEXT,
    "minTier" TEXT DEFAULT 'FREE',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "module_locks_pkey" PRIMARY KEY ("id")
);

-- notifications
CREATE TABLE IF NOT EXISTS "notifications" (
    "id" TEXT NOT NULL,
    "titleMg" TEXT NOT NULL,
    "titleFr" TEXT,
    "messageMg" TEXT NOT NULL,
    "messageFr" TEXT,
    "category" TEXT NOT NULL DEFAULT 'culture',
    "badgeText" TEXT,
    "badgeType" TEXT DEFAULT 'new',
    "iconName" TEXT DEFAULT 'bulb-outline',
    "iconColor" TEXT DEFAULT '#C0392B',
    "targetRoute" TEXT,
    "isBroadcast" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- word_puzzle_levels
CREATE TABLE IF NOT EXISTS "word_puzzle_levels" (
    "id" TEXT NOT NULL,
    "levelNumber" INTEGER NOT NULL,
    "titleMg" TEXT NOT NULL,
    "titleFr" TEXT,
    "description" TEXT,
    "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'EASY',
    "passThreshold" INTEGER NOT NULL DEFAULT 5,
    "totalSentences" INTEGER NOT NULL DEFAULT 10,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "word_puzzle_levels_pkey" PRIMARY KEY ("id")
);

-- word_puzzle_sentences
CREATE TABLE IF NOT EXISTS "word_puzzle_sentences" (
    "id" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 1,
    "malagasy" TEXT NOT NULL,
    "french" TEXT NOT NULL,
    "hint" TEXT,
    "explanationMg" TEXT,
    "explanationFr" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "word_puzzle_sentences_pkey" PRIMARY KEY ("id")
);

-- missing_word_levels
CREATE TABLE IF NOT EXISTS "missing_word_levels" (
    "id" TEXT NOT NULL,
    "levelNumber" INTEGER NOT NULL,
    "titleMg" TEXT NOT NULL,
    "titleFr" TEXT,
    "description" TEXT,
    "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'EASY',
    "passThreshold" INTEGER NOT NULL DEFAULT 5,
    "totalQuestions" INTEGER NOT NULL DEFAULT 10,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "missing_word_levels_pkey" PRIMARY KEY ("id")
);

-- missing_word_questions
CREATE TABLE IF NOT EXISTS "missing_word_questions" (
    "id" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 1,
    "template" TEXT[],
    "correctWord" TEXT NOT NULL,
    "choices" TEXT[],
    "french" TEXT NOT NULL,
    "explanation" TEXT,
    "hint" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "missing_word_questions_pkey" PRIMARY KEY ("id")
);

-- user_progress
CREATE TABLE IF NOT EXISTS "user_progress" (
    "userId" TEXT NOT NULL,
    "totalXp" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "coins" INTEGER NOT NULL DEFAULT 0,
    "streakDays" INTEGER NOT NULL DEFAULT 0,
    "lastLoginDate" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("userId")
);

-- game_progressions
CREATE TABLE IF NOT EXISTS "game_progressions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameType" TEXT NOT NULL,
    "unlockedLevelIndex" INTEGER NOT NULL DEFAULT 0,
    "levelStars" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "game_progressions_pkey" PRIMARY KEY ("id")
);

-- xp_transactions
CREATE TABLE IF NOT EXISTS "xp_transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xp_transactions_pkey" PRIMARY KEY ("id")
);

-- user_badges
CREATE TABLE IF NOT EXISTS "user_badges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progress" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

-- poesies
CREATE TABLE IF NOT EXISTS "poesies" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "author" TEXT,
    "period" TEXT,
    "category" TEXT DEFAULT 'tononkalo',
    "explanationMg" TEXT,
    "explanationFr" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "poesies_pkey" PRIMARY KEY ("id")
);

-- poesie_stanzas
CREATE TABLE IF NOT EXISTS "poesie_stanzas" (
    "id" TEXT NOT NULL,
    "stanzaNumber" INTEGER NOT NULL,
    "versesMg" TEXT[],
    "versesFr" TEXT[],
    "poesieId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "poesie_stanzas_pkey" PRIMARY KEY ("id")
);

-- recitations
CREATE TABLE IF NOT EXISTS "recitations" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "author" TEXT,
    "description" TEXT,
    "durationMinutes" INTEGER,
    "contentLines" TEXT[],
    "references" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recitations_pkey" PRIMARY KEY ("id")
);

-- civic_contents
CREATE TABLE IF NOT EXISTS "civic_contents" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subCategory" "CivicSubCategory" NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleMg" TEXT NOT NULL,
    "summaryFr" TEXT,
    "summaryMg" TEXT,
    "contentFr" TEXT[],
    "contentMg" TEXT[],
    "themes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sources" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "imageUrl" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "civic_contents_pkey" PRIMARY KEY ("id")
);

-- civic_structure_roles
CREATE TABLE IF NOT EXISTS "civic_structure_roles" (
    "id" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "titleFr" TEXT NOT NULL,
    "titleMg" TEXT NOT NULL,
    "roleFr" TEXT NOT NULL,
    "roleMg" TEXT NOT NULL,
    "civicContentId" TEXT NOT NULL,

    CONSTRAINT "civic_structure_roles_pkey" PRIMARY KEY ("id")
);

-- civic_quiz_questions
CREATE TABLE IF NOT EXISTS "civic_quiz_questions" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "choices" TEXT[],
    "answerIndex" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'EASY',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "timesPlayed" INTEGER NOT NULL DEFAULT 0,
    "timesCorrect" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "civic_quiz_questions_pkey" PRIMARY KEY ("id")
);

-- duel_sessions
CREATE TABLE IF NOT EXISTS "duel_sessions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "gameType" "DuelGameType" NOT NULL DEFAULT 'TRUE_FALSE',
    "status" "DuelStatus" NOT NULL DEFAULT 'WAITING',
    "player1Id" TEXT NOT NULL,
    "player2Id" TEXT,
    "player1Name" TEXT,
    "player2Name" TEXT,
    "player1Avatar" TEXT,
    "player2Avatar" TEXT,
    "winnerId" TEXT,
    "questionIds" TEXT[],
    "totalQuestions" INTEGER NOT NULL DEFAULT 5,
    "player1Score" INTEGER NOT NULL DEFAULT 0,
    "player2Score" INTEGER NOT NULL DEFAULT 0,
    "player1Finished" BOOLEAN NOT NULL DEFAULT false,
    "player2Finished" BOOLEAN NOT NULL DEFAULT false,
    "timePerQuestion" INTEGER NOT NULL DEFAULT 15,
    "maxPlayers" INTEGER NOT NULL DEFAULT 10,
    "currentQuestionIndex" INTEGER NOT NULL DEFAULT 0,
    "roundStartedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "duel_sessions_pkey" PRIMARY KEY ("id")
);

-- duel_players
CREATE TABLE IF NOT EXISTS "duel_players" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "isHost" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER NOT NULL DEFAULT 0,
    "currentRoundScore" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "answersCount" INTEGER NOT NULL DEFAULT 0,
    "totalTimeMs" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "previousRank" INTEGER,
    "earnedXp" INTEGER NOT NULL DEFAULT 0,
    "hasAnsweredCurrent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "duel_players_pkey" PRIMARY KEY ("id")
);

-- duel_answers
CREATE TABLE IF NOT EXISTS "duel_answers" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionIndex" INTEGER NOT NULL,
    "userAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "timeTakenMs" INTEGER NOT NULL DEFAULT 0,
    "pointsAwarded" INTEGER NOT NULL DEFAULT 0,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "duel_answers_pkey" PRIMARY KEY ("id")
);

-- system_announcements
CREATE TABLE IF NOT EXISTS "system_announcements" (
    "id" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleMg" TEXT NOT NULL,
    "messageFr" TEXT NOT NULL,
    "messageMg" TEXT NOT NULL,
    "type" "AnnouncementType" NOT NULL DEFAULT 'INFO',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_announcements_pkey" PRIMARY KEY ("id")
);

-- riddle_questions
CREATE TABLE IF NOT EXISTS "riddle_questions" (
    "id" TEXT NOT NULL,
    "riddleMg" TEXT NOT NULL,
    "riddleFr" TEXT NOT NULL,
    "options" TEXT[],
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "clue" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "timesPlayed" INTEGER NOT NULL DEFAULT 0,
    "timesCorrect" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "riddle_questions_pkey" PRIMARY KEY ("id")
);

-- riddle_sessions
CREATE TABLE IF NOT EXISTS "riddle_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "totalQuestions" INTEGER NOT NULL DEFAULT 10,
    "streakMax" INTEGER NOT NULL DEFAULT 0,
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "riddle_sessions_pkey" PRIMARY KEY ("id")
);

-- riddle_answers
CREATE TABLE IF NOT EXISTS "riddle_answers" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "userAnswer" TEXT,
    "isCorrect" BOOLEAN NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "riddle_answers_pkey" PRIMARY KEY ("id")
);

-- civic_quiz_sessions
CREATE TABLE IF NOT EXISTS "civic_quiz_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "category" TEXT,
    "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'EASY',
    "score" INTEGER NOT NULL DEFAULT 0,
    "totalQuestions" INTEGER NOT NULL DEFAULT 10,
    "streakMax" INTEGER NOT NULL DEFAULT 0,
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "civic_quiz_sessions_pkey" PRIMARY KEY ("id")
);

-- civic_quiz_answers
CREATE TABLE IF NOT EXISTS "civic_quiz_answers" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "userAnswer" TEXT,
    "isCorrect" BOOLEAN NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "civic_quiz_answers_pkey" PRIMARY KEY ("id")
);

-- vintana_signs
CREATE TABLE IF NOT EXISTS "vintana_signs" (
    "id" TEXT NOT NULL,
    "nameMg" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "element" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "luckyColor" TEXT,
    "luckyDay" TEXT,

    CONSTRAINT "vintana_signs_pkey" PRIMARY KEY ("id")
);

-- vintana_forecasts
CREATE TABLE IF NOT EXISTS "vintana_forecasts" (
    "id" TEXT NOT NULL,
    "signId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "prediction" TEXT NOT NULL,
    "mood" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vintana_forecasts_pkey" PRIMARY KEY ("id")
);

-- friendships
CREATE TABLE IF NOT EXISTS "friendships" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "FriendshipStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "friendships_pkey" PRIMARY KEY ("id")
);

-- encouragements
CREATE TABLE IF NOT EXISTS "encouragements" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "encouragements_pkey" PRIMARY KEY ("id")
);

-- civic_lessons
CREATE TABLE IF NOT EXISTS "civic_lessons" (
    "id" TEXT NOT NULL,
    "category" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "titleFr" TEXT NOT NULL,
    "titleMg" TEXT NOT NULL,
    "descriptionFr" TEXT NOT NULL,
    "descriptionMg" TEXT NOT NULL,
    "imageUrl" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "civic_lessons_pkey" PRIMARY KEY ("id")
);

-- presidents
CREATE TABLE IF NOT EXISTS "presidents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleMg" TEXT NOT NULL,
    "republic" TEXT NOT NULL,
    "republicMg" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "quoteFr" TEXT,
    "quoteMg" TEXT,
    "bioFr" TEXT NOT NULL,
    "bioMg" TEXT NOT NULL,
    "achievementsFr" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "achievementsMg" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "badgeColor" TEXT DEFAULT '#2A6B3D',
    "imageUrl" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "presidents_pkey" PRIMARY KEY ("id")
);

-- banknotes
CREATE TABLE IF NOT EXISTS "banknotes" (
    "id" TEXT NOT NULL,
    "valueAriary" INTEGER NOT NULL,
    "valueFmg" INTEGER NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleMg" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "seriesLabelFr" TEXT NOT NULL,
    "seriesLabelMg" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "colorLight" TEXT NOT NULL,
    "colorDark" TEXT NOT NULL,
    "obverseDescriptionFr" TEXT NOT NULL,
    "obverseDescriptionMg" TEXT NOT NULL,
    "reverseDescriptionFr" TEXT NOT NULL,
    "reverseDescriptionMg" TEXT NOT NULL,
    "symbolismFr" TEXT NOT NULL,
    "symbolismMg" TEXT NOT NULL,
    "securityFeaturesFr" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "imageUrl" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banknotes_pkey" PRIMARY KEY ("id")
);

-- province_blasons
CREATE TABLE IF NOT EXISTS "province_blasons" (
    "id" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "chefLieu" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleMg" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "bgLight" TEXT NOT NULL,
    "borderLight" TEXT NOT NULL,
    "descriptionFr" TEXT NOT NULL,
    "descriptionMg" TEXT NOT NULL,
    "symbols" JSONB,
    "keyFactsFr" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "keyFactsMg" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "imageUrl" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "province_blasons_pkey" PRIMARY KEY ("id")
);

-- nature_emblems
CREATE TABLE IF NOT EXISTS "nature_emblems" (
    "id" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameMg" TEXT NOT NULL,
    "scientificName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "statusFr" TEXT NOT NULL,
    "statusMg" TEXT NOT NULL,
    "descriptionFr" TEXT NOT NULL,
    "descriptionMg" TEXT NOT NULL,
    "culturalRoleFr" TEXT NOT NULL,
    "culturalRoleMg" TEXT NOT NULL,
    "proverbMg" TEXT,
    "proverbFr" TEXT,
    "accentColor" TEXT DEFAULT '#1B5E20',
    "imageUrl" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nature_emblems_pkey" PRIMARY KEY ("id")
);

-- history_dates
CREATE TABLE IF NOT EXISTS "history_dates" (
    "id" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "exactDate" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleMg" TEXT NOT NULL,
    "era" TEXT NOT NULL,
    "summaryFr" TEXT NOT NULL,
    "summaryMg" TEXT NOT NULL,
    "impactFr" TEXT NOT NULL,
    "impactMg" TEXT NOT NULL,
    "accentColor" TEXT DEFAULT '#B71C1C',
    "imageUrl" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "history_dates_pkey" PRIMARY KEY ("id")
);

-- national_emblems
CREATE TABLE IF NOT EXISTS "national_emblems" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "imageUrl" TEXT,
    "government" TEXT NOT NULL,
    "descriptionFr" TEXT NOT NULL,
    "descriptionMg" TEXT,
    "notesFr" TEXT,
    "notesMg" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "national_emblems_pkey" PRIMARY KEY ("id")
);

-- welcome_slides
CREATE TABLE IF NOT EXISTS "welcome_slides" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleMg" TEXT,
    "badge" TEXT NOT NULL,
    "badgeMg" TEXT NOT NULL,
    "tag" TEXT,
    "imageUrl" TEXT NOT NULL,
    "accentColor" TEXT NOT NULL DEFAULT '#4A6741',
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "welcome_slides_pkey" PRIMARY KEY ("id")
);

-- -------------------------
-- New Indexes
-- -------------------------

CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX IF NOT EXISTS "sessions_token_key" ON "sessions"("token");
CREATE INDEX IF NOT EXISTS "sessions_userId_idx" ON "sessions"("userId");
CREATE INDEX IF NOT EXISTS "accounts_userId_idx" ON "accounts"("userId");

CREATE UNIQUE INDEX IF NOT EXISTS "favorites_userId_conteId_key" ON "favorites"("userId", "conteId");
CREATE UNIQUE INDEX IF NOT EXISTS "favorites_userId_kabaryId_key" ON "favorites"("userId", "kabaryId");
CREATE UNIQUE INDEX IF NOT EXISTS "favorites_userId_poesieId_key" ON "favorites"("userId", "poesieId");
CREATE UNIQUE INDEX IF NOT EXISTS "favorites_userId_recitationId_key" ON "favorites"("userId", "recitationId");

CREATE UNIQUE INDEX IF NOT EXISTS "likes_userId_conteId_key" ON "likes"("userId", "conteId");
CREATE UNIQUE INDEX IF NOT EXISTS "likes_userId_kabaryId_key" ON "likes"("userId", "kabaryId");
CREATE UNIQUE INDEX IF NOT EXISTS "likes_userId_poesieId_key" ON "likes"("userId", "poesieId");
CREATE UNIQUE INDEX IF NOT EXISTS "likes_userId_recitationId_key" ON "likes"("userId", "recitationId");
CREATE UNIQUE INDEX IF NOT EXISTS "likes_userId_civicContentId_key" ON "likes"("userId", "civicContentId");

CREATE INDEX IF NOT EXISTS "contribution_votes_contributionId_idx" ON "contribution_votes"("contributionId");
CREATE UNIQUE INDEX IF NOT EXISTS "contribution_votes_userId_contributionId_key" ON "contribution_votes"("userId", "contributionId");

CREATE INDEX IF NOT EXISTS "contribution_comments_contributionId_idx" ON "contribution_comments"("contributionId");
CREATE INDEX IF NOT EXISTS "contribution_comments_userId_idx" ON "contribution_comments"("userId");
CREATE INDEX IF NOT EXISTS "contribution_comments_createdAt_idx" ON "contribution_comments"("createdAt");

CREATE UNIQUE INDEX IF NOT EXISTS "contes_slug_key" ON "contes"("slug");
CREATE INDEX IF NOT EXISTS "contes_status_idx" ON "contes"("status");
CREATE INDEX IF NOT EXISTS "contes_isFeatured_idx" ON "contes"("isFeatured");
CREATE INDEX IF NOT EXISTS "contes_createdAt_idx" ON "contes"("createdAt");

CREATE INDEX IF NOT EXISTS "conte_paragraphs_conteId_idx" ON "conte_paragraphs"("conteId");
CREATE UNIQUE INDEX IF NOT EXISTS "conte_paragraphs_conteId_paragraphNumber_key" ON "conte_paragraphs"("conteId", "paragraphNumber");

CREATE UNIQUE INDEX IF NOT EXISTS "kabaries_slug_key" ON "kabaries"("slug");
CREATE INDEX IF NOT EXISTS "kabaries_status_idx" ON "kabaries"("status");
CREATE INDEX IF NOT EXISTS "kabaries_occasion_idx" ON "kabaries"("occasion");
CREATE INDEX IF NOT EXISTS "kabaries_createdAt_idx" ON "kabaries"("createdAt");

CREATE INDEX IF NOT EXISTS "kabary_steps_kabaryId_idx" ON "kabary_steps"("kabaryId");
CREATE UNIQUE INDEX IF NOT EXISTS "kabary_steps_kabaryId_stepNumber_key" ON "kabary_steps"("kabaryId", "stepNumber");

CREATE INDEX IF NOT EXISTS "true_false_questions_theme_idx" ON "true_false_questions"("theme");
CREATE INDEX IF NOT EXISTS "true_false_questions_difficulty_idx" ON "true_false_questions"("difficulty");
CREATE INDEX IF NOT EXISTS "true_false_questions_status_idx" ON "true_false_questions"("status");
CREATE INDEX IF NOT EXISTS "true_false_sessions_userId_idx" ON "true_false_sessions"("userId");
CREATE INDEX IF NOT EXISTS "true_false_sessions_createdAt_idx" ON "true_false_sessions"("createdAt");
CREATE INDEX IF NOT EXISTS "true_false_answers_sessionId_idx" ON "true_false_answers"("sessionId");
CREATE INDEX IF NOT EXISTS "true_false_answers_questionId_idx" ON "true_false_answers"("questionId");

CREATE UNIQUE INDEX IF NOT EXISTS "module_locks_key_key" ON "module_locks"("key");

CREATE INDEX IF NOT EXISTS "notifications_userId_idx" ON "notifications"("userId");
CREATE INDEX IF NOT EXISTS "notifications_category_idx" ON "notifications"("category");
CREATE INDEX IF NOT EXISTS "notifications_createdAt_idx" ON "notifications"("createdAt");

CREATE UNIQUE INDEX IF NOT EXISTS "word_puzzle_levels_levelNumber_key" ON "word_puzzle_levels"("levelNumber");
CREATE INDEX IF NOT EXISTS "word_puzzle_levels_levelNumber_idx" ON "word_puzzle_levels"("levelNumber");
CREATE INDEX IF NOT EXISTS "word_puzzle_levels_status_idx" ON "word_puzzle_levels"("status");
CREATE INDEX IF NOT EXISTS "word_puzzle_sentences_levelId_idx" ON "word_puzzle_sentences"("levelId");
CREATE INDEX IF NOT EXISTS "word_puzzle_sentences_orderIndex_idx" ON "word_puzzle_sentences"("orderIndex");

CREATE UNIQUE INDEX IF NOT EXISTS "missing_word_levels_levelNumber_key" ON "missing_word_levels"("levelNumber");
CREATE INDEX IF NOT EXISTS "missing_word_levels_levelNumber_idx" ON "missing_word_levels"("levelNumber");
CREATE INDEX IF NOT EXISTS "missing_word_levels_status_idx" ON "missing_word_levels"("status");
CREATE INDEX IF NOT EXISTS "missing_word_questions_levelId_idx" ON "missing_word_questions"("levelId");
CREATE INDEX IF NOT EXISTS "missing_word_questions_orderIndex_idx" ON "missing_word_questions"("orderIndex");

CREATE INDEX IF NOT EXISTS "user_progress_totalXp_idx" ON "user_progress"("totalXp" DESC);
CREATE UNIQUE INDEX IF NOT EXISTS "game_progressions_userId_gameType_key" ON "game_progressions"("userId", "gameType");
CREATE INDEX IF NOT EXISTS "xp_transactions_userId_idx" ON "xp_transactions"("userId");
CREATE INDEX IF NOT EXISTS "user_badges_userId_idx" ON "user_badges"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "user_badges_userId_badgeId_key" ON "user_badges"("userId", "badgeId");

CREATE UNIQUE INDEX IF NOT EXISTS "poesies_slug_key" ON "poesies"("slug");
CREATE INDEX IF NOT EXISTS "poesies_status_idx" ON "poesies"("status");
CREATE INDEX IF NOT EXISTS "poesies_isFeatured_idx" ON "poesies"("isFeatured");
CREATE INDEX IF NOT EXISTS "poesies_createdAt_idx" ON "poesies"("createdAt");
CREATE INDEX IF NOT EXISTS "poesie_stanzas_poesieId_idx" ON "poesie_stanzas"("poesieId");
CREATE UNIQUE INDEX IF NOT EXISTS "poesie_stanzas_poesieId_stanzaNumber_key" ON "poesie_stanzas"("poesieId", "stanzaNumber");

CREATE UNIQUE INDEX IF NOT EXISTS "recitations_slug_key" ON "recitations"("slug");
CREATE INDEX IF NOT EXISTS "recitations_status_idx" ON "recitations"("status");
CREATE INDEX IF NOT EXISTS "recitations_isFeatured_idx" ON "recitations"("isFeatured");
CREATE INDEX IF NOT EXISTS "recitations_createdAt_idx" ON "recitations"("createdAt");

CREATE UNIQUE INDEX IF NOT EXISTS "civic_contents_slug_key" ON "civic_contents"("slug");
CREATE INDEX IF NOT EXISTS "civic_contents_subCategory_idx" ON "civic_contents"("subCategory");
CREATE INDEX IF NOT EXISTS "civic_contents_status_idx" ON "civic_contents"("status");
CREATE INDEX IF NOT EXISTS "civic_contents_createdAt_idx" ON "civic_contents"("createdAt");
CREATE INDEX IF NOT EXISTS "civic_structure_roles_civicContentId_idx" ON "civic_structure_roles"("civicContentId");

CREATE INDEX IF NOT EXISTS "civic_quiz_questions_category_idx" ON "civic_quiz_questions"("category");
CREATE INDEX IF NOT EXISTS "civic_quiz_questions_difficulty_idx" ON "civic_quiz_questions"("difficulty");
CREATE INDEX IF NOT EXISTS "civic_quiz_questions_status_idx" ON "civic_quiz_questions"("status");

CREATE UNIQUE INDEX IF NOT EXISTS "duel_sessions_code_key" ON "duel_sessions"("code");
CREATE INDEX IF NOT EXISTS "duel_sessions_code_idx" ON "duel_sessions"("code");
CREATE INDEX IF NOT EXISTS "duel_sessions_status_idx" ON "duel_sessions"("status");
CREATE INDEX IF NOT EXISTS "duel_sessions_player1Id_idx" ON "duel_sessions"("player1Id");
CREATE INDEX IF NOT EXISTS "duel_sessions_player2Id_idx" ON "duel_sessions"("player2Id");
CREATE INDEX IF NOT EXISTS "duel_players_sessionId_idx" ON "duel_players"("sessionId");
CREATE INDEX IF NOT EXISTS "duel_players_userId_idx" ON "duel_players"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "duel_players_sessionId_userId_key" ON "duel_players"("sessionId", "userId");
CREATE INDEX IF NOT EXISTS "duel_answers_sessionId_idx" ON "duel_answers"("sessionId");
CREATE INDEX IF NOT EXISTS "duel_answers_userId_idx" ON "duel_answers"("userId");

CREATE INDEX IF NOT EXISTS "system_announcements_isActive_idx" ON "system_announcements"("isActive");

CREATE INDEX IF NOT EXISTS "riddle_questions_level_idx" ON "riddle_questions"("level");
CREATE INDEX IF NOT EXISTS "riddle_questions_status_idx" ON "riddle_questions"("status");
CREATE INDEX IF NOT EXISTS "riddle_sessions_userId_idx" ON "riddle_sessions"("userId");
CREATE INDEX IF NOT EXISTS "riddle_sessions_createdAt_idx" ON "riddle_sessions"("createdAt");
CREATE INDEX IF NOT EXISTS "riddle_answers_sessionId_idx" ON "riddle_answers"("sessionId");
CREATE INDEX IF NOT EXISTS "riddle_answers_questionId_idx" ON "riddle_answers"("questionId");

CREATE INDEX IF NOT EXISTS "civic_quiz_sessions_userId_idx" ON "civic_quiz_sessions"("userId");
CREATE INDEX IF NOT EXISTS "civic_quiz_sessions_createdAt_idx" ON "civic_quiz_sessions"("createdAt");
CREATE INDEX IF NOT EXISTS "civic_quiz_answers_sessionId_idx" ON "civic_quiz_answers"("sessionId");
CREATE INDEX IF NOT EXISTS "civic_quiz_answers_questionId_idx" ON "civic_quiz_answers"("questionId");

CREATE UNIQUE INDEX IF NOT EXISTS "vintana_signs_nameMg_key" ON "vintana_signs"("nameMg");
CREATE INDEX IF NOT EXISTS "vintana_forecasts_date_idx" ON "vintana_forecasts"("date");
CREATE UNIQUE INDEX IF NOT EXISTS "vintana_forecasts_signId_date_key" ON "vintana_forecasts"("signId", "date");

CREATE INDEX IF NOT EXISTS "friendships_senderId_status_idx" ON "friendships"("senderId", "status");
CREATE INDEX IF NOT EXISTS "friendships_receiverId_status_idx" ON "friendships"("receiverId", "status");
CREATE UNIQUE INDEX IF NOT EXISTS "friendships_senderId_receiverId_key" ON "friendships"("senderId", "receiverId");

CREATE INDEX IF NOT EXISTS "encouragements_senderId_date_idx" ON "encouragements"("senderId", "date");
CREATE INDEX IF NOT EXISTS "encouragements_receiverId_date_idx" ON "encouragements"("receiverId", "date");
CREATE UNIQUE INDEX IF NOT EXISTS "encouragements_senderId_receiverId_date_key" ON "encouragements"("senderId", "receiverId", "date");

CREATE INDEX IF NOT EXISTS "civic_lessons_status_idx" ON "civic_lessons"("status");
CREATE INDEX IF NOT EXISTS "civic_lessons_orderIndex_idx" ON "civic_lessons"("orderIndex");
CREATE INDEX IF NOT EXISTS "presidents_status_idx" ON "presidents"("status");
CREATE INDEX IF NOT EXISTS "presidents_orderIndex_idx" ON "presidents"("orderIndex");
CREATE INDEX IF NOT EXISTS "banknotes_status_idx" ON "banknotes"("status");
CREATE INDEX IF NOT EXISTS "banknotes_series_idx" ON "banknotes"("series");
CREATE INDEX IF NOT EXISTS "banknotes_orderIndex_idx" ON "banknotes"("orderIndex");
CREATE INDEX IF NOT EXISTS "province_blasons_status_idx" ON "province_blasons"("status");
CREATE INDEX IF NOT EXISTS "province_blasons_orderIndex_idx" ON "province_blasons"("orderIndex");
CREATE INDEX IF NOT EXISTS "nature_emblems_status_idx" ON "nature_emblems"("status");
CREATE INDEX IF NOT EXISTS "nature_emblems_type_idx" ON "nature_emblems"("type");
CREATE INDEX IF NOT EXISTS "nature_emblems_orderIndex_idx" ON "nature_emblems"("orderIndex");
CREATE INDEX IF NOT EXISTS "history_dates_status_idx" ON "history_dates"("status");
CREATE INDEX IF NOT EXISTS "history_dates_orderIndex_idx" ON "history_dates"("orderIndex");
CREATE INDEX IF NOT EXISTS "national_emblems_status_idx" ON "national_emblems"("status");
CREATE INDEX IF NOT EXISTS "national_emblems_orderIndex_idx" ON "national_emblems"("orderIndex");

-- -------------------------
-- Foreign Keys for new tables
-- -------------------------

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "contribution_votes" ADD CONSTRAINT "contribution_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "contribution_votes" ADD CONSTRAINT "contribution_votes_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "contributions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "contribution_comments" ADD CONSTRAINT "contribution_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "contribution_comments" ADD CONSTRAINT "contribution_comments_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "contributions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "conte_paragraphs" ADD CONSTRAINT "conte_paragraphs_conteId_fkey" FOREIGN KEY ("conteId") REFERENCES "contes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "conte_themes" ADD CONSTRAINT "conte_themes_conteId_fkey" FOREIGN KEY ("conteId") REFERENCES "contes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "conte_themes" ADD CONSTRAINT "conte_themes_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "kabary_steps" ADD CONSTRAINT "kabary_steps_kabaryId_fkey" FOREIGN KEY ("kabaryId") REFERENCES "kabaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "kabary_themes" ADD CONSTRAINT "kabary_themes_kabaryId_fkey" FOREIGN KEY ("kabaryId") REFERENCES "kabaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "kabary_themes" ADD CONSTRAINT "kabary_themes_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "true_false_answers" ADD CONSTRAINT "true_false_answers_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "true_false_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "true_false_answers" ADD CONSTRAINT "true_false_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "true_false_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "word_puzzle_sentences" ADD CONSTRAINT "word_puzzle_sentences_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "word_puzzle_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "missing_word_questions" ADD CONSTRAINT "missing_word_questions_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "missing_word_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "game_progressions" ADD CONSTRAINT "game_progressions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "xp_transactions" ADD CONSTRAINT "xp_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "poesie_stanzas" ADD CONSTRAINT "poesie_stanzas_poesieId_fkey" FOREIGN KEY ("poesieId") REFERENCES "poesies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "civic_structure_roles" ADD CONSTRAINT "civic_structure_roles_civicContentId_fkey" FOREIGN KEY ("civicContentId") REFERENCES "civic_contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "duel_players" ADD CONSTRAINT "duel_players_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "duel_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "duel_answers" ADD CONSTRAINT "duel_answers_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "duel_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "riddle_answers" ADD CONSTRAINT "riddle_answers_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "riddle_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "riddle_answers" ADD CONSTRAINT "riddle_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "riddle_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "civic_quiz_answers" ADD CONSTRAINT "civic_quiz_answers_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "civic_quiz_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "civic_quiz_answers" ADD CONSTRAINT "civic_quiz_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "civic_quiz_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "vintana_forecasts" ADD CONSTRAINT "vintana_forecasts_signId_fkey" FOREIGN KEY ("signId") REFERENCES "vintana_signs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "friendships" ADD CONSTRAINT "friendships_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "encouragements" ADD CONSTRAINT "encouragements_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "encouragements" ADD CONSTRAINT "encouragements_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Foreign keys for favorites (new columns)
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_conteId_fkey" FOREIGN KEY ("conteId") REFERENCES "contes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_kabaryId_fkey" FOREIGN KEY ("kabaryId") REFERENCES "kabaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_poesieId_fkey" FOREIGN KEY ("poesieId") REFERENCES "poesies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_recitationId_fkey" FOREIGN KEY ("recitationId") REFERENCES "recitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Foreign keys for likes (new columns)
ALTER TABLE "likes" ADD CONSTRAINT "likes_conteId_fkey" FOREIGN KEY ("conteId") REFERENCES "contes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "likes" ADD CONSTRAINT "likes_kabaryId_fkey" FOREIGN KEY ("kabaryId") REFERENCES "kabaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "likes" ADD CONSTRAINT "likes_poesieId_fkey" FOREIGN KEY ("poesieId") REFERENCES "poesies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "likes" ADD CONSTRAINT "likes_recitationId_fkey" FOREIGN KEY ("recitationId") REFERENCES "recitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "likes" ADD CONSTRAINT "likes_civicContentId_fkey" FOREIGN KEY ("civicContentId") REFERENCES "civic_contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
