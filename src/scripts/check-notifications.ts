import 'dotenv/config';
import pg from 'pg';

async function main() {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query('SELECT id, category, "titleMg", "titleFr", "messageMg", "messageFr", "badgeText" FROM notifications ORDER BY "createdAt" DESC LIMIT 20');
  console.log('NOTIFICATIONS COUNT:', res.rows.length);
  for (const row of res.rows) {
    console.log('---');
    console.log('ID:', row.id);
    console.log('Category:', row.category);
    console.log('TitleMg:', row.titleMg);
    console.log('TitleFr:', row.titleFr);
    console.log('MessageMg:', row.messageMg);
    console.log('MessageFr:', row.messageFr);
    console.log('BadgeText:', row.badgeText);
  }
  await client.end();
}

main().catch(console.error);
