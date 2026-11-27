/**
 * Kanto — Design system partagé pour toutes les pages web institutionnelles.
 * Aligné sur le layout public unifié (header, footer, thème clair/sombre synchronisé).
 */

import {
  KANTO_ZAFIMANIRY_DIVIDER,
  PUBLIC_HEADER_INTERACTION_SCRIPT,
  PUBLIC_SHELL_CSS,
  PUBLIC_THEME_INIT_SCRIPT,
  renderPublicFooter,
  renderPublicHeader,
  renderPublicReviewsSection,
} from '../common/web/public-layout.js';

export const PAGE_FONT = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
`;

export const PAGE_CSS = `
  ${PUBLIC_SHELL_CSS}

  :root, [data-theme="light"] {
    --bg: var(--color-bg);
    --bg-warm: var(--color-bg-alt);
    --surface: var(--color-surface);
    --surface-elevated: var(--color-surface-elevated);
    --border: var(--color-border);
    --border-light: var(--color-border-subtle);
    --text: var(--color-ink);
    --text-muted: var(--color-ink-muted);
    --text-subtle: var(--color-ink-subtle);
    --accent: var(--color-accent);
    --accent-hover: var(--color-accent-hover);
    --accent-light: var(--color-accent-soft);
    --accent-border: var(--color-accent-border);
    --sage: var(--color-sage);
    --sage-light: var(--color-sage-soft);
    --sage-border: var(--color-sage-border);
    --terracotta: var(--color-accent);
    --terracotta-hover: var(--color-accent-hover);
    --terracotta-light: var(--color-accent-soft);
    --terracotta-border: var(--color-accent-border);
    --amber: var(--color-ochre);
    --amber-light: var(--color-ochre-soft);
    --btn-bg: var(--color-btn-primary);
    --btn-hover: var(--color-btn-primary-hover);
    --radius: var(--radius-xs);
    --shadow-sm: none;
    --shadow-md: none;
    --shadow-lg: none;
  }

  [data-theme="dark"] {
    --bg: var(--color-bg);
    --bg-warm: var(--color-bg-alt);
    --surface: var(--color-surface);
    --surface-elevated: var(--color-surface-elevated);
    --border: var(--color-border);
    --border-light: var(--color-border-subtle);
    --text: var(--color-ink);
    --text-muted: var(--color-ink-muted);
    --text-subtle: var(--color-ink-subtle);
    --accent: var(--color-accent);
    --accent-hover: var(--color-accent-hover);
    --accent-light: var(--color-accent-soft);
    --accent-border: var(--color-accent-border);
    --sage: var(--color-sage);
    --sage-light: var(--color-sage-soft);
    --sage-border: var(--color-sage-border);
    --terracotta: var(--color-accent);
    --terracotta-hover: var(--color-accent-hover);
    --terracotta-light: var(--color-accent-soft);
    --terracotta-border: var(--color-accent-border);
    --amber: var(--color-ochre);
    --amber-light: var(--color-ochre-soft);
    --btn-bg: var(--color-btn-primary);
    --btn-hover: var(--color-btn-primary-hover);
    --shadow-sm: none;
    --shadow-md: none;
    --shadow-lg: none;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: var(--font-sans);
    background: var(--bg);
    color: var(--text);
    line-height: 1.72;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: 0;
    margin: 0;
  }

  body.hide-header .container {
    padding-top: 20px !important;
    max-width: 74ch;
  }

  body.hide-header .doc-toc-sidebar {
    display: none !important;
  }

  .container {
    width: 100%;
    max-width: var(--container-max);
    flex: 1;
    margin: 0 auto;
    padding: 28px 20px 64px;
  }

  @media (min-width: 768px) {
    .container {
      padding: 44px 32px 84px;
    }
  }

  .doc-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 28px;
    align-items: start;
  }

  @media (min-width: 960px) {
    .doc-layout {
      grid-template-columns: 248px minmax(0, 72ch);
      gap: 56px;
    }
  }

  .doc-article {
    min-width: 0;
    max-width: 72ch;
  }

  /* Sommaire latéral sticky sur desktop & accordéon sur mobile */
  .doc-toc-sidebar {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    padding: 0;
  }

  @media (min-width: 960px) {
    .doc-toc-sidebar {
      position: sticky;
      top: 84px;
      background: transparent;
      border: none;
      border-right: 1px solid var(--border);
      padding-right: 20px;
      max-height: calc(100vh - 108px);
      overflow-y: auto;
    }
  }

  .doc-toc-summary {
    list-style: none;
    cursor: pointer;
    padding: 13px 16px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--accent);
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 44px;
  }

  .doc-toc-summary::-webkit-details-marker {
    display: none;
  }

  .doc-toc-chevron {
    transition: transform 0.2s ease;
    color: var(--text-subtle);
  }

  .doc-toc-accordion[open] .doc-toc-chevron {
    transform: rotate(180deg);
  }

  @media (min-width: 960px) {
    .doc-toc-summary {
      padding: 0 0 12px;
      min-height: 0;
      cursor: default;
      border-bottom: 1px solid var(--border);
      margin-bottom: 10px;
    }
    .doc-toc-chevron {
      display: none;
    }
  }

  .doc-toc-links {
    list-style: none;
    padding: 0 16px 14px;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  @media (min-width: 960px) {
    .doc-toc-links {
      padding: 0;
    }
  }

  .doc-toc-links li {
    margin: 0;
    padding: 0;
    font-size: 13px;
    line-height: 1.4;
  }

  .doc-toc-links a {
    display: flex;
    align-items: center;
    padding: 7px 0 7px 10px;
    border-left: 2px solid transparent;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.15s ease, border-color 0.15s ease;
  }

  .doc-toc-links a:hover {
    color: var(--text);
    text-decoration: none;
  }

  .doc-toc-links a.active {
    color: var(--accent);
    border-left-color: var(--accent);
    font-weight: 600;
  }

  .doc-has-sidebar .toc-card {
    display: none;
  }

  h1 {
    font-family: var(--font-serif);
    font-size: clamp(28px, 5vw, 40px);
    font-weight: 600;
    color: var(--text);
    letter-spacing: -0.025em;
    margin-bottom: 12px;
    line-height: 1.14;
  }

  .page-meta {
    font-size: 13px;
    color: var(--text-subtle);
    margin-bottom: 28px;
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
    padding: 3px 9px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    background: var(--accent-light);
    color: var(--accent);
    border: 1px solid var(--accent-border);
    border-radius: var(--radius-xs);
  }

  /* Sommaire in-body de secours (no-JS ou embed WebView) */
  .toc-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    border-radius: var(--radius-xs);
    padding: 18px 18px;
    margin-bottom: 32px;
  }

  @media (min-width: 640px) {
    .toc-card {
      padding: 20px 22px;
      margin-bottom: 36px;
    }
  }

  .toc-title {
    font-family: var(--font-sans);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--accent);
    margin-bottom: 12px;
  }

  .toc-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 4px 20px;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  @media (min-width: 560px) {
    .toc-list {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 6px 20px;
    }
  }

  .toc-list li a {
    font-size: 13.5px;
    color: var(--text-muted);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
    padding: 6px 0;
    transition: color 0.15s;
  }

  @media (min-width: 768px) {
    .toc-list li a {
      font-size: 13px;
      min-height: auto;
      padding: 4px 0;
    }
  }

  .toc-list li a:hover {
    color: var(--accent);
    text-decoration: none;
  }

  h2 {
    font-family: var(--font-serif);
    font-size: clamp(21px, 4vw, 25px);
    font-weight: 600;
    color: var(--text);
    margin: 36px 0 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
    scroll-margin-top: 84px;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 8px;
    letter-spacing: -0.015em;
  }

  @media (min-width: 768px) {
    h2 {
      margin: 44px 0 16px;
      gap: 10px;
    }
  }

  h3 {
    font-size: 15.5px;
    font-weight: 700;
    color: var(--text);
    margin: 26px 0 10px;
    letter-spacing: -0.01em;
  }

  p {
    font-size: 15px;
    color: var(--text-muted);
    line-height: 1.82;
    margin-bottom: 16px;
  }

  ul, ol {
    padding-left: 22px;
    margin-bottom: 20px;
  }

  li {
    font-size: 14.5px;
    color: var(--text-muted);
    line-height: 1.78;
    margin-bottom: 8px;
  }

  .container a {
    color: var(--accent);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.15s ease;
  }

  .container a:hover {
    color: var(--accent-hover);
    text-decoration: underline;
  }

  .callout {
    background: var(--surface);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    border-radius: var(--radius-xs);
    padding: 16px 20px;
    margin-bottom: 28px;
  }

  .callout p {
    margin: 0;
    font-size: 14px;
    color: var(--text);
    line-height: 1.7;
  }

  .callout-beta {
    background: var(--surface);
    border-left-color: var(--sage);
  }

  .contact-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    padding: 18px 18px;
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  @media (min-width: 480px) {
    .contact-card {
      flex-direction: row;
      padding: 20px 22px;
      margin-top: 36px;
      gap: 16px;
    }
  }

  .contact-card .icon {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-xs);
    background: var(--accent-light);
    border: 1px solid var(--accent-border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .contact-card .icon svg {
    width: 18px;
    height: 18px;
    stroke: var(--accent);
    stroke-width: 2;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .contact-card .body { flex: 1; min-width: 0; }
  .contact-card .label { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .contact-card .value { font-size: 13.5px; color: var(--text-muted); line-height: 1.6; overflow-wrap: anywhere; }

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
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border-collapse: collapse;
    font-size: 13px;
    margin: 20px 0 24px;
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
  }

  @media (min-width: 640px) {
    table {
      display: table;
      font-size: 13.5px;
      overflow: hidden;
    }
  }

  th {
    text-align: left;
    font-weight: 700;
    color: var(--text);
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
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
    border-radius: var(--radius-xs);
    color: var(--text);
  }

  /* Modale et bannière de cookies Kanto partagées */
  .cookie-btn-p {
    flex: 1;
    min-width: 100px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 14px;
    font-size: 12.5px;
    font-weight: 700;
    background: var(--accent);
    color: #FFFFFF;
    border: 1px solid var(--accent);
    border-radius: var(--radius-xs);
    cursor: pointer;
    text-align: center;
    transition: background-color 0.15s ease, border-color 0.15s ease;
  }

  .cookie-btn-p:hover {
    background: var(--accent-hover);
    border-color: var(--accent-hover);
  }

  .cookie-btn-s {
    flex: 1;
    min-width: 100px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 14px;
    font-size: 12.5px;
    font-weight: 600;
    background: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    cursor: pointer;
    text-align: center;
  }

  .cookie-btn-s:hover {
    border-color: var(--accent);
  }

  .cookie-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(13, 13, 11, 0.72);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .cookie-modal-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    max-width: 560px;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }

  .cookie-modal-head {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cookie-modal-head h3 {
    margin: 0;
    font-family: var(--font-serif);
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
  }

  .cookie-modal-close {
    background: none;
    border: 1px solid transparent;
    border-radius: var(--radius-xs);
    min-width: 44px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: var(--text-subtle);
    cursor: pointer;
    padding: 4px;
  }

  .cookie-modal-close:hover {
    color: var(--text);
    border-color: var(--border);
  }

  .cookie-modal-scroll {
    padding: 18px 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .cookie-category {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .cookie-category-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .cookie-category-name {
    font-size: 13.5px;
    font-weight: 700;
    color: var(--text);
  }

  .cookie-badge-req {
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--sage);
    background: var(--sage-light);
    border: 1px solid var(--sage-border);
    padding: 2px 7px;
    border-radius: var(--radius-xs);
  }

  .cookie-toggle {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    flex-shrink: 0;
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
    transition: .2s;
    border-radius: 2px;
  }

  .cookie-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: #FFFFFF;
    transition: .2s;
    border-radius: 1px;
  }

  .cookie-toggle input:checked + .cookie-slider {
    background-color: var(--accent);
  }

  .cookie-toggle input:checked + .cookie-slider:before {
    transform: translateX(20px);
  }

  .cookie-toggle input:focus-visible + .cookie-slider {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .cookie-modal-actions {
    padding: 14px 20px;
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
  showReviews?: boolean;
  supportEmail?: string;
  canonicalUrl?: string;
  slug?: string;
}): string {
  const { title, pageTitle, description, body, hideHeader } = options;
  const shouldShowReviews = !hideHeader && options.showReviews !== false;
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
<html lang="fr" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description || `Kanto — ${pageTitle}`}">
  <meta name="theme-color" content="#0D0D0B">
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
  ${PUBLIC_THEME_INIT_SCRIPT}
  <style>${PAGE_CSS}</style>
</head>
<body${bodyClass}>
  ${renderPublicHeader({ activePath: options.slug ? `/pages/${options.slug}` : '' })}

  <main id="main-content" class="container" tabindex="-1">
    <div class="doc-layout" id="doc-layout">
      <aside class="doc-toc-sidebar" id="doc-toc-sidebar" aria-label="Sommaire du document" style="display: none;">
        <details class="doc-toc-accordion" id="doc-toc-accordion" open>
          <summary class="doc-toc-summary">
            <span>Sommaire</span>
            <svg class="doc-toc-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </summary>
          <ul class="doc-toc-links" id="doc-toc-links"></ul>
        </details>
      </aside>
      <article class="doc-article" id="doc-article">
        ${body}
      </article>
    </div>
  </main>

  ${shouldShowReviews ? `${KANTO_ZAFIMANIRY_DIVIDER}\n  ${renderPublicReviewsSection({ compact: true, contextLabel: pageTitle })}` : ''}

  ${renderPublicFooter({
    supportEmail,
    cookieButtonId: 'btn-open-cookie-modal',
    currentYear: year,
  })}

  <!-- Modale de préférences de cookies partagée -->
  <div id="cookie-settings-modal" class="cookie-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title" style="display: none;">
    <div class="cookie-modal-card">
      <div class="cookie-modal-head">
        <h3 id="cookie-modal-title">Préférences de confidentialité &amp; Cookies</h3>
        <button type="button" id="cookie-settings-close" class="cookie-modal-close" aria-label="Fermer la fenêtre">&times;</button>
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
            Permet de mémoriser vos préférences visuelles (mode clair / sombre Papier &amp; Ébène) et la plateforme choisie pour le test.
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
        <button type="button" id="cookie-settings-save" class="cookie-btn-s">Enregistrer mes choix</button>
        <button type="button" id="cookie-settings-accept" class="cookie-btn-p">Tout accepter</button>
      </div>
    </div>
  </div>

  ${PUBLIC_HEADER_INTERACTION_SCRIPT}

  <script>
  (function() {
    // 1. Sommaire latéral sticky + accordéon mobile + suivi de section active
    var docLayout = document.getElementById('doc-layout');
    var docArticle = document.getElementById('doc-article');
    var tocSidebar = document.getElementById('doc-toc-sidebar');
    var tocAccordion = document.getElementById('doc-toc-accordion');
    var tocLinksList = document.getElementById('doc-toc-links');

    if (docLayout && docArticle && tocSidebar && tocLinksList && !document.body.classList.contains('hide-header')) {
      var items = [];
      var existingTocLinks = docArticle.querySelectorAll('.toc-card .toc-list a');
      if (existingTocLinks && existingTocLinks.length > 0) {
        Array.prototype.forEach.call(existingTocLinks, function(a) {
          var href = a.getAttribute('href') || '';
          var label = (a.textContent || '').trim();
          if (href.indexOf('#') === 0 && label) {
            items.push({ id: href.slice(1), label: label });
          }
        });
      } else {
        var headings = docArticle.querySelectorAll('h2');
        Array.prototype.forEach.call(headings, function(h, idx) {
          var label = (h.textContent || '').trim();
          if (!label) return;
          if (!h.id) {
            h.id = 'sec-' + (idx + 1);
          }
          items.push({ id: h.id, label: label });
        });
      }

      if (items.length >= 2) {
        var linkEls = [];
        items.forEach(function(item) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = '#' + item.id;
          a.textContent = item.label;
          a.setAttribute('data-toc-target', item.id);
          li.appendChild(a);
          tocLinksList.appendChild(li);
          linkEls.push(a);
        });

        tocSidebar.style.display = 'block';
        docLayout.classList.add('doc-has-sidebar');

        if (tocAccordion && window.innerWidth < 960) {
          tocAccordion.removeAttribute('open');
        }

        function setActiveToc(activeId) {
          linkEls.forEach(function(el) {
            if (el.getAttribute('data-toc-target') === activeId) {
              el.classList.add('active');
            } else {
              el.classList.remove('active');
            }
          });
        }

        var targets = items
          .map(function(item) { return document.getElementById(item.id); })
          .filter(Boolean);

        if (targets.length > 0) {
          setActiveToc(targets[0].id);
          if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function(entries) {
              entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                  setActiveToc(entry.target.id);
                }
              });
            }, { rootMargin: '-18% 0px -70% 0px', threshold: 0 });
            targets.forEach(function(t) { observer.observe(t); });
          }
        }
      }
    }

    // 2. Modale Cookies + accessibilité + synchronisation clés localStorage
    var modal = document.getElementById('cookie-settings-modal');
    var btnOpen = document.getElementById('btn-open-cookie-modal');
    var btnClose = document.getElementById('cookie-settings-close');
    var btnSave = document.getElementById('cookie-settings-save');
    var btnAccept = document.getElementById('cookie-settings-accept');
    var btnReject = document.getElementById('cookie-settings-reject');

    var prefToggle = document.getElementById('cookie-pref-toggle');
    var statToggle = document.getElementById('cookie-stat-toggle');

    function openCookieModal(trigger) {
      if (!modal) return;
      if (window.__kantoModalHelper) {
        window.__kantoModalHelper.open(modal, trigger);
      } else {
        modal.style.display = 'flex';
      }
    }

    function closeCookieModal() {
      if (!modal) return;
      if (window.__kantoModalHelper) {
        window.__kantoModalHelper.close(modal);
      } else {
        modal.style.display = 'none';
      }
    }

    function loadConsent() {
      try {
        var raw = localStorage.getItem('kanto_cookie_consent_v1') || localStorage.getItem('kanto_cookie_consent');
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
        var serialized = JSON.stringify(data);
        localStorage.setItem('kanto_cookie_consent_v1', serialized);
        localStorage.setItem('kanto_cookie_consent', serialized);
        document.cookie = 'kanto_consent=' + (prefs ? '1' : '0') + (analytics ? '1' : '0') + '; path=/; max-age=15552000; SameSite=Lax';
      } catch (e) {}
      closeCookieModal();
    }

    if (btnOpen) {
      btnOpen.addEventListener('click', function(e) {
        e.preventDefault();
        loadConsent();
        openCookieModal(btnOpen);
      });
    }

    if (btnClose) {
      btnClose.addEventListener('click', function() {
        closeCookieModal();
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
        if (e.target === modal) closeCookieModal();
      });
    }

    document.addEventListener('keydown', function(e) {
      if (!modal || modal.style.display === 'none') return;
      if (e.key === 'Escape') {
        closeCookieModal();
      } else if (e.key === 'Tab' && window.__kantoModalHelper) {
        window.__kantoModalHelper.trapTab(modal, e);
      }
    });
  })();
  </script>
</body>
</html>`;
}
