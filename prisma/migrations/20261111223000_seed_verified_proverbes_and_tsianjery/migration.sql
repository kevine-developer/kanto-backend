-- Migration : 20261111223000_seed_verified_proverbes_and_tsianjery
-- Insertion et synchronisation strictement idempotentes (blocs conditionnels)
-- Protege contre les doublons d id et de slug existants

-- ============================================================================
-- 1. TSIANJERY / RÉCITATIONS CULTURELLES TRADITIONNELLES
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-1' OR "slug" = 'tsianjery-tanindrazana') THEN
        UPDATE "recitations" SET
            "title" = 'Tsianjery : Tanindrazana',
            "titleFr" = 'Récitation : La Patrie',
            "author" = 'Fampianarana Malagasy',
            "description" = 'Tsianjery fanao an-tsekoly mitaiza amin''ny fitiavan-tanindrazana sy ny fahaizana miteny.',
            "durationMinutes" = 2,
            "contentLines" = ARRAY['I Madagasikara no tanindrazako,', 'Tany manan-karena sy mahafinaritra,', 'Ny lanitra manga mangarangarana,', 'Ny ranomasina mamihina azy.', '', 'Hianatra tsara aho ho reharehany,', 'Hiasa amim-pahamarinana sy fahaizana,', 'Mba ho firenena mandroso sy vanona,', 'Hitondra fahasambarana ho an''ny rehetra.']::TEXT[],
            "references" = ARRAY['Fandaharam-pianarana Malagasy nentim-paharazana']::TEXT[],
            "tags" = ARRAY['Fianarana', 'Tanindrazana', 'Sekoly']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-1' OR "slug" = 'tsianjery-tanindrazana';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-1', 'tsianjery-tanindrazana', 'Tsianjery : Tanindrazana', 'Récitation : La Patrie', 'Fampianarana Malagasy', 'Tsianjery fanao an-tsekoly mitaiza amin''ny fitiavan-tanindrazana sy ny fahaizana miteny.', 2,
            ARRAY['I Madagasikara no tanindrazako,', 'Tany manan-karena sy mahafinaritra,', 'Ny lanitra manga mangarangarana,', 'Ny ranomasina mamihina azy.', '', 'Hianatra tsara aho ho reharehany,', 'Hiasa amim-pahamarinana sy fahaizana,', 'Mba ho firenena mandroso sy vanona,', 'Hitondra fahasambarana ho an''ny rehetra.']::TEXT[], ARRAY['Fandaharam-pianarana Malagasy nentim-paharazana']::TEXT[], ARRAY['Fianarana', 'Tanindrazana', 'Sekoly']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-2' OR "slug" = 'fahaizana-mandaha-teny-ny-fanajana') THEN
        UPDATE "recitations" SET
            "title" = 'Fahaizana mandaha-teny : Ny fanajana',
            "titleFr" = 'Éloquence : Le respect mutuel',
            "author" = 'Lovantsofina',
            "description" = 'Fampianarana ny fomba fitenenana mirindra sy mendrika eo anivon''ny fiarahamonina.',
            "durationMinutes" = 3,
            "contentLines" = ARRAY['Ny teny malefaka manam-panahy,', 'Mampitony ny fo tezitra sy maratra ;', 'Ny fanajana ny zokiolona sy ny manodidina,', 'No fototry ny fiadanana sy ny fihavanana.', '', 'Aza manao teny mandratra,', 'Fa ny teny toy ny atody :', 'Raha latsaka ka vaky,', 'Tsy azo tononina intsony.']::TEXT[],
            "references" = ARRAY['Ohabolana sy soatoavina Malagasy']::TEXT[],
            "tags" = ARRAY['Fanajana', 'Fahendrena', 'Fitenenana']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-2' OR "slug" = 'fahaizana-mandaha-teny-ny-fanajana';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-2', 'fahaizana-mandaha-teny-ny-fanajana', 'Fahaizana mandaha-teny : Ny fanajana', 'Éloquence : Le respect mutuel', 'Lovantsofina', 'Fampianarana ny fomba fitenenana mirindra sy mendrika eo anivon''ny fiarahamonina.', 3,
            ARRAY['Ny teny malefaka manam-panahy,', 'Mampitony ny fo tezitra sy maratra ;', 'Ny fanajana ny zokiolona sy ny manodidina,', 'No fototry ny fiadanana sy ny fihavanana.', '', 'Aza manao teny mandratra,', 'Fa ny teny toy ny atody :', 'Raha latsaka ka vaky,', 'Tsy azo tononina intsony.']::TEXT[], ARRAY['Ohabolana sy soatoavina Malagasy']::TEXT[], ARRAY['Fanajana', 'Fahendrena', 'Fitenenana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-3' OR "slug" = 'mandihiza-rahitsikitsika') THEN
        UPDATE "recitations" SET
            "title" = 'Mandihiza Rahitsikitsika',
            "titleFr" = 'Danse, ô crécerelle (Comptine à gestes)',
            "author" = 'Lovantsofina (Lalaon-jaza nentim-paharazana)',
            "description" = 'Comptine à gestes et danse enfantine traditionnelle très populaire à Madagascar. Les enfants imitent le vol stationnaire et le battement rapide des ailes du faucon crécerelle (hitsikitsika) tout en rythmant des pieds et des mains.',
            "durationMinutes" = 2,
            "contentLines" = ARRAY['Mandihiza Rahitsikitsika,', 'Fa ny vadinao no maty ;', 'Maty tany an-dRovan-tompo,', 'Voatifitry ny varatra.', '', 'Mitsangàna ianao ka mandihiza,', 'Asehoy ny dihy malagasy ;', 'Ahintsano ny tananao,', 'Ary ny tongotrao asio gadona !', '', 'Mandihiza eny Mahamasina,', 'Hifalian''ny Manjakamiadana !']::TEXT[],
            "references" = ARRAY['Fandaharam-pianarana Malagasy nentim-paharazana', 'Mbolatiana / ARB Music - Rondes, comptines et berceuses de Madagascar']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Comptine', 'Dihy', 'Zaza', 'Vorona']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-3' OR "slug" = 'mandihiza-rahitsikitsika';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-3', 'mandihiza-rahitsikitsika', 'Mandihiza Rahitsikitsika', 'Danse, ô crécerelle (Comptine à gestes)', 'Lovantsofina (Lalaon-jaza nentim-paharazana)', 'Comptine à gestes et danse enfantine traditionnelle très populaire à Madagascar. Les enfants imitent le vol stationnaire et le battement rapide des ailes du faucon crécerelle (hitsikitsika) tout en rythmant des pieds et des mains.', 2,
            ARRAY['Mandihiza Rahitsikitsika,', 'Fa ny vadinao no maty ;', 'Maty tany an-dRovan-tompo,', 'Voatifitry ny varatra.', '', 'Mitsangàna ianao ka mandihiza,', 'Asehoy ny dihy malagasy ;', 'Ahintsano ny tananao,', 'Ary ny tongotrao asio gadona !', '', 'Mandihiza eny Mahamasina,', 'Hifalian''ny Manjakamiadana !']::TEXT[], ARRAY['Fandaharam-pianarana Malagasy nentim-paharazana', 'Mbolatiana / ARB Music - Rondes, comptines et berceuses de Madagascar']::TEXT[], ARRAY['Tsianjery', 'Comptine', 'Dihy', 'Zaza', 'Vorona']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-4' OR "slug" = 'iny-hono-izy-ravorombazaha') THEN
        UPDATE "recitations" SET
            "title" = 'Iny hono izy Ravorombazaha',
            "titleFr" = 'L''oiseau blanc venu d''ailleurs (Berceuse traditionnelle)',
            "author" = 'Lovantsofina (Kalo sy fampatorian-jaza)',
            "description" = 'La berceuse traditionnelle malgache la plus célèbre, chantée depuis des générations pour apaiser et endormir les nourrissons en invoquant l''oiseau migrateur blanc.',
            "durationMinutes" = 2,
            "contentLines" = ARRAY['Iny hono izy ravorom-bazaha,', 'Ento manaraka anao any an-tsaha ;', 'Ento misidina ambony dia ambony,', 'Raha mitomany izy dia ento,', 'Fa raha mangina dia avereno.', '', 'Torimaso mamy, torimaso mandry,', 'Aza manahy fa eo i Neny miandry.']::TEXT[],
            "references" = ARRAY['Lovantsofina nentin-drazana Malagasy', 'Jean Paulhan - Les hain-teny merinas', 'Collection ARB Music']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Berceuse', 'Fampatoriana', 'Vorona', 'Ankizy']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-4' OR "slug" = 'iny-hono-izy-ravorombazaha';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-4', 'iny-hono-izy-ravorombazaha', 'Iny hono izy Ravorombazaha', 'L''oiseau blanc venu d''ailleurs (Berceuse traditionnelle)', 'Lovantsofina (Kalo sy fampatorian-jaza)', 'La berceuse traditionnelle malgache la plus célèbre, chantée depuis des générations pour apaiser et endormir les nourrissons en invoquant l''oiseau migrateur blanc.', 2,
            ARRAY['Iny hono izy ravorom-bazaha,', 'Ento manaraka anao any an-tsaha ;', 'Ento misidina ambony dia ambony,', 'Raha mitomany izy dia ento,', 'Fa raha mangina dia avereno.', '', 'Torimaso mamy, torimaso mandry,', 'Aza manahy fa eo i Neny miandry.']::TEXT[], ARRAY['Lovantsofina nentin-drazana Malagasy', 'Jean Paulhan - Les hain-teny merinas', 'Collection ARB Music']::TEXT[], ARRAY['Tsianjery', 'Berceuse', 'Fampatoriana', 'Vorona', 'Ankizy']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-5' OR "slug" = 'isa-amontana-fanisanny-ntaolo') THEN
        UPDATE "recitations" SET
            "title" = 'Isa amontana (Fanisan''ny Ntaolo)',
            "titleFr" = 'Comptine de comptage des Anciens (1 à 10)',
            "author" = 'Ntaolo Malagasy',
            "description" = 'Comptine mnémotechnique ancestrale permettant aux enfants d''apprendre à compter de un à dix tout en découvrant les arbres, plantes sacrées et objets du quotidien malgache.',
            "durationMinutes" = 2,
            "contentLines" = ARRAY['Isa ny amontana,', 'Roa aviavy,', 'Telo fangady,', 'Efa-drofia,', 'Dimy emboka,', 'Eni-mangamanga,', 'Fito paraky,', 'Valo tanantanana,', 'Sivy rongony,', 'Folo famolesana !']::TEXT[],
            "references" = ARRAY['W. Cousins - Ny Ohabolan''ny Ntaolo (1885)', 'Fampianarana teny Malagasy fototra']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Fanisana', 'Hazo', 'Fianarana', 'Tontolo iainana']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-5' OR "slug" = 'isa-amontana-fanisanny-ntaolo';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-5', 'isa-amontana-fanisanny-ntaolo', 'Isa amontana (Fanisan''ny Ntaolo)', 'Comptine de comptage des Anciens (1 à 10)', 'Ntaolo Malagasy', 'Comptine mnémotechnique ancestrale permettant aux enfants d''apprendre à compter de un à dix tout en découvrant les arbres, plantes sacrées et objets du quotidien malgache.', 2,
            ARRAY['Isa ny amontana,', 'Roa aviavy,', 'Telo fangady,', 'Efa-drofia,', 'Dimy emboka,', 'Eni-mangamanga,', 'Fito paraky,', 'Valo tanantanana,', 'Sivy rongony,', 'Folo famolesana !']::TEXT[], ARRAY['W. Cousins - Ny Ohabolan''ny Ntaolo (1885)', 'Fampianarana teny Malagasy fototra']::TEXT[], ARRAY['Tsianjery', 'Fanisana', 'Hazo', 'Fianarana', 'Tontolo iainana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-6' OR "slug" = 'nankaiza-i-margerity-') THEN
        UPDATE "recitations" SET
            "title" = 'Nankaiza i Margerity ?',
            "titleFr" = 'Où est Marguerite ? (Jeu de ronde)',
            "author" = 'Lalaon''ankizy nentim-paharazana',
            "description" = 'Jeu de ronde et de dialogue très populaire dans les cours d''école malgaches, où les enfants forment un cercle et dialoguent en rythme avant la phase de poursuite.',
            "durationMinutes" = 3,
            "contentLines" = ARRAY['– Nankaiza i Margerity ? (Ok, o ry sakaiza !)', '– Ao anatin''ilay tranokely. (Ok, ok, ok !)', '– Izaho izao mba te hitaiza. (Ok, ok, ok !)', '– Avo loatra ny tamboho. (Ok, ok, ok !)', '– Angalanay vato iray, roa, telo, efatra !', '– Vato efatra ve dia mba ho aiza ?', '', '– Inona ny ao anatin''ity ?', '– Atody !', '– Inona ny ao anatin''ny atody ?', '– Tapotsiny !', '– Inona ny ao anatin''ny tapotsiny ?', '– Tamenany !', '– Inona ny ao anatin''ny tamenany ?', '– Kofehy sy fanjaitra !']::TEXT[],
            "references" = ARRAY['Lalaon''ankizy Malagasy', 'Mbolatiana - Rondes et comptines de Madagascar (ARB Music)']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Lalao', 'Boribory', 'Ankizy', 'Fifamaliana']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-6' OR "slug" = 'nankaiza-i-margerity-';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-6', 'nankaiza-i-margerity-', 'Nankaiza i Margerity ?', 'Où est Marguerite ? (Jeu de ronde)', 'Lalaon''ankizy nentim-paharazana', 'Jeu de ronde et de dialogue très populaire dans les cours d''école malgaches, où les enfants forment un cercle et dialoguent en rythme avant la phase de poursuite.', 3,
            ARRAY['– Nankaiza i Margerity ? (Ok, o ry sakaiza !)', '– Ao anatin''ilay tranokely. (Ok, ok, ok !)', '– Izaho izao mba te hitaiza. (Ok, ok, ok !)', '– Avo loatra ny tamboho. (Ok, ok, ok !)', '– Angalanay vato iray, roa, telo, efatra !', '– Vato efatra ve dia mba ho aiza ?', '', '– Inona ny ao anatin''ity ?', '– Atody !', '– Inona ny ao anatin''ny atody ?', '– Tapotsiny !', '– Inona ny ao anatin''ny tapotsiny ?', '– Tamenany !', '– Inona ny ao anatin''ny tamenany ?', '– Kofehy sy fanjaitra !']::TEXT[], ARRAY['Lalaon''ankizy Malagasy', 'Mbolatiana - Rondes et comptines de Madagascar (ARB Music)']::TEXT[], ARRAY['Tsianjery', 'Lalao', 'Boribory', 'Ankizy', 'Fifamaliana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-7' OR "slug" = 'arendrina-taratasy-fetim-pirenena') THEN
        UPDATE "recitations" SET
            "title" = 'Arendrina taratasy (Fetim-pirenena)',
            "titleFr" = 'Le lampion de papier (Fête nationale)',
            "author" = 'Lovantsofina an-tsekoly',
            "description" = 'Comptine festive traditionnelle entonnée à la veille de la fête nationale (26 juin) par les enfants défilant à la tombée de la nuit avec leurs lampions illuminés.',
            "durationMinutes" = 2,
            "contentLines" = ARRAY['Arendrina o, arendrina o !', 'Arendrina taratasy,', 'May may may !', 'Izay tsy faly dia miady aminay !', '', 'Hazavao ny lalana ry afo kely,', 'Hitondra fifaliana ho an''ny zaza madinika,', 'Mihira sy mandihy am-pifaliana,', 'Mirary soa ho an''i Madagasikara !']::TEXT[],
            "references" = ARRAY['Fomba sy fanao Malagasy', 'Fankalazana ny 26 Jiona nentim-paharazana']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Arendrina', 'Fety', 'Tanindrazana', 'Ankizy']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-7' OR "slug" = 'arendrina-taratasy-fetim-pirenena';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-7', 'arendrina-taratasy-fetim-pirenena', 'Arendrina taratasy (Fetim-pirenena)', 'Le lampion de papier (Fête nationale)', 'Lovantsofina an-tsekoly', 'Comptine festive traditionnelle entonnée à la veille de la fête nationale (26 juin) par les enfants défilant à la tombée de la nuit avec leurs lampions illuminés.', 2,
            ARRAY['Arendrina o, arendrina o !', 'Arendrina taratasy,', 'May may may !', 'Izay tsy faly dia miady aminay !', '', 'Hazavao ny lalana ry afo kely,', 'Hitondra fifaliana ho an''ny zaza madinika,', 'Mihira sy mandihy am-pifaliana,', 'Mirary soa ho an''i Madagasikara !']::TEXT[], ARRAY['Fomba sy fanao Malagasy', 'Fankalazana ny 26 Jiona nentim-paharazana']::TEXT[], ARRAY['Tsianjery', 'Arendrina', 'Fety', 'Tanindrazana', 'Ankizy']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-8' OR "slug" = 'iza-iry-ambony-iry-') THEN
        UPDATE "recitations" SET
            "title" = 'Iza iry ambony iry ?',
            "titleFr" = 'Qui est là-haut sur la branche ?',
            "author" = 'Lalaon-jaza nentim-paharazana',
            "description" = 'Jeu de devinette et formulette dialoguée mimée, où un enfant debout répond aux questions des autres sur un ton espiègle.',
            "durationMinutes" = 2,
            "contentLines" = ARRAY['– Iza iry ambony iry ô ?', '– Izaho ihany ity ô !', '– Maninona eny in-dry ô ?', '– Izaho mikotroka atody ô !', '', '– Firy ny atodin-dry ô ?', '– Telo sy efatra ihany ô !', '– Mba omeo iray aho hoe...', '– Raha mba mikotroka in-dry ?', '– Mikotroka ihany aho, fa tsy mahavanona !']::TEXT[],
            "references" = ARRAY['Comptines populaires des Hauts-Plateaux', 'ARB Music - Madagascar Jeunesse']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Comptine', 'Fifamaliana', 'Atody', 'Vorona']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-8' OR "slug" = 'iza-iry-ambony-iry-';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-8', 'iza-iry-ambony-iry-', 'Iza iry ambony iry ?', 'Qui est là-haut sur la branche ?', 'Lalaon-jaza nentim-paharazana', 'Jeu de devinette et formulette dialoguée mimée, où un enfant debout répond aux questions des autres sur un ton espiègle.', 2,
            ARRAY['– Iza iry ambony iry ô ?', '– Izaho ihany ity ô !', '– Maninona eny in-dry ô ?', '– Izaho mikotroka atody ô !', '', '– Firy ny atodin-dry ô ?', '– Telo sy efatra ihany ô !', '– Mba omeo iray aho hoe...', '– Raha mba mikotroka in-dry ?', '– Mikotroka ihany aho, fa tsy mahavanona !']::TEXT[], ARRAY['Comptines populaires des Hauts-Plateaux', 'ARB Music - Madagascar Jeunesse']::TEXT[], ARRAY['Tsianjery', 'Comptine', 'Fifamaliana', 'Atody', 'Vorona']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-9' OR "slug" = 'zaza-madio-fahadiovanny-vatana') THEN
        UPDATE "recitations" SET
            "title" = 'Zaza madio (Fahadiovan''ny vatana)',
            "titleFr" = 'L''enfant propre (Récitation éducative)',
            "author" = 'Fampianarana Malagasy',
            "description" = 'Comptine éducative d''éveil corporel et d''hygiène quotidienne, mimant la toilette matinale des tout-petits.',
            "durationMinutes" = 2,
            "contentLines" = ARRAY['Zaza manasa tanana, manasa tanana,', 'Madio ny tananay !', 'Zaza manasa tongotra, manasa tongotra,', 'Madio ny tongotray !', '', 'Zaza manasa tarehy sy sofina,', 'Mangarangarana ny tavaray !', 'Miborosy nify maraina sy hariva,', 'Mba ho zaza salama sy hendry lalandava !']::TEXT[],
            "references" = ARRAY['Taranja Fanabeazana Fototra Malagasy', 'Sekoly Fanabeazana fototra']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Fahadiovana', 'Sekoly', 'Fanabeazana', 'Vatana']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-9' OR "slug" = 'zaza-madio-fahadiovanny-vatana';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-9', 'zaza-madio-fahadiovanny-vatana', 'Zaza madio (Fahadiovan''ny vatana)', 'L''enfant propre (Récitation éducative)', 'Fampianarana Malagasy', 'Comptine éducative d''éveil corporel et d''hygiène quotidienne, mimant la toilette matinale des tout-petits.', 2,
            ARRAY['Zaza manasa tanana, manasa tanana,', 'Madio ny tananay !', 'Zaza manasa tongotra, manasa tongotra,', 'Madio ny tongotray !', '', 'Zaza manasa tarehy sy sofina,', 'Mangarangarana ny tavaray !', 'Miborosy nify maraina sy hariva,', 'Mba ho zaza salama sy hendry lalandava !']::TEXT[], ARRAY['Taranja Fanabeazana Fototra Malagasy', 'Sekoly Fanabeazana fototra']::TEXT[], ARRAY['Tsianjery', 'Fahadiovana', 'Sekoly', 'Fanabeazana', 'Vatana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-10' OR "slug" = 'ilay-bitro-kely-feno-volo') THEN
        UPDATE "recitations" SET
            "title" = 'Ilay bitro kely feno volo',
            "titleFr" = 'Le petit lapin aux grandes oreilles',
            "author" = 'Lovantsofina an-tsekoly',
            "description" = 'Comptine à gestes où les enfants miment les longues oreilles du lapin et ses bonds vifs dans la prairie.',
            "durationMinutes" = 2,
            "contentLines" = ARRAY['Bitro kely feno volo,', 'Be dia be, be dia be !', 'Ao ambony, ao ambany,', 'Eo aloha, ao aoriana.', '', 'Mitsambikimbikina eny an-tsaha,', 'Mihinam-bilona maitso mavana ;', 'Raha mandre feo kely izy,', 'Dia lasa mitsambikina any an-davaka !']::TEXT[],
            "references" = ARRAY['Fampianarana amin''ny garabola Malagasy']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Biby', 'Fihetsika', 'Zaza madinika']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-10' OR "slug" = 'ilay-bitro-kely-feno-volo';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-10', 'ilay-bitro-kely-feno-volo', 'Ilay bitro kely feno volo', 'Le petit lapin aux grandes oreilles', 'Lovantsofina an-tsekoly', 'Comptine à gestes où les enfants miment les longues oreilles du lapin et ses bonds vifs dans la prairie.', 2,
            ARRAY['Bitro kely feno volo,', 'Be dia be, be dia be !', 'Ao ambony, ao ambany,', 'Eo aloha, ao aoriana.', '', 'Mitsambikimbikina eny an-tsaha,', 'Mihinam-bilona maitso mavana ;', 'Raha mandre feo kely izy,', 'Dia lasa mitsambikina any an-davaka !']::TEXT[], ARRAY['Fampianarana amin''ny garabola Malagasy']::TEXT[], ARRAY['Tsianjery', 'Biby', 'Fihetsika', 'Zaza madinika']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-11' OR "slug" = 'mamaivay-ny-tongotro') THEN
        UPDATE "recitations" SET
            "title" = 'Mamaivay ny tongotro',
            "titleFr" = 'Mes petits pieds sont fatigués',
            "author" = 'Lalaon-jaza nentim-paharazana',
            "description" = 'Formulette chantée à la fin des courses et rondes d''enfants lorsque la fatigue se fait sentir, invitant au repos collectif.',
            "durationMinutes" = 2,
            "contentLines" = ARRAY['Mamaivay ny tongotray,', 'Mamaivay ny tongotro ;', 'Nihazakazaka tontolo andro,', 'Nilalao teny an-tokontany.', '', 'Raha marary asiana fanafody,', 'Ipetraho eo amin''ny tsihy malefaka,', 'Aoka izay ny fihazakazahana,', 'Fa efa mody ny masoandro !']::TEXT[],
            "references" = ARRAY['Lalaon''ny ankizy eny ambanivohitra', 'ARB Music']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Lalao', 'Fihetsika', 'Tongotra', 'Fampiononana']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-11' OR "slug" = 'mamaivay-ny-tongotro';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-11', 'mamaivay-ny-tongotro', 'Mamaivay ny tongotro', 'Mes petits pieds sont fatigués', 'Lalaon-jaza nentim-paharazana', 'Formulette chantée à la fin des courses et rondes d''enfants lorsque la fatigue se fait sentir, invitant au repos collectif.', 2,
            ARRAY['Mamaivay ny tongotray,', 'Mamaivay ny tongotro ;', 'Nihazakazaka tontolo andro,', 'Nilalao teny an-tokontany.', '', 'Raha marary asiana fanafody,', 'Ipetraho eo amin''ny tsihy malefaka,', 'Aoka izay ny fihazakazahana,', 'Fa efa mody ny masoandro !']::TEXT[], ARRAY['Lalaon''ny ankizy eny ambanivohitra', 'ARB Music']::TEXT[], ARRAY['Tsianjery', 'Lalao', 'Fihetsika', 'Tongotra', 'Fampiononana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-12' OR "slug" = 'indreto-voronkely-ao-an-tsaha') THEN
        UPDATE "recitations" SET
            "title" = 'Indreto voronkely ao an-tsaha',
            "titleFr" = 'Les petits oiseaux de la plaine',
            "author" = 'Lovantsofina nentim-paharazana',
            "description" = 'Poésie enfantine rythmée célébrant les oiseaux qui s''envolent et jouent ensemble dans les rizières au lever du jour.',
            "durationMinutes" = 2,
            "contentLines" = ARRAY['Indreto voronkely,', 'Mifankahita ao an-tsaha ;', 'Somary mitosy kely,', 'Mifampitsiky, mifampiza.', '', 'Manao fangalampiery,', 'Mifaninana mifampijery ;', 'Aiza ny elatrao ry namako,', 'Mba hisidinantsika mankany an-danitra ?']::TEXT[],
            "references" = ARRAY['Tononkalo nentim-paharazana ho an''ny ankizy']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Vorona', 'Zavaboary', 'Hira', 'Tsiky']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-12' OR "slug" = 'indreto-voronkely-ao-an-tsaha';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-12', 'indreto-voronkely-ao-an-tsaha', 'Indreto voronkely ao an-tsaha', 'Les petits oiseaux de la plaine', 'Lovantsofina nentim-paharazana', 'Poésie enfantine rythmée célébrant les oiseaux qui s''envolent et jouent ensemble dans les rizières au lever du jour.', 2,
            ARRAY['Indreto voronkely,', 'Mifankahita ao an-tsaha ;', 'Somary mitosy kely,', 'Mifampitsiky, mifampiza.', '', 'Manao fangalampiery,', 'Mifaninana mifampijery ;', 'Aiza ny elatrao ry namako,', 'Mba hisidinantsika mankany an-danitra ?']::TEXT[], ARRAY['Tononkalo nentim-paharazana ho an''ny ankizy']::TEXT[], ARRAY['Tsianjery', 'Vorona', 'Zavaboary', 'Hira', 'Tsiky']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-13' OR "slug" = 'ny-andro-fito-aminny-herinandro') THEN
        UPDATE "recitations" SET
            "title" = 'Ny andro fito amin''ny herinandro',
            "titleFr" = 'Les sept jours de la semaine',
            "author" = 'Fampianarana Malagasy',
            "description" = 'Récitation mnémotechnique permettant aux élèves d''assimiler l''ordre et le rythme des sept jours de la semaine en malgache.',
            "durationMinutes" = 2,
            "contentLines" = ARRAY['Alatsinainy fanombohan''ny asa,', 'Talata fiezahana lalandava,', 'Alarobia antenatenan''ny herinandro,', 'Alakamisy fanohizana ny ezaka.', '', 'Zoma mahafinaritra mialoha ny faran''ny herinandro,', 'Asabotsy fiantsenana sy fitsangatsanganana,', 'Alahady fitsaharana sy firaisankina,', 'Izany no andro fito mandrafitra ny herinandrontsika !']::TEXT[],
            "references" = ARRAY['Fandaharam-pianarana Fanabeazana fototra Malagasy']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Herinandro', 'Andro', 'Fianarana', 'Fotoana']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-13' OR "slug" = 'ny-andro-fito-aminny-herinandro';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-13', 'ny-andro-fito-aminny-herinandro', 'Ny andro fito amin''ny herinandro', 'Les sept jours de la semaine', 'Fampianarana Malagasy', 'Récitation mnémotechnique permettant aux élèves d''assimiler l''ordre et le rythme des sept jours de la semaine en malgache.', 2,
            ARRAY['Alatsinainy fanombohan''ny asa,', 'Talata fiezahana lalandava,', 'Alarobia antenatenan''ny herinandro,', 'Alakamisy fanohizana ny ezaka.', '', 'Zoma mahafinaritra mialoha ny faran''ny herinandro,', 'Asabotsy fiantsenana sy fitsangatsanganana,', 'Alahady fitsaharana sy firaisankina,', 'Izany no andro fito mandrafitra ny herinandrontsika !']::TEXT[], ARRAY['Fandaharam-pianarana Fanabeazana fototra Malagasy']::TEXT[], ARRAY['Tsianjery', 'Herinandro', 'Andro', 'Fianarana', 'Fotoana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-14' OR "slug" = 'mahaiza-misaotra-') THEN
        UPDATE "recitations" SET
            "title" = 'Mahaiza misaotra !',
            "titleFr" = 'Sache dire merci ! (L''apprentissage du respect)',
            "author" = 'Lovantsofina sy Fahendrena',
            "description" = 'Tsianjery classique inculquant aux enfants les règles sacrées de la gratitude et du respect envers les aînés et la communauté.',
            "durationMinutes" = 2,
            "contentLines" = ARRAY['Raha misy manome anao zavatra,', 'Aza adinoina ny misaotra ;', 'Misaotra tompoko amin''ny fo madio,', 'No mariky ny zaza voataiza tsara.', '', 'Ny fisaorana tsy mampahantra,', 'Fa manokatra ny varavaran''ny fitahiana ;', 'Ny zaza mahay manaja sy misaotra,', 'Lalan-kizorany dia hasoavina !']::TEXT[],
            "references" = ARRAY['Soatoavina Malagasy', 'Fahendren''ny Ntaolo']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Fanajana', 'Fisaorana', 'Fahendrena', 'Fitaizana']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-14' OR "slug" = 'mahaiza-misaotra-';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-14', 'mahaiza-misaotra-', 'Mahaiza misaotra !', 'Sache dire merci ! (L''apprentissage du respect)', 'Lovantsofina sy Fahendrena', 'Tsianjery classique inculquant aux enfants les règles sacrées de la gratitude et du respect envers les aînés et la communauté.', 2,
            ARRAY['Raha misy manome anao zavatra,', 'Aza adinoina ny misaotra ;', 'Misaotra tompoko amin''ny fo madio,', 'No mariky ny zaza voataiza tsara.', '', 'Ny fisaorana tsy mampahantra,', 'Fa manokatra ny varavaran''ny fitahiana ;', 'Ny zaza mahay manaja sy misaotra,', 'Lalan-kizorany dia hasoavina !']::TEXT[], ARRAY['Soatoavina Malagasy', 'Fahendren''ny Ntaolo']::TEXT[], ARRAY['Tsianjery', 'Fanajana', 'Fisaorana', 'Fahendrena', 'Fitaizana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-15' OR "slug" = 'farimbona-fisarihana-lalao') THEN
        UPDATE "recitations" SET
            "title" = 'Farimbona (Fisarihana lalao)',
            "titleFr" = 'Farimbona (Formulette de tirage au sort)',
            "author" = 'Lalaon''ankizy nentim-paharazana',
            "description" = 'Formulette d''élimination rythmée scandée par les enfants pour désigner impartialement qui tiendra le rôle du chasseur ou du loup.',
            "durationMinutes" = 1,
            "contentLines" = ARRAY['Farimbona e, sari-tany !', 'Iza no hivoaka voalohany ?', 'Tsilopilopy ny kintana eny an-danitra,', 'Manondro ny iray amin''ireo milalao.', '', 'Tonga teo aminao ny anjara,', 'Mivoaha ianao ka aza mitaraiky !']::TEXT[],
            "references" = ARRAY['Lalaon-tokontany nentim-paharazana']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Lalao', 'Fisarihana', 'Ankizy', 'Tokontany']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-15' OR "slug" = 'farimbona-fisarihana-lalao';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-15', 'farimbona-fisarihana-lalao', 'Farimbona (Fisarihana lalao)', 'Farimbona (Formulette de tirage au sort)', 'Lalaon''ankizy nentim-paharazana', 'Formulette d''élimination rythmée scandée par les enfants pour désigner impartialement qui tiendra le rôle du chasseur ou du loup.', 1,
            ARRAY['Farimbona e, sari-tany !', 'Iza no hivoaka voalohany ?', 'Tsilopilopy ny kintana eny an-danitra,', 'Manondro ny iray amin''ireo milalao.', '', 'Tonga teo aminao ny anjara,', 'Mivoaha ianao ka aza mitaraiky !']::TEXT[], ARRAY['Lalaon-tokontany nentim-paharazana']::TEXT[], ARRAY['Tsianjery', 'Lalao', 'Fisarihana', 'Ankizy', 'Tokontany']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-16' OR "slug" = 'tongo-bakana-kilalao-an-tsihy') THEN
        UPDATE "recitations" SET
            "title" = 'Tongo-bakana (Kilalao an-tsihy)',
            "titleFr" = 'Tongo-bakana (Comptine des pieds alignés)',
            "author" = 'Lalaon''ankizy an-trano',
            "description" = 'Jeu traditionnel pratiqué sur la natte où les enfants étendent leurs jambes et replient une à une celle désignée par la comptine.',
            "durationMinutes" = 2,
            "contentLines" = ARRAY['Tongo-bakana, tongo-bakana,', 'Iray, roa, telo, efatra ;', 'Tano mafy ny lohalikao,', 'Sao lasan''ny amboa ny kiraronao !', '', 'Aforeto ny tongotra iray,', 'Mijanona ny iray hafa ;', 'Izay mahatonga hatramin''ny farany,', 'No mpandresy am-pilaminana !']::TEXT[],
            "references" = ARRAY['Lalaon-jaza an-tsihy Malagasy']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Kilalao', 'Tongotra', 'Tsihy', 'Fianakaviana']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-16' OR "slug" = 'tongo-bakana-kilalao-an-tsihy';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-16', 'tongo-bakana-kilalao-an-tsihy', 'Tongo-bakana (Kilalao an-tsihy)', 'Tongo-bakana (Comptine des pieds alignés)', 'Lalaon''ankizy an-trano', 'Jeu traditionnel pratiqué sur la natte où les enfants étendent leurs jambes et replient une à une celle désignée par la comptine.', 2,
            ARRAY['Tongo-bakana, tongo-bakana,', 'Iray, roa, telo, efatra ;', 'Tano mafy ny lohalikao,', 'Sao lasan''ny amboa ny kiraronao !', '', 'Aforeto ny tongotra iray,', 'Mijanona ny iray hafa ;', 'Izay mahatonga hatramin''ny farany,', 'No mpandresy am-pilaminana !']::TEXT[], ARRAY['Lalaon-jaza an-tsihy Malagasy']::TEXT[], ARRAY['Tsianjery', 'Kilalao', 'Tongotra', 'Tsihy', 'Fianakaviana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-17' OR "slug" = 'sari-tany-sy-tsatobato') THEN
        UPDATE "recitations" SET
            "title" = 'Sari-tany sy Tsatobato',
            "titleFr" = 'La marelle et le jet de pierre',
            "author" = 'Lalaon-tokontany Malagasy',
            "description" = 'Chant rythmé accompagnant le jeu traditionnel de marelle tracée sur la terre battue et l''adresse du lancer de pierre.',
            "durationMinutes" = 2,
            "contentLines" = ARRAY['Sariho ny tany amim-pahitsiana,', 'Asio efitra enina mifandimby ;', 'Atsipazo ny vato boribory,', 'Mba tsy hidona amin''ny tsipika.', '', 'Mitsambikina amin''ny tongotra tokana,', 'Mihazona ny fifandanjana tsara ;', 'Lalao madio, lalao mirindra,', 'Mampatanjaka ny vatantsika !']::TEXT[],
            "references" = ARRAY['Lalaon''ny ankizy tamin''ny Ntaolo']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Lalao', 'Tsatobato', 'Sari-tany', 'Hakingana']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-17' OR "slug" = 'sari-tany-sy-tsatobato';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-17', 'sari-tany-sy-tsatobato', 'Sari-tany sy Tsatobato', 'La marelle et le jet de pierre', 'Lalaon-tokontany Malagasy', 'Chant rythmé accompagnant le jeu traditionnel de marelle tracée sur la terre battue et l''adresse du lancer de pierre.', 2,
            ARRAY['Sariho ny tany amim-pahitsiana,', 'Asio efitra enina mifandimby ;', 'Atsipazo ny vato boribory,', 'Mba tsy hidona amin''ny tsipika.', '', 'Mitsambikina amin''ny tongotra tokana,', 'Mihazona ny fifandanjana tsara ;', 'Lalao madio, lalao mirindra,', 'Mampatanjaka ny vatantsika !']::TEXT[], ARRAY['Lalaon''ny ankizy tamin''ny Ntaolo']::TEXT[], ARRAY['Tsianjery', 'Lalao', 'Tsatobato', 'Sari-tany', 'Hakingana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-18' OR "slug" = 'o-ry-rano-mangitsy-') THEN
        UPDATE "recitations" SET
            "title" = 'O ry rano mangitsy !',
            "titleFr" = 'Ô eau fraîche de la source (Chant Sakalava / Bara)',
            "author" = 'Lovantsofina Tatsimo sy Andrefana',
            "description" = 'Comptine chantée au bord des rivières et sources d''eau de l''Ouest et du Sud malgache par les enfants venant puiser de l''eau.',
            "durationMinutes" = 2,
            "contentLines" = ARRAY['O ry rano, rano mangitsy e !', 'Avy any an-tendrombohitra mikoriana ;', 'Manome aina ny tany karankaina,', 'Mampitony ny hetahetan''ny mpandalo.', '', 'Madio mangarangarana toy ny fitaratra,', 'Hanosoranay ny tavaranay vao maraina ;', 'Isaorana ny Razana nanome ny loharano,', 'Tsy ritra mandrakizay !']::TEXT[],
            "references" = ARRAY['Haisoratra am-bava any amin''ny faritra Andrefana sy Atsimo']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Rano', 'Zavaboary', 'Sakalava', 'Tsimo']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-18' OR "slug" = 'o-ry-rano-mangitsy-';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-18', 'o-ry-rano-mangitsy-', 'O ry rano mangitsy !', 'Ô eau fraîche de la source (Chant Sakalava / Bara)', 'Lovantsofina Tatsimo sy Andrefana', 'Comptine chantée au bord des rivières et sources d''eau de l''Ouest et du Sud malgache par les enfants venant puiser de l''eau.', 2,
            ARRAY['O ry rano, rano mangitsy e !', 'Avy any an-tendrombohitra mikoriana ;', 'Manome aina ny tany karankaina,', 'Mampitony ny hetahetan''ny mpandalo.', '', 'Madio mangarangarana toy ny fitaratra,', 'Hanosoranay ny tavaranay vao maraina ;', 'Isaorana ny Razana nanome ny loharano,', 'Tsy ritra mandrakizay !']::TEXT[], ARRAY['Haisoratra am-bava any amin''ny faritra Andrefana sy Atsimo']::TEXT[], ARRAY['Tsianjery', 'Rano', 'Zavaboary', 'Sakalava', 'Tsimo']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-19' OR "slug" = 'akoho-kely-vao-maraina') THEN
        UPDATE "recitations" SET
            "title" = 'Akoho kely vao maraina',
            "titleFr" = 'Le petit poussin au point du jour',
            "author" = 'Lovantsofina tontolo ambanivohitra',
            "description" = 'Comptine matinale décrivant le réveil de la cour de ferme avec le cri du coq et la quête de grains des poussins.',
            "durationMinutes" = 2,
            "contentLines" = ARRAY['Kokoriko ! hoy ny akoholahy,', 'Mifohaza ianareo fa maraina ny andro !', 'Mivoaka ny akoho kely mibitaka,', 'Mitady kankana sy vary amin''ny tany.', '', 'Tsy misy kamo eo an-tokontany,', 'Samy miasa sy mikaroka ny anjarany ;', 'Ny zaza hendry mifoha maraina,', 'Miborosy nify sy miomana hianatra !']::TEXT[],
            "references" = ARRAY['Fampianarana an-kira ho an''ny zaza madinika']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Akoho', 'Maraina', 'Ambanivohitra', 'Biby']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-19' OR "slug" = 'akoho-kely-vao-maraina';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-19', 'akoho-kely-vao-maraina', 'Akoho kely vao maraina', 'Le petit poussin au point du jour', 'Lovantsofina tontolo ambanivohitra', 'Comptine matinale décrivant le réveil de la cour de ferme avec le cri du coq et la quête de grains des poussins.', 2,
            ARRAY['Kokoriko ! hoy ny akoholahy,', 'Mifohaza ianareo fa maraina ny andro !', 'Mivoaka ny akoho kely mibitaka,', 'Mitady kankana sy vary amin''ny tany.', '', 'Tsy misy kamo eo an-tokontany,', 'Samy miasa sy mikaroka ny anjarany ;', 'Ny zaza hendry mifoha maraina,', 'Miborosy nify sy miomana hianatra !']::TEXT[], ARRAY['Fampianarana an-kira ho an''ny zaza madinika']::TEXT[], ARRAY['Tsianjery', 'Akoho', 'Maraina', 'Ambanivohitra', 'Biby']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-20' OR "slug" = 'bombo-sigarety-tsingerinny-vatomamy') THEN
        UPDATE "recitations" SET
            "title" = 'Bômbô sigarety (Tsingerin''ny vatomamy)',
            "titleFr" = 'Bonbons cigarettes (Comptine des récréations)',
            "author" = 'Lalaon''ankizy an-tsekoly',
            "description" = 'Comptine malicieuse et rythmée des cours de récréation, évoquant les petites friandises traditionnelles partagées entre camarades.',
            "durationMinutes" = 2,
            "contentLines" = ARRAY['Bômbô sigarety mamy ery,', 'Zaitra kely amidy eny an-dalana ;', 'Mifampizara amin''ny mpinamana,', 'Mba ho mamy ny fiarahana.', '', 'Iray ho anao, iray ho ahy,', 'Tsy misy manao fitia kely ;', 'Rehefa tapitra ny fakan-drivotra,', 'Dia miverina mamonjy kilasy am-pifaliana !']::TEXT[],
            "references" = ARRAY['Mbolatiana - Rondes et comptines de Madagascar', 'Fahatsiarovana ny kilalaon''ny ankizy']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Lalao', 'Sekoly', 'Vatomamy', 'Fiarahana']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-20' OR "slug" = 'bombo-sigarety-tsingerinny-vatomamy';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-20', 'bombo-sigarety-tsingerinny-vatomamy', 'Bômbô sigarety (Tsingerin''ny vatomamy)', 'Bonbons cigarettes (Comptine des récréations)', 'Lalaon''ankizy an-tsekoly', 'Comptine malicieuse et rythmée des cours de récréation, évoquant les petites friandises traditionnelles partagées entre camarades.', 2,
            ARRAY['Bômbô sigarety mamy ery,', 'Zaitra kely amidy eny an-dalana ;', 'Mifampizara amin''ny mpinamana,', 'Mba ho mamy ny fiarahana.', '', 'Iray ho anao, iray ho ahy,', 'Tsy misy manao fitia kely ;', 'Rehefa tapitra ny fakan-drivotra,', 'Dia miverina mamonjy kilasy am-pifaliana !']::TEXT[], ARRAY['Mbolatiana - Rondes et comptines de Madagascar', 'Fahatsiarovana ny kilalaon''ny ankizy']::TEXT[], ARRAY['Tsianjery', 'Lalao', 'Sekoly', 'Vatomamy', 'Fiarahana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-21' OR "slug" = 'tsipatsipa-drano-eny-an-driaka') THEN
        UPDATE "recitations" SET
            "title" = 'Tsipatsipa-drano eny an-driaka',
            "titleFr" = 'Bataille d''eau dans la rivière',
            "author" = 'Lalaon-jaza eny ambanivohitra',
            "description" = 'Chant joyeux entonné lors des baignades collectives dans les rivières et canaux d''irrigation à la saison chaude.',
            "durationMinutes" = 2,
            "contentLines" = ARRAY['Tsipatsipa-drano mangatsika,', 'Mifampitsipitsipy rano madio ;', 'Mihomehy sy miriaria,', 'Tsy matahotra lena izahay !', '', 'Ny rano mikoriana mitondra hafaliana,', 'Manasa ny havizanana rehetra ;', 'Rehefa milentika ny masoandro,', 'Dia miala amin''ny rano ka mody an-trano !']::TEXT[],
            "references" = ARRAY['Fomban-drazana sy lalaon-jaza an-drano']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Rano', 'Lalao', 'Mifaly', 'Fianakaviana']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-21' OR "slug" = 'tsipatsipa-drano-eny-an-driaka';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-21', 'tsipatsipa-drano-eny-an-driaka', 'Tsipatsipa-drano eny an-driaka', 'Bataille d''eau dans la rivière', 'Lalaon-jaza eny ambanivohitra', 'Chant joyeux entonné lors des baignades collectives dans les rivières et canaux d''irrigation à la saison chaude.', 2,
            ARRAY['Tsipatsipa-drano mangatsika,', 'Mifampitsipitsipy rano madio ;', 'Mihomehy sy miriaria,', 'Tsy matahotra lena izahay !', '', 'Ny rano mikoriana mitondra hafaliana,', 'Manasa ny havizanana rehetra ;', 'Rehefa milentika ny masoandro,', 'Dia miala amin''ny rano ka mody an-trano !']::TEXT[], ARRAY['Fomban-drazana sy lalaon-jaza an-drano']::TEXT[], ARRAY['Tsianjery', 'Rano', 'Lalao', 'Mifaly', 'Fianakaviana']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "recitations" WHERE "id" = 'recitation-22' OR "slug" = 'lalana-mankaiza-ry-zandry-') THEN
        UPDATE "recitations" SET
            "title" = 'Lalana mankaiza ry zandry ?',
            "titleFr" = 'Où mène ce sentier, cher cadet ?',
            "author" = 'Lovantsofina Fahendrena sy Zokiolona',
            "description" = 'Dialogue rimé traditionnel entre un aîné et un cadet marchant sur les chemins de crête, métaphore du chemin de la vie et du discernement.',
            "durationMinutes" = 2,
            "contentLines" = ARRAY['– Lalana mankaiza ity lalan-kely ity ?', '– Mankany an-tanàna misy ny fihavanana !', '– Inona no entinao hamonjena azy ?', '– Fo madio sy fitiavana marina !', '', '– Raha sendra vatovato sy sakana eny an-dalana ?', '– Hifanampy sy hifandray tanana izahay !', '– Mandehana amim-piadanana ry zandry,', 'Fa ny lalan''ny marina tsy mba mahavery !']::TEXT[],
            "references" = ARRAY['Hain-teny sy fahendrena fitaizana ny zaza Malagasy']::TEXT[],
            "tags" = ARRAY['Tsianjery', 'Lalana', 'Fanabeazana', 'Fihavanana', 'Zoky sy Zandry']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'recitation-22' OR "slug" = 'lalana-mankaiza-ry-zandry-';
    ELSE
        INSERT INTO "recitations" (
            "id", "slug", "title", "titleFr", "author", "description", "durationMinutes",
            "contentLines", "references", "tags", "status", "isPremium", "isFeatured",
            "viewCount", "likesCount", "shareCount", "reportCount", "createdAt", "updatedAt"
        ) VALUES (
            'recitation-22', 'lalana-mankaiza-ry-zandry-', 'Lalana mankaiza ry zandry ?', 'Où mène ce sentier, cher cadet ?', 'Lovantsofina Fahendrena sy Zokiolona', 'Dialogue rimé traditionnel entre un aîné et un cadet marchant sur les chemins de crête, métaphore du chemin de la vie et du discernement.', 2,
            ARRAY['– Lalana mankaiza ity lalan-kely ity ?', '– Mankany an-tanàna misy ny fihavanana !', '– Inona no entinao hamonjena azy ?', '– Fo madio sy fitiavana marina !', '', '– Raha sendra vatovato sy sakana eny an-dalana ?', '– Hifanampy sy hifandray tanana izahay !', '– Mandehana amim-piadanana ry zandry,', 'Fa ny lalan''ny marina tsy mba mahavery !']::TEXT[], ARRAY['Hain-teny sy fahendrena fitaizana ny zaza Malagasy']::TEXT[], ARRAY['Tsianjery', 'Lalana', 'Fanabeazana', 'Fihavanana', 'Zoky sy Zandry']::TEXT[], 'PUBLISHED'::"ContentStatus", false, true,
            0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;
END $$;

-- ============================================================================
-- 2. OHABOLANA / PROVERBES MALGACHES ENRICHIS (88 NOUVEAUX PROVERBES)
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-200' OR "slug" = 'ny-fihavanana-toy-ny-landy-maty-ifonosana-velon' OR LOWER("malagasy") = LOWER('Ny fihavanana toy ny landy : maty ifonosana, velona itafiana, ary ny madilana harahim-panondro')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'La fraternité est comme la soie : à la mort on s''en enveloppe, durant la vie on s''en vêt, et là où le fil s''amincit on le soutient du doigt',
            "meaning" = 'Le lien de parenté accompagne l''être humain du berceau jusqu''au tombeau ; lorsqu''une discorde menace de le fragiliser, chacun doit y apporter un soin attentif et délicat pour le réparer.',
            "example" = 'Cité lors des réconciliations familiales ou des discours de mariage pour sceller l''union et la patience mutuelle.',
            "origins" = ARRAY['Merina', 'Betsileo']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-200' OR "slug" = 'ny-fihavanana-toy-ny-landy-maty-ifonosana-velon' OR LOWER("malagasy") = LOWER('Ny fihavanana toy ny landy : maty ifonosana, velona itafiana, ary ny madilana harahim-panondro');
    ELSE
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
        );
    END IF;
