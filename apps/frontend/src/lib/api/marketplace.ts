import { apiClient } from './client';

export const marketplaceApi = {
  /**
   * Get all marketplace listings
   */
  async getListings(params?: {
    neighborhoodId?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.instance.get('/marketplace/listings', {
      params,
    });
    return response.data.data;
  },

  /**
   * Get single listing
   */
  async getListing(id: string) {
    const response = await apiClient.instance.get(`/marketplace/listings/${id}`);
    return response.data.data;
  },

  /**
   * Create a new listing
   */
  async createListing(data: {
    neighborhoodId: string;
    category: string;
    title: string;
    description: string;
    price?: number;
    isFree?: boolean;
    condition?: string;
    images: string[];
    pickupLocation?: string;
    deliveryAvailable?: boolean;
  }) {
    const response = await apiClient.instance.post('/marketplace/listings', data);
    return response.data.data;
  },

  /**
   * Update listing
   */
  async updateListing(id: string, data: Partial<{
    title: string;
    description: string;
    price?: number;
    isFree?: boolean;
    condition?: string;
    images: string[];
    pickupLocation?: string;
    deliveryAvailable?: boolean;
  }>) {
    const response = await apiClient.instance.put(`/marketplace/listings/${id}`, data);
    return response.data.data;
  },

  /**
   * Mark listing as sold
   */
  async markAsSold(id: string) {
    const response = await apiClient.instance.post(`/marketplace/listings/${id}/mark-sold`);
    return response.data.data;
  },

  /**
   * Delete listing
   */
  async deleteListing(id: string) {
    const response = await apiClient.instance.delete(`/marketplace/listings/${id}`);
    return response.data.data;
  },
};
