import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ModerationService } from './moderation.service.js';
import { ContentModerationService } from './content-moderation.service.js';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';
import {
  createPrismaMock,
  type PrismaMock,
} from '../../test-utils/mock-prisma.factory.js';
import {
  ReportReason,
  ReportStatus,
} from '../../../generated/prisma/client.js';

describe('ModerationService', () => {
  let service: ModerationService;
  let prismaMock: PrismaMock;
  let textModerationMock: Partial<ContentModerationService>;

  beforeEach(async () => {
    prismaMock = createPrismaMock();

    textModerationMock = {
      moderateContent: jest.fn<any>().mockReturnValue({
        passed: true,
        flagged: false,
        score: 0,
        detectedViolations: [],
        highlightedMatches: [],
        suggestion: null,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModerationService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: ContentModerationService, useValue: textModerationMock },
      ],
    }).compile();

    service = module.get<ModerationService>(ModerationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('reportContent', () => {
    it('lève BadRequestException si aucune cible n’est spécifiée', async () => {
      await expect(
        service.reportContent({ reason: ReportReason.INAPPROPRIATE }),
      ).rejects.toThrow(BadRequestException);
    });

    it('enregistre avec succès un signalement pour un proverbe/expression (itemId)', async () => {
      prismaMock.contentReport.create.mockResolvedValue({
        id: 'rep_123',
        reason: ReportReason.TRANSLATION_ERROR,
        status: ReportStatus.PENDING,
        resolved: false,
      });

      const result = await service.reportContent(
        {
          reason: ReportReason.TRANSLATION_ERROR,
          description: 'Erreur dans la traduction française',
          itemId: 'item_456',
        },
        'user_789',
      );

      expect(result.success).toBe(true);
      expect(result.reportId).toBe('rep_123');
      expect(prismaMock.contentReport.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            reason: ReportReason.TRANSLATION_ERROR,
            itemId: 'item_456',
            userId: 'user_789',
          }),
        }),
      );
    });

    it('enregistre avec succès un signalement d’utilisateur', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user_target',
        name: 'Utilisateur Suspect',
      });

      prismaMock.contentReport.create.mockResolvedValue({
        id: 'rep_user',
        reason: ReportReason.HARASSMENT,
        status: ReportStatus.PENDING,
        resolved: false,
      });

      const result = await service.reportContent(
        {
          reason: ReportReason.HARASSMENT,
          description: 'Messages insistants et inappropriés',
          reportedUserId: 'user_target',
        },
        'user_reporter',
      );

      expect(result.success).toBe(true);
      expect(prismaMock.contentReport.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            reason: ReportReason.HARASSMENT,
            reportedUserId: 'user_target',
            userId: 'user_reporter',
          }),
        }),
      );
    });

    it('lève BadRequestException si l’utilisateur tente de se signaler lui-même', async () => {
      await expect(
        service.reportContent(
          {
            reason: ReportReason.SPAM,
            reportedUserId: 'user_same',
          },
          'user_same',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getReports & resolveReport', () => {
    it('récupère la liste des signalements non résolus par défaut', async () => {
      prismaMock.contentReport.findMany.mockResolvedValue([]);
      prismaMock.contentReport.count.mockResolvedValue(0);

      const result = await service.getReports();

      expect(result.reports).toEqual([]);
      expect(result.total).toBe(0);
      expect(prismaMock.contentReport.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { resolved: false },
        }),
      );
    });

    it('lève NotFoundException si le signalement à résoudre n’existe pas', async () => {
      prismaMock.contentReport.findUnique.mockResolvedValue(null);

      await expect(
        service.resolveReport('inexistant_id', { resolved: true }),
      ).rejects.toThrow(NotFoundException);
    });

    it('résout avec succès un signalement existant', async () => {
      prismaMock.contentReport.findUnique.mockResolvedValue({
        id: 'rep_1',
        resolved: false,
      });
      prismaMock.contentReport.update.mockResolvedValue({
        id: 'rep_1',
        resolved: true,
      });

      const result = await service.resolveReport(
        'rep_1',
        { resolved: true },
        'admin_1',
      );

      expect(result.success).toBe(true);
      expect(prismaMock.contentReport.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'rep_1' },
          data: expect.objectContaining({
            resolved: true,
            status: ReportStatus.RESOLVED,
            resolvedById: 'admin_1',
          }),
        }),
      );
    });
  });

  describe('getModerationStats & analyzeContent', () => {
    it('calcule correctement les statistiques de modération', async () => {
      prismaMock.contentReport.count
        .mockResolvedValueOnce(5) // pending
        .mockResolvedValueOnce(2) // under review
        .mockResolvedValueOnce(12) // resolved
        .mockResolvedValueOnce(19); // total

      const stats = await service.getModerationStats();

      expect(stats.pendingReports).toBe(5);
      expect(stats.underReviewReports).toBe(2);
      expect(stats.resolvedReports).toBe(12);
      expect(stats.totalReports).toBe(19);
    });
  });
});
