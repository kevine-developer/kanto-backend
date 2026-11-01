/**
 * Kanto MG — Page dédiée au signalement de bugs et retours bêta-testeurs.
 * Accessible publiquement via /feedback, /bug-report, /signaler-bug ou /retours.
 *
 * Design System officiel Kanto MG (Terre & Encre) :
 * - Vert Tanimbary (#6B9E61 / #16442A), Ocre (#C58B38), Terracotta (#C0392B)
 * - Typographie Plus Jakarta Sans
 * - Recommandation forte du DeepLink kantomg://feedback vers l'application mobile
 * - Formulaire web complet alternatif en cas d'impossibilité d'utiliser l'application
 * - Chiffrement AES-256-GCM des adresses e-mail au repos et respect strict du RGPD
 */

export interface BugReportPageOptions {
  initialType?: string;
  initialPlatform?: string;
  initialEmail?: string;
  supportEmail?: string;
}

export function renderBugReportPage(options?: BugReportPageOptions): string {
  const currentYear = new Date().getFullYear();
  const supportEmail =
    options?.supportEmail || process.env.SUPPORT_EMAIL || 'support@kanto.mg';
  const initialType = (options?.initialType || 'BUG').toUpperCase();
  const initialPlatform = (options?.initialPlatform || 'ANDROID').toUpperCase();
  const initialEmail = options?.initialEmail || '';

  const legalBaseUrl =
    process.env.NATIVE_APP_URL ||
    process.env.PUBLIC_WEB_URL ||
    process.env.APP_URL ||
    'https://app-kanto.gastsar.fr';

  return `<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Signaler une anomalie ou un bug • Kanto MG</title>
  <meta name="description" content="Espace officiel de signalement de bugs et de retours d'expérience pour l'application Kanto MG. Aidez-nous à perfectionner le sanctuaire culturel malgache.">
  <meta name="theme-color" content="#0D0D0B">

  <!-- Open Graph -->
  <meta property="og:title" content="Signaler une anomalie • Kanto MG">
  <meta property="og:description" content="Partagez vos retours et anomalies techniques pour améliorer l'application Kanto MG.">
  <meta property="og:type" content="website">

  <!-- Favicon & Typographie -->
  <link rel="icon" href="/favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

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

  <style>
    @font-face {
      font-family: 'LazyDog';
      src: url('/fonts/LazyDog.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    :root, [data-theme="dark"] {
      --color-bg: #0D0D0B;
      --color-surface: #141412;
      --color-surface-input: #1C1C1A;
      --color-surface-hover: #1E1E1B;
      --color-border: #242420;
      --color-divider: #282824;
      --color-tanimbary: #6B9E61;
      --color-tanimbary-dark: #16442A;
      --color-ochre: #C58B38;
      --color-terracotta: #E75A4D;
      --color-text: #F0F0EC;
      --color-text-secondary: #9C9C98;
      --color-text-muted: #707070;
      --color-heading: #FFFFFF;
      --color-brand-title: #FFFFFF;
      --color-card-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
      --color-error: #E75A4D;
      --color-error-bg: #2C1715;
      --color-error-text: #FFAAA0;
      --color-success: #6B9E61;
      --color-success-bg: #132213;
      --color-success-text: #B5E8AC;
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
    }

    [data-theme="light"] {
      --color-bg: #F5F4F0;
      --color-surface: #FEFEFC;
      --color-surface-input: #FFFFFF;
      --color-surface-hover: #F2F1EC;
      --color-border: #E2E0D8;
      --color-divider: #ECEAE3;
      --color-tanimbary: #4A6741;
      --color-tanimbary-dark: #16442A;
      --color-ochre: #A67026;
      --color-terracotta: #C0392B;
      --color-text: #1A1A1A;
      --color-text-secondary: #5C5C58;
      --color-text-muted: #8C8C88;
      --color-heading: #111110;
      --color-brand-title: #16442A;
      --color-card-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
      --color-error: #C0392B;
      --color-error-bg: #FDF2F0;
      --color-error-text: #C0392B;
      --color-success: #2E7D32;
      --color-success-bg: #E8F5E9;
      --color-success-text: #1B5E20;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--color-bg);
      color: var(--color-text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.5;
    }

    header {
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--color-border);
      max-width: 820px;
      margin: 0 auto;
      width: 100%;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 11px;
      text-decoration: none;
      color: inherit;
    }

    .brand-logo-wrap {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-md);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
      flex-shrink: 0;
    }

    .brand-logo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .brand-text-wrap {
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      line-height: 1;
    }

    .brand-name {
      font-family: 'LazyDog', 'Plus Jakarta Sans', sans-serif;
      font-size: 27px;
      line-height: 0.95;
      color: var(--color-brand-title);
      font-weight: 400;
    }

    .brand-domain {
      font-family: 'LazyDog', 'Plus Jakarta Sans', sans-serif;
      color: var(--color-tanimbary);
      font-size: 27px;
      line-height: 0.95;
    }

    .brand-tag {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 9.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--color-text-muted);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .theme-toggle-btn {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      color: var(--color-text);
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }

    .theme-toggle-btn:hover {
      background: var(--color-surface-hover);
    }

    .btn-header-back {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-text-secondary);
      text-decoration: none;
      padding: 7px 12px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border);
      background: var(--color-surface);
      transition: all 0.15s ease;
    }

    .btn-header-back:hover {
      color: var(--color-text);
      border-color: var(--color-text-muted);
    }

    main {
      flex: 1;
      max-width: 820px;
      margin: 0 auto;
      width: 100%;
      padding: 32px 20px 48px;
    }

    .intro-header {
      margin-bottom: 24px;
      text-align: center;
    }

    .section-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: var(--color-ochre);
      background: rgba(197, 139, 56, 0.12);
      padding: 4px 10px;
      border-radius: 20px;
      margin-bottom: 12px;
    }

    .page-title {
      font-size: 26px;
      font-weight: 700;
      color: var(--color-heading);
      letter-spacing: -0.4px;
      margin-bottom: 8px;
    }

    .page-subtitle {
      font-size: 14px;
      color: var(--color-text-secondary);
      max-width: 580px;
      margin: 0 auto;
      line-height: 1.5;
    }

    /* ─── CARTE RECOMMANDATION DEEPLINK (PRIORITAIRE) ─── */
    .app-rec-card {
      background: linear-gradient(135deg, rgba(22, 68, 42, 0.25) 0%, rgba(20, 20, 18, 0.8) 100%);
      border: 1px solid var(--color-tanimbary);
      border-radius: var(--radius-lg);
      padding: 24px;
      margin-bottom: 28px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
    }

    [data-theme="light"] .app-rec-card {
      background: linear-gradient(135deg, rgba(238, 243, 237, 0.95) 0%, rgba(254, 254, 252, 0.95) 100%);
      border-color: #6B9E61;
      box-shadow: 0 8px 24px rgba(74, 103, 65, 0.08);
    }

    .app-rec-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #FFFFFF;
      background: var(--color-tanimbary);
      padding: 3px 10px;
      border-radius: 20px;
      margin-bottom: 12px;
    }

    .app-rec-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--color-heading);
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .app-rec-desc {
      font-size: 13.5px;
      color: var(--color-text-secondary);
      line-height: 1.55;
      margin-bottom: 18px;
    }

    .app-rec-desc strong {
      color: var(--color-text);
    }

    .deeplink-btn-wrap {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
    }

    .btn-deeplink {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: var(--color-tanimbary-dark);
      color: #FFFFFF;
      border: 1px solid var(--color-tanimbary);
      padding: 13px 22px;
      border-radius: var(--radius-md);
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .btn-deeplink:hover {
      background: #1f5c39;
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(107, 158, 97, 0.3);
    }

    .deeplink-hint {
      font-size: 12px;
      color: var(--color-text-muted);
      line-height: 1.4;
      flex: 1 1 240px;
    }

    /* Séparateur élégant */
    .or-divider {
      display: flex;
      align-items: center;
      text-align: center;
      margin: 28px 0;
      color: var(--color-text-muted);
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    .or-divider::before,
    .or-divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--color-border);
    }

    .or-divider span {
      padding: 0 14px;
    }

    /* ─── CARTE PRINCIPALE FORMULAIRE WEB ─── */
    .form-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 28px;
      box-shadow: var(--color-card-shadow);
    }

    .form-card-title {
      font-size: 17px;
      font-weight: 700;
      color: var(--color-heading);
      margin-bottom: 6px;
    }

    .form-card-sub {
      font-size: 13px;
      color: var(--color-text-secondary);
      margin-bottom: 22px;
    }

    .field {
      margin-bottom: 18px;
    }

    .field-label {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 12.5px;
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: 7px;
    }

    .field-input, .field-textarea, .field-select {
      width: 100%;
      padding: 11px 14px;
      background: var(--color-surface-input);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-text);
      font-family: inherit;
      font-size: 13.5px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .field-input:focus, .field-textarea:focus, .field-select:focus {
      border-color: var(--color-tanimbary);
      box-shadow: 0 0 0 3px rgba(107, 158, 97, 0.15);
    }

    .field-note {
      font-size: 11.5px;
      color: var(--color-text-muted);
      margin-top: 5px;
      line-height: 1.4;
    }

    /* Sélecteur de plateformes */
    .platform-chips {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .platform-chip {
      background: var(--color-surface-input);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 10px 12px;
      text-align: center;
      cursor: pointer;
      user-select: none;
      transition: all 0.15s ease;
    }

    .platform-chip.selected {
      background: rgba(107, 158, 97, 0.12);
      border-color: var(--color-tanimbary);
      color: var(--color-heading);
      font-weight: 700;
    }

    .platform-chip .chip-name {
      font-size: 12.5px;
      display: block;
    }

    .platform-chip .chip-desc {
      font-size: 10.5px;
      color: var(--color-text-muted);
      margin-top: 2px;
    }

    /* Grille catégories */
    .category-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .category-card {
      background: var(--color-surface-input);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 10px 12px;
      cursor: pointer;
      user-select: none;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .category-card.selected {
      background: rgba(107, 158, 97, 0.12);
      border-color: var(--color-tanimbary);
      color: var(--color-heading);
    }

    .category-card .cat-radio {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .category-card.selected .cat-radio {
      border-color: var(--color-tanimbary);
      background: var(--color-tanimbary);
    }

    .category-card.selected .cat-radio::after {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #FFFFFF;
    }

    .category-card-text {
      font-size: 12.5px;
      font-weight: 600;
    }

    .row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .btn-submit-report {
      width: 100%;
      padding: 13px 20px;
      background: var(--color-tanimbary-dark);
      color: #FFFFFF;
      border: 1px solid var(--color-tanimbary);
      border-radius: var(--radius-md);
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      transition: background-color 0.2s;
      margin-top: 10px;
    }

    .btn-submit-report:hover {
      background: #1f5c39;
    }

    .btn-submit-report:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .banner {
      display: none;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      font-size: 13px;
      margin-bottom: 20px;
      align-items: center;
      gap: 10px;
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

    /* Écran de confirmation */
    .confirmation-view {
      display: none;
      text-align: center;
      padding: 32px 16px;
      flex-direction: column;
      align-items: center;
      gap: 14px;
    }

    .conf-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgba(107, 158, 97, 0.15);
      color: var(--color-tanimbary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .conf-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--color-heading);
    }

    .conf-desc {
      font-size: 13.5px;
      color: var(--color-text-secondary);
      max-width: 480px;
      line-height: 1.5;
    }

    .conf-actions {
      display: flex;
      gap: 12px;
      margin-top: 12px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn-conf-secondary {
      padding: 10px 18px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      border: 1px solid var(--color-border);
      color: var(--color-text);
      background: var(--color-surface-input);
      cursor: pointer;
    }

    .hp-trap {
      display: none !important;
    }

    footer {
      border-top: 1px solid var(--color-border);
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: var(--color-text-muted);
      margin-top: auto;
    }

    .footer-nav {
      display: flex;
      justify-content: center;
      gap: 18px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }

    .footer-nav a, .footer-cookie-btn {
      color: var(--color-text-secondary);
      text-decoration: none;
      background: none;
      border: none;
      font-family: inherit;
      font-size: 12px;
      cursor: pointer;
    }

    @media (max-width: 600px) {
      .platform-chips {
        grid-template-columns: 1fr;
      }
      .category-grid, .row-2 {
        grid-template-columns: 1fr;
      }
      .form-card {
        padding: 20px;
      }
    }
  </style>
</head>
<body>

  <!-- En-tête officiel Kanto MG -->
  <header>
    <a href="/" class="brand" aria-label="kanto.mg - Accueil">
      <div class="brand-logo-wrap">
        <img
          src="/logo.png"
          alt="Logo officiel Kanto MG"
          class="brand-logo"
          width="38"
          height="38"
          onerror="this.onerror=null; this.src='/favicon.png';"
        />
      </div>
      <div class="brand-text-wrap">
        <span class="brand-name">kanto<span class="brand-domain">.mg</span></span>
        <span class="brand-tag">Diagnostic &amp; Retours</span>
      </div>
    </a>
    <div class="header-actions">
      <a href="/beta" class="btn-header-back">← Espace Bêta</a>
      <button type="button" class="theme-toggle-btn" id="theme-toggle" aria-label="Changer de thème">
        <span id="theme-toggle-icon">☀</span>
      </button>
    </div>
  </header>

  <main>
    <div class="intro-header">
      <span class="section-eyebrow">Assistance &amp; Qualité Kanto MG</span>
      <h1 class="page-title">Signaler une anomalie ou un bug</h1>
      <p class="page-subtitle">
        Votre contribution en tant que testeur est essentielle pour garantir une expérience noble, fluide et authentique à toute la communauté malgache.
      </p>
    </div>

    <!-- ─── RECOMMANDATION DEEPLINK APPLICATION MOBILE ─── -->
    <div class="app-rec-card">
      <div class="app-rec-badge">⭐ Méthode Recommandée • Plus rapide</div>
      <h2 class="app-rec-title">
        <span>📱</span>
        <span>Vous avez l'application Kanto MG installée sur votre smartphone ?</span>
      </h2>
      <p class="app-rec-desc">
        Nous vous conseillons d'ouvrir directement le module de retour de l'application. Vos <strong>logs d'erreurs récents</strong>, votre <strong>modèle exact d'appareil</strong> et votre <strong>numéro de build</strong> y seront automatiquement joints pour une reproduction immédiate par notre équipe.
      </p>
      <div class="deeplink-btn-wrap">
        <a href="kantomg://feedback?type=bug" class="btn-deeplink" id="btn-open-app">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
          <span>Ouvrir dans l'application Kanto MG</span>
        </a>
        <div class="deeplink-hint">
          Touchez ce bouton depuis votre smartphone pour basculer directement dans l'application.
        </div>
      </div>
    </div>

    <div class="or-divider">
      <span>Ou remplissez le formulaire web ci-dessous</span>
    </div>

    <!-- Alertes visuelles -->
    <div id="error-banner" class="banner error">
      <span id="error-text"></span>
    </div>
    <div id="success-banner" class="banner success">
      <span id="success-text"></span>
    </div>

    <!-- ─── FORMULAIRE WEB COMPLET ─── -->
    <div class="form-card" id="form-card">
      <div class="form-card-title">Formulaire de rapport technique</div>
      <div class="form-card-sub">
        Transmettez les détails de l'anomalie rencontrée. Vous recevrez un suivi par e-mail dès sa prise en charge.
      </div>

      <form id="bug-report-form">
        <!-- Protection honeypot -->
        <div class="hp-trap">
          <input type="text" id="hp-check" name="check_website" tabindex="-1" autocomplete="off">
        </div>

        <div class="field">
          <label class="field-label" for="report-email">
            <span>Votre adresse e-mail de testeur</span>
            <span style="color: var(--color-tanimbary);">Requis</span>
          </label>
          <input
            type="email"
            id="report-email"
            class="field-input"
            placeholder="votre.email@gmail.com ou icloud.com"
            value="${initialEmail}"
            required
            autocomplete="email"
          >
          <p class="field-note">
            Adresse liée à votre compte Google Play ou Apple TestFlight. Donnée chiffrée (AES-256-GCM).
          </p>
        </div>

        <!-- Plateforme -->
        <div class="field">
          <label class="field-label">
            <span>Plateforme concernée</span>
            <span style="color: var(--color-tanimbary);">Sélectionnez-en une</span>
          </label>
          <div class="platform-chips">
            <div class="platform-chip ${initialPlatform === 'ANDROID' ? 'selected' : ''}" data-platform="ANDROID" id="chip-android">
              <span class="chip-name">🤖 Android</span>
              <span class="chip-desc">Google Play Closed Testing</span>
            </div>
            <div class="platform-chip ${initialPlatform === 'IOS' ? 'selected' : ''}" data-platform="IOS" id="chip-ios">
              <span class="chip-name">🍏 iOS</span>
              <span class="chip-desc">Apple TestFlight (iPhone/iPad)</span>
            </div>
            <div class="platform-chip ${initialPlatform === 'ALL' ? 'selected' : ''}" data-platform="ALL" id="chip-web">
              <span class="chip-name">🌐 Web / Général</span>
              <span class="chip-desc">Portail web ou les deux</span>
            </div>
          </div>
        </div>

        <!-- Catégorie -->
        <div class="field">
          <label class="field-label">
            <span>Nature du retour</span>
          </label>
          <div class="category-grid">
            <div class="category-card ${initialType === 'BUG' ? 'selected' : ''}" data-cat="BUG">
              <div class="cat-radio"></div>
              <div class="category-card-text">🚨 Bug bloquant / Crash</div>
            </div>
            <div class="category-card ${initialType === 'UI_UX' ? 'selected' : ''}" data-cat="UI_UX">
              <div class="cat-radio"></div>
              <div class="category-card-text">🎨 Affichage / Interface</div>
            </div>
            <div class="category-card ${initialType === 'PERFORMANCE' ? 'selected' : ''}" data-cat="PERFORMANCE">
              <div class="cat-radio"></div>
              <div class="category-card-text">⚡ Lenteur / Performance</div>
            </div>
            <div class="category-card ${initialType === 'CONTENT' ? 'selected' : ''}" data-cat="CONTENT">
              <div class="cat-radio"></div>
              <div class="category-card-text">📚 Contenu culturel / Traduction</div>
            </div>
            <div class="category-card ${initialType === 'SUGGESTION' ? 'selected' : ''}" data-cat="SUGGESTION">
              <div class="cat-radio"></div>
              <div class="category-card-text">💡 Suggestion d'amélioration</div>
            </div>
            <div class="category-card ${initialType === 'OTHER' ? 'selected' : ''}" data-cat="OTHER">
              <div class="cat-radio"></div>
              <div class="category-card-text">💬 Autre retour</div>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="field-label" for="report-title">
            <span>Titre concis du problème</span>
            <span style="color: var(--color-tanimbary);">Requis</span>
          </label>
          <input
            type="text"
            id="report-title"
            class="field-input"
            placeholder="Ex: L'écran se fige à la validation du quiz ohabolana"
            required
          >
        </div>

        <div class="row-2">
          <div class="field">
            <label class="field-label" for="report-app-version">
              <span>Version de l'application</span>
              <span style="color: var(--color-text-muted);">Optionnel</span>
            </label>
            <input
              type="text"
              id="report-app-version"
              class="field-input"
              placeholder="Ex: 0.0.20 (build 3)"
            >
          </div>
          <div class="field">
            <label class="field-label" for="report-device">
              <span>Modèle d'appareil &amp; OS</span>
              <span style="color: var(--color-text-muted);">Optionnel</span>
            </label>
            <input
              type="text"
              id="report-device"
              class="field-input"
              placeholder="Ex: Samsung Galaxy S22 (Android 14)"
            >
          </div>
        </div>

        <div class="field">
          <label class="field-label" for="report-desc">
            <span>Description détaillée &amp; Étapes de reproduction</span>
            <span style="color: var(--color-tanimbary);">Requis (min 10 car.)</span>
          </label>
          <textarea
            id="report-desc"
            rows="5"
            class="field-textarea"
            placeholder="1. Où étiez-vous dans l'application ?&#10;2. Quelle action avez-vous effectuée ?&#10;3. Quel était le comportement inattendu ?"
            required
          ></textarea>
        </div>

        <button type="submit" class="btn-submit-report" id="btn-submit">
          <span>Transmettre le rapport à l'équipe technique</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>

      <!-- Écran de confirmation après envoi -->
      <div class="confirmation-view" id="conf-view">
        <div class="conf-icon">✓</div>
        <div class="conf-title">Misaotra betsaka !</div>
        <p class="conf-desc">
          Votre signalement a bien été transmis à l'équipe de développement de Kanto MG sous la référence :
        </p>
        <span style="font-family: monospace; font-weight: 700; color: var(--color-tanimbary); font-size: 14px;" id="conf-ref-id">
          #BUG-XXXX
        </span>
        <p class="conf-desc">
          Notre équipe examine attentivement chaque anomalie pour préparer les prochains correctifs. Un message de confirmation a été consigné pour votre adresse.
        </p>
        <div class="conf-actions">
          <button type="button" class="btn-conf-secondary" id="btn-new-report">
            Nouveau signalement
          </button>
          <a href="/beta" class="btn-conf-secondary" style="background: var(--color-tanimbary-dark); color: #FFF; border-color: var(--color-tanimbary);">
            Retour à l'Espace Bêta
          </a>
        </div>
      </div>
    </div>
  </main>

  <!-- Pied de page officiel Kanto MG -->
  <footer>
    <div class="footer-nav">
      <a href="${legalBaseUrl}/pages/terms">Conditions d'utilisation (CGU)</a>
      <a href="${legalBaseUrl}/pages/privacy">Confidentialité &amp; RGPD</a>
      <a href="/beta">Portail Bêta-Testeurs</a>
      <a href="mailto:${supportEmail}">Support officiel (${supportEmail})</a>
    </div>
    <div style="font-size: 11px;">
      © ${currentYear} kanto.mg • Lova, Kolontsaina &amp; Tantara Malagasy
    </div>
  </footer>

  <script src="/bug-report.js"></script>
</body>
</html>`.trim();
}

