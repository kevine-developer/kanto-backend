import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { renderDeeplinkGatewayPage } from './views/deeplink-gateway.view.js';

/**
 * DeeplinkController — Gestion des passerelles universelles pour les partages Kanto.
 *
 * Intercepte les accès aux routes web des partages (QR code ou liens externes) :
 * - /rank
 * - /classement
 * - /multiplayer & /duel
 * - /profile/:username
 * - /deck/:id & /deck
 * - /join
 *
 * Si l'utilisateur possède l'application, tente de l'ouvrir directement.
 * Si l'application n'est pas installée, redirige vers l'interface de testeur bêta.
 */
@Controller()
export class DeeplinkController {
  @Get('rank')
  handleRank(
    @Query('level') level: string | undefined,
    @Query('user') user: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: 'rank',
        fullQueryString: qs,
        title: `Kanto • Niveau ${level || ''} (${user || 'Mpilalao'})`,
        description: `Découvrez la progression de ${user || 'ce membre'} sur Kanto Malagasy.`,
      }),
    );
  }

  @Get('classement')
  handleLeaderboard(
    @Query('scope') scope: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: 'classement',
        fullQueryString: qs,
        title: "Kanto • Classement d'honneur",
        description:
          'Consultez les meilleurs explorateurs de la culture malgache sur Kanto.',
      }),
    );
  }

  @Get(['multiplayer', 'duel'])
  handleMultiplayer(
    @Query('code') code: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: 'multiplayer',
        fullQueryString: qs,
        title: `Kanto • Défi Quiz Multijoueur ${code ? `(${code})` : ''}`,
        description:
          'Rejoignez la partie en direct et testez vos connaissances sur Madagascar.',
      }),
    );
  }

  @Get('profile/:username')
  handleProfile(
    @Param('username') username: string,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `profile/${username}`,
        fullQueryString: qs,
        title: `Kanto • Profil de ${username}`,
        description: `Découvrez les contributions et le rang culturel de ${username} sur Kanto.`,
      }),
    );
  }

  @Get(['deck', 'deck/:id'])
  handleDeck(
    @Param('id') id: string | undefined,
    @Query('id') queryId: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const deckId = id || queryId || '';
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: deckId ? `deck/${deckId}` : 'deck',
        fullQueryString: qs,
        title: 'Kanto • Paquet de Quiz Culturel',
        description:
          'Découvrez et jouez à ce deck de questions communautaires sur Kanto.',
      }),
    );
  }

  @Get(['u/:id', 'user/:id'])
  handleUserProfile(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `user/${id}`,
        fullQueryString: qs,
        title: 'Kanto • Profil membre',
        description:
          'Découvrez les contributions et le rang culturel de ce membre sur Kanto.',
      }),
    );
  }

  @Get(['c/:id', 'contribution/:id'])
  handleContribution(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `contribution/${id}`,
        fullQueryString: qs,
        title: 'Kanto • Fandraisana anjara (Contribution)',
        description:
          'Découvrez cette contribution partagée au sein de la communauté Kanto.',
      }),
    );
  }

  @Get(['p/:id', 'proverbe/:id', 'ohabolana/:id'])
  handleProverb(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `p/${id}`,
        fullQueryString: qs,
        title: 'Kanto • Ohabolana Malagasy (Proverbe)',
        description: 'Découvrez ce trésor de la sagesse malgache sur Kanto.',
      }),
    );
  }

  @Get(['citation/:id', 'olon-kendry/:id'])
  handleCitation(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `citation/${id}`,
        fullQueryString: qs,
        title: "Kanto • Tenin'olon-kendry (Citation)",
        description: 'Découvrez cette pensée inspirante sur Kanto Malagasy.',
      }),
    );
  }

  @Get('ugc/:id')
  handleUgc(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `ugc/${id}`,
        fullQueryString: qs,
        title: 'Kanto • Paquet de Quiz Communautaire',
        description: 'Relevez le défi de ce quiz créé par la communauté Kanto.',
      }),
    );
  }

  @Get(['conte/:id', 'angano/:id'])
  handleConte(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `conte/${id}`,
        fullQueryString: qs,
        title: 'Kanto • Angano sy Tantara (Conte)',
        description:
          'Découvrez ce conte et récit traditionnel du patrimoine malgache sur Kanto.',
      }),
    );
  }

  @Get(['kabary/:id', 'discours/:id'])
  handleKabary(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `kabary/${id}`,
        fullQueryString: qs,
        title: 'Kanto • Kabary Malagasy (Art Oratoire)',
        description:
          'Explorez ce discours traditionnel et les secrets du kabary malgache sur Kanto.',
      }),
    );
  }

  @Get(['poesie/:id', 'tononkalo/:id'])
  handlePoesie(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `poesie/${id}`,
        fullQueryString: qs,
        title: 'Kanto • Tononkalo (Poésie Malgache)',
        description:
          'Laissez-vous émouvoir par les vers et la poésie de la littérature malgache sur Kanto.',
      }),
    );
  }

  @Get(['recitation/:id', 'tsianjery/:id'])
  handleRecitation(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `recitation/${id}`,
        fullQueryString: qs,
        title: 'Kanto • Tsianjery (Récitation & Mémoire)',
        description:
          'Apprenez et déclamez ce texte du patrimoine éducatif malgache sur Kanto.',
      }),
    );
  }

  @Get(['civic/droit/:id', 'civique/droit/:id'])
  handleCivicDroit(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `civic/droit/${id}`,
        fullQueryString: qs,
        title: 'Kanto • Zo sy Adidy (Droits & Devoirs)',
        description:
          'Comprenez vos droits fondamentaux et devoirs de citoyen sur Kanto.',
      }),
    );
  }

  @Get(['civic/institution/:id', 'civique/institution/:id'])
  handleCivicInstitution(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: `civic/institution/${id}`,
        fullQueryString: qs,
        title: 'Kanto • Andrim-panjakana (Institutions)',
        description:
          'Découvrez le rôle et les missions des institutions malgaches sur Kanto.',
      }),
    );
  }

  @Get('download')
  handleDownload(@Req() req: Request, @Res() res: Response): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: '',
        fullQueryString: qs,
        title: "Kanto Malagasy • Télécharger l'application",
        description:
          'Installez Kanto sur votre smartphone pour explorer la culture et la sagesse malgache.',
      }),
    );
  }

  @Get('join')
  handleJoin(
    @Query('code') code: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderDeeplinkGatewayPage({
        path: code
          ? `multiplayer?code=${encodeURIComponent(code)}`
          : 'multiplayer',
        fullQueryString: qs,
        title: `Kanto • Rejoindre la partie ${code || ''}`,
        description: 'Entrez dans le salon de jeu multijoueur Kanto.',
      }),
    );
  }
}
