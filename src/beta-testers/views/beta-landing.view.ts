/**
 * Kanto MG — Portail officiel et vitrine culturelle
 * Accessible sur app-kanto.gastsar.fr et kanto.mg
 *
 * Direction artistique : « Kanto — La culture malgache, autrement »
 * - Design éditorial contemporain d'inspiration magazine culturel & musée moderne
 * - Typographie Newsreader (titrage d'art & citations) + Plus Jakarta Sans (interface)
 * - Palette chromatique : Ivoire/Parchemin (#F8F6F0 / #0C0C0A), Noir Encre (#141311 / #F4F3EE),
 *   Terre cuite Tany mena (#B93826 / #E65A48), Vert Tanimbary (#2B4426 / #7AA870) & Ocre Ambré (#C48833).
 * - Zéro artifice générique / Zéro icône Sparkles.
 */

import { BETA_LANDING_CSS } from './beta-landing.styles.js';
import { renderBetaLandingBody } from './beta-landing.content.js';

export interface BetaLandingPageOptions {
  testerCount?: number;
  initialRegistered?: boolean;
  registeredEmail?: string;
  errorMessage?: string;
  fromDeeplink?: boolean;
  targetPath?: string;
  initialTab?: 'download' | 'register' | 'already_registered' | 'unsubscribe';
  initialEmail?: string;
  unsubscribeToken?: string;
  supportEmail?: string;
}

export function renderBetaLandingPage(
  options?: BetaLandingPageOptions,
): string {
  const currentYear = new Date().getFullYear();
  const supportEmail =
    options?.supportEmail || process.env.SUPPORT_EMAIL || 'contact@kanto.mg';
  const count =
    typeof options?.testerCount === 'number' ? options.testerCount : 0;
  const isRegistered = Boolean(options?.initialRegistered);

  const initialTab =
    options?.initialTab || (isRegistered ? 'already_registered' : 'register');
  const emailVal = options?.registeredEmail || options?.initialEmail || '';
  const errorVal = options?.errorMessage
    ? escapeHtml(options.errorMessage)
    : '';
  const tokenVal = options?.unsubscribeToken || '';

  const countBadgeText =
    count > 0
      ? `${count} testeur${count > 1 ? 's' : ''} pionnier${count > 1 ? 's' : ''}`
      : 'Inscriptions ouvertes';

  const legalBaseUrl =
    process.env.NATIVE_APP_URL ||
    process.env.PUBLIC_WEB_URL ||
    process.env.APP_URL ||
    'https://app-kanto.gastsar.fr';

  const bodyHtml = renderBetaLandingBody({
    legalBaseUrl,
    supportEmail,
    countBadgeText,
    initialTab,
    isRegistered,
    emailVal,
    errorVal,
    tokenVal,
    currentYear,
  });

  return `<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>Kanto MG • La culture malgache, autrement | Lova, Kolontsaina &amp; Tantara</title>
  <meta name="description" content="Portail officiel Kanto MG : sanctuaire contemporain de la culture malgache. Explorez les contes (Angano), proverbes ancestraux (Ohabolana), l'art oratoire (Kabary), la poésie et la langue malgache. Téléchargez sur Android et iOS.">
  <meta name="keywords" content="kanto mg, culture malgache, langue malgache, angano, ohabolana, kabary, tononkalo, madagascar, proverbes malgaches, contes malgaches, dictionnaire malgache, fihavanana">
  <meta name="theme-color" content="#0C0C0A">

  <!-- Canonical & hreflang SEO -->
  <link rel="canonical" href="${legalBaseUrl}/">
  <link rel="alternate" hreflang="fr" href="${legalBaseUrl}/">
  <link rel="alternate" hreflang="mg" href="${legalBaseUrl}/">
  <link rel="alternate" hreflang="x-default" href="${legalBaseUrl}/">

  <!-- Open Graph / Réseaux sociaux -->
  <meta property="og:site_name" content="Kanto MG">
  <meta property="og:url" content="${legalBaseUrl}/">
  <meta property="og:title" content="Kanto MG • La culture malgache, autrement">
  <meta property="og:description" content="Portail officiel Kanto MG : sanctuaire contemporain dédié au patrimoine, aux contes (Angano), proverbes ancestraux (Ohabolana) et à la langue de Madagascar.">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:locale:alternate" content="mg_MG">
  <meta property="og:image" content="${legalBaseUrl}/assets/images/icon.png">
  <meta property="og:image:width" content="512">
  <meta property="og:image:height" content="512">
  <meta property="og:image:alt" content="Kanto MG — Lova sy Kolontsaina Malagasy">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@KantoMG">
  <meta name="twitter:title" content="Kanto MG • La culture malgache, autrement">
  <meta name="twitter:description" content="Explorez les trésors de Madagascar sur Kanto MG : contes, proverbes, kabary et langue vivante. Téléchargez sur Android et iOS.">
  <meta name="twitter:image" content="${legalBaseUrl}/assets/images/icon.png">

  <!-- Données structurées Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "${legalBaseUrl}/#website",
        "url": "${legalBaseUrl}/",
        "name": "Kanto MG",
        "description": "Portail officiel Kanto MG : valorisation du patrimoine, de la littérature et de la langue malgache.",
        "inLanguage": ["fr-FR", "mg-MG"]
      },
      {
        "@type": "Organization",
        "@id": "${legalBaseUrl}/#organization",
        "name": "Kanto MG",
        "url": "${legalBaseUrl}/",
        "logo": {
          "@type": "ImageObject",
          "url": "${legalBaseUrl}/logo.png",
          "width": 180,
          "height": 180
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "${supportEmail}",
          "contactType": "customer support"
        }
      },
      {
        "@type": "MobileApplication",
        "@id": "${legalBaseUrl}/#app",
        "name": "Kanto MG",
        "operatingSystem": "Android, iOS",
        "applicationCategory": "EducationalApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "ratingCount": "128",
          "bestRating": "5",
          "worstRating": "1"
        }
      }
    ]
  }
  </script>

  <!-- Favicon & Typographies éditoriales d'exception -->
  <link rel="icon" href="/favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,500;1,6..72,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

  <script>
    (function() {
      try {
        var savedTheme = localStorage.getItem('kanto_theme');
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
        var metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
          metaTheme.setAttribute('content', theme === 'light' ? '#F8F6F0' : '#0C0C0A');
        }
      } catch (e) {}
    })();
  </script>

  <style>
${BETA_LANDING_CSS}
  </style>
</head>
<body>
${bodyHtml}
  <script src="/beta-waitlist.js"></script>
</body>
</html>`.trim();
}

export { renderBetaWaitlistScript } from './beta-landing.script.js';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
