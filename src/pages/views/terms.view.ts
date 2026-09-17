import { pageShell } from '../page.helpers.js';

export function renderTermsPage(options?: { hideHeader?: boolean }): string {
  return pageShell({
    title: "Kanto — Conditions Générales d'Utilisation",
    pageTitle: "Conditions d'utilisation",
    hideHeader: options?.hideHeader,
    description: "Conditions générales d'utilisation de l'application Kanto.",
    body: `
      <h1>Conditions Générales d'Utilisation</h1>
      <p class="page-meta">En vigueur depuis septembre 2025</p>

      <div class="callout">
        <p>En utilisant l'application Kanto, vous acceptez les présentes conditions. Veuillez les lire attentivement avant d'utiliser le service.</p>
      </div>

      <h2>1. Présentation du service</h2>
      <p>Kanto est une application mobile dédiée à l'apprentissage et à la valorisation de la culture malgache : proverbes (<em>ohabolana</em>), contes (<em>angano</em>), civisme, poésies, citations et jeux culturels.</p>
      <p>L'accès à l'application nécessite la création d'un compte utilisateur.</p>

      <h2>2. Accès au service</h2>
      <p>L'application Kanto est accessible :</p>
      <ul>
        <li>Sur iOS (App Store) et Android (Google Play)</li>
        <li>Via une connexion internet (Wi-Fi ou données mobiles)</li>
        <li>À toute personne âgée d'au moins 13 ans</li>
      </ul>
      <p>L'accès à certaines fonctionnalités (classement, contributions, encouragements) nécessite un compte vérifié.</p>

      <h2>3. Création de compte</h2>
      <p>L'utilisateur s'engage à fournir des informations exactes lors de la création de son compte. Un seul compte par personne est autorisé. La création de faux profils ou de comptes automatisés est strictement interdite.</p>

      <h2>4. Comportement des utilisateurs</h2>
      <p>En utilisant Kanto, vous vous engagez à :</p>
      <ul>
        <li>Respecter les autres utilisateurs et la communauté</li>
        <li>Ne pas soumettre de contenus inappropriés, offensants ou illégaux</li>
        <li>Ne pas tenter de contourner les mécanismes de sécurité</li>
        <li>Ne pas utiliser l'application à des fins commerciales sans autorisation</li>
        <li>Respecter la propriété intellectuelle des contenus</li>
      </ul>

      <h2>5. Contributions utilisateurs</h2>
      <p>Les proverbes, citations et autres contenus soumis par les utilisateurs sont vérifiés avant publication. En soumettant une contribution, vous accordez à Kanto une licence non exclusive pour l'afficher dans l'application. Vous conservez la propriété de votre contribution.</p>
      <p>Toute contribution jugée inappropriée ou incorrecte sera retirée sans préavis.</p>

      <h2>6. Système de gamification</h2>
      <p>Les points d'expérience (XP), niveaux, séries de connexion et classements sont calculés automatiquement par le système. Kanto se réserve le droit de modifier les règles de calcul à tout moment. Toute tentative de manipulation du système entraînera la suspension du compte.</p>

      <h2>7. Propriété intellectuelle</h2>
      <p>Les contenus de l'application (design, textes originaux, code, marque « Kanto ») sont protégés par le droit d'auteur. Les contenus culturels traditionnels (proverbes, contes) appartiennent au patrimoine malgache commun.</p>

      <h2>8. Limitation de responsabilité</h2>
      <p>Kanto s'efforce de maintenir un service de qualité mais ne garantit pas l'accès ininterrompu. Nous ne sommes pas responsables des interruptions techniques ou des pertes de données.</p>

      <h2>9. Suspension et suppression de compte</h2>
      <p>Kanto se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU, sans préavis ni remboursement.</p>
      <p>L'utilisateur peut supprimer son compte à tout moment depuis les paramètres de l'application.</p>

      <h2>10. Modifications des CGU</h2>
      <p>Ces conditions peuvent être mises à jour. Les utilisateurs seront notifiés via l'application lors de modifications importantes. La poursuite de l'utilisation après notification vaut acceptation des nouvelles conditions.</p>

      <h2>11. Droit applicable</h2>
      <p>Les présentes CGU sont soumises au droit français. En cas de litige, les parties rechercheront une solution amiable avant tout recours judiciaire.</p>

      <h2>12. Contact</h2>
      <div class="contact-card">
        <div class="icon">
          <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <div class="body">
          <div class="label">Contact légal</div>
          <div class="value"><a href="mailto:contact@kanto.mg">contact@kanto.mg</a></div>
        </div>
      </div>
    `,
  });
}
