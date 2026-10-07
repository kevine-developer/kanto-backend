import {
  Body,
  Controller,
  Get,
  Post,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ResendService } from '../integrations/resend/resend.service.js';
import {
  buildSystemTestEmail,
  buildPasswordResetEmail,
  buildWelcomeEmail,
  buildVerificationEmail,
  buildBetaTesterRegistrationEmail,
  buildBetaTesterInvitationEmail,
  buildFeedbackAdminEmail,
} from '../integrations/resend/templates/index.js';

function getEmailPreview(template: string, to: string) {
  switch (template) {
    case 'password_reset':
      return buildPasswordResetEmail({
        to,
        resetUrl:
          'https://kanto.mg/reset-password?token=demo_security_token_123',
        userName: 'Rakoto',
      });
    case 'welcome':
      return buildWelcomeEmail({
        to,
        userName: 'Soanirina',
      });
    case 'verification':
      return buildVerificationEmail({
        to,
        verifyUrl: 'https://kanto.mg/confirmation?token=demo_verify_token_123',
        userName: 'Andry',
      });
    case 'beta_registration':
      return buildBetaTesterRegistrationEmail({
        to,
        fullName: 'Rado Razafy',
        deviceModel: 'Samsung Galaxy A54 5G',
      });
    case 'beta_invitation':
      return buildBetaTesterInvitationEmail({
        to,
        fullName: 'Rado Razafy',
        playStoreWebLink:
          'https://play.google.com/apps/testing/com.devengalere.kantomg',
        playStoreAppLink:
          'https://play.google.com/store/apps/details?id=com.devengalere.kantomg',
      });
    case 'feedback':
      return buildFeedbackAdminEmail({
        type: 'suggestion',
        userName: 'Faly Nirina',
        userEmail: to,
        message:
          'Bonjour, serait-il possible d’ajouter un mode répétition audio pour les discours de Kabary ? Merci pour cette belle application !',
      });
    case 'system':
    default:
      return buildSystemTestEmail({ to });
  }
}
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
  async sendTestEmail(
    @Body('to') to: string,
    @Body('template') template?: string,
  ) {
    if (!to || typeof to !== 'string' || !to.includes('@')) {
      throw new BadRequestException(
        'Veuillez fournir une adresse email destinataire valide.',
      );
    }

    const emailTemplate = template || 'system';
    const { subject, html, text } = getEmailPreview(emailTemplate, to);

    try {
      const result = await this.resendService.sendEmail({
        to,
        subject,
        html,
        text,
      });

      return {
        success: true,
        message: `Email "${subject}" envoyé avec succès`,
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

  @Post('preview-email')
  previewEmail(@Body('to') to?: string, @Body('template') template?: string) {
    const targetEmail = to && to.includes('@') ? to : 'utilisateur@kanto.mg';
    const emailTemplate = template || 'system';
    const rendered = getEmailPreview(emailTemplate, targetEmail);

    return {
      success: true,
      template: emailTemplate,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
    };
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
