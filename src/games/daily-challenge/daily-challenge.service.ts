import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';
import {
  DailyChallengeType,
  DailyChallengePublicDto,
  SubmitDailyAnswerDto,
  DailyChallengeAnswerResultDto,
} from './dto/daily-challenge.dto.js';
import { deterministicShuffle } from '../multiplayer/multiplayer.service.js';

interface DailySecretMeta {
  type: DailyChallengeType;
  id: string;
  correctAnswerText: string;
  correctAnswerIndex?: number;
  explanationMg: string;
  explanationFr: string;
  clue?: string | null;
}

@Injectable()
export class DailyChallengeService {
  private readonly logger = new Logger(DailyChallengeService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Retourne la date locale au format YYYY-MM-DD
   */
  getTodayDateString(date: Date = new Date()): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Calcule le numéro de jour dans l'année (1 à 366)
   */
  private getDayOfYear(date: Date): number {
    const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const diff = date.getTime() - startOfYear.getTime();
    return Math.floor(diff / 86400000) + 1;
  }

  /**
   * Hachage déterministe d'une chaîne pour la sélection aléatoire reproductible
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    return hash;
  }

  /**
   * Récupère le défi du jour avec rotation dynamique entre Quiz, Vrai/Faux et Devinettes.
   * Règle stricte Kanto MG :
   * - Ne jamais proposer le même type deux jours d'affilée.
   * - Vérifier le volume réel de questions disponibles en base.
   * - Mélanger équitablement les options des Quiz (suppression du biais A).
   */
  async getDailyChallenge(
    targetDateStr?: string,
  ): Promise<DailyChallengePublicDto> {
    const dateStr = targetDateStr || this.getTodayDateString();
    const cacheKeyPublic = `daily_challenge:public:${dateStr}`;

    const cachedPublic =
      await this.redis.get<DailyChallengePublicDto>(cacheKeyPublic);
    if (cachedPublic) {
      return cachedPublic;
    }

    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, day));
    const dayOfYear = this.getDayOfYear(dateObj);

    // Ordre de rotation des modes
    const ROTATION_MODES: DailyChallengeType[] = [
      DailyChallengeType.QUIZ,
      DailyChallengeType.TRUE_FALSE,
      DailyChallengeType.RIDDLE,
    ];

    // Vérifier les effectifs de chaque mode dans la base
    const [quizCount, tfCount, riddleCount] = await Promise.all([
      this.prisma.civicQuizQuestion.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.trueFalseQuestion.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.riddleQuestion.count({ where: { status: 'PUBLISHED' } }),
    ]);

    const counts: Record<DailyChallengeType, number> = {
      [DailyChallengeType.QUIZ]: quizCount,
      [DailyChallengeType.TRUE_FALSE]: tfCount,
      [DailyChallengeType.RIDDLE]: riddleCount,
    };

    // Sélection du mode par rotation séquentielle quotidienne
    let selectedMode = ROTATION_MODES[dayOfYear % ROTATION_MODES.length];

    // Si le mode sélectionné n'a aucune question disponible, basculer vers un mode disponible
    if (counts[selectedMode] === 0) {
      const fallbackMode = ROTATION_MODES.find((m) => counts[m] > 0);
      if (!fallbackMode) {
        throw new NotFoundException(
          'Aucun contenu de jeu disponible pour le défi du jour.',
        );
      }
      selectedMode = fallbackMode;
    }

    let publicDto: DailyChallengePublicDto;
    let secretMeta: DailySecretMeta;

    const seedStr = `${dateStr}:${selectedMode}`;
    const hash = this.hashString(seedStr);

