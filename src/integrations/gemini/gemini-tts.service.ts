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
    process.env.GEMINI_TTS_MODEL || 'gemini-3.1-flash-tts-preview';

  private readonly defaultVoice = process.env.GEMINI_TTS_VOICE || 'Orus';

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
   * Génère un buffer audio WAV via Google Gemini TTS (@google/genai).
   * Assemble les données PCM reçues en streaming et y injecte un en-tête WAV standard.
   */
  async generateSpeechBuffer(options: GenerateSpeechOptions): Promise<Buffer> {
    if (!this.isConfigured() || !this.ai) {
      throw new BadRequestException(
        'Clé API Gemini non configurée. Veuillez définir GEMINI_API_KEY dans votre fichier .env',
      );
    }

    const { text, language = 'mg', voiceName = this.defaultVoice } = options;

    if (!text?.trim()) {
      throw new BadRequestException('Le texte à convertir en audio est vide.');
    }

    // Consigne de narration (Director's Note) adaptée à l'esprit des contes malgaches
    const directorPrompt =
      language === 'mg'
        ? `Ianao dia mpitantara angano malagasy manana feo mafana, kanto ary miaina. Vakio amim-panajana sy amim-pitiavana ity angano manaraka ity :

${text.trim()}`
        : `Tu es un conteur bienveillant, captivant et chaleureux qui transmet un conte traditionnel malgache en français. Raconte ce récit avec une diction naturelle, immersive et expressive :

${text.trim()}`;

    this.logger.log(
      `🎙️ [GeminiTTS] Génération audio (${language.toUpperCase()}) — ${text.length} caractères, modèle: ${this.defaultModel}, voix: ${voiceName}`,
    );

    try {
      const config = {
        temperature: 1,
        responseModalities: ['audio'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName,
            },
          },
        },
      };

      const response = await this.ai.models.generateContentStream({
        model: this.defaultModel,
        config,
        contents: [
          {
            role: 'user',
            parts: [{ text: directorPrompt }],
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
          'Gemini TTS n’a retourné aucun flux audio binaire.',
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
        `✅ [GeminiTTS] Audio généré avec succès : ${(finalAudioBuffer.length / 1024).toFixed(1)} KB (WAV standard)`,
      );

      return finalAudioBuffer;
    } catch (err: any) {
      this.logger.error(
        `❌ [GeminiTTS] Erreur lors de la génération audio : ${err.message}`,
        err.stack,
      );
      throw new BadRequestException(
        `Gemini TTS : ${err.message || 'Échec de la synthèse vocale'}`,
      );
    }
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

    if (format && format.startsWith('L')) {
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
