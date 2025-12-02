import { apiClient } from './client';
import { RegisterRequest, AuthTokens } from '@mtaa/types';

export const authApi = {
  async register(data: RegisterRequest) {
    const response = await apiClient.instance.post('/api/v1/auth/register', data);
    return response.data.data;
  },

  async verifyOtp(phoneNumber: string, otpCode: string): Promise<AuthTokens & { user: any }> {
    const response = await apiClient.instance.post('/api/v1/auth/verify-otp', {
      phoneNumber,
      otpCode,
    });
    return response.data.data;
  },

  async login(phoneNumber: string) {
    const response = await apiClient.instance.post('/api/v1/auth/login', { phoneNumber });
    return response.data.data;
  },

  async getMe() {
    const response = await apiClient.instance.get('/api/v1/auth/me');
    return response.data.data;
  },

  async logout() {
    await apiClient.instance.post('/api/v1/auth/logout');
  },
};



