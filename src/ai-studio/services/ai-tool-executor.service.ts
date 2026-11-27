import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AiToolDeclaration } from '../providers/ai-provider.interface.js';
import {
  sanitizeTextForLlm,
  wrapUntrustedContext,
} from '../utils/pii-sanitizer.util.js';
import { ContentStatus } from '../../../generated/prisma/client.js';

export interface ToolExecutionTrace {
  toolName: string;
  args: Record<string, unknown>;
  executedAt: string;
  durationMs: number;
  summary: string;
}

@Injectable()
export class AiToolExecutorService {
  private readonly logger = new Logger(AiToolExecutorService.name);

  constructor(private readonly prisma: PrismaService) {}

  getToolDeclarations(): AiToolDeclaration[] {
    return [
      {
        name: 'get_product_metrics',
        description:
          "Récupère les statistiques agrégées réelles de Kanto MG (utilisateurs, bêta-testeurs iOS/Android, volumes du corpus culturel, parcours Apprendre, bannières). Aucune donnée nominative. À appeler OBLIGATOIREMENT avant de citer le moindre chiffre.",
        parametersSchema: {
          type: 'object',
          properties: {
            periodDays: {
              type: 'integer',
              description:
                'Fenêtre d’analyse en jours pour les nouvelles inscriptions (ex: 7 ou 30). Défaut: 30.',
            },
          },
        },
      },
      {
        name: 'get_release_and_store_status',
        description:
          'Récupère les versions publiées Android/iOS (AppVersion, BetaVersion), les liens publics Play Store / Google Groups / Apple TestFlight et les disponibilités actuelles du programme bêta.',
        parametersSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'search_cultural_corpus',
        description:
          'Recherche en lecture seule dans le véritable corpus de Kanto MG (Ohabolana/Proverbes, Contes Angano, Kabary, Poésies Tononkalo, Mots rares Raki-teny, Citations) pour retrouver un texte vérifié avant toute rédaction culturelle.',
        parametersSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description:
                'Mot-clé, thème ou expression en malgache ou en français (ex: fihavanana, travail, patience, angano).',
            },
            category: {
              type: 'string',
              enum: [
                'ALL',
                'PROVERBE',
                'CONTE',
                'KABARY',
                'POESIE',
                'RAKI_TENY',
                'CITATION',
              ],
              description: 'Catégorie ciblée dans le corpus.',
            },
            limit: {
              type: 'integer',
              description: 'Nombre maximal de résultats par type (1 à 6).',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_community_feedback_summary',
        description:
          'Retourne une synthèse anonymisée et agrégée des avis AppReview et retours bêta-testeurs BetaFeedback (notes, répartition par catégorie, extraits nettoyés de toute PII).',
        parametersSchema: {
          type: 'object',
          properties: {
            limitSamples: {
              type: 'integer',
              description:
                "Nombre maximal d'extraits anonymisés à retourner (1 à 8).",
            },
          },
        },
      },
    ];
  }

  async executeTool(
    toolName: string,
    args: Record<string, unknown>,
  ): Promise<{ result: Record<string, unknown>; trace: ToolExecutionTrace }> {
    const start = Date.now();
    let result: Record<string, unknown>;
    let summary = '';

    switch (toolName) {
      case 'get_product_metrics': {
        const periodDays = this.clampInt(args.periodDays, 1, 365, 30);
        result = await this.getProductMetrics(periodDays);
        summary = `Métriques produit agrégées récupérées (${periodDays}j)`;
        break;
      }
      case 'get_release_and_store_status': {
        result = await this.getReleaseAndStoreStatus();
        summary = 'État des releases Android/iOS et liens stores récupérés';
        break;
      }
      case 'search_cultural_corpus': {
        const query = typeof args.query === 'string' ? args.query.trim() : '';
        const category =
          typeof args.category === 'string' ? args.category.toUpperCase() : 'ALL';
        const limit = this.clampInt(args.limit, 1, 6, 4);
        result = await this.searchCulturalCorpus(query, category, limit);
        summary = `Recherche corpus "${query.slice(0, 40)}" (${category})`;
        break;
      }
      case 'get_community_feedback_summary': {
        const limitSamples = this.clampInt(args.limitSamples, 1, 8, 5);
        result = await this.getCommunityFeedbackSummary(limitSamples);
        summary = 'Synthèse anonymisée des avis et retours bêta';
        break;
      }
      default: {
        result = {
          error: `Outil non autorisé ou inconnu : ${toolName}`,
        };
        summary = `Outil rejeté : ${toolName}`;
      }
    }

    const durationMs = Date.now() - start;
    this.logger.log(
      `[AiTool] ${toolName} exécuté en ${durationMs}ms — ${summary}`,
    );

    return {
      result,
      trace: {
        toolName,
        args,
        executedAt: new Date().toISOString(),
        durationMs,
        summary,
      },
    };
  }

