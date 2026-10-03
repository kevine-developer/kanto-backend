import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

/**
 * Structure attendue en sortie de Gemini pour une bannière marketing.
 * Tous les champs sont bilingues (français + malgache).
 */
export interface GeneratedBannerContent {
  badgeFr: string;
  badgeMg: string;
  titleFr: string;
  titleMg: string;
  descriptionFr: string;
  descriptionMg: string;
  ctaFr: string;
  ctaMg: string;
  accentColor: string;
  deepLink: string;
}

/**
 * Thèmes possibles pour varier les bannières générées.
 * Chaque thème correspond à un angle marketing différent de l'application Kanto.
 */
const BANNER_THEMES = [
  'apprentissage de la langue malgache (vocabulaire, proverbes)',
  'contes et récits traditionnels malgaches (angano)',
  'culture et patrimoine malgache (musique, danse, fady)',
  'quiz et jeux éducatifs sur Madagascar',
  'engagement communautaire et contributions des utilisateurs',
  'histoire et géographie de Madagascar',
  'kabary et art oratoire malgache',
  'poésie et littérature malgache',
  'défis linguistiques et gamification',
  "découverte des régions et dialectes de l'île",
] as const;

/**
 * Liens profonds disponibles dans l'application Kanto,
 * associés à leur thème pour permettre à Gemini de choisir le bon.
 */
const DEEP_LINKS: Record<string, string> = {
  vocabulaire: '/(tabs)/learn',
  proverbes: '/(tabs)/learn',
  contes: '/(tabs)/explore',
  culture: '/(tabs)/explore',
  quiz: '/(tabs)/play',
  jeux: '/(tabs)/play',
  communauté: '/(tabs)/community',
  contributions: '/(tabs)/community',
  histoire: '/(tabs)/explore',
  géographie: '/(tabs)/explore',
  kabary: '/(tabs)/explore',
  poésie: '/(tabs)/explore',
  défis: '/(tabs)/play',
  gamification: '/(tabs)/play',
  régions: '/(tabs)/explore',
  dialectes: '/(tabs)/learn',
};

@Injectable()
export class GeminiContentService {
  private readonly logger = new Logger(GeminiContentService.name);
  private ai: GoogleGenAI | null = null;

