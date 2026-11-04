import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RedisService } from '../../redis/redis.service.js';
import { MultiplayerService } from './multiplayer.service.js';
import { MULTIPLAYER_CONFIG } from './multiplayer.constants.js';

@Injectable()
export class MultiplayerExpirationScheduler {
  private readonly logger = new Logger(MultiplayerExpirationScheduler.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly multiplayerService: MultiplayerService,
  ) {}

  /**
   * Tâche d'arrière-plan exécutée toutes les minutes.
   * Détecte et clôture automatiquement les salons multijoueurs non démarrés
   * dont le délai autorisé (TTL) est dépassé.
   * Protégé par un verrou distribué Redis pour éviter les concurrences multi-instances.
   */
  @Cron('*/1 * * * *', {
    name: 'multiplayer-lobby-expiration',
    timeZone: 'UTC',
  })
  async handleExpirationCron(): Promise<void> {
    const acquired = await this.redisService.set(
      MULTIPLAYER_CONFIG.EXPIRATION_LOCK_KEY,
      'locked',
      MULTIPLAYER_CONFIG.EXPIRATION_LOCK_TTL_SECONDS,
    );

    if (!acquired) {
      // Un autre nœud du cluster effectue déjà le balayage
      return;
    }

    try {
      const expiredCount =
        await this.multiplayerService.expirePendingSessions();
      if (expiredCount > 0) {
        this.logger.log(
          `🧹 [MultiplayerScheduler] Nettoyage : ${expiredCount} salon(s) multijoueur(s) expiré(s) clôturé(s).`,
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `❌ [MultiplayerScheduler] Erreur balayage salons expirés : ${msg}`,
      );
    } finally {
      await this.redisService.del(MULTIPLAYER_CONFIG.EXPIRATION_LOCK_KEY);
    }
  }
}

