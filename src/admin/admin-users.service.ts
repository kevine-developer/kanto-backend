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

@Injectable()
export class AdminUsersService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminUsersService.name);

  constructor(private readonly prisma: PrismaService) {}

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
   * Liste les utilisateurs avec pagination et recherche textuelle.
   */
  async listUsers(pageStr?: string, limitStr?: string, search?: string) {
    const { page, limit, skip } = calculatePagination({
      page: pageStr,
      limit: limitStr,
    });

    const where: any = {};
    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { email: { contains: search.trim(), mode: 'insensitive' } },
      ];
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
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          tier: true,
          banned: true,
          banReason: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              favorites: true,
              likes: true,
            },
          },
        },
      }),
    ]);

    return formatPaginatedResponse(users, total, page, limit);
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
    if (!['ADMIN', 'USER', 'CONTRIBUTOR'].includes(normalizedRole)) {
      throw new BadRequestException(
        'Rôle invalide. Valeurs acceptées : ADMIN, USER, CONTRIBUTOR',
      );
    }

    // Protection 1 : un admin ne peut pas modifier son propre rôle
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
      throw new NotFoundException('Utilisateur introuvable');
    }

    // Protection 2 : empêcher la suppression du dernier administrateur
    if (user.role === 'ADMIN' && normalizedRole !== 'ADMIN') {
      const adminCount = await this.prisma.user.count({
        where: { role: 'ADMIN' },
      });
      if (adminCount <= 1) {
        throw new ForbiddenException(
          'Impossible de rétrograder le dernier administrateur. Promouvez d’abord un autre utilisateur en ADMIN.',
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
      `🔑 [Admin] Rôle de ${updated.email} mis à jour : ${user.role} → ${normalizedRole} (par user ${requestingUserId})`,
    );

    return {
      message: `Rôle mis à jour en ${normalizedRole} pour ${updated.email}`,
      user: updated,
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

    return {
      success: true,
      message: `Email de réinitialisation envoyé à ${user.email}`,
    };
  }
}
