import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Logger,
  Optional,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AppService } from './app.service.js';
import { renderEmailVerificationPage } from './auth/views/email-verification.view.js';
import { PrismaService } from './prisma/prisma.service.js';
import { ResendService } from './integrations/resend/resend.service.js';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    @Optional() private readonly prisma?: PrismaService,
    @Optional() private readonly resendService?: ResendService,
  ) {}

  /**
   * Racine de l'API Kanto (GET /)
   * - Réponse discrète JSON pour les clients API / mobiles.
   * - Si un paramètre d'erreur legacy d'auth est passé, redirige vers /confirmation.
   */
  @Get()
  getHello(
    @Query('error') error?: string,
    @Query('email') email?: string,
    @Res() res?: Response,
  ): void {
    // Si une redirection d'erreur auth arrive sur la racine (legacy), rediriger vers /confirmation
    if (error) {
      const baseUrl =
        process.env.BETTER_AUTH_URL || 'https://api-kanto.gastsar.fr';
      const target = `${baseUrl}/confirmation?error=${encodeURIComponent(error)}${email ? `&email=${encodeURIComponent(email)}` : ''}`;
      res!.redirect(302, target);
      return;
    }

    res!.status(200).json({
      status: 'ok',
      service: 'kanto-backend',
    });
  }

  /**
   * Endpoint de confirmation d'email (ex: https://api-kanto.gastsar.fr/confirmation)
   * - Vérifie l'état du token en base de données :
   *   1. Temps limite dépassé (> 24h) -> affiche l'écran d'expiration
   *   2. Compte déjà confirmé (emailVerified: true) -> affiche "Compte déjà actif"
   *   3. Token valide -> redirige vers Better-Auth (/api/auth/verify-email)
   * - Supporte également les statuts explicites (?status=success, ?status=already_confirmed, ?status=expired)
   */
  @Get('confirmation')
  async getConfirmation(
    @Query('token') token?: string,
    @Query('error') error?: string,
    @Query('email') email?: string,
    @Query('status') status?: 'success' | 'already_confirmed' | 'expired',
    @Res() res?: Response,
  ): Promise<void> {
    const baseUrl =
      process.env.BETTER_AUTH_URL || 'https://api-kanto.gastsar.fr';

    // Helper : envoyer la page HTML de vérification
    const sendHtmlPage = (html: string) => {
      res!.setHeader('Content-Type', 'text/html; charset=utf-8');
      res!.status(200).send(html);
    };

    // 1. Détection si la confirmation a déjà été effectuée pour cette adresse email
    if (email && this.prisma) {
      try {
        const user = await this.prisma.user.findUnique({
          where: { email },
        });
        if (user && user.emailVerified) {
          return sendHtmlPage(
            renderEmailVerificationPage({ status: 'already_confirmed', email }),
          );
        }
      } catch {
        // En cas d'exception Prisma, continuer le flux
      }
    }

    // 2. Traitement d'un token fourni dans l'URL (?token=...)
    if (token) {
      let isExpired = false;
      let associatedEmail = email;

      if (this.prisma) {
        try {
          const verification = await this.prisma.verification.findFirst({
            where: { value: token },
          });

          if (verification) {
            associatedEmail = verification.identifier || email;

            // Vérification du temps limite (24h de validité)
            if (
              verification.expiresAt &&
              verification.expiresAt.getTime() < Date.now()
            ) {
              isExpired = true;
            } else {
              // Vérifier si l'utilisateur lié est déjà confirmé
              const user = await this.prisma.user.findUnique({
                where: { email: verification.identifier },
              });
              if (user && user.emailVerified) {
                return sendHtmlPage(
                  renderEmailVerificationPage({
                    status: 'already_confirmed',
                    email: verification.identifier,
                  }),
                );
              }
            }
          }
        } catch {
          // Fallback sur redirection standard si Prisma indisponible
        }
      }

      // Si le temps limite de 24h est dépassé
      if (isExpired) {
        return sendHtmlPage(
          renderEmailVerificationPage({
            status: 'expired',
            error: 'TOKEN_EXPIRED',
            email: associatedEmail,
          }),
        );
      }

      // Redirection vers Better-Auth verify-email
      // On utilise res.redirect() directement — pas de return string pour éviter ERR_HTTP_HEADERS_SENT
      const callbackUrl = new URL('/confirmation', baseUrl);
      callbackUrl.searchParams.set('status', 'success');
      if (associatedEmail) {
        callbackUrl.searchParams.set('email', associatedEmail);
      }

      const verifyTarget = `${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}&callbackURL=${encodeURIComponent(callbackUrl.toString())}`;
      res!.redirect(302, verifyTarget);
      return;
    }

    // 3. Affichage de la vue de confirmation (succès, déjà confirmé, expiré ou erreur)
    return sendHtmlPage(renderEmailVerificationPage({ error, email, status }));
  }

  @Get('email-verified')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getEmailVerified(
    @Query('error') error?: string,
    @Query('email') email?: string,
    @Query('status') status?: 'success' | 'already_confirmed' | 'expired',
  ): string {
    return renderEmailVerificationPage({ error, email, status });
  }

  @Get('auth/email-verified')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getAuthEmailVerified(
    @Query('error') error?: string,
    @Query('email') email?: string,
    @Query('status') status?: 'success' | 'already_confirmed' | 'expired',
  ): string {
    return renderEmailVerificationPage({ error, email, status });
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'kanto-backend',
    };
  }

  /**
   * Endpoint de feedback utilisateur (POST /feedback)
   * Reçoit un retour depuis l'application mobile et envoie un email à l'admin.
   */
  @Post('feedback')
  @HttpCode(HttpStatus.OK)
  async submitFeedback(
    @Body()
    body: {
      type?: string;
      message?: string;
      userName?: string;
      userEmail?: string;
    },
  ): Promise<{ success: boolean; message: string }> {
    const { type, message, userName, userEmail } = body ?? {};

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      throw new BadRequestException(
        'Le message de feedback doit contenir au moins 10 caractères.',
      );
    }

    const adminEmail =
      process.env.ADMIN_EMAIL || 'yvesnarsonkevine@gmail.com';

    const feedbackType = type || 'general';
    const typeLabel: Record<string, string> = {
      bug: '🐛 Signalement de bug',
      suggestion: `💡 Suggestion d'amélioration`,
      content: '📚 Signalement de contenu',
      general: `💬 Retour général`,
    };
    const typeLabelFr = typeLabel[feedbackType] ?? `💬 Retour général`;

    const fromLabel = userName
      ? `${userName}${userEmail ? ` <${userEmail}>` : ''}`
      : userEmail || 'Utilisateur anonyme';

    const subject = `[Kanto Feedback] ${typeLabelFr} — ${new Date().toLocaleDateString('fr-FR')}`;

    const text = [
      `Type : ${typeLabelFr}`,
      `De   : ${fromLabel}`,
      ``,
      `Message :`,
      message.trim(),
    ].join('\n');

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#F8F7F4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1A1A1A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F7F4;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFFFF;border:1px solid #EAE8E3;border-radius:8px;overflow:hidden;">
        <tr>
          <td style="padding:24px 28px 18px;border-bottom:1px solid #F0EDE8;">
            <span style="font-size:12px;font-weight:700;letter-spacing:4px;color:#1A1A1A;text-transform:uppercase;">KANTO</span>
            &nbsp;&nbsp;
            <span style="display:inline-block;font-size:11px;font-weight:500;color:#5C5C5C;background:#F2EFE9;padding:3px 8px;border-radius:4px;">Feedback</span>
          </td>
        </tr>
        <tr>
          <td style="padding:28px;">
            <h2 style="font-size:16px;font-weight:600;color:#1A1A1A;margin:0 0 14px;">${typeLabelFr}</h2>
            <p style="font-size:13px;color:#5C5C5C;margin:0 0 6px;"><strong>De :</strong> ${fromLabel}</p>
            <p style="font-size:13px;color:#5C5C5C;margin:0 0 20px;"><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
            <div style="background:#F8F7F4;border-left:3px solid #8B2519;padding:14px 16px;border-radius:4px;font-size:14px;line-height:22px;color:#2A2A2A;white-space:pre-wrap;">${message.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 28px;background:#F8F7F4;border-top:1px solid #F0EDE8;">
            <p style="font-size:11px;color:#8A8A8A;margin:0;">© ${new Date().getFullYear()} KANTO — Feedback automatique depuis l'application mobile</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();

    try {
      if (this.resendService) {
        await this.resendService.sendEmail({
          to: adminEmail,
          subject,
          html,
          text,
          replyTo: userEmail,
        });
      } else {
        this.logger.warn('[Feedback] ResendService non disponible — feedback non envoyé par email.');
        this.logger.log(`[Feedback] ${text}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`[Feedback] Échec envoi email admin : ${msg}`);
      // On ne remonte pas l'erreur à l'utilisateur — le feedback est enregistré en log
    }

    return { success: true, message: 'Feedback reçu. Merci pour votre retour !' };
  }
}
