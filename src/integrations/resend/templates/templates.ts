import { KANTO_COLORS } from './common.js';
import { renderEmailLayout } from './email-layout.js';
import {
  renderButton,
  renderGooglePlayBadge,
  renderNotice,
  renderStepCard,
  renderMetadataTable,
} from './components.js';

export interface EmailRenderOutput {
  subject: string;
  html: string;
  text: string;
}

/**
 * 1. Email de réinitialisation de mot de passe.
 */
export interface PasswordResetEmailData {
  to: string;
  resetUrl: string;
  userName?: string;
  token?: string;
}

export function buildPasswordResetEmail(
  data: PasswordResetEmailData,
): EmailRenderOutput {
  const greeting = data.userName?.trim()
    ? `Bonjour ${data.userName.trim()},`
    : 'Bonjour,';
  const subject = 'Réinitialisation de votre mot de passe — Kanto';

  const text = `${greeting}

Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Kanto.

Pour choisir un nouveau mot de passe, ouvrez le lien suivant dans votre navigateur :
${data.resetUrl}

Ce lien est valable pendant 1 heure. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message en toute sécurité.

Kanto — Lova, Kolontsaina & Tantara Malagasy
https://kanto.mg`.trim();

  const contentHtml = `
    <h1 style="font-size: 18px; font-weight: 700; color: ${KANTO_COLORS.textPrimary}; margin: 0 0 16px 0; line-height: 24px; letter-spacing: -0.2px;">
      Réinitialisation de votre mot de passe
    </h1>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 14px 0;">
      ${greeting}
    </p>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 20px 0;">
      Nous avons reçu une demande pour modifier le mot de passe de votre compte Kanto. Cliquez sur le bouton ci-dessous pour choisir votre nouvel identifiant de connexion :
    </p>

    ${renderButton({
      text: 'Choisir un nouveau mot de passe',
      url: data.resetUrl,
      variant: 'terracotta',
    })}

    ${renderNotice({
      title: 'Validité du lien',
      content:
        "Ce lien sécurisé reste actif pendant <strong>1 heure</strong>. Si vous n'êtes pas à l'origine de cette démarche, votre compte demeure protégé et vous pouvez ignorer cet email.",
      variant: 'security',
    })}

    <p style="font-size: 12px; line-height: 18px; color: ${KANTO_COLORS.textFootnote}; margin: 24px 0 0 0; word-break: break-all;">
      Si le bouton ne s'affiche pas correctement, copiez ce lien dans la barre d'adresse de votre navigateur :<br>
      <a href="${data.resetUrl}" style="color: ${KANTO_COLORS.terracotta}; text-decoration: underline;">${data.resetUrl}</a>
    </p>
  `;

  const html = renderEmailLayout({
    title: subject,
    preheader: 'Lien de réinitialisation de votre mot de passe Kanto',
    headerBadge: { label: 'Sécurité du compte', variant: 'terracotta' },
    contentHtml,
  });

  return { subject, html, text };
}

/**
 * 2. Email de bienvenue lors de la création de compte.
 */
export interface WelcomeEmailData {
  to: string;
  userName?: string;
}

