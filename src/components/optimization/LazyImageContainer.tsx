'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LazyImageContainerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: number | string;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
  sizes?: string;
  className?: string;
  containerClassName?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  fallbackComponent?: React.ReactNode;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fill?: boolean;
  placeholderColor?: string;
  quality?: number;
  threshold?: number;
  rootMargin?: string;
  showLoadingIndicator?: boolean;
}

/**
 * A highly optimized image container that helps prevent CLS,
 * preserves aspect ratio, and provides automatic lazy loading.
 */
export default function LazyImageContainer({
  src,
  alt,
  width,
  height,
  aspectRatio,
  priority = false,
  loading,
  sizes = '(max-width: 768px) 100vw, 50vw',
  className,
  containerClassName,
  fallbackSrc,
  onLoad,
  fallbackComponent,
  objectFit = 'cover',
  fill = false,
  placeholderColor = '#f1f5f9', // Slate-100
  quality = 85,
  threshold = 0.1,
  rootMargin = '200px',
  showLoadingIndicator = false,
}: LazyImageContainerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!!priority);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate aspect ratio style
  const getAspectRatioStyle = () => {
    if (typeof aspectRatio === 'number') {
      return { paddingBottom: `${(1 / aspectRatio) * 100}%` };
    } else if (typeof aspectRatio === 'string' && aspectRatio.includes('/')) {
      const [width, height] = aspectRatio.split('/').map(Number);
      return { paddingBottom: `${(height / width) * 100}%` };
    } else if (width && height) {
      return { paddingBottom: `${(height / width) * 100}%` };
    }
    return {};
  };

  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (priority || !containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );
    
    observer.observe(containerRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [priority, rootMargin, threshold]);

  // Handle successful image load
  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // Handle image error
  const handleImageError = () => {
    setHasError(true);
    console.warn(`Failed to load image: ${src}`);
  };

  // Determine what to show - placeholder, fallback, or actual image
  const showPlaceholder = !isInView || (!isLoaded && !hasError);
  const showFallback = hasError && fallbackSrc;
  const showImage = isInView && !hasError;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden bg-slate-100',
        containerClassName
      )}
      style={!fill ? getAspectRatioStyle() : {}}
      aria-label={alt}
    >
      {/* Placeholder - shown while loading or not in view */}
      {showPlaceholder && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: placeholderColor }}
        >
          {showLoadingIndicator && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-500" />
            </div>
          )}
        </div>
      )}

      {/* Actual image - loaded when in view */}
      {showImage && (
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width || 1000}
          height={fill ? undefined : height || (width && aspectRatio ? width / Number(aspectRatio) : 1000)}
          quality={quality}
          loading={loading || (priority ? 'eager' : 'lazy')}
          priority={priority}
          sizes={sizes}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            {
              'object-cover': objectFit === 'cover',
              'object-contain': objectFit === 'contain',
              'object-fill': objectFit === 'fill',
              'object-none': objectFit === 'none',
              'object-scale-down': objectFit === 'scale-down',
            },
            className
          )}
          fill={fill}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}

      {/* Fallback image - shown on error */}
      {showFallback && fallbackSrc && (
        <Image
          src={fallbackSrc}
          alt={alt}
          width={fill ? undefined : width || 1000}
          height={fill ? undefined : height || (width && aspectRatio ? width / Number(aspectRatio) : 1000)}
          quality={quality}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            {
              'object-cover': objectFit === 'cover',
              'object-contain': objectFit === 'contain',
              'object-fill': objectFit === 'fill',
              'object-none': objectFit === 'none',
              'object-scale-down': objectFit === 'scale-down',
            },
            className
          )}
          fill={fill}
          onLoad={handleImageLoad}
        />
      )}

      {/* Fallback component - shown on error if provided */}
      {hasError && !fallbackSrc && fallbackComponent ? (
        <div className="absolute inset-0 flex items-center justify-center">
          {fallbackComponent}
        </div>
      ) : null}
    </div>
  );
} 