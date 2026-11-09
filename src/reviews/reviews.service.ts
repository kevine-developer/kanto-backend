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
import { ModerateReviewDto } from './dto/moderate-review.dto.js';

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
    type: PublicDisplayNameTypeDto | string = PublicDisplayNameTypeDto.ANONYMOUS,
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
    const displayType = dto.publicDisplayNameType || PublicDisplayNameTypeDto.ANONYMOUS;
    const publicDisplayName = isAuthorized
      ? this.computePublicDisplayName(displayType, resolvedAuthorName, resolvedUsername)
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
        moderationStatus: isAuthorized ? ('PENDING' as any) : ('NOT_AUTHORIZED' as any),
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

    if (query.rating && query.rating >= 1 && query.rating <= 5) {
      where.rating = query.rating;
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
      throw new ForbiddenException('Vous n’êtes pas autorisé à modifier cet avis.');
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
      message: 'Votre consentement a été retiré. Cet avis ne sera plus affiché sur le site public.',
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
      throw new ForbiddenException('Vous n’êtes pas autorisé à modifier cet avis.');
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
        publicDisplayNameType: newType as any,
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

    const [total, items] = await Promise.all([
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
    ]);

    return {
      data: items,
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
    if (!review.isPublicationAuthorized && dto.status === 'APPROVED') {
      throw new BadRequestException(
        'Impossible d’approuver publiquement un avis dont l’utilisateur n’a pas autorisé la publication.',
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
      `[Reviews] Modération avis #${reviewId} -> ${dto.status} par ${adminEmail || 'admin'}`,
    );

    return {
      success: true,
      id: updated.id,
      moderationStatus: updated.moderationStatus,
      moderatorNote: updated.moderatorNote,
      moderatedAt: updated.moderatedAt,
    };
  }
}

