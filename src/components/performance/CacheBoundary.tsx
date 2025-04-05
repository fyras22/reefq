'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';

// Cache duration options
export type CacheDuration = 
  | number // seconds
  | `${number}s` // seconds
  | `${number}m` // minutes
  | `${number}h` // hours
  | `${number}d` // days
  | 'no-store' // don't cache
  | 'force-cache'; // cache indefinitely

// Cache options
export interface CacheOptions {
  /**
   * Duration to cache content for. Can be a number (seconds) or string like '5m', '2h', '1d'
   */
  duration?: CacheDuration;
  
  /**
   * Key to use for caching. If not provided, one will be auto-generated
   */
  key?: string;
  
  /**
   * Whether to revalidate the cache on window focus
   */
  revalidateOnFocus?: boolean;
  
  /**
   * Whether to revalidate the cache on network reconnection
   */
  revalidateOnReconnect?: boolean;
  
  /**
   * Whether to revalidate the cache on component mount
   */
  revalidateOnMount?: boolean;
  
  /**
   * Whether to show stale content while revalidating
   */
  showStaleWhileRevalidating?: boolean;
  
  /**
   * Tag to use for cache invalidation
   */
  tag?: string | string[];
}

// States for the cache
type CacheState = 'loading' | 'resolved' | 'error' | 'stale';

/**
 * Parse cache duration string to seconds
 */
function parseDuration(duration: CacheDuration): number {
  if (duration === 'no-store') return 0;
  if (duration === 'force-cache') return Number.MAX_SAFE_INTEGER;
  
  if (typeof duration === 'number') return duration;
  
  const value = parseInt(duration.slice(0, -1), 10);
  const unit = duration.slice(-1);
  
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 60 * 60 * 24;
    default: return value;
  }
}

/**
 * Check if a cache entry is stale
 */
function isCacheStale(entry: CacheEntry): boolean {
  if (!entry.expiresAt) return false;
  return Date.now() > entry.expiresAt;
}

// Type for cache entry
interface CacheEntry {
  value: React.ReactNode;
  expiresAt: number | null;
  lastUpdated: number;
  tags: string[];
}

// In-memory client-side cache
const memoryCache = new Map<string, CacheEntry>();

/**
 * Component for caching UI parts
 */
