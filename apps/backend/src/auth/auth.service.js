"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
const password_util_1 = require("../common/utils/password.util");
const config_service_1 = require("../config/config.service");
let AuthService = class AuthService {
    prisma;
    usersService;
    jwtService;
    configService;
    passwordUtil;
    constructor(prisma, usersService, jwtService, configService, passwordUtil) {
        this.prisma = prisma;
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.passwordUtil = passwordUtil;
    }
    async register(registerDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { phoneNumber: registerDto.phoneNumber },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this phone number already exists');
        }
        if (registerDto.email) {
            const existingEmail = await this.prisma.user.findUnique({
                where: { email: registerDto.email },
            });
            if (existingEmail) {
                throw new common_1.ConflictException('User with this email already exists');
            }
        }
        const existingUsername = await this.prisma.user.findUnique({
            where: { username: registerDto.username },
        });
        if (existingUsername) {
            throw new common_1.ConflictException('Username is already taken');
        }
        const passwordHash = await this.passwordUtil.hashPassword(registerDto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    phoneNumber: registerDto.phoneNumber,
                    fullName: registerDto.fullName,
                    username: registerDto.username,
                    passwordHash,
                    address: registerDto.address || undefined,
                    email: registerDto.email || undefined,
                    verificationStatus: 'verified',
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
            const tokens = await this.generateTokens(user.id);
            return {
                ...tokens,
                user: this.usersService.sanitizeUser(user),
            };
        }
        catch (error) {
            console.error('Registration error:', error);
            if (error.code === 'P2002') {
                const field = error.meta?.target?.[0];
                if (field === 'email') {
                    throw new common_1.ConflictException('User with this email already exists');
                }
                else if (field === 'phoneNumber') {
                    throw new common_1.ConflictException('User with this phone number already exists');
                }
                else if (field === 'username') {
                    throw new common_1.ConflictException('Username is already taken');
                }
            }
            if (error.code === 'P2003') {
                throw new common_1.BadRequestException('Invalid neighborhood ID provided');
            }
            throw new common_1.BadRequestException(error.message || 'Registration failed');
        }
    }
    async registerWithOtp(registerDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { phoneNumber: registerDto.phoneNumber },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this phone number already exists');
        }
        const existingUsername = await this.prisma.user.findUnique({
            where: { username: registerDto.username },
        });
        if (existingUsername) {
            throw new common_1.ConflictException('Username is already taken');
        }
        const otpCode = this.generateOtp();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);
        await this.prisma.otpCode.create({
            data: {
                phoneNumber: registerDto.phoneNumber,
                code: otpCode,
                purpose: 'registration',
                expiresAt,
            },
        });
        console.log(`[DEV] OTP for ${registerDto.phoneNumber}: ${otpCode}`);
        const user = await this.prisma.user.create({
            data: {
                phoneNumber: registerDto.phoneNumber,
                fullName: registerDto.fullName,
                username: registerDto.username,
                passwordHash: '',
                address: registerDto.address || undefined,
                email: registerDto.email || undefined,
                verificationStatus: 'pending',
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
    async verifyOtp(verifyOtpDto) {
        const { phoneNumber, email, otpCode } = verifyOtpDto;
        if (!phoneNumber && !email) {
            throw new common_1.BadRequestException('Either phone number or email is required');
        }
        let user;
        if (phoneNumber) {
            user = await this.prisma.user.findUnique({
                where: { phoneNumber },
            });
        }
        else if (email) {
            user = await this.prisma.user.findUnique({
                where: { email },
            });
        }
        if (!user) {
            throw new common_1.BadRequestException('User not found. Please register first.');
        }
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
            throw new common_1.UnauthorizedException('Invalid or expired OTP');
        }
        await this.prisma.otpCode.update({
            where: { id: otp.id },
            data: { isUsed: true },
        });
        if (user.verificationStatus === 'pending') {
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: { verificationStatus: 'verified' },
            });
        }
        const tokens = await this.generateTokens(user.id);
        return {
            ...tokens,
            user: this.usersService.sanitizeUser(user),
        };
    }
    async loginWithPassword(loginPasswordDto) {
        const { email, password } = loginPasswordDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        if (user.isBanned) {
            throw new common_1.UnauthorizedException('Account is banned');
        }
        if (!user.passwordHash) {
            throw new common_1.UnauthorizedException('Password not set. Please use OTP login.');
        }
        const isPasswordValid = await this.passwordUtil.verifyPassword(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastSeenAt: new Date() },
        });
        const tokens = await this.generateTokens(user.id);
        return {
            ...tokens,
            user: this.usersService.sanitizeUser(user),
        };
    }
    async login(loginDto) {
        const { phoneNumber, email } = loginDto;
        if (!phoneNumber && !email) {
            throw new common_1.BadRequestException('Either phone number or email is required');
        }
        let user;
        if (phoneNumber) {
            user = await this.prisma.user.findUnique({
                where: { phoneNumber },
            });
        }
        else if (email) {
            user = await this.prisma.user.findUnique({
                where: { email },
            });
        }
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const otpCode = this.generateOtp();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);
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
        if (phoneNumber) {
            console.log(`[DEV] Login OTP for phone ${phoneNumber}: ${otpCode}`);
        }
        else if (email) {
            console.log(`[DEV] Login OTP for email ${email}: ${otpCode}`);
        }
        return {
            message: phoneNumber
                ? 'OTP sent to your phone number'
                : 'OTP sent to your email address',
        };
    }
    async refreshToken(refreshToken) {
        const token = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });
        if (!token) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        if (token.expiresAt < new Date()) {
            await this.prisma.refreshToken.delete({
                where: { id: token.id },
            });
            throw new common_1.UnauthorizedException('Refresh token expired');
        }
        if (!token.user.isActive || token.user.isBanned) {
            throw new common_1.UnauthorizedException('User account is inactive or banned');
        }
        await this.prisma.refreshToken.delete({
            where: { id: token.id },
        });
        return this.generateTokens(token.userId);
    }
    async logout(userId, refreshToken) {
        if (refreshToken) {
            await this.prisma.refreshToken.deleteMany({
                where: {
                    userId,
                    token: refreshToken,
                },
            });
        }
        else {
            await this.prisma.refreshToken.deleteMany({
                where: { userId },
            });
        }
        return { message: 'Logged out successfully' };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return this.usersService.sanitizeUser(user);
    }
    async generateTokens(userId) {
        const payload = { sub: userId };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.jwtSecret,
            expiresIn: this.configService.jwtExpiresIn,
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.jwtRefreshSecret,
            expiresIn: this.configService.jwtRefreshExpiresIn,
        });
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
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
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService,
        jwt_1.JwtService,
        config_service_1.AppConfigService,
        password_util_1.PasswordUtil])
], AuthService);
//# sourceMappingURL=auth.service.js.map