import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterDto, VerifyOtpDto, LoginDto, LoginPasswordDto } from './dto';
import { PasswordUtil } from '../common/utils/password.util';
import { AppConfigService } from '../config/config.service';
export declare class AuthService {
    private prisma;
    private usersService;
    private jwtService;
    private configService;
    private passwordUtil;
    constructor(prisma: PrismaService, usersService: UsersService, jwtService: JwtService, configService: AppConfigService, passwordUtil: PasswordUtil);
    register(registerDto: RegisterDto): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    registerWithOtp(registerDto: RegisterDto): Promise<{
        userId: string;
        message: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    loginWithPassword(loginPasswordDto: LoginPasswordDto): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string, refreshToken?: string): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<any>;
    private generateTokens;
    private generateOtp;
}
