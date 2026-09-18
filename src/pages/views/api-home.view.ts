/**
 * Kanto — Page d'accueil officielle de l'API Kanto.
 * Design moderne Terre & Encre avec dark mode, badge de statut temps réel,
 * et annuaire interactif de tous les endpoints de l'API.
 */

export interface ApiHomeViewParams {
  version?: string;
  environment?: string;
  baseUrl?: string;
}

export function renderApiHomePage(params: ApiHomeViewParams): string {
  const version = params.version || '1.0.0';
  const environment = params.environment || process.env.NODE_ENV || 'production';
  const baseUrl = params.baseUrl || process.env.BETTER_AUTH_URL || 'https://api-kanto.gastsar.fr';
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kanto API — Plateforme du Patrimoine Malagasy</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #F8F9FA;
      --surface: #FFFFFF;
      --surface-subtle: #F3F4F6;
      --border: #E5E7EB;
      --border-subtle: #F0F2F5;
      --text: #111827;
      --text-muted: #4B5563;
      --text-subtle: #9CA3AF;
      --brand: #1B5E20;
      --brand-light: #E8F5E9;
      --brand-dark: #0D3311;
      --accent: #D97706;
      --accent-light: #FEF3C7;
      --code-bg: #0F172A;
      --code-text: #E2E8F0;
      --method-get-bg: #EFF6FF;
      --method-get-text: #1D4ED8;
      --method-get-border: #BFDBFE;
      --method-post-bg: #F0FDF4;
      --method-post-text: #15803D;
      --method-post-border: #BBF7D0;
      --method-patch-bg: #FEF3C7;
      --method-patch-text: #B45309;
      --method-patch-border: #FDE68A;
      --radius: 14px;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #09090B;
        --surface: #121215;
        --surface-subtle: #18181C;
        --border: #27272A;
        --border-subtle: #1F1F23;
        --text: #F4F4F5;
        --text-muted: #A1A1AA;
        --text-subtle: #71717A;
        --brand: #22C55E;
        --brand-light: #052E16;
        --brand-dark: #14532D;
        --accent: #F59E0B;
        --accent-light: #351C05;
        --code-bg: #030712;
        --code-text: #F1F5F9;
        --method-get-bg: #082F49;
        --method-get-text: #38BDF8;
        --method-get-border: #075985;
        --method-post-bg: #052E16;
        --method-post-text: #4ADE80;
        --method-post-border: #14532D;
        --method-patch-bg: #351C05;
        --method-patch-text: #FBBF24;
        --method-patch-border: #78350F;
      }
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      padding-bottom: 60px;
    }

    header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(12px);
    }

    .header-inner {
      max-width: 1120px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-logo {
      font-size: 17px;
      font-weight: 800;
      letter-spacing: 2px;
      color: var(--text);
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand-logo span.dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--brand);
      display: inline-block;
      box-shadow: 0 0 10px var(--brand);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.9); }
      100% { opacity: 1; transform: scale(1); }
    }

    .version-tag {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 6px;
      background: var(--surface-subtle);
      border: 1px solid var(--border);
      color: var(--text-muted);
      font-family: 'JetBrains Mono', monospace;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: #16A34A;
      background: #F0FDF4;
      border: 1px solid #DCFCE7;
      padding: 5px 12px;
      border-radius: 9999px;
    }

    @media (prefers-color-scheme: dark) {
      .status-pill {
        background: #052E16;
        border-color: #14532D;
        color: #4ADE80;
      }
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }

    /* Hero Section */
    .hero {
      max-width: 1120px;
      margin: 0 auto;
      padding: 48px 24px 32px 24px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--brand);
      background: var(--brand-light);
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 16px;
    }

    .hero-title {
      font-size: 34px;
      font-weight: 800;
      letter-spacing: -0.8px;
      line-height: 1.25;
      margin-bottom: 14px;
      color: var(--text);
    }

    .hero-subtitle {
      font-size: 16px;
      line-height: 1.6;
      color: var(--text-muted);
      max-width: 760px;
      margin-bottom: 28px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    }

    .stat-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }

    .stat-value {
      font-size: 17px;
      font-weight: 700;
      color: var(--text);
      font-family: 'JetBrains Mono', monospace;
    }

    /* Filter Bar */
    .filter-bar {
      max-width: 1120px;
      margin: 0 auto 24px auto;
      padding: 0 24px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .filter-btn {
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .filter-btn:hover {
      border-color: var(--text-muted);
      color: var(--text);
    }

    .filter-btn.active {
      background: var(--text);
      color: var(--bg);
      border-color: var(--text);
    }

    /* Sections des Endpoints */
    .content {
      max-width: 1120px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .endpoint-category {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
    }

    .category-header {
      padding: 20px 24px;
      background: var(--surface-subtle);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .category-title-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .category-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--text);
    }

    .category-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 9999px;
      background: var(--border);
      color: var(--text-muted);
    }

    .endpoint-list {
      display: flex;
      flex-direction: column;
    }

    .endpoint-row {
      padding: 18px 24px;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: background 0.1s ease;
    }

    .endpoint-row:last-child {
      border-bottom: none;
    }

    .endpoint-row:hover {
      background: var(--surface-subtle);
    }

    .endpoint-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .method-badge {
      font-size: 11px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      padding: 3px 8px;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }

    .method-get {
      background: var(--method-get-bg);
      color: var(--method-get-text);
      border: 1px solid var(--method-get-border);
    }

    .method-post {
      background: var(--method-post-bg);
      color: var(--method-post-text);
      border: 1px solid var(--method-post-border);
    }

    .method-patch {
      background: var(--method-patch-bg);
      color: var(--method-patch-text);
      border: 1px solid var(--method-patch-border);
    }

    .endpoint-path {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13.5px;
      font-weight: 600;
      color: var(--text);
      text-decoration: none;
    }

    .endpoint-path:hover {
      color: var(--brand);
      text-decoration: underline;
    }

    .endpoint-desc {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .endpoint-params {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 4px;
    }

    .param-pill {
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      background: var(--bg);
      border: 1px solid var(--border);
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--text-subtle);
    }

    /* Footer */
    footer {
      max-width: 1120px;
      margin: 48px auto 0 auto;
      padding: 24px;
      border-top: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      color: var(--text-subtle);
      font-size: 13px;
    }

    @media (min-width: 640px) {
      footer {
        flex-direction: row;
      }
    }

    .footer-links {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .footer-links a {
      color: var(--text-muted);
      text-decoration: none;
    }

    .footer-links a:hover {
      color: var(--text);
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <!-- Header de Navigation -->
  <header>
    <div class="header-inner">
      <div class="brand-group">
        <div class="brand-logo">
          <span class="dot"></span>
          KANTO API
        </div>
        <span class="version-tag">v${version}</span>
      </div>
      <div class="header-actions">
        <div class="status-pill">
          <span class="status-dot"></span>
          Opérationnel
        </div>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <div class="hero">
    <div class="hero-badge">Plateforme Culturelle &amp; Historique Malagasy</div>
    <h1 class="hero-title">API Officielle du Patrimoine Kanto</h1>
    <p class="hero-subtitle">
      Fournit les services backends, l'authentification sécurisée, la synchronisation de progression et le catalogue complet des œuvres littéraires, historiques et civiques de Madagascar.
    </p>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Statut du Service</div>
        <div class="stat-value" style="color: #16A34A;">200 OK • En ligne</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Environnement</div>
        <div class="stat-value">${environment.toUpperCase()}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Base de Données</div>
        <div class="stat-value">PostgreSQL 16</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Authentification</div>
        <div class="stat-value">Better-Auth 1.2</div>
      </div>
    </div>
  </div>

  <!-- Filtres par catégorie -->
  <div class="filter-bar">
    <button class="filter-btn active" onclick="filterCat('all')">Tous les endpoints</button>
    <button class="filter-btn" onclick="filterCat('auth')">Authentification &amp; Comptes</button>
    <button class="filter-btn" onclick="filterCat('litterature')">Littérature &amp; Culture</button>
    <button class="filter-btn" onclick="filterCat('histoire')">Histoire &amp; Civique</button>
    <button class="filter-btn" onclick="filterCat('jeux')">Jeux Éducatifs</button>
    <button class="filter-btn" onclick="filterCat('pages')">Pages Web Légales</button>
  </div>

  <!-- Liste des Endpoints -->
  <main class="content">

    <!-- 1. AUTH & COMPTES -->
    <div class="endpoint-category" data-category="auth">
      <div class="category-header">
        <div class="category-title-group">
          <span class="category-title">Authentification, Confirmation &amp; Comptes</span>
          <span class="category-badge">Better-Auth &amp; Sécurité</span>
        </div>
      </div>
      <div class="endpoint-list">
        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/confirmation" class="endpoint-path">/confirmation</a>
          </div>
          <div class="endpoint-desc">Validation et page web de confirmation d'adresse email (supporte ?token=..., ?status=already_confirmed, ?error=TOKEN_EXPIRED).</div>
          <div class="endpoint-params">
            <span class="param-pill">Query: token?</span>
            <span class="param-pill">Query: status?</span>
            <span class="param-pill">Query: error?</span>
          </div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/health" class="endpoint-path">/health</a>
          </div>
          <div class="endpoint-desc">Diagnostic de santé du service backend (statut, timestamp et nom du service).</div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-post">POST</span>
            <span class="endpoint-path">/api/auth/sign-in/email</span>
          </div>
          <div class="endpoint-desc">Connexion par email et mot de passe avec émission de session sécurisée.</div>
          <div class="endpoint-params">
            <span class="param-pill">Body: email</span>
            <span class="param-pill">Body: password</span>
          </div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-post">POST</span>
            <span class="endpoint-path">/api/auth/sign-up/email</span>
          </div>
          <div class="endpoint-desc">Inscription d'un nouveau compte avec déclenchement automatique de l'email de confirmation.</div>
          <div class="endpoint-params">
            <span class="param-pill">Body: name</span>
            <span class="param-pill">Body: email</span>
            <span class="param-pill">Body: password</span>
          </div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <span class="endpoint-path">/users/me</span>
          </div>
          <div class="endpoint-desc">Profil complet de l'utilisateur connecté (statistiques, niveau, XP, rôle).</div>
          <div class="endpoint-params">
            <span class="param-pill">Header: Authorization Bearer</span>
          </div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <span class="endpoint-path">/friends</span>
          </div>
          <div class="endpoint-desc">Liste des amis confirmés avec statut d'encouragement journalier.</div>
        </div>
      </div>
    </div>

    <!-- 2. LITTÉRATURE & CULTURE -->
    <div class="endpoint-category" data-category="litterature">
      <div class="category-header">
        <div class="category-title-group">
          <span class="category-title">Littérature, Culture &amp; Tradition Malgache</span>
          <span class="category-badge">Patrimoine Textuel</span>
        </div>
      </div>
      <div class="endpoint-list">
        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/items" class="endpoint-path">/items</a>
          </div>
          <div class="endpoint-desc">Proverbes malgaches (Ohabolana), expressions imagées et dictons traditionnels avec traductions et explications culturelles.</div>
          <div class="endpoint-params">
            <span class="param-pill">Query: type (PROVERBE | EXPRESSION | DICTON)</span>
            <span class="param-pill">Query: search</span>
            <span class="param-pill">Query: theme</span>
          </div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/poesies" class="endpoint-path">/poesies</a>
          </div>
          <div class="endpoint-desc">Anthologie des poèmes malgaches (Tononkalo) des grands poètes nationaux (Dox, Rado, Jean-Joseph Rabearivelo, Ny Avana Ramanantoanina).</div>
          <div class="endpoint-params">
            <span class="param-pill">Query: author</span>
            <span class="param-pill">Query: search</span>
          </div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/contes" class="endpoint-path">/contes</a>
          </div>
          <div class="endpoint-desc">Contes traditionnels malgaches (Angano) avec synthèse audio vocale immersive (Gemini TTS).</div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/kabary" class="endpoint-path">/kabary</a>
          </div>
          <div class="endpoint-desc">Discours cérémoniels traditionnels malgaches (vodiondry, famangiana, fisaorana) et structure oratoire.</div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/citations" class="endpoint-path">/citations</a>
          </div>
          <div class="endpoint-desc">Pensées et maximes des figures emblématiques et penseurs malgaches.</div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/recitations" class="endpoint-path">/recitations</a>
          </div>
          <div class="endpoint-desc">Récitations traditionnelles et tsianjery pour la transmission mémorielle.</div>
        </div>
      </div>
    </div>

    <!-- 3. HISTOIRE & CIVIQUE -->
    <div class="endpoint-category" data-category="histoire">
      <div class="category-header">
        <div class="category-title-group">
          <span class="category-title">Histoire, Numismatique &amp; Éducation Civique</span>
          <span class="category-badge">Histoire &amp; Citoyenneté</span>
        </div>
      </div>
      <div class="endpoint-list">
        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/history/presidents" class="endpoint-path">/history/presidents</a>
          </div>
          <div class="endpoint-desc">Biographies, mandats et réalisations des présidents de la République de Madagascar depuis 1958.</div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/history/emblems" class="endpoint-path">/history/emblems</a>
          </div>
          <div class="endpoint-desc">Sceaux officiels, drapeaux et emblèmes d'État de Madagascar à travers les républiques.</div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/history/banknotes" class="endpoint-path">/history/banknotes</a>
          </div>
          <div class="endpoint-desc">Collection numismatique complète (Ariary et Franc Malgache), histoire des coupures et symbolismes illustrés.</div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/history/provinces" class="endpoint-path">/history/provinces</a>
          </div>
          <div class="endpoint-desc">Les 6 provinces historiques de Madagascar : Antananarivo, Antsiranana, Fianarantsoa, Mahajanga, Toamasina, Toliara.</div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/history/dates" class="endpoint-path">/history/dates</a>
          </div>
          <div class="endpoint-desc">Frise chronologique des dates repères de l'histoire de Madagascar.</div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/history/nature" class="endpoint-path">/history/nature</a>
          </div>
          <div class="endpoint-desc">Biodiversité endémique sacrée (Baobabs, Lémuriens, Raphia, Ravinala) et traditions écologiques.</div>
        </div>
      </div>
    </div>

    <!-- 4. JEUX & GAMIFICATION -->
    <div class="endpoint-category" data-category="jeux">
      <div class="category-header">
        <div class="category-title-group">
          <span class="category-title">Jeux Éducatifs &amp; Compétition Communautaire</span>
          <span class="category-badge">Gamification</span>
        </div>
      </div>
      <div class="endpoint-list">
        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/games/true-false/random" class="endpoint-path">/games/true-false/random</a>
          </div>
          <div class="endpoint-desc">Génération de questions de quiz Vrai ou Faux sur la culture et les coutumes malgaches.</div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/games/riddle/daily" class="endpoint-path">/games/riddle/daily</a>
          </div>
          <div class="endpoint-desc">L'énigme / devinette malgache du jour (Ankamantatra) avec indices progressifs.</div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/leaderboard" class="endpoint-path">/leaderboard</a>
          </div>
          <div class="endpoint-desc">Classements compétitifs des utilisateurs par points d'expérience (XP) et séries de connexions quotidiennes.</div>
        </div>
      </div>
    </div>

    <!-- 5. PAGES LÉGALES & SUPPORT -->
    <div class="endpoint-category" data-category="pages">
      <div class="category-header">
        <div class="category-title-group">
          <span class="category-title">Pages Web Légales &amp; Support Mobile</span>
          <span class="category-badge">WebView &amp; Web</span>
        </div>
      </div>
      <div class="endpoint-list">
        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/pages/privacy" class="endpoint-path">/pages/privacy</a>
          </div>
          <div class="endpoint-desc">Politique de confidentialité et protection des données personnelles (supporte ?embed=true pour WebView).</div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/pages/terms" class="endpoint-path">/pages/terms</a>
          </div>
          <div class="endpoint-desc">Conditions Générales d'Utilisation de l'application et du service Kanto.</div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/pages/help" class="endpoint-path">/pages/help</a>
          </div>
          <div class="endpoint-desc">Centre d'aide, Foire aux Questions (FAQ) et formulaire de support.</div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/pages/about" class="endpoint-path">/pages/about</a>
          </div>
          <div class="endpoint-desc">Présentation de la mission culturelle de Kanto, valeurs et engagement patrimonial.</div>
        </div>

        <div class="endpoint-row">
          <div class="endpoint-meta">
            <span class="method-badge method-get">GET</span>
            <a href="${baseUrl}/pages/licenses" class="endpoint-path">/pages/licenses</a>
          </div>
          <div class="endpoint-desc">Licences logicielles et remerciements aux technologies open-source.</div>
        </div>
      </div>
    </div>

  </main>

  <!-- Footer -->
  <footer>
    <div>
      © ${currentYear} Kanto • Lova, Kolontsaina &amp; Tantara Malagasy
    </div>
    <div class="footer-links">
      <a href="${baseUrl}/pages/about">À propos</a>
      <a href="${baseUrl}/pages/help">Aide</a>
      <a href="${baseUrl}/pages/privacy">Confidentialité</a>
      <a href="${baseUrl}/pages/terms">CGU</a>
    </div>
  </footer>

  <script>
    function filterCat(cat) {
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');

      document.querySelectorAll('.endpoint-category').forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }
  </script>
</body>
</html>
`;
}
