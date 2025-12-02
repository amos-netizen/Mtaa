import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '../config/config.module';
import { PasswordUtil } from '../common/utils/password.util';
import { AppConfigService } from '../config/config.service';

/**
 * Authentication Module
 * Handles user authentication, registration, and token management
 */
@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: AppConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: {
          expiresIn: configService.jwtExpiresIn,
        },
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PasswordUtil],
  exports: [AuthService],
})
export class AuthModule {}

