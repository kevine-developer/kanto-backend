/**
 * Kanto MG — Portail officiel et vitrine des testeurs
 * Structure simplifiée et épurée en 3 piliers essentiels :
 * 1. Inscription comme testeur (immédiate, sans friction)
 * 2. Confirmation du statut de testeur (Google Play / TestFlight)
 * 3. Téléchargement ou mise à jour de l'application
 *
 * Suppression complète de la vérification manuelle et du formulaire redondant.
 */

export interface BetaLandingContentOptions {
  legalBaseUrl: string;
  supportEmail: string;
  countBadgeText: string;
  initialTab: string;
  isRegistered: boolean;
  emailVal: string;
  errorVal: string;
  tokenVal: string;
  currentYear: number;
}

export function renderBetaLandingBody(opt: BetaLandingContentOptions): string {
  const {
    legalBaseUrl,
    supportEmail,
    countBadgeText,
    isRegistered,
    emailVal,
    errorVal,
    currentYear,
  } = opt;

  return `
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- EN-TÊTE MINIMALISTE ET RECONNAISSABLE                                  -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <header class="site-header">
    <a href="/" class="brand" aria-label="Kanto MG - Accueil">
      <div class="brand-logo-wrap">
        <img
          src="/logo.png"
          alt="Logo officiel Kanto MG"
          class="brand-logo"
          width="34"
          height="34"
          onerror="this.onerror=null; this.src='/favicon.png';"
        />
      </div>
      <div class="brand-text-wrap">
        <span class="brand-name">kanto<span class="brand-domain">.mg</span></span>
        <span class="brand-tag">Lova sy Kolontsaina</span>
      </div>
    </a>

    <!-- Navigation concise vers les 3 piliers -->
    <nav class="header-nav" aria-label="Navigation principale">
      <a href="#inscription" class="header-nav-link">Inscription</a>
      <a href="#confirmation" class="header-nav-link">Confirmation</a>
      <a href="#telechargement" class="header-nav-link">Téléchargement</a>
    </nav>

    <div class="header-actions">
      <!-- Basculeur thème sombre / clair -->
      <button type="button" class="theme-toggle-btn" id="theme-toggle" aria-label="Basculer le thème d'affichage">
        <svg id="theme-icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        <svg id="theme-icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      </button>

      <!-- CTA Inscription -->
      <a href="#inscription" class="header-cta-btn" id="header-btn-register">
        <span>Rejoindre</span>
      </a>
    </div>
  </header>

  <main>
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- PILIER A — INSCRIPTION COMME TESTEUR                                   -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="section-hero-register" id="inscription" aria-labelledby="hero-title">
      <div class="hero-container">
        
        <div class="hero-intro">
          <div class="hero-eyebrow">
            <span class="eyebrow-pill">Programme Bêta Officiel</span>
            <span class="eyebrow-counter" id="header-tester-count">${countBadgeText}</span>
          </div>

          <h1 id="hero-title" class="hero-title">
            Kanto — La culture malgache, autrement.
          </h1>

          <p class="hero-subtitle">
            Rejoignez les testeurs en avant-première et participez activement à la renaissance numérique des contes (Angano), proverbes (Ohabolana) et de la langue de Madagascar.
          </p>
        </div>

        <!-- Bannières d'alerte ou de confirmation -->
        <div id="error-banner" class="banner banner-error" style="${errorVal ? 'display:flex;' : 'display:none;'}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span id="error-text">${errorVal}</span>
        </div>

        <div id="success-banner" class="banner banner-success" style="display: none;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <span id="success-text"></span>
        </div>

        <!-- Encart dynamique post-inscription ou utilisateur déjà inscrit -->
        <div id="registration-feedback-card" class="registration-feedback-card" style="${isRegistered ? 'display:block;' : 'display:none;'}">
          <div class="feedback-card-inner">
            <div class="feedback-status-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span id="feedback-badge-label">Inscription active</span>
            </div>
            <h2 class="feedback-card-title" id="feedback-card-title">Bienvenue parmi les testeurs de Kanto MG</h2>
            <p class="feedback-card-desc" id="feedback-card-desc">
              Votre adresse <strong id="feedback-email-display">${emailVal || ''}</strong> est associée au programme. Deux étapes simples vous permettent d'accéder à l'application :
            </p>
            <div class="feedback-actions-quick">
              <a href="#confirmation" class="btn-step-jump primary">
                <span>1. Confirmer mon statut testeur ↓</span>
              </a>
              <a href="#telechargement" class="btn-step-jump secondary">
                <span>2. Télécharger l'application ↓</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Formulaire d'inscription épuré (champs indispensables uniquement) -->
        <div class="register-form-card" id="register-card">
          <form id="waitlist-form" class="clean-form">
            <!-- Piège anti-spam invisible -->
            <div class="hp-trap" aria-hidden="true" style="display:none;">
              <input type="text" id="hp-website" name="website" tabindex="-1" autocomplete="off">
            </div>

            <div class="form-grid">
              <!-- Champ E-mail indispensable -->
              <div class="field-group">
                <label for="reg-email" class="field-label">
                  <span>Votre adresse e-mail</span>
                  <span class="label-required">Indispensable</span>
                </label>
                <div class="field-input-wrap">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <input
                    type="email"
                    id="reg-email"
                    name="email"
                    class="clean-input"
                    placeholder="nom@exemple.com"
                    required
                    value="${emailVal}"
                    autocomplete="email"
                  >
                </div>
                <span class="field-caption">Utilisez l'adresse de votre compte Google Play ou de votre compte Apple.</span>
              </div>

              <!-- Sélection tactile de plateforme avec détection automatique -->
              <div class="field-group">
                <span class="field-label">Votre plateforme de test</span>
                <div class="platform-selector-row">
                  <button type="button" class="platform-btn checked" id="card-android" data-platform="ANDROID" aria-pressed="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.411 13.8533 8.125 12 8.125s-3.5902.286-5.1368.8257L4.8409 5.4477a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 10.9997.426 14.5408.426 18.6667h23.148c0-4.1259-2.2629-7.667-5.6925-9.3453"/></svg>
                    <span class="platform-btn-label">Android</span>
                    <span class="platform-btn-sub">Google Play</span>
                  </button>

                  <button type="button" class="platform-btn" id="card-ios" data-platform="IOS" aria-pressed="false">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.92.04-2.02.62-2.67 1.37-.56.64-1.05 1.71-.92 2.74 1.03.08 2.06-.49 2.67-1.24z"/></svg>
                    <span class="platform-btn-label">iOS</span>
                    <span class="platform-btn-sub">TestFlight</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Consentement confidentiel & CGU -->
            <div class="consent-row">
              <label class="consent-label">
                <input type="checkbox" id="consent-cgu" required checked>
                <span>J'accepte les <button type="button" class="link-inline" id="btn-open-cgu-modal">CGU</button> et la <button type="button" class="link-inline" id="btn-open-privacy-modal">Politique de confidentialité</button> (identifiants chiffrés, zéro démarchage).</span>
              </label>
            </div>

            <!-- Bouton d'action principal bien identifiable -->
            <div class="submit-wrap">
              <button type="submit" class="btn-primary-action" id="btn-submit-reg">
                <span>Rejoindre les testeurs</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </button>
            </div>

            <!-- Raccourci doux pour les personnes déjà inscrites -->
            <div class="already-registered-hint">
              <span>Déjà inscrit(e) ?</span>
              <a href="#confirmation" class="link-hint">Confirmer votre statut</a>
              <span>ou</span>
              <a href="#telechargement" class="link-hint">Télécharger l'application</a>
            </div>
          </form>
        </div>

      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- PILIER B — CONFIRMATION DU STATUT DE TESTEUR                            -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="section-step" id="confirmation" aria-labelledby="step-confirm-title">
      <div class="step-container">
        
        <div class="step-header">
          <div class="step-number-badge">Étape 1</div>
          <h2 id="step-confirm-title" class="step-title">Confirmez votre statut de testeur</h2>
          <p class="step-subtitle">
            Cette confirmation officielle autorise votre compte sur le store. Elle est <strong>distincte du téléchargement</strong> et s'effectue en un clic.
          </p>
        </div>

        <div class="cards-duo-grid">
          
          <!-- Carte Confirmation Google Play -->
          <div class="action-card card-android" id="card-confirm-android">
            <div class="action-card-head">
              <div class="platform-emblem android">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.411 13.8533 8.125 12 8.125s-3.5902.286-5.1368.8257L4.8409 5.4477a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 10.9997.426 14.5408.426 18.6667h23.148c0-4.1259-2.2629-7.667-5.6925-9.3453"/></svg>
              </div>
              <div class="platform-meta">
                <span class="platform-tag">Google Play • Android</span>
                <h3 class="platform-heading">Programme Closed Testing</h3>
              </div>
              <span class="badge-recommended" id="rec-badge-android" style="display:none;">Votre appareil</span>
            </div>

            <p class="action-card-text">
              Rejoignez le groupe de test officiel sur Google Play en vous connectant avec l'e-mail utilisé lors de votre inscription.
            </p>

            <div class="action-buttons-wrap">
              <!-- Lien externe de confirmation Google Play -->
              <a
                href="https://play.google.com/apps/testing/com.devengalere.kantomg"
                class="btn-action-primary android"
                id="confirm-link-google-play"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Confirmer mon statut sur Google Play</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>

              <!-- Bouton de notification interne de participation confirmée -->
              <button type="button" class="btn-action-check" id="btn-confirm-android-joined">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>J'ai confirmé sur Google Play</span>
              </button>
            </div>
          </div>

          <!-- Carte Confirmation Apple TestFlight -->
          <div class="action-card card-ios" id="card-confirm-ios">
            <div class="action-card-head">
              <div class="platform-emblem ios">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.92.04-2.02.62-2.67 1.37-.56.64-1.05 1.71-.92 2.74 1.03.08 2.06-.49 2.67-1.24z"/></svg>
              </div>
              <div class="platform-meta">
                <span class="platform-tag">Apple iOS • iPhone &amp; iPad</span>
                <h3 class="platform-heading">Invitation Apple TestFlight</h3>
              </div>
              <span class="badge-recommended" id="rec-badge-ios" style="display:none;">Votre appareil</span>
            </div>

            <p class="action-card-text">
              Ouvrez le lien officiel sur votre iPhone ou iPad pour accepter l'invitation TestFlight et activer votre accès anticipé.
            </p>

            <div class="action-buttons-wrap">
              <!-- Lien externe de confirmation TestFlight -->
              <a
                href="https://testflight.apple.com/join/kantomg"
                class="btn-action-primary ios"
                id="confirm-link-testflight"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Rejoindre la bêta sur TestFlight</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>

              <!-- Bouton de notification interne de participation confirmée -->
              <button type="button" class="btn-action-check" id="btn-confirm-ios-joined">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>J'ai rejoint sur TestFlight</span>
              </button>
            </div>
          </div>

        </div>

        <div class="step-transition">
          <span class="transition-pill">Une fois le statut validé ↓</span>
        </div>

      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- PILIER C — TÉLÉCHARGER OU METTRE À JOUR L'APPLICATION                  -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="section-step section-download-step" id="telechargement" aria-labelledby="step-download-title">
      <div class="step-container">
        
        <div class="step-header">
          <div class="step-number-badge accent">Étape 2</div>
          <h2 id="step-download-title" class="step-title">Télécharger ou mettre à jour Kanto</h2>
          <p class="step-subtitle">
            Accédez directement à l'application sur le store de votre appareil pour installer Kanto ou appliquer la dernière version.
          </p>
        </div>

        <div class="cards-duo-grid">
          
          <!-- Carte Téléchargement Android -->
          <div class="action-card card-store card-store-android" id="card-download-android">
            <div class="action-card-head">
              <div class="platform-emblem store-play">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.793 12 3.61 22.186c-.244-.265-.395-.623-.395-1.026V2.84c0-.403.151-.76.395-1.026zm11.246 11.248l2.096-2.096-10.82-6.2c-.172-.099-.36-.152-.553-.16l9.277 8.456zm0 1.876L5.578 23.394c.193-.008.381-.061.553-.16l10.82-6.2-2.096-2.096zm1.06-1.06l3.664-2.098c.704-.403.704-1.059 0-1.462l-3.664-2.098-2.25 2.25 2.25 2.25z"/></svg>
              </div>
              <div class="platform-meta">
                <span class="platform-tag" id="dl-android-badge">Google Play Store</span>
                <h3 class="platform-heading">Kanto MG pour Android</h3>
              </div>
            </div>

            <p class="action-card-text">
              Compatible smartphones et tablettes Android (Android 9.0 Pie et ultérieur). Fonctionnement 100% hors-ligne.
            </p>

            <div class="action-buttons-wrap">
              <!-- Lien Store direct -->
              <a
                href="https://play.google.com/store/apps/details?id=com.devengalere.kantomg"
                class="btn-store-primary android"
                id="dl-btn-android-main"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.793 12 3.61 22.186c-.244-.265-.395-.623-.395-1.026V2.84c0-.403.151-.76.395-1.026zm11.246 11.248l2.096-2.096-10.82-6.2c-.172-.099-.36-.152-.553-.16l9.277 8.456zm0 1.876L5.578 23.394c.193-.008.381-.061.553-.16l10.82-6.2-2.096-2.096zm1.06-1.06l3.664-2.098c.704-.403.704-1.059 0-1.462l-3.664-2.098-2.25 2.25 2.25 2.25z"/></svg>
                <div class="btn-store-labels">
                  <span class="sub-label">OUVRIR SUR</span>
                  <span class="main-label">Google Play</span>
                </div>
              </a>

              <!-- Confirmation d'installation -->
              <button type="button" class="btn-action-check" id="btn-installed-android">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>J'ai installé l'application</span>
              </button>
            </div>
          </div>

          <!-- Carte Téléchargement iOS -->
          <div class="action-card card-store card-store-ios" id="card-download-ios">
            <div class="action-card-head">
              <div class="platform-emblem store-apple">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.92.04-2.02.62-2.67 1.37-.56.64-1.05 1.71-.92 2.74 1.03.08 2.06-.49 2.67-1.24z"/></svg>
              </div>
              <div class="platform-meta">
                <span class="platform-tag" id="dl-ios-badge">Apple TestFlight</span>
                <h3 class="platform-heading">Kanto MG pour iOS</h3>
              </div>
            </div>

            <p class="action-card-text">
              Compatible iPhone et iPad (iOS 15.0 et ultérieur). Mises à jour automatiques via l'application Apple TestFlight.
            </p>

            <div class="action-buttons-wrap">
              <!-- Lien Store direct -->
              <a
                href="https://testflight.apple.com/join/kantomg"
                class="btn-store-primary ios"
                id="dl-btn-ios-main"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.92.04-2.02.62-2.67 1.37-.56.64-1.05 1.71-.92 2.74 1.03.08 2.06-.49 2.67-1.24z"/></svg>
                <div class="btn-store-labels">
                  <span class="sub-label">OUVRIR DANS</span>
                  <span class="main-label">TestFlight</span>
                </div>
              </a>

              <!-- Confirmation d'installation -->
              <button type="button" class="btn-action-check" id="btn-installed-ios">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>J'ai installé l'application</span>
              </button>
            </div>
          </div>

        </div>

        <!-- QR Code interactif sur grand écran (ordinateur) -->
        <div class="desktop-qr-card" aria-hidden="true">
          <div class="qr-visual">
            <svg class="qr-svg-native" viewBox="0 0 120 120" width="88" height="88" fill="currentColor">
              <rect x="10" y="10" width="30" height="30" fill="none" stroke="currentColor" stroke-width="6"/>
              <rect x="20" y="20" width="10" height="10" fill="currentColor"/>
              <rect x="80" y="10" width="30" height="30" fill="none" stroke="currentColor" stroke-width="6"/>
              <rect x="90" y="20" width="10" height="10" fill="currentColor"/>
              <rect x="10" y="80" width="30" height="30" fill="none" stroke="currentColor" stroke-width="6"/>
              <rect x="20" y="90" width="10" height="10" fill="currentColor"/>
              <rect x="50" y="15" width="8" height="8" fill="currentColor"/>
              <rect x="62" y="15" width="8" height="8" fill="currentColor"/>
              <rect x="50" y="30" width="8" height="8" fill="currentColor"/>
              <rect x="50" y="50" width="8" height="8" fill="currentColor"/>
              <rect x="62" y="50" width="8" height="8" fill="currentColor"/>
              <rect x="74" y="50" width="8" height="8" fill="currentColor"/>
              <rect x="86" y="50" width="8" height="8" fill="currentColor"/>
              <rect x="15" y="55" width="8" height="8" fill="currentColor"/>
              <rect x="30" y="55" width="8" height="8" fill="currentColor"/>
              <rect x="50" y="70" width="8" height="8" fill="currentColor"/>
              <rect x="70" y="70" width="8" height="8" fill="currentColor"/>
              <rect x="85" y="70" width="8" height="8" fill="currentColor"/>
              <rect x="50" y="85" width="8" height="8" fill="currentColor"/>
              <rect x="70" y="85" width="8" height="8" fill="currentColor"/>
              <rect x="95" y="85" width="8" height="8" fill="currentColor"/>
              <rect x="60" y="100" width="8" height="8" fill="currentColor"/>
              <rect x="80" y="100" width="8" height="8" fill="currentColor"/>
              <rect x="100" y="100" width="8" height="8" fill="currentColor"/>
            </svg>
          </div>
          <div class="qr-info">
            <span class="qr-heading">Vous êtes sur ordinateur ?</span>
            <span class="qr-text">Scannez ce code avec votre smartphone pour ouvrir le portail directement sur votre mobile.</span>
          </div>
        </div>

      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- SECTION QUESTIONS FRÉQUENTES CONCISES                                  -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="section-faq" id="faq" aria-labelledby="faq-title">
      <div class="faq-container">
        <h2 id="faq-title" class="faq-title">Questions fréquentes</h2>

        <div class="faq-list">
          <details class="faq-card" open>
            <summary class="faq-summary">
              <span>Pourquoi le statut de testeur doit-il être confirmé avant le téléchargement ?</span>
              <svg class="faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <div class="faq-body">
              <p>Google Play et Apple TestFlight protègent les versions en avant-première : votre compte doit d'abord accepter l'invitation sur le store pour débloquer le téléchargement privé sur votre appareil.</p>
            </div>
          </details>

          <details class="faq-card">
            <summary class="faq-summary">
              <span>Le programme de test est-il gratuit ?</span>
              <svg class="faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <div class="faq-body">
              <p>Oui, l'accès est 100% gratuit et bénévole. Vous accédez à l'ensemble du patrimoine culturel malgache (contes, proverbes, kabary, leçons) sans aucune publicité.</p>
            </div>
          </details>

          <details class="faq-card">
            <summary class="faq-summary">
              <span>Comment mes données personnelles sont-elles protégées ?</span>
              <svg class="faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <div class="faq-body">
              <p>Vos identifiants sont chiffrés selon le standard AES-256-GCM. Aucune donnée n'est cédée ni exploitée à des fins publicitaires. Vous pouvez vous désinscrire à tout instant en un clic.</p>
            </div>
          </details>
        </div>
      </div>
    </section>
  </main>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- PIED DE PAGE SOBRE & LÉGAL                                              -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-brand-col">
          <div class="footer-brand-wrap">
            <img src="/logo.png" alt="Kanto MG" width="28" height="28" onerror="this.onerror=null; this.src='/favicon.png';" />
            <span class="footer-brand-name">kanto.mg</span>
          </div>
          <p class="footer-brand-desc">
            Sanctuaire numérique contemporain dédié à la valorisation, à la transmission et au rayonnement de la culture malgache.
          </p>
        </div>

        <div class="footer-links-col">
          <span class="footer-heading">Parcours testeur</span>
          <a href="#inscription">1. Inscription</a>
          <a href="#confirmation">2. Confirmation du statut</a>
          <a href="#telechargement">3. Téléchargement</a>
          <a href="/feedback">Signaler une anomalie</a>
        </div>

        <div class="footer-links-col">
          <span class="footer-heading">Transparence</span>
          <a href="${legalBaseUrl}/pages/privacy" id="footer-link-privacy">Confidentialité &amp; RGPD</a>
          <a href="${legalBaseUrl}/pages/terms" id="footer-link-cgu">Conditions Générales (CGU)</a>
          <button type="button" class="btn-text-link" id="btn-cookie-settings">Cookies &amp; Préférences</button>
          <a href="mailto:${supportEmail}">Support : ${supportEmail}</a>
        </div>
      </div>

      <div class="footer-bottom-line">
        <span>© ${currentYear} Kanto MG • Lova sy Kolontsaina Malagasy. Tous droits réservés.</span>
        <span>Version Bêta Officielle • app-kanto.gastsar.fr</span>
      </div>
    </div>
  </footer>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- BANNIÈRE & MODALES LÉGALES RGPD                                         -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <aside id="kanto-cookie-banner" class="cookie-banner" role="region" aria-label="Gestion des cookies" style="display: none;">
    <div class="cookie-banner-wrap">
      <div class="cookie-banner-text">
        <span class="cookie-banner-title">Respect de votre vie privée</span>
        <p class="cookie-banner-desc">Traceurs strictement nécessaires et mémorisation du thème d'affichage. Aucun profilage publicitaire.</p>
      </div>
      <div class="cookie-banner-actions">
        <button type="button" id="cookie-btn-accept-all" class="btn-cookie primary">Accepter</button>
        <button type="button" id="cookie-btn-reject-all" class="btn-cookie secondary">Continuer sans accepter</button>
        <button type="button" id="cookie-btn-customize" class="btn-cookie outline">Personnaliser</button>
      </div>
    </div>
  </aside>

  <div id="kanto-cookie-modal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title" style="display: none;">
    <div class="modal-dialog">
      <div class="modal-head">
        <h3 id="cookie-modal-title">Préférences de confidentialité</h3>
        <button type="button" class="btn-modal-close" id="cookie-modal-close" aria-label="Fermer">✕</button>
      </div>
      <div class="modal-body">
        <p>Ce portail utilise uniquement des témoins techniques indispensables pour mémoriser votre préférence d'affichage (thème sombre/clair).</p>
        <div class="cookie-pref-row">
          <span>1. Fonctionnement technique</span>
          <span class="badge-status">Toujours actif</span>
        </div>
        <div class="cookie-pref-row">
          <span>2. Thème d'affichage</span>
          <input type="checkbox" id="cookie-opt-preferences" checked>
        </div>
      </div>
      <div class="modal-foot">
        <button type="button" id="cookie-modal-btn-reject" class="btn-cookie secondary">Refuser</button>
        <button type="button" id="cookie-modal-btn-save" class="btn-cookie primary">Enregistrer</button>
      </div>
    </div>
  </div>

  <div class="modal-overlay" id="kanto-cgu-modal" role="dialog" aria-modal="true" aria-labelledby="modal-cgu-title" style="display:none;">
    <div class="modal-dialog">
      <div class="modal-head">
        <h3 id="modal-cgu-title">Conditions Générales d'Utilisation • Bêta-Testeur Kanto</h3>
        <button type="button" class="btn-modal-close" id="cgu-modal-close" aria-label="Fermer">✕</button>
      </div>
      <div class="modal-body">
        <p>En rejoignant le programme de test de Kanto MG, vous devenez acteur d'un sanctuaire numérique dédié au patrimoine, aux contes (<em>Angano</em>), proverbes (<em>Ohabolana</em>) et traditions de Madagascar.</p>
        <p>L'utilisation est strictement gratuite et bénévole. Vous pouvez vous désinscrire à tout moment.</p>
        <p><a href="${legalBaseUrl}/pages/terms" target="_blank" rel="noopener noreferrer">Consulter l'intégralité des CGU en pleine page ↗</a></p>
      </div>
      <div class="modal-foot">
        <button type="button" id="cgu-modal-btn-accept" class="btn-cookie primary">J'ai compris</button>
      </div>
    </div>
  </div>

  <div class="modal-overlay" id="kanto-privacy-modal" role="dialog" aria-modal="true" aria-labelledby="modal-privacy-title" style="display:none;">
    <div class="modal-dialog">
      <div class="modal-head">
        <h3 id="modal-privacy-title">Politique de Confidentialité • Bêta-Testeur Kanto</h3>
        <button type="button" class="btn-modal-close" id="privacy-modal-close" aria-label="Fermer">✕</button>
      </div>
      <div class="modal-body">
        <p>Vos identifiants sont protégés par chiffrement AES-256-GCM. Seul votre e-mail est conservé afin de synchroniser vos autorisations Google Play ou Apple TestFlight.</p>
        <p>Aucune donnée personnelle n'est cédée, vendue ou partagée avec des tiers publicitaires.</p>
        <p><a href="${legalBaseUrl}/pages/privacy" target="_blank" rel="noopener noreferrer">Consulter la politique de confidentialité complète ↗</a></p>
      </div>
      <div class="modal-foot">
        <button type="button" id="privacy-modal-btn-accept" class="btn-cookie primary">Fermer</button>
      </div>
    </div>
  </div>
  `;
}
