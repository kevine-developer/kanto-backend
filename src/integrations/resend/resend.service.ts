import { Injectable, Logger, Optional } from '@nestjs/common';
import { Resend } from 'resend';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';
import {
  buildPasswordResetEmail,
  buildWelcomeEmail,
  buildVerificationEmail,
  buildBetaTesterRegistrationEmail,
  buildBetaTesterInvitationEmail,
  buildContributionApprovedEmail,
  buildModerationAlertAdminEmail,
  buildContributionStatusUpdateEmail,
  buildSecurityChangeEmail,
  buildAccountDeletionEmail,
} from './templates/index.js';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  templateType?: string;
  recipientName?: string;
  idempotencyKey?: string;
  metadata?: Record<string, unknown>;
  bypassSuppression?: boolean; // Strictement réservé aux alertes critiques de sécurité
}

export interface PasswordResetEmailOptions {
  to: string;
  resetUrl: string;
  token?: string;
  userName?: string;
  idempotencyKey?: string;
}

export interface WelcomeEmailOptions {
  to: string;
  userName?: string;
  idempotencyKey?: string;
}

export interface VerificationEmailOptions {
  to: string;
  verifyUrl: string;
  token?: string;
  userName?: string;
  idempotencyKey?: string;
}

export interface BetaTesterRegistrationEmailOptions {
  to: string;
  fullName?: string;
  deviceModel?: string;
  idempotencyKey?: string;
}

export interface BetaTesterInvitationEmailOptions {
  to: string;
  fullName?: string;
  playStoreWebLink?: string;
  playStoreAppLink?: string;
  idempotencyKey?: string;
}

export interface ContributionApprovedEmailOptions {
  to: string;
  userName?: string;
  contributionTitle: string;
  category: string;
  xpReward?: number;
  contributionId?: string;
  idempotencyKey?: string;
}

export interface ModerationAlertAdminEmailOptions {
  to: string | string[];
  contributionId: string;
  contributionTitle: string;
  contributorName: string;
  contributorId: string;
  riskCategories: string[];
  submissionDate: string;
  adminReviewUrl: string;
  idempotencyKey?: string;
}

export interface ContributionStatusUpdateEmailOptions {
  to: string;
  userName?: string;
  contributionTitle: string;
  status: 'REJECTED' | 'CHANGES_REQUESTED';
  feedbackReason?: string;
  contributionId?: string;
  idempotencyKey?: string;
}

export interface SecurityChangeEmailOptions {
  to: string;
  userName?: string;
  action: 'changed' | 'added';
  idempotencyKey?: string;
}

export interface AccountDeletionEmailOptions {
  to: string;
  userName?: string;
  idempotencyKey?: string;
}

export interface SendEmailResult {
  id?: string;
  simulated?: boolean;
  cached?: boolean;
}

/**
 * Expression régulière stricte de validation des adresses e-mail (RFC 5322 compatible simplifiée)
 * et protection absolue contre les injections CRLF (\r, \n).
 */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

@Injectable()
export class ResendService {
  private readonly logger = new Logger(ResendService.name);
  private readonly client: Resend | null = null;
  private readonly defaultFrom: string;

