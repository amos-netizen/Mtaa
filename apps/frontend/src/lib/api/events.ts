import { apiClient } from './client';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  isRecurring: boolean;
  recurrenceRule?: string;
  createdAt: string;
  updatedAt: string;
  postId: string;
  authorId: string;
  author: {
    id: string;
    fullName: string;
    username: string;
    profileImageUrl?: string;
  };
  neighborhoodId: string;
  neighborhood: {
    id: string;
    name: string;
    city: string;
  };
  rsvps?: EventRsvp[];
  rsvpCount?: number;
}

export interface EventRsvp {
  id: string;
  status: 'GOING' | 'INTERESTED' | 'CANT_GO';
  userId: string;
  user: {
    id: string;
    fullName: string;
    username: string;
  };
  createdAt: string;
}

export const eventsApi = {
  /**
   * Get all events
   */
  async getAll(params?: {
    neighborhoodId?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.instance.get('/posts', {
      params: {
        type: 'EVENT',
        ...params,
      },
    });
    // Filter for events and map to Event format
    const posts = response.data.data.posts || [];
    const events = posts
      .filter((post: any) => post.type === 'EVENT' && post.event)
      .map((post: any) => ({
        ...post.event,
        postId: post.id,
        author: post.author,
        neighborhood: post.neighborhood,
        rsvps: post.event?.rsvps || [],
        rsvpCount: post.event?.rsvps?.length || 0,
      }));
    return { events, pagination: response.data.data.pagination };
  },

  /**
   * Get a single event
   */
  async getOne(eventId: string) {
    // Events are stored as posts with type EVENT
    const response = await apiClient.instance.get(`/posts/${eventId}`);
    const post = response.data.data;
    if (post.type !== 'EVENT' || !post.event) {
      throw new Error('Event not found');
    }
    return {
      ...post.event,
      postId: post.id,
      author: post.author,
      neighborhood: post.neighborhood,
      rsvps: post.event.rsvps || [],
      rsvpCount: post.event.rsvps?.length || 0,
    };
  },

  /**
   * Create an event
   */
  async create(data: {
    neighborhoodId: string;
    title: string;
    description: string;
    category: string;
    startDate: string;
    endDate?: string;
    location: string;
    latitude?: number;
    longitude?: number;
    isRecurring?: boolean;
    recurrenceRule?: string;
  }) {
    // Create as a post with type EVENT
    const response = await apiClient.instance.post('/posts', {
      title: data.title,
      description: data.description,
      neighborhoodId: data.neighborhoodId,
      type: 'EVENT',
      metadata: {
        category: data.category,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        isRecurring: data.isRecurring,
        recurrenceRule: data.recurrenceRule,
      },
    });
    return response.data.data;
  },

  /**
   * RSVP to an event
   */
  async rsvp(eventId: string, status: 'GOING' | 'INTERESTED' | 'CANT_GO') {
    // RSVP would need to be implemented via comments or a separate endpoint
    // For now, we'll use a comment-based approach or create a dedicated endpoint
    const response = await apiClient.instance.post(`/posts/${eventId}/comments`, {
      content: `RSVP: ${status}`,
      metadata: { rsvpStatus: status },
    });
    return response.data.data;
  },

  /**
   * Update an event
   */
  async update(eventId: string, data: Partial<Event>) {
    const response = await apiClient.instance.put(`/posts/${eventId}`, {
      title: data.title,
      description: data.description,
      metadata: {
        category: data.category,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });
    return response.data.data;
  },

  /**
   * Delete an event
   */
  async delete(eventId: string) {
    const response = await apiClient.instance.delete(`/posts/${eventId}`);
    return response.data.data;
  },
};

