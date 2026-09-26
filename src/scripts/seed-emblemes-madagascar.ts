import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';

export interface MadagascarEmblemSeedItem {
  id: string;
  period: string;
  government: string;
  descriptionFr: string;
  descriptionMg: string;
  notesFr: string;
  notesMg: string;
  imageUrl: string | null;
  orderIndex: number;
}

/**
 * Données complètes des Emblèmes de Madagascar
 * Source : https://fr.wikipedia.org/wiki/Embl%C3%A8me_de_Madagascar
 * Note : Les champs imageUrl sont initialisés à null afin que l'administrateur
 * puisse les uploader manuellement depuis le panneau d'administration.
 */
export const MADAGASCAR_EMBLEMS_WIKIPEDIA: MadagascarEmblemSeedItem[] = [
  {
    id: 'embleme-1868-ranavalona-ii',
    period: '1868 - 1883',
    government: "Royaume de Madagascar (sous Ranavalona II) / Fanjakan'i Madagasikara",
    descriptionFr:
      "Écu écartelé au 1 d'argent au zébu de sable, au 2 d'argent au ravinala de sinople, au 3 d'argent au bouclier et sagaies de sable, au 4 d'argent au riz de sinople, et sur le tout de cendres en croix au centre et aux bords azur. Surmonté de la couronne de Ranavalona Ire en timbre, avec en tenants, en dextre, un marchand vêtu d'un dishdasha, et senestre, un soldat merina en tenue d'apparat.",
    descriptionMg:
      "Ampinga mizara efatra : omby mainty amin'ny fotsy, ravinala maitso, ampinga sy lefona fiarovana, ary salohim-bary maitso. Eo amboniny ny satro-boninahitry Ranavalona I, tohanan'ny mpivarotra sy miaramila merina manao fanamiana manetriketrika.",
    notesFr:
      "Le tout repose sur un cylindre de sable gravé de la devise historique : « Tsy adidiko izaho irery, fa adidiko izaho sy ianao » (Ce n'est pas mon devoir à moi seul, mais notre devoir à vous et à moi).",
    notesMg:
      "Miorina amin'ny teny filamatra manan-tantara : « Tsy adidiko izaho irery, fa adidiko izaho sy ianao ».",
    imageUrl: null,
    orderIndex: 1,
  },
  {
    id: 'embleme-1883-ranavalona-iii',
    period: '1883 - 1897',
    government: "Royaume de Madagascar (sous Ranavalona III) / Fanjakan'i Madagasikara",
    descriptionFr:
      "Écu d'azur, au soleil d'or figuré, chargé d'un aigle de sable (Voromahery) couronné de gueules ; en pointe, cinq étoiles d'or ; à la couronne de laurier de sinople en orle, le point de jonction chargé d'une étoile d'argent à cinq rais, ajourée d'or.",
    descriptionMg:
      "Ampinga manga ahitana masoandro volamena misy Voromahery misatro-boninahitra mena ; kintana volamena dimy eo ambany ; fehezam-boninkazo laorie maitso ary kintana volafotsy dimy rantsana.",
    notesFr:
      "Armoiries royales sous Ranavalona III, symbole d'autorité souveraine et de résistance nationale avant l'annexion coloniale française de 1896.",
    notesMg:
      "Mari-piandrianana tamin'ny andron-dRanavalona III, mariky ny fahefana mpanjaka sy ny fiarovana ny tanindrazana.",
    imageUrl: null,
    orderIndex: 2,
  },
  {
    id: 'embleme-1897-colonie',
    period: '1897 - 1959',
    government: 'Colonie de Madagascar et dépendances (Gouvernement Général)',
    descriptionFr:
      "Sceau du Gouvernement Général de Madagascar et dépendances : Écu de gueules gravé des initiales officielles du gouvernement général avec les attributs administratifs de l'époque.",
    descriptionMg:
      "Tombo-kase sy mari-panjakana tamin'ny fanjanahan-tany : ampinga mena misy ny soratra voalohan'ny Governemanta Jeneraly sy ny mari-pamantarana frantsay.",
    notesFr:
      "Utilisé sur l'ensemble des actes officiels, décrets et sceaux administratifs de la colonie jusqu'à la proclamation de la République autonome en 1958.",
    notesMg:
      "Nampiasaina tamin'ny taratasim-panjakana rehetra teto Madagasikara talohan'ny fahaleovantena.",
    imageUrl: null,
    orderIndex: 3,
  },
  {
    id: 'embleme-1959-premiere-republique',
    period: '1959 - 1976',
    government: 'Première République (Repoblika Malagasy)',
    descriptionFr:
      "Écu d'argent au ravinala feuillé de sinople (vert) avec pour supports des feuilles et épis de riz d'or, soutenu par une tête de zébu de sable au centre.",
    descriptionMg:
      "Ampinga volafotsy misy ravinala maitso, fehezin'ny ravina sy salohim-bary volamena, tohanan'ny lohan'omby mainty eo afovoany.",
    notesFr:
      "Marqué de la devise officielle : « Fahafahana - Tanindrazana - Fandrosoana » (Liberté - Patrie - Progrès) et surmonté du cri : « Repoblika Malagasy ». Adopté sous la présidence de Philibert Tsiranana.",
    notesMg:
      "Misy ny teny filamatra : « Fahafahana - Tanindrazana - Fandrosoana » ary teny fiantsoana : « Repoblika Malagasy ». Nolaniana tamin'ny fitondran'i Philibert Tsiranana.",
    imageUrl: null,
    orderIndex: 4,
  },
  {
    id: 'embleme-1976-deuxieme-republique',
    period: '1976 - 1993',
    government: 'Deuxième République / République Démocratique Malgache (Repoblika Demokratika Malagasy)',
    descriptionFr:
      "Écu orangé au soleil levant de gueules, roue dentée de sable (l'industrie), bêche d'or (angady pour le paysan), fusil d'or (pour le militaire) et porte-plume de gueules (pour le travailleur intellectuel), support de feuilles de riz d'or.",
    descriptionMg:
      "Mari-piandrianana sosialista : masoandro mena miposaka, kodiarana indostrialy, angady (ho an'ny tantsaha), basy volamena (ho an'ny miaramila) ary penina (ho an'ny mpiasa saina), voahodidina salohim-bary.",
    notesFr:
      "Surmonté de l'Étoile rouge en cimier et du cri « Repoblika Demokratika Malagasy ». Devise : « Tanindrazana - Tolom-piavotana - Fahafahana » (Patrie - Révolution - Liberté). Adopté par ordonnance le 6 février 1976 sous Didier Ratsiraka.",
    notesMg:
      "Misy kintana mena eo ambony sy teny fiantsoana « Repoblika Demokratika Malagasy ». Teny filamatra : « Tanindrazana - Tolom-piavotana - Fahafahana ». Nampiharina ny 6 Febroary 1976.",
    imageUrl: null,
    orderIndex: 5,
  },
  {
    id: 'embleme-1993-troisieme-republique',
    period: '1993 - 1998',
    government: 'Troisième République (Repoblikan’i Madagasikara)',
    descriptionFr:
      "Écu d'argent avec la topographie de l'île en gueules (rouge), surmontée d'un arbre du voyageur (ravinala) feuillé de sinople, sur un pavage de sinople en terrasse, feuilles de riz de sinople en supports et tête de zébu de gueules en soutien.",
    descriptionMg:
      "Ampinga volafotsy ahitana ny sarintanin'ny Nosy miloko mena, ravinala maitso misandrahaka, salohim-bary maitso ary lohan'omby mena eo ambany.",
    notesFr:
      "Surmonté du cri « Repoblikan'i Madagasikara ». Devise : « Tanindrazana - Fahafahana - Fahamarinana » (Patrie - Liberté - Justice). Symbole de la renaissance démocratique sous Albert Zafy.",
    notesMg:
      "Teny fiantsoana « Repoblikan'i Madagasikara ». Teny filamatra : « Tanindrazana - Fahafahana - Fahamarinana ». Mariky ny vanim-potoana nentin'i Albert Zafy.",
    imageUrl: null,
    orderIndex: 6,
  },
  {
    id: 'embleme-1998-troisieme-republique-revisee',
    period: '1998 - 2011',
    government: 'Troisième République Révisée (Repoblikan’i Madagasikara)',
    descriptionFr:
      "Écu d'argent avec la topographie de l'île en gueules, feuillée de sinople, le tout sur fond d'or, sur un pavage d'or en terrasse, aux supports de feuilles de riz de sinople et au zébu de gueules en soutien.",
    descriptionMg:
      "Diska volamena ahitana ny sarintanin'i Madagasikara mena, ravinala maitso, salohim-bary ary lohan'omby mena eo ambany.",
    notesFr:
      "Surmonté du cri « Repoblikan'i Madagasikara ». Devise révisée : « Tanindrazana - Fahafahana - Fandrosoana » (Patrie - Liberté - Progrès). Modification adoptée suite à la révision constitutionnelle de 1998.",
    notesMg:
      "Teny filamatra : « Tanindrazana - Fahafahana - Fandrosoana ». Fanovana nentin'ny fanitsiana ny Lalàmpanorenana tamin'ny 1998.",
    imageUrl: null,
    orderIndex: 7,
  },
  {
    id: 'embleme-2011-quatrieme-republique',
    period: 'Depuis 2011',
    government: 'Quatrième République (Repoblikan’i Madagasikara)',
    descriptionFr:
      "Sceau officiel de la République : Disque d'argent et d'or arborant en son centre la silhouette géographique de Madagascar en rouge, surmontée du Ravinala épanoui en éventail, avec au bas une tête de zébu rouge encadrée de gerbes et épis de riz dorés.",
    descriptionMg:
      "Tombo-kase ofisialin'ny Repoblika : Diska volamena misy ny sarintanin'i Madagasikara mena eo afovoany, ravinala maitso misokatra eo ambony, lohan'omby mena ary salohim-bary volamena eo ambany.",
    notesFr:
      "En haut la légende « Repoblikan’i Madagasikara ». En bas, la devise républicaine : « Fitiavana, Tanindrazana, Fandrosoana » (Amour, Patrie, Progrès). Gardien officiel : le Ministre de la Justice, Garde des Sceaux.",
    notesMg:
      "Eo ambony : « Repoblikan’i Madagasikara ». Eo ambany ny teny filamatra : « Fitiavana, Tanindrazana, Fandrosoana ». Mpitahiry ny Tombo-kase : ny Minisitry ny Fitsarana.",
    imageUrl: null,
    orderIndex: 8,
  },
  {
    id: 'embleme-2011-premier-ministre',
    period: 'Depuis 2011',
    government: 'Primature / Sceau du Premier Ministre (Repoblikan’i Madagasikara)',
    descriptionFr:
      "Sceau officiel du Premier ministre chef du gouvernement, décliné des armoiries de la IVe République avec mentions institutionnelles et attributs républicains de la Primature.",
    descriptionMg:
      "Tombo-kase ofisialin'ny Praiminisitra lehiben'ny governemanta, namboarina manokana avy amin'ny mari-panjakan'ny Repoblika faha-4 miaraka amin'ny soratry ny Primatiora.",
    notesFr:
      "Arboré depuis 2011 sur les correspondances officielles, ordonnances, décrets et arrêtés primatoriaux.",
    notesMg:
      "Apetaka amin'ny didim-panjakana sy taratasin'ny Praiminisitra manomboka tamin'ny 2011.",
    imageUrl: null,
    orderIndex: 9,
  },
];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ Variable DATABASE_URL manquante dans .env');
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('🇲🇬 [Emblèmes de Madagascar] Démarrage du seed Wikipédia...');
  console.log(`📦 Nombre d'emblèmes à synchroniser : ${MADAGASCAR_EMBLEMS_WIKIPEDIA.length}`);

  try {
    for (const item of MADAGASCAR_EMBLEMS_WIKIPEDIA) {
      // Préserve l'image existante si elle a déjà été uploadée manuellement par l'admin
      const existing = await prisma.nationalEmblem.findUnique({
        where: { id: item.id },
        select: { imageUrl: true },
      });

      const effectiveImageUrl = existing?.imageUrl || item.imageUrl;

      await prisma.nationalEmblem.upsert({
        where: { id: item.id },
        create: {
          id: item.id,
          period: item.period,
          government: item.government,
          descriptionFr: item.descriptionFr,
          descriptionMg: item.descriptionMg,
          notesFr: item.notesFr,
          notesMg: item.notesMg,
          imageUrl: effectiveImageUrl,
          orderIndex: item.orderIndex,
          status: 'PUBLISHED',
        },
        update: {
          period: item.period,
          government: item.government,
          descriptionFr: item.descriptionFr,
          descriptionMg: item.descriptionMg,
          notesFr: item.notesFr,
          notesMg: item.notesMg,
          // Ne pas écraser l'image manuellement uploadée
          ...(existing?.imageUrl ? {} : { imageUrl: item.imageUrl }),
          orderIndex: item.orderIndex,
          status: 'PUBLISHED',
        },
      });

      console.log(`  ✓ [${item.period}] ${item.government}`);
    }

    const totalCount = await prisma.nationalEmblem.count();
    console.log(`\n🎉 Seed terminé avec succès ! Total en base : ${totalCount} emblèmes.`);
  } catch (error) {
    console.error('❌ Erreur lors du seed des emblèmes :', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

void main();
