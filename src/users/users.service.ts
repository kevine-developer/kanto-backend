import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name.trim() }),
        ...(dto.image !== undefined && { image: dto.image }),
        ...(dto.email && { email: dto.email.trim().toLowerCase() }),
      },
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
