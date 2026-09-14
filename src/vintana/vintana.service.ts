import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class VintanaService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSigns() {
    return this.prisma.vintanaSign.findMany();
  }

  async getSign(id: string) {
    const sign = await this.prisma.vintanaSign.findUnique({
      where: { id },
    });
    if (!sign) throw new NotFoundException('Sign not found');
    return sign;
  }

  async getTodayForecasts() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch existing forecasts for today
    let forecasts = await this.prisma.vintanaForecast.findMany({
      where: { date: today },
      include: { sign: true },
    });

    const signs = await this.prisma.vintanaSign.findMany();

    // Generate missing ones
    if (forecasts.length < signs.length) {
      const generated: any[] = [];
      const genericPredictions = [
        'Un jour propice à la réflexion et à la consolidation de vos acquis. Restez calme.',
        'Des opportunités inattendues vont se présenter. Saisissez-les avec courage.',
        "Concentrez-vous sur vos proches aujourd'hui, l'énergie familiale est très forte.",
        "Votre créativité est à son apogée, n'hésitez pas à lancer de nouveaux projets.",
        'Une journée de transition. Prenez du recul et évitez les décisions hâtives.',
      ];

      for (const sign of signs) {
        if (!forecasts.find((f) => f.signId === sign.id)) {
          // simple pseudo random based on day and sign name length
          const randIndex =
            (today.getDate() + sign.nameMg.length) % genericPredictions.length;
          const newForecast = await this.prisma.vintanaForecast.create({
            data: {
              signId: sign.id,
              date: today,
              prediction: genericPredictions[randIndex],
              mood: 'Positif',
            },
            include: { sign: true },
          });
          generated.push(newForecast);
        }
      }
      forecasts = [...forecasts, ...generated];
    }

    return forecasts;
  }
}
