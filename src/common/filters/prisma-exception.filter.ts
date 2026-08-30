import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Prisma } from '../../../generated/prisma/client.js';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(
    exception:
      Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientValidationError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.BAD_REQUEST;
    let message = 'Erreur lors de l’opération en base de données.';
    let error = 'Database Error';

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002': {
          status = HttpStatus.CONFLICT;
          error = 'Conflict';
          const target = exception.meta?.target;
          const fields = Array.isArray(target) ? target.join(', ') : target;
          message = fields
            ? `Un enregistrement avec ce champ (${fields}) existe déjà.`
            : 'Un enregistrement similaire existe déjà (contrainte unique violée).';
          break;
        }
        case 'P2025': {
          status = HttpStatus.NOT_FOUND;
          error = 'Not Found';
          message =
            (exception.meta?.cause as string) ||
            'La ressource demandée est introuvable ou a déjà été supprimée.';
          break;
        }
        case 'P2003': {
          status = HttpStatus.BAD_REQUEST;
          error = 'Foreign Key Violation';
          const field = exception.meta?.field_name;
          message = field
            ? `La référence (${field}) pointe vers une entité inexistante.`
            : 'Référence de relation invalide.';
          break;
        }
        case 'P2024': {
          status = HttpStatus.SERVICE_UNAVAILABLE;
          error = 'Database Timeout';
          message =
            'La base de données met trop de temps à répondre. Veuillez réessayer ultérieurement.';
          break;
        }
        default: {
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          error = 'Database Error';
          message =
            'Une erreur inattendue est survenue au niveau de la base de données.';
          this.logger.error(
            `❌ [Prisma Error ${exception.code}] ${exception.message}`,
            exception.stack,
          );
          break;
        }
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      error = 'Validation Error';
      message =
        'Les données transmises ne sont pas conformes au schéma de base de données.';
      this.logger.warn(`⚠️ [Prisma Validation] ${exception.message}`);
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.originalUrl || request.url,
      method: request.method,
      error,
      message,
    };

    this.logger.warn(
      `⚠️ [PrismaException] ${request.method} ${request.originalUrl} -> ${status} (${error}) : ${message}`,
    );

    response.status(status).json(errorResponse);
  }
}
