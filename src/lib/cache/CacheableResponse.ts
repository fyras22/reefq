import { NextRequest, NextResponse } from 'next/server';

/**
 * Options for creating a cacheable response
 */
export interface CacheOptions {
  /**
   * Time-to-live in seconds
   * @default 60 (1 minute)
   */
  ttl?: number;
  
  /**
   * Cache tags for invalidation
   */
  tags?: string[];
  
  /**
   * Whether to include cache metadata headers in the response
   * @default false
   */
  includeCacheMetadata?: boolean;
  
  /**
   * Whether to skip cache and force revalidation
   * @default false
   */
  skipCache?: boolean;
  
  /**
   * Status code for the response
   * @default 200
   */
  status?: number;
  
  /**
   * Headers to add to the response
   */
  headers?: Record<string, string>;
  
  /**
   * Cache control directives
   */
  cacheControl?: string;
}

/**
 * Creates a cacheable API response
 * Handles cache headers, stale-while-revalidate, and cache tags
 */
export async function cacheableResponse<T>(
  req: NextRequest,
  dataFn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<NextResponse> {
  const {
    ttl = 60,
    tags = [],
    includeCacheMetadata = false,
    skipCache = false,
    status = 200,
    headers = {},
    cacheControl,
  } = options;

  // Check if we should skip cache
  const skipCacheHeader = req.headers.get('x-reefq-skip-cache');
  const shouldSkipCache = skipCache || skipCacheHeader === 'true';
  
  // Generate cache control header
  const defaultCacheControl = shouldSkipCache
    ? 'no-store, must-revalidate'
    : `s-maxage=${ttl}, stale-while-revalidate=${Math.floor(ttl * 0.5)}`;
  
  // Fetch the data
  const data = await dataFn();
  
  // Create response
  const response = NextResponse.json(data, {
    status,
    headers: {
      'Cache-Control': cacheControl || defaultCacheControl,
      ...(tags.length > 0 && { 'Cache-Tag': tags.join(',') }),
      ...headers,
    },
  });
  
  // Add cache metadata if requested
  if (includeCacheMetadata) {
    response.headers.set('X-Cache-TTL', ttl.toString());
    response.headers.set('X-Cache-Tags', tags.join(','));
    response.headers.set('X-Cache-Time', new Date().toISOString());
    response.headers.set('X-Cache-Skip', shouldSkipCache.toString());
  }
  
  return response;
}

/**
 * Helper function to create a cache key from a request
 */
export function createCacheKey(req: NextRequest): string {
  const url = new URL(req.url);
  return `${url.pathname}${url.search}`;
}

/**
 * Invalidate cache for specific tags
 * This is a utility function for server-actions or API routes
 * that need to invalidate cache when data changes
 */
export async function invalidateCache(tags: string[]): Promise<void> {
  // In a real implementation, this would send a request to the CDN
  // or cache service to invalidate cache entries with these tags
  console.log(`Cache invalidation requested for tags: ${tags.join(', ')}`);
  
  // For vercel:
  // const revalidateUrl = `https://api.vercel.com/v1/projects/${PROJECT_ID}/cache`;
  // const response = await fetch(revalidateUrl, {
  //   method: 'PURGE',
  //   headers: {
  //     Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ tags }),
  // });
} 