import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { LearningService } from './learning.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';

describe('LearningService', () => {
  let service: LearningService;
  let prismaMock: any;
  let redisMock: any;

  beforeEach(async () => {
    prismaMock = {
      learningTrack: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      learningLesson: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
      },
      userLessonProgress: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        upsert: jest.fn(),
      },
      userTrackProgress: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        upsert: jest.fn(),
      },
      userReviewItem: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        upsert: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      user: {
        update: jest.fn(),
      },
      $transaction: jest.fn((callback: any) => {
        if (typeof callback === 'function') {
          return callback(prismaMock);
        }
        return Promise.all(callback);
      }),
    };

    redisMock = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue('OK'),
      del: jest.fn().mockResolvedValue(1),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LearningService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: RedisService,
          useValue: redisMock,
        },
      ],
    }).compile();

    service = module.get<LearningService>(LearningService);
  });

  describe('getDashboard', () => {
    it('devrait retourner le tableau de bord avec les parcours par défaut en fallback seed', async () => {
      // Simulation d'une base de données vide ou indisponible -> fallback sur SEED_LEARNING_TRACKS
      prismaMock.learningTrack.findMany.mockRejectedValue(new Error('DB unreachable'));

      const dashboard = await service.getDashboard('test-user-id');

      expect(dashboard).toBeDefined();
      expect(dashboard.tracks).toBeDefined();
      expect(dashboard.tracks.length).toBeGreaterThan(0);
      expect(dashboard.tracks[0]).toHaveProperty('title');
      expect(dashboard.tracks[0]).toHaveProperty('slug');
      expect(dashboard.overview).toBeDefined();
      expect(dashboard.overview.totalLessonsCount).toBeGreaterThan(0);
    });
  });

  describe('getTracks', () => {
    it('devrait retourner la liste des parcours filtrés par niveau si spécifié', async () => {
      prismaMock.learningTrack.findMany.mockRejectedValue(new Error('DB unreachable'));

      const tracks = await service.getTracks('BEGINNER');

      expect(tracks).toBeDefined();
      expect(tracks.every((t) => t.level === 'BEGINNER')).toBe(true);
    });
  });

  describe('getTrackBySlug', () => {
    it('devrait retourner un parcours avec la première leçon disponible par défaut', async () => {
      prismaMock.learningTrack.findUnique.mockRejectedValue(new Error('DB unreachable'));

      const track = await service.getTrackBySlug('fondamentaux-langue-malgache');

      expect(track).toBeDefined();
      expect(track.slug).toBe('fondamentaux-langue-malgache');
      expect(track.lessons).toBeDefined();
      expect(track.lessons.length).toBeGreaterThan(0);
      // La première leçon doit être disponible
      expect(track.lessons[0].status).toBe('available');
    });
  });

  describe('getLessonBySlug (5 questions & audioEnabled)', () => {
    it('devrait retourner la leçon avec exactement 5 questions de micro-quiz et audioEnabled actif par défaut', async () => {
      prismaMock.learningLesson.findUnique.mockRejectedValue(new Error('DB unreachable'));

      const lesson = await service.getLessonBySlug('salutations-et-politesse-aza-fady');

      expect(lesson).toBeDefined();
      expect(lesson.audioEnabled).toBe(true);
      expect(lesson.microQuiz).toBeDefined();
      expect(lesson.microQuiz.length).toBe(5);
    });

    it('devrait contenir exactement 5 questions de micro-quiz pour chaque leçon du seed', async () => {
      prismaMock.learningLesson.findUnique.mockRejectedValue(new Error('DB unreachable'));

      const lessonNew = await service.getLessonBySlug('compter-et-faire-le-marche-tsena');
      expect(lessonNew).toBeDefined();
      expect(lessonNew.microQuiz?.length).toBe(5);

      const lessonKabary = await service.getLessonBySlug('l-art-du-kabary-discours-rituel');
      expect(lessonKabary).toBeDefined();
      expect(lessonKabary.microQuiz?.length).toBe(5);
    });
  });

  describe('completeLesson (seuil de validation ≥ 60%)', () => {
    it('devrait valider la leçon avec succès lorsque le score est supérieur ou égal à 60%', async () => {
      prismaMock.learningLesson.findFirst.mockRejectedValue(new Error('DB unreachable'));
      prismaMock.userLessonProgress.upsert.mockResolvedValue({ status: 'COMPLETED', score: 67 });

      const result = await service.completeLesson('salutations-et-politesse-aza-fady', 'user-1', {
        score: 67,
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.passed).toBe(true);
      expect(result.score).toBe(67);
      expect(result.earnedXp).toBeGreaterThan(0);
    });

    it('devrait refuser la validation lorsque le score est inférieur à 60%', async () => {
      prismaMock.learningLesson.findFirst.mockRejectedValue(new Error('DB unreachable'));
      prismaMock.userLessonProgress.findUnique.mockResolvedValue(null);
      prismaMock.userLessonProgress.upsert.mockResolvedValue({ status: 'IN_PROGRESS', score: 33 });

      const result = await service.completeLesson('salutations-et-politesse-aza-fady', 'user-1', {
        score: 33,
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.passed).toBe(false);
      expect(result.score).toBe(33);
      expect(result.earnedXp).toBe(0);
      expect(result.minRequiredScore).toBe(60);
    });
  });
});
