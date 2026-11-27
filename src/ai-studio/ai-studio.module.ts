import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module.js';
import { AI_PROVIDER_ADAPTER } from './providers/ai-provider.interface.js';
import { GeminiAiProviderAdapter } from './providers/gemini-ai-provider.adapter.js';
import { FeatureRegistryService } from './services/feature-registry.service.js';
import { KnowledgeBaseService } from './services/knowledge-base.service.js';
import { RagRetrievalService } from './services/rag-retrieval.service.js';
import { AiToolExecutorService } from './services/ai-tool-executor.service.js';
import { UsageAndCostService } from './services/usage-cost.service.js';
import { MarketingStudioService } from './services/marketing-studio.service.js';
import { ConversationService } from './services/conversation.service.js';
import { AiStudioController } from './ai-studio.controller.js';

@Module({
  imports: [AdminModule],
  controllers: [AiStudioController],
  providers: [
    GeminiAiProviderAdapter,
    {
      provide: AI_PROVIDER_ADAPTER,
      useExisting: GeminiAiProviderAdapter,
    },
    FeatureRegistryService,
    KnowledgeBaseService,
    RagRetrievalService,
    AiToolExecutorService,
    UsageAndCostService,
    MarketingStudioService,
    ConversationService,
  ],
  exports: [
    AI_PROVIDER_ADAPTER,
    FeatureRegistryService,
    KnowledgeBaseService,
    RagRetrievalService,
    UsageAndCostService,
    MarketingStudioService,
  ],
})
export class AiStudioModule {}
