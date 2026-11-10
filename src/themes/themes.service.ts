import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';

export interface FilterOptionDto {
  id: string;
  label: string;
  labelMg?: string;
  count?: number;
}

export interface FilterGroupDto {
  id: string;
  title: string;
  titleMg: string;
  type: 'multi' | 'single';
  options: FilterOptionDto[];
}

export interface CategoryFilterOptionsDto {
  category: string;
  groups: FilterGroupDto[];
}

const FILTER_CACHE_TTL = 600; // 10 minutes

@Injectable()
export class ThemesService {
  private readonly logger = new Logger(ThemesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAll() {
    const themes = await this.prisma.theme.findMany({
      orderBy: { nameFr: 'asc' },
      include: {
        _count: {
          select: {
            items: true,
            citations: true,
            contes: true,
            kabaries: true,
          },
        },
      },
    });

    this.logger.log(
      `🎨 [Themes] Liste des thèmes récupérée (${themes.length} thèmes)`,
    );

    return themes;
  }

  async findOne(slug: string) {
    const theme = await this.prisma.theme.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            items: true,
            citations: true,
            contes: true,
            kabaries: true,
          },
        },
      },
    });

    if (!theme) {
      this.logger.warn(`⚠️ [Themes] Thème avec le slug "${slug}" non trouvé`);
      throw new NotFoundException(`Thème avec le slug "${slug}" non trouvé`);
    }

    this.logger.log(
      `🎨 [Themes] Consultation du thème "${theme.nameFr}" (${slug})`,
    );

    return theme;
  }

  /**
   * Retourne les options de filtres dynamiques (thèmes, origines, auteurs, etc.)
   * associées à une catégorie donnée, avec les comptages réels en base.
   */
  async getFilterOptions(category: string): Promise<CategoryFilterOptionsDto> {
    const normalized = (category || '').toLowerCase().trim();
    const cacheKey = `kanto:themes:filter-options:${normalized}`;

    try {
      const cached = await this.redis.get<CategoryFilterOptionsDto>(cacheKey);
      if (cached) {
        return cached;
      }
    } catch {
      // Ignorer erreur de lecture Redis non-bloquante
    }

    const groups: FilterGroupDto[] = [];

    if (
      normalized === 'proverbe' ||
      normalized === 'proverb' ||
      normalized === 'expression' ||
      normalized === 'dicton' ||
      normalized === 'items' ||
      normalized === 'ohabolana'
    ) {
      const itemCategory =
        normalized === 'proverbe' || normalized === 'proverb' || normalized === 'ohabolana'
          ? 'PROVERBE'
          : normalized === 'expression'
          ? 'EXPRESSION'
          : normalized === 'dicton'
          ? 'DICTON'
          : undefined;

      // 1. Thèmes avec comptage
      const themes = await this.prisma.theme.findMany({
        where: {
          items: {
            some: {
              item: {
                status: 'PUBLISHED',
                ...(itemCategory ? { category: itemCategory } : {}),
              },
            },
          },
        },
        select: {
          slug: true,
          nameFr: true,
          nameMg: true,
          _count: {
            select: {
              items: {
                where: {
                  item: {
                    status: 'PUBLISHED',
                    ...(itemCategory ? { category: itemCategory } : {}),
                  },
                },
              },
            },
          },
        },
        orderBy: { nameFr: 'asc' },
      });

      groups.push({
        id: 'themes',
        title: 'Thèmes',
        titleMg: 'Lohahevitra',
        type: 'multi',
        options: themes.map((t) => ({
          id: t.slug,
          label: t.nameFr,
          labelMg: t.nameMg,
          count: t._count.items,
        })),
      });

      // 2. Origines régionales existantes
      const itemsOrigins = await this.prisma.malagasyItem.findMany({
        where: {
          status: 'PUBLISHED',
          ...(itemCategory ? { category: itemCategory } : {}),
        },
        select: { origins: true },
      });

      const originCountMap = new Map<string, number>();
      itemsOrigins.forEach((item) => {
        if (Array.isArray(item.origins)) {
          item.origins.forEach((o) => {
            const trimmed = o.trim();
            if (trimmed && trimmed.toLowerCase() !== 'tous') {
              originCountMap.set(trimmed, (originCountMap.get(trimmed) || 0) + 1);
            }
          });
        }
      });

      if (originCountMap.size > 0) {
        const sortedOrigins = Array.from(originCountMap.entries())
          .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
          .map(([origin, count]) => ({
            id: origin,
            label: origin,
            count,
          }));

        groups.push({
          id: 'origins',
          title: 'Origines & Régions',
          titleMg: 'Fiaviana sy Faritra',
          type: 'multi',
          options: sortedOrigins,
        });
      }

      // 3. Niveaux de difficulté
      groups.push({
        id: 'difficulty',
        title: 'Niveau de langue',
        titleMg: 'Haavon\'ny fiteny',
        type: 'single',
        options: [
          { id: 'EASY', label: 'Courant / Débutant', labelMg: 'Mora / Fanombohana' },
          { id: 'MEDIUM', label: 'Intermédiaire', labelMg: 'Antonony' },
          { id: 'HARD', label: 'Littéraire / Ancien', labelMg: 'Sarotra / Ntaolo' },
        ],
      });
    } else if (normalized === 'citation' || normalized === 'citations') {
      // 1. Thèmes des citations
      const themes = await this.prisma.theme.findMany({
        where: {
          citations: {
            some: {
              citation: {
                status: 'PUBLISHED',
              },
            },
          },
        },
        select: {
          slug: true,
          nameFr: true,
          nameMg: true,
          _count: {
            select: {
              citations: {
                where: {
                  citation: {
                    status: 'PUBLISHED',
                  },
                },
              },
            },
          },
        },
        orderBy: { nameFr: 'asc' },
      });

      groups.push({
        id: 'themes',
        title: 'Thèmes',
        titleMg: 'Lohahevitra',
        type: 'multi',
        options: themes.map((t) => ({
          id: t.slug,
          label: t.nameFr,
          labelMg: t.nameMg,
          count: t._count.citations,
        })),
      });

      // 2. Auteurs de citations
      const authors = await this.prisma.author.findMany({
        where: {
          citations: {
            some: {
              status: 'PUBLISHED',
            },
          },
        },
        select: {
          name: true,
          _count: {
            select: {
              citations: {
                where: { status: 'PUBLISHED' },
              },
            },
          },
        },
        orderBy: { name: 'asc' },
      });

      if (authors.length > 0) {
        groups.push({
          id: 'authors',
          title: 'Auteurs & Penseurs',
          titleMg: 'Mpanoratra sy Olon-kendry',
          type: 'multi',
          options: authors.map((a) => ({
            id: a.name,
            label: a.name,
            count: a._count.citations,
          })),
        });
      }
    } else if (normalized === 'conte' || normalized === 'contes' || normalized === 'angano') {
      // 1. Thèmes des contes
      const themes = await this.prisma.theme.findMany({
        where: {
          contes: {
            some: {
              conte: {
                status: 'PUBLISHED',
              },
            },
          },
        },
        select: {
          slug: true,
          nameFr: true,
          nameMg: true,
          _count: {
            select: {
              contes: {
                where: {
                  conte: {
                    status: 'PUBLISHED',
                  },
                },
              },
            },
          },
        },
        orderBy: { nameFr: 'asc' },
      });

      groups.push({
        id: 'themes',
        title: 'Thèmes & Morale',
        titleMg: 'Lohahevitra sy Lesona',
        type: 'multi',
        options: themes.map((t) => ({
          id: t.slug,
          label: t.nameFr,
          labelMg: t.nameMg,
          count: t._count.contes,
        })),
      });
    } else if (normalized === 'kabary' || normalized === 'discours') {
      // 1. Occasions traditionnelles
      const kabaryList = await this.prisma.kabary.findMany({
        where: { status: 'PUBLISHED' },
        select: { occasion: true, occasionFr: true },
      });

      const occasionMap = new Map<string, { labelFr?: string; count: number }>();
      kabaryList.forEach((k) => {
        const occ = (k.occasion || '').trim();
        if (occ) {
          const existing = occasionMap.get(occ);
          if (existing) {
            existing.count += 1;
          } else {
            occasionMap.set(occ, { labelFr: k.occasionFr || undefined, count: 1 });
          }
        }
      });

      if (occasionMap.size > 0) {
        groups.push({
          id: 'occasions',
          title: 'Occasions & Rituels',
          titleMg: 'Fotoana sy Lanonana',
          type: 'multi',
          options: Array.from(occasionMap.entries())
            .sort((a, b) => b[1].count - a[1].count)
            .map(([occ, data]) => ({
              id: occ,
              label: data.labelFr ? `${occ} (${data.labelFr})` : occ,
              labelMg: occ,
              count: data.count,
            })),
        });
      }

      // 2. Thèmes de kabary
      const themes = await this.prisma.theme.findMany({
        where: {
          kabaries: {
            some: {
              kabary: {
                status: 'PUBLISHED',
              },
            },
          },
        },
        select: {
          slug: true,
          nameFr: true,
          nameMg: true,
          _count: {
            select: {
              kabaries: {
                where: {
                  kabary: {
                    status: 'PUBLISHED',
                  },
                },
              },
            },
          },
        },
        orderBy: { nameFr: 'asc' },
      });

      if (themes.length > 0) {
        groups.push({
          id: 'themes',
          title: 'Thèmes abordés',
          titleMg: 'Lohahevitra',
          type: 'multi',
          options: themes.map((t) => ({
            id: t.slug,
            label: t.nameFr,
            labelMg: t.nameMg,
            count: t._count.kabaries,
          })),
        });
      }

      // 3. Régions
      const regionsList = await this.prisma.kabary.findMany({
        where: { status: 'PUBLISHED', region: { not: null } },
        select: { region: true },
      });

      const regionMap = new Map<string, number>();
      regionsList.forEach((k) => {
        const r = (k.region || '').trim();
        if (r) {
          regionMap.set(r, (regionMap.get(r) || 0) + 1);
        }
      });

      if (regionMap.size > 0) {
        groups.push({
          id: 'regions',
          title: 'Régions',
          titleMg: 'Faritra',
          type: 'multi',
          options: Array.from(regionMap.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([region, count]) => ({
              id: region,
              label: region,
              count,
            })),
        });
      }
    } else if (normalized === 'poesie' || normalized === 'poesies' || normalized === 'tononkalo') {
      // 1. Genres / Catégories de poésie
      const poesies = await this.prisma.poesie.findMany({
        where: { status: 'PUBLISHED' },
        select: { category: true, author: true, period: true },
      });

      const catMap = new Map<string, number>();
      const authorMap = new Map<string, number>();
      const periodMap = new Map<string, number>();

      poesies.forEach((p) => {
        if (p.category) {
          const c = p.category.trim();
          catMap.set(c, (catMap.get(c) || 0) + 1);
        }
        if (p.author) {
          const a = p.author.trim();
          authorMap.set(a, (authorMap.get(a) || 0) + 1);
        }
        if (p.period) {
          const per = p.period.trim();
          periodMap.set(per, (periodMap.get(per) || 0) + 1);
        }
      });

      if (catMap.size > 0) {
        groups.push({
          id: 'categories',
          title: 'Formes poétiques',
          titleMg: 'Karazan-tononkalo',
          type: 'multi',
          options: Array.from(catMap.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([cat, count]) => ({
              id: cat,
              label: cat === 'tononkalo' ? 'Tononkalo (Poésie)' : cat === 'hainteny' ? 'Hainteny' : cat,
              count,
            })),
        });
      }

      if (authorMap.size > 0) {
        groups.push({
          id: 'authors',
          title: 'Poètes & Auteurs',
          titleMg: 'Mpanoratra & Poeta',
          type: 'multi',
          options: Array.from(authorMap.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([author, count]) => ({
              id: author,
              label: author,
              count,
            })),
        });
      }

      if (periodMap.size > 0) {
        groups.push({
          id: 'periods',
          title: 'Époques & Siècles',
          titleMg: 'Vanim-potoana',
          type: 'multi',
          options: Array.from(periodMap.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([period, count]) => ({
              id: period,
              label: period,
              count,
            })),
        });
      }
    } else if (normalized === 'recitation' || normalized === 'recitations' || normalized === 'tsianjery') {
      const recitations = await this.prisma.recitation.findMany({
        where: { status: 'PUBLISHED' },
        select: { author: true, tags: true },
      });

      const authorMap = new Map<string, number>();
      const tagMap = new Map<string, number>();

      recitations.forEach((r) => {
        if (r.author) {
          const a = r.author.trim();
          authorMap.set(a, (authorMap.get(a) || 0) + 1);
        }
        if (Array.isArray(r.tags)) {
          r.tags.forEach((t) => {
            const tag = t.trim();
            if (tag) {
              tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
            }
          });
        }
      });

      if (authorMap.size > 0) {
        groups.push({
          id: 'authors',
          title: 'Auteurs',
          titleMg: 'Mpanoratra',
          type: 'multi',
          options: Array.from(authorMap.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([author, count]) => ({
              id: author,
              label: author,
              count,
            })),
        });
      }

      if (tagMap.size > 0) {
        groups.push({
          id: 'tags',
          title: 'Thèmes & Étiquettes',
          titleMg: 'Lohahevitra & Marika',
          type: 'multi',
          options: Array.from(tagMap.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([tag, count]) => ({
              id: tag,
              label: tag,
              count,
            })),
        });
      }
    }

    const response: CategoryFilterOptionsDto = {
      category: normalized,
      groups,
    };

    try {
      await this.redis.set(cacheKey, response, FILTER_CACHE_TTL);
    } catch {
      // Ignorer erreur cache Redis
    }

    return response;
  }
}
