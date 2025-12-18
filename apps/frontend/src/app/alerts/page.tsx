'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { authApi } from '@/lib/api/auth';
import { postsApi } from '@/lib/api/posts';
import { neighborhoodsApi } from '@/lib/api/neighborhoods';
import { useGeolocation, KENYA_LOCATIONS } from '@/lib/hooks/useGeolocation';
import { useRealtimePolling } from '@/lib/hooks/useRealtimePolling';
import { notificationService } from '@/lib/services/notificationService';
import { AlertSkeleton, ListSkeleton } from '@/components/ui/LoadingSkeleton';

// Dynamic imports for map components
const SafetyAlertMap = dynamic(() => import('@/components/maps/SafetyAlertMap'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center animate-pulse">
      <span className="text-gray-500">Loading map...</span>
    </div>
  ),
});

const LocationPicker = dynamic(() => import('@/components/maps/LocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center animate-pulse">
      <span className="text-gray-500">Loading location picker...</span>
    </div>
  ),
});

type ViewMode = 'list' | 'map';
type AlertType = 'CRIME' | 'FIRE' | 'ACCIDENT' | 'SUSPICIOUS_ACTIVITY' | 'NATURAL_DISASTER' | 'OTHER';

const ALERT_TYPE_OPTIONS: { value: AlertType; label: string; icon: string }[] = [
  { value: 'CRIME', label: 'Crime', icon: '🚔' },
  { value: 'FIRE', label: 'Fire', icon: '🔥' },
  { value: 'ACCIDENT', label: 'Accident', icon: '🚗' },
  { value: 'SUSPICIOUS_ACTIVITY', label: 'Suspicious Activity', icon: '👁️' },
  { value: 'NATURAL_DISASTER', label: 'Natural Disaster', icon: '🌪️' },
  { value: 'OTHER', label: 'Other', icon: '⚠️' },
];

