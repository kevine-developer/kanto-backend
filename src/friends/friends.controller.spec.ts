import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { FriendsController } from './friends.controller.js';
import { FriendsService } from './friends.service.js';
import { AuthGuard } from '../auth/index.js';

const authGuardMock = {
  canActivate: jest.fn(() => true),
};

describe('FriendsController', () => {
  let controller: FriendsController;
  let service: jest.Mocked<FriendsService>;

  const mockSession = {
    user: { id: 'u1', email: 'u1@kanto.mg', role: 'USER' },
    session: { id: 's1' },
  } as any;

  const mockFriendsService = {
    getFriends: jest.fn(),
    getRequests: jest.fn(),
    searchUsers: jest.fn(),
    getFriendshipStatus: jest.fn(),
    canEncourage: jest.fn(),
    sendFriendRequest: jest.fn(),
    acceptFriendRequest: jest.fn(),
    rejectFriendRequest: jest.fn(),
    cancelFriendRequest: jest.fn(),
    removeFriend: jest.fn(),
    encourageUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendsController],
      providers: [{ provide: FriendsService, useValue: mockFriendsService }],
    })
      .overrideGuard(AuthGuard)
      .useValue(authGuardMock)
      .compile();

    controller = module.get<FriendsController>(FriendsController);
    service = module.get(FriendsService);
  });

  it('getFriends appelle service.getFriends avec le userId connecté', async () => {
    mockFriendsService.getFriends.mockResolvedValue([]);
    await controller.getFriends(mockSession);
    expect(service.getFriends).toHaveBeenCalledWith('u1');
  });

  it('sendFriendRequest appelle service.sendFriendRequest', async () => {
    mockFriendsService.sendFriendRequest.mockResolvedValue({ success: true });
    await controller.sendFriendRequest('u2', mockSession);
    expect(service.sendFriendRequest).toHaveBeenCalledWith('u1', 'u2');
  });

  it('acceptFriendRequest appelle service.acceptFriendRequest', async () => {
    mockFriendsService.acceptFriendRequest.mockResolvedValue({ success: true });
    await controller.acceptFriendRequest('req1', mockSession);
    expect(service.acceptFriendRequest).toHaveBeenCalledWith('u1', 'req1');
  });

  it('rejectFriendRequest appelle service.rejectFriendRequest', async () => {
    mockFriendsService.rejectFriendRequest.mockResolvedValue({ success: true });
    await controller.rejectFriendRequest('req1', mockSession);
    expect(service.rejectFriendRequest).toHaveBeenCalledWith('u1', 'req1');
  });

  it('encourageUser appelle service.encourageUser (+1 XP)', async () => {
    mockFriendsService.encourageUser.mockResolvedValue({
      success: true,
      xpEarned: 1,
    });
    const res = await controller.encourageUser('u2', mockSession);
    expect(service.encourageUser).toHaveBeenCalledWith('u1', 'u2');
    expect(res.xpEarned).toBe(1);
  });
});
