import { pageShell } from '../page.helpers.js';

export function renderPrivacyPage(options?: {
  hideHeader?: boolean;
  supportEmail?: string;
}): string {
  const supportEmail =
    options?.supportEmail || process.env.SUPPORT_EMAIL || 'support@kanto.mg';

  return pageShell({
    title: 'Kanto MG — Politique de confidentialité & RGPD',
    pageTitle: 'Politique de confidentialité',
    hideHeader: options?.hideHeader,
    supportEmail,
    description:
      'Comment Kanto MG collecte, utilise, chiffre et protège vos données personnelles.',
    body: `
      <div style="margin-bottom: 24px;">
        <h1>Politique de Confidentialité &amp; RGPD</h1>
        <div class="page-meta">
          <span class="badge-official">Conforme RGPD 2016/679 &amp; ePrivacy</span>
          <span>Version 2026</span>
          <span>•</span>
          <span>Chiffrement AES-256-GCM &amp; HMAC-SHA-256</span>
        </div>
      </div>

      <div class="callout">
        <p>Chez <strong>Kanto MG</strong>, la protection de vos données personnelles et de votre vie privée est une priorité absolue. Nous collectons uniquement les données strictement nécessaires au fonctionnement du service et du programme bêta, avec un chiffrement au repos de niveau bancaire.</p>
      </div>

      <h2>1. Responsable du traitement</h2>
      <p>L'application Kanto MG et sa plateforme bêta sont éditées par son équipe de développement. Pour toute question relative à vos données ou pour exercer vos droits : <a href="mailto:${supportEmail}"><strong>${supportEmail}</strong></a></p>

      <h2>2. Données collectées</h2>

      <h3>2.1 Données de compte &amp; Bêta-test</h3>
      <p>Lors de votre inscription ou de votre participation au programme bêta, nous collectons :</p>
      <ul>
        <li><strong>Adresse e-mail :</strong> Chiffrée réversiblement au repos (AES-256-GCM) et indexée via hash HMAC-SHA-256 déterministe pour prévenir tout vol de base de données.</li>
        <li><strong>Plateformes cibles :</strong> Android (Google Play) et/ou iOS (TestFlight).</li>
        <li><strong>Nom ou pseudonyme d'affichage :</strong> Renseigné par vous-même (optionnel).</li>
        <li><strong>Statut d'invitation :</strong> Suivi des invitations émises et retours d'expérience.</li>
      </ul>

      <h3>2.2 Données d'utilisation (application mobile)</h3>
      <ul>
        <li>Progression culturelle (XP, badges, série de connexion quotidienne).</li>
        <li>Contenus consultés et favoris (proverbes <em>ohabolana</em>, contes <em>angano</em>, histoire).</li>
        <li>Contributions communautaires soumises (validées avant mise en ligne).</li>
      </ul>

      <h3>2.3 Données techniques &amp; Journalisation</h3>
      <ul>
        <li>Token de notification push (Expo Push Notifications, révocable à tout moment).</li>
        <li>Journal d'audit de sécurité immuable (traçabilité des accès administratifs aux données).</li>
        <li>Logs techniques anonymisés sans adresse e-mail en clair.</li>
      </ul>

      <h2>3. Finalités du traitement &amp; Bases légales</h2>
      <table>
        <thead>
          <tr><th>Finalité</th><th>Base légale</th></tr>
        </thead>
        <tbody>
          <tr><td>Gestion du programme bêta et envoi des invitations</td><td>Exécution du contrat / Consentement</td></tr>
          <tr><td>Sécurité des comptes et prévention des abus</td><td>Intérêt légitime / Sécurité</td></tr>
          <tr><td>Personnalisation et sauvegarde de la progression</td><td>Exécution du contrat</td></tr>
          <tr><td>Envoi des alertes de nouvelles versions</td><td>Consentement (révocable en 1 clic)</td></tr>
        </tbody>
      </table>

      <h2>4. Non-commercialisation &amp; Partage des données</h2>
      <p>
        <strong>Kanto MG ne vend, ne loue et ne cède aucune donnée personnelle à des fins commerciales ou publicitaires.</strong>
      </p>
      <p>Les données sont partagées exclusivement avec nos prestataires techniques indispensables :</p>
      <ul>
        <li><strong>Google Play Console :</strong> Pour l'inscription à la liste de Closed Testing Android.</li>
        <li><strong>Apple App Store Connect / TestFlight :</strong> Pour l'expédition des invitations TestFlight sur iOS.</li>
        <li><strong>Resend :</strong> Pour la distribution transactionnelle et sécurisée de vos liens d'invitation par e-mail.</li>
      </ul>

      <h2>5. Conservation &amp; Droit à l'oubli</h2>
      <p>
        Vos données sont conservées pendant toute la durée de votre participation active. En cas de désinscription ou de demande de suppression, vos données sont <strong>immédiatement et définitivement purgées</strong> de nos bases actives.
      </p>

      <h2>6. Vos Droits (RGPD)</h2>
      <p>Vous disposez des droits légaux suivants sur vos données :</p>
      <ul>
        <li><strong>Droit d'accès &amp; Portabilité :</strong> Obtenir une copie de vos données enregistrées.</li>
        <li><strong>Droit de rectification :</strong> Modifier vos plateformes ou vos informations.</li>
        <li><strong>Droit à l'effacement :</strong> Suppression totale de votre inscription sur simple clic ou demande.</li>
        <li><strong>Droit d'opposition :</strong> Vous opposer à la réception de communications.</li>
      </ul>
      <p>Pour faire valoir ces droits, écrivez directement à notre support : <a href="mailto:${supportEmail}"><strong>${supportEmail}</strong></a></p>

      <h2>7. Cookies et Traceurs Web</h2>
      <p>
        Sur notre site et nos interfaces web, nous appliquons une politique de traceurs conforme aux directives de la CNIL :
      </p>
      <ul>
        <li><strong>Traceurs nécessaires :</strong> Indispensables à la sécurité, à la protection CSRF et à la sauvegarde de votre choix de consentement. Toujours actifs.</li>
        <li><strong>Préférences (Thème clair/sombre) :</strong> Sauvegarde de votre confort de lecture.</li>
        <li><strong>Mesure d'audience anonyme :</strong> Statistiques globales sans profilage individuel.</li>
      </ul>
      <p>
        Vous pouvez à tout instant réviser vos préférences en cliquant sur le bouton <strong>« Gestion des cookies »</strong> au bas de chaque page.
      </p>

      <h2>8. Délégué à la Protection des Données &amp; Support</h2>
      <div class="contact-card">
        <div class="icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <div class="body">
          <div class="label">Contact Confidentialité &amp; Support RGPD</div>
          <div class="value">
            Adresse dédiée : <a href="mailto:${supportEmail}"><strong>${supportEmail}</strong></a>
            <br>
            <span style="font-size: 12px; color: var(--text-subtle);">
              Traitement rapide de toute demande relative aux données personnelles.
            </span>
          </div>
        </div>
      </div>
    `,
  });
}
