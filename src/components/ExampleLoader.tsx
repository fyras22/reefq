'use client';

import { useState } from 'react';
import { useLoading } from '@/providers/LoadingProvider';
import { Button } from '@/components/ui/Button';

export function ExampleLoader() {
  const { showLoader, hideLoader } = useLoading();
  
  const handleShowDefaultLoader = () => {
    showLoader({ duration: 3000 });
    // The loader will automatically hide after the duration
  };
  
  const handleShowLargeLoader = () => {
    showLoader({ 
      duration: 5000,
      size: 'large' 
    });
    // The loader will automatically hide after the duration
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Global Loader Demo</h2>
      
      <div className="space-y-4">
        <div>
          <Button 
            onClick={handleShowDefaultLoader}
            className="w-full bg-nile-teal text-white hover:bg-nile-teal/90"
          >
            Show Default Loader (3s)
          </Button>
        </div>
        
        <div>
          <Button 
            onClick={handleShowLargeLoader}
            className="w-full bg-pharaonic-gold text-white hover:bg-pharaonic-gold/90"
          >
            Show Large Loader with Tagline (5s)
          </Button>
        </div>
      </div>
    </div>
  );
} 