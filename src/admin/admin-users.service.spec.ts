import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service.js';

describe('AdminUsersService - updateTier', () => {
  let service: AdminUsersService;
  let prismaMock: any;
  let auditServiceMock: any;

  beforeEach(() => {
    prismaMock = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
      },
    };

    auditServiceMock = {
      logAction: jest
        .fn()
        .mockImplementation(() => Promise.resolve({ id: 'audit_1' })),
    };

    service = new AdminUsersService(prismaMock, auditServiceMock);
  });

  it('doit refuser une valeur de tier inconnue', async () => {
    await expect(
      service.updateTier('user_1', 'INVALID_TIER', 'admin_1'),
    ).rejects.toThrow(BadRequestException);
  });

  it('doit lever NotFoundException si l utilisateur n existe pas', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    await expect(
      service.updateTier('non_existent', 'VIP', 'admin_1'),
    ).rejects.toThrow(NotFoundException);
  });

  it('doit attribuer le statut VIP et consigner la désactivation des publicités dans le journal d audit', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'user_1',
      name: 'Rasoa',
      email: 'rasoa@kanto.mg',
      role: 'USER',
      tier: 'FREE',
    });

    prismaMock.user.update.mockResolvedValueOnce({
      id: 'user_1',
      name: 'Rasoa',
      email: 'rasoa@kanto.mg',
      role: 'USER',
      tier: 'VIP',
    });

    const result = await service.updateTier('user_1', 'VIP', 'admin_1');

    expect(result.success).toBe(true);
    expect(result.message).toContain('publicités sont désactivées');
    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user_1' },
        data: { tier: 'VIP' },
      }),
    );
    expect(auditServiceMock.logAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'USER_TIER_CHANGED',
        userId: 'admin_1',
        targetId: 'user_1',
        details: expect.objectContaining({
          previousTier: 'FREE',
          newTier: 'VIP',
          adsDisabled: true,
        }),
      }),
    );
  });

  it('doit permettre de rétrograder un compte VIP vers FREE et réactiver les publicités', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'user_2',
      name: 'Rakoto',
      email: 'rakoto@kanto.mg',
      role: 'USER',
      tier: 'VIP',
    });

    prismaMock.user.update.mockResolvedValueOnce({
      id: 'user_2',
      name: 'Rakoto',
      email: 'rakoto@kanto.mg',
      role: 'USER',
      tier: 'FREE',
    });

    const result = await service.updateTier('user_2', 'FREE', 'admin_1');

    expect(result.success).toBe(true);
    expect(result.message).toContain('publicités standard sont actives');
    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user_2' },
        data: { tier: 'FREE' },
      }),
    );
  });
});
