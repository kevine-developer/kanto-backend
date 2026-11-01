import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';
import { ResendService } from '../../integrations/resend/resend.service.js';

export interface EmailContextVariables {
  userName?: string;
  userEmail?: string;
  platform?: string;
  downloadLink?: string;
  testFlightLink?: string;
  androidTestingLink?: string;
  appVersion?: string;
  supportEmail?: string;
  unsubscribeLink?: string;
  [key: string]: string | undefined;
}

@Injectable()
export class BetaEmailDispatcherService {
  private readonly logger = new Logger(BetaEmailDispatcherService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly resendService: ResendService,
  ) {}

  /**
   * Envoie un email basé sur un code de modèle administrable (BetaEmailTemplate).
   */
  async sendTemplateEmail(options: {
    to: string;
    templateCode: string;
    variables: EmailContextVariables;
    customSubject?: string;
    customContentHtml?: string;
    bypassSuppression?: boolean;
  }) {
    const { to, templateCode, variables, customSubject, customContentHtml, bypassSuppression } = options;

    // 1. Récupération de la configuration globale pour liens par défaut
    const config = await this.prisma.betaAutomationConfig.findFirst();
    const supportEmail = config?.supportEmail || 'contact@kanto.mg';
    const playStoreWebLink = config?.playStoreWebLink || 'https://play.google.com/apps/testing/com.devengalere.kantomg';
    const playStoreAppLink = config?.playStoreAppLink || 'https://play.google.com/store/apps/details?id=com.devengalere.kantomg';
    const testFlightLink = config?.testFlightPublicLink || 'https://testflight.apple.com/join/kantomg';

    // 2. Fusion des variables par défaut
    const mergedVars: Record<string, string> = {
      userName: variables.userName || 'Bêta-testeur',
      userEmail: to,
      platform: variables.platform || 'Android & iOS',
      downloadLink: variables.downloadLink || playStoreAppLink,
      testFlightLink: variables.testFlightLink || testFlightLink,
      androidTestingLink: variables.androidTestingLink || playStoreWebLink,
      appVersion: variables.appVersion || '0.1.0',
      supportEmail: variables.supportEmail || supportEmail,
      unsubscribeLink: variables.unsubscribeLink || `https://app-kanto.gastsar.fr/beta?tab=unsubscribe&email=${encodeURIComponent(to)}`,
      ...Object.fromEntries(
        Object.entries(variables).filter(([, v]) => typeof v === 'string') as [string, string][]
      ),
    };

    // 3. Récupération du modèle en base de données
    const tpl = await this.prisma.betaEmailTemplate.findUnique({
      where: { code: templateCode },
    });

    const subjectRaw = customSubject || tpl?.subject || 'Information Kanto MG Bêta';
    const titleRaw = tpl?.title || 'Programme de Test Kanto MG';
    const contentRaw = customContentHtml || tpl?.contentHtml || '<p>Merci pour votre participation au test de Kanto MG.</p>';
    const buttonTextRaw = tpl?.buttonText || '';
    const buttonUrlRaw = tpl?.buttonUrl || '';
    const secondaryButtonTextRaw = tpl?.secondaryButtonText || '';
    const secondaryButtonUrlRaw = tpl?.secondaryButtonUrl || '';
    const footerTextRaw = tpl?.footerText || 'Kanto MG — Le sanctuaire de la culture malgache.';
    const accentColor = tpl?.accentColor || '#4A6741';
    const senderName = tpl?.senderName || 'Kanto MG • Bêta Test';

    // 4. Remplacement des variables dynamiques {{key}}
    const subject = this.interpolate(subjectRaw, mergedVars);
    const title = this.interpolate(titleRaw, mergedVars);
    const content = this.interpolate(contentRaw, mergedVars);
    const buttonText = this.interpolate(buttonTextRaw, mergedVars);
    const buttonUrl = this.interpolate(buttonUrlRaw, mergedVars);
    const secondaryButtonText = this.interpolate(secondaryButtonTextRaw, mergedVars);
    const secondaryButtonUrl = this.interpolate(secondaryButtonUrlRaw, mergedVars);
    const footerText = this.interpolate(footerTextRaw, mergedVars);

    // 5. Construction du HTML officiel Kanto Terre & Encre
    const fullHtml = this.buildBrandedEmailHtml({
      title,
      contentHtml: content,
      buttonText,
      buttonUrl,
      secondaryButtonText,
      secondaryButtonUrl,
      footerText,
      accentColor,
      unsubscribeLink: mergedVars.unsubscribeLink,
    });

    const textContent = `${title}\n\n${this.stripHtml(content)}\n\n${buttonText ? `${buttonText}: ${buttonUrl}\n\n` : ''}${footerText}\n\nPour vous désinscrire : ${mergedVars.unsubscribeLink}`;

    // 6. Expédition via Resend
    try {
      const fromAddress = process.env.RESEND_FROM_EMAIL || 'contact@gastsar.fr';
      const from = `${senderName} <${fromAddress}>`;

      await this.resendService.sendEmail({
        to,
        from,
        subject,
        html: fullHtml,
        text: textContent,
        templateType: `BETA_${templateCode}`,
        bypassSuppression,
        metadata: {
          category: 'BETA_TESTING',
          templateCode,
          recipient: to,
        },
      });

      this.logger.log(`✉️ [BetaEmail] Modèle "${templateCode}" expédié à ${to}`);
      return { success: true, subject, to };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`❌ [BetaEmail] Échec envoi "${templateCode}" à ${to} : ${msg}`);
      throw err;
    }
  }

  /**
   * Remplacement récursif des placeholders {{key}}.
   */
  private interpolate(text: string, vars: Record<string, string>): string {
    return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
      return vars[key] !== undefined ? vars[key] : match;
    });
  }

  /**
   * Génère le squelette HTML complet fidèle au design system Kanto MG.
   */
  public buildBrandedEmailHtml(params: {
    title: string;
    contentHtml: string;
    buttonText?: string;
    buttonUrl?: string;
    secondaryButtonText?: string;
    secondaryButtonUrl?: string;
    footerText?: string;
    accentColor?: string;
    unsubscribeLink?: string;
  }): string {
    const accent = params.accentColor || '#4A6741';

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${params.title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F5F4F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; max-width: 580px; margin: 32px auto; background-color: #FEFEFC; border-radius: 14px; overflow: hidden; border: 1px solid #E5E2DB; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
    .header { background-color: #16442A; padding: 28px 24px; text-align: center; }
    .brand-title { color: #FEFEFC; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: 0.5px; }
    .brand-tag { color: #C58B38; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-top: 4px; letter-spacing: 1px; }
    .body { padding: 32px 28px; }
    .title { font-size: 20px; font-weight: 700; color: #16442A; margin: 0 0 16px 0; line-height: 1.35; }
    .content { font-size: 15px; line-height: 1.6; color: #3A3A38; }
    .content p { margin: 0 0 14px 0; }
    .btn-container { text-align: center; margin: 26px 0 16px 0; }
    .btn-primary { display: inline-block; background-color: ${accent}; color: #FFFFFF !important; font-size: 15px; font-weight: 600; text-decoration: none; padding: 13px 26px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .btn-secondary { display: inline-block; background-color: #F0EDE8; color: #16442A !important; font-size: 14px; font-weight: 600; text-decoration: none; padding: 11px 22px; border-radius: 8px; margin-top: 10px; border: 1px solid #DCE1D7; }
    .footer { background-color: #F5F4F0; padding: 22px 24px; text-align: center; font-size: 12px; color: #7A7A76; border-top: 1px solid #E5E2DB; }
    .footer-links { margin-top: 10px; }
    .footer-links a { color: #5C5C58; text-decoration: underline; margin: 0 8px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1 class="brand-title">KANTO MG</h1>
      <div class="brand-tag">Programme Bêta-Testeurs Officiel</div>
    </div>
    <div class="body">
      <h2 class="title">${params.title}</h2>
      <div class="content">
        ${params.contentHtml}
      </div>
      ${
        params.buttonText && params.buttonUrl
          ? `<div class="btn-container">
              <a href="${params.buttonUrl}" class="btn-primary" target="_blank">${params.buttonText}</a>
              ${
                params.secondaryButtonText && params.secondaryButtonUrl
                  ? `<div><a href="${params.secondaryButtonUrl}" class="btn-secondary" target="_blank">${params.secondaryButtonText}</a></div>`
                  : ''
              }
            </div>`
          : ''
      }
    </div>
    <div class="footer">
      <div>${params.footerText || 'Kanto MG — Ny harena ara-kolontsaina malagasy eo am-pelatananao.'}</div>
      <div class="footer-links">
        <a href="https://app-kanto.gastsar.fr/pages/privacy">Confidentialité</a> •
        <a href="https://app-kanto.gastsar.fr/pages/terms">Conditions</a>
        ${
          params.unsubscribeLink
            ? ` • <a href="${params.unsubscribeLink}">Se désinscrire de la bêta</a>`
            : ''
        }
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, '').trim();
  }
}

