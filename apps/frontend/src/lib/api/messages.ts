import { apiClient } from './client';

export const messagesApi = {
  /**
   * Get all conversations for current user
   */
  async getConversations() {
    const response = await apiClient.instance.get('/api/v1/conversations');
    return response.data.data;
  },

  /**
   * Get or create a conversation with a user
   */
  async getOrCreateConversation(userId: string) {
    const response = await apiClient.instance.post('/api/v1/conversations', { userId });
    return response.data.data;
  },

  /**
   * Get messages in a conversation
   */
  async getMessages(conversationId: string, page: number = 1, limit: number = 50) {
    const response = await apiClient.instance.get(`/api/v1/conversations/${conversationId}/messages`, {
      params: { page, limit },
    });
    return response.data.data;
  },

  /**
   * Send a message
   */
  async sendMessage(conversationId: string, data: {
    content: string;
    mediaUrl?: string;
    messageType?: string;
  }) {
    const response = await apiClient.instance.post(`/api/v1/conversations/${conversationId}/messages`, data);
    return response.data.data;
  },

  /**
   * Mark message as read
   */
  async markAsRead(messageId: string) {
    const response = await apiClient.instance.put(`/api/v1/messages/${messageId}/read`);
    return response.data.data;
  },
};









