import { Controller, Get } from '@nestjs/common';
import {
  ProducerAwardsIntervalResponse,
  ProducersService,
} from './producers.service';

@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Get('awards-interval')
  async getAwardsInterval(): Promise<ProducerAwardsIntervalResponse> {
    return this.producersService.getAwardsInterval();
  }
}
