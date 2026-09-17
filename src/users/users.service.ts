import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import fs from 'node:fs';
import path from 'node:path';
import { PrismaService } from '../prisma/prisma.service.js';
import { CloudinaryService } from '../integrations/cloudinary/cloudinary.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getMyStats(userId: string) {
    const [
      user,
      progress,
      likesCount,
      favoritesCount,
      contributionsCount,
      tfSessions,
      riddleSessions,
      quizSessions,
      duelCount,
      badgesCount,
    ] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          username: true,
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
      this.prisma.trueFalseSession.findMany({
        where: { userId, isCompleted: true },
        select: { score: true, totalQuestions: true, durationSeconds: true },
      }),
      this.prisma.riddleSession.findMany({
        where: { userId, isCompleted: true },
        select: { score: true, totalQuestions: true, durationSeconds: true },
      }),
      this.prisma.civicQuizSession.findMany({
        where: { userId, isCompleted: true },
        select: { score: true, totalQuestions: true, durationSeconds: true },
      }),
      this.prisma.duelPlayer.count({
        where: { userId },
      }),
      this.prisma.userBadge.count({
        where: { userId },
      }),
    ]);

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const allSessions = [...tfSessions, ...riddleSessions, ...quizSessions];
    const gamesPlayed = allSessions.length + duelCount;

    let totalScore = 0;
    let totalQuestions = 0;
    let totalDurationSeconds = 0;

    for (const s of allSessions) {
      totalScore += s.score || 0;
      totalQuestions += s.totalQuestions || 0;
      totalDurationSeconds += s.durationSeconds || 0;
    }

    const accuracy =
      totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
    const timeSpentMinutes = Math.round(totalDurationSeconds / 60);
    const completedChallenges = badgesCount;

    return {
      user,
      stats: {
        level: progress?.level || 1,
        totalXp: Math.ceil(Number(progress?.totalXp || 0)),
        streakDays: progress?.streakDays || 0,
        likesCount,
        favoritesCount,
        contributionsCount,
        gamesPlayed,
        accuracy,
        completedChallenges,
        timeSpentMinutes,
      },
    };
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    if (dto.email) {
      const normalizedEmail = dto.email.trim().toLowerCase();
      const existingEmailUser = await this.prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (existingEmailUser && existingEmailUser.id !== userId) {
        throw new ConflictException(
          'Cette adresse email est déjà associée à un autre compte',
        );
      }
    }

    if (dto.username) {
      const normalizedUsername = dto.username.trim().toLowerCase();
      const existingUsernameUser = await this.prisma.user.findUnique({
        where: { username: normalizedUsername },
      });
      if (existingUsernameUser && existingUsernameUser.id !== userId) {
        throw new ConflictException(
          "Ce nom d'utilisateur est déjà utilisé par un autre membre",
        );
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name.trim() }),
        ...(dto.username !== undefined && {
          username: dto.username ? dto.username.trim().toLowerCase() : null,
        }),
        ...(dto.image !== undefined && { image: dto.image }),
        ...(dto.email && { email: dto.email.trim().toLowerCase() }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        role: true,
        tier: true,
        updatedAt: true,
      },
    });

    return { success: true, user };
  }

  async checkUsernameAvailability(username: string, currentUserId?: string) {
    const trimmed = (username || '').trim().toLowerCase();

    if (!/^[a-zA-Z0-9_]{3,25}$/.test(trimmed)) {
      return {
        available: false,
        message:
          "Le nom d'utilisateur doit contenir entre 3 et 25 caractères (lettres, chiffres, underscore)",
      };
    }

    const existing = await this.prisma.user.findUnique({
      where: { username: trimmed },
      select: { id: true },
    });

    if (existing && existing.id !== currentUserId) {
      return {
        available: false,
        message: "Ce nom d'utilisateur est déjà pris",
      };
    }

    return {
      available: true,
      message: "Ce nom d'utilisateur est disponible",
    };
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
        poesie: true,
        recitation: true,
      },
    });

    return favorites;
  }

  /**
   * Téléverse une photo de profil (Cloudinary CDN avec fallback local sécurisé).
   */
  async uploadAvatar(
    userId: string,
    base64Data: string,
    originalName?: string,
  ): Promise<{ success: boolean; url: string; user: any }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const { buffer, mimeType } =
      this.cloudinaryService.validateAndDecodeBase64Image(base64Data);

    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };
    const extension = mimeToExt[mimeType] ?? 'png';

    let imageUrl: string | undefined;

    if (this.cloudinaryService.isConfigured()) {
      try {
        imageUrl = await this.cloudinaryService.uploadImageBase64(
          base64Data,
          originalName || `avatar_${userId}`,
          'kanto/images/avatars',
        );
        this.logger.log(
          `☁️ [Cloudinary] Avatar utilisateur hébergé : ${imageUrl}`,
        );
      } catch (err: unknown) {
        this.logger.warn(
          `⚠️ [Cloudinary] Échec upload avatar (${
            err instanceof Error ? err.message : 'erreur inconnue'
          }). Bascule vers stockage local.`,
        );
      }
    }

    if (!imageUrl) {
      const uploadDir = path.resolve(process.cwd(), 'uploads', 'avatars');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `avatar-${userId}-${Date.now()}.${extension}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.promises.writeFile(filePath, buffer);
      imageUrl = `/uploads/avatars/${fileName}`;
      this.logger.log(`📷 Avatar enregistré en local : ${imageUrl}`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        tier: true,
        updatedAt: true,
      },
    });

    return { success: true, url: imageUrl, user: updatedUser };
  }

  /**
   * Supprime la photo de profil (remise à null).
   */
  async deleteAvatar(userId: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { image: null },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        tier: true,
        updatedAt: true,
      },
    });

    return { success: true, user: updatedUser };
  }
}
