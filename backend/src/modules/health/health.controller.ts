import { JsonController, Get, HttpCode } from 'routing-controllers';
import { HealthService } from './health.service';

@JsonController('/health')
export class HealthController {
  private healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  @Get()
  @HttpCode(200)
  async check() {
    return this.healthService.check();
  }
}

