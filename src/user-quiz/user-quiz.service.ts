import fs from 'node:fs';
import path from 'node:path';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { CloudinaryService } from '../integrations/cloudinary/cloudinary.service.js';
import {
  CoinsEconomyConfig,
  DEFAULT_COINS_ECONOMY_CONFIG,
  REDIS_COINS_CONFIG_KEY,
} from '../progression/progression.constants.js';
import {
  CreateUserQuizSetDto,
  CreateUserQuestionDto,
  UpdateUserQuestionDto,
  DeckVisibility,
  MIN_QUESTIONS_FOR_PUBLICATION,
  ReportDeckDto,
  RecordPlayDto,
  validateUserQuestion,
} from './dto/user-quiz.dto.js';
import { ReportReason } from '../../generated/prisma/client.js';

const LEVEL_THRESHOLDS = [
  { level: 10, minXp: 23000 },
  { level: 9, minXp: 16000 },
  { level: 8, minXp: 11000 },
  { level: 7, minXp: 7400 },
  { level: 6, minXp: 4800 },
  { level: 5, minXp: 3000 },
  { level: 4, minXp: 1800 },
  { level: 3, minXp: 1000 },
  { level: 2, minXp: 500 },
  { level: 1, minXp: 200 },
];

function calculateLevelFromXp(xp: number): number {
  for (const t of LEVEL_THRESHOLDS) {
    if (xp >= t.minXp) return t.level;
  }
  return 0;
}

function sanitizeText(value?: string | null): string {
  if (!value) return '';
  return value
    .replace(/<[^>]*>?/gm, '') // Supprime les balises HTML/scripts
    .trim();
}

@Injectable()
export class UserQuizService {
  private readonly logger = new Logger(UserQuizService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    @Optional()
    private readonly notificationsService?: NotificationsService,
    @Optional()
    private readonly cloudinaryService?: CloudinaryService,
  ) {}

  private async getCoinsEconomyConfig(): Promise<CoinsEconomyConfig> {
    try {
      const cached = await this.redisService.get<CoinsEconomyConfig>(
        REDIS_COINS_CONFIG_KEY,
      );
      if (cached && typeof cached === 'object') {
        return { ...DEFAULT_COINS_ECONOMY_CONFIG, ...cached };
      }
    } catch {
      // Ignorer
    }
    return DEFAULT_COINS_ECONOMY_CONFIG;
  }

