import {
  BadRequestException,
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
      const existingAdmin = await this.prisma.user.findFirst({
        where: { role: 'ADMIN' },
        select: { id: true, email: true },
      });

      if (existingAdmin) {
        this.logger.log(
          `🔐 [Admin] Compte administrateur actif détecté (${existingAdmin.email}).`,
        );
        return;
      }

      this.logger.log(
        `🛠️ [Admin] Aucun compte administrateur trouvé. Création automatique de ${adminEmail}...`,
      );
      const tempPassword = crypto
        .randomBytes(20)
        .toString('base64url')
        .slice(0, 20);

      let userId: string;

      try {
        const result = await auth.api.signUpEmail({
          body: {
            email: adminEmail,
            password: tempPassword,
            name: 'Admin Kanto',
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

      const adminUrl = process.env.ADMIN_URL || 'http://localhost:3001';
      await auth.api.requestPasswordReset({
        body: {
          email: adminEmail,
          redirectTo: `${adminUrl}/reset-password`,
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
   */
  async updateRole(id: string, role: string) {
    const normalizedRole = role?.toUpperCase();
    if (!['ADMIN', 'USER', 'CONTRIBUTOR'].includes(normalizedRole)) {
      throw new BadRequestException(
        'Rôle invalide. Valeurs acceptées : ADMIN, USER, CONTRIBUTOR',
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
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

    return {
      message: `Rôle mis à jour en ${normalizedRole} pour ${updated.email}`,
      user: updated,
    };
  }
}
