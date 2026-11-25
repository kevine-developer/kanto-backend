/**
 * Kanto MG — Design System & Layout Web Public Unifié
 * Source unique de vérité pour l'en-tête, le pied de page, les tokens chromatiques
 * et le basculeur de thème clair/sombre sur l'ensemble des pages publiques :
 * - Portail Bêta & Accueil (/, /beta)
 * - Rubriques Patrimoine (/ohabolana, /angano, /kabary, /tononkalo, /raki-teny, /histoire)
 * - Pages institutionnelles & légales (/pages/terms, /pages/privacy, /pages/about, /pages/help, /pages/licenses)
 * - Portail de signalement (/feedback)
 */

export const PUBLIC_THEME_INIT_SCRIPT = `
  <script>
    (function() {
      try {
        var savedTheme = localStorage.getItem('kanto_theme');
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
        var metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
          metaTheme.setAttribute('content', theme === 'light' ? '#F5F4F0' : '#0D0D0B');
        }
      } catch (e) {}
    })();
  </script>
`;

export const PUBLIC_SHELL_CSS = `
  /* ─── TOKENS UNIFIÉS KANTO MG (TERRE & ENCRE) ─────────────────────────────── */
  :root, [data-theme="light"] {
    --color-bg: #F5F4F0;
    --color-bg-alt: #EFECE6;
    --color-surface: #FEFEFC;
    --color-surface-elevated: #FFFFFF;
    --color-surface-hover: #F8F7F3;
    --color-border: #E5E2DB;
    --color-border-subtle: #ECE8E0;
    --color-divider: #DCE1D7;
    --color-ink: #1A1A1A;
    --color-ink-muted: #5C5C5C;
    --color-ink-subtle: #8A8A8A;
    --color-heading: #141412;
    --color-tanimbary: #4A6741;
    --color-tanimbary-dark: #374E30;
    --color-tanimbary-soft: #EBF2E8;
    --color-tanimbary-border: #CBD8C6;
    --color-ochre: #C58B38;
    --color-ochre-soft: #FDF6EB;
    --color-ochre-border: #F3DEC0;
    --color-terracotta: #C0392B;
    --color-terracotta-soft: #FDF2F0;
    --color-error: #B84040;
    --color-error-bg: #FDF0F0;
    --color-error-text: #B84040;
    --color-success: #4A6741;
    --color-success-bg: #EFF7ED;
    --color-success-text: #374E30;
    --color-android: #1F8B4C;
    --color-android-soft: #E8F5E9;
    --color-android-border: #C8E6C9;
    --color-ios: #0066CC;
    --color-ios-soft: #E8F1FA;
    --color-ios-border: #BBD6F2;
    --color-card-shadow: 0 4px 20px rgba(26, 26, 26, 0.04);
    --color-card-shadow-hover: 0 10px 30px rgba(26, 26, 26, 0.08);
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 20px;
    --radius-full: 999px;
    --font-serif: 'Newsreader', Georgia, 'Times New Roman', serif;
    --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  [data-theme="dark"] {
    --color-bg: #0D0D0B;
    --color-bg-alt: #141412;
    --color-surface: #141412;
    --color-surface-elevated: #1A1A18;
    --color-surface-hover: #1E1E1A;
    --color-border: #242420;
    --color-border-subtle: #1E1E1C;
    --color-divider: #252E25;
    --color-ink: #F0F0EC;
    --color-ink-muted: #9C9C98;
    --color-ink-subtle: #707070;
    --color-heading: #F0F0EC;
    --color-tanimbary: #6B9E61;
    --color-tanimbary-dark: #82B378;
    --color-tanimbary-soft: #1B241A;
    --color-tanimbary-border: #2E3E2C;
    --color-ochre: #E0A24A;
    --color-ochre-soft: #241B10;
    --color-ochre-border: #47341D;
    --color-terracotta: #E75A4D;
    --color-terracotta-soft: #2C1715;
    --color-error: #E05555;
    --color-error-bg: #2B1616;
    --color-error-text: #FFAAA0;
    --color-success: #6B9E61;
    --color-success-bg: #1B2B1B;
    --color-success-text: #B5E8AC;
    --color-android: #3DDC84;
    --color-android-soft: #132A1C;
    --color-android-border: #1F4A2F;
    --color-ios: #409CFF;
    --color-ios-soft: #10243C;
    --color-ios-border: #1B406A;
    --color-card-shadow: 0 8px 30px rgba(0, 0, 0, 0.45);
    --color-card-shadow-hover: 0 16px 44px rgba(0, 0, 0, 0.6);
  }

  /* ─── EN-TÊTE UNIFIÉ KANTO MG ────────────────────────────────────────────── */
  .site-header {
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
    background: var(--color-surface);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--color-border);
    transition: background-color 0.25s ease, border-color 0.25s ease;
  }

  .site-header-inner {
    max-width: 1180px;
    margin: 0 auto;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  @media (min-width: 480px) {
    .site-header-inner {
      padding: 12px 20px;
      gap: 14px;
    }
  }

  @media (min-width: 768px) {
    .site-header-inner {
      padding: 14px 32px;
      gap: 16px;
    }
  }

  body.hide-header .site-header,
  body.hide-header .mobile-nav-drawer {
    display: none !important;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    text-decoration: none;
    color: var(--color-ink);
    flex-shrink: 1;
    min-width: 0;
  }

  @media (min-width: 480px) {
    .brand {
      gap: 12px;
      flex-shrink: 0;
    }
  }

  .brand-logo-wrap {
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    overflow: hidden;
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    flex-shrink: 0;
  }

  @media (min-width: 480px) {
    .brand-logo-wrap {
      width: 36px;
      height: 36px;
    }
  }

  .brand-logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }

  .brand-text-wrap {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .brand-name {
    font-family: var(--font-serif);
    font-size: 1.15rem;
    font-weight: 600;
    line-height: 1.1;
    color: var(--color-heading);
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  @media (min-width: 480px) {
    .brand-name {
      font-size: 1.25rem;
    }
  }

  .brand-domain {
    color: var(--color-ochre);
    font-weight: 500;
  }

  .brand-tag {
    display: none;
    font-size: 0.68rem;
    color: var(--color-ink-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-weight: 600;
    white-space: nowrap;
  }

  @media (min-width: 400px) {
    .brand-tag {
      display: block;
    }
  }

  .header-nav {
    display: none;
    align-items: center;
    gap: 22px;
  }

  @media (min-width: 960px) {
    .header-nav {
      display: flex;
    }
  }

  .header-nav-link {
    text-decoration: none;
    color: var(--color-ink-muted);
    font-size: 0.9rem;
    font-weight: 500;
    padding: 6px 2px;
    position: relative;
    transition: color 0.15s ease;
    white-space: nowrap;
  }

  .header-nav-link:hover {
    color: var(--color-tanimbary);
  }

  .header-nav-link.active {
    color: var(--color-tanimbary);
    font-weight: 600;
  }

  .header-nav-link.active::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 2px;
    border-radius: 2px;
    background: var(--color-tanimbary);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  @media (min-width: 480px) {
    .header-actions {
      gap: 10px;
    }
  }

  .theme-toggle-btn,
  .mobile-menu-btn {
    width: 44px;
    height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-ink);
    cursor: pointer;
    transition: background-color 0.15s ease, border-color 0.15s ease;
  }

  .theme-toggle-btn:hover,
  .mobile-menu-btn:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-ink-subtle);
  }

  @media (min-width: 960px) {
    .mobile-menu-btn {
      display: none;
    }
  }

  .header-cta-btn {
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: 9px 13px;
    font-size: 0.83rem;
    font-weight: 600;
    color: #FFFFFF;
    background: var(--color-tanimbary);
    border-radius: var(--radius-md);
    transition: background-color 0.15s ease, transform 0.1s ease;
    white-space: nowrap;
  }

  @media (min-width: 480px) {
    .header-cta-btn {
      padding: 9px 18px;
      font-size: 0.88rem;
    }
  }

  .header-cta-btn:hover {
    background: var(--color-tanimbary-dark);
    transform: translateY(-1px);
  }

  /* Menu tiroir mobile */
  .mobile-nav-drawer {
    display: none;
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    padding: 14px 16px 20px;
  }

  .mobile-nav-drawer.open {
    display: block;
  }

  @media (min-width: 960px) {
    .mobile-nav-drawer,
    .mobile-nav-drawer.open {
      display: none !important;
    }
  }

  .mobile-nav-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }

  @media (min-width: 440px) {
    .mobile-nav-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .mobile-nav-link {
    display: flex;
    align-items: center;
    min-height: 44px;
    padding: 10px 14px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    color: var(--color-ink);
    font-size: 0.88rem;
    font-weight: 500;
    text-decoration: none;
    transition: border-color 0.15s ease, color 0.15s ease;
  }

  .mobile-nav-link.active,
  .mobile-nav-link:hover {
    border-color: var(--color-tanimbary);
    color: var(--color-tanimbary);
  }

  /* ─── PIED DE PAGE UNIFIÉ KANTO MG ───────────────────────────────────────── */
  .site-footer {
    width: 100%;
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    padding: 48px 20px 32px;
    display: flex;
    justify-content: center;
    margin-top: auto;
  }

  @media (min-width: 768px) {
    .site-footer {
      padding: 60px 32px 36px;
    }
  }

  .footer-container {
    width: 100%;
    max-width: 1120px;
    display: flex;
    flex-direction: column;
    gap: 36px;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
  }

  @media (min-width: 640px) {
    .footer-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (min-width: 960px) {
    .footer-grid {
      grid-template-columns: 1.8fr 1fr 1fr 1fr;
      gap: 40px;
    }
  }

  .footer-brand-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .footer-brand-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .footer-brand-name {
    font-family: var(--font-serif);
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--color-heading);
  }

  .footer-brand-desc {
    font-size: 0.88rem;
    color: var(--color-ink-muted);
    line-height: 1.55;
    max-width: 340px;
  }

  .footer-quote-mg {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 0.86rem;
    color: var(--color-ink-subtle);
    margin-top: 2px;
  }

  .footer-links-col {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .footer-heading {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-ink-subtle);
    margin-bottom: 4px;
  }

  .footer-links-col a,
  .btn-text-link {
    text-decoration: none;
    font-size: 0.88rem;
    color: var(--color-ink-muted);
    background: none;
    border: none;
    padding: 4px 0;
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    text-align: left;
    font-family: inherit;
    cursor: pointer;
    overflow-wrap: anywhere;
    transition: color 0.15s ease;
  }

  @media (min-width: 768px) {
    .footer-links-col a,
    .btn-text-link {
      padding: 1px 0;
      min-height: auto;
    }
  }

  .footer-links-col a:hover,
  .btn-text-link:hover {
    color: var(--color-tanimbary);
  }

  .footer-bottom-line {
    padding-top: 24px;
    border-top: 1px solid var(--color-border-subtle);
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 0.78rem;
    color: var(--color-ink-subtle);
  }

  @media (min-width: 768px) {
    .footer-bottom-line {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  /* ─── MODULE IMMERSIF DES AVIS COMMUNAUTÉ (NY FEON'NY FIKAMBANANA) ───────── */
  body.hide-header .kanto-reviews-section {
    display: none !important;
  }

  .kanto-reviews-section {
    width: 100%;
    padding: 64px 20px 72px;
    background: linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-alt) 48%, var(--color-bg) 100%);
    border-top: 1px solid var(--color-border-subtle);
    display: flex;
    justify-content: center;
    position: relative;
  }

  @media (min-width: 768px) {
    .kanto-reviews-section {
      padding: 84px 32px 92px;
    }
  }

  .kanto-reviews-section.is-compact {
    padding: 52px 20px 60px;
  }

  @media (min-width: 768px) {
    .kanto-reviews-section.is-compact {
      padding: 64px 32px 72px;
    }
  }

  .krv-container {
    width: 100%;
    max-width: 1120px;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  /* En-tête éditorial asymétrique */
  .krv-header {
    display: flex;
    flex-direction: column;
    gap: 18px;
    justify-content: space-between;
    align-items: flex-start;
  }

  @media (min-width: 820px) {
    .krv-header {
      flex-direction: row;
      align-items: flex-end;
      gap: 32px;
    }
  }

  .krv-header-copy {
    max-width: 620px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .krv-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--color-ochre);
  }

  .krv-eyebrow::before {
    content: '';
    width: 24px;
    height: 2px;
    border-radius: 2px;
    background: var(--color-ochre);
  }

  .krv-title {
    font-family: var(--font-serif);
    font-size: 1.95rem;
    font-weight: 600;
    line-height: 1.18;
    color: var(--color-heading);
    letter-spacing: -0.025em;
    margin: 0;
  }

  @media (min-width: 768px) {
    .krv-title {
      font-size: 2.35rem;
    }
  }

  .krv-subtitle {
    font-size: 0.96rem;
    line-height: 1.6;
    color: var(--color-ink-muted);
    margin: 0;
  }

  /* Baromètre Kanto (Score monumental + Histogramme interactif) */
  .krv-barometer {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-top: 3px solid var(--color-ochre);
    border-radius: var(--radius-lg);
    padding: 22px;
    box-shadow: var(--color-card-shadow);
  }

  @media (min-width: 820px) {
    .krv-barometer {
      grid-template-columns: 0.95fr 1.45fr;
      gap: 32px;
      padding: 26px 30px;
      align-items: center;
    }
  }

  .krv-score-panel {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px 20px;
    padding-bottom: 18px;
    border-bottom: 1px solid var(--color-border-subtle);
  }

  @media (min-width: 820px) {
    .krv-score-panel {
      flex-wrap: nowrap;
      padding-bottom: 0;
      padding-right: 28px;
      border-bottom: none;
      border-right: 1px solid var(--color-border-subtle);
    }
  }

  .krv-score-number-wrap {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .krv-score-value {
    font-family: var(--font-serif);
    font-size: clamp(2.35rem, 8vw, 3.1rem);
    font-weight: 700;
    line-height: 0.95;
    color: var(--color-heading);
    letter-spacing: -0.04em;
  }

  .krv-score-scale {
    font-family: var(--font-serif);
    font-size: 1.15rem;
    color: var(--color-ink-subtle);
  }

  .krv-score-details {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .krv-stars-row {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    color: var(--color-ochre);
  }

  .star-icon-filled {
    fill: var(--color-ochre);
    color: var(--color-ochre);
  }

  .star-icon-empty {
    fill: transparent;
    color: var(--color-border);
  }

  .krv-total-count {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--color-ink);
  }

  .krv-trust-note {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.77rem;
    color: var(--color-tanimbary);
    font-weight: 500;
  }

  /* Histogramme & Filtres */
  .krv-dist-panel {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .krv-dist-bars {
    display: grid;
    grid-template-columns: 1fr;
    gap: 7px;
  }

  .krv-dist-row {
    display: grid;
    grid-template-columns: 42px 1fr 38px;
    align-items: center;
    gap: 8px;
    min-height: 36px;
    background: transparent;
    border: none;
    padding: 4px 6px;
    border-radius: 6px;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    transition: background-color 0.15s ease;
  }

  @media (min-width: 768px) {
    .krv-dist-row {
      min-height: 28px;
      grid-template-columns: 44px 1fr 40px;
      gap: 10px;
      padding: 3px 6px;
    }
  }

  .krv-dist-row:hover {
    background: var(--color-surface-hover);
  }

  .krv-dist-row.is-active {
    background: var(--color-ochre-soft);
  }

  .krv-dist-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--color-ink-muted);
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }

  .krv-dist-track {
    height: 7px;
    border-radius: var(--radius-full);
    background: var(--color-bg-alt);
    border: 1px solid var(--color-border-subtle);
    overflow: hidden;
  }

  .krv-dist-fill {
    height: 100%;
    width: 0%;
    border-radius: var(--radius-full);
    background: linear-gradient(90deg, var(--color-ochre) 0%, var(--color-tanimbary) 100%);
    transition: width 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .krv-dist-pct {
    font-size: 0.76rem;
    font-weight: 600;
    color: var(--color-ink-subtle);
    text-align: right;
  }

  .krv-filter-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    padding-top: 4px;
  }

  .krv-filter-pills {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .krv-filter-btn {
    min-height: 40px;
    padding: 7px 14px;
    border-radius: var(--radius-full);
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    color: var(--color-ink-muted);
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  @media (min-width: 768px) {
    .krv-filter-btn {
      min-height: 36px;
      padding: 6px 14px;
    }
  }

  .krv-filter-btn:hover {
    border-color: var(--color-tanimbary);
    color: var(--color-tanimbary);
  }

  .krv-filter-btn.active {
    background: var(--color-tanimbary-soft);
    border-color: var(--color-tanimbary);
    color: var(--color-tanimbary);
  }

  .krv-context-tag {
    font-size: 0.75rem;
    color: var(--color-ink-subtle);
    font-weight: 500;
  }

  /* Scène de Lecture Vedette (Tsiahy Misongadina) */
  .krv-spotlight {
    position: relative;
    overflow: hidden;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 20px 18px;
    box-shadow: var(--color-card-shadow);
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  @media (min-width: 768px) {
    .krv-spotlight {
      padding: 32px 36px;
      gap: 18px;
    }
  }

  .krv-spotlight-motif {
    position: absolute;
    right: -18px;
    top: -18px;
    width: 190px;
    height: 190px;
    color: var(--color-ochre);
    opacity: 0.06;
    pointer-events: none;
  }

  .krv-spotlight-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
  }

  .krv-spotlight-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 0.74rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--color-tanimbary);
    background: var(--color-tanimbary-soft);
    border: 1px solid var(--color-tanimbary-border);
    padding: 4px 12px;
    border-radius: var(--radius-full);
  }

  .krv-spotlight-controls {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .krv-spotlight-counter {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-ink-subtle);
    min-width: 44px;
    text-align: center;
  }

  .krv-nav-btn {
    width: 44px;
    height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    color: var(--color-ink);
    cursor: pointer;
    transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease;
  }

  .krv-nav-btn:hover:not(:disabled) {
    border-color: var(--color-tanimbary);
    color: var(--color-tanimbary);
    background: var(--color-surface-hover);
  }

  .krv-nav-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .krv-spotlight-quote-wrap {
    position: relative;
    z-index: 1;
    transition: opacity 0.22s ease, transform 0.22s ease;
  }

  .krv-spotlight-quote-wrap.is-switching {
    opacity: 0;
    transform: translateY(4px);
  }

  .krv-spotlight-quote {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: clamp(1.12rem, 3.6vw, 1.48rem);
    line-height: 1.54;
    color: var(--color-heading);
    overflow-wrap: anywhere;
    margin: 0;
  }

  .krv-spotlight-footer {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
    padding-top: 14px;
    border-top: 1px solid var(--color-border-subtle);
  }

  /* Grille Desktop / Carrousel Tactile Mobile */
  .krv-cards-viewport {
    position: relative;
    width: 100%;
  }

  .krv-cards-grid {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding: 4px 2px 14px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: var(--color-border) transparent;
  }

  @media (min-width: 900px) {
    .krv-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
      overflow-x: visible;
      scroll-snap-type: none;
      padding: 0;
    }
  }

  .review-card-item {
    flex: 0 0 84%;
    min-width: 0;
    scroll-snap-align: start;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 16px;
    transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
  }

  @media (min-width: 600px) and (max-width: 899px) {
    .review-card-item {
      flex: 0 0 47%;
      padding: 20px;
    }
  }

  @media (min-width: 900px) {
    .review-card-item {
      flex: initial;
      padding: 20px;
    }
  }

  .review-card-item:hover {
    transform: translateY(-2px);
    border-color: var(--color-tanimbary-border);
    box-shadow: var(--color-card-shadow-hover);
  }

  .review-card-item.is-spotlight {
    border-color: var(--color-tanimbary);
    box-shadow: 0 0 0 1px var(--color-tanimbary-border), var(--color-card-shadow);
  }

  .review-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .review-card-stars {
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }

  .review-card-badge-verified {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    border-radius: var(--radius-full);
    background: var(--color-tanimbary-soft);
    color: var(--color-tanimbary);
    font-size: 0.72rem;
    font-weight: 600;
  }

  .review-card-comment {
    font-size: 0.94rem;
    line-height: 1.62;
    color: var(--color-ink);
    overflow-wrap: anywhere;
    margin: 0;
    flex: 1;
  }

  .review-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding-top: 12px;
    border-top: 1px solid var(--color-border-subtle);
  }

  .review-author-group {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .review-avatar-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-serif);
    font-size: 0.88rem;
    font-weight: 700;
    flex-shrink: 0;
    background: var(--color-tanimbary-soft);
    color: var(--color-tanimbary);
    border: 1px solid var(--color-tanimbary-border);
  }

  .review-avatar-circle.tone-ochre {
    background: var(--color-ochre-soft);
    color: var(--color-ochre);
    border-color: var(--color-ochre-border);
  }

  .review-avatar-circle.tone-terracotta {
    background: var(--color-terracotta-soft);
    color: var(--color-terracotta);
    border-color: var(--color-terracotta-soft);
  }

  .review-author-meta {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .review-card-author {
    font-size: 0.86rem;
    font-weight: 600;
    color: var(--color-heading);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .review-card-date {
    font-size: 0.74rem;
    color: var(--color-ink-subtle);
  }

  .review-card-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .review-card-version {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--color-ink-muted);
    background: var(--color-bg-alt);
    border: 1px solid var(--color-border);
    padding: 2px 8px;
    border-radius: var(--radius-full);
  }

  .krv-card-spot-btn {
    min-width: 40px;
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: 1px solid var(--color-border);
    background: transparent;
    color: var(--color-ink-muted);
    cursor: pointer;
    transition: border-color 0.15s ease, color 0.15s ease;
  }

  .krv-card-spot-btn:hover {
    border-color: var(--color-tanimbary);
    color: var(--color-tanimbary);
  }

  /* État Skeleton & Vide */
  .krv-skeleton-card {
    flex: 0 0 84%;
    min-width: 240px;
    height: 190px;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    background: linear-gradient(90deg, var(--color-surface) 25%, var(--color-surface-hover) 50%, var(--color-surface) 75%);
    background-size: 200% 100%;
    animation: krvShimmer 1.5s infinite linear;
  }

  @media (min-width: 600px) and (max-width: 899px) {
    .krv-skeleton-card {
      flex: 0 0 47%;
    }
  }

  @media (min-width: 900px) {
    .krv-skeleton-card {
      flex: initial;
      min-width: 0;
    }
  }

  @keyframes krvShimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .krv-skeleton-card {
      animation: none;
    }
    .krv-dist-fill,
    .krv-spotlight-quote-wrap {
      transition: none;
    }
  }

  .reviews-empty-state {
    grid-column: 1 / -1;
    width: 100%;
    padding: 32px 24px;
    text-align: center;
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-ink-muted);
    font-size: 0.94rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .krv-pagination-box {
    display: flex;
    justify-content: center;
    margin-top: 6px;
  }

  .krv-btn-load-more {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    padding: 10px 22px;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-ink);
    font-family: inherit;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease;
  }

  .krv-btn-load-more:hover {
    border-color: var(--color-tanimbary);
    color: var(--color-tanimbary);
    background: var(--color-surface-hover);
  }
`;