  async getProductMetrics(periodDays: number): Promise<Record<string, unknown>> {
    const since = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersInPeriod,
      premiumUsers,
      vipUsers,
      totalBetaActive,
      betaAndroidCount,
      betaIosCount,
      betaConfirmedCount,
      totalItems,
      totalContes,
      contesAudioMg,
      totalKabary,
      totalPoesies,
      totalRecitations,
      totalRakiTeny,
      totalLearningTracks,
      totalLearningLessons,
      activeBannersCount,
      approvedReviewsCount,
      marketingTotals,
    ] = await Promise.all([
      this.prisma.user.count({ where: { banned: { not: true } } }),
      this.prisma.user.count({
        where: { createdAt: { gte: since }, banned: { not: true } },
      }),
      this.prisma.user.count({ where: { tier: 'PREMIUM' } }),
      this.prisma.user.count({ where: { tier: 'VIP' } }),
      this.prisma.betaTester.count({ where: { unsubscribedAt: null } }),
      this.prisma.betaTester.count({
        where: { unsubscribedAt: null, platforms: { has: 'ANDROID' } },
      }),
      this.prisma.betaTester.count({
        where: { unsubscribedAt: null, platforms: { has: 'IOS' } },
      }),
      this.prisma.betaTester.count({
        where: {
          unsubscribedAt: null,
          confirmationStatus: { in: ['CONFIRME', 'VERIFIE', 'INSTALLE'] },
        },
      }),
      this.prisma.malagasyItem.count({
        where: { status: ContentStatus.PUBLISHED },
      }),
      this.prisma.conte.count({ where: { status: ContentStatus.PUBLISHED } }),
      this.prisma.conte.count({
        where: { status: ContentStatus.PUBLISHED, audioUrlMg: { not: null } },
      }),
      this.prisma.kabary.count({ where: { status: ContentStatus.PUBLISHED } }),
      this.prisma.poesie.count({ where: { status: ContentStatus.PUBLISHED } }),
      this.prisma.recitation.count({
        where: { status: ContentStatus.PUBLISHED },
      }),
      this.prisma.rakiTenyWord.count({
        where: { status: ContentStatus.PUBLISHED },
      }),
      this.prisma.learningTrack.count({ where: { isPublished: true } }),
      this.prisma.learningLesson.count({ where: { isPublished: true } }),
      this.prisma.marketingBanner.count({ where: { isActive: true } }),
      this.prisma.appReview.count({
        where: {
          moderationStatus: 'APPROVED',
          isPublicationAuthorized: true,
        },
      }),
      this.prisma.marketingRequest.aggregate({
        _sum: {
          impressionsCount: true,
          clicksCount: true,
          conversionsCount: true,
        },
      }),
    ]);

