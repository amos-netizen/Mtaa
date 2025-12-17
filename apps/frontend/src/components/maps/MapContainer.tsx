'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainerLeaflet = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);

import 'leaflet/dist/leaflet.css';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  type?: 'default' | 'alert' | 'marketplace' | 'service' | 'job' | 'user';
  icon?: string;
  onClick?: () => void;
}

interface MapContainerProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  showUserLocation?: boolean;
  userLocation?: { lat: number; lng: number } | null;
  radiusKm?: number;
  height?: string;
  className?: string;
  onMapClick?: (lat: number, lng: number) => void;
  children?: React.ReactNode;
}

// Component to handle map clicks
function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  const [MapEvents, setMapEvents] = useState<any>(null);

  useEffect(() => {
    import('react-leaflet').then((mod) => {
      setMapEvents(() => mod.useMapEvents);
    });
  }, []);

  if (!MapEvents || !onMapClick) return null;

  return <MapEventsComponent onMapClick={onMapClick} useMapEvents={MapEvents} />;
}

function MapEventsComponent({ 
  onMapClick, 
  useMapEvents 
}: { 
  onMapClick: (lat: number, lng: number) => void;
  useMapEvents: any;
}) {
  useMapEvents({
    click: (e: any) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}


export default function MapContainer({
  center = [-1.2921, 36.8219], // Default to Nairobi
  zoom = 13,
  markers = [],
  showUserLocation = true,
  userLocation,
  radiusKm,
  height = '400px',
  className = '',
  onMapClick,
  children,
}: MapContainerProps) {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);
  const [icons, setIcons] = useState<any>({});

  useEffect(() => {
    setIsClient(true);
    
    // Import Leaflet and create icons
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      
      // Fix default marker icon issue
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Create custom icons
      const createIcon = (color: string, emoji?: string) => {
        return leaflet.default.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background-color: ${color};
              width: 32px;
              height: 32px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 2px solid white;
              box-shadow: 0 2px 5px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <span style="transform: rotate(45deg); font-size: 14px;">${emoji || '📍'}</span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });
      };

      setIcons({
        default: new leaflet.default.Icon.Default(),
        alert: createIcon('#ef4444', '🚨'),
        marketplace: createIcon('#22c55e', '🛒'),
        service: createIcon('#3b82f6', '🔧'),
        job: createIcon('#f59e0b', '💼'),
        user: createIcon('#8b5cf6', '👤'),
      });
    });
  }, []);

  if (!isClient) {
    return (
      <div 
        className={`bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-gray-500 dark:text-gray-400 flex flex-col items-center gap-2">
          <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden ${className}`} style={{ height }}>
      <MapContainerLeaflet
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location marker and radius */}
        {showUserLocation && userLocation && L && (
          <>
            <Marker 
              position={[userLocation.lat, userLocation.lng]}
              icon={icons.user || icons.default}
            >
              <Popup>
                <div className="font-semibold">📍 Your Location</div>
              </Popup>
            </Marker>
            
            {radiusKm && (
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={radiusKm * 1000}
                pathOptions={{
                  color: '#3b82f6',
                  fillColor: '#3b82f6',
                  fillOpacity: 0.1,
                }}
              />
            )}
          </>
        )}
        
        {/* Custom markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={icons[marker.type || 'default'] || icons.default}
            eventHandlers={{
              click: marker.onClick,
            }}
          >
            <Popup>
              <div>
                <div className="font-semibold">{marker.title}</div>
                {marker.description && (
                  <div className="text-sm text-gray-600 mt-1">{marker.description}</div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
        
        {children}
      </MapContainerLeaflet>
    </div>
  );
}

