import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProgressionService } from '../progression/progression.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { ReferralStatus } from '../../generated/prisma/client.js';
import {
  AdminReferralQueryDto,
  UpdateReferralConfigDto,
} from './dto/referral.dto.js';

// Alphabet lisible sans caractères confus (pas de 0/O, 1/I/L)
const CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

export interface UserReferralStats {
  code: string;
  shareUrl: string;
  clicksCount: number;
  totalInvited: number;
  totalPending: number;
  totalCompleted: number;
  totalXpEarned: number;
  totalCoinsEarned: number;
  maxRewardsLimit: number;
  rewardsRemaining: number;
  config: {
    referrerXp: number;
    referrerCoins: number;
    refereeXp: number;
    refereeCoins: number;
    isEnabled: boolean;
  };
  referrals: {
    id: string;
    refereeName: string;
    refereeAvatar: string | null;
    status: ReferralStatus;
    createdAt: Date;
    completedAt: Date | null;
    xpEarned: number;
    coinsEarned: number;
  }[];
  myReferral?: {
    id: string;
    referrerName: string;
    referrerAvatar: string | null;
    code: string;
    status: ReferralStatus;
    refereeXpAwarded: number;
    refereeCoinsAwarded: number;
    createdAt: Date;
    completedAt: Date | null;
  } | null;
  canClaimReferral: boolean;
}

