import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PasswordUtil } from '../common/utils/password.util';
import { ConfigModule } from '../config/config.module';

/**
 * Users Module
 * Handles user management and profile operations
 */
@Module({
  imports: [ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, PasswordUtil],
  exports: [UsersService],
})
export class UsersModule {}

