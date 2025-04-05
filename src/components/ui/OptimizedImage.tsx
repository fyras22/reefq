'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { generateGradientPlaceholder, getDimensionsFromAspectRatio } from '@/lib/optimizations/ImageOptimizer';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  fill?: boolean;
  sizes?: string;
  onLoad?: () => void;
  quality?: number;
  dominantColors?: string[];
}

/**
 * OptimizedImage component that prevents layout shift with proper aspect ratio handling
 * and shows a low-quality placeholder or blur-up effect
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  aspectRatio = '4/3',
  priority = false,
  className,
  containerClassName,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  onLoad,
  quality = 80,
  dominantColors = ['#f5f5f5', '#e2e2e2'],
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // If src is empty or error occurred, use fallback image
  const imageSrc = error || !src 
    ? '/images/image-placeholder.jpg' 
    : src;
  
  // Generate placeholder based on dominant colors
  const placeholderSrc = generateGradientPlaceholder(
    dominantColors,
    100,
    aspectRatio ? getDimensionsFromAspectRatio(aspectRatio).height : 100
  );
  
  // Handle loading success
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  // Handle loading error
  const handleError = () => {
    setError(true);
  };
  
  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-gray-100',
        !fill && 'w-full',
        containerClassName
      )}
      style={!fill ? { aspectRatio: aspectRatio.replace(':', '/') } : undefined}
    >
      <Image
        src={imageSrc}
        alt={alt}
        width={fill ? undefined : (width || 800)}
        height={fill ? undefined : (height || 600)}
        fill={fill}
        priority={priority}
        sizes={sizes}
        quality={quality}
        className={cn(
          'transition-opacity duration-500',
          isLoaded ? 'opacity-100' : 'opacity-0',
          'object-cover',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        placeholder="blur"
        blurDataURL={placeholderSrc}
      />
      
      {/* Fallback for error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-600">
          <span>Image not available</span>
        </div>
      )}
    </div>
  );
} 