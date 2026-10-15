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
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UploadAvatarDto } from './dto/upload-avatar.dto.js';
import { AddPasswordDto } from './dto/add-password.dto.js';
import { DeleteAccountDto } from './dto/delete-account.dto.js';
import {
  AuthGuard,
  OptionalAuth,
  Session,
  type UserSession,
} from '../auth/index.js';
import { Throttle } from '@nestjs/throttler';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('check-username')
  @UseGuards(AuthGuard)
  @OptionalAuth()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  checkUsername(
    @Query('username') username: string,
    @Session() session?: UserSession,
  ) {
    return this.usersService.checkUsernameAvailability(
      username,
      session?.user?.id,
    );
  }

  @Get('me/stats')
  @UseGuards(AuthGuard)
  getMyStats(@Session() session: UserSession) {
    return this.usersService.getMyStats(session.user.id);
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  updateMe(@Body() body: UpdateUserDto, @Session() session: UserSession) {
    return this.usersService.updateMe(session.user.id, body);
  }

  @Post('me/avatar')
  @UseGuards(AuthGuard)
  @Throttle({ upload: { limit: 15, ttl: 60000 } })
  uploadAvatar(@Body() body: UploadAvatarDto, @Session() session: UserSession) {
    return this.usersService.uploadAvatar(
      session.user.id,
      body.imageBase64,
      body.fileName,
    );
  }

  @Delete('me/avatar')
  @UseGuards(AuthGuard)
  deleteAvatar(@Session() session: UserSession) {
    return this.usersService.deleteAvatar(session.user.id);
  }

  @Get('me/favorites')
  @UseGuards(AuthGuard)
  getMyFavorites(@Session() session: UserSession) {
    return this.usersService.getMyFavorites(session.user.id);
  }

  /**
   * Profil public d'un utilisateur avec statistiques complètes, rang, et statut relationnel.
   */
  @Get(':userId/public-profile')
  @UseGuards(AuthGuard)
  @OptionalAuth()
  getPublicProfile(
    @Param('userId') userId: string,
    @Session() session?: UserSession,
  ) {
    return this.usersService.getPublicProfile(userId, session?.user?.id);
  }

  /**
   * Récupère les méthodes d'authentification actives du compte courant.
   * Permet à l'interface mobile d'adapter dynamiquement les options de sécurité.
   * Ne retourne jamais les mots de passe ou tokens.
   */
  @Get('me/auth-methods')
  @UseGuards(AuthGuard)
  getAuthMethods(@Session() session: UserSession) {
    return this.usersService.getAuthMethods(session.user.id);
  }

  /**
   * Ajoute un mot de passe Kanto à un compte OAuth sans mot de passe local.
   * Interdit si le compte possède déjà un mot de passe (réponse 409 Conflict).
   * Throttling strict : 5 tentatives par minute.
   */
  @Post('me/add-password')
  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  addPassword(@Body() body: AddPasswordDto, @Session() session: UserSession) {
    return this.usersService.addPassword(session.user.id, body.newPassword);
  }

  /**
   * Suppression définitive du compte utilisateur (Droit à l'effacement RGPD).
   * Nécessite une authentification active (AuthGuard).
   * Throttling strict : 3 tentatives par 5 minutes pour prévenir les abus par force brute.
   */
  @Delete('me')
  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 3, ttl: 300000 } })
  deleteAccount(
    @Body() body: DeleteAccountDto,
    @Session() session: UserSession,
  ) {
    return this.usersService.deleteAccount(session.user.id, body);
  }
}
