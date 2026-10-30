import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { DailyChallengeService } from './daily-challenge.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';
import { DailyChallengeType } from './dto/daily-challenge.dto.js';
import {
  createPrismaMock,
  type PrismaMock,
} from '../../test-utils/mock-prisma.factory.js';

describe('DailyChallengeService', () => {
  let service: DailyChallengeService;
  let prismaMock: PrismaMock;
  let redisMock: Partial<RedisService>;
  const redisStore: Record<string, any> = {};

  beforeEach(async () => {
    prismaMock = createPrismaMock();
    for (const key of Object.keys(redisStore)) {
      delete redisStore[key];
    }

    redisMock = {
      get: jest.fn().mockImplementation((key: string) => {
        return Promise.resolve(redisStore[key] || null);
      }),
      set: jest.fn().mockImplementation((key: string, value: any) => {
        redisStore[key] = value;
        return Promise.resolve('OK');
      }),
      del: jest.fn().mockImplementation((key: string) => {
        delete redisStore[key];
        return Promise.resolve(1);
      }),
      delByPattern: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyChallengeService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: RedisService, useValue: redisMock },
      ],
    }).compile();

    service = module.get<DailyChallengeService>(DailyChallengeService);
  });

  describe('Rotation dynamique multi-modes', () => {
    beforeEach(() => {
      // Configurer des questions disponibles pour tous les 3 modes
      (prismaMock.civicQuizQuestion.count as jest.Mock).mockResolvedValue(30);
      (prismaMock.trueFalseQuestion.count as jest.Mock).mockResolvedValue(40);
      (prismaMock.riddleQuestion.count as jest.Mock).mockResolvedValue(50);
    });

    it('devrait alterner entre les modes de jeux sur 3 jours consécutifs sans répétition', async () => {
      // Configuration des retours findFirst pour chaque mode
      (prismaMock.civicQuizQuestion.findFirst as jest.Mock).mockResolvedValue({
        id: 'q_quiz_1',
        prompt: 'Question de Quiz',
        choices: ['Antananarivo', 'Toamasina', 'Majunga', 'Fianarantsoa'],
        answerIndex: 0,
        explanation: 'Capitale',
      });

      (prismaMock.trueFalseQuestion.findFirst as jest.Mock).mockResolvedValue({
        id: 'q_tf_1',
        questionMg: 'Misy lapa ve ao Antananarivo ?',
        questionFr: 'Y a-t-il un palais à Antananarivo ?',
        isTrue: true,
        explanationMg: 'Eny, ny Rovan\'i Manjakamiadana.',
      });

      (prismaMock.riddleQuestion.findFirst as jest.Mock).mockResolvedValue({
        id: 'q_riddle_1',
        riddleMg: 'Ilay kely miankanjo vy.',
        riddleFr: 'Le tout petit qui porte une armure de fer.',
        options: ['Fanjaitra', 'Voanjo', 'Sokatra', 'Vilany'],
        correctAnswer: 'Fanjaitra',
        explanation: 'Ny fanjaitra dia vy fanjairana.',
        clue: 'Fanjairana...',
      });

      const day1 = await service.getDailyChallenge('2026-10-01');
      const day2 = await service.getDailyChallenge('2026-10-02');
      const day3 = await service.getDailyChallenge('2026-10-03');

      // 3 jours consécutifs = 3 modes distincts
      expect(day1.type).not.toBe(day2.type);
      expect(day2.type).not.toBe(day3.type);

      const allThreeModes = new Set([day1.type, day2.type, day3.type]);
      expect(allThreeModes.has(DailyChallengeType.QUIZ)).toBe(true);
      expect(allThreeModes.has(DailyChallengeType.TRUE_FALSE)).toBe(true);
      expect(allThreeModes.has(DailyChallengeType.RIDDLE)).toBe(true);
    });

    it('devrait basculer automatiquement vers un autre mode si le mode du jour a 0 question', async () => {
      // Quiz = 0, TF = 20, Riddle = 20
      (prismaMock.civicQuizQuestion.count as jest.Mock).mockResolvedValue(0);
      (prismaMock.trueFalseQuestion.count as jest.Mock).mockResolvedValue(20);
      (prismaMock.riddleQuestion.count as jest.Mock).mockResolvedValue(20);

      (prismaMock.trueFalseQuestion.findFirst as jest.Mock).mockResolvedValue({
        id: 'q_tf_fallback',
        questionMg: 'Marina ve ?',
        isTrue: true,
      });

      // Trouver un jour où le mode calculé serait QUIZ
      let quizDay = '2026-01-01';
      for (let d = 1; d <= 3; d++) {
        const testDate = `2026-01-0${d}`;
        const dayOfYear = Math.floor((new Date(testDate).getTime() - new Date('2026-01-01').getTime()) / 86400000) + 1;
        if (dayOfYear % 3 === 0) {
          quizDay = testDate;
          break;
        }
      }

      const challenge = await service.getDailyChallenge(quizDay);
      // Ne doit jamais renvoyer QUIZ car count = 0
      expect(challenge.type).not.toBe(DailyChallengeType.QUIZ);
    });
  });

  describe('Validation des réponses et attribution XP', () => {
    it('devrait valider une réponse True/False et attribuer 15 XP une seule fois par jour', async () => {
      (prismaMock.civicQuizQuestion.count as jest.Mock).mockResolvedValue(10);
      (prismaMock.trueFalseQuestion.count as jest.Mock).mockResolvedValue(10);
      (prismaMock.riddleQuestion.count as jest.Mock).mockResolvedValue(10);

      (prismaMock.trueFalseQuestion.findFirst as jest.Mock).mockResolvedValue({
        id: 'q_tf_123',
        questionMg: 'Affirmation malgache',
        isTrue: true,
        explanationMg: 'Explication',
      });

      // Préparer le secret dans le service
      redisStore['daily_challenge:secret:2026-10-30:q_tf_123'] = {
        type: DailyChallengeType.TRUE_FALSE,
        id: 'q_tf_123',
        correctAnswerText: 'Marina',
        explanationMg: 'Explication MG',
        explanationFr: 'Explication FR',
      };

      (prismaMock.userProgress.upsert as jest.Mock).mockResolvedValue({});
      (prismaMock.xpTransaction.create as jest.Mock).mockResolvedValue({});

      // 1ère tentative correcte
      const result1 = await service.submitAnswer('usr_test', {
        questionId: 'q_tf_123',
        userAnswer: 'Marina',
        date: '2026-10-30',
      });

      expect(result1.isCorrect).toBe(true);
      expect(result1.xpAwarded).toBe(15);
      expect(prismaMock.userProgress.upsert).toHaveBeenCalledTimes(1);

      // 2ème tentative le même jour : pas de ré-attribution
      const result2 = await service.submitAnswer('usr_test', {
        questionId: 'q_tf_123',
        userAnswer: 'Marina',
        date: '2026-10-30',
      });

      expect(result2.isCorrect).toBe(true);
      expect(result2.xpAwarded).toBe(0); // 0 XP car déjà récompensé
      expect(prismaMock.userProgress.upsert).toHaveBeenCalledTimes(1); // Pas d'appel supplémentaire
    });
  });
});

