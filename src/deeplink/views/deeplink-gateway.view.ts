/**
 * Kanto MG — Passerelle universelle de consultation et de redirection Deeplink
 * Accessible sur https://app-kanto.gastsar.fr/ (proverbes, contes, profils, kabary, poésies...)
 *
 * Fonctionnalités clés :
 * 1. Affichage complet et bilingue du contenu culturel ou profil public même sans l'application installée.
 * 2. Balises OpenGraph et Twitter Cards dynamiques (titre, extrait, auteur) pour WhatsApp, Facebook, iMessage.
 * 3. Tentative d'ouverture immédiate via le deep link natif (kantomg://) si l'utilisateur est sur mobile.
 * 4. Boutons d'action clairs : « Ouvrir dans l'application » et « Installer Kanto MG ».
 * 5. Respect strict de la charte visuelle Terre & Encre de Kanto MG.
 */

export interface DeeplinkContentDetails {
  categoryLabel?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  textMg?: string;
  textFr?: string;
  notes?: string;
  author?: string;
  metaInfo?: string;
  userStats?: {
    level?: number;
    totalXp?: number;
    streak?: number;
    avatar?: string | null;
  };
  isNotFound?: boolean;
}

export interface DeeplinkGatewayOptions {
  path: string;
  fullQueryString?: string;
  title?: string;
  description?: string;
  content?: DeeplinkContentDetails;
  canonicalUrl?: string;
}