/**
 * Script externe client pour la page de signalement (/bug-report.js).
 */
export function renderBugReportScript(): string {
  return `
(function() {
  var selectedPlatform = 'ANDROID';
  var selectedCategory = 'BUG';

  // Sélecteur de plateformes
  var chips = document.querySelectorAll('.platform-chip');
  chips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      chips.forEach(function(c) { c.classList.remove('selected'); });
      chip.classList.add('selected');
      selectedPlatform = chip.getAttribute('data-platform') || 'ANDROID';
    });
  });

  // Sélecteur de catégories
  var catCards = document.querySelectorAll('.category-card');
  catCards.forEach(function(card) {
    card.addEventListener('click', function() {
      catCards.forEach(function(c) { c.classList.remove('selected'); });
      card.classList.add('selected');
      selectedCategory = card.getAttribute('data-cat') || 'BUG';
    });
  });

  // Bannières
  var errBanner = document.getElementById('error-banner');
  var errText = document.getElementById('error-text');
  var succBanner = document.getElementById('success-banner');
  var succText = document.getElementById('success-text');

  function showError(msg) {
    if (errText) errText.innerText = msg;
    if (errBanner) {
      errBanner.style.display = 'flex';
      errBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (succBanner) succBanner.style.display = 'none';
  }

  function showSuccess(msg) {
    if (succText) succText.innerText = msg;
    if (succBanner) {
      succBanner.style.display = 'flex';
      succBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (errBanner) errBanner.style.display = 'none';
  }

  // Thème sombre/clair
  var themeBtn = document.getElementById('theme-toggle');
  var themeIcon = document.getElementById('theme-toggle-icon');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) themeIcon.innerText = theme === 'light' ? '🌙' : '☀';
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#F5F4F0' : '#0D0D0B');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      var next = current === 'light' ? 'dark' : 'light';
      try { localStorage.setItem('kanto_theme', next); } catch (e) {}
      applyTheme(next);
    });
  }

  var activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(activeTheme);

  // Soumission du formulaire
  var form = document.getElementById('bug-report-form');
  var confView = document.getElementById('conf-view');
  var btnSubmit = document.getElementById('btn-submit');
  var confRefId = document.getElementById('conf-ref-id');
  var btnNewReport = document.getElementById('btn-new-report');

  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Vérification honeypot
      var hp = document.getElementById('hp-check');
      if (hp && hp.value) {
        // Robot détecté silencieusement
        return;
      }

      var email = (document.getElementById('report-email').value || '').trim();
      var title = (document.getElementById('report-title').value || '').trim();
      var desc = (document.getElementById('report-desc').value || '').trim();
      var appVersion = (document.getElementById('report-app-version').value || '').trim();
      var deviceInfo = (document.getElementById('report-device').value || '').trim();

      if (!email || !desc) {
        showError('Veuillez renseigner votre adresse e-mail et une description.');
        return;
      }

      if (desc.length < 10) {
        showError('La description doit comporter au moins 10 caractères.');
        return;
      }

      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span>Transmission en cours...</span>';
      }

      try {
        var res = await fetch('/api/beta-testers/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            category: selectedCategory,
            title: title || undefined,
            description: desc,
            platform: selectedPlatform,
            appVersion: appVersion || undefined,
            deviceInfo: deviceInfo || undefined
          })
        });

        var data = await res.json();

        if (res.ok && data.success) {
          if (form) form.style.display = 'none';
          if (confRefId && data.feedbackId) {
            confRefId.innerText = '#' + data.feedbackId.substring(0, 8).toUpperCase();
          }
          if (confView) confView.style.display = 'flex';
          showSuccess(data.message || 'Signalement transmis avec succès !');
        } else {
          showError(data.message || 'Erreur lors de la transmission du signalement.');
          if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = '<span>Réessayer la transmission</span>';
          }
        }
      } catch (err) {
        showError('Impossible de joindre le serveur. Vérifiez votre connexion Internet.');
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = '<span>Réessayer</span>';
        }
      }
    });
  }

  if (btnNewReport) {
    btnNewReport.addEventListener('click', function() {
      if (form) {
        form.reset();
        form.style.display = 'block';
      }
      if (confView) confView.style.display = 'none';
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<span>Transmettre le rapport à l\\'équipe technique</span>';
      }
      if (errBanner) errBanner.style.display = 'none';
      if (succBanner) succBanner.style.display = 'none';
    });
  }
})();
  `.trim();
}

