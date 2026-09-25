import {
  Body,
  Controller,
  Get,
  Post,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ResendService } from '../integrations/resend/resend.service.js';
import { CloudinaryService } from '../integrations/cloudinary/cloudinary.service.js';
import { CloudinarySyncService } from '../integrations/cloudinary/cloudinary-sync.service.js';
import { AuthGuard, Roles } from '../auth/index.js';

@Controller('admin/system')
@UseGuards(AuthGuard)
@Roles(['ADMIN', 'admin'])
export class AdminSystemController {
  constructor(
    private readonly resendService: ResendService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly cloudinarySyncService: CloudinarySyncService,
  ) {}

  @Post('test-email')
  async sendTestEmail(@Body('to') to: string) {
    if (!to || typeof to !== 'string' || !to.includes('@')) {
      throw new BadRequestException(
        'Veuillez fournir une adresse email destinataire valide.',
      );
    }

    const subject = 'Test de configuration de messagerie — Kanto';
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F7F4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1A1A1A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F7F4; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #FFFFFF; border: 1px solid #EAE8E3; border-radius: 8px; overflow: hidden;">
          <!-- En-tête sobre -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #F0EDE8;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size: 13px; font-weight: 700; letter-spacing: 4px; color: #1A1A1A; text-transform: uppercase;">
                      KANTO
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-size: 11px; font-weight: 500; color: #5C5C5C; background-color: #F2EFE9; padding: 3px 8px; border-radius: 4px;">
                      Système
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenu principal -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="font-size: 18px; font-weight: 600; color: #1A1A1A; margin: 0 0 14px 0; line-height: 24px; letter-spacing: -0.2px;">
                Configuration de messagerie opérationnelle
              </h1>
              <p style="font-size: 14px; line-height: 23px; color: #4A4A4A; margin: 0 0 24px 0;">
                Votre service de messagerie transactionnelle <strong>Resend</strong> est correctement relié au backend Kanto et prêt à l'emploi.
              </p>

              <!-- Encadré métadonnées minimaliste -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F7F4; border: 1px solid #EAE8E3; border-radius: 6px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 18px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; line-height: 22px; color: #3A3A3A;">
                      <tr>
                        <td style="color: #6B7280; width: 110px;">Destinataire :</td>
                        <td style="font-weight: 500; color: #1A1A1A;">${to}</td>
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

              <p style="font-size: 13px; line-height: 21px; color: #5C5C5C; margin: 0;">
                Ce test confirme la délivrabilité des notifications, des messages de réinitialisation de mot de passe et des emails de bienvenue.
              </p>
            </td>
          </tr>

          <!-- Pied de page minimaliste -->
          <tr>
            <td style="padding: 18px 32px; background-color: #F8F7F4; border-top: 1px solid #F0EDE8;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="font-size: 11px; color: #8A8A8A; margin: 0; line-height: 17px; letter-spacing: 0.2px;">
                      © ${new Date().getFullYear()} KANTO • Lova, Kolontsaina &amp; Tantara Malagasy
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
KANTO — Test de configuration de messagerie réussi

Votre configuration de messagerie fonctionne correctement.
Ce message de test a été transmis par le backend Kanto via l'API Resend.

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

  @Get('cloudinary/status')
  async getCloudinaryStatus() {
    const isConfigured = this.cloudinaryService.isConfigured();
    const isAvailable = await this.cloudinaryService.isAvailable();
    return {
      configured: isConfigured,
      available: isAvailable,
      provider: isAvailable ? 'cloudinary' : 'local_fallback',
    };
  }

  @Post('cloudinary/sync')
  async triggerCloudinarySync() {
    return this.cloudinarySyncService.syncLocalUploadsToCloudinary();
  }
}
