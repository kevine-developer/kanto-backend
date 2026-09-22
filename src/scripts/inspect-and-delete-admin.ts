import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔍 Recherche des administrateurs actuels...');

  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  console.log(`📋 Administrateurs trouvés (${admins.length}) :`, admins);

  const targetEmail =
    process.env.DEFAULT_ADMIN_EMAIL || 'yvesnarsonkevine@gmail.com';
  console.log(`🗑️ Suppression de l'administrateur (${targetEmail})...`);

  // Supprimer les utilisateurs correspondants
  const deleteResult = await prisma.user.deleteMany({
    where: {
      OR: [{ role: 'ADMIN' }, { email: targetEmail }],
    },
  });

  console.log(
    `✅ ${deleteResult.count} compte(s) administrateur supprimé(s) avec succès de la base de données.`,
  );
}

main()
  .catch((err) => {
    console.error('❌ Erreur lors de la suppression :', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
