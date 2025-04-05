'use client';

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

export interface PreloadScriptProps {
  /**
   * Script source URL
   */
  src: string;
  
  /**
   * Script loading strategy
   */
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload';
  
  /**
   * Script integrity hash for subresource integrity
   */
  integrity?: string;
  
  /**
   * Whether the script should be loaded from the same origin
   */
  crossOrigin?: 'anonymous' | 'use-credentials';
  
  /**
   * Alternative nonce for CSP
   */
  nonce?: string;
  
  /**
   * Script onLoad callback
   */
  onLoad?: () => void;
  
  /**
   * Script onError callback
   */
  onError?: (error: Error) => void;
}

/**
 * Performance resource entry with more specific properties
 */
interface PerformanceResourceEntry extends PerformanceEntry {
  initiatorType?: string;
  transferSize?: number;
}

/**
 * Preload multiple scripts with optimal loading strategy
 * Helps improve Lighthouse scores by using appropriate loading strategies
 */
export function SSRScriptPreloader({
  scripts,
  enablePerformanceMonitoring = true,
}: {
  scripts: PreloadScriptProps[];
  enablePerformanceMonitoring?: boolean;
}) {
  const loadedScripts = useRef<Set<string>>(new Set());
  
  // Track script loading performance metrics
  useEffect(() => {
    if (!enablePerformanceMonitoring) return;
    
    // Create PerformanceObserver to monitor script loading
    if (typeof PerformanceObserver !== 'undefined') {
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const resourceEntry = entry as PerformanceResourceEntry;
          
          if (entry.entryType === 'resource' && resourceEntry.initiatorType === 'script') {
            const url = entry.name;
            const duration = entry.duration;
            const size = resourceEntry.transferSize || 0;
            
            // Log performance metrics
            console.debug(`[Script Loaded] ${url} - ${Math.round(duration)}ms, ${Math.round(size / 1024)}KB`);
            
            // Send metrics to analytics if available
            if (typeof window !== 'undefined' && window.va) {
              window.va('event', {
                name: 'script_loaded',
                data: {
                  url,
                  duration,
                  size,
                  timestamp: Date.now(),
                },
              });
            }
          }
        }
      });
      
      observer.observe({ type: 'resource', buffered: true });
      
      return () => {
        observer.disconnect();
      };
    }
  }, [enablePerformanceMonitoring]);
  
  // Return script components with appropriate loading strategies
  return (
    <>
      {scripts.map((script) => (
        <Script
          key={script.src}
          src={script.src}
          strategy={script.strategy || 'afterInteractive'}
          integrity={script.integrity}
          crossOrigin={script.crossOrigin}
          nonce={script.nonce}
          onLoad={() => {
            loadedScripts.current.add(script.src);
            if (script.onLoad) script.onLoad();
          }}
          onError={(error) => {
            console.error(`Failed to load script: ${script.src}`, error);
            if (script.onError) script.onError(error as Error);
          }}
        />
      ))}
    </>
  );
}

/**
 * Preload a third-party script bundle with optimal loading strategy
 * Ideal for analytics, marketing pixels, etc.
 */
export function PreloadThirdPartyScript({
  src,
  strategy = 'lazyOnload',
  id,
  onLoad,
  attributes = {},
}: {
  src: string;
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload';
  id?: string;
  onLoad?: () => void;
  attributes?: Record<string, string>;
}) {
  return (
    <Script
      src={src}
      strategy={strategy}
      id={id}
      onLoad={onLoad}
      {...attributes}
    />
  );
}

/**
 * Preconnect to important domains for faster resource loading
 */
export function DomainPreconnect({
  domains,
}: {
  domains: Array<{
    domain: string;
    crossOrigin?: boolean;
    preload?: boolean;
    resources?: Array<{
      path: string;
      type: 'script' | 'style' | 'font' | 'image';
    }>;
  }>;
}) {
  return (
    <>
      {domains.map(({ domain, crossOrigin, preload, resources }) => (
        <React.Fragment key={domain}>
          {/* DNS prefetch as a fallback */}
          <link rel="dns-prefetch" href={`//${domain}`} />
          
          {/* Preconnect for modern browsers */}
          <link 
            rel="preconnect" 
            href={`https://${domain}`}
            crossOrigin={crossOrigin ? 'anonymous' : undefined}
          />
          
          {/* Optional resource preloading */}
          {preload && resources && resources.map((resource) => (
            <link
              key={`${domain}${resource.path}`}
              rel="preload"
              href={`https://${domain}${resource.path}`}
              as={resource.type}
              crossOrigin={crossOrigin ? 'anonymous' : undefined}
            />
          ))}
        </React.Fragment>
      ))}
    </>
  );
}

/**
 * Inject inline script with critical JavaScript
 * Use for critical scripts that must execute immediately
 */
export function InlineCriticalScript({
  id,
  code,
  nonce,
}: {
  id?: string;
  code: string;
  nonce?: string;
}) {
  // Safe way to include inline scripts
  return (
    <script
      id={id}
      dangerouslySetInnerHTML={{ __html: code }}
      nonce={nonce}
    />
  );
}

// Define the window.va for Vercel Analytics compatibility with the exact type
declare global {
  interface Window {
    va?: (event: "beforeSend" | "event" | "pageview", properties?: unknown) => void;
  }
} 