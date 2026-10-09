import 'dotenv/config';
import pg from 'pg';

async function main() {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const countBefore = await client.query('SELECT count(*) FROM notifications');
  console.log('Notifications avant purge :', countBefore.rows[0].count);

  const res = await client.query('DELETE FROM notifications');
  console.log(`✅ ${res.rowCount} notification(s) de test/mock supprimée(s) avec succès de la base de données.`);

  const countAfter = await client.query('SELECT count(*) FROM notifications');
  console.log('Notifications après purge :', countAfter.rows[0].count);

  await client.end();
}

main().catch(console.error);
