import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';
import { ReferralService } from '../referral.service.js';
import { ReferralStatus } from '../../../generated/prisma/client.js';

@Injectable()
export class ReferralRecoveryScheduler {
  private readonly logger = new Logger(ReferralRecoveryScheduler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly referralService: ReferralService,
  ) {}

  /**
   * Tâche d'arrière-plan exécutée toutes les 10 minutes.
   * Récupère, analyse et valide de façon asynchrone et idempotente
   * les parrainages restés au statut PENDING suite à une coupure réseau
   * ou à un délai d'activation pendant l'onboarding.
   */
  @Cron('*/10 * * * *', { name: 'referral-recovery-scan', timeZone: 'UTC' })
  async handleRecoveryCron(): Promise<void> {
    const lockKey = 'scheduler_lock:referral_recovery';
    const acquired = await this.redisService.set(lockKey, 'locked', 300); // 5 minutes de verrou
    if (!acquired) {
      this.logger.debug(
        '⏳ [ReferralRecovery] Un autre worker exécute déjà la récupération des parrainages.',
      );
      return;
    }

    try {
      this.logger.log('🚀 [ReferralRecovery] Début du scan des parrainages en attente...');
      const results = await this.runRecoveryRoutine();
      if (results.processedCount > 0) {
        this.logger.log(
          `✅ [ReferralRecovery] Scan terminé : ${results.validatedCount}/${results.processedCount} parrainage(s) en attente validé(s) avec succès.`,
        );
      }
    } catch (err: unknown) {
      this.logger.error(
        `❌ [ReferralRecovery] Erreur lors de la récupération automatique : ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      await this.redisService.del(lockKey);
    }
  }

  /**
   * Routine de récupération appelable manuellement depuis l'admin ou les tests.
   */
  async runRecoveryRoutine(): Promise<{
    processedCount: number;
    validatedCount: number;
  }> {
    // Sélectionner les parrainages PENDING créés depuis au moins 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    const pendingReferrals = await this.prisma.referral.findMany({
      where: {
        status: ReferralStatus.PENDING,
        createdAt: { lte: twoMinutesAgo },
      },
      include: {
        referee: {
          select: {
            id: true,
            emailVerified: true,
            createdAt: true,
            progress: {
              select: {
                totalXp: true,
                level: true,
                coins: true,
              },
            },
          },
        },
      },
      take: 50,
      orderBy: { createdAt: 'asc' },
    });

    let validatedCount = 0;

    for (const referral of pendingReferrals) {
      const referee = referral.referee;
      if (!referee) continue;

      // Conditions d'éligibilité à la validation automatique :
      // 1. Le filleul a commencé à progresser (totalXp > 0)
      // 2. Ou son email a été vérifié
      // 3. Ou son compte a été créé depuis plus de 15 minutes (session active avérée)
      const hasProgressed = (referee.progress?.totalXp || 0) > 0;
      const isEmailVerified = Boolean(referee.emailVerified);
      const isOldEnough =
        Date.now() - new Date(referee.createdAt).getTime() >= 15 * 60 * 1000;

      if (hasProgressed || isEmailVerified || isOldEnough) {
        try {
          const res = await this.referralService.completeReferral(referee.id);
          if (res.completed) {
            validatedCount++;
            this.logger.log(
              `✨ [ReferralRecovery] Parrainage ${referral.id} (filleul ${referee.id}) validé avec succès en arrière-plan.`,
            );
          }
        } catch (err) {
          this.logger.warn(
            `⚠️ [ReferralRecovery] Impossible de valider le parrainage ${referral.id} : ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      }
    }

    return {
      processedCount: pendingReferrals.length,
      validatedCount,
    };
  }
}
