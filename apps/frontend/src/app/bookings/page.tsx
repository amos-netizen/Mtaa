'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { bookingsApi } from '@/lib/api/bookings';

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({ preferredDate: '', preferredTime: '', message: '' });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          router.push('/auth/login');
          return;
        }
        const data = await bookingsApi.getAll(1, 20);
        setBookings(data.bookings || []);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [router]);

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingsApi.cancel(bookingId);
      setBookings(bookings.filter(b => b.id !== bookingId));
      alert('Booking cancelled successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleReschedule = async () => {
    if (!selectedBooking) return;
    try {
      await bookingsApi.update(selectedBooking.id, rescheduleData);
      alert('Booking rescheduled successfully!');
      setShowRescheduleModal(false);
      setRescheduleData({ preferredDate: '', preferredTime: '', message: '' });
      // Refresh bookings
      const data = await bookingsApi.getAll(1, 20);
      setBookings(data.bookings || []);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reschedule');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📅 My Bookings</h1>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No bookings yet</p>
            <Link
              href="/services"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {booking.service?.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{booking.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>Provider: {booking.service?.author?.fullName}</span>
                      {booking.service?.author?.phoneNumber && (
                        <>
                          <span>•</span>
                          <a href={`tel:${booking.service.author.phoneNumber}`} className="text-primary-600 hover:underline">
                            Call
                          </a>
                        </>
                      )}
                      <span>•</span>
                      <span>Booked: {new Date(booking.createdAt).toLocaleDateString()}</span>
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded text-xs">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowRescheduleModal(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Reschedule Booking
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Preferred Date
                </label>
                <input
                  type="date"
                  value={rescheduleData.preferredDate}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, preferredDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Preferred Time
                </label>
                <input
                  type="time"
                  value={rescheduleData.preferredTime}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, preferredTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={rescheduleData.message}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Optional message..."
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleReschedule}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Reschedule
              </button>
              <button
                onClick={() => {
                  setShowRescheduleModal(false);
                  setRescheduleData({ preferredDate: '', preferredTime: '', message: '' });
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}










