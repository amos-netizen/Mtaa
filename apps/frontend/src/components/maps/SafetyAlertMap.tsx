'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useGeolocation, calculateDistance, formatDistance } from '@/lib/hooks/useGeolocation';

const MapContainer = dynamic(() => import('./MapContainer'), { 
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center animate-pulse">
      <span className="text-gray-500">Loading map...</span>
    </div>
  )
});

export interface SafetyAlert {
  id: string;
  type: 'CRIME' | 'FIRE' | 'ACCIDENT' | 'SUSPICIOUS_ACTIVITY' | 'NATURAL_DISASTER' | 'POWER_OUTAGE' | 'OTHER';
  title: string;
  description: string;
  lat: number;
  lng: number;
  isUrgent: boolean;
  isVerified: boolean;
  createdAt: string;
  expiresAt?: string;
  author?: {
    fullName: string;
    username: string;
  };
}

interface SafetyAlertMapProps {
  alerts: SafetyAlert[];
  height?: string;
  showUserLocation?: boolean;
  onAlertClick?: (alert: SafetyAlert) => void;
  className?: string;
}

const ALERT_TYPE_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  CRIME: { icon: '🚔', color: '#ef4444', label: 'Crime' },
  FIRE: { icon: '🔥', color: '#f97316', label: 'Fire' },
  ACCIDENT: { icon: '🚗', color: '#eab308', label: 'Accident' },
  SUSPICIOUS_ACTIVITY: { icon: '👁️', color: '#8b5cf6', label: 'Suspicious' },
  NATURAL_DISASTER: { icon: '🌪️', color: '#06b6d4', label: 'Disaster' },
  POWER_OUTAGE: { icon: '⚡', color: '#fbbf24', label: 'Power Outage' },
  OTHER: { icon: '⚠️', color: '#6b7280', label: 'Other' },
};

