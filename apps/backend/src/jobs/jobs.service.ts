import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all job listings
   */
  async findAll(page: number = 1, limit: number = 20, neighborhoodId?: string, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { type: 'JOB' };

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

  /**
   * Get a single job
   */
  async findOne(id: string) {
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
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  /**
   * Create a new job posting
   */
  async create(
    userId: string,
    data: {
      title: string;
      description: string;
      neighborhoodId: string;
      category?: string;
      images?: string[];
      salary?: string;
      jobType?: string; // FULL_TIME, PART_TIME, CONTRACT
    }
  ) {
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

  /**
   * Update a job posting
   */
  async update(
    userId: string,
    id: string,
    data: {
      title?: string;
      description?: string;
      category?: string;
      images?: string[];
    }
  ) {
    const job = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!job || job.type !== 'JOB') {
      throw new NotFoundException('Job not found');
    }

    if (job.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own job postings');
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.images !== undefined) updateData.images = JSON.stringify(data.images);

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

  /**
   * Delete a job posting
   */
  async remove(userId: string, id: string) {
    const job = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!job || job.type !== 'JOB') {
      throw new NotFoundException('Job not found');
    }

    if (job.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own job postings');
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return { message: 'Job posting deleted successfully' };
  }

  /**
   * Apply for a job (creates a comment as application)
   */
  async apply(userId: string, jobId: string, applicationData: { coverLetter: string; resumeUrl?: string }) {
    const job = await this.prisma.post.findUnique({
      where: { id: jobId },
    });

    if (!job || job.type !== 'JOB') {
      throw new NotFoundException('Job not found');
    }

    // Create application as a comment
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
}






