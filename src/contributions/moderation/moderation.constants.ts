import { ModerationCategory, ModerationSeverity } from './moderation.types.js';

export interface TermDefinition {
  term: string;
  category: ModerationCategory;
  severity: ModerationSeverity;
  language: 'fr' | 'mg' | 'en' | 'multi';
  isRegex?: boolean;
}

/**
 * Liste blanche de mots légitimes en Français, Malgache et Anglais afin d'éviter tout faux positif.
 * Ces termes ne doivent JAMAIS déclencher d'alerte, même s'ils partagent une racine ou sous-chaîne.
 */
export const MODERATION_WHITELIST = new Set<string>([
  // ─── Termes français usuels ──────────────────────────────────────────────
  'contexte',
  'contextes',
  'constat',
  'concours',
  'contrat',
  'condition',
  'conditions',
  'retard',
  'retarder',
  'classique',
  'classicisme',
  'conte',
  'contes',
  'raconter',
  'culture',
  'culte',
  'brouillon',
  'passion',
  'passions',
  'discours',
  'baiser',
  'amour',
  'amoureux',
  'tendresse',
  'commencer',
  'comment',
  'racisme',
  'analyse',
  'titre',
  'bouton',
  'cuisine',
  'pression',

  // ─── Termes anglais usuels (Scunthorpe problem prevention) ────────────────
  'class',
  'classes',
  'classic',
  'classical',
  'classicism',
  'asset',
  'assets',
  'pass',
  'passage',
  'compassion',
  'bass',
  'dickens',
  'document',
  'documents',
  'button',
  'buttons',
  'cocktail',
  'scunthorpe',
  'assume',
  'assignment',
  'title',
  'hello',
  'analysis',
  'analytics',
  'analytical',
  'grape',
  'drape',
  'scrape',
  'therapist',
  'shift',
  'shirt',
  'sheet',
  'short',
  'beach',
  'pitch',
  'witch',
  'butter',
  'peanut',
  'count',
  'country',
  'county',
  'counter',

  // ─── Termes culturels et linguistiques malgaches légitimes ────────────────
  'tsara',
  'kanto',
  'fady', // Interdit rituel traditionnel
  'fihavanana', // Solidarité fraternelle
  'razana', // Ancêtres
  'ombilahy', // Taureau / force
  'ombalahy',
  'alina', // Nuit
  'vavy', // Féminin / femme
  'lahy', // Masculin / homme
  'zanaka', // Enfant
  'ray', // Père
  'reny', // Mère
  'havana', // Parents / famille
  'soavaly', // Cheval
  'omby', // Bœuf / zébu
  'tanindrazana',
  'fanahy',
  'fomba',
  'hasina',
  'kabary',
  'angano',
  'tononkalo',
  'ohabolana',
  'sakalava',
  'merina',
  'betsimisaraka',
  'antandroy',
  'antemoro',
  'bara',
  'tanala',
  'betsileo',
  'tsimihety',
  'vezo',
  'antakarana',
  'sihanaka',
  'bezanozano',
  'antambahoaka',
  'mahafaly',
  'antanosy',
]);

/**
 * Dictionnaire centralisé des termes sensibles et interdits par catégorie.
 * Prise en charge exhaustive de l'Anglais (EN), du Français (FR) et du Malgache (MG).
 */
