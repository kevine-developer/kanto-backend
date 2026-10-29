import * as fs from 'node:fs';
import * as path from 'node:path';
import { PrismaClient } from '../../generated/prisma/client.js';
import { SeedCategoryStats } from './types.js';
import { validateMalagasyItemsBatch } from './validator.js';

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

interface RawMalagasyItem {
  id?: string;
  slug?: string;
  malagasy: string;
  french: string;
  meaning: string;
  example?: string;
  phonetic?: string;
  category?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  origins?: string[];
  themes?: string[];
  dialectVariants?: Array<{ dialect?: string; dialectName?: string; text: string }>;
}

export async function seedMalagasyItems(
  prisma: PrismaClient,
  seedDataDir: string,
  themeMap: Map<string, string>,
): Promise<SeedCategoryStats> {
  const stats: SeedCategoryStats = {
    category: 'Proverbes, Dictons & Expressions (MalagasyItem)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const DATA_FILES = [
    { file: 'malagasy-items.data.json', defaultCat: 'PROVERBE' },
    { file: 'proverbes.data.json', defaultCat: 'PROVERBE' },
    { file: 'dictons.data.json', defaultCat: 'DICTON' },
    { file: 'expressions.data.json', defaultCat: 'EXPRESSION' },
  ];

  for (const source of DATA_FILES) {
    const filePath = path.join(seedDataDir, source.file);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    let rawList: RawMalagasyItem[] = [];
    try {
      rawList = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (err) {
      console.error(`❌ [Seed Items] Erreur de syntaxe JSON dans ${source.file}:`, err);
      stats.errors++;
      continue;
    }

    const validation = validateMalagasyItemsBatch(rawList);
    if (!validation.isValid) {
      console.warn(
        `⚠️ [Seed Items] ${validation.issues.length} problème(s) de validation détecté(s) dans ${source.file}.`,
      );
    }

    stats.totalInFile += rawList.length;

    for (let i = 0; i < rawList.length; i++) {
      const item = rawList[i];
      if (!item.malagasy || !item.french || !item.meaning) {
        stats.skipped++;
        continue;
      }

      const cleanMalagasy = item.malagasy.trim();
      let category: 'PROVERBE' | 'EXPRESSION' | 'DICTON' = 'PROVERBE';
      const rawCat = String(item.category || source.defaultCat).toUpperCase();
      if (rawCat.includes('DICTON')) category = 'DICTON';
      else if (rawCat.includes('EXPRESSION')) category = 'EXPRESSION';

      try {
        // Recherche d'un élément existant par ID stable ou par texte malgache identique
        const existing = await prisma.malagasyItem.findFirst({
          where: {
            OR: [
              ...(item.id ? [{ id: item.id }] : []),
              {
                malagasy: {
                  equals: cleanMalagasy,
                  mode: 'insensitive',
                },
              },
            ],
          },
        });

        if (existing) {
          // Vérification si une mise à jour est réellement nécessaire
          const hasDiff =
            existing.french !== item.french ||
            existing.meaning !== item.meaning ||
            existing.example !== (item.example || null) ||
            existing.phonetic !== (item.phonetic || null) ||
            existing.category !== category;

          if (hasDiff) {
            await prisma.malagasyItem.update({
              where: { id: existing.id },
              data: {
                french: item.french,
                meaning: item.meaning,
                example: item.example || null,
                phonetic: item.phonetic || null,
                category,
                origins: Array.isArray(item.origins) ? item.origins : existing.origins,
                difficulty: item.difficulty || existing.difficulty,
              },
            });
            stats.updated++;
          } else {
            stats.unchanged++;
          }
        } else {
          // Création d'une nouvelle entrée de référence
          const baseSlug = slugify(item.slug || cleanMalagasy.substring(0, 50)) || 'item';
          let slug = baseSlug;
          let counter = 1;
          while (await prisma.malagasyItem.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter++}`;
          }

          const created = await prisma.malagasyItem.create({
            data: {
              ...(item.id ? { id: item.id } : {}),
              slug,
              malagasy: cleanMalagasy,
              french: item.french,
              meaning: item.meaning,
              example: item.example || null,
              phonetic: item.phonetic || null,
              category,
              difficulty: item.difficulty || 'EASY',
              origins: Array.isArray(item.origins) ? item.origins : [],
              status: 'PUBLISHED',
              isFeatured: i < 5,
            },
          });

          // Liaison des variantes dialectales
          if (Array.isArray(item.dialectVariants)) {
            for (const v of item.dialectVariants) {
              const dName = v.dialectName || v.dialect;
              if (dName && v.text) {
                await prisma.dialectVariant.create({
                  data: {
                    dialectName: dName,
                    text: v.text,
                    itemId: created.id,
                  },
                });
              }
            }
          }

          // Liaison des thèmes culturels
          if (Array.isArray(item.themes)) {
            for (const tName of item.themes) {
              const tSlug = slugify(tName);
              let tId = themeMap.get(tSlug);
              if (!tId) {
                const newTheme = await prisma.theme.create({
                  data: {
                    nameFr: tName,
                    nameMg: tName,
                    slug: tSlug,
                  },
                });
                tId = newTheme.id;
                themeMap.set(tSlug, tId);
              }
              await prisma.malagasyItemTheme.upsert({
                where: {
                  itemId_themeId: {
                    itemId: created.id,
                    themeId: tId,
                  },
                },
                update: {},
                create: {
                  itemId: created.id,
                  themeId: tId,
                },
              });
            }
          }

          stats.created++;
        }
      } catch (itemErr) {
        console.error(`⚠️ [Seed Items] Erreur sur l'élément "${cleanMalagasy.substring(0, 30)}..." :`, itemErr);
        stats.errors++;
      }
    }
  }

  return stats;
}
