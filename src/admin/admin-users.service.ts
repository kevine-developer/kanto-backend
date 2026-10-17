import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import crypto from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserRole } from '../../generated/prisma/client.js';
import { auth } from '../auth/auth.js';
import {
  calculatePagination,
  formatPaginatedResponse,
} from '../common/utils/pagination.util.js';
import { AdminAuditService } from './admin-audit.service.js';

@Injectable()
export class AdminUsersService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminUsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AdminAuditService,
  ) {}

  async onApplicationBootstrap() {
    await this.ensureDefaultAdmin();
  }

  /**
   * Assure la présence d'un administrateur au démarrage du backend (sur VPS ou en local).
   * Si aucun compte ADMIN n'existe et que DEFAULT_ADMIN_EMAIL est configuré,
   * il est automatiquement créé et reçoit un email Resend avec le lien pour définir son mot de passe.
   */
  async ensureDefaultAdmin() {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL?.trim();
    if (!adminEmail) {
      return;
    }

    try {
      // 1. Vérifier prioritairement si le compte spécifié par DEFAULT_ADMIN_EMAIL existe
      const targetUser = await this.prisma.user.findUnique({
        where: { email: adminEmail },
        select: { id: true, email: true, role: true, emailVerified: true },
      });

      if (targetUser) {
        if (targetUser.role !== 'ADMIN' || !targetUser.emailVerified) {
          await this.prisma.user.update({
            where: { id: targetUser.id },
            data: {
              role: 'ADMIN',
              emailVerified: true,
            },
          });
          this.logger.log(
            `✅ [Admin] Compte existant ${adminEmail} (rôle précédent: ${targetUser.role}) promu au rôle ADMIN (email vérifié).`,
          );
        } else {
          this.logger.log(
            `🔐 [Admin] Compte administrateur actif détecté (${targetUser.email}) avec le rôle ADMIN.`,
          );
        }
        return;
      }

      this.logger.log(
        `🛠️ [Admin] Aucun compte administrateur trouvé pour ${adminEmail}. Création automatique...`,
      );
      const tempPassword = crypto
        .randomBytes(20)
        .toString('base64url')
        .slice(0, 20);

      let userId: string;

      try {
        const result = await auth.api.createUser({
          body: {
            email: adminEmail,
            password: tempPassword,
            name: 'Admin Kanto',
            role: 'ADMIN',
          },
        });
        if (!result?.user?.id) {
          throw new Error("Better Auth n'a pas retourné d'utilisateur");
        }
        userId = result.user.id;
      } catch (signUpErr: unknown) {
        const existingUser = await this.prisma.user.findUnique({
          where: { email: adminEmail },
        });
        if (!existingUser) {
          throw signUpErr;
        }
        userId = existingUser.id;
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          role: 'ADMIN',
          emailVerified: true,
        },
      });

      this.logger.log(`✅ [Admin] Rôle ADMIN attribué à ${adminEmail}.`);

      // ADMIN_FRONTEND_URL doit pointer vers le frontend admin (ex: https://admin.kanto.mg)
      // et NON vers l'API. Fallback sur ADMIN_URL pour compatibilité rétrograde.
      const adminFrontendUrl =
        process.env.ADMIN_FRONTEND_URL ||
        process.env.ADMIN_URL ||
        (process.env.NODE_ENV === 'production'
          ? 'https://admin.kanto.mg'
          : 'http://localhost:3001');
      await auth.api.requestPasswordReset({
        body: {
          email: adminEmail,
          redirectTo: `${adminFrontendUrl}/reset-password`,
        },
      });

      this.logger.log(
        `📧 [Admin] Email de configuration envoyé avec succès à ${adminEmail}.`,
      );
    } catch (err: unknown) {
      this.logger.error(
        `❌ [Admin] Erreur lors de l'initialisation de l'administrateur : ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  /**
   * Liste les utilisateurs avec pagination côté serveur, recherche textuelle et filtres.
   */
  async listUsers(
    pageStr?: string,
    limitStr?: string,
    search?: string,
    roleFilter?: string,
    statusFilter?: string,
  ) {
    const { page, limit, skip } = calculatePagination({
      page: pageStr,
      limit: limitStr,
    });

    const where: any = {};
    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { email: { contains: search.trim(), mode: 'insensitive' } },
        { username: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    if (roleFilter && roleFilter !== 'ALL') {
      where.role = roleFilter.toUpperCase();
    }

    if (statusFilter === 'BANNED') {
      where.banned = true;
    } else if (statusFilter === 'ACTIVE') {
      where.OR = [{ banned: false }, { banned: null }];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          tier: true,
          banned: true,
          banReason: true,
          banExpires: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              favorites: true,
              likes: true,
              contributions: true,
              quizSets: true,
              reports: true,
            },
          },
        },
      }),
    ]);

    return formatPaginatedResponse(users, total, page, limit);
  }

  /**
   * Récupère la fiche détaillée d'un utilisateur pour l'administration.
   */
  async getUserDetails(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        accounts: {
          select: {
            id: true,
            providerId: true,
            createdAt: true,
          },
        },
        progress: true,
        _count: {
          select: {
            contributions: true,
            contributionVotes: true,
            contributionComments: true,
            quizSets: true,
            favorites: true,
            likes: true,
            badges: true,
            reports: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    // Répartition des contributions par statut
    const [pendingContribs, approvedContribs, rejectedContribs] =
      await Promise.all([
        this.prisma.contribution.count({
          where: { userId: id, status: 'PENDING_REVIEW' },
        }),
        this.prisma.contribution.count({
          where: { userId: id, status: 'APPROVED' },
        }),
        this.prisma.contribution.count({
          where: { userId: id, status: 'REJECTED' },
        }),
      ]);

    // Signalements visant les contenus créés par cet utilisateur
    const reportsAgainstUser = await this.prisma.contentReport.findMany({
      where: {
        OR: [
          { contribution: { userId: id } },
          { comment: { userId: id } },
          { quizSet: { authorId: id } },
        ],
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        reason: true,
        description: true,
        resolved: true,
        createdAt: true,
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        role: user.role,
        tier: user.tier,
        termsAcceptedAt: user.termsAcceptedAt,
        termsVersion: user.termsVersion,
        banned: Boolean(user.banned),
        banReason: user.banReason,
        banExpires: user.banExpires,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accounts: user.accounts,
      progress: user.progress,
      metrics: {
        counts: user._count,
        contributions: {
          pending: pendingContribs,
          approved: approvedContribs,
          rejected: rejectedContribs,
          total: user._count.contributions,
        },
      },
      reportsAgainstUser,
    };
  }

  /**
   * Met à jour le rôle d'un utilisateur.
   *
   * Protections :
   * - Un admin ne peut pas modifier son propre rôle (risque d'auto-lock-out)
   * - Impossible de rétrograder le dernier administrateur (protection contre la perte d'accès)
   */
  async updateRole(id: string, role: string, requestingUserId: string) {
    const normalizedRole = role?.toUpperCase();
    if (!['ADMIN', 'MODERATOR', 'CONTRIBUTOR', 'USER'].includes(normalizedRole)) {
      throw new BadRequestException(
        'Rôle invalide. Valeurs acceptées : ADMIN, MODERATOR, CONTRIBUTOR, USER',
      );
    }

    if (id === requestingUserId) {
      throw new ForbiddenException(
        'Vous ne pouvez pas modifier votre propre rôle.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, tier: true },
    });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    if (user.role === 'ADMIN' && normalizedRole !== 'ADMIN') {
      const adminCount = await this.prisma.user.count({
        where: { role: 'ADMIN' },
      });
      if (adminCount <= 1) {
        throw new ForbiddenException(
          'Impossible de rétrograder le dernier administrateur. Promouvez d’abord un autre compte.',
        );
      }
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { role: normalizedRole as UserRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tier: true,
      },
    });

    this.logger.log(
      `🔑 [Admin] Rôle de ${updated.email} mis à jour : ${user.role} → ${normalizedRole} (par admin ${requestingUserId})`,
    );

    await this.auditService.logAction({
      userId: requestingUserId,
      action: 'USER_ROLE_CHANGED',
      targetType: 'USER',
      targetId: id,
      targetLabel: updated.email,
      reason: `Rôle modifié : ${user.role} → ${normalizedRole}`,
      details: { previousRole: user.role, newRole: normalizedRole },
    });

    return {
      message: `Rôle mis à jour en ${normalizedRole} pour ${updated.email}`,
      user: updated,
    };
  }

  /**
   * Suspend ou bannit un utilisateur avec motif obligatoire.
   */
  async banUser(
    id: string,
    reason: string,
    banExpires: string | undefined | null,
    requestingUserId: string,
  ) {
    if (id === requestingUserId) {
      throw new ForbiddenException(
        'Vous ne pouvez pas suspendre votre propre compte administrateur.',
      );
    }

    if (!reason || !reason.trim()) {
      throw new BadRequestException(
        'Un motif de suspension clair est obligatoire.',
      );
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!targetUser) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    if (targetUser.role === 'ADMIN') {
      throw new ForbiddenException(
        'Impossible de suspendre directement un compte administrateur. Modifiez d’abord son rôle.',
      );
    }

    const expiresDate = banExpires ? new Date(banExpires) : null;

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        banned: true,
        banReason: reason.trim(),
        banExpires: expiresDate,
      },
      select: {
        id: true,
        name: true,
        email: true,
        banned: true,
        banReason: true,
        banExpires: true,
      },
    });

    // Révocation immédiate de toutes les sessions actives de l'utilisateur banni
    await this.prisma.session.deleteMany({
      where: { userId: id },
    });

    this.logger.warn(
      `🚫 [Admin] Compte ${targetUser.email} suspendu par ${requestingUserId}. Motif : ${reason}`,
    );

    await this.auditService.logAction({
      userId: requestingUserId,
      action: 'USER_BANNED',
      targetType: 'USER',
      targetId: id,
      targetLabel: targetUser.email,
      reason: reason.trim(),
      details: { banExpires: expiresDate?.toISOString() || null },
    });

    return {
      success: true,
      message: `Le compte ${targetUser.email} a été suspendu avec succès.`,
      user: updated,
    };
  }

  /**
   * Réactive un compte utilisateur suspendu.
   */
  async unbanUser(id: string, requestingUserId: string) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, banned: true },
    });
    if (!targetUser) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        banned: false,
        banReason: null,
        banExpires: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        banned: true,
      },
    });

    this.logger.log(
      `✅ [Admin] Compte ${targetUser.email} réactivé par ${requestingUserId}.`,
    );

    await this.auditService.logAction({
      userId: requestingUserId,
      action: 'USER_UNBANNED',
      targetType: 'USER',
      targetId: id,
      targetLabel: targetUser.email,
      reason: 'Réactivation manuelle du compte utilisateur',
    });

    return {
      success: true,
      message: `Le compte ${targetUser.email} a été réactivé avec succès.`,
      user: updated,
    };
  }

  /**
   * Supprime définitivement un compte utilisateur (Conformité RGPD / Stores).
   */
  async deleteUser(id: string, requestingUserId: string) {
    if (id === requestingUserId) {
      throw new ForbiddenException(
        'Vous ne pouvez pas supprimer votre propre compte depuis ce panneau.',
      );
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true },
    });
    if (!targetUser) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    if (targetUser.role === 'ADMIN') {
      const adminCount = await this.prisma.user.count({
        where: { role: 'ADMIN' },
      });
      if (adminCount <= 1) {
        throw new ForbiddenException(
          'Impossible de supprimer le dernier compte administrateur.',
        );
      }
    }

    await this.prisma.user.delete({
      where: { id },
    });

    this.logger.warn(
      `🗑️ [Admin] Compte ${targetUser.email} (${id}) définitivement supprimé par ${requestingUserId}.`,
    );

    await this.auditService.logAction({
      userId: requestingUserId,
      action: 'USER_DELETED',
      targetType: 'USER',
      targetId: id,
      targetLabel: targetUser.email,
      reason: 'Suppression définitive du compte utilisateur (RGPD / modération)',
    });

    return {
      success: true,
      message: `Compte ${targetUser.email} supprimé avec succès.`,
    };
  }

  /**
   * Déclenche l'envoi d'un email de réinitialisation de mot de passe pour un utilisateur.
   */
  async resetUserPassword(id: string, requestingUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const adminFrontendUrl =
      process.env.ADMIN_FRONTEND_URL ||
      process.env.ADMIN_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://admin.kanto.mg'
        : 'http://localhost:3001');

    await auth.api.requestPasswordReset({
      body: {
        email: user.email,
        redirectTo: `${adminFrontendUrl}/reset-password`,
      },
    });

    this.logger.log(
      `🔑 [Admin] Réinitialisation de mot de passe déclenchée pour ${user.email} (par admin ${requestingUserId})`,
    );

    await this.auditService.logAction({
      userId: requestingUserId,
      action: 'USER_PASSWORD_RESET_TRIGGERED',
      targetType: 'USER',
      targetId: id,
      targetLabel: user.email,
      reason: 'Envoi d’un email de réinitialisation de mot de passe',
    });

    return {
      success: true,
      message: `Email de réinitialisation envoyé à ${user.email}`,
    };
  }
}
