'use client';

import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Root provider component that wraps all other providers
 * This helps with organization and makes it easier to add new providers
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
    </>
  );
} 