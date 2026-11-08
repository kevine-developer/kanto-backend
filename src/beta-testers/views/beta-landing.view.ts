/**
 * Kanto MG — Page web d'accès anticipé, de téléchargement et de gestion du programme bêta (Android & iOS).
 * Accessible sur app-kanto.gastsar.fr, kanto.mg/beta ou via redirection deeplink.
 *
 * Design System Kanto officiel (Terre & Encre) :
 * - Vert Tanimbary (#6B9E61 / #16442A) & Ocre Ambre (#C58B38 / #E0A24A)
 * - Fond minéral charbon chaud (#0D0D0B) & surfaces feutrées (#141412) en mode sombre
 * - Fond parchemin chaud (#F5F4F0) en mode clair
 * - Typographie Plus Jakarta Sans
 * - Zéro référence ou icône d'IA / Sparkles.
 * - Gestion indépendante et complète Android (Google Play) & iOS (Apple TestFlight & App Store).
 */

export interface BetaLandingPageOptions {
  testerCount?: number;
  initialRegistered?: boolean;
  registeredEmail?: string;
  errorMessage?: string;
  fromDeeplink?: boolean;
  targetPath?: string;
  initialTab?: 'download' | 'register' | 'already_registered' | 'unsubscribe';
  initialEmail?: string;
  unsubscribeToken?: string;
  supportEmail?: string;
}

