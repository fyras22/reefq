import type { InitOptions } from 'i18next';

export const languages = ['en', 'fr', 'ar'];
export const defaultLanguage = 'en';

// Define common i18next options to use across server/client
export const getOptions = (): InitOptions => {
  return {
    // List of supported languages
    supportedLngs: languages,
    // Default language
    fallbackLng: defaultLanguage,
    // Default namespace
    defaultNS: 'common',
    // Fallback namespace
    fallbackNS: 'translation',
    // Disable suspense mode in server components
    react: { 
      useSuspense: typeof window !== 'undefined'
    },
    // Prevent using keys as fallback values
    returnNull: false,
    returnEmptyString: false,
    // Default namespace
    ns: ['common', 'translation'],
    // For HTML markup in translations
    interpolation: {
      escapeValue: false,
    },
    // Debug mode in development
    debug: process.env.NODE_ENV === 'development',
  };
};

export const getLanguageDirection = (lng: string): 'ltr' | 'rtl' => {
  return lng === 'ar' ? 'rtl' : 'ltr';
};

// Function to detect the users preferred language from headers or cookies
export const getLanguage = (acceptLanguage?: string, cookieValue?: string) => {
  // Check if language is stored in cookie - this has highest priority 
  // to ensure consistent rendering between server and client
  if (cookieValue && languages.includes(cookieValue)) {
    return cookieValue;
  }
  
  // Check browser Accept-Language header
  if (acceptLanguage) {
    // Extract first language from Accept-Language e.g. "en-US,en;q=0.9,fr;q=0.8"
    const headerLanguages = acceptLanguage.split(',');
    for (const headerLang of headerLanguages) {
      const langCode = headerLang.split(';')[0].split('-')[0].trim();
      if (languages.includes(langCode)) {
        return langCode;
      }
    }
  }
  
  // Default to English if no matches found
  return defaultLanguage;
}; 