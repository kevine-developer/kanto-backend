import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';
import { NotificationsService } from '../../notifications/notifications.service.js';
import {
  CreateMultiplayerGameDto,
  MultiplayerGameTypeEnum,
  JoinMultiplayerGameDto,
  StartMultiplayerGameDto,
  SubmitMultiplayerAnswerDto,
} from './dto/multiplayer.dto.js';
import { REALTIME_CHANNELS } from '../../realtime/realtime.constants.js';

export interface PublicMultiplayerQuestion {
  id: string;
  orderIndex: number;
  questionText: string;
  questionTextFr?: string;
  gameType: MultiplayerGameTypeEnum;
  choices: string[];
  imageUrl?: string | null;
  timeLimitSec?: number;
  points?: number;
}

export interface MultiplayerPlayerPublic {
  userId: string;
  name: string;
  avatar: string | null;
  score: number;
  streak: number;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
  answersCount: number;
  rank: number | null;
  previousRank: number | null;
  hasAnsweredCurrent: boolean;
  earnedXp: number;
}

@Injectable()
export class MultiplayerService {
  private readonly logger = new Logger(MultiplayerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Génère un code de salon de 6 caractères non ambigus (chiffres et lettres majuscules).
   */
  private generateRoomCode(): string {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Enregistre ou bascule le mode Animateur (Spectateur) pour l'hôte d'un salon.
   */
  async setHostSpectator(code: string, isSpectator: boolean): Promise<boolean> {
    const cleanCode = code.trim().toUpperCase();
    await this.redisService.set(
      `duel:spectator:${cleanCode}`,
      isSpectator ? '1' : '0',
      7200,
    );
    this.logger.log(
      `🎭 [MultiplayerService] Hôte du salon ${cleanCode} spectateur = ${isSpectator}`,
    );
    return isSpectator;
  }

  /**
   * Vérifie si l'hôte du salon est en mode Animateur (Spectateur non participant).
   */
  async isHostSpectator(code: string): Promise<boolean> {
    const cleanCode = code.trim().toUpperCase();
    const val = await this.redisService.get<string>(
      `duel:spectator:${cleanCode}`,
    );
    return val === '1';
  }

  /**
   * Détails de régie de la question courante pour l'hôte animateur (bonne réponse et explications).
   */
  async getHostQuestionDetails(code: string, questionIndex: number) {
    const cleanCode = code.trim().toUpperCase();
    const session = await this.prisma.duelSession.findUnique({
      where: { code: cleanCode },
    });
    if (!session || questionIndex >= session.questionIds.length) {
      return null;
    }
    const qId = session.questionIds[questionIndex];
    let correctAnswer = '';
    let explanationMg: string | null = null;
    let explanationFr: string | null = null;

    if (session.gameType === 'TRUE_FALSE') {
      const q = await this.prisma.trueFalseQuestion.findUnique({
        where: { id: qId },
      });
      if (q) {
        correctAnswer = q.isTrue ? 'true' : 'false';
        explanationMg = q.explanationMg;
        explanationFr = q.explanationFr;
      }
    } else if (session.gameType === 'QUIZ') {
      const q = await this.prisma.civicQuizQuestion.findUnique({
        where: { id: qId },
      });
      if (q) {
        correctAnswer = q.choices[q.answerIndex] ?? '';
        explanationMg = q.explanation;
        explanationFr = q.explanation;
      }
    } else {
      const q = await this.prisma.missingWordQuestion.findUnique({
        where: { id: qId },
      });
      if (q) {
        correctAnswer = q.correctWord;
        explanationMg = q.explanation;
        explanationFr = q.french;
      }
    }

    return {
      correctAnswer,
      explanationMg,
      explanationFr,
    };
  }

  /**
   * Sélectionne des identifiants de questions pour un salon selon le mode et le thème.
   * Si le filtre par thème renvoie moins de questions que requis, complète avec les questions publiées disponibles.
   */
  private async pickQuestions(
    gameType: MultiplayerGameTypeEnum | string,
    theme: string = 'ALL',
    totalQuestions: number = 5,
  ): Promise<string[]> {
    const cleanTheme = (theme || 'ALL').toUpperCase();
    let selectedIds: string[] = [];

    if (
      gameType === MultiplayerGameTypeEnum.TRUE_FALSE ||
      gameType === 'TRUE_FALSE'
    ) {
      const validTfThemes = ['GEN', 'CULT', 'GEO', 'HIST', 'LITT', 'PROV'];
      let available: { id: string }[] = [];

      if (cleanTheme !== 'ALL' && validTfThemes.includes(cleanTheme)) {
        available = await this.prisma.trueFalseQuestion.findMany({
          where: { status: 'PUBLISHED', theme: cleanTheme as any },
          select: { id: true },
        });
      }

      // Si pas assez de questions avec le thème, ou si theme === 'ALL'
      if (available.length < totalQuestions) {
        const remainingNeeded = totalQuestions - available.length;
        const existingIds = available.map((q) => q.id);
        const additional = await this.prisma.trueFalseQuestion.findMany({
          where: {
            status: 'PUBLISHED',
            id: { notIn: existingIds },
          },
          select: { id: true },
        });
        const shuffledAdditional = [...additional].sort(
          () => Math.random() - 0.5,
        );
        available = [
          ...available,
          ...shuffledAdditional.slice(0, remainingNeeded),
        ];
      }

      const shuffled = [...available].sort(() => Math.random() - 0.5);
      selectedIds = shuffled.slice(0, totalQuestions).map((q) => q.id);
    } else if (
      gameType === MultiplayerGameTypeEnum.QUIZ ||
      gameType === 'QUIZ'
    ) {
      // Mapping des clés de thèmes vers les catégories possibles en base
      const QUIZ_THEME_CATEGORIES: Record<string, string[]> = {
        GEO: ['geographie_regions', 'GEO'],
        GEOGRAPHIE_REGIONS: ['geographie_regions', 'GEO'],
        HIST: ['histoire_royaumes', 'symboles_histoire', 'HIST'],
        HISTOIRE_ROYAUMES: ['histoire_royaumes', 'symboles_histoire', 'HIST'],
        CULT: ['coutumes_fady', 'CULT'],
        COUTUMES_FADY: ['coutumes_fady', 'CULT'],
        LITT: ['arts_musique_saveurs', 'LITT'],
        ARTS_MUSIQUE_SAVEURS: ['arts_musique_saveurs', 'LITT'],
        PROV: ['enigmes_sagesse', 'PROV'],
        ENIGMES_SAGESSE: ['enigmes_sagesse', 'PROV'],
        GEN: [
          'citoyennete_fihavanana',
          'droits_devoirs_vote',
          'droits-et-vote',
          'civic-institution',
          'GEN',
        ],
        CITOYENNETE_FIHAVANANA: [
          'citoyennete_fihavanana',
          'droits_devoirs_vote',
          'droits-et-vote',
          'civic-institution',
          'GEN',
        ],
      };

      const categories = QUIZ_THEME_CATEGORIES[cleanTheme] || null;
      let available: { id: string }[] = [];

      if (cleanTheme !== 'ALL' && categories && categories.length > 0) {
        available = await this.prisma.civicQuizQuestion.findMany({
          where: {
            status: 'PUBLISHED',
            category: { in: categories },
          },
          select: { id: true },
        });
      }

      // Si pas assez de questions avec le thème, ou si theme === 'ALL'
      if (available.length < totalQuestions) {
        const remainingNeeded = totalQuestions - available.length;
        const existingIds = available.map((q) => q.id);
        const additional = await this.prisma.civicQuizQuestion.findMany({
          where: {
            status: 'PUBLISHED',
            id: { notIn: existingIds },
          },
          select: { id: true },
        });
        const shuffledAdditional = [...additional].sort(
          () => Math.random() - 0.5,
        );
        available = [
          ...available,
          ...shuffledAdditional.slice(0, remainingNeeded),
        ];
      }

      const shuffled = [...available].sort(() => Math.random() - 0.5);
      selectedIds = shuffled.slice(0, totalQuestions).map((q) => q.id);
    } else {
      const available = await this.prisma.missingWordQuestion.findMany({
        where: { status: 'PUBLISHED' },
        select: { id: true },
      });
      const shuffled = [...available].sort(() => Math.random() - 0.5);
      selectedIds = shuffled.slice(0, totalQuestions).map((q) => q.id);
    }

    if (selectedIds.length === 0) {
      throw new BadRequestException(
        'Aucune question disponible pour ce mode de jeu.',
      );
    }

    return selectedIds;
  }

  /**
   * Crée un nouveau salon multijoueur (Max 10 joueurs).
   */
  async createGame(userId: string, dto: CreateMultiplayerGameDto) {
    if (!userId || userId.startsWith('guest_')) {
      throw new UnauthorizedException(
        'Seuls les utilisateurs connectés peuvent créer un salon multijoueur.',
      );
    }

    const gameType = dto.gameType || MultiplayerGameTypeEnum.TRUE_FALSE;
    const totalQuestions = Math.min(Math.max(dto.totalQuestions || 5, 3), 15);
    const timePerQuestion = dto.timePerQuestion || 15;

    // Récupérer le profil utilisateur connecté
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, image: true },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Utilisateur introuvable. Veuillez vous connecter pour jouer en multijoueur.',
      );
    }

