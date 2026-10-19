import { Injectable, Logger, Optional } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationsService } from './notifications.service.js';
import { ResendService } from '../integrations/resend/resend.service.js';
import { RedisService } from '../redis/redis.service.js';
import type {
  NotificationEvent,
  EventDispatchResult,
} from './events/notification-event.types.js';

@Injectable()
export class EventNotificationService {
  private readonly logger = new Logger(EventNotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly redisService: RedisService,
    @Optional() private readonly resendService?: ResendService,
  ) {}

  /**
   * Point d'entrée centralisé pour distribuer un événement métier sous forme de
   * notification in-app, e-mail transactionnel et notification push Expo.
   *
   * Garanties :
   * - Idempotence stricte (anti-doublon via Redis et clés déterministes).
   * - Résilience totale : un échec d'envoi réseau (Resend ou Expo) ne fait jamais échouer l'opération appelante.
   * - Respect granulaire des préférences utilisateur (sauf alertes critiques de sécurité et statut de compte).
   */
  async dispatchNotificationEvent(
    event: NotificationEvent,
  ): Promise<EventDispatchResult> {
    const { recipientUserId, type } = event;

    // 1. Déterminer une clé d'idempotence pour déduplication
    const idempotencyKey =
      event.idempotencyKey ||
      this.generateIdempotencyKey(event);

    const lockKey = `event_lock:${idempotencyKey}`;
    const alreadyProcessed = await this.redisService.get<string>(lockKey);
    if (alreadyProcessed) {
      this.logger.log(
        `🔁 [EventNotification] Événement déjà traité (${type} pour ${recipientUserId}) — Idempotence respectée.`,
      );
      return {
        success: true,
        skippedReason: 'ALREADY_PROCESSED',
      };
    }

    // Poser un verrou court (5 minutes) pour empêcher les doubles soumissions simultanées
    await this.redisService.set(lockKey, 'processing', 300);

    try {
      // 2. Charger les données du destinataire
      const user = await this.prisma.user.findUnique({
        where: { id: recipientUserId },
        select: {
          id: true,
          email: true,
          name: true,
          tier: true,
          tierExpiresAt: true,
          pushToken: true,
        },
      });

      if (!user) {
        this.logger.warn(
          `⚠️ [EventNotification] Utilisateur destinataire introuvable : ${recipientUserId}`,
        );
        return { success: false, skippedReason: 'USER_NOT_FOUND' };
      }

      // 3. Charger les préférences de notification
      const prefs = await this.notificationsService.getUserPreferences(
        recipientUserId,
      );

      let inAppCreated = false;
      let emailSent = false;
      let pushSent = false;

      // 4. Traitement selon le type d'événement
      switch (event.type) {
        // ─── VIP & ABONNEMENTS ──────────────────────────────────────────────
        case 'USER_VIP_GRANTED': {
          const durationLabel = event.durationDays
            ? `${event.durationDays} andro`
            : 'Maharitra (mandrakizay)';
          const durationLabelFr = event.durationDays
            ? `${event.durationDays} jours`
            : 'Permanent (à vie)';

          await this.notificationsService.createNotification({
            userId: user.id,
            titleMg: 'Arahabaina ! Nahazo ny sata VIP ianao 👑',
            titleFr: 'Félicitations ! Votre statut VIP est activé 👑',
            messageMg: `Nahazo ny tombontsoa VIP ianao (${durationLabel}). Nofoanana avokoa ny dokambarotra rehetra ao amin'ny fampiharana !`,
            messageFr: `Vous bénéficiez désormais du statut VIP (${durationLabelFr}). Toutes les publicités sont désactivées sur votre application mobile !`,
            category: 'system',
            badgeText: 'VIP',
            badgeType: 'reward',
            iconName: 'crown',
            iconColor: '#D97706',
            targetRoute: '/(tabs)/profil',
            isBroadcast: false,
            idempotencyKey: `notif_${idempotencyKey}`,
          });
          inAppCreated = true;

          if (this.resendService && user.email) {
            void this.resendService
              .sendVipGrantedEmail({
                to: user.email,
                userName: user.name || undefined,
                durationDays: event.durationDays,
                expiresAt: event.expiresAt,
                idempotencyKey: `email_${idempotencyKey}`,
              })
              .then(() => {
                emailSent = true;
              })
              .catch((err) => {
                this.logger.warn(
                  `[EventNotification] Échec email VIP_GRANTED pour ${user.email} : ${err}`,
                );
              });
          }
          break;
        }

        case 'USER_VIP_EXTENDED': {
          await this.notificationsService.createNotification({
            userId: user.id,
            titleMg: 'Nalava ny fe-potoana VIP anao 🎉',
            titleFr: 'Votre statut VIP a été prolongé 🎉',
            messageMg: `Nahazo fanampiny +${event.addedDays} andro ny sata VIP anao. Misaotra anao mankafy ny kolontsaina malagasy !`,
            messageFr: `Votre statut VIP a été prolongé de +${event.addedDays} jours supplémentaires. Continuez à explorer la culture malgache sans aucune pub !`,
            category: 'system',
            badgeText: 'VIP',
            badgeType: 'reward',
            iconName: 'sparkles',
            iconColor: '#D97706',
            targetRoute: '/(tabs)/profil',
            isBroadcast: false,
            idempotencyKey: `notif_${idempotencyKey}`,
          });
          inAppCreated = true;

          if (this.resendService && user.email) {
            void this.resendService
              .sendVipExtendedEmail({
                to: user.email,
                userName: user.name || undefined,
                addedDays: event.addedDays,
                newExpiresAt: event.newExpiresAt,
                idempotencyKey: `email_${idempotencyKey}`,
              })
              .then(() => {
                emailSent = true;
              })
              .catch((err) => {
                this.logger.warn(
                  `[EventNotification] Échec email VIP_EXTENDED pour ${user.email} : ${err}`,
                );
              });
          }
          break;
        }

        case 'USER_VIP_EXPIRING_SOON': {
          await this.notificationsService.createNotification({
            userId: user.id,
            titleMg: `Ho tapitra afaka ${event.daysRemaining} andro ny VIP anao ⏳`,
            titleFr: `Votre statut VIP expire dans ${event.daysRemaining} jours ⏳`,
            messageMg: `Hifarana tsy ho ela ny tombontsoa VIP anao. Hijanona ho voatahiry avokoa ny dingana sy fahalalana azonao.`,
            messageFr: `Votre avantage VIP prendra bientôt fin. Vos progressions et favoris demeurent entièrement conservés.`,
            category: 'system',
            badgeText: 'VIP',
            badgeType: 'info',
            iconName: 'time-outline',
            iconColor: '#F59E0B',
            targetRoute: '/(tabs)/profil',
            isBroadcast: false,
            idempotencyKey: `notif_${idempotencyKey}`,
          });
          inAppCreated = true;

          if (this.resendService && user.email) {
            void this.resendService
              .sendVipExpiringSoonEmail({
                to: user.email,
                userName: user.name || undefined,
                expiresAt: event.expiresAt,
                daysRemaining: event.daysRemaining,
                idempotencyKey: `email_${idempotencyKey}`,
              })
              .then(() => {
                emailSent = true;
              })
              .catch((err) => {
                this.logger.warn(
                  `[EventNotification] Échec email VIP_EXPIRING_SOON pour ${user.email} : ${err}`,
                );
              });
          }
          break;
        }

        case 'USER_VIP_EXPIRED': {
          await this.notificationsService.createNotification({
            userId: user.id,
            titleMg: 'Tapitra ny fe-potoana VIP anao',
            titleFr: 'Votre statut VIP est arrivé à expiration',
            messageMg: `Niverina amin'ny sata tsotra (Standard) ny kaontinao. Misaotra anao tamin'ny fanohanana ny Kanto MG !`,
            messageFr: `Votre compte est repassé au statut Standard. Vous conservez toutes vos progressions culturelles.`,
            category: 'system',
            badgeText: 'Standard',
            badgeType: 'info',
            iconName: 'information-circle-outline',
            iconColor: '#64748B',
            targetRoute: '/(tabs)/profil',
            isBroadcast: false,
            idempotencyKey: `notif_${idempotencyKey}`,
          });
          inAppCreated = true;

          if (this.resendService && user.email) {
            void this.resendService
              .sendVipExpiredEmail({
                to: user.email,
                userName: user.name || undefined,
                idempotencyKey: `email_${idempotencyKey}`,
              })
              .then(() => {
                emailSent = true;
              })
              .catch((err) => {
                this.logger.warn(
                  `[EventNotification] Échec email VIP_EXPIRED pour ${user.email} : ${err}`,
                );
              });
          }
          break;
        }

        case 'USER_VIP_REVOKED': {
          await this.notificationsService.createNotification({
            userId: user.id,
            titleMg: 'Fanitsiana ny satan’ny kaonty',
            titleFr: 'Mise à jour du statut de votre compte',
            messageMg: `Namboarina ho amin'ny sata Standard ny kaontinao. ${event.reason || ''}`.trim(),
            messageFr: `Votre compte a été rétabli en statut Standard par l'administration. ${event.reason || ''}`.trim(),
            category: 'system',
            badgeText: 'Compte',
            badgeType: 'info',
            iconName: 'information-circle-outline',
            iconColor: '#64748B',
            targetRoute: '/(tabs)/profil',
            isBroadcast: false,
            idempotencyKey: `notif_${idempotencyKey}`,
          });
          inAppCreated = true;
          break;
        }

        // ─── SÉCURITÉ & STATUT DU COMPTE ─────────────────────────────────────
        case 'USER_BANNED': {
          if (this.resendService && user.email) {
            void this.resendService
              .sendUserBannedEmail({
                to: user.email,
                userName: user.name || undefined,
                reason: event.reason,
                banExpires: event.banExpires,
                idempotencyKey: `email_${idempotencyKey}`,
              })
              .then(() => {
                emailSent = true;
              })
              .catch((err) => {
                this.logger.warn(
                  `[EventNotification] Échec email USER_BANNED pour ${user.email} : ${err}`,
                );
              });
          }
          break;
        }

        case 'USER_UNBANNED': {
          if (this.resendService && user.email) {
            void this.resendService
              .sendUserUnbannedEmail({
                to: user.email,
                userName: user.name || undefined,
                idempotencyKey: `email_${idempotencyKey}`,
              })
              .then(() => {
                emailSent = true;
              })
              .catch((err) => {
                this.logger.warn(
                  `[EventNotification] Échec email USER_UNBANNED pour ${user.email} : ${err}`,
                );
              });
          }
          break;
        }

        case 'SECURITY_PASSWORD_CHANGED':
        case 'SECURITY_PASSWORD_ADDED': {
          const action =
            event.type === 'SECURITY_PASSWORD_CHANGED' ? 'changed' : 'added';

          await this.notificationsService.createNotification({
            userId: user.id,
            titleMg: 'Fiarovana : Novana ny tenimiafina',
            titleFr: 'Sécurité : Mot de passe mis à jour',
            messageMg:
              'Voaova soa aman-tsara ny tenimiafin’ny kaontinao. Raha tsy ianao no nanao izany, ampahafantaro haingana ny tompon’andraikitra.',
            messageFr:
              'Le mot de passe associé à votre compte Kanto a été modifié. Si vous n’êtes pas à l’origine de cette action, sécurisez immédiatement votre compte.',
            category: 'system',
            badgeText: 'Fiarovana',
            badgeType: 'info',
            iconName: 'shield-checkmark',
            iconColor: '#C0392B',
            targetRoute: '/(tabs)/profil',
            isBroadcast: false,
            idempotencyKey: `notif_${idempotencyKey}`,
          });
          inAppCreated = true;

          if (this.resendService && user.email) {
            void this.resendService
              .sendSecurityChangeEmail({
                to: user.email,
                userName: user.name || undefined,
                action,
                idempotencyKey: `email_${idempotencyKey}`,
              })
              .then(() => {
                emailSent = true;
              })
              .catch((err) => {
                this.logger.warn(
                  `[EventNotification] Échec email sécurité pour ${user.email} : ${err}`,
                );
              });
          }
          break;
        }

        // ─── MODÉRATION DES CONTRIBUTIONS ────────────────────────────────────
        case 'CONTRIBUTION_APPROVED': {
          const preview = event.contributionTitle.slice(0, 45);
          await this.notificationsService.createNotification({
            userId: user.id,
            titleMg: 'Arahabaina ! Nankatoavina ny fandraisana anjaranao 🎉',
            titleFr: 'Félicitations ! Votre contribution a été approuvée 🎉',
            messageMg: `Navoaka soa aman-tsara ny fandraisana anjaranao (« ${preview}... »). Nahazo +${event.xpReward || 50} XP ianao !`,
            messageFr: `Votre contribution (« ${preview}... ») est désormais publiée dans Kanto. Vous avez remporté +${event.xpReward || 50} XP !`,
            category: 'community',
            badgeText: 'Nekena',
            badgeType: 'new',
            iconName: 'ribbon-outline',
            iconColor: '#10B981',
            targetRoute: '/(tabs)/communaute',
            isBroadcast: false,
            idempotencyKey: `notif_${idempotencyKey}`,
          });
          inAppCreated = true;

          if (this.resendService && user.email) {
            void this.resendService
              .sendContributionApprovedEmail({
                to: user.email,
                userName: user.name || undefined,
                contributionTitle: preview,
                category: event.category,
                xpReward: event.xpReward || 50,
                contributionId: event.contributionId,
                idempotencyKey: `email_${idempotencyKey}`,
              })
              .then(() => {
                emailSent = true;
              })
              .catch((err) => {
                this.logger.warn(
                  `[EventNotification] Échec email contribution approuvée : ${err}`,
                );
              });
          }
          break;
        }

        case 'CONTRIBUTION_REJECTED': {
          const preview = event.contributionTitle.slice(0, 45);
          const feedback =
            event.feedbackReason ||
            'Cette proposition n a pas pu être retenue pour le moment dans le catalogue.';

          await this.notificationsService.createNotification({
            userId: user.id,
            titleMg: 'Fandraisana anjara : Tsy voatazona',
            titleFr: 'Contribution : Non retenue',
            messageMg: `Tsy voatazona tamin'ity indray mitoraka ity ny fandraisana anjaranao (« ${preview}... »). ${feedback}`,
            messageFr: `Votre contribution (« ${preview}... ») n'a pas pu être retenue pour le moment. ${feedback}`,
            category: 'community',
            badgeText: 'Fandraisana anjara',
            badgeType: 'info',
            iconName: 'document-text-outline',
            iconColor: '#64748B',
            targetRoute: '/(tabs)/profil',
            isBroadcast: false,
            idempotencyKey: `notif_${idempotencyKey}`,
          });
          inAppCreated = true;

          if (this.resendService && user.email) {
            void this.resendService
              .sendContributionStatusUpdateEmail({
                to: user.email,
                userName: user.name || undefined,
                contributionTitle: preview,
                status: 'REJECTED',
                feedbackReason: feedback,
                contributionId: event.contributionId,
                idempotencyKey: `email_${idempotencyKey}`,
              })
              .then(() => {
                emailSent = true;
              })
              .catch((err) => {
                this.logger.warn(
                  `[EventNotification] Échec email contribution rejetée : ${err}`,
                );
              });
          }
          break;
        }

        case 'CONTRIBUTION_CHANGES_REQUESTED': {
          const preview = event.contributionTitle.slice(0, 45);
          const feedback =
            event.feedbackReason ||
            'Quelques précisions ou corrections sont attendues.';

          await this.notificationsService.createNotification({
            userId: user.id,
            titleMg: 'Fanitsiana ilaina : Fandraisana anjara',
            titleFr: 'Modifications demandées : Contribution',
            messageMg: `Misy fanitsiana vitsivitsy ilaina amin'ny fandraisana anjaranao (« ${preview}... ») : ${feedback}`,
            messageFr: `Des ajustements sont demandés sur votre proposition (« ${preview}... ») : ${feedback}`,
            category: 'community',
            badgeText: 'Fanitsiana',
            badgeType: 'info',
            iconName: 'create-outline',
            iconColor: '#F59E0B',
            targetRoute: '/(tabs)/profil',
            isBroadcast: false,
            idempotencyKey: `notif_${idempotencyKey}`,
          });
          inAppCreated = true;

          if (this.resendService && user.email) {
            void this.resendService
              .sendContributionStatusUpdateEmail({
                to: user.email,
                userName: user.name || undefined,
                contributionTitle: preview,
                status: 'CHANGES_REQUESTED',
                feedbackReason: feedback,
                contributionId: event.contributionId,
                idempotencyKey: `email_${idempotencyKey}`,
              })
              .then(() => {
                emailSent = true;
              })
              .catch((err) => {
                this.logger.warn(
                  `[EventNotification] Échec email modifications demandées : ${err}`,
                );
              });
          }
          break;
        }

        // ─── ACTIVITÉS SOCIALES ──────────────────────────────────────────────
        case 'FRIEND_REQUEST_RECEIVED': {
          if (prefs.socialActivity !== false) {
            await this.notificationsService.createNotification({
              userId: user.id,
              titleMg: 'Fangatahana ho namana vaovao 🤝',
              titleFr: 'Nouvelle demande d’ami 🤝',
              messageMg: `Maniry ny ho naman'ny fandalinana kolontsaina miaraka aminao i ${event.senderName}.`,
              messageFr: `${event.senderName} souhaite devenir votre ami sur Kanto et partager cette aventure culturelle.`,
              category: 'community',
              badgeText: 'Fangatahana',
              badgeType: 'info',
              iconName: 'person-add',
              iconColor: '#4A6741',
              targetRoute: '/(tabs)/communaute',
              isBroadcast: false,
              idempotencyKey: `notif_${idempotencyKey}`,
            });
            inAppCreated = true;
          }
          break;
        }

        case 'FRIEND_REQUEST_ACCEPTED': {
          if (prefs.socialActivity !== false) {
            await this.notificationsService.createNotification({
              userId: user.id,
              titleMg: 'Namana vaovao nankatoavina ! 🤝',
              titleFr: 'Demande d’ami acceptée ! 🤝',
              messageMg: `Tafara-dia amin'ny fandalinana kolontsaina ao amin'ny Kanto ianao sy i ${event.friendName}. Faly miara-dalana !`,
              messageFr: `Vous êtes désormais connectés avec ${event.friendName} sur Kanto. Partagez votre passion pour la culture malgache !`,
              category: 'community',
              badgeText: 'Namana',
              badgeType: 'info',
              iconName: 'people',
              iconColor: '#4A6741',
              targetRoute: '/(tabs)/communaute',
              isBroadcast: false,
              idempotencyKey: `notif_${idempotencyKey}`,
            });
            inAppCreated = true;
          }
          break;
        }

        default:
          this.logger.warn(
            `[EventNotification] Type d'événement non géré : ${(event as any).type}`,
          );
      }

      // Marquer comme définitivement traité dans Redis (24h)
      await this.redisService.set(lockKey, 'completed', 86400);

      this.logger.log(
        `✅ [EventNotification] Événement ${type} traité pour l'utilisateur ${recipientUserId} (In-App: ${inAppCreated})`,
      );

      return {
        success: true,
        inAppCreated,
        emailSent,
        pushSent: Boolean(user.pushToken),
      };
    } catch (err: unknown) {
      this.logger.error(
        `❌ [EventNotification] Erreur lors du dispatch de l'événement ${type} pour ${recipientUserId} : ${err instanceof Error ? err.message : String(err)}`,
      );
      // Libérer le verrou en cas d'erreur inattendue pour permettre une relance
      await this.redisService.del(lockKey);
      return {
        success: false,
        skippedReason: `ERROR: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  /**
   * Génère une clé d'idempotence stable si aucune n'a été spécifiée par l'appelant.
   */
  private generateIdempotencyKey(event: NotificationEvent): string {
    const today = new Date().toISOString().split('T')[0];

    switch (event.type) {
      case 'USER_VIP_GRANTED':
      case 'USER_VIP_EXTENDED':
      case 'USER_VIP_REVOKED':
        return `${event.type}:${event.recipientUserId}:${Date.now()}`;
      case 'USER_VIP_EXPIRING_SOON':
        return `VIP_EXPIRING_SOON:${event.recipientUserId}:${today}`;
      case 'USER_VIP_EXPIRED':
        return `VIP_EXPIRED:${event.recipientUserId}:${today}`;
      case 'USER_BANNED':
      case 'USER_UNBANNED':
        return `${event.type}:${event.recipientUserId}:${Date.now()}`;
      case 'CONTRIBUTION_APPROVED':
      case 'CONTRIBUTION_REJECTED':
      case 'CONTRIBUTION_CHANGES_REQUESTED':
        return `${event.type}:${event.contributionId}`;
      case 'FRIEND_REQUEST_RECEIVED':
        return `FRIEND_REQ:${event.senderUserId}:${event.recipientUserId}`;
      case 'FRIEND_REQUEST_ACCEPTED':
        return `FRIEND_ACC:${event.friendUserId}:${event.recipientUserId}`;
      case 'SECURITY_PASSWORD_CHANGED':
      case 'SECURITY_PASSWORD_ADDED':
      case 'SECURITY_ACCOUNT_DELETED':
        return `${event.type}:${event.recipientUserId}:${Date.now()}`;
      default:
        return `EVENT:${(event as any).type}:${(event as any).recipientUserId}:${Date.now()}`;
    }
  }
}
