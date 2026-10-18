import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';

export interface ResendWebhookPayload {
  type: string;
  created_at: string;
  data: {
    created_at?: string;
    email_id?: string;
    id?: string;
    from?: string;
    to?: string[];
    subject?: string;
    bounce?: {
      message?: string;
      type?: 'Permanent' | 'Transient' | 'Undetermined' | string;
      subType?: string;
    };
    error?: {
      message?: string;
      code?: string;
    };
    click?: {
      link?: string;
      ipAddress?: string;
      userAgent?: string;
    };
  };
}

@Injectable()
export class ResendWebhookService {
  private readonly logger = new Logger(ResendWebhookService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Traite un événement webhook Resend de manière idempotente et sécurisée.
   */
  async handleWebhookEvent(event: ResendWebhookPayload): Promise<{
    handled: boolean;
    reason?: string;
  }> {
    const eventType = event.type;
    const eventData = event.data;
    const resendId = eventData?.email_id || eventData?.id;
    const eventTimestamp = event.created_at || new Date().toISOString();

    if (!resendId) {
      this.logger.warn(
        `⚠️ [Resend Webhook] Événement ${eventType} ignoré : aucun identifiant Resend (email_id / id) fourni.`,
      );
      return { handled: false, reason: 'Identifiant Resend manquant' };
    }

    this.logger.log(
      `🔔 [Resend Webhook] Événement reçu : "${eventType}" pour le message ID: ${resendId}`,
    );

    // Recherche du log en base de données
    const emailLog = await this.prisma.emailLog.findFirst({
      where: { resendId },
    });

    if (!emailLog) {
      this.logger.warn(
        `🔍 [Resend Webhook] Aucun log d'email local ne correspond à l'identifiant Resend ${resendId}. Création d'un enregistrement webhook externe.`,
      );

      const recipient =
        eventData.to && eventData.to.length > 0
          ? eventData.to[0].toLowerCase()
          : 'inconnu@kanto.mg';

      // Crée un log de traçabilité pour les emails envoyés en dehors ou antérieurs
      await this.prisma.emailLog.create({
        data: {
          resendId,
          recipient,
          from: eventData.from || 'Kanto <noreply@kanto.mg>',
          subject: eventData.subject || `Notification externe (${eventType})`,
          templateType: 'EXTERNAL_WEBHOOK',
          status: this.mapStatusFromEventType(eventType),
          events: [
            {
              type: eventType,
              at: eventTimestamp,
              data: this.sanitizeEventData(eventData),
            },
          ] as any,
          lastAttemptAt: new Date(eventTimestamp),
        },
      });

      // Traiter les rebonds et plaintes même sur un email créé par le webhook
      await this.handleSuppressionFromEvent(eventType, recipient, eventData);

      return { handled: true, reason: 'Enregistrement externe créé et mis à jour' };
    }

    // Protection contre les doublons : vérifier si cet événement a déjà été consigné
    const currentEvents = (emailLog.events as any[]) || [];
    const isDuplicate = currentEvents.some(
      (ev) => ev.type === eventType && ev.at === eventTimestamp,
    );

    if (isDuplicate) {
      this.logger.log(
        `🔁 [Resend Webhook] Événement ${eventType} déjà consigné pour ${resendId}. Traitement idempotent.`,
      );
      return { handled: true, reason: 'Doublon idempotent ignoré' };
    }

    // Calcul du nouveau statut selon les priorités et le respect de l'ordre d'arrivée
    const updatedStatus = this.determineNextStatus(emailLog.status, eventType);

    // Extraction des détails spécifiques (rebond, erreur)
    let bounceType: string | null = emailLog.bounceType;
    let bounceSubtype: string | null = emailLog.bounceSubtype;
    let errorReason: string | null = emailLog.errorReason;

    if (eventType === 'email.bounced') {
      bounceType = eventData.bounce?.type || 'Permanent';
      bounceSubtype = eventData.bounce?.subType || 'General';
      errorReason =
        eventData.bounce?.message ||
        `Rebond (${bounceType}${bounceSubtype ? ` - ${bounceSubtype}` : ''})`;
    } else if (eventType === 'email.failed') {
      errorReason = eventData.error?.message || 'Échec de distribution Resend';
    }

    // Mise à jour de l'historique d'événements
    const newEvents = [
      ...currentEvents,
      {
        type: eventType,
        at: eventTimestamp,
        data: this.sanitizeEventData(eventData),
      },
    ];

    await this.prisma.emailLog.update({
      where: { id: emailLog.id },
      data: {
        status: updatedStatus,
        bounceType,
        bounceSubtype,
        errorReason,
        events: newEvents as any,
        updatedAt: new Date(),
      },
    });

    // Traitement automatique de la liste de suppression si Hard Bounce ou Plainte
    await this.handleSuppressionFromEvent(
      eventType,
      emailLog.recipient,
      eventData,
    );

    return { handled: true };
  }

  /**
   * Détermine le statut suivant en gérant les événements reçus dans le désordre.
   * Règle : un statut DELIVERED ne peut pas être rétrogradé par un retardataire email.sent.
   * Mais un BOUNCED ou COMPLAINED est un statut terminal critique qui prévaut.
   */
  private determineNextStatus(
    currentStatus: string,
    eventType: string,
  ): any {
    switch (eventType) {
      case 'email.sent':
        // Ne rétrograde pas si déjà livré ou en erreur terminale
        if (
          currentStatus === 'DELIVERED' ||
          currentStatus === 'BOUNCED' ||
          currentStatus === 'COMPLAINED' ||
          currentStatus === 'FAILED'
        ) {
          return currentStatus;
        }
        return 'SENT';

      case 'email.delivered':
        // Ne rétrograde pas si rebondi ou signalé en spam
        if (
          currentStatus === 'BOUNCED' ||
          currentStatus === 'COMPLAINED'
        ) {
          return currentStatus;
        }
        return 'DELIVERED';

      case 'email.delivery_delayed':
        if (
          currentStatus === 'DELIVERED' ||
          currentStatus === 'BOUNCED' ||
          currentStatus === 'COMPLAINED'
        ) {
          return currentStatus;
        }
        return 'DELIVERY_DELAYED';

      case 'email.bounced':
        return 'BOUNCED';

      case 'email.complained':
        return 'COMPLAINED';

      case 'email.failed':
        return 'FAILED';

      case 'email.opened':
      case 'email.clicked':
        // Conforme à la règle 6 : "Ne pas considérer l'ouverture ou le clic comme une preuve de livraison certaine"
        // Le statut principal n'est pas altéré, l'événement est juste consigné dans events.
        return currentStatus;

      default:
        return currentStatus;
    }
  }

  private mapStatusFromEventType(eventType: string): any {
    switch (eventType) {
      case 'email.sent':
        return 'SENT';
      case 'email.delivered':
        return 'DELIVERED';
      case 'email.delivery_delayed':
        return 'DELIVERY_DELAYED';
      case 'email.bounced':
        return 'BOUNCED';
      case 'email.complained':
        return 'COMPLAINED';
      case 'email.failed':
        return 'FAILED';
      default:
        return 'ACCEPTED';
    }
  }

  /**
   * Gère l'ajout automatique à la liste d'exclusion lors d'un rebond permanent ou d'une plainte spam.
   */
  private async handleSuppressionFromEvent(
    eventType: string,
    recipient: string,
    eventData: ResendWebhookPayload['data'],
  ): Promise<void> {
    if (!recipient) return;
    const normalizedEmail = recipient.toLowerCase().trim();

    if (eventType === 'email.bounced') {
      const isPermanent =
        (eventData.bounce?.type || 'Permanent').toLowerCase() === 'permanent';

      if (isPermanent) {
        this.logger.warn(
          `🚫 [Resend Suppression] Rebond permanent détecté pour ${normalizedEmail}. Ajout automatique à la liste d'exclusion.`,
        );
        await this.prisma.emailSuppression
          .upsert({
            where: { email: normalizedEmail },
            update: {
              reason: 'BOUNCE_PERMANENT',
              details:
                eventData.bounce?.message ||
                `Rebond permanent Resend (Sous-type: ${
                  eventData.bounce?.subType || 'General'
                })`,
            },
            create: {
              email: normalizedEmail,
              reason: 'BOUNCE_PERMANENT',
              details:
                eventData.bounce?.message ||
                `Rebond permanent Resend (Sous-type: ${
                  eventData.bounce?.subType || 'General'
                })`,
            },
          })
          .catch((err) =>
            this.logger.error(
              `❌ [Resend Suppression] Échec d'enregistrement pour ${normalizedEmail} : ${err.message}`,
            ),
          );
      }
    } else if (eventType === 'email.complained') {
      this.logger.warn(
        `🚨 [Resend Suppression] Plainte pour spam enregistrée pour ${normalizedEmail}. Exclusion immédiate des envois non essentiels.`,
      );
      await this.prisma.emailSuppression
        .upsert({
          where: { email: normalizedEmail },
          update: {
            reason: 'COMPLAINT',
            details: 'Signalement utilisateur comme courrier indésirable (Spam complaint)',
          },
          create: {
            email: normalizedEmail,
            reason: 'COMPLAINT',
            details: 'Signalement utilisateur comme courrier indésirable (Spam complaint)',
          },
        })
        .catch((err) =>
          this.logger.error(
            `❌ [Resend Suppression] Échec d'enregistrement de plainte pour ${normalizedEmail} : ${err.message}`,
          ),
        );
    }
  }

  /**
   * Assainit les données d'événement pour ne conserver que les métadonnées utiles sans données sensibles.
   */
  private sanitizeEventData(
    data: ResendWebhookPayload['data'],
  ): Record<string, unknown> {
    return {
      bounce: data.bounce,
      error: data.error,
      click: data.click
        ? {
            link: data.click.link,
          }
        : undefined,
    };
  }
}
