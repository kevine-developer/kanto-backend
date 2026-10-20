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
   * Associe un code de parrainage à un nouvel utilisateur (filleul).
   * Appelé lors de l'inscription ou lors de la 1ère connexion.
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

    const normalizedCode = rawCode.trim().toUpperCase();

    // 1. Trouver le code de parrainage
    const referralCode = await this.prisma.referralCode.findUnique({
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
    const existingReferral = await this.prisma.referral.findUnique({
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
      if (existingReferral.code === normalizedCode) {
        const refereeXp = Number(config.refereeXp) || 0;
        const refereeCoins = Number(config.refereeCoins) || 0;

        // Rattrapage des récompenses filleul si elles n'avaient pas été attribuées
        if (existingReferral.refereeXpAwarded === 0 && refereeXp > 0) {
          await this.progressionService.awardXp(
            refereeId,
            refereeXp,
            'welcome_referral_reward',
            `Bonus de bienvenue parrainage Kanto MG (code: ${normalizedCode})`,
          );
        }

        if (existingReferral.refereeCoinsAwarded === 0 && refereeCoins > 0) {
          await this.prisma.userProgress.upsert({
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
          await this.prisma.referral.update({
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
          };
        }

        // Si PENDING et première activité non requise, finaliser
        if (!config.requireFirstActivity) {
          const completionResult = await this.completeReferral(refereeId);
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
        };
      }

      throw new ConflictException(
        'Ce compte a déjà bénéficié d’un code de parrainage.',
      );
    }

    // 4. Contrôle anti-fraude : parrainage réciproque / cycle
    const reciprocal = await this.prisma.referral.findFirst({
      where: {
        referrerId: refereeId,
        refereeId: referrerId,
      },
    });

    if (reciprocal) {
      throw new BadRequestException(
        'Opération non autorisée : parrainage réciproque détecté.',
      );
    }

    // 5. Création de l'enregistrement de parrainage (statut PENDING)
    const referral = await this.prisma.referral.create({
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

    // 6. Attribution immédiate du bonus de bienvenue au nouvel inscrit (filleul)
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
      await this.prisma.userProgress.upsert({
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

    await this.prisma.referral.update({
      where: { id: referral.id },
      data: {
        refereeXpAwarded: refereeXp,
        refereeCoinsAwarded: refereeCoins,
      },
    });

    // Si la configuration n'exige pas d'activité préalable, validation immédiate du parrain également
    if (!config.requireFirstActivity) {
      const completionResult = await this.completeReferral(refereeId);
      return {
        success: true,
        status: ReferralStatus.COMPLETED,
        referrerName: this.formatMaskedName(
          referralCode.user.name,
          referralCode.user.username,
        ),
        refereeXpAwarded: completionResult.refereeXp,
        refereeCoinsAwarded: completionResult.refereeCoins,
        message: 'Parrainage validé avec succès ! Vos récompenses ont été créditées.',
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
    const config = await this.getOrCreateConfig();

    return this.prisma.$transaction(async (tx) => {
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

        // Notification push / in-app au parrain
        try {
          await this.notificationsService.createNotification({
            userId: referrerId,
            titleMg: 'Mpiara-dia vaovao tonga soa !',
            titleFr: 'Nouveau filleul validé !',
            messageMg: `Niditra tao amin'ny Kanto MG ny namanao. Nahazo +${referrerXpAward} XP sy +${referrerCoinsAward} Vola ianao !`,
            messageFr: `Votre proche a rejoint Kanto MG ! Vous venez de recevoir +${referrerXpAward} XP et +${referrerCoinsAward} Vola.`,
            category: 'reward',
            badgeText: `+${referrerXpAward} XP`,
            badgeType: 'reward',
            iconName: 'gift-outline',
            iconColor: '#C58B38',
            targetRoute: '/(screens)/profile/referral',
            isBroadcast: false,
          });
        } catch (notifErr) {
          this.logger.warn(`Erreur envoi notification au parrain : ${notifErr}`);
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

      return {
        completed: true,
        referrerXp: referrerXpAward,
        referrerCoins: referrerCoinsAward,
        refereeXp: finalRefereeXp,
        refereeCoins: finalRefereeCoins,
      };
    });
  }

  // ─── Administration & Modération ──────────────────────────────────────────

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
