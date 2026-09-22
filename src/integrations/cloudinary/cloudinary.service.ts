import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'node:stream';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private readonly defaultFolder = 'kanto/audio/contes';

  constructor() {
    if (process.env.CLOUDINARY_URL) {
      cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });
    } else {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });
    }

    // Diagnostic (sans exposer les secrets)
    const c = cloudinary.config();
    const configured = !!(c.cloud_name && c.api_key && c.api_secret);
    if (configured) {
      this.logger.log(
        `[Cloudinary] Configure — cloud: "${c.cloud_name}", api_key: "${String(c.api_key).slice(0, 6)}..."`,
      );
    } else {
      this.logger.warn(
        '[Cloudinary] Identifiants manquants — verifiez CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET dans .env',
      );
    }
  }

  isConfigured(): boolean {
    const c = cloudinary.config();
    return !!(
      process.env.CLOUDINARY_URL ||
      (c.cloud_name && c.api_key && c.api_secret)
    );
  }

  /**
   * Verifie si l'API Cloudinary est reellement joignable et operationnelle (ping).
   */
  async isAvailable(): Promise<boolean> {
    if (!this.isConfigured()) return false;
    try {
      const res = (await cloudinary.api.ping()) as { status?: string };
      return res?.status === 'ok';
    } catch (err: unknown) {
      this.logger.debug?.(
        `[Cloudinary] Indisponible au ping : ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
      return false;
    }
  }

  /**
   * WHITELIST des types MIME d'image autorisés.
   * Tout autre type (PDF, EXE, SVG non listé, etc.) est rejeté.
   */
  private readonly ALLOWED_IMAGE_MIME_TYPES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ]);

  /** Taille maximale autorisée pour un upload base64 : 5 MB (en octets du buffer décodé) */
  private readonly MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

  /**
   * Valide qu'une chaîne base64 (ou data URI) respecte :
   * - La taille maximale autorisée (5 MB)
   * - Un type MIME dans la whitelist des images
   *
   * @throws BadRequestException si la validation échoue
   * @returns Le buffer décodé + le type MIME détecté
   */
  validateAndDecodeBase64Image(base64Data: string): {
    buffer: Buffer;
    mimeType: string;
  } {
    const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    let buffer: Buffer;
    let mimeType: string;

    if (matches && matches.length === 3) {
      mimeType = matches[1].toLowerCase();
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(base64Data, 'base64');
    }

    // Vérification taille maximale (5 MB)
    if (buffer.length > this.MAX_UPLOAD_SIZE_BYTES) {
      const sizeMB = (buffer.length / 1024 / 1024).toFixed(2);
      throw new BadRequestException(
        `Fichier trop volumineux : ${sizeMB} MB (maximum autorisé : 5 MB)`,
      );
    }

    // Sécurité : Validation stricte des Magic Bytes pour garantir l'authenticité de l'image
    const detectedMime = this.detectImageMimeFromBuffer(buffer);
    if (!detectedMime || !this.ALLOWED_IMAGE_MIME_TYPES.has(detectedMime)) {
      throw new BadRequestException(
        'Contenu rejeté : le fichier ne correspond pas à une image valide (formats acceptés : JPEG, PNG, WebP, GIF).',
      );
    }

    // Utilise le type MIME authentifié par les octets binaires
    mimeType = detectedMime;

    return { buffer, mimeType };
  }

  /**
   * Vérifie les Magic Numbers d'en-tête binaire pour authentifier le format réel.
   */
  detectImageMimeFromBuffer(buffer: Buffer): string | null {
    if (buffer.length < 12) return null;

    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return 'image/jpeg';
    }
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    ) {
      return 'image/png';
    }
    // GIF: GIF87a ou GIF89a
    if (
      buffer[0] === 0x47 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x38
    ) {
      return 'image/gif';
    }
    // WebP: RIFF .... WEBP
    if (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    ) {
      return 'image/webp';
    }

    return null;
  }

  /**
   * Téléverse un buffer audio MP3 vers Cloudinary CDN.
   * Utilise `resource_type: 'video'` car Cloudinary range les audios dans cette catégorie.
   * @returns URL HTTPS Cloudinary du flux audio
   */
  async uploadAudioBuffer(
    buffer: Buffer,
    publicId: string,
    folder = this.defaultFolder,
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new BadRequestException(
        'Cloudinary non configuré. Vérifiez CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET dans .env',
      );
    }

    const sizeStr =
      buffer.length < 1024
        ? `${buffer.length} octets`
        : `${(buffer.length / 1024).toFixed(1)} KB`;
    this.logger.log(
      `[Cloudinary] Upload ${sizeStr} -> "${folder}/${publicId}"`,
    );

    return new Promise<string>((resolve, reject) => {
      /**
       * Avec api_key + api_secret, Cloudinary utilise un upload SIGNÉ.
       * Dans ce cas, on ne doit PAS passer upload_preset — les credentials
       * signés suffisent et ont priorité sur le preset du dashboard.
       *
       * resource_type: 'video' = seule façon d'uploader de l'audio sur Cloudinary.
       */
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder,
          public_id: publicId,
          overwrite: true,
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            const msg = error?.message ?? 'Reponse vide de Cloudinary';
            this.logger.error(`[Cloudinary] Erreur upload : ${msg}`);
            return reject(new BadRequestException(`Cloudinary : ${msg}`));
          }

          this.logger.log(
            `[Cloudinary] Heberge (${(result.bytes / 1024).toFixed(1)} KB) : ${result.secure_url}`,
          );
          resolve(result.secure_url);
        },
      );

      Readable.from(buffer).pipe(uploadStream);
    });
  }

  /**
   * Téléverse un buffer image (PNG, JPG, WebP, GIF, SVG) vers Cloudinary CDN.
   * @param buffer Buffer binaire de l'image
   * @param publicId Identifiant ou nom unique du fichier (sans extension)
   * @param folder Dossier Cloudinary cible (par défaut: 'kanto/images/modules')
   * @returns URL HTTPS sécurisée de l'image hébergée sur Cloudinary CDN
   */
  async uploadImageBuffer(
    buffer: Buffer,
    publicId?: string,
    folder = 'kanto/images/modules',
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new BadRequestException(
        'Cloudinary non configure. Verifiez CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET dans .env',
      );
    }

    const sizeStr =
      buffer.length < 1024
        ? `${buffer.length} octets`
        : `${(buffer.length / 1024).toFixed(1)} KB`;
    this.logger.log(
      `[Cloudinary] Upload Image ${sizeStr} -> "${folder}/${publicId || 'auto'}"`,
    );

    return new Promise<string>((resolve, reject) => {
      const options: Record<string, any> = {
        resource_type: 'image',
        folder,
        overwrite: true,
      };
      if (publicId) {
        options.public_id = publicId;
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            const msg = error?.message ?? 'Reponse vide de Cloudinary';
            this.logger.error(`[Cloudinary] Erreur upload image : ${msg}`);
            return reject(new BadRequestException(`Cloudinary : ${msg}`));
          }

          this.logger.log(
            `[Cloudinary] Image hebergee (${(result.bytes / 1024).toFixed(1)} KB) : ${result.secure_url}`,
          );
          resolve(result.secure_url);
        },
      );

      Readable.from(buffer).pipe(uploadStream);
    });
  }

  /**
   * Téléverse une image encodée en base64 ou Data URI vers Cloudinary CDN.
   * @param base64Data Chaîne Base64 ou Data URI (ex: data:image/png;base64,...)
   * @param originalName Nom d'origine du fichier pour forger le public_id
   * @param folder Dossier Cloudinary cible
   */
  async uploadImageBase64(
    base64Data: string,
    originalName?: string,
    folder = 'kanto/images/modules',
  ): Promise<string> {
    const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    let buffer: Buffer;

    if (matches && matches.length === 3) {
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(base64Data, 'base64');
    }

    const safeName = originalName
      ? originalName
          .replace(/\.[^/.]+$/, '')
          .replace(/[^a-zA-Z0-9_-]/g, '_')
          .toLowerCase()
      : 'module';
    const publicId = `${safeName}_${Date.now()}`;

    return this.uploadImageBuffer(buffer, publicId, folder);
  }

  /**
   * Extrait le public_id Cloudinary et le resource_type depuis une URL Cloudinary complète.
   * Retourne null si l'URL n'est pas hébergée sur Cloudinary.
   */
  extractPublicIdFromUrl(url?: string | null): {
    publicId: string;
    resourceType: 'image' | 'video' | 'raw';
  } | null {
    if (!url || typeof url !== 'string') return null;
    if (!url.includes('res.cloudinary.com')) return null;

    try {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname;
      const uploadIdx = pathname.indexOf('/upload/');
      if (uploadIdx === -1) return null;

      // Déterminer le resource_type
      const beforeUpload = pathname.substring(0, uploadIdx);
      let resourceType: 'image' | 'video' | 'raw' = 'image';
      if (beforeUpload.includes('/video/')) {
        resourceType = 'video';
      } else if (beforeUpload.includes('/raw/')) {
        resourceType = 'raw';
      }

      const afterUpload = pathname.substring(uploadIdx + '/upload/'.length);

      // Si le dossier racine kanto/ est présent dans le chemin
      const kantoIdx = afterUpload.indexOf('kanto/');
      let rawId: string;
      if (kantoIdx !== -1) {
        rawId = afterUpload.substring(kantoIdx);
      } else {
        // Enlève les transformations et préfixes de version éventuels v\d+/
        rawId = afterUpload.replace(/^.*v\d+\//, '');
      }

      // Enlever l'extension (.jpg, .png, .webp, .mp3, etc.)
      const lastDot = rawId.lastIndexOf('.');
      const publicId = lastDot !== -1 ? rawId.substring(0, lastDot) : rawId;

      if (!publicId) return null;

      return { publicId, resourceType };
    } catch {
      return null;
    }
  }

  /**
   * Supprime un média (image ou audio) hébergé soit sur Cloudinary soit en local (/uploads/...).
   * Ne supprime jamais les URLs externes (Unsplash, etc.) et ne supprime sur Cloudinary
   * que les ressources identifiées sous le projet.
   * @param url URL complète ou chemin local du média à supprimer
   * @returns true si une suppression a été effectuée, false sinon
   */
  async deleteMediaFromUrl(url?: string | null): Promise<boolean> {
    if (!url || typeof url !== 'string') return false;

    // 1. Cas Cloudinary
    const cloudinaryInfo = this.extractPublicIdFromUrl(url);
    if (cloudinaryInfo) {
      if (!this.isConfigured()) return false;
      try {
        const res = await cloudinary.uploader.destroy(cloudinaryInfo.publicId, {
          resource_type: cloudinaryInfo.resourceType,
          invalidate: true,
        });
        this.logger.log(
          `[Cloudinary] Asset supprime : "${cloudinaryInfo.publicId}" (${cloudinaryInfo.resourceType}) -> resultat: ${res?.result || 'ok'}`,
        );
        return true;
      } catch (err: unknown) {
        this.logger.warn(
          `[Cloudinary] Echec suppression asset "${cloudinaryInfo.publicId}" : ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
        return false;
      }
    }

    // 2. Cas Stockage Local de secours (/uploads/...)
    if (url.startsWith('/uploads/') || url.includes('/uploads/')) {
      try {
        const relativePart = url.startsWith('/uploads/')
          ? url.replace('/uploads/', '')
          : url.split('/uploads/')[1];
        const localPath = path.resolve(process.cwd(), 'uploads', relativePart);
        if (fs.existsSync(localPath)) {
          await fs.promises.unlink(localPath);
          this.logger.log(`[Local] Fichier supprime du disque : "${localPath}"`);
          return true;
        }
      } catch (err: unknown) {
        this.logger.warn(
          `[Local] Echec suppression fichier local "${url}" : ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
    }

    return false;
  }

  /**
   * Supprime un asset audio de Cloudinary (ex : pour régénérer la voix)
   */
  async deleteAudio(publicId: string): Promise<void> {
    if (!this.isConfigured()) return;

    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'video',
        invalidate: true,
      });
      this.logger.log(`[Cloudinary] Asset audio supprime : ${publicId}`);
    } catch (e: unknown) {
      this.logger.warn(
        `[Cloudinary] Suppression audio echouee pour "${publicId}" : ${
          e instanceof Error ? e.message : String(e)
        }`,
      );
    }
  }

  /**
   * Supprime une image de Cloudinary
   */
  async deleteImage(publicId: string): Promise<void> {
    if (!this.isConfigured()) return;

    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
        invalidate: true,
      });
      this.logger.log(`[Cloudinary] Image supprimee : ${publicId}`);
    } catch (e: unknown) {
      this.logger.warn(
        `[Cloudinary] Suppression image echouee pour "${publicId}" : ${
          e instanceof Error ? e.message : String(e)
        }`,
      );
    }
  }
}
