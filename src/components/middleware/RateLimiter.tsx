import { useEffect, useState } from 'react';

// Types for rate limiting configuration
export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the window
   */
  limit: number;
  
  /**
   * Time window in milliseconds
   */
  windowMs: number;
  
  /**
   * Message to show when rate limit is exceeded
   */
  message?: string;
  
  /**
   * Function to execute when rate limit is hit
   */
  onRateLimited?: (ip: string, resetTime: Date) => void;
  
  /**
   * Whether to skip rate limiting for certain requests
   */
  skip?: (ip: string, req: Request) => boolean;
  
  /**
   * Storage backend (default is memory)
   */
  store?: 'memory' | 'redis';
  
  /**
   * Redis configuration if using Redis store
   */
  redisConfig?: {
    url: string;
    prefix?: string;
  };
  
  /**
   * Whether to enable request headers for rate limit info
   */
  enableHeaders?: boolean;
  
  /**
   * Whether to standardize request headers naming
   */
  standardHeaders?: boolean;
  
  /**
   * Whether to add detailed X-RateLimit-* headers
   */
  legacyHeaders?: boolean;
}

// In-memory store implementation
class MemoryStore {
  private cache: Map<string, { count: number, resetTime: Date }>;
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  constructor(private windowMs: number) {
    this.cache = new Map();
    this.setupCleanupInterval();
  }
  
  private setupCleanupInterval() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      const now = new Date();
      // Convert Map entries to array before iterating to avoid MapIterator compatibility issues
      Array.from(this.cache.entries()).forEach(([key, value]) => {
        if (now > value.resetTime) {
          this.cache.delete(key);
        }
      });
    }, 60000);
  }
  
  increment(key: string): { count: number, resetTime: Date } {
    const now = new Date();
    const existingEntry = this.cache.get(key);
    
    if (existingEntry && now < existingEntry.resetTime) {
      // Increment existing entry
      existingEntry.count += 1;
      return existingEntry;
    } else {
      // Create new entry
      const resetTime = new Date(now.getTime() + this.windowMs);
      const newEntry = { count: 1, resetTime };
      this.cache.set(key, newEntry);
      return newEntry;
    }
  }
  
  get(key: string): { count: number, resetTime: Date } | null {
    const entry = this.cache.get(key);
    const now = new Date();
    
    if (entry && now < entry.resetTime) {
      return entry;
    }
    
    return null;
  }
  
  reset(key: string): void {
    this.cache.delete(key);
  }
  
  cleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.cache.clear();
  }
}

// Get client IP from request
function getClientIp(request: Request): string {
  // Try to get IP from headers
  const headers = request.headers;
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0] || '';
  const realIp = headers.get('x-real-ip') || '';
  
  // Use appropriate header or fall back to dummy IP
  return forwarded || realIp || '0.0.0.0';
}

// Singleton memory store
let memoryStore: MemoryStore | null = null;

/**
 * Creates a rate limiter middleware for Next.js API routes
 */
export function createRateLimiter(config: RateLimitConfig) {
  const {
    limit,
    windowMs,
    message = 'Too many requests, please try again later.',
    onRateLimited,
    skip = () => false,
    store = 'memory',
    enableHeaders = true,
    standardHeaders = true,
    legacyHeaders = false,
  } = config;
  
  // Initialize store if not already done
  if (store === 'memory' && !memoryStore) {
    memoryStore = new MemoryStore(windowMs);
  }
  
  // Return middleware function
  return async function rateLimit(request: Request): Promise<Response | null> {
    // Extract client IP
    const ip = getClientIp(request);
    
    // Check if we should skip rate limiting for this request
    if (skip(ip, request)) {
      return null;
    }
    
    // Use memory store for now (Redis would be implemented similarly)
    if (store === 'memory' && memoryStore) {
      // Check rate limit
      const result = memoryStore.increment(ip);
      
      // Set response headers if enabled
      const headers: HeadersInit = {};
      
      if (enableHeaders) {
        const remaining = Math.max(0, limit - result.count);
        const reset = Math.ceil(result.resetTime.getTime() / 1000);
        
        if (standardHeaders) {
          headers['RateLimit-Limit'] = limit.toString();
          headers['RateLimit-Remaining'] = remaining.toString();
          headers['RateLimit-Reset'] = reset.toString();
        }
        
        if (legacyHeaders) {
          headers['X-RateLimit-Limit'] = limit.toString();
          headers['X-RateLimit-Remaining'] = remaining.toString();
          headers['X-RateLimit-Reset'] = reset.toString();
        }
      }
      
      // Check if rate limit has been exceeded
      if (result.count > limit) {
        // Call the onRateLimited callback if provided
        if (onRateLimited) {
          onRateLimited(ip, result.resetTime);
        }
        
        // Return 429 Too Many Requests response
        headers['Retry-After'] = Math.ceil(
          (result.resetTime.getTime() - Date.now()) / 1000
        ).toString();
        
        return new Response(message, {
          status: 429,
          headers,
        });
      }
      
      // Not rate limited, add headers to the original response
      return null;
    }
    
    // If no store is configured or other error, don't apply rate limiting
    return null;
  };
}

