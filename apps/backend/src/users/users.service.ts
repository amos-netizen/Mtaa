import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { PasswordUtil } from '../common/utils/password.util';

/**
 * Users Service
 * Handles user CRUD operations and profile management
 */
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordUtil: PasswordUtil
  ) {}

  /**
   * Create a new user
   */
  async create(createUserDto: CreateUserDto) {
    // Check if phone number exists
    const existingPhone = await this.prisma.user.findUnique({
      where: { phoneNumber: createUserDto.phoneNumber },
    });

    if (existingPhone) {
      throw new ConflictException('User with this phone number already exists');
    }

    // Check if username exists
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (existingUsername) {
      throw new ConflictException('Username is already taken');
    }

    // Check if email exists (if provided)
    if (createUserDto.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Email is already registered');
      }
    }

    // Hash password
    const passwordHash = await this.passwordUtil.hashPassword(createUserDto.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        passwordHash,
      },
    });

    return this.sanitizeUser(user);
  }

  /**
   * Find all users (with pagination)
   */
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          phoneNumber: true,
          email: true,
          fullName: true,
          username: true,
          profileImageUrl: true,
          bio: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find user by ID
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userNeighborhoods: {
          include: {
            neighborhood: {
              select: {
                id: true,
                name: true,
                city: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Find user by phone number
   */
  async findByPhoneNumber(phoneNumber: string) {
    return this.prisma.user.findUnique({
      where: { phoneNumber },
    });
  }

  /**
   * Update user profile
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Check for conflicts if updating unique fields
    if (updateUserDto.username && updateUserDto.username !== existingUser.username) {
      const usernameExists = await this.prisma.user.findUnique({
        where: { username: updateUserDto.username },
      });

      if (usernameExists) {
        throw new ConflictException('Username is already taken');
      }
    }

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailExists) {
        throw new ConflictException('Email is already registered');
      }
    }

    // Update user
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return this.sanitizeUser(user);
  }

  /**
   * Update user password
   */
  async updatePassword(id: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.passwordHash) {
      throw new BadRequestException('Password not set');
    }

    // Verify old password
    const isOldPasswordValid = await this.passwordUtil.verifyPassword(
      oldPassword,
      user.passwordHash
    );

    if (!isOldPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await this.passwordUtil.hashPassword(newPassword);

    // Update password
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash: newPasswordHash },
    });

    return { message: 'Password updated successfully' };
  }

  /**
   * Delete user (soft delete by deactivating)
   */
  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Soft delete by deactivating
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'User deactivated successfully' };
  }

  /**
   * Remove sensitive data from user object
   */
  sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}

