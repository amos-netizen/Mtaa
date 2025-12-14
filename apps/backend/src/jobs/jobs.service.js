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
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let JobsService = class JobsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20, neighborhoodId, search) {
        const skip = (page - 1) * limit;
        const where = { type: 'JOB' };
        if (neighborhoodId) {
            where.neighborhoodId = neighborhoodId;
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
            jobs: posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const job = await this.prisma.post.findUnique({
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
        if (!job || job.type !== 'JOB') {
            throw new common_1.NotFoundException('Job not found');
        }
        return job;
    }
    async create(userId, data) {
        const job = await this.prisma.post.create({
            data: {
                title: data.title,
                description: data.description,
                neighborhoodId: data.neighborhoodId,
                authorId: userId,
                type: 'JOB',
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
        return job;
    }
    async update(userId, id, data) {
        const job = await this.prisma.post.findUnique({
            where: { id },
        });
        if (!job || job.type !== 'JOB') {
            throw new common_1.NotFoundException('Job not found');
        }
        if (job.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only edit your own job postings');
        }
        const updateData = {};
        if (data.title !== undefined)
            updateData.title = data.title;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.category !== undefined)
            updateData.category = data.category;
        if (data.images !== undefined)
            updateData.images = JSON.stringify(data.images);
        return this.prisma.post.update({
            where: { id },
            data: updateData,
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        profileImageUrl: true,
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
    }
    async remove(userId, id) {
        const job = await this.prisma.post.findUnique({
            where: { id },
        });
        if (!job || job.type !== 'JOB') {
            throw new common_1.NotFoundException('Job not found');
        }
        if (job.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own job postings');
        }
        await this.prisma.post.delete({
            where: { id },
        });
        return { message: 'Job posting deleted successfully' };
    }
    async apply(userId, jobId, applicationData) {
        const job = await this.prisma.post.findUnique({
            where: { id: jobId },
        });
        if (!job || job.type !== 'JOB') {
            throw new common_1.NotFoundException('Job not found');
        }
        const application = await this.prisma.comment.create({
            data: {
                content: `Application: ${applicationData.coverLetter}${applicationData.resumeUrl ? `\nResume: ${applicationData.resumeUrl}` : ''}`,
                postId: jobId,
                authorId: userId,
            },
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
        });
        return application;
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map