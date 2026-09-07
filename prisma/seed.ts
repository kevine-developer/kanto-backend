import 'dotenv/config';
import { PrismaClient, DifficultyLevel, CivicSubCategory } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

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
  { nameMg: 'Fahendrena', nameFr: 'Sagesse', slug: 'sagesse', icon: 'bulb-outline', color: '#E0533C' },
  { nameMg: 'Fihavanana', nameFr: 'Solidarité', slug: 'solidarite', icon: 'people-outline', color: '#2E7D32' },
  { nameMg: 'Fitiavana', nameFr: 'Amour', slug: 'amour', icon: 'heart-outline', color: '#D81B60' },
  { nameMg: 'Fianakaviana', nameFr: 'Famille', slug: 'famille', icon: 'home-outline', color: '#1565C0' },
  { nameMg: 'Asa sy Faharisihana', nameFr: 'Travail & Effort', slug: 'travail', icon: 'hammer-outline', color: '#EF6C00' },
  { nameMg: 'Fanabeazana', nameFr: 'Éducation', slug: 'education', icon: 'book-outline', color: '#6A1B9A' },
  { nameMg: 'Faharetana', nameFr: 'Persévérance', slug: 'perseverance', icon: 'shield-checkmark-outline', color: '#00838F' },
  { nameMg: 'Fitondran-tena', nameFr: 'Morale & Vertu', slug: 'morale', icon: 'leaf-outline', color: '#558B2F' },
  { nameMg: 'Kolontsaina', nameFr: 'Culture & Tradition', slug: 'culture', icon: 'color-palette-outline', color: '#AD1457' },
  { nameMg: 'Fahamarinana', nameFr: 'Justice & Vérité', slug: 'justice', icon: 'scale-outline', color: '#4527A0' },
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

  // 1. Nettoyage initial
  await prisma.civicStructureRole.deleteMany();
  await prisma.civicContent.deleteMany();
  await prisma.civicQuizQuestion.deleteMany();
  await prisma.poesieStanza.deleteMany();
  await prisma.poesie.deleteMany();
  await prisma.recitation.deleteMany();
  await prisma.malagasyItemTheme.deleteMany();
  await prisma.citationTheme.deleteMany();
  await prisma.conteTheme.deleteMany();
  await prisma.conteParagraph.deleteMany();
  await prisma.conte.deleteMany();
  await prisma.kabaryTheme.deleteMany();
  await prisma.kabaryStep.deleteMany();
  await prisma.kabary.deleteMany();
  await prisma.dailyProverb.deleteMany();
  await prisma.dialectVariant.deleteMany();
  await prisma.malagasyItem.deleteMany();
  await prisma.citation.deleteMany();
  await prisma.author.deleteMany();
  await prisma.theme.deleteMany();
  await prisma.region.deleteMany();

  console.log('🧹 Données existantes purgées');

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
  const citationFilePath = path.join(seedDataDir, 'citation.data.json');
  if (fs.existsSync(citationFilePath)) {
    const rawCitations = JSON.parse(fs.readFileSync(citationFilePath, 'utf-8'));
    console.log(`📖 Chargement de ${rawCitations.length} citations depuis ${citationFilePath}`);

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

  // 5. Téléchargement et import des Proverbes / Expressions / Dictons
  console.log('📡 Récupération des contenus culturels (proverbes, expressions, dictons)...');
  const DATA_SOURCES = [
    { url: 'https://raw.githubusercontent.com/gastsar/data-kantomg/main/data/category/proverbes.data.json', defaultCategory: 'PROVERBE' as const },
    { url: 'https://raw.githubusercontent.com/gastsar/data-kantomg/main/data/category/expressions.data.json', defaultCategory: 'EXPRESSION' as const },
    { url: 'https://raw.githubusercontent.com/gastsar/data-kantomg/main/data/category/dictons.data.json', defaultCategory: 'DICTON' as const },
  ];

  let firstProverbId: string | null = null;
  let totalImported = 0;

  for (const source of DATA_SOURCES) {
    try {
      const res = await fetch(source.url);
      if (!res.ok) {
        console.warn(`⚠️ Source introuvable: ${source.url} (${res.status})`);
        continue;
      }
      const rawData = await res.json();
      console.log(`📖 Insertion de ${rawData.length} éléments (${source.defaultCategory})...`);

      for (let i = 0; i < rawData.length; i++) {
        const item = rawData[i];
        let category: 'PROVERBE' | 'EXPRESSION' | 'DICTON' = source.defaultCategory;
        if (item.category === 'proverbe') category = 'PROVERBE';
        if (item.category === 'expression') category = 'EXPRESSION';
        if (item.category === 'dicton') category = 'DICTON';

        const baseSlug = slugify(item.malagasy || `${category.toLowerCase()}-${i}`);
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
      console.error(`⚠️ Erreur lors de l'import de ${source.url} :`, err);
    }
  }

  // 6. Proverbe du jour
  if (firstProverbId) {
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
  const conteFilePath = path.join(seedDataDir, 'conte.data.json');
  if (fs.existsSync(conteFilePath)) {
    const rawContes = JSON.parse(fs.readFileSync(conteFilePath, 'utf-8'));
    console.log(`📖 Chargement de ${rawContes.length} contes depuis ${conteFilePath}`);

    const DEFAULT_CONTE_IMAGE = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80";

    for (let i = 0; i < rawContes.length; i++) {
      const c = rawContes[i];
      const baseSlug = slugify(c.title);
      const uniqueSlug = `${baseSlug}-${i + 1}`;
      const conteIllustration = c.illustration && c.illustration.trim() !== '' ? c.illustration.trim() : DEFAULT_CONTE_IMAGE;

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
          variantIds: Array.isArray(c.variants || c.varient) ? (c.variants || c.varient) : [],
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
  const kabaryFilePath = path.join(seedDataDir, 'kabary.data.json');
  if (fs.existsSync(kabaryFilePath)) {
    const rawKabaries = JSON.parse(fs.readFileSync(kabaryFilePath, 'utf-8'));
    console.log(`🗣️ Chargement de ${rawKabaries.length} discours (Kabary) depuis ${kabaryFilePath}`);

    const DEFAULT_KABARY_IMAGE = "https://res.cloudinary.com/dhe585mze/image/upload/v1752952347/Photoroom-20250719_204052441_vlyahm.png";

    for (let i = 0; i < rawKabaries.length; i++) {
      const k = rawKabaries[i];
      const baseSlug = slugify(k.title);
      const uniqueSlug = `${baseSlug}-${i + 1}`;
      const kabaryIllustration = k.illustration && k.illustration.trim() !== '' ? k.illustration.trim() : DEFAULT_KABARY_IMAGE;

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
  const poesieFilePath = path.join(seedDataDir, 'poesie.data.json');
  if (fs.existsSync(poesieFilePath)) {
    const rawPoesies = JSON.parse(fs.readFileSync(poesieFilePath, 'utf-8'));
    console.log(`📜 Chargement de ${rawPoesies.length} poésies depuis ${poesieFilePath}`);

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
  const recitationFilePath = path.join(seedDataDir, 'recitation.data.json');
  if (fs.existsSync(recitationFilePath)) {
    const rawRecitations = JSON.parse(fs.readFileSync(recitationFilePath, 'utf-8'));
    console.log(`🎤 Chargement de ${rawRecitations.length} récitations depuis ${recitationFilePath}`);

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
  const civicFiles: { file: string; subCategory: CivicSubCategory }[] = [
    { file: 'civic-institution.data.json', subCategory: CivicSubCategory.INSTITUTION },
    { file: 'droits-et-vote.data.json', subCategory: CivicSubCategory.DROITS_VOTE },
    { file: 'ecologie-civisme.data.json', subCategory: CivicSubCategory.ECOLOGIE_CIVISME },
    { file: 'symboles-histoire.data.json', subCategory: CivicSubCategory.SYMBOLES_HISTOIRE },
    { file: 'vivre-ensemble.data.json', subCategory: CivicSubCategory.VIVRE_ENSEMBLE },
  ];

  let totalCivicImported = 0;
  for (const { file, subCategory } of civicFiles) {
    const fullPath = path.join(seedDataDir, 'civique', file);
    if (fs.existsSync(fullPath)) {
      const items = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      console.log(`🏛️ Chargement de ${items.length} éléments civiques (${subCategory}) depuis ${file}`);

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
            themes: Array.isArray(item.theme) ? item.theme : Array.isArray(item.themes) ? item.themes : [],
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
  }
  console.log(`✅ Total de ${totalCivicImported} contenus civiques importés`);

  // 12. Import du Quiz Civique
  const quizFilePath = path.join(seedDataDir, 'civic-quiz.data.json');
  if (fs.existsSync(quizFilePath)) {
    const rawQuestions = JSON.parse(fs.readFileSync(quizFilePath, 'utf-8'));
    console.log(`🎯 Chargement de ${rawQuestions.length} questions de quiz civique depuis ${quizFilePath}`);

    for (const q of rawQuestions) {
      let diff: DifficultyLevel = DifficultyLevel.EASY;
      if (q.difficulty?.toLowerCase() === 'medium') diff = DifficultyLevel.MEDIUM;
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
    console.log(`✅ ${rawQuestions.length} questions de quiz civique importées`);
  }

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
