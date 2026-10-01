import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import mime from 'mime';
import * as fs from 'node:fs';
import * as path from 'node:path';

export interface GenerateSpeechOptions {
  text: string;
  language?: 'mg' | 'fr';
  voiceName?: string;
}

interface WavConversionOptions {
  numChannels: number;
  sampleRate: number;
  bitsPerSample: number;
}

@Injectable()
export class GeminiTtsService {
  private readonly logger = new Logger(GeminiTtsService.name);
  private ai: GoogleGenAI | null = null;

  private readonly defaultModel =
    process.env.GEMINI_CONTENT_MODEL_TTS ||
    process.env.GEMINI_TTS_MODEL ||
    'gemini-3.8-flash-tts';

  private readonly defaultVoice = process.env.GEMINI_TTS_VOICE || 'Charon';

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim().length > 0) {
      this.ai = new GoogleGenAI({ apiKey: apiKey.trim() });
      this.logger.log(
        `🎙️ [GeminiTTS] Initialisé avec modèle: "${this.defaultModel}", voix par défaut: "${this.defaultVoice}"`,
      );
    } else {
      this.logger.warn(
        '⚠️ [GeminiTTS] GEMINI_API_KEY non configurée dans le fichier .env',
      );
    }
  }

  isConfigured(): boolean {
    return (
      !!process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY.trim().length > 0
    );
  }

  /**
   * Normalise un texte malgache pour la synthèse vocale :
   * - Transcrit les chiffres arabes en toutes lettres malgaches pour éviter qu'ils soient lus en français/anglais.
   * - Harmonise les apostrophes malgaches pour préserver le liant vocal des mots composés (amin'ny, sns.).
   * - Supprime les artéfacts markdown qui perturbent la prosodie.
   */
  normalizeMalagasyStoryText(text: string): string {
    const numbersMap: Record<string, string> = {
      '0': 'aotra',
      '1': 'iray',
      '2': 'roa',
      '3': 'telo',
      '4': 'efatra',
      '5': 'dimy',
      '6': 'enina',
      '7': 'fito',
      '8': 'valo',
      '9': 'sivy',
      '10': 'folo',
      '11': "iraika ambin'ny folo",
      '12': "roa ambin'ny folo",
      '20': 'roapolo',
      '30': 'telopolo',
      '40': 'efapolo',
      '50': 'dimampolo',
      '100': 'zato',
      '1000': 'arivo',
    };

    return text
      .replace(/[’‘`]/g, "'")
      .replace(/[“”«»]/g, '"')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_{1,2}(.*?)_{1,2}/g, '$1')
      .replace(/\b(1[0-2]|[0-9]|20|30|40|50|100|1000)\b/g, (match) => {
        return numbersMap[match] || match;
      })
      .replace(/\.{3,}|…/g, '... ')
      .replace(/[ \t]+/g, ' ')
      .trim();
  }

  /**
   * Résout le nom de voix optimal pour Gemini TTS.
   * - 'sage' / 'charon' -> Charon (voix masculine posée, grave, idéale pour un sage conteur malgache)
   * - 'renibe' / 'aoede' -> Aoede (voix féminine mélodieuse, chaleureuse, grand-mère conteuse)
   * - 'jeune' / 'puck' -> Puck (voix dynamique et vive)
   * - 'chaleureux' / 'orus' -> Orus (voix chaleureuse)
   * - 'douce' / 'kore' -> Kore (voix féminine posée)
   */
  resolveVoiceName(
    requestedVoice?: string,
    language: 'mg' | 'fr' = 'mg',
  ): string {
    const raw = (requestedVoice || process.env.GEMINI_TTS_VOICE || '')
      .trim()
      .toLowerCase();

    if (
      raw === 'sage' ||
      raw === 'charon' ||
      raw === 'zokiolona' ||
      raw === 'homme'
    ) {
      return 'Charon';
    }
    if (
      raw === 'renibe' ||
      raw === 'aoede' ||
      raw === 'conteuse' ||
      raw === 'femme'
    ) {
      return 'Aoede';
    }
    if (raw === 'puck' || raw === 'jeune' || raw === 'dynamique') {
      return 'Puck';
    }
    if (raw === 'orus') {
      return 'Orus';
    }
    if (raw === 'kore') {
      return 'Kore';
    }
    if (requestedVoice && requestedVoice.trim().length > 0) {
      return requestedVoice.trim();
    }

    // Par défaut pour les angano malgaches : Charon (voix masculine de sage)
    return language === 'mg' ? 'Charon' : 'Charon';
  }

  /**
   * Génère un buffer audio WAV via Google Gemini TTS (@google/genai).
   * Assemble les données PCM reçues en streaming et y injecte un en-tête WAV standard.
   */
  async generateSpeechBuffer(options: GenerateSpeechOptions): Promise<Buffer> {
    if (!this.isConfigured() || !this.ai) {
      throw new BadRequestException(
        'Clé API Gemini non configurée. Veuillez définir GEMINI_API_KEY dans votre fichier .env',
      );
    }

    const { text, language = 'mg', voiceName } = options;

    if (!text?.trim()) {
      throw new BadRequestException('Le texte à convertir en audio est vide.');
    }

    const resolvedVoice = this.resolveVoiceName(voiceName, language);
    const preparedText =
      language === 'mg' ? this.normalizeMalagasyStoryText(text) : text.trim();

    // Pour les modèles Gemini TTS (@google/genai), le prompt utilisateur contient UNIQUEMENT le texte à narrer.
    // L'ajout d'instructions de mise en scène en préambule fait que le modèle lit ces instructions à voix haute.
    const userPrompt = preparedText;

    this.logger.log(
      `🎙️ [GeminiTTS] Génération audio (${language.toUpperCase()}) — ${preparedText.length} caractères, modèle: ${this.defaultModel}, voix: ${resolvedVoice}, languageCode: ${language === 'mg' ? 'mg-MG' : 'fr-FR'}`,
    );
    // Timeout de 5 minutes : la génération TTS d'un conte peut prendre 2-3 min
    // selon la longueur du texte. Au-delà, on abandonne pour ne pas freezer le serveur.
    const TTS_TIMEOUT_MS = 5 * 60 * 1000;
    const abortController = new AbortController();
    const timeoutHandle = setTimeout(() => {
      abortController.abort();
    }, TTS_TIMEOUT_MS);

    const candidateModels = [
      this.defaultModel,
      'gemini-3.8-flash-lite-tts',
      'gemini-2.5-flash-preview-tts',
    ].filter((m, i, arr) => arr.indexOf(m) === i);

    let lastError: any = null;

    try {
      for (let i = 0; i < candidateModels.length; i++) {
        const currentModel = candidateModels[i];
        this.logger.log(
          `🎙️ [GeminiTTS] Tentative audio (${language.toUpperCase()}) — ${preparedText.length} caractères, modèle: ${currentModel}, voix: ${resolvedVoice}, languageCode: ${language === 'mg' ? 'mg-MG' : 'fr-FR'}`,
        );

        try {
          const config: any = {
            temperature: 0.3,
            responseModalities: ['audio'],
            abortSignal: abortController.signal,
            speechConfig: {
              // Codes BCP-47 requis par l'API Gemini TTS (format standard RFC 5646)
              languageCode: language === 'mg' ? 'mg-MG' : 'fr-FR',
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: resolvedVoice,
                },
              },
            },
          };

          const response = await this.ai.models.generateContentStream({
            model: currentModel,
            config,
            contents: [
              {
                role: 'user',
                parts: [{ text: userPrompt }],
              },
            ],
          });

          const pcmChunks: Buffer[] = [];
          let detectedMimeType = 'audio/pcm;rate=24000;format=L16';

          for await (const chunk of response) {
            if (!chunk.candidates || !chunk.candidates[0]?.content?.parts) {
              continue;
            }

            for (const part of chunk.candidates[0].content.parts) {
              if (part.inlineData?.data) {
                const rawData = part.inlineData.data;
                if (part.inlineData.mimeType) {
                  detectedMimeType = part.inlineData.mimeType;
                }
                pcmChunks.push(Buffer.from(rawData, 'base64'));
              }
            }
          }

          if (pcmChunks.length === 0) {
            throw new BadRequestException(
              'Gemini TTS : aucun flux audio binaire retourné.',
            );
          }

          const totalPcm = Buffer.concat(pcmChunks);
          const ext = mime.getExtension(detectedMimeType || '');

          let finalAudioBuffer: Buffer;
          if (ext && ext !== 'bin' && ext !== 'pcm') {
            // Si le format intègre déjà un conteneur (ex: audio/wav ou audio/mp3)
            finalAudioBuffer = totalPcm;
          } else {
            // Sinon, ajouter l'en-tête WAV standard pour le PCM brut
            finalAudioBuffer = this.wrapPcmInWav(totalPcm, detectedMimeType);
          }

          this.logger.log(
            `✅ [GeminiTTS] Audio généré avec succès (${currentModel}) : ${(finalAudioBuffer.length / 1024).toFixed(1)} KB (WAV standard)`,
          );

          return finalAudioBuffer;
        } catch (err: any) {
          lastError = err;
          const isTimeout =
            err?.name === 'AbortError' || abortController.signal.aborted;
          if (isTimeout) {
            throw err;
          }

          const hasNext = i < candidateModels.length - 1;
          if (hasNext && this.isQuotaOrUnavailableError(err)) {
            this.logger.warn(
              `⚠️ [GeminiTTS] Modèle "${currentModel}" indisponible ou quota atteint (429/503). Basculement automatique sur "${candidateModels[i + 1]}"...`,
            );
            continue;
          }
          throw err;
        }
      }

      throw (
        lastError ||
        new Error('Échec de la synthèse vocale sur tous les modèles')
      );
    } catch (err: any) {
      const isTimeout =
        err?.name === 'AbortError' || abortController.signal.aborted;
      const cleanMessage = isTimeout
        ? `Timeout dépassé (${TTS_TIMEOUT_MS / 1000}s) — le texte est peut-être trop long pour une seule requête TTS.`
        : this.extractErrorMessage(err);

      this.logger.error(
        `❌ [GeminiTTS] ${isTimeout ? 'Timeout' : 'Erreur'} lors de la génération audio : ${cleanMessage}`,
        isTimeout ? undefined : err.stack,
      );
      throw new BadRequestException(`Gemini TTS : ${cleanMessage}`);
    } finally {
      clearTimeout(timeoutHandle);
    }
  }

  /**
   * Détecte si une erreur est due à un dépassement de quota (429) ou une indisponibilité (503).
   */
  private isQuotaOrUnavailableError(err: any): boolean {
    const raw = `${err?.message || ''} ${err?.status || ''} ${err?.code || ''}`;
    return (
      raw.includes('429') ||
      raw.includes('RESOURCE_EXHAUSTED') ||
      raw.includes('Quota exceeded') ||
      raw.includes('Too Many Requests') ||
      raw.includes('503') ||
      raw.includes('UNAVAILABLE')
    );
  }

  /**
   * Extrait un message compréhensible depuis les erreurs brutes de l'API Google GenAI.
   */
  private extractErrorMessage(err: any): string {
    if (!err) return 'Erreur inconnue';
    const raw = err.message || String(err);
    try {
      const parsed =
        typeof raw === 'string' &&
        (raw.startsWith('{') || raw.includes('"error"'))
          ? JSON.parse(raw)
          : null;
      const innerMessage = parsed?.error?.message;
      if (innerMessage) {
        if (typeof innerMessage === 'string' && innerMessage.startsWith('{')) {
          const innerParsed = JSON.parse(innerMessage);
          if (innerParsed?.error?.message) {
            return this.humanizeApiErrorMessage(
              innerParsed.error.message,
              innerParsed.error.code,
            );
          }
        }
        return this.humanizeApiErrorMessage(innerMessage, parsed?.error?.code);
      }
    } catch {
      // Ignorer l'erreur de parsing JSON
    }
    return this.humanizeApiErrorMessage(raw, err.status || err.code);
  }

  private humanizeApiErrorMessage(msg: string, code?: number | string): string {
    const codeStr = String(code || '');
    if (
      codeStr === '429' ||
      msg.includes('429') ||
      msg.includes('quota') ||
      msg.includes('RESOURCE_EXHAUSTED')
    ) {
      return (
        'Quota Google Gemini dépassé (429) : la limite quotidienne du plan gratuit (10 requêtes/jour par modèle) a été atteinte sur tous les modèles disponibles. ' +
        'Pour continuer sans interruption, activez la facturation Pay-as-you-go sur Google AI Studio (https://aistudio.google.com/) ou réessayez demain.'
      );
    }
    if (
      codeStr === '503' ||
      msg.includes('503') ||
      msg.includes('UNAVAILABLE')
    ) {
      return 'Le service Google Gemini TTS est temporairement indisponible (503). Veuillez réessayer dans quelques instants.';
    }
    return msg;
  }

  /**
   * Sauvegarde locale d'un fichier audio (fallback si Cloudinary est absent ou inaccessible).
   * Retourne l'URL absolue pour streaming.
   */
  async saveAudioFile(
    filename: string,
    buffer: Buffer,
    subfolder = 'contes',
  ): Promise<string> {
    const uploadDir = path.resolve(
      process.cwd(),
      'uploads',
      'audio',
      subfolder,
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Assurer l'extension .wav si le fichier est en WAV
    const normalizedFilename = filename.endsWith('.mp3')
      ? filename.replace(/\.mp3$/, '.wav')
      : filename;

    const filePath = path.join(uploadDir, normalizedFilename);
    await fs.promises.writeFile(filePath, buffer);

    this.logger.log(`💾 [Local] Audio sauvegardé : ${filePath}`);

    const relativeUrl = `/uploads/audio/${subfolder}/${normalizedFilename}`;
    const baseUrl = (process.env.BETTER_AUTH_URL ?? '').replace(/\/$/, '');
    return baseUrl ? `${baseUrl}${relativeUrl}` : relativeUrl;
  }

  /**
   * Ajoute un en-tête RIFF WAV à des données PCM brutes.
   */
  private wrapPcmInWav(pcmBuffer: Buffer, mimeType: string): Buffer {
    const options = this.parseMimeType(mimeType);
    const wavHeader = this.createWavHeader(pcmBuffer.length, options);
    return Buffer.concat([wavHeader, pcmBuffer]);
  }

  private parseMimeType(mimeType: string): WavConversionOptions {
    const [fileType, ...params] = (mimeType || '')
      .split(';')
      .map((s) => s.trim());
    const [, format] = (fileType || '').split('/');

    const options: WavConversionOptions = {
      numChannels: 1,
      sampleRate: 24000,
      bitsPerSample: 16,
    };

    if (format && format.toUpperCase().startsWith('L')) {
      const bits = parseInt(format.slice(1), 10);
      if (!isNaN(bits)) {
        options.bitsPerSample = bits;
      }
    }

    for (const param of params) {
      const [key, value] = param.split('=').map((s) => s.trim());
      if (key === 'rate') {
        const rate = parseInt(value, 10);
        if (!isNaN(rate)) {
          options.sampleRate = rate;
        }
      }
    }

    return options;
  }

  private createWavHeader(
    dataLength: number,
    options: WavConversionOptions,
  ): Buffer {
    const { numChannels, sampleRate, bitsPerSample } = options;
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const buffer = Buffer.alloc(44);

    buffer.write('RIFF', 0); // ChunkID
    buffer.writeUInt32LE(36 + dataLength, 4); // ChunkSize
    buffer.write('WAVE', 8); // Format
    buffer.write('fmt ', 12); // Subchunk1ID
    buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 pour PCM)
    buffer.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
    buffer.writeUInt16LE(numChannels, 22); // NumChannels
    buffer.writeUInt32LE(sampleRate, 24); // SampleRate
    buffer.writeUInt32LE(byteRate, 28); // ByteRate
    buffer.writeUInt16LE(blockAlign, 32); // BlockAlign
    buffer.writeUInt16LE(bitsPerSample, 34); // BitsPerSample
    buffer.write('data', 36); // Subchunk2ID
    buffer.writeUInt32LE(dataLength, 40); // Subchunk2Size

    return buffer;
  }
}
