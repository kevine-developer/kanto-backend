import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TrueFalseService } from './true-false.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';
import {
  createPrismaMock,
  type PrismaMock,
} from '../../test-utils/mock-prisma.factory.js';

describe('TrueFalseService', () => {
  let service: TrueFalseService;
  let prismaMock: PrismaMock;
  let redisMock: Partial<RedisService>;

  beforeEach(async () => {
    prismaMock = createPrismaMock();
    redisMock = {
      get: jest.fn<(...args: any[]) => Promise<any>>().mockResolvedValue(null),
      set: jest.fn<(...args: any[]) => Promise<any>>().mockResolvedValue('OK'),
      del: jest.fn<(...args: any[]) => Promise<any>>().mockResolvedValue(1),
      delByPattern: jest.fn<(...args: any[]) => Promise<any>>().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrueFalseService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: RedisService, useValue: redisMock },
      ],
    }).compile();

    service = module.get<TrueFalseService>(TrueFalseService);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // getAvailableLevels
  // ─────────────────────────────────────────────────────────────────────────
  describe('Niveaux dynamiques de Vrai ou Faux (10 questions = 1 niveau)', () => {
    describe('getAvailableLevels', () => {
      it('0 question disponible => 0 niveau', async () => {
        (prismaMock.trueFalseQuestion.count as jest.Mock).mockResolvedValue(0);

        const result = await service.getAvailableLevels();

        expect(result.totalQuestions).toBe(0);
        expect(result.availableLevelCount).toBe(0);
        expect(result.levels).toHaveLength(0);
      });

      it('9 questions disponibles => 0 niveau disponible (seuil de 10 non atteint)', async () => {
        (prismaMock.trueFalseQuestion.count as jest.Mock).mockResolvedValue(9);

        const result = await service.getAvailableLevels();

        expect(result.totalQuestions).toBe(9);
        expect(result.availableLevelCount).toBe(0);
        expect(result.levels).toHaveLength(0);
      });

      it('10 questions disponibles => 1 niveau', async () => {
        (prismaMock.trueFalseQuestion.count as jest.Mock).mockResolvedValue(10);

        const result = await service.getAvailableLevels();

        expect(result.totalQuestions).toBe(10);
        expect(result.availableLevelCount).toBe(1);
        expect(result.levels).toHaveLength(1);
        expect(result.levels[0].levelNumber).toBe(1);
        expect(result.levels[0].questionCount).toBe(10);
      });

      it('20 questions disponibles => 2 niveaux', async () => {
        (prismaMock.trueFalseQuestion.count as jest.Mock).mockResolvedValue(20);

        const result = await service.getAvailableLevels();

        expect(result.totalQuestions).toBe(20);
        expect(result.availableLevelCount).toBe(2);
        expect(result.levels).toHaveLength(2);
        expect(result.levels[1].levelNumber).toBe(2);
      });

      it('25 questions disponibles => 2 niveaux (5 questions restantes ignorées pour les niveaux)', async () => {
        (prismaMock.trueFalseQuestion.count as jest.Mock).mockResolvedValue(25);

        const result = await service.getAvailableLevels();

        expect(result.totalQuestions).toBe(25);
        expect(result.availableLevelCount).toBe(2);
        expect(result.levels).toHaveLength(2);
      });

      it('filtre uniquement les questions avec status PUBLISHED', async () => {
        (prismaMock.trueFalseQuestion.count as jest.Mock).mockResolvedValue(10);

        await service.getAvailableLevels('HIST');

        expect(prismaMock.trueFalseQuestion.count).toHaveBeenCalledWith({
          where: {
            status: 'PUBLISHED',
            theme: 'HIST',
          },
        });
      });
    });

    describe('startSession avec levelNumber', () => {
      it('sélectionne exactement les 10 questions du niveau sans doublon (skip et take)', async () => {
        (prismaMock.trueFalseQuestion.count as jest.Mock).mockResolvedValue(30);
        const mockQuestions = Array.from({ length: 10 }, (_, i) => ({
          id: `tf_lvl2_${i + 1}`,
          questionMg: `Fanontaniana ${i + 1}`,
          questionFr: `Question ${i + 1}`,
          theme: 'HIST',
          difficulty: 'MEDIUM',
          image: null,
        }));
        (prismaMock.trueFalseQuestion.findMany as jest.Mock)
          .mockResolvedValueOnce(mockQuestions.map((q) => ({ id: q.id })))
          .mockResolvedValueOnce(mockQuestions);

        (prismaMock.trueFalseSession.create as jest.Mock).mockResolvedValue({
          id: 'tf_sess_2',
          userId: 'usr_1',
          totalQuestions: 10,
        });

        const result = await service.startSession('usr_1', 'HIST', 'MEDIUM', 10, 2);

        expect(prismaMock.trueFalseQuestion.findMany).toHaveBeenNthCalledWith(1, {
          where: { status: 'PUBLISHED', theme: 'HIST' },
          orderBy: { id: 'asc' },
          skip: 10, // (2 - 1) * 10
          take: 10,
          select: { id: true },
        });
        expect(result.sessionId).toBe('tf_sess_2');
        expect(result.questions).toHaveLength(10);
      });

      it('jette NotFoundException si le niveau demandé dépasse les niveaux complets disponibles', async () => {
        (prismaMock.trueFalseQuestion.count as jest.Mock).mockResolvedValue(19); // 1 seul niveau complet

        await expect(
          service.startSession('usr_1', undefined, undefined, 10, 2),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });
});
