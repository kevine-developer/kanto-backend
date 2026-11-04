import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserQuizService } from './user-quiz.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { CloudinaryService } from '../integrations/cloudinary/cloudinary.service.js';
import {
  createPrismaMock,
  type PrismaMock,
} from '../test-utils/mock-prisma.factory.js';
import { DeckVisibility, UgcGameType } from './dto/user-quiz.dto.js';

describe('UserQuizService', () => {
  let service: UserQuizService;
  let prismaMock: PrismaMock;
  let redisMock: Record<string, jest.Mock>;
  let notificationsMock: Record<string, jest.Mock>;

  const mockUser1 = 'user-owner-123';
  const mockUser2 = 'user-player-456';

  const validQuestions = [
    {
      id: 'q1',
      quizSetId: 'deck-1',
      gameType: UgcGameType.QUIZ,
      questionMg: 'Inona ny renivohitr’i Madagasikara?',
      choices: ['Antananarivo', 'Toamasina', 'Majunga', 'Fianarantsoa'],
      answerIndex: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q2',
      quizSetId: 'deck-1',
      gameType: UgcGameType.QUIZ,
      questionMg: 'Firy ny foko eto Madagasikara?',
      choices: ['16', '18', '20', '22'],
      answerIndex: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q3',
      quizSetId: 'deck-1',
      gameType: UgcGameType.TRUE_FALSE,
      questionMg: 'Nosy faha-4 lehibe indrindra eran-tany i Madagasikara.',
      isTrue: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q4',
      quizSetId: 'deck-1',
      gameType: UgcGameType.QUIZ,
      questionMg: 'Iza no mpanjaka nanorina an’Antananarivo?',
      choices: ['Andrianampoinimerina', 'Andrianjaka', 'Radama I'],
      answerIndex: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q5',
      quizSetId: 'deck-1',
      gameType: UgcGameType.QUIZ,
      questionMg: 'Inona no dikan’ny hoe Fihavanana?',
      choices: ['Firaisankina sy fifankatiavana', 'Harena', 'Ady'],
      answerIndex: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    prismaMock = createPrismaMock();

    const memoryCache = new Map<string, any>();
    const redisSets = new Map<string, Set<string>>();

    redisMock = {
      get: jest.fn((key: string) => Promise.resolve(memoryCache.get(key) ?? null)),
      set: jest.fn((key: string, val: any) => {
        memoryCache.set(key, val);
        return Promise.resolve(true);
      }),
      del: jest.fn((key: string) => {
        memoryCache.delete(key);
        return Promise.resolve(1);
      }),
      sAdd: jest.fn((key: string, val: string) => {
        if (!redisSets.has(key)) redisSets.set(key, new Set());
        redisSets.get(key)!.add(val);
        return Promise.resolve(1);
      }),
      sIsMember: jest.fn((key: string, val: string) => {
        const s = redisSets.get(key);
        return Promise.resolve(Boolean(s && s.has(val)));
      }),
      sCard: jest.fn((key: string) => {
        const s = redisSets.get(key);
        return Promise.resolve(s ? s.size : 0);
      }),
      sMembers: jest.fn((key: string) => {
        const s = redisSets.get(key);
        return Promise.resolve(s ? Array.from(s) : []);
      }),
      incr: jest.fn(() => Promise.resolve(1)),
      incrByFloat: jest.fn(() => Promise.resolve(1)),
    };

    notificationsMock = {
      createNotification: jest.fn(() => Promise.resolve({ id: 'notif-1' })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserQuizService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: RedisService, useValue: redisMock },
        { provide: NotificationsService, useValue: notificationsMock },
      ],
    }).compile();

    service = module.get<UserQuizService>(UserQuizService);
  });

  describe('Règle de publication : minimum 5 questions valides', () => {
    it('devrait basculer un deck en DRAFT (non public) s’il est créé avec moins de 5 questions', async () => {
      (prismaMock.userQuizSet.create as jest.Mock).mockResolvedValue({
        id: 'deck-draft',
        title: 'Mon Quiz Test',
        visibility: DeckVisibility.LINK_ONLY,
        isPublic: false,
        authorId: mockUser1,
        questions: [validQuestions[0]],
      });

      const result = await service.createQuizSet(mockUser1, {
        title: 'Mon Quiz Test',
        isPublic: true, // Demande publique mais seulement 1 question !
        questions: [
          {
            gameType: UgcGameType.QUIZ,
            questionMg: validQuestions[0].questionMg,
            choices: validQuestions[0].choices,
            answerIndex: 0,
          },
        ],
      });

      expect(prismaMock.userQuizSet.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            isPublic: false,
            visibility: DeckVisibility.LINK_ONLY,
          }),
        }),
      );
      expect(result.isPublishable).toBe(false);
      expect(result.missingQuestionsCount).toBe(4);
    });

    it('devrait refuser la publication d’un deck comportant moins de 5 questions valides lors d’un update', async () => {
      (prismaMock.userQuizSet.findUnique as jest.Mock).mockResolvedValue({
        id: 'deck-1',
        authorId: mockUser1,
        isPublic: false,
        questions: validQuestions.slice(0, 3), // 3 questions seulement
      });

      await expect(
        service.updateQuizSet(mockUser1, 'deck-1', {
          isPublic: true,
          visibility: DeckVisibility.PUBLIC,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('devrait accepter la publication lorsque le deck compte au moins 5 questions valides', async () => {
      (prismaMock.userQuizSet.findUnique as jest.Mock).mockResolvedValue({
        id: 'deck-1',
        authorId: mockUser1,
        isPublic: false,
        questions: validQuestions, // 5 questions valides
      });

      (prismaMock.userQuizSet.update as jest.Mock).mockResolvedValue({
        id: 'deck-1',
        authorId: mockUser1,
        isPublic: true,
        visibility: DeckVisibility.PUBLIC,
        questions: validQuestions,
      });

      const result = await service.updateQuizSet(mockUser1, 'deck-1', {
        isPublic: true,
        visibility: DeckVisibility.PUBLIC,
      });

      expect(result.isPublic).toBe(true);
      expect(prismaMock.userQuizSet.update).toHaveBeenCalled();
    });
  });

  describe('Protection Anti-Triche et Rôle Utilisateur (getQuizSetById)', () => {
    it('devrait masquer answerIndex, isTrue et explications pour un simple joueur (Anti-Triche)', async () => {
      (prismaMock.userQuizSet.findUnique as jest.Mock).mockResolvedValue({
        id: 'deck-1',
        title: 'Histoire de Madagascar',
        authorId: mockUser1, // L'auteur est User 1
        isPublic: true,
        playsCount: 12,
        questions: validQuestions,
        author: { id: mockUser1, name: 'Auteur Pro' },
      });

      // Appel par User 2 (simple joueur)
      const res = await service.getQuizSetById('deck-1', mockUser2);

      expect(res.isOwner).toBe(false);
      // Les réponses ne doivent pas être divulguées !
      res.questions.forEach((q: any) => {
        expect(q.answerIndex).toBeUndefined();
        expect(q.isTrue).toBeUndefined();
        expect(q.explanationMg).toBeUndefined();
        expect(q.explanationFr).toBeUndefined();
      });
    });

    it('devrait fournir les réponses et métriques complètes au propriétaire du deck', async () => {
      (prismaMock.userQuizSet.findUnique as jest.Mock).mockResolvedValue({
        id: 'deck-1',
        title: 'Histoire de Madagascar',
        authorId: mockUser1,
        isPublic: true,
        playsCount: 20,
        questions: validQuestions,
        author: { id: mockUser1, name: 'Auteur Pro' },
      });

      // Appel par User 1 (propriétaire)
      const res = await service.getQuizSetById('deck-1', mockUser1);

      expect(res.isOwner).toBe(true);
      expect(res.questions[0].answerIndex).toBe(0);
      expect(res.isPublishable).toBe(true);
      expect(res.validQuestionsCount).toBe(5);
    });
  });

  describe('Sécurité des permissions de modification et suppression', () => {
    it('devrait interdire à un utilisateur de modifier le deck d’un autre créateur', async () => {
      (prismaMock.userQuizSet.findUnique as jest.Mock).mockResolvedValue({
        id: 'deck-1',
        authorId: mockUser1, // Appartient à User 1
        questions: validQuestions,
      });

      await expect(
        service.updateQuizSet(mockUser2, 'deck-1', { title: 'Piratage de titre' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('devrait interdire à un utilisateur de supprimer le deck d’un autre créateur', async () => {
      (prismaMock.userQuizSet.findUnique as jest.Mock).mockResolvedValue({
        id: 'deck-1',
        authorId: mockUser1,
      });

      await expect(
        service.deleteQuizSet(mockUser2, 'deck-1'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('Gestion des questions individuelles', () => {
    it('devrait permettre de modifier une question existante par son propriétaire', async () => {
      (prismaMock.userQuestion.findUnique as jest.Mock).mockResolvedValue({
        id: 'q1',
        quizSetId: 'deck-1',
        quizSet: { id: 'deck-1', authorId: mockUser1 },
      });

      (prismaMock.userQuestion.update as jest.Mock).mockResolvedValue({
        id: 'q1',
        quizSetId: 'deck-1',
        gameType: UgcGameType.QUIZ,
        questionMg: 'Nouvel énoncé amélioré',
        choices: ['A', 'B'],
        answerIndex: 0,
      });

      const res = await service.updateQuestion(mockUser1, 'q1', {
        questionMg: 'Nouvel énoncé amélioré',
      });

      expect(res.questionMg).toBe('Nouvel énoncé amélioré');
      expect(prismaMock.userQuestion.update).toHaveBeenCalled();
    });

    it('devrait dépublier automatiquement un deck public si la suppression d’une question le fait passer sous 5 questions', async () => {
      (prismaMock.userQuestion.findUnique as jest.Mock).mockResolvedValue({
        id: 'q5',
        quizSetId: 'deck-1',
        quizSet: {
          id: 'deck-1',
          authorId: mockUser1,
          isPublic: true,
          questions: validQuestions, // 5 questions avant suppression
        },
      });

      (prismaMock.userQuestion.delete as jest.Mock).mockResolvedValue({});
      (prismaMock.userQuizSet.update as jest.Mock).mockResolvedValue({});

      const res = await service.deleteQuestion(mockUser1, 'q5');

      expect(res.autoUnpublished).toBe(true);
      expect(res.validCount).toBe(4);
      expect(prismaMock.userQuizSet.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            isPublic: false,
            visibility: DeckVisibility.LINK_ONLY,
          }),
        }),
      );
    });
  });

  describe('Enregistrement des parties et intégrité économique', () => {
    it('devrait refuser qu’un créateur joue à son propre deck', async () => {
      (prismaMock.userQuizSet.findUnique as jest.Mock).mockResolvedValue({
        id: 'deck-1',
        title: 'Mon Super Deck',
        authorId: mockUser1,
      });

      await expect(
        service.recordPlay('deck-1', mockUser1),
      ).rejects.toThrow(ForbiddenException);
    });

    it('devrait enregistrer un joueur unique dans Redis et comptabiliser la partie', async () => {
      (prismaMock.userQuizSet.findUnique as jest.Mock).mockResolvedValue({
        id: 'deck-1',
        title: 'Mon Super Deck',
        authorId: mockUser1,
      });

      (prismaMock.userQuizSet.update as jest.Mock).mockResolvedValue({
        id: 'deck-1',
        playsCount: 1,
      });

      (prismaMock.$transaction as jest.Mock).mockImplementation(async (cb: any) => {
        return cb(prismaMock);
      });

      const res = await service.recordPlay('deck-1', mockUser2, { completed: true });

      expect(res.playsCount).toBe(1);
      expect(redisMock.sAdd).toHaveBeenCalledWith('ugc:deck_unique_players:deck-1', mockUser2);
      expect(redisMock.incr).toHaveBeenCalledWith('ugc:deck_completed_count:deck-1');
    });
  });
});

