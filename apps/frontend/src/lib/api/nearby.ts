import { apiClient } from './client';

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

export interface NearbyResponse {
  items: NearbyItem[];
  total: number;
  radius: number;
}

export interface NearbyAlert {
  id: string;
  type: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string;
  isUrgent: boolean;
  isVerified: boolean;
  createdAt: string;
  expiresAt?: string;
  distance: number;
  author?: {
    id: string;
    fullName: string;
    username: string;
  };
  neighborhood?: {
    id: string;
    name: string;
  };
}

export interface NearbyMarketplaceListing {
  id: string;
  title: string;
  description: string;
  category: string;
  price?: number;
  isFree: boolean;
  condition?: string;
  images: string[];
  latitude: number;
  longitude: number;
  distance: number;
  author?: {
    id: string;
    fullName: string;
    username: string;
    profileImageUrl?: string;
  };
  neighborhood?: {
    id: string;
    name: string;
  };
}

export interface NearbyNeighborhood {
  id: string;
  name: string;
  city: string;
  county?: string;
  description?: string;
  centerLatitude: number;
  centerLongitude: number;
  distance: number;
  _count: {
    users: number;
    posts: number;
  };
}

export interface NearbyQueryParams {
  latitude: number;
  longitude: number;
  radius?: number;
  types?: string[];
  limit?: number;
  offset?: number;
  category?: string;
}

export const nearbyApi = {
  /**
   * Get all nearby items (marketplace, alerts, events)
   */
  async getAll(params: NearbyQueryParams): Promise<NearbyResponse> {
    const queryParams = new URLSearchParams({
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
    });
    
    if (params.radius) queryParams.set('radius', params.radius.toString());
    if (params.types?.length) queryParams.set('types', params.types.join(','));
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.offset) queryParams.set('offset', params.offset.toString());

    const response = await apiClient.instance.get<{ data: NearbyResponse }>(`/api/v1/nearby?${queryParams.toString()}`);
    return response.data.data;
  },

  /**
   * Get nearby safety alerts
   */
  async getAlerts(
    latitude: number,
    longitude: number,
    radius: number = 5
  ): Promise<NearbyAlert[]> {
    const response = await apiClient.instance.get<{ data: NearbyAlert[] }>(
      `/api/v1/nearby/alerts?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
    );
    return response.data.data;
  },

  /**
   * Get nearby marketplace listings
   */
  async getMarketplace(
    latitude: number,
    longitude: number,
    radius: number = 5,
    category?: string
  ): Promise<NearbyMarketplaceListing[]> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radius.toString(),
    });
    if (category) params.set('category', category);

    const response = await apiClient.instance.get<{ data: NearbyMarketplaceListing[] }>(
      `/api/v1/nearby/marketplace?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get nearby neighborhoods
   */
  async getNeighborhoods(
    latitude: number,
    longitude: number,
    radius: number = 10
  ): Promise<NearbyNeighborhood[]> {
    const response = await apiClient.instance.get<{ data: NearbyNeighborhood[] }>(
      `/api/v1/nearby/neighborhoods?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
    );
    return response.data.data;
  },

  /**
   * Update current user's location
   */
  async updateLocation(latitude: number, longitude: number): Promise<{
    id: string;
    latitude: number;
    longitude: number;
    locationVerified: boolean;
  }> {
    const response = await apiClient.instance.post<{ data: any }>('/api/v1/nearby/location', {
      latitude,
      longitude,
    });
    return response.data.data;
  },
};

