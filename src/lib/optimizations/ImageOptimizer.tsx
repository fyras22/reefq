'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image, { ImageProps } from 'next/image';

export interface ImageOptimizationOptions {
  /**
   * Whether to enable LQIP (Low Quality Image Placeholder)
   * @default true
   */
  useLqip?: boolean;
  
  /**
   * Whether to enable blur-up effect for smoother transitions
   * @default true
   */
  blurUp?: boolean;
  
  /**
   * Whether to lazy load the image
   * @default true
   */
  lazyLoad?: boolean;
  
  /**
   * Whether to preload the image if it's a critical resource
   * @default false
   */
  preload?: boolean;
  
  /**
   * Whether to enable progressive loading
   * @default true
   */
  progressive?: boolean;
  
  /**
   * Custom aspect ratio for placeholders, e.g. "16:9" or "4:3"
   */
  aspectRatio?: string;
  
  /**
   * Whether to enable art direction (different images for different breakpoints)
   * @default false
   */
  artDirection?: boolean;
  
  /**
   * Whether to add image dimensions to prevent CLS
   * @default true
   */
  preventCLS?: boolean;
  
  /**
   * Background color for the placeholder
   * @default "#f0f0f0"
   */
  placeholderColor?: string;
  
  /**
   * Priority loading for LCP images
   * @default false
   */
  priority?: boolean;
  
  /**
   * Whether to apply optimal image quality settings
   * @default true
   */
  optimizeQuality?: boolean;
}

export interface ResponsiveImageSource {
  /**
   * Media query for this source
   * @example "(max-width: 768px)"
   */
  media: string;
  
  /**
   * Image source for this breakpoint
   */
  src: string;
  
  /**
   * Image width
   */
  width: number;
  
  /**
   * Image height
   */
  height: number;
}

export interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  /**
   * Image source URL or object with responsive sources
   */
  src: string | ResponsiveImageSource[];
  
  /**
   * Alt text for the image (required for accessibility)
   */
  alt: string;
  
  /**
   * Image optimization options
   */
  optimization?: ImageOptimizationOptions;
  
  /**
   * Small variant of the image for LQIP (Low Quality Image Placeholder)
   */
  lqipSrc?: string;
  
  /**
   * LQIP blur hash for generating placeholder
   */
  blurHash?: string;
  
  /**
   * Base64 encoded thumbnail for immediate display
   */
  base64Thumbnail?: string;
  
  /**
   * Whether this image is a critical visual element (LCP candidate)
   */
  isCritical?: boolean;
  
  /**
   * Color palette extracted from the image for smart placeholders
   */
  dominantColors?: string[];
}

/**
 * Generate a placeholder based on aspect ratio
 */
function generatePlaceholder(
  width: number, 
  height: number, 
  color: string = '#f0f0f0',
  text?: string
): string {
  // Calculate dimensions
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}" />
      ${text ? `<text x="50%" y="50%" font-family="system-ui" font-size="16" fill="#888" text-anchor="middle" dominant-baseline="middle">${text}</text>` : ''}
    </svg>
  `;
  
  // In browser environments, we would use Buffer, but for server components we need to handle this differently
  // This is a simplified version for the example
  const base64 = typeof window === 'undefined' 
    ? Buffer.from(svg).toString('base64')
    : btoa(svg);
  
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Generate a simple blur hash placeholder
 */
function generateSimpleBlurPlaceholder(dominantColors: string[] = ['#f0f0f0']): string {
  const width = 100;
  const height = 100;
  
  // Use the first color as background, or default to light gray
  const bgColor = dominantColors[0] || '#f0f0f0';
  
  if (dominantColors.length <= 1) {
    return generatePlaceholder(width, height, bgColor);
  }
  
  // Create a simple gradient with the dominant colors
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          ${dominantColors.map((color, index) => {
            // Ensure we're working with numbers for the calculation
            const i = Number(index);
            const total = Number(dominantColors.length - 1);
            const offset = Math.round((i / total) * 100);
            return `<stop offset="${offset}%" stop-color="${color}" />`;
          }).join('')}
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)" />
    </svg>
  `;
  
  // In browser environments, we would use Buffer, but for server components we need to handle this differently
  const base64 = typeof window === 'undefined' 
    ? Buffer.from(svg).toString('base64')
    : btoa(svg);
  
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Calculate dimensions from aspect ratio string
 */
function getDimensionsFromAspectRatio(aspectRatio: string, baseWidth: number = 100): {width: number, height: number} {
  if (!aspectRatio.includes(':')) {
    return { width: baseWidth, height: baseWidth };
  }

  const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
  const height = baseWidth * (heightRatio / widthRatio);
  
  return { 
    width: baseWidth,
    height: Math.round(height)
  };
}

