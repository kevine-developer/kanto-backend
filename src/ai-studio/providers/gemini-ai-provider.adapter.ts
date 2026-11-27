import { Injectable, Logger } from '@nestjs/common';
import {
  GoogleGenAI,
  Type,
  type Content,
  type FunctionDeclaration,
  type Part,
} from '@google/genai';
import {
  AiProviderAdapter,
  AiProviderMessage,
  AiStreamChatOptions,
  AiStreamEvent,
  AiToolCall,
  AiToolDeclaration,
} from './ai-provider.interface.js';

/**
 * Grille tarifaire indicative par million de tokens (USD).
 * Utilisée exclusivement pour l'estimation de suivi interne côté administration.
 */
const MODEL_PRICING_PER_MILLION: Record<
  string,
  { input: number; output: number }
> = {
  'gemini-2.5-flash': { input: 0.15, output: 0.6 },
  'gemini-2.5-pro': { input: 1.25, output: 10.0 },
  'gemini-2.0-flash': { input: 0.1, output: 0.4 },
  'gemini-3.8-flash': { input: 0.15, output: 0.6 },
};

@Injectable()
export class GeminiAiProviderAdapter implements AiProviderAdapter {
  private readonly logger = new Logger(GeminiAiProviderAdapter.name);
  private ai: GoogleGenAI | null = null;

  readonly providerName = 'gemini';
  readonly defaultModel =
    process.env.AI_DEFAULT_MODEL?.trim() ||
    process.env.GEMINI_CONTENT_MODEL?.trim() ||
    'gemini-2.5-flash';

  private readonly embeddingModel =
    process.env.AI_EMBEDDING_MODEL?.trim() || 'text-embedding-004';

