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
        description: 'Consultez les meilleurs explorateurs de la culture malgache sur Kanto.',
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
        description: 'Rejoignez la partie en direct et testez vos connaissances sur Madagascar.',
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
        description: 'Découvrez et jouez à ce deck de questions communautaires sur Kanto.',
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
        path: code ? `multiplayer?code=${encodeURIComponent(code)}` : 'multiplayer',
        fullQueryString: qs,
        title: `Kanto • Rejoindre la partie ${code || ''}`,
        description: 'Entrez dans le salon de jeu multijoueur Kanto.',
      }),
    );
  }
}
