import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

/**
 * Patterns de paths associés aux scanners de sécurité automatisés (bots).
 * Ces requêtes sont ignorées dans les logs pour réduire le bruit.
 * Le serveur répond toujours 404 — seul le log est supprimé.
 */
const SCANNER_BOT_PATTERNS = [
  /^\/\.env/,
  /^\/\.aws\//,
  /^\/\.git\//,
  /^\/\.github\//,
  /^\/\.gitlab/,
  /^\/\.gitmodules/,
  /^\/\.git-credentials/,
  /^\/\.docker\//,
  /^\/\.npmrc/,
  /^\/\.s3cfg/,
  /^\/\.boto/,
  /^\/\.amplifyrc/,
  /^\/\.claude\//,
  /^\/\.ssh\//,
  /^\/_profiler\//,
  /^\/phpinfo/,
  /^\/info\.php/,
  /^\/wp-config/,
  /^\/wp-content\//,
  /^\/composer\.json/,
  /^\/vendor\//,
  /^\/Dockerfile/,
  /^\/docker-compose/,
  /^\/config\.php/,
  /^\/credentials/,
  /^\/auth\.json/,
  /^\/secrets\.json/,
  /^\/appsettings/,
  /^\/aws-exports/,
  /^\/sendgrid\.env/,
  /^\/(env|env\.js|env\.txt|env-config\.js|runtime-config\.js)/,
  /^\/(config|settings|database|index|app|back|api|public|src|server|admin|frontend|backend|laravel|nuxt|next|astro|remix|svelte|vue-app|angular-app|express-app|cordova|ionic|electron|capacitor|flutter|demo|dev|staging|production|backup|old|new|media|cms|core|v[0-9]+)\/(\.env|env)/,
];

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Une erreur interne est survenue sur le serveur.';
    let error = 'Internal Server Error';
    let details: unknown = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
        error = exception.name.replace(/Exception$/, '');
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;
        message = resObj.message || exception.message;
        error = resObj.error || exception.name.replace(/Exception$/, '');
        if (Array.isArray(resObj.message)) {
          // Cas de validation avec tableau de messages
          details = resObj.message;
          message = resObj.message.join(' ; ');
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        `💥 [CRASH 500] ${request.method} ${request.originalUrl} : ${exception.message}`,
        exception.stack,
      );
      // En production, masquer le message technique brut pour éviter toute divulgation OWASP
      if (process.env.NODE_ENV === 'development') {
        message = exception.message;
      }
    } else {
      this.logger.error(
        `💥 [CRASH 500 INCONNU] ${request.method} ${request.originalUrl} : ${String(exception)}`,
      );
    }

    // Ignorer silencieusement les 404 provenant de scanners de sécurité automatisés
    const requestPath = request.originalUrl || request.url;
    const isScannerBot =
      status === HttpStatus.NOT_FOUND &&
      SCANNER_BOT_PATTERNS.some((pattern) => pattern.test(requestPath));

    // Logger au niveau adapté (sauf pour les bots scanners)
    if (!isScannerBot) {
      if (status >= 500) {
        this.logger.error(
          `❌ [HTTP ${status}] ${request.method} ${requestPath} - ${message}`,
        );
      } else if (status >= 400) {
        this.logger.warn(
          `⚠️ [HTTP ${status}] ${request.method} ${requestPath} - ${message}`,
        );
      }
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.originalUrl || request.url,
      method: request.method,
      error,
      message,
      ...(details ? { details } : {}),
    };

    response.status(status).json(errorResponse);
  }
}
