import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { NotificationsService } from './notifications.service.js';
import { CreateNotificationDto } from './dto/notifications.dto.js';
import { RegisterPushTokenDto } from './dto/push-token.dto.js';
import {
  AuthGuard,
  OptionalAuth,
  Roles,
  Session,
  type UserSession,
} from '../auth/index.js';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Enregistre le token Expo Push d'un utilisateur ou d'un visiteur anonyme (invité).
   * L'identité est strictement dérivée de la session active si authentifiée.
   */
  @Post('notifications/push-token')
  @UseGuards(AuthGuard)
  @OptionalAuth()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  registerPushToken(
    @Body() body: RegisterPushTokenDto,
    @Session() session?: UserSession,
  ) {
    const effectiveUserId = session?.user?.id;
    return this.notificationsService.registerPushToken(
      effectiveUserId,
      body.pushToken,
    );
  }

  /**
   * Endpoint mobile : Récupère les notifications groupées par date.
   * Si l'utilisateur est authentifié, retourne ses notifications + broadcast.
   * Si l'utilisateur est anonyme, retourne strictement les notifications broadcast publiques.
   */
  @Get('notifications')
  @UseGuards(AuthGuard)
  @OptionalAuth()
  getPublicNotifications(
    @Query('lang') lang: 'mg' | 'fr' = 'mg',
    @Session() session?: UserSession,
  ) {
    const effectiveUserId = session?.user?.id;
    return this.notificationsService.getPublicNotifications(
      lang,
      effectiveUserId,
    );
  }

  /**
   * Récupère les préférences de notifications intelligentes de l'utilisateur connecté.
   */
  @Get('notifications/preferences')
  @UseGuards(AuthGuard)
  getUserPreferences(@Session() session: UserSession) {
    return this.notificationsService.getUserPreferences(session.user.id);
  }

  /**
   * Met à jour les préférences de notifications de l'utilisateur connecté.
   */
  @Patch('notifications/preferences')
  @UseGuards(AuthGuard)
  updateUserPreferences(
    @Session() session: UserSession,
    @Body() body: Record<string, unknown>,
  ) {
    return this.notificationsService.updateUserPreferences(
      session.user.id,
      body,
    );
  }

  /**
   * Marque une notification comme lue pour l'utilisateur connecté.
   */
  @Patch('notifications/:id/read')
  @UseGuards(AuthGuard)
  markAsRead(@Param('id') id: string, @Session() session: UserSession) {
    return this.notificationsService.markAsRead(id, session.user.id);
  }

  /**
   * Marque toutes les notifications comme lues pour l'utilisateur connecté.
   */
  @Post('notifications/read-all')
  @UseGuards(AuthGuard)
  markAllAsRead(@Session() session: UserSession) {
    return this.notificationsService.markAllAsRead(session.user.id);
  }

  /**
   * Supprime une notification pour l'utilisateur connecté (ou n'importe laquelle si rôle ADMIN).
   */
  @Delete('notifications/:id')
  @UseGuards(AuthGuard)
  deleteNotificationUser(
    @Param('id') id: string,
    @Session() session: UserSession,
  ) {
    const role = session.user.role
      ? Array.isArray(session.user.role)
        ? session.user.role[0]
        : session.user.role
      : undefined;
    return this.notificationsService.deleteNotification(
      id,
      session.user.id,
      role,
    );
  }

  /**
   * Supprime toutes les notifications privées pour l'utilisateur connecté.
   */
  @Delete('notifications')
  @UseGuards(AuthGuard)
  clearAllNotifications(@Session() session: UserSession) {
    const role = session.user.role
      ? Array.isArray(session.user.role)
        ? session.user.role[0]
        : session.user.role
      : undefined;
    return this.notificationsService.clearAllNotifications(
      session.user.id,
      role,
    );
  }

  // ─── ENDPOINTS ADMINISTRATION ─────────────────────────────────────────────

  /**
   * Endpoint administration : Récupère les alertes de modération et opérationnelles du CRM.
   */
  @Get('admin/notifications/alerts')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  getAdminAlerts() {
    return this.notificationsService.getAdminAlerts();
  }

  /**
   * Endpoint administration : Récupère toutes les notifications envoyées.
   */
  @Get('admin/notifications')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  getAllAdminNotifications() {
    return this.notificationsService.getAllAdminNotifications();
  }

  /**
   * Endpoint administration : Crée et diffuse une nouvelle notification.
   */
  @Post('admin/notifications')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  createNotification(@Body() body: CreateNotificationDto) {
    return this.notificationsService.createNotification(body);
  }

  /**
   * Endpoint administration : Envoie une notification push de test.
   */
  @Post('admin/notifications/test-push')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  testPushNotification(@Body() body?: { targetToken?: string }) {
    return this.notificationsService.sendTestPush(body?.targetToken);
  }

  /**
   * Endpoint administration : Supprime une notification.
   */
  @Delete('admin/notifications/:id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  deleteNotificationAdmin(@Param('id') id: string) {
    return this.notificationsService.deleteNotification(id);
  }

  /**
   * Endpoint administration : Supprime toutes les notifications en base de données.
   */
  @Delete('admin/notifications')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  clearAllAdminNotifications() {
    return this.notificationsService.clearAllAdminNotifications();
  }
}
