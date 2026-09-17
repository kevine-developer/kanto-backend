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
    const subject = '🔑 Réinitialisation de votre mot de passe Kanto';

    const text = `
${greeting}

Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Kanto.

Pour choisir un nouveau mot de passe, cliquez sur le lien suivant (ou copiez-le dans votre navigateur) :
${options.resetUrl}

Ce lien est valable pendant 1 heure. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.

L'équipe Kanto
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
<body style="margin: 0; padding: 0; background-color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1F2937;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAFA; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden;">
          <!-- En-tête sobre -->
          <tr>
            <td style="padding: 32px 36px 24px 36px; border-bottom: 1px solid #F3F4F6;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size: 15px; font-weight: 700; letter-spacing: 3px; color: #111827; text-transform: uppercase;">
                      KANTO
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-size: 11px; font-weight: 600; color: #374151; background-color: #F3F4F6; padding: 4px 10px; border-radius: 9999px;">
                      Sécurité
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenu -->
          <tr>
            <td style="padding: 32px 36px;">
              <h1 style="font-size: 19px; font-weight: 600; color: #111827; margin: 0 0 16px 0; line-height: 26px; letter-spacing: -0.2px;">
                Réinitialisation de votre mot de passe
              </h1>
              <p style="font-size: 14px; line-height: 23px; color: #4B5563; margin: 0 0 16px 0;">
                ${greeting}
              </p>
              <p style="font-size: 14px; line-height: 23px; color: #4B5563; margin: 0 0 28px 0;">
                Nous avons reçu une demande pour réinitialiser le mot de passe de votre compte Kanto. Cliquez sur le bouton ci-dessous pour en choisir un nouveau :
              </p>

              <!-- Bouton d'action -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                <tr>
                  <td>
                    <a href="${options.resetUrl}" target="_blank" style="display: inline-block; background-color: #1B5E20; color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 8px;">
                      Réinitialiser mon mot de passe
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Notice discrète -->
              <div style="background-color: #F9FAFB; border-left: 3px solid #D1D5DB; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px;">
                <p style="font-size: 13px; line-height: 20px; color: #6B7280; margin: 0;">
                  Ce lien reste actif pendant <strong>1 heure</strong>. Si vous n&apos;êtes pas à l&apos;origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
                </p>
              </div>

              <p style="font-size: 12px; line-height: 18px; color: #9CA3AF; margin: 0; word-break: break-all;">
                Si le bouton ne fonctionne pas, copiez ce lien :<br>
                <a href="${options.resetUrl}" style="color: #1B5E20; text-decoration: underline;">${options.resetUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="padding: 20px 36px; background-color: #FAFAFA; border-top: 1px solid #F3F4F6;">
              <p style="font-size: 12px; color: #9CA3AF; margin: 0; line-height: 18px;">
                © ${new Date().getFullYear()} Kanto • Lova, Kolontsaina &amp; Tantara Malagasy
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
      ? `Tongasoa ${options.userName} !`
      : 'Tongasoa !';
    const subject = '🇲🇬 Tongasoa eto amin’ny Kanto !';

    const text = `
${greeting}

Bienvenue dans l'univers Kanto, l'application dédiée au patrimoine, aux contes, à l'histoire et à la sagesse de Madagascar.

Découvrez dès maintenant :
- Nos contes traditionnels (Angano) narrés et immersifs
- Les grands discours traditionnels (Kabary)
- L'histoire, les rois et les emblèmes nationaux
- Nos jeux éducatifs et défis quotidiens

