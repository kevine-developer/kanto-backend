import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const COMMUNITY_PLAYERS = [
  { name: 'Rakoto Jean', email: 'rakoto.jean@kanto.mg', totalXp: 3850, level: 12, streakDays: 14 },
  { name: 'Rasoa Marie', email: 'rasoa.marie@kanto.mg', totalXp: 3210, level: 10, streakDays: 9 },
  { name: 'Rabe Patrick', email: 'rabe.patrick@kanto.mg', totalXp: 2980, level: 9, streakDays: 12 },
  { name: 'Nirina Hery', email: 'nirina.hery@kanto.mg', totalXp: 2450, level: 8, streakDays: 7 },
  { name: 'Lalao Fitia', email: 'lalao.fitia@kanto.mg', totalXp: 2200, level: 7, streakDays: 5 },
  { name: 'Fara Miadana', email: 'fara.miadana@kanto.mg', totalXp: 1970, level: 7, streakDays: 6 },
  { name: 'Tiana Solo', email: 'tiana.solo@kanto.mg', totalXp: 1720, level: 6, streakDays: 4 },
  { name: 'Bary Rasolo', email: 'bary.rasolo@kanto.mg', totalXp: 1610, level: 6, streakDays: 5 },
  { name: 'Noro Fenosoa', email: 'noro.fenosoa@kanto.mg', totalXp: 1580, level: 6, streakDays: 4 },
  { name: 'Hanta Vonjy', email: 'hanta.vonjy@kanto.mg', totalXp: 1540, level: 5, streakDays: 3 },
  { name: 'Mamy Zo', email: 'mamy.zo@kanto.mg', totalXp: 1350, level: 5, streakDays: 2 },
  { name: 'Vola Soa', email: 'vola.soa@kanto.mg', totalXp: 1180, level: 4, streakDays: 1 },
];

async function seedLeaderboard() {
  console.log('🏁 Initialisation des compétiteurs et de la progression...');

  // 1. Initialiser les 10 compétiteurs de la communauté
  for (const player of COMMUNITY_PLAYERS) {
    let user = await prisma.user.findUnique({ where: { email: player.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: player.name,
          email: player.email,
          emailVerified: true,
          role: 'USER',
          banned: false,
        },
      });
    }

    await prisma.userProgress.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        totalXp: player.totalXp,
        level: player.level,
        streakDays: player.streakDays,
        coins: player.level * 25,
      },
      update: {
        totalXp: player.totalXp,
        level: player.level,
        streakDays: player.streakDays,
      },
    });
  }

  // 2. Initialiser la progression de l'utilisateur connecté Roland
  const roland = await prisma.user.findFirst({
    where: { email: 'roliannerose@gmail.com' },
  });

  if (roland) {
    await prisma.userProgress.upsert({
      where: { userId: roland.id },
      create: {
        userId: roland.id,
        totalXp: 1650, // Permet à Roland de se positionner au rang 8, juste devant Hanta Vonjy (1540 XP)
        level: 6,
        streakDays: 3,
        coins: 150,
      },
      update: {
        totalXp: 1650,
        level: 6,
        streakDays: 3,
      },
    });
    console.log(`✅ Progression de ${roland.name} (${roland.id}) initialisée à 1650 XP !`);
  }

  const totalProgress = await prisma.userProgress.count();
  console.log(`🎉 Total de joueurs dans le classement en BDD : ${totalProgress}`);
}

seedLeaderboard()
  .catch(console.error)
  .finally(() => pool.end());
