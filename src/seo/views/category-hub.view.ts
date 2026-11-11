import { HubCategoryConfig } from '../seo.service.js';

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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
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
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Données Structurées Schema.org -->
  <script type="application/ld+json">
    ${JSON.stringify(schemaBreadcrumbs)}
  </script>
  <script type="application/ld+json">
    ${JSON.stringify(schemaCollection)}
  </script>

  <script>
    (function() {
      try {
        var savedTheme = localStorage.getItem('kanto_theme');
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {}
    })();
  </script>

  <style>
    @font-face {
      font-family: 'LazyDog';
      src: url('/fonts/LazyDog.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    :root, [data-theme="dark"] {
      --color-bg: #0D0D0B;
      --color-surface: #141412;
      --color-surface-hover: #1E1E1B;
      --color-border: #242420;
      --color-divider: #282824;
      --color-tanimbary: #6B9E61;
      --color-tanimbary-dark: #16442A;
      --color-ochre: #C58B38;
      --color-text: #F0F0EC;
      --color-text-secondary: #9C9C98;
      --color-text-muted: #707070;
      --color-heading: #FFFFFF;
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
    }
    [data-theme="light"] {
      --color-bg: #F5F4F0;
      --color-surface: #FEFEFC;
      --color-surface-hover: #F2F1EC;
      --color-border: #E2E0D8;
      --color-divider: #ECEAE3;
      --color-tanimbary: #4A6741;
      --color-tanimbary-dark: #16442A;
      --color-ochre: #A67026;
      --color-text: #1A1A1A;
      --color-text-secondary: #5C5C58;
      --color-text-muted: #8C8C88;
      --color-heading: #111110;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--color-bg);
      color: var(--color-text);
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--color-border);
      max-width: 960px;
      margin: 0 auto;
      width: 100%;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 11px;
      text-decoration: none;
      color: inherit;
    }
    .brand-logo { width: 36px; height: 36px; border-radius: 8px; }
    .brand-title {
      font-family: 'LazyDog', cursive, sans-serif;
      font-size: 24px;
      color: var(--color-heading);
    }
    .brand-sub {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: var(--color-tanimbary);
      font-weight: 700;
    }
    main {
      flex: 1;
      max-width: 960px;
      margin: 0 auto;
      width: 100%;
      padding: 32px 20px 60px;
    }
    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--color-text-muted);
      margin-bottom: 24px;
    }
    .breadcrumbs a {
      color: var(--color-text-secondary);
      text-decoration: none;
    }
    .breadcrumbs a:hover { color: var(--color-tanimbary); }
    .hero-eyebrow {
      display: inline-block;
      font-size: 11.5px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 700;
      color: var(--color-ochre);
      margin-bottom: 8px;
    }
    h1 {
      font-size: 32px;
      font-weight: 800;
      color: var(--color-heading);
      letter-spacing: -0.025em;
      line-height: 1.25;
      margin-bottom: 14px;
    }
    .hero-desc {
      font-size: 15px;
      color: var(--color-text-secondary);
      line-height: 1.6;
      max-width: 720px;
      margin-bottom: 28px;
    }
    .quote-box {
      background: var(--color-surface);
      border-left: 4px solid var(--color-tanimbary);
      padding: 16px 20px;
      border-radius: 0 var(--radius-md) var(--radius-md) 0;
      margin-bottom: 36px;
      border-top: 1px solid var(--color-border);
      border-right: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
    }
    .quote-box-mg {
      font-style: italic;
      font-weight: 600;
      color: var(--color-heading);
      font-size: 14.5px;
      margin-bottom: 6px;
    }
    .quote-box-fr {
      font-size: 13px;
      color: var(--color-text-secondary);
    }
    .section-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--color-heading);
      margin-bottom: 16px;
      letter-spacing: -0.015em;
    }
    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 40px;
    }
    .content-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 20px;
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.15s ease, border-color 0.15s ease;
    }
    .content-card:hover {
      border-color: var(--color-tanimbary);
      transform: translateY(-2px);
    }
    .card-title {
      font-size: 15px;
      font-weight: 700;
      color: var(--color-heading);
      margin-bottom: 8px;
      line-height: 1.4;
    }
    .card-trans {
      font-size: 13px;
      color: var(--color-text-secondary);
      margin-bottom: 12px;
      line-height: 1.5;
      flex: 1;
    }
    .card-link-more {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-tanimbary);
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .cta-banner {
      background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-hover) 100%);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 32px 28px;
      text-align: center;
      margin-top: 30px;
    }
    .cta-title {
      font-size: 20px;
      font-weight: 800;
      color: var(--color-heading);
      margin-bottom: 8px;
    }
    .cta-desc {
      font-size: 13.5px;
      color: var(--color-text-secondary);
      max-width: 560px;
      margin: 0 auto 20px;
    }
    .btn-cta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--color-tanimbary);
      color: #FFFFFF;
      font-weight: 700;
      font-size: 13.5px;
      padding: 12px 24px;
      border-radius: var(--radius-md);
      text-decoration: none;
      transition: opacity 0.15s ease;
    }
    .btn-cta:hover { opacity: 0.9; }
    .hub-nav-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--color-divider);
    }
    .tag-link {
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 99px;
      border: 1px solid var(--color-border);
      color: var(--color-text-secondary);
      text-decoration: none;
      background: var(--color-surface);
    }
    .tag-link:hover {
      border-color: var(--color-tanimbary);
      color: var(--color-heading);
    }
    footer {
      border-top: 1px solid var(--color-border);
      padding: 24px 20px;
      font-size: 12px;
      color: var(--color-text-muted);
      text-align: center;
      max-width: 960px;
      margin: 0 auto;
      width: 100%;
    }
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-top: 8px;
    }
    .footer-links a { color: var(--color-text-secondary); text-decoration: none; }
    .footer-links a:hover { color: var(--color-tanimbary); }
  </style>
