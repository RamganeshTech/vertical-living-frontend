// LiveTrackingMap.tsx

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  latitude: number;
  longitude: number;
  timestamp?: Date;
  updatedAt?: Date;
}

interface LocationHistory {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

interface LiveTrackingMapProps {
  shipment: any;
  currentLocation: Location;
  locationHistory?: LocationHistory[];
  origin?: {
    address?: string;
  };
  destination?: {
    address?: string;
  };
}

// Custom component to handle map centering
const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center[0] && center[1]) {
      map.setView(center, 13, { animate: true });
    }
  }, [center, map]);

  return null;
};

// Custom truck/vehicle icon
const createVehicleIcon = () => {
  return L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div style="
        background-color: #4285F4;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      ">
        🚚
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  shipment,
  currentLocation,
  locationHistory = [],
//   origin,
//   destination
}) => {
  const mapRef = useRef<any>(null);

  const lat = currentLocation?.latitude || 0;
  const lng = currentLocation?.longitude || 0;

  // If no valid location, show error
  if (!lat || !lng) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <i className="fas fa-map-marked-alt text-4xl text-gray-300 mb-3" />
          <p className="text-gray-700">No location data available</p>
        </div>
      </div>
    );
  }

  const center: [number, number] = [lat, lng];

  // Convert location history to path coordinates
  const pathCoordinates: [number, number][] = locationHistory
    .filter(loc => loc.latitude && loc.longitude)
    .map(loc => [loc.latitude, loc.longitude]);

  return (
    <div className="space-y-4 min-w-full">
      {/* Map Container */}
      <div className="w-full h-96 rounded-lg border border-gray-300 shadow-sm overflow-hidden">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          {/* OpenStreetMap Tiles (FREE) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Auto-center map on location change */}
          <MapController center={center} />

          {/* Current Location Marker */}
          <Marker position={center} icon={createVehicleIcon()}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-sm mb-1">
                  {shipment?.vehicleDetails?.vehicleNumber || 'Vehicle'}
                </h3>
                <p className="text-xs text-gray-600">
                  Driver: {shipment?.vehicleDetails?.driver?.name || 'N/A'}
                </p>
                <p className="text-xs text-gray-600">
                  Status: <span className="font-semibold">{shipment?.shipmentStatus || 'N/A'}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Last updated: {currentLocation.updatedAt 
                    ? new Date(currentLocation.updatedAt).toLocaleTimeString() 
                    : 'N/A'}
                </p>
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  {lat.toFixed(6)}, {lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>

          {/* Draw traveled path */}
          {pathCoordinates.length > 1 && (
            <Polyline
              positions={pathCoordinates}
              color="#4285F4"
              weight={4}
              opacity={0.7}
              dashArray="10, 10"
            />
          )}
        </MapContainer>
      </div>

      {/* Location Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-gray-600 font-medium">Current Position</p>
          <p className="text-blue-700 font-mono text-xs mt-1">
            {lat.toFixed(6)}, {lng.toFixed(6)}
          </p>
        </div>

        {locationHistory.length > 0 && (
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-gray-600 font-medium">Points Tracked</p>
            <p className="text-green-700 font-bold mt-1">
              {locationHistory.length} locations
            </p>
          </div>
        )}

        {shipment?.eta && (
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-gray-600 font-medium">ETA</p>
            <p className="text-orange-700 font-bold mt-1">
              {shipment.eta} minutes
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-600 bg-gray-50 p-2 rounded">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Current Location</span>
        </div>
        {pathCoordinates.length > 1 && (
          <div className="flex items-center gap-1">
            <div className="w-6 h-0.5 bg-blue-500" style={{ borderTop: '2px dashed #4285F4' }}></div>
            <span>Traveled Path</span>
          </div>
        )}
      </div>
    </div>
  );
};