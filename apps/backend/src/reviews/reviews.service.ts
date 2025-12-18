import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a review
   */
  async create(
    userId: string,
    data: {
      targetId: string;
      targetType: 'MARKETPLACE' | 'SERVICE' | 'PROVIDER' | 'JOB_EMPLOYER';
      rating: number;
      comment?: string;
      isVerified?: boolean;
    }
  ) {
    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Check if user already reviewed this target
    const existingReview = await this.prisma.review.findUnique({
      where: {
        authorId_targetId_targetType: {
          authorId: userId,
          targetId: data.targetId,
          targetType: data.targetType,
        },
      },
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this item');
    }

    // Verify target exists based on type
    await this.verifyTargetExists(data.targetId, data.targetType);

    // Create review
    const review = await this.prisma.review.create({
      data: {
        targetId: data.targetId,
        targetType: data.targetType,
        rating: data.rating,
        comment: data.comment,
        isVerified: data.isVerified || false,
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

    return review;
  }

  /**
   * Get reviews for a target
   */
  async getReviews(targetId: string, targetType: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: {
          targetId,
          targetType,
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({
        where: {
          targetId,
          targetType,
        },
      }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get average rating for a target
   */
  async getAverageRating(targetId: string, targetType: string) {
    const result = await this.prisma.review.aggregate({
      where: {
        targetId,
        targetType,
      },
      _avg: {
        rating: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      averageRating: result._avg.rating || 0,
      totalReviews: result._count.id || 0,
    };
  }

  /**
   * Update a review
   */
  async update(userId: string, reviewId: string, data: { rating?: number; comment?: string }) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.authorId !== userId) {
      throw new BadRequestException('You can only update your own reviews');
    }

    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(data.rating && { rating: data.rating }),
        ...(data.comment !== undefined && { comment: data.comment }),
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

    return updated;
  }

  /**
   * Delete a review
   */
  async delete(userId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.authorId !== userId) {
      throw new BadRequestException('You can only delete your own reviews');
    }

    await this.prisma.review.delete({
      where: { id: reviewId },
    });

    return { message: 'Review deleted successfully' };
  }

  /**
   * Verify that the target exists
   */
  private async verifyTargetExists(targetId: string, targetType: string) {
    switch (targetType) {
      case 'MARKETPLACE':
        const listing = await this.prisma.marketplaceListing.findUnique({
          where: { id: targetId },
        });
        if (!listing) {
          throw new NotFoundException('Marketplace listing not found');
        }
        break;
      case 'SERVICE':
        const service = await this.prisma.recommendation.findUnique({
          where: { id: targetId },
        });
        if (!service) {
          throw new NotFoundException('Service not found');
        }
        break;
      case 'PROVIDER':
      case 'JOB_EMPLOYER':
        const user = await this.prisma.user.findUnique({
          where: { id: targetId },
        });
        if (!user) {
          throw new NotFoundException('User not found');
        }
        break;
      default:
        throw new BadRequestException('Invalid target type');
    }
  }
}

