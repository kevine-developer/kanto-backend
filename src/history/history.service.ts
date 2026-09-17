import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { CloudinaryService } from '../integrations/cloudinary/cloudinary.service.js';
import { CACHE_KEYS } from '../common/constants/cache.constant.js';
import fs from 'node:fs';
import path from 'node:path';
import {
  CreateCivicLessonDto,
  UpdateCivicLessonDto,
  CreatePresidentDto,
  UpdatePresidentDto,
  CreateBanknoteDto,
  UpdateBanknoteDto,
  CreateProvinceBlasonDto,
  UpdateProvinceBlasonDto,
  CreateNatureEmblemDto,
  UpdateNatureEmblemDto,
  CreateHistoryDateDto,
  UpdateHistoryDateDto,
  CreateNationalEmblemDto,
  UpdateNationalEmblemDto,
  ReportHistoryDto,
} from './dto/history.dto.js';

@Injectable()
export class HistoryService {
  private readonly logger = new Logger(HistoryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private async invalidateCache() {
    try {
      await this.redis.delByPattern(CACHE_KEYS.HISTORY_LIST_PATTERN);
    } catch (err: unknown) {
      this.logger.warn(`Échec invalidation cache history: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // ==========================================
  // GESTION DU TÉLÉVERSEMENT DES PHOTOS
  // ==========================================
  async saveUploadedImage(
    base64Data: string,
    originalName?: string,
    subfolder = 'history',
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

    // Sécurisation stricte anti-Path Traversal (suppression des slashes, backslashes, points)
    const safeSubfolder =
      (subfolder || 'history').replace(/[^a-zA-Z0-9_-]/g, '') || 'history';

    if (this.cloudinaryService.isConfigured()) {
      try {
        const cloudinaryUrl = await this.cloudinaryService.uploadImageBase64(
          base64Data,
          originalName,
          `kanto/images/${safeSubfolder}`,
        );
        this.logger.log(`☁️ [Cloudinary] Photo sauvegardée : ${cloudinaryUrl}`);
        return { url: cloudinaryUrl, provider: 'cloudinary' };
      } catch (err: unknown) {
        this.logger.error(
          `❌ [Cloudinary] Échec upload image, bascule sur stockage local : ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
    }

    // Fallback local sécurisé
    const uploadDir = path.resolve(process.cwd(), 'uploads', safeSubfolder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const safePrefix = originalName
      ? originalName.toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 30)
      : 'photo';
    const fileName = `${safePrefix}-${Date.now()}.${extension}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);
    const localUrl = `/uploads/${safeSubfolder}/${fileName}`;
    this.logger.log(`📁 [Local] Photo enregistrée en local : ${localUrl}`);

    return { url: localUrl, provider: 'local' };
  }

  // ==========================================
  // 1. THÈMES & LEÇONS (CivicLesson)
  // ==========================================
  async getLessons(all = false) {
    return this.prisma.civicLesson.findMany({
      where: all ? undefined : { status: true },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async getLessonById(id: string) {
    const lesson = await this.prisma.civicLesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException(`Leçon/thème ${id} non trouvé`);
    return lesson;
  }

  async createLesson(data: CreateCivicLessonDto) {
    const created = await this.prisma.civicLesson.create({ data });
    await this.invalidateCache();
    return created;
  }

  async updateLesson(id: string, data: UpdateCivicLessonDto) {
    await this.getLessonById(id);
    const updated = await this.prisma.civicLesson.update({
      where: { id },
      data,
    });
    await this.invalidateCache();
    return updated;
  }

  async deleteLesson(id: string) {
    await this.getLessonById(id);
    const deleted = await this.prisma.civicLesson.delete({ where: { id } });
    await this.invalidateCache();
    return deleted;
  }

  // ==========================================
  // 2. PRÉSIDENTS (President)
  // ==========================================
  async getPresidents(all = false) {
    return this.prisma.president.findMany({
      where: all ? undefined : { status: 'PUBLISHED' },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async getPresidentById(id: string) {
    const item = await this.prisma.president.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Président ${id} introuvable`);
    return item;
  }

  async createPresident(data: CreatePresidentDto) {
    const created = await this.prisma.president.create({ data });
    await this.invalidateCache();
    return created;
  }

  async updatePresident(id: string, data: UpdatePresidentDto) {
    await this.getPresidentById(id);
    const updated = await this.prisma.president.update({
      where: { id },
      data,
    });
    await this.invalidateCache();
    return updated;
  }

  async deletePresident(id: string) {
    await this.getPresidentById(id);
    const deleted = await this.prisma.president.delete({ where: { id } });
    await this.invalidateCache();
    return deleted;
  }

  // ==========================================
  // 3. BILLETS (Banknote)
  // ==========================================
  async getBanknotes(all = false) {
    return this.prisma.banknote.findMany({
      where: all ? undefined : { status: 'PUBLISHED' },
      orderBy: [{ series: 'asc' }, { valueAriary: 'desc' }, { orderIndex: 'asc' }],
    });
  }

  async getBanknoteById(id: string) {
    const item = await this.prisma.banknote.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Billet ${id} introuvable`);
    return item;
  }

  async createBanknote(data: CreateBanknoteDto) {
    const created = await this.prisma.banknote.create({ data });
    await this.invalidateCache();
    return created;
  }

  async updateBanknote(id: string, data: UpdateBanknoteDto) {
    await this.getBanknoteById(id);
    const updated = await this.prisma.banknote.update({
      where: { id },
      data,
    });
    await this.invalidateCache();
    return updated;
  }

  async deleteBanknote(id: string) {
    await this.getBanknoteById(id);
    const deleted = await this.prisma.banknote.delete({ where: { id } });
    await this.invalidateCache();
    return deleted;
  }

  // ==========================================
  // 4. BLASONS PROVINCES (ProvinceBlason)
  // ==========================================
  async getProvinces(all = false) {
    return this.prisma.provinceBlason.findMany({
      where: all ? undefined : { status: 'PUBLISHED' },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async getProvinceById(id: string) {
    const item = await this.prisma.provinceBlason.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Blason province ${id} introuvable`);
    return item;
  }

