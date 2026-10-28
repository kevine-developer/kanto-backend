import {
  Injectable,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';
import {
  CACHE_KEYS,
  CACHE_TTL,
} from '../../common/constants/cache.constant.js';
import { isAnswerMatching } from './riddle-validator.util.js';

@Injectable()
export class RiddleService {
  private readonly logger = new Logger(RiddleService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly redis?: RedisService,
  ) {}

  async invalidateCache() {
    if (this.redis) {
      await this.redis.delByPattern(CACHE_KEYS.RIDDLE_PATTERN);
      this.logger.debug('🧹 [Redis] Cache Devinettes invalidé');
    }
  }

  async getQuestions(level?: number) {
    const cacheKey = `${CACHE_KEYS.RIDDLE_QUESTIONS_PREFIX}${level ?? 'ALL'}`;
    if (this.redis) {
      const cached = await this.redis.get<any>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const where: Prisma.RiddleQuestionWhereInput = level
      ? { level, status: 'PUBLISHED' }
      : { status: 'PUBLISHED' };

    const questions = await this.prisma.riddleQuestion.findMany({
      where,
    });

    if (this.redis) {
      await this.redis.set(cacheKey, questions, CACHE_TTL.MEDIUM);
    }

    return questions;
  }

  /**
   * Calcule et renvoie dynamiquement les groupes disponibles de 10 devinettes.
   * Règle stricte Kanto : Aucun système de niveaux pour les devinettes.
   * Les devinettes sont réparties en groupes séquentiels de 10 :
   * Groupe 1 = 1 à 10, Groupe 2 = 11 à 20, Groupe 3 = 21 à 30, etc.
   * Ne génère que des groupes complets de 10 devinettes réellement publiées.
   */
  async getAvailableGroups() {
    const totalRiddles = await this.prisma.riddleQuestion.count({
      where: { status: 'PUBLISHED' },
    });

    const riddlesPerGroup = 10;
    const availableGroupCount = Math.floor(totalRiddles / riddlesPerGroup);

    const groups = Array.from({ length: availableGroupCount }, (_, idx) => {
      const groupNumber = idx + 1;
      const start = idx * riddlesPerGroup + 1;
      const end = (idx + 1) * riddlesPerGroup;
      return {
        groupNumber,
        groupId: `group_${groupNumber}`,
        titleFr: `Groupe ${groupNumber}`,
        titleMg: `Andiany ${groupNumber}`,
        rangeTextFr: `Devinettes ${start} à ${end}`,
        rangeTextMg: `Ankamantatra ${start} hatramin'ny ${end}`,
        range: { start, end },
        count: riddlesPerGroup,
      };
    });

    return {
      totalRiddles,
      riddlesPerGroup,
      availableGroupCount,
      groups,
    };
  }

  async startSession(
    userId: string | undefined,
    levelOrGroupNumber: number | undefined = undefined,
    questionCount: number = 10,
    groupNumber?: number,
  ) {
    const whereClause: Prisma.RiddleQuestionWhereInput = {
      status: 'PUBLISHED',
    };

    const targetGroup = groupNumber ?? levelOrGroupNumber;
    const totalAvailable = await this.prisma.riddleQuestion.count({
      where: whereClause,
    });
    const maxGroups = Math.floor(totalAvailable / questionCount);

    let selectedQuestions: { id: string }[];

    if (targetGroup !== undefined && targetGroup > 0) {
      if (targetGroup > maxGroups) {
        throw new NotFoundException(
          `Le groupe ${targetGroup} n'est pas disponible (seuls ${maxGroups} groupe(s) complet(s) sont disponibles).`,
        );
      }
      // Sélection exacte et déterministe des 10 devinettes du groupe
      selectedQuestions = await this.prisma.riddleQuestion.findMany({
        where: whereClause,
        orderBy: { id: 'asc' },
        skip: (targetGroup - 1) * questionCount,
        take: questionCount,
        select: { id: true },
      });
    } else {
      if (totalAvailable < questionCount) {
        throw new NotFoundException(
          `Nombre insuffisant de devinettes disponibles (${totalAvailable} disponibles, ${questionCount} requises).`,
        );
      }
      const allQuestions = await this.prisma.riddleQuestion.findMany({
        where: whereClause,
        select: { id: true },
      });
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      selectedQuestions = shuffled.slice(0, questionCount);
    }

    const session = await this.prisma.riddleSession.create({
      data: {
        userId,
        totalQuestions: selectedQuestions.length,
      },
    });

    const fullQuestions = await this.prisma.riddleQuestion.findMany({
      where: { id: { in: selectedQuestions.map((q) => q.id) } },
    });

    return {
      session,
      questions: fullQuestions,
      groupNumber: targetGroup ?? 1,
    };
  }

  async answerQuestion(
    sessionId: string,
    questionId: string,
    userAnswer: string | null,
  ) {
    const question = await this.prisma.riddleQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question) throw new NotFoundException('Question not found');

    const isCorrect = isAnswerMatching(userAnswer, question.correctAnswer);

    await this.prisma.riddleAnswer.create({
      data: {
        sessionId,
        questionId,
        userAnswer,
        isCorrect,
      },
    });

    // Update global stats
    await this.prisma.riddleQuestion.update({
      where: { id: questionId },
      data: {
        timesPlayed: { increment: 1 },
        timesCorrect: isCorrect ? { increment: 1 } : undefined,
      },
    });

    return {
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    };
  }

  async finishSession(sessionId: string, durationSeconds: number) {
    const answers = await this.prisma.riddleAnswer.findMany({
      where: { sessionId },
    });

    const score = answers.filter((a) => a.isCorrect).length;
    let currentStreak = 0;
    let maxStreak = 0;

    for (const a of answers) {
      if (a.isCorrect) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    // Give 10 XP per correct answer
    const xpEarned = score * 10;

    const session = await this.prisma.riddleSession.update({
      where: { id: sessionId },
      data: {
        score,
        streakMax: maxStreak,
        durationSeconds,
        isCompleted: true,
        xpEarned,
      },
    });

    if (session.userId && xpEarned > 0) {
      // Find or create UserProgress, add XP, create XpTransaction (basic implementation)
      await this.prisma.userProgress.upsert({
        where: { userId: session.userId },
        update: { totalXp: { increment: xpEarned } },
        create: { userId: session.userId, totalXp: xpEarned },
      });
      await this.prisma.xpTransaction.create({
        data: {
          userId: session.userId,
          amount: xpEarned,
          source: 'GAME_RIDDLE',
          description: `Gained ${xpEarned} XP from Riddle session`,
        },
      });
    }

    return session;
  }

  /**
   * Abandonne et stoppe immédiatement une session de devinettes côté serveur.
   * Supprime la session de la base si aucune réponse n'a été soumise pour libérer l'espace,
   * ou marque la session comme terminée si elle était en cours.
   */
  async abandonSession(sessionId: string) {
    if (!sessionId) {
      return { success: true, message: 'sessionId requis' };
    }

    const session = await this.prisma.riddleSession.findUnique({
      where: { id: sessionId },
      include: { answers: true },
    });

    if (!session) {
      return { success: true, message: 'Session introuvable ou déjà nettoyée' };
    }

    if (session.isCompleted) {
      return { success: true, message: 'Session déjà clôturée' };
    }

    if (session.answers.length === 0) {
      await this.prisma.riddleSession.delete({
        where: { id: sessionId },
      });
      return { success: true, status: 'DELETED' };
    }

    await this.prisma.riddleSession.update({
      where: { id: sessionId },
      data: {
        isCompleted: true,
      },
    });

    return { success: true, status: 'ABANDONED' };
  }
}
