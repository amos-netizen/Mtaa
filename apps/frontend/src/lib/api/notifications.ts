import { apiClient } from './client';

export const notificationsApi = {
  /**
   * Get all notifications
   */
  async getAll(page: number = 1, limit: number = 20) {
    const response = await apiClient.instance.get('/api/v1/notifications', {
      params: { page, limit },
    });
    return response.data.data;
  },

  /**
   * Get unread notifications count
   */
  async getUnreadCount() {
    const response = await apiClient.instance.get('/api/v1/notifications/unread-count');
    return response.data.data.count;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string) {
    const response = await apiClient.instance.put(`/api/v1/notifications/${notificationId}/read`);
    return response.data.data;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    const response = await apiClient.instance.put('/api/v1/notifications/read-all');
    return response.data.data;
  },

  /**
   * Delete notification
   */
  async delete(notificationId: string) {
    const response = await apiClient.instance.delete(`/api/v1/notifications/${notificationId}`);
    return response.data.data;
  },
};
