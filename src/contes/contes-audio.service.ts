import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { GeminiTtsService } from '../integrations/gemini/gemini-tts.service.js';
import { CloudinaryService } from '../integrations/cloudinary/cloudinary.service.js';

@Injectable()
export class ContesAudioService {
  private readonly logger = new Logger(ContesAudioService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiTtsService: GeminiTtsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Génère la voix IA d'un conte via Google Gemini TTS (@google/genai) et stocke le fichier sur Cloudinary CDN.
   */
  async generateAudio(
    idOrSlug: string,
    language: 'mg' | 'fr' = 'mg',
    voiceId?: string,
    force = false,
  ) {
    const conte = await this.prisma.conte.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: {
        paragraphs: { orderBy: { paragraphNumber: 'asc' } },
      },
    });

    if (!conte) {
      throw new NotFoundException(`Conte "${idOrSlug}" introuvable`);
    }

    const cachedUrl = language === 'mg' ? conte.audioUrlMg : conte.audioUrlFr;
    if (cachedUrl && !force) {
      this.logger.log(
        `💾 [Cache] Audio (${language}) déjà disponible pour "${conte.slug}" : ${cachedUrl}`,
      );
      return {
        id: conte.id,
        slug: conte.slug,
        audioUrl: cachedUrl,
        language,
        status: 'CACHED',
      };
    }

    const titleText =
      language === 'mg' ? conte.title : conte.titleFr || conte.title;

    const paragraphTexts = (conte.paragraphs ?? [])
      .map((p) => (language === 'mg' ? p.textMg : p.textFr)?.trim())
      .filter((t): t is string => !!t);

    const moralText =
      language === 'mg' && conte.moralMg
        ? `Fianarana tsoahina amin'ity angano ity : ${conte.moralMg}`
        : language === 'fr' && (conte.moralFr || conte.moralMg)
          ? `Morale du conte : ${conte.moralFr || conte.moralMg}`
          : null;

    const rawParts = [
      titleText,
      ...paragraphTexts,
      ...(moralText ? [moralText] : []),
    ];

