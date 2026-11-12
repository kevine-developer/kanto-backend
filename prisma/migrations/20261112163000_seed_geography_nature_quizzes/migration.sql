-- Migration : 20261112163000_seed_geography_nature_quizzes
-- 50 questions de quiz authentiques et vérifiées sur « Géographie et trésors naturels de Madagascar »
-- Insertion et mise à jour strictement idempotentes (ON CONFLICT DO UPDATE)
-- Protection intégrale des données et historique utilisateur Kanto MG

DO $$
BEGIN
  -- kanto-geo-nat-q01 : Quel bras de mer sépare l'île de Madagascar du continent afr...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q01',
    'geographie_regions',
    'Quel bras de mer sépare l''île de Madagascar du continent africain à l''ouest ?',
    ARRAY['Le détroit de Bab-el-Mandeb', 'Le canal du Mozambique', 'Le canal des Pangalanes', 'Le détroit de Zanzibar']::TEXT[],
    1,
    'Le canal du Mozambique est le bras de l''océan Indien occidental qui sépare Madagascar de l''Afrique du Sud-Est (notamment du Mozambique), sur une largeur minimale d''environ 400 km.

💡 Indice : Il porte le nom du pays côtier d''Afrique australe qui fait directement face à la côte ouest malgache.',
    'Toro-lalana: Il porte le nom du pays côtier d''Afrique australe qui fait directement face à la côte ouest malgache.',
    'EASY'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Géographie générale de Madagascar', 'Géographie et trésors naturels', 'SRC-01', 'kanto-geo-lvl-1']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Convention sur la Diversité Biologique (CDB) & Ministère de l''Environnement et du Développement Durable (MEDD) — Cinquième rapport national de la Convention sur la Diversité Biologique – Madagascar',
    'https://www.cbd.int/doc/world/mg/mg-nr-05-fr.pdf',
    'GEOGRAPHY_NATURE',
    'SRC-01',
    1,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q02 : Quel rang occupe Madagascar parmi les plus grandes îles du m...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q02',
    'geographie_regions',
    'Quel rang occupe Madagascar parmi les plus grandes îles du monde par sa superficie (environ 587 000 km²) ?',
    ARRAY['Le deuxième rang mondial', 'Le troisième rang mondial', 'Le quatrième rang mondial', 'Le sixième rang mondial']::TEXT[],
    2,
    'Avec environ 587 000 km², Madagascar est la quatrième plus grande île du monde, derrière le Groenland, la Nouvelle-Guinée et Bornéo.

💡 Indice : Trois îles seulement la dépassent en superficie : le Groenland, la Nouvelle-Guinée et Bornéo.',
    'Toro-lalana: Trois îles seulement la dépassent en superficie : le Groenland, la Nouvelle-Guinée et Bornéo.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Géographie générale de Madagascar', 'Géographie et trésors naturels', 'SRC-02', 'kanto-geo-lvl-1']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'UICN / Jenkins, M. D. (Ed.) — Madagascar : profil de l''environnement (Madagascar: An Environmental Profile)',
    'https://portals.iucn.org/library/node/6038',
    'GEOGRAPHY_NATURE',
    'SRC-02',
    1,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q11 : Quel est le plus grand lac de Madagascar par sa superficie ?...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q11',
    'geographie_regions',
    'Quel est le plus grand lac de Madagascar par sa superficie ?',
    ARRAY['Le lac Alaotra', 'Le lac Itasy', 'Le lac Tritriva', 'Le lac Anosy']::TEXT[],
    0,
    'Situé dans la région Alaotra-Mangoro, le lac Alaotra est le plus vaste lac de Madagascar (environ 200 km² d''eau libre entourés d''une vaste zone marécageuse classée site Ramsar) et le cœur du principal bassin rizicole du pays.

💡 Indice : Ce lac donne son nom à une région de l''Est réputée pour être le premier grenier à riz de Madagascar.',
    'Toro-lalana: Ce lac donne son nom à une région de l''Est réputée pour être le premier grenier à riz de Madagascar.',
    'EASY'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Fleuves, lacs et bassins hydrographiques', 'Géographie et trésors naturels', 'SRC-03', 'kanto-geo-lvl-1']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Secrétariat de la Convention de Ramsar — Service d''information sur les Sites Ramsar (SIS) : Le Lac Alaotra : les zones humides et bassin versant (Site n° 1312)',
    'https://rsis.ramsar.org/ris/1312',
    'GEOGRAPHY_NATURE',
    'SRC-03',
    1,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q12 : Quelle voie navigable, longue de plus de 600 kilomètres, rel...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q12',
    'geographie_regions',
    'Quelle voie navigable, longue de plus de 600 kilomètres, relie une succession de lagunes et de cours d''eau le long de la côte est de Madagascar ?',
    ARRAY['Le canal de Dabara', 'Le chenal de la Tsiribihina', 'Le bassin du Sambirano', 'Le canal des Pangalanes']::TEXT[],
    3,
    'Le canal des Pangalanes longe le littoral oriental entre Foulpointe/Toamasina et Farafangana sur plus de 600 km en reliant des lagunes naturelles et des lacs côtiers séparés de l''océan Indien par un cordon dunaire.

💡 Indice : Aménagé en perçant les seuils sableux (les « pangalanes ») entre les lagunes orientales, il permet de naviguer à l''abri de la houle de l''océan Indien.',
    'Toro-lalana: Aménagé en perçant les seuils sableux (les « pangalanes ») entre les lagunes orientales, il permet de naviguer à l''abri de la houle de l''océan Indien.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Fleuves, lacs et bassins hydrographiques', 'Géographie et trésors naturels', 'SRC-04', 'kanto-geo-lvl-1']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'UNESCO Centre du patrimoine mondial / UICN — Profil de l''environnement de Madagascar & Voies d''eau de la côte orientale : Le Canal des Pangalanes',
    'https://portals.iucn.org/library/node/6038',
    'GEOGRAPHY_NATURE',
    'SRC-04',
    1,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q18 : Quel est le point culminant de Madagascar, s'élevant à 2 876...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q18',
    'geographie_regions',
    'Quel est le point culminant de Madagascar, s''élevant à 2 876 mètres d''altitude dans le massif du Tsaratanana ?',
    ARRAY['Le pic Boby (Imarivolanitra)', 'Le Tsiafajavona', 'Le Maromokotro', 'Le mont Amberombo']::TEXT[],
    2,
    'Le Maromokotro, situé au nord de l''île dans le massif volcanique et cristallin du Tsaratanana, est le toit de Madagascar avec une altitude de 2 876 mètres.

💡 Indice : Situé dans le nord de l''île, son nom commençant par « Maro- » désigne le toit de Madagascar à près de 2 880 mètres.',
    'Toro-lalana: Situé dans le nord de l''île, son nom commençant par « Maro- » désigne le toit de Madagascar à près de 2 880 mètres.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Montagnes, reliefs et paysages', 'Géographie et trésors naturels', 'SRC-05', 'kanto-geo-lvl-1']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Madagascar National Parks (MNP) / IRD — Réserve Naturelle Intégrale de Tsaratanana & Monographie hydrologique ORSTOM',
    'https://www.parcs-madagascar.com',
    'GEOGRAPHY_NATURE',
    'SRC-05',
    1,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q25 : Sous quel nom officiel l'UNESCO a-t-elle inscrit en 2007 un ...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q25',
    'geographie_regions',
    'Sous quel nom officiel l''UNESCO a-t-elle inscrit en 2007 un ensemble de six parcs nationaux de l''Est malgache sur la Liste du patrimoine mondial ?',
    ARRAY['Les Forêts humides de l''Atsinanana', 'Les Forêts sèches de l''Andrefana', 'Le Corridor forestier de Fandriana-Vondrozo', 'La Réserve intégrale du Sambirano']::TEXT[],
    0,
    'Inscrit en 2007 au patrimoine mondial de l''UNESCO (et retiré de la liste du patrimoine en péril en juillet 2025), le bien en série « Forêts humides de l''Atsinanana » regroupe six parcs nationaux de l''Est : Marojejy, Masoala, Zahamena, Ranomafana, Andringitra et Andohahela.

💡 Indice : Le mot malgache figurant dans ce titre signifie « l''Est », où se concentrent les forêts pluviales de l''île.',
    'Toro-lalana: Le mot malgache figurant dans ce titre signifie « l''Est », où se concentrent les forêts pluviales de l''île.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Parcs nationaux et aires protégées', 'Géographie et trésors naturels', 'SRC-06', 'kanto-geo-lvl-1']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'UNESCO Centre du patrimoine mondial & MEDD Madagascar — Forêts humides de l''Atsinanana (Bien réf. 1257) – Liste du patrimoine mondial',
    'https://whc.unesco.org/fr/list/1257/',
    'GEOGRAPHY_NATURE',
    'SRC-06',
    1,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q26 : La découverte scientifique de quelle espèce de lémurien en 1...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q26',
    'geographie_regions',
    'La découverte scientifique de quelle espèce de lémurien en 1986 a directement motivé la création du parc national de Ranomafana en 1991 ?',
    ARRAY['Le propithèque soyeux (Propithecus candidus)', 'L''hapalémur doré (Hapalemur aureus)', 'Le microcèbe de Madame Berthe (Microcebus berthae)', 'Le maki vari roux (Varecia rubra)']::TEXT[],
    1,
    'La découverte de l''hapalémur doré (Hapalemur aureus), un lémurien mangeur de bambou géant capable de tolérer de fortes doses de cyanure, en 1986 par l''équipe de Patricia Wright et Bernhard Meier, a conduit à la création du parc national de Ranomafana en 1991.

