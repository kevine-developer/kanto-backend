import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';

// Services
import { PartnersService } from './services/partners.service.js';
import { PartnerApiKeysService } from './services/partner-api-keys.service.js';
import { PartnerEventsService } from './services/partner-events.service.js';
import { PartnerMarketingService } from './services/partner-marketing.service.js';

// Guards
import { PartnerApiKeyGuard } from './guards/partner-api-key.guard.js';
import { PartnerScopesGuard } from './guards/partner-scopes.guard.js';

// Controllers v1 (API Partenaires publique & développeurs)
import { PartnerEventsV1Controller } from './controllers/v1/partner-events.controller.js';
import { PartnerRegistrationsV1Controller } from './controllers/v1/partner-registrations.controller.js';
import { PartnerMarketingV1Controller } from './controllers/v1/partner-marketing.controller.js';
import { PartnerMediaV1Controller } from './controllers/v1/partner-media.controller.js';

// Controllers Portail SaaS & Administration
import { PartnerPortalController } from './controllers/partner-portal.controller.js';
import { PartnerAdminController } from './controllers/partner-admin.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [
    // API Publique v1
    PartnerEventsV1Controller,
    PartnerRegistrationsV1Controller,
    PartnerMarketingV1Controller,
    PartnerMediaV1Controller,

    // Portail & Admin
    PartnerPortalController,
    PartnerAdminController,
  ],
  providers: [
    PartnersService,
    PartnerApiKeysService,
    PartnerEventsService,
    PartnerMarketingService,
    PartnerApiKeyGuard,
    PartnerScopesGuard,
  ],
  exports: [
    PartnersService,
    PartnerApiKeysService,
    PartnerEventsService,
    PartnerMarketingService,
  ],
})
export class PartnersModule implements OnModuleInit {
  private readonly logger = new Logger(PartnersModule.name);

  constructor(private readonly marketingService: PartnerMarketingService) {}

  async onModuleInit() {
    this.logger.log('Initialisation du module Kanto Partners...');
    // Seed idempotent des emplacements publicitaires marketing par défaut
    try {
      await this.marketingService.seedDefaultPlacementsIfEmpty();
      this.logger.log('Catalogue des emplacements marketing Kanto vérifié avec succès.');
    } catch (err: any) {
      this.logger.warn(
        `Impossible d'initialiser les emplacements marketing : ${err.message}`,
      );
    }
  }
}
