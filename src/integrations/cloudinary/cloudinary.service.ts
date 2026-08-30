import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'node:stream';

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
        `☁️ [Cloudinary] Configuré — cloud: "${c.cloud_name}", api_key: "${String(c.api_key).slice(0, 6)}..."`,
      );
    } else {
      this.logger.warn(
        '⚠️ [Cloudinary] Identifiants manquants — vérifiez CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET dans .env',
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
      // Données brutes sans data URI : on tente JPEG par défaut
      mimeType = 'image/jpeg';
      buffer = Buffer.from(base64Data, 'base64');
    }

    // Vérification taille
    if (buffer.length > this.MAX_UPLOAD_SIZE_BYTES) {
      const sizeMB = (buffer.length / 1024 / 1024).toFixed(2);
      throw new BadRequestException(
        `Fichier trop volumineux : ${sizeMB} MB (maximum autorisé : 5 MB)`,
      );
    }

    // Vérification type MIME
    if (!this.ALLOWED_IMAGE_MIME_TYPES.has(mimeType)) {
      throw new BadRequestException(
        `Type de fichier non autorisé : "${mimeType}". Types acceptés : JPEG, PNG, WebP, GIF.`,
      );
    }

    return { buffer, mimeType };
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

    const sizeKB = (buffer.length / 1024).toFixed(1);
    this.logger.log(
      `☁️ [Cloudinary] Upload ${sizeKB} KB → "${folder}/${publicId}"`,
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
            const msg = error?.message ?? 'Réponse vide de Cloudinary';
            this.logger.error(`❌ [Cloudinary] Erreur upload : ${msg}`);
            return reject(new BadRequestException(`Cloudinary : ${msg}`));
          }

          this.logger.log(
            `✅ [Cloudinary] Hébergé (${(result.bytes / 1024).toFixed(1)} KB) : ${result.secure_url}`,
          );
          resolve(result.secure_url);
        },
      );

      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
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
        'Cloudinary non configuré. Vérifiez CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET dans .env',
      );
    }

    const sizeKB = (buffer.length / 1024).toFixed(1);
    this.logger.log(
      `☁️ [Cloudinary] Upload Image ${sizeKB} KB → "${folder}/${publicId || 'auto'}"`,
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
            const msg = error?.message ?? 'Réponse vide de Cloudinary';
            this.logger.error(`❌ [Cloudinary] Erreur upload image : ${msg}`);
            return reject(new BadRequestException(`Cloudinary : ${msg}`));
          }

          this.logger.log(
            `✅ [Cloudinary] Image hébergée (${(result.bytes / 1024).toFixed(1)} KB) : ${result.secure_url}`,
          );
          resolve(result.secure_url);
        },
      );

      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
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
   * Supprime un asset audio de Cloudinary (ex : pour régénérer la voix)
   */
  async deleteAudio(publicId: string): Promise<void> {
    if (!this.isConfigured()) return;

    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
      this.logger.log(`🗑️ [Cloudinary] Asset audio supprimé : ${publicId}`);
    } catch (e: unknown) {
      this.logger.warn(
        `⚠️ [Cloudinary] Suppression audio échouée pour "${publicId}" : ${
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
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      this.logger.log(`🗑️ [Cloudinary] Image supprimée : ${publicId}`);
    } catch (e: unknown) {
      this.logger.warn(
        `⚠️ [Cloudinary] Suppression image échouée pour "${publicId}" : ${
          e instanceof Error ? e.message : String(e)
        }`,
      );
    }
  }
}
