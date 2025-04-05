/**
 * Advanced server-side caching system for Next.js
 * Supports in-memory and Redis backends with TTL and stale-while-revalidate
 */

// Cache entry with metadata
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  staleAt: number;
  tags: string[];
  createdAt: number;
  lastAccessed: number;
  accessCount: number;
}

// Cache options
export interface CacheOptions {
  /**
   * Time to live in seconds
   * @default 300 (5 minutes)
   */
  ttl?: number;
  
  /**
   * Stale while revalidate period in seconds
   * @default 600 (10 minutes)
   */
  staleWhileRevalidate?: number;
  
  /**
   * Tags for cache invalidation
   */
  tags?: string[];
  
  /**
   * Storage backend
   * @default 'memory'
   */
  storage?: 'memory' | 'redis';
  
  /**
   * Maximum size of in-memory cache (items)
   * @default 1000
   */
  maxSize?: number;
  
  /**
   * LRU eviction policy
   * @default true
   */
  lru?: boolean;
  
  /**
   * Redis connection string (required if storage is 'redis')
   */
  redisUrl?: string;
  
  /**
   * Redis database index
   * @default 0
   */
  redisDb?: number;
  
  /**
   * Key prefix for Redis
   * @default 'next-cache:'
   */
  keyPrefix?: string;
  
  /**
   * Whether to compress values
   * @default true
   */
  compress?: boolean;
  
  /**
   * Logging
   */
  logging?: boolean | 'verbose';
}

// Global cache instance
let globalCache: ServerCache | null = null;

/**
 * Server-side cache implementation
 */
export class ServerCache {
  private storage: Map<string, CacheEntry<any>>;
  private options: Required<Omit<CacheOptions, 'redisUrl'>>;
  private redis: any | null = null;
  private hits = 0;
  private misses = 0;
  private evictions = 0;
  private revalidations = 0;
  
  /**
   * Get the singleton cache instance
   */
  static getInstance(options: CacheOptions = {}): ServerCache {
    if (!globalCache) {
      globalCache = new ServerCache(options);
    }
    return globalCache;
  }
  
  /**
   * Create a new cache instance
   */
  constructor(options: CacheOptions = {}) {
    this.storage = new Map();
    
    // Set default options
    this.options = {
      ttl: options.ttl ?? 300,
      staleWhileRevalidate: options.staleWhileRevalidate ?? 600,
      tags: options.tags ?? [],
      storage: options.storage ?? 'memory',
      maxSize: options.maxSize ?? 1000,
      lru: options.lru ?? true,
      redisDb: options.redisDb ?? 0,
      keyPrefix: options.keyPrefix ?? 'next-cache:',
      compress: options.compress ?? true,
      logging: options.logging ?? false,
    };
    
    // Setup Redis if configured
    if (this.options.storage === 'redis' && options.redisUrl) {
      this.setupRedis(options.redisUrl);
    }
    
    // Setup cleanup interval
    setInterval(() => this.cleanup(), 60000); // Run cleanup every minute
    
    this.log('Cache initialized with options:', this.options);
  }
  
  /**
   * Setup Redis connection
   */
  private async setupRedis(redisUrl: string) {
    try {
      // Dynamically import Redis to avoid server/client mismatch
      // This import is optional and will be skipped if redis is not installed
      const redis = await import('redis').catch(() => null);
      
      if (!redis) {
        console.error('Redis package is not installed');
        this.log('Falling back to in-memory storage');
        this.options.storage = 'memory';
        return;
      }
      
      this.redis = redis.createClient({
        url: redisUrl,
        database: this.options.redisDb,
      });
      
      await this.redis.connect();
      this.log('Connected to Redis');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      this.log('Falling back to in-memory storage');
      this.options.storage = 'memory';
    }
  }
  
