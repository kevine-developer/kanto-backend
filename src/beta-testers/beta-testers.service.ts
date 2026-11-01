import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { BetaEmailDispatcherService } from './services/beta-email-dispatcher.service.js';
import {
  RegisterBetaTesterDto,
  UpdatePlatformsDto,
  UnsubscribeBetaDto,
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

@Injectable()
export class BetaTestersService {
  private readonly logger = new Logger(BetaTestersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailDispatcher: BetaEmailDispatcherService,
  ) {}

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
      this.logger.warn(`🤖 [BetaTesters] Honeypot déclenché par IP ${clientIp}`);
      return {
        success: true,
        message: 'Candidature enregistrée avec succès.',
      };
    }

    if (dto.termsAccepted === false) {
      throw new BadRequestException('Vous devez accepter les conditions de participation.');
    }

    const email = dto.email.trim().toLowerCase();
    const platforms = Array.isArray(dto.platforms) && dto.platforms.length > 0
      ? Array.from(new Set(dto.platforms))
      : ['ANDROID'];

    // 2. Vérification d'une inscription existante
    const existing = await this.prisma.betaTester.findUnique({
      where: { email },
      include: { group: true },
    });

    if (existing) {
      this.logger.log(`ℹ️ [BetaTesters] Inscription existante trouvée pour : ${email}`);
      return {
        success: false,
        alreadyRegistered: true,
        code: 'EMAIL_ALREADY_REGISTERED',
        message: 'Cette adresse e-mail est déjà inscrite au programme bêta.',
        tester: {
          id: existing.id,
          email: existing.email,
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
    const initialStatus = config?.autoInviteOnApproval ? TesterStatus.APPROVED : TesterStatus.PENDING;

    const unsubscribeToken = randomUUID();

    try {
      const tester = await this.prisma.betaTester.create({
        data: {
          email,
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

      this.logger.log(
        `🎉 [BetaTesters] Nouveau testeur enregistré : ${email} [${platforms.join(', ')}]`,
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
              unsubscribeLink: `https://app-kanto.gastsar.fr/beta?tab=unsubscribe&email=${encodeURIComponent(email)}&token=${unsubscribeToken}`,
            },
          });
        } catch (emailErr: unknown) {
          const msg = emailErr instanceof Error ? emailErr.message : String(emailErr);
          this.logger.error(`❌ [BetaTesters] Échec envoi confirmation à ${email} : ${msg}`);
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
    const tester = await this.prisma.betaTester.findUnique({
      where: { email },
    });

    if (!tester) {
      throw new NotFoundException('Aucune inscription trouvée avec cette adresse email.');
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
      `🔄 [BetaTesters] Plateformes mises à jour pour ${email} : [${newPlatforms.join(', ')}]`,
    );

    return {
      success: true,
      message: 'Vos plateformes de test ont été mises à jour avec succès.',
      tester: updated,
    };
  }

  /**
   * Désinscription du programme bêta (RGPD).
   */
  async unsubscribe(dto: UnsubscribeBetaDto) {
    const email = dto.email.trim().toLowerCase();
    const tester = await this.prisma.betaTester.findUnique({
      where: { email },
    });

    if (!tester) {
      return {
        success: false,
        message: 'Adresse email introuvable parmi les testeurs inscrits.',
      };
    }

    // Si un token est passé, vérifier qu'il concorde
    if (dto.token && tester.unsubscribeToken && tester.unsubscribeToken !== dto.token) {
      throw new BadRequestException('Jeton de désinscription invalide.');
    }

    await this.prisma.betaTester.update({
      where: { id: tester.id },
      data: {
        status: TesterStatus.REJECTED,
        androidStatus: 'REJECTED',
        iosStatus: 'REJECTED',
        unsubscribedAt: new Date(),
        unsubscribeReason: dto.reason?.trim() || 'Demande directe de l’utilisateur',
      },
    });

    this.logger.log(`👋 [BetaTesters] Désinscription effectuée pour ${email}`);

    return {
      success: true,
      message: 'Vous avez été désinscrit avec succès du programme de bêta-test Kanto MG.',
    };
  }

  /**
   * Vérification publique du statut d'un testeur.
   */
  async verifyParticipation(emailInput: string) {
    const email = emailInput.trim().toLowerCase();
    const tester = await this.prisma.betaTester.findUnique({
      where: { email },
      include: { group: true },
    });

    if (!tester) {
      return {
        success: false,
        exists: false,
        message:
          'Aucune candidature trouvée avec cette adresse e-mail. Inscrivez-vous ci-dessus pour rejoindre la communauté des testeurs !',
      };
    }

    const config = await this.prisma.betaAutomationConfig.findFirst();

    const hasAndroid = tester.platforms.includes('ANDROID');
    const hasIos = tester.platforms.includes('IOS');

    const canDownloadAndroid =
      hasAndroid &&
      (tester.androidStatus === 'INVITED' ||
        tester.androidStatus === 'ACCEPTED' ||
        tester.androidStatus === 'ACTIVE' ||
        tester.status === TesterStatus.INVITED ||
        tester.status === TesterStatus.APPROVED);

    const canDownloadIos =
      hasIos &&
      (tester.iosStatus === 'INVITED' ||
        tester.iosStatus === 'ACCEPTED' ||
        tester.iosStatus === 'ACTIVE');

    return {
      success: true,
      exists: true,
      tester: {
        id: tester.id,
        email: tester.email,
        fullName: tester.fullName,
        platforms: tester.platforms,
        status: tester.status,
        androidStatus: tester.androidStatus,
        iosStatus: tester.iosStatus,
        groupName: tester.group?.name || null,
        createdAt: tester.createdAt,
        androidInvitedAt: tester.androidInvitedAt || tester.invitedAt,
        iosInvitedAt: tester.iosInvitedAt,
      },
      links: {
        androidWeb: config?.playStoreWebLink || 'https://play.google.com/apps/testing/com.devengalere.kantomg',
        androidStore: config?.playStoreAppLink || 'https://play.google.com/store/apps/details?id=com.devengalere.kantomg',
        testFlight: config?.testFlightPublicLink || 'https://testflight.apple.com/join/kantomg',
      },
      canDownloadAndroid,
      canDownloadIos,
      message: `Votre participation avec l'adresse ${tester.email} est confirmée.`,
    };
  }

  /**
   * Renvoyer les invitations publiques pour un testeur autorisé.
   */
  async resendInvitePublic(emailInput: string) {
    const email = emailInput.trim().toLowerCase();
    const tester = await this.prisma.betaTester.findUnique({
      where: { email },
    });

    if (!tester) {
      return {
        success: false,
        message: 'Adresse email non reconnue parmi les testeurs enregistrés.',
      };
    }

    let sent = false;
    const hasAndroid = tester.platforms.includes('ANDROID');
    const hasIos = tester.platforms.includes('IOS');

    if (hasAndroid) {
      await this.sendAndroidInvite(tester.id);
      sent = true;
    }
    if (hasIos) {
      await this.sendIosInvite(tester.id);
      sent = true;
    }

    if (!sent) {
      await this.emailDispatcher.sendTemplateEmail({
        to: tester.email,
        templateCode: 'CONFIRMATION',
        variables: {
          userName: tester.fullName || 'Bêta-testeur',
          platform: tester.platforms.join(' & '),
        },
      });
    }

    return {
      success: true,
      message: `Vos liens d’accès ont été renvoyés à ${tester.email}. Pensez à vérifier vos spams !`,
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
    const tester = await this.prisma.betaTester.findUnique({
      where: { email },
    });

    const feedback = await this.prisma.betaFeedback.create({
      data: {
        email,
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

    this.logger.log(`💬 [BetaFeedback] Nouveau retour reçu de ${email} [${dto.category}]`);

    return {
      success: true,
      message: 'Misaotra betsaka ! Votre retour a bien été transmis à l’équipe Kanto MG.',
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
    if (query.category && query.category !== 'ALL') where.category = query.category;
    if (query.status && query.status !== 'ALL') where.status = query.status;
    if (query.platform && query.platform !== 'ALL') where.platform = query.platform;
    if (query.priority && query.priority !== 'ALL') where.priority = query.priority;

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
      counts: Object.fromEntries(statusCounts.map((sc) => [sc.status, sc._count.status])),
    };
  }

  /**
   * Mise à jour du statut ou des notes d'un retour.
   */
  async updateFeedback(id: string, dto: UpdateFeedbackDto) {
    const feedback = await this.prisma.betaFeedback.findUnique({ where: { id } });
    if (!feedback) throw new NotFoundException('Retour introuvable.');

    const updateData: Prisma.BetaFeedbackUpdateInput = {};
    if (dto.status !== undefined) {
      updateData.status = dto.status;
      if (dto.status === 'RESOLVED' || dto.status === 'CLOSED') {
        updateData.resolvedAt = new Date();
      }
    }
    if (dto.priority !== undefined) updateData.priority = dto.priority;
    if (dto.internalNotes !== undefined) updateData.internalNotes = dto.internalNotes;
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
        ...(dto.description !== undefined ? { description: dto.description.trim() } : {}),
        ...(dto.color !== undefined ? { color: dto.color } : {}),
        ...(dto.targetPlatforms !== undefined ? { targetPlatforms: dto.targetPlatforms } : {}),
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
      throw new BadRequestException('Impossible de supprimer le groupe par défaut.');
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
        this.logger.error(`Erreur notification auto version ${version.version}: ${err}`);
      });
    }

    return version;
  }

  async updateVersion(id: string, dto: UpdateBetaVersionDto) {
    return this.prisma.betaVersion.update({
      where: { id },
      data: {
        ...(dto.version !== undefined ? { version: dto.version.trim() } : {}),
        ...(dto.buildNumber !== undefined ? { buildNumber: dto.buildNumber } : {}),
        ...(dto.platform !== undefined ? { platform: dto.platform } : {}),
        ...(dto.title !== undefined ? { title: dto.title?.trim() || null } : {}),
        ...(dto.releaseNotes !== undefined ? { releaseNotes: dto.releaseNotes?.trim() || null } : {}),
        ...(dto.knownIssues !== undefined ? { knownIssues: dto.knownIssues?.trim() || null } : {}),
        ...(dto.downloadUrl !== undefined ? { downloadUrl: dto.downloadUrl?.trim() || null } : {}),
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
        await this.emailDispatcher.sendTemplateEmail({
          to: tester.email,
          templateCode: 'NEW_VERSION',
          variables: {
            userName: tester.fullName || 'Bêta-testeur',
            appVersion: `${version.version} (build ${version.buildNumber})`,
            platform: version.platform,
            releaseNotes: version.releaseNotes || 'Corrections de bugs et optimisations de performance.',
          },
        });
        notifiedCount++;
      } catch (e) {
        this.logger.error(`Erreur notification version à ${tester.email}: ${e}`);
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
        ...(dto.contentHtml !== undefined ? { contentHtml: dto.contentHtml } : {}),
        ...(dto.contentText !== undefined ? { contentText: dto.contentText } : {}),
        ...(dto.buttonText !== undefined ? { buttonText: dto.buttonText } : {}),
        ...(dto.buttonUrl !== undefined ? { buttonUrl: dto.buttonUrl } : {}),
        ...(dto.secondaryButtonText !== undefined ? { secondaryButtonText: dto.secondaryButtonText } : {}),
        ...(dto.secondaryButtonUrl !== undefined ? { secondaryButtonUrl: dto.secondaryButtonUrl } : {}),
        ...(dto.footerText !== undefined ? { footerText: dto.footerText } : {}),
        ...(dto.accentColor !== undefined ? { accentColor: dto.accentColor } : {}),
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
        downloadLink: 'https://play.google.com/apps/testing/com.devengalere.kantomg',
        testFlightLink: 'https://testflight.apple.com/join/kantomg',
        androidTestingLink: 'https://play.google.com/apps/testing/com.devengalere.kantomg',
        unsubscribeLink: 'https://app-kanto.gastsar.fr/beta?tab=unsubscribe',
      },
      bypassSuppression: true,
    });
  }

  // ─── CONFIGURATION DE L'AUTOMATISATION ─────────────────────────────────────

  async getAutomationConfig() {
    let config = await this.prisma.betaAutomationConfig.findFirst();
    if (!config) {
      config = await this.prisma.betaAutomationConfig.create({
        data: {
          autoConfirmRegistration: true,
          autoInviteOnApproval: false,
          autoNotifyNewVersions: true,
          reminderIntervalDays: 7,
          feedbackRequestDays: 5,
          playStoreWebLink: 'https://play.google.com/apps/testing/com.devengalere.kantomg',
          playStoreAppLink: 'https://play.google.com/store/apps/details?id=com.devengalere.kantomg',
          testFlightPublicLink: 'https://testflight.apple.com/join/kantomg',
          supportEmail: 'contact@kanto.mg',
        },
      });
    }
    return config;
  }

  async updateAutomationConfig(dto: UpdateAutomationConfigDto) {
    const config = await this.getAutomationConfig();
    return this.prisma.betaAutomationConfig.update({
      where: { id: config.id },
      data: dto,
    });
  }

  // ─── GESTION DES PARTICIPANTS (ADMINISTRATION) ─────────────────────────────

  async findAll(query: {
    search?: string;
    platform?: 'ANDROID' | 'IOS' | 'ALL';
    status?: string;
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
      where.OR = [
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

    return {
      data,
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
          OR: [
            { androidStatus: 'ACTIVE' },
            { iosStatus: 'ACTIVE' },
          ],
          unsubscribedAt: null,
        },
      }),
      this.prisma.betaTester.count({
        where: { unsubscribedAt: { not: null } },
      }),
      this.prisma.betaFeedback.count(),
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
    };
  }

  async findOne(id: string) {
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
      throw new NotFoundException(`Testeur introuvable avec l'identifiant ${id}`);
    }

    return tester;
  }

  async sendAndroidInvite(id: string) {
    const tester = await this.prisma.betaTester.findUnique({ where: { id } });
    if (!tester) throw new NotFoundException('Testeur introuvable.');

    const config = await this.prisma.betaAutomationConfig.findFirst();
    const playStoreWebLink = config?.playStoreWebLink || 'https://play.google.com/apps/testing/com.devengalere.kantomg';
    const playStoreAppLink = config?.playStoreAppLink || 'https://play.google.com/store/apps/details?id=com.devengalere.kantomg';

    await this.emailDispatcher.sendTemplateEmail({
      to: tester.email,
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
    const testFlightLink = config?.testFlightPublicLink || 'https://testflight.apple.com/join/kantomg';

    await this.emailDispatcher.sendTemplateEmail({
      to: tester.email,
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

  async exportCsv(query: { platform?: string; status?: string }) {
    const where: Prisma.BetaTesterWhereInput = {};
    if (query.platform === 'ANDROID') where.platforms = { has: 'ANDROID' };
    if (query.platform === 'IOS') where.platforms = { has: 'IOS' };
    if (query.status && query.status !== 'ALL') where.status = query.status as TesterStatus;

    const testers = await this.prisma.betaTester.findMany({
      where,
      include: { group: true },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'ID',
      'Email',
      'Nom',
      'Plateformes',
      'Statut Général',
      'Statut Android',
      'Statut iOS',
      'Groupe',
      'Date Inscription',
      'Dernier Contact',
    ];

    const rows = testers.map((t) => [
      t.id,
      t.email,
      t.fullName ? `"${t.fullName.replace(/"/g, '""')}"` : '',
      `"${t.platforms.join(', ')}"`,
      t.status,
      t.androidStatus,
      t.iosStatus,
      t.group?.name ? `"${t.group.name}"` : '',
      t.createdAt.toISOString(),
      t.lastContactedAt ? t.lastContactedAt.toISOString() : '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return {
      count: testers.length,
      csv: csvContent,
      emailsOnly: testers.map((t) => t.email).join(', '),
    };
  }

  async exportEmails(status?: TesterStatus) {
    const where: Prisma.BetaTesterWhereInput = { unsubscribedAt: null };
    if (status) where.status = status;

    const testers = await this.prisma.betaTester.findMany({
      where,
      select: { email: true },
      orderBy: { createdAt: 'asc' },
    });

    return {
      count: testers.length,
      emails: testers.map((t) => t.email),
      csvFormat: testers.map((t) => t.email).join(',\n'),
    };
  }

  async update(id: string, data: Prisma.BetaTesterUpdateInput) {
    return this.prisma.betaTester.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, dto: { status: TesterStatus; notes?: string }) {
    const updateData: Prisma.BetaTesterUpdateInput = {
      status: dto.status,
      ...(dto.notes ? { notes: dto.notes } : {}),
    };

    if (dto.status === TesterStatus.APPROVED) {
      const config = await this.prisma.betaAutomationConfig.findFirst();
      if (config?.autoInviteOnApproval) {
        // Envoi auto d'invitation selon plateformes
        const tester = await this.prisma.betaTester.findUnique({ where: { id } });
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

  async remove(id: string) {
    await this.prisma.betaTester.delete({ where: { id } });
    return { success: true, message: 'Testeur supprimé avec succès.' };
  }
}
