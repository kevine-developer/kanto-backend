import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  Optional,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { BetaEmailDispatcherService } from './services/beta-email-dispatcher.service.js';
import {
  RegisterBetaTesterDto,
  UpdatePlatformsDto,
  UnsubscribeBetaDto,
  ConfirmParticipationDto,
  BulkActionDto,
  SubmitFeedbackDto,
  UpdateFeedbackDto,
  CreateBetaGroupDto,
  UpdateBetaGroupDto,
  CreateBetaVersionDto,
  UpdateBetaVersionDto,
  UpdateEmailTemplateDto,
  UpdateAutomationConfigDto,
} from './dto/beta-tester.dto.js';
import { TesterStatus, Prisma } from '../../generated/prisma/client.js';
import {
  hashEmail,
  encryptEmail,
  decryptEmail,
  maskEmail,
  sanitizeCsvCell,
  generateSecureToken,
} from './utils/beta-crypto.util.js';
import { AdminAuditService } from '../admin/admin-audit.service.js';

@Injectable()
export class BetaTestersService {
  private readonly logger = new Logger(BetaTestersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailDispatcher: BetaEmailDispatcherService,
    @Optional() private readonly auditService?: AdminAuditService,
  ) {}

  /**
   * Enregistre une action sensible dans le journal d'audit immuable (AdminAuditLog).
   */
  private async audit(params: {
    userId?: string;
    userName?: string;
    action: string;
    targetType: string;
    targetId: string;
    targetLabel?: string;
    reason?: string;
    details?: Record<string, unknown>;
    ipAddress?: string;
  }) {
    if (!this.auditService) return;
    try {
      await this.auditService.logAction({
        userId: params.userId || 'admin',
        userName: params.userName || 'Administrateur',
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId,
        targetLabel: params.targetLabel,
        reason: params.reason,
        details: params.details,
        ipAddress: params.ipAddress,
      });
    } catch (err) {
      this.logger.warn(`Échec audit log (${params.action}): ${err}`);
    }
  }

  // ─── CANDIDATURE & GESTION PUBLIQUE PARTICIPANT ──────────────────────────────

