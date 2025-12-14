import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NeighborhoodsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all neighborhoods with optional filters
   */
  async findAll(city?: string, search?: string) {
    const where: any = {
      isActive: true,
    };

    if (city) {
      where.city = city;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const neighborhoods = await this.prisma.neighborhood.findMany({
      where,
      orderBy: [
        { city: 'asc' },
        { name: 'asc' },
      ],
    });

    return {
      neighborhoods,
    };
  }

  /**
   * Get a single neighborhood by ID
   */
  async findOne(id: string) {
    const neighborhood = await this.prisma.neighborhood.findUnique({
      where: { id },
    });

    if (!neighborhood) {
      throw new NotFoundException('Neighborhood not found');
    }

    return neighborhood;
  }
}