  async createProvince(data: CreateProvinceBlasonDto) {
    const created = await this.prisma.provinceBlason.create({
      data: {
        ...data,
        symbols: (data.symbols as Prisma.InputJsonValue) ?? Prisma.JsonNull,
      },
    });
    await this.invalidateCache();
    return created;
  }

  async updateProvince(id: string, data: UpdateProvinceBlasonDto) {
    await this.getProvinceById(id);
    const updated = await this.prisma.provinceBlason.update({
      where: { id },
      data: {
        ...data,
        symbols: data.symbols !== undefined ? ((data.symbols as Prisma.InputJsonValue) ?? Prisma.JsonNull) : undefined,
      },
    });
    await this.invalidateCache();
    return updated;
  }

  async deleteProvince(id: string) {
    await this.getProvinceById(id);
    const deleted = await this.prisma.provinceBlason.delete({ where: { id } });
    await this.invalidateCache();
    return deleted;
  }

  // ==========================================
  // 5. NATURE & EMBLÈMES (NatureEmblem)
  // ==========================================
  async getNatureEmblems(all = false) {
    return this.prisma.natureEmblem.findMany({
      where: all ? undefined : { status: 'PUBLISHED' },
      orderBy: [{ type: 'asc' }, { orderIndex: 'asc' }],
    });
  }

