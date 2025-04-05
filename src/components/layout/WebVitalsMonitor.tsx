'use client';

import { useEffect } from 'react';
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

// Types for the metrics
type MetricName = 'CLS' | 'FID' | 'LCP' | 'FCP' | 'TTFB';

interface MetricReport {
  name: MetricName;
  value: number;
  id: string;
  delta: number;
  navigationType: string;
}

/**
 * Component to monitor and report Core Web Vitals
 * This is a client component that doesn't render anything visually
 */
export default function WebVitalsMonitor() {
  useEffect(() => {
    // Helper function to send metrics to our API endpoint
    const reportVital = async ({ name, value, id, delta, navigationType }: MetricReport) => {
      try {
        // Use sendBeacon if available for non-blocking reporting
        const url = '/api/vitals';
        const body = JSON.stringify({
          name,
          value,
          id,
          delta,
          navigationType,
          // Include additional context
          path: window.location.pathname,
          deviceType: getDeviceType(),
          connectionType: (navigator as any).connection?.effectiveType || 'unknown',
          timestamp: new Date().toISOString(),
        });

        // Try using sendBeacon first (non-blocking)
        if (navigator.sendBeacon) {
          const success = navigator.sendBeacon(url, body);
          if (success) return;
        }
        
        // Fall back to fetch if sendBeacon fails or isn't available
        await fetch(url, {
          method: 'POST',
          body,
          headers: { 'Content-Type': 'application/json' },
          // Use keepalive to ensure the request completes even if page navigates away
          keepalive: true,
        });
      } catch (error) {
        // Silent failure - we don't want to impact the user experience
        console.error('Failed to report web vital:', error);
      }
    };

    // Helper to determine device type
    const getDeviceType = () => {
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet';
      }
      if (/Mobile|iPhone|Android/.test(ua)) {
        return 'mobile';
      }
      return 'desktop';
    };

    // Register each web vital measurement
    onCLS((metric) => reportVital({ ...metric, name: 'CLS' } as MetricReport));
    onFID((metric) => reportVital({ ...metric, name: 'FID' } as MetricReport));
    onLCP((metric) => reportVital({ ...metric, name: 'LCP' } as MetricReport));
    onFCP((metric) => reportVital({ ...metric, name: 'FCP' } as MetricReport));
    onTTFB((metric) => reportVital({ ...metric, name: 'TTFB' } as MetricReport));
  }, []);

  // This component doesn't render anything
  return null;
} 