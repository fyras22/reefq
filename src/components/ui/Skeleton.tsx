'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether this skeleton should be loaded with priority
   */
  priority?: boolean;
}

/**
 * Skeleton component for loading states
 * Uses animation for a pulse effect to indicate loading
 */
export function Skeleton({
  className,
  priority = false,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gray-200 animate-pulse rounded overflow-hidden relative', 
        className
      )}
      aria-busy="true"
      aria-live={priority ? "polite" : "off"}
      data-priority={priority}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
    </div>
  );
} 