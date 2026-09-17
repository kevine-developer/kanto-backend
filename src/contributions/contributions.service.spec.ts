import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ContributionsService } from './contributions.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { RedisService } from '../redis/redis.service.js';
import {
  createPrismaMock,
  type PrismaMock,
} from '../test-utils/mock-prisma.factory.js';
import { createAvailableRedisMock } from '../test-utils/mock-redis.factory.js';

describe('ContributionsService - Deadlines & Permissions', () => {
  let service: ContributionsService;
  let prismaMock: PrismaMock;
  const mockNotificationsService = {
    create: (jest.fn as any)().mockResolvedValue({}),
  };
  const mockRedisService = createAvailableRedisMock();

  beforeEach(async () => {
    prismaMock = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContributionsService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: NotificationsService, useValue: mockNotificationsService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<ContributionsService>(ContributionsService);
  });

  describe('update() - Règle des 48h (2 jours)', () => {
    it('doit autoriser la modification par l auteur si moins de 48h se sont écoulées', async () => {
      const recentDate = new Date(Date.now() - 10 * 60 * 60 * 1000); // Il y a 10h
      const mockContrib = {
        id: 'c1',
        userId: 'u1',
        createdAt: recentDate,
      };
      prismaMock.contribution.findUnique.mockResolvedValue(mockContrib as any);
      prismaMock.contribution.update.mockResolvedValue({
        ...mockContrib,
        meaning: 'Nouveau sens',
      } as any);

      const result = await service.update('c1', 'u1', 'USER', {
        meaning: 'Nouveau sens',
      });

      expect(result.success).toBe(true);
      expect(prismaMock.contribution.update).toHaveBeenCalled();
    });

    it('doit rejeter avec CONTRIBUTION_MODIFICATION_EXPIRED si plus de 48h pour un utilisateur normal', async () => {
      const oldDate = new Date(Date.now() - 50 * 60 * 60 * 1000); // Il y a 50h (> 48h)
      const mockContrib = {
        id: 'c1',
        userId: 'u1',
        createdAt: oldDate,
      };
      prismaMock.contribution.findUnique.mockResolvedValue(mockContrib as any);

      await expect(
        service.update('c1', 'u1', 'USER', { meaning: 'Trop tard' }),
      ).rejects.toThrow(BadRequestException);

      try {
        await service.update('c1', 'u1', 'USER', { meaning: 'Trop tard' });
      } catch (err: any) {
        expect(err.getResponse()).toMatchObject({
          statusCode: 400,
          error: 'CONTRIBUTION_MODIFICATION_EXPIRED',
        });
      }
    });

    it('doit autoriser un ADMIN à modifier même si plus de 48h se sont écoulées', async () => {
      const oldDate = new Date(Date.now() - 100 * 60 * 60 * 1000); // Il y a 100h
      const mockContrib = {
        id: 'c1',
        userId: 'u1',
        createdAt: oldDate,
      };
      prismaMock.contribution.findUnique.mockResolvedValue(mockContrib as any);
      prismaMock.contribution.update.mockResolvedValue({
        ...mockContrib,
        meaning: 'Modifié par admin',
      } as any);

      const result = await service.update('c1', 'admin_1', 'ADMIN', {
        meaning: 'Modifié par admin',
      });

      expect(result.success).toBe(true);
      expect(prismaMock.contribution.update).toHaveBeenCalled();
    });

    it('doit refuser avec ForbiddenException si l utilisateur n est ni auteur ni admin', async () => {
      const mockContrib = {
        id: 'c1',
        userId: 'u1',
        createdAt: new Date(),
      };
      prismaMock.contribution.findUnique.mockResolvedValue(mockContrib as any);

      await expect(
        service.update('c1', 'autre_user', 'USER', { meaning: 'Piratage' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('doit renvoyer NotFoundException si la contribution n existe pas', async () => {
      prismaMock.contribution.findUnique.mockResolvedValue(null);

      await expect(
        service.update('inconnu', 'u1', 'USER', { meaning: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove() - Règle des 24h (1 jour)', () => {
    it('doit autoriser la suppression par l auteur si moins de 24h se sont écoulées', async () => {
      const recentDate = new Date(Date.now() - 5 * 60 * 60 * 1000); // Il y a 5h
      const mockContrib = {
        id: 'c1',
        userId: 'u1',
        createdAt: recentDate,
      };
      prismaMock.contribution.findUnique.mockResolvedValue(mockContrib as any);
      prismaMock.contribution.delete.mockResolvedValue(mockContrib as any);

      const result = await service.remove('c1', 'u1', 'USER');

      expect(result.success).toBe(true);
      expect(prismaMock.contribution.delete).toHaveBeenCalledWith({
        where: { id: 'c1' },
      });
    });

    it('doit rejeter avec CONTRIBUTION_DELETION_EXPIRED si plus de 24h pour un utilisateur normal', async () => {
      const oldDate = new Date(Date.now() - 25 * 60 * 60 * 1000); // Il y a 25h (> 24h)
      const mockContrib = {
        id: 'c1',
        userId: 'u1',
        createdAt: oldDate,
      };
      prismaMock.contribution.findUnique.mockResolvedValue(mockContrib as any);

      await expect(service.remove('c1', 'u1', 'USER')).rejects.toThrow(
        BadRequestException,
      );

      try {
        await service.remove('c1', 'u1', 'USER');
      } catch (err: any) {
        expect(err.getResponse()).toMatchObject({
          statusCode: 400,
          error: 'CONTRIBUTION_DELETION_EXPIRED',
        });
      }
    });

    it('doit autoriser un ADMIN à supprimer même si plus de 24h se sont écoulées', async () => {
      const oldDate = new Date(Date.now() - 72 * 60 * 60 * 1000); // Il y a 3 jours
      const mockContrib = {
        id: 'c1',
        userId: 'u1',
        createdAt: oldDate,
      };
      prismaMock.contribution.findUnique.mockResolvedValue(mockContrib as any);
      prismaMock.contribution.delete.mockResolvedValue(mockContrib as any);

      const result = await service.remove('c1', 'admin_1', 'ADMIN');

      expect(result.success).toBe(true);
      expect(prismaMock.contribution.delete).toHaveBeenCalledWith({
        where: { id: 'c1' },
      });
    });

    it('doit refuser avec ForbiddenException si l utilisateur n est pas l auteur ni admin', async () => {
      const mockContrib = {
        id: 'c1',
        userId: 'u1',
        createdAt: new Date(),
      };
      prismaMock.contribution.findUnique.mockResolvedValue(mockContrib as any);

      await expect(service.remove('c1', 'voleur', 'USER')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('doit renvoyer NotFoundException si la contribution n existe pas', async () => {
      prismaMock.contribution.findUnique.mockResolvedValue(null);

      await expect(service.remove('inexistant', 'u1', 'USER')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
