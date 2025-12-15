import { apiClient } from './client';

export const jobsApi = {
  /**
   * Get all job listings
   */
  async getAll(page: number = 1, limit: number = 20, neighborhoodId?: string, search?: string) {
    const response = await apiClient.instance.get('/api/v1/jobs', {
      params: { page, limit, neighborhoodId, search },
    });
    return response.data.data;
  },

  /**
   * Get a single job
   */
  async getOne(jobId: string) {
    const response = await apiClient.instance.get(`/api/v1/jobs/${jobId}`);
    return response.data.data;
  },

  /**
   * Post a new job
   */
  async create(data: {
    title: string;
    description: string;
    neighborhoodId: string;
    category?: string;
    images?: string[];
    salary?: string;
    jobType?: string;
  }) {
    const response = await apiClient.instance.post('/api/v1/jobs', data);
    return response.data.data;
  },

  /**
   * Update a job posting
   */
  async update(jobId: string, data: {
    title?: string;
    description?: string;
    category?: string;
    images?: string[];
  }) {
    const response = await apiClient.instance.put(`/api/v1/jobs/${jobId}`, data);
    return response.data.data;
  },

  /**
   * Delete a job posting
   */
  async delete(jobId: string) {
    const response = await apiClient.instance.delete(`/api/v1/jobs/${jobId}`);
    return response.data.data;
  },

  /**
   * Apply for a job
   */
  async apply(jobId: string, data: { coverLetter: string; resumeUrl?: string }) {
    const response = await apiClient.instance.post(`/api/v1/jobs/${jobId}/apply`, data);
    return response.data.data;
  },
};






