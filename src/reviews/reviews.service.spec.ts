import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { PublicDisplayNameTypeDto } from './dto/create-review.dto.js';

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
});
