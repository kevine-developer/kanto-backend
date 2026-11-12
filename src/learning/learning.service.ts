import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import {
  SEED_LEARNING_TRACKS,
  SeedTrack,
  SeedLesson,
  SeedSection,
} from './learning.seed-data.js';
import { CompleteLessonDto, ReviewActionDto } from './dto/learning.dto.js';

@Injectable()
export class LearningService {
  private readonly logger = new Logger(LearningService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Tableau de bord pédagogique principal.
   * Retourne la leçon à continuer, la progression globale,
   * les parcours recommandés et le nombre de révisions en attente.
   */
  async getDashboard(userId?: string) {
    const tracks = await this.getTracks(undefined, userId);

    let completedLessonsCount = 0;
    let totalLessonsCount = 0;
    let completedTracksCount = 0;
    let dueReviewsCount = 0;
    let continueLesson: any = null;

    tracks.forEach((track) => {
      totalLessonsCount += track.lessonsCount;
      completedLessonsCount += track.completedLessonsCount;
      if (track.isCompleted) {
        completedTracksCount += 1;
      }
    });

    if (userId) {
      try {
        dueReviewsCount = await this.prisma.userReviewItem.count({
          where: {
            userId,
            nextReviewDue: { lte: new Date() },
          },
        });
      } catch {
        // En cas d'erreur de base de données, continuer avec 0
      }

      // Recherche de la leçon à continuer (dernière en cours)
      try {
        const lastInProgress = await this.prisma.userLessonProgress.findFirst({
          where: { userId, status: 'IN_PROGRESS' },
          orderBy: { updatedAt: 'desc' },
          include: { lesson: { include: { track: true } } },
        });

        if (lastInProgress?.lesson) {
          continueLesson = {
            id: lastInProgress.lesson.id,
            slug: lastInProgress.lesson.slug,
            title: lastInProgress.lesson.title,
            titleMg: lastInProgress.lesson.titleMg,
            trackSlug: lastInProgress.lesson.track.slug,
            trackTitle: lastInProgress.lesson.track.title,
            trackColor: lastInProgress.lesson.track.color,
            orderIndex: lastInProgress.lesson.orderIndex,
            durationMinutes: lastInProgress.lesson.durationMinutes,
          };
        }
      } catch {
        // Ignorer
      }
    }

    // Si aucune leçon en cours, proposer la première leçon du premier parcours non terminé
    if (!continueLesson && tracks.length > 0) {
      const firstActiveTrack = tracks.find((t) => !t.isCompleted) || tracks[0];
      const trackDetail = await this.getTrackBySlug(
        firstActiveTrack.slug,
        userId,
      );
      const firstAvailableLesson =
        trackDetail.lessons.find(
          (l: any) => l.status === 'available' || l.status === 'in_progress',
        ) || trackDetail.lessons[0];

      if (firstAvailableLesson) {
        continueLesson = {
          id: firstAvailableLesson.id,
          slug: firstAvailableLesson.slug,
          title: firstAvailableLesson.title,
          titleMg: firstAvailableLesson.titleMg,
          trackSlug: firstActiveTrack.slug,
          trackTitle: firstActiveTrack.title,
          trackColor: firstActiveTrack.color,
          orderIndex: firstAvailableLesson.order,
          durationMinutes: firstAvailableLesson.durationMinutes,
        };
      }
    }

    const overallProgressPercent =
      totalLessonsCount > 0
        ? Math.round((completedLessonsCount / totalLessonsCount) * 100)
        : 0;

    return {
      continueLesson,
      overview: {
        completedLessonsCount,
        totalLessonsCount,
        completedTracksCount,
        totalTracksCount: tracks.length,
        overallProgressPercent,
        completionRate: overallProgressPercent,
        dueReviewsCount,
        todayGoalMinutes: 15,
        todayCompletedMinutes: Math.min(15, completedLessonsCount * 5),
        streakDays: 1,
      },
      tracks,
      recommendedTracks: tracks.slice(0, 2),
      dueReviewsCount,
    };
  }

  /**
   * Récupère tous les parcours publiés avec le taux d'avancement de l'utilisateur.
   */
  async getTracks(level?: string, userId?: string) {
    let dbTracks: any[] = [];

    try {
      dbTracks = await this.prisma.learningTrack.findMany({
        where: {
          isPublished: true,
          ...(level ? { level: level as any } : {}),
        },
        include: {
          _count: { select: { lessons: true } },
        },
        orderBy: { orderIndex: 'asc' },
      });
    } catch {
      // Ignorer
    }

    // Si la base est vide ou inaccessible, utiliser les données seed de référence
    const sourceTracks: any[] =
      dbTracks.length > 0
        ? dbTracks
        : SEED_LEARNING_TRACKS.filter((t) => !level || t.level === level);

    const userProgressMap = new Map<
      string,
      { completed: number; isCompleted: boolean }
    >();

    if (userId) {
      try {
        const userProgressList = await this.prisma.userTrackProgress.findMany({
          where: { userId },
        });
        userProgressList.forEach((up) => {
          userProgressMap.set(up.trackId, {
            completed: up.completedLessonsCount,
            isCompleted: up.isCompleted,
          });
        });
      } catch {
        // Ignorer
      }
    }

    return sourceTracks.map((t) => {
      const lessonsCount = t._count?.lessons ?? t.lessons?.length ?? 3;
      const progressInfo = userProgressMap.get(t.id || t.slug);
      const completedCount = progressInfo ? progressInfo.completed : 0;
      const isCompleted = progressInfo ? progressInfo.isCompleted : false;
      const progressPercent =
        lessonsCount > 0
          ? Math.round((completedCount / lessonsCount) * 100)
          : 0;

      return {
        id: t.id || t.slug,
        slug: t.slug,
        title: t.title,
        titleMg: t.titleMg,
        description: t.description,
        descriptionMg: t.descriptionMg,
        level: t.level,
        icon: t.icon || 'GraduationCap',
        color: t.color || '#4A6741',
        orderIndex: t.orderIndex,
        estimatedMinutes: t.estimatedMinutes,
        lessonsCount,
        completedLessonsCount: completedCount,
        progressPercent,
        isCompleted,
      };
    });
  }

  /**
   * Détail d'un parcours avec ses leçons ordonnées et statut (available, in_progress, completed, locked).
   */
  async getTrackBySlug(slug: string, userId?: string) {
    let track: any = null;

    try {
      track = await this.prisma.learningTrack.findUnique({
        where: { slug },
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { orderIndex: 'asc' },
          },
        },
      });
    } catch {
      // Ignorer
    }

