import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard, Roles, Session, type UserSession } from '../auth/index.js';
import { AdminAuditService } from '../admin/admin-audit.service.js';
import { ConversationService } from './services/conversation.service.js';
import { KnowledgeBaseService } from './services/knowledge-base.service.js';
import { FeatureRegistryService } from './services/feature-registry.service.js';
import { MarketingStudioService } from './services/marketing-studio.service.js';
import { UsageAndCostService } from './services/usage-cost.service.js';
import {
  CreateCampaignDto,
  CreateConversationDto,
  CreateKnowledgeDocumentDto,
  SaveMarketingDraftDto,
  SendChatMessageDto,
  UpdateConversationDto,
  UpdateFeatureRegistryDto,
  UpdateKnowledgeDocumentDto,
  UpdateMarketingDraftDto,
} from './dto/ai-studio.dto.js';
import {
  AiDraftStatus,
  AiFeatureStatus,
  AiKnowledgeStatus,
} from '../../generated/prisma/client.js';

@Controller('admin/ai')
@UseGuards(AuthGuard)
@Roles(['ADMIN', 'admin'])
export class AiStudioController {
  constructor(
    private readonly conversations: ConversationService,
    private readonly knowledgeBase: KnowledgeBaseService,
    private readonly featureRegistry: FeatureRegistryService,
    private readonly marketingStudio: MarketingStudioService,
    private readonly usageCost: UsageAndCostService,
    private readonly auditService: AdminAuditService,
  ) {}

  // ─── CONVERSATIONS & STREAMING SSE ─────────────────────────────────────────

  @Get('conversations')
  listConversations(
    @Session() session: UserSession,
    @Query('search') search?: string,
  ) {
    return this.conversations.listConversations(session.user.id, search);
  }

  @Post('conversations')
  createConversation(
    @Session() session: UserSession,
    @Body() dto: CreateConversationDto,
  ) {
    return this.conversations.createConversation(
      session.user.id,
      session.user.email,
      dto,
    );
  }

  @Get('conversations/:id')
  getConversation(@Session() session: UserSession, @Param('id') id: string) {
    return this.conversations.getConversation(id, session.user.id);
  }

  @Patch('conversations/:id')
  updateConversation(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() dto: UpdateConversationDto,
  ) {
    return this.conversations.updateConversation(id, session.user.id, dto);
  }

  @Delete('conversations/:id')
  deleteConversation(@Session() session: UserSession, @Param('id') id: string) {
    return this.conversations.deleteConversation(id, session.user.id);
  }

  @Post('conversations/:id/messages/stream')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  async streamMessage(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() dto: SendChatMessageDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    this.initSseHeaders(res);
    const controller = new AbortController();
    req.on('close', () => controller.abort());

    const emit = (event: string, data: unknown) => {
      if (!res.writableEnded) {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      }
    };

    await this.conversations.streamUserMessage({
      conversationId: id,
      adminUserId: session.user.id,
      dto,
      emit,
      signal: controller.signal,
    });

    if (!res.writableEnded) {
      res.end();
    }
  }

  @Post('conversations/:id/regenerate')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  async regenerateReply(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() body: { model?: string },
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    this.initSseHeaders(res);
    const controller = new AbortController();
    req.on('close', () => controller.abort());

    const emit = (event: string, data: unknown) => {
      if (!res.writableEnded) {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      }
    };

    await this.conversations.regenerateLastReply({
      conversationId: id,
      adminUserId: session.user.id,
      model: body?.model,
      emit,
      signal: controller.signal,
    });

    if (!res.writableEnded) {
      res.end();
    }
  }

  // ─── KNOWLEDGE BASE RAG ────────────────────────────────────────────────────

  @Get('knowledge')
  listKnowledge(
    @Query('category') category?: string,
    @Query('validationStatus') validationStatus?: AiKnowledgeStatus,
  ) {
    return this.knowledgeBase.listDocuments({ category, validationStatus });
  }

  @Post('knowledge')
  async createKnowledge(
    @Session() session: UserSession,
    @Body() dto: CreateKnowledgeDocumentDto,
  ) {
    const doc = await this.knowledgeBase.createDocument(dto, session.user.id);
    await this.auditService.logAction({
      userId: session.user.id,
      userName: session.user.email,
      action: 'AI_KNOWLEDGE_CREATED',
      targetType: 'AI_KNOWLEDGE_DOC',
      targetId: doc.id,
      targetLabel: doc.title,
    });
    return doc;
  }

