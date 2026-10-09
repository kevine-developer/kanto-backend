import { Injectable, Logger, Optional } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import {
  REALTIME_CHANNELS,
  LeaderboardRealtimePayload,
} from '../realtime/realtime.constants.js';
import { SyncProgressionDto } from './dto/sync-progression.dto.js';
import { ReplaceProgressionDto } from './dto/replace-progression.dto.js';
import { BadgesService } from '../badges/badges.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import {
  CoinsEconomyConfig,
  DEFAULT_COINS_ECONOMY_CONFIG,
  REDIS_COINS_CONFIG_KEY,
} from './progression.constants.js';

/** Bonus XP par palier de streak (jours consécutifs), plafonné à 7 (max 35 XP/jour) */
const STREAK_XP_BONUS = [0, 5, 10, 15, 20, 25, 30, 35];

@Injectable()
export class ProgressionService {
  private readonly logger = new Logger(ProgressionService.name);
  private readonly activeLevelUpNotifications = new Set<string>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly badgesService: BadgesService,
    @Optional() private readonly notificationsService?: NotificationsService,
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
        data: { userId, totalXp: 0, level: 0, coins: 0, streakDays: 0 },
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

    const result = await this.prisma.$transaction(async (tx) => {
      let progress = await tx.userProgress.findUnique({ where: { userId } });
      let previousLevel = progress?.level ?? 0;
      let additionalCoins = 0;

      // Premier enregistrement
      if (!progress) {
        const xpBonus = STREAK_XP_BONUS[1];
        const newLevel = this.calculateLevel(xpBonus);
        previousLevel = 0;
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
          previousLevel,
          additionalCoins: 0,
          isInitialUserProgress: true,
          streakStatus: 'started' as const,
        };
      }

      const lastLogin = progress.lastLoginDate
        ? this.getDateOnly(new Date(progress.lastLoginDate))
        : null;

      // Même jour → idempotent : aucun XP ajouté, aucun changement de niveau possible
      if (lastLogin && this.isSameDay(lastLogin, today)) {
        return {
          progress: {
            streakDays: progress.streakDays,
            totalXp: Math.ceil(Number(progress.totalXp)),
            level: progress.level,
            coins: progress.coins,
          },
          xpBonus: 0,
          previousLevel: progress.level,
          additionalCoins: 0,
          isInitialUserProgress: false,
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
      previousLevel = typeof progress.level === 'number' ? progress.level : 0;
      const newLevel = this.calculateLevel(newTotalXp);
      // Lecture de la configuration économique des pièces (contrôlable par l'administration)
      const coinsConfig = await this.getCoinsEconomyConfig();
      additionalCoins = 0;
      if (coinsConfig.enabled) {
        if (newLevel > previousLevel) {
          for (let lvl = previousLevel + 1; lvl <= newLevel; lvl++) {
            additionalCoins += this.calculateLevelUpCoins(
              lvl,
              coinsConfig.levelUpCoinsMultiplier,
            );
          }
        }
        // Paliers méritoires de fidélité pour les pièces (très rares)
        if (newStreakDays === 7) {
          additionalCoins += coinsConfig.streakBonus7;
        } else if (newStreakDays === 14) {
          additionalCoins += coinsConfig.streakBonus14;
        } else if (newStreakDays === 30) {
          additionalCoins += coinsConfig.streakBonus30;
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
        previousLevel,
        additionalCoins,
        isInitialUserProgress: false,
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

    // Évalue automatiquement les badges suite à l'activité de streak / XP
    void this.badgesService.checkAndUnlockBadges(userId).catch((err) => {
      this.logger.warn(
        `Échec de la vérification des badges après dailyLogin pour ${userId}:`,
        err,
      );
    });

    // 1. Notification in-app de bienvenue lors de la première connexion
    if (result.isInitialUserProgress) {
      void this.sendWelcomeNotification(userId);
    }

    // 2. Notification de palier de série de connexion (3, 7, 14, 30, 60, 90, 180, 365 jours)
    if (
      result.streakStatus === 'continued' &&
      [3, 7, 14, 30, 60, 90, 180, 365].includes(result.progress.streakDays)
    ) {
      void this.sendStreakMilestoneNotification(
        userId,
        result.progress.streakDays,
      );
    }

    // 3. Notification de montée de niveau — uniquement si du XP a réellement été octroyé dans cet appel
    if (
      result.xpBonus > 0 &&
      result.progress.level > result.previousLevel &&
      result.progress.level >= 1
    ) {
      void this.sendLevelUpNotification(
        userId,
        result.progress.level,
        result.additionalCoins,
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
      // Niveau avant cette sync — capturé depuis la DB pour être fiable
      let previousLevel = progress?.level ?? 0;
      let additionalCoins = 0;

      if (!progress) {
        const initialLevel = this.calculateLevel(totalXpToAdd);
        previousLevel = 0;
        progress = await tx.userProgress.create({
          data: {
            userId,
            totalXp: totalXpToAdd,
            level: initialLevel,
            coins:
              initialLevel > 0 ? this.calculateLevelUpCoins(initialLevel) : 0,
          },
        });
      } else if (totalXpToAdd > 0) {
        const newTotal = Math.ceil(Number(progress.totalXp) + totalXpToAdd);
        const newLevel = this.calculateLevel(newTotal);
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
      return {
        progress,
        games: updatedGames,
        totalXpAdded: totalXpToAdd,
        previousLevel,
        additionalCoins,
      };
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

    // Évalue automatiquement les badges suite à la synchronisation d'XP et de progression
    void this.badgesService.checkAndUnlockBadges(userId).catch((err) => {
      this.logger.warn(
        `Échec de la vérification des badges après sync pour ${userId}:`,
        err,
      );
    });

    // Notification de montée de niveau — uniquement si une vraie progression a eu lieu dans cette sync
    if (
      result.progress &&
      result.totalXpAdded > 0 &&
      result.progress.level > result.previousLevel &&
      result.progress.level >= 1
    ) {
      void this.sendLevelUpNotification(
        userId,
        result.progress.level,
        result.additionalCoins,
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

  /**
   * Attribue des points d'XP à un utilisateur (ex: encouragements, récompenses).
   */
  async awardXp(
    userId: string,
    amount: number,
    source: string,
    description?: string,
  ): Promise<{ totalXp: number; level: number; streakDays: number }> {
    const safeAmount = Math.max(0, Math.ceil(amount));
    if (safeAmount === 0) {
      const p = await this.prisma.userProgress.findUnique({
        where: { userId },
      });
      return {
        totalXp: p ? Number(p.totalXp) : 0,
        level: p ? p.level : 0,
        streakDays: p ? p.streakDays : 0,
      };
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      let progress = await tx.userProgress.findUnique({
        where: { userId },
      });
      let previousLevel = progress?.level ?? 0;
      let additionalCoins = 0;

      if (!progress) {
        const initialLevel = this.calculateLevel(safeAmount);
        previousLevel = 0;
        progress = await tx.userProgress.create({
          data: {
            userId,
            totalXp: safeAmount,
            level: initialLevel,
            coins:
              initialLevel > 0 ? this.calculateLevelUpCoins(initialLevel) : 0,
            streakDays: 0,
          },
        });
        if (initialLevel > 0) {
          additionalCoins = this.calculateLevelUpCoins(initialLevel);
        }
      } else {
        const newTotalXp = Math.ceil(Number(progress.totalXp) + safeAmount);
        previousLevel = typeof progress.level === 'number' ? progress.level : 0;
        const newLevel = this.calculateLevel(newTotalXp);
        additionalCoins = 0;
        if (newLevel > previousLevel) {
          for (let lvl = previousLevel + 1; lvl <= newLevel; lvl++) {
            additionalCoins += this.calculateLevelUpCoins(lvl);
          }
        }
        const newCoins = (progress.coins || 0) + additionalCoins;

        progress = await tx.userProgress.update({
          where: { userId },
          data: {
            totalXp: newTotalXp,
            level: newLevel,
            coins: newCoins,
          },
        });
      }

      await tx.xpTransaction.create({
        data: {
          userId,
          amount: safeAmount,
          source,
          description: description || `Gain de ${safeAmount} XP via ${source}`,
        },
      });

      return {
        progress,
        previousLevel,
        additionalCoins,
      };
    });

    await this.publishLeaderboardUpdate(
      userId,
      Number(updated.progress.totalXp),
      updated.progress.level,
      safeAmount,
      updated.progress.streakDays,
      source,
    );

    void this.badgesService.checkAndUnlockBadges(userId).catch((err) => {
      this.logger.warn(
        `Échec de la vérification des badges après awardXp pour ${userId}:`,
        err,
      );
    });

    // Notification de montée de niveau
    if (
      updated.progress.level > updated.previousLevel &&
      updated.progress.level >= 1
    ) {
      void this.sendLevelUpNotification(
        userId,
        updated.progress.level,
        updated.additionalCoins,
      );
    }

    return {
      totalXp: Number(updated.progress.totalXp),
      level: updated.progress.level,
      streakDays: updated.progress.streakDays,
    };
  }

  /**
   * Remplace intégralement la progression d'un utilisateur.
   * Utilisé lorsque l'utilisateur choisit de garder sa progression locale
   * (écrasant la progression serveur existante).
   */
  async replaceProgression(userId: string, dto: ReplaceProgressionDto) {
    this.logger.log(
      `Remplacement complet de la progression pour l'utilisateur ${userId}`,
    );

    // Garde-fous d'intégrité : plafonnement des valeurs synchronisées et calcul serveur du niveau
    const safeTotalXp = Math.min(
      100000,
      Math.ceil(Math.max(0, dto.totalXp || 0)),
    );
    const safeLevel = Math.min(
      10,
      Math.max(0, this.calculateLevel(safeTotalXp)),
    );
    const safeCoins = Math.min(5000, Math.max(0, Math.floor(dto.coins || 0)));
    const safeStreakDays = Math.min(
      365,
      Math.max(0, Math.floor(dto.streakDays || 0)),
    );

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Upsert UserProgress avec les valeurs assainies et vérifiées
      const progress = await tx.userProgress.upsert({
        where: { userId },
        update: {
          totalXp: safeTotalXp,
          level: safeLevel,
          coins: safeCoins,
          streakDays: safeStreakDays,
        },
        create: {
          userId,
          totalXp: safeTotalXp,
          level: safeLevel,
          coins: safeCoins,
          streakDays: safeStreakDays,
        },
      });

      // 2. Remplacer les GameProgression si fournies
      if (dto.games && dto.games.length > 0) {
        // Supprimer les anciennes progressions de jeux
        await tx.gameProgression.deleteMany({ where: { userId } });

        // Recréer avec les données locales
        for (const game of dto.games) {
          await tx.gameProgression.create({
            data: {
              userId,
              gameType: game.gameType,
              unlockedLevelIndex: game.unlockedLevelIndex,
              levelStars: game.levelStars,
            },
          });
        }
      }

      // 3. Enregistrer les transactions XP si fournies (historique)
      if (dto.xpTransactions && dto.xpTransactions.length > 0) {
        for (const xpTx of dto.xpTransactions) {
          const safeAmount = Math.ceil(Number(xpTx.amount));
          if (safeAmount <= 0) continue;

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

      const updatedGames = await tx.gameProgression.findMany({
        where: { userId },
      });

      return { progress, games: updatedGames };
    });

    // Publier la mise à jour du leaderboard
    await this.publishLeaderboardUpdate(
      userId,
      Number(result.progress.totalXp),
      result.progress.level,
      0,
      result.progress.streakDays,
      'progression_replace',
    );

    return { progress: result.progress, games: result.games };
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

  /** Récupère la configuration économique des pièces (depuis Redis ou valeurs par défaut) */
  async getCoinsEconomyConfig(): Promise<CoinsEconomyConfig> {
    try {
      const cached = await this.redisService.get<CoinsEconomyConfig>(
        REDIS_COINS_CONFIG_KEY,
      );
      if (cached && typeof cached === 'object') {
        return { ...DEFAULT_COINS_ECONOMY_CONFIG, ...cached };
      }
    } catch {
      // Ignorer silencieusement et utiliser le fallback
    }
    return DEFAULT_COINS_ECONOMY_CONFIG;
  }

  /**
   * Bonus de pièces lors d'une montée de niveau.
   * Rareté culturelle maximale : progression de 1 à 6 Vola par niveau (plafond 10).
   */
  private calculateLevelUpCoins(level: number, multiplier = 1): number {
    if (level <= 0) return 0;
    const base = Math.min(10, Math.max(1, Math.floor(level / 2) + 1));
    return Math.floor(base * Math.max(0, multiplier));
  }

  /** Calcule le niveau à partir de l'XP total (identique au frontend) */
  private calculateLevel(xp: number): number {
    const safeXp = Math.max(0, Math.ceil(xp || 0));
    if (safeXp < 200) {
      return 0;
    }

    const THRESHOLDS = [
      { level: 0, minXp: 0 },
      { level: 1, minXp: 200 },
      { level: 2, minXp: 500 },
      { level: 3, minXp: 1000 },
      { level: 4, minXp: 1800 },
      { level: 5, minXp: 3000 },
      { level: 6, minXp: 4800 },
      { level: 7, minXp: 7400 },
      { level: 8, minXp: 11000 },
      { level: 9, minXp: 16000 },
      { level: 10, minXp: 23000 },
    ];

    let currentLevel = 0;
    for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
      if (safeXp >= THRESHOLDS[i].minXp) {
        currentLevel = THRESHOLDS[i].level;
        break;
      }
    }

    // Progression au-delà du niveau 10 (exigence redoublée) :
    // Niv 11 = 23000 + 9000 = 32000
    // Niv 12 = 32000 + 11000 = 43000
    // Niv 13 = 43000 + 13000 = 56000
    if (safeXp >= 23000) {
      let lvl = 10;
      let threshold = 23000;
      let step = 9000;
      while (safeXp >= threshold + step) {
        threshold += step;
        lvl++;
        step += 2000;
      }
      currentLevel = lvl;
    }

    return currentLevel;
  }

  /**
   * Envoie une notification in-app & push de bienvenue lors du premier accès.
   */
  private async sendWelcomeNotification(userId: string): Promise<void> {
    if (!this.notificationsService) return;
    try {
      const existing = await this.prisma.notification.findFirst({
        where: {
          userId,
          titleFr: { contains: 'Bienvenue sur Kanto' },
        },
      });
      if (existing) {
        return;
      }

      await this.notificationsService.createNotification({
        userId,
        isBroadcast: false,
        titleMg: "Tongasoa eto amin'ny Kanto ! 🇲🇬",
        titleFr: 'Bienvenue sur Kanto ! 🇲🇬',
        messageMg:
          'Faly miarahaba anao izahay. Diniho ireo Ohabolana, Angano, Kabary ary Lalao nentim-paharazana Malagasy !',
        messageFr:
          'Nous sommes ravis de vous compter parmi nous. Explorez les proverbes, contes, récits historiques et jeux traditionnels malgaches !',
        category: 'culture',
        badgeText: 'Tongasoa',
        badgeType: 'new',
        iconName: 'sparkles-outline',
        iconColor: '#C0392B',
        targetRoute: '/(tabs)',
      });
    } catch (err) {
      this.logger.warn(
        `Échec envoi notification bienvenue pour ${userId}: ${err}`,
      );
    }
  }

  /**
   * Envoie une notification in-app & push lors d'une montée de niveau.
   */
  private async sendLevelUpNotification(
    userId: string,
    newLevel: number,
    coinsReward = 0,
  ): Promise<void> {
    if (!this.notificationsService || newLevel <= 0) return;

    const lockKey = `${userId}:${newLevel}`;
    if (this.activeLevelUpNotifications.has(lockKey)) {
      this.logger.log(
        `ℹ️ [LevelUp] Notification pour le niveau ${newLevel} déjà en cours de traitement pour ${userId}, émission ignorée.`,
      );
      return;
    }
    this.activeLevelUpNotifications.add(lockKey);
    // Libération de précaution du verrou mémoire après 30s
    setTimeout(() => {
      this.activeLevelUpNotifications.delete(lockKey);
    }, 30_000);

    try {
      // Déduplication stricte : ne jamais envoyer plus d'une fois la notification pour le même niveau
      const existing = await this.prisma.notification.findFirst({
        where: {
          userId,
          category: 'reward',
          badgeText: 'Level Up',
          titleFr: { contains: `Niveau ${newLevel}` },
        },
      });

      if (existing) {
        this.logger.log(
          `ℹ️ [LevelUp] Notification pour le niveau ${newLevel} déjà transmise à l'utilisateur ${userId}, émission ignorée.`,
        );
        return;
      }

      const coinsTextMg =
        coinsReward > 0 ? ` sady nahazo valisoa +${coinsReward} Vola` : '';
      const coinsTextFr =
        coinsReward > 0 ? ` et remporté un bonus de +${coinsReward} Vola` : '';

      await this.notificationsService.createNotification({
        userId,
        isBroadcast: false,
        titleMg: `Arahabaina ! Ambaratonga ${newLevel} 🌟`,
        titleFr: `Félicitations ! Niveau ${newLevel} atteint 🌟`,
        messageMg: `Taratry ny fandalinana ny kolontsaina izany ! Niakatra ambaratonga faha-${newLevel} ianao${coinsTextMg}. Tohizo hatrany ny fikarohana !`,
        messageFr: `Vos connaissances s'enrichissent ! Vous venez d'atteindre le Niveau ${newLevel}${coinsTextFr}. Continuez votre parcours !`,
        category: 'reward',
        badgeText: 'Level Up',
        badgeType: 'reward',
        iconName: 'trophy-outline',
        iconColor: '#F59E0B',
        targetRoute: '/(tabs)/profil',
      });
    } catch (err) {
      this.logger.warn(
        `Échec envoi notification level up pour ${userId}: ${err}`,
      );
    }
  }

  /**
   * Envoie une notification in-app & push pour célébrer un palier de série de connexions consécutives.
   */
  private async sendStreakMilestoneNotification(
    userId: string,
    streakDays: number,
  ): Promise<void> {
    if (!this.notificationsService) return;
    try {
      await this.notificationsService.createNotification({
        userId,
        isBroadcast: false,
        titleMg: `Fahavitrihana : Andro faha-${streakDays} misesy ! 🔥`,
        titleFr: `Série active : ${streakDays} jours consécutifs ! 🔥`,
        messageMg: `Ny fikirizana no mitondra mankany amin'ny fahalalana. Efa ${streakDays} andro misesy ianao no nandalina ny kolontsaina Malagasy !`,
        messageFr: `Remarquable assiduité ! Vous explorez le patrimoine et la sagesse malgache depuis ${streakDays} jours consécutifs sans interruption.`,
        category: 'culture',
        badgeText: 'Fahavitrihana',
        badgeType: 'streak',
        iconName: 'flame-outline',
        iconColor: '#E05615',
        targetRoute: '/(tabs)/profil',
      });
    } catch (err) {
      this.logger.warn(
        `Échec envoi notification streak milestone pour ${userId}: ${err}`,
      );
    }
  }
}
