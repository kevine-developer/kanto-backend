import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { CitationsModule } from './citations/citations.module.js';
import { ContesModule } from './contes/contes.module.js';
import { ItemsModule } from './items/items.module.js';
import { KabaryModule } from './kabary/kabary.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ThemesModule } from './themes/themes.module.js';
import { AdminModule } from './admin/admin.module.js';
import { RedisModule } from './redis/redis.module.js';
import { TrueFalseModule } from './games/true-false/true-false.module.js';
import { WordPuzzleModule } from './games/word-puzzle/word-puzzle.module.js';
import { MissingWordModule } from './games/missing-word/missing-word.module.js';
import { LocksModule } from './locks/locks.module.js';
import { OnboardingModule } from './onboarding/onboarding.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { IntegrationsModule } from './integrations/integrations.module.js';

@Module({
  imports: [
    // Rate limiting global : 60 requêtes par minute par IP (protection brute-force)
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000, // fenêtre de 1 minute (ms)
        limit: 60, // 60 requêtes max par IP par fenêtre
      },
      {
        name: 'auth',
        ttl: 60000, // fenêtre de 1 minute (ms)
        limit: 10, // 10 tentatives d'authentification max par IP par minute
      },
    ]),
    PrismaModule,
    RedisModule,
    IntegrationsModule,
    AuthModule,
    ThemesModule,
    ItemsModule,
    CitationsModule,
    ContesModule,
    KabaryModule,
    AdminModule,
    TrueFalseModule,
    WordPuzzleModule,
    MissingWordModule,
    LocksModule,
    OnboardingModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Applique ThrottlerGuard globalement sur toutes les routes
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
