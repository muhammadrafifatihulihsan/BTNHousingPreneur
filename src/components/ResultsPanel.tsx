import { Download, AlertTriangle, CheckCircle, XCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { CrossSectionVisual } from './CrossSectionVisual';
import type { AnalysisResult } from '../App';

interface ResultsPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

export function ResultsPanel({ result, isAnalyzing }: ResultsPanelProps) {
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);

  if (isAnalyzing) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: '#035bfd' }} />
          <h3 style={{ color: '#212529' }}>Analyzing Location...</h3>
          <p className="text-sm mt-2" style={{ color: '#6c757d' }}>
            Processing risk factors and generating recommendations
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#f8f9fa' }}>
            <AlertTriangle className="w-8 h-8" style={{ color: '#6c757d' }} />
          </div>
          <h3 style={{ color: '#212529' }}>No Location Selected</h3>
          <p className="text-sm mt-2" style={{ color: '#6c757d' }}>
            Search for a location or click on the map to start the analysis
          </p>
        </div>
      </div>
    );
  }

  const statusIcon = 
    result.status === 'safe' ? <CheckCircle className="w-6 h-6" style={{ color: '#28a745' }} /> :
    result.status === 'warning' ? <AlertTriangle className="w-6 h-6" style={{ color: '#ffc107' }} /> :
    <XCircle className="w-6 h-6" style={{ color: '#dc3545' }} />;

  const statusColor = 
    result.status === 'safe' ? '#28a745' :
    result.status === 'warning' ? '#ffc107' :
    '#dc3545';

  const statusDot = result.status === 'safe' ? '🟢' : result.status === 'warning' ? '🟡' : '🔴';

  const handleDownloadReport = () => {
    alert('PDF report generation would be implemented here');
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 style={{ color: '#212529' }}>Analysis Results</h2>
          <Button 
            onClick={handleDownloadReport}
            className="gap-2"
            style={{ backgroundColor: '#035bfd', color: '#ffffff' }}
          >
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>

        {/* Overall Score */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm mb-1" style={{ color: '#6c757d' }}>OVERALL SCORE</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl" style={{ color: '#035bfd' }}>{result.overallScore}</span>
                <span className="text-2xl" style={{ color: '#6c757d' }}>/100</span>
              </div>
            </div>
            {statusIcon}
          </div>
          
          <div className="mb-4">
            <Progress value={result.overallScore} className="h-3" />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: `${statusColor}15` }}>
            <span className="text-xl">{statusDot}</span>
            <span style={{ color: statusColor }}>{result.statusText}</span>
          </div>
        </Card>

        {/* Location Images */}
        <Card className="p-6">
          <p className="text-sm mb-3" style={{ color: '#6c757d' }}>GAMBARAN LOKASI</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img 
                src={result.locationImages.aerial} 
                alt="Aerial view"
                className="w-full h-full object-cover"
              />
              <p className="text-xs mt-1 text-center" style={{ color: '#6c757d' }}>Aerial View</p>
            </div>
            <div className="aspect-square rounded-lg overflow-hidden">
              <img 
                src={result.locationImages.terrain} 
                alt="Terrain"
                className="w-full h-full object-cover"
              />
              <p className="text-xs mt-1 text-center" style={{ color: '#6c757d' }}>Terrain</p>
            </div>
            <div className="aspect-square rounded-lg overflow-hidden">
              <img 
                src={result.locationImages.environment} 
                alt="Environment"
                className="w-full h-full object-cover"
              />
              <p className="text-xs mt-1 text-center" style={{ color: '#6c757d' }}>Environment</p>
            </div>
          </div>
        </Card>

        {/* All Risks - Accordion Style */}
        <Card className="p-6">
          <p className="text-sm mb-3" style={{ color: '#6c757d' }}>ANALISIS SEMUA RISIKO</p>
          <div className="space-y-3">
            {result.allRisks.map((risk, index) => {
              const isExpanded = expandedRisk === risk.type;
              const riskColor = 
                risk.severity === 'TINGGI' ? '#dc3545' :
                risk.severity === 'SEDANG' ? '#ffc107' :
                '#28a745';

              return (
                <div 
                  key={index}
                  className="border rounded-lg overflow-hidden"
                  style={{ borderColor: '#e5e5e5' }}
                >
                  <button
                    onClick={() => setExpandedRisk(isExpanded ? null : risk.type)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    style={{ backgroundColor: isExpanded ? '#f8f9fa' : '#ffffff' }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                        style={{ backgroundColor: `${riskColor}15` }}
                      >
                        {risk.type === 'BANJIR' ? '🌊' : 
                         risk.type === 'LONGSOR' ? '⛰️' :
                         risk.type === 'GEMPA' ? '🌍' :
                         risk.type === 'TSUNAMI' ? '🌊' : '⚠️'}
                      </div>
                      <div className="text-left flex-1">
                        <h4 style={{ color: '#212529' }}>{risk.type}</h4>
                        <p className="text-sm" style={{ color: '#6c757d' }}>Score: {risk.score}/100</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span 
                          className="px-3 py-1 rounded-full text-sm"
                          style={{ backgroundColor: `${riskColor}15`, color: riskColor }}
                        >
                          {risk.severity}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" style={{ color: '#6c757d' }} />
                        ) : (
                          <ChevronDown className="w-5 h-5" style={{ color: '#6c757d' }} />
                        )}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 border-t" style={{ borderTopColor: '#e5e5e5', backgroundColor: '#ffffff' }}>
                      <div className="mb-4">
                        <Progress value={risk.score} className="h-2" />
                      </div>
                      
                      <p className="text-sm mb-4" style={{ color: '#212529' }}>
                        {risk.description}
                      </p>

                      <div className="space-y-2">
                        <p className="text-sm" style={{ color: '#6c757d' }}>Faktor Risiko:</p>
                        {getRiskFactors(risk.type).map((factor, idx) => (
                          <div key={idx} className="flex gap-2 text-sm">
                            <span style={{ color: riskColor }}>•</span>
                            <span style={{ color: '#212529' }}>{factor}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 space-y-2">
                        <p className="text-sm" style={{ color: '#6c757d' }}>Langkah Mitigasi:</p>
                        {getRiskPrevention(risk.type).map((prevention, idx) => (
                          <div key={idx} className="flex gap-2 text-sm p-2 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                            <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: '#035bfd', color: '#ffffff' }}>
                              {idx + 1}
                            </span>
                            <span style={{ color: '#212529' }}>{prevention}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Cross-Section Visual */}
        <CrossSectionVisual 
          elevationData={result.crossSection.elevationData}
          lowestPoint={result.crossSection.lowestPoint}
        />

        {/* Recommendations */}
        <Card className="p-6">
          <p className="text-sm mb-3" style={{ color: '#6c757d' }}>REKOMENDASI MITIGASI</p>
          <ol className="space-y-2 mb-4">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: '#035bfd', color: '#ffffff' }}>
                  {index + 1}
                </span>
                <span className="text-sm" style={{ color: '#212529' }}>{rec}</span>
              </li>
            ))}
          </ol>

          <div className="p-4 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
            <p className="text-sm mb-1" style={{ color: '#6c757d' }}>Estimasi Biaya Mitigasi</p>
            <p style={{ color: '#035bfd' }}>
              Rp {(result.mitigationCost.min / 1000000).toFixed(0)}-{(result.mitigationCost.max / 1000000).toFixed(0)} juta
            </p>
          </div>
        </Card>

        {/* Facilities */}
        <Card className="p-6">
          <p className="text-sm mb-4" style={{ color: '#6c757d' }}>JARAK FASILITAS TERDEKAT</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>🏥</span>
                <span className="text-sm" style={{ color: '#212529' }}>Rumah Sakit</span>
              </div>
              <span style={{ color: '#035bfd' }}>{result.facilities.hospital} km</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>🏫</span>
                <span className="text-sm" style={{ color: '#212529' }}>Sekolah</span>
              </div>
              <span style={{ color: '#035bfd' }}>{result.facilities.school} km</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>🏪</span>
                <span className="text-sm" style={{ color: '#212529' }}>Pasar</span>
              </div>
              <span style={{ color: '#035bfd' }}>{result.facilities.market} km</span>
            </div>
          </div>
        </Card>

        {/* Comparison */}
        <Card className="p-6">
          <p className="text-sm mb-4" style={{ color: '#6c757d' }}>PERBANDINGAN DENGAN AREA SEKITAR</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#035bfd15' }}>
              <p className="text-sm mb-1" style={{ color: '#6c757d' }}>Lokasi Ini</p>
              <p className="text-3xl" style={{ color: '#035bfd' }}>{result.comparison.thisLocation}</p>
            </div>
            <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#f8f9fa' }}>
              <p className="text-sm mb-1" style={{ color: '#6c757d' }}>Rata-rata Area</p>
              <p className="text-3xl" style={{ color: '#6c757d' }}>{result.comparison.areaAverage}</p>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg text-center" style={{ 
            backgroundColor: result.comparison.thisLocation > result.comparison.areaAverage ? '#28a74515' : '#f8f9fa',
            color: result.comparison.thisLocation > result.comparison.areaAverage ? '#28a745' : '#6c757d'
          }}>
            {result.comparison.thisLocation > result.comparison.areaAverage 
              ? `+${result.comparison.thisLocation - result.comparison.areaAverage} points above average` 
              : `${result.comparison.areaAverage - result.comparison.thisLocation} points below average`
            }
          </div>
        </Card>

        {/* Final Recommendation */}
        <Card className="p-6" style={{ backgroundColor: '#035bfd', color: '#ffffff' }}>
          <p className="text-sm mb-2 opacity-90">REKOMENDASI FINAL</p>
          <p>{result.finalRecommendation}</p>
        </Card>
      </div>
    </div>
  );
}

