import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { MarketingBannerGeneratorService } from './marketing-banner-generator.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { GeminiContentService } from '../integrations/gemini/gemini-content.service.js';
import { FALLBACK_BANNER_THEMES } from './constants/fallback-banner-themes.constant.js';

describe('MarketingBannerGeneratorService (Tolérance aux pannes et Repli culturel)', () => {
  let service: MarketingBannerGeneratorService;
  let prisma: {
    marketingBanner: {
      findFirst: jest.Mock<any>;
      create: jest.Mock<any>;
    };
  };
  let geminiContent: {
    isConfigured: jest.Mock<any>;
    pickRandomTheme: jest.Mock<any>;
    generateBannerContent: jest.Mock<any>;
    getFallbackBannerContent: jest.Mock<any>;
  };

  beforeEach(async () => {
    prisma = {
      marketingBanner: {
        findFirst: jest.fn<any>().mockResolvedValue({ orderIndex: 2 }),
        create: jest.fn<any>().mockImplementation(({ data }: any) =>
          Promise.resolve({
            id: 'banner_test_id',
            ...data,
          }),
        ),
      },
    };

    geminiContent = {
      isConfigured: jest.fn<any>().mockReturnValue(true),
      pickRandomTheme: jest
        .fn<any>()
        .mockReturnValue(
          'culture et patrimoine malgache (musique, danse, fady)',
        ),
      generateBannerContent: jest.fn<any>(),
      getFallbackBannerContent: jest
        .fn<any>()
        .mockImplementation((theme: string) => {
          return (
            FALLBACK_BANNER_THEMES[theme] ||
            FALLBACK_BANNER_THEMES[
              'culture et patrimoine malgache (musique, danse, fady)'
            ]
          );
        }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketingBannerGeneratorService,
        { provide: PrismaService, useValue: prisma },
        { provide: GeminiContentService, useValue: geminiContent },
      ],
    }).compile();

    service = module.get<MarketingBannerGeneratorService>(
      MarketingBannerGeneratorService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('génère et sauvegarde une bannière avec succès lorsque Gemini répond', async () => {
    const mockGeminiData = {
      badgeFr: 'NOUVEAU',
      badgeMg: 'VAOVAO',
      titleFr: 'Découvrez la musique des hauts plateaux',
      titleMg: 'Diniho ny mozika an-tampon-tanana',
      descriptionFr: 'Une immersion dans les airs traditionnels.',
      descriptionMg: 'Fankafizana ny kanto sy ny gadona taloha.',
      ctaFr: 'Écouter',
      ctaMg: 'Hihaino',
      accentColor: '#4A6741',
      deepLink: '/(tabs)/explore',
    };
    geminiContent.generateBannerContent.mockResolvedValue(mockGeminiData);

    const result = await service.generateAndSaveBanner();

    expect(result.success).toBe(true);
    expect(result.bannerId).toBe('banner_test_id');
    expect(prisma.marketingBanner.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        titleFr: mockGeminiData.titleFr,
        titleMg: mockGeminiData.titleMg,
        orderIndex: 3,
        isActive: false, // Inactif par défaut pour modération admin
      }),
    });
  });

  it('bascule automatiquement sur le catalogue de repli culturel lors d’une erreur "fetch failed"', async () => {
    // Simuler le crash réseau Node.js (fetch failed) rencontré par l'utilisateur
    const networkError = new TypeError('fetch failed');
    (networkError as any).cause = new Error(
      'getaddrinfo ENOTFOUND generativelanguage.googleapis.com',
    );
    geminiContent.generateBannerContent.mockRejectedValue(networkError);

    const result = await service.generateAndSaveBanner();

    expect(result.success).toBe(true);
    expect(result.bannerId).toBe('banner_test_id');
    expect(geminiContent.getFallbackBannerContent).toHaveBeenCalledWith(
      'culture et patrimoine malgache (musique, danse, fady)',
    );
    expect(prisma.marketingBanner.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        badgeFr: 'PATRIMOINE VIVANT',
        badgeMg: 'HAREN-TSAIN-DRAZANA',
        titleFr: 'Rythmes, traditions et sagesses ancestrales',
        titleMg: 'Feo, dihy ary fady mamelona ny fomban-tany',
        isActive: false,
      }),
    });
    expect(result.message).toContain('catalogue culturel de repli');
  });

  it('utilise directement le catalogue de repli si GEMINI_API_KEY n’est pas configurée', async () => {
    geminiContent.isConfigured.mockReturnValue(false);

    const result = await service.generateAndSaveBanner();

    expect(result.success).toBe(true);
    expect(geminiContent.generateBannerContent).not.toHaveBeenCalled();
    expect(geminiContent.getFallbackBannerContent).toHaveBeenCalled();
    expect(prisma.marketingBanner.create).toHaveBeenCalled();
  });
});
