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
import { AdminUsersService } from './admin-users.service.js';
import { AuthGuard, Roles, Session, type UserSession } from '../auth/index.js';

@Controller('admin/users')
@UseGuards(AuthGuard)
@Roles(['ADMIN', 'admin'])
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  async listUsers(
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('tier') tier?: string,
  ) {
    return this.adminUsersService.listUsers(
      pageStr,
      limitStr,
      search,
      role,
      status,
      tier,
    );
  }

  @Get(':id')
  async getUserDetails(@Param('id') id: string) {
    return this.adminUsersService.getUserDetails(id);
  }

  @Patch(':id/role')
  async updateRole(
    @Param('id') id: string,
    @Body('role') role: string,
    @Session() session: UserSession,
  ) {
    return this.adminUsersService.updateRole(id, role, session.user.id);
  }

  @Patch(':id/tier')
  async updateTier(
    @Param('id') id: string,
    @Body('tier') tier: string,
    @Session() session: UserSession,
  ) {
    return this.adminUsersService.updateTier(id, tier, session.user.id);
  }


  @Patch(':id/ban')
  async banUser(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Body('expiresAt') expiresAt: string | undefined,
    @Session() session: UserSession,
  ) {
    return this.adminUsersService.banUser(
      id,
      reason,
      expiresAt,
      session.user.id,
    );
  }

  @Patch(':id/unban')
  async unbanUser(@Param('id') id: string, @Session() session: UserSession) {
    return this.adminUsersService.unbanUser(id, session.user.id);
  }

  @Post(':id/reset-password')
  async resetPassword(
    @Param('id') id: string,
    @Session() session: UserSession,
  ) {
    return this.adminUsersService.resetUserPassword(id, session.user.id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Session() session: UserSession) {
    return this.adminUsersService.deleteUser(id, session.user.id);
  }
}
