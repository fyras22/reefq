'use client';

import React, { useState, useEffect } from 'react';

interface ARTryOnProps {
  selectedMetal: 'gold' | 'silver' | 'platinum';
  selectedGem: 'diamond' | 'ruby' | 'sapphire' | 'emerald';
}

export default function ARTryOn({ selectedMetal, selectedGem }: ARTryOnProps) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if WebXR is supported
    const checkArSupport = async () => {
      try {
        setIsLoading(true);
        // Check if the browser supports WebXR with AR
        if ('xr' in navigator) {
          // @ts-ignore - TypeScript might not have the definition for this
          const isSupported = await navigator.xr?.isSessionSupported('immersive-ar');
          setIsSupported(isSupported || false);
        } else {
          setIsSupported(false);
        }
      } catch (error) {
        console.error('Error checking AR support:', error);
        setError('Failed to check AR support');
        setIsSupported(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkArSupport();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900">
            Checking AR capability...
          </div>
          <div className="mt-2 h-2 w-32 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-1/3 animate-pulse bg-amber-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center text-red-500">
          <div className="text-lg font-medium">Error</div>
          <div className="mt-1">{error}</div>
        </div>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="max-w-md rounded-lg bg-amber-50 p-6 text-center shadow-sm">
          <div className="text-lg font-medium text-amber-800">
            AR Not Supported
          </div>
          <p className="mt-2 text-amber-700">
            Your device does not support Augmented Reality. Please try using a
            compatible device with ARKit or ARCore support.
          </p>
          <div className="mt-4">
            <div className="inline-block rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700">
              Go back to 3D viewer
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Placeholder for actual AR implementation
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-lg font-semibold">
          AR Try-On Experience
        </div>
        <div className="mb-6 text-sm text-gray-600">
          Selected configuration: {selectedMetal} with {selectedGem}
        </div>
        <button
          className="rounded-lg bg-amber-600 px-6 py-3 text-white shadow-md hover:bg-amber-700"
          onClick={() => alert('AR would launch here in a fully implemented version')}
        >
          Launch AR Experience
        </button>
        <p className="mt-4 text-xs text-gray-500">
          Note: This is a placeholder. A complete implementation would use WebXR
          or a specialized AR framework to display your jewelry in AR.
        </p>
      </div>
    </div>
  );
} 