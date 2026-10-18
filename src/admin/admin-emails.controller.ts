import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { AuthGuard, Roles } from '../auth/index.js';
import { PrismaService } from '../infrastructure/database/prisma.service.js';
import { ResendService } from '../integrations/resend/resend.service.js';
import { EmailDeliveryStatus } from '../../generated/prisma/client.js';

@Controller('admin/emails')
@UseGuards(AuthGuard)
@Roles(['ADMIN', 'admin'])
export class AdminEmailsController {
  private readonly logger = new Logger(AdminEmailsController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly resendService: ResendService,
  ) {}

  /**
   * Statistiques globales de distribution et délivrabilité des e-mails.
   */
  @Get('stats')
  async getEmailStats() {
    const [
      total,
      pending,
      accepted,
      sent,
      delivered,
      delayed,
      bounced,
      complained,
      failed,
      suppressionsCount,
    ] = await Promise.all([
      this.prisma.emailLog.count(),
      this.prisma.emailLog.count({ where: { status: 'PENDING' } }),
      this.prisma.emailLog.count({ where: { status: 'ACCEPTED' } }),
      this.prisma.emailLog.count({ where: { status: 'SENT' } }),
      this.prisma.emailLog.count({ where: { status: 'DELIVERED' } }),
      this.prisma.emailLog.count({ where: { status: 'DELIVERY_DELAYED' } }),
      this.prisma.emailLog.count({ where: { status: 'BOUNCED' } }),
      this.prisma.emailLog.count({ where: { status: 'COMPLAINED' } }),
      this.prisma.emailLog.count({ where: { status: 'FAILED' } }),
      this.prisma.emailSuppression.count(),
    ]);

    const completedAttempts = delivered + bounced + complained + failed;
    const deliveryRate =
      completedAttempts > 0
        ? Math.round((delivered / completedAttempts) * 100 * 10) / 10
        : 100;
    const bounceRate =
      completedAttempts > 0
        ? Math.round((bounced / completedAttempts) * 100 * 10) / 10
        : 0;

    return {
      success: true,
      data: {
        total,
        statusCounts: {
          pending,
          accepted,
          sent,
          delivered,
          delayed,
          bounced,
          complained,
          failed,
        },
        suppressionsCount,
        deliveryRate,
        bounceRate,
      },
    };
  }

  /**
   * Consultation de l'historique des e-mails avec filtres complets et pagination.
   */
  @Get()
  async listEmails(
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
    @Query('status') status?: string,
    @Query('templateType') templateType?: string,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const page = Math.max(1, parseInt(pageStr || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(limitStr || '20', 10) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status as EmailDeliveryStatus;
    }

    if (templateType && templateType !== 'ALL') {
      where.templateType = templateType;
    }

    if (search && search.trim() !== '') {
      const term = search.trim();
      where.OR = [
        { recipient: { contains: term, mode: 'insensitive' } },
        { subject: { contains: term, mode: 'insensitive' } },
        { resendId: { contains: term, mode: 'insensitive' } },
        { recipientName: { contains: term, mode: 'insensitive' } },
      ];
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const [total, items] = await Promise.all([
      this.prisma.emailLog.count({ where }),
      this.prisma.emailLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      success: true,
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  /**
   * Consultation du détail d'un e-mail avec ses événements Resend.
   */
  @Get(':id')
  async getEmailDetail(@Param('id') id: string) {
    const email = await this.prisma.emailLog.findUnique({
      where: { id },
    });

    if (!email) {
      throw new NotFoundException(`E-mail avec l'identifiant ${id} introuvable.`);
    }

    return {
      success: true,
      data: email,
    };
  }

  /**
   * Relance manuelle sécurisée d'un message en échec.
   */
  @Post(':id/retry')
  async retryEmail(@Param('id') id: string) {
    try {
      const result = await this.resendService.retryEmail(id);
      return {
        success: true,
        message: 'Relance effectuée avec succès.',
        data: result,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.logger.error(`❌ [Admin Email Retry] Échec de relance : ${errorMsg}`);
      throw new BadRequestException(errorMsg);
    }
  }

  /**
   * Liste des adresses e-mail actuellement exclues (liste de suppression).
   */
  @Get('suppressions/list')
  async listSuppressions(
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
    @Query('search') search?: string,
  ) {
    const page = Math.max(1, parseInt(pageStr || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(limitStr || '20', 10) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search && search.trim() !== '') {
      where.email = { contains: search.trim(), mode: 'insensitive' };
    }

    const [total, items] = await Promise.all([
      this.prisma.emailSuppression.count({ where }),
      this.prisma.emailSuppression.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      success: true,
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  /**
   * Déblocage / suppression manuelle d'une adresse de la liste d'exclusion.
   */
  @Delete('suppressions/:email')
  async removeSuppression(@Param('email') email: string) {
    const normalized = email.toLowerCase().trim();
    try {
      await this.prisma.emailSuppression.delete({
        where: { email: normalized },
      });
      return {
        success: true,
        message: `L'adresse ${normalized} a été réintégrée et peut à nouveau recevoir des e-mails.`,
      };
    } catch {
      throw new NotFoundException(
        `L'adresse ${normalized} n'est pas présente dans la liste d'exclusion.`,
      );
    }
  }
}
