'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';
import { notificationsApi } from '@/lib/api/notifications';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const userData = await authApi.getMe();
        setUser(userData);

        try {
          const notificationsData = await notificationsApi.getAll(1, 5);
          setNotifications(notificationsData.notifications || []);
          const count = await notificationsApi.getUnreadCount();
          setUnreadCount(count);
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await authApi.logout();
    router.push('/auth/login');
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const mainFeatures = [
    {
      icon: '📍',
      title: 'Nearby',
      description: 'Discover items, services & alerts near you',
      href: '/nearby',
      color: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
      actions: ['View Map', 'Find Services', 'Safety Alerts', 'Filter by Distance']
    },
    {
      icon: '📦',
      title: 'Marketplace',
      description: 'Buy and sell items locally',
      href: '/marketplace',
      color: 'bg-blue-500 hover:bg-blue-600',
      actions: ['Add Item', 'Edit Item', 'Delete Item', 'View Item', 'Buy Now', 'Search']
    },
    {
      icon: '💼',
      title: 'Job Listings',
      description: 'Find and post job opportunities',
      href: '/jobs',
      color: 'bg-green-500 hover:bg-green-600',
      actions: ['Post Job', 'Apply', 'View Job', 'Delete Job']
    },
    {
      icon: '🔧',
      title: 'Local Services',
      description: 'Book services from local providers',
      href: '/services',
      color: 'bg-purple-500 hover:bg-purple-600',
      actions: ['Book Service', 'View Provider', 'Call Provider', 'Search Services']
    },
    {
      icon: '🚨',
      title: 'Emergency Alerts',
      description: 'Share and view safety alerts',
      href: '/alerts',
      color: 'bg-red-500 hover:bg-red-600',
      actions: ['Create Alert', 'View All Alerts', 'Acknowledge Alert']
    },
    {
      icon: '💬',
      title: 'Community Posts',
      description: 'Connect with your neighborhood',
      href: '/community',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      actions: ['Create Post', 'Comment', 'Like', 'View Post']
    },
    {
      icon: '📅',
      title: 'My Bookings',
      description: 'Manage your service bookings',
      href: '/bookings',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      actions: ['View Booking', 'Cancel Booking', 'Reschedule']
    },
    {
      icon: '👷',
      title: 'Provider Dashboard',
      description: 'Manage your service business',
      href: '/provider',
      color: 'bg-teal-500 hover:bg-teal-600',
      actions: ['Add Service', 'Accept Booking', 'Decline Booking', 'View Earnings']
    },
    {
      icon: '🔔',
      title: 'Notifications',
      description: 'Stay updated with notifications',
      href: '/dashboard/notifications',
      color: 'bg-orange-500 hover:bg-orange-600',
      actions: ['Mark as Read', 'Open Notification']
    },
    {
      icon: '💬',
      title: 'Messages',
      description: 'Chat with neighbors and providers',
      href: '/messages',
      color: 'bg-pink-500 hover:bg-pink-600',
      actions: ['Send Message', 'Open Chat', 'Load Messages']
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mtaa Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/settings"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user?.fullName || 'User'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{user?.username}</p>
            </div>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Main Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainFeatures.map((feature, idx) => (
              <Link
                key={idx}
                href={feature.href}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start gap-4">
                  <div className={`${feature.color} text-white text-3xl w-16 h-16 rounded-lg flex items-center justify-center`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {feature.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {feature.actions.slice(0, 3).map((action, actionIdx) => (
                        <span
                          key={actionIdx}
                          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                        >
                          {action}
                        </span>
                      ))}
                      {feature.actions.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                          +{feature.actions.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Notifications & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h3>
              <Link
                href="/dashboard/notifications"
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                View All
              </Link>
            </div>
            {notifications.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No notifications yet
              </p>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      notification.isRead
                        ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                        : 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.body}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="ml-4 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Activity Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Posts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Listings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Bookings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Messages</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