    if (selectedMode === DailyChallengeType.QUIZ) {
      const total = counts[DailyChallengeType.QUIZ];
      const offset = hash % total;
      const question = await this.prisma.civicQuizQuestion.findFirst({
        where: { status: 'PUBLISHED' },
        skip: offset,
        take: 1,
        orderBy: { id: 'asc' },
      });

      if (!question) {
        throw new NotFoundException('Question de quiz indisponible');
      }

      const originalCorrect = question.choices[question.answerIndex];
      // Mélange déterministe équitable des 4 choix (Fisher-Yates basé sur seedStr)
      const shuffledChoices = deterministicShuffle(question.choices, seedStr);
      const newAnswerIndex = shuffledChoices.indexOf(originalCorrect);

      publicDto = {
        date: dateStr,
        type: DailyChallengeType.QUIZ,
        titleFr: 'Défi du jour • Quiz Culturel',
        titleMg: 'Fanamby anio • Quiz Kolontsaina',
        badgeLabelFr: 'QUIZ DU JOUR • +15 XP',
        badgeLabelMg: 'QUIZ ANIO • +15 XP',
        id: question.id,
        promptFr: question.prompt,
        promptMg: question.prompt,
        options: shuffledChoices,
        coverImage: question.imageUrl || undefined,
        xpReward: 15,
      };

      secretMeta = {
        type: DailyChallengeType.QUIZ,
        id: question.id,
        correctAnswerText: originalCorrect,
        correctAnswerIndex: newAnswerIndex,
        explanationMg:
          question.explanationMg ||
          question.explanation ||
          'Valiny marina sy fanazavana ara-kolontsaina.',
        explanationFr: question.explanation,
        clue: question.explanation ? question.explanation.slice(0, 80) + '...' : null,
      };
    } else if (selectedMode === DailyChallengeType.TRUE_FALSE) {
      const total = counts[DailyChallengeType.TRUE_FALSE];
      const offset = hash % total;
      const question = await this.prisma.trueFalseQuestion.findFirst({
        where: { status: 'PUBLISHED' },
        skip: offset,
        take: 1,
        orderBy: { id: 'asc' },
      });

      if (!question) {
        throw new NotFoundException('Question Vrai/Faux indisponible');
      }

      const promptFr =
        question.questionFr && question.questionFr.trim().length > 0
          ? question.questionFr
          : question.questionMg;

      const correctLabel = question.isTrue ? 'Marina' : 'Diso';

      publicDto = {
        date: dateStr,
        type: DailyChallengeType.TRUE_FALSE,
        titleFr: 'Défi du jour • Vrai ou Faux',
        titleMg: 'Fanamby anio • Marina sa Diso',
        badgeLabelFr: 'VRAI OU FAUX • +15 XP',
        badgeLabelMg: 'MARINA SA DISO • +15 XP',
        id: question.id,
        promptFr,
        promptMg: question.questionMg,
        options: ['Marina', 'Diso'],
        coverImage: question.image || undefined,
        xpReward: 15,
      };

      secretMeta = {
        type: DailyChallengeType.TRUE_FALSE,
        id: question.id,
        correctAnswerText: correctLabel,
        explanationMg:
          question.explanationMg ||
          question.explanationTrueMg ||
          question.explanationFalseMg ||
          '',
        explanationFr:
          question.explanationFr ||
          question.explanationTrueFr ||
          question.explanationFalseFr ||
          question.explanationMg ||
          '',
      };
    } else {
      // Ankamantatra (Devinettes)
      const total = counts[DailyChallengeType.RIDDLE];
      const offset = hash % total;
      const question = await this.prisma.riddleQuestion.findFirst({
        where: { status: 'PUBLISHED' },
        skip: offset,
        take: 1,
        orderBy: { id: 'asc' },
      });

      if (!question) {
        throw new NotFoundException('Devinette indisponible');
      }

      // Si la devinette a des options, on les mélange de manière équitable
      let options = question.options || [];
      if (!options.includes(question.correctAnswer)) {
        options = [question.correctAnswer, ...options].slice(0, 4);
      }
      const shuffledOptions = deterministicShuffle(options, seedStr);

      publicDto = {
        date: dateStr,
        type: DailyChallengeType.RIDDLE,
        titleFr: 'Défi du jour • Devinette Ancestrale',
        titleMg: 'Fanamby anio • Ankamantatra',
        badgeLabelFr: 'ANKAMANTATRA • +15 XP',
        badgeLabelMg: 'ANKAMANTATRA • +15 XP',
        id: question.id,
        promptFr: question.riddleFr || question.riddleMg,
        promptMg: question.riddleMg,
        options: shuffledOptions,
        clue: question.clue,
        coverImage: question.imageUrl || undefined,
        xpReward: 15,
      };

      secretMeta = {
        type: DailyChallengeType.RIDDLE,
        id: question.id,
        correctAnswerText: question.correctAnswer,
        explanationMg: question.explanation,
        explanationFr: question.explanation,
        clue: question.clue,
      };
    }