    return {
      measuredAt: new Date().toISOString(),
      periodDays,
      users: {
        totalActive: totalUsers,
        newInPeriod: newUsersInPeriod,
        premiumTier: premiumUsers,
        vipTier: vipUsers,
      },
      betaProgram: {
        totalRegisteredActive: totalBetaActive,
        androidRequested: betaAndroidCount,
        iosRequested: betaIosCount,
        confirmedOrInstalled: betaConfirmedCount,
      },
      publishedCorpus: {
        malagasyItemsAndProverbs: totalItems,
        contes: totalContes,
        contesWithMalagasyAudio: contesAudioMg,
        kabary: totalKabary,
        poesies: totalPoesies,
        recitations: totalRecitations,
        rakiTenyWords: totalRakiTeny,
        learningTracks: totalLearningTracks,
        learningLessons: totalLearningLessons,
      },
      marketingAndReviews: {
        activeInAppBanners: activeBannersCount,
        publicApprovedReviews: approvedReviewsCount,
        partnerCampaignsImpressions: marketingTotals._sum.impressionsCount ?? 0,
        partnerCampaignsClicks: marketingTotals._sum.clicksCount ?? 0,
        partnerCampaignsConversions: marketingTotals._sum.conversionsCount ?? 0,
      },
      unavailableExternalMetrics: [
        'Statistiques Meta/Instagram/TikTok/YouTube/LinkedIn non connectées en base',
        'Analytics web de clics externes non trackés dans PostgreSQL',
      ],
    };
  }

  async getReleaseAndStoreStatus(): Promise<Record<string, unknown>> {
    const [appVersions, betaVersions, config] = await Promise.all([
      this.prisma.appVersion.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: 'desc' },
        take: 6,
        select: {
          platform: true,
          version: true,
          minVersion: true,
          buildNumber: true,
          titleFr: true,
          releaseNotesFr: true,
          storeUrl: true,
          publishedAt: true,
        },
      }),
      this.prisma.betaVersion.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { publishedAt: 'desc' },
        take: 6,
        select: {
          platform: true,
          version: true,
          buildNumber: true,
          title: true,
          releaseNotes: true,
          knownIssues: true,
          publishedAt: true,
        },
      }),
      this.prisma.betaAutomationConfig.findFirst({
        select: {
          playStoreWebLink: true,
          playStoreAppLink: true,
          appStorePublicLink: true,
          testFlightPublicLink: true,
          androidAvailability: true,
          iosAvailability: true,
          supportEmail: true,
        },
      }),
    ]);

    return {
      officialPortalUrl: 'https://app-kanto.gastsar.fr',
      androidGoogleGroupUrl: 'https://groups.google.com/g/communaute-kanto',
      automationConfig: config || null,
      publishedAppVersions: appVersions,
      activeBetaVersions: betaVersions,
    };
  }

  async searchCulturalCorpus(
    query: string,
    category: string,
    limit: number,
  ): Promise<Record<string, unknown>> {
    if (!query) {
      return {
        query,
        matches: [],
        note: 'Requête vide : aucun contenu culturel recherché.',
      };
    }

    const searchAll = category === 'ALL';
    const matches: Array<Record<string, unknown>> = [];

    if (searchAll || category === 'PROVERBE') {
      const items = await this.prisma.malagasyItem.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          OR: [
            { malagasy: { contains: query, mode: 'insensitive' } },
            { french: { contains: query, mode: 'insensitive' } },
            { meaning: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          slug: true,
          category: true,
          malagasy: true,
          french: true,
          meaning: true,
          example: true,
        },
      });
      for (const it of items) {
        matches.push({ type: it.category, ...it });
      }
    }

    if (searchAll || category === 'CONTE') {
      const contes = await this.prisma.conte.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { titleFr: { contains: query, mode: 'insensitive' } },
            { moralFr: { contains: query, mode: 'insensitive' } },
            { moralMg: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          slug: true,
          title: true,
          titleFr: true,
          moralMg: true,
          moralFr: true,
          author: true,
        },
      });
      for (const c of contes) {
        matches.push({ type: 'CONTE', ...c });
      }
    }

    if (searchAll || category === 'KABARY') {
      const kabaries = await this.prisma.kabary.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { titleFr: { contains: query, mode: 'insensitive' } },
            { occasion: { contains: query, mode: 'insensitive' } },
            { occasionFr: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          slug: true,
          title: true,
          titleFr: true,
          occasion: true,
          occasionFr: true,
          concludingProverbMg: true,
          concludingProverbFr: true,
        },
      });
      for (const k of kabaries) {
        matches.push({ type: 'KABARY', ...k });
      }
    }

    if (searchAll || category === 'POESIE') {
      const poesies = await this.prisma.poesie.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { titleFr: { contains: query, mode: 'insensitive' } },
            { author: { contains: query, mode: 'insensitive' } },
            { explanationFr: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          slug: true,
          title: true,
          titleFr: true,
          author: true,
          period: true,
          explanationFr: true,
        },
      });
      for (const p of poesies) {
        matches.push({ type: 'POESIE', ...p });
      }
    }

    if (searchAll || category === 'RAKI_TENY') {
      const words = await this.prisma.rakiTenyWord.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          OR: [
            { word: { contains: query, mode: 'insensitive' } },
            { meaningFr: { contains: query, mode: 'insensitive' } },
            { meaningMg: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          slug: true,
          word: true,
          phonetic: true,
          meaningMg: true,
          meaningFr: true,
          exampleMg: true,
          exampleFr: true,
        },
      });
      for (const w of words) {
        matches.push({ type: 'RAKI_TENY', ...w });
      }
    }

    if (searchAll || category === 'CITATION') {
      const citations = await this.prisma.citation.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          OR: [
            { citationMg: { contains: query, mode: 'insensitive' } },
            { citationFr: { contains: query, mode: 'insensitive' } },
            { sourceName: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          citationMg: true,
          citationFr: true,
          sourceName: true,
          author: { select: { name: true } },
        },
      });
      for (const ct of citations) {
        matches.push({
          type: 'CITATION',
          citationMg: ct.citationMg,
          citationFr: ct.citationFr,
          sourceName: ct.sourceName,
          authorName: ct.author?.name ?? null,
        });
      }
    }

    return {
      query,
      category,
      totalReturned: matches.length,
      matches,
      note:
        matches.length === 0
          ? 'Aucun élément publié ne correspond exactement dans le corpus vérifié. Ne pas inventer de proverbe ou citation.'
          : 'Contenus authentiques vérifiés issus de la base Kanto MG.',
    };
  }

  async getCommunityFeedbackSummary(
    limitSamples: number,
  ): Promise<Record<string, unknown>> {
    const [reviewAgg, feedbackByCategory, recentReviews, recentFeedbacks] =
      await Promise.all([
        this.prisma.appReview.aggregate({
          where: { moderationStatus: 'APPROVED' },
          _count: { id: true },
          _avg: { rating: true },
        }),
        this.prisma.betaFeedback.groupBy({
          by: ['category'],
          _count: { id: true },
        }),
        this.prisma.appReview.findMany({
          where: {
            moderationStatus: 'APPROVED',
            isPublicationAuthorized: true,
          },
          orderBy: { createdAt: 'desc' },
          take: limitSamples,
          select: {
            rating: true,
            category: true,
            comment: true,
            platform: true,
            appVersion: true,
          },
        }),
        this.prisma.betaFeedback.findMany({
          orderBy: { createdAt: 'desc' },
          take: limitSamples,
          select: {
            category: true,
            platform: true,
            status: true,
            title: true,
            description: true,
          },
        }),
      ]);

    const sanitizedReviewSamples = recentReviews.map((r, i) => ({
      index: i + 1,
      rating: r.rating,
      category: r.category,
      platform: r.platform,
      appVersion: r.appVersion,
      excerpt: wrapUntrustedContext(
        `app_review_${i + 1}`,
        sanitizeTextForLlm(r.comment).slice(0, 320),
      ),
    }));

    const sanitizedBetaFeedbackSamples = recentFeedbacks.map((f, i) => ({
      index: i + 1,
      category: f.category,
      platform: f.platform,
      status: f.status,
      excerpt: wrapUntrustedContext(
        `beta_feedback_${i + 1}`,
        sanitizeTextForLlm(`${f.title ? `${f.title} — ` : ''}${f.description}`).slice(
          0,
          320,
        ),
      ),
    }));

    return {
      approvedReviewsCount: reviewAgg._count.id,
      averageRating: reviewAgg._avg.rating
        ? Number(reviewAgg._avg.rating.toFixed(2))
        : null,
      betaFeedbackByCategory: feedbackByCategory.map((row) => ({
        category: row.category,
        count: row._count.id,
      })),
      sanitizedReviewSamples,
      sanitizedBetaFeedbackSamples,
    };
  }

  private clampInt(
    raw: unknown,
    min: number,
    max: number,
    fallback: number,
  ): number {
    const n = Number(raw);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(Math.max(Math.floor(n), min), max);
  }
}
