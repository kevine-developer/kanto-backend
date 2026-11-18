import { ContentAccessControlService } from './content-access-control.service.js';

describe('ContentAccessControlService', () => {
  let service: ContentAccessControlService;

  beforeEach(() => {
    service = new ContentAccessControlService();
  });

  describe('isVip', () => {
    it('retourne false si aucun utilisateur fourni', () => {
      expect(service.isVip(null)).toBe(false);
      expect(service.isVip(undefined)).toBe(false);
    });

    it('retourne false pour un utilisateur FREE', () => {
      expect(service.isVip({ tier: 'FREE' })).toBe(false);
    });

    it('retourne true pour un utilisateur VIP sans expiration', () => {
      expect(service.isVip({ tier: 'VIP' })).toBe(true);
      expect(service.isVip({ tier: 'PREMIUM' })).toBe(true);
    });

    it('retourne true pour un utilisateur VIP avec expiration future', () => {
      const future = new Date(Date.now() + 1000000);
      expect(service.isVip({ tier: 'VIP', tierExpiresAt: future })).toBe(true);
    });

    it('retourne false pour un utilisateur VIP dont l’abonnement a expiré', () => {
      const past = new Date(Date.now() - 1000000);
      expect(service.isVip({ tier: 'VIP', tierExpiresAt: past })).toBe(false);
    });

    it('retourne true pour un compte ADMIN indépendamment du tier', () => {
      expect(service.isVip({ role: 'ADMIN', tier: 'FREE' })).toBe(true);
    });
  });

  describe('filterConte', () => {
    const mockConte = {
      id: 'c-1',
      title: 'Ibonia sy Ravololona',
      isPremium: true,
      audioUrlMg: 'https://cdn.kanto.mg/audio/ibonia.mp3',
      audioUrlFr: 'https://cdn.kanto.mg/audio/ibonia-fr.mp3',
      paragraphs: [
        { paragraphNumber: 1, textMg: 'P1' },
        { paragraphNumber: 2, textMg: 'P2' },
        { paragraphNumber: 3, textMg: 'P3' },
        { paragraphNumber: 4, textMg: 'P4' },
      ],
    };

    it('fournit le conte intégral pour un utilisateur VIP', () => {
      const filtered = service.filterConte(mockConte, { tier: 'VIP' });
      expect(filtered?.audioUrlMg).toBe('https://cdn.kanto.mg/audio/ibonia.mp3');
      expect(filtered?.paragraphs).toHaveLength(4);
      expect(filtered?.isLocked).toBe(false);
      expect(filtered?.previewOnly).toBe(false);
    });

    it('masque les audios et tronque les paragraphes à 2 pour un utilisateur gratuit', () => {
      const filtered = service.filterConte(mockConte, { tier: 'FREE' });
      expect(filtered?.audioUrlMg).toBeNull();
      expect(filtered?.audioUrlFr).toBeNull();
      expect(filtered?.paragraphs).toHaveLength(2);
      expect(filtered?.isLocked).toBe(true);
      expect(filtered?.previewOnly).toBe(true);
      expect(filtered?.paywallMessage).toContain('Kanto VIP');
    });

    it('retourne le conte complet si isPremium = false même pour un utilisateur gratuit', () => {
      const freeConte = { ...mockConte, isPremium: false };
      const filtered = service.filterConte(freeConte, { tier: 'FREE' });
      expect(filtered?.audioUrlMg).toBe('https://cdn.kanto.mg/audio/ibonia.mp3');
      expect(filtered?.paragraphs).toHaveLength(4);
      expect(filtered?.isLocked).toBe(false);
    });
  });

  describe('filterPoesie', () => {
    const mockPoesie = {
      id: 'p-1',
      title: 'Hanina',
      isPremium: true,
      audioUrl: 'https://cdn.kanto.mg/audio/poeme.mp3',
      content: 'A'.repeat(500),
    };

    it('tronque le contenu et masque l’audio pour un utilisateur gratuit', () => {
      const filtered = service.filterPoesie(mockPoesie, { tier: 'FREE' });
      expect(filtered?.audioUrl).toBeNull();
      expect(filtered?.content.length).toBeLessThan(250);
      expect(filtered?.isLocked).toBe(true);
      expect(filtered?.previewOnly).toBe(true);
    });
  });
});
