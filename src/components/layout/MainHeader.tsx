'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dialog } from '@headlessui/react';
import { 
  Bars3Icon,
  XMarkIcon,
  ShoppingBagIcon,
  UserIcon,
  GlobeAltIcon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline';

// Define the types for our navigation items
export interface NavigationItem {
  name: string;
  href: string;
  highlight?: boolean;
  icon?: React.ReactNode;
}

interface MainHeaderProps {
  navigation: NavigationItem[];
  currentLang?: string;
  isRTL?: boolean;
  onLanguageChange?: (lang: string) => void;
  supportedLanguages?: { code: string; name: string }[];
}

export default function MainHeader({
  navigation,
  currentLang = 'en',
  isRTL = false,
  onLanguageChange,
  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' }
  ]
}: MainHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // Add scroll listener to change header appearance when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle clicking outside the language dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLanguageDropdown && !(event.target as Element).closest('.language-dropdown-container')) {
        setShowLanguageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguageDropdown]);

  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
  };

  const handleLanguageSelect = (lang: string) => {
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
    setShowLanguageDropdown(false);
  };

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-md shadow-sm py-4'
    }`}>
      <nav className={`flex items-center justify-between px-4 lg:px-8 ${isRTL ? 'flex-row-reverse' : ''}`} aria-label="Global">
        {/* Logo */}
        <div className={`flex lg:flex-1 ${isRTL ? 'lg:justify-end' : ''}`}>
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <RectangleGroupIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-gray-900">Reefq</span>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className={`flex lg:hidden ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        {/* Desktop navigation */}
        <div className={`hidden lg:flex lg:gap-x-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-semibold leading-6 ${
                item.highlight 
                  ? 'text-primary hover:text-primary/90 flex items-center gap-1' 
                  : 'text-gray-900 hover:text-primary'
              } ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
        
        {/* Right side actions */}
        <div className={`hidden lg:flex lg:flex-1 ${isRTL ? 'lg:justify-start' : 'lg:justify-end'} lg:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Link 
            href="/login" 
            className={`text-sm font-semibold leading-6 text-gray-900 hover:text-primary flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <UserIcon className="h-5 w-5" />
            <span>Log in</span>
          </Link>
          <Link 
            href="/cart" 
            className={`text-sm font-semibold leading-6 text-gray-900 hover:text-primary flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ShoppingBagIcon className="h-5 w-5" />
            <span>Cart</span>
          </Link>
          
          {/* Language dropdown */}
          <div className="language-dropdown-container relative">
            <button
              onClick={toggleLanguageDropdown}
              className={`text-sm font-semibold leading-6 text-gray-900 hover:text-primary flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <GlobeAltIcon className="h-5 w-5" />
              <span>{currentLang.toUpperCase()}</span>
            </button>
            
            {showLanguageDropdown && (
              <div className={`absolute mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 ${isRTL ? 'right-0' : 'left-0'}`}>
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {supportedLanguages.map(lang => (
                    <a
                      key={lang.code}
                      href={`/${lang.code}`}
                      className={`${currentLang === lang.code ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} 
                                  block w-full ${isRTL ? 'text-right pr-4' : 'text-left pl-4'} 
                                  py-2 text-sm hover:bg-gray-100`}
                      role="menuitem"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLanguageSelect(lang.code);
                      }}
                    >
                      {lang.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10`}>
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <RectangleGroupIcon className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold text-gray-900">Reefq</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                      item.highlight 
                        ? 'text-primary hover:bg-gray-50 flex items-center' 
                        : 'text-gray-900 hover:bg-gray-50'
                    } ${isRTL ? 'flex-row-reverse' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon && <span className={`${isRTL ? 'ml-2' : 'mr-2'}`}>{item.icon}</span>}
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  href="/login"
                  className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserIcon className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  Log in
                </Link>
                <Link
                  href="/cart"
                  className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingBagIcon className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  Cart
                </Link>
                
                {/* Language options */}
                <div className="mt-2 space-y-1">
                  <p className={`-mx-3 px-3 pt-2 text-sm font-medium text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                    Language
                  </p>
                  {supportedLanguages.map(lang => (
                    <a
                      key={lang.code}
                      href={`/${lang.code}`}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 
                        ${currentLang === lang.code ? 'bg-gray-50 text-primary' : 'text-gray-900'} 
                        hover:bg-gray-50 ${isRTL ? 'text-right' : 'text-left'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLanguageSelect(lang.code);
                        setMobileMenuOpen(false);
                      }}
                    >
                      {lang.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
} 