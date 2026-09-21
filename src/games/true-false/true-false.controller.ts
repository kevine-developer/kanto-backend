import { Body, Controller, Get, Post } from '@nestjs/common';
import { Session, type UserSession } from '../../auth/index.js';
import {
  AnswerQuestionDto,
  FinishSessionDto,
  StartSessionDto,
} from './dto/true-false.dto.js';
import { TrueFalseService } from './true-false.service.js';

@Controller('games/true-false')
export class TrueFalseController {
  constructor(private readonly trueFalseService: TrueFalseService) {}

  @Post('start')
  startSession(@Body() dto: StartSessionDto, @Session() session?: UserSession) {
    const userId = session?.user?.id;
    return this.trueFalseService.startSession(
      userId,
      dto.theme,
      dto.difficulty,
      dto.questionCount || 10,
    );
  }

  @Post('answer')
  answerQuestion(@Body() dto: AnswerQuestionDto) {
    return this.trueFalseService.answerQuestion(
      dto.sessionId,
      dto.questionId,
      dto.userAnswer,
    );
  }

  @Post('finish')
  finishSession(@Body() dto: FinishSessionDto) {
    return this.trueFalseService.finishSession(
      dto.sessionId,
      dto.durationSeconds || 0,
    );
  }

  @Get('counts')
  getCounts() {
    return this.trueFalseService.getQuestionCounts();
  }

  @Get('themes')
  getThemesAndLevels() {
    return {
      themes: [
        {
          id: 'GEN',
          nameMg: 'Fahalalana Ankapobeny',
          nameFr: 'Connaissances Générales',
          icon: 'bulb-outline',
        },
        {
          id: 'CULT',
          nameMg: 'Kolontsaina & Fomban-drazana',
          nameFr: 'Culture & Traditions',
          icon: 'color-palette-outline',
        },
        {
          id: 'GEO',
          nameMg: 'Jeografia & Zavaboary',
          nameFr: 'Géographie & Nature',
          icon: 'map-outline',
        },
        {
          id: 'HIST',
          nameMg: 'Tantara & Fiaraha-monina',
          nameFr: 'Histoire & Société',
          icon: 'library-outline',
        },
        {
          id: 'LITT',
          nameMg: 'Hainteny & Zavakanto',
          nameFr: 'Littérature & Arts',
          icon: 'book-outline',
        },
        {
          id: 'PROV',
          nameMg: 'Ohabolana & Fomba fiteny',
          nameFr: 'Proverbes & Expressions',
          icon: 'chatbubble-ellipses-outline',
        },
      ],
      levels: [
        { id: 'EASY', nameMg: 'Mora', nameFr: 'Facile' },
        { id: 'MEDIUM', nameMg: 'Antonony', nameFr: 'Moyen' },
        { id: 'HARD', nameMg: 'Sarotra', nameFr: 'Difficile' },
        { id: 'EXPERT', nameMg: 'Mpandinika', nameFr: 'Expert' },
      ],
    };
  }
}
