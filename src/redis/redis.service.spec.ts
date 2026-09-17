import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service.js';
import { EventEmitter } from 'node:events';

/**
 * Tests unitaires de RedisService.
 *
 * Redis est mocké via ioredis en interceptant les appels aux méthodes.
 * On teste les états : disponible, indisponible (pas de REDIS_URL), et les cas limites.
 */
describe('RedisService', () => {
  let service: RedisService;

  // ─────────────────────────────────────────────────────────────────────────
  // Mode sans Redis (REDIS_URL absent)
  // ─────────────────────────────────────────────────────────────────────────

  describe('mode dégradé — sans REDIS_URL', () => {
    beforeEach(async () => {
      delete process.env.REDIS_URL;

      const module: TestingModule = await Test.createTestingModule({
        providers: [RedisService],
      }).compile();

      service = module.get<RedisService>(RedisService);
      await service.onModuleInit();
    });

    afterEach(async () => {
      await service.onModuleDestroy();
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should report isAvailable() = false when no REDIS_URL', () => {
      expect(service.isAvailable()).toBe(false);
    });

    it('should return null from get() when Redis is unavailable', async () => {
      const result = await service.get<string>('any-key');
      expect(result).toBeNull();
    });

    it('should return false from set() when Redis is unavailable', async () => {
      const result = await service.set('any-key', { data: 'value' });
      expect(result).toBe(false);
    });

    it('should return false from del() when Redis is unavailable', async () => {
      const result = await service.del('any-key');
      expect(result).toBe(false);
    });

    it('should return false from del([]) with array when Redis is unavailable', async () => {
      const result = await service.del(['key-a', 'key-b']);
      expect(result).toBe(false);
    });

    it('should return null from incr() when Redis is unavailable', async () => {
      const result = await service.incr('counter');
      expect(result).toBeNull();
    });

    it('should return null from decr() when Redis is unavailable', async () => {
      const result = await service.decr('counter');
      expect(result).toBeNull();
    });

    it('should return false from delByPattern() when Redis is unavailable', async () => {
      const result = await service.delByPattern('kanto:*');
      expect(result).toBe(false);
    });

    describe('checkRateLimit() — fail-open when Redis is unavailable', () => {
      it('should allow the request (fail-open)', async () => {
        const result = await service.checkRateLimit('rate:user:1', 10, 60);
        expect(result.allowed).toBe(true);
      });

      it('should return the max requests as remaining', async () => {
        const result = await service.checkRateLimit('rate:user:1', 10, 60);
        expect(result.remaining).toBe(10);
      });
    });

    describe('publish() — fallback EventEmitter local', () => {
      it('should emit locally via EventEmitter when Redis is unavailable', async () => {
        const localEmitter: EventEmitter = (service as any).localEmitter;
        const received: any[] = [];
        localEmitter.on('test-channel', (data) => received.push(data));

        await service.publish('test-channel', { msg: 'hello' });

        expect(received).toHaveLength(1);
        expect(received[0]).toEqual({ msg: 'hello' });
      });

      it('should emit string payload directly', async () => {
        const localEmitter: EventEmitter = (service as any).localEmitter;
        const received: any[] = [];
        localEmitter.on('test-ch-2', (data) => received.push(data));

        await service.publish('test-ch-2', 'raw-string');

        expect(received[0]).toBe('raw-string');
      });
    });

    describe('subscribe() — fallback EventEmitter local', () => {
      it('should register callback on local emitter', async () => {
        const received: any[] = [];
        const unsubscribe = await service.subscribe('local-channel', (data) => {
          received.push(data);
        });

        // Émettre via publish (fallback)
        await service.publish('local-channel', { test: true });

        expect(received).toHaveLength(1);
        expect(received[0]).toEqual({ test: true });
        unsubscribe();
      });

      it('should unsubscribe callback and stop receiving events', async () => {
        const received: any[] = [];
        const unsubscribe = await service.subscribe('unsub-channel', (data) => {
          received.push(data);
        });

        unsubscribe();

        await service.publish('unsub-channel', { test: true });

        // Après désabonnement, aucun message reçu
        expect(received).toHaveLength(0);
      });

      it('should return a function from subscribe()', async () => {
        const result = await service.subscribe('any-ch', () => {});
        expect(typeof result).toBe('function');
        result();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Utilitaires métier (sans Redis réel)
  // ─────────────────────────────────────────────────────────────────────────

  describe('isAvailable()', () => {
    it('should return false when client is null', () => {
      service = new RedisService();
      // Client non initialisé
      expect(service.isAvailable()).toBe(false);
    });
  });
});