export function renderBetaLandingPage(
  options?: BetaLandingPageOptions,
): string {
  const currentYear = new Date().getFullYear();
  const supportEmail =
    options?.supportEmail || process.env.SUPPORT_EMAIL || 'contact@kanto.mg';
  const count =
    typeof options?.testerCount === 'number' ? options.testerCount : 0;
  const isRegistered = Boolean(options?.initialRegistered);

  const initialTab =
    options?.initialTab || (isRegistered ? 'already_registered' : 'register');
  const emailVal = options?.registeredEmail || options?.initialEmail || '';
  const errorVal = options?.errorMessage
    ? escapeHtml(options.errorMessage)
    : '';
  const tokenVal = options?.unsubscribeToken || '';

  const countBadgeText =
    count > 0
      ? `${count} testeur${count > 1 ? 's' : ''} inscrit${count > 1 ? 's' : ''}`
      : 'Inscriptions ouvertes';

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
  <title>Kanto MG • Téléchargement &amp; Programme Bêta (Android &amp; iOS)</title>
  <meta name="description" content="Téléchargez l'application officielle Kanto MG sur Google Play et Apple TestFlight. Explorez la langue, la culture, les contes (Angano) et les proverbes malgaches (Ohabolana).">
  <meta name="theme-color" content="#0D0D0B">

  <!-- Open Graph -->
  <meta property="og:title" content="Kanto MG • Téléchargement &amp; Bêta-Test">
  <meta property="og:description" content="Rejoignez la communauté des testeurs Kanto MG sur Google Play et TestFlight.">
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
      --color-text: #F0F0EC;
      --color-text-secondary: #9C9C98;
      --color-text-muted: #707070;
      --color-heading: #FFFFFF;
      --color-brand-title: #FFFFFF;
      --color-card-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
      --color-tab-active-bg: #141412;
      --color-tab-active-text: #FFFFFF;
      --color-error: #E75A4D;
      --color-error-bg: #2C1715;
      --color-error-text: #FFAAA0;
      --color-success: #6B9E61;
      --color-success-bg: #132213;
      --color-success-text: #B5E8AC;
      --color-android: #3DDC84;
      --color-ios: #007AFF;
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
      --color-text: #1A1A1A;
      --color-text-secondary: #5C5C58;
      --color-text-muted: #8C8C88;
      --color-heading: #111110;
      --color-brand-title: #16442A;
      --color-card-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
      --color-tab-active-bg: #FEFEFC;
      --color-tab-active-text: #16442A;
      --color-error: #C0392B;
      --color-error-bg: #FDF2F0;
      --color-error-text: #C0392B;
      --color-success: #2E7D32;
      --color-success-bg: #E8F5E9;
      --color-success-text: #1B5E20;
      --color-android: #2E7D32;
      --color-ios: #0066CC;
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
      max-width: 900px;
      margin: 0 auto;
      width: 100%;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 11px;
      text-decoration: none;
      color: inherit;
      transition: opacity 0.15s ease;
    }

    .brand:hover {
      opacity: 0.9;
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
      border-radius: inherit;
    }

    .brand-text-wrap {
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      line-height: 1;
    }

    .brand-name {
      font-family: 'LazyDog', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 27px;
      line-height: 0.95;
      color: var(--color-brand-title);
      letter-spacing: 0.3px;
      font-weight: 400;
      display: inline-flex;
      align-items: baseline;
    }

    .brand-domain {
      font-family: 'LazyDog', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
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
      margin-top: 2px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .status-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 999px;
      font-size: 11.5px;
      color: var(--color-tanimbary);
      font-weight: 600;
    }

    .status-indicator {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--color-tanimbary);
      animation: pulse 2.5s infinite;
    }

    @keyframes pulse {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
      100% { opacity: 1; transform: scale(1); }
    }

    .theme-toggle-btn {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      color: var(--color-text-secondary);
      width: 34px;
      height: 34px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .theme-toggle-btn:hover {
      background: var(--color-surface-hover);
      color: var(--color-text);
    }

    main {
      flex: 1;
      max-width: 900px;
      margin: 0 auto;
      padding: 32px 20px 48px;
      width: 100%;
    }

    .intro {
      text-align: center;
      margin-bottom: 28px;
    }

    .section-eyebrow {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: var(--color-tanimbary);
      margin-bottom: 8px;
    }

    h1 {
      font-size: 26px;
      font-weight: 700;
      color: var(--color-heading);
      letter-spacing: -0.5px;
      margin-bottom: 10px;
      line-height: 1.25;
    }

    .intro-description {
      font-size: 14.5px;
      color: var(--color-text-secondary);
      max-width: 620px;
      margin: 0 auto;
      line-height: 1.55;
    }

    .card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 24px;
      box-shadow: var(--color-card-shadow);
      margin-bottom: 24px;
    }

    /* ─── NOUVEAU DESIGN SEGMENTED CONTROL KANTO (2 OPTIONS) ─── */
    .tabs-nav {
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: var(--color-surface-input);
      border: 1px solid var(--color-border);
      border-radius: 14px;
      padding: 5px;
      gap: 6px;
      margin-bottom: 24px;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    [data-theme="dark"] .tabs-nav {
      background: #11110F;
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.45);
    }

    .tab-btn {
      position: relative;
      padding: 12px 14px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--color-text-secondary);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13.5px;
      font-weight: 600;
      letter-spacing: -0.15px;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      white-space: nowrap;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    .tab-btn svg {
      flex-shrink: 0;
      transition: transform 0.2s ease, stroke 0.2s ease;
    }

    .tab-btn:hover {
      color: var(--color-text);
      background: var(--color-surface-hover);
    }

    .tab-btn:hover svg {
      transform: translateY(-1px);
    }

    .tab-btn:active {
      transform: scale(0.985);
    }

    /* Onglet actif — Mode Sombre */
    [data-theme="dark"] .tab-btn.active {
      background: linear-gradient(180deg, #22221E 0%, #181815 100%);
      color: #F5F5F0;
      border-color: rgba(224, 162, 74, 0.35);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45), 0 1px 2px rgba(0, 0, 0, 0.25);
    }

    [data-theme="dark"] .tab-btn.active svg {
      stroke: var(--color-tanimbary, #6B9E61);
    }

    /* Onglet actif — Mode Clair */
    [data-theme="light"] .tab-btn.active {
      background: #FFFFFF;
      color: #16442A;
      border-color: rgba(74, 103, 65, 0.22);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
    }

    [data-theme="light"] .tab-btn.active svg {
      stroke: #16442A;
    }

    /* Lien discret vers l'espace testeur pour ceux déjà inscrits */
    .already-registered-hint {
      margin-top: 18px;
      padding-top: 14px;
      border-top: 1px dashed var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 12.5px;
      color: var(--color-text-secondary);
      flex-wrap: wrap;
    }

    .link-already-trigger {
      background: none;
      border: none;
      color: var(--color-tanimbary);
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      text-decoration: underline;
      text-underline-offset: 3px;
      transition: opacity 0.15s ease;
    }

    .link-already-trigger:hover {
      opacity: 0.8;
    }

    .btn-back-to-reg {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all 0.18s ease;
    }

    .btn-back-to-reg:hover {
      color: var(--color-text);
      background: var(--color-surface-hover);
      border-color: var(--color-tanimbary);
    }

    /* ─── FORMULAIRES & CHAMPS ─── */
    .field {
      margin-bottom: 18px;
    }

    .field-label {
      display: flex;
      justify-content: space-between;
      font-size: 12.5px;
      font-weight: 600;
      margin-bottom: 7px;
      color: var(--color-text);
    }

    .field-input {
      width: 100%;
      padding: 12px 14px;
      background: var(--color-surface-input);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-text);
      font-family: inherit;
      font-size: 13.5px;
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .field-input:focus {
      border-color: var(--color-tanimbary);
      box-shadow: 0 0 0 3px rgba(107, 158, 97, 0.15);
    }

    .field-note {
      font-size: 11.5px;
      color: var(--color-text-muted);
      margin-top: 6px;
      line-height: 1.4;
    }

    /* Plateformes de test */
    .platform-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 4px;
    }

    .platform-card {
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 13px 14px;
      background: var(--color-surface-input);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.18s ease;
      user-select: none;
    }

    .platform-card:hover {
      border-color: var(--color-tanimbary);
    }

    .platform-card.checked {
      border-color: var(--color-tanimbary);
      background: rgba(107, 158, 97, 0.08);
    }

    .platform-checkbox {
      width: 20px;
      height: 20px;
      border-radius: 5px;
      border: 1.5px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.15s ease;
    }

    .platform-card.checked .platform-checkbox {
      background: var(--color-tanimbary);
      border-color: var(--color-tanimbary);
      color: #FFFFFF;
    }

    .platform-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--color-text);
    }

    .platform-sub {
      font-size: 11px;
      color: var(--color-text-muted);
    }

    .btn-submit {
      width: 100%;
      padding: 13px 18px;
      background: var(--color-tanimbary-dark);
      color: #FFFFFF;
      border: 1px solid var(--color-tanimbary);
      border-radius: var(--radius-md);
      font-family: inherit;
      font-size: 13.5px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background-color 0.18s ease, transform 0.1s ease;
      min-height: 46px;
    }

    .btn-submit:hover {
      background: #1f5c39;
    }

    .btn-submit:active {
      transform: scale(0.99);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      width: 100%;
      padding: 10px 14px;
      background: transparent;
      color: var(--color-text);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      transition: all 0.15s ease;
      min-height: 42px;
    }

    .btn-secondary:hover {
      background: var(--color-surface-hover);
      border-color: var(--color-text-muted);
    }

    /* Bannières de notification */
    .banner {
      display: none;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      font-size: 12.5px;
      margin-bottom: 18px;
      align-items: center;
      gap: 10px;
      line-height: 1.45;
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

    /* ─── VOLET TÉLÉCHARGEMENT (GRILLE ANDROID & IOS) ─── */
    .download-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .download-card {
      background: var(--color-surface-input);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 20px;
      display: flex;
      flex-direction: column;
      transition: border-color 0.18s ease;
    }

    .download-card:hover {
      border-color: var(--color-tanimbary);
    }

    .download-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 14px;
    }

    .download-platform-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .download-platform-icon-android {
      background: rgba(61, 220, 132, 0.12);
      color: #3DDC84;
      border: 1px solid rgba(61, 220, 132, 0.25);
    }

    .download-platform-icon-ios {
      background: rgba(0, 122, 255, 0.12);
      color: #007AFF;
      border: 1px solid rgba(0, 122, 255, 0.25);
    }

    .download-avail-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .download-avail-public { background: rgba(46, 125, 50, 0.15); color: #4CAF50; border: 1px solid rgba(76, 175, 80, 0.35); }
    .download-avail-beta { background: rgba(107, 158, 97, 0.15); color: var(--color-tanimbary); border: 1px solid rgba(107, 158, 97, 0.35); }
    .download-avail-closed { background: rgba(197, 139, 56, 0.15); color: var(--color-ochre); border: 1px solid rgba(197, 139, 56, 0.35); }
    .download-avail-pending { background: rgba(0, 122, 255, 0.15); color: #007AFF; border: 1px solid rgba(0, 122, 255, 0.35); }
    .download-avail-unavailable { background: rgba(120, 120, 120, 0.15); color: var(--color-text-muted); border: 1px solid rgba(120, 120, 120, 0.35); }

    .download-card-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--color-heading);
      margin-bottom: 4px;
    }

    .download-card-desc {
      font-size: 12.5px;
      color: var(--color-text-secondary);
      line-height: 1.5;
      margin-bottom: 14px;
      flex: 1;
    }

    .download-version-box {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      padding: 9px 12px;
      margin-bottom: 14px;
      font-size: 11.5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--color-text-secondary);
    }

    .download-card-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .btn-download-primary {
      width: 100%;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      cursor: pointer;
      border: none;
      font-family: inherit;
      transition: all 0.15s ease;
      min-height: 44px;
    }

    .btn-download-android {
      background: #16442A;
      color: #FFFFFF;
      border: 1px solid var(--color-tanimbary);
    }

    .btn-download-android:hover {
      background: #1f5c39;
    }

    .btn-download-ios {
      background: #004F9F;
      color: #FFFFFF;
      border: 1px solid #007AFF;
    }

    .btn-download-ios:hover {
      background: #0066CC;
    }

    .download-quick-steps {
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px dashed var(--color-border);
      font-size: 11.5px;
      color: var(--color-text-muted);
      line-height: 1.45;
    }

    .download-quick-steps ol {
      margin: 6px 0 0 16px;
      padding: 0;
    }

    .download-quick-steps li {
      margin-bottom: 4px;
    }

    /* ─── VOLET ESPACE TESTEUR & SUIVI DE PROGRESSION ─── */
    .tester-header-card {
      background: var(--color-surface-input);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 16px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    .tester-status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 999px;
      font-size: 11.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .badge-inscrit { background: rgba(120, 120, 120, 0.15); color: var(--color-text-muted); border: 1px solid rgba(120, 120, 120, 0.3); }
    .badge-en_attente { background: rgba(197, 139, 56, 0.15); color: var(--color-ochre); border: 1px solid rgba(197, 139, 56, 0.35); }
    .badge-confirme { background: rgba(107, 158, 97, 0.18); color: var(--color-tanimbary); border: 1px solid rgba(107, 158, 97, 0.4); }
    .badge-verifie { background: #16442A; color: #FFFFFF; border: 1px solid var(--color-tanimbary); }
    .badge-installe { background: #004F9F; color: #FFFFFF; border: 1px solid #007AFF; }
    .badge-inactif { background: rgba(231, 90, 77, 0.15); color: var(--color-error); border: 1px solid rgba(231, 90, 77, 0.3); }

    /* Barre de progression en 5 étapes */
    .progress-stepper {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      position: relative;
      margin: 24px 0 28px 0;
      padding: 0 4px;
    }

    .progress-stepper::before {
      content: "";
      position: absolute;
      top: 15px;
      left: 24px;
      right: 24px;
      height: 2px;
      background: var(--color-border);
      z-index: 1;
    }

    .progress-step-item {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      flex: 1;
    }

    .step-bullet {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--color-surface);
      border: 2px solid var(--color-border);
      color: var(--color-text-muted);
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
      transition: all 0.2s ease;
    }

    .progress-step-item.completed .step-bullet {
      background: var(--color-tanimbary);
      border-color: var(--color-tanimbary);
      color: #FFFFFF;
    }

    .progress-step-item.current .step-bullet {
      background: var(--color-surface);
      border-color: var(--color-ochre);
      color: var(--color-ochre);
      box-shadow: 0 0 0 4px rgba(197, 139, 56, 0.2);
    }

    .step-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-text-secondary);
      line-height: 1.3;
      max-width: 90px;
    }

    .progress-step-item.completed .step-label {
      color: var(--color-text);
    }

    .progress-step-item.current .step-label {
      color: var(--color-ochre);
      font-weight: 700;
    }

    /* Boîte d'action principale de confirmation */
    .tester-action-box {
      background: rgba(107, 158, 97, 0.08);
      border: 1px solid var(--color-tanimbary);
      border-radius: var(--radius-lg);
      padding: 20px;
      margin: 18px 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .btn-confirm-action {
      width: 100%;
      padding: 13px 18px;
      background: var(--color-tanimbary-dark);
      color: #FFFFFF;
      border: 1px solid var(--color-tanimbary);
      border-radius: var(--radius-md);
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      font-family: inherit;
      transition: all 0.18s ease;
      box-shadow: 0 4px 14px rgba(22, 68, 42, 0.35);
      min-height: 48px;
    }

    .btn-confirm-action:hover {
      background: #1f5c39;
    }

    .btn-installed-action {
      width: 100%;
      padding: 12px 18px;
      background: rgba(107, 158, 97, 0.2);
      color: var(--color-tanimbary);
      border: 1px solid var(--color-tanimbary);
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      font-family: inherit;
      transition: all 0.15s ease;
      min-height: 44px;
    }

    .btn-installed-action:hover {
      background: rgba(107, 158, 97, 0.3);
    }

    .guide-accordion {
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow: hidden;
      margin-top: 14px;
      background: var(--color-surface-input);
    }

    .guide-accordion-header {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      background: var(--color-surface);
      user-select: none;
      font-size: 13px;
      font-weight: 600;
      color: var(--color-text);
    }

    .guide-accordion-content {
      padding: 14px 18px;
      border-top: 1px solid var(--color-border);
      font-size: 12.5px;
      line-height: 1.6;
      color: var(--color-text-secondary);
    }

    .unsub-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      margin-bottom: 10px;
    }

    .unsub-chip {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      color: var(--color-text-secondary);
      padding: 6px 11px;
      border-radius: 999px;
      font-size: 11.5px;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s ease;
      user-select: none;
    }

    .unsub-chip:hover {
      border-color: var(--color-tanimbary);
      color: var(--color-tanimbary);
      background: rgba(107, 158, 97, 0.08);
    }

    .unsub-chip.active {
      background: var(--color-tanimbary);
      color: #FFFFFF;
      border-color: var(--color-tanimbary);
      font-weight: 600;
    }

    .unsub-confirm-card {
      display: none;
      padding: 22px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      text-align: center;
      margin-top: 10px;
    }

    /* Grille de statut plateforme testeur */
    .platform-status-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin: 16px 0;
    }

    .platform-status-card {
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 14px;
      background: var(--color-surface-input);
    }

    .platform-status-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .btn-store {
      display: inline-block;
      width: 100%;
      text-align: center;
      padding: 9px 12px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      margin-top: 10px;
    }

    .btn-store-android { background: #16442A; color: #FFF; border: 1px solid var(--color-tanimbary); }
    .btn-store-ios { background: #004F9F; color: #FFF; border: 1px solid #007AFF; }

    /* Vue Confirmation */
    .confirmation {
      text-align: center;
      padding: 24px 10px;
      display: none;
      flex-direction: column;
      align-items: center;
      gap: 14px;
    }

    .confirmation-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(107, 158, 97, 0.15);
      color: var(--color-tanimbary);
      display: flex;
      align-items: center;
      justify-content: center;
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

    .footer-nav a:hover, .footer-cookie-btn:hover {
      color: var(--color-tanimbary);
    }

    .footer-link-feedback {
      color: var(--color-tanimbary);
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: opacity 0.15s ease;
    }

    .footer-link-feedback:hover {
      text-decoration: underline;
      opacity: 0.9;
    }

    .footer-link-my-space {
      color: var(--color-tanimbary);
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: opacity 0.15s ease;
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
      font-family: inherit;
      font-size: 12px;
    }

    .footer-link-my-space:hover {
      text-decoration: underline;
      opacity: 0.9;
    }

    .hp-trap {
      display: none !important;
    }

    /* ─── MODALES PARTAGÉES (CGU, RGPD & COOKIES) ─── */
    .kanto-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.72);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 16px;
    }

    .kanto-modal-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      max-width: 660px;
      width: 100%;
      max-height: 88vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.45);
      overflow: hidden;
      animation: kantoModalFadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes kantoModalFadeIn {
      from { opacity: 0; transform: scale(0.96) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .kanto-modal-head {
      padding: 18px 22px;
      border-bottom: 1px solid var(--color-divider);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--color-surface);
    }

    .kanto-modal-title {
      font-size: 15.5px;
      font-weight: 700;
      color: var(--color-heading);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .kanto-modal-close {
      background: transparent;
      border: 1px solid var(--color-border);
      color: var(--color-text-secondary);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }

    .kanto-modal-close:hover {
      background: var(--color-surface-hover);
      color: var(--color-text);
      border-color: var(--color-text-muted);
    }

    .kanto-modal-scroll {
      padding: 22px;
      overflow-y: auto;
      color: var(--color-text);
      font-size: 13.5px;
      line-height: 1.6;
    }

    .kanto-modal-scroll h3 {
      font-size: 14px;
      font-weight: 700;
      color: var(--color-heading);
      margin: 18px 0 8px 0;
    }

    .kanto-modal-scroll h3:first-child {
      margin-top: 0;
    }

    .kanto-modal-scroll p {
      margin-bottom: 12px;
      color: var(--color-text-secondary);
    }

    .kanto-modal-scroll ul {
      margin: 0 0 14px 20px;
      color: var(--color-text-secondary);
    }

    .kanto-modal-scroll li {
      margin-bottom: 6px;
    }

    .cgu-highlight-box {
      background: rgba(107, 158, 97, 0.08);
      border: 1px solid var(--color-tanimbary);
      border-radius: var(--radius-md);
      padding: 14px 16px;
      margin-bottom: 18px;
      font-size: 12.5px;
      color: var(--color-text);
      line-height: 1.5;
    }

    .kanto-modal-foot {
      padding: 14px 22px;
      border-top: 1px solid var(--color-divider);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: var(--color-surface-input);
      flex-wrap: wrap;
    }

    /* ─── COMPOSANT CASE CONDITIONS & CGU ─── */
    .terms-card {
      background: var(--color-surface-input);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 13px 15px;
      margin-bottom: 22px;
    }

    .terms-box {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 12.5px;
      color: var(--color-text);
      cursor: pointer;
      user-select: none;
      margin-bottom: 0;
    }

    .terms-box input[type="checkbox"] {
      width: 17px;
      height: 17px;
      margin-top: 2px;
      accent-color: var(--color-tanimbary);
      cursor: pointer;
      flex-shrink: 0;
    }

    .btn-terms-link {
      background: none;
      border: none;
      color: var(--color-tanimbary);
      font-weight: 600;
      text-decoration: underline;
      cursor: pointer;
      padding: 0 2px;
      font-size: inherit;
      font-family: inherit;
      display: inline;
    }

    .btn-terms-link:hover {
      opacity: 0.85;
    }

    .terms-micro-info {
      margin-top: 9px;
      padding-top: 9px;
      border-top: 1px dashed var(--color-border);
      font-size: 11px;
      color: var(--color-text-muted);
      line-height: 1.45;
      display: flex;
      align-items: center;
      gap: 7px;
    }

    /* ─── BANNIÈRE COOKIES RGPD ─── */
    .cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--color-surface);
      border-top: 1px solid var(--color-border);
      padding: 16px 24px;
      box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.28);
      z-index: 9990;
      animation: kantoBannerSlideUp 0.25s ease-out;
    }

    @keyframes kantoBannerSlideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }

    .cookie-banner-wrap {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;
    }

    .cookie-banner-text-wrap {
      flex: 1 1 450px;
    }

    .cookie-banner-title {
      font-size: 13.5px;
      font-weight: 700;
      color: var(--color-heading);
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .cookie-banner-desc {
      font-size: 12px;
      color: var(--color-text-secondary);
      line-height: 1.45;
      margin: 0;
    }

    .cookie-banner-actions {
      display: flex;
      align-items: center;
      gap: 9px;
      flex-wrap: wrap;
    }

    .cookie-btn {
      padding: 8px 15px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }

    .cookie-btn-primary {
      background: var(--color-tanimbary-dark);
      color: #FFFFFF;
      border: 1px solid var(--color-tanimbary);
    }

    .cookie-btn-primary:hover {
      background: #1f5c39;
    }

    .cookie-btn-secondary {
      background: var(--color-surface-input);
      color: var(--color-text);
      border: 1px solid var(--color-border);
    }

    .cookie-btn-secondary:hover {
      background: var(--color-surface-hover);
    }

    .cookie-btn-outline {
      background: transparent;
      color: var(--color-text-secondary);
      border: 1px dashed var(--color-border);
    }

    .cookie-category-item {
      padding: 14px 16px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      margin-bottom: 12px;
      background: var(--color-surface-input);
    }

    .cookie-category-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
    }

    .cookie-category-label {
      font-size: 13px;
      font-weight: 700;
      color: var(--color-heading);
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .cookie-badge-req {
      font-size: 10px;
      font-weight: 700;
      color: var(--color-tanimbary);
      background: rgba(107, 158, 97, 0.15);
      padding: 2px 7px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .kanto-switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
      flex-shrink: 0;
    }

    .kanto-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .kanto-slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: var(--color-border);
      transition: .25s ease;
      border-radius: 24px;
    }

    .kanto-slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .25s ease;
      border-radius: 50%;
    }

    .kanto-switch input:checked + .kanto-slider {
      background-color: var(--color-tanimbary);
    }

    .kanto-switch input:checked + .kanto-slider:before {
      transform: translateX(20px);
    }

    @media (max-width: 680px) {
      .download-grid, .platform-cards, .platform-status-grid {
        grid-template-columns: 1fr;
      }
      .tabs-nav {
        font-size: 11.5px;
      }
      .tab-btn {
        padding: 9px 6px;
        font-size: 11.5px;
      }
      .progress-stepper {
        overflow-x: auto;
        padding-bottom: 8px;
      }
      .progress-step-item {
        min-width: 72px;
      }
      .cookie-banner-wrap {
        flex-direction: column;
        align-items: stretch;
      }
    }
  </style>
