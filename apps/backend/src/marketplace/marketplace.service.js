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
exports.MarketplaceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MarketplaceService = class MarketplaceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(neighborhoodId, category, search, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const where = {
            isSold: false,
            expiresAt: {
                gt: new Date(),
            },
        };
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
        const [listings, total] = await Promise.all([
            this.prisma.marketplaceListing.findMany({
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
                    post: {
                        select: {
                            id: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.marketplaceListing.count({ where }),
        ]);
        return {
            listings: listings.map(listing => ({
                ...listing,
                images: JSON.parse(listing.images || '[]'),
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const listing = await this.prisma.marketplaceListing.findUnique({
            where: { id },
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
                post: {
                    include: {
                        likes: true,
                        comments: {
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
                            orderBy: { createdAt: 'desc' },
                            take: 10,
                        },
                    },
                },
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        return {
            ...listing,
            images: JSON.parse(listing.images || '[]'),
        };
    }
    async create(userId, createListingDto) {
        if (!createListingDto.images || createListingDto.images.length === 0) {
            throw new common_1.BadRequestException('At least one image is required');
        }
        if (createListingDto.images.length > 8) {
            throw new common_1.BadRequestException('Maximum 8 images allowed');
        }
        const post = await this.prisma.post.create({
            data: {
                type: 'MARKETPLACE',
                title: createListingDto.title,
                description: createListingDto.description,
                images: JSON.stringify(createListingDto.images),
                authorId: userId,
                neighborhoodId: createListingDto.neighborhoodId,
            },
        });
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        const listing = await this.prisma.marketplaceListing.create({
            data: {
                title: createListingDto.title,
                description: createListingDto.description,
                category: createListingDto.category,
                price: createListingDto.isFree ? null : createListingDto.price,
                isFree: createListingDto.isFree || false,
                condition: createListingDto.condition,
                images: JSON.stringify(createListingDto.images),
                pickupLocation: createListingDto.pickupLocation,
                deliveryAvailable: createListingDto.deliveryAvailable || false,
                expiresAt,
                postId: post.id,
                authorId: userId,
                neighborhoodId: createListingDto.neighborhoodId,
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
            ...listing,
            images: JSON.parse(listing.images || '[]'),
        };
    }
    async update(userId, id, updateData) {
        const listing = await this.prisma.marketplaceListing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own listings');
        }
        const data = {};
        if (updateData.title)
            data.title = updateData.title;
        if (updateData.description)
            data.description = updateData.description;
        if (updateData.price !== undefined)
            data.price = updateData.isFree ? null : updateData.price;
        if (updateData.isFree !== undefined)
            data.isFree = updateData.isFree;
        if (updateData.condition)
            data.condition = updateData.condition;
        if (updateData.images) {
            if (updateData.images.length > 8) {
                throw new common_1.BadRequestException('Maximum 8 images allowed');
            }
            data.images = JSON.stringify(updateData.images);
        }
        if (updateData.pickupLocation !== undefined)
            data.pickupLocation = updateData.pickupLocation;
        if (updateData.deliveryAvailable !== undefined)
            data.deliveryAvailable = updateData.deliveryAvailable;
        if (updateData.title || updateData.description) {
            await this.prisma.post.update({
                where: { id: listing.postId },
                data: {
                    ...(updateData.title && { title: updateData.title }),
                    ...(updateData.description && { description: updateData.description }),
                },
            });
        }
        const updated = await this.prisma.marketplaceListing.update({
            where: { id },
            data,
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
        return {
            ...updated,
            images: JSON.parse(updated.images || '[]'),
        };
    }
    async markAsSold(userId, id) {
        const listing = await this.prisma.marketplaceListing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only mark your own listings as sold');
        }
        return this.prisma.marketplaceListing.update({
            where: { id },
            data: {
                isSold: true,
                soldAt: new Date(),
            },
        });
    }
    async remove(userId, id) {
        const listing = await this.prisma.marketplaceListing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own listings');
        }
        await this.prisma.marketplaceListing.delete({
            where: { id },
        });
        return { message: 'Listing deleted successfully' };
    }
};
exports.MarketplaceService = MarketplaceService;
exports.MarketplaceService = MarketplaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MarketplaceService);
//# sourceMappingURL=marketplace.service.js.map