    if (!track) {
      const found = SEED_LEARNING_TRACKS.find((t) => t.slug === slug);
      if (found) {
        track = {
          ...found,
          id: found.slug,
          lessons: found.lessons.map((l) => ({
            ...l,
            id: l.slug,
            trackId: found.slug,
          })),
        };
      }
    }

    if (!track) {
      throw new NotFoundException(`Parcours pédagogique "${slug}" introuvable`);
    }

    // Récupérer la progression des leçons pour cet utilisateur
    const userLessonProgressMap = new Map<
      string,
      { status: string; score: number }
    >();
    if (userId) {
      try {
        const progressList = await this.prisma.userLessonProgress.findMany({
          where: {
            userId,
            lesson: { trackId: track.id },
          },
        });
        progressList.forEach((p) => {
          userLessonProgressMap.set(p.lessonId, {
            status: p.status,
            score: p.score,
          });
        });
      } catch {
        // Ignorer
      }
    }

    let foundFirstIncomplete = false;
    let completedLessonsCount = 0;

    const lessonsWithStatus = (track.lessons || []).map(
      (lesson: any, index: number) => {
        const progress = userLessonProgressMap.get(lesson.id || lesson.slug);
        let status: 'completed' | 'in_progress' | 'available' | 'locked' =
          'locked';

        if (progress?.status === 'COMPLETED') {
          status = 'completed';
          completedLessonsCount += 1;
        } else if (progress?.status === 'IN_PROGRESS') {
          status = 'in_progress';
          foundFirstIncomplete = true;
        } else if (!foundFirstIncomplete) {
          // La première leçon non complétée devient disponible
          status = 'available';
          foundFirstIncomplete = true;
        } else {
          status = 'locked';
        }

        return {
          id: lesson.id || lesson.slug,
          trackId: track.id || track.slug,
          slug: lesson.slug,
          title: lesson.title,
          titleMg: lesson.titleMg,
          description: lesson.summary || lesson.description,
          descriptionMg: lesson.summaryMg || lesson.descriptionMg,
          type: lesson.type,
          order: lesson.orderIndex ?? index + 1,
          durationMinutes: lesson.durationMinutes || 5,
          xpReward: 25,
          status,
          userScore: progress?.score ?? null,
        };
      },
    );

