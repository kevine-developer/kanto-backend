/**
 * Kanto MG — Expérience Éditoriale Immersive du Portail Officiel
 * « Kanto — La culture malgache, autrement »
 */

export interface BetaLandingContentOptions {
  legalBaseUrl: string;
  supportEmail: string;
  countBadgeText: string;
  initialTab: string;
  isRegistered: boolean;
  emailVal: string;
  errorVal: string;
  tokenVal: string;
  currentYear: number;
}

export function renderBetaLandingBody(opt: BetaLandingContentOptions): string {
  const {
    legalBaseUrl,
    supportEmail,
    countBadgeText,
    initialTab,
    isRegistered,
    emailVal,
    errorVal,
    currentYear,
  } = opt;

  return `
  <!-- En-tête institutionnel & navigation éditoriale -->
  <header>
    <a href="/" class="brand" aria-label="kanto.mg - Portail officiel">
      <div class="brand-logo-wrap">
        <img
          src="/logo.png"
          alt="Logo officiel Kanto MG"
          class="brand-logo"
          width="36"
          height="36"
          onerror="this.onerror=null; this.src='/favicon.png';"
        />
      </div>
      <div class="brand-text-wrap">
        <span class="brand-name">kanto<span class="brand-domain">.mg</span></span>
        <span class="brand-tag">Lova sy Kolontsaina</span>
      </div>
    </a>

    <!-- Navigation rapide vers les 6 univers culturels -->
    <nav class="header-nav" aria-label="Navigation culturelle">
      <a href="#univers" class="header-nav-link">Les 6 Trésors</a>
      <a href="/ohabolana" class="header-nav-link">Ohabolana</a>
      <a href="/angano" class="header-nav-link">Angano</a>
      <a href="/kabary" class="header-nav-link">Kabary</a>
      <a href="/tononkalo" class="header-nav-link">Tononkalo</a>
      <a href="/histoire" class="header-nav-link">Tantara</a>
    </nav>

    <div class="header-actions">
      <!-- Basculeur de thème sombre / clair -->
      <button type="button" class="theme-toggle-btn" id="theme-toggle" aria-label="Basculer le thème d'affichage">
        <svg id="theme-icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        <svg id="theme-icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      </button>

      <!-- Pastille de statut testeurs en direct -->
      <div class="status-pill" title="Membres pionniers inscrits à la communauté Kanto">
        <span class="status-indicator"></span>
        <span id="header-tester-count">${countBadgeText}</span>
      </div>

      <!-- Bouton d'action direct Télécharger -->
      <a href="#telechargement" class="header-cta-btn">
        <span>Obtenir l'application</span>
        <span aria-hidden="true">↓</span>
      </a>
    </div>
  </header>

  <main>
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- HERO SECTION ASYMÉTRIQUE MONUMENTAL                                    -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="hero-editorial" aria-labelledby="hero-main-title">
      <div class="hero-content">
        <div class="eyebrow-pill">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <span>Édition Officielle • Madagascar</span>
        </div>

        <h1 id="hero-main-title" class="hero-title">
          La culture malgache, <em>autrement.</em>
        </h1>

        <div class="hero-subtitle-mg">
          Lova • Kolontsaina • Fahendrena
        </div>

        <p class="hero-lead">
          Kanto MG est un sanctuaire numérique d'exception dédié au rayonnement et à la transmission vivante du patrimoine de Madagascar. Proverbes ancestraux (<em>Ohabolana</em>), récits des veillées (<em>Angano</em>), éloquence oratoire (<em>Kabary</em>) et poésie des Hauts Plateaux réunis dans une expérience mobile sobre, exigeante et accessible à tous.
        </p>

        <div class="hero-actions-group">
          <a href="#telechargement" class="btn-hero-primary">
            <span>Rejoindre l'avant-première</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
          <a href="#univers" class="btn-hero-secondary">
            <span>Explorer les 6 univers</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </a>
        </div>

        <!-- Métriques réelles de réassurance -->
        <div class="hero-badges-row">
          <div class="hero-stat-item">
            <span class="hero-stat-value">5.0 / 5</span>
            <span class="hero-stat-label">Avis certifiés communauté</span>
          </div>
          <div class="hero-stat-item">
            <span class="hero-stat-value">100%</span>
            <span class="hero-stat-label">Accessible hors-ligne</span>
          </div>
          <div class="hero-stat-item">
            <span class="hero-stat-value">Bilingue</span>
            <span class="hero-stat-label">Malagasy &amp; Français</span>
          </div>
          <div class="hero-stat-item">
            <span class="hero-stat-value">Android &amp; iOS</span>
            <span class="hero-stat-label">Google Play &amp; TestFlight</span>
          </div>
        </div>
      </div>

      <!-- Composition graphique : Mockup Smartphone Kanto réel -->
      <div class="hero-visual-frame" aria-hidden="true">
        <div class="phone-mockup-wrapper">
          <div class="phone-screen">
            <div class="phone-notch"></div>

            <!-- Proverbe du jour dans l'application -->
            <div class="phone-proverb-card">
              <span class="phone-card-tag">Ohabolana anio • Proverbe du jour</span>
              <div class="phone-proverb-mg">
                « Ny fihavanana toy ny kofehy manify, ka raha tapaka azo tohizana, fa mitondra vonga. »
              </div>
              <div class="phone-proverb-fr">
                La solidarité fraternelle est semblable à un fil délicat : rompue, on peut la renouer, mais elle garde toujours un nœud.
              </div>
              <div class="phone-audio-pill">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                <span>Écoute audio malgache</span>
              </div>
            </div>

            <!-- Grille des univers dans le mockup -->
            <div class="phone-hubs-grid">
              <div class="phone-hub-item">
                <div class="phone-hub-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                </div>
                <span class="phone-hub-name">Ohabolana</span>
              </div>
              <div class="phone-hub-item">
                <div class="phone-hub-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <span class="phone-hub-name">Angano</span>
              </div>
              <div class="phone-hub-item">
                <div class="phone-hub-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                </div>
                <span class="phone-hub-name">Kabary</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- SECTION LES SIX TRÉSORS DE KANTO (COMPOSITION ASYMÉTRIQUE)            -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="editorial-section" id="univers" aria-labelledby="univers-title">
      <div class="section-header-editorial">
        <span class="section-eyebrow">Les Richesses de Kanto MG</span>
        <h2 id="univers-title" class="section-title-editorial">Six univers pour explorer l'âme malgache.</h2>
        <p class="section-lead-editorial">
          Chaque rubrique a été pensée comme un chapitre vivant de notre héritage, alliant rigueur linguistique, contexte culturel et esthétique contemporaine.
        </p>
      </div>

      <div class="univers-bento-grid">
        <!-- 1. Ohabolana (Majeur Heroic) -->
        <a href="/ohabolana" class="bento-card bento-card-heroic">
          <div>
            <div class="bento-card-top">
              <div class="bento-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              </div>
              <span class="bento-number">01</span>
            </div>
            <div class="bento-card-body" style="margin-top: 18px;">
              <h3>Ohabolana sy Fahendrena</h3>
              <p>
                Des centaines de proverbes traditionnels décryptés avec leur portée philosophique, leur équivalent en français et des exemples d'usage au quotidien.
              </p>
              <div class="bento-quote-sample">
                « Izay mahay sobika mahay fatan-dronono. » — La maîtrise des grandes choses commence par la précision dans les petites.
              </div>
            </div>
          </div>
          <div class="bento-card-foot">
            <span>Explorer la sagesse des Ohabolana</span>
            <span>→</span>
          </div>
        </a>

        <!-- 2. Angano (Side) -->
        <a href="/angano" class="bento-card bento-card-side">
          <div>
            <div class="bento-card-top">
              <div class="bento-icon-box" style="background: var(--color-tanimbary-soft); color: var(--color-tanimbary);">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <span class="bento-number">02</span>
            </div>
            <div class="bento-card-body" style="margin-top: 18px;">
              <h3>Angano sy Lovantsofina</h3>
              <p>
                Les récits légendaires des veillées au clair de lune : les ruses d'Ikotofetsy sy Imahakà, la force de Darafify et les contes moraux qui ont bercé l'enfance malgache.
              </p>
            </div>
          </div>
          <div class="bento-card-foot">
            <span>Lire les contes</span>
            <span>→</span>
          </div>
        </a>

        <!-- 3. Kabary (Third) -->
        <a href="/kabary" class="bento-card bento-card-third">
          <div>
            <div class="bento-card-top">
              <div class="bento-icon-box" style="background: var(--color-ochre-soft); color: var(--color-ochre);">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
              </div>
              <span class="bento-number">03</span>
            </div>
            <div class="bento-card-body" style="margin-top: 18px;">
              <h3>Kabary &amp; Art Oratoire</h3>
              <p>
                L'éloquence sacrée des orateurs traditionnels (<em>Mpikabary</em>) pour le mariage, les réjouissances et les étapes fondatrices de la vie sociale.
              </p>
            </div>
          </div>
          <div class="bento-card-foot">
            <span>Découvrir le Kabary</span>
            <span>→</span>
          </div>
        </a>

        <!-- 4. Tononkalo & Tsianjery (Third) -->
        <a href="/tononkalo" class="bento-card bento-card-third">
          <div>
            <div class="bento-card-top">
              <div class="bento-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
              </div>
              <span class="bento-number">04</span>
            </div>
            <div class="bento-card-body" style="margin-top: 18px;">
              <h3>Tononkalo &amp; Haisoratra</h3>
              <p>
                La poésie malgache contemporaine et classique : Rado, Dox, Jean-Joseph Rabearivelo, avec module de mémorisation guidée (Tsianjery).
              </p>
            </div>
          </div>
          <div class="bento-card-foot">
            <span>Parcourir les poèmes</span>
            <span>→</span>
          </div>
        </a>

        <!-- 5. Raki-teny (Third) -->
        <a href="/raki-teny" class="bento-card bento-card-third">
          <div>
            <div class="bento-card-top">
              <div class="bento-icon-box" style="background: var(--color-tanimbary-soft); color: var(--color-tanimbary);">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              </div>
              <span class="bento-number">05</span>
            </div>
            <div class="bento-card-body" style="margin-top: 18px;">
              <h3>Raki-teny &amp; Voambolana</h3>
              <p>
                Dictionnaire thématique bilingue, subtilités du vocabulaire, étymologies austronésiennes et richesse des dialectes des régions de l'île.
              </p>
            </div>
          </div>
          <div class="bento-card-foot">
            <span>Consulter le dictionnaire</span>
            <span>→</span>
          </div>
        </a>

        <!-- 6. Tantara & Fomba (Half) -->
        <a href="/histoire" class="bento-card bento-card-heroic" style="grid-column: span 12; background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-tanimbary-soft) 100%); border-left: 4px solid var(--color-tanimbary);">
          <div>
            <div class="bento-card-top">
              <div class="bento-icon-box" style="background: var(--color-tanimbary-soft); color: var(--color-tanimbary);">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <span class="bento-number">06</span>
            </div>
            <div class="bento-card-body" style="margin-top: 18px;">
              <h3>Tantara, Fomba Gasy &amp; Repères Civiques</h3>
              <p>
                Histoire des souverains, organisation des clans, valeurs du Fihavanana, us et coutumes des 18 ethnies et repères républicains pour comprendre Madagascar dans toute sa profondeur.
              </p>
            </div>
          </div>
          <div class="bento-card-foot">
            <span>Explorer l'histoire et les coutumes</span>
            <span>→</span>
          </div>
        </a>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- SECTION EXPÉRIENCE MOBILE & SANCTUAIRE CULTUREL                       -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="experience-strip" aria-labelledby="experience-title">
      <span class="section-eyebrow">Conçu pour la transmission</span>
      <h2 id="experience-title" class="section-title-editorial">Un sanctuaire culturel dans le creux de votre main.</h2>
      <p class="section-lead-editorial">
        Kanto MG a été façonné avec l'exigence d'un beau livre et la fluidité d'un produit moderne.
      </p>

      <div class="pillars-grid">
        <div class="pillar-item">
          <div class="pillar-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"></path><path d="M12 6v6l4 2"></path></svg>
          </div>
          <h4>Sans distraction</h4>
          <p>Zéro publicité intrusive, zéro traçage commercial. Un sanctuaire apaisé dédié uniquement à la lecture, à la contemplation et au respect des textes.</p>
        </div>

        <div class="pillar-item">
          <div class="pillar-icon-wrap" style="background: var(--color-terracotta-soft); color: var(--color-terracotta);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1l22 22"></path><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
          </div>
          <h4>100% Hors-ligne</h4>
          <p>Voyagez sereinement. Vos contes, proverbes, dictionnaire et poésies restent entièrement accessibles même sans réseau mobile sur les routes de Madagascar.</p>
        </div>

        <div class="pillar-item">
          <div class="pillar-icon-wrap" style="background: var(--color-ochre-soft); color: var(--color-ochre);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          </div>
          <h4>Audio &amp; Phonétique</h4>
          <p>Écoutez les prononciations authentiques enregistrées par des locuteurs natifs pour apprécier la musicalité et la nuance de chaque accent régional.</p>
        </div>

        <div class="pillar-item">
          <div class="pillar-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
          </div>
          <h4>Révision &amp; Jeux</h4>
          <p>Ankamantatra (devinettes), mots croisés culturels, quiz civiques et répétition espacée pour ancrer les connaissances de manière ludique et durable.</p>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- SECTION AVIS DE LA COMMUNAUTÉ (DONNÉES EN DIRECT DE L'API)            -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="reviews-section-editorial" id="section-community-reviews" aria-labelledby="reviews-section-title">
      <div class="reviews-header-modern">
        <div>
          <span class="section-eyebrow">Retours d'expérience</span>
          <h2 id="reviews-section-title" class="reviews-title">Ce que dit notre communauté</h2>
          <p class="reviews-subtitle">
            Retours authentiques partagés par nos membres et testeurs pionniers de Madagascar et de la diaspora.
          </p>
        </div>

        <!-- Badge de confiance certifié -->
        <div class="reviews-trust-pill" id="reviews-trust-badge">
          <div class="trust-pill-score" id="reviews-avg-rating">5.0</div>
          <div class="trust-pill-info">
            <div class="trust-pill-stars" id="reviews-avg-stars">
              ★★★★★
            </div>
            <div class="trust-pill-label" id="reviews-total-count">Avis certifiés</div>
          </div>
        </div>
      </div>

      <!-- Grille dynamique des avis certifiés (générée par /beta-waitlist.js) -->
      <div class="reviews-list-grid" id="reviews-cards-list">
        <div class="reviews-empty-state">Chargement des avis vérifiés de la communauté...</div>
      </div>

      <!-- Pagination AJAX fluide -->
      <div class="reviews-pagination-box" id="reviews-pagination-box" style="display: none;">
        <button type="button" class="btn-secondary" id="btn-load-more-reviews">
          <span>Découvrir plus de témoignages</span>
          <span aria-hidden="true">↓</span>
        </button>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- SECTION CONVERSION : TÉLÉCHARGEMENT & INSCRIPTION BÊTA                -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section class="conversion-section" id="telechargement" aria-labelledby="conversion-title">
      <div class="conversion-header">
        <span class="section-eyebrow">Accès Anticipé &amp; Téléchargement</span>
        <h2 id="conversion-title" class="conversion-title">Rejoignez l'aventure Kanto MG</h2>
        <p class="conversion-desc">
          Participez aux tests fermés sur Android et iOS, ou téléchargez la dernière version disponible pour faire rayonner la culture malgache.
        </p>
      </div>

      <!-- Onglets interactifs -->
      <div class="tabs-nav" role="tablist">
        <button type="button" class="tab-btn ${initialTab === 'register' && !isRegistered ? 'active' : ''}" id="tab-btn-register" role="tab" aria-selected="${initialTab === 'register' && !isRegistered}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          <span>Inscription Bêta</span>
        </button>
        <button type="button" class="tab-btn ${initialTab === 'download' ? 'active' : ''}" id="tab-btn-download" role="tab" aria-selected="${initialTab === 'download'}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>Téléchargement</span>
        </button>
        <button type="button" class="tab-btn ${initialTab === 'already_registered' || isRegistered ? 'active' : ''}" id="tab-btn-already" role="tab" style="display: none;">
          <span>Mon Espace</span>
        </button>
      </div>

      <!-- Bannières d'alerte et de confirmation -->
      <div id="error-banner" class="banner error">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span id="error-text">${errorVal}</span>
      </div>
      <div id="success-banner" class="banner success">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span id="success-text"></span>
      </div>

      <!-- ─── VOLET 1 : FORMULAIRE D'INSCRIPTION BÊTA ────────────────────────── -->
      <div id="panel-register" style="display: ${initialTab === 'register' && !isRegistered ? 'block' : 'none'};">
        <form id="waitlist-form" class="form-container">
          <!-- Piège anti-spam invisible -->
          <div class="hp-trap">
            <input type="text" id="hp-website" name="website" tabindex="-1" autocomplete="off">
          </div>

          <div class="field">
            <label class="field-label" for="reg-email">
              <span>Votre adresse e-mail</span>
              <span style="color: var(--color-terracotta);">Requis</span>
            </label>
            <input 
              type="email" 
              id="reg-email" 
              class="field-input" 
              placeholder="ex: nom@domaine.com" 
              required 
              value="${emailVal}"
              autocomplete="email"
            >
            <p class="field-note">
              Adresse utilisée pour votre compte Google Play Store ou Apple ID.
            </p>
          </div>

          <div class="field">
            <label class="field-label" for="reg-name">
              <span>Prénom ou nom public</span>
              <span style="color: var(--color-ink-subtle);">Optionnel</span>
            </label>
            <input 
              type="text" 
              id="reg-name" 
              class="field-input" 
              placeholder="ex: Rova, Faly, Hery..."
              autocomplete="name"
            >
          </div>

          <!-- Choix de plateformes -->
          <div class="field">
            <label class="field-label">
              <span>Appareils sur lesquels vous souhaitez tester Kanto</span>
            </label>
            <div class="platforms-grid">
              <div class="platform-card checked" id="card-android">
                <div class="platform-card-head">
                  <span class="platform-title">Android</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-android);"><path d="M17 19H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2z"></path><circle cx="12" cy="12" r="2"></circle></svg>
                </div>
                <p class="platform-desc">Google Play Closed Testing &amp; APK signé direct.</p>
              </div>

              <div class="platform-card" id="card-ios">
                <div class="platform-card-head">
                  <span class="platform-title">iPhone / iOS</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-ios);"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path><path d="M10 2c1 .5 2 2 2 5"></path></svg>
                </div>
                <p class="platform-desc">Apple TestFlight sur invitation personnelle.</p>
              </div>
            </div>
          </div>

          <!-- Consentements légaux RGPD & CGU -->
          <div class="consent-card-box">
            <div class="consent-item">
              <input type="checkbox" id="consent-cgu" class="consent-checkbox" required checked>
              <label for="consent-cgu" class="consent-label">
                J'accepte les <button type="button" id="btn-open-cgu-modal">Conditions Générales d'Utilisation</button> du programme Bêta-Testeur Kanto.
              </label>
            </div>
            <div class="consent-item">
              <input type="checkbox" id="consent-privacy" class="consent-checkbox" required checked>
              <label for="consent-privacy" class="consent-label">
                J'accepte la <button type="button" id="btn-open-privacy-modal">Politique de Confidentialité</button> (mes identifiants sont chiffrés AES-256-GCM et jamais cédés).
              </label>
            </div>
          </div>

          <button type="submit" class="btn-submit-main" id="btn-submit-reg">
            <span>Rejoindre le cercle des testeurs</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>

          <div class="already-link-box">
            Vous participez déjà au programme ? <a id="link-open-already">Consulter mon espace testeur</a>
          </div>
        </form>
      </div>

      <!-- ─── VOLET 2 : TÉLÉCHARGEMENT DIRECT ────────────────────────────────── -->
      <div id="panel-download" style="display: ${initialTab === 'download' ? 'block' : 'none'};">
        <div class="form-container">
          <div class="download-grid">
            <div class="download-card">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-android);"><path d="M17 19H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2z"></path><circle cx="12" cy="12" r="2"></circle></svg>
                  <span class="download-card-title">Google Play (Android)</span>
                </div>
                <p class="download-card-desc">
                  Version de test certifiée pour smartphones et tablettes Android (Android 9 et supérieur).
                </p>
              </div>
              <a href="https://play.google.com/apps/testing/com.devengalere.kantomg" class="download-action-btn android" target="_blank" rel="noopener noreferrer">
                <span>Accéder sur Google Play</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div class="download-card">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-ios);"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path></svg>
                  <span class="download-card-title">TestFlight (Apple iOS)</span>
                </div>
                <p class="download-card-desc">
                  Version préliminaire officielle pour iPhone et iPad via l'application Apple TestFlight.
                </p>
              </div>
              <a href="https://testflight.apple.com/join/TEAM_KANTO" class="download-action-btn ios" target="_blank" rel="noopener noreferrer">
                <span>Accéder sur TestFlight</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── VOLET 3 : DÉJÀ INSCRIT / MON ESPACE ────────────────────────────── -->
      <div id="panel-already" style="display: ${initialTab === 'already_registered' || isRegistered ? 'block' : 'none'};">
        <div class="form-container" style="text-align: center; padding: 20px 0;">
          <h3 style="font-family: var(--font-serif); font-size: 24px; margin-bottom: 12px; color: var(--color-heading);">
            Consultez votre statut Bêta-Testeur Kanto
          </h3>
          <p style="font-size: 14px; color: var(--color-ink-muted); margin-bottom: 24px;">
            Saisissez l'adresse e-mail avec laquelle vous vous êtes inscrit pour recevoir vos liens d'installation personnels ou gérer votre participation.
          </p>

          <form id="check-status-form">
            <div class="field" style="max-width: 420px; margin: 0 auto 20px;">
              <input 
                type="email" 
                id="check-email-input" 
                class="field-input" 
                placeholder="votre.email@domaine.com" 
                required 
                value="${emailVal}"
              >
            </div>
            <button type="submit" class="btn-submit-main" style="max-width: 280px; margin: 0 auto;">
              Vérifier mon inscription
            </button>
          </form>
        </div>
      </div>

      <!-- ─── VOLET 4 : DÉSINCRIPTION ────────────────────────────────────────── -->
      <div id="panel-unsubscribe" style="display: ${initialTab === 'unsubscribe' ? 'block' : 'none'};">
        <div class="form-container" style="text-align: center; padding: 20px 0;">
          <h3 style="font-family: var(--font-serif); font-size: 22px; margin-bottom: 12px; color: var(--color-terracotta);">
            Désinscription du programme Bêta
          </h3>
          <p style="font-size: 14px; color: var(--color-ink-muted); margin-bottom: 24px;">
            En confirmant votre désinscription, votre accès aux préversions sera révoqué et vos données personnelles seront immédiatement supprimées de nos registres de test.
          </p>
          <button type="button" class="btn-submit-main" id="btn-confirm-unsub" style="max-width: 280px; margin: 0 auto; background: var(--color-ink);">
            Confirmer ma désinscription
          </button>
        </div>
      </div>
    </section>
  </main>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- MODALES LÉGALES & COOKIES                                              -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <div id="kanto-cgu-modal" class="kanto-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="cgu-modal-title" style="display: none;">
    <div class="kanto-modal-card">
      <div class="kanto-modal-head">
        <h2 id="cgu-modal-title" class="kanto-modal-title">
          <span>Conditions Générales d'Utilisation • Bêta</span>
        </h2>
        <button type="button" id="cgu-modal-close" class="kanto-modal-close" aria-label="Fermer la modale">✕</button>
      </div>
      <div class="kanto-modal-scroll">
        <div class="cgu-highlight-box">
          <strong>Esprit Kanto MG : Fihavanana &amp; Haja</strong><br>
          En rejoignant le programme bêta, vous devenez pionnier d'un sanctuaire numérique dédié au patrimoine, aux contes (<em>Angano</em>), proverbes (<em>Ohabolana</em>) et traditions de Madagascar.
        </div>
        <p>Les versions de test sont fournies pour évaluation et signalement d'anomalies. Vous conservez la liberté totale de vous retirer du programme à tout instant.</p>
      </div>
      <div class="kanto-modal-foot">
        <a href="${legalBaseUrl}/pages/terms" target="_blank" rel="noopener noreferrer" style="font-size: 12px; color: var(--color-ink-muted); text-decoration: underline;">
          Ouvrir les CGU complètes ↗
        </a>
        <button type="button" id="cgu-modal-btn-accept" class="cookie-btn cookie-btn-primary">J'ai compris</button>
      </div>
    </div>
  </div>

  <div id="kanto-privacy-modal" class="kanto-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="privacy-modal-title" style="display: none;">
    <div class="kanto-modal-card">
      <div class="kanto-modal-head">
        <h2 id="privacy-modal-title" class="kanto-modal-title">
          <span>Politique de Confidentialité • RGPD</span>
        </h2>
        <button type="button" id="privacy-modal-close" class="kanto-modal-close" aria-label="Fermer la modale">✕</button>
      </div>
      <div class="kanto-modal-scroll">
        <div class="cgu-highlight-box">
          <strong>Minimisation &amp; Chiffrement fort</strong><br>
          Kanto MG n'enregistre aucune donnée commerciale. Vos adresses e-mails sont chiffrées avec l'algorithme cryptographique AES-256-GCM.
        </div>
        <p>Conformément au RGPD, vous bénéficiez d'un droit permanent d'accès, de rectification et d'effacement direct en un clic.</p>
      </div>
      <div class="kanto-modal-foot">
        <a href="${legalBaseUrl}/pages/privacy" target="_blank" rel="noopener noreferrer" style="font-size: 12px; color: var(--color-ink-muted); text-decoration: underline;">
          Ouvrir la politique complète ↗
        </a>
        <button type="button" id="privacy-modal-btn-accept" class="cookie-btn cookie-btn-primary">Fermer</button>
      </div>
    </div>
  </div>

  <aside id="kanto-cookie-banner" class="cookie-banner" role="region" aria-label="Gestion des cookies" style="display: none;">
    <div class="cookie-banner-wrap">
      <div class="cookie-banner-text-wrap">
        <div class="cookie-banner-title">
          <span>Respect de votre vie privée &amp; Cookies</span>
        </div>
        <p class="cookie-banner-desc">
          Traceurs strictement techniques et mémorisation de vos préférences d'affichage. Zéro profilage publicitaire.
        </p>
      </div>
      <div class="cookie-banner-actions">
        <button type="button" id="cookie-btn-accept-all" class="cookie-btn cookie-btn-primary">Tout accepter</button>
        <button type="button" id="cookie-btn-reject-all" class="cookie-btn cookie-btn-secondary">Continuer sans accepter</button>
        <button type="button" id="cookie-btn-customize" class="cookie-btn cookie-btn-outline">Personnaliser</button>
      </div>
    </div>
  </aside>

  <div id="kanto-cookie-modal" class="kanto-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title" style="display: none;">
    <div class="kanto-modal-card">
      <div class="kanto-modal-head">
        <h2 id="cookie-modal-title" class="kanto-modal-title">
          <span>Préférences de confidentialité &amp; Cookies</span>
        </h2>
        <button type="button" id="cookie-modal-close" class="kanto-modal-close" aria-label="Fermer la gestion des cookies">✕</button>
      </div>
      <div class="kanto-modal-scroll">
        <p style="margin-bottom: 16px;">Traceurs strictement nécessaires et préférences d'affichage de thème.</p>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--color-border);">
          <span>1. Nécessaires au fonctionnement</span>
          <span style="font-size: 11px; font-weight: 700; color: var(--color-terracotta);">Obligatoire</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
          <span>2. Mémorisation du thème (Sombre/Clair)</span>
          <input type="checkbox" id="cookie-opt-preferences" checked style="accent-color: var(--color-terracotta);">
        </div>
      </div>
      <div class="kanto-modal-foot">
        <button type="button" id="cookie-modal-btn-reject" class="cookie-btn cookie-btn-secondary">Tout refuser</button>
        <button type="button" id="cookie-modal-btn-save" class="cookie-btn cookie-btn-primary">Enregistrer mes choix</button>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- PIED DE PAGE ÉDITORIAL & INSTITUTIONNEL                                -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <footer>
    <div class="footer-inner">
      <div class="footer-top-grid">
        <div class="footer-brand-col">
          <div class="brand">
            <span class="brand-name">kanto<span class="brand-domain">.mg</span></span>
          </div>
          <div class="footer-proverb-quote">
            « Ny hazo no vanon-ko lakana, ny tany naniriany no tsara. »
          </div>
          <div class="footer-proverb-sub">
            C'est la terre bienveillante qui fait grandir l'arbre digne de devenir pirogue.
          </div>
        </div>

        <div>
          <div class="footer-col-title">Les Trésors</div>
          <div class="footer-col-links">
            <a href="/ohabolana">Ohabolana (Proverbes)</a>
            <a href="/angano">Angano (Contes oraux)</a>
            <a href="/kabary">Kabary (Art oratoire)</a>
            <a href="/tononkalo">Tononkalo (Poésies)</a>
            <a href="/raki-teny">Raki-teny (Dictionnaire)</a>
            <a href="/histoire">Tantara (Histoire &amp; Us)</a>
          </div>
        </div>

        <div>
          <div class="footer-col-title">Projet &amp; Équipe</div>
          <div class="footer-col-links">
            <a href="${legalBaseUrl}/pages/about">À propos de Kanto MG</a>
            <a href="${legalBaseUrl}/pages/help">Aide &amp; FAQ</a>
            <a href="${legalBaseUrl}/pages/licenses">Crédits &amp; Licences</a>
            <a href="/feedback">Signaler une anomalie</a>
            <button type="button" id="footer-link-my-space">Mon espace testeur</button>
          </div>
        </div>

        <div>
          <div class="footer-col-title">Cadre Légal &amp; Contact</div>
          <div class="footer-col-links">
            <a href="${legalBaseUrl}/pages/terms" id="footer-link-cgu">Conditions d'Utilisation (CGU)</a>
            <a href="${legalBaseUrl}/pages/privacy" id="footer-link-privacy">Confidentialité &amp; RGPD</a>
            <button type="button" id="btn-cookie-settings">Gestion des cookies</button>
            <a href="mailto:${supportEmail}">Support : ${supportEmail}</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom-bar">
        <div>
          © ${currentYear} <strong>kanto.mg</strong> • Sauvegarde, rayonnement et transmission vivante du patrimoine malgache.
        </div>
        <div style="font-style: italic;">
          Fihavanana sy Haja
        </div>
      </div>
    </div>
  </footer>
  `;
}
