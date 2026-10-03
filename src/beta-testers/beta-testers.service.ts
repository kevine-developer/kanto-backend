import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ResendService } from '../integrations/resend/resend.service.js';
import {
  RegisterBetaTesterDto,
  UpdateTesterStatusDto,
  SendPlayInviteDto,
  BulkInviteDto,
} from './dto/beta-tester.dto.js';
import { TesterStatus, Prisma } from '../../generated/prisma/client.js';

const DEFAULT_PLAY_WEB_LINK =
  'https://play.google.com/apps/testing/com.devengalere.kantomg';
const DEFAULT_PLAY_APP_LINK =
  'https://play.google.com/store/apps/details?id=com.devengalere.kantomg';

@Injectable()
export class BetaTestersService {
  private readonly logger = new Logger(BetaTestersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly resendService: ResendService,
  ) {}

  /**
   * Enregistre une candidature publique de testeur.
   */
  async register(
    dto: RegisterBetaTesterDto,
    clientIp?: string,
    userAgent?: string,
  ) {
    // Protection anti-bot Honeypot
    if (dto.website && dto.website.trim() !== '') {
      this.logger.warn(
        `🤖 [BetaTesters] Honeypot déclenché par IP ${clientIp}`,
      );
      return {
        success: true,
        message: 'Candidature enregistrée avec succès.',
      };
    }

    const email = dto.email.trim().toLowerCase();

    // Vérifier si l'utilisateur est déjà inscrit
    const existing = await this.prisma.betaTester.findUnique({
      where: { email },
    });

    if (existing) {
      // Déjà inscrit : message informatif rassurant
      const statusLabels: Record<TesterStatus, string> = {
        PENDING: 'en attente de validation',
        APPROVED: 'approuvé (invitation en cours de préparation)',
        INVITED: 'invité (lien Play Store déjà expédié par email)',
        REJECTED: 'non retenu pour cette vague',
      };
      return {
        success: true,
        alreadyRegistered: true,
        message: `Vous êtes déjà inscrit avec cette adresse (${email}). Votre statut actuel est : ${statusLabels[existing.status]}.`,
      };
    }

    // Création en base de données
    const tester = await this.prisma.betaTester.create({
      data: {
        email,
        fullName: dto.fullName?.trim() || null,
        deviceModel: dto.deviceModel?.trim() || null,
        androidVersion: dto.androidVersion?.trim() || null,
        notes: dto.notes?.trim() || null,
        status: TesterStatus.PENDING,
        ipAddress: clientIp || null,
        userAgent: userAgent || null,
      },
    });

    this.logger.log(
      `🎉 [BetaTesters] Nouveau candidat inscrit : ${email} (${tester.fullName || 'Anonyme'}) - Appareil: ${tester.deviceModel || 'Non spécifié'}`,
    );

    // Envoi de l'email de confirmation de candidature
    try {
      await this.resendService.sendBetaTesterRegistrationEmail({
        to: email,
        fullName: tester.fullName || undefined,
        deviceModel: tester.deviceModel || undefined,
      });
      this.logger.log(
        `✉️ [BetaTesters] Email de confirmation de candidature envoyé à ${email}`,
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `❌ [BetaTesters] Erreur envoi email de confirmation à ${email} : ${msg}`,
      );
    }

    return {
      success: true,
      testerId: tester.id,
      message:
        'Votre candidature a été enregistrée avec succès ! Un e-mail de confirmation vous a été envoyé.',
    };
  }

