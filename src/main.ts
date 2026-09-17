import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module.js'; // NestJS Kanto App
import {
  LoggingInterceptor,
  TrafficRegulationInterceptor,
} from './common/interceptors/index.js';
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

  const isProduction = process.env.NODE_ENV === 'production';
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger: isProduction ? ['error', 'warn'] : ['error', 'warn', 'log'],
  });

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TrafficRegulationInterceptor(),
  );
  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false, // Don't throw errors, just strip unknown fields to avoid breaking the frontend
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

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
  app.use(helmet());
  app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

  // Servir les fichiers audio et médias téléchargeables de manière sécurisée
  app.use(
    '/uploads',
    express.static(path.resolve(process.cwd(), 'uploads'), {
      dotfiles: 'ignore', // Bloque les fichiers cachés (.env, .git, etc.)
      index: false, // Empêche le directory browsing
      maxAge: '7d', // Mise en cache optimale
      setHeaders: (res) => {
        res.setHeader('X-Content-Type-Options', 'nosniff'); // Empêche le reniflage de type MIME
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      },
    }),
  );

  const desiredPort = Number(process.env.PORT) || 3000;
  const port = await getAvailablePort(desiredPort);

  if (port !== desiredPort) {
    Logger.warn(
      `⚠️ Le port ${desiredPort} est déjà occupé. Bascule automatique sur le port disponible : ${port}`,
      'Bootstrap',
    );
  }

  await app.listen(port, '0.0.0.0');
  const launchMsg = `🚀 [Kanto Backend] Serveur démarré avec succès sur le port ${port} (Environnement: ${process.env.NODE_ENV || 'development'})`;
  if (isProduction) {
    console.log(launchMsg);
  } else {
    Logger.log(launchMsg, 'Bootstrap');
  }
}
void bootstrap();
