import { apiClient } from './client';

export const usersApi = {
  /**
   * Get current user profile
   */
  async getMe() {
    const response = await apiClient.instance.get('/users/me');
    return response.data.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: {
    fullName?: string;
    username?: string;
    email?: string;
    bio?: string;
    profileImageUrl?: string;
    languagePreference?: 'en' | 'sw';
    mpesaNumber?: string;
  }) {
    const response = await apiClient.instance.put('/users/me', data);
    return response.data.data;
  },

  /**
   * Update password
   */
  async updatePassword(oldPassword: string, newPassword: string) {
    const response = await apiClient.instance.put('/users/me/password', {
      oldPassword,
      newPassword,
    });
    return response.data.data;
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const response = await apiClient.instance.get(`/users/${userId}`);
    return response.data.data;
  },

  /**
   * Get user's posts
   */
  async getUserPosts(userId: string, page: number = 1, limit: number = 20) {
    const response = await apiClient.instance.get(`/posts`, {
      params: { authorId: userId, page, limit },
    });
    return response.data.data;
  },
};
