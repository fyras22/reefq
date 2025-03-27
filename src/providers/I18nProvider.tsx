'use client';

import { I18nextProvider } from 'react-i18next';
import { ReactNode, useEffect } from 'react';
import i18n from '@/app/i18n';
import { Suspense } from 'react';
import { setDocumentDirection } from '@/app/i18n';

type I18nProviderProps = {
  children: ReactNode;
};

// Loading component while translations are being fetched
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal"></div>
  </div>
);

export const I18nProvider = ({ children }: I18nProviderProps) => {
  useEffect(() => {
    // Initialize i18n on client side
    if (typeof window !== 'undefined') {
      const cookieLang = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1];
      
      // Check if the saved language is supported, fallback to 'en' if not
      const supportedLanguages = ['en', 'fr', 'ar'];
      const language = cookieLang && supportedLanguages.includes(cookieLang) 
        ? cookieLang 
        : (navigator.language && supportedLanguages.includes(navigator.language.split('-')[0]))
          ? navigator.language.split('-')[0]
          : 'en';
      
      if (i18n.language !== language) {
        i18n.changeLanguage(language);
      }
      
      // Set document direction based on language
      setDocumentDirection(language);
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </I18nextProvider>
  );
}; 