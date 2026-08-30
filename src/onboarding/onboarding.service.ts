import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CloudinaryService } from '../integrations/cloudinary/cloudinary.service.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { CreateSlideDto, UpdateSlideDto } from './dto/onboarding.dto.js';
import { INITIAL_ONBOARDING_SLIDES } from './constants/initial-slides.constant.js';

@Injectable()
export class OnboardingService {
  private readonly logger = new Logger(OnboardingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Assure la présence des 3 slides par défaut si la base de données est vide.
   */
  async ensureSeed(): Promise<void> {
    const count = await this.prisma.onboardingSlide.count();
    if (count === 0) {
      this.logger.log("🌱 Seeding initial des diapositives d'onboarding...");
      for (const slide of INITIAL_ONBOARDING_SLIDES) {
        await this.prisma.onboardingSlide.create({
          data: slide,
        });
      }
      this.logger.log("✅ 3 slides d'onboarding initiaux créés avec succès.");
    }
  }

  /**
   * Retourne les diapositives actives pour l'application mobile (triées par ordre).
   */
  async getPublicSlides() {
    await this.ensureSeed();
    return this.prisma.onboardingSlide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Retourne toutes les diapositives pour l'administration (actives et inactives).
   */
  async getAllSlidesAdmin() {
    await this.ensureSeed();
    return this.prisma.onboardingSlide.findMany({
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Crée une nouvelle diapositive d'onboarding.
   */
  async createSlide(data: CreateSlideDto) {
    let targetOrder = data.order;
    if (targetOrder === undefined || targetOrder === null) {
      const highest = await this.prisma.onboardingSlide.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      targetOrder = (highest?.order ?? -1) + 1;
    }

    return this.prisma.onboardingSlide.create({
      data: {
        title: data.title.trim(),
        titleMg: data.titleMg.trim(),
        subtitle: data.subtitle?.trim() ? data.subtitle.trim() : null,
        description: data.description.trim(),
        imageUrl: data.imageUrl?.trim() ? data.imageUrl.trim() : null,
        accentColor: data.accentColor ?? '#4A6741',
        iconName: data.iconName ?? 'BookOpen',
        isActive: data.isActive ?? true,
        order: targetOrder,
      },
    });
  }

  /**
   * Met à jour une diapositive existante.
   */
  async updateSlide(id: string, data: UpdateSlideDto) {
    const slide = await this.prisma.onboardingSlide.findUnique({
      where: { id },
    });

    if (!slide) {
      throw new NotFoundException(`Diapositive ${id} introuvable`);
    }

    return this.prisma.onboardingSlide.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.titleMg !== undefined && { titleMg: data.titleMg.trim() }),
        ...(data.subtitle !== undefined && {
          subtitle: data.subtitle?.trim() ? data.subtitle.trim() : null,
        }),
        ...(data.description !== undefined && {
          description: data.description.trim(),
        }),
        ...(data.imageUrl !== undefined && {
          imageUrl: data.imageUrl?.trim() ? data.imageUrl.trim() : null,
        }),
        ...(data.accentColor !== undefined && {
          accentColor: data.accentColor,
        }),
        ...(data.iconName !== undefined && { iconName: data.iconName }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });
  }

  /**
   * Réorganise l'ordre d'affichage des diapositives en masse.
   */
  async reorderSlides(slideIds: string[]) {
    const updates = slideIds.map((id, index) =>
      this.prisma.onboardingSlide.update({
        where: { id },
        data: { order: index },
      }),
    );

    await this.prisma.$transaction(updates);

    return this.prisma.onboardingSlide.findMany({
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Supprime définitivement une diapositive d'onboarding.
   */
  async deleteSlide(id: string) {
    const slide = await this.prisma.onboardingSlide.findUnique({
      where: { id },
    });

    if (!slide) {
      throw new NotFoundException(`Diapositive ${id} introuvable`);
    }

    await this.prisma.onboardingSlide.delete({
      where: { id },
    });

    const remaining = await this.prisma.onboardingSlide.findMany({
      orderBy: { order: 'asc' },
    });

    if (remaining.length > 0) {
      const updates = remaining.map((s, index) =>
        this.prisma.onboardingSlide.update({
          where: { id: s.id },
          data: { order: index },
        }),
      );
      await this.prisma.$transaction(updates);
    }

    return { success: true, message: 'Diapositive supprimée' };
  }

  /**
   * Téléverse une photo pour l'onboarding (Cloudinary CDN avec fallback local sécurisé).
   */
  async saveUploadedImage(
    base64Data: string,
    originalName?: string,
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
    const extension = mimeToExt[mimeType] ?? 'png';

    if (this.cloudinaryService.isConfigured()) {
      try {
        const cloudinaryUrl = await this.cloudinaryService.uploadImageBase64(
          base64Data,
          originalName,
          'kanto/images/onboarding',
        );
        this.logger.log(
          `☁️ [Cloudinary] Photo d'onboarding hébergée : ${cloudinaryUrl}`,
        );
        return { url: cloudinaryUrl, provider: 'cloudinary' };
      } catch (err: unknown) {
        this.logger.warn(
          `⚠️ [Cloudinary] Échec (${
            err instanceof Error ? err.message : 'erreur inconnue'
          }). Bascule vers stockage local.`,
        );
      }
    }

    const uploadDir = path.resolve(process.cwd(), 'uploads', 'onboarding');
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

    await fs.promises.writeFile(filePath, buffer);

    this.logger.log(
      `📷 Photo d'onboarding enregistrée en local : /uploads/onboarding/${fileName}`,
    );
    return { url: `/uploads/onboarding/${fileName}`, provider: 'local' };
  }
}
