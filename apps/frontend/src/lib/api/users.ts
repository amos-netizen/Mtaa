import { apiClient } from './client';

export const usersApi = {
  /**
   * Get current user profile
   */
  async getMe() {
    const response = await apiClient.instance.get('/api/v1/users/me');
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
    const response = await apiClient.instance.put('/api/v1/users/me', data);
    return response.data.data;
  },

  /**
   * Update password
   */
  async updatePassword(oldPassword: string, newPassword: string) {
    const response = await apiClient.instance.put('/api/v1/users/me/password', {
      oldPassword,
      newPassword,
    });
    return response.data.data;
  },
};
