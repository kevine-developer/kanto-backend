import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { PartnerEventsService } from './partner-events.service.js';
import {
  EventModerationStatus,
  EventStatus,
  EventCategory,
} from '../../../generated/prisma/client.js';

describe('PartnerEventsService', () => {
  let service: PartnerEventsService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      partner: {
        findUnique: jest.fn<any>().mockResolvedValue({ id: 'partner_gasikara', name: 'Association Gasikara' }),
      },
      event: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      eventParticipation: {
        count: jest.fn(),
        findMany: jest.fn(),
      },
      adminAuditLog: {
        create: jest.fn(),
      },
    };

    service = new PartnerEventsService(prismaMock);
  });

  describe('createEvent', () => {
    it('doit créer un événement avec le statut PENDING_REVIEW pour modération', async () => {
      prismaMock.event.findUnique.mockResolvedValue(null);
      prismaMock.event.create.mockImplementationOnce(async ({ data }: any) => ({
        id: 'event_part_1',
        ...data,
      }));

      const result = await service.createEvent('partner_gasikara', {
        titleFr: 'Festival Hiragasy Analamanga',
        titleMg: 'Fetin’ny Hiragasy Analamanga',
        descriptionFr: 'Grand festival d’art oratoire et musique',
        descriptionMg: 'Fankalazana lehibe ny zavakanto',
        category: EventCategory.CULTURE,
        location: 'Antananarivo',
        startDate: '2026-12-01T10:00:00Z',
        endDate: '2026-12-02T18:00:00Z',
        maxParticipants: 200,
        submitForReview: true,
      });

      expect(result.partnerId).toBe('partner_gasikara');
      expect(result.moderationStatus).toBe(EventModerationStatus.PENDING_REVIEW);
      expect(result.status).toBe(EventStatus.DRAFT);
    });
  });

  describe('getEventRegistrations (Conformité RGPD)', () => {
    it('doit masquer l’adresse e-mail personnelle des participants et exposer le profil public', async () => {
      prismaMock.event.findFirst.mockResolvedValueOnce({
        id: 'event_1',
        partnerId: 'partner_gasikara',
        titleFr: 'Concert Traditionnel',
        titleMg: 'Seho Vakodrazana',
        currentParticipantsCount: 1,
        maxParticipants: 50,
      });

      prismaMock.eventParticipation.count.mockResolvedValueOnce(1);
      prismaMock.eventParticipation.findMany.mockResolvedValueOnce([
        {
          id: 'part_123',
          status: 'REGISTERED',
          score: 100,
          waitlistPosition: null,
          createdAt: new Date('2026-11-01T12:00:00Z'),
          user: {
            id: 'user_456',
            name: 'Andry R.',
            username: 'andry_madagascar',
            image: 'https://cdn.kanto.mg/avatars/andry.png',
            tier: 'FREE',
          },
        },
      ]);

      const result = await service.getEventRegistrations('partner_gasikara', 'event_1', {});

      expect(result.registrations).toHaveLength(1);
      const first = result.registrations[0];
      expect(first.registrationId).toBe('part_123');
      expect(first.participant.displayName).toBe('Andry R.');
      expect(first.participant.username).toBe('andry_madagascar');
      // Vérification essentielle RGPD : aucune donnée d'email direct
      expect((first as any).email).toBeUndefined();
      expect((first.participant as any).email).toBeUndefined();
    });

    it('doit lever NotFoundException si l’événement n’appartient pas au partenaire demandeur', async () => {
      // Simulation d'une tentative d'accès aux participants d'un événement d'un tiers
      prismaMock.event.findFirst.mockResolvedValueOnce(null);

      await expect(
        service.getEventRegistrations('partner_hacker', 'event_other_partner', {}),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('reviewPartnerEvent (Modération Kanto)', () => {
    it('doit approuver l’événement et publier dans le catalogue', async () => {
      prismaMock.event.findUnique.mockResolvedValueOnce({
        id: 'event_1',
        titleFr: 'Soirée contes et légendes',
        partner: { id: 'partner_1', name: 'Contes MG' },
      });

      prismaMock.event.update.mockResolvedValueOnce({
        id: 'event_1',
        moderationStatus: EventModerationStatus.APPROVED,
        status: EventStatus.PUBLISHED,
      });

      const res = await service.reviewPartnerEvent(
        'event_1',
        { decision: EventModerationStatus.APPROVED },
        'admin_kanto',
      );

      expect(res.moderationStatus).toBe(EventModerationStatus.APPROVED);
      expect(prismaMock.adminAuditLog.create).toHaveBeenCalled();
    });
  });
});