  constructor(@Optional() private readonly prisma?: PrismaService) {
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
   * Valide formellement une liste d'adresses email et empêche toute tentative d'injection CRLF.
   */
  private validateRecipients(recipients: string[]): void {
    if (!recipients || recipients.length === 0) {
      throw new Error("L'envoi d'un e-mail requiert au moins un destinataire.");
    }
    for (const email of recipients) {
      if (!email || typeof email !== 'string') {
        throw new Error('Adresse e-mail invalide.');
      }
      const trimmed = email.trim();
      if (
        trimmed.includes('\r') ||
        trimmed.includes('\n') ||
        !EMAIL_REGEX.test(trimmed)
      ) {
        throw new Error(
          `L'adresse e-mail destinataire "${trimmed}" est invalide ou contient des caractères interdits.`,
        );
      }
    }
  }

  /**
   * Envoi d'email générique centralisé et tracé avec Resend.
   */
  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    const from = options.from || this.defaultFrom;
    const rawTo = Array.isArray(options.to) ? options.to : [options.to];
    const to = rawTo.map((e) => e.trim().toLowerCase());

    // 1. Validation de sécurité des destinataires
    this.validateRecipients(to);
    const primaryRecipient = to[0];

    // 2. Vérification de la liste de suppression (Hard Bounce & Complaints)
    if (!options.bypassSuppression && this.prisma) {
      try {
        const suppression = await this.prisma.emailSuppression.findUnique({
          where: { email: primaryRecipient },
        });
        if (suppression) {
          const reasonMsg = `Destinataire ${primaryRecipient} exclu des envois (${suppression.reason}). Envoi annulé pour préserver la réputation de délivrabilité.`;
          this.logger.warn(`🛡️ [Resend Suppression] ${reasonMsg}`);
          // Trace dans EmailLog comme FAILED avec motif d'exclusion
          await this.prisma.emailLog.create({
            data: {
              recipient: primaryRecipient,
              recipientName: options.recipientName,
              from,
              subject: options.subject,
              templateType: options.templateType || 'TRANSACTIONAL',
              status: 'FAILED',
              errorReason: `Exclu par la liste de suppression : ${suppression.reason}`,
              metadata: (options.metadata ?? {}) as any,
              lastAttemptAt: new Date(),
            },
          });
          return { simulated: true };
        }
      } catch (err: unknown) {
        this.logger.warn(
          `⚠️ [Resend] Impossible de vérifier la liste de suppression : ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
    }

    // 3. Gestion de l'idempotence et prévention des doublons
    if (options.idempotencyKey && this.prisma) {
      try {
        const existing = await this.prisma.emailLog.findUnique({
          where: { idempotencyKey: options.idempotencyKey },
        });

        if (existing) {
          // Si le message a déjà été accepté, envoyé ou livré, ne pas renvoyer
          if (
            existing.status === 'ACCEPTED' ||
            existing.status === 'SENT' ||
            existing.status === 'DELIVERED'
          ) {
            this.logger.log(
              `🔁 [Resend Idempotence] Message déjà traité (Statut: ${existing.status}, ID: ${existing.resendId}). Renvoi ignoré.`,
            );
            return {
              id: existing.resendId ?? undefined,
              cached: true,
            };
          }

          // Si le message est PENDING depuis moins de 30 secondes, bloquer le double-clic concurrent
          if (
            existing.status === 'PENDING' &&
            Date.now() - existing.createdAt.getTime() < 30000
          ) {
            this.logger.warn(
              `⏳ [Resend Concurrence] Un envoi est déjà en cours pour la clé ${options.idempotencyKey}. Action concurrente bloquée.`,
            );
            return {
              id: existing.resendId ?? undefined,
              cached: true,
            };
          }
        }
      } catch (err: unknown) {
        this.logger.warn(
          `⚠️ [Resend] Échec de vérification d'idempotence : ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
    }

    // 4. Enregistrement initial dans l'historique (Statut PENDING)
    let emailLogId: string | null = null;
    if (this.prisma) {
      try {
        const log = await this.prisma.emailLog.create({
          data: {
            recipient: primaryRecipient,
            recipientName: options.recipientName,
            from,
            subject: options.subject,
            templateType: options.templateType || 'TRANSACTIONAL',
            status: 'PENDING',
            idempotencyKey: options.idempotencyKey,
            metadata: (options.metadata ?? {}) as any,
            attempts: 1,
            lastAttemptAt: new Date(),
          },
        });
        emailLogId = log.id;
      } catch (err: unknown) {
        this.logger.warn(
          `⚠️ [Resend] Échec de création du log d'e-mail : ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
    }

    // 5. Mode Simulation (absence de client Resend ou environnement dev sans clé)
    if (!this.client) {
      const simulatedId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      this.logger.log(
        `📬 [SIMULATION EMAIL] De: ${from} | À: ${to.join(', ')} | Sujet: "${options.subject}" (ID: ${simulatedId})`,
      );

      if (emailLogId && this.prisma) {
        await this.prisma.emailLog
          .update({
            where: { id: emailLogId },
            data: {
              status: 'ACCEPTED',
              resendId: simulatedId,
              events: [
                {
                  type: 'simulated',
                  at: new Date().toISOString(),
                  note: 'Envoi simulé en environnement de développement/test',
                },
              ] as any,
            },
          })
          .catch(() => null);
      }

      return { id: simulatedId, simulated: true };
    }

    // 6. Envoi effectif avec le SDK Resend officiel
    try {
      const response = await this.client.emails.send({
        from,
        to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
        headers: options.idempotencyKey
          ? { 'X-Entity-Ref-ID': options.idempotencyKey }
          : undefined,
      });

      if (response.error) {
        const errorMsg = response.error.message;
        this.logger.error(
          `❌ [Resend] Échec d'envoi vers ${to.join(', ')} : ${errorMsg}`,
        );

        if (emailLogId && this.prisma) {
          await this.prisma.emailLog
            .update({
              where: { id: emailLogId },
              data: {
                status: 'FAILED',
                errorReason: errorMsg,
                events: [
                  {
                    type: 'provider_error',
                    at: new Date().toISOString(),
                    error: errorMsg,
                  },
                ] as any,
              },
            })
            .catch(() => null);
        }

        throw new Error(`Resend Error: ${errorMsg}`);
      }

      const resendId = response.data?.id;
      this.logger.log(
        `✅ [Resend] Email accepté avec succès vers ${to.join(', ')} (ID: ${resendId})`,
      );

      if (emailLogId && this.prisma) {
        await this.prisma.emailLog
          .update({
            where: { id: emailLogId },
            data: {
              status: 'ACCEPTED',
              resendId,
              events: [
                {
                  type: 'accepted_by_resend',
                  at: new Date().toISOString(),
                  resendId,
                },
              ] as any,
            },
          })
          .catch(() => null);
      }

      return { id: resendId };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.logger.error(`❌ [Resend] Erreur inattendue : ${errorMsg}`);

      if (emailLogId && this.prisma) {
        await this.prisma.emailLog
          .update({
            where: { id: emailLogId },
            data: {
              status: 'FAILED',
              errorReason: errorMsg,
            },
          })
          .catch(() => null);
      }

      throw err;
    }
  }

  /**
   * Relance manuelle sécurisée d'un message en échec depuis le CRM administrateur.
   * Vérifie formellement qu'aucun doublon ne sera déclenché.
   */
  async retryEmail(emailLogId: string): Promise<SendEmailResult> {
    if (!this.prisma) {
      throw new Error('Base de données indisponible pour la relance.');
    }

    const log = await this.prisma.emailLog.findUnique({
      where: { id: emailLogId },
    });

    if (!log) {
      throw new Error(`Enregistrement d'e-mail introuvable (ID: ${emailLogId})`);
    }

    // Protection anti-doublon absolue
    if (log.status === 'DELIVERED') {
      throw new Error(
        'Impossible de relancer un e-mail déjà accusé comme livré.',
      );
    }
    if (
      log.status === 'ACCEPTED' &&
      log.lastAttemptAt &&
      Date.now() - log.lastAttemptAt.getTime() < 300000
    ) {
      throw new Error(
        "Ce message a été accepté par Resend il y a moins de 5 minutes. Veuillez patienter pour l'accusé de livraison.",
      );
    }

    // Vérifier si le destinataire est entre temps tombé dans la liste de suppression
    const suppression = await this.prisma.emailSuppression.findUnique({
      where: { email: log.recipient },
    });
    if (suppression) {
      throw new Error(
        `Impossible de relancer : l'adresse ${log.recipient} est bloquée dans la liste d'exclusion (${suppression.reason}).`,
      );
    }

    this.logger.log(
      `🔄 [Resend Retry] Relance manuelle de l'e-mail ${log.id} vers ${log.recipient} (Tentative ${
        log.attempts + 1
      })`,
    );

    // Incrémente le compteur de tentatives et met à jour la date
    await this.prisma.emailLog.update({
      where: { id: log.id },
      data: {
        attempts: { increment: 1 },
        lastAttemptAt: new Date(),
        status: 'PENDING',
      },
    });

    // Envoi via Resend
    if (!this.client) {
      const simulatedId = `sim_retry_${Date.now()}`;
      await this.prisma.emailLog.update({
        where: { id: log.id },
        data: {
          status: 'ACCEPTED',
          resendId: simulatedId,
          events: [
            ...((log.events as any[]) || []),
            {
              type: 'manual_retry_simulated',
              at: new Date().toISOString(),
            },
          ] as any,
        },
      });
      return { id: simulatedId, simulated: true };
    }

    try {
      // Re-rendu ou renvoi générique basé sur le type et sujet
      const response = await this.client.emails.send({
        from: log.from || this.defaultFrom,
        to: [log.recipient],
        subject: log.subject,
        html: `<p>Relance administrative de votre message Kanto : ${log.subject}</p>`,
        text: `Relance administrative de votre message Kanto : ${log.subject}`,
      });

      if (response.error) {
        await this.prisma.emailLog.update({
          where: { id: log.id },
          data: {
            status: 'FAILED',
            errorReason: response.error.message,
          },
        });
        throw new Error(response.error.message);
      }

      await this.prisma.emailLog.update({
        where: { id: log.id },
        data: {
          status: 'ACCEPTED',
          resendId: response.data?.id,
          events: [
            ...((log.events as any[]) || []),
            {
              type: 'manual_retry_accepted',
              at: new Date().toISOString(),
              resendId: response.data?.id,
            },
          ] as any,
        },
      });

      return { id: response.data?.id };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      await this.prisma.emailLog.update({
        where: { id: log.id },
        data: {
          status: 'FAILED',
          errorReason: errorMsg,
        },
      });
      throw err;
    }
  }

  // ─── MODÈLES MÉTIER KANTO MG ──────────────────────────────────────────────

  /**
   * 1. Email de réinitialisation de mot de passe.
   */
  async sendPasswordResetEmail(
    options: PasswordResetEmailOptions,
  ): Promise<SendEmailResult> {
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
      templateType: 'PASSWORD_RESET',
      recipientName: options.userName,
      idempotencyKey: options.idempotencyKey,
      metadata: {
        resetUrlSet: Boolean(options.resetUrl),
      },
    });
  }

