export function renderBetaWaitlistScript(): string {
  return `
(function() {
  // Onglets & Panneaux
  var tabDl = document.getElementById('tab-btn-download');
  var tabReg = document.getElementById('tab-btn-register');
  var tabAlr = document.getElementById('tab-btn-already');

  var pnlDl = document.getElementById('panel-download');
  var pnlReg = document.getElementById('panel-register');
  var pnlAlr = document.getElementById('panel-already');
  var pnlUnsub = document.getElementById('panel-unsubscribe');

  var errBanner = document.getElementById('error-banner');
  var errText = document.getElementById('error-text');
  var succBanner = document.getElementById('success-banner');
  var succText = document.getElementById('success-text');

  var currentTesterEmail = '';
  var downloadData = null;

  // Sélecteur de plateformes dans l'inscription
  var cardAndroid = document.getElementById('card-android');
  var cardIos = document.getElementById('card-ios');
  var selectedPlatforms = ['ANDROID'];

  function updatePlatformCards() {
    if (cardAndroid) {
      if (selectedPlatforms.indexOf('ANDROID') !== -1) {
        cardAndroid.classList.add('checked');
      } else {
        cardAndroid.classList.remove('checked');
      }
    }
    if (cardIos) {
      if (selectedPlatforms.indexOf('IOS') !== -1) {
        cardIos.classList.add('checked');
      } else {
        cardIos.classList.remove('checked');
      }
    }
  }

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

  function switchTab(target) {
    hideBanners();
    if (tabDl) tabDl.classList.toggle('active', target === 'download');
    if (tabReg) tabReg.classList.toggle('active', target === 'register');
    if (tabAlr) tabAlr.classList.toggle('active', target === 'already');

    if (pnlDl) pnlDl.style.display = target === 'download' ? 'block' : 'none';
    if (pnlReg) pnlReg.style.display = target === 'register' ? 'block' : 'none';
    if (pnlAlr) pnlAlr.style.display = target === 'already' ? 'block' : 'none';
    if (pnlUnsub) pnlUnsub.style.display = target === 'unsubscribe' ? 'block' : 'none';

    try {
      var url = new URL(window.location);
      url.searchParams.set('tab', target);
      window.history.replaceState({}, '', url);
    } catch(e) {}
  }

  if (tabReg) tabReg.addEventListener('click', function() { switchTab('register'); });
  if (tabDl) tabDl.addEventListener('click', function() { switchTab('download'); });
  if (tabAlr) tabAlr.addEventListener('click', function() { switchTab('already'); });

  
  // Clic Header Se connecter
  var btnHeaderLogin = document.getElementById('header-btn-login');
  if (btnHeaderLogin) {
    btnHeaderLogin.addEventListener('click', function(e) {
      if (e) e.preventDefault();
      switchTab('already');
      var pnl = document.getElementById('panel-already') || document.getElementById('section-inscription');
      if (pnl) pnl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var input = document.getElementById('check-email-input');
      if (input) setTimeout(function() { input.focus(); }, 200);
    });
  }

  // Clic Header Créer un compte
  var btnHeaderReg = document.getElementById('header-btn-register');
  if (btnHeaderReg) {
    btnHeaderReg.addEventListener('click', function(e) {
      if (e) e.preventDefault();
      switchTab('register');
      var pnl = document.getElementById('section-inscription');
      if (pnl) pnl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var input = document.getElementById('reg-email');
      if (input) setTimeout(function() { input.focus(); }, 200);
    });
  }

  // Clic Hero Créer mon compte
  var btnHeroAction = document.getElementById('hero-btn-primary-action');
  if (btnHeroAction) {
    btnHeroAction.addEventListener('click', function(e) {
      if (e) e.preventDefault();
      switchTab('register');
      var pnl = document.getElementById('section-inscription');
      if (pnl) pnl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var input = document.getElementById('reg-email');
      if (input) setTimeout(function() { input.focus(); }, 200);
    });
  }

  // Fermeture du bandeau sticky mobile avec mémorisation de session
  var btnCloseSticky = document.getElementById('btn-close-sticky-bar');
  var stickyBar = document.getElementById('mobile-sticky-bar');
  if (btnCloseSticky && stickyBar) {
    try {
      if (sessionStorage.getItem('kanto_sticky_closed') === 'true') {
        stickyBar.style.display = 'none';
      }
    } catch(e) {}

    btnCloseSticky.addEventListener('click', function() {
      stickyBar.style.display = 'none';
      try {
        sessionStorage.setItem('kanto_sticky_closed', 'true');
      } catch(e) {}
    });
  }

  var linkOpenAlready = document.getElementById('link-open-already');
  if (linkOpenAlready) {
    linkOpenAlready.addEventListener('click', function(e) {
      if (e) e.preventDefault();
      switchTab('already');
      var container = document.getElementById('panel-already') || document.querySelector('.card');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      var checkEmailInput = document.getElementById('check-email');
      if (checkEmailInput) {
        setTimeout(function() {
          checkEmailInput.focus();
        }, 150);
      }
    });
  }

  var btnBackToRegister = document.getElementById('btn-back-to-register');
  if (btnBackToRegister) {
    btnBackToRegister.addEventListener('click', function() {
      switchTab('register');
    });
  }

  var btnSwitchToReg = document.getElementById('btn-switch-to-register');
  if (btnSwitchToReg) {
    btnSwitchToReg.addEventListener('click', function() { switchTab('register'); });
  }

  var footerMySpaceBtn = document.getElementById('footer-link-my-space');
  if (footerMySpaceBtn) {
    footerMySpaceBtn.addEventListener('click', function(e) {
      if (e) e.preventDefault();
      switchTab('already');
      var container = document.getElementById('panel-already') || document.querySelector('.main-card');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      var checkEmailInput = document.getElementById('check-email');
      if (checkEmailInput) {
        setTimeout(function() {
          checkEmailInput.focus();
        }, 150);
      }
    });
  }

  var openUnsubBtn = document.getElementById('btn-open-unsubscribe');
  if (openUnsubBtn) {
    openUnsubBtn.addEventListener('click', function() { switchTab('unsubscribe'); });
  }

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

  // ─── CHARGEMENT DES INFOS DE TÉLÉCHARGEMENT EN TEMPS RÉEL ───
  async function loadDownloadInfo() {
    try {
      var res = await fetch('/api/beta-testers/download-info');
      if (!res.ok) return;
      var data = await res.json();
      downloadData = data;

      // Android
      var aBadge = document.getElementById('dl-android-badge');
      var aDesc = document.getElementById('dl-android-desc');
      var aBtnMain = document.getElementById('dl-btn-android-main');
      var aBtnMainText = document.getElementById('dl-btn-android-main-text');
      var aBtnStore = document.getElementById('dl-btn-android-store');
      var aVerLabel = document.getElementById('dl-android-version-label');
      var aBuildLabel = document.getElementById('dl-android-build-label');

      if (data.android) {
        var aAvail = data.android.availability || 'BETA_OPEN';
        if (aBadge) {
          aBadge.className = 'download-avail-pill ' + (
            aAvail === 'PUBLIC' ? 'download-avail-public' :
            aAvail === 'BETA_OPEN' ? 'download-avail-beta' :
            aAvail === 'BETA_CLOSED' ? 'download-avail-closed' :
            aAvail === 'PENDING' ? 'download-avail-pending' : 'download-avail-unavailable'
          );
          aBadge.innerText = (
            aAvail === 'PUBLIC' ? 'Version publique' :
            aAvail === 'BETA_OPEN' ? 'Programme Bêta ouvert' :
            aAvail === 'BETA_CLOSED' ? 'Bêta fermée' :
            aAvail === 'PENDING' ? 'Accès en attente' : 'Indisponible'
          );
        }

        if (aBtnMain) {
          if (aAvail === 'PUBLIC') {
            aBtnMain.href = data.android.playStoreAppLink || '#';
            if (aBtnMainText) aBtnMainText.innerText = 'Télécharger sur Google Play';
            if (aBtnStore) aBtnStore.style.display = 'none';
          } else if (aAvail === 'BETA_OPEN') {
            aBtnMain.href = data.android.playStoreWebLink || 'https://play.google.com/apps/testing/com.devengalere.kantomg';
            if (aBtnMainText) aBtnMainText.innerText = 'Rejoindre le test Google Play';
            if (aBtnStore) {
              aBtnStore.style.display = 'inline-flex';
              aBtnStore.href = data.android.playStoreAppLink || '#';
            }
          } else {
            aBtnMain.style.display = 'none';
          }
        }

        if (data.android.latestVersion) {
          if (aVerLabel) aVerLabel.innerText = 'v' + data.android.latestVersion.version;
          if (aBuildLabel) aBuildLabel.innerText = 'Build ' + data.android.latestVersion.buildNumber;
        }
      }

      // iOS
      var iBadge = document.getElementById('dl-ios-badge');
      var iDesc = document.getElementById('dl-ios-desc');
      var iBtnMain = document.getElementById('dl-btn-ios-main');
      var iBtnMainText = document.getElementById('dl-btn-ios-main-text');
      var iBtnStore = document.getElementById('dl-btn-ios-store');
      var iVerLabel = document.getElementById('dl-ios-version-label');
      var iBuildLabel = document.getElementById('dl-ios-build-label');

      if (data.ios) {
        var iAvail = data.ios.availability || 'BETA_OPEN';
        if (iBadge) {
          iBadge.className = 'download-avail-pill ' + (
            iAvail === 'PUBLIC' ? 'download-avail-public' :
            iAvail === 'BETA_OPEN' ? 'download-avail-beta' :
            iAvail === 'BETA_CLOSED' ? 'download-avail-closed' :
            iAvail === 'PENDING' ? 'download-avail-pending' : 'download-avail-unavailable'
          );
          iBadge.innerText = (
            iAvail === 'PUBLIC' ? 'Version publique' :
            iAvail === 'BETA_OPEN' ? 'Apple TestFlight' :
            iAvail === 'BETA_CLOSED' ? 'Bêta fermée' :
            iAvail === 'PENDING' ? 'Accès en attente' : 'Indisponible'
          );
        }

        if (iBtnMain) {
          if (iAvail === 'PUBLIC' && data.ios.appStoreLink) {
            iBtnMain.href = data.ios.appStoreLink;
            if (iBtnMainText) iBtnMainText.innerText = "Télécharger sur l'App Store";
          } else if (data.ios.testFlightLink) {
            iBtnMain.href = data.ios.testFlightLink;
            if (iBtnMainText) iBtnMainText.innerText = 'Rejoindre le test sur TestFlight';
          } else {
            iBtnMain.style.display = 'none';
          }
        }

        if (data.ios.latestVersion) {
          if (iVerLabel) iVerLabel.innerText = 'v' + data.ios.latestVersion.version;
          if (iBuildLabel) iBuildLabel.innerText = 'Build ' + data.ios.latestVersion.buildNumber;
        }
      }
    } catch(err) {
      console.warn('Impossible de charger download-info', err);
    }
  }

  loadDownloadInfo();

  // ─── 1. SOUMISSION INSCRIPTION BÊTA ───
  var regForm = document.getElementById('waitlist-form');
  var regBtn = document.getElementById('btn-submit-reg');

  if (regForm) {
    regForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      hideBanners();

      var email = document.getElementById('reg-email').value.trim();
      var fullName = document.getElementById('reg-name').value.trim();
      var terms = document.getElementById('reg-terms').checked;
      var website = document.getElementById('hp-website').value.trim();

      if (!email || email.indexOf('@') === -1) {
        showError('Veuillez saisir une adresse e-mail valide.');
        return;
      }
      if (!terms) {
        showError('Vous devez accepter les conditions de participation.');
        return;
      }
      if (selectedPlatforms.length === 0) {
        showError('Veuillez sélectionner au moins une plateforme (Android ou iOS).');
        return;
      }

      if (regBtn) {
        regBtn.disabled = true;
        regBtn.innerText = 'Enregistrement en cours...';
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
          showSuccess('Candidature enregistrée avec succès ! Bienvenue dans l’espace testeur Kanto.');
          var countBadge = document.getElementById('header-tester-count');
          if (countBadge) {
            var m = countBadge.innerText.match(/[0-9]+/);
            if (m) countBadge.innerText = (parseInt(m[0], 10) + 1) + ' testeurs inscrits';
          }
          // Bascule automatique vers l'espace testeur
          switchTab('already');
          var checkInput = document.getElementById('check-email');
          if (checkInput) checkInput.value = email;
          verifyEmail(email);
        } else if (data.alreadyRegistered) {
          showError('Cette adresse e-mail est déjà inscrite. Consultation de votre statut en cours...');
          switchTab('already');
          var chkInput = document.getElementById('check-email');
          if (chkInput) chkInput.value = email;
          verifyEmail(email);
        } else {
          showError(data.message || 'Une erreur est survenue lors de l’inscription.');
        }
      } catch (err) {
        showError('Impossible de joindre le serveur. Veuillez vérifier votre connexion.');
      } finally {
        if (regBtn) {
          regBtn.disabled = false;
          regBtn.innerText = 'Rejoindre le programme bêta';
        }
      }
    });
  }

  // ─── 2. VÉRIFICATION STATUT, ESPACE TESTEUR & PROGRESSION ───
  var statusForm = document.getElementById('status-check-form');

  async function verifyEmail(email) {
    hideBanners();
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

      var lbl = document.getElementById('tester-email-lbl');
      if (lbl) {
        var displayEmail = (data.tester && (data.tester.maskedEmail || data.tester.email)) 
          ? (data.tester.maskedEmail || data.tester.email) 
          : maskEmailClient(email);
        lbl.innerText = displayEmail;
      }

      var tester = data.tester;
      var cStatus = tester.confirmationStatus || 'INSCRIT';

      // Badge de statut général
      var sBadge = document.getElementById('tester-status-badge');
      if (sBadge) {
        sBadge.className = 'tester-status-badge badge-' + cStatus.toLowerCase();
        sBadge.innerText = (
          cStatus === 'INSCRIT' ? 'INSCRIT' :
          cStatus === 'EN_ATTENTE' ? 'EN ATTENTE' :
          cStatus === 'CONFIRME' ? 'PARTICIPATION CONFIRMÉE' :
          cStatus === 'VERIFIE' ? 'ACCÈS VALIDÉ' :
          cStatus === 'INSTALLE' ? 'APPLICATION INSTALLÉE' : 'DÉSINCRIT'
        );
      }

      // Mise à jour de la barre de progression en 5 étapes
      var stepIndex = data.currentStepIndex || 2;
      for (var s = 1; s <= 5; s++) {
        var sNode = document.getElementById('step-node-' + s);
        if (sNode) {
          sNode.className = 'progress-step-item';
          var sBullet = sNode.querySelector('.step-bullet');
          if (s < stepIndex) {
            sNode.classList.add('completed');
            if (sBullet) sBullet.innerText = '✓';
          } else if (s === stepIndex) {
            sNode.classList.add('current');
            if (sBullet) sBullet.innerText = String(s);
          } else {
            if (sBullet) sBullet.innerText = String(s);
          }
        }
      }

      // Gestion de la boîte d'action
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
        if (actionDesc) actionDesc.innerText = 'Votre accès est validé. Une fois l’application téléchargée sur votre téléphone, confirmez l’installation.';
        if (btnJoined) btnJoined.style.display = 'none';
        if (btnInstalled) btnInstalled.style.display = 'flex';
      } else {
        if (actionTitle) actionTitle.innerText = 'Valider votre participation au programme';
        if (actionDesc) actionDesc.innerText = 'Une fois que vous avez rejoint le groupe sur Google Play ou accepté TestFlight, confirmez votre accès ci-dessous.';
        if (btnJoined) btnJoined.style.display = 'flex';
        if (btnInstalled) btnInstalled.style.display = 'none';
      }

      // Plateformes de test
      var hasAndroid = tester.platforms.indexOf('ANDROID') !== -1;
      var hasIos = tester.platforms.indexOf('IOS') !== -1;

      // Carte Android
      var cAndroid = document.getElementById('card-status-android');
      var bAndroid = document.getElementById('badge-status-android');
      var descAndroid = document.getElementById('desc-status-android');
      var linkPlay = document.getElementById('link-play-web');

      if (cAndroid) {
        cAndroid.style.display = hasAndroid ? 'block' : 'none';
        if (hasAndroid) {
          if (bAndroid) {
            bAndroid.innerText = tester.androidStatus;
            bAndroid.className = 'badge-status ' + (
              tester.androidStatus === 'ACCEPTED' || tester.androidStatus === 'ACTIVE' || tester.androidStatus === 'INVITED'
                ? 'badge-invited' : 'badge-pending'
            );
          }
          if (descAndroid) {
            descAndroid.innerText = data.canDownloadAndroid
              ? 'Votre compte Google est autorisé pour le test fermé Google Play.'
              : 'En attente d’autorisation sur la Google Play Console.';
          }
          if (linkPlay && data.canDownloadAndroid) {
            linkPlay.style.display = 'block';
            linkPlay.href = data.links.androidWeb;
          }
        }
      }

      // Carte iOS
      var cIos = document.getElementById('card-status-ios');
      var bIos = document.getElementById('badge-status-ios');
      var descIos = document.getElementById('desc-status-ios');
      var linkTf = document.getElementById('link-testflight');

      if (cIos) {
        cIos.style.display = hasIos ? 'block' : 'none';
        if (hasIos) {
          if (bIos) {
            bIos.innerText = tester.iosStatus;
            bIos.className = 'badge-status ' + (
              tester.iosStatus === 'ACCEPTED' || tester.iosStatus === 'ACTIVE' || tester.iosStatus === 'INVITED'
                ? 'badge-invited' : 'badge-pending'
            );
          }
          if (descIos) {
            descIos.innerText = data.canDownloadIos
              ? 'Votre invitation TestFlight est active pour votre appareil Apple.'
              : 'En attente d’invitation sur Apple TestFlight.';
          }
          if (linkTf && data.canDownloadIos) {
            linkTf.style.display = 'block';
            linkTf.href = data.links.testFlight;
          }
        }
      }

      // Version actuelle
      var vCard = document.getElementById('tester-version-card');
      var vBadge = document.getElementById('tvc-version-badge');
      var vNotes = document.getElementById('tvc-notes');
      if (data.latestVersion && vCard) {
        vCard.style.display = 'block';
        if (vBadge) vBadge.innerText = 'v' + data.latestVersion.version + ' (build ' + data.latestVersion.buildNumber + ')';
        if (vNotes) vNotes.innerText = data.latestVersion.releaseNotes || 'Améliorations de performance et enrichissement des contenus culturels malgaches.';
      }

      // Checkboxes mise à jour des plateformes
      var chkAndroid = document.getElementById('chk-update-android');
      var chkIos = document.getElementById('chk-update-ios');
      if (chkAndroid) chkAndroid.checked = hasAndroid;
      if (chkIos) chkIos.checked = hasIos;

    } catch (err) {
      showError('Erreur lors de la vérification de votre espace personnel.');
    }
  }

  if (statusForm) {
    statusForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('check-email').value.trim();
      if (email) verifyEmail(email);
    });
  }

  // ─── 3. CONFIRMATION INTERACTIVE DU TESTEUR (« J'AI REJOINT » / « J'AI INSTALLÉ ») ───
  var btnConfirmJoined = document.getElementById('btn-confirm-joined');
  if (btnConfirmJoined) {
    btnConfirmJoined.addEventListener('click', async function() {
      if (!currentTesterEmail) {
        showError('Veuillez d’abord renseigner votre adresse e-mail.');
        return;
      }
      btnConfirmJoined.disabled = true;
      btnConfirmJoined.innerText = 'Confirmation en cours...';
      try {
        var res = await fetch('/api/beta-testers/confirm-participation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: currentTesterEmail,
            action: 'JOINED'
          })
        });
        var data = await res.json();
        if (res.ok && data.success) {
          showSuccess('Félicitations ! Votre participation est confirmée. Vous pouvez maintenant installer Kanto MG.');
          verifyEmail(currentTesterEmail);
        } else {
          showError(data.message || 'Impossible de confirmer votre participation.');
        }
      } catch (err) {
        showError('Erreur lors de la confirmation. Vérifiez votre connexion.');
      } finally {
        btnConfirmJoined.disabled = false;
        btnConfirmJoined.innerText = "J'ai rejoint le programme bêta";
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
          body: JSON.stringify({
            email: currentTesterEmail,
            action: 'INSTALLED'
          })
        });
        var data = await res.json();
        if (res.ok && data.success) {
          showSuccess('Bravo ! Installation confirmée. Bonne exploration de la culture malgache dans Kanto MG.');
          verifyEmail(currentTesterEmail);
        } else {
          showError(data.message || 'Impossible d’enregistrer l’installation.');
        }
      } catch (err) {
        showError('Erreur lors de la confirmation de l’installation.');
      } finally {
        btnConfirmInstalled.disabled = false;
        btnConfirmInstalled.innerText = "J'ai installé Kanto MG sur mon appareil";
      }
    });
  }

  // Accordéon guide pas-à-pas
  var guideBtn = document.getElementById('guide-toggle-btn');
  var guideContent = document.getElementById('guide-content');
  var guideChevron = document.getElementById('guide-chevron');
  if (guideBtn && guideContent) {
    guideBtn.addEventListener('click', function() {
      var isOpen = guideContent.style.display !== 'none';
      guideContent.style.display = isOpen ? 'none' : 'block';
      if (guideChevron) guideChevron.innerText = isOpen ? '▼' : '▲';
    });
  }

  // Renvoi des liens
  var resendBtn = document.getElementById('btn-resend-links');
  if (resendBtn) {
    resendBtn.addEventListener('click', async function() {
      if (!currentTesterEmail) return;
      try {
        var res = await fetch('/api/beta-testers/resend-invite-public', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currentTesterEmail })
        });
        var data = await res.json();
        if (data.success) {
          showSuccess(data.message);
        } else {
          showError(data.message);
        }
      } catch (e) {
        showError('Erreur de renvoi des invitations.');
      }
    });
  }

  // Toggle form mise à jour plateformes
  var togglePlatBtn = document.getElementById('btn-toggle-update-plat');
  var boxPlat = document.getElementById('box-update-platforms');
  if (togglePlatBtn && boxPlat) {
    togglePlatBtn.addEventListener('click', function() {
      boxPlat.style.display = boxPlat.style.display === 'none' ? 'block' : 'none';
    });
  }

  // Sauvegarde mise à jour plateformes
  var savePlatBtn = document.getElementById('btn-submit-update-plat');
  if (savePlatBtn) {
    savePlatBtn.addEventListener('click', async function() {
      if (!currentTesterEmail) return;
      var chkAndroid = document.getElementById('chk-update-android');
      var chkIos = document.getElementById('chk-update-ios');
      var newPlats = [];
      if (chkAndroid && chkAndroid.checked) newPlats.push('ANDROID');
      if (chkIos && chkIos.checked) newPlats.push('IOS');

      if (newPlats.length === 0) {
        showError('Vous devez conserver au moins une plateforme.');
        return;
      }

      try {
        var res = await fetch('/api/beta-testers/platforms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currentTesterEmail, platforms: newPlats })
        });
        var data = await res.json();
        if (data.success) {
          showSuccess('Vos plateformes de test ont été mises à jour !');
          if (boxPlat) boxPlat.style.display = 'none';
          verifyEmail(currentTesterEmail);
        } else {
          showError(data.message);
        }
      } catch (e) {
        showError('Erreur lors de la mise à jour des plateformes.');
      }
    });
  }

  // ─── 4. DÉSINCRIPTION RGPD ───
  var unsubForm = document.getElementById('unsub-form');
  var unsubChips = document.querySelectorAll('.unsub-chip');
  var unsubReasonInput = document.getElementById('unsub-reason');
  var unsubCancelBtn = document.getElementById('btn-unsub-cancel');

  unsubChips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      unsubChips.forEach(function(c) { c.classList.remove('active'); });
      chip.classList.add('active');
      if (unsubReasonInput) unsubReasonInput.value = chip.getAttribute('data-reason');
    });
  });

  if (unsubCancelBtn) {
    unsubCancelBtn.addEventListener('click', function() {
      switchTab('already');
    });
  }

  if (unsubForm) {
    unsubForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      hideBanners();

      var email = document.getElementById('unsub-email').value.trim();
      var token = document.getElementById('unsub-token').value.trim();
      var reason = unsubReasonInput ? unsubReasonInput.value.trim() : '';

      try {
        var res = await fetch('/api/beta-testers/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, token: token || undefined, reason: reason })
        });
        var data = await res.json();
        if (data.success) {
          unsubForm.style.display = 'none';
          var sBox = document.getElementById('unsub-success-box');
          if (sBox) sBox.style.display = 'block';
          var sMsg = document.getElementById('unsub-success-msg');
          if (sMsg) sMsg.innerText = data.message;
        } else {
          showError(data.message || 'Erreur lors de la désinscription.');
        }
      } catch (err) {
        showError('Impossible de joindre le serveur.');
      }
    });
  }

  var btnUnsubHome = document.getElementById('btn-unsub-home');
  if (btnUnsubHome) {
    btnUnsubHome.addEventListener('click', function() { switchTab('register'); });
  }

  var btnUnsubResub = document.getElementById('btn-unsub-resubscribe');
  if (btnUnsubResub) {
    btnUnsubResub.addEventListener('click', function() {
      if (unsubForm) unsubForm.style.display = 'block';
      var sBox = document.getElementById('unsub-success-box');
      if (sBox) sBox.style.display = 'none';
      switchTab('register');
    });
  }

  // ─── 5. GESTION DU THÈME CLAIR / SOMBRE ───
  var themeToggle = document.getElementById('theme-toggle');
  var iconSun = document.getElementById('theme-icon-sun');
  var iconMoon = document.getElementById('theme-icon-moon');

  function updateThemeIcons(theme) {
    if (iconSun && iconMoon) {
      iconSun.style.display = theme === 'dark' ? 'none' : 'block';
      iconMoon.style.display = theme === 'dark' ? 'block' : 'none';
    }
  }

  var curTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  updateThemeIcons(curTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      var now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', now);
      localStorage.setItem('kanto_theme', now);
      updateThemeIcons(now);
      var metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute('content', now === 'light' ? '#F5F4F0' : '#0D0D0B');
    });
  }

  // ─── 6. MODALES CGU & POLITIQUE DE CONFIDENTIALITÉ ───
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

  // Modale Confidentialité
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

  // ─── 7. GESTION DES COOKIES (Moteur KantoConsent) ───
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

  // --- MODULE AVIS DE LA COMMUNAUTE (DESIGN MODERNE SANS FILTRE, MINIMUM 4 ETOILES) ---
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

      // Charge uniquement les avis ayant au moins 4 étoiles sans filtre
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

    // Bouton charger plus
    if (btnLoadMore) {
      btnLoadMore.addEventListener('click', function() {
        if (currentPage < totalPages) {
          loadReviews(currentPage + 1, true);
        }
      });
    }

    // Chargement initial
    loadStats();
    loadReviews(1, false);
  })();


  // Si un email est déjà présent à l'affichage initial (champ ou query param)
  var qEmail = '';
  try {
    qEmail = new URLSearchParams(window.location.search).get('email') || '';
  } catch(e) {}
  var chkInput = document.getElementById('check-email');
  var regInput = document.getElementById('reg-email');
  var initEmail = qEmail || (chkInput ? chkInput.value : '') || (regInput ? regInput.value : '');
  if (initEmail && initEmail.indexOf('@') !== -1) {
    if (chkInput) chkInput.value = initEmail;
    verifyEmail(initEmail);
  }
})();
  `.trim();
}
