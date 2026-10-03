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

export interface BetaTesterRegistrationEmailOptions {
  to: string;
  fullName?: string;
  deviceModel?: string;
}

export interface BetaTesterInvitationEmailOptions {
  to: string;
  fullName?: string;
  playStoreWebLink?: string;
  playStoreAppLink?: string;
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

  /**
   * Envoi d'un email de confirmation de candidature au programme bêta Kanto.
   */
  async sendBetaTesterRegistrationEmail(
    options: BetaTesterRegistrationEmailOptions,
  ): Promise<{ id?: string; simulated?: boolean }> {
    const name = options.fullName?.trim() || 'Cher testeur';
    const subject =
      '🎉 Inscription confirmée au programme Bêta Kanto (Google Play)';
    const text = `Bonjour ${name},\n\nMerci pour votre intérêt pour Kanto ! Votre inscription pour tester l'application sur Google Play a bien été reçue.\n\nVotre adresse email (${options.to}) sera ajoutée à notre liste fermée sur Google Play Console.\nDès que votre accès sera prêt, vous recevrez un second email contenant le lien direct de téléchargement.\n\nÀ très vite sur Kanto !`;

    const currentYear = new Date().getFullYear();
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F7F4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F7F4; padding: 36px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 540px; background-color: #FFFFFF; border: 1px solid #EAE8E3; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
          <!-- En-tête -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #F0EDE8; background: linear-gradient(135deg, #1A1A1A 0%, #2A2421 100%);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size: 15px; font-weight: 800; letter-spacing: 4px; color: #FFFFFF; text-transform: uppercase;">
                      KANTO
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-size: 11px; font-weight: 700; color: #10B981; background-color: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                      ● Bêta Privée Play Store
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenu -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="font-size: 20px; font-weight: 700; color: #1A1A1A; margin: 0 0 16px 0; line-height: 28px;">
                Misaotra betsaka ! Candidature enregistrée
              </h1>
              <p style="font-size: 14px; line-height: 24px; color: #4A4A4A; margin: 0 0 16px 0;">
                Bonjour <strong>${name}</strong>,
              </p>
              <p style="font-size: 14px; line-height: 24px; color: #4A4A4A; margin: 0 0 20px 0;">
                Nous avons bien enregistré votre demande pour rejoindre la phase de test fermée de <strong>Kanto</strong> sur smartphone Android.
              </p>

              <!-- Carte Récapitulatif -->
              <div style="background-color: #F8F7F4; border: 1px solid #EAE8E3; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #8A8A8A; text-transform: uppercase; letter-spacing: 0.5px;">
                  Compte Google Play enregistré
                </p>
                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #1A1A1A; font-family: monospace;">
                  ${options.to}
                </p>
                ${
                  options.deviceModel
                    ? `<p style="margin: 6px 0 0 0; font-size: 12px; color: #6B7280;">📱 Appareil : ${options.deviceModel}</p>`
                    : ''
                }
              </div>

              <!-- Étapes -->
              <h2 style="font-size: 14px; font-weight: 700; color: #1A1A1A; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                Prochaines étapes :
              </h2>
              <ol style="margin: 0 0 24px 0; padding-left: 20px; font-size: 14px; line-height: 24px; color: #4A4A4A;">
                <li style="margin-bottom: 6px;">Notre équipe ajoute votre compte à la liste fermée sur <strong>Google Play Console</strong>.</li>
                <li style="margin-bottom: 6px;">Dès que Google valide l'accès, vous recevrez un <strong>e-mail officiel avec votre lien d'invitation</strong>.</li>
                <li>Vous pourrez alors installer Kanto d'un simple clic et découvrir en avant-première nos contes malgaches, duels et jeux linguistiques.</li>
              </ol>

              <div style="background-color: #FEF3C7; border-left: 3px solid #F59E0B; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
                <p style="font-size: 12px; line-height: 18px; color: #92400E; margin: 0;">
                  ⚠️ <strong>Important :</strong> Assurez-vous que l'adresse <code>${options.to}</code> est bien celle connectée à votre application Google Play Store sur votre smartphone.
                </p>
              </div>

              <p style="font-size: 13px; line-height: 20px; color: #8A8A8A; margin: 0;">
                Misaotra amin'ny fandraisana anjara amin'ny fampandrosoana ny teny sy ny kolontsaina Malagasy !<br>
                — <em>L'équipe Kanto</em>
              </p>
            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="padding: 18px 32px; background-color: #F8F7F4; border-top: 1px solid #F0EDE8;">
              <p style="font-size: 11px; color: #8A8A8A; margin: 0; line-height: 17px;">
                © ${currentYear} KANTO • Lova, Kolontsaina &amp; Tantara Malagasy • <a href="https://kanto.mg" style="color: #8B2519; text-decoration: none;">kanto.mg</a>
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
   * Envoi du lien d'invitation Google Play Closed Testing au testeur validé.
   */
  async sendBetaTesterInvitationEmail(
    options: BetaTesterInvitationEmailOptions,
  ): Promise<{ id?: string; simulated?: boolean }> {
    const name = options.fullName?.trim() || 'Cher testeur';
    const webLink =
      options.playStoreWebLink ||
      'https://play.google.com/apps/testing/com.devengalere.kantomg';
    const appLink =
      options.playStoreAppLink ||
      'https://play.google.com/store/apps/details?id=com.devengalere.kantomg';

    const subject =
      '🚀 Votre lien d’accès Google Play pour Kanto est disponible !';
    const text = `Bonjour ${name},\n\nBonne nouvelle ! Votre compte (${options.to}) a été autorisé pour le test privé de Kanto sur le Google Play Store.\n\n1. Cliquez sur ce lien pour accepter l'invitation de test :\n${webLink}\n\n2. Téléchargez l'application Kanto sur le Play Store :\n${appLink}\n\nMerci de participer à cette aventure culturelle !\n— L'équipe Kanto`;

    const currentYear = new Date().getFullYear();
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F7F4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F7F4; padding: 36px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 540px; background-color: #FFFFFF; border: 1px solid #EAE8E3; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
          <!-- En-tête -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #F0EDE8; background: linear-gradient(135deg, #10B981 0%, #065F46 100%);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size: 15px; font-weight: 800; letter-spacing: 4px; color: #FFFFFF; text-transform: uppercase;">
                      KANTO
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-size: 11px; font-weight: 700; color: #FFFFFF; background-color: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                      🎉 Accès Disponible
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenu -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="font-size: 20px; font-weight: 700; color: #1A1A1A; margin: 0 0 16px 0; line-height: 28px;">
                Votre invitation Google Play est prête !
              </h1>
              <p style="font-size: 14px; line-height: 24px; color: #4A4A4A; margin: 0 0 16px 0;">
                Bonjour <strong>${name}</strong>,
              </p>
              <p style="font-size: 14px; line-height: 24px; color: #4A4A4A; margin: 0 0 24px 0;">
                Votre compte <strong>${options.to}</strong> est désormais activé dans notre cercle de testeurs sur Google Play. Vous pouvez dès maintenant installer la dernière version de l'application.
              </p>

              <!-- Guide d'installation en 2 étapes -->
              <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 20px; margin-bottom: 28px;">
                <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.5px;">
                  📋 Comment activer votre accès :
                </p>
                
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #15803D;">
                  <strong>1. Accepter l'invitation sur Google Play</strong><br>
                  Cliquez sur le bouton vert ci-dessous pour rejoindre le programme de test avec votre compte <code>${options.to}</code>.
                </p>
                <div style="margin: 16px 0;">
                  <a href="${webLink}" target="_blank" style="display: inline-block; background-color: #10B981; color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 8px; letter-spacing: 0.2px; box-shadow: 0 2px 8px rgba(16,185,129,0.3);">
                    👉 1. Rejoindre le programme de test
                  </a>
                </div>

                <p style="margin: 16px 0 8px 0; font-size: 13px; color: #15803D;">
                  <strong>2. Installer l'application depuis le Play Store</strong><br>
                  Une fois accepté, ouvrez le lien Google Play direct depuis votre smartphone Android pour installer Kanto.
                </p>
                <div style="margin-top: 12px;">
                  <a href="${appLink}" target="_blank" style="display: inline-block; background-color: #1A1A1A; color: #FFFFFF; text-decoration: none; font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: 8px;">
                    📲 2. Télécharger sur Google Play
                  </a>
                </div>
              </div>

              <!-- Astuce -->
              <div style="background-color: #F8F7F4; border-left: 3px solid #8B2519; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
                <p style="font-size: 12px; line-height: 19px; color: #5C5C5C; margin: 0;">
                  💡 <strong>Astuce :</strong> Si Google Play affiche <em>"Application non disponible"</em> lors du premier clic, attendez 5 à 10 minutes que la propagation de votre compte soit finalisée par les serveurs de Google, puis réessayez.
                </p>
              </div>

              <p style="font-size: 13px; line-height: 20px; color: #8A8A8A; margin: 0;">
                Vos retours sont précieux pour nous aider à faire de Kanto la meilleure expérience culturelle possible. Amusez-vous bien !<br>
                — <em>L'équipe Kanto</em>
              </p>
            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="padding: 18px 32px; background-color: #F8F7F4; border-top: 1px solid #F0EDE8;">
              <p style="font-size: 11px; color: #8A8A8A; margin: 0; line-height: 17px;">
                © ${currentYear} KANTO • Lova, Kolontsaina &amp; Tantara Malagasy • <a href="https://kanto.mg" style="color: #8B2519; text-decoration: none;">kanto.mg</a>
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