END $$;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Hauts-Plateaux', 'Ny fihavanana toy ny landy : raha madilana tohizana', 'proverbID-200', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-200' AND "dialectName" = 'Hauts-Plateaux'
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-201' OR "slug" = 'tondro-tokana-tsy-mahazo-hao' OR LOWER("malagasy") = LOWER('Tondro tokana tsy mahazo hao')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Un seul doigt ne peut attraper un pou',
            "meaning" = 'Une personne isolée ne peut venir à bout d''une tâche complexe ou d''un ennemi rusé ; seule la conjugaison des efforts permet le succès.',
            "example" = 'Formule populaire invoquée pour mobiliser les villageois lors des travaux d''intérêt commun (valin-tanana).',
            "origins" = ARRAY['Betsileo', 'Merina', 'Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-201' OR "slug" = 'tondro-tokana-tsy-mahazo-hao' OR LOWER("malagasy") = LOWER('Tondro tokana tsy mahazo hao');
    ELSE
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
        );
    END IF;
END $$;
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

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-202' OR "slug" = 'ny-hevitry-ny-maro-mahataka-davitra' OR LOWER("malagasy") = LOWER('Ny hevitry ny maro mahataka-davitra')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'La réflexion commune porte loin',
            "meaning" = 'Le dialogue et la délibération collective permettent de trouver des solutions plus justes, plus durables et plus perspicaces que la seule intuition individuelle.',
            "example" = 'Rappelé au début d''un fokonolona ou d''une assemblée délibérative pour solliciter l''avis des aînés et des jeunes.',
            "origins" = ARRAY['Merina', 'Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-202' OR "slug" = 'ny-hevitry-ny-maro-mahataka-davitra' OR LOWER("malagasy") = LOWER('Ny hevitry ny maro mahataka-davitra');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-203' OR "slug" = 'ady-lova-ady-fananana-fa-tsarovy-ny-fihavanana' OR LOWER("malagasy") = LOWER('Ady lova, ady fananana ; fa tsarovy ny fihavanana')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Disputes d''héritage, querelles de biens ; mais n''oubliez jamais les liens du sang',
            "meaning" = 'Même au cœur des différends matériels les plus épineux, il ne faut jamais porter atteinte définitive à la fraternité qui lie les héritiers.',
            "example" = 'Conseil paternel prodigué aux enfants lors de la transmission des terres et des rizières.',
            "origins" = ARRAY['Général', 'Merina']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-203' OR "slug" = 'ady-lova-ady-fananana-fa-tsarovy-ny-fihavanana' OR LOWER("malagasy") = LOWER('Ady lova, ady fananana ; fa tsarovy ny fihavanana');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-204' OR "slug" = 'raha-rano-no-taitra-mamaky-fefiloha-fa-raha-fo' OR LOWER("malagasy") = LOWER('Raha rano no taitra, mamaky fefiloha ; fa raha fo no taitra, maharava fihavanana')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Quand l''eau s''agite, elle brise les digues ; mais quand le cœur s''emporte, il détruit la parenté',
            "meaning" = 'La colère non maîtrisée a des conséquences dévastatrices sur les liens sociaux, bien plus graves qu''une inondation matérielle réparable.',
            "example" = 'Admonestation prononcée par les sages pour calmer deux interlocuteurs emportés par la dispute.',
            "origins" = ARRAY['Merina', 'Betsileo']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-204' OR "slug" = 'raha-rano-no-taitra-mamaky-fefiloha-fa-raha-fo' OR LOWER("malagasy") = LOWER('Raha rano no taitra, mamaky fefiloha ; fa raha fo no taitra, maharava fihavanana');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-205' OR "slug" = 'izay-iray-vatsy-iray-aina' OR LOWER("malagasy") = LOWER('Izay iray vatsy, iray aina')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Ceux qui partagent les mêmes provisions partagent le même souffle de vie',
            "meaning" = 'Partager sa nourriture et ses ressources crée un pacte sacré de solidarité et d''assistance mutuelle indéfectible.',
            "example" = 'Prononcé lors des voyages en groupe, des expéditions ou des repas communautaires.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-205' OR "slug" = 'izay-iray-vatsy-iray-aina' OR LOWER("malagasy") = LOWER('Izay iray vatsy, iray aina');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-206' OR "slug" = 'ny-fihavanana-toy-ny-vomanga-mitsimoka-ao-an-tan' OR LOWER("malagasy") = LOWER('Ny fihavanana toy ny vomanga : mitsimoka ao an-tany ka tsy hita ny lohany sy ny vodiny')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'La parenté est comme la patate douce : elle ramifie sous terre sans qu''on en distingue le commencement de la fin',
            "meaning" = 'Les ramifications généalogiques et les alliances traditionnelles relient tous les membres de la communauté de façon profonde et inextricable.',
            "example" = 'Utilisé lors de la découverte de liens familiaux éloignés entre personnes qui se croyaient étrangères.',
            "origins" = ARRAY['Betsileo', 'Merina']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-206' OR "slug" = 'ny-fihavanana-toy-ny-vomanga-mitsimoka-ao-an-tan' OR LOWER("malagasy") = LOWER('Ny fihavanana toy ny vomanga : mitsimoka ao an-tany ka tsy hita ny lohany sy ny vodiny');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-207' OR "slug" = 'aza-manao-fihavanamborona-maneno-raha-mahita-vok' OR LOWER("malagasy") = LOWER('Aza manao fihavanamborona : maneno raha mahita vokatra, fa mangina raha sendra ny manify')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'N''ayez pas une amitié d''oiseau : gazouillant devant les fruits mûrs, silencieux quand survient la disette',
            "meaning" = 'Il faut dénoncer les amis hypocrites qui ne se manifestent que dans l''abondance et disparaissent dès que surviennent les temps difficiles.',
            "example" = 'Mise en garde contre les flagorneurs et les compagnons d''intérêt.',
            "origins" = ARRAY['Merina']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-207' OR "slug" = 'aza-manao-fihavanamborona-maneno-raha-mahita-vok' OR LOWER("malagasy") = LOWER('Aza manao fihavanamborona : maneno raha mahita vokatra, fa mangina raha sendra ny manify');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-208' OR "slug" = 'hazo-tokana-maniry-an-tany-tsara-na-tsy-ala-aza' OR LOWER("malagasy") = LOWER('Hazo tokana maniry an-tany tsara : na tsy ala aza, mahatahotra')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Un arbre solitaire poussant sur un sol fertile : même s''il n''est pas forêt, il impose le respect',
            "meaning" = 'Une personne juste, bien instruite et solide dans ses principes possède une autorité morale remarquable, même lorsqu''elle agit seule.',
            "example" = 'Éloge adressé à un individu intègre qui défend la justice malgré l''adversité.',
            "origins" = ARRAY['Hauts-Plateaux']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-208' OR "slug" = 'hazo-tokana-maniry-an-tany-tsara-na-tsy-ala-aza' OR LOWER("malagasy") = LOWER('Hazo tokana maniry an-tany tsara : na tsy ala aza, mahatahotra');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-209' OR "slug" = 'ny-teny-toy-ny-atody-raha-latsaka-ka-vaky-tsy-a' OR LOWER("malagasy") = LOWER('Ny teny toy ny atody : raha latsaka ka vaky, tsy azo tononina intsony')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'La parole est comme un œuf : tombé et brisé, on ne peut plus le reconstituer',
            "meaning" = 'Une parole blessante ou mensongère échappée de la bouche provoque des torts irréparables. La prudence verbale s''impose en toute circonstance.',
            "example" = 'Conseil récurrent dans les kabary traditionnels pour inviter les orateurs à peser chaque terme.',
            "origins" = ARRAY['Merina', 'Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-209' OR "slug" = 'ny-teny-toy-ny-atody-raha-latsaka-ka-vaky-tsy-a' OR LOWER("malagasy") = LOWER('Ny teny toy ny atody : raha latsaka ka vaky, tsy azo tononina intsony');
    ELSE
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
        );
    END IF;
END $$;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Sakalava', 'Ny vola misy latsaka azo alaina, fa ny vava mivoaka tsy azo ampidirina', 'proverbID-209', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-209' AND "dialectName" = 'Sakalava'
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-210' OR "slug" = 'ny-fanahy-no-olona' OR LOWER("malagasy") = LOWER('Ny fanahy no olona')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'C''est l''âme et la conscience morale qui font l''être humain',
            "meaning" = 'La valeur d''un être ne réside ni dans son apparence physique, ni dans ses richesses matérielles, mais dans sa droiture morale, sa bienveillance et son esprit.',
            "example" = 'Proverbe fondamental et maxime morale suprême de la philosophie malgache.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-210' OR "slug" = 'ny-fanahy-no-olona' OR LOWER("malagasy") = LOWER('Ny fanahy no olona');
    ELSE
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
        );
    END IF;
