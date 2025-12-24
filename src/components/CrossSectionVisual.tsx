import { Card } from './ui/card';

interface CrossSectionVisualProps {
  elevationData: number[];
  lowestPoint: number;
}

export function CrossSectionVisual({ elevationData, lowestPoint }: CrossSectionVisualProps) {
  const maxElevation = Math.max(...elevationData);
  const minElevation = Math.min(...elevationData);
  const range = maxElevation - minElevation;

  return (
    <Card className="p-6">
      <div className="mb-4">
        <p className="text-sm mb-1" style={{ color: '#6c757d' }}>CROSS-SECTION VISUAL TANAH</p>
        <p className="text-sm" style={{ color: '#212529' }}>
          Visualisasi profil ketinggian tanah - Titik terendah: <span style={{ color: '#dc3545' }}>{lowestPoint}m</span>
        </p>
      </div>

      {/* Visual Cross Section */}
      <div className="relative h-48 rounded-lg overflow-hidden" style={{ backgroundColor: '#f8f9fa' }}>
        {/* Sky gradient */}
        <div 
          className="absolute top-0 left-0 right-0 h-16"
          style={{
            background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)'
          }}
        />
        
        {/* Terrain Path */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 192" preserveAspectRatio="none">
          <defs>
            <linearGradient id="terrainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B4513" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#A0522D" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#654321" stopOpacity="1" />
            </linearGradient>
            <pattern id="grassPattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="4" height="1" fill="#228B22" opacity="0.3"/>
            </pattern>
          </defs>
          
          {/* Build terrain path */}
          <path
            d={generateTerrainPath(elevationData, minElevation, range)}
            fill="url(#terrainGradient)"
            stroke="#654321"
            strokeWidth="2"
          />
          
          {/* Grass layer */}
          <path
            d={generateGrassPath(elevationData, minElevation, range)}
            fill="url(#grassPattern)"
            opacity="0.6"
          />
          
          {/* Water level indicator if there's flooding risk */}
          {lowestPoint < 2 && (
            <>
              <line
                x1="0"
                y1={getYPosition(minElevation + 1.5, minElevation, range)}
                x2="400"
                y2={getYPosition(minElevation + 1.5, minElevation, range)}
                stroke="#4169E1"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.7"
              />
              <text
                x="10"
                y={getYPosition(minElevation + 1.5, minElevation, range) - 5}
                fill="#4169E1"
                fontSize="10"
              >
                Potensi Genangan Air
              </text>
            </>
          )}
          
          {/* Lowest point marker */}
          <circle
            cx={elevationData.indexOf(minElevation) * (400 / (elevationData.length - 1))}
            cy={getYPosition(minElevation, minElevation, range)}
            r="5"
            fill="#dc3545"
          />
          <text
            x={elevationData.indexOf(minElevation) * (400 / (elevationData.length - 1))}
            y={getYPosition(minElevation, minElevation, range) + 20}
            textAnchor="middle"
            fill="#dc3545"
            fontSize="11"
          >
            Titik Terendah
          </text>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 rounded px-3 py-2 text-xs" style={{ color: '#212529' }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-2 rounded" style={{ backgroundColor: '#8B4513' }}></div>
            <span>Tanah</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded" style={{ backgroundColor: '#dc3545' }}></div>
            <span>Cekungan</span>
          </div>
        </div>
      </div>

      {/* Info boxes */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#f8f9fa' }}>
          <p className="text-xs mb-1" style={{ color: '#6c757d' }}>Tertinggi</p>
          <p style={{ color: '#28a745' }}>{maxElevation.toFixed(1)}m</p>
        </div>
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#f8f9fa' }}>
          <p className="text-xs mb-1" style={{ color: '#6c757d' }}>Terendah</p>
          <p style={{ color: '#dc3545' }}>{minElevation.toFixed(1)}m</p>
        </div>
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#f8f9fa' }}>
          <p className="text-xs mb-1" style={{ color: '#6c757d' }}>Variasi</p>
          <p style={{ color: '#035bfd' }}>{range.toFixed(1)}m</p>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: lowestPoint < 2 ? '#dc354515' : '#28a74515' }}>
        <span style={{ color: lowestPoint < 2 ? '#dc3545' : '#28a745' }}>
          {lowestPoint < 2 ? '⚠️' : '✅'}
        </span>
        <p className="text-sm flex-1" style={{ color: lowestPoint < 2 ? '#dc3545' : '#28a745' }}>
          {lowestPoint < 2 
            ? `Area memiliki cekungan ${lowestPoint}m yang dapat menyebabkan genangan air saat hujan deras`
            : 'Kontur tanah relatif baik, risiko genangan rendah'
          }
        </p>
      </div>
    </Card>
  );
}

// Helper functions
function getYPosition(elevation: number, minElevation: number, range: number): number {
  const skyHeight = 64; // Height of sky gradient
  const terrainHeight = 192 - skyHeight - 20; // Available height for terrain
  const normalizedHeight = ((elevation - minElevation) / range) * terrainHeight;
  return 192 - normalizedHeight - 20; // Invert Y axis
}

function generateTerrainPath(elevationData: number[], minElevation: number, range: number): string {
  const width = 400;
  const points = elevationData.map((elevation, index) => {
    const x = (index / (elevationData.length - 1)) * width;
    const y = getYPosition(elevation, minElevation, range);
    return `${x},${y}`;
  });

  // Create closed path
  const path = `M 0,192 L ${points.join(' L ')} L ${width},192 Z`;
  return path;
}

function generateGrassPath(elevationData: number[], minElevation: number, range: number): string {
  const width = 400;
  const points = elevationData.map((elevation, index) => {
    const x = (index / (elevationData.length - 1)) * width;
    const y = getYPosition(elevation, minElevation, range);
    return `${x},${y}`;
  });

  const grassPoints = elevationData.map((elevation, index) => {
    const x = (index / (elevationData.length - 1)) * width;
    const y = getYPosition(elevation, minElevation, range) - 3;
    return `${x},${y}`;
  });

  const path = `M ${points.join(' L ')} L ${grassPoints.reverse().join(' L ')} Z`;
  return path;
}
