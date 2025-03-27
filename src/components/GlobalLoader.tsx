'use client';

import { useState, useEffect } from 'react';
import CircleLoader from '@/components/ui/CircleLoader';

export default function GlobalLoader() {
  const [loading, setLoading] = useState(true);

  // Force a minimum load time for the loader (3 seconds)
  useEffect(() => {
    // This will handle the clean loading experience site-wide
    const handleLoadComplete = () => {
      setLoading(false);
    };
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  if (!loading) return null;
  
  return (
    <CircleLoader 
      onLoadingComplete={() => setLoading(false)} 
      duration={3000} 
      size="large"
    />
  );
} 