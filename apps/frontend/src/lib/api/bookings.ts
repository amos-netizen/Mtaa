import { apiClient } from './client';

export const bookingsApi = {
  /**
   * Get all bookings for current user
   */
  async getAll(page: number = 1, limit: number = 20) {
    const response = await apiClient.instance.get('/api/v1/bookings', {
      params: { page, limit },
    });
    return response.data.data;
  },

  /**
   * Get a single booking
   */
  async getOne(bookingId: string) {
    const response = await apiClient.instance.get(`/api/v1/bookings/${bookingId}`);
    return response.data.data;
  },

  /**
   * Update/Reschedule a booking
   */
  async update(bookingId: string, data: {
    preferredDate?: string;
    preferredTime?: string;
    message?: string;
  }) {
    const response = await apiClient.instance.put(`/api/v1/bookings/${bookingId}`, data);
    return response.data.data;
  },

  /**
   * Cancel a booking
   */
  async cancel(bookingId: string) {
    const response = await apiClient.instance.delete(`/api/v1/bookings/${bookingId}`);
    return response.data.data;
  },
};






