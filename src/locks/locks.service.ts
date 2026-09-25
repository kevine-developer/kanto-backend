import {
  Injectable,
  Logger,
  OnModuleInit,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import fs from 'node:fs';
import path from 'node:path';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { CloudinaryService } from '../integrations/cloudinary/cloudinary.service.js';
import { INITIAL_MODULES } from './constants/initial-modules.constant.js';

const CACHE_KEY_PUBLIC_LOCKS = 'module_locks:public';
const CACHE_TTL_SECONDS = 300; // 5 minutes

@Injectable()
export class LocksService implements OnModuleInit {
  private readonly logger = new Logger(LocksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async onModuleInit() {
    await this.seedInitialModulesIfEmpty();
  }

  /**
   * Initialise les modules s'ils n'existent pas encore dans la base de données.
   */
  async seedInitialModulesIfEmpty() {
    try {
      const count = await this.prisma.moduleLock.count();
      if (count === 0) {
        this.logger.log(
          '🌱 Initialisation des 17 modules (jeux, catégories, features)...',
        );
        for (const item of INITIAL_MODULES) {
          await this.prisma.moduleLock.create({
            data: {
              key: item.key,
              type: item.type,
              nameFr: item.nameFr,
              nameMg: item.nameMg,
              imageUrl: item.imageUrl || null,
              bgImageUrl: item.bgImageUrl || null,
              isLocked: item.isLocked,
              lockReason: item.lockReason,
              minTier: item.minTier || 'FREE',
            },
          });
        }
        this.logger.log('✅ Initialisation des modules terminée.');
      } else {
        // Assure que toute nouvelle clé de module est ajoutée si manquante et hydrate les images manquantes
        for (const item of INITIAL_MODULES) {
          const exists = await this.prisma.moduleLock.findUnique({
            where: { key: item.key },
          });
          if (!exists) {
            await this.prisma.moduleLock.create({
              data: {
                key: item.key,
                type: item.type,
                nameFr: item.nameFr,
                nameMg: item.nameMg,
                imageUrl: item.imageUrl || null,
                isLocked: item.isLocked,
                lockReason: item.lockReason,
                minTier: item.minTier || 'FREE',
              },
            });
            this.logger.log(`➕ Nouveau module ajouté : ${item.key}`);
          } else if (!exists.imageUrl && item.imageUrl) {
            await this.prisma.moduleLock.update({
              where: { key: item.key },
              data: { imageUrl: item.imageUrl },
            });
            this.logger.log(`🖼️ Image par défaut assignée au module : ${item.key}`);
          }
        }
      }
    } catch (error) {
      this.logger.error("Erreur lors de l'initialisation des modules :", error);
    }
  }

  /**
   * Retourne la vue publique / mobile des verrous (format clé -> booléen + message).
   * Mis en cache dans Redis.
   */
  async getPublicLocks(): Promise<
    Record<string, { isLocked: boolean; lockReason?: string }>
  > {
    try {
      const cached = await this.redisService.get<
        Record<
          string,
          {
            isLocked: boolean;
            lockReason?: string;
            imageUrl?: string;
            nameFr?: string;
            nameMg?: string;
            type?: string;
          }
        >
      >(CACHE_KEY_PUBLIC_LOCKS);
      if (cached) {
        return cached;
      }
    } catch {
      this.logger.debug('Cache Redis ignoré, lecture directe base de données.');
    }

    const records = await this.prisma.moduleLock.findMany({
      select: {
        key: true,
        type: true,
        nameFr: true,
        nameMg: true,
        imageUrl: true,
        bgImageUrl: true,
        isLocked: true,
        lockReason: true,
      },
    });

    const result: Record<
      string,
      {
        isLocked: boolean;
        lockReason?: string;
        imageUrl?: string;
        bgImageUrl?: string;
        nameFr?: string;
        nameMg?: string;
        type?: string;
      }
    > = {};

    for (const r of records) {
      result[r.key] = {
        isLocked: r.isLocked,
        lockReason: r.lockReason || undefined,
        imageUrl: r.imageUrl || undefined,
        bgImageUrl: r.bgImageUrl || undefined,
        nameFr: r.nameFr,
        nameMg: r.nameMg,
        type: r.type,
      };
    }

    try {
      await this.redisService.set(
        CACHE_KEY_PUBLIC_LOCKS,
        result,
        CACHE_TTL_SECONDS,
      );
    } catch (err: unknown) {
      this.logger.debug(
        `Erreur sauvegarde cache locks : ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    return result;
  }

  /**
   * Retourne l'état public d'un module par sa clé (accès mobile / public).
   */
  async getPublicLockByKey(key: string) {
    const decodedKey = decodeURIComponent(key).trim();
    const r = await this.prisma.moduleLock.findUnique({
      where: { key: decodedKey },
      select: {
        key: true,
        type: true,
        nameFr: true,
        nameMg: true,
        imageUrl: true,
        bgImageUrl: true,
        isLocked: true,
        lockReason: true,
      },
    });

    if (!r) {
      throw new NotFoundException(`Module avec la clé "${decodedKey}" non trouvé.`);
    }

    return {
      isLocked: r.isLocked,
      lockReason: r.lockReason || undefined,
      imageUrl: r.imageUrl || undefined,
      bgImageUrl: r.bgImageUrl || undefined,
      nameFr: r.nameFr,
      nameMg: r.nameMg,
      type: r.type,
    };
  }

  /**
   * Retourne la liste complète pour l'administration.
   */
  async getAdminLocks(type?: 'GAME' | 'CATEGORY' | 'FEATURE') {
    const where = type ? { type } : {};
    const modules = await this.prisma.moduleLock.findMany({
      where,
      orderBy: [{ type: 'asc' }, { nameFr: 'asc' }],
    });

    const total = modules.length;
    const locked = modules.filter((m) => m.isLocked).length;
    const active = total - locked;

    return {
      stats: {
        total,
        locked,
        active,
      },
      modules,
    };
  }

  /**
   * Retourne les informations complètes d'un module par sa clé (administration).
   */
  async getAdminLockByKey(key: string) {
    const decodedKey = decodeURIComponent(key).trim();
    const moduleLock = await this.prisma.moduleLock.findUnique({
      where: { key: decodedKey },
    });

    if (!moduleLock) {
      throw new NotFoundException(`Module avec la clé "${decodedKey}" non trouvé.`);
    }

    return moduleLock;
  }

  /**
   * Crée un nouveau module (Jeu ou Catégorie) avec son image.
   */
  async createModule(data: {
    key: string;
    type: 'GAME' | 'CATEGORY' | 'FEATURE';
    nameFr: string;
    nameMg: string;
    imageUrl?: string | null;
    bgImageUrl?: string | null;
    isLocked?: boolean;
    lockReason?: string | null;
    minTier?: string;
  }) {
    if (!data?.key || typeof data.key !== 'string' || !data.key.trim()) {
      throw new BadRequestException("La clé d'identification est requise.");
    }
    if (!data?.nameFr || !data?.nameMg) {
      throw new BadRequestException(
        'Les noms français et malgache sont requis.',
      );
    }

    const trimmedKey = data.key.trim();

    const existing = await this.prisma.moduleLock.findUnique({
      where: { key: trimmedKey },
    });

    if (existing) {
      throw new ConflictException(
        `Un module avec la clé "${trimmedKey}" existe déjà.`,
      );
    }

    const created = await this.prisma.moduleLock.create({
      data: {
        key: trimmedKey,
        type: data.type,
        nameFr: data.nameFr.trim(),
        nameMg: data.nameMg.trim(),
        imageUrl: data.imageUrl?.trim() || null,
        bgImageUrl: data.bgImageUrl?.trim() || null,
        isLocked: data.isLocked || false,
        lockReason: data.lockReason?.trim() || null,
        minTier: data.minTier?.trim() || 'FREE',
      },
    });

    // Invalide le cache public Redis
    try {
      await this.redisService.del(CACHE_KEY_PUBLIC_LOCKS);
    } catch {
      // Ignorer l'erreur d'invalidation Redis
    }

    this.logger.log(
      `✨ [ModuleLock] Nouveau module créé : ${created.key} (${created.nameFr})`,
    );
    return created;
  }

  /**
   * Met à jour les informations, l'image et le statut d'un module.
   */
  async updateModuleLock(
    key: string,
    data: {
      nameFr?: string;
      nameMg?: string;
      type?: 'GAME' | 'CATEGORY' | 'FEATURE';
      imageUrl?: string | null;
      bgImageUrl?: string | null;
      isLocked?: boolean;
      lockReason?: string | null;
      minTier?: string;
    },
  ) {
    const existing = await this.prisma.moduleLock.findUnique({
      where: { key },
    });

    if (!existing) {
      throw new NotFoundException(`Module avec la clé "${key}" non trouvé.`);
    }

    const updated = await this.prisma.moduleLock.update({
      where: { key },
      data: {
        nameFr:
          data.nameFr !== undefined ? data.nameFr.trim() : existing.nameFr,
        nameMg:
          data.nameMg !== undefined ? data.nameMg.trim() : existing.nameMg,
        type: data.type !== undefined ? data.type : existing.type,
        imageUrl:
          data.imageUrl !== undefined
            ? data.imageUrl?.trim() || null
            : existing.imageUrl,
        bgImageUrl:
          data.bgImageUrl !== undefined
            ? data.bgImageUrl?.trim() || null
            : existing.bgImageUrl,
        isLocked:
          data.isLocked !== undefined ? data.isLocked : existing.isLocked,
        lockReason:
          data.lockReason !== undefined
            ? data.lockReason?.trim() || null
            : existing.lockReason,
        minTier: data.minTier !== undefined ? data.minTier : existing.minTier,
      },
    });

    // Suppression automatique de l'ancienne image si remplacée
    if (
      data.imageUrl !== undefined &&
      existing.imageUrl &&
      existing.imageUrl !== updated.imageUrl
    ) {
      this.cloudinaryService
        .deleteMediaFromUrl(existing.imageUrl)
        .catch(() => {});
    }

    // Suppression automatique de l'ancien fond si remplacé
    if (
      data.bgImageUrl !== undefined &&
      existing.bgImageUrl &&
      existing.bgImageUrl !== updated.bgImageUrl
    ) {
      this.cloudinaryService
        .deleteMediaFromUrl(existing.bgImageUrl)
        .catch(() => {});
    }

    // Invalide le cache public Redis
    try {
      await this.redisService.del(CACHE_KEY_PUBLIC_LOCKS);
    } catch {
      // Ignorer l'erreur d'invalidation Redis
    }

    this.logger.log(
      `[ModuleLock] "${key}" mis à jour : isLocked=${updated.isLocked} (Image: ${updated.imageUrl || 'aucune'}, Fond: ${updated.bgImageUrl || 'aucun'})`,
    );

    return updated;
  }

  /**
   * Supprime un module (jeu ou catégorie) et son illustration Cloudinary.
   */
  async deleteModuleLock(key: string) {
    const existing = await this.prisma.moduleLock.findUnique({
      where: { key },
    });

    if (!existing) {
      throw new NotFoundException(`Module avec la clé "${key}" non trouvé.`);
    }

    await this.prisma.moduleLock.delete({
      where: { key },
    });

    // Suppression de l'illustration associée
    if (existing.imageUrl) {
      this.cloudinaryService
        .deleteMediaFromUrl(existing.imageUrl)
        .catch(() => {});
    }

    // Invalide le cache public Redis
    try {
      await this.redisService.del(CACHE_KEY_PUBLIC_LOCKS);
    } catch {
      // Ignorer l'erreur d'invalidation Redis
    }

    this.logger.log(`🗑️ [ModuleLock] Module supprimé : ${key}`);
    return { success: true, deletedKey: key };
  }

  /**
   * Sauvegarde une image uploadée en base64 vers Cloudinary CDN (avec fallback local si non configuré)
   */
  async saveUploadedImage(
    base64Data: string,
    originalName?: string,
    subfolder = 'modules',
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
      (subfolder || 'modules').replace(/[^a-zA-Z0-9_-]/g, '') || 'modules';

    if (this.cloudinaryService.isConfigured()) {
      try {
        const cloudinaryUrl = await this.cloudinaryService.uploadImageBase64(
          base64Data,
          originalName,
          `kanto/images/${safeSubfolder}`,
        );
        this.logger.log(
          `[Cloudinary] Image hébergée avec succès : ${cloudinaryUrl}`,
        );
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
      : 'image';
    const fileName = `${safeName}-${Date.now()}.${extension}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    this.logger.log(
      `[Local] Image enregistrée en local : /uploads/${safeSubfolder}/${fileName}`,
    );
    return { url: `/uploads/${safeSubfolder}/${fileName}`, provider: 'local' };
  }
}
