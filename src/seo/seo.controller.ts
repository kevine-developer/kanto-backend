import { Controller, Get, Header, Req } from '@nestjs/common';
import type { Request } from 'express';
import { SeoService } from './seo.service.js';

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
}