function getRiskFactors(type: string): string[] {
  const factors: Record<string, string[]> = {
    'BANJIR': [
      'Elevasi tanah lebih rendah 1.8m dari area sekitar',
      'Sistem drainase area kurang memadai',
      'Curah hujan tinggi di musim penghujan (>300mm/bulan)',
    ],
    'LONGSOR': [
      'Kemiringan tanah <5 derajat (relatif datar)',
      'Kondisi tanah stabil',
      'Vegetasi penutup tanah memadai',
    ],
    'GEMPA': [
      'Jarak ke zona sesar aktif 35km',
      'Kondisi tanah sedang',
      'Riwayat gempa moderat di area sekitar',
    ],
    'TSUNAMI': [
      'Jarak dari pantai >10km',
      'Elevasi lokasi >15m dari permukaan laut',
      'Terdapat penghalang alami',
    ],
  };
  return factors[type] || ['Data faktor risiko tidak tersedia'];
}

function getRiskPrevention(type: string): string[] {
  const prevention: Record<string, string[]> = {
    'BANJIR': [
      'Naikkan pondasi bangunan minimal 45cm dari titik terendah',
      'Bangun sistem drainase dengan kemiringan 2% menuju saluran utama',
      'Gunakan material waterproofing untuk dinding dan lantai',
    ],
    'LONGSOR': [
      'Lakukan survei geoteknik berkala',
      'Jaga vegetasi penutup tanah',
      'Pastikan sistem drainase air hujan berfungsi baik',
    ],
    'GEMPA': [
      'Gunakan struktur tahan gempa sesuai SNI',
      'Pasang anchor bolt pada pondasi',
      'Hindari struktur bangunan terlalu tinggi tanpa penguatan',
    ],
    'TSUNAMI': [
      'Identifikasi jalur evakuasi terdekat',
      'Pasang early warning system',
      'Sosialisasi prosedur evakuasi kepada penghuni',
    ],
  };
  return prevention[type] || ['Data pencegahan tidak tersedia'];
}
