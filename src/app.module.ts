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
import { DuelModule } from './games/duel/duel.module.js';
import { MultiplayerModule } from './games/multiplayer/multiplayer.module.js';
import { LocksModule } from './locks/locks.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { IntegrationsModule } from './integrations/integrations.module.js';
import { ProgressionModule } from './progression/progression.module.js';
import { UsersModule } from './users/users.module.js';
import { ContributionsModule } from './contributions/contributions.module.js';
import { PoesiesModule } from './poesies/poesies.module.js';
import { RecitationModule } from './recitations/recitations.module.js';
import { CivicModule } from './civic/civic.module.js';
import { LeaderboardModule } from './leaderboard/leaderboard.module.js';
import { RealtimeModule } from './realtime/realtime.module.js';
import { BadgesModule } from './badges/badges.module.js';
import { AstrologyModule } from './astrology/astrology.module.js';
import { AnnouncementsModule } from './announcements/announcements.module.js';
import { RiddleModule } from './games/riddle/riddle.module.js';
import { VintanaModule } from './vintana/vintana.module.js';
import { FriendsModule } from './friends/friends.module.js';
import { HistoryModule } from './history/history.module.js';
import { WelcomeSlidesModule } from './welcome-slides/welcome-slides.module.js';
import { MarketingBannersModule } from './marketing-banners/marketing-banners.module.js';
import { PagesModule } from './pages/pages.module.js';

@Module({
  imports: [
    // Rate limiting multi-paliers : régularisation des flux concurrents et protection anti-burst
    ThrottlerModule.forRoot([
      {
        name: 'burst',
        ttl: 1000, // 1 seconde
        limit: 60, // max 60 requêtes par seconde par IP (navigation fluide / chargement simultané)
      },
      {
        name: 'default',
        ttl: 60000, // 1 minute
        limit: 600, // max 600 requêtes par minute par IP
      },
      {
        name: 'auth',
        ttl: 60000, // 1 minute
        limit: 20, // max 20 tentatives d'authentification par minute
      },
      {
        name: 'upload',
        ttl: 60000, // 1 minute
        limit: 15, // max 15 téléversements d'images par minute par IP (protection disque & Cloudinary)
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
    DuelModule,
    MultiplayerModule,
    LocksModule,
    NotificationsModule,
    ProgressionModule,
    UsersModule,
    ContributionsModule,
    PoesiesModule,
    RecitationModule,
    CivicModule,
    LeaderboardModule,
    RealtimeModule,
    BadgesModule,
    AstrologyModule,
    AnnouncementsModule,
    RiddleModule,
    VintanaModule,
    FriendsModule,
    HistoryModule,
    WelcomeSlidesModule,
    MarketingBannersModule,
    PagesModule,
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
