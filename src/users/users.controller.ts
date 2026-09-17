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
import { AuthGuard, Session, type UserSession } from '../auth/index.js';
import { Throttle } from '@nestjs/throttler';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('check-username')
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
  getPublicProfile(
    @Param('userId') userId: string,
    @Session() session?: UserSession,
  ) {
    return this.usersService.getPublicProfile(userId, session?.user?.id);
  }
}
