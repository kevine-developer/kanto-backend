import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export interface HubCategoryConfig {
  slug: string;
  nameMg: string;
  nameFr: string;
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  introTextFr: string;
  introTextMg: string;
  culturalImportance: string;
}

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
        'Allow: /ohabolana',
        'Allow: /angano',
        'Allow: /kabary',
        'Allow: /tononkalo',
        'Allow: /raki-teny',
        'Allow: /citations',
        'Allow: /histoire',
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

## Corpus Culturel Indexé
- Ohabolana (Proverbes & Sagesses) : https://app-kanto.gastsar.fr/ohabolana
- Angano (Contes & Légendes traditionnelles) : https://app-kanto.gastsar.fr/angano
- Kabary (Art oratoire & Discours rituels) : https://app-kanto.gastsar.fr/kabary
- Tononkalo (Poésie classique & Hainteny) : https://app-kanto.gastsar.fr/tononkalo
- Raki-teny (Mots rares, dialectes & vocabulaire) : https://app-kanto.gastsar.fr/raki-teny
- Histoire & Patrimoine national : https://app-kanto.gastsar.fr/histoire

## Fonctionnalités de l'Application Mobile
- Apprentissage interactif et ludique de la langue malgache (quiz civiques, jeux de mots, devinettes ankamantatra).
- Écoute audio haute définition en malgache et français.
- Mode hors-ligne pour la consultation en tout lieu à Madagascar et dans le monde.
- Défis multijoueurs culturels 1 contre 1 en temps réel.
- Bêta-test officiel : https://app-kanto.gastsar.fr/#panel-register

