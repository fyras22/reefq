'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { JewelryType, ImageView } from '@/lib/assets/MediaAssets';
import { cn } from '@/lib/utils';

interface ProductInfo {
  name: string;
  type: JewelryType;
  images: {
    thumbnails: Partial<Record<ImageView, string>>;
    fullSize: Partial<Record<ImageView, string>>;
  };
  models: {
    web: string;
    ios: string;
  };
}

interface ProductGalleryProps {
  product: ProductInfo;
  showModelViewer?: boolean;
  className?: string;
}

export default function ProductGallery({
  product,
  showModelViewer = true,
  className
}: ProductGalleryProps) {
  const [selectedView, setSelectedView] = useState<ImageView>(
    Object.keys(product.images.fullSize)[0] as ImageView || ImageView.TOP
  );
  const [show3D, setShow3D] = useState(false);
  
  // Get the available views from the product
  const availableViews = Object.keys(product.images.fullSize) as ImageView[];
  
  // Image path to display
  const imagePath = product.images.fullSize[selectedView] || '/assets/images/placeholders/product.jpg';
  
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Main display area */}
      <div className="relative w-full aspect-square bg-white border rounded-lg overflow-hidden">
        {/* Loading state */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
          Loading product...
        </div>
        
        {/* Product image or 3D model */}
        {!show3D ? (
          <Image
            src={imagePath}
            alt={`${product.name} - ${selectedView} view`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 600px"
            priority
          />
        ) : (
          <div className="absolute inset-0">
            {/* Replace this with a proper 3D model viewer when available */}
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
              <div className="text-center p-4">
                <p className="text-sm font-medium">3D Model Viewer</p>
                <p className="text-xs text-gray-500 mt-1">
                  The 3D model for "{product.name}" would load here.
                </p>
                <p className="text-xs text-gray-500 mt-4">
                  Model path: {product.models.web}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Product name overlay */}
        <div className="absolute bottom-2 left-0 right-0 text-center text-gray-800 bg-white/80 py-1">
          {product.name}
        </div>
      </div>
      
      {/* Thumbnail navigation */}
      <div className="flex gap-2 w-full overflow-x-auto py-2">
        {availableViews.map((view) => (
          <button
            key={view}
            className={cn(
              "relative min-w-[60px] w-[60px] h-[60px] border-2 rounded-md overflow-hidden",
              selectedView === view ? "border-blue-600" : "border-gray-200"
            )}
            onClick={() => {
              setSelectedView(view);
              setShow3D(false);
            }}
          >
            <Image
              src={product.images.thumbnails[view] || product.images.fullSize[view] || '/assets/images/placeholders/thumbnail.jpg'}
              alt={`${product.name} - ${view} thumbnail`}
              fill
              className="object-cover"
              sizes="60px"
            />
          </button>
        ))}
        
        {/* 3D model button */}
        {showModelViewer && product.models.web && (
          <button
            className={cn(
              "relative min-w-[60px] w-[60px] h-[60px] border-2 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center",
              show3D ? "border-blue-600" : "border-gray-200"
            )}
            onClick={() => setShow3D(true)}
          >
            <span className="text-[10px] font-medium">3D View</span>
          </button>
        )}
      </div>
      
      {/* AR buttons */}
      {showModelViewer && (product.models.web || product.models.ios) && (
        <div className="flex gap-2 mt-2">
          {product.models.web && (
            <a
              href="#"
              className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md bg-white hover:bg-gray-50 text-sm"
              onClick={(e) => {
                e.preventDefault();
                setShow3D(true);
              }}
            >
              <span>View in 3D</span>
            </a>
          )}
          
          {product.models.ios && (
            <a
              href={product.models.ios}
              rel="ar"
              className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md bg-white hover:bg-gray-50 text-sm"
            >
              <span>View on iOS (AR)</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
} 