import * as fs from 'node:fs';
import * as path from 'node:path';
import { PrismaClient, WordRarity } from '../../generated/prisma/client.js';
import { SeedCategoryStats, RawRakiTeny } from './types.js';
import { validateRakiTenyBatch } from './validator.js';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export async function seedRakiTeny(
  prisma: PrismaClient,
  seedDataDir: string,
): Promise<SeedCategoryStats> {
  const stats: SeedCategoryStats = {
    category: 'Mots Rares & Insolites (Raki-teny)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const filePath = path.join(seedDataDir, 'raki-teny.data.json');
  if (!fs.existsSync(filePath)) {
    return stats;
  }

  let rawList: RawRakiTeny[] = [];
  try {
    rawList = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error('❌ [Seed Raki-Teny] Erreur de syntaxe JSON dans raki-teny.data.json:', err);
    stats.errors++;
    return stats;
  }

  const validation = validateRakiTenyBatch(rawList);
  if (!validation.isValid) {
    console.warn(
      `⚠️ [Seed Raki-Teny] ${validation.issues.length} problème(s) de validation détecté(s) dans raki-teny.data.json.`,
    );
  }

  stats.totalInFile = rawList.length;
  const processedWords = new Set<string>();

  for (let i = 0; i < rawList.length; i++) {
    const item = rawList[i];
    if (!item.word || !item.meaningMg || !item.meaningFr) {
      stats.skipped++;
      continue;
    }

    const cleanWord = item.word.trim();
    const normKey = cleanWord.toLowerCase();
    if (processedWords.has(normKey)) {
      stats.skipped++;
      continue;
    }
    processedWords.add(normKey);

    const slug = item.slug ? item.slug.trim() : slugify(cleanWord);

    const validRarities: Record<string, WordRarity> = {
      LITERAL: WordRarity.LITERAL,
      VERY_RARE: WordRarity.VERY_RARE,
      ARCHAIC: WordRarity.ARCHAIC,
      POETIC: WordRarity.POETIC,
      PROVERBIAL: WordRarity.PROVERBIAL,
    };
    const rarity: WordRarity = (item.rarity && validRarities[item.rarity]) || WordRarity.VERY_RARE;

    try {
      const existing = await prisma.rakiTenyWord.findFirst({
        where: {
          OR: [
            { slug },
            ...(item.id ? [{ id: item.id }] : []),
            {
              word: {
                equals: cleanWord,
                mode: 'insensitive' as const,
              },
            },
          ],
        },
      });

      if (existing) {
        const hasDiff =
          existing.meaningMg !== item.meaningMg ||
          existing.meaningFr !== item.meaningFr ||
          existing.exampleMg !== item.exampleMg ||
          existing.exampleFr !== item.exampleFr ||
          existing.phonetic !== (item.phonetic || null) ||
          existing.wordClassMg !== item.wordClassMg ||
          existing.wordClassFr !== item.wordClassFr ||
          existing.rarity !== rarity ||
          existing.etymology !== (item.etymology || null) ||
          existing.contextUsage !== (item.contextUsage || '');

        if (hasDiff) {
          await prisma.rakiTenyWord.update({
            where: { id: existing.id },
            data: {
              word: cleanWord,
              phonetic: item.phonetic || null,
              category: item.category || 'nature_temps',
              wordClassMg: item.wordClassMg,
              wordClassFr: item.wordClassFr,
              rarity,
              rarityLabelMg: item.rarityLabelMg || 'Tena Vitsy Mpampiasa',
              rarityLabelFr: item.rarityLabelFr || 'Très Rare',
              meaningMg: item.meaningMg,
              meaningFr: item.meaningFr,
              exampleMg: item.exampleMg,
              exampleFr: item.exampleFr,
              contextUsage: item.contextUsage || '',
              etymology: item.etymology || null,
            },
          });
          stats.updated++;
        } else {
          stats.unchanged++;
        }
      } else {
        await prisma.rakiTenyWord.create({
          data: {
            ...(item.id ? { id: item.id } : {}),
            slug,
            word: cleanWord,
            phonetic: item.phonetic || null,
            category: item.category || 'nature_temps',
            wordClassMg: item.wordClassMg,
            wordClassFr: item.wordClassFr,
            rarity,
            rarityLabelMg: item.rarityLabelMg || 'Tena Vitsy Mpampiasa',
            rarityLabelFr: item.rarityLabelFr || 'Très Rare',
            meaningMg: item.meaningMg,
            meaningFr: item.meaningFr,
            exampleMg: item.exampleMg,
            exampleFr: item.exampleFr,
            contextUsage: item.contextUsage || '',
            etymology: item.etymology || null,
            status: 'PUBLISHED',
            isFeatured: item.isFeatured !== undefined ? item.isFeatured : i < 3,
          },
        });
        stats.created++;
      }
    } catch (err) {
      console.error(`⚠️ [Seed Raki-Teny] Erreur sur le mot "${cleanWord}" :`, err);
      stats.errors++;
    }
  }

  return stats;
}
