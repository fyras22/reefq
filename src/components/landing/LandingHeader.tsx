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
              src="/logo.png"
              alt="Reefq"
              width={180}
              height={60}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
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