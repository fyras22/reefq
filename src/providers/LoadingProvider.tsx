'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import CircleLoader from '@/components/ui/CircleLoader';

interface LoadingContextType {
  showLoader: (options?: ShowLoaderOptions) => void;
  hideLoader: () => void;
  isLoading: boolean;
  pageLoading: boolean;
}

interface ShowLoaderOptions {
  duration?: number;
  size?: 'default' | 'large';
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [options, setOptions] = useState<ShowLoaderOptions>({
    duration: 3000,
    size: 'default',
  });

  // Initial page load animation
  useEffect(() => {
    // Show global loader for initial page load
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const showLoader = (newOptions?: ShowLoaderOptions) => {
    if (newOptions) {
      setOptions({ ...options, ...newOptions });
    }
    setIsLoading(true);
  };

  const hideLoader = () => {
    setIsLoading(false);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ showLoader, hideLoader, isLoading, pageLoading }}>
      {children}
      {/* Global page loader */}
      {pageLoading && (
        <CircleLoader 
          onLoadingComplete={() => setPageLoading(false)} 
          duration={3000}
          size="large"
        />
      )}
      {/* Dynamic loader for on-demand operations */}
      {!pageLoading && isLoading && (
        <CircleLoader 
          onLoadingComplete={handleLoadingComplete} 
          duration={options.duration}
          size={options.size}
        />
      )}
    </LoadingContext.Provider>
  );
} 