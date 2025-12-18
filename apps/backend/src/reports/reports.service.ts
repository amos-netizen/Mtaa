import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a report
   */
  async create(
    userId: string,
    data: {
      postId?: string;
      reason: string;
      description?: string;
    }
  ) {
    if (!data.postId) {
      throw new BadRequestException('Post ID is required');
    }

    // Check if post exists
    const post = await this.prisma.post.findUnique({
      where: { id: data.postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user already reported this post
    const existingReport = await this.prisma.report.findFirst({
      where: {
        postId: data.postId,
        reportedById: userId,
      },
    });

    if (existingReport) {
      throw new BadRequestException('You have already reported this post');
    }

    // Create report
    const report = await this.prisma.report.create({
      data: {
        postId: data.postId,
        reportedById: userId,
        reason: data.reason,
        description: data.description,
        status: 'PENDING',
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
        reportedBy: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });

    // Check if post should be auto-hidden (5+ reports)
    const reportCount = await this.prisma.report.count({
      where: {
        postId: data.postId,
        status: { in: ['PENDING', 'REVIEWED'] },
      },
    });

    // Auto-hide if 5+ reports (could be enhanced with admin approval)
    if (reportCount >= 5) {
      // In a production system, you might want to notify admins
      // For now, we'll just mark it for review
    }

    return report;
  }

  /**
   * Get reports for a post
   */
  async getPostReports(postId: string) {
    const reports = await this.prisma.report.findMany({
      where: { postId },
      include: {
        reportedBy: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reports;
  }

  /**
   * Get all reports (admin only)
   */
  async getAllReports(status?: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        include: {
          post: {
            select: {
              id: true,
              title: true,
              type: true,
              author: {
                select: {
                  id: true,
                  username: true,
                  fullName: true,
                },
              },
            },
          },
          reportedBy: {
            select: {
              id: true,
              username: true,
              fullName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.report.count({ where }),
    ]);

    return {
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Resolve a report (admin only)
   */
  async resolveReport(
    adminId: string,
    reportId: string,
    action: 'warn' | 'ban' | 'dismiss',
    reason?: string
  ) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: {
        post: {
          include: {
            author: true,
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.status !== 'PENDING') {
      throw new BadRequestException('Report has already been resolved');
    }

    // Update report status
    const updatedReport = await this.prisma.report.update({
      where: { id: reportId },
      data: {
        status: action === 'dismiss' ? 'DISMISSED' : 'RESOLVED',
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
    });

    // Handle user actions
    if (report.post?.author) {
      const userId = report.post.author.id;

      if (action === 'ban') {
        // Ban user (permanent or temporary based on reason)
        const banExpiresAt = reason?.includes('temporary') 
          ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          : null;

        await this.prisma.user.update({
          where: { id: userId },
          data: {
            isBanned: true,
            banReason: reason || 'Violation of community guidelines',
            banExpiresAt,
          },
        });
      } else if (action === 'warn') {
        // For warnings, we could add a warning count or just log it
        // For now, we'll create a notification
        // This would be handled by the notifications service
      }
    }

    return updatedReport;
  }

  /**
   * Get report by ID
   */
  async getOne(reportId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                fullName: true,
                isBanned: true,
              },
            },
          },
        },
        reportedBy: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }
}

