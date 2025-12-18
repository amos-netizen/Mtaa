import { apiClient } from './client';

export const postsApi = {
  /**
   * Get all posts
   */
  async getAll(
    page: number = 1,
    limit: number = 20,
    neighborhoodId?: string,
    category?: string,
    authorId?: string,
    type?: string
  ) {
    const response = await apiClient.instance.get('/api/v1/posts', {
      params: { page, limit, neighborhoodId, category, authorId, type },
    });
    return response.data.data;
  },

  /**
   * Get a single post
   */
  async getOne(postId: string) {
    const response = await apiClient.instance.get(`/api/v1/posts/${postId}`);
    return response.data.data;
  },

  /**
   * Create a new post
   */
  async create(data: {
    title: string;
    description: string;
    neighborhoodId: string;
    category?: string;
    type?: string;
    images?: string[];
    videos?: string[];
    isAnonymous?: boolean;
    // Extended fields for safety alerts
    metadata?: {
      alertType?: string;
      isUrgent?: boolean;
      location?: { lat: number; lng: number } | null;
    };
  }) {
    const response = await apiClient.instance.post('/api/v1/posts', data);
    return response.data.data;
  },

  /**
   * Update a post
   */
  async update(postId: string, data: {
    title?: string;
    description?: string;
    category?: string;
    images?: string[];
    videos?: string[];
  }) {
    const response = await apiClient.instance.put(`/api/v1/posts/${postId}`, data);
    return response.data.data;
  },

  /**
   * Delete a post
   */
  async delete(postId: string) {
    const response = await apiClient.instance.delete(`/api/v1/posts/${postId}`);
    return response.data.data;
  },

  /**
   * Get comments for a post
   */
  async getComments(postId: string, page: number = 1, limit: number = 20) {
    const response = await apiClient.instance.get(`/api/v1/posts/${postId}/comments`, {
      params: { page, limit },
    });
    return response.data.data;
  },

  /**
   * Create a comment
   */
  async createComment(postId: string, content: string, parentId?: string) {
    const response = await apiClient.instance.post(`/api/v1/posts/${postId}/comments`, {
      content,
      parentId,
    });
    return response.data.data;
  },

  /**
   * Update a comment
   */
  async updateComment(commentId: string, content: string) {
    const response = await apiClient.instance.put(`/api/v1/posts/comments/${commentId}`, {
      content,
    });
    return response.data.data;
  },

  /**
   * Delete a comment
   */
  async deleteComment(commentId: string) {
    const response = await apiClient.instance.delete(`/api/v1/posts/comments/${commentId}`);
    return response.data.data;
  },

  /**
   * Like or unlike a post
   */
  async toggleLike(postId: string) {
    const response = await apiClient.instance.post(`/api/v1/posts/${postId}/like`);
    return response.data.data;
  },
};





