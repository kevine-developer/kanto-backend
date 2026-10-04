import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import {
  buildPasswordResetEmail,
  buildWelcomeEmail,
  buildVerificationEmail,
  buildBetaTesterRegistrationEmail,
  buildBetaTesterInvitationEmail,
} from './templates/index.js';

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
      const trimmed = rawFrom.trim().replace(/^["']|["']$/g, '');
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
    const { subject, html, text } = buildPasswordResetEmail({
      to: options.to,
      resetUrl: options.resetUrl,
      userName: options.userName,
      token: options.token,
    });

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
    const { subject, html, text } = buildWelcomeEmail({
      to: options.to,
      userName: options.userName,
    });

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
    const { subject, html, text } = buildVerificationEmail({
      to: options.to,
      verifyUrl: options.verifyUrl,
      userName: options.userName,
      token: options.token,
    });

    return this.sendEmail({
      to: options.to,
      subject,
      text,
      html,
    });
  }

  /**
   * Envoi d'un email de confirmation de candidature au programme bêta Kanto (Google Play).
   */
  async sendBetaTesterRegistrationEmail(
    options: BetaTesterRegistrationEmailOptions,
  ): Promise<{ id?: string; simulated?: boolean }> {
    const { subject, html, text } = buildBetaTesterRegistrationEmail({
      to: options.to,
      fullName: options.fullName,
      deviceModel: options.deviceModel,
    });

    return this.sendEmail({
      to: options.to,
      subject,
      text,
      html,
    });
  }

  /**
   * Envoi du lien d'invitation Google Play Closed Testing au testeur validé.
   * Contient les deux liens distincts : 1) Validation Web + 2) Téléchargement Play Store.
   */
  async sendBetaTesterInvitationEmail(
    options: BetaTesterInvitationEmailOptions,
  ): Promise<{ id?: string; simulated?: boolean }> {
    const { subject, html, text } = buildBetaTesterInvitationEmail({
      to: options.to,
      fullName: options.fullName,
      playStoreWebLink: options.playStoreWebLink,
      playStoreAppLink: options.playStoreAppLink,
    });

    return this.sendEmail({
      to: options.to,
      subject,
      text,
      html,
    });
  }
}
