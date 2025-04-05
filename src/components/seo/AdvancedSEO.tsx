import React from 'react';
import Head from 'next/head';
import { usePathname } from 'next/navigation';

export interface OpenGraphImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  type?: string; // image/jpeg, image/png, etc.
}

export interface TwitterCardData {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    type?: 'website' | 'article' | 'profile' | 'book' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other';
    site_name?: string;
    locale?: string;
    images?: OpenGraphImage[];
    videos?: Array<{
      url: string;
      width?: number;
      height?: number;
      type?: string;
    }>;
    audio?: Array<{
      url: string;
      type?: string;
    }>;
    article?: {
      publishedTime?: string;
      modifiedTime?: string;
      expirationTime?: string;
      authors?: string[];
      section?: string;
      tags?: string[];
    };
    profile?: {
      firstName?: string;
      lastName?: string;
      username?: string;
      gender?: string;
    };
  };
  twitter?: TwitterCardData;
  additionalMetaTags?: Array<{
    name?: string;
    property?: string;
    content: string;
    key?: string;
  }>;
  structuredData?: StructuredData | StructuredData[];
  noIndex?: boolean;
  noFollow?: boolean;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

/**
 * Advanced SEO component for comprehensive SEO optimization
 * 
 * Provides:
 * - Basic meta tags (title, description)
 * - Canonical URL
 * - Robots directives (noindex, nofollow)
 * - OpenGraph tags for social sharing
 * - Twitter Card data
 * - JSON-LD structured data for rich results
 * - Additional meta tags
 */
export default function AdvancedSEO({
  title,
  description,
  canonical,
  openGraph,
  twitter,
  additionalMetaTags = [],
  structuredData,
  noIndex = false,
  noFollow = false,
  jsonLd,
}: SEOProps) {
  const pathname = usePathname();
  
  // Generate canonical URL if not provided
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  const canonicalUrl = canonical || `${baseUrl}${pathname}`;
  
  // Generate robots directives
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow',
    'max-image-preview:large',
    'max-snippet:-1',
    'max-video-preview:-1',
  ].join(', ');
  
  // Generate OpenGraph tags
  const ogTitle = openGraph?.title || title;
  const ogDescription = openGraph?.description || description;
  const ogUrl = openGraph?.url || canonicalUrl;
  const ogType = openGraph?.type || 'website';
  const ogSiteName = openGraph?.site_name || process.env.NEXT_PUBLIC_SITE_NAME || '';
  const ogLocale = openGraph?.locale || 'en_US';
  
  // Generate Twitter Card data
  const twitterCard = twitter?.card || 'summary_large_image';
  const twitterSite = twitter?.site || process.env.NEXT_PUBLIC_TWITTER_HANDLE || '';
  const twitterCreator = twitter?.creator || twitterSite;
  const twitterTitle = twitter?.title || ogTitle;
  const twitterDescription = twitter?.description || ogDescription;
  
  // Prepare JSON-LD structured data
  const jsonLdString = jsonLd 
    ? Array.isArray(jsonLd) 
      ? JSON.stringify({ '@context': 'https://schema.org', '@graph': jsonLd })
      : JSON.stringify(jsonLd)
    : structuredData 
      ? Array.isArray(structuredData)
        ? JSON.stringify({ '@context': 'https://schema.org', '@graph': structuredData })
        : JSON.stringify(structuredData)
      : '';
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={robotsContent} />
      
      {/* OpenGraph Tags */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content={ogType} />
      {ogSiteName && <meta property="og:site_name" content={ogSiteName} />}
      <meta property="og:locale" content={ogLocale} />
      
      {/* OpenGraph Images */}
      {openGraph?.images?.map((image, index) => (
        <React.Fragment key={`og-image-${index}`}>
          <meta property="og:image" content={image.url} />
          {image.width && <meta property="og:image:width" content={image.width.toString()} />}
          {image.height && <meta property="og:image:height" content={image.height.toString()} />}
          {image.alt && <meta property="og:image:alt" content={image.alt} />}
          {image.type && <meta property="og:image:type" content={image.type} />}
        </React.Fragment>
      ))}
      
      {/* OpenGraph Videos */}
      {openGraph?.videos?.map((video, index) => (
        <React.Fragment key={`og-video-${index}`}>
          <meta property="og:video" content={video.url} />
          {video.width && <meta property="og:video:width" content={video.width.toString()} />}
          {video.height && <meta property="og:video:height" content={video.height.toString()} />}
          {video.type && <meta property="og:video:type" content={video.type} />}
        </React.Fragment>
      ))}
      
      {/* OpenGraph Audio */}
      {openGraph?.audio?.map((audio, index) => (
        <React.Fragment key={`og-audio-${index}`}>
          <meta property="og:audio" content={audio.url} />
          {audio.type && <meta property="og:audio:type" content={audio.type} />}
        </React.Fragment>
      ))}
      
      {/* OpenGraph Article Tags */}
      {ogType === 'article' && openGraph?.article && (
        <>
          {openGraph.article.publishedTime && (
            <meta property="article:published_time" content={openGraph.article.publishedTime} />
          )}
          {openGraph.article.modifiedTime && (
            <meta property="article:modified_time" content={openGraph.article.modifiedTime} />
          )}
          {openGraph.article.expirationTime && (
            <meta property="article:expiration_time" content={openGraph.article.expirationTime} />
          )}
          {openGraph.article.authors?.map((author, index) => (
            <meta key={`article-author-${index}`} property="article:author" content={author} />
          ))}
          {openGraph.article.section && (
            <meta property="article:section" content={openGraph.article.section} />
          )}
          {openGraph.article.tags?.map((tag, index) => (
            <meta key={`article-tag-${index}`} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* OpenGraph Profile Tags */}
      {ogType === 'profile' && openGraph?.profile && (
        <>
          {openGraph.profile.firstName && (
            <meta property="profile:first_name" content={openGraph.profile.firstName} />
          )}
          {openGraph.profile.lastName && (
            <meta property="profile:last_name" content={openGraph.profile.lastName} />
          )}
          {openGraph.profile.username && (
            <meta property="profile:username" content={openGraph.profile.username} />
          )}
          {openGraph.profile.gender && (
            <meta property="profile:gender" content={openGraph.profile.gender} />
          )}
        </>
      )}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      {twitter?.image && <meta name="twitter:image" content={twitter.image} />}
      {twitter?.imageAlt && <meta name="twitter:image:alt" content={twitter.imageAlt} />}
      
      {/* Additional Meta Tags */}
      {additionalMetaTags.map((tag, index) => (
        <meta
          key={tag.key || `meta-tag-${index}`}
          {...(tag.name && { name: tag.name })}
          {...(tag.property && { property: tag.property })}
          content={tag.content}
        />
      ))}
      
      {/* JSON-LD Structured Data */}
      {jsonLdString && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
          key="jsonld-structured-data"
        />
      )}
    </Head>
  );
}

/**
 * Generate structured data for a product
 */
export function generateProductSchema({
  name,
  description,
  sku,
  gtin,
  mpn,
  brand,
  image,
  url,
  price,
  priceCurrency = 'USD',
  availability = 'https://schema.org/InStock',
  reviewCount,
  ratingValue,
}: {
  name: string;
  description: string;
  sku?: string;
  gtin?: string;
  mpn?: string;
  brand: string;
  image: string | string[];
  url: string;
  price: number;
  priceCurrency?: string;
  availability?: string;
  reviewCount?: number;
  ratingValue?: number;
}) {
  // Define the schema type with optional aggregateRating
  const productSchema: {
    '@context': string;
    '@type': string;
    name: string;
    description: string;
    image: string[];
    url: string;
    sku?: string;
    gtin?: string;
    mpn?: string;
    brand: {
      '@type': string;
      name: string;
    };
    offers: {
      '@type': string;
      price: number;
      priceCurrency: string;
      availability: string;
      url: string;
    };
    aggregateRating?: {
      '@type': string;
      ratingValue: number;
      reviewCount: number;
    };
  } = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: Array.isArray(image) ? image : [image],
    url,
    ...(sku && { sku }),
    ...(gtin && { gtin }),
    ...(mpn && { mpn }),
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency,
      availability,
      url,
    },
  };

  // Add aggregate rating if rating data exists
  if (reviewCount && ratingValue) {
    productSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
    };
  }

  return productSchema;
}