  private readonly model =
    process.env.GEMINI_CONTENT_MODEL || 'gemini-3.8-flash';

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey?.trim()) {
      this.ai = new GoogleGenAI({ apiKey: apiKey.trim() });
      this.logger.log(
        `✅ [GeminiContent] Initialisé avec modèle: "${this.model}"`,
      );
    } else {
      this.logger.warn(
        '⚠️ [GeminiContent] GEMINI_API_KEY non configurée — génération désactivée.',
      );
    }
  }

  isConfigured(): boolean {
    return !!process.env.GEMINI_API_KEY?.trim();
  }

  /**
   * Choisit un thème aléatoire parmi la liste pour varier les bannières.
   */
  pickRandomTheme(): string {
    const idx = Math.floor(Math.random() * BANNER_THEMES.length);
    return BANNER_THEMES[idx];
  }

  /**
   * Résout le deepLink le plus pertinent en fonction du thème choisi.
   */
  resolveDeepLink(theme: string): string {
    for (const [keyword, link] of Object.entries(DEEP_LINKS)) {
      if (theme.toLowerCase().includes(keyword)) {
        return link;
      }
    }
    return '/(tabs)/explore';
  }

  /**
   * Génère le contenu d'une bannière marketing bilingue via Gemini.
   * Retourne un objet structuré prêt à être inséré en base de données.
   *
   * @param theme - Le thème marketing à utiliser pour la génération
   * @throws Error si la génération échoue ou si le JSON retourné est invalide
   */
  async generateBannerContent(theme: string): Promise<GeneratedBannerContent> {
    if (!this.ai) {
      throw new Error(
        '[GeminiContent] Service non initialisé (GEMINI_API_KEY manquante)',
      );
    }

    const prompt = this.buildPrompt(theme);

    this.logger.log(
      `🎨 [GeminiContent] Génération bannière marketing — thème : "${theme}"`,
    );

    const maxRetries = 3;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.ai.models.generateContent({
          model: this.model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            temperature: 0.85,
            responseMimeType: 'application/json',
          },
        });

        const rawText =
          response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

        return this.parseResponse(rawText, theme);
      } catch (err: unknown) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        const isTemporary =
          msg.includes('503') ||
          msg.includes('UNAVAILABLE') ||
          msg.includes('high demand') ||
          msg.includes('429');

        if (isTemporary && attempt < maxRetries) {
          const delayMs = attempt * 3000;
          this.logger.warn(
            `⚠️ [GeminiContent] Tentative ${attempt}/${maxRetries} échouée (surcharge temporaire Gemini : ${msg}). Nouvelle tentative dans ${delayMs}ms...`,
          );
          await new Promise((res) => setTimeout(res, delayMs));
          continue;
        }

        throw err;
      }
    }

    throw lastError;
  }

  // ─── Privé ─────────────────────────────────────────────────────────────────

  private buildPrompt(theme: string): string {
    return `Tu es un expert en marketing culturel et en langue malgache.
Tu dois créer une bannière marketing pour l'application mobile Kanto, dédiée à la culture et à la langue malgache.

THÈME DE CETTE BANNIÈRE : ${theme}

Génère un objet JSON STRICT avec exactement ces champs (aucun champ supplémentaire, aucune explication) :

{
  "badgeFr": "Un badge court (2-3 mots, ex: Nouveau, Découverte, Défi du jour)",
  "badgeMg": "Traduction malgache du badge (2-3 mots)",
  "titleFr": "Un titre accrocheur en français (max 8 mots)",
  "titleMg": "Traduction malgache du titre (max 8 mots)",
  "descriptionFr": "Description engageante en français (1-2 phrases, max 100 caractères)",
  "descriptionMg": "Traduction malgache de la description (1-2 phrases, max 100 caractères)",
  "ctaFr": "Texte du bouton d'action en français (1-3 mots, ex: Découvrir, Jouer maintenant)",
  "ctaMg": "Texte du bouton d'action en malgache (1-3 mots)",
  "accentColor": "Une couleur hexadécimale moderne et vive cohérente avec le thème (ex: #4F46E5, #059669, #D97706)"
}

RÈGLES IMPORTANTES :
- Le texte malgache doit être en malagasy officiel (IMERINA), naturel et correct grammaticalement.
- Évite les anglicismes et les accents étrangers en malgache.
- L'accentColor doit être différente de #F59E0B (déjà utilisée).
- Le ton doit être chaleureux, culturel et engageant.
- Retourne UNIQUEMENT le JSON, sans texte avant ou après.`;
  }

  private parseResponse(
    rawText: string,
    theme: string,
  ): GeneratedBannerContent {
    // Extraction du bloc JSON (au cas où Gemini ajouterait du texte malgré la consigne)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(
        `[GeminiContent] Aucun JSON valide dans la réponse Gemini pour le thème "${theme}". Réponse brute : ${rawText.slice(0, 200)}`,
      );
    }

    let parsed: Record<string, string>;
    try {
      parsed = JSON.parse(jsonMatch[0]) as Record<string, string>;
    } catch {
      throw new Error(
        `[GeminiContent] JSON invalide retourné par Gemini pour le thème "${theme}": ${jsonMatch[0].slice(0, 200)}`,
      );
    }

    // Validation des champs obligatoires
    const required = [
      'badgeFr',
      'badgeMg',
      'titleFr',
      'titleMg',
      'descriptionFr',
      'descriptionMg',
      'ctaFr',
      'ctaMg',
      'accentColor',
    ];
    const missing = required.filter((f) => !parsed[f]);
    if (missing.length > 0) {
      throw new Error(
        `[GeminiContent] Champs manquants dans la réponse Gemini : ${missing.join(', ')}`,
      );
    }

    return {
      badgeFr: parsed.badgeFr,
      badgeMg: parsed.badgeMg,
      titleFr: parsed.titleFr,
      titleMg: parsed.titleMg,
      descriptionFr: parsed.descriptionFr,
      descriptionMg: parsed.descriptionMg,
      ctaFr: parsed.ctaFr,
      ctaMg: parsed.ctaMg,
      accentColor: parsed.accentColor,
      deepLink: this.resolveDeepLink(theme),
    };
  }
}
