import React, { useState, useEffect } from 'react';
import { performanceMonitor, QualityLevel } from '../utils/performanceMetrics';

interface PerformanceHUDProps {
  visible?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showControls?: boolean;
}

const PerformanceHUD: React.FC<PerformanceHUDProps> = ({
  visible = false,
  position = 'bottom-right',
  showControls = true
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const [metrics, setMetrics] = useState(performanceMonitor.getMetrics());
  const [score, setScore] = useState(performanceMonitor.getPerformanceScore());
  const [grade, setGrade] = useState(performanceMonitor.getPerformanceGrade());
  const [tips, setTips] = useState<string[]>([]);
  const [showTips, setShowTips] = useState(false);
  const [adaptiveMode, setAdaptiveMode] = useState(false);
  
  // Position classes
  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2'
  };
  
  // Update metrics on interval
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getMetrics());
      setScore(performanceMonitor.getPerformanceScore());
      setGrade(performanceMonitor.getPerformanceGrade());
      setTips(performanceMonitor.getOptimizationTips());
    }, 500);
    
    return () => clearInterval(interval);
  }, [isVisible]);
  
  // Toggle visibility with F key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        setIsVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Register quality change handler
  useEffect(() => {
    const unregister = performanceMonitor.onQualityChange((quality: QualityLevel) => {
      // Flash notification when quality changes
      const notification = document.createElement('div');
      notification.className = 'fixed top-10 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fadeOut';
      notification.textContent = `Quality changed to ${quality}`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    });
    
    return unregister;
  }, []);
  
  // Toggle adaptive mode
  const toggleAdaptiveMode = () => {
    const newMode = !adaptiveMode;
    setAdaptiveMode(newMode);
    performanceMonitor.setAdaptiveMode(newMode);
  };
  
  // Set quality manually
  const setQuality = (quality: QualityLevel) => {
    performanceMonitor.setQuality(quality);
  };
  
  if (!isVisible) {
    return (
      <button 
        className="fixed bottom-2 right-2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-md text-xs z-40 hover:bg-opacity-80"
        onClick={() => setIsVisible(true)}
        title="Show performance metrics (Press F)"
      >
        FPS
      </button>
    );
  }
  
  return (
    <div 
      className={`fixed ${positionClasses[position]} bg-gray-900 bg-opacity-80 text-white p-3 rounded-md shadow-lg z-40 font-mono text-sm max-w-xs`}
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold mb-1 text-base">Performance</h3>
        <button 
          className="text-gray-400 hover:text-white"
          onClick={() => setIsVisible(false)}
          title="Hide (Press F)"
        >
          ×
        </button>
      </div>
      
      <div className="mb-2 flex items-center">
        <div 
          className={`text-xl font-bold mr-2 ${
            grade === 'A' ? 'text-green-400' : 
            grade === 'B' ? 'text-green-300' : 
            grade === 'C' ? 'text-yellow-300' : 
            grade === 'D' ? 'text-orange-400' : 
            'text-red-500'
          }`}
        >
          {grade}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              score >= 90 ? 'bg-green-500' : 
              score >= 80 ? 'bg-green-400' : 
              score >= 70 ? 'bg-yellow-400' : 
              score >= 60 ? 'bg-orange-500' : 
              'bg-red-500'
            }`} 
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <div className="ml-2 text-xs">{score}/100</div>
      </div>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-2">
        <div className="flex justify-between">
          <span className="text-gray-400">FPS:</span>
          <span className={metrics.fps < metrics.targetFPS * 0.8 ? 'text-red-400' : 'text-green-400'}>
            {metrics.fps}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Target:</span>
          <span>{metrics.targetFPS}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Frame Time:</span>
          <span>{metrics.frameTime.toFixed(1)}ms</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Quality:</span>
          <span className="font-semibold">{metrics.quality}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Draw Calls:</span>
          <span>{metrics.drawCalls}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Triangles:</span>
          <span>{(metrics.triangles / 1000).toFixed(1)}k</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Memory:</span>
          <span>{metrics.totalMemory.toFixed(0)} MB</span>
        </div>
      </div>
      
      {showControls && (
        <>
          <div className="flex items-center mb-2">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={adaptiveMode}
                  onChange={toggleAdaptiveMode}
                />
                <div className="block bg-gray-600 w-10 h-5 rounded-full"></div>
                <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition ${adaptiveMode ? 'translate-x-5' : ''}`}></div>
              </div>
              <div className="ml-2 text-xs">Adaptive Quality</div>
            </label>
          </div>
          
          <div className="grid grid-cols-4 gap-1 mb-2">
            {(['low', 'medium', 'high', 'ultra'] as QualityLevel[]).map(quality => (
              <button
                key={quality}
                className={`text-xs py-1 px-1 rounded ${
                  metrics.quality === quality 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setQuality(quality)}
                disabled={adaptiveMode}
              >
                {quality.charAt(0).toUpperCase() + quality.slice(1)}
              </button>
            ))}
          </div>
        </>
      )}
      
      {tips.length > 0 && (
        <div className="mt-2 border-t border-gray-700 pt-2">
          <button 
            className="text-xs flex justify-between w-full items-center"
            onClick={() => setShowTips(!showTips)}
          >
            <span className="text-yellow-300 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              Optimization Tips
            </span>
            <span>{showTips ? '▲' : '▼'}</span>
          </button>
          
          {showTips && (
            <ul className="list-disc list-inside text-xs mt-1 space-y-1 text-gray-300">
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceHUD; 