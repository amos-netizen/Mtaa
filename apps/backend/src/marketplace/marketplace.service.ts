import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';

@Injectable()
export class MarketplaceService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all marketplace listings with filters
   */
  async findAll(
    neighborhoodId?: string,
    category?: string,
    search?: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;

    const where: any = {
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
      // SQLite doesn't support case-insensitive mode, so we use contains
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
              city: true,
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

  /**
   * Get single listing by ID
   */
  async findOne(id: string) {
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
            email: true,
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
      throw new NotFoundException('Listing not found');
    }

    return {
      ...listing,
      images: JSON.parse(listing.images || '[]'),
    };
  }

  /**
   * Create a new marketplace listing
   */
  async create(userId: string, createListingDto: CreateListingDto) {
    // Validate images array
    if (!createListingDto.images || createListingDto.images.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    if (createListingDto.images.length > 8) {
      throw new BadRequestException('Maximum 8 images allowed');
    }

    // Create post first (marketplace listings require a post)
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

    // Calculate expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create marketplace listing
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

  /**
   * Update listing (owner only)
   */
  async update(userId: string, id: string, updateData: Partial<CreateListingDto>) {
    const listing = await this.prisma.marketplaceListing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.authorId !== userId) {
      throw new ForbiddenException('You can only update your own listings');
    }

    const data: any = {};
    if (updateData.title) data.title = updateData.title;
    if (updateData.description) data.description = updateData.description;
    if (updateData.price !== undefined) data.price = updateData.isFree ? null : updateData.price;
    if (updateData.isFree !== undefined) data.isFree = updateData.isFree;
    if (updateData.condition) data.condition = updateData.condition;
    if (updateData.images) {
      if (updateData.images.length > 8) {
        throw new BadRequestException('Maximum 8 images allowed');
      }
      data.images = JSON.stringify(updateData.images);
    }
    if (updateData.pickupLocation !== undefined) data.pickupLocation = updateData.pickupLocation;
    if (updateData.deliveryAvailable !== undefined) data.deliveryAvailable = updateData.deliveryAvailable;

    // Also update the associated post
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

  /**
   * Mark listing as sold
   */
  async markAsSold(userId: string, id: string) {
    const listing = await this.prisma.marketplaceListing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.authorId !== userId) {
      throw new ForbiddenException('You can only mark your own listings as sold');
    }

    return this.prisma.marketplaceListing.update({
      where: { id },
      data: {
        isSold: true,
        soldAt: new Date(),
      },
    });
  }

  /**
   * Delete listing (owner only)
   */
  async remove(userId: string, id: string) {
    const listing = await this.prisma.marketplaceListing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own listings');
    }

    // Delete listing (post will be cascade deleted)
    await this.prisma.marketplaceListing.delete({
      where: { id },
    });

    return { message: 'Listing deleted successfully' };
  }
}
