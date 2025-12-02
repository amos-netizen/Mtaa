/**
 * Shared types for Mtaa monorepo
 * Used across frontend, backend, and mobile
 */

// User types
export interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  fullName: string;
  username: string;
  profileImageUrl?: string;
  bio?: string;
  neighborhoodId?: string;
  locationVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  languagePreference: 'en' | 'sw';
  mpesaNumber?: string;
  isActive: boolean;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Auth types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  phoneNumber: string;
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  otpCode: string;
}

export interface RegisterRequest {
  phoneNumber: string;
  fullName: string;
  username: string;
  password: string;
  email?: string;
  neighborhoodId?: string;
  address?: string;
}

// Post types
export type PostCategory = 'news' | 'discussion' | 'question' | 'announcement' | 'lost_found';

export interface Post {
  id: string;
  userId: string;
  neighborhoodId: string;
  category: PostCategory;
  title: string;
  content: string;
  mediaUrls?: string[];
  locationLatitude?: number;
  locationLongitude?: number;
  isAnonymous: boolean;
  isPinned: boolean;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostRequest {
  neighborhoodId: string;
  category: PostCategory;
  title: string;
  content: string;
  mediaUrls?: string[];
  locationLatitude?: number;
  locationLongitude?: number;
  isAnonymous?: boolean;
}

// Comment types
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  parentCommentId?: string;
  content: string;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentRequest {
  content: string;
  parentCommentId?: string;
}

// Safety Alert types
export type AlertType = 'crime' | 'accident' | 'fire' | 'medical' | 'other';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SafetyAlert {
  id: string;
  userId: string;
  neighborhoodId: string;
  alertType: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  locationLatitude: number;
  locationLongitude: number;
  address?: string;
  mediaUrls?: string[];
  isVerified: boolean;
  verificationCount: number;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Marketplace types
export type ListingCategory =
  | 'electronics'
  | 'furniture'
  | 'vehicles'
  | 'clothing'
  | 'services'
  | 'food'
  | 'other';

export type ListingCondition = 'new' | 'like_new' | 'good' | 'fair' | 'poor';

export interface MarketplaceListing {
  id: string;
  userId: string;
  neighborhoodId: string;
  category: ListingCategory;
  title: string;
  description: string;
  price: number;
  currency: string;
  condition: ListingCondition;
  imageUrls: string[];
  isNegotiable: boolean;
  isSold: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Event types
export type EventType = 'social' | 'business' | 'community' | 'religious' | 'sports' | 'other';
export type RsvpStatus = 'going' | 'maybe' | 'not_going';

export interface Event {
  id: string;
  userId: string;
  neighborhoodId: string;
  title: string;
  description: string;
  eventType: EventType;
  startDatetime: Date;
  endDatetime?: Date;
  locationName: string;
  locationLatitude: number;
  locationLongitude: number;
  address?: string;
  imageUrl?: string;
  isFree: boolean;
  ticketPrice?: number;
  maxAttendees?: number;
  rsvpCount: number;
  isCancelled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Neighborhood types
export interface Neighborhood {
  id: string;
  name: string;
  city: string;
  county: string;
  boundaryCoordinates: any; // GeoJSON
  centerLatitude?: number;
  centerLongitude?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// Common types
export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';



