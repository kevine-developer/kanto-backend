import {
  Injectable,
  NotFoundException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import fs from 'node:fs';
import path from 'node:path';
import { PrismaService } from '../prisma/prisma.service.js';
import { CloudinaryService } from '../integrations/cloudinary/cloudinary.service.js';
import { CloudinarySyncService } from '../integrations/cloudinary/cloudinary-sync.service.js';
import {
  CreateWelcomeSlideDto,
  UpdateWelcomeSlideDto,
  ReorderWelcomeSlidesDto,
} from './dto/welcome-slide.dto.js';
import { DEFAULT_WELCOME_SLIDES } from './constants/default-welcome-slides.constant.js';

@Injectable()
export class WelcomeSlidesService implements OnModuleInit {
  private readonly logger = new Logger(WelcomeSlidesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly cloudinarySyncService: CloudinarySyncService,
  ) {}

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
   * Met à jour une slide et supprime l'ancienne image si remplacée
   */
  async update(id: string, dto: UpdateWelcomeSlideDto) {
    const existing = await this.findOne(id);
    const updated = await this.prisma.welcomeSlide.update({
      where: { id },
      data: dto,
    });

    if (
      dto.imageUrl !== undefined &&
      existing.imageUrl &&
      existing.imageUrl !== updated.imageUrl
    ) {
      this.cloudinaryService
        .deleteMediaFromUrl(existing.imageUrl)
        .catch(() => {});
    }

    return updated;
  }

  /**
   * Supprime une slide et son image Cloudinary
   */
  async remove(id: string) {
    const existing = await this.findOne(id);
    const deleted = await this.prisma.welcomeSlide.delete({
      where: { id },
    });

    if (existing.imageUrl) {
      this.cloudinaryService
        .deleteMediaFromUrl(existing.imageUrl)
        .catch(() => {});
    }

    return deleted;
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

  /**
   * Sauvegarde une image uploadée en base64 vers Cloudinary CDN (avec fallback local si non configuré)
   */
  async saveUploadedImage(
    base64Data: string,
    originalName?: string,
    subfolder = 'welcome',
  ): Promise<{ url: string; provider: 'cloudinary' | 'local' }> {
    const { buffer, mimeType } =
      this.cloudinaryService.validateAndDecodeBase64Image(base64Data);

    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };
    const extension = mimeToExt[mimeType] ?? 'jpg';
    const safeSubfolder =
      (subfolder || 'welcome').replace(/[^a-zA-Z0-9_-]/g, '') || 'welcome';

    if (this.cloudinaryService.isConfigured()) {
      try {
        const cloudinaryUrl = await this.cloudinaryService.uploadImageBase64(
          base64Data,
          originalName,
          `kanto/images/${safeSubfolder}`,
        );
        this.logger.log(
          `[Cloudinary] Photo slide hébergée avec succès : ${cloudinaryUrl}`,
        );
        this.cloudinarySyncService
          .syncLocalUploadsToCloudinary()
          .catch(() => {});
        return { url: cloudinaryUrl, provider: 'cloudinary' };
      } catch (err: unknown) {
        this.logger.error(
          `[Cloudinary] Erreur upload image, bascule sur stockage local : ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
    } else {
      this.logger.warn(
        `[Cloudinary] Non configuré — enregistrement local dans uploads/${safeSubfolder}/`,
      );
    }

    const uploadDir = path.resolve(process.cwd(), 'uploads', safeSubfolder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const safeName = originalName
      ? originalName
          .replace(/\.[^/.]+$/, '')
          .replace(/[^a-zA-Z0-9_-]/g, '_')
          .toLowerCase()
      : 'slide';
    const fileName = `${safeName}-${Date.now()}.${extension}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    this.logger.log(
      `[Local] Image enregistrée en local : /uploads/${safeSubfolder}/${fileName}`,
    );
    return { url: `/uploads/${safeSubfolder}/${fileName}`, provider: 'local' };
  }
}
