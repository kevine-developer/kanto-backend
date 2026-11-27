import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';
import { ResendService } from '../../integrations/resend/resend.service.js';
import { maskEmail, decryptEmail } from '../utils/beta-crypto.util.js';

/**
 * Supprime tous les emojis natifs d'une chaîne de caractères pour respecter
 * la charte Kanto MG (sobriété patrimoniale, typographie claire et icônes vectorielles).
 */
export function removeNativeEmojis(text: string): string {
  if (!text) return '';
  return text
    .replace(
      /(?:\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]|\u{FE0F}|\u{FE0E})/gu,
      '',
    )
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

export interface EmailContextVariables {
  userName?: string;
  userEmail?: string;
  platform?: string;
  downloadLink?: string;
  testFlightLink?: string;
  androidTestingLink?: string;
  googleGroupLink?: string;
  appVersion?: string;
  supportEmail?: string;
  unsubscribeLink?: string;
  [key: string]: string | undefined;
}

const BUILTIN_FALLBACK_TEMPLATES: Record<
  string,
  {
    subject: string;
    title: string;
    contentHtml: string;
    buttonText?: string;
    buttonUrl?: string;
    secondaryButtonText?: string;
    secondaryButtonUrl?: string;
    accentColor?: string;
    footerText?: string;
  }
