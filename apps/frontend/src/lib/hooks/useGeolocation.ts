'use client';

import { useState, useEffect, useCallback } from 'react';

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
  timestamp: number | null;
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
}

const defaultOptions: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000,
  watch: false,
};

export function useGeolocation(options: GeolocationOptions = {}) {
  const opts = { ...defaultOptions, ...options };
  
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: true,
    timestamp: null,
  });

  const onSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      error: null,
      loading: false,
      timestamp: position.timestamp,
    });
  }, []);

  const onError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = 'Unknown error occurred';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location permission denied. Please enable location access.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable.';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out.';
        break;
    }
    
    setState(prev => ({
      ...prev,
      error: errorMessage,
      loading: false,
    }));
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      onSuccess,
      onError,
      {
        enableHighAccuracy: opts.enableHighAccuracy,
        timeout: opts.timeout,
        maximumAge: opts.maximumAge,
      }
    );
  }, [onSuccess, onError, opts.enableHighAccuracy, opts.timeout, opts.maximumAge]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      }));
      return;
    }

    let watchId: number | null = null;

    if (opts.watch) {
      watchId = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        {
          enableHighAccuracy: opts.enableHighAccuracy,
          timeout: opts.timeout,
          maximumAge: opts.maximumAge,
        }
      );
    } else {
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        onError,
        {
          enableHighAccuracy: opts.enableHighAccuracy,
          timeout: opts.timeout,
          maximumAge: opts.maximumAge,
        }
      );
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [opts.watch, opts.enableHighAccuracy, opts.timeout, opts.maximumAge, onSuccess, onError]);

  return {
    ...state,
    requestLocation,
    isSupported: typeof navigator !== 'undefined' && 'geolocation' in navigator,
  };
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Format distance for display
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

// Check if a point is within radius
export function isWithinRadius(
  centerLat: number,
  centerLon: number,
  pointLat: number,
  pointLon: number,
  radiusKm: number
): boolean {
  return calculateDistance(centerLat, centerLon, pointLat, pointLon) <= radiusKm;
}

// Get bounding box for a center point and radius
export function getBoundingBox(
  lat: number,
  lon: number,
  radiusKm: number
): { minLat: number; maxLat: number; minLon: number; maxLon: number } {
  const latDelta = radiusKm / 111.32; // 1 degree latitude ≈ 111.32 km
  const lonDelta = radiusKm / (111.32 * Math.cos(toRad(lat)));
  
  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLon: lon - lonDelta,
    maxLon: lon + lonDelta,
  };
}

// Kenyan city coordinates for defaults
export const KENYA_LOCATIONS = {
  nairobi: { lat: -1.2921, lon: 36.8219, name: 'Nairobi' },
  mombasa: { lat: -4.0435, lon: 39.6682, name: 'Mombasa' },
  kisumu: { lat: -0.1022, lon: 34.7617, name: 'Kisumu' },
  nakuru: { lat: -0.3031, lon: 36.0800, name: 'Nakuru' },
  eldoret: { lat: 0.5143, lon: 35.2698, name: 'Eldoret' },
  // Nairobi neighborhoods
  kilimani: { lat: -1.2864, lon: 36.7856, name: 'Kilimani' },
  westlands: { lat: -1.2674, lon: 36.8110, name: 'Westlands' },
  kasarani: { lat: -1.2197, lon: 36.9006, name: 'Kasarani' },
  kibera: { lat: -1.3133, lon: 36.7878, name: 'Kibera' },
  donholm: { lat: -1.2947, lon: 36.8883, name: 'Donholm' },
  karen: { lat: -1.3226, lon: 36.7114, name: 'Karen' },
  langata: { lat: -1.3482, lon: 36.7426, name: 'Langata' },
  parklands: { lat: -1.2608, lon: 36.8186, name: 'Parklands' },
  lavington: { lat: -1.2783, lon: 36.7678, name: 'Lavington' },
  upperhill: { lat: -1.2956, lon: 36.8167, name: 'Upper Hill' },
  kiambuRoad: { lat: -1.2800, lon: 36.8000, name: 'Kiambu Road' },
};

export const DEFAULT_LOCATION = KENYA_LOCATIONS.nairobi;


