'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { TFunction } from 'i18next'; // Import TFunction type
import LanguageSwitcher from '../LanguageSwitcher';

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
  activeSection?: string;
}

export function LandingHeader({ t, isRTL, scrolled, activeSection = 'hero' }: LandingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const productsRef = useRef<HTMLLIElement>(null);

  // Close products dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (productsRef.current && !productsRef.current.contains(event.target as Node)) {
        setProductsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Define navigation items with their sections
  const navigationItems = [
    { name: t('header.howItWorks'), section: 'how-it-works' },
    { name: t('header.performance'), section: 'performance' },
    { name: t('header.comparison'), section: 'comparison' },
    { name: t('header.pricing'), section: 'pricing' },
  ];

  // New state for features dropdown
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const featuresRef = useRef<HTMLLIElement>(null);

  // Close products dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (featuresRef.current && !featuresRef.current.contains(event.target as Node)) {
        setFeaturesOpen(false);
      }
      if (productsRef.current && !productsRef.current.contains(event.target as Node)) {
        setProductsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white border-b border-gray-200 shadow-sm py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - Left in LTR, Right in RTL */}
        <div className={`flex ${isRTL ? 'order-3 lg:order-3' : 'order-1'}`}>
          <Link href="/" className="flex items-center">
            <span className="sr-only">Reefq</span>
            {/* Consistent logo regardless of scroll state */}
            <Image
              src="/images/logo.svg"
              alt="Reefq"
              width={120}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation - Center */}
        <div className={`hidden lg:flex items-center justify-center order-2 flex-1`}>
          <ul className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Features Dropdown */}
            <li ref={featuresRef} className="relative">
              <button
                type="button"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center ${
                  scrolled
                    ? 'text-gray-700 hover:text-nile-teal hover:bg-gray-50'
                    : 'text-gray-700 hover:text-nile-teal hover:bg-white/30 backdrop-blur-sm'
                }`}
                onClick={() => setFeaturesOpen(!featuresOpen)}
                aria-expanded={featuresOpen}
              >
                {t('header.features') || 'Features'}
                <ChevronDownIcon
                  className={`ml-1 h-4 w-4 transition-transform ${
                    featuresOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {featuresOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 w-64 py-2 ${
                      isRTL ? 'right-0' : 'left-0'
                    }`}
                  >
                    <div className="grid grid-cols-1 gap-2 px-2">
                      <Link
                        href="/features/3d-visualization"
                        className="block p-3 rounded-md hover:bg-gray-50"
                      >
                        <div className="font-medium text-gray-900">{t('features.3dVisualization.name') || '3D Visualization'}</div>
                        <p className="mt-1 text-xs text-gray-500">{t('features.3dVisualization.description') || 'Stunning jewelry visualization'}</p>
                      </Link>
                      <Link
                        href="/features/virtual-try-on"
                        className="block p-3 rounded-md hover:bg-gray-50"
                      >
                        <div className="font-medium text-gray-900">{t('features.arTryOn.name') || 'Virtual Try-On'}</div>
                        <p className="mt-1 text-xs text-gray-500">{t('features.arTryOn.description') || 'Try jewelry virtually'}</p>
                      </Link>
                      <Link
                        href="/features/size-optimization"
                        className="block p-3 rounded-md hover:bg-gray-50"
                      >
                        <div className="font-medium text-gray-900">{t('features.sizeOptimization.name') || 'Size Optimization'}</div>
                        <p className="mt-1 text-xs text-gray-500">{t('features.sizeOptimization.description') || 'Accurate size suggestions'}</p>
                      </Link>
                      <Link
                        href="/collections"
                        className="block p-3 rounded-md hover:bg-gray-50"
                      >
                        <div className="font-medium text-gray-900">{t('collections.title') || 'Collections'}</div>
                        <p className="mt-1 text-xs text-gray-500">{t('collections.description') || 'Explore our curated jewelry collections'}</p>
                      </Link>
                      <Link
                        href="/knowledge"
                        className="block p-3 rounded-md hover:bg-gray-50"
                      >
                        <div className="font-medium text-gray-900">{t('header.knowledgeHub') || 'Knowledge Hub'}</div>
                        <p className="mt-1 text-xs text-gray-500">Learn about jewelry craftsmanship and care</p>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
            
            {navigationItems.map((item) => (
              <li key={item.section}>
                <a
                  href={`#${item.section}`}
                  onClick={(e) => scrollToSection(e, item.section)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                    activeSection === item.section
                      ? 'text-nile-teal'
                      : scrolled
                      ? 'text-gray-700 hover:text-nile-teal hover:bg-gray-50'
                      : 'text-gray-700 hover:text-nile-teal hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  {item.name}
                  {activeSection === item.section && (
                    <motion.span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-nile-teal rounded-full"
                      layoutId="activeSection"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            ))}
            
            {/* Products Dropdown */}
            <li ref={productsRef} className="relative">
              <button
                type="button"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center ${
                  scrolled
                    ? 'text-gray-700 hover:text-nile-teal hover:bg-gray-50'
                    : 'text-gray-700 hover:text-nile-teal hover:bg-white/30 backdrop-blur-sm'
                }`}
                onClick={() => setProductsOpen(!productsOpen)}
                aria-expanded={productsOpen}
              >
                {t('header.products') || 'Products'}
                <ChevronDownIcon
                  className={`ml-1 h-4 w-4 transition-transform ${
                    productsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {productsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 w-48 py-1 ${
                      isRTL ? 'right-0' : 'left-0'
                    }`}
                  >
                    <Link
                      href="/collections"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('header.jewelryCollection') || 'Jewelry Collection'}
                    </Link>
                    <Link
                      href="/try-on"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('header.virtualTryOn') || 'Virtual Try-On'}
                    </Link>
                    <Link
                      href="/customize"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('header.customizeJewelry') || 'Customize Jewelry'}
                    </Link>
                    <Link
                      href="/try-and-fit"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                    >
                      {t('header.tryAndFit')}
                    </Link>
                    <Link
                      href="/knowledge"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('header.knowledgeHub') || 'Knowledge Hub'}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>
        </div>

        {/* CTA and Language - Right in LTR, Left in RTL */}
        <div className={`hidden lg:flex lg:flex-1 lg:justify-end gap-4 items-center ${isRTL ? 'order-1' : 'order-3'}`}>
          <div className={`${scrolled ? 'border-r border-gray-200 pr-4' : 'pr-2'}`}>
            <LanguageSwitcher />
          </div>
          <a
            href="/auth/login"
            className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              scrolled
                ? 'bg-nile-teal focus:ring-nile-teal'
                : 'bg-pharaonic-gold focus:ring-pharaonic-gold'
            }`}
          >
            {t('header.getStarted')}
          </a>
        </div>

        {/* Mobile menu button and Language Switcher - Right in LTR, Left in RTL */}
        <div className={`flex items-center lg:hidden ${isRTL ? 'order-1' : 'order-3'}`}>
          <div className="mr-2">
            <LanguageSwitcher />
          </div>
          <button
            type="button"
            className={`inline-flex items-center justify-center rounded-md p-2 ${
              scrolled 
                ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' 
                : 'text-gray-700 hover:bg-white/30 backdrop-blur-sm hover:text-gray-900'
            }`}
            aria-expanded="false"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden"
          >
            <div className="space-y-1 px-4 pb-3 pt-2 bg-white shadow-lg rounded-b-xl">
              {/* Features Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setFeaturesOpen(!featuresOpen)}
                  className="w-full text-left flex justify-between items-center rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-nile-teal"
                >
                  {t('header.features') || 'Features'}
                  <ChevronDownIcon
                    className={`h-5 w-5 transition-transform ${
                      featuresOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {featuresOpen && (
                  <div className="mt-2 pl-4 space-y-2 border-l-2 border-gray-100 ml-3">
                    <Link
                      href="/features/3d-visualization"
                      className="block rounded-md px-3 py-2 text-base text-gray-700 hover:bg-gray-50 hover:text-nile-teal"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="font-medium">{t('features.3dVisualization.name') || '3D Visualization'}</div>
                      <p className="mt-1 text-xs text-gray-500">{t('features.3dVisualization.description') || 'Stunning jewelry visualization'}</p>
                    </Link>
                    <Link
                      href="/features/virtual-try-on"
                      className="block rounded-md px-3 py-2 text-base text-gray-700 hover:bg-gray-50 hover:text-nile-teal"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="font-medium">{t('features.arTryOn.name') || 'Virtual Try-On'}</div>
                      <p className="mt-1 text-xs text-gray-500">{t('features.arTryOn.description') || 'Try jewelry virtually'}</p>
                    </Link>
                    <Link
                      href="/features/size-optimization"
                      className="block rounded-md px-3 py-2 text-base text-gray-700 hover:bg-gray-50 hover:text-nile-teal"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="font-medium">{t('features.sizeOptimization.name') || 'Size Optimization'}</div>
                      <p className="mt-1 text-xs text-gray-500">{t('features.sizeOptimization.description') || 'Accurate size suggestions'}</p>
                    </Link>
                    <Link
                      href="/collections"
                      className="block rounded-md px-3 py-2 text-base text-gray-700 hover:bg-gray-50 hover:text-nile-teal"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="font-medium">{t('collections.title') || 'Collections'}</div>
                      <p className="mt-1 text-xs text-gray-500">{t('collections.description') || 'Explore our curated jewelry collections'}</p>
                    </Link>
                    <Link
                      href="/knowledge"
                      className="block rounded-md px-3 py-2 text-base text-gray-700 hover:bg-gray-50 hover:text-nile-teal"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="font-medium">{t('header.knowledgeHub') || 'Knowledge Hub'}</div>
                      <p className="mt-1 text-xs text-gray-500">Learn about jewelry craftsmanship and care</p>
                    </Link>
                  </div>
                )}
              </div>
              
              {navigationItems.map((item) => (
                <a
                  key={item.section}
                  href={`#${item.section}`}
                  onClick={(e) => {
                    scrollToSection(e, item.section);
                    setMobileMenuOpen(false);
                  }}
                  className={`block rounded-lg px-3 py-2 text-base font-medium ${
                    activeSection === item.section
                      ? 'bg-gray-50 text-nile-teal'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-nile-teal'
                  }`}
                >
                  {item.name}
                </a>
              ))}
              
              {/* Products section in mobile */}
              <div className="relative">
                <button
                  onClick={() => setProductsOpen(!productsOpen)}
                  className="w-full text-left flex justify-between items-center rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-nile-teal"
                >
                  {t('header.products') || 'Products'}
                  <ChevronDownIcon
                    className={`h-5 w-5 transition-transform ${
                      productsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {productsOpen && (
                  <div className="mt-2 pl-4 space-y-1 border-l-2 border-gray-100 ml-3">
                    <Link
                      href="/collections"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-nile-teal"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('header.jewelryCollection') || 'Jewelry Collection'}
                    </Link>
                    <Link
                      href="/try-on"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-nile-teal"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('header.virtualTryOn') || 'Virtual Try-On'}
                    </Link>
                    <Link
                      href="/customize"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-nile-teal"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('header.customizeJewelry') || 'Customize Jewelry'}
                    </Link>
                    <Link
                      href="/try-and-fit"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-nile-teal"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('header.tryAndFit')}
                    </Link>
                    <Link
                      href="/knowledge"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-nile-teal"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('header.knowledgeHub') || 'Knowledge Hub'}
                    </Link>
                  </div>
                )}
              </div>
              
              <div className={`border-t border-gray-200 py-6 px-4 ${isRTL ? 'text-right' : 'text-left'} bg-gray-50 rounded-b-xl`}>
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