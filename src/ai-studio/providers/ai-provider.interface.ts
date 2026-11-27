/**
 * Contrats d'abstraction agnostique du fournisseur d'IA pour Kanto AI.
 * Permet de brancher ou changer de modèle/fournisseur (Gemini, OpenAI, Anthropic, Mistral, local)
 * sans modifier les services métiers ni les contrôleurs.
 */

export const AI_PROVIDER_ADAPTER = Symbol('AI_PROVIDER_ADAPTER');

export interface AiToolDeclaration {
  name: string;
  description: string;
  parametersSchema: Record<string, unknown>;
}

export interface AiToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  thoughtSignature?: string;
}

export interface AiProviderMessage {
  role: 'user' | 'assistant' | 'tool';
  content: string;
  toolCalls?: AiToolCall[];
  providerRawParts?: unknown[];
  toolCallId?: string;
  toolName?: string;
  toolResult?: Record<string, unknown>;
}

export interface AiStreamChatOptions {
  model?: string;
  systemPrompt: string;
  messages: AiProviderMessage[];
  tools?: AiToolDeclaration[];
  temperature?: number;
  maxOutputTokens?: number;
}

export interface AiUsageMetrics {
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
}

export interface AiStreamEvent {
  type: 'delta' | 'tool_calls' | 'usage' | 'done';
  text?: string;
  toolCalls?: AiToolCall[];
  rawParts?: unknown[];
  usage?: AiUsageMetrics;
  modelUsed?: string;
}

export interface AiProviderAdapter {
  readonly providerName: string;
  readonly defaultModel: string;

  isConfigured(): boolean;

  listSupportedModels(): string[];

  streamChat(
    options: AiStreamChatOptions,
    signal?: AbortSignal,
  ): AsyncIterable<AiStreamEvent>;

  embedText(text: string): Promise<number[]>;

  estimateCostUsd(
    model: string,
    inputTokens: number,
    outputTokens: number,
  ): number;
}
