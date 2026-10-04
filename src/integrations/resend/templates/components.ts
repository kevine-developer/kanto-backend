import { KANTO_COLORS, FONT_STACK, getGooglePlaySvgIcon } from './common.js';

export interface ButtonOptions {
  text: string;
  url: string;
  variant?: 'primary' | 'terracotta' | 'dark' | 'outline';
  fullWidth?: boolean;
}

/**
 * Bouton d'action standardisé pour les e-mails Kanto.
 * Sans emoji, optimisé pour le clic et le rendu multi-clients (Gmail, Apple Mail, Outlook).
 */
export function renderButton(options: ButtonOptions): string {
  const { text, url, variant = 'primary', fullWidth = false } = options;

  let bg: string = KANTO_COLORS.tanimbary;
  let color: string = '#FFFFFF';
  let border: string = 'none';

  if (variant === 'terracotta') {
    bg = KANTO_COLORS.terracotta;
    color = '#FFFFFF';
  } else if (variant === 'dark') {
    bg = KANTO_COLORS.dark;
    color = '#FFFFFF';
  } else if (variant === 'outline') {
    bg = '#FFFFFF';
    color = KANTO_COLORS.textPrimary;
    border = `1px solid ${KANTO_COLORS.cardBorder}`;
  }

  const tableWidth = fullWidth ? '100%' : 'auto';
  const displayStyle = fullWidth ? 'block' : 'inline-block';

  return `<table width="${tableWidth}" cellpadding="0" cellspacing="0" role="presentation" style="margin: 20px 0;">
    <tr>
      <td align="${fullWidth ? 'center' : 'left'}">
        <a href="${url}" target="_blank" rel="noopener noreferrer" style="display: ${displayStyle}; background-color: ${bg}; color: ${color} !important; text-decoration: none; font-family: ${FONT_STACK}; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 8px; border: ${border}; text-align: center; letter-spacing: 0.1px;">
          ${text}
        </a>
      </td>
    </tr>
  </table>`;
}

/**
 * Badge exclusif Google Play Bêta Kanto.
 * Design haut de gamme, sobre, intégrant le symbole officiel vectoriel Google Play
 * et une pastille d'accréditation officielle sans emoji.
 */
export interface GooglePlayBadgeOptions {
  /** Statut principal (ex: 'Accès Bêta Autorisé' ou 'Candidature Enregistrée') */
  statusLabel?: string;
  /** Sous-titre ou programme (ex: 'Closed Testing • Version Mobile Android') */
  contextLabel?: string;
  /** État du badge : 'active' (vert prêt) ou 'pending' (en attente ocre) */
  state?: 'active' | 'pending';
}

