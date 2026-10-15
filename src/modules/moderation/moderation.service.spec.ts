import { describe, it, expect, beforeEach } from '@jest/globals';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ModerationService } from './moderation.service.js';
import { ContentModerationService } from './content-moderation.service.js';
import {
  createPrismaMock,
  type PrismaMock,
} from '../../test-utils/mock-prisma.factory.js';
import { ReportReason } from '../../../generated/prisma/client.js';

describe('ModerationService', () => {
  let service: ModerationService;
  let prismaMock: PrismaMock;
  let textModeration: ContentModerationService;

  beforeEach(() => {
    prismaMock = createPrismaMock();
    textModeration = new ContentModerationService();
    service = new ModerationService(prismaMock as any, textModeration);
  });

  describe('reportContent', () => {
    it('lève BadRequestException si aucune cible n’est spécifiée', async () => {
      await expect(
        service.reportContent({
          reason: ReportReason.INAPPROPRIATE,
          description: 'Contenu blessant',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('enregistre avec succès un signalement pour un proverbe/expression (itemId)', async () => {
      prismaMock.contentReport.create.mockResolvedValue({
        id: 'rep_123',
        itemId: 'item_456',
        userId: 'user_789',
        reason: 'TRANSLATION_ERROR',
        description: 'Sens inexact',
        resolved: false,
        createdAt: new Date(),
      });

      const result = await service.reportContent(
        {
          itemId: 'item_456',
          reason: ReportReason.TRANSLATION_ERROR,
          description: 'Sens inexact',
        },
        'user_789',
      );

      expect(result.success).toBe(true);
      expect(result.reportId).toBe('rep_123');
      expect(prismaMock.contentReport.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          itemId: 'item_456',
          userId: 'user_789',
          reason: 'TRANSLATION_ERROR',
          description: 'Sens inexact',
        }),
      });
    });

    it('préfixe automatiquement la description pour les contributions communautaires', async () => {
      prismaMock.contentReport.create.mockResolvedValue({
        id: 'rep_contrib',
        userId: 'user_1',
        reason: 'SPAM',
        description: '[CONTRIBUTION:contrib_99] Spam publicitaire',
        resolved: false,
        createdAt: new Date(),
      });

      const result = await service.reportContent(
        {
          contributionId: 'contrib_99',
          reason: ReportReason.SPAM,
          description: 'Spam publicitaire',
        },
        'user_1',
      );

      expect(result.success).toBe(true);
      expect(prismaMock.contentReport.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          description: '[CONTRIBUTION:contrib_99] Spam publicitaire',
          reason: 'SPAM',
        }),
      });
    });
  });

  describe('getReports & resolveReport', () => {
    it('récupère la liste des signalements non résolus par défaut', async () => {
      prismaMock.contentReport.findMany.mockResolvedValue([
        { id: 'r1', reason: 'INAPPROPRIATE', resolved: false },
      ]);
      prismaMock.contentReport.count.mockResolvedValue(1);

      const result = await service.getReports();

      expect(result.reports).toHaveLength(1);
      expect(result.total).toBe(1);
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
      expect(prismaMock.contentReport.update).toHaveBeenCalledWith({
        where: { id: 'rep_1' },
        data: { resolved: true },
      });
    });
  });

  describe('getModerationStats & analyzeContent', () => {
    it('calcule correctement les statistiques de modération', async () => {
      prismaMock.contentReport.count
        .mockResolvedValueOnce(5) // pending
        .mockResolvedValueOnce(12) // resolved
        .mockResolvedValueOnce(17); // total

      const stats = await service.getModerationStats();

      expect(stats.pendingReports).toBe(5);
      expect(stats.resolvedReports).toBe(12);
      expect(stats.totalReports).toBe(17);
    });

    it('analyse et signale le contenu textuel offensant', () => {
      const cleanResult = service.analyzeContent({
        title: 'Misaotra betsaka',
        meaning: 'Merci beaucoup',
      });
      expect(cleanResult.isFlagged).toBe(false);

      const flaggedResult = service.analyzeContent({
        content: 'Ity olona ity dia tena biby sy alika maika',
      });
      expect(flaggedResult.isFlagged).toBe(true);
    });
  });
});
