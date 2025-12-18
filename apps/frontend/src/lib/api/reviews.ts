import { apiClient } from './client';

export interface Review {
  id: string;
  rating: number; // 1-5
  comment: string;
  authorId: string;
  author: {
    id: string;
    fullName: string;
    username: string;
    profileImageUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const reviewsApi = {
  /**
   * Get reviews for a service or marketplace listing
   */
  async getReviews(targetId: string, targetType: 'MARKETPLACE' | 'SERVICE' | 'PROVIDER' | 'JOB_EMPLOYER') {
    const response = await apiClient.instance.get('/reviews', {
      params: { targetId, targetType },
    });
    return response.data.data;
  },

  /**
   * Create a review
   */
  async createReview(data: {
    targetId: string;
    targetType: 'MARKETPLACE' | 'SERVICE' | 'PROVIDER' | 'JOB_EMPLOYER';
    rating: number;
    comment?: string;
  }) {
    const response = await apiClient.instance.post('/reviews', data);
    return response.data.data;
  },

  /**
   * Update a review
   */
  async updateReview(reviewId: string, data: { rating?: number; comment?: string }) {
    const response = await apiClient.instance.put(`/reviews/${reviewId}`, data);
    return response.data.data;
  },

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string) {
    const response = await apiClient.instance.delete(`/reviews/${reviewId}`);
    return response.data.data;
  },

  /**
   * Get average rating for a target
   */
  async getAverageRating(targetId: string, targetType: 'MARKETPLACE' | 'SERVICE' | 'PROVIDER' | 'JOB_EMPLOYER') {
    const response = await apiClient.instance.get('/reviews/average', {
      params: { targetId, targetType },
    });
    return response.data.data;
  },
};

