'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';
import { postsApi } from '@/lib/api/posts';
import { neighborhoodsApi } from '@/lib/api/neighborhoods';

export default function AlertsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
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
          
          // Set default neighborhood to user's primary neighborhood
          const primaryNeighborhood = userData?.userNeighborhoods?.find((n: any) => n.isPrimary);
          if (primaryNeighborhood) {
            setSelectedNeighborhood(primaryNeighborhood.neighborhoodId);
          }
        } catch (error) {
          console.error('Failed to fetch neighborhoods:', error);
        }

        // Fetch safety alerts (posts with type SAFETY_ALERT)
        try {
          const postsData = await postsApi.getAll(1, 50, selectedNeighborhood || undefined, 'SAFETY_ALERT');
          // Filter for safety alerts
          const safetyAlerts = (postsData.posts || []).filter(
            (post: any) => post.type === 'SAFETY_ALERT'
          );
          setAlerts(safetyAlerts);
        } catch (error) {
          console.error('Failed to fetch alerts:', error);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, selectedNeighborhood]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const neighborhoodId = selectedNeighborhood || 
        user?.userNeighborhoods?.[0]?.neighborhoodId || 
        user?.neighborhoodId;
      
      if (!neighborhoodId) {
        alert('Please select a neighborhood first');
        return;
      }

      await postsApi.create({
        title: formData.title,
        description: formData.description,
        neighborhoodId,
        type: 'SAFETY_ALERT',
        category: 'SAFETY',
      });

      // Refresh alerts
      const postsData = await postsApi.getAll(1, 50, selectedNeighborhood || undefined);
      const safetyAlerts = (postsData.posts || []).filter(
        (post: any) => post.type === 'SAFETY_ALERT'
      );
      setAlerts(safetyAlerts);

      // Reset form
      setFormData({ title: '', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create alert:', error);
      alert('Failed to create alert. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-red-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚨</span>
              <h1 className="text-2xl font-bold text-white">Emergency Alerts</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-red-100 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                {showForm ? 'Cancel' : '+ Create Alert'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Important Notice */}
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200">Important Safety Notice</h3>
              <p className="text-sm text-red-800 dark:text-red-300">
                Only share verified safety information. False alerts may cause panic and could have legal consequences.
                For life-threatening emergencies, please call <strong>999</strong> or <strong>112</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Neighborhood Filter */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Neighborhood:
            </label>
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Neighborhoods</option>
              {neighborhoods.map((neighborhood) => (
                <option key={neighborhood.id} value={neighborhood.id}>
                  {neighborhood.name} - {neighborhood.city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Create Alert Form */}
        {showForm && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>🚨</span> Create Safety Alert
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alert Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Road closure on Thika Road"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alert Details *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={4}
                  placeholder="Describe the emergency or safety concern in detail..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Neighborhood *
                </label>
                <select
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select neighborhood</option>
                  {neighborhoods.map((neighborhood) => (
                    <option key={neighborhood.id} value={neighborhood.id}>
                      {neighborhood.name} - {neighborhood.city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Posting...' : '🚨 Share Alert'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <span className="text-6xl mb-4 block">🛡️</span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Active Alerts
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Your neighborhood is safe! There are no active emergency alerts at this time.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Report a Safety Concern
              </button>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🚨</span>
                    <div>
                      <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">
                        {alert.title}
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {alert.neighborhood?.name || 'Unknown Area'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-3 py-1 rounded-full">
                    {new Date(alert.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-red-800 dark:text-red-200 mb-4">
                  {alert.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-red-600 dark:text-red-400">
                  <span>Posted by {alert.author?.fullName || 'Community Member'}</span>
                  <span>•</span>
                  <span>{alert.likeCount || 0} confirmations</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Emergency Contacts */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📞 Emergency Contacts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="font-semibold text-red-900 dark:text-red-200">Police</p>
              <p className="text-2xl font-bold text-red-600">999 / 112</p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="font-semibold text-orange-900 dark:text-orange-200">Fire Brigade</p>
              <p className="text-2xl font-bold text-orange-600">999</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="font-semibold text-blue-900 dark:text-blue-200">Ambulance</p>
              <p className="text-2xl font-bold text-blue-600">999</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
