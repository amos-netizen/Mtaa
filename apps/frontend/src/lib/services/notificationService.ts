/**
 * Browser Notification Service
 * Handles browser push notifications for real-time alerts
 */

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  data?: any;
  actions?: NotificationAction[];
}

class NotificationService {
  private permission: NotificationPermission = 'default';
  private isSupported: boolean;

  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'Notification' in window;
    if (this.isSupported) {
      this.permission = Notification.permission;
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      console.warn('Notifications are not supported in this browser');
      return 'denied';
    }

    if (this.permission === 'granted') {
      return 'granted';
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Check if notifications are allowed
   */
  isAllowed(): boolean {
    return this.isSupported && this.permission === 'granted';
  }

  /**
   * Show a notification
   */
  async show(options: NotificationOptions): Promise<Notification | null> {
    if (!this.isSupported) {
      console.warn('Notifications are not supported');
      return null;
    }

    // Request permission if not already granted
    if (this.permission !== 'granted') {
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return null;
      }
    }

    try {
      const notificationOptions: any = {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        badge: options.badge || '/favicon.ico',
        tag: options.tag,
        requireInteraction: options.requireInteraction || false,
        data: options.data,
      };
      
      // Add actions if provided (browser API supports this but TypeScript types may not)
      if (options.actions && options.actions.length > 0) {
        notificationOptions.actions = options.actions;
      }
      
      const notification = new Notification(options.title, notificationOptions);

      // Auto-close after 5 seconds unless requireInteraction is true
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  /**
   * Show an urgent alert notification
   */
  async showUrgentAlert(title: string, body: string, data?: any): Promise<Notification | null> {
    return this.show({
      title: `🚨 ${title}`,
      body,
      icon: '/favicon.ico',
      tag: 'urgent-alert',
      requireInteraction: true,
      data,
      actions: [
        { action: 'view', title: 'View Alert' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    });
  }

  /**
   * Show a new message notification
   */
  async showNewMessage(senderName: string, message: string, data?: any): Promise<Notification | null> {
    return this.show({
      title: `💬 New message from ${senderName}`,
      body: message,
      icon: '/favicon.ico',
      tag: 'new-message',
      data,
    });
  }

  /**
   * Show a new post notification
   */
  async showNewPost(title: string, authorName: string, data?: any): Promise<Notification | null> {
    return this.show({
      title: `📝 New post: ${title}`,
      body: `By ${authorName}`,
      icon: '/favicon.ico',
      tag: 'new-post',
      data,
    });
  }
}

export const notificationService = new NotificationService();