export function buildWelcomeEmail(data: WelcomeEmailData): EmailRenderOutput {
  const greeting = data.userName?.trim()
    ? `Tongasoa ${data.userName.trim()},`
    : 'Tongasoa,';
  const subject = "Tongasoa eto amin'ny Kanto — Bienvenue";

  const text = `${greeting}

Bienvenue sur Kanto, la plateforme dédiée au patrimoine, aux contes, à l'histoire et à la sagesse de Madagascar.

Votre compte vous donne accès à :
- Angano : Contes traditionnels narrés et immersifs
- Kabary : Art oratoire et rituels traditionnels
- Tantara : Repères historiques et figures illustres
- Lalao : Jeux de réflexion et défis culturels

Ouvrez l'application mobile Kanto pour débuter votre parcours.

Kanto — Lova, Kolontsaina & Tantara Malagasy
https://kanto.mg`.trim();

  const contentHtml = `
    <h1 style="font-size: 19px; font-weight: 700; color: ${KANTO_COLORS.textPrimary}; margin: 0 0 16px 0; line-height: 26px; letter-spacing: -0.2px;">
      ${greeting}
    </h1>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 22px 0;">
      Nous sommes honorés de vous compter parmi nous. Kanto a été conçue pour célébrer, transmettre et faire vivre la langue, la mémoire et le patrimoine malgache à travers une expérience soignée.
    </p>

    <!-- Grille des piliers Kanto -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #FAF9F6; border: 1px solid ${KANTO_COLORS.cardBorder}; border-radius: 8px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 18px 20px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: ${KANTO_COLORS.tanimbary}; margin-bottom: 12px;">
            Les piliers culturels à découvrir
          </div>

          <div style="font-size: 13px; line-height: 22px; color: ${KANTO_COLORS.textPrimary}; margin-bottom: 10px;">
            <strong style="color: ${KANTO_COLORS.dark};">Angano —</strong> Récits oraux et contes traditionnels mis en scène avec audio
          </div>
          <div style="font-size: 13px; line-height: 22px; color: ${KANTO_COLORS.textPrimary}; margin-bottom: 10px;">
            <strong style="color: ${KANTO_COLORS.dark};">Kabary —</strong> Discours d'éloquence, protocoles et traditions orales
          </div>
          <div style="font-size: 13px; line-height: 22px; color: ${KANTO_COLORS.textPrimary}; margin-bottom: 10px;">
            <strong style="color: ${KANTO_COLORS.dark};">Tantara —</strong> Chroniques historiques, souverains et repères du patrimoine
          </div>
          <div style="font-size: 13px; line-height: 22px; color: ${KANTO_COLORS.textPrimary};">
            <strong style="color: ${KANTO_COLORS.dark};">Lalao —</strong> Défis linguistiques, quiz et jeux de mémoire
          </div>
        </td>
      </tr>
    </table>

    <p style="font-size: 13.5px; line-height: 22px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 20px 0;">
      Votre profil est actif. Lancez l'application mobile Kanto sur votre smartphone pour commencer votre première lecture ou écoute.
    </p>

    <div style="font-size: 13px; font-style: italic; color: ${KANTO_COLORS.textMuted}; border-top: 1px solid ${KANTO_COLORS.divider}; padding-top: 16px;">
      « Ny fahaizana lova tsara indrindra » — Le savoir est le plus précieux des héritages.
    </div>
  `;

  const html = renderEmailLayout({
    title: subject,
    preheader: 'Bienvenue sur Kanto, la mémoire et la culture de Madagascar',
    headerBadge: { label: 'Bienvenue', variant: 'tanimbary' },
    contentHtml,
  });

  return { subject, html, text };
}

/**
 * 3. Email de confirmation d'adresse email.
 */
export interface VerificationEmailData {
  to: string;
  verifyUrl: string;
  userName?: string;
  token?: string;
}

export function buildVerificationEmail(
  data: VerificationEmailData,
): EmailRenderOutput {
  const greeting = data.userName?.trim()
    ? `Bonjour ${data.userName.trim()},`
    : 'Bonjour,';
  const subject = 'Confirmation de votre adresse email — Kanto';

  const text = `${greeting}

Merci de rejoindre Kanto.

Pour valider votre adresse email et sécuriser l'accès à votre compte, veuillez ouvrir le lien ci-dessous :
${data.verifyUrl}

Ce lien reste actif pendant 24 heures. Si vous n'êtes pas à l'origine de cette inscription, vous pouvez ignorer cet email.

Kanto — Lova, Kolontsaina & Tantara Malagasy
https://kanto.mg`.trim();

  const contentHtml = `
    <h1 style="font-size: 18px; font-weight: 700; color: ${KANTO_COLORS.textPrimary}; margin: 0 0 16px 0; line-height: 24px; letter-spacing: -0.2px;">
      Confirmation de votre adresse email
    </h1>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 14px 0;">
      ${greeting}
    </p>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 20px 0;">
      Merci pour votre inscription sur Kanto. Pour finaliser la création de votre compte et sécuriser la sauvegarde de votre progression, confirmez votre adresse email en cliquant sur le bouton ci-dessous :
    </p>

    ${renderButton({
      text: 'Confirmer mon adresse email',
      url: data.verifyUrl,
      variant: 'primary',
    })}

    ${renderNotice({
      title: 'Délai de validation',
      content:
        "Ce lien reste valide pendant <strong>24 heures</strong>. Passé ce délai, vous pourrez solliciter un nouveau lien de vérification directement depuis l'écran de connexion de l'application.",
      variant: 'info',
    })}

    <p style="font-size: 12px; line-height: 18px; color: ${KANTO_COLORS.textFootnote}; margin: 24px 0 0 0; word-break: break-all;">
      Si le bouton ne répond pas, copiez ce lien directement dans votre navigateur :<br>
      <a href="${data.verifyUrl}" style="color: ${KANTO_COLORS.tanimbary}; text-decoration: underline;">${data.verifyUrl}</a>
    </p>
  `;

  const html = renderEmailLayout({
    title: subject,
    preheader: 'Confirmez votre adresse email pour activer votre compte Kanto',
    headerBadge: { label: 'Vérification', variant: 'tanimbary' },
    contentHtml,
  });

  return { subject, html, text };
}

