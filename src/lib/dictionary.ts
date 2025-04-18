import { defaultLanguage } from '@/app/i18n-settings';

// Dictionary type definition with nested structure
export type Dictionary = {
  common: {
    title: string;
    description: string;
    button: {
      learn_more: string;
      get_started: string;
      try_now: string;
      sign_up: string;
      sign_in: string;
      contact: string;
    };
    nav: {
      home: string;
      features: string;
      pricing: string;
      dashboard: string;
      about: string;
      contact: string;
    };
  };
  customize: {
    title: string;
    description: string;
  };
  language: {
    english: string;
    french: string;
    arabic: string;
  };
};

// Cache dictionaries to avoid unnecessary imports
const dictionaries = new Map<string, Promise<Dictionary>>();

export const getDictionary = async (locale: string = defaultLanguage): Promise<Dictionary> => {
  // Use the provided locale or fall back to default
  const actualLocale = locale || defaultLanguage;
  
  // Return cached dictionary if available
  if (dictionaries.has(actualLocale)) {
    return dictionaries.get(actualLocale) as Promise<Dictionary>;
  }
  
  // Import dictionary dynamically based on locale
  const dictionaryPromise = import(`../../public/locales/${actualLocale}/translation.json`)
    .then(module => module.default)
    .catch(() => {
      console.error(`Failed to load dictionary for locale: ${actualLocale}`);
      // Fallback to English if the requested locale is not found
      return import(`../../public/locales/en/translation.json`).then(module => module.default);
    });
  
  // Cache the dictionary promise
  dictionaries.set(actualLocale, dictionaryPromise);
  
  return dictionaryPromise;
}; 