💡 Indice : Il s''agit d''un lémurien au pelage fauve doré spécialisé dans la consommation de bambou.',
    'Toro-lalana: Il s''agit d''un lémurien au pelage fauve doré spécialisé dans la consommation de bambou.',
    'HARD'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Parcs nationaux et aires protégées', 'Géographie et trésors naturels', 'SRC-07', 'kanto-geo-lvl-1']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Madagascar National Parks (MNP) / Meier, B., Albignac, R., Peyriéras, A., Rumpler, Y. & Wright, P. C. (1987) — Parc National de Ranomafana & Description de Hapalemur aureus (Folia Primatologica)',
    'https://www.parcs-madagascar.com/aire-protegee/parc-national-ranomafana',
    'GEOGRAPHY_NATURE',
    'SRC-07',
    1,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q33 : Sur les huit espèces de baobabs (genre Adansonia) classiquem...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q33',
    'geographie_regions',
    'Sur les huit espèces de baobabs (genre Adansonia) classiquement recensées dans le monde, combien sont strictement endémiques de Madagascar ?',
    ARRAY['Deux espèces', 'Quatre espèces', 'Six espèces', 'Huit espèces']::TEXT[],
    2,
    'Madagascar abrite six espèces de baobabs strictement endémiques : Adansonia grandidieri, A. za, A. rubrostipa (fony), A. madagascariensis, A. suarezensis et A. perrieri (auxquelles s''ajoute sur l''île le baobab africain non endémique A. digitata).

💡 Indice : Seules deux espèces de ce genre botanique ont leur berceau hors de Madagascar (l''une en Afrique continentale, l''autre en Australie).',
    'Toro-lalana: Seules deux espèces de ce genre botanique ont leur berceau hors de Madagascar (l''une en Afrique continentale, l''autre en Australie).',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Faune et flore endémiques', 'Géographie et trésors naturels', 'SRC-08', 'kanto-geo-lvl-1']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Baum, D. A. (1995) / CIRAD & Université d''Antananarivo — A Systematic Revision of Adansonia (Bombacaceae/Malvaceae) & Les baobabs de Madagascar : cadre réglementaire et conservation (Madagascar Conservation & Development)',
    'https://journalmcd.com/index.php/mcd/article/view/mcd.v9i1.7',
    'GEOGRAPHY_NATURE',
    'SRC-08',
    1,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q34 : Quel est le plus grand lémurien vivant actuel, célèbre pour ...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q34',
    'geographie_regions',
    'Quel est le plus grand lémurien vivant actuel, célèbre pour ses puissants chants territoriaux et son absence presque totale de queue ?',
    ARRAY['Le maki catta (Lemur catta)', 'L''aye-aye (Daubentonia madagascariensis)', 'Le microcèbe mignon (Microcebus murinus)', 'L''indri (Indri indri)']::TEXT[],
    3,
    'Appelé localement « Babakoto », l''indri (Indri indri) est le plus grand des lémuriens actuels (pouvant atteindre 60 à 70 cm pour 6 à 9,5 kg). Il se distingue par sa queue vestigiale et ses vocalisations mélodieuses audibles à plusieurs kilomètres dans les forêts d''Andasibe-Mantadia.

💡 Indice : Surnommé « Babakoto » dans la tradition malgache, on l''observe et on l''entend particulièrement dans la forêt d''Analamazaotra (Andasibe).',
    'Toro-lalana: Surnommé « Babakoto » dans la tradition malgache, on l''observe et on l''entend particulièrement dans la forêt d''Analamazaotra (Andasibe).',
    'EASY'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Faune et flore endémiques', 'Géographie et trésors naturels', 'SRC-09', 'kanto-geo-lvl-1']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'UICN Red List / Mittermeier, R. A. et al. — Lemurs of Madagascar (Conservation International) & Fiche Indri indri',
    'https://www.iucnredlist.org/species/10826/115565566',
    'GEOGRAPHY_NATURE',
    'SRC-09',
    1,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q43 : Sur quelle île côtière du nord-ouest de Madagascar se situe ...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q43',
    'geographie_regions',
    'Sur quelle île côtière du nord-ouest de Madagascar se situe le parc national de Lokobe, dernier vestige de la forêt primaire du Sambirano sur cette île ?',
    ARRAY['Nosy Be', 'Nosy Boraha (Sainte-Marie)', 'Nosy Mangabe', 'Nosy Ve']::TEXT[],
    0,
    'Situé au sud-est de l''île de Nosy Be (région DIANA), le parc national de Lokobe protège 740 hectares de forêt dense humide de basse altitude typique du domaine du Sambirano, abritant notamment le lémur macaco (Eulemur macaco) et le caméléon panthère.

💡 Indice : C''est la plus célèbre île volcanique et touristique du nord-ouest malgache, surnommée « l''île aux parfums ».',
    'Toro-lalana: C''est la plus célèbre île volcanique et touristique du nord-ouest malgache, surnommée « l''île aux parfums ».',
    'HARD'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Îles, plages, littoraux et trésors naturels', 'Géographie et trésors naturels', 'SRC-10', 'kanto-geo-lvl-1']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Madagascar National Parks (MNP) — Parc National de Lokobe (Nosy Be)',
    'https://www.parcs-madagascar.com/aire-protegee/parc-national-lokobe',
    'GEOGRAPHY_NATURE',
    'SRC-10',
    1,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q03 : Quelles sont les six provinces historiques (faritany) de Mad...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q03',
    'geographie_regions',
    'Quelles sont les six provinces historiques (faritany) de Madagascar ?',
    ARRAY['Antananarivo, Antsirabe, Morondava, Sambava, Manakara, Taolagnaro', 'Antananarivo, Antsiranana, Fianarantsoa, Mahajanga, Toamasina, Toliara', 'Analamanga, Boeny, DIANA, Menabe, Atsinanana, Vakinankaratra', 'Antananarivo, Nosy Be, Ambatondrazaka, Ambositra, Toliara, Toamasina']::TEXT[],
    1,
    'Les six provinces historiques (faritany) qui structurent la géographie administrative de Madagascar sont Antananarivo, Antsiranana (Diego-Suarez), Fianarantsoa, Mahajanga (Majunga), Toamasina (Tamatave) et Toliara (Tuléar).

💡 Indice : Cette liste regroupe la capitale sur les Hautes Terres ainsi que les cinq grandes métropoles historiques du Nord, du Nord-Ouest, de l''Est, du Centre-Sud et du Sud-Ouest.',
    'Toro-lalana: Cette liste regroupe la capitale sur les Hautes Terres ainsi que les cinq grandes métropoles historiques du Nord, du Nord-Ouest, de l''Est, du Centre-Sud et du Sud-Ouest.',
    'EASY'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Géographie générale de Madagascar', 'Géographie et trésors naturels', 'SRC-11', 'kanto-geo-lvl-2']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'République de Madagascar (Ministère de l''Intérieur et de la Décentralisation) — Loi n° 2014-020, Loi n° 2021-010 et Loi n° 2023-012 relatives aux Collectivités Territoriales Décentralisées (6 provinces et 24 régions)',
    'https://www.mid.gov.mg',
    'GEOGRAPHY_NATURE',
    'SRC-11',
    2,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q04 : Quel parallèle géographique remarquable traverse le sud de M...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q04',
    'geographie_regions',
    'Quel parallèle géographique remarquable traverse le sud de Madagascar, à proximité immédiate de la ville de Toliara ?',
    ARRAY['L''Équateur', 'Le tropique du Cancer', 'Le tropique du Capricorne', 'Le 40e parallèle sud']::TEXT[],
    2,
    'Le tropique du Capricorne (situé vers 23°26'' de latitude sud) traverse la partie méridionale de Madagascar, juste au sud de Toliara (province de Toliara, région Atsimo-Andrefana).

💡 Indice : Il s''agit du tropique situé dans l''hémisphère sud.',
    'Toro-lalana: Il s''agit du tropique situé dans l''hémisphère sud.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Géographie générale de Madagascar', 'Géographie et trésors naturels', 'SRC-01', 'kanto-geo-lvl-2']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Convention sur la Diversité Biologique (CDB) & Ministère de l''Environnement et du Développement Durable (MEDD) — Cinquième rapport national de la Convention sur la Diversité Biologique – Madagascar',
    'https://www.cbd.int/doc/world/mg/mg-nr-05-fr.pdf',
    'GEOGRAPHY_NATURE',
    'SRC-01',
    2,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q13 : Quel est le plus long fleuve de Madagascar, qui draine le ce...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q13',
    'geographie_regions',
    'Quel est le plus long fleuve de Madagascar, qui draine le centre-sud de l''île avant de se jeter dans le canal du Mozambique par un vaste delta au nord de Morombe ?',
    ARRAY['Le Mangoky', 'Le Mandrare', 'La Mananara', 'L''Ivondro']::TEXT[],
    0,
    'Le Mangoky, formé notamment par la Matsiatra et la Mananantanana (et prenant sa source la plus lointaine avec l''Ihosy), est le plus long fleuve de Madagascar (environ 564 km pour le cours principal Matsiatra-Mangoky et jusqu''à 821 km avec ses affluents supérieurs) et possède un bassin versant d''environ 55 750 km².

💡 Indice : Son vaste delta marécageux et de mangroves se situe sur la côte ouest, entre Morondava et Toliara.',
    'Toro-lalana: Son vaste delta marécageux et de mangroves se situe sur la côte ouest, entre Morondava et Toliara.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Fleuves, lacs et bassins hydrographiques', 'Géographie et trésors naturels', 'SRC-12', 'kanto-geo-lvl-2']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Chaperon, P., Danloux, J. & Ferry, L. (1993) – IRD / ORSTOM & DMH Madagascar — Fleuves et rivières de Madagascar (Monographies hydrologiques ORSTOM n° 10)',
    'https://horizon.documentation.ird.fr/exl-doc/pleins_textes/divers16-06/37357.pdf',
    'GEOGRAPHY_NATURE',
    'SRC-12',
    2,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q19 : Dans quel massif montagneux du sud-est des Hautes Terres se ...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q19',
    'geographie_regions',
    'Dans quel massif montagneux du sud-est des Hautes Terres se dresse le pic Boby (Imarivolanitra), deuxième plus haut sommet de Madagascar à 2 658 mètres ?',
    ARRAY['Le massif de l''Ankaratra', 'Le massif de l''Isalo', 'Le massif du Makay', 'Le massif de l''Andringitra']::TEXT[],
    3,
    'Le pic Boby, rebaptisé Imarivolanitra (« proche du ciel »), culmine à 2 658 mètres au cœur du massif granitique de l''Andringitra, protégé par le parc national d''Andringitra entre les régions Haute Matsiatra et Ihorombe.