  /**
   * Création d'un nouveau Deck communautaire
   * Règle de publication : si moins de 5 questions valides sont fournies, le deck est créé en DRAFT (non public).
   */
  async createQuizSet(userId: string, dto: CreateUserQuizSetDto) {
    // Nettoyage et assainissement
    const cleanTitle = sanitizeText(dto.title);
    if (!cleanTitle) {
      throw new BadRequestException('Le titre du deck est obligatoire.');
    }

    const cleanDesc = dto.description ? sanitizeText(dto.description) : null;
    const cleanCategory = dto.category
      ? sanitizeText(dto.category)
      : 'culture_generale';

    // Validation des questions fournies
    const rawQuestions = Array.isArray(dto.questions) ? dto.questions : [];
    const validatedQuestions = rawQuestions.map((q) => {
      const report = validateUserQuestion(q);
      return {
        ...q,
        isValid: report.isValid,
        errors: report.errors,
      };
    });

    const validQuestionsCount = validatedQuestions.filter(
      (q) => q.isValid,
    ).length;

    // Règle des 5 questions minimales : la visibilité publique exige au moins 5 questions valides
    const requestedPublic =
      dto.visibility === DeckVisibility.PUBLIC || dto.isPublic === true;

    let visibility = dto.visibility || DeckVisibility.PUBLIC;
    let isPublic = requestedPublic;

    if (
      requestedPublic &&
      validQuestionsCount < MIN_QUESTIONS_FOR_PUBLICATION
    ) {
      // Sauvegarde sécurisée comme brouillon au lieu d'un échec bloquant
      visibility = DeckVisibility.LINK_ONLY;
      isPublic = false;
    }

    const set = await this.prisma.userQuizSet.create({
      data: {
        title: cleanTitle,
        description: cleanDesc,
        imageUrl: dto.imageUrl?.trim() || null,
        category: cleanCategory,
        visibility,
        isPublic,
        authorId: userId,
        questions: {
          create: rawQuestions.map((q) => ({
            gameType: q.gameType,
            questionMg: sanitizeText(q.questionMg),
            questionFr: q.questionFr ? sanitizeText(q.questionFr) : null,
            isTrue: q.isTrue,
            choices: Array.isArray(q.choices)
              ? q.choices.map((c) => sanitizeText(c)).filter(Boolean)
              : [],
            answerIndex: q.answerIndex,
            explanationMg: q.explanationMg
              ? sanitizeText(q.explanationMg)
              : null,
            explanationFr: q.explanationFr
              ? sanitizeText(q.explanationFr)
              : null,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return {
      ...set,
      validQuestionsCount,
      requiredQuestionsCount: MIN_QUESTIONS_FOR_PUBLICATION,
      isPublishable: validQuestionsCount >= MIN_QUESTIONS_FOR_PUBLICATION,
      missingQuestionsCount: Math.max(
        0,
        MIN_QUESTIONS_FOR_PUBLICATION - validQuestionsCount,
      ),
      statusNotice:
        requestedPublic && validQuestionsCount < MIN_QUESTIONS_FOR_PUBLICATION
          ? `Votre deck a été sauvegardé comme brouillon. Ajoutez encore ${MIN_QUESTIONS_FOR_PUBLICATION - validQuestionsCount} question(s) valide(s) pour le publier.`
          : null,
    };
  }

  /**
   * Liste des decks créés par l'utilisateur connecté (Vue Propriétaire)
   */
  async getMyQuizSets(userId: string) {
    const sets = await this.prisma.userQuizSet.findMany({
      where: { authorId: userId },
      include: {
        questions: {
          select: {
            id: true,
            gameType: true,
            questionMg: true,
            choices: true,
            answerIndex: true,
            isTrue: true,
          },
        },
        _count: {
          select: { questions: true, sessions: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return sets.map((set) => {
      const validQuestionsCount = set.questions.filter(
        (q) => validateUserQuestion(q).isValid,
      ).length;
      return {
        ...set,
        validQuestionsCount,
        requiredQuestionsCount: MIN_QUESTIONS_FOR_PUBLICATION,
        isPublishable: validQuestionsCount >= MIN_QUESTIONS_FOR_PUBLICATION,
        missingQuestionsCount: Math.max(
          0,
          MIN_QUESTIONS_FOR_PUBLICATION - validQuestionsCount,
        ),
      };
    });
  }

  /**
   * Exploration des decks publics (Vue Communauté pour les joueurs)
   */
  async getPublicQuizSets(
    skip = 0,
    take = 20,
    search?: string,
    sort: 'recent' | 'popular' = 'recent',
    category?: string,
    _currentUserId?: string,
  ) {
    const where: any = {
      OR: [{ visibility: DeckVisibility.PUBLIC }, { isPublic: true }],
    };

    // Règle d'intégrité Kanto : un auteur ne voit pas ses propres decks dans le flux public
    if (_currentUserId) {
      where.authorId = { not: _currentUserId };
    }
    if (category && category !== 'all') {
      where.category = category;
    }
    if (search && search.trim()) {
      const q = search.trim();
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { author: { name: { contains: q, mode: 'insensitive' } } },
          ],
        },
      ];
    }

    const orderBy: any =
      sort === 'popular'
        ? [{ playsCount: 'desc' }, { createdAt: 'desc' }]
        : { createdAt: 'desc' };

    const decks = await this.prisma.userQuizSet.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        _count: {
          select: { questions: true },
        },
      },
      orderBy,
      skip,
      take,
    });

    if (!_currentUserId) {
      return decks;
    }

    const playedDeckIds = new Set(
      await this.redisService.sMembers(
        `ugc:user_played_decks:${_currentUserId}`,
      ),
    );

    return decks.map((deck) => ({
      ...deck,
      hasPlayed: playedDeckIds.has(deck.id),
    }));
  }

  async getMyPlayedDecks(userId: string): Promise<string[]> {
    if (!userId) return [];
    return await this.redisService.sMembers(`ugc:user_played_decks:${userId}`);
  }

  /**
   * Consultation d'un deck selon le rôle de l'utilisateur (Sécurisé côté Backend)
   * - Propriétaire : Vue de gestion complète avec réponses, erreurs de questions et métriques.
   * - Joueur : Vue publique épurée avec masquage strict des réponses (ANTI-TRICHE).
   */
  async getQuizSetById(setId: string, currentUserId?: string) {
    const set = await this.prisma.userQuizSet.findUnique({
      where: { id: setId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            tier: true,
            createdAt: true,
            _count: {
              select: { quizSets: true },
            },
          },
        },
        questions: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!set) {
      throw new NotFoundException('Deck introuvable');
    }

    const isOwner = Boolean(currentUserId && set.authorId === currentUserId);

    // Statistiques réelles depuis Redis
    let uniquePlayersCount = 0;
    let completedPlaysCount = 0;
    try {
      uniquePlayersCount = await this.redisService.sCard(
        `ugc:deck_unique_players:${setId}`,
      );
      const completedStr = await this.redisService.get<string>(
        `ugc:deck_completed_count:${setId}`,
      );
      completedPlaysCount = completedStr
        ? parseInt(String(completedStr), 10)
        : 0;
    } catch {
      uniquePlayersCount = 0;
      completedPlaysCount = 0;
    }

    uniquePlayersCount = Math.max(
      uniquePlayersCount,
      set.playsCount > 0 ? 1 : 0,
    );

    let hasPlayed = false;
    if (currentUserId) {
      try {
        hasPlayed = await this.redisService.sIsMember(
          `ugc:user_played_decks:${currentUserId}`,
          setId,
        );
      } catch {
        hasPlayed = false;
      }
    }

    // Validation des questions pour déterminer la conformité
    const questionsValidation = set.questions.map((q) => {
      const res = validateUserQuestion(q);
      return {
        id: q.id,
        isValid: res.isValid,
        errors: res.errors,
      };
    });

    const validQuestionsCount = questionsValidation.filter(
      (v) => v.isValid,
    ).length;
    const isPublishable = validQuestionsCount >= MIN_QUESTIONS_FOR_PUBLICATION;
    const missingQuestionsCount = Math.max(
      0,
      MIN_QUESTIONS_FOR_PUBLICATION - validQuestionsCount,
    );

    const quizCount = set.questions.filter((q) => q.gameType === 'QUIZ').length;
    const trueFalseCount = set.questions.filter(
      (q) => q.gameType === 'TRUE_FALSE',
    ).length;
    const hasBilingualQuestions = set.questions.some((q) =>
      Boolean(q.questionMg && q.questionFr),
    );
    const estimatedDurationMinutes = Math.max(
      1,
      Math.ceil((set.questions.length * 15) / 60),
    );

    // ==========================================
    // 1. VUE PROPRIÉTAIRE (Dashboard de gestion)
    // ==========================================
    if (isOwner) {
      const completionRate =
        set.playsCount > 0
          ? Math.round((completedPlaysCount / set.playsCount) * 100)
          : 0;

      return {
        ...set,
        isOwner: true,
        hasPlayed,
        validQuestionsCount,
        requiredQuestionsCount: MIN_QUESTIONS_FOR_PUBLICATION,
        isPublishable,
        missingQuestionsCount,
        questionsValidation,
        // Le propriétaire a accès aux questions complètes avec leurs réponses
        questions: set.questions,
        stats: {
          totalQuestions: set.questions.length,
          validQuestionsCount,
          playsCount: set.playsCount,
          uniquePlayersCount,
          completedPlaysCount,
          completionRate,
          quizCount,
          trueFalseCount,
          hasBilingualQuestions,
          estimatedDurationMinutes,
        },
        _count: {
          questions: set.questions.length,
          sessions: set.playsCount,
        },
      };
    }

    // ==========================================
    // 2. VUE JOUEUR (Protection Anti-triche & Épure)
    // ==========================================
    // Les réponses correctes (answerIndex, isTrue, explanation) sont STRICTEMENT masquées
    const sanitizedQuestions = set.questions.map((q) => ({
      id: q.id,
      quizSetId: q.quizSetId,
      gameType: q.gameType,
      questionMg: q.questionMg,
      questionFr: q.questionFr,
      choices: q.choices,
      // ANTI-TRICHE : answerIndex, isTrue, explanationMg et explanationFr ne sont PAS renvoyés
    }));

    return {
      id: set.id,
      title: set.title,
      description: set.description,
      imageUrl: set.imageUrl,
      category: set.category,
      visibility: set.visibility,
      isPublic: set.isPublic,
      verified: set.verified,
      authorId: set.authorId,
      author: set.author,
      createdAt: set.createdAt,
      updatedAt: set.updatedAt,
      isOwner: false,
      hasPlayed,
      questions: sanitizedQuestions,
      stats: {
        totalQuestions: set.questions.length,
        playsCount: set.playsCount,
        uniquePlayersCount,
        quizCount,
        trueFalseCount,
        hasBilingualQuestions,
        estimatedDurationMinutes,
      },
      _count: {
        questions: set.questions.length,
        sessions: set.playsCount,
      },
    };
  }

  /**
   * Statistiques détaillées réservées au créateur du deck
   */
  async getDeckStats(userId: string, setId: string) {
    const set = await this.prisma.userQuizSet.findUnique({
      where: { id: setId },
      select: {
        id: true,
        title: true,
        authorId: true,
        playsCount: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { questions: true } },
      },
    });

    if (!set) {
      throw new NotFoundException('Deck introuvable');
    }

    if (set.authorId !== userId) {
      throw new ForbiddenException(
        'Seul le créateur du deck peut consulter ses statistiques de gestion',
      );
    }

    let uniquePlayersCount = 0;
    let completedPlaysCount = 0;
    let averageScorePercent = 0;

    try {
      uniquePlayersCount = await this.redisService.sCard(
        `ugc:deck_unique_players:${setId}`,
      );
      const comp = await this.redisService.get<string>(
        `ugc:deck_completed_count:${setId}`,
      );
      completedPlaysCount = comp ? parseInt(String(comp), 10) : 0;

      const totalScore = await this.redisService.get<number>(
        `ugc:deck_score_sum:${setId}`,
      );
      const countScore = await this.redisService.get<number>(
        `ugc:deck_score_count:${setId}`,
      );
      if (totalScore && countScore && countScore > 0) {
        averageScorePercent = Math.round((totalScore / countScore) * 100);
      }
    } catch {
      // Ignorer
    }

    const completionRate =
      set.playsCount > 0
        ? Math.round((completedPlaysCount / set.playsCount) * 100)
        : 0;

    return {
      deckId: set.id,
      title: set.title,
      totalQuestions: set._count.questions,
      playsCount: set.playsCount,
      uniquePlayersCount: Math.max(
        uniquePlayersCount,
        set.playsCount > 0 ? 1 : 0,
      ),
      completedPlaysCount,
      completionRate,
      averageScorePercent,
      createdAt: set.createdAt,
      updatedAt: set.updatedAt,
    };
  }

  /**
   * Mise à jour d'un deck par son auteur
   * Contrôle strict : la publication exige au moins 5 questions valides.
   */
  async updateQuizSet(
    userId: string,
    setId: string,
    dto: Partial<CreateUserQuizSetDto>,
  ) {
    const set = await this.prisma.userQuizSet.findUnique({
      where: { id: setId },
      include: { questions: true },
    });

    if (!set) {
      throw new NotFoundException('Deck introuvable');
    }

    if (set.authorId !== userId) {
      throw new UnauthorizedException(
        'Vous ne pouvez modifier que vos propres decks',
      );
    }

    const willBePublic =
      dto.visibility === DeckVisibility.PUBLIC || dto.isPublic === true;

    if (willBePublic) {
      const validQuestionsCount = set.questions.filter(
        (q) => validateUserQuestion(q).isValid,
      ).length;
      if (validQuestionsCount < MIN_QUESTIONS_FOR_PUBLICATION) {
        throw new BadRequestException(
          `Un deck doit comporter au moins ${MIN_QUESTIONS_FOR_PUBLICATION} questions valides pour être publié (${validQuestionsCount}/${MIN_QUESTIONS_FOR_PUBLICATION} valides. Ajoutez encore ${MIN_QUESTIONS_FOR_PUBLICATION - validQuestionsCount} question(s)).`,
        );
      }
    }

    const visibility = dto.visibility
      ? dto.visibility
      : dto.isPublic !== undefined
        ? dto.isPublic
          ? DeckVisibility.PUBLIC
          : DeckVisibility.LINK_ONLY
        : undefined;

    const isPublic =
      visibility !== undefined
        ? visibility === DeckVisibility.PUBLIC
        : dto.isPublic !== undefined
          ? dto.isPublic
          : undefined;

    return this.prisma.userQuizSet.update({
      where: { id: setId },
      data: {
        ...(dto.title !== undefined ? { title: sanitizeText(dto.title) } : {}),
        ...(dto.description !== undefined
          ? {
              description: dto.description
                ? sanitizeText(dto.description)
                : null,
            }
          : {}),
        ...(dto.imageUrl !== undefined
          ? { imageUrl: dto.imageUrl?.trim() || null }
          : {}),
        ...(dto.category !== undefined
          ? { category: sanitizeText(dto.category) || 'culture_generale' }
          : {}),
        ...(visibility !== undefined ? { visibility } : {}),
        ...(isPublic !== undefined ? { isPublic } : {}),
        updatedAt: new Date(),
      },
      include: {
        questions: true,
      },
    });
  }

  /**
   * Ajout d'une question à un deck existant
   */
  async addQuestion(userId: string, setId: string, dto: CreateUserQuestionDto) {
    const set = await this.prisma.userQuizSet.findUnique({
      where: { id: setId },
      include: { _count: { select: { questions: true } } },
    });

    if (!set) {
      throw new NotFoundException('Deck introuvable');
    }

    if (set.authorId !== userId) {
      throw new UnauthorizedException(
        'Vous ne pouvez ajouter des questions qu’à vos propres decks',
      );
    }

    if (set._count.questions >= 50) {
      throw new BadRequestException(
        'Limite maximale de 50 questions par deck atteinte.',
      );
    }

    const question = await this.prisma.userQuestion.create({
      data: {
        quizSetId: setId,
        gameType: dto.gameType,
        questionMg: sanitizeText(dto.questionMg),
        questionFr: dto.questionFr ? sanitizeText(dto.questionFr) : null,
        isTrue: dto.isTrue,
        choices: Array.isArray(dto.choices)
          ? dto.choices.map((c) => sanitizeText(c)).filter(Boolean)
          : [],
        answerIndex: dto.answerIndex,
        explanationMg: dto.explanationMg
          ? sanitizeText(dto.explanationMg)
          : null,
        explanationFr: dto.explanationFr
          ? sanitizeText(dto.explanationFr)
          : null,
      },
    });

    await this.prisma.userQuizSet.update({
      where: { id: setId },
      data: { updatedAt: new Date() },
    });

    const validation = validateUserQuestion(question);

    return {
      ...question,
      isValid: validation.isValid,
      errors: validation.errors,
    };
  }

  /**
   * Modification d'une question existante (Édition progressive in-situ)
   */
  async updateQuestion(
    userId: string,
    questionId: string,
    dto: UpdateUserQuestionDto,
  ) {
    const question = await this.prisma.userQuestion.findUnique({
      where: { id: questionId },
      include: { quizSet: true },
    });

    if (!question) {
      throw new NotFoundException('Question introuvable');
    }

    if (question.quizSet.authorId !== userId) {
      throw new UnauthorizedException(
        'Vous ne pouvez modifier que les questions de vos propres decks',
      );
    }

    const updated = await this.prisma.userQuestion.update({
      where: { id: questionId },
      data: {
        ...(dto.gameType !== undefined ? { gameType: dto.gameType } : {}),
        ...(dto.questionMg !== undefined
          ? { questionMg: sanitizeText(dto.questionMg) }
          : {}),
        ...(dto.questionFr !== undefined
          ? { questionFr: dto.questionFr ? sanitizeText(dto.questionFr) : null }
          : {}),
        ...(dto.isTrue !== undefined ? { isTrue: dto.isTrue } : {}),
        ...(dto.choices !== undefined
          ? {
              choices: Array.isArray(dto.choices)
                ? dto.choices.map((c) => sanitizeText(c)).filter(Boolean)
                : [],
            }
          : {}),
        ...(dto.answerIndex !== undefined
          ? { answerIndex: dto.answerIndex }
          : {}),
        ...(dto.explanationMg !== undefined
          ? {
              explanationMg: dto.explanationMg
                ? sanitizeText(dto.explanationMg)
                : null,
            }
          : {}),
        ...(dto.explanationFr !== undefined
          ? {
              explanationFr: dto.explanationFr
                ? sanitizeText(dto.explanationFr)
                : null,
            }
          : {}),
        updatedAt: new Date(),
      },
    });

    await this.prisma.userQuizSet.update({
      where: { id: question.quizSetId },
      data: { updatedAt: new Date() },
    });

    const validation = validateUserQuestion(updated);

    return {
      ...updated,
      isValid: validation.isValid,
      errors: validation.errors,
    };
  }

  /**
   * Suppression d'une question
   * Si le deck était public et passe sous les 5 questions valides, il est basculé en DRAFT.
   */
  async deleteQuestion(userId: string, questionId: string) {
    const question = await this.prisma.userQuestion.findUnique({
      where: { id: questionId },
      include: { quizSet: { include: { questions: true } } },
    });

    if (!question) {
      throw new NotFoundException('Question introuvable');
    }

    if (question.quizSet.authorId !== userId) {
      throw new UnauthorizedException(
        'Vous ne pouvez supprimer que vos propres questions',
      );
    }

    await this.prisma.userQuestion.delete({
      where: { id: questionId },
    });

    // Vérifier si le deck passe sous la limite de publication
    const remainingQuestions = question.quizSet.questions.filter(
      (q) => q.id !== questionId,
    );
    const validCount = remainingQuestions.filter(
      (q) => validateUserQuestion(q).isValid,
    ).length;

    let autoUnpublished = false;
    if (
      question.quizSet.isPublic &&
      validCount < MIN_QUESTIONS_FOR_PUBLICATION
    ) {
      await this.prisma.userQuizSet.update({
        where: { id: question.quizSetId },
        data: {
          isPublic: false,
          visibility: DeckVisibility.LINK_ONLY,
          updatedAt: new Date(),
        },
      });
      autoUnpublished = true;
    } else {
      await this.prisma.userQuizSet.update({
        where: { id: question.quizSetId },
        data: { updatedAt: new Date() },
      });
    }

    return {
      success: true,
      remainingCount: remainingQuestions.length,
      validCount,
      autoUnpublished,
      message: autoUnpublished
        ? 'Le deck comporte désormais moins de 5 questions valides et a été basculé en brouillon privé.'
        : undefined,
    };
  }

  /**
   * Suppression sécurisée d'un deck par son auteur
   */
  async deleteQuizSet(userId: string, setId: string) {
    const set = await this.prisma.userQuizSet.findUnique({
      where: { id: setId },
    });

    if (!set) {
      throw new NotFoundException('Deck introuvable');
    }

    if (set.authorId !== userId) {
      throw new UnauthorizedException(
        'Vous ne pouvez supprimer que vos propres decks',
      );
    }

    await this.prisma.userQuizSet.delete({
      where: { id: setId },
    });

    return { success: true };
  }

  /**
   * Enregistrement d'une partie jouée
   * Intégrité : l'auteur ne peut pas jouer à son propre deck.
   * Traçage des parties terminées, joueurs uniques et calcul du score moyen.
   */
  async recordPlay(
    setId: string,
    currentUserId?: string,
    stats?: RecordPlayDto,
  ) {
    const set = await this.prisma.userQuizSet.findUnique({
      where: { id: setId },
      select: { id: true, title: true, authorId: true },
    });

    if (!set) {
      throw new NotFoundException('Deck introuvable');
    }

    // Règle d'intégrité Kanto : l'auteur ne peut jamais jouer à son propre deck
    const isOwner = Boolean(currentUserId && set.authorId === currentUserId);
    if (isOwner) {
      throw new ForbiddenException(
        "Vous êtes l'auteur de ce deck. Vous ne pouvez pas jouer à votre propre création afin de préserver l'équité des scores et des récompenses.",
      );
    }

    const updated = await this.prisma.userQuizSet.update({
      where: { id: setId },
      data: { playsCount: { increment: 1 } },
      select: { id: true, playsCount: true },
    });

    // Enregistrement des statistiques avancées dans Redis
    try {
      if (currentUserId) {
        await this.redisService.sAdd(
          `ugc:deck_unique_players:${setId}`,
          currentUserId,
        );
      }
      if (stats?.completed) {
        await this.redisService.incr(`ugc:deck_completed_count:${setId}`);
      }
      if (
        stats?.correctCount !== undefined &&
        stats?.totalQuestions &&
        stats.totalQuestions > 0
      ) {
        const ratio = stats.correctCount / stats.totalQuestions;
        const currentSum =
          (await this.redisService.get<number>(
            `ugc:deck_score_sum:${setId}`,
          )) || 0;
        await this.redisService.set(
          `ugc:deck_score_sum:${setId}`,
          currentSum + ratio,
        );
        await this.redisService.incr(`ugc:deck_score_count:${setId}`);
      }
    } catch {
      // Ignorer les erreurs de tracking Redis
    }

    // Vérifier si le joueur a déjà joué à ce deck auparavant
    const playedDeckKey = currentUserId
      ? `ugc:user_played_decks:${currentUserId}`
      : null;
    const isAlreadyPlayed = playedDeckKey
      ? await this.redisService.sIsMember(playedDeckKey, setId)
      : false;

    // Règle économique Kanto : Rejouer à un deck déjà joué n'attribue AUCUN XP au joueur
    // et ne crédite aucune royalty au créateur
    if (isAlreadyPlayed) {
      return {
        ...updated,
        isReplay: true,
        canEarnXp: false,
        xpAwarded: 0,
        royaltyGranted: false,
        reason: 'ALREADY_PLAYED_NO_XP',
      };
    }

    // Premier jeu valide : enregistrement persistant dans le set des decks joués
    if (playedDeckKey) {
      await this.redisService.sAdd(playedDeckKey, setId);
    }

    // Calcul et attribution des royalties économiques
    const config = await this.getCoinsEconomyConfig();
    const xpReward = 50;
    let coinsReward = 0;

    const todayStr = new Date().toISOString().slice(0, 10);
    const dailyAuthorCoinsKey = `ugc:coins_earned:${set.authorId}:${todayStr}`;
    const currentDailyCoins =
      (await this.redisService.get<number>(dailyAuthorCoinsKey)) || 0;
    const canEarnCoinToday = currentDailyCoins < (config.ugcDailyCoinsCap || 3);

    const qualifiedPlaysKey = `ugc:qualified_plays:${setId}`;
    const qualifiedPlays =
      ((await this.redisService.get<number>(qualifiedPlaysKey)) || 0) + 1;
    await this.redisService.set(qualifiedPlaysKey, qualifiedPlays);

    const playsPerCoin = Math.max(1, config.ugcPlaysPerCoin || 5);
    if (qualifiedPlays % playsPerCoin === 0 && canEarnCoinToday) {
      coinsReward = 1;
      await this.redisService.set(
        dailyAuthorCoinsKey,
        currentDailyCoins + 1,
        48 * 3600,
      );
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        const currentProgress = await tx.userProgress.findUnique({
          where: { userId: set.authorId },
        });

        const newTotalXp = (currentProgress?.totalXp || 0) + xpReward;
        const newLevel = calculateLevelFromXp(newTotalXp);
        const newCoins = (currentProgress?.coins || 0) + coinsReward;

        await tx.userProgress.upsert({
          where: { userId: set.authorId },
          update: {
            totalXp: newTotalXp,
            level: newLevel,
            coins: newCoins,
          },
          create: {
            userId: set.authorId,
            totalXp: xpReward,
            level: newLevel,
            coins: coinsReward,
            streakDays: 0,
          },
        });

        await tx.xpTransaction.create({
          data: {
            userId: set.authorId,
            amount: xpReward,
            source: 'ugc_deck_play_royalty',
            description: `Partie qualifiée jouée par la communauté sur votre deck "${set.title}"`,
          },
        });
      });

      if (coinsReward > 0 && this.notificationsService) {
        void this.notificationsService
          .createNotification({
            userId: set.authorId,
            titleMg: 'Valisoa mpamorona : Vola voaray ! 🪙',
            titleFr: 'Récompense de créateur : Vola débloqué ! 🪙',
            messageMg: `Nahazo +${coinsReward} Vola sy +${xpReward} XP ianao satria maro ireo mpilalao nandalina ny lalao noforoninao « ${set.title} » !`,
            messageFr: `Félicitations ! Votre jeu personnalisé « ${set.title} » a franchi un palier de joueurs. Vous recevez +${coinsReward} Vola et +${xpReward} XP !`,
            category: 'game',
            badgeText: 'Royalty',
            badgeType: 'reward',
            iconName: 'gift-outline',
            targetRoute: '/(screens)/ugc',
            isBroadcast: false,
          })
          .catch((err) => {
            this.logger.warn(
              `Échec notification royalty pour ${set.authorId}: ${err.message}`,
            );
          });
      }
    } catch (err: any) {
      this.logger.warn(
        `Impossible de créditer les royalties pour l'auteur ${set.authorId}: ${err.message}`,
      );
    }

    return {
      ...updated,
      isReplay: false,
      canEarnXp: true,
      royaltyGranted: true,
      xpAwarded: xpReward,
      coinsAwarded: coinsReward,
    };
  }

  /**
   * Session de jeu Solo : Fournit les questions pour la session de jeu active
   * Vérifie que le joueur n'est pas l'auteur et que le deck a au moins 5 questions valides.
   */
  async getQuizSetForPlay(setId: string, userId: string) {
    const set = await this.prisma.userQuizSet.findUnique({
      where: { id: setId },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        questions: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!set) {
      throw new NotFoundException('Deck introuvable');
    }

    if (set.authorId === userId) {
      throw new ForbiddenException(
        "Vous êtes l'auteur de ce deck. Vous ne pouvez pas jouer à votre propre création afin de préserver l'équité des scores.",
      );
    }

    const validQuestions = set.questions.filter(
      (q) => validateUserQuestion(q).isValid,
    );
    if (validQuestions.length < MIN_QUESTIONS_FOR_PUBLICATION) {
      throw new BadRequestException(
        'Ce deck est incomplet (moins de 5 questions valides) et ne peut pas être joué pour le moment.',
      );
    }

    return {
      id: set.id,
      title: set.title,
      description: set.description,
      imageUrl: set.imageUrl,
      category: set.category,
      author: set.author,
      questions: validQuestions,
    };
  }

  /**
   * Upload d'image de deck depuis l'appareil utilisateur
   */
  async uploadDeckImage(
    userId: string,
    imageBase64: string,
    fileName?: string,
  ): Promise<{ success: boolean; url: string }> {
    if (!imageBase64) {
      throw new BadRequestException('Aucune image fournie');
    }

    let buffer: Buffer;
    let mimeType = 'image/jpeg';

    if (this.cloudinaryService) {
      const decoded =
        this.cloudinaryService.validateAndDecodeBase64Image(imageBase64);
      buffer = decoded.buffer;
      mimeType = decoded.mimeType;
    } else {
      const matches = imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(imageBase64, 'base64');
      }
    }

    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };
    const extension = mimeToExt[mimeType] || 'jpg';
    let finalUrl: string | undefined;

    if (this.cloudinaryService && this.cloudinaryService.isConfigured()) {
      try {
        finalUrl = await this.cloudinaryService.uploadImageBase64(
          imageBase64,
          fileName || `deck_${userId}_${Date.now()}`,
          'kanto/images/decks',
        );
        this.logger.log(`[Cloudinary] Image de deck hébergée : ${finalUrl}`);
      } catch (err: any) {
        this.logger.warn(
          `[Cloudinary] Échec upload deck (${err?.message}). Bascule vers stockage local.`,
        );
      }
    }

    if (!finalUrl) {
      const uploadDir = path.resolve(process.cwd(), 'uploads', 'decks');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const generatedName = `deck-${userId}-${Date.now()}.${extension}`;
      const filePath = path.join(uploadDir, generatedName);
      await fs.promises.writeFile(filePath, buffer);
      finalUrl = `/uploads/decks/${generatedName}`;
      this.logger.log(`[Local] Image de deck enregistrée : ${finalUrl}`);
    }

    return { success: true, url: finalUrl };
  }

  /**
   * Signalement d'un deck utilisateur
   */
  async reportDeck(
    userId: string,
    deckId: string,
    dto: ReportDeckDto,
  ): Promise<{ success: boolean; reportId: string }> {
    const deck = await this.prisma.userQuizSet.findUnique({
      where: { id: deckId },
      select: { id: true, title: true },
    });

    if (!deck) {
      throw new NotFoundException('Deck introuvable');
    }

    const reasonMap: Record<string, ReportReason> = {
      inappropriate: ReportReason.INAPPROPRIATE,
      spam: ReportReason.SPAM,
      misleading: ReportReason.MISLEADING,
      illegal: ReportReason.ILLEGAL,
      translation: ReportReason.TRANSLATION_ERROR,
      spelling: ReportReason.TYPO,
      other: ReportReason.OTHER,
    };

    const normalizedReason =
      reasonMap[dto.reason?.toLowerCase()] ||
      (Object.values(ReportReason).includes(dto.reason as ReportReason)
        ? (dto.reason as ReportReason)
        : ReportReason.OTHER);

    const report = await this.prisma.contentReport.create({
      data: {
        quizSetId: deckId,
        userId: userId || null,
        reason: normalizedReason,
        description: dto.description?.trim() || null,
      },
    });

    this.logger.log(
      `🚩 [UGC Deck] Signalement reçu pour le deck "${deck.title}" (${deckId}) par ${userId} (motif: ${normalizedReason})`,
    );

    return { success: true, reportId: report.id };
  }

  /**
   * Administration : Liste paginée des decks avec filtre et signalements
   */
  async getAdminDecks(
    skip = 0,
    take = 20,
    filter: 'all' | 'verified' | 'unverified' | 'reported' = 'all',
  ) {
    const where: any = {};

    if (filter === 'verified') {
      where.verified = true;
    } else if (filter === 'unverified') {
      where.verified = false;
    } else if (filter === 'reported') {
      where.reports = { some: {} };
    }

    const [decks, total] = await Promise.all([
      this.prisma.userQuizSet.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true, image: true },
          },
          _count: {
            select: { questions: true, reports: true },
          },
          reports: {
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              reason: true,
              description: true,
              createdAt: true,
              user: { select: { id: true, name: true } },
            },
          },
        },
        orderBy:
          filter === 'reported'
            ? [{ reports: { _count: 'desc' } }, { updatedAt: 'desc' }]
            : { updatedAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.userQuizSet.count({ where }),
    ]);

    return { decks, total, skip, take };
  }

  /**
   * Administration : Vérifier ou retirer la vérification d'un deck
   */
  async verifyDeck(deckId: string, verified: boolean, adminUserId: string) {
    const deck = await this.prisma.userQuizSet.findUnique({
      where: { id: deckId },
    });

    if (!deck) {
      throw new NotFoundException('Deck introuvable');
    }

    const updated = await this.prisma.userQuizSet.update({
      where: { id: deckId },
      data: {
        verified,
        verifiedAt: verified ? new Date() : null,
        verifiedBy: verified ? adminUserId : null,
      },
      select: {
        id: true,
        title: true,
        verified: true,
        verifiedAt: true,
        verifiedBy: true,
      },
    });

    this.logger.log(
      `🛡️ [Admin] Deck "${deck.title}" (${deckId}) vérification mise à jour: ${verified} par admin ${adminUserId}`,
    );

    return updated;
  }
}
