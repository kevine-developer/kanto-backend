import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CivicQuizService } from './civic-quiz.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import {
  createPrismaMock,
  type PrismaMock,
} from '../test-utils/mock-prisma.factory.js';

describe('CivicQuizService', () => {
  let service: CivicQuizService;
  let prismaMock: PrismaMock;
  let redisMock: Partial<RedisService>;

  beforeEach(async () => {
    prismaMock = createPrismaMock();
    redisMock = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue('OK'),
      del: jest.fn().mockResolvedValue(1),
      delByPattern: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CivicQuizService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: RedisService, useValue: redisMock },
      ],
    }).compile();

    service = module.get<CivicQuizService>(CivicQuizService);
  });

  describe('answerSessionQuestion', () => {
    const mockQuestion = {
      id: 'q_1',
      prompt: 'Quelle est la capitale ?',
      choices: ['Antananarivo', 'Toamasina', 'Majunga', 'Fianarantsoa'],
      answerIndex: 0,
      explanation: 'Antananarivo est la capitale.',
      timesPlayed: 5,
      timesCorrect: 3,
    };

    const mockSession = {
      id: 'sess_1',
      userId: 'usr_1',
      isCompleted: false,
      totalQuestions: 10,
    };

    it('devrait valider une réponse correcte et incrémenter les stats', async () => {
      (prismaMock.civicQuizSession.findUnique as jest.Mock).mockResolvedValue(mockSession);
      (prismaMock.civicQuizQuestion.findUnique as jest.Mock).mockResolvedValue(mockQuestion);
      (prismaMock.civicQuizAnswer.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaMock.civicQuizAnswer.create as jest.Mock).mockResolvedValue({ id: 'ans_1' });
      (prismaMock.civicQuizQuestion.update as jest.Mock).mockResolvedValue({ ...mockQuestion, timesPlayed: 6 });

      const result = await service.answerSessionQuestion('sess_1', 'q_1', 0);

      expect(result.isCorrect).toBe(true);
      expect(result.correctIndex).toBe(0);
      expect(prismaMock.civicQuizAnswer.create).toHaveBeenCalledWith({
        data: {
          sessionId: 'sess_1',
          questionId: 'q_1',
          userAnswer: '0',
          isCorrect: true,
        },
      });
    });

    it('devrait détecter une réponse incorrecte', async () => {
      (prismaMock.civicQuizSession.findUnique as jest.Mock).mockResolvedValue(mockSession);
      (prismaMock.civicQuizQuestion.findUnique as jest.Mock).mockResolvedValue(mockQuestion);
      (prismaMock.civicQuizAnswer.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaMock.civicQuizAnswer.create as jest.Mock).mockResolvedValue({ id: 'ans_2' });
      (prismaMock.civicQuizQuestion.update as jest.Mock).mockResolvedValue(mockQuestion);

      const result = await service.answerSessionQuestion('sess_1', 'q_1', 1);

      expect(result.isCorrect).toBe(false);
      expect(result.correctIndex).toBe(0);
    });

    it('devrait empêcher la double soumission pour une même question dans une session', async () => {
      const existingAns = {
        id: 'ans_old',
        sessionId: 'sess_1',
        questionId: 'q_1',
        isCorrect: true,
      };

      (prismaMock.civicQuizSession.findUnique as jest.Mock).mockResolvedValue(mockSession);
      (prismaMock.civicQuizQuestion.findUnique as jest.Mock).mockResolvedValue(mockQuestion);
      (prismaMock.civicQuizAnswer.findFirst as jest.Mock).mockResolvedValue(existingAns);

      const result = await service.answerSessionQuestion('sess_1', 'q_1', 0);

      expect(result.isCorrect).toBe(true);
      // Ne doit pas recréer de réponse dans la base
      expect(prismaMock.civicQuizAnswer.create).not.toHaveBeenCalled();
    });

    it('devrait refuser de répondre si la session est déjà terminée', async () => {
      (prismaMock.civicQuizSession.findUnique as jest.Mock).mockResolvedValue({
        ...mockSession,
        isCompleted: true,
      });
      (prismaMock.civicQuizQuestion.findUnique as jest.Mock).mockResolvedValue(mockQuestion);

      const result = await service.answerSessionQuestion('sess_1', 'q_1', 0);

      expect(result.isCorrect).toBe(false);
      expect(result.explanation).toContain('terminée');
      expect(prismaMock.civicQuizAnswer.create).not.toHaveBeenCalled();
    });

    it('devrait lever NotFoundException si la session n\'existe pas', async () => {
      (prismaMock.civicQuizSession.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.answerSessionQuestion('sess_null', 'q_1', 0)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('finishSession', () => {
    it('devrait calculer le score, le streak et attribuer les XP correctement', async () => {
      const mockSession = {
        id: 'sess_1',
        userId: 'usr_1',
        isCompleted: false,
      };

      const mockAnswers = [
        { isCorrect: true },
        { isCorrect: true },
        { isCorrect: true },
        { isCorrect: false },
        { isCorrect: true },
      ];

      (prismaMock.civicQuizSession.findUnique as jest.Mock).mockResolvedValue(mockSession);
      (prismaMock.civicQuizAnswer.findMany as jest.Mock).mockResolvedValue(mockAnswers);
      (prismaMock.civicQuizSession.update as jest.Mock).mockResolvedValue({
        ...mockSession,
        score: 4,
        isCompleted: true,
        xpEarned: 50, // 4 * 10 + 10 (bonus streak 3)
      });
      (prismaMock.userProgress.upsert as jest.Mock).mockResolvedValue({});
      (prismaMock.xpTransaction.create as jest.Mock).mockResolvedValue({});

      const finished = await service.finishSession('sess_1', 45);

      expect(prismaMock.civicQuizSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'sess_1' },
          data: expect.objectContaining({
            score: 4,
            streakMax: 3,
            durationSeconds: 45,
            isCompleted: true,
            xpEarned: 50,
          }),
        }),
      );
      expect(prismaMock.userProgress.upsert).toHaveBeenCalled();
    });

    it('ne devrait pas ré-attribuer d\'XP si la session était déjà finalisée', async () => {
      const completedSession = {
        id: 'sess_done',
        userId: 'usr_1',
        isCompleted: true,
        score: 5,
        xpEarned: 50,
      };

      (prismaMock.civicQuizSession.findUnique as jest.Mock).mockResolvedValue(completedSession);

      const result = await service.finishSession('sess_done', 30);

      expect(result).toEqual(completedSession);
      expect(prismaMock.civicQuizSession.update).not.toHaveBeenCalled();
      expect(prismaMock.userProgress.upsert).not.toHaveBeenCalled();
    });
  });
});
