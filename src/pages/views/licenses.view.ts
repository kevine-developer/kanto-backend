import { pageShell } from '../page.helpers.js';

export function renderLicensesPage(options?: { hideHeader?: boolean }): string {
  return pageShell({
    title: 'Kanto — Licences et crédits',
    pageTitle: 'Licences et crédits',
    hideHeader: options?.hideHeader,
    description:
      "Licences des bibliothèques open source utilisées par l'application Kanto.",
    body: `
      <h1>Licences et crédits</h1>
      <p class="page-meta">Bibliothèques open source utilisées par Kanto</p>

      <div class="callout">
        <p>Kanto est construit sur les épaules de la communauté open source. Nous remercions tous les contributeurs de ces projets.</p>
      </div>

      <h2>Framework et runtime</h2>
      <table>
        <thead><tr><th>Bibliothèque</th><th>Licence</th><th>Usage</th></tr></thead>
        <tbody>
          <tr><td>React Native</td><td>MIT</td><td>Framework mobile cross-platform</td></tr>
          <tr><td>Expo SDK</td><td>MIT</td><td>Outils de développement et APIs natives</td></tr>
          <tr><td>Expo Router</td><td>MIT</td><td>Navigation basée sur le système de fichiers</td></tr>
          <tr><td>NestJS</td><td>MIT</td><td>Framework backend Node.js</td></tr>
          <tr><td>TypeScript</td><td>Apache 2.0</td><td>Typage statique JavaScript</td></tr>
        </tbody>
      </table>

      <h2>Interface utilisateur</h2>
      <table>
        <thead><tr><th>Bibliothèque</th><th>Licence</th><th>Usage</th></tr></thead>
        <tbody>
          <tr><td>Lucide React Native</td><td>ISC</td><td>Icônes vectorielles</td></tr>
          <tr><td>React Native Reanimated</td><td>MIT</td><td>Animations haute performance</td></tr>
          <tr><td>React Native Gesture Handler</td><td>MIT</td><td>Gestion des gestes tactiles</td></tr>
          <tr><td>React Native Safe Area Context</td><td>MIT</td><td>Zones sécurisées iOS/Android</td></tr>
          <tr><td>React Native ViewShot</td><td>MIT</td><td>Capture d'écran pour partage</td></tr>
          <tr><td>Plus Jakarta Sans</td><td>OFL 1.1</td><td>Typographie principale</td></tr>
        </tbody>
      </table>

      <h2>Backend et infrastructure</h2>
      <table>
        <thead><tr><th>Bibliothèque</th><th>Licence</th><th>Usage</th></tr></thead>
        <tbody>
          <tr><td>Prisma</td><td>Apache 2.0</td><td>ORM et accès base de données</td></tr>
          <tr><td>PostgreSQL</td><td>PostgreSQL License</td><td>Base de données relationnelle</td></tr>
          <tr><td>Redis</td><td>BSD 3-Clause</td><td>Cache et messagerie temps réel</td></tr>
          <tr><td>Better Auth</td><td>MIT</td><td>Authentification sécurisée</td></tr>
          <tr><td>Helmet</td><td>MIT</td><td>Sécurité des en-têtes HTTP</td></tr>
          <tr><td>Socket.io</td><td>MIT</td><td>Communication WebSocket</td></tr>
        </tbody>
      </table>

      <h2>Stockage et médias</h2>
      <table>
        <thead><tr><th>Service / Lib</th><th>Licence</th><th>Usage</th></tr></thead>
        <tbody>
          <tr><td>Cloudinary</td><td>Propriétaire</td><td>Stockage et optimisation des médias</td></tr>
          <tr><td>Expo AV</td><td>MIT</td><td>Lecture audio des contes</td></tr>
          <tr><td>Expo Image Picker</td><td>MIT</td><td>Sélection de photo de profil</td></tr>
        </tbody>
      </table>

      <h2>Contenu culturel</h2>
      <p>Les proverbes, contes, poésies et expressions culturelles malgaches appartiennent au patrimoine culturel immatériel de Madagascar. Ils sont traités avec le plus grand respect et dans un esprit de préservation et de transmission.</p>
      <p>Certains contenus ont été contribués par la communauté d'utilisateurs de l'application. Chaque contribution est vérifiée avant publication.</p>

      <h2>Contact</h2>
      <div class="contact-card">
        <div class="icon">
          <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <div class="body">
          <div class="label">Pour toute question relative aux licences</div>
          <div class="value"><a href="mailto:contact@kanto.mg">contact@kanto.mg</a></div>
        </div>
      </div>
    `,
  });
}
