import { pageShell } from '../page.helpers.js';

export function renderAboutPage(options?: { hideHeader?: boolean }): string {
  return pageShell({
    title: 'Kanto — À propos',
    pageTitle: 'À propos de Kanto',
    hideHeader: options?.hideHeader,
    description: "Découvrez la mission, les valeurs et l'équipe derrière l'application Kanto.",
    body: `
      <h1>À propos de Kanto</h1>
      <p class="page-meta">Notre mission, nos valeurs</p>

      <h2>Notre mission</h2>
      <p>Kanto est né d'une conviction simple : <strong>la culture malgache mérite d'être transmise aux générations futures</strong>, de manière engageante, accessible et moderne.</p>
      <p>L'application propose un voyage au cœur de la richesse culturelle malgache — proverbes (<em>ohabolana</em>), contes (<em>angano</em>), poésies (<em>hainteny</em>), histoire civique et traditions — rendu addictif grâce à la gamification et à la communauté.</p>

      <h2>Ce que nous proposons</h2>
      <ul>
        <li><strong>Proverbes (Ohabolana)</strong> — Des centaines de proverbes avec traductions et explications</li>
        <li><strong>Contes (Angano)</strong> — Les grands récits de la tradition orale malgache</li>
        <li><strong>Civisme</strong> — Géographie, institutions, histoire de Madagascar</li>
        <li><strong>Poésies (Hainteny)</strong> — La poésie malgache traditionnelle et contemporaine</li>
        <li><strong>Citations</strong> — Pensées de personnalités malgaches inspirantes</li>
        <li><strong>Jeux</strong> — Quiz, devinettes, puzzles pour apprendre en jouant</li>
        <li><strong>Communauté</strong> — Contributions des utilisateurs, amis, classements</li>
      </ul>

      <h2>Nos valeurs</h2>
      <ul>
        <li><strong>Authenticité</strong> — Contenus vérifiés et fidèles à la tradition</li>
        <li><strong>Accessibilité</strong> — Bilingue malgache/français, pour tous les niveaux</li>
        <li><strong>Communauté</strong> — Les utilisateurs enrichissent la base de contenus</li>
        <li><strong>Respect</strong> — La culture malgache est traitée avec soin et respect</li>
        <li><strong>Vie privée</strong> — Vos données vous appartiennent</li>
      </ul>

      <h2>La technologie</h2>
      <p>Kanto est construit avec des technologies modernes :</p>
      <ul>
        <li><strong>Application mobile</strong> — React Native (Expo) — iOS &amp; Android</li>
        <li><strong>Backend</strong> — NestJS, PostgreSQL, Redis</li>
        <li><strong>Temps réel</strong> — WebSockets pour les classements et notifications</li>
        <li><strong>Intelligence artificielle</strong> — Narrations vocales générées par IA</li>
      </ul>

      <h2>Version de l'application</h2>
      <table>
        <thead><tr><th>Composant</th><th>Version</th></tr></thead>
        <tbody>
          <tr><td>Application mobile</td><td>1.0.0</td></tr>
          <tr><td>API backend</td><td>1.0.0</td></tr>
          <tr><td>Plateforme</td><td>iOS 15+, Android 9+</td></tr>
        </tbody>
      </table>

      <h2>Contact</h2>
      <div class="contact-card">
        <div class="icon">
          <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <div class="body">
          <div class="label">Équipe Kanto</div>
          <div class="value"><a href="mailto:contact@kanto.mg">contact@kanto.mg</a></div>
        </div>
      </div>
    `,
  });
}