</head>
<body>

  <!-- En-tête officiel Kanto MG -->
  <header>
    <a href="/" class="brand" aria-label="kanto.mg - Bêta-test">
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
        <span class="brand-tag">Bêta • Android &amp; iOS</span>
      </div>
    </a>
    <div class="header-actions">
      <button type="button" class="theme-toggle-btn" id="theme-toggle" aria-label="Changer de thème">
        <svg id="theme-icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        <svg id="theme-icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      </button>
      <div class="status-pill">
        <span class="status-indicator"></span>
        <span id="header-tester-count">${countBadgeText}</span>
      </div>
    </div>
  </header>

  <!-- Contenu Principal -->
  <main>
    <div class="intro">
      <span class="section-eyebrow">Patrimoine, Langue &amp; Culture Malgache</span>
      <h1>Portail Officiel Kanto MG</h1>
      <p class="intro-description">
        Téléchargez Kanto MG, participez aux tests en avant-première sur Android et iOS, et contribuez à faire rayonner la sagesse des contes et proverbes de Madagascar.
      </p>
    </div>

    <div class="card">
      <!-- Navigation principale à 2 options : Inscription Bêta en premier, puis Téléchargement -->
      <div class="tabs-nav">
        <button type="button" class="tab-btn ${initialTab === 'register' && !isRegistered ? 'active' : ''}" id="tab-btn-register">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          <span>Inscription Bêta</span>
        </button>
        <button type="button" class="tab-btn ${initialTab === 'download' ? 'active' : ''}" id="tab-btn-download">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>Téléchargement</span>
        </button>
      </div>

      <!-- Bandeaux d'alerte -->
      <div id="error-banner" class="banner error">
        <span id="error-text">${errorVal}</span>
      </div>
      <div id="success-banner" class="banner success">
        <span id="success-text"></span>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════════════ -->
      <!-- VOLET 1 : FORMULAIRE D'INSCRIPTION BÊTA (PRIORITAIRE)                                -->
      <!-- ═══════════════════════════════════════════════════════════════════════ -->
      <div id="panel-register" style="display: ${initialTab === 'register' && !isRegistered ? 'block' : 'none'};">
        <form id="waitlist-form">
          <div class="hp-trap">
            <input type="text" id="hp-website" name="website" tabindex="-1" autocomplete="off">
          </div>

          <div class="field">
            <label class="field-label" for="reg-email">
              <span>Votre adresse e-mail</span>
              <span style="color: var(--color-tanimbary);">Requis</span>
            </label>
            <input 
              type="email" 
              id="reg-email" 
              class="field-input" 
              placeholder="votre.email@gmail.com ou icloud.com" 
              required 
              value="${emailVal}"
              autocomplete="email"
            >
            <p class="field-note">
              Utilisez l'adresse associée à votre compte Google Play ou votre identifiant Apple.
            </p>
          </div>

          <div class="field">
            <label class="field-label" for="reg-name">
              <span>Votre prénom ou nom</span>
              <span style="color: var(--color-text-muted);">Optionnel</span>
            </label>
            <input 
              type="text" 
              id="reg-name" 
              class="field-input" 
              placeholder="Ex: Rado, Bakoly, Andry..." 
              autocomplete="name"
            >
          </div>

          <div class="field">
            <label class="field-label">
              <span>Plateforme(s) de test souhaitée(s)</span>
              <span style="color: var(--color-tanimbary);">Sélectionnez au moins une</span>
            </label>
            <div class="platform-cards">
              <div class="platform-card checked" id="card-android">
                <div class="platform-checkbox">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div>
                  <div class="platform-title">Android</div>
                  <div class="platform-sub">Google Play Closed Testing</div>
                </div>
              </div>
              <div class="platform-card" id="card-ios">
                <div class="platform-checkbox">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div>
                  <div class="platform-title">iOS (iPhone &amp; iPad)</div>
                  <div class="platform-sub">Apple TestFlight</div>
                </div>
              </div>
            </div>
          </div>

          <div class="terms-card">
            <label class="terms-box" for="reg-terms">
              <input type="checkbox" id="reg-terms" required checked>
              <span>
                J'accepte les <button type="button" class="btn-terms-link" id="btn-open-cgu-modal">Conditions Générales d'Utilisation (CGU)</button> et j'ai pris connaissance de la <button type="button" class="btn-terms-link" id="btn-open-privacy-modal">Politique de Confidentialité</button>.
              </span>
            </label>
            <div class="terms-micro-info">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="flex-shrink:0;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span>Chiffrement AES-256-GCM. Zéro mot de passe stocké. Zéro publicité, zéro revente. Désinscription en 1 clic.</span>
            </div>
          </div>

          <button type="submit" class="btn-submit" id="btn-submit-reg">
            <span>Rejoindre le programme bêta</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <div class="already-registered-hint">
            <span>Déjà inscrit au programme ?</span>
            <button type="button" class="link-already-trigger" id="link-open-already">
              Consulter mon espace testeur &rarr;
            </button>
          </div>
        </form>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════════════ -->
      <!-- VOLET 2 : ESPACE DE TÉLÉCHARGEMENT KANTO MG                            -->
      <!-- ═══════════════════════════════════════════════════════════════════════ -->
      <div id="panel-download" style="display: ${initialTab === 'download' ? 'block' : 'none'};">
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 17px; font-weight: 700; color: var(--color-heading); margin-bottom: 4px;">
            Accéder à l'application Kanto MG
          </h2>
          <p style="font-size: 13px; color: var(--color-text-secondary);">
            Installez Kanto MG selon votre appareil. Consultez ci-dessous les statuts de disponibilité en direct.
          </p>
        </div>

        <div class="download-grid">
          <!-- Carte Android -->
          <div class="download-card">
            <div class="download-card-header">
              <div class="download-platform-icon-wrap download-platform-icon-android">
                <!-- SVG Android officiel -->
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.411 13.8533 8.081 12 8.081s-3.5902.33-5.1367.8697L4.841 5.4477a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 10.9315.3432 14.5262 0 18.7997h24c-.3432-4.2735-2.6889-7.8682-6.1185-9.4783"/>
                </svg>
              </div>
              <span id="dl-android-badge" class="download-avail-pill download-avail-beta">
                Programme Bêta
              </span>
            </div>

            <div class="download-card-title">Kanto MG pour Android</div>
            <div class="download-card-desc" id="dl-android-desc">
              Participez au Closed Testing officiel Google Play. Recommandé pour Android 8.0 et supérieur.
            </div>

            <div class="download-version-box" id="dl-android-version-box">
              <span>Version actuelle : <strong id="dl-android-version-label">v0.1.0</strong></span>
              <span id="dl-android-build-label">Build 31</span>
            </div>

            <div class="download-card-actions">
              <a href="https://play.google.com/apps/testing/com.devengalere.kantomg" target="_blank" rel="noopener noreferrer" class="btn-download-primary btn-download-android" id="dl-btn-android-main">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 3l14 9-14 9V3z"></path></svg>
                <span id="dl-btn-android-main-text">Rejoindre le test Google Play</span>
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.devengalere.kantomg" target="_blank" rel="noopener noreferrer" class="btn-download-secondary" id="dl-btn-android-store">
                <span>Fiche Google Play Store</span>
              </a>
            </div>

            <div class="download-quick-steps">
              <strong>Marche à suivre Android :</strong>
              <ol>
                <li>Inscrivez votre e-mail de compte Google.</li>
                <li>Cliquez sur « Rejoindre le test Google Play ».</li>
                <li>Téléchargez Kanto MG sur le Store.</li>
              </ol>
            </div>
          </div>

          <!-- Carte iOS -->
          <div class="download-card">
            <div class="download-card-header">
              <div class="download-platform-icon-wrap download-platform-icon-ios">
                <!-- SVG Apple officiel -->
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.88c.67-.82 1.13-1.96 1-3.11-.98.04-2.15.65-2.85 1.47-.62.72-1.16 1.88-1.01 3 .01 0 .02 0 .03 0 1.07 0 2.16-.54 2.83-1.36z"/>
                </svg>
              </div>
              <span id="dl-ios-badge" class="download-avail-pill download-avail-beta">
                Apple TestFlight
              </span>
            </div>

            <div class="download-card-title">Kanto MG pour Apple iOS</div>
            <div class="download-card-desc" id="dl-ios-desc">
              Accès anticipé via l'application Apple TestFlight pour iPhone et iPad sous iOS 16 ou ultérieur.
            </div>

            <div class="download-version-box" id="dl-ios-version-box">
              <span>Version actuelle : <strong id="dl-ios-version-label">v0.1.0</strong></span>
              <span id="dl-ios-build-label">Build 31</span>
            </div>

            <div class="download-card-actions">
              <a href="https://testflight.apple.com/join/kantomg" target="_blank" rel="noopener noreferrer" class="btn-download-primary btn-download-ios" id="dl-btn-ios-main">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                <span id="dl-btn-ios-main-text">Rejoindre le test TestFlight</span>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" class="btn-download-secondary" id="dl-btn-ios-store" style="display: none;">
                <span>Télécharger sur l'App Store</span>
              </a>
            </div>

            <div class="download-quick-steps">
              <strong>Marche à suivre iOS :</strong>
              <ol>
                <li>Installez l'application <em>Apple TestFlight</em> sur l'App Store.</li>
                <li>Cliquez sur « Rejoindre le test TestFlight ».</li>
                <li>Acceptez l'invitation et installez Kanto MG.</li>
              </ol>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--color-divider);">
          <span style="font-size: 13px; color: var(--color-text-secondary);">
            Vous souhaitez suivre votre statut ou recevoir vos invitations ?
          </span>
          <button type="button" class="btn-terms-link" id="btn-switch-to-register" style="margin-left: 6px; font-size: 13px;">
            Rejoindre le programme bêta →
          </button>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════════════ -->
      <!-- VOLET 3 : MON ESPACE TESTEUR, PROGRESSION & CONFIRMATION               -->
      <!-- ═══════════════════════════════════════════════════════════════════════ -->
      <div id="panel-already" style="display: ${initialTab === 'already_registered' || isRegistered ? 'block' : 'none'};">
        <div style="margin-bottom: 16px;">
          <button type="button" class="btn-back-to-reg" id="btn-back-to-register">
            &larr; Retour à l'inscription bêta
          </button>
        </div>
        <!-- Formulaire de recherche par email si non encore chargé -->
        <form id="status-check-form" style="margin-bottom: 20px;">
          <div class="field">
            <label class="field-label" for="check-email">
              <span>Accéder à mon espace personnel</span>
            </label>
            <div style="display: flex; gap: 8px;">
              <input 
                type="email" 
                id="check-email" 
                class="field-input" 
                placeholder="votre.email@gmail.com" 
                value="${emailVal}" 
                required
              >
              <button type="submit" class="btn-submit" id="btn-check-status" style="width: auto; padding: 0 20px; white-space: nowrap;">
                Consulter
              </button>
            </div>
            <p class="field-note">
              Renseignez l'adresse e-mail avec laquelle vous vous êtes inscrit au programme.
            </p>
          </div>
        </form>

        <!-- Espace Personnel du Testeur -->
        <div class="status-result" id="status-result-box" style="display: none;">
          <!-- En-tête Espace Testeur -->
          <div class="tester-header-card">
            <div>
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--color-text-muted); margin-bottom: 2px;">
                Participant Bêta Kanto
              </div>
              <div style="font-size: 16px; font-weight: 700; color: var(--color-heading);" id="tester-email-lbl">
                —
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="tester-status-badge badge-inscrit" id="tester-status-badge">
                INSCRIT
              </span>
            </div>
          </div>

          <!-- Barre de progression visuelle en 5 étapes -->
          <div style="margin-bottom: 6px;">
            <div style="font-size: 12px; font-weight: 700; color: var(--color-heading); margin-bottom: 4px;">
              Parcours du Bêta-Testeur Kanto MG
            </div>
            <p style="font-size: 11.5px; color: var(--color-text-secondary); margin: 0;">
              Suivez vos étapes d'accès et validez votre participation.
            </p>
          </div>

          <div class="progress-stepper" id="tester-progress-stepper">
            <div class="progress-step-item completed" id="step-node-1">
              <div class="step-bullet">✓</div>
              <div class="step-label">1. Inscription</div>
            </div>
            <div class="progress-step-item current" id="step-node-2">
              <div class="step-bullet">2</div>
              <div class="step-label">2. Accès</div>
            </div>
            <div class="progress-step-item" id="step-node-3">
              <div class="step-bullet">3</div>
              <div class="step-label">3. Rejoindre</div>
            </div>
            <div class="progress-step-item" id="step-node-4">
              <div class="step-bullet">4</div>
              <div class="step-label">4. Installation</div>
            </div>
            <div class="progress-step-item" id="step-node-5">
              <div class="step-bullet">5</div>
              <div class="step-label">5. Retours</div>
            </div>
          </div>

          <!-- BOÎTE D'ACTION PRINCIPALE : CONFIRMATION DE PARTICIPATION -->
          <div class="tester-action-box" id="tester-action-box">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--color-tanimbary-dark); color: #FFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div>
                <div style="font-size: 13.5px; font-weight: 700; color: var(--color-heading);" id="action-box-title">
                  Valider votre participation au programme
                </div>
                <div style="font-size: 12px; color: var(--color-text-secondary); line-height: 1.45;" id="action-box-desc">
                  Une fois que vous avez rejoint le groupe sur Google Play ou accepté TestFlight, confirmez votre accès ci-dessous.
                </div>
              </div>
            </div>

            <!-- Bouton interactif : J'ai rejoint le programme -->
            <button type="button" class="btn-confirm-action" id="btn-confirm-joined">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span>J'ai rejoint le programme bêta</span>
            </button>

            <!-- Bouton interactif secondaire : J'ai installé Kanto MG -->
            <button type="button" class="btn-installed-action" id="btn-confirm-installed" style="display: none;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
              <span>J'ai installé Kanto MG sur mon appareil</span>
            </button>
          </div>

          <!-- Grille des statuts par plateforme pour le testeur -->
          <div class="platform-status-grid">
            <!-- Statut Android -->
            <div class="platform-status-card" id="card-status-android">
              <div class="platform-status-header">
                <span style="font-weight: 700; font-size: 13px;">Google Play (Android)</span>
                <span class="badge-status badge-pending" id="badge-status-android">En attente</span>
              </div>
              <p style="font-size: 11.5px; color: var(--color-text-muted); min-height: 34px;" id="desc-status-android">
                Accès au Closed Testing Google Play.
              </p>
              <div id="action-android-container">
                <a href="#" target="_blank" class="btn-store btn-store-android" id="link-play-web" style="display: none;">
                  Rejoindre le test Google Play
                </a>
              </div>
            </div>

            <!-- Statut iOS -->
            <div class="platform-status-card" id="card-status-ios">
              <div class="platform-status-header">
                <span style="font-weight: 700; font-size: 13px;">Apple TestFlight (iOS)</span>
                <span class="badge-status badge-pending" id="badge-status-ios">En attente</span>
              </div>
              <p style="font-size: 11.5px; color: var(--color-text-muted); min-height: 34px;" id="desc-status-ios">
                Accès via Apple TestFlight.
              </p>
              <div id="action-ios-container">
                <a href="#" target="_blank" class="btn-store btn-store-ios" id="link-testflight" style="display: none;">
                  Ouvrir dans TestFlight
                </a>
              </div>
            </div>
          </div>

          <!-- Bloc Version Actuelle & Nouveautés -->
          <div id="tester-version-card" style="display: none; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 14px; margin: 14px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 12.5px; font-weight: 700; color: var(--color-heading);" id="tvc-title">
                Version bêta active
              </span>
              <span style="font-size: 11px; color: var(--color-tanimbary); font-weight: 600;" id="tvc-version-badge">
                v0.1.0 (build 31)
              </span>
            </div>
            <div style="font-size: 12px; color: var(--color-text-secondary); line-height: 1.5;" id="tvc-notes">
              Améliorations de performance, nouveaux contes malgaches et navigation optimisée.
            </div>
          </div>

          <!-- Guides dépliables -->
          <div class="guide-accordion">
            <div class="guide-accordion-header" id="guide-toggle-btn">
              <span>Instructions détaillées pas-à-pas (Android &amp; iOS)</span>
              <span id="guide-chevron">▼</span>
            </div>
            <div class="guide-accordion-content" id="guide-content" style="display: none;">
              <div style="margin-bottom: 12px;">
                <strong style="color: var(--color-heading); display: block; margin-bottom: 4px;">Android (Google Play) :</strong>
                <p id="guide-text-android" style="margin-bottom: 8px;">
                  1. Connectez-vous sur votre navigateur avec l'adresse e-mail inscrite.<br>
                  2. Cliquez sur « Rejoindre le test Google Play » et validez « Devenir testeur ».<br>
                  3. Téléchargez ensuite Kanto MG depuis le Play Store.<br>
                  4. Revenez ici et cliquez sur « J'ai rejoint le programme bêta ».
                </p>
              </div>
              <div>
                <strong style="color: var(--color-heading); display: block; margin-bottom: 4px;">Apple iOS :</strong>
                <p id="guide-text-ios">
                  1. Installez gratuitement l'application <em>Apple TestFlight</em> sur l'App Store.<br>
                  2. Cliquez sur « Ouvrir dans TestFlight » sur votre iPhone ou iPad.<br>
                  3. Acceptez l'invitation et installez Kanto MG.<br>
                  4. Revenez ici et cliquez sur « J'ai rejoint le programme bêta ».
                </p>
              </div>
            </div>
          </div>

          <!-- Actions supplémentaires : renvoi liens, mise à jour, retour bug, désinscription -->
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 16px;">
            <button type="button" class="btn-secondary" id="btn-resend-links">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span>Renvoyer mes liens d'accès par e-mail</span>
            </button>

            <a href="/feedback" class="btn-secondary" style="text-decoration: none;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              <span>Partager une suggestion ou signaler une anomalie</span>
            </a>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; font-size: 11.5px;">
              <button type="button" id="btn-toggle-update-plat" style="background: none; border: none; color: var(--color-tanimbary); cursor: pointer; text-decoration: underline;">
                Modifier mes plateformes de test
              </button>
              <button type="button" id="btn-open-unsubscribe" style="background: none; border: none; color: var(--color-error); cursor: pointer;">
                Me désinscrire
              </button>
            </div>

            <!-- Formulaire inline de mise à jour des plateformes -->
            <div id="box-update-platforms" style="display: none; padding: 14px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); margin-top: 8px; background: var(--color-surface);">
              <span style="font-size: 12px; font-weight: 700; display: block; margin-bottom: 8px;">
                Mettre à jour mes plateformes de test :
              </span>
              <label style="display: block; font-size: 12px; margin-bottom: 6px; cursor: pointer;">
                <input type="checkbox" id="chk-update-android"> Participer au test Android (Google Play)
              </label>
              <label style="display: block; font-size: 12px; margin-bottom: 12px; cursor: pointer;">
                <input type="checkbox" id="chk-update-ios"> Participer au test iOS (Apple TestFlight)
              </label>
              <button type="button" id="btn-submit-update-plat" class="btn-submit" style="padding: 8px 14px; font-size: 12px; min-height: 38px;">
                Enregistrer mes modifications
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════════════ -->
      <!-- VOLET 4 : DÉSINCRIPTION RGPD                                           -->
      <!-- ═══════════════════════════════════════════════════════════════════════ -->
      <div id="panel-unsubscribe" style="display: ${initialTab === 'unsubscribe' ? 'block' : 'none'};">
        <h3 style="font-size: 16px; font-weight: 700; color: var(--color-heading); margin-bottom: 8px;">
          Désinscription du programme bêta
        </h3>
        <p style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 16px; line-height: 1.5;">
          Conformément au RGPD, vous êtes libre de vous retirer à tout moment. Vos accès de test fermé seront révoqués et vous ne recevrez plus aucune sollicitation.
        </p>

        <!-- Formulaire de désinscription -->
        <form id="unsub-form">
          <input type="hidden" id="unsub-token" value="${tokenVal}">
          <div class="field">
            <label class="field-label" for="unsub-email">Votre adresse e-mail de testeur</label>
            <input type="email" id="unsub-email" class="field-input" value="${emailVal}" required placeholder="ex: testeur@gmail.com">
          </div>

          <div class="field" style="margin-bottom: 14px;">
            <label class="field-label" style="margin-bottom: 6px;">Motif de votre retrait (optionnel) :</label>
            <div class="unsub-chips">
              <button type="button" class="unsub-chip" data-reason="Incompatibilité avec mon appareil">Appareil non compatible</button>
              <button type="button" class="unsub-chip" data-reason="Manque de temps pour tester">Manque de temps</button>
              <button type="button" class="unsub-chip" data-reason="Trop de notifications">Trop de notifications</button>
              <button type="button" class="unsub-chip" data-reason="Simple curiosité">Simple curiosité</button>
              <button type="button" class="unsub-chip" data-reason="Autre motif">Autre motif</button>
            </div>
            <input type="text" id="unsub-reason" class="field-input" placeholder="Précisez votre motif ou laissez vide..." style="font-size: 12.5px;">
          </div>

          <p style="font-size: 11.5px; color: var(--color-text-muted); margin-bottom: 14px; line-height: 1.4;">
            Un accusé de réception officiel de désinscription vous sera immédiatement envoyé par e-mail.
          </p>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button type="submit" id="btn-unsub-submit" class="btn-submit" style="background: var(--color-error); border-color: var(--color-error);">
              Confirmer ma désinscription
            </button>
            <button type="button" id="btn-unsub-cancel" class="btn-secondary" style="margin-top: 0;">
              Conserver mon inscription (Annuler)
            </button>
          </div>
        </form>

        <!-- Écran de confirmation post-désinscription chaleureux -->
        <div id="unsub-success-box" class="unsub-confirm-card">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(107, 158, 97, 0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; color: var(--color-tanimbary);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h4 style="font-size: 15px; font-weight: 700; color: var(--color-heading); margin-bottom: 6px;">
            Désinscription confirmée
          </h4>
          <p id="unsub-success-msg" style="font-size: 12.5px; color: var(--color-text-secondary); line-height: 1.5; margin-bottom: 14px;">
            Votre adresse a été retirée de nos listes de diffusion. Un e-mail récapitulatif vous a été envoyé.
          </p>
          <div style="font-size: 12px; font-style: italic; color: var(--color-text-muted); margin-bottom: 18px;">
            Misaotra betsaka amin'ny fotoana natokanao ho an'ny Kanto MG.
          </div>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
            <button type="button" id="btn-unsub-home" class="btn-submit" style="width: auto; padding: 9px 18px; font-size: 12.5px;">
              Retour à l'accueil
            </button>
            <button type="button" id="btn-unsub-resubscribe" class="btn-secondary" style="width: auto; padding: 9px 18px; margin-top: 0; font-size: 12.5px; color: var(--color-tanimbary); border-color: var(--color-tanimbary);">
              Changer d'avis et se réinscrire
            </button>
          </div>
        </div>
      </div>

    </div>
  </main>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- MODALE 1 : CONDITIONS GÉNÉRALES D'UTILISATION (CGU) BÊTA               -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <div id="kanto-cgu-modal" class="kanto-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="cgu-modal-title" style="display: none;">
    <div class="kanto-modal-card">
      <div class="kanto-modal-head">
        <h2 id="cgu-modal-title" class="kanto-modal-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-tanimbary);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
          <span>Conditions Générales d'Utilisation • Programme Bêta</span>
        </h2>
        <button type="button" id="cgu-modal-close" class="kanto-modal-close" aria-label="Fermer la modale CGU">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="kanto-modal-scroll">
        <div class="cgu-highlight-box">
          <strong>Esprit Kanto MG : Fihavanana &amp; Haja</strong><br>
          En rejoignant le programme bêta, vous devenez pionnier d'un sanctuaire numérique dédié au patrimoine, aux contes (<em>Angano</em>), proverbes (<em>Ohabolana</em>) et traditions de Madagascar.
        </div>

        <h3>1. Objet du Programme Bêta</h3>
        <p>Le programme permet de tester en avant-première les versions préliminaires de Kanto MG sur Google Play Closed Testing (Android) et Apple TestFlight (iOS), d'identifier les anomalies et d'émettre des retours avant la publication grand public.</p>

        <h3>2. Confidentialité &amp; Respect des Préversions</h3>
        <p>Les versions de test contiennent des fonctionnalités inédites, des voix et des visuels originaux en cours d'affinage. Vous vous engagez à ne pas extraire ni rediffuser publiquement les fichiers d'installation (.apk, .aab ou profils TestFlight) en dehors de votre usage de testeur.</p>

        <h3>3. Retours &amp; Signalement d'Anomalies</h3>
        <p>Vos retours et signalements de bugs peuvent être formulés directement depuis l'application mobile ou via la page de retours du portail. Vous autorisez l'équipe Kanto à exploiter ces retours techniques pour l'amélioration continue de l'application.</p>

        <h3>4. Disponibilité des Versions de Test</h3>
        <p>Les versions de test peuvent comporter des instabilités temporaires. Kanto MG met tout en œuvre pour offrir une expérience fluide tout en maintenant la sécurité de vos appareils.</p>

        <h3>5. Propriété Intellectuelle</h3>
        <p>L'ensemble des contenus culturels, graphismes, textes, proverbes et contes demeurent protégés par les droits de propriété intellectuelle applicables. Toute reproduction non autorisée est prohibée.</p>

        <h3>6. Résiliation &amp; Support</h3>
        <p>Vous conservez la liberté totale de vous retirer du programme à tout instant en 1 clic. Contact officiel : <a href="mailto:${supportEmail}" style="color: var(--color-tanimbary); font-weight: 600;">${supportEmail}</a>.</p>
      </div>
      <div class="kanto-modal-foot">
        <a href="${legalBaseUrl}/pages/terms" target="_blank" rel="noopener noreferrer" style="font-size: 12px; color: var(--color-text-secondary); text-decoration: underline;">
          Ouvrir les CGU complètes en pleine page ↗
        </a>
        <button type="button" id="cgu-modal-btn-accept" class="cookie-btn cookie-btn-primary">
          J'ai compris et j'accepte
        </button>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- MODALE 2 : POLITIQUE DE CONFIDENTIALITÉ (RGPD)                         -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <div id="kanto-privacy-modal" class="kanto-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="privacy-modal-title" style="display: none;">
    <div class="kanto-modal-card">
      <div class="kanto-modal-head">
        <h2 id="privacy-modal-title" class="kanto-modal-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-tanimbary);"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <span>Politique de Confidentialité • RGPD &amp; Protection des Données</span>
        </h2>
        <button type="button" id="privacy-modal-close" class="kanto-modal-close" aria-label="Fermer la politique de confidentialité">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="kanto-modal-scroll">
        <div class="cgu-highlight-box">
          <strong>Transparence &amp; Minimisation des données</strong><br>
          Kanto MG applique le principe de minimisation stricte du RGPD. Nous ne collectons aucun mot de passe, aucune donnée bancaire et ne procédons à aucun traçage commercial.
        </div>

        <h3>1. Responsable de Traitement</h3>
        <p>Le traitement des données personnelles dans le cadre du programme bêta est opéré par l'équipe Kanto MG. Délégué à la protection des données : <a href="mailto:${supportEmail}" style="color: var(--color-tanimbary); font-weight: 600;">${supportEmail}</a>.</p>

        <h3>2. Données Collectées</h3>
        <ul>
          <li><strong>Adresse e-mail :</strong> Nécessaire pour autoriser votre compte sur Google Play Console ou Apple TestFlight.</li>
          <li><strong>Nom / Prénom (optionnel) :</strong> Utilisé uniquement pour personnaliser nos correspondances.</li>
          <li><strong>Plateforme sélectionnée :</strong> Android et/ou iOS.</li>
          <li><strong>Métadonnées techniques :</strong> Version d'OS ou modèle d'appareil fournis lors d'un signalement de bug volontaire.</li>
        </ul>

        <h3>3. Finalités &amp; Base Légale</h3>
        <p>Vos données sont traitées sur la base de votre <strong>consentement explicite</strong> (Article 6.1.a du RGPD) dans le but exclusif de gérer les accès au test fermé, d'envoyer les invitations et de traiter vos signalements de bugs.</p>

        <h3>4. Mesures de Sécurité Rigoureuses</h3>
        <p>Votre adresse e-mail est chiffrée au repos à l'aide de l'algorithme cryptographique <strong>AES-256-GCM</strong>. Pour les recherches sans déchiffrement, une empreinte indexée irréversible <strong>HMAC-SHA-256</strong> est utilisée. Aucun tiers non autorisé ne peut accéder à vos identifiants.</p>

        <h3>5. Durée de Conservation &amp; Droit à l'Effacement</h3>
        <p>Vos données sont conservées pendant la durée active du programme de test. Vous disposez d'un <strong>droit d'accès, de rectification et d'effacement immédiat</strong>. Vous pouvez exercer ce droit à tout moment via le lien de désinscription en 1 clic présent dans chaque e-mail ou sur ce portail.</p>
      </div>
      <div class="kanto-modal-foot">
        <a href="${legalBaseUrl}/pages/privacy" target="_blank" rel="noopener noreferrer" style="font-size: 12px; color: var(--color-text-secondary); text-decoration: underline;">
          Ouvrir la politique complète en pleine page ↗
        </a>
        <button type="button" id="privacy-modal-btn-accept" class="cookie-btn cookie-btn-primary">
          Fermer
        </button>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- MODALE 3 : GESTION DES COOKIES & CONSENTEMENT                          -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <aside id="kanto-cookie-banner" class="cookie-banner" role="region" aria-label="Gestion des cookies" style="display: none;">
    <div class="cookie-banner-wrap">
      <div class="cookie-banner-text-wrap">
        <div class="cookie-banner-title">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-tanimbary);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <span>Respect de votre vie privée &amp; Cookies</span>
        </div>
        <p class="cookie-banner-desc">
          Nous utilisons des cookies strictement nécessaires au fonctionnement technique et, avec votre accord, des cookies pour mémoriser vos préférences d'affichage. Zéro profilage publicitaire.
        </p>
      </div>
      <div class="cookie-banner-actions">
        <button type="button" id="cookie-btn-accept-all" class="cookie-btn cookie-btn-primary">Tout accepter</button>
        <button type="button" id="cookie-btn-reject-all" class="cookie-btn cookie-btn-secondary">Continuer sans accepter</button>
        <button type="button" id="cookie-btn-customize" class="cookie-btn cookie-btn-outline">Personnaliser</button>
      </div>
    </div>
  </aside>

  <div id="kanto-cookie-modal" class="kanto-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title" style="display: none;">
    <div class="kanto-modal-card">
      <div class="kanto-modal-head">
        <h2 id="cookie-modal-title" class="kanto-modal-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-tanimbary);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <span>Préférences de confidentialité &amp; Cookies</span>
        </h2>
        <button type="button" id="cookie-modal-close" class="kanto-modal-close" aria-label="Fermer la gestion des cookies">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="kanto-modal-scroll">
        <p style="font-size: 12.5px; color: var(--color-text-secondary); margin-bottom: 16px;">
          Kanto MG respecte la réglementation RGPD et la directive ePrivacy. Personnalisez vos catégories de traceurs.
        </p>
        <div class="cookie-category-item">
          <div class="cookie-category-header">
            <div>
              <span class="cookie-category-label">1. Traceurs strictement nécessaires</span>
              <span class="cookie-badge-req">Obligatoire</span>
            </div>
            <label class="kanto-switch" aria-label="Traceurs nécessaires obligatoires">
              <input type="checkbox" id="cookie-opt-necessary" checked disabled>
              <span class="kanto-slider"></span>
            </label>
          </div>
          <p style="font-size: 11.5px; color: var(--color-text-muted); margin: 0;">
            Indispensables au fonctionnement technique, à la protection anti-spam et à la mémorisation de vos préférences.
          </p>
        </div>

        <div class="cookie-category-item">
          <div class="cookie-category-header">
            <div>
              <span class="cookie-category-label">2. Préférences d'affichage (Thème)</span>
            </div>
            <label class="kanto-switch" aria-label="Traceurs de préférences">
              <input type="checkbox" id="cookie-opt-preferences" checked>
              <span class="kanto-slider"></span>
            </label>
          </div>
          <p style="font-size: 11.5px; color: var(--color-text-muted); margin: 0;">
            Permet de conserver votre thème d'affichage préféré (sombre ou clair).
          </p>
        </div>
      </div>
      <div class="kanto-modal-foot">
        <button type="button" id="cookie-modal-btn-reject" class="cookie-btn cookie-btn-secondary">
          Tout refuser (sauf nécessaires)
        </button>
        <button type="button" id="cookie-modal-btn-save" class="cookie-btn cookie-btn-primary">
          Enregistrer mes préférences
        </button>
      </div>
    </div>
  </div>

  <!-- Pied de page officiel Kanto MG -->
  <footer>
    <div class="footer-nav">
      <button type="button" class="footer-link-my-space" id="footer-link-my-space">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: -1px; margin-right: 4px;">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Vérifier mon espace testeur</span>
      </button>
      <a href="${legalBaseUrl}/pages/terms" id="footer-link-cgu">Conditions d'utilisation (CGU)</a>
      <a href="${legalBaseUrl}/pages/privacy" id="footer-link-privacy">Confidentialité &amp; RGPD</a>
      <a href="/feedback" class="footer-link-feedback">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: -1px; margin-right: 4px;">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        <span>Signaler une anomalie / Retour</span>
      </a>
      <button type="button" class="footer-cookie-btn" id="btn-cookie-settings">Gestion des cookies</button>
      <a href="mailto:${supportEmail}">Support officiel (${supportEmail})</a>
    </div>
    <div style="font-size: 11px;">
      © ${currentYear} kanto.mg • Lova, Kolontsaina &amp; Tantara Malagasy
    </div>
  </footer>

  <script src="/beta-waitlist.js"></script>
