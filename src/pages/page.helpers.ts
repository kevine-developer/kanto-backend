/**
 * Kanto — Design system partagé pour toutes les pages web statiques.
 * Police, couleurs, composants réutilisables dans les vues HTML.
 */

export const PAGE_FONT = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,500;1,6..72,600&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
`;

export const PAGE_CSS = `
  :root {
    --bg: #F8F6F0;
    --bg-warm: #F2EFEB;
    --surface: #FFFFFF;
    --surface-elevated: #FFFFFF;
    --border: #E8E5DC;
    --border-light: #F0EDE5;
    --text: #161513;
    --text-muted: #545047;
    --text-subtle: #888377;
    --accent: #2B4426;
    --accent-hover: #1F331B;
    --accent-light: #EEF4ED;
    --accent-border: #D1E0CE;
    --terracotta: #B93826;
    --terracotta-hover: #962B1C;
    --terracotta-light: #FCF1EE;
    --terracotta-border: #F3CEC6;
    --amber: #C48833;
    --amber-light: #FDF6EC;
    --btn-bg: #161513;
    --btn-hover: #2B4426;
    --font-serif: 'Newsreader', Georgia, 'Times New Roman', serif;
    --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --radius: 12px;
    --radius-sm: 6px;
    --shadow-sm: 0 1px 3px rgba(22, 21, 19, 0.04);
    --shadow-md: 0 8px 24px rgba(22, 21, 19, 0.07);
    --shadow-lg: 0 16px 40px rgba(22, 21, 19, 0.1);
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #0C0C0A;
      --bg-warm: #131310;
      --surface: #141411;
      --surface-elevated: #1B1B17;
      --border: #262520;
      --border-light: #1E1D19;
      --text: #F4F3EE;
      --text-muted: #A6A399;
      --text-subtle: #6D695F;
      --accent: #7AA870;
      --accent-hover: #92BE88;
      --accent-light: #162414;
      --accent-border: #294426;
      --terracotta: #E65A48;
      --terracotta-hover: #F07363;
      --terracotta-light: #2A1310;
      --terracotta-border: #4D1F1A;
      --amber: #E0A24A;
      --amber-light: #2A1F10;
      --btn-bg: #F4F3EE;
      --btn-hover: #FFFFFF;
      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.4);
      --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.5);
      --shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.6);
    }
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: var(--font-sans);
    background: var(--bg);
    color: var(--text);
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: 0;
    margin: 0;
  }

  /* En-tête institutionnel & navigation éditoriale */
  .page-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--surface);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 14px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    box-shadow: var(--shadow-sm);
  }

  .page-header .brand-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
  }

  .page-header .brand-logo {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    object-fit: cover;
  }

  .page-header .brand-text {
    display: flex;
    flex-direction: column;
  }

  .page-header .brand-name {
    font-family: var(--font-serif);
    font-size: 19px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.3px;
    line-height: 1.1;
  }

  .page-header .brand-tag {
    font-family: var(--font-sans);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--terracotta);
    font-weight: 700;
  }

  .page-header .header-nav {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .page-header .header-link {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .page-header .header-link:hover {
    color: var(--terracotta);
  }

  .page-header .header-cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 999px;
    background: var(--terracotta);
    color: #FFFFFF !important;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.15s ease, transform 0.1s ease;
  }

  .page-header .header-cta:hover {
    background: var(--terracotta-hover);
    transform: translateY(-1px);
    text-decoration: none;
  }

  body.hide-header .page-header {
    display: none !important;
  }

  body.hide-header .container {
    padding-top: 16px !important;
  }

  .container {
    max-width: 820px;
    margin: 0 auto;
    padding: 48px 24px 100px;
  }

  h1 {
    font-family: var(--font-serif);
    font-size: 38px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.8px;
    margin-bottom: 12px;
    line-height: 1.18;
  }

  .page-meta {
    font-size: 13px;
    color: var(--text-subtle);
    margin-bottom: 36px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    border-bottom: 1px solid var(--border);
    padding-bottom: 18px;
  }

  .page-meta .badge-official {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    background: var(--terracotta-light);
    color: var(--terracotta);
    border: 1px solid var(--terracotta-border);
    border-radius: 9999px;
  }

  /* Sommaire de navigation rapide */
  .toc-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 22px 24px;
    margin-bottom: 40px;
    box-shadow: var(--shadow-sm);
  }

  .toc-title {
    font-family: var(--font-sans);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--terracotta);
    margin-bottom: 14px;
  }

  .toc-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 8px 20px;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .toc-list li a {
    font-size: 13px;
    color: var(--text-muted);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
    transition: color 0.15s;
  }

  .toc-list li a:hover {
    color: var(--terracotta);
    text-decoration: none;
  }

  h2 {
    font-family: var(--font-serif);
    font-size: 24px;
    font-weight: 700;
    color: var(--text);
    margin: 48px 0 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
    scroll-margin-top: 80px;
    display: flex;
    align-items: baseline;
    gap: 10px;
    letter-spacing: -0.3px;
  }

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
    margin: 28px 0 10px;
    letter-spacing: -0.2px;
  }

  p {
    font-size: 15px;
    color: var(--text-muted);
    line-height: 1.85;
    margin-bottom: 16px;
  }

  ul, ol {
    padding-left: 24px;
    margin-bottom: 20px;
  }

  li {
    font-size: 14.5px;
    color: var(--text-muted);
    line-height: 1.8;
    margin-bottom: 8px;
  }

  a {
    color: var(--terracotta);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.15s ease;
  }

  a:hover {
    color: var(--terracotta-hover);
    text-decoration: underline;
  }

  .callout {
    background: var(--surface);
    border-left: 3px solid var(--terracotta);
    border-radius: var(--radius-sm);
    padding: 18px 22px;
    margin-bottom: 28px;
    box-shadow: var(--shadow-sm);
  }

  .callout p {
    margin: 0;
    font-size: 14px;
    color: var(--text);
    line-height: 1.7;
  }

  .callout-beta {
    border-left-color: #C58B38;
    background: var(--surface);
  }

  .contact-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 22px;
    margin-top: 36px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    box-shadow: var(--shadow-sm);
  }

  .contact-card .icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: var(--accent-light);
    border: 1px solid var(--accent-border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .contact-card .icon svg {
    width: 20px;
    height: 20px;
    stroke: var(--accent);
    stroke-width: 2;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .contact-card .body { flex: 1; }
  .contact-card .label { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .contact-card .value { font-size: 13.5px; color: var(--text-muted); line-height: 1.6; }

  .footer {
    margin-top: 60px;
    padding-top: 28px;
    border-top: 1px solid var(--border);
    text-align: center;
    font-size: 12px;
    color: var(--text-subtle);
    line-height: 2;
  }

  .footer-links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    margin-top: 8px;
  }

  .footer-cookie-btn {
    background: none;
    border: none;
    color: var(--accent);
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13.5px;
    margin: 20px 0 24px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  th {
    text-align: left;
    font-weight: 700;
    color: var(--text);
    padding: 10px 14px;
    border-bottom: 2px solid var(--border);
    background: var(--surface);
  }

  td {
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    color: var(--text-muted);
    vertical-align: top;
  }

  tr:last-child td { border-bottom: none; }

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 2px 6px;
    border-radius: 4px;
    color: var(--text);
  }

  /* Modale et bannière de cookies Kanto partagées */
  .cookie-banner-wrap {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    max-width: 520px;
    margin: 0 auto;
    z-index: 999;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px 20px;
    box-shadow: var(--shadow-md);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .cookie-banner-title {
    font-size: 13.5px;
    font-weight: 700;
    color: var(--text);
  }

  .cookie-banner-text {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.5;
    margin: 0;
  }

  .cookie-banner-btns {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .cookie-btn-p {
    flex: 1;
    min-width: 100px;
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 600;
    background: var(--accent);
    color: #FFFFFF;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    text-align: center;
  }

  .cookie-btn-s {
    flex: 1;
    min-width: 100px;
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 600;
    background: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    cursor: pointer;
    text-align: center;
  }

  .cookie-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .cookie-modal-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    max-width: 560px;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-md);
  }

  .cookie-modal-head {
    padding: 18px 22px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cookie-modal-head h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
  }

  .cookie-modal-close {
    background: none;
    border: none;
    font-size: 18px;
    color: var(--text-subtle);
    cursor: pointer;
    padding: 4px;
  }

  .cookie-modal-scroll {
    padding: 20px 22px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .cookie-category {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .cookie-category-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cookie-category-name {
    font-size: 13.5px;
    font-weight: 700;
    color: var(--text);
  }

  .cookie-badge-req {
    font-size: 10.5px;
    font-weight: 600;
    color: var(--accent);
    background: var(--accent-light);
    border: 1px solid var(--accent-border);
    padding: 2px 6px;
    border-radius: 9999px;
  }

  .cookie-toggle {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
  }

  .cookie-toggle input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .cookie-slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: var(--border);
    transition: .3s;
    border-radius: 24px;
  }

  .cookie-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .3s;
    border-radius: 50%;
  }

  .cookie-toggle input:checked + .cookie-slider {
    background-color: var(--accent);
  }

  .cookie-toggle input:checked + .cookie-slider:before {
    transform: translateX(20px);
  }

  .cookie-modal-actions {
    padding: 16px 22px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-wrap: wrap;
  }
`;

export const currentYear = () => new Date().getFullYear();

export function pageShell(options: {
  title: string;
  pageTitle: string;
  description?: string;
  body: string;
  hideHeader?: boolean;
  supportEmail?: string;
  canonicalUrl?: string;
  slug?: string;
}): string {
  const { title, pageTitle, description, body, hideHeader } = options;
  const year = currentYear();
  const supportEmail =
    options.supportEmail || process.env.SUPPORT_EMAIL || 'support@kanto.mg';
  const bodyClass = hideHeader ? ' class="hide-header"' : '';
  const canonicalUrl =
    options.canonicalUrl ||
    (options.slug
      ? `https://app-kanto.gastsar.fr/pages/${options.slug}`
      : 'https://app-kanto.gastsar.fr/');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description || `Kanto — ${pageTitle}`}">
  <link rel="icon" href="/favicon.ico">

  <!-- Canonical & hreflang SEO -->
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="fr" href="${canonicalUrl}">
  <link rel="alternate" hreflang="mg" href="${canonicalUrl}">
  <link rel="alternate" hreflang="x-default" href="${canonicalUrl}">

  <!-- Open Graph -->
  <meta property="og:site_name" content="Kanto MG">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description || `Kanto — ${pageTitle}`}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:image" content="https://app-kanto.gastsar.fr/assets/images/icon.png">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description || `Kanto — ${pageTitle}`}">
  <meta name="twitter:image" content="https://app-kanto.gastsar.fr/assets/images/icon.png">

  <!-- Schema.org JSON-LD -->
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
            "name": ${JSON.stringify(pageTitle)},
            "item": ${JSON.stringify(canonicalUrl)}
          }
        ]
      },
      {
        "@type": "WebPage",
        "name": ${JSON.stringify(pageTitle)},
        "headline": ${JSON.stringify(pageTitle)},
        "description": ${JSON.stringify(description || pageTitle)},
        "url": ${JSON.stringify(canonicalUrl)},
        "publisher": {
          "@type": "Organization",
          "name": "Kanto MG",
          "url": "https://app-kanto.gastsar.fr/"
        }
      }
    ]
  }
  </script>

  ${PAGE_FONT}
  <style>${PAGE_CSS}</style>
