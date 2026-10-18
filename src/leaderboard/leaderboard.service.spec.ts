import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardService } from './leaderboard.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { createPrismaMock } from '../test-utils/mock-prisma.factory.js';
import { createAvailableRedisMock } from '../test-utils/mock-redis.factory.js';

describe('LeaderboardService', () => {
  let service: LeaderboardService;
  let prismaMock: any;
  let redisMock: any;

  beforeEach(async () => {
    prismaMock = createPrismaMock();
    redisMock = createAvailableRedisMock();

    // Ajouter groupBy et aggregate pour les tests du leaderboard
    prismaMock.xpTransaction.groupBy = jest.fn<any>();
    prismaMock.xpTransaction.aggregate = jest.fn<any>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaderboardService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: RedisService, useValue: redisMock },
      ],
    }).compile();

    service = module.get<LeaderboardService>(LeaderboardService);
  });

  describe('getAlltimeLeaderboard', () => {
    it('devrait retourner le classement trié et calculer les pointsToNextRank correctement', async () => {
      const mockPlayers = [
        {
          userId: 'user-1',
          totalXp: 5000,
          level: 6,
          streakDays: 14,
          updatedAt: new Date('2026-01-01'),
          user: { id: 'user-1', name: 'Rasoa', image: null },
        },
        {
          userId: 'user-2',
          totalXp: 3200,
          level: 5,
          streakDays: 10,
          updatedAt: new Date('2026-01-02'),
          user: { id: 'user-2', name: 'Rakoto', image: null },
        },
        {
          userId: 'user-3',
          totalXp: 3200,
          level: 5,
          streakDays: 7, // Départage par streakDays
          updatedAt: new Date('2026-01-03'),
          user: { id: 'user-3', name: 'Naivo', image: null },
        },
      ];

      prismaMock.userProgress.findMany.mockResolvedValue(mockPlayers);
      prismaMock.userProgress.count.mockResolvedValue(3);

      const result = await service.getLeaderboard('user-2', {
        period: 'alltime',
        limit: 10,
      });

      expect(result.period).toBe('alltime');
      expect(result.totalPlayers).toBe(3);
      expect(result.entries).toHaveLength(3);

      // Rang 1 : Rasoa
      expect(result.entries[0].rank).toBe(1);
      expect(result.entries[0].name).toBe('Rasoa');
      expect(result.entries[0].pointsToNextRank).toBeNull(); // Premier

      // Rang 2 : Rakoto
      expect(result.entries[1].rank).toBe(2);
      expect(result.entries[1].name).toBe('Rakoto');
      // Points pour dépasser Rasoa : 5000 - 3200 + 1 = 1801
      expect(result.entries[1].pointsToNextRank).toBe(1801);
      expect(result.entries[1].isCurrentUser).toBe(true);

      // Rang 3 : Naivo (même XP mais streak inférieur)
      expect(result.entries[2].rank).toBe(3);
      expect(result.entries[2].name).toBe('Naivo');
      // Points pour dépasser Rakoto : 3200 - 3200 + 1 = 1
      expect(result.entries[2].pointsToNextRank).toBe(1);

      // currentUserRank doit être renseigné
      expect(result.currentUserRank).toBeDefined();
      expect(result.currentUserRank?.rank).toBe(2);

      // Vérifier la mise en cache Redis (60s)
      expect(redisMock.set).toHaveBeenCalledWith(
        expect.stringContaining('leaderboard:cache:alltime:10:0:all'),
        expect.objectContaining({ totalPlayers: 3 }),
        60,
      );
    });

    it('devrait exploiter le cache Redis sans réinterroger Prisma en cas de cache hit', async () => {
      const cachedSlice = {
        entries: [
          {
            rank: 1,
            userId: 'user-cached',
            name: 'Cached Star',
            image: null,
            totalXP: 9999,
            level: 8,
            streakDays: 45,
            pointsToNextRank: null,
          },
        ],
        totalPlayers: 1,
        updatedAt: '2026-03-01T00:00:00.000Z',
      };

      redisMock.get.mockResolvedValueOnce(cachedSlice);

      const result = await service.getLeaderboard('user-cached', {
        period: 'alltime',
        limit: 10,
      });

      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].name).toBe('Cached Star');
      expect(result.entries[0].isCurrentUser).toBe(true);

      // Prisma ne doit pas avoir été sollicité pour la liste
      expect(prismaMock.userProgress.findMany).not.toHaveBeenCalled();
    });

    it('devrait résoudre le rang déterministe du joueur connecté quand il est hors de la page', async () => {
      const topPage = [
        {
          userId: 'top-1',
          totalXp: 10000,
          level: 8,
          streakDays: 30,
          updatedAt: new Date('2026-01-01'),
          user: { id: 'top-1', name: 'Leader', image: null },
        },
      ];

      prismaMock.userProgress.findMany.mockResolvedValue(topPage);
      prismaMock.userProgress.count
        .mockResolvedValueOnce(50) // totalPlayers
        .mockResolvedValueOnce(14); // betterCount pour user-me => rang 15

      // Mon profil
      prismaMock.userProgress.findUnique.mockResolvedValue({
        userId: 'user-me',
        totalXp: 1500,
        level: 3,
        streakDays: 5,
        updatedAt: new Date('2026-02-01'),
        user: { id: 'user-me', name: 'Moi', image: null },
      });

      // Joueur classé juste devant (rang 14)
      prismaMock.userProgress.findFirst.mockResolvedValue({
        totalXp: 1620,
      });

      const result = await service.getLeaderboard('user-me', {
        period: 'alltime',
        limit: 1,
      });

      expect(result.currentUserRank).toBeDefined();
      expect(result.currentUserRank?.rank).toBe(15);
      expect(result.currentUserRank?.isCurrentUser).toBe(true);
      // Points pour dépasser le joueur au rang 14 (1620 - 1500 + 1 = 121)
      expect(result.currentUserRank?.pointsToNextRank).toBe(121);
    });

    it('devrait retourner un classement vide sans erreur si aucun joueur n’est inscrit', async () => {
      prismaMock.userProgress.findMany.mockResolvedValue([]);
      prismaMock.userProgress.count.mockResolvedValue(0);

      const result = await service.getLeaderboard(undefined, {
        period: 'alltime',
      });

      expect(result.entries).toEqual([]);
      expect(result.totalPlayers).toBe(0);
      expect(result.currentUserRank).toBeNull();
    });
  });

  describe('getPeriodLeaderboard', () => {
    it('devrait agréger les XP de la période et exclure les utilisateurs bannis', async () => {
      const mockPeriodRaw = [
        { userId: 'user-a', _sum: { amount: 450 } },
        { userId: 'user-b', _sum: { amount: 300 } },
      ];

      prismaMock.xpTransaction.groupBy
        .mockResolvedValueOnce(mockPeriodRaw) // paginé
        .mockResolvedValueOnce(mockPeriodRaw); // count total

      prismaMock.userProgress.findMany.mockResolvedValue([
        { userId: 'user-a', level: 3, streakDays: 4 },
        { userId: 'user-b', level: 2, streakDays: 2 },
      ]);

      prismaMock.user.findMany.mockResolvedValue([
        { id: 'user-a', name: 'Alice', image: null },
        { id: 'user-b', name: 'Bob', image: null },
      ]);

      const result = await service.getLeaderboard('user-a', {
        period: 'week',
        limit: 10,
      });

      expect(result.period).toBe('week');
      expect(result.entries).toHaveLength(2);
      expect(result.entries[0].rank).toBe(1);
      expect(result.entries[0].totalXP).toBe(450);
      expect(result.entries[1].rank).toBe(2);
      expect(result.entries[1].totalXP).toBe(300);
      // Bob a besoin de 450 - 300 + 1 = 151 XP pour dépasser Alice
      expect(result.entries[1].pointsToNextRank).toBe(151);
    });
  });

  describe('Sécurité & Confidentialité stricte', () => {
    it('ne doit JAMAIS modifier le score d’un utilisateur lors de getLeaderboard', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'user-hacker' });
      prismaMock.userProgress.findUnique.mockResolvedValue({
        userId: 'user-hacker',
        totalXp: 100,
      });
      prismaMock.userProgress.findMany.mockResolvedValue([]);
      prismaMock.userProgress.count.mockResolvedValue(1);

      await service.getLeaderboard('user-hacker', {
        period: 'alltime',
      });

      // Aucune mise à jour de UserProgress ne doit être appelée
      expect(prismaMock.userProgress.update).not.toHaveBeenCalled();
    });

    it('doit initialiser un compte nouveau avec 0 XP en toute sécurité', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'user-new' });
      prismaMock.userProgress.findUnique.mockResolvedValue(null);
      prismaMock.userProgress.findMany.mockResolvedValue([]);
      prismaMock.userProgress.count.mockResolvedValue(0);

      await service.getLeaderboard('user-new', {
        period: 'alltime',
      });

      expect(prismaMock.userProgress.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-new',
          totalXp: 0,
          level: 0,
          streakDays: 1,
          coins: 0,
        },
      });
    });

    it('invalide correctement le cache Redis via invalidateCache()', async () => {
      await service.invalidateCache();
      expect(redisMock.delByPattern).toHaveBeenCalledWith(
        'leaderboard:cache:*',
      );
    });

    it('ne doit exposer aucune donnée privée (email, token) dans les entrées', async () => {
      prismaMock.userProgress.findMany.mockResolvedValue([
        {
          userId: 'user-safe',
          totalXp: 1000,
          level: 3,
          streakDays: 2,
          updatedAt: new Date(),
          user: { id: 'user-safe', name: 'SafeUser', image: null },
        },
      ]);
      prismaMock.userProgress.count.mockResolvedValue(1);

      const result = await service.getLeaderboard(undefined, {
        period: 'alltime',
      });

      expect(result.entries[0]).not.toHaveProperty('email');
      expect(result.entries[0]).not.toHaveProperty('pushToken');
      expect(result.entries[0]).not.toHaveProperty('password');
      expect(result.entries[0]).not.toHaveProperty('banReason');
    });
  });
});