    const playerName = dto.userName || user.name || 'Mpilalao 1';
    const playerAvatar = dto.userAvatar || user.image || null;
    const theme = dto.theme || 'ALL';
    // Si l'hôte délègue le choix à l'adversaire dès la création
    const themeChooserId =
      dto.themeChooserId ||
      (dto.opponentId && dto.themeChooserId === dto.opponentId
        ? dto.opponentId
        : userId);

    // Sélectionner des questions filtrées par thème selon le mode de jeu
    const questionIds = await this.pickQuestions(gameType, theme, totalQuestions);

    // Générer un code unique
    let code = this.generateRoomCode();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await this.prisma.duelSession.findUnique({
        where: { code },
      });
      if (!existing) break;
      code = this.generateRoomCode();
      attempts++;
    }

    // Créer la session et enregistrer le créateur en tant qu'Hôte
    const session = await this.prisma.duelSession.create({
      data: {
        code,
        gameType,
        status: 'WAITING',
        player1Id: userId,
        player1Name: playerName,
        player1Avatar: playerAvatar,
        totalQuestions: questionIds.length,
        timePerQuestion,
        maxPlayers: 10,
        currentQuestionIndex: 0,
        theme,
        themeChooserId,
        questionIds,
        players: {
          create: {
            userId,
            name: playerName,
            avatar: playerAvatar,
            isHost: true,
            score: 0,
            streak: 0,
            rank: 1,
          },
        },
      },
      include: {
        players: true,
      },
    });

    this.logger.log(
      `🎮 [Multiplayer] Salon créé avec le code ${code} par ${userId} (Hôte, thème: ${theme}, chooser: ${themeChooserId})`,
    );

    // Envoi asynchrone d'une notification push & in-app au joueur défié
    if (dto.opponentId && dto.opponentId !== userId) {
      void (async () => {
        try {
          const opponent = await this.prisma.user.findUnique({
            where: { id: dto.opponentId },
            select: { id: true, name: true },
          });
          if (opponent) {
            const gameLabelFr =
              gameType === MultiplayerGameTypeEnum.QUIZ
                ? 'Quiz'
                : gameType === MultiplayerGameTypeEnum.TRUE_FALSE
                  ? 'Vrai ou Faux'
                  : 'Mot Manquant';
            const gameLabelMg =
              gameType === MultiplayerGameTypeEnum.QUIZ
                ? 'Quiz'
                : gameType === MultiplayerGameTypeEnum.TRUE_FALSE
                  ? 'Marina sa Diso'
                  : 'Teny Mikorontana';

            await this.notificationsService.createNotification({
              userId: opponent.id,
              isBroadcast: false,
              titleMg: `Fanamby vaovao : ${gameLabelMg} !`,
              titleFr: `Nouveau défi : ${gameLabelFr} !`,
              messageMg: `${playerName} dia manasa anao hifaninana amin'ny ${gameLabelMg} ! Hanaiky sa handà ny fanamby ? (Kaody: ${code})`,
              messageFr: `${playerName} vous défie sur un ${gameLabelFr} ! Accepter ou refuser le défi. (Code : ${code})`,
              category: 'duel',
              badgeText: 'Défi',
              badgeType: 'duel',
              iconName: 'game-controller-outline',
              iconColor: '#E05615',
              targetRoute: `/(screens)/gamesAllScreen/multiplayerGame?code=${code}`,
            });
            this.logger.log(
              `⚔️ [Multiplayer] Notification et push envoyées à l'adversaire ${opponent.id} (${opponent.name}) pour le salon ${code}`,
            );
          }
        } catch (notifErr) {
          this.logger.warn(
            `⚠️ [Multiplayer] Impossible d'envoyer la notification de défi à ${dto.opponentId}:`,
            notifErr,
          );
        }
      })();
    }

    const questions = await this.getPublicQuestions(
      session.gameType as MultiplayerGameTypeEnum,
      questionIds,
    );

    return {
      session,
      questions,
      players: session.players,
    };
  }

  // Alias rétrocompatibilité
  async createDuel(userId: string, dto: CreateMultiplayerGameDto) {
    return this.createGame(userId, dto);
  }

  /**
   * Modifie le thème d'un salon multijoueur (en phase d'attente) et regénère les questions.
   * Seul le joueur qui a actuellement la main (themeChooserId ou hôte) peut effectuer cette action.
   */
  async changeTheme(code: string, userId: string, newTheme: string) {
    const cleanCode = code.trim().toUpperCase();
    const session = await this.prisma.duelSession.findUnique({
      where: { code: cleanCode },
      include: { players: true },
    });

    if (!session) {
      throw new NotFoundException(`Salon ${cleanCode} introuvable.`);
    }

    if (session.status !== 'WAITING') {
      throw new BadRequestException(
        'Impossible de changer de thème après le démarrage de la partie.',
      );
    }

    // Vérification des droits : l'utilisateur doit être le détenteur de la main
    const currentChooserId = session.themeChooserId || session.player1Id;
    if (currentChooserId !== userId) {
      throw new ForbiddenException(
        "Vous n'avez pas la main pour choisir le thème de ce salon.",
      );
    }

    // Piocher de nouvelles questions pour ce thème
    const questionIds = await this.pickQuestions(
      session.gameType as MultiplayerGameTypeEnum,
      newTheme,
      session.totalQuestions,
    );

    const updatedSession = await this.prisma.duelSession.update({
      where: { code: cleanCode },
      data: {
        theme: newTheme,
        questionIds,
        totalQuestions: questionIds.length,
      },
      include: { players: true },
    });

    const questions = await this.getPublicQuestions(
      updatedSession.gameType as MultiplayerGameTypeEnum,
      questionIds,
    );

    this.logger.log(
      `🎨 [Multiplayer] Thème du salon ${cleanCode} mis à jour : ${newTheme} par ${userId}`,
    );

    return {
      session: updatedSession,
      questions,
      players: updatedSession.players,
    };
  }

  async changeDuelTheme(code: string, userId: string, newTheme: string) {
    return this.changeTheme(code, userId, newTheme);
  }

  /**
   * Délègue ou transfère la main du choix de thème à un autre joueur du salon.
   */
  async delegateThemeChoice(
    code: string,
    userId: string,
    targetUserId?: string,
  ) {
    const cleanCode = code.trim().toUpperCase();
    const session = await this.prisma.duelSession.findUnique({
      where: { code: cleanCode },
      include: { players: true },
    });

    if (!session) {
      throw new NotFoundException(`Salon ${cleanCode} introuvable.`);
    }

    if (session.status !== 'WAITING') {
      throw new BadRequestException(
        'Impossible de transférer la main après le début du jeu.',
      );
    }

    const currentChooserId = session.themeChooserId || session.player1Id;
    // Seul l'hôte ou le détenteur actuel peut passer la main
    if (userId !== currentChooserId && userId !== session.player1Id) {
      throw new ForbiddenException(
        "Vous n'avez pas les droits pour transférer le choix du thème.",
      );
    }

    let recipientId = targetUserId;
    if (!recipientId) {
      // Trouver un joueur adverse connecté
      const otherPlayer = session.players.find((p) => p.userId !== userId);
      if (otherPlayer) {
        recipientId = otherPlayer.userId;
      } else if (session.player2Id && session.player2Id !== userId) {
        recipientId = session.player2Id;
      }
    }

    if (!recipientId) {
      throw new BadRequestException(
        "Aucun autre joueur n'est présent dans le salon pour recevoir la main.",
      );
    }

    const updatedSession = await this.prisma.duelSession.update({
      where: { code: cleanCode },
      data: {
        themeChooserId: recipientId,
      },
      include: { players: true },
    });

    const recipientPlayer = updatedSession.players.find(
      (p) => p.userId === recipientId,
    );
    const recipientName =
      recipientPlayer?.name || updatedSession.player2Name || 'Adversaire';

    this.logger.log(
      `🤝 [Multiplayer] Choix de thème délégué à ${recipientName} (${recipientId}) pour le salon ${cleanCode}`,
    );

    const questions = await this.getPublicQuestions(
      updatedSession.gameType as MultiplayerGameTypeEnum,
      updatedSession.questionIds,
    );

    return {
      session: updatedSession,
      questions,
      players: updatedSession.players,
      newChooserId: recipientId,
      newChooserName: recipientName,
    };
  }

  async delegateDuelThemeChoice(
    code: string,
    userId: string,
    targetUserId?: string,
  ) {
    return this.delegateThemeChoice(code, userId, targetUserId);
  }

  /**
   * Enregistre et traite le déclin d'un défi par un utilisateur invité.
   */
  async declineDuelChallenge(
    code: string,
    opponentId?: string | null,
    opponentName?: string,
  ) {
    const cleanCode = code.trim().toUpperCase();
    let declinerName = opponentName;

    if (!declinerName && opponentId) {
      const user = await this.prisma.user.findUnique({
        where: { id: opponentId },
        select: { name: true },
      });
      declinerName = user?.name;
    }

    return {
      code: cleanCode,
      declinerName: declinerName || "L'adversaire",
    };
  }

  /**
   * Rejoint un salon existant via son code à 6 caractères (Max 10 joueurs).
   */
  async joinGame(userId: string, dto: JoinMultiplayerGameDto) {
    if (!userId || userId.startsWith('guest_')) {
      throw new UnauthorizedException(
        'Seuls les utilisateurs connectés peuvent rejoindre un salon multijoueur.',
      );
    }

    const cleanCode = dto.code.trim().toUpperCase();

    const session = await this.prisma.duelSession.findUnique({
      where: { code: cleanCode },
      include: { players: true },
    });

    if (!session) {
      throw new NotFoundException(
        `Aucun salon trouvé avec le code ${cleanCode}`,
      );
    }

    const existingPlayer = session.players.find((p) => p.userId === userId);

    // Si la session est en cours ou terminée et que l'utilisateur n'en fait pas partie
    if (session.status !== 'WAITING' && !existingPlayer) {
      throw new BadRequestException(
        'Cette partie a déjà commencé ou est terminée.',
      );
    }

    // Limite stricte de 10 personnes maximum
    if (!existingPlayer && session.players.length >= session.maxPlayers) {
      throw new BadRequestException(
        `Le salon est complet (${session.maxPlayers}/${session.maxPlayers} joueurs).`,
      );
    }

    // Profil du joueur entrant
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, image: true },
    });
    const playerName =
      dto.userName || user?.name || `Joueur ${session.players.length + 1}`;
    const playerAvatar = dto.userAvatar || user?.image || null;

    if (!existingPlayer) {
      await this.prisma.duelPlayer.create({
        data: {
          sessionId: session.id,
          userId,
          name: playerName,
          avatar: playerAvatar,
          isHost: session.player1Id === userId,
          score: 0,
          streak: 0,
          rank: session.players.length + 1,
        },
      });
    }

    const updatedPlayers = await this.prisma.duelPlayer.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: 'asc' },
    });

    this.logger.log(
      `⚔️ [Multiplayer] Joueur ${userId} a rejoint le salon ${cleanCode} (${updatedPlayers.length}/${session.maxPlayers})`,
    );

    const questions = await this.getPublicQuestions(
      session.gameType as MultiplayerGameTypeEnum,
      session.questionIds,
    );

    return {
      session,
      questions,
      players: updatedPlayers,
      isHost: session.player1Id === userId,
    };
  }

  // Alias rétrocompatibilité
  async joinDuel(userId: string, dto: JoinMultiplayerGameDto) {
    return this.joinGame(userId, dto);
  }

  /**
   * Lancement de la partie par l'Hôte (Modèle Kahoot).
   */
  async startGame(userId: string, dto: StartMultiplayerGameDto) {
    const cleanCode = dto.code.trim().toUpperCase();

    const session = await this.prisma.duelSession.findUnique({
      where: { code: cleanCode },
      include: { players: true },
    });

    if (!session) {
      throw new NotFoundException('Salon introuvable.');
    }

    // Vérification de sécurité : Seul l'hôte a le droit de démarrer la partie
    const player = session.players.find((p) => p.userId === userId);
    if (!player?.isHost && session.player1Id !== userId) {
      throw new ForbiddenException(
        'Seul l’hôte de la salle peut démarrer la partie.',
      );
    }

    if (session.status !== 'WAITING') {
      throw new BadRequestException('La partie a déjà démarré.');
    }

    // Exiger au moins 2 vrais joueurs actifs (non-spectateurs) pour démarrer la partie
    const hostIsSpectator = await this.isHostSpectator(cleanCode);
    const realPlayers = hostIsSpectator
      ? session.players.filter((p) => p.userId !== session.player1Id)
      : session.players;

    if (realPlayers.length < 2) {
      throw new BadRequestException(
        hostIsSpectator
          ? 'Il faut au moins 2 vrais joueurs (hors animateur spectateur) pour commencer la partie.'
          : 'Il faut au moins 2 vrais joueurs pour commencer la partie multijoueur.',
      );
    }

    // Mettre la session en statut IN_PROGRESS et initialiser le round 1
    const roundStartedAt = new Date();
    const updatedSession = await this.prisma.duelSession.update({
      where: { id: session.id },
      data: {
        status: 'IN_PROGRESS',
        currentQuestionIndex: 0,
        roundStartedAt,
      },
    });

    // Réinitialiser les états de round des joueurs
    await this.prisma.duelPlayer.updateMany({
      where: { sessionId: session.id },
      data: {
        hasAnsweredCurrent: false,
        currentRoundScore: 0,
      },
    });

    const questions = await this.getPublicQuestions(
      session.gameType as MultiplayerGameTypeEnum,
      session.questionIds,
    );

    const currentQuestion = questions[0];

    this.logger.log(
      `🚀 [Multiplayer] Salon ${cleanCode} démarré par ${userId} avec ${session.players.length} joueurs !`,
    );

    return {
      session: updatedSession,
      questions,
      currentQuestion,
      currentQuestionIndex: 0,
      totalQuestions: questions.length,
      roundTimeLimit: session.timePerQuestion,
      roundStartedAt,
    };
  }

  // Alias rétrocompatibilité
  async startDuel(userId: string, dto: StartMultiplayerGameDto) {
    return this.startGame(userId, dto);
  }

  /**
   * Récupère l'état courant d'un salon.
   */
  async getGameState(code: string) {
    const cleanCode = code.trim().toUpperCase();
    const session = await this.prisma.duelSession.findUnique({
      where: { code: cleanCode },
      include: { players: true },
    });

    if (!session) {
      throw new NotFoundException(`Salon ${cleanCode} introuvable.`);
    }

    const questions = await this.getPublicQuestions(
      session.gameType as MultiplayerGameTypeEnum,
      session.questionIds,
    );

    return { session, questions, players: session.players };
  }

  // Alias rétrocompatibilité
  async getDuelState(code: string) {
    return this.getGameState(code);
  }

  /**
   * Soumission et validation sécurisée de la réponse d'un joueur (Server-Authoritative Timing & Kahoot Score).
   */
  async submitAnswer(userId: string, dto: SubmitMultiplayerAnswerDto) {
    if (!userId || userId.startsWith('guest_')) {
      throw new UnauthorizedException(
        'Seuls les utilisateurs connectés peuvent soumettre une réponse en multijoueur.',
      );
    }

    const cleanCode = dto.code.trim().toUpperCase();

    const session = await this.prisma.duelSession.findUnique({
      where: { code: cleanCode },
      include: { players: true },
    });

    if (!session) {
      throw new NotFoundException('Salon introuvable.');
    }

    if (session.status !== 'IN_PROGRESS') {
      throw new BadRequestException('La partie n’est pas en cours.');
    }

    const player = session.players.find((p) => p.userId === userId);
    if (!player) {
      throw new BadRequestException('Vous ne faites pas partie de ce salon.');
    }

    // 1. Anti-Spam / Idempotence : Vérifier si le joueur a déjà répondu à cette question
    if (player.hasAnsweredCurrent) {
      const existingAnswer = await this.prisma.duelAnswer.findFirst({
        where: {
          sessionId: session.id,
          userId,
          questionIndex: session.currentQuestionIndex,
        },
      });

      const answeredCount = session.players.filter(
        (p) => p.hasAnsweredCurrent,
      ).length;
      const allAnswered = answeredCount >= session.players.length;

      return {
        alreadyAnswered: true,
        isCorrect: existingAnswer?.isCorrect ?? false,
        pointsAwarded: existingAnswer?.pointsAwarded ?? 0,
        streak: player.streak,
        score: player.score,
        answeredCount,
        totalPlayersCount: session.players.length,
        allAnswered,
      };
    }

    // 2. Server-Authoritative Timing : Calcul précis du temps pris
    const now = Date.now();
    const roundStart = session.roundStartedAt
      ? session.roundStartedAt.getTime()
      : now - (dto.timeTakenMs || 0);
    const serverTimeTakenMs = Math.max(0, now - roundStart);
    const maxAllowedMs = session.timePerQuestion * 1000 + 1500; // tolérance réseau 1.5s
    const isTimeout = serverTimeTakenMs > maxAllowedMs;

    // 3. Validation de la réponse
    let isCorrect = false;
    let explanationMg: string | null = null;
    let explanationFr: string | null = null;
    let correctAnswer: string = '';

    if (!isTimeout) {
      if (session.gameType === 'TRUE_FALSE') {
        const q = await this.prisma.trueFalseQuestion.findUnique({
          where: { id: dto.questionId },
        });
        if (q) {
          const boolAnswer = dto.userAnswer.toLowerCase() === 'true';
          isCorrect = boolAnswer === q.isTrue;
          explanationMg = q.explanationMg;
          explanationFr = q.explanationFr;
          correctAnswer = q.isTrue ? 'true' : 'false';
        }
      } else if (session.gameType === 'QUIZ') {
        const q = await this.prisma.civicQuizQuestion.findUnique({
          where: { id: dto.questionId },
        });
        if (q) {
          const expectedChoice = q.choices[q.answerIndex] || '';
          isCorrect =
            dto.userAnswer.trim().toLowerCase() ===
              expectedChoice.trim().toLowerCase() ||
            dto.userAnswer.trim() === String(q.answerIndex);
          explanationMg = q.explanation;
          explanationFr = q.explanation;
          correctAnswer = expectedChoice;
        }
      } else {
        const q = await this.prisma.missingWordQuestion.findUnique({
          where: { id: dto.questionId },
        });
        if (q) {
          isCorrect =
            dto.userAnswer.trim().toLowerCase() ===
            q.correctWord.trim().toLowerCase();
          explanationMg = q.explanation;
          explanationFr = q.french;
          correctAnswer = q.correctWord;
        }
      }
    }

    // 4. Calcul des points Kahoot (Vitesse + Streak Combo 🔥)
    let pointsAwarded = 0;
    let newStreak = 0;

    if (isCorrect) {
      newStreak = player.streak + 1;

      // Base : jusqu'à 180 points selon le temps pris (min 80 pts pour bonne réponse)
      const ratio = Math.min(
        1,
        serverTimeTakenMs / (session.timePerQuestion * 1000),
      );
      const speedScore = Math.ceil(180 * (1 - ratio / 2));

      // Bonus de streak : +5 pts par flamme (plafonné à +20 pts)
      const streakBonus = Math.min(newStreak - 1, 4) * 5;

      // Plafonné strictement à 200 points maximum par question
      pointsAwarded = Math.min(200, speedScore + streakBonus);
    } else {
      newStreak = 0;
      pointsAwarded = 0;
    }

    // 5. Enregistrer la réponse atomiquement
    await this.prisma.duelAnswer.create({
      data: {
        sessionId: session.id,
        userId,
        questionId: dto.questionId,
        questionIndex: session.currentQuestionIndex,
        userAnswer: dto.userAnswer,
        isCorrect,
        timeTakenMs: serverTimeTakenMs,
        pointsAwarded,
      },
    });

    // 6. Mettre à jour le joueur
    const updatedPlayer = await this.prisma.duelPlayer.update({
      where: { id: player.id },
      data: {
        score: { increment: pointsAwarded },
        currentRoundScore: pointsAwarded,
        streak: newStreak,
        answersCount: { increment: 1 },
        totalTimeMs: { increment: serverTimeTakenMs },
        hasAnsweredCurrent: true,
      },
    });

    // 7. Vérifier si TOUS les participants connectés ont répondu (Fast-Forward)
    const allPlayersInSession = await this.prisma.duelPlayer.findMany({
      where: { sessionId: session.id },
    });
    const hostIsSpectator = await this.isHostSpectator(session.code);
    const activeContenders = hostIsSpectator
      ? allPlayersInSession.filter((p) => !p.isHost)
      : allPlayersInSession;

    const answeredCount = activeContenders.filter(
      (p) => p.hasAnsweredCurrent,
    ).length;
    const allAnswered =
      activeContenders.length > 0 && answeredCount >= activeContenders.length;

    return {
      isCorrect,
      pointsAwarded,
      streak: newStreak,
      score: updatedPlayer.score,
      answeredCount,
      totalPlayersCount: activeContenders.length,
      allAnswered,
      serverTimeTakenMs,
      correctAnswer,
      explanationMg,
      explanationFr,
    };
  }

  /**
   * Conclut le round courant : Révélation de la bonne réponse, calcul du classement intermédiaire et deltas de rangs.
   */
  async concludeRound(code: string) {
    const cleanCode = code.trim().toUpperCase();
    const session = await this.prisma.duelSession.findUnique({
      where: { code: cleanCode },
      include: { players: true },
    });

    if (!session) {
      throw new NotFoundException('Salon introuvable.');
    }

    // Récupérer la bonne réponse pour cette question
    const currentQId = session.questionIds[session.currentQuestionIndex];
    let correctAnswer = '';
    let explanationMg: string | null = null;
    let explanationFr: string | null = null;

    if (session.gameType === 'TRUE_FALSE') {
      const q = await this.prisma.trueFalseQuestion.findUnique({
        where: { id: currentQId },
      });
      if (q) {
        correctAnswer = q.isTrue ? 'true' : 'false';
        explanationMg = q.explanationMg;
        explanationFr = q.explanationFr;
      }
    } else if (session.gameType === 'QUIZ') {
      const q = await this.prisma.civicQuizQuestion.findUnique({
        where: { id: currentQId },
      });
      if (q) {
        correctAnswer = q.choices[q.answerIndex] ?? '';
        explanationMg = q.explanation;
        explanationFr = q.explanation;
      }
    } else {
      const q = await this.prisma.missingWordQuestion.findUnique({
        where: { id: currentQId },
      });
      if (q) {
        correctAnswer = q.correctWord;
        explanationMg = q.explanation;
        explanationFr = q.french;
      }
    }

    // Calculer le classement intermédiaire trié par score descendant puis temps ascendant
    const hostIsSpectator = await this.isHostSpectator(cleanCode);
    const contenders = hostIsSpectator
      ? session.players.filter((p) => !p.isHost)
      : session.players;

    const sortedContenders = [...contenders].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.totalTimeMs - b.totalTimeMs;
    });

    // Mettre à jour les rangs et calculer les deltas de progression pour les rivaux
    const updatedLeaderboard = await Promise.all(
      sortedContenders.map(async (p, idx) => {
        const newRank = idx + 1;
        const prevRank = p.rank || newRank;

        const updated = await this.prisma.duelPlayer.update({
          where: { id: p.id },
          data: {
            previousRank: prevRank,
            rank: newRank,
          },
        });

        return {
          id: updated.id,
          userId: updated.userId,
          name: updated.name,
          avatar: updated.avatar,
          score: updated.score,
          currentRoundScore: updated.currentRoundScore,
          streak: updated.streak,
          rank: newRank,
          previousRank: prevRank,
          rankDelta: prevRank - newRank,
          isHost: updated.isHost,
        };
      }),
    );

    const isLastQuestion =
      session.currentQuestionIndex + 1 >= session.totalQuestions;

    return {
      session,
      currentQuestionIndex: session.currentQuestionIndex,
      totalQuestions: session.totalQuestions,
      correctAnswer,
      explanationMg,
      explanationFr,
      leaderboard: updatedLeaderboard,
      isLastQuestion,
      nextQuestionCountdown: 5,
    };
  }

  /**
   * Passage automatique à la question suivante ou clôture avec Podium Final (Distribution XP).
   */
  async advanceToNextRoundOrFinish(code: string) {
    const cleanCode = code.trim().toUpperCase();
    const session = await this.prisma.duelSession.findUnique({
      where: { code: cleanCode },
      include: { players: true },
    });

    if (!session) {
      throw new NotFoundException('Salon introuvable.');
    }

    const nextIndex = session.currentQuestionIndex + 1;
    const isFinished = nextIndex >= session.totalQuestions;

    if (isFinished) {
      // 🏆 Fin de partie : Calcul du Podium Final
      const sortedPlayers = [...session.players].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.totalTimeMs - b.totalTimeMs;
      });

      const winner = sortedPlayers[0];

      await this.prisma.duelSession.update({
        where: { id: session.id },
        data: {
          status: 'FINISHED',
          winnerId: winner ? winner.userId : null,
          finishedAt: new Date(),
        },
      });

      // Distribution d'XP proportionnelle au classement
      const finalLeaderboard = await Promise.all(
        sortedPlayers.map(async (p, idx) => {
          const rank = idx + 1;
          const xp = rank === 1 ? 120 : rank === 2 ? 80 : rank === 3 ? 60 : 35;

          await this.awardMultiplayerXp(p.userId, rank, xp);

          await this.prisma.duelPlayer.update({
            where: { id: p.id },
            data: {
              rank,
              earnedXp: xp,
            },
          });

          return {
            id: p.id,
            userId: p.userId,
            name: p.name,
            avatar: p.avatar,
            score: p.score,
            streak: p.streak,
            rank,
            earnedXp: xp,
            isHost: p.isHost,
          };
        }),
      );

      this.logger.log(
        `🏆 [Multiplayer] Salon ${cleanCode} terminé ! Vainqueur: ${winner?.name} (${winner?.score} pts)`,
      );

      return {
        isFinished: true,
        finalLeaderboard,
        winnerId: winner ? winner.userId : null,
      };
    } else {
      // ➡️ Question suivante
      const roundStartedAt = new Date();

      await this.prisma.duelSession.update({
        where: { id: session.id },
        data: {
          currentQuestionIndex: nextIndex,
          roundStartedAt,
        },
      });

      // Réinitialiser les indicateurs de réponse pour le nouveau round
      await this.prisma.duelPlayer.updateMany({
        where: { sessionId: session.id },
        data: {
          hasAnsweredCurrent: false,
          currentRoundScore: 0,
        },
      });

      const questions = await this.getPublicQuestions(
        session.gameType as MultiplayerGameTypeEnum,
        session.questionIds,
      );

      const nextQuestion = questions[nextIndex];

      return {
        isFinished: false,
        currentQuestion: nextQuestion,
        currentQuestionIndex: nextIndex,
        totalQuestions: session.totalQuestions,
        roundTimeLimit: session.timePerQuestion,
        roundStartedAt,
      };
    }
  }

  /**
   * Gestion sécurisée du départ d'un joueur ou de l'hôte.
   */
  async handlePlayerLeave(userId: string, code: string) {
    const cleanCode = code.trim().toUpperCase();
    const session = await this.prisma.duelSession.findUnique({
      where: { code: cleanCode },
      include: { players: true },
    });

    if (!session) return null;

    const player = session.players.find((p) => p.userId === userId);
    const isHostLeaving = session.player1Id === userId || player?.isHost;

    if (isHostLeaving) {
      // 1. L'Hôte quitte -> Annulation et fermeture définitive du salon
      this.logger.log(
        `🚪 [MultiplayerService] L'hôte ${userId} a quitté le salon ${cleanCode} -> Clôture de la session`,
      );
      const updatedSession = await this.prisma.duelSession.update({
        where: { id: session.id },
        data: { status: 'CANCELLED', finishedAt: new Date() },
      });
      await this.redisService.del(`duel:spectator:${cleanCode}`);

      return {
        isHostLeaving: true,
        sessionCancelled: true,
        session: updatedSession,
        remainingPlayers: [],
        allRemainingAnswered: false,
      };
    }

    // 2. Simple participant qui quitte
    if (player) {
      await this.prisma.duelPlayer.deleteMany({
        where: { sessionId: session.id, userId },
      });
      this.logger.log(
        `🚪 [MultiplayerService] Joueur ${userId} retiré du salon ${cleanCode}`,
      );
    }

    const remainingPlayers = await this.prisma.duelPlayer.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: 'asc' },
    });

    // Si la session est en cours, vérifier si tous les joueurs restants ont déjà répondu
    let allRemainingAnswered = false;
    if (session.status === 'IN_PROGRESS') {
      const hostIsSpectator = await this.isHostSpectator(cleanCode);
      const activeContenders = hostIsSpectator
        ? remainingPlayers.filter((p) => !p.isHost)
        : remainingPlayers;

      const answeredCount = activeContenders.filter(
        (p) => p.hasAnsweredCurrent,
      ).length;
      allRemainingAnswered =
        activeContenders.length > 0 && answeredCount >= activeContenders.length;
    }

    return {
      isHostLeaving: false,
      sessionCancelled: false,
      session,
      remainingPlayers,
      allRemainingAnswered,
    };
  }

  /**
   * Expulse un joueur de la session à la demande exclusive de l'Hôte.
   */
  async kickPlayer(hostUserId: string, code: string, targetUserId: string) {
    const cleanCode = code.trim().toUpperCase();
    const session = await this.prisma.duelSession.findUnique({
      where: { code: cleanCode },
      include: { players: true },
    });

    if (!session) {
      throw new NotFoundException('Salon multijoueur introuvable.');
    }

    // 1. Vérification stricte des droits de l'Hôte
    const hostPlayer = session.players.find((p) => p.userId === hostUserId);
    const isHost = session.player1Id === hostUserId || hostPlayer?.isHost;
    if (!isHost) {
      throw new ForbiddenException(
        "Seul l'hôte du salon est autorisé à expulser un joueur.",
      );
    }

    // 2. L'Hôte ne peut pas s'auto-expulser
    if (targetUserId === hostUserId) {
      throw new BadRequestException(
        "L'hôte ne peut pas s'expulser lui-même du salon.",
      );
    }

    // 3. Vérifier la présence du joueur ciblé
    const targetPlayer = session.players.find((p) => p.userId === targetUserId);
    if (!targetPlayer) {
      throw new NotFoundException(
        'Le joueur ciblé ne fait pas partie de ce salon.',
      );
    }

    // 4. Supprimer le joueur de la session
    await this.prisma.duelPlayer.deleteMany({
      where: { sessionId: session.id, userId: targetUserId },
    });

    this.logger.log(
      `👢 [MultiplayerService] Le joueur ${targetPlayer.name} (${targetUserId}) a été expulsé du salon ${cleanCode} par l'hôte ${hostUserId}`,
    );

    // 5. Récupérer la liste actualisée des joueurs restants
    const remainingPlayers = await this.prisma.duelPlayer.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: 'asc' },
    });

    // 6. Si la session est en cours, recalculer si tous les participants restants ont déjà répondu
    let allRemainingAnswered = false;
    if (session.status === 'IN_PROGRESS') {
      const hostIsSpectator = await this.isHostSpectator(cleanCode);
      const activeContenders = hostIsSpectator
        ? remainingPlayers.filter((p) => !p.isHost)
        : remainingPlayers;

      const answeredCount = activeContenders.filter(
        (p) => p.hasAnsweredCurrent,
      ).length;
      allRemainingAnswered =
        activeContenders.length > 0 && answeredCount >= activeContenders.length;
    }

    return {
      session,
      remainingPlayers,
      kickedPlayer: targetPlayer,
      allRemainingAnswered,
    };
  }

  private calculateLevel(xp: number): number {
    const safeXp = Math.max(0, xp || 0);
    const THRESHOLDS = [
      { level: 1, minXp: 0 },
      { level: 2, minXp: 50 },
      { level: 3, minXp: 150 },
      { level: 4, minXp: 300 },
      { level: 5, minXp: 500 },
      { level: 6, minXp: 800 },
      { level: 7, minXp: 1200 },
      { level: 8, minXp: 1700 },
      { level: 9, minXp: 2300 },
      { level: 10, minXp: 3000 },
    ];

    let currentLevel = 1;
    for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
      if (safeXp >= THRESHOLDS[i].minXp) {
        currentLevel = THRESHOLDS[i].level;
        break;
      }
    }

    if (safeXp >= 3000) {
      currentLevel = 10 + Math.floor((safeXp - 3000) / 1000);
    }

    return currentLevel;
  }

  /**
   * Attribue de l'XP à un participant de manière sécurisée (arrondi supérieur strict).
   */
  private async awardMultiplayerXp(
    userId: string,
    rank: number,
    amount: number,
  ) {
    if (!userId || amount <= 0) return;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) {
      this.logger.log(
        `ℹ️ [Multiplayer] Joueur invité (${userId}) : attribution XP ignorée (non enregistré).`,
      );
      return;
    }

    const desc =
      rank === 1
        ? 'Victoire Multijoueur 🥇'
        : rank === 2
          ? '2ème Place Multijoueur 🥈'
          : rank === 3
            ? '3ème Place Multijoueur 🥉'
            : 'Participation Multijoueur 🎮';

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.xpTransaction.create({
          data: {
            userId,
            amount: Math.ceil(amount),
            source: 'duel_battle',
            description: desc,
          },
        });

        let progress = await tx.userProgress.findUnique({
          where: { userId },
        });

        if (!progress) {
          progress = await tx.userProgress.create({
            data: {
              userId,
              totalXp: 0,
              level: 1,
              coins: 0,
              streakDays: 0,
            },
          });
        }

        const newXp = Math.ceil(Number(progress.totalXp) + amount);
        const previousLevel = progress.level || 1;
        const newLevel = this.calculateLevel(newXp);
        let additionalCoins = 0;
        if (newLevel > previousLevel) {
          for (let lvl = previousLevel + 1; lvl <= newLevel; lvl++) {
            additionalCoins += Math.max(25, lvl * 25);
          }
        }
        const newCoins = (progress.coins || 0) + additionalCoins;

        await tx.userProgress.update({
          where: { userId },
          data: {
            totalXp: newXp,
            level: newLevel,
            coins: newCoins,
          },
        });
      });

      const updatedProgress = await this.prisma.userProgress.findUnique({
        where: { userId },
        include: { user: { select: { name: true, image: true } } },
      });

      if (updatedProgress) {
        await this.redisService.publish(REALTIME_CHANNELS.LEADERBOARD, {
          userId,
          totalXp: Number(updatedProgress.totalXp),
          level: updatedProgress.level,
          streakDays: updatedProgress.streakDays,
          name: updatedProgress.user?.name,
          image: updatedProgress.user?.image,
          xpDelta: Math.ceil(amount),
          source: 'duel_multi',
          timestamp: Date.now(),
        });

        this.logger.log(
          `✨ [Multiplayer/XP] +${Math.ceil(amount)} XP enregistrés avec succès pour ${userId} (Nouveau Total: ${updatedProgress.totalXp}, Niveau: ${updatedProgress.level})`,
        );
      }
    } catch (err) {
      this.logger.warn(
        `Erreur attribution XP multijoueur pour ${userId}:`,
        err,
      );
    }
  }

  /**
   * Récupère les données publiques des questions sans révéler les réponses (Zero-Knowledge anti-triche).
   */
  private async getPublicQuestions(
    gameType: MultiplayerGameTypeEnum,
    questionIds: string[],
  ): Promise<PublicMultiplayerQuestion[]> {
    if (gameType === MultiplayerGameTypeEnum.TRUE_FALSE) {
      const questions = await this.prisma.trueFalseQuestion.findMany({
        where: { id: { in: questionIds } },
        select: {
          id: true,
          questionMg: true,
          questionFr: true,
        },
      });

      const questionMap = new Map(questions.map((q) => [q.id, q]));
      const result: PublicMultiplayerQuestion[] = [];

      questionIds.forEach((id, index) => {
        const q = questionMap.get(id);
        if (q) {
          result.push({
            id: q.id,
            orderIndex: index,
            questionText: q.questionMg || '',
            questionTextFr: q.questionFr || undefined,
            gameType: MultiplayerGameTypeEnum.TRUE_FALSE,
            choices: ['true', 'false'],
          });
        }
      });

      return result;
    } else if (gameType === MultiplayerGameTypeEnum.QUIZ) {
      const questions = await this.prisma.civicQuizQuestion.findMany({
        where: { id: { in: questionIds } },
        select: {
          id: true,
          prompt: true,
          choices: true,
          explanation: true,
        },
      });

      const questionMap = new Map(questions.map((q) => [q.id, q]));
      const result: PublicMultiplayerQuestion[] = [];

      questionIds.forEach((id, index) => {
        const q = questionMap.get(id);
        if (q) {
          result.push({
            id: q.id,
            orderIndex: index,
            questionText: q.prompt,
            questionTextFr: undefined,
            gameType: MultiplayerGameTypeEnum.QUIZ,
            choices: q.choices,
          });
        }
      });

      return result;
    } else {
      const questions = await this.prisma.missingWordQuestion.findMany({
        where: { id: { in: questionIds } },
        select: {
          id: true,
          template: true,
          choices: true,
          french: true,
          correctWord: true,
        },
      });

      const questionMap = new Map(questions.map((q) => [q.id, q]));
      const result: PublicMultiplayerQuestion[] = [];

      questionIds.forEach((id, index) => {
        const q = questionMap.get(id);
        if (q) {
          const blankPrompt =
            q.template && q.template.length > 0
              ? q.template.join(' ______ ')
              : '______';
          const allChoices = Array.from(
            new Set([q.correctWord, ...(q.choices || [])]),
          ).sort(() => Math.random() - 0.5);

          result.push({
            id: q.id,
            orderIndex: index,
            questionText: blankPrompt,
            questionTextFr: q.french || undefined,
            gameType: MultiplayerGameTypeEnum.MISSING_WORD,
            choices: allChoices,
          });
        }
      });

      return result;
    }
  }
}
