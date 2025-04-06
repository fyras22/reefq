import { connectDB } from './mongodb';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';

/**
 * Default pagination values
 */
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

/**
 * Pagination parameters interface
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

/**
 * Safely parse pagination parameters
 */
export function parsePaginationParams(params: any): PaginationParams {
  const page = Math.max(1, Number(params?.page) || 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(params?.pageSize) || DEFAULT_PAGE_SIZE)
  );
  
  return {
    page,
    pageSize,
    sortBy: params?.sortBy || 'createdAt',
    sortOrder: (params?.sortOrder === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc',
  };
}

/**
 * Type-safe cached database query function for server components
 * Uses Next.js's unstable_cache with revalidation tags
 */
export function createCachedQuery<
  TParams extends Record<string, any>,
  TResult
>(
  queryFn: (params: TParams) => Promise<TResult>,
  options: {
    tags: string[];
    revalidate?: number;
  }
) {
  return async (params: TParams): Promise<TResult> => {
    // Create a deterministic cache key
    const cacheKey = [
      'db-query',
      ...options.tags,
      ...Object.entries(params).map(([key, value]) => `${key}:${JSON.stringify(value)}`),
    ];
    
    // Use unstable_cache with the pre-computed cache key
    const cachedFn = unstable_cache(
      async () => {
        await connectDB();
        return queryFn(params);
      },
      cacheKey,
      {
        revalidate: options.revalidate,
        tags: options.tags,
      }
    );
    
    return cachedFn();
  };
}

/**
 * Create a React cache for database queries
 * This is useful for deduplicating requests within a single render pass
 */
export function createReactQueryCache<
  TParams extends Record<string, any>,
  TResult
>(queryFn: (params: TParams) => Promise<TResult>) {
  return cache(async (params: TParams) => {
    await connectDB();
    return queryFn(params);
  });
}

/**
 * Safely serialize MongoDB documents
 * Converts _id to string and handles Date objects
 */
export function serializeDocument<T>(doc: any): T {
  if (!doc) return null as unknown as T;
  
  const serialized = JSON.parse(
    JSON.stringify(
      doc,
      (key, value) => {
        // Handle Date objects
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      }
    )
  );
  
  return serialized;
}

/**
 * Creates a bounded query to prevent excessive data loading
 * Always applies limits and skips based on pagination
 */
export function createBoundedQuery<T>(
  model: any,
  queryBuilder: (query: any) => any,
  pagination: PaginationParams
) {
  const { page, pageSize, sortBy, sortOrder } = pagination;
  const skip = (page - 1) * pageSize;
  
  // Create a base query with a reasonable limit
  const baseQuery = queryBuilder(model.find())
    .limit(pageSize)
    .skip(skip)
    .sort({ [sortBy as string]: sortOrder === 'asc' ? 1 : -1 });
  
  return {
    /**
     * Execute the query and return documents
     */
    async exec(): Promise<T[]> {
      await connectDB();
      const documents = await baseQuery.lean().exec();
      return serializeDocument<T[]>(documents);
    },
    
    /**
     * Get count of total matching documents for pagination
     */
    async count(): Promise<number> {
      await connectDB();
      // Use the same conditions but without pagination
      const countQuery = queryBuilder(model.find());
      return countQuery.countDocuments();
    },
    
    /**
     * Execute query and return paginated result with metadata
     */
    async paginate(): Promise<{
      data: T[];
      pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }> {
      const [data, totalItems] = await Promise.all([
        this.exec(),
        this.count(),
      ]);
      
      const totalPages = Math.ceil(totalItems / pageSize);
      
      return {
        data,
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    },
  };
} 