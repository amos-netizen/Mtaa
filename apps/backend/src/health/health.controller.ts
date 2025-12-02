import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { Public } from '../common/decorators/public.decorator';

/**
 * Health Check Controller
 * Provides health check endpoints for monitoring
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  async check() {
    return this.healthService.check();
  }

  @Public()
  @Get('detailed')
  @ApiOperation({ summary: 'Detailed health check with database status' })
  async detailedCheck() {
    return this.healthService.detailedCheck();
  }
}



