import { Controller, Get, Query } from '@nestjs/common';
import { AstrologyService } from './astrology.service.js';
import { GetDailyAstrologyDto } from './dto/get-daily-astrology.dto.js';

@Controller('astrology')
export class AstrologyController {
  constructor(private readonly astrologyService: AstrologyService) {}

  @Get('daily')
  getDaily(@Query() query: GetDailyAstrologyDto) {
    return this.astrologyService.getDaily(query.sign, query.date);
  }
}
