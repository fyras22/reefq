'use client';

import { useState, useEffect } from 'react';
import Loader from '@/components/ui/Loader';
import dynamic from 'next/dynamic';

// Import the main page component
const LandingPage = dynamic(() => import('./landing-page'), { ssr: false });

export default function Home() {
  const [loading, setLoading] = useState(true);
  
  // Force a minimum load time for the loader
  useEffect(() => {
    return () => {
      // Cleanup
    };
  }, []);
  
  return (
    <>
      <Loader onLoadingComplete={() => setLoading(false)} />
      {!loading && <LandingPage />}
    </>
  );
} 