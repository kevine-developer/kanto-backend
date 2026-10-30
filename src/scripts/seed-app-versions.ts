import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedAppVersions() {
  console.log('🌱 Seeding App Versions...');

  // Nettoyage préalable pour idempotence
  await prisma.appVersion.deleteMany({});

  // Version 0.0.20 Android (facultative)
  const androidVersion = await prisma.appVersion.create({
    data: {
      platform: 'android',
      version: '0.0.20',
      minVersion: '0.0.18',
      buildNumber: 30,
      titleFr: 'Une nouvelle version est disponible !',
      titleMg: 'Misy kinova vaovao azo ampiasaina !',
      messageFr:
        'Kanto MG évolue pour vous offrir une meilleure expérience. Découvrez les nouveautés et profitez des dernières améliorations.',
      messageMg:
        'Mivoatra ny Kanto MG mba hanomezana anao traikefa tsaratsara kokoa. Fantaro ireo zava-baovao ary ankafizo ireo fanatsarana farany.',
      releaseNotesFr: [
        'Amélioration de la fluidité des rituels quotidiens',
        'Nouveaux contes et proverbes enrichis',
        'Optimisations de performances et corrections de bugs mineurs',
      ],
      releaseNotesMg: [
        'Fanatsarana ny fandehanan-javatra amin\'ny fomba amam-panao isan\'andro',
        'Angano sy ohabolana vaovao nampiana',
        'Fanafainganana ny fampiharana sy fanitsiana lesoka madinika',
      ],
      storeUrl:
        'https://play.google.com/store/apps/details?id=com.devengalere.kantomg',
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  // Version 0.0.20 iOS
  const iosVersion = await prisma.appVersion.create({
    data: {
      platform: 'ios',
      version: '0.0.20',
      minVersion: '0.0.18',
      buildNumber: 2,
      titleFr: 'Une nouvelle version est disponible !',
      titleMg: 'Misy kinova vaovao azo ampiasaina !',
      messageFr:
        'Kanto MG évolue pour vous offrir une meilleure expérience. Découvrez les nouveautés et profitez des dernières améliorations.',
      messageMg:
        'Mivoatra ny Kanto MG mba hanomezana anao traikefa tsaratsara kokoa. Fantaro ireo zava-baovao ary ankafizo ireo fanatsarana farany.',
      releaseNotesFr: [
        'Amélioration de la fluidité des rituels quotidiens',
        'Nouveaux contes et proverbes enrichis',
        'Optimisations de performances et corrections de bugs mineurs',
      ],
      releaseNotesMg: [
        'Fanatsarana ny fandehanan-javatra amin\'ny fomba amam-panao isan\'andro',
        'Angano sy ohabolana vaovao nampiana',
        'Fanafainganana ny fampiharana sy fanitsiana lesoka madinika',
      ],
      storeUrl: 'https://apps.apple.com/app/kanto-mg/id6738914614',
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  console.log('✅ Seed App Versions complété avec succès :', {
    android: androidVersion.version,
    ios: iosVersion.version,
  });

  await prisma.$disconnect();
  await pool.end();
}

seedAppVersions().catch((err) => {
  console.error('❌ Erreur seed App Versions:', err);
  process.exit(1);
});

