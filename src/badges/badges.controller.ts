import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BadgesService } from './badges.service.js';
import {
  AuthGuard,
  OptionalAuth,
  Session,
  type UserSession,
} from '../auth/index.js';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  /**
   * Récupère le catalogue officiel de tous les badges du système Kanto.
   */
  @Get('catalog')
  getCatalog() {
    return this.badgesService.getCatalog();
  }

  /**
   * Récupère les badges et la progression de l'utilisateur connecté.
   */
  @Get('my')
  @UseGuards(AuthGuard)
  @OptionalAuth()
  async getMyBadges(@Session() session?: UserSession) {
    if (!session?.user?.id) {
      // Pour les utilisateurs invités non connectés, renvoie le catalogue avec progression 0
      const catalog = this.badgesService.getCatalog();
      return catalog.map((b) => ({
        ...b,
        currentValue: 0,
        isUnlocked: false,
        unlockedAt: null,
        progressPercent: 0,
      }));
    }

    return this.badgesService.getUserBadges(session.user.id);
  }

  /**
   * Récupère les badges d'un utilisateur spécifique (pour son profil public / friendProfile).
   */
  @Get('user/:userId')
  async getUserBadges(@Param('userId') userId: string) {
    return this.badgesService.getUserBadges(userId);
  }

  /**
   * Déclenche la vérification et le déblocage automatique des badges mérités.
   */
  @Post('check')
  @UseGuards(AuthGuard)
  async checkMyBadges(@Session() session: UserSession) {
    return this.badgesService.checkAndUnlockBadges(session.user.id);
  }
}
