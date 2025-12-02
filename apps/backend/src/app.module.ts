import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';

/**
 * Root Application Module
 * Imports all feature modules and configuration
 */
@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}

