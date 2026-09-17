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
import { FriendshipStatus } from '../../generated/prisma/client.js';

export interface FriendItem {
  userId: string;
  name: string;
  username: string;
  avatar: string | null;
  level: number;
  totalXp: number;
  streakDays: number;
  friendshipId: string;
  hasEncouragedToday: boolean;
  friendsSince: Date;
}

@Injectable()
export class FriendsService {
  private readonly logger = new Logger(FriendsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly progressionService: ProgressionService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Normalise une date à minuit UTC pour les contraintes journalières.
   */
  private getDateOnly(date: Date): Date {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );
  }

  /**
   * Récupère la liste des amis acceptés d'un utilisateur, avec leurs stats et statut d'encouragement journalier.
   */
  async getFriends(userId: string): Promise<FriendItem[]> {
    const today = this.getDateOnly(new Date());

    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        status: FriendshipStatus.ACCEPTED,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            progress: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
            progress: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const friendIds = friendships.map((f) =>
      f.senderId === userId ? f.receiverId : f.senderId,
    );

    // Vérifie en une seule requête les encouragements envoyés aujourd'hui
    const encouragementsToday = await this.prisma.encouragement.findMany({
      where: {
        senderId: userId,
        receiverId: { in: friendIds },
        date: today,
      },
      select: { receiverId: true },
    });

    const encouragedSet = new Set(encouragementsToday.map((e) => e.receiverId));

    return friendships.map((f) => {
      const isSender = f.senderId === userId;
      const friend = isSender ? f.receiver : f.sender;
      const progress = friend.progress;

      return {
        userId: friend.id,
        name: friend.name,
        username: `@${friend.name.toLowerCase().replace(/\s+/g, '_')}`,
        avatar: friend.image,
        level: progress?.level || 1,
        totalXp: Math.ceil(Number(progress?.totalXp || 0)),
        streakDays: progress?.streakDays || 0,
        friendshipId: f.id,
        hasEncouragedToday: encouragedSet.has(friend.id),
        friendsSince: f.updatedAt,
      };
    });
  }

  /**
   * Récupère les demandes d'amis en attente (reçues et envoyées).
   */
  async getRequests(userId: string) {
    const received = await this.prisma.friendship.findMany({
      where: {
        receiverId: userId,
        status: FriendshipStatus.PENDING,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            progress: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const sent = await this.prisma.friendship.findMany({
      where: {
        senderId: userId,
        status: FriendshipStatus.PENDING,
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
            progress: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      received: received.map((r) => ({
        id: r.id,
        senderId: r.sender.id,
        name: r.sender.name,
        username: `@${r.sender.name.toLowerCase().replace(/\s+/g, '_')}`,
        avatar: r.sender.image,
        level: r.sender.progress?.level || 1,
        totalXp: Math.ceil(Number(r.sender.progress?.totalXp || 0)),
        createdAt: r.createdAt,
      })),
      sent: sent.map((s) => ({
        id: s.id,
        receiverId: s.receiver.id,
        name: s.receiver.name,
        username: `@${s.receiver.name.toLowerCase().replace(/\s+/g, '_')}`,
        avatar: s.receiver.image,
        level: s.receiver.progress?.level || 1,
        totalXp: Math.ceil(Number(s.receiver.progress?.totalXp || 0)),
        createdAt: s.createdAt,
      })),
    };
  }

  /**
   * Renvoie le statut de relation entre l'utilisateur connecté et un autre utilisateur.
   */
  async getFriendshipStatus(
    userId: string,
    targetUserId: string,
  ): Promise<{ status: 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'FRIENDS' | 'BLOCKED'; friendshipId?: string }> {
    if (userId === targetUserId) {
      return { status: 'NONE' };
    }

    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: userId },
        ],
      },
    });

    if (!friendship) {
      return { status: 'NONE' };
    }

    if (friendship.status === FriendshipStatus.ACCEPTED) {
      return { status: 'FRIENDS', friendshipId: friendship.id };
    }

    if (friendship.status === FriendshipStatus.BLOCKED) {
      return { status: 'BLOCKED', friendshipId: friendship.id };
    }

    if (friendship.status === FriendshipStatus.PENDING) {
      return {
        status: friendship.senderId === userId ? 'PENDING_SENT' : 'PENDING_RECEIVED',
        friendshipId: friendship.id,
      };
    }

    return { status: 'NONE' };
  }

