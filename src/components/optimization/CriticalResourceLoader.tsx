'use client';

import { useEffect, useRef } from 'react';
import { resourcePreloader } from '@/lib/optimizations/ResourcePreloader';

interface CriticalResourceLoaderProps {
  preconnectOrigins?: string[];
  criticalImages?: string[];
  criticalFonts?: string[];
  criticalScripts?: string[];
  enabled?: boolean;
  children?: React.ReactNode;
}

/**
 * Component for optimizing critical resource loading in pages
 * 
 * This component can be added to critical pages (like landing pages) 
 * to ensure optimal loading of important resources.
 * 
 * @example
 * <CriticalResourceLoader
 *   preconnectOrigins={['https://fonts.googleapis.com']}
 *   criticalImages={['/hero.webp']}
 * />
 */
export default function CriticalResourceLoader({
  preconnectOrigins = [],
  criticalImages = [],
  criticalFonts = [],
  criticalScripts = [],
  enabled = true,
  children
}: CriticalResourceLoaderProps) {
  const initialized = useRef(false);
  
  useEffect(() => {
    if (!enabled || initialized.current) return;
    
    // Initialize preloader with critical resources
    resourcePreloader.initialize({
      preconnectOrigins,
      criticalImages,
      criticalFonts,
      criticalScripts,
    });
    
    initialized.current = true;
  }, [preconnectOrigins, criticalImages, criticalFonts, criticalScripts, enabled]);
  
  // Only render children if provided (can be used as a wrapper)
  return children ? <>{children}</> : null;
}

/**
 * HOC (Higher Order Component) to add critical resource loading to a page
 * 
 * @example
 * const HomePage = () => <div>Welcome</div>;
 * export default withCriticalResources(HomePage, {
 *   criticalImages: ['/hero.webp', '/logo.svg'],
 * });
 */
export function withCriticalResources<P extends {}>(
  Component: React.ComponentType<P>,
  resources: Omit<CriticalResourceLoaderProps, 'children' | 'enabled'>
) {
  const WithCriticalResources = (props: P) => {
    return (
      <>
        <CriticalResourceLoader {...resources} />
        <Component {...props} />
      </>
    );
  };
  
  const displayName = Component.displayName || Component.name || 'Component';
  WithCriticalResources.displayName = `WithCriticalResources(${displayName})`;
  
  return WithCriticalResources;
}

/**
 * Hook to preload specific resources from within components
 * 
 * @example
 * const ProductPage = () => {
 *   const { preloadImage } = useCriticalResources();
 *   
 *   useEffect(() => {
 *     // Preload next page's hero image when user hovers a button
 *     preloadImage('/next-page-hero.webp');
 *   }, []);
 *   
 *   return <div>Product page content</div>;
 * };
 */
export function useCriticalResources() {
  return {
    preloadImage: (url: string) => {
      resourcePreloader.preloadResource(url, { as: 'image' });
    },
    
    preloadFont: (url: string, type = 'font/woff2') => {
      resourcePreloader.preloadResource(url, { 
        as: 'font',
        type,
        crossOrigin: 'anonymous'
      });
    },
    
    preloadScript: (url: string) => {
      resourcePreloader.preloadResource(url, { as: 'script' });
    },
    
    prefetchPage: (url: string) => {
      resourcePreloader.prefetchResource(url, { as: 'document' });
    },
    
    // Preconnect to an origin for faster subsequent requests
    preconnect: (origin: string, withCredentials = false) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      if (withCredentials) {
        link.crossOrigin = 'use-credentials';
      }
      document.head.appendChild(link);
    },
  };
} 