export interface PublicHeaderOptions {
  /** Chemin actif pour mettre le lien correspondant en surbrillance */
  activePath?: string;
  /** True si rendu sur la landing page principale (ancres locales #inscription / #telechargement) */
  isLanding?: boolean;
}

export function renderPublicHeader(options?: PublicHeaderOptions): string {
  const active = options?.activePath || '';
  const isLanding = Boolean(options?.isLanding);
  const inscriptionHref = isLanding ? '#inscription' : '/#inscription';
  const downloadHref = isLanding ? '#telechargement' : '/#telechargement';

  const navLinks = [
    { href: inscriptionHref, label: 'Inscription', key: '/' },
    { href: downloadHref, label: 'Téléchargement', key: '/download' },
    { href: '/ohabolana', label: 'Ohabolana', key: '/ohabolana' },
    { href: '/angano', label: 'Angano', key: '/angano' },
    { href: '/kabary', label: 'Kabary', key: '/kabary' },
    { href: '/pages/about', label: 'À propos', key: '/pages/about' },
    { href: '/pages/help', label: 'Aide', key: '/pages/help' },
  ];

  const desktopNavHtml = navLinks
    .map(
      (link) =>
        `<a href="${link.href}" class="header-nav-link${active === link.key ? ' active' : ''}">${link.label}</a>`,
    )
    .join('\n        ');

  const mobileNavLinks = [
    { href: '/', label: 'Accueil & Bêta', key: '/' },
    { href: '/ohabolana', label: 'Ohabolana', key: '/ohabolana' },
    { href: '/angano', label: 'Angano', key: '/angano' },
    { href: '/kabary', label: 'Kabary', key: '/kabary' },
    { href: '/tononkalo', label: 'Tononkalo', key: '/tononkalo' },
    { href: '/raki-teny', label: 'Raki-teny', key: '/raki-teny' },
    { href: '/histoire', label: 'Tantara (Histoire)', key: '/histoire' },
    { href: '/pages/about', label: 'À propos', key: '/pages/about' },
    { href: '/pages/help', label: 'Aide & FAQ', key: '/pages/help' },
    { href: '/feedback', label: 'Signaler un bug', key: '/feedback' },
  ];

  const mobileNavHtml = mobileNavLinks
    .map(
      (link) =>
        `<a href="${link.href}" class="mobile-nav-link${active === link.key ? ' active' : ''}">${link.label}</a>`,
    )
    .join('\n          ');

  return `
  <header class="site-header">
    <div class="site-header-inner">
      <a href="/" class="brand" aria-label="Kanto MG - Accueil">
        <div class="brand-logo-wrap">
          <img
            src="/logo.png"
            alt="Logo officiel Kanto MG"
            class="brand-logo"
            width="36"
            height="36"
            onerror="this.onerror=null; this.src='/favicon.png';"
          />
        </div>
        <div class="brand-text-wrap">
          <span class="brand-name">kanto<span class="brand-domain">.mg</span></span>
          <span class="brand-tag">Lova sy Kolontsaina</span>
        </div>
      </a>

      <nav class="header-nav" aria-label="Navigation principale">
        ${desktopNavHtml}
      </nav>

      <div class="header-actions">
        <button type="button" class="theme-toggle-btn" id="theme-toggle" aria-label="Basculer le thème d'affichage">
          <svg id="theme-icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          <svg id="theme-icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        </button>

        <a href="${inscriptionHref}" class="header-cta-btn" id="header-btn-register">
          <span>Rejoindre</span>
        </a>

        <button type="button" class="mobile-menu-btn" id="mobile-menu-toggle" aria-label="Ouvrir le menu de navigation" aria-expanded="false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>
    </div>

    <div class="mobile-nav-drawer" id="mobile-nav-drawer" aria-label="Menu mobile">
      <div class="mobile-nav-grid">
        ${mobileNavHtml}
      </div>
    </div>
  </header>
  `;
}

