import { ContentModerationService } from './content-moderation.service.js';

describe('ContentModerationService', () => {
  let service: ContentModerationService;

  beforeEach(() => {
    service = new ContentModerationService();
  });

  describe('Contenus sains et licites (FR, MG & EN)', () => {
    it('devrait valider un proverbe traditionnel sans alerte', () => {
      const result = service.moderateContent({
        textMg:
          'Ny fihavanana toy ny kofehin-landy : mitsidika manify, tapaka mankarary.',
        textFr:
          'La parenté et la fraternité sont comme le fil de soie : fin à l’œil, douloureux s’il casse.',
        meaning:
          'Souligne la valeur sacrée des liens sociaux et familiaux malgaches.',
      });

      expect(result.isFlagged).toBe(false);
      expect(result.categories).toHaveLength(0);
      expect(result.matches).toHaveLength(0);
    });

    it('devrait préserver les termes légitimes figurant dans la whitelist culturelle malgache et française', () => {
      const result = service.moderateContent({
        textMg:
          'Ny ombilahy tsara fihavanana dia hajaina fatratra. Fady ny mandika fomba.',
        textFr:
          'Dans le contexte culturel malgache, ce retard est classique mais explicable.',
        meaning: 'Usage traditionnel du mot fady (tabou sacré).',
      });

      expect(result.isFlagged).toBe(false);
      expect(result.categories).toHaveLength(0);
    });

    it('devrait préserver les termes anglais courants (prévention du problème Scunthorpe)', () => {
      const result = service.moderateContent({
        textMg: 'Ohabolana maoderina',
        textFr: 'Traduction anglaise du dicton',
        meaning:
          'This classic story illustrates the value of patience as a priceless asset in our class.',
      });

      expect(result.isFlagged).toBe(false);
      expect(result.categories).toHaveLength(0);
    });
  });

  describe('1. SEXUAL_CONTENT (Contenu pornographique ou sexuellement explicite)', () => {
    it('devrait signaler des termes pornographiques en français', () => {
      const result = service.moderateContent({
        textMg: 'Tantara tsara',
        textFr: 'Une histoire avec du contenu pornographique explicite.',
      });

      expect(result.isFlagged).toBe(true);
      expect(result.categories).toContain('SEXUAL_CONTENT');
    });

    it('devrait signaler des termes sexuels explicites en malgache', () => {
      const result = service.moderateContent({
        textMg: 'Teny vetaveta momba ny firaisana ara-nofo vetaveta',
        textFr: 'Texte descriptif',
      });

      expect(result.isFlagged).toBe(true);
      expect(result.categories).toContain('SEXUAL_CONTENT');
    });

    it('devrait signaler des termes sexuels explicites en anglais', () => {
      const result = service.moderateContent({
        textMg: 'Tantara',
        textFr: 'Description',
        meaning:
          'This website features explicit blowjob, hardcore porn and nudes.',
      });

      expect(result.isFlagged).toBe(true);
      expect(result.categories).toContain('SEXUAL_CONTENT');
    });
  });

  describe('2. PROFANITY_VULGARITY (Insultes, grossièretés, vulgarités)', () => {
    it('devrait intercepter des insultes françaises courantes', () => {
      const result = service.moderateContent({
        textMg: 'Ohabolana',
        textFr: 'Quel connard a inventé cette histoire de merde ?',
      });

      expect(result.isFlagged).toBe(true);
      expect(result.categories).toContain('PROFANITY_VULGARITY');
    });

    it('devrait intercepter des insultes malgaches courantes', () => {
      const result = service.moderateContent({
        textMg: 'Tena olona alika sy bory saina ianao',
        textFr: 'Traduction injurieuse',
      });

      expect(result.isFlagged).toBe(true);
      expect(result.categories).toContain('PROFANITY_VULGARITY');
    });

    it('devrait intercepter des insultes anglaises courantes', () => {
      const result = service.moderateContent({
        textMg: 'Ohabolana',
        textFr: 'Traduction',
        meaning: 'What a fucking motherfucker and total asshole!',
      });

      expect(result.isFlagged).toBe(true);
      expect(result.categories).toContain('PROFANITY_VULGARITY');
    });
  });

  describe('3. HATE_SPEECH_DISCRIMINATION (Propos haineux, racistes, discriminatoires)', () => {
    it('devrait signaler des propos racistes ou haineux en français', () => {
      const result = service.moderateContent({
        textMg: 'Hafatra fankahalana',
        textFr: 'Tous les membres de ce groupe sont sales, mort aux étrangers.',
      });

      expect(result.isFlagged).toBe(true);
      expect(result.categories).toContain('HATE_SPEECH_DISCRIMINATION');
    });

    it('devrait signaler la haine tribale ou discriminatoire en malgache', () => {
      const result = service.moderateContent({
        textMg: 'Fankahalana foko sy haringana ireny olona ireny',
        textFr: 'Traduction',
      });

      expect(result.isFlagged).toBe(true);
      expect(result.categories).toContain('HATE_SPEECH_DISCRIMINATION');
    });

    it('devrait signaler des propos racistes et haineux en anglais', () => {
      const result = service.moderateContent({
        textMg: 'Hafatra',
        textFr: 'Traduction',
        meaning: 'Promoting white supremacy and calling them dirty nigger.',
      });

      expect(result.isFlagged).toBe(true);
      expect(result.categories).toContain('HATE_SPEECH_DISCRIMINATION');
    });
  });

  describe('4. HARASSMENT_THREATS (Menaces physiques, harcèlement, incitations à la violence)', () => {
    it('devrait signaler des menaces explicites en français', () => {
      const result = service.moderateContent({
        textMg: 'Fandrahonana',
        textFr: 'Je vais te tuer sale traître et te faire sauter',
      });

      expect(result.isFlagged).toBe(true);
      expect(result.categories).toContain('HARASSMENT_THREATS');
    });

    it('devrait signaler des menaces explicites en malgache', () => {
      const result = service.moderateContent({
        textMg: 'Hamono anao aho ary hotapahana tenda ianao',
        textFr: 'Traduction',
      });

      expect(result.isFlagged).toBe(true);
      expect(result.categories).toContain('HARASSMENT_THREATS');
    });

    it('devrait signaler des menaces explicites en anglais', () => {
      const result = service.moderateContent({
        textMg: 'Fandrahonana',
        textFr: 'Traduction',
        meaning: 'I will kill you, slit your throat and blow up your house.',
      });

      expect(result.isFlagged).toBe(true);
      expect(result.categories).toContain('HARASSMENT_THREATS');
    });
  });

  describe('Résilience face aux tentatives de contournement', () => {
    it('devrait détecter des variantes avec lettres répétées', () => {
      const result = service.moderateContent({
        textMg: 'Fomba fiteny',
        textFr: 'C est de la meeeerdeee totale !',
      });

      expect(result.isFlagged).toBe(true);
      expect(result.categories).toContain('PROFANITY_VULGARITY');
    });

    it('devrait détecter des variantes en leetspeak', () => {
      const result = service.moderateContent({
        textMg: 'Fomba',
        textFr: 'Tu es un c0nnard',
      });

      expect(result.isFlagged).toBe(true);
      expect(result.categories).toContain('PROFANITY_VULGARITY');
    });
  });

  describe('Protection de la vie privée dans les résultats', () => {
    it('ne doit pas renvoyer le texte brut intégral mais des extraits masqués', () => {
      const result = service.moderateContent({
        textFr: 'Ceci est une phrase contenant merde au milieu.',
      });

      expect(result.isFlagged).toBe(true);
      expect(result.matches.length).toBeGreaterThan(0);
      expect(result.matches[0].contextSnippet).toContain('***');
    });
  });
});
