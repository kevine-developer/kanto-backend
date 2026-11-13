import {
  Injectable,
  NestMiddleware,
  Logger,
} from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';

/**
 * Middleware de sécurité Kanto MG :
 * Interdit formellement aux comptes administrateurs (rôle ADMIN) de se connecter
 * depuis l'application mobile native. L'accès administrateur est exclusivement réservé
 * à la plateforme web d'administration Kanto MG.
 */
@Injectable()
export class MobileAdminAccessMiddleware implements NestMiddleware {
  private readonly logger = new Logger(MobileAdminAccessMiddleware.name);

  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Ne vérifier que les requêtes POST d'authentification
    if (req.method !== 'POST') {
      return next();
    }

    const clientHeader = (
      (req.headers['x-kanto-client'] as string) ||
      (req.headers['x-client-context'] as string) ||
      (req.headers['x-client-platform'] as string) ||
      ''
    ).toLowerCase();

    const userAgent = (req.headers['user-agent'] || '').toLowerCase();

    // Détection stricte d'un client mobile natif
    const isNativeMobileClient =
      clientHeader === 'mobile-app' ||
      clientHeader === 'native' ||
      clientHeader === 'mobile' ||
      clientHeader === 'android' ||
      clientHeader === 'ios' ||
      userAgent.includes('expo') ||
      userAgent.includes('reactnative') ||
      userAgent.includes('okhttp') ||
      userAgent.includes('darwin') ||
      userAgent.includes('cfnetwork') ||
      userAgent.includes('kantomg');

    if (!isNativeMobileClient) {
      return next();
    }

    // Extraction de l'email depuis le body de la requête
    const email = (req.body?.email as string | undefined)?.trim()?.toLowerCase();
    if (!email) {
      return next();
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: { id: true, role: true, email: true },
      });

      if (user && user.role === 'ADMIN') {
        this.logger.warn(
          `[MobileAdminAccessMiddleware] 🛑 Connexion administrateur bloquée sur mobile : ${email}`,
        );
        res.status(403).json({
          status: 403,
          message:
            "Les comptes administrateurs ne sont pas autorisés à se connecter sur l'application mobile. Veuillez utiliser l'interface web d'administration.",
          messageMg:
            "Tsy afaka miditra amin'ny finday ny kaonty mpitantana. Ampiasao ny sehatra web fitantanana.",
          code: 'ADMIN_MOBILE_LOGIN_FORBIDDEN',
        });
        return;
      }
    } catch (err) {
      this.logger.warn(
        `[MobileAdminAccessMiddleware] ⚠️ Erreur lors de la vérification du compte ${email} : ${err}`,
      );
    }

    next();
  }
}
