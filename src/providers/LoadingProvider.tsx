'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import CircleLoader from '@/components/ui/CircleLoader';

interface LoadingContextType {
  showLoader: (options?: ShowLoaderOptions) => void;
  hideLoader: () => void;
  isLoading: boolean;
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
  const [options, setOptions] = useState<ShowLoaderOptions>({
    duration: 3000,
    size: 'default',
  });

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
    <LoadingContext.Provider value={{ showLoader, hideLoader, isLoading }}>
      {children}
      {isLoading && (
        <CircleLoader 
          onLoadingComplete={handleLoadingComplete} 
          duration={options.duration}
          size={options.size}
        />
      )}
    </LoadingContext.Provider>
  );
} 