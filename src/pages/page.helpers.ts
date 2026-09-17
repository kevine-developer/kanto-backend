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
    --bg: #FAFAFA;
    --surface: #FFFFFF;
    --border: #E5E7EB;
    --text: #111827;
    --text-muted: #6B7280;
    --text-subtle: #9CA3AF;
    --accent: #C0392B;
    --accent-light: #FEF2F2;
    --accent-border: #FEE2E2;
    --btn-bg: #1F2937;
    --btn-hover: #111827;
    --radius: 14px;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #09090B;
      --surface: #121215;
      --border: #27272A;
      --text: #F4F4F5;
      --text-muted: #A1A1AA;
      --text-subtle: #52525B;
      --accent: #E05615;
      --accent-light: #1C0A02;
      --accent-border: #431407;
      --btn-bg: #27272A;
      --btn-hover: #3F3F46;
    }
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
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
  }

  .page-header .brand {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-subtle);
  }

  .page-header .page-title {
    font-size: 15px;
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
    max-width: 720px;
    margin: 0 auto;
    padding: 32px 20px 80px;
  }

  h1 {
    font-size: 22px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.4px;
    margin-bottom: 6px;
  }

  .page-meta {
    font-size: 12px;
    color: var(--text-subtle);
    margin-bottom: 36px;
  }

  h2 {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    margin: 32px 0 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }

  h3 {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text);
    margin: 20px 0 6px;
  }

  p {
    font-size: 13.5px;
    color: var(--text-muted);
    line-height: 1.75;
    margin-bottom: 14px;
  }

  ul, ol {
    padding-left: 20px;
    margin-bottom: 14px;
  }

  li {
    font-size: 13.5px;
    color: var(--text-muted);
    line-height: 1.75;
    margin-bottom: 4px;
  }

  a {
    color: var(--accent);
    text-decoration: none;
  }

  a:hover { text-decoration: underline; }

  .callout {
    background: var(--accent-light);
    border: 1px solid var(--accent-border);
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 20px;
  }

  .callout p {
    margin: 0;
    font-size: 13px;
    color: var(--accent);
  }

  .contact-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    margin-top: 32px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }

  .contact-card .icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
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

  .contact-card .body { flex: 1; }
  .contact-card .label { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
  .contact-card .value { font-size: 13px; color: var(--text-muted); }

  .footer {
    margin-top: 60px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
    text-align: center;
    font-size: 12px;
    color: var(--text-subtle);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    margin-bottom: 20px;
  }

  th {
    text-align: left;
    font-weight: 600;
    color: var(--text);
    padding: 8px 12px;
    border-bottom: 2px solid var(--border);
    background: var(--surface);
  }

  td {
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
    color: var(--text-muted);
    vertical-align: top;
  }

  tr:last-child td { border-bottom: none; }

  code {
    font-family: 'Courier New', monospace;
    font-size: 12px;
    background: var(--border);
    padding: 2px 6px;
    border-radius: 4px;
    color: var(--text);
  }
`;

export const currentYear = () => new Date().getFullYear();

export function pageShell(options: {
  title: string;
  pageTitle: string;
  description?: string;
  body: string;
  hideHeader?: boolean;
}): string {
  const { title, pageTitle, description, body, hideHeader } = options;
  const year = currentYear();
  const bodyClass = hideHeader ? ' class="hide-header"' : '';
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${description || `Kanto — ${pageTitle}`}">
  <title>${title}</title>
  ${PAGE_FONT}
  <style>${PAGE_CSS}</style>
</head>
<body${bodyClass}>
  <header class="page-header">
    <span class="brand">Kanto</span>
    <span class="dot">·</span>
    <span class="page-title">${pageTitle}</span>
  </header>

  <main class="container">
    ${body}

    <div class="footer">
      © ${year} Kanto — Fampianarana ny kolontsaina malagasy<br>
      <a href="/pages/privacy">Confidentialité</a> · <a href="/pages/terms">CGU</a> · <a href="/pages/help">Aide</a> · <a href="/pages/about">À propos</a> · <a href="/pages/licenses">Licences</a>
    </div>
  </main>
</body>
</html>`;
}