@Injectable()
export class ReferralService {
  private readonly logger = new Logger(ReferralService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly progressionService: ProgressionService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Masque l'identité du filleul pour respecter la vie privée (RGPD).
   * Ex: "Jean Dupont" -> "Jean D.", "@jeandupont" -> "@jean***"
   */
  private formatMaskedName(name?: string | null, username?: string | null): string {
    if (username && username.trim()) {
      const u = username.trim().replace(/^@/, '');
      if (u.length <= 3) return `@${u}`;
      return `@${u.slice(0, 3)}***`;
    }
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length === 1) return parts[0];
      const firstName = parts[0];
      const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
      return `${firstName} ${lastInitial}.`;
    }
    return 'Membre Kanto';
  }

  /**
   * Génère un code de parrainage aléatoire sécurisé et mnémonique.
   */
  private generateRandomCode(prefix = 'KANTO'): string {
    let randomPart = '';
    for (let i = 0; i < 5; i++) {
      const idx = Math.floor(Math.random() * CODE_ALPHABET.length);
      randomPart += CODE_ALPHABET.charAt(idx);
    }
    return `${prefix}-${randomPart}`;
  }

  /**
   * Récupère la configuration globale active du programme de parrainage.
   * Crée la configuration par défaut en base si elle n'existe pas encore.
   */
  async getOrCreateConfig() {
    let config = await this.prisma.referralConfig.findUnique({
      where: { id: 'default' },
    });

    if (!config) {
      config = await this.prisma.referralConfig.create({
        data: {
          id: 'default',
          isEnabled: true,
          referrerXp: 250,
          referrerCoins: 50,
          refereeXp: 100,
          refereeCoins: 20,
          maxRewardsPerReferrer: 20,
          requireFirstActivity: true,
          welcomeMessageMg:
            'Tonga soa eto amin’ny Kanto MG ! Nomenao tamby manokana ianao noho ny fidiranao tamin’ny alalan’ny fanasana.',
          welcomeMessageFr:
            'Bienvenue sur Kanto MG ! Vous avez reçu des récompenses exclusives grâce à votre invitation.',
        },
      });
    }

    return config;
  }

  /**
   * Récupère ou génère le code personnel unique d'un utilisateur.
   */
  async getOrCreateUserCode(userId: string): Promise<string> {
    const existing = await this.prisma.referralCode.findUnique({
      where: { userId },
    });

    if (existing) {
      return existing.code;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, username: true },
    });

    // Génération avec gestion de collision
    let prefix = 'KANTO';
    if (user?.username) {
      const cleanUsername = user.username
        .replace(/[^A-Za-z0-9]/g, '')
        .toUpperCase()
        .slice(0, 6);
      if (cleanUsername.length >= 3) {
        prefix = cleanUsername;
      }
    }

    let code = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      code = this.generateRandomCode(prefix);
      const conflict = await this.prisma.referralCode.findUnique({
        where: { code },
      });
      if (!conflict) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      code = `KANTO-${Date.now().toString(36).toUpperCase().slice(-5)}`;
    }

    const created = await this.prisma.referralCode.create({
      data: {
        userId,
        code,
      },
    });

    return created.code;
  }

  /**
   * Récupère les statistiques de parrainage complètes de l'utilisateur connecté.
   */
  async getUserReferralStats(userId: string): Promise<UserReferralStats> {
    const [config, userCode, referralsRecord, myReferralRecord] =
      await Promise.all([
        this.getOrCreateConfig(),
        this.getOrCreateUserCode(userId),
        this.prisma.referral.findMany({
          where: { referrerId: userId },
          include: {
            referee: {
              select: {
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.referral.findUnique({
          where: { refereeId: userId },
          include: {
            referrer: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        }),
      ]);

    // Déclencheur B : Si le parrainage reçu est en attente, tenter une activation automatique dès consultation
    if (myReferralRecord && myReferralRecord.status === ReferralStatus.PENDING) {
      try {
        const userProgress = await this.prisma.userProgress.findUnique({
          where: { userId },
          select: { totalXp: true },
        });
        if (userProgress && userProgress.totalXp > 0) {
          const compResult = await this.completeReferral(userId);
          if (compResult.completed) {
            myReferralRecord.status = ReferralStatus.COMPLETED;
            myReferralRecord.refereeXpAwarded = compResult.refereeXp;
            myReferralRecord.refereeCoinsAwarded = compResult.refereeCoins;
          }
        }
      } catch (err) {
        this.logger.debug(
          `Échec activation parrainage au chargement des stats pour ${userId} : ${err}`,
        );
      }
    }

    const codeRecord = await this.prisma.referralCode.findUnique({
      where: { userId },
    });

    const clicksCount = codeRecord?.clicksCount || 0;
    const totalInvited = referralsRecord.length;
    const totalPending = referralsRecord.filter(
      (r) => r.status === ReferralStatus.PENDING,
    ).length;
    const completedReferrals = referralsRecord.filter(
      (r) => r.status === ReferralStatus.COMPLETED,
    );
    const totalCompleted = completedReferrals.length;

    const totalXpEarned = completedReferrals.reduce(
      (acc, cur) => acc + (cur.referrerXpAwarded || 0),
      0,
    );
    const totalCoinsEarned = completedReferrals.reduce(
      (acc, cur) => acc + (cur.referrerCoinsAwarded || 0),
      0,
    );

    const maxRewards = config.maxRewardsPerReferrer || 20;
    const rewardsRemaining = Math.max(0, maxRewards - totalCompleted);

    const baseUrl = process.env.PUBLIC_APP_URL || 'https://app-kanto.gastsar.fr';
    const shareUrl = `${baseUrl}/invite/${userCode}`;

    return {
      code: userCode,
      shareUrl,
      clicksCount,
      totalInvited,
      totalPending,
      totalCompleted,
      totalXpEarned,
      totalCoinsEarned,
      maxRewardsLimit: maxRewards,
      rewardsRemaining,
      config: {
        referrerXp: config.referrerXp,
        referrerCoins: config.referrerCoins,
        refereeXp: config.refereeXp,
        refereeCoins: config.refereeCoins,
        isEnabled: config.isEnabled,
      },
      referrals: referralsRecord.map((r) => ({
        id: r.id,
        refereeName: this.formatMaskedName(
          r.referee?.name,
          r.referee?.username,
        ),
        refereeAvatar: r.referee?.image || null,
        status: r.status,
        createdAt: r.createdAt,
        completedAt: r.completedAt,
        xpEarned: r.referrerXpAwarded,
        coinsEarned: r.referrerCoinsAwarded,
      })),
      myReferral: myReferralRecord
        ? {
            id: myReferralRecord.id,
            referrerName: this.formatMaskedName(
              myReferralRecord.referrer?.name,
              myReferralRecord.referrer?.username,
            ),
            referrerAvatar: myReferralRecord.referrer?.image || null,
            code: myReferralRecord.code,
            status: myReferralRecord.status,
            refereeXpAwarded: myReferralRecord.refereeXpAwarded,
            refereeCoinsAwarded: myReferralRecord.refereeCoinsAwarded,
            createdAt: myReferralRecord.createdAt,
            completedAt: myReferralRecord.completedAt,
          }
        : null,
      canClaimReferral: !myReferralRecord,
    };
  }

  /**
   * Enregistre un clic sur un lien de parrainage (anonyme et idempotent).
   */
  async trackClick(code: string): Promise<{ success: boolean; clicksCount: number }> {
    if (!code) return { success: false, clicksCount: 0 };
    const normalized = code.trim().toUpperCase();

    const referralCode = await this.prisma.referralCode.findUnique({
      where: { code: normalized },
    });

    if (!referralCode || !referralCode.isActive) {
      return { success: false, clicksCount: 0 };
    }

    const updated = await this.prisma.referralCode.update({
      where: { id: referralCode.id },
      data: { clicksCount: { increment: 1 } },
      select: { clicksCount: true },
    });

    return { success: true, clicksCount: updated.clicksCount };
  }

  /**
   * Détecte si la création d'un parrainage introduirait un cycle ou un parrainage réciproque
   * (direct ou indirect dans la chaîne de parrainage).
   *
   * Dans Kanto MG, chaque utilisateur a au plus un seul parrain (refereeId est unique).
   * Un cycle est créé si et seulement si candidateRefereeId est déjà un ancêtre de candidateReferrerId
   * (c'est-à-dire candidateRefereeId parraine déjà candidateReferrerId, directement ou à travers une chaîne).
   *
   * @param candidateReferrerId L'utilisateur qui parraine (propriétaire du code)
   * @param candidateRefereeId L'utilisateur qui saisit le code (filleul candidat)
   * @param tx Instance de transaction Prisma
   * @returns true si un cycle ou parrainage croisé est détecté, false sinon
   */
  async detectReferralCycle(
    candidateReferrerId: string,
    candidateRefereeId: string,
    tx: any = this.prisma,
  ): Promise<boolean> {
    // 1. Auto-parrainage trivial
    if (candidateReferrerId === candidateRefereeId) {
      return true;
    }

    // 2. Vérification directe du parrainage réciproque (A parraine B, puis B tente de parrainer A)
    // Utilise findFirst pour une performance maximale et la rétrocompatibilité des mocks
    const directReciprocal = await tx.referral.findFirst({
      where: {
        referrerId: candidateRefereeId,
        refereeId: candidateReferrerId,
        status: { notIn: [ReferralStatus.REJECTED, ReferralStatus.EXPIRED] },
      },
    });

    if (directReciprocal) {
      this.logger.warn(
        `[Referral Anti-Fraud] Parrainage réciproque direct détecté : ${candidateRefereeId} a déjà parrainé ${candidateReferrerId}`,
      );
      return true;
    }

    // 3. Remontée itérative de la chaîne des ancêtres de candidateReferrerId (cycles indirects de longueur >= 2)
    // Exemple : A -> B -> C -> A (C tente de parrainer A alors que A a parrainé B et B a parrainé C)
    let currentUserId: string | null = candidateReferrerId;
    const visited = new Set<string>([candidateRefereeId]);
    const MAX_DEPTH = 50;
    let depth = 0;

    while (currentUserId && depth < MAX_DEPTH) {
      depth++;

      const parentReferral = await tx.referral.findUnique({
        where: { refereeId: currentUserId },
        select: {
          referrerId: true,
          status: true,
        },
      });

      if (
        !parentReferral ||
        parentReferral.status === ReferralStatus.REJECTED ||
        parentReferral.status === ReferralStatus.EXPIRED
      ) {
        break;
      }

      const parentReferrerId = parentReferral.referrerId;

      if (visited.has(parentReferrerId)) {
        this.logger.warn(
          `[Referral Anti-Fraud] Cycle de parrainage indirect détecté à la profondeur ${depth} : ` +
            `candidateReferrerId=${candidateReferrerId}, candidateRefereeId=${candidateRefereeId}, boucle sur=${parentReferrerId}`,
        );
        return true;
      }

      visited.add(parentReferrerId);
      currentUserId = parentReferrerId;
    }

    return false;
  }

  /**
   * Envoie une notification sécurisée, tracée et idempotente liée au parrainage.
   * Respecte le principe de source de vérité :
   * - Ne bloque jamais la transaction métier sous-jacente.
   * - Vérifie l'état du compte (utilisateur actif et non banni).
   * - Utilise une clé d'idempotence déterministe pour écarter tout doublon push ou in-app.
   */
  async sendReferralNotificationSafe(params: {
    userId: string;
    idempotencyKey: string;
    titleMg: string;
    titleFr: string;
    messageMg: string;
    messageFr: string;
    category?: string;
    badgeText?: string;
    badgeType?: string;
    iconName?: string;
    iconColor?: string;
    targetRoute?: string;
  }): Promise<boolean> {
    try {
      // 1. Vérification du compte destinataire (actif et non banni)
      const targetUser = await this.prisma.user.findUnique({
        where: { id: params.userId },
        select: { id: true, banned: true },
      });

      if (!targetUser || targetUser.banned) {
        this.logger.debug(
          `[Referral Notification] Destinataire ${params.userId} introuvable ou banni, notification ignorée.`,
        );
        return false;
      }

      // 2. Création de la notification via le service centralisé avec idempotence
      await this.notificationsService.createNotification({
        userId: params.userId,
        titleMg: params.titleMg,
        titleFr: params.titleFr,
        messageMg: params.messageMg,
        messageFr: params.messageFr,
        category: params.category || 'reward',
        badgeText: params.badgeText || 'Fanasana',
        badgeType: params.badgeType || 'reward',
        iconName: params.iconName || 'gift-outline',
        iconColor: params.iconColor || '#C58B38',
        targetRoute: params.targetRoute || '/(screens)/profile/referral',
        isBroadcast: false,
        idempotencyKey: params.idempotencyKey,
      });

      return true;
    } catch (err) {
      // Résilience absolue : un échec d'infrastructure de notification (push ou Redis)
      // ne doit jamais compromettre l'intégrité du parrainage ou des récompenses déjà accordées.
      this.logger.warn(
        `[Referral Notification] Échec non bloquant pour ${params.userId} (${params.idempotencyKey}) : ${err instanceof Error ? err.message : String(err)}`,
      );
      return false;
    }
  }

  /**
   * Associe un code de parrainage à un nouvel utilisateur (filleul).
   * Appelé lors de l'inscription ou lors de la 1ère connexion.
   * Transactionnel, anti-cycles (directs et indirects), et protégé contre les accès concurrents.
   */
  async claimReferral(
    refereeId: string,
    rawCode: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{
    success: boolean;
    status: ReferralStatus;
    referrerName: string;
    refereeXpAwarded: number;
    refereeCoinsAwarded: number;
    message: string;
  }> {
    const config = await this.getOrCreateConfig();
    if (!config.isEnabled) {
      throw new BadRequestException(
        'Le programme de parrainage est temporairement suspendu.',
      );
    }

    const normalizedCode = rawCode?.trim().toUpperCase();
    if (!normalizedCode) {
      throw new BadRequestException('Le code de parrainage est requis.');
    }

    try {
      const claimResult = await this.prisma.$transaction(async (tx) => {
        // 1. Trouver le code de parrainage
        const referralCode = await tx.referralCode.findUnique({
          where: { code: normalizedCode },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                banned: true,
              },
            },
          },
        });

        if (!referralCode || !referralCode.isActive || referralCode.user?.banned) {
          throw new NotFoundException(
            'Code de parrainage invalide, inactif ou inexistant.',
          );
        }

        const referrerId = referralCode.userId;

        // 2. Contrôle anti-auto-parrainage strict
        if (referrerId === refereeId) {
          throw new BadRequestException(
            'Vous ne pouvez pas utiliser votre propre code de parrainage.',
          );
        }

        // 3. Vérifier si le filleul a déjà été parrainé
        const existingReferral = await tx.referral.findUnique({
          where: { refereeId },
          include: {
            referrer: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        });

        if (existingReferral) {
          // Idempotence & Résilience : Si le même code est soumis à nouveau (ex: retry réseau ou post-inscription)
          if (existingReferral.code === normalizedCode && existingReferral.referrerId === referrerId) {
            const refereeXp = Number(config.refereeXp) || 0;
            const refereeCoins = Number(config.refereeCoins) || 0;

            // Rattrapage sécurisé des récompenses filleul si elles n'avaient pas été attribuées
            if (existingReferral.refereeXpAwarded === 0 && refereeXp > 0) {
              await this.progressionService.awardXp(
                refereeId,
                refereeXp,
                'welcome_referral_reward',
                `Bonus de bienvenue parrainage Kanto MG (code: ${normalizedCode})`,
              );
            }

            if (existingReferral.refereeCoinsAwarded === 0 && refereeCoins > 0) {
              await tx.userProgress.upsert({
                where: { userId: refereeId },
                create: {
                  userId: refereeId,
                  coins: refereeCoins,
                  totalXp: refereeXp,
                },
                update: {
                  coins: { increment: refereeCoins },
                },
              });
              await tx.referral.update({
                where: { id: existingReferral.id },
                data: {
                  refereeXpAwarded: refereeXp,
                  refereeCoinsAwarded: refereeCoins,
                },
              });
            }

            if (existingReferral.status === ReferralStatus.COMPLETED) {
              return {
                success: true,
                status: ReferralStatus.COMPLETED,
                referrerName: this.formatMaskedName(
                  existingReferral.referrer?.name,
                  existingReferral.referrer?.username,
                ),
                refereeXpAwarded: existingReferral.refereeXpAwarded || refereeXp,
                refereeCoinsAwarded: existingReferral.refereeCoinsAwarded || refereeCoins,
                message: 'Votre parrainage est déjà validé et actif.',
                referralId: existingReferral.id,
                referrerId,
                refereeId,
                isNewlyCreated: false,
                completedImmediately: false,
              };
            }

            // Si PENDING et première activité non requise, finaliser
            if (!config.requireFirstActivity) {
              const completionResult = await this.executeCompleteReferral(
                refereeId,
                tx,
                config,
              );
              return {
                success: true,
                status: ReferralStatus.COMPLETED,
                referrerName: this.formatMaskedName(
                  existingReferral.referrer?.name,
                  existingReferral.referrer?.username,
                ),
                refereeXpAwarded: completionResult.refereeXp,
                refereeCoinsAwarded: completionResult.refereeCoins,
                message: 'Parrainage validé avec succès !',
                referralId: existingReferral.id,
                referrerId,
                refereeId,
                isNewlyCreated: false,
                completedImmediately: true,
              };
            }

            return {
              success: true,
              status: ReferralStatus.PENDING,
              referrerName: this.formatMaskedName(
                existingReferral.referrer?.name,
                existingReferral.referrer?.username,
              ),
              refereeXpAwarded: existingReferral.refereeXpAwarded || refereeXp,
              refereeCoinsAwarded: existingReferral.refereeCoinsAwarded || refereeCoins,
              message: 'Votre code de parrainage est déjà associé à votre compte.',
              referralId: existingReferral.id,
              referrerId,
              refereeId,
              isNewlyCreated: false,
              completedImmediately: false,
            };
          }

          // Tentative de changer de parrain ou d'utiliser un code différent
          throw new ConflictException(
            'Ce compte a déjà bénéficié d’un code de parrainage.',
          );
        }

        // 4. Contrôle anti-fraude exhaustif : parrainages réciproques et cycles indirects
        const hasCycle = await this.detectReferralCycle(
          referrerId,
          refereeId,
          tx,
        );

        if (hasCycle) {
          throw new BadRequestException(
            'Opération non autorisée : parrainage réciproque ou circulaire détecté.',
          );
        }

        // 5. Création de l'enregistrement de parrainage (statut PENDING)
        const referral = await tx.referral.create({
          data: {
            referrerId,
            refereeId,
            code: normalizedCode,
            status: ReferralStatus.PENDING,
            ipAddress: ipAddress || null,
            userAgent: userAgent || null,
          },
        });

        this.logger.log(
          `[Referral] Nouveau parrainage créé : ${refereeId} parrainé par ${referrerId} (code: ${normalizedCode})`,
        );

        // 6. Attribution du bonus de bienvenue au nouvel inscrit (filleul)
        const refereeXp = Number(config.refereeXp) || 0;
        const refereeCoins = Number(config.refereeCoins) || 0;

        if (refereeXp > 0) {
          await this.progressionService.awardXp(
            refereeId,
            refereeXp,
            'welcome_referral_reward',
            `Bonus de bienvenue parrainage Kanto MG (code: ${normalizedCode})`,
          );
        }

        if (refereeCoins > 0) {
          await tx.userProgress.upsert({
            where: { userId: refereeId },
            create: {
              userId: refereeId,
              coins: refereeCoins,
              totalXp: refereeXp,
            },
            update: {
              coins: { increment: refereeCoins },
            },
          });
        }

        await tx.referral.update({
          where: { id: referral.id },
          data: {
            refereeXpAwarded: refereeXp,
            refereeCoinsAwarded: refereeCoins,
          },
        });

        // Si la configuration n'exige pas d'activité préalable, validation immédiate du parrain également
        if (!config.requireFirstActivity) {
          const completionResult = await this.executeCompleteReferral(
            refereeId,
            tx,
            config,
          );
          return {
            success: true,
            status: ReferralStatus.COMPLETED,
            referrerName: this.formatMaskedName(
              referralCode.user.name,
              referralCode.user.username,
            ),
            refereeXpAwarded: completionResult.refereeXp,
            refereeCoinsAwarded: completionResult.refereeCoins,
            message:
              'Parrainage validé avec succès ! Vos récompenses ont été créditées.',
            referralId: referral.id,
            referrerId,
            refereeId,
            isNewlyCreated: true,
            completedImmediately: true,
          };
        }

        return {
          success: true,
          status: ReferralStatus.PENDING,
          referrerName: this.formatMaskedName(
            referralCode.user.name,
            referralCode.user.username,
          ),
          refereeXpAwarded: refereeXp,
          refereeCoinsAwarded: refereeCoins,
          message:
            'Bienvenue sur Kanto MG ! Votre bonus de bienvenue (+100 XP et +20 Vola) a été crédité.',
          referralId: referral.id,
          referrerId,
          refereeId,
          isNewlyCreated: true,
          completedImmediately: false,
        };
      });

      // Post-transaction : Envoi des notifications métier garanties sans risque pour la transaction DB
      if (claimResult.isNewlyCreated && !claimResult.completedImmediately) {
        // Notification au parrain (Nouveau filleul inscrit)
        await this.sendReferralNotificationSafe({
          userId: claimResult.referrerId,
          idempotencyKey: `referral_claimed_referrer:${claimResult.referralId}`,
          titleMg: 'Mpiara-dia vaovao tonga soa ! 🤝',
          titleFr: 'Un nouveau filleul a rejoint Kanto MG ! 🤝',
          messageMg: `Nampiasa ny kaodinao ny namana iray. Hahazo ny tamby manokana (+${config.referrerXp} XP sy +${config.referrerCoins} Vola) ianao raha vao manomboka ny lalao voalohany izy.`,
          messageFr: `Un utilisateur a rejoint Kanto MG grâce à votre code de parrainage. Vos récompenses (+${config.referrerXp} XP et +${config.referrerCoins} Vola) seront créditées dès sa première activité validée.`,
          category: 'community',
          badgeText: 'Fanasana',
          badgeType: 'new',
          iconName: 'people-outline',
          iconColor: '#4A6741',
          targetRoute: '/(screens)/profile/referral',
        });

        // Notification au filleul (Bienvenue + Bonus de bienvenue)
        const nextStepMg = config.requireFirstActivity
          ? " Mandraisa anjara amin'ny lalao voalohany mba hanamafisana ny kaontinao."
          : '';
        const nextStepFr = config.requireFirstActivity
          ? ' Complétez votre premier quiz pour valider définitivement votre profil parrainé.'
          : '';

        await this.sendReferralNotificationSafe({
          userId: claimResult.refereeId,
          idempotencyKey: `referral_claimed_referee:${claimResult.referralId}`,
          titleMg: 'Tonga soa eto amin’ny Kanto MG ! 🎁',
          titleFr: 'Bienvenue sur Kanto MG ! 🎁',
          messageMg: `${config.welcomeMessageMg || 'Nomenao tamby manokana ianao noho ny fidiranao tamin’ny alalan’ny fanasana.'} (+${claimResult.refereeXpAwarded} XP sy +${claimResult.refereeCoinsAwarded} Vola voaray).${nextStepMg}`,
          messageFr: `${config.welcomeMessageFr || 'Bienvenue sur Kanto MG ! Vous avez reçu des récompenses exclusives grâce à votre invitation.'} (+${claimResult.refereeXpAwarded} XP et +${claimResult.refereeCoinsAwarded} Vola crédités).${nextStepFr}`,
          category: 'reward',
          badgeText: `+${claimResult.refereeXpAwarded} XP`,
          badgeType: 'reward',
          iconName: 'gift-outline',
          iconColor: '#C58B38',
          targetRoute: '/(screens)/profile/referral',
        });
      }

      return {
        success: claimResult.success,
        status: claimResult.status,
        referrerName: claimResult.referrerName,
        refereeXpAwarded: claimResult.refereeXpAwarded,
        refereeCoinsAwarded: claimResult.refereeCoinsAwarded,
        message: claimResult.message,
      };
    } catch (error: any) {
      // Gestion atomique des violations d'unicité (P2002) en cas de requêtes concurrentes sur le même filleul
      if (error?.code === 'P2002') {
        throw new ConflictException(
          'Ce compte a déjà bénéficié d’un code de parrainage.',
        );
      }
      throw error;
    }
  }

  /**
   * Logique interne de finalisation du parrainage et de distribution atomique des récompenses.
   */
  private async executeCompleteReferral(
    refereeId: string,
    tx: any,
    cachedConfig?: any,
  ): Promise<{
    completed: boolean;
    referrerXp: number;
    referrerCoins: number;
    refereeXp: number;
    refereeCoins: number;
  }> {
    const config = cachedConfig || (await this.getOrCreateConfig());

    // 1. Verrouillage du parrainage en attente
    const referral = await tx.referral.findUnique({
      where: { refereeId },
      include: {
        referrer: { select: { id: true, name: true, pushToken: true } },
        referee: { select: { id: true, name: true } },
      },
    });

    if (!referral) {
      return {
        completed: false,
        referrerXp: 0,
        referrerCoins: 0,
        refereeXp: 0,
        refereeCoins: 0,
      };
    }

    // Si déjà complété, idempotence absolue
    if (referral.status === ReferralStatus.COMPLETED) {
      return {
        completed: true,
        referrerXp: referral.referrerXpAwarded,
        referrerCoins: referral.referrerCoinsAwarded,
        refereeXp: referral.refereeXpAwarded,
        refereeCoins: referral.refereeCoinsAwarded,
      };
    }

    if (referral.status !== ReferralStatus.PENDING) {
      return {
        completed: false,
        referrerXp: 0,
        referrerCoins: 0,
        refereeXp: 0,
        refereeCoins: 0,
      };
    }

    const referrerId = referral.referrerId;

    // 2. Vérification du plafond de récompenses du parrain
    const completedCount = await tx.referral.count({
      where: {
        referrerId,
        status: ReferralStatus.COMPLETED,
        referrerXpAwarded: { gt: 0 },
      },
    });

    const canRewardReferrer = completedCount < config.maxRewardsPerReferrer;

    const referrerXpAward = canRewardReferrer ? config.referrerXp : 0;
    const referrerCoinsAward = canRewardReferrer ? config.referrerCoins : 0;
    const refereeXpAward = config.refereeXp;
    const refereeCoinsAward = config.refereeCoins;

    // 3. Attribution des récompenses au parrain (si éligible)
    if (canRewardReferrer && referrerXpAward > 0) {
      await this.progressionService.awardXp(
        referrerId,
        referrerXpAward,
        'referral_reward',
        `Récompense parrainage — Nouveau membre parrainé`,
      );

      if (referrerCoinsAward > 0) {
        await tx.userProgress.upsert({
          where: { userId: referrerId },
          create: {
            userId: referrerId,
            coins: referrerCoinsAward,
            totalXp: referrerXpAward,
          },
          update: {
            coins: { increment: referrerCoinsAward },
          },
        });
      }
    }

    // 4. Attribution des récompenses au filleul (uniquement si non encore attribuées)
    const currentRefereeXp = Number(referral.refereeXpAwarded) || 0;
    const currentRefereeCoins = Number(referral.refereeCoinsAwarded) || 0;
    const shouldAwardReferee = currentRefereeXp === 0;

    if (shouldAwardReferee && refereeXpAward > 0) {
      await this.progressionService.awardXp(
        refereeId,
        refereeXpAward,
        'welcome_referral_reward',
        `Bonus de bienvenue parrainage Kanto MG`,
      );

      if (refereeCoinsAward > 0) {
        await tx.userProgress.upsert({
          where: { userId: refereeId },
          create: {
            userId: refereeId,
            coins: refereeCoinsAward,
            totalXp: refereeXpAward,
          },
          update: {
            coins: { increment: refereeCoinsAward },
          },
        });
      }
    }

    const finalRefereeXp = Math.max(currentRefereeXp, refereeXpAward);
    const finalRefereeCoins = Math.max(currentRefereeCoins, refereeCoinsAward);

    // 5. Mise à jour de l'état du parrainage
    await tx.referral.update({
      where: { id: referral.id },
      data: {
        status: ReferralStatus.COMPLETED,
        completedAt: new Date(),
        referrerXpAwarded: referrerXpAward,
        referrerCoinsAwarded: referrerCoinsAward,
        refereeXpAwarded: finalRefereeXp,
        refereeCoinsAwarded: finalRefereeCoins,
      },
    });

    this.logger.log(
      `[Referral] Parrainage validé avec succès : filleul ${refereeId}, parrain ${referrerId} (+${referrerXpAward} XP, +${referrerCoinsAward} Vola)`,
    );

    // 6. Notifications après validation et attribution effective des récompenses
    // Notification au parrain (Récompense ou Plafond atteint)
    if (canRewardReferrer && referrerXpAward > 0) {
      await this.sendReferralNotificationSafe({
        userId: referrerId,
        idempotencyKey: `referral_completed_referrer:${referral.id}`,
        titleMg: 'Mpiara-dia vaovao tonga soa ! 🌟',
        titleFr: 'Nouveau filleul validé ! 🌟',
        messageMg: `Niditra tao amin'ny Kanto MG ny namanao. Nahazo +${referrerXpAward} XP sy +${referrerCoinsAward} Vola ianao !`,
        messageFr: `Votre proche a rejoint Kanto MG ! Vous venez de recevoir +${referrerXpAward} XP et +${referrerCoinsAward} Vola.`,
        category: 'reward',
        badgeText: `+${referrerXpAward} XP`,
        badgeType: 'reward',
        iconName: 'gift-outline',
        iconColor: '#C58B38',
        targetRoute: '/(screens)/profile/referral',
      });
    } else if (!canRewardReferrer) {
      await this.sendReferralNotificationSafe({
        userId: referrerId,
        idempotencyKey: `referral_completed_max_reached_referrer:${referral.id}`,
        titleMg: 'Parrainage voamarina ! 🤝',
        titleFr: 'Parrainage validé ! 🤝',
        messageMg: `Voamarina ny fidiran'ny namanao. Efa tratranao ny fetra ambony indrindra amin'ny valisoa (${config.maxRewardsPerReferrer} fanasana), misaotra anao mampiroborobo an'i Kanto MG !`,
        messageFr: `Votre filleul a validé son compte. Vous avez atteint le plafond maximal de récompenses (${config.maxRewardsPerReferrer} parrainages récompensés). Merci pour votre engagement au sein de Kanto MG !`,
        category: 'community',
        badgeText: 'Fihavanana',
        badgeType: 'info',
        iconName: 'checkmark-circle-outline',
        iconColor: '#4A6741',
        targetRoute: '/(screens)/profile/referral',
      });
    }

    // Notification de palier de parrainage (Milestone 5, 10, plafond)
    const newTotalCompleted = completedCount + 1;
    if ([5, 10, config.maxRewardsPerReferrer].includes(newTotalCompleted)) {
      await this.sendReferralNotificationSafe({
        userId: referrerId,
        idempotencyKey: `referral_milestone_${newTotalCompleted}:${referrerId}`,
        titleMg: 'Dingana lehibe amin’ny fanasana ! 🏆',
        titleFr: 'Objectif de parrainage atteint ! 🏆',
        messageMg: `Arahabaina ! Nahatratra mpiara-dia ${newTotalCompleted} voamarina ianao. Misaotra anao manamafy ny Fihavanana !`,
        messageFr: `Félicitations ! Vous avez atteint le palier de ${newTotalCompleted} filleuls validés sur Kanto MG. Le lien du Fihavanana grandit grâce à vous !`,
        category: 'reward',
        badgeText: `Palier ${newTotalCompleted}`,
        badgeType: 'reward',
        iconName: 'trophy-outline',
        iconColor: '#D97706',
        targetRoute: '/(screens)/profile/referral',
      });
    }

    // Notification au filleul : Parrainage validé
    await this.sendReferralNotificationSafe({
      userId: refereeId,
      idempotencyKey: `referral_completed_referee:${referral.id}`,
      titleMg: 'Parrainage voamarina tanteraka ! ✨',
      titleFr: 'Parrainage validé avec succès ! ✨',
      messageMg: `Voamarina tanteraka ny kaontinao nampiasa fanasana. Tohizo ny fitetezana ny ohabolana, angano ary lalao ao amin'ny Kanto MG !`,
      messageFr: `Votre compte parrainé est désormais définitivement actif et validé. Explorez dès maintenant tous les contes et proverbes !`,
      category: 'reward',
      badgeText: 'Voamarina',
      badgeType: 'new',
      iconName: 'ribbon-outline',
      iconColor: '#4A6741',
      targetRoute: '/(screens)/profile/referral',
    });

    return {
      completed: true,
      referrerXp: referrerXpAward,
      referrerCoins: referrerCoinsAward,
      refereeXp: finalRefereeXp,
      refereeCoins: finalRefereeCoins,
    };
  }

  /**
   * Valide définitivement le parrainage et distribue les récompenses de façon atomique et idempotente.
   * Peut être appelé après vérification e-mail, 1er quiz joué ou 1ère session active.
   */
  async completeReferral(refereeId: string): Promise<{
    completed: boolean;
    referrerXp: number;
    referrerCoins: number;
    refereeXp: number;
    refereeCoins: number;
  }> {
    return this.prisma.$transaction(async (tx) => {
      return this.executeCompleteReferral(refereeId, tx);
    });
  }

  // ─── Administration & Modération ──────────────────────────────────────────

  /**
   * Diagnostic des notifications et événements de parrainage pour l'administration.
   */
  async getAdminReferralNotifications(limit = 50) {
    const safeLimit = Math.min(100, Math.max(1, limit));
    const [total, notifications] = await Promise.all([
      this.prisma.notification.count({
        where: { targetRoute: { contains: 'referral' } },
      }),
      this.prisma.notification.findMany({
        where: { targetRoute: { contains: 'referral' } },
        orderBy: { createdAt: 'desc' },
        take: safeLimit,
        include: {
          user: {
            select: { id: true, name: true, email: true, username: true },
          },
        },
      }),
    ]);

    return {
      total,
      limit: safeLimit,
      items: notifications.map((n) => ({
        id: n.id,
        userId: n.userId,
        recipientName: n.user?.name || n.user?.username || 'Membre Kanto',
        recipientEmail: n.user?.email || null,
        titleFr: n.titleFr,
        titleMg: n.titleMg,
        messageFr: n.messageFr,
        badgeText: n.badgeText,
        badgeType: n.badgeType,
        targetRoute: n.targetRoute,
        isRead: n.isRead,
        createdAt: n.createdAt,
      })),
    };
  }

  /**
   * Tableau de bord global du parrainage pour l'administration.
   */
  async getAdminOverview() {
    const config = await this.getOrCreateConfig();

    const [
      totalCodes,
      totalReferrals,
      pendingCount,
      completedCount,
      rejectedCount,
      sumStats,
      referralNotificationsCount,
    ] = await Promise.all([
      this.prisma.referralCode.count(),
      this.prisma.referral.count(),
      this.prisma.referral.count({ where: { status: ReferralStatus.PENDING } }),
      this.prisma.referral.count({ where: { status: ReferralStatus.COMPLETED } }),
      this.prisma.referral.count({ where: { status: ReferralStatus.REJECTED } }),
      this.prisma.referral.aggregate({
        where: { status: ReferralStatus.COMPLETED },
        _sum: {
          referrerXpAwarded: true,
          referrerCoinsAwarded: true,
          refereeXpAwarded: true,
          refereeCoinsAwarded: true,
        },
      }),
      this.prisma.notification.count({
        where: { targetRoute: { contains: 'referral' } },
      }),
    ]);

    const totalClicksAggregate = await this.prisma.referralCode.aggregate({
      _sum: { clicksCount: true },
    });

    const totalClicks = totalClicksAggregate._sum.clicksCount || 0;
    const conversionRate =
      totalClicks > 0
        ? Number(((completedCount / totalClicks) * 100).toFixed(1))
        : 0;

    return {
      config,
      metrics: {
        totalCodes,
        totalClicks,
        totalReferrals,
        pendingCount,
        completedCount,
        rejectedCount,
        conversionRate,
        totalXpDistributed:
          (sumStats._sum.referrerXpAwarded || 0) +
          (sumStats._sum.refereeXpAwarded || 0),
        totalCoinsDistributed:
          (sumStats._sum.referrerCoinsAwarded || 0) +
          (sumStats._sum.refereeCoinsAwarded || 0),
        referralNotificationsCount,
      },
    };
  }

  /**
   * Liste paginée des parrainages pour l'administration.
   */
  async getAdminReferralsList(query: AdminReferralQueryDto) {
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status && Object.values(ReferralStatus).includes(query.status as any)) {
      where.status = query.status as ReferralStatus;
    }

    if (query.search && query.search.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { referrer: { name: { contains: q, mode: 'insensitive' } } },
        { referrer: { email: { contains: q, mode: 'insensitive' } } },
        { referee: { name: { contains: q, mode: 'insensitive' } } },
        { referee: { email: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.referral.count({ where }),
      this.prisma.referral.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          referrer: {
            select: { id: true, name: true, email: true, username: true },
          },
          referee: {
            select: { id: true, name: true, email: true, username: true },
          },
        },
      }),
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Met à jour la configuration du programme avec journalisation d'audit.
   */
  async updateAdminConfig(dto: UpdateReferralConfigDto, adminUserId: string) {
    const current = await this.getOrCreateConfig();

    const updated = await this.prisma.referralConfig.update({
      where: { id: 'default' },
      data: {
        isEnabled: dto.isEnabled ?? current.isEnabled,
        referrerXp: dto.referrerXp ?? current.referrerXp,
        referrerCoins: dto.referrerCoins ?? current.referrerCoins,
        refereeXp: dto.refereeXp ?? current.refereeXp,
        refereeCoins: dto.refereeCoins ?? current.refereeCoins,
        maxRewardsPerReferrer:
          dto.maxRewardsPerReferrer ?? current.maxRewardsPerReferrer,
        requireFirstActivity:
          dto.requireFirstActivity ?? current.requireFirstActivity,
        welcomeMessageMg: dto.welcomeMessageMg ?? current.welcomeMessageMg,
        welcomeMessageFr: dto.welcomeMessageFr ?? current.welcomeMessageFr,
      },
    });

    // Journalisation d'audit
    try {
      await this.prisma.adminAuditLog.create({
        data: {
          userId: adminUserId,
          action: 'SETTINGS_UPDATED',
          targetType: 'SYSTEM',
          targetId: 'referral_config',
          targetLabel: 'Configuration du Programme de Parrainage',
          reason: 'Mise à jour des paramètres du parrainage par un administrateur',
          details: JSON.parse(
            JSON.stringify({
              previous: current,
              updated: dto,
            }),
          ),
        },
      });
    } catch (auditErr) {
      this.logger.warn(`Erreur log audit parrainage : ${auditErr}`);
    }

    return updated;
  }
}