    const totalLessons = lessonsWithStatus.length;
    const progressPercent =
      totalLessons > 0
        ? Math.round((completedLessonsCount / totalLessons) * 100)
        : 0;

    return {
      id: track.id || track.slug,
      slug: track.slug,
      title: track.title,
      titleMg: track.titleMg,
      description: track.description,
      descriptionMg: track.descriptionMg,
      level: track.level,
      color: track.color || '#4A6741',
      lessonsCount: totalLessons,
      completedLessonsCount,
      progressPercent,
      isCompleted: progressPercent === 100,
      lessons: lessonsWithStatus,
    };
  }

  /**
   * Normalise les sections brutes (stockées en JSON ou dans le seed)
   * vers la structure didactique attendue par l'UI mobile.
   */
  private normalizeLessonContent(rawSections: any[]) {
    const sections: any[] = [];
    const vocabulary: any[] = [];
    const phonetics: any[] = [];
    const microQuiz: any[] = [];
    let didYouKnow: string | undefined;
    let didYouKnowFr: string | undefined;
    let didYouKnowMg: string | undefined;
    let culturalNote: string | undefined;
    let culturalNoteMg: string | undefined;

    const list = Array.isArray(rawSections) ? rawSections : [];
    const configSection = list.find((s: any) => s.type === 'config');
    const audioEnabled: boolean = configSection
      ? configSection.audioEnabled !== false
      : true;

    list.forEach((s: any, idx: number) => {
      if (s.type === 'intro') {
        sections.push({
          titleFr: 'Introduction',
          titleMg: 'Fampidirana',
          contentFr: s.textFr || s.explanation || '',
          contentMg: s.textMg || '',
          type: 'intro',
        });
      } else if (s.type === 'concept') {
        // Notion / Vocabulaire clé : source unique de vérité pour l'apprentissage du mot
        if (s.termMg) {
          vocabulary.push({
            wordMg: s.termMg,
            translationFr: s.meaningFr || '',
            phonetic: s.phonetic || undefined,
            exampleMg: s.explanation || undefined,
            exampleFr: s.meaningFr || undefined,
          });
        }
      } else if (s.type === 'example') {
        sections.push({
          titleFr: 'Exemple en contexte',
          titleMg: 'Ohatra fampiasana',
          contentFr: s.textFr || '',
          contentMg: s.textMg || '',
          highlight: s.textMg ? `« ${s.textMg} »` : undefined,
          type: 'cultural_context',
        });
      } else if (s.type === 'phonetic') {
        phonetics.push({
          letterOrSound: s.letterOrSound || s.termMg || 'Son',
          ipa: s.phonetic || '',
          frenchEquivalent: s.frenchEquivalent || s.explanation || '',
          sampleWordMg: s.sampleWordMg || s.termMg || '',
          sampleTranslationFr: s.sampleTranslationFr || s.meaningFr || '',
        });
      } else if (s.type === 'didYouKnow') {
        // Préservation des deux langues : Malagasy et Français
        didYouKnowFr = s.textFr || '';
        didYouKnowMg = s.textMg || '';
        didYouKnow = s.textFr || s.textMg;
        culturalNote = s.textFr || s.textMg;
        culturalNoteMg = s.textMg || '';
        // Note : On ne pousse PAS dans sections[] pour supprimer le premier doublon
        // et réserver l'affichage complet à la carte culturelle dédiée.
      } else if (s.type === 'quiz') {
        const choices: string[] = s.choices || [];
        microQuiz.push({
          id: `quiz_${idx}`,
          questionFr: s.question || '',
          questionMg: s.questionMg || s.question || '',
          options: choices.map((choice: string, cIdx: number) => ({
            id: `opt_${cIdx}`,
            textFr: choice,
            textMg: choice,
          })),
          correctOptionId: `opt_${s.correctIndex ?? 0}`,
          explanationFr: s.explanation || undefined,
          explanationMg: s.explanation || undefined,
        });
      }
    });

    // Nettoyage défensif de toute section qui serait un doublon de "Le saviez-vous ?"
    const cleanSections = sections.filter(
      (sec) =>
        sec.type !== 'anecdote' &&
        sec.titleFr !== 'Le saviez-vous ?' &&
        sec.titleMg !== 'Fahatsiarovana',
    );

    return {
      audioEnabled,
      sections: cleanSections,
      vocabulary,
      phonetics,
      microQuiz,
      didYouKnow,
      didYouKnowFr,
      didYouKnowMg,
      culturalNote,
      culturalNoteMg,
    };
  }

  /**
   * Récupère le contenu complet d'une leçon (sections, explications, micro-quiz).
   */
  async getLessonBySlug(slug: string, userId?: string) {
    let lesson: any = null;

    try {
      lesson = await this.prisma.learningLesson.findUnique({
        where: { slug },
        include: {
          track: {
            include: {
              lessons: {
                where: { isPublished: true },
                orderBy: { orderIndex: 'asc' },
                select: {
                  id: true,
                  slug: true,
                  title: true,
                  titleMg: true,
                  orderIndex: true,
                },
              },
            },
          },
        },
      });
    } catch {
      // Ignorer
    }

    if (!lesson) {
      for (const track of SEED_LEARNING_TRACKS) {
        const found = track.lessons.find((l) => l.slug === slug);
        if (found) {
          lesson = {
            ...found,
            id: found.slug,
            track: {
              id: track.slug,
              slug: track.slug,
              title: track.title,
              titleMg: track.titleMg,
              color: track.color,
              lessons: track.lessons.map((l) => ({
                id: l.slug,
                slug: l.slug,
                title: l.title,
                titleMg: l.titleMg,
                orderIndex: l.orderIndex,
              })),
            },
          };
          break;
        }
      }
    }

    if (!lesson) {
      throw new NotFoundException(`Leçon pédagogique "${slug}" introuvable`);
    }

    // Récupérer le statut de l'utilisateur sur cette leçon
    let isCompleted = false;
    let userScore: number | null = null;

    if (userId) {
      try {
        const userProgress = await this.prisma.userLessonProgress.findUnique({
          where: {
            userId_lessonId: {
              userId,
              lessonId: lesson.id || lesson.slug,
            },
          },
        });
        if (userProgress) {
          isCompleted = userProgress.status === 'COMPLETED';
          userScore = userProgress.score;
        } else {
          // Marquer comme IN_PROGRESS lors de l'ouverture si pas déjà complétée
          await this.prisma.userLessonProgress.upsert({
            where: {
              userId_lessonId: {
                userId,
                lessonId: lesson.id || lesson.slug,
              },
            },
            create: {
              userId,
              lessonId: lesson.id || lesson.slug,
              status: 'IN_PROGRESS',
            },
            update: {
              updatedAt: new Date(),
            },
          });
        }
      } catch {
        // Ignorer
      }
    }

    // Trouver leçon précédente et suivante
    const trackLessons = lesson.track?.lessons || [];
    const currentIndex = trackLessons.findIndex((l: any) => l.slug === slug);
    const prevLesson = currentIndex > 0 ? trackLessons[currentIndex - 1] : null;
    const nextLesson =
      currentIndex >= 0 && currentIndex < trackLessons.length - 1
        ? trackLessons[currentIndex + 1]
        : null;

    const rawSections =
      typeof lesson.sections === 'string'
        ? JSON.parse(lesson.sections)
        : Array.isArray(lesson.sections)
          ? lesson.sections
          : [];

    const normalized = this.normalizeLessonContent(rawSections);

    return {
      id: lesson.id || lesson.slug,
      trackId: lesson.track?.id || lesson.trackId,
      slug: lesson.slug,
      title: lesson.title,
      titleMg: lesson.titleMg,
      description: lesson.summary || lesson.description,
      descriptionMg: lesson.summaryMg || lesson.descriptionMg,
      type: lesson.type,
      durationMinutes: lesson.durationMinutes || 5,
      xpReward: 25,
      audioUrl: lesson.audioUrl,
      audioEnabled: normalized.audioEnabled,
      status: isCompleted ? 'completed' : 'available',
      userScore,
      sections: normalized.sections,
      vocabulary: normalized.vocabulary,
      phonetics: normalized.phonetics,
      microQuiz: normalized.microQuiz,
      didYouKnow: normalized.didYouKnow,
      didYouKnowFr: normalized.didYouKnowFr,
      didYouKnowMg: normalized.didYouKnowMg,
      culturalNote: normalized.culturalNote,
      culturalNoteMg: normalized.culturalNoteMg,
      track: {
        id: lesson.track?.id || lesson.track?.slug,
        slug: lesson.track?.slug,
        title: lesson.track?.title,
        titleMg: lesson.track?.titleMg,
        color: lesson.track?.color,
      },
      prevLesson: prevLesson
        ? { slug: prevLesson.slug, title: prevLesson.title }
        : null,
      nextLesson: nextLesson
        ? { slug: nextLesson.slug, title: nextLesson.title }
        : null,
    };
  }

  /**
   * Valide la complétion d'une leçon par un utilisateur (idempotent),
   * met à jour la progression du parcours et insère les notions dans le système de révision.
   */
  async completeLesson(
    slugOrId: string,
    userId: string,
    dto: CompleteLessonDto,
  ) {
    let lesson: any = null;

    try {
      lesson = await this.prisma.learningLesson.findFirst({
        where: { OR: [{ id: slugOrId }, { slug: slugOrId }] },
        include: {
          track: {
            include: {
              lessons: {
                where: { isPublished: true },
                orderBy: { orderIndex: 'asc' },
              },
            },
          },
        },
      });
    } catch {
      // Ignorer
    }

    if (!lesson) {
      for (const track of SEED_LEARNING_TRACKS) {
        const found = track.lessons.find((l) => l.slug === slugOrId);
        if (found) {
          lesson = { ...found, id: found.slug, trackId: track.slug, track };
          break;
        }
      }
    }

    if (!lesson) {
      throw new NotFoundException(`Leçon "${slugOrId}" introuvable`);
    }

    const lessonId = lesson.id;
    const trackId = lesson.trackId || lesson.track?.id;
    let nextLessonSlug: string | undefined;

    // Trouver la leçon suivante
    if (lesson.track?.lessons && Array.isArray(lesson.track.lessons)) {
      const cIdx = lesson.track.lessons.findIndex(
        (l: any) => l.slug === lesson.slug,
      );
      if (cIdx >= 0 && cIdx < lesson.track.lessons.length - 1) {
        nextLessonSlug = lesson.track.lessons[cIdx + 1].slug;
      }
    }

    let trackProgressPercent = 100;
    let isTrackCompleted = false;
    let wasAlreadyCompleted = false;
    let totalUserXp = 0;
    const MIN_PASSING_SCORE = 60;
    const score = dto.score ?? 100;
    const isPassed = score >= MIN_PASSING_SCORE;

    // Vérifier l'état préalable pour l'idempotence des récompenses XP
    try {
      const existing = await this.prisma.userLessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId } },
      });
      wasAlreadyCompleted = existing?.status === 'COMPLETED';
    } catch {
      // Ignorer si indisponible
    }

    if (!isPassed) {
      // Score insuffisant (< 60%) : la leçon n'est pas validée
      try {
        if (!wasAlreadyCompleted) {
          await this.prisma.userLessonProgress.upsert({
            where: { userId_lessonId: { userId, lessonId } },
            create: {
              userId,
              lessonId,
              status: 'IN_PROGRESS',
              score,
              timeSpentSeconds: dto.timeSpentSeconds ?? 0,
            },
            update: {
              score: Math.max(score, 0),
              timeSpentSeconds: { increment: dto.timeSpentSeconds ?? 0 },
            },
          });
        }
      } catch (error) {
        this.logger.warn(
          `Erreur lors de l'enregistrement de la tentative de leçon :`,
          error,
        );
      }

      return {
        success: false,
        passed: false,
        alreadyCompleted: wasAlreadyCompleted,
        score,
        minRequiredScore: MIN_PASSING_SCORE,
        earnedXp: 0,
        totalUserXp,
        trackCompleted: false,
        trackProgressPercent: 0,
        nextLessonSlug: undefined,
        isNextUnlocked: false,
        message: "Un score d'au moins 60% est requis pour valider cette leçon.",
      };
    }

    const earnedXp = wasAlreadyCompleted ? 0 : (lesson.xpReward || 25);

    try {
      // 1. Enregistrement idempotent de la validation de la leçon (>= 60%)
      await this.prisma.userLessonProgress.upsert({
        where: {
          userId_lessonId: { userId, lessonId },
        },
        create: {
          userId,
          lessonId,
          status: 'COMPLETED',
          score,
          timeSpentSeconds: dto.timeSpentSeconds ?? 0,
          completedAt: new Date(),
        },
        update: {
          status: 'COMPLETED',
          score: Math.max(score, 0),
          timeSpentSeconds: { increment: dto.timeSpentSeconds ?? 0 },
          completedAt: new Date(),
        },
      });

      // 2. Crédit réel d'XP utilisateur et historique de transaction
      if (earnedXp > 0) {
        try {
          const up = await this.prisma.userProgress.upsert({
            where: { userId },
            create: {
              userId,
              totalXp: earnedXp,
              level: 1,
            },
            update: {
              totalXp: { increment: earnedXp },
            },
          });
          totalUserXp = Math.round(Number(up.totalXp));

          await this.prisma.xpTransaction.create({
            data: {
              userId,
              amount: earnedXp,
              source: `learning_lesson_${lesson.slug}`,
              description: `Validation de la leçon : ${lesson.title}`,
            },
          });
        } catch (xpErr) {
          this.logger.warn(`Erreur lors du crédit d'XP :`, xpErr);
        }
      } else {
        try {
          const currentUp = await this.prisma.userProgress.findUnique({
            where: { userId },
          });
          if (currentUp) {
            totalUserXp = Math.round(Number(currentUp.totalXp));
          }
        } catch {}
      }

      // 3. Mise à jour de la progression globale du parcours
      if (trackId) {
        const completedCount = await this.prisma.userLessonProgress.count({
          where: {
            userId,
            status: 'COMPLETED',
            lesson: { trackId },
          },
        });

        const totalLessonsInTrack = await this.prisma.learningLesson.count({
          where: { trackId, isPublished: true },
        });

        isTrackCompleted =
          completedCount >= totalLessonsInTrack && totalLessonsInTrack > 0;
        trackProgressPercent =
          totalLessonsInTrack > 0
            ? Math.round((completedCount / totalLessonsInTrack) * 100)
            : 100;

        await this.prisma.userTrackProgress.upsert({
          where: {
            userId_trackId: { userId, trackId },
          },
          create: {
            userId,
            trackId,
            completedLessonsCount: completedCount,
            totalLessonsCount: totalLessonsInTrack,
            isCompleted: isTrackCompleted,
            lastAccessedAt: new Date(),
          },
          update: {
            completedLessonsCount: completedCount,
            totalLessonsCount: totalLessonsInTrack,
            isCompleted: isTrackCompleted,
            lastAccessedAt: new Date(),
          },
        });
      }

      // 4. Alimentation automatique du système de répétition espacée (SRS)
      const rawSections =
        typeof lesson.sections === 'string'
          ? JSON.parse(lesson.sections)
          : Array.isArray(lesson.sections)
            ? lesson.sections
            : [];

      for (const section of rawSections) {
        if (section.type === 'concept' && section.termMg && section.meaningFr) {
          try {
            await this.prisma.userReviewItem.create({
              data: {
                userId,
                lessonId,
                termMg: section.termMg,
                meaningFr: section.meaningFr,
                phonetic: section.phonetic || null,
                contextMg: section.explanation || null,
                contextFr: section.meaningFr || null,
                masteryLevel: 1,
                intervalDays: 1,
                nextReviewDue: new Date(Date.now() + 24 * 60 * 60 * 1000), // J+1
              },
            });
          } catch {
            // Ignorer les doublons éventuels
          }
        }
      }
    } catch (error) {
      this.logger.warn(
        `Erreur lors de l'enregistrement de la leçon complétée :`,
        error,
      );
    }

    return {
      success: true,
      passed: true,
      alreadyCompleted: wasAlreadyCompleted,
      score,
      minRequiredScore: MIN_PASSING_SCORE,
      earnedXp,
      totalUserXp,
      trackCompleted: isTrackCompleted,
      trackProgressPercent,
      nextLessonSlug,
      isNextUnlocked: Boolean(nextLessonSlug),
    };
  }

  /**
   * Récupère la liste structurée des notions apprises pour les révisions (« Mes révisions »).
   * Supporte le filtrage (all, due, in_progress, mastered) et inclut les métadonnées de parcours.
   */
  async getReviews(userId: string, filter?: string) {
    let reviewsList: any[] = [];
    const now = new Date();

    try {
      const whereClause: any = { userId };
      if (filter === 'due') {
        whereClause.nextReviewDue = { lte: now };
      } else if (filter === 'mastered') {
        whereClause.masteryLevel = { gte: 5 };
      } else if (filter === 'in_progress') {
        whereClause.masteryLevel = { lt: 5 };
      }

      reviewsList = await this.prisma.userReviewItem.findMany({
        where: whereClause,
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              titleMg: true,
              slug: true,
              track: {
                select: {
                  title: true,
                  titleMg: true,
                  color: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: [{ nextReviewDue: 'asc' }, { masteryLevel: 'asc' }],
        take: 60,
      });
    } catch {
      // Ignorer si indisponible
    }

    // Fallback éducatif si la base ne contient pas encore d'items
    if (reviewsList.length === 0) {
      const firstTrack = SEED_LEARNING_TRACKS[0];
      const sampleReviews: any[] = [];

      firstTrack.lessons.forEach((l, lIdx) => {
        l.sections.forEach((s, sIdx) => {
          if (s.type === 'concept' && s.termMg && s.meaningFr) {
            const isSampleDue = (lIdx + sIdx) % 2 === 0;
            const sampleLevel = ((lIdx + sIdx) % 5) + 1;
            sampleReviews.push({
              id: `seed_review_${lIdx}_${sIdx}`,
              conceptKey: s.termMg,
              termMg: s.termMg,
              meaningFr: s.meaningFr,
              phonetic: s.phonetic || null,
              contextMg: s.explanation || null,
              contextFr: s.meaningFr || null,
              questionMg: `Inona no dikan'ny hoe « ${s.termMg} » ?`,
              questionFr: `Que signifie l'expression « ${s.termMg} » ?`,
              answerMg: s.termMg,
              answerFr: s.meaningFr,
              level: sampleLevel,
              masteryLevel: sampleLevel,
              intervalDays: sampleLevel * 2,
              nextReviewDue: isSampleDue
                ? new Date(now.getTime() - 1000).toISOString()
                : new Date(now.getTime() + 48 * 3600 * 1000).toISOString(),
              reviewCount: sampleLevel,
              easeFactor: 2.5,
              isDue: isSampleDue,
              status:
                sampleLevel >= 5
                  ? 'mastered'
                  : isSampleDue
                    ? 'due'
                    : 'in_progress',
              lessonTitle: l.title,
              lessonTitleMg: l.titleMg,
              lessonSlug: l.slug,
              trackTitle: firstTrack.title,
              trackTitleMg: firstTrack.titleMg,
              trackColor: firstTrack.color || '#4A6741',
            });
          }
        });
      });

      const filteredSamples = sampleReviews.filter((item) => {
        if (filter === 'due') return item.isDue;
        if (filter === 'mastered') return item.masteryLevel >= 5;
        if (filter === 'in_progress') return item.masteryLevel < 5;
        return true;
      });

      return filteredSamples.slice(0, 20);
    }

    return reviewsList.map((r) => {
      const isDue = new Date(r.nextReviewDue) <= now;
      const status =
        r.masteryLevel >= 5 ? 'mastered' : isDue ? 'due' : 'in_progress';

      return {
        id: r.id,
        conceptKey: r.termMg,
        termMg: r.termMg,
        meaningFr: r.meaningFr,
        phonetic: r.phonetic || null,
        contextMg: r.contextMg || null,
        contextFr: r.contextFr || null,
        questionMg: `Inona no dikan'ny hoe « ${r.termMg} » ?`,
        questionFr: `Que signifie l'expression « ${r.termMg} » ?`,
        answerMg: r.termMg,
        answerFr: r.meaningFr,
        level: r.masteryLevel,
        masteryLevel: r.masteryLevel,
        intervalDays: r.intervalDays,
        nextReviewDue: r.nextReviewDue.toISOString(),
        reviewCount: r.reviewCount,
        easeFactor: 2.5,
        isDue,
        status,
        lessonTitle: r.lesson?.title || 'Leçon culturelle',
        lessonTitleMg: r.lesson?.titleMg || 'Lesona',
        lessonSlug: r.lesson?.slug || undefined,
        trackTitle: r.lesson?.track?.title || 'Fondamentaux',
        trackTitleMg: r.lesson?.track?.titleMg || 'Fototra',
        trackColor: r.lesson?.track?.color || '#4A6741',
      };
    });
  }

  /**
   * Soumission d'une action de révision (AGAIN, HARD, GOOD, EASY).
   * Implémente l'algorithme de répétition espacée Leitner / SuperMemo-2.
   */
  async submitReviewAction(
    reviewId: string,
    userId: string,
    dto: ReviewActionDto,
  ) {
    let nextIntervalDays = 1;
    let nextMasteryLevel = 1;

    try {
      const item = await this.prisma.userReviewItem.findUnique({
        where: { id: reviewId },
      });

      if (item && item.userId === userId) {
        const currentInterval = item.intervalDays || 1;
        const currentLevel = item.masteryLevel || 1;

        const actionType = (dto.action || dto.quality || 'GOOD').toUpperCase();
        switch (actionType) {
          case 'AGAIN':
            nextIntervalDays = 1;
            nextMasteryLevel = Math.max(1, currentLevel - 1);
            break;
          case 'HARD':
            nextIntervalDays = Math.max(1, Math.round(currentInterval * 1.2));
            nextMasteryLevel = currentLevel;
            break;
          case 'GOOD':
            nextIntervalDays = Math.max(2, Math.round(currentInterval * 2));
            nextMasteryLevel = Math.min(5, currentLevel + 1);
            break;
          case 'EASY':
            nextIntervalDays = Math.max(4, Math.round(currentInterval * 2.5));
            nextMasteryLevel = Math.min(5, currentLevel + 2);
            break;
        }

        const nextReviewDueDate = new Date(
          Date.now() + nextIntervalDays * 24 * 60 * 60 * 1000,
        );

        await this.prisma.userReviewItem.update({
          where: { id: reviewId },
          data: {
            intervalDays: nextIntervalDays,
            masteryLevel: nextMasteryLevel,
            nextReviewDue: nextReviewDueDate,
            reviewCount: { increment: 1 },
            lastReviewedAt: new Date(),
          },
        });
      }
    } catch (err) {
      this.logger.warn(
        `Erreur lors de la mise à jour de la révision ${reviewId} :`,
        err,
      );
    }

    return {
      success: true,
      nextReviewDue: new Date(
        Date.now() + nextIntervalDays * 24 * 60 * 60 * 1000,
      ).toISOString(),
      intervalDays: nextIntervalDays,
      easeFactor: 2.5,
    };
  }

  /**
   * Statistiques d'apprentissage pour l'utilisateur.
   */
  async getMyProgress(userId: string) {
    try {
      const completedLessons = await this.prisma.userLessonProgress.findMany({
        where: { userId, status: 'COMPLETED' },
        include: { lesson: { select: { id: true, title: true, slug: true } } },
        orderBy: { completedAt: 'desc' },
      });

      const trackProgressList = await this.prisma.userTrackProgress.findMany({
        where: { userId },
        include: {
          track: { select: { id: true, title: true, slug: true, color: true } },
        },
      });

      const completedTracksCount = trackProgressList.filter(
        (tp) => tp.isCompleted,
      ).length;

      return {
        completedLessonsCount: completedLessons.length,
        completedTracksCount,
        totalLearningTimeMinutes: completedLessons.length * 5,
        learningXp: completedLessons.length * 25,
        activeStreakDays: 1,
        tracksProgress: trackProgressList.map((tp) => ({
          trackId: tp.trackId,
          trackTitle: tp.track.title,
          trackSlug: tp.track.slug,
          trackColor: tp.track.color || undefined,
          completedLessons: tp.completedLessonsCount,
          totalLessons: tp.totalLessonsCount,
          progressPercent:
            tp.totalLessonsCount > 0
              ? Math.round(
                  (tp.completedLessonsCount / tp.totalLessonsCount) * 100,
                )
              : 0,
          isCompleted: tp.isCompleted,
        })),
        recentCompletions: completedLessons.slice(0, 5).map((cl) => ({
          lessonId: cl.lessonId,
          lessonTitle: cl.lesson.title,
          lessonSlug: cl.lesson.slug,
          score: cl.score,
          completedAt: (cl.completedAt ?? new Date()).toISOString(),
        })),
      };
    } catch {
      return {
        completedLessonsCount: 0,
        completedTracksCount: 0,
        totalLearningTimeMinutes: 0,
        learningXp: 0,
        activeStreakDays: 0,
        tracksProgress: [],
        recentCompletions: [],
      };
    }
  }
}
