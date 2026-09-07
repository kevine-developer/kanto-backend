import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateContributionDto } from './dto/create-contribution.dto.js';
import { CreateKabaryContributionDto } from './dto/create-kabary-contribution.dto.js';
import { CreateProverbeContributionDto } from './dto/create-proverbe-contribution.dto.js';
import { CreateCitationContributionDto } from './dto/create-citation-contribution.dto.js';
import { CreateConteContributionDto } from './dto/create-conte-contribution.dto.js';
import { UpdateContributionDto } from './dto/update-contribution.dto.js';
import { CreateContributionCommentDto } from './dto/create-contribution-comment.dto.js';

// ─────────────────────────────────────────────────────────────────────────────
// Sélecteurs réutilisables
// ─────────────────────────────────────────────────────────────────────────────
const CONTRIBUTION_BASE_SELECT = {
  id: true,
  category: true,
  status: true,
  score: true,
  viewCount: true,
  region: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  user: { select: { id: true, name: true, image: true } },
  _count: { select: { comments: true } },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Utilitaires internes
// ─────────────────────────────────────────────────────────────────────────────
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

// ─────────────────────────────────────────────────────────────────────────────
@Injectable()
export class ContributionsService {
  constructor(private readonly prisma: PrismaService) {}

  // ───────────────────────────────────────────────────────────────────────────
  // Génération de slug unique pour une table donnée
  // ───────────────────────────────────────────────────────────────────────────
  private async ensureUniqueSlug(
    baseSlug: string,
    checkFn: (slug: string) => Promise<boolean>,
  ): Promise<string> {
    let slug = baseSlug;
    const exists = await checkFn(slug);
    if (exists) {
      slug = `${slug}-${Date.now().toString().slice(-6)}`;
    }
    return slug;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // CRÉATION GÉNÉRIQUE (rétro-compatibilité)
  // ───────────────────────────────────────────────────────────────────────────
  async create(userId: string, dto: CreateContributionDto) {
    const contribution = await this.prisma.contribution.create({
      data: {
        userId,
        category: dto.category,
        textMg: dto.textMg,
        textFr: dto.textFr,
        meaning: dto.meaning,
        region: dto.region,
        status: 'DRAFT',
      },
    });
    return { success: true, contribution };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // POST /contributions/kabary
  // ───────────────────────────────────────────────────────────────────────────
  async createKabaryContribution(
    userId: string,
    dto: CreateKabaryContributionDto,
  ) {
    const payload = JSON.stringify(dto);

    const contribution = await this.prisma.contribution.create({
      data: {
        userId,
        category: 'KABARY',
        textMg: payload, // Sérialisé : contient title, steps[], occasion, etc.
        textFr: dto.titleFr ?? dto.title,
        meaning: dto.occasion,
        region: dto.region,
        status: 'DRAFT',
      },
      select: CONTRIBUTION_BASE_SELECT,
    });

    return { success: true, contribution };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // POST /contributions/proverbe
  // ───────────────────────────────────────────────────────────────────────────
  async createProverbeContribution(
    userId: string,
    dto: CreateProverbeContributionDto,
  ) {
    const contribution = await this.prisma.contribution.create({
      data: {
        userId,
        category: dto.category,
        textMg: dto.textMg,
        textFr: dto.textFr,
        meaning: dto.meaning,
        region: dto.region,
        status: 'DRAFT',
      },
      select: CONTRIBUTION_BASE_SELECT,
    });
    return { success: true, contribution };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // POST /contributions/citation
  // ───────────────────────────────────────────────────────────────────────────
  async createCitationContribution(
    userId: string,
    dto: CreateCitationContributionDto,
  ) {
    const contribution = await this.prisma.contribution.create({
      data: {
        userId,
        category: 'CITATION',
        textMg: dto.citationMg,
        textFr: dto.citationFr,
        meaning: dto.contexte ?? '',
        region: dto.sourceName,
        status: 'DRAFT',
      },
      select: CONTRIBUTION_BASE_SELECT,
    });
    return { success: true, contribution };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // POST /contributions/conte
  // ───────────────────────────────────────────────────────────────────────────
  async createConteContribution(
    userId: string,
    dto: CreateConteContributionDto,
  ) {
    const payload = JSON.stringify(dto);

    const contribution = await this.prisma.contribution.create({
      data: {
        userId,
        category: 'CONTE',
        textMg: payload, // Sérialisé : title, paragraphs[], moralMg, etc.
        textFr: dto.titleFr,
        meaning: dto.moralMg ?? '',
        region: dto.source,
        status: 'DRAFT',
      },
      select: CONTRIBUTION_BASE_SELECT,
    });
    return { success: true, contribution };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // GET /contributions/community
  // ───────────────────────────────────────────────────────────────────────────
  async findCommunity(category?: string, userId?: string) {
    const items = await this.prisma.contribution.findMany({
      where: {
        status: { in: ['PUBLISHED', 'DRAFT'] },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ...(category && { category: category as any }),
      },
      select: {
        ...CONTRIBUTION_BASE_SELECT,
        textMg: true,
        textFr: true,
        meaning: true,
        ...(userId
          ? { votes: { where: { userId }, select: { value: true } } }
          : {}),
      },
      orderBy: [{ score: 'desc' }, { createdAt: 'desc' }],
    });

    return items.map((item) => {
      const { votes, ...rest } = item as Record<string, unknown>;

      const userVote =
        (votes as Array<{ value: number }> | undefined)?.[0]?.value ?? 0;
      return { ...rest, userVote };
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // GET /contributions/:id
  // ───────────────────────────────────────────────────────────────────────────
  async findOne(id: string, userId?: string) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id },
      select: {
        ...CONTRIBUTION_BASE_SELECT,
        textMg: true,
        textFr: true,
        meaning: true,
        ...(userId
          ? { votes: { where: { userId }, select: { value: true } } }
          : {}),
      },
    });

    if (!contribution) throw new NotFoundException('Contribution introuvable');

    // Incrémenter les vues de façon asynchrone non-bloquante
    void this.prisma.contribution
      .update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => {});

    const { votes, ...rest } = contribution as Record<string, unknown>;

    const userVote =
      (votes as Array<{ value: number }> | undefined)?.[0]?.value ?? 0;
    return { ...rest, userVote };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // GET /contributions/me
  // ───────────────────────────────────────────────────────────────────────────
  async findMyContributions(userId: string) {
    return this.prisma.contribution.findMany({
      where: { userId },
      select: {
        ...CONTRIBUTION_BASE_SELECT,
        textMg: true,
        textFr: true,
        meaning: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // POST /contributions/:id/vote
  // ───────────────────────────────────────────────────────────────────────────
  async voteContribution(
    userId: string,
    contributionId: string,
    value: number,
  ) {
    if (![1, -1, 0].includes(value)) {
      throw new BadRequestException(
        'Vote invalide : valeur doit être 1, -1 ou 0',
      );
    }

    const contribution = await this.prisma.contribution.findUnique({
      where: { id: contributionId },
    });
    if (!contribution) throw new NotFoundException('Contribution introuvable');

    // ⛔ Interdire l'auto-vote
    if (contribution.userId === userId) {
      throw new ForbiddenException(
        'Vous ne pouvez pas voter pour votre propre contribution',
      );
    }

    return this.prisma.$transaction(async (prisma) => {
      const existingVote = await prisma.contributionVote.findUnique({
        where: { userId_contributionId: { userId, contributionId } },
      });

      let scoreDelta = 0;

      if (value === 0) {
        // Annuler le vote existant
        if (existingVote) {
          scoreDelta = -existingVote.value;
          await prisma.contributionVote.delete({
            where: { id: existingVote.id },
          });
        }
      } else if (existingVote) {
        // Modifier le vote existant
        scoreDelta = value - existingVote.value;
        await prisma.contributionVote.update({
          where: { id: existingVote.id },
          data: { value },
        });
      } else {
        // Nouveau vote
        scoreDelta = value;
        await prisma.contributionVote.create({
          data: { userId, contributionId, value },
        });
      }

      if (scoreDelta !== 0) {
        return prisma.contribution.update({
          where: { id: contributionId },
          data: { score: { increment: scoreDelta } },
          select: { id: true, score: true },
        });
      }

      return { id: contributionId, score: contribution.score };
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // GET /contributions/pending (Admin)
  // ───────────────────────────────────────────────────────────────────────────
  async findPending() {
    return this.prisma.contribution.findMany({
      where: { status: 'DRAFT' },
      select: {
        ...CONTRIBUTION_BASE_SELECT,
        textMg: true,
        textFr: true,
        meaning: true,
        user: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // PATCH /contributions/:id/validate (Admin)
  // ───────────────────────────────────────────────────────────────────────────
  async validate(id: string, approve: boolean) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id },
    });
    if (!contribution) throw new NotFoundException('Contribution introuvable');

    if (!approve) {
      const updated = await this.prisma.contribution.update({
        where: { id },
        data: { status: 'ARCHIVED' },
      });
      return { success: true, status: 'REJECTED', contribution: updated };
    }

    // ── Publication + insertion dans la table cible ──────────────────────────
    const updated = await this.prisma.$transaction(async (prisma) => {
      const validated = await prisma.contribution.update({
        where: { id },
        data: { status: 'PUBLISHED' },
      });

      const baseSlug = generateSlug(validated.textMg.slice(0, 80));

      if (
        validated.category === 'PROVERBE' ||
        validated.category === 'EXPRESSION' ||
        validated.category === 'DICTON'
      ) {
        const slug = await this.ensureUniqueSlug(baseSlug, async (s) => {
          const r = await prisma.malagasyItem.findUnique({
            where: { slug: s },
          });
          return !!r;
        });
        await prisma.malagasyItem.create({
          data: {
            slug,
            malagasy: validated.textMg,
            french: validated.textFr,
            meaning: validated.meaning,
            category: validated.category,
            status: 'PUBLISHED',
            origins: validated.region ? [validated.region] : [],
          },
        });
      } else if (validated.category === 'CITATION') {
        await prisma.citation.create({
          data: {
            citationMg: validated.textMg,
            citationFr: validated.textFr,
            sourceName: validated.region ?? 'Communauté',
            contexte: validated.meaning,
            status: 'PUBLISHED',
          },
        });
      } else if (validated.category === 'CONTE') {
        let parsedConte: CreateConteContributionDto | null = null;
        try {
          parsedConte = JSON.parse(
            validated.textMg,
          ) as CreateConteContributionDto;
        } catch {
          // textMg n'est pas un JSON valide — on utilise les champs bruts
        }

        const slug = await this.ensureUniqueSlug(
          generateSlug(parsedConte?.title ?? baseSlug),
          async (s) => {
            const r = await prisma.conte.findUnique({ where: { slug: s } });
            return !!r;
          },
        );

        const conte = await prisma.conte.create({
          data: {
            slug,
            title: parsedConte?.title ?? validated.textMg,
            titleFr: parsedConte?.titleFr ?? validated.textFr,
            moralMg: parsedConte?.moralMg ?? validated.meaning,
            moralFr: parsedConte?.moralFr,
            source: parsedConte?.source ?? validated.region ?? 'Communauté',
            status: 'PUBLISHED',
          },
        });

        if (parsedConte?.paragraphs?.length) {
          await prisma.conteParagraph.createMany({
            data: parsedConte.paragraphs.map((p) => ({
              conteId: conte.id,
              paragraphNumber: p.paragraphNumber,
              textMg: p.textMg,
              textFr: p.textFr,
            })),
          });
        }
      } else if (validated.category === 'KABARY') {
        let parsedKabary: CreateKabaryContributionDto | null = null;
        try {
          parsedKabary = JSON.parse(
            validated.textMg,
          ) as CreateKabaryContributionDto;
        } catch {
          // textMg n'est pas un JSON valide — on utilise les champs bruts
        }

        const slug = await this.ensureUniqueSlug(
          generateSlug(parsedKabary?.title ?? baseSlug),
          async (s) => {
            const r = await prisma.kabary.findUnique({ where: { slug: s } });
            return !!r;
          },
        );

        const kabary = await prisma.kabary.create({
          data: {
            slug,
            title: parsedKabary?.title ?? validated.textMg,
            titleFr: parsedKabary?.titleFr ?? validated.textFr,
            occasion: parsedKabary?.occasion ?? validated.meaning ?? 'Autre',
            occasionFr: parsedKabary?.occasionFr,
            speakerRoleMg: parsedKabary?.speakerRoleMg,
            speakerRoleFr: parsedKabary?.speakerRoleFr,
            recipientRoleMg: parsedKabary?.recipientRoleMg,
            recipientRoleFr: parsedKabary?.recipientRoleFr,
            region: parsedKabary?.region ?? validated.region,
            concludingProverbMg: parsedKabary?.concludingProverbMg,
            status: 'PUBLISHED',
          },
        });

        if (parsedKabary?.steps?.length) {
          await prisma.kabaryStep.createMany({
            data: parsedKabary.steps.map((s) => ({
              kabaryId: kabary.id,
              stepNumber: s.stepNumber,
              stepNameMg: s.stepNameMg,
              stepNameFr: s.stepNameFr,
              textMg: s.textMg,
              textFr: s.textFr,
              explanationFr: s.explanationFr,
            })),
          });
        }
      }

      // +50 XP au contributeur

      await prisma.userProgress.upsert({
        where: { userId: validated.userId },
        update: { totalXp: { increment: 50 } },
        create: { userId: validated.userId, totalXp: 50 },
      });

      return validated;
    });

    return { success: true, status: 'APPROVED', contribution: updated };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // PATCH /contributions/:id (Auteur dans les 48h / 2 jours ou Admin)
  // ───────────────────────────────────────────────────────────────────────────
  async update(
    id: string,
    userId: string,
    role: string,
    dto: UpdateContributionDto,
  ) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id },
    });
    if (!contribution) throw new NotFoundException('Contribution introuvable');

    const isAdmin = role === 'ADMIN' || role === 'admin';
    const isAuthor = contribution.userId === userId;

    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que vos propres contributions',
      );
    }

    if (!isAdmin) {
      const diffHours =
        (Date.now() - new Date(contribution.createdAt).getTime()) /
        (1000 * 60 * 60);
      if (diffHours > 48) {
        throw new BadRequestException(
          'Vous ne pouvez modifier une contribution que dans les 2 jours (48h) suivant sa création',
        );
      }
    }

    const updated = await this.prisma.contribution.update({
      where: { id },
      data: {
        ...(dto.category ? { category: dto.category } : {}),
        ...(dto.textMg !== undefined ? { textMg: dto.textMg } : {}),
        ...(dto.textFr !== undefined ? { textFr: dto.textFr } : {}),
        ...(dto.meaning !== undefined ? { meaning: dto.meaning } : {}),
        ...(dto.region !== undefined ? { region: dto.region } : {}),
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return { success: true, contribution: updated };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // DELETE /contributions/:id (Auteur dans les 24h / 1 jour ou Admin)
  // ───────────────────────────────────────────────────────────────────────────
  async remove(id: string, userId: string, role: string) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id },
    });
    if (!contribution) throw new NotFoundException('Contribution introuvable');

    const isAdmin = role === 'ADMIN' || role === 'admin';
    const isAuthor = contribution.userId === userId;

    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException(
        'Vous ne pouvez supprimer que vos propres contributions',
      );
    }

    if (!isAdmin) {
      const diffHours =
        (Date.now() - new Date(contribution.createdAt).getTime()) /
        (1000 * 60 * 60);
      if (diffHours > 24) {
        throw new BadRequestException(
          'Vous ne pouvez supprimer une contribution que dans les 24 heures suivant sa création',
        );
      }
    }

    await this.prisma.contribution.delete({
      where: { id },
    });

    return { success: true, message: 'Contribution supprimée avec succès' };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // COMMENTAIRES COMMUNAUTAIRES (Utilisateurs et Propriétaire)
  // ───────────────────────────────────────────────────────────────────────────

  /** GET /contributions/:id/comments — Liste des commentaires */
  async getComments(contributionId: string) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id: contributionId },
      select: { id: true, userId: true },
    });
    if (!contribution) throw new NotFoundException('Contribution introuvable');

    const comments = await this.prisma.contributionComment.findMany({
      where: { contributionId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
      },
    });

    return comments.map((c) => ({
      ...c,
      isOwner: c.userId === contribution.userId,
    }));
  }

  /** POST /contributions/:id/comments — Ajouter un commentaire */
  async addComment(
    userId: string,
    contributionId: string,
    dto: CreateContributionCommentDto,
  ) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id: contributionId },
      select: { id: true, userId: true },
    });
    if (!contribution) throw new NotFoundException('Contribution introuvable');

    const comment = await this.prisma.contributionComment.create({
      data: {
        userId,
        contributionId,
        content: dto.content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
      },
    });

    return {
      success: true,
      comment: {
        ...comment,
        isOwner: comment.userId === contribution.userId,
      },
    };
  }

  /** PATCH /contributions/:id/comments/:commentId — Modifier un commentaire (dans les 2 min ou admin) */
  async updateComment(
    userId: string,
    role: string,
    contributionId: string,
    commentId: string,
    dto: CreateContributionCommentDto,
  ) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id: contributionId },
      select: { id: true, userId: true },
    });
    if (!contribution) throw new NotFoundException('Contribution introuvable');

    const comment = await this.prisma.contributionComment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('Commentaire introuvable');

    if (comment.contributionId !== contributionId) {
      throw new BadRequestException(
        'Ce commentaire n’appartient pas à cette contribution',
      );
    }

    const isAdmin = role === 'ADMIN' || role === 'admin';
    const isCommentAuthor = comment.userId === userId;

    if (!isCommentAuthor && !isAdmin) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que vos propres commentaires',
      );
    }

    if (!isAdmin) {
      const diffMinutes =
        (Date.now() - new Date(comment.createdAt).getTime()) / (1000 * 60);
      if (diffMinutes > 2) {
        throw new BadRequestException(
          'Vous ne pouvez modifier un commentaire que dans les 2 minutes suivant sa publication',
        );
      }
    }

    const updated = await this.prisma.contributionComment.update({
      where: { id: commentId },
      data: {
        content: dto.content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
      },
    });

    return {
      success: true,
      comment: {
        ...updated,
        isOwner: updated.userId === contribution.userId,
      },
    };
  }

  /** DELETE /contributions/:id/comments/:commentId — Supprimer un commentaire (dans les 5 min ou admin) */
  async removeComment(
    userId: string,
    role: string,
    contributionId: string,
    commentId: string,
  ) {
    const comment = await this.prisma.contributionComment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('Commentaire introuvable');

    if (comment.contributionId !== contributionId) {
      throw new BadRequestException(
        'Ce commentaire n’appartient pas à cette contribution',
      );
    }

    const isAdmin = role === 'ADMIN' || role === 'admin';
    const isCommentAuthor = comment.userId === userId;

    if (!isCommentAuthor && !isAdmin) {
      throw new ForbiddenException(
        'Vous ne pouvez supprimer que vos propres commentaires',
      );
    }

    if (!isAdmin) {
      const diffMinutes =
        (Date.now() - new Date(comment.createdAt).getTime()) / (1000 * 60);
      if (diffMinutes > 5) {
        throw new BadRequestException(
          'Vous ne pouvez supprimer un commentaire que dans les 5 minutes suivant sa publication',
        );
      }
    }

    await this.prisma.contributionComment.delete({
      where: { id: commentId },
    });

    return { success: true, message: 'Commentaire supprimé avec succès' };
  }
}
