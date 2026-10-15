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

describe('UsersService — suppression de compte (RGPD & Sécurité)', () => {
  let service: UsersService;
  let prismaMock: PrismaMock;
  let resendMock: {
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
      sendAccountDeletionEmail: jest
        .fn<any>()
        .mockResolvedValue({ id: 'resend-123' }),
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

    it('supprime avec succès le compte lorsque le mot de passe et la phrase sont corrects', async () => {
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

      prismaMock.contribution.count.mockResolvedValue(0);
      prismaMock.user.delete.mockResolvedValue(user);

      const result = await service.deleteAccount('user-1', {
        confirmationPhrase: VALID_PHRASE,
        password: PLAIN_PASSWORD,
      });

      expect(result.success).toBe(true);
      expect(prismaMock.$transaction).toHaveBeenCalled();
      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
      expect(cloudinaryMock.deleteMediaFromUrl).toHaveBeenCalledWith(
        user.image,
      );
      expect(resendMock.sendAccountDeletionEmail).toHaveBeenCalledWith({
        to: 'user1@example.com',
        userName: 'Soa Malagasy',
      });
    });
  });

  describe('Compte OAuth exclusif (Google, etc.)', () => {
    it('supprime avec succès le compte sans exiger de mot de passe', async () => {
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

      prismaMock.contribution.count.mockResolvedValue(0);
      prismaMock.user.delete.mockResolvedValue(user);

      const result = await service.deleteAccount('user-google', {
        confirmationPhrase: VALID_PHRASE,
      });

      expect(result.success).toBe(true);
      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-google' },
      });
      // Pas d'image personnalisée -> deleteMediaFromUrl non appelé
      expect(cloudinaryMock.deleteMediaFromUrl).not.toHaveBeenCalled();
      expect(resendMock.sendAccountDeletionEmail).toHaveBeenCalledWith({
        to: 'google.user@gmail.com',
        userName: 'Andry Google',
      });
    });
  });

  describe('Préservation des contributions culturelles & UGC', () => {
    it('anonymise les contributions approuvées en les réassignant au compte archive', async () => {
      const user = buildUser({ id: 'user-contrib', email: 'contrib@kanto.mg' });

      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        accounts: [
          {
            id: 'acc-g',
            providerId: 'google',
            userId: 'user-contrib',
            password: null,
          },
        ],
      });

      // 3 contributions approuvées
      prismaMock.contribution.count.mockResolvedValue(3);
      const archiveUser = { id: 'archive-id-99', email: 'archive@kanto.mg' };
      prismaMock.user.upsert.mockResolvedValue(archiveUser);
      prismaMock.user.delete.mockResolvedValue(user);

      await service.deleteAccount('user-contrib', {
        confirmationPhrase: VALID_PHRASE,
      });

      // Vérifie que les contributions non approuvées sont supprimées
      expect(prismaMock.contribution.deleteMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-contrib',
          status: { not: 'APPROVED' },
        },
      });

      // Vérifie que l'utilisateur d'archive est créé/récupéré
      expect(prismaMock.user.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: 'archive@kanto.mg' },
        }),
      );

      // Vérifie que les contributions approuvées sont réassignées au compte archive
      expect(prismaMock.contribution.updateMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-contrib',
          status: 'APPROVED',
        },
        data: {
          userId: 'archive-id-99',
        },
      });
    });

    it('nettoie les quiz sets UGC et détache les sessions de duel', async () => {
      const user = buildUser({ id: 'user-ugc' });
      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        accounts: [],
      });
      prismaMock.contribution.count.mockResolvedValue(0);
      prismaMock.user.delete.mockResolvedValue(user);

      await service.deleteAccount('user-ugc', {
        confirmationPhrase: VALID_PHRASE,
      });

      expect(prismaMock.duelSession.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            customQuizSet: { authorId: 'user-ugc' },
          },
          data: {
            customQuizSetId: null,
          },
        }),
      );

      expect(prismaMock.userQuestion.deleteMany).toHaveBeenCalledWith({
        where: {
          quizSet: { authorId: 'user-ugc' },
        },
      });

      expect(prismaMock.userQuizSet.deleteMany).toHaveBeenCalledWith({
        where: {
          authorId: 'user-ugc',
        },
      });
    });
  });
});