  /**
   * Envoie une demande d'ami.
   * Si l'autre utilisateur a déjà envoyé une demande, l'accepte automatiquement.
   */
  async sendFriendRequest(senderId: string, targetUserId: string) {
    if (senderId === targetUserId) {
      throw new BadRequestException('Vous ne pouvez pas vous ajouter vous-même en ami.');
    }

    const [sender, targetUser] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: senderId }, select: { name: true } }),
      this.prisma.user.findUnique({ where: { id: targetUserId }, select: { id: true, name: true } }),
    ]);

    if (!targetUser) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    const existing = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: senderId },
        ],
      },
    });

    if (existing) {
      if (existing.status === FriendshipStatus.ACCEPTED) {
        throw new ConflictException('Vous êtes déjà amis.');
      }
      if (existing.status === FriendshipStatus.BLOCKED) {
        throw new BadRequestException('Impossible d’envoyer une demande à cet utilisateur.');
      }
      if (existing.senderId === senderId && existing.status === FriendshipStatus.PENDING) {
        throw new ConflictException('Une demande d’ami est déjà en attente.');
      }
      // L'autre utilisateur nous avait déjà envoyé une demande : on accepte automatiquement !
      if (existing.senderId === targetUserId && existing.status === FriendshipStatus.PENDING) {
        const updated = await this.prisma.friendship.update({
          where: { id: existing.id },
          data: { status: FriendshipStatus.ACCEPTED },
        });

        void this.notificationsService.createNotification({
          titleMg: 'Namana vaovao !',
          titleFr: 'Demande d’ami acceptée !',
          messageMg: `Namana ao amin'ny Kanto ianao sy i ${sender?.name || 'Mpikambana'}.`,
          messageFr: `${sender?.name || 'Un membre'} a accepté votre demande d'ami.`,
          category: 'community',
          badgeText: 'Namana',
          badgeType: 'info',
          iconName: 'people',
          iconColor: '#4A6741',
          isBroadcast: false,
          userId: targetUserId,
        });

        return {
          success: true,
          status: 'ACCEPTED',
          friendshipId: updated.id,
          message: 'Demande d’ami acceptée ! Vous êtes désormais amis.',
        };
      }
    }

    const created = await this.prisma.friendship.create({
      data: {
        senderId,
        receiverId: targetUserId,
        status: FriendshipStatus.PENDING,
      },
    });

    // Envoi d'une notification in-app au destinataire
    void this.notificationsService.createNotification({
      titleMg: 'Fangatahana ho namana',
      titleFr: 'Nouvelle demande d’ami',
      messageMg: `Nandefa fangatahana ho namana ho anao i ${sender?.name || 'Mpikambana'}.`,
      messageFr: `${sender?.name || 'Un membre'} souhaite devenir votre ami sur Kanto.`,
      category: 'community',
      badgeText: 'Fangatahana',
      badgeType: 'info',
      iconName: 'person-add',
      iconColor: '#4A6741',
      isBroadcast: false,
      userId: targetUserId,
    });

    return {
      success: true,
      status: 'PENDING_SENT',
      friendshipId: created.id,
      message: 'Demande d’ami envoyée avec succès.',
    };
  }

  /**
   * Accepte une demande d'ami reçue.
   */
  async acceptFriendRequest(userId: string, friendshipIdOrSenderId: string) {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { id: friendshipIdOrSenderId, receiverId: userId },
          { senderId: friendshipIdOrSenderId, receiverId: userId },
        ],
      },
      include: {
        receiver: { select: { name: true } },
      },
    });

    if (!friendship) {
      throw new NotFoundException('Demande d’ami introuvable.');
    }

    if (friendship.status === FriendshipStatus.ACCEPTED) {
      return { success: true, message: 'Vous êtes déjà amis.' };
    }

    const updated = await this.prisma.friendship.update({
      where: { id: friendship.id },
      data: { status: FriendshipStatus.ACCEPTED },
    });

    // Notification à l'expéditeur de la demande
    void this.notificationsService.createNotification({
      titleMg: 'Namana vaovao !',
      titleFr: 'Demande d’ami acceptée',
      messageMg: `Nanaiky ny fangatahanao i ${friendship.receiver.name}.`,
      messageFr: `${friendship.receiver.name} a accepté votre demande d'ami sur Kanto !`,
      category: 'community',
      badgeText: 'Namana',
      badgeType: 'info',
      iconName: 'people',
      iconColor: '#4A6741',
      isBroadcast: false,
      userId: friendship.senderId,
    });

    return {
      success: true,
      friendshipId: updated.id,
      message: 'Demande d’ami acceptée avec succès.',
    };
  }

  /**
   * Refuse une demande d'ami reçue.
   */
  async rejectFriendRequest(userId: string, friendshipIdOrSenderId: string) {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { id: friendshipIdOrSenderId, receiverId: userId },
          { senderId: friendshipIdOrSenderId, receiverId: userId },
        ],
      },
    });

    if (!friendship) {
      throw new NotFoundException('Demande d’ami introuvable.');
    }

    await this.prisma.friendship.delete({
      where: { id: friendship.id },
    });

    return { success: true, message: 'Demande d’ami refusée.' };
  }

  /**
   * Annule une demande d'ami envoyée.
   */
  async cancelFriendRequest(senderId: string, targetUserId: string) {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        senderId,
        receiverId: targetUserId,
        status: FriendshipStatus.PENDING,
      },
    });

    if (!friendship) {
      throw new NotFoundException('Aucune demande d’ami en attente trouvée.');
    }

    await this.prisma.friendship.delete({
      where: { id: friendship.id },
    });

    return { success: true, message: 'Demande d’ami annulée avec succès.' };
  }

  /**
   * Supprime un ami de sa liste (retrait mutuel).
   */
  async removeFriend(userId: string, friendUserId: string) {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: friendUserId },
          { senderId: friendUserId, receiverId: userId },
        ],
        status: FriendshipStatus.ACCEPTED,
      },
    });

    if (!friendship) {
      throw new NotFoundException('Cet utilisateur ne fait pas partie de vos amis.');
    }

    await this.prisma.friendship.delete({
      where: { id: friendship.id },
    });

    return { success: true, message: 'Ami retiré de votre liste.' };
  }

  /**
   * Recherche des utilisateurs par nom ou email avec le statut d'amitié associé.
   */
  async searchUsers(userId: string, query: string, limit = 20) {
    const cleanQuery = query.trim();
    if (!cleanQuery) return [];

    const users = await this.prisma.user.findMany({
      where: {
        id: { not: userId },
        OR: [
          { name: { contains: cleanQuery, mode: 'insensitive' } },
          { email: { contains: cleanQuery, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        image: true,
        progress: true,
      },
      take: Math.min(limit, 50),
    });

    const userIds = users.map((u) => u.id);

    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: { in: userIds } },
          { senderId: { in: userIds }, receiverId: userId },
        ],
      },
    });

    const statusMap = new Map<string, { status: 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'FRIENDS'; friendshipId?: string }>();

    for (const f of friendships) {
      const otherId = f.senderId === userId ? f.receiverId : f.senderId;
      if (f.status === FriendshipStatus.ACCEPTED) {
        statusMap.set(otherId, { status: 'FRIENDS', friendshipId: f.id });
      } else if (f.status === FriendshipStatus.PENDING) {
        statusMap.set(otherId, {
          status: f.senderId === userId ? 'PENDING_SENT' : 'PENDING_RECEIVED',
          friendshipId: f.id,
        });
      }
    }

    return users.map((u) => {
      const rel = statusMap.get(u.id) || { status: 'NONE' as const };
      return {
        userId: u.id,
        name: u.name,
        username: `@${u.name.toLowerCase().replace(/\s+/g, '_')}`,
        avatar: u.image,
        level: u.progress?.level || 1,
        totalXp: Math.ceil(Number(u.progress?.totalXp || 0)),
        friendshipStatus: rel.status,
        friendshipId: rel.friendshipId,
      };
    });
  }

  /**
   * Vérifie si l'utilisateur connecté peut encourager un utilisateur aujourd'hui.
   */
  async canEncourage(senderId: string, targetUserId: string): Promise<{ canEncourage: boolean; lastEncouragedAt?: Date }> {
    if (senderId === targetUserId) {
      return { canEncourage: false };
    }

    const today = this.getDateOnly(new Date());

    const existing = await this.prisma.encouragement.findUnique({
      where: {
        senderId_receiverId_date: {
          senderId,
          receiverId: targetUserId,
          date: today,
        },
      },
    });

    if (existing) {
      return { canEncourage: false, lastEncouragedAt: existing.createdAt };
    }

    return { canEncourage: true };
  }

  /**
   * Envoie un encouragement à un utilisateur :
   * - Limité à 1 fois par jour calendaire UTC par paire (sender -> receiver).
   * - Attribue +1 XP à l'encourageur ET +1 XP à l'encouragé via ProgressionService.
   * - Notifie l'encouragé en temps réel in-app.
   */
  async encourageUser(senderId: string, targetUserId: string) {
    if (senderId === targetUserId) {
      throw new BadRequestException('Vous ne pouvez pas vous encourager vous-même.');
    }

    const [sender, targetUser] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: senderId }, select: { name: true } }),
      this.prisma.user.findUnique({ where: { id: targetUserId }, select: { id: true, name: true } }),
    ]);

    if (!targetUser) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    const today = this.getDateOnly(new Date());

    // Vérifie l'unicité journalière
    const existing = await this.prisma.encouragement.findUnique({
      where: {
        senderId_receiverId_date: {
          senderId,
          receiverId: targetUserId,
          date: today,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Vous avez déjà encouragé cet ami aujourd’hui. Revenez demain pour lui envoyer à nouveau de la force !',
      );
    }

    // Enregistrement atomique de l'encouragement du jour
    await this.prisma.encouragement.create({
      data: {
        senderId,
        receiverId: targetUserId,
        date: today,
      },
    });

    // Attribution de +1 XP à l'encourageur (sender)
    const senderProg = await this.progressionService.awardXp(
      senderId,
      1,
      'encouragement_sent',
      `Encouragement envoyé à ${targetUser.name}`,
    );

    // Attribution de +1 XP à l'encouragé (receiver)
    const targetProg = await this.progressionService.awardXp(
      targetUserId,
      1,
      'encouragement_received',
      `Encouragement reçu de ${sender?.name || 'un ami'}`,
    );

    // Notification in-app pour l'encouragé
    void this.notificationsService.createNotification({
      titleMg: 'Fankaherezana voaray !',
      titleFr: 'Encouragement reçu !',
      messageMg: `Nankahery anao i ${sender?.name || 'Namana'} ! Nahazo +1 XP ianao roa tonta.`,
      messageFr: `${sender?.name || 'Un ami'} vous a envoyé des encouragements ! Vous recevez chacun +1 XP.`,
      category: 'community',
      badgeText: '+1 XP',
      badgeType: 'reward',
      iconName: 'heart',
      iconColor: '#E05615',
      targetRoute: `kantomg://profile/friendProfile?userId=${senderId}&name=${encodeURIComponent(sender?.name || '')}&action=encourage_back`,
      isBroadcast: false,
      userId: targetUserId,
    });

    this.logger.log(
      `💖 Encouragement: ${senderId} -> ${targetUserId} (+1 XP chacun). Sender XP: ${senderProg.totalXp}, Target XP: ${targetProg.totalXp}`,
    );

    return {
      success: true,
      xpEarned: 1,
      senderTotalXp: senderProg.totalXp,
      senderLevel: senderProg.level,
      message: 'Encouragement envoyé avec succès ! Vous et votre ami avez chacun reçu +1 XP.',
    };
  }
}
