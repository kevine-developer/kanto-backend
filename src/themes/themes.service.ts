import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ThemesService {
  private readonly logger = new Logger(ThemesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const themes = await this.prisma.theme.findMany({
      orderBy: { nameFr: 'asc' },
      include: {
        _count: {
          select: {
            items: true,
            citations: true,
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
}
