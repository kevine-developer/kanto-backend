import { Injectable, Logger } from '@nestjs/common';

export interface UserSubscriptionContext {
  id?: string;
  role?: string;
  tier?: string;
  tierExpiresAt?: Date | string | null;
}

/**
 * Service centralisé Kanto MG — Content Access Control (CAC)
 * Applique le principe de souveraineté du serveur sur la distribution des contenus.
 * Ne fait jamais confiance aux paramètres clients pour l'accès aux contenus VIP/Premium.
 */
@Injectable()
export class ContentAccessControlService {
  private readonly logger = new Logger(ContentAccessControlService.name);

  /**
   * Vérifie si un utilisateur dispose d'un abonnement VIP ou PREMIUM valide.
   */
  public isVip(user?: UserSubscriptionContext | null): boolean {
    if (!user) return false;

    // Les administrateurs disposent d'un accès de supervision complet
    const roleUpper = user.role?.toUpperCase();
    if (roleUpper === 'ADMIN' || roleUpper === 'SUPER_ADMIN') {
      return true;
    }

    const tierUpper = user.tier?.toUpperCase();
    if (tierUpper !== 'VIP' && tierUpper !== 'PREMIUM') {
      return false;
    }

    // Si une date d'expiration est configurée, vérifier qu'elle n'est pas échue
    if (user.tierExpiresAt) {
      const expiresAt = new Date(user.tierExpiresAt);
      if (expiresAt.getTime() <= Date.now()) {
        return false;
      }
    }

    return true;
  }

  /**
   * Filtre et protège un conte traditionnel (Angano) côté serveur.
   */
  public filterConte<T extends Record<string, any>>(
    conte: T | null | undefined,
    user?: UserSubscriptionContext | null,
  ): T | null {
    if (!conte) return null;

    const hasAccess = !conte.isPremium || this.isVip(user);

    if (hasAccess) {
      return {
        ...conte,
        isLocked: false,
        previewOnly: false,
      };
    }

    // Utilisateur sans droit VIP accédant à un conte Premium :
    // Masquage absolu des pistes audio et restriction aux 2 premiers paragraphes d'accroche
    const paragraphs = Array.isArray(conte.paragraphs)
      ? conte.paragraphs.slice(0, 2)
      : [];

    return {
      ...conte,
      audioUrlMg: null,
      audioUrlFr: null,
      paragraphs,
      isLocked: true,
      previewOnly: true,
      paywallMessage:
        'Ce conte traditionnel malgache complet et ses pistes audio contées sont réservés aux membres Kanto VIP.',
      paywallMessageMg:
        "Ity angano malagasy feno ity sy ny feo mirakitra azy dia natokana ho an'ireo mpikambana Kanto VIP.",
    };
  }

  /**
   * Filtre une collection de contes traditionnels.
   */
  public filterContes<T extends Record<string, any>>(
    contes: T[],
    user?: UserSubscriptionContext | null,
  ): T[] {
    if (!Array.isArray(contes)) return [];
    return contes.map((c) => this.filterConte(c, user) as T);
  }

  /**
   * Filtre et protège un proverbe, dicton ou expression (MalagasyItem).
   */
  public filterMalagasyItem<T extends Record<string, any>>(
    item: T | null | undefined,
    user?: UserSubscriptionContext | null,
  ): T | null {
    if (!item) return null;

    const hasAccess = !item.isPremium || this.isVip(user);

    if (hasAccess) {
      return {
        ...item,
        isLocked: false,
        previewOnly: false,
      };
    }

    return {
      ...item,
      audioUrl: null, // Masque la prononciation audio haute fidélité
      example: null,  // Masque l'exemple d'usage contextuel avancé
      isLocked: true,
      previewOnly: true,
      paywallMessage:
        'L’explication approfondie et la prononciation audio sont réservées aux membres Kanto VIP.',
      paywallMessageMg:
        "Ny fanazavana lalina sy ny feo fanononana dia natokana ho an'ireo mpikambana Kanto VIP.",
    };
  }

  /**
   * Filtre une collection de proverbes.
   */
  public filterMalagasyItems<T extends Record<string, any>>(
    items: T[],
    user?: UserSubscriptionContext | null,
  ): T[] {
    if (!Array.isArray(items)) return [];
    return items.map((it) => this.filterMalagasyItem(it, user) as T);
  }