/**
 * React component to display rate limit status
 */
export function RateLimitStatus({
  ip,
  endpoint,
  showRemaining = true,
  showReset = true,
}: {
  ip?: string;
  endpoint: string;
  showRemaining?: boolean;
  showReset?: boolean;
}) {
  const [status, setStatus] = useState<{
    limit: number;
    remaining: number;
    reset: Date;
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchRateLimitStatus() {
      try {
        const response = await fetch(`/api/rate-limit-status?endpoint=${endpoint}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch rate limit status');
        }
        
        const data = await response.json();
        
        setStatus({
          limit: Number(data.limit),
          remaining: Number(data.remaining),
          reset: new Date(data.reset * 1000),
        });
        
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    }
    
    fetchRateLimitStatus();
    
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchRateLimitStatus, 10000);
    
    return () => {
      clearInterval(interval);
    };
  }, [endpoint]);
  
  if (loading) {
    return <div className="text-sm text-gray-500">Loading rate limit status...</div>;
  }
  
  if (error) {
    return <div className="text-sm text-red-500">Error: {error}</div>;
  }
  
  if (!status) {
    return <div className="text-sm text-gray-500">No rate limit information available</div>;
  }
  
  const resetIn = Math.max(0, Math.ceil((status.reset.getTime() - Date.now()) / 1000));
  
  return (
    <div className="text-sm space-y-1">
      <div className="font-medium">API Rate Limits</div>
      <div className="flex flex-col gap-1">
        <div>Limit: {status.limit} requests per window</div>
        {showRemaining && (
          <div className={status.remaining < 10 ? 'text-amber-600' : ''}>
            Remaining: {status.remaining} requests
          </div>
        )}
        {showReset && (
          <div>
            Reset in: {resetIn > 60 
              ? `${Math.floor(resetIn / 60)}m ${resetIn % 60}s` 
              : `${resetIn}s`}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Usage:
 * 
 * // In middleware.ts
 * import { NextResponse, NextRequest } from 'next/server';
 * import { createRateLimiter } from '@/components/middleware/RateLimiter';
 * 
 * const apiLimiter = createRateLimiter({
 *   limit: 100,
 *   windowMs: 15 * 60 * 1000, // 15 minutes
 *   message: 'Too many requests from this IP, please try again after 15 minutes',
 * });
 * 
 * export async function middleware(request: NextRequest) {
 *   // Apply rate limiting only to API routes
 *   if (request.nextUrl.pathname.startsWith('/api/')) {
 *     const response = await apiLimiter(request);
 *     
 *     if (response) {
 *       return response;
 *     }
 *   }
 *   
 *   return NextResponse.next();
 * }
 * 
 * export const config = {
 *   matcher: '/api/:path*',
 * };
 * 
 * // To use the status component in a dashboard
 * import { RateLimitStatus } from '@/components/middleware/RateLimiter';
 * 
 * export default function ApiDashboard() {
 *   return (
 *     <div>
 *       <h1>API Dashboard</h1>
 *       <RateLimitStatus endpoint="/api/data" />
 *     </div>
 *   );
 * }
 */ 