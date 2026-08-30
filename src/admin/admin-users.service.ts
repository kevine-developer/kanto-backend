import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserRole } from '../../generated/prisma/client.js';
import {
  calculatePagination,
  formatPaginatedResponse,
} from '../common/utils/pagination.util.js';

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

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
