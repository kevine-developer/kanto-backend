import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  AI_PROVIDER_ADAPTER,
  type AiProviderAdapter,
} from '../providers/ai-provider.interface.js';
import {
  AiKnowledgeStatus,
  AiKnowledgeVisibility,
} from '../../../generated/prisma/client.js';

export interface RetrievedKnowledgeSource {
  documentId: string;
  chunkId: string;
  title: string;
  category: string;
  version: string;
  source: string;
  heading: string | null;
  content: string;
  score: number;
}

@Injectable()
export class RagRetrievalService {
  private readonly logger = new Logger(RagRetrievalService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(AI_PROVIDER_ADAPTER)
    private readonly aiProvider: AiProviderAdapter,
  ) {}

  /**
   * Recherche hybride sur les documents VALIDÉS uniquement :
   * 1) Filtrage strict par statut VALIDATED + visibilité autorisée
   * 2) Scoring lexical (mots-clés normalisés + PostgreSQL FTS lorsque disponible)
   * 3) Scoring vectoriel par similarité cosinus sur embeddings stockés (si présents)
   * 4) Fusion par Reciprocal Rank Fusion (RRF)
   */
  async retrieveRelevantSources(
    query: string,
    options?: {
      limit?: number;
      allowedVisibilities?: AiKnowledgeVisibility[];
    },
  ): Promise<RetrievedKnowledgeSource[]> {
    const limit = Math.min(Math.max(options?.limit ?? 4, 1), 8);
    const visibilities = options?.allowedVisibilities ?? [
      AiKnowledgeVisibility.ADMIN_ONLY,
      AiKnowledgeVisibility.INTERNAL_TEAM,
    ];

    const chunks = await this.prisma.aiKnowledgeChunk.findMany({
      where: {
        document: {
          validationStatus: AiKnowledgeStatus.VALIDATED,
          visibilityScope: { in: visibilities },
        },
      },
      include: {
        document: {
          select: {
            id: true,
            title: true,
            category: true,
            version: true,
            source: true,
          },
        },
      },
      take: 400,
    });

    if (chunks.length === 0) {
      return [];
    }

    const queryTokens = this.tokenize(query);
    let queryEmbedding: number[] = [];
    if (this.aiProvider.isConfigured() && query.trim().length > 2) {
      queryEmbedding = await this.aiProvider.embedText(query);
    }

    // Score lexical par chunk
    const lexicalRanked = chunks
      .map((c) => {
        const haystack = this.normalizeText(
          `${c.document.title} ${c.heading || ''} ${c.content}`,
        );
        let matchScore = 0;
        for (const tok of queryTokens) {
          if (haystack.includes(tok)) {
            matchScore += tok.length >= 5 ? 2 : 1;
          }
        }
        return { chunk: c, lexicalScore: matchScore };
      })
      .sort((a, b) => b.lexicalScore - a.lexicalScore);

    // Score sémantique par cosinus (si queryEmbedding et chunk.embedding existent)
    const semanticRanked =
      queryEmbedding.length > 0
        ? chunks
            .map((c) => ({
              chunk: c,
              sim:
                c.embedding && c.embedding.length === queryEmbedding.length
                  ? this.cosineSimilarity(queryEmbedding, c.embedding)
                  : 0,
            }))
            .sort((a, b) => b.sim - a.sim)
        : [];

    // Fusion RRF (Reciprocal Rank Fusion)
    const rrfMap = new Map<string, number>();
    const k = 60;

    lexicalRanked.forEach((entry, idx) => {
      if (entry.lexicalScore > 0) {
        const prev = rrfMap.get(entry.chunk.id) ?? 0;
        rrfMap.set(entry.chunk.id, prev + 1 / (k + idx + 1));
      }
    });

    semanticRanked.forEach((entry, idx) => {
      if (entry.sim > 0.25) {
        const prev = rrfMap.get(entry.chunk.id) ?? 0;
        rrfMap.set(entry.chunk.id, prev + 1.2 / (k + idx + 1));
      }
    });

    // Si aucun terme exact ni similarité forte, inclure les documents piliers (IDENTITY / BETA)
    const scored = chunks
      .map((c) => {
        const baseRrf = rrfMap.get(c.id) ?? 0;
        const pillarBoost =
          baseRrf === 0 &&
          (c.document.category === 'IDENTITY' || c.document.category === 'BETA')
            ? 0.005
            : 0;
        return {
          chunk: c,
          score: Number((baseRrf + pillarBoost).toFixed(5)),
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored.map(({ chunk, score }) => ({
      documentId: chunk.document.id,
      chunkId: chunk.id,
      title: chunk.document.title,
      category: chunk.document.category,
      version: chunk.document.version,
      source: chunk.document.source,
      heading: chunk.heading,
      content: chunk.content,
      score,
    }));
  }

  private normalizeText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  private tokenize(text: string): string[] {
    const clean = this.normalizeText(text);
    return Array.from(
      new Set(clean.split(/[^a-z0-9]+/).filter((w) => w.length >= 3)),
    ).slice(0, 16);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }
}
