'use client';

import { Environment, EnvironmentProps } from '@react-three/drei';
import { useEffect, useState } from 'react';

interface CustomEnvironmentProps extends Omit<EnvironmentProps, 'files'> {
  preset?: 'apartment' | 'city' | 'dawn' | 'forest' | 'lobby' | 'night' | 'park' | 'studio' | 'sunset' | 'warehouse';
}

export function CustomEnvironment({ 
  preset = 'studio',
  background = false,
  ...props 
}: CustomEnvironmentProps) {
  const [isClient, setIsClient] = useState(false);
  
  // This ensures the component only renders on client-side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return null;
  }
  
  return (
    <Environment
      preset={preset}
      background={background}
      {...props}
    />
  );
} 