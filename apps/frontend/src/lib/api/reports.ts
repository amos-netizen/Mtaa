import { apiClient } from './client';

export const reportsApi = {
  /**
   * Create a report
   */
  async create(data: {
    postId: string;
    reason: string;
    description?: string;
  }) {
    const response = await apiClient.instance.post('/reports', data);
    return response.data.data;
  },

  /**
   * Get reports for a post
   */
  async getPostReports(postId: string) {
    const response = await apiClient.instance.get(`/reports/post/${postId}`);
    return response.data.data;
  },

  /**
   * Get all reports (admin only)
   */
  async getAllReports(status?: string, page: number = 1, limit: number = 20) {
    const response = await apiClient.instance.get('/reports', {
      params: { status, page, limit },
    });
    return response.data.data;
  },

  /**
   * Get report by ID (admin only)
   */
  async getOne(reportId: string) {
    const response = await apiClient.instance.get(`/reports/${reportId}`);
    return response.data.data;
  },

  /**
   * Resolve a report (admin only)
   */
  async resolveReport(reportId: string, action: 'warn' | 'ban' | 'dismiss', reason?: string) {
    const response = await apiClient.instance.put(`/reports/${reportId}/resolve`, {
      action,
      reason,
    });
    return response.data.data;
  },
};