/**
 * 4. Email de confirmation de candidature au programme Bêta Google Play.
 */
export interface BetaTesterRegistrationEmailData {
  to: string;
  fullName?: string;
  deviceModel?: string;
}

export function buildBetaTesterRegistrationEmail(
  data: BetaTesterRegistrationEmailData,
): EmailRenderOutput {
  const name = data.fullName?.trim() || 'Cher testeur';
  const subject = 'Candidature enregistrée au programme Bêta — Kanto';

  const text = `Bonjour ${name},

Votre demande pour rejoindre le programme de test fermé de Kanto sur Google Play a bien été prise en compte.

Adresse email enregistrée : ${data.to}
${data.deviceModel ? `Modèle d'appareil : ${data.deviceModel}\n` : ''}
Prochaines étapes :
1. Notre équipe technique ajoute votre adresse à la liste de testeurs sur la Google Play Console.
2. Dès validation par Google, vous recevrez un second e-mail contenant le lien pour accepter l'invitation sur le Web et le lien direct de téléchargement sur le Play Store.

Merci pour votre précieuse contribution au développement de Kanto.

L'équipe Kanto
https://kanto.mg`.trim();

  const metadataItems = [
    { label: 'Compte Google Play', value: data.to },
    ...(data.deviceModel
      ? [{ label: 'Modèle appareil', value: data.deviceModel }]
      : []),
    {
      label: 'Statut actuel',
      value: "En attente d'inscription Google Play Console",
    },
  ];

  const contentHtml = `
    <!-- Badge exclusif Google Play Bêta (état En attente) -->
    ${renderGooglePlayBadge({
      statusLabel: 'Candidature Reçue',
      contextLabel: 'Google Play Console • Test Fermé',
      state: 'pending',
    })}

    <h1 style="font-size: 19px; font-weight: 700; color: ${KANTO_COLORS.textPrimary}; margin: 0 0 14px 0; line-height: 26px;">
      Votre candidature a bien été enregistrée
    </h1>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 14px 0;">
      Bonjour <strong>${name}</strong>,
    </p>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 20px 0;">
      Nous avons bien reçu votre demande pour participer à la phase de test fermé de <strong>Kanto</strong> sur smartphone Android.
    </p>

    <!-- Tableau récapitulatif -->
    ${renderMetadataTable(metadataItems)}

    <div style="font-size: 13px; font-weight: 700; color: ${KANTO_COLORS.textPrimary}; text-transform: uppercase; letter-spacing: 0.8px; margin: 24px 0 12px 0;">
      Déroulement des prochaines étapes :
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 22px;">
      <tr>
        <td valign="top" width="24" style="font-size: 13px; font-weight: 700; color: ${KANTO_COLORS.tanimbary}; padding-top: 2px;">
          1.
        </td>
        <td style="font-size: 13.5px; line-height: 22px; color: ${KANTO_COLORS.textSecondary}; padding-bottom: 10px;">
          Notre équipe technique intègre manuellement votre compte à la liste fermée de la <strong>Google Play Console</strong>.
        </td>
      </tr>
      <tr>
        <td valign="top" width="24" style="font-size: 13px; font-weight: 700; color: ${KANTO_COLORS.tanimbary}; padding-top: 2px;">
          2.
        </td>
        <td style="font-size: 13.5px; line-height: 22px; color: ${KANTO_COLORS.textSecondary}; padding-bottom: 10px;">
          Dès que Google valide l'accès, vous recevrez un <strong>e-mail officiel d'invitation</strong> contenant les deux liens nécessaires (validation web et installation Play Store).
        </td>
      </tr>
      <tr>
        <td valign="top" width="24" style="font-size: 13px; font-weight: 700; color: ${KANTO_COLORS.tanimbary}; padding-top: 2px;">
          3.
        </td>
        <td style="font-size: 13.5px; line-height: 22px; color: ${KANTO_COLORS.textSecondary};">
          Vous découvrirez en avant-première nos contes traditionnels, kabary et jeux de réflexion malgaches.
        </td>
      </tr>
    </table>

    ${renderNotice({
      title: 'Vérification du compte Google',
      content: `Assurez-vous que l'adresse <code>${data.to}</code> correspond bien à celle configurée dans l'application Google Play Store sur votre appareil mobile.`,
      variant: 'warning',
    })}

    <p style="font-size: 13px; line-height: 20px; color: ${KANTO_COLORS.textMuted}; margin: 24px 0 0 0;">
      Misaotra amin'ny fandraisana anjara amin'ny fampandrosoana ny teny sy ny kolontsaina Malagasy.<br>
      <span style="font-weight: 600; color: ${KANTO_COLORS.textPrimary};">— L'équipe Kanto</span>
    </p>
  `;

  const html = renderEmailLayout({
    title: subject,
    preheader:
      'Confirmation de votre candidature au test fermé Kanto sur Google Play',
    headerBadge: { label: 'Bêta Google Play', variant: 'ambre' },
    contentHtml,
  });

  return { subject, html, text };
}

