import { useEffect, useRef, useState } from 'react';
import { MapPin, Layers } from 'lucide-react';
import { Button } from './ui/button';
import type { LocationData } from '../App';

// Leaflet types and imports
declare global {
  interface Window {
    L: any;
  }
}

interface MapViewProps {
  selectedLocation: LocationData | null;
  onLocationSelect: (location: LocationData) => void;
}

export function MapView({ selectedLocation, onLocationSelect }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'none' | 'flood' | 'landslide' | 'earthquake'>('none');

  // Load Leaflet CSS and JS
  useEffect(() => {
    // Add Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Add Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      setIsMapReady(true);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isMapReady || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;
    
    // Create map centered on Indonesia
    const map = L.map(mapRef.current).setView([-6.2088, 106.8456], 11);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add click handler
    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isMapReady]);

  // Update marker when location changes
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !selectedLocation) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Remove old marker
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }

    // Create custom icon
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: #035bfd;
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="transform: rotate(45deg); color: white; font-size: 16px;">📍</div>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    // Add new draggable marker
    const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
      icon: customIcon,
      draggable: true,
    }).addTo(map);

    marker.on('dragend', (e: any) => {
      const { lat, lng } = e.target.getLatLng();
      onLocationSelect({ lat, lng });
    });

    markerRef.current = marker;

    // Pan to location
    map.setView([selectedLocation.lat, selectedLocation.lng], 15);
  }, [isMapReady, selectedLocation]);

  // Handle layer overlays
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Remove existing overlays
    map.eachLayer((layer: any) => {
      if (layer.options && layer.options.className === 'risk-overlay') {
        map.removeLayer(layer);
      }
    });

    if (activeLayer === 'none') return;

    let color = '';
    switch (activeLayer) {
      case 'flood':
        color = 'rgba(3, 91, 253, 0.2)';
        break;
      case 'landslide':
        color = 'rgba(255, 165, 0, 0.2)';
        break;
      case 'earthquake':
        color = 'rgba(220, 53, 69, 0.2)';
        break;
    }

    // Add overlay rectangle (simplified for demo)
    if (selectedLocation) {
      const bounds = [
        [selectedLocation.lat - 0.01, selectedLocation.lng - 0.01],
        [selectedLocation.lat + 0.01, selectedLocation.lng + 0.01],
      ] as [[number, number], [number, number]];

      L.rectangle(bounds, {
        color: color,
        weight: 2,
        fillOpacity: 0.3,
        className: 'risk-overlay',
      }).addTo(map);
    }
  }, [activeLayer, selectedLocation, isMapReady]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" style={{ backgroundColor: '#e5e5e5' }}>
        {!isMapReady && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-2 animate-pulse" style={{ color: '#035bfd' }} />
              <p style={{ color: '#6c757d' }}>Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Layer Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <div className="bg-white rounded-lg shadow-lg p-2" style={{ backgroundColor: '#ffffff' }}>
          <div className="flex items-center gap-2 mb-2 px-2">
            <Layers className="w-4 h-4" style={{ color: '#6c757d' }} />
            <span className="text-sm" style={{ color: '#212529' }}>Risk Layers</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <Button
              size="sm"
              variant={activeLayer === 'none' ? 'default' : 'outline'}
              onClick={() => setActiveLayer('none')}
              className="justify-start text-sm"
              style={activeLayer === 'none' ? { backgroundColor: '#035bfd', color: '#ffffff' } : {}}
            >
              None
            </Button>
            <Button
              size="sm"
              variant={activeLayer === 'flood' ? 'default' : 'outline'}
              onClick={() => setActiveLayer('flood')}
              className="justify-start text-sm"
              style={activeLayer === 'flood' ? { backgroundColor: '#035bfd', color: '#ffffff' } : {}}
            >
              🌊 Banjir
            </Button>
            <Button
              size="sm"
              variant={activeLayer === 'landslide' ? 'default' : 'outline'}
              onClick={() => setActiveLayer('landslide')}
              className="justify-start text-sm"
              style={activeLayer === 'landslide' ? { backgroundColor: '#035bfd', color: '#ffffff' } : {}}
            >
              ⛰️ Longsor
            </Button>
            <Button
              size="sm"
              variant={activeLayer === 'earthquake' ? 'default' : 'outline'}
              onClick={() => setActiveLayer('earthquake')}
              className="justify-start text-sm"
              style={activeLayer === 'earthquake' ? { backgroundColor: '#035bfd', color: '#ffffff' } : {}}
            >
              🌍 Gempa
            </Button>
          </div>
        </div>
      </div>

      {/* Info overlay */}
      {!selectedLocation && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[1000]">
          <div className="bg-white rounded-lg shadow-lg px-4 py-3" style={{ backgroundColor: '#ffffff' }}>
            <p className="text-sm" style={{ color: '#6c757d' }}>
              <MapPin className="inline w-4 h-4 mr-1" style={{ color: '#035bfd' }} />
              Click on map or search location to start analysis
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
