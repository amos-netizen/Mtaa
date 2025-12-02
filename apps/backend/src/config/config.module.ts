import { Module, Global } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AppConfigService } from './config.service';
import * as Joi from 'joi';

/**
 * Global configuration module
 * Provides environment variables and configuration throughout the app
 */
@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3001),
        DATABASE_URL: Joi.string().required(),
        REDIS_URL: Joi.string().optional(),
        JWT_SECRET: Joi.string().required().min(32),
        JWT_EXPIRES_IN: Joi.string().default('15m'),
        JWT_REFRESH_SECRET: Joi.string().optional(),
        JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),
        FRONTEND_URL: Joi.string().default('http://localhost:3000'),
        BCRYPT_ROUNDS: Joi.number().default(10),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class ConfigModule {}

