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

  // ─── GESTION DES BANNIÈRES DE NOTIFICATION ─────────────────────────────────
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

  // ─── TRANSITIONS ET SCROLL VERS L'ESPACE TESTEUR EXISTANT ───────────────
  function scrollToStatusCheck(email) {
    var el = document.getElementById('deja-inscrit');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    var chkInput = document.getElementById('check-email-input');
    if (chkInput) {
      if (email) chkInput.value = email;
      setTimeout(function() { chkInput.focus(); }, 250);
    }
  }

  // Clic sur « Déjà inscrit comme testeur ? Consulter ou confirmer mon statut ↓ »
  var linkOpenAlready = document.getElementById('link-open-already');
  if (linkOpenAlready) {
    linkOpenAlready.addEventListener('click', function(e) {
      if (e) e.preventDefault();
      scrollToStatusCheck();
    });
  }

  // Clic CTA En-tête « Devenir testeur »
  var headerBtnReg = document.getElementById('header-btn-register');
  if (headerBtnReg) {
    headerBtnReg.addEventListener('click', function() {
      var regInput = document.getElementById('reg-email');
      if (regInput) setTimeout(function() { regInput.focus(); }, 200);
    });
  }

  // ─── SÉLECTION TACTILE DES PLATEFORMES (ANDROID / IOS) ────────────────────
  var cardAndroid = document.getElementById('card-android');
  var cardIos = document.getElementById('card-ios');
  var selectedPlatforms = ['ANDROID'];

  function highlightConfirmButtons(platforms) {
    var playBtn = document.getElementById('confirm-link-google-play');
    var tfBtn = document.getElementById('confirm-link-testflight');
    if (playBtn) playBtn.classList.remove('active-target');
    if (tfBtn) tfBtn.classList.remove('active-target');

    var list = platforms || selectedPlatforms;
    if (list.indexOf('ANDROID') !== -1 && playBtn) {
      playBtn.classList.add('active-target');
    }
    if (list.indexOf('IOS') !== -1 && tfBtn) {
      tfBtn.classList.add('active-target');
    }
  }

  function updatePlatformCards() {
    if (cardAndroid) {
      cardAndroid.classList.toggle('checked', selectedPlatforms.indexOf('ANDROID') !== -1);
    }
    if (cardIos) {
      cardIos.classList.toggle('checked', selectedPlatforms.indexOf('IOS') !== -1);
    }
    highlightConfirmButtons(selectedPlatforms);
  }

  // Initialisation de la mise en valeur des liens de confirmation selon la plateforme par défaut
  highlightConfirmButtons(selectedPlatforms);

  if (cardAndroid) {
    cardAndroid.addEventListener('click', function() {
      var idx = selectedPlatforms.indexOf('ANDROID');
      if (idx !== -1) {
        if (selectedPlatforms.length > 1) selectedPlatforms.splice(idx, 1);
      } else {
        selectedPlatforms.push('ANDROID');
      }
      updatePlatformCards();
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
      updatePlatformCards();
    });
  }

  // ─── 1. SOUMISSION DU FORMULAIRE D'INSCRIPTION ─────────────────────────────
  var waitlistForm = document.getElementById('waitlist-form');
  var btnSubmitReg = document.getElementById('btn-submit-reg');

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      hideBanners();

      var emailEl = document.getElementById('reg-email');
      var nameEl = document.getElementById('reg-name');
      var cguEl = document.getElementById('consent-cgu');
      var privEl = document.getElementById('consent-privacy');
      var hpEl = document.getElementById('hp-website');

      var email = emailEl ? emailEl.value.trim() : '';
      var fullName = nameEl ? nameEl.value.trim() : '';
      var termsAccepted = (cguEl && cguEl.checked) && (privEl && privEl.checked);
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
        showError('Veuillez sélectionner au moins une plateforme (Android ou iPhone/iOS).');
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
            fullName: fullName || undefined,
            platforms: selectedPlatforms,
            termsAccepted: true,
            website: website
          })
        });

        var data = await res.json();
        if (res.ok && data.success && !data.alreadyRegistered) {
          showSuccess('Candidature enregistrée avec succès ! Bienvenue parmi les testeurs de Kanto MG.');
          var countBadge = document.getElementById('header-tester-count');
          if (countBadge) {
            var m = countBadge.innerText.match(/[0-9]+/);
            if (m) countBadge.innerText = (parseInt(m[0], 10) + 1) + ' testeurs inscrits';
          }
          // Défilement automatique vers le formulaire en bas
          scrollToStatusCheck(email);
          verifyEmail(email);
        } else if (data.alreadyRegistered) {
          showError('Cette adresse e-mail est déjà inscrite. Consultation de votre statut en cours...');
          scrollToStatusCheck(email);
          verifyEmail(email);
        } else {
          showError(data.message || 'Une erreur est survenue lors de l’inscription.');
        }
      } catch (err) {
        showError('Impossible de joindre le serveur. Veuillez vérifier votre connexion.');
      } finally {
        if (btnSubmitReg) {
          btnSubmitReg.disabled = false;
          btnSubmitReg.innerHTML = '<span>Devenir testeur</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
        }
      }
    });
  }

  // ─── 2. VÉRIFICATION DU STATUT ET CONSULTATION DE L'ESPACE TESTEUR ─────────
  var checkStatusForm = document.getElementById('check-status-form');
  var btnSubmitCheck = document.getElementById('btn-submit-check');

  function maskEmailClient(em) {
    if (!em || em.indexOf('@') === -1) return em || '—';
    var parts = em.split('@');
    var user = parts[0];
    var domain = parts[1];
    var masked = user.length <= 2 
      ? user.charAt(0) + '***' 
      : (user.length <= 4 ? user.substring(0, 2) + '***' : user.substring(0, 3) + '***');
    return masked + '@' + domain;
  }

  async function verifyEmail(email) {
    hideBanners();
    if (btnSubmitCheck) {
      btnSubmitCheck.disabled = true;
      btnSubmitCheck.innerText = 'Vérification...';
    }

    try {
      var res = await fetch('/api/beta-testers/verify-participation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });
      var data = await res.json();

      if (!res.ok || !data.exists) {
        showError(data.message || 'Aucune inscription trouvée pour cette adresse.');
        return;
      }

      currentTesterEmail = email;
      var box = document.getElementById('status-result-box');
      if (box) box.style.display = 'block';

      // Affichage de l'email
      var lbl = document.getElementById('tester-email-lbl');
      if (lbl) {
        var displayEmail = (data.tester && (data.tester.maskedEmail || data.tester.email)) 
          ? (data.tester.maskedEmail || data.tester.email) 
          : maskEmailClient(email);
        lbl.innerText = displayEmail;
      }

      var tester = data.tester;
      var cStatus = (tester && tester.confirmationStatus) ? tester.confirmationStatus : 'INSCRIT';

      // Badge de statut
      var sBadge = document.getElementById('tester-status-badge');
      if (sBadge) {
        sBadge.innerText = (
          cStatus === 'INSTALLE' ? 'INSTALLATION CONFIRMÉE' :
          cStatus === 'CONFIRME' || cStatus === 'VERIFIE' ? 'ACCÈS VALIDÉ' :
          cStatus === 'EN_ATTENTE' ? 'EN ATTENTE' : 'INSCRIPTION ACTIVE'
        );
      }

      // Actions de confirmation
      var btnJoined = document.getElementById('btn-confirm-joined');
      var btnInstalled = document.getElementById('btn-confirm-installed');
      var actionTitle = document.getElementById('action-box-title');
      var actionDesc = document.getElementById('action-box-desc');

      if (cStatus === 'INSTALLE') {
        if (actionTitle) actionTitle.innerText = 'Application Kanto MG installée !';
        if (actionDesc) actionDesc.innerText = 'Merci pour votre précieuse contribution ! Explorez l’application et partagez vos remarques avec l’équipe.';
        if (btnJoined) btnJoined.style.display = 'none';
        if (btnInstalled) btnInstalled.style.display = 'none';
      } else if (cStatus === 'CONFIRME' || cStatus === 'VERIFIE') {
        if (actionTitle) actionTitle.innerText = 'Participation confirmée au programme !';
        if (actionDesc) actionDesc.innerText = 'Votre accès est validé. Une fois l’application téléchargée sur votre téléphone, confirmez l’installation ci-dessous.';
        if (btnJoined) btnJoined.style.display = 'none';
        if (btnInstalled) btnInstalled.style.display = 'inline-flex';
      } else {
        if (actionTitle) actionTitle.innerText = 'Valider votre participation au programme';
        if (actionDesc) actionDesc.innerText = 'Dès que vous avez rejoint le groupe ou accepté l’invitation, cliquez sur le bouton ci-dessous pour confirmer.';
        if (btnJoined) btnJoined.style.display = 'inline-flex';
        if (btnInstalled) btnInstalled.style.display = 'none';
      }

      // Liens débloqués pour Android et iOS
      var platforms = (tester && tester.platforms) ? tester.platforms : ['ANDROID'];
      var hasAndroid = platforms.indexOf('ANDROID') !== -1;
      var hasIos = platforms.indexOf('IOS') !== -1;

      var cardStatusAndroid = document.getElementById('card-status-android');
      var linkPlayWeb = document.getElementById('link-play-web');
      if (cardStatusAndroid) {
        cardStatusAndroid.style.display = hasAndroid ? 'block' : 'none';
        if (linkPlayWeb && data.links && data.links.androidWeb) {
          linkPlayWeb.href = data.links.androidWeb;
        }
      }

      var cardStatusIos = document.getElementById('card-status-ios');
      var linkTestflight = document.getElementById('link-testflight');
      if (cardStatusIos) {
        cardStatusIos.style.display = hasIos ? 'block' : 'none';
        if (linkTestflight && data.links && data.links.testFlight) {
          linkTestflight.href = data.links.testFlight;
        }
      }

      // Synchronisation et mise en exergue des boutons directs de confirmation supérieure
      var topPlayBtn = document.getElementById('confirm-link-google-play');
      var topTfBtn = document.getElementById('confirm-link-testflight');
      if (topPlayBtn && data.links && data.links.androidWeb) {
        topPlayBtn.href = data.links.androidWeb;
      }
      if (topTfBtn && data.links && data.links.testFlight) {
        topTfBtn.href = data.links.testFlight;
      }
      highlightConfirmButtons(platforms);

    } catch (err) {
      showError('Erreur lors de la vérification de votre espace personnel.');
    } finally {
      if (btnSubmitCheck) {
        btnSubmitCheck.disabled = false;
        btnSubmitCheck.innerText = 'Vérifier mon statut';
      }
    }
  }

  if (checkStatusForm) {
    checkStatusForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = document.getElementById('check-email-input');
      var email = input ? input.value.trim() : '';
      if (email) verifyEmail(email);
    });
  }

  // ─── 3. ACTIONS DE CONFIRMATION DE PARTICIPATION ───────────────────────────
  var btnConfirmJoined = document.getElementById('btn-confirm-joined');
  if (btnConfirmJoined) {
    btnConfirmJoined.addEventListener('click', async function() {
      if (!currentTesterEmail) {
        showError('Veuillez d’abord renseigner votre adresse e-mail.');
        return;
      }
      btnConfirmJoined.disabled = true;
      btnConfirmJoined.innerText = 'Validation en cours...';
      try {
        var res = await fetch('/api/beta-testers/confirm-participation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currentTesterEmail, action: 'JOINED' })
        });
        var data = await res.json();
        if (res.ok && data.success) {
          showSuccess('Votre participation est confirmée ! Vous pouvez maintenant installer Kanto MG.');
          verifyEmail(currentTesterEmail);
        } else {
          showError(data.message || 'Impossible de confirmer votre participation.');
        }
      } catch (err) {
        showError('Erreur lors de la confirmation. Vérifiez votre connexion.');
      } finally {
        btnConfirmJoined.disabled = false;
        btnConfirmJoined.innerText = 'Confirmer ma participation';
      }
    });
  }

  var btnConfirmInstalled = document.getElementById('btn-confirm-installed');
  if (btnConfirmInstalled) {
    btnConfirmInstalled.addEventListener('click', async function() {
      if (!currentTesterEmail) return;
      btnConfirmInstalled.disabled = true;
      btnConfirmInstalled.innerText = 'Enregistrement...';
      try {
        var res = await fetch('/api/beta-testers/confirm-participation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currentTesterEmail, action: 'INSTALLED' })
        });
        var data = await res.json();
        if (res.ok && data.success) {
          showSuccess('Installation confirmée ! Excellente exploration de la culture malgache dans Kanto MG.');
          verifyEmail(currentTesterEmail);
        } else {
          showError(data.message || 'Impossible d’enregistrer l’installation.');
        }
      } catch (err) {
        showError('Erreur lors de l’enregistrement de l’installation.');
      } finally {
        btnConfirmInstalled.disabled = false;
        btnConfirmInstalled.innerText = "J'ai installé l'application";
      }
    });
  }

  // ─── 4. SYNCHRONISATION DYNAMIQUE DES LIENS DE TÉLÉCHARGEMENT (ZONE 3) ─────
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
          aBadge.innerText = (data.android.availability === 'PUBLIC') ? 'Version Publique' : 'Programme Bêta Ouvert';
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
          iBadge.innerText = (data.ios.availability === 'PUBLIC') ? 'App Store' : 'Apple TestFlight';
        }
      }
    } catch (err) {
      // Les liens statiques par défaut dans le HTML restent opérationnels
    }
  }

  loadDownloadInfo();

  // ─── 5. GESTION DU THÈME CLAIR / SOMBRE ───────────────────────────────────
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

  // ─── 6. MODALES CGU & POLITIQUE DE CONFIDENTIALITÉ ───────────────────────
  var cguModal = document.getElementById('kanto-cgu-modal') || document.getElementById('modal-cgu');
  var openCguBtn = document.getElementById('btn-open-cgu-modal');
  var closeCguBtn = document.getElementById('cgu-modal-close') || document.getElementById('btn-close-cgu-modal');
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

  var privacyModal = document.getElementById('kanto-privacy-modal') || document.getElementById('modal-privacy');
  var openPrivBtn = document.getElementById('btn-open-privacy-modal');
  var closePrivBtn = document.getElementById('privacy-modal-close') || document.getElementById('btn-close-privacy-modal');
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

  // ─── 7. GESTION DES COOKIES (KantoConsent) ────────────────────────────────
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

  // ─── PROTECTION XSS CLIENT POUR LE RENDU DYNAMIQUE ───
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- MODULE AVIS DE LA COMMUNAUTÉ (OPTIONNEL, ACTIF UNIQUEMENT SI LE CONTENEUR EXISTE) ---
  (function initCommunityReviews() {
    var avgScoreEl = document.getElementById('reviews-avg-rating');
    var avgStarsEl = document.getElementById('reviews-avg-stars');
    var totalCountEl = document.getElementById('reviews-total-count');
    var cardsListEl = document.getElementById('reviews-cards-list');
    var paginationBox = document.getElementById('reviews-pagination-box');
    var btnLoadMore = document.getElementById('btn-load-more-reviews');

    if (!cardsListEl) return;

    var currentPage = 1;
    var totalPages = 1;
    var isLoadingReviews = false;

    function renderStarSvg(filled) {
      return '<svg width="15" height="15" viewBox="0 0 24 24" class="' + (filled ? 'star-icon-filled' : 'star-icon-empty') + '" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    }

    function renderStarsRow(rating) {
      var html = '';
      for (var i = 1; i <= 5; i++) {
        html += renderStarSvg(i <= Math.round(rating));
      }
      return html;
    }

    function formatDate(dateStr) {
      try {
        var d = new Date(dateStr);
        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
      } catch(e) {
        return '';
      }
    }

    function getInitials(name) {
      if (!name) return 'K';
      var parts = name.trim().split(/\s+/);
      if (parts.length >= 2 && parts[0] && parts[1]) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }

    function loadStats() {
      fetch('/api/reviews/public/stats')
        .then(function(res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
        .then(function(stats) {
          if (!stats || typeof stats.totalReviews !== 'number') return;
          var total = stats.totalReviews;
          if (avgScoreEl) {
            avgScoreEl.textContent = total > 0 ? stats.averageRating.toFixed(1).replace('.', ',') : '5,0';
          }
          if (avgStarsEl) {
            avgStarsEl.innerHTML = renderStarsRow(total > 0 ? stats.averageRating : 5);
          }
          if (totalCountEl) {
            totalCountEl.textContent = total > 0 
              ? total + ' avis certifié' + (total > 1 ? 's' : '') + ' (4★ et 5★)' 
              : 'Avis 4★ et 5★ certifiés';
          }
        })
        .catch(function(err) {
          console.warn('[Reviews] Erreur chargement stats:', err);
        });
    }

    function loadReviews(page, append) {
      if (isLoadingReviews) return;
      isLoadingReviews = true;

      var url = '/api/reviews/public?page=' + page + '&limit=6&minRating=4';

      fetch(url)
        .then(function(res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
        .then(function(res) {
          isLoadingReviews = false;
          var items = res.data || [];
          totalPages = res.pagination ? res.pagination.totalPages : 1;
          currentPage = page;

          if (!append) {
            cardsListEl.innerHTML = '';
          }

          if (items.length === 0 && !append) {
            cardsListEl.innerHTML = '<div class="reviews-empty-state">Aucun avis 4 ou 5 étoiles disponible pour le moment.</div>';
            if (paginationBox) paginationBox.style.display = 'none';
            return;
          }

          items.forEach(function(item) {
            var card = document.createElement('div');
            card.className = 'review-card-item';
            
            var name = item.publicDisplayName || 'Membre de la communauté';
            var initials = getInitials(name);
            var versionBadge = item.appVersion ? '<span class="review-card-version">v' + escapeHtml(item.appVersion) + '</span>' : '';
            var dateFormatted = formatDate(item.createdAt);

            card.innerHTML = 
              '<div class="review-card-head">' +
                '<div class="review-card-stars">' + renderStarsRow(item.rating) + '</div>' +
                '<div class="review-card-badge-verified">' +
                  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
                  '<span>Vérifié</span>' +
                '</div>' +
              '</div>' +
              '<p class="review-card-comment">« ' + escapeHtml(item.comment) + ' »</p>' +
              '<div class="review-card-footer">' +
                '<div class="review-author-group">' +
                  '<div class="review-avatar-circle">' + escapeHtml(initials) + '</div>' +
                  '<div class="review-author-meta">' +
                    '<span class="review-card-author">' + escapeHtml(name) + '</span>' +
                    '<span class="review-card-date">' + dateFormatted + '</span>' +
                  '</div>' +
                '</div>' +
                versionBadge +
              '</div>';

            cardsListEl.appendChild(card);
          });

          if (paginationBox) {
            paginationBox.style.display = (currentPage < totalPages) ? 'block' : 'none';
          }
        })
        .catch(function(err) {
          isLoadingReviews = false;
          console.warn('[Reviews] Erreur chargement avis:', err);
          if (!append) {
            cardsListEl.innerHTML = '<div class="reviews-empty-state">Impossible de charger les avis. Réessayez ultérieurement.</div>';
          }
        });
    }

    if (btnLoadMore) {
      btnLoadMore.addEventListener('click', function() {
        if (currentPage < totalPages) {
          loadReviews(currentPage + 1, true);
        }
      });
    }

    loadStats();
    loadReviews(1, false);
  })();

  // ─── 8. INITIALISATION AUTOMATIQUE SI E-MAIL PRÉSENT DANS L'URL ───────────
  try {
    var qEmail = new URLSearchParams(window.location.search).get('email') || '';
    var chkInput = document.getElementById('check-email-input');
    var initEmail = qEmail || (chkInput ? chkInput.value.trim() : '');
    if (initEmail && initEmail.indexOf('@') !== -1) {
      if (chkInput) chkInput.value = initEmail;
      verifyEmail(initEmail);
    }
  } catch (e) {}

})();
  `.trim();
}
