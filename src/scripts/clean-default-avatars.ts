import 'dotenv/config';
import { Client } from 'pg';

/**
 * Script de nettoyage des avatars par défaut en base de données.
 * Réinitialise à null toute image pointant vers default-avatar ou des artefacts Cloudinary default_avatar.
 * Les clients (mobile et admin) afficheront directement le logo officiel de l'application.
 */
async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ DATABASE_URL non définie');
    process.exit(1);
  }

  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('🔌 Connecté à PostgreSQL.');

    const res = await client.query(`
      UPDATE "users"
      SET "image" = NULL
      WHERE "image" ILIKE '%default-avatar%'
         OR "image" ILIKE '%default_avatar%';
    `);

    console.log(
      `✅ Nettoyage terminé avec succès : ${res.rowCount} utilisateur(s) mis à jour (image réinitialisée à null).`,
    );
  } catch (err) {
    console.error('❌ Erreur lors du nettoyage des avatars :', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

void main();
