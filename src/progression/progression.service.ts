import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import {
  REALTIME_CHANNELS,
  LeaderboardRealtimePayload,
} from '../realtime/realtime.constants.js';
import { SyncProgressionDto } from './dto/sync-progression.dto.js';

/** Bonus XP par palier de streak (jours consécutifs), plafonné à 7 (max 35 XP/jour) */
const STREAK_XP_BONUS = [0, 5, 10, 15, 20, 25, 30, 35];

@Injectable()
export class ProgressionService {
  private readonly logger = new Logger(ProgressionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Récupère la progression globale et par jeu d'un utilisateur.
   */
  async getProgression(userId: string) {
    let progress = await this.prisma.userProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
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
   * Enregistre une connexion quotidienne et met à jour le streak.
   * - Connexion le lendemain → streak++
   * - Connexion le même jour → idempotent (déjà enregistré)
   * - Connexion après un gap → streak repart à 1
   * Bonus XP : 5 XP × min(streakDays, 7) — max 35 XP/jour
   */
  async recordDailyLogin(userId: string): Promise<{
    progress: {
      streakDays: number;
      totalXp: number;
      level: number;
      coins: number;
    };
    xpBonus: number;
    streakStatus: 'continued' | 'started' | 'already_recorded';
  }> {
    const today = this.getDateOnly(new Date());

    const result: {
      progress: {
        streakDays: number;
        totalXp: number;
        level: number;
        coins: number;
      };
      xpBonus: number;
      streakStatus: 'continued' | 'started' | 'already_recorded';
    } = await this.prisma.$transaction(async (tx) => {
      let progress = await tx.userProgress.findUnique({ where: { userId } });

      // Premier enregistrement
      if (!progress) {
        const xpBonus = STREAK_XP_BONUS[1];
        const newLevel = this.calculateLevel(xpBonus);
        progress = await tx.userProgress.create({
          data: {
            userId,
            totalXp: xpBonus,
            level: newLevel,
            coins: 0,
            streakDays: 1,
            lastLoginDate: today,
          },
        });
        if (xpBonus > 0) {
          await tx.xpTransaction.create({
            data: {
              userId,
              amount: xpBonus,
              source: 'daily_login',
              description: 'Premier jour de connexion',
            },
          });
        }
        return {
          progress: {
            streakDays: 1,
            totalXp: xpBonus,
            level: newLevel,
            coins: 0,
          },
          xpBonus,
          streakStatus: 'started' as const,
        };
      }

      const lastLogin = progress.lastLoginDate
        ? this.getDateOnly(new Date(progress.lastLoginDate))
        : null;

      // Même jour → idempotent
      if (lastLogin && this.isSameDay(lastLogin, today)) {
        return {
          progress: {
            streakDays: progress.streakDays,
            totalXp: Math.ceil(Number(progress.totalXp)),
            level: progress.level,
            coins: progress.coins,
          },
          xpBonus: 0,
          streakStatus: 'already_recorded' as const,
        };
      }

      // Vérifier si le streak se poursuit (connexion hier)
      const yesterday = new Date(today);
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      const streakContinued = lastLogin
        ? this.isSameDay(lastLogin, yesterday)
        : false;
      const newStreakDays = streakContinued ? progress.streakDays + 1 : 1;
      const xpBonus = STREAK_XP_BONUS[Math.min(newStreakDays, 7)];

      // Calcul des nouveaux XP / niveau / pièces — Toujours arrondi supérieur sans virgule
      const currentXp = Number(progress.totalXp);
      const newTotalXp = Math.ceil(currentXp + xpBonus);
      const previousLevel = progress.level || 1;
      const newLevel = this.calculateLevel(newTotalXp);
      let additionalCoins = 0;
      if (newLevel > previousLevel) {
        for (let lvl = previousLevel + 1; lvl <= newLevel; lvl++) {
          additionalCoins += this.calculateLevelUpCoins(lvl);
        }
      }
      const newCoins = (progress.coins || 0) + additionalCoins;

      // Mise à jour en base
      await tx.userProgress.update({
        where: { userId },
        data: {
          streakDays: newStreakDays,
          lastLoginDate: today,
          totalXp: newTotalXp,
          level: newLevel,
          coins: newCoins,
        },
      });

      // Enregistrement de la transaction XP bonus
      if (xpBonus > 0) {
        await tx.xpTransaction.create({
          data: {
            userId,
            amount: xpBonus,
            source: 'daily_login',
            description: `Série de ${newStreakDays} jour${newStreakDays > 1 ? 's' : ''} consécutif${newStreakDays > 1 ? 's' : ''}`,
          },
        });
      }

      return {
        progress: {
          streakDays: newStreakDays,
          totalXp: newTotalXp,
          level: newLevel,
          coins: newCoins,
        },
        xpBonus,
        streakStatus: streakContinued
          ? ('continued' as const)
          : ('started' as const),
      };
    });

    if (result.xpBonus > 0) {
      await this.publishLeaderboardUpdate(
        userId,
        result.progress.totalXp,
        result.progress.level,
        result.xpBonus,
        result.progress.streakDays,
        'daily_login',
      );
    }

    return result;
  }

  /**
   * Synchronise les points d'XP accumulés (hors ligne) et les progressions de jeu.
   */
  async syncProgression(userId: string, dto: SyncProgressionDto) {
    this.logger.log(
      `Synchronisation de la progression pour l'utilisateur ${userId}`,
    );

    const result = await this.prisma.$transaction(async (tx) => {
      let totalXpToAdd = 0;

      // 1. Traiter les transactions XP
      if (dto.xpTransactions && dto.xpTransactions.length > 0) {
        for (const xpTx of dto.xpTransactions) {
          const safeAmount = Math.ceil(Number(xpTx.amount));
          if (safeAmount <= 0) continue;

          // Déduplication des sources "reading_time:<id>"
          if (xpTx.source && xpTx.source.startsWith('reading_time:')) {
            const existing = await tx.xpTransaction.findFirst({
              where: { userId, source: xpTx.source },
            });
            if (existing) continue;
          }

          totalXpToAdd = Math.ceil(totalXpToAdd + safeAmount);
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
        const newTotal = Math.ceil(Number(progress.totalXp) + totalXpToAdd);
        const previousLevel = progress.level || 1;
        const newLevel = this.calculateLevel(newTotal);
        let additionalCoins = 0;
        if (newLevel > previousLevel) {
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

      // 3. Mettre à jour les GameProgressions (niveaux débloqués, étoiles)
      if (dto.games && dto.games.length > 0) {
        for (const game of dto.games) {
          await tx.gameProgression.upsert({
            where: { userId_gameType: { userId, gameType: game.gameType } },
            update: {
              unlockedLevelIndex: { set: Math.max(game.unlockedLevelIndex, 0) },
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
      return { progress, games: updatedGames, totalXpAdded: totalXpToAdd };
    });

    if (result.totalXpAdded > 0 && result.progress) {
      await this.publishLeaderboardUpdate(
        userId,
        Number(result.progress.totalXp),
        result.progress.level,
        result.totalXpAdded,
        result.progress.streakDays,
        'sync',
      );
    }

    return { progress: result.progress, games: result.games };
  }

  /**
   * Statistiques globales de progression pour l'administration.
   */
  async getAdminStats() {
    const totalPlayers = await this.prisma.userProgress.count();

    const aggregate = await this.prisma.userProgress.aggregate({
      _sum: { totalXp: true, coins: true },
      _max: { level: true, totalXp: true, streakDays: true },
      _avg: { level: true, totalXp: true },
    });

    const activeStreaksCount = await this.prisma.userProgress.count({
      where: { streakDays: { gt: 0 } },
    });

    const allProgress = await this.prisma.userProgress.findMany({
      select: { level: true },
    });

    const levelCounts: Record<number, number> = {};
    for (let i = 1; i <= 10; i++) levelCounts[i] = 0;
    for (const p of allProgress) {
      const lvl = Math.min(10, Math.max(1, p.level));
      levelCounts[lvl] = (levelCounts[lvl] || 0) + 1;
    }

    return {
      totalPlayers,
      totalXpDistributed: Math.ceil(aggregate._sum.totalXp || 0),
      totalCoinsDistributed: aggregate._sum.coins || 0,
      maxLevel: aggregate._max.level || 1,
      highestXp: aggregate._max.totalXp || 0,
      maxStreakDays: aggregate._max.streakDays || 0,
      averageLevel: Math.round((aggregate._avg.level || 1) * 10) / 10,
      activeStreaksCount,
      levelDistribution: levelCounts,
    };
  }

  /**
   * Ajustement manuel de l'XP d'un joueur par un administrateur.
   */
  async adjustUserXp(targetUserId: string, xpDelta: number, reason?: string) {
    const updated = await this.prisma.$transaction(async (tx) => {
      let progress = await tx.userProgress.findUnique({
        where: { userId: targetUserId },
      });
      if (!progress) {
        progress = await tx.userProgress.create({
          data: {
            userId: targetUserId,
            totalXp: 0,
            level: 1,
            coins: 0,
            streakDays: 0,
          },
        });
      }

      const newTotalXp = Math.max(0, Math.ceil(progress.totalXp + xpDelta));
      const newLevel = this.calculateLevel(newTotalXp);

      const updatedProgress = await tx.userProgress.update({
        where: { userId: targetUserId },
        data: {
          totalXp: newTotalXp,
          level: newLevel,
        },
      });

      await tx.xpTransaction.create({
        data: {
          userId: targetUserId,
          amount: xpDelta,
          source: 'admin_adjustment',
          description: reason || 'Ajustement manuel par administrateur',
        },
      });

      return updatedProgress;
    });

    await this.publishLeaderboardUpdate(
      targetUserId,
      Number(updated.totalXp),
      updated.level,
      xpDelta,
      updated.streakDays,
      'admin_adjustment',
    );

    return updated;
  }

  // ─────────────────────────────────────────────
  // Helpers privés
  // ─────────────────────────────────────────────

  /**
   * Publie un événement de mise à jour du classement sur Redis Pub/Sub.
   */
  private async publishLeaderboardUpdate(
    userId: string,
    totalXp: number,
    level: number,
    xpDelta: number,
    streakDays?: number,
    source?: string,
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, image: true },
      });

      const payload: LeaderboardRealtimePayload = {
        userId,
        totalXp,
        level,
        streakDays,
        name: user?.name || 'Utilisateur',
        image: user?.image || null,
        xpDelta,
        source,
        timestamp: Date.now(),
      };

      await this.redisService.publish(REALTIME_CHANNELS.LEADERBOARD, payload);
    } catch (err) {
      this.logger.warn(
        `⚠️ Impossible de publier la mise à jour leaderboard pour ${userId}: ${err}`,
      );
    }
  }

  /** Retourne une date normalisée (minuit UTC) */
  private getDateOnly(date: Date): Date {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );
  }

  /** Vérifie si deux dates correspondent au même jour UTC */
  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getUTCFullYear() === b.getUTCFullYear() &&
      a.getUTCMonth() === b.getUTCMonth() &&
      a.getUTCDate() === b.getUTCDate()
    );
  }

  /** Bonus de pièces lors d'une montée de niveau */
  private calculateLevelUpCoins(level: number): number {
    return Math.max(25, level * 25);
  }

  /** Calcule le niveau à partir de l'XP total (identique au frontend) */
  private calculateLevel(xp: number): number {
    const safeXp = Math.max(0, xp || 0);
    const THRESHOLDS = [
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
    for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
      if (safeXp >= THRESHOLDS[i].minXp) {
        currentLevel = THRESHOLDS[i].level;
        break;
      }
    }

    if (safeXp >= 3000) {
      currentLevel = 10 + Math.floor((safeXp - 3000) / 1000);
    }

    return currentLevel;
  }
}
