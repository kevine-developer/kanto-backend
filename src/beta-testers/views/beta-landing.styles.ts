/**
 * Kanto MG — Styles de la Page d'Accueil & Parcours Bêta (Édition Culturelle Contemporaine)
 * - Grille éditoriale asymétrique, filets fins 1px, rayons contenus (0px-4px)
 * - Couleur signature Tany Mena (var(--color-accent)), accompagnement Vert végétal sourd (var(--color-sage))
 * - Zéro ombre diffuse, zéro pilule décorative, zéro dégradé SaaS
 */

import { PUBLIC_SHELL_CSS } from '../../common/web/public-layout.js';

export const BETA_LANDING_CSS = `
  ${PUBLIC_SHELL_CSS}

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
    transition: background-color var(--transition-base), color var(--transition-base);
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .editorial-divider-wrap {
    width: 100%;
    max-width: 1200px;
    padding: 0 16px;
  }

  @media (min-width: 768px) {
    .editorial-divider-wrap {
      padding: 0 32px;
    }
  }

  /* ─── SECTION HÉRO ÉDITORIALE ASYMÉTRIQUE ────────────────────────────────── */
  .section-editorial-hero {
    width: 100%;
    padding: 36px 16px 48px;
    display: flex;
    justify-content: center;
  }

  @media (min-width: 768px) {
    .section-editorial-hero {
      padding: 64px 32px 72px;
    }
  }

  .editorial-hero-grid {
    width: 100%;
    max-width: 1200px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 36px;
    align-items: start;
  }

  @media (min-width: 960px) {
    .editorial-hero-grid {
      grid-template-columns: 1.12fr 0.96fr;
      gap: 56px;
      align-items: start;
    }
  }

  .editorial-manifesto {
    display: flex;
    flex-direction: column;
    gap: 22px;
    text-align: left;
  }

  .editorial-kicker-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--color-border);
  }

  .editorial-kicker {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-accent);
  }

  .editorial-kicker::before {
    content: '';
    width: 18px;
    height: 1px;
    background: var(--color-accent);
  }

  .editorial-counter {
    font-size: 0.76rem;
    font-weight: 600;
    color: var(--color-ink-subtle);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .editorial-title {
    font-family: var(--font-serif);
    font-size: clamp(2.1rem, 5.2vw, 3.35rem);
    font-weight: 600;
    line-height: 1.1;
    color: var(--color-heading);
    letter-spacing: -0.025em;
    max-width: 18ch;
  }

  .editorial-lead {
    font-size: clamp(1rem, 1.5vw, 1.1rem);
    line-height: 1.68;
    color: var(--color-ink-muted);
    max-width: 58ch;
  }

  .editorial-guarantees {
    display: grid;
    grid-template-columns: 1fr;
    border-top: 1px solid var(--color-border);
    margin-top: 8px;
  }

  @media (min-width: 560px) {
    .editorial-guarantees {
      grid-template-columns: 1fr 1fr;
    }
  }

  .guarantee-item {
    padding: 16px 0;
    border-bottom: 1px solid var(--color-border-subtle);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  @media (min-width: 560px) {
    .guarantee-item:nth-child(odd) {
      padding-right: 20px;
    }
    .guarantee-item:nth-child(even) {
      padding-left: 20px;
      border-left: 1px solid var(--color-border-subtle);
    }
  }

  .guarantee-term {
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-heading);
  }

  .guarantee-desc {
    font-size: 0.88rem;
    line-height: 1.55;
    color: var(--color-ink-muted);
  }

  /* ─── PANNEAU D'ACCÈS AU PROGRAMME BÊTA ──────────────────────────────────── */
  .register-form-card {
    width: 100%;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-top: 3px solid var(--color-accent);
    border-radius: var(--radius-xs);
    padding: 22px 18px;
    text-align: left;
  }

  @media (min-width: 480px) {
    .register-form-card {
      padding: 26px 24px;
    }
  }

  @media (min-width: 768px) {
    .register-form-card {
      padding: 28px 30px;
    }
  }

  .register-card-head {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-bottom: 16px;
    margin-bottom: 18px;
    border-bottom: 1px solid var(--color-border-subtle);
  }

  .register-card-kicker {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.11em;
    color: var(--color-accent);
  }

  .register-card-title {
    font-family: var(--font-serif);
    font-size: 1.55rem;
    font-weight: 600;
    color: var(--color-heading);
    line-height: 1.2;
  }

  /* Bannières de retour serveur */
  .banner {
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    border-radius: var(--radius-xs);
    font-size: 0.88rem;
    font-weight: 500;
    line-height: 1.5;
    text-align: left;
    margin-bottom: 16px;
  }

  .banner svg {
    flex-shrink: 0;
    margin-top: 2px;
  }

  .banner-error {
    background: var(--color-error-bg);
    border: 1px solid var(--color-accent-border);
    border-left: 3px solid var(--color-error);
    color: var(--color-error-text);
  }

  .banner-success {
    background: var(--color-success-bg);
    border: 1px solid var(--color-sage-border);
    border-left: 3px solid var(--color-success);
    color: var(--color-success-text);
  }

  .clean-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .form-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .field-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-size: 0.86rem;
    font-weight: 600;
    color: var(--color-heading);
  }

  .label-required {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--color-accent);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .label-meta {
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--color-ink-subtle);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .field-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 13px;
    color: var(--color-ink-subtle);
    pointer-events: none;
  }

  .clean-input {
    width: 100%;
    height: 46px;
    padding: 10px 14px 10px 40px;
    font-family: var(--font-sans);
    font-size: 0.94rem;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xs);
    color: var(--color-ink);
    transition: border-color var(--transition-fast), background-color var(--transition-fast);
  }

  .clean-input:focus {
    outline: none;
    border-color: var(--color-accent);
    background: var(--color-surface-elevated);
  }

  .clean-input[aria-invalid="true"] {
    border-color: var(--color-error);
    background: var(--color-error-bg);
  }

  .field-caption {
    font-size: 0.78rem;
    color: var(--color-ink-subtle);
    line-height: 1.48;
  }

  .field-inline-error {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-error-text);
    line-height: 1.45;
  }

  /* Sélecteur de plateforme OS (Android vs iOS) */
  .platform-selector-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
  }

  @media (min-width: 480px) {
    .platform-selector-row {
      grid-template-columns: 1fr 1fr;
    }
  }

  .platform-btn {
    min-height: 52px;
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 10px 14px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xs);
    color: var(--color-ink);
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    transition: border-color var(--transition-fast), background-color var(--transition-fast);
  }

  .platform-btn:hover {
    border-color: var(--color-border-strong);
    background: var(--color-surface-hover);
  }

  .platform-btn.checked {
    border-color: var(--color-accent);
    background: var(--color-accent-soft);
    color: var(--color-heading);
  }

  .platform-btn.checked svg {
    color: var(--color-accent);
  }

  .platform-btn-label {
    font-size: 0.9rem;
    font-weight: 600;
    display: block;
    line-height: 1.2;
  }

  .platform-btn-sub {
    font-size: 0.72rem;
    color: var(--color-ink-muted);
    display: block;
    margin-top: 2px;
  }

  /* Parcours direct Android */
  .android-group-panel {
    width: 100%;
  }

  .android-group-callout {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 18px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xs);
  }

  .android-group-head {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .android-group-title {
    margin: 0;
    font-family: var(--font-serif);
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-heading);
    line-height: 1.28;
  }

  .android-group-desc {
    margin: 0;
    font-size: 0.88rem;
    color: var(--color-ink-muted);
    line-height: 1.55;
  }

  .android-steps-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .android-steps-list li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .android-step-index {
    font-family: var(--font-serif);
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-accent);
    padding-top: 6px;
    min-width: 24px;
    flex-shrink: 0;
  }

  .android-step-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .android-step-title {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--color-heading);
  }

  /* Consentement explicite RGPD */
  .consent-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .consent-label {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 0.82rem;
    color: var(--color-ink-muted);
    cursor: pointer;
    line-height: 1.5;
  }

  .consent-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    margin-top: 2px;
    accent-color: var(--color-accent);
    cursor: pointer;
    flex-shrink: 0;
  }

  .link-inline {
    background: none;
    border: none;
    padding: 0;
    font-family: inherit;
    font-size: inherit;
    font-weight: 600;
    color: var(--color-accent);
    text-decoration: underline;
    cursor: pointer;
  }

  .submit-wrap {
    display: flex;
    flex-direction: column;
  }

  .btn-primary-action {
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 20px;
    background: var(--color-btn-primary);
    border: 1px solid var(--color-accent);
    border-radius: var(--radius-xs);
    color: #FAF9F6;
    font-family: var(--font-sans);
    font-size: 0.94rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: background-color var(--transition-fast), border-color var(--transition-fast);
  }

  .btn-primary-action:hover:not(:disabled) {
    background: var(--color-btn-primary-hover);
    border-color: var(--color-accent);
  }

  .btn-primary-action:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .already-registered-hint {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
    font-size: 0.82rem;
    color: var(--color-ink-muted);
    padding-top: 12px;
    border-top: 1px solid var(--color-border-subtle);
  }

  .link-hint {
    color: var(--color-accent);
    font-weight: 600;
    text-decoration: none;
  }

  .link-hint:hover {
    text-decoration: underline;
  }

  /* ─── SECTION TÉLÉCHARGEMENT DIRECT DES STORES ───────────────────────────── */
  .section-step {
    width: 100%;
    padding: 52px 16px 64px;
    display: flex;
    justify-content: center;
  }

  @media (min-width: 768px) {
    .section-step {
      padding: 68px 32px 80px;
    }
  }

  .step-container {
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .step-header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--color-border);
  }

  @media (min-width: 860px) {
    .step-header {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      gap: 40px;
    }
  }

  .step-header-left {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .step-title {
    font-family: var(--font-serif);
    font-size: clamp(1.7rem, 4vw, 2.3rem);
    font-weight: 600;
    color: var(--color-heading);
    line-height: 1.18;
    letter-spacing: -0.025em;
  }

  .step-subtitle {
    font-size: 0.94rem;
    color: var(--color-ink-muted);
    line-height: 1.6;
    max-width: 48ch;
  }

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

  .store-kanto-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xs);
    padding: 22px 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 22px;
    transition: border-color var(--transition-fast);
  }

  @media (min-width: 480px) {
    .store-kanto-card {
      padding: 26px 24px;
    }
  }

  .store-kanto-card.is-detected {
    border-color: var(--color-accent);
    border-top-width: 3px;
  }

  .store-kanto-card-body {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .store-kanto-header {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .store-platform-icon {
    width: 42px;
    height: 42px;
    border-radius: var(--radius-xs);
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
    min-width: 0;
  }

  .store-channel-tag {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-ink-subtle);
  }

  .store-platform-title {
    font-family: var(--font-serif);
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-heading);
    line-height: 1.2;
  }

  .badge-recommended {
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 3px 8px;
    border-radius: var(--radius-xs);
    background: var(--color-accent-soft);
    color: var(--color-accent);
    border: 1px solid var(--color-accent-border);
    white-space: nowrap;
  }

  .store-kanto-desc {
    font-size: 0.92rem;
    color: var(--color-ink-muted);
    line-height: 1.6;
  }

  .store-kanto-specs {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 18px;
    padding-top: 8px;
    border-top: 1px solid var(--color-border-subtle);
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--color-ink-muted);
  }

  .store-kanto-footer {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .store-steps-flow {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .btn-store-step {
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 14px;
    border-radius: var(--radius-xs);
    text-decoration: none;
    font-family: var(--font-sans);
    font-size: 0.86rem;
    font-weight: 600;
    transition: background-color var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
  }

  .btn-store-step .step-num {
    font-family: var(--font-serif);
    font-size: 0.86rem;
    font-weight: 600;
    min-width: 22px;
    flex-shrink: 0;
  }

  .btn-store-step .step-label {
    flex: 1;
    text-align: left;
  }

  .btn-store-step.outline {
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    color: var(--color-ink);
  }

  .btn-store-step.outline .step-num {
    color: var(--color-ink-subtle);
  }

  .btn-store-step.outline:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-border-strong);
  }

  .btn-store-step.primary {
    background: var(--color-btn-primary);
    color: #FAF9F6;
    border: 1px solid var(--color-accent);
  }

  .btn-store-step.primary .step-num {
    color: rgba(250, 249, 246, 0.85);
  }

  .btn-store-step.primary:hover {
    background: var(--color-btn-primary-hover);
    border-color: var(--color-accent);
  }

  /* ─── SECTION FAQ ÉDITORIALE (2 COLONNES SUR DESKTOP) ────────────────────── */
  .section-faq {
    width: 100%;
    padding: 56px 16px 68px;
    display: flex;
    justify-content: center;
    border-top: 1px solid var(--color-border);
  }

  @media (min-width: 768px) {
    .section-faq {
      padding: 76px 32px 88px;
    }
  }

  .faq-container {
    width: 100%;
    max-width: 1200px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 28px;
    align-items: start;
  }

  @media (min-width: 900px) {
    .faq-container {
      grid-template-columns: 0.78fr 1.4fr;
      gap: 56px;
    }
  }

  .faq-intro {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .faq-title {
    font-family: var(--font-serif);
    font-size: clamp(1.7rem, 4vw, 2.25rem);
    font-weight: 600;
    color: var(--color-heading);
    line-height: 1.18;
    letter-spacing: -0.025em;
  }

  .faq-lead {
    font-size: 0.94rem;
    line-height: 1.62;
    color: var(--color-ink-muted);
    max-width: 36ch;
  }

  .faq-list {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--color-border);
  }

  .faq-card {
    border-bottom: 1px solid var(--color-border);
    background: transparent;
  }

  .faq-summary {
    min-height: 52px;
    padding: 16px 4px;
    font-size: 0.98rem;
    font-weight: 600;
    color: var(--color-heading);
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    user-select: none;
    transition: color var(--transition-fast);
  }

  .faq-summary:hover {
    color: var(--color-accent);
  }

  .faq-summary::-webkit-details-marker {
    display: none;
  }

  .faq-chevron {
    color: var(--color-ink-subtle);
    transition: transform var(--transition-fast);
    flex-shrink: 0;
  }

  .faq-card[open] .faq-chevron {
    transform: rotate(180deg);
    color: var(--color-accent);
  }

  .faq-body {
    padding: 0 4px 18px;
    font-size: 0.93rem;
    color: var(--color-ink-muted);
    line-height: 1.68;
    max-width: 68ch;
  }

  /* ─── BANDEAU COOKIES & MODALES ÉDITORIALES ──────────────────────────────── */
  .cookie-banner {
    position: fixed;
    bottom: 16px;
    left: 16px;
    right: 16px;
    max-width: 540px;
    margin: 0 auto;
    background: var(--color-surface);
    border: 1px solid var(--color-border-strong);
    border-top: 2px solid var(--color-accent);
    border-radius: var(--radius-xs);
    padding: 18px 20px;
    z-index: 999;
  }

  .cookie-banner-wrap {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .cookie-banner-title {
    font-family: var(--font-serif);
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--color-heading);
    display: block;
    margin-bottom: 4px;
  }

  .cookie-banner-desc {
    font-size: 0.84rem;
    color: var(--color-ink-muted);
    line-height: 1.5;
  }

  .cookie-banner-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .btn-cookie {
    min-height: 44px;
    padding: 9px 16px;
    font-family: inherit;
    font-size: 0.84rem;
    font-weight: 600;
    border-radius: var(--radius-xs);
    cursor: pointer;
    border: 1px solid transparent;
    transition: background-color var(--transition-fast), border-color var(--transition-fast);
  }

  .btn-cookie.primary {
    background: var(--color-btn-primary);
    border-color: var(--color-accent);
    color: #FAF9F6;
  }

  .btn-cookie.primary:hover {
    background: var(--color-btn-primary-hover);
    border-color: var(--color-accent);
  }

  .btn-cookie.secondary {
    background: var(--color-bg-alt);
    border-color: var(--color-border);
    color: var(--color-ink);
  }

  .btn-cookie.secondary:hover {
    background: var(--color-surface-hover);
  }

  .btn-cookie.outline {
    background: transparent;
    border: 1px solid var(--color-border);
    color: var(--color-ink-muted);
  }

  .btn-cookie.outline:hover {
    border-color: var(--color-border-strong);
    color: var(--color-ink);
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(13, 13, 11, 0.72);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 1000;
  }

  .modal-dialog {
    width: 100%;
    max-width: 520px;
    max-height: 92vh;
    overflow-y: auto;
    background: var(--color-surface);
    border: 1px solid var(--color-border-strong);
    border-top: 3px solid var(--color-accent);
    border-radius: var(--radius-xs);
    display: flex;
    flex-direction: column;
  }

  .modal-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 20px;
    border-bottom: 1px solid var(--color-border-subtle);
  }

  @media (min-width: 480px) {
    .modal-head {
      padding: 20px 24px;
    }
  }

  .modal-head h3 {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-heading);
    line-height: 1.25;
  }

  .confirmed-kicker {
    display: block;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-sage);
    margin-bottom: 4px;
  }

  .btn-modal-close {
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xs);
    min-width: 44px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: var(--color-ink-muted);
    cursor: pointer;
    flex-shrink: 0;
  }

  .btn-modal-close:hover {
    color: var(--color-heading);
    border-color: var(--color-border-strong);
    background: var(--color-surface-hover);
  }

  .modal-body {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    font-size: 0.92rem;
    color: var(--color-ink-muted);
    line-height: 1.62;
  }

  .modal-body a {
    color: var(--color-accent);
    font-weight: 600;
    text-decoration: underline;
  }

  .confirmed-notice {
    padding: 14px 16px;
    background: var(--color-bg-alt);
    border: 1px solid var(--color-border);
    border-left: 3px solid var(--color-accent);
    color: var(--color-ink);
    font-size: 0.9rem;
    line-height: 1.58;
  }

  .confirmed-steps {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 0.88rem;
    color: var(--color-ink-muted);
  }

  .cookie-pref-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 14px;
    background: var(--color-bg);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-xs);
    font-size: 0.86rem;
    color: var(--color-ink);
  }

  .badge-status {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-sage);
  }

  .modal-foot {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 10px;
    padding: 16px 24px;
    border-top: 1px solid var(--color-border-subtle);
    background: var(--color-bg);
  }
`;
