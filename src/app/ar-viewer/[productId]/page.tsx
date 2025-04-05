'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { SAMPLE_PRODUCT_ASSETS } from '@/lib/assets/MediaAssets';

interface ARViewerPageProps {
  params: {
    productId: string;
  };
  searchParams: {
    variant?: string;
  };
}

export default function ARViewerPage({ params, searchParams }: ARViewerPageProps) {
  const { productId } = params;
  const variant = searchParams.variant || 'default';
  
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'other'>('other');
  
  useEffect(() => {
    // Find the product
    const foundProduct = SAMPLE_PRODUCT_ASSETS.find(p => p.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
    }
    
    // Detect device
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setDeviceType('ios');
    } else if (/android/.test(userAgent)) {
      setDeviceType('android');
    } else {
      setDeviceType('other');
    }
    
    setIsLoading(false);
  }, [productId]);
  
  // If product not found
  if (!isLoading && !product) {
    return notFound();
  }
  
  // Redirect to AR experience based on device
  useEffect(() => {
    if (isLoading || !product) return;
    
    const variantData = product.variants[variant] || product.variants.default;
    
    if (deviceType === 'ios' && variantData?.models?.usdz) {
      // iOS AR QuickLook
      const modelUrl = `${window.location.origin}${variantData.models.usdz}`;
      window.location.href = `https://developer.apple.com/ar/quick-look-api/?url=${encodeURIComponent(modelUrl)}`;
    } else if (deviceType === 'android' && variantData?.models?.glb) {
      // Android Scene Viewer
      const modelUrl = `${window.location.origin}${variantData.models.glb}`;
      window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(modelUrl)}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(window.location.href)};end;`;
    }
  }, [product, deviceType, isLoading, variant]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-700">Loading AR Experience...</h1>
          <p className="text-gray-500 mt-2">Please wait while we prepare your AR view</p>
        </div>
      </div>
    );
  }
  
  // Fallback content for unsupported devices
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md bg-white rounded-lg shadow-xl p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
        <h2 className="text-xl text-gray-600 mb-4">AR Experience</h2>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 mb-4">
            Your device doesn't support AR viewing. Please use an iOS or Android device with AR capabilities.
          </p>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">iOS:</span>
              <span>iPhone/iPad with iOS 12+ (ARKit)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">Android:</span>
              <span>Android 8.0+ with ARCore support</span>
            </div>
          </div>
        </div>
        
        <a
          href="/demo/jewelry"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Return to Jewelry Gallery
        </a>
      </div>
    </div>
  );
} 