'use client';

import i18next from 'i18next';
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getOptions, languages } from './i18n-settings';
import React from 'react';

// Initialize i18next for client-side
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => 
    import(`../../public/locales/${language}/${namespace || 'common'}.json`)
  ))
  .init({
    ...getOptions(),
    preload: languages,
    ns: ['common', 'translation'],
    defaultNS: 'common',
    fallbackNS: 'translation',
    detection: {
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie', 'localStorage'],
      lookupCookie: 'NEXT_LOCALE'
    }
  });

export function useTranslation(lng?: string, ns: string | string[] = ['common', 'translation'], options = {}) {
  const currentLanguage = lng || i18next.language;
  
  // IMPORTANT: During initial hydration, always use the language specified in the props (lng)
  // This ensures the client renders the same content as the server
  const initialRender = React.useRef(true);
  
  React.useEffect(() => {
    // After hydration is complete (componentDidMount), we can change the language
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    
    // Only change language after the initial render to prevent hydration mismatch
    if (i18next.resolvedLanguage !== currentLanguage) {
      i18next.changeLanguage(currentLanguage);
    }
  }, [currentLanguage]);
  
  return useTranslationOrg(ns, options);
}

/**
 * Load translations for a specific language
 * @param lang - Language code to load
 * @returns Promise that resolves when translations are loaded
 */
export async function loadTranslations(lang: string) {
  if (!lang) return;
  
  try {
    // Ensure the language instance is initialized
    if (i18next.resolvedLanguage !== lang) {
      await i18next.changeLanguage(lang);
    }
    
    // Set document direction based on language
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = ['ar', 'he'].includes(lang) ? 'rtl' : 'ltr';
      
      // Add language-specific class to body
      document.body.className = document.body.className
        .replace(/lang-\w+/g, '')
        .trim();
      document.body.classList.add(`lang-${lang}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error loading translations:', error);
    return false;
  }
}

/**
 * Detect user's preferred language and set it
 * @returns Promise with the detected language
 */
export async function detectAndSetLanguage() {
  try {
    // Auto-detect language from browser
    const detectedLang = 
      window.navigator.language?.split('-')[0] || 
      document.documentElement.lang || 
      'en';
    
    // Check if detected language is supported, default to 'en' if not
    const lang = languages.includes(detectedLang) ? detectedLang : 'en';
    
    // Load translations and set language
    await loadTranslations(lang);
    
    return lang;
  } catch (error) {
    console.error('Error detecting language:', error);
    await loadTranslations('en');
    return 'en';
  }
}

export default i18next; 