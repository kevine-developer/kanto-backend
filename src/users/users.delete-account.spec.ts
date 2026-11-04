import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CloudinaryService } from '../integrations/cloudinary/cloudinary.service.js';
import { ResendService } from '../integrations/resend/resend.service.js';
import {
  createPrismaMock,
  type PrismaMock,
} from '../test-utils/mock-prisma.factory.js';
import { buildUser } from '../test-utils/builders/user.builder.js';
import { hashPassword } from '@better-auth/utils/password';

describe('UsersService — cycle de vie et suppression de compte (RGPD & Rétractation 30 jours)', () => {
  let service: UsersService;
  let prismaMock: PrismaMock;
  let resendMock: {
    sendAccountPendingDeletionEmail: jest.Mock<any>;
    sendAccountReactivatedEmail: jest.Mock<any>;
    sendAccountDeletionEmail: jest.Mock<any>;
    sendSecurityChangeEmail: jest.Mock<any>;
    isConfigured: jest.Mock<any>;
  };
  let cloudinaryMock: {
    isConfigured: jest.Mock<any>;
    validateAndDecodeBase64Image: jest.Mock<any>;
    uploadImageBase64: jest.Mock<any>;
    deleteMediaFromUrl: jest.Mock<any>;
  };

  const VALID_PHRASE = 'SUPPRIMER MON COMPTE';
  const PLAIN_PASSWORD = 'Password123!';
  let HASHED_PASSWORD: string;

  beforeAll(async () => {
    HASHED_PASSWORD = await hashPassword(PLAIN_PASSWORD);
  });

  beforeEach(async () => {
    prismaMock = createPrismaMock();

    cloudinaryMock = {
      isConfigured: jest.fn<any>().mockReturnValue(true),
      validateAndDecodeBase64Image: jest.fn<any>(),
      uploadImageBase64: jest.fn<any>(),
      deleteMediaFromUrl: jest.fn<any>().mockResolvedValue(true),
    };

    resendMock = {
      sendAccountPendingDeletionEmail: jest
        .fn<any>()
        .mockResolvedValue({ id: 'resend-retract' }),
      sendAccountReactivatedEmail: jest
        .fn<any>()
        .mockResolvedValue({ id: 'resend-reactivate' }),
      sendAccountDeletionEmail: jest
        .fn<any>()
        .mockResolvedValue({ id: 'resend-final' }),
      sendSecurityChangeEmail: jest
        .fn<any>()
        .mockResolvedValue({ id: 'sec-1' }),
      isConfigured: jest.fn<any>().mockReturnValue(true),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lève NotFoundException si l’utilisateur n’existe pas', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(
      service.deleteAccount('non-existent', {
        confirmationPhrase: VALID_PHRASE,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('lève BadRequestException si la phrase de confirmation est inexacte', async () => {
    const user = buildUser({ id: 'user-1' });
    prismaMock.user.findUnique.mockResolvedValue({
      ...user,
      accounts: [],
    });

    await expect(
      service.deleteAccount('user-1', {
        confirmationPhrase: 'supprimer mon compte', // minuscules
      }),
    ).rejects.toThrow(BadRequestException);
  });

  describe('Compte avec mot de passe (credential)', () => {
    it('lève BadRequestException si le mot de passe est absent', async () => {
      const user = buildUser({ id: 'user-1' });
      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        accounts: [
          {
            id: 'acc-1',
            providerId: 'credential',
            userId: 'user-1',
            password: HASHED_PASSWORD,
          },
        ],
      });

      await expect(
        service.deleteAccount('user-1', {
          confirmationPhrase: VALID_PHRASE,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('lève UnauthorizedException si le mot de passe est incorrect', async () => {
      const user = buildUser({ id: 'user-1' });
      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        accounts: [
          {
            id: 'acc-1',
            providerId: 'credential',
            userId: 'user-1',
            password: HASHED_PASSWORD,
          },
        ],
      });

      await expect(
        service.deleteAccount('user-1', {
          confirmationPhrase: VALID_PHRASE,
          password: 'WrongPassword999!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('enclenche avec succès la rétractation de 30 jours et révoque les sessions', async () => {
      const user = buildUser({
        id: 'user-1',
        email: 'user1@example.com',
        name: 'Soa Malagasy',
        image: 'https://res.cloudinary.com/kanto/image/upload/v1/avatar.jpg',
      });

      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        accounts: [
          {
            id: 'acc-1',
            providerId: 'credential',
            userId: 'user-1',
            password: HASHED_PASSWORD,
          },
        ],
      });

      const result = await service.deleteAccount('user-1', {
        confirmationPhrase: VALID_PHRASE,
        password: PLAIN_PASSWORD,
      });

      expect(result.success).toBe(true);
      expect(result.deletionScheduledAt).toBeDefined();
      expect(prismaMock.$transaction).toHaveBeenCalled();
      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-1' },
          data: expect.objectContaining({
            status: 'PENDING_DELETION',
          }),
        }),
      );
      expect(prismaMock.session.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
      expect(resendMock.sendAccountPendingDeletionEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'user1@example.com',
          userName: 'Soa Malagasy',
        }),
      );
    });
  });

  describe('Compte OAuth exclusif (Google, etc.)', () => {
    it('enclenche avec succès la rétractation sans exiger de mot de passe', async () => {
      const user = buildUser({
        id: 'user-google',
        email: 'google.user@gmail.com',
        name: 'Andry Google',
        image: null,
      });

      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        accounts: [
          {
            id: 'acc-google',
            providerId: 'google',
            userId: 'user-google',
            password: null,
          },
        ],
      });

      const result = await service.deleteAccount('user-google', {
        confirmationPhrase: VALID_PHRASE,
      });

      expect(result.success).toBe(true);
      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-google' },
          data: expect.objectContaining({
            status: 'PENDING_DELETION',
          }),
        }),
      );
      expect(prismaMock.session.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-google' },
      });
    });
  });

  describe('reactivateAccount', () => {
    it('réactive avec succès un compte en cours de suppression et notifie l’utilisateur', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-react',
        email: 'react@kanto.mg',
        name: 'Faly React',
        status: 'PENDING_DELETION',
      });

      const result = await service.reactivateAccount('user-react');

      expect(result.success).toBe(true);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'user-react' },
        data: {
          status: 'ACTIVE',
          deactivatedAt: null,
          deletionScheduledAt: null,
        },
      });
      expect(resendMock.sendAccountReactivatedEmail).toHaveBeenCalledWith({
        to: 'react@kanto.mg',
        userName: 'Faly React',
      });
    });
  });

  describe('purgeScheduledDeletions', () => {
    it('purge définitivement les comptes expirés et préserve les quiz UGC en les archivant', async () => {
      const expUser = {
        id: 'user-expired',
        email: 'exp@kanto.mg',
        name: 'Ancien Joueur',
        image: 'https://res.cloudinary.com/kanto/avatar.jpg',
      };

      prismaMock.user.findMany.mockResolvedValue([expUser]);
      prismaMock.user.upsert.mockResolvedValue({ id: 'archive-id' });
      prismaMock.contribution.count.mockResolvedValue(0);

      const results = await service.purgeScheduledDeletions();

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
      expect(prismaMock.$transaction).toHaveBeenCalled();
      // Préservation des UGC via réassignation à l'archive
      expect(prismaMock.userQuizSet.updateMany).toHaveBeenCalledWith({
        where: { authorId: 'user-expired' },
        data: { authorId: 'archive-id' },
      });
      // Suppression effective
      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-expired' },
      });
      expect(resendMock.sendAccountDeletionEmail).toHaveBeenCalledWith({
        to: 'exp@kanto.mg',
        userName: 'Ancien Joueur',
      });
    });
  });
});
