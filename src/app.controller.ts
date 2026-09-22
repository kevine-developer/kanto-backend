import { Controller, Get, Header, Optional, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AppService } from './app.service.js';
import { renderEmailVerificationPage } from './auth/views/email-verification.view.js';
import { PrismaService } from './prisma/prisma.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Optional() private readonly prisma?: PrismaService,
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
}
