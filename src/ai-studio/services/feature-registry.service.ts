import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { DEFAULT_FEATURE_REGISTRY_SEEDS } from '../constants/ai-studio.defaults.js';
import { UpdateFeatureRegistryDto } from '../dto/ai-studio.dto.js';
import { AiFeatureStatus } from '../../../generated/prisma/client.js';

@Injectable()
export class FeatureRegistryService implements OnModuleInit {
  private readonly logger = new Logger(FeatureRegistryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.seedDefaultsIfMissing();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(
        `[FeatureRegistry] Initialisation reportée (table absente ou BDD indisponible) : ${msg}`,
      );
    }
  }

  /**
   * Seed strictement idempotent : crée uniquement les entrées inexistantes sans écraser les mises à jour admin.
   */
  async seedDefaultsIfMissing(): Promise<{ created: number }> {
    let created = 0;
    for (const item of DEFAULT_FEATURE_REGISTRY_SEEDS) {
      const existing = await this.prisma.aiFeatureRegistryItem.findUnique({
        where: { key: item.key },
        select: { id: true },
      });
      if (!existing) {
        await this.prisma.aiFeatureRegistryItem.create({
          data: {
            key: item.key,
            nameFr: item.nameFr,
            nameMg: item.nameMg,
            category: item.category,
            status: item.status,
            platforms: item.platforms,
            description: item.description,
            notes: item.notes ?? null,
          },
        });
        created += 1;
      }
    }
    if (created > 0) {
      this.logger.log(
        `[FeatureRegistry] ${created} fonctionnalité(s) initiale(s) enregistrée(s).`,
      );
    }
    return { created };
  }

  async listFeatures(statusFilter?: AiFeatureStatus) {
    return this.prisma.aiFeatureRegistryItem.findMany({
      where: statusFilter ? { status: statusFilter } : undefined,
      orderBy: [{ category: 'asc' }, { nameFr: 'asc' }],
    });
  }

  async updateFeature(
    id: string,
    dto: UpdateFeatureRegistryDto,
    adminUserId: string,
  ) {
    const existing = await this.prisma.aiFeatureRegistryItem.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(
        'Fonctionnalité introuvable dans le registre.',
      );
    }

    return this.prisma.aiFeatureRegistryItem.update({
      where: { id },
      data: {
        ...(dto.nameFr !== undefined ? { nameFr: dto.nameFr.trim() } : {}),
        ...(dto.nameMg !== undefined ? { nameMg: dto.nameMg.trim() } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.platforms !== undefined ? { platforms: dto.platforms } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description.trim() }
          : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes.trim() || null } : {}),
        updatedById: adminUserId,
      },
    });
  }

  /**
   * Construit le bloc de vérité produit injecté dans le System Prompt de Kanto AI.
   */
  async buildPromptContext(): Promise<string> {
    const features = await this.listFeatures();
    if (features.length === 0) {
      return 'REGISTRE PRODUIT VIDE : ne présume aucune fonctionnalité disponible sans vérification.';
    }

    const lines = features.map((f) => {
      const note = f.notes ? ` | Consigne : ${f.notes}` : '';
      return `- [${f.status}] ${f.nameFr} (${f.nameMg}) | Plateformes: ${f.platforms.join(', ')} | ${f.description}${note}`;
    });

    return lines.join('\n');
  }
}
