'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGeolocation, KENYA_LOCATIONS, DEFAULT_LOCATION } from '@/lib/hooks/useGeolocation';
import dynamic from 'next/dynamic';

// Dynamic import of MapContainer to avoid SSR issues
const MapContainer = dynamic(() => import('./MapContainer'), { 
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Loading map...</span>
    </div>
  )
});

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void;
  initialLocation?: { lat: number; lng: number };
  showSearch?: boolean;
  showPresets?: boolean;
  height?: string;
  className?: string;
}

export default function LocationPicker({
  onLocationSelect,
  initialLocation,
  showSearch = true,
  showPresets = true,
  height = '300px',
  className = '',
}: LocationPickerProps) {
  const { latitude, longitude, loading, error, requestLocation } = useGeolocation();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    initialLocation?.lat || DEFAULT_LOCATION.lat,
    initialLocation?.lng || DEFAULT_LOCATION.lon,
  ]);

  // Update center when user location is available
  useEffect(() => {
    if (latitude && longitude && !selectedLocation) {
      setMapCenter([latitude, longitude]);
    }
  }, [latitude, longitude, selectedLocation]);

  // Handle map click
  const handleMapClick = useCallback((lat: number, lng: number) => {
    const newLocation = { lat, lng };
    setSelectedLocation(newLocation);
    onLocationSelect(newLocation);
  }, [onLocationSelect]);

  // Use current location
  const handleUseCurrentLocation = useCallback(() => {
    if (latitude && longitude) {
      const newLocation = { lat: latitude, lng: longitude };
      setSelectedLocation(newLocation);
      setMapCenter([latitude, longitude]);
      onLocationSelect(newLocation);
    } else {
      requestLocation();
    }
  }, [latitude, longitude, requestLocation, onLocationSelect]);

  // Search for location using Nominatim (OpenStreetMap)
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ', Kenya'
        )}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Select search result
  const handleSelectSearchResult = useCallback((result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const newLocation = { lat, lng, address: result.display_name };
    
    setSelectedLocation({ lat, lng });
    setMapCenter([lat, lng]);
    onLocationSelect(newLocation);
    setSearchResults([]);
    setSearchQuery(result.display_name.split(',')[0]);
  }, [onLocationSelect]);

  // Select preset location
  const handleSelectPreset = useCallback((key: string) => {
    const location = KENYA_LOCATIONS[key as keyof typeof KENYA_LOCATIONS];
    if (location) {
      const newLocation = { lat: location.lat, lng: location.lon };
      setSelectedLocation(newLocation);
      setMapCenter([location.lat, location.lon]);
      onLocationSelect({ ...newLocation, address: location.name });
    }
  }, [onLocationSelect]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search bar */}
      {showSearch && (
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search location in Kenya..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition"
            >
              Search
            </button>
          </div>
          
          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSearchResult(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {result.display_name.split(',')[0]}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {result.display_name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleUseCurrentLocation}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
          Use My Location
        </button>
        
        {error && (
          <span className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </span>
        )}
      </div>

      {/* Preset locations */}
      {showPresets && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 self-center">Quick select:</span>
          {Object.entries(KENYA_LOCATIONS)
            .filter(([key]) => ['kilimani', 'westlands', 'kasarani', 'karen', 'parklands'].includes(key))
            .map(([key, loc]) => (
              <button
                key={key}
                onClick={() => handleSelectPreset(key)}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                {loc.name}
              </button>
            ))}
        </div>
      )}

      {/* Map */}
      <div className="relative">
        <MapContainer
          center={mapCenter}
          zoom={14}
          height={height}
          markers={selectedLocation ? [{
            id: 'selected',
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
            title: 'Selected Location',
            type: 'default',
          }] : []}
          showUserLocation={!!latitude && !!longitude}
          userLocation={latitude && longitude ? { lat: latitude, lng: longitude } : null}
          onMapClick={handleMapClick}
        />
        
        {/* Instructions overlay */}
        <div className="absolute bottom-2 left-2 right-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
          👆 Click on the map to select a location
        </div>
      </div>

      {/* Selected location display */}
      {selectedLocation && (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-600 dark:text-green-400">📍</span>
            <span className="text-sm text-green-800 dark:text-green-200">
              Location selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedLocation(null);
              onLocationSelect({ lat: 0, lng: 0 });
            }}
            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}


