import { Controller, Get, Param } from '@nestjs/common';
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

  /**
   * Endpoint public retournant l'état d'activation des langues de l'application mobile.
   */
  @Get('languages/status')
  async getAppLanguages() {
    return this.locksService.getAppLanguages();
  }

  /**
   * Endpoint public pour récupérer le statut d'un module unique par sa clé.
   */
  @Get(':key')
  async getPublicLockByKey(@Param('key') key: string) {
    return this.locksService.getPublicLockByKey(key);
  }
}
