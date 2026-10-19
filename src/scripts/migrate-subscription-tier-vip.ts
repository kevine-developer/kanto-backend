import 'dotenv/config';
import pg from 'pg';

const sql = `
-- 1. Ajout de la valeur VIP à l'enum SubscriptionTier
DO $$ BEGIN
  ALTER TYPE "SubscriptionTier" ADD VALUE IF NOT EXISTS 'VIP';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Création de la table admin_audit_logs si elle n'existe pas encore
CREATE TABLE IF NOT EXISTS "admin_audit_logs" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "userName" TEXT,
  "action" TEXT NOT NULL,
  "targetType" TEXT NOT NULL,
  "targetId" TEXT NOT NULL,
  "targetLabel" TEXT,
  "reason" TEXT,
  "details" JSONB,
  "ipAddress" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "admin_audit_logs_userId_idx" ON "admin_audit_logs"("userId");
CREATE INDEX IF NOT EXISTS "admin_audit_logs_action_idx" ON "admin_audit_logs"("action");
CREATE INDEX IF NOT EXISTS "admin_audit_logs_targetType_idx" ON "admin_audit_logs"("targetType");
CREATE INDEX IF NOT EXISTS "admin_audit_logs_createdAt_idx" ON "admin_audit_logs"("createdAt");

-- 3. Enum WordRarity et table raki_teny_words pour les mots rares
DO $$ BEGIN
  CREATE TYPE "WordRarity" AS ENUM ('LITERAL', 'VERY_RARE', 'ARCHAIC', 'POETIC', 'PROVERBIAL');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "raki_teny_words" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT UNIQUE NOT NULL,
  "word" TEXT NOT NULL,
  "phonetic" TEXT,
  "category" TEXT NOT NULL DEFAULT 'nature_temps',
  "wordClassMg" TEXT NOT NULL,
  "wordClassFr" TEXT NOT NULL,
  "rarity" "WordRarity" NOT NULL DEFAULT 'VERY_RARE',
  "rarityLabelMg" TEXT NOT NULL,
  "rarityLabelFr" TEXT NOT NULL,
  "meaningMg" TEXT NOT NULL,
  "meaningFr" TEXT NOT NULL,
  "exampleMg" TEXT NOT NULL,
  "exampleFr" TEXT NOT NULL,
  "contextUsage" TEXT NOT NULL,
  "etymology" TEXT,
  "audioUrl" TEXT,
  "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "viewCount" INTEGER NOT NULL DEFAULT 0,
  "likesCount" INTEGER NOT NULL DEFAULT 0,
  "shareCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "raki_teny_words_status_idx" ON "raki_teny_words"("status");
CREATE INDEX IF NOT EXISTS "raki_teny_words_rarity_idx" ON "raki_teny_words"("rarity");
CREATE INDEX IF NOT EXISTS "raki_teny_words_category_idx" ON "raki_teny_words"("category");
CREATE INDEX IF NOT EXISTS "raki_teny_words_word_idx" ON "raki_teny_words"("word");
CREATE INDEX IF NOT EXISTS "raki_teny_words_createdAt_idx" ON "raki_teny_words"("createdAt");
`;

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ DATABASE_URL non définie');
    process.exit(1);
  }

  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    console.log('🔌 Connecté à PostgreSQL');
    await client.query(sql);
    console.log('✅ DDL VIP, admin_audit_logs et raki_teny_words appliqués avec succès !');
  } catch (err) {
    console.error("❌ Erreur d'application DDL:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

void main();
