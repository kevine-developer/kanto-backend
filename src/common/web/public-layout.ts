/**
 * Kanto MG — Design System Éditorial & Socle Web Public Unifié
 * Direction artistique : L'édition culturelle contemporaine + abstraction géométrique malgache (Zafimaniry / Lamba)
 *
 * Source unique de vérité pour :
 * - Les tokens chromatiques Light (Papier minéral #F5F4F0) / Dark (Ébène mat #0D0D0B)
 * - La signature chromatique Tany Mena (#A62C21 / #D64F42) & accompagnement Vert végétal sourd (#3D5A38 / #6D9666)
 * - La typographie bilingue FR/MG : Newsreader (Display/Éditorial) + Plus Jakarta Sans (Interface/Lecture)
 * - L'en-tête, le pied de page, la section Voix de la communauté (#avis) et les utilitaires d'accessibilité
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

/**
 * Ornement géométrique sobre inspiré de l'art sculptural Zafimaniry / tissage Lamba.
 * Utilisé avec retenue comme séparateur éditorial ou repère de section.
 */
export const KANTO_ZAFIMANIRY_DIVIDER = `
  <div class="kanto-ornament-rule" aria-hidden="true">
    <span class="kanto-ornament-line"></span>
    <svg class="kanto-ornament-mark" width="28" height="14" viewBox="0 0 28 14" fill="none" stroke="currentColor" stroke-width="1.2">
      <polygon points="7,7 14,1 21,7 14,13"></polygon>
      <polygon points="11,7 14,4 17,7 14,10"></polygon>
      <line x1="0" y1="7" x2="7" y2="7"></line>
      <line x1="21" y1="7" x2="28" y2="7"></line>
    </svg>
    <span class="kanto-ornament-line"></span>
  </div>
`;

