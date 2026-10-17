import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { REALTIME_CHANNELS } from '../realtime/realtime.constants.js';
import {
  LeaderboardQueryDto,
  LeaderboardPeriod,
} from './dto/leaderboard-query.dto.js';

export interface LeaderboardItemDto {
  rank: number;
  userId: string;
  name: string;
  image: string | null;
  totalXP: number;
  level: number;
  streakDays: number;
  isCurrentUser?: boolean;
  pointsToNextRank?: number | null;
}

export interface LeaderboardResponseDto {
  entries: LeaderboardItemDto[];
  totalPlayers: number;
  currentUserRank: LeaderboardItemDto | null;
  period: LeaderboardPeriod;
  updatedAt: string;
  periodStart?: string;
}

interface CachedLeaderboardSlice {
  entries: LeaderboardItemDto[];
  totalPlayers: number;
  updatedAt: string;
  periodStart?: string;
}

const LEADERBOARD_CACHE_TTL = 60; // 60 secondes de TTL pour soulager la base sous fort trafic

@Injectable()
export class LeaderboardService implements OnModuleInit {
  private readonly logger = new Logger(LeaderboardService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * S'abonne aux événements de mise à jour du classement pour invalider proactivement le cache.
   */
  async onModuleInit() {
    try {
      await this.redisService.subscribe(REALTIME_CHANNELS.LEADERBOARD, () => {
        void this.invalidateCache().catch((err) => {
          this.logger.debug(
            `Erreur lors de l'invalidation du cache de classement : ${err?.message}`,
          );
        });
      });
      this.logger.log(
        '⚡ [LeaderboardService] Invalidation proactive du cache Redis connectée à REALTIME_CHANNELS.LEADERBOARD',
      );
    } catch (err: any) {
      this.logger.warn(
        `⚠️ [LeaderboardService] Échec de l'abonnement à l'invalidation du cache : ${err?.message}`,
      );
    }
  }

  /**
   * Invalide toutes les clés de cache de classement dans Redis.
   */
  async invalidateCache(): Promise<void> {
    await this.redisService.delByPattern('leaderboard:cache:*');
  }

  /**
   * Récupère le classement des joueurs.
   * - alltime : tri par totalXp (ordre déterministe par XP, série et ancienneté)
   * - day / week / month : tri par la somme des XpTransaction de la période
   */
  async getLeaderboard(
    currentUserId?: string,
    query?: LeaderboardQueryDto,
  ): Promise<LeaderboardResponseDto> {
    const limit = Math.min(100, Math.max(1, query?.limit ?? 50));
    const offset = Math.max(0, query?.offset ?? 0);
    const period = query?.period ?? 'alltime';

    if (currentUserId) {
      await this.ensureUserProgressExists(currentUserId);
    }

    if (period === 'alltime') {
      return this.getAlltimeLeaderboard(
        currentUserId,
        limit,
        offset,
        query?.level,
      );
    }
    return this.getPeriodLeaderboard(currentUserId, limit, offset, period);
  }

  /**
   * Garantit de manière sécurisée que l'utilisateur possède une fiche UserProgress en base
   * avec 0 XP s'il vient de s'inscrire, SANS jamais accepter de score fourni par le client.
   */
  private async ensureUserProgressExists(userId: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (!user) return;

      const progress = await this.prisma.userProgress.findUnique({
        where: { userId },
        select: { userId: true },
      });

      if (!progress) {
        await this.prisma.userProgress.create({
          data: {
            userId,
            totalXp: 0,
            level: 0,
            streakDays: 1,
            coins: 0,
          },
        });
      }
    } catch (e) {
      this.logger.warn(
        `Erreur lors de l'initialisation de UserProgress pour ${userId}: ${e}`,
      );
    }
  }

  // ─────────────────────────────────────────────
  // Classement "Tout temps" (tri déterministe sur totalXp, streakDays, updatedAt)
  // ─────────────────────────────────────────────

