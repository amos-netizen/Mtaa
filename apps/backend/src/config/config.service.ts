import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

/**
 * Configuration service
 * Provides typed access to environment variables
 */
@Injectable()
export class AppConfigService {
  constructor(private configService: NestConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3001);
  }

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL') || '';
  }

  get redisUrl(): string | undefined {
    return this.configService.get<string>('REDIS_URL');
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || '';
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN', '15m');
  }

  get jwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET') || this.jwtSecret;
  }

  get jwtRefreshExpiresIn(): string {
    return this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '30d');
  }

  get frontendUrl(): string {
    return this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
  }

  get bcryptRounds(): number {
    return this.configService.get<number>('BCRYPT_ROUNDS', 10);
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }
}