END $$;
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

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-211' OR "slug" = 'ny-marina-mitombina-toy-ny-vatolampy' OR LOWER("malagasy") = LOWER('Ny marina mitombina toy ny vatolampy')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'La vérité demeure inébranlable comme le rocher',
            "meaning" = 'Le mensonge et les rumeurs finissent par s''effondrer d''eux-mêmes avec le temps, tandis que la vérité reste debout et immuable face aux tempêtes.',
            "example" = 'Cité lors des jugements coutumiers pour rassurer la partie sincère face aux calomnies.',
            "origins" = ARRAY['Merina', 'Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-211' OR "slug" = 'ny-marina-mitombina-toy-ny-vatolampy' OR LOWER("malagasy") = LOWER('Ny marina mitombina toy ny vatolampy');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-212' OR "slug" = 'aza-manao-vava-manidina-ka-ny-tongotra-no-mikarap' OR LOWER("malagasy") = LOWER('Aza manao vava manidina, ka ny tongotra no mikarapoka')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Ne parlez pas comme si vous voliez haut, pour trébucher ensuite des pieds',
            "meaning" = 'Il faut éviter la jactance, les vantardises et les promesses démesurées qu''on est incapable d''assumer dans les actes concrets.',
            "example" = 'Critique constructive à l''égard de ceux qui se vantent avant même d''avoir agi.',
            "origins" = ARRAY['Hauts-Plateaux']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-212' OR "slug" = 'aza-manao-vava-manidina-ka-ny-tongotra-no-mikarap' OR LOWER("malagasy") = LOWER('Aza manao vava manidina, ka ny tongotra no mikarapoka');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-213' OR "slug" = 'ny-teny-malefaka-manamora-ny-mafy-ary-ny-teny-mas' OR LOWER("malagasy") = LOWER('Ny teny malefaka manamora ny mafy, ary ny teny masiaka manasarotra ny tsotra')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'La parole douce adoucit ce qui est dur, tandis que le mot acerbe complique ce qui était simple',
            "meaning" = 'La diplomatie, la courtoisie et la modération permettent de dénouer les conflits les plus complexes, alors que l''agressivité envenime les moindres malentendus.',
            "example" = 'Maxime diplomatique utilisée par les médiateurs (mpanelana) dans les pourparlers communautaires.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-213' OR "slug" = 'ny-teny-malefaka-manamora-ny-mafy-ary-ny-teny-mas' OR LOWER("malagasy") = LOWER('Ny teny malefaka manamora ny mafy, ary ny teny masiaka manasarotra ny tsotra');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-214' OR "slug" = 'aza-mandrora-mitsilany-sao-mahavoa-tena' OR LOWER("malagasy") = LOWER('Aza mandrora mitsilany, sao mahavoa tena')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Ne crachez pas en l''air couché sur le dos, de peur que cela ne vous retombe au visage',
            "meaning" = 'Toute action malveillante, médisance ou complot ourdi contre autrui finit inévitablement par se retourner contre son auteur.',
            "example" = 'Avertissement solennel contre la trahison et les coups bas dans la vie sociale.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-214' OR "slug" = 'aza-mandrora-mitsilany-sao-mahavoa-tena' OR LOWER("malagasy") = LOWER('Aza mandrora mitsilany, sao mahavoa tena');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-215' OR "slug" = 'ny-lalan-kely-tsy-azo-anariana-vato-sao-lalovann' OR LOWER("malagasy") = LOWER('Ny lalan-kely tsy azo anariana vato, sao lalovan''ny tena maraina')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Ne jetez pas de pierres sur le sentier, car vous pourriez l''emprunter vous-même au matin',
            "meaning" = 'Il ne faut jamais saboter l''avenir ou nuire à ceux dont on pourrait avoir besoin demain ; la vie est un cycle imprévisible.',
            "example" = 'Rappel à la prudence lorsqu''on quitte un emploi, un village ou des partenaires.',
            "origins" = ARRAY['Betsileo', 'Merina']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-215' OR "slug" = 'ny-lalan-kely-tsy-azo-anariana-vato-sao-lalovann' OR LOWER("malagasy") = LOWER('Ny lalan-kely tsy azo anariana vato, sao lalovan''ny tena maraina');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-216' OR "slug" = 'izay-hendry-mianatra-aminny-hadisoanny-hafa-ny' OR LOWER("malagasy") = LOWER('Izay hendry mianatra amin''ny hadisoan''ny hafa, ny adala kosa miandry ny fahavoazany')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le sage s''instruit des erreurs d''autrui, tandis que l''insensé attend son propre malheur pour comprendre',
            "meaning" = 'L''intelligence consiste à observer l''expérience des devanciers pour s''épargner des souffrances inutiles.',
            "example" = 'Leçon d''éducation donnée aux adolescents pour les prémunir contre les pièges de l''imprudence.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-216' OR "slug" = 'izay-hendry-mianatra-aminny-hadisoanny-hafa-ny' OR LOWER("malagasy") = LOWER('Izay hendry mianatra amin''ny hadisoan''ny hafa, ny adala kosa miandry ny fahavoazany');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-217' OR "slug" = 'ny-fahanginana-no-fiarovanny-hendry-ary-ny-resak' OR LOWER("malagasy") = LOWER('Ny fahanginana no fiarovan''ny hendry, ary ny resaka maro no fandriky ny adala')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le silence est le rempart du sage, et le bavardage inconsidéré le piège de l''insensé',
            "meaning" = 'Savoir écouter et retenir sa langue permet d''analyser la situation avec clarté et d''éviter les pièges de la précipitation verbale.',
            "example" = 'Éloge du calme et de la retenue au cours d''une négociation tendue.',
            "origins" = ARRAY['Merina', 'Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-217' OR "slug" = 'ny-fahanginana-no-fiarovanny-hendry-ary-ny-resak' OR LOWER("malagasy") = LOWER('Ny fahanginana no fiarovan''ny hendry, ary ny resaka maro no fandriky ny adala');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-218' OR "slug" = 'aza-manao-fitia-kibon-kisoa-be-fisehona-fa-kely' OR LOWER("malagasy") = LOWER('Aza manao fitia kibon-kisoa : be fisehona fa kely hena')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Ne témoignez pas une amitié semblable à la panse de porc : volumineuse à la vue mais pauvre en viande',
            "meaning" = 'Il convient de fuir les déclarations grandiloquentes et superficielles d''affection qui ne s''accompagnent d''aucun secours concret.',
            "example" = 'Critique des faux soutiens qui prodiguent de belles paroles sans jamais poser d''acte utile.',
            "origins" = ARRAY['Merina']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-218' OR "slug" = 'aza-manao-fitia-kibon-kisoa-be-fisehona-fa-kely' OR LOWER("malagasy") = LOWER('Aza manao fitia kibon-kisoa : be fisehona fa kely hena');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-219' OR "slug" = 'ny-asa-vita-no-ifampitsarana' OR LOWER("malagasy") = LOWER('Ny asa vita no ifampitsarana')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'C''est à l''œuvre accomplie que l''on se juge mutuellement',
            "meaning" = 'Les intentions et les discours ne valent rien devant le résultat concret de l''effort ; seules les réalisations effectives témoignent du mérite.',
            "example" = 'Utilisé lors de la clôture des moissons ou de l''évaluation d''un projet communautaire.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-219' OR "slug" = 'ny-asa-vita-no-ifampitsarana' OR LOWER("malagasy") = LOWER('Ny asa vita no ifampitsarana');
    ELSE
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
        );
    END IF;
END $$;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Betsimisaraka', 'Ny asa vita no ifanjavaña', 'proverbID-219', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-219' AND "dialectName" = 'Betsimisaraka'
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-220' OR "slug" = 'izay-maharitra-vadinantitra' OR LOWER("malagasy") = LOWER('Izay maharitra vadin''antitra')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Celui qui persévère parvient à la vieillesse avec sérénité',
            "meaning" = 'La patience, l''endurance et la régularité dans l''effort permettent de surmonter les épreuves de l''existence et d''atteindre une plénitude respectée.',
            "example" = 'Encouragement adressé à un travailleur, un étudiant ou un artisan confronté à des débuts laborieux.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-220' OR "slug" = 'izay-maharitra-vadinantitra' OR LOWER("malagasy") = LOWER('Izay maharitra vadin''antitra');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-221' OR "slug" = 'ny-kamo-ihany-no-matin-ketaheta-eo-amoron-drano' OR LOWER("malagasy") = LOWER('Ny kamo ihany no matin-ketaheta eo amoron-drano')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Seul le paresseux meurt de soif au bord de la source',
            "meaning" = 'Posséder des opportunités ou vivre entouré de richesses ne sert à rien si l''on ne consent pas à l''effort élémentaire de tendre la main pour les cueillir.',
            "example" = 'Reproche adressé à ceux qui se plaignent du manque de travail tout en refusant les occasions qui se présentent.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-221' OR "slug" = 'ny-kamo-ihany-no-matin-ketaheta-eo-amoron-drano' OR LOWER("malagasy") = LOWER('Ny kamo ihany no matin-ketaheta eo amoron-drano');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-222' OR "slug" = 'aza-manao-kely-tsy-mba-mamindro-lehibe-tsy-mba-mi' OR LOWER("malagasy") = LOWER('Aza manao kely tsy mba mamindro, lehibe tsy mba miasa')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Ne soyez pas enfant refusant de se réchauffer au foyer, ni adulte rechignant au labeur',
            "meaning" = 'Chaque étape de la vie a ses devoirs stricts : la jeunesse doit apprendre docilement et l''âge adulte doit s''adonner au travail productif.',
            "example" = 'Leçon de maturité et d''assiduité répétée aux jeunes générations.',
            "origins" = ARRAY['Merina', 'Betsileo']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-222' OR "slug" = 'aza-manao-kely-tsy-mba-mamindro-lehibe-tsy-mba-mi' OR LOWER("malagasy") = LOWER('Aza manao kely tsy mba mamindro, lehibe tsy mba miasa');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-223' OR "slug" = 'ny-riaka-tsy-miandry-mpantsaka' OR LOWER("malagasy") = LOWER('Ny riaka tsy miandry mpantsaka')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le fleuve en crue n''attend pas le porteur d''eau',
            "meaning" = 'Le cours du temps et les circonstances opportunes ne ralentissent pas pour attendre les retardataires ; il faut agir au moment opportun.',
            "example" = 'Appel pressant à saisir sans délai les saisons agricoles favorables (semis, repiquage).',
            "origins" = ARRAY['Betsileo', 'Merina']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-223' OR "slug" = 'ny-riaka-tsy-miandry-mpantsaka' OR LOWER("malagasy") = LOWER('Ny riaka tsy miandry mpantsaka');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-224' OR "slug" = 'aza-manao-vava-be-fihinam-bary-fa-tanana-zatra-mi' OR LOWER("malagasy") = LOWER('Aza manao vava be fihinam-bary, fa tanana zatra miasa no ananana')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'N''ayez pas seulement une grande bouche pour manger le riz, mais de vaillantes mains habituées à la tâche pour l''obtenir',
            "meaning" = 'Le droit de jouir des fruits de la terre implique le devoir moral d''avoir participé préalablement à leur culture.',
            "example" = 'Rappel à l''ordre convivial lors des repas partagés au village.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-224' OR "slug" = 'aza-manao-vava-be-fihinam-bary-fa-tanana-zatra-mi' OR LOWER("malagasy") = LOWER('Aza manao vava be fihinam-bary, fa tanana zatra miasa no ananana');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-225' OR "slug" = 'tsy-misy-orana-tsy-manala-hetaheta-ny-tany' OR LOWER("malagasy") = LOWER('Tsy misy orana tsy manala hetaheta ny tany')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Il n''est pas de pluie qui n''étanche un tant soit peu la soif de la terre',
            "meaning" = 'Même le travail le plus modeste ou le résultat apparemment infime produit un effet positif et contribue au progrès général.',
            "example" = 'Consolation bienveillante pour valoriser les petits progrès et débuts discrets.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-225' OR "slug" = 'tsy-misy-orana-tsy-manala-hetaheta-ny-tany' OR LOWER("malagasy") = LOWER('Tsy misy orana tsy manala hetaheta ny tany');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-226' OR "slug" = 'ny-taona-mamokatra-tsy-vokatry-ny-torimaso' OR LOWER("malagasy") = LOWER('Ny taona mamokatra tsy vokatry ny torimaso')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Une année d''abondance ne naît pas du sommeil',
            "meaning" = 'Les greniers bien remplis et la prospérité familiale sont le fruit direct des levers matinaux et de la sueur versée aux champs.',
            "example" = 'Adage paysan scandé aux aurores avant le départ pour la rizière.',
            "origins" = ARRAY['Betsileo', 'Merina']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-226' OR "slug" = 'ny-taona-mamokatra-tsy-vokatry-ny-torimaso' OR LOWER("malagasy") = LOWER('Ny taona mamokatra tsy vokatry ny torimaso');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-227' OR "slug" = 'antidahim-bariky-ny-fiainana-izay-tsy-mambokiny' OR LOWER("malagasy") = LOWER('Antidahim-bariky ny fiaiñaña : izay tsy mambokiñy tsy hömaña')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'La vie est comme le vieux maki : qui ne saute pas d''arbre en arbre ne mange pas',
            "meaning" = 'Dans l''existence, le mouvement, l''audace et l''effort quotidien sont la condition absolue de la nourriture et de la subsistance.',
            "example" = 'Proverbe fondamental betsimisaraka cité pour inciter les jeunes au labeur et à la mobilité active.',
            "origins" = ARRAY['Betsimisaraka']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-227' OR "slug" = 'antidahim-bariky-ny-fiainana-izay-tsy-mambokiny' OR LOWER("malagasy") = LOWER('Antidahim-bariky ny fiaiñaña : izay tsy mambokiñy tsy hömaña');
    ELSE
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
        );
    END IF;