export default function SafetyAlertMap({
  alerts,
  height = '400px',
  showUserLocation = true,
  onAlertClick,
  className = '',
}: SafetyAlertMapProps) {
  const { latitude, longitude, loading, error, requestLocation } = useGeolocation();
  const [selectedAlert, setSelectedAlert] = useState<SafetyAlert | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      if (filterType !== 'all' && alert.type !== filterType) return false;
      if (showUrgentOnly && !alert.isUrgent) return false;
      return true;
    });
  }, [alerts, filterType, showUrgentOnly]);

  // Add distance to alerts if user location available
  const alertsWithDistance = useMemo(() => {
    if (!latitude || !longitude) return filteredAlerts;
    
    return filteredAlerts.map(alert => ({
      ...alert,
      distance: calculateDistance(latitude, longitude, alert.lat, alert.lng),
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [filteredAlerts, latitude, longitude]);

  // Convert alerts to map markers
  const mapMarkers = useMemo(() => {
    return alertsWithDistance.map(alert => ({
      id: alert.id,
      lat: alert.lat,
      lng: alert.lng,
      title: `${ALERT_TYPE_CONFIG[alert.type]?.icon || '⚠️'} ${alert.title}`,
      description: alert.description,
      type: 'alert' as const,
      onClick: () => {
        setSelectedAlert(alert);
        onAlertClick?.(alert);
      },
    }));
  }, [alertsWithDistance, onAlertClick]);

  // Calculate map center
  const mapCenter = useMemo((): [number, number] => {
    if (latitude && longitude) return [latitude, longitude];
    if (alerts.length > 0) return [alerts[0].lat, alerts[0].lng];
    return [-1.2921, 36.8219]; // Default to Nairobi
  }, [latitude, longitude, alerts]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              filterType === 'all'
                ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-800'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            All ({alerts.length})
          </button>
          {Object.entries(ALERT_TYPE_CONFIG).map(([type, config]) => {
            const count = alerts.filter(a => a.type === type).length;
            if (count === 0) return null;
            return (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filterType === type
                    ? 'text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                style={filterType === type ? { backgroundColor: config.color } : {}}
              >
                {config.icon} {config.label} ({count})
              </button>
            );
          })}
        </div>

        <label className="flex items-center gap-2 ml-auto">
          <input
            type="checkbox"
            checked={showUrgentOnly}
            onChange={(e) => setShowUrgentOnly(e.target.checked)}
            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            🚨 Urgent only
          </span>
        </label>
      </div>

      {/* Map and alerts split view */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="relative">
            <MapContainer
              center={mapCenter}
              zoom={13}
              height={height}
              markers={mapMarkers}
              showUserLocation={showUserLocation && !!latitude && !!longitude}
              userLocation={latitude && longitude ? { lat: latitude, lng: longitude } : null}
            />
            
            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Alert Types</h4>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(ALERT_TYPE_CONFIG).slice(0, 4).map(([type, config]) => (
                  <div key={type} className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <span>{config.icon}</span>
                    <span>{config.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location button */}
            {!latitude && !longitude && (
              <button
                onClick={requestLocation}
                disabled={loading}
                className="absolute top-4 right-4 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                )}
                My Location
              </button>
            )}
          </div>
        </div>

        {/* Alerts list */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          <h3 className="font-semibold text-gray-900 dark:text-white sticky top-0 bg-gray-50 dark:bg-gray-900 py-2">
            Active Alerts ({filteredAlerts.length})
          </h3>
          
          {filteredAlerts.length === 0 ? (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <span className="text-3xl">✅</span>
              <p className="mt-2 text-green-700 dark:text-green-300 font-medium">
                No active alerts in your area
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Your neighborhood is safe!
              </p>
            </div>
          ) : (
            alertsWithDistance.map((alert: any) => (
              <div
                key={alert.id}
                onClick={() => {
                  setSelectedAlert(alert);
                  onAlertClick?.(alert);
                }}
                className={`p-4 rounded-lg cursor-pointer transition ${
                  selectedAlert?.id === alert.id
                    ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">
                    {ALERT_TYPE_CONFIG[alert.type]?.icon || '⚠️'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {alert.isUrgent && (
                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold rounded-full animate-pulse">
                          URGENT
                        </span>
                      )}
                      {alert.isVerified && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                          ✓ Verified
                        </span>
                      )}
                      {alert.distance && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          📍 {formatDistance(alert.distance)}
                        </span>
                      )}
                    </div>
                    <h4 className="mt-1 font-semibold text-gray-900 dark:text-white">
                      {alert.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {alert.description}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {new Date(alert.createdAt).toLocaleTimeString('en-KE', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {alert.author && (
                        <span>by @{alert.author.username}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Selected alert detail modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAlert(null)}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">
                    {ALERT_TYPE_CONFIG[selectedAlert.type]?.icon || '⚠️'}
                  </span>
                  <div>
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: ALERT_TYPE_CONFIG[selectedAlert.type]?.color }}
                    >
                      {ALERT_TYPE_CONFIG[selectedAlert.type]?.label}
                    </span>
                    {selectedAlert.isUrgent && (
                      <span className="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold rounded-full">
                        URGENT
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                {selectedAlert.title}
              </h2>
              
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                {selectedAlert.description}
              </p>

              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>Lat: {selectedAlert.lat.toFixed(6)}, Lng: {selectedAlert.lng.toFixed(6)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span>🕐</span>
                    <span>{new Date(selectedAlert.createdAt).toLocaleString('en-KE')}</span>
                  </div>
                  {selectedAlert.author && (
                    <div className="flex items-center gap-2 mt-1">
                      <span>👤</span>
                      <span>Reported by {selectedAlert.author.fullName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    // Open in maps
                    window.open(`https://www.google.com/maps?q=${selectedAlert.lat},${selectedAlert.lng}`, '_blank');
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Open in Maps
                </button>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