export const PUBLIC_SHELL_CSS = `
  /* ─── TOKENS DU DESIGN SYSTEM ÉDITORIAL KANTO MG ──────────────────────────── */
  :root, [data-theme="light"] {
    /* Surfaces minérales */
    --color-bg: #F5F4F0;
    --color-bg-alt: #ECE9E1;
    --color-surface: #FAF9F6;
    --color-surface-elevated: #FDFCF9;
    --color-surface-hover: #F0EDE5;

    /* Filets & Bordures franches */
    --color-border: #D9D5CC;
    --color-border-subtle: #E6E2DA;
    --color-border-strong: #B8B3A8;
    --color-divider: #D4CFC4;

    /* Encre & Hiérarchie typographique (WCAG AAA sur corps) */
    --color-ink: #181715;
    --color-ink-muted: #4E4C46;
    --color-ink-subtle: #6E6B63;
    --color-heading: #11100E;

    /* Couleur signature : Rouge terre malgache (Tany Mena) */
    --color-accent: #A62C21;
    --color-accent-hover: #872219;
    --color-accent-soft: #F7EAE8;
    --color-accent-border: #DEC0BC;

    /* Accompagnement : Vert végétal sourd (validation & patrimoine naturel) */
    --color-sage: #3D5A38;
    --color-sage-dark: #2C4328;
    --color-sage-soft: #EBF0EA;
    --color-sage-border: #C4D0C1;

    /* Rétrocompatibilité sémantique vers Tany Mena / Sage / Ocre */
    --color-tanimbary: var(--color-sage);
    --color-tanimbary-dark: var(--color-sage-dark);
    --color-tanimbary-soft: var(--color-sage-soft);
    --color-tanimbary-border: var(--color-sage-border);
    --color-terracotta: var(--color-accent);
    --color-terracotta-soft: var(--color-accent-soft);
    --color-ochre: #9C6B21;
    --color-ochre-soft: #F7F0E4;
    --color-ochre-border: #E0CEAF;

    /* États fonctionnels distincts */
    --color-error: #A62C21;
    --color-error-bg: #F9EAE8;
    --color-error-text: #821F16;
    --color-success: #3D5A38;
    --color-success-bg: #EBF0EA;
    --color-success-text: #273D24;
    --color-warning: #9C6B21;
    --color-warning-bg: #F7F0E4;

    /* Plateformes */
    --color-android: #2D5A3C;
    --color-android-soft: #EBF0EA;
    --color-android-border: #C4D0C1;
    --color-ios: #181715;
    --color-ios-soft: #ECE9E1;
    --color-ios-border: #D4CFC4;

    /* Aplats francs, zéro ombre diffuse */
    --color-card-shadow: none;
    --color-card-shadow-hover: none;

    /* Rayons contenus stricts (0px à 4px max) */
    --radius-none: 0px;
    --radius-xs: 2px;
    --radius-sm: 2px;
    --radius-md: 3px;
    --radius-lg: 4px;
    --radius-full: 2px;

    /* Échelle & Familles typographiques */
    --font-serif: 'Newsreader', Georgia, 'Times New Roman', serif;
    --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

    /* Espacements & Transitions */
    --ease-editorial: cubic-bezier(0.22, 1, 0.36, 1);
    --transition-fast: 160ms ease-out;
    --transition-base: 220ms ease-out;
  }

  [data-theme="dark"] {
    /* Surfaces ébène mat sans noir pur agressif */
    --color-bg: #0D0D0B;
    --color-bg-alt: #141411;
    --color-surface: #161613;
    --color-surface-elevated: #1C1C18;
    --color-surface-hover: #21201C;

    --color-border: #2D2C26;
    --color-border-subtle: #22211C;
    --color-border-strong: #46443B;
    --color-divider: #2A2923;

    --color-ink: #ECEAE3;
    --color-ink-muted: #B2AFA6;
    --color-ink-subtle: #88857C;
    --color-heading: #F5F3EC;

    --color-accent: #D64F42;
    --color-accent-hover: #E36B5F;
    --color-accent-soft: #2A1614;
    --color-accent-border: #5C2B26;

    --color-sage: #6D9666;
    --color-sage-dark: #85AD7E;
    --color-sage-soft: #182217;
    --color-sage-border: #2F422C;

    --color-tanimbary: var(--color-sage);
    --color-tanimbary-dark: var(--color-sage-dark);
    --color-tanimbary-soft: var(--color-sage-soft);
    --color-tanimbary-border: var(--color-sage-border);
    --color-terracotta: var(--color-accent);
    --color-terracotta-soft: var(--color-accent-soft);
    --color-ochre: #D69E4E;
    --color-ochre-soft: #241C11;
    --color-ochre-border: #4A381F;

    --color-error: #E36B5F;
    --color-error-bg: #2B1715;
    --color-error-text: #F7B6AF;
    --color-success: #79A672;
    --color-success-bg: #192418;
    --color-success-text: #C3DFBF;
    --color-warning: #D69E4E;
    --color-warning-bg: #241C11;

    --color-android: #6D9666;
    --color-android-soft: #182217;
    --color-android-border: #2F422C;
    --color-ios: #ECEAE3;
    --color-ios-soft: #21201C;
    --color-ios-border: #38362F;

    --color-card-shadow: none;
    --color-card-shadow-hover: none;
  }

  /* Focus accessible net sur l'ensemble du portail */
  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  /* Lien d'évitement clavier */
  .skip-to-content {
    position: absolute;
    left: -9999px;
    top: 8px;
    z-index: 1500;
    background: var(--color-accent);
    color: #FAF9F6;
    padding: 10px 16px;
    font-size: 0.85rem;
    font-weight: 600;
    border-radius: var(--radius-xs);
    text-decoration: none;
  }

  .skip-to-content:focus {
    left: 16px;
  }

  /* Ornement géométrique Zafimaniry */
  .kanto-ornament-rule {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    color: var(--color-accent);
    margin: 4px 0;
  }

  .kanto-ornament-line {
    flex: 1;
    height: 1px;
    background: var(--color-border);
  }

  .kanto-ornament-mark {
    flex-shrink: 0;
    display: block;
  }

  /* ─── EN-TÊTE ÉDITORIAL UNIFIÉ KANTO MG ─────────────────────────────────── */
  .site-header {
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    transition: background-color var(--transition-base), border-color var(--transition-base);
  }

  .site-header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  @media (min-width: 768px) {
    .site-header-inner {
      padding: 13px 32px;
      gap: 20px;
    }
  }

  body.hide-header .site-header,
  body.hide-header .mobile-nav-drawer,
  body.hide-header .skip-to-content {
    display: none !important;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
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
    border-radius: var(--radius-xs);
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
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1.08;
    color: var(--color-heading);
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  @media (min-width: 480px) {
    .brand-name {
      font-size: 1.32rem;
    }
  }

  .brand-domain {
    color: var(--color-accent);
    font-weight: 500;
  }

  .brand-tag {
    display: none;
    font-size: 0.64rem;
    color: var(--color-ink-subtle);
    letter-spacing: 0.11em;
    text-transform: uppercase;
    font-weight: 600;
    white-space: nowrap;
    margin-top: 2px;
  }

  @media (min-width: 420px) {
    .brand-tag {
      display: block;
    }
  }

  .header-nav {
    display: none;
    align-items: center;
    gap: 24px;
  }

  @media (min-width: 960px) {
    .header-nav {
      display: flex;
    }
  }

  .header-nav-link {
    text-decoration: none;
    color: var(--color-ink-muted);
    font-size: 0.88rem;
    font-weight: 500;
    padding: 8px 2px;
    position: relative;
    transition: color var(--transition-fast);
    white-space: nowrap;
  }

  .header-nav-link:hover {
    color: var(--color-heading);
  }

  .header-nav-link.active {
    color: var(--color-accent);
    font-weight: 600;
  }

  .header-nav-link.active::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background: var(--color-accent);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .theme-toggle-btn,
  .mobile-menu-btn {
    width: 44px;
    height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xs);
    color: var(--color-ink);
    cursor: pointer;
    transition: background-color var(--transition-fast), border-color var(--transition-fast);
  }

  .theme-toggle-btn:hover,
  .mobile-menu-btn:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-border-strong);
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
    padding: 8px 14px;
    font-size: 0.84rem;
    font-weight: 600;
    color: #FAF9F6;
    background: var(--color-accent);
    border: 1px solid var(--color-accent);
    border-radius: var(--radius-xs);
    transition: background-color var(--transition-fast), border-color var(--transition-fast);
    white-space: nowrap;
  }

  @media (min-width: 480px) {
    .header-cta-btn {
      padding: 9px 18px;
      font-size: 0.875rem;
    }
  }

  .header-cta-btn:hover {
    background: var(--color-accent-hover);
    border-color: var(--color-accent-hover);
  }

  /* Menu tiroir mobile ergonomique pour le pouce */
  .mobile-nav-drawer {
    display: none;
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    padding: 16px;
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

  @media (min-width: 460px) {
    .mobile-nav-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .mobile-nav-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 44px;
    padding: 10px 14px;
    border-radius: var(--radius-xs);
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    color: var(--color-ink);
    font-size: 0.88rem;
    font-weight: 500;
    text-decoration: none;
    transition: border-color var(--transition-fast), color var(--transition-fast), background-color var(--transition-fast);
  }

  .mobile-nav-link.active,
  .mobile-nav-link:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    background: var(--color-surface);
  }

  /* ─── PIED DE PAGE ÉDITORIAL UNIFIÉ KANTO MG ─────────────────────────────── */
  .site-footer {
    width: 100%;
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    padding: 48px 16px 32px;
    display: flex;
    justify-content: center;
    margin-top: auto;
  }

  @media (min-width: 768px) {
    .site-footer {
      padding: 64px 32px 36px;
    }
  }

  .footer-container {
    width: 100%;
    max-width: 1200px;
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
      grid-template-columns: 1.6fr 1fr 1fr;
      gap: 48px;
    }
  }

  .footer-brand-col {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .footer-brand-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .footer-brand-name {
    font-family: var(--font-serif);
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-heading);
    letter-spacing: -0.015em;
  }

  .footer-brand-desc {
    font-size: 0.9rem;
    color: var(--color-ink-muted);
    line-height: 1.62;
    max-width: 38ch;
  }

  .footer-quote-mg {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 0.94rem;
    line-height: 1.5;
    color: var(--color-heading);
    border-left: 2px solid var(--color-accent);
    padding-left: 12px;
    margin-top: 4px;
    max-width: 40ch;
  }

  .footer-links-col {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .footer-heading {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-ink-subtle);
    margin-bottom: 6px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--color-border-subtle);
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
    transition: color var(--transition-fast);
  }

  @media (min-width: 768px) {
    .footer-links-col a,
    .btn-text-link {
      padding: 2px 0;
      min-height: auto;
    }
  }

  .footer-links-col a:hover,
  .btn-text-link:hover {
    color: var(--color-accent);
  }

  .footer-bottom-line {
    padding-top: 22px;
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

  /* ─── SECTION ÉDITORIALE : VOIX DE LA COMMUNAUTÉ (FEON'NY FIKAMBANANA) ─── */
  body.hide-header .kanto-reviews-section {
    display: none !important;
  }

  .kanto-reviews-section {
    width: 100%;
    padding: 56px 16px 64px;
    background: var(--color-bg-alt);
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: center;
  }

  @media (min-width: 768px) {
    .kanto-reviews-section {
      padding: 76px 32px 84px;
    }
  }

  .kanto-reviews-section.is-compact {
    padding: 48px 16px 56px;
  }

  @media (min-width: 768px) {
    .kanto-reviews-section.is-compact {
      padding: 60px 32px 68px;
    }
  }

  .krv-container {
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .krv-header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--color-border);
  }

  @media (min-width: 860px) {
    .krv-header {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      gap: 32px;
    }
  }

  .krv-header-copy {
    max-width: 62ch;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .krv-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-accent);
  }

  .krv-eyebrow::before {
    content: '';
    width: 20px;
    height: 1px;
    background: var(--color-accent);
  }

  .krv-title {
    font-family: var(--font-serif);
    font-size: clamp(1.7rem, 4vw, 2.3rem);
    font-weight: 600;
    line-height: 1.16;
    color: var(--color-heading);
    letter-spacing: -0.025em;
    margin: 0;
  }

  .krv-subtitle {
    font-size: 0.94rem;
    line-height: 1.62;
    color: var(--color-ink-muted);
    margin: 0;
  }

  .krv-context-tag {
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-ink-subtle);
    flex-shrink: 0;
  }

  /* Panneau de synthèse éditorial (note réelle + histogramme conditionnel) */
  .krv-barometer {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-top: 2px solid var(--color-accent);
    border-radius: var(--radius-xs);
    padding: 20px 18px;
  }

  @media (min-width: 820px) {
    .krv-barometer {
      grid-template-columns: 0.9fr 1.5fr;
      gap: 32px;
      padding: 24px 28px;
      align-items: center;
    }
  }

  .krv-score-panel {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px 20px;
  }

  @media (min-width: 820px) {
    .krv-score-panel.has-dist {
      padding-right: 28px;
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
    font-size: clamp(2.25rem, 6vw, 3rem);
    font-weight: 600;
    line-height: 0.95;
    color: var(--color-heading);
    letter-spacing: -0.03em;
  }

  .krv-score-scale {
    font-family: var(--font-serif);
    font-size: 1.1rem;
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
    color: var(--color-accent);
  }

  .star-icon-filled {
    fill: var(--color-accent);
    color: var(--color-accent);
  }

  .star-icon-empty {
    fill: transparent;
    color: var(--color-border-strong);
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
    font-size: 0.78rem;
    color: var(--color-sage);
    font-weight: 500;
  }

  .krv-dist-panel {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .krv-dist-bars {
    display: grid;
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .krv-dist-row {
    display: grid;
    grid-template-columns: 42px 1fr 40px;
    align-items: center;
    gap: 10px;
    min-height: 36px;
    background: transparent;
    border: 1px solid transparent;
    padding: 4px 8px;
    border-radius: var(--radius-xs);
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    transition: background-color var(--transition-fast), border-color var(--transition-fast);
  }

  @media (min-width: 768px) {
    .krv-dist-row {
      min-height: 28px;
      padding: 2px 8px;
    }
  }

  .krv-dist-row:hover {
    background: var(--color-surface-hover);
  }

  .krv-dist-row.is-active {
    background: var(--color-accent-soft);
    border-color: var(--color-accent-border);
  }

  .krv-dist-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--color-ink-muted);
  }

  .krv-dist-track {
    height: 6px;
    background: var(--color-bg-alt);
    border: 1px solid var(--color-border-subtle);
    overflow: hidden;
  }

  .krv-dist-fill {
    height: 100%;
    width: 0%;
    background: var(--color-accent);
    transition: width 0.45s var(--ease-editorial);
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
  }

  .krv-filter-pills {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .krv-filter-btn {
    min-height: 40px;
    padding: 6px 14px;
    border-radius: var(--radius-xs);
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    color: var(--color-ink-muted);
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: border-color var(--transition-fast), color var(--transition-fast), background-color var(--transition-fast);
  }

  @media (min-width: 768px) {
    .krv-filter-btn {
      min-height: 36px;
    }
  }

  .krv-filter-btn:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .krv-filter-btn.active {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: #FAF9F6;
  }

  /* Citation vedette éditoriale (Tsiahy Misongadina) */
  .krv-spotlight {
    position: relative;
    overflow: hidden;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-left: 3px solid var(--color-accent);
    border-radius: var(--radius-xs);
    padding: 22px 18px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  @media (min-width: 768px) {
    .krv-spotlight {
      padding: 28px 34px;
      gap: 18px;
    }
  }

  .krv-spotlight-motif {
    position: absolute;
    right: -12px;
    top: -12px;
    width: 140px;
    height: 140px;
    color: var(--color-accent);
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
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.11em;
    color: var(--color-accent);
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
    border-radius: var(--radius-xs);
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    color: var(--color-ink);
    cursor: pointer;
    transition: border-color var(--transition-fast), color var(--transition-fast), background-color var(--transition-fast);
  }

  .krv-nav-btn:hover:not(:disabled) {
    border-color: var(--color-accent);
    color: var(--color-accent);
    background: var(--color-surface-hover);
  }

  .krv-nav-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .krv-spotlight-quote-wrap {
    position: relative;
    z-index: 1;
    transition: opacity 0.2s ease-out;
  }

  .krv-spotlight-quote-wrap.is-switching {
    opacity: 0;
  }

  .krv-spotlight-quote {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: clamp(1.15rem, 3.2vw, 1.48rem);
    line-height: 1.54;
    color: var(--color-heading);
    overflow-wrap: anywhere;
    margin: 0;
    max-width: 68ch;
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

  /* Grille / Carrousel tactile des témoignages */
  .krv-cards-viewport {
    position: relative;
    width: 100%;
  }

  .krv-cards-grid {
    display: flex;
    gap: 14px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding: 2px 2px 12px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: var(--color-border) transparent;
  }

  @media (min-width: 900px) {
    .krv-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
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
    border-radius: var(--radius-xs);
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 16px;
    transition: border-color var(--transition-fast), background-color var(--transition-fast);
  }

  @media (min-width: 600px) and (max-width: 899px) {
    .review-card-item {
      flex: 0 0 47%;
    }
  }

  @media (min-width: 900px) {
    .review-card-item {
      flex: initial;
    }
  }

  .review-card-item:hover {
    border-color: var(--color-border-strong);
  }

  .review-card-item.is-spotlight {
    border-color: var(--color-accent);
    background: var(--color-surface-elevated);
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

  .review-card-tag {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--color-sage);
    letter-spacing: 0.04em;
    text-transform: uppercase;
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
    width: 34px;
    height: 34px;
    border-radius: var(--radius-xs);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-serif);
    font-size: 0.88rem;
    font-weight: 700;
    flex-shrink: 0;
    background: var(--color-bg-alt);
    color: var(--color-heading);
    border: 1px solid var(--color-border);
  }

  .review-avatar-circle.tone-accent {
    background: var(--color-accent-soft);
    color: var(--color-accent);
    border-color: var(--color-accent-border);
  }

  .review-avatar-circle.tone-sage {
    background: var(--color-sage-soft);
    color: var(--color-sage);
    border-color: var(--color-sage-border);
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
    padding: 2px 7px;
    border-radius: var(--radius-xs);
  }

  .krv-card-spot-btn {
    min-width: 40px;
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-xs);
    border: 1px solid var(--color-border);
    background: transparent;
    color: var(--color-ink-muted);
    cursor: pointer;
    transition: border-color var(--transition-fast), color var(--transition-fast);
  }

  .krv-card-spot-btn:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .krv-skeleton-card {
    flex: 0 0 84%;
    min-width: 240px;
    height: 170px;
    border-radius: var(--radius-xs);
    border: 1px solid var(--color-border);
    background: var(--color-surface);
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

  .reviews-empty-state {
    grid-column: 1 / -1;
    width: 100%;
    padding: 28px 20px;
    text-align: left;
    border: 1px solid var(--color-border);
    border-left: 3px solid var(--color-border-strong);
    border-radius: var(--radius-xs);
    background: var(--color-surface);
    color: var(--color-ink-muted);
    font-size: 0.94rem;
    line-height: 1.6;
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
    border-radius: var(--radius-xs);
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-ink);
    font-family: inherit;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    transition: border-color var(--transition-fast), color var(--transition-fast), background-color var(--transition-fast);
  }

  .krv-btn-load-more:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    background: var(--color-surface-hover);
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
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
    { href: inscriptionHref, label: 'Programme Bêta', key: '/' },
    { href: downloadHref, label: 'Téléchargement', key: '/download' },
    { href: '/pages/about', label: 'À propos', key: '/pages/about' },
    { href: '/pages/help', label: 'Aide', key: '/pages/help' },
    { href: '/pages/terms', label: 'CGU', key: '/pages/terms' },
  ];

  const desktopNavHtml = navLinks
    .map(
      (link) =>
        `<a href="${link.href}" class="header-nav-link${active === link.key ? ' active' : ''}">${link.label}</a>`,
    )
    .join('\n        ');

  const mobileNavLinks = [
    { href: '/', label: 'Programme Bêta', key: '/' },
    { href: '/pages/about', label: 'À propos', key: '/pages/about' },
    { href: '/pages/help', label: 'Aide & FAQ', key: '/pages/help' },
    { href: '/pages/terms', label: 'Conditions (CGU)', key: '/pages/terms' },
    { href: '/pages/privacy', label: 'Confidentialité', key: '/pages/privacy' },
    { href: '/feedback', label: 'Signaler un bug', key: '/feedback' },
  ];

  const mobileNavHtml = mobileNavLinks
    .map(
      (link) =>
        `<a href="${link.href}" class="mobile-nav-link${active === link.key ? ' active' : ''}"><span>${link.label}</span><span aria-hidden="true">→</span></a>`,
    )
    .join('\n          ');

  return `
  <a href="#main-content" class="skip-to-content">Aller au contenu principal</a>
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

        <button type="button" class="mobile-menu-btn" id="mobile-menu-toggle" aria-label="Ouvrir le menu de navigation" aria-expanded="false" aria-controls="mobile-nav-drawer">
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
    options?.supportEmail || process.env.SUPPORT_EMAIL || 'contact@kanto.mg';
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
            <img src="/logo.png" alt="Kanto MG" width="28" height="28" style="border-radius:2px; border:1px solid var(--color-border);" onerror="this.onerror=null; this.src='/favicon.png';" />
            <span class="footer-brand-name">kanto.mg</span>
          </div>
          <p class="footer-brand-desc">
            Sanctuaire numérique dédié à la valorisation, à la transmission et au rayonnement de la langue et du patrimoine culturel malgaches.
          </p>
          <blockquote class="footer-quote-mg">« Ny hazo no vanon-ko lakana, ny tany naniriany no tsara. »</blockquote>
        </div>

        <div class="footer-links-col">
          <span class="footer-heading">Programme &amp; Portail</span>
          <a href="${inscriptionHref}">1. Inscription iOS (TestFlight)</a>
          <a href="https://groups.google.com/g/communaute-kanto" target="_blank" rel="noopener noreferrer">2. Bêta Android (Google Groups)</a>
          <a href="${downloadHref}">3. Téléchargement direct</a>
          <a href="#avis">Voix de la communauté</a>
          <a href="/pages/about">À propos de Kanto</a>
          <a href="/pages/help">Centre d'aide &amp; FAQ</a>
        </div>

        <div class="footer-links-col">
          <span class="footer-heading">Juridique &amp; Support</span>
          <a href="${cguHref}" id="footer-link-cgu">Conditions Générales (CGU)</a>
          <a href="${privacyHref}" id="footer-link-privacy">Confidentialité &amp; RGPD</a>
          <a href="${licensesHref}">Mentions légales &amp; Licences</a>
          <a href="/feedback">Signaler une anomalie</a>
          <button type="button" class="btn-text-link" id="${cookieButtonId}">Cookies &amp; Préférences</button>
          <a href="mailto:${escapePublicHtml(supportEmail)}">Support : ${escapePublicHtml(supportEmail)}</a>
        </div>
      </div>

      <div class="footer-bottom-line">
        <span>© ${year} Kanto MG • Lova sy Kolontsaina Malagasy. Tous droits réservés.</span>
        <span>Portail Bêta Officiel • app-kanto.gastsar.fr</span>
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
  /** Étiquette contextuelle affichée en en-tête */
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
            <span class="krv-dist-pct" id="krv-pct-${star}"></span>
          </button>`,
    )
    .join('');

  return `
  <section class="kanto-reviews-section${isCompact ? ' is-compact' : ''}" id="avis" aria-labelledby="krv-section-title" data-reviews-limit="${limit}">
    <div class="krv-container">
      <div class="krv-header">
        <div class="krv-header-copy">
          <span class="krv-eyebrow">Feon'ny Fikambanana • Voix de la communauté</span>
          <h2 id="krv-section-title" class="krv-title">Ce que la communauté retient de Kanto</h2>
          <p class="krv-subtitle">
            Retours d'expérience recueillis dans l'application, modérés et publiés uniquement avec le consentement explicite de leurs auteurs.
          </p>
        </div>
        <span class="krv-context-tag">${contextLabel}</span>
      </div>

      <!-- Baromètre de confiance (masque l'histogramme s'il n'y a aucun avis publié) -->
      <div class="krv-barometer">
        <div class="krv-score-panel" id="krv-score-panel">
          <div class="krv-score-number-wrap">
            <span class="krv-score-value" id="reviews-avg-rating">—</span>
            <span class="krv-score-scale">/ 5</span>
          </div>
          <div class="krv-score-details">
            <div class="krv-stars-row" id="reviews-avg-stars" aria-label="Note moyenne"></div>
            <span class="krv-total-count" id="reviews-total-count">Évaluations de la communauté</span>
            <span class="krv-trust-note">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
              <span>Avis modérés et consentis</span>
            </span>
          </div>
        </div>

        <div class="krv-dist-panel" id="krv-dist-panel" style="display: none;">
          <div class="krv-dist-bars" id="krv-distribution-bars">
            ${distRows}
          </div>
          <div class="krv-filter-bar">
            <div class="krv-filter-pills" role="group" aria-label="Filtrer les avis par note">
              <button type="button" class="krv-filter-btn active" data-filter-rating="all" aria-pressed="true">Tous (4★+)</button>
              <button type="button" class="krv-filter-btn" data-filter-rating="5" aria-pressed="false">5 étoiles</button>
              <button type="button" class="krv-filter-btn" data-filter-rating="4" aria-pressed="false">4 étoiles</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Citation vedette éditoriale (Tsiahy Misongadina) -->
      <article class="krv-spotlight" id="krv-spotlight" style="display: none;" aria-live="polite">
        <svg class="krv-spotlight-motif" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
          <polygon points="60,8 112,60 60,112 8,60"></polygon>
          <polygon points="60,26 94,60 60,94 26,60"></polygon>
          <line x1="60" y1="0" x2="60" y2="120"></line>
          <line x1="0" y1="60" x2="120" y2="60"></line>
        </svg>

        <div class="krv-spotlight-top">
          <span class="krv-spotlight-badge">Tsiahy Misongadina • Parole à la une</span>
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

      <!-- Grille / Carrousel tactile des avis -->
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
          <span>Afficher davantage de témoignages</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
      </div>
    </div>
  </section>
  `;
}

/**
 * Helper d'accessibilité partagé pour les modales (focus trap + fermeture Échap + restauration focus).
 */
export const PUBLIC_MODAL_A11Y_SCRIPT = `
(function initModalA11yHelper() {
  if (typeof window === 'undefined' || window.__kantoModalHelper) return;
  var lastTrigger = null;

  function getFocusable(container) {
    if (!container || typeof container.querySelectorAll !== 'function') return [];
    return Array.prototype.slice.call(
      container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter(function(el) {
      return el && el.offsetParent !== null;
    });
  }

  window.__kantoModalHelper = {
    open: function(modalEl, triggerEl) {
      if (!modalEl) return;
      lastTrigger = triggerEl || document.activeElement || null;
      modalEl.style.display = 'flex';
      if (document.body && document.body.style) document.body.style.overflow = 'hidden';
      var focusables = getFocusable(modalEl);
      if (focusables.length > 0 && typeof focusables[0].focus === 'function') {
        setTimeout(function() { focusables[0].focus(); }, 30);
      }
    },
    close: function(modalEl) {
      if (!modalEl) return;
      modalEl.style.display = 'none';
      if (document.body && document.body.style) document.body.style.overflow = '';
      if (lastTrigger && typeof lastTrigger.focus === 'function') {
        try { lastTrigger.focus(); } catch (e) {}
      }
      lastTrigger = null;
    },
    trapTab: function(modalEl, e) {
      if (!modalEl || modalEl.style.display === 'none' || e.key !== 'Tab') return;
      var focusables = getFocusable(modalEl);
      if (focusables.length === 0) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
})();
`;

/**
 * Script autonome du module Voix de la Communauté.
 * Corrige l'affichage en absence d'avis (masque les barres à 0%) et
 * reste 100% compatible avec les environnements DOM minimaux de test.
 */
export const PUBLIC_REVIEWS_SCRIPT = `
(function initCommunityReviews() {
  if (typeof window !== 'undefined' && window.__kantoReviewsInitialized) return;
  if (typeof window !== 'undefined') window.__kantoReviewsInitialized = true;

  var sectionEl = document.getElementById('avis');
  var scorePanelEl = document.getElementById('krv-score-panel');
  var distPanelEl = document.getElementById('krv-dist-panel');
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
    var tones = ['', ' tone-accent', ' tone-sage'];
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
      setTimeout(applyContent, 120);
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

        if (total <= 0) {
          if (avgScoreEl) avgScoreEl.textContent = '—';
          if (avgStarsEl) avgStarsEl.innerHTML = '';
          if (totalCountEl) totalCountEl.textContent = 'En attente des premiers avis publiés';
          if (distPanelEl) distPanelEl.style.display = 'none';
          if (scorePanelEl && scorePanelEl.classList) scorePanelEl.classList.remove('has-dist');
          return;
        }

        if (avgScoreEl) {
          avgScoreEl.textContent = stats.averageRating.toFixed(1).replace('.', ',');
        }
        if (avgStarsEl) {
          avgStarsEl.innerHTML = renderStarsRow(stats.averageRating, 15);
        }
        if (totalCountEl) {
          totalCountEl.textContent = total + ' avis certifié' + (total > 1 ? 's' : '');
        }
        if (distPanelEl) distPanelEl.style.display = 'flex';
        if (scorePanelEl && scorePanelEl.classList) scorePanelEl.classList.add('has-dist');

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
        if (distPanelEl) distPanelEl.style.display = 'none';
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
              'Mbola tsy misy hevitra naseho ho an\\u2019ity sivana ity. Les retours approuvés des testeurs apparaîtront ici.' +
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
              '<span class="review-card-tag">' + item.rating + '/5</span>' +
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
                '<button type="button" class="krv-card-spot-btn" data-spot-idx="' + itemIdx + '" aria-label="Lire ce témoignage en grand format">' +
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
 * Script autonome partagé pour les pages secondaires utilisant le header unifié
 * (bascule Clair/Sombre, tiroir mobile accessible, modales et module Voix de la communauté).
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
    function closeMobileDrawer() {
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
      }
    }
    if (mobileBtn && mobileDrawer) {
      mobileBtn.addEventListener('click', function() {
        var isOpen = mobileDrawer.classList.toggle('open');
        mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
      mobileDrawer.addEventListener('click', function(e) {
        if (e.target && typeof e.target.closest === 'function' && e.target.closest('a')) {
          closeMobileDrawer();
        }
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeMobileDrawer();
      });
    }
  })();

  ${PUBLIC_MODAL_A11Y_SCRIPT}
  ${PUBLIC_REVIEWS_SCRIPT}
  </script>
`;
