import { Injectable, Logger } from '@nestjs/common';
import {
  ModerationAnalysisResult,
  ModerationCategory,
  ModerationMatch,
  ModerationSeverity,
} from './moderation.types.js';
import {
  LEETSPEAK_MAP,
  MODERATION_WHITELIST,
  SENSITIVE_TERMS,
  TermDefinition,
} from './moderation.constants.js';

@Injectable()
export class ContentModerationService {
  private readonly logger = new Logger(ContentModerationService.name);

  /**
   * Normalisation fine du texte pour la détection :
   * - Minuscules
   * - Dé-accentuation NFD
   * - Dé-leetspeak (ex: "c0nnard" -> "connard")
   * - Compression des lettres répétées consécutives (ex: "meeeerde" -> "merde")
   */
  public normalizeForAnalysis(rawText: string): string {
    if (!rawText) return '';

    // 1. Minuscules et suppression des accents
    let text = rawText
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // 2. Dé-leetspeak
    let deLeet = '';
    for (const char of text) {
      deLeet += LEETSPEAK_MAP[char] || char;
    }
    text = deLeet;

    // 3. Réduction des répétitions excessives de lettres (ex: "aliiikaaa" -> "alika", "merrrde" -> "merde")
    // Conserve au maximum 2 lettres consécutives (pour les mots légitimes comme "soavaly", "connard")
    text = text.replace(/([a-z])\1{2,}/g, '$1$1');

    return text;
  }

  /**
   * Version alternative sans séparateurs (détecte les contournements de type "m.e.r.d.e" ou "c-o-n-n-a-r-d")
   */
  public stripPunctuationSpacers(text: string): string {
    return text.replace(/[\.\-_\*\s]+/g, '');
  }

