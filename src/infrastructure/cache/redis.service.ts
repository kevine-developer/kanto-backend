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
  private readonly localSets = new Map<string, Set<string>>();

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL?.trim();

    if (!redisUrl) {
      this.logger.log(
        'ℹ️ [Redis] Aucune variable REDIS_URL définie. Mode sans cache actif (fallback direct base de données & mémoire).',
      );
      return;
    }

    try {
      const redisOptions = {
        lazyConnect: true,
        enableOfflineQueue: false,
        maxRetriesPerRequest: 1,
        retryStrategy: (times: number) => {
          if (times > 3) {
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

      this.subClient.on('error', () => {
        this.isReady = false;
      });

      this.subClient.on('close', () => {
        // Déconnexion subClient
      });

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

      this.subClient.on('ready', () => {
        void (async () => {
          const channels = Array.from(this.channelSubscribers.keys());
          if (channels.length > 0 && this.subClient) {
            try {
              await this.subClient.subscribe(...channels);
              this.logger.log(
                `📡 [Redis Pub/Sub] Réabonné à ${channels.length} canal/canaux.`,
              );
            } catch (err) {
              this.logger.warn(
                `⚠️ [Redis Pub/Sub] Échec réabonnement : ${err}`,
              );
            }
          }
        })();
      });

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

  isAvailable(): boolean {
    return this.isReady && this.client !== null;
  }

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

  async incr(key: string): Promise<number | null> {
    if (!this.isAvailable() || !this.client) return null;
    try {
      return await this.client.incr(key);
    } catch {
      return null;
    }
  }

  async decr(key: string): Promise<number | null> {
    if (!this.isAvailable() || !this.client) return null;
    try {
      return await this.client.decr(key);
    } catch {
      return null;
    }
  }

  async checkRateLimit(
    key: string,
    maxRequests: number,
    windowSeconds: number,
  ): Promise<{ allowed: boolean; remaining: number }> {
    if (!this.isAvailable() || !this.client) {
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

    this.localEmitter.emit(channel, message);
  }

  async subscribe(
    channel: string,
    callback: (data: any) => void,
  ): Promise<() => void> {
    if (!this.channelSubscribers.has(channel)) {
      this.channelSubscribers.set(channel, new Set());
    }
    this.channelSubscribers.get(channel)!.add(callback);

    this.localEmitter.on(channel, callback);

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

  async sAdd(key: string, ...members: string[]): Promise<number> {
    const validMembers = members.filter((m) => m && m.trim().length > 0);
    if (validMembers.length === 0) return 0;

    if (this.isAvailable() && this.client) {
      try {
        return await this.client.sadd(key, ...validMembers);
      } catch (err: any) {
        this.logger.debug(`[Redis] Erreur sAdd sur ${key} : ${err?.message}`);
      }
    }

    if (!this.localSets.has(key)) {
      this.localSets.set(key, new Set());
    }
    const set = this.localSets.get(key)!;
    let added = 0;
    for (const m of validMembers) {
      if (!set.has(m)) {
        set.add(m);
        added++;
      }
    }
    return added;
  }

  async sMembers(key: string): Promise<string[]> {
    if (this.isAvailable() && this.client) {
      try {
        return await this.client.smembers(key);
      } catch (err: any) {
        this.logger.debug(
          `[Redis] Erreur sMembers sur ${key} : ${err?.message}`,
        );
      }
    }

    const set = this.localSets.get(key);
    return set ? Array.from(set) : [];
  }

  async sIsMember(key: string, member: string): Promise<boolean> {
    if (!member) return false;
    if (this.isAvailable() && this.client) {
      try {
        const res = await this.client.sismember(key, member);
        return res === 1;
      } catch (err: any) {
        this.logger.debug(
          `[Redis] Erreur sIsMember sur ${key} : ${err?.message}`,
        );
      }
    }

    const set = this.localSets.get(key);
    return set ? set.has(member) : false;
  }

  async sRem(key: string, ...members: string[]): Promise<number> {
    const validMembers = members.filter((m) => m && m.trim().length > 0);
    if (validMembers.length === 0) return 0;

    if (this.isAvailable() && this.client) {
      try {
        return await this.client.srem(key, ...validMembers);
      } catch (err: any) {
        this.logger.debug(`[Redis] Erreur sRem sur ${key} : ${err?.message}`);
      }
    }

    const set = this.localSets.get(key);
    if (!set) return 0;
    let removed = 0;
    for (const m of validMembers) {
      if (set.delete(m)) {
        removed++;
      }
    }
    return removed;
  }

  async sCard(key: string): Promise<number> {
    if (this.isAvailable() && this.client) {
      try {
        return await this.client.scard(key);
      } catch (err: any) {
        this.logger.debug(`[Redis] Erreur sCard sur ${key} : ${err?.message}`);
      }
    }

    const set = this.localSets.get(key);
    return set ? set.size : 0;
  }
}
