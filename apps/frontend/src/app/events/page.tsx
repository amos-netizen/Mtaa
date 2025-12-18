'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';
import { eventsApi, Event } from '@/lib/api/events';
import { neighborhoodsApi } from '@/lib/api/neighborhoods';
import { useRealtimePolling } from '@/lib/hooks/useRealtimePolling';
import { ListSkeleton } from '@/components/ui/LoadingSkeleton';

const EVENT_CATEGORIES = [
  { value: 'COMMUNITY_MEETING', label: 'Community Meeting', icon: '🏘️' },
  { value: 'GARAGE_SALE', label: 'Garage Sale', icon: '🏪' },
  { value: 'SPORTS', label: 'Sports', icon: '⚽' },
  { value: 'CLASSES', label: 'Classes', icon: '📚' },
  { value: 'SOCIAL_GATHERING', label: 'Social Gathering', icon: '🎉' },
  { value: 'OTHER', label: 'Other', icon: '📅' },
];

export default function EventsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const fetchEvents = async () => {
    try {
      const result = await eventsApi.getAll({
        neighborhoodId: selectedNeighborhood || undefined,
        category: selectedCategory || undefined,
        limit: 50,
      });
      setEvents(result.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  // Real-time polling for events
  useRealtimePolling({
    enabled: !loading && !!user,
    interval: 60000, // 1 minute
    onPoll: fetchEvents,
    immediate: false,
  });

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

        // Fetch neighborhoods
        try {
          const neighborhoodsData = await neighborhoodsApi.getAll('Nairobi');
          setNeighborhoods(neighborhoodsData.neighborhoods || []);
          
          const primaryNeighborhood = userData?.userNeighborhoods?.find((n: any) => n.isPrimary);
          if (primaryNeighborhood) {
            setSelectedNeighborhood(primaryNeighborhood.neighborhoodId);
          }
        } catch (error) {
          console.error('Failed to fetch neighborhoods:', error);
        }

        await fetchEvents();
      } catch (error) {
        console.error('Failed to fetch data:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    if (!loading && user) {
      fetchEvents();
    }
  }, [selectedNeighborhood, selectedCategory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryIcon = (category: string) => {
    return EVENT_CATEGORIES.find(c => c.value === category)?.icon || '📅';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ListSkeleton count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-purple-100 hover:text-white transition-colors flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Community Events</h1>
                <p className="text-purple-200 mt-1">Discover and join local events</p>
              </div>
            </div>
            <Link
              href="/events/create"
              className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium flex items-center gap-2"
            >
              <span>➕</span> Create Event
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Neighborhood
              </label>
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Neighborhoods</option>
                {neighborhoods.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name} - {n.city}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Categories</option>
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <span className="text-6xl mb-4 block">📅</span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Events Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Be the first to create an event in your neighborhood!
              </p>
              <Link
                href="/events/create"
                className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Event
              </Link>
            </div>
          ) : (
            events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.postId}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex gap-6">
                  {/* Date Box */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex flex-col items-center justify-center text-white">
                      <div className="text-2xl font-bold">
                        {new Date(event.startDate).getDate()}
                      </div>
                      <div className="text-xs uppercase">
                        {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{getCategoryIcon(event.category)}</span>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {event.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {event.neighborhood.name} • {EVENT_CATEGORIES.find(c => c.value === event.category)?.label}
                        </p>
                      </div>
                      {event.rsvpCount && event.rsvpCount > 0 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {event.rsvpCount} going
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <span>📅</span>
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>📍</span>
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>👤</span>
                        <Link
                          href={`/users/${event.authorId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:underline"
                        >
                          {event.author.fullName}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

