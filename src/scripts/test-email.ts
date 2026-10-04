import 'dotenv/config';
import { Resend } from 'resend';
import { buildSystemTestEmail } from '../integrations/resend/templates/index.js';

async function main() {
  console.log("--- TEST D'ENVOI D'EMAIL KANTO ---");

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
      "ERREUR : La variable RESEND_API_KEY n'est pas définie ou contient une valeur placeholder dans .env.",
    );
    console.error(
      'Obtenez une clé API sur https://resend.com/api-keys et ajoutez-la dans votre fichier .env :',
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

  console.log(`Configuration détectée :`);
  console.log(`   - Expéditeur (From) : ${fromEmail}`);
  console.log(`   - Destinataire (To) : ${targetEmail}`);
  console.log(`   - Clé Resend : ${apiKey.slice(0, 7)}...${apiKey.slice(-4)}`);

  const resend = new Resend(apiKey);

  const { subject, html, text } = buildSystemTestEmail({ to: targetEmail });

  try {
    console.log('Envoi en cours vers Resend...');
    const result = await resend.emails.send({
      from: fromEmail,
      to: [targetEmail],
      subject,
      html,
      text,
    });

    if (result.error) {
      console.error("Échec de l'envoi par Resend :");
      console.error(`   Code : ${result.error.name}`);
      console.error(`   Message : ${result.error.message}`);
      if (
        result.error.message?.includes('validation_error') ||
        result.error.message?.includes('testing')
      ) {
        console.log('\nConseil Resend en mode test :');
        console.log(
          "   Si votre domaine n'est pas encore vérifié sur Resend, vous ne pouvez envoyer",
        );
        console.log(
          "   qu'à l'adresse email avec laquelle vous avez créé votre compte Resend.",
        );
      }
      process.exit(1);
    }

    console.log('EMAIL ENVOYÉ AVEC SUCCÈS !');
    console.log(`   ID du message Resend : ${result.data?.id}`);
    console.log('Vérifiez votre boîte de réception.');
  } catch (error: unknown) {
    console.error(
      'Erreur inattendue :',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
}

void main();
