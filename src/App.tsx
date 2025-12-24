import { useState } from 'react';
import { MapView } from './components/MapView';
import { ResultsPanel } from './components/ResultsPanel';
import { SearchBar } from './components/SearchBar';
import { Header } from './components/Header';
import { MobileDrawer } from './components/MobileDrawer';

export interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

export interface AnalysisResult {
  overallScore: number;
  status: 'safe' | 'warning' | 'danger';
  statusText: string;
  mainRisk: {
    type: string;
    severity: string;
    score: number;
  };
  allRisks: {
    type: string;
    severity: string;
    score: number;
    description: string;
  }[];
  crossSection: {
    elevationData: number[];
    lowestPoint: number;
  };
  recommendations: string[];
  mitigationCost: {
    min: number;
    max: number;
  };
  facilities: {
    hospital: number;
    school: number;
    market: number;
  };
  comparison: {
    thisLocation: number;
    areaAverage: number;
  };
  finalRecommendation: string;
  locationImages: {
    aerial: string;
    terrain: string;
    environment: string;
  };
}

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
    // Simulate analysis
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult(generateMockAnalysis(location));
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#f8f9fa' }}>
      <Header />
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Map Section */}
        <div className="flex-1 lg:w-[60%] flex flex-col relative">
          <div className="p-4" style={{ backgroundColor: '#ffffff' }}>
            <SearchBar onLocationSelect={handleLocationSelect} />
          </div>
          
          <div className="flex-1">
            <MapView 
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
            />
          </div>
        </div>

        {/* Desktop Results Panel */}
        <div className="hidden lg:block lg:w-[40%]" style={{ backgroundColor: '#ffffff' }}>
          <ResultsPanel 
            result={analysisResult}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Mobile Drawer */}
        <div className="lg:hidden">
          <MobileDrawer 
            result={analysisResult}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </div>
    </div>
  );
}

// Mock analysis generator
function generateMockAnalysis(location: LocationData): AnalysisResult {
  const scores = [75, 82, 68, 91, 78, 85, 72, 88];
  const overallScore = scores[Math.floor(Math.random() * scores.length)];
  
  let status: 'safe' | 'warning' | 'danger';
  let statusText: string;
  
  if (overallScore >= 75) {
    status = 'safe';
    statusText = 'Layak Huni';
  } else if (overallScore >= 60) {
    status = 'warning';
    statusText = 'Hati-hati';
  } else {
    status = 'danger';
    statusText = 'Tidak Direkomendasikan';
  }

  const allRisks = [
    { 
      type: 'BANJIR', 
      severity: 'TINGGI', 
      score: 65,
      description: 'Risiko banjir tinggi karena lokasi berada di area dengan elevasi rendah dan drainase yang kurang memadai.'
    },
    { 
      type: 'LONGSOR', 
      severity: 'RENDAH', 
      score: 88,
      description: 'Risiko longsor rendah karena kemiringan tanah relatif datar dan kondisi geologi stabil.'
    },
    { 
      type: 'GEMPA', 
      severity: 'SEDANG', 
      score: 72,
      description: 'Risiko gempa sedang berdasarkan jarak ke zona sesar aktif dan kondisi tanah.'
    },
    { 
      type: 'TSUNAMI', 
      severity: 'RENDAH', 
      score: 92,
      description: 'Risiko tsunami rendah karena lokasi cukup jauh dari garis pantai dengan elevasi memadai.'
    },
  ];
  
  const mainRisk = allRisks[0];

  return {
    overallScore,
    status,
    statusText,
    mainRisk,
    allRisks,
    crossSection: {
      elevationData: [12, 15, 14, 10, 8, 11, 13, 16, 14, 12],
      lowestPoint: 1.8,
    },
    recommendations: [
      'Naikkan pondasi minimal 45cm dari titik terendah',
      'Buat sistem drainase dengan kemiringan 2%',
      'Gunakan material tahan air untuk dinding basement',
    ],
    mitigationCost: {
      min: 15000000,
      max: 20000000,
    },
    facilities: {
      hospital: 2.1,
      school: 1.4,
      market: 0.8,
    },
    comparison: {
      thisLocation: overallScore,
      areaAverage: 65,
    },
    finalRecommendation: overallScore >= 75 
      ? 'PILIH - Lokasi ini layak dengan mitigasi standar'
      : overallScore >= 60
      ? 'HATI-HATI - Butuh mitigasi tambahan'
      : 'CARI ALTERNATIF - Risiko terlalu tinggi',
    locationImages: {
      aerial: 'https://images.unsplash.com/photo-1524813686514-a57563d77965?w=800',
      terrain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      environment: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
    },
  };
}