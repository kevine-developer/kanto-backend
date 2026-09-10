import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
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
}

export interface LeaderboardResponseDto {
  entries: LeaderboardItemDto[];
  totalPlayers: number;
  currentUserRank: LeaderboardItemDto | null;
  period: LeaderboardPeriod;
}

@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Récupère le classement des joueurs.
   * - alltime : tri par totalXp (comportement historique)
   * - day / week / month : tri par la somme des XpTransaction de la période
   */
  async getLeaderboard(
    currentUserId?: string,
    query?: LeaderboardQueryDto,
  ): Promise<LeaderboardResponseDto> {
    const limit = query?.limit ?? 50;
    const offset = query?.offset ?? 0;
    const period = query?.period ?? 'alltime';

    if (currentUserId) {
      await this.ensureUserProgress(currentUserId, query?.currentXp);
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
   * Garantit que l'utilisateur possède une fiche UserProgress en base,
   * et synchronise son XP si le client local a une valeur plus élevée.
   */
  private async ensureUserProgress(
    userId: string,
    currentXp?: number,
  ): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) return;

      const calculateLevel = (xp: number) =>
        Math.max(1, Math.floor(Math.sqrt(xp / 25)) + 1);
      const progress = await this.prisma.userProgress.findUnique({
        where: { userId },
      });
      if (!progress) {
        const xp = currentXp ? Math.ceil(Math.max(0, currentXp)) : 0;
        await this.prisma.userProgress.create({
          data: {
            userId,
            totalXp: xp,
            level: calculateLevel(xp),
            streakDays: 1,
            coins: 0,
          },
        });
      } else if (
        currentXp &&
        Math.ceil(currentXp) > Number(progress.totalXp)
      ) {
        const roundedXp = Math.ceil(currentXp);
        await this.prisma.userProgress.update({
          where: { userId },
          data: {
            totalXp: roundedXp,
            level: calculateLevel(roundedXp),
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
  // Classement "Tout temps" (tri sur totalXp)
  // ─────────────────────────────────────────────

  private async getAlltimeLeaderboard(
    currentUserId?: string,
    limit = 50,
    offset = 0,
    level?: number,
  ): Promise<LeaderboardResponseDto> {
    const where: any = this.buildNotBannedWhere();
    if (level !== undefined && level !== null) {
      where.level = level;
    }

    const [progressItems, totalPlayers] = await Promise.all([
      this.prisma.userProgress.findMany({
        where,
        orderBy: [{ totalXp: 'desc' }, { updatedAt: 'asc' }],
        take: limit,
        skip: offset,
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      }),
      this.prisma.userProgress.count({ where }),
    ]);

    const entries: LeaderboardItemDto[] = progressItems.map((item, index) => ({
      rank: offset + index + 1,
      userId: item.userId,
      name: item.user?.name || 'Mpilalao Kanto',
      image: item.user?.image || null,
      totalXP: Math.ceil(Number(item.totalXp)),
      level: item.level,
      streakDays: item.streakDays,
      isCurrentUser: Boolean(currentUserId && item.userId === currentUserId),
    }));

    const currentUserRank = await this.resolveCurrentUserRank(
      currentUserId,
      entries,
      'alltime',
      level,
    );

    return { entries, totalPlayers, currentUserRank, period: 'alltime' };
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

    // Agréger les XP gagnés dans la période par userId
    const periodXpRaw = await this.prisma.xpTransaction.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: since } },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
    });

    const totalPlayers = periodXpRaw.length;

    // Appliquer la pagination
    const paginated = periodXpRaw.slice(offset, offset + limit);

    if (paginated.length === 0) {
      return { entries: [], totalPlayers: 0, currentUserRank: null, period };
    }

    // Charger les profils et la progression associée
    const userIds = paginated.map((r) => r.userId);
    const [progressMap, userMap] = await Promise.all([
      this.prisma.userProgress.findMany({
        where: { userId: { in: userIds } },
        select: { userId: true, level: true, streakDays: true },
      }),
      this.prisma.user.findMany({
        where: {
          id: { in: userIds },
          OR: [{ banned: null }, { banned: false }],
        },
        select: { id: true, name: true, image: true },
      }),
    ]);

    const progressById = Object.fromEntries(
      progressMap.map((p) => [p.userId, p]),
    );
    const userById = Object.fromEntries(userMap.map((u) => [u.id, u]));

    const entries: LeaderboardItemDto[] = paginated
      .filter((r) => userById[r.userId]) // exclure les bannis
      .map((r, index) => {
        const prog = progressById[r.userId];
        const user = userById[r.userId];
        return {
          rank: offset + index + 1,
          userId: r.userId,
          name: user?.name || 'Mpilalao Kanto',
          image: user?.image || null,
          totalXP: Math.ceil(Number(r._sum.amount) || 0),
          level: prog?.level ?? 1,
          streakDays: prog?.streakDays ?? 0,
          isCurrentUser: Boolean(currentUserId && r.userId === currentUserId),
        };
      });

    // Recalculer totalPlayers en excluant les bannis
    const activeTotalPlayers = Math.min(totalPlayers, userMap.length + offset);

    const currentUserRank = await this.resolveCurrentUserRankForPeriod(
      currentUserId,
      entries,
      since,
      period,
      periodXpRaw,
    );

    return {
      entries,
      totalPlayers: activeTotalPlayers,
      currentUserRank,
      period,
    };
  }

  // ─────────────────────────────────────────────
  // Résolution de la position de l'utilisateur courant
  // ─────────────────────────────────────────────

  private async resolveCurrentUserRank(
    currentUserId: string | undefined,
    entries: LeaderboardItemDto[],
    period: LeaderboardPeriod,
    level?: number,
  ): Promise<LeaderboardItemDto | null> {
    if (!currentUserId) return null;

    const found = entries.find((e) => e.userId === currentUserId);
    if (found) return { ...found, isCurrentUser: true };

    // L'utilisateur est hors du top affiché → calculer son rang exact
    const myProgress = await this.prisma.userProgress.findUnique({
      where: { userId: currentUserId },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    if (!myProgress) return null;

    // Si filtré par niveau et que le joueur n'est pas dans ce niveau
    if (level !== undefined && level !== null && myProgress.level !== level) {
      return null;
    }

    const betterCount = await this.prisma.userProgress.count({
      where: {
        totalXp: { gt: myProgress.totalXp },
        ...(level !== undefined && level !== null ? { level } : {}),
        user: { OR: [{ banned: null }, { banned: false }] },
      },
    });

    return {
      rank: betterCount + 1,
      userId: myProgress.userId,
      name: myProgress.user?.name || 'Mpilalao Kanto',
      image: myProgress.user?.image || null,
      totalXP: Math.ceil(Number(myProgress.totalXp)),
      level: myProgress.level,
      streakDays: myProgress.streakDays,
      isCurrentUser: true,
    };
  }

  private async resolveCurrentUserRankForPeriod(
    currentUserId: string | undefined,
    entries: LeaderboardItemDto[],
    since: Date,
    period: LeaderboardPeriod,
    allPeriodXp: { userId: string; _sum: { amount: number | null } }[],
  ): Promise<LeaderboardItemDto | null> {
    if (!currentUserId) return null;

    const found = entries.find((e) => e.userId === currentUserId);
    if (found) return { ...found, isCurrentUser: true };

    // Calculer son XP dans la période
    const myXpRaw = allPeriodXp.find((r) => r.userId === currentUserId);
    const myXpInPeriod = Math.ceil(Number(myXpRaw?._sum?.amount) || 0);

    // Calculer son rang dans la période
    const betterCount = allPeriodXp.filter(
      (r) =>
        Number(r._sum.amount || 0) > myXpInPeriod && r.userId !== currentUserId,
    ).length;

    const myProgress = await this.prisma.userProgress.findUnique({
      where: { userId: currentUserId },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    if (!myProgress) return null;

    return {
      rank: betterCount + 1,
      userId: currentUserId,
      name: myProgress.user?.name || 'Mpilalao Kanto',
      image: myProgress.user?.image || null,
      totalXP: myXpInPeriod,
      level: myProgress.level,
      streakDays: myProgress.streakDays,
      isCurrentUser: true,
    };
  }

  // ─────────────────────────────────────────────
  // Utilitaires
  // ─────────────────────────────────────────────

  /** Retourne la date de début de la période (UTC) */
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
        const monday = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() + mondayOffset,
          ),
        );
        return monday;
      }
      case 'month': {
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      }
      default:
        return new Date(0); // epoch
    }
  }

  private buildNotBannedWhere() {
    return {
      user: { OR: [{ banned: null }, { banned: false }] },
    };
  }
}