END $$;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Merina', 'Ny fiainana toy ny gidro : izay tsy mitsambikina tsy mihinana', 'proverbID-227', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-227' AND "dialectName" = 'Merina'
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-228' OR "slug" = 'kojeja-bi-loha-tsy-laninakoho-boty' OR LOWER("malagasy") = LOWER('Kojeja bi-löha tsy lanin''akôho boty')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le criquet à grosse tête ne peut être avalé par un poussin chétif',
            "meaning" = 'Pour entreprendre un projet ambitieux ou assumer de hautes responsabilités, il faut posséder les moyens, les compétences et l''envergure appropriés.',
            "example" = 'Mise en garde contre la prétention inconsidérée et l''absence de préparation technique.',
            "origins" = ARRAY['Betsimisaraka']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-228' OR "slug" = 'kojeja-bi-loha-tsy-laninakoho-boty' OR LOWER("malagasy") = LOWER('Kojeja bi-löha tsy lanin''akôho boty');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-229' OR "slug" = 'akoho-be-holy-tsy-be-fe' OR LOWER("malagasy") = LOWER('Akôho be holy tsy be fe')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'La poule qui reste immobile sur ses pattes n''a pas de cuisses charnues',
            "meaning" = 'L''inactivité et l''absence de courage ne procurent aucun développement ni aucune richesse matérielle ; seul l''exercice forge la force.',
            "example" = 'Parabole campagnarde illustrant la nécessité de courir et d''agir sans relâche pour prospérer.',
            "origins" = ARRAY['Betsimisaraka']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-229' OR "slug" = 'akoho-be-holy-tsy-be-fe' OR LOWER("malagasy") = LOWER('Akôho be holy tsy be fe');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-230' OR "slug" = 'izay-manginy-volamena' OR LOWER("malagasy") = LOWER('Izay mangiñy, völamena')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Celui qui sait se taire est revêtu d''or',
            "meaning" = 'Dans la culture de l''Est, la retenue, l''écoute silencieuse et l''observation priment toujours sur le bavardage impétueux.',
            "example" = 'Recommandation d''attitude pour les jeunes assistant aux conseils des aînés.',
            "origins" = ARRAY['Betsimisaraka']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-230' OR "slug" = 'izay-manginy-volamena' OR LOWER("malagasy") = LOWER('Izay mangiñy, völamena');
    ELSE
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
        );
    END IF;
