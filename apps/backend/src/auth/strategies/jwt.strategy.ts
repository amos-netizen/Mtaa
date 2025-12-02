import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AppConfigService } from '../../config/config.service';

/**
 * JWT Strategy for Passport
 * Validates JWT tokens and extracts user information
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: AppConfigService,
    private prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  /**
   * Validate JWT payload and return user data
   * This method is called after JWT is verified
   */
  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    if (user.isBanned) {
      throw new UnauthorizedException('User account is banned');
    }

    // Return user data that will be attached to request.user
    return {
      userId: user.id,
      phoneNumber: user.phoneNumber,
      username: user.username,
    };
  }
}

