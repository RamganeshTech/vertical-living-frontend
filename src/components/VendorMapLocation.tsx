import React from 'react';

// Define the props interface
interface IVendorMapLocationProps {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  address?: string | null;
  
  // Styling props
  className?: string;      // Wrapper classes (margin, padding, etc.)
  width?: string;          // e.g., "w-full", "w-1/2", "300px"
  height?: string;         // e.g., "h-64", "h-96", "250px"
}

const VendorMapLocation: React.FC<IVendorMapLocationProps> = ({
  latitude,
  longitude,
  address,
  className = '',
  width = 'w-full', // Default to full width
  height = 'h-64'   // Default height (approx 250px)
}) => {
  // 1. Handle missing coordinates
  if (!latitude || !longitude) {
    return (
      <div className={`${width} ${height} ${className} bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-gray-400`}>
        <i className="fa-solid fa-map-location-dot text-3xl mb-2"></i>
        <span className="text-sm font-medium">Location not available</span>
      </div>
    );
  }

  // 2. Construct URLs
  const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=14&output=embed`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  // 3. Determine if width/height are Tailwind classes or raw CSS values
  // If it includes spaces or is a known tailwind pattern, apply as class, else style.
  const isTailwindW = width.includes('w-');
  const isTailwindH = height.includes('h-');

  const containerStyle = {
    width: isTailwindW ? undefined : width,
    height: isTailwindH ? undefined : height,
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white ${isTailwindW ? width : ''} ${isTailwindH ? height : ''} ${className}`}
      style={containerStyle}
    >
      {/* The Map Iframe */}
      <iframe
        title="Vendor Location Map"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        loading="lazy" // Good for performance
        src={embedUrl}
        className="block w-full h-full object-cover"
      />

      {/* Address Overlay (Optional - Top Left) */}
      {address && (
        <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/60 to-transparent p-3 pointer-events-none">
          <p className="text-white text-xs font-medium truncate flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-red-400"></i>
            {address}
          </p>
        </div>
      )}

      {/* Open in G-Maps Button (Bottom Right) */}
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 z-10 flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 hover:text-blue-600 px-3 py-1.5 rounded shadow-md text-xs font-bold transition-colors border border-gray-200"
      >
        <span>Open Map</span>
        <i className="fa-solid fa-arrow-up-right-from-square"></i>
      </a>
    </div>
  );
};

export default VendorMapLocation;