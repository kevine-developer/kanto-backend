import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { FriendsService } from './friends.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProgressionService } from '../progression/progression.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { FriendshipStatus } from '../../generated/prisma/client.js';

describe('FriendsService', () => {
  let service: FriendsService;
  let prisma: jest.Mocked<any>;
  let progressionService: jest.Mocked<any>;
  let notificationsService: jest.Mocked<any>;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    friendship: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    encouragement: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockProgressionService = {
    awardXp: jest.fn(),
  };

  const mockNotificationsService = {
    createNotification: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ProgressionService, useValue: mockProgressionService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<FriendsService>(FriendsService);
    prisma = module.get(PrismaService);
    progressionService = module.get(ProgressionService);
    notificationsService = module.get(NotificationsService);
  });

  describe('getFriends', () => {
    it('doit renvoyer la liste des amis acceptés avec indicateur hasEncouragedToday', async () => {
      mockPrisma.friendship.findMany.mockResolvedValue([
        {
          id: 'f1',
          senderId: 'u1',
          receiverId: 'u2',
          status: FriendshipStatus.ACCEPTED,
          updatedAt: new Date('2026-09-10'),
          sender: { id: 'u1', name: 'Alice', image: null, progress: null },
          receiver: {
            id: 'u2',
            name: 'Bob',
            image: 'https://example.com/bob.jpg',
            progress: { level: 3, totalXp: 450, streakDays: 5 },
          },
        },
      ]);

      mockPrisma.encouragement.findMany.mockResolvedValue([
        { receiverId: 'u2' },
      ]);

      const friends = await service.getFriends('u1');

      expect(friends).toHaveLength(1);
      expect(friends[0]).toEqual({
        userId: 'u2',
        name: 'Bob',
        username: '@bob',
        avatar: 'https://example.com/bob.jpg',
        level: 3,
        totalXp: 450,
        streakDays: 5,
        friendshipId: 'f1',
        hasEncouragedToday: true,
        friendsSince: expect.any(Date),
      });
    });
  });

  describe('sendFriendRequest', () => {
    it('doit rejeter l auto-invitation avec BadRequestException', async () => {
      await expect(service.sendFriendRequest('u1', 'u1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('doit rejeter si l utilisateur cible n existe pas', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce({ name: 'Alice' }) // sender
        .mockResolvedValueOnce(null); // targetUser

      await expect(service.sendFriendRequest('u1', 'u999')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('doit rejeter si déjà amis avec ConflictException', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce({ name: 'Alice' })
        .mockResolvedValueOnce({ id: 'u2', name: 'Bob' });

      mockPrisma.friendship.findFirst.mockResolvedValue({
        id: 'f1',
        senderId: 'u1',
        receiverId: 'u2',
        status: FriendshipStatus.ACCEPTED,
      });

      await expect(service.sendFriendRequest('u1', 'u2')).rejects.toThrow(
        ConflictException,
      );
    });

    it('doit accepter automatiquement si l autre utilisateur avait déjà envoyé une demande', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce({ name: 'Alice' })
        .mockResolvedValueOnce({ id: 'u2', name: 'Bob' });

      mockPrisma.friendship.findFirst.mockResolvedValue({
        id: 'f1',
        senderId: 'u2',
        receiverId: 'u1',
        status: FriendshipStatus.PENDING,
      });

      mockPrisma.friendship.update.mockResolvedValue({
        id: 'f1',
        status: FriendshipStatus.ACCEPTED,
      });

      const res = await service.sendFriendRequest('u1', 'u2');

      expect(res.status).toBe('ACCEPTED');
      expect(mockPrisma.friendship.update).toHaveBeenCalledWith({
        where: { id: 'f1' },
        data: { status: FriendshipStatus.ACCEPTED },
      });
      expect(mockNotificationsService.createNotification).toHaveBeenCalled();
    });

    it('doit créer la demande si aucune relation existante', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce({ name: 'Alice' })
        .mockResolvedValueOnce({ id: 'u2', name: 'Bob' });

      mockPrisma.friendship.findFirst.mockResolvedValue(null);
      mockPrisma.friendship.create.mockResolvedValue({
        id: 'f_new',
        senderId: 'u1',
        receiverId: 'u2',
        status: FriendshipStatus.PENDING,
      });

      const res = await service.sendFriendRequest('u1', 'u2');

      expect(res.status).toBe('PENDING_SENT');
      expect(mockPrisma.friendship.create).toHaveBeenCalled();
      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'u2' }),
      );
    });
  });

  describe('acceptFriendRequest', () => {
    it('doit valider et passer le statut en ACCEPTED', async () => {
      mockPrisma.friendship.findFirst.mockResolvedValue({
        id: 'f1',
        senderId: 'u2',
        receiverId: 'u1',
        status: FriendshipStatus.PENDING,
        receiver: { name: 'Alice' },
      });

      mockPrisma.friendship.update.mockResolvedValue({
        id: 'f1',
        status: FriendshipStatus.ACCEPTED,
      });

      const res = await service.acceptFriendRequest('u1', 'f1');

      expect(res.success).toBe(true);
      expect(mockPrisma.friendship.update).toHaveBeenCalledWith({
        where: { id: 'f1' },
        data: { status: FriendshipStatus.ACCEPTED },
      });
      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'u2' }),
      );
    });
  });

  describe('canEncourage', () => {
    it('doit renvoyer false si l utilisateur est soi-même', async () => {
      const res = await service.canEncourage('u1', 'u1');
      expect(res.canEncourage).toBe(false);
    });

    it('doit renvoyer false si déjà encouragé aujourd hui', async () => {
      mockPrisma.encouragement.findUnique.mockResolvedValue({
        id: 'e1',
        createdAt: new Date(),
      });

      const res = await service.canEncourage('u1', 'u2');
      expect(res.canEncourage).toBe(false);
      expect(res.lastEncouragedAt).toBeDefined();
    });

    it('doit renvoyer true si non encouragé aujourd hui', async () => {
      mockPrisma.encouragement.findUnique.mockResolvedValue(null);

      const res = await service.canEncourage('u1', 'u2');
      expect(res.canEncourage).toBe(true);
    });
  });

  describe('encourageUser', () => {
    it('doit rejeter si tentative de s encourager soi-même', async () => {
      await expect(service.encourageUser('u1', 'u1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('doit rejeter avec BadRequestException si déjà encouragé aujourd hui', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce({ name: 'Alice' })
        .mockResolvedValueOnce({ id: 'u2', name: 'Bob' });

      mockPrisma.encouragement.findUnique.mockResolvedValue({
        id: 'e1',
      });

      await expect(service.encourageUser('u1', 'u2')).rejects.toThrow(
        BadRequestException,
      );
      expect(mockProgressionService.awardXp).not.toHaveBeenCalled();
    });

    it('doit attribuer +1 XP au sender ET +1 XP au receiver et enregistrer l encouragement', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce({ name: 'Alice' })
        .mockResolvedValueOnce({ id: 'u2', name: 'Bob' });

      mockPrisma.encouragement.findUnique.mockResolvedValue(null);
      mockPrisma.encouragement.create.mockResolvedValue({ id: 'e_new' });

      mockProgressionService.awardXp
        .mockResolvedValueOnce({ totalXp: 101, level: 2, streakDays: 3 }) // sender
        .mockResolvedValueOnce({ totalXp: 251, level: 3, streakDays: 7 }); // receiver

      const res = await service.encourageUser('u1', 'u2');

      expect(res.success).toBe(true);
      expect(res.xpEarned).toBe(1);
      expect(mockPrisma.encouragement.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            senderId: 'u1',
            receiverId: 'u2',
          }),
        }),
      );

      // Vérifie l'attribution des XP
      expect(mockProgressionService.awardXp).toHaveBeenCalledWith(
        'u1',
        1,
        'encouragement_sent',
        expect.any(String),
      );
      expect(mockProgressionService.awardXp).toHaveBeenCalledWith(
        'u2',
        1,
        'encouragement_received',
        expect.any(String),
      );

      // Vérifie l'envoi de notification
      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'u2',
          badgeText: '+1 XP',
        }),
      );
    });
  });
});