  /**
   * Get a value from the cache
   */
  async get<T>(key: string): Promise<T | null> {
    const now = Date.now();
    
    if (this.options.storage === 'redis' && this.redis) {
      try {
        const fullKey = this.options.keyPrefix + key;
        const rawData = await this.redis.get(fullKey);
        
        if (!rawData) {
          this.misses++;
          this.log(`Cache miss: ${key}`);
          return null;
        }
        
        const data = JSON.parse(rawData) as CacheEntry<T>;
        
        // Update stats
        this.redis.hIncrBy('cache:stats', 'hits', 1);
        this.redis.hSet('cache:access', fullKey, now);
        
        // Check if expired
        if (now > data.expiresAt) {
          this.revalidations++;
          this.log(`Cache stale: ${key}`);
          
          // If beyond stale period, return null
          if (now > data.staleAt) {
            this.log(`Cache expired: ${key}`);
            return null;
          }
          
          // Return stale data
          return data.value;
        }
        
        this.hits++;
        this.log(`Cache hit: ${key}`);
        return data.value;
      } catch (error) {
        console.error('Redis cache error:', error);
        // Fall back to memory cache
      }
    }
    
    // In-memory cache logic
    if (this.storage.has(key)) {
      const entry = this.storage.get(key)!;
      
      // Update stats
      entry.lastAccessed = now;
      entry.accessCount++;
      
      // Check if expired
      if (now > entry.expiresAt) {
        this.revalidations++;
        this.log(`Cache stale: ${key}`);
        
        // If beyond stale period, delete and return null
        if (now > entry.staleAt) {
          this.log(`Cache expired: ${key}`);
          this.storage.delete(key);
          this.misses++;
          return null;
        }
        
        // Return stale data
        return entry.value;
      }
      
      this.hits++;
      this.log(`Cache hit: ${key}`);
      return entry.value;
    }
    
    this.misses++;
    this.log(`Cache miss: ${key}`);
    return null;
  }
  
  /**
   * Store a value in the cache
   */
  async set<T>(key: string, value: T, options?: Partial<CacheOptions>): Promise<void> {
    const now = Date.now();
    const ttl = options?.ttl ?? this.options.ttl;
    const swr = options?.staleWhileRevalidate ?? this.options.staleWhileRevalidate;
    const tags = [...(this.options.tags || []), ...(options?.tags || [])];
    
    const entry: CacheEntry<T> = {
      value,
      expiresAt: now + ttl * 1000,
      staleAt: now + (ttl + swr) * 1000,
      tags,
      createdAt: now,
      lastAccessed: now,
      accessCount: 0,
    };
    
    if (this.options.storage === 'redis' && this.redis) {
      try {
        const fullKey = this.options.keyPrefix + key;
        await this.redis.set(fullKey, JSON.stringify(entry), { EX: ttl + swr });
        
        // Store tag information
        for (const tag of tags) {
          await this.redis.sAdd(`cache:tags:${tag}`, fullKey);
        }
        
        this.log(`Cache set: ${key}`);
        return;
      } catch (error) {
        console.error('Redis cache error:', error);
        // Fall back to memory cache
      }
    }
    
    // In-memory cache logic
    this.storage.set(key, entry);
    this.log(`Cache set: ${key}`);
    
    // Enforce max size with LRU eviction
    if (this.options.lru && this.storage.size > this.options.maxSize) {
      this.evictLRU();
    }
  }
  
  /**
   * Remove a value from the cache
   */
  async delete(key: string): Promise<boolean> {
    if (this.options.storage === 'redis' && this.redis) {
      try {
        const fullKey = this.options.keyPrefix + key;
        const result = await this.redis.del(fullKey);
        this.log(`Cache delete: ${key}`);
        return result > 0;
      } catch (error) {
        console.error('Redis cache error:', error);
      }
    }
    
    // In-memory cache logic
    const result = this.storage.delete(key);
    this.log(`Cache delete: ${key}`);
    return result;
  }
  
  /**
   * Clear the entire cache
   */
  async clear(): Promise<void> {
    if (this.options.storage === 'redis' && this.redis) {
      try {
        // Delete all keys with the prefix
        const keys = await this.redis.keys(`${this.options.keyPrefix}*`);
        if (keys.length > 0) {
          await this.redis.del(keys);
        }
        this.log(`Cache cleared: ${keys.length} keys`);
        return;
      } catch (error) {
        console.error('Redis cache error:', error);
      }
    }
    
    // In-memory cache logic
    const size = this.storage.size;
    this.storage.clear();
    this.log(`Cache cleared: ${size} keys`);
  }
  
