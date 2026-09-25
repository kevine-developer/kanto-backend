import 'dotenv/config';
import pg from 'pg';

const sql = `
DO $$ BEGIN
  CREATE TYPE "ModuleType" AS ENUM ('GAME', 'CATEGORY', 'FEATURE');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "module_locks" (
  "id" TEXT PRIMARY KEY,
  "key" TEXT UNIQUE NOT NULL,
  "type" "ModuleType" NOT NULL,
  "nameFr" TEXT NOT NULL,
  "nameMg" TEXT NOT NULL,
  "imageUrl" TEXT,
  "bgImageUrl" TEXT,
  "isLocked" BOOLEAN NOT NULL DEFAULT false,
  "lockReason" TEXT,
  "minTier" TEXT DEFAULT 'FREE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Rétrocompatibilité : ajout des colonnes si la table existait déjà
ALTER TABLE "module_locks" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "module_locks" ADD COLUMN IF NOT EXISTS "bgImageUrl" TEXT;
ALTER TABLE "module_locks" ADD COLUMN IF NOT EXISTS "minTier" TEXT DEFAULT 'FREE';

CREATE INDEX IF NOT EXISTS "module_locks_type_idx" ON "module_locks"("type");
CREATE INDEX IF NOT EXISTS "module_locks_isLocked_idx" ON "module_locks"("isLocked");
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
    console.log('✅ DDL module_locks appliqué avec succès !');
  } catch (err) {
    console.error("❌ Erreur d'application DDL:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

void main();
