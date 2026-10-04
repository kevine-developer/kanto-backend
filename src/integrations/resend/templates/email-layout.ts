import { KANTO_COLORS, FONT_STACK } from './common.js';

export interface EmailLayoutOptions {
  /** Titre de la page e-mail (balise <title>) */
  title: string;
  /** Texte d'aperçu pré-header invisible */
  preheader?: string;
  /** Libellé du badge en en-tête (ex: 'Sécurité', 'Google Play Bêta', 'Bienvenue') */
  headerBadge?: {
    label: string;
    variant?: 'tanimbary' | 'ambre' | 'terracotta' | 'dark' | 'neutral';
  };
  /** Contenu HTML du corps de l'email */
  contentHtml: string;
  /** Afficher les liens du centre d'aide dans le pied de page */
  showFooterLinks?: boolean;
}

/**
 * Gabarit global unifié pour tous les e-mails transactionnels Kanto.
 * Garantit une identité graphique cohérente, sobre, patrimoniale et sans aucun emoji.
 */
export function renderEmailLayout(options: EmailLayoutOptions): string {
  const currentYear = new Date().getFullYear();
  const preheaderText = options.preheader || options.title;

  // Calcul du style du badge d'en-tête
  const badgeVariant = options.headerBadge?.variant || 'tanimbary';
  let badgeBg: string = KANTO_COLORS.tanimbaryLight;
  let badgeBorder: string = KANTO_COLORS.tanimbaryBorder;
  let badgeColor: string = KANTO_COLORS.tanimbaryText;

  if (badgeVariant === 'terracotta') {
    badgeBg = KANTO_COLORS.terracottaLight;
    badgeBorder = KANTO_COLORS.terracottaBorder;
    badgeColor = KANTO_COLORS.terracottaText;
  } else if (badgeVariant === 'ambre') {
    badgeBg = KANTO_COLORS.ambreLight;
    badgeBorder = KANTO_COLORS.ambreBorder;
    badgeColor = KANTO_COLORS.ambreText;
  } else if (badgeVariant === 'dark') {
    badgeBg = '#262626';
    badgeBorder = '#3D3D3D';
    badgeColor = '#FFFFFF';
  } else if (badgeVariant === 'neutral') {
    badgeBg = '#F0EDE8';
    badgeBorder = '#E2DED6';
    badgeColor = KANTO_COLORS.textSecondary;
  }

  const badgeHtml = options.headerBadge
    ? `<span style="display: inline-block; font-size: 11px; font-weight: 600; letter-spacing: 0.4px; text-transform: uppercase; color: ${badgeColor}; background-color: ${badgeBg}; border: 1px solid ${badgeBorder}; padding: 4px 10px; border-radius: 9999px; line-height: 14px;">
        ${options.headerBadge.label}
      </span>`
    : '';

  const footerLinksHtml =
    options.showFooterLinks !== false
      ? `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top: 10px;">
          <tr>
            <td align="center" style="font-size: 11px; color: ${KANTO_COLORS.textFootnote}; line-height: 18px;">
              <a href="https://kanto.mg" target="_blank" style="color: ${KANTO_COLORS.tanimbary}; text-decoration: none; font-weight: 500;">kanto.mg</a>
              <span style="color: ${KANTO_COLORS.cardBorder}; margin: 0 6px;">•</span>
              <a href="https://kanto.mg/pages/help" target="_blank" style="color: ${KANTO_COLORS.textMuted}; text-decoration: none;">Aide &amp; Support</a>
              <span style="color: ${KANTO_COLORS.cardBorder}; margin: 0 6px;">•</span>
              <a href="https://kanto.mg/pages/privacy" target="_blank" style="color: ${KANTO_COLORS.textMuted}; text-decoration: none;">Confidentialité</a>
            </td>
          </tr>
        </table>`
      : '';

  return `<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${options.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: ${KANTO_COLORS.bodyBg}; font-family: ${FONT_STACK}; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .email-content-cell { padding: 24px 20px !important; }
      .email-header-cell { padding: 20px 20px 16px 20px !important; }
      .email-footer-cell { padding: 18px 20px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .mobile-center { text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${KANTO_COLORS.bodyBg}; color: ${KANTO_COLORS.textPrimary}; font-family: ${FONT_STACK}; -webkit-font-smoothing: antialiased;">
  <!-- Préheader masqué pour les clients mails -->
  <div style="display: none; font-size: 1px; color: ${KANTO_COLORS.bodyBg}; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheaderText} &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: ${KANTO_COLORS.bodyBg}; padding: 36px 16px;">
    <tr>
      <td align="center">
        <!-- Carte Principale Kanto -->
        <table class="email-container" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 540px; background-color: ${KANTO_COLORS.cardBg}; border: 1px solid ${KANTO_COLORS.cardBorder}; border-radius: 12px; overflow: hidden; box-shadow: 0 3px 12px rgba(0, 0, 0, 0.03);">
          
          <!-- En-tête Unifié Kanto -->
          <tr>
            <td class="email-header-cell" style="padding: 26px 32px 20px 32px; border-bottom: 1px solid ${KANTO_COLORS.divider}; background-color: #FAF9F6;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td valign="middle">
                    <div style="font-size: 15px; font-weight: 800; letter-spacing: 3.5px; color: ${KANTO_COLORS.dark}; text-transform: uppercase; line-height: 18px;">
                      KANTO
                    </div>
                    <div style="font-size: 11px; font-weight: 500; color: ${KANTO_COLORS.textMuted}; letter-spacing: 0.3px; margin-top: 3px;">
                      Lova • Kolontsaina • Tantara
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    ${badgeHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Corps de l'email -->
          <tr>
            <td class="email-content-cell" style="padding: 32px 32px;">
              ${options.contentHtml}
            </td>
          </tr>

          <!-- Pied de page officiel Kanto -->
          <tr>
            <td class="email-footer-cell" style="padding: 20px 32px 24px 32px; background-color: #FAF9F6; border-top: 1px solid ${KANTO_COLORS.divider};">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center">
                    <p style="font-size: 11.5px; color: ${KANTO_COLORS.textFootnote}; margin: 0; line-height: 18px; letter-spacing: 0.1px;">
                      © ${currentYear} Kanto • Lova, Kolontsaina &amp; Tantara Malagasy
                    </p>
                    <p style="font-size: 11px; color: ${KANTO_COLORS.textFootnote}; margin: 4px 0 0 0; line-height: 16px;">
                      Plateforme culturelle dédiée au patrimoine et à la langue de Madagascar
                    </p>
                    ${footerLinksHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}