export default function AlertsPage() {
  const router = useRouter();
  const { latitude, longitude, requestLocation } = useGeolocation();
  const [user, setUser] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    alertType: 'OTHER' as AlertType,
    isUrgent: false,
    location: null as { lat: number; lng: number } | null,
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

        // Request notification permission for urgent alerts
        await notificationService.requestPermission();

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

        // Initial fetch
        await fetchAlerts();
      } catch (error) {
        console.error('Failed to fetch data:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const fetchAlerts = async () => {
    try {
      const postsData = await postsApi.getAll(1, 50, selectedNeighborhood || undefined, 'SAFETY_ALERT');
      const safetyAlerts = (postsData.posts || []).filter(
        (post: any) => post.type === 'SAFETY_ALERT'
      );
      
      // Check for new urgent alerts and notify
      if (alerts.length > 0 && safetyAlerts.length > 0) {
        const existingIds = new Set(alerts.map(a => a.id));
        const newUrgentAlerts = safetyAlerts.filter(
          (alert: any) => !existingIds.has(alert.id) && alert.metadata?.isUrgent
        );
        
        for (const alert of newUrgentAlerts) {
          await notificationService.showUrgentAlert(
            alert.title,
            alert.description.substring(0, 100),
            { alertId: alert.id, type: alert.metadata?.alertType }
          );
        }
      }
      
      setAlerts(safetyAlerts);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  // Real-time polling for alerts (every 20 seconds for urgent updates)
  useRealtimePolling({
    enabled: !loading && !!user,
    interval: 20000,
    onPoll: fetchAlerts,
    immediate: false,
  });

  // Refetch when neighborhood changes
  useEffect(() => {
    if (!loading && user) {
      fetchAlerts();
    }
  }, [selectedNeighborhood]);

  // Convert alerts to SafetyAlertMap format
  const mapAlerts = alerts.map((alert) => ({
    id: alert.id,
    type: (alert.metadata?.alertType as AlertType) || 'OTHER',
    title: alert.title,
    description: alert.description,
    lat: alert.metadata?.location?.lat || alert.neighborhood?.latitude || KENYA_LOCATIONS.nairobi.lat + (Math.random() - 0.5) * 0.05,
    lng: alert.metadata?.location?.lng || alert.neighborhood?.longitude || KENYA_LOCATIONS.nairobi.lon + (Math.random() - 0.5) * 0.05,
    isUrgent: alert.metadata?.isUrgent || false,
    isVerified: alert.isVerified || false,
    createdAt: alert.createdAt,
    author: alert.author,
  }));

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
        metadata: {
          alertType: formData.alertType,
          isUrgent: formData.isUrgent,
          location: formData.location,
        },
      });

      // Refresh alerts
      await fetchAlerts();

      // Reset form
      setFormData({ 
        title: '', 
        description: '', 
        alertType: 'OTHER', 
        isUrgent: false, 
        location: null 
      });
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <ListSkeleton count={3} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-pulse">🚨</span>
              <div>
                <h1 className="text-2xl font-bold text-white">Emergency Alerts</h1>
                <p className="text-red-200 text-sm">Real-time safety updates in your area</p>
              </div>
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
                className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
              >
                {showForm ? (
                  <>✕ Cancel</>
                ) : (
                  <>🚨 Report Alert</>
                )}
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

        {/* View Toggle & Filters */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by Neighborhood:
              </label>
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white bg-white text-gray-900 appearance-none cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">All Neighborhoods</option>
                {neighborhoods.map((neighborhood) => (
                  <option 
                    key={neighborhood.id} 
                    value={neighborhood.id}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {neighborhood.name} - {neighborhood.city}
                  </option>
                ))}
              </select>
            </div>

            {/* View mode toggle */}
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  viewMode === 'map'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                }`}
              >
                🗺️ Map View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                }`}
              >
                📋 List View
              </button>
            </div>
          </div>
        </div>

        {/* Create Alert Form */}
        {showForm && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-red-200 dark:border-red-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="animate-pulse">🚨</span> Report Safety Alert
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Alert Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alert Type *
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALERT_TYPE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, alertType: option.value })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                        formData.alertType === option.value
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {option.icon} {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgent toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isUrgent"
                  checked={formData.isUrgent}
                  onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                  className="w-5 h-5 rounded border-red-300 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="isUrgent" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="text-red-600 animate-pulse">⚡</span> 
                  Mark as URGENT (immediate danger)
                </label>
              </div>

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

              {/* Location Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  📍 Alert Location (optional but recommended)
                </label>
                <LocationPicker
                  onLocationSelect={(loc) => setFormData({ ...formData, location: { lat: loc.lat, lng: loc.lng } })}
                  initialLocation={formData.location || undefined}
                  height="250px"
                  showPresets={true}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Neighborhood *
                </label>
                <select
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white bg-white text-gray-900 appearance-none cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                  required
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">Select neighborhood</option>
                  {neighborhoods.length > 0 ? (
                    neighborhoods.map((neighborhood) => (
                      <option 
                        key={neighborhood.id} 
                        value={neighborhood.id}
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {neighborhood.name} - {neighborhood.city}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled className="bg-white dark:bg-gray-700 text-gray-500">
                      Loading neighborhoods...
                    </option>
                  )}
                </select>
                {neighborhoods.length === 0 && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    No neighborhoods available. Please check your connection.
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Posting...
                    </>
                  ) : (
                    <>🚨 Share Alert</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Map View */}
        {viewMode === 'map' && !showForm && (
          <div className="mb-8">
            <SafetyAlertMap
              alerts={mapAlerts}
              height="500px"
              showUserLocation={true}
              onAlertClick={(alert) => console.log('Alert clicked:', alert)}
            />
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
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
                  className={`bg-white dark:bg-gray-800 border-2 rounded-lg p-6 ${
                    alert.metadata?.isUrgent
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {ALERT_TYPE_OPTIONS.find(o => o.value === alert.metadata?.alertType)?.icon || '🚨'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {alert.title}
                          </h3>
                          {alert.metadata?.isUrgent && (
                            <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse">
                              URGENT
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {alert.neighborhood?.name || 'Unknown Area'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      {new Date(alert.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {alert.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Posted by {alert.author?.fullName || 'Community Member'}</span>
                    <span>•</span>
                    <span>{alert.likeCount || 0} confirmations</span>
                    {alert.metadata?.location && (
                      <>
                        <span>•</span>
                        <button
                          onClick={() => window.open(`https://www.google.com/maps?q=${alert.metadata.location.lat},${alert.metadata.location.lng}`, '_blank')}
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          📍 View on Map
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Emergency Contacts */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📞 Emergency Contacts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="tel:999" className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition">
              <p className="font-semibold text-red-900 dark:text-red-200">Police Emergency</p>
              <p className="text-2xl font-bold text-red-600">999 / 112</p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">Tap to call</p>
            </a>
            <a href="tel:999" className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition">
              <p className="font-semibold text-orange-900 dark:text-orange-200">Fire Brigade</p>
              <p className="text-2xl font-bold text-orange-600">999</p>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">Tap to call</p>
            </a>
            <a href="tel:999" className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition">
              <p className="font-semibold text-blue-900 dark:text-blue-200">Ambulance</p>
              <p className="text-2xl font-bold text-blue-600">999</p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Tap to call</p>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}


