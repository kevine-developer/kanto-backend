import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { DeeplinkController } from './deeplink.controller.js';

describe('DeeplinkController (Passerelle universelle & QR codes)', () => {
  let controller: DeeplinkController;
  let prismaMock: any;
  let mockRes: any;
  let mockReq: any;

  beforeEach(() => {
    prismaMock = {
      malagasyItem: {
        findFirst: jest.fn(),
      },
      conte: {
        findFirst: jest.fn(),
      },
      kabary: {
        findFirst: jest.fn(),
      },
      poesie: {
        findFirst: jest.fn(),
      },
      recitation: {
        findFirst: jest.fn(),
      },
      citation: {
        findFirst: jest.fn(),
      },
      contribution: {
        findUnique: jest.fn(),
        findFirst: jest.fn().mockImplementation(() => Promise.resolve(null)),
      },
      user: {
        findFirst: jest.fn(),
      },
      userQuizSet: {
        findUnique: jest.fn(),
      },
    };

    controller = new DeeplinkController(prismaMock);

    mockReq = {
      url: '/test',
      headers: {},
    };

    mockRes = {
      setHeader: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('1. Fichiers de configuration App Links & Universal Links', () => {
    it('doit servir /.well-known/assetlinks.json avec le bon package Android', () => {
      controller.getAssetLinks(mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/json; charset=utf-8',
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            target: expect.objectContaining({
              namespace: 'android_app',
              package_name: 'com.devengalere.kantomg',
            }),
          }),
        ]),
      );
    });

    it('doit servir /.well-known/apple-app-site-association pour iOS', () => {
      controller.getAppleAppSiteAssociation(mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/json; charset=utf-8',
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          applinks: expect.objectContaining({
            details: expect.arrayContaining([
              expect.objectContaining({
                paths: expect.arrayContaining(['/p/*', '/u/*']),
              }),
            ]),
          }),
        }),
      );
    });
  });

  describe('2. Consultation web des Proverbes (/p/:id)', () => {
    it('doit extraire les données Prisma et afficher le proverbe bilingue avec deep link', async () => {
      prismaMock.malagasyItem.findFirst.mockImplementation(() =>
        Promise.resolve({
          id: 'prov_123',
          slug: 'ny-fihavanana-tahaka-ny-ketsa',
          malagasy: 'Ny fihavanana tahaka ny ketsa',
          french: 'Les liens de parenté sont comme les jeunes pousses de riz',
          meaning: "L'amitié s'entretient avec soin",
          category: 'PROVERBE',
          origins: ['Imerina'],
          status: 'PUBLISHED',
        }),
      );

      mockReq.url = '/p/prov_123';
      await controller.handleProverb('prov_123', mockReq, mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'text/html; charset=utf-8',
      );
      expect(mockRes.send).toHaveBeenCalled();
      const sentHtml = mockRes.send.mock.calls[0][0];

      expect(sentHtml).toContain('Ny fihavanana tahaka ny ketsa');
      expect(sentHtml).toContain('Les liens de parenté sont comme');
      expect(sentHtml).toContain('kantomg://proverbe/prov_123');
      expect(sentHtml).toContain("Ouvrir dans l'application Kanto");
    });

    it('doit afficher une page propre si le proverbe est introuvable', async () => {
      prismaMock.malagasyItem.findFirst.mockImplementation(() =>
        Promise.resolve(null),
      );

      mockReq.url = '/p/non_existant';
      await controller.handleProverb('non_existant', mockReq, mockRes);

      const sentHtml = mockRes.send.mock.calls[0][0];
      expect(sentHtml).toContain('Votoaty tsy hita na voafafa');
    });
  });

  describe('3. Consultation web des Profils Publics (/u/:id)', () => {
    it('doit afficher les informations publiques du profil sans exiger de session', async () => {
      prismaMock.user.findFirst.mockImplementation(() =>
        Promise.resolve({
          id: 'usr_soa_456',
          name: 'Soa Malagasy',
          username: 'soa_kanto',
          image: 'https://cloudinary.com/avatar.jpg',
          progress: {
            level: 5,
            totalXp: 450,
            streakDays: 14,
          },
        }),
      );

      mockReq.url = '/u/usr_soa_456';
      await controller.handleUserProfile('usr_soa_456', mockReq, mockRes);

      const sentHtml = mockRes.send.mock.calls[0][0];
      expect(sentHtml).toContain('Soa Malagasy');
      expect(sentHtml).toContain('@soa_kanto');
      expect(sentHtml).toContain('Dingana 5');
      expect(sentHtml).toContain('450 XP');
      expect(sentHtml).toContain('kantomg://user/usr_soa_456');
    });
  });

  describe('4. Consultation des Contes et Récits (/conte/:id)', () => {
    it('doit afficher le titre et premier paragraphe du conte', async () => {
      prismaMock.conte.findFirst.mockImplementation(() =>
        Promise.resolve({
          id: 'conte_1',
          title: 'Ikotofetsy sy Imahakow',
          titleFr: 'Ikotofetsy et Imahakow',
          author: 'Tantara Ntaolo',
          moralFr: 'La ruse ne triomphe pas toujours',
          paragraphs: [
            {
              textMg: 'Nisy lehilahy roa lahy...',
              textFr: 'Il y avait deux hommes...',
            },
          ],
        }),
      );

      mockReq.url = '/conte/conte_1';
      await controller.handleConte('conte_1', mockReq, mockRes);

      const sentHtml = mockRes.send.mock.calls[0][0];
      expect(sentHtml).toContain('Ikotofetsy sy Imahakow');
      expect(sentHtml).toContain('Nisy lehilahy roa lahy');
      expect(sentHtml).toContain('kantomg://conte/conte_1');
    });
  });

  describe('5. Multijoueur et Téléchargement', () => {
    it('doit générer la passerelle avec le code de partie multijoueur', () => {
      mockReq.url = '/multiplayer?code=SALON7';
      controller.handleMultiplayer('SALON7', mockReq, mockRes);

      const sentHtml = mockRes.send.mock.calls[0][0];
      expect(sentHtml).toContain('Salon #SALON7');
      expect(sentHtml).toContain('kantomg://multiplayer?code=SALON7');
    });

    it('doit servir la page /download avec les informations de téléchargement', () => {
      mockReq.url = '/download';
      controller.handleDownload(mockReq, mockRes);

      const sentHtml = mockRes.send.mock.calls[0][0];
      expect(sentHtml).toContain('Kanto MG — L&#039;application du patrimoine');
      expect(sentHtml).toContain('kantomg://download');
    });
  });

  describe('6. Citations, Poésies, Kabary et Récitations', () => {
    it('doit formater et servir une citation avec auteur', async () => {
      prismaMock.citation.findFirst.mockImplementation(() =>
        Promise.resolve({
          id: 'cit_1',
          citationMg: 'Ny marina mitovy amin’ny rano madio',
          citationFr: 'La vérité est comme une eau limpide',
          sourceName: 'Fahendrena Ntaolo',
          author: { name: 'Dox' },
        }),
      );

      mockReq.url = '/citation/cit_1';
      await controller.handleCitation('cit_1', mockReq, mockRes);

      const sentHtml = mockRes.send.mock.calls[0][0];
      expect(sentHtml).toContain('Ny marina mitovy');
      expect(sentHtml).toContain('La vérité est comme une eau limpide');
      expect(sentHtml).toContain('kantomg://citation/cit_1');
    });

    it('doit formater et servir un discours Kabary avec strophes', async () => {
      prismaMock.kabary.findFirst.mockImplementation(() =>
        Promise.resolve({
          id: 'kab_1',
          title: 'Kabary am-panambadiana',
          titleFr: 'Discours de mariage',
          occasion: 'Fampakarana',
          region: 'Imerina',
          steps: [
            {
              stepNumber: 1,
              textMg: 'Miala tsiny tompoko...',
              textFr: 'Pardonnez notre intrusion...',
            },
          ],
        }),
      );

      mockReq.url = '/kabary/kab_1';
      await controller.handleKabary('kab_1', mockReq, mockRes);

      const sentHtml = mockRes.send.mock.calls[0][0];
      expect(sentHtml).toContain('Kabary am-panambadiana');
      expect(sentHtml).toContain('kantomg://kabary/kab_1');
    });

    it('doit formater et servir une poésie avec ses vers', async () => {
      prismaMock.poesie.findFirst.mockImplementation(() =>
        Promise.resolve({
          id: 'poe_1',
          title: 'Haintenin-drazana',
          titleFr: 'Poésie des ancêtres',
          author: 'Jean-Joseph Rabearivelo',
          stanzas: [
            {
              stanzaNumber: 1,
              versesMg: ['Iny volana iny', 'Mibaliaka eny'],
              versesFr: ['Cette lune-là', 'Brille là-haut'],
            },
          ],
        }),
      );

      mockReq.url = '/poesie/poe_1';
      await controller.handlePoesie('poe_1', mockReq, mockRes);

      const sentHtml = mockRes.send.mock.calls[0][0];
      expect(sentHtml).toContain('Haintenin-drazana');
      expect(sentHtml).toContain('kantomg://poesie/poe_1');
    });

    it('doit servir une contribution communautaire approuvée', async () => {
      prismaMock.contribution.findUnique.mockImplementation(() =>
        Promise.resolve({
          id: 'contrib_1',
          textMg: 'Teny mamy mandry fahizay',
          textFr: 'Une parole douce apaise toujours',
          meaning: 'La douceur désamorce les tensions',
          category: 'PROVERBE',
          status: 'APPROVED',
          user: { name: 'Rabe Andrianina', username: 'rabe' },
        }),
      );

      mockReq.url = '/c/contrib_1';
      await controller.handleContribution('contrib_1', mockReq, mockRes);

      const sentHtml = mockRes.send.mock.calls[0][0];
      expect(sentHtml).toContain('Teny mamy mandry fahizay');
      expect(sentHtml).toContain('Rabe Andrianina');
      expect(sentHtml).toContain('kantomg://contribution/contrib_1');
    });

    it('doit servir un deck UGC communautaire public', async () => {
      prismaMock.userQuizSet.findUnique.mockImplementation(() =>
        Promise.resolve({
          id: 'deck_1',
          title: 'Quiz Géographie Malgache',
          description: 'Testez vos repères sur la Grande Île',
          isPublic: true,
          author: { name: 'Soa Guide' },
          _count: { questions: 10 },
        }),
      );

      mockReq.url = '/ugc/deck_1';
      await controller.handleDeck('deck_1', undefined, mockReq, mockRes);

      const sentHtml = mockRes.send.mock.calls[0][0];
      expect(sentHtml).toContain('Quiz Géographie Malgache');
      expect(sentHtml).toContain('10 Fanontaniana');
      expect(sentHtml).toContain('kantomg://ugc/deck_1');
    });
  });
});