  private async getAlltimeLeaderboard(
    currentUserId?: string,
    limit = 50,
    offset = 0,
    level?: number,
  ): Promise<LeaderboardResponseDto> {
    const cacheKey = `leaderboard:cache:alltime:${limit}:${offset}:${level ?? 'all'}`;

    // 1. Consultation du cache Redis
    const cached =
      await this.redisService.get<CachedLeaderboardSlice>(cacheKey);

    let entries: LeaderboardItemDto[];
    let totalPlayers: number;
    let updatedAt: string;

    if (cached) {
      entries = cached.entries;
      totalPlayers = cached.totalPlayers;
      updatedAt = cached.updatedAt;
    } else {
      const where: any = this.buildNotBannedWhere();
      if (level !== undefined && level !== null) {
        where.level = level;
      }

      // Ordre de tri strict et déterministe pour départager les égalités
      const orderBy: any = [
        { totalXp: 'desc' },
        { streakDays: 'desc' },
        { updatedAt: 'asc' },
      ];

      const [progressItems, count] = await Promise.all([
        this.prisma.userProgress.findMany({
          where,
          orderBy,
          take: limit,
          skip: offset,
          include: {
            // Confidentialité stricte : exclusion totale de l'email, pushToken, hash ou secrets
            user: { select: { id: true, name: true, image: true } },
          },
        }),
        this.prisma.userProgress.count({ where }),
      ]);

      totalPlayers = count;
      updatedAt = new Date().toISOString();

      entries = progressItems.map((item, index) => {
        const currentRank = offset + index + 1;
        const totalXP = Math.ceil(Number(item.totalXp));

        // Calcul des points nécessaires pour dépasser le joueur précédent
        let pointsToNextRank: number | null = null;
        if (index > 0) {
          const prevXP = Math.ceil(Number(progressItems[index - 1].totalXp));
          pointsToNextRank = Math.max(1, prevXP - totalXP + 1);
        }

        return {
          rank: currentRank,
          userId: item.userId,
          name: item.user?.name || 'Mpilalao Kanto',
          image: item.user?.image || null,
          totalXP,
          level: item.level,
          streakDays: item.streakDays,
          pointsToNextRank,
        };
      });

      // Mise en cache de la tranche pour 60 secondes
      await this.redisService.set(
        cacheKey,
        { entries, totalPlayers, updatedAt },
        LEADERBOARD_CACHE_TTL,
      );
    }

    // Marquer l'utilisateur connecté dans les entrées
    const formattedEntries = entries.map((e) => ({
      ...e,
      isCurrentUser: Boolean(currentUserId && e.userId === currentUserId),
    }));

    const currentUserRank = await this.resolveCurrentUserRank(
      currentUserId,
      formattedEntries,
      level,
    );

    return {
      entries: formattedEntries,
      totalPlayers,
      currentUserRank,
      period: 'alltime',
      updatedAt,
    };
  }

  // ─────────────────────────────────────────────
  // Classement par période (agrégation XpTransaction)
  // ─────────────────────────────────────────────

