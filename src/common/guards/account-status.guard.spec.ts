import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AccountStatusGuard } from './account-status.guard.js';

describe('AccountStatusGuard', () => {
  let guard: AccountStatusGuard;
  let prismaMock: any;
  let redisMock: any;

  beforeEach(() => {
    prismaMock = {
      user: {
        findUnique: jest.fn(),
      },
    };
    redisMock = {
      getJson: jest.fn().mockResolvedValue(null),
      setJson: jest.fn().mockResolvedValue(true),
    };
    guard = new AccountStatusGuard(prismaMock, redisMock);
  });

  const createMockContext = (user?: any): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext;
  };

  it('laisse passer les requêtes sans utilisateur identifié (routes publiques)', async () => {
    const ctx = createMockContext(undefined);
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
  });

  it('laisse passer un utilisateur au statut ACTIVE et non banni', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'u-1',
      banned: false,
      status: 'ACTIVE',
      suspendedUntil: null,
    });

    const ctx = createMockContext({ id: 'u-1' });
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(redisMock.setJson).toHaveBeenCalled();
  });

  it('bloque un utilisateur banni avec code ACCOUNT_BANNED', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'u-banned',
      banned: true,
      status: 'ACTIVE',
    });

    const ctx = createMockContext({ id: 'u-banned' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('bloque un utilisateur temporairement suspendu', async () => {
    const futureDate = new Date(Date.now() + 86400000);
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'u-suspended',
      banned: false,
      status: 'SUSPENDED',
      suspendedUntil: futureDate,
    });

    const ctx = createMockContext({ id: 'u-suspended' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('utilise le statut en cache Redis s’il est disponible sans appeler Prisma', async () => {
    redisMock.getJson.mockResolvedValue({
      banned: false,
      status: 'ACTIVE',
      suspendedUntil: null,
    });

    const ctx = createMockContext({ id: 'u-cached' });
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });
});
