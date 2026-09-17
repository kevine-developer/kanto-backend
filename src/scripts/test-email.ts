import 'dotenv/config';
import { Resend } from 'resend';

async function main() {
  console.log("🚀 --- TEST D'ENVOI D'EMAIL KANTO ---");

  const apiKey = process.env.RESEND_API_KEY;
  const rawFrom =
    process.env.RESEND_FROM_EMAIL ||
    process.env.EMAIL_ADRESS ||
    process.env.EMAIL_ADDRESS;

  let fromEmail = 'Kanto <onboarding@resend.dev>';
  if (rawFrom && rawFrom.trim() !== '') {
    const trimmed = rawFrom.trim().replace(/^["']|["']$/g, '');
    if (!trimmed.includes('@')) {
      fromEmail = `Kanto <noreply@${trimmed}>`;
    } else if (!trimmed.includes('<')) {
      fromEmail = `Kanto <${trimmed}>`;
    } else {
      fromEmail = trimmed;
    }
  }

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('votre_cle_api')) {
    console.error(
      "❌ ERREUR : La variable RESEND_API_KEY n'est pas définie ou contient une valeur placeholder dans .env.",
    );
    console.error(
      '👉 Obtenez une clé API sur https://resend.com/api-keys et ajoutez-la dans votre fichier .env :',
    );
    console.error('   RESEND_API_KEY="re_123456789..."');
    process.exit(1);
  }

  // Destinataire passé en argument ou adresse par défaut
  const targetEmail = process.argv[2];

  if (!targetEmail) {
    console.log('ℹ️ Usage : npx tsx src/scripts/test-email.ts <adresse_email>');
    console.log('⚠️ Aucune adresse email fournie en argument.');
    process.exit(1);
  }

  console.log(`📧 Configuration détectée :`);
  console.log(`   - Expéditeur (From) : ${fromEmail}`);
  console.log(`   - Destinataire (To) : ${targetEmail}`);
  console.log(`   - Clé Resend : ${apiKey.slice(0, 7)}...${apiKey.slice(-4)}`);

  const resend = new Resend(apiKey);

  const subject = "🇲🇬 Kanto — Test d'envoi d'email réussi !";
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1F2937;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAFA; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden;">
          <!-- En-tête sobre & noble -->
          <tr>
            <td style="padding: 32px 36px 24px 36px; border-bottom: 1px solid #F3F4F6;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size: 15px; font-weight: 700; letter-spacing: 3px; color: #111827; text-transform: uppercase;">
                      KANTO
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-size: 11px; font-weight: 600; color: #166534; background-color: #F0FDF4; padding: 4px 10px; border-radius: 9999px; border: 1px solid #DCFCE7;">
                      Système
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenu principal -->
          <tr>
            <td style="padding: 32px 36px;">
              <h1 style="font-size: 19px; font-weight: 600; color: #111827; margin: 0 0 14px 0; line-height: 26px; letter-spacing: -0.2px;">
                Configuration email opérationnelle
              </h1>
              <p style="font-size: 14px; line-height: 23px; color: #4B5563; margin: 0 0 24px 0;">
                Votre service de messagerie transactionnelle <strong>Resend</strong> est correctement relié au backend Kanto et prêt à l'emploi.
              </p>

              <!-- Encadré métadonnées minimaliste -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border: 1px solid #F3F4F6; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; line-height: 22px; color: #374151;">
                      <tr>
                        <td style="color: #6B7280; width: 110px;">Destinataire :</td>
                        <td style="font-weight: 500; color: #111827;">${targetEmail}</td>
                      </tr>
                      <tr>
                        <td style="color: #6B7280;">Date d'envoi :</td>
                        <td>${new Date().toLocaleString('fr-FR')}</td>
                      </tr>
                      <tr>
                        <td style="color: #6B7280;">Service :</td>
                        <td>Resend API</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; line-height: 21px; color: #6B7280; margin: 0;">
                Ce test valide la délivrabilité de vos emails de réinitialisation de mot de passe, de bienvenue et d'alertes.
              </p>
            </td>
          </tr>

          <!-- Pied de page minimaliste -->
          <tr>
            <td style="padding: 20px 36px; background-color: #FAFAFA; border-top: 1px solid #F3F4F6;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="font-size: 12px; color: #9CA3AF; margin: 0; line-height: 18px;">
                      © ${new Date().getFullYear()} Kanto • Lova, Kolontsaina &amp; Tantara Malagasy
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
KANTO — Test d'envoi d'email réussi !

Félicitations ! Votre configuration email fonctionne parfaitement.
Ceci est un message de test envoyé depuis le backend Kanto via Resend.

Date : ${new Date().toLocaleString('fr-FR')}
Destinataire : ${targetEmail}
  `.trim();

  try {
    console.log('⏳ Envoi en cours vers Resend...');
    const result = await resend.emails.send({
      from: fromEmail,
      to: [targetEmail],
      subject,
      html,
      text,
    });

    if (result.error) {
      console.error("❌ Échec de l'envoi par Resend :");
      console.error(`   Code : ${result.error.name}`);
      console.error(`   Message : ${result.error.message}`);
      if (
        result.error.message?.includes('validation_error') ||
        result.error.message?.includes('testing')
      ) {
        console.log('\n💡 Conseil Resend en mode gratuit :');
        console.log(
          "   Si votre domaine n'est pas encore vérifié sur Resend, vous ne pouvez envoyer",
        );
        console.log(
          "   qu'à l'adresse email avec laquelle vous avez créé votre compte Resend.",
        );
      }
      process.exit(1);
    }

    console.log('✅ EMAIL ENVOYÉ AVEC SUCCÈS !');
    console.log(`   🆔 ID du message Resend : ${result.data?.id}`);
    console.log('📬 Vérifiez votre boîte de réception (ou spams).');
  } catch (error: unknown) {
    console.error(
      '❌ Erreur inattendue :',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
}

void main();