  /**
   * Enregistre une nouvelle inscription publique au programme de test bêta.
   */
  async register(
    dto: RegisterBetaTesterDto,
    clientIp?: string,
    userAgent?: string,
  ) {
    // 1. Protection Honeypot anti-bot
    if (dto.website && dto.website.trim() !== '') {
      this.logger.warn(
        `🤖 [BetaTesters] Honeypot déclenché par IP ${clientIp}`,
      );
      return {
        success: true,
        message: 'Candidature enregistrée avec succès.',
      };
    }

    if (dto.termsAccepted === false) {
      throw new BadRequestException(
        'Vous devez accepter les conditions de participation.',
      );
    }

    const email = dto.email.trim().toLowerCase();
    const platforms =
      Array.isArray(dto.platforms) && dto.platforms.length > 0
        ? Array.from(new Set(dto.platforms))
        : ['ANDROID'];

    // 2. Vérification d'une inscription existante via hash HMAC-SHA-256 déterministe (avec fallback résilient)
    const emailHashVal = hashEmail(email);
    let existing: Awaited<
      ReturnType<
        typeof this.prisma.betaTester.findFirst<{ include: { group: true } }>
      >
    > = null;
    try {
      existing = await this.prisma.betaTester.findFirst({
        where: {
          OR: [{ emailHash: emailHashVal }, { email }],
        },
        include: { group: true },
      });
    } catch {
      existing = await this.prisma.betaTester.findFirst({
        where: { email },
        include: { group: true },
      });
    }

    if (existing) {
      // Cas UX utile : si l'utilisateur s'était précédemment désinscrit, lui permettre de se réinscrire proprement
      const wasUnsubscribed = Boolean(existing.unsubscribedAt);

      if (wasUnsubscribed) {
        this.logger.log(
          `🔄 [BetaTesters] Réactivation d'une candidature précédemment désinscrite : ${maskEmail(email)}`,
        );

        const config = await this.prisma.betaAutomationConfig.findFirst();
        const hasAndroid = platforms.includes('ANDROID');
        const hasIos = platforms.includes('IOS');
        const androidStatus = hasAndroid ? 'PENDING' : 'NOT_REQUESTED';
        const iosStatus = hasIos ? 'PENDING' : 'NOT_REQUESTED';
        const initialStatus = config?.autoInviteOnApproval
          ? TesterStatus.APPROVED
          : TesterStatus.PENDING;

        const updated = await this.prisma.betaTester.update({
          where: { id: existing.id },
          data: {
            platforms,
            status: initialStatus,
            androidStatus,
            iosStatus,
            unsubscribedAt: null,
            unsubscribeReason: null,
            fullName: dto.fullName?.trim() || existing.fullName,
            termsAccepted: true,
            termsAcceptedAt: new Date(),
            ipAddress: clientIp || existing.ipAddress,
            userAgent: userAgent || existing.userAgent,
          },
        });

        if (config?.autoConfirmRegistration !== false) {
          try {
            const platformLabel =
              hasAndroid && hasIos
                ? 'Android & iOS'
                : hasAndroid
                  ? 'Android'
                  : 'iOS';

            await this.emailDispatcher.sendTemplateEmail({
              to: email,
              templateCode: 'CONFIRMATION',
              variables: {
                userName: updated.fullName || 'Bêta-testeur',
                platform: platformLabel,
                unsubscribeLink: `https://app-kanto.gastsar.fr/beta?tab=unsubscribe&token=${existing.unsubscribeToken || ''}`,
              },
            });
          } catch (emailErr: unknown) {
            const msg =
              emailErr instanceof Error ? emailErr.message : String(emailErr);
            this.logger.warn(
              `⚠️ [BetaTesters] Échec envoi email réinscription pour ${maskEmail(email)} : ${msg}`,
            );
          }
        }

        return {
          success: true,
          alreadyRegistered: false,
          isReactivated: true,
          testerId: updated.id,
          platforms: updated.platforms,
          message:
            'Bon retour parmi nous ! Votre réinscription au programme bêta a été confirmée avec succès. Un e-mail récapitulatif vous a été envoyé.',
        };
      }

      this.logger.log(
        `ℹ️ [BetaTesters] Inscription existante trouvée pour : ${maskEmail(email)}`,
      );
      return {
        success: false,
        alreadyRegistered: true,
        code: 'EMAIL_ALREADY_REGISTERED',
        message: 'Cette adresse e-mail est déjà inscrite au programme bêta.',
        tester: {
          id: existing.id,
          email: maskEmail(existing.email),
          maskedEmail: maskEmail(existing.email),
          fullName: existing.fullName,
          platforms: existing.platforms,
          status: existing.status,
          androidStatus: existing.androidStatus,
          iosStatus: existing.iosStatus,
          createdAt: existing.createdAt,
        },
      };
    }

    // 3. Récupération de la configuration d'automatisation et du groupe par défaut
    const [config, defaultGroup] = await Promise.all([
      this.prisma.betaAutomationConfig.findFirst(),
      this.prisma.betaGroup.findFirst({ where: { isDefault: true } }),
    ]);

    const hasAndroid = platforms.includes('ANDROID');
    const hasIos = platforms.includes('IOS');

    const androidStatus = hasAndroid ? 'PENDING' : 'NOT_REQUESTED';
    const iosStatus = hasIos ? 'PENDING' : 'NOT_REQUESTED';
    const initialStatus = config?.autoInviteOnApproval
      ? TesterStatus.APPROVED
      : TesterStatus.PENDING;

    const unsubscribeToken = generateSecureToken(24);
    const encryptedEmail = encryptEmail(email);

    try {
      let tester;
      try {
        tester = await this.prisma.betaTester.create({
          data: {
            email: encryptedEmail,
            emailHash: emailHashVal,
            fullName: dto.fullName?.trim() || null,
            platforms,
            status: initialStatus,
            androidStatus,
            iosStatus,
            termsAccepted: true,
            termsAcceptedAt: new Date(),
            unsubscribeToken,
            groupId: defaultGroup?.id || null,
            ipAddress: clientIp || null,
            userAgent: userAgent || null,
          },
        });
      } catch (createErr: unknown) {
        // Fallback transparent si la colonne emailHash n'a pas encore été migrée sur la base
        tester = await this.prisma.betaTester.create({
          data: {
            email: encryptedEmail,
            fullName: dto.fullName?.trim() || null,
            platforms,
            status: initialStatus,
            androidStatus,
            iosStatus,
            termsAccepted: true,
            termsAcceptedAt: new Date(),
            unsubscribeToken,
            groupId: defaultGroup?.id || null,
            ipAddress: clientIp || null,
            userAgent: userAgent || null,
          },
        });
      }

      this.logger.log(
        `🎉 [BetaTesters] Nouveau testeur enregistré : ${maskEmail(email)} [${platforms.join(', ')}]`,
      );

      // 4. Envoi automatique de l'email de confirmation si activé
      if (config?.autoConfirmRegistration !== false) {
        try {
          const platformLabel =
            hasAndroid && hasIos
              ? 'Android & iOS'
              : hasAndroid
                ? 'Android'
                : 'iOS';

          await this.emailDispatcher.sendTemplateEmail({
            to: email,
            templateCode: 'CONFIRMATION',
            variables: {
              userName: tester.fullName || 'Bêta-testeur',
              platform: platformLabel,
              unsubscribeLink: `https://app-kanto.gastsar.fr/beta?tab=unsubscribe&token=${unsubscribeToken}`,
            },
          });
        } catch (emailErr: unknown) {
          const msg =
            emailErr instanceof Error ? emailErr.message : String(emailErr);
          this.logger.error(
            `❌ [BetaTesters] Échec envoi confirmation à ${maskEmail(email)} : ${msg}`,
          );
        }
      }

      return {
        success: true,
        alreadyRegistered: false,
        testerId: tester.id,
        platforms: tester.platforms,
        message:
          'Votre inscription au programme bêta a été confirmée avec succès ! Un e-mail de confirmation vous a été envoyé.',
      };
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return {
          success: false,
          alreadyRegistered: true,
          code: 'EMAIL_ALREADY_REGISTERED',
          message: 'Cette adresse e-mail est déjà inscrite au programme bêta.',
        };
      }
      throw error;
    }
  }

  /**
   * Permet à un utilisateur déjà inscrit de modifier ses plateformes de test.
   */
  async updatePlatforms(dto: UpdatePlatformsDto) {
    const email = dto.email.trim().toLowerCase();
    const emailHashVal = hashEmail(email);
    const tester = await this.prisma.betaTester.findFirst({
      where: {
        OR: [{ emailHash: emailHashVal }, { email }],
      },
    });

    if (!tester) {
      throw new NotFoundException(
        'Aucune inscription trouvée avec cette adresse email.',
      );
    }

    const newPlatforms = Array.from(new Set(dto.platforms));
    const hasAndroid = newPlatforms.includes('ANDROID');
    const hasIos = newPlatforms.includes('IOS');

    const updateData: Prisma.BetaTesterUpdateInput = {
      platforms: newPlatforms,
    };

    if (hasAndroid && tester.androidStatus === 'NOT_REQUESTED') {
      updateData.androidStatus = 'PENDING';
    } else if (!hasAndroid) {
      updateData.androidStatus = 'NOT_REQUESTED';
    }

    if (hasIos && tester.iosStatus === 'NOT_REQUESTED') {
      updateData.iosStatus = 'PENDING';
    } else if (!hasIos) {
      updateData.iosStatus = 'NOT_REQUESTED';
    }

    const updated = await this.prisma.betaTester.update({
      where: { id: tester.id },
      data: updateData,
    });

    this.logger.log(
      `🔄 [BetaTesters] Plateformes mises à jour pour ${maskEmail(email)} : [${newPlatforms.join(', ')}]`,
    );

    return {
      success: true,
      message: 'Vos plateformes de test ont été mises à jour avec succès.',
      tester: {
        ...updated,
        email: maskEmail(updated.email),
        maskedEmail: maskEmail(updated.email),
      },
    };
  }

  /**
   * Désinscription du programme bêta (RGPD).
   */
  async unsubscribe(dto: UnsubscribeBetaDto) {
    let tester: Awaited<ReturnType<typeof this.prisma.betaTester.findFirst>> =
      null;
    if (dto.token && dto.token.trim()) {
      tester = await this.prisma.betaTester.findFirst({
        where: { unsubscribeToken: dto.token.trim() },
      });
    }

    if (!tester && dto.email && dto.email.trim()) {
      const email = dto.email.trim().toLowerCase();
      const emailHashVal = hashEmail(email);
      tester = await this.prisma.betaTester.findFirst({
        where: {
          OR: [{ emailHash: emailHashVal }, { email }],
        },
      });
    }

    if (!tester) {
      return {
        success: false,
        message: 'Adresse email introuvable parmi les testeurs inscrits.',
      };
    }

    // Si un token est passé, vérifier qu'il concorde
    if (
      dto.token &&
      tester.unsubscribeToken &&
      tester.unsubscribeToken !== dto.token
    ) {
      throw new BadRequestException('Jeton de désinscription invalide.');
    }

    const alreadyUnsubscribed =
      tester.unsubscribedAt !== null || tester.status === TesterStatus.REJECTED;
    const reason = dto.reason?.trim() || 'Demande directe de l’utilisateur';

    await this.prisma.betaTester.update({
      where: { id: tester.id },
      data: {
        status: TesterStatus.REJECTED,
        androidStatus: 'REJECTED',
        iosStatus: 'REJECTED',
        unsubscribedAt: tester.unsubscribedAt || new Date(),
        unsubscribeReason: reason,
      },
    });

    const realEmail =
      decryptEmail(tester.email) || dto.email?.trim()?.toLowerCase();
    this.logger.log(
      `👋 [BetaTesters] Désinscription effectuée pour ${maskEmail(realEmail || tester.email)} (Motif: ${reason})`,
    );

    // Envoi de l'accusé de réception officiel de désinscription (obligation RGPD et courtoisie UX)
    if (realEmail && realEmail.includes('@') && !alreadyUnsubscribed) {
      try {
        await this.emailDispatcher.sendTemplateEmail({
          to: realEmail,
          templateCode: 'UNSUBSCRIBE_CONFIRMATION',
          variables: {
            userName: tester.fullName || 'Bêta-testeur',
            reason,
            supportEmail: 'contact@kanto.mg',
            resubscribeLink: 'https://app-kanto.gastsar.fr/beta',
          },
          bypassSuppression: true,
        });
        this.logger.log(
          `✉️ [BetaTesters] E-mail de confirmation de désinscription délivré à ${maskEmail(realEmail)}`,
        );
      } catch (emailErr: unknown) {
        const msg =
          emailErr instanceof Error ? emailErr.message : String(emailErr);
        this.logger.warn(
          `⚠️ [BetaTesters] Échec envoi email de désinscription à ${maskEmail(realEmail)} : ${msg}`,
        );
      }
    }

    return {
      success: true,
      alreadyUnsubscribed,
      message: alreadyUnsubscribed
        ? 'Votre adresse était déjà désinscrite du programme bêta Kanto MG.'
        : 'Votre désinscription a été effectuée avec succès. Un e-mail de confirmation vous a été envoyé.',
    };
  }

  /**
   * Calcule le statut de confirmation unifié d'un testeur.
   */
  private resolveConfirmationStatus(tester: {
    unsubscribedAt?: Date | null;
    status?: TesterStatus;
    confirmationStatus?: string | null;
    installedAt?: Date | null;
    verifiedAt?: Date | null;
    confirmedAt?: Date | null;
    androidStatus?: string | null;
    iosStatus?: string | null;
  }):
    'INSCRIT' | 'EN_ATTENTE' | 'CONFIRME' | 'VERIFIE' | 'INSTALLE' | 'INACTIF' {
    if (tester.unsubscribedAt || tester.status === TesterStatus.REJECTED) {
      return 'INACTIF';
    }
    if (tester.installedAt || tester.confirmationStatus === 'INSTALLE') {
      return 'INSTALLE';
    }
    if (tester.verifiedAt || tester.confirmationStatus === 'VERIFIE') {
      return 'VERIFIE';
    }
    if (tester.confirmedAt || tester.confirmationStatus === 'CONFIRME') {
      return 'CONFIRME';
    }
    if (
      tester.status === TesterStatus.APPROVED ||
      tester.androidStatus === 'ACCEPTED' ||
      tester.iosStatus === 'ACCEPTED'
    ) {
      return 'EN_ATTENTE';
    }
    if (
      tester.confirmationStatus &&
      [
        'INSCRIT',
        'EN_ATTENTE',
        'CONFIRME',
        'VERIFIE',
        'INSTALLE',
        'INACTIF',
      ].includes(tester.confirmationStatus)
    ) {
      return tester.confirmationStatus as any;
    }
    return 'INSCRIT';
  }

  /**
   * Informations publiques de disponibilité et téléchargement pour le portail web.
   */
  async getDownloadInfo() {
    const config = await this.getAutomationConfig();
    const [latestAndroidVersion, latestIosVersion] = await Promise.all([
      this.prisma.betaVersion.findFirst({
        where: {
          platform: { in: ['ANDROID', 'ALL'] },
          status: 'ACTIVE',
        },
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.betaVersion.findFirst({
        where: {
          platform: { in: ['IOS', 'ALL'] },
          status: 'ACTIVE',
        },
        orderBy: { publishedAt: 'desc' },
      }),
    ]);

    return {
      success: true,
      android: {
        availability: config.androidAvailability || 'BETA_OPEN',
        playStoreWebLink: config.playStoreWebLink,
        playStoreAppLink: config.playStoreAppLink,
        instructions: config.instructionsAndroid,
        latestVersion: latestAndroidVersion
          ? {
              version: latestAndroidVersion.version,
              buildNumber: latestAndroidVersion.buildNumber,
              title: latestAndroidVersion.title,
              releaseNotes: latestAndroidVersion.releaseNotes,
              publishedAt: latestAndroidVersion.publishedAt,
            }
          : null,
      },
      ios: {
        availability: config.iosAvailability || 'BETA_OPEN',
        appStoreLink: config.appStorePublicLink || null,
        testFlightLink: config.testFlightPublicLink || null,
        instructions: config.instructionsIos,
        latestVersion: latestIosVersion
          ? {
              version: latestIosVersion.version,
              buildNumber: latestIosVersion.buildNumber,
              title: latestIosVersion.title,
              releaseNotes: latestIosVersion.releaseNotes,
              publishedAt: latestIosVersion.publishedAt,
            }
          : null,
      },
      supportEmail: config.supportEmail || 'contact@kanto.mg',
    };
  }

  /**
   * Confirmation active de participation par le testeur (« J'ai rejoint le programme » / « J'ai installé »).
   */
  async confirmParticipation(dto: ConfirmParticipationDto) {
    const email = dto.email.trim().toLowerCase();
    const emailHashVal = hashEmail(email);
    let tester: Awaited<ReturnType<typeof this.prisma.betaTester.findFirst>> =
      null;

    try {
      tester = await this.prisma.betaTester.findFirst({
        where: {
          OR: [{ emailHash: emailHashVal }, { email }],
        },
      });
    } catch {
      tester = await this.prisma.betaTester.findFirst({ where: { email } });
    }

    if (!tester) {
      throw new NotFoundException(
        'Aucune candidature trouvée avec cette adresse e-mail. Veuillez d’abord vous inscrire.',
      );
    }

    if (tester.unsubscribedAt || tester.status === TesterStatus.REJECTED) {
      throw new BadRequestException(
        'Votre compte est actuellement désinscrit du programme bêta.',
      );
    }

    const action = dto.action || 'JOINED';
    const now = new Date();
    const updateData: Prisma.BetaTesterUpdateInput = {
      lastContactedAt: now,
    };

    if (action === 'INSTALLED') {
      updateData.installedAt = tester.installedAt || now;
      updateData.confirmationStatus = 'INSTALLE';
      if (
        tester.platforms.includes('ANDROID') &&
        tester.androidStatus !== 'REJECTED'
      ) {
        updateData.androidStatus = 'ACTIVE';
      }
      if (tester.platforms.includes('IOS') && tester.iosStatus !== 'REJECTED') {
        updateData.iosStatus = 'ACTIVE';
      }
      this.logger.log(
        `📲 [BetaTesters] Installation déclarée confirmée pour ${maskEmail(email)}`,
      );
    } else {
      updateData.confirmedAt = tester.confirmedAt || now;
      if (
        !tester.confirmationStatus ||
        tester.confirmationStatus === 'INSCRIT' ||
        tester.confirmationStatus === 'EN_ATTENTE'
      ) {
        updateData.confirmationStatus = 'CONFIRME';
      }
      if (tester.androidStatus === 'INVITED') {
        updateData.androidStatus = 'ACCEPTED';
      }
      if (tester.iosStatus === 'INVITED') {
        updateData.iosStatus = 'ACCEPTED';
      }
      this.logger.log(
        `✅ [BetaTesters] Participation au programme bêta confirmée pour ${maskEmail(email)}`,
      );
    }

    await this.prisma.betaTester.update({
      where: { id: tester.id },
      data: updateData,
    });

    return this.verifyParticipation(email);
  }

  /**
   * Vérification publique du statut d'un testeur avec espace personnel complet.
   */
  async verifyParticipation(emailInput: string) {
    const email = emailInput.trim().toLowerCase();
    const emailHashVal = hashEmail(email);
    let tester: Awaited<
      ReturnType<
        typeof this.prisma.betaTester.findFirst<{
          include: {
            group: true;
            feedbacks: { take: 1; orderBy: { createdAt: 'desc' } };
          };
        }>
      >
    > = null;

    try {
      tester = await this.prisma.betaTester.findFirst({
        where: {
          OR: [{ emailHash: emailHashVal }, { email }],
        },
        include: {
          group: true,
          feedbacks: { take: 1, orderBy: { createdAt: 'desc' } },
        },
      });
    } catch {
      tester = await this.prisma.betaTester.findFirst({
        where: { email },
        include: {
          group: true,
          feedbacks: { take: 1, orderBy: { createdAt: 'desc' } },
        },
      });
    }

    if (!tester) {
      return {
        success: false,
        exists: false,
        message:
          'Aucune candidature trouvée avec cette adresse e-mail. Inscrivez-vous ci-dessus pour rejoindre la communauté des testeurs !',
      };
    }

    const config = await this.getAutomationConfig();
    const hasAndroid = tester.platforms.includes('ANDROID');
    const hasIos = tester.platforms.includes('IOS');

    const canDownloadAndroid =
      hasAndroid &&
      (config.androidAvailability === 'PUBLIC' ||
        tester.androidStatus === 'INVITED' ||
        tester.androidStatus === 'ACCEPTED' ||
        tester.androidStatus === 'ACTIVE' ||
        tester.status === TesterStatus.INVITED ||
        tester.status === TesterStatus.APPROVED ||
        Boolean(tester.confirmedAt));

    const canDownloadIos =
      hasIos &&
      (config.iosAvailability === 'PUBLIC' ||
        tester.iosStatus === 'INVITED' ||
        tester.iosStatus === 'ACCEPTED' ||
        tester.iosStatus === 'ACTIVE' ||
        Boolean(tester.confirmedAt) ||
        Boolean(config.testFlightPublicLink));

    const masked = maskEmail(tester.email);
    const isUnsubscribed = Boolean(
      tester.unsubscribedAt || tester.status === TesterStatus.REJECTED,
    );

    const unifiedStatus = this.resolveConfirmationStatus(tester);

    // Récupérer la dernière version active pour sa plateforme
    const activeVersions = await this.prisma.betaVersion.findMany({
      where: {
        status: 'ACTIVE',
        platform: {
          in:
            hasAndroid && hasIos
              ? ['ANDROID', 'IOS', 'ALL']
              : hasAndroid
                ? ['ANDROID', 'ALL']
                : ['IOS', 'ALL'],
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: 1,
    });
    const latestVersion = activeVersions[0]
      ? {
          version: activeVersions[0].version,
          buildNumber: activeVersions[0].buildNumber,
          title: activeVersions[0].title,
          releaseNotes: activeVersions[0].releaseNotes,
          publishedAt: activeVersions[0].publishedAt,
        }
      : null;

    // Définition des 5 étapes du parcours
    const step1Done = true;
    const step2Done =
      unifiedStatus !== 'INSCRIT' ||
      tester.androidStatus === 'INVITED' ||
      tester.iosStatus === 'INVITED' ||
      tester.status === TesterStatus.APPROVED;
    const step3Done =
      ['CONFIRME', 'VERIFIE', 'INSTALLE'].includes(unifiedStatus) ||
      Boolean(tester.confirmedAt);
    const step4Done =
      ['VERIFIE', 'INSTALLE'].includes(unifiedStatus) ||
      Boolean(tester.installedAt);
    const step5Done = tester.feedbacks && tester.feedbacks.length > 0;

    let currentStepIndex = 1;
    if (step4Done) currentStepIndex = 5;
    else if (step3Done) currentStepIndex = 4;
    else if (step2Done) currentStepIndex = 3;
    else currentStepIndex = 2;

    const steps = [
      {
        index: 1,
        key: 'REGISTERED',
        title: 'Candidature enregistrée',
        description:
          'Votre inscription au programme bêta a été prise en compte avec succès.',
        completed: step1Done,
        date: tester.createdAt,
      },
      {
        index: 2,
        key: 'INVITATION',
        title: 'Accès & Invitation',
        description:
          hasAndroid && hasIos
            ? 'Autorisation accordée pour Google Play et Apple TestFlight.'
            : hasAndroid
              ? 'Ajout de votre compte Google au groupe de test fermé Google Play.'
              : 'Génération de votre accès au test sur Apple TestFlight.',
        completed: step2Done,
        date:
          tester.androidInvitedAt ||
          tester.iosInvitedAt ||
          tester.invitedAt ||
          null,
      },
      {
        index: 3,
        key: 'JOINED',
        title: 'Rejoindre le test',
        description: hasAndroid
          ? 'Accepter l’invitation sur la page web Google Play Closed Testing.'
          : 'Installer TestFlight sur votre iPhone ou iPad et accepter l’invitation.',
        completed: step3Done,
        date: tester.confirmedAt || null,
      },
      {
        index: 4,
        key: 'INSTALLED',
        title: 'Installation de Kanto MG',
        description:
          'Télécharger et ouvrir Kanto MG sur votre appareil mobile.',
        completed: step4Done,
        date: tester.installedAt || null,
      },
      {
        index: 5,
        key: 'TESTING',
        title: 'Exploration & Retours',
        description:
          'Découvrir la culture malgache et partager vos avis et signalements.',
        completed: step5Done,
        date: tester.feedbacks?.[0]?.createdAt || null,
      },
    ];

    return {
      success: true,
      exists: true,
      isUnsubscribed,
      tester: {
        id: tester.id,
        email: masked,
        maskedEmail: masked,
        fullName: tester.fullName,
        platforms: tester.platforms,
        status: tester.status,
        androidStatus: tester.androidStatus,
        iosStatus: tester.iosStatus,
        confirmationStatus: unifiedStatus,
        confirmedAt: tester.confirmedAt,
        installedAt: tester.installedAt,
        verifiedAt: tester.verifiedAt,
        groupName: tester.group?.name || null,
        createdAt: tester.createdAt,
        androidInvitedAt: tester.androidInvitedAt || tester.invitedAt,
        iosInvitedAt: tester.iosInvitedAt,
        unsubscribedAt: tester.unsubscribedAt,
        isUnsubscribed,
      },
      availability: {
        android: config.androidAvailability || 'BETA_OPEN',
        ios: config.iosAvailability || 'BETA_OPEN',
      },
      links: {
        androidWeb:
          config.playStoreWebLink ||
          'https://play.google.com/apps/testing/com.devengalere.kantomg',
        androidStore:
          config.playStoreAppLink ||
          'https://play.google.com/store/apps/details?id=com.devengalere.kantomg',
        appStore: config.appStorePublicLink || null,
        testFlight:
          config.testFlightPublicLink ||
          'https://testflight.apple.com/join/kantomg',
      },
      instructions: {
        android:
          config.instructionsAndroid ||
          '1. Cliquez sur le lien « Rejoindre le test Google Play » ci-dessous avec votre compte Google connecté.\n2. Cliquez sur « Devenir testeur ».\n3. Téléchargez ensuite Kanto MG directement depuis le Play Store.\n4. Cliquez sur « J’ai rejoint le programme » pour confirmer votre participation.',
        ios:
          config.instructionsIos ||
          '1. Installez gratuitement l’application « Apple TestFlight » depuis l’App Store.\n2. Cliquez sur « Ouvrir dans TestFlight » sur votre iPhone ou iPad.\n3. Acceptez l’invitation et installez Kanto MG.\n4. Cliquez sur « J’ai rejoint le programme » pour valider votre statut.',
      },
      latestVersion,
      steps,
      currentStepIndex,
      canDownloadAndroid: !isUnsubscribed && canDownloadAndroid,
      canDownloadIos: !isUnsubscribed && canDownloadIos,
      message: isUnsubscribed
        ? `Votre adresse ${masked} est actuellement désinscrite du programme bêta. Vous pouvez vous réinscrire à tout moment pour réactiver vos accès.`
        : `Votre participation avec l'adresse ${masked} est confirmée.`,
    };
  }

  /**
   * Renvoyer les invitations publiques pour un testeur autorisé.
   */
  async resendInvitePublic(emailInput: string) {
    const email = emailInput.trim().toLowerCase();
    const emailHashVal = hashEmail(email);
    let tester: Awaited<ReturnType<typeof this.prisma.betaTester.findFirst>> =
      null;
    try {
      tester = await this.prisma.betaTester.findFirst({
        where: {
          OR: [{ emailHash: emailHashVal }, { email }],
        },
      });
    } catch {
      tester = await this.prisma.betaTester.findFirst({
        where: { email },
      });
    }

    if (!tester) {
      return {
        success: false,
        message: 'Adresse email non reconnue parmi les testeurs enregistrés.',
      };
    }

    let sent = false;
    const hasAndroid = tester.platforms.includes('ANDROID');
    const hasIos = tester.platforms.includes('IOS');

    try {
      if (hasAndroid) {
        await this.sendAndroidInvite(tester.id);
        sent = true;
      }
      if (hasIos) {
        await this.sendIosInvite(tester.id);
        sent = true;
      }

      if (!sent) {
        const clearEmail = decryptEmail(tester.email);
        await this.emailDispatcher.sendTemplateEmail({
          to: clearEmail,
          templateCode: 'CONFIRMATION',
          variables: {
            userName: tester.fullName || 'Bêta-testeur',
            platform: tester.platforms.join(' & '),
          },
        });
      }
    } catch (mailErr: unknown) {
      const msg = mailErr instanceof Error ? mailErr.message : String(mailErr);
      this.logger.error(
        `❌ [BetaTesters] Échec envoi lors du renvoi pour ${maskEmail(tester.email)} : ${msg}`,
      );
      return {
        success: false,
        message:
          'Impossible d’expédier l’e-mail pour le moment. Veuillez vérifier votre connexion ou réessayer ultérieurement.',
      };
    }

    const masked = maskEmail(tester.email);
    return {
      success: true,
      message: `Vos liens d’accès ont été renvoyés à ${masked}. Pensez à vérifier vos spams !`,
    };
  }

  /**
   * Nombre de testeurs inscrits pour l'affichage public sur la landing.
   */
  async getPublicTesterCount(): Promise<number> {
    try {
      return await this.prisma.betaTester.count({
        where: {
          status: {
            not: TesterStatus.REJECTED,
          },
          unsubscribedAt: null,
        },
      });
    } catch {
      return 0;
    }
  }

  // ─── RETOURS & FEEDBACK TESTEURS ───────────────────────────────────────────

  /**
   * Soumission publique d'un retour ou signalement de bug.
   */
  async submitFeedback(
    dto: SubmitFeedbackDto,
    _clientIp?: string,
    _userAgent?: string,
  ) {
    const email = dto.email.trim().toLowerCase();
    const emailHashVal = hashEmail(email);
    const tester = await this.prisma.betaTester.findFirst({
      where: {
        OR: [{ emailHash: emailHashVal }, { email }],
      },
    });

    const feedback = await this.prisma.betaFeedback.create({
      data: {
        email: encryptEmail(email),
        emailHash: emailHashVal,
        testerId: tester?.id || null,
        category: dto.category,
        title: dto.title?.trim() || null,
        description: dto.description.trim(),
        platform: dto.platform,
        appVersion: dto.appVersion?.trim() || null,
        deviceInfo: dto.deviceInfo?.trim() || null,
        screenshotUrl: dto.screenshotUrl?.trim() || null,
        status: 'NEW',
        priority: dto.category === 'BUG' ? 'HIGH' : 'MEDIUM',
      },
    });

    this.logger.log(
      `💬 [BetaFeedback] Nouveau retour reçu de ${maskEmail(email)} [${dto.category}]`,
    );

    return {
      success: true,
      message:
        'Misaotra betsaka ! Votre retour a bien été transmis à l’équipe Kanto MG.',
      feedbackId: feedback.id,
    };
  }

  /**
   * Liste des retours utilisateurs pour l'administration.
   */
  async findAllFeedbacks(query: {
    category?: string;
    status?: string;
    platform?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.BetaFeedbackWhereInput = {};
    if (query.category && query.category !== 'ALL')
      where.category = query.category;
    if (query.status && query.status !== 'ALL') where.status = query.status;
    if (query.platform && query.platform !== 'ALL')
      where.platform = query.platform;
    if (query.priority && query.priority !== 'ALL')
      where.priority = query.priority;

    const [total, data, statusCounts] = await Promise.all([
      this.prisma.betaFeedback.count({ where }),
      this.prisma.betaFeedback.findMany({
        where,
        include: {
          tester: {
            select: { id: true, email: true, fullName: true, platforms: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.betaFeedback.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      counts: Object.fromEntries(
        statusCounts.map((sc) => [sc.status, sc._count.status]),
      ),
    };
  }

  /**
   * Mise à jour du statut ou des notes d'un retour.
   */
  async updateFeedback(id: string, dto: UpdateFeedbackDto) {
    const feedback = await this.prisma.betaFeedback.findUnique({
      where: { id },
    });
    if (!feedback) throw new NotFoundException('Retour introuvable.');

    const updateData: Prisma.BetaFeedbackUpdateInput = {};
    if (dto.status !== undefined) {
      updateData.status = dto.status;
      if (dto.status === 'RESOLVED' || dto.status === 'CLOSED') {
        updateData.resolvedAt = new Date();
      }
    }
    if (dto.priority !== undefined) updateData.priority = dto.priority;
    if (dto.internalNotes !== undefined)
      updateData.internalNotes = dto.internalNotes;
    if (dto.assignedTo !== undefined) updateData.assignedTo = dto.assignedTo;

    return this.prisma.betaFeedback.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Suppression d'un retour.
   */
  async deleteFeedback(id: string) {
    await this.prisma.betaFeedback.delete({ where: { id } });
    return { success: true, message: 'Retour supprimé avec succès.' };
  }

  // ─── GESTION DES GROUPES (COHORTES) ────────────────────────────────────────

  async findAllGroups() {
    return this.prisma.betaGroup.findMany({
      include: {
        _count: {
          select: { testers: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createGroup(dto: CreateBetaGroupDto) {
    if (dto.isDefault) {
      await this.prisma.betaGroup.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.betaGroup.create({
      data: {
        name: dto.name.trim(),
        description: dto.description?.trim() || null,
        color: dto.color || '#4A6741',
        targetPlatforms: dto.targetPlatforms || ['ANDROID', 'IOS'],
        isDefault: Boolean(dto.isDefault),
      },
    });
  }

  async updateGroup(id: string, dto: UpdateBetaGroupDto) {
    if (dto.isDefault) {
      await this.prisma.betaGroup.updateMany({
        where: { isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    return this.prisma.betaGroup.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description.trim() }
          : {}),
        ...(dto.color !== undefined ? { color: dto.color } : {}),
        ...(dto.targetPlatforms !== undefined
          ? { targetPlatforms: dto.targetPlatforms }
          : {}),
        ...(dto.isDefault !== undefined ? { isDefault: dto.isDefault } : {}),
      },
    });
  }

  async deleteGroup(id: string) {
    const group = await this.prisma.betaGroup.findUnique({
      where: { id },
      include: { _count: { select: { testers: true } } },
    });

    if (!group) throw new NotFoundException('Groupe introuvable.');

    if (group.isDefault) {
      throw new BadRequestException(
        'Impossible de supprimer le groupe par défaut.',
      );
    }

    const defaultGroup = await this.prisma.betaGroup.findFirst({
      where: { isDefault: true },
    });

    // Réaffectation des testeurs vers le groupe par défaut
    if (group._count.testers > 0 && defaultGroup) {
      await this.prisma.betaTester.updateMany({
        where: { groupId: id },
        data: { groupId: defaultGroup.id },
      });
    }

    await this.prisma.betaGroup.delete({ where: { id } });
    return { success: true, message: 'Groupe supprimé avec succès.' };
  }

  // ─── GESTION DES VERSIONS BÊTA ─────────────────────────────────────────────

  async findAllVersions() {
    return this.prisma.betaVersion.findMany({
      orderBy: { buildNumber: 'desc' },
    });
  }

  async createVersion(dto: CreateBetaVersionDto) {
    const version = await this.prisma.betaVersion.create({
      data: {
        version: dto.version.trim(),
        buildNumber: dto.buildNumber,
        platform: dto.platform,
        title: dto.title?.trim() || null,
        releaseNotes: dto.releaseNotes?.trim() || null,
        knownIssues: dto.knownIssues?.trim() || null,
        downloadUrl: dto.downloadUrl?.trim() || null,
        status: dto.status || 'ACTIVE',
      },
    });

    if (dto.notifyTesters) {
      this.notifyVersion(version.id).catch((err) => {
        this.logger.error(
          `Erreur notification auto version ${version.version}: ${err}`,
        );
      });
    }

    return version;
  }

  async updateVersion(id: string, dto: UpdateBetaVersionDto) {
    return this.prisma.betaVersion.update({
      where: { id },
      data: {
        ...(dto.version !== undefined ? { version: dto.version.trim() } : {}),
        ...(dto.buildNumber !== undefined
          ? { buildNumber: dto.buildNumber }
          : {}),
        ...(dto.platform !== undefined ? { platform: dto.platform } : {}),
        ...(dto.title !== undefined
          ? { title: dto.title?.trim() || null }
          : {}),
        ...(dto.releaseNotes !== undefined
          ? { releaseNotes: dto.releaseNotes?.trim() || null }
          : {}),
        ...(dto.knownIssues !== undefined
          ? { knownIssues: dto.knownIssues?.trim() || null }
          : {}),
        ...(dto.downloadUrl !== undefined
          ? { downloadUrl: dto.downloadUrl?.trim() || null }
          : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
      },
    });
  }

  async deleteVersion(id: string) {
    await this.prisma.betaVersion.delete({ where: { id } });
    return { success: true, message: 'Version supprimée avec succès.' };
  }

  /**
   * Notifie les testeurs éligibles de la disponibilité d'une nouvelle version.
   */
  async notifyVersion(versionId: string) {
    const version = await this.prisma.betaVersion.findUnique({
      where: { id: versionId },
    });

    if (!version) throw new NotFoundException('Version introuvable.');

    const where: Prisma.BetaTesterWhereInput = {
      unsubscribedAt: null,
      status: { in: [TesterStatus.APPROVED, TesterStatus.INVITED] },
    };

    if (version.platform === 'ANDROID') {
      where.platforms = { has: 'ANDROID' };
    } else if (version.platform === 'IOS') {
      where.platforms = { has: 'IOS' };
    }

    const testers = await this.prisma.betaTester.findMany({ where });

    let notifiedCount = 0;
    for (const tester of testers) {
      try {
        const clearEmail = decryptEmail(tester.email);
        await this.emailDispatcher.sendTemplateEmail({
          to: clearEmail,
          templateCode: 'NEW_VERSION',
          variables: {
            userName: tester.fullName || 'Bêta-testeur',
            appVersion: `${version.version} (build ${version.buildNumber})`,
            platform: version.platform,
            releaseNotes:
              version.releaseNotes ||
              'Corrections de bugs et optimisations de performance.',
          },
        });
        notifiedCount++;
      } catch (e) {
        this.logger.error(
          `Erreur notification version à ${tester.email}: ${e}`,
        );
      }
    }

    await this.prisma.betaVersion.update({
      where: { id: versionId },
      data: { notifiedAt: new Date() },
    });

    return {
      success: true,
      notifiedCount,
      totalTesters: testers.length,
      message: `${notifiedCount} testeur(s) notifié(s) avec succès pour la version ${version.version}.`,
    };
  }

  // ─── GESTION DES MODÈLES D'EMAILS ──────────────────────────────────────────

  async findAllTemplates() {
    return this.prisma.betaEmailTemplate.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async getTemplate(code: string) {
    const template = await this.prisma.betaEmailTemplate.findUnique({
      where: { code },
    });
    if (!template) throw new NotFoundException(`Modèle ${code} introuvable.`);
    return template;
  }

  async updateTemplate(code: string, dto: UpdateEmailTemplateDto) {
    const template = await this.prisma.betaEmailTemplate.findUnique({
      where: { code },
    });
    if (!template) throw new NotFoundException(`Modèle ${code} introuvable.`);

    return this.prisma.betaEmailTemplate.update({
      where: { code },
      data: {
        ...(dto.subject !== undefined ? { subject: dto.subject } : {}),
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.senderName !== undefined ? { senderName: dto.senderName } : {}),
        ...(dto.contentHtml !== undefined
          ? { contentHtml: dto.contentHtml }
          : {}),
        ...(dto.contentText !== undefined
          ? { contentText: dto.contentText }
          : {}),
        ...(dto.buttonText !== undefined ? { buttonText: dto.buttonText } : {}),
        ...(dto.buttonUrl !== undefined ? { buttonUrl: dto.buttonUrl } : {}),
        ...(dto.secondaryButtonText !== undefined
          ? { secondaryButtonText: dto.secondaryButtonText }
          : {}),
        ...(dto.secondaryButtonUrl !== undefined
          ? { secondaryButtonUrl: dto.secondaryButtonUrl }
          : {}),
        ...(dto.footerText !== undefined ? { footerText: dto.footerText } : {}),
        ...(dto.accentColor !== undefined
          ? { accentColor: dto.accentColor }
          : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
    });
  }

  async sendTestTemplateEmail(code: string, toEmail: string) {
    return this.emailDispatcher.sendTemplateEmail({
      to: toEmail.trim().toLowerCase(),
      templateCode: code,
      variables: {
        userName: 'Aperçu Testeur',
        platform: 'Android & iOS',
        appVersion: '0.1.0 (build 31)',
        downloadLink:
          'https://play.google.com/apps/testing/com.devengalere.kantomg',
        testFlightLink: 'https://testflight.apple.com/join/kantomg',
        androidTestingLink:
          'https://play.google.com/apps/testing/com.devengalere.kantomg',
        unsubscribeLink: 'https://app-kanto.gastsar.fr/beta?tab=unsubscribe',
      },
      bypassSuppression: true,
    });
  }

  // ─── CONFIGURATION DE L'AUTOMATISATION ─────────────────────────────────────

  private readonly defaultAutomationConfig = {
    id: 'default',
    autoConfirmRegistration: true,
    autoInviteOnApproval: false,
    autoNotifyNewVersions: true,
    reminderIntervalDays: 7,
    feedbackRequestDays: 14,
    playStoreWebLink:
      'https://play.google.com/apps/testing/com.devengalere.kantomg',
    playStoreAppLink:
      'https://play.google.com/store/apps/details?id=com.devengalere.kantomg',
    appStorePublicLink: null as string | null,
    testFlightPublicLink: 'https://testflight.apple.com/join/kantomg',
    supportEmail: 'contact@kanto.mg',
    androidAvailability: 'BETA_OPEN',
    iosAvailability: 'BETA_OPEN',
    instructionsAndroid: null as string | null,
    instructionsIos: null as string | null,
    updatedAt: new Date(),
  };

  async getAutomationConfig() {
    try {
      if (!this.prisma?.betaAutomationConfig) {
        this.logger.warn(
          'Modèle betaAutomationConfig non disponible sur le client Prisma, utilisation des paramètres par défaut.',
        );
        return { ...this.defaultAutomationConfig };
      }

      let config = await this.prisma.betaAutomationConfig.findFirst();
      if (!config) {
        try {
          config = await this.prisma.betaAutomationConfig.create({
            data: {
              autoConfirmRegistration: true,
              autoInviteOnApproval: false,
              autoNotifyNewVersions: true,
              reminderIntervalDays: 7,
              feedbackRequestDays: 14,
              playStoreWebLink:
                'https://play.google.com/apps/testing/com.devengalere.kantomg',
              playStoreAppLink:
                'https://play.google.com/store/apps/details?id=com.devengalere.kantomg',
              appStorePublicLink: null,
              testFlightPublicLink: 'https://testflight.apple.com/join/kantomg',
              supportEmail: 'contact@kanto.mg',
              androidAvailability: 'BETA_OPEN',
              iosAvailability: 'BETA_OPEN',
              instructionsAndroid: null,
              instructionsIos: null,
            },
          });
        } catch (createErr) {
          this.logger.warn(
            `Impossible d'initialiser la table betaAutomationConfig : ${createErr instanceof Error ? createErr.message : String(createErr)}`,
          );
          return { ...this.defaultAutomationConfig };
        }
      }
      return config;
    } catch (err) {
      this.logger.warn(
        `Erreur lecture betaAutomationConfig : ${err instanceof Error ? err.message : String(err)}, repli sur configuration standard.`,
      );
      return { ...this.defaultAutomationConfig };
    }
  }

  async updateAutomationConfig(dto: UpdateAutomationConfigDto) {
    if (!this.prisma?.betaAutomationConfig) {
      throw new BadRequestException(
        "Le modèle d'automatisation n'est pas encore accessible en base de données.",
      );
    }

    try {
      const config = await this.getAutomationConfig();
      if (!config || config.id === 'default') {
        return await this.prisma.betaAutomationConfig.create({
          data: {
            autoConfirmRegistration: dto.autoConfirmRegistration ?? true,
            autoInviteOnApproval: dto.autoInviteOnApproval ?? false,
            autoNotifyNewVersions: dto.autoNotifyNewVersions ?? true,
            reminderIntervalDays: dto.reminderIntervalDays ?? 7,
            feedbackRequestDays: dto.feedbackRequestDays ?? 14,
            playStoreWebLink:
              dto.playStoreWebLink ??
              'https://play.google.com/apps/testing/com.devengalere.kantomg',
            playStoreAppLink:
              dto.playStoreAppLink ??
              'https://play.google.com/store/apps/details?id=com.devengalere.kantomg',
            appStorePublicLink: dto.appStorePublicLink ?? null,
            testFlightPublicLink: dto.testFlightPublicLink ?? null,
            supportEmail: dto.supportEmail ?? 'contact@kanto.mg',
            androidAvailability: dto.androidAvailability ?? 'BETA_OPEN',
            iosAvailability: dto.iosAvailability ?? 'BETA_OPEN',
            instructionsAndroid: dto.instructionsAndroid ?? null,
            instructionsIos: dto.instructionsIos ?? null,
          },
        });
      }

      return await this.prisma.betaAutomationConfig.update({
        where: { id: config.id },
        data: dto,
      });
    } catch (err) {
      this.logger.error(
        `Échec de mise à jour de la configuration d'automatisation : ${err instanceof Error ? err.message : String(err)}`,
      );
      throw new BadRequestException(
        "Impossible de sauvegarder la configuration d'automatisation.",
      );
    }
  }

  // ─── GESTION DES PARTICIPANTS (ADMINISTRATION) ─────────────────────────────

  async findAll(query: {
    search?: string;
    platform?: 'ANDROID' | 'IOS' | 'ALL';
    status?: string;
    confirmationStatus?: string;
    androidStatus?: string;
    iosStatus?: string;
    groupId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.BetaTesterWhereInput = {};

    if (query.status && query.status !== 'ALL') {
      where.status = query.status as TesterStatus;
    }

    if (query.confirmationStatus && query.confirmationStatus !== 'ALL') {
      if (query.confirmationStatus === 'CONFIRME') {
        where.OR = [
          { confirmationStatus: 'CONFIRME' },
          { confirmedAt: { not: null } },
        ];
      } else if (query.confirmationStatus === 'INSTALLE') {
        where.OR = [
          { confirmationStatus: 'INSTALLE' },
          { installedAt: { not: null } },
        ];
      } else if (query.confirmationStatus === 'VERIFIE') {
        where.OR = [
          { confirmationStatus: 'VERIFIE' },
          { verifiedAt: { not: null } },
        ];
      } else if (query.confirmationStatus === 'INACTIF') {
        where.OR = [
          { status: TesterStatus.REJECTED },
          { unsubscribedAt: { not: null } },
        ];
      } else {
        where.confirmationStatus = query.confirmationStatus;
      }
    }

    if (query.androidStatus && query.androidStatus !== 'ALL') {
      where.androidStatus = query.androidStatus;
    }

    if (query.iosStatus && query.iosStatus !== 'ALL') {
      where.iosStatus = query.iosStatus;
    }

    if (query.groupId && query.groupId !== 'ALL') {
      where.groupId = query.groupId;
    }

    if (query.platform === 'ANDROID') {
      where.platforms = { has: 'ANDROID' };
    } else if (query.platform === 'IOS') {
      where.platforms = { has: 'IOS' };
    }

    if (query.search?.trim()) {
      const term = query.search.trim();
      const isEmail = term.includes('@');
      where.OR = [
        ...(isEmail ? [{ emailHash: hashEmail(term) }] : []),
        { email: { contains: term, mode: 'insensitive' } },
        { fullName: { contains: term, mode: 'insensitive' } },
        { notes: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [total, data, stats] = await Promise.all([
      this.prisma.betaTester.count({ where }),
      this.prisma.betaTester.findMany({
        where,
        include: {
          group: true,
          _count: { select: { feedbacks: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.getStats(),
    ]);

    const sanitizedData = data.map((t) => {
      const clear = decryptEmail(t.email);
      const masked = maskEmail(clear);
      return {
        ...t,
        email: masked, // Masquage par défaut dans les listes administratives
        maskedEmail: masked,
        confirmationStatus: this.resolveConfirmationStatus(t),
      };
    });

    return {
      data: sanitizedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      stats,
    };
  }

  async getStats() {
    const [
      total,
      androidCount,
      iosCount,
      bothPlatformsCount,
      pendingCount,
      invitedCount,
      activeCount,
      unsubscribedCount,
      feedbacksCount,
      confirmedCount,
      installedCount,
      verifiedCount,
    ] = await Promise.all([
      this.prisma.betaTester.count({ where: { unsubscribedAt: null } }),
      this.prisma.betaTester.count({
        where: { platforms: { has: 'ANDROID' }, unsubscribedAt: null },
      }),
      this.prisma.betaTester.count({
        where: { platforms: { has: 'IOS' }, unsubscribedAt: null },
      }),
      this.prisma.betaTester.count({
        where: {
          platforms: { hasEvery: ['ANDROID', 'IOS'] },
          unsubscribedAt: null,
        },
      }),
      this.prisma.betaTester.count({
        where: {
          status: TesterStatus.PENDING,
          unsubscribedAt: null,
        },
      }),
      this.prisma.betaTester.count({
        where: {
          OR: [
            { androidStatus: 'INVITED' },
            { iosStatus: 'INVITED' },
            { status: TesterStatus.INVITED },
          ],
          unsubscribedAt: null,
        },
      }),
      this.prisma.betaTester.count({
        where: {
          OR: [{ androidStatus: 'ACTIVE' }, { iosStatus: 'ACTIVE' }],
          unsubscribedAt: null,
        },
      }),
      this.prisma.betaTester.count({
        where: { unsubscribedAt: { not: null } },
      }),
      this.prisma.betaFeedback.count(),
      this.prisma.betaTester.count({
        where: {
          OR: [
            { confirmationStatus: 'CONFIRME' },
            { confirmedAt: { not: null } },
          ],
          unsubscribedAt: null,
        },
      }),
      this.prisma.betaTester.count({
        where: {
          OR: [
            { confirmationStatus: 'INSTALLE' },
            { installedAt: { not: null } },
          ],
          unsubscribedAt: null,
        },
      }),
      this.prisma.betaTester.count({
        where: {
          OR: [
            { confirmationStatus: 'VERIFIE' },
            { verifiedAt: { not: null } },
          ],
          unsubscribedAt: null,
        },
      }),
    ]);

    return {
      total,
      androidCount,
      iosCount,
      bothPlatformsCount,
      pendingCount,
      invitedCount,
      activeCount,
      unsubscribedCount,
      feedbacksCount,
      confirmedCount,
      installedCount,
      verifiedCount,
    };
  }

  async findOne(
    id: string,
    adminUser?: { id: string; name?: string },
    clientIp?: string,
  ) {
    const tester = await this.prisma.betaTester.findUnique({
      where: { id },
      include: {
        group: true,
        feedbacks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!tester) {
      throw new NotFoundException(
        `Testeur introuvable avec l'identifiant ${id}`,
      );
    }

    const clearEmail = decryptEmail(tester.email);
    const masked = maskEmail(clearEmail);

    await this.audit({
      userId: adminUser?.id,
      userName: adminUser?.name,
      action: 'BETA_TESTER_VIEW_DETAIL',
      targetType: 'BETA_TESTER',
      targetId: id,
      targetLabel: masked,
      ipAddress: clientIp,
    });

    return {
      ...tester,
      email: clearEmail,
      maskedEmail: masked,
    };
  }

  /**
   * Révèle l'adresse e-mail complète d'un participant avec traçabilité d'audit stricte.
   */
  async revealEmail(
    id: string,
    adminUser?: { id: string; name?: string },
    clientIp?: string,
  ) {
    const tester = await this.prisma.betaTester.findUnique({
      where: { id },
    });

    if (!tester) {
      throw new NotFoundException(`Testeur introuvable (${id})`);
    }

    const clearEmail = decryptEmail(tester.email);
    const masked = maskEmail(clearEmail);

    await this.audit({
      userId: adminUser?.id,
      userName: adminUser?.name,
      action: 'BETA_TESTER_REVEAL_EMAIL',
      targetType: 'BETA_TESTER',
      targetId: id,
      targetLabel: masked,
      ipAddress: clientIp,
      details: {
        testerId: id,
        platforms: tester.platforms,
      },
    });

    return {
      success: true,
      id: tester.id,
      email: clearEmail,
      maskedEmail: masked,
    };
  }

  async sendAndroidInvite(id: string) {
    const tester = await this.prisma.betaTester.findUnique({ where: { id } });
    if (!tester) throw new NotFoundException('Testeur introuvable.');

    const config = await this.prisma.betaAutomationConfig.findFirst();
    const playStoreWebLink =
      config?.playStoreWebLink ||
      'https://play.google.com/apps/testing/com.devengalere.kantomg';
    const playStoreAppLink =
      config?.playStoreAppLink ||
      'https://play.google.com/store/apps/details?id=com.devengalere.kantomg';

    const clearEmail = decryptEmail(tester.email);
    await this.emailDispatcher.sendTemplateEmail({
      to: clearEmail,
      templateCode: 'INVITE_ANDROID',
      variables: {
        userName: tester.fullName || 'Bêta-testeur',
        androidTestingLink: playStoreWebLink,
        downloadLink: playStoreAppLink,
      },
    });

    return this.prisma.betaTester.update({
      where: { id },
      data: {
        status: TesterStatus.INVITED,
        androidStatus: 'INVITED',
        androidInvitedAt: new Date(),
        androidInviteCount: { increment: 1 },
        playLinkSent: playStoreWebLink,
        lastContactedAt: new Date(),
      },
    });
  }

  async sendIosInvite(id: string) {
    const tester = await this.prisma.betaTester.findUnique({ where: { id } });
    if (!tester) throw new NotFoundException('Testeur introuvable.');

    const config = await this.prisma.betaAutomationConfig.findFirst();
    const testFlightLink =
      config?.testFlightPublicLink ||
      'https://testflight.apple.com/join/kantomg';

    const clearEmail = decryptEmail(tester.email);
    await this.emailDispatcher.sendTemplateEmail({
      to: clearEmail,
      templateCode: 'INVITE_IOS',
      variables: {
        userName: tester.fullName || 'Bêta-testeur',
        testFlightLink,
      },
    });

    return this.prisma.betaTester.update({
      where: { id },
      data: {
        status: TesterStatus.INVITED,
        iosStatus: 'INVITED',
        iosInvitedAt: new Date(),
        iosInviteCount: { increment: 1 },
        testFlightLinkSent: testFlightLink,
        lastContactedAt: new Date(),
      },
    });
  }

  async bulkAction(dto: BulkActionDto) {
    const testers = await this.prisma.betaTester.findMany({
      where: { id: { in: dto.testerIds } },
    });

    let successCount = 0;
    let failedCount = 0;

    for (const tester of testers) {
      try {
        switch (dto.action) {
          case 'INVITE_ANDROID':
            if (tester.platforms.includes('ANDROID')) {
              await this.sendAndroidInvite(tester.id);
              successCount++;
            }
            break;

          case 'INVITE_IOS':
            if (tester.platforms.includes('IOS')) {
              await this.sendIosInvite(tester.id);
              successCount++;
            }
            break;

          case 'INVITE_BOTH':
            if (tester.platforms.includes('ANDROID')) {
              await this.sendAndroidInvite(tester.id);
            }
            if (tester.platforms.includes('IOS')) {
              await this.sendIosInvite(tester.id);
            }
            successCount++;
            break;

          case 'ASSIGN_GROUP':
            if (dto.targetGroupId) {
              await this.prisma.betaTester.update({
                where: { id: tester.id },
                data: { groupId: dto.targetGroupId },
              });
              successCount++;
            }
            break;

          case 'CHANGE_STATUS':
            if (dto.targetStatus) {
              await this.prisma.betaTester.update({
                where: { id: tester.id },
                data: { status: dto.targetStatus as TesterStatus },
              });
              successCount++;
            }
            break;

          case 'DELETE':
            await this.prisma.betaTester.delete({ where: { id: tester.id } });
            successCount++;
            break;
        }
      } catch (e) {
        failedCount++;
        this.logger.error(`Erreur action groupée sur ${tester.email}: ${e}`);
      }
    }

    return {
      success: true,
      successCount,
      failedCount,
      total: testers.length,
      message: `${successCount} participant(s) traité(s) avec succès${failedCount > 0 ? ` (${failedCount} échecs)` : ''}.`,
    };
  }

  async exportCsv(
    query: { platform?: string; status?: string },
    adminUser?: { id: string; name?: string },
    clientIp?: string,
  ) {
    const where: Prisma.BetaTesterWhereInput = {};
    if (query.platform === 'ANDROID') where.platforms = { has: 'ANDROID' };
    if (query.platform === 'IOS') where.platforms = { has: 'IOS' };
    if (query.status && query.status !== 'ALL')
      where.status = query.status as TesterStatus;

    const testers = await this.prisma.betaTester.findMany({
      where,
      include: { group: true },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      sanitizeCsvCell('ID'),
      sanitizeCsvCell('Email'),
      sanitizeCsvCell('Nom'),
      sanitizeCsvCell('Plateformes'),
      sanitizeCsvCell('Statut Général'),
      sanitizeCsvCell('Statut Android'),
      sanitizeCsvCell('Statut iOS'),
      sanitizeCsvCell('Groupe'),
      sanitizeCsvCell('Date Inscription'),
      sanitizeCsvCell('Dernier Contact'),
    ];

    const rows = testers.map((t) => {
      const clear = decryptEmail(t.email);
      return [
        sanitizeCsvCell(t.id),
        sanitizeCsvCell(clear),
        sanitizeCsvCell(t.fullName || ''),
        sanitizeCsvCell(t.platforms.join(', ')),
        sanitizeCsvCell(t.status),
        sanitizeCsvCell(t.androidStatus),
        sanitizeCsvCell(t.iosStatus),
        sanitizeCsvCell(t.group?.name || ''),
        sanitizeCsvCell(t.createdAt.toISOString()),
        sanitizeCsvCell(
          t.lastContactedAt ? t.lastContactedAt.toISOString() : '',
        ),
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.join(',')),
    ].join('\n');

    await this.audit({
      userId: adminUser?.id,
      userName: adminUser?.name,
      action: 'BETA_EXPORT_CSV',
      targetType: 'BETA_TESTER',
      targetId: 'ALL',
      targetLabel: `Export de ${testers.length} testeurs`,
      ipAddress: clientIp,
      details: {
        count: testers.length,
        filterPlatform: query.platform || 'ALL',
        filterStatus: query.status || 'ALL',
      },
    });

    return {
      count: testers.length,
      csv: csvContent,
      emailsOnly: testers.map((t) => decryptEmail(t.email)).join(', '),
    };
  }

  async exportEmails(
    status?: TesterStatus,
    adminUser?: { id: string; name?: string },
    clientIp?: string,
  ) {
    const where: Prisma.BetaTesterWhereInput = { unsubscribedAt: null };
    if (status) where.status = status;

    const testers = await this.prisma.betaTester.findMany({
      where,
      select: { id: true, email: true },
      orderBy: { createdAt: 'asc' },
    });

    const decrypted = testers.map((t) => decryptEmail(t.email));

    await this.audit({
      userId: adminUser?.id,
      userName: adminUser?.name,
      action: 'BETA_EXPORT_EMAILS',
      targetType: 'BETA_TESTER',
      targetId: 'ALL',
      targetLabel: `Export de ${testers.length} emails`,
      ipAddress: clientIp,
      details: { count: testers.length, filterStatus: status || 'ALL' },
    });

    return {
      count: testers.length,
      emails: decrypted,
      csvFormat: decrypted.map((e) => sanitizeCsvCell(e)).join(',\n'),
    };
  }

  async update(id: string, data: Prisma.BetaTesterUpdateInput) {
    return this.prisma.betaTester.update({
      where: { id },
      data,
    });
  }

  async updateStatus(
    id: string,
    dto: { status?: TesterStatus; confirmationStatus?: string; notes?: string },
  ) {
    const updateData: Prisma.BetaTesterUpdateInput = {
      ...(dto.status ? { status: dto.status } : {}),
      ...(dto.confirmationStatus
        ? { confirmationStatus: dto.confirmationStatus }
        : {}),
      ...(dto.notes ? { notes: dto.notes } : {}),
    };

    if (dto.confirmationStatus === 'VERIFIE') {
      updateData.verifiedAt = new Date();
    } else if (dto.confirmationStatus === 'CONFIRME') {
      updateData.confirmedAt = new Date();
    } else if (dto.confirmationStatus === 'INSTALLE') {
      updateData.installedAt = new Date();
    }

    if (dto.status === TesterStatus.APPROVED) {
      const config = await this.prisma.betaAutomationConfig.findFirst();
      if (config?.autoInviteOnApproval) {
        // Envoi auto d'invitation selon plateformes
        const tester = await this.prisma.betaTester.findUnique({
          where: { id },
        });
        if (tester?.platforms.includes('ANDROID')) {
          await this.sendAndroidInvite(id);
        }
        if (tester?.platforms.includes('IOS')) {
          await this.sendIosInvite(id);
        }
      }
    }

    return this.prisma.betaTester.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(
    id: string,
    adminUser?: { id: string; name?: string },
    clientIp?: string,
  ) {
    const tester = await this.prisma.betaTester.findUnique({ where: { id } });
    if (!tester) throw new NotFoundException('Testeur introuvable.');

    await this.audit({
      userId: adminUser?.id,
      userName: adminUser?.name,
      action: 'BETA_TESTER_DELETED',
      targetType: 'BETA_TESTER',
      targetId: id,
      targetLabel: maskEmail(tester.email),
      ipAddress: clientIp,
      details: { platforms: tester.platforms, status: tester.status },
    });

    await this.prisma.betaTester.delete({ where: { id } });
    return { success: true, message: 'Testeur supprimé avec succès.' };
  }
}
