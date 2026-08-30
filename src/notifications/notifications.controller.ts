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

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Endpoint public mobile : Récupère les notifications groupées par date.
   */
  @Get('notifications')
  getPublicNotifications(@Query('lang') lang: 'mg' | 'fr' = 'mg') {
    return this.notificationsService.getPublicNotifications(lang);
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
