import 'dotenv/config';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function check() {
  try {
    const tables = ['contributions', 'contes', 'citations', 'kabary'];
    for (const t of tables) {
      const res = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `, [t]);
      console.log(`Table "${t}" has ${res.rows.length} columns:`);
      console.log(res.rows.map(r => r.column_name).join(', '));
    }
    await pool.end();
  } catch (err) {
    console.error('Error during check:', err);
    await pool.end();
  }
}
check();
