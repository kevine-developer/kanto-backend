import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { PresenceService } from './presence.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { PlayerPresenceStatus } from './presence.types.js';

describe('PresenceService — Système de Présence & Disponibilité 1v1', () => {
  let service: PresenceService;
  let mockPrisma: any;
  let mockRedis: any;

  beforeEach(async () => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
      },
      userBlock: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
      duelSession: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
    };

    mockRedis = {
      get: jest.fn().mockImplementation(() => Promise.resolve(null)),
      set: jest.fn().mockImplementation(() => Promise.resolve('OK')),
      del: jest.fn().mockImplementation(() => Promise.resolve(1)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PresenceService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();

    service = module.get<PresenceService>(PresenceService);
  });

  describe('1. Statuts bruts de présence (getRawPresenceStatus)', () => {
    it('doit renvoyer OFFLINE si aucun battement de cœur ni socket enregistré', async () => {
      const status = await service.getRawPresenceStatus('user-offline');
      expect(status).toBe(PlayerPresenceStatus.OFFLINE);
    });

    it('doit renvoyer ONLINE si le joueur a un heartbeat actif récent (< 60s)', async () => {
      await service.recordHeartbeat('user-active', 'active');
      const status = await service.getRawPresenceStatus('user-active');
      expect(status).toBe(PlayerPresenceStatus.ONLINE);
    });

    it("doit renvoyer AWAY si l'application est déclarée en arrière-plan (background)", async () => {
      await service.recordHeartbeat('user-bg', 'background');
      const status = await service.getRawPresenceStatus('user-bg');
      expect(status).toBe(PlayerPresenceStatus.AWAY);
    });

    it("doit basculer en OFFLINE si l'application signale explicitement être inactive", async () => {
      await service.recordHeartbeat('user-closing', 'inactive');
      const status = await service.getRawPresenceStatus('user-closing');
      expect(status).toBe(PlayerPresenceStatus.OFFLINE);
    });
  });

  describe('2. Règles métier & Disponibilité 1v1 (getUserDuelAvailability)', () => {
    it("doit interdire l'auto-défi (expéditeur === destinataire)", async () => {
      const res = await service.getUserDuelAvailability('player-1', 'player-1');
      expect(res.isAvailableForDuel).toBe(false);
      expect(res.messageFr).toBe('Vous ne pouvez pas vous défier vous-même.');
    });

    it('doit refuser le défi si le compte destinataire est introuvable', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      const res = await service.getUserDuelAvailability('p1', 'p-unknown');
      expect(res.isAvailableForDuel).toBe(false);
      expect(res.status).toBe(PlayerPresenceStatus.OFFLINE);
    });

    it('doit refuser le défi si le destinataire est banni ou inactif', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'p-banned',
        banned: true,
        status: 'ACTIVE',
      });
      const res = await service.getUserDuelAvailability('p1', 'p-banned');
      expect(res.isAvailableForDuel).toBe(false);
      expect(res.status).toBe(PlayerPresenceStatus.BUSY);
    });

    it('doit refuser le défi si un blocage mutuel existe', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'p-blocked',
        banned: false,
        status: 'ACTIVE',
      });
      mockPrisma.userBlock.findFirst.mockResolvedValue({ id: 'block-1' });

      const res = await service.getUserDuelAvailability('p1', 'p-blocked');
      expect(res.isAvailableForDuel).toBe(false);
      expect(res.reason).toBe('BLOCKED');
    });

    it('doit refuser le défi si le destinataire participe déjà à une partie active (< 8 min)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'p-playing',
        banned: false,
        status: 'ACTIVE',
      });
      mockPrisma.userBlock.findFirst.mockResolvedValue(null);
      mockPrisma.duelSession.findFirst.mockResolvedValueOnce({
        id: 'session-active',
        code: 'KN8888',
      });

      const res = await service.getUserDuelAvailability('p1', 'p-playing');
      expect(res.isAvailableForDuel).toBe(false);
      expect(res.status).toBe(PlayerPresenceStatus.IN_GAME);
      expect(res.messageFr).toBe('Ce joueur participe déjà à une partie.');
    });

    it('doit refuser si une invitation en attente identique existe déjà (< 10 min)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'p-pending',
        banned: false,
        status: 'ACTIVE',
      });
      mockPrisma.userBlock.findFirst.mockResolvedValue(null);
      // Première recherche (match actif) = null
      mockPrisma.duelSession.findFirst.mockResolvedValueOnce(null);
      // Deuxième recherche (défi en attente) = invitation trouvée
      mockPrisma.duelSession.findFirst.mockResolvedValueOnce({
        id: 'session-waiting',
        player1Id: 'p1',
      });

      const res = await service.getUserDuelAvailability('p1', 'p-pending');
      expect(res.isAvailableForDuel).toBe(false);
      expect(res.status).toBe(PlayerPresenceStatus.BUSY);
      expect(res.messageFr).toBe(
        'Ce joueur a déjà reçu une invitation de votre part.',
      );
    });

    it('doit refuser si le joueur est hors ligne', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'p-offline',
        banned: false,
        status: 'ACTIVE',
      });
      mockPrisma.userBlock.findFirst.mockResolvedValue(null);
      mockPrisma.duelSession.findFirst.mockResolvedValue(null);

      const res = await service.getUserDuelAvailability('p1', 'p-offline');
      expect(res.isAvailableForDuel).toBe(false);
      expect(res.status).toBe(PlayerPresenceStatus.OFFLINE);
      expect(res.messageFr).toBe('Ce joueur est actuellement hors ligne.');
    });

    it('doit refuser si le joueur est absent (application en arrière-plan)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'p-away',
        banned: false,
        status: 'ACTIVE',
      });
      mockPrisma.userBlock.findFirst.mockResolvedValue(null);
      mockPrisma.duelSession.findFirst.mockResolvedValue(null);

      await service.recordHeartbeat('p-away', 'background');

      const res = await service.getUserDuelAvailability('p1', 'p-away');
      expect(res.isAvailableForDuel).toBe(false);
      expect(res.status).toBe(PlayerPresenceStatus.AWAY);
      expect(res.messageFr).toBe('Ce joueur est inactif pour le moment.');
    });

    it('doit AUTORISER le défi si le joueur est en ligne, actif, et sans conflit', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'p-ready',
        banned: false,
        status: 'ACTIVE',
      });
      mockPrisma.userBlock.findFirst.mockResolvedValue(null);
      mockPrisma.duelSession.findFirst.mockResolvedValue(null);

      await service.recordSocketConnect('p-ready', 'socket-123');
      await service.recordHeartbeat('p-ready', 'active');

      const res = await service.getUserDuelAvailability('p1', 'p-ready');
      expect(res.isAvailableForDuel).toBe(true);
      expect(res.status).toBe(PlayerPresenceStatus.ONLINE);
      expect(res.messageFr).toBe(
        'Ce joueur est en ligne et disponible pour un duel.',
      );
    });
  });
});