    // Mise en cache Redis pour 48 heures (2 jours de marge)
    await Promise.all([
      this.redis.set(cacheKeyPublic, publicDto, 172800),
      this.redis.set(
        `daily_challenge:secret:${dateStr}:${publicDto.id}`,
        secretMeta,
        172800,
      ),
    ]);

    this.logger.log(
      `🎯 [DailyChallenge] Défi du jour généré pour ${dateStr} : Mode=${selectedMode}, ID=${publicDto.id}`,
    );

    return publicDto;
  }

  /**
   * Soumission et validation sécurisée de la réponse au défi du jour
   */
  async submitAnswer(
    userId: string | undefined,
    dto: SubmitDailyAnswerDto,
  ): Promise<DailyChallengeAnswerResultDto> {
    const dateStr = dto.date || this.getTodayDateString();
    const cacheKeySecret = `daily_challenge:secret:${dateStr}:${dto.questionId}`;

    let secretMeta = await this.redis.get<DailySecretMeta>(cacheKeySecret);

    // Si absent du cache Redis, on regénère le défi du jour pour reconstituer le secret
    if (!secretMeta) {
      await this.getDailyChallenge(dateStr);
      secretMeta = await this.redis.get<DailySecretMeta>(cacheKeySecret);
    }

    if (!secretMeta) {
      throw new NotFoundException('Défi du jour expiré ou introuvable.');
    }

    const cleanUserAnswer = (dto.userAnswer || '').trim().toLowerCase();
    const cleanExpected = secretMeta.correctAnswerText.trim().toLowerCase();

    let isCorrect = false;

    if (secretMeta.type === DailyChallengeType.TRUE_FALSE) {
      // Supporte "Marina" / "Diso", "Vrai" / "Faux", "true" / "false"
      const isExpectedTrue = cleanExpected === 'marina' || cleanExpected === 'true' || cleanExpected === 'vrai';
      const isUserTrue = cleanUserAnswer === 'marina' || cleanUserAnswer === 'true' || cleanUserAnswer === 'vrai';
      const isUserFalse = cleanUserAnswer === 'diso' || cleanUserAnswer === 'false' || cleanUserAnswer === 'faux';

      if (isExpectedTrue && isUserTrue) isCorrect = true;
      else if (!isExpectedTrue && isUserFalse) isCorrect = true;
    } else if (secretMeta.type === DailyChallengeType.QUIZ) {
      // Compare par valeur textuelle ou par index d'option (0, 1, 2, 3)
      const userIndex = parseInt(dto.userAnswer, 10);
      isCorrect =
        cleanUserAnswer === cleanExpected ||
        (!isNaN(userIndex) && userIndex === secretMeta.correctAnswerIndex);
    } else {
      // RIDDLE
      isCorrect =
        cleanUserAnswer === cleanExpected ||
        cleanExpected.includes(cleanUserAnswer);
    }

    let xpAwarded = 0;

    if (isCorrect && userId) {
      const todayChallengeKey = `daily_xp_awarded:${userId}:${dateStr}`;
      const alreadyAwarded = await this.redis.get<string>(todayChallengeKey);

      if (!alreadyAwarded) {
        xpAwarded = 15;
        await this.redis.set(todayChallengeKey, '1', 86400);

        try {
          await this.prisma.userProgress.upsert({
            where: { userId },
            update: { totalXp: { increment: 15 } },
            create: { userId, totalXp: 15 },
          });

          await this.prisma.xpTransaction.create({
            data: {
              userId,
              amount: 15,
              source: 'GAME_DAILY_CHALLENGE',
              description: `Fanamby anio (${dateStr}) relevé avec succès (+15 XP) 🌟`,
            },
          });
        } catch (err: unknown) {
          this.logger.warn(`Erreur lors de l'attribution d'XP au défi : ${String(err)}`);
        }
      }
    }

    return {
      isCorrect,
      correctAnswer: secretMeta.correctAnswerText,
      correctAnswerIndex: secretMeta.correctAnswerIndex,
      explanationMg: secretMeta.explanationMg,
      explanationFr: secretMeta.explanationFr,
      clue: secretMeta.clue,
      xpAwarded,
    };
  }
}

