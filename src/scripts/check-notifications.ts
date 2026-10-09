import 'dotenv/config';
import pg from 'pg';

async function main() {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const countRes = await client.query('SELECT count(*) FROM notifications');
  console.log('TOTAL EN BDD:', countRes.rows[0].count);
  const res = await client.query(
    'SELECT id, "userId", "isBroadcast", category, "titleMg", "titleFr", "createdAt" FROM notifications ORDER BY "createdAt" DESC',
  );
  for (const row of res.rows) {
    console.log('ID:', row.id, '| UserId:', row.userId, '| isBroadcast:', row.isBroadcast, '| Title:', row.titleFr || row.titleMg, '| Date:', row.createdAt);
  }
  await client.end();
}

main().catch(console.error);
