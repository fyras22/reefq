import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { revalidateTag } from 'next/cache';
import { createCacheKey } from './utils';

/**
 * Cache options for both client-side and server-side caching
 */
export interface CacheOptions {
  /** Cache tags for revalidation */
  tags?: string[];
  /** Cache TTL in seconds */
  ttl?: number;
  /** Whether to bypass the cache and force a fresh fetch */
  bypassCache?: boolean;
  /** Revalidate cache after this many seconds */
  revalidate?: number;
}

/**
 * Creates a cache-wrapped function using React's cache() for server components
 * This is a wrapper around React's cache() function for server components
 */
export function createReactCache<T extends (...args: any[]) => Promise<any>>(
  fn: T
): T {
  return cache(fn);
}

/**
 * Creates a cache-wrapped function with revalidation support
 * This is a wrapper around Next.js unstable_cache that adds revalidation support
 */
export function createNextCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: {
    tags?: string[];
    revalidate?: number;
  }
): T {
  return unstable_cache(
    fn,
    [],
    {
      tags: options?.tags || [],
      revalidate: options?.revalidate,
    }
  );
}

/**
 * Bounded query for server-side data fetching with pagination limits
 * Ensures that queries to database are always bounded to prevent unbounded queries
 * @param queryFn Function that performs the actual DB query
 * @param limit Default limit for the query
 * @param options Cache options for the query
 */
export function createBoundedQuery<
  TParams extends Record<string, any>,
  TResult
>(
  queryFn: (params: TParams & { limit: number; skip?: number }) => Promise<TResult>,
  limit: number = 100,
  options: CacheOptions = {}
) {
  const cachedQueryFn = unstable_cache(
    async (params: TParams & { limit?: number; skip?: number }) => {
      // Ensure the query has a limit applied
      const boundedLimit = Math.min(params.limit || limit, limit);
      
      // Call the actual query function with bounded parameters
      return queryFn({
        ...params,
        limit: boundedLimit,
        skip: params.skip || 0,
      });
    },
    [],
    {
      tags: options.tags || [],
      revalidate: options.revalidate,
    }
  );

  return async (params: TParams & { limit?: number; skip?: number }) => {
    // If cache bypass is requested, call the function directly
    if (options.bypassCache) {
      return queryFn({
        ...params,
        limit: Math.min(params.limit || limit, limit),
        skip: params.skip || 0,
      });
    }
    
    return cachedQueryFn(params);
  };
}

/**
 * Memory cache for client-side data caching
 */
class MemoryCache {
  private cache = new Map<string, { value: any; expires: number }>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (entry.expires < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds: number = 60): void {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttlSeconds * 1000,
    });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  purgeExpired(): void {
    const now = Date.now();
    
    // Use Array.from to convert Map entries to an array for compatibility
    const keys = Array.from(this.cache.keys());
    
    for (const key of keys) {
      const entry = this.cache.get(key);
      if (entry && entry.expires < now) {
        this.cache.delete(key);
      }
    }
  }
}

// Create a singleton instance of the memory cache
export const memoryCache = new MemoryCache();

/**
 * Memoizes a server action with revalidation support and tag-based invalidation
 * Useful for expensive operations that should be cached with automatic invalidation support
 */
export function memoizeServerAction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: CacheOptions = {}
): T {
  const { tags = [], ttl = 60, revalidate } = options;
  
  // Create a cached version of the function using unstable_cache
  const cachedFn = unstable_cache(
    fn,
    [],
    {
      tags,
      revalidate,
    }
  );
  
  // Return a function that delegates to the cached version
  return (async (...args: Parameters<T>) => {
    return cachedFn(...args);
  }) as T;
}

/**
 * Flushes the cache for the given tags
 * @param tags Cache tags to invalidate
 */
export function invalidateCache(tags: string[]): void {
  tags.forEach(tag => {
    try {
      revalidateTag(tag);
    } catch (error) {
      console.error(`Failed to revalidate tag: ${tag}`, error);
    }
  });
}

/**
 * Creates a unique tag for the given entity and ID
 * @param entity Entity name (e.g., 'product', 'user')
 * @param id Entity ID or other identifier
 */
export function createEntityTag(entity: string, id?: string | number): string {
  return id ? `${entity}:${id}` : entity;
}

/**
 * Invalidates all cache entries for a specific entity type
 * @param entity Entity name (e.g., 'product', 'user')
 */
export function invalidateEntity(entity: string): void {
  invalidateCache([entity]);
}

/**
 * Invalidates a specific entity by ID
 * @param entity Entity name (e.g., 'product', 'user')
 * @param id Entity ID
 */
export function invalidateEntityById(entity: string, id: string | number): void {
  invalidateCache([createEntityTag(entity, id)]);
}

/**
 * Creates a cached function with automatic cache key generation
 * @param fn Function to cache
 * @param prefix Cache key prefix
 * @param ttl Cache TTL in seconds
 */
export function createCachedFunction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  prefix: string,
  ttl: number = 60
): T {
  return (async (...args: Parameters<T>) => {
    const cacheKey = `${prefix}:${createCacheKey(args[0] || {})}`;
    
    // Check if we have a cached result
    const cachedResult = memoryCache.get<ReturnType<T>>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    
    // Call the function and cache the result
    const result = await fn(...args);
    memoryCache.set(cacheKey, result, ttl);
    
    return result;
  }) as T;
} 