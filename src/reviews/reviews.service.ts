import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreateReviewDto,
  PublicDisplayNameTypeDto,
} from './dto/create-review.dto.js';
import {
  AdminReviewsQueryDto,
  PublicReviewsQueryDto,
} from './dto/review-query.dto.js';
import {
  BatchModerateReviewsDto,
  ModerateReviewDto,
  ReviewModerationAction,
} from './dto/moderate-review.dto.js';

export interface PublicReviewItem {
  id: string;
  rating: number;
  comment: string;
  publicDisplayName: string;
  publicDisplayNameType: string;
  appVersion?: string | null;
  createdAt: Date;
}

export interface PublicReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    1: { count: number; percentage: number };
    2: { count: number; percentage: number };
    3: { count: number; percentage: number };
    4: { count: number; percentage: number };
    5: { count: number; percentage: number };
  };
}

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calcule le nom affiché selon le choix de l'utilisateur
   */
  public computePublicDisplayName(
    type:
      PublicDisplayNameTypeDto | string = PublicDisplayNameTypeDto.ANONYMOUS,
    rawName?: string | null,
    username?: string | null,
  ): string {
    switch (type) {
      case PublicDisplayNameTypeDto.FIRSTNAME: {
        if (rawName && rawName.trim().length > 0) {
          const firstWord = rawName.trim().split(/\s+/)[0];
          return firstWord;
        }
        return 'Membre de la communauté';
      }
      case PublicDisplayNameTypeDto.PSEUDO: {
        if (username && username.trim().length > 0) {
          return username.startsWith('@') ? username : `@${username}`;
        }
        if (rawName && rawName.trim().length > 0) {
          return rawName.trim();
        }
        return 'Membre de la communauté';
      }
      case PublicDisplayNameTypeDto.ANONYMOUS:
      default:
        return 'Membre de la communauté';
    }
  }

  /**
   * Création d'un avis utilisateur (authentifié ou invité)
   */
  async createReview(dto: CreateReviewDto, userId?: string) {
    let resolvedAuthorName = dto.authorName?.trim() || null;
    let resolvedAuthorEmail = dto.authorEmail?.trim()?.toLowerCase() || null;
    let resolvedUsername: string | null = null;

    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, username: true },
      });
      if (user) {
        resolvedAuthorName = resolvedAuthorName || user.name;
        resolvedAuthorEmail = resolvedAuthorEmail || user.email;
        resolvedUsername = user.username;
      }
    }

    const isAuthorized = Boolean(dto.isPublicationAuthorized);
    const displayType =
      dto.publicDisplayNameType || PublicDisplayNameTypeDto.ANONYMOUS;
    const publicDisplayName = isAuthorized
      ? this.computePublicDisplayName(
          displayType,
          resolvedAuthorName,
          resolvedUsername,
        )
      : null;

    const review = await this.prisma.appReview.create({
      data: {
        rating: dto.rating,
        comment: dto.comment.trim(),
        category: dto.category || 'general',
        userId: userId || null,
        authorName: resolvedAuthorName,
        authorEmail: resolvedAuthorEmail,
        isPublicationAuthorized: isAuthorized,
        publicDisplayNameType: displayType as any,
        publicDisplayName,
        consentDate: isAuthorized ? new Date() : null,
        consentVersion: isAuthorized ? '1.0' : null,
        moderationStatus: isAuthorized
          ? ('PENDING' as any)
          : ('NOT_AUTHORIZED' as any),
        appVersion: dto.appVersion || null,
        platform: dto.platform || null,
        deviceInfo: dto.deviceInfo || null,
      },
    });

    this.logger.log(
      `[Reviews] Nouvel avis créé: #${review.id} (Note: ${review.rating}/5, Public: ${isAuthorized ? 'OUI' : 'NON'})`,
    );

    return {
      success: true,
      id: review.id,
      rating: review.rating,
      isPublicationAuthorized: review.isPublicationAuthorized,
      moderationStatus: review.moderationStatus,
      message: isAuthorized
        ? 'Votre avis a été soumis avec succès et sera vérifié par notre équipe avant publication.'
        : 'Merci pour votre retour ! Votre avis a été enregistré pour notre équipe.',
    };
  }

  /**
   * Récupère la liste publique des avis (seulement APPROVED et isPublicationAuthorized: true)
   * AUCUNE donnée personnelle (email, id utilisateur) n'est renvoyée.
   */
  async getPublicReviews(query: PublicReviewsQueryDto) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 10));
    const skip = (page - 1) * limit;

    const where: any = {
      isPublicationAuthorized: true,
      moderationStatus: 'APPROVED',
    };

    // Par défaut, seuls les avis d'au moins 4 étoiles sont affichés publiquement
    if (query.rating && query.rating >= 1 && query.rating <= 5) {
      where.rating = query.rating;
    } else {
      const minRating = query.minRating !== undefined ? query.minRating : 4;
      where.rating = { gte: minRating };
    }

    const [total, items] = await Promise.all([
      this.prisma.appReview.count({ where }),
      this.prisma.appReview.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          rating: true,
          comment: true,
          publicDisplayName: true,
          publicDisplayNameType: true,
          appVersion: true,
          createdAt: true,
        },
      }),
    ]);

    const formattedItems: PublicReviewItem[] = items.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      publicDisplayName: r.publicDisplayName || 'Membre de la communauté',
      publicDisplayNameType: r.publicDisplayNameType,
      appVersion: r.appVersion,
      createdAt: r.createdAt,
    }));

    return {
      data: formattedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasMore: skip + items.length < total,
      },
    };
  }

  /**
   * Statistiques publiques calculées STRICTEMENT à partir des avis approuvés et autorisés
   */
  async getPublicStats(): Promise<PublicReviewStats> {
    const where: any = {
      isPublicationAuthorized: true,
      moderationStatus: 'APPROVED',
    };

    const reviews = await this.prisma.appReview.findMany({
      where,
      select: { rating: true },
    });

    const totalReviews = reviews.length;
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;

    for (const r of reviews) {
      if (r.rating >= 1 && r.rating <= 5) {
        counts[r.rating] = (counts[r.rating] || 0) + 1;
        sum += r.rating;
      }
    }

    const averageRating =
      totalReviews > 0 ? Math.round((sum / totalReviews) * 10) / 10 : 0;

    const distribution = {
      1: {
        count: counts[1],
        percentage:
          totalReviews > 0 ? Math.round((counts[1] / totalReviews) * 100) : 0,
      },
      2: {
        count: counts[2],
        percentage:
          totalReviews > 0 ? Math.round((counts[2] / totalReviews) * 100) : 0,
      },
      3: {
        count: counts[3],
        percentage:
          totalReviews > 0 ? Math.round((counts[3] / totalReviews) * 100) : 0,
      },
      4: {
        count: counts[4],
        percentage:
          totalReviews > 0 ? Math.round((counts[4] / totalReviews) * 100) : 0,
      },
      5: {
        count: counts[5],
        percentage:
          totalReviews > 0 ? Math.round((counts[5] / totalReviews) * 100) : 0,
      },
    };

    return {
      averageRating,
      totalReviews,
      distribution,
    };
  }

  /**
   * Récupère les avis de l'utilisateur connecté
   */
  async getMyReviews(userId: string) {
    if (!userId) throw new ForbiddenException('Authentification requise.');

    return this.prisma.appReview.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        rating: true,
        comment: true,
        isPublicationAuthorized: true,
        publicDisplayNameType: true,
        publicDisplayName: true,
        moderationStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Retrait de l'autorisation de publication (rétractation du consentement)
   * L'avis disparaît immédiatement du site public.
   */
  async withdrawPublication(reviewId: string, userId?: string) {
    const review = await this.prisma.appReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Avis introuvable.');
    }

    if (userId && review.userId && review.userId !== userId) {
      throw new ForbiddenException(
        'Vous n’êtes pas autorisé à modifier cet avis.',
      );
    }

    const updated = await this.prisma.appReview.update({
      where: { id: reviewId },
      data: {
        isPublicationAuthorized: false,
        moderationStatus: 'WITHDRAWN' as any,
        consentWithdrawnDate: new Date(),
      },
    });

    this.logger.log(`[Reviews] Consentement retiré pour l'avis #${reviewId}`);

    return {
      success: true,
      message:
        'Votre consentement a été retiré. Cet avis ne sera plus affiché sur le site public.',
      isPublicationAuthorized: updated.isPublicationAuthorized,
      moderationStatus: updated.moderationStatus,
    };
  }

  /**
   * Mise à jour de l'autorisation de publication
   */
  async updatePublicationConsent(
    reviewId: string,
    isAuthorized: boolean,
    displayType?: PublicDisplayNameTypeDto,
    userId?: string,
  ) {
    const review = await this.prisma.appReview.findUnique({
      where: { id: reviewId },
      include: { user: true },
    });

    if (!review) {
      throw new NotFoundException('Avis introuvable.');
    }

    if (userId && review.userId && review.userId !== userId) {
      throw new ForbiddenException(
        'Vous n’êtes pas autorisé à modifier cet avis.',
      );
    }

    const newType = displayType || (review.publicDisplayNameType as any);
    const newDisplayName = isAuthorized
      ? this.computePublicDisplayName(
          newType,
          review.user?.name || review.authorName,
          review.user?.username,
        )
      : null;

    const updated = await this.prisma.appReview.update({
      where: { id: reviewId },
      data: {
        isPublicationAuthorized: isAuthorized,
        publicDisplayNameType: newType,
        publicDisplayName: newDisplayName,
        consentDate: isAuthorized ? new Date() : review.consentDate,
        consentWithdrawnDate: !isAuthorized ? new Date() : null,
        moderationStatus: isAuthorized
          ? ('PENDING' as any)
          : ('NOT_AUTHORIZED' as any),
      },
    });

    return {
      success: true,
      isPublicationAuthorized: updated.isPublicationAuthorized,
      moderationStatus: updated.moderationStatus,
      publicDisplayName: updated.publicDisplayName,
    };
  }

  // ─── PARTIE ADMINISTRATION & MODÉRATION ────────────────────────────────────

  /**
   * Extrait l'identité d'auteur normalisée (userId et email en minuscules)
   */
  private resolveAuthorIdentity(review: {
    id: string;
    userId?: string | null;
    authorEmail?: string | null;
    user?: { email?: string | null } | null;
  }) {
    const userId = review.userId?.trim() || null;
    const rawEmail = review.authorEmail || review.user?.email || null;
    const email = rawEmail ? rawEmail.trim().toLowerCase() : null;
    const authorKey = email
      ? `email:${email}`
      : userId
        ? `user:${userId}`
        : `review:${review.id}`;

    return { userId, email, authorKey };
  }

  /**
   * Construit les clauses Prisma OR permettant de retrouver d'autres avis du même auteur
   */
  private buildSameAuthorOrConditions(
    identities: Array<{ userId: string | null; email: string | null }>,
  ) {
    const conditions: any[] = [];
    const seenUserIds = new Set<string>();
    const seenEmails = new Set<string>();

    for (const identity of identities) {
      if (identity.userId && !seenUserIds.has(identity.userId)) {
        seenUserIds.add(identity.userId);
        conditions.push({ userId: identity.userId });
      }
      if (identity.email && !seenEmails.has(identity.email)) {
        seenEmails.add(identity.email);
        conditions.push({
          authorEmail: { equals: identity.email, mode: 'insensitive' },
        });
      }
    }

    return conditions;
  }

  /**
   * Rétrograde en PENDING les autres avis actuellement APPROVED des mêmes auteurs
   * afin de garantir au plus un avis affiché par personne sur app-kanto.gastsar.fr.
   * Aucun avis ni note/commentaire utilisateur n'est supprimé.
   */
  private async demoteOtherApprovedReviews(
    excludedReviewIds: string[],
    identities: Array<{ userId: string | null; email: string | null }>,
    adminEmail?: string,
  ): Promise<string[]> {
    const orConditions = this.buildSameAuthorOrConditions(identities);
    if (orConditions.length === 0) {
      return [];
    }

    const found = await this.prisma.appReview.findMany({
      where: {
        id: { notIn: excludedReviewIds },
        moderationStatus: 'APPROVED',
        OR: orConditions,
      },
      select: {
        id: true,
        moderatorNote: true,
      },
    });

    const conflictingReviews = Array.isArray(found) ? found : [];
    if (conflictingReviews.length === 0) {
      return [];
    }

    const now = new Date();
    const actor = adminEmail || 'admin';
    for (const prev of conflictingReviews) {
      await this.prisma.appReview.update({
        where: { id: prev.id },
        data: {
          moderationStatus: 'PENDING',
          moderatorNote:
            prev.moderatorNote ||
            'Masqué automatiquement : un autre avis du même auteur a été sélectionné pour app-kanto.',
          moderatedAt: now,
          moderatedBy: actor,
        },
      });
    }

    return conflictingReviews.map((prev) => prev.id);
  }

  /**
   * Liste complète des avis pour l'administration avec filtres avancés
   */
  async getAdminReviews(query: AdminReviewsQueryDto) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.rating && query.rating >= 1 && query.rating <= 5) {
      where.rating = query.rating;
    }

    if (query.status && query.status !== 'ALL') {
      where.moderationStatus = query.status;
    }

    if (query.search && query.search.trim().length > 0) {
      const q = query.search.trim();
      where.OR = [
        { comment: { contains: q, mode: 'insensitive' } },
        { authorName: { contains: q, mode: 'insensitive' } },
        { authorEmail: { contains: q, mode: 'insensitive' } },
        { publicDisplayName: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [total, items, approvedCount, pendingCount] = await Promise.all([
      this.prisma.appReview.count({ where }),
      this.prisma.appReview.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              username: true,
              image: true,
            },
          },
        },
      }),
      this.prisma.appReview.count({ where: { moderationStatus: 'APPROVED' } }),
      this.prisma.appReview.count({ where: { moderationStatus: 'PENDING' } }),
    ]);

    const authorIdentities = items.map((item) =>
      this.resolveAuthorIdentity(item),
    );
    const sameAuthorOrConditions =
      this.buildSameAuthorOrConditions(authorIdentities);

    let relatedAuthorReviews: Array<{
      id: string;
      userId: string | null;
      authorEmail: string | null;
      moderationStatus: string;
      user?: { email?: string | null } | null;
    }> = [];

    if (items.length > 0 && sameAuthorOrConditions.length > 0) {
      const fetched = await this.prisma.appReview.findMany({
        where: { OR: sameAuthorOrConditions },
        select: {
          id: true,
          userId: true,
          authorEmail: true,
          moderationStatus: true,
          user: { select: { email: true } },
        },
      });
      relatedAuthorReviews = Array.isArray(fetched) ? fetched : [];
    }

    const enrichedItems = items.map((item, idx) => {
      const identity = authorIdentities[idx];
      const matches = relatedAuthorReviews.filter((candidate) => {
        const candidateIdentity = this.resolveAuthorIdentity(candidate);
        if (identity.userId && candidateIdentity.userId === identity.userId) {
          return true;
        }
        if (identity.email && candidateIdentity.email === identity.email) {
          return true;
        }
        return candidate.id === item.id;
      });

      const totalByAuthor = matches.length > 0 ? matches.length : 1;
      const approvedByAuthor =
        matches.length > 0
          ? matches.filter((m) => m.moderationStatus === 'APPROVED').length
          : item.moderationStatus === 'APPROVED'
            ? 1
            : 0;

      return {
        ...item,
        authorKey: identity.authorKey,
        authorTotalReviews: totalByAuthor,
        authorApprovedReviewsCount: approvedByAuthor,
      };
    });

    return {
      data: enrichedItems,
      summary: {
        approvedCount,
        pendingCount,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Modération d'un avis par l'administrateur
   * IMPORTANT : La note (rating) et le texte (comment) NE PEUVENT JAMAIS ÊTRE MODIFIÉS.
   * Règle d'unicité par personne : lorsqu'un avis est approuvé, les éventuels autres avis
   * déjà approuvés du même auteur sont automatiquement remis en attente (PENDING).
   */
  async moderateReview(
    reviewId: string,
    dto: ModerateReviewDto,
    adminEmail?: string,
  ) {
    const review = await this.prisma.appReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Avis introuvable.');
    }

    // Si l'utilisateur n'a pas autorisé la publication, un modérateur ne peut pas forcer le statut APPROVED
    if (
      !review.isPublicationAuthorized &&
      dto.status === ReviewModerationAction.APPROVE
    ) {
      throw new BadRequestException(
        'Impossible d’approuver publiquement un avis dont l’utilisateur n’a pas autorisé la publication.',
      );
    }

    let replacedReviewIds: string[] = [];
    if (dto.status === ReviewModerationAction.APPROVE) {
      const identity = this.resolveAuthorIdentity(review);
      replacedReviewIds = await this.demoteOtherApprovedReviews(
        [reviewId],
        [identity],
        adminEmail,
      );
    }

    const updated = await this.prisma.appReview.update({
      where: { id: reviewId },
      data: {
        moderationStatus: dto.status as any,
        moderatorNote: dto.moderatorNote || review.moderatorNote,
        moderatedAt: new Date(),
        moderatedBy: adminEmail || 'admin',
      },
    });

    this.logger.log(
      `[Reviews] Modération avis #${reviewId} -> ${dto.status} par ${adminEmail || 'admin'}${
        replacedReviewIds.length > 0
          ? ` (${replacedReviewIds.length} précédent(s) avis du même auteur remis en attente)`
          : ''
      }`,
    );

    return {
      success: true,
      id: updated.id,
      moderationStatus: updated.moderationStatus,
      moderatorNote: updated.moderatorNote,
      moderatedAt: updated.moderatedAt,
      replacedReviewIds,
    };
  }

  /**
   * Sélection / modération par lot des avis à afficher sur app-kanto.gastsar.fr.
   * Lors d'une mise en ligne (APPROVED), refuse les doublons d'auteur dans la même sélection
   * et remet automatiquement en attente (PENDING) les anciens avis approuvés de ces auteurs.
   */
  async batchModerateReviews(
    dto: BatchModerateReviewsDto,
    adminEmail?: string,
  ) {
    const uniqueIds = Array.from(new Set(dto.reviewIds));
    if (uniqueIds.length === 0) {
      throw new BadRequestException('Aucun avis sélectionné.');
    }

    const foundReviews = await this.prisma.appReview.findMany({
      where: { id: { in: uniqueIds } },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    const reviews = Array.isArray(foundReviews) ? foundReviews : [];
    if (reviews.length !== uniqueIds.length) {
      throw new NotFoundException(
        'Un ou plusieurs avis sélectionnés sont introuvables.',
      );
    }

    const isApproving = dto.status === ReviewModerationAction.APPROVE;
    const identities = reviews.map((review) =>
      this.resolveAuthorIdentity(review),
    );

    if (isApproving) {
      const unauthorized = reviews.find((r) => !r.isPublicationAuthorized);
      if (unauthorized) {
        throw new BadRequestException(
          'Impossible d’afficher sur app-kanto un avis dont l’auteur n’a pas autorisé la publication publique.',
        );
      }

      const seenUserIds = new Set<string>();
      const seenEmails = new Set<string>();
      for (const identity of identities) {
        if (
          (identity.userId && seenUserIds.has(identity.userId)) ||
          (identity.email && seenEmails.has(identity.email))
        ) {
          throw new BadRequestException(
            'Vous ne pouvez pas sélectionner plusieurs avis d’une même personne pour app-kanto en même temps.',
          );
        }
        if (identity.userId) seenUserIds.add(identity.userId);
        if (identity.email) seenEmails.add(identity.email);
      }
    }

    const replacedReviewIds = isApproving
      ? await this.demoteOtherApprovedReviews(uniqueIds, identities, adminEmail)
      : [];

    const now = new Date();
    const actor = adminEmail || 'admin';
    for (const review of reviews) {
      await this.prisma.appReview.update({
        where: { id: review.id },
        data: {
          moderationStatus: dto.status as any,
          moderatorNote: dto.moderatorNote || review.moderatorNote,
          moderatedAt: now,
          moderatedBy: actor,
        },
      });
    }

    this.logger.log(
      `[Reviews] Lot de ${uniqueIds.length} avis -> ${dto.status} par ${actor}${
        replacedReviewIds.length > 0
          ? ` (${replacedReviewIds.length} doublon(s) auteur remis en attente)`
          : ''
      }`,
    );

    return {
      success: true,
      updatedCount: uniqueIds.length,
      replacedReviewIds,
      status: dto.status,
    };
  }
}
