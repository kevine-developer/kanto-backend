/**
 * Kanto MG — Portail officiel d'accès anticipé (Contenu HTML éditorial)
 * Direction artistique : Édition culturelle contemporaine, grilles asymétriques, filets fins 1px.
 */

import {
  KANTO_ZAFIMANIRY_DIVIDER,
  renderPublicHeader,
  renderPublicFooter,
  renderPublicReviewsSection,
} from '../../common/web/public-layout.js';

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
    emailVal,
    errorVal,
    currentYear,
  } = opt;

  return `
  ${renderPublicHeader({ activePath: '/', isLanding: true })}

  <main id="main-content">
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- OUVERTURE ÉDITORIALE ASYMÉTRIQUE & ACCÈS BÊTA                          -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="section-editorial-hero" id="inscription" aria-labelledby="hero-title">
      <div class="editorial-hero-grid">
        <!-- Colonne gauche : Manifeste culturel et garanties transparentes -->
        <div class="editorial-manifesto">
          <div class="editorial-kicker-row">
            <span class="editorial-kicker">Lova sy Kolontsaina • Programme Bêta</span>
            <span class="editorial-counter" id="header-tester-count">${countBadgeText}</span>
          </div>

          <h1 id="hero-title" class="editorial-title">
            Kanto MG — La culture malgache, autrement.
          </h1>

          <p class="editorial-lead">
            Une application mobile dédiée à la découverte et à la transmission vivante de la langue, de la littérature orale et du patrimoine de Madagascar : <em>Angano</em>, <em>Ohabolana</em>, <em>Kabary</em>, <em>Tononkalo</em>, <em>Raki-teny</em> et <em>Tantara</em>.
          </p>

          <dl class="editorial-guarantees" aria-label="Fonctionnement du programme d'accès anticipé">
            <div class="guarantee-item">
              <dt class="guarantee-term">Accès gratuit</dt>
              <dd class="guarantee-desc">Programme bénévole sans publicité ni achat intégré pendant toute la phase de test.</dd>
            </div>
            <div class="guarantee-item">
              <dt class="guarantee-term">Lecture hors-ligne</dt>
              <dd class="guarantee-desc">Corpus bilingue malgache / français et favoris consultables sans connexion.</dd>
            </div>
            <div class="guarantee-item">
              <dt class="guarantee-term">Android &amp; iOS natifs</dt>
              <dd class="guarantee-desc">Distribution encadrée via Google Play (Google Groups) et Apple TestFlight.</dd>
            </div>
            <div class="guarantee-item">
              <dt class="guarantee-term">Protection des données</dt>
              <dd class="guarantee-desc">E-mails chiffrés au repos (AES-256-GCM) sans cession commerciale.</dd>
            </div>
          </dl>
        </div>

        <!-- Colonne droite : Panneau d'accès au programme Bêta -->
        <div class="register-form-card" id="register-card">
          <div class="register-card-head">
            <span class="register-card-kicker">Rejoindre le programme</span>
            <h2 class="register-card-title">Bêta-Testeur Kanto</h2>
          </div>

          <!-- Bannières d'état serveur -->
          <div id="error-banner" class="banner banner-error" role="alert" style="${errorVal ? 'display:flex;' : 'display:none;'}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span id="error-text">${errorVal}</span>
          </div>

          <div id="success-banner" class="banner banner-success" role="status" style="display: none;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span id="success-text"></span>
          </div>

          <!-- Sélecteur de plateforme (Android Google Groups vs iOS TestFlight) -->
          <div class="field-group" style="margin-bottom: 18px;">
            <span class="field-label" id="platform-selector-label">
              <span>Votre système mobile</span>
              <span class="label-meta">Choix du parcours</span>
            </span>
            <div class="platform-selector-row" role="tablist" aria-labelledby="platform-selector-label">
              <button type="button" class="platform-btn" id="card-android" data-platform="ANDROID" role="tab" aria-selected="false" aria-pressed="false" aria-controls="android-group-panel">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.411 13.8533 8.125 12 8.125s-3.5902.286-5.1368.8257L4.8409 5.4477a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 10.9997.426 14.5408.426 18.6667h23.148c0-4.1259-2.2629-7.667-5.6925-9.3453"/></svg>
                <span>
                  <span class="platform-btn-label">Android</span>
                  <span class="platform-btn-sub">Accès direct Google Groups</span>
                </span>
              </button>

              <button type="button" class="platform-btn checked" id="card-ios" data-platform="IOS" role="tab" aria-selected="true" aria-pressed="true" aria-controls="waitlist-form">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.92.04-2.02.62-2.67 1.37-.56.64-1.05 1.71-.92 2.74 1.03.08 2.06-.49 2.67-1.24z"/></svg>
                <span>
                  <span class="platform-btn-label">iPhone / iPad (iOS)</span>
                  <span class="platform-btn-sub">Invitation Apple TestFlight</span>
                </span>
              </button>
            </div>
          </div>

          <!-- Parcours direct Android (sans formulaire) -->
          <div id="android-group-panel" class="android-group-panel" role="tabpanel" aria-labelledby="card-android" style="display: none;">
            <div class="android-group-callout">
              <div class="android-group-head">
                <span class="store-channel-tag">Procédure directe sans formulaire</span>
                <h3 class="android-group-title">Activer votre accès testeur Android</h3>
                <p class="android-group-desc">
                  Pour Android, aucune inscription préalable par formulaire n'est requise. Suivez ces trois étapes avec le <strong>même compte Google</strong> :
                </p>
              </div>

              <ol class="android-steps-list">
                <li>
                  <span class="android-step-index">01</span>
                  <div class="android-step-body">
                    <span class="android-step-title">Rejoindre la communauté officielle</span>
                    <a
                      href="https://groups.google.com/g/communaute-kanto"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn-primary-action"
                      id="btn-join-google-group"
                    >
                      <span>Rejoindre le groupe Google</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                    </a>
                  </div>
                </li>
                <li>
                  <span class="android-step-index">02</span>
                  <div class="android-step-body">
                    <span class="android-step-title">Activer le statut de testeur</span>
                    <a
                      href="https://play.google.com/apps/testing/com.devengalere.kantomg"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn-store-step outline"
                      id="btn-android-play-confirm"
                    >
                      <span class="step-label">Devenir testeur sur Google Play</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                    </a>
                  </div>
                </li>
                <li>
                  <span class="android-step-index">03</span>
                  <div class="android-step-body">
                    <span class="android-step-title">Télécharger l'application</span>
                    <a
                      href="https://play.google.com/store/apps/details?id=com.devengalere.kantomg"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn-store-step outline"
                      id="btn-android-play-download"
                    >
                      <span class="step-label">Ouvrir la fiche Google Play Store</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                    </a>
                  </div>
                </li>
              </ol>

              <p class="field-caption">
                Important : utilisez strictement la même adresse Google sur Google Groups et sur votre Google Play Store.
              </p>
            </div>
          </div>

          <!-- Formulaire iOS uniquement (Apple TestFlight) -->
          <form id="waitlist-form" class="clean-form" role="tabpanel" aria-labelledby="card-ios" novalidate>
            <div class="hp-trap" aria-hidden="true" style="display:none;">
              <label for="hp-website">Ne pas remplir</label>
              <input type="text" id="hp-website" name="website" tabindex="-1" autocomplete="off">
            </div>

            <div class="form-grid">
              <div class="field-group">
                <label for="reg-email" class="field-label">
                  <span>Identifiant e-mail Apple (iOS)</span>
                  <span class="label-required">iOS TestFlight uniquement</span>
                </label>
                <div class="field-input-wrap">
                  <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <input
                    type="email"
                    id="reg-email"
                    name="email"
                    class="clean-input"
                    placeholder="prenom@icloud.com"
                    required
                    value="${emailVal}"
                    autocomplete="email"
                    aria-describedby="reg-email-hint reg-email-error"
                  >
                </div>
                <span id="reg-email-hint" class="field-caption">Renseignez l'adresse associée à votre compte Apple / TestFlight sur iPhone ou iPad.</span>
                <span id="reg-email-error" class="field-inline-error" role="alert" style="display:none;"></span>
              </div>

              <div class="field-group">
                <label for="reg-fullname" class="field-label">
                  <span>Prénom ou nom</span>
                  <span class="label-meta">Optionnel</span>
                </label>
                <div class="field-input-wrap">
                  <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <input
                    type="text"
                    id="reg-fullname"
                    name="fullName"
                    class="clean-input"
                    placeholder="Ex. : Riana"
                    maxlength="100"
                    autocomplete="name"
                  >
                </div>
              </div>
            </div>

            <!-- Case d'acceptation explicite distincte (non pré-cochée) -->
            <div class="consent-row">
              <label class="consent-label" for="consent-cgu">
                <input type="checkbox" id="consent-cgu" name="termsAccepted" required aria-describedby="consent-cgu-error">
                <span>
                  J'accepte les <button type="button" class="link-inline" id="btn-open-cgu-modal">Conditions Générales d'Utilisation</button> ainsi que la <button type="button" class="link-inline" id="btn-open-privacy-modal">Politique de confidentialité</button> pour le traitement de mon invitation iOS TestFlight (aucune prospection commerciale).
                </span>
              </label>
              <span id="consent-cgu-error" class="field-inline-error" role="alert" style="display:none;"></span>
            </div>

            <div class="submit-wrap">
              <button type="submit" class="btn-primary-action" id="btn-submit-reg">
                <span>Demander mon accès TestFlight (iOS)</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </button>
            </div>

            <div class="already-registered-hint">
              <span>Déjà autorisé(e) sur iOS ou Android ?</span>
              <a href="#telechargement" class="link-hint">Accéder au téléchargement</a>
            </div>
          </form>
        </div>
      </div>
    </section>

    <div class="editorial-divider-wrap">
      ${KANTO_ZAFIMANIRY_DIVIDER}
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- SECTION TÉLÉCHARGEMENT DIRECT DES STORES                               -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="section-step section-download-step" id="telechargement" aria-labelledby="step-download-title">
      <div class="step-container">
        <div class="step-header">
          <div class="step-header-left">
            <span class="editorial-kicker">Accès aux préversions</span>
            <h2 id="step-download-title" class="step-title">Installer l'application Kanto MG</h2>
          </div>
          <p class="step-subtitle">
            Retrouvez ci-dessous les liens officiels pour Android (Google Play) et iOS (Apple TestFlight), mis à jour automatiquement selon l'état de publication.
          </p>
        </div>

        <div class="cards-duo-grid">
          <!-- Carte Android -->
          <article class="store-kanto-card" id="card-download-android">
            <div class="store-kanto-card-body">
              <div class="store-kanto-header">
                <div class="store-platform-icon android" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.411 13.8533 8.125 12 8.125s-3.5902.286-5.1368.8257L4.8409 5.4477a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 10.9997.426 14.5408.426 18.6667h23.148c0-4.1259-2.2629-7.667-5.6925-9.3453"/></svg>
                </div>
                <div class="store-platform-meta">
                  <span class="store-channel-tag" id="dl-android-badge">Google Play Store</span>
                  <h3 class="store-platform-title">Android</h3>
                </div>
                <span class="badge-recommended" id="rec-badge-android" style="display:none;">Votre appareil</span>
              </div>

              <p class="store-kanto-desc">
                Smartphones et tablettes Android (version 9.0 ou ultérieure). Adhésion via le Google Group officiel puis installation directe depuis Google Play.
              </p>

              <ul class="store-kanto-specs">
                <li>Android 9.0+</li>
                <li>Mode hors-ligne inclus</li>
                <li>Mises à jour automatiques</li>
              </ul>
            </div>

            <div class="store-kanto-footer">
              <div class="store-steps-flow">
                <a
                  href="https://groups.google.com/g/communaute-kanto"
                  class="btn-store-step outline"
                  id="join-link-google-group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span class="step-num">01</span>
                  <span class="step-label">Rejoindre le groupe Google</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </a>

                <a
                  href="https://play.google.com/apps/testing/com.devengalere.kantomg"
                  class="btn-store-step outline"
                  id="confirm-link-google-play"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span class="step-num">02</span>
                  <span class="step-label">Confirmer sur Google Play</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </a>

                <a
                  href="https://play.google.com/store/apps/details?id=com.devengalere.kantomg"
                  class="btn-store-step primary"
                  id="dl-btn-android-main"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span class="step-num">03</span>
                  <span class="step-label">Télécharger sur Google Play</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </a>
              </div>
            </div>
          </article>

          <!-- Carte iOS -->
          <article class="store-kanto-card" id="card-download-ios">
            <div class="store-kanto-card-body">
              <div class="store-kanto-header">
                <div class="store-platform-icon ios" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.92.04-2.02.62-2.67 1.37-.56.64-1.05 1.71-.92 2.74 1.03.08 2.06-.49 2.67-1.24z"/></svg>
                </div>
                <div class="store-platform-meta">
                  <span class="store-channel-tag" id="dl-ios-badge">Apple TestFlight</span>
                  <h3 class="store-platform-title">iPhone &amp; iPad</h3>
                </div>
                <span class="badge-recommended" id="rec-badge-ios" style="display:none;">Votre appareil</span>
              </div>

              <p class="store-kanto-desc">
                Compatible iOS 15.0 et ultérieur. Installez d'abord l'application gratuite TestFlight d'Apple puis ouvrez l'invitation après validation de votre compte Apple.
              </p>

              <ul class="store-kanto-specs">
                <li>iOS / iPadOS 15.0+</li>
                <li>Via Apple TestFlight</li>
                <li>Invitation par e-mail Apple</li>
              </ul>
            </div>

            <div class="store-kanto-footer">
              <div class="store-steps-flow">
                <a
                  href="https://apps.apple.com/app/testflight/id899247664"
                  class="btn-store-step outline"
                  id="install-link-testflight"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span class="step-num">01</span>
                  <span class="step-label">Installer Apple TestFlight</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </a>

                <a
                  href="https://testflight.apple.com/join/kantomg"
                  class="btn-store-step primary"
                  id="dl-btn-ios-main"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span class="step-num">02</span>
                  <span class="step-label">Rejoindre sur TestFlight</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- VOIX DE LA COMMUNAUTÉ (FEON'NY FIKAMBANANA)                            -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    ${renderPublicReviewsSection({ contextLabel: 'Bêta & Application mobile' })}

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- QUESTIONS FRÉQUENTES                                                   -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="section-faq" id="faq" aria-labelledby="faq-title">
      <div class="faq-container">
        <div class="faq-intro">
          <span class="editorial-kicker">Repères &amp; Réponses</span>
          <h2 id="faq-title" class="faq-title">Questions fréquentes</h2>
          <p class="faq-lead">
            Tout ce qu'il faut savoir avant d'installer la préversion sur iPhone, iPad ou Android.
          </p>
        </div>

        <div class="faq-list">
          <details class="faq-card" open>
            <summary class="faq-summary">
              <span>L'accès iOS TestFlight est-il immédiat après l'inscription ?</span>
              <svg class="faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <div class="faq-body">
              <p>Non : l'envoi du formulaire enregistre votre candidature iOS. Vous recevrez ensuite l'invitation officielle Apple TestFlight par e-mail dès que votre identifiant Apple aura été ajouté à la liste des testeurs.</p>
            </div>
          </details>

          <details class="faq-card">
            <summary class="faq-summary">
              <span>Comment rejoindre la bêta sur Android sans formulaire ?</span>
              <svg class="faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <div class="faq-body">
              <p>Pour Android, l'accès passe directement par le Google Group officiel Kanto puis par la validation sur Google Play, en utilisant la même adresse Google sur les deux étapes.</p>
            </div>
          </details>

          <details class="faq-card">
            <summary class="faq-summary">
              <span>Le programme de test est-il gratuit et utilisable hors-ligne ?</span>
              <svg class="faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <div class="faq-body">
              <p>Oui, Kanto MG est 100 % gratuit pendant le programme bêta et fonctionne sans publicité. Une fois les contenus synchronisés, la lecture des contes, proverbes et fiches reste accessible hors connexion.</p>
            </div>
          </details>

          <details class="faq-card">
            <summary class="faq-summary">
              <span>Comment mes données personnelles sont-elles protégées ?</span>
              <svg class="faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <div class="faq-body">
              <p>Votre adresse e-mail est chiffrée au repos (AES-256-GCM) et utilisée uniquement pour gérer votre accès TestFlight. Aucune donnée n'est vendue ou transmise à des régies publicitaires, et vous pouvez vous désinscrire à tout moment.</p>
            </div>
          </details>
        </div>
      </div>
    </section>
  </main>

  ${renderPublicFooter({
    legalBaseUrl,
    supportEmail,
    cookieButtonId: 'btn-cookie-settings',
    currentYear,
    isLanding: true,
  })}

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- BANDEAU & MODALES LÉGALES RGPD / CONFIRMATION                          -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <aside id="kanto-cookie-banner" class="cookie-banner" role="region" aria-label="Gestion des cookies" style="display: none;">
    <div class="cookie-banner-wrap">
      <div class="cookie-banner-text">
        <span class="cookie-banner-title">Respect de votre vie privée</span>
        <p class="cookie-banner-desc">Ce portail n'utilise que des traceurs techniques essentiels et la mémorisation de votre thème d'affichage. Aucun profilage publicitaire.</p>
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
        <p>Kanto MG limite strictement les traceurs locaux aux besoins techniques et à l'enregistrement de votre thème d'affichage (Clair / Sombre).</p>
        <div class="cookie-pref-row">
          <span>1. Fonctionnement technique indispensable</span>
          <span class="badge-status">Toujours actif</span>
        </div>
        <div class="cookie-pref-row">
          <label for="cookie-opt-preferences" style="cursor:pointer;">2. Mémorisation du thème d'affichage</label>
          <input type="checkbox" id="cookie-opt-preferences" checked>
        </div>
      </div>
      <div class="modal-foot">
        <button type="button" id="cookie-modal-btn-reject" class="btn-cookie secondary">Refuser</button>
        <button type="button" id="cookie-modal-btn-save" class="btn-cookie primary">Enregistrer mes choix</button>
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
        <p>En rejoignant le programme de test de Kanto MG, vous participez à l'amélioration d'un sanctuaire numérique consacré au patrimoine, aux contes (<em>Angano</em>), proverbes (<em>Ohabolana</em>) et à la langue malgaches.</p>
        <p>L'utilisation est entièrement gratuite et bénévole. Vous pouvez retirer votre participation à tout moment.</p>
        <p><a href="${legalBaseUrl}/pages/terms" target="_blank" rel="noopener noreferrer">Consulter l'intégralité des CGU ↗</a></p>
      </div>
      <div class="modal-foot">
        <button type="button" id="cgu-modal-btn-accept" class="btn-cookie primary">Fermer</button>
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
        <p>Votre adresse e-mail est chiffrée selon le standard AES-256-GCM et utilisée exclusivement pour préparer votre invitation Apple TestFlight (iOS). L'accès Android s'effectue directement via le Google Group officiel.</p>
        <p>Aucune donnée personnelle n'est cédée, vendue ou utilisée à des fins publicitaires.</p>
        <p><a href="${legalBaseUrl}/pages/privacy" target="_blank" rel="noopener noreferrer">Consulter la politique de confidentialité complète ↗</a></p>
      </div>
      <div class="modal-foot">
        <button type="button" id="privacy-modal-btn-accept" class="btn-cookie primary">Fermer</button>
      </div>
    </div>
  </div>

  <!-- Modale post-inscription explicitant l'ajout différé à Apple TestFlight -->
  <div class="modal-overlay" id="modal-registration-confirmed" role="dialog" aria-modal="true" aria-labelledby="modal-confirmed-title" style="display:none;">
    <div class="modal-dialog">
      <div class="modal-head">
        <div>
          <span class="confirmed-kicker">Demande iOS enregistrée</span>
          <h3 id="modal-confirmed-title">Votre inscription est bien prise en compte</h3>
        </div>
        <button type="button" class="btn-modal-close" id="confirmed-modal-close" aria-label="Fermer">✕</button>
      </div>
      <div class="modal-body">
        <div class="confirmed-notice">
          <strong>Accès non immédiat :</strong> l'enregistrement de votre demande ne débloque pas encore l'application automatiquement. Vous recevrez votre invitation d'activation par e-mail dès que votre compte Apple aura été ajouté au programme <strong>Apple TestFlight</strong>.
        </div>

        <ol class="confirmed-steps">
          <li><strong>01.</strong> Installez l'application gratuite <strong>Apple TestFlight</strong> sur votre iPhone ou iPad depuis l'App Store si ce n'est pas déjà fait.</li>
          <li><strong>02.</strong> Surveillez votre boîte de réception (et vos courriers indésirables) pour l'e-mail de confirmation et l'invitation d'activation TestFlight.</li>
          <li><strong>03.</strong> En cas de question ou si vous êtes déjà inscrit(e), écrivez-nous à <a href="mailto:${supportEmail}">${supportEmail}</a>.</li>
        </ol>
      </div>
      <div class="modal-foot">
        <button type="button" id="confirmed-modal-btn-ok" class="btn-cookie primary">J'ai compris</button>
      </div>
    </div>
  </div>
  `;
}
