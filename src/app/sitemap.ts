import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

// Cache this function to avoid repeated database queries
// Uses Next.js cache mechanism to store the result
export async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://reefq.vercel.app';
  
  // Define static routes with their update frequency and priority
  const staticRoutes: SitemapEntry[] = [
    {
      url: '/',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: '/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: '/products',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: '/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // TODO: Fetch dynamic routes from database
  // This is a placeholder for dynamic route generation
  // In a real implementation, you would fetch products, blog posts, etc.
  const dynamicRoutes: SitemapEntry[] = [
    // Example of how you would add dynamic product pages
    /*
    // Using database:
    // Get all published products from database
    const products = await db.product.findMany({
      where: { status: 'published' },
      select: { id: true, slug: true, updatedAt: true }
    });
    
    // Map products to sitemap entries
    const productRoutes = products.map(product => ({
      url: `/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
    */
  ];

  // Combine static and dynamic routes
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  // Format all entries according to the Next.js sitemap format
  return allRoutes.map(route => ({
    url: `${baseUrl}${route.url}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return generateSitemap();
} 