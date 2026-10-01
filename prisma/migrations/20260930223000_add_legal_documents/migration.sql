-- Migration: add_legal_documents
-- Ajout de la table pour la gestion dynamique des CGU et documents légaux depuis l'administration

CREATE TABLE IF NOT EXISTS "legal_documents" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "effectiveDate" TEXT,
    "contentHtml" TEXT NOT NULL,
    "summary" TEXT,
    "requiresConsent" BOOLEAN NOT NULL DEFAULT true,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "legal_documents_pkey" PRIMARY KEY ("id")
);

-- Index unique sur le slug
CREATE UNIQUE INDEX IF NOT EXISTS "legal_documents_slug_key" ON "legal_documents"("slug");
CREATE INDEX IF NOT EXISTS "legal_documents_slug_idx" ON "legal_documents"("slug");
