-- Migration : 20261111223000_seed_verified_proverbes_and_tsianjery
-- Insertion idempotente des nouveaux proverbes authentiques (Ohabolana) et comptines (Tsianjery)

-- ============================================================================
-- 1. TSIANJERY / RÉCITATIONS CULTURELLES TRADITIONNELLES
-- ============================================================================

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-1', 'tsianjery-tanindrazana', 'Tsianjery : Tanindrazana', 'Récitation : La Patrie', 'Fampianarana Malagasy', 'Tsianjery fanao an-tsekoly mitaiza amin''ny fitiavan-tanindrazana sy ny fahaizana miteny.', 2,
    ARRAY['I Madagasikara no tanindrazako,', 'Tany manan-karena sy mahafinaritra,', 'Ny lanitra manga mangarangarana,', 'Ny ranomasina mamihina azy.', '', 'Hianatra tsara aho ho reharehany,', 'Hiasa amim-pahamarinana sy fahaizana,', 'Mba ho firenena mandroso sy vanona,', 'Hitondra fahasambarana ho an''ny rehetra.']::TEXT[], ARRAY['Fandaharam-pianarana Malagasy nentim-paharazana']::TEXT[], ARRAY['Fianarana', 'Tanindrazana', 'Sekoly']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-2', 'fahaizana-mandaha-teny-ny-fanajana', 'Fahaizana mandaha-teny : Ny fanajana', 'Éloquence : Le respect mutuel', 'Lovantsofina', 'Fampianarana ny fomba fitenenana mirindra sy mendrika eo anivon''ny fiarahamonina.', 3,
    ARRAY['Ny teny malefaka manam-panahy,', 'Mampitony ny fo tezitra sy maratra ;', 'Ny fanajana ny zokiolona sy ny manodidina,', 'No fototry ny fiadanana sy ny fihavanana.', '', 'Aza manao teny mandratra,', 'Fa ny teny toy ny atody :', 'Raha latsaka ka vaky,', 'Tsy azo tononina intsony.']::TEXT[], ARRAY['Ohabolana sy soatoavina Malagasy']::TEXT[], ARRAY['Fanajana', 'Fahendrena', 'Fitenenana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-3', 'mandihiza-rahitsikitsika', 'Mandihiza Rahitsikitsika', 'Danse, ô crécerelle (Comptine à gestes)', 'Lovantsofina (Lalaon-jaza nentim-paharazana)', 'Comptine à gestes et danse enfantine traditionnelle très populaire à Madagascar. Les enfants imitent le vol stationnaire et le battement rapide des ailes du faucon crécerelle (hitsikitsika) tout en rythmant des pieds et des mains.', 2,
    ARRAY['Mandihiza Rahitsikitsika,', 'Fa ny vadinao no maty ;', 'Maty tany an-dRovan-tompo,', 'Voatifitry ny varatra.', '', 'Mitsangàna ianao ka mandihiza,', 'Asehoy ny dihy malagasy ;', 'Ahintsano ny tananao,', 'Ary ny tongotrao asio gadona !', '', 'Mandihiza eny Mahamasina,', 'Hifalian''ny Manjakamiadana !']::TEXT[], ARRAY['Fandaharam-pianarana Malagasy nentim-paharazana', 'Mbolatiana / ARB Music - Rondes, comptines et berceuses de Madagascar']::TEXT[], ARRAY['Tsianjery', 'Comptine', 'Dihy', 'Zaza', 'Vorona']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-4', 'iny-hono-izy-ravorombazaha', 'Iny hono izy Ravorombazaha', 'L''oiseau blanc venu d''ailleurs (Berceuse traditionnelle)', 'Lovantsofina (Kalo sy fampatorian-jaza)', 'La berceuse traditionnelle malgache la plus célèbre, chantée depuis des générations pour apaiser et endormir les nourrissons en invoquant l''oiseau migrateur blanc.', 2,
    ARRAY['Iny hono izy ravorom-bazaha,', 'Ento manaraka anao any an-tsaha ;', 'Ento misidina ambony dia ambony,', 'Raha mitomany izy dia ento,', 'Fa raha mangina dia avereno.', '', 'Torimaso mamy, torimaso mandry,', 'Aza manahy fa eo i Neny miandry.']::TEXT[], ARRAY['Lovantsofina nentin-drazana Malagasy', 'Jean Paulhan - Les hain-teny merinas', 'Collection ARB Music']::TEXT[], ARRAY['Tsianjery', 'Berceuse', 'Fampatoriana', 'Vorona', 'Ankizy']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-5', 'isa-amontana-fanisanny-ntaolo', 'Isa amontana (Fanisan''ny Ntaolo)', 'Comptine de comptage des Anciens (1 à 10)', 'Ntaolo Malagasy', 'Comptine mnémotechnique ancestrale permettant aux enfants d''apprendre à compter de un à dix tout en découvrant les arbres, plantes sacrées et objets du quotidien malgache.', 2,
    ARRAY['Isa ny amontana,', 'Roa aviavy,', 'Telo fangady,', 'Efa-drofia,', 'Dimy emboka,', 'Eni-mangamanga,', 'Fito paraky,', 'Valo tanantanana,', 'Sivy rongony,', 'Folo famolesana !']::TEXT[], ARRAY['W. Cousins - Ny Ohabolan''ny Ntaolo (1885)', 'Fampianarana teny Malagasy fototra']::TEXT[], ARRAY['Tsianjery', 'Fanisana', 'Hazo', 'Fianarana', 'Tontolo iainana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-6', 'nankaiza-i-margerity-', 'Nankaiza i Margerity ?', 'Où est Marguerite ? (Jeu de ronde)', 'Lalaon''ankizy nentim-paharazana', 'Jeu de ronde et de dialogue très populaire dans les cours d''école malgaches, où les enfants forment un cercle et dialoguent en rythme avant la phase de poursuite.', 3,
    ARRAY['– Nankaiza i Margerity ? (Ok, o ry sakaiza !)', '– Ao anatin''ilay tranokely. (Ok, ok, ok !)', '– Izaho izao mba te hitaiza. (Ok, ok, ok !)', '– Avo loatra ny tamboho. (Ok, ok, ok !)', '– Angalanay vato iray, roa, telo, efatra !', '– Vato efatra ve dia mba ho aiza ?', '', '– Inona ny ao anatin''ity ?', '– Atody !', '– Inona ny ao anatin''ny atody ?', '– Tapotsiny !', '– Inona ny ao anatin''ny tapotsiny ?', '– Tamenany !', '– Inona ny ao anatin''ny tamenany ?', '– Kofehy sy fanjaitra !']::TEXT[], ARRAY['Lalaon''ankizy Malagasy', 'Mbolatiana - Rondes et comptines de Madagascar (ARB Music)']::TEXT[], ARRAY['Tsianjery', 'Lalao', 'Boribory', 'Ankizy', 'Fifamaliana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-7', 'arendrina-taratasy-fetim-pirenena', 'Arendrina taratasy (Fetim-pirenena)', 'Le lampion de papier (Fête nationale)', 'Lovantsofina an-tsekoly', 'Comptine festive traditionnelle entonnée à la veille de la fête nationale (26 juin) par les enfants défilant à la tombée de la nuit avec leurs lampions illuminés.', 2,
    ARRAY['Arendrina o, arendrina o !', 'Arendrina taratasy,', 'May may may !', 'Izay tsy faly dia miady aminay !', '', 'Hazavao ny lalana ry afo kely,', 'Hitondra fifaliana ho an''ny zaza madinika,', 'Mihira sy mandihy am-pifaliana,', 'Mirary soa ho an''i Madagasikara !']::TEXT[], ARRAY['Fomba sy fanao Malagasy', 'Fankalazana ny 26 Jiona nentim-paharazana']::TEXT[], ARRAY['Tsianjery', 'Arendrina', 'Fety', 'Tanindrazana', 'Ankizy']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-8', 'iza-iry-ambony-iry-', 'Iza iry ambony iry ?', 'Qui est là-haut sur la branche ?', 'Lalaon-jaza nentim-paharazana', 'Jeu de devinette et formulette dialoguée mimée, où un enfant debout répond aux questions des autres sur un ton espiègle.', 2,
    ARRAY['– Iza iry ambony iry ô ?', '– Izaho ihany ity ô !', '– Maninona eny in-dry ô ?', '– Izaho mikotroka atody ô !', '', '– Firy ny atodin-dry ô ?', '– Telo sy efatra ihany ô !', '– Mba omeo iray aho hoe...', '– Raha mba mikotroka in-dry ?', '– Mikotroka ihany aho, fa tsy mahavanona !']::TEXT[], ARRAY['Comptines populaires des Hauts-Plateaux', 'ARB Music - Madagascar Jeunesse']::TEXT[], ARRAY['Tsianjery', 'Comptine', 'Fifamaliana', 'Atody', 'Vorona']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-9', 'zaza-madio-fahadiovanny-vatana', 'Zaza madio (Fahadiovan''ny vatana)', 'L''enfant propre (Récitation éducative)', 'Fampianarana Malagasy', 'Comptine éducative d''éveil corporel et d''hygiène quotidienne, mimant la toilette matinale des tout-petits.', 2,
    ARRAY['Zaza manasa tanana, manasa tanana,', 'Madio ny tananay !', 'Zaza manasa tongotra, manasa tongotra,', 'Madio ny tongotray !', '', 'Zaza manasa tarehy sy sofina,', 'Mangarangarana ny tavaray !', 'Miborosy nify maraina sy hariva,', 'Mba ho zaza salama sy hendry lalandava !']::TEXT[], ARRAY['Taranja Fanabeazana Fototra Malagasy', 'Sekoly Fanabeazana fototra']::TEXT[], ARRAY['Tsianjery', 'Fahadiovana', 'Sekoly', 'Fanabeazana', 'Vatana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-10', 'ilay-bitro-kely-feno-volo', 'Ilay bitro kely feno volo', 'Le petit lapin aux grandes oreilles', 'Lovantsofina an-tsekoly', 'Comptine à gestes où les enfants miment les longues oreilles du lapin et ses bonds vifs dans la prairie.', 2,
    ARRAY['Bitro kely feno volo,', 'Be dia be, be dia be !', 'Ao ambony, ao ambany,', 'Eo aloha, ao aoriana.', '', 'Mitsambikimbikina eny an-tsaha,', 'Mihinam-bilona maitso mavana ;', 'Raha mandre feo kely izy,', 'Dia lasa mitsambikina any an-davaka !']::TEXT[], ARRAY['Fampianarana amin''ny garabola Malagasy']::TEXT[], ARRAY['Tsianjery', 'Biby', 'Fihetsika', 'Zaza madinika']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-11', 'mamaivay-ny-tongotro', 'Mamaivay ny tongotro', 'Mes petits pieds sont fatigués', 'Lalaon-jaza nentim-paharazana', 'Formulette chantée à la fin des courses et rondes d''enfants lorsque la fatigue se fait sentir, invitant au repos collectif.', 2,
    ARRAY['Mamaivay ny tongotray,', 'Mamaivay ny tongotro ;', 'Nihazakazaka tontolo andro,', 'Nilalao teny an-tokontany.', '', 'Raha marary asiana fanafody,', 'Ipetraho eo amin''ny tsihy malefaka,', 'Aoka izay ny fihazakazahana,', 'Fa efa mody ny masoandro !']::TEXT[], ARRAY['Lalaon''ny ankizy eny ambanivohitra', 'ARB Music']::TEXT[], ARRAY['Tsianjery', 'Lalao', 'Fihetsika', 'Tongotra', 'Fampiononana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-12', 'indreto-voronkely-ao-an-tsaha', 'Indreto voronkely ao an-tsaha', 'Les petits oiseaux de la plaine', 'Lovantsofina nentim-paharazana', 'Poésie enfantine rythmée célébrant les oiseaux qui s''envolent et jouent ensemble dans les rizières au lever du jour.', 2,
    ARRAY['Indreto voronkely,', 'Mifankahita ao an-tsaha ;', 'Somary mitosy kely,', 'Mifampitsiky, mifampiza.', '', 'Manao fangalampiery,', 'Mifaninana mifampijery ;', 'Aiza ny elatrao ry namako,', 'Mba hisidinantsika mankany an-danitra ?']::TEXT[], ARRAY['Tononkalo nentim-paharazana ho an''ny ankizy']::TEXT[], ARRAY['Tsianjery', 'Vorona', 'Zavaboary', 'Hira', 'Tsiky']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-13', 'ny-andro-fito-aminny-herinandro', 'Ny andro fito amin''ny herinandro', 'Les sept jours de la semaine', 'Fampianarana Malagasy', 'Récitation mnémotechnique permettant aux élèves d''assimiler l''ordre et le rythme des sept jours de la semaine en malgache.', 2,
    ARRAY['Alatsinainy fanombohan''ny asa,', 'Talata fiezahana lalandava,', 'Alarobia antenatenan''ny herinandro,', 'Alakamisy fanohizana ny ezaka.', '', 'Zoma mahafinaritra mialoha ny faran''ny herinandro,', 'Asabotsy fiantsenana sy fitsangatsanganana,', 'Alahady fitsaharana sy firaisankina,', 'Izany no andro fito mandrafitra ny herinandrontsika !']::TEXT[], ARRAY['Fandaharam-pianarana Fanabeazana fototra Malagasy']::TEXT[], ARRAY['Tsianjery', 'Herinandro', 'Andro', 'Fianarana', 'Fotoana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-14', 'mahaiza-misaotra-', 'Mahaiza misaotra !', 'Sache dire merci ! (L''apprentissage du respect)', 'Lovantsofina sy Fahendrena', 'Tsianjery classique inculquant aux enfants les règles sacrées de la gratitude et du respect envers les aînés et la communauté.', 2,
    ARRAY['Raha misy manome anao zavatra,', 'Aza adinoina ny misaotra ;', 'Misaotra tompoko amin''ny fo madio,', 'No mariky ny zaza voataiza tsara.', '', 'Ny fisaorana tsy mampahantra,', 'Fa manokatra ny varavaran''ny fitahiana ;', 'Ny zaza mahay manaja sy misaotra,', 'Lalan-kizorany dia hasoavina !']::TEXT[], ARRAY['Soatoavina Malagasy', 'Fahendren''ny Ntaolo']::TEXT[], ARRAY['Tsianjery', 'Fanajana', 'Fisaorana', 'Fahendrena', 'Fitaizana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-15', 'farimbona-fisarihana-lalao', 'Farimbona (Fisarihana lalao)', 'Farimbona (Formulette de tirage au sort)', 'Lalaon''ankizy nentim-paharazana', 'Formulette d''élimination rythmée scandée par les enfants pour désigner impartialement qui tiendra le rôle du chasseur ou du loup.', 1,
    ARRAY['Farimbona e, sari-tany !', 'Iza no hivoaka voalohany ?', 'Tsilopilopy ny kintana eny an-danitra,', 'Manondro ny iray amin''ireo milalao.', '', 'Tonga teo aminao ny anjara,', 'Mivoaha ianao ka aza mitaraiky !']::TEXT[], ARRAY['Lalaon-tokontany nentim-paharazana']::TEXT[], ARRAY['Tsianjery', 'Lalao', 'Fisarihana', 'Ankizy', 'Tokontany']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-16', 'tongo-bakana-kilalao-an-tsihy', 'Tongo-bakana (Kilalao an-tsihy)', 'Tongo-bakana (Comptine des pieds alignés)', 'Lalaon''ankizy an-trano', 'Jeu traditionnel pratiqué sur la natte où les enfants étendent leurs jambes et replient une à une celle désignée par la comptine.', 2,
    ARRAY['Tongo-bakana, tongo-bakana,', 'Iray, roa, telo, efatra ;', 'Tano mafy ny lohalikao,', 'Sao lasan''ny amboa ny kiraronao !', '', 'Aforeto ny tongotra iray,', 'Mijanona ny iray hafa ;', 'Izay mahatonga hatramin''ny farany,', 'No mpandresy am-pilaminana !']::TEXT[], ARRAY['Lalaon-jaza an-tsihy Malagasy']::TEXT[], ARRAY['Tsianjery', 'Kilalao', 'Tongotra', 'Tsihy', 'Fianakaviana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-17', 'sari-tany-sy-tsatobato', 'Sari-tany sy Tsatobato', 'La marelle et le jet de pierre', 'Lalaon-tokontany Malagasy', 'Chant rythmé accompagnant le jeu traditionnel de marelle tracée sur la terre battue et l''adresse du lancer de pierre.', 2,
    ARRAY['Sariho ny tany amim-pahitsiana,', 'Asio efitra enina mifandimby ;', 'Atsipazo ny vato boribory,', 'Mba tsy hidona amin''ny tsipika.', '', 'Mitsambikina amin''ny tongotra tokana,', 'Mihazona ny fifandanjana tsara ;', 'Lalao madio, lalao mirindra,', 'Mampatanjaka ny vatantsika !']::TEXT[], ARRAY['Lalaon''ny ankizy tamin''ny Ntaolo']::TEXT[], ARRAY['Tsianjery', 'Lalao', 'Tsatobato', 'Sari-tany', 'Hakingana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-18', 'o-ry-rano-mangitsy-', 'O ry rano mangitsy !', 'Ô eau fraîche de la source (Chant Sakalava / Bara)', 'Lovantsofina Tatsimo sy Andrefana', 'Comptine chantée au bord des rivières et sources d''eau de l''Ouest et du Sud malgache par les enfants venant puiser de l''eau.', 2,
    ARRAY['O ry rano, rano mangitsy e !', 'Avy any an-tendrombohitra mikoriana ;', 'Manome aina ny tany karankaina,', 'Mampitony ny hetahetan''ny mpandalo.', '', 'Madio mangarangarana toy ny fitaratra,', 'Hanosoranay ny tavaranay vao maraina ;', 'Isaorana ny Razana nanome ny loharano,', 'Tsy ritra mandrakizay !']::TEXT[], ARRAY['Haisoratra am-bava any amin''ny faritra Andrefana sy Atsimo']::TEXT[], ARRAY['Tsianjery', 'Rano', 'Zavaboary', 'Sakalava', 'Tsimo']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-19', 'akoho-kely-vao-maraina', 'Akoho kely vao maraina', 'Le petit poussin au point du jour', 'Lovantsofina tontolo ambanivohitra', 'Comptine matinale décrivant le réveil de la cour de ferme avec le cri du coq et la quête de grains des poussins.', 2,
    ARRAY['Kokoriko ! hoy ny akoholahy,', 'Mifohaza ianareo fa maraina ny andro !', 'Mivoaka ny akoho kely mibitaka,', 'Mitady kankana sy vary amin''ny tany.', '', 'Tsy misy kamo eo an-tokontany,', 'Samy miasa sy mikaroka ny anjarany ;', 'Ny zaza hendry mifoha maraina,', 'Miborosy nify sy miomana hianatra !']::TEXT[], ARRAY['Fampianarana an-kira ho an''ny zaza madinika']::TEXT[], ARRAY['Tsianjery', 'Akoho', 'Maraina', 'Ambanivohitra', 'Biby']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-20', 'bombo-sigarety-tsingerinny-vatomamy', 'Bômbô sigarety (Tsingerin''ny vatomamy)', 'Bonbons cigarettes (Comptine des récréations)', 'Lalaon''ankizy an-tsekoly', 'Comptine malicieuse et rythmée des cours de récréation, évoquant les petites friandises traditionnelles partagées entre camarades.', 2,
    ARRAY['Bômbô sigarety mamy ery,', 'Zaitra kely amidy eny an-dalana ;', 'Mifampizara amin''ny mpinamana,', 'Mba ho mamy ny fiarahana.', '', 'Iray ho anao, iray ho ahy,', 'Tsy misy manao fitia kely ;', 'Rehefa tapitra ny fakan-drivotra,', 'Dia miverina mamonjy kilasy am-pifaliana !']::TEXT[], ARRAY['Mbolatiana - Rondes et comptines de Madagascar', 'Fahatsiarovana ny kilalaon''ny ankizy']::TEXT[], ARRAY['Tsianjery', 'Lalao', 'Sekoly', 'Vatomamy', 'Fiarahana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-21', 'tsipatsipa-drano-eny-an-driaka', 'Tsipatsipa-drano eny an-driaka', 'Bataille d''eau dans la rivière', 'Lalaon-jaza eny ambanivohitra', 'Chant joyeux entonné lors des baignades collectives dans les rivières et canaux d''irrigation à la saison chaude.', 2,
    ARRAY['Tsipatsipa-drano mangatsika,', 'Mifampitsipitsipy rano madio ;', 'Mihomehy sy miriaria,', 'Tsy matahotra lena izahay !', '', 'Ny rano mikoriana mitondra hafaliana,', 'Manasa ny havizanana rehetra ;', 'Rehefa milentika ny masoandro,', 'Dia miala amin''ny rano ka mody an-trano !']::TEXT[], ARRAY['Fomban-drazana sy lalaon-jaza an-drano']::TEXT[], ARRAY['Tsianjery', 'Rano', 'Lalao', 'Mifaly', 'Fianakaviana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "recitations" (
    "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
    "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
    "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
) VALUES (
    'recitation-22', 'lalana-mankaiza-ry-zandry-', 'Lalana mankaiza ry zandry ?', 'Où mène ce sentier, cher cadet ?', 'Lovantsofina Fahendrena sy Zokiolona', 'Dialogue rimé traditionnel entre un aîné et un cadet marchant sur les chemins de crête, métaphore du chemin de la vie et du discernement.', 2,
    ARRAY['– Lalana mankaiza ity lalan-kely ity ?', '– Mankany an-tanàna misy ny fihavanana !', '– Inona no entinao hamonjena azy ?', '– Fo madio sy fitiavana marina !', '', '– Raha sendra vatovato sy sakana eny an-dalana ?', '– Hifanampy sy hifandray tanana izahay !', '– Mandehana amim-piadanana ry zandry,', 'Fa ny lalan''ny marina tsy mba mahavery !']::TEXT[], ARRAY['Hain-teny sy fahendrena fitaizana ny zaza Malagasy']::TEXT[], ARRAY['Tsianjery', 'Lalana', 'Fanabeazana', 'Fihavanana', 'Zoky sy Zandry']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
    0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "titleFr" = EXCLUDED."titleFr",
    "author" = EXCLUDED."author",
    "description" = EXCLUDED."description",
    "durationMinutes" = EXCLUDED."durationMinutes",
    "contentLines" = EXCLUDED."contentLines",
    "references" = EXCLUDED."references",
    "tags" = EXCLUDED."tags",
    "updatedAt" = CURRENT_TIMESTAMP;

-- ============================================================================
-- 2. OHABOLANA / PROVERBES MALGACHES ENRICHIS (88 NOUVEAUX PROVERBES)
-- ============================================================================

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-200', 'ny-fihavanana-toy-ny-landy-maty-ifonosana-velon', 'Ny fihavanana toy ny landy : maty ifonosana, velona itafiana, ary ny madilana harahim-panondro', 'La fraternité est comme la soie : à la mort on s''en enveloppe, durant la vie on s''en vêt, et là où le fil s''amincit on le soutient du doigt', 'Le lien de parenté accompagne l''être humain du berceau jusqu''au tombeau ; lorsqu''une discorde menace de le fragiliser, chacun doit y apporter un soin attentif et délicat pour le réparer.', 'Cité lors des réconciliations familiales ou des discours de mariage pour sceller l''union et la patience mutuelle.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Merina', 'Betsileo']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Hauts-Plateaux', 'Ny fihavanana toy ny landy : raha madilana tohizana', 'proverbID-200', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-200' AND "dialectName" = 'Hauts-Plateaux'
);

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-201', 'tondro-tokana-tsy-mahazo-hao', 'Tondro tokana tsy mahazo hao', 'Un seul doigt ne peut attraper un pou', 'Une personne isolée ne peut venir à bout d''une tâche complexe ou d''un ennemi rusé ; seule la conjugaison des efforts permet le succès.', 'Formule populaire invoquée pour mobiliser les villageois lors des travaux d''intérêt commun (valin-tanana).',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsileo', 'Merina', 'Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Betsimisaraka', 'Tondro raiky tsy mahazo hao', 'proverbID-201', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-201' AND "dialectName" = 'Betsimisaraka'
);
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Antandroy', 'Tondro raike tsy mahazo hao', 'proverbID-201', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-201' AND "dialectName" = 'Antandroy'
);

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-202', 'ny-hevitry-ny-maro-mahataka-davitra', 'Ny hevitry ny maro mahataka-davitra', 'La réflexion commune porte loin', 'Le dialogue et la délibération collective permettent de trouver des solutions plus justes, plus durables et plus perspicaces que la seule intuition individuelle.', 'Rappelé au début d''un fokonolona ou d''une assemblée délibérative pour solliciter l''avis des aînés et des jeunes.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Merina', 'Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-203', 'ady-lova-ady-fananana-fa-tsarovy-ny-fihavanana', 'Ady lova, ady fananana ; fa tsarovy ny fihavanana', 'Disputes d''héritage, querelles de biens ; mais n''oubliez jamais les liens du sang', 'Même au cœur des différends matériels les plus épineux, il ne faut jamais porter atteinte définitive à la fraternité qui lie les héritiers.', 'Conseil paternel prodigué aux enfants lors de la transmission des terres et des rizières.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général', 'Merina']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-204', 'raha-rano-no-taitra-mamaky-fefiloha-fa-raha-fo', 'Raha rano no taitra, mamaky fefiloha ; fa raha fo no taitra, maharava fihavanana', 'Quand l''eau s''agite, elle brise les digues ; mais quand le cœur s''emporte, il détruit la parenté', 'La colère non maîtrisée a des conséquences dévastatrices sur les liens sociaux, bien plus graves qu''une inondation matérielle réparable.', 'Admonestation prononcée par les sages pour calmer deux interlocuteurs emportés par la dispute.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Merina', 'Betsileo']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-205', 'izay-iray-vatsy-iray-aina', 'Izay iray vatsy, iray aina', 'Ceux qui partagent les mêmes provisions partagent le même souffle de vie', 'Partager sa nourriture et ses ressources crée un pacte sacré de solidarité et d''assistance mutuelle indéfectible.', 'Prononcé lors des voyages en groupe, des expéditions ou des repas communautaires.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-206', 'ny-fihavanana-toy-ny-vomanga-mitsimoka-ao-an-tan', 'Ny fihavanana toy ny vomanga : mitsimoka ao an-tany ka tsy hita ny lohany sy ny vodiny', 'La parenté est comme la patate douce : elle ramifie sous terre sans qu''on en distingue le commencement de la fin', 'Les ramifications généalogiques et les alliances traditionnelles relient tous les membres de la communauté de façon profonde et inextricable.', 'Utilisé lors de la découverte de liens familiaux éloignés entre personnes qui se croyaient étrangères.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsileo', 'Merina']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-207', 'aza-manao-fihavanamborona-maneno-raha-mahita-vok', 'Aza manao fihavanamborona : maneno raha mahita vokatra, fa mangina raha sendra ny manify', 'N''ayez pas une amitié d''oiseau : gazouillant devant les fruits mûrs, silencieux quand survient la disette', 'Il faut dénoncer les amis hypocrites qui ne se manifestent que dans l''abondance et disparaissent dès que surviennent les temps difficiles.', 'Mise en garde contre les flagorneurs et les compagnons d''intérêt.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Merina']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-208', 'hazo-tokana-maniry-an-tany-tsara-na-tsy-ala-aza', 'Hazo tokana maniry an-tany tsara : na tsy ala aza, mahatahotra', 'Un arbre solitaire poussant sur un sol fertile : même s''il n''est pas forêt, il impose le respect', 'Une personne juste, bien instruite et solide dans ses principes possède une autorité morale remarquable, même lorsqu''elle agit seule.', 'Éloge adressé à un individu intègre qui défend la justice malgré l''adversité.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Hauts-Plateaux']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-209', 'ny-teny-toy-ny-atody-raha-latsaka-ka-vaky-tsy-a', 'Ny teny toy ny atody : raha latsaka ka vaky, tsy azo tononina intsony', 'La parole est comme un œuf : tombé et brisé, on ne peut plus le reconstituer', 'Une parole blessante ou mensongère échappée de la bouche provoque des torts irréparables. La prudence verbale s''impose en toute circonstance.', 'Conseil récurrent dans les kabary traditionnels pour inviter les orateurs à peser chaque terme.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Merina', 'Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Sakalava', 'Ny vola misy latsaka azo alaina, fa ny vava mivoaka tsy azo ampidirina', 'proverbID-209', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-209' AND "dialectName" = 'Sakalava'
);

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-210', 'ny-fanahy-no-olona', 'Ny fanahy no olona', 'C''est l''âme et la conscience morale qui font l''être humain', 'La valeur d''un être ne réside ni dans son apparence physique, ni dans ses richesses matérielles, mais dans sa droiture morale, sa bienveillance et son esprit.', 'Proverbe fondamental et maxime morale suprême de la philosophie malgache.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Betsimisaraka', 'Ny fanahy no oloña', 'proverbID-210', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-210' AND "dialectName" = 'Betsimisaraka'
);
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Antandroy', 'Ny fagnahy ro olo', 'proverbID-210', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-210' AND "dialectName" = 'Antandroy'
);

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-211', 'ny-marina-mitombina-toy-ny-vatolampy', 'Ny marina mitombina toy ny vatolampy', 'La vérité demeure inébranlable comme le rocher', 'Le mensonge et les rumeurs finissent par s''effondrer d''eux-mêmes avec le temps, tandis que la vérité reste debout et immuable face aux tempêtes.', 'Cité lors des jugements coutumiers pour rassurer la partie sincère face aux calomnies.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Merina', 'Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-212', 'aza-manao-vava-manidina-ka-ny-tongotra-no-mikarap', 'Aza manao vava manidina, ka ny tongotra no mikarapoka', 'Ne parlez pas comme si vous voliez haut, pour trébucher ensuite des pieds', 'Il faut éviter la jactance, les vantardises et les promesses démesurées qu''on est incapable d''assumer dans les actes concrets.', 'Critique constructive à l''égard de ceux qui se vantent avant même d''avoir agi.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Hauts-Plateaux']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-213', 'ny-teny-malefaka-manamora-ny-mafy-ary-ny-teny-mas', 'Ny teny malefaka manamora ny mafy, ary ny teny masiaka manasarotra ny tsotra', 'La parole douce adoucit ce qui est dur, tandis que le mot acerbe complique ce qui était simple', 'La diplomatie, la courtoisie et la modération permettent de dénouer les conflits les plus complexes, alors que l''agressivité envenime les moindres malentendus.', 'Maxime diplomatique utilisée par les médiateurs (mpanelana) dans les pourparlers communautaires.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-214', 'aza-mandrora-mitsilany-sao-mahavoa-tena', 'Aza mandrora mitsilany, sao mahavoa tena', 'Ne crachez pas en l''air couché sur le dos, de peur que cela ne vous retombe au visage', 'Toute action malveillante, médisance ou complot ourdi contre autrui finit inévitablement par se retourner contre son auteur.', 'Avertissement solennel contre la trahison et les coups bas dans la vie sociale.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-215', 'ny-lalan-kely-tsy-azo-anariana-vato-sao-lalovann', 'Ny lalan-kely tsy azo anariana vato, sao lalovan''ny tena maraina', 'Ne jetez pas de pierres sur le sentier, car vous pourriez l''emprunter vous-même au matin', 'Il ne faut jamais saboter l''avenir ou nuire à ceux dont on pourrait avoir besoin demain ; la vie est un cycle imprévisible.', 'Rappel à la prudence lorsqu''on quitte un emploi, un village ou des partenaires.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsileo', 'Merina']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-216', 'izay-hendry-mianatra-aminny-hadisoanny-hafa-ny', 'Izay hendry mianatra amin''ny hadisoan''ny hafa, ny adala kosa miandry ny fahavoazany', 'Le sage s''instruit des erreurs d''autrui, tandis que l''insensé attend son propre malheur pour comprendre', 'L''intelligence consiste à observer l''expérience des devanciers pour s''épargner des souffrances inutiles.', 'Leçon d''éducation donnée aux adolescents pour les prémunir contre les pièges de l''imprudence.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-217', 'ny-fahanginana-no-fiarovanny-hendry-ary-ny-resak', 'Ny fahanginana no fiarovan''ny hendry, ary ny resaka maro no fandriky ny adala', 'Le silence est le rempart du sage, et le bavardage inconsidéré le piège de l''insensé', 'Savoir écouter et retenir sa langue permet d''analyser la situation avec clarté et d''éviter les pièges de la précipitation verbale.', 'Éloge du calme et de la retenue au cours d''une négociation tendue.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Merina', 'Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-218', 'aza-manao-fitia-kibon-kisoa-be-fisehona-fa-kely', 'Aza manao fitia kibon-kisoa : be fisehona fa kely hena', 'Ne témoignez pas une amitié semblable à la panse de porc : volumineuse à la vue mais pauvre en viande', 'Il convient de fuir les déclarations grandiloquentes et superficielles d''affection qui ne s''accompagnent d''aucun secours concret.', 'Critique des faux soutiens qui prodiguent de belles paroles sans jamais poser d''acte utile.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Merina']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-219', 'ny-asa-vita-no-ifampitsarana', 'Ny asa vita no ifampitsarana', 'C''est à l''œuvre accomplie que l''on se juge mutuellement', 'Les intentions et les discours ne valent rien devant le résultat concret de l''effort ; seules les réalisations effectives témoignent du mérite.', 'Utilisé lors de la clôture des moissons ou de l''évaluation d''un projet communautaire.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Betsimisaraka', 'Ny asa vita no ifanjavaña', 'proverbID-219', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-219' AND "dialectName" = 'Betsimisaraka'
);

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-220', 'izay-maharitra-vadinantitra', 'Izay maharitra vadin''antitra', 'Celui qui persévère parvient à la vieillesse avec sérénité', 'La patience, l''endurance et la régularité dans l''effort permettent de surmonter les épreuves de l''existence et d''atteindre une plénitude respectée.', 'Encouragement adressé à un travailleur, un étudiant ou un artisan confronté à des débuts laborieux.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-221', 'ny-kamo-ihany-no-matin-ketaheta-eo-amoron-drano', 'Ny kamo ihany no matin-ketaheta eo amoron-drano', 'Seul le paresseux meurt de soif au bord de la source', 'Posséder des opportunités ou vivre entouré de richesses ne sert à rien si l''on ne consent pas à l''effort élémentaire de tendre la main pour les cueillir.', 'Reproche adressé à ceux qui se plaignent du manque de travail tout en refusant les occasions qui se présentent.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-222', 'aza-manao-kely-tsy-mba-mamindro-lehibe-tsy-mba-mi', 'Aza manao kely tsy mba mamindro, lehibe tsy mba miasa', 'Ne soyez pas enfant refusant de se réchauffer au foyer, ni adulte rechignant au labeur', 'Chaque étape de la vie a ses devoirs stricts : la jeunesse doit apprendre docilement et l''âge adulte doit s''adonner au travail productif.', 'Leçon de maturité et d''assiduité répétée aux jeunes générations.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Merina', 'Betsileo']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-223', 'ny-riaka-tsy-miandry-mpantsaka', 'Ny riaka tsy miandry mpantsaka', 'Le fleuve en crue n''attend pas le porteur d''eau', 'Le cours du temps et les circonstances opportunes ne ralentissent pas pour attendre les retardataires ; il faut agir au moment opportun.', 'Appel pressant à saisir sans délai les saisons agricoles favorables (semis, repiquage).',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsileo', 'Merina']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-224', 'aza-manao-vava-be-fihinam-bary-fa-tanana-zatra-mi', 'Aza manao vava be fihinam-bary, fa tanana zatra miasa no ananana', 'N''ayez pas seulement une grande bouche pour manger le riz, mais de vaillantes mains habituées à la tâche pour l''obtenir', 'Le droit de jouir des fruits de la terre implique le devoir moral d''avoir participé préalablement à leur culture.', 'Rappel à l''ordre convivial lors des repas partagés au village.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-225', 'tsy-misy-orana-tsy-manala-hetaheta-ny-tany', 'Tsy misy orana tsy manala hetaheta ny tany', 'Il n''est pas de pluie qui n''étanche un tant soit peu la soif de la terre', 'Même le travail le plus modeste ou le résultat apparemment infime produit un effet positif et contribue au progrès général.', 'Consolation bienveillante pour valoriser les petits progrès et débuts discrets.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-226', 'ny-taona-mamokatra-tsy-vokatry-ny-torimaso', 'Ny taona mamokatra tsy vokatry ny torimaso', 'Une année d''abondance ne naît pas du sommeil', 'Les greniers bien remplis et la prospérité familiale sont le fruit direct des levers matinaux et de la sueur versée aux champs.', 'Adage paysan scandé aux aurores avant le départ pour la rizière.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsileo', 'Merina']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-227', 'antidahim-bariky-ny-fiainana-izay-tsy-mambokiny', 'Antidahim-bariky ny fiaiñaña : izay tsy mambokiñy tsy hömaña', 'La vie est comme le vieux maki : qui ne saute pas d''arbre en arbre ne mange pas', 'Dans l''existence, le mouvement, l''audace et l''effort quotidien sont la condition absolue de la nourriture et de la subsistance.', 'Proverbe fondamental betsimisaraka cité pour inciter les jeunes au labeur et à la mobilité active.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsimisaraka']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Merina', 'Ny fiainana toy ny gidro : izay tsy mitsambikina tsy mihinana', 'proverbID-227', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-227' AND "dialectName" = 'Merina'
);

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-228', 'kojeja-bi-loha-tsy-laninakoho-boty', 'Kojeja bi-löha tsy lanin''akôho boty', 'Le criquet à grosse tête ne peut être avalé par un poussin chétif', 'Pour entreprendre un projet ambitieux ou assumer de hautes responsabilités, il faut posséder les moyens, les compétences et l''envergure appropriés.', 'Mise en garde contre la prétention inconsidérée et l''absence de préparation technique.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsimisaraka']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-229', 'akoho-be-holy-tsy-be-fe', 'Akôho be holy tsy be fe', 'La poule qui reste immobile sur ses pattes n''a pas de cuisses charnues', 'L''inactivité et l''absence de courage ne procurent aucun développement ni aucune richesse matérielle ; seul l''exercice forge la force.', 'Parabole campagnarde illustrant la nécessité de courir et d''agir sans relâche pour prospérer.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsimisaraka']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-230', 'izay-manginy-volamena', 'Izay mangiñy, völamena', 'Celui qui sait se taire est revêtu d''or', 'Dans la culture de l''Est, la retenue, l''écoute silencieuse et l''observation priment toujours sur le bavardage impétueux.', 'Recommandation d''attitude pour les jeunes assistant aux conseils des aînés.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsimisaraka']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Merina', 'Ny teny volafotsy, fa ny fahanginana volamena', 'proverbID-230', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-230' AND "dialectName" = 'Merina'
);

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-231', 'lalana-vava-tsy-lalana-tongotra-mora-lazainy-fa', 'Lalaña vava tsy lalaña tongotra : mora lazaiñy fa sarotra fiaiñaña', 'Le chemin tracé par la bouche n''est pas le sentier foulé par les pieds : facile à énoncer, difficile à parcourir', 'Déclarer de nobles intentions ou donner des leçons de morale est aisé ; appliquer rigoureusement ces règles dans sa propre vie exige une volonté de fer.', 'Rappel à la modestie adressé aux donneurs de leçons qui n''éprouvent pas leurs propres conseils.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsimisaraka']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-232', 'rivotra-be-tsy-mandrava-hazo-manam-paka-lalina', 'Rivotra be tsy mandrava hazo manam-paka lalina', 'Le grand vent de mousson n''abat pas l''arbre aux racines profondes', 'L''individu profondément ancré dans sa culture, ses valeurs ancestrales et l''éducation de ses parents résiste à toutes les tempêtes de la vie.', 'Éloge de la fidélité aux coutumes et aux fondations spirituelles lors des périodes de crise.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsimisaraka']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-233', 'fandri-boay-nahavoa-aomby-raha-tsy-tiana-mora-to', 'Fandri-boay nahavoa aomby : raha tsy tiaña möra tönga', 'Le piège à crocodile qui capture un bœuf : le malheur survient vite quand on baisse la garde', 'L''inattention et la négligence peuvent transformer une mesure de sécurité en désastre imprévu.', 'Conseil de vigilance lors de la manipulation d''engins ou de décisions délicates.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsimisaraka']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-234', 'akanga-maro-tsy-vakinamboa', 'Akanga maro tsy vakin''amboa', 'Une troupe nombreuse de pintades n''est pas dispersée par le chien', 'Lorsque les membres d''une communauté se serrent les coudes et restent unis, aucune menace extérieure ne peut entamer leur sérénité.', 'Hymne à la solidarité du clan face aux agressions extérieures.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsimisaraka', 'Hauts-Plateaux']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Merina', 'Akanga maro tsy vakin''ny amboa', 'proverbID-234', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-234' AND "dialectName" = 'Merina'
);

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-235', 'sakalava-very-omby-ka-ny-sisa-no-atao-tsara-hidy', 'Sakalava very omby ka ny sisa no atao tsara hidy', 'Le Sakalava qui perd un bœuf veille à cadenasser doublement l''enclos pour ceux qui restent', 'L''adversité et les pertes passées doivent servir de leçon pour redoubler de vigilance et protéger les biens précieux qui demeurent.', 'Formule d''expérience énoncée pour encourager la prévoyance après un échec ou un vol.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Sakalava']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Merina', 'Very omby vao mahatonga vala', 'proverbID-235', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-235' AND "dialectName" = 'Merina'
);

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-236', 'tomendry-anabo-kakazo-vatana-fo-aty-fa-jery-jiab', 'Tomendry añabo kakazo ; vataña fô aty fa jery jiaby aminarô añy', 'Perché sur la cime de l''arbre ; le corps seul est ici, mais tout le regard et l''esprit sont auprès des vôtres là-bas', 'Même éloigné géographiquement par ses devoirs, le cœur et la sollicitude d''une personne sincère restent attachés aux siens.', 'Salutation chaleureuse et poétique adressée aux proches lors des voyages lointains.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Sakalava']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-237', 'tia-vady-manompo-rafozana', 'Tia vady manompo rafozaña', 'Qui aime son conjoint se dévoue corps et âme pour ses beaux-parents', 'Le mariage dans la tradition malgache ne lie pas deux individus isolés mais deux familles entières : respecter sa belle-famille est la preuve suprême de l''amour conjugal.', 'Conseil traditionnel majeur délivré aux jeunes mariés lors des noces.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Sakalava', 'Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Merina', 'Tia vady, manaja rafozana', 'proverbID-237', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-237' AND "dialectName" = 'Merina'
);

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-238', 'nahoana-no-ny-betsimisaraka-no-namono-mamba-ka-ny', 'Nahoana no ny Betsimisaraka no namono mamba, ka ny Sakalava no miravaka ny nifiny ?', 'Pourquoi serait-ce le Betsimisaraka qui brave le caïman, et le Sakalava qui se parerait de ses dents ?', 'Il est profondément injuste que certains supportent tous les risques et les sueurs du labeur, pendant que d''autres s''arrogent la gloire et les honneurs sans effort.', 'Dénonciation ferme de l''usurpation des mérites dans une œuvre collective.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Sakalava', 'Betsimisaraka']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-239', 'omby-mahia-tsy-fointsika-omby-matavy-anolona', 'Omby mahia tsy fointsika, omby matavy an''olona', 'Le zébu maigre qui nous appartient nous est plus cher que le taureau gras d''autrui', 'Il faut chérir et valoriser ses propres biens modestes et les siens, plutôt que de jalouser ou convoiter les fastes trompeurs du voisin.', 'Éloge du contentement et de la fidélité à son modeste patrimoine familial.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Sakalava', 'Bara']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-240', 'ny-fanekena-natao-teo-an-kianja-tsy-ravana-ao-an-', 'Ny fanekena natao teo an-kianja, tsy ravana ao an-trano', 'Le pacte conclu sur la place publique ne se dénonce point une fois rentré sous le toit', 'La parole donnée et les engagements solennels pris devant la communauté sont sacrés et doivent être honorés sans duplicité.', 'Rappel à l''intégrité et au respect des serments après un accord conclu.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Sakalava', 'Menabe']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-241', 'ana-tsiriry-tsy-toroan-dagno', 'Ana-tsiriry tsy toroan-dagno', 'Le poussin de la sarcelle n''a nul besoin qu''on lui montre la rivière', 'Inutile d''enseigner avec condescendance ce qui relève de l''instinct naturel, de la vocation innée ou d''une expérience déjà acquise.', 'S''applique lorsqu''un aîné constate la dextérité spontanée d''un enfant héritant du talent de ses parents.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Antandroy']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Merina', 'Zanak''omby tsy ampianarin-domano', 'proverbID-241', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-241' AND "dialectName" = 'Merina'
);

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-242', 'izay-manan-tsira-mahay-mahandro', 'Izay manan-tsira mahay mahandro', 'Celui qui possède le sel sait comment réussir le repas', 'Pour mener à bien une mission délicate, il est indispensable de disposer des ressources élémentaires et du savoir-faire adéquat.', 'Reconnaissance de la compétence de celui qui dispose des outils appropriés pour résoudre une crise.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Antandroy']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-243', 'ny-mahery-tsy-maody-tsy-ela-velona', 'Ny mahery tsy maody tsy ela velona', 'Le fort qui dédaigne la prudence et le discernement ne vit pas longtemps', 'La seule puissance musculaire ou l''arrogance bravache sans intelligence ni tempérance conduit tout droit à une fin tragique.', 'Avertissement adressé aux querelleurs qui abusent de leur force physique pour intimider autrui.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Antandroy']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Merina', 'Ny mahery tsy maody tsy ela velona', 'proverbID-243', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-243' AND "dialectName" = 'Merina'
);

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-244', 'tandriondriono-maola-mahazo-ty-marentane', 'Tandriondriono maola mahazo ty marentane', 'L''agitation aveugle et insensée ne récolte que tourments et désolation', 'Agir avec précipitation et sans écouter les avis des personnes avisées entraîne des conséquences douloureuses pour soi et ses proches.', 'Conseil de pondération prodigué face aux réactions impulsives.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Antandroy']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-245', 'tagnamboa-tsy-folaka-hevitse', 'Tagnamboa tsy folaka hevitse', 'L''arbre du grand désert ne manque jamais de souplesse face à la sécheresse', 'L''être endurci par les rigueurs de l''environnement apprend l''art de l''adaptation et de l''ingéniosité pour survivre dignement.', 'Célébration de la résilience du peuple du Sud face aux pénuries climatiques.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Antandroy']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-246', 'ny-tso-drano-zava-mahery-mahatsara-ny-lalana-dia', 'Ny tso-drano zava-mahery : mahatsara ny lalana diavin''ny tena', 'La bénédiction des aînés est une force souveraine : elle aplanit la route sous les pas', 'La bénédiction paternelle et maternelle reçue d''un cœur pur protège l''individu, conjure le mauvais sort et ouvre les voies du succès.', 'Invoqué solennellement lorsqu''un enfant quitte le toit familial pour ses études ou une nouvelle étape de vie.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-247', 'aza-mandika-fefy-natsanganny-ray', 'Aza mandika fefy natsangan''ny ray', 'Ne franchissez pas avec désinvolture la clôture bâtie par vos pères', 'Il est du devoir de la jeunesse de respecter les lois morales, les coutumes éprouvées et les délimitations établies par les ancêtres.', 'Rappel à l''ordre coutumier lors des querelles de bornage ou de rupture des traditions sacrées.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsileo', 'Merina']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-248', 'ny-loloina-an-doha-tsy-mba-enta-mavesatra-ny-fit', 'Ny loloina an-doha tsy mba enta-mavesatra : ny fitiavana ny ray aman-dreny', 'Ce que l''on porte sur la tête par amour filial ne semble jamais un lourd fardeau', 'Prendre soin de ses géniteurs dans leur grand âge n''est pas une corvée pénible, mais une dette sacrée de reconnaissance acquittée avec joie.', 'Exhortation des enfants à veiller sur leurs parents vieillissants avec dévouement.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-249', 'aza-manao-am-bava-malefaka-ka-an-tsaina-misy-lefon', 'Aza manao am-bava malefaka ka an-tsaina misy lefona', 'N''ayez pas des paroles doucereuses sur les lèvres tout en dissimulant une lance dans votre cœur', 'La duplicité, l''hypocrisie et les sourires trompeurs doivent être bannis ; l''honnêteté exige la concordance parfaite entre les propos et les pensées.', 'Mise en garde contre la traîtrise feutrée dans les relations professionnelles et politiques.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Merina', 'Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-250', 'ny-hazo-avo-halanny-rivotra', 'Ny hazo avo halan''ny rivotra', 'L''arbre le plus élevé est le premier buté par les assauts du vent', 'Occuper un rang élevé ou jouir d''une grande notoriété expose inévitablement aux critiques, aux jalousies et aux épreuves les plus intenses.', 'Conseil de prudence et d''humilité adressé aux dirigeants et personnalités publiques.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsileo', 'Merina']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Betsileo', 'Hazo lehibe ifofofofon''ny tafiotra', 'proverbID-250', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-250' AND "dialectName" = 'Betsileo'
);

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-251', 'aleo-halanandriana-toy-izay-halam-bahoaka', 'Aleo halan''andriana toy izay halam-bahoaka', 'Mieux vaut encourir le déplaisir des princes que d''être honni par le peuple', 'Le jugement et l''affection de la masse populaire laborieuse ont un poids moral et historique bien supérieur à la faveur éphémère des puissants.', 'Maxime démocratique traditionnelle proclamée lors des débats civiques et royaux.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Merina']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-252', 'aza-manary-ny-hazo-nanantona-anao-fony-ianao-rendr', 'Aza manary ny hazo nanantona anao fony ianao rendrika', 'Ne jetez point avec dédain la branche flottante qui vous a sauvé lorsque vous couliez', 'Il est odieux d''oublier ou de mépriser les bienfaiteurs modestes qui vous ont secouru au moment de la détresse une fois la prospérité retrouvée.', 'Leçon de gratitude pérenne envers ceux qui ont tendu la main dans les débuts difficiles.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-253', 'ny-volamena-tsy-matahotra-afo-ny-marina-tsy-matah', 'Ny volamena tsy matahotra afo, ny marina tsy matahotra fitsarana', 'L''or pur ne craint pas la fournaise, la vérité ne redoute point le tribunal', 'L''homme sincère et droit dans sa conscience affronte sans pâlir les épreuves et les jugements, car son innocence finit toujours par éclater.', 'Cité par l''accusé injustement diffamé devant les juges traditionnels.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-254', 'izay-manao-tsara-fototra-tsy-matahotra-rivotra', 'Izay manao tsara fototra, tsy matahotra rivotra', 'Celui qui bâtit sur de solides fondations ne tremble point devant les bourrasques', 'Une éducation solide, un métier bien appris et des principes inaltérables garantissent la stabilité de l''existence face aux aléas de la vie.', 'Encouragement à la rigueur dès les étapes initiales d''un apprentissage.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-255', 'ny-fisaorana-tsy-mampahantra-ny-fitahiana-tsy-mam', 'Ny fisaorana tsy mampahantra, ny fitahiana tsy mampanefy', 'Exprimer sa gratitude n''appauvrit personne, bénir autrui ne coûte aucune peine', 'La politesse, la bienveillance et les vœux sincères sont des trésors moraux inépuisables qui enrichissent celui qui les donne comme celui qui les reçoit.', 'Leçon de courtoisie élémentaire dispensée dès le plus jeune âge.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-256', 'ny-omby-mahia-tsy-namana', 'Ny omby mahia tsy namana', 'Le bœuf émacié ne trouve point de compagnon d''attelage', 'Constat lucide et critique de la cruauté humaine : les personnes dans la misère sont trop souvent délaissées par ceux qui les entouraient au temps de leur splendeur.', 'Dénonciation de l''égoïsme mondain et appel à la compassion pour les démunis.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsileo', 'Merina']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-257', 'aza-mandao-ny-omby-mahavokatra-ka-hihazakazaka-han', 'Aza mandao ny omby mahavokatra ka hihazakazaka hanenjika ny vorona manidina', 'N''abandonnez pas la vache productive pour courir après l''oiseau qui s''envole', 'Il ne faut point délaisser un bien certain, acquis par le labeur, pour des chimères séduisantes mais hautement improbables.', 'Avertissement contre la spéculation hasardeuse et les promesses mirobolantes.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-258', 'ny-valin-tanana-no-mampitombo-ny-voka-bary', 'Ny valin-tanana no mampitombo ny voka-bary', 'C''est l''entraide communautaire des bras qui démultiplie la récolte du riz', 'La solidarité active dans le repiquage et la moisson permet d''achever en un jour ce qu''une famille isolée peinerait à réaliser en un mois.', 'Appel traditionnel à l''esprit d''entraide (valin-tanana) lors de la saison des pluies.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsileo', 'Merina']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-259', 'aza-manao-fitia-tsipolitra-liana-aminny-voaloha', 'Aza manao fitia tsipolitra : liana amin''ny voalohany, fa manary amin''ny farany', 'N''ayez point un amour de fétu de paille : flamboyant au départ, prompt à s''éteindre et à abandonner à la fin', 'La véritable amitié et l''engagement sincère se mesurent à leur constance dans la durée et non à un enthousiasme passager.', 'Conseil de fidélité dans les relations amicales et professionnelles.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Merina']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-260', 'ny-lova-tsara-indrindra-ho-anny-zanaka-dia-ny-fah', 'Ny lova tsara indrindra ho an''ny zanaka dia ny fahendrena sy ny fanabeazana', 'Le plus bel héritage pour un enfant réside dans la sagesse et l''éducation qu''on lui transmet', 'Les terres et l''or peuvent être perdus ou dilapidés, mais l''instruction et les valeurs morales chevillées au corps demeurent pour toujours.', 'Exhortation des parents à privilégier l''instruction de leur progéniture.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-261', 'ny-teny-ratsy-toy-ny-tsilo-mora-atsindrona-fa-sa', 'Ny teny ratsy toy ny tsilo : mora atsindrona fa sarotra alana', 'La mauvaise parole est pareille à l''épine : facile à planter, douloureuse à retirer', 'Une parole offensante s''enracine durablement dans le cœur de celui qui la reçoit et laisse des cicatrices vivaces même après le pardon.', 'Invitation solennelle à la retenue verbale lors des tensions familiales.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-262', 'aza-manao-lamban-tsolifara-tsara-ety-ivelany-fa', 'Aza manao lamban-tsolifara : tsara ety ivelany fa simba ao anaty', 'Ne ressemblez point à la natte de cercueil : éclatante au regard extérieur mais corrompue en son for intérieur', 'Il faut condamner l''apparence respectable masquant la noirceur de l''âme ; la pureté intérieure prime sur l''artifice.', 'Reproche adressé aux faux dévots et aux imposteurs de la vie publique.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Merina']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-263', 'ny-olona-mahay-manetry-tena-no-asandratra', 'Ny olona mahay manetry tena no asandratra', 'L''être capable d''humilité véritable est celui que la communauté élève', 'Ceux qui s''abstiennent d''arrogance et savent servir avec modestie finissent toujours par gagner la confiance et l''estime unanime de leurs pairs.', 'Maxime célébrant la vertu d''humilité chez les grands orateurs et chefs traditionnels.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-264', 'ny-fitiavana-tsy-mba-an-tery-toy-ny-rano-mikoria', 'Ny fitiavana tsy mba an-tery : toy ny rano mikoriana am-pahatoniana', 'L''amour ne se commande point de force : il est pareil à l''eau qui s''écoule paisiblement', 'Les sentiments sincères et les unions durables doivent naître du libre consentement et de l''harmonie naturelle des cœurs.', 'Principe coutumier défendant la liberté et la sincérité des sentiments amoureux.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-265', 'ny-asa-iaraha-manao-dia-maivana-ny-entana-ifandro', 'Ny asa iaraha-manao dia maivana, ny entana ifandrombahana tsy mandratra soroka', 'Le travail partagé devient léger, le fardeau porté ensemble ne blesse point l''épaule', 'Face aux corvées les plus ardues, la répartition fraternelle des efforts transforme la pénibilité en un moment de communion joyeuse.', 'Cri d''encouragement lors du transport de bois de charpente ou de digues de rizière.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-266', 'ny-andro-lasa-tsy-mba-miverina', 'Ny andro lasa tsy mba miverina', 'Le jour enfui ne revient jamais sur ses pas', 'Le temps est un trésor précieux et irréversible ; chaque instant doit être employé à des œuvres utiles pour soi et sa communauté.', 'Avertissement contre la procrastination et le gaspillage des heures de jeunesse.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-267', 'ny-marina-toy-ny-fary-na-voatoto-aza-mbola-mamy', 'Ny marina toy ny fary : na voatoto aza, mbola mamy ihany', 'La vérité est pareille à la canne à sucre : même broyée sous la meule, elle conserve sa douceur', 'L''authenticité et la probité résistent à toutes les humiliations et calomnies ; le temps finit toujours par en révéler la saveur irremplaçable.', 'Encouragement pour celui qui endure l''injustice pour être resté fidèle à la vérité.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsimisaraka', 'Hauts-Plateaux']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-268', 'aza-manao-rano-an-tavy-manopy-ka-manary', 'Aza manao rano an-tavy : manopy ka manary', 'Ne traitez pas autrui comme l''eau de la cuvette : s''y laver puis la rejeter avec dédain', 'Il est indigne de n''approcher une personne que pour exploiter ses services ou son soutien, pour ensuite l''abandonner froidement une fois le besoin comblé.', 'Condamnation morale de l''ingratitude et de l''opportunisme relationnel.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Merina']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-269', 'tsy-misy-valala-tsy-an-katsaka', 'Tsy misy valala tsy an-katsaka', 'Il n''est point de sauterelle qui ne finisse un jour par se poser sur le maïs', 'Chacun a ses habitudes, ses vulnérabilités et ses points d''attache ; avec de la patience, les intentions cachées finissent toujours par se dévoiler.', 'Maxime de déduction et de perspicacité face aux faux-fuyants d''un suspect.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-270', 'ny-zaza-hendry-voninahitry-ny-ray-aman-dreniny', 'Ny zaza hendry voninahitry ny ray aman-dreniny', 'L''enfant bien élevé et sage fait la fierté et l''honneur de ses parents', 'La droiture et les succès d''un enfant rejaillissent sur toute sa famille et récompensent dignement les sacrifices de ses éducateurs.', 'Compliment traditionnel adressé aux parents lors de la réussite scolaire ou sociale d''un jeune.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-271', 'ny-fitiavana-marina-tsy-mba-manao-vava-be', 'Ny fitiavana marina tsy mba manao vava be', 'Le véritable amour ne s''embarrasse point de grands discours tapageurs', 'Les sentiments les plus sincères et les plus profonds s''expriment dans la discrétion des actes quotidiens plutôt que dans les promesses ronflantes.', 'Rappel à la sobriété et à l''authenticité dans l''engagement conjugal ou fraternel.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-272', 'ny-henatra-no-tsara-noho-ny-faharesena', 'Ny henatra no tsara noho ny faharesena', 'Le sens de l''honneur et la pudeur valent mieux que la déchéance morale', 'Mieux vaut renoncer dignement à un affrontement stérile ou à un gain douteux que de perdre sa réputation et l''estime de soi.', 'Conseil de modération donné pour désamorcer une surenchère verbale dangereuse.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Merina', 'Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-273', 'izay-manao-soa-ho-anny-hafa-manao-soa-ho-anny-t', 'Izay manao soa ho an''ny hafa, manao soa ho an''ny tenany', 'Qui sème le bien envers son semblable fait du bien à sa propre existence', 'La bienveillance et la générosité créent autour de l''individu un cercle vertueux d''amitié, de protection et de paix intérieure.', 'Motivation à l''altruisme et à l''assistance des personnes vulnérables.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-274', 'aza-manao-vorona-manara-drenirano-mora-midina-fa', 'Aza manao vorona manara-drenirano : mora midina fa sarotra miakatra', 'N''imitez point l''oiseau qui suit docilement le cours du fleuve : descendre est aisé, remonter le courant est périlleux', 'Se laisser glisser sur la pente de la facilité ou des mauvaises fréquentations est tentant, mais redresser sa vie exige des efforts colossaux.', 'Avertissement donné à la jeunesse contre les tentations de la dérive et du laisser-aller.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsileo', 'Merina']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-275', 'ny-fanetren-tena-no-loharanonny-voninahitra', 'Ny fanetren-tena no loharanon''ny voninahitra', 'L''humilité est la source la plus pure de la véritable grandeur', 'C''est en sachant s''effacer, servir autrui et reconnaître ses limites que l''on acquiert une autorité morale naturelle et incontestable.', 'Éloge coutumier prononcé en l''honneur d''un doyen respecté pour sa modestie.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-276', 'ny-namana-marina-hita-aminny-andro-fahoriana', 'Ny namana marina hita amin''ny andro fahoriana', 'Le véritable ami se reconnaît au jour de l''adversité', 'Les compagnons de fête fuient au premier orage ; seuls ceux qui demeurent à vos côtés dans le deuil ou la misère méritent le titre de frère.', 'Reconnaissance émue témoignée à un proche venu prêter main-forte lors d''un coup dur.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-277', 'ny-fahaizana-tsy-voavidy-vola-fa-iasana-am-poto-k', 'Ny fahaizana tsy voavidy vola, fa iasana am-poto-kevitra', 'Le vrai savoir ne s''achète pas avec de l''argent, il s''acquiert par l''étude patiente et la méditation', 'La richesse matérielle ne peut remplacer la rigueur intellectuelle, la culture et l''apprentissage méthodique d''un métier.', 'Exhortation des étudiants et des apprentis à la persévérance scolaire.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-278', 'izay-tsy-mandray-anatra-mandray-loza', 'Izay tsy mandray anatra, mandray loza', 'Celui qui rejette les sages conseils des anciens s''expose de plein fouet au désastre', 'Le refus obstiné d''écouter les avertissements bienveillants conduit inévitablement aux erreurs les plus destructrices.', 'Rappel à la docilité adressé à celui qui persiste dans une démarche imprudente.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-279', 'ny-fahamarinana-toy-ny-masoandro-na-takon-drahon', 'Ny fahamarinana toy ny masoandro : na takon-drahona aza, hiposaka ihany', 'La vérité est pareille au soleil : même masquée par les nuages sombres, elle finit toujours par rayonner', 'Les complots, les faux témoignages et l''injustice peuvent masquer temporairement la réalité, mais la lumière finit toujours par triompher.', 'Parole de foi et d''espoir prononcée lors d''épreuves judiciaires ou de calomnies publiques.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-280', 'ny-fihavanana-toy-ny-lalan-kely-an-tsaha-raha-ts', 'Ny fihavanana toy ny lalan-kely an-tsaha : raha tsy ifamelezana, dia tapitr''ahitra', 'L''amitié est comme le sentier des rizières : si on ne l''emprunte pas régulièrement, les herbes folles l''effacent', 'Les relations fraternelles demandent un entretien constant (visites, nouvelles, marques d''affection) sous peine de s''étioler avec la distance.', 'Justification traditionnelle d''une visite de courtoisie inopinée à un parent éloigné.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Betsileo', 'Merina']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-281', 'izay-mahay-manaja-ny-madinika-hajainny-lehibe', 'Izay mahay manaja ny madinika, hajain''ny lehibe', 'Celui qui sait témoigner de la déférence aux humbles gagne tout naturellement le respect des grands', 'La courtoisie envers les faibles est la véritable marque des âmes nobles et inspire la confiance des chefs et des aînés.', 'Maxime de comportement politique et social enseignée aux futurs responsables.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-282', 'ny-marina-tsy-mba-maty-an-drano', 'Ny marina tsy mba maty an-drano', 'La vérité ne se noie jamais au fond des eaux', 'Aucune tentative de dissimulation ni aucun étouffement de scandale ne peut submerger définitivement la vérité.', 'Formule d''apaisement utilisée lorsque des faits longtemps cachés refont surface.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-283', 'ny-zoky-manoro-ny-zandry-mankato', 'Ny zoky manoro, ny zandry mankato', 'L''aîné guide le chemin avec bienveillance, le cadet prête l''oreille avec respect', 'L''harmonie de la famille et de la société repose sur ce pacte intergénérationnel : la transmission protectrice des devanciers et la docilité studieuse des cadets.', 'Principe fondamental de la hiérarchie coutumière malgache.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-284', 'aza-manao-am-pihavanana-kely-toy-ny-voatavo-mani', 'Aza manao am-pihavanana kely toy ny voatavo : maniry ka manongana ny tompony', 'Ne pratiquez point une fraternité de courge grimpante : grandissant pour finir par écraser le piquet qui l''a soutenue', 'Il faut flétrir l''arrogance de ceux qui, après avoir grandi grâce à la générosité d''un bienfaiteur, se retournent contre lui pour l''évincer.', 'Sévère réprimande contre l''ingratitude des protégés envers leurs mentors.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Merina']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-285', 'ny-tany-tsy-mba-manda-faty-ny-fihavanana-tsy-mba', 'Ny tany tsy mba mandà faty, ny fihavanana tsy mba mandà havana', 'La terre ne refuse jamais la dépouille, et la fraternité ne repousse jamais le parent revenu', 'L''amour familial et la communauté ont une capacité infinie d''accueil et de pardon pour le membre égaré qui revient chercher refuge.', 'Accueil inconditionnel d''un membre de la famille après une longue absence ou des erreurs passées.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-286', 'ny-fandeferana-tsy-faharesena-fa-fandresena-ny-ha', 'Ny fandeferana tsy faharesena, fa fandresena ny hatezerana', 'Savoir pardonner et céder avec noblesse n''est point une défaite, mais la victoire sur sa propre rancœur', 'La modération et l''apaisement volontaire témoignent d''une force d''âme supérieure à celle qui s''abandonne aveuglément à la vengeance.', 'Exhortation à la paix concluant un arbitrage traditionnel entre deux voisins.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "malagasy_items" (
    "id", "slug", "malagasy", "french", "meaning", "example",
    "category", "difficulty", "status", "isPremium", "isFeatured",
    "origins", "viewCount", "likesCount", "shareCount", "reportCount",
    "createdAt", "updatedAt"
) VALUES (
    'proverbID-287', 'ny-fiainana-toy-ny-kodiaran-kalesy-anio-ambony', 'Ny fiainana toy ny kodiaran-kalesy : anio ambony, rahampitso ambany', 'L''existence humaine est comme la roue du chariot : aujourd''hui au faîte, demain au ras du sol', 'Les honneurs et les fortunes sont changeants ; celui qui prospère aujourd''hui doit rester humble et généreux, car la roue tourne pour tous.', 'Leçon de modestie pour ceux que le succès récent rend orgueilleux.',
    'PROVERBE'::"CategoryType", 'EASY'::"DifficultyLevel", 'PUBLISHED'::"ContentStatus", false, false,
    ARRAY['Général']::TEXT[], 0, 0, 0, 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
    "french" = EXCLUDED."french",
    "meaning" = EXCLUDED."meaning",
    "example" = EXCLUDED."example",
    "origins" = EXCLUDED."origins",
    "updatedAt" = CURRENT_TIMESTAMP;
