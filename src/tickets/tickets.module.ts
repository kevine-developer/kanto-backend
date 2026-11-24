import { Module } from '@nestjs/common';
import { TicketsService } from './services/tickets.service.js';
import { TicketValidationService } from './services/ticket-validation.service.js';
import { TicketsAdminService } from './services/tickets-admin.service.js';
import { WalletPassService } from './services/wallet-pass.service.js';
import { TicketsController } from './tickets.controller.js';
import { TicketsAdminController } from './tickets-admin.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [TicketsController, TicketsAdminController],
  providers: [
    TicketsService,
    TicketValidationService,
    TicketsAdminService,
    WalletPassService,
  ],
  exports: [TicketsService, TicketValidationService, WalletPassService],
})
export class TicketsModule {}
