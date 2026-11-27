import {
  PUBLIC_MODAL_A11Y_SCRIPT,
  PUBLIC_REVIEWS_SCRIPT,
} from '../../common/web/public-layout.js';

export function renderBetaWaitlistScript(): string {
  return `
(function() {
  'use strict';

  ${PUBLIC_MODAL_A11Y_SCRIPT}

  var errBanner = document.getElementById('error-banner');
  var errText = document.getElementById('error-text');
  var succBanner = document.getElementById('success-banner');
  var succText = document.getElementById('success-text');

  var currentTesterEmail = '';
  try {
    currentTesterEmail = localStorage.getItem('kanto_tester_email') || '';
  } catch (e) {}

  function displayFeedbackState(type, msg) {
    if (errBanner) errBanner.style.display = 'none';
    if (succBanner) succBanner.style.display = 'none';
    if (type === 'error' && errBanner && errText) {
      errText.innerText = msg || '';
      errBanner.style.display = 'flex';
      if (typeof errBanner.scrollIntoView === 'function') {
        errBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } else if (type === 'success' && succBanner && succText) {
      succText.innerText = msg || '';
      succBanner.style.display = 'flex';
      if (typeof succBanner.scrollIntoView === 'function') {
        succBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  function hideBanners() {
    displayFeedbackState('none', '');
  }

  function showError(msg) {
    displayFeedbackState('error', msg);
  }

  function openModal(modalEl, triggerEl) {
    if (!modalEl) return;
    if (typeof window !== 'undefined' && window.__kantoModalHelper) {
      window.__kantoModalHelper.open(modalEl, triggerEl);
    } else {
      modalEl.style.display = 'flex';
    }
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    if (typeof window !== 'undefined' && window.__kantoModalHelper) {
      window.__kantoModalHelper.close(modalEl);
    } else {
      modalEl.style.display = 'none';
    }
  }

  // ─── DÉTECTION AUTOMATIQUE DE LA PLATEFORME MOBILE ────────────────────────
  var detectedPlatform = 'IOS';
  var nav = typeof navigator !== 'undefined' ? navigator : null;
  var ua = nav ? (nav.userAgent || nav.vendor || '') : '';
  if (nav && (/iPad|iPhone|iPod/.test(ua) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1))) {
    detectedPlatform = 'IOS';
  } else if (/android/i.test(ua)) {
    detectedPlatform = 'ANDROID';
  }

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

  // ─── BASCULE PLATEFORME : ANDROID (GOOGLE GROUPS) VS IOS (TESTFLIGHT) ─────
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
      cardAndroid.setAttribute('aria-selected', isAndroid ? 'true' : 'false');
    }
    if (cardIos) {
      cardIos.classList.toggle('checked', isIos);
      cardIos.setAttribute('aria-pressed', isIos ? 'true' : 'false');
      cardIos.setAttribute('aria-selected', isIos ? 'true' : 'false');
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
      if (regInput) setTimeout(function() { regInput.focus(); }, 80);
    });
  }

  var headerBtnReg = document.getElementById('header-btn-register');
  if (headerBtnReg) {
    headerBtnReg.addEventListener('click', function() {
      if (activePlatform === 'IOS') {
        var regInput = document.getElementById('reg-email');
        if (regInput) setTimeout(function() { regInput.focus(); }, 150);
      }
    });
  }

  // ─── VALIDATION INLINE & SOUMISSION DU FORMULAIRE IOS ─────────────────────
  var emailEl = document.getElementById('reg-email');
  var fullNameEl = document.getElementById('reg-fullname');
  var cguEl = document.getElementById('consent-cgu');
  var emailErrEl = document.getElementById('reg-email-error');
  var cguErrEl = document.getElementById('consent-cgu-error');
  var btnSubmitReg = document.getElementById('btn-submit-reg');

  var modalConfirmed = document.getElementById('modal-registration-confirmed');
  var btnCloseConfirmed = document.getElementById('confirmed-modal-close');
  var btnOkConfirmed = document.getElementById('confirmed-modal-btn-ok');
  var cguModal = document.getElementById('kanto-cgu-modal');
  var privacyModal = document.getElementById('kanto-privacy-modal');
  var cookieModal = document.getElementById('kanto-cookie-modal');

  function setInlineError(inputEl, errorEl, msg) {
    if (errorEl) {
      errorEl.textContent = msg || '';
      errorEl.style.display = msg ? 'block' : 'none';
    }
    if (inputEl && typeof inputEl.setAttribute === 'function') {
      if (msg) inputEl.setAttribute('aria-invalid', 'true');
      else inputEl.removeAttribute('aria-invalid');
    }
  }

  function isValidEmailFormat(val) {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(val);
  }

  function validateEmailField() {
    var val = emailEl ? emailEl.value.trim() : '';
    if (!val) {
      setInlineError(emailEl, emailErrEl, 'Veuillez saisir votre adresse e-mail Apple.');
      return false;
    }
    if (!isValidEmailFormat(val)) {
      setInlineError(emailEl, emailErrEl, 'Ce format d’adresse e-mail semble invalide (ex. : prenom@icloud.com).');
      return false;
    }
    setInlineError(emailEl, emailErrEl, '');
    return true;
  }

  function validateConsentField() {
    var accepted = cguEl ? Boolean(cguEl.checked) : false;
    if (!accepted) {
      setInlineError(cguEl, cguErrEl, 'Veuillez cocher cette case pour accepter les CGU et la Politique de confidentialité.');
      return false;
    }
    setInlineError(cguEl, cguErrEl, '');
    return true;
  }

  if (emailEl) {
    emailEl.addEventListener('blur', function() {
      if (emailEl.value.trim()) validateEmailField();
    });
    emailEl.addEventListener('input', function() {
      if (emailErrEl && emailErrEl.style.display === 'block') validateEmailField();
    });
  }

  if (cguEl) {
    cguEl.addEventListener('change', function() {
      validateConsentField();
    });
  }

  if (btnCloseConfirmed) btnCloseConfirmed.addEventListener('click', function() { closeModal(modalConfirmed); });
  if (btnOkConfirmed) btnOkConfirmed.addEventListener('click', function() { closeModal(modalConfirmed); });
  if (modalConfirmed) {
    modalConfirmed.addEventListener('click', function(e) {
      if (e.target === modalConfirmed) closeModal(modalConfirmed);
    });
  }

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      hideBanners();

      var emailOk = validateEmailField();
      var consentOk = validateConsentField();
      if (!emailOk) {
        if (emailEl && typeof emailEl.focus === 'function') emailEl.focus();
        return;
      }
      if (!consentOk) {
        if (cguEl && typeof cguEl.focus === 'function') cguEl.focus();
        return;
      }

      var hpEl = document.getElementById('hp-website');
      var email = emailEl ? emailEl.value.trim() : '';
      var fullName = fullNameEl ? fullNameEl.value.trim() : '';
      var website = hpEl ? hpEl.value.trim() : '';

      var payload = {
        email: email,
        platforms: ['IOS'],
        termsAccepted: true,
        website: website
      };
      if (fullName) payload.fullName = fullName;

      if (btnSubmitReg) {
        btnSubmitReg.disabled = true;
        btnSubmitReg.innerHTML = '<span>Enregistrement de la demande...</span>';
      }

      try {
        var res = await fetch('/api/beta-testers/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        var data = null;
        try {
          data = await res.json();
        } catch (parseErr) {
          data = null;
        }

        if (res.ok && data && data.success) {
          hideBanners();
          if (emailEl) emailEl.value = '';
          if (fullNameEl) fullNameEl.value = '';
          if (hpEl) hpEl.value = '';
          setInlineError(emailEl, emailErrEl, '');
          setInlineError(cguEl, cguErrEl, '');
          activePlatform = 'IOS';
          updatePlatformButtons();

          var countBadge = document.getElementById('header-tester-count');
          if (countBadge) {
            var m = countBadge.innerText.match(/[0-9]+/);
            if (m) countBadge.innerText = (parseInt(m[0], 10) + 1) + ' testeurs pionniers';
          }

          openModal(modalConfirmed, btnSubmitReg);
        } else {
          var humanMsg = (data && typeof data.message === 'string' && !/^HTTP\\s/i.test(data.message))
            ? data.message
            : (data && Array.isArray(data.message) && data.message[0])
              ? data.message[0]
              : 'Nous n’avons pas pu enregistrer votre demande pour le moment. Vérifiez votre adresse e-mail ou réessayez dans un instant.';
          showError(humanMsg);
        }
      } catch (err) {
        showError('La connexion au serveur a échoué. Vérifiez votre accès Internet et réessayez.');
      } finally {
        if (btnSubmitReg) {
          btnSubmitReg.disabled = false;
          btnSubmitReg.innerHTML = '<span>Demander mon accès TestFlight (iOS)</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
        }
      }
    });
  }

  // ─── SYNCHRONISATION DES LIENS STORES DEPUIS L'API ─────────────────────────
  async function loadDownloadInfo() {
    try {
      var res = await fetch('/api/beta-testers/download-info');
      if (!res.ok) return;
      var data = await res.json();

      if (data.android) {
        var aPanelConfirmBtn = document.getElementById('btn-android-play-confirm');
        var aPanelDlBtn = document.getElementById('btn-android-play-download');
        var aConfirmBtn = document.getElementById('confirm-link-google-play');
        var aDlBtn = document.getElementById('dl-btn-android-main');
        var aBadge = document.getElementById('dl-android-badge');
        if (aPanelConfirmBtn && data.android.playStoreWebLink) {
          aPanelConfirmBtn.href = data.android.playStoreWebLink;
        }
        if (aPanelDlBtn && (data.android.playStoreAppLink || data.android.playStoreWebLink)) {
          aPanelDlBtn.href = data.android.playStoreAppLink || data.android.playStoreWebLink;
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
    } catch (err) {}
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

  // ─── MENU TIROIR MOBILE ACCESSIBLE ────────────────────────────────────────
  var mobileMenuBtn = document.getElementById('mobile-menu-toggle');
  var mobileMenuDrawer = document.getElementById('mobile-nav-drawer');
  function closeMobileDrawer() {
    if (mobileMenuDrawer && mobileMenuDrawer.classList.contains('open')) {
      mobileMenuDrawer.classList.remove('open');
      if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  }
  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener('click', function() {
      var isOpen = mobileMenuDrawer.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mobileMenuDrawer.addEventListener('click', function(e) {
      if (e.target && typeof e.target.closest === 'function' && e.target.closest('a')) {
        closeMobileDrawer();
      }
    });
  }

  // ─── MODALES CGU, CONFIDENTIALITÉ & COOKIES (ACCESSIBILITÉ CLAVIER) ───────
  var openCguBtn = document.getElementById('btn-open-cgu-modal');
  var closeCguBtn = document.getElementById('cgu-modal-close');
  var acceptCguBtn = document.getElementById('cgu-modal-btn-accept');
  var footerCguBtn = document.getElementById('footer-link-cgu');

  if (openCguBtn) openCguBtn.addEventListener('click', function(e) { e.preventDefault(); openModal(cguModal, openCguBtn); });
  if (footerCguBtn) footerCguBtn.addEventListener('click', function(e) { e.preventDefault(); openModal(cguModal, footerCguBtn); });
  if (closeCguBtn) closeCguBtn.addEventListener('click', function() { closeModal(cguModal); });
  if (acceptCguBtn) acceptCguBtn.addEventListener('click', function() { closeModal(cguModal); });
  if (cguModal) {
    cguModal.addEventListener('click', function(e) { if (e.target === cguModal) closeModal(cguModal); });
  }

  var openPrivBtn = document.getElementById('btn-open-privacy-modal');
  var closePrivBtn = document.getElementById('privacy-modal-close');
  var acceptPrivBtn = document.getElementById('privacy-modal-btn-accept');
  var footerPrivBtn = document.getElementById('footer-link-privacy');

  if (openPrivBtn) openPrivBtn.addEventListener('click', function(e) { e.preventDefault(); openModal(privacyModal, openPrivBtn); });
  if (footerPrivBtn) footerPrivBtn.addEventListener('click', function(e) { e.preventDefault(); openModal(privacyModal, footerPrivBtn); });
  if (closePrivBtn) closePrivBtn.addEventListener('click', function() { closeModal(privacyModal); });
  if (acceptPrivBtn) acceptPrivBtn.addEventListener('click', function() { closeModal(privacyModal); });
  if (privacyModal) {
    privacyModal.addEventListener('click', function(e) { if (e.target === privacyModal) closeModal(privacyModal); });
  }

  var cookieBanner = document.getElementById('kanto-cookie-banner');
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
      var c = localStorage.getItem('kanto_cookie_consent') || localStorage.getItem('kanto_cookie_consent_v1');
      if (!c && cookieBanner) cookieBanner.style.display = 'block';
    } catch (e) {}
  }

  function saveConsent(pref) {
    try {
      var payload = JSON.stringify({
        necessary: true,
        preferences: Boolean(pref),
        date: new Date().toISOString()
      });
      localStorage.setItem('kanto_cookie_consent', payload);
      localStorage.setItem('kanto_cookie_consent_v1', payload);
    } catch (e) {}
    if (cookieBanner) cookieBanner.style.display = 'none';
    closeModal(cookieModal);
  }

  window.KantoConsent = {
    checkConsent: checkConsent,
    saveConsent: saveConsent
  };

  if (btnAcceptAll) btnAcceptAll.addEventListener('click', function() { saveConsent(true); });
  if (btnRejectAll) btnRejectAll.addEventListener('click', function() { saveConsent(false); });
  if (btnCustomize) btnCustomize.addEventListener('click', function() { openModal(cookieModal, btnCustomize); });
  if (btnCookieSettings) btnCookieSettings.addEventListener('click', function(e) { e.preventDefault(); openModal(cookieModal, btnCookieSettings); });
  if (cookieModalClose) cookieModalClose.addEventListener('click', function() { closeModal(cookieModal); });
  if (cookieModalBtnReject) cookieModalBtnReject.addEventListener('click', function() { saveConsent(false); });
  if (cookieModalBtnSave) cookieModalBtnSave.addEventListener('click', function() { saveConsent(optPreferences ? optPreferences.checked : false); });
  if (cookieModal) {
    cookieModal.addEventListener('click', function(e) { if (e.target === cookieModal) closeModal(cookieModal); });
  }

  if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('keydown', function(e) {
      var allModals = [modalConfirmed, cguModal, privacyModal, cookieModal];
      if (e.key === 'Escape' || e.keyCode === 27) {
        closeMobileDrawer();
        allModals.forEach(function(m) {
          if (m && m.style.display === 'flex') closeModal(m);
        });
      } else if (e.key === 'Tab' && window.__kantoModalHelper) {
        allModals.forEach(function(m) {
          if (m && m.style.display === 'flex') window.__kantoModalHelper.trapTab(m, e);
        });
      }
    });
  }

  checkConsent();

  // ─── MODULE AVIS DE LA COMMUNAUTÉ (PARTAGÉ VIA PUBLIC-LAYOUT.TS) ──────────
  ${PUBLIC_REVIEWS_SCRIPT}

  // ─── PRÉ-REMPLISSAGE E-MAIL SI PRÉSENT DANS L'URL OU STOCKÉ ──────────────
  try {
    var qEmail = new URLSearchParams(window.location.search).get('email') || '';
    var initEmail = qEmail || currentTesterEmail;
    if (initEmail && initEmail.indexOf('@') !== -1 && emailEl && !emailEl.value) {
      emailEl.value = initEmail;
    }
  } catch (e) {}
})();
`;
}
