/**
 * Builder pattern pour créer des fixtures utilisateur réalistes dans les tests.
 *
 * Usage :
 *   const user = buildUser({ role: 'ADMIN' });
 *   const adminUser = buildUser({ role: 'ADMIN', tier: 'PRO' });
 */

export interface UserFixture {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  tier: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
}

let _idCounter = 1;

export function buildUser(overrides: Partial<UserFixture> = {}): UserFixture {
  return {
    id: `user-${_idCounter++}`,
    name: 'Test Utilisateur',
    email: `test-${_idCounter}@kanto.mg`,
    image: null,
    role: 'USER',
    tier: 'FREE',
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
    emailVerified: true,
    ...overrides,
  };
}

export function buildAdminUser(
  overrides: Partial<UserFixture> = {},
): UserFixture {
  return buildUser({ role: 'ADMIN', ...overrides });
}

export function buildUserSession(user: UserFixture) {
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    },
    session: {
      id: `session-${user.id}`,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  };
}

export function buildUserProgress(
  userId: string,
  overrides: Record<string, any> = {},
) {
  return {
    id: `progress-${userId}`,
    userId,
    totalXp: 0,
    level: 1,
    coins: 0,
    streakDays: 0,
    lastLoginDate: null,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
    ...overrides,
  };
}
