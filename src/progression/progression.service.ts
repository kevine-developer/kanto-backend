import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SyncProgressionDto } from './dto/sync-progression.dto.js';

@Injectable()
export class ProgressionService {
  private readonly logger = new Logger(ProgressionService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Récupère la progression globale et par jeu d'un utilisateur.
   */
  async getProgression(userId: string) {
    let progress = await this.prisma.userProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      // Créer une progression par défaut si elle n'existe pas
      progress = await this.prisma.userProgress.create({
        data: { userId, totalXp: 0, level: 1, coins: 0, streakDays: 0 },
      });
    }

    const gameProgressions = await this.prisma.gameProgression.findMany({
      where: { userId },
    });

    return { progress, games: gameProgressions };
  }

  /**
   * Synchronise les points d'XP accumulés (hors ligne) et les progressions.
   */
  async syncProgression(userId: string, dto: SyncProgressionDto) {
    this.logger.log(
      `Synchronisation de la progression pour l'utilisateur ${userId}`,
    );

    return this.prisma.$transaction(async (tx) => {
      // 1. Gérer les transactions XP (XP accumulée offline)
      let totalXpToAdd = 0;
      if (dto.xpTransactions && dto.xpTransactions.length > 0) {
        for (const xpTx of dto.xpTransactions) {
          const safeAmount = Math.round(Number(xpTx.amount) * 100) / 100;
          if (safeAmount <= 0) continue;

          // Si source de type lecture unique ("reading_time:<itemId>"), vérifier si déjà existante
          if (xpTx.source && xpTx.source.startsWith('reading_time:')) {
            const existing = await tx.xpTransaction.findFirst({
              where: {
                userId,
                source: xpTx.source,
              },
            });
            if (existing) {
              // Déjà attribué pour cet élément, ignorer pour éviter tout double-compte
              continue;
            }
          }

          totalXpToAdd = Math.round((totalXpToAdd + safeAmount) * 100) / 100;
          await tx.xpTransaction.create({
            data: {
              userId,
              amount: safeAmount,
              source: xpTx.source,
              description: xpTx.description,
            },
          });
        }
      }

      // 2. Mettre à jour UserProgress
      let progress = await tx.userProgress.findUnique({ where: { userId } });
      if (!progress) {
        const initialLevel = this.calculateLevel(totalXpToAdd);
        progress = await tx.userProgress.create({
          data: {
            userId,
            totalXp: totalXpToAdd,
            level: initialLevel,
            coins:
              initialLevel > 1 ? this.calculateLevelUpCoins(initialLevel) : 0,
          },
        });
      } else if (totalXpToAdd > 0) {
        const newTotal =
          Math.round((progress.totalXp + totalXpToAdd) * 100) / 100;
        const previousLevel = progress.level || 1;
        const newLevel = this.calculateLevel(newTotal);

        let additionalCoins = 0;
        if (newLevel > previousLevel) {
          // Attribuer les pièces pour chaque niveau franchi
          for (let lvl = previousLevel + 1; lvl <= newLevel; lvl++) {
            additionalCoins += this.calculateLevelUpCoins(lvl);
          }
        }

        progress = await tx.userProgress.update({
          where: { userId },
          data: {
            totalXp: newTotal,
            level: newLevel,
            coins: (progress.coins || 0) + additionalCoins,
          },
        });
      }

      // 3. Mettre à jour GameProgressions (niveaux débloqués, étoiles)
      if (dto.games && dto.games.length > 0) {
        for (const game of dto.games) {
          await tx.gameProgression.upsert({
            where: {
              userId_gameType: {
                userId,
                gameType: game.gameType,
              },
            },
            update: {
              unlockedLevelIndex: {
                set: Math.max(game.unlockedLevelIndex, 0),
              },
              levelStars: game.levelStars,
            },
            create: {
              userId,
              gameType: game.gameType,
              unlockedLevelIndex: game.unlockedLevelIndex,
              levelStars: game.levelStars,
            },
          });
        }
      }

      const updatedGames = await tx.gameProgression.findMany({
        where: { userId },
      });
      return { progress, games: updatedGames };
    });
  }

  /**
   * Calcule le bonus de pièces lors de la montée à un niveau donné.
   */
  private calculateLevelUpCoins(level: number): number {
    return Math.max(25, level * 25);
  }

  /**
   * Calcule le niveau basé sur l'XP total (aligné sur l'échelle culturelle Kanto).
   */
  private calculateLevel(xp: number): number {
    const safeXp = Math.max(0, xp || 0);
    const LEVEL_THRESHOLDS = [
      { level: 1, minXp: 0 },
      { level: 2, minXp: 50 },
      { level: 3, minXp: 150 },
      { level: 4, minXp: 300 },
      { level: 5, minXp: 500 },
      { level: 6, minXp: 800 },
      { level: 7, minXp: 1200 },
      { level: 8, minXp: 1700 },
      { level: 9, minXp: 2300 },
      { level: 10, minXp: 3000 },
    ];

    let currentLevel = 1;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (safeXp >= LEVEL_THRESHOLDS[i].minXp) {
        currentLevel = LEVEL_THRESHOLDS[i].level;
        break;
      }
    }

    if (safeXp >= 3000) {
      const extraLevels = Math.floor((safeXp - 3000) / 1000);
      currentLevel = 10 + extraLevels;
    }

    return currentLevel;
  }
}
