import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ReferralController } from './referral.controller.js';
import { ReferralService } from './referral.service.js';
import { AuthGuard } from '../auth/index.js';

const authGuardMock = {
  canActivate: jest.fn(() => true),
};

describe('ReferralController', () => {
  let controller: ReferralController;
  let service: any;

  const mockSession = {
    user: { id: 'user_test', email: 'test@kanto.mg', role: 'USER' },
    session: { id: 's_test' },
  } as any;

  beforeEach(async () => {
    service = {
      getUserReferralStats: jest.fn().mockResolvedValue({ code: 'KANTO-TEST' }),
      claimReferral: jest.fn().mockResolvedValue({ success: true }),
      trackClick: jest.fn().mockResolvedValue({ success: true, clicksCount: 1 }),
      completeReferral: jest.fn().mockResolvedValue({ completed: true }),
      getAdminOverview: jest.fn().mockResolvedValue({ metrics: {} }),
      getAdminReferralsList: jest.fn().mockResolvedValue({ items: [], pagination: {} }),
      getOrCreateConfig: jest.fn().mockResolvedValue({ isEnabled: true }),
      updateAdminConfig: jest.fn().mockResolvedValue({ isEnabled: true }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferralController],
      providers: [{ provide: ReferralService, useValue: service }],
    })
      .overrideGuard(AuthGuard)
      .useValue(authGuardMock)
      .compile();

    controller = module.get<ReferralController>(ReferralController);
  });

  it('getMyReferralStats appelle service.getUserReferralStats avec le userId connecté', async () => {
    const res = await controller.getMyReferralStats(mockSession);
    expect(service.getUserReferralStats).toHaveBeenCalledWith('user_test');
    expect(res).toEqual({ code: 'KANTO-TEST' });
  });

  it('claimReferral transmet le code et l’adresse IP', async () => {
    await controller.claimReferral(mockSession, { code: 'KANTO-FRIEND' }, '192.168.1.50', 'TestAgent');
    expect(service.claimReferral).toHaveBeenCalledWith('user_test', 'KANTO-FRIEND', '192.168.1.50', 'TestAgent');
  });

  it('trackClick incrémente les clics pour un code', async () => {
    const res = await controller.trackClick('KANTO-SHARE');
    expect(service.trackClick).toHaveBeenCalledWith('KANTO-SHARE');
    expect(res).toEqual({ success: true, clicksCount: 1 });
  });

  it('triggerActivation appelle service.completeReferral', async () => {
    const res = await controller.triggerActivation(mockSession);
    expect(service.completeReferral).toHaveBeenCalledWith('user_test');
    expect(res).toEqual({ completed: true });
  });

  it('getAdminOverview est accessible et appelle le service', async () => {
    const res = await controller.getAdminOverview();
    expect(service.getAdminOverview).toHaveBeenCalled();
    expect(res).toEqual({ metrics: {} });
  });
});