export const SENSITIVE_TERMS: TermDefinition[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. CONTENUS SEXUELS EXPLICITES / PORNOGRAPHIQUES (SEXUAL_CONTENT)
  // ─────────────────────────────────────────────────────────────────────────────
  // Anglais
  {
    term: 'porn',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'pornography',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'pornographic',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  { term: 'xxx', category: 'SEXUAL_CONTENT', severity: 'HIGH', language: 'en' },
  {
    term: 'nudes',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'naked',
    category: 'SEXUAL_CONTENT',
    severity: 'MEDIUM',
    language: 'en',
  },
  {
    term: 'blowjob',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'handjob',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'dildo',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'dick',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'cock',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'pussy',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'vagina',
    category: 'SEXUAL_CONTENT',
    severity: 'MEDIUM',
    language: 'en',
  },
  {
    term: 'penis',
    category: 'SEXUAL_CONTENT',
    severity: 'MEDIUM',
    language: 'en',
  },
  {
    term: 'boobs',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'tits',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  { term: 'cum', category: 'SEXUAL_CONTENT', severity: 'HIGH', language: 'en' },
  {
    term: 'ejaculation',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'orgasm',
    category: 'SEXUAL_CONTENT',
    severity: 'MEDIUM',
    language: 'en',
  },
  {
    term: 'deepthroat',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'milf',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'hentai',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'gangbang',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'bdsm',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'incest',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'pedophilia',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'pedophile',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'zoophilia',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'rape',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'rapist',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'molest',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'onlyfans',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'sextape',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'en',
  },

  // Français
  {
    term: 'porno',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'pornographie',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'pornographique',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'bite',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'bites',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'chatte',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'couille',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'couilles',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'baise',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'baiser',
    category: 'SEXUAL_CONTENT',
    severity: 'MEDIUM',
    language: 'fr',
  },
  {
    term: 'niquer',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'nique',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'foutre',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'fellation',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'sodomie',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'penetration',
    category: 'SEXUAL_CONTENT',
    severity: 'MEDIUM',
    language: 'fr',
  },
  {
    term: 'ejaculation',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'masturbation',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'orgasme',
    category: 'SEXUAL_CONTENT',
    severity: 'MEDIUM',
    language: 'fr',
  },
  {
    term: 'zoophilie',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'pedophilie',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'pedophile',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'inceste',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'viol',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'violeur',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'partouze',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'fr',
  },

  // Malgache
  {
    term: 'firaisana ara-nofo maloto',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'filana ara-nofo tafahoatra',
    category: 'SEXUAL_CONTENT',
    severity: 'MEDIUM',
    language: 'mg',
  },
  {
    term: 'manolana',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'mg',
  }, // Violer
  {
    term: 'fanolanana',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'mg',
  }, // Viol
  {
    term: 'vetaveta',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'mg',
  }, // Obscénité
  {
    term: 'fijangajangana',
    category: 'SEXUAL_CONTENT',
    severity: 'MEDIUM',
    language: 'mg',
  },
  {
    term: 'bodofotsy',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'mg',
  }, // Argot obscène
  {
    term: 'miboridana',
    category: 'SEXUAL_CONTENT',
    severity: 'MEDIUM',
    language: 'mg',
  },
  {
    term: 'fikitihana zaza',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'mamolaka zaza',
    category: 'SEXUAL_CONTENT',
    severity: 'HIGH',
    language: 'mg',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. INSULTES, GROSSIÈRETÉS ET VULGARITÉS (PROFANITY_VULGARITY)
  // ─────────────────────────────────────────────────────────────────────────────
  // Anglais
  {
    term: 'fuck',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'fucking',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'fucked',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'fucker',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'motherfucker',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'bitch',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'bitches',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'bastard',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'asshole',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'assholes',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'dipshit',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'shit',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'bullshit',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'cunt',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'cunts',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'dickhead',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'dumbass',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'wanker',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'prick',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'shut the fuck up',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'stfu',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'piss off',
    category: 'PROFANITY_VULGARITY',
    severity: 'MEDIUM',
    language: 'en',
  },

  // Français
  {
    term: 'merde',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'putain',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'pute',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'putes',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'salope',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'salopes',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'connard',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'connards',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'connasse',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'con',
    category: 'PROFANITY_VULGARITY',
    severity: 'MEDIUM',
    language: 'fr',
  },
  {
    term: 'conne',
    category: 'PROFANITY_VULGARITY',
    severity: 'MEDIUM',
    language: 'fr',
  },
  {
    term: 'encule',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'enculer',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'enculee',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'batard',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'batards',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'salopard',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'chienne',
    category: 'PROFANITY_VULGARITY',
    severity: 'MEDIUM',
    language: 'fr',
  },
  {
    term: 'fdp',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'ntm',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'ta gueule',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'ferme ta gueule',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'trouduc',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'trou du cul',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'enfoire',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'fr',
  },

  // Malgache
  {
    term: 'alika vavy',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'bory saina',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'amboa',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'boka',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'adala',
    category: 'PROFANITY_VULGARITY',
    severity: 'MEDIUM',
    language: 'mg',
  },
  {
    term: 'adaladala',
    category: 'PROFANITY_VULGARITY',
    severity: 'MEDIUM',
    language: 'mg',
  },
  {
    term: 'biby',
    category: 'PROFANITY_VULGARITY',
    severity: 'MEDIUM',
    language: 'mg',
  },
  {
    term: 'maloto vava',
    category: 'PROFANITY_VULGARITY',
    severity: 'MEDIUM',
    language: 'mg',
  },
  {
    term: 'fositra',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'tsinahy',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'mpamosavy',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'mpangalatra',
    category: 'PROFANITY_VULGARITY',
    severity: 'MEDIUM',
    language: 'mg',
  },
  {
    term: 'kentrana',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'bado',
    category: 'PROFANITY_VULGARITY',
    severity: 'MEDIUM',
    language: 'mg',
  },
  {
    term: 'vendrana',
    category: 'PROFANITY_VULGARITY',
    severity: 'MEDIUM',
    language: 'mg',
  },
  {
    term: 'voretra',
    category: 'PROFANITY_VULGARITY',
    severity: 'MEDIUM',
    language: 'mg',
  },
  {
    term: 'taim-bava',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'tay be',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'maimbo vava',
    category: 'PROFANITY_VULGARITY',
    severity: 'HIGH',
    language: 'mg',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. PROPOS HAINEUX, DISCRIMINATOIRES OU INCITATION À LA VIOLENCE (HATE_SPEECH_DISCRIMINATION)
  // ─────────────────────────────────────────────────────────────────────────────
  // Anglais
  {
    term: 'nigger',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'niggers',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'nigga',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'fag',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'faggot',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'faggots',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'kike',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'chink',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'spic',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'wetback',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'kill all blacks',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'kill all whites',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'kill all jews',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'kill all muslims',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'death to all',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'white supremacy',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'neo-nazi',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'nazi',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'hitler',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'genocide',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'subhuman',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'en',
  },

  // Français
  {
    term: 'negre',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'negres',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'negresse',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'bougnoule',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'youpin',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'gouine',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'pede',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'tapette',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'tarlouze',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'sale noir',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'sale blanc',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'sale arabe',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'sale juif',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'sale chinois',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'mort aux',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'tuer tous les',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'exterminer',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'purification ethnique',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'nazisme',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'nazi',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'hitler',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'supremaciste',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'negrophobe',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'antisemite',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'islamophobe',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'sous-homme',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'fr',
  },

  // Malgache
  {
    term: 'haringana',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'fankahalana foko',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'foko ratsy',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'ripaka',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'vonoy',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'olona ambany foko',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'fanavakavaham-bolonkoditra',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'fanilikilihana foko',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'vazaha maloto',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'karana maloto',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'mainty maloto',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'foko maizina',
    category: 'HATE_SPEECH_DISCRIMINATION',
    severity: 'HIGH',
    language: 'mg',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. HARCÈLEMENT, MENACES ET ATTAQUES PERSONNELLES (HARASSMENT_THREATS)
  // ─────────────────────────────────────────────────────────────────────────────
  // Anglais
  {
    term: 'i will kill you',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'kill yourself',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'kys',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'hope you die',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'slit your throat',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'beat you up',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'hang yourself',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'shoot you',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'i will hunt you down',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'i will find you',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'bomb threat',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'terrorist attack',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'blow up',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'mass murder',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'assassinate',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'en',
  },

  // Français
  {
    term: 'je vais te tuer',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'je vais vous tuer',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'creve',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'suicide-toi',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'va mourir',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'va te pendre',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'egorger',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'te massacrer',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'violer',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'attentat',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'poser une bombe',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'faire sauter',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'assassiner',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'menace de mort',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'balle dans la tete',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'fr',
  },

  // Malgache
  {
    term: 'hamono anao',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'hovonoina',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'hotapahana tenda',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'maty ianao',
    category: 'HARASSMENT_THREATS',
    severity: 'MEDIUM',
    language: 'mg',
  },
  {
    term: 'handoro trano',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'ho darohana',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'hofatorana',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'hampijaliana',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'hovonoiko ianao',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'aripako ianareo',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'mg',
  },
  {
    term: 'hofafako',
    category: 'HARASSMENT_THREATS',
    severity: 'HIGH',
    language: 'mg',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. CONTRAIRE AUX CGU / SPAM COMMERCIAL / ABUS (TERMS_VIOLATION)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    term: 'casino en ligne',
    category: 'TERMS_VIOLATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'paris sportifs',
    category: 'TERMS_VIOLATION',
    severity: 'MEDIUM',
    language: 'fr',
  },
  {
    term: 'gagner argent facile',
    category: 'TERMS_VIOLATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'cliquez ici',
    category: 'TERMS_VIOLATION',
    severity: 'MEDIUM',
    language: 'fr',
  },
  {
    term: 'téléphoner au 08',
    category: 'TERMS_VIOLATION',
    severity: 'HIGH',
    language: 'fr',
  },
  {
    term: 'whatsapp +',
    category: 'TERMS_VIOLATION',
    severity: 'MEDIUM',
    language: 'multi',
  },
  {
    term: 'crypto invest',
    category: 'TERMS_VIOLATION',
    severity: 'HIGH',
    language: 'multi',
  },
  {
    term: 'viagra',
    category: 'TERMS_VIOLATION',
    severity: 'HIGH',
    language: 'multi',
  },
  {
    term: 'online casino',
    category: 'TERMS_VIOLATION',
    severity: 'HIGH',
    language: 'en',
  },
  {
    term: 'make money fast',
    category: 'TERMS_VIOLATION',
    severity: 'HIGH',
    language: 'en',
  },
];

/**
 * Table de substitution des caractères leetspeak courants.
 */
export const LEETSPEAK_MAP: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '@': 'a',
  '5': 's',
  $: 's',
  '7': 't',
  '8': 'b',
  '!': 'i',
  '|': 'i',
};