## Mentions Légales & Éthique
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

    // 1. Pages statiques et hubs culturels prioritaires
    const staticRoutes: {
      path: string;
      changefreq: string;
      priority: string;
    }[] = [
      { path: '', changefreq: 'daily', priority: '1.0' },
      { path: 'ohabolana', changefreq: 'weekly', priority: '0.9' },
      { path: 'angano', changefreq: 'weekly', priority: '0.9' },
      { path: 'kabary', changefreq: 'weekly', priority: '0.9' },
      { path: 'tononkalo', changefreq: 'weekly', priority: '0.9' },
      { path: 'raki-teny', changefreq: 'weekly', priority: '0.8' },
      { path: 'citations', changefreq: 'weekly', priority: '0.8' },
      { path: 'histoire', changefreq: 'monthly', priority: '0.8' },
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

  /**
   * Données des rubriques culturelles pour les Hubs éditoriaux
   */
  async getHubData(
    category:
      | 'ohabolana'
      | 'angano'
      | 'kabary'
      | 'tononkalo'
      | 'raki-teny'
      | 'histoire',
  ) {
    switch (category) {
      case 'ohabolana': {
        const items = await this.prisma.malagasyItem.findMany({
          where: { status: 'PUBLISHED' },
          orderBy: { viewCount: 'desc' },
          take: 12,
          select: {
            id: true,
            slug: true,
            malagasy: true,
            french: true,
            meaning: true,
            difficulty: true,
          },
        });
        return {
          config: {
            slug: 'ohabolana',
            nameMg: 'Ohabolana Malagasy',
            nameFr: 'Proverbes & Sagesses de Madagascar',
            eyebrow: 'Trésor de la Sagesse Ancestrale',
            metaTitle:
              'Ohabolana Malagasy • Proverbes Malgaches et Sagesses Ancestrales — Kanto MG',
            metaDescription:
              'Découvrez le trésor des proverbes malgaches (Ohabolana), leur traduction en français et leur sens philosophique profond. Apprenez la langue et les valeurs du Fihavanana.',
            introTextFr:
              "Les ohabolana sont le miroir de l'âme malgache. Témoins d'une tradition oratoire séculaire, ces proverbes transmettent les règles de vie en communauté, l'harmonie avec la nature et le respect des aînés.",
            introTextMg:
              "Ny ohabolana no haren-tsaina lomorina nentin'ny Ntaolo. Taratry ny fahendrena sy ny fomba fiaina mirindra eo anivon'ny fiarahamonina Malagasy.",
            culturalImportance:
              'Dans la culture malgache, manier le proverbe avec justesse est un signe éminent d’éloquence, de sagesse et de respect d’autrui.',
          },
          items: items.map((i) => ({
            id: i.id,
            slug: i.slug || i.id,
            title: i.malagasy,
            translation: i.french,
            explanation: i.meaning,
            url: `/ohabolana/${i.slug || i.id}`,
          })),
        };
      }

      case 'angano': {
        const contes = await this.prisma.conte.findMany({
          where: { status: 'PUBLISHED' },
          orderBy: { viewCount: 'desc' },
          take: 8,
          select: {
            id: true,
            slug: true,
            title: true,
            titleFr: true,
            subtitleFr: true,
            moralFr: true,
            author: true,
          },
        });
        return {
          config: {
            slug: 'angano',
            nameMg: 'Angano sy Tantara Malagasy',
            nameFr: 'Contes et Légendes de Madagascar',
            eyebrow: 'Transmission Orale & Féerie',
            metaTitle:
              'Angano Malagasy • Contes et Légendes Traditionnelles de Madagascar — Kanto MG',
            metaDescription:
              'Explorez les contes et mythes de Madagascar (Ibonia, Trimobe, Fara). Récits bilingues captivants et morales éducatives sur Kanto MG.',
            introTextFr:
              'De génération en génération, à la lueur des veillées, les angano bercent l’enfance malgache. Ils mettent en scène des animaux malicieux, des ogres légendaires et des héros porteurs de courage et de dignité.',
            introTextMg:
              'Ny angano no fanabeazana voalohany teo amin’ny Ntaolo. Tantara nentina nitaizana sy nananarana ny taranaka teo am-parafara.',
            culturalImportance:
              'L’angano n’est pas un simple divertissement : c’est un outil pédagogique fondamental inculquant le discernement du bien et du mal.',
          },
          items: contes.map((c) => ({
            id: c.id,
            slug: c.slug || c.id,
            title: `${c.title} (${c.titleFr})`,
            translation:
              c.subtitleFr || c.moralFr || 'Conte traditionnel malgache',
            explanation:
              c.moralFr || 'Morale ancestrale transmise par le conte.',
            url: `/angano/${c.slug || c.id}`,
          })),
        };
      }

      case 'kabary': {
        const kabaries = await this.prisma.kabary.findMany({
          where: { status: 'PUBLISHED' },
          orderBy: { viewCount: 'desc' },
          take: 8,
          select: {
            id: true,
            slug: true,
            title: true,
            titleFr: true,
            occasionFr: true,
            concludingProverbFr: true,
          },
        });
        return {
          config: {
            slug: 'kabary',
            nameMg: 'Kabary Malagasy',
            nameFr: 'Art Oratoire & Discours Rituels Malgaches',
            eyebrow: 'Patrimoine Culturel Immatériel',
            metaTitle:
              'Kabary Malagasy • Discours Rituels et Art Oratoire de Madagascar — Kanto MG',
            metaDescription:
              'Initiez-vous à l’art oratoire malgache (Kabary) inscrit au patrimoine immatériel de l’UNESCO. Formules rituelles, fiançailles, mariages et fêtes traditionnelles.',
            introTextFr:
              'Le Kabary est l’art suprême du verbe à Madagascar, reconnu au Patrimoine Culturel Immatériel de l’Humanité par l’UNESCO. Discours hautement codifié mêlant politesse, poésie et allusions imagées.',
            introTextMg:
              'Ny kabary dia haikanto amin’ny teny, fifampiresahana am-panajana sy am-pahendrena eo amin’ny foko sy ny fianakaviana Malagasy.',
            culturalImportance:
              'Le Mpikabary (orateur) tisse les liens de concorde et apaise les tensions grâce à l’élégance de la rhétorique malgache.',
          },
          items: kabaries.map((k) => ({
            id: k.id,
            slug: k.slug || k.id,
            title: `${k.title} — ${k.titleFr}`,
            translation: k.occasionFr || 'Discours rituel traditionnel',
            explanation:
              k.concludingProverbFr ||
              'Formule oratoire et protocole solennel.',
            url: `/kabary/${k.slug || k.id}`,
          })),
        };
      }

      case 'tononkalo': {
        const poesies = await this.prisma.poesie.findMany({
          where: { status: 'PUBLISHED' },
          orderBy: { viewCount: 'desc' },
          take: 8,
          select: {
            id: true,
            slug: true,
            title: true,
            titleFr: true,
            author: true,
            period: true,
          },
        });
        return {
          config: {
            slug: 'tononkalo',
            nameMg: 'Tononkalo sy Hainteny',
            nameFr: 'Poésie & Littérature Malgaches',
            eyebrow: 'Lyrisme & Hainteny',
            metaTitle:
              'Poésie Malgache (Tononkalo) • Hainteny et Auteurs Illustres — Kanto MG',
            metaDescription:
              'Découvrez la poésie malgache, du hainteny traditionnel aux œuvres majeures de Jean-Joseph Rabearivelo, Dox et Rado. Richesse lyrique de Madagascar.',
            introTextFr:
              'La poésie malgache (tononkalo) et le hainteny expriment les nuances les plus délicates de l’amour, de la mélancolie et de l’attachement à la terre natale (tanindrazana).',
            introTextMg:
              'Ny tononkalo sy ny hainteny dia fanehoana ny kanto sy ny halalin’ny fo amam-panahy Malagasy amin’ny alalan’ny voambolana mirindra.',
            culturalImportance:
              'Portée par de grands poètes nationaux, la poésie malgache célèbre la beauté linguistique et l’âme intemporelle de la Grande Île.',
          },
          items: poesies.map((p) => ({
            id: p.id,
            slug: p.slug || p.id,
            title: p.title,
            translation: p.titleFr,
            explanation: `Auteur : ${p.author || 'Traditionnel'} • Période : ${p.period || 'Classique'}`,
            url: `/tononkalo/${p.slug || p.id}`,
          })),
        };
      }

      case 'raki-teny': {
        return {
          config: {
            slug: 'raki-teny',
            nameMg: 'Raki-teny Malagasy',
            nameFr: 'Dictionnaire & Richesse Lexicale de Madagascar',
            eyebrow: 'Lexique & Nuances de la Langue',
            metaTitle:
              'Dictionnaire Malgache (Raki-teny) • Vocabulaire, Racines et Expressions — Kanto MG',
            metaDescription:
              'Enrichissez votre vocabulaire malgache : définitions bilingues, expressions idiomatiques, étymologie et finesses dialectales de Madagascar sur Kanto MG.',
            introTextFr:
              'Le malgache est une langue austronésienne d’une extraordinaire précision poétique et descriptive. Découvrez son lexique vivant, ses métaphores et ses tournures imagées.',
            introTextMg:
              'Ny raki-teny sy ny haren’ny voambolana malagasy no fitaratra mampiseho ny fomba fijery sy ny fahaiza-miaina nolovaina tamin’ireo razambe.',
            culturalImportance:
              'La maîtrise des mots justes renforce la civilité et permet de s’exprimer avec la bienséance (fahalalam-pomba) propre à Madagascar.',
          },
          items: [
            {
              id: '1',
              slug: 'ohabolana',
              title: 'Ohabolana Malagasy',
              translation: 'Proverbes et sagesses populaires',
              explanation: 'Les maximes morales transmises par les ancêtres.',
              url: '/ohabolana',
            },
            {
              id: '2',
              slug: 'angano',
              title: 'Angano sy Tantara',
              translation: 'Contes et récits héroïques',
              explanation: 'L’univers fantastique et éducatif des anciens.',
              url: '/angano',
            },
            {
              id: '3',
              slug: 'kabary',
              title: 'Kabary Malagasy',
              translation: 'L’éloquence traditionnelle',
              explanation: 'L’art oratoire codifié des cérémonies malgaches.',
              url: '/kabary',
            },
          ],
        };
      }

      case 'histoire': {
        return {
          config: {
            slug: 'histoire',
            nameMg: 'Tantara sy Vakoka Malagasy',
            nameFr: 'Histoire, Patrimoine & Langue Malgaches',
            eyebrow: 'Patrimoine National & Mémoire',
            metaTitle:
              'Histoire et Patrimoine de Madagascar • Traditions et Langue — Kanto MG',
            metaDescription:
              'Parcourez les grandes dates de l’histoire de Madagascar, les souverains illustres, les emblèmes nationaux et les fondements de la culture malgache sur Kanto MG.',
            introTextFr:
              'De la royauté merina aux dynasties côtières, des coutumes ancestrales aux symboles républicains, découvrez l’épopée d’un peuple fier de ses racines métissées.',
            introTextMg:
              'Ny tantaran’i Madagasikara sy ny vakoka navelan’ireo razana no fototra iorenan’ny firaisankina sy ny maha-isika antsika anio.',
            culturalImportance:
              'Comprendre l’histoire de Madagascar est la clé pour apprécier toute la richesse de sa culture vivante.',
          },
          items: [
            {
              id: '1',
              slug: 'ohabolana',
              title: 'Ohabolana Malagasy',
              translation: 'Proverbes et sagesses populaires',
              explanation: 'Les maximes morales transmises par les ancêtres.',
              url: '/ohabolana',
            },
            {
              id: '2',
              slug: 'angano',
              title: 'Angano sy Tantara',
              translation: 'Contes et récits héroïques',
              explanation: 'L’univers fantastique et éducatif des anciens.',
              url: '/angano',
            },
            {
              id: '3',
              slug: 'kabary',
              title: 'Kabary Malagasy',
              translation: 'L’éloquence traditionnelle',
              explanation: 'L’art oratoire codifié des cérémonies malgaches.',
              url: '/kabary',
            },
          ],
        };
      }

      default:
        return null;
    }
  }
}
