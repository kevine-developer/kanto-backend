import { PUBLIC_REVIEWS_SCRIPT } from '../../common/web/public-layout.js';

export function renderBetaWaitlistScript(): string {
  return `
(function() {
  'use strict';

  // ─── SÉLECTEURS PRINCIPAUX ────────────────────────────────────────────────
  var errBanner = document.getElementById('error-banner');
  var errText = document.getElementById('error-text');
  var succBanner = document.getElementById('success-banner');
  var succText = document.getElementById('success-text');

  var currentTesterEmail = '';
  try {
    currentTesterEmail = localStorage.getItem('kanto_tester_email') || '';
  } catch (e) {}

  // ─── GESTION DES NOTIFICATIONS & BANNIÈRES ────────────────────────────────
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

  // ─── DÉTECTION AUTOMATIQUE DE LA PLATEFORME (OS MOBILE) ───────────────────
  var detectedPlatform = 'IOS';
  var nav = typeof navigator !== 'undefined' ? navigator : null;
  var ua = nav ? (nav.userAgent || nav.vendor || '') : '';
  if (nav && (/iPad|iPhone|iPod/.test(ua) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1))) {
    detectedPlatform = 'IOS';
  } else if (/android/i.test(ua)) {
    detectedPlatform = 'ANDROID';
  }

  // Mise en exergue du badge "Votre appareil" sur les cartes correspondantes
  var recBadgeAndroid = document.getElementById('rec-badge-android');
  var recBadgeIos = document.getElementById('rec-badge-ios');
  if (detectedPlatform === 'IOS' && /iPad|iPhone|iPod|MacIntel/.test(ua)) {
    if (recBadgeIos) recBadgeIos.style.display = 'inline-flex';
    var cardDlIos = document.getElementById('card-download-ios');
    if (cardDlIos) cardDlIos.classList.add('is-detected');
  } else if (/android/i.test(ua)) {
    if (recBadgeAndroid) recBadgeAndroid.style.display = 'inline-flex';
    var cardDlAndroid = document.getElementById('card-download-android');
    if (cardDlAndroid) cardDlAndroid.classList.add('is-detected');
  }

  // ─── BASCULE PLATEFORME : ANDROID (GOOGLE GROUPS) VS IOS (FORMULAIRE) ─────
  var cardAndroid = document.getElementById('card-android');
  var cardIos = document.getElementById('card-ios');
  var androidPanel = document.getElementById('android-group-panel');
  var waitlistForm = document.getElementById('waitlist-form');
  var activePlatform = detectedPlatform;

  function updatePlatformButtons() {
    var isAndroid = activePlatform === 'ANDROID';
    var isIos = activePlatform === 'IOS';

    if (cardAndroid) {
      cardAndroid.classList.toggle('checked', isAndroid);
      cardAndroid.setAttribute('aria-pressed', isAndroid ? 'true' : 'false');
    }
    if (cardIos) {
      cardIos.classList.toggle('checked', isIos);
      cardIos.setAttribute('aria-pressed', isIos ? 'true' : 'false');
    }
    if (androidPanel) {
      androidPanel.style.display = isAndroid ? 'block' : 'none';
    }
    if (waitlistForm) {
      waitlistForm.style.display = isIos ? 'flex' : 'none';
    }
  }

  updatePlatformButtons();

  if (cardAndroid) {
    cardAndroid.addEventListener('click', function() {
      activePlatform = 'ANDROID';
      hideBanners();
      updatePlatformButtons();
    });
  }

  if (cardIos) {
    cardIos.addEventListener('click', function() {
      activePlatform = 'IOS';
      hideBanners();
      updatePlatformButtons();
      var regInput = document.getElementById('reg-email');
      if (regInput) setTimeout(function() { regInput.focus(); }, 100);
    });
  }

  // Clic CTA En-tête « Rejoindre »
  var headerBtnReg = document.getElementById('header-btn-register');
  if (headerBtnReg) {
    headerBtnReg.addEventListener('click', function() {
      if (activePlatform === 'IOS') {
        var regInput = document.getElementById('reg-email');
        if (regInput) setTimeout(function() { regInput.focus(); }, 150);
      }
    });
  }

  // ─── PILIER A : SOUMISSION DU FORMULAIRE D'INSCRIPTION (IOS UNIQUEMENT) ────
  var btnSubmitReg = document.getElementById('btn-submit-reg');
  var modalConfirmed = document.getElementById('modal-registration-confirmed');
  var btnCloseConfirmed = document.getElementById('confirmed-modal-close');
  var btnOkConfirmed = document.getElementById('confirmed-modal-btn-ok');

  function openConfirmedModal() {
    if (modalConfirmed) {
      modalConfirmed.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeConfirmedModal() {
    if (modalConfirmed) {
      modalConfirmed.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  if (btnCloseConfirmed) btnCloseConfirmed.addEventListener('click', closeConfirmedModal);
  if (btnOkConfirmed) btnOkConfirmed.addEventListener('click', closeConfirmedModal);
  if (modalConfirmed) {
    modalConfirmed.addEventListener('click', function(e) {
      if (e.target === modalConfirmed) closeConfirmedModal();
    });
  }

  // Fonction de feedback sobre vers la modale (sans carte verbeuse)
  function displayFeedbackState(email) {
    openConfirmedModal();
  }

  // Fermeture des modales avec la touche Échap
  if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        closeConfirmedModal();
      }
    });
  }

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      hideBanners();

      var emailEl = document.getElementById('reg-email');
      var cguEl = document.getElementById('consent-cgu');
      var hpEl = document.getElementById('hp-website');

      var email = emailEl ? emailEl.value.trim() : '';
      var termsAccepted = cguEl ? cguEl.checked : true;
      var website = hpEl ? hpEl.value.trim() : '';

      if (!email || email.indexOf('@') === -1) {
        showError('Veuillez saisir une adresse e-mail valide.');
        return;
      }
      if (!termsAccepted) {
        showError('Veuillez accepter les Conditions Générales et la Politique de Confidentialité.');
        return;
      }

      if (btnSubmitReg) {
        btnSubmitReg.disabled = true;
        btnSubmitReg.innerHTML = '<span>Inscription en cours...</span>';
      }

      try {
        var res = await fetch('/api/beta-testers/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            platforms: ['IOS'],
            termsAccepted: true,
            website: website
          })
        });

        var data = await res.json();
        if (res.ok && data.success) {
          hideBanners();

          // 1. Vidage et réinitialisation complète du formulaire
          if (emailEl) emailEl.value = '';
          if (hpEl) hpEl.value = '';
          activePlatform = 'IOS';
          updatePlatformButtons();

          // 2. Mise à jour discrète du compteur de testeurs
          var countBadge = document.getElementById('header-tester-count');
          if (countBadge) {
            var m = countBadge.innerText.match(/[0-9]+/);
            if (m) countBadge.innerText = (parseInt(m[0], 10) + 1) + ' testeurs pionniers';
          }

          // 3. Affichage sobre de la modale de confirmation (sans carte de détails verbeuse)
          openConfirmedModal();
        } else {
          showError(data.message || 'Une erreur est survenue lors de l’inscription.');
        }
      } catch (err) {
        showError('Impossible de joindre le serveur. Veuillez vérifier votre connexion.');
      } finally {
        if (btnSubmitReg) {
          btnSubmitReg.disabled = false;
          btnSubmitReg.innerHTML = '<span>Recevoir l’invitation TestFlight (iOS)</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
        }
      }
    });
  }

  // ─── PILIER B : VALIDATION DU STATUT DE TESTEUR ───────────────────────────
  // ─── SYNCHRONISATION DYNAMIQUE DES LIENS DE TÉLÉCHARGEMENT ────────────────
  async function loadDownloadInfo() {
    try {
      var res = await fetch('/api/beta-testers/download-info');
      if (!res.ok) return;
      var data = await res.json();

      if (data.android) {
        var aPanelConfirmBtn = document.getElementById('btn-android-play-confirm');
        var aConfirmBtn = document.getElementById('confirm-link-google-play');
        var aDlBtn = document.getElementById('dl-btn-android-main');
        var aBadge = document.getElementById('dl-android-badge');
        if (aPanelConfirmBtn && data.android.playStoreWebLink) {
          aPanelConfirmBtn.href = data.android.playStoreWebLink;
        }
        if (aConfirmBtn && data.android.playStoreWebLink) {
          aConfirmBtn.href = data.android.playStoreWebLink;
        }
        if (aDlBtn && (data.android.playStoreAppLink || data.android.playStoreWebLink)) {
          aDlBtn.href = data.android.playStoreAppLink || data.android.playStoreWebLink;
        }
        if (aBadge && data.android.availability) {
          aBadge.innerText = (data.android.availability === 'PUBLIC') ? 'Google Play (Public)' : 'Google Play (Bêta)';
        }
      }

      if (data.ios) {
        var iInstallBtn = document.getElementById('install-link-testflight');
        var iDlBtn = document.getElementById('dl-btn-ios-main');
        var iBadge = document.getElementById('dl-ios-badge');
        if (iInstallBtn && data.ios.appStoreLink) {
          iInstallBtn.href = data.ios.appStoreLink;
        }
        if (iDlBtn && data.ios.testFlightLink) {
          iDlBtn.href = data.ios.testFlightLink;
        }
        if (iBadge && data.ios.availability) {
          iBadge.innerText = (data.ios.availability === 'PUBLIC') ? 'App Store (Public)' : 'Apple TestFlight';
        }
      }
    } catch (err) {
      // Les liens statiques par défaut dans le HTML restent opérationnels
    }
  }

  loadDownloadInfo();

  // ─── GESTION DU THÈME CLAIR / SOMBRE ──────────────────────────────────────
  var themeToggle = document.getElementById('theme-toggle');
  var iconSun = document.getElementById('theme-icon-sun');
  var iconMoon = document.getElementById('theme-icon-moon');

  function updateThemeIcons(theme) {
    if (iconSun && iconMoon) {
      iconSun.style.display = (theme === 'dark') ? 'none' : 'block';
      iconMoon.style.display = (theme === 'dark') ? 'block' : 'none';
    }
  }

  var curTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  updateThemeIcons(curTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      var now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', now);
      try {
        localStorage.setItem('kanto_theme', now);
      } catch (e) {}
      updateThemeIcons(now);
      var metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute('content', now === 'light' ? '#F5F4F0' : '#0D0D0B');
    });
  }

  // ─── MENU DE NAVIGATION MOBILE ───────────────────────────────────────────
  var mobileMenuBtn = document.getElementById('mobile-menu-toggle');
  var mobileMenuDrawer = document.getElementById('mobile-nav-drawer');
  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener('click', function() {
      var isOpen = mobileMenuDrawer.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // ─── MODALES CGU & POLITIQUE DE CONFIDENTIALITÉ ──────────────────────────
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

  // ─── GESTION DES COOKIES (KantoConsent) ───────────────────────────────────
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

  // ─── UTILITAIRE ÉCHAPPEMENT HTML ──────────────────────────────────────────
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- MODULE AVIS DE LA COMMUNAUTÉ (PARTAGÉ VIA PUBLIC-LAYOUT.TS) ---
  ${PUBLIC_REVIEWS_SCRIPT}

  // ─── INITIALISATION SI E-MAIL PRÉSENT DANS L'URL OU STOCKÉ ────────────────
  try {
    var qEmail = new URLSearchParams(window.location.search).get('email') || '';
    var initEmail = qEmail || currentTesterEmail;
    if (initEmail && initEmail.indexOf('@') !== -1) {
      var regInput = document.getElementById('reg-email');
      if (regInput && !regInput.value) {
        regInput.value = initEmail;
      }
    }
  } catch (e) {}

})();
  `.trim();
}
