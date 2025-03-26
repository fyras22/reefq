import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { InitOptions } from 'i18next';

const i18nOptions: InitOptions = {
  backend: {
    // Path to load translations from
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
  // Fallback language if translation not found
  fallbackLng: 'en',
  // Default namespace
  defaultNS: 'common',
  // Allow HTML in translations
  interpolation: {
    escapeValue: false,
  },
  // Use browser's language detection feature
  detection: {
    order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
    caches: ['cookie', 'localStorage'],
    // Using lookupCookie instead of cookieExpirationDate
    lookupCookie: 'i18next',
    cookieMinutes: 525600, // 1 year
  },
  react: {
    // Wait for translations to load before rendering
    useSuspense: true,
  },
  // Debug mode in development
  debug: process.env.NODE_ENV === 'development',
};

i18n
  // Load translations from backend
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init(i18nOptions);

// Function to set document direction based on language
export const setDirection = (dir: string) => {
  // Only execute in browser environment
  if (typeof document !== 'undefined') {
    document.documentElement.dir = dir;
    document.body.dir = dir;

    // Add RTL-specific class to body when in RTL mode
    if (dir === 'rtl') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }
};

// Set direction on language change - only in browser
if (typeof window !== 'undefined') {
  // Set initial direction based on loaded language
  i18n.on('languageChanged', (lng) => {
    const dir = lng === 'ar' ? 'rtl' : 'ltr';
    setDirection(dir);
  });

  // Set initial direction based on current language
  const currentLang = i18n.language || 'en';
  const initialDir = currentLang === 'ar' ? 'rtl' : 'ltr';
  setDirection(initialDir);
}

export default i18n;

// Helper function to dynamically set document direction based on language
export const setDocumentDirection = (language: string) => {
  if (typeof document !== 'undefined') {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Add language-specific class to body for CSS targeting
    document.body.className = document.body.className
      .replace(/lang-\w+/g, '')
      .trim();
    document.body.classList.add(`lang-${language}`);
  }
}; 