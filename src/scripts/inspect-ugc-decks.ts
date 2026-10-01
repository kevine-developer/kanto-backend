import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const decks = await prisma.userQuizSet.findMany({
    select: {
      id: true,
      title: true,
      isPublic: true,
      visibility: true,
      verified: true,
      playsCount: true,
      category: true,
      authorId: true,
      _count: { select: { questions: true } },
    },
  });
  console.log('TOTAL DECKS IN DB:', decks.length);
  for (const d of decks) {
    console.log(
      `- [${d.id}] "${d.title}" | category="${d.category}" | isPublic=${d.isPublic} | visibility=${d.visibility} | verified=${d.verified} | questions=${d._count.questions} | authorId=${d.authorId}`,
    );
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
