/**
 * Kanto MG — Styles du Portail Officiel et Vitrine des Testeurs
 * Direction artistique : Minimaliste, moderne, épurée et raffinée
 * - Palette authentique malgache (Ivoire chaud, Noir encre, Vert Tanimbary, Ocre doré, Terracotta)
 * - Typographie Newsreader (titrage noble) + Plus Jakarta Sans (interface contemporaine)
 * - Composants tactiles (≥ 44px), transitions fluides, contrastes soignés
 * - Zéro artifice superflu / Zéro icône Sparkles
 */

export const BETA_LANDING_CSS = `
  /* ─── TOKENS DU DESIGN SYSTEM KANTO ────────────────────────────────────────── */
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
    line-height: 1.6;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    transition: background-color 0.25s ease, color 0.25s ease;
  }

  /* ─── EN-TÊTE ÉPURÉ ──────────────────────────────────────────────────────── */
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
      padding: 14px 40px;
    }
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: var(--color-ink);
  }

  .brand-logo-wrap {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .brand-logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .brand-text-wrap {
    display: flex;
    flex-direction: column;
  }

  .brand-name {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.1;
    color: var(--color-heading);
    letter-spacing: -0.02em;
  }

  .brand-domain {
    color: var(--color-ochre);
    font-weight: 500;
  }

  .brand-tag {
    font-size: 0.72rem;
    color: var(--color-ink-muted);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .header-nav {
    display: none;
    align-items: center;
    gap: 28px;
  }

  @media (min-width: 768px) {
    .header-nav {
      display: flex;
    }
  }

  .header-nav-link {
    text-decoration: none;
    color: var(--color-ink-muted);
    font-size: 0.92rem;
    font-weight: 500;
    transition: color 0.15s ease;
  }

  .header-nav-link:hover {
    color: var(--color-tanimbary);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .theme-toggle-btn {
    width: 40px;
    height: 40px;
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

  .theme-toggle-btn:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-ink-subtle);
  }

  .header-cta-btn {
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 18px;
    font-size: 0.88rem;
    font-weight: 600;
    color: #FFFFFF;
    background: var(--color-tanimbary);
    border-radius: var(--radius-md);
    transition: background-color 0.15s ease, transform 0.1s ease;
  }

  .header-cta-btn:hover {
    background: var(--color-tanimbary-dark);
    transform: translateY(-1px);
  }

  /* ─── CONTENEURS PRINCIPAUX ──────────────────────────────────────────────── */
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  /* ─── PILIER A : SECTION HÉROS & INSCRIPTION ─────────────────────────────── */
  .section-hero-register {
    width: 100%;
    padding: 48px 20px 40px;
    display: flex;
    justify-content: center;
    background: radial-gradient(circle at 50% 0%, var(--color-tanimbary-soft) 0%, transparent 70%);
  }

  @media (min-width: 768px) {
    .section-hero-register {
      padding: 72px 32px 56px;
    }
  }

  .hero-container {
    width: 100%;
    max-width: 680px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 28px;
  }

  .hero-intro {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .eyebrow-pill {
    font-size: 0.78rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 4px 12px;
    border-radius: var(--radius-full);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-tanimbary);
  }

  .eyebrow-counter {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--color-ink-muted);
  }

  .hero-title {
    font-family: var(--font-serif);
    font-size: 2.2rem;
    font-weight: 600;
    line-height: 1.2;
    color: var(--color-heading);
    letter-spacing: -0.025em;
  }

  @media (min-width: 768px) {
    .hero-title {
      font-size: 2.85rem;
    }
  }

  .hero-subtitle {
    font-size: 1.05rem;
    line-height: 1.6;
    color: var(--color-ink-muted);
    max-width: 580px;
  }

  /* ─── BANNIÈRES DE RETOUR ────────────────────────────────────────────────── */
  .banner {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 18px;
    border-radius: var(--radius-md);
    font-size: 0.92rem;
    font-weight: 500;
    text-align: left;
    transition: all 0.2s ease;
  }

  .banner-error {
    background: var(--color-error-bg);
    border: 1px solid var(--color-error);
    color: var(--color-error-text);
  }

  .banner-success {
    background: var(--color-success-bg);
    border: 1px solid var(--color-success);
    color: var(--color-success-text);
  }

  /* ─── ENCART DYNAMIQUE POST-INSCRIPTION ──────────────────────────────────── */
  .registration-feedback-card {
    width: 100%;
    background: var(--color-surface);
    border: 1.5px solid var(--color-tanimbary-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--color-card-shadow);
    padding: 24px;
    text-align: left;
    animation: fadeInScale 0.3s ease;
  }

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .feedback-card-inner {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .feedback-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: var(--radius-full);
    background: var(--color-tanimbary-soft);
    color: var(--color-tanimbary);
    font-size: 0.78rem;
    font-weight: 600;
    width: fit-content;
  }

  .feedback-card-title {
    font-family: var(--font-serif);
    font-size: 1.35rem;
    font-weight: 600;
    color: var(--color-heading);
    line-height: 1.3;
  }

  .feedback-card-desc {
    font-size: 0.95rem;
    color: var(--color-ink-muted);
    line-height: 1.55;
  }

  .feedback-card-desc strong {
    color: var(--color-ink);
  }

  .feedback-actions-quick {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 6px;
  }

  @media (min-width: 540px) {
    .feedback-actions-quick {
      flex-direction: row;
    }
  }

  .btn-step-jump {
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 18px;
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    font-weight: 600;
    transition: background-color 0.15s ease, transform 0.1s ease;
  }

  .btn-step-jump.primary {
    background: var(--color-tanimbary);
    color: #FFFFFF;
  }

  .btn-step-jump.primary:hover {
    background: var(--color-tanimbary-dark);
    transform: translateY(-1px);
  }

  .btn-step-jump.secondary {
    background: var(--color-bg-alt);
    color: var(--color-ink);
    border: 1px solid var(--color-border);
  }

  .btn-step-jump.secondary:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-ink-subtle);
  }

  /* ─── CARTE FORMULAIRE D'INSCRIPTION ÉPURÉ ───────────────────────────────── */
  .register-form-card {
    width: 100%;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--color-card-shadow);
    padding: 24px;
    text-align: left;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  @media (min-width: 768px) {
    .register-form-card {
      padding: 32px;
    }
  }

  .clean-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-grid {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .field-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--color-heading);
  }

  .label-required {
    font-size: 0.74rem;
    font-weight: 500;
    color: var(--color-tanimbary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .field-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 14px;
    color: var(--color-ink-subtle);
    pointer-events: none;
  }

  .clean-input {
    width: 100%;
    height: 48px;
    padding: 10px 16px 10px 42px;
    font-family: var(--font-sans);
    font-size: 0.96rem;
    background: var(--color-bg);
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-ink);
    transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
  }

  .clean-input:focus {
    outline: none;
    border-color: var(--color-tanimbary);
    background: var(--color-surface);
    box-shadow: 0 0 0 3px var(--color-tanimbary-soft);
  }

  .field-caption {
    font-size: 0.78rem;
    color: var(--color-ink-subtle);
    line-height: 1.4;
  }

  .platform-selector-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .platform-btn {
    min-height: 54px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    background: var(--color-bg);
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-ink);
    cursor: pointer;
    text-align: left;
    transition: all 0.15s ease;
  }

  .platform-btn:hover {
    border-color: var(--color-ink-subtle);
    background: var(--color-surface-hover);
  }

  .platform-btn.checked {
    border-color: var(--color-tanimbary);
    background: var(--color-tanimbary-soft);
    color: var(--color-tanimbary-dark);
  }

  [data-theme="dark"] .platform-btn.checked {
    color: var(--color-tanimbary);
  }

  .platform-btn-label {
    font-size: 0.94rem;
    font-weight: 600;
    display: block;
    line-height: 1.2;
  }

  .platform-btn-sub {
    font-size: 0.72rem;
    color: var(--color-ink-muted);
    display: block;
  }

  .consent-row {
    padding-top: 4px;
  }

  .consent-label {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 0.82rem;
    color: var(--color-ink-muted);
    cursor: pointer;
    line-height: 1.45;
  }

  .consent-label input[type="checkbox"] {
    width: 17px;
    height: 17px;
    margin-top: 2px;
    accent-color: var(--color-tanimbary);
    cursor: pointer;
    flex-shrink: 0;
  }

  .link-inline {
    background: none;
    border: none;
    padding: 0;
    font-family: inherit;
    font-size: inherit;
    color: var(--color-tanimbary);
    text-decoration: underline;
    cursor: pointer;
  }

  .submit-wrap {
    display: flex;
    flex-direction: column;
  }

  .btn-primary-action {
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 24px;
    background: var(--color-tanimbary);
    border: none;
    border-radius: var(--radius-md);
    color: #FFFFFF;
    font-family: var(--font-sans);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
  }

  .btn-primary-action:hover {
    background: var(--color-tanimbary-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(74, 103, 65, 0.25);
  }

  .btn-primary-action:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .already-registered-hint {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    flex-wrap: wrap;
    font-size: 0.84rem;
    color: var(--color-ink-muted);
    padding-top: 6px;
    border-top: 1px solid var(--color-border-subtle);
  }

  .link-hint {
    color: var(--color-tanimbary);
    font-weight: 600;
    text-decoration: none;
    transition: text-decoration 0.15s ease;
  }

  .link-hint:hover {
    text-decoration: underline;
  }

  /* ─── SECTIONS PARCOURS ÉTAPE 1 ET ÉTAPE 2 ───────────────────────────────── */
  .section-step {
    width: 100%;
    padding: 56px 20px;
    display: flex;
    justify-content: center;
    border-top: 1px solid var(--color-border);
  }

  @media (min-width: 768px) {
    .section-step {
      padding: 72px 32px;
    }
  }

  .section-download-step {
    background: var(--color-bg-alt);
  }

  .step-container {
    width: 100%;
    max-width: 960px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 36px;
  }

  .step-header {
    text-align: center;
    max-width: 640px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .step-number-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 14px;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-radius: var(--radius-full);
    background: var(--color-tanimbary-soft);
    color: var(--color-tanimbary);
    border: 1px solid var(--color-tanimbary-border);
  }

  .step-number-badge.accent {
    background: var(--color-ochre-soft);
    color: var(--color-ochre);
    border-color: var(--color-ochre-border);
  }

  .step-title {
    font-family: var(--font-serif);
    font-size: 1.85rem;
    font-weight: 600;
    color: var(--color-heading);
    line-height: 1.25;
    letter-spacing: -0.02em;
  }

  @media (min-width: 768px) {
    .step-title {
      font-size: 2.25rem;
    }
  }

  .step-subtitle {
    font-size: 0.98rem;
    color: var(--color-ink-muted);
    line-height: 1.55;
  }

  .step-subtitle strong {
    color: var(--color-ink);
  }

  /* ─── GRILLE DE CARTES 2 COLONNES ────────────────────────────────────────── */
  .cards-duo-grid {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  @media (min-width: 768px) {
    .cards-duo-grid {
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
  }

  /* ─── CARTES DE TÉLÉCHARGEMENT DIRECT KANTO MG ───────────────────────────── */
  .store-kanto-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--color-card-shadow);
    padding: 26px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 22px;
    position: relative;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .store-kanto-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--color-card-shadow-hover);
    border-color: var(--color-divider);
  }

  .store-kanto-card.is-detected {
    border-color: var(--color-tanimbary);
    box-shadow: 0 0 0 1px var(--color-tanimbary), var(--color-card-shadow);
  }

  .store-kanto-card-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .store-kanto-header {
    display: flex;
    align-items: center;
    gap: 14px;
    position: relative;
  }

  .store-platform-icon {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-md);
    background: var(--color-bg-alt);
    color: var(--color-ink);
    border: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .store-platform-meta {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .store-channel-tag {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-ink-subtle);
  }

  .store-platform-title {
    font-family: var(--font-serif);
    font-size: 1.35rem;
    font-weight: 600;
    color: var(--color-heading);
    line-height: 1.25;
  }

  .badge-recommended {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 3px 9px;
    border-radius: var(--radius-full);
    background: var(--color-tanimbary-soft);
    color: var(--color-tanimbary);
    border: 1px solid var(--color-tanimbary-border);
    white-space: nowrap;
  }

  .store-kanto-desc {
    font-size: 0.9rem;
    color: var(--color-ink-muted);
    line-height: 1.55;
  }

  .store-kanto-specs {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding-top: 4px;
  }

  .spec-item {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--color-ink-muted);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .spec-item svg {
    color: var(--color-tanimbary);
    flex-shrink: 0;
  }

  .store-kanto-footer {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 4px;
  }

  .btn-download-kanto {
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 20px;
    border-radius: var(--radius-md);
    text-decoration: none;
    font-family: var(--font-sans);
    font-size: 0.92rem;
    font-weight: 600;
    background: var(--color-tanimbary);
    color: #FFFFFF;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(74, 103, 65, 0.18);
  }

  [data-theme="dark"] .btn-download-kanto {
    background: var(--color-tanimbary);
    color: #0D0D0B;
    font-weight: 700;
    box-shadow: 0 4px 14px rgba(107, 158, 97, 0.25);
  }

  .btn-download-kanto:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(74, 103, 65, 0.28);
  }

  .btn-download-kanto svg {
    transition: transform 0.15s ease;
  }

  .btn-download-kanto:hover svg {
    transform: translate(2px, -2px);
  }

  /* ─── CARTE QR CODE SCANNABLE SUR GRAND ÉCRAN ────────────────────────────── */
  .desktop-qr-card {
    display: none;
    align-items: center;
    gap: 24px;
    padding: 22px 28px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--color-card-shadow);
    margin-top: 24px;
  }

  @media (min-width: 768px) {
    .desktop-qr-card {
      display: flex;
    }
  }

  .qr-visual {
    flex-shrink: 0;
  }

  .qr-code-frame {
    background: #FFFFFF;
    padding: 8px;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .qr-code-frame svg {
    display: block;
    width: 104px;
    height: 104px;
  }

  .qr-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .qr-eyebrow {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-tanimbary);
  }

  .qr-heading {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-heading);
    line-height: 1.3;
  }

  .qr-text {
    font-size: 0.86rem;
    color: var(--color-ink-muted);
    line-height: 1.5;
    max-width: 480px;
  }

  .qr-domain-hint {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-ink-subtle);
    margin-top: 6px;
  }

  .qr-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-tanimbary);
  }

  /* ─── SECTION QUESTIONS FRÉQUENTES ───────────────────────────────────────── */
  .section-faq {
    width: 100%;
    padding: 56px 20px;
    display: flex;
    justify-content: center;
    border-top: 1px solid var(--color-border);
  }

  @media (min-width: 768px) {
    .section-faq {
      padding: 72px 32px;
    }
  }

  .faq-container {
    width: 100%;
    max-width: 680px;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .faq-title {
    font-family: var(--font-serif);
    font-size: 1.85rem;
    font-weight: 600;
    color: var(--color-heading);
    text-align: center;
    letter-spacing: -0.02em;
  }

  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .faq-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: border-color 0.15s ease;
  }

  .faq-card[open] {
    border-color: var(--color-tanimbary-border);
  }

  .faq-summary {
    padding: 16px 20px;
    font-size: 0.96rem;
    font-weight: 600;
    color: var(--color-heading);
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    user-select: none;
  }

  .faq-summary::-webkit-details-marker {
    display: none;
  }

  .faq-chevron {
    color: var(--color-ink-subtle);
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  .faq-card[open] .faq-chevron {
    transform: rotate(180deg);
  }

  .faq-body {
    padding: 0 20px 18px;
    font-size: 0.9rem;
    color: var(--color-ink-muted);
    line-height: 1.6;
  }

  /* ─── PIED DE PAGE ───────────────────────────────────────────────────────── */
  .site-footer {
    width: 100%;
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    padding: 48px 20px 32px;
    display: flex;
    justify-content: center;
  }

  @media (min-width: 768px) {
    .site-footer {
      padding: 64px 32px 36px;
    }
  }

  .footer-container {
    width: 100%;
    max-width: 960px;
    display: flex;
    flex-direction: column;
    gap: 36px;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
  }

  @media (min-width: 768px) {
    .footer-grid {
      grid-template-columns: 2fr 1fr 1fr;
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
    max-width: 360px;
  }

  .footer-links-col {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .footer-heading {
    font-size: 0.76rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-ink-subtle);
    margin-bottom: 2px;
  }

  .footer-links-col a,
  .btn-text-link {
    text-decoration: none;
    font-size: 0.88rem;
    color: var(--color-ink-muted);
    background: none;
    border: none;
    padding: 0;
    text-align: left;
    font-family: inherit;
    cursor: pointer;
    transition: color 0.15s ease;
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
    }
  }

  /* ─── MODALES ET BANNIÈRE COOKIES RGPD ──────────────────────────────────── */
  .cookie-banner {
    position: fixed;
    bottom: 16px;
    left: 16px;
    right: 16px;
    max-width: 520px;
    margin: 0 auto;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.2);
    padding: 18px 20px;
    z-index: 999;
  }

  .cookie-banner-wrap {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .cookie-banner-title {
    font-size: 0.94rem;
    font-weight: 600;
    color: var(--color-heading);
  }

  .cookie-banner-desc {
    font-size: 0.82rem;
    color: var(--color-ink-muted);
    line-height: 1.45;
  }

  .cookie-banner-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .btn-cookie {
    padding: 6px 14px;
    font-size: 0.82rem;
    font-weight: 600;
    border-radius: var(--radius-sm);
    cursor: pointer;
    border: none;
    transition: all 0.15s ease;
  }

  .btn-cookie.primary {
    background: var(--color-tanimbary);
    color: #FFFFFF;
  }

  .btn-cookie.primary:hover {
    background: var(--color-tanimbary-dark);
  }

  .btn-cookie.secondary {
    background: var(--color-bg-alt);
    color: var(--color-ink);
  }

  .btn-cookie.outline {
    background: transparent;
    border: 1px solid var(--color-border);
    color: var(--color-ink-muted);
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 1000;
  }

  .modal-dialog {
    width: 100%;
    max-width: 500px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px;
    border-bottom: 1px solid var(--color-border);
  }

  .modal-head h3 {
    font-family: var(--font-serif);
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--color-heading);
  }

  .btn-modal-close {
    background: none;
    border: none;
    font-size: 1.1rem;
    color: var(--color-ink-muted);
    cursor: pointer;
  }

  .modal-body {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    font-size: 0.9rem;
    color: var(--color-ink-muted);
    line-height: 1.55;
  }

  .modal-body a {
    color: var(--color-tanimbary);
    text-decoration: underline;
  }

  .cookie-pref-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: var(--color-bg);
    border-radius: var(--radius-md);
  }

  .badge-status {
    font-size: 0.72rem;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: var(--radius-full);
    background: var(--color-tanimbary-soft);
    color: var(--color-tanimbary);
  }

  .modal-foot {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 24px;
    border-top: 1px solid var(--color-border);
    background: var(--color-bg);
  }
`;
