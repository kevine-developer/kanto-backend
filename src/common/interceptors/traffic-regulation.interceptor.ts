import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * Intercepteur de régulation de trafic et de lissage de flux.
 *
 * Permet d'injecter une latence minimale non-bloquante (RxJS non-bloquant l'Event Loop)
 * pour lisser les pics de charge concurrents ou simuler des conditions réseau réelles en dev.
 * Configurable via la variable d'environnement REGULATION_DELAY_MS (ex: 50, 100, 200).
 */
@Injectable()
export class TrafficRegulationInterceptor implements NestInterceptor {
  private readonly delayMs: number;

  constructor() {
    const envDelay = Number(process.env.REGULATION_DELAY_MS);
    this.delayMs = !isNaN(envDelay) && envDelay > 0 ? envDelay : 0;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Ajouter un en-tête de régulation de charge
    if (response && typeof response.setHeader === 'function') {
      response.setHeader('X-Traffic-Regulation', 'active');
    }

    if (this.delayMs > 0) {
      return next.handle().pipe(delay(this.delayMs));
    }

    return next.handle();
  }
}
