import React, { useState, useEffect } from 'react';
import { useDeviceCapabilities, getPerformanceTips, formatDeviceInfo } from '../utils/performanceUtils';

interface PerformanceRecommendationsProps {
  onQualityChange?: (quality: 'low' | 'medium' | 'high' | 'ultra' | 'auto') => void;
  className?: string;
}

export default function PerformanceRecommendations({ 
  onQualityChange,
  className = ''
}: PerformanceRecommendationsProps) {
  const { capabilities, loading } = useDeviceCapabilities();
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  
  // Apply recommendations automatically
  useEffect(() => {
    if (!loading && capabilities && onQualityChange) {
      // If device is in low power mode or has slow connection, automatically suggest low quality
      if (
        capabilities.isLowPower || 
        capabilities.effectiveConnectionType === 'slow-2g' || 
        capabilities.effectiveConnectionType === '2g'
      ) {
        // Just show the panel rather than automatically applying
        setIsOpen(true);
      }
    }
  }, [capabilities, loading, onQualityChange]);
  
  if (loading) {
    return null; // Don't show anything while loading
  }
  
  const performanceTips = getPerformanceTips(capabilities);
  
  // Only show the component if there are tips
  if (performanceTips.length === 0) {
    return null;
  }
  
  const recommendedTips = performanceTips.filter(tip => tip.recommended);
  const displayTips = showAll ? performanceTips : recommendedTips;

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-sm font-medium transition-colors"
      >
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Performance Recommendations</span>
          {performanceTips.some(tip => tip.impact === 'high') && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
              Suggested
            </span>
          )}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-4 py-3 text-sm">
          <div className="text-xs text-gray-500 mb-3">
            {formatDeviceInfo(capabilities)}
          </div>
          
          <div className="space-y-3">
            {displayTips.map(tip => (
              <div key={tip.id} className="flex items-start">
                <div className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded-full ${
                  tip.impact === 'high' ? 'bg-amber-500' : 
                  tip.impact === 'medium' ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>
                <div className="ml-2">
                  <h4 className="text-sm font-medium">{tip.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {performanceTips.length > recommendedTips.length && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-3 text-xs text-nile-teal hover:text-nile-teal-dark font-medium flex items-center"
            >
              {showAll ? 'Show fewer recommendations' : 'Show all recommendations'}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`ml-1 h-3 w-3 transition-transform ${showAll ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
          
          {onQualityChange && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="text-xs font-medium mb-2">Apply Recommendation</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onQualityChange(capabilities?.preferredQuality || 'medium')}
                  className="bg-nile-teal text-white px-3 py-2 rounded text-xs font-medium"
                >
                  Optimize Performance
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="border border-gray-300 text-gray-700 px-3 py-2 rounded text-xs font-medium"
                >
                  Keep Current Settings
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 