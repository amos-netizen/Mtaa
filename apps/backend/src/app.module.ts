import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { PostsModule } from './posts/posts.module';
import { NeighborhoodsModule } from './neighborhoods/neighborhoods.module';
import { JobsModule } from './jobs/jobs.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { UploadModule } from './upload/upload.module';
import { AppController } from './app.controller';

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
    NotificationsModule,
    MarketplaceModule,
    PostsModule,
    NeighborhoodsModule,
    JobsModule,
    ServicesModule,
    BookingsModule,
    UploadModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

