import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  Prisma,
  TrueFalseTheme,
  DifficultyLevel,
} from '../../../generated/prisma/client.js';
import {
  CreateQuestionDto,
  FindQuestionsQueryDto,
  UpdateQuestionDto,
} from './dto/true-false.dto.js';

@Injectable()
export class TrueFalseService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initialise une session de jeu sécurisée.
   * Les questions renvoyées au client sont débarrassées du champ 'isTrue' et des 'explanations'.
   */
  async startSession(
    userId?: string,
    theme?: string,
    difficulty?: string,
    questionCount: number = 10,
  ) {
    const where: Prisma.TrueFalseQuestionWhereInput = { status: 'PUBLISHED' };
    if (theme && theme !== 'ALL') {
      where.theme = theme as TrueFalseTheme;
    }
    if (difficulty && difficulty !== 'ALL') {
      where.difficulty = difficulty as DifficultyLevel;
    }

    // Récupération des IDs disponibles
    const availableQuestions = await this.prisma.trueFalseQuestion.findMany({
      where,
      select: { id: true },
    });

    if (availableQuestions.length === 0) {
      throw new NotFoundException(
        'Aucune question trouvée pour ce thème et ce niveau.',
      );
    }

    // Sélection aléatoire sans répétition
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
    const selectedIds = shuffled.slice(0, questionCount).map((q) => q.id);

    const questions = await this.prisma.trueFalseQuestion.findMany({
      where: { id: { in: selectedIds } },
      select: {
        id: true,
        questionMg: true,
        questionFr: true,
        theme: true,
        difficulty: true,
        image: true,
      },
    });

    // Création de la session en base
    const session = await this.prisma.trueFalseSession.create({
      data: {
        userId: userId || null,
        theme:
          theme && theme !== 'ALL'
            ? (theme as TrueFalseTheme)
            : TrueFalseTheme.GEN,
        difficulty:
          difficulty && difficulty !== 'ALL'
            ? (difficulty as DifficultyLevel)
            : DifficultyLevel.EASY,
        totalQuestions: questions.length,
      },
    });

    return {
      sessionId: session.id,
      totalQuestions: questions.length,
      questions,
    };
  }

  /**
   * Valide atomiquement une réponse côté serveur et renvoie l'explication.
   */
  async answerQuestion(
    sessionId: string,
    questionId: string,
    userAnswer: boolean | null | undefined,
  ) {
    if (!sessionId || !questionId) {
      throw new BadRequestException(
        'sessionId et questionId sont obligatoires.',
      );
    }

    const session = await this.prisma.trueFalseSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session de jeu introuvable.');
    }

    const question = await this.prisma.trueFalseQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question introuvable.');
    }

    const isCorrect =
      userAnswer !== null &&
      userAnswer !== undefined &&
      userAnswer === question.isTrue;

    // Enregistrement de la réponse
    await this.prisma.trueFalseAnswer.create({
      data: {
        sessionId,
        questionId,
        userAnswer: userAnswer ?? false, // Fallback database requirement
        isCorrect,
      },
    });

    // Mise à jour des compteurs statistiques de la question
    await this.prisma.trueFalseQuestion.update({
      where: { id: questionId },
      data: {
        timesPlayed: { increment: 1 },
        ...(isCorrect ? { timesCorrect: { increment: 1 } } : {}),
      },
    });

    // Calcul du nouveau score et streak
    const answers = await this.prisma.trueFalseAnswer.findMany({
      where: { sessionId },
      orderBy: { answeredAt: 'asc' },
    });

    let currentScore = 0;
    let currentStreak = 0;
    let maxStreak = 0;

    for (const a of answers) {
      if (a.isCorrect) {
        currentScore++;
        currentStreak++;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
    }

    await this.prisma.trueFalseSession.update({
      where: { id: sessionId },
      data: {
        score: currentScore,
        streakMax: maxStreak,
      },
    });

    return {
      isCorrect,
      isTrue: question.isTrue,
      explanationMg: question.explanationMg,
      explanationFr: question.explanationFr,
      source: question.source,
      currentScore,
      streak: currentStreak,
      totalAnswered: answers.length,
      totalQuestions: session.totalQuestions,
    };
  }

  /**
   * Finalise une session de jeu, valide le niveau et calcule l'XP.
   */
  async finishSession(sessionId: string, durationSeconds: number = 0) {
    if (!sessionId) {
      throw new BadRequestException('sessionId est obligatoire.');
    }

    const session = await this.prisma.trueFalseSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session introuvable.');
    }

    const successRate =
      session.totalQuestions > 0
        ? Math.round((session.score / session.totalQuestions) * 100)
        : 0;

    const isLevelCompleted = successRate >= 80;
    const baseXP = session.score * 10;
    const bonusXP =
      successRate >= 90
        ? Math.ceil(baseXP * 0.5)
        : successRate >= 80
          ? Math.ceil(baseXP * 0.3)
          : 0;
    const totalXP = baseXP + bonusXP;

    const updatedSession = await this.prisma.trueFalseSession.update({
      where: { id: sessionId },
      data: {
        isCompleted: true,
        durationSeconds,
        xpEarned: totalXP,
      },
    });

    return {
      sessionId: updatedSession.id,
      score: updatedSession.score,
      totalQuestions: updatedSession.totalQuestions,
      streakMax: updatedSession.streakMax,
      successRate,
      isLevelCompleted,
      xpEarned: totalXP,
    };
  }

  // ==========================================
  // ADMINISTRATION & STATISTIQUES
  // ==========================================

  async findAllQuestions(query: FindQuestionsQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.TrueFalseQuestionWhereInput = {};
    if (query.theme && query.theme !== 'ALL') {
      where.theme = query.theme as TrueFalseTheme;
    }
    if (query.difficulty && query.difficulty !== 'ALL') {
      where.difficulty = query.difficulty as DifficultyLevel;
    }
    if (query.search && query.search.trim()) {
      const search = query.search.trim();
      where.OR = [
        { questionMg: { contains: search, mode: 'insensitive' } },
        { questionFr: { contains: search, mode: 'insensitive' } },
        { explanationMg: { contains: search, mode: 'insensitive' } },
        { source: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.trueFalseQuestion.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.trueFalseQuestion.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneQuestion(id: string) {
    const q = await this.prisma.trueFalseQuestion.findUnique({
      where: { id },
    });
    if (!q) throw new NotFoundException('Question introuvable.');
    return q;
  }

  async createQuestion(dto: CreateQuestionDto) {
    return this.prisma.trueFalseQuestion.create({
      data: {
        questionMg: dto.questionMg,
        questionFr: dto.questionFr || dto.questionMg,
        isTrue: dto.isTrue,
        explanationMg: dto.explanationMg,
        explanationFr: dto.explanationFr || dto.explanationMg,
        theme: dto.theme,
        difficulty: dto.difficulty,
        source: dto.source || null,
        image: dto.image || null,
      },
    });
  }

  async updateQuestion(id: string, dto: UpdateQuestionDto) {
    const exists = await this.prisma.trueFalseQuestion.findUnique({
      where: { id },
    });
    if (!exists) throw new NotFoundException('Question introuvable.');

    return this.prisma.trueFalseQuestion.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async removeQuestion(id: string) {
    const exists = await this.prisma.trueFalseQuestion.findUnique({
      where: { id },
    });
    if (!exists) throw new NotFoundException('Question introuvable.');

    return this.prisma.trueFalseQuestion.delete({
      where: { id },
    });
  }

  async getStats() {
    const [totalQuestions, totalSessions, themesCount, difficultiesCount] =
      await Promise.all([
        this.prisma.trueFalseQuestion.count(),
        this.prisma.trueFalseSession.count(),
        this.prisma.trueFalseQuestion.groupBy({
          by: ['theme'],
          _count: { _all: true },
        }),
        this.prisma.trueFalseQuestion.groupBy({
          by: ['difficulty'],
          _count: { _all: true },
        }),
      ]);

    return {
      totalQuestions,
      totalSessions,
      themes: themesCount.map((t) => ({
        theme: t.theme,
        count: t._count._all,
      })),
      difficulties: difficultiesCount.map((d) => ({
        difficulty: d.difficulty,
        count: d._count._all,
      })),
    };
  }

  async getQuestionCounts(): Promise<Record<string, number>> {
    const grouped = await this.prisma.trueFalseQuestion.groupBy({
      by: ['theme', 'difficulty'],
      where: { status: 'PUBLISHED' },
      _count: { _all: true },
    });

    const counts: Record<string, number> = {};
    for (const g of grouped) {
      counts[`${g.theme}_${g.difficulty}`] = g._count._all;
    }
    return counts;
  }
}
