import { jest } from '@jest/globals';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { ContributionStatus, DisputeStatus } from '../../generated/prisma/client.js';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let mockPrisma: any;
  let mockRedis: any;

  beforeEach(() => {
    mockPrisma = {
      notification: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      contentReport: {
        findMany: jest.fn(),
      },
      contribution: {
        findMany: jest.fn(),
      },
    };

    mockRedis = {
      get: jest.fn(),
      set: jest.fn(),
      publish: jest.fn(),
      sAdd: jest.fn(),
      sRem: jest.fn(),
      sMembers: jest.fn(),
    };

    service = new NotificationsService(mockPrisma, mockRedis);
  });

  describe('getPublicNotifications', () => {
    it('doit renvoyer uniquement les notifications broadcast si aucun userId n’est fourni (visiteur anonyme)', async () => {
      mockPrisma.notification.findMany.mockResolvedValueOnce([
        {
          id: 'notif_broadcast',
          isBroadcast: true,
          titleMg: 'Vaovao',
          titleFr: 'Nouveauté',
          messageMg: 'Hafatra',
          messageFr: 'Message',
          category: 'culture',
          badgeText: 'Vaovao',
          createdAt: new Date(),
          isRead: false,
        },
      ]);

      const res = await service.getPublicNotifications('fr', undefined);

      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isBroadcast: true },
        }),
      );
      expect(res.totalCount).toBe(1);
      expect(res.groups.length).toBeGreaterThan(0);
    });

    it('doit inclure les notifications privées ET broadcast si un userId authentifié est fourni', async () => {
      mockPrisma.notification.findMany.mockResolvedValueOnce([
        {
          id: 'notif_user_1',
          userId: 'user_123',
          isBroadcast: false,
          titleMg: 'Namana',
          titleFr: 'Ami',
          messageMg: 'Hafatra',
          messageFr: 'Message',
          category: 'community',
          badgeText: 'Namana',
          createdAt: new Date(),
          isRead: false,
        },
      ]);

      const res = await service.getPublicNotifications('mg', 'user_123');

      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [{ isBroadcast: true }, { userId: 'user_123' }],
          },
        }),
      );
      expect(res.totalCount).toBe(1);
    });
  });

  describe('createNotification & Idempotence', () => {
    it('doit lever BadRequestException si le titre ou message en malgache est manquant', async () => {
      await expect(
        service.createNotification({
          titleMg: '',
          messageMg: 'Message',
        } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('doit réutiliser la notification existante si la clé idempotencyKey est déjà enregistrée', async () => {
      mockRedis.get.mockResolvedValueOnce('existing_notif_999');
      mockPrisma.notification.findUnique.mockResolvedValueOnce({
        id: 'existing_notif_999',
        titleMg: 'Efa misy',
      });

      const res = await service.createNotification({
        titleMg: 'Efa misy',
        messageMg: 'Hafatra',
        idempotencyKey: 'duel_invite_123',
      });

      expect(res.id).toBe('existing_notif_999');
      expect(mockPrisma.notification.create).not.toHaveBeenCalled();
    });

    it('doit éviter les doublons anti-rafale pour un même utilisateur dans la fenêtre de 30 secondes', async () => {
      mockRedis.get.mockImplementation(async (key: string) => {
        if (key.startsWith('notif_rate_limit:')) return 'recent_notif_888';
        return null;
      });
      mockPrisma.notification.findUnique.mockResolvedValueOnce({
        id: 'recent_notif_888',
        titleMg: 'Fanamby',
      });

      const res = await service.createNotification({
        userId: 'user_123',
        titleMg: 'Fanamby',
        messageMg: 'Hafatra',
        category: 'duel',
      });

      expect(res.id).toBe('recent_notif_888');
      expect(mockPrisma.notification.create).not.toHaveBeenCalled();
    });

    it('doit créer la notification, publier sur Redis et sauvegarder la clé d’idempotence si nouvelle', async () => {
      mockRedis.get.mockResolvedValue(null);
      const fakeCreated = {
        id: 'notif_new_1',
        titleMg: 'Vaovao',
        titleFr: 'Nouveauté',
        messageMg: 'Hafatra',
        messageFr: 'Message',
        category: 'culture',
        badgeText: 'Vaovao',
        badgeType: 'new',
        iconName: 'bulb-outline',
        iconColor: '#C0392B',
        targetRoute: null,
        isBroadcast: true,
        userId: null,
        isRead: false,
        createdAt: new Date(),
      };
      mockPrisma.notification.create.mockResolvedValueOnce(fakeCreated);

      const res = await service.createNotification({
        titleMg: 'Vaovao',
        titleFr: 'Nouveauté',
        messageMg: 'Hafatra',
        idempotencyKey: 'unique_action_key',
      });

      expect(res.id).toBe('notif_new_1');
      expect(mockPrisma.notification.create).toHaveBeenCalled();
      expect(mockRedis.publish).toHaveBeenCalled();
      expect(mockRedis.set).toHaveBeenCalledWith(
        'notif_idem:unique_action_key',
        'notif_new_1',
        86400,
      );
    });
  });

  describe('Sécurité markAsRead, deleteNotification & clearAllNotifications', () => {
    it('markAsRead doit rejeter avec ForbiddenException si la notification appartient à un autre utilisateur', async () => {
      mockPrisma.notification.findUnique.mockResolvedValueOnce({
        id: 'notif_456',
        userId: 'owner_user_id',
      });

      await expect(
        service.markAsRead('notif_456', 'attacker_user_id'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deleteNotification doit rejeter avec ForbiddenException si un utilisateur non-admin tente de supprimer la notification d’autrui', async () => {
      mockPrisma.notification.findUnique.mockResolvedValueOnce({
        id: 'notif_789',
        userId: 'target_victim',
      });

      await expect(
        service.deleteNotification('notif_789', 'malicious_user', 'USER'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deleteNotification doit autoriser la suppression si l’utilisateur est le propriétaire légitime', async () => {
      mockPrisma.notification.findUnique.mockResolvedValueOnce({
        id: 'notif_789',
        userId: 'legit_user',
      });
      mockPrisma.notification.delete.mockResolvedValueOnce({ id: 'notif_789' });

      const res = await service.deleteNotification(
        'notif_789',
        'legit_user',
        'USER',
      );
      expect(res.success).toBe(true);
      expect(mockPrisma.notification.delete).toHaveBeenCalledWith({
        where: { id: 'notif_789' },
      });
    });

    it('clearAllNotifications doit rejeter avec ForbiddenException sans authentification', async () => {
      await expect(
        service.clearAllNotifications(undefined, undefined),
      ).rejects.toThrow(ForbiddenException);
    });

    it('clearAllNotifications ne doit supprimer que les notifications privées de l’utilisateur authentifié', async () => {
      mockPrisma.notification.deleteMany.mockResolvedValueOnce({ count: 5 });

      const res = await service.clearAllNotifications('user_auth_1', 'USER');

      expect(res.count).toBe(5);
      expect(mockPrisma.notification.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user_auth_1' },
      });
    });
  });

  describe('getAdminAlerts', () => {
    it('doit regrouper et trier par priorité les signalements et les contributions nécessitant intervention', async () => {
      mockPrisma.contentReport.findMany.mockResolvedValueOnce([
        {
          id: 'rep_1',
          reason: 'INAPPROPRIATE',
          description: 'Contenu déplacé',
          createdAt: new Date(),
          user: { name: 'Rasoa' },
          contributionId: 'contrib_1',
        },
      ]);

      mockPrisma.contribution.findMany
        .mockResolvedValueOnce([
          {
            id: 'contrib_flagged',
            category: 'PROVERBE',
            textMg: 'Ohabolana ahiana',
            moderationFlagged: true,
            status: ContributionStatus.PENDING_REVIEW,
            createdAt: new Date(),
            user: { name: 'Koto' },
          },
        ])
        .mockResolvedValueOnce([
          {
            id: 'contrib_dispute',
            disputeMessage: 'Tsy dika mitovy',
            disputedAt: new Date(),
            user: { name: 'Bema' },
          },
        ]);

      const res = await service.getAdminAlerts();

      expect(res.alerts.length).toBe(3);
      expect(res.flaggedContributionsCount).toBe(1);
      expect(res.pendingReportsCount).toBe(1);
      // L'alerte avec filtre de grossièretés doit être classée en critique
      expect(res.alerts[0].priority).toBe('critical');
    });
  });
});
