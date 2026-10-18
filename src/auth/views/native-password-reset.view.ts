/**
 * Kanto MG — Page web sécurisée de réinitialisation de mot de passe (Application Native)
 * Accessible sur https://app-kanto.gastsar.fr/reset-password
 *
 * Fonctionnalités :
 * 1. Deep linking automatique / bouton direct vers l'application mobile Kanto MG (kantomg://reset-password?token=...).
 * 2. Solution de secours web complète permettant la saisie du nouveau mot de passe sans quitter le navigateur si l'app n'est pas installée.
 * 3. Validation de sécurité côté client et communication avec l'API Better-Auth (/api/auth/reset-password).
 * 4. Respect strict de la charte visuelle Kanto MG (vert émeraude, terracotta, typographie soignée).
 */

export interface NativePasswordResetViewParams {
  token?: string;
  email?: string;
  error?: string;
}

export function renderNativePasswordResetPage(
  params: NativePasswordResetViewParams,
): string {
  const { token = '', error = '' } = params;
  const safeToken = token ? encodeURIComponent(token) : '';
  const deepLinkAppUrl = safeToken
    ? `kantomg://reset-password?token=${safeToken}`
    : 'kantomg://login';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title>Réinitialisation de mot de passe — Kanto MG</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --kanto-green: #16442A;
      --kanto-green-dark: #0D2B1A;
      --kanto-green-light: #245E3B;
      --kanto-terracotta: #C85A32;
      --kanto-terracotta-hover: #B24E2B;
      --kanto-bg: #F9F8F5;
      --kanto-card-bg: #FFFFFF;
      --kanto-text: #191B1F;
      --kanto-text-muted: #5E6573;
      --kanto-border: #E6E4DF;
      --kanto-error: #D9383A;
      --kanto-success: #1E8E3E;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--kanto-bg);
      color: var(--kanto-text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    .container {
      width: 100%;
      max-width: 440px;
      margin: 0 auto;
    }

    .brand-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .brand-logo-box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, var(--kanto-green) 0%, var(--kanto-green-dark) 100%);
      color: #FFFFFF;
      font-weight: 800;
      font-size: 24px;
      letter-spacing: -0.5px;
      box-shadow: 0 10px 24px rgba(22, 68, 42, 0.2);
      margin-bottom: 12px;
    }

    .brand-title {
      font-size: 22px;
      font-weight: 800;
      color: var(--kanto-green-dark);
      letter-spacing: -0.4px;
    }

    .brand-subtitle {
      font-size: 13px;
      color: var(--kanto-text-muted);
      font-weight: 500;
      margin-top: 2px;
    }

    .card {
      background: var(--kanto-card-bg);
      border-radius: 24px;
      padding: 32px 28px;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.07), 0 0 0 1px var(--kanto-border);
      position: relative;
      overflow: hidden;
    }

    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--kanto-terracotta) 0%, var(--kanto-green) 100%);
    }

    .screen-title {
      font-size: 19px;
      font-weight: 700;
      color: var(--kanto-text);
      margin-bottom: 8px;
    }

    .screen-description {
      font-size: 13px;
      color: var(--kanto-text-muted);
      margin-bottom: 24px;
      line-height: 1.5;
    }

    /* Option 1 : Bouton Deep Link vers l'application */
    .app-open-section {
      background: #F2F7F4;
      border: 1px solid #D5E5DC;
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 24px;
      text-align: center;
    }

    .app-open-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--kanto-green-dark);
      margin-bottom: 10px;
    }

    .btn-app {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 12px 18px;
      border-radius: 12px;
      background: var(--kanto-green);
      color: #FFFFFF;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
    }

    .btn-app:hover {
      background: var(--kanto-green-light);
      transform: translateY(-1px);
    }

    .divider-box {
      display: flex;
      align-items: center;
      margin: 20px 0;
      color: var(--kanto-text-muted);
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .divider-box::before,
    .divider-box::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--kanto-border);
    }

    .divider-box span {
      padding: 0 12px;
    }

    /* Formulaire web de secours */
    .form-group {
      margin-bottom: 18px;
    }

    .form-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: var(--kanto-text);
      margin-bottom: 6px;
    }

    .input-wrapper {
      position: relative;
    }

    .form-input {
      width: 100%;
      padding: 12px 40px 12px 14px;
      border-radius: 12px;
      border: 1px solid var(--kanto-border);
      background: #FAFAFA;
      font-size: 14px;
      color: var(--kanto-text);
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
    }

    .form-input:focus {
      background: #FFFFFF;
      border-color: var(--kanto-green);
      box-shadow: 0 0 0 3px rgba(22, 68, 42, 0.12);
    }

    .btn-toggle-pwd {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--kanto-text-muted);
      cursor: pointer;
      font-size: 12px;
      padding: 4px;
    }

    .password-hint {
      font-size: 11px;
      color: var(--kanto-text-muted);
      margin-top: 5px;
    }

    .btn-submit {
      width: 100%;
      padding: 14px;
      border-radius: 12px;
      background: var(--kanto-terracotta);
      color: #FFFFFF;
      font-size: 14px;
      font-weight: 700;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 10px;
    }

    .btn-submit:hover:not(:disabled) {
      background: var(--kanto-terracotta-hover);
      transform: translateY(-1px);
    }

    .btn-submit:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    /* Alertes & Feedbacks */
    .alert {
      padding: 12px 14px;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.4;
      margin-bottom: 18px;
      display: none;
    }

    .alert-error {
      background: #FDF2F2;
      border: 1px solid #F8D7DA;
      color: var(--kanto-error);
    }

    .alert-success {
      background: #EDF7ED;
      border: 1px solid #D4EDDA;
      color: var(--kanto-success);
    }

    .state-success-box {
      text-align: center;
      padding: 16px 0;
      display: none;
    }

    .success-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #E8F5E9;
      color: var(--kanto-success);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      margin-bottom: 16px;
    }

    .footer {
      text-align: center;
      margin-top: 24px;
      font-size: 12px;
      color: var(--kanto-text-muted);
    }

    .footer a {
      color: var(--kanto-green);
      text-decoration: none;
      font-weight: 600;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      border-top-color: #FFFFFF;
      animation: spin 0.8s linear infinite;
      display: none;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="brand-header">
      <div class="brand-logo-box">K</div>
      <h1 class="brand-title">Kanto MG</h1>
      <p class="brand-subtitle">Lova, Kolontsaina & Tantara Malagasy</p>
    </div>

    <div class="card">
      <div id="alertBox" class="alert alert-error"></div>

      <!-- Écran de confirmation de succès -->
      <div id="successView" class="state-success-box">
        <div class="success-icon">✓</div>
        <h2 class="screen-title" style="color: var(--kanto-success);">Mot de passe réinitialisé !</h2>
        <p class="screen-description">
          Votre mot de passe a été modifié avec succès. Toutes vos anciennes sessions ont été sécurisées. Vous pouvez maintenant vous connecter sur l'application Kanto MG.
        </p>
        <a href="kantomg://login" class="btn-app" style="margin-top: 12px;">
          Ouvrir l'application Kanto
        </a>
      </div>

      <!-- Écran formulaire principal -->
      <div id="formView">
        <h2 class="screen-title">Nouveau mot de passe</h2>
        <p class="screen-description">
          Définissez un mot de passe sécurisé pour reprendre votre découverte culturelle sur Kanto MG.
        </p>

        ${
          safeToken
            ? `
        <!-- Option 1 : Ouvrir directement dans l'application native installée -->
        <div class="app-open-section">
          <p class="app-open-title">📱 Vous utilisez un smartphone ?</p>
          <a href="${deepLinkAppUrl}" class="btn-app" id="btnOpenApp">
            Continuer dans l'application Kanto
          </a>
        </div>

        <div class="divider-box">
          <span>Ou réinitialiser ici sur le web</span>
        </div>
        `
            : ''
        }

        <form id="resetForm" onsubmit="handlePasswordSubmit(event)">
          <div class="form-group">
            <label class="form-label" for="password">Nouveau mot de passe</label>
            <div class="input-wrapper">
              <input
                type="password"
                id="password"
                class="form-input"
                placeholder="Au moins 8 caractères"
                required
                autocomplete="new-password"
              />
              <button type="button" class="btn-toggle-pwd" onclick="togglePasswordVisibility('password', this)">
                👁️
              </button>
            </div>
            <p class="password-hint">8 caractères minimum avec chiffres et lettres.</p>
          </div>

          <div class="form-group">
            <label class="form-label" for="confirmPassword">Confirmez le mot de passe</label>
            <div class="input-wrapper">
              <input
                type="password"
                id="confirmPassword"
                class="form-input"
                placeholder="Retapez votre mot de passe"
                required
                autocomplete="new-password"
              />
              <button type="button" class="btn-toggle-pwd" onclick="togglePasswordVisibility('confirmPassword', this)">
                👁️
              </button>
            </div>
          </div>

          <button type="submit" id="btnSubmit" class="btn-submit">
            <span class="spinner" id="spinner"></span>
            <span id="btnText">Enregistrer mon mot de passe</span>
          </button>
        </form>
      </div>
    </div>

    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Kanto MG — Patrimoine & Culture Malagasy</p>
    </div>
  </div>

  <script>
    const token = ${JSON.stringify(token)};
    const initialError = ${JSON.stringify(error)};

    if (initialError) {
      showError(initialError);
    }

    // Basculer la visibilité d'un champ mot de passe
    function togglePasswordVisibility(fieldId, btn) {
      const input = document.getElementById(fieldId);
      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🔒';
      } else {
        input.type = 'password';
        btn.textContent = '👁️';
      }
    }

    function showError(message) {
      const alertBox = document.getElementById('alertBox');
      alertBox.textContent = message;
      alertBox.className = 'alert alert-error';
      alertBox.style.display = 'block';
    }

    async function handlePasswordSubmit(e) {
      e.preventDefault();
      const alertBox = document.getElementById('alertBox');
      alertBox.style.display = 'none';

      if (!token) {
        showError('Lien de réinitialisation invalide ou token manquant. Veuillez faire une nouvelle demande.');
        return;
      }

      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (!password || password.length < 8) {
        showError('Le mot de passe doit comporter au moins 8 caractères.');
        return;
      }

      if (password !== confirmPassword) {
        showError('Les deux mots de passe ne correspondent pas.');
        return;
      }

      const btnSubmit = document.getElementById('btnSubmit');
      const spinner = document.getElementById('spinner');
      const btnText = document.getElementById('btnText');

      btnSubmit.disabled = true;
      spinner.style.display = 'inline-block';
      btnText.textContent = 'Mise à jour en cours...';

      try {
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Client-Context': 'native'
          },
          body: JSON.stringify({
            token: token,
            newPassword: password
          })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.error) {
          const errMsg = data.error?.message || (response.status === 403
            ? "Ce lien de réinitialisation est invalide pour ce contexte."
            : "Ce lien a expiré ou a déjà été utilisé. Veuillez redemander un lien.");
          showError(errMsg);
          btnSubmit.disabled = false;
          spinner.style.display = 'none';
          btnText.textContent = 'Enregistrer mon mot de passe';
          return;
        }

        // Affichage vue de succès
        document.getElementById('formView').style.display = 'none';
        document.getElementById('successView').style.display = 'block';
      } catch (err) {
        showError('Une erreur réseau est survenue. Veuillez vérifier votre connexion.');
        btnSubmit.disabled = false;
        spinner.style.display = 'none';
        btnText.textContent = 'Enregistrer mon mot de passe';
      }
    }
  </script>
</body>
</html>`;
}
