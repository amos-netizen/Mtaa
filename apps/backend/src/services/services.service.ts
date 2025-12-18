import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class ServicesService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService
  ) {}

  /**
   * Get all service listings
   */
  async findAll(page: number = 1, limit: number = 20, neighborhoodId?: string, search?: string, category?: string) {
    const skip = (page - 1) * limit;
    const where: any = { type: 'SERVICE' };

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

  /**
   * Get a single service
   */
  async findOne(id: string) {
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
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  /**
   * Create a new service listing
   */
  async create(
    userId: string,
    data: {
      title: string;
      description: string;
      neighborhoodId: string;
      category?: string;
      images?: string[];
      price?: number;
      serviceType?: string;
    }
  ) {
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

  /**
   * Book a service (creates a comment as booking request)
   */
  async book(
    userId: string,
    serviceId: string,
    bookingData: {
      preferredDate?: string;
      preferredTime?: string;
      message: string;
    }
  ) {
    const service = await this.prisma.post.findUnique({
      where: { id: serviceId },
    });

    if (!service || service.type !== 'SERVICE') {
      throw new NotFoundException('Service not found');
    }

    // Get service provider details
    const serviceWithProvider = await this.prisma.post.findUnique({
      where: { id: serviceId },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    if (!serviceWithProvider) {
      throw new NotFoundException('Service not found');
    }

    // Get customer details
    const customer = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    // Create booking request as a comment
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

    // Send email notification to service provider (async, non-blocking)
    if (serviceWithProvider.author.email && customer) {
      this.emailService.sendEmailAsync(
        () => this.emailService.sendServiceBookingEmail(
          serviceWithProvider.author.email!,
          serviceWithProvider.title,
          customer.fullName,
          bookingData.message,
          bookingData.preferredDate,
          bookingData.preferredTime
        ),
        'Service Booking Notification'
      );
    }

    return booking;
  }
}















