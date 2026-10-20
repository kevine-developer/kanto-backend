import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
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

  const mockDate = new Date('2026-10-25T10:00:00.000Z');
  const mockFutureStart = new Date('2026-10-26T10:00:00.000Z');
  const mockFutureEnd = new Date('2026-11-05T10:00:00.000Z');

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
        findMany: jest.fn().mockResolvedValue([mockEvent]),
        findUnique: jest.fn().mockResolvedValue(mockEvent),
        findFirst: jest.fn().mockResolvedValue(mockEvent),
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn().mockResolvedValue(mockEvent),
        update: jest.fn().mockResolvedValue(mockEvent),
        delete: jest.fn().mockResolvedValue(mockEvent),
      },
      eventParticipation: {
        findUnique: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn().mockResolvedValue(5),
      },
      eventReward: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      eventRewardClaim: {
        findUnique: jest.fn(),
        create: jest.fn(),
        count: jest.fn().mockResolvedValue(2),
      },
      eventLeaderboardEntry: {
        findMany: jest.fn().mockResolvedValue([]),
        upsert: jest.fn(),
      },
      user: {
        findUnique: jest.fn().mockResolvedValue({ id: 'user_1', tier: 'FREE' }),
      },
      userProgress: {
        upsert: jest.fn(),
      },
      userBadge: {
        upsert: jest.fn(),
      },
      adminAuditLog: {
        create: jest.fn().mockResolvedValue({ id: 'log_1' }),
      },
      $transaction: jest.fn((callback: any) => callback(prisma)),
    };

    progressionService = {
      awardXp: jest.fn().mockResolvedValue(true),
    };

    notificationsService = {
      createNotification: jest.fn().mockResolvedValue(true),
    };

    badgesService = {
      getUserBadges: jest.fn().mockResolvedValue([]),
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
      const res = await service.getEventBySlugOrId('fety-malagasy-2026', 'user_1');
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
      await expect(
        service.getEventBySlugOrId('inconnu'),
      ).rejects.toThrow(NotFoundException);
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
      expect(res.participation.status).toBe(EventParticipationStatus.REGISTERED);
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
});
