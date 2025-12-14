import { apiClient } from './client';
import { RegisterRequest, VerifyOtpRequest, LoginRequest, AuthTokens } from '@mtaa/types';

export const authApi = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest) {
    try {
      const response = await apiClient.instance.post('/api/v1/auth/register', data);
      console.log('Raw API response:', response);
      console.log('Response data:', response.data);
      console.log('Response data.data:', response.data.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Registration API error:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  },

  /**
   * Verify OTP and get tokens
   */
  async verifyOtp(phoneNumber: string, otpCode: string): Promise<AuthTokens & { user: any }> {
    const response = await apiClient.instance.post('/api/v1/auth/verify-otp', {
      phoneNumber,
      otpCode,
    });
    return response.data.data;
  },

  /**
   * Request login OTP
   */
  async login(phoneNumber: string) {
    const response = await apiClient.instance.post('/api/v1/auth/login/otp', { phoneNumber });
    return response.data.data;
  },

  /**
   * Login with email and password
   */
  async loginWithPassword(email: string, password: string): Promise<AuthTokens & { user: any }> {
    const response = await apiClient.instance.post('/api/v1/auth/login', {
      email,
      password,
    });
    return response.data.data;
  },

  /**
   * Get current user profile
   */
  async getMe() {
    const response = await apiClient.instance.get('/api/v1/auth/me');
    return response.data.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.instance.post('/api/v1/auth/refresh-token', {
      refreshToken,
    });
    return response.data.data;
  },

  /**
   * Logout
   */
  async logout() {
    try {
      await apiClient.instance.delete('/api/v1/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local tokens
      console.error('Logout error:', error);
    } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      }
    }
  },
};