  private readonly candidateModels: string[] = [
    this.defaultModel,
    'gemini-2.5-flash',
    'gemini-2.0-flash',
  ].filter((m, idx, arr): m is string => Boolean(m) && arr.indexOf(m) === idx);

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
      this.logger.log(
        `[Kanto AI / Gemini] Adaptateur initialisé (modèle par défaut : ${this.defaultModel})`,
      );
    } else {
      this.logger.warn(
        '[Kanto AI / Gemini] GEMINI_API_KEY absente — le copilote IA renverra une erreur explicite tant que la clé n’est pas configurée.',
      );
    }
  }

  isConfigured(): boolean {
    return Boolean(this.ai);
  }

  listSupportedModels(): string[] {
    return this.candidateModels;
  }

  estimateCostUsd(
    model: string,
    inputTokens: number,
    outputTokens: number,
  ): number {
    const pricing = MODEL_PRICING_PER_MILLION[model] || {
      input: 0.15,
      output: 0.6,
    };
    const cost =
      (Math.max(0, inputTokens) / 1_000_000) * pricing.input +
      (Math.max(0, outputTokens) / 1_000_000) * pricing.output;
    return Number(cost.toFixed(6));
  }

  async embedText(text: string): Promise<number[]> {
    if (!this.ai || !text.trim()) {
      return [];
    }
    try {
      const result = await this.ai.models.embedContent({
        model: this.embeddingModel,
        contents: text.slice(0, 8000),
      });
      const values = result.embeddings?.[0]?.values;
      return Array.isArray(values) ? values : [];
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(
        `[Kanto AI / Gemini] Embedding ignoré (repli lexical PostgreSQL actif) : ${msg}`,
      );
      return [];
    }
  }

  async *streamChat(
    options: AiStreamChatOptions,
    signal?: AbortSignal,
  ): AsyncIterable<AiStreamEvent> {
    if (!this.ai) {
      throw new Error(
        "Le fournisseur Gemini n'est pas configuré côté serveur (GEMINI_API_KEY manquante).",
      );
    }

    const modelsToTry = options.model
      ? [
          options.model,
          ...this.candidateModels.filter((m) => m !== options.model),
        ]
      : this.candidateModels;

    const contents = this.mapMessagesToGeminiContents(options.messages);
    const functionDeclarations = this.mapToolsToGeminiDeclarations(
      options.tools || [],
    );

    let lastErr: unknown;

    for (const modelName of modelsToTry) {
      const maxAttempts = 2;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        if (signal?.aborted) {
          return;
        }

        let hasEmittedDelta = false;

        try {
          const stream = await this.ai.models.generateContentStream({
            model: modelName,
            contents,
            config: {
              systemInstruction: options.systemPrompt,
              temperature: options.temperature ?? 0.55,
              maxOutputTokens: options.maxOutputTokens ?? 2500,
              ...(functionDeclarations.length > 0
                ? { tools: [{ functionDeclarations }] }
                : {}),
            },
          });

          let totalInputTokens = 0;
          let totalOutputTokens = 0;
          const collectedCalls: AiToolCall[] = [];
          const rawModelParts: Part[] = [];
          let callCounter = 0;

          for await (const chunk of stream) {
            if (signal?.aborted) {
              return;
            }

            if (chunk.usageMetadata) {
              totalInputTokens =
                chunk.usageMetadata.promptTokenCount ?? totalInputTokens;
              totalOutputTokens =
                chunk.usageMetadata.candidatesTokenCount ?? totalOutputTokens;
            }

            const parts = chunk.candidates?.[0]?.content?.parts ?? [];
            for (const part of parts) {
              // Préserver les parts brutes (incluant thought, thoughtSignature et functionCall)
              // afin de pouvoir les réinjecter telles quelles dans les tours suivants Gemini 2.5/3+.
              if (
                part.text ||
                part.functionCall ||
                part.thoughtSignature ||
                part.thought
              ) {
                rawModelParts.push(part);
              }

              if (part.text && !part.thought) {
                hasEmittedDelta = true;
                yield {
                  type: 'delta',
                  text: part.text,
                  modelUsed: modelName,
                };
              }
              if (part.functionCall?.name) {
                callCounter += 1;
                collectedCalls.push({
                  id:
                    part.functionCall.id || `call_${Date.now()}_${callCounter}`,
                  name: part.functionCall.name,
                  args:
                    (part.functionCall.args as Record<string, unknown>) || {},
                  ...(part.thoughtSignature
                    ? { thoughtSignature: part.thoughtSignature }
                    : {}),
                });
              }
            }
          }

          yield {
            type: 'usage',
            modelUsed: modelName,
            usage: {
              inputTokens: totalInputTokens,
              outputTokens: totalOutputTokens,
              estimatedCostUsd: this.estimateCostUsd(
                modelName,
                totalInputTokens,
                totalOutputTokens,
              ),
            },
          };

          if (collectedCalls.length > 0) {
            yield {
              type: 'tool_calls',
              toolCalls: collectedCalls,
              rawParts: rawModelParts,
              modelUsed: modelName,
            };
          }

          yield { type: 'done', modelUsed: modelName };
          return;
        } catch (err: unknown) {
          lastErr = err;
          const msg = err instanceof Error ? err.message : String(err);

          // Ne jamais retenter/basculer si du texte a déjà été envoyé au client SSE
          if (hasEmittedDelta || signal?.aborted) {
            throw err;
          }

          if (this.isNotFoundError(msg)) {
            this.logger.warn(
              `[Kanto AI / Gemini] Modèle "${modelName}" indisponible (404), repli sur le suivant...`,
            );
            break;
          }

          if (this.isTransientError(msg)) {
            if (attempt < maxAttempts) {
              this.logger.warn(
                `[Kanto AI / Gemini] Surcharge temporaire sur "${modelName}" (tentative ${attempt}/${maxAttempts}), nouvel essai dans 900ms...`,
              );
              await new Promise((resolve) => setTimeout(resolve, 900));
              continue;
            }
            this.logger.warn(
              `[Kanto AI / Gemini] Modèle "${modelName}" surchargé/indisponible après ${maxAttempts} tentatives, repli sur le modèle suivant...`,
            );
            break;
          }

          throw err;
        }
      }
    }

    throw lastErr instanceof Error
      ? lastErr
      : new Error('Aucun modèle Gemini compatible disponible.');
  }

  private isNotFoundError(msg: string): boolean {
    return (
      msg.includes('404') ||
      msg.includes('NOT_FOUND') ||
      msg.includes('not found')
    );
  }

  private isTransientError(msg: string): boolean {
    return (
      msg.includes('503') ||
      msg.includes('UNAVAILABLE') ||
      msg.includes('high demand') ||
      msg.includes('429') ||
      msg.includes('RESOURCE_EXHAUSTED') ||
      msg.includes('fetch failed') ||
      msg.includes('ECONNRESET') ||
      msg.includes('ETIMEDOUT') ||
      msg.includes('ENOTFOUND')
    );
  }

  private mapMessagesToGeminiContents(
    messages: AiProviderMessage[],
  ): Content[] {
    const contents: Content[] = [];
    let pendingToolParts: Part[] = [];

    const flushPendingToolParts = () => {
      if (pendingToolParts.length > 0) {
        contents.push({
          role: 'user',
          parts: pendingToolParts,
        });
        pendingToolParts = [];
      }
    };

    for (const msg of messages) {
      if (msg.role === 'tool' && msg.toolName) {
        pendingToolParts.push({
          functionResponse: {
            id: msg.toolCallId,
            name: msg.toolName,
            response: msg.toolResult || { ok: false },
          },
        });
        continue;
      }

      flushPendingToolParts();

      if (msg.role === 'user') {
        contents.push({
          role: 'user',
          parts: [{ text: msg.content }],
        });
      } else if (msg.role === 'assistant') {
        if (msg.providerRawParts && msg.providerRawParts.length > 0) {
          contents.push({
            role: 'model',
            parts: msg.providerRawParts as Part[],
          });
          continue;
        }

        const parts: Part[] = [];
        if (msg.content) {
          parts.push({ text: msg.content });
        }
        if (msg.toolCalls && msg.toolCalls.length > 0) {
          for (const tc of msg.toolCalls) {
            parts.push({
              functionCall: {
                id: tc.id,
                name: tc.name,
                args: tc.args,
              },
              ...(tc.thoughtSignature
                ? { thoughtSignature: tc.thoughtSignature }
                : {}),
            });
          }
        }
        if (parts.length > 0) {
          contents.push({ role: 'model', parts });
        }
      }
    }

    flushPendingToolParts();
    return contents;
  }

  private mapToolsToGeminiDeclarations(
    tools: AiToolDeclaration[],
  ): FunctionDeclaration[] {
    return tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: this.convertSchemaToGeminiSchema(tool.parametersSchema),
    }));
  }

  private convertSchemaToGeminiSchema(schema: Record<string, unknown>): any {
    const typeMap: Record<string, Type> = {
      object: Type.OBJECT,
      string: Type.STRING,
      number: Type.NUMBER,
      integer: Type.INTEGER,
      boolean: Type.BOOLEAN,
      array: Type.ARRAY,
    };

    const rawType = typeof schema.type === 'string' ? schema.type : 'object';
    const mapped: Record<string, unknown> = {
      type: typeMap[rawType] || Type.OBJECT,
    };

    if (typeof schema.description === 'string') {
      mapped.description = schema.description;
    }
    if (Array.isArray(schema.enum)) {
      mapped.enum = schema.enum;
    }
    if (Array.isArray(schema.required)) {
      mapped.required = schema.required;
    }
    if (schema.properties && typeof schema.properties === 'object') {
      const convertedProps: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(
        schema.properties as Record<string, Record<string, unknown>>,
      )) {
        convertedProps[k] = this.convertSchemaToGeminiSchema(v);
      }
      mapped.properties = convertedProps;
    }
    if (schema.items && typeof schema.items === 'object') {
      mapped.items = this.convertSchemaToGeminiSchema(
        schema.items as Record<string, unknown>,
      );
    }
    return mapped;
  }
}