/**
 * Generate structured data for an article
 */
export function generateArticleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  publisher,
  url,
}: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo: string;
  };
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author.name,
      ...(author.url && { url: author.url }),
    },
    publisher: {
      '@type': 'Organization',
      name: publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: publisher.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

/**
 * Generate structured data for a local business
 */
export function generateLocalBusinessSchema({
  name,
  description,
  url,
  telephone,
  address,
  geo,
  image,
  priceRange,
  openingHours,
}: {
  name: string;
  description: string;
  url: string;
  telephone: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  image: string | string[];
  priceRange?: string;
  openingHours?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description,
    url,
    telephone,
    image: Array.isArray(image) ? image : [image],
    address: {
      '@type': 'PostalAddress',
      ...address,
    },
    ...(geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    }),
    ...(priceRange && { priceRange }),
    ...(openingHours && { openingHoursSpecification: openingHours }),
  };
}

/**
 * Generate breadcrumbs structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQSchema(questions: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * Usage example:
 * 
 * <AdvancedSEO
 *   title="Product Name - Your Store"
 *   description="Description of your amazing product that will appear in search results and social shares."
 *   openGraph={{
 *     title: "Amazing Product - 20% Off | Your Store",
 *     description: "Get this amazing product for 20% off today only!",
 *     type: "product",
 *     images: [
 *       {
 *         url: "https://example.com/product.jpg",
 *         width: 1200,
 *         height: 630,
 *         alt: "Product image"
 *       }
 *     ]
 *   }}
 *   twitter={{
 *     card: "summary_large_image",
 *     site: "@yourstoretwitter",
 *     image: "https://example.com/product.jpg"
 *   }}
 *   jsonLd={generateProductSchema({
 *     name: "Amazing Product",
 *     description: "This is an amazing product with fantastic features.",
 *     brand: "Your Brand",
 *     image: "https://example.com/product.jpg",
 *     url: "https://example.com/product",
 *     price: 99.99,
 *     sku: "PROD123",
 *     reviewCount: 89,
 *     ratingValue: 4.7
 *   })}
 * />
 */ 