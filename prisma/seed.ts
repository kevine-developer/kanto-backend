import 'dotenv/config';
import {
  PrismaClient,
  DifficultyLevel,
  CivicSubCategory,
  TrueFalseTheme,
} from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RIDDLES_DATA } from './seed-data/riddles.data.js';
import { VINTANA_SIGNS } from './seed-data/vintana.data.js';
import {
  DEFAULT_CIVIC_LESSONS,
  DEFAULT_PRESIDENTS,
  DEFAULT_BANKNOTES,
  DEFAULT_PROVINCE_BLASONS,
  DEFAULT_NATURE_EMBLEMS,
  DEFAULT_HISTORY_DATES,
  DEFAULT_NATIONAL_EMBLEMS,
} from '../src/history/constants/history-defaults.constant.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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

const DEFAULT_THEMES = [
  {
    nameMg: 'Fahendrena',
    nameFr: 'Sagesse',
    slug: 'sagesse',
    icon: 'bulb-outline',
    color: '#E0533C',
  },
  {
    nameMg: 'Fihavanana',
    nameFr: 'Solidarité',
    slug: 'solidarite',
    icon: 'people-outline',
    color: '#2E7D32',
  },
  {
    nameMg: 'Fitiavana',
    nameFr: 'Amour',
    slug: 'amour',
    icon: 'heart-outline',
    color: '#D81B60',
  },
  {
    nameMg: 'Fianakaviana',
    nameFr: 'Famille',
    slug: 'famille',
    icon: 'home-outline',
    color: '#1565C0',
  },
  {
    nameMg: 'Asa sy Faharisihana',
    nameFr: 'Travail & Effort',
    slug: 'travail',
    icon: 'hammer-outline',
    color: '#EF6C00',
  },
  {
    nameMg: 'Fanabeazana',
    nameFr: 'Éducation',
    slug: 'education',
    icon: 'book-outline',
    color: '#6A1B9A',
  },
  {
    nameMg: 'Faharetana',
    nameFr: 'Persévérance',
    slug: 'perseverance',
    icon: 'shield-checkmark-outline',
    color: '#00838F',
  },
  {
    nameMg: 'Fitondran-tena',
    nameFr: 'Morale & Vertu',
    slug: 'morale',
    icon: 'leaf-outline',
    color: '#558B2F',
  },
  {
    nameMg: 'Kolontsaina',
    nameFr: 'Culture & Tradition',
    slug: 'culture',
    icon: 'color-palette-outline',
    color: '#AD1457',
  },
  {
    nameMg: 'Fahamarinana',
    nameFr: 'Justice & Vérité',
    slug: 'justice',
    icon: 'scale-outline',
    color: '#4527A0',
  },
];

const DEFAULT_REGIONS = [
  { name: 'Merina', capital: 'Antananarivo' },
  { name: 'Betsileo', capital: 'Fianarantsoa' },
  { name: 'Betsimisaraka', capital: 'Toamasina' },
  { name: 'Sakalava', capital: 'Mahajanga' },
  { name: 'Antandroy', capital: 'Ambovombe' },
  { name: 'Tsimihety', capital: 'Mandritsara' },
  { name: 'Antankarana', capital: 'Antsiranana' },
  { name: 'Bara', capital: 'Ihosy' },
];

