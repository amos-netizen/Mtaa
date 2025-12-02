import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { SecureStore } from '../storage';
import Constants from 'expo-constants';

/**
 * API client for mobile app
 */
class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3001';

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await SecureStore.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await SecureStore.getItem('refreshToken');
            if (refreshToken) {
              const response = await axios.post(`${this.baseURL}/api/v1/auth/refresh-token`, {
                refreshToken,
              });

              const { accessToken } = response.data.data;
              await SecureStore.setItem('accessToken', accessToken);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            await SecureStore.removeItem('accessToken');
            await SecureStore.removeItem('refreshToken');
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  get instance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();



