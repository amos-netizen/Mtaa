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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const password_util_1 = require("../common/utils/password.util");
let UsersService = class UsersService {
    prisma;
    passwordUtil;
    constructor(prisma, passwordUtil) {
        this.prisma = prisma;
        this.passwordUtil = passwordUtil;
    }
    async create(createUserDto) {
        const existingPhone = await this.prisma.user.findUnique({
            where: { phoneNumber: createUserDto.phoneNumber },
        });
        if (existingPhone) {
            throw new common_1.ConflictException('User with this phone number already exists');
        }
        const existingUsername = await this.prisma.user.findUnique({
            where: { username: createUserDto.username },
        });
        if (existingUsername) {
            throw new common_1.ConflictException('Username is already taken');
        }
        if (createUserDto.email) {
            const existingEmail = await this.prisma.user.findUnique({
                where: { email: createUserDto.email },
            });
            if (existingEmail) {
                throw new common_1.ConflictException('Email is already registered');
            }
        }
        const passwordHash = await this.passwordUtil.hashPassword(createUserDto.password);
        const user = await this.prisma.user.create({
            data: {
                ...createUserDto,
                passwordHash,
            },
        });
        return this.sanitizeUser(user);
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    phoneNumber: true,
                    email: true,
                    fullName: true,
                    username: true,
                    profileImageUrl: true,
                    bio: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            this.prisma.user.count(),
        ]);
        return {
            data: users,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                userNeighborhoods: {
                    include: {
                        neighborhood: {
                            select: {
                                id: true,
                                name: true,
                                city: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.sanitizeUser(user);
    }
    async findByPhoneNumber(phoneNumber) {
        return this.prisma.user.findUnique({
            where: { phoneNumber },
        });
    }
    async update(id, updateUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            throw new common_1.NotFoundException('User not found');
        }
        if (updateUserDto.username && updateUserDto.username !== existingUser.username) {
            const usernameExists = await this.prisma.user.findUnique({
                where: { username: updateUserDto.username },
            });
            if (usernameExists) {
                throw new common_1.ConflictException('Username is already taken');
            }
        }
        if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
            const emailExists = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email },
            });
            if (emailExists) {
                throw new common_1.ConflictException('Email is already registered');
            }
        }
        const user = await this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
        return this.sanitizeUser(user);
    }
    async updatePassword(id, oldPassword, newPassword) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (!user.passwordHash) {
            throw new common_1.BadRequestException('Password not set');
        }
        const isOldPasswordValid = await this.passwordUtil.verifyPassword(oldPassword, user.passwordHash);
        if (!isOldPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const newPasswordHash = await this.passwordUtil.hashPassword(newPassword);
        await this.prisma.user.update({
            where: { id },
            data: { passwordHash: newPasswordHash },
        });
        return { message: 'Password updated successfully' };
    }
    async remove(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.user.update({
            where: { id },
            data: { isActive: false },
        });
        return { message: 'User deactivated successfully' };
    }
    sanitizeUser(user) {
        const { passwordHash, ...sanitized } = user;
        return sanitized;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        password_util_1.PasswordUtil])
], UsersService);
//# sourceMappingURL=users.service.js.map