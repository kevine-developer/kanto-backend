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
  Req,
  Res,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { AppService } from './app.service.js';
import { renderEmailVerificationPage } from './auth/views/email-verification.view.js';
import {
  renderBetaLandingPage,
  renderBetaWaitlistScript,
} from './beta-testers/views/beta-landing.view.js';
import { PrismaService } from './prisma/prisma.service.js';
import { ResendService } from './integrations/resend/resend.service.js';
import { buildFeedbackAdminEmail } from './integrations/resend/templates/index.js';
import { BetaTestersService } from './beta-testers/beta-testers.service.js';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    @Optional() private readonly prisma?: PrismaService,
    @Optional() private readonly resendService?: ResendService,
    @Optional() private readonly betaTestersService?: BetaTestersService,
  ) {}

  /**
   * Racine de l'API Kanto (GET /)
   * - Réponse discrète JSON pour les clients API / mobiles.
   * - Si un paramètre d'erreur legacy d'auth est passé, redirige vers /confirmation.
   * - Si l'hôte est app-kanto.gastsar.fr, sert le portail d'accès anticipé avec compteur en direct.
   */
  @Get()
  async getHello(
    @Query('error') error?: string,
    @Query('email') email?: string,
    @Res() res?: Response,
    @Req() req?: Request,
  ): Promise<void> {
    // Si une redirection d'erreur auth arrive sur la racine (legacy), rediriger vers /confirmation
    if (error) {
      const baseUrl =
        process.env.PUBLIC_AUTH_URL ||
        process.env.BETTER_AUTH_URL ||
        'https://api-kanto.gastsar.fr';
      const target = `${baseUrl}/confirmation?error=${encodeURIComponent(error)}${email ? `&email=${encodeURIComponent(email)}` : ''}`;
      res!.redirect(302, target);
      return;
    }

    // Si la requête provient du domaine app-kanto.gastsar.fr ou d'un hôte lié aux tests, servir la landing page
    const host = (
      (req?.headers?.['x-forwarded-host'] as string) ||
      req?.headers?.host ||
      ''
    ).toLowerCase();

    if (
      host &&
      (host.includes('app-kanto') ||
        host.includes('beta-kanto') ||
        host.startsWith('app.'))
    ) {
      let testerCount = 0;
      try {
        if (this.betaTestersService) {
          testerCount = await this.betaTestersService.getPublicTesterCount();
        } else if (this.prisma) {
          testerCount = await this.prisma.betaTester.count({
            where: { status: { not: 'REJECTED' } },
          });
        }
      } catch {
        testerCount = 0;
      }

      // Interception sécurisée si des query params sont arrivés par GET
      const queryEmail = (req?.query?.email as string)?.trim()?.toLowerCase();
      const queryFullName = (req?.query?.fullName as string)?.trim();
      const queryWebsite = (req?.query?.website as string)?.trim();

      let initialRegistered = false;
      let registeredEmail = '';

      if (queryEmail && queryEmail.includes('@') && !queryWebsite) {
        try {
          if (this.betaTestersService) {
            const ip =
              (req?.headers?.['x-forwarded-for'] as string)
                ?.split(',')[0]
                ?.trim() ||
              req?.ip ||
              req?.socket?.remoteAddress;
            const userAgent = req?.headers?.['user-agent'] as string;
            await this.betaTestersService.register(
              { email: queryEmail, fullName: queryFullName || undefined },
              ip,
              userAgent,
            );
          }
          initialRegistered = true;
          registeredEmail = queryEmail;
        } catch (e) {
          this.logger.warn(
            `[AppController] Erreur auto-inscription query email: ${e}`,
          );
        }
      }

      res!.setHeader('Content-Type', 'text/html; charset=utf-8');
      res!.send(
        renderBetaLandingPage({
          testerCount,
          initialRegistered,
          registeredEmail,
        }),
      );
      return;
    }

    res!.status(200).json({
      status: 'ok',
      service: 'kanto-backend',
    });
  }

  /**
   * Réponse 204 No Content pour /favicon.ico (évite les avertissements 404 dans les logs)
   */
  @Get('favicon.ico')
  @HttpCode(HttpStatus.NO_CONTENT)
  getFavicon(): void {}

  /**
   * Fichier robots.txt interdisant l'indexation directe des routes API par les robots
   */
  @Get('robots.txt')
  @Header('Content-Type', 'text/plain')
  getRobots(): string {
    return 'User-agent: *\nDisallow: /\n';
  }

  /**
   * Script client de la waitlist bêta servi en direct
   */
  @Get('beta-waitlist.js')
  getBetaWaitlistScript(@Res() res: Response): void {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(renderBetaWaitlistScript());
  }

  /**
   * Redirection conviviale pour les liens légaux et CGU vers /pages/terms et /pages/privacy
   */
  @Get('cgu')
  @Get('terms')
  handleTermsRedirect(@Res() res: Response): void {
    res.redirect(301, '/pages/terms');
  }

  @Get('confidentialite')
  @Get('privacy')
  handlePrivacyRedirect(@Res() res: Response): void {
    res.redirect(301, '/pages/privacy');
  }

  /**
   * Redirection automatique pour les liens de réinitialisation de mot de passe (reset-password)
   * Redirige immédiatement le navigateur vers l'interface d'administration kanto-admin.
   */
  @Get('reset-password')
  handleResetPasswordRedirect(
    @Query('token') token: string,
    @Res() res: Response,
  ): void {
    const isProduction = process.env.NODE_ENV === 'production';
    const adminFrontendUrl =
      process.env.ADMIN_FRONTEND_URL ||
      process.env.ADMIN_URL ||
      (isProduction ? 'https://admin.kanto.mg' : 'http://192.168.1.100:3001');

    try {
      const targetUrl = new URL('/reset-password', adminFrontendUrl);
      if (token) {
        targetUrl.searchParams.set('token', token);
      }
      this.logger.log(
        `🔄 Redirection de /reset-password vers l'interface admin : ${targetUrl.toString()}`,
      );
      res.redirect(302, targetUrl.toString());
    } catch {
      res.redirect(
        302,
        `${adminFrontendUrl}/reset-password?token=${encodeURIComponent(token || '')}`,
      );
    }
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
      process.env.PUBLIC_AUTH_URL ||
      process.env.BETTER_AUTH_URL ||
      'https://api-kanto.gastsar.fr';

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

    // 3. Déclenchement de l'email de bienvenue transactionnel après confirmation d'adresse email
    if (status === 'success' && email && this.prisma && this.resendService) {
      void this.prisma.user
        .findUnique({
          where: { email },
          select: { email: true, name: true },
        })
        .then((verifiedUser) => {
          if (verifiedUser && this.resendService) {
            void this.resendService
              .sendWelcomeEmail({
                to: verifiedUser.email,
                userName: verifiedUser.name || undefined,
              })
              .catch((err) => {
                this.logger.warn(
                  `[AppController] Échec envoi email de bienvenue à ${verifiedUser.email}:`,
                  err,
                );
              });
          }
        })
        .catch((err) => {
          this.logger.warn(
            `[AppController] Erreur récupération utilisateur pour email de bienvenue :`,
            err,
          );
        });
    }

    // 4. Affichage de la vue de confirmation (succès, déjà confirmé, expiré ou erreur)
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
  @Throttle({ default: { limit: 5, ttl: 60000 } })
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

    if (
      !userEmail ||
      typeof userEmail !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.trim())
    ) {
      throw new BadRequestException(
        'Une adresse e-mail valide est obligatoire pour envoyer un avis.',
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'yvesnarsonkevine@gmail.com';

    const { subject, html, text } = buildFeedbackAdminEmail({
      type: type || 'general',
      userName,
      userEmail,
      message,
    });

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
        this.logger.warn(
          '[Feedback] ResendService non disponible — feedback non envoyé par email.',
        );
        this.logger.log(`[Feedback] ${text}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`[Feedback] Échec envoi email admin : ${msg}`);
      // On ne remonte pas l'erreur à l'utilisateur — le feedback est enregistré en log
    }

    return {
      success: true,
      message: 'Feedback reçu. Merci pour votre retour !',
    };
  }
}
