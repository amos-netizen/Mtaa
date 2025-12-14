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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ServicesService = class ServicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20, neighborhoodId, search, category) {
        const skip = (page - 1) * limit;
        const where = { type: 'SERVICE' };
        if (neighborhoodId) {
            where.neighborhoodId = neighborhoodId;
        }
        if (category) {
            where.category = category;
        }
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
            ];
        }
        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
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
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.post.count({ where }),
        ]);
        return {
            services: posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const service = await this.prisma.post.findUnique({
            where: { id },
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
        });
        if (!service || service.type !== 'SERVICE') {
            throw new common_1.NotFoundException('Service not found');
        }
        return service;
    }
    async create(userId, data) {
        const service = await this.prisma.post.create({
            data: {
                title: data.title,
                description: data.description,
                neighborhoodId: data.neighborhoodId,
                authorId: userId,
                type: 'SERVICE',
                category: data.category || 'ANNOUNCEMENT',
                images: data.images ? JSON.stringify(data.images) : null,
            },
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
        });
        return service;
    }
    async book(userId, serviceId, bookingData) {
        const service = await this.prisma.post.findUnique({
            where: { id: serviceId },
        });
        if (!service || service.type !== 'SERVICE') {
            throw new common_1.NotFoundException('Service not found');
        }
        const booking = await this.prisma.comment.create({
            data: {
                content: `Booking Request: ${bookingData.message}${bookingData.preferredDate ? `\nPreferred Date: ${bookingData.preferredDate}` : ''}${bookingData.preferredTime ? `\nPreferred Time: ${bookingData.preferredTime}` : ''}`,
                postId: serviceId,
                authorId: userId,
            },
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
            },
        });
        return booking;
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map