/**
 * 5. Email d'invitation officielle au programme Bêta Google Play.
 * Respecte l'exigence formelle : DEUX LIENS DISTINCTS ET NUMÉROTÉS
 * (Lien 1 : Adhésion Web obligatoire d'abord, Lien 2 : Téléchargement Play Store).
 */
export interface BetaTesterInvitationEmailData {
  to: string;
  fullName?: string;
  playStoreWebLink?: string;
  playStoreAppLink?: string;
}

export function buildBetaTesterInvitationEmail(
  data: BetaTesterInvitationEmailData,
): EmailRenderOutput {
  const name = data.fullName?.trim() || 'Cher testeur';
  const webLink =
    data.playStoreWebLink?.trim() ||
    'https://play.google.com/apps/testing/com.devengalere.kantomg';
  const appLink =
    data.playStoreAppLink?.trim() ||
    'https://play.google.com/store/apps/details?id=com.devengalere.kantomg';

  const subject = 'Votre accès Google Play pour Kanto est disponible';

  const text = `Bonjour ${name},

Bonne nouvelle : votre compte (${data.to}) a été autorisé pour le test privé de Kanto sur le Google Play Store.

Pour installer l'application, suivez impérativement ces deux étapes :

1. ACCEPTER L'INVITATION SUR LE WEB (Obligatoire d'abord) :
Ouvrez le lien ci-dessous avec votre compte Google (${data.to}) et cliquez sur « Devenir testeur » :
${webLink}

2. TÉLÉCHARGER L'APPLICATION SUR GOOGLE PLAY :
Une fois l'étape 1 validée, ouvrez la fiche de l'application sur le Play Store :
${appLink}

Note technique : si Google Play affiche « Application non disponible », patientez 5 à 10 minutes après l'étape 1 pour que Google propage vos autorisations.

Merci de participer à cette aventure culturelle !
— L'équipe Kanto
https://kanto.mg`.trim();

  const contentHtml = `
    <!-- Badge exclusif Google Play Bêta (état Actif) -->
    ${renderGooglePlayBadge({
      statusLabel: 'Accès Testeur Prêt',
      contextLabel: 'Google Play Console • Test Fermé',
      state: 'active',
    })}

    <h1 style="font-size: 19px; font-weight: 700; color: ${KANTO_COLORS.textPrimary}; margin: 0 0 14px 0; line-height: 26px;">
      Votre invitation au test fermé est disponible
    </h1>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 14px 0;">
      Bonjour <strong>${name}</strong>,
    </p>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 24px 0;">
      Votre adresse <strong>${data.to}</strong> est désormais habilitée sur la console de test de Google. Pour installer et exécuter la version d'évaluation sur votre appareil Android, veuillez suivre dans l'ordre les <strong>deux étapes</strong> suivantes :
    </p>

    <!-- ÉTAPE 1 : Validation Web Obligatoire (Mise en valeur) -->
    ${renderStepCard({
      stepNumber: '01',
      title:
        "Valider l'adhésion de testeur sur le Web (Obligatoire en premier)",
      description: `Ouvrez le lien ci-dessous avec votre compte Google (<code>${data.to}</code>) et cliquez sur le bouton <strong>« Devenir testeur »</strong>. Sans cette confirmation web préalable, Google Play n'autorisera pas l'accès au téléchargement.`,
      buttonText: '1. Accepter l’invitation sur le Web',
      buttonUrl: webLink,
      buttonVariant: 'primary',
      isHighlighted: true,
    })}

    <!-- ÉTAPE 2 : Téléchargement Play Store -->
    ${renderStepCard({
      stepNumber: '02',
      title: "Télécharger l'application sur Google Play",
      description:
        "Après avoir confirmé votre participation à l'étape 1, ouvrez la fiche officielle de l'application depuis votre appareil Android pour installer la dernière version de Kanto.",
      buttonText: '2. Télécharger Kanto sur Google Play',
      buttonUrl: appLink,
      buttonVariant: 'dark',
      isHighlighted: false,
    })}

    <!-- Notice technique d'assistance sans emoji -->
    ${renderNotice({
      title: 'Résolution d’incident : propagation Google Play',
      content: `Si Google Play indique temporairement <em>« Application non disponible pour ce compte »</em>, vérifiez que l'adresse active sur votre Play Store est bien <code>${data.to}</code>, puis patientez 5 à 10 minutes que la synchronisation des serveurs de Google soit effective.`,
      variant: 'warning',
    })}

    <p style="font-size: 13px; line-height: 21px; color: ${KANTO_COLORS.textSecondary}; margin: 24px 0 0 0;">
      Vos remarques et suggestions sont essentielles pour enrichir l'expérience finale avant la publication grand public.<br>
      Bonne découverte et merci pour votre engagement !
    </p>

    <p style="font-size: 13px; line-height: 20px; color: ${KANTO_COLORS.textMuted}; margin: 16px 0 0 0;">
      Misaotra amin'ny fiaraha-miasa.<br>
      <span style="font-weight: 600; color: ${KANTO_COLORS.textPrimary};">— L'équipe Kanto</span>
    </p>
  `;

  const html = renderEmailLayout({
    title: subject,
    preheader:
      'Vos liens d’accès Google Play pour installer la version Bêta de Kanto',
    headerBadge: { label: 'Accès Bêta Disponible', variant: 'tanimbary' },
    contentHtml,
  });

  return { subject, html, text };
}

/**
 * 6. Email de notification de feedback utilisateur (envoyé aux administrateurs).
 */
export interface FeedbackAdminEmailData {
  type: string;
  userEmail?: string;
  userName?: string;
  message: string;
  date?: Date;
}

export function buildFeedbackAdminEmail(
  data: FeedbackAdminEmailData,
): EmailRenderOutput {
  const typeMap: Record<string, string> = {
    bug: "Signalement d'anomalie",
    suggestion: "Suggestion d'amélioration",
    content: 'Remarque sur un contenu',
    general: "Retour d'expérience général",
  };

  const cleanType = typeMap[data.type] || "Retour d'expérience";
  const dateFormatted = (data.date || new Date()).toLocaleString('fr-FR');
  const subject = `[Kanto Feedback] ${cleanType} — ${dateFormatted}`;

  const fromDisplay = data.userName
    ? `${data.userName}${data.userEmail ? ` <${data.userEmail}>` : ''}`
    : data.userEmail || 'Utilisateur anonyme';

  const text = `Kanto — Avis Utilisateur

