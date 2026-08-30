import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const LEVEL_1_SENTENCES = [
  {
    orderIndex: 1,
    malagasy: 'Izay mitambatra vato ary izay misaraka fasika',
    french: "L'union fait la force",
    hint: 'mitambatra',
    explanationMg: "Mampiseho fa ny firaisan-kina no herin'ny fiaraha-monina.",
    explanationFr:
      'Unis nous sommes solides comme des pierres, séparés nous nous dispersons comme du sable.',
  },
  {
    orderIndex: 2,
    malagasy: 'Ny fihavanana no sarobidy indrindra',
    french: 'La concorde est le bien le plus précieux',
    hint: 'sarobidy',
    explanationMg:
      "Ny fifandraisana tsara eo amin'ny olombelona no fototry ny fiainana.",
    explanationFr:
      'La solidarité et le lien fraternel dépassent toute richesse matérielle.',
  },
  {
    orderIndex: 3,
    malagasy: 'Ny rano sy ny vary tsy mifandao',
    french: "L'eau et le riz sont inséparables",
    hint: 'mifandao',
    explanationMg:
      "Fanehoana ny firaisan-kinan'ny olona roa mifankatia sy mifanampy.",
    explanationFr: 'Symbolise une union inséparable et harmonieuse.',
  },
  {
    orderIndex: 4,
    malagasy: 'Akanga maro tsy vakin amboa',
    french: 'Une bande de pintades ne craint pas le chien',
    hint: 'vakin amboa',
    explanationMg:
      'Raha maro ny olona miara-mientana dia tsy misy afaka mampitahotra azy.',
    explanationFr:
      'Le nombre et la cohésion permettent de résister à toute menace.',
  },
  {
    orderIndex: 5,
    malagasy: 'Tondro tokana tsy mahazo hao',
    french: "Un seul doigt n'attrape pas un pou",
    hint: 'mahazo',
    explanationMg: 'Tsy afaka manao zavatra lehibe ny olona iray samirery.',
    explanationFr:
      'On ne peut pas accomplir seul ce qui demande la coopération.',
  },
  {
    orderIndex: 6,
    malagasy: 'Hazo tokana tsy mba ala',
    french: 'Un seul arbre ne fait pas une forêt',
    hint: 'ala',
    explanationMg: 'Mila ny hafa mandrakariva ny tsirairay.',
    explanationFr: "L'individu a toujours besoin du groupe.",
  },
  {
    orderIndex: 7,
    malagasy: 'Aleo very tsikalakalam-bola toy izay very fihavanana',
    french: "Mieux vaut perdre de l'argent que l'amitié",
    hint: 'fihavanana',
    explanationMg: 'Ny vola mety ho lany fa ny fifankatiavana mitoetra.',
    explanationFr:
      "L'amitié et la paix valent plus que les richesses matérielles.",
  },
  {
    orderIndex: 8,
    malagasy: 'Valala zato mitovy vava',
    french: 'Cent sauterelles ont la même bouche',
    hint: 'mitovy',
    explanationMg: 'Maneho ny fitovian-kevitra sy ny fifanarahana.',
    explanationFr: 'Décrit une voix unanime et solidaire.',
  },
  {
    orderIndex: 9,
    malagasy: 'Afo maro mitsipaka tsy maty',
    french: "Des braises réunies ne s'éteignent pas",
    hint: 'afo',
    explanationMg: 'Ny fifanohanana no mampaharitra ny hery.',
    explanationFr: "L'entraide entretient la force et la flamme commune.",
  },
  {
    orderIndex: 10,
    malagasy: 'Ny firaisankina no mandresy ny sakana rehetra',
    french: "L'union surmonte tous les obstacles",
    hint: 'mandresy',
    explanationMg: 'Tsy misy olana tsy voavaha rehefa miara-miasa.',
    explanationFr:
      'La force collective permet de triompher de toute difficulté.',
  },
];

