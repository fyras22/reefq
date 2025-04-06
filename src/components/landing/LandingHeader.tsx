'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/LanguageSwitcher'; // Assuming LanguageSwitcher exists
import { TFunction } from 'i18next'; // Import TFunction type

// Helper function for smooth scrolling
const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  e.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    const headerOffset = 80; // Account for header height
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

interface LandingHeaderProps {
  t: TFunction; // Pass translation function as prop
  isRTL: boolean;
  scrolled: boolean;
}

export function LandingHeader({ t, isRTL, scrolled }: LandingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProductsMenu, setShowProductsMenu] = useState(false);
  const productsMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  // Close products menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productsMenuRef.current && !productsMenuRef.current.contains(event.target as Node)) {
        setShowProductsMenu(false);
      }
    };

    if (showProductsMenu) {
        document.addEventListener('mousedown', handleClickOutside);
    } else {
        document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProductsMenu]); // Dependency: only run when showProductsMenu changes

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        // Check if the click is outside the menu AND outside the button that opens it
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) &&
            mobileMenuButtonRef.current && !mobileMenuButtonRef.current.contains(event.target as Node)) {
                setMobileMenuOpen(false);
        }
    };

    if (mobileMenuOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    } else {
        document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]); // Dependency: only run when mobileMenuOpen changes

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full full-width ${
      scrolled || mobileMenuOpen
        ? 'bg-white/95 backdrop-blur-sm shadow-md py-2'
        : 'bg-transparent py-4'
    }`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className={`flex items-center justify-between w-full`}>
          {/* Logo - Left in LTR, Right in RTL */}
          <div className={`flex lg:flex-1 logo-container ${isRTL ? 'order-3' : 'order-1'}`}>
            <a href="#" className={`${isRTL ? 'ml-0 mr-4' : 'mr-4 ml-0'} relative flex items-center h-12`}> {/* Adjusted height */}
              <Image
                src="/logo.png"
                alt={t('logoAlt', 'ReefQ Logo')} // Added default value
                width={160} // Adjusted width slightly
                height={48}  // Matched height of parent
                className="w-auto h-full object-contain" // Use object-contain
                priority
              />
            </a>
          </div>

          {/* Desktop Navigation - Always in the middle - IMPROVED VERSION */}
          <div className="hidden lg:flex lg:gap-x-8 desktop-nav order-2">
            {/* Main section links */}
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-pharaonic-gold' : 'text-gray-800 hover:text-pharaonic-gold'}`}>
              {t('header.features')}
            </a>
            <a href="#try-on" onClick={(e) => scrollToSection(e, 'try-on')} className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-pharaonic-gold' : 'text-gray-800 hover:text-pharaonic-gold'}`}>
              {t('header.tryOn')}
            </a>
            <a href="#customize" onClick={(e) => scrollToSection(e, 'customize')} className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-pharaonic-gold' : 'text-gray-800 hover:text-pharaonic-gold'}`}>
              {t('header.customize')}
            </a>
            <a href="#performance" onClick={(e) => scrollToSection(e, 'performance')} className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-pharaonic-gold' : 'text-gray-800 hover:text-pharaonic-gold'}`}>
              {t('header.performance')}
            </a>
            <a href="#comparison" onClick={(e) => scrollToSection(e, 'comparison')} className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-pharaonic-gold' : 'text-gray-800 hover:text-pharaonic-gold'}`}>
              {t('header.compare')}
            </a>
            <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-pharaonic-gold' : 'text-gray-800 hover:text-pharaonic-gold'}`}>
              {t('header.pricing')}
            </a>

            {/* Products dropdown */}
            <div className="relative" ref={productsMenuRef}>
              <button
                className={`flex items-center font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-pharaonic-gold' : 'text-gray-800 hover:text-pharaonic-gold'} ${isRTL ? 'flex-row-reverse' : ''}`}
                onClick={() => setShowProductsMenu(!showProductsMenu)}
              >
                {t('header.products')}
                <ChevronDownIcon className={`${isRTL ? 'ml-0 mr-1' : 'mr-0 ml-1'} h-4 w-4 transition-transform ${showProductsMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Products dropdown menu */}
              {showProductsMenu && (
                <div className={`absolute ${isRTL ? 'right-0' : 'left-0'} mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50`}>
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link href="/jewelry"
                      className={`block px-4 py-2 text-sm ${isRTL ? 'text-right' : 'text-left'} text-gray-700 hover:bg-nile-teal/10 hover:text-nile-teal`}
                      onClick={() => setShowProductsMenu(false)}
                    >
                      {t('header.jewelryCollection')}
                    </Link>
                    <Link href="/try-and-fit"
                      className={`block px-4 py-2 text-sm ${isRTL ? 'text-right' : 'text-left'} text-gray-700 hover:bg-nile-teal/10 hover:text-nile-teal`}
                      onClick={() => setShowProductsMenu(false)}
                    >
                      {t('header.virtualTryOn')}
                    </Link>
                    <Link href="/customize"
                      className={`block px-4 py-2 text-sm ${isRTL ? 'text-right' : 'text-left'} text-gray-700 hover:bg-nile-teal/10 hover:text-nile-teal`}
                      onClick={() => setShowProductsMenu(false)}
                    >
                      {t('header.customizeJewelry')}
                    </Link>
                    <Link href="/knowledge"
                      className={`block px-4 py-2 text-sm ${isRTL ? 'text-right' : 'text-left'} text-gray-700 hover:bg-nile-teal/10 hover:text-nile-teal`}
                      onClick={() => setShowProductsMenu(false)}
                    >
                      {t('header.knowledgeHub')}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/demo" className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-pharaonic-gold' : 'text-gray-800 hover:text-pharaonic-gold'}`}>
              {t('header.demo')}
            </Link>
          </div>

          {/* Language Switcher and CTA Button - Right in LTR, Left in RTL */}
          <div className={`hidden lg:flex lg:flex-1 lg:justify-end gap-4 items-center ${isRTL ? 'order-1' : 'order-3'}`}>
            <LanguageSwitcher />
            <a
              href="/auth/login"
              className={`inline-flex items-center justify-center rounded-md bg-nile-teal px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-nile-teal focus:ring-offset-2`}
            >
              {t('header.getStarted')}
            </a>
          </div>

          {/* Mobile menu button - Right in LTR, Left in RTL */}
          <div className={`flex lg:hidden ${isRTL ? 'order-1' : 'order-3'}`}>
            <button
              ref={mobileMenuButtonRef} // Attach ref here
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2.5 text-nile-teal hover:bg-nile-teal/10 transition-colors mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="h-7 w-7" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-7 w-7" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef} // Attach ref here
            className="lg:hidden mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Use absolute positioning relative to header, adjust styling */}
            <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-full mt-1 w-64 max-w-xs bg-white shadow-xl rounded-b-xl border border-gray-100 z-50`} /* Adjusted positioning */>
              <div className="space-y-2 px-4 py-6">
                {/* Products group in mobile menu */}
                <div className="border-b border-gray-100 pb-2 mb-2">
                  <p className={`px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('header.products')}
                  </p>
                  <Link
                    href="/jewelry"
                    className={`block rounded-md px-4 py-2 text-base font-medium text-gray-900 hover:bg-nile-teal/10 hover:text-nile-teal transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('header.jewelryCollection')}
                  </Link>
                  <Link
                    href="/try-and-fit"
                    className={`block rounded-md px-4 py-2 text-base font-medium text-gray-900 hover:bg-nile-teal/10 hover:text-nile-teal transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('header.virtualTryOn')}
                  </Link>
                  <Link
                    href="/customize"
                    className={`block rounded-md px-4 py-2 text-base font-medium text-gray-900 hover:bg-nile-teal/10 hover:text-nile-teal transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('header.customizeJewelry')}
                  </Link>
                  <Link
                    href="/knowledge"
                    className={`block rounded-md px-4 py-2 text-base font-medium text-gray-900 hover:bg-nile-teal/10 hover:text-nile-teal transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('header.knowledgeHub')}
                  </Link>
                </div>

                {/* Main navigation in mobile menu */}
                <div>
                  <p className={`px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('header.navigation')}
                  </p>
                  <a
                    href="#features"
                      className={`block rounded-md px-4 py-2 text-base font-medium text-gray-900 hover:bg-nile-teal/10 hover:text-nile-teal transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                    onClick={(e) => {
                      scrollToSection(e, 'features');
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t('header.features')}
                  </a>
                  <a
                    href="#try-on"
                      className={`block rounded-md px-4 py-2 text-base font-medium text-gray-900 hover:bg-nile-teal/10 hover:text-nile-teal transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                    onClick={(e) => {
                      scrollToSection(e, 'try-on');
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t('header.tryOn')}
                  </a>
                  <a
                    href="#customize"
                      className={`block rounded-md px-4 py-2 text-base font-medium text-gray-900 hover:bg-nile-teal/10 hover:text-nile-teal transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                    onClick={(e) => {
                      scrollToSection(e, 'customize');
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t('header.customize')}
                  </a>
                  <a
                      href="#performance"
                      className={`block rounded-md px-4 py-2 text-base font-medium text-gray-900 hover:bg-nile-teal/10 hover:text-nile-teal transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                    onClick={(e) => {
                      scrollToSection(e, 'performance');
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t('header.performance')}
                  </a>
                  <a
                      href="#comparison"
                      className={`block rounded-md px-4 py-2 text-base font-medium text-gray-900 hover:bg-nile-teal/10 hover:text-nile-teal transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                    onClick={(e) => {
                      scrollToSection(e, 'comparison');
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t('header.compare')}
                  </a>
                  <a
                    href="#pricing"
                      className={`block rounded-md px-4 py-2 text-base font-medium text-gray-900 hover:bg-nile-teal/10 hover:text-nile-teal transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                    onClick={(e) => {
                      scrollToSection(e, 'pricing');
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t('header.pricing')}
                  </a>
                  <Link
                    href="/demo"
                      className={`block rounded-md px-4 py-2 text-base font-medium text-gray-900 hover:bg-nile-teal/10 hover:text-nile-teal transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('header.demo')}
                  </Link>
                </div>
              </div>
              <div className={`border-t border-gray-200 py-6 px-4 ${isRTL ? 'text-right' : 'text-left'} bg-gray-50 rounded-b-xl`}>
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
                  <LanguageSwitcher />
                </div>
                <a
                  href="/auth/login"
                  className="w-full inline-flex items-center justify-center rounded-md bg-nile-teal px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-nile-teal focus:ring-offset-2 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.getStarted')}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 