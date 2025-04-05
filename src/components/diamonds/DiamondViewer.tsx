'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DiamondCut, ImageView, diamondAssets } from '@/lib/assets/MediaAssets';
import { cn } from '@/lib/utils';

interface DiamondViewerProps {
  initialCut?: DiamondCut;
  showControls?: boolean;
  className?: string;
}

export default function DiamondViewer({
  initialCut = DiamondCut.ROUND,
  showControls = true,
  className
}: DiamondViewerProps) {
  const [selectedCut, setSelectedCut] = useState<DiamondCut>(initialCut);
  const [selectedView, setSelectedView] = useState<ImageView>(ImageView.TOP);
  
  // Get the asset for the selected cut
  const diamondAsset = diamondAssets[selectedCut];
  
  // Check if the selected view is available
  const hasSelectedView = diamondAsset?.images[selectedView];
  
  // Fallback to available view if selected view isn't available
  const actualView = hasSelectedView ? selectedView : 
    (diamondAsset?.images[ImageView.TOP] ? ImageView.TOP : 
     (diamondAsset?.images[ImageView.ANGLE] ? ImageView.ANGLE : ImageView.SIDE));
  
  // Image path to display
  const imagePath = diamondAsset?.images[actualView] || '/assets/images/placeholders/diamond.png';
  
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative w-full max-w-md aspect-square bg-black rounded-lg overflow-hidden">
        {/* Add a placeholder div for when image is loading */}
        <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
          Loading diamond...
        </div>
        
        {/* Diamond image */}
        <Image
          src={imagePath}
          alt={`${selectedCut} diamond - ${actualView} view`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 500px"
          priority
        />
        
        {/* Diamond cut name overlay */}
        <div className="absolute bottom-2 left-0 right-0 text-center text-white bg-black/50 py-1">
          {selectedCut.charAt(0).toUpperCase() + selectedCut.slice(1)} Cut Diamond
        </div>
      </div>
      
      {showControls && (
        <div className="w-full max-w-md">
          {/* Cut selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Diamond Cut</label>
            <div className="grid grid-cols-5 gap-2">
              {Object.values(DiamondCut).map((cut) => (
                <button
                  key={cut}
                  className={cn(
                    "p-2 text-xs border rounded-md transition-colors",
                    selectedCut === cut 
                      ? "bg-blue-600 text-white border-blue-700" 
                      : "bg-white hover:bg-blue-50"
                  )}
                  onClick={() => setSelectedCut(cut)}
                >
                  {cut.charAt(0).toUpperCase() + cut.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* View selector */}
          <div>
            <label className="block text-sm font-medium mb-2">View Angle</label>
            <div className="flex space-x-2">
              {[ImageView.TOP, ImageView.ANGLE, ImageView.SIDE].map((view) => {
                const isAvailable = diamondAsset?.images[view];
                return (
                  <button
                    key={view}
                    className={cn(
                      "px-4 py-2 border rounded-md transition-colors",
                      selectedView === view
                        ? "bg-blue-600 text-white border-blue-700"
                        : isAvailable
                        ? "bg-white hover:bg-blue-50"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                    onClick={() => isAvailable && setSelectedView(view)}
                    disabled={!isAvailable}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 