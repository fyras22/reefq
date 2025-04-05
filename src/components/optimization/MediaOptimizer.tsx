'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

interface MediaOptimizerProps {
  /**
   * Component to render when media is in view
   */
  children: React.ReactNode;
  
  /**
   * Whether to prioritize loading the media (default: false)
   */
  priority?: boolean;
  
  /**
   * Root margin for the intersection observer
   */
  rootMargin?: string;
  
  /**
   * Threshold for the intersection observer
   */
  threshold?: number;
  
  /**
   * Skip lazy loading and render immediately
   */
  skipLazyLoading?: boolean;
  
  /**
   * Component to render as a placeholder
   */
  placeholder?: React.ReactNode;
  
  /**
   * Background color to use while loading (useful for video posters)
   */
  backgroundColor?: string;
  
  /**
   * Class name for the container
   */
  className?: string;
  
  /**
   * Called when the media is in view
   */
  onInView?: () => void;
  
  /**
   * Media type for analytics tracking
   */
  mediaType?: 'image' | 'video' | 'audio' | 'iframe' | 'custom';
}

/**
 * MediaOptimizer - A component that optimizes media loading using intersection observer
 * Prevents Cumulative Layout Shift (CLS) and improves Core Web Vitals
 */
export function MediaOptimizer({
  children,
  priority = false,
  rootMargin = '200px',
  threshold = 0,
  skipLazyLoading = false,
  placeholder,
  backgroundColor,
  className = '',
  onInView,
  mediaType = 'custom',
}: MediaOptimizerProps) {
  // Track whether the media has entered the viewport
  const { ref, inView } = useInView({
    rootMargin,
    threshold,
    triggerOnce: true,
  });
  
  // Track if we should render the media
  const [shouldRender, setShouldRender] = useState(priority || skipLazyLoading);
  
  // Track media load state for analytics
  const [isLoaded, setIsLoaded] = useState(false);
  const loadStartTime = useRef<number | null>(null);
  
  // Handle viewport visibility changes
  useEffect(() => {
    if (inView && !shouldRender) {
      setShouldRender(true);
      loadStartTime.current = performance.now();
      onInView?.();
    }
  }, [inView, shouldRender, onInView]);
  
  // Handle media load completion for analytics tracking
  const handleMediaLoaded = () => {
    if (!isLoaded && loadStartTime.current) {
      const loadTime = performance.now() - loadStartTime.current;
      
      // Track media load performance
      if (typeof window !== 'undefined' && window.va) {
        window.va('event', {
          name: 'media_loaded',
          data: {
            mediaType,
            loadTime,
            priority,
            lazyLoaded: !priority && !skipLazyLoading,
          },
        });
      }
      
      setIsLoaded(true);
    }
  };
  
  // Add media loaded event listener to children
  const childrenWithLoadTracking = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    
    // For image elements
    if (child.type === Image || (typeof child.type === 'string' && child.type === 'img')) {
      return React.cloneElement(child, {
        onLoad: (e: any) => {
          handleMediaLoaded();
          if (child.props.onLoad) child.props.onLoad(e);
        },
        onError: (e: any) => {
          if (child.props.onError) child.props.onError(e);
        },
      });
    }
    
    // For video elements
    if (typeof child.type === 'string' && child.type === 'video') {
      return React.cloneElement(child, {
        onLoadedData: (e: any) => {
          handleMediaLoaded();
          if (child.props.onLoadedData) child.props.onLoadedData(e);
        },
        onError: (e: any) => {
          if (child.props.onError) child.props.onError(e);
        },
      });
    }
    
    return child;
  });
  
  // Get appropriate styles including background color for placeholder
  const containerStyles = backgroundColor 
    ? { backgroundColor, ...(!isLoaded && { minHeight: '20px' }) }
    : {};
  
  return (
    <div
      ref={ref}
      className={`media-optimizer ${className}`}
      style={containerStyles}
      data-media-type={mediaType}
      data-priority={priority}
      data-loaded={isLoaded}
    >
      {shouldRender ? childrenWithLoadTracking : placeholder}
    </div>
  );
}

/**
 * Background blur placeholder for images
 */