💡 Indice : Situé au sud d''Ambalavao, ce massif granitique donne son nom à un célèbre parc national inscrit au patrimoine mondial de l''UNESCO.',
    'Toro-lalana: Situé au sud d''Ambalavao, ce massif granitique donne son nom à un célèbre parc national inscrit au patrimoine mondial de l''UNESCO.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Montagnes, reliefs et paysages', 'Géographie et trésors naturels', 'SRC-13', 'kanto-geo-lvl-2']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Madagascar National Parks (MNP) & UNESCO — Parc National d''Andringitra',
    'https://www.parcs-madagascar.com/aire-protegee/parc-national-andringitra',
    'GEOGRAPHY_NATURE',
    'SRC-13',
    2,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q20 : Quel terme malgache, signifiant littéralement « là où l'on n...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q20',
    'geographie_regions',
    'Quel terme malgache, signifiant littéralement « là où l''on ne peut pas marcher pieds nus », désigne les reliefs karstiques de calcaires ciselés en aiguilles acérées ?',
    ARRAY['Lavaka', 'Tampoketsa', 'Tsingy', 'Tanety']::TEXT[],
    2,
    'Le mot « Tsingy » (lié à l''expression « mitsingitsingy », marcher sur la pointe des pieds) désigne les plateaux calcaires jurassiques dissous par l''érosion pluviale et souterraine en lames et cathédrales rocheuses tranchantes, comme à Bemaraha, Ankarana ou Namoroka.

💡 Indice : Ce mot figure dans le nom du célèbre parc national de Bemaraha, classé au patrimoine mondial de l''UNESCO.',
    'Toro-lalana: Ce mot figure dans le nom du célèbre parc national de Bemaraha, classé au patrimoine mondial de l''UNESCO.',
    'HARD'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Montagnes, reliefs et paysages', 'Géographie et trésors naturels', 'SRC-14', 'kanto-geo-lvl-2']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Madagascar National Parks (MNP) & UNESCO Centre du patrimoine mondial — Parc National et Réserve Naturelle Intégrale du Tsingy de Bemaraha (Bien réf. 494)',
    'https://whc.unesco.org/fr/list/494/',
    'GEOGRAPHY_NATURE',
    'SRC-14',
    2,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q27 : Quel parc national du centre-sud de Madagascar, traversé par...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q27',
    'geographie_regions',
    'Quel parc national du centre-sud de Madagascar, traversé par la route nationale 7 près de Ranohira, est célèbre pour son massif gréseux ruiniforme datant du Jurassique et ses piscines naturelles ?',
    ARRAY['Le parc national de l''Isalo', 'Le parc national de Zahamena', 'Le parc national de la Montagne d''Ambre', 'Le parc national de la Baie de Baly']::TEXT[],
    0,
    'Créé en 1962 dans la région Ihorombe près de Ranohira, le parc national de l''Isalo couvre 81 540 hectares d''un massif de grès continental jurassique sculpté par l''érosion en canyons profonds (canyon des Makis, canyon des Rats) et oasis ombragées de palmiers.

💡 Indice : C''est l''un des parcs les plus visités le long de la RN7, célèbre pour sa « Fenêtre » rocheuse au coucher du soleil.',
    'Toro-lalana: C''est l''un des parcs les plus visités le long de la RN7, célèbre pour sa « Fenêtre » rocheuse au coucher du soleil.',
    'EASY'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Parcs nationaux et aires protégées', 'Géographie et trésors naturels', 'SRC-15', 'kanto-geo-lvl-2']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Madagascar National Parks (MNP) — Parc National de l''Isalo',
    'https://www.parcs-madagascar.com/aire-protegee/parc-national-isalo',
    'GEOGRAPHY_NATURE',
    'SRC-15',
    2,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q28 : Quel parc national du nord-est de Madagascar est le plus vas...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q28',
    'geographie_regions',
    'Quel parc national du nord-est de Madagascar est le plus vaste complexe protégé du réseau Madagascar National Parks, associant forêts pluviales littorales et trois parcs marins ?',
    ARRAY['Le parc national d''Analamazaotra', 'Le parc national de Masoala', 'Le parc national de Zombitse-Vohibasia', 'Le parc national de Kirindy Mitea']::TEXT[],
    1,
    'Situé sur la presqu''île du même nom au nord-est de la baie d''Antongil, le parc national de Masoala s''étend sur environ 230 000 hectares terrestres et 10 000 hectares répartis en trois parcs marins (Tampolo, Ambodilaitry et Ifaho), où la forêt primaire humide rejoint directement les récifs coralliens et les mangroves.

💡 Indice : Il occupe une immense péninsule boisée qui ferme l''est de la baie d''Antongil, près de Maroantsetra.',
    'Toro-lalana: Il occupe une immense péninsule boisée qui ferme l''est de la baie d''Antongil, près de Maroantsetra.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Parcs nationaux et aires protégées', 'Géographie et trésors naturels', 'SRC-16', 'kanto-geo-lvl-2']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Madagascar National Parks (MNP) — Parc National de Masoala et Réserve Spéciale de Nosy Mangabe',
    'https://www.parcs-madagascar.com/aire-protegee/parc-national-masoala',
    'GEOGRAPHY_NATURE',
    'SRC-16',
    2,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q35 : Quel est le plus grand mammifère carnivore terrestre endémiq...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q35',
    'geographie_regions',
    'Quel est le plus grand mammifère carnivore terrestre endémique de Madagascar, appartenant à la famille des Eupleridae ?',
    ARRAY['La civette malgache (Fossa fossana)', 'La mangouste à queue annelée (Galidia elegans)', 'Le fossa (Cryptoprocta ferox)', 'Le tenrec commun (Tenrec ecaudatus)']::TEXT[],
    2,
    'Le fossa (Cryptoprocta ferox) est le plus grand carnivore mammifère endémique de Madagascar. Agile dans les arbres comme au sol, il appartient à la famille endémique des Eupleridae et joue le rôle de prédateur suprême dans les forêts malgaches, notamment vis-à-vis des lémuriens.

💡 Indice : Doté d''une allure féline et d''une longue queue qui l''aide à s''équilibrer dans les arbres, il est le principal prédateur naturel des lémuriens.',
    'Toro-lalana: Doté d''une allure féline et d''une longue queue qui l''aide à s''équilibrer dans les arbres, il est le principal prédateur naturel des lémuriens.',
    'EASY'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Faune et flore endémiques', 'Géographie et trésors naturels', 'SRC-17', 'kanto-geo-lvl-2']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'UICN Red List / Hawkins, F. — Cryptoprocta ferox (Fossa) – The IUCN Red List of Threatened Species',
    'https://www.iucnredlist.org/species/5760/45197189',
    'GEOGRAPHY_NATURE',
    'SRC-17',
    2,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q36 : Quelle espèce de baobab géant, appelée localement « Renala »...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q36',
    'geographie_regions',
    'Quelle espèce de baobab géant, appelée localement « Renala » (mère de la forêt), borde la célèbre Allée des Baobabs au nord de Morondava ?',
    ARRAY['Adansonia suarezensis', 'Adansonia rubrostipa', 'Adansonia perrieri', 'Adansonia grandidieri']::TEXT[],
    3,
    'L''Allée des Baobabs (aire protégée classée Monument Naturel dans la région du Menabe) est bordée de majestueux baobabs de Grandidier (Adansonia grandidieri), la plus massive des espèces malgaches, au tronc cylindrique élancé pouvant atteindre 25 à 30 mètres de haut.

💡 Indice : Son nom scientifique rend hommage à Alfred Grandidier, célèbre naturaliste et explorateur de Madagascar au XIXe siècle.',
    'Toro-lalana: Son nom scientifique rend hommage à Alfred Grandidier, célèbre naturaliste et explorateur de Madagascar au XIXe siècle.',
    'HARD'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Faune et flore endémiques', 'Géographie et trésors naturels', 'SRC-08', 'kanto-geo-lvl-2']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Baum, D. A. (1995) / CIRAD & Université d''Antananarivo — A Systematic Revision of Adansonia (Bombacaceae/Malvaceae) & Les baobabs de Madagascar : cadre réglementaire et conservation (Madagascar Conservation & Development)',
    'https://journalmcd.com/index.php/mcd/article/view/mcd.v9i1.7',
    'GEOGRAPHY_NATURE',
    'SRC-08',
    2,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q44 : Quel est le nom malgache de l'île Sainte-Marie, située au la...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q44',
    'geographie_regions',
    'Quel est le nom malgache de l''île Sainte-Marie, située au large de la côte nord-est et réputée pour l''observation des baleines à bosse ?',
    ARRAY['Nosy Alanana', 'Nosy Boraha', 'Nosy Komba', 'Nosy Mitsio']::TEXT[],
    1,
    'L''île Sainte-Marie est appelée Nosy Boraha en malgache. Longue d''environ 60 kilomètres face à Soanierana Ivongo (région Analanjirofo), son canal abrité accueille chaque année de juillet à septembre les baleines à bosse (Megaptera novaeangliae) venues mettre bas et se reproduire.