export interface PublicFooterOptions {
  legalBaseUrl?: string;
  supportEmail?: string;
  cookieButtonId?: string;
  currentYear?: number;
  isLanding?: boolean;
}

export function renderPublicFooter(options?: PublicFooterOptions): string {
  const legalBaseUrl = options?.legalBaseUrl || '';
  const supportEmail =
    options?.supportEmail || process.env.SUPPORT_EMAIL || 'support@kanto.mg';
  const cookieButtonId = options?.cookieButtonId || 'btn-open-cookie-modal';
  const year = options?.currentYear || new Date().getFullYear();
  const isLanding = Boolean(options?.isLanding);

  const inscriptionHref = isLanding ? '#inscription' : '/#inscription';
  const downloadHref = isLanding ? '#telechargement' : '/#telechargement';
  const cguHref = legalBaseUrl ? `${legalBaseUrl}/pages/terms` : '/pages/terms';
  const privacyHref = legalBaseUrl
    ? `${legalBaseUrl}/pages/privacy`
    : '/pages/privacy';
  const licensesHref = legalBaseUrl
    ? `${legalBaseUrl}/pages/licenses`
    : '/pages/licenses';

  return `
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-brand-col">
          <div class="footer-brand-wrap">
            <img src="/logo.png" alt="Kanto MG" width="28" height="28" style="border-radius:6px;" onerror="this.onerror=null; this.src='/favicon.png';" />
            <span class="footer-brand-name">kanto.mg</span>
          </div>
          <p class="footer-brand-desc">
            Sanctuaire numérique contemporain dédié à la valorisation, à la transmission et au rayonnement de la culture malgache.
          </p>
          <p class="footer-quote-mg">« Ny hazo no vanon-ko lakana, ny tany naniriany no tsara. »</p>
        </div>

        <div class="footer-links-col">
          <span class="footer-heading">Patrimoine vivant</span>
          <a href="/ohabolana">Ohabolana (Proverbes)</a>
          <a href="/angano">Angano (Contes)</a>
          <a href="/kabary">Kabary (Discours)</a>
          <a href="/tononkalo">Tononkalo (Poésies)</a>
          <a href="/raki-teny">Raki-teny (Vocabulaire)</a>
          <a href="/histoire">Tantara (Histoire)</a>
        </div>

        <div class="footer-links-col">
          <span class="footer-heading">Application &amp; Bêta</span>
          <a href="${inscriptionHref}">1. Inscription iOS (TestFlight)</a>
          <a href="https://groups.google.com/g/communaute-kanto" target="_blank" rel="noopener noreferrer">2. Bêta Android (Google Groups)</a>
          <a href="${downloadHref}">3. Téléchargement direct</a>
          <a href="#avis">Avis de la communauté</a>
          <a href="/pages/about">À propos de Kanto</a>
          <a href="/pages/help">Centre d'aide &amp; FAQ</a>
        </div>

        <div class="footer-links-col">
          <span class="footer-heading">Transparence &amp; Support</span>
          <a href="${cguHref}" id="footer-link-cgu">Conditions Générales (CGU)</a>
          <a href="${privacyHref}" id="footer-link-privacy">Confidentialité &amp; RGPD</a>
          <a href="${licensesHref}">Mentions légales &amp; Licences</a>
          <a href="/feedback">Signaler une anomalie</a>
          <button type="button" class="btn-text-link" id="${cookieButtonId}">Cookies &amp; Préférences</button>
          <a href="mailto:${supportEmail}">Support : ${supportEmail}</a>
        </div>
      </div>

      <div class="footer-bottom-line">
        <span>© ${year} Kanto MG • Lova sy Kolontsaina Malagasy. Tous droits réservés.</span>
        <span>Version Bêta Officielle • app-kanto.gastsar.fr</span>
      </div>
    </div>
  </footer>
  `;
}

function escapePublicHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface PublicReviewsOptions {
  /** Mode plus resserré pour les pages secondaires (3 cartes par page au lieu de 6) */
  compact?: boolean;
  /** Étiquette contextuelle affichée sur le bandeau (ex: "Patrimoine • Ohabolana") */
  contextLabel?: string;
}

export function renderPublicReviewsSection(
  options?: PublicReviewsOptions,
): string {
  const isCompact = Boolean(options?.compact);
  const limit = isCompact ? 3 : 6;
  const contextLabel = escapePublicHtml(
    options?.contextLabel || 'Bêta & Application Kanto MG',
  );

  const distRows = [5, 4, 3, 2, 1]
    .map(
      (star) => `
          <button type="button" class="krv-dist-row" data-rating="${star}" aria-label="Filtrer les avis ${star} étoiles">
            <span class="krv-dist-label">${star} ★</span>
            <span class="krv-dist-track"><span class="krv-dist-fill" id="krv-bar-${star}"></span></span>
            <span class="krv-dist-pct" id="krv-pct-${star}">0%</span>
          </button>`,
    )
    .join('');

  return `
  <section class="kanto-reviews-section${isCompact ? ' is-compact' : ''}" id="avis" aria-labelledby="krv-section-title" data-reviews-limit="${limit}">
    <div class="krv-container">
      <!-- En-tête éditorial -->
      <div class="krv-header">
        <div class="krv-header-copy">
          <span class="krv-eyebrow">Feon'ny Fikambanana • Voix de la communauté</span>
          <h2 id="krv-section-title" class="krv-title">Ce que la communauté retient de Kanto</h2>
          <p class="krv-subtitle">
            Retours authentiques, vérifiés et publiés avec le consentement explicite de leurs auteurs autour de la langue et du patrimoine malgaches.
          </p>
        </div>
      </div>

      <!-- Baromètre de confiance & histogramme interactif -->
      <div class="krv-barometer">
        <div class="krv-score-panel">
          <div class="krv-score-number-wrap">
            <span class="krv-score-value" id="reviews-avg-rating">5,0</span>
            <span class="krv-score-scale">/ 5</span>
          </div>
          <div class="krv-score-details">
            <div class="krv-stars-row" id="reviews-avg-stars" aria-label="Note moyenne">
              <svg width="15" height="15" viewBox="0 0 24 24" class="star-icon-filled" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="15" height="15" viewBox="0 0 24 24" class="star-icon-filled" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="15" height="15" viewBox="0 0 24 24" class="star-icon-filled" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="15" height="15" viewBox="0 0 24 24" class="star-icon-filled" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="15" height="15" viewBox="0 0 24 24" class="star-icon-filled" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <span class="krv-total-count" id="reviews-total-count">Avis 4★ et 5★ certifiés</span>
            <span class="krv-trust-note">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
              <span>Modération &amp; consentement vérifiés</span>
            </span>
          </div>
        </div>

        <div class="krv-dist-panel">
          <div class="krv-dist-bars" id="krv-distribution-bars">
            ${distRows}
          </div>
          <div class="krv-filter-bar">
            <div class="krv-filter-pills" role="group" aria-label="Filtrer les avis par note">
              <button type="button" class="krv-filter-btn active" data-filter-rating="all" aria-pressed="true">Tous (4★+)</button>
              <button type="button" class="krv-filter-btn" data-filter-rating="5" aria-pressed="false">5 étoiles</button>
              <button type="button" class="krv-filter-btn" data-filter-rating="4" aria-pressed="false">4 étoiles</button>
            </div>
            <span class="krv-context-tag">${contextLabel}</span>
          </div>
        </div>
      </div>

      <!-- Scène de lecture vedette (Tsiahy Misongadina) -->
      <article class="krv-spotlight" id="krv-spotlight" style="display: none;" aria-live="polite">
        <svg class="krv-spotlight-motif" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <polygon points="60,6 114,60 60,114 6,60"></polygon>
          <polygon points="60,24 96,60 60,96 24,60"></polygon>
          <polygon points="60,42 78,60 60,78 42,60"></polygon>
          <line x1="60" y1="0" x2="60" y2="120"></line>
          <line x1="0" y1="60" x2="120" y2="60"></line>
        </svg>

        <div class="krv-spotlight-top">
          <span class="krv-spotlight-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            <span>Tsiahy Misongadina • Parole à la une</span>
          </span>
          <div class="krv-spotlight-controls">
            <button type="button" class="krv-nav-btn" id="krv-spot-prev" aria-label="Avis précédent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <span class="krv-spotlight-counter" id="krv-spot-counter">01 / 01</span>
            <button type="button" class="krv-nav-btn" id="krv-spot-next" aria-label="Avis suivant">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>

        <div class="krv-spotlight-quote-wrap" id="krv-spotlight-quote-wrap">
          <blockquote class="krv-spotlight-quote" id="krv-spot-quote"></blockquote>
        </div>

        <div class="krv-spotlight-footer">
          <div class="review-author-group">
            <div class="review-avatar-circle" id="krv-spot-avatar">K</div>
            <div class="review-author-meta">
              <span class="review-card-author" id="krv-spot-author">Membre de la communauté</span>
              <span class="review-card-date" id="krv-spot-date"></span>
            </div>
          </div>
          <div class="review-card-actions">
            <div class="review-card-stars" id="krv-spot-stars"></div>
            <span class="review-card-version" id="krv-spot-version" style="display: none;"></span>
          </div>
        </div>
      </article>

      <!-- Grille desktop / Carrousel tactile mobile des avis -->
      <div class="krv-cards-viewport">
        <div class="krv-cards-grid" id="reviews-cards-list">
          <div class="krv-skeleton-card" aria-hidden="true"></div>
          <div class="krv-skeleton-card" aria-hidden="true"></div>
          <div class="krv-skeleton-card" aria-hidden="true"></div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="krv-pagination-box" id="reviews-pagination-box" style="display: none;">
        <button type="button" class="krv-btn-load-more" id="btn-load-more-reviews">
          <span>Découvrir plus de témoignages</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
      </div>
    </div>
  </section>
  `;
}

