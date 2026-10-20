import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  Optional,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  renderDeeplinkGatewayPage,
  DeeplinkContentDetails,
} from './views/deeplink-gateway.view.js';

/**
 * DeeplinkController — Passerelle universelle de consultation et de deep linking Kanto MG
 *
 * Intercepte les accès web et scans de QR codes aux ressources culturelles et profils :
 * - /p/:id, /proverbe/:id, /ohabolana/:id
 * - /conte/:id, /angano/:id
 * - /kabary/:id, /discours/:id
 * - /citation/:id, /olon-kendry/:id
 * - /poesie/:id, /tononkalo/:id
 * - /recitation/:id, /tsianjery/:id
 * - /c/:id, /contribution/:id
 * - /u/:id, /user/:id, /profile/:username
 * - /ugc/:id, /deck/:id
 * - /multiplayer, /duel, /join
 * - /rank, /classement
 * - /download
 * - /.well-known/assetlinks.json (Android App Links)
 * - /.well-known/apple-app-site-association (iOS Universal Links)
 */
@Controller()
export class DeeplinkController {
  private readonly logger = new Logger(DeeplinkController.name);

  constructor(@Optional() private readonly prisma?: PrismaService) {}

  // ─── 1. Configuration Système & App Links / Universal Links ────────────────

