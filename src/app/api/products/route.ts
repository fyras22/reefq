import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Product from '@/models/Product';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { cacheableResponse } from '@/lib/cache/CacheableResponse';

// Zod schema for validating product creation/updates
const productSchema = z.object({
  name: z.string().min(3).max(100),
  slug: z.string().min(3).max(100).optional(),
  description: z.string().min(10),
  shortDescription: z.string().min(5).max(200),
  sku: z.string().min(3).max(50),
  price: z.number().positive(),
  salePrice: z.number().positive().optional().nullable(),
  costPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().nonnegative(),
  lowStockThreshold: z.number().int().positive().optional(),
  categories: z.array(z.string()).min(1),
  type: z.enum(['ring', 'bracelet', 'necklace', 'earring', 'pendant', 'other']),
  materials: z.array(
    z.object({
      name: z.string().min(1),
      color: z.string().optional(),
      quality: z.string().optional(),
      weight: z.number().positive().optional(),
      unit: z.string().optional()
    })
  ),
  tags: z.array(z.string()).optional(),
  variants: z.array(
    z.object({
      name: z.string().min(1),
      sku: z.string().min(3),
      price: z.number().positive(),
      salePrice: z.number().positive().optional().nullable(),
      stock: z.number().int().nonnegative(),
      size: z.string().optional(),
      color: z.string().optional(),
      materials: z.array(
        z.object({
          name: z.string().min(1),
          color: z.string().optional(),
          quality: z.string().optional(),
          weight: z.number().positive().optional(),
          unit: z.string().optional()
        })
      ).optional(),
      images: z.array(
        z.object({
          url: z.string().url(),
          alt: z.string().min(1),
          isPrimary: z.boolean().optional()
        })
      ).optional(),
      models: z.array(
        z.object({
          url: z.string().url(),
          type: z.enum(['3d', 'ar']),
          thumbnail: z.string().url().optional()
        })
      ).optional()
    })
  ).optional(),
  images: z.array(
    z.object({
      url: z.string().url(),
      alt: z.string().min(1),
      isPrimary: z.boolean().optional()
    })
  ),
  models: z.array(
    z.object({
      url: z.string().url(),
      type: z.enum(['3d', 'ar']),
      thumbnail: z.string().url().optional()
    })
  ).optional(),
  featured: z.boolean().optional(),
  new: z.boolean().optional(),
  bestseller: z.boolean().optional(),
  hasAR: z.boolean().optional(),
  has3D: z.boolean().optional(),
  dimensions: z.object({
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
    depth: z.number().positive().optional(),
    unit: z.string().default('mm')
  }).optional(),
  publishedAt: z.date().optional()
});

// Type for a product
type ProductType = z.infer<typeof productSchema>;

// Sample products data for demonstration purposes
// In a real app, this would come from a database
const sampleProducts = [
  {
    name: 'Diamond Engagement Ring',
    sku: 'RING-001',
    description: 'Beautiful 1.5 carat diamond ring set in 18k white gold.',
    price: 5999.99,
    stock: 10,
    images: [
      { url: '/images/products/ring-1-main.jpg', alt: 'Diamond Ring Front View', isPrimary: true },
      { url: '/images/products/ring-1-alt.jpg', alt: 'Diamond Ring Side View' },
    ],
    categories: ['rings', 'engagement', 'diamond'],
    variants: [
      {
        name: 'Size 6',
        sku: 'RING-001-06',
        price: 5999.99,
        stock: 3,
        materials: [{ name: 'White Gold', color: 'silver', quality: '18k' }],
        size: '6',
      },
      {
        name: 'Size 7',
        sku: 'RING-001-07',
        price: 5999.99,
        stock: 5,
        materials: [{ name: 'White Gold', color: 'silver', quality: '18k' }],
        size: '7',
      },
      {
        name: 'Rose Gold Option',
        sku: 'RING-001-RG',
        price: 6299.99,
        stock: 2,
        materials: [{ name: 'Rose Gold', color: 'rose', quality: '18k' }],
        size: '6',
      },
    ],
    featured: true,
    bestseller: true,
    new: false,
    hasAR: true,
    has3D: true,
    rating: 4.8,
    reviewCount: 124,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2023-05-20T14:30:00Z',
  },
  {
    name: 'Sapphire Pendant Necklace',
    sku: 'NECK-001',
    description: 'Elegant sapphire pendant with diamond accents on a 14k gold chain.',
    price: 2499.99,
    stock: 15,
    images: [
      { url: '/images/products/necklace-1-main.jpg', alt: 'Sapphire Necklace Front', isPrimary: true },
      { url: '/images/products/necklace-1-alt.jpg', alt: 'Sapphire Necklace Worn' },
    ],
    categories: ['necklaces', 'pendants', 'sapphire'],
    variants: [
      {
        name: '16 inch chain',
        sku: 'NECK-001-16',
        price: 2499.99,
        stock: 5,
        materials: [{ name: 'Yellow Gold', color: 'gold', quality: '14k' }],
        size: '16"',
      },
      {
        name: '18 inch chain',
        sku: 'NECK-001-18',
        price: 2499.99,
        stock: 8,
        materials: [{ name: 'Yellow Gold', color: 'gold', quality: '14k' }],
        size: '18"',
      },
      {
        name: 'White Gold Option',
        sku: 'NECK-001-WG',
        price: 2599.99,
        stock: 2,
        materials: [{ name: 'White Gold', color: 'silver', quality: '14k' }],
        size: '18"',
      },
    ],
    featured: false,
    bestseller: true,
    new: false,
    hasAR: true,
    has3D: false,
    rating: 4.6,
    reviewCount: 87,
    createdAt: '2023-02-10T09:15:00Z',
    updatedAt: '2023-06-05T11:45:00Z',
  },
  {
    name: 'Pearl Stud Earrings',
    sku: 'EAR-001',
    description: 'Classic freshwater pearl studs with 14k gold posts.',
    price: 799.99,
    stock: 25,
    images: [
      { url: '/images/products/earrings-1-main.jpg', alt: 'Pearl Earrings', isPrimary: true },
      { url: '/images/products/earrings-1-alt.jpg', alt: 'Pearl Earrings Worn' },
    ],
    categories: ['earrings', 'studs', 'pearl'],
    featured: false,
    bestseller: true,
    new: false,
    hasAR: false,
    has3D: false,
    rating: 4.9,
    reviewCount: 203,
    createdAt: '2022-11-20T10:30:00Z',
    updatedAt: '2023-04-12T16:20:00Z',
  },
];

