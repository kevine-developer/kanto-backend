/**
 * Kanto MG — Système de Design Éditorial Haut de Gamme
 * « La culture malgache, autrement »
 *
 * Palette chromatique :
 * - Surfaces : Ivoire lin & Parchemin chaud (#F8F6F0 / #0C0C0A)
 * - Textes : Noir Encre de Chine (#141311 / #F4F3EE)
 * - Accent identitaire : Terre Cuite / Tany Mena (#B93826 / #E65A48)
 * - Accents secondaires : Vert Tanimbary (#2B4426 / #7AA870) & Ocre Ambre (#C48833 / #E0A24A)
 * - Typographies : Newsreader (titrage & citations) + Plus Jakarta Sans (interface)
 */

export const BETA_LANDING_CSS = `
  @font-face {
    font-family: 'LazyDog';
    src: url('/fonts/LazyDog.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  /* ─── TOKENS DU DESIGN SYSTEM KANTO ────────────────────────────────────────── */
    :root, [data-theme="light"] {
    --color-bg: #F5F4F0;
    --color-bg-alt: #EFECE6;
    --color-surface: #FEFEFC;
    --color-surface-elevated: #FEFEFC;
    --color-surface-input: #FFFFFF;
    --color-surface-hover: #F0EDE8;
    --color-border: #E5E2DB;
    --color-border-subtle: #E4E8DF;
    --color-divider: #DCE1D7;
    --color-ink: #1A1A1A;
    --color-ink-muted: #5C5C5C;
    --color-ink-subtle: #8A8A8A;
    --color-heading: #1A1A1A;
    --color-brand-title: #1A1A1A;
    --color-terracotta: #C0392B;
    --color-terracotta-hover: #9E2A28;
    --color-terracotta-soft: #FDF2F0;
    --color-terracotta-border: #F0CECA;
    --color-tanimbary: #4A6741;
    --color-tanimbary-dark: #374E30;
    --color-tanimbary-soft: #E5ECE2;
    --color-tanimbary-border: #CBD8C6;
    --color-ochre: #C58B38;
    --color-ochre-soft: #FDF6EB;
    --color-ochre-border: #F3DEC0;
    --color-card-shadow: 0 4px 20px rgba(26, 26, 26, 0.05);
    --color-card-shadow-hover: 0 12px 36px rgba(26, 26, 26, 0.08);
    --color-tab-active-bg: #4A6741;
    --color-tab-active-text: #FFFFFF;
    --color-error: #B84040;
    --color-error-bg: #FDF0F0;
    --color-error-text: #B84040;
    --color-success: #4A6741;
    --color-success-bg: #EFF7ED;
    --color-success-text: #4A6741;
    --color-android: #2D9B5E;
    --color-ios: #0071E3;
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 16px;
    --font-serif: 'Newsreader', Georgia, 'Times New Roman', serif;
    --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

    [data-theme="dark"] {
    --color-bg: #0D0D0B;
    --color-bg-alt: #131311;
    --color-surface: #141412;
    --color-surface-elevated: #1A1A18;
    --color-surface-input: #171715;
    --color-surface-hover: #1E1E1A;
    --color-border: #242420;
    --color-border-subtle: #1B211B;
    --color-divider: #252E25;
    --color-ink: #F0F0EC;
    --color-ink-muted: #9C9C98;
    --color-ink-subtle: #707070;
    --color-heading: #F0F0EC;
    --color-brand-title: #F0F0EC;
    --color-terracotta: #E75A4D;
    --color-terracotta-hover: #F07363;
    --color-terracotta-soft: #2C1715;
    --color-terracotta-border: #522522;
    --color-tanimbary: #6B9E61;
    --color-tanimbary-dark: #82B378;
    --color-tanimbary-soft: #1B221B;
    --color-tanimbary-border: #2F3D2F;
    --color-ochre: #E0A24A;
    --color-ochre-soft: #241B10;
    --color-ochre-border: #47341D;
    --color-card-shadow: 0 8px 30px rgba(0, 0, 0, 0.45);
    --color-card-shadow-hover: 0 16px 44px rgba(0, 0, 0, 0.6);
    --color-tab-active-bg: #6B9E61;
    --color-tab-active-text: #FFFFFF;
    --color-error: #E05555;
    --color-error-bg: #2B1616;
    --color-error-text: #FFAAA0;
    --color-success: #6B9E61;
    --color-success-bg: #1B2B1B;
    --color-success-text: #B5E8AC;
    --color-android: #3DDC84;
    --color-ios: #2997FF;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-sans);
    background-color: var(--color-bg);
    color: var(--color-ink);
    line-height: 1.7;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    transition: background-color 0.25s ease, color 0.25s ease;
  }

  /* ─── EN-TÊTE ÉDITORIAL & NAVIGATION PERMANENTE ──────────────────────────── */
  header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--color-surface);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--color-border);
    padding: 14px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    transition: background-color 0.25s ease, border-color 0.25s ease;
  }

  @media (min-width: 768px) {
    header {
      padding: 16px 36px;
    }
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
  }

  .brand-logo-wrap {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    overflow: hidden;
    background: var(--color-bg-alt);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    flex-shrink: 0;
  }

  .brand-logo {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .brand-text-wrap {
    display: flex;
    flex-direction: column;
  }

  .brand-name {
    font-family: var(--font-serif);
    font-size: 21px;
    font-weight: 700;
    color: var(--color-heading);
    letter-spacing: -0.4px;
    line-height: 1.1;
  }

  .brand-domain {
    color: var(--color-terracotta);
    font-weight: 700;
  }

  .brand-tag {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--color-ink-subtle);
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
    font-size: 13px;
    font-weight: 600;
    color: var(--color-ink-muted);
    text-decoration: none;
    transition: color 0.15s ease;
    position: relative;
  }

  .header-nav-link:hover {
    color: var(--color-terracotta);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .theme-toggle-btn {
    background: var(--color-bg-alt);
    border: 1px solid var(--color-border);
    color: var(--color-ink);
    width: 36px;
    height: 36px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .theme-toggle-btn:hover {
    border-color: var(--color-terracotta);
    color: var(--color-terracotta);
    transform: translateY(-1px);
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: var(--color-tanimbary-soft);
    border: 1px solid var(--color-border);
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.3px;
    color: var(--color-tanimbary);
  }

  .status-indicator {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--color-tanimbary);
    box-shadow: 0 0 0 3px rgba(43, 68, 38, 0.2);
    animation: pulse-dot 2.4s infinite ease-in-out;
  }

  @keyframes pulse-dot {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.25); opacity: 0.7; }
  }

  .header-cta-btn {
    display: none;
    align-items: center;
    gap: 6px;
    background: var(--color-terracotta);
    color: #FFFFFF !important;
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 12.5px;
    font-weight: 600;
    text-decoration: none;
    transition: background-color 0.2s ease, transform 0.15s ease;
    box-shadow: 0 2px 8px rgba(185, 56, 38, 0.25);
  }

  @media (min-width: 640px) {
    .header-cta-btn {
      display: inline-flex;
    }
  }

  .header-cta-btn:hover {
    background: var(--color-terracotta-hover);
    transform: translateY(-1px);
  }

  /* ─── CONTENEUR PRINCIPAL ────────────────────────────────────────────────── */
  main {
    flex: 1;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px 80px;
  }

  @media (min-width: 768px) {
    main {
      padding: 0 32px 100px;
    }
  }

  /* ─── HERO SECTION ASYMÉTRIQUE MONUMENTAL ────────────────────────────────── */
  .hero-editorial {
    padding: 56px 0 68px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 48px;
    align-items: center;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 72px;
  }

  @media (min-width: 992px) {
    .hero-editorial {
      grid-template-columns: 1.15fr 0.85fr;
      gap: 64px;
      padding: 72px 0 96px;
    }
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .eyebrow-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    align-self: flex-start;
    padding: 5px 14px;
    border-radius: 999px;
    background: var(--color-terracotta-soft);
    border: 1px solid var(--color-terracotta-border);
    color: var(--color-terracotta);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.4px;
  }

  .hero-title {
    font-family: var(--font-serif);
    font-size: clamp(38px, 5.5vw, 64px);
    font-weight: 700;
    color: var(--color-heading);
    letter-spacing: -1.2px;
    line-height: 1.08;
    margin: 0;
  }

  .hero-title em {
    font-family: var(--font-serif);
    font-style: italic;
    font-weight: 400;
    color: var(--color-terracotta);
  }

  .hero-subtitle-mg {
    font-family: var(--font-serif);
    font-size: clamp(18px, 2.4vw, 24px);
    color: var(--color-tanimbary);
    font-style: italic;
    margin-top: -6px;
    letter-spacing: -0.2px;
  }

  .hero-lead {
    font-size: clamp(15px, 1.8vw, 17.5px);
    color: var(--color-ink-muted);
    line-height: 1.75;
    max-width: 580px;
    margin-top: 4px;
  }

  .hero-actions-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
    margin-top: 12px;
  }

  .btn-hero-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--color-terracotta);
    color: #FFFFFF !important;
    padding: 14px 28px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.2s ease;
    box-shadow: 0 4px 16px rgba(185, 56, 38, 0.3);
  }

  .btn-hero-primary:hover {
    background: var(--color-terracotta-hover);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(185, 56, 38, 0.4);
  }

  .btn-hero-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--color-surface);
    color: var(--color-ink) !important;
    border: 1px solid var(--color-border);
    padding: 14px 24px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .btn-hero-secondary:hover {
    border-color: var(--color-ink);
    transform: translateY(-2px);
  }

  .hero-badges-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 24px;
    margin-top: 18px;
    padding-top: 22px;
    border-top: 1px solid var(--color-border-subtle);
  }

  .hero-stat-item {
    display: flex;
    flex-direction: column;
  }

  .hero-stat-value {
    font-family: var(--font-serif);
    font-size: 22px;
    font-weight: 700;
    color: var(--color-heading);
    line-height: 1.1;
  }

  .hero-stat-label {
    font-size: 11px;
    color: var(--color-ink-subtle);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-top: 2px;
  }

  /* ─── HERO MOCKUP SMARTPHONE HAUTE COUTURE ───────────────────────────────── */
  .hero-visual-frame {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .phone-mockup-wrapper {
    width: 100%;
    max-width: 340px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 40px;
    padding: 14px;
    box-shadow: var(--color-card-shadow-hover), 0 0 0 1px rgba(0, 0, 0, 0.04);
    position: relative;
  }

  .phone-screen {
    background: var(--color-bg);
    border-radius: 28px;
    padding: 20px 16px;
    border: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    gap: 14px;
    overflow: hidden;
  }

  .phone-notch {
    width: 72px;
    height: 16px;
    background: var(--color-border);
    border-radius: 999px;
    margin: 0 auto 6px;
    opacity: 0.6;
  }

  .phone-proverb-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    padding: 16px;
    box-shadow: var(--color-card-shadow);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .phone-card-tag {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--color-terracotta);
  }

  .phone-proverb-mg {
    font-family: var(--font-serif);
    font-size: 16px;
    font-style: italic;
    color: var(--color-heading);
    line-height: 1.35;
  }

  .phone-proverb-fr {
    font-size: 12px;
    color: var(--color-ink-muted);
    line-height: 1.45;
  }

  .phone-audio-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 999px;
    background: var(--color-tanimbary-soft);
    color: var(--color-tanimbary);
    font-size: 11px;
    font-weight: 700;
    align-self: flex-start;
    margin-top: 4px;
  }

  .phone-hubs-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .phone-hub-item {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 10px 6px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .phone-hub-icon {
    color: var(--color-terracotta);
  }

  .phone-hub-name {
    font-size: 10px;
    font-weight: 700;
    color: var(--color-heading);
  }

  /* ─── SECTION LES SIX TRÉSORS DE KANTO ───────────────────────────────────── */
  .editorial-section {
    margin-bottom: 96px;
  }

  .section-header-editorial {
    margin-bottom: 44px;
    max-width: 680px;
  }

  .section-eyebrow {
    font-size: 11.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--color-terracotta);
    margin-bottom: 8px;
    display: block;
  }

  .section-title-editorial {
    font-family: var(--font-serif);
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 700;
    color: var(--color-heading);
    letter-spacing: -0.8px;
    line-height: 1.15;
    margin-bottom: 12px;
  }

  .section-lead-editorial {
    font-size: 15.5px;
    color: var(--color-ink-muted);
    line-height: 1.7;
  }

  /* Composition asymétrique des univers */
  .univers-bento-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }

  @media (min-width: 768px) {
    .univers-bento-grid {
      grid-template-columns: repeat(12, 1fr);
    }
  }

  .bento-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 32px 28px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
    text-decoration: none;
    color: inherit;
    box-shadow: var(--color-card-shadow);
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
  }

  .bento-card:hover {
    border-color: var(--color-terracotta);
    transform: translateY(-3px);
    box-shadow: var(--color-card-shadow-hover);
  }

  .bento-card-heroic {
    grid-column: span 12;
    background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-bg-alt) 100%);
    /* pas de border-left */
  }

  @media (min-width: 992px) {
    .bento-card-heroic {
      grid-column: span 8;
    }
    .bento-card-side {
      grid-column: span 4;
    }
    .bento-card-third {
      grid-column: span 4;
    }
    .bento-card-half {
      grid-column: span 6;
    }
  }

  .bento-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .bento-icon-box {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: var(--color-terracotta-soft);
    color: var(--color-terracotta);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .bento-number {
    font-family: var(--font-serif);
    font-size: 28px;
    font-weight: 600;
    color: var(--color-terracotta);
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .bento-card-body h3 {
    font-family: var(--font-serif);
    font-size: 22px;
    font-weight: 700;
    color: var(--color-heading);
    letter-spacing: -0.3px;
    margin-bottom: 8px;
    line-height: 1.25;
  }

  .bento-card-body p {
    font-size: 14px;
    color: var(--color-ink-muted);
    line-height: 1.65;
  }

  .bento-quote-sample {
    margin-top: 14px;
    padding: 12px 16px;
    border-radius: 8px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 14.5px;
    color: var(--color-heading);
  }

  .bento-card-foot {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    font-weight: 700;
    color: var(--color-terracotta);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .bento-card:hover .bento-card-foot span:last-child {
    transform: translateX(4px);
  }

  .bento-card-foot span:last-child {
    transition: transform 0.2s ease;
  }

  /* ─── SECTION EXPÉRIENCE MOBILE & SANCTUAIRE CULTUREL ────────────────────── */
  .experience-strip {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 48px 36px;
    margin-bottom: 96px;
    box-shadow: var(--color-card-shadow);
  }

  .pillars-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    margin-top: 40px;
  }

  @media (min-width: 768px) {
    .pillars-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 36px;
    }
  }

  @media (min-width: 1024px) {
    .pillars-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .pillar-item {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .pillar-icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--color-tanimbary-soft);
    color: var(--color-tanimbary);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pillar-item h4 {
    font-family: var(--font-serif);
    font-size: 18px;
    font-weight: 700;
    color: var(--color-heading);
  }

  .pillar-item p {
    font-size: 13.5px;
    color: var(--color-ink-muted);
    line-height: 1.6;
  }

  /* ─── SECTION AVIS CERTIFIÉS DE LA COMMUNAUTÉ ────────────────────────────── */
  .reviews-section-editorial {
    margin-bottom: 96px;
  }

  .reviews-header-modern {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 40px;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 24px;
  }

  .reviews-title {
    font-family: var(--font-serif);
    font-size: clamp(26px, 3.8vw, 38px);
    font-weight: 700;
    color: var(--color-heading);
    letter-spacing: -0.6px;
    line-height: 1.15;
  }

  .reviews-subtitle {
    font-size: 15px;
    color: var(--color-ink-muted);
    margin-top: 6px;
    max-width: 540px;
  }

  .reviews-trust-pill {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    padding: 12px 20px;
    box-shadow: var(--color-card-shadow);
  }

  .trust-pill-score {
    font-family: var(--font-serif);
    font-size: 32px;
    font-weight: 700;
    color: var(--color-terracotta);
    line-height: 1;
  }

  .trust-pill-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .trust-pill-stars {
    display: flex;
    align-items: center;
    gap: 2px;
    color: var(--color-ochre);
  }

  .trust-pill-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--color-ink-subtle);
  }

  .reviews-list-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  @media (min-width: 768px) {
    .reviews-list-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .reviews-list-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .review-card-item {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 16px;
    box-shadow: var(--color-card-shadow);
    transition: all 0.2s ease;
  }

  .review-card-item:hover {
    border-color: var(--color-border);
    transform: translateY(-2px);
    box-shadow: var(--color-card-shadow-hover);
  }

  .review-card-head {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .review-avatar-init {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--color-terracotta-soft);
    color: var(--color-terracotta);
    font-family: var(--font-serif);
    font-weight: 700;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .review-author-name {
    font-weight: 700;
    font-size: 13.5px;
    color: var(--color-heading);
  }

  .review-card-badge {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: var(--color-tanimbary);
  }

  .review-stars-row {
    display: flex;
    gap: 2px;
    color: var(--color-ochre);
    font-size: 12px;
  }

  .review-card-body {
    font-size: 14px;
    color: var(--color-ink-muted);
    line-height: 1.65;
    font-style: italic;
  }

  .review-card-date {
    font-size: 11px;
    color: var(--color-ink-subtle);
  }

  .reviews-empty-state {
    padding: 36px;
    text-align: center;
    font-size: 14px;
    color: var(--color-ink-subtle);
    grid-column: 1 / -1;
  }

  .reviews-pagination-box {
    margin-top: 32px;
    text-align: center;
  }

  /* ─── SECTION CONVERSION : TÉLÉCHARGEMENT & INSCRIPTION BÊTA ─────────────── */
  .conversion-section {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 44px 32px;
    box-shadow: var(--color-card-shadow-hover);
    margin-bottom: 96px;
    position: relative;
  }

  @media (min-width: 768px) {
    .conversion-section {
      padding: 56px 48px;
    }
  }

  .conversion-header {
    text-align: center;
    max-width: 640px;
    margin: 0 auto 36px;
  }

  .conversion-title {
    font-family: var(--font-serif);
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 700;
    color: var(--color-heading);
    letter-spacing: -0.6px;
    line-height: 1.15;
    margin-bottom: 10px;
  }

  .conversion-desc {
    font-size: 15px;
    color: var(--color-ink-muted);
    line-height: 1.65;
  }

  /* Navigation par onglets Inscription vs Téléchargement */
  .tabs-nav {
    display: flex;
    background: var(--color-bg-alt);
    padding: 5px;
    border-radius: 999px;
    max-width: 420px;
    margin: 0 auto 36px;
    border: 1px solid var(--color-border);
  }

  .tab-btn {
    flex: 1;
    padding: 10px 18px;
    border-radius: 999px;
    background: transparent;
    border: none;
    color: var(--color-ink-muted);
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .tab-btn.active {
    background: var(--color-tab-active-bg);
    color: var(--color-tab-active-text);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  /* Formulaire & Champs */
  .form-container {
    max-width: 580px;
    margin: 0 auto;
  }

  .field {
    margin-bottom: 22px;
  }

  .field-label {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 13px;
    font-weight: 700;
    color: var(--color-heading);
    margin-bottom: 8px;
  }

  .field-input {
    width: 100%;
    padding: 13px 16px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    background: var(--color-surface-input);
    color: var(--color-ink);
    font-size: 14.5px;
    font-family: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .field-input:focus {
    outline: none;
    border-color: var(--color-terracotta);
    box-shadow: 0 0 0 3px rgba(185, 56, 38, 0.15);
  }

  .field-note {
    font-size: 12px;
    color: var(--color-ink-subtle);
    margin-top: 6px;
    line-height: 1.5;
  }

  /* Cartes de sélection de plateforme */
  .platforms-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 24px;
  }

  .platform-card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 16px;
    background: var(--color-surface-hover);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .platform-card.checked {
    border-color: var(--color-terracotta);
    background: var(--color-terracotta-soft);
  }

  .platform-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .platform-title {
    font-size: 13.5px;
    font-weight: 700;
    color: var(--color-heading);
  }

  .platform-desc {
    font-size: 11.5px;
    color: var(--color-ink-muted);
    line-height: 1.4;
  }

  /* Consentement RGPD & CGU */
  .consent-card-box {
    background: var(--color-bg-alt);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 16px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .consent-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .consent-checkbox {
    width: 17px;
    height: 17px;
    border-radius: 4px;
    margin-top: 3px;
    accent-color: var(--color-terracotta);
    cursor: pointer;
    flex-shrink: 0;
  }

  .consent-label {
    font-size: 12.5px;
    color: var(--color-ink-muted);
    line-height: 1.5;
    cursor: pointer;
  }

  .consent-label a, .consent-label button {
    color: var(--color-terracotta);
    text-decoration: underline;
    font-weight: 600;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: inherit;
    font-family: inherit;
  }

  /* Boutons de soumission et actions */
  .btn-submit-main {
    width: 100%;
    padding: 15px 24px;
    border-radius: 999px;
    background: var(--color-terracotta);
    color: #FFFFFF;
    font-size: 14.5px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
    box-shadow: 0 4px 16px rgba(185, 56, 38, 0.3);
  }

  .btn-submit-main:hover {
    background: var(--color-terracotta-hover);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(185, 56, 38, 0.4);
  }

  .btn-submit-main:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .btn-secondary {
    background: var(--color-surface);
    color: var(--color-ink);
    border: 1px solid var(--color-border);
    padding: 11px 20px;
    border-radius: 999px;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .btn-secondary:hover {
    border-color: var(--color-ink);
  }

  .already-link-box {
    text-align: center;
    margin-top: 18px;
    font-size: 12.5px;
    color: var(--color-ink-subtle);
  }

  .already-link-box a {
    color: var(--color-terracotta);
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;
  }

  /* Panneau de téléchargement direct */
  .download-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  @media (min-width: 640px) {
    .download-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .download-card {
    background: var(--color-bg-alt);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 16px;
    transition: all 0.2s ease;
  }

  .download-card:hover {
    border-color: var(--color-terracotta);
    transform: translateY(-2px);
  }

  .download-card-title {
    font-family: var(--font-serif);
    font-size: 18px;
    font-weight: 700;
    color: var(--color-heading);
  }

  .download-card-desc {
    font-size: 13px;
    color: var(--color-ink-muted);
    line-height: 1.5;
  }

  .download-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 20px;
    border-radius: 999px;
    font-size: 13.5px;
    font-weight: 700;
    text-decoration: none;
    color: #FFFFFF !important;
    transition: opacity 0.2s ease;
  }

  .download-action-btn.android {
    background: #0F9D58;
  }

  .download-action-btn.ios {
    background: #0071E3;
  }

  .download-action-btn:hover {
    opacity: 0.9;
  }

  /* Alertes et bannières */
  .banner {
    padding: 14px 18px;
    border-radius: var(--radius-sm);
    font-size: 13px;
    line-height: 1.5;
    margin-bottom: 24px;
    display: none;
    align-items: center;
    gap: 10px;
  }

  .banner.error {
    background: var(--color-error-bg);
    border: 1px solid var(--color-terracotta-border);
    color: var(--color-error-text);
  }

  .banner.success {
    background: var(--color-success-bg);
    border: 1px solid var(--color-tanimbary);
    color: var(--color-success-text);
  }

  .hp-trap {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    opacity: 0;
  }

  /* ─── MODALES DE CONFIDENTIALITÉ & CGU ───────────────────────────────────── */
  .kanto-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(12, 12, 10, 0.75);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .kanto-modal-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    max-width: 640px;
    width: 100%;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: var(--color-card-shadow-hover);
    overflow: hidden;
  }

  .kanto-modal-head {
    padding: 20px 24px;
    border-bottom: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .kanto-modal-title {
    font-family: var(--font-serif);
    font-size: 18px;
    font-weight: 700;
    color: var(--color-heading);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .kanto-modal-close {
    background: none;
    border: none;
    color: var(--color-ink-subtle);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .kanto-modal-close:hover {
    color: var(--color-heading);
  }

  .kanto-modal-scroll {
    padding: 24px;
    overflow-y: auto;
    font-size: 13.5px;
    color: var(--color-ink-muted);
    line-height: 1.7;
  }

  .kanto-modal-scroll h3 {
    font-family: var(--font-serif);
    font-size: 16px;
    color: var(--color-heading);
    margin: 18px 0 6px;
  }

  .kanto-modal-scroll p, .kanto-modal-scroll ul {
    margin-bottom: 12px;
  }

  .kanto-modal-foot {
    padding: 16px 24px;
    border-top: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: var(--color-bg-alt);
  }

  .cgu-highlight-box {
    background: var(--color-terracotta-soft);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    padding: 12px 16px;
    margin-bottom: 18px;
    font-size: 13px;
    color: var(--color-heading);
  }

  /* Gestion des cookies */
  .cookie-banner {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    max-width: 820px;
    margin: 0 auto;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 20px 24px;
    box-shadow: var(--color-card-shadow-hover);
    z-index: 500;
  }

  .cookie-banner-wrap {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  @media (min-width: 768px) {
    .cookie-banner-wrap {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .cookie-banner-title {
    font-family: var(--font-serif);
    font-size: 15px;
    font-weight: 700;
    color: var(--color-heading);
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .cookie-banner-desc {
    font-size: 12.5px;
    color: var(--color-ink-muted);
    line-height: 1.5;
  }

  .cookie-banner-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .cookie-btn {
    padding: 8px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .cookie-btn-primary {
    background: var(--color-terracotta);
    color: #FFFFFF;
  }

  .cookie-btn-secondary {
    background: var(--color-bg-alt);
    color: var(--color-ink);
    border: 1px solid var(--color-border);
  }

  .cookie-btn-outline {
    background: transparent;
    color: var(--color-ink-muted);
    border: 1px solid var(--color-border);
  }

  /* ─── PIED DE PAGE ÉDITORIAL & INSTITUTIONNEL ────────────────────────────── */
  footer {
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    padding: 56px 32px 36px;
    margin-top: auto;
  }

  .footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 36px;
  }

  .footer-top-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 36px;
  }

  @media (min-width: 768px) {
    .footer-top-grid {
      grid-template-columns: 1.5fr 1fr 1fr 1fr;
    }
  }

  .footer-brand-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .footer-proverb-quote {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 15px;
    color: var(--color-heading);
    line-height: 1.5;
  }

  .footer-proverb-sub {
    font-size: 12.5px;
    color: var(--color-ink-subtle);
  }

  .footer-col-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--color-terracotta);
    margin-bottom: 14px;
  }

  .footer-col-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .footer-col-links a, .footer-col-links button {
    font-size: 13px;
    color: var(--color-ink-muted);
    text-decoration: none;
    background: none;
    border: none;
    padding: 0;
    text-align: left;
    cursor: pointer;
    font-family: inherit;
    transition: color 0.15s ease;
  }

  .footer-col-links a:hover, .footer-col-links button:hover {
    color: var(--color-terracotta);
  }

  .footer-bottom-bar {
    padding-top: 24px;
    border-top: 1px solid var(--color-border-subtle);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    font-size: 12px;
    color: var(--color-ink-subtle);
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
