import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreateAppVersionDto,
  UpdateAppVersionDto,
  AppVersionCheckResponse,
} from './dto/app-version.dto.js';
import { compareSemVer } from './utils/semver.util.js';

const DEFAULT_ANDROID_PACKAGE =
  process.env.ANDROID_PACKAGE_NAME || 'com.devengalere.kantomg';
const DEFAULT_STORE_URLS: Record<string, string> = {
  android: `https://play.google.com/store/apps/details?id=${DEFAULT_ANDROID_PACKAGE}`,
  ios:
    process.env.IOS_APP_STORE_URL ||
    'https://apps.apple.com/app/kanto-mg/id6738914614',
};

const DEFAULT_TITLE_FR = 'Une nouvelle version est disponible !';
const DEFAULT_TITLE_MG = 'Misy kinova vaovao azo ampiasaina !';
const DEFAULT_MESSAGE_FR =
  'Kanto MG évolue pour vous offrir une meilleure expérience. Découvrez les nouveautés et profitez des dernières améliorations.';
const DEFAULT_MESSAGE_MG =
  'Mivoatra ny Kanto MG mba hanomezana anao traikefa tsaratsara kokoa. Fantaro ireo zava-baovao ary ankafizo ireo fanatsarana farany.';

@Injectable()
export class AppVersionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Vérifie si une mise à jour est disponible pour la plateforme et la version actuelle du client.
   * Ne déclenche que si la version est explicitement marquée comme publiée (isPublished = true).
   */
  async checkVersion(
    platform: 'android' | 'ios' | 'all',
    currentVersion?: string,
  ): Promise<AppVersionCheckResponse> {
    const normalizedPlatform = platform === 'ios' ? 'ios' : 'android';

    // Recherche de la version publiée la plus récente correspondant à la plateforme
    const latest = await this.prisma.appVersion.findFirst({
      where: {
        platform: { in: [normalizedPlatform, 'all'] },
        isPublished: true,
      },
      orderBy: { publishedAt: 'desc' },
    });

    const safeCurrent = currentVersion || '0.0.0';

    if (!latest) {
      return {
        isUpdateAvailable: false,
        isMandatory: false,
        latestVersion: safeCurrent,
        currentVersion: safeCurrent,
        minVersion: null,
        platform: normalizedPlatform,
        titleFr: DEFAULT_TITLE_FR,
        titleMg: DEFAULT_TITLE_MG,
        messageFr: DEFAULT_MESSAGE_FR,
        messageMg: DEFAULT_MESSAGE_MG,
        releaseNotesFr: [],
        releaseNotesMg: [],
        storeUrl: DEFAULT_STORE_URLS[normalizedPlatform] || '',
        publishedAt: new Date(),
      };
    }

    const isUpdateAvailable = compareSemVer(latest.version, safeCurrent) > 0;
    const isMandatory =
      Boolean(latest.minVersion) &&
      compareSemVer(safeCurrent, latest.minVersion) < 0;

    return {
      isUpdateAvailable,
      isMandatory,
      latestVersion: latest.version,
      currentVersion: safeCurrent,
      minVersion: latest.minVersion,
      platform: normalizedPlatform,
      titleFr: latest.titleFr || DEFAULT_TITLE_FR,
      titleMg: latest.titleMg || DEFAULT_TITLE_MG,
      messageFr: latest.messageFr || DEFAULT_MESSAGE_FR,
      messageMg: latest.messageMg || DEFAULT_MESSAGE_MG,
      releaseNotesFr: latest.releaseNotesFr || [],
      releaseNotesMg: latest.releaseNotesMg || [],
      storeUrl:
        latest.storeUrl ||
        DEFAULT_STORE_URLS[normalizedPlatform] ||
        DEFAULT_STORE_URLS.android,
      publishedAt: latest.publishedAt,
    };
  }

  /**
   * Retourne la dernière version enregistrée pour une plateforme.
   */
  async getLatest(platform: 'android' | 'ios' | 'all') {
    const normalizedPlatform = platform === 'ios' ? 'ios' : 'android';
    return this.prisma.appVersion.findFirst({
      where: {
        platform: { in: [normalizedPlatform, 'all'] },
        isPublished: true,
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  /**
   * Liste complète de l'historique des versions (usage administration).
   */
  async findAll() {
    return this.prisma.appVersion.findMany({
      orderBy: { publishedAt: 'desc' },
    });
  }

  /**
   * Détail d'une version par son ID.
   */
  async findOne(id: string) {
    const version = await this.prisma.appVersion.findUnique({
      where: { id },
    });
    if (!version) {
      throw new NotFoundException(`Version avec l'ID ${id} introuvable.`);
    }
    return version;
  }

  /**
   * Enregistre une nouvelle version dans le système.
   */
  async create(data: CreateAppVersionDto) {
    return this.prisma.appVersion.create({
      data: {
        platform: data.platform,
        version: data.version.trim(),
        minVersion: data.minVersion?.trim() || null,
        buildNumber: data.buildNumber,
        titleFr: data.titleFr,
        titleMg: data.titleMg,
        messageFr: data.messageFr,
        messageMg: data.messageMg,
        releaseNotesFr: data.releaseNotesFr || [],
        releaseNotesMg: data.releaseNotesMg || [],
        storeUrl: data.storeUrl,
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
      },
    });
  }

  /**
   * Modifie une version existante.
   */
  async update(id: string, data: UpdateAppVersionDto) {
    await this.findOne(id);
    return this.prisma.appVersion.update({
      where: { id },
      data: {
        ...data,
        version: data.version?.trim(),
        minVersion: data.minVersion?.trim(),
      },
    });
  }

  /**
   * Supprime une version de la base.
   */
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.appVersion.delete({
      where: { id },
    });
  }
}

