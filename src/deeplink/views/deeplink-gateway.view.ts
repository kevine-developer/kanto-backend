/**
 * Kanto — Passerelle intelligente de redirection Deeplink & Universal Link
 * 
 * Intercepte les accès web aux partages (QR code, liens sociaux) :
 * 1. Tente d'ouvrir l'application native installée (schéma kantomg://).
 * 2. Si l'application n'est pas installée, redirige vers l'inscription testeur bêta.
 * 3. Propose une interface de repli soignée conforme au Design System Kanto (Terre & Encre).
 * 
 * Zéro référence à l'IA.
 */

export interface DeeplinkGatewayOptions {
  path: string;
  fullQueryString?: string;
  title?: string;
  description?: string;
}

export function renderDeeplinkGatewayPage(options: DeeplinkGatewayOptions): string {
  const cleanPath = options.path.replace(/^\/+/, '');
  const qs = options.fullQueryString ? (options.fullQueryString.startsWith('?') ? options.fullQueryString : `?${options.fullQueryString}`) : '';
  const nativeSchemeUrl = `kantomg://${cleanPath}${qs}`;
  const betaRedirectUrl = `/beta?from=deeplink&target=${encodeURIComponent(cleanPath)}${options.fullQueryString ? `&${options.fullQueryString.replace(/^\?/, '')}` : ''}`;
  const pageTitle = options.title || 'Kanto • Redirection en cours';
  const pageDescription = options.description || "Ouverture dans l'application Kanto ou accès au programme de test.";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(pageDescription)}">
  <meta name="theme-color" content="#0D0D0B">

  <!-- Open Graph / Réseaux sociaux -->
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(pageDescription)}">
  <meta property="og:type" content="website">

  <!-- Favicon & Typographie -->
  <link rel="icon" href="/favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    :root {
      --color-bg: #0D0D0B;
      --color-surface: #141412;
      --color-surface-hover: #1E1E1B;
      --color-border: #242420;
      --color-border-subtle: #1B211B;
      --color-tanimbary: #6B9E61;
      --color-tanimbary-dark: #16442A;
      --color-ochre: #C58B38;
      --color-text: #F0F0EC;
      --color-text-secondary: #9C9C98;
      --color-text-muted: #707070;
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --radius-full: 9999px;
      --font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--color-bg);
      color: var(--color-text);
      font-family: var(--font-family);
      line-height: 1.5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      -webkit-font-smoothing: antialiased;
    }

    .gateway-card {
      width: 100%;
      max-width: 400px;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 32px 24px;
      text-align: center;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .brand-logo {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }

    .brand-mark {
      width: 44px;
      height: 44px;
      background-color: var(--color-tanimbary-dark);
      border: 1px solid rgba(107, 158, 97, 0.35);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-weight: 700;
      font-size: 20px;
      letter-spacing: -0.5px;
    }

    .brand-text {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #FFFFFF;
    }

    .brand-domain {
      color: var(--color-ochre);
      font-weight: 700;
    }

    /* Indicateur de chargement circulaire doux */
    .spinner-wrap {
      position: relative;
      width: 52px;
      height: 52px;
      margin: 8px 0;
    }

    .spinner {
      width: 100%;
      height: 100%;
      border: 3px solid rgba(107, 158, 97, 0.15);
      border-top-color: var(--color-tanimbary);
      border-radius: 50%;
      animation: spin 0.9s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: var(--radius-full);
      background-color: rgba(107, 158, 97, 0.12);
      border: 1px solid rgba(107, 158, 97, 0.3);
      color: var(--color-tanimbary);
      font-size: 11.5px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }

    .content-block h1 {
      font-size: 19px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 8px;
      letter-spacing: -0.3px;
    }

    .content-block p {
      font-size: 13.5px;
      color: var(--color-text-secondary);
      line-height: 1.5;
    }

    .actions-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 4px;
    }

    .btn-primary {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 13px 18px;
      background-color: var(--color-tanimbary-dark);
      border: 1px solid rgba(107, 158, 97, 0.4);
      color: #FFFFFF;
      font-size: 13.5px;
      font-weight: 600;
      border-radius: var(--radius-md);
      text-decoration: none;
      transition: all 0.15s ease;
      cursor: pointer;
    }

    .btn-primary:hover {
      background-color: #1a5233;
      border-color: var(--color-tanimbary);
      transform: translateY(-1px);
    }

    .btn-secondary {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 18px;
      background-color: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--color-border);
      color: var(--color-text-secondary);
      font-size: 13px;
      font-weight: 500;
      border-radius: var(--radius-md);
      text-decoration: none;
      transition: all 0.15s ease;
      cursor: pointer;
    }

    .btn-secondary:hover {
      background-color: rgba(255, 255, 255, 0.06);
      color: #FFFFFF;
      border-color: rgba(255, 255, 255, 0.2);
    }

    .footer-note {
      font-size: 11.5px;
      color: var(--color-text-muted);
      line-height: 1.4;
      margin-top: 4px;
    }
  </style>
</head>
<body>

  <div class="gateway-card">
    <div class="brand-logo">
      <div class="brand-mark">K</div>
      <span class="brand-text">kanto<span class="brand-domain">.mg</span></span>
    </div>

    <div class="spinner-wrap">
      <div class="spinner"></div>
    </div>

    <div class="status-badge">
      <span>Connexion à l'application...</span>
    </div>

    <div class="content-block">
      <h1>Ouverture en cours</h1>
      <p id="status-hint">
        Tentative d'ouverture directe dans l'application Kanto. Si vous ne la possédez pas encore, vous serez redirigé vers l'accès testeur.
      </p>
    </div>

    <div class="actions-list">
      <a href="${nativeSchemeUrl}" class="btn-primary" id="btn-open-app">
        <span>Ouvrir dans l'application</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>

      <a href="${betaRedirectUrl}" class="btn-secondary" id="btn-fallback-beta">
        <span>Pas encore l'application ? Rejoindre la bêta</span>
      </a>
    </div>

    <div class="footer-note">
      Application en phase de test fermé sur Google Play • Accès sur invitation
    </div>
  </div>

  <script>
    (function() {
      var nativeUrl = "${nativeSchemeUrl}";
      var betaUrl = "${betaRedirectUrl}";
      var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      var appOpened = false;

      function markAppOpened() {
        appOpened = true;
      }

      window.addEventListener('pagehide', markAppOpened);
      window.addEventListener('blur', markAppOpened);
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) markAppOpened();
      });

      if (isMobile) {
        // Tentative immédiate d'ouverture de l'application
        window.location.href = nativeUrl;

        // Détection de non-présence de l'application
        // Si l'utilisateur est toujours actif après 1400ms, redirection vers la page d'inscription bêta
        setTimeout(function() {
          if (!appOpened && !document.hidden) {
            window.location.replace(betaUrl);
          }
        }, 1400);
      } else {
        // Sur ordinateur de bureau, mise à jour du texte
        var hint = document.getElementById('status-hint');
        if (hint) {
          hint.innerText = "Kanto est une application mobile Android. Vous pouvez rejoindre le programme de test ci-dessous pour l'installer sur votre téléphone.";
        }
      }
    })();
  </script>
</body>
</html>`.trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
