import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminUsersService } from './admin-users.service.js';
import { AuthGuard, Roles, Session, type UserSession } from '../auth/index.js';

@Controller('admin/users')
@UseGuards(AuthGuard)
@Roles(['ADMIN'])
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  async listUsers(
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
    @Query('search') search?: string,
  ) {
    return this.adminUsersService.listUsers(pageStr, limitStr, search);
  }

  @Patch(':id/role')
  async updateRole(
    @Param('id') id: string,
    @Body('role') role: string,
    @Session() session: UserSession,
  ) {
    return this.adminUsersService.updateRole(id, role, session.user.id);
  }

  @Post(':id/reset-password')
  async resetPassword(
    @Param('id') id: string,
    @Session() session: UserSession,
  ) {
    return this.adminUsersService.resetUserPassword(id, session.user.id);
  }
}
