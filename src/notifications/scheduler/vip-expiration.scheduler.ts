import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';
import { EventNotificationService } from '../event-notification.service.js';

@Injectable()
export class VipExpirationScheduler {
  private readonly logger = new Logger(VipExpirationScheduler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly eventNotificationService: EventNotificationService,
  ) {}

  /**
   * Cron quotidien exécuté à 02:00 UTC.
   * Scanne les statuts VIP arrivant à échéance sous 3 jours (rappel préventif)
   * et ceux dont la date est dépassée (rétrogradation automatique à Standard FREE + notification).
   */
  @Cron('0 2 * * *', { name: 'vip-expiration-check', timeZone: 'UTC' })
  async handleDailyCron(): Promise<void> {
    const lockKey = 'scheduler_lock:vip_expiration';
    const acquired = await this.redisService.set(lockKey, 'locked', 1800); // 30 minutes de verrou
    if (!acquired) {
      this.logger.log(
        '⏳ [VipScheduler] Un autre nœud exécute déjà le contrôle d’expiration VIP.',
      );
      return;
    }

    try {
      this.logger.log('🚀 [VipScheduler] Début de la vérification quotidienne des expirations VIP...');
      const results = await this.runVipExpirationRoutine();
      this.logger.log(
        `✅ [VipScheduler] Vérification terminée : ${results.expiringSoonCount} rappel(s) envoyé(s), ${results.expiredCount} compte(s) expiré(s) rétrogradé(s).`,
      );
    } catch (err: unknown) {
      this.logger.error(
        `❌ [VipScheduler] Erreur critique lors de la vérification quotidienne des expirations VIP : ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      await this.redisService.del(lockKey);
    }
  }

  /**
   * Routine complète d'expiration VIP (appelable manuellement depuis l'admin ou les tests).
   */
  async runVipExpirationRoutine(): Promise<{
    expiringSoonCount: number;
    expiredCount: number;
  }> {
    const expiringSoonCount = await this.checkExpiringVips();
    const expiredCount = await this.processExpiredVips();
    return { expiringSoonCount, expiredCount };
  }

  /**
   * 1. Détection des comptes VIP expirant sous 3 jours (J-3) et envoi d'un rappel préventif.
   */
  private async checkExpiringVips(): Promise<number> {
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const today = now.toISOString().split('T')[0];

    const expiringUsers = await this.prisma.user.findMany({
      where: {
        tier: 'VIP',
        tierExpiresAt: {
          gt: now,
          lte: threeDaysLater,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        tierExpiresAt: true,
      },
    });

    let sentCount = 0;

    for (const user of expiringUsers) {
      if (!user.tierExpiresAt) continue;

      const dedupeKey = `vip_reminder_sent:${user.id}:${today}`;
      const alreadySent = await this.redisService.get(dedupeKey);
      if (alreadySent) {
        continue;
      }

      const diffMs = user.tierExpiresAt.getTime() - now.getTime();
      const daysRemaining = Math.max(1, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));

      await this.eventNotificationService.dispatchNotificationEvent({
        type: 'USER_VIP_EXPIRING_SOON',
        recipientUserId: user.id,
        expiresAt: user.tierExpiresAt,
        daysRemaining,
      });

      // Mémoriser l'envoi du rappel pour 72 heures pour ne pas répéter
      await this.redisService.set(dedupeKey, '1', 72 * 3600);
      sentCount++;
    }

    return sentCount;
  }

  /**
   * 2. Détection des comptes VIP dont la date de validité est expirée (rétrogradation automatique à FREE).
   */
  private async processExpiredVips(): Promise<number> {
    const now = new Date();

    const expiredUsers = await this.prisma.user.findMany({
      where: {
        tier: 'VIP',
        tierExpiresAt: {
          lte: now,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        tierExpiresAt: true,
      },
    });

    let processedCount = 0;

    for (const user of expiredUsers) {
      try {
        // Rétrogradation transactionnelle du compte
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            tier: 'FREE',
            tierExpiresAt: null,
          },
        });

        // Enregistrement d'audit système
        await this.prisma.adminAuditLog.create({
          data: {
            userId: 'SYSTEM',
            userName: 'Tâche planifiée (VipExpirationScheduler)',
            action: 'USER_TIER_EXPIRED',
            targetType: 'USER',
            targetId: user.id,
            targetLabel: user.name || user.email,
            reason: 'Expiration automatique du statut VIP au terme de la période allouée.',
            details: {
              previousTier: 'VIP',
              newTier: 'FREE',
              expiredAt: user.tierExpiresAt?.toISOString() || null,
            },
          },
        });

        // Notification et e-mail à l'utilisateur
        await this.eventNotificationService.dispatchNotificationEvent({
          type: 'USER_VIP_EXPIRED',
          recipientUserId: user.id,
        });

        this.logger.log(
          `👑 [VipScheduler] Statut VIP expiré pour ${user.email} (rétrogradé à FREE).`,
        );
        processedCount++;
      } catch (userErr) {
        this.logger.error(
          `❌ [VipScheduler] Échec traitement expiration VIP pour ${user.id} : ${userErr}`,
        );
      }
    }

    return processedCount;
  }
}
