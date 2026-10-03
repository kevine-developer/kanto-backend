/**
 * Kanto — Page web de présentation et d'inscription aux phases de test bêta Google Play.
 * Accessible sur app-kanto.gastsar.fr ou /beta.
 * Design premium, responsive, fluide et interactif (Vanilla CSS + HTML5 sémantique).
 */

export function renderBetaLandingPage(): string {
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Kanto • Programme Bêta Privé Google Play | Lova &amp; Kolontsaina Malagasy</title>
  <meta name="description" content="Rejoignez le cercle fermé des testeurs Android de l'application Kanto sur le Google Play Store. Découvrez nos contes audio, duels culturels et jeux linguistiques malgaches en avant-première.">
  <meta name="theme-color" content="#0b0f19">

  <!-- Open Graph -->
  <meta property="og:title" content="Devenez Bêta-Testeur Kanto sur Google Play">
  <meta property="og:description" content="Accès anticipé exclusif à l'application Kanto sur Android. Participez à la renaissance numérique du patrimoine et de la langue malgache.">
  <meta property="og:type" content="website">

  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-dark: #090d16;
      --bg-surface: #101626;
      --bg-card: rgba(18, 24, 40, 0.75);
      --border-card: rgba(255, 255, 255, 0.08);
      --border-focus: #10b981;
      
      --color-primary: #10b981;
      --color-primary-light: #34d399;
      --color-primary-glow: rgba(16, 185, 129, 0.25);
      
      --color-accent: #f59e0b;
      --color-accent-light: #fbbf24;
      --color-terracotta: #c2410c;
      
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-subtle: #64748b;
      
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 22px;
      --radius-full: 9999px;
      
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-serif: 'Playfair Display', Georgia, serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: var(--font-sans);
      line-height: 1.6;
      overflow-x: hidden;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* Halo lumineux d'arrière-plan */
    body::before {
      content: "";
      position: fixed;
      top: -200px;
      left: 50%;
      transform: translateX(-50%);
      width: 900px;
      height: 600px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(245, 158, 11, 0.08) 45%, transparent 70%);
      filter: blur(80px);
      pointer-events: none;
      z-index: 0;
    }

    body::after {
      content: "";
      position: fixed;
      bottom: -150px;
      right: -100px;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(194, 65, 12, 0.12) 0%, transparent 70%);
      filter: blur(90px);
      pointer-events: none;
      z-index: 0;
    }

    /* Header Navigation */
    header {
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      background: rgba(9, 13, 22, 0.85);
      border-bottom: 1px solid var(--border-card);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }

    .brand-logo {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #10b981 0%, #047857 100%);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 800;
      font-size: 20px;
      box-shadow: 0 4px 14px var(--color-primary-glow);
    }

    .brand-title {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #fff;
      text-transform: uppercase;
    }

    .brand-subtitle {
      font-size: 11px;
      color: var(--color-accent);
      font-weight: 600;
      letter-spacing: 0.5px;
      display: block;
      margin-top: -3px;
    }

    .nav-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: var(--radius-full);
      font-size: 12px;
      font-weight: 600;
      color: var(--color-primary-light);
    }

    .nav-badge-dot {
      width: 7px;
      height: 7px;
      background-color: var(--color-primary);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--color-primary);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    /* Conteneur principal */
    main {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 24px 80px 24px;
      position: relative;
      z-index: 10;
      width: 100%;
    }

    /* Section Hero en 2 colonnes */
    .hero-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 48px;
      align-items: start;
      margin-top: 20px;
    }

    @media (max-width: 960px) {
      .hero-grid {
        grid-template-columns: 1fr;
        gap: 40px;
      }
    }

    .hero-content {
      padding-top: 12px;
    }

    .pill-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 6px 14px;
      border-radius: var(--radius-full);
      font-size: 12px;
      font-weight: 700;
      color: var(--color-accent-light);
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    h1.hero-title {
      font-size: 42px;
      font-weight: 800;
      line-height: 1.2;
      color: #ffffff;
      margin-bottom: 20px;
      letter-spacing: -0.5px;
    }

    h1.hero-title span.highlight {
      background: linear-gradient(135deg, #10b981 0%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-desc {
      font-size: 17px;
      color: var(--text-muted);
      line-height: 1.7;
      margin-bottom: 32px;
    }

    /* Carte de formulaire */
    .form-card {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: var(--radius-lg);
      padding: 36px 32px;
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
      position: relative;
    }

    .form-card::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: var(--radius-lg);
      padding: 1px;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(255, 255, 255, 0.05), rgba(245, 158, 11, 0.2));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    .form-header {
      margin-bottom: 24px;
    }

    .form-header h2 {
      font-size: 22px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 6px;
    }

    .form-header p {
      font-size: 13px;
      color: var(--text-muted);
    }

    .form-group {
      margin-bottom: 18px;
    }

    .form-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 8px;
    }

    .form-label span.required {
      color: var(--color-primary);
      font-size: 12px;
    }

    .form-label span.optional {
      color: var(--text-subtle);
      font-size: 11px;
      font-weight: 400;
    }

    .input-wrapper {
      position: relative;
    }

    .form-input, .form-textarea {
      width: 100%;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: var(--radius-md);
      padding: 12px 16px;
      font-size: 14px;
      color: #fff;
      font-family: inherit;
      transition: all 0.2s ease;
      outline: none;
    }

    .form-input:focus, .form-textarea:focus {
      border-color: var(--border-focus);
      background: rgba(15, 23, 42, 0.95);
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.18);
    }

    .form-input::placeholder, .form-textarea::placeholder {
      color: #475569;
    }

    .form-helper {
      font-size: 11px;
      color: #64748b;
      margin-top: 6px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .form-helper.warning {
      color: #f59e0b;
    }

    /* Champ piège anti-spam */
    .honeypot-field {
      display: none !important;
      visibility: hidden !important;
    }

    .btn-submit {
      width: 100%;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      border: none;
      border-radius: var(--radius-md);
      padding: 14px 20px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 4px 16px rgba(16, 185, 129, 0.35);
      transition: all 0.2s ease;
      margin-top: 24px;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 22px rgba(16, 185, 129, 0.45);
      background: linear-gradient(135deg, #34d399 0%, #059669 100%);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* État de confirmation / succès */
    .success-box {
      display: none;
      padding: 24px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.35);
      border-radius: var(--radius-md);
      text-align: center;
    }

    .success-icon {
      width: 56px;
      height: 56px;
      background: #10b981;
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px auto;
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    }

    .success-title {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
    }

    .success-text {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.6;
    }

    /* Avantages clés sous le hero */
    .perks-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 36px;
    }

    @media (max-width: 640px) {
      .perks-grid {
        grid-template-columns: 1fr;
      }
    }

    .perk-card {
      background: rgba(15, 23, 42, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: var(--radius-md);
      padding: 18px 20px;
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }

    .perk-icon {
      font-size: 22px;
      line-height: 1;
    }

    .perk-title {
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 4px;
    }

    .perk-desc {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.5;
    }

    /* Section Fonctionnalités */
    .section-title-wrap {
      text-align: center;
      max-width: 680px;
      margin: 80px auto 48px auto;
    }

    .section-tag {
      font-size: 12px;
      font-weight: 700;
      color: var(--color-primary);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      display: inline-block;
    }

    .section-title {
      font-size: 32px;
      font-weight: 800;
      color: #fff;
      line-height: 1.25;
      margin-bottom: 14px;
    }

    .section-desc {
      font-size: 16px;
      color: var(--text-muted);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 24px;
    }

    .feature-card {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: var(--radius-lg);
      padding: 30px 24px;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      border-color: rgba(16, 185, 129, 0.3);
      box-shadow: 0 16px 32px rgba(0, 0, 0, 0.4);
    }

    .feature-emoji {
      font-size: 36px;
      margin-bottom: 18px;
      display: inline-block;
    }

    .feature-name {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 10px;
    }

    .feature-detail {
      font-size: 13.5px;
      color: var(--text-muted);
      line-height: 1.6;
    }

    /* Section Étapes du test fermé */
    .steps-section {
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid var(--border-card);
      border-radius: var(--radius-lg);
      padding: 48px 36px;
      margin-top: 80px;
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
      margin-top: 36px;
    }

    @media (max-width: 768px) {
      .steps-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }

    .step-item {
      position: relative;
    }

    .step-number {
      width: 36px;
      height: 36px;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.4);
      border-radius: 50%;
      color: var(--color-accent);
      font-weight: 800;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14px;
    }

    .step-title {
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
    }

    .step-desc {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.6;
    }

    /* Footer */
    footer {
      border-top: 1px solid var(--border-card);
      background: rgba(9, 13, 22, 0.95);
      padding: 40px 24px;
      text-align: center;
      color: var(--text-subtle);
      font-size: 13px;
      position: relative;
      z-index: 10;
    }

    .footer-links {
      display: flex;
      justify-content: center;
      gap: 24px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .footer-links a {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 13px;
      transition: color 0.2s;
    }

    .footer-links a:hover {
      color: var(--color-primary-light);
    }

    /* Alerte message */
    .alert-banner {
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      margin-bottom: 16px;
      display: none;
    }

    .alert-error {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #fca5a5;
    }

    .alert-info {
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.35);
      color: #93c5fd;
    }
  </style>
</head>
<body>

  <!-- Navigation -->
  <header>
    <div class="nav-container">
      <a href="/" class="brand">
        <div class="brand-logo">K</div>
        <div>
          <span class="brand-title">KANTO</span>
          <span class="brand-subtitle">Lova &amp; Kolontsaina</span>
        </div>
      </a>
      <div class="nav-badge">
        <span class="nav-badge-dot"></span>
        <span>Google Play Closed Beta</span>
      </div>
    </div>
  </header>

  <!-- Contenu Principal -->
  <main>
    <div class="hero-grid">
      <!-- Colonne Présentation -->
      <div class="hero-content">
        <div class="pill-tag">
          <span>🚀 Programme Bêta Fermé • Smartphone Android</span>
        </div>
        <h1 class="hero-title">
          Explorez Madagascar avant tout le monde. Devenez <span class="highlight">Bêta-Testeur Kanto</span>.
        </h1>
        <p class="hero-desc">
          Rejoignez le cercle fermé des testeurs Android sur Google Play. Découvrez en avant-première nos contes traditionnels audio, défiez vos amis dans les Duels Fihavanana et participez activement à la renaissance numérique de la culture et de la langue malgache.
        </p>

        <!-- 3 Avantages clés -->
        <div class="perks-grid">
          <div class="perk-card">
            <span class="perk-icon">⚡</span>
            <div>
              <div class="perk-title">Accès Exclusif</div>
              <div class="perk-desc">Installez les nouvelles versions Android avant leur sortie officielle sur le Play Store.</div>
            </div>
          </div>
          <div class="perk-card">
            <span class="perk-icon">💬</span>
            <div>
              <div class="perk-title">Voix d'Influence</div>
              <div class="perk-desc">Échangez directement avec l'équipe pour proposer de nouveaux proverbes et fonctionnalités.</div>
            </div>
          </div>
          <div class="perk-card">
            <span class="perk-icon">🎖️</span>
            <div>
              <div class="perk-title">Badge Pionnier</div>
              <div class="perk-desc">Obtenez à vie le badge exclusif <em>Mpilalao Voalohany</em> dès l'ouverture de votre compte.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Colonne Formulaire -->
      <div>
        <div class="form-card" id="form-container">
          <div class="form-header">
            <h2>Rejoindre la phase de test</h2>
            <p>Remplissez ce formulaire pour recevoir votre lien Google Play privé.</p>
          </div>

          <div id="alert-box" class="alert-banner"></div>

          <form id="beta-form" onsubmit="handleBetaSubmit(event)">
            <!-- Champ Piège Anti-Spam Honeypot -->
            <div class="honeypot-field">
              <label for="website">Ne pas remplir</label>
              <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
            </div>

            <!-- Nom complet -->
            <div class="form-group">
              <label class="form-label" for="fullName">
                <span>Votre nom ou pseudo</span>
                <span class="optional">Facultatif</span>
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
                <span>Adresse Gmail / Compte Google</span>
                <span class="required">Requis *</span>
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                class="form-input" 
                placeholder="votre.adresse@gmail.com" 
                required 
                autocomplete="email"
              >
              <div class="form-helper warning">
                <span>⚠️ Important : Utilisez l'adresse connectée au Google Play Store sur votre téléphone.</span>
              </div>
            </div>

            <!-- Modèle de smartphone -->
            <div class="form-group">
              <label class="form-label" for="deviceModel">
                <span>Modèle de votre smartphone Android</span>
                <span class="optional">Recommandé</span>
              </label>
              <input 
                type="text" 
                id="deviceModel" 
                name="deviceModel" 
                class="form-input" 
                placeholder="ex: Samsung Galaxy S22, Xiaomi Redmi, Pixel 7..." 
                maxlength="100"
              >
            </div>

            <!-- Version Android -->
            <div class="form-group">
              <label class="form-label" for="androidVersion">
                <span>Version Android</span>
                <span class="optional">Facultatif</span>
              </label>
              <input 
                type="text" 
                id="androidVersion" 
                name="androidVersion" 
                class="form-input" 
                placeholder="ex: Android 13, 14 ou 15" 
                maxlength="50"
              >
            </div>

            <!-- Remarques / Motivations -->
            <div class="form-group">
              <label class="form-label" for="notes">
                <span>Un mot pour l'équipe ?</span>
                <span class="optional">Facultatif</span>
              </label>
              <textarea 
                id="notes" 
                name="notes" 
                class="form-textarea" 
                rows="2" 
                placeholder="Passionné(e) de contes, amateur de quiz, curieux..."
                maxlength="500"
              ></textarea>
            </div>

            <button type="submit" class="btn-submit" id="btn-submit">
              <span>Envoyer ma candidature</span>
              <span>🚀</span>
            </button>
          </form>

          <!-- État de confirmation -->
          <div class="success-box" id="success-box">
            <div class="success-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 class="success-title">Misaotra betsaka ! 🎉</h3>
            <p class="success-text" id="success-message">
              Votre candidature a bien été enregistrée. Un email de confirmation vient d'être envoyé à votre adresse. Dès validation sur la Google Play Console, vous recevrez votre lien d'accès privé !
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Ce que vous allez tester dans Kanto -->
    <div class="section-title-wrap">
      <span class="section-tag">Au cœur de Kanto</span>
      <h2 class="section-title">Ce que vous allez explorer et tester</h2>
      <p class="section-desc">Une application conçue pour célébrer, apprendre et transmettre le patrimoine malgache avec modernité.</p>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <span class="feature-emoji">📖</span>
        <h3 class="feature-name">Contes &amp; Angano Audio</h3>
        <p class="feature-detail">Écoutez et lisez des récits ancestraux avec une narration vocale naturelle en malgache et en français, enrichie de notes culturelles.</p>
      </div>
      <div class="feature-card">
        <span class="feature-emoji">⚔️</span>
        <h3 class="feature-name">Duel Fihavanana en Direct</h3>
        <p class="feature-detail">Défiez vos amis ou des joueurs en ligne sur des quiz en temps réel. Partagez des réactions chaleureuses et hissez-vous au sommet du classement.</p>
      </div>
      <div class="feature-card">
        <span class="feature-emoji">🧩</span>
        <h3 class="feature-name">Jeux Linguistiques &amp; Proverbes</h3>
        <p class="feature-detail">Ohabolana, mots croisés, vrai ou faux, puzzles de mots : entraînez votre esprit tout en apprenant les subtilités du vocabulaire malgache.</p>
      </div>
      <div class="feature-card">
        <span class="feature-emoji">🇲🇬</span>
        <h3 class="feature-name">Patrimoine &amp; Vintana</h3>
        <p class="feature-detail">Découvrez les emblèmes des 6 provinces, l'astrologie traditionnelle Vintana, les fady et l'histoire des grandes figures de l'île.</p>
      </div>
    </div>

    <!-- Étapes du test Google Play -->
    <div class="steps-section">
      <div style="text-align: center; max-width: 600px; margin: 0 auto;">
        <span class="section-tag">Comment ça marche ?</span>
        <h2 style="font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 8px;">Le parcours du bêta-testeur fermé</h2>
        <p style="font-size: 14px; color: var(--text-muted);">3 étapes simples pour installer Kanto en toute sécurité sur votre smartphone.</p>
      </div>

      <div class="steps-grid">
        <div class="step-item">
          <div class="step-number">1</div>
          <h4 class="step-title">Inscription avec votre Gmail</h4>
          <p class="step-desc">Vous nous transmettez l'adresse Gmail utilisée sur votre application Google Play Store via le formulaire ci-dessus.</p>
        </div>
        <div class="step-item">
          <div class="step-number">2</div>
          <h4 class="step-title">Activation sur Google Console</h4>
          <p class="step-desc">Notre équipe ajoute votre compte à la liste blanche fermée des testeurs officiels sur la Google Play Console.</p>
        </div>
        <div class="step-item">
          <div class="step-number">3</div>
          <h4 class="step-title">Lien Privé &amp; Installation</h4>
          <p class="step-desc">Vous recevez un email officiel contenant le lien Google Play privé pour accepter le test et installer Kanto en 1 clic.</p>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer>
    <div class="footer-links">
      <a href="https://kanto.mg" target="_blank">Site officiel</a>
      <a href="/cgu">Conditions Générales (CGU)</a>
      <a href="/confidentialite">Politique de Confidentialité</a>
      <a href="mailto:contact@kanto.mg">Nous contacter</a>
    </div>
    <p>© ${currentYear} KANTO • Lova, Kolontsaina &amp; Tantara Malagasy. Tous droits réservés.</p>
  </footer>

  <!-- Script d'envoi AJAX -->
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
      const deviceModel = document.getElementById('deviceModel').value.trim();
      const androidVersion = document.getElementById('androidVersion').value.trim();
      const notes = document.getElementById('notes').value.trim();
      const website = document.getElementById('website').value.trim();

      if (!email || !email.includes('@')) {
        showAlert('Veuillez saisir une adresse email valide.', 'alert-error');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<span>Enregistrement en cours...</span> <span>⏳</span>';

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
            deviceModel,
            androidVersion,
            notes,
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
          if (data.alreadyRegistered) {
            successBox.style.background = 'rgba(59, 130, 246, 0.1)';
            successBox.style.borderColor = 'rgba(59, 130, 246, 0.35)';
          }
        } else {
          const errMsg =
            data.message ||
            "Une erreur est survenue lors de l'enregistrement. Veuillez vérifier les champs.";
          showAlert(Array.isArray(errMsg) ? errMsg.join(' ; ') : errMsg, 'alert-error');
          btn.disabled = false;
          btn.innerHTML = '<span>Envoyer ma candidature</span> <span>🚀</span>';
        }
      } catch (err) {
        showAlert('Impossible de contacter le serveur. Veuillez vérifier votre connexion Internet.', 'alert-error');
        btn.disabled = false;
        btn.innerHTML = '<span>Envoyer ma candidature</span> <span>🚀</span>';
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
