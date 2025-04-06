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

/**
 * Rate limiting implementation based on LRU cache
 */
export function rateLimit(options: RateLimitOptions = {}) {
  const {
    limit = 10,
    interval = 60 * 1000, // 1 minute in milliseconds
    uniqueTokenPerInterval = 500, // Max unique tokens per interval
  } = options;

  // Create LRU cache to store rate limit information
  const tokenCache = new LRUCache<string, number[]>({
    max: uniqueTokenPerInterval,
    ttl: interval,
  });

  return {
    /**
     * Check if a request exceeds the rate limit
     * @param maxRequests Maximum number of requests allowed
     * @param token Unique identifier for the client (e.g., IP address, API key)
     * @returns Promise that resolves if within limits, rejects if exceeded
     */
    check: (maxRequests: number = limit, token: string): Promise<void> => {
      // Get current timestamp
      const now = Date.now();
      
      // Get existing timestamps for this token
      const timestamps = tokenCache.get(token) || [];
      
      // Filter out timestamps outside the current interval window
      const windowStart = now - interval;
      const validTimestamps = timestamps.filter(timestamp => timestamp > windowStart);
      
      // Check if the number of requests exceeds the limit
      if (validTimestamps.length >= maxRequests) {
        throw new Error('Rate limit exceeded');
      }
      
      // Add current timestamp and update cache
      validTimestamps.push(now);
      tokenCache.set(token, validTimestamps);
      
      return Promise.resolve();
    },
    
    /**
     * Get current rate limit status
     * @param token Unique identifier for the client
     * @returns Object containing rate limit information
     */
    getStatus: (token: string, maxRequests: number = limit) => {
      const now = Date.now();
      const timestamps = tokenCache.get(token) || [];
      const windowStart = now - interval;
      const validTimestamps = timestamps.filter(timestamp => timestamp > windowStart);
      
      return {
        limit: maxRequests,
        current: validTimestamps.length,
        remaining: Math.max(0, maxRequests - validTimestamps.length),
        reset: new Date(windowStart + interval),
        success: validTimestamps.length < maxRequests,
      };
    },
  };
} 