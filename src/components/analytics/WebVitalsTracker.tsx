'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Metric } from 'web-vitals';

// Extend window interface to include umami analytics
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, any>) => void;
    };
  }
}

export default function WebVitalsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Report Web Vitals metrics to analytics
  useReportWebVitals((metric) => {
    const { name, value, id, rating } = metric;
    
    // Send to analytics
    if (window.umami) {
      window.umami.track('web-vitals', {
        name,
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        id,
        rating,
        page: pathname,
      });
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Web Vitals: ${name} - ${value} (${rating})`);
    }
    
    // Send to custom endpoint
    fetch('/api/metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        id,
        rating,
        path: pathname,
        timestamp: Date.now(),
      }),
      // Don't block rendering or processing
      keepalive: true,
    }).catch(() => {
      // Ignore errors to avoid impacting user experience
    });
  });
  
  // Track page views
  useEffect(() => {
    // Skip during development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_TRACK_DEV_ANALYTICS) {
      return;
    }
    
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    
    // Send to analytics
    if (window.umami) {
      window.umami.track('pageview', { url });
    }
  }, [pathname, searchParams]);
  
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