  /**
   * Extrait récursivement toutes les chaînes de caractères d'un objet ou payload
   */
  public extractTextFields(
    input: unknown,
    prefix: string = '',
  ): Array<{ field: string; text: string }> {
    const fields: Array<{ field: string; text: string }> = [];

    if (typeof input === 'string') {
      const trimmed = input.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed);
          return this.extractTextFields(parsed, prefix);
        } catch {
          // Ce n'était pas un JSON, on traite comme texte normal
        }
      }
      fields.push({ field: prefix || 'content', text: trimmed });
    } else if (Array.isArray(input)) {
      input.forEach((item, index) => {
        fields.push(...this.extractTextFields(item, `${prefix}[${index}]`));
      });
    } else if (input && typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        const nextPrefix = prefix ? `${prefix}.${key}` : key;
        fields.push(...this.extractTextFields(value, nextPrefix));
      }
    }

    return fields;
  }

  /**
   * Analyse automatique multi-champs d'une contribution.
   * Analyse le malgache et le français avec respect des spécificités culturelles.
   */
  public moderateContent(
    fieldsMap: Record<string, unknown>,
  ): ModerationAnalysisResult {
    const extracted = this.extractTextFields(fieldsMap);
    const matches: ModerationMatch[] = [];
    const detectedCategories = new Set<ModerationCategory>();
    const fieldsAnalyzed: string[] = [];

    for (const { field, text } of extracted) {
      if (!text || text.trim().length === 0) continue;
      fieldsAnalyzed.push(field);

      const normalized = this.normalizeForAnalysis(text);
      const collapsed = this.stripPunctuationSpacers(normalized);

      // Vérification des termes sensibles
      for (const termDef of SENSITIVE_TERMS) {
        const term = termDef.term.toLowerCase();

        // Si le terme complet correspond ou est contenu dans un mot whitelisté légitime, l'ignorer
        const hasMatched = this.checkTermPresence(term, normalized, collapsed);

        if (hasMatched) {
          // Vérification de sécurité contre les faux positifs (whitelist)
          if (this.isWhitelistedContext(term, normalized)) {
            continue;
          }

          detectedCategories.add(termDef.category);

          // Extraction d'un extrait de contexte anonymisé
          const snippet = this.extractSnippet(normalized, term);

          matches.push({
            category: termDef.category,
            severity: termDef.severity,
            termMatched: termDef.term,
            field,
            contextSnippet: snippet,
          });
        }
      }
    }

    // Calcul du score de risque et décision
    const hasHigh = matches.some((m) => m.severity === 'HIGH');
    const hasMedium = matches.some((m) => m.severity === 'MEDIUM');
    const isFlagged = hasHigh || hasMedium;

    let score = 0.0;
    if (hasHigh) {
      score = 0.9;
    } else if (matches.length >= 2) {
      score = 0.7;
    } else if (hasMedium) {
      score = 0.5;
    }

    const categories = Array.from(detectedCategories);

    let summary = 'Aucun contenu suspect détecté.';
    if (isFlagged) {
      summary = `Détection automatique : ${categories.join(', ')} (${matches.length} élément(s) suspect(s)) — Vérification humaine requise.`;
    }

    if (isFlagged) {
      this.logger.warn(
        `🚩 [Modération] Alerte déclenchée sur contribution : ${categories.join(', ')} (Score: ${score})`,
      );
    }

    return {
      isFlagged,
      score,
      categories,
      summary,
      matches,
      fieldsAnalyzed,
      analyzedAt: new Date().toISOString(),
    };
  }

  /**
   * Vérifie la présence d'un terme en respectant les frontières de mots
   * pour éviter les faux positifs (ex: "contexte" ne doit pas matcher "con").
   */
  private checkTermPresence(
    term: string,
    normalized: string,
    collapsed: string,
  ): boolean {
    // 1. Recherche par mot entier avec frontières de mots
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordBoundaryRegex = new RegExp(
      `(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`,
      'i',
    );

    if (wordBoundaryRegex.test(normalized)) {
      return true;
    }

    // 2. Recherche pour les termes composés (ex: "alika vavy", "mort aux")
    if (term.includes(' ') && normalized.includes(term)) {
      return true;
    }

    // 3. Détection des contournements par ponctuation (ex: "m.e.r.d.e" -> "merde")
    // Uniquement pour les termes de 4+ lettres pour éviter les faux positifs sur des trigrammes
    if (term.length >= 4) {
      const collapsedTerm = term.replace(/[\s\-_]+/g, '');
      const collapsedRegex = new RegExp(
        `(^|[^a-z0-9])${collapsedTerm}([^a-z0-9]|$)`,
        'i',
      );
      if (collapsedRegex.test(collapsed)) {
        return true;
      }

      // 4. Détection des lettres excessives répétées (ex: "meeeerdeee" -> "merde")
      const singleCharNorm = normalized.replace(/([a-z])\1+/g, '$1');
      const singleCharTerm = term.replace(/([a-z])\1+/g, '$1');
      const singleCharRegex = new RegExp(
        `(^|[^a-z0-9])${singleCharTerm}([^a-z0-9]|$)`,
        'i',
      );
      if (singleCharRegex.test(singleCharNorm)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Contrôle si le mot englobant fait partie de la liste blanche autorisée
   */
  private isWhitelistedContext(term: string, normalizedText: string): boolean {
    const words = normalizedText.split(/[^a-z0-9]+/);
    for (const w of words) {
      if (MODERATION_WHITELIST.has(w)) {
        // Si le mot whitelisté contient le terme suspect (ex: "contexte" contient "con"),
        // et qu'il n'y a pas d'autre occurrence isolée du terme suspect, on acquitte.
        if (w.includes(term) && w !== term) {
          const occurrences = (
            normalizedText.match(new RegExp(term, 'g')) || []
          ).length;
          const whitelistedOccurrences = (
            normalizedText.match(new RegExp(w, 'g')) || []
          ).length;
          if (occurrences <= whitelistedOccurrences) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Extrait un snippet court autour du terme détecté pour consultation admin sécurisée (masqué par défaut)
   */
  private extractSnippet(text: string, term: string): string {
    const idx = text.indexOf(term);
    if (idx === -1) return '***';

    const start = Math.max(0, idx - 20);
    const end = Math.min(text.length, idx + term.length + 20);
    const prefix = start > 0 ? '...' : '';
    const suffix = end < text.length ? '...' : '';

    const before = text.slice(start, idx);
    const masked = '***';
    const after = text.slice(idx + term.length, end);

    return `${prefix}${before}${masked}${after}${suffix}`;
  }
}
