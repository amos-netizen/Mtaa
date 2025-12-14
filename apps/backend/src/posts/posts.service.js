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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PostsService = class PostsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20, neighborhoodId, category) {
        const skip = (page - 1) * limit;
        const where = {};
        if (neighborhoodId) {
            where.neighborhoodId = neighborhoodId;
        }
        if (category) {
            where.category = category;
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
                    _count: {
                        select: {
                            likes: true,
                            comments: true,
                        },
                    },
                },
                orderBy: [
                    { isPinned: 'desc' },
                    { createdAt: 'desc' },
                ],
                skip,
                take: limit,
            }),
            this.prisma.post.count({ where }),
        ]);
        const postsWithCounts = await Promise.all(posts.map(async (post) => {
            const likeCount = await this.prisma.like.count({
                where: { postId: post.id },
            });
            const commentCount = await this.prisma.comment.count({
                where: { postId: post.id },
            });
            return {
                ...post,
                likeCount,
                commentCount,
            };
        }));
        return {
            posts: postsWithCounts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const post = await this.prisma.post.findUnique({
            where: { id },
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
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const likeCount = await this.prisma.like.count({
            where: { postId: post.id },
        });
        const commentCount = await this.prisma.comment.count({
            where: { postId: post.id },
        });
        return {
            ...post,
            likeCount,
            commentCount,
        };
    }
    async create(userId, data) {
        const post = await this.prisma.post.create({
            data: {
                title: data.title,
                description: data.description,
                neighborhoodId: data.neighborhoodId,
                authorId: userId,
                category: data.category || null,
                type: data.type || 'GENERAL',
                images: data.images ? JSON.stringify(data.images) : null,
                videos: data.videos ? JSON.stringify(data.videos) : null,
                isAnonymous: data.isAnonymous || false,
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
        return {
            ...post,
            likeCount: 0,
            commentCount: 0,
        };
    }
    async update(userId, id, data) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (post.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only edit your own posts');
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
        if (data.videos !== undefined)
            updateData.videos = JSON.stringify(data.videos);
        const updatedPost = await this.prisma.post.update({
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
        const likeCount = await this.prisma.like.count({
            where: { postId: updatedPost.id },
        });
        const commentCount = await this.prisma.comment.count({
            where: { postId: updatedPost.id },
        });
        return {
            ...updatedPost,
            likeCount,
            commentCount,
        };
    }
    async remove(userId, id) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (post.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own posts');
        }
        await this.prisma.post.delete({
            where: { id },
        });
        return { message: 'Post deleted successfully' };
    }
    async getComments(postId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [comments, total] = await Promise.all([
            this.prisma.comment.findMany({
                where: {
                    postId,
                    parentId: null,
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
                    replies: {
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
                        orderBy: { createdAt: 'asc' },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.comment.count({
                where: {
                    postId,
                    parentId: null,
                },
            }),
        ]);
        return {
            comments,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async createComment(userId, postId, content, parentId) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (parentId) {
            const parent = await this.prisma.comment.findUnique({
                where: { id: parentId },
            });
            if (!parent || parent.postId !== postId) {
                throw new common_1.NotFoundException('Parent comment not found');
            }
        }
        const comment = await this.prisma.comment.create({
            data: {
                content,
                postId,
                authorId: userId,
                parentId: parentId || null,
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
        return comment;
    }
    async updateComment(userId, commentId, content) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        if (comment.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only edit your own comments');
        }
        return this.prisma.comment.update({
            where: { id: commentId },
            data: {
                content,
                isEdited: true,
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
    }
    async deleteComment(userId, commentId) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        if (comment.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own comments');
        }
        await this.prisma.comment.delete({
            where: { id: commentId },
        });
        return { message: 'Comment deleted successfully' };
    }
    async toggleLike(userId, postId) {
        const existingLike = await this.prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
        });
        if (existingLike) {
            await this.prisma.like.delete({
                where: { id: existingLike.id },
            });
            return { liked: false };
        }
        else {
            await this.prisma.like.create({
                data: {
                    postId,
                    userId,
                },
            });
            return { liked: true };
        }
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map