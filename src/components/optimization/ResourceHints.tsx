'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Head from 'next/head';

// Resource types for preloading
export type ResourceType = 'font' | 'image' | 'style' | 'script' | 'document' | 'fetch';

// Resource priority
export type ResourcePriority = 'high' | 'low' | 'auto';

// Interface for preload resources
export interface PreloadResource {
  href: string;
  as: ResourceType;
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
  media?: string;
  integrity?: string;
  priority?: ResourcePriority;
}

// Interface for preconnect resources
export interface PreconnectResource {
  href: string;
  crossOrigin?: boolean;
}

// Interface for prefetch resources
export interface PrefetchResource {
  href: string;
  as?: ResourceType;
  crossOrigin?: 'anonymous' | 'use-credentials';
  integrity?: string;
}

// Interface for DNS prefetch resources
export interface DNSPrefetchResource {
  href: string;
}

/**
 * ResourceHints component for optimizing resource loading
 * 
 * This component helps with faster page loads by:
 * 1. Preconnecting to required origins (DNS, TCP, TLS)
 * 2. Prefetching resources likely needed for subsequent navigation
 * 3. Preloading critical resources needed for current page
 * 4. DNS prefetching for faster hostname resolution
 */
export default function ResourceHints() {
  return (
    <>
      {/* Preconnect to critical domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
      
      {/* DNS prefetch for less critical domains */}
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://analytics.google.com" />
      
      {/* Preload critical assets */}
      <link 
        rel="preload" 
        href="/models/low-poly-ring.glb" 
        as="fetch" 
        crossOrigin="anonymous" 
      />
      
      {/* Preload critical styles */}
      <link 
        rel="preload" 
        href="/styles/critical.css" 
        as="style" 
      />
      
      {/* Prefetch important pages likely to be navigated to */}
      <link rel="prefetch" href="/jewelry" />
      <link rel="prefetch" href="/3d-modeling" />
    </>
  );
}

/**
 * Component to preload critical CSS
 */
export function PreloadCriticalCSS({ href }: { href: string }) {
  return (
    <Head>
      <link
        rel="preload"
        href={href}
        as="style"
        // @ts-ignore - fetchpriority exists but is not in the types
        fetchpriority="high"
      />
      <link rel="stylesheet" href={href} />
    </Head>
  );
}

/**
 * Component to preload fonts with optimal settings
 */
export function PreloadFonts({
  fonts,
  display = 'swap',
}: {
  fonts: Array<{
    href: string;
    type?: string;
    crossOrigin?: boolean;
    weight?: string;
  }>;
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
}) {
  return (
    <Head>
      {fonts.map((font, index) => (
        <React.Fragment key={`font-${index}-${font.href}`}>
          <link
            rel="preload"
            href={font.href}
            as="font"
            type={font.type || 'font/woff2'}
            crossOrigin={font.crossOrigin ? 'anonymous' : undefined}
            // @ts-ignore - fetchpriority exists but is not in the types
            fetchpriority="high"
          />
          <style data-href={font.href}>{`
            @font-face {
              font-family: 'CustomFont-${index}';
              src: url('${font.href}') format('${font.type === 'font/woff2' ? 'woff2' : 'woff'}');
              font-weight: ${font.weight || 'normal'};
              font-display: ${display};
            }
          `}</style>
        </React.Fragment>
      ))}
    </Head>
  );
}

/**
 * Optimized image preloading for critical images
 */
export function PreloadCriticalImages({
  images,
}: {
  images: Array<{
    src: string;
    media?: string;
    type?: string;
  }>;
}) {
  return (
    <Head>
      {images.map((image, index) => (
        <link
          key={`critical-image-${index}`}
          rel="preload"
          as="image"
          href={image.src}
          media={image.media}
          type={image.type}
          // @ts-ignore - fetchpriority exists but is not in the types
          fetchpriority="high"
        />
      ))}
    </Head>
  );
}

/**
 * Usage example:
 * 
 * <ResourceHints
 *   preconnects={[
 *     { href: 'https://api.example.com' },
 *     { href: 'https://cdn.example.com', crossOrigin: true }
 *   ]}
 *   preloads={[
 *     { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
 *     { href: '/hero-image.webp', as: 'image' }
 *   ]}
 *   prefetches={[
 *     { href: '/data/initial.json', as: 'fetch' }
 *   ]}
 *   conditionalResources={{
 *     '/products': [
 *       { href: '/data/products.json', as: 'fetch' }
 *     ],
 *     '/about': [
 *       { href: '/images/team.webp', as: 'image' }
 *     ]
 *   }}
 * />
 */ 