💡 Indice : Cette île allongée de la côte est dépend de la région Analanjirofo et son nom malgache est associé à la figure d''Ibrahim (Boraha).',
    'Toro-lalana: Cette île allongée de la côte est dépend de la région Analanjirofo et son nom malgache est associé à la figure d''Ibrahim (Boraha).',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Îles, plages, littoraux et trésors naturels', 'Géographie et trésors naturels', 'SRC-18', 'kanto-geo-lvl-2']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Office National du Tourisme de Madagascar (ONTM) & Cetamada — Île Sainte-Marie (Nosy Boraha) et migration des baleines à bosse',
    'https://madagascar-tourisme.com',
    'GEOGRAPHY_NATURE',
    'SRC-18',
    2,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q05 : Que désigne l'acronyme de la région « SAVA », située dans le...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q05',
    'geographie_regions',
    'Que désigne l''acronyme de la région « SAVA », située dans le nord-est de Madagascar et mondialement réputée pour sa production de vanille ?',
    ARRAY['Soalala, Ambanja, Vohémar, Ambilobe', 'Soanierana, Ambatondrazaka, Vatomandry, Andapa', 'Sambava, Antalaha, Vohémar, Andapa', 'Sakaraha, Ambovombe, Vangaindrano, Amboasary']::TEXT[],
    2,
    'L''acronyme SAVA est formé par les initiales des quatre districts et villes principales qui composent cette région du Nord-Est : Sambava (chef-lieu de région), Antalaha, Vohémar (Iharana) et Andapa.

💡 Indice : Il s''agit des quatre grandes villes du triangle de la vanille et de la cuvette rizicole du Nord-Est.',
    'Toro-lalana: Il s''agit des quatre grandes villes du triangle de la vanille et de la cuvette rizicole du Nord-Est.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Géographie générale de Madagascar', 'Géographie et trésors naturels', 'SRC-11', 'kanto-geo-lvl-3']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'République de Madagascar (Ministère de l''Intérieur et de la Décentralisation) — Loi n° 2014-020, Loi n° 2021-010 et Loi n° 2023-012 relatives aux Collectivités Territoriales Décentralisées (6 provinces et 24 régions)',
    'https://www.mid.gov.mg',
    'GEOGRAPHY_NATURE',
    'SRC-11',
    3,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q06 : Comment se nomme le point le plus méridional de Madagascar, ...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q06',
    'geographie_regions',
    'Comment se nomme le point le plus méridional de Madagascar, situé dans la région Androy et protégé par une réserve spéciale ?',
    ARRAY['Le cap d''Ambre (Tanjona Bobaomby)', 'Le cap Saint-André (Tanjonailanjavibe)', 'Le cap Masoala', 'Le cap Sainte-Marie (Tanjona Vohimena)']::TEXT[],
    3,
    'Le cap Sainte-Marie, appelé Tanjona Vohimena en malgache, constitue l''extrémité australe de Madagascar (vers 25°36'' S). Sa réserve spéciale de 1 750 hectares protège une végétation épineuse naine façonnée par le vent, des tortues étoilées et des fragments d''œufs fossiles d''Aepyornis.

💡 Indice : En malgache, ce cap battu par les vents de l''océan Indien au sud de Tsihombe est appelé « Tanjona Vohimena ».',
    'Toro-lalana: En malgache, ce cap battu par les vents de l''océan Indien au sud de Tsihombe est appelé « Tanjona Vohimena ».',
    'HARD'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Géographie générale de Madagascar', 'Géographie et trésors naturels', 'SRC-19', 'kanto-geo-lvl-3']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Madagascar National Parks (MNP) — Réserve Spéciale de Cap Sainte-Marie (Tanjona Vohimena)',
    'https://www.parcs-madagascar.com',
    'GEOGRAPHY_NATURE',
    'SRC-19',
    3,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q14 : Quel grand fleuve du nord-ouest de Madagascar, recevant les ...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q14',
    'geographie_regions',
    'Quel grand fleuve du nord-ouest de Madagascar, recevant les eaux de l''Ikopa, est célèbre pour son vaste estuaire de couleur rouge brique dans la baie de Bombetoka près de Mahajanga ?',
    ARRAY['La Betsiboka', 'La Mananjary', 'La Linta', 'La Rianila']::TEXT[],
    0,
    'Longue d''environ 525 km, la Betsiboka draine les Hautes Terres au nord d''Antananarivo (avec son principal affluent l''Ikopa) et se jette dans la baie de Bombetoka à Mahajanga. Ses eaux chargées de sédiments latéritiques témoignent de l''intense érosion des bassins versants.

💡 Indice : Il donne son nom à une région dont le chef-lieu est Maevatanana et son embouchure se situe à Mahajanga.',
    'Toro-lalana: Il donne son nom à une région dont le chef-lieu est Maevatanana et son embouchure se situe à Mahajanga.',
    'EASY'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Fleuves, lacs et bassins hydrographiques', 'Géographie et trésors naturels', 'SRC-12', 'kanto-geo-lvl-3']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Chaperon, P., Danloux, J. & Ferry, L. (1993) – IRD / ORSTOM & DMH Madagascar — Fleuves et rivières de Madagascar (Monographies hydrologiques ORSTOM n° 10)',
    'https://horizon.documentation.ird.fr/exl-doc/pleins_textes/divers16-06/37357.pdf',
    'GEOGRAPHY_NATURE',
    'SRC-12',
    3,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q15 : Quelle est la particularité écologique majeure du lac Tsiman...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q15',
    'geographie_regions',
    'Quelle est la particularité écologique majeure du lac Tsimanampetsotsa, situé dans le sud-ouest de Madagascar ?',
    ARRAY['C''est un lac glaciaire permanent d''altitude entouré de conifères', 'C''est un lac peu profond saturé en sulfate de calcium où aucun poisson ne peut survivre, fréquenté par les flamants', 'C''est le lac le plus profond d''Afrique avec plus de 500 mètres de profondeur', 'C''est un réservoir hydroélectrique artificiel créé sous la monarchie Merina']::TEXT[],
    1,
    'Situé au pied du plateau calcaire Mahafaly, le lac Tsimanampetsotsa est un lac alcalin peu profond saturé en sels minéraux (notamment en sulfate de calcium). Aucune espèce de poisson n''y survit, mais ses eaux abritent des algues et crustacés qui attirent des milliers de flamants roses et de flamants nains.

💡 Indice : Situé dans une région semi-aride, ses rives blanches crayeuses accueillent d''importantes colonies de flamants roses et nains.',
    'Toro-lalana: Situé dans une région semi-aride, ses rives blanches crayeuses accueillent d''importantes colonies de flamants roses et nains.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Fleuves, lacs et bassins hydrographiques', 'Géographie et trésors naturels', 'SRC-20', 'kanto-geo-lvl-3']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Madagascar National Parks (MNP) & Sparks, J. S. / Chakrabarty, P. (American Museum Novitates, 2012) — Parc National de Tsimanampesotse & Revision of the Endemic Malagasy Cavefish Genus Typhleotris',
    'https://digitallibrary.amnh.org/items/c1b8608e-5295-4b11-8f57-f9f419e660c4',
    'GEOGRAPHY_NATURE',
    'SRC-20',
    3,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q21 : Quel massif volcanique des Hautes Terres centrales, situé en...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q21',
    'geographie_regions',
    'Quel massif volcanique des Hautes Terres centrales, situé entre Antananarivo et Antsirabe, culmine au mont Tsiafajavona à 2 643 mètres d''altitude ?',
    ARRAY['Le massif du Marojejy', 'Le massif du Kalambatritra', 'Le massif de l''Ankaratra', 'Le massif du Bongolava']::TEXT[],
    2,
    'Le massif volcanique de l''Ankaratra s''étend au sud-ouest d''Antananarivo jusqu''à Antsirabe (région Vakinankaratra). Il culmine à 2 643 mètres au pic Tsiafajavona, dont le nom malgache signifie « jamais hors du brouillard ».

💡 Indice : Son nom est intégré dans celui de la région « Vakinankaratra » dont le chef-lieu est Antsirabe.',
    'Toro-lalana: Son nom est intégré dans celui de la région « Vakinankaratra » dont le chef-lieu est Antsirabe.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Montagnes, reliefs et paysages', 'Géographie et trésors naturels', 'SRC-21', 'kanto-geo-lvl-3']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Association Vahatra / Goodman, S. M. et al. (2018) — Les aires protégées terrestres de Madagascar : Leur histoire, description et biote (Massif de l''Ankaratra / Manjakatompo-Ankaratra)',
    'https://www.vahatra.mg',
    'GEOGRAPHY_NATURE',
    'SRC-21',
    3,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q29 : En quelle année la Réserve naturelle intégrale du Tsingy de ...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q29',
    'geographie_regions',
    'En quelle année la Réserve naturelle intégrale du Tsingy de Bemaraha est-elle devenue le tout premier site de Madagascar inscrit au patrimoine mondial de l''UNESCO ?',
    ARRAY['En 1960', 'En 1975', 'En 1990', 'En 2012']::TEXT[],
    2,
    'Créée en tant que réserve naturelle intégrale dès 1927, le Tsingy de Bemaraha a été inscrit sur la Liste du patrimoine mondial de l''UNESCO en 1990 (avant d''être étendu en 2023 pour former le bien en série des Forêts sèches de l''Andrefana).

💡 Indice : Cette inscription historique au patrimoine naturel mondial a eu lieu à la toute fin du XXe siècle, exactement trente ans après l''indépendance.',
    'Toro-lalana: Cette inscription historique au patrimoine naturel mondial a eu lieu à la toute fin du XXe siècle, exactement trente ans après l''indépendance.',
    'EASY'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Parcs nationaux et aires protégées', 'Géographie et trésors naturels', 'SRC-14', 'kanto-geo-lvl-3']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Madagascar National Parks (MNP) & UNESCO Centre du patrimoine mondial — Parc National et Réserve Naturelle Intégrale du Tsingy de Bemaraha (Bien réf. 494)',
    'https://whc.unesco.org/fr/list/494/',
    'GEOGRAPHY_NATURE',
    'SRC-14',
    3,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q30 : Quel parc national du sud-est de Madagascar (région Anosy) p...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q30',
    'geographie_regions',
    'Quel parc national du sud-est de Madagascar (région Anosy) protège une transition écologique unique entre la forêt dense humide de l''Est et le fourré épineux sec du Sud ?',
    ARRAY['Le parc national d''Andohahela', 'Le parc national d''Ankarafantsika', 'Le parc national de Sahamalaza', 'Le parc national de Marolambo']::TEXT[],
    0,
    'Situé près de Taolagnaro (Fort-Dauphin), le parc national d''Andohahela (76 020 ha) est composé de trois parcelles séparées par la chaîne anosyenne qui créent un effet de foehn spectaculaire : forêt pluviale à l''est (Malio), fourré xérophile à l''ouest (Ihazofotsy) et forêt de transition au centre (Tsimelahy).

