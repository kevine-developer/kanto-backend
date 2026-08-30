import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

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

    // Logger au niveau adapté
    if (status >= 500) {
      this.logger.error(
        `❌ [HTTP ${status}] ${request.method} ${request.originalUrl} - ${message}`,
      );
    } else if (status >= 400) {
      this.logger.warn(
        `⚠️ [HTTP ${status}] ${request.method} ${request.originalUrl} - ${message}`,
      );
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
