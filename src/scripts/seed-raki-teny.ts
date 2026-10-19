import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('[Seed Raki-teny] Variable DATABASE_URL manquante dans .env');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SEED_WORDS = [
  {
    id: "somambisamby",
    slug: "somambisamby",
    word: "Somambisamby",
    phonetic: "sou-mam-bi-sam-by",
    category: "nature_temps",
    wordClassMg: "Mpamari-toetra / Anarana",
    wordClassFr: "Adjectif / Nom",
    rarity: "POETIC" as const,
    rarityLabelFr: "Poétique & Évocateur",
    rarityLabelMg: "Haisoratra & Kanto",
    meaningMg:
      "Fotoana na toetry ny andro manalasala eo anelanelan'ny mazava sy ny maizina, indrindra amin'ny hariva mody masoandro na maraina vao mangiran-dratsy.",
    meaningFr:
      "Le crépuscule ou la pénombre feutrée ; l'état incertain et doux entre le jour déclinant et la tombée de la nuit.",
    exampleMg:
      "Mody an-tanàna ny mpamboly rehefa manomboka somambisamby ny vohitra.",
    exampleFr:
      "Les paysans regagnent le village lorsque la pénombre crépusculaire enveloppe les collines.",
    contextUsage: "Poésie, récits contemplatifs, littérature d'ambiance.",
    etymology: "Avy amin'ny fitambaran'ny 'somambo' (manjavozavo) sy ny fiverenan-teny maneho halefahana.",
  },
  {
    id: "kalomanga",
    slug: "kalomanga",
    word: "Kalomanga",
    phonetic: "ka-lou-man-ga",
    category: "art_musique",
    wordClassMg: "Anarana",
    wordClassFr: "Nom masculin",
    rarity: "VERY_RARE" as const,
    rarityLabelFr: "Très Rare",
    rarityLabelMg: "Tena Vitsy Mpampiasa",
    meaningMg:
      "Feo kanto sy mirindra fatratra, manaitra ny fo amam-panahy ary mampitolagaga ny mpihaino.",
    meaningFr:
      "Une mélodie sublime ou une voix enchanteresse qui saisit l'âme par sa pureté et son harmonie parfaite.",
    exampleMg:
      "Nampientana ny valalabemandry ny kalomanga narindran'ilay mpitendry valiha.",
    exampleFr:
      "La mélodie sublime du joueur de valiha a ému aux larmes toute l'assemblée.",
    contextUsage: "Art oratoire ancien, chants royaux, louanges.",
    etymology: "Fitambaran'ny 'kalo' (tononkira, fihirana) sy 'manga' (ambony, mendrika, kanto).",
  },
  {
    id: "antambo",
    slug: "antambo",
    word: "Antambo",
    phonetic: "an-tam-bou",
    category: "destin_croyance",
    wordClassMg: "Anarana",
    wordClassFr: "Nom masculin",
    rarity: "ARCHAIC" as const,
    rarityLabelFr: "Ancien & Mystique",
    rarityLabelMg: "Teny Tranainy",
    meaningMg:
      "Loza lehibe tampoka, loza mahatsiravina heverina ho vokatry ny fandikana fady na tsiny avy amin'ny tontolo tsy hita maso.",
    meaningFr:
      "Fléau soudain, calamité majeure ou cataclysme perçu traditionnellement comme la conséquence de la transgression d'un tabou (fady).",
    exampleMg:
      "Nivavaka ny Ntaolo mba tsy hanjo ny vohitra ny antambo sy ny loza mananontanona.",
    exampleFr:
      "Les ancêtres priaient solennellement pour préserver la communauté des fléaux et des grandes calamités.",
    contextUsage: "Cérémonies sacrificielles (joro), fomban-drazana, contes anciens.",
    etymology: "Fakanteny nentim-paharazana ilazana ny fahatezeran'ny tontolo ara-panahy.",
  },
  {
    id: "angaredona",
    slug: "angaredona",
    word: "Angaredona",
    phonetic: "an-ga-re-dou-na",
    category: "societe_force",
    wordClassMg: "Anarana / Tambinteny",
    wordClassFr: "Nom / Adverbe",
    rarity: "LITERAL" as const,
    rarityLabelFr: "Littéraire & Puissant",
    rarityLabelMg: "Haisoratra Mahitsy",
    meaningMg:
      "Asa na hetsika atao miaraka amin'ny hery mitambatra sy feo miray, tsy misy mihemotra na misalasala.",
    meaningFr:
      "L'effort collectif intense et coordonné ; agir d'un seul élan vigoureux et unanime.",
    exampleMg:
      "Tamin'ny alalan'ny angaredona no nahavitan'ny fokonolona ny fefiloha vaky.",
    exampleFr:
      "C'est grâce à un élan collectif vigoureux et solidaire que le village a reconstruit la digue brisée.",
    contextUsage: "Kabary, mobilisations populaires, solidarité rurale (valin-tanana).",
    etymology: "Avy amin'ny 'angatra' sy 'redona' (fihetsika na feo miray be).",
  },
  {
    id: "ambioka",
    slug: "ambioka",
    word: "Ambioka",
    phonetic: "am-biou-ka",
    category: "nature_racine",
    wordClassMg: "Anarana",
    wordClassFr: "Nom féminin",
    rarity: "VERY_RARE" as const,
    rarityLabelFr: "Très Rare",
    rarityLabelMg: "Tena Vitsy Mpampiasa",
    meaningMg:
      "Moka na voa madinika sisa tavela amin'ny fambolena rehefa vita ny fijinjana; voa velona tehirizina ho an'ny fafy ho avy.",
    meaningFr:
      "La graine de semence précieuse réservée pour la saison future ; l'étincelle ou le germe assurant la survie.",
    exampleMg:
      "Hajao ny ambioka fa io no antoky ny vokatry ny taona manaraka.",
    exampleFr:
      "Préservez le grain de semence, car il est le garant de la prospérité des récoltes futures.",
    contextUsage: "Proverbes agraires profonds, transmission intergénérationnelle.",
    etymology: "Teny tranainy nampiasaina tamin'ny fambolem-bary tany afovoan-tany.",
  },
  {
    id: "kindriandrina",
    slug: "kindriandrina",
    word: "Kindriandrina",
    phonetic: "kin-drian-dri-na",
    category: "comportement",
    wordClassMg: "Mpamari-toetra / Anarana",
    wordClassFr: "Adjectif / Nom",
    rarity: "ARCHAIC" as const,
    rarityLabelFr: "Insolite & Ancien",
    rarityLabelMg: "Teny Tranainy",
    meaningMg:
      "Toetra mampiseho fahasahiana diso toerana, fiavonavonana tsy misy fotony na fandikana fahalalam-pomba.",
    meaningFr:
      "Témérité déplacée, arrogance frivole ou bravade irrespectueuse envers les aînés et les coutumes.",
    exampleMg:
      "Ny fahaizana mihaino no fahendrena, fa ny kindriandrina kosa manimba fihavanana.",
    exampleFr:
      "Savoir écouter est la vraie sagesse, tandis que la témérité arrogante brise l'harmonie fraternelle.",
    contextUsage: "Fananarana (leçons morales), kabary fampihavanana.",
    etymology: "Fakan-teny maneso ny fireharehana manalasala.",
  },
  {
    id: "tsindrimandry",
    slug: "tsindrimandry",
    word: "Tsindrimandry",
    phonetic: "tsin-dri-man-dry",
    category: "spiritualite",
    wordClassMg: "Anarana",
    wordClassFr: "Nom masculin",
    rarity: "POETIC" as const,
    rarityLabelFr: "Spirituel & Profond",
    rarityLabelMg: "Lalin-tsaina & Fanahy",
    meaningMg:
      "Fahazavan-tsaina na hevitra ambony tonga tampoka amin'ny olona amin'ny alalan'ny nofy na aingam-panahy avy amin'ny Zanahary.",
    meaningFr:
      "Inspiration divine reçue en songe ; révélation intuitive profonde accordée par les forces supérieures.",
    exampleMg:
      "Nahazo tsindrimandry ilay mpitsabo nentim-paharazana ka nahita ny ravin-kazo hanasitranana.",
    exampleFr:
      "Le guérisseur traditionnel reçut en songe l'inspiration divine qui lui révéla la plante médicinale salvatrice.",
    contextUsage: "Médecine traditionnelle, inspiration poétique, croyances Ntaolo.",
    etymology: "Fitambaran'ny 'tsindry' (fipetrahan-javatra) sy 'mandry' (matory, milamina).",
  },
  {
    id: "tafasiry",
    slug: "tafasiry",
    word: "Tafasiry",
    phonetic: "ta-fa-si-ry",
    category: "communication",
    wordClassMg: "Anarana",
    wordClassFr: "Nom masculin",
    rarity: "LITERAL" as const,
    rarityLabelFr: "Traditionnel & Convivial",
    rarityLabelMg: "Kolontsaina & Resaka",
    meaningMg:
      "Resaka am-pirahalahiana, fifampiresahana milamina sy mahafinaritra ataon'ny mpinamana na fianakaviana manodidina ny afo na eo am-bavahady.",
    meaningFr:
      "Conversation chaleureuse et sereine entre intimes ; causerie paisible au coin du feu à la veillée.",
    exampleMg:
      "Mamy ny tafasiry rehefa injay mivory ny fianakaviana amin'ny hariva mangatsiaka.",
    exampleFr:
      "Comme est douce la causerie au coin du feu lorsque la famille se rassemble durant les soirées fraîches.",
    contextUsage: "Soirées villageoises, littérature de convivialité, souvenirs d'enfance.",
    etymology: "Avy amin'ny 'tafa' (fifanatrehana am-pilaminana) sy 'siry' (firoboroboan'ny teny).",
  },
  {
    id: "vindany",
    slug: "vindany",
    word: "Vindany",
    phonetic: "vin-da-ny",
    category: "societe_force",
    wordClassMg: "Anarana",
    wordClassFr: "Nom masculin",
    rarity: "VERY_RARE" as const,
    rarityLabelFr: "Très Rare",
    rarityLabelMg: "Tena Vitsy Mpampiasa",
    meaningMg:
      "Sazy na onitra tsy maintsy aloa rehefa nanao heloka na nandika fifanarahana masina eo anivon'ny fiaraha-monina.",
    meaningFr:
      "L'amende coutumière ou compensation réparatrice exigée pour restaurer l'ordre après un préjudice commis.",
    exampleMg:
      "Nandoa vindany teo anatrehan'ny fokonolona izy mba hiverenan'ny filaminana.",
    exampleFr:
      "Il s'acquitta de la compensation coutumière devant le conseil communautaire pour rétablir la paix.",
    contextUsage: "Droit coutumier (Dina), assemblées villageoises (Fokonolona).",
    etymology: "Fomba fiteny tranainy mifandray amin'ny fanarenana ny fihavanana simba.",
  },
  {
    id: "hantahanta",
    slug: "hantahanta",
    word: "Hantahanta",
    phonetic: "han-ta-han-ta",
    category: "emotions",
    wordClassMg: "Anarana / Mpamari-toetra",
    wordClassFr: "Nom / Adjectif",
    rarity: "POETIC" as const,
    rarityLabelFr: "Poétique & Subtil",
    rarityLabelMg: "Kanto & Fahatsapana",
    meaningMg:
      "Fisehoana fitiavana malefaka sady misy fitalahoana kely, toy ny ataon'ny zaza amin'ny reniny na ny olon-tiana mifampambomba.",
    meaningFr:
      "Câlinerie délicate, minauderie douce ou tendre sollicitation d'attention empreinte d'affection.",
    exampleMg:
      "Tsy mahatohitra ny hantahantan'ny zanany vao herintaona ny reniny.",
    exampleFr:
      "La mère ne peut résister aux tendres minauderies de son nourrisson.",
    contextUsage: "Poésie lyrique, berceuses (angolam-poko), tendresse familiale.",
    etymology: "Famerenan-teny avy amin'ny 'hanta' (fitakiana fiahiana am-pitiavana).",
  },
  {
    id: "dimbidimby",
    slug: "dimbidimby",
    word: "Dimbidimby",
    phonetic: "dim-bi-dim-by",
    category: "temps_generation",
    wordClassMg: "Anarana",
    wordClassFr: "Nom masculin",
    rarity: "LITERAL" as const,
    rarityLabelFr: "Littéraire & Solennel",
    rarityLabelMg: "Haisoratra Ntaolo",
    meaningMg:
      "Taranaka mifandimby handova ny anarana, ny fahendrena ary ny voninahitry ny razana mandritra ny taona maro.",
    meaningFr:
      "La lignée successive, la postérité ou descendance chargée de perpétuer l'honneur et les valeurs des ancêtres.",
    exampleMg:
      "Hapetraka ho an'ny dimbidimby ny tantaran'ireo mahery fo niady ho an'ny tanindrazana.",
    exampleFr:
      "L'histoire des héros tombés pour la patrie sera fidèlement transmise à la postérité.",
    contextUsage: "Kabary manetriketrika, firaketana tantaram-pianakaviana.",
    etymology: "Famerenana ny 'dimby' (mpandimby, taranaka manaraka).",
  },
  {
    id: "salovan-tany",
    slug: "salovan-tany",
    word: "Salovan-tany",
    phonetic: "sa-lou-van-ta-ny",
    category: "nature_temps",
    wordClassMg: "Anarana fitambarana",
    wordClassFr: "Locution nominale",
    rarity: "ARCHAIC" as const,
    rarityLabelFr: "Insolite & Précieux",
    rarityLabelMg: "Teny Sarobidy",
    meaningMg:
      "Faritra ivelany amin'ny tany na endriky ny vohitra araka ny fahitana azy avy lavitra eny am-paravodilanitra.",
    meaningFr:
      "Le relief visible de la terre à perte de vue ; la ligne d'horizon sculptée par les monts et les vallées.",
    exampleMg:
      "Mampitolagaga ny hakanton'ny salovan-tany rehefa tsinjona avy eny an-tampon-kavoana.",
    exampleFr:
      "La beauté du relief terrestre à perte de vue est saisissante depuis le sommet de la colline.",
    contextUsage: "Description poétique des paysages de l'Imerina et des grands espaces malgaches.",
    etymology: "Avy amin'ny 'salovana' (sarona, endrika miseho ivelany) sy 'tany'.",
  },
  {
    id: "tsindry-hazolena",
    slug: "tsindry-hazolena",
    word: "Tsindry-hazolena",
    phonetic: "tsin-dry ha-zou-le-na",
    category: "justice_societe",
    wordClassMg: "Anarana fitambarana",
    wordClassFr: "Locution nominale",
    rarity: "PROVERBIAL" as const,
    rarityLabelFr: "Proverbial & Historique",
    rarityLabelMg: "Fomba Fiteny Manan-tantara",
    meaningMg:
      "Fampahoriana na fanambakana ny malemy sy ny tsy manan-tsiny amin'ny tsy rariny ataon'ny mpanana fahefana na vola.",
    meaningFr:
      "L'oppression injuste et l'abus de pouvoir exercés sur les plus faibles et démunis sans défense.",
    exampleMg:
      "Mitsangana ny fiarahamonina manohitra ny tsindry-hazolena mba hisian'ny fahamarinana.",
    exampleFr:
      "La communauté se lève contre l'oppression abusive des plus faibles afin d'instaurer la justice.",
    contextUsage: "Discours civiques, revendications sociales, fampianarana momba ny rariny.",
    etymology: "Sarinteny nalaina tamin'ny hazo lena mora tsindriana sy lefitra raha oharina amin'ny hazo maina.",
  },
  {
    id: "ravoravo",
    slug: "ravoravo",
    word: "Ravoravo",
    phonetic: "ra-vou-ra-vou",
    category: "emotions",
    wordClassMg: "Mpamari-toetra",
    wordClassFr: "Adjectif",
    rarity: "POETIC" as const,
    rarityLabelFr: "Poétique & Radieux",
    rarityLabelMg: "Kanto & Fahasambarana",
    meaningMg:
      "Feno hafaliana lalina sy firavoravoana tsy misy fiahiana na alahelo, miseho amin'ny endrika miramirana.",
    meaningFr:
      "Rempli d'une joie sereine, radieuse et festive ; un état de félicité communicative.",
    exampleMg:
      "Ravoravo ny mponina tamin'ny fahatongavan'ny rano madio tao an-tanàna.",
    exampleFr:
      "Les habitants étaient transportés d'une joie radieuse à l'arrivée de l'eau potable dans le village.",
    contextUsage: "Fêtes traditionnelles, poésie d'allégresse, kabary fisaorana.",
    etymology: "Famerenan-teny avy amin'ny 'ravo' (faly, mifaly fatratra).",
  },
];

