'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useGeolocation, calculateDistance, formatDistance, KENYA_LOCATIONS } from '@/lib/hooks/useGeolocation';
import { nearbyApi, NearbyItem } from '@/lib/api/nearby';

// Dynamic imports to avoid SSR issues
const MapContainer = dynamic(() => import('@/components/maps/MapContainer'), { 
  ssr: false,
  loading: () => <MapLoadingSkeleton />
});

const LiveLocationTracker = dynamic(() => import('@/components/maps/LiveLocationTracker'), {
  ssr: false,
});

function MapLoadingSkeleton() {
  return (
    <div className="h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <svg className="animate-spin h-8 w-8 mx-auto text-primary-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Loading map...</p>
      </div>
    </div>
  );
}

// Fallback mock data for demo when API is not available
const MOCK_NEARBY_ITEMS = [
  { id: '1', type: 'marketplace', title: 'iPhone 13 Pro', price: 85000, lat: -1.2900, lng: 36.8200, category: 'Electronics', image: '📱' },
  { id: '2', type: 'marketplace', title: 'Leather Sofa', price: 45000, lat: -1.2950, lng: 36.8150, category: 'Furniture', image: '🛋️' },
  { id: '3', type: 'service', title: 'Plumbing Services', provider: 'John Fundi', lat: -1.2880, lng: 36.8250, rating: 4.8, image: '🔧' },
  { id: '4', type: 'service', title: 'House Cleaning', provider: 'Mary Cleaners', lat: -1.2920, lng: 36.8100, rating: 4.5, image: '🧹' },
  { id: '5', type: 'job', title: 'Driver Needed', company: 'FastTaxi Ltd', lat: -1.2960, lng: 36.8220, salary: '35,000/month', image: '🚗' },
  { id: '6', type: 'alert', title: 'Road Accident', description: 'Traffic jam on Ngong Road', lat: -1.2940, lng: 36.8050, urgency: 'high', image: '🚨' },
  { id: '7', type: 'marketplace', title: 'Samsung TV 55"', price: 65000, lat: -1.2870, lng: 36.8180, category: 'Electronics', image: '📺' },
  { id: '8', type: 'service', title: 'Electrician', provider: 'Peter Electric', lat: -1.2910, lng: 36.8280, rating: 4.9, image: '⚡' },
];

type ItemType = 'all' | 'marketplace' | 'service' | 'job' | 'alert';
type ViewMode = 'map' | 'list' | 'split';

