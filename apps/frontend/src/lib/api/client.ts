import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

// Get API base URL from environment variable
// Defaults to production API if not set
const getApiBaseUrl = (): string => {
  // Check for environment variable first (highest priority)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Default to production API (Render backend)
  return 'https://mtaa-backend.onrender.com/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

// Log API configuration (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('[API Client] Base URL:', API_BASE_URL);
}

/**
 * API client with automatic token injection
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for token refresh and error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Log network errors
        if (!error.response) {
          console.error('[API Client] Network Error:', {
            message: error.message,
            url: originalRequest?.url,
            baseURL: API_BASE_URL,
            timestamp: new Date().toISOString(),
          });
          
          // Return a user-friendly error
          return Promise.reject({
            ...error,
            message: 'Network error. Please check your internet connection and try again.',
            isNetworkError: true,
          });
        }

        // Log API errors
        console.error('[API Client] API Error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          url: originalRequest?.url,
          method: originalRequest?.method,
          data: error.response.data,
          timestamp: new Date().toISOString(),
        });

        // Handle 401 Unauthorized - token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              // Attempt to refresh token
              const response = await axios.post(
                `${API_BASE_URL}/auth/refresh-token`,
                { refreshToken }
              );

              const { accessToken } = response.data.data;
              this.setAccessToken(accessToken);

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            console.error('[API Client] Token refresh failed:', refreshError);
            // Refresh failed, clear tokens and redirect to login
            this.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
            return Promise.reject(refreshError);
          }
        }

        // Handle 500+ server errors
        if (error.response?.status >= 500) {
          const errorData = error.response.data as any;
          console.error('[API Client] Server Error:', {
            status: error.response.status,
            message: errorData?.message || 'Internal server error',
          });
        }

        return Promise.reject(error);
      }
    );
  }

  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  private setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  get instance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();



