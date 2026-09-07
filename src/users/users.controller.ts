import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { AuthGuard, Session, type UserSession } from '../auth/index.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @Get('me/favorites')
  @UseGuards(AuthGuard)
  getMyFavorites(@Session() session: UserSession) {
    return this.usersService.getMyFavorites(session.user.id);
  }
}
