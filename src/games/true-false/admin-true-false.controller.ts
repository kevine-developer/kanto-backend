import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CreateQuestionDto,
  FindQuestionsQueryDto,
  UpdateQuestionDto,
} from './dto/true-false.dto.js';
import { TrueFalseService } from './true-false.service.js';
import { AuthGuard, Roles } from '../../auth/index.js';

@Controller('admin/true-false')
@UseGuards(AuthGuard)
@Roles(['ADMIN', 'admin'])
export class AdminTrueFalseController {
  constructor(private readonly trueFalseService: TrueFalseService) {}

  @Get('stats')
  getStats() {
    return this.trueFalseService.getStats();
  }

  @Get()
  findAll(@Query() query: FindQuestionsQueryDto) {
    return this.trueFalseService.findAllQuestions(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trueFalseService.findOneQuestion(id);
  }

  @Post()
  create(@Body() dto: CreateQuestionDto) {
    return this.trueFalseService.createQuestion(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.trueFalseService.updateQuestion(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trueFalseService.removeQuestion(id);
  }
}
