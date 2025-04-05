'use client';

import { useEffect } from 'react';
import { useTranslation as useTranslationClient } from './i18n-client';
import { getTranslation as getTranslationServer } from './i18n-server';
import i18next from './i18n-client';
import { getLanguageDirection } from './i18n-settings';
import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { getOptions, languages, defaultLanguage } from './i18n-settings';
import Cookies from 'js-cookie';
import { Locale } from './i18n-settings';

// SSR-safe function to set document direction
export const setDocumentDirection = (language: string) => {
  if (typeof document !== 'undefined') {
    document.documentElement.dir = getLanguageDirection(language);
    document.documentElement.lang = language;
    
    // Add language-specific class to body for CSS targeting
    document.body.className = document.body.className
      .replace(/lang-\w+/g, '')
      .trim();
    document.body.classList.add(`lang-${language}`);
  }
};

// Initialize i18next for the server
const initI18next = async (lng: string, ns?: string | string[]) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../../public/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      ...getOptions(),
      lng,
      ns
    });

  return i18nInstance;
};

// Function to use inside client components
export async function useTranslation(
  lng: string = defaultLanguage,
  ns?: string | string[],
  options: { keyPrefix?: string } = {}
) {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
    i18n: i18nextInstance
  };
}

// Client-side language change handler
export const onLanguageChange = (language: string) => {
  if (typeof window !== 'undefined') {
    i18next.changeLanguage(language);
    setDocumentDirection(language);
    
    // Store language preference in cookie for later visits
    document.cookie = `NEXT_LOCALE=${language}; path=/; max-age=${60 * 60 * 24 * 365}`;
    
    // Navigate to the appropriate language route
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/');
    
    // Check if the current path already has a language prefix
    if (['en', 'fr', 'ar'].includes(pathParts[1])) {
      // Replace the current language with the new one
      pathParts[1] = language;
      window.location.href = pathParts.join('/');
    } else {
      // If no language in path, prepend the new language
      window.location.href = `/${language}${currentPath}`;
    }
  }
};

// Server-side translation function
export async function getServerTranslation(locale: string, ns: string = 'common') {
  return getTranslationServer(locale, ns);
}

// Export the LanguageSwitcher component
export { LanguageSwitcher } from '../components/LanguageSwitcher';

export default i18next; 