> = {
  CONFIRMATION: {
    subject: 'Bienvenue dans le programme Bêta Kanto MG — Vos étapes d’accès',
    title: 'Votre accès au programme Bêta Kanto MG',
    contentHtml: `<p>Manao ahoana {{userName}},</p>
<p>Votre inscription au programme officiel de bêta-test de <strong>Kanto MG</strong> (plateforme : <strong>{{platform}}</strong>) a été enregistrée avec succès. Misaotra betsaka pour votre engagement à nos côtés pour faire rayonner la langue et la culture malgaches !</p>
<p>Pour installer l'application sur votre iPhone ou iPad via Apple TestFlight et débuter votre exploration, suivez simplement les étapes ci-dessous :</p>

<div style="background-color: #FBF9F5; border: 1px solid #EAE3D5; border-left: 4px solid #C58B38; padding: 16px 18px; margin: 20px 0; border-radius: 8px;">
  <div style="font-weight: 700; color: #4A3515; font-size: 15px; margin-bottom: 10px;">
    Pour iPhone &amp; iPad (Apple iOS)
  </div>
  <ol style="margin: 0; padding-left: 20px; color: #3D3528; line-height: 1.6; font-size: 14px;">
    <li style="margin-bottom: 10px;">
      <strong>Étape 1 : Installer Apple TestFlight</strong><br>
      Téléchargez l'application officielle gratuite d'Apple sur l'App Store :<br>
      <a href="https://apps.apple.com/app/testflight/id899247664" target="_blank" style="display: inline-block; margin-top: 4px; color: #C58B38; font-weight: 600; text-decoration: underline;">Étape 1 : Télécharger TestFlight sur l'App Store &rarr;</a>
    </li>
    <li>
      <strong>Étape 2 : Rejoindre la bêta Kanto MG</strong><br>
      Depuis votre appareil iOS, cliquez sur l'invitation pour installer l'application :<br>
      <a href="{{testFlightLink}}" target="_blank" style="display: inline-block; margin-top: 4px; color: #C58B38; font-weight: 600; text-decoration: underline;">Étape 2 : Rejoindre le test sur TestFlight &rarr;</a>
    </li>
  </ol>
</div>

<div style="margin-top: 22px; padding: 14px 18px; background-color: #F5F4F0; border-radius: 8px; font-size: 13px; color: #555550; line-height: 1.5; border: 1px solid #E5E2DB;">
  <strong>Vos impressions nous aident à progresser :</strong> Si vous rencontrez la moindre anomalie ou si vous souhaitez suggérer une amélioration culturelle ou ergonomique, vous pouvez répondre directement à cet e-mail ou utiliser notre portail de retours.
</div>

<p style="margin-top: 18px;">Nous vous souhaitons une excellente découverte de Kanto MG !</p>`,
    buttonText: 'Accéder au portail de téléchargement',
    buttonUrl: 'https://app-kanto.gastsar.fr/#telechargement',
    secondaryButtonText: 'Transmettre un avis ou un bug',
    secondaryButtonUrl: 'https://app-kanto.gastsar.fr/#feedback',
    accentColor: '#4A6741',
    footerText:
      'Kanto MG — Le sanctuaire de la culture malgache. Une question ? Écrivez à {{supportEmail}}.',
  },
  ALREADY_REGISTERED: {
    subject: 'Vous êtes déjà inscrit au programme Bêta Kanto MG — Vos accès',
    title: 'Votre accès au programme Bêta Kanto MG',
    contentHtml: `<p>Manao ahoana {{userName}},</p>
<p>Une demande d’inscription a été effectuée avec cette adresse e-mail (<strong>{{userEmail}}</strong>). Vous faites déjà partie de nos bêta-testeurs officiels pour la plateforme : <strong>{{platform}}</strong>.</p>
<p>Vos accès sont actifs ! Voici la marche à suivre pour installer ou retrouver Kanto MG sur votre appareil iOS :</p>

<div style="background-color: #FBF9F5; border: 1px solid #EAE3D5; border-left: 4px solid #C58B38; padding: 16px 18px; margin: 20px 0; border-radius: 8px;">
  <div style="font-weight: 700; color: #4A3515; font-size: 15px; margin-bottom: 10px;">
    Pour iPhone &amp; iPad (Apple iOS)
  </div>
  <ol style="margin: 0; padding-left: 20px; color: #3D3528; line-height: 1.6; font-size: 14px;">
    <li style="margin-bottom: 10px;">
      <strong>Étape 1 : Installer Apple TestFlight</strong><br>
      Téléchargez l'application officielle gratuite sur l'App Store :<br>
      <a href="https://apps.apple.com/app/testflight/id899247664" target="_blank" style="display: inline-block; margin-top: 4px; color: #C58B38; font-weight: 600; text-decoration: underline;">Étape 1 : Télécharger TestFlight sur l'App Store &rarr;</a>
    </li>
    <li>
      <strong>Étape 2 : Ouvrir l'invitation TestFlight</strong><br>
      Rejoignez la version de test Kanto MG depuis votre iPhone ou iPad :<br>
      <a href="{{testFlightLink}}" target="_blank" style="display: inline-block; margin-top: 4px; color: #C58B38; font-weight: 600; text-decoration: underline;">Étape 2 : Ouvrir le test sur TestFlight &rarr;</a>
    </li>
  </ol>
</div>

<div style="margin-top: 22px; padding: 14px 18px; background-color: #FDF9F3; border: 1px solid #EADBCC; border-left: 4px solid #C58B38; border-radius: 8px; font-size: 13px; color: #4A3515; line-height: 1.5;">
  <strong>Un problème pour accéder aux tests ou une question ?</strong><br>
  Si vous rencontrez la moindre difficulté technique pour installer l'application, si votre accès TestFlight n'est pas reconnu, ou si vous n'êtes pas à l'origine de cette demande, vous pouvez contacter directement l'administrateur à l'adresse <a href="mailto:{{supportEmail}}" style="color: #4A6741; font-weight: 700; text-decoration: underline;">{{supportEmail}}</a> ou simplement répondre à cet e-mail.
</div>

<p style="margin-top: 18px;">Misaotra betsaka pour votre fidélité et votre soutien continu !</p>`,
    buttonText: 'Accéder au portail de téléchargement',
    buttonUrl: 'https://app-kanto.gastsar.fr/#telechargement',
    secondaryButtonText: 'Contacter l’administrateur',
    secondaryButtonUrl: 'mailto:{{supportEmail}}',
    accentColor: '#4A6741',
    footerText:
      'Kanto MG — Le sanctuaire de la culture malgache. Une question ? Écrivez à {{supportEmail}}.',
  },
  UNSUBSCRIBE_CONFIRMATION: {
    subject: 'Confirmation de votre désinscription du programme Bêta Kanto MG',
    title: 'Votre désinscription a bien été prise en compte',
    contentHtml: `<p>Manao ahoana {{userName}},</p>
<p>Nous vous confirmons que votre demande de retrait du programme de bêta-test de <strong>Kanto MG</strong> a bien été enregistrée et traitée.</p>
<div style="background-color: #FDF7F7; border-left: 4px solid #C0392B; padding: 14px 18px; margin: 18px 0; border-radius: 6px;">
  <strong style="color: #922B21;">Protection de vos données &amp; Accès :</strong>
  <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #5B2C27; line-height: 1.5;">
    <li>Vos accès aux versions fermées de test (Apple TestFlight) ont été révoqués.</li>
    <li>Votre adresse e-mail a été immédiatement retirée de nos listes de diffusion.</li>
    <li>Conformément au RGPD, aucune sollicitation ultérieure ne vous sera adressée.</li>
  </ul>
</div>
<p><em>Misaotra betsaka</em> pour l'intérêt et le temps que vous avez accordés à Kanto MG et au rayonnement de la culture malgache.</p>
<p>Si cette action était involontaire ou si vous souhaitez nous rejoindre à l'avenir, la porte de Kanto MG vous reste toujours ouverte.</p>`,
    buttonText: 'Rejoindre à nouveau le programme',
    buttonUrl: 'https://app-kanto.gastsar.fr/beta',
    secondaryButtonText: 'Partager une suggestion',
    secondaryButtonUrl: 'https://app-kanto.gastsar.fr/beta?tab=feedback',
    accentColor: '#C0392B',
    footerText:
      'Kanto MG — Le sanctuaire de la culture malgache. Une question ? Écrivez à {{supportEmail}}.',
  },
};

