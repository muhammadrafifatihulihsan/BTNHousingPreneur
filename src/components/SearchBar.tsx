import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import type { LocationData } from '../App';

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

interface SearchBarProps {
  onLocationSelect: (location: LocationData) => void;
}

export function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search with Nominatim
  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=id`
        );
        const data = await response.json();
        setResults(data);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const handleSelectResult = (result: SearchResult) => {
    const location: LocationData = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name,
    };
    onLocationSelect(location);
    setQuery(result.display_name);
    setShowResults(false);
  };

  const handleCoordinatesSubmit = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);

    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid coordinates');
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Coordinates out of range');
      return;
    }

    onLocationSelect({ lat, lng });
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: LocationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: 'Current Location',
        };
        onLocationSelect(location);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to get your location');
        setIsGettingLocation(false);
      }
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-3">
        {/* Search by name */}
        <div className="relative flex-1" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#6c757d' }} />
            <Input
              type="text"
              placeholder="Search location (e.g., Jakarta, Bandung, Surabaya...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 h-12"
              style={{ backgroundColor: '#ffffff', borderColor: '#035bfd' }}
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin" style={{ color: '#035bfd' }} />
            )}
          </div>

          {/* Search results dropdown */}
          {showResults && results.length > 0 && (
            <div 
              className="absolute top-full mt-1 w-full rounded-lg shadow-lg border overflow-hidden z-50"
              style={{ backgroundColor: '#ffffff', borderColor: '#e5e5e5' }}
            >
              {results.map((result) => (
                <button
                  key={result.place_id}
                  onClick={() => handleSelectResult(result)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0 flex items-start gap-3"
                  style={{ borderBottomColor: '#e5e5e5' }}
                >
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#035bfd' }} />
                  <span className="text-sm" style={{ color: '#212529' }}>{result.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Coordinates and current location */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2 flex-1">
            <Input
              type="text"
              placeholder="Latitude"
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              className="flex-1"
              style={{ backgroundColor: '#ffffff' }}
            />
            <Input
              type="text"
              placeholder="Longitude"
              value={lngInput}
              onChange={(e) => setLngInput(e.target.value)}
              className="flex-1"
              style={{ backgroundColor: '#ffffff' }}
            />
            <Button 
              onClick={handleCoordinatesSubmit}
              style={{ backgroundColor: '#035bfd', color: '#ffffff' }}
            >
              Go
            </Button>
          </div>

          <Button 
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            variant="outline"
            className="gap-2"
          >
            {isGettingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            Current Location
          </Button>
        </div>
      </div>
    </div>
  );
}
