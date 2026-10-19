import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AdminUsersService } from './admin-users.service.js';
import { AuthGuard, Roles, Session, type UserSession } from '../auth/index.js';

function resolveAdminId(session?: UserSession, req?: Request): string {
  return (
    session?.user?.id ||
    (req as any)?.user?.id ||
    (req as any)?.session?.user?.id ||
    'ADMIN'
  );
}

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
    @Session() session?: UserSession,
    @Req() req?: Request,
  ) {
    return this.adminUsersService.updateRole(
      id,
      role,
      resolveAdminId(session, req),
    );
  }

  @Patch(':id/tier')
  async updateTier(
    @Param('id') id: string,
    @Body('tier') tier: string,
    @Session() session?: UserSession,
    @Req() req?: Request,
  ) {
    return this.adminUsersService.updateTier(
      id,
      tier,
      resolveAdminId(session, req),
    );
  }

  @Patch(':id/ban')
  async banUser(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Body('expiresAt') expiresAt: string | undefined,
    @Session() session?: UserSession,
    @Req() req?: Request,
  ) {
    return this.adminUsersService.banUser(
      id,
      reason,
      expiresAt,
      resolveAdminId(session, req),
    );
  }

  @Patch(':id/unban')
  async unbanUser(
    @Param('id') id: string,
    @Session() session?: UserSession,
    @Req() req?: Request,
  ) {
    return this.adminUsersService.unbanUser(id, resolveAdminId(session, req));
  }

  @Post(':id/reset-password')
  async resetPassword(
    @Param('id') id: string,
    @Session() session?: UserSession,
    @Req() req?: Request,
  ) {
    return this.adminUsersService.resetUserPassword(
      id,
      resolveAdminId(session, req),
    );
  }

  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
    @Session() session?: UserSession,
    @Req() req?: Request,
  ) {
    return this.adminUsersService.deleteUser(id, resolveAdminId(session, req));
  }
}
