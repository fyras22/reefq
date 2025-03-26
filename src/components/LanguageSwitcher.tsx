'use client';

import { useState, useEffect } from 'react';
import { languages } from '@/app/i18n-settings';
import { onLanguageChange } from '@/app/i18n';
import { useTranslation } from '@/app/i18n';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(() => {
    if (typeof window !== 'undefined') {
      // Get language from cookie or navigator
      const cookieLang = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1];
      
      return cookieLang || navigator.language.split('-')[0] || 'en';
    }
    return 'en';
  });

  // Set the initial direction based on the current language
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = currentLang;
    }
  }, [currentLang]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const changeLanguage = (lang: string) => {
    setCurrentLang(lang);
    onLanguageChange(lang);
    setIsOpen(false);
  };
  
  const getLanguageLabel = (code: string) => {
    switch (code) {
      case 'en': return 'English';
      case 'fr': return 'Français';
      case 'ar': return 'العربية';
      default: return code;
    }
  };

  const isRTL = currentLang === 'ar';

  return (
    <div className="relative inline-block text-left">
      <button 
        type="button"
        className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal ${isRTL ? 'flex-row-reverse' : ''}`}
        onClick={toggleDropdown}
      >
        {getLanguageLabel(currentLang)}
        <svg className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className={`origin-top-right absolute mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 ${isRTL ? 'right-0' : 'left-0'}`}>
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`${
                  currentLang === lang ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } block w-full ${isRTL ? 'text-right pr-4' : 'text-left pl-4'} py-2 text-sm hover:bg-gray-100`}
                role="menuitem"
              >
                {getLanguageLabel(lang)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 