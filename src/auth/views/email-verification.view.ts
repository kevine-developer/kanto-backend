/**
 * Kanto — Page web de confirmation d'adresse email.
 * Design minimaliste, sobre et épuré, intégralement en français.
 * Gère le succès, les comptes déjà confirmés, le temps limite dépassé (24h),
 * les liens invalides et la redirection vers l'app mobile.
 */

export interface EmailVerificationViewParams {
  error?: string;
  email?: string;
  isLanding?: boolean;
  status?: 'success' | 'already_confirmed' | 'expired';
}

export function renderEmailVerificationPage(
  params: EmailVerificationViewParams,
): string {
  const { error, email, status } = params;

  // Détection fine des différents états
  const isAlreadyConfirmed =
    status === 'already_confirmed' ||
    error === 'ALREADY_CONFIRMED' ||
    error === 'already_confirmed' ||
    error === 'already_verified';

  const isExpired =
    status === 'expired' ||
    error === 'TOKEN_EXPIRED' ||
    error === 'EXPIRED' ||
    error === 'expired';

  const isInvalid =
    error === 'INVALID_TOKEN' ||
    error === 'invalid_token' ||
    error === 'TOKEN_NOT_FOUND';

  const isError = (Boolean(error) && !isAlreadyConfirmed) || isExpired;

  // Configuration dynamique des libellés et actions
  let title = 'Adresse email confirmée';
  let badgeLabel = 'Compte validé';
  let badgeType: 'success' | 'warning' | 'error' | 'info' = 'success';
  let message =
    "Félicitations ! Votre compte Kanto est désormais actif. Vous pouvez ouvrir l'application pour continuer votre découverte du patrimoine et de la culture malagasy.";
  let btnText = "Ouvrir l'application Kanto";
  let btnUrl = 'kantomg://login?verified=true';
  let hint = "L'application devrait s'ouvrir automatiquement sur votre mobile.";

  if (isAlreadyConfirmed) {
    title = 'Adresse email déjà confirmée';
    badgeLabel = 'Compte déjà actif';
    badgeType = 'info';
    message =
      "Votre adresse email a déjà été validée avec succès. Votre compte Kanto est opérationnel et vous pouvez vous connecter directement depuis l'application mobile.";
    btnText = "Ouvrir l'application Kanto";
    btnUrl = 'kantomg://login?verified=true';
    hint = 'Vous pouvez vous connecter directement à votre compte.';
  } else if (isExpired) {
    title = 'Temps limite dépassé';
    badgeLabel = 'Temps limite dépassé';
    badgeType = 'warning';
    message =
      "Lien de confirmation expiré : le temps limite de 24 heures a été dépassé. Pour des raisons de sécurité, veuillez vous connecter à l'application Kanto pour recevoir un nouveau lien de validation.";
    btnText = 'Demander un nouveau lien';
    btnUrl = 'kantomg://login?reason=resend';
    hint = 'Ouvrez Kanto pour renvoyer instantanément un lien de confirmation.';
  } else if (isInvalid) {
    title = 'Lien invalide ou déjà utilisé';
    badgeLabel = 'Lien non reconnu';
    badgeType = 'error';
    message =
      "Ce lien n'est plus valide ou votre adresse email a déjà été confirmée. Si votre compte est déjà actif, vous pouvez vous connecter dès maintenant.";
    btnText = 'Se connecter sur Kanto';
    btnUrl = 'kantomg://login';
    hint = "Rendez-vous sur l'application Kanto pour vous identifier.";
  } else if (error) {
    title = 'Échec de la confirmation';
    badgeLabel = 'Erreur';
    badgeType = 'error';
    message =
      "Un problème inattendu est survenu lors de la validation de votre adresse email. Veuillez réessayer depuis l'application Kanto.";
    btnText = "Ouvrir l'application";
    btnUrl = 'kantomg://login';
    hint = "Rendez-vous sur l'application Kanto pour réessayer.";
  }

  // Sélection de l'icône SVG selon l'état
  let iconSvg = `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  if (isAlreadyConfirmed) {
    iconSvg = `<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>`;
  } else if (isExpired) {
    iconSvg = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
  } else if (isError) {
    iconSvg = `<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
  }

  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kanto — ${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #FAFAFA;
      --card-bg: #FFFFFF;
      --card-border: #E5E7EB;
      --text-main: #111827;
      --text-muted: #6B7280;
      --text-subtle: #9CA3AF;
      --btn-bg: #1B5E20;
      --btn-hover: #144717;
      --icon-stroke: #16A34A;
      --icon-bg: #F0FDF4;
      --icon-border: #DCFCE7;
      --badge-bg: #F0FDF4;
      --badge-border: #DCFCE7;
      --badge-text: #15803D;
    }

    ${
      badgeType === 'warning'
        ? `
    :root {
      --icon-stroke: #D97706;
      --icon-bg: #FEF3C7;
      --icon-border: #FDE68A;
      --badge-bg: #FEF3C7;
      --badge-border: #FDE68A;
      --badge-text: #B45309;
      --btn-bg: #B45309;
      --btn-hover: #92400E;
    }
    `
        : ''
    }

    ${
      badgeType === 'info'
        ? `
    :root {
      --icon-stroke: #2563EB;
      --icon-bg: #EFF6FF;
      --icon-border: #DBEAFE;
      --badge-bg: #EFF6FF;
      --badge-border: #DBEAFE;
      --badge-text: #1D4ED8;
      --btn-bg: #1F2937;
      --btn-hover: #111827;
    }
    `
        : ''
    }

    ${
      badgeType === 'error'
        ? `
    :root {
      --icon-stroke: #DC2626;
      --icon-bg: #FEF2F2;
      --icon-border: #FEE2E2;
      --badge-bg: #FEF2F2;
      --badge-border: #FEE2E2;
      --badge-text: #B91C1C;
      --btn-bg: #1F2937;
      --btn-hover: #111827;
    }
    `
        : ''
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #09090B;
        --card-bg: #121215;
        --card-border: #27272A;
        --text-main: #F4F4F5;
        --text-muted: #A1A1AA;
        --text-subtle: #71717A;
        --btn-bg: #22C55E;
        --btn-hover: #16A34A;
        --icon-bg: #052E16;
        --icon-stroke: #4ADE80;
        --icon-border: #14532D;
        --badge-bg: #052E16;
        --badge-border: #14532D;
        --badge-text: #4ADE80;
      }

      ${
        badgeType === 'warning'
          ? `
      :root {
        --icon-bg: #351C05;
        --icon-stroke: #FBBF24;
        --icon-border: #78350F;
        --badge-bg: #351C05;
        --badge-border: #78350F;
        --badge-text: #FBBF24;
        --btn-bg: #D97706;
        --btn-hover: #B45309;
      }
      `
          : ''
      }

      ${
        badgeType === 'info'
          ? `
      :root {
        --icon-bg: #082F49;
        --icon-stroke: #38BDF8;
        --icon-border: #075985;
        --badge-bg: #082F49;
        --badge-border: #075985;
        --badge-text: #38BDF8;
        --btn-bg: #27272A;
        --btn-hover: #3F3F46;
      }
      `
          : ''
      }

      ${
        badgeType === 'error'
          ? `
      :root {
        --icon-bg: #450A0A;
        --icon-stroke: #F87171;
        --icon-border: #7F1D1D;
        --badge-bg: #450A0A;
        --badge-border: #7F1D1D;
        --badge-text: #F87171;
        --btn-bg: #27272A;
        --btn-hover: #3F3F46;
      }
      `
          : ''
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--bg);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      -webkit-font-smoothing: antialiased;
    }

    .wrapper {
      width: 100%;
      max-width: 440px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .brand {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card {
      width: 100%;
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 40px 32px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    .icon-container {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      background-color: var(--icon-bg);
      border: 1px solid var(--icon-border);
    }

    .icon-container svg {
      width: 26px;
      height: 26px;
      stroke: var(--icon-stroke);
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
    }

    .badge {
      display: inline-block;
      font-size: 11.5px;
      font-weight: 600;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      color: var(--badge-text);
      background-color: var(--badge-bg);
      border: 1px solid var(--badge-border);
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 16px;
    }

    h1 {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-main);
      line-height: 1.35;
      margin-bottom: 12px;
      letter-spacing: -0.3px;
    }

    ${
      email
        ? `
    .email-badge {
      display: inline-block;
      font-size: 12.5px;
      font-weight: 500;
      color: var(--text-main);
      background-color: var(--bg);
      border: 1px solid var(--card-border);
      padding: 4px 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      word-break: break-all;
    }
    `
        : ''
    }

    .message {
      font-size: 14px;
      line-height: 1.65;
      color: var(--text-muted);
      margin-bottom: 28px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      background-color: var(--btn-bg);
      color: #FFFFFF !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      padding: 13px 20px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .btn:hover {
      background-color: var(--btn-hover);
      transform: translateY(-1px);
    }

    .btn:active {
      transform: translateY(0);
    }

    .hint {
      margin-top: 16px;
      font-size: 12px;
      color: var(--text-subtle);
      line-height: 1.45;
    }

    .footer {
      margin-top: 28px;
      font-size: 12px;
      color: var(--text-subtle);
      text-align: center;
    }

    .footer a {
      color: var(--text-muted);
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="brand">
      <span>KANTO</span>
    </div>

    <div class="card">
      <div class="icon-container">
        ${iconSvg}
      </div>

      <div>
        <span class="badge">${badgeLabel}</span>
      </div>

      <h1>${title}</h1>

      ${email ? `<div class="email-badge">${email}</div>` : ''}

      <div class="message">
        ${message}
      </div>

      <a href="${btnUrl}" class="btn" id="open-app-btn">
        ${btnText}
      </a>

      <div class="hint" id="redirect-hint">
        ${hint}
      </div>
    </div>

    <div class="footer">
      © ${currentYear} Kanto • <a href="/pages/help">Centre d'aide</a> • <a href="/pages/privacy">Confidentialité</a>
    </div>
  </div>

  <script>
    (function() {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const appUrl = "${btnUrl}";
      const hintEl = document.getElementById('redirect-hint');

      // Tentative d'ouverture automatique de l'app si mobile et non-erreur critique
      if (isMobile && !${isError && !isAlreadyConfirmed}) {
        setTimeout(function() {
          try {
            window.location.href = appUrl;
          } catch(e) {}
        }, 1200);
      } else if (hintEl && !isMobile) {
        hintEl.textContent = "Vous pouvez désormais vous connecter directement depuis l'application mobile Kanto.";
      }
    })();
  </script>
</body>
</html>
`;
}