// Request schema for query parameters
const getProductsQuerySchema = z.object({
  category: z.string().optional(),
  featured: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
  bestseller: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
  new: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
  hasAR: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
  has3D: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
  inStock: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'rating']).optional(),
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
  search: z.string().optional(),
});

// Helper function to filter and sort products
function filterAndSortProducts(
  allProducts: any[],
  filters: ReturnType<typeof getProductsQuerySchema.parse>
): any[] {
  // First filter products
  let filtered = [...allProducts];
  
  if (filters.category) {
    filtered = filtered.filter(p => p.categories.includes(filters.category));
  }
  
  if (filters.featured !== undefined) {
    filtered = filtered.filter(p => p.featured === filters.featured);
  }
  
  if (filters.bestseller !== undefined) {
    filtered = filtered.filter(p => p.bestseller === filters.bestseller);
  }
  
  if (filters.new !== undefined) {
    filtered = filtered.filter(p => p.new === filters.new);
  }
  
  if (filters.hasAR !== undefined) {
    filtered = filtered.filter(p => p.hasAR === filters.hasAR);
  }
  
  if (filters.has3D !== undefined) {
    filtered = filtered.filter(p => p.has3D === filters.has3D);
  }
  
  if (filters.inStock !== undefined) {
    filtered = filtered.filter(p => p.stock > 0 === filters.inStock);
  }
  
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= filters.minPrice!);
  }
  
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice!);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.description.toLowerCase().includes(searchLower) ||
      p.categories.some((c: string) => c.toLowerCase().includes(searchLower))
    );
  }
  
  // Then sort products
  if (filters.sort) {
    switch (filters.sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
  }
  
  // Finally, apply pagination
  if (filters.offset !== undefined || filters.limit !== undefined) {
    const offset = filters.offset || 0;
    const limit = filters.limit || filtered.length;
    filtered = filtered.slice(offset, offset + limit);
  }
  
  return filtered;
}

/**
 * GET /api/products
 * Retrieve a list of products with filtering, sorting, and pagination
 */
export async function GET(request: NextRequest) {
  // Use the cacheableResponse helper for automatic caching
  return cacheableResponse(
    request,
    async () => {
      // In a production app, we would fetch from the database
      // For demonstration, we're using the sample data with simulated latency
      
      // Get query parameters
      const searchParams = request.nextUrl.searchParams;
      
      try {
        // Parse and validate query parameters
        const filters = getProductsQuerySchema.parse(Object.fromEntries(searchParams.entries()));
        
        // Apply filters and sorting (simulate database query with delay)
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate DB latency
        const filteredProducts = filterAndSortProducts(sampleProducts, filters);
        
        // Return formatted response
        return {
          products: filteredProducts,
          meta: {
            total: sampleProducts.length,
            filtered: filteredProducts.length,
            offset: filters.offset || 0,
            limit: filters.limit || sampleProducts.length,
          }
        };
      } catch (error) {
        console.error('Error processing products request:', error);
        throw new Error('Invalid request parameters');
      }
    },
    {
      // Cache for 5 minutes
      ttl: 300,
      
      // Allow serving stale data for up to 1 hour while revalidating
      staleWhileRevalidate: 3600,
      
      // Tag for cache invalidation
      tags: ['products'],
      
      // Only vary cache by these query parameters
      queryParams: ['category', 'featured', 'bestseller', 'new', 'hasAR', 'has3D', 'inStock', 'minPrice', 'maxPrice', 'sort', 'limit', 'offset', 'search'],
      
      // Include cache info in response headers in non-production environments
      includeCacheMetadata: process.env.NODE_ENV !== 'production',
    }
  );
}

// POST - Create a new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    // In a real app, we would validate auth, then save to a database
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // For demonstration, return a success response
        return NextResponse.json(
      { success: true, message: 'Product created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 