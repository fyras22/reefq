'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

// Map language codes to their flag images
const languageFlags: Record<string, string> = {
  en: '/flags/us.svg',
  fr: '/flags/fr.svg',
  ar: '/flags/ar.svg',
};

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentLanguage = i18n.language.substring(0, 2);
  const isRTL = currentLanguage === 'ar';

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'ar', label: 'العربية' },
  ];

  const handleLanguageChange = (language: string) => {
    const newPathname = pathname.replace(/\/(en|fr|ar)/, `/${language}`);
    router.push(newPathname);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-nile-teal ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="relative w-5 h-4 overflow-hidden">
          <Image
            src={languageFlags[currentLanguage]}
            alt={`${currentLanguage} flag`}
            fill
            className="object-cover"
          />
        </div>
        <span className="text-sm font-medium">
          {languageOptions.find((lang) => lang.value === currentLanguage)?.label}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
              isRTL ? 'right-0' : 'left-0'
            }`}
            role="listbox"
          >
            <div className="py-1">
              {languageOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleLanguageChange(option.value)}
                  className={`${
                    currentLanguage === option.value
                      ? 'bg-nile-teal text-white'
                      : 'text-gray-900 hover:bg-gray-100'
                  } ${
                    isRTL ? 'text-right flex-row-reverse' : 'text-left'
                  } flex items-center w-full px-4 py-2 text-sm cursor-pointer`}
                  role="option"
                  aria-selected={currentLanguage === option.value}
                >
                  <div className="relative w-5 h-4 overflow-hidden mr-2">
                    <Image
                      src={languageFlags[option.value]}
                      alt={`${option.value} flag`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className={isRTL && currentLanguage !== option.value ? 'mr-2' : ''}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 