💡 Indice : Ce parc proche de Taolagnaro (Fort-Dauphin) abrite dans sa zone de transition le célèbre palmier trièdre (Dypsis decaryi).',
    'Toro-lalana: Ce parc proche de Taolagnaro (Fort-Dauphin) abrite dans sa zone de transition le célèbre palmier trièdre (Dypsis decaryi).',
    'HARD'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Parcs nationaux et aires protégées', 'Géographie et trésors naturels', 'SRC-22', 'kanto-geo-lvl-3']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Madagascar National Parks (MNP) — Parc National d''Andohahela',
    'https://www.parcs-madagascar.com/aire-protegee/parc-national-andohahela',
    'GEOGRAPHY_NATURE',
    'SRC-22',
    3,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q37 : Quel arbre emblématique de Madagascar, appelé « Ravinala », ...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q37',
    'geographie_regions',
    'Quel arbre emblématique de Madagascar, appelé « Ravinala », est connu pour ses feuilles disposées en éventail et sa capacité à retenir l''eau de pluie à la base de ses pétioles ?',
    ARRAY['Le flamboyant (Delonix regia)', 'Le palissandre de Madagascar (Dalbergia baroni)', 'Le Katrafay (Cedrelopsis grevei)', 'L''arbre du voyageur (Ravenala madagascariensis)']::TEXT[],
    3,
    'Le Ravinala (Ravenala madagascariensis, famille des Strelitziaceae, où des études génétiques récentes distinguent d''ailleurs plusieurs espèces endémiques au sein du genre Ravenala) est surnommé « arbre du voyageur » car la base engainante de ses feuilles accumule de l''eau permettant aux marcheurs de se désaltérer.

💡 Indice : Symbole national figurant sur de nombreux emblèmes malgaches, ce n''est pas un vrai palmier mais un parent de l''oiseau de paradis.',
    'Toro-lalana: Symbole national figurant sur de nombreux emblèmes malgaches, ce n''est pas un vrai palmier mais un parent de l''oiseau de paradis.',
    'EASY'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Faune et flore endémiques', 'Géographie et trésors naturels', 'SRC-23', 'kanto-geo-lvl-3']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Missouri Botanical Garden / Royal Botanic Gardens, Kew (Moat, J. & Smith, P., 2007) — Atlas de la végétation de Madagascar (Atlas of the Vegetation of Madagascar)',
    'https://www.kew.org',
    'GEOGRAPHY_NATURE',
    'SRC-23',
    3,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q38 : À quel genre scientifique appartiennent les caméléons nains ...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q38',
    'geographie_regions',
    'À quel genre scientifique appartiennent les caméléons nains terrestres de Madagascar, qui comptent parmi les plus petits reptiles vertébrés du monde ?',
    ARRAY['Furcifer', 'Calumma', 'Brookesia', 'Uroplatus']::TEXT[],
    2,
    'Le genre Brookesia regroupe une trentaine d''espèces de caméléons miniatures endémiques de Madagascar vivant dans la litière de feuilles mortes, dont Brookesia micra (sur l''îlot de Nosy Hara) et Brookesia nana (dans le massif du Sorata), qui mesurent moins de 3 centimètres à l''âge adulte.

💡 Indice : Contrairement aux grands caméléons arboricoles colorés, ces minuscules caméléons bruns imitent les feuilles mortes sur le sol forestier.',
    'Toro-lalana: Contrairement aux grands caméléons arboricoles colorés, ces minuscules caméléons bruns imitent les feuilles mortes sur le sol forestier.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Faune et flore endémiques', 'Géographie et trésors naturels', 'SRC-24', 'kanto-geo-lvl-3']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Glaw, F., Köhler, J., Townsend, T. M. & Vences, M. (2012) — Rivaling the World''s Smallest Reptiles: Discovery of Miniaturized Leaf Chameleons (Brookesia) from Northern Madagascar (PLOS ONE)',
    'https://doi.org/10.1371/journal.pone.0031314',
    'GEOGRAPHY_NATURE',
    'SRC-24',
    3,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q45 : Sur quelle façade maritime de Madagascar se concentre la qua...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q45',
    'geographie_regions',
    'Sur quelle façade maritime de Madagascar se concentre la quasi-totalité (environ 98 %) des forêts de mangroves du pays ?',
    ARRAY['Sur la côte occidentale, le long du canal du Mozambique', 'Sur la côte centrale orientale, autour de Vatomandry et Mahanoro', 'Sur les falaises méridionales de l''Androy', 'Autour des lacs de cratère des Hautes Terres centrales']::TEXT[],
    0,
    'Près de 98 % des mangroves malgaches (plus de 300 000 hectares constitués de 8 espèces de palétuviers) bordent la côte ouest et nord-ouest le long du canal du Mozambique (baies d''Ambaro, de Mahajamba, de Bombetoka, deltas de la Tsiribihina et du Mangoky), grâce aux faibles pentes continentales, aux grands estuaires limoneux et au fort marnage des marées.

💡 Indice : Les palétuviers ont besoin de vastes estuaires vaseux abrités de la grande houle océanique et soumis à d''importantes marées.',
    'Toro-lalana: Les palétuviers ont besoin de vastes estuaires vaseux abrités de la grande houle océanique et soumis à d''importantes marées.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Îles, plages, littoraux et trésors naturels', 'Géographie et trésors naturels', 'SRC-25', 'kanto-geo-lvl-3']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Ministère de l''Environnement et du Développement Durable (MEDD) / WWF Madagascar — Atlas des mangroves de Madagascar & Stratégie nationale de gestion durable des mangroves',
    'https://www.environnement.mg',
    'GEOGRAPHY_NATURE',
    'SRC-25',
    3,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q07 : Pourquoi Madagascar est-elle fréquemment surnommée « l'Île R...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q07',
    'geographie_regions',
    'Pourquoi Madagascar est-elle fréquemment surnommée « l''Île Rouge » ?',
    ARRAY['En raison des sols ferrallitiques riches en oxydes de fer et d''aluminium (latérite) qui recouvrent une grande partie de l''île', 'À cause des coulées de lave permanentes des volcans actifs de l''Itasy', 'En référence aux récifs de corail rouge qui entourent la totalité des côtes', 'En raison des forêts d''érables rouges qui dominent les Hautes Terres']::TEXT[],
    0,
    'Le surnom d''« Île Rouge » provient de l''omniprésence des sols latéritiques (sols ferrallitiques) riches en oxydes de fer et d''aluminium sur les Hautes Terres centrales, dont la teinte ocre à rouge vif apparaît à nu sur les collines érodées et colore les fleuves.

💡 Indice : Cette couleur caractéristique provient de la nature géochimique de la terre qui sert aussi à fabriquer les briques traditionnelles des maisons des Hautes Terres.',
    'Toro-lalana: Cette couleur caractéristique provient de la nature géochimique de la terre qui sert aussi à fabriquer les briques traditionnelles des maisons des Hautes Terres.',
    'EASY'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Géographie générale de Madagascar', 'Géographie et trésors naturels', 'SRC-01', 'kanto-geo-lvl-4']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Convention sur la Diversité Biologique (CDB) & Ministère de l''Environnement et du Développement Durable (MEDD) — Cinquième rapport national de la Convention sur la Diversité Biologique – Madagascar',
    'https://www.cbd.int/doc/world/mg/mg-nr-05-fr.pdf',
    'GEOGRAPHY_NATURE',
    'SRC-01',
    4,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q08 : Quel vent dominant, soufflant toute l'année depuis l'océan I...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q08',
    'geographie_regions',
    'Quel vent dominant, soufflant toute l''année depuis l''océan Indien vers le versant oriental de Madagascar, explique la forte humidité et les pluies abondantes de la côte est ?',
    ARRAY['L''harmattan', 'Le mistral', 'Le sirocco', 'L''alizé du sud-est']::TEXT[],
    3,
    'L''alizé du sud-est, issu de l''anticyclone des Mascareignes dans l''océan Indien, se charge d''humidité sur la mer et vient buter contre l''escarpement oriental de Madagascar, provoquant d''abondantes précipitations orographiques tout au long de l''année sur la côte est.

💡 Indice : C''est le vent régulier des régions intertropicales qui souffle depuis les Mascareignes vers l''escarpement oriental malgache.',
    'Toro-lalana: C''est le vent régulier des régions intertropicales qui souffle depuis les Mascareignes vers l''escarpement oriental malgache.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Géographie générale de Madagascar', 'Géographie et trésors naturels', 'SRC-12', 'kanto-geo-lvl-4']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Chaperon, P., Danloux, J. & Ferry, L. (1993) – IRD / ORSTOM & DMH Madagascar — Fleuves et rivières de Madagascar (Monographies hydrologiques ORSTOM n° 10)',
    'https://horizon.documentation.ird.fr/exl-doc/pleins_textes/divers16-06/37357.pdf',
    'GEOGRAPHY_NATURE',
    'SRC-12',
    4,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q09 : Dans quelle région administrative de l'Ouest de Madagascar s...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q09',
    'geographie_regions',
    'Dans quelle région administrative de l''Ouest de Madagascar se situent la ville de Morondava, l''Allée des Baobabs et la forêt sèche de Kirindy ?',
    ARRAY['La région Menabe', 'La région Sofia', 'La région Alaotra-Mangoro', 'La région Atsimo-Atsinanana']::TEXT[],
    0,
    'La région du Menabe, dont le chef-lieu est Morondava sur le canal du Mozambique, abrite le paysage protégé de Menabe Antimena (incluant la forêt de Kirindy et l''Allée des Baobabs) ainsi que le parc national de Kirindy Mitea.

