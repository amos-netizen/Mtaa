import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';

/**
 * Root Application Controller
 * Provides API information and root endpoint
 */
@ApiTags('App')
@Controller()
export class AppController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get API information' })
  getApiInfo() {
    return {
      name: 'Mtaa API',
      version: '1.0.0',
      description: 'Hyperlocal Kenyan Neighborhood Social Network API',
      endpoints: {
        health: '/api/v1/health',
        docs: '/api/docs',
        auth: '/api/v1/auth',
        users: '/api/v1/users',
        posts: '/api/v1/posts',
        notifications: '/api/v1/notifications',
        marketplace: '/api/v1/marketplace/listings',
        jobs: '/api/v1/jobs',
        services: '/api/v1/services',
        bookings: '/api/v1/bookings',
        messages: '/api/v1/conversations',
        neighborhoods: '/api/v1/neighborhoods',
      },
    };
  }
}

