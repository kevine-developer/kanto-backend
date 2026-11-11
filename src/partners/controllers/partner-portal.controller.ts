import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthGuard, Session, type UserSession } from '../../auth/index.js';
import { PartnersService } from '../services/partners.service.js';
import { PartnerApiKeysService } from '../services/partner-api-keys.service.js';
import {
  RegisterPartnerDto,
  UpdatePartnerProfileDto,
} from '../dto/partner.dto.js';
import { CreateApiKeyDto } from '../dto/partner-api-key.dto.js';

@ApiTags('Partners Portal')
@Controller('partners/portal')
@UseGuards(AuthGuard)
export class PartnerPortalController {
  constructor(
    private readonly partnersService: PartnersService,
    private readonly apiKeysService: PartnerApiKeysService,
  ) {}

  private getUserId(session?: UserSession, req?: Request): string {
    const userId =
      session?.user?.id ||
      (req as any)?.user?.id ||
      (req as any)?.session?.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Utilisateur non authentifié.');
    }
    return userId;
  }

  @Post('register')
  @ApiOperation({ summary: 'Enregistrer une nouvelle organisation partenaire' })
  @ApiResponse({
    status: 201,
    description: 'Organisation partenaire créée avec succès.',
  })
  async register(
    @Body() dto: RegisterPartnerDto,
    @Session() session?: UserSession,
    @Req() req?: Request,
  ) {
    const userId = this.getUserId(session, req);
    return this.partnersService.registerPartner(dto, userId);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Consulter le profil de l’organisation partenaire connectée',
  })
  async getMyProfile(@Session() session?: UserSession, @Req() req?: Request) {
    const userId = this.getUserId(session, req);
    const partner = await this.partnersService.getPartnerByUserId(userId);
    if (!partner) {
      throw new NotFoundException(
        'Aucune organisation partenaire associée à ce compte.',
      );
    }
    return partner;
  }

  @Patch('me')
  @ApiOperation({ summary: 'Mettre à jour le profil de son organisation' })
  async updateMyProfile(
    @Body() dto: UpdatePartnerProfileDto,
    @Session() session?: UserSession,
    @Req() req?: Request,
  ) {
    const userId = this.getUserId(session, req);
    const partner = await this.partnersService.getPartnerByUserId(userId);
    if (!partner) {
      throw new NotFoundException('Organisation partenaire introuvable.');
    }
    return this.partnersService.updatePartnerProfile(partner.id, dto);
  }

  @Get('dashboard')
  @ApiOperation({
    summary: 'Statistiques consolidées du tableau de bord organisateur',
  })
  async getDashboard(@Session() session?: UserSession, @Req() req?: Request) {
    const userId = this.getUserId(session, req);
    const partner = await this.partnersService.getPartnerByUserId(userId);
    if (!partner) {
      throw new NotFoundException('Organisation partenaire introuvable.');
    }
    return this.partnersService.getPartnerDashboardStats(partner.id);
  }

  @Get('api-keys')
  @ApiOperation({ summary: 'Lister les clés API du partenaire' })
  async listApiKeys(@Session() session?: UserSession, @Req() req?: Request) {
    const userId = this.getUserId(session, req);
    const partner = await this.partnersService.getPartnerByUserId(userId);
    if (!partner) {
      throw new NotFoundException('Organisation partenaire introuvable.');
    }
    return this.apiKeysService.getPartnerApiKeys(partner.id);
  }

  @Post('api-keys')
  @ApiOperation({ summary: 'Générer une nouvelle clé API développeur' })
  @ApiResponse({
    status: 201,
    description:
      'Clé API générée. Attention : la clé complète en clair n’est affichée qu’une seule fois !',
  })
  async createApiKey(
    @Body() dto: CreateApiKeyDto,
    @Session() session?: UserSession,
    @Req() req?: Request,
  ) {
    const userId = this.getUserId(session, req);
    const partner = await this.partnersService.getPartnerByUserId(userId);
    if (!partner) {
      throw new NotFoundException('Organisation partenaire introuvable.');
    }
    return this.apiKeysService.createApiKey(partner.id, dto);
  }

  @Delete('api-keys/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Révoquer immédiatement une clé API' })
  async revokeApiKey(
    @Param('id') keyId: string,
    @Session() session?: UserSession,
    @Req() req?: Request,
  ) {
    const userId = this.getUserId(session, req);
    const partner = await this.partnersService.getPartnerByUserId(userId);
    if (!partner) {
      throw new NotFoundException('Organisation partenaire introuvable.');
    }
    return this.apiKeysService.revokeApiKey(partner.id, keyId);
  }

  @Get('api-logs')
  @ApiOperation({ summary: 'Consulter les derniers logs d’appels API' })
  async getApiLogs(
    @Query('limit') limitStr?: string,
    @Session() session?: UserSession,
    @Req() req?: Request,
  ) {
    const userId = this.getUserId(session, req);
    const partner = await this.partnersService.getPartnerByUserId(userId);
    if (!partner) {
      throw new NotFoundException('Organisation partenaire introuvable.');
    }
    const limit = limitStr ? parseInt(limitStr, 10) : 50;
    return this.apiKeysService.getPartnerApiLogs(partner.id, limit);
  }
}
