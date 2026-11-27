import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CreateCampaignDto,
  SaveMarketingDraftDto,
  UpdateMarketingDraftDto,
} from '../dto/ai-studio.dto.js';
import { AiDraftStatus } from '../../../generated/prisma/client.js';

export interface StructuredDeliverable {
  title: string;
  platform: string;
  language: string;
  tone?: string;
  body: string;
  hashtags: string[];
  cta?: string;
  visualConcept?: string;
  visualAspectRatio?: string;
  imagePrompt?: string;
}

@Injectable()
export class MarketingStudioService {
  constructor(private readonly prisma: PrismaService) {}

  async listDrafts(filters?: { status?: AiDraftStatus; platform?: string }) {
    return this.prisma.aiMarketingDraft.findMany({
      where: {
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.platform ? { platform: filters.platform } : {}),
      },
      include: {
        campaign: { select: { id: true, name: true, status: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async saveDraft(dto: SaveMarketingDraftDto, adminUserId: string) {
    return this.prisma.aiMarketingDraft.create({
      data: {
        title: dto.title.trim(),
        platform: dto.platform,
        language: dto.language,
        tone: dto.tone?.trim() || 'EDITORIAL',
        body: dto.body.trim(),
        hashtags: (dto.hashtags || []).map((h) => h.trim()).filter(Boolean),
        cta: dto.cta?.trim() || null,
        visualConcept: dto.visualConcept?.trim() || null,
        visualAspectRatio: dto.visualAspectRatio?.trim() || '4:5',
        imagePrompt: dto.imagePrompt?.trim() || null,
        status: dto.status ?? AiDraftStatus.DRAFT,
        conversationId: dto.conversationId || null,
        sourceMessageId: dto.sourceMessageId || null,
        campaignId: dto.campaignId || null,
        createdById: adminUserId,
        updatedById: adminUserId,
      },
      include: {
        campaign: { select: { id: true, name: true, status: true } },
      },
    });
  }

  async updateDraft(
    id: string,
    dto: UpdateMarketingDraftDto,
    adminUserId: string,
  ) {
    const existing = await this.prisma.aiMarketingDraft.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Brouillon marketing introuvable.');
    }

    return this.prisma.aiMarketingDraft.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.platform !== undefined ? { platform: dto.platform } : {}),
        ...(dto.language !== undefined ? { language: dto.language } : {}),
        ...(dto.tone !== undefined ? { tone: dto.tone?.trim() || null } : {}),
        ...(dto.body !== undefined ? { body: dto.body.trim() } : {}),
        ...(dto.hashtags !== undefined
          ? {
              hashtags: dto.hashtags.map((h) => h.trim()).filter(Boolean),
            }
          : {}),
        ...(dto.cta !== undefined ? { cta: dto.cta?.trim() || null } : {}),
        ...(dto.visualConcept !== undefined
          ? { visualConcept: dto.visualConcept?.trim() || null }
          : {}),
        ...(dto.visualAspectRatio !== undefined
          ? { visualAspectRatio: dto.visualAspectRatio?.trim() || null }
          : {}),
        ...(dto.imagePrompt !== undefined
          ? { imagePrompt: dto.imagePrompt?.trim() || null }
          : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.campaignId !== undefined
          ? { campaignId: dto.campaignId || null }
          : {}),
        updatedById: adminUserId,
      },
      include: {
        campaign: { select: { id: true, name: true, status: true } },
      },
    });
  }

  async deleteDraft(id: string) {
    const existing = await this.prisma.aiMarketingDraft.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Brouillon marketing introuvable.');
    }
    await this.prisma.aiMarketingDraft.delete({ where: { id } });
    return { deleted: true, id };
  }

  async listCampaigns() {
    return this.prisma.aiMarketingCampaign.findMany({
      include: {
        _count: { select: { drafts: true, conversations: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async createCampaign(dto: CreateCampaignDto, adminUserId: string) {
    return this.prisma.aiMarketingCampaign.create({
      data: {
        name: dto.name.trim(),
        objective: dto.objective.trim(),
        description: dto.description?.trim() || null,
        targetAudience: dto.targetAudience?.trim() || null,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        platforms: dto.platforms ?? [],
        status: dto.status,
        createdById: adminUserId,
        updatedById: adminUserId,
      },
    });
  }

  /**
   * Extrait un bloc livrable structuré s'il est présent dans la réponse de Kanto AI
   * et retourne le texte conversationnel nettoyé pour l'affichage chat.
   */
  extractDeliverableFromReply(rawReply: string): {
    cleanText: string;
    deliverable: StructuredDeliverable | null;
  } {
    const blockRegex =
      /```kanto-deliverable\s*([\s\S]*?)\s*```|<!--KANTO_DELIVERABLE_JSON-->([\s\S]*?)<!--\/KANTO_DELIVERABLE_JSON-->/i;
    const match = rawReply.match(blockRegex);
    if (!match) {
      return { cleanText: rawReply.trim(), deliverable: null };
    }

    const jsonCandidate = (match[1] || match[2] || '').trim();
    const cleanText = rawReply.replace(blockRegex, '').trim();

    try {
      const parsed = JSON.parse(jsonCandidate) as Record<string, unknown>;
      if (typeof parsed.body !== 'string' || !parsed.body.trim()) {
        return { cleanText, deliverable: null };
      }
      return {
        cleanText,
        deliverable: {
          title:
            typeof parsed.title === 'string' && parsed.title.trim()
              ? parsed.title.trim()
              : 'Proposition éditoriale Kanto MG',
          platform:
            typeof parsed.platform === 'string' && parsed.platform.trim()
              ? parsed.platform.trim().toUpperCase()
              : 'FACEBOOK',
          language:
            typeof parsed.language === 'string' && parsed.language.trim()
              ? parsed.language.trim().toUpperCase()
              : 'FR',
          tone:
            typeof parsed.tone === 'string' ? parsed.tone.trim() : undefined,
          body: parsed.body.trim(),
          hashtags: Array.isArray(parsed.hashtags)
            ? parsed.hashtags
                .filter((h): h is string => typeof h === 'string')
                .map((h) => h.trim())
                .filter(Boolean)
            : [],
          cta: typeof parsed.cta === 'string' ? parsed.cta.trim() : undefined,
          visualConcept:
            typeof parsed.visualConcept === 'string'
              ? parsed.visualConcept.trim()
              : undefined,
          visualAspectRatio:
            typeof parsed.visualAspectRatio === 'string'
              ? parsed.visualAspectRatio.trim()
              : '4:5',
          imagePrompt:
            typeof parsed.imagePrompt === 'string'
              ? parsed.imagePrompt.trim()
              : undefined,
        },
      };
    } catch {
      return { cleanText, deliverable: null };
    }
  }
}
