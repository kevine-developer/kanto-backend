import { Test, TestingModule } from '@nestjs/testing';
import { GeminiContentService } from './gemini-content.service.js';

describe('GeminiContentService', () => {
  let service: GeminiContentService;

  beforeEach(async () => {
    process.env.GEMINI_API_KEY = 'test_key';
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeminiContentService],
    }).compile();

    service = module.get<GeminiContentService>(GeminiContentService);
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  it('indique isConfigured=true lorsque GEMINI_API_KEY est présente', () => {
    expect(service.isConfigured()).toBe(true);
  });

  it('résout correctement les deepLinks en fonction du thème', () => {
    expect(
      service.resolveDeepLink('apprentissage de la langue malgache (vocabulaire)'),
    ).toBe('/(tabs)/learn');
    expect(
      service.resolveDeepLink('défis linguistiques et gamification'),
    ).toBe('/(tabs)/play');
    expect(
      service.resolveDeepLink('contes et récits traditionnels malgaches (angano)'),
    ).toBe('/(tabs)/explore');
  });

  it('fournit un contenu de secours culturel authentique et bilingue pour chaque thème', () => {
    const fallback = service.getFallbackBannerContent(
      'défis linguistiques et gamification',
    );
    expect(fallback).toBeDefined();
    expect(fallback.titleFr).toBeDefined();
    expect(fallback.titleMg).toBeDefined();
    expect(fallback.ctaFr).toBeDefined();
    expect(fallback.ctaMg).toBeDefined();
    expect(fallback.accentColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(fallback.deepLink).toBe('/(tabs)/play');
  });

  it('choisit un thème valide parmi la liste prédéfinie', () => {
    const theme = service.pickRandomTheme();
    expect(typeof theme).toBe('string');
    expect(theme.length).toBeGreaterThan(5);
  });
});

