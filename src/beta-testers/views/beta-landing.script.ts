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
  var detectedPlatform = 'ANDROID';
  var ua = navigator.userAgent || navigator.vendor || (window.opera ? '' : '');
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    detectedPlatform = 'IOS';
  } else if (/android/i.test(ua)) {
    detectedPlatform = 'ANDROID';
  }

  // Mise en exergue du badge "Votre appareil" sur les cartes correspondantes
  var recBadgeAndroid = document.getElementById('rec-badge-android');
  var recBadgeIos = document.getElementById('rec-badge-ios');
  if (detectedPlatform === 'IOS') {
    if (recBadgeIos) recBadgeIos.style.display = 'inline-flex';
    var cardConfirmIos = document.getElementById('card-confirm-ios');
    if (cardConfirmIos) cardConfirmIos.classList.add('is-detected');
    var cardDlIos = document.getElementById('card-download-ios');
    if (cardDlIos) cardDlIos.classList.add('is-detected');
  } else {
    if (recBadgeAndroid) recBadgeAndroid.style.display = 'inline-flex';
    var cardConfirmAndroid = document.getElementById('card-confirm-android');
    if (cardConfirmAndroid) cardConfirmAndroid.classList.add('is-detected');
    var cardDlAndroid = document.getElementById('card-download-android');
    if (cardDlAndroid) cardDlAndroid.classList.add('is-detected');
  }

  // ─── SÉLECTION DES PLATEFORMES DU FORMULAIRE D'INSCRIPTION ─────────────────
  var cardAndroid = document.getElementById('card-android');
  var cardIos = document.getElementById('card-ios');
  var selectedPlatforms = [detectedPlatform];

  function updatePlatformButtons() {
    if (cardAndroid) {
      var isAndroid = selectedPlatforms.indexOf('ANDROID') !== -1;
      cardAndroid.classList.toggle('checked', isAndroid);
      cardAndroid.setAttribute('aria-pressed', isAndroid ? 'true' : 'false');
    }
    if (cardIos) {
      var isIos = selectedPlatforms.indexOf('IOS') !== -1;
      cardIos.classList.toggle('checked', isIos);
      cardIos.setAttribute('aria-pressed', isIos ? 'true' : 'false');
    }
  }

  updatePlatformButtons();

  if (cardAndroid) {
    cardAndroid.addEventListener('click', function() {
      var idx = selectedPlatforms.indexOf('ANDROID');
      if (idx !== -1) {
        if (selectedPlatforms.length > 1) selectedPlatforms.splice(idx, 1);
      } else {
        selectedPlatforms.push('ANDROID');
      }
      updatePlatformButtons();
    });
  }

  if (cardIos) {
    cardIos.addEventListener('click', function() {
      var idx = selectedPlatforms.indexOf('IOS');
      if (idx !== -1) {
        if (selectedPlatforms.length > 1) selectedPlatforms.splice(idx, 1);
      } else {
        selectedPlatforms.push('IOS');
      }
      updatePlatformButtons();
    });
  }

  // Clic CTA En-tête « Rejoindre »
  var headerBtnReg = document.getElementById('header-btn-register');
  if (headerBtnReg) {
    headerBtnReg.addEventListener('click', function() {
      var regInput = document.getElementById('reg-email');
      if (regInput) setTimeout(function() { regInput.focus(); }, 150);
    });
  }

  // ─── PILIER A : SOUMISSION DU FORMULAIRE D'INSCRIPTION ─────────────────────
  var waitlistForm = document.getElementById('waitlist-form');
  var btnSubmitReg = document.getElementById('btn-submit-reg');
  var feedbackCard = document.getElementById('registration-feedback-card');
  var feedbackBadgeLabel = document.getElementById('feedback-badge-label');
  var feedbackTitle = document.getElementById('feedback-card-title');
  var feedbackDesc = document.getElementById('feedback-card-desc');
  var feedbackEmailDisp = document.getElementById('feedback-email-display');

  function displayFeedbackState(email, isAlreadyRegistered) {
    currentTesterEmail = email;
    try {
      localStorage.setItem('kanto_tester_email', email);
    } catch (e) {}

    if (feedbackEmailDisp) feedbackEmailDisp.innerText = email;

    if (feedbackCard) {
      feedbackCard.style.display = 'block';
      if (isAlreadyRegistered) {
        if (feedbackBadgeLabel) feedbackBadgeLabel.innerText = 'Testeur déjà inscrit';
        if (feedbackTitle) feedbackTitle.innerText = 'Vous faites déjà partie des testeurs Kanto MG';
        if (feedbackDesc) {
          feedbackDesc.innerHTML = 'Votre compte <strong>' + escapeHtml(email) + '</strong> est déjà enregistré. Suivez les étapes ci-dessous pour confirmer votre statut ou télécharger l’application :';
        }
      } else {
        if (feedbackBadgeLabel) feedbackBadgeLabel.innerText = 'Inscription confirmée';
        if (feedbackTitle) feedbackTitle.innerText = 'Bienvenue parmi les pionniers de Kanto MG';
        if (feedbackDesc) {
          feedbackDesc.innerHTML = 'Votre inscription pour <strong>' + escapeHtml(email) + '</strong> a bien été enregistrée. Deux étapes simples vous permettent d’accéder à l’application :';
        }
      }
      feedbackCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      if (selectedPlatforms.length === 0) {
        showError('Veuillez sélectionner au moins une plateforme (Android ou iOS).');
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
            platforms: selectedPlatforms,
            termsAccepted: true,
            website: website
          })
        });

        var data = await res.json();
        if (res.ok && data.success && !data.alreadyRegistered) {
          showSuccess('Inscription réussie ! Bienvenue parmi les testeurs.');
          var countBadge = document.getElementById('header-tester-count');
          if (countBadge) {
            var m = countBadge.innerText.match(/[0-9]+/);
            if (m) countBadge.innerText = (parseInt(m[0], 10) + 1) + ' testeurs pionniers';
          }
          displayFeedbackState(email, false);
        } else if (data.alreadyRegistered) {
          displayFeedbackState(email, true);
        } else {
          showError(data.message || 'Une erreur est survenue lors de l’inscription.');
        }
      } catch (err) {
        showError('Impossible de joindre le serveur. Veuillez vérifier votre connexion.');
      } finally {
        if (btnSubmitReg) {
          btnSubmitReg.disabled = false;
          btnSubmitReg.innerHTML = '<span>Rejoindre les testeurs</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
        }
      }
    });
  }

  // ─── PILIER B : VALIDATION DU STATUT DE TESTEUR ───────────────────────────
  function ensureTesterEmail() {
    if (currentTesterEmail && currentTesterEmail.indexOf('@') !== -1) {
      return currentTesterEmail;
    }
    var emailInput = document.getElementById('reg-email');
    if (emailInput && emailInput.value.trim() && emailInput.value.indexOf('@') !== -1) {
      currentTesterEmail = emailInput.value.trim();
      return currentTesterEmail;
    }
    return '';
  }

  async function notifyParticipation(btnEl, platformName) {
    var email = ensureTesterEmail();
    if (!email) {
      showError('Veuillez d’abord renseigner votre adresse e-mail dans le formulaire d’inscription ci-dessus.');
      var regInput = document.getElementById('reg-email');
      if (regInput) {
        regInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        regInput.focus();
      }
      return;
    }

    if (btnEl) {
      btnEl.disabled = true;
      btnEl.innerHTML = '<span>Enregistrement...</span>';
    }

    try {
      var res = await fetch('/api/beta-testers/confirm-participation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, action: 'JOINED' })
      });
      var data = await res.json();
      if (res.ok && data.success) {
        showSuccess('Statut de testeur validé avec succès sur ' + platformName + ' !');
        if (btnEl) {
          btnEl.classList.add('confirmed');
          btnEl.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>✓ Statut confirmé</span>';
        }
        var nextStep = document.getElementById('telechargement');
        if (nextStep) {
          setTimeout(function() {
            nextStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 400);
        }
      } else {
        showError(data.message || 'Impossible d’enregistrer la confirmation.');
        if (btnEl) {
          btnEl.disabled = false;
          btnEl.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>J\'ai confirmé mon statut</span>';
        }
      }
    } catch (err) {
      showError('Erreur de connexion lors de la confirmation.');
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>J\'ai confirmé mon statut</span>';
      }
    }
  }

  var btnConfirmAndroidJoined = document.getElementById('btn-confirm-android-joined');
  if (btnConfirmAndroidJoined) {
    btnConfirmAndroidJoined.addEventListener('click', function() {
      notifyParticipation(btnConfirmAndroidJoined, 'Google Play');
    });
  }

  var btnConfirmIosJoined = document.getElementById('btn-confirm-ios-joined');
  if (btnConfirmIosJoined) {
    btnConfirmIosJoined.addEventListener('click', function() {
      notifyParticipation(btnConfirmIosJoined, 'TestFlight');
    });
  }

  // ─── PILIER C : NOTIFICATION D'INSTALLATION DE L'APPLICATION ──────────────
  async function notifyInstalled(btnEl) {
    var email = ensureTesterEmail();
    if (!email) {
      showError('Veuillez d’abord renseigner votre adresse e-mail ci-dessus.');
      return;
    }

    if (btnEl) {
      btnEl.disabled = true;
      btnEl.innerHTML = '<span>Enregistrement...</span>';
    }

    try {
      var res = await fetch('/api/beta-testers/confirm-participation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, action: 'INSTALLED' })
      });
      var data = await res.json();
      if (res.ok && data.success) {
        showSuccess('Installation confirmée ! Merci beaucoup pour votre contribution au rayonnement culturel de Kanto.');
        if (btnEl) {
          btnEl.classList.add('confirmed');
          btnEl.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>✓ Application installée</span>';
        }
      } else {
        showError(data.message || 'Impossible d’enregistrer l’installation.');
        if (btnEl) {
          btnEl.disabled = false;
          btnEl.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg><span>J\'ai installé l\'application</span>';
        }
      }
    } catch (err) {
      showError('Erreur de connexion lors de la confirmation d’installation.');
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg><span>J\'ai installé l\'application</span>';
      }
    }
  }

  var btnInstalledAndroid = document.getElementById('btn-installed-android');
  if (btnInstalledAndroid) {
    btnInstalledAndroid.addEventListener('click', function() {
      notifyInstalled(btnInstalledAndroid);
    });
  }

  var btnInstalledIos = document.getElementById('btn-installed-ios');
  if (btnInstalledIos) {
    btnInstalledIos.addEventListener('click', function() {
      notifyInstalled(btnInstalledIos);
    });
  }

  // ─── SYNCHRONISATION DYNAMIQUE DES LIENS DE TÉLÉCHARGEMENT ────────────────
  async function loadDownloadInfo() {
    try {
      var res = await fetch('/api/beta-testers/download-info');
      if (!res.ok) return;
      var data = await res.json();

      if (data.android) {
        var aBtn = document.getElementById('dl-btn-android-main');
        var aBadge = document.getElementById('dl-android-badge');
        var aConfirmBtn = document.getElementById('confirm-link-google-play');
        if (aBtn && data.android.playStoreWebLink) {
          aBtn.href = data.android.playStoreWebLink;
        }
        if (aConfirmBtn && data.android.playStoreWebLink) {
          aConfirmBtn.href = data.android.playStoreWebLink;
        }
        if (aBadge && data.android.availability) {
          aBadge.innerText = (data.android.availability === 'PUBLIC') ? 'Google Play (Public)' : 'Google Play (Bêta)';
        }
      }

      if (data.ios) {
        var iBtn = document.getElementById('dl-btn-ios-main');
        var iBadge = document.getElementById('dl-ios-badge');
        var iConfirmBtn = document.getElementById('confirm-link-testflight');
        if (iBtn && data.ios.testFlightLink) {
          iBtn.href = data.ios.testFlightLink;
        }
        if (iConfirmBtn && data.ios.testFlightLink) {
          iConfirmBtn.href = data.ios.testFlightLink;
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

  // ─── INITIALISATION SI E-MAIL PRÉSENT DANS L'URL OU STOCKÉ ────────────────
  try {
    var qEmail = new URLSearchParams(window.location.search).get('email') || '';
    var initEmail = qEmail || currentTesterEmail;
    if (initEmail && initEmail.indexOf('@') !== -1) {
      var regInput = document.getElementById('reg-email');
      if (regInput && !regInput.value) {
        regInput.value = initEmail;
      }
      displayFeedbackState(initEmail, true);
    }
  } catch (e) {}

})();
  `.trim();
}