/**
 * Script autonome du module Avis Communautaire (baromètre, scène vedette
 * et grille/carrousel filtrable). Idempotent et compatible avec les
 * environnements DOM légers de test.
 */
export const PUBLIC_REVIEWS_SCRIPT = `
(function initCommunityReviews() {
  if (typeof window !== 'undefined' && window.__kantoReviewsInitialized) return;
  if (typeof window !== 'undefined') window.__kantoReviewsInitialized = true;

  var sectionEl = document.getElementById('avis');
  var avgScoreEl = document.getElementById('reviews-avg-rating');
  var avgStarsEl = document.getElementById('reviews-avg-stars');
  var totalCountEl = document.getElementById('reviews-total-count');
  var cardsListEl = document.getElementById('reviews-cards-list');
  var paginationBox = document.getElementById('reviews-pagination-box');
  var btnLoadMore = document.getElementById('btn-load-more-reviews');

  if (!cardsListEl) return;

  var pageLimit = 6;
  if (sectionEl && typeof sectionEl.getAttribute === 'function') {
    var attrLimit = parseInt(sectionEl.getAttribute('data-reviews-limit') || '6', 10);
    if (attrLimit > 0 && attrLimit <= 12) pageLimit = attrLimit;
  }

  var currentPage = 1;
  var totalPages = 1;
  var activeRatingFilter = 'all';
  var isLoadingReviews = false;
  var loadedReviews = [];
  var spotlightIndex = 0;

  var spotlightEl = document.getElementById('krv-spotlight');
  var spotQuoteWrap = document.getElementById('krv-spotlight-quote-wrap');
  var spotQuoteEl = document.getElementById('krv-spot-quote');
  var spotAuthorEl = document.getElementById('krv-spot-author');
  var spotDateEl = document.getElementById('krv-spot-date');
  var spotAvatarEl = document.getElementById('krv-spot-avatar');
  var spotStarsEl = document.getElementById('krv-spot-stars');
  var spotVersionEl = document.getElementById('krv-spot-version');
  var spotCounterEl = document.getElementById('krv-spot-counter');
  var btnSpotPrev = document.getElementById('krv-spot-prev');
  var btnSpotNext = document.getElementById('krv-spot-next');

  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderStarSvg(filled, size) {
    var sz = size || 15;
    return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" class="' + (filled ? 'star-icon-filled' : 'star-icon-empty') + '" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
  }

  function renderStarsRow(rating, size) {
    var html = '';
    for (var i = 1; i <= 5; i++) {
      html += renderStarSvg(i <= Math.round(rating), size);
    }
    return html;
  }

  function formatDate(dateStr) {
    try {
      var d = new Date(dateStr);
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return '';
    }
  }

  function getInitials(name) {
    if (!name) return 'K';
    var parts = String(name).trim().split(/\\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return String(name).slice(0, 2).toUpperCase();
  }

  function getToneClass(name) {
    var code = 0;
    var s = String(name || 'K');
    for (var i = 0; i < s.length; i++) code += s.charCodeAt(i);
    var tones = ['', ' tone-ochre', ' tone-terracotta'];
    return tones[code % tones.length];
  }

  function padTwo(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function renderSpotlight(index) {
    if (!spotlightEl || !loadedReviews || loadedReviews.length === 0) {
      if (spotlightEl) spotlightEl.style.display = 'none';
      return;
    }

    if (index < 0) index = loadedReviews.length - 1;
    if (index >= loadedReviews.length) index = 0;
    spotlightIndex = index;

    var item = loadedReviews[spotlightIndex];
    spotlightEl.style.display = 'flex';

    var applyContent = function() {
      var name = item.publicDisplayName || 'Membre de la communauté';
      var initials = getInitials(name);
      if (spotQuoteEl) spotQuoteEl.textContent = '« ' + item.comment + ' »';
      if (spotAuthorEl) spotAuthorEl.textContent = name;
      if (spotDateEl) spotDateEl.textContent = formatDate(item.createdAt);
      if (spotAvatarEl) {
        spotAvatarEl.textContent = initials;
        spotAvatarEl.className = 'review-avatar-circle' + getToneClass(name);
      }
      if (spotStarsEl) spotStarsEl.innerHTML = renderStarsRow(item.rating, 14);
      if (spotVersionEl) {
        if (item.appVersion) {
          spotVersionEl.textContent = 'v' + item.appVersion;
          spotVersionEl.style.display = 'inline-block';
        } else {
          spotVersionEl.style.display = 'none';
        }
      }
      if (spotCounterEl) {
        spotCounterEl.textContent = padTwo(spotlightIndex + 1) + ' / ' + padTwo(loadedReviews.length);
      }
      if (btnSpotPrev) btnSpotPrev.disabled = loadedReviews.length <= 1;
      if (btnSpotNext) btnSpotNext.disabled = loadedReviews.length <= 1;
      if (spotQuoteWrap) spotQuoteWrap.classList.remove('is-switching');
    };

    if (spotQuoteWrap && typeof setTimeout === 'function') {
      spotQuoteWrap.classList.add('is-switching');
      setTimeout(applyContent, 140);
    } else {
      applyContent();
    }

    if (cardsListEl && cardsListEl.children) {
      for (var i = 0; i < cardsListEl.children.length; i++) {
        var child = cardsListEl.children[i];
        if (child && child.classList) {
          if (i === spotlightIndex) child.classList.add('is-spotlight');
          else child.classList.remove('is-spotlight');
        }
      }
    }
  }

  function loadStats() {
    fetch('/api/reviews/public/stats')
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(stats) {
        if (!stats || typeof stats.totalReviews !== 'number') return;
        var total = stats.totalReviews;
        if (avgScoreEl) {
          avgScoreEl.textContent = total > 0 ? stats.averageRating.toFixed(1).replace('.', ',') : '5,0';
        }
        if (avgStarsEl) {
          avgStarsEl.innerHTML = renderStarsRow(total > 0 ? stats.averageRating : 5, 15);
        }
        if (totalCountEl) {
          totalCountEl.textContent = total > 0
            ? total + ' avis certifié' + (total > 1 ? 's' : '') + ' (4★ et 5★)'
            : 'Avis 4★ et 5★ certifiés';
        }
        if (stats.distribution) {
          for (var s = 1; s <= 5; s++) {
            var entry = stats.distribution[s] || { percentage: 0 };
            var pct = typeof entry.percentage === 'number' ? entry.percentage : 0;
            var barEl = document.getElementById('krv-bar-' + s);
            var pctEl = document.getElementById('krv-pct-' + s);
            if (barEl && barEl.style) barEl.style.width = pct + '%';
            if (pctEl) pctEl.textContent = pct + '%';
          }
        }
      })
      .catch(function(err) {
        console.warn('[Reviews] Erreur chargement stats:', err);
      });
  }

  function loadReviews(page, append) {
    if (isLoadingReviews) return;
    isLoadingReviews = true;

    var filterQuery = (activeRatingFilter === '5' || activeRatingFilter === '4')
      ? '&rating=' + activeRatingFilter
      : '&minRating=4';
    var url = '/api/reviews/public?page=' + page + '&limit=' + pageLimit + filterQuery;

    fetch(url)
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(res) {
        isLoadingReviews = false;
        var items = res.data || [];
        totalPages = res.pagination ? res.pagination.totalPages : 1;
        currentPage = page;

        if (!append) {
          cardsListEl.innerHTML = '';
          loadedReviews = [];
          spotlightIndex = 0;
        }

        if (items.length === 0 && !append) {
          if (spotlightEl) spotlightEl.style.display = 'none';
          cardsListEl.innerHTML =
            '<div class="reviews-empty-state">' +
              '<span>Mbola tsy misy hevitra ho an\\u2019ity sivana ity. Aucun avis disponible pour ce filtre pour le moment.</span>' +
            '</div>';
          if (paginationBox) paginationBox.style.display = 'none';
          return;
        }

        items.forEach(function(item) {
          var itemIdx = loadedReviews.length;
          loadedReviews.push(item);

          var card = document.createElement('article');
          card.className = 'review-card-item' + (itemIdx === spotlightIndex ? ' is-spotlight' : '');

          var name = item.publicDisplayName || 'Membre de la communauté';
          var initials = getInitials(name);
          var toneClass = getToneClass(name);
          var versionBadge = item.appVersion
            ? '<span class="review-card-version">v' + escHtml(item.appVersion) + '</span>'
            : '';
          var dateFormatted = formatDate(item.createdAt);

          card.innerHTML =
            '<div class="review-card-head">' +
              '<div class="review-card-stars">' + renderStarsRow(item.rating, 14) + '</div>' +
              '<div class="review-card-badge-verified">' +
                '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
                '<span>Vérifié</span>' +
              '</div>' +
            '</div>' +
            '<p class="review-card-comment">« ' + escHtml(item.comment) + ' »</p>' +
            '<div class="review-card-footer">' +
              '<div class="review-author-group">' +
                '<div class="review-avatar-circle' + toneClass + '">' + escHtml(initials) + '</div>' +
                '<div class="review-author-meta">' +
                  '<span class="review-card-author">' + escHtml(name) + '</span>' +
                  '<span class="review-card-date">' + dateFormatted + '</span>' +
                '</div>' +
              '</div>' +
              '<div class="review-card-actions">' +
                versionBadge +
                '<button type="button" class="krv-card-spot-btn" data-spot-idx="' + itemIdx + '" aria-label="Lire cet avis à la une">' +
                  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>' +
                '</button>' +
              '</div>' +
            '</div>';

          cardsListEl.appendChild(card);
        });

        if (!append && loadedReviews.length > 0) {
          renderSpotlight(0);
        } else if (spotCounterEl && loadedReviews.length > 0) {
          spotCounterEl.textContent = padTwo(spotlightIndex + 1) + ' / ' + padTwo(loadedReviews.length);
        }

        if (paginationBox) {
          paginationBox.style.display = (currentPage < totalPages) ? 'flex' : 'none';
        }
      })
      .catch(function(err) {
        isLoadingReviews = false;
        console.warn('[Reviews] Erreur chargement avis:', err);
        if (!append) {
          if (spotlightEl) spotlightEl.style.display = 'none';
          cardsListEl.innerHTML = '<div class="reviews-empty-state">Impossible de charger les avis. Réessayez ultérieurement.</div>';
        }
      });
  }

  function applyFilter(ratingVal) {
    activeRatingFilter = ratingVal;
    var filterBtns = document.querySelectorAll ? document.querySelectorAll('.krv-filter-btn') : [];
    for (var i = 0; i < filterBtns.length; i++) {
      var btn = filterBtns[i];
      var isMatch = btn.getAttribute('data-filter-rating') === ratingVal;
      if (btn.classList) btn.classList.toggle('active', isMatch);
      if (btn.setAttribute) btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    }
    var distRows = document.querySelectorAll ? document.querySelectorAll('.krv-dist-row') : [];
    for (var j = 0; j < distRows.length; j++) {
      var row = distRows[j];
      if (row.classList) row.classList.toggle('is-active', row.getAttribute('data-rating') === ratingVal);
    }
    loadReviews(1, false);
  }

  if (btnLoadMore && typeof btnLoadMore.addEventListener === 'function') {
    btnLoadMore.addEventListener('click', function() {
      if (currentPage < totalPages) {
        loadReviews(currentPage + 1, true);
      }
    });
  }

  if (btnSpotPrev && typeof btnSpotPrev.addEventListener === 'function') {
    btnSpotPrev.addEventListener('click', function() {
      renderSpotlight(spotlightIndex - 1);
    });
  }

  if (btnSpotNext && typeof btnSpotNext.addEventListener === 'function') {
    btnSpotNext.addEventListener('click', function() {
      renderSpotlight(spotlightIndex + 1);
    });
  }

  if (typeof cardsListEl.addEventListener === 'function') {
    cardsListEl.addEventListener('click', function(e) {
      var target = e.target;
      if (!target || typeof target.closest !== 'function') return;
      var spotBtn = target.closest('[data-spot-idx]');
      if (spotBtn) {
        var idx = parseInt(spotBtn.getAttribute('data-spot-idx') || '0', 10);
        renderSpotlight(idx);
        if (spotlightEl && typeof spotlightEl.scrollIntoView === 'function') {
          spotlightEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }

  var filterNodeList = document.querySelectorAll ? document.querySelectorAll('.krv-filter-btn') : [];
  for (var f = 0; f < filterNodeList.length; f++) {
    (function(btn) {
      if (typeof btn.addEventListener === 'function') {
        btn.addEventListener('click', function() {
          applyFilter(btn.getAttribute('data-filter-rating') || 'all');
        });
      }
    })(filterNodeList[f]);
  }

  var distNodeList = document.querySelectorAll ? document.querySelectorAll('.krv-dist-row') : [];
  for (var d = 0; d < distNodeList.length; d++) {
    (function(row) {
      if (typeof row.addEventListener === 'function') {
        row.addEventListener('click', function() {
          var r = row.getAttribute('data-rating') || 'all';
          if (r === '4' || r === '5') {
            applyFilter(activeRatingFilter === r ? 'all' : r);
          } else {
            applyFilter('all');
          }
        });
      }
    })(distNodeList[d]);
  }

  loadStats();
  loadReviews(1, false);
})();
`;

