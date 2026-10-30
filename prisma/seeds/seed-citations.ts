import * as fs from 'node:fs';
import * as path from 'node:path';
import { PrismaClient } from '../../generated/prisma/client.js';
import { SeedCategoryStats, RawCitation } from './types.js';
import { validateCitationsBatch } from './validator.js';

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

export async function seedCitations(
  prisma: PrismaClient,
  seedDataDir: string,
  themeMap: Map<string, string>,
): Promise<SeedCategoryStats> {
  const stats: SeedCategoryStats = {
    category: 'Citations & Auteurs',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const DATA_FILES = ['citations.data.json', 'citation.data.json'];
  const processedMgTexts = new Set<string>();

  for (const fileName of DATA_FILES) {
    const filePath = path.join(seedDataDir, fileName);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    let rawList: RawCitation[] = [];
    try {
      rawList = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (err) {
      console.error(`❌ [Seed Citations] Erreur de lecture/syntaxe JSON dans ${fileName}:`, err);
      stats.errors++;
      continue;
    }

    const validation = validateCitationsBatch(rawList);
    if (!validation.isValid) {
      console.warn(
        `⚠️ [Seed Citations] ${validation.issues.length} anomalie(s) de validation dans ${fileName}.`,
      );
    }

    stats.totalInFile += rawList.length;

    for (const c of rawList) {
      if (!c.citationMg || !c.citationFr) {
        stats.skipped++;
        continue;
      }

      const cleanCitationMg = c.citationMg.trim();
      const normalizedKey = cleanCitationMg.toLowerCase();

      // Évite les doublons stricts si la même citation est présente dans plusieurs fichiers
      if (processedMgTexts.has(normalizedKey)) {
        stats.skipped++;
        continue;
      }
      processedMgTexts.add(normalizedKey);

      const sourceName = (c.source || c.sourceName || 'Anonyme').trim();

      try {
        // 1. Gestion de l'auteur (upsert sans doublon)
        let authorId: string | null = null;
        if (sourceName && sourceName.toLowerCase() !== 'anonyme') {
          const author = await prisma.author.upsert({
            where: { name: sourceName },
            update: {},
            create: { name: sourceName },
          });
          authorId = author.id;
        }

        // 2. Recherche d'une citation existante
        const existing = await prisma.citation.findFirst({
          where: {
            OR: [
              ...(c.id ? [{ id: c.id }] : []),
              {
                citationMg: {
                  equals: cleanCitationMg,
                  mode: 'insensitive' as const,
                },
              },
            ],
          },
        });

        let targetCitationId: string;

        if (existing) {
          targetCitationId = existing.id;
          const hasDiff =
            existing.citationFr !== c.citationFr ||
            existing.sourceName !== sourceName ||
            existing.contexte !== (c.contexte || null) ||
            existing.authorId !== authorId;

          if (hasDiff) {
            await prisma.citation.update({
              where: { id: existing.id },
              data: {
                citationFr: c.citationFr,
                sourceName,
                contexte: c.contexte || null,
                authorId,
                isPremium: c.isPremium !== undefined ? Boolean(c.isPremium) : existing.isPremium,
              },
            });
            stats.updated++;
          } else {
            stats.unchanged++;
          }
        } else {
          // Création d'une nouvelle citation
          const created = await prisma.citation.create({
            data: {
              ...(c.id ? { id: c.id } : {}),
              citationMg: cleanCitationMg,
              citationFr: c.citationFr,
              sourceName,
              contexte: c.contexte || null,
              authorId,
              isPremium: Boolean(c.isPremium),
              status: 'PUBLISHED',
            },
          });
          targetCitationId = created.id;
          stats.created++;
        }

        // 3. Liaison idempotente des thèmes
        if (Array.isArray(c.themes)) {
          for (const tName of c.themes) {
            const trimmedTheme = String(tName).trim();
            if (!trimmedTheme) continue;

            const tSlug = slugify(trimmedTheme);
            let tId = themeMap.get(tSlug);

            if (!tId) {
              const existingTheme = await prisma.theme.findFirst({
                where: {
                  OR: [{ slug: tSlug }, { nameFr: trimmedTheme }, { nameMg: trimmedTheme }],
                },
              });

              if (existingTheme) {
                tId = existingTheme.id;
              } else {
                const newTheme = await prisma.theme.create({
                  data: {
                    nameFr: trimmedTheme,
                    nameMg: trimmedTheme,
                    slug: tSlug,
                  },
                });
                tId = newTheme.id;
              }
              themeMap.set(tSlug, tId);
            }

            await prisma.citationTheme.upsert({
              where: {
                citationId_themeId: {
                  citationId: targetCitationId,
                  themeId: tId,
                },
              },
              update: {},
              create: {
                citationId: targetCitationId,
                themeId: tId,
              },
            });
          }
        }
      } catch (err) {
        console.error(`⚠️ [Seed Citations] Erreur sur la citation "${cleanCitationMg.substring(0, 30)}..." :`, err);
        stats.errors++;
      }
    }
  }

  return stats;
}
