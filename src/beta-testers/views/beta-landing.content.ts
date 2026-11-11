/**
 * Kanto MG — Expérience Éditoriale Immersive du Portail Officiel
 * « Kanto — La culture malgache, autrement »
 *
 * Architecture de conversion :
 * - Navigation : Logo + Liens + Se connecter + Bouton « Créer un compte »
 * - Hero : Titre noble + Surtitre + Inscription immédiate + Badges Stores directs (Google Play / TestFlight)
 * - Section Inscription & Avantages : 6 piliers concrets de la création de compte + formulaire optimisé
 * - Section Téléchargement Stores : Android (Google Play), iOS (TestFlight), QR Code desktop
 * - Les 6 Trésors : Bento éditorial (Ohabolana, Angano, Kabary, Tononkalo, Raki-teny, Tantara)
 * - Sanctuaire Mobile : 4 engagements (hors-ligne, audio natif, zéro pub, révision)
 * - Avis Certifiés : Témoignages vérifiés 5.0/5 avec pagination AJAX
 * - Smart Sticky Store Bar Mobile fermable (zéro obstruction)
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
  <!-- EN-TÊTE INSTITUTIONNEL & NAVIGATION MULTI-DEVICE                       -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <header>
    <a href="/" class="brand" aria-label="kanto.mg - Accueil">
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

    <!-- Navigation culturelle desktop -->
    <nav class="header-nav" aria-label="Navigation culturelle">
      <a href="#univers" class="header-nav-link">Les 6 Trésors</a>
      <a href="/ohabolana" class="header-nav-link">Ohabolana</a>
      <a href="/angano" class="header-nav-link">Angano</a>
      <a href="/kabary" class="header-nav-link">Kabary</a>
      <a href="/tononkalo" class="header-nav-link">Tononkalo</a>
      <a href="#telechargement" class="header-nav-link">Application</a>
    </nav>

    <div class="header-actions">
      <!-- Basculeur de thème sombre / clair -->
      <button type="button" class="theme-toggle-btn" id="theme-toggle" aria-label="Basculer le thème d'affichage">
        <svg id="theme-icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        <svg id="theme-icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      </button>

      <!-- Bouton secondaire Se connecter / Mon Espace (Desktop & Mobile) -->
      <button type="button" class="header-login-btn" id="header-btn-login" aria-label="Accéder à mon espace testeur">
        <span>Se connecter</span>
      </button>

      <!-- Action principale Créer un compte -->
      <a href="#section-inscription" class="header-cta-btn" id="header-btn-register">
        <span>Créer un compte</span>
      </a>
    </div>
  </header>

  <main>
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- HERO SECTION MOBILE-FIRST : TRANSMISSION & CONVERSION IMMÉDIATE       -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="hero-editorial" aria-labelledby="hero-main-title">
      <div class="hero-content">
        <div class="eyebrow-pill">
          <span>Plateforme Officielle • Lova Malagasy</span>
        </div>

        <h1 id="hero-main-title" class="hero-title">
          La culture malgache, <em>autrement.</em>
        </h1>

        <div class="hero-subtitle-mg">
          Lova • Kolontsaina • Fahendrena
        </div>

        <p class="hero-lead">
          Kanto MG réunit les proverbes ancestraux (<em>Ohabolana</em>), les récits des veillées (<em>Angano</em>), l'éloquence oratoire (<em>Kabary</em>) et la poésie des Hauts Plateaux dans un sanctuaire numérique sobre, bilingue et accessible à tous.
        </p>

        <!-- Cluster de Conversion Prioritaire Hero -->
        <div class="hero-conversion-cluster">
          <!-- 1. Actions Majeures : Inscription & Découverte -->
          <div class="hero-actions-group">
            <a href="#section-inscription" class="btn-hero-primary" id="hero-btn-primary-action">
              <span>Créer mon compte</span>
              <span aria-hidden="true">→</span>
            </a>
            <a href="#telechargement" class="btn-hero-secondary" id="hero-btn-discover-app">
              <span>Découvrir l'application</span>
            </a>
          </div>

          <!-- 2. Badges de Téléchargement Stores Officiels Immédiats -->
          <div class="hero-store-buttons" aria-label="Téléchargement direct de l'application">
            <a href="https://play.google.com/apps/testing/com.devengalere.kantomg" class="store-badge-btn store-android" id="hero-store-google-play" target="_blank" rel="noopener noreferrer">
              <span class="store-platform-tag">Android</span>
              <div class="store-badge-text">
                <span class="store-badge-sub">Disponible sur</span>
                <span class="store-badge-title">Google Play</span>
              </div>
            </a>

            <a href="https://testflight.apple.com/join/TEAM_KANTO" class="store-badge-btn store-ios" id="hero-store-testflight" target="_blank" rel="noopener noreferrer">
              <span class="store-platform-tag">iOS</span>
              <div class="store-badge-text">
                <span class="store-badge-sub">Télécharger sur</span>
                <span class="store-badge-title">Apple TestFlight</span>
              </div>
            </a>
          </div>

          <div class="hero-guarantee-note">
            <span>Inscription en 30 secondes • 100% Gratuit • Sans publicité</span>
          </div>
        </div>

        <!-- Indicateurs de confiance et réassurance -->
        <div class="hero-badges-row">
          <div class="hero-stat-item">
            <span class="hero-stat-value">5.0 / 5</span>
            <span class="hero-stat-label">Avis certifiés communauté</span>
          </div>
          <div class="hero-stat-item">
            <span class="hero-stat-value">100%</span>
            <span class="hero-stat-label">Accessible hors-ligne</span>
          </div>
          <div class="hero-stat-item">
            <span class="hero-stat-value">Bilingue</span>
            <span class="hero-stat-label">Malagasy &amp; Français</span>
          </div>
          <div class="hero-stat-item">
            <span class="hero-stat-value" id="header-tester-count">${countBadgeText}</span>
            <span class="hero-stat-label">Membres pionniers</span>
          </div>
        </div>
      </div>

      <!-- Composition graphique : Mockup Smartphone Kanto réel -->
      <div class="hero-visual-frame" aria-hidden="true">
        <div class="phone-mockup-wrapper">
          <div class="phone-screen">
            <div class="phone-notch"></div>

            <!-- Proverbe du jour dans l'application -->
            <div class="phone-proverb-card">
              <span class="phone-card-tag">Ohabolana anio • Proverbe du jour</span>
              <div class="phone-proverb-mg">
                « Ny fihavanana toy ny kofehy manify, ka raha tapaka azo tohizana, fa mitondra vonga. »
              </div>
              <div class="phone-proverb-fr">
                La solidarité fraternelle est semblable à un fil délicat : rompue, on peut la renouer, mais elle garde toujours un nœud.
              </div>
              <div class="phone-audio-pill">
                <span>Écoute audio malgache</span>
              </div>
            </div>

            <!-- Grille des univers dans le mockup -->
            <div class="phone-hubs-grid">
              <div class="phone-hub-item">
                <span class="phone-hub-name">Ohabolana</span>
              </div>
              <div class="phone-hub-item">
                <span class="phone-hub-name">Angano</span>
              </div>
              <div class="phone-hub-item">
                <span class="phone-hub-name">Kabary</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- SECTION 1 : INSCRIPTION DÉDIÉE & AVANTAGES CONCRETS                    -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="conversion-section" id="section-inscription" aria-labelledby="section-inscription-title">
      <div class="conversion-header">
        <span class="section-eyebrow">Rejoindre la Communauté Kanto</span>
        <h2 id="section-inscription-title" class="conversion-title">Créez votre compte membre</h2>
        <p class="conversion-desc">
          Participez activement au rayonnement de la langue malgache, enregistrez vos favoris et accédez en avant-première aux nouvelles fonctionnalités.
        </p>
      </div>

      <!-- Arguments concrets et réels de l'adhésion -->
      <div class="membership-benefits-grid">
        <div class="benefit-card">
          <span class="benefit-number">01</span>
          <h4>Espace personnel</h4>
          <p>Mémorisez vos proverbes, poésies et contes favoris pour les retrouver en un clic.</p>
        </div>
        <div class="benefit-card">
          <span class="benefit-number">02</span>
          <h4>Participation communautaire</h4>
          <p>Donnez votre avis sur l'application, votez pour les meilleurs contenus et échangez.</p>
        </div>
        <div class="benefit-card">
          <span class="benefit-number">03</span>
          <h4>Préservation culturelle</h4>
          <p>Contribuez à sauvegarder la richesse des traditions et parlers régionaux de la Grande Île.</p>
        </div>
        <div class="benefit-card">
          <span class="benefit-number">04</span>
          <h4>Jeux et défis civiques</h4>
          <p>Relevez les devinettes quotidiennes (Ankamantatra), mots croisés et quiz culturels.</p>
        </div>
        <div class="benefit-card">
          <span class="benefit-number">05</span>
          <h4>Suivi de progression</h4>
          <p>Cumulez des points d'expérience (XP), gardez votre série active et suivez vos apprentissages.</p>
        </div>
        <div class="benefit-card">
          <span class="benefit-number">06</span>
          <h4>Corpus 100% hors-ligne</h4>
          <p>Accédez à l'ensemble du dictionnaire et des récits même sans connexion Internet.</p>
        </div>
      </div>

      <!-- Onglets interactifs (Inscription vs Téléchargement vs Mon Espace) -->
      <div class="tabs-nav" role="tablist">
        <button type="button" class="tab-btn ${initialTab === 'register' && !isRegistered ? 'active' : ''}" id="tab-btn-register" role="tab" aria-selected="${initialTab === 'register' && !isRegistered}">
          <span>Créer mon compte</span>
        </button>
        <button type="button" class="tab-btn ${initialTab === 'download' ? 'active' : ''}" id="tab-btn-download" role="tab" aria-selected="${initialTab === 'download'}">
          <span>Téléchargement</span>
        </button>
        <button type="button" class="tab-btn ${initialTab === 'already_registered' || isRegistered ? 'active' : ''}" id="tab-btn-already" role="tab" style="display: none;">
          <span>Mon Espace</span>
        </button>
      </div>

      <!-- Bannières d'alerte et de confirmation -->
      <div id="error-banner" class="banner error">
        <span id="error-text">${errorVal}</span>
      </div>
      <div id="success-banner" class="banner success">
        <span id="success-text"></span>
      </div>

      <!-- ─── VOLET 1 : FORMULAIRE D'INSCRIPTION ─────────────────────────────── -->
      <div id="panel-register" style="display: ${initialTab === 'register' && !isRegistered ? 'block' : 'none'};">
        <form id="waitlist-form" class="form-container">
          <!-- Piège anti-spam invisible -->
          <div class="hp-trap">
            <input type="text" id="hp-website" name="website" tabindex="-1" autocomplete="off">
          </div>

          <div class="field">
            <label class="field-label" for="reg-email">
              <span>Votre adresse e-mail</span>
              <span class="field-badge-required">Requis</span>
            </label>
            <input 
              type="email" 
              id="reg-email" 
              class="field-input" 
              placeholder="ex: nom@domaine.com" 
              required 
              value="${emailVal}"
              autocomplete="email"
            >
            <p class="field-note">
              Utilisée pour lier votre compte et vos accès Google Play ou TestFlight.
            </p>
          </div>

          <div class="field">
            <label class="field-label" for="reg-name">
              <span>Prénom ou nom public</span>
              <span class="field-badge-opt">Optionnel</span>
            </label>
            <input 
              type="text" 
              id="reg-name" 
              class="field-input" 
              placeholder="ex: Rova, Faly, Hery..."
              autocomplete="name"
            >
          </div>

          <!-- Choix de plateformes tactiles -->
          <div class="field">
            <label class="field-label">
              <span>Sur quel smartphone utilisez-vous Kanto ?</span>
            </label>
            <div class="platforms-grid">
              <div class="platform-card checked" id="card-android">
                <div class="platform-card-head">
                  <span class="platform-title">Android</span>
                  <span class="platform-status-badge">Prêt</span>
                </div>
                <p class="platform-desc">Google Play Closed Testing &amp; APK signé.</p>
              </div>

              <div class="platform-card" id="card-ios">
                <div class="platform-card-head">
                  <span class="platform-title">iPhone / iOS</span>
                  <span class="platform-status-badge">TestFlight</span>
                </div>
                <p class="platform-desc">Invitation personnelle Apple TestFlight.</p>
              </div>
            </div>
          </div>

          <!-- Consentements légaux RGPD & CGU -->
          <div class="consent-card-box">
            <div class="consent-item">
              <input type="checkbox" id="consent-cgu" class="consent-checkbox" required checked>
              <label for="consent-cgu" class="consent-label">
                J'accepte les <button type="button" id="btn-open-cgu-modal">Conditions Générales d'Utilisation</button> de Kanto MG.
              </label>
            </div>
            <div class="consent-item">
              <input type="checkbox" id="consent-privacy" class="consent-checkbox" required checked>
              <label for="consent-privacy" class="consent-label">
                J'accepte la <button type="button" id="btn-open-privacy-modal">Politique de Confidentialité</button> (identifiants chiffrés AES-256-GCM, aucune cession de données).
              </label>
            </div>
          </div>

          <button type="submit" class="btn-submit-main" id="btn-submit-reg">
            <span>Créer mon compte Kanto</span>
          </button>

          <div class="already-link-box">
            Vous avez déjà un compte ? <a id="link-open-already">Accéder à mon espace membre</a>
          </div>
        </form>
      </div>

      <!-- ─── VOLET 2 : TÉLÉCHARGEMENT DIRECT STORES ─────────────────────────── -->
      <div id="panel-download" style="display: ${initialTab === 'download' ? 'block' : 'none'};">
        <div class="form-container">
          <div class="download-grid">
            <div class="download-card">
              <div>
                <span class="platform-pill-badge android">Android</span>
                <h3 class="download-card-title">Google Play Store</h3>
                <p class="download-card-desc">
                  Version officielle de test certifiée pour smartphones et tablettes Android (Android 9.0 et supérieur).
                </p>
                <div class="download-meta-tags">
                  <span>Version Bêta active</span>
                  <span>Mises à jour automatiques</span>
                </div>
              </div>
              <a href="https://play.google.com/apps/testing/com.devengalere.kantomg" class="download-action-btn android" target="_blank" rel="noopener noreferrer">
                <span>Accéder sur Google Play ↗</span>
              </a>
            </div>

            <div class="download-card">
              <div>
                <span class="platform-pill-badge ios">iOS / Apple</span>
                <h3 class="download-card-title">Apple TestFlight</h3>
                <p class="download-card-desc">
                  Version préliminaire complète pour iPhone et iPad via l'application Apple TestFlight.
                </p>
                <div class="download-meta-tags">
                  <span>iOS 15.0 et ultérieur</span>
                  <span>Accès direct</span>
                </div>
              </div>
              <a href="https://testflight.apple.com/join/TEAM_KANTO" class="download-action-btn ios" target="_blank" rel="noopener noreferrer">
                <span>Accéder sur TestFlight ↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── VOLET 3 : MON ESPACE MEMBRE ────────────────────────────────────── -->
      <div id="panel-already" style="display: ${initialTab === 'already_registered' || isRegistered ? 'block' : 'none'};">
        <div class="form-container" style="text-align: center; padding: 20px 0;">
          <h3 style="font-family: var(--font-serif); font-size: 24px; margin-bottom: 12px; color: var(--color-heading);">
            Consultez votre statut Bêta-Testeur Kanto
          </h3>
          <p style="font-size: 14.5px; color: var(--color-ink-muted); margin-bottom: 24px; max-width: 480px; margin-left: auto; margin-right: auto;">
            Saisissez l'adresse e-mail avec laquelle vous êtes inscrit pour vérifier votre statut ou recevoir vos liens personnels de téléchargement.
          </p>

          <form id="check-status-form">
            <div class="field" style="max-width: 420px; margin: 0 auto 20px;">
              <input 
                type="email" 
                id="check-email-input" 
                class="field-input" 
                placeholder="votre.email@domaine.com" 
                required 
                value="${emailVal}"
              >
            </div>
            <button type="submit" class="btn-submit-main" style="max-width: 280px; margin: 0 auto;">
              <span>Vérifier mon compte</span>
            </button>
          </form>
        </div>
      </div>

      <!-- ─── VOLET 4 : DÉSINCRIPTION ────────────────────────────────────────── -->
      <div id="panel-unsubscribe" style="display: ${initialTab === 'unsubscribe' ? 'block' : 'none'};">
        <div class="form-container" style="text-align: center; padding: 20px 0;">
          <h3 style="font-family: var(--font-serif); font-size: 22px; margin-bottom: 12px; color: var(--color-terracotta);">
            Désinscription de la communauté Bêta
          </h3>
          <p style="font-size: 14px; color: var(--color-ink-muted); margin-bottom: 24px;">
            Vos données personnelles seront immédiatement et définitivement effacées conformément au RGPD.
          </p>
          <button type="button" class="btn-submit-main" id="btn-confirm-unsub" style="max-width: 280px; margin: 0 auto; background: var(--color-ink);">
            <span>Confirmer ma désinscription</span>
          </button>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- SECTION 2 : TÉLÉCHARGEMENT MAJEUR DÉDIÉ (APPLICATION & QR CODE)        -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="editorial-section download-showcase-section" id="telechargement" aria-labelledby="showcase-download-title">
      <div class="section-header-editorial">
        <span class="section-eyebrow">Application Mobile Kanto MG</span>
        <h2 id="showcase-download-title" class="section-title-editorial">Le patrimoine malgache dans votre poche.</h2>
        <p class="section-lead-editorial">
          Installez Kanto MG sur votre smartphone et découvrez la langue, les contes et la sagesse de Madagascar partout avec vous.
        </p>
      </div>

      <div class="download-showcase-box">
        <div class="download-showcase-content">
          <div class="showcase-status-row">
            <span class="showcase-badge-active">Android disponible</span>
            <span class="showcase-badge-active">iOS TestFlight disponible</span>
          </div>

          <h3 class="showcase-heading">Emportez vos trésors partout</h3>
          <p class="showcase-text">
            Fonctionne entièrement sans réseau Internet. Écoutez les contes au clair de lune, apprenez un proverbe chaque matin et perfectionnez votre vocabulaire avec des voix de locuteurs natifs.
          </p>

          <div class="showcase-store-buttons">
            <a href="https://play.google.com/apps/testing/com.devengalere.kantomg" class="store-badge-btn store-android" target="_blank" rel="noopener noreferrer">
              <span class="store-platform-tag">Android</span>
              <div class="store-badge-text">
                <span class="store-badge-sub">Obtenir sur</span>
                <span class="store-badge-title">Google Play</span>
              </div>
            </a>

            <a href="https://testflight.apple.com/join/TEAM_KANTO" class="store-badge-btn store-ios" target="_blank" rel="noopener noreferrer">
              <span class="store-platform-tag">iOS</span>
              <div class="store-badge-text">
                <span class="store-badge-sub">Installer via</span>
                <span class="store-badge-title">Apple TestFlight</span>
              </div>
            </a>
          </div>
        </div>

        <!-- QR Code interactif pour les utilisateurs sur ordinateur -->
        <div class="download-showcase-qr" aria-hidden="true">
          <div class="qr-frame">
            <!-- QR code vectoriel SVG pur menant vers app-kanto.gastsar.fr -->
            <svg class="qr-svg" viewBox="0 0 120 120" width="120" height="120" fill="currentColor">
              <rect x="10" y="10" width="30" height="30" fill="none" stroke="currentColor" stroke-width="6"/>
              <rect x="20" y="20" width="10" height="10" fill="currentColor"/>
              <rect x="80" y="10" width="30" height="30" fill="none" stroke="currentColor" stroke-width="6"/>
              <rect x="90" y="20" width="10" height="10" fill="currentColor"/>
              <rect x="10" y="80" width="30" height="30" fill="none" stroke="currentColor" stroke-width="6"/>
              <rect x="20" y="90" width="10" height="10" fill="currentColor"/>
              <rect x="50" y="10" width="10" height="20" fill="currentColor"/>
              <rect x="50" y="40" width="20" height="10" fill="currentColor"/>
              <rect x="10" y="50" width="20" height="10" fill="currentColor"/>
              <rect x="80" y="50" width="10" height="20" fill="currentColor"/>
              <rect x="50" y="70" width="10" height="30" fill="currentColor"/>
              <rect x="70" y="70" width="30" height="10" fill="currentColor"/>
              <rect x="70" y="90" width="10" height="20" fill="currentColor"/>
              <rect x="90" y="90" width="20" height="20" fill="currentColor"/>
            </svg>
            <span class="qr-caption">Scannez pour installer sur smartphone</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- SECTION 3 : LES SIX TRÉSORS DE KANTO (BENTO GRID ÉDITORIAL)            -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="editorial-section" id="univers" aria-labelledby="univers-title">
      <div class="section-header-editorial">
        <span class="section-eyebrow">Le Sanctuaire Culturel</span>
        <h2 id="univers-title" class="section-title-editorial">Six univers pour explorer l'âme malgache.</h2>
        <p class="section-lead-editorial">
          Chaque rubrique a été pensée comme un chapitre vivant de notre héritage, alliant rigueur linguistique, contexte culturel et esthétique contemporaine.
        </p>
      </div>

      <div class="univers-bento-grid">
        <!-- 1. Ohabolana -->
        <a href="/ohabolana" class="bento-card bento-card-heroic">
          <div>
            <div class="bento-card-top"><span class="bento-number">01</span></div>
            <div class="bento-card-body" style="margin-top: 18px;">
              <h3>Ohabolana sy Fahendrena</h3>
              <p>
                Des centaines de proverbes traditionnels décryptés avec leur portée philosophique, leur équivalent en français et des exemples d'usage au quotidien.
              </p>
              <div class="bento-quote-sample">
                « Izay mahay sobika mahay fatan-dronono. » — La maîtrise des grandes choses commence par la précision dans les petites.
              </div>
            </div>
          </div>
          <div class="bento-card-foot">
            <span>Explorer la sagesse des Ohabolana</span>
            <span>→</span>
          </div>
        </a>

        <!-- 2. Angano -->
        <a href="/angano" class="bento-card bento-card-side">
          <div>
            <div class="bento-card-top"><span class="bento-number">02</span></div>
            <div class="bento-card-body" style="margin-top: 18px;">
              <h3>Angano sy Lovantsofina</h3>
              <p>
                Les récits légendaires des veillées au clair de lune : les ruses d'Ikotofetsy sy Imahakà, la force de Darafify et les contes moraux.
              </p>
            </div>
          </div>
          <div class="bento-card-foot">
            <span>Lire les contes</span>
            <span>→</span>
          </div>
        </a>

        <!-- 3. Kabary -->
        <a href="/kabary" class="bento-card bento-card-third">
          <div>
            <div class="bento-card-top"><span class="bento-number">03</span></div>
            <div class="bento-card-body" style="margin-top: 18px;">
              <h3>Kabary &amp; Art Oratoire</h3>
              <p>
                L'éloquence sacrée des orateurs traditionnels (<em>Mpikabary</em>) pour le mariage et les étapes fondatrices de la vie sociale.
              </p>
            </div>
          </div>
          <div class="bento-card-foot">
            <span>Découvrir le Kabary</span>
            <span>→</span>
          </div>
        </a>

        <!-- 4. Tononkalo -->
        <a href="/tononkalo" class="bento-card bento-card-third">
          <div>
            <div class="bento-card-top"><span class="bento-number">04</span></div>
            <div class="bento-card-body" style="margin-top: 18px;">
              <h3>Tononkalo &amp; Haisoratra</h3>
              <p>
                La poésie malgache contemporaine et classique : Rado, Dox, Jean-Joseph Rabearivelo, avec module de mémorisation guidée.
              </p>
            </div>
          </div>
          <div class="bento-card-foot">
            <span>Parcourir les poèmes</span>
            <span>→</span>
          </div>
        </a>

        <!-- 5. Raki-teny -->
        <a href="/raki-teny" class="bento-card bento-card-third">
          <div>
            <div class="bento-card-top"><span class="bento-number">05</span></div>
            <div class="bento-card-body" style="margin-top: 18px;">
              <h3>Raki-teny &amp; Voambolana</h3>
              <p>
                Dictionnaire thématique bilingue, subtilités du vocabulaire, étymologies et richesses des dialectes régionaux.
              </p>
            </div>
          </div>
          <div class="bento-card-foot">
            <span>Consulter le dictionnaire</span>
            <span>→</span>
          </div>
        </a>

        <!-- 6. Tantara & Fomba -->
        <a href="/histoire" class="bento-card bento-card-heroic" style="grid-column: span 12; background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-tanimbary-soft) 100%);">
          <div>
            <div class="bento-card-top"><span class="bento-number">06</span></div>
            <div class="bento-card-body" style="margin-top: 18px;">
              <h3>Tantara, Fomba Gasy &amp; Repères Civiques</h3>
              <p>
                Histoire des souverains, organisation des clans, valeurs du Fihavanana et us et coutumes des 18 ethnies de l'île.
              </p>
            </div>
          </div>
          <div class="bento-card-foot">
            <span>Explorer l'histoire et les coutumes</span>
            <span>→</span>
          </div>
        </a>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- SECTION 4 : ENGAGEMENTS DE L'APPLICATION MOBILE                        -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="experience-strip" aria-labelledby="experience-title">
      <span class="section-eyebrow">Conçu pour la transmission</span>
      <h2 id="experience-title" class="section-title-editorial">Un sanctuaire culturel dans le creux de votre main.</h2>
      <p class="section-lead-editorial">
        Kanto MG a été façonné avec l'exigence d'un beau livre et la fluidité d'un produit moderne.
      </p>

      <div class="pillars-grid">
        <div class="pillar-item">
          <h4>Sans distraction</h4>
          <p>Zéro publicité intrusive, zéro traçage commercial. Un sanctuaire apaisé dédié uniquement à la lecture et au recueillement.</p>
        </div>

        <div class="pillar-item">
          <h4>100% Hors-ligne</h4>
          <p>Voyagez sereinement. Vos contes, proverbes et poésies restent entièrement accessibles sans réseau mobile.</p>
        </div>

        <div class="pillar-item">
          <h4>Audio &amp; Phonétique</h4>
          <p>Écoutez les prononciations authentiques enregistrées par des locuteurs natifs pour apprécier la musicalité de la langue.</p>
        </div>

        <div class="pillar-item">
          <h4>Révision &amp; Jeux</h4>
          <p>Ankamantatra (devinettes), mots croisés et quiz civiques pour ancrer les connaissances de manière ludique.</p>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- SECTION 5 : AVIS CERTIFIÉS DE LA COMMUNAUTÉ                            -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="reviews-section-editorial" id="section-community-reviews" aria-labelledby="reviews-section-title">
      <div class="reviews-header-modern">
        <div>
          <span class="section-eyebrow">Retours d'expérience</span>
          <h2 id="reviews-section-title" class="reviews-title">Ce que dit notre communauté</h2>
          <p class="reviews-subtitle">
            Retours authentiques partagés par nos membres et testeurs pionniers de Madagascar et de la diaspora.
          </p>
        </div>

        <!-- Badge de confiance certifié -->
        <div class="reviews-trust-pill" id="reviews-trust-badge">
          <div class="trust-pill-score" id="reviews-avg-rating">5.0</div>
          <div class="trust-pill-info">
            <div class="trust-pill-stars" id="reviews-avg-stars">
              ★★★★★
            </div>
            <div class="trust-pill-label" id="reviews-total-count">Avis certifiés</div>
          </div>
        </div>
      </div>

      <!-- Grille dynamique des avis certifiés (générée par /beta-waitlist.js) -->
      <div class="reviews-list-grid" id="reviews-cards-list">
        <div class="reviews-empty-state">Chargement des avis vérifiés de la communauté...</div>
      </div>

      <!-- Pagination AJAX fluide -->
      <div class="reviews-pagination-box" id="reviews-pagination-box" style="display: none;">
        <button type="button" class="btn-secondary" id="btn-load-more-reviews">
          <span>Découvrir plus de témoignages</span>
          <span aria-hidden="true">↓</span>
        </button>
      </div>
    </section>
  </main>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- BARRE D'ACTION MOBILE FIXE (SMART STICKY BAR, FERMABLE)                -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <div class="mobile-sticky-bar" id="mobile-sticky-bar" aria-label="Installation mobile">
    <div class="mobile-sticky-info">
      <img src="/logo.png" alt="Logo Kanto" width="28" height="28" class="mobile-sticky-logo" onerror="this.onerror=null; this.src='/favicon.png';">
      <div class="mobile-sticky-text">
        <strong>Kanto MG</strong>
        <span>Android &amp; iOS</span>
      </div>
    </div>
    <div class="mobile-sticky-actions">
      <a href="#section-inscription" class="btn-sticky-store primary" id="sticky-btn-register">Créer un compte</a>
      <a href="https://play.google.com/apps/testing/com.devengalere.kantomg" class="btn-sticky-store store" target="_blank" rel="noopener noreferrer">Stores</a>
      <button type="button" class="btn-sticky-close" id="btn-close-sticky-bar" aria-label="Fermer le bandeau">✕</button>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- MODALES LÉGALES & COOKIES                                              -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <div id="kanto-cgu-modal" class="kanto-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="cgu-modal-title" style="display: none;">
    <div class="kanto-modal-card">
      <div class="kanto-modal-head">
        <h2 id="cgu-modal-title" class="kanto-modal-title">
          <span>Conditions Générales d'Utilisation • Bêta-Testeur Kanto</span>
        </h2>
        <button type="button" id="cgu-modal-close" class="kanto-modal-close" aria-label="Fermer la modale">✕</button>
      </div>
      <div class="kanto-modal-scroll">
        <div class="cgu-highlight-box">
          <strong>Esprit Kanto MG : Fihavanana &amp; Haja</strong><br>
          En rejoignant Kanto, vous devenez acteur d'un sanctuaire numérique dédié au patrimoine, aux contes (<em>Angano</em>), proverbes (<em>Ohabolana</em>) et traditions de Madagascar.
        </div>
        <p>Les versions de test sont fournies pour évaluation et signalement d'anomalies. Vous conservez la liberté totale de vous retirer du programme à tout instant.</p>
      </div>
      <div class="kanto-modal-foot">
        <a href="${legalBaseUrl}/pages/terms" target="_blank" rel="noopener noreferrer" style="font-size: 12px; color: var(--color-ink-muted); text-decoration: underline;">
          Ouvrir les CGU complètes ↗
        </a>
        <button type="button" id="cgu-modal-btn-accept" class="cookie-btn cookie-btn-primary">J'ai compris</button>
      </div>
    </div>
  </div>

  <div id="kanto-privacy-modal" class="kanto-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="privacy-modal-title" style="display: none;">
    <div class="kanto-modal-card">
      <div class="kanto-modal-head">
        <h2 id="privacy-modal-title" class="kanto-modal-title">
          <span>Politique de Confidentialité • RGPD</span>
        </h2>
        <button type="button" id="privacy-modal-close" class="kanto-modal-close" aria-label="Fermer la modale">✕</button>
      </div>
      <div class="kanto-modal-scroll">
        <div class="cgu-highlight-box">
          <strong>Minimisation &amp; Chiffrement fort</strong><br>
          Kanto MG n'enregistre aucune donnée commerciale. Vos adresses e-mails sont chiffrées avec l'algorithme cryptographique AES-256-GCM.
        </div>
        <p>Conformément au RGPD, vous bénéficiez d'un droit permanent d'accès, de rectification et d'effacement direct en un clic.</p>
      </div>
      <div class="kanto-modal-foot">
        <a href="${legalBaseUrl}/pages/privacy" target="_blank" rel="noopener noreferrer" style="font-size: 12px; color: var(--color-ink-muted); text-decoration: underline;">
          Ouvrir la politique complète ↗
        </a>
        <button type="button" id="privacy-modal-btn-accept" class="cookie-btn cookie-btn-primary">Fermer</button>
      </div>
    </div>
  </div>

  <aside id="kanto-cookie-banner" class="cookie-banner" role="region" aria-label="Gestion des cookies" style="display: none;">
    <div class="cookie-banner-wrap">
      <div class="cookie-banner-text-wrap">
        <div class="cookie-banner-title">
          <span>Respect de votre vie privée &amp; Cookies</span>
        </div>
        <p class="cookie-banner-desc">
          Traceurs strictement techniques et mémorisation de vos préférences d'affichage. Zéro profilage publicitaire.
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
          <span>Préférences de confidentialité &amp; Cookies</span>
        </h2>
        <button type="button" id="cookie-modal-close" class="kanto-modal-close" aria-label="Fermer la gestion des cookies">✕</button>
      </div>
      <div class="kanto-modal-scroll">
        <p style="margin-bottom: 16px;">Traceurs strictement nécessaires et préférences d'affichage de thème.</p>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--color-border);">
          <span>1. Nécessaires au fonctionnement</span>
          <span style="font-size: 11px; font-weight: 700; color: var(--color-terracotta);">Obligatoire</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
          <span>2. Mémorisation du thème (Sombre/Clair)</span>
          <input type="checkbox" id="cookie-opt-preferences" checked style="accent-color: var(--color-terracotta);">
        </div>
      </div>
      <div class="kanto-modal-foot">
        <button type="button" id="cookie-modal-btn-reject" class="cookie-btn cookie-btn-secondary">Tout refuser</button>
        <button type="button" id="cookie-modal-btn-save" class="cookie-btn cookie-btn-primary">Enregistrer mes choix</button>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- PIED DE PAGE ÉDITORIAL & INSTITUTIONNEL                                -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <footer>
    <div class="footer-inner">
      <div class="footer-top-grid">
        <div class="footer-brand-col">
          <div class="brand">
            <span class="brand-name">kanto<span class="brand-domain">.mg</span></span>
          </div>
          <div class="footer-proverb-quote">
            « Ny hazo no vanon-ko lakana, ny tany naniriany no tsara. »
          </div>
          <div class="footer-proverb-sub">
            C'est la terre bienveillante qui fait grandir l'arbre digne de devenir pirogue.
          </div>
        </div>

        <div>
          <div class="footer-col-title">Les Trésors</div>
          <div class="footer-col-links">
            <a href="/ohabolana">Ohabolana (Proverbes)</a>
            <a href="/angano">Angano (Contes oraux)</a>
            <a href="/kabary">Kabary (Art oratoire)</a>
            <a href="/tononkalo">Tononkalo (Poésies)</a>
            <a href="/raki-teny">Raki-teny (Dictionnaire)</a>
            <a href="/histoire">Tantara (Histoire &amp; Us)</a>
          </div>
        </div>

        <div>
          <div class="footer-col-title">Projet &amp; Équipe</div>
          <div class="footer-col-links">
            <a href="${legalBaseUrl}/pages/about">À propos de Kanto MG</a>
            <a href="${legalBaseUrl}/pages/help">Aide &amp; FAQ</a>
            <a href="${legalBaseUrl}/pages/licenses">Crédits &amp; Licences</a>
            <a href="/feedback">Signaler une anomalie</a>
            <button type="button" id="footer-link-my-space">Mon espace membre</button>
          </div>
        </div>

        <div>
          <div class="footer-col-title">Cadre Légal &amp; Contact</div>
          <div class="footer-col-links">
            <a href="${legalBaseUrl}/pages/terms" id="footer-link-cgu">Conditions d'Utilisation (CGU)</a>
            <a href="${legalBaseUrl}/pages/privacy" id="footer-link-privacy">Confidentialité &amp; RGPD</a>
            <button type="button" id="btn-cookie-settings">Gestion des cookies</button>
            <a href="mailto:${supportEmail}">Support : ${supportEmail}</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom-bar">
        <div>
          © ${currentYear} <strong>kanto.mg</strong> • Sauvegarde, rayonnement et transmission vivante du patrimoine malgache.
        </div>
        <div style="font-style: italic;">
          Fihavanana sy Haja
        </div>
      </div>
    </div>
  </footer>
  `;
}