async function main() {
  console.log('🌱 Démarrage du seed de la base de données Kanto...');

  const seedDataDir = path.resolve(__dirname, 'seed-data');

  console.log('🔍 Exécution du seed idempotent (non destructif)...');

  // 2. Création des Thèmes
  const themeMap = new Map<string, string>(); // slug -> id
  for (const theme of DEFAULT_THEMES) {
    const created = await prisma.theme.upsert({
      where: { slug: theme.slug },
      update: {},
      create: theme,
    });
    themeMap.set(theme.slug, created.id);
    themeMap.set(slugify(theme.nameFr), created.id);
    themeMap.set(slugify(theme.nameMg), created.id);
  }
  console.log(`✅ ${DEFAULT_THEMES.length} thèmes créés`);

  // 3. Création des Régions
  for (const region of DEFAULT_REGIONS) {
    await prisma.region.upsert({
      where: { name: region.name },
      update: {},
      create: region,
    });
  }
  console.log(`✅ ${DEFAULT_REGIONS.length} régions créées`);

  // 4. Import des Citations
  const existingCitationsCount = await prisma.citation.count();
  const citationFilePath = path.join(seedDataDir, 'citation.data.json');
  if (existingCitationsCount > 0) {
    console.log(
      `ℹ️ Citations déjà initialisées (${existingCitationsCount} entrées). Étape ignorée.`,
    );
  } else if (fs.existsSync(citationFilePath)) {
    const rawCitations = JSON.parse(fs.readFileSync(citationFilePath, 'utf-8'));
    console.log(
      `📖 Chargement de ${rawCitations.length} citations depuis ${citationFilePath}`,
    );

    for (const c of rawCitations) {
      let authorId: string | null = null;
      if (c.source && c.source.trim()) {
        const author = await prisma.author.upsert({
          where: { name: c.source.trim() },
          update: {},
          create: { name: c.source.trim() },
        });
        authorId = author.id;
      }

      const createdCitation = await prisma.citation.create({
        data: {
          citationMg: c.citationMg,
          citationFr: c.citationFr,
          sourceName: c.source || 'Anonyme',
          contexte: c.contexte || null,
          authorId,
        },
      });

      if (Array.isArray(c.themes)) {
        for (const tName of c.themes) {
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
          await prisma.citationTheme.create({
            data: {
              citationId: createdCitation.id,
              themeId: tId,
            },
          });
        }
      }
    }
    console.log('✅ Citations importées avec succès');
  }

  // 5. Import des Proverbes / Expressions / Dictons (depuis fichiers locaux)
  let firstProverbId: string | null = null;
  const existingItemsCount = await prisma.malagasyItem.count();

  if (existingItemsCount > 0) {
    console.log(
      `ℹ️ Contenus culturels déjà initialisés (${existingItemsCount} entrées). Étape ignorée.`,
    );
    const firstP = await prisma.malagasyItem.findFirst({
      where: { category: 'PROVERBE' },
    });
    firstProverbId = firstP?.id || null;
  } else {
    console.log(
      '📖 Chargement des contenus culturels locaux (proverbes, expressions, dictons)...',
    );
    const DATA_SOURCES = [
      {
        file: 'proverbes.data.json',
        defaultCategory: 'PROVERBE' as const,
      },
      {
        file: 'expressions.data.json',
        defaultCategory: 'EXPRESSION' as const,
      },
      {
        file: 'dictons.data.json',
        defaultCategory: 'DICTON' as const,
      },
    ];

    let totalImported = 0;

    for (const source of DATA_SOURCES) {
      try {
        const filePath = path.join(seedDataDir, source.file);
        if (!fs.existsSync(filePath)) {
          console.warn(`⚠️ Fichier source introuvable: ${filePath}`);
          continue;
        }
        const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        console.log(
          `📖 Insertion de ${rawData.length} éléments (${source.defaultCategory})...`,
        );

        for (let i = 0; i < rawData.length; i++) {
          const item = rawData[i];
          let category: 'PROVERBE' | 'EXPRESSION' | 'DICTON' =
            source.defaultCategory;
          if (item.category === 'proverbe') category = 'PROVERBE';
          if (item.category === 'expression') category = 'EXPRESSION';
          if (item.category === 'dicton') category = 'DICTON';

          const baseSlug = slugify(
            item.malagasy || `${category.toLowerCase()}-${i}`,
          );
          const uniqueSlug = `${baseSlug}-${totalImported + i + 1}`;

          const createdItem = await prisma.malagasyItem.create({
            data: {
              slug: uniqueSlug,
              malagasy: item.malagasy,
              french: item.french,
              meaning: item.meaning,
              example: item.example || null,
              category,
              origins: Array.isArray(item.origins) ? item.origins : [],
              isFeatured: i < 5,
            },
          });

          if (!firstProverbId && category === 'PROVERBE') {
            firstProverbId = createdItem.id;
          }

          if (Array.isArray(item.dialectVariants)) {
            for (const v of item.dialectVariants) {
              if (v.dialect && v.text) {
                await prisma.dialectVariant.create({
                  data: {
                    dialectName: v.dialect,
                    text: v.text,
                    itemId: createdItem.id,
                  },
                });
              }
            }
          }

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
              await prisma.malagasyItemTheme.create({
                data: {
                  itemId: createdItem.id,
                  themeId: tId,
                },
              });
            }
          }
        }

        totalImported += rawData.length;
      } catch (err) {
        console.error(`⚠️ Erreur lors de l'import de ${source.file} :`, err);
      }
    }
  }

  // 6. Proverbe du jour
  const existingDailyProverbCount = await prisma.dailyProverb.count();
  if (existingDailyProverbCount > 0) {
    console.log(
      `ℹ️ Proverbe du jour déjà initialisé (${existingDailyProverbCount} entrées). Étape ignorée.`,
    );
  } else if (firstProverbId) {
    const today = new Date();
    await prisma.dailyProverb.create({
      data: {
        date: today,
        editorial: 'Proverbe du jour pour nourrir la réflexion et la sagesse.',
        itemId: firstProverbId,
      },
    });
    console.log('✅ Proverbe du jour initialisé');
  }

  // 7. Import des Contes (Angano)
  const existingContesCount = await prisma.conte.count();
  const conteFilePath = path.join(seedDataDir, 'conte.data.json');
  if (existingContesCount > 0) {
    console.log(
      `ℹ️ Contes (Angano) déjà initialisés (${existingContesCount} entrées). Étape ignorée.`,
    );
  } else if (fs.existsSync(conteFilePath)) {
    const rawContes = JSON.parse(fs.readFileSync(conteFilePath, 'utf-8'));
    console.log(
      `📖 Chargement de ${rawContes.length} contes depuis ${conteFilePath}`,
    );

    const DEFAULT_CONTE_IMAGE =
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80';

    for (let i = 0; i < rawContes.length; i++) {
      const c = rawContes[i];
      const baseSlug = slugify(c.title);
      const uniqueSlug = `${baseSlug}-${i + 1}`;
      const conteIllustration =
        c.illustration && c.illustration.trim() !== ''
          ? c.illustration.trim()
          : DEFAULT_CONTE_IMAGE;

      const createdConte = await prisma.conte.create({
        data: {
          id: c.id || undefined,
          slug: uniqueSlug,
          title: c.title,
          titleFr: c.titleFr,
          subtitle: c.subtitle || null,
          subtitleFr: c.subtitleFr || null,
          author: c.author || 'Angano Malagasy',
          source: c.source || null,
          illustration: conteIllustration,
          moralMg: c.moral?.textMg || null,
          moralFr: c.moral?.textFr || null,
          variantIds: Array.isArray(c.variants || c.varient)
            ? c.variants || c.varient
            : [],
          isFeatured: i < 3,
        },
      });

      if (Array.isArray(c.content)) {
        for (let pIdx = 0; pIdx < c.content.length; pIdx++) {
          const p = c.content[pIdx];
          await prisma.conteParagraph.create({
            data: {
              conteId: createdConte.id,
              paragraphNumber: p.paragraph || pIdx + 1,
              textMg: p.textMg || '',
              textFr: p.textFr || '',
              illustration: p.illustration || null,
            },
          });
        }
      }

      if (Array.isArray(c.themes)) {
        for (const tName of c.themes) {
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
          await prisma.conteTheme.create({
            data: {
              conteId: createdConte.id,
              themeId: tId,
            },
          });
        }
      }
    }
    console.log(`✅ ${rawContes.length} contes (Angano) importés`);
  }

  // 8. Import des Discours (Kabary)
  const existingKabaryCount = await prisma.kabary.count();
  const kabaryFilePath = path.join(seedDataDir, 'kabary.data.json');
  if (existingKabaryCount > 0) {
    console.log(
      `ℹ️ Discours (Kabary) déjà initialisés (${existingKabaryCount} entrées). Étape ignorée.`,
    );
  } else if (fs.existsSync(kabaryFilePath)) {
    const rawKabaries = JSON.parse(fs.readFileSync(kabaryFilePath, 'utf-8'));
    console.log(
      `🗣️ Chargement de ${rawKabaries.length} discours (Kabary) depuis ${kabaryFilePath}`,
    );

    const DEFAULT_KABARY_IMAGE =
      'https://res.cloudinary.com/dhe585mze/image/upload/v1752952347/Photoroom-20250719_204052441_vlyahm.png';

    for (let i = 0; i < rawKabaries.length; i++) {
      const k = rawKabaries[i];
      const baseSlug = slugify(k.title);
      const uniqueSlug = `${baseSlug}-${i + 1}`;
      const kabaryIllustration =
        k.illustration && k.illustration.trim() !== ''
          ? k.illustration.trim()
          : DEFAULT_KABARY_IMAGE;

      const createdKabary = await prisma.kabary.create({
        data: {
          id: k.id || undefined,
          slug: uniqueSlug,
          title: k.title,
          titleFr: k.titleFr,
          subtitle: k.subtitle || null,
          subtitleFr: k.subtitleFr || null,
          occasion: k.occasion,
          occasionFr: k.occasionFr || null,
          speakerRoleMg: k.speakerRoleMg || null,
          speakerRoleFr: k.speakerRoleFr || null,
          recipientRoleMg: k.recipientRoleMg || null,
          recipientRoleFr: k.recipientRoleFr || null,
          region: k.region || null,
          illustration: kabaryIllustration,
          concludingProverbMg: k.concludingProverb?.mg || null,
          concludingProverbFr: k.concludingProverb?.fr || null,
          etiquetteNotesMg: k.etiquetteNotes?.mg || null,
          etiquetteNotesFr: k.etiquetteNotes?.fr || null,
          isFeatured: i < 3,
        },
      });

      if (Array.isArray(k.steps)) {
        for (let sIdx = 0; sIdx < k.steps.length; sIdx++) {
          const s = k.steps[sIdx];
          await prisma.kabaryStep.create({
            data: {
              kabaryId: createdKabary.id,
              stepNumber: s.stepNumber || sIdx + 1,
              stepNameMg: s.stepNameMg || '',
              stepNameFr: s.stepNameFr || '',
              explanationMg: s.explanationMg || null,
              explanationFr: s.explanationFr || null,
              textMg: s.textMg || '',
              textFr: s.textFr || '',
            },
          });
        }
      }

      if (Array.isArray(k.themes)) {
        for (const tName of k.themes) {
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
          await prisma.kabaryTheme.create({
            data: {
              kabaryId: createdKabary.id,
              themeId: tId,
            },
          });
        }
      }
    }
    console.log(`✅ ${rawKabaries.length} discours (Kabary) importés`);
  }

  // 9. Import des Poésies (Tononkalo)
  const existingPoesieCount = await prisma.poesie.count();
  const poesieFilePath = path.join(seedDataDir, 'poesie.data.json');
  if (existingPoesieCount > 0) {
    console.log(
      `ℹ️ Poésies déjà initialisées (${existingPoesieCount} entrées). Étape ignorée.`,
    );
  } else if (fs.existsSync(poesieFilePath)) {
    const rawPoesies = JSON.parse(fs.readFileSync(poesieFilePath, 'utf-8'));
    console.log(
      `📜 Chargement de ${rawPoesies.length} poésies depuis ${poesieFilePath}`,
    );

    for (let i = 0; i < rawPoesies.length; i++) {
      const p = rawPoesies[i];
      const baseSlug = slugify(p.title);
      const uniqueSlug = `${baseSlug}-${i + 1}`;

      const createdPoesie = await prisma.poesie.create({
        data: {
          id: p.id || undefined,
          slug: uniqueSlug,
          title: p.title,
          titleFr: p.titleFr,
          author: p.author || null,
          period: p.period || null,
          category: p.category || 'tononkalo',
          explanationMg: p.explanationMg || null,
          explanationFr: p.explanationFr || null,
          isFeatured: i === 0,
        },
      });

      if (Array.isArray(p.stanzas)) {
        for (let sIdx = 0; sIdx < p.stanzas.length; sIdx++) {
          const s = p.stanzas[sIdx];
          await prisma.poesieStanza.create({
            data: {
              poesieId: createdPoesie.id,
              stanzaNumber: sIdx + 1,
              versesMg: Array.isArray(s.versesMg) ? s.versesMg : [],
              versesFr: Array.isArray(s.versesFr) ? s.versesFr : [],
            },
          });
        }
      }
    }
    console.log(`✅ ${rawPoesies.length} poésies importées`);
  }

  // 10. Import des Récitations (Tsianjery)
  const existingRecitationCount = await prisma.recitation.count();
  const recitationFilePath = path.join(seedDataDir, 'recitation.data.json');
  if (existingRecitationCount > 0) {
    console.log(
      `ℹ️ Récitations déjà initialisées (${existingRecitationCount} entrées). Étape ignorée.`,
    );
  } else if (fs.existsSync(recitationFilePath)) {
    const rawRecitations = JSON.parse(
      fs.readFileSync(recitationFilePath, 'utf-8'),
    );
    console.log(
      `🎤 Chargement de ${rawRecitations.length} récitations depuis ${recitationFilePath}`,
    );

    for (let i = 0; i < rawRecitations.length; i++) {
      const r = rawRecitations[i];
      const baseSlug = slugify(r.title);
      const uniqueSlug = `${baseSlug}-${i + 1}`;

      await prisma.recitation.create({
        data: {
          id: r.id || undefined,
          slug: uniqueSlug,
          title: r.title,
          titleFr: r.titleFr,
          author: r.author || null,
          description: r.description || null,
          durationMinutes: r.durationMinutes || null,
          contentLines: Array.isArray(r.content) ? r.content : [],
          references: Array.isArray(r.references) ? r.references : [],
          tags: Array.isArray(r.tags) ? r.tags : [],
          isFeatured: i === 0,
        },
      });
    }
    console.log(`✅ ${rawRecitations.length} récitations importées`);
  }

  // 11. Import des Contenus Civiques
  const existingCivicCount = await prisma.civicContent.count();
  if (existingCivicCount > 0) {
    console.log(
      `ℹ️ Contenus civiques déjà initialisés (${existingCivicCount} entrées). Étape ignorée.`,
    );
  } else {
    const civicFiles: { file: string; subCategory: CivicSubCategory }[] = [
      {
        file: 'civic-institution.data.json',
        subCategory: CivicSubCategory.INSTITUTION,
      },
      {
        file: 'droits-et-vote.data.json',
        subCategory: CivicSubCategory.DROITS_VOTE,
      },
      {
        file: 'ecologie-civisme.data.json',
        subCategory: CivicSubCategory.ECOLOGIE_CIVISME,
      },
      {
        file: 'symboles-histoire.data.json',
        subCategory: CivicSubCategory.SYMBOLES_HISTOIRE,
      },
      {
        file: 'vivre-ensemble.data.json',
        subCategory: CivicSubCategory.VIVRE_ENSEMBLE,
      },
    ];

    let totalCivicImported = 0;
    for (const { file, subCategory } of civicFiles) {
      const fullPath = path.join(seedDataDir, 'civique', file);
      if (fs.existsSync(fullPath)) {
        const items = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        console.log(
          `🏛️ Chargement de ${items.length} éléments civiques (${subCategory}) depuis ${file}`,
        );

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const titleFr = item.title?.fr || item.titleFr || `Contenu ${i + 1}`;
          const titleMg = item.title?.mg || item.titleMg || titleFr;
          const baseSlug = slugify(titleFr || titleMg);
          const uniqueSlug = `${subCategory.toLowerCase()}-${baseSlug}-${i + 1}`;

          const createdCivic = await prisma.civicContent.create({
            data: {
              id: item.id || undefined,
              slug: uniqueSlug,
              subCategory,
              titleFr,
              titleMg,
              summaryFr: item.summary?.fr || item.summaryFr || null,
              summaryMg: item.summary?.mg || item.summaryMg || null,
              contentFr: Array.isArray(item.content?.fr) ? item.content.fr : [],
              contentMg: Array.isArray(item.content?.mg) ? item.content.mg : [],
              themes: Array.isArray(item.theme)
                ? item.theme
                : Array.isArray(item.themes)
                  ? item.themes
                  : [],
              sources: Array.isArray(item.sources) ? item.sources : [],
            },
          });

          if (Array.isArray(item.structure)) {
            for (let sIdx = 0; sIdx < item.structure.length; sIdx++) {
              const st = item.structure[sIdx];
              await prisma.civicStructureRole.create({
                data: {
                  civicContentId: createdCivic.id,
                  orderIndex: sIdx + 1,
                  titleFr: st.title?.fr || '',
                  titleMg: st.title?.mg || '',
                  roleFr: st.role?.fr || '',
                  roleMg: st.role?.mg || '',
                },
              });
            }
          }
          totalCivicImported++;
        }
      }
      console.log(
        `✅ Total de ${totalCivicImported} contenus civiques importés`,
      );
    }
  }

  // 12. Import du Quiz Civique
  const existingCivicQuizCount = await prisma.civicQuizQuestion.count();
  const quizFilePath = path.join(seedDataDir, 'civic-quiz.data.json');
  if (existingCivicQuizCount > 0) {
    console.log(
      `ℹ️ Questions de quiz civique déjà initialisées (${existingCivicQuizCount} entrées). Étape ignorée.`,
    );
  } else if (fs.existsSync(quizFilePath)) {
    const rawQuestions = JSON.parse(fs.readFileSync(quizFilePath, 'utf-8'));
    console.log(
      `🎯 Chargement de ${rawQuestions.length} questions de quiz civique depuis ${quizFilePath}`,
    );

    for (const q of rawQuestions) {
      let diff: DifficultyLevel = DifficultyLevel.EASY;
      if (q.difficulty?.toLowerCase() === 'medium')
        diff = DifficultyLevel.MEDIUM;
      if (q.difficulty?.toLowerCase() === 'hard') diff = DifficultyLevel.HARD;

      await prisma.civicQuizQuestion.create({
        data: {
          id: q.id || undefined,
          category: q.category || 'droits_devoirs_vote',
          prompt: q.prompt,
          choices: Array.isArray(q.choices) ? q.choices : [],
          answerIndex: typeof q.answerIndex === 'number' ? q.answerIndex : 0,
          explanation: q.explanation || '',
          difficulty: diff,
          tags: Array.isArray(q.tags) ? q.tags : [],
        },
      });
    }
    console.log(
      `✅ ${rawQuestions.length} questions de quiz civique importées`,
    );
  }
  // 17. Import des Devinettes (Ankamantatra)
  const existingRiddlesCount = await prisma.riddleQuestion.count();
  if (existingRiddlesCount > 0) {
    console.log(
      `ℹ️ Devinettes déjà initialisées (${existingRiddlesCount} entrées). Étape ignorée.`,
    );
  } else {
    console.log(
      `📖 Importation de ${RIDDLES_DATA.length} devinettes (Ankamantatra)...`,
    );
    for (const r of RIDDLES_DATA) {
      await prisma.riddleQuestion.create({
        data: {
          riddleMg: r.riddleMg,
          riddleFr: r.riddleFr,
          options: r.options,
          correctAnswer: r.correctAnswer,
          explanation: r.explanation,
          clue: r.clue || null,
          level: r.level,
        },
      });
    }
    console.log(`✅ ${RIDDLES_DATA.length} devinettes importées`);
  }

  // 18. Import des Signes du Zodiaque (Vintana)
  const existingVintanaCount = await prisma.vintanaSign.count();
  if (existingVintanaCount > 0) {
    console.log(
      `ℹ️ Signes Vintana déjà initialisés (${existingVintanaCount} entrées). Étape ignorée.`,
    );
  } else {
    console.log(
      `📖 Importation de ${VINTANA_SIGNS.length} signes astrologiques (Vintana)...`,
    );
    for (const v of VINTANA_SIGNS) {
      await prisma.vintanaSign.create({
        data: {
          id: v.id,
          nameMg: v.name,
          nameFr: v.nameFr,
          element: v.element,
          description: v.personalityMg + '\n\n' + v.personalityFr,
          luckyDay: v.luckyDayMg,
          luckyColor: null,
        },
      });
    }
    console.log(`✅ ${VINTANA_SIGNS.length} signes Vintana importés`);
  }

  // 19. Import des Questions Vrai ou Faux (Marina sa Diso - fichiers locaux)
  const existingTfCount = await prisma.trueFalseQuestion.count();
  if (existingTfCount > 0) {
    console.log(
      `ℹ️ Questions Vrai/Faux déjà initialisées (${existingTfCount} entrées). Étape ignorée.`,
    );
  } else {
    console.log('📖 Importation des questions Vrai/Faux (fichiers locaux)...');
    const TRUE_FALSE_FILES = [
      'tf-culture.data.json',
      'tf-geographie.data.json',
      'tf-histoire.data.json',
      'tf-litterature.data.json',
      'tf-proverbes.data.json',
      'tf-general.data.json',
    ];

    const TF_THEME_MAP: Record<string, TrueFalseTheme> = {
      CULT: TrueFalseTheme.CULT,
      GEO: TrueFalseTheme.GEO,
      HIST: TrueFalseTheme.HIST,
      LITT: TrueFalseTheme.LITT,
      PROV: TrueFalseTheme.PROV,
      GEN: TrueFalseTheme.GEN,
    };

    const TF_DIFFICULTY_MAP: Record<string, DifficultyLevel> = {
      EASY: DifficultyLevel.EASY,
      MEDIUM: DifficultyLevel.MEDIUM,
      HARD: DifficultyLevel.HARD,
      EXPERT: DifficultyLevel.EXPERT,
    };

    let tfCount = 0;
    for (const fileName of TRUE_FALSE_FILES) {
      try {
        const filePath = path.join(seedDataDir, fileName);
        if (!fs.existsSync(filePath)) {
          console.warn(`⚠️ Fichier Vrai/Faux introuvable: ${filePath}`);
          continue;
        }
        const data: any = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const questions: any[] = data.questions || [];
        for (const q of questions) {
          const theme =
            (q.themeId && TF_THEME_MAP[q.themeId]) || TrueFalseTheme.GEN;
          const difficulty =
            (q.levelId && TF_DIFFICULTY_MAP[q.levelId]) || DifficultyLevel.EASY;

          await prisma.trueFalseQuestion.create({
            data: {
              questionMg: q.questionText,
              questionFr: q.questionTextFr || q.questionText,
              isTrue: Boolean(q.isTrue),
              explanationMg: q.explanation,
              explanationFr: q.explanationFr || q.explanation,
              theme,
              difficulty,
              source: q.source || null,
              image: q.image || null,
              status: 'PUBLISHED',
            },
          });
          tfCount++;
        }
      } catch (err) {
        console.warn(
          `⚠️ Échec du chargement Vrai/Faux depuis ${fileName}:`,
          err,
        );
      }
    }
    console.log(`✅ ${tfCount} questions Vrai/Faux importées`);
  }

  // ==========================================
  // 14. HISTOIRE, MÉMOIRE & PATRIMOINE
  // ==========================================
  console.log(
    '[History] Synchronisation du module Histoire, Mémoire & Patrimoine...',
  );

  // 1. Leçons civiques
  for (const item of DEFAULT_CIVIC_LESSONS) {
    await prisma.civicLesson.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        category: item.category,
        titleFr: item.titleFr,
        titleMg: item.titleMg,
        descriptionFr: item.descriptionFr,
        descriptionMg: item.descriptionMg,
        imageUrl: item.imageUrl,
        status: item.status,
        orderIndex: item.orderIndex,
      },
      update: {
        category: item.category,
        titleFr: item.titleFr,
        titleMg: item.titleMg,
        descriptionFr: item.descriptionFr,
        descriptionMg: item.descriptionMg,
        imageUrl: item.imageUrl,
      },
    });
  }

  // 2. Présidents de la République
  for (const item of DEFAULT_PRESIDENTS) {
    await prisma.president.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        name: item.name,
        titleFr: item.titleFr,
        titleMg: item.titleMg,
        republic: item.republic,
        republicMg: item.republicMg,
        period: item.period,
        quoteFr: item.quoteFr,
        quoteMg: item.quoteMg,
        bioFr: item.bioFr,
        bioMg: item.bioMg,
        achievementsFr: item.achievementsFr,
        achievementsMg: item.achievementsMg,
        badgeColor: item.badgeColor,
        imageUrl: item.imageUrl,
        orderIndex: item.orderIndex,
        status: item.status,
      },
      update: {
        name: item.name,
        titleFr: item.titleFr,
        titleMg: item.titleMg,
        republic: item.republic,
        republicMg: item.republicMg,
        period: item.period,
        quoteFr: item.quoteFr,
        quoteMg: item.quoteMg,
        bioFr: item.bioFr,
        bioMg: item.bioMg,
        achievementsFr: item.achievementsFr,
        achievementsMg: item.achievementsMg,
        badgeColor: item.badgeColor,
        imageUrl: item.imageUrl,
      },
    });
  }

  // 3. Billets de banque
  for (const item of DEFAULT_BANKNOTES) {
    await prisma.banknote.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        valueAriary: item.valueAriary,
        valueFmg: item.valueFmg,
        titleFr: item.titleFr,
        titleMg: item.titleMg,
        series: item.series,
        seriesLabelFr: item.seriesLabelFr,
        seriesLabelMg: item.seriesLabelMg,
        period: item.period,
        colorLight: item.colorLight,
        colorDark: item.colorDark,
        obverseDescriptionFr: item.obverseDescriptionFr,
        obverseDescriptionMg: item.obverseDescriptionMg,
        reverseDescriptionFr: item.reverseDescriptionFr,
        reverseDescriptionMg: item.reverseDescriptionMg,
        symbolismFr: item.symbolismFr,
        symbolismMg: item.symbolismMg,
        securityFeaturesFr: item.securityFeaturesFr,
        imageUrl: item.imageUrl,
        orderIndex: item.orderIndex,
        status: item.status,
      },
      update: {
        valueAriary: item.valueAriary,
        valueFmg: item.valueFmg,
        titleFr: item.titleFr,
        titleMg: item.titleMg,
        series: item.series,
        seriesLabelFr: item.seriesLabelFr,
        seriesLabelMg: item.seriesLabelMg,
        period: item.period,
        colorLight: item.colorLight,
        colorDark: item.colorDark,
        obverseDescriptionFr: item.obverseDescriptionFr,
        obverseDescriptionMg: item.obverseDescriptionMg,
        reverseDescriptionFr: item.reverseDescriptionFr,
        reverseDescriptionMg: item.reverseDescriptionMg,
        symbolismFr: item.symbolismFr,
        symbolismMg: item.symbolismMg,
        securityFeaturesFr: item.securityFeaturesFr,
        imageUrl: item.imageUrl,
      },
    });
  }

  // 4. Blasons des 6 Provinces
  for (const item of DEFAULT_PROVINCE_BLASONS) {
    await prisma.provinceBlason.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        province: item.province,
        chefLieu: item.chefLieu,
        titleFr: item.titleFr,
        titleMg: item.titleMg,
        color: item.color,
        bgLight: item.bgLight,
        borderLight: item.borderLight,
        descriptionFr: item.descriptionFr,
        descriptionMg: item.descriptionMg,
        symbols: item.symbols,
        keyFactsFr: item.keyFactsFr,
        keyFactsMg: item.keyFactsMg,
        imageUrl: item.imageUrl,
        orderIndex: item.orderIndex,
        status: item.status,
      },
      update: {
        province: item.province,
        chefLieu: item.chefLieu,
        titleFr: item.titleFr,
        titleMg: item.titleMg,
        color: item.color,
        bgLight: item.bgLight,
        borderLight: item.borderLight,
        descriptionFr: item.descriptionFr,
        descriptionMg: item.descriptionMg,
        symbols: item.symbols,
        keyFactsFr: item.keyFactsFr,
        keyFactsMg: item.keyFactsMg,
        imageUrl: item.imageUrl,
      },
    });
  }

  // 5. Emblèmes naturels
  for (const item of DEFAULT_NATURE_EMBLEMS) {
    await prisma.natureEmblem.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        nameFr: item.nameFr,
        nameMg: item.nameMg,
        scientificName: item.scientificName,
        type: item.type,
        statusFr: item.statusFr,
        statusMg: item.statusMg,
        descriptionFr: item.descriptionFr,
        descriptionMg: item.descriptionMg,
        culturalRoleFr: item.culturalRoleFr,
        culturalRoleMg: item.culturalRoleMg,
        proverbMg: item.proverbMg,
        proverbFr: item.proverbFr,
        accentColor: item.accentColor,
        imageUrl: item.imageUrl,
        orderIndex: item.orderIndex,
        status: item.status,
      },
      update: {
        nameFr: item.nameFr,
        nameMg: item.nameMg,
        scientificName: item.scientificName,
        type: item.type,
        statusFr: item.statusFr,
        statusMg: item.statusMg,
        descriptionFr: item.descriptionFr,
        descriptionMg: item.descriptionMg,
        culturalRoleFr: item.culturalRoleFr,
        culturalRoleMg: item.culturalRoleMg,
        proverbMg: item.proverbMg,
        proverbFr: item.proverbFr,
        accentColor: item.accentColor,
        imageUrl: item.imageUrl,
      },
    });
  }

  // 6. Dates historiques
  for (const item of DEFAULT_HISTORY_DATES) {
    await prisma.historyDate.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        year: item.year,
        exactDate: item.exactDate,
        titleFr: item.titleFr,
        titleMg: item.titleMg,
        era: item.era,
        summaryFr: item.summaryFr,
        summaryMg: item.summaryMg,
        impactFr: item.impactFr,
        impactMg: item.impactMg,
        accentColor: item.accentColor,
        imageUrl: item.imageUrl,
        orderIndex: item.orderIndex,
        status: item.status,
      },
      update: {
        year: item.year,
        exactDate: item.exactDate,
        titleFr: item.titleFr,
        titleMg: item.titleMg,
        era: item.era,
        summaryFr: item.summaryFr,
        summaryMg: item.summaryMg,
        impactFr: item.impactFr,
        impactMg: item.impactMg,
        accentColor: item.accentColor,
        imageUrl: item.imageUrl,
      },
    });
  }

  // 7. Sceaux nationaux
  for (const item of DEFAULT_NATIONAL_EMBLEMS) {
    await prisma.nationalEmblem.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        period: item.period,
        imageUrl: item.imageUrl,
        government: item.government,
        descriptionFr: item.descriptionFr,
        descriptionMg: item.descriptionMg,
        notesFr: item.notesFr,
        notesMg: item.notesMg,
        orderIndex: item.orderIndex,
        status: item.status,
      },
      update: {
        period: item.period,
        imageUrl: item.imageUrl,
        government: item.government,
        descriptionFr: item.descriptionFr,
        descriptionMg: item.descriptionMg,
        notesFr: item.notesFr,
        notesMg: item.notesMg,
      },
    });
  }
  console.log(
    '[History] Donnees Histoire, Memoire & Patrimoine synchronisees avec succes.',
  );

  console.log('🎉 Seed de la base de données Kanto terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
