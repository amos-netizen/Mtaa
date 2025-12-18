import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreatePlaceDto {
  name: string;
  category: string;
  description?: string;
  address?: string;
  latitude: number;
  longitude: number;
  phoneNumber?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  neighborhoodId?: string;
}

export interface UpdatePlaceDto {
  name?: string;
  category?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phoneNumber?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  neighborhoodId?: string;
  verified?: boolean;
}

@Injectable()
export class PlacesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find places near a location
   */
  async findNearby(params: {
    latitude: number;
    longitude: number;
    radiusKm?: number;
    category?: string;
    searchQuery?: string;
    limit?: number;
    offset?: number;
  }) {
    const {
      latitude,
      longitude,
      radiusKm = 5,
      category,
      searchQuery,
      limit = 50,
      offset = 0,
    } = params;

    // Calculate bounding box for initial filtering
    const latDelta = radiusKm / 111.32;
    const lonDelta = radiusKm / (111.32 * Math.cos((latitude * Math.PI) / 180));

    const minLat = latitude - latDelta;
    const maxLat = latitude + latDelta;
    const minLon = longitude - lonDelta;
    const maxLon = longitude + lonDelta;

    // Build where clause
    const where: any = {
      latitude: { gte: minLat, lte: maxLat },
      longitude: { gte: minLon, lte: maxLon },
    };

    if (category) {
      where.category = category;
    }

    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { address: { contains: searchQuery, mode: 'insensitive' } },
        { category: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    const places = await this.prisma.place.findMany({
      where,
      include: {
        neighborhood: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: limit * 2, // Get more to filter by distance
      skip: offset,
    });

    // Calculate distance and filter by radius
    const placesWithDistance = places
      .map((place) => {
        const distance = this.calculateDistance(
          latitude,
          longitude,
          place.latitude,
          place.longitude,
        );
        return { ...place, distance };
      })
      .filter((place) => place.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .slice(offset, offset + limit);

    return {
      places: placesWithDistance,
      total: placesWithDistance.length,
    };
  }

  /**
   * Get all places with filters
   */
  async findAll(params: {
    category?: string;
    searchQuery?: string;
    neighborhoodId?: string;
    limit?: number;
    offset?: number;
  }) {
    const {
      category,
      searchQuery,
      neighborhoodId,
      limit = 50,
      offset = 0,
    } = params;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (neighborhoodId) {
      where.neighborhoodId = neighborhoodId;
    }

    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { address: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    const [places, total] = await Promise.all([
      this.prisma.place.findMany({
        where,
        include: {
          neighborhood: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.place.count({ where }),
    ]);

    return {
      places,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get a single place by ID
   */
  async findOne(id: string) {
    return this.prisma.place.findUnique({
      where: { id },
      include: {
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
   * Create a new place
   */
  async create(data: CreatePlaceDto, userId?: string) {
    return this.prisma.place.create({
      data: {
        ...data,
        addedById: userId,
      },
      include: {
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
   * Update a place
   */
  async update(id: string, data: UpdatePlaceDto) {
    return this.prisma.place.update({
      where: { id },
      data,
      include: {
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
   * Delete a place
   */
  async delete(id: string) {
    return this.prisma.place.delete({
      where: { id },
    });
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

