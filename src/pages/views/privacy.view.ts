import { pageShell } from '../page.helpers.js';

export function renderPrivacyPage(options?: { hideHeader?: boolean }): string {
  return pageShell({
    title: 'Kanto — Politique de confidentialité',
    pageTitle: 'Politique de confidentialité',
    hideHeader: options?.hideHeader,
    description: 'Comment Kanto collecte, utilise et protège vos données personnelles.',
    body: `
      <h1>Politique de confidentialité</h1>
      <p class="page-meta">Dernière mise à jour : septembre 2025</p>

      <div class="callout">
        <p>Chez Kanto, la protection de vos données personnelles est une priorité absolue. Nous collectons uniquement les données strictement nécessaires au fonctionnement de l'application.</p>
      </div>

      <h2>1. Responsable du traitement</h2>
      <p>L'application Kanto est éditée par ses développeurs. Pour toute question relative à vos données : <a href="mailto:contact@kanto.mg">contact@kanto.mg</a></p>

      <h2>2. Données collectées</h2>

      <h3>2.1 Données de compte</h3>
      <p>Lors de la création de votre compte, nous collectons :</p>
      <ul>
        <li>Adresse email (pour l'authentification et les communications)</li>
        <li>Nom d'affichage (choisi par vous)</li>
        <li>Photo de profil (optionnelle, fournie via Google ou chargée manuellement)</li>
        <li>Identifiant unique interne (généré automatiquement)</li>
      </ul>

      <h3>2.2 Données d'utilisation</h3>
      <ul>
        <li>Progression dans l'application (XP, niveau, série de connexion)</li>
        <li>Contenus consultés (proverbes, contes, leçons civiques)</li>
        <li>Contributions soumises (textes, proverbes)</li>
        <li>Scores et classements de jeux</li>
        <li>Historique de lecture et favoris</li>
      </ul>

      <h3>2.3 Données techniques</h3>
      <ul>
        <li>Token de notification push (pour les alertes en temps réel)</li>
        <li>Langue et fuseau horaire de l'appareil</li>
        <li>Logs d'erreurs techniques (anonymisés)</li>
      </ul>

      <h2>3. Finalités du traitement</h2>
      <table>
        <thead>
          <tr><th>Finalité</th><th>Base légale</th></tr>
        </thead>
        <tbody>
          <tr><td>Authentification et sécurité du compte</td><td>Exécution du contrat</td></tr>
          <tr><td>Personnalisation de l'expérience</td><td>Intérêt légitime</td></tr>
          <tr><td>Envoi de notifications push</td><td>Consentement</td></tr>
          <tr><td>Amélioration de l'application</td><td>Intérêt légitime</td></tr>
          <tr><td>Classement et fonctionnalités sociales</td><td>Exécution du contrat</td></tr>
        </tbody>
      </table>

      <h2>4. Partage des données</h2>
      <p>Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées uniquement avec :</p>
      <ul>
        <li><strong>Expo (Expo Push Notifications)</strong> — pour l'envoi des notifications push</li>
        <li><strong>Cloudinary</strong> — pour le stockage des médias (photos de profil)</li>
        <li><strong>Google OAuth</strong> — si vous choisissez la connexion Google</li>
      </ul>

      <h2>5. Conservation des données</h2>
      <p>Vos données sont conservées tant que votre compte est actif. En cas de suppression de compte, toutes vos données personnelles sont effacées dans un délai de 30 jours, à l'exception des données anonymisées à des fins statistiques.</p>

      <h2>6. Vos droits</h2>
      <p>Conformément au RGPD, vous disposez des droits suivants :</p>
      <ul>
        <li><strong>Accès</strong> — obtenir une copie de vos données</li>
        <li><strong>Rectification</strong> — corriger des données inexactes</li>
        <li><strong>Effacement</strong> — supprimer votre compte et vos données</li>
        <li><strong>Portabilité</strong> — recevoir vos données dans un format standard</li>
        <li><strong>Opposition</strong> — s'opposer à certains traitements</li>
      </ul>
      <p>Pour exercer ces droits : <a href="mailto:contact@kanto.mg">contact@kanto.mg</a></p>

      <h2>7. Sécurité</h2>
      <p>Vos données sont stockées sur des serveurs sécurisés. Les mots de passe ne sont jamais stockés en clair. Les connexions sont protégées par HTTPS/TLS.</p>

      <h2>8. Cookies</h2>
      <p>L'application mobile Kanto n'utilise pas de cookies. Les sessions sont gérées via des tokens sécurisés stockés localement sur votre appareil.</p>

      <h2>9. Contact</h2>
      <div class="contact-card">
        <div class="icon">
          <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <div class="body">
          <div class="label">Délégué à la protection des données</div>
          <div class="value"><a href="mailto:contact@kanto.mg">contact@kanto.mg</a></div>
        </div>
      </div>
    `,
  });
}
