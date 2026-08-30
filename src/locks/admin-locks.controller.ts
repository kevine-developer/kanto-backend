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
import { LocksService } from './locks.service.js';
import { AuthGuard, Roles } from '../auth/index.js';

export class CreateModuleDto {
  key: string;
  type: 'GAME' | 'CATEGORY' | 'FEATURE';
  nameFr: string;
  nameMg: string;
  imageUrl?: string;
  isLocked?: boolean;
  lockReason?: string;
  minTier?: string;
}

export class UpdateLockDto {
  nameFr?: string;
  nameMg?: string;
  type?: 'GAME' | 'CATEGORY' | 'FEATURE';
  imageUrl?: string;
  isLocked?: boolean;
  lockReason?: string;
  minTier?: string;
}

export class UploadImageDto {
  imageBase64: string;
  fileName?: string;
}

@Controller('admin/locks')
@UseGuards(AuthGuard)
@Roles(['ADMIN', 'admin'])
export class AdminLocksController {
  constructor(private readonly locksService: LocksService) {}

  @Get()
  async getAdminLocks(@Query('type') type?: 'GAME' | 'CATEGORY' | 'FEATURE') {
    return this.locksService.getAdminLocks(type);
  }

  @Post()
  async createModule(@Body() body: CreateModuleDto) {
    return this.locksService.createModule(body);
  }

  @Post('upload-image')
  async uploadModuleImage(@Body() body: UploadImageDto) {
    return this.locksService.saveUploadedImage(body.imageBase64, body.fileName);
  }

  @Patch(':key')
  async updateModuleLock(
    @Param('key') key: string,
    @Body() body: UpdateLockDto,
  ) {
    return this.locksService.updateModuleLock(key, body);
  }

  @Delete(':key')
  async deleteModuleLock(@Param('key') key: string) {
    return this.locksService.deleteModuleLock(key);
  }
}
