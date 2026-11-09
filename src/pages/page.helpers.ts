/**
 * Kanto — Design system partagé pour toutes les pages web statiques.
 * Police, couleurs, composants réutilisables dans les vues HTML.
 */

export const PAGE_FONT = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
`;

export const PAGE_CSS = `
  :root {
    --bg: #F5F4F0;
    --surface: #FEFEFC;
    --border: #E8E6DF;
    --text: #1A1A1A;
    --text-muted: #5C584E;
    --text-subtle: #8A8578;
    --accent: #4A6741;
    --accent-hover: #3A5333;
    --accent-light: #EEF3ED;
    --accent-border: #D5E2D2;
    --terracotta: #C0392B;
    --terracotta-light: #FDF2F0;
    --btn-bg: #2C2A24;
    --btn-hover: #1A1A1A;
    --radius: 14px;
    --radius-sm: 8px;
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #0D0D0B;
      --surface: #141412;
      --border: #262521;
      --text: #F0F0EC;
      --text-muted: #A8A59C;
      --text-subtle: #6E6B63;
      --accent: #6B9E61;
      --accent-hover: #82B378;
      --accent-light: #162415;
      --accent-border: #294427;
      --terracotta: #E75A4D;
      --terracotta-light: #2A1210;
      --btn-bg: #262521;
      --btn-hover: #3A3832;
      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
      --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    padding: 0;
    margin: 0;
  }

  .page-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: var(--shadow-sm);
  }

  .page-header .brand {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--accent);
  }

  .page-header .page-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    flex: 1;
  }

  .page-header .dot { color: var(--border); }

  body.hide-header .page-header {
    display: none !important;
  }

  body.hide-header .container {
    padding-top: 16px !important;
  }

  .container {
    max-width: 760px;
    margin: 0 auto;
    padding: 36px 20px 80px;
  }

  h1 {
    font-size: 26px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.5px;
    margin-bottom: 8px;
    line-height: 1.25;
  }

  .page-meta {
    font-size: 12.5px;
    color: var(--text-subtle);
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .page-meta .badge-official {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 600;
    background: var(--accent-light);
    color: var(--accent);
    border: 1px solid var(--accent-border);
    border-radius: 9999px;
  }

  /* Sommaire de navigation rapide */
  .toc-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px 20px;
    margin-bottom: 32px;
    box-shadow: var(--shadow-sm);
  }

  .toc-title {
    font-size: 12.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-subtle);
    margin-bottom: 10px;
  }

  .toc-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 6px 16px;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .toc-list li a {
    font-size: 12.5px;
    color: var(--text-muted);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 3px 0;
    transition: color 0.15s;
  }

  .toc-list li a:hover {
    color: var(--accent);
    text-decoration: underline;
  }

  h2 {
    font-size: 17px;
    font-weight: 700;
    color: var(--text);
    margin: 40px 0 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
    scroll-margin-top: 70px;
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  h3 {
    font-size: 14.5px;
    font-weight: 600;
    color: var(--text);
    margin: 24px 0 8px;
  }

  p {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.8;
    margin-bottom: 14px;
  }

  ul, ol {
    padding-left: 22px;
    margin-bottom: 16px;
  }

  li {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.75;
    margin-bottom: 6px;
  }

  a {
    color: var(--accent);
    text-decoration: none;
    font-weight: 500;
  }

  a:hover {
    color: var(--accent-hover);
    text-decoration: underline;
  }

  .callout {
    background: var(--surface);
    border-left: 4px solid var(--accent);
    border-radius: var(--radius-sm);
    padding: 16px 18px;
    margin-bottom: 24px;
    box-shadow: var(--shadow-sm);
  }

  .callout p {
    margin: 0;
    font-size: 13.5px;
    color: var(--text);
    line-height: 1.65;
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
    <a href="/" style="text-decoration: none;" class="brand">Kanto<span style="opacity: 0.6;">.mg</span></a>
    <span class="dot">·</span>
    <span class="page-title">${pageTitle}</span>
  </header>

  <main class="container">
    ${body}

    <div class="footer">
      <div>© ${year} <strong>kanto.mg</strong> — Ny harena ara-kolontsaina malagasy</div>
      <div class="footer-links">
        <a href="/ohabolana">Ohabolana</a>
        <a href="/angano">Angano</a>
        <a href="/kabary">Kabary</a>
        <a href="/tononkalo">Tononkalo</a>
        <a href="/raki-teny">Raki-teny</a>
        <a href="/histoire">Tantara</a>
        <a href="/pages/terms">Conditions d'utilisation (CGU)</a>
        <a href="/pages/privacy">Confidentialité &amp; RGPD</a>
        <a href="/pages/help">Aide &amp; FAQ</a>
        <a href="/pages/about">À propos</a>
        <button type="button" class="footer-cookie-btn" id="btn-open-cookie-modal">Gestion des cookies</button>
        <a href="mailto:${supportEmail}">Support (${supportEmail})</a>
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