END $$;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Merina', 'Ny teny volafotsy, fa ny fahanginana volamena', 'proverbID-230', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-230' AND "dialectName" = 'Merina'
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-231' OR "slug" = 'lalana-vava-tsy-lalana-tongotra-mora-lazainy-fa' OR LOWER("malagasy") = LOWER('Lalaña vava tsy lalaña tongotra : mora lazaiñy fa sarotra fiaiñaña')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le chemin tracé par la bouche n''est pas le sentier foulé par les pieds : facile à énoncer, difficile à parcourir',
            "meaning" = 'Déclarer de nobles intentions ou donner des leçons de morale est aisé ; appliquer rigoureusement ces règles dans sa propre vie exige une volonté de fer.',
            "example" = 'Rappel à la modestie adressé aux donneurs de leçons qui n''éprouvent pas leurs propres conseils.',
            "origins" = ARRAY['Betsimisaraka']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-231' OR "slug" = 'lalana-vava-tsy-lalana-tongotra-mora-lazainy-fa' OR LOWER("malagasy") = LOWER('Lalaña vava tsy lalaña tongotra : mora lazaiñy fa sarotra fiaiñaña');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-232' OR "slug" = 'rivotra-be-tsy-mandrava-hazo-manam-paka-lalina' OR LOWER("malagasy") = LOWER('Rivotra be tsy mandrava hazo manam-paka lalina')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le grand vent de mousson n''abat pas l''arbre aux racines profondes',
            "meaning" = 'L''individu profondément ancré dans sa culture, ses valeurs ancestrales et l''éducation de ses parents résiste à toutes les tempêtes de la vie.',
            "example" = 'Éloge de la fidélité aux coutumes et aux fondations spirituelles lors des périodes de crise.',
            "origins" = ARRAY['Betsimisaraka']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-232' OR "slug" = 'rivotra-be-tsy-mandrava-hazo-manam-paka-lalina' OR LOWER("malagasy") = LOWER('Rivotra be tsy mandrava hazo manam-paka lalina');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-233' OR "slug" = 'fandri-boay-nahavoa-aomby-raha-tsy-tiana-mora-to' OR LOWER("malagasy") = LOWER('Fandri-boay nahavoa aomby : raha tsy tiaña möra tönga')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le piège à crocodile qui capture un bœuf : le malheur survient vite quand on baisse la garde',
            "meaning" = 'L''inattention et la négligence peuvent transformer une mesure de sécurité en désastre imprévu.',
            "example" = 'Conseil de vigilance lors de la manipulation d''engins ou de décisions délicates.',
            "origins" = ARRAY['Betsimisaraka']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-233' OR "slug" = 'fandri-boay-nahavoa-aomby-raha-tsy-tiana-mora-to' OR LOWER("malagasy") = LOWER('Fandri-boay nahavoa aomby : raha tsy tiaña möra tönga');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-234' OR "slug" = 'akanga-maro-tsy-vakinamboa' OR LOWER("malagasy") = LOWER('Akanga maro tsy vakin''amboa')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Une troupe nombreuse de pintades n''est pas dispersée par le chien',
            "meaning" = 'Lorsque les membres d''une communauté se serrent les coudes et restent unis, aucune menace extérieure ne peut entamer leur sérénité.',
            "example" = 'Hymne à la solidarité du clan face aux agressions extérieures.',
            "origins" = ARRAY['Betsimisaraka', 'Hauts-Plateaux']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-234' OR "slug" = 'akanga-maro-tsy-vakinamboa' OR LOWER("malagasy") = LOWER('Akanga maro tsy vakin''amboa');
    ELSE
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
        );
    END IF;
