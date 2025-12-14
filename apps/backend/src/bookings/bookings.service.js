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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookingsService = class BookingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [comments, total] = await Promise.all([
            this.prisma.comment.findMany({
                where: {
                    authorId: userId,
                    post: {
                        type: 'SERVICE',
                    },
                },
                include: {
                    post: {
                        include: {
                            author: {
                                select: {
                                    id: true,
                                    username: true,
                                    fullName: true,
                                    profileImageUrl: true,
                                    phoneNumber: true,
                                },
                            },
                            neighborhood: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.comment.count({
                where: {
                    authorId: userId,
                    post: {
                        type: 'SERVICE',
                    },
                },
            }),
        ]);
        return {
            bookings: comments.map(comment => ({
                id: comment.id,
                service: comment.post,
                message: comment.content,
                createdAt: comment.createdAt,
                status: 'PENDING',
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(userId, id) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
            include: {
                post: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true,
                                profileImageUrl: true,
                                phoneNumber: true,
                                email: true,
                            },
                        },
                        neighborhood: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!comment || comment.post.type !== 'SERVICE') {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (comment.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only view your own bookings');
        }
        return {
            id: comment.id,
            service: comment.post,
            message: comment.content,
            createdAt: comment.createdAt,
            status: 'PENDING',
        };
    }
    async cancel(userId, id) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (comment.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only cancel your own bookings');
        }
        await this.prisma.comment.delete({
            where: { id },
        });
        return { message: 'Booking cancelled successfully' };
    }
    async update(userId, id, data) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (comment.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own bookings');
        }
        let content = comment.content;
        if (data.preferredDate || data.preferredTime || data.message) {
            content = `Booking Request: ${data.message || 'Updated booking'}${data.preferredDate ? `\nPreferred Date: ${data.preferredDate}` : ''}${data.preferredTime ? `\nPreferred Time: ${data.preferredTime}` : ''}`;
        }
        return this.prisma.comment.update({
            where: { id },
            data: {
                content,
                isEdited: true,
            },
            include: {
                post: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true,
                                profileImageUrl: true,
                            },
                        },
                    },
                },
            },
        });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map