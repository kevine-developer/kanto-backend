import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SeoService {
  private readonly logger = new Logger(SeoService.name);
  private cachedSitemap: { xml: string; generatedAt: number } | null = null;
  private readonly SITEMAP_CACHE_TTL = 3600 * 1000; // 1 heure

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Génère le fichier robots.txt selon le domaine d'origine
   */
  getRobotsTxt(host?: string): string {
    const isDisallowedDomain =
      !host || host.startsWith('admin.') || host.startsWith('api.');
    const isPublicAppDomain =
      !isDisallowedDomain &&
      (host.includes('app-kanto') ||
        host === 'kanto.mg' ||
        host.startsWith('app.') ||
        host.startsWith('www.'));

    if (isPublicAppDomain) {
      return [
        'User-agent: *',
        'Allow: /',
        'Allow: /p/',
        'Allow: /c/',
        'Allow: /u/',
        'Allow: /pages/',
        'Disallow: /api/',
        'Disallow: /admin/',
        'Disallow: /confirmation',
        'Disallow: /reset-password',
        '',
        'Sitemap: https://app-kanto.gastsar.fr/sitemap.xml',
      ].join('\n');
    }

    // Par défaut (API backend, etc.) : interdire l'indexation directe
    return 'User-agent: *\nDisallow: /\n';
  }

  /**
   * Génère le fichier llms.txt (standard GEO pour les moteurs et agents IA)
   */
  getLlmsTxt(): string {
    return `# Kanto MG — Sanctuaire Numérique du Patrimoine & de la Culture Malgache
> Portail officiel : https://app-kanto.gastsar.fr
> Application mobile officielle pour Android et iOS dédiée à l'apprentissage de la langue malgache, aux proverbes ancestraux (Ohabolana), contes traditionnels (Angano), discours rituels (Kabary), poésie (Tononkalo) et histoire de Madagascar.

## Présentation & Mission
Kanto MG est une plateforme culturelle et éducative malgache valorisant les valeurs cardinales du Fihavanana (solidarité, concorde fraternelle) et de l'Haja (respect mutuel et dignité). Elle propose une transmission authentique, vérifiée et bilingue (Malgache officiel et Français) des traditions orales et de la littérature de Madagascar.

## Fonctionnalités de l'Application Mobile
- Apprentissage interactif et ludique de la langue malgache (quiz civiques, jeux de mots, devinettes ankamantatra).
- Écoute audio haute définition en malgache et français.
- Accès hors-ligne partiel sur certains contenus déjà chargés (stabilisation complète en cours).
- Défis multijoueurs culturels 1 contre 1 en temps réel.
- Bêta-test officiel : https://app-kanto.gastsar.fr/#inscription

## Mentions Légales & Éthique
- À propos de Kanto MG : https://app-kanto.gastsar.fr/pages/about
- Centre d'aide : https://app-kanto.gastsar.fr/pages/help
- Conditions Générales d'Utilisation : https://app-kanto.gastsar.fr/pages/terms
- Politique de Confidentialité & RGPD : https://app-kanto.gastsar.fr/pages/privacy
- Contact support officiel : support@kanto.mg
`;
  }

  /**
   * Génère dynamiquement le sitemap.xml avec mise en cache
   */
  async getSitemapXml(): Promise<string> {
    const now = Date.now();
    if (
      this.cachedSitemap &&
      now - this.cachedSitemap.generatedAt < this.SITEMAP_CACHE_TTL
    ) {
      return this.cachedSitemap.xml;
    }

    const baseUrl = 'https://app-kanto.gastsar.fr';
    const currentDate = new Date().toISOString().split('T')[0];

    // 1. Pages publiques actives sur app-kanto.gastsar.fr
    const staticRoutes: {
      path: string;
      changefreq: string;
      priority: string;
    }[] = [
      { path: '', changefreq: 'daily', priority: '1.0' },
      { path: 'pages/about', changefreq: 'monthly', priority: '0.7' },
      { path: 'pages/help', changefreq: 'monthly', priority: '0.6' },
      { path: 'pages/terms', changefreq: 'monthly', priority: '0.5' },
      { path: 'pages/privacy', changefreq: 'monthly', priority: '0.5' },
    ];

    const dynamicUrls: {
      loc: string;
      lastmod: string;
      changefreq: string;
      priority: string;
    }[] = [];

    try {
      // 2. Extraire les contenus culturels publiés dans Prisma
      const [items, contes, kabaries, poesies, citations] = await Promise.all([
        this.prisma.malagasyItem.findMany({
          where: { status: 'PUBLISHED' },
          select: { slug: true, id: true, updatedAt: true },
          take: 500,
        }),
        this.prisma.conte.findMany({
          where: { status: 'PUBLISHED' },
          select: { slug: true, id: true, updatedAt: true },
          take: 200,
        }),
        this.prisma.kabary.findMany({
          where: { status: 'PUBLISHED' },
          select: { slug: true, id: true, updatedAt: true },
          take: 200,
        }),
        this.prisma.poesie.findMany({
          where: { status: 'PUBLISHED' },
          select: { slug: true, id: true, updatedAt: true },
          take: 200,
        }),
        this.prisma.citation.findMany({
          where: { status: 'PUBLISHED' },
          select: { id: true, updatedAt: true },
          take: 200,
        }),
      ]);

      // Proverbes & expressions
      for (const item of items) {
        const identifier = item.slug || item.id;
        dynamicUrls.push({
          loc: `${baseUrl}/ohabolana/${encodeURIComponent(identifier)}`,
          lastmod: item.updatedAt.toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.8',
        });
      }

      // Contes (Angano)
      for (const c of contes) {
        const identifier = c.slug || c.id;
        dynamicUrls.push({
          loc: `${baseUrl}/angano/${encodeURIComponent(identifier)}`,
          lastmod: c.updatedAt.toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.8',
        });
      }

      // Kabary
      for (const k of kabaries) {
        const identifier = k.slug || k.id;
        dynamicUrls.push({
          loc: `${baseUrl}/kabary/${encodeURIComponent(identifier)}`,
          lastmod: k.updatedAt.toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.8',
        });
      }

      // Poésies (Tononkalo)
      for (const p of poesies) {
        const identifier = p.slug || p.id;
        dynamicUrls.push({
          loc: `${baseUrl}/tononkalo/${encodeURIComponent(identifier)}`,
          lastmod: p.updatedAt.toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.8',
        });
      }

      // Citations
      for (const cit of citations) {
        dynamicUrls.push({
          loc: `${baseUrl}/citation/${encodeURIComponent(cit.id)}`,
          lastmod: cit.updatedAt.toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.7',
        });
      }
    } catch (err) {
      this.logger.warn(
        `[SEO] Erreur chargement URLs dynamiques sitemap: ${err}`,
      );
    }

    // Construction du XML Sitemap
    const urlElements = [
      ...staticRoutes.map(
        (r) => `  <url>
    <loc>${baseUrl}/${r.path ? r.path : ''}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
      ),
      ...dynamicUrls.map(
        (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
      ),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements.join('\n')}
</urlset>`.trim();

    this.cachedSitemap = { xml, generatedAt: now };
    return xml;
  }
}