END $$;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Merina', 'Akanga maro tsy vakin''ny amboa', 'proverbID-234', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-234' AND "dialectName" = 'Merina'
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-235' OR "slug" = 'sakalava-very-omby-ka-ny-sisa-no-atao-tsara-hidy' OR LOWER("malagasy") = LOWER('Sakalava very omby ka ny sisa no atao tsara hidy')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le Sakalava qui perd un bœuf veille à cadenasser doublement l''enclos pour ceux qui restent',
            "meaning" = 'L''adversité et les pertes passées doivent servir de leçon pour redoubler de vigilance et protéger les biens précieux qui demeurent.',
            "example" = 'Formule d''expérience énoncée pour encourager la prévoyance après un échec ou un vol.',
            "origins" = ARRAY['Sakalava']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-235' OR "slug" = 'sakalava-very-omby-ka-ny-sisa-no-atao-tsara-hidy' OR LOWER("malagasy") = LOWER('Sakalava very omby ka ny sisa no atao tsara hidy');
    ELSE
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
        );
    END IF;
END $$;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Merina', 'Very omby vao mahatonga vala', 'proverbID-235', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-235' AND "dialectName" = 'Merina'
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-236' OR "slug" = 'tomendry-anabo-kakazo-vatana-fo-aty-fa-jery-jiab' OR LOWER("malagasy") = LOWER('Tomendry añabo kakazo ; vataña fô aty fa jery jiaby aminarô añy')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Perché sur la cime de l''arbre ; le corps seul est ici, mais tout le regard et l''esprit sont auprès des vôtres là-bas',
            "meaning" = 'Même éloigné géographiquement par ses devoirs, le cœur et la sollicitude d''une personne sincère restent attachés aux siens.',
            "example" = 'Salutation chaleureuse et poétique adressée aux proches lors des voyages lointains.',
            "origins" = ARRAY['Sakalava']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-236' OR "slug" = 'tomendry-anabo-kakazo-vatana-fo-aty-fa-jery-jiab' OR LOWER("malagasy") = LOWER('Tomendry añabo kakazo ; vataña fô aty fa jery jiaby aminarô añy');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-237' OR "slug" = 'tia-vady-manompo-rafozana' OR LOWER("malagasy") = LOWER('Tia vady manompo rafozaña')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Qui aime son conjoint se dévoue corps et âme pour ses beaux-parents',
            "meaning" = 'Le mariage dans la tradition malgache ne lie pas deux individus isolés mais deux familles entières : respecter sa belle-famille est la preuve suprême de l''amour conjugal.',
            "example" = 'Conseil traditionnel majeur délivré aux jeunes mariés lors des noces.',
            "origins" = ARRAY['Sakalava', 'Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-237' OR "slug" = 'tia-vady-manompo-rafozana' OR LOWER("malagasy") = LOWER('Tia vady manompo rafozaña');
    ELSE
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
        );
    END IF;
END $$;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Merina', 'Tia vady, manaja rafozana', 'proverbID-237', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-237' AND "dialectName" = 'Merina'
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-238' OR "slug" = 'nahoana-no-ny-betsimisaraka-no-namono-mamba-ka-ny' OR LOWER("malagasy") = LOWER('Nahoana no ny Betsimisaraka no namono mamba, ka ny Sakalava no miravaka ny nifiny ?')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Pourquoi serait-ce le Betsimisaraka qui brave le caïman, et le Sakalava qui se parerait de ses dents ?',
            "meaning" = 'Il est profondément injuste que certains supportent tous les risques et les sueurs du labeur, pendant que d''autres s''arrogent la gloire et les honneurs sans effort.',
            "example" = 'Dénonciation ferme de l''usurpation des mérites dans une œuvre collective.',
            "origins" = ARRAY['Sakalava', 'Betsimisaraka']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-238' OR "slug" = 'nahoana-no-ny-betsimisaraka-no-namono-mamba-ka-ny' OR LOWER("malagasy") = LOWER('Nahoana no ny Betsimisaraka no namono mamba, ka ny Sakalava no miravaka ny nifiny ?');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-239' OR "slug" = 'omby-mahia-tsy-fointsika-omby-matavy-anolona' OR LOWER("malagasy") = LOWER('Omby mahia tsy fointsika, omby matavy an''olona')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le zébu maigre qui nous appartient nous est plus cher que le taureau gras d''autrui',
            "meaning" = 'Il faut chérir et valoriser ses propres biens modestes et les siens, plutôt que de jalouser ou convoiter les fastes trompeurs du voisin.',
            "example" = 'Éloge du contentement et de la fidélité à son modeste patrimoine familial.',
            "origins" = ARRAY['Sakalava', 'Bara']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-239' OR "slug" = 'omby-mahia-tsy-fointsika-omby-matavy-anolona' OR LOWER("malagasy") = LOWER('Omby mahia tsy fointsika, omby matavy an''olona');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-240' OR "slug" = 'ny-fanekena-natao-teo-an-kianja-tsy-ravana-ao-an-' OR LOWER("malagasy") = LOWER('Ny fanekena natao teo an-kianja, tsy ravana ao an-trano')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le pacte conclu sur la place publique ne se dénonce point une fois rentré sous le toit',
            "meaning" = 'La parole donnée et les engagements solennels pris devant la communauté sont sacrés et doivent être honorés sans duplicité.',
            "example" = 'Rappel à l''intégrité et au respect des serments après un accord conclu.',
            "origins" = ARRAY['Sakalava', 'Menabe']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-240' OR "slug" = 'ny-fanekena-natao-teo-an-kianja-tsy-ravana-ao-an-' OR LOWER("malagasy") = LOWER('Ny fanekena natao teo an-kianja, tsy ravana ao an-trano');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-241' OR "slug" = 'ana-tsiriry-tsy-toroan-dagno' OR LOWER("malagasy") = LOWER('Ana-tsiriry tsy toroan-dagno')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le poussin de la sarcelle n''a nul besoin qu''on lui montre la rivière',
            "meaning" = 'Inutile d''enseigner avec condescendance ce qui relève de l''instinct naturel, de la vocation innée ou d''une expérience déjà acquise.',
            "example" = 'S''applique lorsqu''un aîné constate la dextérité spontanée d''un enfant héritant du talent de ses parents.',
            "origins" = ARRAY['Antandroy']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-241' OR "slug" = 'ana-tsiriry-tsy-toroan-dagno' OR LOWER("malagasy") = LOWER('Ana-tsiriry tsy toroan-dagno');
    ELSE
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
        );
    END IF;
END $$;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Merina', 'Zanak''omby tsy ampianarin-domano', 'proverbID-241', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-241' AND "dialectName" = 'Merina'
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-242' OR "slug" = 'izay-manan-tsira-mahay-mahandro' OR LOWER("malagasy") = LOWER('Izay manan-tsira mahay mahandro')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Celui qui possède le sel sait comment réussir le repas',
            "meaning" = 'Pour mener à bien une mission délicate, il est indispensable de disposer des ressources élémentaires et du savoir-faire adéquat.',
            "example" = 'Reconnaissance de la compétence de celui qui dispose des outils appropriés pour résoudre une crise.',
            "origins" = ARRAY['Antandroy']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-242' OR "slug" = 'izay-manan-tsira-mahay-mahandro' OR LOWER("malagasy") = LOWER('Izay manan-tsira mahay mahandro');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-243' OR "slug" = 'ny-mahery-tsy-maody-tsy-ela-velona' OR LOWER("malagasy") = LOWER('Ny mahery tsy maody tsy ela velona')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le fort qui dédaigne la prudence et le discernement ne vit pas longtemps',
            "meaning" = 'La seule puissance musculaire ou l''arrogance bravache sans intelligence ni tempérance conduit tout droit à une fin tragique.',
            "example" = 'Avertissement adressé aux querelleurs qui abusent de leur force physique pour intimider autrui.',
            "origins" = ARRAY['Antandroy']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-243' OR "slug" = 'ny-mahery-tsy-maody-tsy-ela-velona' OR LOWER("malagasy") = LOWER('Ny mahery tsy maody tsy ela velona');
    ELSE
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
        );
    END IF;
END $$;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Merina', 'Ny mahery tsy maody tsy ela velona', 'proverbID-243', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-243' AND "dialectName" = 'Merina'
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-244' OR "slug" = 'tandriondriono-maola-mahazo-ty-marentane' OR LOWER("malagasy") = LOWER('Tandriondriono maola mahazo ty marentane')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'L''agitation aveugle et insensée ne récolte que tourments et désolation',
            "meaning" = 'Agir avec précipitation et sans écouter les avis des personnes avisées entraîne des conséquences douloureuses pour soi et ses proches.',
            "example" = 'Conseil de pondération prodigué face aux réactions impulsives.',
            "origins" = ARRAY['Antandroy']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-244' OR "slug" = 'tandriondriono-maola-mahazo-ty-marentane' OR LOWER("malagasy") = LOWER('Tandriondriono maola mahazo ty marentane');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-245' OR "slug" = 'tagnamboa-tsy-folaka-hevitse' OR LOWER("malagasy") = LOWER('Tagnamboa tsy folaka hevitse')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'L''arbre du grand désert ne manque jamais de souplesse face à la sécheresse',
            "meaning" = 'L''être endurci par les rigueurs de l''environnement apprend l''art de l''adaptation et de l''ingéniosité pour survivre dignement.',
            "example" = 'Célébration de la résilience du peuple du Sud face aux pénuries climatiques.',
            "origins" = ARRAY['Antandroy']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-245' OR "slug" = 'tagnamboa-tsy-folaka-hevitse' OR LOWER("malagasy") = LOWER('Tagnamboa tsy folaka hevitse');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-246' OR "slug" = 'ny-tso-drano-zava-mahery-mahatsara-ny-lalana-dia' OR LOWER("malagasy") = LOWER('Ny tso-drano zava-mahery : mahatsara ny lalana diavin''ny tena')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'La bénédiction des aînés est une force souveraine : elle aplanit la route sous les pas',
            "meaning" = 'La bénédiction paternelle et maternelle reçue d''un cœur pur protège l''individu, conjure le mauvais sort et ouvre les voies du succès.',
            "example" = 'Invoqué solennellement lorsqu''un enfant quitte le toit familial pour ses études ou une nouvelle étape de vie.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-246' OR "slug" = 'ny-tso-drano-zava-mahery-mahatsara-ny-lalana-dia' OR LOWER("malagasy") = LOWER('Ny tso-drano zava-mahery : mahatsara ny lalana diavin''ny tena');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-247' OR "slug" = 'aza-mandika-fefy-natsanganny-ray' OR LOWER("malagasy") = LOWER('Aza mandika fefy natsangan''ny ray')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Ne franchissez pas avec désinvolture la clôture bâtie par vos pères',
            "meaning" = 'Il est du devoir de la jeunesse de respecter les lois morales, les coutumes éprouvées et les délimitations établies par les ancêtres.',
            "example" = 'Rappel à l''ordre coutumier lors des querelles de bornage ou de rupture des traditions sacrées.',
            "origins" = ARRAY['Betsileo', 'Merina']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-247' OR "slug" = 'aza-mandika-fefy-natsanganny-ray' OR LOWER("malagasy") = LOWER('Aza mandika fefy natsangan''ny ray');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-248' OR "slug" = 'ny-loloina-an-doha-tsy-mba-enta-mavesatra-ny-fit' OR LOWER("malagasy") = LOWER('Ny loloina an-doha tsy mba enta-mavesatra : ny fitiavana ny ray aman-dreny')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Ce que l''on porte sur la tête par amour filial ne semble jamais un lourd fardeau',
            "meaning" = 'Prendre soin de ses géniteurs dans leur grand âge n''est pas une corvée pénible, mais une dette sacrée de reconnaissance acquittée avec joie.',
            "example" = 'Exhortation des enfants à veiller sur leurs parents vieillissants avec dévouement.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-248' OR "slug" = 'ny-loloina-an-doha-tsy-mba-enta-mavesatra-ny-fit' OR LOWER("malagasy") = LOWER('Ny loloina an-doha tsy mba enta-mavesatra : ny fitiavana ny ray aman-dreny');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-249' OR "slug" = 'aza-manao-am-bava-malefaka-ka-an-tsaina-misy-lefon' OR LOWER("malagasy") = LOWER('Aza manao am-bava malefaka ka an-tsaina misy lefona')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'N''ayez pas des paroles doucereuses sur les lèvres tout en dissimulant une lance dans votre cœur',
            "meaning" = 'La duplicité, l''hypocrisie et les sourires trompeurs doivent être bannis ; l''honnêteté exige la concordance parfaite entre les propos et les pensées.',
            "example" = 'Mise en garde contre la traîtrise feutrée dans les relations professionnelles et politiques.',
            "origins" = ARRAY['Merina', 'Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-249' OR "slug" = 'aza-manao-am-bava-malefaka-ka-an-tsaina-misy-lefon' OR LOWER("malagasy") = LOWER('Aza manao am-bava malefaka ka an-tsaina misy lefona');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-250' OR "slug" = 'ny-hazo-avo-halanny-rivotra' OR LOWER("malagasy") = LOWER('Ny hazo avo halan''ny rivotra')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'L''arbre le plus élevé est le premier buté par les assauts du vent',
            "meaning" = 'Occuper un rang élevé ou jouir d''une grande notoriété expose inévitablement aux critiques, aux jalousies et aux épreuves les plus intenses.',
            "example" = 'Conseil de prudence et d''humilité adressé aux dirigeants et personnalités publiques.',
            "origins" = ARRAY['Betsileo', 'Merina']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-250' OR "slug" = 'ny-hazo-avo-halanny-rivotra' OR LOWER("malagasy") = LOWER('Ny hazo avo halan''ny rivotra');
    ELSE
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
        );
    END IF;
