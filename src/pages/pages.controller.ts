import { Controller, Get, Header, Query } from '@nestjs/common';
import { renderPrivacyPage } from './views/privacy.view.js';
import { renderTermsPage } from './views/terms.view.js';
import { renderHelpPage } from './views/help.view.js';
import { renderAboutPage } from './views/about.view.js';
import { renderLicensesPage } from './views/licenses.view.js';

/**
 * Contrôleur des pages web statiques accessibles via navigateur ou WebView mobile.
 * Toutes les routes sont préfixées par /pages.
 *
 * Paramètres query optionnels :
 *   embed=true / inApp=true — Masque l'en-tête HTML lorsque la page est affichée
 *                              dans la WebView de l'application mobile (évite tout double header).
 *
 * Routes disponibles :
 *   GET /pages/privacy   — Politique de confidentialité
 *   GET /pages/terms     — Conditions générales d'utilisation
 *   GET /pages/help      — Centre d'aide et FAQ
 *   GET /pages/about     — À propos de Kanto
 *   GET /pages/licenses  — Licences open source
 */
@Controller('pages')
export class PagesController {
  private isEmbed(embed?: string, inApp?: string): boolean {
    return (
      embed === 'true' || embed === '1' || inApp === 'true' || inApp === '1'
    );
  }

  @Get('privacy')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=3600')
  getPrivacy(
    @Query('embed') embed?: string,
    @Query('inApp') inApp?: string,
  ): string {
    return renderPrivacyPage({ hideHeader: this.isEmbed(embed, inApp) });
  }

  @Get('terms')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=3600')
  getTerms(
    @Query('embed') embed?: string,
    @Query('inApp') inApp?: string,
  ): string {
    return renderTermsPage({ hideHeader: this.isEmbed(embed, inApp) });
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
