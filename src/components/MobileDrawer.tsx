import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { ResultsPanel } from './ResultsPanel';
import type { AnalysisResult } from '../App';

interface MobileDrawerProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

export function MobileDrawer({ result, isAnalyzing }: MobileDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!result && !isAnalyzing) {
    return null;
  }

  return (
    <>
      {/* Backdrop when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isExpanded ? 'h-[90vh]' : 'h-auto'
        }`}
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Handle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-3 flex flex-col items-center gap-1 border-t"
          style={{ borderTopColor: '#e5e5e5' }}
        >
          <div className="w-12 h-1 rounded-full" style={{ backgroundColor: '#6c757d' }} />
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" style={{ color: '#6c757d' }} />
          ) : (
            <ChevronUp className="w-5 h-5" style={{ color: '#6c757d' }} />
          )}
          <span className="text-sm" style={{ color: '#6c757d' }}>
            {isExpanded ? 'Collapse' : 'View Results'}
          </span>
        </button>

        {/* Content */}
        {isExpanded && (
          <div className="h-[calc(100%-60px)] overflow-y-auto">
            <ResultsPanel result={result} isAnalyzing={isAnalyzing} />
          </div>
        )}

        {/* Collapsed Preview */}
        {!isExpanded && result && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: '#6c757d' }}>Overall Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl" style={{ color: '#035bfd' }}>{result.overallScore}</span>
                  <span style={{ color: '#6c757d' }}>/100</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm" style={{ color: '#6c757d' }}>Status</p>
                <p style={{ 
                  color: result.status === 'safe' ? '#28a745' : 
                         result.status === 'warning' ? '#ffc107' : '#dc3545' 
                }}>
                  {result.statusText}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
