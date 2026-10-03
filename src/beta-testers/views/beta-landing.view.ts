/**
 * Kanto — Page web d'accès anticipé et d'inscription au test fermé Google Play.
 * Accessible sur app-kanto.gastsar.fr ou /beta.
 *
 * Design System Kanto officiel :
 * - Teinte Tanimbary (#6B9E61 / #4A6741) & Ocre Ambre (#E0A24A)
 * - Fond minéral charbon chaud (#0D0D0B) & surfaces feutrées (#141412)
 * - Bordures rigoureuses de 8px (règle RADIUS Kanto : pas d'arrondis excessifs)
 * - Zéro emoji, esthétique sobre, typographique et artisanale
 */

export function renderBetaLandingPage(): string {
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Bêta-Testeur Kanto • Accès Anticipé Android</title>
  <meta name="description" content="Programme de test fermé de l'application Kanto sur Google Play. Découvrez les contes, proverbes et le patrimoine malgache en avant-première.">
  <meta name="theme-color" content="#0D0D0B">

  <!-- Open Graph -->
  <meta property="og:title" content="Bêta-Testeur Kanto • Accès Anticipé Android">
  <meta property="og:description" content="Accès anticipé fermé sur le Google Play Store pour l'application Kanto.">
  <meta property="og:type" content="website">

  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    :root {
      /* Palette officielle Kanto Tanimbary (Dark Mode) */
      --color-bg: #0D0D0B;
      --color-surface: #141412;
      --color-surface-input: #1C1C1A;
      --color-surface-hover: #1E1E1B;
      
      --color-border: #242420;
      --color-border-subtle: #1B211B;
      --color-divider: #282824;
      
      --color-tanimbary: #6B9E61;
      --color-tanimbary-dark: #4A6741;
      --color-tanimbary-glow: rgba(107, 158, 97, 0.15);
      
      --color-ochre: #E0A24A;
      --color-ochre-bg: #241B10;
      --color-ochre-border: #47341D;
      
      --color-text: #F0F0EC;
      --color-text-secondary: #9C9C98;
      --color-text-muted: #707070;
      
      --color-error: #E75A4D;
      --color-error-bg: #2C1715;
      --color-error-border: #522522;
      
      /* Système de rayon Kanto strict : 8px max pour cartes et boutons */
      --radius-sm: 6px;
      --radius-md: 8px;
      --radius-lg: 12px;
      
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

    /* Grille de fond feutrée très subtile */
    body::before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 380px;
      background: radial-gradient(ellipse 60% 180px at 50% -20px, rgba(107, 158, 97, 0.08) 0%, transparent 80%);
      pointer-events: none;
      z-index: 0;
    }

    /* En-tête sobre et fidèle à l'application */
    header {
      width: 100%;
      max-width: 580px;
      margin: 0 auto;
      padding: 32px 24px 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 10;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }

    /* Emblème géométrique Tanimbary carré à coins 8px (pas circulaire) */
    .brand-mark {
      width: 30px;
      height: 30px;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-tanimbary);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .brand-wordmark {
      font-size: 13px;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--color-tanimbary);
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: 11px;
      font-weight: 600;
      color: var(--color-text-secondary);
      letter-spacing: 0.3px;
    }

    .status-indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--color-tanimbary);
    }

    /* Conteneur principal */
    main {
      flex: 1;
      width: 100%;
      max-width: 460px;
      margin: 0 auto;
      padding: 40px 24px 32px 24px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      z-index: 10;
    }

    /* Typographie d'accroche */
    .intro {
      margin-bottom: 24px;
    }

    .section-eyebrow {
      display: block;
      font-size: 11px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      font-weight: 600;
      color: var(--color-ochre);
      margin-bottom: 8px;
    }

    h1 {
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.5px;
      line-height: 1.25;
      color: var(--color-text);
      margin-bottom: 8px;
    }

    .intro-description {
      font-size: 14px;
      color: var(--color-text-secondary);
      line-height: 1.55;
    }

    /* Carte de formulaire Kanto */
    .card {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 24px;
      position: relative;
    }

    /* Bannière d'erreur */
    .error-banner {
      display: none;
      align-items: flex-start;
      gap: 8px;
      padding: 10px 12px;
      background-color: var(--color-error-bg);
      border: 1px solid var(--color-error-border);
      border-radius: var(--radius-md);
      font-size: 12.5px;
      color: var(--color-error);
      margin-bottom: 18px;
      line-height: 1.45;
    }

    .error-banner svg {
      flex-shrink: 0;
      margin-top: 2px;
    }

    .field {
      margin-bottom: 16px;
    }

    .field-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12.5px;
      font-weight: 600;
      color: var(--color-text-secondary);
      margin-bottom: 6px;
    }

    .field-label .hint {
      font-size: 11px;
      font-weight: 400;
      color: var(--color-text-muted);
    }

    .field-label .required {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-tanimbary);
    }

    .field-input {
      width: 100%;
      height: 44px;
      background-color: var(--color-surface-input);
      border: 1px solid var(--color-divider);
      border-radius: var(--radius-md);
      padding: 0 12px;
      font-size: 14px;
      color: var(--color-text);
      font-family: inherit;
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .field-input::placeholder {
      color: var(--color-text-muted);
      font-size: 13.5px;
    }

    .field-input:focus {
      border-color: var(--color-tanimbary);
      box-shadow: 0 0 0 3px var(--color-tanimbary-glow);
    }

    .field-note {
      font-size: 11.5px;
      color: var(--color-text-muted);
      margin-top: 5px;
      line-height: 1.4;
    }

    /* Champ piège honeypot invisible */
    .hp-trap {
      display: none !important;
      position: absolute;
      left: -9999px;
    }

    /* Bouton principal Kanto */
    .btn-submit {
      width: 100%;
      height: 46px;
      margin-top: 8px;
      background-color: var(--color-tanimbary);
      color: #FFFFFF;
      border: none;
      border-radius: var(--radius-md);
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      letter-spacing: 0.1px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background-color 0.15s ease, opacity 0.15s ease;
    }

    .btn-submit:hover:not(:disabled) {
      background-color: #5B8852;
    }

    .btn-submit:active:not(:disabled) {
      background-color: var(--color-tanimbary-dark);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-submit svg {
      transition: transform 0.15s ease;
    }

    .btn-submit:hover:not(:disabled) svg {
      transform: translateX(2px);
    }

    /* Écran de confirmation sobre */
    .confirmation {
      display: none;
      padding: 8px 0;
    }

    .confirmation-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .confirmation-icon {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      background-color: rgba(107, 158, 97, 0.12);
      border: 1px solid rgba(107, 158, 97, 0.28);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-tanimbary);
      flex-shrink: 0;
    }

    .confirmation-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--color-text);
    }

    .confirmation-body {
      font-size: 13.5px;
      color: var(--color-text-secondary);
      line-height: 1.6;
    }

    .confirmation-meta {
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid var(--color-border);
      font-size: 12px;
      color: var(--color-text-muted);
    }

    /* Informations de réassurance sobres */
    .reassurance {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 4px;
      font-size: 11.5px;
      color: var(--color-text-muted);
    }

    .reassurance span {
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    /* Pied de page Kanto */
    footer {
      width: 100%;
      max-width: 580px;
      margin: 0 auto;
      padding: 20px 24px 28px 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
      position: relative;
      z-index: 10;
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
      main { padding: 24px 16px; }
      .card { padding: 20px 16px; }
      h1 { font-size: 23px; }
      .reassurance { flex-direction: column; gap: 6px; align-items: flex-start; }
    }
  </style>
</head>
<body>

  <!-- En-tête fidèle au wordmark Kanto -->
  <header>
    <a href="/" class="brand" aria-label="Kanto">
      <div class="brand-mark">K</div>
      <span class="brand-wordmark">Kanto</span>
    </a>
    <div class="status-pill">
      <span class="status-indicator"></span>
      <span>Google Play Bêta</span>
    </div>
  </header>

  <!-- Conteneur centré -->
  <main>
    <div class="intro">
      <span class="section-eyebrow">Accès Anticipé</span>
      <h1>Programme de test fermé</h1>
      <p class="intro-description">
        Inscrivez votre compte Google Play pour recevoir votre lien d'installation et découvrir Kanto sur Android en avant-première.
      </p>
    </div>

    <div class="card">
      <div id="error-banner" class="error-banner">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span id="error-text"></span>
      </div>

      <!-- Formulaire sobre sans surcharge -->
      <form id="waitlist-form" onsubmit="handleWaitlistSubmit(event)">
        <!-- Honeypot anti-spam -->
        <div class="hp-trap">
          <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
        </div>

        <div class="field">
          <label class="field-label" for="fullName">
            <span>Prénom ou pseudo</span>
            <span class="hint">Facultatif</span>
          </label>
          <input 
            type="text" 
            id="fullName" 
            name="fullName" 
            class="field-input" 
            placeholder="ex: Rova Razafy" 
            maxlength="100"
          >
        </div>

        <div class="field">
          <label class="field-label" for="email">
            <span>Adresse Gmail</span>
            <span class="required">Requis</span>
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
            Utilisez l'adresse associée à votre profil Google Play Store sur Android.
          </p>
        </div>

        <button type="submit" class="btn-submit" id="btn-submit">
          <span>Demander l'accès</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </form>

      <!-- Écran de confirmation épuré -->
      <div class="confirmation" id="confirmation-view">
        <div class="confirmation-header">
          <div class="confirmation-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 class="confirmation-title">Candidature enregistrée</h2>
        </div>
        <p class="confirmation-body" id="confirmation-message">
          Votre compte a bien été inscrit sur la liste des testeurs. Vous recevrez un e-mail officiel dès l'activation de votre accès sur la Google Play Console.
        </p>
        <p class="confirmation-meta">
          Vérifiez vos e-mails pour confirmer la bonne réception de l'accusé d'inscription.
        </p>
      </div>
    </div>

    <!-- Réassurance discrète -->
    <div class="reassurance">
      <span>Closed Testing Google Play</span>
      <span>Données strictement confidentielles</span>
    </div>
  </main>

  <!-- Pied de page avec liens CGU et Confidentialité -->
  <footer>
    <div class="footer-nav">
      <a href="https://auth-kanto.gastsar.fr/pages/terms">Conditions d'utilisation (CGU)</a>
      <a href="https://auth-kanto.gastsar.fr/pages/privacy">Confidentialité</a>
      <a href="mailto:contact@kanto.mg">Contact</a>
    </div>
    <div class="footer-copy">
      © ${currentYear} Kanto • Lova, Kolontsaina &amp; Tantara Malagasy
    </div>
  </footer>

  <script>
    async function handleWaitlistSubmit(event) {
      event.preventDefault();

      const btn = document.getElementById('btn-submit');
      const errorBanner = document.getElementById('error-banner');
      const errorText = document.getElementById('error-text');
      const form = document.getElementById('waitlist-form');
      const confirmationView = document.getElementById('confirmation-view');
      const confirmationMsg = document.getElementById('confirmation-message');

      errorBanner.style.display = 'none';

      const email = document.getElementById('email').value.trim();
      const fullName = document.getElementById('fullName').value.trim();
      const website = document.getElementById('website').value.trim();

      if (!email || !email.includes('@')) {
        showError('Veuillez renseigner une adresse email valide.');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<span>Inscription en cours...</span>';

      try {
        const res = await fetch('/api/beta-testers/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            email,
            fullName,
            website
          })
        });

        const data = await res.json();

        if (res.ok && data.success) {
          form.style.display = 'none';
          confirmationView.style.display = 'block';
          if (data.message) {
            confirmationMsg.innerText = data.message;
          }
        } else {
          const msg = data.message || "Une erreur est survenue lors de l'enregistrement.";
          showError(Array.isArray(msg) ? msg.join(' ; ') : msg);
          btn.disabled = false;
          btn.innerHTML = '<span>Demander l\\'accès</span> <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
        }
      } catch (err) {
        showError('Impossible de joindre le serveur. Veuillez vérifier votre connexion.');
        btn.disabled = false;
        btn.innerHTML = '<span>Demander l\\'accès</span> <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
      }
    }

    function showError(msg) {
      const errorBanner = document.getElementById('error-banner');
      const errorText = document.getElementById('error-text');
      errorText.innerText = msg;
      errorBanner.style.display = 'flex';
    }
  </script>
</body>
</html>
  `.trim();
}
