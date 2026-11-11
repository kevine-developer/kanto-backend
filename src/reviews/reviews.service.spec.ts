import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { PublicDisplayNameTypeDto } from './dto/create-review.dto.js';
import { ReviewModerationAction } from './dto/moderate-review.dto.js';

describe('ReviewsService — Scénarios Métier & Protection des Données', () => {
  let service: ReviewsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
      },
      appReview: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
      },
    };

    service = new ReviewsService(mockPrisma);
  });

  describe('1. Création d’un avis et Consentement', () => {
    it('doit créer un avis non autorisé par défaut avec statut NOT_AUTHORIZED si consentement non coché', async () => {
      mockPrisma.appReview.create.mockResolvedValue({
        id: 'rev_1',
        rating: 5,
        comment: 'Superbe application culturelle !',
        isPublicationAuthorized: false,
        moderationStatus: 'NOT_AUTHORIZED',
        publicDisplayName: null,
      });

      const res = await service.createReview({
        rating: 5,
        comment: 'Superbe application culturelle !',
        isPublicationAuthorized: false,
      });

      expect(mockPrisma.appReview.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            rating: 5,
            isPublicationAuthorized: false,
            moderationStatus: 'NOT_AUTHORIZED',
            publicDisplayName: null,
            consentDate: null,
          }),
        }),
      );
      expect(res.isPublicationAuthorized).toBe(false);
      expect(res.moderationStatus).toBe('NOT_AUTHORIZED');
    });

    it('doit passer le statut en PENDING et enregistrer la date de consentement si autorisé', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        name: 'Andry Rabe',
        email: 'andry@example.com',
        username: 'andry261',
      });

      mockPrisma.appReview.create.mockImplementation(({ data }: any) => ({
        id: 'rev_2',
        ...data,
      }));

      const res = await service.createReview(
        {
          rating: 4,
          comment: 'Très belle découverte de nos contes.',
          isPublicationAuthorized: true,
          publicDisplayNameType: PublicDisplayNameTypeDto.FIRSTNAME,
        },
        'user_123',
      );

      expect(mockPrisma.appReview.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            isPublicationAuthorized: true,
            moderationStatus: 'PENDING',
            publicDisplayName: 'Andry',
            publicDisplayNameType: PublicDisplayNameTypeDto.FIRSTNAME,
            consentVersion: '1.0',
          }),
        }),
      );
      expect(res.isPublicationAuthorized).toBe(true);
      expect(res.moderationStatus).toBe('PENDING');
    });
  });

  describe('2. Calcul du nom affiché (Anonymat vs Prénom vs Pseudo)', () => {
    it('doit renvoyer "Membre de la communauté" pour le type ANONYMOUS même si un nom est fourni (Test 3)', () => {
      const name = service.computePublicDisplayName(
        PublicDisplayNameTypeDto.ANONYMOUS,
        'Jean Dupont',
        'jdupont',
      );
      expect(name).toBe('Membre de la communauté');
    });

    it('doit extraire uniquement le premier prénom pour FIRSTNAME', () => {
      const name = service.computePublicDisplayName(
        PublicDisplayNameTypeDto.FIRSTNAME,
        'Soa Marie Ravelo',
        'soa261',
      );
      expect(name).toBe('Soa');
    });

    it('doit préfixer par @ le pseudonyme pour PSEUDO', () => {
      const name = service.computePublicDisplayName(
        PublicDisplayNameTypeDto.PSEUDO,
        'Soa Marie Ravelo',
        'kanto_fan',
      );
      expect(name).toBe('@kanto_fan');
    });
  });

  describe('3. API Publique — Filtrage strict (Test 1, Test 2, Test 6)', () => {
    it('doit filtrer STRICTEMENT sur isPublicationAuthorized: true ET moderationStatus: APPROVED', async () => {
      mockPrisma.appReview.count.mockResolvedValue(1);
      mockPrisma.appReview.findMany.mockResolvedValue([
        {
          id: 'rev_pub_1',
          rating: 5,
          comment: 'Magnifique contenu !',
          publicDisplayName: 'Toky',
          publicDisplayNameType: 'FIRSTNAME',
          appVersion: '1.0.4',
          createdAt: new Date(),
        },
      ]);

      const res = await service.getPublicReviews({ page: 1, limit: 10 });

      expect(mockPrisma.appReview.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            isPublicationAuthorized: true,
            moderationStatus: 'APPROVED',
            rating: { gte: 4 },
          },
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
      );

      // Vérification Test 6 : Jamais d'email ni d'identifiant sensible dans les objets publics
      expect(res.data[0]).not.toHaveProperty('authorEmail');
      expect(res.data[0]).not.toHaveProperty('userId');
      expect(res.data[0]).not.toHaveProperty('deviceInfo');
      expect(res.data[0]).not.toHaveProperty('moderatorNote');
    });
  });

  describe('4. Statistiques publiques — Calcul strict (Test 5)', () => {
    it('ne doit compter que les avis approuvés et autorisés dans la moyenne et la répartition', async () => {
      mockPrisma.appReview.findMany.mockResolvedValue([
        { rating: 5 },
        { rating: 5 },
        { rating: 4 },
        { rating: 4 },
      ]);

      const stats = await service.getPublicStats();

      expect(mockPrisma.appReview.findMany).toHaveBeenCalledWith({
        where: {
          isPublicationAuthorized: true,
          moderationStatus: 'APPROVED',
        },
        select: { rating: true },
      });

      expect(stats.totalReviews).toBe(4);
      expect(stats.averageRating).toBe(4.5); // (5+5+4+4)/4 = 4.5
      expect(stats.distribution[5].count).toBe(2);
      expect(stats.distribution[5].percentage).toBe(50);
      expect(stats.distribution[4].count).toBe(2);
      expect(stats.distribution[4].percentage).toBe(50);
      expect(stats.distribution[1].count).toBe(0);
    });
  });

  describe('5. Rétractation du consentement (Test 4)', () => {
    it('doit immédiatement révoquer l’affichage public en passant à isPublicationAuthorized: false et WITHDRAWN', async () => {
      mockPrisma.appReview.findUnique.mockResolvedValue({
        id: 'rev_pub_1',
        userId: 'user_owner',
        isPublicationAuthorized: true,
        moderationStatus: 'APPROVED',
      });

      mockPrisma.appReview.update.mockResolvedValue({
        id: 'rev_pub_1',
        isPublicationAuthorized: false,
        moderationStatus: 'WITHDRAWN',
      });

      const res = await service.withdrawPublication('rev_pub_1', 'user_owner');

      expect(mockPrisma.appReview.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'rev_pub_1' },
          data: expect.objectContaining({
            isPublicationAuthorized: false,
            moderationStatus: 'WITHDRAWN',
          }),
        }),
      );
      expect(res.isPublicationAuthorized).toBe(false);
      expect(res.moderationStatus).toBe('WITHDRAWN');
    });

    it('doit refuser la rétractation si l’utilisateur n’est pas le propriétaire', async () => {
      mockPrisma.appReview.findUnique.mockResolvedValue({
        id: 'rev_pub_1',
        userId: 'user_owner',
      });

      await expect(
        service.withdrawPublication('rev_pub_1', 'other_user'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('6. Modération administrative (Test 7 & 8)', () => {
    it('doit interdire l’approbation publique si l’utilisateur n’a pas autorisé la publication', async () => {
      mockPrisma.appReview.findUnique.mockResolvedValue({
        id: 'rev_private',
        isPublicationAuthorized: false,
        moderationStatus: 'NOT_AUTHORIZED',
      });

      await expect(
        service.moderateReview('rev_private', { status: 'APPROVED' as any }),
      ).rejects.toThrow(BadRequestException);
    });

    it('doit mettre à jour le statut et la note interne sans modifier la note utilisateur (rating)', async () => {
      mockPrisma.appReview.findUnique.mockResolvedValue({
        id: 'rev_to_mod',
        rating: 3,
        comment: 'Commentaire constructif.',
        isPublicationAuthorized: true,
        moderationStatus: 'PENDING',
      });

      mockPrisma.appReview.update.mockResolvedValue({
        id: 'rev_to_mod',
        rating: 3,
        comment: 'Commentaire constructif.',
        moderationStatus: 'APPROVED',
        moderatorNote: 'Avis vérifié et conforme',
        moderatedAt: new Date(),
      });

      const res = await service.moderateReview(
        'rev_to_mod',
        {
          status: 'APPROVED' as any,
          moderatorNote: 'Avis vérifié et conforme',
        },
        'admin@kanto.mg',
      );

      expect(mockPrisma.appReview.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'rev_to_mod' },
          data: expect.objectContaining({
            moderationStatus: 'APPROVED',
            moderatorNote: 'Avis vérifié et conforme',
            moderatedBy: 'admin@kanto.mg',
          }),
        }),
      );
      expect(res.moderationStatus).toBe('APPROVED');
    });
  });

  describe('7. Unicité par auteur et sélection par lot pour app-kanto', () => {
    it('doit remettre automatiquement en PENDING un ancien avis APPROVED du même auteur lors d’une nouvelle approbation', async () => {
      mockPrisma.appReview.findUnique.mockResolvedValue({
        id: 'rev_rose_new',
        userId: null,
        authorEmail: 'Rose@gmail.com',
        isPublicationAuthorized: true,
        moderationStatus: 'PENDING',
        moderatorNote: null,
      });

      mockPrisma.appReview.findMany.mockResolvedValue([
        {
          id: 'rev_rose_old',
          moderatorNote: null,
        },
      ]);

      mockPrisma.appReview.update
        .mockResolvedValueOnce({
          id: 'rev_rose_old',
          moderationStatus: 'PENDING',
        })
        .mockResolvedValueOnce({
          id: 'rev_rose_new',
          moderationStatus: 'APPROVED',
          moderatorNote: null,
          moderatedAt: new Date(),
        });

      const res = await service.moderateReview(
        'rev_rose_new',
        { status: ReviewModerationAction.APPROVE },
        'admin@kanto.mg',
      );

      expect(mockPrisma.appReview.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: { notIn: ['rev_rose_new'] },
            moderationStatus: 'APPROVED',
            OR: [
              {
                authorEmail: { equals: 'rose@gmail.com', mode: 'insensitive' },
              },
            ],
          }),
        }),
      );
      expect(mockPrisma.appReview.update).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          where: { id: 'rev_rose_old' },
          data: expect.objectContaining({
            moderationStatus: 'PENDING',
            moderatedBy: 'admin@kanto.mg',
          }),
        }),
      );
      expect(mockPrisma.appReview.update).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          where: { id: 'rev_rose_new' },
          data: expect.objectContaining({
            moderationStatus: 'APPROVED',
          }),
        }),
      );
      expect(res.replacedReviewIds).toEqual(['rev_rose_old']);
    });

    it('doit refuser une sélection APPROVED par lot contenant deux avis de la même personne', async () => {
      mockPrisma.appReview.findMany.mockResolvedValue([
        {
          id: 'rev_1',
          userId: 'user_rose',
          authorEmail: 'rose@gmail.com',
          isPublicationAuthorized: true,
          user: { email: 'rose@gmail.com' },
        },
        {
          id: 'rev_2',
          userId: null,
          authorEmail: 'ROSE@gmail.com',
          isPublicationAuthorized: true,
          user: null,
        },
      ]);

      await expect(
        service.batchModerateReviews(
          {
            reviewIds: ['rev_1', 'rev_2'],
            status: ReviewModerationAction.APPROVE,
          },
          'admin@kanto.mg',
        ),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrisma.appReview.update).not.toHaveBeenCalled();
    });

    it('doit approuver une sélection par lot d’auteurs distincts, remplacer leurs anciens avis APPROVED et préserver les notes/textes', async () => {
      mockPrisma.appReview.findMany
        .mockResolvedValueOnce([
          {
            id: 'rev_a',
            userId: 'user_a',
            authorEmail: 'a@kanto.mg',
            isPublicationAuthorized: true,
            moderatorNote: null,
            user: { email: 'a@kanto.mg' },
          },
          {
            id: 'rev_b',
            userId: 'user_b',
            authorEmail: 'b@kanto.mg',
            isPublicationAuthorized: true,
            moderatorNote: 'Note existante',
            user: { email: 'b@kanto.mg' },
          },
        ])
        .mockResolvedValueOnce([
          {
            id: 'rev_a_prev',
            moderatorNote: null,
          },
        ]);

      mockPrisma.appReview.update.mockResolvedValue({});

      const res = await service.batchModerateReviews(
        {
          reviewIds: ['rev_a', 'rev_b'],
          status: ReviewModerationAction.APPROVE,
        },
        'admin@kanto.mg',
      );

      expect(res).toEqual({
        success: true,
        updatedCount: 2,
        replacedReviewIds: ['rev_a_prev'],
        status: ReviewModerationAction.APPROVE,
      });

      expect(mockPrisma.appReview.update).toHaveBeenCalledTimes(3);
      expect(mockPrisma.appReview.update).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          where: { id: 'rev_a_prev' },
          data: expect.objectContaining({ moderationStatus: 'PENDING' }),
        }),
      );
      expect(mockPrisma.appReview.update).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          where: { id: 'rev_a' },
          data: expect.objectContaining({ moderationStatus: 'APPROVED' }),
        }),
      );
      expect(mockPrisma.appReview.update).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          where: { id: 'rev_b' },
          data: expect.objectContaining({
            moderationStatus: 'APPROVED',
            moderatorNote: 'Note existante',
          }),
        }),
      );
    });

    it('doit permettre de retirer plusieurs avis d’app-kanto en lot (statut PENDING)', async () => {
      mockPrisma.appReview.findMany.mockResolvedValue([
        {
          id: 'rev_x',
          userId: 'user_x',
          authorEmail: 'x@kanto.mg',
          isPublicationAuthorized: true,
          moderatorNote: null,
          user: null,
        },
        {
          id: 'rev_y',
          userId: 'user_y',
          authorEmail: 'y@kanto.mg',
          isPublicationAuthorized: true,
          moderatorNote: null,
          user: null,
        },
      ]);
      mockPrisma.appReview.update.mockResolvedValue({});

      const res = await service.batchModerateReviews(
        {
          reviewIds: ['rev_x', 'rev_y'],
          status: ReviewModerationAction.PENDING,
        },
        'admin@kanto.mg',
      );

      expect(res).toEqual({
        success: true,
        updatedCount: 2,
        replacedReviewIds: [],
        status: ReviewModerationAction.PENDING,
      });
      expect(mockPrisma.appReview.update).toHaveBeenCalledTimes(2);
    });

    it('doit enrichir getAdminReviews avec les compteurs auteur et le résumé global', async () => {
      mockPrisma.appReview.count
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(1);

      mockPrisma.appReview.findMany
        .mockResolvedValueOnce([
          {
            id: 'rev_rose_1',
            userId: null,
            authorEmail: 'roliannerose@gmail.com',
            moderationStatus: 'PENDING',
            user: null,
          },
          {
            id: 'rev_rose_2',
            userId: null,
            authorEmail: 'roliannerose@gmail.com',
            moderationStatus: 'APPROVED',
            user: null,
          },
        ])
        .mockResolvedValueOnce([
          {
            id: 'rev_rose_1',
            userId: null,
            authorEmail: 'roliannerose@gmail.com',
            moderationStatus: 'PENDING',
            user: null,
          },
          {
            id: 'rev_rose_2',
            userId: null,
            authorEmail: 'roliannerose@gmail.com',
            moderationStatus: 'APPROVED',
            user: null,
          },
        ]);

      const res = await service.getAdminReviews({ page: 1, limit: 20 });

      expect(res.summary).toEqual({
        approvedCount: 1,
        pendingCount: 1,
      });
      expect(res.data[0].authorKey).toBe('email:roliannerose@gmail.com');
      expect(res.data[0].authorTotalReviews).toBe(2);
      expect(res.data[0].authorApprovedReviewsCount).toBe(1);
    });
  });
});
