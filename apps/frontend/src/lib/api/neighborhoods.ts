import { apiClient } from './client';

export const neighborhoodsApi = {
  /**
   * Get all neighborhoods
   */
  async getAll(city?: string, search?: string) {
    const response = await apiClient.instance.get('/api/v1/neighborhoods', {
      params: { city, search },
    });
    return response.data.data;
  },

  /**
   * Get a single neighborhood by ID
   */
  async getOne(id: string) {
    const response = await apiClient.instance.get(`/api/v1/neighborhoods/${id}`);
    return response.data.data;
  },
};