/**
 * Script léger autonome pour les pages utilisant le header unifié
 * (synchronisation du thème Clair/Sombre, tiroir mobile et module Avis Communauté).
 * Sur la landing page et /feedback, les scripts dédiés incluent PUBLIC_REVIEWS_SCRIPT.
 */
export const PUBLIC_HEADER_INTERACTION_SCRIPT = `
  <script>
  (function() {
    var themeToggle = document.getElementById('theme-toggle');
    var iconSun = document.getElementById('theme-icon-sun');
    var iconMoon = document.getElementById('theme-icon-moon');

    function syncThemeIcons(theme) {
      if (iconSun && iconMoon) {
        iconSun.style.display = (theme === 'dark') ? 'none' : 'block';
        iconMoon.style.display = (theme === 'dark') ? 'block' : 'none';
      }
    }

    var currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    syncThemeIcons(currentTheme);

    if (themeToggle) {
      themeToggle.addEventListener('click', function() {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try {
          localStorage.setItem('kanto_theme', next);
        } catch (e) {}
        syncThemeIcons(next);
        var metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) metaTheme.setAttribute('content', next === 'light' ? '#F5F4F0' : '#0D0D0B');
      });
    }

    var mobileBtn = document.getElementById('mobile-menu-toggle');
    var mobileDrawer = document.getElementById('mobile-nav-drawer');
    if (mobileBtn && mobileDrawer) {
      mobileBtn.addEventListener('click', function() {
        var isOpen = mobileDrawer.classList.toggle('open');
        mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }
  })();

  ${PUBLIC_REVIEWS_SCRIPT}
  </script>
`;
