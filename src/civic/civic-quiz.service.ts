import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import {
  FindCivicQuizQueryDto,
  RandomQuizQueryDto,
} from './dto/find-civic-quiz.dto.js';
import { CreateCivicQuizDto } from './dto/create-civic-quiz.dto.js';
import { UpdateCivicQuizDto } from './dto/update-civic-quiz.dto.js';
import {
  calculatePagination,
  formatPaginatedResponse,
} from '../common/utils/pagination.util.js';
import { CACHE_KEYS } from '../common/constants/cache.constant.js';

/**
 * Mélange aléatoire uniforme (Fisher-Yates) d'un tableau
 */
export function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Mélange aléatoirement les choix d'une question tout en recalculant
 * l'index de la bonne réponse afin de supprimer tout biais de position (ex: réponse A récurrente).
 */
export function shuffleChoicesAndRecalculateIndex<
  T extends { choices: string[]; answerIndex: number },
>(question: T): T {
  if (!question.choices || question.choices.length <= 1) {
    return question;
  }
  const originalCorrectChoice = question.choices[question.answerIndex];
  const shuffledChoices = shuffleArray(question.choices);
  const newAnswerIndex = shuffledChoices.indexOf(originalCorrectChoice);

  return {
    ...question,
    choices: shuffledChoices,
    answerIndex: newAnswerIndex >= 0 ? newAnswerIndex : question.answerIndex,
  };
}

@Injectable()
export class CivicQuizService {
  private readonly logger = new Logger(CivicQuizService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private async invalidateCache(id?: string) {
    await this.redis.delByPattern(CACHE_KEYS.CIVIC_QUIZ_LIST_PATTERN);
    if (id) await this.redis.del(`${CACHE_KEYS.CIVIC_QUIZ_DETAIL_PREFIX}${id}`);
  }

  async create(data: CreateCivicQuizDto) {
    const question = await this.prisma.civicQuizQuestion.create({
      data: {
        category: data.category,
        prompt: data.prompt,
        choices: data.choices,
        answerIndex: data.answerIndex,
        explanation: data.explanation,
        explanationMg: data.explanationMg,
        difficulty: data.difficulty || 'EASY',
        tags: data.tags || [],
        imageUrl: data.imageUrl,
        imageAlt: data.imageAlt,
        sourceReference: data.sourceReference,
        sourceUrl: data.sourceUrl,
        historicalPeriod: data.historicalPeriod,
        contentSourceType: data.contentSourceType,
        contentSourceId: data.contentSourceId,
        levelNumber: data.levelNumber || 1,
        status: 'PUBLISHED',
      },
    });

    await this.invalidateCache(question.id);
    this.logger.log(
      `✨ [CivicQuiz] Question de quiz créée (ID: ${question.id})`,
    );
    return question;
  }

  async update(id: string, data: UpdateCivicQuizDto) {
    const existing = await this.prisma.civicQuizQuestion.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Question de quiz "${id}" introuvable`);
    }

    const question = await this.prisma.civicQuizQuestion.update({
      where: { id },
      data: {
        category: data.category !== undefined ? data.category : undefined,
        prompt: data.prompt !== undefined ? data.prompt : undefined,
        choices: data.choices !== undefined ? data.choices : undefined,
        answerIndex:
          data.answerIndex !== undefined ? data.answerIndex : undefined,
        explanation:
          data.explanation !== undefined ? data.explanation : undefined,
        explanationMg:
          data.explanationMg !== undefined ? data.explanationMg : undefined,
        difficulty: data.difficulty !== undefined ? data.difficulty : undefined,
        tags: data.tags !== undefined ? data.tags : undefined,
        status: data.status !== undefined ? data.status : undefined,
        imageUrl: data.imageUrl !== undefined ? data.imageUrl : undefined,
        imageAlt: data.imageAlt !== undefined ? data.imageAlt : undefined,
        sourceReference:
          data.sourceReference !== undefined ? data.sourceReference : undefined,
        sourceUrl: data.sourceUrl !== undefined ? data.sourceUrl : undefined,
        historicalPeriod:
          data.historicalPeriod !== undefined ? data.historicalPeriod : undefined,
        contentSourceType:
          data.contentSourceType !== undefined ? data.contentSourceType : undefined,
        contentSourceId:
          data.contentSourceId !== undefined ? data.contentSourceId : undefined,
        levelNumber:
          data.levelNumber !== undefined ? data.levelNumber : undefined,
      },
    });

    await this.invalidateCache(question.id);
    this.logger.log(
      `✏️ [CivicQuiz] Question de quiz mise à jour (ID: ${question.id})`,
    );
    return question;
  }

  async remove(id: string) {
    const existing = await this.prisma.civicQuizQuestion.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Question de quiz "${id}" introuvable`);
    }

