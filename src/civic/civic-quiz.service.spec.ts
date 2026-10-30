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
      (prismaMock.civicQuizSession.findUnique as jest.Mock).mockResolvedValue(
        mockSession,
      );
      (prismaMock.civicQuizQuestion.findUnique as jest.Mock).mockResolvedValue(
        mockQuestion,
      );
      (prismaMock.civicQuizAnswer.findFirst as jest.Mock).mockResolvedValue(
        null,
      );
      (prismaMock.civicQuizAnswer.create as jest.Mock).mockResolvedValue({
        id: 'ans_1',
      });
      (prismaMock.civicQuizQuestion.update as jest.Mock).mockResolvedValue({
        ...mockQuestion,
        timesPlayed: 6,
      });

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
      (prismaMock.civicQuizSession.findUnique as jest.Mock).mockResolvedValue(
        mockSession,
      );
      (prismaMock.civicQuizQuestion.findUnique as jest.Mock).mockResolvedValue(
        mockQuestion,
      );
      (prismaMock.civicQuizAnswer.findFirst as jest.Mock).mockResolvedValue(
        null,
      );
      (prismaMock.civicQuizAnswer.create as jest.Mock).mockResolvedValue({
        id: 'ans_2',
      });
      (prismaMock.civicQuizQuestion.update as jest.Mock).mockResolvedValue(
        mockQuestion,
      );

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

      (prismaMock.civicQuizSession.findUnique as jest.Mock).mockResolvedValue(
        mockSession,
      );
      (prismaMock.civicQuizQuestion.findUnique as jest.Mock).mockResolvedValue(
        mockQuestion,
      );
      (prismaMock.civicQuizAnswer.findFirst as jest.Mock).mockResolvedValue(
        existingAns,
      );

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
      (prismaMock.civicQuizQuestion.findUnique as jest.Mock).mockResolvedValue(
        mockQuestion,
      );

      const result = await service.answerSessionQuestion('sess_1', 'q_1', 0);

      expect(result.isCorrect).toBe(false);
      expect(result.explanation).toContain('terminée');
      expect(prismaMock.civicQuizAnswer.create).not.toHaveBeenCalled();
    });

    it("devrait lever NotFoundException si la session n'existe pas", async () => {
      (prismaMock.civicQuizSession.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(
        service.answerSessionQuestion('sess_null', 'q_1', 0),
      ).rejects.toThrow(NotFoundException);
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

      (prismaMock.civicQuizSession.findUnique as jest.Mock).mockResolvedValue(
        mockSession,
      );
      (prismaMock.civicQuizAnswer.findMany as jest.Mock).mockResolvedValue(
        mockAnswers,
      );
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

    it("ne devrait pas ré-attribuer d'XP si la session était déjà finalisée", async () => {
      const completedSession = {
        id: 'sess_done',
        userId: 'usr_1',
        isCompleted: true,
        score: 5,
        xpEarned: 50,
      };

      (prismaMock.civicQuizSession.findUnique as jest.Mock).mockResolvedValue(
        completedSession,
      );

      const result = await service.finishSession('sess_done', 30);

      expect(result).toEqual(completedSession);
      expect(prismaMock.civicQuizSession.update).not.toHaveBeenCalled();
      expect(prismaMock.userProgress.upsert).not.toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // getAvailableLevels & startSession dynamique (Règle : 10 questions = 1 niveau)
  // ─────────────────────────────────────────────────────────────────────────
  describe('Niveaux dynamiques de quiz (10 questions = 1 niveau)', () => {
    describe('getAvailableLevels', () => {
      it('0 question disponible => 0 niveau', async () => {
        (prismaMock.civicQuizQuestion.count as jest.Mock).mockResolvedValue(0);

        const result = await service.getAvailableLevels();

        expect(result.totalQuestions).toBe(0);
        expect(result.availableLevelCount).toBe(0);
        expect(result.levels).toHaveLength(0);
      });

      it('9 questions disponibles => 0 niveau disponible (seuil de 10 non atteint)', async () => {
        (prismaMock.civicQuizQuestion.count as jest.Mock).mockResolvedValue(9);

        const result = await service.getAvailableLevels();

        expect(result.totalQuestions).toBe(9);
        expect(result.availableLevelCount).toBe(0);
        expect(result.levels).toHaveLength(0);
      });

      it('10 questions disponibles => 1 niveau', async () => {
        (prismaMock.civicQuizQuestion.count as jest.Mock).mockResolvedValue(10);

        const result = await service.getAvailableLevels();

        expect(result.totalQuestions).toBe(10);
        expect(result.availableLevelCount).toBe(1);
        expect(result.levels).toHaveLength(1);
        expect(result.levels[0].levelNumber).toBe(1);
        expect(result.levels[0].questionCount).toBe(10);
      });

      it('20 questions disponibles => 2 niveaux', async () => {
        (prismaMock.civicQuizQuestion.count as jest.Mock).mockResolvedValue(20);

        const result = await service.getAvailableLevels();

        expect(result.totalQuestions).toBe(20);
        expect(result.availableLevelCount).toBe(2);
        expect(result.levels).toHaveLength(2);
        expect(result.levels[1].levelNumber).toBe(2);
      });

      it('25 questions disponibles => 2 niveaux (5 questions restantes ignorées pour les niveaux complets)', async () => {
        (prismaMock.civicQuizQuestion.count as jest.Mock).mockResolvedValue(25);

        const result = await service.getAvailableLevels();

        expect(result.totalQuestions).toBe(25);
        expect(result.availableLevelCount).toBe(2);
        expect(result.levels).toHaveLength(2);
      });

      it('filtre uniquement les questions avec status PUBLISHED', async () => {
        (prismaMock.civicQuizQuestion.count as jest.Mock).mockResolvedValue(10);

        await service.getAvailableLevels('HISTOIRE');

        expect(prismaMock.civicQuizQuestion.count).toHaveBeenCalledWith({
          where: {
            status: 'PUBLISHED',
            category: 'HISTOIRE',
          },
        });
      });
    });

    describe('startSession avec levelNumber', () => {
      it('sélectionne exactement les 10 questions du niveau sans doublon (skip et take)', async () => {
        (prismaMock.civicQuizQuestion.count as jest.Mock).mockResolvedValue(25);
        const mockQuestions = Array.from({ length: 10 }, (_, i) => ({
          id: `q_lvl2_${i + 1}`,
          prompt: `Question ${i + 1}`,
          choices: ['A', 'B', 'C', 'D'],
          category: 'HISTOIRE',
          difficulty: 'MEDIUM',
          imageUrl: null,
          imageAlt: null,
          levelNumber: 2,
        }));
        (prismaMock.civicQuizQuestion.findMany as jest.Mock)
          .mockResolvedValueOnce(mockQuestions.map((q) => ({ id: q.id })))
          .mockResolvedValueOnce(mockQuestions);
        (prismaMock.civicQuizSession.create as jest.Mock).mockResolvedValue({
          id: 'sess_lvl_2',
          userId: 'usr_1',
          totalQuestions: 10,
        });

        const result = await service.startSession('usr_1', 'HISTOIRE', undefined, 10, 2);

        expect(prismaMock.civicQuizQuestion.findMany).toHaveBeenNthCalledWith(1, {
          where: { status: 'PUBLISHED', category: 'HISTOIRE' },
          orderBy: { id: 'asc' },
          skip: 10, // (2 - 1) * 10
          take: 10,
          select: { id: true },
        });
        expect(result.session.id).toBe('sess_lvl_2');
        expect(result.questions).toHaveLength(10);
      });

      it('lance une NotFoundException si le niveau demandé dépasse les niveaux complets disponibles', async () => {
        (prismaMock.civicQuizQuestion.count as jest.Mock).mockResolvedValue(19); // 1 seul niveau complet

        await expect(
          service.startSession('usr_1', undefined, undefined, 10, 2),
        ).rejects.toThrow(NotFoundException);
      });

      it('mélange les choix et enregistre answers_map dans Redis pour supprimer le biais réponse A', async () => {
        (prismaMock.civicQuizQuestion.count as jest.Mock).mockResolvedValue(10);
        const mockQuestions = [
          {
            id: 'q_bias_1',
            prompt: 'Question 1',
            choices: ['Réponse A (Exacte)', 'Choix B', 'Choix C', 'Choix D'],
            answerIndex: 0,
            explanation: 'Explication 1',
            category: 'HISTOIRE',
            difficulty: 'EASY',
          },
        ];
        (prismaMock.civicQuizQuestion.findMany as jest.Mock)
          .mockResolvedValueOnce([{ id: 'q_bias_1' }])
          .mockResolvedValueOnce(mockQuestions);
        (prismaMock.civicQuizSession.create as jest.Mock).mockResolvedValue({
          id: 'sess_shuffle_1',
          userId: 'usr_1',
          totalQuestions: 1,
        });

        const result = await service.startSession('usr_1', undefined, undefined, 1, 1);

        expect(result.questions).toHaveLength(1);
        const qResult = result.questions[0];
        // La bonne réponse doit toujours correspondre à 'Réponse A (Exacte)'
        expect(qResult.choices[qResult.answerIndex]).toBe('Réponse A (Exacte)');
        // Redis a bien enregistré le mapping de la session
        expect(redisMock.set).toHaveBeenCalledWith(
          'civic_quiz:session:sess_shuffle_1:answers_map',
          expect.objectContaining({
            q_bias_1: expect.objectContaining({
              correctChoice: 'Réponse A (Exacte)',
            }),
          }),
          86400,
        );
      });
    });

    describe('Suppression du biais réponse A et validation session', () => {
      it('valide la réponse en utilisant le mapping mélangé issu de Redis', async () => {
        (prismaMock.civicQuizSession.findUnique as jest.Mock).mockResolvedValue({
          id: 'sess_test',
          isCompleted: false,
        });
        (prismaMock.civicQuizQuestion.findUnique as jest.Mock).mockResolvedValue({
          id: 'q_1',
          choices: ['Original A', 'Original B', 'Original C', 'Original D'],
          answerIndex: 0, // En base, c'était index 0
          explanation: 'Explication',
        });
        // Dans Redis pour cette session, après mélange, la bonne réponse est à l'index 2 (C)
        (redisMock.get as jest.Mock).mockResolvedValueOnce({
          q_1: {
            answerIndex: 2,
            correctChoice: 'Original A',
          },
        });
        (prismaMock.civicQuizAnswer.findFirst as jest.Mock).mockResolvedValue(null);
        (prismaMock.civicQuizAnswer.create as jest.Mock).mockResolvedValue({ id: 'ans_1' });
        (prismaMock.civicQuizQuestion.update as jest.Mock).mockResolvedValue({});

        // L'utilisateur choisit l'index 2 (la bonne réponse mélangée)
        const result = await service.answerSessionQuestion('sess_test', 'q_1', 2);

        expect(result.isCorrect).toBe(true);
        expect(result.correctIndex).toBe(2);
      });

      it('valide la réponse si la valeur textuelle exacte est fournie (userAnswerText)', async () => {
        (prismaMock.civicQuizSession.findUnique as jest.Mock).mockResolvedValue({
          id: 'sess_test',
          isCompleted: false,
        });
        (prismaMock.civicQuizQuestion.findUnique as jest.Mock).mockResolvedValue({
          id: 'q_1',
          choices: ['Original A', 'Original B', 'Original C', 'Original D'],
          answerIndex: 0,
          explanation: 'Explication',
        });
        (redisMock.get as jest.Mock).mockResolvedValueOnce({
          q_1: {
            answerIndex: 3,
            correctChoice: 'Original A',
          },
        });
        (prismaMock.civicQuizAnswer.findFirst as jest.Mock).mockResolvedValue(null);
        (prismaMock.civicQuizAnswer.create as jest.Mock).mockResolvedValue({ id: 'ans_2' });
        (prismaMock.civicQuizQuestion.update as jest.Mock).mockResolvedValue({});

        // L'utilisateur envoie le texte exact 'Original A'
        const result = await service.answerSessionQuestion(
          'sess_test',
          'q_1',
          null,
          'Original A',
        );

        expect(result.isCorrect).toBe(true);
        expect(result.correctIndex).toBe(3);
      });
    });
  });
});
