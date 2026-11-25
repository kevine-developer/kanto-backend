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

  // --- MODULE AVIS DE LA COMMUNAUTÉ (ACTIF SI LE CONTENEUR EXISTE DANS LE DOM) ---
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
      var parts = name.trim().split(/\\s+/);
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
