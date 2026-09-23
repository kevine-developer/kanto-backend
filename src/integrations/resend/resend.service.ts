import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface PasswordResetEmailOptions {
  to: string;
  resetUrl: string;
  token?: string;
  userName?: string;
}

export interface WelcomeEmailOptions {
  to: string;
  userName?: string;
}

export interface VerificationEmailOptions {
  to: string;
  verifyUrl: string;
  token?: string;
  userName?: string;
}

@Injectable()
export class ResendService {
  private readonly logger = new Logger(ResendService.name);
  private readonly client: Resend | null = null;
  private readonly defaultFrom: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    const rawFrom =
      process.env.RESEND_FROM_EMAIL ||
      process.env.EMAIL_ADRESS ||
      process.env.EMAIL_ADDRESS;

    if (rawFrom && rawFrom.trim() !== '') {
      const trimmed = rawFrom.trim();
      if (!trimmed.includes('@')) {
        this.defaultFrom = `Kanto <noreply@${trimmed}>`;
      } else if (!trimmed.includes('<')) {
        this.defaultFrom = `Kanto <${trimmed}>`;
      } else {
        this.defaultFrom = trimmed;
      }
    } else {
      this.defaultFrom = 'Kanto <onboarding@resend.dev>';
    }

    if (apiKey && apiKey.trim() !== '') {
      try {
        this.client = new Resend(apiKey);
        this.logger.log('📧 [Resend] Client initialisé avec succès.');
      } catch (err: unknown) {
        this.logger.error(
          `❌ [Resend] Erreur d'initialisation : ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
    } else {
      this.logger.warn(
        '⚠️ [Resend] RESEND_API_KEY non configurée. Les emails seront simulés dans les journaux console.',
      );
    }
  }

  /**
   * Vérifie si le service Resend est prêt à envoyer des emails réels.
   */
  isConfigured(): boolean {
    return this.client !== null;
  }

  /**
   * Envoi d'email générique avec Resend.
   */
  async sendEmail(
    options: SendEmailOptions,
  ): Promise<{ id?: string; simulated?: boolean }> {
    const from = options.from || this.defaultFrom;
    const to = Array.isArray(options.to) ? options.to : [options.to];

    if (!this.client) {
      this.logger.log(
        `📬 [SIMULATION EMAIL] De: ${from} | À: ${to.join(', ')} | Sujet: "${options.subject}"`,
      );
      if (options.text) {
        this.logger.debug(`[Contenu texte] :\n${options.text}`);
      }
      return { simulated: true };
    }

    try {
      const response = await this.client.emails.send({
        from,
        to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
      });

      if (response.error) {
        this.logger.error(
          `❌ [Resend] Échec d'envoi vers ${to.join(', ')} : ${response.error.message}`,
        );
        throw new Error(`Resend Error: ${response.error.message}`);
      }

      this.logger.log(
        `✅ [Resend] Email envoyé avec succès vers ${to.join(', ')} (ID: ${response.data?.id})`,
      );
      return { id: response.data?.id };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.logger.error(`❌ [Resend] Erreur inattendue : ${errorMsg}`);
      throw err;
    }
  }

  /**
   * Email transactionnel de réinitialisation de mot de passe.
   */
  async sendPasswordResetEmail(
    options: PasswordResetEmailOptions,
  ): Promise<{ id?: string; simulated?: boolean }> {
    const greeting = options.userName
      ? `Bonjour ${options.userName},`
      : 'Bonjour,';
    const subject = 'Réinitialisation de votre mot de passe — Kanto';

    const text = `
${greeting}

Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Kanto.

Pour choisir un nouveau mot de passe, ouvrez le lien suivant dans votre navigateur :
${options.resetUrl}

Ce lien est valable pendant 1 heure. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message en toute sécurité.

Kanto — Lova, Kolontsaina & Tantara Malagasy
https://kanto.mg
    `.trim();

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F7F4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1A1A1A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F7F4; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #FFFFFF; border: 1px solid #EAE8E3; border-radius: 8px; overflow: hidden;">
          <!-- En-tête sobre -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #F0EDE8;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size: 13px; font-weight: 700; letter-spacing: 4px; color: #1A1A1A; text-transform: uppercase;">
                      KANTO
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-size: 11px; font-weight: 500; color: #5C5C5C; background-color: #F2EFE9; padding: 3px 8px; border-radius: 4px;">
                      Sécurité
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenu -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="font-size: 18px; font-weight: 600; color: #1A1A1A; margin: 0 0 16px 0; line-height: 24px; letter-spacing: -0.2px;">
                Réinitialisation de votre mot de passe
              </h1>
              <p style="font-size: 14px; line-height: 23px; color: #4A4A4A; margin: 0 0 14px 0;">
                ${greeting}
              </p>
              <p style="font-size: 14px; line-height: 23px; color: #4A4A4A; margin: 0 0 28px 0;">
                Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Kanto. Cliquez sur le bouton ci-dessous pour choisir votre nouveau mot de passe :
              </p>

              <!-- Bouton d'action signature terracotta -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                <tr>
                  <td>
                    <a href="${options.resetUrl}" target="_blank" style="display: inline-block; background-color: #8B2519; color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 6px; letter-spacing: 0.1px;">
                      Choisir un nouveau mot de passe
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Notice sobre -->
              <div style="background-color: #F8F7F4; border-left: 2px solid #8B2519; padding: 12px 14px; border-radius: 4px; margin-bottom: 24px;">
                <p style="font-size: 12px; line-height: 19px; color: #5C5C5C; margin: 0;">
                  Ce lien sécurisé reste actif pendant <strong>1 heure</strong>. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sérénité.
                </p>
              </div>

              <p style="font-size: 12px; line-height: 18px; color: #8A8A8A; margin: 0; word-break: break-all;">
                Si le bouton ne s'affiche pas correctement, vous pouvez copier ce lien dans votre navigateur :<br>
                <a href="${options.resetUrl}" style="color: #8B2519; text-decoration: underline;">${options.resetUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Pied de page épuré -->
          <tr>
            <td style="padding: 18px 32px; background-color: #F8F7F4; border-top: 1px solid #F0EDE8;">
              <p style="font-size: 11px; color: #8A8A8A; margin: 0; line-height: 17px; letter-spacing: 0.2px;">
                © ${new Date().getFullYear()} KANTO • Lova, Kolontsaina &amp; Tantara Malagasy
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    return this.sendEmail({
      to: options.to,
      subject,
      text,
      html,
    });
  }

  /**
   * Email de bienvenue lors de l'inscription.
   */
  async sendWelcomeEmail(
    options: WelcomeEmailOptions,
  ): Promise<{ id?: string; simulated?: boolean }> {
    const greeting = options.userName
      ? `Tongasoa ${options.userName},`
      : 'Tongasoa,';
    const subject = "Tongasoa eto amin'ny Kanto — Bienvenue";

    const text = `
${greeting}

Bienvenue sur Kanto, la plateforme dédiée au patrimoine, aux contes, à l'histoire et à la sagesse de Madagascar.

Votre compte vous permet d'explorer :
- Les contes traditionnels (Angano) narrés et immersifs
- Les discours traditionnels et rituels (Kabary)
- L'histoire, les dynasties et les emblèmes nationaux (Tantara)
- Les jeux de réflexion et défis culturels quotidiens (Lalao)

Ouvrez l'application mobile Kanto pour débuter votre parcours.

Kanto — Lova, Kolontsaina & Tantara Malagasy
https://kanto.mg
    `.trim();

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F7F4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1A1A1A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F7F4; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #FFFFFF; border: 1px solid #EAE8E3; border-radius: 8px; overflow: hidden;">
          <!-- En-tête sobre -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #F0EDE8;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size: 13px; font-weight: 700; letter-spacing: 4px; color: #1A1A1A; text-transform: uppercase;">
                      KANTO
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-size: 11px; font-weight: 500; color: #5C5C5C; background-color: #F2EFE9; padding: 3px 8px; border-radius: 4px;">
                      Bienvenue
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenu -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="font-size: 18px; font-weight: 600; color: #1A1A1A; margin: 0 0 16px 0; line-height: 24px; letter-spacing: -0.2px;">
                ${greeting}
              </h1>
              <p style="font-size: 14px; line-height: 23px; color: #4A4A4A; margin: 0 0 20px 0;">
                Nous sommes ravis de vous compter parmi nous. Kanto vous accompagne pour découvrir, écouter et préserver toute la richesse culturelle et historique malagasy.
              </p>

              <!-- Modules disponibles -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F7F4; border: 1px solid #EAE8E3; border-radius: 6px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 18px; font-size: 13px; line-height: 22px; color: #3A3A3A;">
                    <div style="margin-bottom: 8px;"><strong style="color: #1A1A1A;">Angano —</strong> Contes et récits traditionnels audio</div>
                    <div style="margin-bottom: 8px;"><strong style="color: #1A1A1A;">Kabary —</strong> Discours d'éloquence et traditions orales</div>
                    <div style="margin-bottom: 8px;"><strong style="color: #1A1A1A;">Tantara —</strong> Chroniques historiques et repères du patrimoine</div>
                    <div><strong style="color: #1A1A1A;">Lalao —</strong> Défis et jeux de mémoire culturels</div>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; line-height: 21px; color: #5C5C5C; margin: 0;">
                Ouvrez votre application mobile Kanto pour débuter votre exploration dès aujourd'hui.
              </p>
            </td>
          </tr>

          <!-- Pied de page épuré -->
          <tr>
            <td style="padding: 18px 32px; background-color: #F8F7F4; border-top: 1px solid #F0EDE8;">
              <p style="font-size: 11px; color: #8A8A8A; margin: 0; line-height: 17px; letter-spacing: 0.2px;">
                © ${new Date().getFullYear()} KANTO • Lova, Kolontsaina &amp; Tantara Malagasy
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    return this.sendEmail({
      to: options.to,
      subject,
      text,
      html,
    });
  }

  /**
   * Email de confirmation d'adresse email lors de la création de compte.
   */
  async sendVerificationEmail(
    options: VerificationEmailOptions,
  ): Promise<{ id?: string; simulated?: boolean }> {
    const greeting = options.userName
      ? `Bonjour ${options.userName},`
      : 'Bonjour,';
    const subject = 'Confirmation de votre adresse email — Kanto';

    const text = `
${greeting}

Merci de rejoindre Kanto.

Pour valider votre adresse email et sécuriser l'accès à votre compte, veuillez ouvrir le lien ci-dessous :
${options.verifyUrl}

Ce lien reste actif pendant 24 heures. Si vous n'êtes pas à l'origine de cette inscription, vous pouvez ignorer cet email.

Kanto — Lova, Kolontsaina & Tantara Malagasy
https://kanto.mg
    `.trim();

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F7F4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1A1A1A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F7F4; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #FFFFFF; border: 1px solid #EAE8E3; border-radius: 8px; overflow: hidden;">
          <!-- En-tête sobre -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #F0EDE8;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size: 13px; font-weight: 700; letter-spacing: 4px; color: #1A1A1A; text-transform: uppercase;">
                      KANTO
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-size: 11px; font-weight: 500; color: #5C5C5C; background-color: #F2EFE9; padding: 3px 8px; border-radius: 4px;">
                      Vérification
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenu -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="font-size: 18px; font-weight: 600; color: #1A1A1A; margin: 0 0 16px 0; line-height: 24px; letter-spacing: -0.2px;">
                Confirmation de votre adresse email
              </h1>
              <p style="font-size: 14px; line-height: 23px; color: #4A4A4A; margin: 0 0 14px 0;">
                ${greeting}
              </p>
              <p style="font-size: 14px; line-height: 23px; color: #4A4A4A; margin: 0 0 28px 0;">
                Merci de rejoindre Kanto. Pour activer pleinement votre compte et sécuriser vos données de progression, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
              </p>

              <!-- Bouton signature terracotta -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                <tr>
                  <td>
                    <a href="${options.verifyUrl}" target="_blank" style="display: inline-block; background-color: #8B2519; color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 6px; letter-spacing: 0.1px;">
                      Confirmer mon adresse email
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Notice sobre -->
              <div style="background-color: #F8F7F4; border-left: 2px solid #8B2519; padding: 12px 14px; border-radius: 4px; margin-bottom: 24px;">
                <p style="font-size: 12px; line-height: 19px; color: #5C5C5C; margin: 0;">
                  Ce lien sécurisé est valable pendant <strong>24 heures</strong>. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.
                </p>
              </div>

              <p style="font-size: 12px; line-height: 18px; color: #8A8A8A; margin: 0; word-break: break-all;">
                Si le bouton ne fonctionne pas, copiez ce lien directement dans votre navigateur :<br>
                <a href="${options.verifyUrl}" style="color: #8B2519; text-decoration: underline;">${options.verifyUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Pied de page épuré -->
          <tr>
            <td style="padding: 18px 32px; background-color: #F8F7F4; border-top: 1px solid #F0EDE8;">
              <p style="font-size: 11px; color: #8A8A8A; margin: 0; line-height: 17px; letter-spacing: 0.2px;">
                © ${new Date().getFullYear()} KANTO • Lova, Kolontsaina &amp; Tantara Malagasy
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    return this.sendEmail({
      to: options.to,
      subject,
      text,
      html,
    });
  }
}