</head>
<body${bodyClass}>
  <header class="page-header">
    <a href="/" class="brand-wrap" aria-label="Retour à l'accueil Kanto MG">
      <img src="/logo.png" alt="Logo Kanto" class="brand-logo" width="32" height="32" onerror="this.onerror=null; this.src='/favicon.png';">
      <div class="brand-text">
        <span class="brand-name">kanto<span style="color: var(--terracotta);">.mg</span></span>
        <span class="brand-tag">Lova sy Kolontsaina</span>
      </div>
    </a>
    <nav class="header-nav">
      <a href="/ohabolana" class="header-link">Ohabolana</a>
      <a href="/angano" class="header-link">Angano</a>
      <a href="/kabary" class="header-link">Kabary</a>
      <a href="/" class="header-cta">
        <span>Portail officiel</span>
        <span aria-hidden="true">→</span>
      </a>
    </nav>
  </header>

  <main class="container">
    ${body}

    <div class="footer">
      <div style="font-family: var(--font-serif); font-size: 16px; color: var(--text); margin-bottom: 6px;">
        « Ny hazo no vanon-ko lakana, ny tany naniriany no tsara. »
      </div>
      <div>© ${year} <strong>kanto.mg</strong> — Sauvegarde, rayonnement et transmission vivante du patrimoine malgache.</div>
      <div class="footer-links">
        <a href="/">Accueil</a>
        <a href="/ohabolana">Ohabolana</a>
        <a href="/angano">Angano</a>
        <a href="/kabary">Kabary</a>
        <a href="/tononkalo">Tononkalo</a>
        <a href="/raki-teny">Raki-teny</a>
        <a href="/histoire">Tantara</a>
        <a href="/pages/about">À propos</a>
        <a href="/pages/help">Aide &amp; FAQ</a>
        <a href="/pages/terms">Conditions d'utilisation (CGU)</a>
        <a href="/pages/privacy">Confidentialité (RGPD)</a>
        <button type="button" class="footer-cookie-btn" id="btn-open-cookie-modal">Gestion des cookies</button>
        <a href="mailto:${supportEmail}">Contact &amp; Support</a>
      </div>
    </div>
  </main>

  <!-- Modale de préférences de cookies partagée -->
  <div id="cookie-settings-modal" class="cookie-modal-backdrop" style="display: none;">
    <div class="cookie-modal-card">
      <div class="cookie-modal-head">
        <h3>Préférences de confidentialité &amp; Cookies</h3>
        <button type="button" id="cookie-settings-close" class="cookie-modal-close" aria-label="Fermer">✕</button>
      </div>
      <div class="cookie-modal-scroll">
        <p style="font-size: 13px; color: var(--text-muted); margin: 0;">
          Kanto MG respecte scrupuleusement votre vie privée. Choisissez les traceurs que vous souhaitez autoriser lors de votre navigation.
        </p>

        <!-- Catégorie 1 : Nécessaires -->
        <div class="cookie-category">
          <div class="cookie-category-head">
            <span class="cookie-category-name">1. Traceurs strictement nécessaires</span>
            <span class="cookie-badge-req">Obligatoire</span>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin: 0;">
            Indispensables au fonctionnement technique, à la sécurité des sessions, à la protection CSRF et à la mémorisation de votre choix de consentement. Ne peuvent pas être désactivés.
          </p>
        </div>

        <!-- Catégorie 2 : Préférences -->
        <div class="cookie-category">
          <div class="cookie-category-head">
            <span class="cookie-category-name">2. Préférences d'affichage &amp; Thème</span>
            <label class="cookie-toggle" aria-label="Cookies de préférences">
              <input type="checkbox" id="cookie-pref-toggle" checked>
              <span class="cookie-slider"></span>
            </label>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin: 0;">
            Permet de mémoriser vos préférences visuelles (mode clair / sombre Terre &amp; Encre) et la plateforme choisie pour le test.
          </p>
        </div>

        <!-- Catégorie 3 : Statistiques anonymisées -->
        <div class="cookie-category">
          <div class="cookie-category-head">
            <span class="cookie-category-name">3. Mesure d'audience anonymisée</span>
            <label class="cookie-toggle" aria-label="Cookies de mesure d'audience">
              <input type="checkbox" id="cookie-stat-toggle">
              <span class="cookie-slider"></span>
            </label>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin: 0;">
            Mesure agrégée de fréquentation et performance des pages pour améliorer la fluidité de Kanto MG sans collecter de données nominatives.
          </p>
        </div>
      </div>
      <div class="cookie-modal-actions">
        <button type="button" id="cookie-settings-reject" class="cookie-btn-s">Tout refuser</button>
        <button type="button" id="cookie-settings-save" class="cookie-btn-p">Enregistrer mes choix</button>
        <button type="button" id="cookie-settings-accept" class="cookie-btn-p" style="background: var(--btn-bg);">Tout accepter</button>
      </div>
    </div>
  </div>

  <script>
  (function() {
    var modal = document.getElementById('cookie-settings-modal');
    var btnOpen = document.getElementById('btn-open-cookie-modal');
    var btnClose = document.getElementById('cookie-settings-close');
    var btnSave = document.getElementById('cookie-settings-save');
    var btnAccept = document.getElementById('cookie-settings-accept');
    var btnReject = document.getElementById('cookie-settings-reject');

    var prefToggle = document.getElementById('cookie-pref-toggle');
    var statToggle = document.getElementById('cookie-stat-toggle');

    function loadConsent() {
      try {
        var raw = localStorage.getItem('kanto_cookie_consent_v1');
        if (raw) {
          var parsed = JSON.parse(raw);
          if (prefToggle) prefToggle.checked = parsed.preferences !== false;
          if (statToggle) statToggle.checked = Boolean(parsed.analytics);
        }
      } catch (e) {}
    }

    function saveConsent(prefs, analytics) {
      try {
        var data = {
          necessary: true,
          preferences: prefs,
          analytics: analytics,
          timestamp: Date.now(),
          version: '1.0'
        };
        localStorage.setItem('kanto_cookie_consent_v1', JSON.stringify(data));
        document.cookie = 'kanto_consent=' + (prefs ? '1' : '0') + (analytics ? '1' : '0') + '; path=/; max-age=15552000; SameSite=Lax';
      } catch (e) {}
      if (modal) modal.style.display = 'none';
    }

    if (btnOpen) {
      btnOpen.addEventListener('click', function(e) {
        e.preventDefault();
        loadConsent();
        if (modal) modal.style.display = 'flex';
      });
    }

    if (btnClose) {
      btnClose.addEventListener('click', function() {
        if (modal) modal.style.display = 'none';
      });
    }

    if (btnSave) {
      btnSave.addEventListener('click', function() {
        saveConsent(prefToggle ? prefToggle.checked : true, statToggle ? statToggle.checked : false);
      });
    }

    if (btnAccept) {
      btnAccept.addEventListener('click', function() {
        if (prefToggle) prefToggle.checked = true;
        if (statToggle) statToggle.checked = true;
        saveConsent(true, true);
      });
    }

    if (btnReject) {
      btnReject.addEventListener('click', function() {
        if (prefToggle) prefToggle.checked = false;
        if (statToggle) statToggle.checked = false;
        saveConsent(false, false);
      });
    }

    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.style.display = 'none';
      });
    }
  })();
  </script>
</body>
</html>`;
}