  @Get('.well-known/assetlinks.json')
  getAssetLinks(@Res() res: Response): void {
    const packageName = 'com.devengalere.kantomg';
    const sha256Fingerprints = [
      process.env.ANDROID_SHA256_FINGERPRINT ||
        'FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C',
    ];

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.json([
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: packageName,
          sha256_cert_fingerprints: sha256Fingerprints,
        },
      },
    ]);
  }

  @Get('.well-known/apple-app-site-association')
  getAppleAppSiteAssociation(@Res() res: Response): void {
    const teamId = process.env.APPLE_TEAM_ID || 'TEAM_KANTO';
    const bundleId = 'com.devengalere.kantomg';

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.json({
      applinks: {
        apps: [],
        details: [
          {
            appID: `${teamId}.${bundleId}`,
            paths: [
              '/p/*',
              '/proverbe/*',
              '/ohabolana/*',
              '/expression/*',
              '/expressions/*',
              '/dicton/*',
              '/dictons/*',
              '/raki-teny/*',
              '/rakiteny/*',
              '/u/*',
              '/user/*',
              '/c/*',
              '/contribution/*',
              '/conte/*',
              '/angano/*',
              '/kabary/*',
              '/discours/*',
              '/poesie/*',
              '/tononkalo/*',
              '/recitation/*',
              '/tsianjery/*',
              '/citation/*',
              '/multiplayer*',
              '/rank*',
              '/classement*',
              '/ugc/*',
              '/deck/*',
              '/invite/*',
              '/parrainage/*',
              '/ref/*',
              '/referral*',
            ],
          },
        ],
      },
    });
  }

  // ─── 2. Proverbes & Ohabolana ──────────────────────────────────────────────

  @Get(['p/:id', 'proverbe/:id', 'ohabolana/:id'])
  async handleProverb(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    let content: DeeplinkContentDetails = {
      categoryLabel: 'Proverbe Malgache',
      badge: 'Ohabolana Malagasy',
    };
    let resolvedPath = `proverbe/${id}`;

    if (this.prisma && id) {
      try {
        const item = await this.prisma.malagasyItem.findFirst({
          where: {
            OR: [{ id }, { slug: id }],
            status: 'PUBLISHED',
          },
        });

        if (item) {
          content = {
            categoryLabel: item.category || 'Proverbe',
            badge: 'Ohabolana Malagasy',
            title: item.malagasy,
            textMg: item.malagasy,
            textFr: item.french,
            notes: item.meaning,
            author: item.origins?.[0] || 'Fahendrena Malagasy',
            metaInfo: 'Kanto MG',
          };
        } else {
          // Résilience rétrocompatible : Si un ancien lien /p/:id ciblait une contribution
          const contrib = await this.prisma.contribution.findFirst({
            where: { id, status: 'APPROVED' },
            include: { user: { select: { name: true, username: true } } },
          });

          if (contrib) {
            resolvedPath = `c/${id}`;
            content = {
              categoryLabel: contrib.category || 'Contribution',
              badge: 'Fandraisana anjara • Kanto',
              title: contrib.textMg,
              textMg: contrib.textMg,
              textFr: contrib.textFr || undefined,
              notes: contrib.meaning || undefined,
              author:
                contrib.user?.name ||
                (contrib.user?.username
                  ? `@${contrib.user.username}`
                  : 'Mpandray anjara Kanto'),
              metaInfo: 'Communauté Kanto MG',
            };
          } else {
            content.isNotFound = true;
          }
        }
      } catch (err) {
        this.logger.warn(`Erreur récupération proverbe ${id}: ${err}`);
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: resolvedPath,
        fullQueryString: qs,
        title: content.textMg
          ? `« ${content.textMg} » — Ohabolana Kanto MG`
          : 'Ohabolana Malagasy — Kanto MG',
        description:
          content.textFr ||
          'Découvrez ce trésor de la sagesse et de la culture malgache sur Kanto MG.',
        content,
      }),
    );
  }

  // ─── 2b. Expressions Imagées & Oha-pitenenana ───────────────────────────────

  @Get(['expression/:id', 'expressions/:id', 'oha-pitenenana/:id'])
  async handleExpression(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    let content: DeeplinkContentDetails = {
      categoryLabel: 'Expression Imagée',
      badge: 'Oha-pitenenana Malagasy',
    };

    if (this.prisma && id) {
      try {
        const item = await this.prisma.malagasyItem.findFirst({
          where: {
            OR: [{ id }, { slug: id }],
            status: 'PUBLISHED',
          },
        });

        if (item) {
          content = {
            categoryLabel: 'Expression Imagée',
            badge: 'Oha-pitenenana Malagasy',
            title: item.malagasy,
            textMg: item.malagasy,
            textFr: item.french,
            notes: item.meaning,
            author: item.origins?.[0] || 'Fahendrena Malagasy',
            metaInfo: 'Kanto MG',
          };
        } else {
          content.isNotFound = true;
        }
      } catch (err) {
        this.logger.warn(`Erreur récupération expression ${id}: ${err}`);
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `expression/${id}`,
        fullQueryString: qs,
        title: content.textMg
          ? `« ${content.textMg} » — Oha-pitenenana Kanto MG`
          : 'Oha-pitenenana Malagasy — Kanto MG',
        description:
          content.textFr ||
          'Découvrez cette expression imagée traditionnelle malgache sur Kanto MG.',
        content,
      }),
    );
  }

  // ─── 2c. Dictons Populaires & Fomba fiteny ──────────────────────────────────

  @Get(['dicton/:id', 'dictons/:id', 'fomba-fiteny/:id'])
  async handleDicton(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    let content: DeeplinkContentDetails = {
      categoryLabel: 'Dicton Populaire',
      badge: 'Fomba Fiteny Malagasy',
    };

    if (this.prisma && id) {
      try {
        const item = await this.prisma.malagasyItem.findFirst({
          where: {
            OR: [{ id }, { slug: id }],
            status: 'PUBLISHED',
          },
        });

        if (item) {
          content = {
            categoryLabel: 'Dicton Populaire',
            badge: 'Fomba Fiteny Malagasy',
            title: item.malagasy,
            textMg: item.malagasy,
            textFr: item.french,
            notes: item.meaning,
            author: item.origins?.[0] || 'Fahendrena Malagasy',
            metaInfo: 'Kanto MG',
          };
        } else {
          content.isNotFound = true;
        }
      } catch (err) {
        this.logger.warn(`Erreur récupération dicton ${id}: ${err}`);
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `dicton/${id}`,
        fullQueryString: qs,
        title: content.textMg
          ? `« ${content.textMg} » — Fomba Fiteny Kanto MG`
          : 'Fomba Fiteny Malagasy — Kanto MG',
        description:
          content.textFr ||
          'Découvrez ce dicton populaire traditionnel sur Kanto MG.',
        content,
      }),
    );
  }

  // ─── 2d. Mots Rares & Raki-teny Miafina ─────────────────────────────────────

  @Get(['raki-teny/:id', 'rakiteny/:id', 'word/:id', 'teny/:id', 'mot-rare/:id'])
  async handleRakiTeny(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    let content: DeeplinkContentDetails = {
      categoryLabel: 'Mot Rare Malgache',
      badge: 'Raki-teny Miafina',
    };

    if (this.prisma && id) {
      try {
        const word = await this.prisma.rakiTenyWord.findFirst({
          where: {
            OR: [{ id }, { slug: id }],
            status: 'PUBLISHED',
          },
        });

        if (word) {
          content = {
            categoryLabel: 'Raki-teny Miafina',
            badge: word.rarityLabelMg || 'Mot Rare',
            title: word.word,
            textMg: word.word,
            textFr: word.meaningFr,
            notes: word.meaningMg,
            author: word.wordClassFr || 'Dictionnaire Kanto',
            metaInfo: 'Kanto MG',
          };
        } else {
          content.isNotFound = true;
        }
      } catch (err) {
        this.logger.warn(`Erreur récupération mot rare ${id}: ${err}`);
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `raki-teny/${id}`,
        fullQueryString: qs,
        title: content.title
          ? `« ${content.title} » — Raki-teny Miafina Kanto MG`
          : 'Raki-teny Miafina — Kanto MG',
        description:
          content.textFr ||
          'Découvrez ce mot rare et insolite de la langue malgache sur Kanto MG.',
        content,
      }),
    );
  }

  // ─── 3. Contes & Angano ────────────────────────────────────────────────────

  @Get(['conte/:id', 'angano/:id'])
  async handleConte(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    let content: DeeplinkContentDetails = {
      categoryLabel: 'Conte Traditionnel',
      badge: 'Angano Malagasy',
    };

    if (this.prisma && id) {
      try {
        const conte = await this.prisma.conte.findFirst({
          where: {
            OR: [{ id }, { slug: id }],
            status: 'PUBLISHED',
          },
          include: {
            paragraphs: {
              take: 2,
              orderBy: { paragraphNumber: 'asc' },
            },
          },
        });

        if (conte) {
          const firstParagraphMg = conte.paragraphs?.[0]?.textMg || '';
          const firstParagraphFr = conte.paragraphs?.[0]?.textFr || '';
          content = {
            categoryLabel: 'Conte & Légende',
            badge: 'Angano Malagasy',
            title: `${conte.title} (${conte.titleFr})`,
            textMg: firstParagraphMg,
            textFr: firstParagraphFr,
            notes: conte.moralFr || conte.moralMg || undefined,
            author: conte.author || 'Tantara Malagasy',
            metaInfo: 'Kanto MG',
          };
        } else {
          content.isNotFound = true;
        }
      } catch (err) {
        this.logger.warn(`Erreur récupération conte ${id}: ${err}`);
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `conte/${id}`,
        fullQueryString: qs,
        title: content.title
          ? `${content.title} — Angano Kanto MG`
          : 'Angano sy Tantara Malagasy — Kanto MG',
        description:
          content.textFr ||
          'Découvrez ce conte et récit traditionnel du patrimoine malgache sur Kanto MG.',
        content,
      }),
    );
  }

  // ─── 4. Discours & Kabary ──────────────────────────────────────────────────

  @Get(['kabary/:id', 'discours/:id'])
  async handleKabary(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    let content: DeeplinkContentDetails = {
      categoryLabel: 'Art Oratoire',
      badge: 'Kabary Malagasy',
    };

    if (this.prisma && id) {
      try {
        const kabary = await this.prisma.kabary.findFirst({
          where: {
            OR: [{ id }, { slug: id }],
            status: 'PUBLISHED',
          },
          include: {
            steps: {
              take: 1,
              orderBy: { stepNumber: 'asc' },
            },
          },
        });

        if (kabary) {
          const firstStep = kabary.steps?.[0];
          content = {
            categoryLabel: 'Discours & Kabary',
            badge: `Kabary • ${kabary.occasion || 'Fomba Malagasy'}`,
            title: `${kabary.title} (${kabary.titleFr})`,
            textMg: firstStep?.textMg || undefined,
            textFr: firstStep?.textFr || undefined,
            notes:
              kabary.concludingProverbFr ||
              kabary.concludingProverbMg ||
              undefined,
            author: kabary.region || 'Kabary Ntaolo',
            metaInfo: 'Kanto MG',
          };
        } else {
          content.isNotFound = true;
        }
      } catch (err) {
        this.logger.warn(`Erreur récupération kabary ${id}: ${err}`);
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `kabary/${id}`,
        fullQueryString: qs,
        title: content.title
          ? `${content.title} — Kabary Kanto MG`
          : 'Kabary Malagasy — Kanto MG',
        description:
          content.textFr ||
          'Explorez cet extrait du discours traditionnel et les secrets du kabary malgache.',
        content,
      }),
    );
  }

  // ─── 5. Poésies & Tononkalo ────────────────────────────────────────────────

  @Get(['poesie/:id', 'tononkalo/:id'])
  async handlePoesie(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    let content: DeeplinkContentDetails = {
      categoryLabel: 'Poésie Malgache',
      badge: 'Tononkalo',
    };

    if (this.prisma && id) {
      try {
        const poesie = await this.prisma.poesie.findFirst({
          where: {
            OR: [{ id }, { slug: id }],
            status: 'PUBLISHED',
          },
          include: {
            stanzas: {
              take: 1,
              orderBy: { stanzaNumber: 'asc' },
            },
          },
        });

        if (poesie) {
          const firstStanza = poesie.stanzas?.[0];
          content = {
            categoryLabel: 'Poésie & Hainteny',
            badge: 'Tononkalo Malagasy',
            title: `${poesie.title} (${poesie.titleFr})`,
            textMg: firstStanza?.versesMg?.join('\n') || undefined,
            textFr: firstStanza?.versesFr?.join('\n') || undefined,
            notes: poesie.explanationFr || poesie.explanationMg || undefined,
            author: poesie.author || 'Mpanoratra Malagasy',
            metaInfo: 'Kanto MG',
          };
        } else {
          content.isNotFound = true;
        }
      } catch (err) {
        this.logger.warn(`Erreur récupération poésie ${id}: ${err}`);
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `poesie/${id}`,
        fullQueryString: qs,
        title: content.title
          ? `${content.title} — Tononkalo Kanto MG`
          : 'Tononkalo Malagasy — Kanto MG',
        description:
          content.textFr ||
          'Laissez-vous émouvoir par les vers et la poésie de la littérature malgache.',
        content,
      }),
    );
  }

  // ─── 6. Récitations & Tsianjery ────────────────────────────────────────────

  @Get(['recitation/:id', 'tsianjery/:id'])
  async handleRecitation(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    let content: DeeplinkContentDetails = {
      categoryLabel: 'Récitation',
      badge: 'Tsianjery',
    };

    if (this.prisma && id) {
      try {
        const recitation = await this.prisma.recitation.findFirst({
          where: {
            OR: [{ id }, { slug: id }],
            status: 'PUBLISHED',
          },
        });

        if (recitation) {
          content = {
            categoryLabel: 'Récitation & Mémoire',
            badge: 'Tsianjery Malagasy',
            title: `${recitation.title} (${recitation.titleFr})`,
            textMg:
              recitation.contentLines?.slice(0, 4)?.join('\n') || undefined,
            notes: recitation.description || undefined,
            author: recitation.author || 'Lova Tsianjery',
            metaInfo: 'Kanto MG',
          };
        } else {
          content.isNotFound = true;
        }
      } catch (err) {
        this.logger.warn(`Erreur récupération récitation ${id}: ${err}`);
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `recitation/${id}`,
        fullQueryString: qs,
        title: content.title
          ? `${content.title} — Tsianjery Kanto MG`
          : 'Tsianjery Malagasy — Kanto MG',
        description:
          recitationDescription(content) ||
          'Apprenez et déclamez ce texte du patrimoine éducatif malgache sur Kanto MG.',
        content,
      }),
    );
  }

  // ─── 7. Citations & Tenin'olon-kendry ───────────────────────────────────────

  @Get(['citation/:id', 'olon-kendry/:id'])
  async handleCitation(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    let content: DeeplinkContentDetails = {
      categoryLabel: 'Citation',
      badge: "Tenin'olon-kendry",
    };

    if (this.prisma && id) {
      try {
        const citation = await this.prisma.citation.findFirst({
          where: {
            id,
            status: 'PUBLISHED',
          },
          include: {
            author: { select: { name: true } },
          },
        });

        if (citation) {
          content = {
            categoryLabel: 'Pensée & Sagesse',
            badge: "Tenin'olon-kendry",
            title: `Citation de ${citation.author?.name || citation.sourceName}`,
            textMg: citation.citationMg,
            textFr: citation.citationFr,
            notes: citation.contexte || undefined,
            author: citation.author?.name || citation.sourceName,
            metaInfo: 'Kanto MG',
          };
        } else {
          content.isNotFound = true;
        }
      } catch (err) {
        this.logger.warn(`Erreur récupération citation ${id}: ${err}`);
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `citation/${id}`,
        fullQueryString: qs,
        title: content.textMg
          ? `« ${content.textMg} » — Kanto MG`
          : "Tenin'olon-kendry — Kanto MG",
        description:
          content.textFr ||
          'Découvrez cette pensée inspirante du patrimoine malgache sur Kanto MG.',
        content,
      }),
    );
  }

  // ─── 8. Contributions Communautaires ───────────────────────────────────────

  @Get(['c/:id', 'contribution/:id'])
  async handleContribution(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    let content: DeeplinkContentDetails = {
      categoryLabel: 'Contribution',
      badge: 'Fandraisana anjara',
    };

    if (this.prisma && id) {
      try {
        const contribution = await this.prisma.contribution.findUnique({
          where: { id },
          include: {
            user: { select: { name: true, username: true } },
          },
        });

        if (contribution && contribution.status === 'APPROVED') {
          const authorDisplay =
            contribution.user?.name ||
            (contribution.user?.username
              ? `@${contribution.user.username}`
              : 'Mpandray anjara Kanto');
          content = {
            categoryLabel: contribution.category || 'Contribution',
            badge: 'Fandraisana anjara • Kanto',
            title: contribution.textMg,
            textMg: contribution.textMg,
            textFr: contribution.textFr || undefined,
            notes: contribution.meaning || undefined,
            author: authorDisplay,
            metaInfo: 'Communauté Kanto MG',
          };
        } else {
          content.isNotFound = true;
        }
      } catch (err) {
        this.logger.warn(`Erreur récupération contribution ${id}: ${err}`);
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `contribution/${id}`,
        fullQueryString: qs,
        title: content.textMg
          ? `« ${content.textMg} » — Contribution Kanto MG`
          : 'Fandraisana anjara — Kanto MG',
        description:
          content.textFr ||
          'Découvrez cette contribution partagée au sein de la communauté Kanto MG.',
        content,
      }),
    );
  }

  // ─── 9. Profils Publics d'Utilisateurs ───────────────────────────────────────

  @Get(['u/:id', 'user/:id', 'profile/:id'])
  async handleUserProfile(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    let content: DeeplinkContentDetails = {
      categoryLabel: 'Membre Kanto',
      badge: 'Mombamomba ny Mpilalao',
    };

    if (this.prisma && id) {
      try {
        const user = await this.prisma.user.findFirst({
          where: {
            OR: [{ id }, { username: id }],
            NOT: { banned: true },
          },
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            progress: {
              select: {
                level: true,
                totalXp: true,
                streakDays: true,
              },
            },
          },
        });

        if (user) {
          content = {
            categoryLabel: 'Profil Explorateur',
            badge: 'Mombamomba ny Mpilalao',
            title: user.name || 'Membre Kanto',
            subtitle: user.username ? `@${user.username}` : undefined,
            author: 'Membre Kanto MG',
            metaInfo: 'Kanto MG',
            userStats: {
              level: user.progress?.level || 1,
              totalXp: user.progress?.totalXp || 0,
              streak: user.progress?.streakDays || 0,
              avatar: user.image,
            },
          };
        } else {
          content.isNotFound = true;
        }
      } catch (err) {
        this.logger.warn(`Erreur récupération profil ${id}: ${err}`);
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `user/${id}`,
        fullQueryString: qs,
        title: content.title
          ? `Profil de ${content.title} — Kanto MG`
          : 'Profil Membre — Kanto MG',
        description: `Découvrez la progression culturelle et les contributions de ${content.title || 'ce membre'} sur Kanto MG.`,
        content,
      }),
    );
  }

  // ─── 10. Decks UGC Communautaires ──────────────────────────────────────────

  @Get(['ugc/:id', 'deck/:id', 'deck'])
  async handleDeck(
    @Param('id') id: string | undefined,
    @Query('id') queryId: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const deckId = id || queryId || '';
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    let content: DeeplinkContentDetails = {
      categoryLabel: 'Quiz Communautaire',
      badge: 'Paquet de Questions UGC',
    };

    if (this.prisma && deckId) {
      try {
        const deck = await this.prisma.userQuizSet.findUnique({
          where: { id: deckId },
          select: {
            title: true,
            description: true,
            isPublic: true,
            author: {
              select: { name: true, username: true },
            },
            _count: {
              select: { questions: true },
            },
          },
        });

        if (deck && deck.isPublic) {
          const questionCount = deck._count?.questions || 0;
          content = {
            categoryLabel: 'Quiz Communautaire',
            badge: `Deck • ${questionCount} Fanontaniana`,
            title: deck.title,
            notes: deck.description || undefined,
            author: deck.author?.name || 'Créateur Kanto',
            metaInfo: 'Kanto MG',
          };
        } else {
          content.isNotFound = true;
        }
      } catch (err) {
        this.logger.warn(`Erreur récupération deck ${deckId}: ${err}`);
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: deckId ? `ugc/${deckId}` : 'ugc',
        fullQueryString: qs,
        title: content.title
          ? `Quiz « ${content.title} » — Kanto MG`
          : 'Paquet de Quiz Culturel — Kanto MG',
        description:
          content.notes ||
          'Relevez le défi de ce quiz créé par la communauté Kanto MG.',
        content,
      }),
    );
  }

  // ─── 11. Multijoueur, Duels & Salons ───────────────────────────────────────

  @Get(['multiplayer', 'duel', 'join'])
  handleMultiplayer(
    @Query('code') code: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    const content: DeeplinkContentDetails = {
      categoryLabel: 'Quiz Multijoueur',
      badge: code ? `Salon #${code}` : 'Lalao Fifaninanana',
      title: code
        ? `Défi Multijoueur • Code : ${code}`
        : 'Kanto Quiz Multijoueur',
      textMg:
        'Andao hifanina amin’ny fahalalana ny kolontsaina sy ny fahendrena malagasy !',
      textFr:
        'Rejoignez la partie en direct et testez vos connaissances sur la culture malgache.',
      author: 'Kanto MG',
      metaInfo: 'Salon Multijoueur',
    };

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: 'multiplayer',
        fullQueryString: qs,
        title: code
          ? `Rejoindre la partie ${code} — Kanto MG`
          : 'Quiz Multijoueur en Direct — Kanto MG',
        description:
          'Entrez dans le salon de jeu multijoueur Kanto MG et défiez vos amis.',
        content,
      }),
    );
  }

  // ─── 12. Classement & Rangs ────────────────────────────────────────────────

  @Get(['classement', 'rank'])
  handleLeaderboard(
    @Query('scope') scope: string | undefined,
    @Query('level') level: string | undefined,
    @Query('user') user: string | undefined,
    @Query('userId') userId: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    const targetUser = user || userId;
    const content: DeeplinkContentDetails = {
      categoryLabel: targetUser ? 'Profil Joueur' : 'Classement',
      badge: level ? `Dingana ${level}` : 'Filaharana Voninahitra',
      title: targetUser
        ? `Progression de ${targetUser} (Niveau ${level || '1'})`
        : "Classement d'Honneur Kanto MG",
      textMg:
        'Jereo ireo mpikaroka sy mpiaro ny teny ary ny kolontsaina malagasy.',
      textFr:
        'Consultez les meilleurs explorateurs de la culture malgache sur Kanto MG.',
      author: 'Kanto MG',
      metaInfo: scope === 'level' ? 'Par niveau' : 'Général',
    };

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: targetUser ? `u/${targetUser}` : 'classement',
        fullQueryString: qs,
        title: targetUser
          ? `Profil de ${targetUser} — Kanto MG`
          : "Classement d'Honneur — Kanto MG",
        description:
          'Découvrez les membres les plus actifs et le tableau des scores sur Kanto MG.',
        content,
      }),
    );
  }

  // ─── 12b. Hubs & Catégories Culturelles Directes ─────────────────────────────

  @Get([
    'proverbes',
    'expressions',
    'dictons',
    'contes',
    'kabary',
    'poesies',
    'recitations',
    'citations',
    'raki-teny',
    'civique',
    'games',
    'communaute',
    'categories',
  ])
  handleCategoryHub(@Req() req: Request, @Res() res: Response): void {
    const rawPath = req.path.replace(/^\/+|\/+$/g, '').toLowerCase();
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';

    const titles: Record<string, { title: string; desc: string }> = {
      proverbes: {
        title: 'Proverbes Malgaches (Ohabolana)',
        desc: 'Explorez la sagesse ancestrale et les proverbes de Madagascar.',
      },
      expressions: {
        title: 'Expressions Imagées (Oha-pitenenana)',
        desc: 'Découvrez la richesse métaphorique de la langue malgache.',
      },
      dictons: {
        title: 'Dictons Populaires (Fomba fiteny)',
        desc: 'Retrouvez les formules et dictons du quotidien malgache.',
      },
      contes: {
        title: 'Contes Traditionnels (Angano)',
        desc: 'Plongez dans les légendes et mythes oraux de Madagascar.',
      },
      kabary: {
        title: 'Art Oratoire & Discours (Kabary)',
        desc: 'Apprenez les discours rituels et l’art du verbe malgache.',
      },
      poesies: {
        title: 'Poésies & Hainteny (Tononkalo)',
        desc: 'Anthologie de la poésie et des jeux poétiques traditionnels.',
      },
      recitations: {
        title: 'Récitations & Mémoire (Tsianjery)',
        desc: 'Les textes classiques de récitation du patrimoine malgache.',
      },
      citations: {
        title: 'Citations & Pensées de Sages (Tenin-drazana)',
        desc: 'Les paroles mémorables des grands penseurs et sages malgaches.',
      },
      'raki-teny': {
        title: 'Dictionnaire des Mots Rares (Raki-teny Miafina)',
        desc: 'Trésors lexicaux et perles méconnues de la langue malgache.',
      },
      civique: {
        title: 'Éducation Civique & Institutions',
        desc: 'Citoyenneté, droits et histoire des institutions malgaches.',
      },
      games: {
        title: 'Jeux & Quiz Culturels',
        desc: 'Jouez, testez vos connaissances et grimpez dans le classement.',
      },
      communaute: {
        title: 'Espace Communautaire Kanto',
        desc: 'Partagez vos proverbes, contes et échangez avec la communauté.',
      },
      categories: {
        title: 'Toutes les Catégories Culturelles',
        desc: 'Accédez à l’ensemble du patrimoine et des trésors Kanto MG.',
      },
    };

    const info = titles[rawPath] || {
      title: 'Culture & Patrimoine Malgache',
      desc: 'Découvrez le riche héritage de Madagascar sur Kanto MG.',
    };

    const content: DeeplinkContentDetails = {
      categoryLabel: 'Catégorie Culturelle',
      badge: 'Vakoka Malagasy',
      title: info.title,
      textMg: 'Tsidiho ny tahirin-kevitra sy ny vakoka malagasy ato amin’ny Kanto MG.',
      textFr: info.desc,
      author: 'Kanto MG',
      metaInfo: 'Patrimoine & Culture',
    };

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: rawPath,
        fullQueryString: qs,
        title: `${info.title} — Kanto MG`,
        description: info.desc,
        content,
      }),
    );
  }

  // ─── 13. Page de Téléchargement Officielle (/download) ─────────────────────

  @Get('download')
  handleDownload(@Req() req: Request, @Res() res: Response): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    const content: DeeplinkContentDetails = {
      categoryLabel: 'Application Mobile',
      badge: 'Androany sy Rahampitso',
      title: "Kanto MG — L'application du patrimoine malgache",
      textMg:
        'Kolontsaina, ohabolana, angano, kabary ary teny malagasy eo am-pelatananao.',
      textFr:
        'Culture, proverbes, contes, discours et langue malgache à portée de main.',
      author: 'Kanto MG',
      metaInfo: 'Disponible sur Android & iOS',
    };

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: 'download',
        fullQueryString: qs,
        title: "Télécharger l'application Kanto MG",
        description:
          'Installez Kanto MG sur votre smartphone pour explorer la culture et la sagesse malgaches.',
        content,
      }),
    );
  }

  // ─── 14. Parrainage & Invitations Personnelles (/invite/:code, /parrainage/:code) ────

  @Get(['invite/:code', 'parrainage/:code', 'ref/:code', 'join/:code'])
  async handleReferralInvite(
    @Param('code') rawCode: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const code = (rawCode || '').trim().toUpperCase();
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';

    let referrerName = 'Un membre Kanto MG';
    let referrerAvatar: string | undefined;

    if (this.prisma && code) {
      try {
        const referralCode = await this.prisma.referralCode.findUnique({
          where: { code },
          include: {
            user: {
              select: {
                name: true,
                username: true,
                image: true,
                banned: true,
              },
            },
          },
        });

        if (referralCode && !referralCode.user?.banned) {
          referrerName = referralCode.user.name || (referralCode.user.username ? `@${referralCode.user.username}` : 'Un ami Kanto');
          referrerAvatar = referralCode.user.image || undefined;

          // Incrément non bloquant des clics
          this.prisma.referralCode.update({
            where: { id: referralCode.id },
            data: { clicksCount: { increment: 1 } },
          }).catch(() => {});
        }
      } catch (err) {
        this.logger.warn(`Erreur récupération invitation parrainage ${code}: ${err}`);
      }
    }

    const content: DeeplinkContentDetails = {
      categoryLabel: 'Invitation Kanto MG',
      badge: `Code : ${code}`,
      title: `${referrerName} vous invite sur Kanto MG`,
      textMg: `Asain'i ${referrerName} ianao hanatevin-daharana ny fianakaviamben'ny Kanto MG ! Mahazoa +100 XP sy +20 Vola avy hatrany amin'ny fidiranao.`,
      textFr: `${referrerName} vous invite à découvrir la richesse de la langue et de la culture malgaches sur Kanto MG ! Obtenez +100 XP et +20 Vola dès votre inscription.`,
      notes: `Utilisez le code de parrainage : ${code}`,
      author: referrerName,
      metaInfo: 'Programme de Parrainage Kanto MG',
      userStats: referrerAvatar ? {
        level: 1,
        totalXp: 0,
        streak: 0,
        avatar: referrerAvatar,
      } : undefined,
    };

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `referral?code=${encodeURIComponent(code)}`,
        fullQueryString: qs,
        title: `Rejoignez ${referrerName} sur Kanto MG (Code : ${code})`,
        description: `${referrerName} vous parraine sur Kanto MG. Découvrez proverbes, contes, sagesses et gagnez vos récompenses de bienvenue.`,
        content,
      }),
    );
  }
}

function recitationDescription(content: DeeplinkContentDetails): string {
  if (content.notes) return content.notes;
  return 'Apprenez et déclamez ce texte du patrimoine éducatif malgache sur Kanto MG.';
}
