'use client';

import React from 'react';
import Head from 'next/head';
import Script from 'next/script';

interface OpenGraphImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

interface OpenGraphData {
  title: string;
  description: string;
  type?: string;
  site_name?: string;
  images?: OpenGraphImage[];
}

interface TwitterData {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  image?: string;
}

interface JsonLDData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  [key: string]: any;
}

interface AdvancedSEOProps {
  title: string;
  description: string;
  openGraph: OpenGraphData;
  twitter?: TwitterData;
  canonicalUrl?: string;
  jsonLD?: JsonLDData | JsonLDData[];
  structuredData?: Record<string, any>;
}

export default function AdvancedSEO({
  title,
  description,
  openGraph,
  twitter,
  canonicalUrl,
  jsonLD,
  structuredData
}: AdvancedSEOProps) {
  return (
    <>
      <Head>
        {/* Basic SEO */}
        <title>{title}</title>
        <meta name="description" content={description} />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content={openGraph.title} />
        <meta property="og:description" content={openGraph.description} />
        <meta property="og:type" content={openGraph.type || 'website'} />
        {openGraph.site_name && <meta property="og:site_name" content={openGraph.site_name} />}
        
        {/* Open Graph Images */}
        {openGraph.images && openGraph.images.map((image, index) => (
          <React.Fragment key={`og-image-${index}`}>
            <meta property="og:image" content={image.url} />
            <meta property="og:image:width" content={String(image.width)} />
            <meta property="og:image:height" content={String(image.height)} />
            <meta property="og:image:alt" content={image.alt} />
          </React.Fragment>
        ))}
        
        {/* Twitter */}
        {twitter && (
          <>
            <meta name="twitter:card" content={twitter.card} />
            {twitter.site && <meta name="twitter:site" content={twitter.site} />}
            <meta name="twitter:title" content={openGraph.title} />
            <meta name="twitter:description" content={openGraph.description} />
            {twitter.image && <meta name="twitter:image" content={twitter.image} />}
          </>
        )}
        
        {/* Other meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="robots" content="index, follow" />
      </Head>
      
      {/* JSON-LD Structured Data */}
      {jsonLD && (
        <Script 
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
          strategy="afterInteractive"
        />
      )}
      
      {/* Additional structured data if needed */}
      {structuredData && (
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          strategy="afterInteractive"
        />
      )}
    </>
  );
} 