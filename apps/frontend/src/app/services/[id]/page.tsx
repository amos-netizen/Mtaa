'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { servicesApi } from '@/lib/api/services';
import { authApi } from '@/lib/api/auth';

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params?.id as string;
  const [service, setService] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({ preferredDate: '', preferredTime: '', message: '' });
  const [showBookModal, setShowBookModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const [serviceData, userData] = await Promise.all([
          servicesApi.getOne(serviceId),
          authApi.getMe(),
        ]);

        setService(serviceData);
        setUser(userData);
      } catch (error: any) {
        console.error('Failed to fetch service:', error);
        if (error.response?.status === 404) {
          router.push('/services');
        }
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchData();
    }
  }, [serviceId, router]);

  const handleBook = async () => {
    if (!bookingData.message.trim()) {
      alert('Please fill in the booking message');
      return;
    }
    setSubmitting(true);
    try {
      await servicesApi.book(serviceId, bookingData);
      alert('Service booked successfully!');
      setShowBookModal(false);
      setBookingData({ preferredDate: '', preferredTime: '', message: '' });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to book service');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading service...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Service not found</p>
          <Link href="/services" className="text-purple-600 hover:text-purple-700">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === service.authorId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/services"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Services
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Service Details</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Service Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{service.title}</h1>
            {service.category && (
              <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                {service.category}
              </span>
            )}
          </div>

          {/* Service Content */}
          <div className="p-6">
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{service.description}</p>
            </div>

            {/* Service Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {service.neighborhood && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Location</h3>
                  <p className="text-gray-900 dark:text-white">{service.neighborhood.name}</p>
                </div>
              )}
              {service.price && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Price</h3>
                  <p className="text-gray-900 dark:text-white font-semibold">KES {service.price.toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* Provider Info */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Service Provider</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                  {service.author?.profileImageUrl ? (
                    <img
                      src={service.author.profileImageUrl}
                      alt={service.author.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{service.author?.fullName?.charAt(0)?.toUpperCase() || 'P'}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {service.author?.fullName || service.author?.username}
                  </h4>
                  {service.author?.phoneNumber && (
                    <a
                      href={`tel:${service.author.phoneNumber}`}
                      className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      📞 {service.author.phoneNumber}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            {!isOwner && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowBookModal(true)}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                >
                  Book This Service
                </button>
              </div>
            )}

            {isOwner && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex gap-4">
                <button
                  onClick={() => router.push(`/services/${serviceId}/edit`)}
                  className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                >
                  Edit Service
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Book Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Book Service: {service.title}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={bookingData.preferredDate}
                  onChange={(e) => setBookingData({ ...bookingData, preferredDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Time
                </label>
                <input
                  type="time"
                  value={bookingData.preferredTime}
                  onChange={(e) => setBookingData({ ...bookingData, preferredTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  value={bookingData.message}
                  onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Describe what you need..."
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleBook}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {submitting ? 'Booking...' : 'Book Service'}
              </button>
              <button
                onClick={() => {
                  setShowBookModal(false);
                  setBookingData({ preferredDate: '', preferredTime: '', message: '' });
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