const LEVEL_2_SENTENCES = [
  {
    orderIndex: 1,
    malagasy: 'Aza manao am-pihavanana kitoatoa',
    french: "Ne traite pas l'amitié avec légèreté",
    hint: 'kitoatoa',
    explanationMg: 'Fampianarana hanaja ny fifandraisana sy ny fihavanana.',
    explanationFr: 'Il faut cultiver les relations avec soin et sincérité.',
  },
  {
    orderIndex: 2,
    malagasy: 'Ny fahendrena no harena tsy mety lany',
    french: 'La sagesse est un trésor inépuisable',
    hint: 'harena',
    explanationMg: 'Ny fahalalana no fananana maharitra indrindra.',
    explanationFr: 'La sagesse et le savoir ne peuvent jamais être perdus.',
  },
  {
    orderIndex: 3,
    malagasy: 'Ny teny toy ny atody ka raha vaky tsy azo raofina intsony',
    french:
      'Les paroles sont comme des œufs : cassées, on ne peut plus les ramasser',
    hint: 'atody',
    explanationMg:
      "Mitandrema amin'ny teny aloaky ny vava fa miteraka takaitra.",
    explanationFr:
      'Il faut peser ses paroles car les blessures verbales sont irréversibles.',
  },
  {
    orderIndex: 4,
    malagasy: 'Aleo ratsy fihary toy izay ratsy fihavanana',
    french: 'Mieux vaut manquer de biens que de bienveillance',
    hint: 'fihary',
    explanationMg: "Ny soatoavina ara-panahy no ambonin'ny harena.",
    explanationFr: 'La bonté de cœur est supérieure aux avoirs financiers.',
  },
  {
    orderIndex: 5,
    malagasy: 'Mianara tsara dieny mbola tanora',
    french: 'Apprends bien tant que tu es jeune',
    hint: 'tanora',
    explanationMg:
      'Ny fahatanorana no fotoana mety indrindra hanovozana fahaizana.',
    explanationFr:
      'La jeunesse est le moment privilégié pour acquérir les connaissances.',
  },
  {
    orderIndex: 6,
    malagasy: "Ny marina mitovy amin'ny kintana tsy mety maty",
    french: "La vérité est comme les étoiles, elle ne s'éteint jamais",
    hint: 'marina',
    explanationMg: 'Mibaliaka hatrany ny fahamarinana na ela aza.',
    explanationFr: "La vérité finit toujours par triompher de l'obscurité.",
  },
  {
    orderIndex: 7,
    malagasy: "Ny hendry mieritreritra alohan'ny hitenenana",
    french: 'Le sage réfléchit avant de parler',
    hint: 'hendry',
    explanationMg: 'Tsy maika miteny ny olona hendry.',
    explanationFr: 'La maîtrise de la parole est la marque de la sagesse.',
  },
  {
    orderIndex: 8,
    malagasy: 'Ny kely vita anio tsara noho ny lehibe kasaina ampitso',
    french: "Un peu fait aujourd'hui vaut mieux que beaucoup prévu demain",
    hint: 'kely',
    explanationMg: "Fandavana ny fitarazohana sy ny fahanginana amin'ny asa.",
    explanationFr:
      "L'action immédiate l'emporte toujours sur la procrastination.",
  },
  {
    orderIndex: 9,
    malagasy: "Ny fanetren-tena no fiaingana mankany amin'ny voninahitra",
    french: "L'humilité est le chemin vers la grandeur",
    hint: 'fanetren-tena',
    explanationMg: 'Ny olona manetry tena no asandratra.',
    explanationFr:
      "L'humilité authentique conduit au respect et à l'élévation.",
  },
  {
    orderIndex: 10,
    malagasy: "Ny fanabeazana no fanalahidin'ny hoavy mamirapiratra",
    french: "L'éducation est la clé d'un avenir radieux",
    hint: 'fanabeazana',
    explanationMg: 'Ny sekoly sy ny fahendrena no manangana ny firenena.',
    explanationFr:
      "L'instruction forge l'avenir et la prospérité d'une nation.",
  },
];

async function seed() {
  console.log('Seeding WordPuzzle levels and sentences...');

  const count = await prisma.wordPuzzleLevel.count();
  if (count > 0) {
    console.log(`Il y a déjà ${count} niveau(x) en base.`);
    return;
  }

  const l1 = await prisma.wordPuzzleLevel.create({
    data: {
      levelNumber: 1,
      titleMg: 'Firaisankina sy Fihavanana',
      titleFr: 'Solidarité et Harmonie',
      description: "Ny firaisankina no herin'ny Malagasy.",
      difficulty: 'EASY',
      passThreshold: 5,
      totalSentences: 10,
      status: 'PUBLISHED',
      sentences: {
        create: LEVEL_1_SENTENCES,
      },
    },
  });

  const l2 = await prisma.wordPuzzleLevel.create({
    data: {
      levelNumber: 2,
      titleMg: 'Fahendrena sy Fanabeazana',
      titleFr: 'Sagesse et Éducation',
      description: 'Ny fahendrena no lova tsara indrindra.',
      difficulty: 'MEDIUM',
      passThreshold: 5,
      totalSentences: 10,
      status: 'PUBLISHED',
      sentences: {
        create: LEVEL_2_SENTENCES,
      },
    },
  });

  console.log(
    `✅ Succès : Niveau 1 (ID: ${l1.id}) et Niveau 2 (ID: ${l2.id}) créés avec 10 phrases chacun !`,
  );
}

seed()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