  /**
   * Invalidate cache entries by tag
   */
  async invalidateByTag(tag: string): Promise<number> {
    if (this.options.storage === 'redis' && this.redis) {
      try {
        // Get all keys with the tag
        const keys = await this.redis.sMembers(`cache:tags:${tag}`);
        if (keys.length > 0) {
          await this.redis.del(keys);
          await this.redis.del(`cache:tags:${tag}`);
        }
        this.log(`Cache invalidated by tag '${tag}': ${keys.length} keys`);
        return keys.length;
      } catch (error) {
        console.error('Redis cache error:', error);
      }
    }
    
    // In-memory cache logic
    let count = 0;
    
    // Convert Map entries to array before iterating
    Array.from(this.storage.entries()).forEach(([key, entry]) => {
      if (entry.tags.includes(tag)) {
        this.storage.delete(key);
        count++;
      }
    });
    
    this.log(`Cache invalidated by tag '${tag}': ${count} keys`);
    return count;
  }
  
  /**
   * Cache a function call
   */
  async wrap<T>(
    key: string,
    fn: () => Promise<T>,
    options?: Partial<CacheOptions>
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }
    
    // Execute the function
    const result = await fn();
    
    // Store in cache
    await this.set(key, result, options);
    
    return result;
  }
  
  /**
   * Evict least recently used items
   */
  private evictLRU(): void {
    if (this.storage.size <= this.options.maxSize) {
      return;
    }
    
    // Find the least recently accessed entry
    let lruKey: string | null = null;
    let lruTime = Infinity;
    
    // Convert Map entries to array before iterating
    Array.from(this.storage.entries()).forEach(([key, entry]) => {
      if (entry.lastAccessed < lruTime) {
        lruKey = key;
        lruTime = entry.lastAccessed;
      }
    });
    
    if (lruKey) {
      this.storage.delete(lruKey);
      this.evictions++;
      this.log(`Cache evicted (LRU): ${lruKey}`);
    }
  }
  
  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let count = 0;
    
    // Only clean in-memory cache, Redis handles TTL automatically
    if (this.options.storage === 'memory') {
      // Convert Map entries to array before iterating
      Array.from(this.storage.entries()).forEach(([key, entry]) => {
        if (now > entry.staleAt) {
          this.storage.delete(key);
          count++;
        }
      });
      
      if (count > 0) {
        this.log(`Cache cleanup: ${count} expired items removed`);
      }
    }
  }
  
  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.storage.size,
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      revalidations: this.revalidations,
      hitRate: this.hits + this.misses === 0 ? 0 : this.hits / (this.hits + this.misses),
    };
  }
  
  /**
   * Log a message if logging is enabled
   */
  private log(message: string, ...args: any[]): void {
    if (!this.options.logging) return;
    
    if (this.options.logging === 'verbose' || args.length > 0) {
      console.log(`[ServerCache] ${message}`, ...args);
    } else {
      console.log(`[ServerCache] ${message}`);
    }
  }
}

/**
 * Helper function to get the cache instance
 */
export function getCache(options?: CacheOptions): ServerCache {
  return ServerCache.getInstance(options);
}

/**
 * Wrap a function with caching
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  options?: CacheOptions
): Promise<T> {
  const cache = getCache(options);
  return cache.wrap(key, fn, options);
}

/**
 * Example usage:
 * 
 * // In a server component or API route
 * async function getData(userId: string) {
 *   return withCache(
 *     `user:${userId}:data`,
 *     async () => {
 *       // Expensive operation (database query, API call, etc.)
 *       const data = await db.users.findOne({ _id: userId });
 *       return data;
 *     },
 *     {
 *       ttl: 300, // 5 minutes
 *       tags: ['user', `user:${userId}`],
 *     }
 *   );
 * }
 * 
 * // To invalidate by tag when data changes
 * async function updateUser(userId: string, data: any) {
 *   await db.users.updateOne({ _id: userId }, { $set: data });
 *   const cache = getCache();
 *   await cache.invalidateByTag(`user:${userId}`);
 * }
 */ 