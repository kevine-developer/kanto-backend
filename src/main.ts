import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';
import {
  HttpExceptionFilter,
  PrismaExceptionFilter,
} from './common/filters/index.js';
import { validateEnvironment } from './config/env.validation.js';
import express from 'express';
import net from 'node:net';
import path from 'node:path';

function isPortFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => {
      resolve(false);
    });
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '0.0.0.0');
  });
}

async function getAvailablePort(
  desiredPort: number,
  maxTries = 10,
): Promise<number> {
  for (let i = 0; i < maxTries; i++) {
    const candidatePort = desiredPort + i;
    if (await isPortFree(candidatePort)) {
      return candidatePort;
    }
  }
  return desiredPort;
}

async function bootstrap() {
  validateEnvironment();

  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());

  // ─── CORS ─────────────────────────────────────────────────────────────────
  // En production, définir CORS_ORIGINS avec les domaines autorisés séparés par des virgules.
  // Ex: CORS_ORIGINS=https://admin.kanto.mg,https://app.kanto.mg
  // En développement, les origines locales et mobiles sont autorisées par défaut.
  const rawOrigins = process.env.CORS_ORIGINS;
  const allowedOrigins: (string | RegExp)[] = rawOrigins
    ? rawOrigins.split(',').map((o) => o.trim())
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://localhost:8081',
        'http://192.168.1.38:8081',
        'http://192.168.1.100:8081',
        'http://192.168.1.100:3000',
        'http://192.168.1.100:3001',
        // Schémas deep-link mobiles (Expo Go, builds standalone)
        /^kanto:\/\//,
        /^kantomg:\/\//,
        /^exp:\/\//,
        // IP locales privées et interfaces virtuelles / APIPA (192.168.x.x, 10.x.x.x, 172.16-31.x.x, 169.254.x.x)
        /^http:\/\/192\.168\.\d+\.\d+:\d+$/,
        /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,
        /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+:\d+$/,
        /^http:\/\/169\.254\.\d+\.\d+:\d+$/,
      ];

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Autoriser les requêtes sans origine (apps mobiles natives, curl, Postman)
      if (!origin) {
        callback(null, true);
        return;
      }
      const allowed = allowedOrigins.some((pattern) =>
        pattern instanceof RegExp ? pattern.test(origin) : pattern === origin,
      );
      if (allowed) {
        callback(null, true);
      } else {
        Logger.warn(
          `[CORS] Origine non autorisée bloquée : ${origin}`,
          'Bootstrap',
        );
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // ─── Sécurité HTTP ────────────────────────────────────────────────────────
  // Headers de sécurité minimaux sans dépendance tierce (Helmet non installé)
  app.use(
    (
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      // HSTS : forcer HTTPS en production (ignoré en HTTP local)
      if (process.env.NODE_ENV === 'production') {
        res.setHeader(
          'Strict-Transport-Security',
          'max-age=31536000; includeSubDomains',
        );
      }
      next();
    },
  );

  // Servir les fichiers audio et médias téléchargeables
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

  const desiredPort = Number(process.env.PORT) || 3000;
  const port = await getAvailablePort(desiredPort);

  if (port !== desiredPort) {
    Logger.warn(
      `⚠️ Le port ${desiredPort} est déjà occupé. Bascule automatique sur le port disponible : ${port}`,
      'Bootstrap',
    );
  }

  await app.listen(port, '0.0.0.0');
  Logger.log(
    `Application is running on: http://localhost:${port} (network: http://192.168.1.100:${port})`,
    'Bootstrap',
  );
}
void bootstrap();
