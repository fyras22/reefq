'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  animate?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  containerClassName?: string;
}

/**
 * Skeleton loader component for content placeholders
 * Used to improve perceived performance during loading states
 */
export function Skeleton({
  className,
  height,
  width,
  animate = true,
  rounded = 'md',
  containerClassName,
}: SkeletonProps) {
  const style = {
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div className={containerClassName}>
      <div
        style={style}
        className={cn(
          'bg-gray-200 dark:bg-gray-700',
          animate && 'animate-pulse',
          roundedClasses[rounded],
          'relative overflow-hidden',
          'after:absolute after:inset-0 after:w-full after:h-full',
          'after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent',
          animate && 'after:animate-shimmer',
          className
        )}
      />
    </div>
  );
}

/**
 * Product card skeleton for loading states
 */
export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton height={200} width="100%" rounded="md" />
      <Skeleton height={20} width="70%" />
      <Skeleton height={16} width="40%" />
      <Skeleton height={24} width="30%" />
    </div>
  );
}

/**
 * Text content skeleton 
 */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          height={16}
          width={i === lines - 1 && lines > 1 ? '70%' : '100%'}
          className="max-w-full"
        />
      ))}
    </div>
  );
}

/**
 * Image skeleton with aspect ratio maintained
 */
export function ImageSkeleton({ 
  aspectRatio = '16/9',
  className
}: { 
  aspectRatio?: string,
  className?: string
}) {
  return (
    <div className={cn('relative', className)} style={{ aspectRatio }}>
      <Skeleton 
        className="absolute inset-0 w-full h-full" 
        animate={true}
        rounded="md"
      />
    </div>
  );
}

/**
 * Navigation skeleton for loading states in headers/navbars
 */
export function NavSkeleton() {
  return (
    <div className="flex items-center space-x-4 w-full">
      <Skeleton width={120} height={32} rounded="md" />
      <div className="flex-1" />
      <div className="flex items-center space-x-2">
        <Skeleton width={80} height={32} rounded="md" />
        <Skeleton width={80} height={32} rounded="md" />
        <Skeleton width={80} height={32} rounded="md" />
      </div>
      <Skeleton width={40} height={40} rounded="full" />
    </div>
  );
}

/**
 * Grid skeleton for product listings with responsive design
 */
export function GridSkeleton({ 
  items = 6, 
  columns = { default: 1, sm: 2, md: 3, lg: 4 }
}: { 
  items?: number,
  columns?: { default: number, sm?: number, md?: number, lg?: number, xl?: number }
}) {
  return (
    <div className={cn(
      'grid gap-4 w-full',
      `grid-cols-${columns.default}`,
      columns.sm && `sm:grid-cols-${columns.sm}`,
      columns.md && `md:grid-cols-${columns.md}`,
      columns.lg && `lg:grid-cols-${columns.lg}`,
      columns.xl && `xl:grid-cols-${columns.xl}`,
    )}>
      {Array.from({ length: items }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Layout skeleton for typical product page
 */
export function ProductPageSkeleton() {
  return (
    <div className="w-full">
      <NavSkeleton />
      <div className="mt-8 grid md:grid-cols-2 gap-8">
        <ImageSkeleton aspectRatio="1/1" className="rounded-lg h-[400px]" />
        <div className="space-y-4">
          <Skeleton height={32} width="80%" />
          <Skeleton height={24} width="40%" />
          <TextSkeleton lines={4} />
          <div className="mt-8">
            <Skeleton height={48} width="180px" rounded="md" />
          </div>
        </div>
      </div>
      <div className="mt-12">
        <Skeleton height={24} width="200px" className="mb-4" />
        <GridSkeleton items={4} columns={{ default: 1, sm: 2, md: 4 }} />
      </div>
    </div>
  );
}

/**
 * Content container with skeleton
 * Uses containment for better CLS optimization
 */
export function ContentSkeleton() {
  return (
    <div className="contain-layout overflow-hidden">
      <Skeleton height={240} width="100%" className="mb-8" />
      <TextSkeleton lines={8} />
    </div>
  );
} 