export function renderDeeplinkGatewayPage(
  options: DeeplinkGatewayOptions,
): string {
  const cleanPath = options.path.replace(/^\/+/, '');
  const qs = options.fullQueryString
    ? options.fullQueryString.startsWith('?')
      ? options.fullQueryString
      : `?${options.fullQueryString}`
    : '';

  const nativeSchemeUrl = `kantomg://${cleanPath}${qs}`;
  const canonicalUrl =
    options.canonicalUrl || `https://app-kanto.gastsar.fr/${cleanPath}${qs}`;
  const downloadUrl = `https://app-kanto.gastsar.fr/download`;

  const pageTitle =
    options.title || 'Kanto MG • Haisoratra sy Fahendrena Malagasy';
  const pageDescription =
    options.description ||
    'Découvrez les trésors de la culture, de la langue et de la sagesse malgaches sur Kanto MG.';

  const content = options.content || {};
  const isNotFound = content.isNotFound === true;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(pageDescription)}">
  <meta name="theme-color" content="#0D0D0B">

  <!-- Canonical & hreflang SEO -->
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  <link rel="alternate" hreflang="fr" href="${escapeHtml(canonicalUrl)}">
  <link rel="alternate" hreflang="mg" href="${escapeHtml(canonicalUrl)}">
  <link rel="alternate" hreflang="x-default" href="${escapeHtml(canonicalUrl)}">

  <!-- Open Graph / Réseaux sociaux & Messageries -->
  <meta property="og:site_name" content="Kanto MG">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(pageDescription)}">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:locale:alternate" content="mg_MG">
  <meta property="og:image" content="https://app-kanto.gastsar.fr/assets/images/icon.png">
  <meta property="og:image:width" content="512">
  <meta property="og:image:height" content="512">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@KantoMG">
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}">
  <meta name="twitter:description" content="${escapeHtml(pageDescription)}">
  <meta name="twitter:image" content="https://app-kanto.gastsar.fr/assets/images/icon.png">

  <!-- Données structurées Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Kanto MG",
            "item": "https://app-kanto.gastsar.fr/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": ${JSON.stringify(content.categoryLabel || 'Patrimoine')},
            "item": "https://app-kanto.gastsar.fr/"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": ${JSON.stringify(pageTitle)},
            "item": ${JSON.stringify(canonicalUrl)}
          }
        ]
      },
      {
        "@type": "CreativeWork",
        "name": ${JSON.stringify(pageTitle)},
        "headline": ${JSON.stringify(pageTitle)},
        "description": ${JSON.stringify(pageDescription)},
        "inLanguage": ["mg", "fr"],
        "publisher": {
          "@type": "Organization",
          "name": "Kanto MG",
          "url": "https://app-kanto.gastsar.fr/",
          "logo": {
            "@type": "ImageObject",
            "url": "https://app-kanto.gastsar.fr/logo.png"
          }
        },
        ${content.author ? `"author": { "@type": "Person", "name": ${JSON.stringify(content.author)} },` : ''}
        "mainEntityOfPage": ${JSON.stringify(canonicalUrl)}
      }
    ]
  }
  </script>

  <!-- Favicon & Typographie -->
  <link rel="icon" href="/favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    @font-face {
      font-family: 'LazyDog';
      src: url('/fonts/LazyDog.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    :root {
      --kanto-accent: #4A6741;
      --kanto-accent-hover: #3B5334;
      --kanto-accent-soft: #E5ECE2;
      --kanto-btn-bg: #4A6741;
      --kanto-btn-hover: #3B5334;
      --kanto-sage: #4A6741;
      --kanto-sage-soft: #E5ECE2;
      --kanto-sage-border: #CBD8C6;
      --kanto-bg: #F5F4F0;
      --kanto-card-bg: #FCFBF8;
      --kanto-card-border: #DDD8CE;
      --kanto-text: #181715;
      --kanto-text-secondary: #534F47;
      --kanto-text-muted: #706B61;
      --kanto-font-serif: 'Newsreader', Georgia, serif;
      --kanto-font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --radius-xs: 2px;
      --radius-sm: 4px;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --kanto-accent: #6B9E61;
        --kanto-accent-hover: #7FB275;
        --kanto-accent-soft: #1B221B;
        --kanto-btn-bg: #4A6741;
        --kanto-btn-hover: #56794C;
        --kanto-sage: #6B9E61;
        --kanto-sage-soft: #1B221B;
        --kanto-sage-border: #2F3D2F;
        --kanto-bg: #0D0D0B;
        --kanto-card-bg: #141412;
        --kanto-card-border: #262520;
        --kanto-text: #F0EFEA;
        --kanto-text-secondary: #B4B0A6;
        --kanto-text-muted: #848077;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--kanto-bg);
      color: var(--kanto-text);
      font-family: var(--kanto-font-sans);
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      -webkit-font-smoothing: antialiased;
    }

    .main-wrapper {
      width: 100%;
      max-width: 520px;
      margin: 0 auto;
    }

    /* En-tête Marque Kanto */
    .brand-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 20px;
      text-decoration: none;
    }

    .brand-logo {
      width: 34px;
      height: 34px;
      border-radius: var(--radius-xs);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--kanto-card-border);
      background-color: var(--kanto-card-bg);
    }

    .brand-logo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .brand-title {
      font-family: var(--kanto-font-serif);
      font-size: 24px;
      line-height: 1;
      font-weight: 600;
      color: var(--kanto-text);
      letter-spacing: -0.02em;
    }

    .brand-domain {
      color: var(--kanto-accent);
      font-weight: 500;
    }

    /* Carte Principale Éditoriale */
    .content-card {
      background-color: var(--kanto-card-bg);
      border: 1px solid var(--kanto-card-border);
      border-radius: var(--radius-xs);
      padding: 24px 20px;
      margin-bottom: 20px;
    }

    .badge-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--kanto-card-border);
    }

    .category-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 9px;
      border-radius: var(--radius-xs);
      background-color: var(--kanto-accent-soft);
      color: var(--kanto-accent);
      border: 1px solid var(--kanto-sage-border);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .app-status-indicator {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--kanto-sage);
      font-weight: 600;
    }

    .indicator-dot {
      width: 6px;
      height: 6px;
      border-radius: 1px;
      background-color: var(--kanto-sage);
    }

    /* Titres & Contenus */
    .content-title {
      font-size: 21px;
      font-weight: 600;
      color: var(--kanto-text);
      line-height: 1.32;
      margin-bottom: 14px;
      font-family: var(--kanto-font-serif);
      letter-spacing: -0.015em;
    }

    .quote-box {
      margin: 14px 0;
      padding: 16px 18px;
      background-color: var(--kanto-bg);
      border: 1px solid var(--kanto-card-border);
      border-left: 3px solid var(--kanto-accent);
      border-radius: var(--radius-xs);
    }

    .quote-malagasy {
      font-size: 18px;
      font-weight: 500;
      font-family: var(--kanto-font-serif);
      font-style: italic;
      color: var(--kanto-text);
      line-height: 1.5;
      margin-bottom: 10px;
    }

    .quote-translation {
      font-size: 14px;
      color: var(--kanto-text-secondary);
      line-height: 1.5;
      border-top: 1px solid var(--kanto-card-border);
      padding-top: 10px;
    }

    .translation-label {
      font-size: 10.5px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--kanto-text-muted);
      margin-bottom: 4px;
      letter-spacing: 0.08em;
    }

    .notes-box {
      margin-top: 12px;
      font-size: 13px;
      color: var(--kanto-text-secondary);
      background-color: var(--kanto-bg);
      border: 1px solid var(--kanto-card-border);
      padding: 11px 14px;
      border-radius: var(--radius-xs);
    }

    .meta-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid var(--kanto-card-border);
      font-size: 12px;
      color: var(--kanto-text-muted);
    }

    /* Profil Public Card */
    .profile-hero {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
    }

    .profile-avatar {
      width: 54px;
      height: 54px;
      border-radius: var(--radius-sm);
      background-color: var(--kanto-sage-soft);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--kanto-sage);
      font-weight: 700;
      font-size: 20px;
      border: 1px solid var(--kanto-sage-border);
      overflow: hidden;
      flex-shrink: 0;
    }

    .profile-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profile-meta h2 {
      font-family: var(--kanto-font-serif);
      font-size: 19px;
      font-weight: 600;
      color: var(--kanto-text);
      line-height: 1.25;
    }

    .profile-meta .username {
      font-size: 13px;
      color: var(--kanto-text-secondary);
      font-weight: 500;
    }

    .stats-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 14px;
    }

    .stat-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: var(--kanto-bg);
      border: 1px solid var(--kanto-card-border);
      border-radius: var(--radius-xs);
      padding: 5px 10px;
      font-size: 12px;
      font-weight: 600;
      font-family: var(--kanto-font-sans);
      color: var(--kanto-text);
    }

    /* Actions et Boutons */
    .actions-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 20px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      gap: 8px;
      padding: 12px 18px;
      border-radius: var(--radius-xs);
      font-size: 13.5px;
      font-weight: 700;
      text-decoration: none;
      transition: background-color 0.15s ease, border-color 0.15s ease;
      cursor: pointer;
      text-align: center;
    }

    .btn-primary {
      background-color: var(--kanto-btn-bg);
      color: #FFFFFF;
      border: 1px solid var(--kanto-accent);
    }

    .btn-primary:hover {
      background-color: var(--kanto-btn-hover);
      border-color: var(--kanto-accent-hover);
    }

    .btn-secondary {
      background-color: transparent;
      color: var(--kanto-text);
      border: 1px solid var(--kanto-card-border);
    }

    .btn-secondary:hover {
      background-color: var(--kanto-bg);
      border-color: var(--kanto-accent);
    }

    .deeplink-footer-nav {
      margin-top: 16px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px 12px;
      font-size: 12px;
      color: var(--kanto-text-muted);
    }
    .deeplink-footer-nav a {
      color: var(--kanto-text-secondary);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.15s ease;
    }
    .deeplink-footer-nav a:hover {
      color: var(--kanto-accent);
      text-decoration: underline;
    }
    .deeplink-footer-nav span {
      opacity: 0.4;
    }
    .footer-text {
      text-align: center;
      font-size: 12px;
      color: var(--kanto-text-muted);
      margin-top: 14px;
    }

    /* Bannière d'état introuvable */
    .not-found-card {
      text-align: center;
      padding: 24px 16px;
    }

    .not-found-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border: 1px solid var(--kanto-card-border);
      border-radius: var(--radius-xs);
      color: var(--kanto-accent);
      margin: 0 auto 12px;
    }
  </style>
