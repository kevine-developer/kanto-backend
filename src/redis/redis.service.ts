import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { EventEmitter } from 'node:events';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private subClient: Redis | null = null;
  private isReady = false;
  private hasLoggedOfflineWarning = false;
  private readonly localEmitter = new EventEmitter();
  private readonly channelSubscribers = new Map<
    string,
    Set<(data: any) => void>
  >();

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL?.trim();

    // Si aucune URL n'est spécifiée ou vide, on active le mode dégradé direct
    if (!redisUrl) {
      this.logger.log(
        'ℹ️ [Redis] Aucune variable REDIS_URL définie. Mode sans cache actif (fallback direct base de données & mémoire).',
      );
      return;
    }

    try {
      const redisOptions = {
        lazyConnect: true,
        enableOfflineQueue: false, // Ne pas empiler les commandes si déconnecté
        maxRetriesPerRequest: 1,
        retryStrategy: (times: number) => {
          if (times > 3) {
            // Arrêter d'insister pour éviter le spam de logs
            return null;
          }
          return Math.min(times * 1000, 3000);
        },
      };

      this.client = new Redis(redisUrl, redisOptions);
      this.subClient = this.client.duplicate();

      this.client.on('connect', () => {
        this.isReady = true;
        this.hasLoggedOfflineWarning = false;
        this.logger.log('🚀 [Redis] Connecté avec succès au serveur Redis.');
      });

      this.client.on('ready', () => {
        this.isReady = true;
      });

      this.client.on('error', (err: any) => {
        this.isReady = false;
        if (!this.hasLoggedOfflineWarning) {
          this.hasLoggedOfflineWarning = true;
          this.logger.warn(
            `⚠️ [Redis] Serveur Redis inaccessible (${err?.message || 'ECONNREFUSED'}). Bascule transparente sur PostgreSQL & fallback mémoire.`,
          );
        }
      });

      this.client.on('close', () => {
        this.isReady = false;
      });

      // Gestionnaire de messages pour le client Subscriber
      this.subClient.on('message', (channel: string, message: string) => {
        let parsed: any = message;
        try {
          parsed = JSON.parse(message);
        } catch {
          // Format brut si non JSON
        }
        const subs = this.channelSubscribers.get(channel);
        if (subs) {
          subs.forEach((cb) => {
            try {
              cb(parsed);
            } catch (err) {
              this.logger.error(
                `Erreur handler pub/sub sur canal "${channel}" :`,
                err,
              );
            }
          });
        }
      });

      this.subClient.on('ready', async () => {
        const channels = Array.from(this.channelSubscribers.keys());
        if (channels.length > 0 && this.subClient) {
          try {
            await this.subClient.subscribe(...channels);
            this.logger.log(
              `📡 [Redis Pub/Sub] Réabonné à ${channels.length} canal/canaux.`,
            );
          } catch (err) {
            this.logger.warn(`⚠️ [Redis Pub/Sub] Échec réabonnement : ${err}`);
          }
        }
      });

      // Tentative de connexion initiale sans bloquer le démarrage de NestJS
      await Promise.allSettled([
        this.client.connect(),
        this.subClient.connect(),
      ]).catch((err) => {
        this.isReady = false;
        if (!this.hasLoggedOfflineWarning) {
          this.hasLoggedOfflineWarning = true;
          this.logger.warn(
            `⚠️ [Redis] Connexion initiale impossible (${err?.message}). Démarrage en mode fallback.`,
          );
        }
      });
    } catch (err: any) {
      this.isReady = false;
      this.logger.warn(
        `⚠️ [Redis] Erreur d'initialisation du client : ${err?.message}`,
      );
    }
  }

  async onModuleDestroy() {
    if (this.subClient) {
      try {
        await this.subClient.quit();
      } catch {
        this.subClient.disconnect();
      }
    }
    if (this.client) {
      try {
        await this.client.quit();
      } catch {
        this.client.disconnect();
      }
    }
  }

  /**
   * Indique si Redis est actuellement connecté et opérationnel.
   */
  isAvailable(): boolean {
    return this.isReady && this.client !== null;
  }

  /**
   * Récupère un élément depuis le cache Redis.
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.isAvailable() || !this.client) return null;
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  /**
   * Enregistre un élément dans le cache Redis avec TTL optionnel (en secondes).
   */
  async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    if (!this.isAvailable() || !this.client) return false;
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds && ttlSeconds > 0) {
        await this.client.set(key, serialized, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, serialized);
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Supprime une ou plusieurs clés du cache.
   */
  async del(key: string | string[]): Promise<boolean> {
    if (!this.isAvailable() || !this.client) return false;
    try {
      if (Array.isArray(key)) {
        if (key.length > 0) await this.client.del(...key);
      } else {
        await this.client.del(key);
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Supprime toutes les clés correspondant à un motif (ex: "kanto:items:*").
   */
  async delByPattern(pattern: string): Promise<boolean> {
    if (!this.isAvailable() || !this.client) return false;
    try {
      const stream = this.client.scanStream({
        match: pattern,
        count: 100,
      });

      const keysToDelete: string[] = [];

      for await (const resultKeys of stream) {
        if (Array.isArray(resultKeys) && resultKeys.length > 0) {
          keysToDelete.push(...resultKeys);
        }
      }

      if (keysToDelete.length > 0) {
        await this.client.del(...keysToDelete);
        this.logger.debug(
          `🧹 [Redis] ${keysToDelete.length} clés invalidées pour le motif "${pattern}"`,
        );
      }
      return true;
    } catch (err: any) {
      this.logger.debug(`[Redis] Erreur delByPattern : ${err?.message}`);
      return false;
    }
  }

  /**
   * Incrémentation atomique d'un compteur (vues, likes, etc.).
   */
  async incr(key: string): Promise<number | null> {
    if (!this.isAvailable() || !this.client) return null;
    try {
      return await this.client.incr(key);
    } catch {
      return null;
    }
  }

  /**
   * Décrémentation atomique d'un compteur.
   */
  async decr(key: string): Promise<number | null> {
    if (!this.isAvailable() || !this.client) return null;
    try {
      return await this.client.decr(key);
    } catch {
      return null;
    }
  }

  /**
   * Vérification de limite de débit (Rate Limiting) simple et performant.
   * Retourne true si l'action est autorisée, ainsi que le nombre de requêtes restantes.
   */
  async checkRateLimit(
    key: string,
    maxRequests: number,
    windowSeconds: number,
  ): Promise<{ allowed: boolean; remaining: number }> {
    if (!this.isAvailable() || !this.client) {
      // Si Redis n'est pas dispo, on n'empêche pas l'utilisateur de continuer
      return { allowed: true, remaining: maxRequests };
    }

    try {
      const current = await this.client.incr(key);
      if (current === 1) {
        await this.client.expire(key, windowSeconds);
      }
      const remaining = Math.max(0, maxRequests - current);
      return {
        allowed: current <= maxRequests,
        remaining,
      };
    } catch {
      return { allowed: true, remaining: maxRequests };
    }
  }

  /**
   * Publie un événement sur un canal Redis Pub/Sub (avec fallback mémoire in-process).
   */
  async publish(channel: string, message: any): Promise<void> {
    const payload =
      typeof message === 'string' ? message : JSON.stringify(message);

    if (this.isAvailable() && this.client) {
      try {
        await this.client.publish(channel, payload);
        return;
      } catch (err: any) {
        this.logger.warn(
          `⚠️ [Redis Pub/Sub] Erreur publication sur "${channel}" : ${err?.message}`,
        );
      }
    }

    // Fallback mémoire in-process immédiat
    this.localEmitter.emit(channel, message);
  }

  /**
   * S'abonne à un canal Redis Pub/Sub avec fallback mémoire in-process.
   * Retourne une fonction de désabonnement pour libérer les ressources.
   */
  async subscribe(
    channel: string,
    callback: (data: any) => void,
  ): Promise<() => void> {
    if (!this.channelSubscribers.has(channel)) {
      this.channelSubscribers.set(channel, new Set());
    }
    this.channelSubscribers.get(channel)!.add(callback);

    // Écoute locale pour fallback mémoire
    this.localEmitter.on(channel, callback);

    // Écoute Redis si le client subscriber est connecté
    if (this.subClient && this.isReady) {
      try {
        await this.subClient.subscribe(channel);
      } catch (err: any) {
        this.logger.warn(
          `⚠️ [Redis Pub/Sub] Échec souscription sur "${channel}" : ${err?.message}`,
        );
      }
    }

    return () => {
      this.localEmitter.off(channel, callback);
      const subs = this.channelSubscribers.get(channel);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.channelSubscribers.delete(channel);
          if (this.subClient && this.isReady) {
            void this.subClient.unsubscribe(channel).catch(() => {});
          }
        }
      }
    };
  }
}
