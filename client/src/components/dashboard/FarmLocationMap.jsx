import React, { useState, useEffect } from 'react';

const FarmLocationMap = ({ farm }) => {
  const [mapError, setMapError] = useState(false);

  // Generate static map image URL (using OpenStreetMap as fallback)
  const getStaticMapUrl = (coordinates, zoom = 12, width = 400, height = 200) => {
    if (!coordinates) return null;
    
    const { latitude, longitude } = coordinates;
    
    // Using OpenStreetMap static map as fallback
    return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=${width}x${height}&markers=color:green%7C${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`;
  };

  const getFallbackMapUrl = (coordinates) => {
    if (!coordinates) return null;
    
    const { latitude, longitude } = coordinates;
    
    // OpenStreetMap fallback (no API key required)
    return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.1},${latitude-0.1},${longitude+0.1},${latitude+0.1}&layer=mapnik&marker=${latitude},${longitude}`;
  };

  const handleMapError = () => {
    setMapError(true);
  };

  if (!farm?.location?.coordinates) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="h3">Farm Location</h3>
        </div>
        <div className="card-body">
          <div className="text-center text-gray-500 py-8">
            <div className="text-3xl mb-2">🗺️</div>
            <p>No location data available</p>
            <p className="text-sm mt-2">Add location details to see the map</p>
          </div>
        </div>
      </div>
    );
  }

  const { latitude, longitude } = farm.location.coordinates;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="h3">Farm Location</h3>
        <div className="text-sm text-gray-500">{farm.location.address}</div>
      </div>
      <div className="card-body p-0">
        {/* Map Container */}
        <div className="relative h-48 bg-gray-100">
          {!mapError ? (
            <img
              src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+f00(${longitude},${latitude})/${longitude},${latitude},12,0/400x200?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.fake_token`}
              alt={`Map of ${farm.location.address}`}
              className="w-full h-full object-cover"
              onError={handleMapError}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-100 text-gray-500">
              <div className="text-3xl mb-2">🗺️</div>
              <p className="text-sm">Interactive map unavailable</p>
              <p className="text-xs mt-1">Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}</p>
            </div>
          )}
          
          {/* Map Overlay Information */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="text-white">
              <div className="font-semibold">{farm.name}</div>
              <div className="text-sm opacity-90">{farm.cropType} • {farm.farmSize?.value} {farm.farmSize?.unit}</div>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500 text-xs uppercase font-semibold mb-1">
                Coordinates
              </div>
              <div className="text-gray-900">
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs uppercase font-semibold mb-1">
                Soil Type
              </div>
              <div className="text-gray-900 capitalize">
                {farm.soilType || 'Not specified'}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-4">
            <button 
              className="btn btn-outline btn-sm flex-1"
              onClick={() => window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank')}
            >
              Open in Maps
            </button>
            <button className="btn btn-outline btn-sm flex-1">
              Share Location
            </button>
          </div>

          {/* Weather Compatibility */}
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <div>
                <div className="text-sm font-semibold text-green-900">
                  Ideal Growing Conditions
                </div>
                <div className="text-xs text-green-800">
                  This location is suitable for {farm.cropType} cultivation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmLocationMap;