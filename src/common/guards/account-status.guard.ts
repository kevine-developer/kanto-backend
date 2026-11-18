import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';

interface UserSessionPayload {
  id: string;
  email?: string;
  role?: string;
  status?: string;
  banned?: boolean;
}

const CACHE_TTL_ACCOUNT_STATUS = 60; // 60 secondes en cache Redis

/**
 * Guard de sécurité Kanto MG :
 * Vérifie systématiquement que le compte utilisateur connecté est actif.
 * Interdit formellement l'accès aux comptes suspendus, bannis ou désactivés,
 * même si un jeton de session valide est présent dans les en-têtes.
 */
@Injectable()
export class AccountStatusGuard implements CanActivate {
  private readonly logger = new Logger(AccountStatusGuard.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user?: UserSessionPayload;
      session?: { user?: UserSessionPayload };
    }>();

    const user = request.user || request.session?.user;

    // Si la route est publique ou qu'aucun utilisateur n'est identifié, ce Guard laisse passer
    // (l'AuthGuard éventuel gère l'obligation d'authentification).
    if (!user?.id) {
      return true;
    }

    const userId = user.id;
    const cacheKey = `user:status:${userId}`;

    let cachedStatus: {
      banned: boolean;
      status: string | null;
      suspendedUntil: string | null;
    } | null = null;

    try {
      cachedStatus = await this.redis.get<{
        banned: boolean;
        status: string | null;
        suspendedUntil: string | null;
      }>(cacheKey);
    } catch {
      // Ignorer l'erreur de cache et consulter la base
    }

    let statusInfo = cachedStatus;

    if (!statusInfo) {
      try {
        const dbUser = await this.prisma.user.findUnique({
          where: { id: userId },
          select: {
            banned: true,
            status: true,
            suspendedUntil: true,
          },
        });

        if (!dbUser) {
          throw new ForbiddenException({
            code: 'ACCOUNT_NOT_FOUND',
            message: 'Ce compte utilisateur n’existe plus ou a été supprimé.',
          });
        }

        statusInfo = {
          banned: Boolean(dbUser.banned),
          status: dbUser.status || 'ACTIVE',
          suspendedUntil: dbUser.suspendedUntil
            ? dbUser.suspendedUntil.toISOString()
            : null,
        };

        // Mise en cache courte pour haute performance
        await this.redis
          .set(cacheKey, statusInfo, CACHE_TTL_ACCOUNT_STATUS)
          .catch(() => {});
      } catch (err: unknown) {
        if (err instanceof ForbiddenException) throw err;
        this.logger.warn(
          `[AccountStatusGuard] Erreur vérification compte ${userId} : ${err instanceof Error ? err.message : String(err)}`,
        );
        return true; // En cas de panne temporaire, ne pas bloquer les utilisateurs légitimes
      }
    }

    // 1. Vérification de bannissement définitif
    if (statusInfo.banned || statusInfo.status === 'BANNED') {
      this.logger.warn(`🛑 Accès bloqué : compte banni (${userId})`);
      throw new ForbiddenException({
        code: 'ACCOUNT_BANNED',
        message: 'Votre compte a été banni en raison d’un manquement aux règles de la communauté Kanto MG.',
        messageMg: 'Nakatona ny kaontinao noho ny tsy fanajana ny fitsipika mifehy ny fiarahamonina Kanto MG.',
      });
    }

    // 2. Vérification de suspension temporaire
    if (statusInfo.status === 'SUSPENDED') {
      if (statusInfo.suspendedUntil) {
        const suspendEnd = new Date(statusInfo.suspendedUntil);
        if (suspendEnd > new Date()) {
          this.logger.warn(`🛑 Accès bloqué : compte suspendu jusqu’au ${suspendEnd.toISOString()} (${userId})`);
          throw new ForbiddenException({
            code: 'ACCOUNT_SUSPENDED',
            message: `Votre compte est temporairement suspendu jusqu’au ${suspendEnd.toLocaleDateString('fr-FR')}.`,
            messageMg: `Mihantona vonjimaika ny kaontinao hatramin'ny ${suspendEnd.toLocaleDateString('fr-FR')}.`,
            suspendedUntil: suspendEnd.toISOString(),
          });
        }
      } else {
        // Suspension indéfinie
        throw new ForbiddenException({
          code: 'ACCOUNT_SUSPENDED',
          message: 'Votre compte est suspendu. Veuillez contacter le support pour plus d’informations.',
          messageMg: 'Mihantona ny kaontinao. Mifandraisa amin’ny mpitantana raha mila fanazavana fanampiny.',
        });
      }
    }

    // 3. Vérification de compte désactivé
    if (statusInfo.status === 'DEACTIVATED') {
      throw new ForbiddenException({
        code: 'ACCOUNT_DEACTIVATED',
        message: 'Ce compte est actuellement désactivé. Vous pouvez le réactiver depuis la page de connexion.',
        messageMg: 'Tsy miasa io kaonty io amin’izao fotoana izao. Azonao averina velomina izany.',
      });
    }

    return true;
  }
}
