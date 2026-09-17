import { jest } from '@jest/globals';

/**
 * Factory de mock RedisService pour les tests unitaires.
 *
 * Fournit deux états :
 * - `createAvailableRedisMock()` : Redis connecté et opérationnel
 * - `createUnavailableRedisMock()` : Redis hors ligne (fallback mode)
 */

export function createAvailableRedisMock() {
  return {
    isAvailable: jest.fn().mockReturnValue(true),
    get: (jest.fn as any)().mockResolvedValue(null),
    set: (jest.fn as any)().mockResolvedValue(true),
    del: (jest.fn as any)().mockResolvedValue(true),
    delByPattern: (jest.fn as any)().mockResolvedValue(true),
    incr: (jest.fn as any)().mockResolvedValue(1),
    decr: (jest.fn as any)().mockResolvedValue(0),
    checkRateLimit: (jest.fn as any)().mockResolvedValue({
      allowed: true,
      remaining: 99,
    }),
    publish: (jest.fn as any)().mockResolvedValue(undefined),
    subscribe: (jest.fn as any)().mockResolvedValue(() => {}),
  };
}

export function createUnavailableRedisMock() {
  return {
    isAvailable: jest.fn().mockReturnValue(false),
    get: (jest.fn as any)().mockResolvedValue(null),
    set: (jest.fn as any)().mockResolvedValue(false),
    del: (jest.fn as any)().mockResolvedValue(false),
    delByPattern: (jest.fn as any)().mockResolvedValue(false),
    incr: (jest.fn as any)().mockResolvedValue(null),
    decr: (jest.fn as any)().mockResolvedValue(null),
    checkRateLimit: (jest.fn as any)().mockResolvedValue({
      allowed: true,
      remaining: 100,
    }),
    publish: (jest.fn as any)().mockResolvedValue(undefined),
    subscribe: (jest.fn as any)().mockResolvedValue(() => {}),
  };
}

export type RedisMock = ReturnType<typeof createAvailableRedisMock>;
