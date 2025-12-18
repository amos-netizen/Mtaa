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
  const [searchQuery, setSearchQuery] = useState('');
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);
  const [useTestLocation, setUseTestLocation] = useState(false);

  // Test location for Kiambu Road (for development/testing)
  const testLocation = { lat: -1.2800, lng: 36.8000 };

  // Automatically request location on page load
  useEffect(() => {
    if (!latitude && !longitude && !locationLoading && !hasRequestedLocation && !useTestLocation) {
      setHasRequestedLocation(true);
      // Small delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        requestLocation();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [latitude, longitude, locationLoading, hasRequestedLocation, requestLocation, useTestLocation]);

  // Show success message when location is detected
  useEffect(() => {
    if (latitude && longitude) {
      console.log('✅ Location detected:', latitude, longitude);
      console.log('📍 Fetching nearby activities...');
    }
  }, [latitude, longitude]);

  // Use test location if enabled
  const currentLat = useTestLocation ? testLocation.lat : latitude;
  const currentLng = useTestLocation ? testLocation.lng : longitude;

  // Fetch nearby items from API when location changes
  const fetchNearbyItems = useCallback(async () => {
    const lat = useTestLocation ? testLocation.lat : latitude;
    const lng = useTestLocation ? testLocation.lng : longitude;
    
    if (!lat || !lng) return;
    
    setIsLoading(true);
    try {
      const types = selectedType === 'all' 
        ? ['marketplace', 'alert', 'event', 'service', 'place']
        : selectedType === 'service'
        ? ['service', 'place'] // Include both user services and real-world places
        : [selectedType];
      
      const response = await nearbyApi.getAll({
        latitude: lat,
        longitude: lng,
        radius: radiusKm,
        types,
        limit: 100,
      });
      
      setApiItems(response.items);
    } catch (error) {
      console.error('Failed to fetch nearby items:', error);
      setApiItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [latitude, longitude, radiusKm, selectedType, useTestLocation]);

  useEffect(() => {
    fetchNearbyItems();
  }, [fetchNearbyItems]);

  // Filter and sort items by distance and search query
  const nearbyItems = useMemo(() => {
    let filtered = apiItems;

    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const searchTerms = query.split(/\s+/).filter(term => term.length > 0); // Split into search terms
      
      filtered = filtered.filter((item: any) => {
        // If multiple terms, all must match (AND logic)
        return searchTerms.every(term => {
          const titleMatch = item.title?.toLowerCase().includes(term);
          const descMatch = item.description?.toLowerCase().includes(term);
          const categoryMatch = item.data?.category?.toLowerCase().includes(term);
          const authorMatch = item.data?.author?.fullName?.toLowerCase().includes(term);
          const addressMatch = item.data?.address?.toLowerCase().includes(term);
          const phoneMatch = item.data?.phoneNumber?.toLowerCase().includes(term);
          
          // Smart matching for place categories
          const placeCategoryMatch = item.type === 'place' && (
            (item.data?.category === 'HOSPITAL' && (term.includes('hospital') || term.includes('clinic') || term.includes('doctor') || term.includes('medical') || term.includes('health'))) ||
            (item.data?.category === 'PHARMACY' && (term.includes('pharmacy') || term.includes('drug') || term.includes('medicine') || term.includes('chemist'))) ||
            (item.data?.category === 'CLINIC' && (term.includes('clinic') || term.includes('hospital') || term.includes('doctor') || term.includes('medical'))) ||
            (item.data?.category === 'BANK' && (term.includes('bank') || term.includes('atm') || term.includes('money') || term.includes('financial'))) ||
            (item.data?.category === 'POLICE_STATION' && (term.includes('police') || term.includes('security') || term.includes('cop'))) ||
            (item.data?.category === 'FIRE_STATION' && (term.includes('fire') || term.includes('emergency'))) ||
            (item.data?.category === 'SCHOOL' && (term.includes('school') || term.includes('education') || term.includes('learn'))) ||
            (item.data?.category === 'RESTAURANT' && (term.includes('restaurant') || term.includes('food') || term.includes('eat') || term.includes('dine'))) ||
            (item.data?.category === 'SHOP' && (term.includes('shop') || term.includes('store') || term.includes('buy') || term.includes('mall'))) ||
            (item.data?.category === 'GAS_STATION' && (term.includes('gas') || term.includes('fuel') || term.includes('petrol') || term.includes('station')))
          );
          
          return titleMatch || descMatch || categoryMatch || authorMatch || addressMatch || phoneMatch || placeCategoryMatch;
        });
      });
    }

    return filtered.map(item => ({
      ...item,
      image: item.type === 'marketplace' ? '🛒' :
             item.type === 'alert' ? '🚨' :
             item.type === 'event' ? '📅' :
             item.type === 'service' ? '🔧' :
             item.type === 'place' ? (
               item.data?.category === 'HOSPITAL' ? '🏥' :
               item.data?.category === 'PHARMACY' ? '💊' :
               item.data?.category === 'CLINIC' ? '🏥' :
               item.data?.category === 'BANK' ? '🏦' :
               item.data?.category === 'POLICE_STATION' ? '🚔' :
               item.data?.category === 'FIRE_STATION' ? '🚒' :
               '📍'
             ) : '📍',
    }));
  }, [apiItems, searchQuery]);

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
        ? `${item.data?.author?.fullName || 'Service'} • ${item.data?.category || 'Service'}`
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

  const getItemUrl = (item: any) => {
    switch (item.type) {
      case 'marketplace':
        return `/marketplace/${item.id}`;
      case 'service':
        return `/services`;
      case 'place':
        // For places, show details in a modal or link to map
        return `#place-${item.id}`;
      case 'job':
        return `/jobs/${item.id}`;
      case 'alert':
        return `/alerts`;
      case 'event':
        return `/events/${item.id}`;
      default:
        return '/dashboard';
    }
  };

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
                {(currentLat && currentLng) ? (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Showing items within {radiusKm}km {useTestLocation ? 'of Kiambu Road (Test Location)' : 'of your location'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      📍 {useTestLocation ? 'Test' : 'Detected'} location: {currentLat.toFixed(4)}, {currentLng.toFixed(4)}
                    </p>
                    {nearbyItems.length > 0 && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        ✅ {nearbyItems.length} {nearbyItems.length === 1 ? 'activity' : 'activities'} found nearby
                      </p>
                    )}
                  </div>
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

          {/* Search Bar */}
          <div className="mt-4">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                // Search is handled by client-side filtering via nearbyItems useMemo
                // Just ensure we have items loaded
                if (!currentLat || !currentLng) {
                  if (useTestLocation) {
                    fetchNearbyItems();
                  } else {
                    requestLocation();
                  }
                }
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      // Search filtering happens automatically via nearbyItems useMemo
                      // Just ensure location is available
                      if (!currentLat || !currentLng) {
                        if (useTestLocation) {
                          fetchNearbyItems();
                        } else {
                          requestLocation();
                        }
                      }
                    }
                  }}
                  placeholder="Search hospitals, pharmacies, services, items near you..."
                  className="w-full px-4 py-2 pl-10 pr-10 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading || (!currentLat && !currentLng && !useTestLocation)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                title={searchQuery ? `Search for "${searchQuery}" near you` : "Search nearby items"}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
                Search
              </button>
            </form>
            {searchQuery && currentLat && currentLng && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                🔍 Searching for "{searchQuery}" in activities near your location...
              </p>
            )}
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
        {/* Test location button for development */}
        {!currentLat && !currentLng && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  🧪 Test with Kiambu Road Location
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Use test location to see how the app works without granting browser permissions
                </p>
              </div>
              <button
                onClick={() => {
                  setUseTestLocation(true);
                  fetchNearbyItems();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Use Test Location
              </button>
            </div>
          </div>
        )}

        {/* Location error/loading state */}
        {!currentLat && !currentLng && (
          <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-shrink-0">
                <span className="text-4xl">📍</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
                  {locationLoading ? 'Detecting Your Location...' : 'Location Access Required'}
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  {locationLoading 
                    ? 'Please allow location access in your browser to find nearby services, items, and alerts.'
                    : locationError 
                    ? locationError 
                    : 'To show you nearby items, we need access to your location. Click the button below and allow location access when prompted.'}
                </p>
                {locationError && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-700 dark:text-red-300">
                    <strong>Tip:</strong> Check your browser settings to ensure location permissions are enabled for this site.
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setHasRequestedLocation(true);
                  requestLocation();
                }}
                disabled={locationLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
              >
                {locationLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Detecting...
                  </>
                ) : (
                  <>
                    <span>📍</span>
                    Allow Location Access
                  </>
                )}
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
                  center={currentLat && currentLng ? [currentLat, currentLng] : [-1.2921, 36.8219]}
                  zoom={14}
                  height={viewMode === 'map' ? '600px' : '500px'}
                  markers={mapMarkers}
                  showUserLocation={!!currentLat && !!currentLng}
                  userLocation={currentLat && currentLng ? { lat: currentLat, lng: currentLng } : null}
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
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {nearbyItems.length} {searchQuery ? 'matching' : ''} {nearbyItems.length === 1 ? 'activity' : 'activities'} found
                      {searchQuery && <span className="text-sm font-normal text-gray-500"> for "{searchQuery}"</span>}
                    </h2>
                    {currentLat && currentLng && nearbyItems.length > 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        📍 Showing activities {useTestLocation ? 'near Kiambu Road' : 'near your location'} on the map
                      </p>
                    )}
                  </div>
                </div>

                {/* Items list */}
                {nearbyItems.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
                    <span className="text-4xl">🔍</span>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                      {searchQuery ? 'No matching items found' : 'No items found nearby'}
                    </h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      {searchQuery 
                        ? 'Try different search terms or clear the search'
                        : 'Try increasing the search radius or changing filters'}
                    </p>
                  </div>
                ) : (
                  <div className={`grid gap-3 ${viewMode === 'list' ? 'sm:grid-cols-2 lg:grid-cols-3' : ''}`}>
                    {nearbyItems.map((item: any) => (
                      <Link
                        key={item.id}
                        href={getItemUrl(item)}
                        className={`block bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer border-2 ${
                          selectedItem === item.id
                            ? 'border-blue-500'
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
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                              {item.type === 'marketplace' && `KSh ${item.price?.toLocaleString() || item.data?.price?.toLocaleString() || 'N/A'}`}
                              {item.type === 'service' && (
                                <>
                                  {item.data?.author?.fullName || 'Service Provider'}
                                  {item.data?.category && ` • ${item.data.category}`}
                                  {item.data?.author?.phoneNumber && (
                                    <span className="block text-xs text-gray-500">📞 {item.data.author.phoneNumber}</span>
                                  )}
                                </>
                              )}
                              {item.type === 'place' && (
                                <>
                                  {item.data?.address && <span className="block">{item.data.address}</span>}
                                  {item.data?.phoneNumber && <span className="block text-xs text-gray-500">📞 {item.data.phoneNumber}</span>}
                                  {item.data?.rating && <span className="block text-xs text-yellow-600">⭐ {item.data.rating.toFixed(1)}</span>}
                                </>
                              )}
                              {item.type === 'job' && `${item.company || item.data?.company || 'N/A'} • ${item.salary || item.data?.salary || 'N/A'}`}
                              {item.type === 'alert' && (item.description || item.data?.description || '')}
                              {item.type === 'event' && item.data?.location && `📍 ${item.data.location}`}
                            </p>
                            {item.type === 'service' && item.data?.author && (
                              <Link
                                href={`/users/${item.data.author.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="mt-2 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                              >
                                View Provider Profile →
                              </Link>
                            )}
                          </div>
                        </div>
                      </Link>
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
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center transition"
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
