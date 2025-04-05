'use client';

import React, { Suspense, lazy } from 'react';
import { Skeleton } from './ui/Skeleton';

// Lazy load the EnhancedJewelryViewer component
const EnhancedJewelryViewer = lazy(() => 
  import('@/components/EnhancedJewelryViewer').then(mod => ({
    default: mod.default || mod
  }))
);

// Define props interface to match EnhancedJewelryViewer props
export interface StreamableJewelryViewerProps {
  modelPath: string;
  selectedMetal?: 'gold' | 'silver' | 'platinum' | 'rosegold' | 'whitegold';
  selectedGem?: 'diamond' | 'ruby' | 'sapphire' | 'emerald' | 'amethyst' | 'topaz' | 'pearl';
  size?: number;
  quality?: 'low' | 'medium' | 'high' | 'ultra' | 'auto';
  environmentPreset?: 'jewelry_store' | 'outdoor' | 'studio' | 'evening';
  showControls?: boolean;
  autoRotate?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
  className?: string;
  initialRotation?: [number, number, number];
  onLoad?: () => void;
  onError?: (error: Error) => void;
  priority?: boolean;
  height?: number;
  enableBloom?: boolean;
  enableShadows?: boolean;
  showPerformanceMetrics?: boolean;
}

/**
 * StreamableJewelryViewer - A wrapper component that uses React.Suspense for streaming
 * and code splitting to improve performance metrics like LCP and CLS
 */
export default function StreamableJewelryViewer(props: StreamableJewelryViewerProps) {
  const {
    environmentPreset = 'studio',
    selectedMetal = 'gold',
    height = 400,
    ...otherProps
  } = props;
  
  return (
    <div className="relative w-full h-full">
      <Suspense 
        fallback={
          <JewelryViewerSkeleton 
            className={props.className} 
            priority={props.priority}
            height={height}
          />
        }
      >
        <EnhancedJewelryViewer 
          environmentPreset={environmentPreset}
          selectedMetal={selectedMetal}
          height={height}
          {...otherProps} 
        />
      </Suspense>
    </div>
  );
}

// Skeleton component with size placeholders to prevent layout shift
function JewelryViewerSkeleton({ 
  className = 'w-full', 
  priority = false,
  height = 400
}: { 
  className?: string;
  priority?: boolean;
  height?: number;
}) {
  return (
    <div 
      className={`relative ${className} bg-gray-100 rounded-lg overflow-hidden`}
      style={{ height: `${height}px` }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton 
            className="w-12 h-12 rounded-full" 
            priority={priority}
          />
          <div className="text-center">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-3 w-24 mx-auto mt-2" />
          </div>
        </div>
      </div>
      
      {/* Add low-poly placeholder shape that approximates a jewelry item */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3">
        <div className="w-full h-full rounded-full border-4 border-gray-200 opacity-30" />
      </div>
    </div>
  );
} 