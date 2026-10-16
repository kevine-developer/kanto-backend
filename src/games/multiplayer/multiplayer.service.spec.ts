import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MultiplayerService } from './multiplayer.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';
import { NotificationsService } from '../../notifications/notifications.service.js';
import { UserQuizService } from '../../user-quiz/user-quiz.service.js';
import {
  createPrismaMock,
  type PrismaMock,
} from '../../test-utils/mock-prisma.factory.js';
import { MultiplayerGameTypeEnum } from './dto/multiplayer.dto.js';

describe('MultiplayerService', () => {
  let service: MultiplayerService;
  let prismaMock: PrismaMock;
  let redisMock: Record<string, jest.Mock>;
  let notificationsMock: Record<string, jest.Mock>;
  let userQuizMock: Record<string, jest.Mock>;

  beforeEach(async () => {
    prismaMock = createPrismaMock();

    const memoryCache = new Map<string, any>();
    redisMock = {
      get: jest.fn(async (key: string) => memoryCache.get(key) ?? null),
      set: jest.fn(async (key: string, val: any) => {
        memoryCache.set(key, val);
        return true;
      }),
      del: jest.fn(async (key: string) => {
        memoryCache.delete(key);
        return 1;
      }),
    };

    notificationsMock = {
      createNotification: jest.fn(async () => ({ id: 'notif_1' })),
    };

    userQuizMock = {
      recordPlay: jest.fn(async () => ({ success: true })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MultiplayerService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: RedisService, useValue: redisMock },
        { provide: NotificationsService, useValue: notificationsMock },
        { provide: UserQuizService, useValue: userQuizMock },
      ],
    }).compile();

    service = module.get<MultiplayerService>(MultiplayerService);
  });

  describe('createGame - Règles de jauge et sécurité', () => {
    it('devrait refuser la création si l’utilisateur est un invité anonyme', async () => {
      await expect(
        service.createGame('guest_123456', {}),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('devrait créer une session avec maxPlayers: 5 et enregistrer l’hôte spectateur si demandé', async () => {
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user_host',
        name: 'Andry Animateur',
        image: null,
      });

      (prismaMock.trueFalseQuestion.findMany as jest.Mock).mockResolvedValue([
        { id: 'q1' },
        { id: 'q2' },
        { id: 'q3' },
        { id: 'q4' },
        { id: 'q5' },
      ]);

      (prismaMock.duelSession.findUnique as jest.Mock).mockResolvedValue(null);

      (prismaMock.duelSession.create as jest.Mock).mockImplementation((args: any) =>
        Promise.resolve({
          id: 'sess_1',
          code: args.data.code,
          gameType: args.data.gameType,
          status: 'WAITING',
          maxPlayers: args.data.maxPlayers,
          player1Id: 'user_host',
          players: [
            {
              id: 'player_host',
              userId: 'user_host',
              name: 'Andry Animateur',
              isHost: true,
            },
          ],
        }),
      );

      const result = await service.createGame('user_host', {
        gameType: MultiplayerGameTypeEnum.TRUE_FALSE,
        isHostSpectator: true,
      });

      expect(result.session.maxPlayers).toBe(5);
      expect(result.isHostSpectator).toBe(true);
      expect(redisMock.set).toHaveBeenCalledWith(
        expect.stringContaining('duel:spectator:'),
        '1',
        7200,
      );
    });

    it('devrait interdire d’utiliser un deck privé appartenant à un autre utilisateur', async () => {
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user_voleur',
        name: 'Curieux',
      });

      (prismaMock.userQuizSet.findUnique as jest.Mock).mockResolvedValue({
        id: 'deck_private_1',
        title: 'Quiz Secret de Famille',
        authorId: 'user_autre',
        visibility: 'PRIVATE',
        isPublic: false,
        _count: { questions: 10 },
      });

      await expect(
        service.createGame('user_voleur', {
          customQuizSetId: 'deck_private_1',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('joinGame - Limite absolue de 5 joueurs et exclusion de l’hôte spectateur', () => {
    it('devrait refuser une adhésion quand le salon compte déjà 5 vrais joueurs actifs', async () => {
      const existingSession = {
        id: 'sess_full',
        code: 'ROOM5P',
        status: 'WAITING',
        player1Id: 'user_1',
        players: [
          { userId: 'user_1', isHost: true },
          { userId: 'user_2', isHost: false },
          { userId: 'user_3', isHost: false },
          { userId: 'user_4', isHost: false },
          { userId: 'user_5', isHost: false },
        ],
      };

      (prismaMock.duelSession.findUnique as jest.Mock).mockResolvedValue(existingSession);
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user_6',
        name: 'Sixième Joueur',
      });

      await expect(
        service.joinGame('user_6', { code: 'ROOM5P' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('devrait autoriser 5 joueurs si l’hôte est en mode spectateur (l’hôte ne compte pas parmi les 5)', async () => {
      // Configurer l'hôte comme spectateur dans Redis
      await service.setHostSpectator('SPECT5', true);

      const sessionWithSpectatorHost = {
        id: 'sess_spec',
        code: 'SPECT5',
        status: 'WAITING',
        player1Id: 'host_animateur',
        players: [
          { userId: 'host_animateur', isHost: true },
          { userId: 'joueur_1', isHost: false },
          { userId: 'joueur_2', isHost: false },
          { userId: 'joueur_3', isHost: false },
          { userId: 'joueur_4', isHost: false },
        ],
        questionIds: ['q1', 'q2', 'q3', 'q4', 'q5'],
        gameType: 'TRUE_FALSE',
      };

      (prismaMock.duelSession.findUnique as jest.Mock).mockResolvedValue(sessionWithSpectatorHost);
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'joueur_5',
        name: 'Cinquième Vrai Joueur',
      });
      (prismaMock.duelPlayer.create as jest.Mock).mockResolvedValue({
        id: 'p5',
        userId: 'joueur_5',
        sessionId: 'sess_spec',
      });
      (prismaMock.duelPlayer.findMany as jest.Mock).mockResolvedValue([
        ...sessionWithSpectatorHost.players,
        { userId: 'joueur_5', isHost: false },
      ]);
      (prismaMock.trueFalseQuestion.findMany as jest.Mock).mockResolvedValue([
        { id: 'q1', prompt: 'P1', choices: [], answerIndex: 0 },
      ]);

      const res = await service.joinGame('joueur_5', { code: 'SPECT5' });

      // Le 5ème vrai joueur a pu rejoindre car l'animateur ne comptait pas parmi les compétiteurs
      expect(res.players.length).toBe(6); // 1 animateur + 5 compétiteurs
    });
  });

  describe('submitAnswer - Idempotence et interdiction animateur/créateur', () => {
    it('devrait refuser qu’un hôte spectateur soumette une réponse', async () => {
      await service.setHostSpectator('ANSW01', true);

      (prismaMock.duelSession.findUnique as jest.Mock).mockResolvedValue({
        id: 'sess_ans',
        code: 'ANSW01',
        status: 'IN_PROGRESS',
        player1Id: 'host_spec_id',
        players: [{ id: 'p_host', userId: 'host_spec_id', isHost: true }],
      });

      await expect(
        service.submitAnswer('host_spec_id', {
          code: 'ANSW01',
          questionId: 'q1',
          questionIndex: 0,
          userAnswer: 'true',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('devrait être idempotent lorsqu’un joueur renvoie la réponse déjà enregistrée', async () => {
      const mockPlayer = {
        id: 'p_joueur',
        userId: 'usr_j',
        isHost: false,
        score: 150,
        streak: 2,
        hasAnsweredCurrent: true,
      };

      (prismaMock.duelSession.findUnique as jest.Mock).mockResolvedValue({
        id: 'sess_idem',
        code: 'IDEM01',
        status: 'IN_PROGRESS',
        currentQuestionIndex: 0,
        players: [mockPlayer],
      });

      (prismaMock.duelAnswer.findFirst as jest.Mock).mockResolvedValue({
        id: 'ans_1',
        isCorrect: true,
        pointsAwarded: 150,
      });

      const res = await service.submitAnswer('usr_j', {
        code: 'IDEM01',
        questionId: 'q1',
        questionIndex: 0,
        userAnswer: 'true',
      });

      expect(res.alreadyAnswered).toBe(true);
      expect(res.pointsAwarded).toBe(150);
      expect(res.score).toBe(150);
      // Ne doit pas appeler prisma.duelAnswer.create
      expect(prismaMock.duelAnswer.create).not.toHaveBeenCalled();
    });
  });
});
