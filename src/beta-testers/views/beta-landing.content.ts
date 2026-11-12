/**
 * Kanto MG — Portail officiel et vitrine de conversion
 * Structure épurée en 4 grandes zones directes :
 * 1. Présentation compacte
 * 2. Programme de testeurs (priorité visuelle absolue : inscription & confirmation)
 * 3. Téléchargements mobiles (Android Google Play, iOS TestFlight & QR code)
 * 4. Informations essentielles (FAQ ciblée, contact, CGU & confidentialité)
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
    initialTab,
    isRegistered,
    emailVal,
    errorVal,
    currentYear,
  } = opt;

  return `
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- EN-TÊTE MINIMALISTE                                                    -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <header class="site-header">
    <a href="/" class="brand" aria-label="Kanto MG - Accueil">
      <div class="brand-logo-wrap">
        <img
          src="/logo.png"
          alt="Logo officiel Kanto MG"
          class="brand-logo"
          width="36"
          height="36"
          onerror="this.onerror=null; this.src='/favicon.png';"
        />
      </div>
      <div class="brand-text-wrap">
        <span class="brand-name">kanto<span class="brand-domain">.mg</span></span>
        <span class="brand-tag">Lova sy Kolontsaina</span>
      </div>
    </a>

    <!-- Navigation concise desktop -->
    <nav class="header-nav" aria-label="Navigation principale">
      <a href="#presentation" class="header-nav-link">Présentation</a>
      <a href="#testeurs" class="header-nav-link">Programme Testeur</a>
      <a href="#telecharger" class="header-nav-link">Télécharger</a>
    </nav>

    <div class="header-actions">
      <!-- Basculeur thème sombre / clair -->
      <button type="button" class="theme-toggle-btn" id="theme-toggle" aria-label="Basculer le thème d'affichage">
        <svg id="theme-icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        <svg id="theme-icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      </button>

      <!-- Bouton d'accès direct au formulaire de testeur -->
      <a href="#testeurs" class="header-cta-btn" id="header-btn-register">
        <span>Devenir testeur</span>
      </a>
    </div>
  </header>

  <main>
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- ZONE 1 — PRÉSENTATION COMPACTE & IDENTITÉ                              -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="section-presentation" id="presentation" aria-labelledby="pres-title">
      <div class="presentation-inner">
        <div class="presentation-text">
          <div class="pres-eyebrow">
            <span class="pres-pill">Portail officiel • Madagascar</span>
            <span class="pres-badge-counter" id="header-tester-count">${countBadgeText}</span>
          </div>

          <h1 id="pres-title" class="presentation-title">
            Kanto — La culture malgache, autrement.
          </h1>

          <p class="presentation-desc">
            Le sanctuaire numérique contemporain dédié à la langue malgache, aux proverbes ancestraux (Ohabolana), contes traditionnels (Angano), discours rituels (Kabary) et à l'histoire vivante de Madagascar.
          </p>

          <div class="presentation-actions">
            <a href="#testeurs" class="btn-pres-primary">
              <span>Devenir testeur</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </a>
            <a href="#telecharger" class="btn-pres-secondary">
              <span>Télécharger l'application</span>
            </a>
          </div>
        </div>

        <div class="presentation-visual" aria-hidden="true">
          <div class="visual-artwork-card">
            <div class="artwork-halo"></div>
            <div class="artwork-emblem">
              <img src="/logo.png" alt="Emblème Kanto MG" width="120" height="120" class="artwork-logo" onerror="this.onerror=null; this.src='/favicon.png';" />
              <span class="artwork-label">Lova • Kolontsaina • Tantara</span>
            </div>
            <div class="artwork-tagline">
              <span>Android &amp; iOS</span>
              <span>100% Hors-ligne</span>
              <span>Zéro Publicité</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- ZONE 2 — PROGRAMME DE TESTEURS (PRIORITÉ VISUELLE MAJEURE)              -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="section-testers" id="testeurs" aria-labelledby="testers-main-title">
      <div class="testers-card">
        <div class="testers-header">
          <span class="testers-eyebrow">Accès Anticipé &amp; Co-création</span>
          <h2 id="testers-main-title" class="testers-title">Devenez testeur de Kanto MG</h2>
          <p class="testers-desc">
            Découvrez Kanto en avant-première, explorez ses fonctionnalités et participez à son amélioration en partageant vos retours.
          </p>
        </div>

        <!-- Bascule principale : Inscription vs Déjà inscrit / Confirmation -->
        <div class="testers-tabs-nav" role="tablist">
          <button type="button" class="tester-tab-btn ${initialTab !== 'already_registered' && !isRegistered ? 'active' : ''}" id="tab-btn-register" role="tab" aria-selected="${initialTab !== 'already_registered' && !isRegistered}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
            <span>Devenir testeur</span>
          </button>
          <button type="button" class="tester-tab-btn ${initialTab === 'already_registered' || isRegistered ? 'active' : ''}" id="tab-btn-already" role="tab" aria-selected="${initialTab === 'already_registered' || isRegistered}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>Confirmer mon inscription</span>
          </button>
        </div>

        <!-- Bannières d'alerte et de confirmation -->
        <div id="error-banner" class="banner error" style="${errorVal ? 'display:flex;' : 'display:none;'}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span id="error-text">${errorVal}</span>
        </div>
        <div id="success-banner" class="banner success" style="display: none;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <span id="success-text"></span>
        </div>

        <!-- ─── VOLET 1 : FORMULAIRE D'INSCRIPTION ───────────────────────────── -->
        <div id="panel-register" class="tester-panel" style="display: ${initialTab !== 'already_registered' && !isRegistered ? 'block' : 'none'};">
          <form id="waitlist-form" class="testers-form">
            <!-- Piège anti-spam invisible -->
            <div class="hp-trap" aria-hidden="true" style="display:none;">
              <input type="text" id="hp-website" name="website" tabindex="-1" autocomplete="off">
            </div>

            <div class="form-row">
              <div class="field-wrap">
                <label class="field-label" for="reg-email">
                  <span>Votre adresse e-mail</span>
                  <span class="label-badge-req">Requis</span>
                </label>
                <input 
                  type="email" 
                  id="reg-email" 
                  class="field-input" 
                  placeholder="nom@exemple.com" 
                  required 
                  value="${emailVal}"
                  autocomplete="email"
                >
                <span class="field-help">Votre adresse permettra d'autoriser votre compte sur Google Play ou Apple TestFlight.</span>
              </div>

              <div class="field-wrap">
                <label class="field-label" for="reg-name">
                  <span>Prénom ou nom public</span>
                  <span class="label-badge-opt">Optionnel</span>
                </label>
                <input 
                  type="text" 
                  id="reg-name" 
                  class="field-input" 
                  placeholder="ex: Faly, Rova, Eric..."
                  autocomplete="name"
                >
              </div>
            </div>

            <!-- Choix tactile des plateformes -->
            <div class="field-wrap">
              <label class="field-label">
                <span>Sur quel appareil souhaitez-vous tester ?</span>
              </label>
              <div class="platform-selection-grid">
                <div class="platform-toggle-card checked" id="card-android">
                  <div class="platform-toggle-head">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.411 13.8533 8.125 12 8.125s-3.5902.286-5.1368.8257L4.8409 5.4477a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 10.9997.426 14.5408.426 18.6667h23.148c0-4.1259-2.2629-7.667-5.6925-9.3453"/></svg>
                    <span class="platform-toggle-name">Android</span>
                    <span class="platform-toggle-status">Google Play</span>
                  </div>
                  <span class="platform-toggle-desc">Bêta ouverte &amp; accès console sécurisé.</span>
                </div>

                <div class="platform-toggle-card" id="card-ios">
                  <div class="platform-toggle-head">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.92.04-2.02.62-2.67 1.37-.56.64-1.05 1.71-.92 2.74 1.03.08 2.06-.49 2.67-1.24z"/></svg>
                    <span class="platform-toggle-name">iPhone / iOS</span>
                    <span class="platform-toggle-status">TestFlight</span>
                  </div>
                  <span class="platform-toggle-desc">Invitation officielle Apple TestFlight.</span>
                </div>
              </div>
            </div>

            <!-- Consentements légaux RGPD / CGU -->
            <div class="consent-box">
              <label class="consent-checkbox-label">
                <input type="checkbox" id="consent-cgu" required checked>
                <span>J'accepte les <button type="button" class="btn-legal-link" id="btn-open-cgu-modal">Conditions Générales d'Utilisation</button> de Kanto MG.</span>
              </label>
              <label class="consent-checkbox-label">
                <input type="checkbox" id="consent-privacy" required checked>
                <span>J'accepte la <button type="button" class="btn-legal-link" id="btn-open-privacy-modal">Politique de Confidentialité</button> (identifiants chiffrés, aucune cession de données).</span>
              </label>
            </div>

            <!-- Bouton d'action principal -->
            <div class="submit-action-wrap">
              <button type="submit" class="btn-submit-tester" id="btn-submit-reg">
                <span>Devenir testeur</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </button>
            </div>

            <div class="already-switch-hint">
              <span>Déjà inscrit comme testeur ?</span>
              <button type="button" class="btn-switch-link" id="link-open-already">Confirmer mon inscription →</button>
            </div>
          </form>
        </div>

        <!-- ─── VOLET 2 : CONFIRMATION DU STATUT TESTEUR ─────────────────────── -->
        <div id="panel-already" class="tester-panel" style="display: ${initialTab === 'already_registered' || isRegistered ? 'block' : 'none'};">
          <div class="status-verification-box">
            <h3 class="status-box-title">Retrouvez et confirmez votre participation</h3>
            <p class="status-box-desc">
              Saisissez l'adresse e-mail de votre inscription pour consulter votre statut en direct, valider votre accès et débloquer vos liens personnels de téléchargement.
            </p>

            <form id="check-status-form" class="status-check-form">
              <div class="status-input-wrap">
                <input 
                  type="email" 
                  id="check-email-input" 
                  class="field-input" 
                  placeholder="votre.email@domaine.com" 
                  required 
                  value="${emailVal}"
                >
                <button type="submit" class="btn-check-submit" id="btn-submit-check">
                  <span>Vérifier mon statut</span>
                </button>
              </div>
            </form>

            <!-- Résultat de vérification dynamique -->
            <div id="status-result-box" class="status-result-card" style="display: none;">
              <div class="status-card-header">
                <div>
                  <span class="status-card-label">Compte testeur identifié</span>
                  <div class="status-email-display" id="tester-email-lbl">—</div>
                </div>
                <span class="status-badge-verified" id="tester-status-badge">VÉRIFIÉ</span>
              </div>

              <!-- Bloc action de confirmation de participation -->
              <div class="status-action-banner" id="status-action-banner">
                <div class="action-banner-text">
                  <h4 id="action-box-title">Confirmer votre participation au programme</h4>
                  <p id="action-box-desc">Cliquez ci-dessous pour valider que vous avez rejoint le groupe de test.</p>
                </div>
                <div class="action-banner-btns">
                  <button type="button" class="btn-confirm-action" id="btn-confirm-joined">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Confirmer ma participation</span>
                  </button>
                  <button type="button" class="btn-confirm-action" id="btn-confirm-installed" style="display: none;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span>J'ai installé l'application</span>
                  </button>
                </div>
              </div>

              <!-- Liens personnels débloqués -->
              <div class="unlocked-links-grid">
                <div class="unlocked-card" id="card-status-android" style="display: none;">
                  <span class="unlocked-platform-name">Android (Google Play)</span>
                  <span class="badge-status-val" id="badge-status-android">Actif</span>
                  <p class="unlocked-desc" id="desc-status-android">Accès autorisé sur le Play Store de test.</p>
                  <a href="https://play.google.com/apps/testing/com.devengalere.kantomg" class="btn-unlocked-link" id="link-play-web" target="_blank" rel="noopener noreferrer">
                    <span>Ouvrir sur Google Play ↗</span>
                  </a>
                </div>

                <div class="unlocked-card" id="card-status-ios" style="display: none;">
                  <span class="unlocked-platform-name">iPhone (TestFlight)</span>
                  <span class="badge-status-val" id="badge-status-ios">Actif</span>
                  <p class="unlocked-desc" id="desc-status-ios">Invitation active via Apple TestFlight.</p>
                  <a href="https://testflight.apple.com/join/kantomg" class="btn-unlocked-link" id="link-testflight" target="_blank" rel="noopener noreferrer">
                    <span>Ouvrir dans TestFlight ↗</span>
                  </a>
                </div>
              </div>
            </div>

            <div class="return-to-reg-hint">
              <span>Nouveau sur Kanto ?</span>
              <button type="button" class="btn-switch-link" id="btn-back-to-register">Créer une inscription de testeur →</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- ZONE 3 — TÉLÉCHARGER KANTO (ACCÈS DIRECTS ANDROID & IOS)               -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="section-downloads" id="telecharger" aria-labelledby="download-title">
      <div class="downloads-container">
        <div class="downloads-header">
          <span class="downloads-eyebrow">Accès Multi-Plateforme</span>
          <h2 id="download-title" class="downloads-title">Kanto MG est disponible sur mobile.</h2>
          <p class="downloads-desc">
            Installez l'application officielle sur votre smartphone Android ou iPhone et explorez le patrimoine malgache.
          </p>
        </div>

        <div class="downloads-showcase-grid">
          <!-- Carte Google Play -->
          <div class="store-card store-android">
            <div class="store-card-head">
              <div class="store-icon-wrap android">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.411 13.8533 8.125 12 8.125s-3.5902.286-5.1368.8257L4.8409 5.4477a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 10.9997.426 14.5408.426 18.6667h23.148c0-4.1259-2.2629-7.667-5.6925-9.3453"/></svg>
              </div>
              <div>
                <span class="store-badge-avail" id="dl-android-badge">Programme Bêta Ouvert</span>
                <h3 class="store-card-name">Google Play</h3>
              </div>
            </div>

            <p class="store-card-text">
              Version certifiée pour smartphones et tablettes Android (Android 9.0 et ultérieur).
            </p>

            <div class="store-card-actions">
              <a href="https://play.google.com/apps/testing/com.devengalere.kantomg" class="btn-store-download android" id="dl-btn-android-main" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.793 12 3.61 22.186c-.244-.265-.395-.623-.395-1.026V2.84c0-.403.151-.76.395-1.026zm11.246 11.248l2.096-2.096-10.82-6.2c-.172-.099-.36-.152-.553-.16l9.277 8.456zm0 1.876L5.578 23.394c.193-.008.381-.061.553-.16l10.82-6.2-2.096-2.096zm1.06-1.06l3.664-2.098c.704-.403.704-1.059 0-1.462l-3.664-2.098-2.25 2.25 2.25 2.25z"/></svg>
                <div class="btn-store-text">
                  <span class="btn-sub">DISPONIBLE SUR</span>
                  <span class="btn-main">Google Play</span>
                </div>
              </a>
            </div>
          </div>

          <!-- Carte Apple TestFlight -->
          <div class="store-card store-ios">
            <div class="store-card-head">
              <div class="store-icon-wrap ios">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.92.04-2.02.62-2.67 1.37-.56.64-1.05 1.71-.92 2.74 1.03.08 2.06-.49 2.67-1.24z"/></svg>
              </div>
              <div>
                <span class="store-badge-avail" id="dl-ios-badge">Apple TestFlight</span>
                <h3 class="store-card-name">iOS / App Store</h3>
              </div>
            </div>

            <p class="store-card-text">
              Accès immédiat pour iPhone et iPad via l'application officielle Apple TestFlight (iOS 15.0+).
            </p>

            <div class="store-card-actions">
              <a href="https://testflight.apple.com/join/kantomg" class="btn-store-download ios" id="dl-btn-ios-main" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.92.04-2.02.62-2.67 1.37-.56.64-1.05 1.71-.92 2.74 1.03.08 2.06-.49 2.67-1.24z"/></svg>
                <div class="btn-store-text">
                  <span class="btn-sub">TÉLÉCHARGER VIA</span>
                  <span class="btn-main">Apple TestFlight</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- QR Code interactif sur ordinateur uniquement -->
        <div class="desktop-qr-container" aria-hidden="true">
          <div class="qr-card">
            <svg class="qr-svg-native" viewBox="0 0 120 120" width="100" height="100" fill="currentColor">
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
            <div class="qr-label-wrap">
              <span class="qr-title">Accès direct sur smartphone</span>
              <span class="qr-subtitle">Flashez ce code avec l'appareil photo de votre téléphone.</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- ZONE 4 — INFORMATIONS ESSENTIELLES (FAQ, CONTACT & MENTIONS)            -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="section-essentials" id="informations" aria-labelledby="essentials-title">
      <div class="essentials-container">
        <h2 id="essentials-title" class="essentials-heading">Questions fréquentes</h2>

        <div class="faq-accordion">
          <details class="faq-item" open>
            <summary class="faq-question">
              <span>Comment fonctionne le programme de testeurs de Kanto MG ?</span>
              <svg class="faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <div class="faq-answer">
              <p>L'inscription est 100% gratuite. Dès votre inscription, votre compte est associé à Google Play ou TestFlight. Vous recevez les nouvelles versions en avant-première et pouvez transmettre vos remarques et suggestions directement à l'équipe de développement.</p>
            </div>
          </details>

          <details class="faq-item">
            <summary class="faq-question">
              <span>Sur quels appareils l'application est-elle compatible ?</span>
              <svg class="faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <div class="faq-answer">
              <p>Kanto MG est développée nativement pour les smartphones Android (version 9.0 Pie et supérieure) et pour iPhone/iPad (iOS 15.0 et ultérieur). L'application fonctionne intégralement hors-ligne une fois installée.</p>
            </div>
          </details>

          <details class="faq-item">
            <summary class="faq-question">
              <span>Comment mes données personnelles sont-elles protégées ?</span>
              <svg class="faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <div class="faq-answer">
              <p>Vos identifiants et e-mails sont chiffrés selon le standard militaire AES-256-GCM. Kanto MG applique une stricte conformité RGPD : aucune donnée n'est cédée ni exploitée commercialement.</p>
            </div>
          </details>
        </div>
      </div>
    </section>
  </main>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- FOOTER INSTITUTIONNEL SOBRE                                             -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-main-row">
        <div class="footer-brand-col">
          <div class="footer-brand-head">
            <img src="/logo.png" alt="Kanto MG" width="28" height="28" onerror="this.onerror=null; this.src='/favicon.png';" />
            <span class="footer-brand-title">kanto.mg</span>
          </div>
          <p class="footer-mission-text">
            Projet indépendant dédié à la valorisation, à la transmission et au rayonnement de la langue et du patrimoine culturel malgache.
          </p>
        </div>

        <div class="footer-links-col">
          <span class="footer-col-title">Accès rapides</span>
          <a href="#presentation">Présentation</a>
          <a href="#testeurs">Programme Testeur</a>
          <a href="#telecharger">Télécharger Kanto</a>
          <a href="/feedback">Signaler un retour</a>
        </div>

        <div class="footer-links-col">
          <span class="footer-col-title">Légal &amp; Contact</span>
          <a href="${legalBaseUrl}/pages/privacy" id="footer-link-privacy">Confidentialité &amp; RGPD</a>
          <a href="${legalBaseUrl}/pages/terms" id="footer-link-cgu">Conditions d'Utilisation (CGU)</a>
          <button type="button" class="btn-cookie-link" id="btn-cookie-settings">Gestion des cookies</button>
          <a href="mailto:${supportEmail}">Support : ${supportEmail}</a>
        </div>
      </div>

      <div class="footer-bottom-bar">
        <span>© ${currentYear} Kanto MG • Lova sy Kolontsaina Malagasy. Tous droits réservés.</span>
        <span>Version Bêta Officielle • app-kanto.gastsar.fr</span>
      </div>
    </div>
  </footer>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- BANNIÈRE ET MODALES COOKIES & CONFIDENTIALITÉ RGPD                      -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <aside id="kanto-cookie-banner" class="cookie-banner" role="region" aria-label="Gestion des cookies" style="display: none;">
    <div class="cookie-banner-wrap">
      <div class="cookie-banner-text">
        <span class="cookie-banner-title">Respect de votre vie privée &amp; Cookies</span>
        <p class="cookie-banner-desc">Traceurs strictement nécessaires et mémorisation de vos préférences d'affichage. Zéro profilage publicitaire.</p>
      </div>
      <div class="cookie-banner-actions">
        <button type="button" id="cookie-btn-accept-all" class="btn-cookie-action primary">Tout accepter</button>
        <button type="button" id="cookie-btn-reject-all" class="btn-cookie-action secondary">Continuer sans accepter</button>
        <button type="button" id="cookie-btn-customize" class="btn-cookie-action outline">Personnaliser</button>
      </div>
    </div>
  </aside>

  <div id="kanto-cookie-modal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title" style="display: none;">
    <div class="modal-dialog">
      <div class="modal-head">
        <h3 id="cookie-modal-title">Préférences de confidentialité &amp; Cookies</h3>
        <button type="button" class="btn-modal-close" id="cookie-modal-close" aria-label="Fermer la gestion des cookies">✕</button>
      </div>
      <div class="modal-body">
        <p>Traceurs strictement nécessaires et mémorisation du thème (Sombre/Clair).</p>
        <div class="cookie-pref-row">
          <span>1. Nécessaires au fonctionnement</span>
          <span class="badge-status-val">Toujours actif</span>
        </div>
        <div class="cookie-pref-row">
          <span>2. Mémorisation du thème</span>
          <input type="checkbox" id="cookie-opt-preferences" checked>
        </div>
      </div>
      <div class="modal-foot">
        <button type="button" id="cookie-modal-btn-reject" class="btn-cookie-action secondary">Tout refuser</button>
        <button type="button" id="cookie-modal-btn-save" class="btn-cookie-action primary">Enregistrer mes choix</button>
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
        <p><a href="/pages/terms" target="_blank">Consulter l'intégralité des CGU en pleine page ↗</a></p>
      </div>
      <div class="modal-foot">
        <button type="button" id="cgu-modal-btn-accept" class="btn-cookie-action primary">J'ai compris</button>
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
        <p><a href="/pages/privacy" target="_blank">Consulter la politique de confidentialité complète ↗</a></p>
      </div>
      <div class="modal-foot">
        <button type="button" id="privacy-modal-btn-accept" class="btn-cookie-action primary">Fermer</button>
      </div>
    </div>
  </div>
  `;
}
