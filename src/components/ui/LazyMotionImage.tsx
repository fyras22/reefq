'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, type MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import OptimizedImage from './OptimizedImage';

interface LazyMotionImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  motionProps?: MotionProps;
  animationVariant?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'none';
  fill?: boolean;
  sizes?: string;
  onLoad?: () => void;
  threshold?: number;
}

/**
 * Component that combines lazy loading, animation, and optimized images
 * Improves LCP and prevents layout shift while providing pleasing animations
 */
export default function LazyMotionImage({
  src,
  alt,
  width,
  height,
  aspectRatio = '4/3',
  priority = false,
  className,
  containerClassName,
  motionProps,
  animationVariant = 'fade',
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  onLoad,
  threshold = 0.2,
}: LazyMotionImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: threshold });
  
  // Variants for animations
  const variants = {
    hidden: {
      opacity: 0,
      y: animationVariant === 'slide-up' ? 20 : 
         animationVariant === 'slide-down' ? -20 : 0,
      scale: animationVariant === 'scale' ? 0.95 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };
  
  // No animation if animation variant is "none"
  const shouldAnimate = animationVariant !== 'none';
  
  // Handle when the image is loaded
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  // Only add intersection observer effect if not priority
  useEffect(() => {
    if (priority && !isLoaded) {
      setIsLoaded(true);
    }
  }, [priority, isLoaded]);
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        'overflow-hidden', 
        containerClassName
      )}
      style={{ 
        aspectRatio: !fill ? aspectRatio : undefined,
        containIntrinsicSize: !fill ? 'auto' : undefined,
        contain: 'layout paint style',
      }}
    >
      {/* Only render when in view or if priority */}
      {(isInView || priority) && (
        <motion.div
          initial={shouldAnimate ? "hidden" : false}
          animate={shouldAnimate && isInView ? "visible" : undefined}
          variants={shouldAnimate ? variants : undefined}
          className="w-full h-full"
          {...motionProps}
        >
          <OptimizedImage
            src={src}
            alt={alt}
            width={width}
            height={height}
            aspectRatio={aspectRatio}
            priority={priority}
            className={className}
            fill={fill}
            sizes={sizes}
            onLoad={handleLoad}
          />
        </motion.div>
      )}
    </div>
  );
} 