  /**
   * 2. Email de bienvenue lors de l'inscription.
   */
  async sendWelcomeEmail(options: WelcomeEmailOptions): Promise<SendEmailResult> {
    const { subject, html, text } = buildWelcomeEmail({
      to: options.to,
      userName: options.userName,
    });

    return this.sendEmail({
      to: options.to,
      subject,
      text,
      html,
      templateType: 'WELCOME',
      recipientName: options.userName,
      idempotencyKey: options.idempotencyKey,
    });
  }

  /**
   * 3. Email de confirmation d'adresse email.
   */
  async sendVerificationEmail(
    options: VerificationEmailOptions,
  ): Promise<SendEmailResult> {
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
      templateType: 'VERIFICATION',
      recipientName: options.userName,
      idempotencyKey: options.idempotencyKey,
      metadata: {
        verifyUrlSet: Boolean(options.verifyUrl),
      },
    });
  }

  /**
   * 4. Confirmation de candidature au programme bêta Kanto (Google Play).
   */
  async sendBetaTesterRegistrationEmail(
    options: BetaTesterRegistrationEmailOptions,
  ): Promise<SendEmailResult> {
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
      templateType: 'BETA_TESTER_REGISTRATION',
      recipientName: options.fullName,
      idempotencyKey: options.idempotencyKey,
      metadata: {
        deviceModel: options.deviceModel,
      },
    });
  }

  /**
   * 5. Envoi du lien d'invitation Google Play Closed Testing au testeur validé.
   */
  async sendBetaTesterInvitationEmail(
    options: BetaTesterInvitationEmailOptions,
  ): Promise<SendEmailResult> {
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
      templateType: 'BETA_TESTER_INVITATION',
      recipientName: options.fullName,
      idempotencyKey: options.idempotencyKey,
    });
  }

  /**
   * 6. Félicitations lors de l'approbation d'une contribution culturelle.
   */
  async sendContributionApprovedEmail(
    options: ContributionApprovedEmailOptions,
  ): Promise<SendEmailResult> {
    const { subject, html, text } = buildContributionApprovedEmail({
      to: options.to,
      userName: options.userName,
      contributionTitle: options.contributionTitle,
      category: options.category,
      xpReward: options.xpReward,
    });

    return this.sendEmail({
      to: options.to,
      subject,
      text,
      html,
      templateType: 'CONTRIBUTION_APPROVED',
      recipientName: options.userName,
      idempotencyKey:
        options.idempotencyKey ||
        (options.contributionId
          ? `contrib-approved-${options.contributionId}`
          : undefined),
      metadata: {
        contributionId: options.contributionId,
        category: options.category,
        xpReward: options.xpReward,
      },
    });
  }

  /**
   * 7. Alerte d'équipe de modération/administration pour une contribution signalée.
   */
  async sendModerationAlertAdminEmail(
    options: ModerationAlertAdminEmailOptions,
  ): Promise<SendEmailResult> {
    const { subject, html, text } = buildModerationAlertAdminEmail({
      to: Array.isArray(options.to) ? options.to[0] : options.to,
      contributionId: options.contributionId,
      contributionTitle: options.contributionTitle,
      contributorName: options.contributorName,
      contributorId: options.contributorId,
      riskCategories: options.riskCategories,
      submissionDate: options.submissionDate,
      adminReviewUrl: options.adminReviewUrl,
    });

    return this.sendEmail({
      to: options.to,
      subject,
      text,
      html,
      templateType: 'MODERATION_ALERT',
      idempotencyKey:
        options.idempotencyKey ||
        `mod-alert-${options.contributionId}-${Date.now().toString(36)}`,
      metadata: {
        contributionId: options.contributionId,
        riskCategories: options.riskCategories,
      },
    });
  }

  /**
   * 8. Notification à l'auteur lors d'un rejet ou d'une demande d'ajustements.
   */
  async sendContributionStatusUpdateEmail(
    options: ContributionStatusUpdateEmailOptions,
  ): Promise<SendEmailResult> {
    const { subject, html, text } = buildContributionStatusUpdateEmail({
      to: options.to,
      userName: options.userName,
      contributionTitle: options.contributionTitle,
      status: options.status,
      feedbackReason: options.feedbackReason,
    });

    return this.sendEmail({
      to: options.to,
      subject,
      text,
      html,
      templateType: 'CONTRIBUTION_STATUS_UPDATE',
      recipientName: options.userName,
      idempotencyKey:
        options.idempotencyKey ||
        (options.contributionId
          ? `contrib-status-${options.contributionId}-${options.status}`
          : undefined),
      metadata: {
        contributionId: options.contributionId,
        status: options.status,
      },
    });
  }

  /**
   * 9. Notification de sécurité lors d'un changement ou d'un ajout de mot de passe.
   */
  async sendSecurityChangeEmail(
    options: SecurityChangeEmailOptions,
  ): Promise<SendEmailResult> {
    const { subject, html, text } = buildSecurityChangeEmail({
      to: options.to,
      userName: options.userName,
      action: options.action,
    });

    return this.sendEmail({
      to: options.to,
      subject,
      text,
      html,
      templateType: 'SECURITY_CHANGE',
      recipientName: options.userName,
      idempotencyKey: options.idempotencyKey,
      bypassSuppression: true, // Notification de sécurité obligatoire
      metadata: {
        securityAction: options.action,
      },
    });
  }

  /**
   * 10. Confirmation de suppression définitive de compte (RGPD).
   */
  async sendAccountDeletionEmail(
    options: AccountDeletionEmailOptions,
  ): Promise<SendEmailResult> {
    const { subject, html, text } = buildAccountDeletionEmail({
      to: options.to,
      userName: options.userName,
      deletedAt: new Date(),
    });

    return this.sendEmail({
      to: options.to,
      subject,
      text,
      html,
      templateType: 'ACCOUNT_DELETION',
      recipientName: options.userName,
      idempotencyKey: options.idempotencyKey,
      bypassSuppression: true, // Notification légale RGPD obligatoire
    });
  }
}
