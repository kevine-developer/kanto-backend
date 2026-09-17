import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { ResendService } from '../integrations/resend/resend.service.js';

@Controller('admin/system')
export class AdminSystemController {
  constructor(private readonly resendService: ResendService) {}

  @Post('test-email')
  async sendTestEmail(@Body('to') to: string) {
    if (!to || typeof to !== 'string' || !to.includes('@')) {
      throw new BadRequestException(
        'Veuillez fournir une adresse email destinataire valide.',
      );
    }

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
                        <td style="font-weight: 500; color: #111827;">${to}</td>
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
Destinataire : ${to}
    `.trim();

    try {
      const result = await this.resendService.sendEmail({
        to,
        subject,
        html,
        text,
      });

      return {
        success: true,
        message: 'Email envoyé avec succès',
        data: result,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (errorMsg.includes('testing emails to your own email address')) {
        throw new BadRequestException(
          "En mode test Resend (sandbox), vous ne pouvez envoyer qu'à l'adresse email de votre compte Resend (lakatsoprod@gmail.com). Pour envoyer à d'autres adresses, ajoutez et vérifiez votre domaine sur resend.com/domains.",
        );
      }
      throw new BadRequestException(`Erreur d'envoi Resend : ${errorMsg}`);
    }
  }
}