  private async getPeriodLeaderboard(
    currentUserId?: string,
    limit = 50,
    offset = 0,
    period: LeaderboardPeriod = 'week',
  ): Promise<LeaderboardResponseDto> {
    const since = this.getPeriodStart(period);
    const cacheKey = `leaderboard:cache:${period}:${limit}:${offset}:${since.getTime()}`;

    // 1. Consultation du cache Redis
    const cached =
      await this.redisService.get<CachedLeaderboardSlice>(cacheKey);

    let entries: LeaderboardItemDto[];
    let totalPlayers: number;
    let updatedAt: string;
    const periodStart = since.toISOString();

    if (cached) {
      entries = cached.entries;
      totalPlayers = cached.totalPlayers;
      updatedAt = cached.updatedAt;
    } else {
      // Filtrer par date et utilisateurs actifs (non bannis)
      const transactionWhere: any = {
        createdAt: { gte: since },
        user: { OR: [{ banned: null }, { banned: false }] },
      };

      // Agréger les transactions XP de la période avec pagination Prisma
      const [periodXpRaw, allPeriodUsers] = await Promise.all([
        this.prisma.xpTransaction.groupBy({
          by: ['userId'],
          where: transactionWhere,
          _sum: { amount: true },
          orderBy: { _sum: { amount: 'desc' } },
          take: limit,
          skip: offset,
        }),
        this.prisma.xpTransaction.groupBy({
          by: ['userId'],
          where: transactionWhere,
        }),
      ]);

      totalPlayers = allPeriodUsers.length;
      updatedAt = new Date().toISOString();

      if (periodXpRaw.length === 0) {
        entries = [];
      } else {
        // Charger les profils des utilisateurs de la tranche paginée
        const userIds = periodXpRaw.map((r) => r.userId);
        const [progressMap, userMap] = await Promise.all([
          this.prisma.userProgress.findMany({
            where: { userId: { in: userIds } },
            select: { userId: true, level: true, streakDays: true },
          }),
          this.prisma.user.findMany({
            where: { id: { in: userIds } },
            // Confidentialité stricte : projection minimale
            select: { id: true, name: true, image: true },
          }),
        ]);

        const progressById = Object.fromEntries(
          progressMap.map((p) => [p.userId, p]),
        );
        const userById = Object.fromEntries(userMap.map((u) => [u.id, u]));

        entries = periodXpRaw.map((r, index) => {
          const prog = progressById[r.userId];
          const user = userById[r.userId];
          const totalXP = Math.ceil(Number(r._sum.amount) || 0);

          let pointsToNextRank: number | null = null;
          if (index > 0) {
            const prevXP = Math.ceil(
              Number(periodXpRaw[index - 1]._sum.amount) || 0,
            );
            pointsToNextRank = Math.max(1, prevXP - totalXP + 1);
          }

          return {
            rank: offset + index + 1,
            userId: r.userId,
            name: user?.name || 'Mpilalao Kanto',
            image: user?.image || null,
            totalXP,
            level: prog?.level ?? 1,
            streakDays: prog?.streakDays ?? 0,
            pointsToNextRank,
          };
        });
      }

      // Mise en cache de la tranche pour 60 secondes
      await this.redisService.set(
        cacheKey,
        { entries, totalPlayers, updatedAt, periodStart },
        LEADERBOARD_CACHE_TTL,
      );
    }

    const formattedEntries = entries.map((e) => ({
      ...e,
      isCurrentUser: Boolean(currentUserId && e.userId === currentUserId),
    }));

    const currentUserRank = await this.resolveCurrentUserRankForPeriod(
      currentUserId,
      formattedEntries,
      since,
      period,
    );

    return {
      entries: formattedEntries,
      totalPlayers,
      currentUserRank,
      period,
      updatedAt,
      periodStart,
    };
  }

  // ─────────────────────────────────────────────
  // Résolution déterministe de la position du joueur connecté
  // ─────────────────────────────────────────────

  private async resolveCurrentUserRank(
    currentUserId: string | undefined,
    entries: LeaderboardItemDto[],
    level?: number,
  ): Promise<LeaderboardItemDto | null> {
    if (!currentUserId) return null;

    const found = entries.find((e) => e.userId === currentUserId);
    if (found) {
      return { ...found, isCurrentUser: true };
    }

    // Le joueur est hors de la page affichée -> calcul du rang exact par règles strictes
    const myProgress = await this.prisma.userProgress.findUnique({
      where: { userId: currentUserId },
      include: {
        // Confidentialité stricte : projection minimale
        user: { select: { id: true, name: true, image: true } },
      },
    });

    if (!myProgress) return null;

    if (level !== undefined && level !== null && myProgress.level !== level) {
      return null;
    }

    const whereNotBanned = this.buildNotBannedWhere();

    // Décompte déterministe des joueurs strictement meilleurs (totalXp DESC, streakDays DESC, updatedAt ASC)
    const betterCount = await this.prisma.userProgress.count({
      where: {
        ...whereNotBanned,
        ...(level !== undefined && level !== null ? { level } : {}),
        OR: [
          { totalXp: { gt: myProgress.totalXp } },
          {
            totalXp: myProgress.totalXp,
            streakDays: { gt: myProgress.streakDays },
          },
          {
            totalXp: myProgress.totalXp,
            streakDays: myProgress.streakDays,
            updatedAt: { lt: myProgress.updatedAt },
          },
        ],
      },
    });

    const rank = betterCount + 1;
    const myTotalXP = Math.ceil(Number(myProgress.totalXp));

    // Déterminer le nombre de points pour dépasser le joueur classé juste devant
    let pointsToNextRank: number | null = null;
    if (rank > 1) {
      const playerAhead = await this.prisma.userProgress.findFirst({
        where: {
          ...whereNotBanned,
          ...(level !== undefined && level !== null ? { level } : {}),
          OR: [
            { totalXp: { gt: myProgress.totalXp } },
            {
              totalXp: myProgress.totalXp,
              streakDays: { gt: myProgress.streakDays },
            },
            {
              totalXp: myProgress.totalXp,
              streakDays: myProgress.streakDays,
              updatedAt: { lt: myProgress.updatedAt },
            },
          ],
        },
        orderBy: [
          { totalXp: 'asc' },
          { streakDays: 'asc' },
          { updatedAt: 'desc' },
        ],
        select: { totalXp: true },
      });

      if (playerAhead) {
        const aheadXP = Math.ceil(Number(playerAhead.totalXp));
        pointsToNextRank = Math.max(1, aheadXP - myTotalXP + 1);
      }
    }

    return {
      rank,
      userId: myProgress.userId,
      name: myProgress.user?.name || 'Mpilalao Kanto',
      image: myProgress.user?.image || null,
      totalXP: myTotalXP,
      level: myProgress.level,
      streakDays: myProgress.streakDays,
      isCurrentUser: true,
      pointsToNextRank,
    };
  }

