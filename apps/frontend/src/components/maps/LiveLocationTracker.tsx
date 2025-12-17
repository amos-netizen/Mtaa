'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGeolocation, formatDistance } from '@/lib/hooks/useGeolocation';
import { nearbyApi } from '@/lib/api/nearby';

interface LiveLocationTrackerProps {
  onLocationUpdate?: (lat: number, lng: number) => void;
  showShareButton?: boolean;
  updateInterval?: number; // in milliseconds
  className?: string;
}

export default function LiveLocationTracker({
  onLocationUpdate,
  showShareButton = true,
  updateInterval = 30000, // 30 seconds
  className = '',
}: LiveLocationTrackerProps) {
  const { 
    latitude, 
    longitude, 
    accuracy, 
    loading, 
    error, 
    timestamp,
    requestLocation,
    isSupported 
  } = useGeolocation({ watch: true, enableHighAccuracy: true });
  
  const [isSharing, setIsSharing] = useState(false);
  const [lastShared, setLastShared] = useState<Date | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);

  // Update location on server periodically when sharing
  useEffect(() => {
    if (!isSharing || !latitude || !longitude) return;

    const shareLocation = async () => {
      try {
        await nearbyApi.updateLocation(latitude, longitude);
        setLastShared(new Date());
        setShareError(null);
        onLocationUpdate?.(latitude, longitude);
      } catch (err) {
        console.error('Failed to share location:', err);
        setShareError('Failed to share location');
      }
    };

    // Share immediately
    shareLocation();

    // Then share periodically
    const interval = setInterval(shareLocation, updateInterval);

    return () => clearInterval(interval);
  }, [isSharing, latitude, longitude, updateInterval, onLocationUpdate]);

  const toggleSharing = useCallback(() => {
    setIsSharing(prev => !prev);
    if (!isSharing && (!latitude || !longitude)) {
      requestLocation();
    }
  }, [isSharing, latitude, longitude, requestLocation]);

  if (!isSupported) {
    return (
      <div className={`p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg ${className}`}>
        <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
          <span>⚠️</span>
          <span>Geolocation is not supported by your browser</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <span className="text-xl">📍</span>
            <span className="font-semibold">Live Location</span>
            {isSharing && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Sharing
              </span>
            )}
          </div>
          {showShareButton && (
            <button
              onClick={toggleSharing}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                isSharing
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
            >
              {isSharing ? 'Stop Sharing' : 'Share Location'}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Location status */}
        {loading ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Getting your location...</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Please wait</div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <span className="text-2xl">❌</span>
            <div>
              <div className="font-medium text-red-800 dark:text-red-200">Location Error</div>
              <div className="text-sm text-red-600 dark:text-red-300">{error}</div>
            </div>
            <button
              onClick={requestLocation}
              className="ml-auto px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : latitude && longitude ? (
          <>
            {/* Coordinates display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Latitude</div>
                <div className="font-mono font-semibold text-gray-900 dark:text-white">
                  {latitude.toFixed(6)}°
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Longitude</div>
                <div className="font-mono font-semibold text-gray-900 dark:text-white">
                  {longitude.toFixed(6)}°
                </div>
              </div>
            </div>

            {/* Accuracy indicator */}
            {accuracy && (
              <div className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${
                  accuracy < 50 ? 'bg-green-500' : accuracy < 100 ? 'bg-yellow-500' : 'bg-orange-500'
                }`}></span>
                <span className="text-gray-600 dark:text-gray-300">
                  Accuracy: ±{Math.round(accuracy)}m
                  {accuracy < 50 && ' (High precision)'}
                  {accuracy >= 50 && accuracy < 100 && ' (Good)'}
                  {accuracy >= 100 && ' (Low precision)'}
                </span>
              </div>
            )}

            {/* Last update */}
            {timestamp && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Last updated: {new Date(timestamp).toLocaleTimeString()}
              </div>
            )}

            {/* Sharing status */}
            {isSharing && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm text-green-700 dark:text-green-300">
                    Location is being shared with community
                  </span>
                </div>
                {lastShared && (
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Last shared: {lastShared.toLocaleTimeString()}
                  </div>
                )}
                {shareError && (
                  <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {shareError}
                  </div>
                )}
              </div>
            )}

            {/* Quick actions */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
                }}
                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in Maps
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${latitude}, ${longitude}`);
                }}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <span className="text-4xl">📍</span>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Click below to get your location
            </p>
            <button
              onClick={requestLocation}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get My Location
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