</body>
</html>`.trim();
}

/**
 * Script externe client servi sur /beta-waitlist.js (strict CSP).
 */
export function renderBetaWaitlistScript(): string {
  return `
(function() {
  // Onglets & Panneaux
  var tabDl = document.getElementById('tab-btn-download');
  var tabReg = document.getElementById('tab-btn-register');
  var tabAlr = document.getElementById('tab-btn-already');

  var pnlDl = document.getElementById('panel-download');
  var pnlReg = document.getElementById('panel-register');
  var pnlAlr = document.getElementById('panel-already');
  var pnlUnsub = document.getElementById('panel-unsubscribe');

  var errBanner = document.getElementById('error-banner');
  var errText = document.getElementById('error-text');
  var succBanner = document.getElementById('success-banner');
  var succText = document.getElementById('success-text');

  var currentTesterEmail = '';
  var downloadData = null;

  // Sélecteur de plateformes dans l'inscription
  var cardAndroid = document.getElementById('card-android');
  var cardIos = document.getElementById('card-ios');
  var selectedPlatforms = ['ANDROID'];

  function updatePlatformCards() {
    if (cardAndroid) {
      if (selectedPlatforms.indexOf('ANDROID') !== -1) {
        cardAndroid.classList.add('checked');
      } else {
        cardAndroid.classList.remove('checked');
      }
    }
    if (cardIos) {
      if (selectedPlatforms.indexOf('IOS') !== -1) {
        cardIos.classList.add('checked');
      } else {
        cardIos.classList.remove('checked');
      }
    }
  }

  if (cardAndroid) {
    cardAndroid.addEventListener('click', function() {
      var idx = selectedPlatforms.indexOf('ANDROID');
      if (idx !== -1) {
        if (selectedPlatforms.length > 1) selectedPlatforms.splice(idx, 1);
      } else {
        selectedPlatforms.push('ANDROID');
      }
      updatePlatformCards();
    });
  }

  if (cardIos) {
    cardIos.addEventListener('click', function() {
      var idx = selectedPlatforms.indexOf('IOS');
      if (idx !== -1) {
        if (selectedPlatforms.length > 1) selectedPlatforms.splice(idx, 1);
      } else {
        selectedPlatforms.push('IOS');
      }
      updatePlatformCards();
    });
  }

  function hideBanners() {
    if (errBanner) errBanner.style.display = 'none';
    if (succBanner) succBanner.style.display = 'none';
  }

  function showError(msg) {
    if (errBanner && errText) {
      errText.innerText = msg;
      errBanner.style.display = 'flex';
      errBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function showSuccess(msg) {
    if (succBanner && succText) {
      succText.innerText = msg;
      succBanner.style.display = 'flex';
      succBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function switchTab(target) {
    hideBanners();
    if (tabDl) tabDl.classList.toggle('active', target === 'download');
    if (tabReg) tabReg.classList.toggle('active', target === 'register');
    if (tabAlr) tabAlr.classList.toggle('active', target === 'already');

    if (pnlDl) pnlDl.style.display = target === 'download' ? 'block' : 'none';
    if (pnlReg) pnlReg.style.display = target === 'register' ? 'block' : 'none';
    if (pnlAlr) pnlAlr.style.display = target === 'already' ? 'block' : 'none';
    if (pnlUnsub) pnlUnsub.style.display = target === 'unsubscribe' ? 'block' : 'none';

    try {
      var url = new URL(window.location);
      url.searchParams.set('tab', target);
      window.history.replaceState({}, '', url);
    } catch(e) {}
  }

  if (tabReg) tabReg.addEventListener('click', function() { switchTab('register'); });
  if (tabDl) tabDl.addEventListener('click', function() { switchTab('download'); });
  if (tabAlr) tabAlr.addEventListener('click', function() { switchTab('already'); });

  var linkOpenAlready = document.getElementById('link-open-already');
  if (linkOpenAlready) {
    linkOpenAlready.addEventListener('click', function(e) {
      if (e) e.preventDefault();
      switchTab('already');
      var container = document.getElementById('panel-already') || document.querySelector('.card');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      var checkEmailInput = document.getElementById('check-email');
      if (checkEmailInput) {
        setTimeout(function() {
          checkEmailInput.focus();
        }, 150);
      }
    });
  }

  var btnBackToRegister = document.getElementById('btn-back-to-register');
  if (btnBackToRegister) {
    btnBackToRegister.addEventListener('click', function() {
      switchTab('register');
    });
  }

  var btnSwitchToReg = document.getElementById('btn-switch-to-register');
  if (btnSwitchToReg) {
    btnSwitchToReg.addEventListener('click', function() { switchTab('register'); });
  }

  var footerMySpaceBtn = document.getElementById('footer-link-my-space');
  if (footerMySpaceBtn) {
    footerMySpaceBtn.addEventListener('click', function(e) {
      if (e) e.preventDefault();
      switchTab('already');
      var container = document.getElementById('panel-already') || document.querySelector('.main-card');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      var checkEmailInput = document.getElementById('check-email');
      if (checkEmailInput) {
        setTimeout(function() {
          checkEmailInput.focus();
        }, 150);
      }
    });
  }

  var openUnsubBtn = document.getElementById('btn-open-unsubscribe');
  if (openUnsubBtn) {
    openUnsubBtn.addEventListener('click', function() { switchTab('unsubscribe'); });
  }

  function maskEmailClient(em) {
    if (!em || em.indexOf('@') === -1) return em || '—';
    var parts = em.split('@');
    var user = parts[0];
    var domain = parts[1];
    var masked = user.length <= 2 
      ? user.charAt(0) + '***' 
      : (user.length <= 4 ? user.substring(0, 2) + '***' : user.substring(0, 3) + '***');
    return masked + '@' + domain;
  }

  // ─── CHARGEMENT DES INFOS DE TÉLÉCHARGEMENT EN TEMPS RÉEL ───
  async function loadDownloadInfo() {
    try {
      var res = await fetch('/api/beta-testers/download-info');
      if (!res.ok) return;
      var data = await res.json();
      downloadData = data;

      // Android
      var aBadge = document.getElementById('dl-android-badge');
      var aDesc = document.getElementById('dl-android-desc');
      var aBtnMain = document.getElementById('dl-btn-android-main');
      var aBtnMainText = document.getElementById('dl-btn-android-main-text');
      var aBtnStore = document.getElementById('dl-btn-android-store');
      var aVerLabel = document.getElementById('dl-android-version-label');
      var aBuildLabel = document.getElementById('dl-android-build-label');

      if (data.android) {
        var aAvail = data.android.availability || 'BETA_OPEN';
        if (aBadge) {
          aBadge.className = 'download-avail-pill ' + (
            aAvail === 'PUBLIC' ? 'download-avail-public' :
            aAvail === 'BETA_OPEN' ? 'download-avail-beta' :
            aAvail === 'BETA_CLOSED' ? 'download-avail-closed' :
            aAvail === 'PENDING' ? 'download-avail-pending' : 'download-avail-unavailable'
          );
          aBadge.innerText = (
            aAvail === 'PUBLIC' ? 'Version publique' :
            aAvail === 'BETA_OPEN' ? 'Programme Bêta ouvert' :
            aAvail === 'BETA_CLOSED' ? 'Bêta fermée' :
            aAvail === 'PENDING' ? 'Accès en attente' : 'Indisponible'
          );
        }

        if (aBtnMain) {
          if (aAvail === 'PUBLIC') {
            aBtnMain.href = data.android.playStoreAppLink || '#';
            if (aBtnMainText) aBtnMainText.innerText = 'Télécharger sur Google Play';
            if (aBtnStore) aBtnStore.style.display = 'none';
          } else if (aAvail === 'BETA_OPEN') {
            aBtnMain.href = data.android.playStoreWebLink || 'https://play.google.com/apps/testing/com.devengalere.kantomg';
            if (aBtnMainText) aBtnMainText.innerText = 'Rejoindre le test Google Play';
            if (aBtnStore) {
              aBtnStore.style.display = 'inline-flex';
              aBtnStore.href = data.android.playStoreAppLink || '#';
            }
          } else {
            aBtnMain.style.display = 'none';
          }
        }

        if (data.android.latestVersion) {
          if (aVerLabel) aVerLabel.innerText = 'v' + data.android.latestVersion.version;
          if (aBuildLabel) aBuildLabel.innerText = 'Build ' + data.android.latestVersion.buildNumber;
        }
      }

      // iOS
      var iBadge = document.getElementById('dl-ios-badge');
      var iDesc = document.getElementById('dl-ios-desc');
      var iBtnMain = document.getElementById('dl-btn-ios-main');
      var iBtnMainText = document.getElementById('dl-btn-ios-main-text');
      var iBtnStore = document.getElementById('dl-btn-ios-store');
      var iVerLabel = document.getElementById('dl-ios-version-label');
      var iBuildLabel = document.getElementById('dl-ios-build-label');

      if (data.ios) {
        var iAvail = data.ios.availability || 'BETA_OPEN';
        if (iBadge) {
          iBadge.className = 'download-avail-pill ' + (
            iAvail === 'PUBLIC' ? 'download-avail-public' :
            iAvail === 'BETA_OPEN' ? 'download-avail-beta' :
            iAvail === 'BETA_CLOSED' ? 'download-avail-closed' :
            iAvail === 'PENDING' ? 'download-avail-pending' : 'download-avail-unavailable'
          );
          iBadge.innerText = (
            iAvail === 'PUBLIC' ? 'Version publique' :
            iAvail === 'BETA_OPEN' ? 'Apple TestFlight' :
            iAvail === 'BETA_CLOSED' ? 'Bêta fermée' :
            iAvail === 'PENDING' ? 'Accès en attente' : 'Indisponible'
          );
        }

        if (iBtnMain) {
          if (iAvail === 'PUBLIC' && data.ios.appStoreLink) {
            iBtnMain.href = data.ios.appStoreLink;
            if (iBtnMainText) iBtnMainText.innerText = "Télécharger sur l'App Store";
          } else if (data.ios.testFlightLink) {
            iBtnMain.href = data.ios.testFlightLink;
            if (iBtnMainText) iBtnMainText.innerText = 'Rejoindre le test sur TestFlight';
          } else {
            iBtnMain.style.display = 'none';
          }
        }

        if (data.ios.latestVersion) {
          if (iVerLabel) iVerLabel.innerText = 'v' + data.ios.latestVersion.version;
          if (iBuildLabel) iBuildLabel.innerText = 'Build ' + data.ios.latestVersion.buildNumber;
        }
      }
    } catch(err) {
      console.warn('Impossible de charger download-info', err);
    }
  }

  loadDownloadInfo();

  // ─── 1. SOUMISSION INSCRIPTION BÊTA ───
  var regForm = document.getElementById('waitlist-form');
  var regBtn = document.getElementById('btn-submit-reg');

  if (regForm) {
    regForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      hideBanners();

      var email = document.getElementById('reg-email').value.trim();
      var fullName = document.getElementById('reg-name').value.trim();
      var terms = document.getElementById('reg-terms').checked;
      var website = document.getElementById('hp-website').value.trim();

      if (!email || email.indexOf('@') === -1) {
        showError('Veuillez saisir une adresse e-mail valide.');
        return;
      }
      if (!terms) {
        showError('Vous devez accepter les conditions de participation.');
        return;
      }
      if (selectedPlatforms.length === 0) {
        showError('Veuillez sélectionner au moins une plateforme (Android ou iOS).');
        return;
      }

      if (regBtn) {
        regBtn.disabled = true;
        regBtn.innerText = 'Enregistrement en cours...';
      }

      try {
        var res = await fetch('/api/beta-testers/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            fullName: fullName || undefined,
            platforms: selectedPlatforms,
            termsAccepted: true,
            website: website
          })
        });

        var data = await res.json();
        if (res.ok && data.success && !data.alreadyRegistered) {
          showSuccess('Candidature enregistrée avec succès ! Bienvenue dans l’espace testeur Kanto.');
          var countBadge = document.getElementById('header-tester-count');
          if (countBadge) {
            var m = countBadge.innerText.match(/[0-9]+/);
            if (m) countBadge.innerText = (parseInt(m[0], 10) + 1) + ' testeurs inscrits';
          }
          // Bascule automatique vers l'espace testeur
          switchTab('already');
          var checkInput = document.getElementById('check-email');
          if (checkInput) checkInput.value = email;
          verifyEmail(email);
        } else if (data.alreadyRegistered) {
          showError('Cette adresse e-mail est déjà inscrite. Consultation de votre statut en cours...');
          switchTab('already');
          var chkInput = document.getElementById('check-email');
          if (chkInput) chkInput.value = email;
          verifyEmail(email);
        } else {
          showError(data.message || 'Une erreur est survenue lors de l’inscription.');
        }
      } catch (err) {
        showError('Impossible de joindre le serveur. Veuillez vérifier votre connexion.');
      } finally {
        if (regBtn) {
          regBtn.disabled = false;
          regBtn.innerText = 'Rejoindre le programme bêta';
        }
      }
    });
  }

  // ─── 2. VÉRIFICATION STATUT, ESPACE TESTEUR & PROGRESSION ───
  var statusForm = document.getElementById('status-check-form');

  async function verifyEmail(email) {
    hideBanners();
    try {
      var res = await fetch('/api/beta-testers/verify-participation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });
      var data = await res.json();

      if (!res.ok || !data.exists) {
        showError(data.message || 'Aucune inscription trouvée pour cette adresse.');
        return;
      }

      currentTesterEmail = email;
      var box = document.getElementById('status-result-box');
      if (box) box.style.display = 'block';

      var lbl = document.getElementById('tester-email-lbl');
      if (lbl) {
        var displayEmail = (data.tester && (data.tester.maskedEmail || data.tester.email)) 
          ? (data.tester.maskedEmail || data.tester.email) 
          : maskEmailClient(email);
        lbl.innerText = displayEmail;
      }

      var tester = data.tester;
      var cStatus = tester.confirmationStatus || 'INSCRIT';

      // Badge de statut général
      var sBadge = document.getElementById('tester-status-badge');
      if (sBadge) {
        sBadge.className = 'tester-status-badge badge-' + cStatus.toLowerCase();
        sBadge.innerText = (
          cStatus === 'INSCRIT' ? 'INSCRIT' :
          cStatus === 'EN_ATTENTE' ? 'EN ATTENTE' :
          cStatus === 'CONFIRME' ? 'PARTICIPATION CONFIRMÉE' :
          cStatus === 'VERIFIE' ? 'ACCÈS VALIDÉ' :
          cStatus === 'INSTALLE' ? 'APPLICATION INSTALLÉE' : 'DÉSINCRIT'
        );
      }

      // Mise à jour de la barre de progression en 5 étapes
      var stepIndex = data.currentStepIndex || 2;
      for (var s = 1; s <= 5; s++) {
        var sNode = document.getElementById('step-node-' + s);
        if (sNode) {
          sNode.className = 'progress-step-item';
          var sBullet = sNode.querySelector('.step-bullet');
          if (s < stepIndex) {
            sNode.classList.add('completed');
            if (sBullet) sBullet.innerText = '✓';
          } else if (s === stepIndex) {
            sNode.classList.add('current');
            if (sBullet) sBullet.innerText = String(s);
          } else {
            if (sBullet) sBullet.innerText = String(s);
          }
        }
      }

      // Gestion de la boîte d'action
      var btnJoined = document.getElementById('btn-confirm-joined');
      var btnInstalled = document.getElementById('btn-confirm-installed');
      var actionTitle = document.getElementById('action-box-title');
      var actionDesc = document.getElementById('action-box-desc');

      if (cStatus === 'INSTALLE') {
        if (actionTitle) actionTitle.innerText = 'Application Kanto MG installée !';
        if (actionDesc) actionDesc.innerText = 'Merci pour votre précieuse contribution ! Explorez l’application et partagez vos remarques avec l’équipe.';
        if (btnJoined) btnJoined.style.display = 'none';
        if (btnInstalled) btnInstalled.style.display = 'none';
      } else if (cStatus === 'CONFIRME' || cStatus === 'VERIFIE') {
        if (actionTitle) actionTitle.innerText = 'Participation confirmée au programme !';
        if (actionDesc) actionDesc.innerText = 'Votre accès est validé. Une fois l’application téléchargée sur votre téléphone, confirmez l’installation.';
        if (btnJoined) btnJoined.style.display = 'none';
        if (btnInstalled) btnInstalled.style.display = 'flex';
      } else {
        if (actionTitle) actionTitle.innerText = 'Valider votre participation au programme';
        if (actionDesc) actionDesc.innerText = 'Une fois que vous avez rejoint le groupe sur Google Play ou accepté TestFlight, confirmez votre accès ci-dessous.';
        if (btnJoined) btnJoined.style.display = 'flex';
        if (btnInstalled) btnInstalled.style.display = 'none';
      }

      // Plateformes de test
      var hasAndroid = tester.platforms.indexOf('ANDROID') !== -1;
      var hasIos = tester.platforms.indexOf('IOS') !== -1;

      // Carte Android
      var cAndroid = document.getElementById('card-status-android');
      var bAndroid = document.getElementById('badge-status-android');
      var descAndroid = document.getElementById('desc-status-android');
      var linkPlay = document.getElementById('link-play-web');

      if (cAndroid) {
        cAndroid.style.display = hasAndroid ? 'block' : 'none';
        if (hasAndroid) {
          if (bAndroid) {
            bAndroid.innerText = tester.androidStatus;
            bAndroid.className = 'badge-status ' + (
              tester.androidStatus === 'ACCEPTED' || tester.androidStatus === 'ACTIVE' || tester.androidStatus === 'INVITED'
                ? 'badge-invited' : 'badge-pending'
            );
          }
          if (descAndroid) {
            descAndroid.innerText = data.canDownloadAndroid
              ? 'Votre compte Google est autorisé pour le test fermé Google Play.'
              : 'En attente d’autorisation sur la Google Play Console.';
          }
          if (linkPlay && data.canDownloadAndroid) {
            linkPlay.style.display = 'block';
            linkPlay.href = data.links.androidWeb;
          }
        }
      }

      // Carte iOS
      var cIos = document.getElementById('card-status-ios');
      var bIos = document.getElementById('badge-status-ios');
      var descIos = document.getElementById('desc-status-ios');
      var linkTf = document.getElementById('link-testflight');

      if (cIos) {
        cIos.style.display = hasIos ? 'block' : 'none';
        if (hasIos) {
          if (bIos) {
            bIos.innerText = tester.iosStatus;
            bIos.className = 'badge-status ' + (
              tester.iosStatus === 'ACCEPTED' || tester.iosStatus === 'ACTIVE' || tester.iosStatus === 'INVITED'
                ? 'badge-invited' : 'badge-pending'
            );
          }
          if (descIos) {
            descIos.innerText = data.canDownloadIos
              ? 'Votre invitation TestFlight est active pour votre appareil Apple.'
              : 'En attente d’invitation sur Apple TestFlight.';
          }
          if (linkTf && data.canDownloadIos) {
            linkTf.style.display = 'block';
            linkTf.href = data.links.testFlight;
          }
        }
      }

      // Version actuelle
      var vCard = document.getElementById('tester-version-card');
      var vBadge = document.getElementById('tvc-version-badge');
      var vNotes = document.getElementById('tvc-notes');
      if (data.latestVersion && vCard) {
        vCard.style.display = 'block';
        if (vBadge) vBadge.innerText = 'v' + data.latestVersion.version + ' (build ' + data.latestVersion.buildNumber + ')';
        if (vNotes) vNotes.innerText = data.latestVersion.releaseNotes || 'Améliorations de performance et enrichissement des contenus culturels malgaches.';
      }

      // Checkboxes mise à jour des plateformes
      var chkAndroid = document.getElementById('chk-update-android');
      var chkIos = document.getElementById('chk-update-ios');
      if (chkAndroid) chkAndroid.checked = hasAndroid;
      if (chkIos) chkIos.checked = hasIos;

    } catch (err) {
      showError('Erreur lors de la vérification de votre espace personnel.');
    }
  }

  if (statusForm) {
    statusForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('check-email').value.trim();
      if (email) verifyEmail(email);
    });
  }

  // ─── 3. CONFIRMATION INTERACTIVE DU TESTEUR (« J'AI REJOINT » / « J'AI INSTALLÉ ») ───
  var btnConfirmJoined = document.getElementById('btn-confirm-joined');
  if (btnConfirmJoined) {
    btnConfirmJoined.addEventListener('click', async function() {
      if (!currentTesterEmail) {
        showError('Veuillez d’abord renseigner votre adresse e-mail.');
        return;
      }
      btnConfirmJoined.disabled = true;
      btnConfirmJoined.innerText = 'Confirmation en cours...';
      try {
        var res = await fetch('/api/beta-testers/confirm-participation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: currentTesterEmail,
            action: 'JOINED'
          })
        });
        var data = await res.json();
        if (res.ok && data.success) {
          showSuccess('Félicitations ! Votre participation est confirmée. Vous pouvez maintenant installer Kanto MG.');
          verifyEmail(currentTesterEmail);
        } else {
          showError(data.message || 'Impossible de confirmer votre participation.');
        }
      } catch (err) {
        showError('Erreur lors de la confirmation. Vérifiez votre connexion.');
      } finally {
        btnConfirmJoined.disabled = false;
        btnConfirmJoined.innerText = "J'ai rejoint le programme bêta";
      }
    });
  }

  var btnConfirmInstalled = document.getElementById('btn-confirm-installed');
  if (btnConfirmInstalled) {
    btnConfirmInstalled.addEventListener('click', async function() {
      if (!currentTesterEmail) return;
      btnConfirmInstalled.disabled = true;
      btnConfirmInstalled.innerText = 'Enregistrement...';
      try {
        var res = await fetch('/api/beta-testers/confirm-participation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: currentTesterEmail,
            action: 'INSTALLED'
          })
        });
        var data = await res.json();
        if (res.ok && data.success) {
          showSuccess('Bravo ! Installation confirmée. Bonne exploration de la culture malgache dans Kanto MG.');
          verifyEmail(currentTesterEmail);
        } else {
          showError(data.message || 'Impossible d’enregistrer l’installation.');
        }
      } catch (err) {
        showError('Erreur lors de la confirmation de l’installation.');
      } finally {
        btnConfirmInstalled.disabled = false;
        btnConfirmInstalled.innerText = "J'ai installé Kanto MG sur mon appareil";
      }
    });
  }

  // Accordéon guide pas-à-pas
  var guideBtn = document.getElementById('guide-toggle-btn');
  var guideContent = document.getElementById('guide-content');
  var guideChevron = document.getElementById('guide-chevron');
  if (guideBtn && guideContent) {
    guideBtn.addEventListener('click', function() {
      var isOpen = guideContent.style.display !== 'none';
      guideContent.style.display = isOpen ? 'none' : 'block';
      if (guideChevron) guideChevron.innerText = isOpen ? '▼' : '▲';
    });
  }

  // Renvoi des liens
  var resendBtn = document.getElementById('btn-resend-links');
  if (resendBtn) {
    resendBtn.addEventListener('click', async function() {
      if (!currentTesterEmail) return;
      try {
        var res = await fetch('/api/beta-testers/resend-invite-public', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currentTesterEmail })
        });
        var data = await res.json();
        if (data.success) {
          showSuccess(data.message);
        } else {
          showError(data.message);
        }
      } catch (e) {
        showError('Erreur de renvoi des invitations.');
      }
    });
  }

  // Toggle form mise à jour plateformes
  var togglePlatBtn = document.getElementById('btn-toggle-update-plat');
  var boxPlat = document.getElementById('box-update-platforms');
  if (togglePlatBtn && boxPlat) {
    togglePlatBtn.addEventListener('click', function() {
      boxPlat.style.display = boxPlat.style.display === 'none' ? 'block' : 'none';
    });
  }

  // Sauvegarde mise à jour plateformes
  var savePlatBtn = document.getElementById('btn-submit-update-plat');
  if (savePlatBtn) {
    savePlatBtn.addEventListener('click', async function() {
      if (!currentTesterEmail) return;
      var chkAndroid = document.getElementById('chk-update-android');
      var chkIos = document.getElementById('chk-update-ios');
      var newPlats = [];
      if (chkAndroid && chkAndroid.checked) newPlats.push('ANDROID');
      if (chkIos && chkIos.checked) newPlats.push('IOS');

      if (newPlats.length === 0) {
        showError('Vous devez conserver au moins une plateforme.');
        return;
      }

      try {
        var res = await fetch('/api/beta-testers/platforms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currentTesterEmail, platforms: newPlats })
        });
        var data = await res.json();
        if (data.success) {
          showSuccess('Vos plateformes de test ont été mises à jour !');
          if (boxPlat) boxPlat.style.display = 'none';
          verifyEmail(currentTesterEmail);
        } else {
          showError(data.message);
        }
      } catch (e) {
        showError('Erreur lors de la mise à jour des plateformes.');
      }
    });
  }

  // ─── 4. DÉSINCRIPTION RGPD ───
  var unsubForm = document.getElementById('unsub-form');
  var unsubChips = document.querySelectorAll('.unsub-chip');
  var unsubReasonInput = document.getElementById('unsub-reason');
  var unsubCancelBtn = document.getElementById('btn-unsub-cancel');

  unsubChips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      unsubChips.forEach(function(c) { c.classList.remove('active'); });
      chip.classList.add('active');
      if (unsubReasonInput) unsubReasonInput.value = chip.getAttribute('data-reason');
    });
  });

  if (unsubCancelBtn) {
    unsubCancelBtn.addEventListener('click', function() {
      switchTab('already');
    });
  }

  if (unsubForm) {
    unsubForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      hideBanners();

      var email = document.getElementById('unsub-email').value.trim();
      var token = document.getElementById('unsub-token').value.trim();
      var reason = unsubReasonInput ? unsubReasonInput.value.trim() : '';

      try {
        var res = await fetch('/api/beta-testers/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, token: token || undefined, reason: reason })
        });
        var data = await res.json();
        if (data.success) {
          unsubForm.style.display = 'none';
          var sBox = document.getElementById('unsub-success-box');
          if (sBox) sBox.style.display = 'block';
          var sMsg = document.getElementById('unsub-success-msg');
          if (sMsg) sMsg.innerText = data.message;
        } else {
          showError(data.message || 'Erreur lors de la désinscription.');
        }
      } catch (err) {
        showError('Impossible de joindre le serveur.');
      }
    });
  }

  var btnUnsubHome = document.getElementById('btn-unsub-home');
  if (btnUnsubHome) {
    btnUnsubHome.addEventListener('click', function() { switchTab('register'); });
  }

  var btnUnsubResub = document.getElementById('btn-unsub-resubscribe');
  if (btnUnsubResub) {
    btnUnsubResub.addEventListener('click', function() {
      if (unsubForm) unsubForm.style.display = 'block';
      var sBox = document.getElementById('unsub-success-box');
      if (sBox) sBox.style.display = 'none';
      switchTab('register');
    });
  }

  // ─── 5. GESTION DU THÈME CLAIR / SOMBRE ───
  var themeToggle = document.getElementById('theme-toggle');
  var iconSun = document.getElementById('theme-icon-sun');
  var iconMoon = document.getElementById('theme-icon-moon');

  function updateThemeIcons(theme) {
    if (iconSun && iconMoon) {
      iconSun.style.display = theme === 'dark' ? 'none' : 'block';
      iconMoon.style.display = theme === 'dark' ? 'block' : 'none';
    }
  }

  var curTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  updateThemeIcons(curTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      var now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', now);
      localStorage.setItem('kanto_theme', now);
      updateThemeIcons(now);
      var metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute('content', now === 'light' ? '#F5F4F0' : '#0D0D0B');
    });
  }

  // ─── 6. MODALES CGU & POLITIQUE DE CONFIDENTIALITÉ ───
  var cguModal = document.getElementById('kanto-cgu-modal');
  var openCguBtn = document.getElementById('btn-open-cgu-modal');
  var closeCguBtn = document.getElementById('cgu-modal-close');
  var acceptCguBtn = document.getElementById('cgu-modal-btn-accept');
  var footerCguBtn = document.getElementById('footer-link-cgu');

  function openCgu(e) {
    if (e) e.preventDefault();
    if (cguModal) cguModal.style.display = 'flex';
  }
  function closeCgu() {
    if (cguModal) cguModal.style.display = 'none';
  }

  if (openCguBtn) openCguBtn.addEventListener('click', openCgu);
  if (closeCguBtn) closeCguBtn.addEventListener('click', closeCgu);
  if (acceptCguBtn) acceptCguBtn.addEventListener('click', closeCgu);
  if (footerCguBtn) footerCguBtn.addEventListener('click', openCgu);
  if (cguModal) {
    cguModal.addEventListener('click', function(e) {
      if (e.target === cguModal) closeCgu();
    });
  }

  // Modale Confidentialité
  var privacyModal = document.getElementById('kanto-privacy-modal');
  var openPrivBtn = document.getElementById('btn-open-privacy-modal');
  var closePrivBtn = document.getElementById('privacy-modal-close');
  var acceptPrivBtn = document.getElementById('privacy-modal-btn-accept');
  var footerPrivBtn = document.getElementById('footer-link-privacy');

  function openPrivacy(e) {
    if (e) e.preventDefault();
    if (privacyModal) privacyModal.style.display = 'flex';
  }
  function closePrivacy() {
    if (privacyModal) privacyModal.style.display = 'none';
  }

  if (openPrivBtn) openPrivBtn.addEventListener('click', openPrivacy);
  if (closePrivBtn) closePrivBtn.addEventListener('click', closePrivacy);
  if (acceptPrivBtn) acceptPrivBtn.addEventListener('click', closePrivacy);
  if (footerPrivBtn) footerPrivBtn.addEventListener('click', openPrivacy);
  if (privacyModal) {
    privacyModal.addEventListener('click', function(e) {
      if (e.target === privacyModal) closePrivacy();
    });
  }

  // ─── 7. GESTION DES COOKIES (Moteur KantoConsent) ───
  var cookieBanner = document.getElementById('kanto-cookie-banner');
  var cookieModal = document.getElementById('kanto-cookie-modal');
  var btnAcceptAll = document.getElementById('cookie-btn-accept-all');
  var btnRejectAll = document.getElementById('cookie-btn-reject-all');
  var btnCustomize = document.getElementById('cookie-btn-customize');
  var btnCookieSettings = document.getElementById('btn-cookie-settings');
  var cookieModalClose = document.getElementById('cookie-modal-close');
  var cookieModalBtnReject = document.getElementById('cookie-modal-btn-reject');
  var cookieModalBtnSave = document.getElementById('cookie-modal-btn-save');
  var optPreferences = document.getElementById('cookie-opt-preferences');

  function checkConsent() {
    try {
      var c = localStorage.getItem('kanto_cookie_consent');
      if (!c && cookieBanner) cookieBanner.style.display = 'block';
    } catch(e) {}
  }

  function saveConsent(pref) {
    try {
      localStorage.setItem('kanto_cookie_consent', JSON.stringify({
        necessary: true,
        preferences: Boolean(pref),
        date: new Date().toISOString()
      }));
    } catch(e) {}
    if (cookieBanner) cookieBanner.style.display = 'none';
    if (cookieModal) cookieModal.style.display = 'none';
  }

  window.KantoConsent = {
    checkConsent: checkConsent,
    saveConsent: saveConsent
  };

  if (btnAcceptAll) btnAcceptAll.addEventListener('click', function() { saveConsent(true); });
  if (btnRejectAll) btnRejectAll.addEventListener('click', function() { saveConsent(false); });
  if (btnCustomize) btnCustomize.addEventListener('click', function() { if (cookieModal) cookieModal.style.display = 'flex'; });
  if (btnCookieSettings) btnCookieSettings.addEventListener('click', function(e) { e.preventDefault(); if (cookieModal) cookieModal.style.display = 'flex'; });
  if (cookieModalClose) cookieModalClose.addEventListener('click', function() { if (cookieModal) cookieModal.style.display = 'none'; });
  if (cookieModalBtnReject) cookieModalBtnReject.addEventListener('click', function() { saveConsent(false); });
  if (cookieModalBtnSave) cookieModalBtnSave.addEventListener('click', function() { saveConsent(optPreferences ? optPreferences.checked : false); });

  checkConsent();

  // Si un email est déjà présent à l'affichage initial (champ ou query param)
  var qEmail = '';
  try {
    qEmail = new URLSearchParams(window.location.search).get('email') || '';
  } catch(e) {}
  var chkInput = document.getElementById('check-email');
  var regInput = document.getElementById('reg-email');
  var initEmail = qEmail || (chkInput ? chkInput.value : '') || (regInput ? regInput.value : '');
  if (initEmail && initEmail.indexOf('@') !== -1) {
    if (chkInput) chkInput.value = initEmail;
    verifyEmail(initEmail);
  }
})();
  `.trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
