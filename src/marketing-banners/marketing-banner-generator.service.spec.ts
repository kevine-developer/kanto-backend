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
    moduleLock: {
      findUnique: jest.Mock<any>;
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
      moduleLock: {
        findUnique: jest.fn<any>().mockResolvedValue({
          key: 'feature:marketing_banner_ai',
          isLocked: false,
          isVisible: true,
        }),
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
      'BILINGUAL',
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

  it('ne génère pas de bannière dans le cron si la fonctionnalité IA est désactivée', async () => {
    prisma.moduleLock.findUnique.mockResolvedValueOnce({
      key: 'feature:marketing_banner_ai',
      isLocked: true,
      isVisible: false,
    });

    await service.handleCron();

    expect(prisma.marketingBanner.create).not.toHaveBeenCalled();
    expect(geminiContent.generateBannerContent).not.toHaveBeenCalled();
  });

  it('refuse la génération non-forcée si la fonctionnalité IA est absente de la base (désactivée par défaut)', async () => {
    prisma.moduleLock.findUnique.mockResolvedValueOnce(null);

    const result = await service.generateAndSaveBanner({ force: false });

    expect(result.success).toBe(false);
    expect(result.message).toContain('désactivée');
    expect(prisma.marketingBanner.create).not.toHaveBeenCalled();
  });

  it('permet de forcer la génération manuelle même si l’IA automatique est désactivée', async () => {
    prisma.moduleLock.findUnique.mockResolvedValueOnce({
      key: 'feature:marketing_banner_ai',
      isLocked: true,
      isVisible: false,
    });

    const mockData = {
      badgeFr: 'MANUEL',
      badgeMg: 'MANUEL',
      titleFr: 'Bannière forcée admin',
      titleMg: 'Sora-baventy natao tànana',
      descriptionFr: 'Description test',
      descriptionMg: 'Famaritana fitsapana',
      ctaFr: 'Voir',
      ctaMg: 'Hijery',
      accentColor: '#F59E0B',
      deepLink: '/(tabs)/explore',
    };
    geminiContent.generateBannerContent.mockResolvedValue(mockData);

    const result = await service.generateAndSaveBanner({ force: true });

    expect(result.success).toBe(true);
    expect(prisma.marketingBanner.create).toHaveBeenCalled();
  });

  it('transmet le mode linguistique explicite (MG_ONLY) à Gemini lors de la génération manuelle', async () => {
    geminiContent.generateBannerContent.mockResolvedValue({
      badgeFr: 'HAJA & SOATOAVINA',
      badgeMg: 'HAJA & SOATOAVINA',
      titleFr: 'Mianara ohabolana malagasy',
      titleMg: 'Mianara ohabolana malagasy',
      descriptionFr: 'Harena saro-bidy ny teny malagasy.',
      descriptionMg: 'Harena saro-bidy ny teny malagasy.',
      ctaFr: 'Hijery',
      ctaMg: 'Hijery',
      accentColor: '#C58B38',
      deepLink: '/(tabs)/explore',
    });

    const result = await service.generateAndSaveBanner({
      force: true,
      languageMode: 'MG_ONLY',
    });

    expect(result.success).toBe(true);
    expect(geminiContent.generateBannerContent).toHaveBeenCalledWith(
      expect.anything(),
      'MG_ONLY',
    );
  });

  it('lit le mode linguistique sauvegardé en base (FR_ONLY) si languageMode est omis', async () => {
    prisma.moduleLock.findUnique.mockImplementation(
      ({ where }: { where: { key: string } }) => {
        if (where.key === 'feature:marketing_banner_ai_language') {
          return Promise.resolve({
            key: 'feature:marketing_banner_ai_language',
            isLocked: false,
            isVisible: false,
            lockReason: 'FR_ONLY',
          });
        }
        return Promise.resolve({
          key: 'feature:marketing_banner_ai',
          isLocked: false,
          isVisible: true,
        });
      },
    );

    geminiContent.generateBannerContent.mockResolvedValue({
      badgeFr: 'PATRIMOINE',
      badgeMg: 'PATRIMOINE',
      titleFr: 'Découvrez les contes malgaches',
      titleMg: 'Découvrez les contes malgaches',
      descriptionFr: 'Explorez notre patrimoine oral.',
      descriptionMg: 'Explorez notre patrimoine oral.',
      ctaFr: 'Découvrir',
      ctaMg: 'Découvrir',
      accentColor: '#4A6741',
      deepLink: '/(tabs)/explore',
    });

    const result = await service.generateAndSaveBanner({ force: true });

    expect(result.success).toBe(true);
    expect(geminiContent.generateBannerContent).toHaveBeenCalledWith(
      expect.anything(),
      'FR_ONLY',
    );
  });

  it('utilise le thème personnalisé fourni sans appeler pickRandomTheme', async () => {
    const customTheme =
      'Fête nationale et transmission des proverbes malgaches';
    geminiContent.generateBannerContent.mockResolvedValue({
      badgeFr: 'SPÉCIAL 26 JUIN',
      badgeMg: 'MANOKANA',
      titleFr: 'Célébrez le patrimoine malgache',
      titleMg: 'Ankalazao ny vakoka malagasy',
      descriptionFr: 'Découvrez les plus beaux proverbes de l’île.',
      descriptionMg: 'Tsidiho ireo ohabolana tsara indrindra.',
      ctaFr: 'Découvrir',
      ctaMg: 'Hijery',
      accentColor: '#C0392B',
      deepLink: '/(tabs)/explore',
    });

    const result = await service.generateAndSaveBanner({
      force: true,
      languageMode: 'BILINGUAL',
      theme: customTheme,
    });

    expect(result.success).toBe(true);
    expect(geminiContent.pickRandomTheme).not.toHaveBeenCalled();
    expect(geminiContent.generateBannerContent).toHaveBeenCalledWith(
      customTheme,
      'BILINGUAL',
    );
    expect(result.message).toContain(customTheme);
  });
});
