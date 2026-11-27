import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BetaEmailDispatcherService } from './beta-email-dispatcher.service.js';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';
import { ResendService } from '../../integrations/resend/resend.service.js';
import { encryptEmail } from '../utils/beta-crypto.util.js';

describe('BetaEmailDispatcherService', () => {
  let service: BetaEmailDispatcherService;
  let prisma: {
    betaAutomationConfig: {
      findFirst: jest.Mock<any>;
    };
    betaEmailTemplate: {
      findUnique: jest.Mock<any>;
    };
  };
  let resendService: {
    sendEmail: jest.Mock<any>;
  };

  beforeEach(async () => {
    prisma = {
      betaAutomationConfig: {
        findFirst: jest.fn<any>().mockResolvedValue({
          supportEmail: 'support@kanto.mg',
          playStoreWebLink:
            'https://play.google.com/apps/testing/com.devengalere.kantomg',
          playStoreAppLink:
            'https://play.google.com/store/apps/details?id=com.devengalere.kantomg',
          testFlightPublicLink: 'https://testflight.apple.com/join/kantomg',
        }),
      },
      betaEmailTemplate: {
        findUnique: jest.fn<any>(),
      },
    };

    resendService = {
      sendEmail: jest.fn<any>().mockResolvedValue({ id: 'resend_mock_id' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BetaEmailDispatcherService,
        { provide: PrismaService, useValue: prisma },
        { provide: ResendService, useValue: resendService },
      ],
    }).compile();

    service = module.get<BetaEmailDispatcherService>(
      BetaEmailDispatcherService,
    );
  });

  it('doit envoyer l’email de confirmation avec uniquement les étapes iOS TestFlight (sans étapes Android)', async () => {
    // Cas où le template en base n'existe pas encore (utilise le fallback BUILTIN_FALLBACK_TEMPLATES)
    prisma.betaEmailTemplate.findUnique.mockResolvedValue(null);

    const result = await service.sendTemplateEmail({
      to: 'tester@example.com',
      templateCode: 'CONFIRMATION',
      variables: {
        userName: 'Rova',
        platform: 'iOS',
      },
    });

    expect(result.success).toBe(true);
    expect(result.subject).toContain(
      'Bienvenue dans le programme Bêta Kanto MG',
    );
    expect(resendService.sendEmail).toHaveBeenCalledTimes(1);

    const callArgs = resendService.sendEmail.mock.calls[0][0];
    expect(callArgs.to).toBe('tester@example.com');
    expect(callArgs.subject).toBe(
      'Bienvenue dans le programme Bêta Kanto MG — Vos étapes d’accès',
    );
    expect(callArgs.html).toContain('Manao ahoana Rova');
    // Vérification qu'aucune étape Android n'est incluse
    expect(callArgs.html).not.toContain('Pour les appareils Android');
    expect(callArgs.html).not.toContain('groups.google.com');
    expect(callArgs.html).not.toContain('play.google.com');
    expect(callArgs.html).not.toContain(
      'Étape 1 : Valider votre accès testeur',
    );
    // Vérification des étapes iOS
    expect(callArgs.html).toContain('Pour iPhone &amp; iPad (Apple iOS)');
    expect(callArgs.html).toContain('Étape 1 : Installer Apple TestFlight');
    expect(callArgs.html).toContain(
      'https://apps.apple.com/app/testflight/id899247664',
    );
    expect(callArgs.html).toContain('Étape 2 : Rejoindre la bêta Kanto MG');
    expect(callArgs.html).toContain(
      'https://testflight.apple.com/join/kantomg',
    );
    // Vérification des boutons
    expect(callArgs.html).toContain('Accéder au portail de téléchargement');
    expect(callArgs.html).toContain(
      'https://app-kanto.gastsar.fr/#telechargement',
    );
    expect(callArgs.html).toContain('Transmettre un avis ou un bug');
    expect(callArgs.html).toContain('https://app-kanto.gastsar.fr/#feedback');
  });

  it('doit déchiffrer automatiquement une adresse e-mail chiffrée', async () => {
    prisma.betaEmailTemplate.findUnique.mockResolvedValue(null);
    const encrypted = encryptEmail('secret-tester@example.com');

    await service.sendTemplateEmail({
      to: encrypted,
      templateCode: 'CONFIRMATION',
      variables: {
        userName: 'Faly',
        platform: 'iOS',
      },
    });

    const callArgs = resendService.sendEmail.mock.calls[0][0];
    expect(callArgs.to).toBe('secret-tester@example.com');
    expect(callArgs.html).toContain('Faly');
  });

  it('doit envoyer le mail de rappel ALREADY_REGISTERED avec uniquement les étapes iOS et le contact admin', async () => {
    prisma.betaEmailTemplate.findUnique.mockResolvedValue(null);

    const result = await service.sendTemplateEmail({
      to: 'already@example.com',
      templateCode: 'ALREADY_REGISTERED',
      variables: {
        userName: 'Aina',
        platform: 'iOS',
        supportEmail: 'contact@kanto.mg',
      },
    });

    expect(result.success).toBe(true);
    expect(result.subject).toContain('Vous êtes déjà inscrit');

    const callArgs = resendService.sendEmail.mock.calls[0][0];
    expect(callArgs.to).toBe('already@example.com');
    expect(callArgs.html).toContain('Manao ahoana Aina');
    expect(callArgs.html).toContain(
      'Vous faites déjà partie de nos bêta-testeurs officiels',
    );
    expect(callArgs.html).not.toContain('Pour les appareils Android');
    expect(callArgs.html).not.toContain('play.google.com');
    expect(callArgs.html).toContain('Pour iPhone &amp; iPad (Apple iOS)');
    expect(callArgs.html).toContain('Étape 1 : Installer Apple TestFlight');
    expect(callArgs.html).toContain(
      'Un problème pour accéder aux tests ou une question ?',
    );
    expect(callArgs.html).toContain('contact@kanto.mg');
    expect(callArgs.html).toContain('Accéder au portail de téléchargement');
    expect(callArgs.html).toContain('Contacter l’administrateur');
  });

  it('doit nettoyer un bloc d’étapes Android hérité provenant de la base de données sans altérer le bloc iOS suivant', async () => {
    prisma.betaEmailTemplate.findUnique.mockResolvedValue({
      code: 'ALREADY_REGISTERED',
      subject: 'Déjà inscrit Bêta',
      title: 'Accès Bêta',
      contentHtml: `<p>Bonjour {{userName}}</p>
<div style="border-left: 4px solid #4A6741;">
  <div>Pour les appareils Android (Google Play)</div>
  <ol><li>Étape Android</li></ol>
</div>
<div style="border-left: 4px solid #C58B38;">
  <div>Pour iPhone &amp; iPad (Apple iOS)</div>
  <ol><li>Étape TestFlight</li></ol>
</div>
<p>Si votre compte Google Play ou TestFlight n'est pas reconnu, contactez {{supportEmail}}.</p>`,
    });

    await service.sendTemplateEmail({
      to: 'db-legacy@example.com',
      templateCode: 'ALREADY_REGISTERED',
      variables: { userName: 'Soa', platform: 'iOS' },
    });

    const callArgs = resendService.sendEmail.mock.calls[0][0];
    expect(callArgs.html).not.toContain('Pour les appareils Android');
    expect(callArgs.html).not.toContain('Étape Android');
    expect(callArgs.html).not.toContain('compte Google Play');
    expect(callArgs.html).toContain('Pour iPhone &amp; iPad (Apple iOS)');
    expect(callArgs.html).toContain('Étape TestFlight');
    expect(callArgs.html).toContain('accès TestFlight');
  });

  it('doit filtrer et supprimer automatiquement tous les emojis natifs du sujet et du contenu', async () => {
    prisma.betaEmailTemplate.findUnique.mockResolvedValue({
      subject: '🚀 Bienvenue dans la bêta 👑 !',
      title: 'Accès Bêta 🎉',
      contentHtml: '<p>👉 Cliquez ici 📲 pour installer ! 💬 Merci ⚠️</p>',
    });

    await service.sendTemplateEmail({
      to: 'clean-tester@example.com',
      templateCode: 'CUSTOM_TEST',
      variables: {
        userName: 'Rakoto 📱',
      },
    });

    const callArgs = resendService.sendEmail.mock.calls[0][0];
    const emojiRegex =
      /[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

    expect(emojiRegex.test(callArgs.subject)).toBe(false);
    expect(emojiRegex.test(callArgs.html)).toBe(false);
    expect(emojiRegex.test(callArgs.text)).toBe(false);
    expect(callArgs.subject).toBe('Bienvenue dans la bêta !');
    expect(callArgs.html).toContain('Cliquez ici pour installer ! Merci');
  });
});
