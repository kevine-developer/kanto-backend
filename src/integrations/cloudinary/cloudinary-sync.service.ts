import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { CloudinaryService } from './cloudinary.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';

export interface CloudinarySyncResult {
  migratedCount: number;
  errorsCount: number;
  totalFound: number;
  skipped: boolean;
  message: string;
}

@Injectable()
export class CloudinarySyncService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CloudinarySyncService.name);
  private isSyncing = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private readonly uploadsRoot = path.resolve(process.cwd(), 'uploads');

  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  onModuleInit() {
    // Lancement en arriere-plan au demarrage avec un court delai
    const initialTimer = setTimeout(() => {
      this.syncLocalUploadsToCloudinary().catch((err) => {
        this.logger.error(
          `[Sync] Erreur lors de la synchronisation initiale : ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      });
    }, 5000);
    initialTimer.unref();

    // Verification periodique toutes les 10 minutes (600 000 ms)
    this.syncInterval = setInterval(
      () => {
        this.syncLocalUploadsToCloudinary().catch((err) => {
          this.logger.debug?.(
            `[Sync] Erreur verification periodique : ${
              err instanceof Error ? err.message : String(err)
            }`,
          );
        });
      },
      10 * 60 * 1000,
    );
    this.syncInterval.unref();
  }

  onModuleDestroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Scanne et migre tous les fichiers du dossier uploads/ vers Cloudinary
   * des que le service Cloudinary est joignable.
   */
  async syncLocalUploadsToCloudinary(): Promise<CloudinarySyncResult> {
    if (this.isSyncing) {
      return {
        migratedCount: 0,
        errorsCount: 0,
        totalFound: 0,
        skipped: true,
        message: 'Synchronisation deja en cours.',
      };
    }

    if (!fs.existsSync(this.uploadsRoot)) {
      return {
        migratedCount: 0,
        errorsCount: 0,
        totalFound: 0,
        skipped: true,
        message: 'Dossier uploads inexistant.',
      };
    }

    const available = await this.cloudinaryService.isAvailable();
    if (!available) {
      this.logger.debug?.(
        '[Sync] Cloudinary indisponible. Fichiers locaux conserves en attente de reconnexion.',
      );
      return {
        migratedCount: 0,
        errorsCount: 0,
        totalFound: 0,
        skipped: true,
        message: 'Cloudinary indisponible actuellement.',
      };
    }

    const localFiles = await this.collectFiles(this.uploadsRoot);
    if (localFiles.length === 0) {
      return {
        migratedCount: 0,
        errorsCount: 0,
        totalFound: 0,
        skipped: false,
        message: 'Aucun fichier local a migrer.',
      };
    }

    this.isSyncing = true;
    this.logger.log(
      `[Sync] ${localFiles.length} fichier(s) local(aux) detecte(s) dans uploads/. Debut migration vers Cloudinary...`,
    );

    let migratedCount = 0;
    let errorsCount = 0;

    try {
      for (const filePath of localFiles) {
        try {
          const success = await this.migrateSingleFile(filePath);
          if (success) {
            migratedCount++;
          } else {
            errorsCount++;
          }
        } catch (fileErr) {
          errorsCount++;
          this.logger.error(
            `[Sync] Echec migration fichier "${filePath}" : ${
              fileErr instanceof Error ? fileErr.message : String(fileErr)
            }`,
          );
        }
      }

      if (migratedCount > 0) {
        await this.invalidateCaches();
        await this.cleanEmptyDirectories(this.uploadsRoot);
      }

      this.logger.log(
        `[Sync] Migration terminee : ${migratedCount} fichier(s) deplace(s) et supprime(s) en local, ${errorsCount} erreur(s).`,
      );

      return {
        migratedCount,
        errorsCount,
        totalFound: localFiles.length,
        skipped: false,
        message: `Migration reussie : ${migratedCount} fichier(s) transferes vers Cloudinary.`,
      };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Migre un fichier unique vers Cloudinary, met a jour les tables en BDD et supprime le fichier local.
   */
  private async migrateSingleFile(filePath: string): Promise<boolean> {
    const relPath = path
      .relative(this.uploadsRoot, filePath)
      .replace(/\\/g, '/');
    const pathParts = relPath.split('/');
    const subfolder = pathParts.length > 1 ? pathParts[0] : 'general';
    const fileName = path.basename(filePath);
    const safeBaseName = path
      .parse(fileName)
      .name.replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    const ext = path.extname(filePath).toLowerCase();

    const isAudio =
      subfolder === 'audio' ||
      ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'].includes(ext);

    const buffer = await fs.promises.readFile(filePath);

    // Verification de l'authenticite binaire pour eviter les rejets "Invalid image file"
    if (!isAudio) {
      const detectedMime =
        this.cloudinaryService.detectImageMimeFromBuffer(buffer);
      if (!detectedMime) {
        const isReferenced = await this.isReferencedInDatabase(
          relPath,
          fileName,
        );
        if (!isReferenced) {
          this.logger.warn(
            `[Sync] Fichier orphelin non-image detecte et purge du disque : "${relPath}" (${buffer.length} octets)`,
          );
          await fs.promises.unlink(filePath).catch(() => {});
          return true; // Fichier orphelin non valide nettoye
        }
        this.logger.error(
          `[Sync] Fichier image corrompu reference en BDD : "${relPath}" (${buffer.length} octets) - transfert ignore.`,
        );
        return false;
      }
    } else if (buffer.length < 32) {
      const isReferenced = await this.isReferencedInDatabase(relPath, fileName);
      if (!isReferenced) {
        this.logger.warn(
          `[Sync] Fichier audio orphelin vide purge : "${relPath}" (${buffer.length} octets)`,
        );
        await fs.promises.unlink(filePath).catch(() => {});
        return true;
      }
      return false;
    }

    let secureUrl: string;

    if (isAudio) {
      const audioFolder =
        pathParts.length > 2
          ? `kanto/audio/${pathParts.slice(0, -1).join('/')}`
          : `kanto/audio/${subfolder}`;
      secureUrl = await this.cloudinaryService.uploadAudioBuffer(
        buffer,
        `${safeBaseName}_${Date.now()}`,
        audioFolder,
      );
    } else {
      const imageFolder = `kanto/images/${subfolder}`;
      secureUrl = await this.cloudinaryService.uploadImageBuffer(
        buffer,
        `${safeBaseName}_${Date.now()}`,
        imageFolder,
      );
    }

    if (!secureUrl) {
      return false;
    }

    // Mise a jour de la base de donnees pour toute entite qui reference ce fichier
    await this.updateDatabaseReferences(relPath, fileName, secureUrl);

    // Suppression securisee du fichier local une fois le televersement et la mise a jour BDD valides
    try {
      await fs.promises.unlink(filePath);
      this.logger.log(
        `[Sync] Fichier supprime en local : ${relPath} -> ${secureUrl}`,
      );
    } catch (unlinkErr) {
      this.logger.warn(
        `[Sync] Impossible de supprimer le fichier local "${filePath}" : ${
          unlinkErr instanceof Error ? unlinkErr.message : String(unlinkErr)
        }`,
      );
    }

    return true;
  }

  /**
   * Met a jour toutes les tables Prisma ou l'URL locale peut etre stockee.
   */
  private async updateDatabaseReferences(
    relPath: string,
    fileName: string,
    secureUrl: string,
  ): Promise<void> {
    const searchPattern = relPath;
    const filePattern = fileName;

    await Promise.allSettled([
      // 1. Utilisateurs (avatars)
      this.prisma.user.updateMany({
        where: {
          OR: [
            { image: { contains: searchPattern } },
            { image: { contains: filePattern } },
          ],
        },
        data: { image: secureUrl },
      }),

      // 2. Modules verrouilles (icones et illustrations)
      this.prisma.moduleLock.updateMany({
        where: {
          OR: [
            { imageUrl: { contains: searchPattern } },
            { imageUrl: { contains: filePattern } },
          ],
        },
        data: { imageUrl: secureUrl },
      }),

      // 3. Histoire & Patrimoine : Lecons civiques
      this.prisma.civicLesson.updateMany({
        where: {
          OR: [
            { imageUrl: { contains: searchPattern } },
            { imageUrl: { contains: filePattern } },
          ],
        },
        data: { imageUrl: secureUrl },
      }),

      // 4. Histoire & Patrimoine : Presidents
      this.prisma.president.updateMany({
        where: {
          OR: [
            { imageUrl: { contains: searchPattern } },
            { imageUrl: { contains: filePattern } },
          ],
        },
        data: { imageUrl: secureUrl },
      }),

      // 5. Histoire & Patrimoine : Billets de banque
      this.prisma.banknote.updateMany({
        where: {
          OR: [
            { imageUrl: { contains: searchPattern } },
            { imageUrl: { contains: filePattern } },
          ],
        },
        data: { imageUrl: secureUrl },
      }),

      // 6. Histoire & Patrimoine : Blasons des provinces
      this.prisma.provinceBlason.updateMany({
        where: {
          OR: [
            { imageUrl: { contains: searchPattern } },
            { imageUrl: { contains: filePattern } },
          ],
        },
        data: { imageUrl: secureUrl },
      }),

      // 7. Histoire & Patrimoine : Emblemes de la nature
      this.prisma.natureEmblem.updateMany({
        where: {
          OR: [
            { imageUrl: { contains: searchPattern } },
            { imageUrl: { contains: filePattern } },
          ],
        },
        data: { imageUrl: secureUrl },
      }),

      // 8. Histoire & Patrimoine : Dates historiques
      this.prisma.historyDate.updateMany({
        where: {
          OR: [
            { imageUrl: { contains: searchPattern } },
            { imageUrl: { contains: filePattern } },
          ],
        },
        data: { imageUrl: secureUrl },
      }),

      // 9. Histoire & Patrimoine : Sceaux et emblemes nationaux
      this.prisma.nationalEmblem.updateMany({
        where: {
          OR: [
            { imageUrl: { contains: searchPattern } },
            { imageUrl: { contains: filePattern } },
          ],
        },
        data: { imageUrl: secureUrl },
      }),

      // 10. Welcome Slides
      this.prisma.welcomeSlide.updateMany({
        where: {
          OR: [
            { imageUrl: { contains: searchPattern } },
            { imageUrl: { contains: filePattern } },
          ],
        },
        data: { imageUrl: secureUrl },
      }),

      // 11. Contes (illustrations et audio)
      this.prisma.conte.updateMany({
        where: {
          OR: [
            { illustration: { contains: searchPattern } },
            { illustration: { contains: filePattern } },
          ],
        },
        data: { illustration: secureUrl },
      }),
      this.prisma.conte.updateMany({
        where: {
          OR: [
            { audioUrlMg: { contains: searchPattern } },
            { audioUrlMg: { contains: filePattern } },
          ],
        },
        data: { audioUrlMg: secureUrl },
      }),
      this.prisma.conte.updateMany({
        where: {
          OR: [
            { audioUrlFr: { contains: searchPattern } },
            { audioUrlFr: { contains: filePattern } },
          ],
        },
        data: { audioUrlFr: secureUrl },
      }),

      // 12. Paragraphes de contes (illustrations)
      this.prisma.conteParagraph.updateMany({
        where: {
          OR: [
            { illustration: { contains: searchPattern } },
            { illustration: { contains: filePattern } },
          ],
        },
        data: { illustration: secureUrl },
      }),
    ]);
  }

  /**
   * Invalide les caches Redis concernes.
   */
  private async invalidateCaches(): Promise<void> {
    try {
      await Promise.allSettled([
        this.redisService.delByPattern('kanto:cache:history:*'),
        this.redisService.delByPattern('kanto:cache:locks:*'),
        this.redisService.delByPattern('kanto:cache:users:*'),
      ]);
      this.logger.debug?.('[Sync] Caches Redis invalides suite a la migration');
    } catch (err: unknown) {
      this.logger.debug?.(
        `[Sync] Invalidation cache Redis ignoree : ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
  }

  /**
   * Recueille recursivement la liste des fichiers presents dans un dossier.
   */
  private async collectFiles(dir: string): Promise<string[]> {
    const results: string[] = [];
    if (!fs.existsSync(dir)) return results;

    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const subFiles = await this.collectFiles(fullPath);
        results.push(...subFiles);
      } else if (entry.isFile()) {
        // Ignorer les fichiers caches ou de configuration (.gitkeep, etc.)
        if (!entry.name.startsWith('.')) {
          results.push(fullPath);
        }
      }
    }
    return results;
  }

  /**
   * Nettoie recursivement les dossiers vides du dossier uploads.
   */
  private async cleanEmptyDirectories(dir: string): Promise<void> {
    if (!fs.existsSync(dir)) return;

    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subDirPath = path.join(dir, entry.name);
        await this.cleanEmptyDirectories(subDirPath);

        try {
          const remaining = await fs.promises.readdir(subDirPath);
          if (remaining.length === 0) {
            await fs.promises.rmdir(subDirPath);
            this.logger.debug?.(`[Sync] Dossier vide supprime : ${subDirPath}`);
          }
        } catch {
          // Ignorer les erreurs de nettoyage de dossier
        }
      }
    }
  }

  /**
   * Verifie si un fichier est reference dans l'une des tables cles de la BDD.
   */
  private async isReferencedInDatabase(
    relPath: string,
    fileName: string,
  ): Promise<boolean> {
    const patterns = [{ contains: relPath }, { contains: fileName }];

    const userCount = await this.prisma.user.count({
      where: { OR: [{ image: patterns[0] }, { image: patterns[1] }] },
    });
    if (userCount > 0) return true;

    const moduleCount = await this.prisma.moduleLock.count({
      where: { OR: [{ imageUrl: patterns[0] }, { imageUrl: patterns[1] }] },
    });
    if (moduleCount > 0) return true;

    const lessonCount = await this.prisma.civicLesson.count({
      where: { OR: [{ imageUrl: patterns[0] }, { imageUrl: patterns[1] }] },
    });
    if (lessonCount > 0) return true;

    return false;
  }
}
