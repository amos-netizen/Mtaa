'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { servicesApi } from '@/lib/api/services';

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [bookingData, setBookingData] = useState({ preferredDate: '', preferredTime: '', message: '' });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          router.push('/auth/login');
          return;
        }
        const data = await servicesApi.getAll(1, 20);
        setServices(data.services || []);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [router]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await servicesApi.getAll(1, 20, undefined, search);
      setServices(data.services || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedService || !bookingData.message.trim()) {
      alert('Please fill in the booking message');
      return;
    }
    try {
      await servicesApi.book(selectedService.id, bookingData);
      alert('Service booked successfully!');
      setShowBookModal(false);
      setBookingData({ preferredDate: '', preferredTime: '', message: '' });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to book service');
    }
  };

  if (loading && services.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🔧 Local Services</h1>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
                Dashboard
              </Link>
              <button
                onClick={() => router.push('/services/create')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Search Services
          </button>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          {services.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No services found</p>
            </div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>By {service.author?.fullName || service.author?.username}</span>
                      {service.author?.phoneNumber && (
                        <>
                          <span>•</span>
                          <a href={`tel:${service.author.phoneNumber}`} className="text-primary-600 hover:underline">
                            Call Provider
                          </a>
                        </>
                      )}
                      {service.neighborhood && (
                        <>
                          <span>•</span>
                          <span>{service.neighborhood.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        setShowBookModal(true);
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                    >
                      Book Service
                    </button>
                    <button
                      onClick={() => router.push(`/services/${service.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      View Provider
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Book Modal */}
      {showBookModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Book Service: {selectedService.title}
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
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Book Service
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






