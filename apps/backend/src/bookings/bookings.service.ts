import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all bookings for a user
   */
  async findAll(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    // Get bookings from comments where user is the author and post type is SERVICE
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
        status: 'PENDING', // Can be enhanced with actual booking status
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
   * Get a single booking
   */
  async findOne(userId: string, id: string) {
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
      throw new NotFoundException('Booking not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only view your own bookings');
    }

    return {
      id: comment.id,
      service: comment.post,
      message: comment.content,
      createdAt: comment.createdAt,
      status: 'PENDING',
    };
  }

  /**
   * Cancel a booking
   */
  async cancel(userId: string, id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Booking not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    await this.prisma.comment.delete({
      where: { id },
    });

    return { message: 'Booking cancelled successfully' };
  }

  /**
   * Update booking (reschedule)
   */
  async update(userId: string, id: string, data: { preferredDate?: string; preferredTime?: string; message?: string }) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Booking not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only update your own bookings');
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
}















