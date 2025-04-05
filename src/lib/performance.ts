/**
 * Utility functions for optimizing performance
 */

/**
 * Resource priority hints for different types of resources
 */
export type ResourcePriority = 'high' | 'low' | 'auto';
export type ResourceType = 'image' | 'script' | 'style' | 'font';

/**
 * Options for preloading resources
 */
interface PreloadOptions {
  priority?: ResourcePriority;
  as: ResourceType;
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
  media?: string;
  disabled?: boolean;
}

/**
 * Preloads a resource with appropriate priority
 * This helps improve LCP by loading critical resources earlier
 */
export function preloadResource(url: string, options: PreloadOptions): void {
  if (typeof window === 'undefined' || options.disabled) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = options.as;

  if (options.priority) {
    link.setAttribute('fetchpriority', options.priority);
  }

  if (options.type) {
    link.type = options.type;
  }

  if (options.crossOrigin) {
    link.crossOrigin = options.crossOrigin;
  }

  if (options.media) {
    link.media = options.media;
  }

  document.head.appendChild(link);
}

/**
 * Preloads critical path images for better LCP
 */
export function preloadCriticalImages(imagePaths: string[]): void {
  imagePaths.forEach(imagePath => {
    preloadResource(imagePath, {
      as: 'image',
      priority: 'high',
    });
  });
}

/**
 * Prefetches data for a route
 */
export function prefetchRouteData(url: string): void {
  if (typeof window === 'undefined') return;

  const prefetchLink = document.createElement('link');
  prefetchLink.rel = 'prefetch';
  prefetchLink.href = url;
  document.head.appendChild(prefetchLink);
}

/**
 * Options for lazy loaded image tracking
 */
interface ImageLoadTrackingOptions {
  onImageLoaded?: (entry: IntersectionObserverEntry, img: HTMLImageElement) => void;
  rootMargin?: string;
  threshold?: number;
}

/**
 * Sets up tracking for all lazy-loaded images to identify slow-loading images
 * Useful for finding images that impact LCP
 */
export function trackImageLoading(options: ImageLoadTrackingOptions = {}): () => void {
  if (typeof window === 'undefined') return () => {};

  const {
    onImageLoaded,
    rootMargin = '0px',
    threshold = 0,
  } = options;

  const loadTimes = new Map<string, number>();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          
          // Record when image starts loading
          loadTimes.set(img.src, performance.now());
          
          img.addEventListener('load', () => {
            const startTime = loadTimes.get(img.src);
            if (startTime) {
              const loadTime = performance.now() - startTime;
              console.debug(`Image loaded: ${img.src} (${Math.round(loadTime)}ms)`);
              
              // Report slow images (over 200ms)
              if (loadTime > 200) {
                console.warn(`Slow image load detected: ${img.src} (${Math.round(loadTime)}ms)`);
              }
              
              if (onImageLoaded) {
                onImageLoaded(entry, img);
              }
            }
          });
          
          // Stop observing after we've detected it
          observer.unobserve(img);
        }
      });
    },
    { rootMargin, threshold }
  );

  // Observe all images that have loading="lazy"
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    observer.observe(img);
  });

  // Return a cleanup function
  return () => observer.disconnect();
}

/**
 * Optimizes font loading for better performance
 */
export function optimizeFontLoading(fontUrls: string[]): void {
  fontUrls.forEach(url => {
    preloadResource(url, {
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous'
    });
  });
}

/**
 * Measures and reports Largest Contentful Paint (LCP)
 */
export function measureLCP(callback: (lcpTime: number) => void): void {
  if (typeof window === 'undefined') return;

  // Only run in production or when explicitly enabled
  if (process.env.NODE_ENV !== 'production' && !process.env.NEXT_PUBLIC_ENABLE_METRICS) {
    return;
  }

  try {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        // LCP time in milliseconds
        const lcpTime = lastEntry.startTime;
        callback(lcpTime);
        
        // Log warning if LCP is high
        if (lcpTime > 2500) {
          console.warn(`High LCP detected: ${Math.round(lcpTime)}ms`);
        }
      }
    });
    
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    
    // Disconnect after 8 seconds (if page hasn't unloaded)
    setTimeout(() => observer.disconnect(), 8000);
  } catch (e) {
    console.error('Error measuring LCP:', e);
  }
}

/**
 * Interface for layout shift entry
 */
interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

/**
 * Measures Cumulative Layout Shift (CLS)
 */
export function measureCLS(callback: (clsValue: number) => void): void {
  if (typeof window === 'undefined') return;

  // Only run in production or when explicitly enabled
  if (process.env.NODE_ENV !== 'production' && !process.env.NEXT_PUBLIC_ENABLE_METRICS) {
    return;
  }

  try {
    let clsValue = 0;
    let clsEntries: LayoutShiftEntry[] = [];
    
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries() as LayoutShiftEntry[];
      
      entries.forEach(entry => {
        // Only count layout shifts without recent user input
        if (!entry.hadRecentInput) {
          clsEntries.push(entry);
          // entry.value represents the layout shift value
          clsValue += entry.value;
          
          callback(clsValue);
          
          // Log warning if CLS is high
          if (clsValue > 0.1) {
            console.warn(`High CLS detected: ${clsValue.toFixed(3)}`);
          }
        }
      });
    });
    
    observer.observe({ type: 'layout-shift', buffered: true });
    
    // Report final CLS after 8 seconds
    setTimeout(() => {
      observer.disconnect();
      callback(clsValue);
    }, 8000);
  } catch (e) {
    console.error('Error measuring CLS:', e);
  }
} 