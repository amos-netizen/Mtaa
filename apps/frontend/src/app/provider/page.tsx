'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { servicesApi } from '@/lib/api/services';
import { postsApi } from '@/lib/api/posts';
import { authApi } from '@/lib/api/auth';

export default function ProviderDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [myServices, setMyServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState({ total: 0, thisMonth: 0, pending: 0 });

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
        
        // Fetch user's services (posts with type SERVICE)
        const postsData = await postsApi.getAll(1, 50);
        const services = (postsData.posts || []).filter((p: any) => p.type === 'SERVICE' && p.authorId === userData.id);
        setMyServices(services);

        // Fetch bookings (comments on user's service posts)
        // This would need a backend endpoint, for now we'll show a placeholder
        setBookings([]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      // This would call a backend endpoint to accept booking
      alert('Booking accepted!');
      // Refresh bookings
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to accept booking');
    }
  };

  const handleDeclineBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to decline this booking?')) return;
    try {
      // This would call a backend endpoint to decline booking
      alert('Booking declined');
      // Refresh bookings
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to decline booking');
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">👷 Provider Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
                Dashboard
              </Link>
              <button
                onClick={() => router.push('/services/create')}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Earnings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">KES {earnings.total.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">This Month</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">KES {earnings.thisMonth.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Pending</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">KES {earnings.pending.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Services */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Services</h2>
              <button
                onClick={() => router.push('/services/create')}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
              >
                Add Service
              </button>
            </div>
            {myServices.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No services yet. Add your first service!
              </p>
            ) : (
              <div className="space-y-4">
                {myServices.map((service) => (
                  <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/services/${service.id}`)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/services/${service.id}/edit`)}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bookings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Bookings</h2>
            {bookings.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No bookings yet
              </p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {booking.service?.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      From: {booking.customer?.fullName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {booking.message}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptBooking(booking.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Accept Booking
                      </button>
                      <button
                        onClick={() => handleDeclineBooking(booking.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Decline Booking
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


