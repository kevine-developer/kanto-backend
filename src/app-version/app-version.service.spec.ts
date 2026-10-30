import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AppVersionService } from './app-version.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('AppVersionService', () => {
  let service: AppVersionService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      appVersion: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppVersionService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<AppVersionService>(AppVersionService);
  });

  describe('checkVersion', () => {
    it('devrait retourner isUpdateAvailable = false si aucune version en base', async () => {
      prismaMock.appVersion.findFirst.mockResolvedValue(null);

      const result = await service.checkVersion('android', '0.0.19');
      expect(result.isUpdateAvailable).toBe(false);
      expect(result.isMandatory).toBe(false);
    });

    it('devrait détecter une mise à jour facultative disponible', async () => {
      prismaMock.appVersion.findFirst.mockResolvedValue({
        id: '1',
        platform: 'android',
        version: '0.0.20',
        minVersion: '0.0.18',
        titleFr: 'Nouveau contenu',
        titleMg: 'Votoatiny vaovao',
        messageFr: 'Améliorations diverses',
        messageMg: 'Fanatsarana maro',
        releaseNotesFr: ['Correction de bugs', 'Nouvelles quêtes'],
        releaseNotesMg: ['Fanitsiana', 'Lalao vaovao'],
        storeUrl: 'https://play.google.com/store/apps/details?id=com.devengalere.kantomg',
        isPublished: true,
        publishedAt: new Date(),
      });

      const result = await service.checkVersion('android', '0.0.19');
      expect(result.isUpdateAvailable).toBe(true);
      expect(result.isMandatory).toBe(false);
      expect(result.latestVersion).toBe('0.0.20');
      expect(result.releaseNotesFr).toHaveLength(2);
    });

    it('devrait détecter une mise à jour OBLIGATOIRE si la version actuelle est inférieure à minVersion', async () => {
      prismaMock.appVersion.findFirst.mockResolvedValue({
        id: '2',
        platform: 'ios',
        version: '1.0.0',
        minVersion: '0.1.0',
        titleFr: 'Mise à jour majeure',
        titleMg: 'Fanavaozana lehibe',
        messageFr: 'Support technique requis',
        messageMg: 'Fanohanana ilaina',
        releaseNotesFr: ['Refonte complète'],
        releaseNotesMg: ['Fanavaozana manontolo'],
        storeUrl: 'https://apps.apple.com/app/kanto-mg/id6738914614',
        isPublished: true,
        publishedAt: new Date(),
      });

      const result = await service.checkVersion('ios', '0.0.19');
      expect(result.isUpdateAvailable).toBe(true);
      expect(result.isMandatory).toBe(true);
      expect(result.latestVersion).toBe('1.0.0');
    });

    it('ne doit PAS notifier si la version installée est égale ou supérieure à la dernière version publiée', async () => {
      prismaMock.appVersion.findFirst.mockResolvedValue({
        id: '3',
        platform: 'android',
        version: '0.0.19',
        minVersion: null,
        titleFr: 'Titre',
        titleMg: 'Lohateny',
        messageFr: 'Msg',
        messageMg: 'Hafatra',
        releaseNotesFr: [],
        releaseNotesMg: [],
        storeUrl: '',
        isPublished: true,
        publishedAt: new Date(),
      });

      const result = await service.checkVersion('android', '0.0.19');
      expect(result.isUpdateAvailable).toBe(false);
      expect(result.isMandatory).toBe(false);
    });
  });
});
