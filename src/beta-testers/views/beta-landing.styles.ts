/**
 * Kanto MG — Styles du Portail Officiel et Vitrine des Testeurs
 * Direction artistique : Minimaliste, moderne, épurée et raffinée
 * - Palette authentique malgache (Ivoire chaud, Noir encre, Vert Tanimbary, Ocre doré, Terracotta)
 * - Typographie Newsreader (titrage noble) + Plus Jakarta Sans (interface contemporaine)
 * - Composants tactiles (≥ 44px), transitions fluides, contrastes soignés
 * - Zéro artifice superflu / Zéro icône Sparkles
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
    line-height: 1.6;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    transition: background-color 0.25s ease, color 0.25s ease;
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
    font-size: clamp(1.85rem, 6.2vw, 2.85rem);
    font-weight: 600;
    line-height: 1.2;
    color: var(--color-heading);
    letter-spacing: -0.025em;
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
    padding: 20px 16px;
    text-align: left;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  @media (min-width: 480px) {
    .register-form-card {
      padding: 24px;
    }
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
    grid-template-columns: 1fr;
    gap: 12px;
  }

  @media (min-width: 480px) {
    .platform-selector-row {
      grid-template-columns: 1fr 1fr;
    }
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
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
  }

  .android-group-panel {
    width: 100%;
  }

  .android-group-callout {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .android-group-head {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .android-group-title {
    margin: 0;
    font-family: var(--font-serif);
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--color-heading);
    line-height: 1.3;
  }

  .android-group-desc {
    margin: 0;
    font-size: 0.9rem;
    color: var(--color-ink-muted);
    line-height: 1.55;
  }

  .android-group-steps {
    display: flex;
    flex-direction: column;
    gap: 10px;
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
    padding: 20px 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
    position: relative;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }

  @media (min-width: 480px) {
    .store-kanto-card {
      padding: 26px 24px;
      gap: 22px;
    }
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
    gap: 10px;
    padding-top: 4px;
  }

  .store-steps-flow {
    display: flex;
    flex-direction: column;
    gap: 9px;
    width: 100%;
  }

  .btn-store-step {
    min-height: 46px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    padding: 10px 16px;
    border-radius: var(--radius-md);
    text-decoration: none;
    font-family: var(--font-sans);
    font-size: 0.88rem;
    font-weight: 600;
    transition: all 0.2s ease;
    position: relative;
  }

  .btn-store-step .step-num {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .btn-store-step .step-label {
    flex: 1;
    text-align: left;
  }

  .btn-store-step svg {
    flex-shrink: 0;
    transition: transform 0.15s ease;
  }

  .btn-store-step:hover svg {
    transform: translate(2px, -2px);
  }

  /* Étape 1 : Lien d'acceptation / confirmation chez Google ou Apple (Outline noble) */
  .btn-store-step.outline {
    background: var(--color-bg-alt);
    border: 1px solid var(--color-border);
    color: var(--color-ink);
  }

  .btn-store-step.outline .step-num {
    background: var(--color-surface);
    color: var(--color-ink-muted);
    border: 1px solid var(--color-border);
  }

  .btn-store-step.outline:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-ink-subtle);
    color: var(--color-heading);
    transform: translateY(-1px);
  }

  /* Étape 2 : Bouton principal de téléchargement (Vert Tanimbary signature) */
  .btn-store-step.primary {
    background: var(--color-tanimbary);
    color: #FFFFFF;
    border: 1px solid transparent;
    box-shadow: 0 2px 8px rgba(74, 103, 65, 0.18);
  }

  .btn-store-step.primary .step-num {
    background: rgba(255, 255, 255, 0.25);
    color: #FFFFFF;
  }

  [data-theme="dark"] .btn-store-step.primary {
    background: var(--color-tanimbary);
    color: #0D0D0B;
    font-weight: 700;
    box-shadow: 0 4px 14px rgba(107, 158, 97, 0.25);
  }

  [data-theme="dark"] .btn-store-step.primary .step-num {
    background: rgba(0, 0, 0, 0.22);
    color: #0D0D0B;
  }

  .btn-store-step.primary:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(74, 103, 65, 0.28);
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
    min-height: 44px;
    padding: 10px 14px;
    font-size: 0.84rem;
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
    max-height: 92vh;
    overflow-y: auto;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
  }

  .modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    border-bottom: 1px solid var(--color-border);
  }

  @media (min-width: 480px) {
    .modal-head {
      padding: 18px 24px;
    }
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
    min-width: 44px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
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
    flex-wrap: wrap;
    gap: 10px;
    padding: 16px 20px;
    border-top: 1px solid var(--color-border);
    background: var(--color-bg);
  }
`;
