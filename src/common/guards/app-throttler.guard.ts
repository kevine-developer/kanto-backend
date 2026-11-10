import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Garde de limitation de débit adaptative pour Kanto MG.
 * - Utilisateurs authentifiés : quota isolé par User ID (évite les blocages mutuels sur IP partagée / CGNAT 4G).
 * - Visiteurs anonymes : quota par adresse IP cliente (gère le reverse proxy Nginx via trust proxy).
 */
@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected override async getTracker(
    req: Record<string, any>,
    _context?: ExecutionContext,
  ): Promise<string> {
    const userId = req.session?.user?.id || req.user?.id || req.session?.userId;
    if (userId) {
      return `usr_${userId}`;
    }

    const forwarded = req.headers?.['x-forwarded-for'];
    const ip = req.ip || (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '127.0.0.1');
    return `ip_${ip}`;
  }
}

