import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthGuard, Roles } from '../auth/index.js';

@Controller('admin/learning')
@UseGuards(AuthGuard)
@Roles(['ADMIN', 'admin'])
export class AdminLearningController {
  constructor(private readonly prisma: PrismaService) {}

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
  async toggleAllAudio(@Body() body: { audioEnabled: boolean; trackId?: string }) {
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
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
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
        ...(body.description !== undefined && { description: body.description }),
        ...(body.descriptionMg !== undefined && { descriptionMg: body.descriptionMg }),
        ...(body.level !== undefined && { level: body.level }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.color !== undefined && { color: body.color }),
        ...(body.orderIndex !== undefined && { orderIndex: Number(body.orderIndex) }),
        ...(body.estimatedMinutes !== undefined && { estimatedMinutes: Number(body.estimatedMinutes) }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
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
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const sections = this.applyAudioConfig(body.sections || [], body.audioEnabled);

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
        finalSections = this.applyAudioConfig(current.sections as any[], body.audioEnabled);
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
        ...(body.orderIndex !== undefined && { orderIndex: Number(body.orderIndex) }),
        ...(body.durationMinutes !== undefined && { durationMinutes: Number(body.durationMinutes) }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
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
}

