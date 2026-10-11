/**
 * Kanto — Page web d'accès anticipé et d'inscription au test fermé Google Play.
 * Accessible sur app-kanto.gastsar.fr, kanto.mg/beta ou via redirection deeplink.
 *
 * Design System Kanto officiel (Terre & Encre) :
 * - Vert Tanimbary (#6B9E61 / #16442A) & Ocre Ambre (#C58B38 / #E0A24A)
 * - Fond minéral charbon chaud (#0D0D0B) & surfaces feutrées (#141412)
 * - Bordures soignées de 10-14px (Design moderne courbé mais maîtrisé)
 * - Zéro référence ou icône d'IA.
 * - Espace téléchargement : accès direct au test fermé officiel Google Play.
 */

export interface BetaLandingPageOptions {
  testerCount?: number;
  initialRegistered?: boolean;
  registeredEmail?: string;
  errorMessage?: string;
  fromDeeplink?: boolean;
  targetPath?: string;
  initialTab?: 'register' | 'already_registered' | 'download';
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
  const emailVal = options?.registeredEmail
    ? escapeHtml(options.registeredEmail)
    : '';
  const errorVal = options?.errorMessage
    ? escapeHtml(options.errorMessage)
    : '';

  const countBadgeText =
    count > 0
      ? `${count} testeur${count > 1 ? 's' : ''} inscrit${count > 1 ? 's' : ''}`
      : 'Inscriptions ouvertes';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Bêta-Testeur Kanto • Accès Anticipé Android Google Play</title>
  <meta name="description" content="Programme de test fermé de l'application Kanto sur Google Play. Découvrez les quiz, contes, proverbes et le patrimoine malgache en avant-première.">
  <meta name="theme-color" content="#0D0D0B">

  <!-- Open Graph -->
  <meta property="og:title" content="Bêta-Testeur Kanto • Accès Anticipé Android">
  <meta property="og:description" content="Accès anticipé fermé sur le Google Play Store pour l'application Kanto. Rejoignez la communauté des testeurs.">
  <meta property="og:type" content="website">

  <!-- Favicon & Typographie -->
  <link rel="icon" href="/favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    :root {
      /* Palette officielle Kanto Terre & Encre */
      --color-bg: #0D0D0B;
      --color-surface: #141412;
      --color-surface-input: #1C1C1A;
      --color-surface-hover: #1E1E1B;
      
      --color-border: #242420;
      --color-border-subtle: #1B211B;
      --color-divider: #282824;
      
      --color-tanimbary: #6B9E61;
      --color-tanimbary-dark: #16442A;
      --color-tanimbary-glow: rgba(107, 158, 97, 0.15);
      
      --color-ochre: #C58B38;
      --color-ochre-bg: #241B10;
      --color-ochre-border: #47341D;
      
      --color-text: #F0F0EC;
      --color-text-secondary: #9C9C98;
      --color-text-muted: #707070;
      
      --color-error: #E75A4D;
      --color-error-bg: #2C1715;
      --color-error-border: #522522;

      --color-success: #6B9E61;
      --color-success-bg: #132213;
      --color-success-border: #234323;
      
      /* Rayons modernes et raffinés */
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --radius-full: 9999px;
      
