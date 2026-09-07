import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyStats(userId: string) {
    const [user, progress, likesCount, favoritesCount, contributionsCount] =
      await Promise.all([
        this.prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            tier: true,
            createdAt: true,
          },
        }),
        this.prisma.userProgress.findUnique({
          where: { userId },
        }),
        this.prisma.like.count({ where: { userId } }),
        this.prisma.favorite.count({ where: { userId } }),
        this.prisma.contribution.count({ where: { userId } }),
      ]);

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return {
      user,
      stats: {
        level: progress?.level || 1,
        totalXp: progress?.totalXp || 0,
        likesCount,
        favoritesCount,
        contributionsCount,
      },
    };
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.image !== undefined && { image: dto.image }),
      },
      select: { id: true, name: true, image: true, updatedAt: true },
    });

    return { success: true, user };
  }

  async getMyFavorites(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        item: true,
        citation: true,
        conte: true,
        kabary: true,
      },
    });

    return favorites;
  }
}
