-- =============================================================================
-- Migration additive Kanto AI (Copilote Marketing & Studio Éditorial)
-- Aucune table ou donnée existante n'est altérée ou supprimée.
-- =============================================================================

-- CreateEnum
CREATE TYPE "AiMessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM', 'TOOL');

-- CreateEnum
CREATE TYPE "AiKnowledgeStatus" AS ENUM ('DRAFT', 'VALIDATED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AiKnowledgeVisibility" AS ENUM ('ADMIN_ONLY', 'INTERNAL_TEAM');

-- CreateEnum
CREATE TYPE "AiFeatureStatus" AS ENUM ('AVAILABLE', 'BETA', 'IN_DEVELOPMENT', 'PLANNED', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "AiDraftStatus" AS ENUM ('DRAFT', 'READY', 'APPROVED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AiCampaignStatus" AS ENUM ('DRAFT', 'IN_PREPARATION', 'SCHEDULED', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "ai_marketing_campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "description" TEXT,
    "targetAudience" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "platforms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "AiCampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "resultsNotes" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_marketing_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_conversations" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "adminEmail" TEXT,
    "title" TEXT NOT NULL DEFAULT 'Nouvelle session éditoriale',
    "contextSummary" TEXT,
    "defaultPlatform" TEXT DEFAULT 'FACEBOOK',
    "defaultLanguage" TEXT DEFAULT 'BILINGUAL',
    "defaultTone" TEXT DEFAULT 'EDITORIAL',
    "campaignId" TEXT,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "AiMessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "toolCallsJson" JSONB,
    "sourcesJson" JSONB,
    "deliverableJson" JSONB,
    "provider" TEXT,
    "model" TEXT,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "estimatedCostUsd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "latencyMs" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_knowledge_documents" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'EDITORIAL',
    "version" TEXT NOT NULL DEFAULT '1.0',
    "source" TEXT NOT NULL DEFAULT 'Equipe Kanto MG',
    "validationStatus" "AiKnowledgeStatus" NOT NULL DEFAULT 'DRAFT',
    "visibilityScope" "AiKnowledgeVisibility" NOT NULL DEFAULT 'ADMIN_ONLY',
    "content" TEXT NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "validatedAt" TIMESTAMP(3),
    "lastIndexedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_knowledge_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_knowledge_chunks" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "heading" TEXT,
    "content" TEXT NOT NULL,
    "tokenEstimate" INTEGER NOT NULL DEFAULT 0,
    "embedding" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_knowledge_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_feature_registry" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameMg" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'CORE',
    "status" "AiFeatureStatus" NOT NULL DEFAULT 'AVAILABLE',
    "platforms" TEXT[] DEFAULT ARRAY['android', 'ios']::TEXT[],
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_feature_registry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_marketing_drafts" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT,
    "conversationId" TEXT,
    "sourceMessageId" TEXT,
    "title" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'FACEBOOK',
    "language" TEXT NOT NULL DEFAULT 'FR',
    "tone" TEXT DEFAULT 'EDITORIAL',
    "body" TEXT NOT NULL,
    "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "cta" TEXT,
    "visualConcept" TEXT,
    "visualAspectRatio" TEXT DEFAULT '4:5',
    "imagePrompt" TEXT,
    "sourcesJson" JSONB,
    "status" "AiDraftStatus" NOT NULL DEFAULT 'DRAFT',
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_marketing_drafts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_usage_logs" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "conversationId" TEXT,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "operation" TEXT NOT NULL DEFAULT 'CHAT_STREAM',
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "estimatedCostUsd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "latencyMs" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "errorCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_marketing_campaigns_status_idx" ON "ai_marketing_campaigns"("status");
CREATE INDEX "ai_marketing_campaigns_createdAt_idx" ON "ai_marketing_campaigns"("createdAt" DESC);

CREATE INDEX "ai_conversations_adminUserId_lastMessageAt_idx" ON "ai_conversations"("adminUserId", "lastMessageAt" DESC);
CREATE INDEX "ai_conversations_archivedAt_idx" ON "ai_conversations"("archivedAt");
CREATE INDEX "ai_conversations_campaignId_idx" ON "ai_conversations"("campaignId");

CREATE INDEX "ai_messages_conversationId_createdAt_idx" ON "ai_messages"("conversationId", "createdAt");

CREATE UNIQUE INDEX "ai_knowledge_documents_slug_key" ON "ai_knowledge_documents"("slug");
CREATE INDEX "ai_knowledge_documents_category_validationStatus_idx" ON "ai_knowledge_documents"("category", "validationStatus");
CREATE INDEX "ai_knowledge_documents_validationStatus_visibilityScope_idx" ON "ai_knowledge_documents"("validationStatus", "visibilityScope");
CREATE INDEX "ai_knowledge_documents_updatedAt_idx" ON "ai_knowledge_documents"("updatedAt" DESC);

CREATE UNIQUE INDEX "ai_knowledge_chunks_documentId_chunkIndex_key" ON "ai_knowledge_chunks"("documentId", "chunkIndex");
CREATE INDEX "ai_knowledge_chunks_documentId_idx" ON "ai_knowledge_chunks"("documentId");
-- Index plein texte PostgreSQL 16 pour recherche hybride RAG
CREATE INDEX "ai_knowledge_chunks_fts_idx" ON "ai_knowledge_chunks" USING GIN (to_tsvector('french', COALESCE("heading", '') || ' ' || "content"));

CREATE UNIQUE INDEX "ai_feature_registry_key_key" ON "ai_feature_registry"("key");
CREATE INDEX "ai_feature_registry_status_idx" ON "ai_feature_registry"("status");
CREATE INDEX "ai_feature_registry_category_idx" ON "ai_feature_registry"("category");

CREATE INDEX "ai_marketing_drafts_status_updatedAt_idx" ON "ai_marketing_drafts"("status", "updatedAt" DESC);
CREATE INDEX "ai_marketing_drafts_platform_idx" ON "ai_marketing_drafts"("platform");
CREATE INDEX "ai_marketing_drafts_campaignId_idx" ON "ai_marketing_drafts"("campaignId");
CREATE INDEX "ai_marketing_drafts_conversationId_idx" ON "ai_marketing_drafts"("conversationId");

CREATE INDEX "ai_usage_logs_adminUserId_createdAt_idx" ON "ai_usage_logs"("adminUserId", "createdAt" DESC);
CREATE INDEX "ai_usage_logs_provider_model_idx" ON "ai_usage_logs"("provider", "model");
CREATE INDEX "ai_usage_logs_createdAt_idx" ON "ai_usage_logs"("createdAt" DESC);

-- AddForeignKey
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "ai_marketing_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ai_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_knowledge_chunks" ADD CONSTRAINT "ai_knowledge_chunks_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ai_knowledge_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_marketing_drafts" ADD CONSTRAINT "ai_marketing_drafts_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "ai_marketing_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ai_marketing_drafts" ADD CONSTRAINT "ai_marketing_drafts_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ai_conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ai_usage_logs" ADD CONSTRAINT "ai_usage_logs_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ai_conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
