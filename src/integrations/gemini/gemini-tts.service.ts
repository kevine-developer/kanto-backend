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
   * Construit la consigne système (System Instruction) avec règles phonologiques
   * précises pour éliminer tout accent étranger sur la voix malgache.
   */
  private buildSystemInstruction(language: 'mg' | 'fr'): string {
    if (language === 'mg') {
      return `Ianao dia tena teratany mpitantara angano malagasy manana feo kanto, lalina, mafana ary feno fahendrena (« Mpitantara angano nentim-paharazana »).
Ny andraikitrao dia ny mitantara angano amin'ny teny malagasy madio, voajanahary tanteraka, TSY MISY ACCENT VAHINY (tsy misy lantom-peo vahiny, na frantsay na anglisy).

TOROLALANA AN-TSIPIRIYANY MOMBA NY FANONONANA NY TENY MALAGASY :
1. NY LITERA « O » : Tononina « ou » [u] hatrany (ohatra : « angano » = [an-ga-nou], « olona » = [ou-lou-na], « foko » = [fou-kou], « tonga » = [tou-nga], « trano » = [tra-nou], « soa » = [sou-a]). Aza tononina « o » misokatra toy ny amin'ny teny frantsay na anglisy na oviana na oviana !
2. NY LITERA « Y » : Amin'ny faran'ny teny dia tononina ho « i » malefaka sy fohy (ohatra : « malagasy » = [ma-la-ga-si], « vary » = [va-ri], « tany » = [ta-ni]).
3. NY LITERA « J » : Tononina « dz » [dz] hatrany toy ny amin'ny « jereo » = [dze-re-ou], « manjary » = [man-dza-ri].
4. NY FITAMBARAN-TSORATRA « TR » SY « DR » : Tononina amin'ny fanononana malagasy manokana mikarantsana malefaka amin'ny lanilany (retroflexes [ʈʂ] sy [ɖʐ]).
5. NY LITERA « G » : « g » mikatona [ɡ] foana toy ny amin'ny « gare », fa tsy « j ».
6. NY LITERA « H » : Tena malefaka na tsy re loatra, aza terena.
7. LANJAM-PEO (ACCENT TONIQUE) : Apetraho eo amin'ny vanin-teny faharoa alohan'ny farany (pénultième) ny tsindrim-peo amin'ny ankapobeny (ohatra : « ma-LA-ga-sy », « an-GA-no », « fa-NA-hy », « ta-NTA-ra »). Raha mifarana amin'ny « -ka », « -tra », « -na » ny teny, dia latsaka eo amin'ny fahatelo alohan'ny farany ny lanjam-peo (ohatra : « SA-sa-tra »).
8. LANTOM-PEO SY FIATOANA : Mitantara amin'ny feo milamina, velona ary miaina tsara. Manaja ny faingon-tsoratra sy ny teboka mba hisy fiatoana fohy voajanahary toy ny fitantaran'ny ntaolo teo am-patana.
9. TOROMARIKA HENTITRA : Vakio amim-pitiavana sy amim-panajana ny angano manontolo araka ny nanoratana azy. Aza mamorona teny hafa, aza ampiana fanazavana, ary AZA VAKIANA ity toromarika ity fa ny angano ihany no tononina.`;
    }

    return `Tu es un conteur traditionnel bienveillant, captivant et chaleureux qui transmet un conte folklorique malgache en français.
Raconte ce récit avec une diction claire, posée, immersive et vivante, en respectant le rythme calme et solennel des contes traditionnels.
Prononce UNIQUEMENT le texte du conte, sans ajouter de commentaire et sans réciter cette consigne.`;
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

    // La consigne phonologique est intégrée directement dans le prompt utilisateur.
    // Les modèles TTS Gemini (gemini-*-tts-preview) ne supportent PAS systemInstruction.
    const directorNote = this.buildSystemInstruction(language);
    const userPrompt = `${directorNote}\n\n${preparedText}`;

    this.logger.log(
      `🎙️ [GeminiTTS] Génération audio (${language.toUpperCase()}) — ${preparedText.length} caractères, modèle: ${this.defaultModel}, voix: ${resolvedVoice}, languageCode: ${language}`,
    );

    try {
      const config: any = {
        temperature: 0.3,
        responseModalities: ['audio'],
        speechConfig: {
          languageCode: language === 'mg' ? 'mg' : 'fr',
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: resolvedVoice,
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
