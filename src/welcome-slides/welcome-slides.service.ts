import {
  Injectable,
  NotFoundException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreateWelcomeSlideDto,
  UpdateWelcomeSlideDto,
  ReorderWelcomeSlidesDto,
} from './dto/welcome-slide.dto.js';
import { DEFAULT_WELCOME_SLIDES } from './constants/default-welcome-slides.constant.js';

@Injectable()
export class WelcomeSlidesService implements OnModuleInit {
  private readonly logger = new Logger(WelcomeSlidesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDefaultsIfEmpty();
  }

  /**
   * Initialise les 7 photos culturelles d'accueil si aucune slide n'est présente en BDD
   */
  async seedDefaultsIfEmpty() {
    try {
      const count = await this.prisma.welcomeSlide.count();
      if (count === 0) {
        this.logger.log(
          '🌱 Initialisation automatique des 7 slides d’accueil...',
        );
        for (const slide of DEFAULT_WELCOME_SLIDES) {
          await this.prisma.welcomeSlide.create({
            data: {
              id: slide.id,
              title: slide.title,
              titleMg: slide.titleMg,
              badge: slide.badge,
              badgeMg: slide.badgeMg,
              tag: slide.tag,
              imageUrl: slide.imageUrl,
              accentColor: slide.accentColor,
              orderIndex: slide.orderIndex,
              isActive: true,
            },
          });
        }
        this.logger.log('✅ 7 slides d’accueil initialisées avec succès.');
      }
    } catch (err: unknown) {
      this.logger.warn(
        `[WelcomeSlides] Initialisation différée (table non prête ou déjà initialisée) : ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  /**
   * Retourne la liste des slides actives pour l'application mobile
   */
  async findAllActive() {
    return await this.prisma.welcomeSlide.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' },
    });
  }

  /**
   * Retourne toutes les slides pour l'administration Kanto
   */
  async findAllAdmin() {
    return await this.prisma.welcomeSlide.findMany({
      orderBy: { orderIndex: 'asc' },
    });
  }

  /**
   * Récupère une slide par son identifiant
   */
  async findOne(id: string) {
    const slide = await this.prisma.welcomeSlide.findUnique({
      where: { id },
    });
    if (!slide) {
      throw new NotFoundException(`Slide d'accueil #${id} introuvable`);
    }
    return slide;
  }

  /**
   * Crée une nouvelle slide
   */
  async create(dto: CreateWelcomeSlideDto) {
    // Si orderIndex n'est pas spécifié, on l'ajoute à la fin
    let orderIndex = dto.orderIndex;
    if (orderIndex === undefined || orderIndex === null) {
      const maxOrder = await this.prisma.welcomeSlide.aggregate({
        _max: { orderIndex: true },
      });
      orderIndex = (maxOrder._max.orderIndex ?? -1) + 1;
    }

    return this.prisma.welcomeSlide.create({
      data: {
        title: dto.title,
        titleMg: dto.titleMg,
        badge: dto.badge,
        badgeMg: dto.badgeMg,
        tag: dto.tag,
        imageUrl: dto.imageUrl,
        accentColor: dto.accentColor || '#4A6741',
        orderIndex,
        isActive: dto.isActive ?? true,
      },
    });
  }

  /**
   * Met à jour une slide
   */
  async update(id: string, dto: UpdateWelcomeSlideDto) {
    await this.findOne(id);
    return this.prisma.welcomeSlide.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Supprime une slide
   */
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.welcomeSlide.delete({
      where: { id },
    });
  }

  /**
   * Réorganise l'ordre des slides
   */
  async reorder(dto: ReorderWelcomeSlidesDto) {
    const updates = dto.slides.map((item) =>
      this.prisma.welcomeSlide.update({
        where: { id: item.id },
        data: { orderIndex: item.orderIndex },
      }),
    );
    await this.prisma.$transaction(updates);
    return this.findAllAdmin();
  }
}
