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
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

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
      --color-surface-hover: #1E1E1A;
      --color-border: #242420;
      --color-divider: #252E25;
      --color-terracotta: #E75A4D;
      --color-terracotta-soft: #2C1715;
      --color-tanimbary: #6B9E61;
      --color-tanimbary-dark: #374E30;
      --color-amber: #E0A24A;
      --color-text: #F0F0EC;
      --color-text-secondary: #9C9C98;
      --color-text-muted: #707070;
      --color-heading: #F0F0EC;
      --font-serif: 'Newsreader', Georgia, serif;
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 16px;
    }
    [data-theme="light"] {
      --color-bg: #F5F4F0;
      --color-surface: #FEFEFC;
      --color-surface-hover: #F0EDE8;
      --color-border: #E5E2DB;
      --color-divider: #DCE1D7;
      --color-terracotta: #C0392B;
      --color-terracotta-soft: #FDF2F0;
      --color-tanimbary: #4A6741;
      --color-tanimbary-dark: #374E30;
      --color-amber: #C58B38;
      --color-text: #1A1A1A;
      --color-text-secondary: #5C5C5C;
      --color-text-muted: #8A8A8A;
      --color-heading: #1A1A1A;
      --font-serif: 'Newsreader', Georgia, serif;
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
    }
    header {
      padding: 18px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--color-border);
      max-width: 1040px;
      margin: 0 auto;
      width: 100%;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: inherit;
    }
    .brand-logo { width: 34px; height: 34px; border-radius: 4px; border: 1px solid var(--color-border); }
    .brand-title {
      font-family: var(--font-serif);
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: var(--color-heading);
      line-height: 1.1;
    }
    .brand-sub {
      font-size: 9.5px;
      text-transform: uppercase;
      letter-spacing: 1.8px;
      color: var(--color-terracotta);
      font-weight: 700;
    }
    main {
      flex: 1;
      max-width: 1040px;
      margin: 0 auto;
      width: 100%;
      padding: 40px 24px 72px;
    }
    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--color-text-muted);
      margin-bottom: 28px;
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
      font-size: clamp(32px, 4.5vw, 44px);
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
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 12px;
    }
    .section-title {
      font-family: var(--font-serif);
      font-size: 24px;
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
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 18px;
      margin-bottom: 48px;
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
      padding: 40px 32px;
      text-align: center;
      margin-top: 36px;
      position: relative;
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
      font-size: 26px;
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
      gap: 8px;
      background: var(--color-terracotta);
      color: #FFFFFF;
      font-weight: 700;
      font-size: 13.5px;
      padding: 13px 26px;
      border-radius: var(--radius-sm);
      text-decoration: none;
      letter-spacing: 0.3px;
      transition: opacity 0.15s ease, transform 0.15s ease;
    }
    .btn-cta:hover { opacity: 0.92; transform: translateY(-1px); }
    .hub-nav-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid var(--color-border);
    }
    .tag-link {
      font-size: 12px;
      padding: 7px 14px;
      border-radius: 99px;
      border: 1px solid var(--color-border);
      color: var(--color-text-secondary);
      text-decoration: none;
      background: var(--color-surface);
      transition: border-color 0.15s ease, color 0.15s ease;
    }
    .tag-link:hover {
      border-color: var(--color-terracotta);
      color: var(--color-heading);
    }
    footer {
      border-top: 1px solid var(--color-border);
      padding: 32px 24px;
      font-size: 12.5px;
      color: var(--color-text-muted);
      text-align: center;
      max-width: 1040px;
      margin: 0 auto;
      width: 100%;
    }
    .footer-quote {
      font-family: var(--font-serif);
      font-style: italic;
      color: var(--color-text-secondary);
      margin-bottom: 12px;
      font-size: 14px;
    }
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 18px;
      flex-wrap: wrap;
      margin-top: 12px;
    }
    .footer-links a { color: var(--color-text-secondary); text-decoration: none; }
    .footer-links a:hover { color: var(--color-terracotta); }
  </style>
</head>
<body>
  <header>
    <a href="/" class="brand">
      <img src="/logo.png" alt="Logo Kanto MG" class="brand-logo" width="34" height="34" onerror="this.onerror=null; this.src='/favicon.png';">
      <div>
        <div class="brand-title">Kanto</div>
        <div class="brand-sub">Madagascar</div>
      </div>
    </a>
    <div>
      <a href="/#panel-register" class="btn-cta" style="padding: 8px 16px; font-size: 12px;">Accès Anticipé</a>
    </div>
  </header>

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
    <div class="footer-quote">« Ny hazo no vanon-ko lakana, ny tany naniriany no tsara »</div>
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
