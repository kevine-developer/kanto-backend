import 'dotenv/config';
import pg from 'pg';

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

    console.log('🚀 Application de la migration pour les likes civiques...');

    await client.query(`
      ALTER TABLE "civic_contents" ADD COLUMN IF NOT EXISTS "likesCount" INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE "likes" ADD COLUMN IF NOT EXISTS "civicContentId" TEXT;
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'likes_civicContentId_fkey'
        ) THEN
          ALTER TABLE "likes" ADD CONSTRAINT "likes_civicContentId_fkey"
            FOREIGN KEY ("civicContentId") REFERENCES "civic_contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$;
      CREATE UNIQUE INDEX IF NOT EXISTS "likes_userId_civicContentId_key" ON "likes"("userId", "civicContentId");
    `);

    console.log('✅ Migration SQL des likes civiques exécutée avec succès !');
  } catch (err) {
    console.error('❌ Erreur migration:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

void main();
