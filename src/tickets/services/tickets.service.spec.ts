import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { TicketValidationService } from './ticket-validation.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { TicketEntryMode, TicketStatus } from '../../../generated/prisma/client.js';

describe('TicketsService & TicketValidationService', () => {
  let ticketsService: TicketsService;
  let validationService: TicketValidationService;
  let prisma: any;

  const mockDate = new Date();
  const mockFuture = new Date(Date.now() + 86400000);

  beforeEach(async () => {
    prisma = {
      eventTicket: {
        findUnique: jest.fn<any>(),
        findFirst: jest.fn<any>(),
        findMany: jest.fn<any>(),
        create: jest.fn<any>(),
        update: jest.fn<any>(),
      },
      event: {
        findUnique: jest.fn<any>(),
      },
      ticketValidation: {
        create: jest.fn<any>(),
      },
      $transaction: jest.fn<any>((callback: any) => callback(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        TicketValidationService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    ticketsService = module.get<TicketsService>(TicketsService);
    validationService = module.get<TicketValidationService>(TicketValidationService);
  });

  describe('TicketsService.generateTicketForParticipation', () => {
    it('génère un nouveau billet individuel avec token sécurisé et numéro lisible', async () => {
      prisma.eventTicket.findUnique.mockResolvedValue(null);
      prisma.event.findUnique.mockResolvedValue({ slug: 'hiragasy-2026', titleFr: 'Festival Hiragasy' });
      prisma.eventTicket.create.mockImplementation((args: any) =>
        Promise.resolve({
          id: 'ticket_1',
          ...args.data,
          event: { id: 'evt_1', titleFr: 'Festival Hiragasy', slug: 'hiragasy-2026' },
          user: { id: 'usr_1', name: 'Rasoa' },
        }),
      );

      const res = await ticketsService.generateTicketForParticipation({
        eventId: 'evt_1',
        participationId: 'part_1',
        userId: 'usr_1',
        validFrom: mockDate,
        validUntil: mockFuture,
      });

      expect(res.id).toBe('ticket_1');
      expect(res.ticketNumber).toMatch(/^KT-HIR-[A-F0-9]{6}$/);
      expect(res.qrCodePayload).toContain('kanto://ticket/validate/');
      expect(res.status).toBe(TicketStatus.VALID);
      expect(prisma.eventTicket.create).toHaveBeenCalled();
    });

    it('est strictement idempotent et renvoie le billet existant sans recréer', async () => {
      prisma.eventTicket.findUnique.mockResolvedValue({
        id: 'ticket_existing',
        ticketNumber: 'KT-HIR-ABC123',
        secureToken: 'secure_token_123',
        status: TicketStatus.VALID,
        maxEntries: 1,
        usedCount: 0,
        validFrom: mockDate,
        validUntil: mockFuture,
        event: { id: 'evt_1', titleFr: 'Festival' },
        user: { id: 'usr_1', name: 'Rasoa' },
      });

      const res = await ticketsService.generateTicketForParticipation({
        eventId: 'evt_1',
        participationId: 'part_1',
        userId: 'usr_1',
        validFrom: mockDate,
        validUntil: mockFuture,
      });

      expect(res.id).toBe('ticket_existing');
      expect(prisma.eventTicket.create).not.toHaveBeenCalled();
    });
  });

  describe('TicketsService.getTicketById', () => {
    it('interdit l’accès si l’utilisateur n’est pas le propriétaire et n’est pas admin', async () => {
      prisma.eventTicket.findUnique.mockResolvedValue({
        id: 'ticket_1',
        userId: 'other_user',
        secureToken: 'token_1',
      });

      await expect(
        ticketsService.getTicketById('ticket_1', 'usr_current', false),
      ).rejects.toThrow(ForbiddenException);
    });

    it('autorise l’administrateur à consulter n’importe quel billet', async () => {
      prisma.eventTicket.findUnique.mockResolvedValue({
        id: 'ticket_1',
        userId: 'other_user',
        secureToken: 'token_1',
        status: TicketStatus.VALID,
        event: { id: 'evt_1' },
        user: { id: 'other_user', name: 'Rakoto' },
      });

      const res = await ticketsService.getTicketById('ticket_1', 'admin_1', true);
      expect(res.id).toBe('ticket_1');
    });
  });

  describe('TicketValidationService.validateTicket', () => {
    it('rejette un token inconnu avec DENIED_INVALID', async () => {
      prisma.eventTicket.findUnique.mockResolvedValue(null);

      const res = await validationService.validateTicket(
        { secureToken: 'fake_token' },
        'agent_1',
      );

      expect(res.allowed).toBe(false);
      expect(res.result).toBe('DENIED_INVALID');
    });

    it('rejette un billet annulé avec DENIED_CANCELLED et journalise l’audit', async () => {
      prisma.eventTicket.findUnique.mockResolvedValue({
        id: 't_cancelled',
        ticketNumber: 'KT-EVT-001',
        status: TicketStatus.CANCELLED,
        eventId: 'evt_1',
        validUntil: mockFuture,
        event: { id: 'evt_1', titleFr: 'Événement' },
        user: { id: 'u_1', name: 'Jean' },
      });

      const res = await validationService.validateTicket(
        { secureToken: 'token_cancelled' },
        'agent_1',
        'Agent Test',
        'ADMIN',
      );

      expect(res.allowed).toBe(false);
      expect(res.result).toBe('DENIED_CANCELLED');
      expect(prisma.ticketValidation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ result: 'DENIED_CANCELLED' }),
        }),
      );
    });

    it('rejette un billet déjà utilisé avec DENIED_USED', async () => {
      prisma.eventTicket.findUnique.mockResolvedValue({
        id: 't_used',
        ticketNumber: 'KT-EVT-002',
        status: TicketStatus.USED,
        maxEntries: 1,
        usedCount: 1,
        usedAt: new Date(Date.now() - 3600000),
        eventId: 'evt_1',
        validUntil: mockFuture,
        event: { id: 'evt_1', titleFr: 'Événement' },
        user: { id: 'u_1', name: 'Jean' },
      });

      const res = await validationService.validateTicket(
        { secureToken: 'token_used' },
        'agent_1',
        'Agent Test',
        'ADMIN',
      );

      expect(res.allowed).toBe(false);
      expect(res.result).toBe('DENIED_USED');
    });

    it('valide avec succès un billet valide et met à jour son statut à USED', async () => {
      prisma.eventTicket.findUnique.mockResolvedValue({
        id: 't_valid',
        ticketNumber: 'KT-EVT-003',
        status: TicketStatus.VALID,
        maxEntries: 1,
        usedCount: 0,
        validFrom: mockDate,
        validUntil: mockFuture,
        entryMode: TicketEntryMode.SINGLE,
        eventId: 'evt_1',
        event: {
          id: 'evt_1',
          titleFr: 'Fête Malagasy',
          titleMg: 'Fety',
          location: 'Tana',
          startDate: mockDate,
          metadata: {
            checkInAgents: [{ userId: 'agent_1', email: 'agent@test.mg' }],
          },
        },
        user: { id: 'u_1', name: 'Andry', username: 'andry_mg', image: null },
      });

      prisma.eventTicket.update.mockResolvedValue({
        id: 't_valid',
        ticketNumber: 'KT-EVT-003',
        status: TicketStatus.USED,
        entryMode: TicketEntryMode.SINGLE,
        usedCount: 1,
      });

      const res = await validationService.validateTicket(
        { secureToken: 'token_valid', deviceInfo: 'Pixel 8' },
        'agent_1',
        'Agent Jean',
        'USER',
        'agent@test.mg',
      );

      expect(res.allowed).toBe(true);
      expect(res.result).toBe('GRANTED');
      expect(res.remainingEntries).toBe(0);
      expect(prisma.eventTicket.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 't_valid' },
          data: expect.objectContaining({ status: TicketStatus.USED, usedCount: 1 }),
        }),
      );
      expect(prisma.ticketValidation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            result: 'GRANTED',
            scannedById: 'agent_1',
            deviceInfo: 'Pixel 8',
          }),
        }),
      );
    });

    it('refuse le scan si l’agent n’est pas assigné à cet événement précis', async () => {
      prisma.eventTicket.findUnique.mockResolvedValue({
        id: 't_valid_other',
        ticketNumber: 'KT-EVT-004',
        status: TicketStatus.VALID,
        maxEntries: 1,
        usedCount: 0,
        validFrom: mockDate,
        validUntil: mockFuture,
        entryMode: TicketEntryMode.SINGLE,
        eventId: 'evt_autre',
        event: {
          id: 'evt_autre',
          titleFr: 'Autre Événement',
          titleMg: 'Hetsika hafa',
          metadata: {
            checkInAgents: [{ userId: 'autre_agent' }],
          },
        },
        user: { id: 'u_1', name: 'Andry' },
      });

      const res = await validationService.validateTicket(
        { secureToken: 'token_other' },
        'agent_intrus',
        'Intrus',
        'USER',
        'intrus@test.mg',
      );

      expect(res.allowed).toBe(false);
      expect(res.result).toBe('DENIED_INVALID');
      expect(res.message).toContain('pas l\'autorisation de scanner les billets pour cet événement précis');
    });
  });
});