💡 Indice : Ce nom désigne également l''ancien grand royaume Sakalava du centre-ouest malgache.',
    'Toro-lalana: Ce nom désigne également l''ancien grand royaume Sakalava du centre-ouest malgache.',
    'EASY'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Géographie générale de Madagascar', 'Géographie et trésors naturels', 'SRC-11', 'kanto-geo-lvl-4']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'République de Madagascar (Ministère de l''Intérieur et de la Décentralisation) — Loi n° 2014-020, Loi n° 2021-010 et Loi n° 2023-012 relatives aux Collectivités Territoriales Décentralisées (6 provinces et 24 régions)',
    'https://www.mid.gov.mg',
    'GEOGRAPHY_NATURE',
    'SRC-11',
    4,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q16 : Quel grand fleuve de l'ouest de Madagascar creuse des gorges...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q16',
    'geographie_regions',
    'Quel grand fleuve de l''ouest de Madagascar creuse des gorges spectaculaires à l''entrée sud du parc national des Tsingy de Bemaraha, près du village de Bekopaka ?',
    ARRAY['La Sofia', 'Le Manambolo', 'La Namorona', 'Le Fiherenana']::TEXT[],
    1,
    'Le fleuve Manambolo (environ 370 km de long) prend sa source sur les Hautes Terres à l''ouest d''Antananarivo (région Bongolava) et entaille profondément le plateau calcaire du Bemaraha par des gorges bordées de falaises et de grottes sépulcrales Vazimba avant de traverser Bekopaka.

💡 Indice : Les voyageurs traversent ce fleuve en bac pour entrer à Bekopaka et visitent ses célèbres gorges en pirogue au pied des Tsingy.',
    'Toro-lalana: Les voyageurs traversent ce fleuve en bac pour entrer à Bekopaka et visitent ses célèbres gorges en pirogue au pied des Tsingy.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Fleuves, lacs et bassins hydrographiques', 'Géographie et trésors naturels', 'SRC-14', 'kanto-geo-lvl-4']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Madagascar National Parks (MNP) & UNESCO Centre du patrimoine mondial — Parc National et Réserve Naturelle Intégrale du Tsingy de Bemaraha (Bien réf. 494)',
    'https://whc.unesco.org/fr/list/494/',
    'GEOGRAPHY_NATURE',
    'SRC-14',
    4,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q22 : Quel terme géomorphologique malgache, adopté par la littérat...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q22',
    'geographie_regions',
    'Quel terme géomorphologique malgache, adopté par la littérature scientifique internationale, désigne les profonds cirques d''érosion en entonnoir creusés dans les collines latéritiques des Hautes Terres ?',
    ARRAY['Horombe', 'Betsimitatatra', 'Lavaka', 'Vavaranon''i Betsiboka']::TEXT[],
    2,
    'Le terme malgache « lavaka » (« trou » ou « ravin ») est utilisé mondialement en géomorphologie tropicale pour désigner ces vastes excavations d''érosion à parois abruptes et sortie étroite qui entaillent l''épais manteau d''altération ferrallitique (saprolite) des collines malgaches.

💡 Indice : Ce mot malgache courant signifie littéralement « trou » et décrit les grandes cicatrices rouges en forme de goutte d''eau sur les flancs des collines.',
    'Toro-lalana: Ce mot malgache courant signifie littéralement « trou » et décrit les grandes cicatrices rouges en forme de goutte d''eau sur les flancs des collines.',
    'HARD'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Montagnes, reliefs et paysages', 'Géographie et trésors naturels', 'SRC-12', 'kanto-geo-lvl-4']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Chaperon, P., Danloux, J. & Ferry, L. (1993) – IRD / ORSTOM & DMH Madagascar — Fleuves et rivières de Madagascar (Monographies hydrologiques ORSTOM n° 10)',
    'https://horizon.documentation.ird.fr/exl-doc/pleins_textes/divers16-06/37357.pdf',
    'GEOGRAPHY_NATURE',
    'SRC-12',
    4,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q23 : Quel massif isolé du sud-ouest de Madagascar, situé au nord ...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q23',
    'geographie_regions',
    'Quel massif isolé du sud-ouest de Madagascar, situé au nord du fleuve Mangoky, est constitué d''un gigantesque labyrinthe de canyons de grès jaune profondément entaillés par l''érosion ?',
    ARRAY['Le massif du Makay', 'Le massif de l''Ankarana', 'Le massif du Daraina', 'Le massif d''Ambohitantely']::TEXT[],
    0,
    'Situé entre les régions Menabe et Atsimo-Andrefana au nord de Beroroha, le massif du Makay est un spectaculaire relief ruiniforme de grès s''étendant sur environ 4 000 km², découpé en centaines de canyons étroits au fond desquels survivent des forêts-galeries isolées.

💡 Indice : Longtemps resté l''une des régions les plus difficiles d''accès de Madagascar, ce massif gréseux porte un nom de cinq lettres commençant par M.',
    'Toro-lalana: Longtemps resté l''une des régions les plus difficiles d''accès de Madagascar, ce massif gréseux porte un nom de cinq lettres commençant par M.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Montagnes, reliefs et paysages', 'Géographie et trésors naturels', 'SRC-26', 'kanto-geo-lvl-4']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Ministère de l''Environnement et du Développement Durable (MEDD) / Association Naturevolution — Nouvelle Aire Protégée du Massif du Makay',
    'https://www.makaynature.org',
    'GEOGRAPHY_NATURE',
    'SRC-26',
    4,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q31 : En 2023, l'UNESCO a approuvé l'extension du site du Tsingy d...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q31',
    'geographie_regions',
    'En 2023, l''UNESCO a approuvé l''extension du site du Tsingy de Bemaraha à cinq autres aires protégées de l''Ouest et du Sud-Ouest. Quel est le nouveau nom officiel de ce bien du patrimoine mondial ?',
    ARRAY['Les Sanctuaires karstiques du Canal du Mozambique', 'Les Forêts sèches de l''Andrefana', 'La Réserve intégrale du Menabe et du Melaky', 'Le Grand Arc xérophile du Sud malgache']::TEXT[],
    1,
    'Inscrit sous sa forme étendue en septembre 2023 par l''UNESCO, le bien en série « Les forêts sèches de l''Andrefana » regroupe désormais six aires protégées de la façade occidentale (Andrefana signifie l''Ouest en malgache) : Tsingy de Bemaraha, Ankarafantsika, Mikea, Tsimanampesotse, Ankarana et Analamerana.

💡 Indice : Ce nom fait écho aux « Forêts humides de l''Atsinanana » (l''Est), mais utilise le mot malgache qui désigne « l''Ouest ».',
    'Toro-lalana: Ce nom fait écho aux « Forêts humides de l''Atsinanana » (l''Est), mais utilise le mot malgache qui désigne « l''Ouest ».',
    'HARD'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Parcs nationaux et aires protégées', 'Géographie et trésors naturels', 'SRC-27', 'kanto-geo-lvl-4']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'UNESCO Centre du patrimoine mondial — Les forêts sèches de l''Andrefana (Bien réf. 494bis, extension 2023)',
    'https://whc.unesco.org/fr/list/494/',
    'GEOGRAPHY_NATURE',
    'SRC-27',
    4,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q39 : Quelle célèbre plante médicinale endémique de Madagascar (Ca...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q39',
    'geographie_regions',
    'Quelle célèbre plante médicinale endémique de Madagascar (Catharanthus roseus) fournit des alcaloïdes majeurs, la vinblastine et la vincristine, utilisés dans le traitement de certains cancers ?',
    ARRAY['La pervenche de Madagascar', 'L''ylang-ylang', 'Le giroflier', 'Le niaouli']::TEXT[],
    0,
    'La pervenche de Madagascar (Catharanthus roseus, appelée « Vonenina » ou « Tonga » en malgache), originaire du sud et du sud-est de l''île, synthétise des alcaloïdes anticancéreux (vinblastine et vincristine) indispensables en chimiothérapie, notamment contre les leucémies infantiles et la maladie de Hodgkin.

💡 Indice : C''est une petite plante herbacée à fleurs roses ou blanches à cinq pétales, appelée « Vonenina » en malgache.',
    'Toro-lalana: C''est une petite plante herbacée à fleurs roses ou blanches à cinq pétales, appelée « Vonenina » en malgache.',
    'EASY'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Faune et flore endémiques', 'Géographie et trésors naturels', 'SRC-28', 'kanto-geo-lvl-4']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Muséum national d''Histoire naturelle (MNHN) / CNRS — La pervenche de Madagascar (Catharanthus roseus) et la synthèse de la vinblastine et de la vincristine',
    'https://www.mnhn.fr',
    'GEOGRAPHY_NATURE',
    'SRC-28',
    4,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q40 : Quelle famille végétale à port épineux et cactiforme, compre...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q40',
    'geographie_regions',
    'Quelle famille végétale à port épineux et cactiforme, comprenant l''Alluaudia procera (« arbre-pieuvre »), caractérise les fourrés xérophiles du Grand Sud malgache ?',
    ARRAY['Les Fagaceae', 'Les Pinaceae', 'Les Didiereaceae', 'Les Betulaceae']::TEXT[],
    2,
    'La sous-famille des Didiereoideae (famille des Didiereaceae, genres Alluaudia, Didierea, Alluaudiopsis et Decarya) est strictement endémique du sud et du sud-ouest de Madagascar. Ces plantes succulentes épineuses forment le célèbre « bush épineux » de l''Androy et du plateau Mahafaly.

💡 Indice : Cette famille botanique tire son nom du naturaliste Alfred Grandidier (à travers son prénom ou la racine dédiée par Henri Baillon).',
    'Toro-lalana: Cette famille botanique tire son nom du naturaliste Alfred Grandidier (à travers son prénom ou la racine dédiée par Henri Baillon).',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Faune et flore endémiques', 'Géographie et trésors naturels', 'SRC-23', 'kanto-geo-lvl-4']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Missouri Botanical Garden / Royal Botanic Gardens, Kew (Moat, J. & Smith, P., 2007) — Atlas de la végétation de Madagascar (Atlas of the Vegetation of Madagascar)',
    'https://www.kew.org',
    'GEOGRAPHY_NATURE',
    'SRC-23',
    4,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q46 : Au large de quelle grande ville du sud-ouest de Madagascar s...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q46',
    'geographie_regions',
    'Au large de quelle grande ville du sud-ouest de Madagascar s''étend un « Grand Récif » barrière de 18 kilomètres de long, reconnu parmi les systèmes coralliens majeurs de l''océan Indien ?',
    ARRAY['Mahajanga', 'Toamasina', 'Manakara', 'Toliara']::TEXT[],
    3,
    'Le Grand Récif de Toliara (Tuléar), long d''environ 18 km et large de 1 à 3 km face à la ville de Toliara, fait partie d''un complexe récifal de plus de 400 km de long dans le sud-ouest de Madagascar (d''Androka à Morombe), abritant des milliers d''espèces marines.

💡 Indice : C''est la grande cité portuaire et universitaire du Sud-Ouest, chef-lieu de la région Atsimo-Andrefana.',
    'Toro-lalana: C''est la grande cité portuaire et universitaire du Sud-Ouest, chef-lieu de la région Atsimo-Andrefana.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Îles, plages, littoraux et trésors naturels', 'Géographie et trésors naturels', 'SRC-29', 'kanto-geo-lvl-4']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Institut Halieutique et des Sciences Marines (IH.SM) de l''Université de Toliara / UNESCO — Le Grand Récif de Toliara et les écosystèmes coralliens du Sud-Ouest de Madagascar',
    'https://www.ihsm.mg',
    'GEOGRAPHY_NATURE',
    'SRC-29',
    4,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q10 : Quelle nouvelle région (la 24e région de Madagascar) a été i...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q10',
    'geographie_regions',
    'Quelle nouvelle région (la 24e région de Madagascar) a été instituée par la loi n° 2023-012 en regroupant les districts de Maroantsetra et de Mananara-Nord autour de la baie d''Antongil ?',
    ARRAY['La région Fitovinany', 'La région Ambatosoa', 'La région Vatovavy', 'La région Ihorombe']::TEXT[],
    1,
    'La région Ambatosoa, ayant pour chef-lieu Maroantsetra, a été créée en 2023 (loi n° 2023-012) par détachement des districts de Maroantsetra et de Mananara-Nord, qui appartenaient auparavant à la région Analanjirofo.

