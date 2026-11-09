import { pageShell } from '../page.helpers.js';

export function renderTermsPage(options?: {
  hideHeader?: boolean;
  supportEmail?: string;
}): string {
  const supportEmail =
    options?.supportEmail || process.env.SUPPORT_EMAIL || 'support@kanto.mg';

  return pageShell({
    title: "Kanto MG — Conditions Générales d'Utilisation",
    pageTitle: "Conditions d'utilisation (CGU)",
    slug: 'terms',
    hideHeader: options?.hideHeader,
    supportEmail,
    description:
      "Conditions Générales d'Utilisation et Règlement du Programme Bêta de l'application Kanto MG.",
    body: `
      <div style="margin-bottom: 24px;">
        <h1>Conditions Générales d'Utilisation &amp; Programme Bêta</h1>
        <div class="page-meta">
          <span class="badge-official">Document Officiel Kanto MG</span>
          <span>Version 2.4 • En vigueur en 2026</span>
          <span>•</span>
          <span>Fihavanana &amp; Haja</span>
        </div>
      </div>

      <div class="callout">
        <p>
          Bienvenue sur <strong>Kanto MG</strong>, le sanctuaire numérique dédié à la langue, à la culture, à l'histoire et au patrimoine malgache. En accédant à nos services, au site web ou à nos programmes de test bêta, vous acceptez sans réserve les présentes Conditions Générales d'Utilisation.
        </p>
      </div>

      <!-- Sommaire interactif -->
      <nav class="toc-card" aria-label="Sommaire des CGU">
        <div class="toc-title">Sommaire des articles</div>
        <ul class="toc-list">
          <li><a href="#art-1">1. Présentation &amp; Esprit Kanto</a></li>
          <li><a href="#art-2">2. Conditions d'accès &amp; Éligibilité</a></li>
          <li><a href="#art-3">3. Règlement Bêta-Test (Stores)</a></li>
          <li><a href="#art-4">4. Confidentialité des préversions</a></li>
          <li><a href="#art-5">5. Retours &amp; Signalement de bugs</a></li>
          <li><a href="#art-6">6. Compte &amp; Conduite éthique</a></li>
          <li><a href="#art-7">7. Propriété &amp; Patrimoine malgache</a></li>
          <li><a href="#art-8">8. Données personnelles &amp; RGPD</a></li>
          <li><a href="#art-9">9. Disponibilité &amp; Responsabilité</a></li>
          <li><a href="#art-10">10. Désinscription &amp; Droit à l'oubli</a></li>
          <li><a href="#art-11">11. Droit applicable &amp; Litiges</a></li>
          <li><a href="#art-12">12. Contact &amp; Support Officiel</a></li>
        </ul>
      </nav>

      <h2 id="art-1">1. Présentation et Esprit de Kanto MG</h2>
      <p>
        <strong>Kanto MG</strong> est une œuvre numérique culturelle et éducative ayant pour vocation d'enseigner, préserver et valoriser la richesse inestimable des traditions malgaches : proverbes ancestraux (<em>ohabolana</em>), contes et récits rituels (<em>angano</em>), civisme (<em>fomba amam-panao</em>), poésies, devinettes (<em>ankamantatra</em>) et histoire nationale.
      </p>
      <p>
        L'ensemble de nos relations repose sur les valeurs cardinales malgaches : le <strong>Fihavanana</strong> (solidarité, concorde fraternelle) et l'<strong>Haja</strong> (respect mutuel et dignité).
      </p>

      <h2 id="art-2">2. Conditions d'accès et Éligibilité</h2>
      <p>L'accès aux services Kanto MG et à ses plateformes est ouvert :</p>
      <ul>
        <li>À toute personne physique âgée d'au moins 13 ans (ou ayant l'autorisation d'un représentant légal).</li>
        <li>Aux utilisateurs disposant d'un équipement mobile compatible : Android (version 8.0 Oreo minimum) ou Apple iOS/iPadOS (version 15.0 minimum).</li>
        <li>Via une connexion Internet sécurisée pour la synchronisation et le téléchargement des contenus.</li>
      </ul>

      <h2 id="art-3">3. Règlement Particulier du Programme Bêta-Test</h2>
      <div class="callout callout-beta">
        <p>
          <strong>Avis important aux testeurs :</strong> Le programme d'accès anticipé permet de découvrir et tester en avant-première des fonctionnalités en cours d'expérimentation avant leur déploiement grand public.
        </p>
      </div>
      <p>En participant au programme de test bêta Kanto MG :</p>
      <ul>
        <li>
          <strong>Canal Android :</strong> La distribution s'effectue via le <em>Closed Testing</em> de Google Play Console. Le testeur doit accepter l'invitation avec l'adresse Gmail enregistrée.
        </li>
        <li>
          <strong>Canal iOS :</strong> La distribution s'effectue via <em>Apple TestFlight</em>. L'installation de l'application gratuite TestFlight depuis l'App Store est requise.
        </li>
        <li>
          <strong>Nature des versions :</strong> Les versions bêta sont fournies « en l'état ». Elles peuvent contenir des imperfections, des anomalies d'affichage ou des interruptions temporaires de service.
        </li>
      </ul>

      <h2 id="art-4">4. Confidentialité des Préversions</h2>
      <p>
        Certaines fonctionnalités, visuels ou textes mis à disposition dans le cadre du bêta-test sont confidentiels. Le bêta-testeur s'engage à ne pas diffuser, publier ou décompiler les fichiers d'installation (APK, AAB, bundles iOS) sans autorisation expresse écrite de l'équipe Kanto MG.
      </p>

      
      <h2 id="art-5">5. Retours Utilisateurs, Avis et Témoignages</h2>
      <p>
        La participation active à Kanto MG inclut la possibilité de transmettre des avis, notes (1 à 5 étoiles) et retours d'expérience via l'application mobile ou le portail web.
      </p>
      <div class="callout">
        <p><strong>Avis et témoignages des utilisateurs :</strong></p>
        <ul>
          <li>Les avis laissés dans l'application restent <strong>strictement privés par défaut</strong> et sont utilisés uniquement à des fins d'amélioration du service.</li>
          <li>L'utilisateur peut choisir d'autoriser la publication de son avis sur le portail officiel de Kanto MG via une case à cocher explicite et non précochée.</li>
          <li>Cette autorisation est <strong>facultative et révocable à tout moment</strong> depuis l'application ou sur simple demande.</li>
          <li>Les données affichées publiquement se limitent strictement à la note attribuée, au commentaire et au nom choisi par l'utilisateur (prénom, pseudonyme ou mention anonyme).</li>
          <li><strong>L'adresse e-mail de l'utilisateur n'est jamais rendue publique.</strong></li>
          <li>Kanto MG se réserve le droit de modérer, refuser ou retirer tout avis ne respectant pas les règles de bienséance ou les valeurs de respect mutuel, sans jamais modifier le sens ni la note attribuée.</li>
          <li><strong>Aucun avis rémunéré ou incité n'est publié sur la plateforme.</strong></li>
        </ul>
      </div>
<h2 id="art-6">6. Compte Utilisateur et Conduite Éthique</h2>
      <p>Chaque utilisateur et testeur s'engage formellement à :</p>
      <ul>
        <li>Fournir une adresse e-mail valide et personnelle lors de son inscription.</li>
        <li>Ne pas usurper l'identité d'un tiers ni créer de comptes multiples ou automatisés.</li>
        <li>Maintenir des échanges bienveillants, courtois et respectueux avec la communauté et l'équipe de développement.</li>
        <li>Ne pas tenter de porter atteinte à l'intégrité technique, à la sécurité ou à la disponibilité des serveurs Kanto MG.</li>
      </ul>

      <h2 id="art-7">7. Propriété Intellectuelle et Patrimoine Commun</h2>
      <p>
        Les composants logiciels, la structure applicative, les maquettes, les illustrations originales et la marque <strong>Kanto</strong> sont protégés par le droit de la propriété intellectuelle.
      </p>
      <p>
        Les éléments de sagesse ancestrale (proverbes traditionnels, contes folkloriques du domaine public) constituent le patrimoine culturel commun de la nation malgache et sont transcrits dans un souci de fidélité et d'hommage.
      </p>

      <h2 id="art-8">8. Protection des Données Personnelles et RGPD</h2>
      <p>
        Conformément au Règlement Général sur la Protection des Données (RGPD 2016/679) et aux recommandations de la CNIL, Kanto MG applique une stricte politique de confidentialité :
      </p>
      <ul>
        <li><strong>Chiffrement au repos :</strong> Les adresses e-mail des participants sont protégées par chiffrement symétrique AES-256-GCM et hachage déterministe HMAC-SHA-256 pour prévenir toute fuite de données.</li>
        <li><strong>Zéro revente de données :</strong> Vos coordonnées ne sont jamais cédées, louées ou communiquées à des tiers publicitaires.</li>
        <li><strong>Journalisation sécurisée :</strong> Tout accès administratif ou export est consigné dans un journal d'audit immuable.</li>
      </ul>

      <h2 id="art-9">9. Disponibilité et Limitation de Responsabilité</h2>
      <p>
        Kanto MG met en œuvre tous les moyens raisonnables pour garantir la disponibilité et la fluidité de la plateforme. Toutefois, nous déclinons toute responsabilité en cas de force majeure, d'interruption temporaire pour maintenance, ou d'incompatibilité matérielle spécifique d'un terminal mobile lors des tests.
      </p>

      <h2 id="art-10">10. Désinscription et Droit à l'Oubli</h2>
      <p>
        La participation au programme bêta est <strong>libre et sans engagement</strong>. Tout participant peut à tout instant se désinscrire :
      </p>
      <ul>
        <li>Depuis l'onglet « Me désinscrire » disponible sur la plateforme web.</li>
        <li>En cliquant sur le lien de désinscription sécurisé présent au bas de chaque e-mail d'information.</li>
        <li>Sur simple demande adressée à notre support technique.</li>
      </ul>
      <p>La désinscription entraîne la cessation immédiate des invitations et la purge sécurisée des données associées.</p>

      <h2 id="art-11">11. Droit Applicable et Règlement des Différends</h2>
      <p>
        Les présentes conditions d'utilisation sont régies par le droit applicable. En cas de contestation ou de réclamation, les parties s'engagent à privilégier une recherche de conciliation amiable dans le respect des valeurs de fraternité et de dialogue.
      </p>

      <h2 id="art-12">12. Assistance et Support Officiel</h2>
      <p>
        Pour toute question relative aux présentes conditions, à l'accès au test ou à la gestion de vos données personnelles, notre équipe est à votre écoute :
      </p>

      <div class="contact-card">
        <div class="icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <div class="body">
          <div class="label">Support Bêta-Test &amp; Questions Juridiques</div>
          <div class="value">
            Courriel officiel : <a href="mailto:${supportEmail}"><strong>${supportEmail}</strong></a>
            <br>
            <span style="font-size: 12px; color: var(--text-subtle);">
              Délai de réponse habituel : sous 24 à 48 heures ouvrées.
            </span>
          </div>
        </div>
      </div>
    `,
  });
}
