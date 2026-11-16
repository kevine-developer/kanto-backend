import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import fs from 'node:fs';
import path from 'node:path';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthGuard, Roles } from '../auth/index.js';
import { CloudinaryService } from '../integrations/cloudinary/cloudinary.service.js';
import {
  CreateLessonImageDto,
  ReorderLessonImagesDto,
  UpdateLessonImageDto,
  UploadTrackCoverDto,
} from './dto/learning-image.dto.js';

@Controller('admin/learning')
@UseGuards(AuthGuard)
@Roles(['ADMIN', 'admin'])
export class AdminLearningController {
  private readonly logger = new Logger(AdminLearningController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Sauvegarde une image soit sur Cloudinary soit en stockage local sécurisé.
   */
  private async saveImage(
    base64Data: string,
    folder: string,
    prefix: string,
  ): Promise<string> {
    const { buffer, mimeType } =
      this.cloudinaryService.validateAndDecodeBase64Image(base64Data);

    const extension = mimeType.split('/')[1] || 'jpg';

    if (this.cloudinaryService.isConfigured()) {
      try {
        const cloudinaryUrl = await this.cloudinaryService.uploadImageBase64(
          base64Data,
          `${prefix}_${Date.now()}`,
          `kanto/images/${folder}`,
        );
        return cloudinaryUrl;
      } catch (err: unknown) {
        this.logger.warn(
          `[Cloudinary] Échec upload ${folder} : ${
            err instanceof Error ? err.message : String(err)
          }. Bascule vers stockage local.`,
        );
      }
    }

    // Fallback stockage local dans uploads/
    const uploadDir = path.resolve(process.cwd(), 'uploads', folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${prefix}-${Date.now()}.${extension}`;
    const filePath = path.join(uploadDir, fileName);
    await fs.promises.writeFile(filePath, buffer);

    return `/uploads/${folder}/${fileName}`;
  }

  /**
   * Supprime une image hébergée sur Cloudinary ou sur le disque local.
   */
  private async deleteStoredImage(url?: string | null): Promise<void> {
    if (!url) return;
    try {
      if (url.startsWith('https://res.cloudinary.com/')) {
        await this.cloudinaryService.deleteMediaFromUrl(url);
      } else if (url.startsWith('/uploads/')) {
        const localPath = path.resolve(process.cwd(), url.slice(1));
        if (fs.existsSync(localPath)) {
          await fs.promises.unlink(localPath);
        }
      }
    } catch (err: unknown) {
      this.logger.warn(`Impossible de supprimer l'image ${url}: ${err}`);
    }
  }

  private extractAudioEnabled(sections: any): boolean {
    let list: any[] = [];
    if (Array.isArray(sections)) list = sections;
    else if (typeof sections === 'string') {
      try {
        list = JSON.parse(sections);
      } catch {
        list = [];
      }
    }
    const cfg = list.find((s) => s && s.type === 'config');
    return cfg ? cfg.audioEnabled !== false : true;
  }

  private applyAudioConfig(sections: any[], audioEnabled?: boolean): any[] {
    if (audioEnabled === undefined) return sections;
    const list = Array.isArray(sections) ? [...sections] : [];
    const cfgIdx = list.findIndex((s) => s && s.type === 'config');
    if (cfgIdx >= 0) {
      list[cfgIdx] = { ...list[cfgIdx], audioEnabled };
    } else {
      list.unshift({ type: 'config', audioEnabled });
    }
    return list;
  }

  /**
   * Bascule globale de la lecture vocale des prononciations sur toutes les leçons (ou par parcours).
   */
  @Patch('toggle-all-audio')
  async toggleAllAudio(
    @Body() body: { audioEnabled: boolean; trackId?: string },
  ) {
    const audioEnabled = body.audioEnabled !== false;
    const where = body.trackId ? { trackId: body.trackId } : {};
    const lessons = await this.prisma.learningLesson.findMany({ where });

    let updatedCount = 0;
    for (const lesson of lessons) {
      let sections: any[] = [];
      if (Array.isArray(lesson.sections)) {
        sections = [...lesson.sections];
      } else if (typeof lesson.sections === 'string') {
        try {
          sections = JSON.parse(lesson.sections);
        } catch {
          sections = [];
        }
      }

      const newSections = this.applyAudioConfig(sections, audioEnabled);

      await this.prisma.learningLesson.update({
        where: { id: lesson.id },
        data: { sections: newSections },
      });
      updatedCount++;
    }

    return { success: true, updatedCount, audioEnabled };
  }

  /**
   * Liste complète des parcours avec compteurs de leçons.
   */
  @Get('tracks')
  async getTracks() {
    const tracks = await this.prisma.learningTrack.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: { select: { lessons: true } },
        lessons: {
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            slug: true,
            title: true,
            titleMg: true,
            orderIndex: true,
            type: true,
            durationMinutes: true,
            isPublished: true,
            sections: true,
          },
        },
      },
    });

    return tracks.map((track) => ({
      ...track,
      lessons: track.lessons.map((lesson) => ({
        ...lesson,
        audioEnabled: this.extractAudioEnabled(lesson.sections),
      })),
    }));
  }

  /**
   * Création d'un parcours pédagogique.
   */
  @Post('tracks')
  async createTrack(@Body() body: any) {
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    return this.prisma.learningTrack.create({
      data: {
        slug,
        title: body.title,
        titleMg: body.titleMg || body.title,
        description: body.description || '',
        descriptionMg: body.descriptionMg || '',
        level: body.level || 'BEGINNER',
        icon: body.icon || 'GraduationCap',
        color: body.color || '#4A6741',
        orderIndex: Number(body.orderIndex) || 0,
        estimatedMinutes: Number(body.estimatedMinutes) || 20,
        isPublished: body.isPublished !== false,
      },
    });
  }

  /**
   * Mise à jour d'un parcours pédagogique.
   */
  @Patch('tracks/:id')
  async updateTrack(@Param('id') id: string, @Body() body: any) {
    return this.prisma.learningTrack.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.titleMg !== undefined && { titleMg: body.titleMg }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.descriptionMg !== undefined && {
          descriptionMg: body.descriptionMg,
        }),
        ...(body.level !== undefined && { level: body.level }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.color !== undefined && { color: body.color }),
        ...(body.orderIndex !== undefined && {
          orderIndex: Number(body.orderIndex),
        }),
        ...(body.estimatedMinutes !== undefined && {
          estimatedMinutes: Number(body.estimatedMinutes),
        }),
        ...(body.isPublished !== undefined && {
          isPublished: body.isPublished,
        }),
      },
    });
  }

  /**
   * Suppression d'un parcours pédagogique (avec cascade sur ses leçons).
   */
  @Delete('tracks/:id')
  async deleteTrack(@Param('id') id: string) {
    return this.prisma.learningTrack.delete({
      where: { id },
    });
  }

  /**
   * Liste des leçons (avec filtre par trackId possible).
   */
  @Get('lessons')
  async getLessons(@Query('trackId') trackId?: string) {
    const lessons = await this.prisma.learningLesson.findMany({
      where: trackId ? { trackId } : {},
      orderBy: { orderIndex: 'asc' },
      include: {
        track: { select: { id: true, title: true, titleMg: true, slug: true } },
      },
    });

    return lessons.map((lesson) => ({
      ...lesson,
      audioEnabled: this.extractAudioEnabled(lesson.sections),
    }));
  }

  /**
   * Détail complet d'une leçon (avec ses sections didactiques et micro-quiz).
   */
  @Get('lessons/:id')
  async getLesson(@Param('id') id: string) {
    const lesson = await this.prisma.learningLesson.findUnique({
      where: { id },
      include: { track: true },
    });
    if (!lesson) {
      throw new NotFoundException(`Leçon "${id}" introuvable`);
    }
    return {
      ...lesson,
      audioEnabled: this.extractAudioEnabled(lesson.sections),
    };
  }

  /**
   * Création d'une leçon pédagogique complète.
   */
  @Post('lessons')
  async createLesson(@Body() body: any) {
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    const sections = this.applyAudioConfig(
      body.sections || [],
      body.audioEnabled,
    );

    const created = await this.prisma.learningLesson.create({
      data: {
        trackId: body.trackId,
        slug,
        title: body.title,
        titleMg: body.titleMg || body.title,
        summary: body.summary || '',
        summaryMg: body.summaryMg || '',
        type: body.type || 'VOCABULARY',
        orderIndex: Number(body.orderIndex) || 0,
        durationMinutes: Number(body.durationMinutes) || 5,
        isPublished: body.isPublished !== false,
        sections,
      },
    });

    return {
      ...created,
      audioEnabled: this.extractAudioEnabled(created.sections),
    };
  }

  /**
   * Mise à jour d'une leçon.
   */
  @Patch('lessons/:id')
  async updateLesson(@Param('id') id: string, @Body() body: any) {
    let finalSections = body.sections;
    if (body.audioEnabled !== undefined && finalSections !== undefined) {
      finalSections = this.applyAudioConfig(finalSections, body.audioEnabled);
    } else if (body.audioEnabled !== undefined && finalSections === undefined) {
      const current = await this.prisma.learningLesson.findUnique({
        where: { id },
        select: { sections: true },
      });
      if (current) {
        finalSections = this.applyAudioConfig(
          current.sections as any[],
          body.audioEnabled,
        );
      }
    }

    const updated = await this.prisma.learningLesson.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.titleMg !== undefined && { titleMg: body.titleMg }),
        ...(body.summary !== undefined && { summary: body.summary }),
        ...(body.summaryMg !== undefined && { summaryMg: body.summaryMg }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.orderIndex !== undefined && {
          orderIndex: Number(body.orderIndex),
        }),
        ...(body.durationMinutes !== undefined && {
          durationMinutes: Number(body.durationMinutes),
        }),
        ...(body.isPublished !== undefined && {
          isPublished: body.isPublished,
        }),
        ...(finalSections !== undefined && { sections: finalSections }),
      },
    });

    return {
      ...updated,
      audioEnabled: this.extractAudioEnabled(updated.sections),
    };
  }

  /**
   * Bascule rapide de publication (Publié / Dépublié).
   */
  @Patch('lessons/:id/toggle-publish')
  async togglePublish(@Param('id') id: string) {
    const current = await this.prisma.learningLesson.findUnique({
      where: { id },
      select: { isPublished: true },
    });
    if (!current) throw new NotFoundException('Leçon introuvable');

    return this.prisma.learningLesson.update({
      where: { id },
      data: { isPublished: !current.isPublished },
    });
  }

  /**
   * Suppression d'une leçon.
   */
  @Delete('lessons/:id')
  async deleteLesson(@Param('id') id: string) {
    return this.prisma.learningLesson.delete({
      where: { id },
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // GESTION DES IMAGES — COURS (Couvertures) & LEÇONS (Pédagogiques)
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * Téléverse ou remplace l'image de couverture d'un cours.
   */
  @Post('tracks/:id/cover')
  async uploadTrackCover(
    @Param('id') id: string,
    @Body() dto: UploadTrackCoverDto,
  ) {
    const track = await this.prisma.learningTrack.findUnique({
      where: { id },
      select: { id: true, coverImage: true },
    });
    if (!track) {
      throw new NotFoundException(`Cours "${id}" introuvable`);
    }

    const coverUrl = await this.saveImage(
      dto.imageBase64,
      'learning/tracks',
      `cover_${id}`,
    );

    // Suppression de l'ancienne image le cas échéant
    if (track.coverImage && track.coverImage !== coverUrl) {
      await this.deleteStoredImage(track.coverImage);
    }

    const updated = await this.prisma.learningTrack.update({
      where: { id },
      data: { coverImage: coverUrl },
    });

    return {
      success: true,
      coverImage: coverUrl,
      track: updated,
    };
  }

  /**
   * Supprime l'image de couverture d'un cours.
   */
  @Delete('tracks/:id/cover')
  async removeTrackCover(@Param('id') id: string) {
    const track = await this.prisma.learningTrack.findUnique({
      where: { id },
      select: { id: true, coverImage: true },
    });
    if (!track) {
      throw new NotFoundException(`Cours "${id}" introuvable`);
    }

    if (track.coverImage) {
      await this.deleteStoredImage(track.coverImage);
    }

    await this.prisma.learningTrack.update({
      where: { id },
      data: { coverImage: null },
    });

    return { success: true };
  }

  /**
   * Récupère la liste des images associées à une leçon.
   */
  @Get('lessons/:id/images')
  async getLessonImages(@Param('id') id: string) {
    const lesson = await this.prisma.learningLesson.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!lesson) {
      throw new NotFoundException(`Leçon "${id}" introuvable`);
    }

    return this.prisma.learningLessonImage.findMany({
      where: { lessonId: id },
      orderBy: { orderIndex: 'asc' },
    });
  }

  /**
   * Ajoute une nouvelle image pédagogique à une leçon (upload base64 ou URL externe).
   */
  @Post('lessons/:id/images')
  async addLessonImage(
    @Param('id') id: string,
    @Body() dto: CreateLessonImageDto,
  ) {
    const lesson = await this.prisma.learningLesson.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!lesson) {
      throw new NotFoundException(`Leçon "${id}" introuvable`);
    }

    let finalUrl = dto.imageUrl;
    if (dto.imageBase64) {
      finalUrl = await this.saveImage(
        dto.imageBase64,
        'learning/lessons',
        `lesson_${id}`,
      );
    }

    if (!finalUrl) {
      throw new BadRequestException(
        "Vous devez fournir soit une image en base64 ('imageBase64'), soit une URL valide ('imageUrl').",
      );
    }

    // Déterminer le prochain ordre d'affichage si non spécifié
    let nextOrder = dto.orderIndex;
    if (nextOrder === undefined) {
      const highestOrder = await this.prisma.learningLessonImage.findFirst({
        where: { lessonId: id },
        orderBy: { orderIndex: 'desc' },
        select: { orderIndex: true },
      });
      nextOrder = (highestOrder?.orderIndex ?? -1) + 1;
    }

    const created = await this.prisma.learningLessonImage.create({
      data: {
        lessonId: id,
        url: finalUrl,
        altText: dto.altText || null,
        captionFr: dto.captionFr || null,
        captionMg: dto.captionMg || null,
        credit: dto.credit || null,
        description: dto.description || null,
        orderIndex: nextOrder,
      },
    });

    return {
      success: true,
      image: created,
    };
  }

  /**
   * Met à jour les métadonnées d'une image ou remplace son fichier binaire.
   */
  @Patch('images/:imageId')
  async updateLessonImage(
    @Param('imageId') imageId: string,
    @Body() dto: UpdateLessonImageDto,
  ) {
    const existing = await this.prisma.learningLessonImage.findUnique({
      where: { id: imageId },
    });
    if (!existing) {
      throw new NotFoundException(`Image "${imageId}" introuvable`);
    }

    let newUrl = existing.url;
    if (dto.imageBase64) {
      newUrl = await this.saveImage(
        dto.imageBase64,
        'learning/lessons',
        `lesson_${existing.lessonId}`,
      );
      // Nettoyage de l'ancienne image
      await this.deleteStoredImage(existing.url);
    } else if (dto.imageUrl) {
      newUrl = dto.imageUrl;
    }

    const updated = await this.prisma.learningLessonImage.update({
      where: { id: imageId },
      data: {
        url: newUrl,
        ...(dto.altText !== undefined && { altText: dto.altText }),
        ...(dto.captionFr !== undefined && { captionFr: dto.captionFr }),
        ...(dto.captionMg !== undefined && { captionMg: dto.captionMg }),
        ...(dto.credit !== undefined && { credit: dto.credit }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.orderIndex !== undefined && {
          orderIndex: Number(dto.orderIndex),
        }),
      },
    });

    return {
      success: true,
      image: updated,
    };
  }

  /**
   * Supprime une image d'une leçon (fichier stocké et base de données).
   */
  @Delete('images/:imageId')
  async deleteLessonImage(@Param('imageId') imageId: string) {
    const existing = await this.prisma.learningLessonImage.findUnique({
      where: { id: imageId },
    });
    if (!existing) {
      throw new NotFoundException(`Image "${imageId}" introuvable`);
    }

    await this.deleteStoredImage(existing.url);

    await this.prisma.learningLessonImage.delete({
      where: { id: imageId },
    });

    return { success: true, deletedId: imageId };
  }

  /**
   * Réordonne les images d'une leçon selon l'ordre du tableau fourni.
   */
  @Patch('lessons/:id/reorder-images')
  async reorderLessonImages(
    @Param('id') id: string,
    @Body() dto: ReorderLessonImagesDto,
  ) {
    const lesson = await this.prisma.learningLesson.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!lesson) {
      throw new NotFoundException(`Leçon "${id}" introuvable`);
    }

    await this.prisma.$transaction(
      dto.imageIds.map((imgId, idx) =>
        this.prisma.learningLessonImage.updateMany({
          where: { id: imgId, lessonId: id },
          data: { orderIndex: idx },
        }),
      ),
    );

    const reordered = await this.prisma.learningLessonImage.findMany({
      where: { lessonId: id },
      orderBy: { orderIndex: 'asc' },
    });

    return {
      success: true,
      count: reordered.length,
      images: reordered,
    };
  }
}
