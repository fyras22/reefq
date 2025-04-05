import { Metadata } from 'next';

/**
 * Product schema interface for structured data
 */
export interface ProductSchemaProps {
  name: string;
  description: string;
  images: string[];
  price: number;
  priceCurrency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  sku?: string;
  brand?: string;
  ratingValue?: number;
  reviewCount?: number;
  category?: string;
  url?: string;
  offers?: {
    price: number;
    priceCurrency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    priceValidUntil?: string;
    url?: string;
    seller?: {
      name: string;
      url?: string;
    };
  }[];
}

/**
 * Generates product structured data for SEO
 */
export function generateProductSchema(product: ProductSchemaProps): string {
  const { 
    name, 
    description, 
    images, 
    price, 
    priceCurrency = 'USD', 
    availability = 'InStock',
    sku,
    brand,
    ratingValue,
    reviewCount,
    category,
    url,
    offers
  } = product;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://reefq.vercel.app';
  const productUrl = url || `${baseUrl}/jewelry/${sku?.toLowerCase()}`;
  
  // Define offer data structure
  let offerData: any;
  
  if (offers && offers.length > 0) {
    // If we have offer details, use them
    const firstOffer = offers[0];
    offerData = {
      '@type': 'Offer',
      url: firstOffer.url || productUrl,
      price: firstOffer.price,
      priceCurrency: firstOffer.priceCurrency || priceCurrency,
      availability: `https://schema.org/${firstOffer.availability || availability}`,
      ...(firstOffer.priceValidUntil && { priceValidUntil: firstOffer.priceValidUntil }),
      ...(firstOffer.seller && { 
        seller: {
          '@type': 'Organization',
          name: firstOffer.seller.name,
          ...(firstOffer.seller.url && { url: firstOffer.seller.url }),
        }
      }),
    };
  } else {
    // Use default offer data
    offerData = {
      '@type': 'Offer',
      url: productUrl,
      price,
      priceCurrency,
      availability: `https://schema.org/${availability}`
    };
  }
  
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name,
    description,
    image: images.map(img => img.startsWith('http') ? img : `${baseUrl}${img}`),
    sku,
    ...(brand && { brand: { '@type': 'Brand', name: brand } }),
    ...(category && { category }),
    ...(ratingValue && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue,
        reviewCount: reviewCount || 0,
        bestRating: '5',
        worstRating: '1',
      },
    }),
    offers: offerData
  };
  
  return JSON.stringify(schema);
}

/**
 * Generates breadcrumb structured data for SEO
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://reefq.vercel.app';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };

  return JSON.stringify(schema);
}

/**
 * Interface for configuring metadata
 */
interface SEOMetadataProps {
  title: string;
  description: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    images?: { url: string; alt?: string; width?: number; height?: number }[];
    type?: 'website' | 'article';
    siteName?: string;
    locale?: string;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image';
    site?: string;
    title?: string;
    description?: string;
    images?: string[];
    creator?: string;
  };
  robots?: {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    maxSnippet?: number;
    maxImagePreview?: 'none' | 'standard' | 'large';
    maxVideoPreview?: number;
  };
  alternates?: {
    languages?: Record<string, string>;
    media?: Record<string, string>;
    types?: Record<string, string>;
  };
  verification?: {
    google?: string;
    bing?: string;
    yandex?: string;
  };
}

/**
 * Generates standardized metadata for pages
 */
export function generateSEOMetadata(props: SEOMetadataProps): Metadata {
  const {
    title,
    description,
    canonical,
    openGraph,
    twitter,
    robots,
    alternates,
    verification,
  } = props;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://reefq.vercel.app';
  const canonicalUrl = canonical ? (canonical.startsWith('http') ? canonical : `${baseUrl}${canonical}`) : undefined;

  return {
    title,
    description,
    ...(canonicalUrl && { 
      alternates: {
        canonical: canonicalUrl,
        ...alternates,
      }
    }),
    openGraph: {
      title: openGraph?.title || title,
      description: openGraph?.description || description,
      type: openGraph?.type || 'website',
      ...(openGraph?.images && { images: openGraph.images }),
      ...(openGraph?.siteName && { siteName: openGraph.siteName }),
      ...(openGraph?.locale && { locale: openGraph.locale }),
    },
    twitter: {
      card: twitter?.card || 'summary_large_image',
      title: twitter?.title || title,
      description: twitter?.description || description,
      ...(twitter?.site && { site: twitter.site }),
      ...(twitter?.creator && { creator: twitter.creator }),
      ...(twitter?.images && { images: twitter.images }),
    },
    ...(robots && {
      robots: {
        index: robots.index !== false,
        follow: robots.follow !== false,
        ...(robots.noarchive !== undefined && { noarchive: robots.noarchive }),
        ...(robots.nosnippet !== undefined && { nosnippet: robots.nosnippet }),
        ...(robots.maxSnippet !== undefined && { 'max-snippet': robots.maxSnippet }),
        ...(robots.maxImagePreview !== undefined && { 'max-image-preview': robots.maxImagePreview }),
        ...(robots.maxVideoPreview !== undefined && { 'max-video-preview': robots.maxVideoPreview }),
      },
    }),
    ...(verification && {
      verification: {
        ...(verification.google && { google: verification.google }),
        ...(verification.bing && { bing: verification.bing }),
        ...(verification.yandex && { yandex: verification.yandex }),
      },
    }),
  };
}

/**
 * Generates a schema for a jewelry product
 */
export function generateJewelryProductSchema(product: {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  type: string;
  materials: { name: string }[];
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://reefq.vercel.app';
  
  return generateProductSchema({
    name: product.name,
    description: product.description,
    images: product.images,
    price: product.price,
    sku: product.id,
    brand: 'ReefQ',
    category: `Jewelry > ${product.type}`,
    availability: 'InStock',
    offers: [
      {
        price: product.price,
        seller: {
          name: 'ReefQ Jewelry',
          url: baseUrl
        }
      }
    ]
  });
} 