export function renderGooglePlayBadge(
  options: GooglePlayBadgeOptions = {},
): string {
  const {
    statusLabel = 'Accès Bêta Autorisé',
    contextLabel = 'Google Play Console • Test Fermé',
    state = 'active',
  } = options;

  const isPending = state === 'pending';
  const statusBg = isPending ? '#2B2114' : '#1C291B';
  const statusBorder = isPending ? '#5A3D18' : '#334F31';
  const statusColor = isPending ? '#F7C97E' : '#94E090';
  const dotColor = isPending ? '#E59834' : '#22C55E';

  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #171B16; border: 1px solid #2B382A; border-radius: 10px; margin: 0 0 24px 0; overflow: hidden;">
    <tr>
      <td style="padding: 16px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <!-- Symbole vectoriel Google Play -->
            <td width="36" valign="middle" style="padding-right: 14px;">
              <table cellpadding="0" cellspacing="0" role="presentation" style="background-color: #242D23; border: 1px solid #364835; border-radius: 8px; width: 38px; height: 38px; text-align: center;">
                <tr>
                  <td align="center" valign="middle">
                    ${getGooglePlaySvgIcon(22)}
                  </td>
                </tr>
              </table>
            </td>

            <!-- Libellés du programme -->
            <td valign="middle">
              <div style="font-size: 10.5px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #8CA38A; line-height: 14px;">
                ${contextLabel}
              </div>
              <div style="font-size: 14px; font-weight: 700; color: #FFFFFF; margin-top: 2px; line-height: 18px;">
                Programme Bêta Officiel
              </div>
            </td>

            <!-- Pastille de statut -->
            <td align="right" valign="middle">
              <table cellpadding="0" cellspacing="0" role="presentation" style="background-color: ${statusBg}; border: 1px solid ${statusBorder}; border-radius: 9999px; padding: 4px 10px;">
                <tr>
                  <td valign="middle" style="padding-right: 6px;">
                    <div style="width: 7px; height: 7px; background-color: ${dotColor}; border-radius: 50%;"></div>
                  </td>
                  <td valign="middle" style="font-size: 11px; font-weight: 600; color: ${statusColor}; letter-spacing: 0.2px; white-space: nowrap;">
                    ${statusLabel}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

/**
 * Bloc de notice éditoriale (sécurité, avertissement, aide).
 */
export interface NoticeOptions {
  title?: string;
  content: string;
  variant?: 'info' | 'warning' | 'security' | 'success';
}

export function renderNotice(options: NoticeOptions): string {
  const { title, content, variant = 'info' } = options;

  let bg: string = '#F7F6F2';
  let borderLeft: string = KANTO_COLORS.tanimbary;
  let textColor: string = KANTO_COLORS.textSecondary;
  let titleColor: string = KANTO_COLORS.textPrimary;

  if (variant === 'warning') {
    bg = KANTO_COLORS.ambreLight;
    borderLeft = KANTO_COLORS.ambre;
    textColor = KANTO_COLORS.ambreText;
    titleColor = '#5C3C0B';
  } else if (variant === 'security') {
    bg = KANTO_COLORS.terracottaLight;
    borderLeft = KANTO_COLORS.terracotta;
    textColor = KANTO_COLORS.terracottaText;
    titleColor = '#50140D';
  } else if (variant === 'success') {
    bg = KANTO_COLORS.tanimbaryLight;
    borderLeft = KANTO_COLORS.tanimbary;
    textColor = KANTO_COLORS.tanimbaryText;
    titleColor = '#21331D';
  }

  const titleHtml = title
    ? `<div style="font-size: 12.5px; font-weight: 700; color: ${titleColor}; margin-bottom: 4px; letter-spacing: 0.1px;">${title}</div>`
    : '';

  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: ${bg}; border-left: 3px solid ${borderLeft}; border-radius: 4px; margin: 20px 0;">
    <tr>
      <td style="padding: 14px 16px;">
        ${titleHtml}
        <div style="font-size: 12.5px; line-height: 20px; color: ${textColor};">
          ${content}
        </div>
      </td>
    </tr>
  </table>`;
}

/**
 * Carte d'étape d'installation pour le programme Bêta Google Play.
 * Permet de distinguer clairement l'Étape 1 (Adhésion Web obligatoire) et l'Étape 2 (Téléchargement App).
 */
export interface StepCardOptions {
  stepNumber: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  buttonVariant?: 'primary' | 'dark' | 'outline';
  isHighlighted?: boolean;
}

export function renderStepCard(options: StepCardOptions): string {
  const {
    stepNumber,
    title,
    description,
    buttonText,
    buttonUrl,
    buttonVariant = 'primary',
    isHighlighted = false,
  } = options;

  const cardBg = isHighlighted ? '#F8FAF6' : '#FFFFFF';
  const cardBorder = isHighlighted
    ? KANTO_COLORS.tanimbaryBorder
    : KANTO_COLORS.cardBorder;
  const numBg = isHighlighted ? KANTO_COLORS.tanimbary : KANTO_COLORS.dark;
  const numColor = '#FFFFFF';

  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 10px; margin-bottom: 16px;">
    <tr>
      <td style="padding: 20px 22px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <!-- Numéro d'étape sobre -->
            <td width="36" valign="top" style="padding-right: 14px;">
              <table cellpadding="0" cellspacing="0" role="presentation" style="width: 32px; height: 32px; background-color: ${numBg}; border-radius: 6px; text-align: center;">
                <tr>
                  <td align="center" valign="middle" style="font-size: 13px; font-weight: 700; color: ${numColor};">
                    ${stepNumber}
                  </td>
                </tr>
              </table>
            </td>

            <!-- Contenu textuel -->
            <td valign="top">
              <div style="font-size: 14.5px; font-weight: 700; color: ${KANTO_COLORS.textPrimary}; line-height: 20px; margin-bottom: 6px;">
                ${title}
              </div>
              <div style="font-size: 13px; line-height: 21px; color: ${KANTO_COLORS.textSecondary}; margin-bottom: 16px;">
                ${description}
              </div>

              <!-- Bouton d'action de l'étape -->
              ${renderButton({
                text: buttonText,
                url: buttonUrl,
                variant: buttonVariant,
                fullWidth: false,
              })}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

/**
 * Tableau clé-valeur sobre pour les métadonnées (comptes, dates, statuts).
 */
export function renderMetadataTable(
  items: { label: string; value: string }[],
): string {
  const rowsHtml = items
    .map(
      (item, idx) => `
    <tr>
      <td style="padding: 8px 12px; font-size: 12px; font-weight: 600; color: ${KANTO_COLORS.textMuted}; width: 140px; border-bottom: ${
        idx === items.length - 1 ? 'none' : `1px solid ${KANTO_COLORS.divider}`
      };">
        ${item.label}
      </td>
      <td style="padding: 8px 12px; font-size: 13px; font-weight: 500; color: ${KANTO_COLORS.textPrimary}; border-bottom: ${
        idx === items.length - 1 ? 'none' : `1px solid ${KANTO_COLORS.divider}`
      }; font-family: monospace, ${FONT_STACK};">
        ${item.value}
      </td>
    </tr>`,
    )
    .join('');

  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #F8F7F4; border: 1px solid ${KANTO_COLORS.cardBorder}; border-radius: 8px; margin: 18px 0; overflow: hidden;">
    ${rowsHtml}
  </table>`;
}
