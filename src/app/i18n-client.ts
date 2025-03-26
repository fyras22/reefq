'use client';

import i18next from 'i18next';
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getOptions, languages } from './i18n-settings';

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
  
  if (i18next.resolvedLanguage !== currentLanguage) {
    i18next.changeLanguage(currentLanguage);
  }
  
  return useTranslationOrg(ns, options);
}

export default i18next; 