import { jest } from '@jest/globals';

/**
 * Factory de mock Prisma réutilisable pour les tests unitaires.
 *
 * Fournit un objet mock complet avec toutes les méthodes des modèles utilisés
 * dans l'application. Chaque méthode est un jest.fn() prêt à être configuré.
 *
 * Usage :
 *   const prismaMock = createPrismaMock();
 *   prismaMock.user.findUnique.mockResolvedValue({ id: '1', name: 'Test' });
 */

export type AsyncMockFn = jest.Mock<(...args: any[]) => Promise<any>>;

export type DeepMockModel = {
  findUnique: AsyncMockFn;
  findMany: AsyncMockFn;
  findFirst: AsyncMockFn;
  create: AsyncMockFn;
  update: AsyncMockFn;
  upsert: AsyncMockFn;
  delete: AsyncMockFn;
  deleteMany: AsyncMockFn;
  count: AsyncMockFn;
  updateMany: AsyncMockFn;
};

function createModelMock(): DeepMockModel {
  return {
    findUnique: jest.fn<(...args: any[]) => Promise<any>>(),
    findMany: jest.fn<(...args: any[]) => Promise<any>>(),
    findFirst: jest.fn<(...args: any[]) => Promise<any>>(),
    create: jest.fn<(...args: any[]) => Promise<any>>(),
    update: jest.fn<(...args: any[]) => Promise<any>>(),
    upsert: jest.fn<(...args: any[]) => Promise<any>>(),
    delete: jest.fn<(...args: any[]) => Promise<any>>(),
    deleteMany: jest.fn<(...args: any[]) => Promise<any>>(),
    count: jest.fn<(...args: any[]) => Promise<any>>(),
    updateMany: jest.fn<(...args: any[]) => Promise<any>>(),
  };
}

export function createPrismaMock() {
  const mock = {
    // Auth / Users
    user: createModelMock(),
    session: createModelMock(),
    account: createModelMock(),

    // Progression
    userProgress: createModelMock(),
    xpTransaction: createModelMock(),
    gameProgression: createModelMock(),

    // Jeux
    riddleQuestion: createModelMock(),
    riddleSession: createModelMock(),
    riddleAnswer: createModelMock(),
    trueFalseQuestion: createModelMock(),
    trueFalseSession: createModelMock(),
    trueFalseAnswer: createModelMock(),
    trueFalseGameProgress: createModelMock(),

    // Contenu culturel
    item: createModelMock(),
    citation: createModelMock(),
    conte: createModelMock(),
    kabary: createModelMock(),
    poesie: createModelMock(),
    recitation: createModelMock(),
    civicContent: createModelMock(),
    civicQuizQuestion: createModelMock(),
    civicQuizSession: createModelMock(),
    civicQuizAnswer: createModelMock(),

    // Interactions
    like: createModelMock(),
    favorite: createModelMock(),
    contribution: createModelMock(),

    // Badges
    badge: createModelMock(),
    userBadge: createModelMock(),

    // Leaderboard / Duel / UGC
    duelPlayer: createModelMock(),
    duelSession: createModelMock(),
    duelAnswer: createModelMock(),
    userQuizSet: createModelMock(),
    userQuestion: createModelMock(),

    // Vintana
    vintanaSign: createModelMock(),
    vintanaForecast: createModelMock(),

    // Misc
    theme: createModelMock(),
    lock: createModelMock(),
    notification: createModelMock(),
    contributionAuditLog: createModelMock(),
    contentReport: createModelMock(),

    // Transactions Prisma
    $transaction: jest.fn<(...args: any[]) => Promise<any>>(),
    $connect: jest.fn<(...args: any[]) => Promise<any>>(),
    $disconnect: jest.fn<(...args: any[]) => Promise<any>>(),
  };

  mock.$transaction.mockImplementation((fnOrArray: any) => {
    if (typeof fnOrArray === 'function') {
      return fnOrArray(mock);
    }
    return Promise.all(fnOrArray);
  });

  return mock;
}

export type PrismaMock = ReturnType<typeof createPrismaMock>;