  /**
   * Filtre et protège une poésie ou hainteny (Tononkalo).
   */
  public filterPoesie<T extends Record<string, any>>(
    poesie: T | null | undefined,
    user?: UserSubscriptionContext | null,
  ): T | null {
    if (!poesie) return null;

    const hasAccess = !poesie.isPremium || this.isVip(user);

    if (hasAccess) {
      return {
        ...poesie,
        isLocked: false,
        previewOnly: false,
      };
    }

    // Troncature du poème pour les non-VIP
    const truncatedContent =
      typeof poesie.content === 'string'
        ? poesie.content.slice(0, 180).trim() + '\n\n[... Poème complet réservé aux membres VIP ...]'
        : poesie.content;

    const truncatedStanzas = Array.isArray(poesie.stanzas)
      ? poesie.stanzas.slice(0, 1)
      : poesie.stanzas;

    return {
      ...poesie,
      audioUrl: null,
      content: truncatedContent,
      stanzas: truncatedStanzas,
      isLocked: true,
      previewOnly: true,
      paywallMessage: 'L’intégralité de ce poème et son enregistrement audio sont réservés aux membres Kanto VIP.',
    };
  }

  /**
   * Filtre une collection de poésies (Tononkalo).
   */
  public filterPoesies<T extends Record<string, any>>(
    poesies: T[],
    user?: UserSubscriptionContext | null,
  ): T[] {
    if (!Array.isArray(poesies)) return [];
    return poesies.map((p) => this.filterPoesie(p, user) as T);
  }

  /**
   * Filtre et protège une récitation (Tsianjery).
   */
  public filterRecitation<T extends Record<string, any>>(
    recitation: T | null | undefined,
    user?: UserSubscriptionContext | null,
  ): T | null {
    if (!recitation) return null;

    const hasAccess = !recitation.isPremium || this.isVip(user);

    if (hasAccess) {
      return {
        ...recitation,
        isLocked: false,
        previewOnly: false,
      };
    }

    const truncatedContent =
      typeof recitation.content === 'string'
        ? recitation.content.slice(0, 180).trim() + '\n\n[... Récitation complète réservée aux membres VIP ...]'
        : recitation.content;

    const truncatedLines = Array.isArray(recitation.contentLines)
      ? recitation.contentLines.slice(0, 2)
      : recitation.contentLines;

    return {
      ...recitation,
      audioUrl: null,
      content: truncatedContent,
      contentLines: truncatedLines,
      isLocked: true,
      previewOnly: true,
      paywallMessage: 'Ce tsianjery d’apprentissage et sa piste de répétition audio sont réservés aux membres Kanto VIP.',
    };
  }

  /**
   * Filtre une collection de récitations (Tsianjery).
   */
  public filterRecitations<T extends Record<string, any>>(
    recitations: T[],
    user?: UserSubscriptionContext | null,
  ): T[] {
    if (!Array.isArray(recitations)) return [];
    return recitations.map((r) => this.filterRecitation(r, user) as T);
  }

  /**
   * Filtre et protège un discours traditionnel (Kabary).
   */
  public filterKabary<T extends Record<string, any>>(
    kabary: T | null | undefined,
    user?: UserSubscriptionContext | null,
  ): T | null {
    if (!kabary) return null;

    const hasAccess = !kabary.isPremium || this.isVip(user);

    if (hasAccess) {
      return {
        ...kabary,
        isLocked: false,
        previewOnly: false,
      };
    }

    const truncatedSteps = Array.isArray(kabary.steps)
      ? kabary.steps.slice(0, 1)
      : kabary.steps;

    return {
      ...kabary,
      steps: truncatedSteps,
      etiquetteNotesMg: null,
      etiquetteNotesFr: null,
      concludingProverbMg: null,
      concludingProverbFr: null,
      isLocked: true,
      previewOnly: true,
      paywallMessage: 'Ce kabary rituel complet et ses étapes protocolaires sont réservés aux membres Kanto VIP.',
      paywallMessageMg: "Ity kabary feno ity sy ny dingana ara-pombafomba rehetra dia natokana ho an'ireo mpikambana Kanto VIP.",
    };
  }

  /**
   * Filtre une collection de discours traditionnels (Kabary).
   */
  public filterKabaries<T extends Record<string, any>>(
    kabaries: T[],
    user?: UserSubscriptionContext | null,
  ): T[] {
    if (!Array.isArray(kabaries)) return [];
    return kabaries.map((k) => this.filterKabary(k, user) as T);
  }
}
