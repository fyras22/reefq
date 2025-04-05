'use client';

import { ReactNode, useEffect } from 'react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  return (
    <>
      {children}
    </>
  );
} 