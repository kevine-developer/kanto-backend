import { Controller, Get, Header, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { pageShell } from './page.helpers.js';
import { renderPrivacyPage } from './views/privacy.view.js';
import { renderTermsPage } from './views/terms.view.js';
import { renderHelpPage } from './views/help.view.js';
import { renderAboutPage } from './views/about.view.js';
import { renderLicensesPage } from './views/licenses.view.js';

/**
 * Contrôleur des pages web statiques et dynamiques accessibles via navigateur ou WebView mobile.
 * Toutes les routes sont préfixées par /pages.
 */
@Controller('pages')
export class PagesController {
  constructor(private readonly prisma: PrismaService) {}

  private isEmbed(embed?: string, inApp?: string): boolean {
    return (
      embed === 'true' || embed === '1' || inApp === 'true' || inApp === '1'
    );
  }

  @Get('privacy')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=300')
  async getPrivacy(
    @Query('embed') embed?: string,
    @Query('inApp') inApp?: string,
  ): Promise<string> {
    const hideHeader = this.isEmbed(embed, inApp);
    try {
      const doc = await this.prisma.legalDocument.findUnique({
        where: { slug: 'privacy' },
      });
      if (doc) {
        return pageShell({
          title: `Kanto — ${doc.title}`,
          pageTitle: doc.title,
          hideHeader,
          description: doc.summary || 'Politique de confidentialité Kanto',
          body: doc.contentHtml,
        });
      }
    } catch {
      // Fallback sur le template statique en cas d'indisponibilité
    }
    return renderPrivacyPage({ hideHeader });
  }

  @Get('terms')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=300')
  async getTerms(
    @Query('embed') embed?: string,
    @Query('inApp') inApp?: string,
  ): Promise<string> {
    const hideHeader = this.isEmbed(embed, inApp);
    try {
      const doc = await this.prisma.legalDocument.findUnique({
        where: { slug: 'terms' },
      });
      if (doc) {
        return pageShell({
          title: `Kanto — ${doc.title}`,
          pageTitle: doc.title,
          hideHeader,
          description:
            doc.summary || "Conditions générales d'utilisation Kanto",
          body: doc.contentHtml,
        });
      }
    } catch {
      // Fallback sur le template statique en cas d'indisponibilité
    }
    return renderTermsPage({ hideHeader });
  }

  @Get('help')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=1800')
  getHelp(
    @Query('embed') embed?: string,
    @Query('inApp') inApp?: string,
  ): string {
    return renderHelpPage({ hideHeader: this.isEmbed(embed, inApp) });
  }

  @Get('about')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=3600')
  getAbout(
    @Query('embed') embed?: string,
    @Query('inApp') inApp?: string,
  ): string {
    return renderAboutPage({ hideHeader: this.isEmbed(embed, inApp) });
  }

  @Get('licenses')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=86400')
  getLicenses(
    @Query('embed') embed?: string,
    @Query('inApp') inApp?: string,
  ): string {
    return renderLicensesPage({ hideHeader: this.isEmbed(embed, inApp) });
  }
}
