import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterDto, VerifyOtpDto, LoginDto, LoginPasswordDto } from './dto';
import { PasswordUtil } from '../common/utils/password.util';
import { AppConfigService } from '../config/config.service';

/**
 * Authentication Service
 * Handles user registration, login, token management, and OTP verification
 */
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: AppConfigService,
    private passwordUtil: PasswordUtil
  ) {}

  /**
   * Register a new user with password
   * Creates user account and returns tokens immediately
   */
  async register(registerDto: RegisterDto) {
    // Check if user exists by phone number
    const existingUser = await this.prisma.user.findUnique({
      where: { phoneNumber: registerDto.phoneNumber },
    });

    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }

    // Check if email is already taken (if provided)
    if (registerDto.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Check if username is taken
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: registerDto.username },
    });

    if (existingUsername) {
      throw new ConflictException('Username is already taken');
    }

    // Hash password
    const passwordHash = await this.passwordUtil.hashPassword(registerDto.password);

    // Create user
    try {
      const user = await this.prisma.user.create({
        data: {
          phoneNumber: registerDto.phoneNumber,
          fullName: registerDto.fullName,
          username: registerDto.username,
          passwordHash,
          address: registerDto.address || undefined,
          email: registerDto.email || undefined,
          verificationStatus: 'verified', // Auto-verify for password-based registration
          // If neighborhoodId is provided, create UserNeighborhood relation
          ...(registerDto.neighborhoodId && {
            userNeighborhoods: {
              create: {
                neighborhoodId: registerDto.neighborhoodId,
                isPrimary: true,
              },
            },
          }),
        },
      });

      // Generate tokens
      const tokens = await this.generateTokens(user.id);

      return {
        ...tokens,
        user: this.usersService.sanitizeUser(user),
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      // Handle Prisma unique constraint errors
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0];
        if (field === 'email') {
          throw new ConflictException('User with this email already exists');
        } else if (field === 'phoneNumber') {
          throw new ConflictException('User with this phone number already exists');
        } else if (field === 'username') {
          throw new ConflictException('Username is already taken');
        }
      }
      // Handle foreign key constraint errors (e.g., invalid neighborhoodId)
      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid neighborhood ID provided');
      }
      // Re-throw with more context
      throw new BadRequestException(error.message || 'Registration failed');
    }
  }

  /**
   * Register with OTP (alternative method)
   * Sends OTP via SMS for phone verification
   */
  async registerWithOtp(registerDto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { phoneNumber: registerDto.phoneNumber },
    });

    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }

    // Check if username is taken
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: registerDto.username },
    });

    if (existingUsername) {
      throw new ConflictException('Username is already taken');
    }

    // Generate OTP
    const otpCode = this.generateOtp();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // Store OTP
    await this.prisma.otpCode.create({
      data: {
        phoneNumber: registerDto.phoneNumber,
        code: otpCode,
        purpose: 'registration',
        expiresAt,
      },
    });

    // TODO: Send OTP via SMS service (Safaricom API)
    console.log(`[DEV] OTP for ${registerDto.phoneNumber}: ${otpCode}`);

    // Create user (pending verification)
    const user = await this.prisma.user.create({
      data: {
        phoneNumber: registerDto.phoneNumber,
        fullName: registerDto.fullName,
        username: registerDto.username,
        passwordHash: '', // Will be set after OTP verification
        address: registerDto.address || undefined,
        email: registerDto.email || undefined,
        verificationStatus: 'pending',
        // If neighborhoodId is provided, create UserNeighborhood relation
        ...(registerDto.neighborhoodId && {
          userNeighborhoods: {
            create: {
              neighborhoodId: registerDto.neighborhoodId,
              isPrimary: true,
            },
          },
        }),
      },
    });

    return {
      userId: user.id,
      message: 'OTP sent to your phone number',
    };
  }

  /**
   * Verify OTP and complete registration/login
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { phoneNumber, email, otpCode } = verifyOtpDto;

    if (!phoneNumber && !email) {
      throw new BadRequestException('Either phone number or email is required');
    }

    // Find user first to get their phone number (OTP is stored with phoneNumber)
    let user;
    if (phoneNumber) {
      user = await this.prisma.user.findUnique({
        where: { phoneNumber },
      });
    } else if (email) {
      user = await this.prisma.user.findUnique({
        where: { email },
      });
    }

    if (!user) {
      throw new BadRequestException('User not found. Please register first.');
    }

    // Find valid OTP - OTP is always stored with phoneNumber
    const otpPhoneNumber = phoneNumber || user.phoneNumber;
    const otp = await this.prisma.otpCode.findFirst({
      where: {
        phoneNumber: otpPhoneNumber,
        code: otpCode,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Mark OTP as used
    await this.prisma.otpCode.update({
      where: { id: otp.id },
      data: { isUsed: true },
    });

    // Update user verification status
    if (user.verificationStatus === 'pending') {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { verificationStatus: 'verified' },
      });
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    return {
      ...tokens,
      user: this.usersService.sanitizeUser(user),
    };
  }

  /**
   * Login with password
   * Validates credentials and returns tokens
   */
  async loginWithPassword(loginPasswordDto: LoginPasswordDto) {
    const { email, password } = loginPasswordDto;

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Check if user is banned
    if (user.isBanned) {
      throw new UnauthorizedException('Account is banned');
    }

    // Verify password
    if (!user.passwordHash) {
      throw new UnauthorizedException('Password not set. Please use OTP login.');
    }

    const isPasswordValid = await this.passwordUtil.verifyPassword(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last seen
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastSeenAt: new Date() },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    return {
      ...tokens,
      user: this.usersService.sanitizeUser(user),
    };
  }

  /**
   * Request login OTP (alternative login method)
   */
  async login(loginDto: LoginDto) {
    const { phoneNumber, email } = loginDto;

    if (!phoneNumber && !email) {
      throw new BadRequestException('Either phone number or email is required');
    }

    // Check if user exists
    let user;
    if (phoneNumber) {
      user = await this.prisma.user.findUnique({
        where: { phoneNumber },
      });
    } else if (email) {
      user = await this.prisma.user.findUnique({
        where: { email },
      });
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate OTP
    const otpCode = this.generateOtp();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // Store OTP - use phoneNumber if available, otherwise use email
    const otpPhoneNumber = phoneNumber || user.phoneNumber;
    await this.prisma.otpCode.create({
      data: {
        phoneNumber: otpPhoneNumber,
        code: otpCode,
        purpose: 'login',
        expiresAt,
        userId: user.id,
      },
    });

    // TODO: Send OTP via SMS or Email
    if (phoneNumber) {
      console.log(`[DEV] Login OTP for phone ${phoneNumber}: ${otpCode}`);
    } else if (email) {
      console.log(`[DEV] Login OTP for email ${email}: ${otpCode}`);
    }

    return {
      message: phoneNumber 
        ? 'OTP sent to your phone number' 
        : 'OTP sent to your email address',
    };
  }

  /**
   * Refresh access token
   * Validates refresh token and issues new access/refresh tokens
   */
  async refreshToken(refreshToken: string) {
    // Find refresh token
    const token = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (token.expiresAt < new Date()) {
      // Delete expired token
      await this.prisma.refreshToken.delete({
        where: { id: token.id },
      });
      throw new UnauthorizedException('Refresh token expired');
    }

    // Check if user is still active
    if (!token.user.isActive || token.user.isBanned) {
      throw new UnauthorizedException('User account is inactive or banned');
    }

    // Delete old refresh token (token rotation)
    await this.prisma.refreshToken.delete({
      where: { id: token.id },
    });

    // Generate new tokens
    return this.generateTokens(token.userId);
  }

  /**
   * Logout
   * Invalidates refresh token
   */
  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      // Delete specific refresh token
      await this.prisma.refreshToken.deleteMany({
        where: {
          userId,
          token: refreshToken,
        },
      });
    } else {
      // Delete all refresh tokens for user (logout from all devices)
      await this.prisma.refreshToken.deleteMany({
        where: { userId },
      });
    }

    return { message: 'Logged out successfully' };
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.usersService.sanitizeUser(user);
  }

  /**
   * Generate JWT tokens (access + refresh)
   * Stores refresh token in database for validation
   */
  private async generateTokens(userId: string) {
    const payload = { sub: userId };

    // Generate access token
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.jwtSecret,
      expiresIn: this.configService.jwtExpiresIn,
    });

    // Generate refresh token
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.jwtRefreshSecret,
      expiresIn: this.configService.jwtRefreshExpiresIn,
    });

    // Calculate expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Store refresh token in database
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Generate 6-digit OTP
   */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