💡 Indice : Son chef-lieu est la ville de Maroantsetra, porte d''entrée de la baie d''Antongil et du parc national de Masoala.',
    'Toro-lalana: Son chef-lieu est la ville de Maroantsetra, porte d''entrée de la baie d''Antongil et du parc national de Masoala.',
    'HARD'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Géographie générale de Madagascar', 'Géographie et trésors naturels', 'SRC-11', 'kanto-geo-lvl-5']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'République de Madagascar (Ministère de l''Intérieur et de la Décentralisation) — Loi n° 2014-020, Loi n° 2021-010 et Loi n° 2023-012 relatives aux Collectivités Territoriales Décentralisées (6 provinces et 24 régions)',
    'https://www.mid.gov.mg',
    'GEOGRAPHY_NATURE',
    'SRC-11',
    5,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q17 : Quel est le deuxième plus grand lac naturel permanent de Mad...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q17',
    'geographie_regions',
    'Quel est le deuxième plus grand lac naturel permanent de Madagascar, situé dans la région Boeny (sud-ouest de Mitsinjo) et classé site Ramsar pour son avifaune aquatique ?',
    ARRAY['Le lac Kinkony', 'Le lac Mantasoa', 'Le lac Andraikiba', 'Le lac Rasoabe']::TEXT[],
    0,
    'Situé dans la région Boeny à proximité du delta de la Mahavavy du Sud, le lac Kinkony couvre environ 100 à 140 km² selon les saisons. Deuxième grand lac permanent de l''île après le lac Alaotra, il fait partie de l''aire protégée du complexe Mahavavy-Kinkony et constitue un site Ramsar essentiel pour les oiseaux d''eau endémiques.

💡 Indice : Associé au fleuve Mahavavy du Sud dans la région Boeny, son nom commence par la lettre K.',
    'Toro-lalana: Associé au fleuve Mahavavy du Sud dans la région Boeny, son nom commence par la lettre K.',
    'HARD'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Fleuves, lacs et bassins hydrographiques', 'Géographie et trésors naturels', 'SRC-30', 'kanto-geo-lvl-5']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Secrétariat de la Convention de Ramsar — Service d''information sur les Sites Ramsar (SIS) : Zones humides de Mahavavy-Kinkony (Site n° 2064)',
    'https://rsis.ramsar.org/ris/2064',
    'GEOGRAPHY_NATURE',
    'SRC-30',
    5,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q24 : Quel phénomène géologique original distingue les « Tsingy Ro...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q24',
    'geographie_regions',
    'Quel phénomène géologique original distingue les « Tsingy Rouges » d''Irodo, situés au sud-est d''Antsiranana (Diego-Suarez), des Tsingy classiques de Bemaraha ou d''Ankarana ?',
    ARRAY['Ils sont formés de glace fossile colorée par des algues microscopiques', 'Ce sont des formations sédimentaires tendres de grès, de marne et de latérite sculptées par l''érosion hydrique, et non du calcaire dur', 'Ils ont été taillés artificiellement par les mineurs d''or au XIXe siècle', 'Ce sont des cheminées hydrothermales sous-marines émergées récemment']::TEXT[],
    1,
    'Situés dans le bassin sédimentaire d''Irodo (région DIANA), les Tsingy Rouges ne sont pas des karsts calcaires durs mais des cheminées de fées éphémères et fragiles sculptées par le ruissellement des pluies dans des couches tendres de grès, de marnes et d''argiles latéritiques sous un épais manteau sableux.

💡 Indice : Contrairement à la roche grise et tranchante de Bemaraha, ces draperies ocre et vermeil sont constituées de sable gréseux et d''argile très friables.',
    'Toro-lalana: Contrairement à la roche grise et tranchante de Bemaraha, ces draperies ocre et vermeil sont constituées de sable gréseux et d''argile très friables.',
    'EASY'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Montagnes, reliefs et paysages', 'Géographie et trésors naturels', 'SRC-31', 'kanto-geo-lvl-5']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Office Régional du Tourisme de Diego-Suarez (ORTDS) / BRGM — Géologie du bassin sédimentaire du Nord de Madagascar : Les Tsingy Rouges d''Irodo',
    'https://www.office-tourisme-diego-suarez.com',
    'GEOGRAPHY_NATURE',
    'SRC-31',
    5,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q32 : Quel parc national du nord-est de Madagascar est devenue en ...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q32',
    'geographie_regions',
    'Quel parc national du nord-est de Madagascar est devenue en 1990 la toute première Réserve de biosphère de l''île reconnue par le programme MAB de l''UNESCO ?',
    ARRAY['Le parc national d''Isalo', 'Le parc national de Befotaka-Midongy', 'Le parc national de Mananara-Nord', 'Le parc national de Zombitse-Vohibasia']::TEXT[],
    2,
    'Désignée en 1990 par le programme « L''Homme et la Biosphère » (MAB) de l''UNESCO, la réserve de biosphère de Mananara-Nord a été la première de Madagascar. Son cœur est constitué d''un parc national terrestre (forêt humide de basse altitude) et du premier parc national marin malgache (îlots de Nosy Atafana).

💡 Indice : Située au sud de Maroantsetra à l''entrée de la baie d''Antongil, cette aire protégée associe une forêt pluviale et le parc marin de Nosy Atafana.',
    'Toro-lalana: Située au sud de Maroantsetra à l''entrée de la baie d''Antongil, cette aire protégée associe une forêt pluviale et le parc marin de Nosy Atafana.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Parcs nationaux et aires protégées', 'Géographie et trésors naturels', 'SRC-32', 'kanto-geo-lvl-5']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'UNESCO Programme sur l''Homme et la Biosphère (MAB) & MEDD — Réseau mondial des réserves de biosphère à Madagascar : Mananara-Nord (1990)',
    'https://www.unesco.org/fr/mab',
    'GEOGRAPHY_NATURE',
    'SRC-32',
    5,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q41 : Dans quel parc national du nord-ouest de Madagascar (région ...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q41',
    'geographie_regions',
    'Dans quel parc national du nord-ouest de Madagascar (région Boeny) est protégée la seule population mondiale sauvage de la tortue à soc (Astrochelys yniphora), localement appelée « Angonoka » ?',
    ARRAY['Le parc national de la Baie de Baly', 'Le parc national de Ranomafana', 'Le parc national de Marojejy', 'Le parc national de la Montagne d''Ambre']::TEXT[],
    0,
    'Créé en 1997 près de Soalala (région Boeny), le parc national de la Baie de Baly est l''unique habitat naturel au monde de la tortue à soc ou Angonoka (Astrochelys yniphora), l''une des tortues terrestres les plus menacées de la planète (en danger critique d''extinction), qui vit dans les fourrés de bambous et de buissons côtiers.

💡 Indice : Ce parc côtier tire son nom d''une baie du canal du Mozambique située à proximité de la ville de Soalala, à l''ouest de Mahajanga.',
    'Toro-lalana: Ce parc côtier tire son nom d''une baie du canal du Mozambique située à proximité de la ville de Soalala, à l''ouest de Mahajanga.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Faune et flore endémiques', 'Géographie et trésors naturels', 'SRC-33', 'kanto-geo-lvl-5']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Madagascar National Parks (MNP) & Durrell Wildlife Conservation Trust — Parc National de la Baie de Baly et conservation de la tortue Angonoka (Astrochelys yniphora)',
    'https://www.parcs-madagascar.com/aire-protegee/parc-national-baie-de-baly',
    'GEOGRAPHY_NATURE',
    'SRC-33',
    5,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q42 : Quelle particularité évolutive caractérise le poisson endémi...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q42',
    'geographie_regions',
    'Quelle particularité évolutive caractérise le poisson endémique Typhleotris madagascariensis, qui vit dans les eaux souterraines de la grotte de Mitoho (parc national de Tsimanampetsotsa) ?',
    ARRAY['Il est capable de voler hors de l''eau sur plusieurs dizaines de mètres', 'Il produit des décharges électriques de haute tension pour chasser', 'Il est totalement aveugle et dépigmenté en raison de sa vie cavernicole dans l''obscurité absolue', 'Il respire uniquement de l''air sec grâce à des poumons semblables à ceux des reptiles']::TEXT[],
    2,
    'Le poisson aveugle de Madagascar (Typhleotris madagascariensis, famille des Milyeringidae) est une espèce troglobie strictement endémique du réseau karstique souterrain du plateau Mahafaly (notamment l''aven-grotte de Mitoho). Adapté à l''obscurité totale, il est dépourvu d''yeux fonctionnels et de pigmentation cutanée.

