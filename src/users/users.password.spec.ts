import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CloudinaryService } from '../integrations/cloudinary/cloudinary.service.js';
import { ResendService } from '../integrations/resend/resend.service.js';
import {
  createPrismaMock,
  type PrismaMock,
} from '../test-utils/mock-prisma.factory.js';
import { buildUser } from '../test-utils/builders/user.builder.js';

/**
 * Builder minimal pour un Account Better-Auth.
 */
function buildAccount(
  overrides: Partial<{
    id: string;
    providerId: string;
    accountId: string;
    userId: string;
    password: string | null;
  }> = {},
) {
  return {
    id: 'account-1',
    providerId: 'credential',
    accountId: 'user-1',
    userId: 'user-1',
    password: '$scrypt$...hashed...',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('UsersService — gestion du mot de passe', () => {
  let service: UsersService;
  let prismaMock: PrismaMock;
  let resendMock: {
    sendSecurityChangeEmail: jest.Mock<any>;
    sendPasswordResetEmail: jest.Mock<any>;
    isConfigured: jest.Mock<any>;
  };
  let cloudinaryMock: {
    isConfigured: jest.Mock<any>;
    validateAndDecodeBase64Image: jest.Mock<any>;
    uploadImageBase64: jest.Mock<any>;
    deleteMediaFromUrl: jest.Mock<any>;
  };

  beforeEach(async () => {
    prismaMock = createPrismaMock();
    cloudinaryMock = {
      isConfigured: jest.fn<any>().mockReturnValue(false),
      validateAndDecodeBase64Image: jest.fn<any>(),
      uploadImageBase64: jest.fn<any>(),
      deleteMediaFromUrl: jest.fn<any>().mockResolvedValue(true),
    };
    resendMock = {
      sendSecurityChangeEmail: jest
        .fn<any>()
        .mockResolvedValue({ simulated: true }),
      sendPasswordResetEmail: jest
        .fn<any>()
        .mockResolvedValue({ simulated: true }),
      isConfigured: jest.fn<any>().mockReturnValue(false),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: CloudinaryService, useValue: cloudinaryMock },
        { provide: ResendService, useValue: resendMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // getAuthMethods
  // ─────────────────────────────────────────────────────────────────────────

  describe('getAuthMethods', () => {
    it('retourne hasPassword=false pour un compte Google uniquement', async () => {
      const user = buildUser({ id: 'user-google' });
      prismaMock.account.findMany.mockResolvedValue([
        buildAccount({ providerId: 'google', userId: user.id }),
      ]);

      const result = await service.getAuthMethods(user.id);

      expect(result.hasPassword).toBe(false);
      expect(result.providers).toContain('google');
      expect(result.providers).not.toContain('credential');
    });

    it('retourne hasPassword=true pour un compte email/mdp', async () => {
      const user = buildUser({ id: 'user-cred' });
      prismaMock.account.findMany.mockResolvedValue([
        buildAccount({ providerId: 'credential', userId: user.id }),
      ]);

      const result = await service.getAuthMethods(user.id);

      expect(result.hasPassword).toBe(true);
      expect(result.providers).toContain('credential');
    });

    it('retourne les deux providers pour un compte Google + mot de passe', async () => {
      const user = buildUser({ id: 'user-both' });
      prismaMock.account.findMany.mockResolvedValue([
        buildAccount({ providerId: 'google', userId: user.id }),
        buildAccount({
          id: 'account-2',
          providerId: 'credential',
          userId: user.id,
        }),
      ]);

      const result = await service.getAuthMethods(user.id);

      expect(result.hasPassword).toBe(true);
      expect(result.providers).toContain('google');
      expect(result.providers).toContain('credential');
    });

    it('retourne providers=[] et hasPassword=false si aucun account', async () => {
      prismaMock.account.findMany.mockResolvedValue([]);

      const result = await service.getAuthMethods('user-empty');

      expect(result.providers).toHaveLength(0);
      expect(result.hasPassword).toBe(false);
    });

    it('est compatible avec des providers OAuth non-Google (Apple, etc.)', async () => {
      prismaMock.account.findMany.mockResolvedValue([
        buildAccount({ providerId: 'apple', userId: 'user-apple' }),
      ]);

      const result = await service.getAuthMethods('user-apple');

      expect(result.hasPassword).toBe(false);
      expect(result.providers).toContain('apple');
    });

    it('normalise automatiquement en base les comptes credential dont issuer !== "local:credential"', async () => {
      const user = buildUser({ id: 'user-legacy' });
      const legacyAccount = buildAccount({
        id: 'acc-legacy',
        providerId: 'credential',
        userId: user.id,
        accountId: user.id,
        password: '$scrypt$...',
        issuer: null,
      });

      prismaMock.account.findMany.mockResolvedValue([legacyAccount]);
      prismaMock.account.update.mockResolvedValue({
        ...legacyAccount,
        issuer: 'local:credential',
      });

      const result = await service.getAuthMethods(user.id);

      expect(result.hasPassword).toBe(true);
      expect(prismaMock.account.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'acc-legacy' },
          data: expect.objectContaining({
            issuer: 'local:credential',
            accountId: user.id,
          }),
        }),
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // addPassword
  // ─────────────────────────────────────────────────────────────────────────

  describe('addPassword', () => {
    it('ajoute un mot de passe avec issuer="local:credential" et accountId=user.id (indispensable pour Better Auth)', async () => {
      const user = buildUser({ id: 'user-oauth' });
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.account.findFirst.mockResolvedValue(null);
      prismaMock.account.create.mockResolvedValue({ id: 'new-account' });

      const result = await service.addPassword(user.id, 'ValidPass1!');

      expect(result.success).toBe(true);
      expect(prismaMock.account.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            providerId: 'credential',
            userId: user.id,
            accountId: user.id,
            issuer: 'local:credential',
          }),
        }),
      );
    });

    it('envoie un email de notification de sécurité après ajout', async () => {
      const user = buildUser({ id: 'user-notify', email: 'notify@kanto.mg' });
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.account.findFirst.mockResolvedValue(null);
      prismaMock.account.create.mockResolvedValue({ id: 'account-new' });

      await service.addPassword(user.id, 'ValidPass1!');

      // Laisser le temps à la promesse non-bloquante de se résoudre
      await new Promise((r) => setTimeout(r, 50));

      expect(resendMock.sendSecurityChangeEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: user.email,
          action: 'added',
        }),
      );
    });

    it('lance ConflictException si le compte possède déjà un mot de passe', async () => {
      const user = buildUser({ id: 'user-has-pw' });
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.account.findFirst.mockResolvedValue(
        buildAccount({ providerId: 'credential', userId: user.id }),
      );

      await expect(service.addPassword(user.id, 'ValidPass1!')).rejects.toThrow(
        ConflictException,
      );

      // Aucun nouveau compte ne doit être créé
      expect(prismaMock.account.create).not.toHaveBeenCalled();
    });

    it("lance NotFoundException si l'utilisateur n'existe pas", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.addPassword('unknown-user', 'ValidPass1!'),
      ).rejects.toThrow(NotFoundException);
    });

    it('une double soumission ne crée pas de données incohérentes (idempotence)', async () => {
      const user = buildUser({ id: 'user-idempotent' });
      prismaMock.user.findUnique.mockResolvedValue(user);

      // Première tentative : aucun credential
      prismaMock.account.findFirst.mockResolvedValueOnce(null);
      prismaMock.account.create.mockResolvedValueOnce({
        id: 'account-created',
      });
      await service.addPassword(user.id, 'ValidPass1!');

      // Deuxième tentative : credential existe désormais
      prismaMock.account.findFirst.mockResolvedValueOnce(
        buildAccount({ providerId: 'credential', userId: user.id }),
      );

      await expect(service.addPassword(user.id, 'ValidPass1!')).rejects.toThrow(
        ConflictException,
      );

      // Un seul create() au total
      expect(prismaMock.account.create).toHaveBeenCalledTimes(1);
    });

    it("l'ajout d'un mot de passe ne supprime pas les autres méthodes d'auth", async () => {
      const user = buildUser({ id: 'user-preserve-google' });
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.account.findFirst.mockResolvedValue(null);
      prismaMock.account.create.mockResolvedValue({ id: 'new-cred' });

      await service.addPassword(user.id, 'ValidPass1!');

      // account.deleteMany ne doit JAMAIS être appelé
      expect(prismaMock.account.deleteMany).not.toHaveBeenCalled();
      expect(prismaMock.account.delete).not.toHaveBeenCalled();
    });

    it("les comptes utilisant d'autres providers OAuth restent fonctionnels", async () => {
      const user = buildUser({ id: 'user-apple' });
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.account.findFirst.mockResolvedValue(null);
      prismaMock.account.create.mockResolvedValue({ id: 'cred-added' });

      // Un utilisateur Apple peut aussi ajouter un mot de passe
      const result = await service.addPassword(user.id, 'ValidPass1!');
      expect(result.success).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // changePassword
  // ─────────────────────────────────────────────────────────────────────────

  describe('changePassword', () => {
    it('modifie avec succès un mot de passe existant après vérification de l ancien mot de passe', async () => {
      const { hashPassword } = await import('better-auth/crypto');
      const oldPassword = 'CurrentPass1!';
      const newPassword = 'BrandNewPass2@';
      const oldHash = await hashPassword(oldPassword);

      const user = buildUser({ id: 'user-change-pw', email: 'change@kanto.mg' });
      const credentialAccount = buildAccount({
        id: 'account-change',
        providerId: 'credential',
        userId: user.id,
        accountId: user.id,
        password: oldHash,
        issuer: 'local:credential',
      });

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.account.findFirst.mockResolvedValue(credentialAccount);
      prismaMock.account.update.mockResolvedValue({ ...credentialAccount, id: 'account-change' });

      const result = await service.changePassword(user.id, oldPassword, newPassword, false);

      expect(result.success).toBe(true);
      expect(prismaMock.account.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'account-change' },
          data: expect.objectContaining({
            issuer: 'local:credential',
            accountId: user.id,
          }),
        }),
      );

      // Email de notification de modification
      await new Promise((r) => setTimeout(r, 50));
      expect(resendMock.sendSecurityChangeEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: user.email,
          action: 'changed',
        }),
      );
    });

    it('refuse la modification si l ancien mot de passe est incorrect', async () => {
      const { hashPassword } = await import('better-auth/crypto');
      const oldHash = await hashPassword('CorrectPass1!');

      const user = buildUser({ id: 'user-wrong-pw' });
      const credentialAccount = buildAccount({
        id: 'account-wrong',
        providerId: 'credential',
        userId: user.id,
        password: oldHash,
      });

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.account.findFirst.mockResolvedValue(credentialAccount);

      await expect(
        service.changePassword(user.id, 'WrongPass123!', 'NewValidPass1@', false),
      ).rejects.toThrow();

      expect(prismaMock.account.update).not.toHaveBeenCalled();
    });

    it('révoque les autres sessions de l utilisateur si demandé', async () => {
      const { hashPassword } = await import('better-auth/crypto');
      const oldHash = await hashPassword('CurrentPass1!');

      const user = buildUser({ id: 'user-revoke-sessions' });
      const credentialAccount = buildAccount({
        id: 'account-rev',
        userId: user.id,
        password: oldHash,
      });

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.account.findFirst.mockResolvedValue(credentialAccount);
      prismaMock.account.update.mockResolvedValue(credentialAccount);
      prismaMock.session.deleteMany.mockResolvedValue({ count: 2 });

      const result = await service.changePassword(user.id, 'CurrentPass1!', 'NewPass1@', true);

      expect(result.success).toBe(true);
      expect(prismaMock.session.deleteMany).toHaveBeenCalledWith({
        where: { userId: user.id },
      });
    });

    it('rejette la modification si le compte ne possède pas encore de mot de passe', async () => {
      const user = buildUser({ id: 'user-oauth-only' });
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.account.findFirst.mockResolvedValue(null);

      await expect(
        service.changePassword(user.id, 'SomeOldPass!', 'NewPass1@', false),
      ).rejects.toThrow();

      expect(prismaMock.account.update).not.toHaveBeenCalled();
    });
  });
});
