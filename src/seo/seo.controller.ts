import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { SeoService } from './seo.service.js';
import { renderCategoryHubPage } from './views/category-hub.view.js';

@Controller()
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  /**
   * Robots.txt intelligent : autorise app-kanto.gastsar.fr, protège les routes API internes
   */
  @Get('robots.txt')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=86400')
  getRobotsTxt(@Req() req: Request): string {
    const host = (
      (req?.headers?.['x-forwarded-host'] as string) ||
      req?.headers?.host ||
      ''
    ).toLowerCase();

    return this.seoService.getRobotsTxt(host);
  }

  /**
   * Sitemap.xml dynamique conforme au standard sitemaps.org
   */
  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=3600')
  async getSitemapXml(): Promise<string> {
    return this.seoService.getSitemapXml();
  }

  /**
   * Standard GEO llms.txt pour les moteurs et agents IA
   */
  @Get('llms.txt')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=86400')
  getLlmsTxt(): string {
    return this.seoService.getLlmsTxt();
  }

  // ─── HUBS ÉDITORIAUX & CULTURELS ──────────────────────────────────────────

  @Get('ohabolana')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=1800')
  async getOhabolanaHub(): Promise<string> {
    const data = await this.seoService.getHubData('ohabolana');
    if (!data) throw new NotFoundException('Rubrique introuvable');
    return renderCategoryHubPage(data);
  }

  @Get('angano')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=1800')
  async getAnganoHub(): Promise<string> {
    const data = await this.seoService.getHubData('angano');
    if (!data) throw new NotFoundException('Rubrique introuvable');
    return renderCategoryHubPage(data);
  }

  @Get('kabary')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=1800')
  async getKabaryHub(): Promise<string> {
    const data = await this.seoService.getHubData('kabary');
    if (!data) throw new NotFoundException('Rubrique introuvable');
    return renderCategoryHubPage(data);
  }

  @Get('tononkalo')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=1800')
  async getTononkaloHub(): Promise<string> {
    const data = await this.seoService.getHubData('tononkalo');
    if (!data) throw new NotFoundException('Rubrique introuvable');
    return renderCategoryHubPage(data);
  }

  @Get('raki-teny')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=1800')
  async getRakiTenyHub(): Promise<string> {
    const data = await this.seoService.getHubData('raki-teny');
    if (!data) throw new NotFoundException('Rubrique introuvable');
    return renderCategoryHubPage(data);
  }

  @Get('histoire')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=1800')
  async getHistoireHub(): Promise<string> {
    const data = await this.seoService.getHubData('histoire');
    if (!data) throw new NotFoundException('Rubrique introuvable');
    return renderCategoryHubPage(data);
  }
}
