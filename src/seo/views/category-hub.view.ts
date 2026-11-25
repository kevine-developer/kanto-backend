import { HubCategoryConfig } from '../seo.service.js';
import {
  PUBLIC_HEADER_INTERACTION_SCRIPT,
  PUBLIC_SHELL_CSS,
  PUBLIC_THEME_INIT_SCRIPT,
  renderPublicFooter,
  renderPublicHeader,
  renderPublicReviewsSection,
} from '../../common/web/public-layout.js';

export interface CategoryHubItem {
  id: string;
  slug: string;
  title: string;
  translation: string;
  explanation?: string;
  url: string;
}

export interface CategoryHubPageOptions {
  config: HubCategoryConfig;
  items: CategoryHubItem[];
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderCategoryHubPage(options: CategoryHubPageOptions): string {
  const { config, items } = options;
  const canonicalUrl = `https://app-kanto.gastsar.fr/${config.slug}`;
  const year = new Date().getFullYear();

  // Données structurées Schema.org (BreadcrumbList + CollectionPage + Organization)
  const schemaBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://app-kanto.gastsar.fr/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: config.nameFr,
        item: canonicalUrl,
      },
    ],
  };

  const schemaCollection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: config.metaTitle,
    description: config.metaDescription,
    url: canonicalUrl,
    inLanguage: ['fr', 'mg'],
    isPartOf: {
      '@type': 'WebSite',
      name: 'Kanto MG',
      url: 'https://app-kanto.gastsar.fr',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kanto MG',
      url: 'https://app-kanto.gastsar.fr',
      logo: 'https://app-kanto.gastsar.fr/logo.png',
    },
    hasPart: items.map((item) => ({
      '@type': 'CreativeWork',
      name: item.title,
      description: item.translation,
      url: `https://app-kanto.gastsar.fr${item.url}`,
    })),
  };

  return `<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(config.metaTitle)}</title>
  <meta name="description" content="${escapeHtml(config.metaDescription)}">
  <meta name="theme-color" content="#0D0D0B">

  <!-- Indexation & Canonical -->
  <link rel="canonical" href="${canonicalUrl}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">

  <!-- Balises Hreflang multilingues -->
  <link rel="alternate" hreflang="fr" href="${canonicalUrl}">
  <link rel="alternate" hreflang="mg" href="${canonicalUrl}">
  <link rel="alternate" hreflang="x-default" href="${canonicalUrl}">

  <!-- Open Graph / Réseaux sociaux & Messageries -->
  <meta property="og:site_name" content="Kanto MG">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(config.metaTitle)}">
  <meta property="og:description" content="${escapeHtml(config.metaDescription)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="https://app-kanto.gastsar.fr/logo.png">
  <meta property="og:image:width" content="512">
  <meta property="og:image:height" content="512">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:locale:alternate" content="mg_MG">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(config.metaTitle)}">
  <meta name="twitter:description" content="${escapeHtml(config.metaDescription)}">
  <meta name="twitter:image" content="https://app-kanto.gastsar.fr/logo.png">

  <!-- Typographie & Favicon -->
  <link rel="icon" href="/favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Données Structurées Schema.org -->
  <script type="application/ld+json">
    ${JSON.stringify(schemaBreadcrumbs)}
  </script>
  <script type="application/ld+json">
    ${JSON.stringify(schemaCollection)}
  </script>

  ${PUBLIC_THEME_INIT_SCRIPT}

  <style>
    @font-face {
      font-family: 'LazyDog';
      src: url('/fonts/LazyDog.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }

    ${PUBLIC_SHELL_CSS}

    :root, [data-theme="light"], [data-theme="dark"] {
      --color-amber: var(--color-ochre);
      --color-text: var(--color-ink);
      --color-text-secondary: var(--color-ink-muted);
      --color-text-muted: var(--color-ink-subtle);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background-color: var(--color-bg);
      color: var(--color-text);
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      -webkit-font-smoothing: antialiased;
      transition: background-color 0.25s ease, color 0.25s ease;
    }
    main {
      flex: 1;
      max-width: 1040px;
      margin: 0 auto;
      width: 100%;
      padding: 28px 16px 52px;
    }
    @media (min-width: 768px) {
      main {
        padding: 40px 24px 72px;
      }
    }
    .breadcrumbs {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px 8px;
      font-size: 11.5px;
      color: var(--color-text-muted);
      margin-bottom: 22px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-weight: 600;
    }
    .breadcrumbs a {
      color: var(--color-text-secondary);
      text-decoration: none;
    }
    .breadcrumbs a:hover { color: var(--color-terracotta); }
    .hero-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 700;
      color: var(--color-terracotta);
      margin-bottom: 12px;
    }
    .hero-eyebrow::before {
      content: "";
      display: inline-block;
      width: 18px;
      height: 1.5px;
      background: var(--color-terracotta);
    }
    h1 {
      font-family: var(--font-serif);
      font-size: clamp(26px, 6.2vw, 44px);
      font-weight: 500;
      color: var(--color-heading);
      letter-spacing: -0.025em;
      line-height: 1.18;
      margin-bottom: 16px;
    }
    .hero-desc {
      font-size: 16px;
      color: var(--color-text-secondary);
      line-height: 1.65;
      max-width: 760px;
      margin-bottom: 36px;
    }
    .quote-box {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      padding: 22px 26px;
      border-radius: var(--radius-md);
      margin-bottom: 48px;
      border-top: 1px solid var(--color-border);
      border-right: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
    }
    .quote-box-mg {
      font-family: var(--font-serif);
      font-style: italic;
      font-weight: 500;
      color: var(--color-heading);
      font-size: 18px;
      line-height: 1.5;
      margin-bottom: 8px;
    }
    .quote-box-fr {
      font-size: 13.5px;
      color: var(--color-text-secondary);
      line-height: 1.55;
    }
    .section-head {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 12px;
    }
    @media (min-width: 560px) {
      .section-head {
        flex-direction: row;
        justify-content: space-between;
        align-items: baseline;
      }
    }
    .section-title {
      font-family: var(--font-serif);
      font-size: clamp(20px, 4.5vw, 24px);
      font-weight: 600;
      color: var(--color-heading);
      letter-spacing: -0.015em;
    }
    .section-meta {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--color-text-muted);
    }
    .content-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      margin-bottom: 40px;
    }
    @media (min-width: 640px) {
      .content-grid {
        grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
        gap: 18px;
        margin-bottom: 48px;
      }
    }
    .content-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 24px;
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    }
    .content-card:hover {
      border-color: var(--color-terracotta);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.06);
    }
    .card-title {
      font-family: var(--font-serif);
      font-size: 18px;
      font-weight: 600;
      color: var(--color-heading);
      margin-bottom: 10px;
      line-height: 1.35;
    }
    .card-trans {
      font-size: 13.5px;
      color: var(--color-text-secondary);
      margin-bottom: 16px;
      line-height: 1.55;
      flex: 1;
    }
    .card-link-more {
      font-size: 12px;
      font-weight: 700;
      color: var(--color-terracotta);
      display: inline-flex;
      align-items: center;
      gap: 5px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }
    .cta-banner {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 28px 18px;
      text-align: center;
      margin-top: 32px;
      position: relative;
    }
    @media (min-width: 640px) {
      .cta-banner {
        padding: 40px 32px;
        margin-top: 36px;
      }
    }
    .cta-banner::before {
      content: "";
      position: absolute;
      top: 0;
      left: 10%;
      right: 10%;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--color-terracotta), transparent);
    }
    .cta-title {
      font-family: var(--font-serif);
      font-size: clamp(22px, 5vw, 26px);
      font-weight: 600;
      color: var(--color-heading);
      margin-bottom: 10px;
      letter-spacing: -0.015em;
    }
    .cta-desc {
      font-size: 14.5px;
      color: var(--color-text-secondary);
      max-width: 600px;
      margin: 0 auto 24px;
      line-height: 1.6;
    }
    .btn-cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 46px;
      gap: 8px;
      background: var(--color-tanimbary);
      color: #FFFFFF;
      font-weight: 700;
      font-size: 13.5px;
      padding: 13px 18px;
      border-radius: var(--radius-md);
      text-decoration: none;
      letter-spacing: 0.3px;
      transition: background-color 0.15s ease, transform 0.15s ease;
    }
    @media (min-width: 540px) {
      .btn-cta {
        width: auto;
        padding: 13px 26px;
      }
    }
    .btn-cta:hover { background: var(--color-tanimbary-dark); transform: translateY(-1px); }
    .hub-nav-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid var(--color-border);
    }
    .tag-link {
      display: inline-flex;
      align-items: center;
      min-height: 40px;
      font-size: 12px;
      padding: 8px 14px;
      border-radius: 99px;
      border: 1px solid var(--color-border);
      color: var(--color-text-secondary);
      text-decoration: none;
      background: var(--color-surface);
      transition: border-color 0.15s ease, color 0.15s ease;
    }
    .tag-link:hover,
    .tag-link.active {
      border-color: var(--color-tanimbary);
      color: var(--color-tanimbary);
    }
  </style>
</head>
<body>
  ${renderPublicHeader({ activePath: `/${config.slug}` })}

  <main>
    <!-- Fil d'Ariane -->
    <nav class="breadcrumbs" aria-label="Fil d'Ariane">
      <a href="/">Accueil</a>
      <span>›</span>
      <span style="color: var(--color-heading);">${escapeHtml(config.nameFr)}</span>
    </nav>

    <!-- En-tête de catégorie -->
    <span class="hero-eyebrow">${escapeHtml(config.eyebrow)}</span>
    <h1>${escapeHtml(config.nameFr)} • ${escapeHtml(config.nameMg)}</h1>
    <p class="hero-desc">${escapeHtml(config.introTextFr)}</p>

    <!-- Citation en exergue -->
    <div class="quote-box">
      <div class="quote-box-mg">« ${escapeHtml(config.introTextMg)} »</div>
      <div class="quote-box-fr">${escapeHtml(config.culturalImportance)}</div>
    </div>

    <!-- Grille de contenus représentatifs -->
    <div class="section-head">
      <h2 class="section-title">Sélection &amp; Extraits Culturels</h2>
      <span class="section-meta">Corpus numérique Kanto</span>
    </div>
    <div class="content-grid">
      ${items
        .map(
          (item) => `
      <a href="${item.url}" class="content-card">
        <div>
          <h3 class="card-title">${escapeHtml(item.title)}</h3>
          <p class="card-trans">${escapeHtml(item.translation)}</p>
        </div>
        <span class="card-link-more">Lire l'explication complète →</span>
      </a>`,
        )
        .join('')}
    </div>

    <!-- Bannière de Call to Action (Application mobile) -->
    <div class="cta-banner">
      <h2 class="cta-title">Explorez tout le corpus avec l'application Kanto MG</h2>
      <p class="cta-desc">
        Téléchargez Kanto MG sur Android et iOS pour écouter les enregistrements audio authentiques, apprendre le vocabulaire et relever les quiz culturels quotidiens.
      </p>
      <a href="/#telechargement" class="btn-cta">
        Télécharger gratuitement sur Google Play &amp; TestFlight
      </a>
    </div>

    <!-- Navigation transversale / Maillage interne SEO -->
    <div class="hub-nav-tags">
      <span style="font-size: 12px; color: var(--color-text-muted); align-self: center;">Explorer aussi :</span>
      <a href="/ohabolana" class="tag-link${config.slug === 'ohabolana' ? ' active' : ''}">Ohabolana (Proverbes)</a>
      <a href="/angano" class="tag-link${config.slug === 'angano' ? ' active' : ''}">Angano (Contes)</a>
      <a href="/kabary" class="tag-link${config.slug === 'kabary' ? ' active' : ''}">Kabary (Discours)</a>
      <a href="/tononkalo" class="tag-link${config.slug === 'tononkalo' ? ' active' : ''}">Tononkalo (Poésie)</a>
      <a href="/raki-teny" class="tag-link${config.slug === 'raki-teny' ? ' active' : ''}">Raki-teny (Vocabulaire)</a>
      <a href="/histoire" class="tag-link${config.slug === 'histoire' ? ' active' : ''}">Histoire &amp; Patrimoine</a>
    </div>
  </main>

  ${renderPublicReviewsSection({ compact: true, contextLabel: `Patrimoine • ${config.nameFr}` })}

  ${renderPublicFooter({ currentYear: year })}
  ${PUBLIC_HEADER_INTERACTION_SCRIPT}
</body>
</html>`.trim();
}
