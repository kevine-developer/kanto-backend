/**
 * Kanto MG — Styles du Portail Officiel et Vitrine de Conversion
 * « La culture malgache, autrement »
 *
 * Conception mobile-first, direction artistique éditoriale et noble :
 * - Surfaces : Ivoire lin chaud & Parchemin (#F5F4F0 / #0D0D0B)
 * - Textes : Charbon doux (#1A1A1A / #F0F0EC)
 * - Accent Terre Cuite / Tany Mena (#C0392B / #E75A4D)
 * - Accent Vert Tanimbary (#4A6741 / #6B9E61)
 * - Accent Ocre Ambre (#C58B38 / #E0A24A)
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
    --color-surface-elevated: #FFFFFF;
    --color-surface-input: #FFFFFF;
    --color-surface-hover: #F2EFE9;
    --color-border: #E5E2DB;
    --color-border-subtle: #ECE8E0;
    --color-divider: #DCE1D7;
    --color-ink: #1A1A1A;
    --color-ink-muted: #5C5C5C;
    --color-ink-subtle: #8A8A8A;
    --color-heading: #1A1A1A;
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
    --color-card-shadow-hover: 0 12px 32px rgba(26, 26, 26, 0.08);
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
    --color-surface-input: #171715;
    --color-surface-hover: #1E1E1A;
    --color-border: #242420;
    --color-border-subtle: #1E1E1C;
    --color-divider: #252E25;
    --color-ink: #F0F0EC;
    --color-ink-muted: #9C9C98;
    --color-ink-subtle: #707070;
    --color-heading: #F0F0EC;
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
    font-size: 16px;
  }

  body {
    font-family: var(--font-sans);
    background-color: var(--color-bg);
    color: var(--color-ink);
    line-height: 1.65;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    transition: background-color 0.25s ease, color 0.25s ease;
  }

  /* ─── EN-TÊTE ÉPURÉ & NAVIGATION MINIMALISTE ─────────────────────────────── */
  .site-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--color-surface);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--color-border);
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    transition: background-color 0.25s ease, border-color 0.25s ease;
  }

  @media (min-width: 768px) {
    .site-header {
      padding: 16px 40px;
    }
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
  }

  .brand-logo-wrap {
    width: 38px;
    height: 38px;
    border-radius: 10px;
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
    font-size: 22px;
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

  @media (max-width: 480px) {
    .brand-tag {
      display: none;
    }
  }

  .header-nav {
    display: none;
    align-items: center;
    gap: 28px;
  }

  @media (min-width: 860px) {
    .header-nav {
      display: flex;
    }
  }

  .header-nav-link {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-ink-muted);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .header-nav-link:hover {
    color: var(--color-terracotta);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .theme-toggle-btn {
    background: var(--color-bg-alt);
    border: 1px solid var(--color-border);
    color: var(--color-ink);
    width: 38px;
    height: 38px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .theme-toggle-btn:hover {
    border-color: var(--color-terracotta);
    color: var(--color-terracotta);
  }

  .header-cta-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--color-terracotta);
    color: #FFFFFF !important;
    padding: 8px 18px;
    border-radius: var(--radius-full);
    font-size: 13px;
    font-weight: 700;
    text-decoration: none;
    transition: background-color 0.2s ease, transform 0.15s ease;
    box-shadow: 0 2px 8px rgba(192, 57, 43, 0.25);
    white-space: nowrap;
    min-height: 38px;
  }

  .header-cta-btn:hover {
    background: var(--color-terracotta-hover);
    transform: translateY(-1px);
  }

  /* ─── CONTENEUR PRINCIPAL ─────────────────────────────────────────────────── */
  main {
    flex: 1;
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 20px 80px;
  }

  @media (min-width: 768px) {
    main {
      padding: 0 32px 100px;
    }
  }

  /* ─── ZONE 1 — PRÉSENTATION COMPACTE & IDENTITÉ ─────────────────────────── */
  .section-presentation {
    padding: 36px 0 44px;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 48px;
  }

  @media (min-width: 900px) {
    .section-presentation {
      padding: 56px 0 64px;
      margin-bottom: 64px;
    }
  }

  .presentation-inner {
    display: grid;
    grid-template-columns: 1fr;
    gap: 36px;
    align-items: center;
  }

  @media (min-width: 900px) {
    .presentation-inner {
      grid-template-columns: 1.15fr 0.85fr;
      gap: 56px;
    }
  }

  .presentation-text {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .pres-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .pres-pill {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: var(--radius-full);
    background: var(--color-terracotta-soft);
    border: 1px solid var(--color-terracotta-border);
    color: var(--color-terracotta);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .pres-badge-counter {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: var(--radius-full);
    background: var(--color-tanimbary-soft);
    border: 1px solid var(--color-tanimbary-border);
    color: var(--color-tanimbary);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .presentation-title {
    font-family: var(--font-serif);
    font-size: clamp(28px, 4.2vw, 44px);
    font-weight: 700;
    color: var(--color-heading);
    letter-spacing: -0.8px;
    line-height: 1.15;
  }

  .presentation-desc {
    font-size: 15.5px;
    color: var(--color-ink-muted);
    line-height: 1.65;
    max-width: 580px;
  }

  .presentation-actions {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    margin-top: 6px;
  }

  .btn-pres-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--color-terracotta);
    color: #FFFFFF !important;
    padding: 12px 24px;
    border-radius: var(--radius-full);
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    box-shadow: 0 4px 14px rgba(192, 57, 43, 0.28);
    transition: all 0.2s ease;
    min-height: 44px;
  }

  .btn-pres-primary:hover {
    background: var(--color-terracotta-hover);
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(192, 57, 43, 0.35);
  }

  .btn-pres-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--color-surface);
    color: var(--color-heading);
    border: 1px solid var(--color-border);
    padding: 12px 20px;
    border-radius: var(--radius-full);
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
    min-height: 44px;
  }

  .btn-pres-secondary:hover {
    border-color: var(--color-heading);
    background: var(--color-surface-hover);
  }

  /* Carte visuelle sobre */
  .presentation-visual {
    display: flex;
    justify-content: center;
  }

  .visual-artwork-card {
    width: 100%;
    max-width: 360px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 36px 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: var(--color-card-shadow);
    position: relative;
    overflow: hidden;
  }

  .artwork-halo {
    position: absolute;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 120px;
    background: radial-gradient(circle, rgba(192, 57, 43, 0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .artwork-emblem {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
  }

  .artwork-logo {
    width: 96px;
    height: 96px;
    border-radius: 24px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }

  .artwork-label {
    font-family: var(--font-serif);
    font-size: 14.5px;
    font-style: italic;
    color: var(--color-terracotta);
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .artwork-tagline {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    border-top: 1px solid var(--color-border);
    padding-top: 18px;
    width: 100%;
  }

  .artwork-tagline span {
    font-size: 11px;
    font-weight: 700;
    color: var(--color-ink-muted);
    background: var(--color-bg-alt);
    border: 1px solid var(--color-border-subtle);
    padding: 3px 9px;
    border-radius: var(--radius-sm);
  }

  /* ─── ZONE 2 — PROGRAMME DE TESTEURS (PRIORITÉ VISUELLE MAJEURE) ────────── */
  .section-testers {
    margin-bottom: 72px;
    scroll-margin-top: 90px;
  }

  .testers-card {
    background: var(--color-surface);
    border: 2px solid var(--color-terracotta-border);
    border-radius: var(--radius-lg);
    padding: 28px 20px;
    box-shadow: var(--color-card-shadow-hover);
    position: relative;
  }

  @media (min-width: 768px) {
    .testers-card {
      padding: 48px 40px;
    }
  }

  .testers-header {
    text-align: center;
    max-width: 640px;
    margin: 0 auto 32px;
  }

  .testers-eyebrow {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--color-terracotta);
    margin-bottom: 8px;
  }

  .testers-title {
    font-family: var(--font-serif);
    font-size: clamp(26px, 3.8vw, 36px);
    font-weight: 700;
    color: var(--color-heading);
    letter-spacing: -0.6px;
    line-height: 1.2;
    margin-bottom: 12px;
  }

  .testers-desc {
    font-size: 15px;
    color: var(--color-ink-muted);
    line-height: 1.6;
  }

  /* Onglets de bascule Inscription / Déjà inscrit */
  .testers-tabs-nav {
    display: flex;
    background: var(--color-bg-alt);
    padding: 4px;
    border-radius: var(--radius-full);
    max-width: 440px;
    margin: 0 auto 32px;
    border: 1px solid var(--color-border);
  }

  .tester-tab-btn {
    flex: 1;
    padding: 10px 16px;
    border-radius: var(--radius-full);
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
    min-height: 42px;
  }

  .tester-tab-btn.active {
    background: var(--color-tab-active-bg);
    color: var(--color-tab-active-text);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }

  /* Bannières d'alerte */
  .banner {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    border-radius: var(--radius-md);
    font-size: 13.5px;
    font-weight: 600;
    margin-bottom: 24px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .banner.error {
    background: var(--color-error-bg);
    border: 1px solid var(--color-error);
    color: var(--color-error-text);
  }

  .banner.success {
    background: var(--color-success-bg);
    border: 1px solid var(--color-success);
    color: var(--color-success-text);
  }

  /* ─── Panneau de confirmation directe du statut testeur ─────────────────── */
  .testers-status-confirm-panel {
    background: var(--color-bg-alt);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 24px 20px;
    margin: 0 auto 24px;
    max-width: 600px;
    box-sizing: border-box;
    transition: all 0.25s ease;
  }

  @media (min-width: 768px) {
    .testers-status-confirm-panel {
      padding: 28px 24px;
    }
  }

  .status-confirm-header {
    text-align: center;
    margin-bottom: 20px;
  }

  .status-confirm-badge {
    display: inline-flex;
    align-items: center;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--color-tanimbary);
    background: var(--color-tanimbary-soft);
    border: 1px solid var(--color-tanimbary-border);
    padding: 4px 12px;
    border-radius: var(--radius-full);
    margin-bottom: 10px;
  }

  .status-confirm-title {
    font-family: var(--font-serif);
    font-size: clamp(19px, 2.5vw, 22px);
    font-weight: 700;
    color: var(--color-heading);
    margin: 0 0 6px;
    letter-spacing: -0.3px;
  }

  .status-confirm-subtitle {
    font-size: 13.5px;
    color: var(--color-ink-muted);
    line-height: 1.5;
    margin: 0 auto;
    max-width: 500px;
  }

  .status-confirm-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    text-align: left;
  }

  @media (min-width: 560px) {
    .status-confirm-grid {
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
  }

  .status-confirm-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    background: var(--color-surface);
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-md);
    text-decoration: none;
    color: inherit;
    transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
    cursor: pointer;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
  }

  .status-confirm-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--color-card-shadow);
    background: var(--color-surface-hover);
  }

  .status-confirm-btn.android:hover {
    border-color: var(--color-android);
  }

  .status-confirm-btn.ios:hover {
    border-color: var(--color-ios);
  }

  .status-confirm-btn.active-target {
    border-color: var(--color-ochre);
    box-shadow: 0 0 0 3px rgba(197, 139, 56, 0.25);
    background: var(--color-ochre-soft);
  }

  .status-confirm-icon {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.15s ease;
  }

  .status-confirm-btn:hover .status-confirm-icon {
    transform: scale(1.06);
  }

  .status-confirm-icon.android {
    background: rgba(45, 155, 94, 0.12);
    color: var(--color-android);
  }

  .status-confirm-icon.ios {
    background: rgba(0, 113, 227, 0.12);
    color: var(--color-ios);
  }

  .status-confirm-details {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
    flex: 1;
  }

  .status-confirm-tags {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .tag-platform {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .tag-platform.android {
    color: var(--color-android);
  }

  .tag-platform.ios {
    color: var(--color-ios);
  }

  .tag-status {
    font-size: 10.5px;
    color: var(--color-ink-subtle);
    font-weight: 500;
  }

  .status-confirm-action-text {
    font-size: 13.5px;
    font-weight: 700;
    color: var(--color-heading);
    line-height: 1.25;
  }

  .status-confirm-hint {
    font-size: 11.5px;
    color: var(--color-ink-muted);
    line-height: 1.3;
    white-space: normal;
  }

  .testers-divider-row {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 24px auto 28px;
    max-width: 580px;
  }

  .testers-divider-row::before,
  .testers-divider-row::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--color-border);
  }

  .testers-divider-text {
    padding: 0 16px;
    font-size: 12px;
    font-weight: 700;
    color: var(--color-ink-subtle);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  /* Formulaire d'inscription */
  .testers-form {
    max-width: 580px;
    margin: 0 auto;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 18px;
    margin-bottom: 20px;
  }

  @media (min-width: 600px) {
    .form-row {
      grid-template-columns: 1.2fr 0.8fr;
    }
  }

  .field-wrap {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
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

  .label-badge-req {
    font-size: 10.5px;
    font-weight: 700;
    color: var(--color-terracotta);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .label-badge-opt {
    font-size: 10.5px;
    font-weight: 600;
    color: var(--color-ink-subtle);
  }

  .field-input {
    width: 100%;
    padding: 13px 16px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    background: var(--color-surface-input);
    color: var(--color-ink);
    font-size: 16px; /* Empêche le zoom automatique sur iOS */
    font-family: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .field-input:focus {
    outline: none;
    border-color: var(--color-terracotta);
    box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.15);
  }

  .field-help {
    font-size: 12px;
    color: var(--color-ink-subtle);
    margin-top: 6px;
    line-height: 1.45;
  }

  /* Cartes de sélection plateformes */
  .platform-selection-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .platform-toggle-card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 14px;
    background: var(--color-surface-hover);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 6px;
    transition: all 0.2s ease;
  }

  .platform-toggle-card.checked {
    border-color: var(--color-terracotta);
    background: var(--color-terracotta-soft);
  }

  .platform-toggle-head {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .platform-toggle-name {
    font-size: 13.5px;
    font-weight: 700;
    color: var(--color-heading);
  }

  .platform-toggle-status {
    font-size: 10.5px;
    font-weight: 700;
    color: var(--color-terracotta);
    background: var(--color-surface);
    padding: 1px 6px;
    border-radius: 4px;
    margin-left: auto;
  }

  .platform-toggle-desc {
    font-size: 11.5px;
    color: var(--color-ink-muted);
    line-height: 1.4;
  }

  /* Consentements */
  .consent-box {
    background: var(--color-bg-alt);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 14px 16px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .consent-checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 12.5px;
    color: var(--color-ink-muted);
    line-height: 1.45;
    cursor: pointer;
  }

  .consent-checkbox-label input[type="checkbox"] {
    width: 17px;
    height: 17px;
    border-radius: 4px;
    margin-top: 2px;
    accent-color: var(--color-terracotta);
    flex-shrink: 0;
    cursor: pointer;
  }

  .btn-legal-link {
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

  /* Bouton d'action formulaire */
  .submit-action-wrap {
    margin-bottom: 16px;
  }

  .btn-submit-tester {
    width: 100%;
    padding: 14px 24px;
    border-radius: var(--radius-full);
    background: var(--color-terracotta);
    color: #FFFFFF;
    font-size: 15px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
    box-shadow: 0 4px 16px rgba(192, 57, 43, 0.3);
    min-height: 48px;
  }

  .btn-submit-tester:hover {
    background: var(--color-terracotta-hover);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(192, 57, 43, 0.38);
  }

  .btn-submit-tester:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }

  .already-switch-hint, .return-to-reg-hint {
    text-align: center;
    font-size: 13px;
    color: var(--color-ink-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .btn-switch-link {
    background: none;
    border: none;
    color: var(--color-terracotta);
    font-weight: 700;
    font-size: inherit;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
  }

  /* ─── ESPACE TESTEURS DÉJÀ INSCRITS (AU-DESSUS DU FOOTER) ─────────────────── */
  .section-status-check {
    margin-bottom: 64px;
    scroll-margin-top: 90px;
  }

  .status-verification-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 32px 24px;
    max-width: 680px;
    margin: 0 auto;
    box-shadow: var(--color-card-shadow);
  }

  @media (min-width: 768px) {
    .status-verification-card {
      padding: 40px 36px;
    }
  }

  .status-box-header {
    text-align: center;
    margin-bottom: 24px;
  }

  .status-box-eyebrow {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--color-terracotta);
    display: inline-block;
    margin-bottom: 6px;
  }

  .status-box-title {
    font-family: var(--font-serif);
    font-size: 21px;
    font-weight: 700;
    color: var(--color-heading);
    margin-bottom: 8px;
    text-align: center;
  }

  .status-box-desc {
    font-size: 14px;
    color: var(--color-ink-muted);
    text-align: center;
    margin-bottom: 24px;
    line-height: 1.55;
  }

  .status-input-wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 24px;
  }

  @media (min-width: 600px) {
    .status-input-wrap {
      flex-direction: row;
    }
  }

  .btn-check-submit {
    background: var(--color-tanimbary);
    color: #FFFFFF;
    border: none;
    padding: 12px 22px;
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s ease;
    min-height: 44px;
  }

  .btn-check-submit:hover {
    background: var(--color-tanimbary-dark);
  }

  /* Carte résultat statut */
  .status-result-card {
    background: var(--color-bg-alt);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 20px;
    margin-bottom: 24px;
  }

  .status-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 14px;
    margin-bottom: 18px;
  }

  .status-card-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--color-ink-subtle);
  }

  .status-email-display {
    font-size: 15px;
    font-weight: 700;
    color: var(--color-heading);
  }

  .status-badge-verified {
    background: var(--color-tanimbary-soft);
    border: 1px solid var(--color-tanimbary-border);
    color: var(--color-tanimbary);
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: var(--radius-full);
  }

  .status-action-banner {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 16px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .action-banner-text h4 {
    font-size: 14.5px;
    font-weight: 700;
    color: var(--color-heading);
    margin-bottom: 4px;
  }

  .action-banner-text p {
    font-size: 13px;
    color: var(--color-ink-muted);
  }

  .action-banner-btns {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .btn-confirm-action {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--color-terracotta);
    color: #FFFFFF;
    border: none;
    padding: 10px 18px;
    border-radius: var(--radius-full);
    font-size: 13.5px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .btn-confirm-action:hover {
    background: var(--color-terracotta-hover);
  }

  /* Cartes débloquées */
  .unlocked-links-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }

  @media (min-width: 600px) {
    .unlocked-links-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .unlocked-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .unlocked-platform-name {
    font-size: 14px;
    font-weight: 700;
    color: var(--color-heading);
  }

  .badge-status-val {
    align-self: flex-start;
    font-size: 11px;
    font-weight: 700;
    background: var(--color-tanimbary-soft);
    color: var(--color-tanimbary);
    padding: 2px 8px;
    border-radius: 4px;
  }

  .unlocked-desc {
    font-size: 12.5px;
    color: var(--color-ink-muted);
    line-height: 1.45;
  }

  .btn-unlocked-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--color-tanimbary);
    color: #FFFFFF !important;
    padding: 9px 14px;
    border-radius: var(--radius-full);
    font-size: 12.5px;
    font-weight: 700;
    text-decoration: none;
    margin-top: 6px;
    transition: background 0.2s ease;
  }

  .btn-unlocked-link:hover {
    background: var(--color-tanimbary-dark);
  }

  /* ─── ZONE 3 — TÉLÉCHARGER KANTO (ACCÈS DIRECTS ANDROID & IOS) ──────────── */
  .section-downloads {
    margin-bottom: 72px;
    scroll-margin-top: 90px;
  }

  .downloads-container {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 32px 20px;
    box-shadow: var(--color-card-shadow);
  }

  @media (min-width: 768px) {
    .downloads-container {
      padding: 48px 40px;
    }
  }

  .downloads-header {
    text-align: center;
    max-width: 600px;
    margin: 0 auto 36px;
  }

  .downloads-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--color-tanimbary);
    display: inline-block;
    margin-bottom: 8px;
  }

  .downloads-title {
    font-family: var(--font-serif);
    font-size: clamp(24px, 3.5vw, 34px);
    font-weight: 700;
    color: var(--color-heading);
    letter-spacing: -0.5px;
    margin-bottom: 10px;
  }

  .downloads-desc {
    font-size: 15px;
    color: var(--color-ink-muted);
    line-height: 1.6;
  }

  .downloads-showcase-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 840px;
    margin: 0 auto;
  }

  @media (min-width: 700px) {
    .downloads-showcase-grid {
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
  }

  .store-card {
    background: var(--color-bg-alt);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.2s ease, border-color 0.2s ease;
  }

  .store-card:hover {
    border-color: var(--color-terracotta);
    transform: translateY(-2px);
  }

  .store-card-head {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 14px;
  }

  .store-icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .store-icon-wrap.android {
    background: rgba(45, 155, 94, 0.12);
    color: var(--color-android);
  }

  .store-icon-wrap.ios {
    background: rgba(0, 113, 227, 0.12);
    color: var(--color-ios);
  }

  .store-badge-avail {
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--color-tanimbary);
  }

  .store-card-name {
    font-size: 18px;
    font-weight: 700;
    color: var(--color-heading);
    line-height: 1.2;
  }

  .store-card-text {
    font-size: 13.5px;
    color: var(--color-ink-muted);
    line-height: 1.55;
    margin-bottom: 20px;
    flex: 1;
  }

  /* Boutons badges officiels stores */
  .btn-store-download {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: #000000;
    color: #FFFFFF !important;
    padding: 10px 18px;
    border-radius: var(--radius-sm);
    text-decoration: none;
    transition: opacity 0.2s ease;
    min-height: 48px;
  }

  [data-theme="dark"] .btn-store-download {
    background: #242420;
    border: 1px solid #383832;
  }

  .btn-store-download:hover {
    opacity: 0.9;
  }

  .btn-store-text {
    display: flex;
    flex-direction: column;
    text-align: left;
    line-height: 1.1;
  }

  .btn-sub {
    font-size: 9.5px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    opacity: 0.85;
  }

  .btn-main {
    font-size: 14.5px;
    font-weight: 700;
  }

  /* QR Code sur Desktop */
  .desktop-qr-container {
    display: none;
    margin-top: 36px;
    padding-top: 32px;
    border-top: 1px solid var(--color-border);
  }

  @media (min-width: 900px) {
    .desktop-qr-container {
      display: flex;
      justify-content: center;
    }
  }

  .qr-card {
    display: flex;
    align-items: center;
    gap: 20px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 16px 24px;
  }

  .qr-svg-native {
    color: var(--color-heading);
    flex-shrink: 0;
  }

  .qr-label-wrap {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .qr-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--color-heading);
  }

  .qr-subtitle {
    font-size: 12.5px;
    color: var(--color-ink-muted);
    max-width: 260px;
    line-height: 1.45;
  }

  /* ─── ZONE 4 — INFORMATIONS ESSENTIELLES (FAQ CONDENSÉE) ─────────────────── */
  .section-essentials {
    margin-bottom: 64px;
    scroll-margin-top: 90px;
  }

  .essentials-container {
    max-width: 760px;
    margin: 0 auto;
  }

  .essentials-heading {
    font-family: var(--font-serif);
    font-size: clamp(22px, 3.2vw, 30px);
    font-weight: 700;
    color: var(--color-heading);
    text-align: center;
    margin-bottom: 28px;
  }

  .faq-accordion {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .faq-item {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: border-color 0.2s ease;
  }

  .faq-item[open] {
    border-color: var(--color-terracotta-border);
  }

  .faq-question {
    padding: 16px 20px;
    font-size: 15px;
    font-weight: 700;
    color: var(--color-heading);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    user-select: none;
    list-style: none;
  }

  .faq-question::-webkit-details-marker {
    display: none;
  }

  .faq-chevron {
    color: var(--color-ink-subtle);
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  .faq-item[open] .faq-chevron {
    transform: rotate(180deg);
    color: var(--color-terracotta);
  }

  .faq-answer {
    padding: 0 20px 18px;
    font-size: 14px;
    color: var(--color-ink-muted);
    line-height: 1.65;
  }

  /* ─── FOOTER INSTITUTIONNEL SOBRE ────────────────────────────────────────── */
  .site-footer {
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    padding: 48px 20px 32px;
    margin-top: auto;
  }

  @media (min-width: 768px) {
    .site-footer {
      padding: 56px 40px 36px;
    }
  }

  .footer-container {
    max-width: 1100px;
    margin: 0 auto;
  }

  .footer-main-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 36px;
    padding-bottom: 40px;
    border-bottom: 1px solid var(--color-border);
  }

  @media (min-width: 768px) {
    .footer-main-row {
      grid-template-columns: 1.4fr 1fr 1fr;
      gap: 48px;
    }
  }

  .footer-brand-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .footer-brand-head {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .footer-brand-title {
    font-family: var(--font-serif);
    font-size: 19px;
    font-weight: 700;
    color: var(--color-heading);
  }

  .footer-mission-text {
    font-size: 13.5px;
    color: var(--color-ink-muted);
    line-height: 1.6;
    max-width: 380px;
  }

  .footer-links-col {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .footer-col-title {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--color-heading);
    margin-bottom: 4px;
  }

  .footer-links-col a {
    font-size: 13.5px;
    color: var(--color-ink-muted);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .footer-links-col a:hover {
    color: var(--color-terracotta);
  }

  .footer-bottom-bar {
    padding-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 12px;
    color: var(--color-ink-subtle);
  }

  @media (min-width: 768px) {
    .footer-bottom-bar {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  /* ─── MODALES CGU & POLITIQUE DE CONFIDENTIALITÉ ─────────────────────────── */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .modal-dialog {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 540px;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--color-border);
  }

  .modal-head h3 {
    font-family: var(--font-serif);
    font-size: 19px;
    font-weight: 700;
    color: var(--color-heading);
  }

  .btn-modal-close {
    background: none;
    border: none;
    font-size: 18px;
    color: var(--color-ink-muted);
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-modal-close:hover {
    background: var(--color-bg-alt);
    color: var(--color-heading);
  }

  .modal-body {
    padding: 24px;
    font-size: 14px;
    color: var(--color-ink-muted);
    line-height: 1.65;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .modal-body a {
    color: var(--color-terracotta);
    font-weight: 600;
    text-decoration: underline;
  }

  .modal-foot {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 24px;
    border-top: 1px solid var(--color-border);
    background: var(--color-bg-alt);
  }

  /* ─── BANNIÈRE DE COOKIES RGPD ─────────────────────────────────────────── */
  .cookie-banner {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    max-width: 680px;
    margin: 0 auto;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 18px 22px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    z-index: 999;
  }

  .cookie-banner-wrap {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .cookie-banner-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--color-heading);
    margin-bottom: 4px;
    display: block;
  }

  .cookie-banner-desc {
    font-size: 12.5px;
    color: var(--color-ink-muted);
    line-height: 1.45;
  }

  .cookie-banner-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .btn-cookie-action {
    padding: 8px 16px;
    border-radius: var(--radius-full);
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
    border: none;
    transition: all 0.15s ease;
  }

  .btn-cookie-action.primary {
    background: var(--color-tanimbary);
    color: #FFFFFF;
  }

  .btn-cookie-action.primary:hover {
    background: var(--color-tanimbary-dark);
  }

  .btn-cookie-action.secondary {
    background: var(--color-bg-alt);
    color: var(--color-ink);
    border: 1px solid var(--color-border);
  }

  .btn-cookie-action.secondary:hover {
    border-color: var(--color-ink);
  }

  .btn-cookie-action.outline {
    background: transparent;
    color: var(--color-ink-muted);
    border: 1px solid var(--color-border);
  }

  .btn-cookie-action.outline:hover {
    color: var(--color-heading);
    border-color: var(--color-heading);
  }

  .btn-cookie-link {
    background: none;
    border: none;
    color: var(--color-ink-muted);
    font-size: 13.5px;
    cursor: pointer;
    padding: 0;
    text-align: left;
    font-family: inherit;
    transition: color 0.15s ease;
  }

  .btn-cookie-link:hover {
    color: var(--color-terracotta);
  }

  .cookie-pref-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid var(--color-border);
  }
`;
