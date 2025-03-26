'use client';

import { useEffect } from 'react';
import { useTranslation as useTranslationClient } from './i18n-client';
import { getTranslation as getTranslationServer } from './i18n-server';
import i18next from './i18n-client';
import { getLanguageDirection } from './i18n-settings';

// SSR-safe function to set document direction
export const setDocumentDirection = (language: string) => {
  if (typeof document !== 'undefined') {
    const dir = getLanguageDirection(language);
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    
    // Add language-specific class to body for CSS targeting
    document.body.className = document.body.className
      .replace(/lang-\w+/g, '')
      .trim();
    document.body.classList.add(`lang-${language}`);
  }
};

// Client-side language change handler
export const onLanguageChange = (language: string) => {
  if (typeof window !== 'undefined') {
    i18next.changeLanguage(language);
    setDocumentDirection(language);
    
    // Store language preference in cookie for later visits
    document.cookie = `NEXT_LOCALE=${language}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }
};

// Client-side translation hook
export function useTranslation(ns: string = 'common') {
  const { t, i18n } = useTranslationClient(undefined, ns);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && i18n.language) {
      setDocumentDirection(i18n.language);
    }
  }, [i18n.language]);
  
  return { t, i18n };
}

// Server-side translation function
export async function getServerTranslation(locale: string, ns: string = 'common') {
  return getTranslationServer(locale, ns);
}

export default i18next; 