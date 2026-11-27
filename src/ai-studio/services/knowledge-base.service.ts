import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  AI_PROVIDER_ADAPTER,
  type AiProviderAdapter,
} from '../providers/ai-provider.interface.js';
import { DEFAULT_KNOWLEDGE_DOCUMENTS } from '../constants/ai-studio.defaults.js';
import {
  CreateKnowledgeDocumentDto,
  UpdateKnowledgeDocumentDto,
} from '../dto/ai-studio.dto.js';
import {
  AiKnowledgeStatus,
  AiKnowledgeVisibility,
} from '../../../generated/prisma/client.js';

interface ParsedChunk {
  chunkIndex: number;
  heading: string | null;
  content: string;
  tokenEstimate: number;
}

@Injectable()
export class KnowledgeBaseService implements OnModuleInit {
  private readonly logger = new Logger(KnowledgeBaseService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(AI_PROVIDER_ADAPTER)
    private readonly aiProvider: AiProviderAdapter,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.seedDefaultDocumentsIfMissing();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(
        `[KnowledgeBase] Initialisation reportée (table absente ou BDD indisponible) : ${msg}`,
      );
    }
  }

  /**
   * Seed strictement idempotent : crée uniquement les documents inexistants.
   */
  async seedDefaultDocumentsIfMissing(): Promise<{ created: number }> {
    let created = 0;
    for (const doc of DEFAULT_KNOWLEDGE_DOCUMENTS) {
      const existing = await this.prisma.aiKnowledgeDocument.findUnique({
        where: { slug: doc.slug },
        select: { id: true },
      });
      if (!existing) {
        const record = await this.prisma.aiKnowledgeDocument.create({
          data: {
            slug: doc.slug,
            title: doc.title,
            category: doc.category,
            version: doc.version,
            source: doc.source,
            validationStatus: doc.validationStatus,
            visibilityScope: doc.visibilityScope,
            content: doc.content,
            validatedAt:
              doc.validationStatus === AiKnowledgeStatus.VALIDATED
                ? new Date()
                : null,
          },
        });
        await this.indexDocumentChunks(record.id, record.content);
        created += 1;
      }
    }
    if (created > 0) {
      this.logger.log(
        `[KnowledgeBase] ${created} document(s) fondateur(s) indexé(s).`,
      );
    }
    return { created };
  }

  async listDocuments(filters?: {
    category?: string;
    validationStatus?: AiKnowledgeStatus;
  }) {
    return this.prisma.aiKnowledgeDocument.findMany({
      where: {
        ...(filters?.category ? { category: filters.category } : {}),
        ...(filters?.validationStatus
          ? { validationStatus: filters.validationStatus }
          : {}),
      },
      include: {
        _count: { select: { chunks: true } },
      },
      orderBy: [{ validationStatus: 'asc' }, { updatedAt: 'desc' }],
    });
  }

  async createDocument(dto: CreateKnowledgeDocumentDto, adminUserId: string) {
    const slug = await this.generateUniqueSlug(dto.title);
    const status = dto.validationStatus ?? AiKnowledgeStatus.DRAFT;

    const doc = await this.prisma.aiKnowledgeDocument.create({
      data: {
        slug,
        title: dto.title.trim(),
        category: (dto.category || 'EDITORIAL').trim().toUpperCase(),
        version: (dto.version || '1.0').trim(),
        source: (dto.source || 'Administration Kanto MG').trim(),
        validationStatus: status,
        visibilityScope:
          dto.visibilityScope ?? AiKnowledgeVisibility.ADMIN_ONLY,
        content: dto.content.trim(),
        createdById: adminUserId,
        updatedById: adminUserId,
        validatedAt: status === AiKnowledgeStatus.VALIDATED ? new Date() : null,
      },
    });

    await this.indexDocumentChunks(doc.id, doc.content);
    return this.getDocumentById(doc.id);
  }

  async getDocumentById(id: string) {
    const doc = await this.prisma.aiKnowledgeDocument.findUnique({
      where: { id },
      include: {
        _count: { select: { chunks: true } },
      },
    });
    if (!doc) {
      throw new NotFoundException('Document de connaissances introuvable.');
    }
    return doc;
  }

  async updateDocument(
    id: string,
    dto: UpdateKnowledgeDocumentDto,
    adminUserId: string,
  ) {
    const existing = await this.prisma.aiKnowledgeDocument.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Document de connaissances introuvable.');
    }

    const nextStatus = dto.validationStatus ?? existing.validationStatus;
    const contentChanged =
      dto.content !== undefined && dto.content.trim() !== existing.content;

    const updated = await this.prisma.aiKnowledgeDocument.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.category !== undefined
          ? { category: dto.category.trim().toUpperCase() }
          : {}),
        ...(dto.version !== undefined ? { version: dto.version.trim() } : {}),
        ...(dto.source !== undefined ? { source: dto.source.trim() } : {}),
        ...(dto.validationStatus !== undefined
          ? { validationStatus: dto.validationStatus }
          : {}),
        ...(dto.visibilityScope !== undefined
          ? { visibilityScope: dto.visibilityScope }
          : {}),
        ...(dto.content !== undefined ? { content: dto.content.trim() } : {}),
        updatedById: adminUserId,
        ...(nextStatus === AiKnowledgeStatus.VALIDATED && !existing.validatedAt
          ? { validatedAt: new Date() }
          : {}),
      },
    });

    if (contentChanged) {
      await this.indexDocumentChunks(updated.id, updated.content);
    }

    return this.getDocumentById(updated.id);
  }

  async reindexDocument(id: string) {
    const doc = await this.prisma.aiKnowledgeDocument.findUnique({
      where: { id },
    });
    if (!doc) {
      throw new NotFoundException('Document de connaissances introuvable.');
    }
    const count = await this.indexDocumentChunks(doc.id, doc.content);
    return { documentId: doc.id, chunksIndexed: count };
  }

  async deleteDocument(id: string) {
    const existing = await this.prisma.aiKnowledgeDocument.findUnique({
      where: { id },
      select: { id: true, title: true },
    });
    if (!existing) {
      throw new NotFoundException('Document de connaissances introuvable.');
    }
    await this.prisma.aiKnowledgeDocument.delete({ where: { id } });
    return { deleted: true, id: existing.id, title: existing.title };
  }

  /**
   * Découpe un document Markdown/texte par sections et taille cible (~700 caractères)
   * puis génère les embeddings sémantiques si le fournisseur est actif.
   */
  async indexDocumentChunks(
    documentId: string,
    rawContent: string,
  ): Promise<number> {
    const parsedChunks = this.splitIntoChunks(rawContent);

    const chunkRecords: Array<ParsedChunk & { embedding: number[] }> = [];
    for (const chunk of parsedChunks) {
      const embedding = this.aiProvider.isConfigured()
        ? await this.aiProvider.embedText(
            chunk.heading
              ? `${chunk.heading}\n${chunk.content}`
              : chunk.content,
          )
        : [];
      chunkRecords.push({ ...chunk, embedding });
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.aiKnowledgeChunk.deleteMany({ where: { documentId } });
      if (chunkRecords.length > 0) {
        await tx.aiKnowledgeChunk.createMany({
          data: chunkRecords.map((c) => ({
            documentId,
            chunkIndex: c.chunkIndex,
            heading: c.heading,
            content: c.content,
            tokenEstimate: c.tokenEstimate,
            embedding: c.embedding,
          })),
        });
      }
      await tx.aiKnowledgeDocument.update({
        where: { id: documentId },
        data: { lastIndexedAt: new Date() },
      });
    });

    return chunkRecords.length;
  }

  splitIntoChunks(rawContent: string, maxChars = 750): ParsedChunk[] {
    const normalized = rawContent.replace(/\r\n/g, '\n').trim();
    if (!normalized) return [];

    const lines = normalized.split('\n');
    const sections: Array<{ heading: string | null; text: string }> = [];
    let currentHeading: string | null = null;
    let buffer: string[] = [];

    for (const line of lines) {
      const headingMatch = line.match(/^#{1,3}\s+(.+)$/);
      if (headingMatch) {
        if (buffer.join('\n').trim()) {
          sections.push({
            heading: currentHeading,
            text: buffer.join('\n').trim(),
          });
          buffer = [];
        }
        currentHeading = headingMatch[1].trim();
      } else {
        buffer.push(line);
      }
    }
    if (buffer.join('\n').trim()) {
      sections.push({
        heading: currentHeading,
        text: buffer.join('\n').trim(),
      });
    }

    const chunks: ParsedChunk[] = [];
    let idx = 0;

    for (const sec of sections) {
      const paragraphs = sec.text.split(/\n\s*\n/).filter(Boolean);
      let acc = '';

      for (const p of paragraphs) {
        const candidate = acc ? `${acc}\n\n${p}` : p;
        if (candidate.length > maxChars && acc) {
          chunks.push({
            chunkIndex: idx++,
            heading: sec.heading,
            content: acc,
            tokenEstimate: Math.ceil(acc.length / 4),
          });
          acc = p;
        } else {
          acc = candidate;
        }
      }

      if (acc.trim()) {
        chunks.push({
          chunkIndex: idx++,
          heading: sec.heading,
          content: acc.trim(),
          tokenEstimate: Math.ceil(acc.trim().length / 4),
        });
      }
    }

    return chunks;
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const base = title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);

    const candidate = base || `doc-${Date.now()}`;
    const existing = await this.prisma.aiKnowledgeDocument.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
    return `${candidate}-${Date.now().toString(36).slice(-4)}`;
  }
}
