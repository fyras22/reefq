'use client';

import { useEffect } from 'react';
import { measureLCP, measureCLS } from '@/lib/performance';

interface PerformanceObserverProps {
  enabled?: boolean;
  onLCP?: (lcpTime: number) => void;
  onCLS?: (clsValue: number) => void;
  onMetricsExceeded?: (metrics: { 
    name: string; 
    value: number; 
    threshold: number;
    url: string;
  }) => void;
  thresholds?: {
    lcp?: number; // milliseconds
    cls?: number; // unitless value
    fid?: number; // milliseconds
  };
}

// Define types for the Web Performance API
interface PerformanceEntryWithStartTime extends PerformanceEntry {
  startTime: number;
  processingStart?: number;
}

/**
 * Component that observes and reports Web Vitals metrics
 * Can be placed anywhere in the app, usually in the root layout
 */
export default function PerformanceMetricsObserver({
  enabled = process.env.NODE_ENV === 'production',
  onLCP,
  onCLS,
  onMetricsExceeded,
  thresholds = {
    lcp: 2500, // Core Web Vitals threshold in ms
    cls: 0.1,  // Core Web Vitals threshold (unitless)
    fid: 100,  // Core Web Vitals threshold in ms
  },
}: PerformanceObserverProps) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    
    // Handle LCP metric
    measureLCP((lcpTime) => {
      // Report LCP to custom handler if provided
      if (onLCP) {
        onLCP(lcpTime);
      }
      
      // Report to application monitoring if threshold exceeded
      if (onMetricsExceeded && thresholds.lcp && lcpTime > thresholds.lcp) {
        onMetricsExceeded({
          name: 'LCP',
          value: lcpTime,
          threshold: thresholds.lcp,
          url: window.location.href,
        });
      }
      
      // Log to console in non-production
      if (process.env.NODE_ENV !== 'production') {
        console.log(`LCP: ${Math.round(lcpTime)}ms`);
      }
    });
    
    // Handle CLS metric
    measureCLS((clsValue) => {
      // Report CLS to custom handler if provided
      if (onCLS) {
        onCLS(clsValue);
      }
      
      // Report to application monitoring if threshold exceeded
      if (onMetricsExceeded && thresholds.cls && clsValue > thresholds.cls) {
        onMetricsExceeded({
          name: 'CLS',
          value: clsValue,
          threshold: thresholds.cls,
          url: window.location.href,
        });
      }
      
      // Log to console in non-production
      if (process.env.NODE_ENV !== 'production') {
        console.log(`CLS: ${clsValue.toFixed(3)}`);
      }
    });
    
    // Measure First Input Delay (FID)
    if (typeof window !== 'undefined') {
      try {
        const fidObserver = new globalThis.PerformanceObserver((entryList: PerformanceObserverEntryList) => {
          for (const entry of entryList.getEntries()) {
            const typedEntry = entry as PerformanceEntryWithStartTime;
            
            if (typedEntry.processingStart && typedEntry.startTime) {
              const fidValue = typedEntry.processingStart - typedEntry.startTime;
              
              // Report to application monitoring if threshold exceeded
              if (onMetricsExceeded && thresholds.fid && fidValue > thresholds.fid) {
                onMetricsExceeded({
                  name: 'FID',
                  value: fidValue,
                  threshold: thresholds.fid,
                  url: window.location.href,
                });
              }
              
              // Log to console in non-production
              if (process.env.NODE_ENV !== 'production') {
                console.log(`FID: ${Math.round(fidValue)}ms`);
              }
            }
          }
        });
        
        // Start observing first-input entries
        fidObserver.observe({ type: 'first-input', buffered: true });
        
        // Clean up
        return () => fidObserver.disconnect();
      } catch (error) {
        console.error('Error measuring FID:', error);
      }
    }
  }, [enabled, onCLS, onLCP, onMetricsExceeded, thresholds]);
  
  // This component renders nothing to the DOM
  return null;
}

/**
 * Debug component that shows performance metrics in development
 */
export function PerformanceDebugger() {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') return;
    
    // Create a debugger element
    const debuggerContainer = document.createElement('div');
    Object.assign(debuggerContainer.style, {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      zIndex: '9999',
      fontFamily: 'monospace',
      fontSize: '12px',
      maxWidth: '300px',
    });
    
    // Add metrics display elements
    const lcpElement = document.createElement('div');
    const clsElement = document.createElement('div');
    const fidElement = document.createElement('div');
    
    debuggerContainer.appendChild(lcpElement);
    debuggerContainer.appendChild(clsElement);
    debuggerContainer.appendChild(fidElement);
    
    // Add to document
    document.body.appendChild(debuggerContainer);
    
    // Measure LCP
    measureLCP((lcpTime) => {
      const rating = lcpTime < 2500 ? '✅' : lcpTime < 4000 ? '⚠️' : '❌';
      lcpElement.innerHTML = `LCP: ${Math.round(lcpTime)}ms ${rating}`;
    });
    
    // Measure CLS
    measureCLS((clsValue) => {
      const rating = clsValue < 0.1 ? '✅' : clsValue < 0.25 ? '⚠️' : '❌';
      clsElement.innerHTML = `CLS: ${clsValue.toFixed(3)} ${rating}`;
    });
    
    // Measure FID
    try {
      const fidObserver = new globalThis.PerformanceObserver((entryList: PerformanceObserverEntryList) => {
        for (const entry of entryList.getEntries()) {
          const typedEntry = entry as PerformanceEntryWithStartTime;
          
          if (typedEntry.processingStart && typedEntry.startTime) {
            const fidValue = typedEntry.processingStart - typedEntry.startTime;
            const rating = fidValue < 100 ? '✅' : fidValue < 300 ? '⚠️' : '❌';
            fidElement.innerHTML = `FID: ${Math.round(fidValue)}ms ${rating}`;
          }
        }
      });
      
      fidObserver.observe({ type: 'first-input', buffered: true });
      
      // Clean up
      return () => {
        document.body.removeChild(debuggerContainer);
        fidObserver.disconnect();
      };
    } catch (error) {
      console.error('Error measuring FID:', error);
      return () => {
        document.body.removeChild(debuggerContainer);
      };
    }
  }, []);
  
  return null;
} 