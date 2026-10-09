import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ContributionsService } from './contributions.service.js';
import { DuplicateDetectionService } from './duplicate-detection.service.js';
import { ContentModerationService } from './moderation/content-moderation.service.js';
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
    createNotification: (jest.fn as any)().mockResolvedValue({}),
  };
  const mockRedisService = createAvailableRedisMock();
  const mockDuplicateDetectionService = {
    detectDuplicate: (jest.fn as any)().mockResolvedValue({
      isDuplicate: false,
      score: 0,
      targetId: null,
      targetType: null,
      targetTitle: null,
    }),
    normalizeText: (jest.fn as any)().mockImplementation(
      (text: string) => text,
    ),
  };
  const mockContentModerationService = new ContentModerationService();

  beforeEach(async () => {
    prismaMock = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContributionsService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: NotificationsService, useValue: mockNotificationsService },
        { provide: RedisService, useValue: mockRedisService },
        {
          provide: DuplicateDetectionService,
          useValue: mockDuplicateDetectionService,
        },
        {
          provide: ContentModerationService,
          useValue: mockContentModerationService,
        },
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
        status: 'PENDING_REVIEW',
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

    it('doit autoriser la suppression d un brouillon (DRAFT) même après plus de 24h', async () => {
      const oldDate = new Date(Date.now() - 72 * 60 * 60 * 1000); // 72h
      const mockDraft = {
        id: 'draft-1',
        userId: 'u1',
        status: 'DRAFT',
        createdAt: oldDate,
      };
      prismaMock.contribution.findUnique.mockResolvedValue(mockDraft as any);
      prismaMock.contribution.delete.mockResolvedValue(mockDraft as any);

      const result = await service.remove('draft-1', 'u1', 'USER');
      expect(result.success).toBe(true);
      expect(prismaMock.contribution.delete).toHaveBeenCalledWith({
        where: { id: 'draft-1' },
      });
    });
  });

  describe('Modération et Décisions Administratives', () => {
    it('doit rejeter une contribution avec motif et enregistrer adminFeedback', async () => {
      const mockContrib = {
        id: 'c-rej',
        userId: 'u1',
        status: 'PENDING_REVIEW',
        textMg: 'Ohabolana',
        category: 'PROVERBE',
        user: { id: 'u1', name: 'Auteur', email: 'auteur@kanto.mg' },
      };
      prismaMock.contribution.findUnique.mockResolvedValue(mockContrib as any);
      prismaMock.contribution.update.mockResolvedValue({
        ...mockContrib,
        status: 'REJECTED',
        adminFeedback: 'Contenu non conforme aux règles',
      } as any);

      const result = await service.validate(
        'c-rej',
        false,
        'admin-1',
        'Contenu non conforme aux règles',
      );

      expect(result.success).toBe(true);
      expect(result.status).toBe('REJECTED');
      expect(prismaMock.contribution.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'c-rej' },
          data: expect.objectContaining({
            status: 'REJECTED',
            adminFeedback: 'Contenu non conforme aux règles',
          }),
        }),
      );
    });

    it('doit demander des modifications (CHANGES_REQUESTED) avec consignes', async () => {
      const mockContrib = {
        id: 'c-chg',
        userId: 'u1',
        status: 'PENDING_REVIEW',
        textMg: 'Kabary',
        category: 'KABARY',
        user: { id: 'u1', name: 'Auteur', email: 'auteur@kanto.mg' },
      };
      prismaMock.contribution.findUnique.mockResolvedValue(mockContrib as any);
      prismaMock.contribution.update.mockResolvedValue({
        ...mockContrib,
        status: 'CHANGES_REQUESTED',
        adminFeedback: 'Veuillez préciser la région d origine',
      } as any);

      const result = await service.validate(
        'c-chg',
        false,
        'admin-1',
        'Veuillez préciser la région d origine',
        true, // requestChanges
      );

      expect(result.success).toBe(true);
      expect(result.status).toBe('CHANGES_REQUESTED');
    });

    it('doit approuver une contribution avec +50 XP et passer le statut à APPROVED', async () => {
      const mockContrib = {
        id: 'c-appr',
        userId: 'u1',
        status: 'PENDING_REVIEW',
        category: 'PROVERBE',
        textMg: 'Ny fihavanana toy ny kofehin-landy',
        textFr: 'La fraternité est comme le fil de soie',
        meaning: 'Valeur sacrée',
        region: 'Imerina',
      };
      prismaMock.contribution.findUnique.mockResolvedValue(mockContrib as any);
      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        return callback({
          contribution: {
            update: jest.fn().mockResolvedValue({
              ...mockContrib,
              status: 'APPROVED',
            }),
          },
          malagasyItem: {
            findUnique: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({ id: 'item-1' }),
          },
          userProgress: {
            upsert: jest.fn().mockResolvedValue({ totalXp: 50, level: 1 }),
          },
        });
      });

      const result = await service.validate(
        'c-appr',
        true,
        'admin-1',
        'Validé',
      );

      expect(result.success).toBe(true);
      expect(result.status).toBe('APPROVED');
    });
  });
});
