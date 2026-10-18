import 'dotenv/config';
import pg from 'pg';

const sql = `
-- Ajout des colonnes de liaison contribution et commentaire sur content_reports
ALTER TABLE "content_reports" 
  ADD COLUMN IF NOT EXISTS "contributionId" TEXT,
  ADD COLUMN IF NOT EXISTS "commentId" TEXT;

-- Ajout des contraintes de clés étrangères (idempotent)
DO $$ BEGIN
  ALTER TABLE "content_reports" 
    ADD CONSTRAINT "content_reports_contributionId_fkey" 
    FOREIGN KEY ("contributionId") REFERENCES "contributions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "content_reports" 
    ADD CONSTRAINT "content_reports_commentId_fkey" 
    FOREIGN KEY ("commentId") REFERENCES "contribution_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Index pour optimiser les filtres de modération admin
CREATE INDEX IF NOT EXISTS "content_reports_contributionId_idx" ON "content_reports"("contributionId");
CREATE INDEX IF NOT EXISTS "content_reports_commentId_idx" ON "content_reports"("commentId");
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
    console.log(
      '✅ DDL content_reports (contributionId, commentId) appliqué avec succès !',
    );
  } catch (err) {
    console.error("❌ Erreur d'application DDL:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

void main();