Type : ${cleanType}
De   : ${fromDisplay}
Date : ${dateFormatted}

Message :
${data.message.trim()}`.trim();

  const metadataItems = [
    { label: 'Type de retour', value: cleanType },
    { label: 'Expéditeur', value: fromDisplay },
    { label: 'Date de réception', value: dateFormatted },
  ];

  const sanitizedMessage = data.message
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const contentHtml = `
    <h1 style="font-size: 18px; font-weight: 700; color: ${KANTO_COLORS.textPrimary}; margin: 0 0 16px 0; line-height: 24px;">
      Nouveau message reçu depuis l'application
    </h1>

    ${renderMetadataTable(metadataItems)}

    <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: ${KANTO_COLORS.textMuted}; margin: 20px 0 8px 0;">
      Message de l'utilisateur :
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #FAF9F6; border-left: 3px solid ${KANTO_COLORS.tanimbary}; border-radius: 4px; margin-bottom: 20px;">
      <tr>
        <td style="padding: 16px 18px; font-size: 13.5px; line-height: 22px; color: ${KANTO_COLORS.textPrimary}; white-space: pre-wrap; font-family: ${KANTO_COLORS.textPrimary};">
          ${sanitizedMessage}
        </td>
      </tr>
    </table>

    <p style="font-size: 12px; color: ${KANTO_COLORS.textFootnote}; margin: 0;">
      Pour répondre à cet utilisateur, utilisez directement la fonction de réponse de votre logiciel de messagerie.
    </p>
  `;

  const html = renderEmailLayout({
    title: subject,
    preheader: `Avis reçu : ${cleanType}`,
    headerBadge: { label: 'Avis Utilisateur', variant: 'ambre' },
    contentHtml,
    showFooterLinks: false,
  });

  return { subject, html, text };
}

/**
 * 7. Email de test de configuration système (Resend).
 */
export interface SystemTestEmailData {
  to: string;
}

export function buildSystemTestEmail(
  data: SystemTestEmailData,
): EmailRenderOutput {
  const subject = 'Kanto — Test de messagerie opérationnel';
  const currentDate = new Date().toLocaleString('fr-FR');

  const text = `Kanto — Test de configuration de messagerie réussi