  async getNatureEmblemById(id: string) {
    const item = await this.prisma.natureEmblem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Emblème nature ${id} introuvable`);
    return item;
  }

  async createNatureEmblem(data: CreateNatureEmblemDto) {
    const created = await this.prisma.natureEmblem.create({ data });
    await this.invalidateCache();
    return created;
  }

  async updateNatureEmblem(id: string, data: UpdateNatureEmblemDto) {
    await this.getNatureEmblemById(id);
    const updated = await this.prisma.natureEmblem.update({
      where: { id },
      data,
    });
    await this.invalidateCache();
    return updated;
  }

  async deleteNatureEmblem(id: string) {
    await this.getNatureEmblemById(id);
    const deleted = await this.prisma.natureEmblem.delete({ where: { id } });
    await this.invalidateCache();
    return deleted;
  }

  // ==========================================
  // 6. GRANDES DATES (HistoryDate)
  // ==========================================
  async getHistoryDates(all = false) {
    return this.prisma.historyDate.findMany({
      where: all ? undefined : { status: 'PUBLISHED' },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async getHistoryDateById(id: string) {
    const item = await this.prisma.historyDate.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Date historique ${id} introuvable`);
    return item;
  }

  async createHistoryDate(data: CreateHistoryDateDto) {
    const created = await this.prisma.historyDate.create({ data });
    await this.invalidateCache();
    return created;
  }

  async updateHistoryDate(id: string, data: UpdateHistoryDateDto) {
    await this.getHistoryDateById(id);
    const updated = await this.prisma.historyDate.update({
      where: { id },
      data,
    });
    await this.invalidateCache();
    return updated;
  }

  async deleteHistoryDate(id: string) {
    await this.getHistoryDateById(id);
    const deleted = await this.prisma.historyDate.delete({ where: { id } });
    await this.invalidateCache();
    return deleted;
  }

  // ==========================================
  // 7. EMBLÈMES & SCEAUX D'ÉTAT (NationalEmblem)
  // ==========================================
  async getNationalEmblems(all = false) {
    return this.prisma.nationalEmblem.findMany({
      where: all ? undefined : { status: 'PUBLISHED' },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async getNationalEmblemById(id: string) {
    const item = await this.prisma.nationalEmblem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Emblème d'État ${id} introuvable`);
    return item;
  }

  async createNationalEmblem(data: CreateNationalEmblemDto) {
    const created = await this.prisma.nationalEmblem.create({ data });
    await this.invalidateCache();
    return created;
  }

  async updateNationalEmblem(id: string, data: UpdateNationalEmblemDto) {
    await this.getNationalEmblemById(id);
    const updated = await this.prisma.nationalEmblem.update({
      where: { id },
      data,
    });
    await this.invalidateCache();
    return updated;
  }

  async deleteNationalEmblem(id: string) {
    await this.getNationalEmblemById(id);
    const deleted = await this.prisma.nationalEmblem.delete({ where: { id } });
    await this.invalidateCache();
    return deleted;
  }

  // ==========================================
  // 8. ENGAGEMENT, STATISTIQUES & SIGNALEMENTS
  // ==========================================
  async recordView(entity: string, id: string) {
    const redisKey = `kanto:views:history:${entity}:${id}`;
    let views = 1;
    try {
      const res = await this.redis.incr(redisKey);
      if (typeof res === 'number') {
        views = res;
      }
    } catch {
      // Ignorer si redis indisponible
    }
    this.logger.log(`👁️ [History] Vue incrémentée sur ${entity} ID ${id} (total: ${views})`);
    return { success: true, entity, id, views };
  }

  async reportHistory(dto: ReportHistoryDto, userId?: string) {
    const reportReasonMap: Record<
      string,
      'TRANSLATION_ERROR' | 'TYPO' | 'INCORRECT_MEANING' | 'INAPPROPRIATE' | 'OTHER'
    > = {
      translation: 'TRANSLATION_ERROR',
      spelling: 'TYPO',
      typo: 'TYPO',
      meaning: 'INCORRECT_MEANING',
      error: 'INCORRECT_MEANING',
      outdated: 'OTHER',
      inappropriate: 'INAPPROPRIATE',
      other: 'OTHER',
    };

    const reason = (dto.reason && reportReasonMap[dto.reason]) || 'OTHER';
    const description = `[Entité: ${dto.entity} | Réf: ${dto.contentId}] ${dto.description || ''}`.trim();

    const report = await this.prisma.contentReport.create({
      data: {
        userId: userId || null,
        reason,
        description,
      },
    });

    this.logger.log(
      `🚩 [History] Signalement reçu pour ${dto.entity} ID ${dto.contentId} par ${userId || 'anonyme'} (Raison: ${reason})`,
    );

    return { success: true, reportId: report.id };
  }
}