</head>
<body>

  <div class="main-wrapper">
    <!-- En-tête Marque -->
    <a href="https://app-kanto.gastsar.fr" class="brand-header">
      <div class="brand-logo">
        <img
          src="/logo.png"
          alt="Logo Kanto MG"
          width="38"
          height="38"
          onerror="this.onerror=null; this.src='/favicon.png';"
        />
      </div>
      <div class="brand-title">kanto<span class="brand-domain">.mg</span></div>
    </a>

    <!-- Carte Principale de Contenu -->
    <div class="content-card">
      <div class="badge-row">
        <span class="category-badge">
          ${escapeHtml(content.badge || content.categoryLabel || 'Kanto Malagasy')}
        </span>
        <div class="app-status-indicator">
          <span class="indicator-dot"></span>
          <span>Application Kanto</span>
        </div>
      </div>

      ${
        isNotFound
          ? `
          <div class="not-found-card">
            <div class="not-found-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="12" cy="12" r="9"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h1 class="content-title">Votoaty tsy hita na voafafa</h1>
            <p style="color: var(--kanto-text-secondary); font-size: 13.5px; margin-bottom: 14px;">
              Ce contenu n'est plus accessible ou a été retiré. Explorez les milliers d'autres proverbes et récits sur Kanto MG.
            </p>
          </div>
          `
          : content.userStats
            ? `
          <!-- Vue Profil Public -->
          <div class="profile-hero">
            <div class="profile-avatar">
              ${
                content.userStats.avatar
                  ? `<img src="${escapeHtml(content.userStats.avatar)}" alt="${escapeHtml(content.title || 'Profil')}">`
                  : `<span>${escapeHtml((content.title || 'K').charAt(0).toUpperCase())}</span>`
              }
            </div>
            <div class="profile-meta">
              <h2>${escapeHtml(content.title || 'Membre Kanto')}</h2>
              <div class="username">${escapeHtml(content.subtitle || '@mpikambana')}</div>
            </div>
          </div>

          <div class="stats-pills">
            ${
              content.userStats.level
                ? `<div class="stat-pill">Dingana ${content.userStats.level} &bull; Niveau ${content.userStats.level}</div>`
                : ''
            }
            ${
              content.userStats.totalXp !== undefined
                ? `<div class="stat-pill">${content.userStats.totalXp} XP</div>`
                : ''
            }
            ${
              content.userStats.streak
                ? `<div class="stat-pill">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M12 2c1 4-1 6-1 6s3-1 4-4c3 3 4 7 4 10a7 7 0 1 1-14 0c0-4 3-7 7-12z"></path>
                    </svg>
                    <span>${content.userStats.streak} andro misesy</span>
                  </div>`
                : ''
            }
          </div>
          `
            : `
          <!-- Vue Contenu Culturel Bilingue -->
          ${
            content.title
              ? `<h1 class="content-title">${escapeHtml(content.title)}</h1>`
              : ''
          }

          ${
            content.textMg
              ? `
              <div class="quote-box">
                <div class="quote-malagasy">« ${escapeHtml(content.textMg)} »</div>
                ${
                  content.textFr
                    ? `
                    <div class="quote-translation">
                      <div class="translation-label">Traduction française</div>
                      « ${escapeHtml(content.textFr)} »
                    </div>
                    `
                    : ''
                }
              </div>
              `
              : ''
          }

          ${
            content.notes
              ? `
              <div class="notes-box">
                <strong>Heviny / Sens :</strong> ${escapeHtml(content.notes)}
              </div>
              `
              : ''
          }

          ${
            content.author || content.metaInfo
              ? `
              <div class="meta-row">
                <span>${escapeHtml(content.author || 'Fahendrena Malagasy')}</span>
                <span>${escapeHtml(content.metaInfo || 'Kanto MG')}</span>
              </div>
              `
              : ''
          }
          `
      }

      <!-- Actions : Ouvrir dans l'application & Installer -->
      <div class="actions-group">
        <a href="${escapeHtml(nativeSchemeUrl)}" class="btn btn-primary" id="btn-open-app">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <span>Ouvrir dans l'application Kanto</span>
        </a>

        <a href="${escapeHtml(downloadUrl)}" class="btn btn-secondary" id="btn-download-app">
          <span>Installer l'application Kanto MG</span>
        </a>
      </div>
    </div>

    <div class="footer-text">
      Kanto MG • Ny haren-tsaina sy ny fahendrena malagasy ho an'ny rehetra
    </div>
    <nav class="deeplink-footer-nav" aria-label="Navigation Kanto MG">
      <a href="/">Accueil</a>
      <span>·</span>
      <a href="/pages/about">À propos</a>
      <span>·</span>
      <a href="/pages/help">Aide</a>
      <span>·</span>
      <a href="/pages/terms">CGU</a>
      <span>·</span>
      <a href="/pages/privacy">Confidentialité</a>
    </nav>
  </div>

  <script>
    (function() {
      var nativeUrl = "${nativeSchemeUrl}";
      var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      // Si l'utilisateur est sur smartphone, tentative douce de déclenchement du deep link sans bloquer la vue web
      if (isMobile && nativeUrl) {
        var triggerTimer = setTimeout(function() {
          try {
            window.location.href = nativeUrl;
          } catch(e) {}
        }, 120);

        window.addEventListener('pagehide', function() {
          clearTimeout(triggerTimer);
        });
      }
    })();
  </script>
</body>
</html>`.trim();
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
