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
  DeckVisibility,
  ReportDeckDto,
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

  async createQuizSet(userId: string, dto: CreateUserQuizSetDto) {
    const visibility =
      dto.visibility ||
      (dto.isPublic === false
        ? DeckVisibility.LINK_ONLY
        : DeckVisibility.PUBLIC);
    const isPublic = visibility === DeckVisibility.PUBLIC;

    const set = await this.prisma.userQuizSet.create({
      data: {
        title: dto.title,
        description: dto.description,
        imageUrl: dto.imageUrl?.trim() || null,
        category: dto.category?.trim() || 'culture_generale',
        visibility,
        isPublic,
        authorId: userId,
        questions: {
          create:
            dto.questions?.map((q) => ({
              gameType: q.gameType,
              questionMg: q.questionMg,
              questionFr: q.questionFr,
              isTrue: q.isTrue,
              choices: q.choices || [],
              answerIndex: q.answerIndex,
              explanationMg: q.explanationMg,
              explanationFr: q.explanationFr,
            })) || [],
        },
      },
      include: {
        questions: true,
      },
    });
    return set;
  }

  async getMyQuizSets(userId: string) {
    return await this.prisma.userQuizSet.findMany({
      where: { authorId: userId },
      include: {
        _count: {
          select: { questions: true, sessions: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getPublicQuizSets(
    skip = 0,
    take = 20,
    search?: string,
    sort: 'recent' | 'popular' = 'recent',
    category?: string,
    currentUserId?: string,
  ) {
    const where: any = {
      OR: [
        { visibility: DeckVisibility.PUBLIC },
        { isPublic: true },
      ],
    };
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

    return await this.prisma.userQuizSet.findMany({
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
  }

  async recordPlay(
    setId: string,
    currentUserId?: string,
    stats?: { correctCount?: number; totalQuestions?: number },
  ) {
    const set = await this.prisma.userQuizSet.findUnique({
      where: { id: setId },
      select: { id: true, title: true, authorId: true },
    });
    if (!set) {
      throw new NotFoundException('Quiz set not found');
    }

    const updated = await this.prisma.userQuizSet.update({
      where: { id: setId },
      data: { playsCount: { increment: 1 } },
      select: { id: true, playsCount: true },
    });

    // Si c'est l'auteur : pas de royalties ou d'XP d'abus, mais jeu autorisé
    const isOwner = Boolean(currentUserId && set.authorId === currentUserId);
    if (isOwner) {
      return {
        ...updated,
        royaltyGranted: false,
        reason: 'SELF_PLAY_NO_ROYALTY',
      };
    }
    if (!set.authorId) {
      return {
        ...updated,
        royaltyGranted: false,
        reason: 'SELF_OR_NO_AUTHOR',
      };
    }

    // Garde-fou Barème 1 : Le deck doit comporter au moins 5 questions valides
    const questionCount = await this.prisma.userQuestion.count({
      where: { quizSetId: setId },
    });
    if (questionCount < 5) {
      return {
        ...updated,
        royaltyGranted: false,
        reason: 'MIN_QUESTIONS_NOT_MET',
      };
    }

    // Garde-fou Barème 2 : Taux de réussite minimal (au moins 50% de bonnes réponses pour éviter bots et clics d'abandon)
    if (stats?.totalQuestions && stats.totalQuestions > 0) {
      const successRatio = (stats.correctCount || 0) / stats.totalQuestions;
      if (successRatio < 0.5) {
        return {
          ...updated,
          royaltyGranted: false,
          reason: 'SCORE_TOO_LOW',
        };
      }
    }

    // Récupérer la configuration économique des pièces
    const economyConfig = await this.getCoinsEconomyConfig();
    if (!economyConfig.enabled) {
      return {
        ...updated,
        royaltyGranted: false,
        reason: 'ECONOMY_DISABLED',
      };
    }

    // Garde-fou Barème 3 : Un même joueur ne peut compter qu'une seule fois à vie par deck pour le créateur
    const playerKey = currentUserId || 'guest';
    const deckUniquePlayersKey = `ugc:deck_unique_players:${setId}`;
    const addedToUniqueSet = await this.redisService.sAdd(
      deckUniquePlayersKey,
      playerKey,
    );

    if (addedToUniqueSet === 0) {
      // Ce joueur a déjà été comptabilisé pour ce deck auparavant
      return {
        ...updated,
        royaltyGranted: false,
        reason: 'PLAYER_ALREADY_COUNTED',
      };
    }

    // Règle d'attribution : Le créateur gagne +15 XP par joueur unique qualifié
    const xpReward = 15;
    let coinsReward = 0;

    // Garde-fou Barème 4 : Plafond journalier (max 3 Vola/jour par créateur)
    const todayStr = new Date().toISOString().slice(0, 10);
    const dailyAuthorCoinsKey = `ugc:daily_coins:${set.authorId}:${todayStr}`;
    const currentDailyCoins =
      (await this.redisService.get<number>(dailyAuthorCoinsKey)) || 0;

    const dailyCap = Math.max(0, economyConfig.ugcDailyCoinsCap);
    const canEarnCoinToday = currentDailyCoins < dailyCap;

    // Pas de plafond viager par deck : un deck populaire peut continuer à rapporter sans limite si de nouveaux joueurs y jouent
    const qualifiedPlaysKey = `ugc:qualified_plays:${setId}`;
    const qualifiedPlays =
      ((await this.redisService.get<number>(qualifiedPlaysKey)) || 0) + 1;
    await this.redisService.set(qualifiedPlaysKey, qualifiedPlays);

    const playsPerCoin = Math.max(1, economyConfig.ugcPlaysPerCoin);
    // Dès que le palier (ex: 5 joueurs uniques) est franchi -> +1 Vola si plafond journalier non atteint
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

      // Notification au créateur : envoyée lorsqu'une pièce est débloquée
      if (coinsReward > 0 && this.notificationsService) {
        void this.notificationsService
          .createNotification({
            userId: set.authorId,
            titleMg: 'Valisoa mpamorona : Vola voaray !',
            titleFr: 'Récompense de créateur : Vola débloqué !',
            messageMg: `Nahazo +${coinsReward} Vola sy +${xpReward} XP ianao satria nahatratra mpilalao 5 vaovao ny deck-nao « ${set.title} » !`,
            messageFr: `Vous avez reçu +${coinsReward} Vola et +${xpReward} XP car votre deck « ${set.title} » a franchi 5 nouveaux joueurs !`,
            category: 'game',
            badgeText: 'Royalty',
            badgeType: 'new',
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
      royaltyGranted: true,
      xpAwarded: xpReward,
      coinsAwarded: coinsReward,
    };
  }

  async getQuizSetById(setId: string) {
    const set = await this.prisma.userQuizSet.findUnique({
      where: { id: setId },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        questions: true,
      },
    });

    if (!set) {
      throw new NotFoundException('Quiz set not found');
    }

    return set;
  }

  async deleteQuizSet(userId: string, setId: string) {
    const set = await this.prisma.userQuizSet.findUnique({
      where: { id: setId },
    });

    if (!set) {
      throw new NotFoundException('Quiz set not found');
    }

    if (set.authorId !== userId) {
      throw new UnauthorizedException('You can only delete your own quiz sets');
    }

    await this.prisma.userQuizSet.delete({
      where: { id: setId },
    });

    return { success: true };
  }

  async updateQuizSet(
    userId: string,
    setId: string,
    dto: Partial<CreateUserQuizSetDto>,
  ) {
    const set = await this.prisma.userQuizSet.findUnique({
      where: { id: setId },
    });

    if (!set) {
      throw new NotFoundException('Quiz set not found');
    }

    if (set.authorId !== userId) {
      throw new UnauthorizedException('You can only update your own quiz sets');
    }

    const willBePublic =
      dto.visibility === DeckVisibility.PUBLIC || dto.isPublic === true;

    if (willBePublic) {
      const questionCount = await this.prisma.userQuestion.count({
        where: { quizSetId: setId },
      });
      if (questionCount < 5) {
        throw new BadRequestException(
          'Un deck doit comporter au moins 5 questions pour être rendu public ou jouable.',
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
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description }
          : {}),
        ...(dto.imageUrl !== undefined
          ? { imageUrl: dto.imageUrl?.trim() || null }
          : {}),
        ...(dto.category !== undefined
          ? { category: dto.category?.trim() || 'culture_generale' }
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

  async addQuestion(userId: string, setId: string, dto: CreateUserQuestionDto) {
    const set = await this.prisma.userQuizSet.findUnique({
      where: { id: setId },
    });

    if (!set) {
      throw new NotFoundException('Quiz set not found');
    }

    if (set.authorId !== userId) {
      throw new UnauthorizedException(
        'You can only add questions to your own quiz sets',
      );
    }

    const question = await this.prisma.userQuestion.create({
      data: {
        quizSetId: setId,
        gameType: dto.gameType,
        questionMg: dto.questionMg,
        questionFr: dto.questionFr,
        isTrue: dto.isTrue,
        choices: dto.choices || [],
        answerIndex: dto.answerIndex,
        explanationMg: dto.explanationMg,
        explanationFr: dto.explanationFr,
      },
    });

    // Update updatedAt of the set
    await this.prisma.userQuizSet.update({
      where: { id: setId },
      data: { updatedAt: new Date() },
    });

    return question;
  }

  async deleteQuestion(userId: string, questionId: string) {
    const question = await this.prisma.userQuestion.findUnique({
      where: { id: questionId },
      include: { quizSet: true },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.quizSet.authorId !== userId) {
      throw new UnauthorizedException('You can only delete your own questions');
    }

    await this.prisma.userQuestion.delete({
      where: { id: questionId },
    });

    // Update updatedAt of the set
    await this.prisma.userQuizSet.update({
      where: { id: question.quizSetId },
      data: { updatedAt: new Date() },
    });

    return { success: true };
  }

  /**
   * Upload d'image de deck depuis l'appareil utilisateur
   * Utilise Cloudinary en priorité avec bascule sur le stockage local uploads/decks/
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
