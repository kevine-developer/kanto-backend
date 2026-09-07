import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';
import { PrismaService } from '../prisma/prisma.service.js';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  console.log(
    "🔄 Début de la réinitialisation des statistiques d'engagement...",
  );

  try {
    // 1. Vider les tables de tracking
    console.log(
      '🗑️ Suppression des historiques (Like, ViewHistory, Favorite)...',
    );
    await prisma.like.deleteMany({});
    await prisma.viewHistory.deleteMany({});
    await prisma.favorite.deleteMany({});
    console.log('✅ Historiques supprimés.');

    // 2. Réinitialiser les compteurs des MalagasyItem
    console.log('🔄 Réinitialisation des MalagasyItem...');
    await prisma.malagasyItem.updateMany({
      data: {
        likesCount: 0,
        viewCount: 0,
        shareCount: 0,
      },
    });

    // 3. Réinitialiser les compteurs des Citations
    console.log('🔄 Réinitialisation des Citation...');
    await prisma.citation.updateMany({
      data: {
        likesCount: 0,
        viewCount: 0,
        shareCount: 0,
      },
    });

    // 4. Réinitialiser les compteurs des Contes
    console.log('🔄 Réinitialisation des Conte...');
    await prisma.conte.updateMany({
      data: {
        likesCount: 0,
        viewCount: 0,
        shareCount: 0,
      },
    });

    // 5. Réinitialiser les compteurs des Kabary
    console.log('🔄 Réinitialisation des Kabary...');
    await prisma.kabary.updateMany({
      data: {
        likesCount: 0,
        viewCount: 0,
        shareCount: 0,
      },
    });

    console.log('🎉 Réinitialisation terminée avec succès !');
  } catch (e) {
    console.error('❌ Erreur lors de la réinitialisation :', e);
  } finally {
    await app.close();
  }
}

bootstrap();
