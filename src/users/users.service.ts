import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import fs from 'node:fs';
import path from 'node:path';
import { PrismaService } from '../prisma/prisma.service.js';
import { CloudinaryService } from '../integrations/cloudinary/cloudinary.service.js';
import { ResendService } from '../integrations/resend/resend.service.js';
import { EventNotificationService } from '../notifications/event-notification.service.js';
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
    @Optional()
    private readonly eventNotificationService?: EventNotificationService,
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
      const [friendship, existingEncouragement, h2hSessions] =
        await Promise.all([
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
      data: { image: null },
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
      !oldImageUrl.includes('default-avatar') &&
      !oldImageUrl.includes('default_avatar')
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
      select: {
        id: true,
        providerId: true,
        password: true,
        issuer: true,
        accountId: true,
      },
    });

    if (!accounts.length) {
      return { providers: [], hasPassword: false };
    }

    // Auto-réparation proactive : si un compte credential existe avec un mot de passe
    // mais sans l'issuer Better-Auth attendu ('local:credential'), on le normalise
    // immédiatement pour que changePassword et sign-in fonctionnent sans accroc.
    for (const acc of accounts) {
      if (
        acc.providerId === 'credential' &&
        acc.password &&
        (acc.issuer !== 'local:credential' || acc.accountId !== userId)
      ) {
        await this.prisma.account.update({
          where: { id: acc.id },
          data: {
            issuer: 'local:credential',
            accountId: userId,
            updatedAt: new Date(),
          },
        });
        this.logger.log(
          `[getAuthMethods] Compte credential normalisé pour userId: ${userId} (issuer: local:credential)`,
        );
      }
    }

    const providers = accounts.map((a) => a.providerId);
    const hasPassword = accounts.some(
      (a) => a.providerId === 'credential' && Boolean(a.password),
    );

    return { providers, hasPassword };
  }

  /**
   * Ajoute un premier mot de passe Kanto à un compte OAuth (Situation A).
   * Enregistre l'Account au format strictement conforme à Better-Auth (issuer: 'local:credential').
   *
   * Sécurité :
   * - Vérifie que le compte n'a pas déjà un mot de passe (idempotence)
   * - Hashe le mot de passe avec le moteur cryptographique officiel de Better-Auth (scrypt)
   * - Conserve le compte Google existant sans duplication
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
      select: { id: true, password: true, issuer: true, accountId: true },
    });

    if (existingCredential && Boolean(existingCredential.password)) {
      // S'assurer que le compte existant a bien son issuer Better-Auth normalisé
      if (
        existingCredential.issuer !== 'local:credential' ||
        existingCredential.accountId !== user.id
      ) {
        await this.prisma.account.update({
          where: { id: existingCredential.id },
          data: {
            issuer: 'local:credential',
            accountId: user.id,
            updatedAt: new Date(),
          },
        });
      }
      throw new ConflictException(
        'Ce compte possède déjà un mot de passe. Utilisez la fonctionnalité de modification du mot de passe.',
      );
    }

    // Hachage sécurisé officiel via better-auth/crypto (scrypt, compatible avec Better-Auth)
    let hashedPassword: string;
    try {
      const { hashPassword } = await import('better-auth/crypto');
      hashedPassword = await hashPassword(newPassword);
    } catch (hashErr) {
      this.logger.error(
        '[addPassword] Échec du hachage du mot de passe :',
        hashErr,
      );
      throw new BadRequestException(
        'Une erreur interne est survenue lors du chiffrement du mot de passe. Veuillez réessayer.',
      );
    }

    if (existingCredential) {
      // Mise à jour de l'Account credential existant (si créé sans mot de passe ou orphelin)
      await this.prisma.account.update({
        where: { id: existingCredential.id },
        data: {
          password: hashedPassword,
          issuer: 'local:credential',
          accountId: user.id,
          updatedAt: new Date(),
        },
      });
    } else {
      // Création de l'Account credential — format STRICTEMENT conforme à Better-Auth
      await this.prisma.account.create({
        data: {
          accountId: user.id,
          providerId: 'credential',
          issuer: 'local:credential',
          userId: user.id,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    this.logger.log(
      `[addPassword] Mot de passe ajouté avec succès pour l'utilisateur ${userId} (issuer: local:credential)`,
    );

    // Notification de sécurité centralisée (in-app et e-mail transactionnel)
    if (this.eventNotificationService) {
      void this.eventNotificationService
        .dispatchNotificationEvent({
          type: 'SECURITY_PASSWORD_ADDED',
          recipientUserId: user.id,
        })
        .catch((err) => {
          this.logger.warn(
            `[addPassword] Échec notification sécurité pour ${user.email} : ${err}`,
          );
        });
    } else {
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
    }

    return { success: true };
  }

  /**
   * Modifie un mot de passe existant avec vérification de l'ancien mot de passe (Situation B).
   * Utilise le moteur cryptographique de Better-Auth et garantit la conformité de l'Account.
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    revokeOtherSessions = false,
  ): Promise<{ success: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const credentialAccount = await this.prisma.account.findFirst({
      where: { userId, providerId: 'credential' },
      select: { id: true, password: true, issuer: true, accountId: true },
    });

    if (!credentialAccount || !credentialAccount.password) {
      throw new BadRequestException(
        "Aucun mot de passe n'est associé à ce compte. Veuillez d'abord définir un mot de passe.",
      );
    }

    // Vérification sécurisée du mot de passe actuel via better-auth/crypto
    const { verifyPassword, hashPassword } = await import('better-auth/crypto');
    const isValid = await verifyPassword({
      hash: credentialAccount.password,
      password: currentPassword,
    });

    if (!isValid) {
      throw new BadRequestException('Le mot de passe actuel est incorrect.');
    }

    // Hachage du nouveau mot de passe
    const newHashedPassword = await hashPassword(newPassword);

    // Mise à jour de l'Account avec le standard Better-Auth garanti
    await this.prisma.account.update({
      where: { id: credentialAccount.id },
      data: {
        password: newHashedPassword,
        issuer: 'local:credential',
        accountId: user.id,
        updatedAt: new Date(),
      },
    });

    // Invalidation des autres sessions si demandé
    if (revokeOtherSessions) {
      await this.prisma.session.deleteMany({
        where: { userId },
      });
    }

    this.logger.log(
      `[changePassword] Mot de passe modifié pour l'utilisateur ${userId}`,
    );

    // Notification de sécurité centralisée (in-app et e-mail transactionnel)
    if (this.eventNotificationService) {
      void this.eventNotificationService
        .dispatchNotificationEvent({
          type: 'SECURITY_PASSWORD_CHANGED',
          recipientUserId: user.id,
        })
        .catch((err) => {
          this.logger.warn(
            `[changePassword] Échec notification sécurité pour ${user.email} : ${err}`,
          );
        });
    } else {
      this.resendService
        .sendSecurityChangeEmail({
          to: user.email,
          userName: user.name,
          action: 'changed',
        })
        .catch((err) => {
          this.logger.warn(
            `[changePassword] Échec envoi email de notification sécurité pour ${user.email} :`,
            err,
          );
        });
    }

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
  /**
   * Refonte de la suppression de compte avec période de rétractation de 30 jours (RGPD).
   * 1. Vérification de la phrase et du mot de passe.
   * 2. Passage du statut à PENDING_DELETION avec date limite deletionScheduledAt (now + 30j).
   * 3. Révocation immédiate de toutes les sessions actives en base.
   * 4. Envoi d'un email de rétractation expliquant comment annuler la démarche.
   */
  async deleteAccount(
    userId: string,
    dto: DeleteAccountDto,
  ): Promise<{ success: boolean; message: string; deletionScheduledAt?: Date }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (dto.confirmationPhrase?.trim() !== 'SUPPRIMER MON COMPTE') {
      throw new BadRequestException(
        'Veuillez saisir exactement « SUPPRIMER MON COMPTE » pour confirmer la suppression.',
      );
    }

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

    const userEmail = user.email;
    const userName = user.name;
    const deletionScheduledAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Transaction atomique : désactivation du compte et révocation immédiate de toutes les sessions
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          status: 'PENDING_DELETION',
          deactivatedAt: new Date(),
          deletionScheduledAt,
        },
      });

      // Révocation de toutes les sessions actives (déconnexion immédiate)
      await tx.session.deleteMany({
        where: { userId },
      });
    });

    this.logger.log(
      `[deleteAccount] Compte désactivé et placé en période de rétractation de 30 jours pour l'utilisateur ${userId} (Suppression prévue le: ${deletionScheduledAt.toISOString()})`,
    );

    // Envoi de l'email transactionnel d'information avec délai de rétractation
    this.resendService
      .sendAccountPendingDeletionEmail({
        to: userEmail,
        userName,
        deletionScheduledAt,
      })
      .catch((err) => {
        this.logger.warn(
          `[deleteAccount] Échec envoi email rétractation pour ${userEmail} :`,
          err,
        );
      });

    return {
      success: true,
      message:
        'Votre compte a été désactivé et entrera en suppression définitive dans 30 jours. Vous pouvez annuler cette démarche à tout moment en vous reconnectant.',
      deletionScheduledAt,
    };
  }

  /**
   * Récupère le statut de suppression / rétractation du compte connecté
   */
  async getAccountDeletionStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        status: true,
        deactivatedAt: true,
        deletionScheduledAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const isPendingDeletion = user.status === 'PENDING_DELETION';
    let daysRemaining = 0;

    if (isPendingDeletion && user.deletionScheduledAt) {
      const diffMs = new Date(user.deletionScheduledAt).getTime() - Date.now();
      daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }

    return {
      isPendingDeletion,
      status: user.status,
      deactivatedAt: user.deactivatedAt,
      deletionScheduledAt: user.deletionScheduledAt,
      daysRemaining,
    };
  }

  /**
   * Réactive un compte en cours de suppression (annulation de la demande)
   */
  async reactivateAccount(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (user.status !== 'PENDING_DELETION' && user.status !== 'DEACTIVATED') {
      return {
        success: true,
        message: 'Votre compte est déjà actif.',
      };
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: 'ACTIVE',
        deactivatedAt: null,
        deletionScheduledAt: null,
      },
    });

    this.logger.log(`[reactivateAccount] Compte réactivé avec succès pour l'utilisateur ${userId}`);

    this.resendService
      .sendAccountReactivatedEmail({
        to: user.email,
        userName: user.name,
      })
      .catch((err) => {
        this.logger.warn(`Échec envoi email réactivation pour ${user.email}:`, err);
      });

    return {
      success: true,
      message: 'Votre compte Kanto a été réactivé avec succès. Bon retour !',
    };
  }

  /**
   * Maintient la suppression programmée et révoque les sessions
   */
  async cancelReactivation(userId: string) {
    await this.prisma.session.deleteMany({
      where: { userId },
    });

    return {
      success: true,
      message: 'La suppression de votre compte reste programmée. Vous avez été déconnecté.',
    };
  }

  /**
   * Purge définitive atomique des comptes ayant dépassé le délai de rétractation de 30 jours.
   * Conforme à la règle permanente de préservation des données Kanto MG (data-preservation.md).
   */
  async purgeScheduledDeletions(targetUserId?: string) {
    const whereClause: any = {
      status: 'PENDING_DELETION',
    };

    if (targetUserId) {
      whereClause.id = targetUserId;
    } else {
      whereClause.deletionScheduledAt = {
        lte: new Date(),
      };
    }

    const expiredUsers = await this.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });

    this.logger.log(`[purgeScheduledDeletions] ${expiredUsers.length} compte(s) à purger définitivement.`);

    const results: { id: string; success: boolean; error?: string }[] = [];

    for (const expUser of expiredUsers) {
      try {
        await this.prisma.$transaction(async (tx) => {
          // 1. Détacher les duels référençant un jeu de quiz créé par l'utilisateur
          await tx.duelSession.updateMany({
            where: { customQuizSet: { authorId: expUser.id } },
            data: { customQuizSetId: null },
          });

          // 2. Préserver les quiz UGC publics créés en les réassignant au compte archive pour ne jamais perdre les données communautaires
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

          await tx.userQuizSet.updateMany({
            where: { authorId: expUser.id },
            data: { authorId: archiveUser.id },
          });

          // 3. Anonymiser les participations multijoueurs
          await tx.duelPlayer.updateMany({
            where: { userId: expUser.id },
            data: { name: 'Joueur supprimé', avatar: null },
          });

          await tx.duelSession.updateMany({
            where: { player1Id: expUser.id },
            data: { player1Name: 'Joueur supprimé', player1Avatar: null },
          });

          await tx.duelSession.updateMany({
            where: { player2Id: expUser.id },
            data: { player2Name: 'Joueur supprimé', player2Avatar: null },
          });

          await tx.duelSession.updateMany({
            where: { winnerId: expUser.id },
            data: { winnerId: null },
          });

          // 4. Anonymiser les logs d'audit des contributions
          await tx.contributionAuditLog.updateMany({
            where: { userId: expUser.id },
            data: { userId: null },
          });

          // 5. Supprimer les contributions non approuvées et réassigner les approuvées
          await tx.contribution.deleteMany({
            where: {
              userId: expUser.id,
              status: { not: 'APPROVED' },
            },
          });

          await tx.contribution.updateMany({
            where: {
              userId: expUser.id,
              status: 'APPROVED',
            },
            data: { userId: archiveUser.id },
          });

          // 6. Suppression définitive du User (Cascade sur sessions, progression personnelle, etc.)
          await tx.user.delete({
            where: { id: expUser.id },
          });
        });

        // Suppression avatar Cloudinary
        if (
          expUser.image &&
          expUser.image !== '/uploads/avatars/default-avatar.png' &&
          !expUser.image.includes('default-avatar') &&
          !expUser.image.includes('default_avatar')
        ) {
          this.cloudinaryService.deleteMediaFromUrl(expUser.image).catch(() => {});
        }

        // Envoi email final
        this.resendService
          .sendAccountDeletionEmail({
            to: expUser.email,
            userName: expUser.name,
          })
          .catch(() => {});

        results.push({ id: expUser.id, success: true });
      } catch (err) {
        this.logger.error(`Échec purge définitive pour ${expUser.id}:`, err);
        results.push({ id: expUser.id, success: false, error: String(err) });
      }
    }

    return results;
  }

  // ============================================================
  // GESTION DU BLOCAGE COMMUNAUTAIRE (UserBlock)
  // ============================================================

  /**
   * Bloquer un utilisateur.
   * - Vérifie l'interdiction d'auto-blocage.
   * - Rompt immédiatement toute relation d'amitié existante.
   * - Crée ou met à jour le blocage de façon idempotente.
   */
  async blockUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('Vous ne pouvez pas vous bloquer vous-même.');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, name: true },
    });

    if (!targetUser) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    await this.prisma.$transaction(async (tx) => {
      // 1. Rompre les relations d'amitié éventuelles
      await tx.friendship.deleteMany({
        where: {
          OR: [
            { senderId: currentUserId, receiverId: targetUserId },
            { senderId: targetUserId, receiverId: currentUserId },
          ],
        },
      });

      // 2. Enregistrer le blocage de manière idempotente
      await tx.userBlock.upsert({
        where: {
          blockerId_blockedId: {
            blockerId: currentUserId,
            blockedId: targetUserId,
          },
        },
        create: {
          blockerId: currentUserId,
          blockedId: targetUserId,
        },
        update: {},
      });
    });

    this.logger.log(`🛡️ [UserBlock] Utilisateur ${currentUserId} a bloqué ${targetUserId}`);

    return {
      success: true,
      message: 'Utilisateur bloqué avec succès.',
    };
  }

  /**
   * Débloquer un utilisateur.
   * Ne restaure pas automatiquement d'anciennes relations.
   */
  async unblockUser(currentUserId: string, targetUserId: string) {
    await this.prisma.userBlock.deleteMany({
      where: {
        blockerId: currentUserId,
        blockedId: targetUserId,
      },
    });

    this.logger.log(`🛡️ [UserBlock] Utilisateur ${currentUserId} a débloqué ${targetUserId}`);

    return {
      success: true,
      message: 'Utilisateur débloqué avec succès.',
    };
  }

  /**
   * Liste paginée des utilisateurs bloqués par l'utilisateur connecté
   */
  async getBlockedUsers(currentUserId: string) {
    const blocks = await this.prisma.userBlock.findMany({
      where: { blockerId: currentUserId },
      include: {
        blocked: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return blocks.map((b) => ({
      id: b.blocked.id,
      name: b.blocked.name,
      username: b.blocked.username,
      image: b.blocked.image,
      blockedAt: b.createdAt,
    }));
  }

  /**
   * Vérifie le statut de blocage mutuel entre deux utilisateurs
   */
  async getBlockStatus(currentUserId: string, targetUserId: string) {
    const [sent, received] = await Promise.all([
      this.prisma.userBlock.findUnique({
        where: {
          blockerId_blockedId: {
            blockerId: currentUserId,
            blockedId: targetUserId,
          },
        },
      }),
      this.prisma.userBlock.findUnique({
        where: {
          blockerId_blockedId: {
            blockerId: targetUserId,
            blockedId: currentUserId,
          },
        },
      }),
    ]);

    return {
      isBlockedByMe: !!sent,
      isBlockingMe: !!received,
    };
  }
}
