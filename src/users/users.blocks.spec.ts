import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CloudinaryService } from '../integrations/cloudinary/cloudinary.service.js';
import { ResendService } from '../integrations/resend/resend.service.js';
import {
  createPrismaMock,
  type PrismaMock,
} from '../test-utils/mock-prisma.factory.js';

describe('UsersService — Blocage communautaire (UserBlock)', () => {
  let service: UsersService;
  let prismaMock: PrismaMock;

  beforeEach(async () => {
    prismaMock = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: CloudinaryService,
          useValue: { isConfigured: jest.fn().mockReturnValue(true) },
        },
        {
          provide: ResendService,
          useValue: {
            sendAccountPendingDeletionEmail: jest
              .fn<any>()
              .mockResolvedValue({ id: '1' }),
            sendAccountReactivatedEmail: jest
              .fn<any>()
              .mockResolvedValue({ id: '2' }),
            sendAccountDeletionEmail: jest
              .fn<any>()
              .mockResolvedValue({ id: '3' }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('blockUser', () => {
    it('lève BadRequestException si l’utilisateur tente de se bloquer lui-même', async () => {
      await expect(service.blockUser('user-1', 'user-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('lève NotFoundException si l’utilisateur cible n’existe pas', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.blockUser('user-1', 'user-target')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('bloque avec succès et rompt l’amitié mutuelle de façon atomique', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-target',
        name: 'Cible Bloquée',
      });

      const result = await service.blockUser('user-1', 'user-target');

      expect(result.success).toBe(true);
      expect(prismaMock.$transaction).toHaveBeenCalled();
      expect(prismaMock.friendship.deleteMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { senderId: 'user-1', receiverId: 'user-target' },
            { senderId: 'user-target', receiverId: 'user-1' },
          ],
        },
      });
      expect(prismaMock.userBlock.upsert).toHaveBeenCalledWith({
        where: {
          blockerId_blockedId: {
            blockerId: 'user-1',
            blockedId: 'user-target',
          },
        },
        create: {
          blockerId: 'user-1',
          blockedId: 'user-target',
        },
        update: {},
      });
    });
  });

  describe('unblockUser', () => {
    it('débloque avec succès un utilisateur sans restaurer l’amitié', async () => {
      prismaMock.userBlock.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.unblockUser('user-1', 'user-target');

      expect(result.success).toBe(true);
      expect(prismaMock.userBlock.deleteMany).toHaveBeenCalledWith({
        where: {
          blockerId: 'user-1',
          blockedId: 'user-target',
        },
      });
    });
  });

  describe('getBlockedUsers', () => {
    it('retourne la liste formatée des utilisateurs bloqués', async () => {
      const now = new Date();
      prismaMock.userBlock.findMany.mockResolvedValue([
        {
          id: 'block-1',
          blockerId: 'user-1',
          blockedId: 'user-2',
          createdAt: now,
          blocked: {
            id: 'user-2',
            name: 'Utilisateur Deux',
            username: 'user_deux',
            image: 'https://example.com/avatar.jpg',
          },
        },
      ]);

      const result = await service.getBlockedUsers('user-1');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'user-2',
        name: 'Utilisateur Deux',
        username: 'user_deux',
        image: 'https://example.com/avatar.jpg',
        blockedAt: now,
      });
    });
  });

  describe('getBlockStatus', () => {
    it('retourne correctement les deux sens de blocage', async () => {
      prismaMock.userBlock.findUnique
        .mockResolvedValueOnce({ id: 'block-1' }) // sent
        .mockResolvedValueOnce(null); // received

      const status = await service.getBlockStatus('user-1', 'user-2');

      expect(status.isBlockedByMe).toBe(true);
      expect(status.isBlockingMe).toBe(false);
    });
  });
});