    await this.prisma.civicQuizQuestion.delete({
      where: { id },
    });

    await this.invalidateCache(id);
    this.logger.log(`🗑️ [CivicQuiz] Question de quiz supprimée (ID: ${id})`);
    return { success: true, message: 'Question supprimée avec succès' };
  }

  async findAll(query: FindCivicQuizQueryDto) {
    const { page = 1, limit = 20, category, difficulty, tag } = query;
    const {
      skip,
      limit: takeLimit,
      page: currentPage,
    } = calculatePagination({ page, limit });

    const cacheKey = `${CACHE_KEYS.CIVIC_QUIZ_LIST_PREFIX}${currentPage}:${takeLimit}:${category || ''}:${difficulty || ''}:${tag || ''}`;
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

    const where: Prisma.CivicQuizQuestionWhereInput = {
      status: 'PUBLISHED',
      ...(category ? { category } : {}),
      ...(difficulty ? { difficulty } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
    };

    const [total, items] = await Promise.all([
      this.prisma.civicQuizQuestion.count({ where }),
      this.prisma.civicQuizQuestion.findMany({
        where,
        skip,
        take: takeLimit,
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    const result = formatPaginatedResponse(
      items,
      total,
      currentPage,
      takeLimit,
    );
    await this.redis.set(cacheKey, result, 300); // 5 min TTL
    return result;
  }

  async findOne(id: string) {
    const cacheKey = `${CACHE_KEYS.CIVIC_QUIZ_DETAIL_PREFIX}${id}`;
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

    const question = await this.prisma.civicQuizQuestion.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException(`Question de quiz "${id}" introuvable`);
    }

    await this.redis.set(cacheKey, question, 600); // 10 min TTL
    return question;
  }

  async getRandomQuestions(query: RandomQuizQueryDto) {
    const { category, difficulty, count = 10 } = query;

    const where: Prisma.CivicQuizQuestionWhereInput = {
      status: 'PUBLISHED',
      ...(category ? { category } : {}),
      ...(difficulty ? { difficulty } : {}),
    };

    const allQuestions = await this.prisma.civicQuizQuestion.findMany({
      where,
    });

    // Mélange aléatoire (Fisher-Yates) des questions
    const shuffledQuestions = shuffleArray(allQuestions).slice(0, count);

    // Mélange équitable des choix de chaque question pour supprimer le biais réponse A
    return shuffledQuestions.map((q) => shuffleChoicesAndRecalculateIndex(q));
  }

  async recordAnswer(id: string, isCorrect: boolean) {
    await this.prisma.civicQuizQuestion
      .update({
        where: { id },
        data: {
          timesPlayed: { increment: 1 },
          ...(isCorrect ? { timesCorrect: { increment: 1 } } : {}),
        },
      })
      .catch(() => null);

    return { success: true };
  }

  /**
   * Calcule et renvoie dynamiquement les niveaux disponibles pour une catégorie de quiz.
   * Règle stricte : 10 questions éligibles (PUBLISHED) = 1 niveau complet.
   * Pas de niveaux fictifs, pas de niveaux orphelins (< 10 questions).
   */
  async getAvailableLevels(category?: string) {
    const where: Prisma.CivicQuizQuestionWhereInput = { status: 'PUBLISHED' };
    if (category && category !== 'all') {
      where.category = category;
    }

    const totalQuestions = await this.prisma.civicQuizQuestion.count({ where });
    const questionsPerLevel = 10;
    const availableLevelCount = Math.floor(totalQuestions / questionsPerLevel);

    const LEVEL_METADATA = [
      { nameFr: 'Débutant', nameMg: 'Fiantombohana', badgeColor: '#355239', badgeBg: '#EEF4EF' },
      { nameFr: 'Initié', nameMg: 'Fianarana', badgeColor: '#2C4A52', badgeBg: '#EDF3F5' },
      { nameFr: 'Curieux', nameMg: 'Fahalalana', badgeColor: '#15803D', badgeBg: '#DCFCE7' },
      { nameFr: 'Intermédiaire', nameMg: 'Fivoarana', badgeColor: '#2563EB', badgeBg: '#EFF6FF' },
      { nameFr: 'Avancé', nameMg: 'Fanazavana', badgeColor: '#7A4A28', badgeBg: '#F7EFEA' },
      { nameFr: 'Confirmé', nameMg: 'Fahazarana', badgeColor: '#D97706', badgeBg: '#FEF3C7' },
      { nameFr: 'Érudit', nameMg: 'Faharanitana', badgeColor: '#7C3AED', badgeBg: '#F5F3FF' },
      { nameFr: 'Sagesse', nameMg: 'Fahendrena', badgeColor: '#6B3A48', badgeBg: '#F7EEF0' },
      { nameFr: 'Maître', nameMg: 'Fahaizana', badgeColor: '#9333EA', badgeBg: '#FAF5FF' },
      { nameFr: 'Palier Suprême', nameMg: 'Fandresena Rova', badgeColor: '#B45309', badgeBg: '#FFFBEB' },
    ];

    const levels = Array.from({ length: availableLevelCount }, (_, idx) => {
      const levelNumber = idx + 1;
      const meta = LEVEL_METADATA[idx % LEVEL_METADATA.length];
      return {
        levelNumber,
        levelId: `LVL_${levelNumber}`,
        nameFr: meta.nameFr,
        nameMg: meta.nameMg,
        badgeColor: meta.badgeColor,
        badgeBg: meta.badgeBg,
        questionCount: questionsPerLevel,
      };
    });

    return {
      category: category || 'all',
      totalQuestions,
      questionsPerLevel,
      availableLevelCount,
      levels,
    };
  }

  /**
   * Démarre une session de quiz sécurisée basée sur les niveaux dynamiques de 10 questions.
   */
  async startSession(
    userId: string | undefined,
    category: string | undefined,
    difficulty: string | undefined,
    questionCount: number = 10,
    levelNumber?: number,
  ) {
    const whereClause: Prisma.CivicQuizQuestionWhereInput = {
      status: 'PUBLISHED',
    };
    if (category && category !== 'all') whereClause.category = category;
    if (difficulty && difficulty !== 'ALL') {
      whereClause.difficulty = difficulty as any;
    }

    const totalAvailable = await this.prisma.civicQuizQuestion.count({
      where: whereClause,
    });
    const maxLevels = Math.floor(totalAvailable / questionCount);

    let selectedQuestions: { id: string }[];

    if (levelNumber !== undefined && levelNumber > 0) {
      if (levelNumber > maxLevels) {
        throw new NotFoundException(
          `Le niveau ${levelNumber} n'est pas disponible (seuls ${maxLevels} niveau(x) complet(s) sont disponibles).`,
        );
      }
      selectedQuestions = await this.prisma.civicQuizQuestion.findMany({
        where: whereClause,
        orderBy: { id: 'asc' },
        skip: (levelNumber - 1) * questionCount,
        take: questionCount,
        select: { id: true },
      });
    } else {
      if (totalAvailable < questionCount) {
        throw new NotFoundException(
          `Nombre insuffisant de questions disponibles (${totalAvailable} disponibles, ${questionCount} requises).`,
        );
      }
      const allIds = await this.prisma.civicQuizQuestion.findMany({
        where: whereClause,
        select: { id: true },
      });
      const shuffled = allIds.sort(() => 0.5 - Math.random());
      selectedQuestions = shuffled.slice(0, questionCount);
    }

    const fullQuestions = await this.prisma.civicQuizQuestion.findMany({
      where: { id: { in: selectedQuestions.map((q) => q.id) } },
    });

    // Mélange aléatoire (Fisher-Yates) de l'ordre d'affichage des questions de la session
    const randomized = shuffleArray(fullQuestions);

    // Mélange aléatoire (Fisher-Yates) des 4 choix pour chaque question afin d'éliminer le biais Réponse A
    const questionsWithShuffledChoices = randomized.map((q) =>
      shuffleChoicesAndRecalculateIndex(q),
    );

    const session = await this.prisma.civicQuizSession.create({
      data: {
        userId,
        totalQuestions: questionsWithShuffledChoices.length,
      },
    });

    // Sauvegarde en cache Redis du mapping exact des choix mélangés pour valider la session de jeu
    const answersMap: Record<
      string,
      { answerIndex: number; correctChoice: string }
    > = {};
    for (const q of questionsWithShuffledChoices) {
      answersMap[q.id] = {
        answerIndex: q.answerIndex,
        correctChoice: q.choices[q.answerIndex],
      };
    }
    await this.redis.set(
      `civic_quiz:session:${session.id}:answers_map`,
      answersMap,
      86400, // 24h
    );

    return {
      session,
      questions: questionsWithShuffledChoices,
      levelNumber: levelNumber ?? 1,
    };
  }

  async answerSessionQuestion(
    sessionId: string,
    questionId: string,
    userAnswerIndex: number | null,
    userAnswerText?: string | null,
  ) {
    const session = await this.prisma.civicQuizSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('Session de quiz introuvable');
    if (session.isCompleted) {
      const q = await this.prisma.civicQuizQuestion.findUnique({
        where: { id: questionId },
      });
      return {
        isCorrect: false,
        correctIndex: q?.answerIndex ?? 0,
        explanation: 'Session de quiz déjà terminée',
      };
    }

    const question = await this.prisma.civicQuizQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question) throw new NotFoundException('Question introuvable');

    // Récupérer le mapping des choix mélangés pour cette session depuis Redis
    const answersMap = await this.redis.get<
      Record<string, { answerIndex: number; correctChoice: string }>
    >(`civic_quiz:session:${sessionId}:answers_map`);
    const sessionQuestionMeta = answersMap?.[questionId];
    const expectedIndex = sessionQuestionMeta
      ? sessionQuestionMeta.answerIndex
      : question.answerIndex;
    const expectedChoiceText = sessionQuestionMeta
      ? sessionQuestionMeta.correctChoice
      : question.choices[question.answerIndex];

    // Protection contre les doubles soumissions pour une même question dans la session
    const existingAnswer = await this.prisma.civicQuizAnswer.findFirst({
      where: { sessionId, questionId },
    });
    if (existingAnswer) {
      return {
        isCorrect: existingAnswer.isCorrect,
        correctIndex: expectedIndex,
        explanation: question.explanation,
      };
    }

    // Vérification de la réponse : soit par index mélangé, soit par valeur textuelle
    const isCorrect: boolean =
      userAnswerIndex === expectedIndex ||
      Boolean(
        typeof userAnswerText === 'string' &&
          expectedChoiceText &&
          userAnswerText.trim().toLowerCase() ===
            expectedChoiceText.trim().toLowerCase(),
      );

    await this.prisma.civicQuizAnswer.create({
      data: {
        sessionId,
        questionId,
        userAnswer:
          userAnswerIndex !== null
            ? userAnswerIndex.toString()
            : (userAnswerText ?? null),
        isCorrect,
      },
    });

    // Mettre à jour les statistiques de la question
    await this.prisma.civicQuizQuestion.update({
      where: { id: questionId },
      data: {
        timesPlayed: { increment: 1 },
        ...(isCorrect ? { timesCorrect: { increment: 1 } } : {}),
      },
    });

    return {
      isCorrect,
      correctIndex: expectedIndex,
      explanation: question.explanation,
    };
  }

  async finishSession(sessionId: string, durationSeconds: number) {
    const existingSession = await this.prisma.civicQuizSession.findUnique({
      where: { id: sessionId },
    });

    if (!existingSession) {
      throw new NotFoundException('Session de quiz introuvable');
    }

    // Protection contre la ré-attribution accidentelle d'XP
    if (existingSession.isCompleted) {
      return existingSession;
    }

    const answers = await this.prisma.civicQuizAnswer.findMany({
      where: { sessionId },
      orderBy: { answeredAt: 'asc' },
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

    // Calcul de l'XP : 10 XP par bonne réponse + bonus streak si streak >= 3
    const streakBonus = maxStreak >= 5 ? 15 : maxStreak >= 3 ? 10 : 0;
    const xpEarned = score * 10 + streakBonus;

    const session = await this.prisma.civicQuizSession.update({
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
      await this.prisma.userProgress.upsert({
        where: { userId: session.userId },
        update: { totalXp: { increment: xpEarned } },
        create: { userId: session.userId, totalXp: xpEarned },
      });
      await this.prisma.xpTransaction.create({
        data: {
          userId: session.userId,
          amount: xpEarned,
          source: 'GAME_CIVIC_QUIZ',
          description: `Gained ${xpEarned} XP from Civic Quiz session`,
        },
      });
    }

    return session;
  }
}