    // Nettoyage et ponctuation propre de chaque section (évite les doubles points '..')
    const fullText = rawParts
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
      .map((p) => (/[.!?…»"]$/.test(p) ? p : `${p}.`))
      .join('\n\n');

    this.logger.log(
      `🎙️ [GenerateAudio] Conte "${conte.slug}" (${language}) — ${fullText.length} caractères, ${paragraphTexts.length} paragraphes`,
    );

    const audioBuffer = await this.geminiTtsService.generateSpeechBuffer({
      text: fullText,
      voiceName: voiceId ?? process.env.GEMINI_TTS_VOICE ?? 'Charon',
      language,
    });

    const publicId = `${conte.slug || conte.id}-${language}`;
    if (!this.cloudinaryService.isConfigured()) {
      throw new BadRequestException(
        'Cloudinary n’est pas configuré. Impossible d’héberger l’audio sur le CDN.',
      );
    }

    let audioUrl: string;
    try {
      audioUrl = await this.cloudinaryService.uploadAudioBuffer(
        audioBuffer,
        publicId,
        'kanto/audio/contes',
      );
      this.logger.log(
        `[Cloudinary] Audio (${language}) hébergé avec succès sur CDN : ${audioUrl}`,
      );
    } catch (cloudinaryError: any) {
      this.logger.error(
        `[Cloudinary] Échec de l’upload : ${cloudinaryError?.message}`,
      );
      throw new BadRequestException(
        `Échec de l'hébergement Cloudinary : ${cloudinaryError?.message || 'Erreur inconnue'}`,
      );
    }

    const updatedConte = await this.prisma.conte.update({
      where: { id: conte.id },
      data:
        language === 'mg'
          ? { audioUrlMg: audioUrl, isHumanVoiceMg: false }
          : { audioUrlFr: audioUrl, isHumanVoiceFr: false },
      select: {
        id: true,
        slug: true,
        audioUrlMg: true,
        audioUrlFr: true,
        isHumanVoiceMg: true,
        isHumanVoiceFr: true,
      },
    });

    this.logger.log(
      `✅ [GenerateAudio] Audio IA (${language}) généré et enregistré : ${audioUrl}`,
    );

    return {
      id: updatedConte.id,
      slug: updatedConte.slug,
      audioUrl,
      language,
      audioUrlMg: updatedConte.audioUrlMg,
      audioUrlFr: updatedConte.audioUrlFr,
      isHumanVoiceMg: updatedConte.isHumanVoiceMg,
      isHumanVoiceFr: updatedConte.isHumanVoiceFr,
      status: 'SUCCESS',
    };
  }

  /**
   * Téléverse un fichier audio fourni (humain ou pré-enregistré) vers Cloudinary CDN.
   */
  async uploadAudio(
    idOrSlug: string,
    language: 'mg' | 'fr',
    base64Data: string,
    isHumanVoice = true,
  ) {
    const conte = await this.prisma.conte.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    });

    if (!conte) {
      throw new NotFoundException(`Conte "${idOrSlug}" introuvable`);
    }

    if (!base64Data || typeof base64Data !== 'string') {
      throw new BadRequestException('Fichier audio invalide ou manquant');
    }

    // Décodage du buffer base64
    let buffer: Buffer;
    const matches = base64Data.match(/^data:([A-Za-z0-9-+/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(base64Data, 'base64');
    }

    // Limite de taille : 25 Mo max pour les enregistrements de contes
    const MAX_AUDIO_SIZE = 25 * 1024 * 1024;
    if (buffer.length > MAX_AUDIO_SIZE) {
      throw new BadRequestException(
        `Fichier audio trop volumineux (${(buffer.length / 1024 / 1024).toFixed(1)} Mo). Limite : 25 Mo.`,
      );
    }

    if (!this.cloudinaryService.isConfigured()) {
      throw new BadRequestException(
        'Cloudinary n’est pas configuré. Impossible d’héberger l’audio sur le CDN.',
      );
    }

    const publicId = `${conte.slug || conte.id}-${language}-human-${Date.now()}`;
    let audioUrl: string;

    try {
      audioUrl = await this.cloudinaryService.uploadAudioBuffer(
        buffer,
        publicId,
        'kanto/audio/contes/human',
      );
    } catch (cloudinaryError: any) {
      this.logger.error(
        `[Cloudinary] Échec de l’upload audio humain : ${cloudinaryError?.message}`,
      );
      throw new BadRequestException(
        `Échec de l'hébergement Cloudinary : ${cloudinaryError?.message || 'Erreur inconnue'}`,
      );
    }

    const updated = await this.prisma.conte.update({
      where: { id: conte.id },
      data:
        language === 'mg'
          ? { audioUrlMg: audioUrl, isHumanVoiceMg: isHumanVoice }
          : { audioUrlFr: audioUrl, isHumanVoiceFr: isHumanVoice },
      select: {
        id: true,
        slug: true,
        audioUrlMg: true,
        audioUrlFr: true,
        isHumanVoiceMg: true,
        isHumanVoiceFr: true,
      },
    });

    this.logger.log(
      `🎙️ [UploadAudio] Audio ${isHumanVoice ? 'humain' : 'personnalisé'} (${language}) enregistré pour "${conte.slug}" : ${audioUrl}`,
    );

    return {
      id: updated.id,
      slug: updated.slug,
      audioUrl,
      language,
      audioUrlMg: updated.audioUrlMg,
      audioUrlFr: updated.audioUrlFr,
      isHumanVoiceMg: updated.isHumanVoiceMg,
      isHumanVoiceFr: updated.isHumanVoiceFr,
      status: 'SUCCESS',
    };
  }

  /**
   * Génère les deux pistes audio (mg + fr) en parallèle.
   */
  async generateAudioBothLanguages(
    idOrSlug: string,
    voiceId?: string,
    force = false,
  ) {
    const [mg, fr] = await Promise.allSettled([
      this.generateAudio(idOrSlug, 'mg', voiceId, force),
      this.generateAudio(idOrSlug, 'fr', voiceId, force),
    ]);

    return {
      mg:
        mg.status === 'fulfilled'
          ? mg.value
          : {
              status: 'ERROR',
              error: mg.reason?.message,
            },
      fr:
        fr.status === 'fulfilled'
          ? fr.value
          : {
              status: 'ERROR',
              error: fr.reason?.message,
            },
    };
  }
}
