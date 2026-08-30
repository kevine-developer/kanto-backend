import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Request, Response } from 'express';

const SENSITIVE_KEYS = new Set([
  'password',
  'currentpassword',
  'newpassword',
  'confirmpassword',
  'token',
  'accesstoken',
  'refreshtoken',
  'secret',
  'apikey',
  'authorization',
  'creditcard',
]);

/**
 * Assainit récursivement un objet pour masquer les champs sensibles dans les logs.
 */
function sanitize(obj: unknown, depth = 0): unknown {
  if (depth > 5 || obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    return obj.length > 500 ? `${obj.slice(0, 500)}... [tronqué]` : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitize(item, depth + 1));
  }

  if (typeof obj === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const lower = key.toLowerCase();
      if (SENSITIVE_KEYS.has(lower)) {
        cleaned[key] = '***[MASQUÉ]***';
      } else if (Buffer.isBuffer(value)) {
        cleaned[key] = `[Buffer ${value.length} octets]`;
      } else {
        cleaned[key] = sanitize(value, depth + 1);
      }
    }
    return cleaned;
  }

  return obj;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const method = req.method;
    const originalUrl = req.originalUrl || req.url;
    const ip = req.ip || '127.0.0.1';
    const startTime = Date.now();

    const query = req.query as Record<string, unknown>;
    const body = req.body as Record<string, unknown>;

    const hasQuery =
      query && typeof query === 'object' && Object.keys(query).length > 0;
    const hasBody =
      body && typeof body === 'object' && Object.keys(body).length > 0;

    const safeQuery = hasQuery ? JSON.stringify(sanitize(query)) : null;
    const safeBody = hasBody ? JSON.stringify(sanitize(body)) : null;

    this.logger.log(
      `📩 [REQ] ${method} ${originalUrl} [IP: ${ip}]${safeQuery ? ` | Query: ${safeQuery}` : ''}${safeBody ? ` | Body: ${safeBody}` : ''}`,
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = res.statusCode;
          this.logger.log(
            `📤 [RES] ${method} ${originalUrl} -> ${statusCode} OK (+${duration}ms)`,
          );
        },
        error: (err: {
          status?: number;
          statusCode?: number;
          message?: string;
        }) => {
          const duration = Date.now() - startTime;
          const statusCode = err.status || err.statusCode || 500;
          this.logger.error(
            `❌ [ERR] ${method} ${originalUrl} -> ${statusCode} (+${duration}ms) : ${err.message || 'Erreur interne'}`,
          );
        },
      }),
    );
  }
}