export function BlurredImagePlaceholder({ 
  color = '#f0f0f0',
  width,
  height,
  aspectRatio,
  className = '',
}: {
  color?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  className?: string;
}) {
  // Calculate padding-bottom for aspect ratio
  let paddingBottom = '56.25%'; // Default 16:9 ratio
  
  if (aspectRatio) {
    const [w, h] = aspectRatio.split(':');
    paddingBottom = `${(parseInt(h) / parseInt(w)) * 100}%`;
  } else if (width && height) {
    paddingBottom = `${(height / width) * 100}%`;
  }
  
  return (
    <div
      className={`relative w-full overflow-hidden blur-placeholder ${className}`}
      style={{ 
        backgroundColor: color,
        paddingBottom: aspectRatio || (width && height) ? paddingBottom : undefined,
      }}
    >
      <div className="absolute inset-0 blur-sm animate-pulse" />
    </div>
  );
}

interface MediaMetrics {
  lcp: number | null;
  loadTime: number | null;
  displayTime: number | null;
  visibleTime: number | null;
}

/**
 * Hook to track media performance metrics
 */
export function useMediaMetrics(): [MediaMetrics, (element: HTMLElement | null) => void] {
  const [metrics, setMetrics] = useState<MediaMetrics>({
    lcp: null,
    loadTime: null,
    displayTime: null,
    visibleTime: null,
  });
  
  const elementRef = useRef<HTMLElement | null>(null);
  const startTimeRef = useRef<number>(performance.now());
  
  const updateMetric = (key: keyof MediaMetrics, value: number) => {
    setMetrics(prev => ({ ...prev, [key]: value }));
  };
  
  // Set up observer for element visibility
  useEffect(() => {
    if (!elementRef.current) return;
    
    // Observe LCP updates
    if (typeof PerformanceObserver !== 'undefined') {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry && lastEntry.element === elementRef.current) {
          updateMetric('lcp', lastEntry.startTime);
        }
      });
      
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      return () => lcpObserver.disconnect();
    }
  }, []);
  
  // Set up intersection observer to track visibility
  useEffect(() => {
    if (!elementRef.current) return;
    
    const element = elementRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !metrics.visibleTime) {
          updateMetric('visibleTime', performance.now() - startTimeRef.current);
        }
      },
      { threshold: 0.5 }
    );
    
    io.observe(element);
    return () => io.disconnect();
  }, [metrics.visibleTime]);
  
  // Create ref callback
  const setRef = (element: HTMLElement | null) => {
    if (element) {
      elementRef.current = element;
      
      // For already loaded images, track display time
      if (element.complete || element.readyState >= 3) {
        updateMetric('loadTime', performance.now() - startTimeRef.current);
        updateMetric('displayTime', performance.now() - startTimeRef.current);
      } else {
        // Listen for load event
        const handleLoad = () => {
          updateMetric('loadTime', performance.now() - startTimeRef.current);
          updateMetric('displayTime', performance.now() - startTimeRef.current);
        };
        
        element.addEventListener('load', handleLoad);
        element.addEventListener('loadeddata', handleLoad);
        
        // Clean up
        const cleanup = () => {
          element.removeEventListener('load', handleLoad);
          element.removeEventListener('loadeddata', handleLoad);
        };
        setTimeout(cleanup, 10000); // Safety timeout
      }
    }
  };
  
  return [metrics, setRef];
}

// Type for media preconnect options
interface PreconnectOptions {
  url: string;
  crossOrigin?: boolean;
  dns?: boolean;
}

/**
 * Preconnect to important domains used for media to improve loading performance
 * Should be used in the app layout or page head
 */
export function useMediaPreconnect(domains: PreconnectOptions[]) {
  useEffect(() => {
    // Skip on server
    if (typeof document === 'undefined') return;
    
    const links: HTMLLinkElement[] = [];
    
    domains.forEach(({ url, crossOrigin, dns }) => {
      if (dns) {
        // DNS prefetch as fallback for older browsers
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = url;
        document.head.appendChild(link);
        links.push(link);
      }
      
      // Preconnect for modern browsers
      const preconnectLink = document.createElement('link');
      preconnectLink.rel = 'preconnect';
      preconnectLink.href = url;
      if (crossOrigin) {
        preconnectLink.crossOrigin = 'anonymous';
      }
      document.head.appendChild(preconnectLink);
      links.push(preconnectLink);
    });
    
    // Cleanup
    return () => {
      links.forEach(link => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, [domains]);
}

// Declare global window.va for Vercel Analytics
declare global {
  interface Window {
    va?: (command: string, args?: any) => void;
  }
} 