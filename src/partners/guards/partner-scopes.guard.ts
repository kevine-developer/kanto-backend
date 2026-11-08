import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PARTNER_SCOPES_KEY } from '../decorators/partner-scopes.decorator.js';
import { PartnerApiScope } from '../dto/partner-api-key.dto.js';

@Injectable()
export class PartnerScopesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredScopes = this.reflector.getAllAndOverride<
      PartnerApiScope[] | undefined
    >(PARTNER_SCOPES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredScopes || requiredScopes.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      partnerScopes?: string[];
    }>();

    const currentScopes = request.partnerScopes || [];

    const hasAllScopes = requiredScopes.every((scope) =>
      currentScopes.includes(scope),
    );

    if (!hasAllScopes) {
      const missing = requiredScopes.filter((s) => !currentScopes.includes(s));
      throw new ForbiddenException(
        `Permissions insuffisantes. Scope(s) requis manquant(s) sur votre clé API : ${missing.join(', ')}`,
      );
    }

    return true;
  }
}