export default function NearbyPage() {
  const { latitude, longitude, loading: locationLoading, error: locationError, requestLocation } = useGeolocation();
  const [selectedType, setSelectedType] = useState<ItemType>('all');
  const [radiusKm, setRadiusKm] = useState(5);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [apiItems, setApiItems] = useState<NearbyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLocationTracker, setShowLocationTracker] = useState(false);

  // Fetch nearby items from API when location changes
  const fetchNearbyItems = useCallback(async () => {
    if (!latitude || !longitude) return;
    
    setIsLoading(true);
    try {
      const types = selectedType === 'all' 
        ? ['marketplace', 'alert', 'event']
        : [selectedType];
      
      const response = await nearbyApi.getAll({
        latitude,
        longitude,
        radius: radiusKm,
        types,
        limit: 100,
      });
      
      setApiItems(response.items);
    } catch (error) {
      console.error('Failed to fetch nearby items:', error);
      // Fall back to mock data on error
      setApiItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [latitude, longitude, radiusKm, selectedType]);

  useEffect(() => {
    fetchNearbyItems();
  }, [fetchNearbyItems]);

  // Filter and sort items by distance - use API data if available, otherwise mock data
  const nearbyItems = useMemo(() => {
    // If we have API items, use those
    if (apiItems.length > 0) {
      return apiItems.map(item => ({
        ...item,
        image: item.type === 'marketplace' ? '🛒' :
               item.type === 'alert' ? '🚨' :
               item.type === 'event' ? '📅' :
               item.type === 'service' ? '🔧' : '📍',
      }));
    }

    // Fall back to mock data
    if (!latitude || !longitude) return MOCK_NEARBY_ITEMS;

    return MOCK_NEARBY_ITEMS
      .filter(item => selectedType === 'all' || item.type === selectedType)
      .map(item => ({
        ...item,
        distance: calculateDistance(latitude, longitude, item.lat, item.lng),
      }))
      .filter(item => item.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }, [apiItems, latitude, longitude, selectedType, radiusKm]);

  // Convert items to map markers
  const mapMarkers = useMemo(() => {
    return nearbyItems.map((item: any) => ({
      id: item.id,
      lat: item.lat,
      lng: item.lng,
      title: item.title,
      description: item.type === 'marketplace' 
        ? `KSh ${(item.price || item.data?.price)?.toLocaleString() || 'N/A'}`
        : item.type === 'service'
        ? `⭐ ${item.rating || item.data?.rating || 'N/A'}`
        : item.type === 'job'
        ? item.salary || item.data?.salary || 'N/A'
        : item.description || item.data?.description || '',
      type: item.type as any,
      onClick: () => setSelectedItem(item.id),
    }));
  }, [nearbyItems]);

  const typeFilters: { value: ItemType; label: string; icon: string; color: string }[] = [
    { value: 'all', label: 'All', icon: '📍', color: 'bg-gray-500' },
    { value: 'marketplace', label: 'Marketplace', icon: '🛒', color: 'bg-green-500' },
    { value: 'service', label: 'Services', icon: '🔧', color: 'bg-blue-500' },
    { value: 'job', label: 'Jobs', icon: '💼', color: 'bg-yellow-500' },
    { value: 'alert', label: 'Alerts', icon: '🚨', color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  📍 Nearby
                </h1>
                {latitude && longitude ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing items within {radiusKm}km of your location
                  </p>
                ) : (
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Enable location to see nearby items
                  </p>
                )}
              </div>
            </div>

            {/* View mode toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLocationTracker(!showLocationTracker)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                  showLocationTracker
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className={showLocationTracker ? 'animate-pulse' : ''}>📍</span>
                Live
              </button>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {[
                  { mode: 'map' as ViewMode, icon: '🗺️', label: 'Map' },
                  { mode: 'split' as ViewMode, icon: '📊', label: 'Split' },
                  { mode: 'list' as ViewMode, icon: '📋', label: 'List' },
                ].map(({ mode, icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                      viewMode === mode
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {/* Type filters */}
            <div className="flex flex-wrap gap-2">
              {typeFilters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedType(filter.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    selectedType === filter.value
                      ? `${filter.color} text-white`
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {filter.icon} {filter.label}
                </button>
              ))}
            </div>

            {/* Radius selector */}
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-sm text-gray-600 dark:text-gray-400">Radius:</label>
              <select
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value={1}>1 km</option>
                <option value={2}>2 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={20}>20 km</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Location error/loading state */}
        {!latitude && !longitude && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                  Location Required
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {locationError || 'Enable location access to see items near you'}
                </p>
              </div>
              <button
                onClick={requestLocation}
                disabled={locationLoading}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition"
              >
                {locationLoading ? 'Getting location...' : 'Enable Location'}
              </button>
            </div>
          </div>
        )}

        {/* Live Location Tracker Sidebar */}
        {showLocationTracker && (
          <div className="mb-6">
            <LiveLocationTracker
              onLocationUpdate={(lat, lng) => {
                console.log('Location updated:', lat, lng);
              }}
              showShareButton={true}
            />
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Fetching nearby items...
          </div>
        )}

        {/* Content based on view mode */}
        <div className={`grid gap-6 ${
          viewMode === 'split' ? 'lg:grid-cols-2' : ''
        }`}>
          {/* Map view */}
          {(viewMode === 'map' || viewMode === 'split') && (
            <div className={viewMode === 'map' ? 'col-span-full' : ''}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <MapContainer
                  center={latitude && longitude ? [latitude, longitude] : [-1.2921, 36.8219]}
                  zoom={14}
                  height={viewMode === 'map' ? '600px' : '500px'}
                  markers={mapMarkers}
                  showUserLocation={!!latitude && !!longitude}
                  userLocation={latitude && longitude ? { lat: latitude, lng: longitude } : null}
                  radiusKm={radiusKm}
                />
              </div>
            </div>
          )}

          {/* List view */}
          {(viewMode === 'list' || viewMode === 'split') && (
            <div className={viewMode === 'list' ? 'col-span-full' : ''}>
              <div className="space-y-3">
                {/* Results count */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {nearbyItems.length} items found
                  </h2>
                </div>

                {/* Items list */}
                {nearbyItems.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
                    <span className="text-4xl">🔍</span>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                      No items found nearby
                    </h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      Try increasing the search radius or changing filters
                    </p>
                  </div>
                ) : (
                  <div className={`grid gap-3 ${viewMode === 'list' ? 'sm:grid-cols-2 lg:grid-cols-3' : ''}`}>
                    {nearbyItems.map((item: any) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item.id)}
                        className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer border-2 ${
                          selectedItem === item.id
                            ? 'border-primary-500'
                            : 'border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">{item.image}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                item.type === 'marketplace' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                item.type === 'service' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                item.type === 'job' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {item.type}
                              </span>
                              {item.distance && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  📍 {formatDistance(item.distance)}
                                </span>
                              )}
                            </div>
                            <h3 className="mt-1 font-semibold text-gray-900 dark:text-white truncate">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {item.type === 'marketplace' && `KSh ${item.price?.toLocaleString()}`}
                              {item.type === 'service' && `${item.provider} • ⭐ ${item.rating}`}
                              {item.type === 'job' && `${item.company} • ${item.salary}`}
                              {item.type === 'alert' && item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating action button for mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <button
          onClick={requestLocation}
          className="w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 flex items-center justify-center transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

