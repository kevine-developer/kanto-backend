import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { CreateNotificationDto } from './dto/notifications.dto.js';
import { RegisterPushTokenDto } from './dto/push-token.dto.js';
import { Session, type UserSession } from '../auth/index.js';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Enregistre le token Expo Push d'un utilisateur.
   */
  @Post('notifications/push-token')
  registerPushToken(
    @Body() body: RegisterPushTokenDto,
    @Session() session?: UserSession,
  ) {
    const effectiveUserId = session?.user?.id || body.userId;
    if (!effectiveUserId) {
      return {
        success: false,
        message:
          'Identifiant utilisateur requis pour enregistrer le token push',
      };
    }
    return this.notificationsService.registerPushToken(
      effectiveUserId,
      body.pushToken,
    );
  }

  /**
   * Endpoint public mobile : Récupère les notifications groupées par date.
   */
  @Get('notifications')
  getPublicNotifications(
    @Query('lang') lang: 'mg' | 'fr' = 'mg',
    @Query('userId') queryUserId?: string,
    @Session() session?: UserSession,
  ) {
    const effectiveUserId = session?.user?.id || queryUserId;
    return this.notificationsService.getPublicNotifications(
      lang,
      effectiveUserId,
    );
  }

  /**
   * Marque une notification comme lue.
   */
  @Patch('notifications/:id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  /**
   * Marque toutes les notifications comme lues.
   */
  @Post('notifications/read-all')
  markAllAsRead() {
    return this.notificationsService.markAllAsRead();
  }

  /**
   * Supprime une notification pour l'utilisateur.
   */
  @Delete('notifications/:id')
  deleteNotificationUser(@Param('id') id: string) {
    return this.notificationsService.deleteNotification(id);
  }

  /**
   * Supprime toutes les notifications.
   */
  @Delete('notifications')
  clearAllNotifications() {
    return this.notificationsService.clearAllNotifications();
  }

  // ─── ENDPOINTS ADMINISTRATION ─────────────────────────────────────────────

  /**
   * Endpoint administration : Récupère toutes les notifications envoyées.
   */
  @Get('admin/notifications')
  getAllAdminNotifications() {
    return this.notificationsService.getAllAdminNotifications();
  }

  /**
   * Endpoint administration : Crée et diffuse une nouvelle notification.
   */
  @Post('admin/notifications')
  createNotification(@Body() body: CreateNotificationDto) {
    return this.notificationsService.createNotification(body);
  }

  /**
   * Endpoint administration : Supprime une notification.
   */
  @Delete('admin/notifications/:id')
  deleteNotificationAdmin(@Param('id') id: string) {
    return this.notificationsService.deleteNotification(id);
  }
}
