import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FriendsService } from './friends.service.js';
import { AuthGuard, Session, type UserSession } from '../auth/index.js';

@Controller('friends')
@UseGuards(AuthGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  /**
   * Liste des amis confirmés de l'utilisateur connecté avec statut d'encouragement journalier.
   */
  @Get()
  getFriends(@Session() session: UserSession) {
    return this.friendsService.getFriends(session.user.id);
  }

  /**
   * Demandes d'amis en attente (reçues et envoyées).
   */
  @Get('requests')
  getRequests(@Session() session: UserSession) {
    return this.friendsService.getRequests(session.user.id);
  }

  /**
   * Recherche des utilisateurs par nom ou email avec statut d'amitié associé.
   */
  @Get('search')
  searchUsers(
    @Query('q') q: string,
    @Query('limit') limit: string,
    @Session() session: UserSession,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 20;
    return this.friendsService.searchUsers(session.user.id, q || '', parsedLimit);
  }

  /**
   * Récupère le statut d'amitié entre l'utilisateur connecté et un utilisateur cible.
   */
  @Get(':targetUserId/status')
  getFriendshipStatus(
    @Param('targetUserId') targetUserId: string,
    @Session() session: UserSession,
  ) {
    return this.friendsService.getFriendshipStatus(session.user.id, targetUserId);
  }

  /**
   * Vérifie si l'utilisateur connecté peut encourager un utilisateur aujourd'hui.
   */
  @Get(':targetUserId/can-encourage')
  canEncourage(
    @Param('targetUserId') targetUserId: string,
    @Session() session: UserSession,
  ) {
    return this.friendsService.canEncourage(session.user.id, targetUserId);
  }

  /**
   * Envoie une demande d'ami.
   */
  @Post('request/:targetUserId')
  sendFriendRequest(
    @Param('targetUserId') targetUserId: string,
    @Session() session: UserSession,
  ) {
    return this.friendsService.sendFriendRequest(session.user.id, targetUserId);
  }

  /**
   * Accepte une demande d'ami reçue.
   */
  @Post('accept/:requestId')
  acceptFriendRequest(
    @Param('requestId') requestId: string,
    @Session() session: UserSession,
  ) {
    return this.friendsService.acceptFriendRequest(session.user.id, requestId);
  }

  /**
   * Refuse une demande d'ami reçue.
   */
  @Post('reject/:requestId')
  rejectFriendRequest(
    @Param('requestId') requestId: string,
    @Session() session: UserSession,
  ) {
    return this.friendsService.rejectFriendRequest(session.user.id, requestId);
  }

  /**
   * Annule une demande d'ami envoyée.
   */
  @Delete('cancel/:targetUserId')
  cancelFriendRequest(
    @Param('targetUserId') targetUserId: string,
    @Session() session: UserSession,
  ) {
    return this.friendsService.cancelFriendRequest(session.user.id, targetUserId);
  }

  /**
   * Supprime un ami de sa liste d'amis.
   */
  @Delete(':friendUserId')
  removeFriend(
    @Param('friendUserId') friendUserId: string,
    @Session() session: UserSession,
  ) {
    return this.friendsService.removeFriend(session.user.id, friendUserId);
  }

  /**
   * Envoie un encouragement (+1 XP pour l'encourageur et +1 XP pour l'encouragé, max 1 par jour).
   */
  @Post(':targetUserId/encourage')
  encourageUser(
    @Param('targetUserId') targetUserId: string,
    @Session() session: UserSession,
  ) {
    return this.friendsService.encourageUser(session.user.id, targetUserId);
  }
}
