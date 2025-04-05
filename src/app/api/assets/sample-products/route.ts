import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_PRODUCT_ASSETS, PRODUCT_CATEGORIES, MATERIALS } from '@/lib/assets/MediaAssets';
import { cacheableResponse } from '@/lib/cache/CacheableResponse';

/**
 * API endpoint to fetch sample products with various filtering options
 * Used for development and demonstration purposes
 */
export async function GET(request: NextRequest) {
  return cacheableResponse(
    request,
    async () => {
      const searchParams = request.nextUrl.searchParams;
      
      // Parse filter parameters
      const category = searchParams.get('category');
      const materialType = searchParams.get('material');
      const hasAR = searchParams.get('hasAR') === 'true';
      const has3D = searchParams.get('has3D') === 'true';
      const limit = parseInt(searchParams.get('limit') || '10');
      const offset = parseInt(searchParams.get('offset') || '0');
      
      // Filter products based on query parameters
      let filteredProducts = [...SAMPLE_PRODUCT_ASSETS];
      
      if (category) {
        filteredProducts = filteredProducts.filter(
          product => product.category === category
        );
      }
      
      if (hasAR) {
        filteredProducts = filteredProducts.filter(
          product => product.hasAR === true
        );
      }
      
      if (has3D) {
        filteredProducts = filteredProducts.filter(
          product => product.has3D === true
        );
      }
      
      // Get total count before pagination
      const total = filteredProducts.length;
      
      // Apply pagination
      filteredProducts = filteredProducts.slice(offset, offset + limit);
      
      // Transform the products to include additional metadata
      const products = filteredProducts.map(product => {
        // Convert the variant record to an array for easier client-side handling
        const variants = Object.entries(product.variants).map(([id, data]) => ({
          id,
          name: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          ...data,
        }));
        
        return {
          id: product.id,
          name: product.name,
          category: product.category,
          description: getProductDescription(product.id, product.category),
          price: getProductPrice(product.id),
          images: product.images,
          models: product.models,
          variants,
          hasAR: product.hasAR,
          has3D: product.has3D,
          rating: getRating(product.id),
          reviewCount: getReviewCount(product.id),
          metadata: {
            materials: getProductMaterials(product.id),
            dimensions: getProductDimensions(product.id),
            weight: getProductWeight(product.id),
          },
        };
      });
      
      return {
        products,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      };
    },
    {
      // Cache these sample products for 1 hour
      ttl: 3600,
      
      // Tag for cache invalidation
      tags: ['sample-products'],
      
      // Include cache info in response headers in development
      includeCacheMetadata: process.env.NODE_ENV === 'development',
    }
  );
}

/**
 * Generate a realistic product description
 */
function getProductDescription(productId: string, category: string): string {
  const descriptions: Record<string, string> = {
    'ring-diamond-solitaire': 'Exquisite solitaire ring featuring a brilliant-cut diamond set in premium gold. Perfect as an engagement ring or a special occasion statement piece. The timeless design ensures this ring will be cherished for generations.',
    'necklace-sapphire-pendant': 'Stunning sapphire pendant necklace with a halo of diamonds, suspended from a delicate chain. The vibrant blue sapphire catches the light beautifully, creating a captivating sparkle that draws attention.',
    'earrings-diamond-studs': 'Classic diamond stud earrings that add a touch of elegance to any outfit. These perfectly matched diamonds are securely set in a four-prong setting, allowing maximum light reflection and brilliance.',
  };
  
  // Return matching description or generate a generic one based on category
  return descriptions[productId] || `Beautiful ${category.slice(0, -1)} crafted with exceptional attention to detail. Features premium materials and expert craftsmanship.`;
}

/**
 * Generate realistic prices for products
 */
function getProductPrice(productId: string): number {
  const prices: Record<string, number> = {
    'ring-diamond-solitaire': 3499.99,
    'necklace-sapphire-pendant': 1299.99,
    'earrings-diamond-studs': 999.99,
  };
  
  return prices[productId] || 799.99;
}

/**
 * Generate realistic product materials
 */
function getProductMaterials(productId: string): string[] {
  const materialMap: Record<string, string[]> = {
    'ring-diamond-solitaire': ['18K Gold', 'Diamond', 'Platinum Prongs'],
    'necklace-sapphire-pendant': ['14K Gold', 'Sapphire', 'Diamonds'],
    'earrings-diamond-studs': ['14K White Gold', 'Diamonds'],
  };
  
  return materialMap[productId] || ['14K Gold', 'Gemstones'];
}

/**
 * Generate realistic product dimensions
 */
function getProductDimensions(productId: string): string {
  const dimensionMap: Record<string, string> = {
    'ring-diamond-solitaire': 'Band: 2mm width, Diamond: 0.75 carat (6mm)',
    'necklace-sapphire-pendant': 'Chain: 18 inches, Pendant: 12mm x 8mm',
    'earrings-diamond-studs': 'Diameter: 5mm (0.5 carat each)',
  };
  
  return dimensionMap[productId] || 'Various sizes available';
}

/**
 * Generate realistic product weight
 */
function getProductWeight(productId: string): string {
  const weightMap: Record<string, string> = {
    'ring-diamond-solitaire': '4.2g',
    'necklace-sapphire-pendant': '3.8g',
    'earrings-diamond-studs': '2.4g (pair)',
  };
  
  return weightMap[productId] || '3-5g depending on size';
}

/**
 * Generate a realistic rating
 */
function getRating(productId: string): number {
  const ratingMap: Record<string, number> = {
    'ring-diamond-solitaire': 4.8,
    'necklace-sapphire-pendant': 4.7,
    'earrings-diamond-studs': 4.9,
  };
  
  return ratingMap[productId] || 4.5 + Math.random() * 0.5;
}

/**
 * Generate a realistic review count
 */
function getReviewCount(productId: string): number {
  const reviewMap: Record<string, number> = {
    'ring-diamond-solitaire': 128,
    'necklace-sapphire-pendant': 87,
    'earrings-diamond-studs': 204,
  };
  
  return reviewMap[productId] || Math.floor(30 + Math.random() * 100);
} 