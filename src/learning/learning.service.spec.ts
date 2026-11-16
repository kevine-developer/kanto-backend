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
        update: jest.fn(),
      },
      learningTrackRating: {
        findUnique: jest.fn(),
        upsert: jest.fn(),
        aggregate: jest.fn(),
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
        count: jest.fn(),
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
      userProgress: {
        findUnique: jest.fn().mockResolvedValue({ totalXp: 50 }),
        upsert: jest.fn().mockResolvedValue({ totalXp: 75 }),
      },
      xpTransaction: {
        create: jest.fn().mockResolvedValue({ id: 'tx-1' }),
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
      prismaMock.learningTrack.findMany.mockRejectedValue(
        new Error('DB unreachable'),
      );

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
      prismaMock.learningTrack.findMany.mockRejectedValue(
        new Error('DB unreachable'),
      );

      const tracks = await service.getTracks('BEGINNER');

      expect(tracks).toBeDefined();
      expect(tracks.every((t) => t.level === 'BEGINNER')).toBe(true);
    });
  });

  describe('getTrackBySlug', () => {
    it('devrait retourner un parcours avec la première leçon disponible par défaut', async () => {
      prismaMock.learningTrack.findUnique.mockRejectedValue(
        new Error('DB unreachable'),
      );

      const track = await service.getTrackBySlug(
        'fondamentaux-langue-malgache',
      );

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
      prismaMock.learningLesson.findUnique.mockRejectedValue(
        new Error('DB unreachable'),
      );

      const lesson = await service.getLessonBySlug(
        'salutations-et-politesse-aza-fady',
      );

      expect(lesson).toBeDefined();
      expect(lesson.audioEnabled).toBe(true);
      expect(lesson.microQuiz).toBeDefined();
      expect(lesson.microQuiz.length).toBe(5);
    });

    it('devrait contenir exactement 5 questions de micro-quiz pour chaque leçon du seed', async () => {
      prismaMock.learningLesson.findUnique.mockRejectedValue(
        new Error('DB unreachable'),
      );

      const lessonNew = await service.getLessonBySlug(
        'compter-et-faire-le-marche-tsena',
      );
      expect(lessonNew).toBeDefined();
      expect(lessonNew.microQuiz?.length).toBe(5);

      const lessonKabary = await service.getLessonBySlug(
        'l-art-du-kabary-discours-rituel',
      );
      expect(lessonKabary).toBeDefined();
      expect(lessonKabary.microQuiz?.length).toBe(5);
    });
  });

  describe('completeLesson (seuil de validation ≥ 60%)', () => {
    it('devrait valider la leçon avec succès lorsque le score est supérieur ou égal à 60%', async () => {
      prismaMock.learningLesson.findFirst.mockRejectedValue(
        new Error('DB unreachable'),
      );
      prismaMock.userLessonProgress.upsert.mockResolvedValue({
        status: 'COMPLETED',
        score: 67,
      });

      const result = await service.completeLesson(
        'salutations-et-politesse-aza-fady',
        'user-1',
        {
          score: 67,
        },
      );

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.passed).toBe(true);
      expect(result.score).toBe(67);
      expect(result.earnedXp).toBeGreaterThan(0);
      expect(result.totalUserXp).toBeGreaterThan(0);
      expect(result.isNextUnlocked).toBe(true);
    });

    it('devrait refuser la validation lorsque le score est inférieur à 60%', async () => {
      prismaMock.learningLesson.findFirst.mockRejectedValue(
        new Error('DB unreachable'),
      );
      prismaMock.userLessonProgress.findUnique.mockResolvedValue(null);
      prismaMock.userLessonProgress.upsert.mockResolvedValue({
        status: 'IN_PROGRESS',
        score: 33,
      });

      const result = await service.completeLesson(
        'salutations-et-politesse-aza-fady',
        'user-1',
        {
          score: 33,
        },
      );

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.passed).toBe(false);
      expect(result.score).toBe(33);
      expect(result.earnedXp).toBe(0);
      expect(result.minRequiredScore).toBe(60);
      expect(result.isNextUnlocked).toBe(false);
    });

    it('devrait valider la leçon pour un invité non connecté sans lever d’erreur', async () => {
      prismaMock.learningLesson.findFirst.mockRejectedValue(
        new Error('DB unreachable'),
      );

      const result = await service.completeLesson(
        'salutations-et-politesse-aza-fady',
        undefined,
        {
          score: 80,
        },
      );

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.passed).toBe(true);
      expect(result.score).toBe(80);
      expect(result.isNextUnlocked).toBe(true);
      expect(result.nextLessonSlug).toBe('gratitude-et-remerciements-misaotra');
    });
  });

  describe('getReviews (Mes révisions)', () => {
    it('devrait retourner les fiches de révisions avec statut et leçons associées', async () => {
      prismaMock.userReviewItem.findMany.mockRejectedValue(
        new Error('DB unreachable'),
      );

      const reviews = await service.getReviews('user-1');

      expect(reviews).toBeDefined();
      expect(Array.isArray(reviews)).toBe(true);
      expect(reviews.length).toBeGreaterThan(0);
      expect(reviews[0]).toHaveProperty('termMg');
      expect(reviews[0]).toHaveProperty('meaningFr');
      expect(reviews[0]).toHaveProperty('status');
      expect(reviews[0]).toHaveProperty('lessonTitle');
    });

    it('devrait filtrer les révisions dues lorsque le filtre "due" est demandé', async () => {
      prismaMock.userReviewItem.findMany.mockRejectedValue(
        new Error('DB unreachable'),
      );

      const dueReviews = await service.getReviews('user-1', 'due');

      expect(dueReviews).toBeDefined();
      expect(dueReviews.every((r) => r.isDue === true)).toBe(true);
    });
  });

  describe('rateTrack & getTrackRating (Système de notation par étoiles)', () => {
    const mockTrack = {
      id: 'track-1',
      slug: 'fondamentaux-langue-malgache',
      title: 'Fondamentaux de la langue',
      averageRating: 4.5,
      ratingsCount: 10,
      _count: { lessons: 5 },
    };

    it('devrait refuser la notation si l’utilisateur n’a pas terminé le cours', async () => {
      prismaMock.learningTrack.findUnique.mockResolvedValue(mockTrack);
      prismaMock.userTrackProgress.findUnique.mockResolvedValue({
        isCompleted: false,
      });
      prismaMock.userLessonProgress.count.mockResolvedValue(2);

      await expect(
        service.rateTrack('fondamentaux-langue-malgache', 'user-1', {
          rating: 5,
        }),
      ).rejects.toThrow('Vous devez avoir terminé l’ensemble des leçons');
    });

    it('devrait enregistrer la note et recalculer la moyenne si l’utilisateur est éligible', async () => {
      prismaMock.learningTrack.findUnique.mockResolvedValue(mockTrack);
      prismaMock.userTrackProgress.findUnique.mockResolvedValue({
        isCompleted: true,
      });

      // Simulation de la transaction
      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        const txMock = {
          learningTrackRating: {
            upsert: jest.fn().mockResolvedValue({ rating: 5 }),
            aggregate: jest.fn().mockResolvedValue({
              _avg: { rating: 4.8 },
              _count: { id: 11 },
            }),
          },
          learningTrack: {
            update: jest.fn().mockResolvedValue({
              averageRating: 4.8,
              ratingsCount: 11,
            }),
          },
        };
        return callback(txMock);
      });

      const result = await service.rateTrack(
        'fondamentaux-langue-malgache',
        'user-1',
        { rating: 5 },
      );

      expect(result.success).toBe(true);
      expect(result.userRating).toBe(5);
      expect(result.averageRating).toBe(4.8);
      expect(result.ratingsCount).toBe(11);
    });

    it('devrait récupérer la note moyenne, le total et la note personnelle de l’utilisateur', async () => {
      prismaMock.learningTrack.findUnique.mockResolvedValue(mockTrack);
      prismaMock.userTrackProgress.findUnique.mockResolvedValue({
        isCompleted: true,
      });
      prismaMock.learningTrackRating.findUnique.mockResolvedValue({
        rating: 4,
        comment: 'Très enrichissant',
      });

      const ratingInfo = await service.getTrackRating(
        'fondamentaux-langue-malgache',
        'user-1',
      );

      expect(ratingInfo.averageRating).toBe(4.5);
      expect(ratingInfo.ratingsCount).toBe(10);
      expect(ratingInfo.userRating).toBe(4);
      expect(ratingInfo.userComment).toBe('Très enrichissant');
      expect(ratingInfo.isEligible).toBe(true);
    });
  });

  describe('Gestion des images (Couvertures de cours & Images de leçons)', () => {
    const mockTrack = {
      id: 'track-1',
      slug: 'fondamentaux-langue-malgache',
      title: 'Fondamentaux de la langue',
      averageRating: 4.5,
      ratingsCount: 10,
      _count: { lessons: 5 },
      lessons: [],
    };

    const mockLesson = {
      id: 'lesson-1',
      slug: 'salutations-et-politesse-aza-fady',
      title: 'Aza fady : Politesse',
      trackId: 'track-1',
      durationMinutes: 5,
      isPublished: true,
      sections: [],
      track: {
        id: 'track-1',
        slug: 'fondamentaux-langue-malgache',
        title: 'Fondamentaux',
        lessons: [],
      },
    };

    it('devrait retourner coverImage dans getTracks et getTrackBySlug', async () => {
      const trackWithCover = {
        ...mockTrack,
        coverImage: 'https://res.cloudinary.com/kanto/cover-track.jpg',
      };
      prismaMock.learningTrack.findMany.mockResolvedValue([trackWithCover]);
      prismaMock.learningTrack.findUnique.mockResolvedValue(trackWithCover);

      const tracks = await service.getTracks();
      expect(tracks[0].coverImage).toBe(
        'https://res.cloudinary.com/kanto/cover-track.jpg',
      );

      const trackDetail = await service.getTrackBySlug(
        'fondamentaux-langue-malgache',
      );
      expect(trackDetail.coverImage).toBe(
        'https://res.cloudinary.com/kanto/cover-track.jpg',
      );
    });

    it('devrait retourner la liste des images associées ordonnées dans getLessonBySlug', async () => {
      const mockImages = [
        {
          id: 'img-1',
          url: 'https://res.cloudinary.com/kanto/palais-reine.jpg',
          altText: 'Le Rova de Manjakamiadana',
          captionFr: 'Palais de la Reine à Antananarivo',
          captionMg: 'Rovan’i Manjakamiadana',
          credit: 'Archives Nationales de Madagascar',
          description: 'Symbole historique majeur de l’Imerina.',
          orderIndex: 0,
        },
      ];

      const lessonWithImages = {
        ...mockLesson,
        images: mockImages,
      };

      prismaMock.learningLesson.findUnique.mockResolvedValue(lessonWithImages);

      const result = await service.getLessonBySlug(
        'salutations-et-politesse-aza-fady',
      );

      expect(result.images).toBeDefined();
      expect(result.images.length).toBe(1);
      expect(result.images[0].url).toBe(
        'https://res.cloudinary.com/kanto/palais-reine.jpg',
      );
      expect(result.images[0].credit).toBe(
        'Archives Nationales de Madagascar',
      );
      expect(result.images[0].altText).toBe('Le Rova de Manjakamiadana');
    });

    it('devrait normaliser correctement une section de type image dans une leçon', async () => {
      const lessonWithImageSection = {
        ...mockLesson,
        sections: [
          {
            type: 'image',
            imageUrl: '/uploads/learning/lessons/tsinjaka.webp',
            altText: 'Danse traditionnelle malgache',
            captionFr: 'Démonstration lors d’un festival culturel',
            credit: 'Fianakaviana Kanto',
          },
        ],
        images: [],
      };

      prismaMock.learningLesson.findUnique.mockResolvedValue(
        lessonWithImageSection,
      );

      const result = await service.getLessonBySlug(
        'salutations-et-politesse-aza-fady',
      );

      const imageSection = result.sections.find(
        (s: any) => s.type === 'image',
      );
      expect(imageSection).toBeDefined();
      expect(imageSection.imageUrl).toBe(
        '/uploads/learning/lessons/tsinjaka.webp',
      );
      expect(imageSection.captionFr).toBe(
        'Démonstration lors d’un festival culturel',
      );
      expect(imageSection.credit).toBe('Fianakaviana Kanto');
    });
  });
});
