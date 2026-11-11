import { jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { LocksService } from './locks.service.js';

describe('LocksService — Gestion des langues d’application', () => {
  let service: LocksService;
  let prismaMock: any;
  let redisMock: any;
  let cloudinaryMock: any;

  beforeEach(() => {
    prismaMock = {
      moduleLock: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      $executeRawUnsafe: jest.fn().mockResolvedValue(1),
    };

    redisMock = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue('OK'),
      del: jest.fn().mockResolvedValue(1),
    };

    cloudinaryMock = {
      deleteMediaFromUrl: jest.fn().mockResolvedValue(true),
    };

    service = new LocksService(prismaMock, redisMock, cloudinaryMock);
  });

  describe('getAppLanguages', () => {
    it('devrait retourner les deux langues actives par défaut si non verrouillées', async () => {
      prismaMock.moduleLock.findUnique
        .mockResolvedValueOnce({
          key: 'language:fr',
          isLocked: false,
          isVisible: true,
        })
        .mockResolvedValueOnce({
          key: 'language:mg',
          isLocked: false,
          isVisible: true,
        });

      const res = await service.getAppLanguages();

      expect(res.fr).toBe(true);
      expect(res.mg).toBe(true);
      expect(res.activeLanguages).toEqual(['fr', 'mg']);
      expect(res.defaultLanguage).toBe('fr');
    });

    it('devrait refléter correctement si la langue malagasy est désactivée', async () => {
      prismaMock.moduleLock.findUnique
        .mockResolvedValueOnce({
          key: 'language:fr',
          isLocked: false,
          isVisible: true,
        })
        .mockResolvedValueOnce({
          key: 'language:mg',
          isLocked: true,
          isVisible: false,
        });

      const res = await service.getAppLanguages();

      expect(res.fr).toBe(true);
      expect(res.mg).toBe(false);
      expect(res.activeLanguages).toEqual(['fr']);
      expect(res.defaultLanguage).toBe('fr');
    });

    it('devrait choisir mg comme langue par défaut si fr est désactivé', async () => {
      prismaMock.moduleLock.findUnique
        .mockResolvedValueOnce({
          key: 'language:fr',
          isLocked: true,
          isVisible: false,
        })
        .mockResolvedValueOnce({
          key: 'language:mg',
          isLocked: false,
          isVisible: true,
        });

      const res = await service.getAppLanguages();

      expect(res.fr).toBe(false);
      expect(res.mg).toBe(true);
      expect(res.activeLanguages).toEqual(['mg']);
      expect(res.defaultLanguage).toBe('mg');
    });
  });

  describe('updateAppLanguages — Règle de non-désactivation simultanée', () => {
    it('devrait refuser catégoriquement de désactiver les deux langues simultanément', async () => {
      prismaMock.moduleLock.findUnique
        .mockResolvedValueOnce({
          key: 'language:fr',
          isLocked: false,
          isVisible: true,
        })
        .mockResolvedValueOnce({
          key: 'language:mg',
          isLocked: false,
          isVisible: true,
        });

      await expect(
        service.updateAppLanguages({ fr: false, mg: false }),
      ).rejects.toThrow(BadRequestException);
    });

    it('devrait refuser de désactiver la seule langue restante active', async () => {
      // Actuellement : FR actif, MG inactif
      prismaMock.moduleLock.findUnique
        .mockResolvedValueOnce({
          key: 'language:fr',
          isLocked: false,
          isVisible: true,
        })
        .mockResolvedValueOnce({
          key: 'language:mg',
          isLocked: true,
          isVisible: false,
        });

      // Tentative de désactiver FR sans réactiver MG
      await expect(service.updateAppLanguages({ fr: false })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('devrait accepter de désactiver une langue si l’autre reste active', async () => {
      prismaMock.moduleLock.findUnique
        .mockResolvedValueOnce({
          key: 'language:fr',
          isLocked: false,
          isVisible: true,
        })
        .mockResolvedValueOnce({
          key: 'language:mg',
          isLocked: false,
          isVisible: true,
        });

      prismaMock.moduleLock.upsert.mockResolvedValue({});

      const res = await service.updateAppLanguages({ mg: false });

      expect(res.fr).toBe(true);
      expect(res.mg).toBe(false);
      expect(res.activeLanguages).toEqual(['fr']);
      expect(prismaMock.moduleLock.upsert).toHaveBeenCalledTimes(2);
      expect(redisMock.del).toHaveBeenCalled();
    });
  });

  describe('deleteModuleLock', () => {
    it('devrait interdire la suppression des clés système de langue', async () => {
      await expect(service.deleteModuleLock('language:fr')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.deleteModuleLock('language:mg')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
