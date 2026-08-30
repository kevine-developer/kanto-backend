import { Controller, Get } from '@nestjs/common';
import { LocksService } from './locks.service.js';

@Controller('locks')
export class LocksController {
  constructor(private readonly locksService: LocksService) {}

  /**
   * Endpoint public utilisé par l'application mobile Kanto
   * pour récupérer en un appel rapide le statut de tous les modules.
   */
  @Get()
  async getPublicLocks() {
    return this.locksService.getPublicLocks();
  }
}
