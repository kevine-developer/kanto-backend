import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthGuard, Roles } from '../../auth/index.js';
import { ContentSourceService } from './content-source.service.js';
import {
  SearchContentSourcesDto,
  GenerateSuggestionsDto,
  BatchGenerateSuggestionsDto,
  PublishUniversalQuestionDto,
  ContentSourceType,
} from './dto/content-wizard.dto.js';

@Controller('admin/game-wizard')
@UseGuards(AuthGuard)
@Roles(['ADMIN', 'admin'])
export class ContentWizardController {
  constructor(private readonly wizardService: ContentSourceService) {}

  @Get('sources')
  async searchSources(@Query() query: SearchContentSourcesDto) {
    return this.wizardService.searchSources(query);
  }

  @Post('suggest')
  async generateSuggestions(@Body() dto: GenerateSuggestionsDto) {
    return this.wizardService.generateSuggestions(dto);
  }

  @Post('batch-suggest')
  async batchSuggest(@Body() dto: BatchGenerateSuggestionsDto) {
    return this.wizardService.batchSuggest(dto);
  }

  @Post('publish')
  async publishQuestion(@Body() dto: PublishUniversalQuestionDto) {
    return this.wizardService.publishQuestion(dto);
  }
}
