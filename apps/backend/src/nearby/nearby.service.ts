import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlacesService } from '../places/places.service';

// Haversine formula to calculate distance between two points
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Get bounding box for initial filtering
function getBoundingBox(
  lat: number,
  lon: number,
  radiusKm: number,
): { minLat: number; maxLat: number; minLon: number; maxLon: number } {
  const latDelta = radiusKm / 111.32;
  const lonDelta = radiusKm / (111.32 * Math.cos(toRad(lat)));

  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLon: lon - lonDelta,
    maxLon: lon + lonDelta,
  };
}

export interface NearbyItem {
  id: string;
  type: 'marketplace' | 'service' | 'alert' | 'event' | 'job' | 'place';
  title: string;
  description: string;
  lat: number;
  lng: number;
  distance: number;
  data: any;
}

export interface NearbyQueryParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  types?: string[];
  limit?: number;
  offset?: number;
}

@Injectable()
export class NearbyService {
  constructor(
    private prisma: PrismaService,
    private placesService: PlacesService,
  ) {}

  async findNearby(params: NearbyQueryParams): Promise<{
    items: NearbyItem[];
    total: number;
    radius: number;
  }> {
    const {
      latitude,
      longitude,
      radiusKm = 5,
      types = ['marketplace', 'alert', 'event'],
      limit = 50,
      offset = 0,
    } = params;

    const bbox = getBoundingBox(latitude, longitude, radiusKm);
    const items: NearbyItem[] = [];

    // Fetch marketplace listings
    if (types.includes('marketplace')) {
      const listings = await this.prisma.marketplaceListing.findMany({
        where: {
          isSold: false,
          latitude: { gte: bbox.minLat, lte: bbox.maxLat },
          longitude: { gte: bbox.minLon, lte: bbox.maxLon },
        },
        include: {
          author: {
            select: { id: true, fullName: true, username: true, profileImageUrl: true },
          },
          neighborhood: { select: { id: true, name: true } },
        },
      });

      for (const listing of listings) {
        if (listing.latitude && listing.longitude) {
          const distance = calculateDistance(
            latitude,
            longitude,
            listing.latitude,
            listing.longitude,
          );
          if (distance <= radiusKm) {
            items.push({
              id: listing.id,
              type: 'marketplace',
              title: listing.title,
              description: listing.description,
              lat: listing.latitude,
              lng: listing.longitude,
              distance,
              data: {
                price: listing.price,
                isFree: listing.isFree,
                category: listing.category,
                condition: listing.condition,
                images: listing.images ? JSON.parse(listing.images) : [],
                author: listing.author,
                neighborhood: listing.neighborhood,
              },
            });
          }
        }
      }
    }

    // Fetch safety alerts
    if (types.includes('alert')) {
      const alerts = await this.prisma.safetyAlert.findMany({
        where: {
          latitude: { gte: bbox.minLat, lte: bbox.maxLat },
          longitude: { gte: bbox.minLon, lte: bbox.maxLon },
          OR: [
            { expiresAt: null },
            { expiresAt: { gte: new Date() } },
          ],
        },
        include: {
          author: {
            select: { id: true, fullName: true, username: true },
          },
          neighborhood: { select: { id: true, name: true } },
        },
      });

      for (const alert of alerts) {
        const distance = calculateDistance(
          latitude,
          longitude,
          alert.latitude,
          alert.longitude,
        );
        if (distance <= radiusKm) {
          items.push({
            id: alert.id,
            type: 'alert',
            title: alert.title,
            description: alert.description,
            lat: alert.latitude,
            lng: alert.longitude,
            distance,
            data: {
              alertType: alert.type,
              isUrgent: alert.isUrgent,
              isVerified: alert.isVerified,
              createdAt: alert.createdAt,
              expiresAt: alert.expiresAt,
              author: alert.author,
              neighborhood: alert.neighborhood,
            },
          });
        }
      }
    }

    // Fetch events
    if (types.includes('event')) {
      const events = await this.prisma.event.findMany({
        where: {
          latitude: { gte: bbox.minLat, lte: bbox.maxLat },
          longitude: { gte: bbox.minLon, lte: bbox.maxLon },
          startDate: { gte: new Date() },
        },
        include: {
          author: {
            select: { id: true, fullName: true, username: true },
          },
          neighborhood: { select: { id: true, name: true } },
          _count: { select: { rsvps: true } },
        },
      });

      for (const event of events) {
        if (event.latitude && event.longitude) {
          const distance = calculateDistance(
            latitude,
            longitude,
            event.latitude,
            event.longitude,
          );
          if (distance <= radiusKm) {
            items.push({
              id: event.id,
              type: 'event',
              title: event.title,
              description: event.description,
              lat: event.latitude,
              lng: event.longitude,
              distance,
              data: {
                category: event.category,
                startDate: event.startDate,
                endDate: event.endDate,
                location: event.location,
                rsvpCount: event._count.rsvps,
                author: event.author,
                neighborhood: event.neighborhood,
              },
            });
          }
        }
      }
    }

    // Fetch services (Posts with type SERVICE)
    if (types.includes('service')) {
      const services = await this.prisma.post.findMany({
        where: {
          type: 'SERVICE',
        },
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              username: true,
              profileImageUrl: true,
              latitude: true,
              longitude: true,
              phoneNumber: true,
            },
          },
          neighborhood: {
            select: {
              id: true,
              name: true,
              centerLatitude: true,
              centerLongitude: true,
            },
          },
        },
      });

      for (const service of services) {
        // Use author's location if available, otherwise use neighborhood center
        let serviceLat: number | null = null;
        let serviceLng: number | null = null;

        if (service.author.latitude && service.author.longitude) {
          serviceLat = service.author.latitude;
          serviceLng = service.author.longitude;
        } else if (service.neighborhood.centerLatitude && service.neighborhood.centerLongitude) {
          serviceLat = service.neighborhood.centerLatitude;
          serviceLng = service.neighborhood.centerLongitude;
        }

        if (serviceLat && serviceLng) {
          // Check if within bounding box first (quick filter)
          if (
            serviceLat >= bbox.minLat &&
            serviceLat <= bbox.maxLat &&
            serviceLng >= bbox.minLon &&
            serviceLng <= bbox.maxLon
          ) {
            const distance = calculateDistance(
              latitude,
              longitude,
              serviceLat,
              serviceLng,
            );
            if (distance <= radiusKm) {
              items.push({
                id: service.id,
                type: 'service',
                title: service.title,
                description: service.description,
                lat: serviceLat,
                lng: serviceLng,
                distance,
                data: {
                  category: service.category,
                  author: service.author,
                  neighborhood: service.neighborhood,
                  images: service.images ? JSON.parse(service.images) : [],
                },
              });
            }
          }
        }
      }
    }

    // Fetch real-world places (hospitals, pharmacies, etc.)
    if (types.includes('service') || types.includes('place')) {
      try {
        const placesResult = await this.placesService.findNearby({
          latitude,
          longitude,
          radiusKm,
          limit: 50,
        });

        for (const place of placesResult.places) {
          items.push({
            id: place.id,
            type: 'place',
            title: place.name,
            description: place.description || place.address || '',
            lat: place.latitude,
            lng: place.longitude,
            distance: place.distance,
            data: {
              category: place.category,
              address: place.address,
              phoneNumber: place.phoneNumber,
              email: place.email,
              website: place.website,
              rating: place.rating,
              verified: place.verified,
              neighborhood: place.neighborhood,
            },
          });
        }
      } catch (error) {
        console.error('Error fetching places:', error);
        // Continue without places if there's an error
      }
    }

    // Sort by distance
    items.sort((a, b) => a.distance - b.distance);

    // Apply pagination
    const paginatedItems = items.slice(offset, offset + limit);

    return {
      items: paginatedItems,
      total: items.length,
      radius: radiusKm,
    };
  }

  async findNearbyAlerts(
    latitude: number,
    longitude: number,
    radiusKm: number = 5,
  ) {
    const bbox = getBoundingBox(latitude, longitude, radiusKm);

    const alerts = await this.prisma.safetyAlert.findMany({
      where: {
        latitude: { gte: bbox.minLat, lte: bbox.maxLat },
        longitude: { gte: bbox.minLon, lte: bbox.maxLon },
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } },
        ],
      },
      include: {
        author: {
          select: { id: true, fullName: true, username: true },
        },
        neighborhood: { select: { id: true, name: true } },
      },
      orderBy: [
        { isUrgent: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return alerts.map((alert) => ({
      ...alert,
      distance: calculateDistance(latitude, longitude, alert.latitude, alert.longitude),
    })).filter((alert) => alert.distance <= radiusKm);
  }

  async findNearbyMarketplace(
    latitude: number,
    longitude: number,
    radiusKm: number = 5,
    category?: string,
  ) {
    const bbox = getBoundingBox(latitude, longitude, radiusKm);

    const listings = await this.prisma.marketplaceListing.findMany({
      where: {
        isSold: false,
        latitude: { gte: bbox.minLat, lte: bbox.maxLat },
        longitude: { gte: bbox.minLon, lte: bbox.maxLon },
        ...(category ? { category } : {}),
      },
      include: {
        author: {
          select: { id: true, fullName: true, username: true, profileImageUrl: true },
        },
        neighborhood: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return listings
      .filter((listing) => listing.latitude && listing.longitude)
      .map((listing) => ({
        ...listing,
        images: listing.images ? JSON.parse(listing.images) : [],
        distance: calculateDistance(
          latitude,
          longitude,
          listing.latitude!,
          listing.longitude!,
        ),
      }))
      .filter((listing) => listing.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }

  async updateUserLocation(userId: string, latitude: number, longitude: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        latitude,
        longitude,
        lastSeenAt: new Date(),
      },
      select: {
        id: true,
        latitude: true,
        longitude: true,
        locationVerified: true,
      },
    });
  }

  async getNearbyNeighborhoods(latitude: number, longitude: number, radiusKm: number = 10) {
    const bbox = getBoundingBox(latitude, longitude, radiusKm);

    const neighborhoods = await this.prisma.neighborhood.findMany({
      where: {
        centerLatitude: { gte: bbox.minLat, lte: bbox.maxLat },
        centerLongitude: { gte: bbox.minLon, lte: bbox.maxLon },
        isActive: true,
      },
      include: {
        _count: { select: { users: true, posts: true } },
      },
    });

    return neighborhoods
      .filter((n) => n.centerLatitude && n.centerLongitude)
      .map((neighborhood) => ({
        ...neighborhood,
        distance: calculateDistance(
          latitude,
          longitude,
          neighborhood.centerLatitude!,
          neighborhood.centerLongitude!,
        ),
      }))
      .filter((n) => n.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }
}