export default function CacheBoundary({
  children,
  fallback,
  errorFallback,
  options = {},
  dependencies = [],
  onRevalidate,
}: {
  /**
   * Content to be cached
   */
  children: React.ReactNode;
  
  /**
   * Fallback to show while loading
   */
  fallback?: React.ReactNode;
  
  /**
   * Fallback to show on error
   */
  errorFallback?: React.ReactNode;
  
  /**
   * Cache options
   */
  options?: CacheOptions;
  
  /**
   * Dependencies that trigger revalidation when changed
   */
  dependencies?: any[];
  
  /**
   * Callback when revalidation occurs
   */
  onRevalidate?: () => void;
}) {
  // Create unique ID for this cache boundary
  const id = useId();
  const cacheKey = options.key || id;
  
  // States
  const [state, setState] = useState<CacheState>(() => {
    const entry = memoryCache.get(cacheKey);
    if (!entry) return 'loading';
    return isCacheStale(entry) ? 'stale' : 'resolved';
  });
  
  const [cachedContent, setCachedContent] = useState<React.ReactNode>(() => {
    return memoryCache.get(cacheKey)?.value;
  });
  
  // Parse the duration
  const duration = options.duration || '5m';
  const durationInSeconds = parseDuration(duration);
  
  // Refs for tracking mounts and unmounts
  const mountedRef = useRef(false);
  const childrenRef = useRef(children);
  
  // Update the children ref when children change
  useEffect(() => {
    childrenRef.current = children;
  }, [children]);
  
  // Function to update the cache
  const updateCache = useCallback(() => {
    if (!mountedRef.current) return;
    
    // Set in memory cache
    const expiresAt = durationInSeconds 
      ? Date.now() + durationInSeconds * 1000 
      : null;
    
    const tags = Array.isArray(options.tag) 
      ? options.tag 
      : options.tag ? [options.tag] : [];
    
    const entry: CacheEntry = {
      value: childrenRef.current,
      expiresAt,
      lastUpdated: Date.now(),
      tags,
    };
    
    memoryCache.set(cacheKey, entry);
    
    // Update state
    setCachedContent(childrenRef.current);
    setState('resolved');
    
    // Trigger onRevalidate callback
    if (onRevalidate) {
      onRevalidate();
    }
  }, [cacheKey, durationInSeconds, options.tag, onRevalidate]);
  
  // Function to revalidate the cache
  const revalidate = useCallback(() => {
    // If showing stale while revalidating, set state to stale
    if (options.showStaleWhileRevalidating && memoryCache.has(cacheKey)) {
      setState('stale');
    } else {
      setState('loading');
    }
    
    // Simulate async update
    setTimeout(updateCache, 0);
  }, [cacheKey, options.showStaleWhileRevalidating, updateCache]);
  
  // Initial cache population
  useEffect(() => {
    mountedRef.current = true;
    
    if (!memoryCache.has(cacheKey) || options.revalidateOnMount) {
      updateCache();
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, [cacheKey, options.revalidateOnMount, updateCache]);
  
  // Revalidate on dependencies change
  useEffect(() => {
    if (dependencies.length > 0) {
      revalidate();
    }
  }, [dependencies, revalidate]);
  
  // Revalidate on focus
  useEffect(() => {
    if (!options.revalidateOnFocus) return;
    
    const handleFocus = () => {
      const entry = memoryCache.get(cacheKey);
      if (entry && isCacheStale(entry)) {
        revalidate();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [cacheKey, options.revalidateOnFocus, revalidate]);
  
  // Revalidate on reconnect
  useEffect(() => {
    if (!options.revalidateOnReconnect) return;
    
    const handleOnline = () => {
      const entry = memoryCache.get(cacheKey);
      if (entry && isCacheStale(entry)) {
        revalidate();
      }
    };
    
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [cacheKey, options.revalidateOnReconnect, revalidate]);
  
  // Render based on state
  switch (state) {
    case 'loading':
      return <>{fallback || null}</>;
    case 'error':
      return <>{errorFallback || null}</>;
    case 'resolved':
    case 'stale':
      return <>{cachedContent}</>;
    default:
      return <>{children}</>;
  }
}

/**
 * Invalidate all cache entries with a specific tag
 */
export function invalidateCache(tag: string): void {
  // Use Array.from to convert map entries to array for compatibility
  Array.from(memoryCache.entries()).forEach(([key, entry]) => {
    if (entry.tags.includes(tag)) {
      memoryCache.delete(key);
    }
  });
}

/**
 * Invalidate a specific cache entry
 */
export function invalidateCacheKey(key: string): void {
  memoryCache.delete(key);
}

/**
 * Invalidate all stale cache entries
 */
export function invalidateStaleCache(): void {
  // Use Array.from to convert map entries to array for compatibility
  Array.from(memoryCache.entries()).forEach(([key, entry]) => {
    if (isCacheStale(entry)) {
      memoryCache.delete(key);
    }
  });
}

/**
 * Clear all cache entries
 */
export function clearCache(): void {
  memoryCache.clear();
}

/**
 * Check if a cache entry exists
 */
export function cacheExists(key: string): boolean {
  return memoryCache.has(key);
}

/**
 * Get all cache keys
 */
export function getCacheKeys(): string[] {
  return Array.from(memoryCache.keys());
}

/**
 * Get the cache entry details
 */
export function getCacheInfo(key: string): { 
  exists: boolean;
  isStale: boolean;
  lastUpdated: number | null;
  expiresAt: number | null;
  tags: string[];
} {
  const entry = memoryCache.get(key);
  
  if (!entry) {
    return {
      exists: false,
      isStale: false,
      lastUpdated: null,
      expiresAt: null,
      tags: [],
    };
  }
  
  return {
    exists: true,
    isStale: isCacheStale(entry),
    lastUpdated: entry.lastUpdated,
    expiresAt: entry.expiresAt,
    tags: entry.tags,
  };
}

/**
 * Usage Example:
 * 
 * <CacheBoundary
 *   options={{
 *     duration: '1h',
 *     revalidateOnFocus: true,
 *     key: 'product-list', 
 *     tag: ['products']
 *   }}
 *   fallback={<ProductListSkeleton />}
 *   dependencies={[currentPage, sortOrder]}
 * >
 *   <ProductList products={products} />
 * </CacheBoundary>
 */ 