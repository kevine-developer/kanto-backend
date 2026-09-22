import { pageShell } from '../page.helpers.js';

export function renderHelpPage(options?: { hideHeader?: boolean }): string {
  return pageShell({
    title: 'Kanto — Aide et support',
    pageTitle: 'Aide',
    hideHeader: options?.hideHeader,
    description:
      "Trouvez des réponses à vos questions sur l'application Kanto.",
    body: `
      <h1>Aide et support</h1>
      <p class="page-meta">Centre d'aide Kanto</p>

      <div class="callout">
        <p>Vous ne trouvez pas la réponse ? Contactez-nous à <a href="mailto:contact@kanto.mg">contact@kanto.mg</a> — nous répondons sous 48h.</p>
      </div>

      <h2>Premiers pas</h2>

      <h3>Comment créer un compte ?</h3>
      <p>Ouvrez l'application Kanto et appuyez sur <strong>« Commencer »</strong>. Vous pouvez vous inscrire avec votre adresse email ou votre compte Google. Une confirmation par email sera envoyée.</p>

      <h3>Je n'ai pas reçu l'email de confirmation</h3>
      <p>Vérifiez votre dossier spam. Si le problème persiste, revenez à l'écran de connexion et demandez un nouveau lien de confirmation. Les liens expirent après 24 heures.</p>

      <h3>Comment changer mon nom ou ma photo de profil ?</h3>
      <p>Accédez à l'onglet <strong>Profil</strong>, puis appuyez sur l'icône de modification. Vous pouvez changer votre nom, photo et préférences de langue.</p>

      <h2>XP et progression</h2>

      <h3>Comment gagner des points d'expérience (XP) ?</h3>
      <ul>
        <li>Lire un proverbe, conte ou leçon civique : <strong>+1 XP</strong></li>
        <li>Répondre correctement à un quiz : <strong>+2 à 5 XP</strong></li>
        <li>Soumettre une contribution validée : <strong>+5 XP</strong></li>
        <li>Encourager un ami : <strong>+1 XP</strong> (1 fois par ami par jour)</li>
        <li>Se connecter plusieurs jours de suite (série) : <strong>bonus multiplicateur</strong></li>
      </ul>

      <h3>Qu'est-ce que la série de connexion ?</h3>
      <p>La série (ou <em>streak</em>) représente le nombre de jours consécutifs où vous avez ouvert l'application. Elle augmente votre multiplicateur de gains et apparaît dans le classement.</p>

      <h3>Comment fonctionne le classement ?</h3>
      <p>Le classement affiche les utilisateurs les plus actifs par total d'XP. Il est mis à jour en temps réel. Vous pouvez filtrer par scope (global, amis).</p>

      <h2>Amis et encouragements</h2>

      <h3>Comment ajouter un ami ?</h3>
      <p>Depuis l'onglet <strong>Profil</strong>, accédez à la section <strong>Amis</strong>. Vous pouvez envoyer une demande depuis le classement ou le profil public d'un utilisateur.</p>

      <h3>Qu'est-ce que l'encouragement ?</h3>
      <p>Vous pouvez encourager chacun de vos amis une fois par jour. Cela vous rapporte <strong>+1 XP</strong> à tous les deux et envoie une notification à votre ami.</p>

      <h3>Comment répondre à un encouragement ?</h3>
      <p>Lorsque vous recevez une notification d'encouragement, ouvrez-la et appuyez sur <strong>« Encourager en retour »</strong> depuis le profil de votre ami.</p>

      <h2>Contributions</h2>

      <h3>Comment soumettre un proverbe ou une citation ?</h3>
      <p>Depuis l'onglet <strong>Communauté</strong>, appuyez sur le bouton <strong>+ Contribuer</strong>. Remplissez le formulaire avec le texte original malgache et sa traduction. Votre contribution sera vérifiée par l'équipe avant publication.</p>

      <h3>Combien de temps prend la validation ?</h3>
      <p>La vérification prend généralement entre 24 et 72 heures. Vous serez notifié du résultat dans l'application.</p>

      <h3>Ma contribution a été refusée — pourquoi ?</h3>
      <p>Une contribution peut être refusée si elle est incorrecte, déjà présente dans la base, ou ne respecte pas les règles de contenu. Vous pouvez la modifier et la resoumettre.</p>

      <h2>Notifications</h2>

      <h3>Comment activer ou désactiver les notifications ?</h3>
      <p>Accédez aux <strong>Paramètres</strong> de l'application (onglet Profil → Paramètres) puis activez ou désactivez les notifications push. Vous pouvez aussi gérer cela depuis les paramètres de votre téléphone.</p>

      <h3>Je ne reçois pas les notifications</h3>
      <ul>
        <li>Vérifiez que les notifications sont autorisées dans les paramètres de l'application</li>
        <li>Vérifiez les paramètres de notifications de votre téléphone pour Kanto</li>
        <li>Reconnectez-vous à l'application pour actualiser votre token de notification</li>
      </ul>

      <h2>Compte et sécurité</h2>

      <h3>Comment supprimer mon compte ?</h3>
      <p>La suppression de compte est disponible dans <strong>Paramètres → Compte → Supprimer mon compte</strong>. Cette action est irréversible et entraîne la suppression de toutes vos données sous 30 jours.</p>

      <h3>J'ai perdu l'accès à mon compte</h3>
      <p>Utilisez la fonctionnalité <strong>« Mot de passe oublié »</strong> sur l'écran de connexion. Si vous ne pouvez plus accéder à votre email, contactez <a href="mailto:contact@kanto.mg">contact@kanto.mg</a> avec une preuve d'identité.</p>

      <h2>Nous contacter</h2>
      <div class="contact-card">
        <div class="icon">
          <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <div class="body">
          <div class="label">Support utilisateur</div>
          <div class="value"><a href="mailto:contact@kanto.mg">contact@kanto.mg</a> — Réponse sous 48h</div>
        </div>
      </div>
    `,
  });
}
