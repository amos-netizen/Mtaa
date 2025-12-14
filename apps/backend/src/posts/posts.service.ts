import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all posts
   */
  async findAll(page: number = 1, limit: number = 20, neighborhoodId?: string, category?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};
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

    // Add like count and comment count to each post
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
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
      })
    );

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

  /**
   * Get a single post
   */
  async findOne(id: string) {
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
      throw new NotFoundException('Post not found');
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

  /**
   * Create a new post
   */
  async create(
    userId: string,
    data: {
      title: string;
      description: string;
      neighborhoodId: string;
      category?: string;
      type?: string;
      images?: string[];
      videos?: string[];
      isAnonymous?: boolean;
    }
  ) {
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

  /**
   * Update a post
   */
  async update(
    userId: string,
    id: string,
    data: {
      title?: string;
      description?: string;
      category?: string;
      images?: string[];
      videos?: string[];
    }
  ) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.images !== undefined) updateData.images = JSON.stringify(data.images);
    if (data.videos !== undefined) updateData.videos = JSON.stringify(data.videos);

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

  /**
   * Delete a post
   */
  async remove(userId: string, id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return { message: 'Post deleted successfully' };
  }

  /**
   * Get comments for a post
   */
  async getComments(postId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: {
          postId,
          parentId: null, // Only top-level comments
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

  /**
   * Create a comment
   */
  async createComment(userId: string, postId: string, content: string, parentId?: string) {
    // Verify post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // If parentId is provided, verify parent comment exists
    if (parentId) {
      const parent = await this.prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parent || parent.postId !== postId) {
        throw new NotFoundException('Parent comment not found');
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

    // Note: Post model doesn't have commentCount field, we calculate it dynamically

    return comment;
  }

  /**
   * Update comment (author only)
   */
  async updateComment(userId: string, commentId: string, content: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
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

  /**
   * Delete comment (author only)
   */
  async deleteComment(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    // Note: Post model doesn't have commentCount field, we calculate it dynamically

    return { message: 'Comment deleted successfully' };
  }

  /**
   * Like/unlike a post
   */
  async toggleLike(userId: string, postId: string) {
    const existingLike = await this.prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await this.prisma.like.delete({
        where: { id: existingLike.id },
      });

      // Note: Post model doesn't have likeCount field, we calculate it dynamically

      return { liked: false };
    } else {
      // Like
      await this.prisma.like.create({
        data: {
          postId,
          userId,
        },
      });

      // Note: Post model doesn't have likeCount field, we calculate it dynamically

      return { liked: true };
    }
  }
}

