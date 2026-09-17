/**
 * Kanto — Page web de confirmation d'adresse email.
 * Design minimaliste, sobre et épuré, intégralement en français.
 * Gère le succès, les erreurs (lien expiré/invalide) et la redirection vers l'app mobile.
 */

export interface EmailVerificationViewParams {
  error?: string;
  email?: string;
  isLanding?: boolean;
}

export function renderEmailVerificationPage(
  params: EmailVerificationViewParams,
): string {
  const { error, email } = params;
  const isError = Boolean(error);

  let title = 'Adresse email confirmée';
  let message =
    "Votre compte Kanto est désormais actif. Vous pouvez ouvrir l'application pour continuer.";

  if (error === 'TOKEN_EXPIRED') {
    title = 'Lien de confirmation expiré';
    message =
      "Ce lien de confirmation a expiré (validité 24 heures). Veuillez vous connecter à l'application Kanto pour en recevoir un nouveau.";
  } else if (error === 'INVALID_TOKEN') {
    title = 'Lien invalide ou déjà utilisé';
    message =
      "Ce lien n'est plus valide ou votre adresse email a déjà été confirmée. Vous pouvez vous connecter à votre compte.";
  } else if (error) {
    title = 'Échec de la confirmation';
    message =
      "Un problème est survenu lors de la validation de votre adresse email. Veuillez réessayer depuis l'application.";
  }

  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isError ? 'Kanto — Erreur de confirmation' : 'Kanto — Email confirmé'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #FAFAFA;
      --card-bg: #FFFFFF;
      --card-border: #E5E7EB;
      --text-main: #111827;
      --text-muted: #6B7280;
      --text-subtle: #9CA3AF;
      --btn-bg: #1F2937;
      --btn-hover: #111827;
      --icon-bg: #F0FDF4;
      --icon-stroke: #16A34A;
      --icon-border: #DCFCE7;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #09090B;
        --card-bg: #121215;
        --card-border: #27272A;
        --text-main: #F4F4F5;
        --text-muted: #A1A1AA;
        --text-subtle: #71717A;
        --btn-bg: #27272A;
        --btn-hover: #3F3F46;
        --icon-bg: #052E16;
        --icon-stroke: #4ADE80;
        --icon-border: #14532D;
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
      max-width: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .brand {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 24px;
    }

    .card {
      width: 100%;
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 36px 28px;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }

    .icon-container {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      background-color: ${isError ? 'var(--icon-error-bg, #FEF2F2)' : 'var(--icon-bg)'};
      border: 1px solid ${isError ? '#FEE2E2' : 'var(--icon-border)'};
    }

    @media (prefers-color-scheme: dark) {
      .icon-container {
        background-color: ${isError ? '#450A0A' : 'var(--icon-bg)'};
        border-color: ${isError ? '#7F1D1D' : 'var(--icon-border)'};
      }
    }

    .icon-container svg {
      width: 22px;
      height: 22px;
      stroke: ${isError ? '#DC2626' : 'var(--icon-stroke)'};
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
    }

    @media (prefers-color-scheme: dark) {
      .icon-container svg {
        stroke: ${isError ? '#F87171' : 'var(--icon-stroke)'};
      }
    }

    h1 {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-main);
      line-height: 1.35;
      margin-bottom: 12px;
      letter-spacing: -0.2px;
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
      padding: 3px 10px;
      border-radius: 6px;
      margin-bottom: 16px;
      word-break: break-all;
    }
    `
        : ''
    }

    .message {
      font-size: 13.5px;
      line-height: 1.6;
      color: var(--text-muted);
      margin-bottom: 24px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      background-color: var(--btn-bg);
      color: #FFFFFF !important;
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 500;
      padding: 11px 18px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .btn:hover {
      background-color: var(--btn-hover);
    }

    .hint {
      margin-top: 14px;
      font-size: 12px;
      color: var(--text-subtle);
      line-height: 1.4;
    }

    .footer {
      margin-top: 24px;
      font-size: 11.5px;
      color: var(--text-subtle);
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="brand">Kanto</div>

    <div class="card">
      <div class="icon-container">
        ${
          isError
            ? `<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
            : `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`
        }
      </div>

      <h1>${title}</h1>

      ${email ? `<div class="email-badge">${email}</div>` : ''}

      <div class="message">
        ${message}
      </div>

      <a href="${isError ? 'kantomg://login' : 'kantomg://login?verified=true'}" class="btn" id="open-app-btn">
        ${isError ? "Ouvrir l'application" : "Ouvrir l'application Kanto"}
      </a>

      <div class="hint" id="redirect-hint">
        L'application devrait s'ouvrir automatiquement sur votre mobile.
      </div>
    </div>

    <div class="footer">
      © ${currentYear} Kanto
    </div>
  </div>

  <script>
    (function() {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const appUrl = "${isError ? 'kantomg://login' : 'kantomg://login?verified=true'}";
      const hintEl = document.getElementById('redirect-hint');

      if (isMobile && !${isError}) {
        setTimeout(function() {
          try {
            window.location.href = appUrl;
          } catch(e) {}
        }, 1000);
      } else if (hintEl && !isMobile) {
        hintEl.textContent = "Vous pouvez maintenant vous connecter depuis l'application.";
      }
    })();
  </script>
</body>
</html>
`;
}
