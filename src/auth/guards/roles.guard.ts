import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

/**
 * Guard qui vérifie si l'utilisateur connecté possède le rôle requis.
 * Doit être utilisé APRÈS le AuthGuard de Better Auth (qui injecte la session).
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si aucun rôle n'est requis, on laisse passer
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user?: { id: string; role: string } }>();
    const user = request.user;

    if (!user) {
      this.logger.warn('RolesGuard: aucun utilisateur dans la requête');
      throw new ForbiddenException(
        'Accès refusé : utilisateur non authentifié',
      );
    }

    const userRole = user.role?.trim();
    const userRoleUpper = userRole?.toUpperCase();
    const hasRole = requiredRoles.some((role) => {
      const trimmedRole = role.trim();
      return (
        userRole === trimmedRole || userRoleUpper === trimmedRole.toUpperCase()
      );
    });

    if (!hasRole) {
      this.logger.warn(
        `RolesGuard: utilisateur ${user.id} (role: ${user.role}) n'a pas le rôle requis [${requiredRoles.join(', ')}]`,
      );
      throw new ForbiddenException(
        `Accès refusé : rôle ${requiredRoles.join(' ou ')} requis`,
      );
    }

    return true;
  }
}
