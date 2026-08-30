import 'dotenv/config';
import pg from 'pg';

const sql = `
ALTER TABLE "module_locks" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
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
    console.log('✅ Colonne imageUrl ajoutée avec succès à module_locks !');
  } catch (err) {
    console.error("❌ Erreur d'application DDL:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

void main();
