import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://reefq.vercel.app';
  const environment = process.env.NODE_ENV || 'development';
  
  // Determine if we should allow all indexing
  // In non-production environments, we restrict crawling
  const isProduction = environment === 'production';
  const allowFullIndexing = isProduction;
  
  // Common patterns to disallow for all user agents
  const commonDisallow = [
    '/api/', 
    '/auth/',
    '/dashboard/admin/',
    '/debug/',
    '/*.json$',  // Block JSON files 
    '/test/',
    '/tests/',
    '/tmp/',
    '/*/404', // Block 404 pages from all language paths
    '/*/*/404', // Block deeper 404 pages
    '/private/',
  ];
  
  // Additional paths to disallow only for non-production environments
  const nonProductionDisallow = [
    '/', // Block everything in non-production
  ];
  
  // Generate the robots.txt content
  const robotsTxt = `
# robots.txt file for ReefQ
# ${baseUrl}
# Environment: ${environment}
# Generated: ${new Date().toISOString()}

# Standard bot rules
User-agent: *
${allowFullIndexing ? 'Allow: /' : ''}
${commonDisallow.map(path => `Disallow: ${path}`).join('\n')}
${!allowFullIndexing ? nonProductionDisallow.map(path => `Disallow: ${path}`).join('\n') : ''}

# Googlebot-specific rules (Google Search)
User-agent: Googlebot
Allow: /
${commonDisallow.map(path => `Disallow: ${path}`).join('\n')}

# Googlebot-Image specific rules
User-agent: Googlebot-Image
Allow: /images/
Allow: /public/images/
Allow: /jewelry/*/
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.png$
Allow: /*.webp$
Allow: /*.avif$
Allow: /*.svg$
Disallow: /dashboard/
Disallow: /auth/

# Media bots
User-agent: Twitterbot
Allow: /
Allow: /public/images/
Disallow: /api/

# Bing
User-agent: Bingbot
Allow: /
${commonDisallow.map(path => `Disallow: ${path}`).join('\n')}

# Facebook
User-agent: Facebot
Allow: /
Allow: /public/images/
Disallow: /api/

# Rate limiting for aggressive bots
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10

User-agent: DotBot
Disallow: /

User-agent: Sogou web spider
Disallow: /

# Block archive.org in non-production environments
${!allowFullIndexing ? 'User-agent: ia_archiver\nDisallow: /' : ''}

# Block all bots from preview/staging environments
${!allowFullIndexing ? 'User-agent: *\nDisallow: /' : ''}

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
${isProduction ? `Sitemap: ${baseUrl}/sitemaps/products.xml` : ''}
${isProduction ? `Sitemap: ${baseUrl}/sitemaps/categories.xml` : ''}
`.trim();

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
} 