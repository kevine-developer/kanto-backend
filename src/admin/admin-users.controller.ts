import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminUsersService } from './admin-users.service.js';
import { AuthGuard, Roles } from '../auth/index.js';

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
  ) {
    return this.adminUsersService.listUsers(pageStr, limitStr, search);
  }

  @Patch(':id/role')
  async updateRole(@Param('id') id: string, @Body('role') role: string) {
    return this.adminUsersService.updateRole(id, role);
  }
}