  /**
   * Liste les testeurs avec filtres et pagination pour le tableau de bord admin.
   */
  async findAll(query: {
    status?: TesterStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.BetaTesterWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search?.trim()) {
      const term = query.search.trim();
      where.OR = [
        { email: { contains: term, mode: 'insensitive' } },
        { fullName: { contains: term, mode: 'insensitive' } },
        { deviceModel: { contains: term, mode: 'insensitive' } },
        { notes: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [total, data, stats] = await Promise.all([
      this.prisma.betaTester.count({ where }),
      this.prisma.betaTester.findMany({
        where,
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

  /**
   * Statistiques globales sur les testeurs bêta.
   */
  async getStats() {
    const [total, pending, approved, invited, rejected] = await Promise.all([
      this.prisma.betaTester.count(),
      this.prisma.betaTester.count({
        where: { status: TesterStatus.PENDING },
      }),
      this.prisma.betaTester.count({
        where: { status: TesterStatus.APPROVED },
      }),
      this.prisma.betaTester.count({
        where: { status: TesterStatus.INVITED },
      }),
      this.prisma.betaTester.count({
        where: { status: TesterStatus.REJECTED },
      }),
    ]);

    return {
      total,
      pending,
      approved,
      invited,
      rejected,
    };
  }

  /**
   * Met à jour le statut d'un testeur.
   */
  async updateStatus(id: string, dto: UpdateTesterStatusDto) {
    const tester = await this.prisma.betaTester.findUnique({
      where: { id },
    });

    if (!tester) {
      throw new NotFoundException(
        `Testeur introuvable avec l'identifiant ${id}`,
      );
    }

    const updated = await this.prisma.betaTester.update({
      where: { id },
      data: {
        status: dto.status,
        ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      },
    });

    this.logger.log(
      `🔄 [BetaTesters] Statut testeur ${tester.email} mis à jour : ${tester.status} -> ${dto.status}`,
    );

    return updated;
  }

  /**
   * Envoie le lien officiel Google Play Closed Testing à un testeur spécifique.
   */
  async sendPlayInvite(id: string, dto?: SendPlayInviteDto) {
    const tester = await this.prisma.betaTester.findUnique({
      where: { id },
    });

    if (!tester) {
      throw new NotFoundException(
        `Testeur introuvable avec l'identifiant ${id}`,
      );
    }

    const webLink = dto?.playStoreWebLink?.trim() || DEFAULT_PLAY_WEB_LINK;
    const appLink = dto?.playStoreAppLink?.trim() || DEFAULT_PLAY_APP_LINK;

    // Envoi de l'email officiel
    await this.resendService.sendBetaTesterInvitationEmail({
      to: tester.email,
      fullName: tester.fullName || undefined,
      playStoreWebLink: webLink,
      playStoreAppLink: appLink,
    });

    // Mise à jour du statut en base de données
    const updated = await this.prisma.betaTester.update({
      where: { id },
      data: {
        status: TesterStatus.INVITED,
        invitedAt: new Date(),
        inviteCount: { increment: 1 },
        playLinkSent: webLink,
      },
    });

    this.logger.log(
      `🚀 [BetaTesters] Invitation Google Play envoyée à ${tester.email} (Envoi n°${updated.inviteCount})`,
    );

    return {
      success: true,
      message: `Invitation Google Play envoyée avec succès à ${tester.email}`,
      tester: updated,
    };
  }

  /**
   * Envoi groupé d'invitations aux testeurs sélectionnés ou à tous les testeurs approuvés.
   */
  async bulkInvite(dto: BulkInviteDto) {
    const where: Prisma.BetaTesterWhereInput =
      dto.testerIds && dto.testerIds.length > 0
        ? { id: { in: dto.testerIds } }
        : { status: TesterStatus.APPROVED };

    const candidates = await this.prisma.betaTester.findMany({
      where,
      select: { id: true, email: true, fullName: true },
    });

    if (candidates.length === 0) {
      return {
        success: true,
        sentCount: 0,
        failedCount: 0,
        message: 'Aucun testeur éligible à inviter.',
      };
    }

    const webLink = dto.playStoreWebLink?.trim() || DEFAULT_PLAY_WEB_LINK;
    const appLink = dto.playStoreAppLink?.trim() || DEFAULT_PLAY_APP_LINK;

    let sentCount = 0;
    let failedCount = 0;

    for (const candidate of candidates) {
      try {
        await this.resendService.sendBetaTesterInvitationEmail({
          to: candidate.email,
          fullName: candidate.fullName || undefined,
          playStoreWebLink: webLink,
          playStoreAppLink: appLink,
        });

        await this.prisma.betaTester.update({
          where: { id: candidate.id },
          data: {
            status: TesterStatus.INVITED,
            invitedAt: new Date(),
            inviteCount: { increment: 1 },
            playLinkSent: webLink,
          },
        });

        sentCount++;
      } catch (err: unknown) {
        failedCount++;
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.error(
          `❌ [BetaTesters] Échec envoi invitation groupée à ${candidate.email} : ${msg}`,
        );
      }
    }

    return {
      success: true,
      sentCount,
      failedCount,
      message: `${sentCount} invitation(s) envoyée(s) avec succès${
        failedCount > 0 ? ` (${failedCount} échec(s))` : ''
      }.`,
    };
  }

  /**
   * Exporte la liste des adresses email pour copier/coller direct dans Google Play Console.
   */
  async exportEmails(status?: TesterStatus) {
    const where: Prisma.BetaTesterWhereInput = status ? { status } : {};
    const testers = await this.prisma.betaTester.findMany({
      where,
      select: { email: true },
      orderBy: { createdAt: 'desc' },
    });

    const emails = testers.map((t) => t.email);
    return {
      count: emails.length,
      emails,
      commaSeparated: emails.join(', '),
      csv: 'Email\n' + emails.join('\n'),
    };
  }

  /**
   * Supprime un testeur.
   */
  async remove(id: string) {
    const tester = await this.prisma.betaTester.findUnique({ where: { id } });
    if (!tester) {
      throw new NotFoundException(
        `Testeur introuvable avec l'identifiant ${id}`,
      );
    }

    await this.prisma.betaTester.delete({ where: { id } });
    return { success: true, message: 'Testeur supprimé avec succès.' };
  }
}
