import { jest } from '@jest/globals';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function buildGuard(
  roles: string[] | undefined,
  user?: { id: string; role: string },
) {
  const reflector = {
    getAllAndOverride: jest.fn().mockReturnValue(roles),
  } as unknown as Reflector;

  const guard = new RolesGuard(reflector);

  const request = { user };
  const mockContext = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;

  return { guard, mockContext };
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('RolesGuard', () => {
  describe('when no roles are required on the route', () => {
    it('should return true and allow access (public route)', () => {
      const { guard, mockContext } = buildGuard(undefined);
      expect(guard.canActivate(mockContext)).toBe(true);
    });

    it('should return true when roles is an empty array', () => {
      const { guard, mockContext } = buildGuard([]);
      expect(guard.canActivate(mockContext)).toBe(true);
    });
  });

  describe('when roles are required and user is missing', () => {
    it('should throw ForbiddenException when user is undefined in request', () => {
      const { guard, mockContext } = buildGuard(['ADMIN'], undefined);
      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException with meaningful message when user is absent', () => {
      const { guard, mockContext } = buildGuard(['ADMIN'], undefined);
      try {
        guard.canActivate(mockContext);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenException);
        expect((err as ForbiddenException).message).toContain(
          'non authentifié',
        );
      }
    });
  });

  describe('when user has the required role', () => {
    it('should return true when user role matches required role', () => {
      const { guard, mockContext } = buildGuard(['ADMIN'], {
        id: 'u1',
        role: 'ADMIN',
      });
      expect(guard.canActivate(mockContext)).toBe(true);
    });

    it('should return true when user role matches one of multiple required roles', () => {
      const { guard, mockContext } = buildGuard(['ADMIN', 'MODERATOR'], {
        id: 'u1',
        role: 'MODERATOR',
      });
      expect(guard.canActivate(mockContext)).toBe(true);
    });

    it('should return true for USER role accessing USER-restricted route', () => {
      const { guard, mockContext } = buildGuard(['USER'], {
        id: 'u1',
        role: 'USER',
      });
      expect(guard.canActivate(mockContext)).toBe(true);
    });
  });

  describe('when user does not have the required role', () => {
    it('should throw ForbiddenException when USER tries to access ADMIN route', () => {
      const { guard, mockContext } = buildGuard(['ADMIN'], {
        id: 'u1',
        role: 'USER',
      });
      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });

    it('should include required role in the error message', () => {
      const { guard, mockContext } = buildGuard(['ADMIN'], {
        id: 'u1',
        role: 'USER',
      });
      try {
        guard.canActivate(mockContext);
      } catch (err) {
        expect((err as ForbiddenException).message).toContain('ADMIN');
      }
    });

    it('should throw ForbiddenException when role is undefined on user object', () => {
      const { guard, mockContext } = buildGuard(['ADMIN'], {
        id: 'u1',
        role: undefined as any,
      });
      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });
  });

  describe('role case sensitivity', () => {
    it('should reject "admin" (lowercase) when "ADMIN" (uppercase) is required', () => {
      // Le guard utilise une comparaison stricte === : la casse compte
      const { guard, mockContext } = buildGuard(['ADMIN'], {
        id: 'u1',
        role: 'admin',
      });
      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });

    it('should not grant ADMIN access with role "Admin" (mixed case)', () => {
      const { guard, mockContext } = buildGuard(['ADMIN'], {
        id: 'u1',
        role: 'Admin',
      });
      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });
  });

  describe('multiple required roles', () => {
    it('should throw when user role does not match any required role', () => {
      const { guard, mockContext } = buildGuard(['ADMIN', 'MODERATOR'], {
        id: 'u1',
        role: 'USER',
      });
      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });

    it('should list all required roles in the error message', () => {
      const { guard, mockContext } = buildGuard(['ADMIN', 'MODERATOR'], {
        id: 'u1',
        role: 'USER',
      });
      try {
        guard.canActivate(mockContext);
      } catch (err) {
        const message = (err as ForbiddenException).message;
        expect(message).toContain('ADMIN');
        expect(message).toContain('MODERATOR');
      }
    });
  });
});