@Injectable()
export class BetaEmailDispatcherService {
  private readonly logger = new Logger(BetaEmailDispatcherService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly resendService: ResendService,
  ) {}

  /**
   * Envoie un email basé sur un code de modèle administrable (BetaEmailTemplate).
   */
  async sendTemplateEmail(options: {
    to: string;
    templateCode: string;
    variables: EmailContextVariables;
    customSubject?: string;
    customContentHtml?: string;
    bypassSuppression?: boolean;
  }) {
    const {
      templateCode,
      variables,
      customSubject,
      customContentHtml,
      bypassSuppression,
    } = options;

    // Déchiffrement transparent systématique de l'adresse destinataire
    const to = decryptEmail(options.to).trim().toLowerCase();
    if (!to || !to.includes('@')) {
      throw new Error(
        `Adresse e-mail destinataire invalide : ${maskEmail(options.to)}`,
      );
    }

    // 1. Récupération de la configuration globale pour liens par défaut
    const config = await this.prisma.betaAutomationConfig.findFirst();
    const supportEmail = config?.supportEmail || 'contact@kanto.mg';
    const playStoreWebLink =
      config?.playStoreWebLink ||
      'https://play.google.com/apps/testing/com.devengalere.kantomg';
    const playStoreAppLink =
      config?.playStoreAppLink ||
      'https://play.google.com/store/apps/details?id=com.devengalere.kantomg';
    const testFlightLink =
      config?.testFlightPublicLink ||
      'https://testflight.apple.com/join/kantomg';

    // 2. Fusion des variables par défaut
    const mergedVars: Record<string, string> = {
      userName: variables.userName || 'Bêta-testeur',
      userEmail: to,
      platform: variables.platform || 'iOS',
      downloadLink: variables.downloadLink || playStoreAppLink,
      testFlightLink: variables.testFlightLink || testFlightLink,
      androidTestingLink: variables.androidTestingLink || playStoreWebLink,
      googleGroupLink:
        variables.googleGroupLink ||
        'https://groups.google.com/g/communaute-kanto',
      appVersion: variables.appVersion || '0.1.0',
      supportEmail: variables.supportEmail || supportEmail,
      unsubscribeLink:
        variables.unsubscribeLink ||
        `https://app-kanto.gastsar.fr/beta?tab=unsubscribe&email=${encodeURIComponent(to)}`,
      ...Object.fromEntries(
        Object.entries(variables).filter(([, v]) => typeof v === 'string') as [
          string,
          string,
        ][],
      ),
    };

    // 3. Récupération du modèle en base de données
    const tpl = await this.prisma.betaEmailTemplate.findUnique({
      where: { code: templateCode },
    });

    const fallback = BUILTIN_FALLBACK_TEMPLATES[templateCode];

    const subjectRaw =
      customSubject ||
      tpl?.subject ||
      fallback?.subject ||
      'Information Kanto MG Bêta';
    const titleRaw =
      tpl?.title || fallback?.title || 'Programme de Test Kanto MG';
    const contentRawSource =
      customContentHtml ||
      tpl?.contentHtml ||
      fallback?.contentHtml ||
      '<p>Merci pour votre participation au test de Kanto MG.</p>';
    const contentRaw =
      !customContentHtml &&
      (templateCode === 'CONFIRMATION' ||
        templateCode === 'ALREADY_REGISTERED' ||
        templateCode === 'UNSUBSCRIBE_CONFIRMATION')
        ? this.stripLegacyAndroidStepsBlock(contentRawSource)
        : contentRawSource;
    const buttonTextRaw = tpl?.buttonText ?? fallback?.buttonText ?? '';
    const buttonUrlRaw = tpl?.buttonUrl ?? fallback?.buttonUrl ?? '';
    const secondaryButtonTextRaw =
      tpl?.secondaryButtonText ?? fallback?.secondaryButtonText ?? '';
    const secondaryButtonUrlRaw =
      tpl?.secondaryButtonUrl ?? fallback?.secondaryButtonUrl ?? '';
    const footerTextRaw =
      tpl?.footerText ||
      fallback?.footerText ||
      'Kanto MG — Le sanctuaire de la culture malgache.';
    const accentColor = tpl?.accentColor || fallback?.accentColor || '#4A6741';
    const senderName = tpl?.senderName || 'Kanto MG • Bêta Test';

    // 4. Remplacement des variables dynamiques {{key}} et épuration stricte des emojis natifs
    const subject = removeNativeEmojis(
      this.interpolate(subjectRaw, mergedVars),
    );
    const title = removeNativeEmojis(this.interpolate(titleRaw, mergedVars));
    const content = removeNativeEmojis(
      this.interpolate(contentRaw, mergedVars),
    );
    const buttonText = removeNativeEmojis(
      this.interpolate(buttonTextRaw, mergedVars),
    );
    const buttonUrl = this.interpolate(buttonUrlRaw, mergedVars);
    const secondaryButtonText = removeNativeEmojis(
      this.interpolate(secondaryButtonTextRaw, mergedVars),
    );
    const secondaryButtonUrl = this.interpolate(
      secondaryButtonUrlRaw,
      mergedVars,
    );
    const footerText = removeNativeEmojis(
      this.interpolate(footerTextRaw, mergedVars),
    );

    // 5. Construction du HTML officiel Kanto Terre & Encre
    const fullHtml = removeNativeEmojis(
      this.buildBrandedEmailHtml({
        title,
        contentHtml: content,
        buttonText,
        buttonUrl,
        secondaryButtonText,
        secondaryButtonUrl,
        footerText,
        accentColor,
        unsubscribeLink: mergedVars.unsubscribeLink,
      }),
    );

    const textContent = removeNativeEmojis(
      `${title}\n\n${this.stripHtml(content)}\n\n${buttonText ? `${buttonText}: ${buttonUrl}\n\n` : ''}${footerText}\n\nPour vous désinscrire : ${mergedVars.unsubscribeLink}`,
    );

    // 6. Expédition via Resend
    try {
      const rawFromEnv = process.env.RESEND_FROM_EMAIL || 'contact@gastsar.fr';
      const emailMatch =
        rawFromEnv.match(/<([^>]+)>/) ||
        rawFromEnv.match(
          /([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
        );
      const pureEmail = emailMatch
        ? emailMatch[1].trim()
        : rawFromEnv.replace(/^["']|["']$/g, '').trim();
      const cleanSenderName = (senderName || 'Kanto MG • Bêta Test')
        .replace(/[<>\r\n]/g, '')
        .trim();
      const from = `"${cleanSenderName}" <${pureEmail}>`;

      await this.resendService.sendEmail({
        to,
        from,
        subject,
        html: fullHtml,
        text: textContent,
        templateType: `BETA_${templateCode}`,
        bypassSuppression,
        metadata: {
          category: 'BETA_TESTING',
          templateCode,
          recipient: to,
        },
      });

      this.logger.log(
        `✉️ [BetaEmail] Modèle "${templateCode}" expédié à ${maskEmail(to)}`,
      );
      return { success: true, subject, to };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `❌ [BetaEmail] Échec envoi "${templateCode}" à ${maskEmail(to)} : ${msg}`,
      );
      throw err;
    }
  }

  /**
   * Supprime d'éventuels blocs d'étapes Android hérités dans les modèles BDD
   * d'inscription / rappel / désinscription (l'inscription email cible désormais iOS TestFlight).
   */
  private stripLegacyAndroidStepsBlock(html: string): string {
    let cleaned = html;
    const markerPattern =
      /<div[^>]*>\s*<div[^>]*>\s*Pour les appareils Android \(Google Play\)/i;

    let match = markerPattern.exec(cleaned);
    while (match) {
      const startIdx = match.index;
      const tagRegex = /<\/?div\b[^>]*>/gi;
      tagRegex.lastIndex = startIdx;

      let depth = 0;
      let endIdx = -1;
      let tagMatch: RegExpExecArray | null;

      while ((tagMatch = tagRegex.exec(cleaned)) !== null) {
        if (tagMatch[0].toLowerCase().startsWith('</div')) {
          depth--;
          if (depth === 0) {
            endIdx = tagMatch.index + tagMatch[0].length;
            break;
          }
        } else {
          depth++;
        }
      }

      if (endIdx === -1) break;
      cleaned = cleaned.slice(0, startIdx) + cleaned.slice(endIdx);
      match = markerPattern.exec(cleaned);
    }

    return cleaned
      .replace(/compte Google Play ou TestFlight/gi, 'accès TestFlight')
      .replace(/\(Google Play et\/ou TestFlight\)/gi, '(Apple TestFlight)')
      .replace(/\(Google Play \/ TestFlight\)/gi, '(Apple TestFlight)');
  }

  /**
   * Remplacement récursif des placeholders {{key}}.
   */
  private interpolate(text: string, vars: Record<string, string>): string {
    return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
      return vars[key] !== undefined ? vars[key] : match;
    });
  }

  /**
   * Génère le squelette HTML complet fidèle au design system Kanto MG.
   */
  public buildBrandedEmailHtml(params: {
    title: string;
    contentHtml: string;
    buttonText?: string;
    buttonUrl?: string;
    secondaryButtonText?: string;
    secondaryButtonUrl?: string;
    footerText?: string;
    accentColor?: string;
    unsubscribeLink?: string;
  }): string {
    const accent = params.accentColor || '#4A6741';

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${params.title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F5F4F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; max-width: 580px; margin: 32px auto; background-color: #FEFEFC; border-radius: 14px; overflow: hidden; border: 1px solid #E5E2DB; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
    .header { background-color: #16442A; padding: 28px 24px; text-align: center; }
    .brand-title { color: #FEFEFC; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: 0.5px; }
    .brand-tag { color: #C58B38; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-top: 4px; letter-spacing: 1px; }
    .body { padding: 32px 28px; }
    .title { font-size: 20px; font-weight: 700; color: #16442A; margin: 0 0 16px 0; line-height: 1.35; }
    .content { font-size: 15px; line-height: 1.6; color: #3A3A38; }
    .content p { margin: 0 0 14px 0; }
    .btn-container { text-align: center; margin: 26px 0 16px 0; }
    .btn-primary { display: inline-block; background-color: ${accent}; color: #FFFFFF !important; font-size: 15px; font-weight: 600; text-decoration: none; padding: 13px 26px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .btn-secondary { display: inline-block; background-color: #F0EDE8; color: #16442A !important; font-size: 14px; font-weight: 600; text-decoration: none; padding: 11px 22px; border-radius: 8px; margin-top: 10px; border: 1px solid #DCE1D7; }
    .footer { background-color: #F5F4F0; padding: 22px 24px; text-align: center; font-size: 12px; color: #7A7A76; border-top: 1px solid #E5E2DB; }
    .footer-links { margin-top: 10px; }
    .footer-links a { color: #5C5C58; text-decoration: underline; margin: 0 8px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1 class="brand-title">KANTO MG</h1>
      <div class="brand-tag">Programme Bêta-Testeurs Officiel</div>
    </div>
    <div class="body">
      <h2 class="title">${params.title}</h2>
      <div class="content">
        ${params.contentHtml}
      </div>
      ${
        params.buttonText && params.buttonUrl
          ? `<div class="btn-container">
              <a href="${params.buttonUrl}" class="btn-primary" target="_blank">${params.buttonText}</a>
              ${
                params.secondaryButtonText && params.secondaryButtonUrl
                  ? `<div><a href="${params.secondaryButtonUrl}" class="btn-secondary" target="_blank">${params.secondaryButtonText}</a></div>`
                  : ''
              }
            </div>`
          : ''
      }
    </div>
    <div class="footer">
      <div>${params.footerText || 'Kanto MG — Ny harena ara-kolontsaina malagasy eo am-pelatananao.'}</div>
      <div class="footer-links">
        <a href="https://app-kanto.gastsar.fr/pages/privacy">Confidentialité</a> •
        <a href="https://app-kanto.gastsar.fr/pages/terms">Conditions</a>
        ${
          params.unsubscribeLink
            ? ` • <a href="${params.unsubscribeLink}">Se désinscrire de la bêta</a>`
            : ''
        }
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, '').trim();
  }
}
