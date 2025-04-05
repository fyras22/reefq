import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';

interface PerformanceMonitorProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showFps?: boolean;
  showMemory?: boolean;
  showFrameTime?: boolean;
  className?: string;
}

export default function PerformanceMonitor({
  enabled = true,
  position = 'top-right',
  showFps = true,
  showMemory = true,
  showFrameTime = true,
  className = ''
}: PerformanceMonitorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<Stats | null>(null);
  const [metricsVisible, setMetricsVisible] = useState(false);
  const [metrics, setMetrics] = useState({
    fps: 0,
    frameTime: 0,
    memory: 0,
    triangles: 0,
    drawCalls: 0
  });
  
  // Initialize stats.js
  useEffect(() => {
    if (!enabled) return;
    
    let stats: Stats | null = null;
    let animationFrame: number;
    
    // Only create Stats if it's available
    if (typeof Stats !== 'undefined') {
      stats = new Stats();
      statsRef.current = stats;
      
      // Configure the panels to display
      if (showFps) {
        stats.showPanel(0); // FPS
      } else if (showMemory) {
        stats.showPanel(2); // Memory
      } else if (showFrameTime) {
        stats.showPanel(1); // MS
      }
      
      const updateStats = () => {
        if (stats) {
          stats.update();
          
          // Get metrics from stats panels
          if (stats.dom) {
            const panels = stats.dom.children;
            
            // Update metrics state periodically (not every frame to avoid too many updates)
            if (Math.random() < 0.05) { // Update roughly every 20 frames
              const updatedMetrics = { ...metrics };
              
              if (panels[0]) {
                const fpsPanel = panels[0] as HTMLElement;
                const fpsText = fpsPanel.textContent || '';
                const fpsMatch = fpsText.match(/(\d+)/);
                if (fpsMatch && fpsMatch[1]) {
                  updatedMetrics.fps = parseInt(fpsMatch[1], 10);
                }
              }
              
              if (panels[1]) {
                const msPanel = panels[1] as HTMLElement;
                const msText = msPanel.textContent || '';
                const msMatch = msText.match(/(\d+(\.\d+)?)/);
                if (msMatch && msMatch[1]) {
                  updatedMetrics.frameTime = parseFloat(msMatch[1]);
                }
              }
              
              if (panels[2]) {
                const memoryPanel = panels[2] as HTMLElement;
                const memText = memoryPanel.textContent || '';
                const memMatch = memText.match(/(\d+)/);
                if (memMatch && memMatch[1]) {
                  updatedMetrics.memory = parseInt(memMatch[1], 10);
                }
              }
              
              // Get renderer info if available
              if (window.reefqRendererInfo) {
                updatedMetrics.triangles = window.reefqRendererInfo.triangles || 0;
                updatedMetrics.drawCalls = window.reefqRendererInfo.drawCalls || 0;
              }
              
              setMetrics(updatedMetrics);
            }
          }
        }
        
        animationFrame = requestAnimationFrame(updateStats);
      };
      
      animationFrame = requestAnimationFrame(updateStats);
      
      // Hide the default stats.js DOM element as we'll create our own UI
      if (stats.dom) {
        stats.dom.style.display = 'none';
      }
    }
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [enabled, showFps, showMemory, showFrameTime, metrics]);
  
  // Position classes
  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2'
  };
  
  if (!enabled) {
    return null;
  }
  
  return (
    <div 
      ref={containerRef}
      className={`absolute z-10 ${positionClasses[position]} ${className}`}
    >
      <button
        onClick={() => setMetricsVisible(!metricsVisible)}
        className="rounded-full w-8 h-8 flex items-center justify-center bg-white shadow-md hover:bg-gray-50 transition-colors"
        title="Performance Monitor"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>
      
      {metricsVisible && (
        <div className="mt-2 p-3 bg-white rounded-lg shadow-lg text-xs w-48">
          <div className="font-medium text-gray-900 mb-1">Performance Metrics</div>
          
          <div className="space-y-1.5">
            {showFps && (
              <div className="flex justify-between">
                <span className="text-gray-600">FPS:</span>
                <span className={`font-medium ${
                  metrics.fps > 50 ? 'text-green-600' : 
                  metrics.fps > 30 ? 'text-amber-600' : 
                  'text-red-600'
                }`}>{metrics.fps}</span>
              </div>
            )}
            
            {showFrameTime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Frame Time:</span>
                <span className={`font-medium ${
                  metrics.frameTime < 8 ? 'text-green-600' : 
                  metrics.frameTime < 16 ? 'text-amber-600' : 
                  'text-red-600'
                }`}>{metrics.frameTime.toFixed(1)} ms</span>
              </div>
            )}
            
            {showMemory && (
              <div className="flex justify-between">
                <span className="text-gray-600">Memory:</span>
                <span className="font-medium text-gray-800">
                  {metrics.memory > 0 ? `${metrics.memory} MB` : 'N/A'}
                </span>
              </div>
            )}
            
            {metrics.triangles > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Triangles:</span>
                <span className="font-medium text-gray-800">
                  {metrics.triangles.toLocaleString()}
                </span>
              </div>
            )}
            
            {metrics.drawCalls > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Draw Calls:</span>
                <span className={`font-medium ${
                  metrics.drawCalls < 50 ? 'text-green-600' : 
                  metrics.drawCalls < 100 ? 'text-amber-600' : 
                  'text-red-600'
                }`}>{metrics.drawCalls}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Extend Window interface to include renderer info
declare global {
  interface Window {
    reefqRendererInfo?: {
      triangles: number;
      drawCalls: number;
      textures: number;
      geometries: number;
      materials: number;
    };
  }
} 