Votre service de messagerie transactionnelle est opérationnel.
Ce message valide la bonne liaison entre le backend Kanto et le service Resend.

Destinataire : ${data.to}
Date d'envoi : ${currentDate}
Service : Resend API

Kanto — Lova, Kolontsaina & Tantara Malagasy
https://kanto.mg`.trim();

  const metadataItems = [
    { label: 'Destinataire', value: data.to },
    { label: 'Date d’exécution', value: currentDate },
    { label: 'Moteur d’envoi', value: 'Resend API' },
    { label: 'Statut du service', value: 'Opérationnel' },
  ];

  const contentHtml = `
    <h1 style="font-size: 18px; font-weight: 700; color: ${KANTO_COLORS.textPrimary}; margin: 0 0 14px 0; line-height: 24px;">
      Test de messagerie transactionnelle réussi
    </h1>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 18px 0;">
      La configuration de messagerie du backend Kanto fonctionne correctement. Le service Resend est connecté et prêt pour l'expédition des e-mails en production.
    </p>

    ${renderMetadataTable(metadataItems)}

    ${renderNotice({
      title: 'Périmètre validé',
      content:
        'Ce test valide la délivrabilité des messages de réinitialisation de mot de passe, des confirmations de compte, des invitations au test Google Play ainsi que des alertes système.',
      variant: 'success',
    })}

    <p style="font-size: 12.5px; line-height: 19px; color: ${KANTO_COLORS.textMuted}; margin: 18px 0 0 0;">
      Notification automatique générée par la suite d'administration Kanto.
    </p>
  `;

  const html = renderEmailLayout({
    title: subject,
    preheader: 'Test de configuration du service de messagerie Kanto',
    headerBadge: { label: 'Supervision Système', variant: 'tanimbary' },
    contentHtml,
  });

  return { subject, html, text };
}
