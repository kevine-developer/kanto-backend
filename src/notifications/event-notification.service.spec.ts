import { jest } from '@jest/globals';
import { EventNotificationService } from './event-notification.service.js';
import type { NotificationEvent } from './events/notification-event.types.js';

describe('EventNotificationService', () => {
  let service: EventNotificationService;
  let mockPrisma: any;
  let mockNotificationsService: any;
  let mockRedisService: any;
  let mockResendService: any;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
      },
    };

    mockNotificationsService = {
      getUserPreferences: (jest.fn as any)().mockResolvedValue({
        emailNotifications: true,
        pushNotifications: true,
        socialActivity: true,
        culturalAlerts: true,
        marketingUpdates: true,
      }),
      createNotification: (jest.fn as any)().mockResolvedValue({
        id: 'notif_123',
      }),
      sendExpoPushNotification: (jest.fn as any)().mockResolvedValue(true),
    };

    mockRedisService = {
      get: (jest.fn as any)().mockResolvedValue(null),
      set: (jest.fn as any)().mockResolvedValue('OK'),
      del: (jest.fn as any)().mockResolvedValue(1),
    };

    mockResendService = {
      sendVipGrantedEmail: (jest.fn as any)().mockResolvedValue({
        id: 'email_vip_granted',
      }),
      sendVipExtendedEmail: (jest.fn as any)().mockResolvedValue({
        id: 'email_vip_extended',
      }),
      sendVipExpiringSoonEmail: (jest.fn as any)().mockResolvedValue({
        id: 'email_vip_expiring',
      }),
      sendVipExpiredEmail: (jest.fn as any)().mockResolvedValue({
        id: 'email_vip_expired',
      }),
      sendUserBannedEmail: (jest.fn as any)().mockResolvedValue({
        id: 'email_banned',
      }),
      sendUserUnbannedEmail: (jest.fn as any)().mockResolvedValue({
        id: 'email_unbanned',
      }),
      sendSecurityChangeEmail: (jest.fn as any)().mockResolvedValue({
        id: 'email_pwd_changed',
      }),
      sendContributionApprovedEmail: (jest.fn as any)().mockResolvedValue({
        id: 'email_contrib_appr',
      }),
      sendContributionStatusUpdateEmail: (jest.fn as any)().mockResolvedValue({
        id: 'email_contrib_update',
      }),
    };

    service = new EventNotificationService(
      mockPrisma,
      mockNotificationsService,
      mockRedisService,
      mockResendService,
    );
  });

  describe('dispatchNotificationEvent - Idempotence & Verrouillage', () => {
    it('doit ignorer le traitement si l’événement a déjà été traité (verrou d’idempotence présent)', async () => {
      mockRedisService.get.mockResolvedValueOnce('processed');

      const event: NotificationEvent = {
        type: 'USER_VIP_GRANTED',
        recipientUserId: 'user_456',
        durationDays: 30,
        idempotencyKey: 'custom_idemp_key_1',
      };

      const result = await service.dispatchNotificationEvent(event);

      expect(result.success).toBe(true);
      expect(result.skippedReason).toBe('ALREADY_PROCESSED');
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
      expect(
        mockNotificationsService.createNotification,
      ).not.toHaveBeenCalled();
      expect(mockResendService.sendVipGrantedEmail).not.toHaveBeenCalled();
    });

    it('doit poser un verrou court puis charger le destinataire', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user_456',
        email: 'user@kanto.mg',
        name: 'Kanto User',
        tier: 'VIP',
        tierExpiresAt: new Date('2026-11-19T00:00:00Z'),
        pushToken: 'ExponentPushToken[xxxx]',
      });

      const event: NotificationEvent = {
        type: 'USER_VIP_GRANTED',
        recipientUserId: 'user_456',
        durationDays: 30,
        idempotencyKey: 'grant_vip_user456',
      };

      const result = await service.dispatchNotificationEvent(event);

      expect(result.success).toBe(true);
      expect(mockRedisService.set).toHaveBeenCalledWith(
        'event_lock:grant_vip_user456',
        'processing',
        300,
      );
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user_456' },
        select: expect.any(Object),
      });
    });

    it('doit renvoyer USER_NOT_FOUND si l’utilisateur n’existe pas en base', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      const event: NotificationEvent = {
        type: 'USER_VIP_GRANTED',
        recipientUserId: 'non_existent_user',
      };

      const result = await service.dispatchNotificationEvent(event);

      expect(result.success).toBe(false);
      expect(result.skippedReason).toBe('USER_NOT_FOUND');
      expect(
        mockNotificationsService.createNotification,
      ).not.toHaveBeenCalled();
    });
  });

  describe('dispatchNotificationEvent - Statut VIP', () => {
    const userVip = {
      id: 'user_vip_1',
      email: 'vip@kanto.mg',
      name: 'Rasoa VIP',
      tier: 'VIP',
      tierExpiresAt: new Date('2026-12-01T00:00:00Z'),
      pushToken: 'ExponentPushToken[abc12345]',
    };

    beforeEach(() => {
      mockPrisma.user.findUnique.mockResolvedValue(userVip);
    });

    it('doit envoyer in-app, e-mail lors de USER_VIP_GRANTED', async () => {
      const event: NotificationEvent = {
        type: 'USER_VIP_GRANTED',
        recipientUserId: userVip.id,
        durationDays: 30,
        expiresAt: userVip.tierExpiresAt,
      };

      const result = await service.dispatchNotificationEvent(event);

      expect(result.success).toBe(true);
      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: userVip.id,
          badgeText: 'VIP',
          category: 'system',
        }),
      );
      expect(mockResendService.sendVipGrantedEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: userVip.email,
          userName: userVip.name,
          durationDays: 30,
        }),
      );
    });

    it('doit envoyer in-app et e-mail lors de USER_VIP_EXTENDED', async () => {
      const event: NotificationEvent = {
        type: 'USER_VIP_EXTENDED',
        recipientUserId: userVip.id,
        addedDays: 90,
        newExpiresAt: new Date('2027-02-01T00:00:00Z'),
      };

      const result = await service.dispatchNotificationEvent(event);

      expect(result.success).toBe(true);
      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: userVip.id,
          badgeText: 'VIP',
        }),
      );
      expect(mockResendService.sendVipExtendedEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: userVip.email,
          addedDays: 90,
        }),
      );
    });

    it('doit envoyer in-app et e-mail lors de USER_VIP_EXPIRING_SOON (J-3)', async () => {
      const event: NotificationEvent = {
        type: 'USER_VIP_EXPIRING_SOON',
        recipientUserId: userVip.id,
        expiresAt: userVip.tierExpiresAt,
        daysRemaining: 3,
      };

      const result = await service.dispatchNotificationEvent(event);

      expect(result.success).toBe(true);
      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: userVip.id,
          badgeText: 'VIP',
          titleFr: expect.stringContaining('3 jours'),
        }),
      );
      expect(mockResendService.sendVipExpiringSoonEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: userVip.email,
          daysRemaining: 3,
        }),
      );
    });

    it('doit envoyer in-app et e-mail lors de USER_VIP_EXPIRED', async () => {
      const event: NotificationEvent = {
        type: 'USER_VIP_EXPIRED',
        recipientUserId: userVip.id,
      };

      const result = await service.dispatchNotificationEvent(event);

      expect(result.success).toBe(true);
      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: userVip.id,
          badgeText: 'Standard',
        }),
      );
      expect(mockResendService.sendVipExpiredEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: userVip.email,
        }),
      );
    });
  });

  describe('dispatchNotificationEvent - Modération des contributions', () => {
    const contributor = {
      id: 'contrib_user_1',
      email: 'contributor@kanto.mg',
      name: 'Rabe Contributor',
      tier: 'FREE',
      tierExpiresAt: null,
      pushToken: 'ExponentPushToken[contrib]',
    };

    beforeEach(() => {
      mockPrisma.user.findUnique.mockResolvedValue(contributor);
    });

    it('doit traiter CONTRIBUTION_APPROVED avec in-app et e-mail', async () => {
      const event: NotificationEvent = {
        type: 'CONTRIBUTION_APPROVED',
        recipientUserId: contributor.id,
        contributionId: 'cnt_123',
        contributionTitle: 'Ohabolana momba ny aina sy ny fahendrena',
        category: 'proverbs',
        xpReward: 50,
      };

      const result = await service.dispatchNotificationEvent(event);

      expect(result.success).toBe(true);
      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: contributor.id,
          category: 'community',
          badgeText: 'Nekena',
        }),
      );
      expect(
        mockResendService.sendContributionApprovedEmail,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          to: contributor.email,
          contributionTitle: expect.stringContaining('Ohabolana'),
          xpReward: 50,
        }),
      );
    });

    it('doit traiter CONTRIBUTION_REJECTED avec le motif', async () => {
      const event: NotificationEvent = {
        type: 'CONTRIBUTION_REJECTED',
        recipientUserId: contributor.id,
        contributionId: 'cnt_456',
        contributionTitle: 'Fomba fanao',
        category: 'traditions',
        feedbackReason: 'Doublon avec une entrée existante',
      };

      const result = await service.dispatchNotificationEvent(event);

      expect(result.success).toBe(true);
      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: contributor.id,
          category: 'community',
          messageFr: expect.stringContaining(
            'Doublon avec une entrée existante',
          ),
        }),
      );
      expect(
        mockResendService.sendContributionStatusUpdateEmail,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          to: contributor.email,
          status: 'REJECTED',
          feedbackReason: 'Doublon avec une entrée existante',
        }),
      );
    });
  });

  describe('dispatchNotificationEvent - Social & Sécurité', () => {
    const socialUser = {
      id: 'social_user_1',
      email: 'social@kanto.mg',
      name: 'Soa',
      tier: 'FREE',
      tierExpiresAt: null,
      pushToken: 'ExponentPushToken[social]',
    };

    beforeEach(() => {
      mockPrisma.user.findUnique.mockResolvedValue(socialUser);
    });

    it('doit respecter les préférences si socialActivity est désactivé', async () => {
      mockNotificationsService.getUserPreferences.mockResolvedValueOnce({
        socialActivity: false,
        emailNotifications: false,
        pushNotifications: false,
      });

      const event: NotificationEvent = {
        type: 'FRIEND_REQUEST_RECEIVED',
        recipientUserId: socialUser.id,
        senderUserId: 'other_user',
        senderName: 'Rakoto',
      };

      const result = await service.dispatchNotificationEvent(event);

      expect(result.success).toBe(true);
      expect(
        mockNotificationsService.createNotification,
      ).not.toHaveBeenCalled();
    });

    it('doit envoyer l’e-mail officiel de suspension USER_BANNED', async () => {
      const event: NotificationEvent = {
        type: 'USER_BANNED',
        recipientUserId: socialUser.id,
        reason: 'Violation grave des conditions d’utilisation (spam)',
      };

      const result = await service.dispatchNotificationEvent(event);

      expect(result.success).toBe(true);
      expect(mockResendService.sendUserBannedEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: socialUser.email,
          reason: 'Violation grave des conditions d’utilisation (spam)',
        }),
      );
    });
  });

  describe('dispatchNotificationEvent - Résilience aux pannes externes', () => {
    it('ne doit JAMAIS échouer si Resend rejette une erreur', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user_resilient',
        email: 'resilient@kanto.mg',
        name: 'User Resilient',
        tier: 'VIP',
        tierExpiresAt: null,
        pushToken: null,
      });

      // Simulation d'une panne réseau Resend
      mockResendService.sendVipGrantedEmail.mockRejectedValueOnce(
        new Error('Resend 503 Service Unavailable'),
      );

      const event: NotificationEvent = {
        type: 'USER_VIP_GRANTED',
        recipientUserId: 'user_resilient',
        durationDays: 30,
      };

      const result = await service.dispatchNotificationEvent(event);

      // Le résultat global doit rester true : l'in-app a été créé, et l'erreur d'e-mail a été absorbée
      expect(result.success).toBe(true);
      expect(mockNotificationsService.createNotification).toHaveBeenCalled();
    });
  });
});
