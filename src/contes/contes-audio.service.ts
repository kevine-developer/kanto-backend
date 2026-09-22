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
        ? `Fianarana : ${conte.moralMg}`
        : language === 'fr' && (conte.moralFr || conte.moralMg)
          ? `Morale : ${conte.moralFr || conte.moralMg}`
          : null;

    const parts = [
      titleText,
      ...paragraphTexts,
      ...(moralText ? [moralText] : []),
    ];
    const fullText = parts.join('.\n\n');

    this.logger.log(
      `🎙️ [GenerateAudio] Conte "${conte.slug}" (${language}) — ${fullText.length} caractères, ${paragraphTexts.length} paragraphes`,
    );

    const audioBuffer = await this.geminiTtsService.generateSpeechBuffer({
      text: fullText,
      voiceName: voiceId ?? process.env.GEMINI_TTS_VOICE ?? 'Orus',
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
        language === 'mg' ? { audioUrlMg: audioUrl } : { audioUrlFr: audioUrl },
      select: { id: true, slug: true, audioUrlMg: true, audioUrlFr: true },
    });

    this.logger.log(
      `✅ [GenerateAudio] Audio (${language}) généré et enregistré : ${audioUrl}`,
    );

    return {
      id: updatedConte.id,
      slug: updatedConte.slug,
      audioUrl,
      language,
      audioUrlMg: updatedConte.audioUrlMg,
      audioUrlFr: updatedConte.audioUrlFr,
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