async function seedRakiTeny() {
  console.log('🌱 Début du seed des Mots Rares & Insolites (Raki-teny Miafina)...');

  let insertedCount = 0;
  for (const item of SEED_WORDS) {
    await prisma.rakiTenyWord.upsert({
      where: { slug: item.slug },
      update: {
        word: item.word,
        phonetic: item.phonetic,
        category: item.category,
        wordClassMg: item.wordClassMg,
        wordClassFr: item.wordClassFr,
        rarity: item.rarity,
        rarityLabelMg: item.rarityLabelMg,
        rarityLabelFr: item.rarityLabelFr,
        meaningMg: item.meaningMg,
        meaningFr: item.meaningFr,
        exampleMg: item.exampleMg,
        exampleFr: item.exampleFr,
        contextUsage: item.contextUsage,
        etymology: item.etymology,
      },
      create: {
        id: item.id,
        slug: item.slug,
        word: item.word,
        phonetic: item.phonetic,
        category: item.category,
        wordClassMg: item.wordClassMg,
        wordClassFr: item.wordClassFr,
        rarity: item.rarity,
        rarityLabelMg: item.rarityLabelMg,
        rarityLabelFr: item.rarityLabelFr,
        meaningMg: item.meaningMg,
        meaningFr: item.meaningFr,
        exampleMg: item.exampleMg,
        exampleFr: item.exampleFr,
        contextUsage: item.contextUsage,
        etymology: item.etymology,
      },
    });
    insertedCount++;
  }

  console.log(`✅ Seed terminé avec succès : ${insertedCount} mots rares enregistrés.`);
}

seedRakiTeny()
  .catch((e) => {
    console.error('❌ Erreur lors du seed Raki-teny :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
