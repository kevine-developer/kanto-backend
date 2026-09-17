import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { AuthGuard } from '../auth/index.js';
import {
  buildUser,
  buildUserSession,
} from '../test-utils/builders/user.builder.js';

/**
 * Guard mock qui laisse toujours passer les requêtes dans le contexte de test.
 * Remplace l'AuthGuard de Better Auth qui nécessite des dépendances complexes.
 */
const authGuardMock = {
  canActivate: jest.fn(() => true),
};

describe('UsersController', () => {
  let controller: UsersController;
  let usersServiceMock: {
    getMyStats: jest.Mock<(...args: any[]) => Promise<any>>;
    updateMe: jest.Mock<(...args: any[]) => Promise<any>>;
    getMyFavorites: jest.Mock<(...args: any[]) => Promise<any>>;
    uploadAvatar: jest.Mock<(...args: any[]) => Promise<any>>;
    deleteAvatar: jest.Mock<(...args: any[]) => Promise<any>>;
  };

  beforeEach(async () => {
    usersServiceMock = {
      getMyStats: jest.fn<(...args: any[]) => Promise<any>>(),
      updateMe: jest.fn<(...args: any[]) => Promise<any>>(),
      getMyFavorites: jest.fn<(...args: any[]) => Promise<any>>(),
      uploadAvatar: jest.fn<(...args: any[]) => Promise<any>>(),
      deleteAvatar: jest.fn<(...args: any[]) => Promise<any>>(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersServiceMock }],
    })
      .overrideGuard(AuthGuard)
      .useValue(authGuardMock)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // getMyStats
  // ─────────────────────────────────────────────────────────────────────────

  describe('getMyStats', () => {
    it('should call usersService.getMyStats with the session user id', async () => {
      const user = buildUser({ id: 'user-42' });
      const { session } = buildUserSession(user);
      const expectedStats = {
        user,
        stats: { level: 5, totalXp: 500, accuracy: 80 },
      };

      usersServiceMock.getMyStats.mockResolvedValue(expectedStats);

      const result = await controller.getMyStats({ user, session } as any);

      expect(usersServiceMock.getMyStats).toHaveBeenCalledWith('user-42');
      expect(result).toBe(expectedStats);
    });

    it('should propagate the result from the service unchanged', async () => {
      const user = buildUser({ id: 'user-1' });
      const response = { user, stats: { gamesPlayed: 10, accuracy: 75 } };
      usersServiceMock.getMyStats.mockResolvedValue(response);

      const result = await controller.getMyStats({ user, session: {} } as any);

      expect(result).toBe(response);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // updateMe
  // ─────────────────────────────────────────────────────────────────────────

  describe('updateMe', () => {
    it('should call usersService.updateMe with userId and DTO', async () => {
      const user = buildUser({ id: 'user-10' });
      const dto = { name: 'Nouveau Nom' };
      const expected = { success: true, user };

      usersServiceMock.updateMe.mockResolvedValue(expected);

      const result = await controller.updateMe(dto, {
        user,
        session: {},
      } as any);

      expect(usersServiceMock.updateMe).toHaveBeenCalledWith('user-10', dto);
      expect(result).toBe(expected);
    });

    it('should propagate the result from the service', async () => {
      const user = buildUser({ id: 'user-11' });
      const response = { success: true, user };
      usersServiceMock.updateMe.mockResolvedValue(response);

      const result = await controller.updateMe({ name: 'Test' }, {
        user,
        session: {},
      } as any);

      expect(result).toBe(response);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // getMyFavorites
  // ─────────────────────────────────────────────────────────────────────────

  describe('getMyFavorites', () => {
    it('should call usersService.getMyFavorites with the session user id', async () => {
      const user = buildUser({ id: 'user-fav' });
      const favorites = [{ id: 'fav-1' }, { id: 'fav-2' }];
      usersServiceMock.getMyFavorites.mockResolvedValue(favorites);

      const result = await controller.getMyFavorites({
        user,
        session: {},
      } as any);

      expect(usersServiceMock.getMyFavorites).toHaveBeenCalledWith('user-fav');
      expect(result).toBe(favorites);
    });

    it('should return empty array when user has no favorites', async () => {
      const user = buildUser({ id: 'user-no-fav' });
      usersServiceMock.getMyFavorites.mockResolvedValue([]);

      const result = await controller.getMyFavorites({
        user,
        session: {},
      } as any);

      expect(result).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // uploadAvatar
  // ─────────────────────────────────────────────────────────────────────────

  describe('uploadAvatar', () => {
    it('should call usersService.uploadAvatar with session userId and body payload', async () => {
      const user = buildUser({ id: 'user-1' });
      const { session } = buildUserSession(user);
      const payload = {
        imageBase64: 'data:image/png;base64,abc',
        fileName: 'profile.png',
      };
      const expectedResponse = {
        success: true,
        url: 'https://cloudinary.com/avatar.png',
        user: { ...user, image: 'https://cloudinary.com/avatar.png' },
      };

      usersServiceMock.uploadAvatar.mockResolvedValue(expectedResponse);

      const result = await controller.uploadAvatar(payload, {
        user,
        session,
      } as any);

      expect(usersServiceMock.uploadAvatar).toHaveBeenCalledWith(
        'user-1',
        payload.imageBase64,
        payload.fileName,
      );
      expect(result).toBe(expectedResponse);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // deleteAvatar
  // ─────────────────────────────────────────────────────────────────────────

  describe('deleteAvatar', () => {
    it('should call usersService.deleteAvatar with session userId', async () => {
      const user = buildUser({ id: 'user-1', image: 'https://avatar.png' });
      const { session } = buildUserSession(user);
      const expectedResponse = {
        success: true,
        user: { ...user, image: null },
      };

      usersServiceMock.deleteAvatar.mockResolvedValue(expectedResponse);

      const result = await controller.deleteAvatar({
        user,
        session,
      } as any);

      expect(usersServiceMock.deleteAvatar).toHaveBeenCalledWith('user-1');
      expect(result).toBe(expectedResponse);
    });
  });
});
