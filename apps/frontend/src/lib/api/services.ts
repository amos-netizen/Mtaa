import { apiClient } from './client';

export const servicesApi = {
  /**
   * Get all service listings
   */
  async getAll(page: number = 1, limit: number = 20, neighborhoodId?: string, search?: string, category?: string) {
    const response = await apiClient.instance.get('/api/v1/services', {
      params: { page, limit, neighborhoodId, search, category },
    });
    return response.data.data;
  },

  /**
   * Get a single service
   */
  async getOne(serviceId: string) {
    const response = await apiClient.instance.get(`/api/v1/services/${serviceId}`);
    return response.data.data;
  },

  /**
   * Create a new service listing
   */
  async create(data: {
    title: string;
    description: string;
    neighborhoodId: string;
    category?: string;
    images?: string[];
    price?: number;
    serviceType?: string;
  }) {
    const response = await apiClient.instance.post('/api/v1/services', data);
    return response.data.data;
  },

  /**
   * Book a service
   */
  async book(serviceId: string, data: {
    preferredDate?: string;
    preferredTime?: string;
    message: string;
  }) {
    const response = await apiClient.instance.post(`/api/v1/services/${serviceId}/book`, data);
    return response.data.data;
  },
};









