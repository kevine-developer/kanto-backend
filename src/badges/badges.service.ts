import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { OFFICIAL_BADGES, BadgeDefinition } from './badges.constants.js';
import { UserBadgeProgressDto, CheckBadgesResultDto } from './dto/badge.dto.js';

@Injectable()
export class BadgesService {
  private readonly logger = new Logger(BadgesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Renvoie la liste complète de tous les badges du catalogue.
   */
  getCatalog(): BadgeDefinition[] {
    return OFFICIAL_BADGES;
  }

  /**
   * Récupère tous les badges avec la progression actuelle et l'état de déblocage d'un utilisateur.
   */
  async getUserBadges(userId: string): Promise<UserBadgeProgressDto[]> {
    // 1. Badges déjà enregistrés comme débloqués en base
    const unlockedRecords = await this.prisma.userBadge.findMany({
      where: { userId },
    });
    const unlockedMap = new Map<
      string,
      { unlockedAt: Date; progress: number }
    >();
    for (const record of unlockedRecords) {
      unlockedMap.set(record.badgeId, {
        unlockedAt: record.unlockedAt,
        progress: record.progress,
      });
    }

    // 2. Récupération des métriques réelles de l'utilisateur
    const [
      userProgress,
      approvedContributionsCount,
      duelVictoriesCount,
      proverbsViewedCount,
      gameProgressions,
    ] = await Promise.all([
      this.prisma.userProgress.findUnique({ where: { userId } }),
      this.prisma.contribution.count({
        where: { userId, status: 'PUBLISHED' },
      }),
      this.prisma.duelSession.count({
        where: { winnerId: userId, status: 'FINISHED' },
      }),
      this.prisma.viewHistory.count({
        where: {
          userId,
          item: { category: 'PROVERBE' },
        },
      }),
      this.prisma.gameProgression.findMany({ where: { userId } }),
    ]);

    const currentXp = Math.ceil(Number(userProgress?.totalXp || 0));
    const currentStreak = userProgress?.streakDays || 0;

    // Estimation des victoires de jeux solo via gameProgressions
    let soloGamesVictories = 0;
    for (const gp of gameProgressions) {
      soloGamesVictories += gp.unlockedLevelIndex;
    }

    // 3. Construction des badges enrichis
    const results: UserBadgeProgressDto[] = [];

    for (const badge of OFFICIAL_BADGES) {
      let currentValue = 0;

      switch (badge.category) {
        case 'streak':
          currentValue = currentStreak;
          break;
        case 'xp':
          currentValue = currentXp;
          break;
        case 'proverbs':
          currentValue = proverbsViewedCount;
          break;
        case 'community':
          currentValue = approvedContributionsCount;
          break;
        case 'games':
          if (badge.id === 'duel_winner') {
            currentValue = duelVictoriesCount;
          } else {
            currentValue = soloGamesVictories + duelVictoriesCount;
          }
          break;
        case 'civic':
          // Estimation de l'avancement civique (XP ou nombre de lectures)
          currentValue = Math.min(
            Math.floor(currentXp / 60),
            badge.targetValue,
          );
          break;
        default:
          currentValue = 0;
      }

      const existingRecord = unlockedMap.get(badge.id);
      const isUnlocked = Boolean(existingRecord);
      const unlockedAt = existingRecord
        ? existingRecord.unlockedAt.toISOString()
        : null;

      const progressPercent = Math.min(
        100,
        Math.round(
          (Math.min(currentValue, badge.targetValue) / badge.targetValue) * 100,
        ),
      );

      results.push({
        id: badge.id,
        titleMg: badge.titleMg,
        titleFr: badge.titleFr,
        descriptionMg: badge.descriptionMg,
        descriptionFr: badge.descriptionFr,
        category: badge.category,
        iconKey: badge.iconKey,
        color: badge.color,
        targetValue: badge.targetValue,
        currentValue,
        isUnlocked,
        unlockedAt,
        progressPercent,
        xpReward: badge.xpReward,
      });
    }

    return results;
  }

  /**
   * Évalue les critères de tous les badges et débloque ceux dont le seuil est franchi.
   * Attribue le bonus XP associé et émet une notification in-app à l'utilisateur.
   */
  async checkAndUnlockBadges(userId: string): Promise<CheckBadgesResultDto> {
    const badges = await this.getUserBadges(userId);
    const newlyUnlocked: UserBadgeProgressDto[] = [];
    let earnedBonusXp = 0;

    for (const badge of badges) {
      // Si le critère est atteint mais le badge n'a pas encore été enregistré en BDD
      if (badge.currentValue >= badge.targetValue && !badge.unlockedAt) {
        try {
          await this.prisma.$transaction(async (tx) => {
            // 1. Enregistrer le badge
            const created = await tx.userBadge.create({
              data: {
                userId,
                badgeId: badge.id,
                progress: badge.currentValue,
              },
            });

            // 2. Attribuer le bonus d'XP si défini
            if (badge.xpReward > 0) {
              await tx.xpTransaction.create({
                data: {
                  userId,
                  amount: badge.xpReward,
                  source: `badge:${badge.id}`,
                  description: `Déblocage du badge "${badge.titleFr}"`,
                },
              });

              await tx.userProgress.upsert({
                where: { userId },
                update: {
                  totalXp: { increment: badge.xpReward },
                },
                create: {
                  userId,
                  totalXp: badge.xpReward,
                  level: 1,
                  coins: 0,
                  streakDays: 0,
                },
              });

              earnedBonusXp += badge.xpReward;
            }

            badge.isUnlocked = true;
            badge.unlockedAt = created.unlockedAt.toISOString();
            newlyUnlocked.push(badge);
          });

          // 3. Notification utilisateur
          try {
            await this.notificationsService.createNotification({
              userId,
              isBroadcast: false,
              titleMg: `Nahazo mari-boninahitra vaovao : ${badge.titleMg} !`,
              titleFr: `Nouveau badge débloqué : ${badge.titleFr} !`,
              messageMg: `Arahabaina ! Nahazo ny mari-boninahitra "${badge.titleMg}" ianao (+${badge.xpReward} XP).`,
              messageFr: `Félicitations ! Vous avez débloqué le badge "${badge.titleFr}" (+${badge.xpReward} XP).`,
              category: 'reward',
              badgeText: 'Badge',
              badgeType: 'reward',
              iconName: 'trophy-outline',
              iconColor: badge.color,
              targetRoute: '/(tabs)/profil?tab=badges',
            });
          } catch (notifErr) {
            this.logger.warn(
              `Impossible d'envoyer la notification de badge pour ${userId}:`,
              notifErr,
            );
          }
        } catch (err: any) {
          // Si déjà débloqué en concurrence, ignorer
          if (err?.code !== 'P2002') {
            this.logger.error(
              `Erreur lors du déblocage du badge ${badge.id} pour ${userId}:`,
              err,
            );
          }
        }
      }
    }

    const totalUnlockedCount = badges.filter((b) => b.isUnlocked).length;

    return {
      newlyUnlocked,
      totalUnlockedCount,
      earnedBonusXp,
    };
  }

  /**
   * Débloque explicitement un badge pour un utilisateur (par exemple après un duel gagné).
   */
  async unlockBadge(userId: string, badgeId: string): Promise<boolean> {
    const badgeDef = OFFICIAL_BADGES.find((b) => b.id === badgeId);
    if (!badgeDef) return false;

    const existing = await this.prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId } },
    });

    if (existing) return false; // Déjà débloqué

    await this.prisma.$transaction(async (tx) => {
      await tx.userBadge.create({
        data: {
          userId,
          badgeId,
          progress: badgeDef.targetValue,
        },
      });

      if (badgeDef.xpReward > 0) {
        await tx.xpTransaction.create({
          data: {
            userId,
            amount: badgeDef.xpReward,
            source: `badge:${badgeId}`,
            description: `Déblocage du badge "${badgeDef.titleFr}"`,
          },
        });

        await tx.userProgress.upsert({
          where: { userId },
          update: {
            totalXp: { increment: badgeDef.xpReward },
          },
          create: {
            userId,
            totalXp: badgeDef.xpReward,
            level: 1,
            coins: 0,
            streakDays: 0,
          },
        });
      }
    });

    try {
      await this.notificationsService.createNotification({
        userId,
        isBroadcast: false,
        titleMg: `Nahazo mari-boninahitra : ${badgeDef.titleMg} !`,
        titleFr: `Badge débloqué : ${badgeDef.titleFr} !`,
        messageMg: `Arahabaina ! Nahazo ny mari-boninahitra "${badgeDef.titleMg}" ianao (+${badgeDef.xpReward} XP).`,
        messageFr: `Félicitations ! Vous avez débloqué le badge "${badgeDef.titleFr}" (+${badgeDef.xpReward} XP).`,
        category: 'reward',
        badgeText: 'Badge',
        badgeType: 'reward',
        iconName: 'trophy-outline',
        iconColor: badgeDef.color,
        targetRoute: '/(tabs)/profil?tab=badges',
      });
    } catch {
      // Ignorer l'échec de notification pour ne pas bloquer l'attribution du badge
    }

    return true;
  }
}
