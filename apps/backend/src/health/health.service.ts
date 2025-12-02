import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Health Service
 * Checks application and database health
 */
@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  /**
   * Basic health check
   */
  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  /**
   * Detailed health check including database connectivity
   */
  async detailedCheck() {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: 'unknown',
        responseTime: 0,
      },
    };

    try {
      const startTime = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;

      health.database = {
        status: 'connected',
        responseTime,
      };
    } catch (error) {
      health.status = 'degraded';
      health.database = {
        status: 'disconnected',
        responseTime: 0,
      };
    }

    return health;
  }
}



