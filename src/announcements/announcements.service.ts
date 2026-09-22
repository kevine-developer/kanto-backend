import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from './dto/announcement.dto.js';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async getActiveAnnouncement() {
    // Retourner l'annonce active (la plus récemment mise à jour ou activée)
    return this.prisma.systemAnnouncement.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.systemAnnouncement.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const announcement = await this.prisma.systemAnnouncement.findUnique({
      where: { id },
    });
    if (!announcement) throw new NotFoundException('Annonce introuvable');
    return announcement;
  }

  async create(data: CreateAnnouncementDto) {
    if (data.isActive) {
      // Désactiver toutes les autres annonces actives pour garantir l'unicité
      await this.prisma.systemAnnouncement.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    return this.prisma.systemAnnouncement.create({
      data: {
        titleFr: data.titleFr,
        titleMg: data.titleMg,
        messageFr: data.messageFr,
        messageMg: data.messageMg,
        type: data.type,
        isActive: data.isActive || false,
        version: data.version && data.version > 0 ? data.version : 1,
      },
    });
  }

  async update(id: string, data: UpdateAnnouncementDto) {
    const existing = await this.findOne(id);

    if (data.isActive) {
      // Désactiver toutes les autres annonces actives pour garantir l'unicité
      await this.prisma.systemAnnouncement.updateMany({
        where: { id: { not: id }, isActive: true },
        data: { isActive: false },
      });
    }

    // Si une version explicite est transmise, l'utiliser ; sinon incrémenter
    const newVersion =
      data.version !== undefined && data.version > 0
        ? data.version
        : existing.version + 1;

    return this.prisma.systemAnnouncement.update({
      where: { id },
      data: {
        ...data,
        version: newVersion,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.systemAnnouncement.delete({
      where: { id },
    });
  }
}
