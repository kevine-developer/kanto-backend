import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import fs from 'node:fs';
import path from 'node:path';
import { PrismaService } from '../prisma/prisma.service.js';
import { CloudinaryService } from '../integrations/cloudinary/cloudinary.service.js';
import { ResendService } from '../integrations/resend/resend.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { DeleteAccountDto } from './dto/delete-account.dto.js';
import { FriendshipStatus } from '../../generated/prisma/client.js';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly resendService: ResendService,
  ) {}

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
          username: true,
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          tier: true,
          termsAcceptedAt: true,
          termsVersion: true,
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

  /**
   * Récupère le profil public complet d'un utilisateur avec ses stats réelles,
   * son rang mondial et le statut relationnel/amitié vis-à-vis de l'utilisateur connecté.
   */
  async getPublicProfile(targetUserId: string, currentUserId?: string) {
    const [
      user,
      progress,
      contributionsCount,
      tfSessions,
      riddleSessions,
      quizSessions,
      duelCount,
      badgesCount,
      approvedContributions,
      badges,
    ] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: targetUserId },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          role: true,
          tier: true,
          createdAt: true,
        },
      }),
      this.prisma.userProgress.findUnique({
        where: { userId: targetUserId },
      }),
      this.prisma.contribution.count({ where: { userId: targetUserId } }),
      this.prisma.trueFalseSession.findMany({
        where: { userId: targetUserId, isCompleted: true },
        select: { score: true, totalQuestions: true },
      }),
      this.prisma.riddleSession.findMany({
        where: { userId: targetUserId, isCompleted: true },
        select: { score: true, totalQuestions: true },
      }),
      this.prisma.civicQuizSession.findMany({
        where: { userId: targetUserId, isCompleted: true },
        select: { score: true, totalQuestions: true },
      }),
      this.prisma.duelPlayer.count({
        where: { userId: targetUserId },
      }),
      this.prisma.userBadge.count({
        where: { userId: targetUserId },
      }),
      this.prisma.contribution.findMany({
        where: {
          userId: targetUserId,
          status: 'APPROVED',
        },
        select: {
          id: true,
          category: true,
          textMg: true,
          textFr: true,
          meaning: true,
          score: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.userBadge.findMany({
        where: { userId: targetUserId },
        select: {
          badgeId: true,
          unlockedAt: true,
        },
        orderBy: { unlockedAt: 'desc' },
        take: 12,
      }),
    ]);

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const allSessions = [...tfSessions, ...riddleSessions, ...quizSessions];
    const gamesPlayed = allSessions.length + duelCount;

    let totalScore = 0;
    let totalQuestions = 0;
    for (const s of allSessions) {
      totalScore += s.score || 0;
      totalQuestions += s.totalQuestions || 0;
    }

    const accuracy =
      totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

    const totalXp = Math.ceil(Number(progress?.totalXp || 0));

    // Calcul du rang mondial all-time
    const rank =
      (await this.prisma.userProgress.count({
        where: { totalXp: { gt: totalXp } },
      })) + 1;

    // Statut d'amitié & encouragement si currentUserId est fourni
    let friendshipStatus:
      'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'FRIENDS' | 'BLOCKED' =
      'NONE';
    let friendshipId: string | undefined = undefined;
    let canEncourage = false;
    let hasEncouragedToday = false;
    let h2h = {
      totalDuels: 0,
      myWins: 0,
      friendWins: 0,
      draws: 0,
    };

    if (currentUserId && currentUserId !== targetUserId) {
      const [friendship, existingEncouragement, h2hSessions] = await Promise.all([
        this.prisma.friendship.findFirst({
          where: {
            OR: [
              { senderId: currentUserId, receiverId: targetUserId },
              { senderId: targetUserId, receiverId: currentUserId },
            ],
          },
        }),
        this.prisma.encouragement.findUnique({
          where: {
            senderId_receiverId_date: {
              senderId: currentUserId,
              receiverId: targetUserId,
              date: new Date(
                Date.UTC(
                  new Date().getUTCFullYear(),
                  new Date().getUTCMonth(),
                  new Date().getUTCDate(),
                ),
              ),
            },
          },
        }),
        this.prisma.duelSession.findMany({
          where: {
            status: 'FINISHED',
            OR: [
              { player1Id: currentUserId, player2Id: targetUserId },
              { player1Id: targetUserId, player2Id: currentUserId },
            ],
          },
          select: {
            winnerId: true,
          },
        }),
      ]);

      if (friendship) {
        friendshipId = friendship.id;
        if (friendship.status === FriendshipStatus.ACCEPTED) {
          friendshipStatus = 'FRIENDS';
        } else if (friendship.status === FriendshipStatus.PENDING) {
          friendshipStatus =
            friendship.senderId === currentUserId
              ? 'PENDING_SENT'
              : 'PENDING_RECEIVED';
        } else if (friendship.status === FriendshipStatus.BLOCKED) {
          friendshipStatus = 'BLOCKED';
        }
      }

      hasEncouragedToday = !!existingEncouragement;
      canEncourage = !existingEncouragement;

      let myWins = 0;
      let friendWins = 0;
      let draws = 0;
      for (const duel of h2hSessions) {
        if (!duel.winnerId) {
          draws++;
        } else if (duel.winnerId === currentUserId) {
          myWins++;
        } else {
          friendWins++;
        }
      }
      h2h = {
        totalDuels: h2hSessions.length,
        myWins,
        friendWins,
        draws,
      };
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        username:
          user.username || `@${user.name.toLowerCase().replace(/\s+/g, '_')}`,
        image: user.image,
        tier: user.tier,
        createdAt: user.createdAt,
      },
      stats: {
        level: progress?.level || 1,
        totalXp,
        streakDays: progress?.streakDays || 0,
        rank,
        contributionsCount,
        gamesPlayed,
        accuracy,
        badgesCount,
      },
      friendship: {
        status: friendshipStatus,
        friendshipId,
        canEncourage,
        hasEncouragedToday,
      },
      h2h,
      badges,
      approvedContributions,
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

    if (dto.username) {
      const normalizedUsername = dto.username.trim().toLowerCase();
      const existingUsernameUser = await this.prisma.user.findUnique({
        where: { username: normalizedUsername },
      });
      if (existingUsernameUser && existingUsernameUser.id !== userId) {
        throw new ConflictException(
          "Ce nom d'utilisateur est déjà utilisé par un autre membre",
        );
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name.trim() }),
        ...(dto.username !== undefined && {
          username: dto.username ? dto.username.trim().toLowerCase() : null,
        }),
        ...(dto.image !== undefined && { image: dto.image }),
        ...(dto.email && {
          email: dto.email.trim().toLowerCase(),
          emailVerified: false,
        }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        tier: true,
        updatedAt: true,
      },
    });

    return { success: true, user };
  }

  async checkUsernameAvailability(username: string, currentUserId?: string) {
    const trimmed = (username || '').trim().toLowerCase();

    if (!/^[a-zA-Z0-9_]{3,25}$/.test(trimmed)) {
      return {
        available: false,
        message:
          "Le nom d'utilisateur doit contenir entre 3 et 25 caractères (lettres, chiffres, underscore)",
      };
    }

    const existing = await this.prisma.user.findUnique({
      where: { username: trimmed },
      select: { id: true },
    });

    if (existing && existing.id !== currentUserId) {
      return {
        available: false,
        message: "Ce nom d'utilisateur est déjà pris",
      };
    }

    return {
      available: true,
      message: "Ce nom d'utilisateur est disponible",
    };
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
        poesie: true,
        recitation: true,
      },
    });

    return favorites;
  }

  /**
   * Téléverse une photo de profil (Cloudinary CDN avec fallback local sécurisé).
   */
  async uploadAvatar(
    userId: string,
    base64Data: string,
    originalName?: string,
  ): Promise<{ success: boolean; url: string; user: any }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const oldImageUrl = existingUser.image;
    const { buffer, mimeType } =
      this.cloudinaryService.validateAndDecodeBase64Image(base64Data);

    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };
    const extension = mimeToExt[mimeType] ?? 'png';

    let imageUrl: string | undefined;

    if (this.cloudinaryService.isConfigured()) {
      try {
        imageUrl = await this.cloudinaryService.uploadImageBase64(
          base64Data,
          originalName || `avatar_${userId}`,
          'kanto/images/avatars',
        );
        this.logger.log(
          `[Cloudinary] Avatar utilisateur hébergé : ${imageUrl}`,
        );
      } catch (err: unknown) {
        this.logger.warn(
          `[Cloudinary] Échec upload avatar (${
            err instanceof Error ? err.message : 'erreur inconnue'
          }). Bascule vers stockage local.`,
        );
      }
    }

    if (!imageUrl) {
      const uploadDir = path.resolve(process.cwd(), 'uploads', 'avatars');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `avatar-${userId}-${Date.now()}.${extension}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.promises.writeFile(filePath, buffer);
      imageUrl = `/uploads/avatars/${fileName}`;
      this.logger.log(`[Local] Avatar enregistré en local : ${imageUrl}`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
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

    // Suppression automatique de l'ancien avatar sur Cloudinary ou en local
    if (oldImageUrl && oldImageUrl !== imageUrl) {
      this.cloudinaryService.deleteMediaFromUrl(oldImageUrl).catch(() => {});
    }

    return { success: true, url: imageUrl, user: updatedUser };
  }

  /**
   * Supprime la photo de profil (remise à null) et détruit l'asset sur Cloudinary.
   */
  async deleteAvatar(userId: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const oldImageUrl = existingUser.image;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { image: '/uploads/avatars/default-avatar.png' },
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

    // Suppression de l'avatar personnalisé sur Cloudinary ou en local (ne pas supprimer l'avatar par défaut)
    if (
      oldImageUrl &&
      oldImageUrl !== '/uploads/avatars/default-avatar.png' &&
      !oldImageUrl.includes('default-avatar.png')
    ) {
      this.cloudinaryService.deleteMediaFromUrl(oldImageUrl).catch(() => {});
    }

    return { success: true, user: updatedUser };
  }

  /**
   * Retourne les méthodes d'authentification actives associées au compte.
   * Utilisé par l'interface mobile pour adapter dynamiquement les options de sécurité.
   * Ne retourne jamais le mot de passe ou les tokens.
   */
  async getAuthMethods(userId: string): Promise<{
    providers: string[];
    hasPassword: boolean;
  }> {
    const accounts = await this.prisma.account.findMany({
      where: { userId },
      select: { providerId: true },
    });

    if (!accounts.length) {
      return { providers: [], hasPassword: false };
    }

    const providers = accounts.map((a) => a.providerId);
    const hasPassword = providers.includes('credential');

    return { providers, hasPassword };
  }

  /**
   * Ajoute un mot de passe Kanto à un compte qui n'en possède pas encore.
   * Réservé exclusivement aux comptes utilisant uniquement des fournisseurs OAuth.
   * Utilise hashPassword de Better-Auth pour garantir la compatibilité du format de hash.
   *
   * Sécurité :
   * - Vérifie que le compte n'a pas déjà un mot de passe (idempotence)
   * - Hashe le mot de passe avec le même algorithme que Better-Auth (scrypt)
   * - Ne révèle pas l'existence d'un compte si userId invalide
   * - Envoie une notification email de sécurité après succès
   */
  async addPassword(
    userId: string,
    newPassword: string,
  ): Promise<{ success: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // Vérification idempotente : le compte possède-t-il déjà un mot de passe ?
    const existingCredential = await this.prisma.account.findFirst({
      where: { userId, providerId: 'credential' },
      select: { id: true },
    });

    if (existingCredential) {
      throw new ConflictException(
        'Ce compte possède déjà un mot de passe. Utilisez la fonctionnalité de modification du mot de passe.',
      );
    }

    // Hachage sécurisé via le même algorithme que Better-Auth (scrypt, node:crypto)
    let hashedPassword: string;
    try {
      const { hashPassword } = await import('@better-auth/utils/password');
      hashedPassword = await hashPassword(newPassword);
    } catch {
      // Fallback: utiliser better-auth/crypto
      try {
        const { hashPassword: hashPasswordFallback } =
          await import('better-auth/crypto');
        hashedPassword = await hashPasswordFallback(newPassword);
      } catch (fallbackErr) {
        this.logger.error(
          '[addPassword] Échec du hachage du mot de passe :',
          fallbackErr,
        );
        throw new BadRequestException(
          'Une erreur interne est survenue. Veuillez réessayer.',
        );
      }
    }

    // Création de l'Account credential — format identique à celui créé par Better-Auth
    await this.prisma.account.create({
      data: {
        accountId: user.id,
        providerId: 'credential',
        userId: user.id,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    this.logger.log(
      `[addPassword] Mot de passe ajouté pour l'utilisateur ${userId}`,
    );

    // Notification email de sécurité (non bloquante)
    this.resendService
      .sendSecurityChangeEmail({
        to: user.email,
        userName: user.name,
        action: 'added',
      })
      .catch((err) => {
        this.logger.warn(
          `[addPassword] Échec envoi email de notification sécurité pour ${user.email} :`,
          err,
        );
      });

    return { success: true };
  }

  /**
   * Suppression définitive d'un compte utilisateur et de ses données personnelles (Droit à l'effacement RGPD).
   *
   * Sécurité & Conformité :
   * 1. Vérification de l'identité :
   *    - Compte avec mot de passe (credential) : exige la vérification du mot de passe actuel.
   *    - Compte exclusivement OAuth (ex: Google) : s'appuie sur la session authentifiée forte et la phrase de confirmation.
   * 2. Confirmation explicite obligatoire : saisie exacte de « SUPPRIMER MON COMPTE ».
   * 3. Préservation du patrimoine culturel malgache (CGU Kanto) :
   *    - Les contributions non approuvées (brouillons, en attente, refusées) sont supprimées.
   *    - Les contributions publiques approuvées sont conservées sous forme strictement anonymisée
   *      (réassignées à l'utilisateur système d'archive "Contributeur Kanto", sans aucun lien vers l'ancien compte).
   * 4. Nettoyage relationnel & UGC :
   *    - Détachement et suppression des quiz créés par l'utilisateur (UserQuizSet).
   *    - Anonymisation des logs de modération, d'audit et des participations multijoueurs.
   *    - Suppression atomique en cascade de toutes les données personnelles (profil, sessions, jetons, favoris, historique, amitiés).
   * 5. Nettoyage des actifs externes (Cloudinary / disques) et envoi d'un email de confirmation formel.
   */
  async deleteAccount(
    userId: string,
    dto: DeleteAccountDto,
  ): Promise<{ success: boolean; message: string }> {
    // 1. Récupération de l'utilisateur avec ses comptes liés
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // 2. Vérification stricte de la phrase de confirmation
    if (dto.confirmationPhrase?.trim() !== 'SUPPRIMER MON COMPTE') {
      throw new BadRequestException(
        'Veuillez saisir exactement « SUPPRIMER MON COMPTE » pour confirmer la suppression.',
      );
    }

    // 3. Vérification de l'identité selon le mode d'authentification
    const credentialAccount = user.accounts.find(
      (acc) => acc.providerId === 'credential',
    );

    if (credentialAccount) {
      if (!dto.password) {
        throw new BadRequestException(
          'Votre mot de passe actuel est requis pour confirmer la suppression de votre compte.',
        );
      }

      if (!credentialAccount.password) {
        this.logger.error(
          `[deleteAccount] Compte credential sans mot de passe stocké pour userId: ${userId}`,
        );
        throw new BadRequestException(
          'Une erreur interne est survenue. Veuillez contacter le support.',
        );
      }

      let isValidPassword = false;
      try {
        const { verifyPassword } = await import('@better-auth/utils/password');
        isValidPassword = await verifyPassword(
          credentialAccount.password,
          dto.password,
        );
      } catch {
        try {
          const { verifyPassword: verifyPasswordFallback } =
            await import('better-auth/crypto');
          isValidPassword = await verifyPasswordFallback({
            hash: credentialAccount.password,
            password: dto.password,
          });
        } catch (fallbackErr) {
          this.logger.error(
            '[deleteAccount] Échec de la vérification du mot de passe :',
            fallbackErr,
          );
          throw new BadRequestException(
            'Impossible de valider votre mot de passe. Veuillez réessayer.',
          );
        }
      }

      if (!isValidPassword) {
        throw new UnauthorizedException('Mot de passe incorrect.');
      }
    }

    // Conserver en mémoire les données nécessaires aux opérations post-suppression
    const userEmail = user.email;
    const userName = user.name;
    const userImage = user.image;

    // 4. Transaction de suppression atomique en base de données
    await this.prisma.$transaction(async (tx) => {
      // A. Détacher les duels référençant un jeu de quiz créé par l'utilisateur
      await tx.duelSession.updateMany({
        where: {
          customQuizSet: {
            authorId: userId,
          },
        },
        data: {
          customQuizSetId: null,
        },
      });

      // B. Supprimer les questions UGC créées par l'utilisateur
      await tx.userQuestion.deleteMany({
        where: {
          quizSet: {
            authorId: userId,
          },
        },
      });

      // C. Supprimer les quiz sets UGC de l'utilisateur
      await tx.userQuizSet.deleteMany({
        where: {
          authorId: userId,
        },
      });

      // D. Anonymiser les participations multijoueurs (DuelPlayer)
      await tx.duelPlayer.updateMany({
        where: { userId },
        data: {
          name: 'Joueur supprimé',
          avatar: null,
        },
      });

      // E. Anonymiser les duels 1v1 où l'utilisateur était joueur ou vainqueur
      await tx.duelSession.updateMany({
        where: { player1Id: userId },
        data: {
          player1Name: 'Joueur supprimé',
          player1Avatar: null,
        },
      });

      await tx.duelSession.updateMany({
        where: { player2Id: userId },
        data: {
          player2Name: 'Joueur supprimé',
          player2Avatar: null,
        },
      });

      await tx.duelSession.updateMany({
        where: { winnerId: userId },
        data: {
          winnerId: null,
        },
      });

      // F. Anonymiser les logs d'audit des contributions
      await tx.contributionAuditLog.updateMany({
        where: { userId },
        data: {
          userId: null,
        },
      });

      // G. Traitement des contributions culturelles (CGU Kanto & RGPD)
      // 1. Supprimer les contributions non approuvées (brouillons, en attente, rejetées)
      await tx.contribution.deleteMany({
        where: {
          userId,
          status: {
            not: 'APPROVED',
          },
        },
      });

      // 2. Anonymiser les contributions approuvées en les réassignant au compte d'archive
      const approvedCount = await tx.contribution.count({
        where: {
          userId,
          status: 'APPROVED',
        },
      });

      if (approvedCount > 0) {
        const archiveUser = await tx.user.upsert({
          where: { email: 'archive@kanto.mg' },
          update: {},
          create: {
            name: 'Contributeur Kanto',
            email: 'archive@kanto.mg',
            username: 'kanto_archive',
            emailVerified: true,
            role: 'USER',
            termsAcceptedAt: new Date(),
            termsVersion: '1.0',
          },
        });

        await tx.contribution.updateMany({
          where: {
            userId,
            status: 'APPROVED',
          },
          data: {
            userId: archiveUser.id,
          },
        });
      }

      // H. Suppression définitive du compte utilisateur (Cascade automatique pour les sessions, favoris, etc.)
      await tx.user.delete({
        where: { id: userId },
      });
    });

    this.logger.log(
      `[deleteAccount] Compte et données personnelles supprimés avec succès pour l'utilisateur ${userId}`,
    );

    // 5. Opérations post-transactionnelles (non-bloquantes)
    // A. Suppression de l'avatar personnalisé
    if (
      userImage &&
      userImage !== '/uploads/avatars/default-avatar.png' &&
      !userImage.includes('default-avatar.png')
    ) {
      this.cloudinaryService.deleteMediaFromUrl(userImage).catch((err) => {
        this.logger.warn(
          `[deleteAccount] Échec suppression média avatar pour ${userId} :`,
          err,
        );
      });
    }

    // B. Envoi de l'email de confirmation formelle
    this.resendService
      .sendAccountDeletionEmail({
        to: userEmail,
        userName,
      })
      .catch((err) => {
        this.logger.warn(
          `[deleteAccount] Échec envoi email confirmation suppression pour ${userEmail} :`,
          err,
        );
      });

    return {
      success: true,
      message:
        'Votre compte et l’ensemble de vos données personnelles ont été supprimés avec succès.',
    };
  }
}
