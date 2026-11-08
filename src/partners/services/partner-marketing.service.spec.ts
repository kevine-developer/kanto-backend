import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { PartnerMarketingService } from './partner-marketing.service.js';
import { MarketingRequestStatus } from '../../../generated/prisma/client.js';

describe('PartnerMarketingService', () => {
  let service: PartnerMarketingService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      marketingPlacement: {
        count: jest.fn(),
        upsert: jest.fn<any>().mockResolvedValue({}),
        findMany: jest.fn(),
      },
      marketingRequest: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      event: {
        findFirst: jest.fn(),
      },
      adminAuditLog: {
        create: jest.fn(),
      },
    };

    service = new PartnerMarketingService(prismaMock);
  });

  describe('seedDefaultPlacementsIfEmpty', () => {
    it('ne doit rien insérer si des emplacements existent déjà (idempotence)', async () => {
      prismaMock.marketingPlacement.count.mockResolvedValueOnce(6);

      await service.seedDefaultPlacementsIfEmpty();

      expect(prismaMock.marketingPlacement.upsert).not.toHaveBeenCalled();
    });

    it('doit insérer les 6 emplacements par défaut si la table est vide', async () => {
      prismaMock.marketingPlacement.count.mockResolvedValueOnce(0);

      await service.seedDefaultPlacementsIfEmpty();

      expect(prismaMock.marketingPlacement.upsert).toHaveBeenCalledTimes(6);
    });
  });

  describe('createMarketingRequest', () => {
    it('doit refuser la demande si l’événement n’appartient pas au partenaire', async () => {
      prismaMock.event.findFirst.mockResolvedValueOnce(null);

      await expect(
        service.createMarketingRequest('partner_1', {
          eventId: 'event_other',
          placementCodes: ['HERO_BANNER'],
          requestedStartDate: '2026-12-01',
          requestedEndDate: '2026-12-07',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('doit créer la demande avec statut SUBMITTED et lier les emplacements', async () => {
      prismaMock.event.findFirst.mockResolvedValueOnce({
        id: 'event_1',
        partnerId: 'partner_1',
        titleFr: 'Festival Hiragasy',
      });

      prismaMock.marketingPlacement.findMany.mockResolvedValueOnce([
        {
          id: 'placement_hero',
          code: 'HERO_BANNER',
          basePrice: 150000,
        },
      ]);

      prismaMock.marketingRequest.create.mockResolvedValueOnce({
        id: 'req_1',
        partnerId: 'partner_1',
        eventId: 'event_1',
        status: MarketingRequestStatus.SUBMITTED,
        proposedBudget: 150000,
      });

      const res = await service.createMarketingRequest('partner_1', {
        eventId: 'event_1',
        placementCodes: ['HERO_BANNER'],
        requestedStartDate: '2026-12-01',
        requestedEndDate: '2026-12-07',
        campaignGoals: 'Maximiser les inscriptions',
        proposedBudget: 150000,
      });

      expect(res.id).toBe('req_1');
      expect(res.status).toBe(MarketingRequestStatus.SUBMITTED);
    });
  });

  describe('addMessage', () => {
    it('doit ajouter un message dans l’historique des messages de la négociation', async () => {
      prismaMock.marketingRequest.findFirst.mockResolvedValueOnce({
        id: 'req_1',
        partnerId: 'partner_1',
        messages: [
          {
            senderRole: 'PARTNER',
            senderName: 'Organisateur',
            text: 'Bonjour, pouvons-nous ajuster les dates ?',
            sentAt: '2026-11-01T10:00:00.000Z',
          },
        ],
      });

      prismaMock.marketingRequest.update.mockResolvedValueOnce({
        id: 'req_1',
        messages: [
          {
            senderRole: 'PARTNER',
            senderName: 'Organisateur',
            text: 'Bonjour, pouvons-nous ajuster les dates ?',
            sentAt: '2026-11-01T10:00:00.000Z',
          },
          {
            senderRole: 'ADMIN',
            senderName: 'Équipe Kanto MG',
            text: 'Bien sûr, les dates du 5 au 12 décembre sont disponibles.',
            sentAt: '2026-11-01T11:00:00.000Z',
          },
        ],
      });

      const res = await service.addMessage(
        'req_1',
        null,
        { message: 'Bien sûr, les dates du 5 au 12 décembre sont disponibles.' },
        { role: 'ADMIN', name: 'Équipe Kanto MG' },
      );

      expect(res.success).toBe(true);
      expect(res.totalMessages).toBe(2);
      expect(res.message.senderRole).toBe('ADMIN');
    });
  });
});
