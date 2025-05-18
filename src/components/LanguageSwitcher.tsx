"use client";

import { onLanguageChange, useTranslation } from "@/app/i18n";
import { languages } from "@/app/i18n-settings";
import { useTheme } from "@/providers/ThemeProvider";
import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [currentLang, setCurrentLang] = useState(() => {
    if (typeof window !== "undefined") {
      // Get language from cookie or navigator
      const cookieLang = document.cookie
        .split("; ")
        .find((row) => row.startsWith("NEXT_LOCALE="))
        ?.split("=")[1];

      return cookieLang || navigator.language.split("-")[0] || "en";
    }
    return "en";
  });

  // Set the initial direction based on the current language
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = currentLang;
    }
  }, [currentLang]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const changeLanguage = (lang: string) => {
    setCurrentLang(lang);
    onLanguageChange(lang);
    setIsOpen(false);
  };

  const getLanguageFlag = (code: string) => {
    switch (code) {
      case "en":
        return "🇺🇸";
      case "fr":
        return "🇫🇷";
      case "ar":
        return "🇹🇳";
      default:
        return code;
    }
  };

  const getLanguageLabel = (code: string) => {
    switch (code) {
      case "en":
        return "English";
      case "fr":
        return "Français";
      case "ar":
        return "العربية";
      default:
        return code;
    }
  };

  const isRTL = currentLang === "ar";

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium ${
          isDark
            ? "text-white bg-neutral-800 hover:bg-neutral-700"
            : "text-gray-700 bg-white hover:bg-gray-50"
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-teal ${isRTL ? "flex-row-reverse" : ""}`}
        onClick={toggleDropdown}
      >
        <span className={`${isRTL ? "ml-2" : "mr-2"} text-base`}>
          {getLanguageFlag(currentLang)}
        </span>
        {getLanguageLabel(currentLang)}
        <svg
          className={`h-5 w-5 ${isRTL ? "mr-2" : "ml-2"}`}
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

      {isOpen && (
        <div
          className={`origin-top-right absolute mt-2 w-48 rounded-md shadow-lg ${isDark ? "bg-neutral-800" : "bg-white"} ring-1 ring-black ring-opacity-5 z-50 ${isRTL ? "right-0" : "left-0"}`}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`
                  flex items-center w-full px-4 py-3 text-sm hover:bg-nile-teal/10
                  ${isRTL ? "text-right justify-end" : "text-left"}
                  ${
                    currentLang === lang
                      ? isDark
                        ? "bg-nile-teal/20 font-medium text-white border-l-4 border-nile-teal"
                        : "bg-nile-teal/10 font-medium text-gray-900 border-l-4 border-nile-teal"
                      : isDark
                        ? "text-gray-200"
                        : "text-gray-700"
                  }
                `}
                role="menuitem"
              >
                <span className={`${isRTL ? "ml-3" : "mr-3"} text-lg`}>
                  {getLanguageFlag(lang)}
                </span>
                {getLanguageLabel(lang)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