      --font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--color-bg);
      color: var(--color-text);
      font-family: var(--font-family);
      line-height: 1.5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      -webkit-font-smoothing: antialiased;
      position: relative;
    }

    body::before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(rgba(107, 158, 97, 0.04) 1px, transparent 1px),
        radial-gradient(rgba(197, 139, 56, 0.03) 1px, transparent 1px);
      background-size: 32px 32px, 48px 48px;
      background-position: 0 0, 16px 16px;
      pointer-events: none;
      z-index: 0;
    }

    header {
      width: 100%;
      max-width: 640px;
      margin: 0 auto;
      padding: 32px 20px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 1;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: var(--color-text);
    }

    .brand-mark {
      width: 38px;
      height: 38px;
      background-color: var(--color-tanimbary-dark);
      border: 1px solid rgba(107, 158, 97, 0.35);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 17px;
      color: #FFFFFF;
      letter-spacing: -0.5px;
    }

    .brand-wordmark {
      font-size: 19px;
      font-weight: 700;
      letter-spacing: -0.3px;
      color: #FFFFFF;
    }

    .brand-domain {
      color: var(--color-ochre);
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 5px 12px;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      font-size: 12px;
      color: var(--color-text-secondary);
      font-weight: 500;
    }

    .status-indicator {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: var(--color-tanimbary);
      box-shadow: 0 0 8px var(--color-tanimbary);
    }

    main {
      width: 100%;
      max-width: 580px;
      margin: 0 auto;
      padding: 16px 20px 48px;
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Bandeau d'information si redirection depuis un Deeplink ou Scan QR */
    .deeplink-banner {
      background: linear-gradient(135deg, rgba(22, 68, 42, 0.35), rgba(197, 139, 56, 0.15));
      border: 1px solid rgba(107, 158, 97, 0.35);
      border-radius: var(--radius-md);
      padding: 14px 16px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .deeplink-icon {
      width: 32px;
      height: 32px;
      background-color: rgba(107, 158, 97, 0.2);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: var(--color-tanimbary);
    }

    .deeplink-content {
      font-size: 12.5px;
      line-height: 1.5;
      color: var(--color-text);
    }

    .deeplink-content strong {
      color: #FFFFFF;
      font-weight: 600;
      display: block;
      margin-bottom: 2px;
    }

    .intro {
      text-align: center;
    }

    .section-eyebrow {
      display: inline-block;
      font-size: 11.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--color-ochre);
      margin-bottom: 6px;
    }

    h1 {
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #FFFFFF;
      line-height: 1.25;
      margin-bottom: 8px;
    }

    .intro-description {
      font-size: 13.5px;
      color: var(--color-text-secondary);
      line-height: 1.5;
    }

    /* Carte principale */
    .card {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 24px;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Bascule d'onglets au sommet de la carte */
    .tabs-nav {
      display: flex;
      background-color: var(--color-surface-input);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 3px;
      gap: 4px;
    }

    .tab-btn {
      flex: 1;
      padding: 9px 12px;
      background: none;
      border: none;
      border-radius: calc(var(--radius-md) - 3px);
      color: var(--color-text-secondary);
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.15s ease;
    }

    .tab-btn:hover {
      color: #FFFFFF;
    }

    .tab-btn.active {
      background-color: var(--color-surface);
      color: #FFFFFF;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    }

    .tab-btn.active .tab-icon {
      color: var(--color-tanimbary);
    }

    /* Messages d'erreur et alertes */
    .banner {
      display: none;
      padding: 12px 14px;
      border-radius: var(--radius-md);
      font-size: 12.5px;
      line-height: 1.45;
      align-items: flex-start;
      gap: 10px;
    }

    .banner.error {
      background-color: var(--color-error-bg);
      border: 1px solid var(--color-error-border);
      color: #FFAAA0;
    }

    .banner.success {
      background-color: var(--color-success-bg);
      border: 1px solid var(--color-success-border);
      color: #B5E8AC;
    }

    /* Formulaires */
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 14px;
    }

    .field-label {
      font-size: 12.5px;
      font-weight: 600;
      color: var(--color-text);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .field-label .required {
      font-size: 11px;
      color: var(--color-ochre);
      font-weight: 500;
    }

    .field-label .hint {
      font-size: 11px;
      color: var(--color-text-muted);
      font-weight: 400;
    }

    .field-input {
      background-color: var(--color-surface-input);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 12px 14px;
      font-family: inherit;
      font-size: 14px;
      color: var(--color-text);
      outline: none;
      transition: all 0.15s ease;
    }

    .field-input:focus {
      border-color: var(--color-tanimbary);
      box-shadow: 0 0 0 3px var(--color-tanimbary-glow);
    }

    .field-note {
      font-size: 11px;
      color: var(--color-text-muted);
      line-height: 1.4;
      margin-top: 2px;
    }

    .hp-trap {
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 1px;
      height: 1px;
      opacity: 0;
    }

    /* Boutons principaux */
    .btn-submit {
      width: 100%;
      background-color: var(--color-tanimbary-dark);
      border: 1px solid rgba(107, 158, 97, 0.4);
      color: #FFFFFF;
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      padding: 13px 18px;
      border-radius: var(--radius-md);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.15s ease;
      margin-top: 6px;
    }

    .btn-submit:hover:not(:disabled) {
      background-color: #1a5233;
      border-color: var(--color-tanimbary);
      transform: translateY(-1px);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Actions et sous-sections de l'espace "Déjà inscrit" */
    .already-box {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .action-panel {
      background-color: var(--color-surface-input);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .action-panel-header {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .action-icon {
      width: 32px;
      height: 32px;
      background-color: rgba(107, 158, 97, 0.15);
      border: 1px solid rgba(107, 158, 97, 0.3);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-tanimbary);
      flex-shrink: 0;
    }

    .action-icon.ochre {
      background-color: var(--color-ochre-bg);
      border-color: var(--color-ochre-border);
      color: var(--color-ochre);
    }

    .action-panel-titles h3 {
      font-size: 13.5px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.2px;
    }

    .action-panel-titles p {
      font-size: 11.5px;
      color: var(--color-text-secondary);
      line-height: 1.35;
    }

    /* Boutons de téléchargement Google Play */
    .download-grid {
      display: flex;
      flex-direction: column;
      gap: 9px;
    }

    .btn-play {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      text-decoration: none;
      color: var(--color-text);
      transition: all 0.15s ease;
      cursor: pointer;
    }

    .btn-play:hover {
      background-color: var(--color-surface-hover);
      border-color: rgba(107, 158, 97, 0.5);
    }

    .play-step {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .step-number {
      width: 22px;
      height: 22px;
      background-color: var(--color-tanimbary-dark);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .step-texts {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .step-title {
      font-size: 12.5px;
      font-weight: 600;
      color: #FFFFFF;
    }

    .step-desc {
      font-size: 10.5px;
      color: var(--color-text-muted);
    }

    .btn-open-scheme {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 9px;
      border-radius: var(--radius-sm);
      background-color: rgba(255, 255, 255, 0.02);
      border: 1px dashed var(--color-border);
      color: var(--color-text-secondary);
      font-size: 12px;
      text-decoration: none;
      transition: all 0.15s ease;
    }

    .btn-open-scheme:hover {
      color: #FFFFFF;
      border-color: var(--color-tanimbary);
    }

    /* Carte de résultat de statut de testeur */
    .status-result-box {
      display: none;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      padding: 14px;
      margin-top: 10px;
      gap: 10px;
      flex-direction: column;
    }

    .status-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .status-badge-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      border-radius: var(--radius-full);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }

    .status-badge-chip.pending {
      background-color: var(--color-ochre-bg);
      border: 1px solid var(--color-ochre-border);
      color: var(--color-ochre);
    }

    .status-badge-chip.approved, .status-badge-chip.invited {
      background-color: var(--color-success-bg);
      border: 1px solid var(--color-success-border);
      color: var(--color-success);
    }

    .status-result-msg {
      font-size: 12px;
      line-height: 1.45;
      color: var(--color-text-secondary);
    }

    .btn-resend {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 12px;
      background: none;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      color: var(--color-text);
      font-family: inherit;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-resend:hover {
      border-color: var(--color-tanimbary);
      color: #FFFFFF;
    }

    /* Écran de confirmation après nouvelle inscription */
    .confirmation {
      display: none;
      flex-direction: column;
      gap: 16px;
      text-align: center;
      padding: 8px 0;
    }

    .confirmation-icon {
      width: 48px;
      height: 48px;
      background-color: var(--color-tanimbary-dark);
      border: 1px solid rgba(107, 158, 97, 0.4);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      margin: 0 auto;
    }

    .confirmation-title {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .email-highlight {
      display: inline-block;
      background-color: var(--color-surface-input);
      border: 1px solid var(--color-border);
      padding: 7px 14px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 600;
      color: var(--color-ochre);
      word-break: break-all;
    }

    .btn-secondary {
      background: none;
      border: 1px solid var(--color-border);
      color: var(--color-text-secondary);
      font-family: inherit;
      font-size: 13px;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-secondary:hover {
      color: #FFFFFF;
      border-color: rgba(255, 255, 255, 0.2);
    }

    /* Bas de page et réassurance */
    .reassurance {
      display: flex;
      justify-content: space-between;
      font-size: 11.5px;
      color: var(--color-text-muted);
      padding: 0 4px;
    }

    footer {
      max-width: 640px;
      margin: 0 auto;
      padding: 24px 20px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      border-top: 1px solid var(--color-border);
      position: relative;
      z-index: 1;
    }

    .footer-nav {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .footer-nav a {
      color: var(--color-text-muted);
      font-size: 12px;
      text-decoration: none;
      transition: color 0.15s ease;
    }

    .footer-nav a:hover {
      color: var(--color-text-secondary);
    }

    .footer-copy {
      font-size: 11px;
      color: #4A4A46;
    }

    @media (max-width: 480px) {
      header { padding-top: 20px; }
      main { padding: 16px 14px 36px; }
      .card { padding: 18px 14px; }
      h1 { font-size: 22px; }
      .reassurance { flex-direction: column; gap: 4px; }
    }

    /* ─── GESTION DU CONSENTEMENT DES COOKIES & CONFIDENTIALITÉ ─── */
    .footer-cookie-btn {
      background: none;
      border: none;
      padding: 0;
      color: var(--color-text-muted);
      font-family: inherit;
      font-size: 12px;
      cursor: pointer;
      text-decoration: underline;
      text-decoration-color: rgba(112, 112, 112, 0.4);
      transition: color 0.15s ease;
    }

    .footer-cookie-btn:hover {
      color: var(--color-text);
      text-decoration-color: var(--color-text);
    }

    .cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: var(--color-surface);
      border-top: 1px solid var(--color-border);
      box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.55);
      padding: 16px 20px;
      z-index: 9999;
      animation: cookieSlideUp 0.25s ease-out;
    }

    @keyframes cookieSlideUp {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .cookie-banner-container {
      max-width: 960px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .cookie-banner-header {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .cookie-banner-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cookie-banner-title {
      font-size: 14.5px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.2px;
    }

    .cookie-banner-text {
      font-size: 12.5px;
      color: var(--color-text-secondary);
      line-height: 1.5;
    }

    .cookie-banner-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
    }

    .cookie-btn {
      padding: 9px 16px;
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 600;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      border: 1px solid transparent;
    }

    .cookie-btn-primary {
      background-color: var(--color-tanimbary-dark);
      border-color: rgba(107, 158, 97, 0.5);
      color: #FFFFFF;
    }

    .cookie-btn-primary:hover {
      background-color: #1f5c39;
      border-color: var(--color-tanimbary);
    }

    .cookie-btn-secondary {
      background-color: var(--color-surface-input);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    .cookie-btn-secondary:hover {
      background-color: var(--color-surface-hover);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .cookie-btn-outline {
      background: none;
      border-color: var(--color-ochre);
      color: var(--color-ochre);
    }

    .cookie-btn-outline:hover {
      background-color: var(--color-ochre-bg);
    }

    /* Modal de personnalisation détaillée */
    .cookie-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      animation: cookieFadeIn 0.2s ease-out;
    }

    @keyframes cookieFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .cookie-modal-box {
      width: 100%;
      max-width: 540px;
      max-height: 90vh;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .cookie-modal-header {
      padding: 18px 20px 14px;
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .cookie-modal-title {
      font-size: 17px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.3px;
    }

    .cookie-modal-close-btn {
      background: none;
      border: none;
      color: var(--color-text-secondary);
      font-size: 16px;
      cursor: pointer;
      padding: 4px 8px;
      line-height: 1;
      border-radius: var(--radius-sm);
    }

    .cookie-modal-close-btn:hover {
      color: #FFFFFF;
    }

    .cookie-modal-body {
      padding: 18px 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .cookie-modal-intro {
      font-size: 12.5px;
      color: var(--color-text-secondary);
      line-height: 1.45;
    }

    .cookie-category-item {
      background-color: var(--color-surface-input);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 14px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 14px;
    }

    .cookie-category-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .cookie-category-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cookie-category-title-row h3 {
      font-size: 13px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .cookie-status-badge {
      font-size: 10px;
      font-weight: 600;
      padding: 2px 7px;
      border-radius: var(--radius-full);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .cookie-status-badge.required {
      background-color: rgba(107, 158, 97, 0.15);
      color: var(--color-tanimbary);
      border: 1px solid rgba(107, 158, 97, 0.3);
    }

    .cookie-status-badge.optional {
      background-color: rgba(197, 139, 56, 0.15);
      color: var(--color-ochre);
      border: 1px solid rgba(197, 139, 56, 0.3);
    }

    .cookie-category-info p {
      font-size: 11.5px;
      color: var(--color-text-muted);
      line-height: 1.4;
    }

    /* Toggle switches */
    .cookie-toggle-wrapper {
      position: relative;
      width: 40px;
      height: 22px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .cookie-toggle-wrapper input {
      opacity: 0;
      width: 0;
      height: 0;
      position: absolute;
    }

    .cookie-toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: #2D2D2A;
      border: 1px solid var(--color-border);
      border-radius: 22px;
      transition: all 0.2s ease;
    }

    .cookie-toggle-slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 2px;
      bottom: 2px;
      background-color: #8C8C88;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .cookie-toggle-wrapper input:checked + .cookie-toggle-slider {
      background-color: var(--color-tanimbary-dark);
      border-color: var(--color-tanimbary);
    }

    .cookie-toggle-wrapper input:checked + .cookie-toggle-slider:before {
      transform: translateX(18px);
      background-color: #FFFFFF;
    }

    .cookie-toggle-slider.disabled {
      cursor: not-allowed;
      opacity: 0.8;
    }

    .cookie-modal-footer {
      padding: 14px 20px;
      border-top: 1px solid var(--color-border);
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-end;
      align-items: center;
      background-color: var(--color-surface-input);
    }

    .btn-switch-tab-link {
      background: none;
      border: none;
      color: var(--color-ochre);
      font-family: inherit;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      padding: 4px 0;
      text-decoration: underline;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .btn-switch-tab-link:hover {
      color: #E0A24A;
    }
  </style>
</head>
<body>

  <!-- En-tête officiel Kanto -->
  <header>
    <a href="/" class="brand" aria-label="Kanto">
      <div class="brand-mark">K</div>
      <span class="brand-wordmark">kanto<span class="brand-domain">.mg</span></span>
    </a>
    <div class="status-pill">
      <span class="status-indicator"></span>
      <span id="header-tester-count">${countBadgeText}</span>
    </div>
  </header>

  <!-- Contenu principal -->
  <main>
    ${
      fromDeeplink
        ? `
    <!-- Bandeau contextuel pour les utilisateurs arrivant d'un QR Code ou d'un Deeplink -->
    <div class="deeplink-banner">
      <div class="deeplink-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
      </div>
      <div class="deeplink-content">
        <strong>Lien Kanto détecté</strong>
        Vous tentez d'ouvrir un contenu partagé. L'application est actuellement accessible via notre programme de test fermé Google Play. Inscrivez-vous ci-dessous ou téléchargez-la si vous êtes déjà testeur !
      </div>
    </div>
    `
        : ''
    }

    <div class="intro">
      <span class="section-eyebrow">Accès Anticipé Android</span>
      <h1>Programme de test fermé</h1>
      <p class="intro-description">
        Rejoignez les testeurs Kanto sur Google Play pour découvrir la culture, les quiz et le patrimoine malgache en avant-première.
      </p>
    </div>

    <div class="card">
      <!-- Sélecteur d'onglets (Nouveau candidat vs Déjà inscrit) -->
      <div class="tabs-nav">
        <button type="button" class="tab-btn ${initialTab === 'register' ? 'active' : ''}" id="tab-btn-register">
          <span class="tab-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="22" y1="11" x2="16" y2="11"></line>
            </svg>
          </span>
          <span>Inscription testeur</span>
        </button>
        <button type="button" class="tab-btn ${initialTab === 'already_registered' || initialTab === 'download' ? 'active' : ''}" id="tab-btn-already">
          <span class="tab-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </span>
          <span>Télécharger l'application</span>
        </button>
      </div>

      <!-- Bandeaux d'alerte / feedback -->
      <div id="error-banner" class="banner error">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span id="error-text">${errorVal}</span>
      </div>

      <div id="success-banner" class="banner success">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span id="success-text"></span>
      </div>

      <!-- ─── ONGLET 1 : FORMULAIRE D'INSCRIPTION (E-MAIL UNIQUEMENT) ─── -->
      <div id="panel-register" style="display: ${initialTab === 'register' && !isRegistered ? 'block' : 'none'};">
        <form id="waitlist-form" method="POST" action="/api/beta-testers/register">
          <!-- Honeypot anti-bot -->
          <div class="hp-trap">
            <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
          </div>

          <div class="field">
            <label class="field-label" for="email">
              <span>Votre adresse Gmail</span>
              <span class="required">Requis pour Google Play</span>
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              class="field-input" 
              placeholder="votre.adresse@gmail.com" 
              required 
              autocomplete="email"
            >
            <p class="field-note">
              Renseignez l'adresse Gmail connectée au Play Store de votre smartphone Android.
            </p>
          </div>

          <button type="submit" class="btn-submit" id="btn-submit">
            <span>Demander l'accès testeur</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </form>
      </div>

      <!-- ─── ONGLET 2 : TÉLÉCHARGEMENT OFFICIEL GOOGLE PLAY ─── -->
      <div id="panel-already" style="display: ${initialTab === 'already_registered' || initialTab === 'download' || isRegistered ? 'block' : 'none'};">
        <div class="already-box">
          
          <div class="action-panel">
            <div class="action-panel-header">
              <div class="action-icon ochre">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </div>
              <div class="action-panel-titles">
                <h3>Télécharger l'application</h3>
                <p>Accès au test fermé officiel Google Play Store</p>
              </div>
            </div>

            <div class="download-grid">
              <!-- Étape 1 : Valider sur le Web -->
              <a href="https://play.google.com/apps/testing/com.devengalere.kantomg" target="_blank" rel="noopener" class="btn-play">
                <div class="play-step">
                  <div class="step-number">1</div>
                  <div class="step-texts">
                    <span class="step-title">Valider mon accès Web (Google Play)</span>
                    <span class="step-desc">Cliquez sur « Devenir testeur » avec votre compte Gmail</span>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>

              <!-- Étape 2 : Télécharger l'application -->
              <a href="https://play.google.com/store/apps/details?id=com.devengalere.kantomg" target="_blank" rel="noopener" class="btn-play">
                <div class="play-step">
                  <div class="step-number">2</div>
                  <div class="step-texts">
                    <span class="step-title">Installer sur Google Play</span>
                    <span class="step-desc">Ouvrir la fiche de l'application sur le Play Store</span>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>

              <!-- Option 3 : Ouvrir l'application directement -->
              <a href="kantomg://" class="btn-open-scheme">
                <span>Déjà installée sur ce téléphone ? <strong>Ouvrir Kanto</strong></span>
              </a>
            </div>
          </div>

        </div>
      </div>

      <!-- Écran de confirmation après envoi -->
      <div class="confirmation" id="confirmation-view" style="display: ${isRegistered ? 'flex' : 'none'};">
        <div class="confirmation-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2 class="confirmation-title">Candidature enregistrée avec succès</h2>
        <p style="font-size: 13.5px; color: var(--color-text-secondary); line-height: 1.5;">
          Votre compte a bien été enregistré. Un email de confirmation a été expédié à :
        </p>
        <div>
          <span class="email-highlight" id="confirmed-email-display">${emailVal || 'votre.adresse@gmail.com'}</span>
        </div>
        <p style="font-size: 12px; color: var(--color-text-muted); line-height: 1.45;">
          Dès validation de votre compte sur la <strong>Google Play Console</strong>, vous recevrez vos liens d'invitation pour installer l'application.
        </p>
        <button type="button" class="btn-secondary" id="btn-switch-already">
          Accéder aux liens de téléchargement
        </button>
      </div>

    </div>

    <!-- Réassurance discrète -->
    <div class="reassurance">
      <span>Closed Testing Google Play Console</span>
      <span>Données protégées et confidentielles</span>
    </div>
  </main>

  <!-- Bannière de consentement aux cookies Kanto -->
  <aside id="kanto-cookie-banner" class="cookie-banner" role="region" aria-label="Gestion des cookies et de la confidentialité" style="display: none;">
    <div class="cookie-banner-container">
      <div class="cookie-banner-header">
        <div class="cookie-banner-title-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-tanimbary); flex-shrink: 0;">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <h2 class="cookie-banner-title">Respect de votre vie privée &amp; Confidentialité</h2>
        </div>
        <p class="cookie-banner-text">
          Nous utilisons des cookies strictement nécessaires au fonctionnement de la plateforme. Avec votre accord, nous pouvons également activer des cookies pour mémoriser vos préférences, mesurer anonymement l'audience et évaluer nos campagnes d'invitation. Vos choix sont conservés pendant 6 mois et restent modifiables à tout moment.
        </p>
      </div>
      <div class="cookie-banner-actions">
        <button type="button" id="cookie-btn-accept-all" class="cookie-btn cookie-btn-primary">Tout accepter</button>
        <button type="button" id="cookie-btn-reject-all" class="cookie-btn cookie-btn-secondary">Tout refuser</button>
        <button type="button" id="cookie-btn-customize" class="cookie-btn cookie-btn-outline">Personnaliser mes choix</button>
      </div>
    </div>
  </aside>

  <!-- Modal de personnalisation détaillée des préférences cookies -->
  <div id="kanto-cookie-modal" class="cookie-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title" style="display: none;">
    <div class="cookie-modal-box">
      <div class="cookie-modal-header">
        <div>
          <span class="section-eyebrow">Confidentialité &amp; Traçage</span>
          <h2 id="cookie-modal-title" class="cookie-modal-title">Préférences de confidentialité</h2>
        </div>
        <button type="button" id="cookie-modal-close" class="cookie-modal-close-btn" aria-label="Fermer la fenêtre">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="cookie-modal-body">
        <p class="cookie-modal-intro">
          Sélectionnez les catégories de cookies et traceurs que vous acceptez d'activer sur votre appareil. Vous pouvez modifier ou retirer votre consentement à tout instant via le lien « Gestion des cookies » présent dans le pied de page.
        </p>

        <!-- Catégorie 1 : Nécessaires -->
        <div class="cookie-category-item">
          <div class="cookie-category-info">
            <div class="cookie-category-title-row">
              <h3>Cookies nécessaires</h3>
              <span class="cookie-status-badge required">Toujours actif</span>
            </div>
            <p>Indispensables au fonctionnement technique, à la sécurité des sessions et à la mémorisation de vos choix. Ils ne peuvent pas être désactivés (exemption légale Art. 82 ePrivacy / RGPD).</p>
          </div>
          <div class="cookie-toggle-wrapper">
            <input type="checkbox" id="cookie-cat-necessary" checked disabled aria-label="Cookies nécessaires (toujours actifs)">
            <label for="cookie-cat-necessary" class="cookie-toggle-slider disabled"></label>
          </div>
        </div>

        <!-- Catégorie 2 : Préférences -->
        <div class="cookie-category-item">
          <div class="cookie-category-info">
            <div class="cookie-category-title-row">
              <h3>Préférences &amp; Fonctionnalités</h3>
              <span class="cookie-status-badge optional">Optionnel</span>
            </div>
            <p>Permettent de mémoriser vos paramètres de confort tels que la langue d'affichage ou le dernier onglet consulté.</p>
          </div>
          <div class="cookie-toggle-wrapper">
            <input type="checkbox" id="cookie-cat-preferences">
            <label for="cookie-cat-preferences" class="cookie-toggle-slider"></label>
          </div>
        </div>

        <!-- Catégorie 3 : Mesure d'audience -->
        <div class="cookie-category-item">
          <div class="cookie-category-info">
            <div class="cookie-category-title-row">
              <h3>Mesure d'audience (Statistiques)</h3>
              <span class="cookie-status-badge optional">Optionnel</span>
            </div>
            <p>Collectent des données statistiques anonymisées sur la fréquentation et la navigation afin d'améliorer la fluidité de nos services.</p>
          </div>
          <div class="cookie-toggle-wrapper">
            <input type="checkbox" id="cookie-cat-analytics">
            <label for="cookie-cat-analytics" class="cookie-toggle-slider"></label>
          </div>
        </div>

        <!-- Catégorie 4 : Marketing et communication -->
        <div class="cookie-category-item">
          <div class="cookie-category-info">
            <div class="cookie-category-title-row">
              <h3>Marketing &amp; Campagnes</h3>
              <span class="cookie-status-badge optional">Optionnel</span>
            </div>
            <p>Utilisés pour évaluer l'impact des campagnes d'invitation des testeurs sur Google Play et orienter nos communications culturelles.</p>
          </div>
          <div class="cookie-toggle-wrapper">
            <input type="checkbox" id="cookie-cat-marketing">
            <label for="cookie-cat-marketing" class="cookie-toggle-slider"></label>
          </div>
        </div>
      </div>

      <div class="cookie-modal-footer">
        <button type="button" id="cookie-modal-btn-reject" class="cookie-btn cookie-btn-secondary">Tout refuser</button>
        <button type="button" id="cookie-modal-btn-save" class="cookie-btn cookie-btn-primary">Enregistrer mes préférences</button>
        <button type="button" id="cookie-modal-btn-accept" class="cookie-btn cookie-btn-outline">Tout accepter</button>
      </div>
    </div>
  </div>

  <!-- Pied de page officiel -->
  <footer>
    <div class="footer-nav">
      <a href="https://auth-kanto.gastsar.fr/pages/terms">Conditions d'utilisation (CGU)</a>
      <a href="https://auth-kanto.gastsar.fr/pages/privacy">Confidentialité</a>
      <button type="button" class="footer-cookie-btn" id="btn-cookie-settings">Gestion des cookies</button>
      <a href="mailto:contact@kanto.mg">Contact</a>
    </div>
    <div class="footer-copy">
      © ${currentYear} Kanto • Lova, Kolontsaina &amp; Tantara Malagasy
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
  // 1. Éléments DOM
  var tabRegister = document.getElementById('tab-btn-register');
  var tabAlready = document.getElementById('tab-btn-already');
  var panelRegister = document.getElementById('panel-register');
  var panelAlready = document.getElementById('panel-already');
  var confirmationView = document.getElementById('confirmation-view');
  var switchAlreadyBtn = document.getElementById('btn-switch-already');

  var errorBanner = document.getElementById('error-banner');
  var errorText = document.getElementById('error-text');
  var successBanner = document.getElementById('success-banner');
  var successText = document.getElementById('success-text');

  var waitlistForm = document.getElementById('waitlist-form');
  var btnSubmit = document.getElementById('btn-submit');
  var confirmedEmailDisplay = document.getElementById('confirmed-email-display');

  // 2. Fonctions de bascule d'onglets
  function switchTab(tab) {
    hideBanners();
    if (tab === 'register') {
      if (tabRegister) tabRegister.classList.add('active');
      if (tabAlready) tabAlready.classList.remove('active');
      if (panelRegister) panelRegister.style.display = 'block';
      if (panelAlready) panelAlready.style.display = 'none';
      if (confirmationView) confirmationView.style.display = 'none';
    } else {
      if (tabAlready) tabAlready.classList.add('active');
      if (tabRegister) tabRegister.classList.remove('active');
      if (panelAlready) panelAlready.style.display = 'block';
      if (panelRegister) panelRegister.style.display = 'none';
      if (confirmationView) confirmationView.style.display = 'none';
    }
  }

  if (tabRegister) {
    tabRegister.addEventListener('click', function() { switchTab('register'); });
  }
  if (tabAlready) {
    tabAlready.addEventListener('click', function() { switchTab('already'); });
  }
  if (switchAlreadyBtn) {
    switchAlreadyBtn.addEventListener('click', function() { switchTab('already'); });
  }

  // 3. Lecture des paramètres d'URL (?tab=already_registered, etc.)
  if (window.location.search) {
    try {
      var params = new URLSearchParams(window.location.search);
      var tabParam = params.get('tab');
      if (tabParam === 'already_registered' || tabParam === 'download') {
        switchTab('already');
      }
      var emailParam = params.get('email');
      if (emailParam) {
        var emailInput = document.getElementById('email');
        if (emailInput) emailInput.value = emailParam;
      }
    } catch (e) {}
  }

  // 4. Soumission AJAX du formulaire d'inscription
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      hideBanners();

      var emailEl = document.getElementById('email');
      var websiteEl = document.getElementById('website');

      var email = emailEl ? emailEl.value.trim() : '';
      var website = websiteEl ? websiteEl.value.trim() : '';

      if (!email || email.indexOf('@') === -1) {
        showError('Veuillez renseigner une adresse Gmail valide.');
        return;
      }

      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span>Enregistrement en cours...</span>';
      }

      try {
        var res = await fetch('/api/beta-testers/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            website: website
          })
        });

        var data = await res.json();

        if (res.ok && data.success && !data.alreadyRegistered) {
          if (panelRegister) panelRegister.style.display = 'none';
          if (confirmationView) confirmationView.style.display = 'flex';
          if (confirmedEmailDisplay) confirmedEmailDisplay.innerText = email;

          // Mise à jour discrète du badge si nouveau testeur
          var badgeEl = document.getElementById('header-tester-count');
          if (badgeEl) {
            var match = badgeEl.innerText.match(/[0-9]+/);
            if (match) {
              var newCount = parseInt(match[0], 10) + 1;
              badgeEl.innerText = newCount + ' testeurs inscrits';
            }
          }
        } else if (data.alreadyRegistered) {
          // Si l'adresse existe déjà : pas de doublon, pas de seconde confirmation, affichage d'un message adapté
          var dupMsg = data.message || 'Cette adresse e-mail est déjà inscrite au programme bêta.';
          showDuplicateNotice(dupMsg);
        } else {
          var msg = data.message || "Une erreur est survenue lors de l'enregistrement.";
          showError(Array.isArray(msg) ? msg.join(' ; ') : msg);
        }
      } catch (err) {
        showError('Impossible de joindre le serveur. Veuillez vérifier votre connexion.');
      } finally {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML =
            "<span>Demander l'accès testeur</span> <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='5' y1='12' x2='19' y2='12'></line><polyline points='12 5 19 12 12 19'></polyline></svg>";
        }
      }
    });
  }

  function showError(msg) {
    if (errorBanner && errorText) {
      errorText.innerText = msg;
      errorBanner.style.display = 'flex';
    }
  }

  function showDuplicateNotice(msg) {
    if (errorBanner && errorText) {
      errorText.innerHTML = '<span>' + escapeHtmlJs(msg) + '</span>' +
        '<div style="margin-top: 6px;">' +
        '<button type="button" class="btn-switch-tab-link" id="btn-quick-download">' +
        "Accéder directement aux liens de téléchargement Google Play →" +
        '</button>' +
        '</div>';
      errorBanner.style.display = 'flex';

      var quickBtn = document.getElementById('btn-quick-download');
      if (quickBtn) {
        quickBtn.addEventListener('click', function() {
          switchTab('already');
        });
      }
    }
  }

  function escapeHtmlJs(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showSuccess(msg) {
    if (successBanner && successText) {
      successText.innerText = msg;
      successBanner.style.display = 'flex';
    }
  }

  function hideBanners() {
    if (errorBanner) errorBanner.style.display = 'none';
    if (successBanner) successBanner.style.display = 'none';
  }

  // ─── GESTION DU CONSENTEMENT DES COOKIES (CONFORMITÉ RGPD & ePrivacy) ───
  var COOKIE_CONSENT_KEY = 'kanto_cookie_consent';
  var CONSENT_MAX_AGE_DAYS = 180; // 6 mois (durée maximale de validité recommandée CNIL)

  var cookieBanner = document.getElementById('kanto-cookie-banner');
  var cookieModal = document.getElementById('kanto-cookie-modal');
  var btnAcceptAll = document.getElementById('cookie-btn-accept-all');
  var btnRejectAll = document.getElementById('cookie-btn-reject-all');
  var btnCustomize = document.getElementById('cookie-btn-customize');
  var btnModalClose = document.getElementById('cookie-modal-close');
  var btnModalSave = document.getElementById('cookie-modal-btn-save');
  var btnModalAccept = document.getElementById('cookie-modal-btn-accept');
  var btnModalReject = document.getElementById('cookie-modal-btn-reject');
  var btnFooterCookie = document.getElementById('btn-cookie-settings');

  var togglePreferences = document.getElementById('cookie-cat-preferences');
  var toggleAnalytics = document.getElementById('cookie-cat-analytics');
  var toggleMarketing = document.getElementById('cookie-cat-marketing');

  function getStoredConsent() {
    var raw = null;
    var cookieMatch = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_CONSENT_KEY + '=([^;]*)'));
    if (cookieMatch) {
      raw = decodeURIComponent(cookieMatch[1]);
    }
    if (!raw) {
      try {
        raw = localStorage.getItem(COOKIE_CONSENT_KEY);
      } catch (e) {}
    }
    if (!raw) return null;

    try {
      var parsed = JSON.parse(raw);
      // Expiration au bout de 180 jours
      if (parsed.timestamp && (Date.now() - parsed.timestamp) > (CONSENT_MAX_AGE_DAYS * 86400 * 1000)) {
        return null;
      }
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(categories, actionType) {
    var consentData = {
      version: 1,
      timestamp: Date.now(),
      action: actionType || 'custom',
      categories: {
        necessary: true,
        preferences: Boolean(categories.preferences),
        analytics: Boolean(categories.analytics),
        marketing: Boolean(categories.marketing)
      }
    };

    var serialized = JSON.stringify(consentData);
    var maxAgeSeconds = CONSENT_MAX_AGE_DAYS * 86400;

    // Définition du cookie HTTP avec durée de conservation conforme (180j)
    document.cookie = COOKIE_CONSENT_KEY + '=' + encodeURIComponent(serialized) +
      '; Path=/; Max-Age=' + maxAgeSeconds + '; SameSite=Lax';

    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, serialized);
    } catch (e) {}

    applyConsent(consentData.categories);

    try {
      window.dispatchEvent(new CustomEvent('kanto:consent-updated', { detail: consentData }));
    } catch (e) {}

    if (cookieBanner) cookieBanner.style.display = 'none';
    closeModal();
  }

  function applyConsent(categories) {
    // Débloque et exécute dynamiquement les balises scripts conditionnelles
    var blockedScripts = document.querySelectorAll('script[type="text/plain"][data-consent-category]');
    for (var i = 0; i < blockedScripts.length; i++) {
      var scriptEl = blockedScripts[i];
      var cat = scriptEl.getAttribute('data-consent-category');
      if (categories && categories[cat]) {
        var unblocked = document.createElement('script');
        unblocked.type = 'text/javascript';
        if (scriptEl.src) {
          unblocked.src = scriptEl.src;
        } else {
          unblocked.text = scriptEl.text;
        }
        scriptEl.parentNode.replaceChild(unblocked, scriptEl);
      }
    }
  }

  function openModal() {
    var current = getStoredConsent();
    if (togglePreferences) {
      togglePreferences.checked = current ? Boolean(current.categories.preferences) : false;
    }
    if (toggleAnalytics) {
      toggleAnalytics.checked = current ? Boolean(current.categories.analytics) : false;
    }
    if (toggleMarketing) {
      toggleMarketing.checked = current ? Boolean(current.categories.marketing) : false;
    }
    if (cookieModal) {
      cookieModal.style.display = 'flex';
      if (btnModalClose) btnModalClose.focus();
    }
  }

  function closeModal() {
    if (cookieModal) cookieModal.style.display = 'none';
  }

  // Vérification de la présence d'un choix préalable valide
  var activeConsent = getStoredConsent();
  if (!activeConsent) {
    if (cookieBanner) cookieBanner.style.display = 'block';
  } else {
    applyConsent(activeConsent.categories);
  }

  // Écouteurs de la bannière
  if (btnAcceptAll) {
    btnAcceptAll.addEventListener('click', function() {
      saveConsent({ preferences: true, analytics: true, marketing: true }, 'accept_all');
    });
  }
  if (btnRejectAll) {
    btnRejectAll.addEventListener('click', function() {
      saveConsent({ preferences: false, analytics: false, marketing: false }, 'reject_all');
    });
  }
  if (btnCustomize) {
    btnCustomize.addEventListener('click', function() {
      if (cookieBanner) cookieBanner.style.display = 'none';
      openModal();
    });
  }

  // Écouteurs de la modale de préférences
  if (btnModalClose) {
    btnModalClose.addEventListener('click', closeModal);
  }
  if (btnModalSave) {
    btnModalSave.addEventListener('click', function() {
      saveConsent({
        preferences: togglePreferences ? togglePreferences.checked : false,
        analytics: toggleAnalytics ? toggleAnalytics.checked : false,
        marketing: toggleMarketing ? toggleMarketing.checked : false
      }, 'custom');
    });
  }
  if (btnModalAccept) {
    btnModalAccept.addEventListener('click', function() {
      saveConsent({ preferences: true, analytics: true, marketing: true }, 'accept_all');
    });
  }
  if (btnModalReject) {
    btnModalReject.addEventListener('click', function() {
      saveConsent({ preferences: false, analytics: false, marketing: false }, 'reject_all');
    });
  }

  // Accès permanent depuis le pied de page
  if (btnFooterCookie) {
    btnFooterCookie.addEventListener('click', openModal);
  }

  // Accessibilité : Fermeture au clavier via Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cookieModal && cookieModal.style.display !== 'none') {
      closeModal();
    }
  });

  // API globale KantoConsent
  window.KantoConsent = {
    getConsent: getStoredConsent,
    hasConsent: function(category) {
      if (category === 'necessary') return true;
      var c = getStoredConsent();
      return Boolean(c && c.categories && c.categories[category]);
    },
    openSettings: openModal,
    acceptAll: function() { saveConsent({ preferences: true, analytics: true, marketing: true }, 'accept_all'); },
    rejectAll: function() { saveConsent({ preferences: false, analytics: false, marketing: false }, 'reject_all'); },
    applyConsent: function() {
      var c = getStoredConsent();
      if (c) applyConsent(c.categories);
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
