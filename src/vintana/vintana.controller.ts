import { Controller, Get, Param } from '@nestjs/common';
import { VintanaService } from './vintana.service.js';

@Controller('vintana')
export class VintanaController {
  constructor(private readonly vintanaService: VintanaService) {}

  @Get()
  getAllSigns() {
    return this.vintanaService.getAllSigns();
  }

  @Get('today')
  getTodayForecast() {
    return this.vintanaService.getTodayForecasts();
  }

  @Get(':id')
  getSign(@Param('id') id: string) {
    return this.vintanaService.getSign(id);
  }
}
