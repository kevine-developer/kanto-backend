import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { MarketingBannersService } from './marketing-banners.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('MarketingBannersService', () => {
  let service: MarketingBannersService;
  let prisma: {
    marketingBanner: {
      findFirst: jest.Mock<any>;
      findUnique: jest.Mock<any>;
      create: jest.Mock<any>;
      update: jest.Mock<any>;
    };
    moduleLock: {
      findUnique: jest.Mock<any>;
      upsert: jest.Mock<any>;
    };
  };

  beforeEach(async () => {
    prisma = {
      marketingBanner: {
        findFirst: jest.fn<any>().mockResolvedValue({ orderIndex: 2 }),
        findUnique: jest.fn<any>(),
        create: jest
          .fn<any>()
          .mockImplementation(({ data }: { data: Record<string, unknown> }) =>
            Promise.resolve({ id: 'banner_manual_1', ...data }),
          ),
        update: jest
          .fn<any>()
          .mockImplementation(({ data }: { data: Record<string, unknown> }) =>
            Promise.resolve({ id: 'banner_manual_1', ...data }),
          ),
      },
      moduleLock: {
        findUnique: jest.fn<any>(),
        upsert: jest.fn<any>(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketingBannersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<MarketingBannersService>(MarketingBannersService);
  });

  it('crée une bannière manuelle en mode MG_ONLY en alignant les champs FR sur MG sans envoyer languageMode à Prisma', async () => {
    await service.create({
      languageMode: 'MG_ONLY',
      badgeFr: '',
      badgeMg: 'TOLOTRA',
      titleFr: '',
      titleMg: 'Mianara teny malagasy',
      descriptionFr: '',
      descriptionMg: 'Andramo anio ny lesona vaovao.',
      ctaFr: '',
      ctaMg: 'Hanomboka',
      imageUrl: 'https://example.com/banner.jpg',
      deepLink: '/(tabs)/learn',
    });

    expect(prisma.marketingBanner.create).toHaveBeenCalledTimes(1);
    const callArg = prisma.marketingBanner.create.mock.calls[0][0] as {
      data: Record<string, unknown>;
    };
    expect(callArg.data).not.toHaveProperty('languageMode');
    expect(callArg.data.titleFr).toBe('Mianara teny malagasy');
    expect(callArg.data.titleMg).toBe('Mianara teny malagasy');
    expect(callArg.data.badgeFr).toBe('TOLOTRA');
    expect(callArg.data.ctaFr).toBe('Hanomboka');
  });

  it('crée une bannière manuelle en mode FR_ONLY en alignant les champs MG sur FR', async () => {
    await service.create({
      languageMode: 'FR_ONLY',
      badgeFr: 'NOUVEAUTÉ',
      badgeMg: '',
      titleFr: 'Découvrez les contes anciens',
      titleMg: '',
      descriptionFr: 'Plongez dans les récits du patrimoine.',
      descriptionMg: '',
      ctaFr: 'Explorer',
      ctaMg: '',
      modalBodyFr: 'Détails en français uniquement.',
      modalCtaLabelFr: 'Lire la suite',
      imageUrl: 'https://example.com/banner2.jpg',
      deepLink: '/(tabs)/explore',
    });

    const callArg = prisma.marketingBanner.create.mock.calls[0][0] as {
      data: Record<string, unknown>;
    };
    expect(callArg.data.titleMg).toBe('Découvrez les contes anciens');
    expect(callArg.data.descriptionMg).toBe(
      'Plongez dans les récits du patrimoine.',
    );
    expect(callArg.data.ctaMg).toBe('Explorer');
    expect(callArg.data.modalBodyMg).toBe('Détails en français uniquement.');
    expect(callArg.data.modalCtaLabelMg).toBe('Lire la suite');
  });

  it('met à jour une bannière en mode BILINGUAL en conservant les deux langues distinctes', async () => {
    prisma.marketingBanner.findUnique.mockResolvedValue({
      id: 'banner_manual_1',
      badgeFr: 'A',
      badgeMg: 'B',
      titleFr: 'Titre FR',
      titleMg: 'Lohateny MG',
      descriptionFr: 'Desc FR',
      descriptionMg: 'Famaritana MG',
      ctaFr: 'Voir',
      ctaMg: 'Hijery',
    });

    await service.update('banner_manual_1', {
      languageMode: 'BILINGUAL',
      titleFr: 'Nouveau titre FR',
      titleMg: 'Lohateny vaovao',
    });

    const callArg = prisma.marketingBanner.update.mock.calls[0][0] as {
      data: Record<string, unknown>;
    };
    expect(callArg.data).not.toHaveProperty('languageMode');
    expect(callArg.data.titleFr).toBe('Nouveau titre FR');
    expect(callArg.data.titleMg).toBe('Lohateny vaovao');
  });
});