  @Patch('knowledge/:id')
  async updateKnowledge(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() dto: UpdateKnowledgeDocumentDto,
  ) {
    const doc = await this.knowledgeBase.updateDocument(
      id,
      dto,
      session.user.id,
    );
    await this.auditService.logAction({
      userId: session.user.id,
      userName: session.user.email,
      action: 'AI_KNOWLEDGE_UPDATED',
      targetType: 'AI_KNOWLEDGE_DOC',
      targetId: doc.id,
      targetLabel: doc.title,
    });
    return doc;
  }

  @Post('knowledge/:id/reindex')
  reindexKnowledge(@Param('id') id: string) {
    return this.knowledgeBase.reindexDocument(id);
  }

  @Delete('knowledge/:id')
  async deleteKnowledge(
    @Session() session: UserSession,
    @Param('id') id: string,
  ) {
    const result = await this.knowledgeBase.deleteDocument(id);
    await this.auditService.logAction({
      userId: session.user.id,
      userName: session.user.email,
      action: 'AI_KNOWLEDGE_DELETED',
      targetType: 'AI_KNOWLEDGE_DOC',
      targetId: id,
      targetLabel: result.title,
    });
    return result;
  }

  // ─── REGISTRE DES FONCTIONNALITÉS PRODUIT ──────────────────────────────────

  @Get('features')
  listFeatures(@Query('status') status?: AiFeatureStatus) {
    return this.featureRegistry.listFeatures(status);
  }

  @Patch('features/:id')
  async updateFeature(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() dto: UpdateFeatureRegistryDto,
  ) {
    const updated = await this.featureRegistry.updateFeature(
      id,
      dto,
      session.user.id,
    );
    await this.auditService.logAction({
      userId: session.user.id,
      userName: session.user.email,
      action: 'AI_FEATURE_REGISTRY_UPDATED',
      targetType: 'AI_FEATURE',
      targetId: updated.id,
      targetLabel: `${updated.key} (${updated.status})`,
    });
    return updated;
  }

  // ─── BROUILLONS & CAMPAGNES MARKETING ──────────────────────────────────────

  @Get('drafts')
  listDrafts(
    @Query('status') status?: AiDraftStatus,
    @Query('platform') platform?: string,
  ) {
    return this.marketingStudio.listDrafts({ status, platform });
  }

  @Post('drafts')
  async saveDraft(
    @Session() session: UserSession,
    @Body() dto: SaveMarketingDraftDto,
  ) {
    const draft = await this.marketingStudio.saveDraft(dto, session.user.id);
    await this.auditService.logAction({
      userId: session.user.id,
      userName: session.user.email,
      action: 'AI_DRAFT_CREATED',
      targetType: 'AI_MARKETING_DRAFT',
      targetId: draft.id,
      targetLabel: `${draft.title} (${draft.platform})`,
    });
    return draft;
  }

  @Patch('drafts/:id')
  updateDraft(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() dto: UpdateMarketingDraftDto,
  ) {
    return this.marketingStudio.updateDraft(id, dto, session.user.id);
  }

  @Delete('drafts/:id')
  deleteDraft(@Param('id') id: string) {
    return this.marketingStudio.deleteDraft(id);
  }

  @Get('campaigns')
  listCampaigns() {
    return this.marketingStudio.listCampaigns();
  }

  @Post('campaigns')
  createCampaign(
    @Session() session: UserSession,
    @Body() dto: CreateCampaignDto,
  ) {
    return this.marketingStudio.createCampaign(dto, session.user.id);
  }

  // ─── USAGE & COÛTS IA ──────────────────────────────────────────────────────

  @Get('usage/summary')
  getUsageSummary(
    @Session() session: UserSession,
    @Query('days') days?: string,
  ) {
    const parsedDays = days ? parseInt(days, 10) : 30;
    return this.usageCost.getUsageSummary(
      session.user.id,
      Number.isFinite(parsedDays) ? parsedDays : 30,
    );
  }

  private initSseHeaders(res: Response) {
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    if (typeof res.flushHeaders === 'function') {
      res.flushHeaders();
    }
  }
}