</head>
<body>
  <header>
    <a href="/" class="brand">
      <img src="/logo.png" alt="Logo Kanto MG" class="brand-logo" width="36" height="36" onerror="this.onerror=null; this.src='/favicon.png';">
      <div>
        <div class="brand-title">Kanto</div>
        <div class="brand-sub">Madagascar</div>
      </div>
    </a>
    <div>
      <a href="/#panel-register" class="btn-cta" style="padding: 7px 14px; font-size: 12px;">Accès Anticipé</a>
    </div>
  </header>

  <main>
    <!-- Fil d'Ariane -->
    <nav class="breadcrumbs" aria-label="Fil d'Ariane">
      <a href="/">Accueil</a>
      <span>›</span>
      <span style="color: var(--color-text);">${escapeHtml(config.nameFr)}</span>
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
    <h2 class="section-title">Sélection &amp; Extraits Culturels</h2>
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
      <a href="/#panel-download" class="btn-cta">
        Télécharger gratuitement sur Google Play &amp; TestFlight
      </a>
    </div>

    <!-- Navigation transversale / Maillage interne SEO -->
    <div class="hub-nav-tags">
      <span style="font-size: 12px; color: var(--color-text-muted); align-self: center;">Explorer aussi :</span>
      <a href="/ohabolana" class="tag-link">Ohabolana (Proverbes)</a>
      <a href="/angano" class="tag-link">Angano (Contes)</a>
      <a href="/kabary" class="tag-link">Kabary (Discours)</a>
      <a href="/tononkalo" class="tag-link">Tononkalo (Poésie)</a>
      <a href="/raki-teny" class="tag-link">Raki-teny (Vocabulaire)</a>
      <a href="/histoire" class="tag-link">Histoire &amp; Patrimoine</a>
    </div>
  </main>

  <footer>
    <div>© ${year} <strong>kanto.mg</strong> — Ny harena ara-kolontsaina malagasy</div>
    <div class="footer-links">
      <a href="/pages/terms">Conditions d'utilisation (CGU)</a>
      <a href="/pages/privacy">Confidentialité &amp; RGPD</a>
      <a href="/pages/about">À propos de Kanto</a>
      <a href="/#section-community-reviews">Avis de la communauté</a>
      <a href="/pages/help">Aide &amp; FAQ</a>
      <a href="mailto:support@kanto.mg">Contact</a>
    </div>
  </footer>
</body>
</html>`.trim();
}
