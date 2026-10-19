import { jest } from '@jest/globals';
import { VipExpirationScheduler } from './vip-expiration.scheduler.js';

describe('VipExpirationScheduler', () => {
  let scheduler: VipExpirationScheduler;
  let mockPrisma: any;
  let mockRedis: any;
  let mockEventNotificationService: any;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findMany: jest.fn(),
        update: jest.fn(),
      },
      adminAuditLog: {
        create: jest.fn(),
      },
    };

    mockRedis = {
      get: (jest.fn as any)().mockResolvedValue(null),
      set: (jest.fn as any)().mockResolvedValue('OK'),
      del: (jest.fn as any)().mockResolvedValue(1),
    };

    mockEventNotificationService = {
      dispatchNotificationEvent: (jest.fn as any)().mockResolvedValue({
        success: true,
      }),
    };

    scheduler = new VipExpirationScheduler(
      mockPrisma,
      mockRedis,
      mockEventNotificationService,
    );
  });

  describe('handleDailyCron', () => {
    it('doit acquérir le verrou Redis, exécuter la routine et libérer le verrou', async () => {
      mockRedis.set.mockResolvedValueOnce('OK'); // Verrou acquis
      mockPrisma.user.findMany
        .mockResolvedValueOnce([]) // Expiring soon
        .mockResolvedValueOnce([]); // Expired

      await scheduler.handleDailyCron();

      expect(mockRedis.set).toHaveBeenCalledWith(
        'scheduler_lock:vip_expiration',
        'locked',
        1800,
      );
      expect(mockPrisma.user.findMany).toHaveBeenCalledTimes(2);
      expect(mockRedis.del).toHaveBeenCalledWith(
        'scheduler_lock:vip_expiration',
      );
    });

    it('ne doit rien exécuter si le verrou Redis ne peut pas être acquis (autre worker en cours)', async () => {
      mockRedis.set.mockResolvedValueOnce(null); // Verrou non acquis

      await scheduler.handleDailyCron();

      expect(mockPrisma.user.findMany).not.toHaveBeenCalled();
      expect(mockRedis.del).not.toHaveBeenCalled();
    });
  });

  describe('runVipExpirationRoutine - checkExpiringVips (Rappel J-3)', () => {
    it('doit envoyer une alerte J-3 pour les VIP proches de l’échéance et marquer Redis', async () => {
      const now = new Date();
      const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

      const expiringUser = {
        id: 'user_expiring_1',
        email: 'expiring@kanto.mg',
        name: 'Jean Expiring',
        tierExpiresAt: inTwoDays,
      };

      mockPrisma.user.findMany
        .mockResolvedValueOnce([expiringUser]) // checkExpiringVips
        .mockResolvedValueOnce([]); // processExpiredVips

      const result = await scheduler.runVipExpirationRoutine();

      expect(result.expiringSoonCount).toBe(1);
      expect(
        mockEventNotificationService.dispatchNotificationEvent,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'USER_VIP_EXPIRING_SOON',
          recipientUserId: expiringUser.id,
          expiresAt: inTwoDays,
        }),
      );

      // Vérifie l'anti-doublon Redis posé pour 72h
      const today = now.toISOString().split('T')[0];
      expect(mockRedis.set).toHaveBeenCalledWith(
        `vip_reminder_sent:${expiringUser.id}:${today}`,
        '1',
        72 * 3600,
      );
    });

    it('ne doit pas renvoyer de rappel si le marqueur Redis de rappel existe déjà', async () => {
      const now = new Date();
      const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

      const expiringUser = {
        id: 'user_expiring_2',
        email: 'expiring2@kanto.mg',
        name: 'Jean Expiring 2',
        tierExpiresAt: inTwoDays,
      };

      mockPrisma.user.findMany
        .mockResolvedValueOnce([expiringUser]) // checkExpiringVips
        .mockResolvedValueOnce([]); // processExpiredVips

      // Simule que le rappel a déjà été envoyé aujourd'hui
      mockRedis.get.mockResolvedValueOnce('1');

      const result = await scheduler.runVipExpirationRoutine();

      expect(result.expiringSoonCount).toBe(0);
      expect(
        mockEventNotificationService.dispatchNotificationEvent,
      ).not.toHaveBeenCalled();
    });
  });

  describe('runVipExpirationRoutine - processExpiredVips (Rétrogradation J-0)', () => {
    it('doit rétrograder les VIP échus à FREE, enregistrer l’audit log et notifier l’utilisateur', async () => {
      const pastDate = new Date(Date.now() - 3600 * 1000);

      const expiredUser = {
        id: 'user_expired_1',
        email: 'expired@kanto.mg',
        name: 'Paul Expired',
        tierExpiresAt: pastDate,
      };

      mockPrisma.user.findMany
        .mockResolvedValueOnce([]) // checkExpiringVips
        .mockResolvedValueOnce([expiredUser]); // processExpiredVips

      mockPrisma.user.update.mockResolvedValueOnce({
        ...expiredUser,
        tier: 'FREE',
        tierExpiresAt: null,
      });

      mockPrisma.adminAuditLog.create.mockResolvedValueOnce({
        id: 'audit_log_1',
      });

      const result = await scheduler.runVipExpirationRoutine();

      expect(result.expiredCount).toBe(1);

      // Vérifie la mise à jour BDD
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: expiredUser.id },
        data: {
          tier: 'FREE',
          tierExpiresAt: null,
        },
      });

      // Vérifie la journalisation d'audit
      expect(mockPrisma.adminAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'SYSTEM',
          action: 'USER_TIER_EXPIRED',
          targetId: expiredUser.id,
          details: expect.objectContaining({
            previousTier: 'VIP',
            newTier: 'FREE',
          }),
        }),
      });

      // Vérifie la notification d'expiration
      expect(
        mockEventNotificationService.dispatchNotificationEvent,
      ).toHaveBeenCalledWith({
        type: 'USER_VIP_EXPIRED',
        recipientUserId: expiredUser.id,
      });
    });

    it('doit continuer le traitement des autres comptes si la mise à jour d’un compte échoue', async () => {
      const pastDate = new Date(Date.now() - 3600 * 1000);

      const userFail = {
        id: 'user_fail',
        email: 'fail@kanto.mg',
        tierExpiresAt: pastDate,
      };
      const userSuccess = {
        id: 'user_ok',
        email: 'ok@kanto.mg',
        tierExpiresAt: pastDate,
      };

      mockPrisma.user.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([userFail, userSuccess]);

      mockPrisma.user.update
        .mockRejectedValueOnce(new Error('DB Lock Timeout'))
        .mockResolvedValueOnce({
          ...userSuccess,
          tier: 'FREE',
          tierExpiresAt: null,
        });

      const result = await scheduler.runVipExpirationRoutine();

      expect(result.expiredCount).toBe(1); // userSuccess a bien été traité malgré l'échec de userFail
      expect(mockPrisma.user.update).toHaveBeenCalledTimes(2);
    });
  });
});
