/**
 * Kanto — Page web d'inscription et d'accès anticipé au test fermé Google Play.
 * Accessible sur app-kanto.gastsar.fr ou /beta.
 * Design minimaliste, épuré, ultra-rapide et responsive.
 */

export function renderBetaLandingPage(): string {
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Kanto • Accès Anticipé Android | Programme Bêta Privé</title>
  <meta name="description" content="Rejoignez le programme de test fermé Google Play de Kanto. Contes audio, ohabolana, jeux et culture malgache en avant-première sur Android.">
  <meta name="theme-color" content="#070a12">

  <!-- Open Graph -->
  <meta property="og:title" content="Bêta-Testeur Kanto • Accès Anticipé Android">
  <meta property="og:description" content="Rejoignez la phase de test fermée sur Google Play. Découvrez Kanto en avant-première.">
  <meta property="og:type" content="website">

  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-dark: #070a12;
      --bg-card: rgba(15, 22, 36, 0.72);
      --border-subtle: rgba(255, 255, 255, 0.08);
      --border-focus: #10b981;
      
      --color-primary: #10b981;
      --color-primary-hover: #059669;
      --color-primary-glow: rgba(16, 185, 129, 0.22);
      
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-subtle: #64748b;
      
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-full: 9999px;
      
      --font: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: var(--font);
      line-height: 1.5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    /* Halo lumineux discret et apaisant */
    body::before {
      content: "";
      position: fixed;
      top: -160px;
      left: 50%;
      transform: translateX(-50%);
      width: 720px;
      height: 480px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(14, 165, 233, 0.04) 40%, transparent 70%);
      filter: blur(90px);
      pointer-events: none;
      z-index: 0;
    }

    /* Barre supérieure minimaliste */
    header {
      width: 100%;
      max-width: 680px;
      margin: 0 auto;
      padding: 24px 20px 0 20px;
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

    .brand-logo {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #10b981 0%, #047857 100%);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 800;
      font-size: 16px;
      box-shadow: 0 4px 12px var(--color-primary-glow);
    }

    .brand-name {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #ffffff;
      text-transform: uppercase;
    }

    .beta-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: var(--radius-full);
      font-size: 11px;
      font-weight: 600;
      color: #34d399;
    }

    .beta-dot {
      width: 6px;
      height: 6px;
      background-color: var(--color-primary);
      border-radius: 50%;
      box-shadow: 0 0 6px var(--color-primary);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    /* Conteneur principal centré */
    main {
      flex: 1;
      width: 100%;
      max-width: 540px;
      margin: 0 auto;
      padding: 24px 20px 40px 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      z-index: 10;
    }

    .hero-text {
      text-align: center;
      margin-bottom: 24px;
    }

    .pill-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-full);
      font-size: 12px;
      font-weight: 600;
      color: #cbd5e1;
      margin-bottom: 14px;
    }

    h1 {
      font-size: 32px;
      font-weight: 800;
      line-height: 1.25;
      letter-spacing: -0.5px;
      color: #ffffff;
      margin-bottom: 10px;
    }

    h1 span.gradient {
      background: linear-gradient(135deg, #10b981 0%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.6;
      max-width: 440px;
      margin: 0 auto;
    }

    /* Carte de formulaire épurée */
    .form-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 28px 24px;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4);
      position: relative;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      font-weight: 600;
      color: #e2e8f0;
      margin-bottom: 6px;
    }

    .form-label .badge-opt {
      font-size: 10.5px;
      color: var(--text-subtle);
      font-weight: 500;
    }

    .form-label .badge-req {
      font-size: 10.5px;
      color: #34d399;
      font-weight: 600;
    }

    .form-input {
      width: 100%;
      background: rgba(7, 10, 18, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-md);
      padding: 12px 14px;
      font-size: 14px;
      color: #ffffff;
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
    }

    .form-input:focus {
      border-color: var(--border-focus);
      background: rgba(7, 10, 18, 0.95);
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
    }

    .form-input::placeholder {
      color: #475569;
      font-size: 13.5px;
    }

    .form-helper {
      font-size: 11px;
      color: #64748b;
      margin-top: 5px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .form-helper.google {
      color: #94a3b8;
    }

    /* Champ piège anti-spam caché */
    .honeypot {
      display: none !important;
      position: absolute;
      left: -9999px;
    }

    /* Bouton d'action */
    .btn-submit {
      width: 100%;
      margin-top: 10px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      border: none;
      border-radius: var(--radius-md);
      padding: 13px 20px;
      font-size: 14px;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 16px rgba(16, 185, 129, 0.25);
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
      background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
    }

    .btn-submit:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-submit:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    /* Messages d'alerte */
    .alert-banner {
      display: none;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      font-size: 12.5px;
      margin-bottom: 16px;
      line-height: 1.4;
    }

    .alert-error {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
    }

    /* État de succès */
    .success-card {
      display: none;
      text-align: center;
      padding: 16px 8px;
    }

    .success-icon {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px auto;
    }

    .success-title {
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 8px;
    }

    .success-text {
      font-size: 13.5px;
      color: #cbd5e1;
      line-height: 1.6;
    }

    /* Réassurance discrète */
    .guarantees {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 18px;
      font-size: 11.5px;
      color: var(--text-subtle);
    }

    .guarantee-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    /* Pied de page épuré */
    footer {
      width: 100%;
      max-width: 680px;
      margin: 0 auto;
      padding: 16px 20px 24px 20px;
      text-align: center;
      position: relative;
      z-index: 10;
    }

    .footer-links {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }

    .footer-links a {
      color: #64748b;
      font-size: 12px;
      text-decoration: none;
      transition: color 0.15s ease;
    }

    .footer-links a:hover {
      color: #cbd5e1;
    }

    .footer-copy {
      font-size: 11px;
      color: #475569;
    }

    @media (max-width: 480px) {
      h1 { font-size: 26px; }
      .form-card { padding: 22px 18px; }
      .guarantees { flex-direction: column; gap: 6px; }
    }
  </style>
</head>
<body>

  <!-- En-tête sobre -->
  <header>
    <a href="/" class="brand" aria-label="Accueil Kanto">
      <div class="brand-logo">K</div>
      <span class="brand-name">Kanto</span>
    </a>
    <div class="beta-badge">
      <span class="beta-dot"></span>
      <span>Google Play Bêta</span>
    </div>
  </header>

  <!-- Contenu centré -->
  <main>
    <div class="hero-text">
      <div class="pill-tag">✨ Programme de Closed Testing</div>
      <h1>L'accès anticipé <span class="gradient">Kanto</span></h1>
      <p class="hero-subtitle">
        Rejoignez le cercle fermé des testeurs Android. Découvrez nos contes malgaches, duels de proverbes et sagesses en avant-première.
      </p>
    </div>

    <div class="form-card">
      <div id="alert-box" class="alert-banner"></div>

      <!-- Formulaire minimaliste -->
      <form id="beta-form" onsubmit="handleBetaSubmit(event)">
        <!-- Honeypot anti-spam -->
        <div class="honeypot">
          <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
        </div>

        <!-- Prénom ou pseudo -->
        <div class="form-group">
          <label class="form-label" for="fullName">
            <span>Votre prénom ou pseudo</span>
            <span class="badge-opt">Facultatif</span>
          </label>
          <input 
            type="text" 
            id="fullName" 
            name="fullName" 
            class="form-input" 
            placeholder="ex: Rova Razafy" 
            maxlength="100"
          >
        </div>

        <!-- Email Google obligatoire -->
        <div class="form-group">
          <label class="form-label" for="email">
            <span>Adresse Gmail (Google Play)</span>
            <span class="badge-req">Requis *</span>
          </label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            class="form-input" 
            placeholder="votre.compte@gmail.com" 
            required 
            autocomplete="email"
          >
          <div class="form-helper google">
            <span>ℹ️ L'adresse reliée au Google Play Store de votre smartphone Android.</span>
          </div>
        </div>

        <button type="submit" class="btn-submit" id="btn-submit">
          <span>Demander mon accès</span>
          <span>→</span>
        </button>
      </form>

      <!-- Écran de confirmation épuré -->
      <div class="success-card" id="success-box">
        <div class="success-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3 class="success-title">Misaotra betsaka ! 🎉</h3>
        <p class="success-text" id="success-message">
          Votre candidature a été enregistrée. Surveillez votre boîte Gmail : un accusé de réception vient d'être envoyé et vous recevrez votre invitation officielle dès l'activation sur la Google Play Console.
        </p>
      </div>
    </div>

    <!-- Éléments de réassurance -->
    <div class="guarantees">
      <div class="guarantee-item">
        <span>🔒</span>
        <span>Accès sécurisé et gratuit</span>
      </div>
      <div class="guarantee-item">
        <span>⚡</span>
        <span>Installation via Google Play</span>
      </div>
      <div class="guarantee-item">
        <span>✉️</span>
        <span>Zéro spam</span>
      </div>
    </div>
  </main>

  <!-- Pied de page avec liens CGU et Confidentialité -->
  <footer>
    <div class="footer-links">
      <a href="https://app-kanto.gastsar.fr/pages/terms">Conditions d'utilisation (CGU)</a>
      <a href="https://app-kanto.gastsar.fr/pages/privacy">Confidentialité</a>
      <a href="mailto:contact@kanto.mg">Contact</a>
    </div>
    <div class="footer-copy">
      © ${currentYear} Kanto • Lova &amp; Kolontsaina Malagasy. Tous droits réservés.
    </div>
  </footer>

  <!-- Script d'envoi AJAX épuré -->
  <script>
    async function handleBetaSubmit(event) {
      event.preventDefault();

      const btn = document.getElementById('btn-submit');
      const alertBox = document.getElementById('alert-box');
      const form = document.getElementById('beta-form');
      const successBox = document.getElementById('success-box');
      const successMessage = document.getElementById('success-message');

      alertBox.style.display = 'none';
      alertBox.className = 'alert-banner';

      const email = document.getElementById('email').value.trim();
      const fullName = document.getElementById('fullName').value.trim();
      const website = document.getElementById('website').value.trim();

      if (!email || !email.includes('@')) {
        showAlert('Veuillez saisir une adresse email valide.', 'alert-error');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<span>Envoi en cours...</span>';

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
          successBox.style.display = 'block';
          if (data.message) {
            successMessage.innerText = data.message;
          }
        } else {
          const errMsg = data.message || "Une erreur est survenue lors de l'enregistrement.";
          showAlert(Array.isArray(errMsg) ? errMsg.join(' ; ') : errMsg, 'alert-error');
          btn.disabled = false;
          btn.innerHTML = '<span>Demander mon accès</span> <span>→</span>';
        }
      } catch (err) {
        showAlert('Impossible de contacter le serveur. Veuillez vérifier votre connexion.', 'alert-error');
        btn.disabled = false;
        btn.innerHTML = '<span>Demander mon accès</span> <span>→</span>';
      }
    }

    function showAlert(msg, className) {
      const alertBox = document.getElementById('alert-box');
      alertBox.innerText = msg;
      alertBox.className = 'alert-banner ' + className;
      alertBox.style.display = 'block';
    }
  </script>
</body>
</html>
  `.trim();
}