/**
 * OptimizedImage component with various optimization strategies
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  optimization = {},
  lqipSrc,
  blurHash,
  base64Thumbnail,
  isCritical = false,
  dominantColors,
  className,
  style,
  ...props
}: OptimizedImageProps) {
  const {
    useLqip = true,
    blurUp = true,
    lazyLoad = true,
    preload = false,
    progressive = true,
    aspectRatio,
    artDirection = false,
    preventCLS = true,
    placeholderColor = '#f0f0f0',
    priority = false,
    optimizeQuality = true,
  } = optimization;
  
  // Refs
  const imgRef = useRef<HTMLImageElement>(null);
  
  // State
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Decide on priority, either explicit or based on isCritical
  const isPriority = priority || isCritical;
  
  // Apply optimal image loading strategy based on configuration
  useEffect(() => {
    if (preload && typeof src === 'string') {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = src;
      document.head.appendChild(preloadLink);
      
      return () => {
        document.head.removeChild(preloadLink);
      };
    }
  }, [preload, src]);

  // Create a placeholder for the image
  const getPlaceholder = () => {
    if (base64Thumbnail) {
      return base64Thumbnail;
    }
    
    if (lqipSrc) {
      return lqipSrc;
    }
    
    if (blurHash) {
      // In a real implementation, this would decode the blurHash
      // For this example, we'll use a simple dominant color placeholder
      return generateSimpleBlurPlaceholder(dominantColors);
    }
    
    if (dominantColors && dominantColors.length > 0) {
      return generateSimpleBlurPlaceholder(dominantColors);
    }
    
    if (aspectRatio && (width || height)) {
      const dims = getDimensionsFromAspectRatio(aspectRatio, 100);
      return generatePlaceholder(dims.width, dims.height, placeholderColor, `${width}×${height}`);
    }
    
    if (width && height) {
      // Ensure width and height are numbers for the calculation
      const numWidth = typeof width === 'number' ? width : parseInt(String(width), 10);
      const numHeight = typeof height === 'number' ? height : parseInt(String(height), 10);
      
      if (!isNaN(numWidth) && !isNaN(numHeight) && numWidth > 0) {
        return generatePlaceholder(100, Math.floor(100 * (numHeight / numWidth)), placeholderColor);
      }
    }
    
    return undefined;
  };
  
  // Handle multiple responsive images with art direction
  if (artDirection && Array.isArray(src)) {
    return (
      <picture>
        {src.map((source, index) => (
          <source 
            key={index}
            media={source.media}
            srcSet={source.src}
          />
        ))}
        <Image
          src={src[0].src}
          alt={alt}
          width={src[0].width}
          height={src[0].height}
          className={`${className || ''} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          style={style}
          loading={isPriority ? 'eager' : (lazyLoad ? 'lazy' : 'eager')}
          priority={isPriority}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          placeholder={useLqip ? 'blur' : 'empty'}
          blurDataURL={getPlaceholder()}
          {...props}
        />
      </picture>
    );
  }
  
  // Standard image optimization
  return (
    <div className={`image-container relative ${error ? 'image-error' : ''}`} 
      style={{
        aspectRatio: aspectRatio ? aspectRatio.replace(':', '/') : (width && height ? `${width}/${height}` : undefined),
        ...(!fill && preventCLS && width && height ? { 
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height
        } : {}),
      }}
    >
      <Image
        ref={imgRef}
        src={typeof src === 'string' ? src : src[0].src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={`
          ${className || ''} 
          ${!loaded && blurUp ? 'opacity-0' : 'opacity-100'} 
          transition-opacity duration-500
          ${error ? 'hidden' : ''}
        `}
        style={{
          ...style,
          objectFit: fill ? 'cover' : undefined,
        }}
        quality={optimizeQuality ? 85 : undefined}
        loading={isPriority ? 'eager' : (lazyLoad ? 'lazy' : 'eager')}
        priority={isPriority}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        placeholder={useLqip ? 'blur' : 'empty'}
        blurDataURL={getPlaceholder()}
        sizes={props.sizes || (fill ? '100vw' : undefined)}
        {...props}
      />
      
      {/* Fallback for image load failures */}
      {error && (
        <div 
          className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500 text-sm"
          style={{
            aspectRatio: aspectRatio ? aspectRatio.replace(':', '/') : (width && height ? `${width}/${height}` : undefined),
          }}
        >
          Failed to load image
        </div>
      )}
    </div>
  );
}

/**
 * Usage:
 * 
 * // Basic usage
 * <OptimizedImage
 *   src="/images/hero.jpg"
 *   alt="Hero image"
 *   width={800}
 *   height={600}
 * />
 * 
 * // Advanced usage with art direction
 * <OptimizedImage
 *   src={[
 *     { media: "(max-width: 768px)", src: "/images/hero-mobile.jpg", width: 640, height: 480 },
 *     { media: "(min-width: 769px)", src: "/images/hero-desktop.jpg", width: 1280, height: 720 }
 *   ]}
 *   alt="Hero image"
 *   optimization={{
 *     useLqip: true,
 *     artDirection: true,
 *     priority: true
 *   }}
 *   isCritical={true}
 *   dominantColors={["#2563eb", "#6b7280"]}
 * />
 */ 