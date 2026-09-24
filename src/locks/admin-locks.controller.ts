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
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { LocksService } from './locks.service.js';
import { AuthGuard, Roles } from '../auth/index.js';
import { Throttle } from '@nestjs/throttler';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsIn(['GAME', 'CATEGORY', 'FEATURE'])
  type: 'GAME' | 'CATEGORY' | 'FEATURE';

  @IsString()
  @IsNotEmpty()
  nameFr: string;

  @IsString()
  @IsNotEmpty()
  nameMg: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  bgImageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isLocked?: boolean;

  @IsString()
  @IsOptional()
  lockReason?: string;

  @IsString()
  @IsOptional()
  minTier?: string;
}

export class UpdateLockDto {
  @IsString()
  @IsOptional()
  nameFr?: string;

  @IsString()
  @IsOptional()
  nameMg?: string;

  @IsIn(['GAME', 'CATEGORY', 'FEATURE'])
  @IsOptional()
  type?: 'GAME' | 'CATEGORY' | 'FEATURE';

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  bgImageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isLocked?: boolean;

  @IsString()
  @IsOptional()
  lockReason?: string;

  @IsString()
  @IsOptional()
  minTier?: string;
}

export class UploadImageDto {
  @IsString()
  @IsNotEmpty()
  imageBase64: string;

  @IsString()
  @IsOptional()
  fileName?: string;

  @IsString()
  @IsOptional()
  subfolder?: string;
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
  @Throttle({ upload: { limit: 15, ttl: 60000 } })
  async uploadModuleImage(@Body() body: UploadImageDto) {
    return this.locksService.saveUploadedImage(
      body.imageBase64,
      body.fileName,
      body.subfolder || 'modules',
    );
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
