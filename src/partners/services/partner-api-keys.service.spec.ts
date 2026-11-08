import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import crypto from 'node:crypto';
import { PartnerApiKeysService } from './partner-api-keys.service.js';
import { ApiKeyEnvironment } from '../../../generated/prisma/client.js';

describe('PartnerApiKeysService', () => {
  let service: PartnerApiKeysService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      partner: {
        findUnique: jest.fn(),
      },
      partnerApiKey: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      partnerApiLog: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };

    service = new PartnerApiKeysService(prismaMock);
  });

  describe('createApiKey', () => {
    it('doit lever NotFoundException si le partenaire n’existe pas', async () => {
      prismaMock.partner.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.createApiKey('partner_999', {
          name: 'Clé Prod',
          scopes: ['events:read'],
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('doit générer une clé secrète avec le bon préfixe et persister uniquement son hash SHA-256', async () => {
      prismaMock.partner.findUnique.mockResolvedValueOnce({
        id: 'partner_1',
        name: 'Association Gasikara',
      });

      prismaMock.partnerApiKey.create.mockImplementationOnce(({ data }: any) =>
        Promise.resolve({
          id: 'key_1',
          partnerId: data.partnerId,
          name: data.name,
          keyPrefix: data.keyPrefix,
          scopes: data.scopes,
          environment: data.environment,
          rateLimit: data.rateLimit,
          expiresAt: data.expiresAt,
          createdAt: new Date(),
        }),
      );

      const result = await service.createApiKey('partner_1', {
        name: 'Serveur Billetterie',
        scopes: ['events:read', 'events:write'],
        environment: ApiKeyEnvironment.LIVE,
      });

      // La clé secrète doit être retournée en clair une seule fois
      expect(result.secretKey).toBeDefined();
      expect(result.secretKey.startsWith('kanto_live_')).toBe(true);

      // Vérifier que le hash persisté correspond au SHA-256 de la clé secrète
      const expectedHash = crypto
        .createHash('sha256')
        .update(result.secretKey)
        .digest('hex');

      const createCall = prismaMock.partnerApiKey.create.mock.calls[0][0];
      expect(createCall.data.keyHash).toBe(expectedHash);
      expect(createCall.data.keyPrefix).toBe(result.secretKey.slice(0, 16));
    });

    it('doit générer une clé avec préfixe kanto_test_ en environnement TEST', async () => {
      prismaMock.partner.findUnique.mockResolvedValueOnce({
        id: 'partner_1',
        name: 'Développeur Sandbox',
      });

      prismaMock.partnerApiKey.create.mockImplementationOnce(({ data }: any) =>
        Promise.resolve({
          id: 'key_test_1',
          ...data,
        }),
      );

      const result = await service.createApiKey('partner_1', {
        name: 'Clé Sandbox Locale',
        scopes: ['events:read'],
        environment: ApiKeyEnvironment.TEST,
      });

      expect(result.secretKey.startsWith('kanto_test_')).toBe(true);
    });
  });

  describe('revokeApiKey', () => {
    it('doit lever NotFoundException si la clé n’appartient pas au partenaire', async () => {
      prismaMock.partnerApiKey.findFirst.mockResolvedValueOnce(null);

      await expect(
        service.revokeApiKey('partner_1', 'key_unknown'),
      ).rejects.toThrow(NotFoundException);
    });

    it('doit lever BadRequestException si la clé est déjà révoquée', async () => {
      prismaMock.partnerApiKey.findFirst.mockResolvedValueOnce({
        id: 'key_1',
        partnerId: 'partner_1',
        revokedAt: new Date(),
      });

      await expect(service.revokeApiKey('partner_1', 'key_1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('doit révoquer avec succès et enregistrer le motif de révocation', async () => {
      prismaMock.partnerApiKey.findFirst.mockResolvedValueOnce({
        id: 'key_1',
        partnerId: 'partner_1',
        revokedAt: null,
      });

      prismaMock.partnerApiKey.update.mockResolvedValueOnce({
        id: 'key_1',
        name: 'Clé compromise',
        keyPrefix: 'kanto_live_abc123',
        revokedAt: new Date(),
        revocationReason: 'Suspicion de fuite sur GitHub',
      });

      const res = await service.revokeApiKey('partner_1', 'key_1', {
        reason: 'Suspicion de fuite sur GitHub',
      });

      expect(res.revokedAt).toBeDefined();
      expect(res.revocationReason).toBe('Suspicion de fuite sur GitHub');
    });
  });
});