  private async resolveCurrentUserRankForPeriod(
    currentUserId: string | undefined,
    entries: LeaderboardItemDto[],
    since: Date,
    period: LeaderboardPeriod,
  ): Promise<LeaderboardItemDto | null> {
    if (!currentUserId) return null;

    const found = entries.find((e) => e.userId === currentUserId);
    if (found) return { ...found, isCurrentUser: true };

    // Calculer la somme des XP du joueur dans la période
    const myAgg = await this.prisma.xpTransaction.aggregate({
      where: {
        userId: currentUserId,
        createdAt: { gte: since },
      },
      _sum: { amount: true },
    });

    const myXpInPeriod = Math.ceil(Number(myAgg._sum.amount) || 0);

    // Récupérer le profil et progression
    const myProgress = await this.prisma.userProgress.findUnique({
      where: { userId: currentUserId },
      include: {
        // Confidentialité stricte : projection minimale
        user: { select: { id: true, name: true, image: true } },
      },
    });

    if (!myProgress) return null;

    // Décompte des utilisateurs ayant un score supérieur dans la période
    const betterUsers = await this.prisma.xpTransaction.groupBy({
      by: ['userId'],
      where: {
        createdAt: { gte: since },
        user: { OR: [{ banned: null }, { banned: false }] },
      },
      _sum: { amount: true },
      having: {
        amount: {
          _sum: { gt: myXpInPeriod },
        },
      },
    });

    const rank = betterUsers.length + 1;

    let pointsToNextRank: number | null = null;
    if (rank > 1) {
      // Trouver le score le plus proche supérieur
      const closestAhead = await this.prisma.xpTransaction.groupBy({
        by: ['userId'],
        where: {
          createdAt: { gte: since },
          user: { OR: [{ banned: null }, { banned: false }] },
        },
        _sum: { amount: true },
        having: {
          amount: {
            _sum: { gt: myXpInPeriod },
          },
        },
        orderBy: {
          _sum: { amount: 'asc' },
        },
        take: 1,
      });

      if (closestAhead.length > 0) {
        const aheadXP = Math.ceil(Number(closestAhead[0]._sum.amount) || 0);
        pointsToNextRank = Math.max(1, aheadXP - myXpInPeriod + 1);
      }
    }

    return {
      rank,
      userId: currentUserId,
      name: myProgress.user?.name || 'Mpilalao Kanto',
      image: myProgress.user?.image || null,
      totalXP: myXpInPeriod,
      level: myProgress.level,
      streakDays: myProgress.streakDays,
      isCurrentUser: true,
      pointsToNextRank,
    };
  }

  // ─────────────────────────────────────────────
  // Utilitaires de dates UTC
  // ─────────────────────────────────────────────

  /** Retourne la date de début de la période normalisée en UTC */
  private getPeriodStart(period: LeaderboardPeriod): Date {
    const now = new Date();
    switch (period) {
      case 'day': {
        return new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
        );
      }
      case 'week': {
        const dayOfWeek = now.getUTCDay(); // 0=dim, 1=lun…
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        return new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() + mondayOffset,
            0,
            0,
            0,
            0,
          ),
        );
      }
      case 'month': {
        return new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0),
        );
      }
      default:
        return new Date(0); // alltime
    }
  }

  private buildNotBannedWhere() {
    return {
      user: { OR: [{ banned: null }, { banned: false }] },
    };
  }
}
