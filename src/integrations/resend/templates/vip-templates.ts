import { KANTO_COLORS, escapeHtml } from './common.js';
import { renderEmailLayout } from './email-layout.js';
import { renderButton, renderNotice, renderMetadataTable } from './components.js';
import type { EmailRenderOutput } from './templates.js';

function formatDateFr(date: Date): string {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Indian/Antananarivo',
    }).format(date);
  } catch {
    return date.toISOString().split('T')[0];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. VIP ACCORDÉ
// ─────────────────────────────────────────────────────────────────────────────

export interface VipGrantedEmailData {
  to: string;
  userName?: string;
  durationDays?: number;
  expiresAt?: Date | null;
}

export function buildVipGrantedEmail(data: VipGrantedEmailData): EmailRenderOutput {
  const safeName = escapeHtml(data.userName?.trim());
  const greetingHtml = safeName ? `Bonjour ${safeName},` : 'Bonjour,';
  const greetingText = data.userName?.trim() ? `Bonjour ${data.userName.trim()},` : 'Bonjour,';

  const isPermanent = !data.expiresAt && !data.durationDays;
  const expiryLabel = isPermanent
    ? 'Accès permanent (à vie)'
    : data.expiresAt
    ? formatDateFr(new Date(data.expiresAt))
    : `${data.durationDays} jours`;

  const subject = '👑 Votre statut VIP Kanto MG est désormais actif !';

  const text = `${greetingText}

Nous avons le plaisir de vous informer que votre compte bénéficie désormais du statut VIP sur Kanto MG.

Vos avantages exclusifs :
- Suppression complète de toutes les publicités (bannières, interstitiels, vidéos récompensées).
- Expérience de lecture et d'apprentissage 100 % fluide et immersive.
- Durée de validité : ${expiryLabel}.

Ouvrez dès maintenant l'application Kanto MG pour profiter de vos avantages !

Kanto MG — Lova, Kolontsaina & Tantara Malagasy
https://app-kanto.gastsar.fr`.trim();

  const metadataRows = [
    { label: 'Statut du compte', value: '👑 Membre VIP Privilège' },
    { label: 'Publicités AdMob', value: 'Désactivées (Expérience fluide sans pub)' },
    { label: 'Durée de validité', value: expiryLabel },
  ];

  const contentHtml = `
    <h1 style="font-size: 20px; font-weight: 700; color: ${KANTO_COLORS.textPrimary}; margin: 0 0 16px 0; line-height: 26px;">
      Félicitations, vous êtes membre VIP ! 👑
    </h1>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 14px 0;">
      ${greetingHtml}
    </p>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 20px 0;">
      Votre compte a été surclassé au statut <strong>VIP</strong> sur l'application mobile <strong>Kanto MG</strong>. Vous profitez désormais d'une expérience culturelle premium et ininterrompue.
    </p>

    ${renderMetadataTable(metadataRows)}

    <div style="margin: 24px 0;">
      ${renderButton({
        text: 'Ouvrir l’application Kanto',
        url: 'https://app-kanto.gastsar.fr',
        variant: 'terracotta',
      })}
    </div>

    ${renderNotice({
      title: 'Vos avantages VIP',
      content:
        'Toutes les publicités ont été immédiatement retirées de votre interface mobile. Si vous avez déjà l’application ouverte, il vous suffit de la relancer pour que vos droits soient actualisés.',
      variant: 'success',
    })}
  `;

  const html = renderEmailLayout({
    title: subject,
    preheader: 'Votre statut VIP est activé sur Kanto MG — Zéro publicité',
    headerBadge: { label: 'Statut VIP Activé', variant: 'terracotta' },
    contentHtml,
  });

  return { subject, html, text };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. VIP PROLONGÉ
// ─────────────────────────────────────────────────────────────────────────────

export interface VipExtendedEmailData {
  to: string;
  userName?: string;
  addedDays: number;
  newExpiresAt: Date;
}

export function buildVipExtendedEmail(data: VipExtendedEmailData): EmailRenderOutput {
  const safeName = escapeHtml(data.userName?.trim());
  const greetingHtml = safeName ? `Bonjour ${safeName},` : 'Bonjour,';
  const greetingText = data.userName?.trim() ? `Bonjour ${data.userName.trim()},` : 'Bonjour,';
  const newDateLabel = formatDateFr(new Date(data.newExpiresAt));

  const subject = `🎉 Votre statut VIP Kanto MG a été prolongé jusqu'au ${newDateLabel}`;

  const text = `${greetingText}

Bonne nouvelle ! Votre statut VIP sur Kanto MG a été prolongé de ${data.addedDays} jours supplémentaires.

Votre nouvelle date d'expiration est le : ${newDateLabel}.
Vous continuez de profiter de l'intégralité de l'application sans aucune publicité.

Kanto MG — Lova, Kolontsaina & Tantara Malagasy
https://app-kanto.gastsar.fr`.trim();

  const metadataRows = [
    { label: 'Prolongation accordée', value: `+${data.addedDays} jours` },
    { label: 'Nouvelle date d’expiration', value: newDateLabel },
    { label: 'Publicités', value: 'Désactivées' },
  ];

  const contentHtml = `
    <h1 style="font-size: 20px; font-weight: 700; color: ${KANTO_COLORS.textPrimary}; margin: 0 0 16px 0; line-height: 26px;">
      Prolongation de votre statut VIP 🎉
    </h1>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 14px 0;">
      ${greetingHtml}
    </p>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 20px 0;">
      Votre accès VIP à <strong>Kanto MG</strong> a été prolongé de <strong>${data.addedDays} jours</strong>. Vous conservez ainsi tous vos privilèges sans interruption.
    </p>

    ${renderMetadataTable(metadataRows)}

    <div style="margin: 24px 0;">
      ${renderButton({
        text: 'Accéder à Kanto MG',
        url: 'https://app-kanto.gastsar.fr',
        variant: 'terracotta',
      })}
    </div>
  `;

  const html = renderEmailLayout({
    title: subject,
    preheader: `Votre statut VIP est prolongé jusqu'au ${newDateLabel}`,
    headerBadge: { label: 'VIP Prolongé', variant: 'terracotta' },
    contentHtml,
  });

  return { subject, html, text };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. VIP EXPIRATION IMMINENTE (Rappel J-3)
// ─────────────────────────────────────────────────────────────────────────────

export interface VipExpiringSoonEmailData {
  to: string;
  userName?: string;
  expiresAt: Date;
  daysRemaining: number;
}

export function buildVipExpiringEmail(data: VipExpiringSoonEmailData): EmailRenderOutput {
  const safeName = escapeHtml(data.userName?.trim());
  const greetingHtml = safeName ? `Bonjour ${safeName},` : 'Bonjour,';
  const greetingText = data.userName?.trim() ? `Bonjour ${data.userName.trim()},` : 'Bonjour,';
  const expiryDateLabel = formatDateFr(new Date(data.expiresAt));

  const subject = `⏳ Votre statut VIP Kanto MG expire dans ${data.daysRemaining} jours`;

  const text = `${greetingText}

Votre statut VIP sur l'application Kanto MG arrive bientôt à échéance.

Date d'expiration prévue : ${expiryDateLabel} (dans ${data.daysRemaining} jours).

À cette date, votre compte repassera automatiquement en statut standard et les publicités seront réactivées dans votre application.

Kanto MG — Lova, Kolontsaina & Tantara Malagasy
https://app-kanto.gastsar.fr`.trim();

  const contentHtml = `
    <h1 style="font-size: 20px; font-weight: 700; color: ${KANTO_COLORS.textPrimary}; margin: 0 0 16px 0; line-height: 26px;">
      Votre statut VIP expire bientôt ⏳
    </h1>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 14px 0;">
      ${greetingHtml}
    </p>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 20px 0;">
      Nous vous informons que votre avantage VIP sur <strong>Kanto MG</strong> arrivera à expiration le <strong>${expiryDateLabel}</strong> (dans environ ${data.daysRemaining} jours).
    </p>

    ${renderNotice({
      title: 'Que se passe-t-il à expiration ?',
      content:
        'Votre compte restera pleinement accessible avec toutes vos données et progressions. Seules les publicités discrètes seront réactivées lors de vos sessions.',
      variant: 'info',
    })}

    <div style="margin: 24px 0;">
      ${renderButton({
        text: 'Ouvrir mon compte Kanto',
        url: 'https://app-kanto.gastsar.fr',
        variant: 'terracotta',
      })}
    </div>
  `;

  const html = renderEmailLayout({
    title: subject,
    preheader: `Votre avantage VIP expire le ${expiryDateLabel}`,
    headerBadge: { label: 'Rappel VIP', variant: 'terracotta' },
    contentHtml,
  });

  return { subject, html, text };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. VIP EXPIRÉ
// ─────────────────────────────────────────────────────────────────────────────

export interface VipExpiredEmailData {
  to: string;
  userName?: string;
}

export function buildVipExpiredEmail(data: VipExpiredEmailData): EmailRenderOutput {
  const safeName = escapeHtml(data.userName?.trim());
  const greetingHtml = safeName ? `Bonjour ${safeName},` : 'Bonjour,';
  const greetingText = data.userName?.trim() ? `Bonjour ${data.userName.trim()},` : 'Bonjour,';

  const subject = 'Votre statut VIP Kanto MG est arrivé à expiration';

  const text = `${greetingText}

Votre période d'avantage VIP sur Kanto MG est désormais terminée. Votre compte est repassé au statut standard.

Vous continuez d'avoir un accès complet à l'ensemble du patrimoine culturel malgache, à vos favoris et à vos progressions.

Kanto MG — Lova, Kolontsaina & Tantara Malagasy
https://app-kanto.gastsar.fr`.trim();

  const contentHtml = `
    <h1 style="font-size: 20px; font-weight: 700; color: ${KANTO_COLORS.textPrimary}; margin: 0 0 16px 0; line-height: 26px;">
      Votre avantage VIP est arrivé à son terme
    </h1>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 14px 0;">
      ${greetingHtml}
    </p>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 20px 0;">
      Votre avantage VIP sur <strong>Kanto MG</strong> a pris fin. Votre compte fonctionne désormais sous l’abonnement standard.
    </p>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 20px 0;">
      Vous conservez l'intégralité de votre progression, de vos points XP, de vos badges et de vos contributions culturelles.
    </p>

    <div style="margin: 24px 0;">
      ${renderButton({
        text: 'Continuer sur Kanto MG',
        url: 'https://app-kanto.gastsar.fr',
        variant: 'terracotta',
      })}
    </div>
  `;

  const html = renderEmailLayout({
    title: subject,
    preheader: 'Votre statut VIP sur Kanto MG est arrivé à terme',
    headerBadge: { label: 'Statut Standard', variant: 'terracotta' },
    contentHtml,
  });

  return { subject, html, text };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. COMPTE SUSPENDU (Banned)
// ─────────────────────────────────────────────────────────────────────────────

export interface UserBannedEmailData {
  to: string;
  userName?: string;
  reason: string;
  banExpires?: Date | null;
}

export function buildUserBannedEmail(data: UserBannedEmailData): EmailRenderOutput {
  const safeName = escapeHtml(data.userName?.trim());
  const greetingHtml = safeName ? `Bonjour ${safeName},` : 'Bonjour,';
  const greetingText = data.userName?.trim() ? `Bonjour ${data.userName.trim()},` : 'Bonjour,';
  const safeReason = escapeHtml(data.reason);

  const expiryLabel = data.banExpires
    ? formatDateFr(new Date(data.banExpires))
    : 'Indéterminée (suspension définitive)';

  const subject = 'Notification importante concernant votre compte Kanto MG';

  const text = `${greetingText}

Nous vous informons que votre compte utilisateur sur Kanto MG a fait l'objet d'une mesure de suspension administrative.

Motif notifié : ${data.reason}
Durée / Date de fin : ${expiryLabel}

Pendant la durée de cette suspension, vos sessions ont été révoquées et vous ne pouvez plus interagir sur la plateforme.

Pour toute question ou contestation, vous pouvez contacter notre équipe à contact@gastsar.fr.

L'équipe Kanto MG`.trim();

  const contentHtml = `
    <h1 style="font-size: 20px; font-weight: 700; color: ${KANTO_COLORS.textPrimary}; margin: 0 0 16px 0; line-height: 26px;">
      Suspension de votre compte Kanto MG
    </h1>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 14px 0;">
      ${greetingHtml}
    </p>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 20px 0;">
      Une mesure administrative de suspension a été appliquée à votre compte Kanto MG pour non-respect des règles de la communauté ou des conditions d’utilisation.
    </p>

    ${renderNotice({
      title: 'Motif de la décision',
      content: `<strong>Motif :</strong> ${safeReason}<br><strong>Échéance :</strong> ${expiryLabel}`,
      variant: 'security',
    })}

    <p style="font-size: 13px; line-height: 21px; color: ${KANTO_COLORS.textSecondary}; margin: 20px 0 0 0;">
      Si vous estimez qu'il s'agit d'une erreur ou pour obtenir des clarifications, vous pouvez contacter l'équipe de modération par réponse à ce message ou à <strong>contact@gastsar.fr</strong>.
    </p>
  `;

  const html = renderEmailLayout({
    title: subject,
    preheader: 'Notification importante concernant votre compte Kanto MG',
    headerBadge: { label: 'Alerte Modération', variant: 'terracotta' },
    contentHtml,
  });

  return { subject, html, text };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. COMPTE RÉACTIVÉ (Unbanned)
// ─────────────────────────────────────────────────────────────────────────────

export interface UserUnbannedEmailData {
  to: string;
  userName?: string;
}

export function buildUserUnbannedEmail(data: UserUnbannedEmailData): EmailRenderOutput {
  const safeName = escapeHtml(data.userName?.trim());
  const greetingHtml = safeName ? `Bonjour ${safeName},` : 'Bonjour,';
  const greetingText = data.userName?.trim() ? `Bonjour ${data.userName.trim()},` : 'Bonjour,';

  const subject = 'Votre compte Kanto MG a été réactivé';

  const text = `${greetingText}

Nous avons le plaisir de vous informer que la suspension de votre compte Kanto MG a été levée.

Vous pouvez dès à présent vous reconnecter à l'application et profiter de tous vos contenus culturels.

Kanto MG — Lova, Kolontsaina & Tantara Malagasy
https://app-kanto.gastsar.fr`.trim();

  const contentHtml = `
    <h1 style="font-size: 20px; font-weight: 700; color: ${KANTO_COLORS.textPrimary}; margin: 0 0 16px 0; line-height: 26px;">
      Votre compte est de nouveau actif 🎉
    </h1>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 14px 0;">
      ${greetingHtml}
    </p>

    <p style="font-size: 14px; line-height: 23px; color: ${KANTO_COLORS.textSecondary}; margin: 0 0 20px 0;">
      La mesure de suspension appliquée à votre compte Kanto MG a été levée par notre équipe. Vous pouvez vous reconnecter normalement sur l'application mobile.
    </p>

    <div style="margin: 24px 0;">
      ${renderButton({
        text: 'Se connecter à Kanto MG',
        url: 'https://app-kanto.gastsar.fr',
        variant: 'terracotta',
      })}
    </div>
  `;

  const html = renderEmailLayout({
    title: subject,
    preheader: 'Votre compte Kanto MG est de nouveau accessible',
    headerBadge: { label: 'Compte Réactivé', variant: 'terracotta' },
    contentHtml,
  });

  return { subject, html, text };
}