💡 Indice : Le circuit touristique qui mène à la grotte de Mitoho s''appelle « Tsiamaso », un mot malgache qui évoque directement l''absence d''yeux.',
    'Toro-lalana: Le circuit touristique qui mène à la grotte de Mitoho s''appelle « Tsiamaso », un mot malgache qui évoque directement l''absence d''yeux.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Faune et flore endémiques', 'Géographie et trésors naturels', 'SRC-20', 'kanto-geo-lvl-5']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Madagascar National Parks (MNP) & Sparks, J. S. / Chakrabarty, P. (American Museum Novitates, 2012) — Parc National de Tsimanampesotse & Revision of the Endemic Malagasy Cavefish Genus Typhleotris',
    'https://digitallibrary.amnh.org/items/c1b8608e-5295-4b11-8f57-f9f419e660c4',
    'GEOGRAPHY_NATURE',
    'SRC-20',
    5,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q47 : Quelle île couverte de forêt dense humide, située au fond de...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q47',
    'geographie_regions',
    'Quelle île couverte de forêt dense humide, située au fond de la baie d''Antongil à 5 km au large de Maroantsetra, est un sanctuaire réputé pour l''aye-aye et la grenouille tomate ?',
    ARRAY['Nosy Iranja', 'Nosy Tanikely', 'Nosy Ve', 'Nosy Mangabe']::TEXT[],
    3,
    'Nosy Mangabe est une île montagneuse de 520 hectares située dans la baie d''Antongil et rattachée au complexe du parc national de Masoala. Entièrement recouverte de forêt tropicale humide, elle a servi de refuge de conservation dès les années 1960 pour l''aye-aye (Daubentonia madagascariensis) et abrite le gecko foliacé d''Henkel ainsi que le microcèbe.

💡 Indice : Située dans la baie d''Antongil face à Maroantsetra, cette île forestière est administrée conjointement avec le parc national de Masoala.',
    'Toro-lalana: Située dans la baie d''Antongil face à Maroantsetra, cette île forestière est administrée conjointement avec le parc national de Masoala.',
    'EASY'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Îles, plages, littoraux et trésors naturels', 'Géographie et trésors naturels', 'SRC-16', 'kanto-geo-lvl-5']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Madagascar National Parks (MNP) — Parc National de Masoala et Réserve Spéciale de Nosy Mangabe',
    'https://www.parcs-madagascar.com/aire-protegee/parc-national-masoala',
    'GEOGRAPHY_NATURE',
    'SRC-16',
    5,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q48 : Quel archipel du nord-ouest de Madagascar, situé au large de...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q48',
    'geographie_regions',
    'Quel archipel du nord-ouest de Madagascar, situé au large de la baie d''Ampasindava dans le canal du Mozambique, est constitué de pitons calcaires émergés (« tsingy marins ») classés en parc national marin ?',
    ARRAY['L''archipel des Barren (Nosy Barren)', 'L''archipel de Nosy Hara', 'L''archipel de Nosy Atafana', 'Les îles Glorieuses']::TEXT[],
    1,
    'Situé au nord-ouest de Madagascar (région DIANA, au large d''Ampasindava), le parc national marin de Nosy Hara regroupe une douzaine d''îlots karstiques aux falaises calcaires ciselées en tsingy qui plongent directement dans les eaux coralliennes. C''est aussi l''habitat exclusif du minuscule caméléon Brookesia micra.

💡 Indice : Situé à l''extrême nord-ouest non loin du cap Sébastien et d''Antsiranana, cet archipel calcaire abrite également le caméléon nain Brookesia micra.',
    'Toro-lalana: Situé à l''extrême nord-ouest non loin du cap Sébastien et d''Antsiranana, cet archipel calcaire abrite également le caméléon nain Brookesia micra.',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Îles, plages, littoraux et trésors naturels', 'Géographie et trésors naturels', 'SRC-34', 'kanto-geo-lvl-5']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Madagascar National Parks (MNP) — Parc National Marin de Nosy Hara',
    'https://www.parcs-madagascar.com/aire-protegee/parc-national-nosy-hara',
    'GEOGRAPHY_NATURE',
    'SRC-34',
    5,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q49 : Quelle vaste baie du nord de Madagascar, bordée par la ville...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q49',
    'geographie_regions',
    'Quelle vaste baie du nord de Madagascar, bordée par la ville d''Antsiranana, est considérée comme l''une des plus grandes rades naturelles du monde et abrite l''îlot conique du « Pain de Sucre » (Nosy Lonjo) ?',
    ARRAY['La baie de Saint-Augustin', 'La baie de Narinda', 'La baie de Diego-Suarez (baie d''Antsiranana)', 'La baie de Sainte- Luce']::TEXT[],
    2,
    'La baie de Diego-Suarez (ou baie d''Antsiranana), composée de quatre lobes principaux (baie du Tonnerre, baie des Cailloux Blancs, cul-de-sac Gallois et baie des Français) et reliée à l''océan Indien par une passe étroite, est l''une des plus vastes rades naturelles du monde. En son sein se dresse Nosy Lonjo (le Pain de Sucre), îlot volcanique sacré.

💡 Indice : Elle porte le nom historique et actuel de la grande métropole portuaire de l''extrême nord de Madagascar.',
    'Toro-lalana: Elle porte le nom historique et actuel de la grande métropole portuaire de l''extrême nord de Madagascar.',
    'EASY'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Îles, plages, littoraux et trésors naturels', 'Géographie et trésors naturels', 'SRC-35', 'kanto-geo-lvl-5']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Ministère du Tourisme de Madagascar / Service Hydrographique — La baie d''Antsiranana (Diego-Suarez) et l''îlot sacré de Nosy Lonjo (Pain de Sucre)',
    'https://madagascar-tourisme.com',
    'GEOGRAPHY_NATURE',
    'SRC-35',
    5,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

  -- kanto-geo-nat-q50 : Quel îlot corallien du sud-ouest de Madagascar, situé en fac...
  INSERT INTO "civic_quiz_questions" (
    "id", "category", "prompt", "choices", "answerIndex",
    "explanation", "explanationMg", "difficulty", "tags", "status",
    "sourceReference", "sourceUrl", "contentSourceType", "contentSourceId",
    "levelNumber", "updatedAt"
  ) VALUES (
    'kanto-geo-nat-q50',
    'geographie_regions',
    'Quel îlot corallien du sud-ouest de Madagascar, situé en face d''Anakao au sein du parc national marin de Nosy Ve-Androka, abrite l''unique colonie nicheuse de phaétons à brins rouges (Phaethon rubricauda) du pays ?',
    ARRAY['Nosy Sakatia', 'Nosy Nato', 'Nosy Ve', 'Nosy Faly']::TEXT[],
    2,
    'Situé à quelques kilomètres au large d''Anakao au sud de Toliara, l''îlot corallien sacré de Nosy Ve fait partie du parc national marin de Nosy Ve-Androka (et de la réserve de biosphère de Tsimanampesotse - Nosy Ve Androka). Grâce à la protection coutumière (fady) des pêcheurs Vezo et au statut de parc national, des centaines de couples de phaétons à brins rouges (pailles-en-queue) y nichent au sol sous les buissons.

💡 Indice : Son nom court de deux lettres figure directement dans l''intitulé officiel du parc national marin « Nosy ... - Androka ».',
    'Toro-lalana: Son nom court de deux lettres figure directement dans l''intitulé officiel du parc national marin « Nosy ... - Androka ».',
    'MEDIUM'::"DifficultyLevel",
    ARRAY['geographie_regions', 'Îles, plages, littoraux et trésors naturels', 'Géographie et trésors naturels', 'SRC-36', 'kanto-geo-lvl-5']::TEXT[],
    'PUBLISHED'::"ContentStatus",
    'Madagascar National Parks (MNP) & UNESCO MAB — Parc National Marin de Nosy Ve-Androka (Réserve de biosphère de Tsimanampesotse - Nosy Ve Androka)',
    'https://www.parcs-madagascar.com/aire-protegee/parc-national-nosy-ve-androka',
    'GEOGRAPHY_NATURE',
    'SRC-36',
    5,
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "category" = EXCLUDED."category",
    "prompt" = EXCLUDED."prompt",
    "choices" = EXCLUDED."choices",
    "answerIndex" = EXCLUDED."answerIndex",
    "explanation" = EXCLUDED."explanation",
    "explanationMg" = EXCLUDED."explanationMg",
    "difficulty" = EXCLUDED."difficulty",
    "tags" = EXCLUDED."tags",
    "status" = EXCLUDED."status",
    "sourceReference" = EXCLUDED."sourceReference",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "contentSourceType" = EXCLUDED."contentSourceType",
    "contentSourceId" = EXCLUDED."contentSourceId",
    "levelNumber" = EXCLUDED."levelNumber",
    "updatedAt" = NOW();

END $$;
