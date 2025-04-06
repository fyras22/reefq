'use client';

import { useEffect, useRef } from 'react';
import { onCLS, onFID, onLCP, onFCP, onTTFB, onINP } from 'web-vitals';

export type WebVitalName = 'CLS' | 'FID' | 'LCP' | 'FCP' | 'TTFB' | 'INP';

export interface WebVitalsMetric {
  name: WebVitalName;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType?: string;
}

export interface WebVitalsTrackerProps {
  /**
   * Function to report metrics to your analytics service
   */
  reportWebVitals?: (metric: WebVitalsMetric) => void;
  
  /**
   * Override default thresholds for metrics
   */
  thresholds?: {
    [K in WebVitalName]?: {
      good: number;
      poor: number;
    };
  };
  
  /**
   * Which metrics to track
   */
  metrics?: WebVitalName[];
  
  /**
   * Whether to automatically send metrics to Vercel Analytics if available
   */
  useVercelAnalytics?: boolean;
  
  /**
   * Whether to automatically log metrics to console in development
   */
  debugMode?: boolean;
  
  /**
   * Whether to alert when metrics are poor
   */
  alertOnPoor?: boolean;
}

// Default thresholds based on Google's Core Web Vitals recommendations
const DEFAULT_THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },   // Cumulative Layout Shift
  FID: { good: 100, poor: 300 },    // First Input Delay (ms)
  LCP: { good: 2500, poor: 4000 },  // Largest Contentful Paint (ms)
  FCP: { good: 1800, poor: 3000 },  // First Contentful Paint (ms)
  TTFB: { good: 800, poor: 1800 },  // Time to First Byte (ms)
  INP: { good: 200, poor: 500 },    // Interaction to Next Paint (ms)
};

// All available metrics
const ALL_METRICS: WebVitalName[] = ['CLS', 'FID', 'LCP', 'FCP', 'TTFB', 'INP'];

/**
 * Component that tracks and reports Core Web Vitals metrics
 */
export default function WebVitalsTracker({
  reportWebVitals,
  thresholds = {},
  metrics = ALL_METRICS,
  useVercelAnalytics = true,
  debugMode = process.env.NODE_ENV === 'development',
  alertOnPoor = false,
}: WebVitalsTrackerProps) {
  // Merge custom thresholds with defaults
  const mergedThresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
  
  // Ref to track if metrics have been reported already
  const reportedMetrics = useRef<Set<string>>(new Set());
  
  // Get rating for a metric based on its value and thresholds
  const getRating = (name: WebVitalName, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const thresholds = mergedThresholds[name];
    if (!thresholds) return 'needs-improvement';
    
    if (value <= thresholds.good) return 'good';
    if (value >= thresholds.poor) return 'poor';
    return 'needs-improvement';
  };
  
  // Process and report a metric
  const processMetric = (metric: any) => {
    // Skip if this exact metric has already been reported
    if (reportedMetrics.current.has(metric.id)) return;
    reportedMetrics.current.add(metric.id);
    
    // Prepare the metric with rating
    const enrichedMetric: WebVitalsMetric = {
      name: metric.name as WebVitalName,
      value: metric.value,
      rating: getRating(metric.name as WebVitalName, metric.value),
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    };
    
    // Log to console in debug mode
    if (debugMode) {
      const formattedValue = metric.name === 'CLS' ? metric.value.toFixed(3) : Math.round(metric.value);
      const color = enrichedMetric.rating === 'good' ? 'green' : enrichedMetric.rating === 'poor' ? 'red' : 'orange';
      console.log(
        `%c Web Vital: ${metric.name} %c ${formattedValue} %c ${enrichedMetric.rating}`,
        'background:#eee; padding: 2px; border-radius: 3px;',
        `background:${color}; color:white; padding: 2px; border-radius: 3px;`,
        'font-weight: bold;'
      );
    }
    
    // Alert if metric is poor and alerting is enabled
    if (alertOnPoor && enrichedMetric.rating === 'poor') {
      console.warn(`Poor Web Vital: ${metric.name} - ${metric.value}`);
    }
    
    // Send to custom reporter if provided
    if (reportWebVitals) {
      reportWebVitals(enrichedMetric);
    }
    
    // Send to Vercel Analytics if enabled and available
    if (useVercelAnalytics && typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('event', {
        name: `web-vital-${metric.name.toLowerCase()}`,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        rating: enrichedMetric.rating,
      });
    }
  };
  
  useEffect(() => {
    // Only track metrics that are requested
    if (metrics.includes('CLS')) onCLS(processMetric);
    if (metrics.includes('FID')) onFID(processMetric);
    if (metrics.includes('LCP')) onLCP(processMetric);
    if (metrics.includes('FCP')) onFCP(processMetric);
    if (metrics.includes('TTFB')) onTTFB(processMetric);
    if (metrics.includes('INP')) onINP(processMetric);
    
    // Clear reported metrics when component unmounts
    return () => {
      reportedMetrics.current.clear();
    };
  }, [metrics]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // This component doesn't render anything
  return null;
}

/**
 * Format a Web Vital value for display
 */
export function formatWebVitalValue(name: WebVitalName, value: number): string {
  if (name === 'CLS') {
    return value.toFixed(2);
  }
  return `${Math.round(value)}ms`;
}

/**
 * Get a human-readable description of a Web Vital
 */
export function getWebVitalDescription(name: WebVitalName): string {
  switch (name) {
    case 'CLS':
      return 'Cumulative Layout Shift - Measures visual stability of the page';
    case 'FID':
      return 'First Input Delay - Measures responsiveness to user interactions';
    case 'LCP':
      return 'Largest Contentful Paint - Measures loading performance';
    case 'FCP':
      return 'First Contentful Paint - Measures time until first content is painted';
    case 'TTFB':
      return 'Time to First Byte - Measures server response time';
    case 'INP':
      return 'Interaction to Next Paint - Measures overall responsiveness';
    default:
      return '';
  }
}

/**
 * Get color for a Web Vital rating
 */
export function getWebVitalColor(rating: 'good' | 'needs-improvement' | 'poor'): string {
  switch (rating) {
    case 'good':
      return '#0CCE6B'; // Green
    case 'needs-improvement':
      return '#FFA400'; // Orange
    case 'poor':
      return '#FF4E42'; // Red
    default:
      return '#999999'; // Gray
  }
}

/**
 * Usage Example:
 * 
 * // In app/_components/WebVitalsProvider.tsx
 * export default function WebVitalsProvider() {
 *   const reportWebVitals = (metric: WebVitalsMetric) => {
 *     // Send to your analytics service
 *     fetch('/api/analytics', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify(metric),
 *     });
 *   };
 *   
 *   return <WebVitalsTracker reportWebVitals={reportWebVitals} />;
 * }
 * 
 * // In app/layout.tsx 
 * import WebVitalsProvider from './_components/WebVitalsProvider';
 * 
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <html lang="en">
 *       <head />
 *       <body>
 *         {children}
 *         <WebVitalsProvider />
 *       </body>
 *     </html>
 *   );
 * }
 */ 