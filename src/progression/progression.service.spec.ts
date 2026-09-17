import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ProgressionService } from './progression.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { BadgesService } from '../badges/badges.service.js';
import {
  createPrismaMock,
  type PrismaMock,
} from '../test-utils/mock-prisma.factory.js';
import { createAvailableRedisMock } from '../test-utils/mock-redis.factory.js';
import { buildUserProgress } from '../test-utils/builders/user.builder.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: crée un mock de transaction Prisma qui exécute le callback avec
// un mock Prisma frais pour simuler les transactions réelles.
// ─────────────────────────────────────────────────────────────────────────────
function makeTransactionalPrismaMock(): PrismaMock {
  const mock = createPrismaMock();
  // $transaction exécute le callback avec le même mock (comportement synchrone simulé)
  mock.$transaction.mockImplementation(async (fn: (tx: any) => Promise<any>) =>
    fn(mock),
  );
  return mock;
}

describe('ProgressionService', () => {
  let service: ProgressionService;
  let prismaMock: PrismaMock;
  let redisMock: ReturnType<typeof createAvailableRedisMock>;
  let badgesServiceMock: { checkAndUnlockBadges: jest.Mock };

  beforeEach(async () => {
    prismaMock = makeTransactionalPrismaMock();
    redisMock = createAvailableRedisMock();
    badgesServiceMock = {
      checkAndUnlockBadges: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressionService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: RedisService, useValue: redisMock },
        { provide: BadgesService, useValue: badgesServiceMock },
      ],
    }).compile();

    service = module.get<ProgressionService>(ProgressionService);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // calculateLevel (méthode privée — testée via recordDailyLogin)
  // ─────────────────────────────────────────────────────────────────────────

  describe('calculateLevel (via seuils XP)', () => {
    // Accès à la méthode privée via cast any pour les tests de seuils
    const getLevel = (xp: number) => (service as any).calculateLevel(xp);

    it('should return level 1 for XP = 0', () => expect(getLevel(0)).toBe(1));
    it('should return level 1 for XP = 49', () => expect(getLevel(49)).toBe(1));
    it('should return level 2 for XP = 50', () => expect(getLevel(50)).toBe(2));
    it('should return level 2 for XP = 149', () =>
      expect(getLevel(149)).toBe(2));
    it('should return level 3 for XP = 150', () =>
      expect(getLevel(150)).toBe(3));
    it('should return level 4 for XP = 300', () =>
      expect(getLevel(300)).toBe(4));
    it('should return level 5 for XP = 500', () =>
      expect(getLevel(500)).toBe(5));
    it('should return level 6 for XP = 800', () =>
      expect(getLevel(800)).toBe(6));
    it('should return level 7 for XP = 1200', () =>
      expect(getLevel(1200)).toBe(7));
    it('should return level 8 for XP = 1700', () =>
      expect(getLevel(1700)).toBe(8));
    it('should return level 9 for XP = 2300', () =>
      expect(getLevel(2300)).toBe(9));
    it('should return level 10 for XP = 3000', () =>
      expect(getLevel(3000)).toBe(10));
    it('should return level 11 for XP = 4000', () =>
      expect(getLevel(4000)).toBe(11));
    it('should return level 12 for XP = 5000', () =>
      expect(getLevel(5000)).toBe(12));

    it('should return level 1 for negative XP (guard)', () => {
      expect(getLevel(-100)).toBe(1);
    });

    it('should return level 1 for undefined/null XP (guard)', () => {
      expect(getLevel(null)).toBe(1);
      expect(getLevel(undefined)).toBe(1);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // calculateLevelUpCoins
  // ─────────────────────────────────────────────────────────────────────────

  describe('calculateLevelUpCoins', () => {
    const getCoins = (level: number) =>
      (service as any).calculateLevelUpCoins(level);

    it('should return 25 minimum coins for level 1', () => {
      expect(getCoins(1)).toBe(25); // max(25, 1*25) = 25
    });

    it('should return 50 coins for level 2', () => {
      expect(getCoins(2)).toBe(50);
    });

    it('should scale linearly with level', () => {
      expect(getCoins(10)).toBe(250);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // recordDailyLogin
  // ─────────────────────────────────────────────────────────────────────────

  describe('recordDailyLogin', () => {
    const userId = 'user-daily-1';

    it('should return streakStatus="started" and streakDays=1 for first login', async () => {
      prismaMock.userProgress.findUnique.mockResolvedValue(null); // Pas de progression
      prismaMock.userProgress.create.mockResolvedValue(
        buildUserProgress(userId, {
          streakDays: 1,
          totalXp: 5,
          level: 1,
          coins: 0,
        }),
      );
      prismaMock.xpTransaction.create.mockResolvedValue({});
      prismaMock.user.findUnique.mockResolvedValue({
        name: 'Test',
        image: null,
      });

      const result = await service.recordDailyLogin(userId);

      expect(result.streakStatus).toBe('started');
      expect(result.progress.streakDays).toBe(1);
      expect(result.xpBonus).toBeGreaterThan(0);
    });

    it('should return streakStatus="already_recorded" when called twice in same day', async () => {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      prismaMock.userProgress.findUnique.mockResolvedValue(
        buildUserProgress(userId, {
          streakDays: 3,
          totalXp: 50,
          level: 2,
          coins: 25,
          lastLoginDate: today,
        }),
      );

      const result = await service.recordDailyLogin(userId);

      expect(result.streakStatus).toBe('already_recorded');
      expect(result.xpBonus).toBe(0);
    });

    it('should return streakStatus="continued" and increment streak when logging in the next day', async () => {
      const yesterday = new Date();
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      yesterday.setUTCHours(0, 0, 0, 0);

      prismaMock.userProgress.findUnique.mockResolvedValue(
        buildUserProgress(userId, {
          streakDays: 2,
          totalXp: 30,
          level: 1,
          coins: 0,
          lastLoginDate: yesterday,
        }),
      );
      prismaMock.userProgress.update.mockResolvedValue(
        buildUserProgress(userId, {
          streakDays: 3,
          totalXp: 45,
          level: 1,
          coins: 0,
        }),
      );
      prismaMock.xpTransaction.create.mockResolvedValue({});
      prismaMock.user.findUnique.mockResolvedValue({
        name: 'Test',
        image: null,
      });

      const result = await service.recordDailyLogin(userId);

      expect(result.streakStatus).toBe('continued');
      expect(result.progress.streakDays).toBe(3);
    });

    it('should reset streak to 1 when gap is more than 1 day', async () => {
      // Dernière connexion il y a 3 jours
      const threeDaysAgo = new Date();
      threeDaysAgo.setUTCDate(threeDaysAgo.getUTCDate() - 3);
      threeDaysAgo.setUTCHours(0, 0, 0, 0);

      prismaMock.userProgress.findUnique.mockResolvedValue(
        buildUserProgress(userId, {
          streakDays: 5,
          totalXp: 100,
          level: 3,
          coins: 75,
          lastLoginDate: threeDaysAgo,
        }),
      );
      prismaMock.userProgress.update.mockResolvedValue(
        buildUserProgress(userId, {
          streakDays: 1,
          totalXp: 105,
          level: 3,
          coins: 75,
        }),
      );
      prismaMock.xpTransaction.create.mockResolvedValue({});
      prismaMock.user.findUnique.mockResolvedValue({
        name: 'Test',
        image: null,
      });

      const result = await service.recordDailyLogin(userId);

      expect(result.streakStatus).toBe('started');
      expect(result.progress.streakDays).toBe(1);
    });

    it('should cap streak XP bonus at 7 days (max 35 XP)', async () => {
      // Streak de 10 jours consécutifs → plafond à 7 → bonus XP = STREAK_XP_BONUS[7] = 35
      const yesterday = new Date();
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      yesterday.setUTCHours(0, 0, 0, 0);

      prismaMock.userProgress.findUnique.mockResolvedValue(
        buildUserProgress(userId, {
          streakDays: 10, // déjà à 10
          totalXp: 500,
          level: 5,
          coins: 125,
          lastLoginDate: yesterday,
        }),
      );
      prismaMock.userProgress.update.mockResolvedValue(
        buildUserProgress(userId, {
          streakDays: 11,
          totalXp: 535,
          level: 5,
          coins: 125,
        }),
      );
      prismaMock.xpTransaction.create.mockResolvedValue({});
      prismaMock.user.findUnique.mockResolvedValue({
        name: 'Test',
        image: null,
      });

      const result = await service.recordDailyLogin(userId);

      // Le bonus est plafonné à STREAK_XP_BONUS[min(newStreak, 7)] = STREAK_XP_BONUS[7] = 35
      expect(result.xpBonus).toBe(35);
    });

    it('should give XP bonus = 5 for day 1', async () => {
      // Premier enregistrement → streak 1 → STREAK_XP_BONUS[1] = 5
      prismaMock.userProgress.findUnique.mockResolvedValue(null);
      prismaMock.userProgress.create.mockResolvedValue(
        buildUserProgress(userId, {
          streakDays: 1,
          totalXp: 5,
          level: 1,
          coins: 0,
        }),
      );
      prismaMock.xpTransaction.create.mockResolvedValue({});
      prismaMock.user.findUnique.mockResolvedValue({
        name: 'Test',
        image: null,
      });

      const result = await service.recordDailyLogin(userId);

      expect(result.xpBonus).toBe(5);
    });

    it('should award coins on level up', async () => {
      const yesterday = new Date();
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      yesterday.setUTCHours(0, 0, 0, 0);

      // XP juste avant le seuil de niveau 2 (50)
      prismaMock.userProgress.findUnique.mockResolvedValue(
        buildUserProgress(userId, {
          streakDays: 1,
          totalXp: 45, // +5 XP → 50 → passage niveau 2
          level: 1,
          coins: 0,
          lastLoginDate: yesterday,
        }),
      );
      prismaMock.userProgress.update.mockResolvedValue(
        buildUserProgress(userId, {
          streakDays: 2,
          totalXp: 55,
          level: 2,
          coins: 50, // 2 * 25 = 50 pièces pour niveau 2
        }),
      );
      prismaMock.xpTransaction.create.mockResolvedValue({});
      prismaMock.user.findUnique.mockResolvedValue({
        name: 'Test',
        image: null,
      });

      const result = await service.recordDailyLogin(userId);

      expect(result.progress.level).toBe(2);
      expect(result.progress.coins).toBe(50);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // getProgression
  // ─────────────────────────────────────────────────────────────────────────

  describe('getProgression', () => {
    it('should return existing progress and game progressions', async () => {
      const userId = 'user-1';
      const progress = buildUserProgress(userId, { totalXp: 150, level: 3 });
      const games = [{ gameType: 'RIDDLE', unlockedLevelIndex: 2 }];

      prismaMock.userProgress.findUnique.mockResolvedValue(progress);
      prismaMock.gameProgression.findMany.mockResolvedValue(games);

      const result = await service.getProgression(userId);

      expect(result.progress).toEqual(progress);
      expect(result.games).toEqual(games);
    });

    it('should create userProgress if it does not exist', async () => {
      const userId = 'user-new';
      const newProgress = buildUserProgress(userId, { totalXp: 0, level: 1 });

      prismaMock.userProgress.findUnique.mockResolvedValue(null);
      prismaMock.userProgress.create.mockResolvedValue(newProgress);
      prismaMock.gameProgression.findMany.mockResolvedValue([]);

      const result = await service.getProgression(userId);

      expect(prismaMock.userProgress.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ userId, totalXp: 0, level: 1 }),
        }),
      );
      expect(result.progress).toEqual(newProgress);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // syncProgression
  // ─────────────────────────────────────────────────────────────────────────

  describe('syncProgression', () => {
    const userId = 'user-sync';

    it('should add XP from transactions to existing progress', async () => {
      const progress = buildUserProgress(userId, {
        totalXp: 100,
        level: 3,
        coins: 75,
      });
      prismaMock.userProgress.findUnique.mockResolvedValue(progress);
      prismaMock.userProgress.update.mockResolvedValue({
        ...progress,
        totalXp: 150,
        level: 3,
      });
      prismaMock.xpTransaction.create.mockResolvedValue({});
      prismaMock.gameProgression.findMany.mockResolvedValue([]);
      prismaMock.user.findUnique.mockResolvedValue({
        name: 'Test',
        image: null,
      });

      await service.syncProgression(userId, {
        xpTransactions: [
          { amount: 50, source: 'GAME_RIDDLE', description: 'Test' },
        ],
        games: [],
      });

      expect(prismaMock.xpTransaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ amount: 50, source: 'GAME_RIDDLE' }),
        }),
      );
    });

    it('should ignore XP transactions with amount <= 0', async () => {
      const progress = buildUserProgress(userId, { totalXp: 100, level: 3 });
      prismaMock.userProgress.findUnique.mockResolvedValue(progress);
      prismaMock.gameProgression.findMany.mockResolvedValue([]);

      await service.syncProgression(userId, {
        xpTransactions: [
          { amount: 0, source: 'GAME_RIDDLE', description: 'Zero' },
          { amount: -10, source: 'GAME_RIDDLE', description: 'Negative' },
        ],
        games: [],
      });

      // Aucune transaction créée car toutes à <= 0
      expect(prismaMock.xpTransaction.create).not.toHaveBeenCalled();
    });

    it('should deduplicate reading_time transactions', async () => {
      const progress = buildUserProgress(userId, { totalXp: 100, level: 3 });
      prismaMock.userProgress.findUnique.mockResolvedValue(progress);
      prismaMock.xpTransaction.findFirst.mockResolvedValue({
        id: 'existing-tx',
        source: 'reading_time:item-123',
      }); // Transaction déjà existante
      prismaMock.gameProgression.findMany.mockResolvedValue([]);

      await service.syncProgression(userId, {
        xpTransactions: [
          {
            amount: 10,
            source: 'reading_time:item-123',
            description: 'Lecture',
          },
        ],
        games: [],
      });

      // La transaction ne doit PAS être créée car déjà existante
      expect(prismaMock.xpTransaction.create).not.toHaveBeenCalled();
    });

    it('should allow non-reading_time duplicate sources', async () => {
      const progress = buildUserProgress(userId, { totalXp: 100, level: 3 });
      prismaMock.userProgress.findUnique.mockResolvedValue(progress);
      prismaMock.userProgress.update.mockResolvedValue({
        ...progress,
        totalXp: 110,
      });
      prismaMock.xpTransaction.create.mockResolvedValue({});
      prismaMock.gameProgression.findMany.mockResolvedValue([]);
      prismaMock.user.findUnique.mockResolvedValue({
        name: 'Test',
        image: null,
      });

      await service.syncProgression(userId, {
        xpTransactions: [
          { amount: 10, source: 'GAME_RIDDLE', description: 'Partie 1' },
          { amount: 10, source: 'GAME_RIDDLE', description: 'Partie 2' }, // Même source, pas de dédup
        ],
        games: [],
      });

      // Les deux doivent être créées (pas de dédup pour les sources non reading_time)
      expect(prismaMock.xpTransaction.create).toHaveBeenCalledTimes(2);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // replaceProgression
  // ─────────────────────────────────────────────────────────────────────────

  describe('replaceProgression', () => {
    const userId = 'user-replace';

    it('should clamp negative XP to 0', async () => {
      prismaMock.userProgress.upsert.mockResolvedValue(
        buildUserProgress(userId, { totalXp: 0, level: 1 }),
      );
      prismaMock.gameProgression.findMany.mockResolvedValue([]);
      prismaMock.user.findUnique.mockResolvedValue({
        name: 'Test',
        image: null,
      });

      await service.replaceProgression(userId, {
        totalXp: -500, // valeur négative
        level: 1,
        coins: 0,
        streakDays: 0,
        games: [],
        xpTransactions: [],
      });

      expect(prismaMock.userProgress.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: expect.objectContaining({
            totalXp: 0, // Math.max(0, -500) = 0
          }),
        }),
      );
    });

    it('should clamp level to minimum 1', async () => {
      prismaMock.userProgress.upsert.mockResolvedValue(
        buildUserProgress(userId, { totalXp: 0, level: 1 }),
      );
      prismaMock.gameProgression.findMany.mockResolvedValue([]);
      prismaMock.user.findUnique.mockResolvedValue({
        name: 'Test',
        image: null,
      });

      await service.replaceProgression(userId, {
        totalXp: 0,
        level: -5, // invalide
        coins: 0,
        streakDays: 0,
        games: [],
        xpTransactions: [],
      });

      expect(prismaMock.userProgress.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: expect.objectContaining({
            level: 1, // Math.max(1, -5) = 1
          }),
        }),
      );
    });

    it('should delete old game progressions before recreating them', async () => {
      prismaMock.userProgress.upsert.mockResolvedValue(
        buildUserProgress(userId, { totalXp: 100, level: 3 }),
      );
      prismaMock.gameProgression.deleteMany.mockResolvedValue({ count: 2 });
      prismaMock.gameProgression.create.mockResolvedValue({});
      prismaMock.gameProgression.findMany.mockResolvedValue([]);
      prismaMock.user.findUnique.mockResolvedValue({
        name: 'Test',
        image: null,
      });

      await service.replaceProgression(userId, {
        totalXp: 100,
        level: 3,
        coins: 75,
        streakDays: 3,
        games: [
          { gameType: 'RIDDLE', unlockedLevelIndex: 2, levelStars: [3, 2, 1] },
        ],
        xpTransactions: [],
      });

      expect(prismaMock.gameProgression.deleteMany).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(prismaMock.gameProgression.create).toHaveBeenCalledTimes(1);
    });
  });
});
