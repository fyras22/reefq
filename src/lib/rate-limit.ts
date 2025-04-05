import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { LRUCache } from 'lru-cache';

/**
 * Options for rate limiting
 */
export interface RateLimitOptions {
  /** Maximum number of requests allowed within the interval */
  limit?: number;
  /** Time window in milliseconds */
  interval?: number;
  /** Maximum number of unique tokens to track per interval */
  uniqueTokenPerInterval?: number;
}

interface RateLimitConfig {
  limit: number;
  interval: number; // in milliseconds
  uniqueTokenPerInterval?: number;
}

interface RateLimitResponse {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Create a memory-based rate limiter for local development
 */
function createMemoryRateLimit(config: RateLimitConfig) {
  const { limit, interval, uniqueTokenPerInterval = 500 } = config;
  
  // Create LRU cache for storing request counts
  const tokenCache = new LRUCache<string, number[]>({
    max: uniqueTokenPerInterval,
    ttl: interval,
  });
  
  return {
    check: async (token: string): Promise<RateLimitResponse> => {
      const now = Date.now();
      const windowStart = now - interval;
      
      // Get existing requests from cache
      const cachedRequests = tokenCache.get(token) || [];
      
      // Filter out expired timestamps
      const validRequests = [...cachedRequests.filter(timestamp => timestamp > windowStart), now];
      
      // Update cache
      tokenCache.set(token, validRequests);
      
      const remaining = Math.max(0, limit - validRequests.length);
      const success = validRequests.length <= limit;
      const reset = Math.ceil((now + interval) / 1000); // Reset time in seconds
      
      return {
        success,
        limit,
        remaining,
        reset,
      };
    },
  };
}

/**
 * Create an Upstash Redis-based rate limiter for production
 */
function createRedisRateLimit(config: RateLimitConfig) {
  // Initialize Redis client if credentials are available
  const redis = process.env.UPSTASH_REDIS_REST_URL
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL || '',
        token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
      })
    : null;
  
  // If Redis is not available, fall back to memory cache
  if (!redis) {
    console.warn('Redis credentials not found, falling back to memory rate limiter');
    return createMemoryRateLimit(config);
  }
  
  // Create Upstash rate limiter
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.limit, `${config.interval}ms`),
    analytics: true,
  });
  
  return {
    check: async (token: string): Promise<RateLimitResponse> => {
      const result = await ratelimit.limit(token);
      
      return {
        success: !result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: Math.ceil(result.reset / 1000), // Convert to seconds
      };
    },
  };
}

/**
 * Create a rate limiter based on environment
 */
export function rateLimit(config: RateLimitConfig) {
  // Use in-memory implementation for development
  if (process.env.NODE_ENV === 'development') {
    return createMemoryRateLimit(config);
  }
  
  // Use Redis implementation for production
  return createRedisRateLimit(config);
} 