END $$;
INSERT INTO "dialect_variants" ("id", "dialectName", "text", "itemId", "createdAt")
SELECT 'dv-' || substr(md5(random()::text), 1, 16), 'Betsileo', 'Hazo lehibe ifofofofon''ny tafiotra', 'proverbID-250', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "dialect_variants" WHERE "itemId" = 'proverbID-250' AND "dialectName" = 'Betsileo'
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-251' OR "slug" = 'aleo-halanandriana-toy-izay-halam-bahoaka' OR LOWER("malagasy") = LOWER('Aleo halan''andriana toy izay halam-bahoaka')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Mieux vaut encourir le déplaisir des princes que d''être honni par le peuple',
            "meaning" = 'Le jugement et l''affection de la masse populaire laborieuse ont un poids moral et historique bien supérieur à la faveur éphémère des puissants.',
            "example" = 'Maxime démocratique traditionnelle proclamée lors des débats civiques et royaux.',
            "origins" = ARRAY['Merina']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-251' OR "slug" = 'aleo-halanandriana-toy-izay-halam-bahoaka' OR LOWER("malagasy") = LOWER('Aleo halan''andriana toy izay halam-bahoaka');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-252' OR "slug" = 'aza-manary-ny-hazo-nanantona-anao-fony-ianao-rendr' OR LOWER("malagasy") = LOWER('Aza manary ny hazo nanantona anao fony ianao rendrika')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Ne jetez point avec dédain la branche flottante qui vous a sauvé lorsque vous couliez',
            "meaning" = 'Il est odieux d''oublier ou de mépriser les bienfaiteurs modestes qui vous ont secouru au moment de la détresse une fois la prospérité retrouvée.',
            "example" = 'Leçon de gratitude pérenne envers ceux qui ont tendu la main dans les débuts difficiles.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-252' OR "slug" = 'aza-manary-ny-hazo-nanantona-anao-fony-ianao-rendr' OR LOWER("malagasy") = LOWER('Aza manary ny hazo nanantona anao fony ianao rendrika');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-253' OR "slug" = 'ny-volamena-tsy-matahotra-afo-ny-marina-tsy-matah' OR LOWER("malagasy") = LOWER('Ny volamena tsy matahotra afo, ny marina tsy matahotra fitsarana')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'L''or pur ne craint pas la fournaise, la vérité ne redoute point le tribunal',
            "meaning" = 'L''homme sincère et droit dans sa conscience affronte sans pâlir les épreuves et les jugements, car son innocence finit toujours par éclater.',
            "example" = 'Cité par l''accusé injustement diffamé devant les juges traditionnels.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-253' OR "slug" = 'ny-volamena-tsy-matahotra-afo-ny-marina-tsy-matah' OR LOWER("malagasy") = LOWER('Ny volamena tsy matahotra afo, ny marina tsy matahotra fitsarana');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-254' OR "slug" = 'izay-manao-tsara-fototra-tsy-matahotra-rivotra' OR LOWER("malagasy") = LOWER('Izay manao tsara fototra, tsy matahotra rivotra')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Celui qui bâtit sur de solides fondations ne tremble point devant les bourrasques',
            "meaning" = 'Une éducation solide, un métier bien appris et des principes inaltérables garantissent la stabilité de l''existence face aux aléas de la vie.',
            "example" = 'Encouragement à la rigueur dès les étapes initiales d''un apprentissage.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-254' OR "slug" = 'izay-manao-tsara-fototra-tsy-matahotra-rivotra' OR LOWER("malagasy") = LOWER('Izay manao tsara fototra, tsy matahotra rivotra');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-255' OR "slug" = 'ny-fisaorana-tsy-mampahantra-ny-fitahiana-tsy-mam' OR LOWER("malagasy") = LOWER('Ny fisaorana tsy mampahantra, ny fitahiana tsy mampanefy')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Exprimer sa gratitude n''appauvrit personne, bénir autrui ne coûte aucune peine',
            "meaning" = 'La politesse, la bienveillance et les vœux sincères sont des trésors moraux inépuisables qui enrichissent celui qui les donne comme celui qui les reçoit.',
            "example" = 'Leçon de courtoisie élémentaire dispensée dès le plus jeune âge.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-255' OR "slug" = 'ny-fisaorana-tsy-mampahantra-ny-fitahiana-tsy-mam' OR LOWER("malagasy") = LOWER('Ny fisaorana tsy mampahantra, ny fitahiana tsy mampanefy');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-256' OR "slug" = 'ny-omby-mahia-tsy-namana' OR LOWER("malagasy") = LOWER('Ny omby mahia tsy namana')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le bœuf émacié ne trouve point de compagnon d''attelage',
            "meaning" = 'Constat lucide et critique de la cruauté humaine : les personnes dans la misère sont trop souvent délaissées par ceux qui les entouraient au temps de leur splendeur.',
            "example" = 'Dénonciation de l''égoïsme mondain et appel à la compassion pour les démunis.',
            "origins" = ARRAY['Betsileo', 'Merina']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-256' OR "slug" = 'ny-omby-mahia-tsy-namana' OR LOWER("malagasy") = LOWER('Ny omby mahia tsy namana');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-257' OR "slug" = 'aza-mandao-ny-omby-mahavokatra-ka-hihazakazaka-han' OR LOWER("malagasy") = LOWER('Aza mandao ny omby mahavokatra ka hihazakazaka hanenjika ny vorona manidina')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'N''abandonnez pas la vache productive pour courir après l''oiseau qui s''envole',
            "meaning" = 'Il ne faut point délaisser un bien certain, acquis par le labeur, pour des chimères séduisantes mais hautement improbables.',
            "example" = 'Avertissement contre la spéculation hasardeuse et les promesses mirobolantes.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-257' OR "slug" = 'aza-mandao-ny-omby-mahavokatra-ka-hihazakazaka-han' OR LOWER("malagasy") = LOWER('Aza mandao ny omby mahavokatra ka hihazakazaka hanenjika ny vorona manidina');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-258' OR "slug" = 'ny-valin-tanana-no-mampitombo-ny-voka-bary' OR LOWER("malagasy") = LOWER('Ny valin-tanana no mampitombo ny voka-bary')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'C''est l''entraide communautaire des bras qui démultiplie la récolte du riz',
            "meaning" = 'La solidarité active dans le repiquage et la moisson permet d''achever en un jour ce qu''une famille isolée peinerait à réaliser en un mois.',
            "example" = 'Appel traditionnel à l''esprit d''entraide (valin-tanana) lors de la saison des pluies.',
            "origins" = ARRAY['Betsileo', 'Merina']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-258' OR "slug" = 'ny-valin-tanana-no-mampitombo-ny-voka-bary' OR LOWER("malagasy") = LOWER('Ny valin-tanana no mampitombo ny voka-bary');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-259' OR "slug" = 'aza-manao-fitia-tsipolitra-liana-aminny-voaloha' OR LOWER("malagasy") = LOWER('Aza manao fitia tsipolitra : liana amin''ny voalohany, fa manary amin''ny farany')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'N''ayez point un amour de fétu de paille : flamboyant au départ, prompt à s''éteindre et à abandonner à la fin',
            "meaning" = 'La véritable amitié et l''engagement sincère se mesurent à leur constance dans la durée et non à un enthousiasme passager.',
            "example" = 'Conseil de fidélité dans les relations amicales et professionnelles.',
            "origins" = ARRAY['Merina']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-259' OR "slug" = 'aza-manao-fitia-tsipolitra-liana-aminny-voaloha' OR LOWER("malagasy") = LOWER('Aza manao fitia tsipolitra : liana amin''ny voalohany, fa manary amin''ny farany');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-260' OR "slug" = 'ny-lova-tsara-indrindra-ho-anny-zanaka-dia-ny-fah' OR LOWER("malagasy") = LOWER('Ny lova tsara indrindra ho an''ny zanaka dia ny fahendrena sy ny fanabeazana')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le plus bel héritage pour un enfant réside dans la sagesse et l''éducation qu''on lui transmet',
            "meaning" = 'Les terres et l''or peuvent être perdus ou dilapidés, mais l''instruction et les valeurs morales chevillées au corps demeurent pour toujours.',
            "example" = 'Exhortation des parents à privilégier l''instruction de leur progéniture.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-260' OR "slug" = 'ny-lova-tsara-indrindra-ho-anny-zanaka-dia-ny-fah' OR LOWER("malagasy") = LOWER('Ny lova tsara indrindra ho an''ny zanaka dia ny fahendrena sy ny fanabeazana');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-261' OR "slug" = 'ny-teny-ratsy-toy-ny-tsilo-mora-atsindrona-fa-sa' OR LOWER("malagasy") = LOWER('Ny teny ratsy toy ny tsilo : mora atsindrona fa sarotra alana')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'La mauvaise parole est pareille à l''épine : facile à planter, douloureuse à retirer',
            "meaning" = 'Une parole offensante s''enracine durablement dans le cœur de celui qui la reçoit et laisse des cicatrices vivaces même après le pardon.',
            "example" = 'Invitation solennelle à la retenue verbale lors des tensions familiales.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-261' OR "slug" = 'ny-teny-ratsy-toy-ny-tsilo-mora-atsindrona-fa-sa' OR LOWER("malagasy") = LOWER('Ny teny ratsy toy ny tsilo : mora atsindrona fa sarotra alana');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-262' OR "slug" = 'aza-manao-lamban-tsolifara-tsara-ety-ivelany-fa' OR LOWER("malagasy") = LOWER('Aza manao lamban-tsolifara : tsara ety ivelany fa simba ao anaty')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Ne ressemblez point à la natte de cercueil : éclatante au regard extérieur mais corrompue en son for intérieur',
            "meaning" = 'Il faut condamner l''apparence respectable masquant la noirceur de l''âme ; la pureté intérieure prime sur l''artifice.',
            "example" = 'Reproche adressé aux faux dévots et aux imposteurs de la vie publique.',
            "origins" = ARRAY['Merina']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-262' OR "slug" = 'aza-manao-lamban-tsolifara-tsara-ety-ivelany-fa' OR LOWER("malagasy") = LOWER('Aza manao lamban-tsolifara : tsara ety ivelany fa simba ao anaty');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-263' OR "slug" = 'ny-olona-mahay-manetry-tena-no-asandratra' OR LOWER("malagasy") = LOWER('Ny olona mahay manetry tena no asandratra')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'L''être capable d''humilité véritable est celui que la communauté élève',
            "meaning" = 'Ceux qui s''abstiennent d''arrogance et savent servir avec modestie finissent toujours par gagner la confiance et l''estime unanime de leurs pairs.',
            "example" = 'Maxime célébrant la vertu d''humilité chez les grands orateurs et chefs traditionnels.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-263' OR "slug" = 'ny-olona-mahay-manetry-tena-no-asandratra' OR LOWER("malagasy") = LOWER('Ny olona mahay manetry tena no asandratra');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-264' OR "slug" = 'ny-fitiavana-tsy-mba-an-tery-toy-ny-rano-mikoria' OR LOWER("malagasy") = LOWER('Ny fitiavana tsy mba an-tery : toy ny rano mikoriana am-pahatoniana')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'L''amour ne se commande point de force : il est pareil à l''eau qui s''écoule paisiblement',
            "meaning" = 'Les sentiments sincères et les unions durables doivent naître du libre consentement et de l''harmonie naturelle des cœurs.',
            "example" = 'Principe coutumier défendant la liberté et la sincérité des sentiments amoureux.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-264' OR "slug" = 'ny-fitiavana-tsy-mba-an-tery-toy-ny-rano-mikoria' OR LOWER("malagasy") = LOWER('Ny fitiavana tsy mba an-tery : toy ny rano mikoriana am-pahatoniana');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-265' OR "slug" = 'ny-asa-iaraha-manao-dia-maivana-ny-entana-ifandro' OR LOWER("malagasy") = LOWER('Ny asa iaraha-manao dia maivana, ny entana ifandrombahana tsy mandratra soroka')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le travail partagé devient léger, le fardeau porté ensemble ne blesse point l''épaule',
            "meaning" = 'Face aux corvées les plus ardues, la répartition fraternelle des efforts transforme la pénibilité en un moment de communion joyeuse.',
            "example" = 'Cri d''encouragement lors du transport de bois de charpente ou de digues de rizière.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-265' OR "slug" = 'ny-asa-iaraha-manao-dia-maivana-ny-entana-ifandro' OR LOWER("malagasy") = LOWER('Ny asa iaraha-manao dia maivana, ny entana ifandrombahana tsy mandratra soroka');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-266' OR "slug" = 'ny-andro-lasa-tsy-mba-miverina' OR LOWER("malagasy") = LOWER('Ny andro lasa tsy mba miverina')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le jour enfui ne revient jamais sur ses pas',
            "meaning" = 'Le temps est un trésor précieux et irréversible ; chaque instant doit être employé à des œuvres utiles pour soi et sa communauté.',
            "example" = 'Avertissement contre la procrastination et le gaspillage des heures de jeunesse.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-266' OR "slug" = 'ny-andro-lasa-tsy-mba-miverina' OR LOWER("malagasy") = LOWER('Ny andro lasa tsy mba miverina');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-267' OR "slug" = 'ny-marina-toy-ny-fary-na-voatoto-aza-mbola-mamy' OR LOWER("malagasy") = LOWER('Ny marina toy ny fary : na voatoto aza, mbola mamy ihany')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'La vérité est pareille à la canne à sucre : même broyée sous la meule, elle conserve sa douceur',
            "meaning" = 'L''authenticité et la probité résistent à toutes les humiliations et calomnies ; le temps finit toujours par en révéler la saveur irremplaçable.',
            "example" = 'Encouragement pour celui qui endure l''injustice pour être resté fidèle à la vérité.',
            "origins" = ARRAY['Betsimisaraka', 'Hauts-Plateaux']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-267' OR "slug" = 'ny-marina-toy-ny-fary-na-voatoto-aza-mbola-mamy' OR LOWER("malagasy") = LOWER('Ny marina toy ny fary : na voatoto aza, mbola mamy ihany');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-268' OR "slug" = 'aza-manao-rano-an-tavy-manopy-ka-manary' OR LOWER("malagasy") = LOWER('Aza manao rano an-tavy : manopy ka manary')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Ne traitez pas autrui comme l''eau de la cuvette : s''y laver puis la rejeter avec dédain',
            "meaning" = 'Il est indigne de n''approcher une personne que pour exploiter ses services ou son soutien, pour ensuite l''abandonner froidement une fois le besoin comblé.',
            "example" = 'Condamnation morale de l''ingratitude et de l''opportunisme relationnel.',
            "origins" = ARRAY['Merina']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-268' OR "slug" = 'aza-manao-rano-an-tavy-manopy-ka-manary' OR LOWER("malagasy") = LOWER('Aza manao rano an-tavy : manopy ka manary');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-269' OR "slug" = 'tsy-misy-valala-tsy-an-katsaka' OR LOWER("malagasy") = LOWER('Tsy misy valala tsy an-katsaka')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Il n''est point de sauterelle qui ne finisse un jour par se poser sur le maïs',
            "meaning" = 'Chacun a ses habitudes, ses vulnérabilités et ses points d''attache ; avec de la patience, les intentions cachées finissent toujours par se dévoiler.',
            "example" = 'Maxime de déduction et de perspicacité face aux faux-fuyants d''un suspect.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-269' OR "slug" = 'tsy-misy-valala-tsy-an-katsaka' OR LOWER("malagasy") = LOWER('Tsy misy valala tsy an-katsaka');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-270' OR "slug" = 'ny-zaza-hendry-voninahitry-ny-ray-aman-dreniny' OR LOWER("malagasy") = LOWER('Ny zaza hendry voninahitry ny ray aman-dreniny')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'L''enfant bien élevé et sage fait la fierté et l''honneur de ses parents',
            "meaning" = 'La droiture et les succès d''un enfant rejaillissent sur toute sa famille et récompensent dignement les sacrifices de ses éducateurs.',
            "example" = 'Compliment traditionnel adressé aux parents lors de la réussite scolaire ou sociale d''un jeune.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-270' OR "slug" = 'ny-zaza-hendry-voninahitry-ny-ray-aman-dreniny' OR LOWER("malagasy") = LOWER('Ny zaza hendry voninahitry ny ray aman-dreniny');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-271' OR "slug" = 'ny-fitiavana-marina-tsy-mba-manao-vava-be' OR LOWER("malagasy") = LOWER('Ny fitiavana marina tsy mba manao vava be')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le véritable amour ne s''embarrasse point de grands discours tapageurs',
            "meaning" = 'Les sentiments les plus sincères et les plus profonds s''expriment dans la discrétion des actes quotidiens plutôt que dans les promesses ronflantes.',
            "example" = 'Rappel à la sobriété et à l''authenticité dans l''engagement conjugal ou fraternel.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-271' OR "slug" = 'ny-fitiavana-marina-tsy-mba-manao-vava-be' OR LOWER("malagasy") = LOWER('Ny fitiavana marina tsy mba manao vava be');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-272' OR "slug" = 'ny-henatra-no-tsara-noho-ny-faharesena' OR LOWER("malagasy") = LOWER('Ny henatra no tsara noho ny faharesena')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le sens de l''honneur et la pudeur valent mieux que la déchéance morale',
            "meaning" = 'Mieux vaut renoncer dignement à un affrontement stérile ou à un gain douteux que de perdre sa réputation et l''estime de soi.',
            "example" = 'Conseil de modération donné pour désamorcer une surenchère verbale dangereuse.',
            "origins" = ARRAY['Merina', 'Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-272' OR "slug" = 'ny-henatra-no-tsara-noho-ny-faharesena' OR LOWER("malagasy") = LOWER('Ny henatra no tsara noho ny faharesena');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-273' OR "slug" = 'izay-manao-soa-ho-anny-hafa-manao-soa-ho-anny-t' OR LOWER("malagasy") = LOWER('Izay manao soa ho an''ny hafa, manao soa ho an''ny tenany')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Qui sème le bien envers son semblable fait du bien à sa propre existence',
            "meaning" = 'La bienveillance et la générosité créent autour de l''individu un cercle vertueux d''amitié, de protection et de paix intérieure.',
            "example" = 'Motivation à l''altruisme et à l''assistance des personnes vulnérables.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-273' OR "slug" = 'izay-manao-soa-ho-anny-hafa-manao-soa-ho-anny-t' OR LOWER("malagasy") = LOWER('Izay manao soa ho an''ny hafa, manao soa ho an''ny tenany');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-274' OR "slug" = 'aza-manao-vorona-manara-drenirano-mora-midina-fa' OR LOWER("malagasy") = LOWER('Aza manao vorona manara-drenirano : mora midina fa sarotra miakatra')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'N''imitez point l''oiseau qui suit docilement le cours du fleuve : descendre est aisé, remonter le courant est périlleux',
            "meaning" = 'Se laisser glisser sur la pente de la facilité ou des mauvaises fréquentations est tentant, mais redresser sa vie exige des efforts colossaux.',
            "example" = 'Avertissement donné à la jeunesse contre les tentations de la dérive et du laisser-aller.',
            "origins" = ARRAY['Betsileo', 'Merina']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-274' OR "slug" = 'aza-manao-vorona-manara-drenirano-mora-midina-fa' OR LOWER("malagasy") = LOWER('Aza manao vorona manara-drenirano : mora midina fa sarotra miakatra');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-275' OR "slug" = 'ny-fanetren-tena-no-loharanonny-voninahitra' OR LOWER("malagasy") = LOWER('Ny fanetren-tena no loharanon''ny voninahitra')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'L''humilité est la source la plus pure de la véritable grandeur',
            "meaning" = 'C''est en sachant s''effacer, servir autrui et reconnaître ses limites que l''on acquiert une autorité morale naturelle et incontestable.',
            "example" = 'Éloge coutumier prononcé en l''honneur d''un doyen respecté pour sa modestie.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-275' OR "slug" = 'ny-fanetren-tena-no-loharanonny-voninahitra' OR LOWER("malagasy") = LOWER('Ny fanetren-tena no loharanon''ny voninahitra');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-276' OR "slug" = 'ny-namana-marina-hita-aminny-andro-fahoriana' OR LOWER("malagasy") = LOWER('Ny namana marina hita amin''ny andro fahoriana')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le véritable ami se reconnaît au jour de l''adversité',
            "meaning" = 'Les compagnons de fête fuient au premier orage ; seuls ceux qui demeurent à vos côtés dans le deuil ou la misère méritent le titre de frère.',
            "example" = 'Reconnaissance émue témoignée à un proche venu prêter main-forte lors d''un coup dur.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-276' OR "slug" = 'ny-namana-marina-hita-aminny-andro-fahoriana' OR LOWER("malagasy") = LOWER('Ny namana marina hita amin''ny andro fahoriana');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-277' OR "slug" = 'ny-fahaizana-tsy-voavidy-vola-fa-iasana-am-poto-k' OR LOWER("malagasy") = LOWER('Ny fahaizana tsy voavidy vola, fa iasana am-poto-kevitra')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Le vrai savoir ne s''achète pas avec de l''argent, il s''acquiert par l''étude patiente et la méditation',
            "meaning" = 'La richesse matérielle ne peut remplacer la rigueur intellectuelle, la culture et l''apprentissage méthodique d''un métier.',
            "example" = 'Exhortation des étudiants et des apprentis à la persévérance scolaire.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-277' OR "slug" = 'ny-fahaizana-tsy-voavidy-vola-fa-iasana-am-poto-k' OR LOWER("malagasy") = LOWER('Ny fahaizana tsy voavidy vola, fa iasana am-poto-kevitra');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-278' OR "slug" = 'izay-tsy-mandray-anatra-mandray-loza' OR LOWER("malagasy") = LOWER('Izay tsy mandray anatra, mandray loza')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Celui qui rejette les sages conseils des anciens s''expose de plein fouet au désastre',
            "meaning" = 'Le refus obstiné d''écouter les avertissements bienveillants conduit inévitablement aux erreurs les plus destructrices.',
            "example" = 'Rappel à la docilité adressé à celui qui persiste dans une démarche imprudente.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-278' OR "slug" = 'izay-tsy-mandray-anatra-mandray-loza' OR LOWER("malagasy") = LOWER('Izay tsy mandray anatra, mandray loza');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-279' OR "slug" = 'ny-fahamarinana-toy-ny-masoandro-na-takon-drahon' OR LOWER("malagasy") = LOWER('Ny fahamarinana toy ny masoandro : na takon-drahona aza, hiposaka ihany')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'La vérité est pareille au soleil : même masquée par les nuages sombres, elle finit toujours par rayonner',
            "meaning" = 'Les complots, les faux témoignages et l''injustice peuvent masquer temporairement la réalité, mais la lumière finit toujours par triompher.',
            "example" = 'Parole de foi et d''espoir prononcée lors d''épreuves judiciaires ou de calomnies publiques.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-279' OR "slug" = 'ny-fahamarinana-toy-ny-masoandro-na-takon-drahon' OR LOWER("malagasy") = LOWER('Ny fahamarinana toy ny masoandro : na takon-drahona aza, hiposaka ihany');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-280' OR "slug" = 'ny-fihavanana-toy-ny-lalan-kely-an-tsaha-raha-ts' OR LOWER("malagasy") = LOWER('Ny fihavanana toy ny lalan-kely an-tsaha : raha tsy ifamelezana, dia tapitr''ahitra')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'L''amitié est comme le sentier des rizières : si on ne l''emprunte pas régulièrement, les herbes folles l''effacent',
            "meaning" = 'Les relations fraternelles demandent un entretien constant (visites, nouvelles, marques d''affection) sous peine de s''étioler avec la distance.',
            "example" = 'Justification traditionnelle d''une visite de courtoisie inopinée à un parent éloigné.',
            "origins" = ARRAY['Betsileo', 'Merina']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-280' OR "slug" = 'ny-fihavanana-toy-ny-lalan-kely-an-tsaha-raha-ts' OR LOWER("malagasy") = LOWER('Ny fihavanana toy ny lalan-kely an-tsaha : raha tsy ifamelezana, dia tapitr''ahitra');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-281' OR "slug" = 'izay-mahay-manaja-ny-madinika-hajainny-lehibe' OR LOWER("malagasy") = LOWER('Izay mahay manaja ny madinika, hajain''ny lehibe')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Celui qui sait témoigner de la déférence aux humbles gagne tout naturellement le respect des grands',
            "meaning" = 'La courtoisie envers les faibles est la véritable marque des âmes nobles et inspire la confiance des chefs et des aînés.',
            "example" = 'Maxime de comportement politique et social enseignée aux futurs responsables.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-281' OR "slug" = 'izay-mahay-manaja-ny-madinika-hajainny-lehibe' OR LOWER("malagasy") = LOWER('Izay mahay manaja ny madinika, hajain''ny lehibe');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-282' OR "slug" = 'ny-marina-tsy-mba-maty-an-drano' OR LOWER("malagasy") = LOWER('Ny marina tsy mba maty an-drano')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'La vérité ne se noie jamais au fond des eaux',
            "meaning" = 'Aucune tentative de dissimulation ni aucun étouffement de scandale ne peut submerger définitivement la vérité.',
            "example" = 'Formule d''apaisement utilisée lorsque des faits longtemps cachés refont surface.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-282' OR "slug" = 'ny-marina-tsy-mba-maty-an-drano' OR LOWER("malagasy") = LOWER('Ny marina tsy mba maty an-drano');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-283' OR "slug" = 'ny-zoky-manoro-ny-zandry-mankato' OR LOWER("malagasy") = LOWER('Ny zoky manoro, ny zandry mankato')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'L''aîné guide le chemin avec bienveillance, le cadet prête l''oreille avec respect',
            "meaning" = 'L''harmonie de la famille et de la société repose sur ce pacte intergénérationnel : la transmission protectrice des devanciers et la docilité studieuse des cadets.',
            "example" = 'Principe fondamental de la hiérarchie coutumière malgache.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-283' OR "slug" = 'ny-zoky-manoro-ny-zandry-mankato' OR LOWER("malagasy") = LOWER('Ny zoky manoro, ny zandry mankato');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-284' OR "slug" = 'aza-manao-am-pihavanana-kely-toy-ny-voatavo-mani' OR LOWER("malagasy") = LOWER('Aza manao am-pihavanana kely toy ny voatavo : maniry ka manongana ny tompony')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Ne pratiquez point une fraternité de courge grimpante : grandissant pour finir par écraser le piquet qui l''a soutenue',
            "meaning" = 'Il faut flétrir l''arrogance de ceux qui, après avoir grandi grâce à la générosité d''un bienfaiteur, se retournent contre lui pour l''évincer.',
            "example" = 'Sévère réprimande contre l''ingratitude des protégés envers leurs mentors.',
            "origins" = ARRAY['Merina']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-284' OR "slug" = 'aza-manao-am-pihavanana-kely-toy-ny-voatavo-mani' OR LOWER("malagasy") = LOWER('Aza manao am-pihavanana kely toy ny voatavo : maniry ka manongana ny tompony');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-285' OR "slug" = 'ny-tany-tsy-mba-manda-faty-ny-fihavanana-tsy-mba' OR LOWER("malagasy") = LOWER('Ny tany tsy mba mandà faty, ny fihavanana tsy mba mandà havana')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'La terre ne refuse jamais la dépouille, et la fraternité ne repousse jamais le parent revenu',
            "meaning" = 'L''amour familial et la communauté ont une capacité infinie d''accueil et de pardon pour le membre égaré qui revient chercher refuge.',
            "example" = 'Accueil inconditionnel d''un membre de la famille après une longue absence ou des erreurs passées.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-285' OR "slug" = 'ny-tany-tsy-mba-manda-faty-ny-fihavanana-tsy-mba' OR LOWER("malagasy") = LOWER('Ny tany tsy mba mandà faty, ny fihavanana tsy mba mandà havana');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-286' OR "slug" = 'ny-fandeferana-tsy-faharesena-fa-fandresena-ny-ha' OR LOWER("malagasy") = LOWER('Ny fandeferana tsy faharesena, fa fandresena ny hatezerana')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'Savoir pardonner et céder avec noblesse n''est point une défaite, mais la victoire sur sa propre rancœur',
            "meaning" = 'La modération et l''apaisement volontaire témoignent d''une force d''âme supérieure à celle qui s''abandonne aveuglément à la vengeance.',
            "example" = 'Exhortation à la paix concluant un arbitrage traditionnel entre deux voisins.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-286' OR "slug" = 'ny-fandeferana-tsy-faharesena-fa-fandresena-ny-ha' OR LOWER("malagasy") = LOWER('Ny fandeferana tsy faharesena, fa fandresena ny hatezerana');
    ELSE
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
        );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "malagasy_items" WHERE "id" = 'proverbID-287' OR "slug" = 'ny-fiainana-toy-ny-kodiaran-kalesy-anio-ambony' OR LOWER("malagasy") = LOWER('Ny fiainana toy ny kodiaran-kalesy : anio ambony, rahampitso ambany')) THEN
        UPDATE "malagasy_items" SET
            "french" = 'L''existence humaine est comme la roue du chariot : aujourd''hui au faîte, demain au ras du sol',
            "meaning" = 'Les honneurs et les fortunes sont changeants ; celui qui prospère aujourd''hui doit rester humble et généreux, car la roue tourne pour tous.',
            "example" = 'Leçon de modestie pour ceux que le succès récent rend orgueilleux.',
            "origins" = ARRAY['Général']::TEXT[],
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = 'proverbID-287' OR "slug" = 'ny-fiainana-toy-ny-kodiaran-kalesy-anio-ambony' OR LOWER("malagasy") = LOWER('Ny fiainana toy ny kodiaran-kalesy : anio ambony, rahampitso ambany');
    ELSE
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
        );
    END IF;
END $$;
