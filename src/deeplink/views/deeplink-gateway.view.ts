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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(pageDescription)}">
  <meta name="theme-color" content="#16442A">

  <!-- Open Graph / Réseaux sociaux & Messageries -->
  <meta property="og:site_name" content="Kanto MG">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(pageDescription)}">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:image" content="https://app-kanto.gastsar.fr/assets/images/icon.png">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}">
  <meta name="twitter:description" content="${escapeHtml(pageDescription)}">

  <!-- Favicon & Typographie -->
  <link rel="icon" href="/favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --kanto-green: #16442A;
      --kanto-green-dark: #0D2B1A;
      --kanto-green-light: #245E3B;
      --kanto-green-subtle: rgba(22, 68, 42, 0.08);
      --kanto-terracotta: #C85A32;
      --kanto-bg: #F9F8F5;
      --kanto-card-bg: #FFFFFF;
      --kanto-card-border: #E8E5DF;
      --kanto-text: #191B1F;
      --kanto-text-secondary: #5E6573;
      --kanto-text-muted: #8E95A3;
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-full: 9999px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--kanto-bg);
      color: var(--kanto-text);
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.55;
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
      max-width: 480px;
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
      width: 38px;
      height: 38px;
      border-radius: var(--radius-sm);
      background-color: var(--kanto-green);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-weight: 800;
      font-size: 19px;
      box-shadow: 0 4px 10px rgba(22, 68, 42, 0.2);
    }

    .brand-title {
      font-size: 22px;
      font-weight: 800;
      color: var(--kanto-green);
      letter-spacing: -0.5px;
    }

    .brand-domain {
      color: var(--kanto-terracotta);
    }

    /* Carte Principale Tanimbary */
    .content-card {
      background-color: var(--kanto-card-bg);
      border: 1px solid var(--kanto-card-border);
      border-radius: var(--radius-lg);
      padding: 24px 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      margin-bottom: 20px;
    }

    .badge-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .category-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: var(--radius-full);
      background-color: var(--kanto-green-subtle);
      color: var(--kanto-green);
      font-size: 11.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .app-status-indicator {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 11.5px;
      color: var(--kanto-text-muted);
      font-weight: 500;
    }

    .indicator-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #22C55E;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { opacity: 0.4; }
      50% { opacity: 1; }
      100% { opacity: 0.4; }
    }

    /* Titres & Contenus */
    .content-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--kanto-text);
      line-height: 1.4;
      margin-bottom: 14px;
      letter-spacing: -0.3px;
    }

    .quote-box {
      margin: 14px 0;
      padding: 16px;
      background-color: var(--kanto-bg);
      border-left: 3.5px solid var(--kanto-green);
      border-radius: var(--radius-sm);
    }

    .quote-malagasy {
      font-size: 17px;
      font-weight: 600;
      color: var(--kanto-green-dark);
      line-height: 1.5;
      margin-bottom: 10px;
    }

    .quote-translation {
      font-size: 14px;
      color: var(--kanto-text-secondary);
      line-height: 1.45;
      border-top: 1px dashed var(--kanto-card-border);
      padding-top: 10px;
    }

    .translation-label {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--kanto-text-muted);
      margin-bottom: 4px;
      letter-spacing: 0.4px;
    }

    .notes-box {
      margin-top: 12px;
      font-size: 13px;
      color: var(--kanto-text-secondary);
      background-color: #F4F2EC;
      padding: 10px 12px;
      border-radius: var(--radius-sm);
    }

    .meta-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 14px;
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
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background-color: var(--kanto-green-light);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-weight: 700;
      font-size: 22px;
      border: 2px solid var(--kanto-green);
      overflow: hidden;
      flex-shrink: 0;
    }

    .profile-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profile-meta h2 {
      font-size: 17px;
      font-weight: 700;
      color: var(--kanto-text);
      line-height: 1.3;
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
      background-color: var(--kanto-bg);
      border: 1px solid var(--kanto-card-border);
      border-radius: var(--radius-full);
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      color: var(--kanto-green-dark);
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
      gap: 8px;
      padding: 13px 20px;
      border-radius: var(--radius-md);
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
      text-align: center;
    }

    .btn-primary {
      background-color: var(--kanto-green);
      color: #FFFFFF;
      border: none;
      box-shadow: 0 4px 12px rgba(22, 68, 42, 0.25);
    }

    .btn-primary:hover {
      background-color: var(--kanto-green-light);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background-color: #FFFFFF;
      color: var(--kanto-green);
      border: 1px solid var(--kanto-card-border);
    }

    .btn-secondary:hover {
      background-color: #F8F7F3;
      border-color: var(--kanto-green);
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
      font-size: 32px;
      margin-bottom: 8px;
    }
  </style>
</head>
<body>

  <div class="main-wrapper">
    <!-- En-tête Marque -->
    <a href="https://app-kanto.gastsar.fr" class="brand-header">
      <div class="brand-logo">K</div>
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
            <div class="not-found-icon">🌿</div>
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
                ? `<div class="stat-pill">Dingana ${content.userStats.level} • Niveau ${content.userStats.level}</div>`
                : ''
            }
            ${
              content.userStats.totalXp !== undefined
                ? `<div class="stat-pill">${content.userStats.totalXp} XP</div>`
                : ''
            }
            ${
              content.userStats.streak
                ? `<div class="stat-pill">🔥 ${content.userStats.streak} andro misesy</div>`
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