L'équipe Kanto
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
<body style="margin: 0; padding: 0; background-color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1F2937;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAFA; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden;">
          <!-- En-tête sobre -->
          <tr>
            <td style="padding: 32px 36px 24px 36px; border-bottom: 1px solid #F3F4F6;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size: 15px; font-weight: 700; letter-spacing: 3px; color: #111827; text-transform: uppercase;">
                      KANTO
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-size: 11px; font-weight: 600; color: #166534; background-color: #F0FDF4; padding: 4px 10px; border-radius: 9999px; border: 1px solid #DCFCE7;">
                      Bienvenue
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenu -->
          <tr>
            <td style="padding: 32px 36px;">
              <h1 style="font-size: 19px; font-weight: 600; color: #111827; margin: 0 0 16px 0; line-height: 26px; letter-spacing: -0.2px;">
                ${greeting}
              </h1>
              <p style="font-size: 14px; line-height: 23px; color: #4B5563; margin: 0 0 20px 0;">
                Nous sommes ravis de vous compter parmi nous. Kanto vous accompagne pour explorer, écouter et redécouvrir toute la richesse culturelle, littéraire et historique de Madagascar.
              </p>

              <!-- Liste des fonctionnalités -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border: 1px solid #F3F4F6; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px; font-size: 13px; line-height: 22px; color: #374151;">
                    <div style="margin-bottom: 8px;">📖 <strong>Angano :</strong> Contes traditionnels narrés avec audio immersif</div>
                    <div style="margin-bottom: 8px;">🎙️ <strong>Kabary :</strong> Discours d&apos;art oratoire et rituels</div>
                    <div style="margin-bottom: 8px;">🏛️ <strong>Tantara :</strong> Grandes dates et figures historiques</div>
                    <div>🎮 <strong>Lalao :</strong> Quiz et défis pour enrichir vos connaissances</div>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; line-height: 21px; color: #6B7280; margin: 0;">
                Ouvrez votre application mobile Kanto pour débuter votre voyage au cœur de la sagesse malagasy.
              </p>
            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="padding: 20px 36px; background-color: #FAFAFA; border-top: 1px solid #F3F4F6;">
              <p style="font-size: 12px; color: #9CA3AF; margin: 0; line-height: 18px;">
                © ${new Date().getFullYear()} Kanto • Lova, Kolontsaina &amp; Tantara Malagasy
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
    const subject = '🛡️ Confirmez votre adresse email — Kanto';

    const text = `
${greeting}

Merci de rejoindre Kanto, l'application dédiée au patrimoine et à la culture malagasy.

Pour valider votre adresse email et sécuriser pleinement votre compte, veuillez cliquer sur le lien ci-dessous (ou le copier dans votre navigateur) :
${options.verifyUrl}

Ce lien est valable pendant 24 heures. Si vous n'êtes pas à l'origine de cette création de compte, vous pouvez ignorer cet email.

L'équipe Kanto
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
<body style="margin: 0; padding: 0; background-color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1F2937;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAFA; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden;">
          <!-- En-tête sobre -->
          <tr>
            <td style="padding: 32px 36px 24px 36px; border-bottom: 1px solid #F3F4F6;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size: 15px; font-weight: 700; letter-spacing: 3px; color: #111827; text-transform: uppercase;">
                      KANTO
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-size: 11px; font-weight: 600; color: #15803D; background-color: #F0FDF4; padding: 4px 10px; border-radius: 9999px; border: 1px solid #DCFCE7;">
                      Vérification
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenu -->
          <tr>
            <td style="padding: 32px 36px;">
              <h1 style="font-size: 19px; font-weight: 600; color: #111827; margin: 0 0 16px 0; line-height: 26px; letter-spacing: -0.2px;">
                Confirmation de votre adresse email
              </h1>
              <p style="font-size: 14px; line-height: 23px; color: #4B5563; margin: 0 0 16px 0;">
                ${greeting}
              </p>
              <p style="font-size: 14px; line-height: 23px; color: #4B5563; margin: 0 0 28px 0;">
                Merci d&apos;avoir rejoint l&apos;aventure Kanto ! Pour valider votre inscription, protéger votre compte et synchroniser votre progression en toute sérénité, confirmez votre adresse en cliquant ci-dessous :
              </p>

              <!-- Bouton d'action -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                <tr>
                  <td>
                    <a href="${options.verifyUrl}" target="_blank" style="display: inline-block; background-color: #1B5E20; color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 8px;">
                      Confirmer mon adresse email
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Notice de sécurité -->
              <div style="background-color: #F9FAFB; border-left: 3px solid #1B5E20; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px;">
                <p style="font-size: 13px; line-height: 20px; color: #4B5563; margin: 0;">
                  Ce lien sécurisé est valable pendant <strong>24 heures</strong>. Si vous n&apos;avez pas initié cette inscription sur Kanto, vous pouvez ignorer cet email sans crainte.
                </p>
              </div>

              <p style="font-size: 12px; line-height: 18px; color: #9CA3AF; margin: 0; word-break: break-all;">
                Si le bouton ne s&apos;ouvre pas, copiez directement cette URL dans votre navigateur :<br>
                <a href="${options.verifyUrl}" style="color: #1B5E20; text-decoration: underline;">${options.verifyUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="padding: 20px 36px; background-color: #FAFAFA; border-top: 1px solid #F3F4F6;">
              <p style="font-size: 12px; color: #9CA3AF; margin: 0; line-height: 18px;">
                © ${new Date().getFullYear()} Kanto • Lova, Kolontsaina &amp; Tantara Malagasy
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
