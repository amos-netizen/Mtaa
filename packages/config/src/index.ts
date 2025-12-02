/**
 * Shared configuration and constants
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3001';

export const API_VERSION = 'v1';

export const API_ENDPOINTS = {
  auth: {
    register: '/api/v1/auth/register',
    login: '/api/v1/auth/login',
    verifyOtp: '/api/v1/auth/verify-otp',
    refresh: '/api/v1/auth/refresh-token',
    me: '/api/v1/auth/me',
    logout: '/api/v1/auth/logout',
  },
  posts: {
    list: '/api/v1/posts',
    create: '/api/v1/posts',
    get: (id: string) => `/api/v1/posts/${id}`,
    update: (id: string) => `/api/v1/posts/${id}`,
    delete: (id: string) => `/api/v1/posts/${id}`,
    like: (id: string) => `/api/v1/posts/${id}/like`,
  },
  comments: {
    list: (postId: string) => `/api/v1/posts/${postId}/comments`,
    create: (postId: string) => `/api/v1/posts/${postId}/comments`,
  },
  safety: {
    list: '/api/v1/safety-alerts',
    create: '/api/v1/safety-alerts',
    verify: (id: string) => `/api/v1/safety-alerts/${id}/verify`,
  },
  marketplace: {
    list: '/api/v1/marketplace/listings',
    create: '/api/v1/marketplace/listings',
    get: (id: string) => `/api/v1/marketplace/listings/${id}`,
  },
  events: {
    list: '/api/v1/events',
    create: '/api/v1/events',
    get: (id: string) => `/api/v1/events/${id}`,
    rsvp: (id: string) => `/api/v1/events/${id}/rsvp`,
  },
  neighborhoods: {
    list: '/api/v1/neighborhoods',
    get: (id: string) => `/api/v1/neighborhoods/${id}`,
  },
} as const;

export const APP_CONFIG = {
  name: 'Mtaa',
  description: 'Hyperlocal Kenyan Neighborhood Social Network',
  version: '1.0.0',
} as const;



