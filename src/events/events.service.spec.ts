import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { EventsService } from './events.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProgressionService } from '../progression/progression.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { BadgesService } from '../badges/badges.service.js';
import {
  EventCategory,
  EventParticipationStatus,
  EventParticipationType,
  EventRewardType,
  EventStatus,
} from '../../generated/prisma/client.js';

describe('EventsService', () => {
  let service: EventsService;
  let prisma: any;
  let progressionService: any;
  let notificationsService: any;
  let badgesService: any;

  const mockFutureStart = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const mockFutureEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const mockEvent = {
    id: 'evt_123456789012345678901',
    slug: 'fety-malagasy-2026',
    titleMg: 'Asaramanitra 2026',
    titleFr: 'Célébration du Nouvel An Malgache 2026',
    descriptionMg: 'Hetsika lehibe hankalazana ny Asaramanitra.',
    descriptionFr: 'Grand événement célébrant les traditions malgaches.',
    shortDescMg: 'Asaramanitra sy fahendrena',
    shortDescFr: 'Tradition et festivités',
    category: EventCategory.CULTURE,
    status: EventStatus.PUBLISHED,
    participationType: EventParticipationType.OPEN,
    minTier: 'FREE',
    startDate: mockFutureStart,
    endDate: mockFutureEnd,
    registrationDeadline: mockFutureStart,
    maxParticipants: 100,
    currentParticipantsCount: 10,
    viewsCount: 45,
    sharesCount: 12,
    isFeatured: true,
    rewards: [
      {
        id: 'rew_1',
        rewardType: EventRewardType.XP,
        titleMg: '+200 XP',
        titleFr: '+200 XP Découverte',
        amount: 200,
        criteria: 'completion',
        claimsCount: 5,
        maxWinners: null,
      },
    ],
  };

  beforeEach(async () => {
    prisma = {
      event: {
        findMany: jest.fn<any>().mockResolvedValue([mockEvent]),
        findUnique: jest.fn<any>().mockResolvedValue(mockEvent),
        findFirst: jest.fn<any>().mockResolvedValue(mockEvent),
        count: jest.fn<any>().mockResolvedValue(1),
        create: jest.fn<any>().mockResolvedValue(mockEvent),
        update: jest.fn<any>().mockResolvedValue(mockEvent),
        delete: jest.fn<any>().mockResolvedValue(mockEvent),
      },
      eventParticipation: {
        findUnique: jest.fn<any>(),
        findMany: jest.fn<any>().mockResolvedValue([]),
        create: jest.fn<any>(),
        update: jest.fn<any>(),
        count: jest.fn<any>().mockResolvedValue(5),
      },
      eventReward: {
        findUnique: jest.fn<any>(),
        create: jest.fn<any>(),
        update: jest.fn<any>(),
      },
      eventRewardClaim: {
        findUnique: jest.fn<any>(),
        create: jest.fn<any>(),
        count: jest.fn<any>().mockResolvedValue(2),
      },
      eventLeaderboardEntry: {
        findMany: jest.fn<any>().mockResolvedValue([]),
        upsert: jest.fn<any>(),
      },
      user: {
        findUnique: jest
          .fn<any>()
          .mockResolvedValue({ id: 'user_1', tier: 'FREE' }),
      },
      userProgress: {
        upsert: jest.fn<any>(),
      },
      userBadge: {
        upsert: jest.fn<any>(),
      },
      adminAuditLog: {
        create: jest.fn<any>().mockResolvedValue({ id: 'log_1' }),
      },
      $transaction: jest.fn<any>((callback: any) => callback(prisma)),
    };

    progressionService = {
      awardXp: jest.fn<any>().mockResolvedValue(true),
    };

    notificationsService = {
      createNotification: jest.fn<any>().mockResolvedValue(true),
    };

    badgesService = {
      getUserBadges: jest.fn<any>().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: PrismaService, useValue: prisma },
        { provide: ProgressionService, useValue: progressionService },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: BadgesService, useValue: badgesService },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  describe('Consultation publique', () => {
    it('renvoie la liste des événements publics avec pagination', async () => {
      const res = await service.getPublicEvents({ page: 1, limit: 10 });
      expect(res.items).toHaveLength(1);
      expect(res.pagination.total).toBe(1);
      expect(prisma.event.findMany).toHaveBeenCalled();
    });

    it('renvoie l’événement vedette pour l’accueil', async () => {
      const res = await service.getFeaturedEvent('user_1');
      expect(res).toBeDefined();
      expect(res?.slug).toBe('fety-malagasy-2026');
      expect(prisma.event.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isFeatured: true }),
        }),
      );
    });

    it('renvoie la fiche détaillée par slug ou id et incrémente les vues', async () => {
      const res = await service.getEventBySlugOrId(
        'fety-malagasy-2026',
        'user_1',
      );
      expect(res.slug).toBe('fety-malagasy-2026');
      expect(prisma.event.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockEvent.id },
          data: { viewsCount: { increment: 1 } },
        }),
      );
    });

    it('lève une NotFoundException si l’événement est introuvable', async () => {
      prisma.event.findFirst.mockResolvedValueOnce(null);
      await expect(service.getEventBySlugOrId('inconnu')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Inscriptions et participations', () => {
    it('inscrit avec succès un utilisateur et déclenche la notification de confirmation', async () => {
      prisma.eventParticipation.findUnique.mockResolvedValueOnce(null);
      prisma.eventParticipation.create.mockResolvedValueOnce({
        id: 'part_1',
        eventId: mockEvent.id,
        userId: 'user_1',
        status: EventParticipationStatus.REGISTERED,
      });

      const res = await service.participateInEvent(mockEvent.id, 'user_1');
      expect(res.success).toBe(true);
      expect(res.participation.status).toBe(
        EventParticipationStatus.REGISTERED,
      );
      expect(prisma.event.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockEvent.id },
          data: { currentParticipantsCount: { increment: 1 } },
        }),
      );
      expect(notificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user_1',
          category: 'community',
        }),
      );
    });

    it('gère l’idempotence si l’utilisateur est déjà inscrit', async () => {
      prisma.eventParticipation.findUnique.mockResolvedValueOnce({
        id: 'part_existing',
        eventId: mockEvent.id,
        userId: 'user_1',
        status: EventParticipationStatus.REGISTERED,
      });

      const res = await service.participateInEvent(mockEvent.id, 'user_1');
      expect(res.success).toBe(true);
      expect(res.message).toContain('déjà');
      expect(prisma.eventParticipation.create).not.toHaveBeenCalled();
    });

    it('refuse l’inscription si l’événement est complet', async () => {
      prisma.event.findUnique.mockResolvedValueOnce({
        ...mockEvent,
        maxParticipants: 10,
        currentParticipantsCount: 10,
      });
      prisma.eventParticipation.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.participateInEvent(mockEvent.id, 'user_1'),
      ).rejects.toThrow(ConflictException);
    });

    it('refuse l’inscription si le statut de l’événement est BROUILLON ou TERMINE', async () => {
      prisma.event.findUnique.mockResolvedValueOnce({
        ...mockEvent,
        status: EventStatus.DRAFT,
      });

      await expect(
        service.participateInEvent(mockEvent.id, 'user_1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('permet l’annulation d’une inscription avant la date de début', async () => {
      prisma.eventParticipation.findUnique.mockResolvedValueOnce({
        id: 'part_1',
        eventId: mockEvent.id,
        userId: 'user_1',
        event: mockEvent,
      });

      const res = await service.cancelParticipation(mockEvent.id, 'user_1');
      expect(res.success).toBe(true);
      expect(prisma.eventParticipation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'part_1' },
          data: { status: EventParticipationStatus.CANCELLED },
        }),
      );
    });
  });

  describe('Soumission de progression et récompenses', () => {
    it('enregistre le score et attribue automatiquement les récompenses d’achèvement', async () => {
      prisma.event.findUnique.mockResolvedValueOnce({
        ...mockEvent,
        status: EventStatus.ACTIVE,
      });
      prisma.eventParticipation.findUnique.mockResolvedValueOnce({
        id: 'part_1',
        eventId: mockEvent.id,
        userId: 'user_1',
        score: 50,
        progressPercent: 50,
        status: EventParticipationStatus.IN_PROGRESS,
      });
      prisma.eventParticipation.update.mockResolvedValueOnce({
        id: 'part_1',
        score: 100,
        progressPercent: 100,
        status: EventParticipationStatus.COMPLETED,
      });
      prisma.eventRewardClaim.findUnique.mockResolvedValueOnce(null);

      const res = await service.submitProgress(mockEvent.id, 'user_1', {
        score: 100,
        progressPercent: 100,
      });

      expect(res.success).toBe(true);
      expect(res.participation.status).toBe(EventParticipationStatus.COMPLETED);
      expect(progressionService.awardXp).toHaveBeenCalledWith(
        'user_1',
        200,
        'event_reward',
        expect.any(String),
      );
      expect(prisma.eventRewardClaim.create).toHaveBeenCalled();
    });

    it('incrémente le compteur de partages', async () => {
      prisma.event.update.mockResolvedValueOnce({ sharesCount: 13 });
      const res = await service.trackShare(mockEvent.id);
      expect(res.success).toBe(true);
      expect(res.sharesCount).toBe(13);
    });
  });

  describe('Administration', () => {
    it('crée un événement avec génération de slug unique et journalisation d’audit', async () => {
      prisma.event.findUnique.mockResolvedValueOnce(null);
      prisma.event.create.mockResolvedValueOnce({
        ...mockEvent,
        id: 'new_evt',
        slug: 'tournoi-kabary-2026-abcd',
      });

      const res = await service.createEvent(
        {
          titleFr: 'Tournoi de Kabary 2026',
          titleMg: 'Fampisehoana Kabary 2026',
          descriptionFr: 'Tournoi traditionnel de Kabary.',
          descriptionMg: 'Lalao kabary nentim-paharazana.',
          startDate: mockFutureStart.toISOString(),
          endDate: mockFutureEnd.toISOString(),
        },
        'admin_1',
      );

      expect(res.id).toBe('new_evt');
      expect(prisma.adminAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'admin_1',
            action: 'EVENT_CREATED',
          }),
        }),
      );
    });

    it('met à jour le statut d’un événement et notifie les inscrits en cas d’annulation', async () => {
      prisma.event.findUnique.mockResolvedValueOnce({
        ...mockEvent,
        participations: [{ userId: 'user_filleul' }],
      });
      prisma.event.update.mockResolvedValueOnce({
        ...mockEvent,
        status: EventStatus.CANCELLED,
      });

      const res = await service.updateEventStatus(
        mockEvent.id,
        { status: EventStatus.CANCELLED, cancelledReason: 'Intempéries' },
        'admin_1',
      );

      expect(res.status).toBe(EventStatus.CANCELLED);
      expect(notificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user_filleul',
          category: 'system',
        }),
      );
    });

    it('calcule les statistiques du tableau de bord d’administration avec des métriques réelles', async () => {
      prisma.event.count.mockResolvedValue(5);
      prisma.eventParticipation.count.mockResolvedValue(12);
      prisma.eventRewardClaim.count.mockResolvedValue(3);
      prisma.eventParticipation.findMany.mockResolvedValue([
        {
          id: 'part_1',
          eventId: 'evt_1',
          userId: 'user_1',
          status: EventParticipationStatus.REGISTERED,
          score: 100,
          createdAt: new Date(),
          completedAt: null,
          user: { name: 'Kanto Member', email: 'user@kanto.mg' },
          event: { titleFr: 'Événement Test', category: EventCategory.CULTURE },
        },
      ]);

      const res = await service.getAdminOverviewStats();

      expect(res.metrics.totalEvents).toBe(5);
      expect(res.metrics.totalRegistrations).toBe(12);
      expect(res.metrics.totalRewardsDistributed).toBe(3);
      expect(res.recentActivity).toHaveLength(1);
      expect(res.recentActivity[0].userName).toBe('Kanto Member');
    });

    it('archive un événement au lieu de le supprimer s’il contient des participants', async () => {
      prisma.event.findUnique.mockResolvedValueOnce({
        id: 'evt_with_participants',
        titleFr: 'Événement avec Inscrits',
        _count: { participations: 15 },
      });
      prisma.event.update.mockResolvedValueOnce({
        id: 'evt_with_participants',
        status: EventStatus.ARCHIVED,
      });

      const res = await service.deleteEvent('evt_with_participants', 'admin_1');

      expect(res.action).toBe('ARCHIVED');
      expect(prisma.event.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'evt_with_participants' },
          data: { status: EventStatus.ARCHIVED },
        }),
      );
    });

    it('supprime physiquement un événement s’il n’a aucun participant', async () => {
      prisma.event.findUnique.mockResolvedValueOnce({
        id: 'evt_draft_empty',
        titleFr: 'Brouillon Vide',
        _count: { participations: 0 },
      });
      prisma.event.delete.mockResolvedValueOnce({ id: 'evt_draft_empty' });

      const res = await service.deleteEvent('evt_draft_empty', 'admin_1');

      expect(res.action).toBe('DELETED');
      expect(prisma.event.delete).toHaveBeenCalledWith({
        where: { id: 'evt_draft_empty' },
      });
    });
  });
  describe('Création flexible des langues et sections', () => {
    it('permet de créer un événement UNIQUEMENT en malgache', async () => {
      prisma.event.findUnique.mockResolvedValueOnce(null);
      prisma.event.create.mockImplementationOnce(({ data }: any) =>
        Promise.resolve({ id: 'evt_mg_only', ...data }),
      );

      const res = await service.createEvent(
        {
          titleMg: 'Hetsika Kolontsaina 2026',
          descriptionMg: 'Fankalazana ny vakoka sy ny fomba amam-panao.',
          startDate: mockFutureStart,
          endDate: mockFutureEnd,
          metadata: {
            contentConfig: {
              languageMode: 'mg',
              languages: ['mg'],
              sections: {
                shortDescription: false,
                rules: false,
                participationConditions: false,
                practicalInfo: false,
                rewards: false,
                gameModule: false,
              },
            },
          },
        },
        'admin_1',
      );

      expect(res.id).toBe('evt_mg_only');
      expect(res.titleMg).toBe('Hetsika Kolontsaina 2026');
      expect(res.titleFr).toBe('Hetsika Kolontsaina 2026'); // Rétrocompatibilité schéma DB sans casser
      expect(res.metadata.contentConfig.languageMode).toBe('mg');
      expect(res.metadata.contentConfig.languages).toEqual(['mg']);
      expect(prisma.event.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            titleMg: 'Hetsika Kolontsaina 2026',
            status: EventStatus.DRAFT,
          }),
        }),
      );
    });

    it('permet de créer un événement UNIQUEMENT en français', async () => {
      prisma.event.findUnique.mockResolvedValueOnce(null);
      prisma.event.create.mockImplementationOnce(({ data }: any) =>
        Promise.resolve({ id: 'evt_fr_only', ...data }),
      );

      const res = await service.createEvent(
        {
          titleFr: 'Festival du Patrimoine 2026',
          descriptionFr: 'Grande célébration culturelle des traditions.',
          startDate: mockFutureStart,
          endDate: mockFutureEnd,
          metadata: {
            contentConfig: {
              languageMode: 'fr',
              languages: ['fr'],
              sections: {
                shortDescription: true,
                rules: false,
                participationConditions: true,
                practicalInfo: true,
                rewards: false,
                gameModule: false,
              },
            },
          },
          shortDescFr: 'Un voyage au cœur de la culture',
          location: 'Antananarivo',
        },
        'admin_1',
      );

      expect(res.id).toBe('evt_fr_only');
      expect(res.titleFr).toBe('Festival du Patrimoine 2026');
      expect(res.titleMg).toBe('Festival du Patrimoine 2026');
      expect(res.shortDescFr).toBe('Un voyage au cœur de la culture');
      expect(res.location).toBe('Antananarivo');
      expect(res.metadata.contentConfig.languageMode).toBe('fr');
    });

    it('rejette la création si la langue activée manque de titre ou description', async () => {
      await expect(
        service.createEvent(
          {
            titleFr: 'Titre seul sans description',
            startDate: mockFutureStart,
            endDate: mockFutureEnd,
            metadata: {
              contentConfig: {
                languageMode: 'fr',
                languages: ['fr'],
              },
            },
          } as any,
          'admin_1',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('désactive proprement les sections désactivées en base (nullification)', async () => {
      prisma.event.findUnique.mockResolvedValueOnce(null);
      prisma.event.create.mockImplementationOnce(({ data }: any) =>
        Promise.resolve({ id: 'evt_sections_off', ...data }),
      );

      const res = await service.createEvent(
        {
          titleFr: 'Atelier de Poésie',
          titleMg: 'Atrikasa Tononkalo',
          descriptionFr: 'Découverte des poèmes d’hier et d’aujourd’hui.',
          descriptionMg: 'Fahalalana ny tononkalo malagasy.',
          shortDescFr: 'Texte ignoré car section désactivée',
          rulesFr: 'Règles ignorées car section désactivée',
          location: 'Lieu ignoré car section désactivée',
          startDate: mockFutureStart,
          endDate: mockFutureEnd,
          metadata: {
            contentConfig: {
              languageMode: 'both',
              languages: ['mg', 'fr'],
              sections: {
                shortDescription: false,
                rules: false,
                participationConditions: false,
                practicalInfo: false,
                rewards: false,
                gameModule: false,
              },
            },
          },
        },
        'admin_1',
      );

      expect(res.shortDescFr).toBeNull();
      expect(res.shortDescMg).toBeNull();
      expect(res.rulesFr).toBeNull();
      expect(res.rulesMg).toBeNull();
      expect(res.location).toBeNull();
      expect(res.metadata.contentConfig.sections.shortDescription).toBe(false);
    });
  });
});

