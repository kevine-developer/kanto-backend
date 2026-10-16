// backend-kanto/src/games/riddle/riddle-validator.util.ts
// Utilitaire partagé de validation intelligente des réponses d'énigmes malgaches

export function normalizeRiddleText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/[’‘ʼ`]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/[\.\?!,;:]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stripMalagasyArticle(normalizedText: string): string {
  return normalizedText.replace(/^(ny|ilay|ity|ireo|ireny)\s+/, '').trim();
}

export function extractParenthesizedVariants(normalizedText: string): string[] {
  const variants = new Set<string>();
  variants.add(normalizedText);

  const match = normalizedText.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    const mainPart = match[1].trim();
    const insidePart = match[2].trim();
    if (mainPart) variants.add(mainPart);
    if (insidePart) variants.add(insidePart);
    if (mainPart && insidePart) variants.add(`${mainPart} ${insidePart}`);
  }

  const noParens = normalizedText
    .replace(/[\(\)]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (noParens) variants.add(noParens);

  return Array.from(variants);
}

export function isAnswerMatching(
  rawUserAnswer: string | null | undefined,
  correctAnswer: string,
  acceptedAnswers: string[] = [],
): boolean {
  if (!rawUserAnswer) return false;

  const userNorm = normalizeRiddleText(rawUserAnswer);
  if (!userNorm) return false;

  const userStripped = stripMalagasyArticle(userNorm);

  const allExpected = [correctAnswer, ...acceptedAnswers];

  for (const expected of allExpected) {
    if (!expected) continue;
    const expNorm = normalizeRiddleText(expected);
    const variants = extractParenthesizedVariants(expNorm);

    for (const v of variants) {
      if (userNorm === v) return true;
      if (userStripped === stripMalagasyArticle(v)) return true;
    }
  }

  return false;
}
