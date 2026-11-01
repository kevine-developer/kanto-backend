/**
 * Kanto MG — Page web d'accès anticipé et d'inscription au programme bêta (Android & iOS).
 * Accessible sur app-kanto.gastsar.fr, kanto.mg/beta ou via redirection deeplink.
 *
 * Design System Kanto officiel (Terre & Encre) :
 * - Vert Tanimbary (#6B9E61 / #16442A) & Ocre Ambre (#C58B38 / #E0A24A)
 * - Fond minéral charbon chaud (#0D0D0B) & surfaces feutrées (#141412) en mode sombre
 * - Fond parchemin chaud (#F5F4F0) en mode clair
 * - Typographie Plus Jakarta Sans
 * - Zéro référence ou icône d'IA / Sparkles.
 * - Gestion indépendante et complète Android (Google Play) & iOS (Apple TestFlight).
 */

export interface BetaLandingPageOptions {
  testerCount?: number;
  initialRegistered?: boolean;
  registeredEmail?: string;
  errorMessage?: string;
  fromDeeplink?: boolean;
  targetPath?: string;
  initialTab?: 'register' | 'already_registered' | 'download' | 'feedback' | 'unsubscribe';
  initialEmail?: string;
  unsubscribeToken?: string;
}

export function renderBetaLandingPage(
  options?: BetaLandingPageOptions,
): string {
  const currentYear = new Date().getFullYear();
  const count =
    typeof options?.testerCount === 'number' ? options.testerCount : 0;
  const isRegistered = Boolean(options?.initialRegistered);
  const fromDeeplink = Boolean(options?.fromDeeplink);
  const initialTab =
    options?.initialTab || (isRegistered ? 'already_registered' : 'register');
  const emailVal = options?.registeredEmail || options?.initialEmail || '';
  const errorVal = options?.errorMessage ? escapeHtml(options.errorMessage) : '';
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
  <title>Bêta-Testeur Kanto MG • Accès Anticipé Android &amp; iOS</title>
  <meta name="description" content="Programme de test bêta officiel de l'application Kanto MG sur Google Play et Apple TestFlight. Explorez la langue, la culture, les contes et traditions malgaches en avant-première.">
  <meta name="theme-color" content="#0D0D0B">

  <!-- Open Graph -->
  <meta property="og:title" content="Bêta-Testeur Kanto MG • Android &amp; iOS">
  <meta property="og:description" content="Rejoignez la communauté des bêta-testeurs Kanto MG sur Google Play et TestFlight.">
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
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: inherit;
    }

    .brand-mark {
      width: 34px;
      height: 34px;
      border-radius: var(--radius-md);
      background: var(--color-tanimbary-dark);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 15px;
      border: 1px solid var(--color-tanimbary);
    }

    .brand-name {
      font-weight: 700;
      font-size: 16px;
      color: var(--color-brand-title);
      letter-spacing: -0.2px;
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
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    main {
      flex: 1;
      max-width: 680px;
      margin: 0 auto;
      width: 100%;
      padding: 32px 20px 60px;
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
      letter-spacing: 1px;
      color: var(--color-ochre);
      margin-bottom: 8px;
    }

    h1 {
      font-size: 26px;
      font-weight: 700;
      color: var(--color-heading);
      letter-spacing: -0.5px;
      margin-bottom: 10px;
    }

    .intro-description {
      font-size: 14px;
      color: var(--color-text-secondary);
      max-width: 520px;
      margin: 0 auto;
    }

    .card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--color-card-shadow);
      padding: 24px;
      margin-bottom: 24px;
    }

    .tabs-nav {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 6px;
      padding: 4px;
      background: var(--color-bg);
      border-radius: var(--radius-md);
      margin-bottom: 24px;
      border: 1px solid var(--color-border);
    }

    .tab-btn {
      padding: 9px 8px;
      font-size: 12px;
      font-weight: 600;
      border: none;
      background: transparent;
      color: var(--color-text-secondary);
      border-radius: var(--radius-sm);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .tab-btn.active {
      background: var(--color-surface);
      color: var(--color-text);
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    .field {
      margin-bottom: 18px;
    }

    .field-label {
      display: flex;
      justify-content: space-between;
      font-size: 12.5px;
      font-weight: 600;
      margin-bottom: 6px;
      color: var(--color-text);
    }

    .field-input, .field-select, .field-textarea {
      width: 100%;
      padding: 11px 14px;
      background: var(--color-surface-input);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-text);
      font-family: inherit;
      font-size: 13.5px;
      outline: none;
      transition: border-color 0.2s;
    }

    .field-input:focus, .field-select:focus, .field-textarea:focus {
      border-color: var(--color-tanimbary);
    }

    .field-note {
      font-size: 11.5px;
      color: var(--color-text-muted);
      margin-top: 5px;
    }

    /* Sélecteur de plateformes */
    .platform-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 18px;
    }

    .platform-card {
      border: 1px solid var(--color-border);
      background: var(--color-surface-input);
      border-radius: var(--radius-md);
      padding: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s;
    }

    .platform-card.checked {
      border-color: var(--color-tanimbary);
      background: rgba(107, 158, 97, 0.08);
    }

    .platform-checkbox {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      border: 1.5px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .platform-card.checked .platform-checkbox {
      background: var(--color-tanimbary);
      border-color: var(--color-tanimbary);
      color: #FFFFFF;
    }

    .platform-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-text);
    }

    .platform-sub {
      font-size: 11px;
      color: var(--color-text-muted);
    }

    /* Conditions générales */
    .terms-box {
      display: flex;
      align-items: flex-start;
      gap: 9px;
      margin-bottom: 22px;
      font-size: 12px;
      color: var(--color-text-secondary);
      cursor: pointer;
    }

    .terms-box input {
      margin-top: 2px;
      accent-color: var(--color-tanimbary);
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
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background-color 0.2s;
    }

    .btn-submit:hover {
      background: #1f5c39;
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
    }

    /* Bannière de notification */
    .banner {
      display: none;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      font-size: 12.5px;
      margin-bottom: 18px;
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

    /* Carte de statut après recherche */
    .status-result {
      display: none;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid var(--color-divider);
    }

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

    .badge-status {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .badge-invited { background: rgba(107, 158, 97, 0.15); color: var(--color-tanimbary); }
    .badge-pending { background: rgba(197, 139, 56, 0.15); color: var(--color-ochre); }
    .badge-none { background: rgba(120, 120, 120, 0.15); color: var(--color-text-muted); }

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

    .hp-trap {
      display: none !important;
    }

    @media (max-width: 600px) {
      .platform-cards, .platform-status-grid {
        grid-template-columns: 1fr;
      }
      .tabs-nav {
        font-size: 11px;
      }
    }
  </style>
</head>
<body>

  <!-- En-tête officiel Kanto MG -->
  <header>
    <a href="/" class="brand">
      <div class="brand-mark">K</div>
      <span class="brand-name">Kanto MG</span>
    </a>
    <div class="header-actions">
      <button type="button" class="theme-toggle-btn" id="theme-toggle" aria-label="Changer de thème">
        <span id="theme-toggle-icon">☀</span>
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
      <span class="section-eyebrow">Programme de Test Bêta Officiel</span>
      <h1>Rejoignez les Bêta-Testeurs Kanto MG</h1>
      <p class="intro-description">
        Participez en avant-première au déploiement de Kanto MG sur Android (Google Play) et iOS (TestFlight) et contribuez à valoriser le patrimoine culturel malgache.
      </p>
    </div>

    <div class="card">
      <!-- Navigation par Onglets -->
      <div class="tabs-nav">
        <button type="button" class="tab-btn ${initialTab === 'register' ? 'active' : ''}" id="tab-btn-register">
          <span>Inscription</span>
        </button>
        <button type="button" class="tab-btn ${initialTab === 'already_registered' || initialTab === 'download' ? 'active' : ''}" id="tab-btn-already">
          <span>Mon Accès &amp; Statut</span>
        </button>
        <button type="button" class="tab-btn ${initialTab === 'feedback' ? 'active' : ''}" id="tab-btn-feedback">
          <span>Retours &amp; Bugs</span>
        </button>
      </div>

      <!-- Bandeaux d'alerte -->
      <div id="error-banner" class="banner error">
        <span id="error-text">${errorVal}</span>
      </div>
      <div id="success-banner" class="banner success">
        <span id="success-text"></span>
      </div>

      <!-- ─── ONGLET 1 : FORMULAIRE D'INSCRIPTION BÊTA ─── -->
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
              placeholder="Ex: Rado, Bakoly..." 
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
                <div class="platform-checkbox">✓</div>
                <div>
                  <div class="platform-title">Android</div>
                  <div class="platform-sub">Google Play Closed Testing</div>
                </div>
              </div>
              <div class="platform-card" id="card-ios">
                <div class="platform-checkbox">✓</div>
                <div>
                  <div class="platform-title">iOS (iPhone &amp; iPad)</div>
                  <div class="platform-sub">Apple TestFlight</div>
                </div>
              </div>
            </div>
          </div>

          <label class="terms-box">
            <input type="checkbox" id="reg-terms" required checked>
            <span>
              J'accepte de participer au programme bêta de Kanto MG, de recevoir les invitations par e-mail et de tester les versions en avant-première.
            </span>
          </label>

          <button type="submit" class="btn-submit" id="btn-submit-reg">
            <span>Rejoindre le programme bêta</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </form>
      </div>

      <!-- ─── ÉCRAN DE SUCCÈS INSCRIPTION ─── -->
      <div class="confirmation" id="confirmation-view" style="display: ${isRegistered ? 'flex' : 'none'};">
        <div class="confirmation-icon">✓</div>
        <h2 style="font-size: 18px; font-weight: 700; color: var(--color-heading);">
          Candidature enregistrée avec succès !
        </h2>
        <p style="font-size: 13.5px; color: var(--color-text-secondary); line-height: 1.5;">
          Un e-mail de confirmation vous a été envoyé à l'adresse :
        </p>
        <span style="font-weight: 700; color: var(--color-tanimbary); font-size: 14px;" id="confirmed-email-display">
          ${emailVal || 'votre.adresse@email.com'}
        </span>
        <p style="font-size: 12px; color: var(--color-text-muted); line-height: 1.5;">
          Dès que votre accès sera ouvert, vous recevrez vos liens d'invitation pour installer l'application sur vos appareils.
        </p>
        <button type="button" class="btn-secondary" id="btn-goto-status">
          Consulter mon statut &amp; liens de téléchargement →
        </button>
      </div>

      <!-- ─── ONGLET 2 : MON ACCÈS, STATUT & TÉLÉCHARGEMENT ─── -->
      <div id="panel-already" style="display: ${initialTab === 'already_registered' || initialTab === 'download' ? 'block' : 'none'};">
        <form id="status-check-form">
          <div class="field">
            <label class="field-label" for="check-email">
              <span>Vérifier mon statut de testeur</span>
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
              <button type="submit" class="btn-submit" id="btn-check-status" style="width: auto; padding: 0 18px; white-space: nowrap;">
                Vérifier
              </button>
            </div>
            <p class="field-note">
              Renseignez l'adresse e-mail avec laquelle vous vous êtes inscrit au programme.
            </p>
          </div>
        </form>

        <div class="status-result" id="status-result-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 13px; font-weight: 600; color: var(--color-text);" id="tester-display-name">
              Participant : <strong id="tester-email-lbl"></strong>
            </span>
          </div>

          <!-- Grille des deux plateformes indépendantes -->
          <div class="platform-status-grid">
            <!-- Statut Android -->
            <div class="platform-status-card">
              <div class="platform-status-header">
                <span style="font-weight: 700; font-size: 13px;">Android</span>
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
            <div class="platform-status-card">
              <div class="platform-status-header">
                <span style="font-weight: 700; font-size: 13px;">Apple iOS</span>
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

          <!-- Actions supplémentaires : mise à jour plateformes, renvoi liens, désinscription -->
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px;">
            <button type="button" class="btn-secondary" id="btn-resend-links">
              Renvoyer mes liens d'accès par e-mail
            </button>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; font-size: 11.5px;">
              <button type="button" id="btn-toggle-update-plat" style="background: none; border: none; color: var(--color-tanimbary); cursor: pointer; text-decoration: underline;">
                Modifier mes plateformes de test (Android / iOS)
              </button>
              <button type="button" id="btn-open-unsubscribe" style="background: none; border: none; color: var(--color-error); cursor: pointer;">
                Me désinscrire
              </button>
            </div>

            <!-- Formulaire inline de mise à jour des plateformes -->
            <div id="box-update-platforms" style="display: none; padding: 12px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); margin-top: 8px; background: var(--color-surface);">
              <span style="font-size: 12px; font-weight: 600; display: block; margin-bottom: 8px;">
                Mettre à jour mes plateformes :
              </span>
              <label style="display: block; font-size: 12px; margin-bottom: 4px;">
                <input type="checkbox" id="chk-update-android"> Participer au test Android (Google Play)
              </label>
              <label style="display: block; font-size: 12px; margin-bottom: 10px;">
                <input type="checkbox" id="chk-update-ios"> Participer au test iOS (TestFlight)
              </label>
              <button type="button" id="btn-submit-update-plat" class="btn-submit" style="padding: 8px 12px; font-size: 12px;">
                Enregistrer mes modifications
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── ONGLET 3 : RETOURS & SIGNALEMENT DE BUGS ─── -->
      <div id="panel-feedback" style="display: ${initialTab === 'feedback' ? 'block' : 'none'};">
        <form id="feedback-form">
          <div class="field">
            <label class="field-label" for="fb-email">
              <span>Votre adresse e-mail de testeur</span>
              <span style="color: var(--color-tanimbary);">Requis</span>
            </label>
            <input 
              type="email" 
              id="fb-email" 
              class="field-input" 
              placeholder="votre.email@gmail.com" 
              required
              value="${emailVal}"
            >
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="field">
              <label class="field-label" for="fb-category">
                <span>Catégorie</span>
              </label>
              <select id="fb-category" class="field-select">
                <option value="BUG">Signalement de bug</option>
                <option value="UI_UX">Interface &amp; Ergonomie</option>
                <option value="PERFORMANCE">Performance &amp; Lenteur</option>
                <option value="CONTENT">Contenu ou Traduction</option>
                <option value="SUGGESTION">Idée ou Suggestion</option>
                <option value="OTHER">Autre remarque</option>
              </select>
            </div>

            <div class="field">
              <label class="field-label" for="fb-platform">
                <span>Plateforme concernée</span>
              </label>
              <select id="fb-platform" class="field-select">
                <option value="ANDROID">Android</option>
                <option value="IOS">Apple iOS</option>
                <option value="ALL">Les deux plateformes</option>
              </select>
            </div>
          </div>

          <div class="field">
            <label class="field-label" for="fb-title">
              <span>Titre ou résumé court</span>
            </label>
            <input 
              type="text" 
              id="fb-title" 
              class="field-input" 
              placeholder="Ex: Problème d'affichage sur les quiz..."
            >
          </div>

          <div class="field">
            <label class="field-label" for="fb-desc">
              <span>Description détaillée</span>
              <span style="color: var(--color-tanimbary);">Requis</span>
            </label>
            <textarea 
              id="fb-desc" 
              rows="4" 
              class="field-textarea" 
              placeholder="Expliquez ce qui s'est passé, les étapes pour reproduire le problème ou votre suggestion..."
              required
            ></textarea>
          </div>

          <button type="submit" class="btn-submit" id="btn-submit-fb">
            <span>Transmettre mon retour à l'équipe Kanto</span>
          </button>
        </form>
      </div>

      <!-- ─── VUE DÉSINCRIPTION RGPD ─── -->
      <div id="panel-unsubscribe" style="display: ${initialTab === 'unsubscribe' ? 'block' : 'none'};">
        <h3 style="font-size: 16px; font-weight: 700; color: var(--color-heading); margin-bottom: 8px;">
          Désinscription du programme bêta
        </h3>
        <p style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 16px;">
          Conformément au RGPD, vous pouvez vous retirer à tout moment du programme de test. Vous ne recevrez plus d'e-mails d'invitation.
        </p>
        <form id="unsub-form">
          <input type="hidden" id="unsub-token" value="${tokenVal}">
          <div class="field">
            <label class="field-label" for="unsub-email">Votre adresse e-mail</label>
            <input type="email" id="unsub-email" class="field-input" value="${emailVal}" required>
          </div>
          <div class="field">
            <label class="field-label" for="unsub-reason">Motif (optionnel)</label>
            <input type="text" id="unsub-reason" class="field-input" placeholder="Ex: Changement d'appareil, manque de temps...">
          </div>
          <button type="submit" class="btn-submit" style="background: var(--color-error); border-color: var(--color-error);">
            Confirmer ma désinscription
          </button>
        </form>
      </div>

    </div>
  </main>

  <!-- Bannière de consentement aux cookies Kanto -->
  <aside id="kanto-cookie-banner" class="cookie-banner" role="region" aria-label="Gestion des cookies et de la confidentialité" style="display: none;">
    <div class="cookie-banner-container">
      <div class="cookie-banner-header">
        <h2 class="cookie-banner-title">Respect de votre vie privée &amp; Confidentialité</h2>
        <p class="cookie-banner-text">
          Nous utilisons des cookies strictement nécessaires au fonctionnement de la plateforme. Avec votre accord, nous pouvons également activer des cookies pour mémoriser vos préférences et mesurer l'audience.
        </p>
      </div>
      <div class="cookie-banner-actions">
        <button type="button" id="cookie-btn-accept-all" class="cookie-btn cookie-btn-primary">Tout accepter</button>
        <button type="button" id="cookie-btn-reject-all" class="cookie-btn cookie-btn-secondary">Tout refuser</button>
        <button type="button" id="cookie-btn-customize" class="cookie-btn cookie-btn-outline">Personnaliser</button>
      </div>
    </div>
  </aside>

  <!-- Modal de personnalisation détaillée des cookies -->
  <div id="kanto-cookie-modal" class="cookie-modal-backdrop" role="dialog" aria-modal="true" style="display: none;">
    <div class="cookie-modal-box">
      <div class="cookie-modal-header">
        <h2 id="cookie-modal-title">Préférences de confidentialité</h2>
        <button type="button" id="cookie-modal-close">✕</button>
      </div>
      <div class="cookie-modal-body">
        <p>Gérez vos préférences de traceurs pour Kanto MG.</p>
      </div>
      <div class="cookie-modal-footer">
        <button type="button" id="cookie-modal-btn-save">Enregistrer mes préférences</button>
      </div>
    </div>
  </div>

  <!-- Pied de page officiel -->
  <footer>
    <div class="footer-nav">
      <a href="${legalBaseUrl}/pages/terms">Conditions d'utilisation (CGU)</a>
      <a href="${legalBaseUrl}/pages/privacy">Confidentialité &amp; RGPD</a>
      <button type="button" class="footer-cookie-btn" id="btn-cookie-settings">Cookies</button>
      <a href="mailto:contact@kanto.mg">Contact support</a>
    </div>
    <div style="font-size: 11px;">
      © ${currentYear} Kanto MG • Lova, Kolontsaina &amp; Tantara Malagasy
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
  var tabReg = document.getElementById('tab-btn-register');
  var tabAlr = document.getElementById('tab-btn-already');
  var tabFb = document.getElementById('tab-btn-feedback');

  var pnlReg = document.getElementById('panel-register');
  var pnlAlr = document.getElementById('panel-already');
  var pnlFb = document.getElementById('panel-feedback');
  var pnlUnsub = document.getElementById('panel-unsubscribe');
  var confView = document.getElementById('confirmation-view');

  var errBanner = document.getElementById('error-banner');
  var errText = document.getElementById('error-text');
  var succBanner = document.getElementById('success-banner');
  var succText = document.getElementById('success-text');

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

  function switchTab(target) {
    hideBanners();
    if (pnlReg) pnlReg.style.display = 'none';
    if (pnlAlr) pnlAlr.style.display = 'none';
    if (pnlFb) pnlFb.style.display = 'none';
    if (pnlUnsub) pnlUnsub.style.display = 'none';
    if (confView) confView.style.display = 'none';

    if (tabReg) tabReg.classList.remove('active');
    if (tabAlr) tabAlr.classList.remove('active');
    if (tabFb) tabFb.classList.remove('active');

    if (target === 'register') {
      if (tabReg) tabReg.classList.add('active');
      if (pnlReg) pnlReg.style.display = 'block';
    } else if (target === 'already') {
      if (tabAlr) tabAlr.classList.add('active');
      if (pnlAlr) pnlAlr.style.display = 'block';
    } else if (target === 'feedback') {
      if (tabFb) tabFb.classList.add('active');
      if (pnlFb) pnlFb.style.display = 'block';
    } else if (target === 'unsubscribe') {
      if (pnlUnsub) pnlUnsub.style.display = 'block';
    }
  }

  if (tabReg) tabReg.addEventListener('click', function() { switchTab('register'); });
  if (tabAlr) tabAlr.addEventListener('click', function() { switchTab('already'); });
  if (tabFb) tabFb.addEventListener('click', function() { switchTab('feedback'); });

  var gotoStatusBtn = document.getElementById('btn-goto-status');
  if (gotoStatusBtn) {
    gotoStatusBtn.addEventListener('click', function() { switchTab('already'); });
  }

  var openUnsubBtn = document.getElementById('btn-open-unsubscribe');
  if (openUnsubBtn) {
    openUnsubBtn.addEventListener('click', function() { switchTab('unsubscribe'); });
  }

  function showError(msg) {
    if (errBanner && errText) {
      errText.innerText = msg;
      errBanner.style.display = 'flex';
    }
  }

  function showSuccess(msg) {
    if (succBanner && succText) {
      succText.innerText = msg;
      succBanner.style.display = 'flex';
    }
  }

  function hideBanners() {
    if (errBanner) errBanner.style.display = 'none';
    if (succBanner) succBanner.style.display = 'none';
  }

  // ─── 1. SOUMISSION INSCRIPTION ───
  var regForm = document.getElementById('waitlist-form') || document.getElementById('register-form');
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
        regBtn.innerText = 'Enregistrement...';
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
          if (pnlReg) pnlReg.style.display = 'none';
          if (confView) confView.style.display = 'flex';
          var confEmail = document.getElementById('confirmed-email-display');
          if (confEmail) confEmail.innerText = email;

          var badge = document.getElementById('header-tester-count');
          if (badge) {
            var m = badge.innerText.match(/[0-9]+/);
            if (m) badge.innerText = (parseInt(m[0], 10) + 1) + ' testeurs inscrits';
          }
        } else if (data.alreadyRegistered) {
          showError('Cette adresse est déjà inscrite. Consultez votre statut dans l’onglet « Mon Accès » !');
          var checkInput = document.getElementById('check-email');
          if (checkInput) checkInput.value = email;
          setTimeout(function() { switchTab('already'); verifyEmail(email); }, 1200);
        } else {
          showError(data.message || 'Une erreur est survenue.');
        }
      } catch (err) {
        showError('Impossible de joindre le serveur. Vérifiez votre connexion.');
      } finally {
        if (regBtn) {
          regBtn.disabled = false;
          regBtn.innerText = 'Rejoindre le programme bêta';
        }
      }
    });
  }

  // ─── 2. VÉRIFICATION STATUT & TÉLÉCHARGEMENT ───
  var statusForm = document.getElementById('status-check-form');
  var currentTesterEmail = '';

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
      if (lbl) lbl.innerText = email;

      var tester = data.tester;
      var hasAndroid = tester.platforms.indexOf('ANDROID') !== -1;
      var hasIos = tester.platforms.indexOf('IOS') !== -1;

      // Badges Android
      var bAndroid = document.getElementById('badge-status-android');
      var descAndroid = document.getElementById('desc-status-android');
      var linkPlay = document.getElementById('link-play-web');

      if (hasAndroid) {
        if (bAndroid) {
          bAndroid.innerText = tester.androidStatus;
          bAndroid.className = 'badge-status ' + (tester.androidStatus === 'INVITED' ? 'badge-invited' : 'badge-pending');
        }
        if (descAndroid) {
          descAndroid.innerText = data.canDownloadAndroid
            ? 'Votre compte est autorisé pour le test Google Play.'
            : 'En attente de validation sur la Google Play Console.';
        }
        if (linkPlay && data.canDownloadAndroid) {
          linkPlay.style.display = 'block';
          linkPlay.href = data.links.androidWeb;
        }
      } else {
        if (bAndroid) {
          bAndroid.innerText = 'Non demandé';
          bAndroid.className = 'badge-status badge-none';
        }
        if (descAndroid) descAndroid.innerText = 'Vous n’avez pas demandé à tester sur Android.';
        if (linkPlay) linkPlay.style.display = 'none';
      }

      // Badges iOS
      var bIos = document.getElementById('badge-status-ios');
      var descIos = document.getElementById('desc-status-ios');
      var linkTf = document.getElementById('link-testflight');

      if (hasIos) {
        if (bIos) {
          bIos.innerText = tester.iosStatus;
          bIos.className = 'badge-status ' + (tester.iosStatus === 'INVITED' ? 'badge-invited' : 'badge-pending');
        }
        if (descIos) {
          descIos.innerText = data.canDownloadIos
            ? 'Votre invitation TestFlight est active ! Installez TestFlight sur l’App Store puis cliquez ci-dessous.'
            : 'En attente d’invitation sur App Store Connect / TestFlight.';
        }
        if (linkTf && data.canDownloadIos) {
          linkTf.style.display = 'block';
          linkTf.href = data.links.testFlight;
        }
      } else {
        if (bIos) {
          bIos.innerText = 'Non demandé';
          bIos.className = 'badge-status badge-none';
        }
        if (descIos) descIos.innerText = 'Vous n’avez pas demandé à tester sur iOS.';
        if (linkTf) linkTf.style.display = 'none';
      }

      // Checkboxes mise à jour
      var chkAndroid = document.getElementById('chk-update-android');
      var chkIos = document.getElementById('chk-update-ios');
      if (chkAndroid) chkAndroid.checked = hasAndroid;
      if (chkIos) chkIos.checked = hasIos;

    } catch (err) {
      showError('Erreur lors de la vérification du statut.');
    }
  }

  if (statusForm) {
    statusForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('check-email').value.trim();
      if (email) verifyEmail(email);
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

  // Sauvegarde des modifications de plateformes
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
          showSuccess('Plateformes mises à jour !');
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

  // ─── 3. SOUMISSION FEEDBACK ───
  var fbForm = document.getElementById('feedback-form');
  var fbBtn = document.getElementById('btn-submit-fb');

  if (fbForm) {
    fbForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      hideBanners();

      var email = document.getElementById('fb-email').value.trim();
      var category = document.getElementById('fb-category').value;
      var platform = document.getElementById('fb-platform').value;
      var title = document.getElementById('fb-title').value.trim();
      var description = document.getElementById('fb-desc').value.trim();

      if (description.length < 10) {
        showError('Veuillez fournir une description plus détaillée (au moins 10 caractères).');
        return;
      }

      if (fbBtn) {
        fbBtn.disabled = true;
        fbBtn.innerText = 'Transmission...';
      }

      try {
        var res = await fetch('/api/beta-testers/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            category: category,
            platform: platform,
            title: title || undefined,
            description: description
          })
        });
        var data = await res.json();
        if (data.success) {
          showSuccess(data.message);
          fbForm.reset();
        } else {
          showError(data.message || 'Erreur lors de la transmission du retour.');
        }
      } catch (e) {
        showError('Impossible de joindre le serveur.');
      } finally {
        if (fbBtn) {
          fbBtn.disabled = false;
          fbBtn.innerText = 'Transmettre mon retour à l’équipe Kanto';
        }
      }
    });
  }

  // ─── 4. DÉSINCRIPTION RGPD ───
  var unsubForm = document.getElementById('unsub-form');
  if (unsubForm) {
    unsubForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      hideBanners();

      var email = document.getElementById('unsub-email').value.trim();
      var token = document.getElementById('unsub-token').value.trim();
      var reason = document.getElementById('unsub-reason').value.trim();

      try {
        var res = await fetch('/api/beta-testers/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, token: token || undefined, reason: reason || undefined })
        });
        var data = await res.json();
        if (data.success) {
          showSuccess(data.message);
          setTimeout(function() { switchTab('register'); }, 2000);
        } else {
          showError(data.message);
        }
      } catch (e) {
        showError('Erreur lors de la désinscription.');
      }
    });
  }

  // ─── 5. GESTION DU THÈME SOMBRE / CLAIR ───
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

  // Traitement des query params au chargement (?tab=..., ?email=...)
  if (window.location.search) {
    try {
      var sp = new URLSearchParams(window.location.search);
      var t = sp.get('tab');
      if (t === 'already_registered' || t === 'download') switchTab('already');
      if (t === 'feedback') switchTab('feedback');
      if (t === 'unsubscribe') switchTab('unsubscribe');
      var em = sp.get('email');
      if (em) {
        if (t === 'already_registered' || t === 'download') verifyEmail(em);
      }
    } catch (e) {}
  }
  // ─── GESTION DES COOKIES (KantoConsent) ───
  var cookieBanner = document.getElementById('kanto-cookie-banner');
  var cookieModal = document.getElementById('kanto-cookie-modal');
  var btnCookieSettings = document.getElementById('btn-cookie-settings');

  if (btnCookieSettings) {
    btnCookieSettings.addEventListener('click', function() {
      if (cookieModal) cookieModal.style.display = 'flex';
    });
  }

  window.KantoConsent = {
    openSettings: function() {
      if (cookieModal) cookieModal.style.display = 'flex';
    },
    acceptAll: function() {
      if (cookieBanner) cookieBanner.style.display = 'none';
    },
    rejectAll: function() {
      if (cookieBanner) cookieBanner.style.display = 'none';
    }
  };
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
