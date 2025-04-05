'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CubeIcon, SparklesIcon, ChartBarIcon, CheckIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { JewelryViewer } from '../components/JewelryViewer';
import { useTranslation } from '@/app/i18n-client';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        className="flex w-full items-center justify-between py-3 text-left text-lg font-medium leading-7 text-gray-900 hover:text-nile-teal transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <ChevronDownIcon
          className={`h-5 w-5 text-pharaonic-gold transition-transform ${isOpen ? 'rotate-180 transform' : ''}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
        transition={{ duration: 0.3 }}
      >
        <div className="py-3 text-base text-gray-600">{answer}</div>
      </motion.div>
    </div>
  );
}

// Add helper function for smooth scrolling
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

export default function Home() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRTL = ['ar'].includes(i18n.language);
  const [showProductsMenu, setShowProductsMenu] = useState(false);
  const productsMenuRef = useRef<HTMLDivElement>(null);
  
  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  // Generate features array from translations
  const features = [
    {
      name: t('features.3dVisualization.name'),
      description: t('features.3dVisualization.description'),
      icon: CubeIcon,
      stat: t('features.3dVisualization.stat'),
      statText: t('features.3dVisualization.statText')
    },
    {
      name: t('features.arTryOn.name'),
      description: t('features.arTryOn.description'),
      icon: SparklesIcon,
      stat: t('features.arTryOn.stat'),
      statText: t('features.arTryOn.statText')
    },
    {
      name: t('features.sizeOptimization.name'),
      description: t('features.sizeOptimization.description'),
      icon: ChartBarIcon,
      stat: t('features.sizeOptimization.stat'),
      statText: t('features.sizeOptimization.statText')
    }
  ];

  // Generate testimonials array from translations
  const testimonials = [
    {
      quote: t('testimonials.testimonial1.quote'),
      author: t('testimonials.testimonial1.author'),
      role: t('testimonials.testimonial1.role'),
      company: t('testimonials.testimonial1.company')
    },
    {
      quote: t('testimonials.testimonial2.quote'),
      author: t('testimonials.testimonial2.author'),
      role: t('testimonials.testimonial2.role'),
      company: t('testimonials.testimonial2.company')
    },
    {
      quote: t('testimonials.testimonial3.quote'),
      author: t('testimonials.testimonial3.author'),
      role: t('testimonials.testimonial3.role'),
      company: t('testimonials.testimonial3.company')
    }
  ];

  // Generate faqs array from translations
  const faqs = [
    {
      question: t('faq.question1.question'),
      answer: t('faq.question1.answer')
    },
    {
      question: t('faq.question2.question'),
      answer: t('faq.question2.answer')
    },
    {
      question: t('faq.question3.question'),
      answer: t('faq.question3.answer')
    },
    {
      question: t('faq.question4.question'),
      answer: t('faq.question4.answer')
    }
  ];
  
  // Close products menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productsMenuRef.current && !productsMenuRef.current.contains(event.target as Node)) {
        setShowProductsMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Add click outside listener for mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.querySelector('.mobile-menu');
      const mobileMenuButton = document.querySelector('.mobile-menu-button');
      
      if (mobileMenuOpen && mobileMenu && !mobileMenu.contains(event.target as Node) && 
          mobileMenuButton && !mobileMenuButton.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);
  
  return (
    <main className={`bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Arabic decorative elements - only visible in RTL mode */}
      {isRTL && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 -translate-x-1/3 -translate-y-1/3">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-pharaonic-gold fill-current">
              <path d="M36.9,-48.2C46.2,-39.9,51.2,-26.6,55,-12.6C58.8,1.4,61.5,16,56.6,27.7C51.8,39.4,39.4,48.3,25.8,53.9C12.2,59.5,-2.7,61.8,-17.8,59C-32.8,56.3,-47.9,48.6,-55.7,36.3C-63.5,24.1,-64,7.4,-62,-8.8C-60,-25,-55.4,-40.7,-44.8,-49C-34.1,-57.3,-17.1,-58.2,-1.6,-56.2C13.8,-54.2,27.5,-56.5,36.9,-48.2Z" transform="translate(100 100)" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-96 h-96 translate-x-1/3 translate-y-1/3">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-nile-teal fill-current">
              <path d="M40.9,-56.3C51.1,-44.9,56.2,-30.1,60.8,-14.8C65.4,0.5,69.6,16.4,64.4,28.5C59.3,40.7,44.8,49.2,30.6,53.8C16.3,58.5,2.2,59.4,-12.9,58.1C-28,56.9,-44.1,53.5,-55.3,43.5C-66.5,33.5,-72.8,17,-74.2,-0.8C-75.6,-18.7,-72.1,-37.4,-60.7,-48.8C-49.4,-60.2,-30.2,-64.3,-13.2,-64.1C3.9,-63.9,30.7,-67.6,40.9,-56.3Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Header with Logo - Fixed with scroll effect */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full full-width ${
        scrolled || mobileMenuOpen
          ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className={`flex items-center justify-between w-full`}>
            {/* Logo - Left in LTR, Right in RTL */}
            <div className={`flex lg:flex-1 logo-container ${isRTL ? 'order-3' : 'order-1'}`}>
              <a href="#" className={`${isRTL ? 'ml-0 mr-4' : 'mr-4 ml-0'} relative w-48 h-16 flex items-center`}>
                <Image 
                  src="/logo.png"
                  alt="ReefQ Logo"
                  width={180}
                  height={60}
                  className="w-auto h-[200%]"
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
              className="lg:hidden mobile-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`bg-white shadow-xl rounded-b-xl mx-4 ${isRTL ? 'mr-auto ml-4 left-0' : 'ml-auto mr-4 right-0'} absolute w-64 max-w-xs border border-gray-100 z-50`} style={{ top: 'calc(100% + 2px)' }}>
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

      {/* Hero Section with 3D Model */}
      <section className="bg-bg-light pt-16 sm:pt-20 md:pt-24">
        <div className="relative isolate px-6 lg:px-8">
          <div className="mx-auto max-w-7xl py-12 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                className={`text-center lg:${isRTL ? 'text-right' : 'text-left'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                  <span className="block text-pharaonic-gold font-serif">{t('hero.title')}</span>
                  <span className="block mt-2 text-nile-teal">{t('hero.subtitle')}</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-700 max-w-xl mx-auto lg:mx-0">
                  {t('hero.description')}
                </p>
                <div className={`mt-8 flex gap-x-4 ${isRTL ? 'flex-row-reverse' : ''} justify-center lg:${isRTL ? 'justify-end' : 'justify-start'} flex-wrap`}>
                  <Link
                    href="/jewelry"
                    className="rounded-md bg-nile-teal px-4 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:bg-opacity-90 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 mb-2 sm:mb-0"
                  >
                    {t('hero.browseButton')}
                  </Link>
                  <Link
                    href="/try-and-fit"
                    className="rounded-md border border-pharaonic-gold px-4 py-3 text-sm font-semibold text-pharaonic-gold shadow-sm hover:bg-pharaonic-gold hover:text-white transition-all group mb-2 sm:mb-0"
                  >
                    <span className="group-hover:text-white transition-colors">{t('hero.tryOnButton')}</span>
                  </Link>
                </div>
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    {t('hero.tagline')}
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="mt-8 lg:mt-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative h-[400px] sm:h-[500px] overflow-hidden rounded-xl shadow-2xl">
                  {isRTL && (
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
                      <div className="absolute top-0 left-0 right-0 h-6 bg-pharaonic-gold/10 border-b border-pharaonic-gold/20"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-6 bg-pharaonic-gold/10 border-t border-pharaonic-gold/20"></div>
                      <div className="absolute left-0 top-0 bottom-0 w-6 bg-pharaonic-gold/10 border-r border-pharaonic-gold/20"></div>
                      <div className="absolute right-0 top-0 bottom-0 w-6 bg-pharaonic-gold/10 border-l border-pharaonic-gold/20"></div>
                      <div className="absolute top-2 left-2 right-2 h-1 bg-pharaonic-gold/30"></div>
                      <div className="absolute bottom-2 left-2 right-2 h-1 bg-pharaonic-gold/30"></div>
                      <div className="absolute left-2 top-2 bottom-2 w-1 bg-pharaonic-gold/30"></div>
                      <div className="absolute right-2 top-2 bottom-2 w-1 bg-pharaonic-gold/30"></div>
                </div>
                  )}
                  <JewelryViewer 
                    modelPath="/models/diamond_engagement_ring.glb"
                    selectedMetal="gold"
                    selectedGem="diamond"
                  />
                </div>
                <div className={`flex justify-center mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pharaonic-gold/10 text-pharaonic-gold ${isRTL ? 'ml-2' : 'mr-2'}`}>
                    {t('hero.colors.pharaonicGold')}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-nile-teal/10 text-nile-teal">
                    {t('hero.colors.nileTeal')}
                  </span>
                </div>
                <p className="text-center mt-2 text-sm text-gray-500">
                  {t('hero.aiPowered')}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards with Direct Links */}
      <section className="bg-bg-light py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-nile-teal font-serif">
              {t('features.exploreTitle')}
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              {t('features.exploreSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Jewelry Collection */}
            <Link href="/jewelry" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow border border-gray-100">
                <div className="h-48 bg-nile-teal/10 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image 
                      src="/images/feature-jewelry.jpg" 
                      alt="Jewelry Collection"
                      width={200}
                      height={150}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-nile-teal transition-colors">
                    {t('features.browseCollection.title')}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {t('features.browseCollection.description')}
                  </p>
                  <div className="mt-4 flex items-center text-nile-teal font-medium">
                    {t('features.browseCollection.cta')}
                    <ArrowRightIcon className={`${isRTL ? 'mr-2 transform rotate-180' : 'ml-2'} h-4 w-4 group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`} />
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Virtual Try-On */}
            <Link href="/try-and-fit" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow border border-gray-100">
                <div className="h-48 bg-pharaonic-gold/10 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image 
                      src="/images/feature-try-on.jpg" 
                      alt="Virtual Try-On"
                      width={200}
                      height={150}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-pharaonic-gold transition-colors">
                    {t('features.virtualTryOn.title')}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {t('features.virtualTryOn.description')}
                  </p>
                  <div className="mt-4 flex items-center text-pharaonic-gold font-medium">
                    {t('features.virtualTryOn.cta')}
                    <ArrowRightIcon className={`${isRTL ? 'mr-2 transform rotate-180' : 'ml-2'} h-4 w-4 group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`} />
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Customize */}
            <Link href="/customize" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow border border-gray-100">
                <div className="h-48 bg-nile-teal/10 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image 
                      src="/images/feature-customize.jpg" 
                      alt="Customize Jewelry"
                      width={200}
                      height={150}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-nile-teal transition-colors">
                    {t('features.designYourOwn.title')}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {t('features.designYourOwn.description')}
                  </p>
                  <div className="mt-4 flex items-center text-nile-teal font-medium">
                    {t('features.designYourOwn.cta')}
                    <ArrowRightIcon className={`${isRTL ? 'mr-2 transform rotate-180' : 'ml-2'} h-4 w-4 group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`} />
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Knowledge Hub */}
            <Link href="/knowledge" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow border border-gray-100">
                <div className="h-48 bg-pharaonic-gold/10 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image 
                      src="/images/feature-knowledge.jpg" 
                      alt="Knowledge Hub"
                      width={200}
                      height={150}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-pharaonic-gold transition-colors">
                    {t('features.knowledgeHub.title')}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {t('features.knowledgeHub.description')}
                  </p>
                  <div className="mt-4 flex items-center text-pharaonic-gold font-medium">
                    {t('features.knowledgeHub.cta')}
                    <ArrowRightIcon className={`${isRTL ? 'mr-2 transform rotate-180' : 'ml-2'} h-4 w-4 group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-serif font-bold tracking-tight text-nile-teal sm:text-4xl">{t('features.title')}</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t('features.subtitle')}
            </p>
          </div>
          
          {/* Featured image - decorative */}
          <div className="mt-10 mx-auto max-w-xl overflow-hidden rounded-xl shadow-lg">
            <div className="aspect-[16/9] w-full relative">
              <Image 
                src="/inspiration/Q.jpg" 
                alt="Featured jewelry showcase" 
                fill 
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name} 
                className="bg-bg-light p-8 rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-nile-teal text-white mb-6">
                  <feature.icon className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold leading-8 text-gray-900 mb-3">{feature.name}</h3>
                <p className="text-base leading-7 text-gray-600 mb-6">{feature.description}</p>
                <div className="pt-4 border-t border-gray-200">
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <span className="text-2xl font-bold text-pharaonic-gold">{feature.stat}</span>
                    <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-gray-500`}>{feature.statText}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works section with image */}
      <section id="how-it-works" className="py-20 bg-bg-light">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-nile-teal">{t('howItWorks.title')}</h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          
          <div className="relative">
            {/* Timeline connector - hidden on mobile */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-auto h-[calc(100%-80px)] w-0.5 bg-pharaonic-gold/30 -translate-x-1/2"></div>
            
            <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
              {/* Step 1 */}
              <motion.div 
                className={`relative flex flex-col items-center ${isRTL ? 'md:items-start' : 'md:items-end md:text-right'}`}
                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className={`flex ${isRTL ? '' : 'md:justify-end'}`}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-nile-teal text-white text-lg font-bold md:relative md:z-10 shadow-md">
                    1
                  </div>
                </div>
                <div className={`mt-3 text-center ${isRTL ? 'md:text-left md:pl-12' : 'md:text-right md:pr-12'}`}>
                  <h3 className="text-xl font-bold text-gray-900">{t('howItWorks.step1.title')}</h3>
                  <p className="mt-2 text-gray-600">
                    {t('howItWorks.step1.description')}
                  </p>
                </div>
              </motion.div>
              
              {/* Empty cell */}
              <div className="hidden md:block"></div>
              
              {/* Empty cell */}
              <div className="hidden md:block"></div>
              
              {/* Step 2 */}
              <motion.div 
                className={`relative flex flex-col items-center ${isRTL ? 'md:items-end md:text-right' : 'md:items-start'}`}
                initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className={`flex ${isRTL ? 'md:justify-end' : ''}`}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-nile-teal text-white text-lg font-bold md:relative md:z-10 shadow-md">
                    2
                  </div>
                </div>
                <div className={`mt-3 text-center ${isRTL ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <h3 className="text-xl font-bold text-gray-900">{t('howItWorks.step2.title')}</h3>
                  <p className="mt-2 text-gray-600">
                    {t('howItWorks.step2.description')}
                  </p>
                </div>
              </motion.div>
              
              {/* Step 3 */}
              <motion.div 
                className={`relative flex flex-col items-center ${isRTL ? 'md:items-start' : 'md:items-end md:text-right'}`}
                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className={`flex ${isRTL ? '' : 'md:justify-end'}`}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-nile-teal text-white text-lg font-bold md:relative md:z-10 shadow-md">
                    3
                  </div>
                </div>
                <div className={`mt-3 text-center ${isRTL ? 'md:text-left md:pl-12' : 'md:text-right md:pr-12'}`}>
                  <h3 className="text-xl font-bold text-gray-900">{t('howItWorks.step3.title')}</h3>
                  <p className="mt-2 text-gray-600">
                    {t('howItWorks.step3.description')}
                  </p>
                </div>
              </motion.div>
              
              {/* Empty cell */}
              <div className="hidden md:block"></div>
              
              {/* Empty cell */}
              <div className="hidden md:block"></div>
              
              {/* Step 4 */}
              <motion.div 
                className={`relative flex flex-col items-center ${isRTL ? 'md:items-end md:text-right' : 'md:items-start'}`}
                initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className={`flex ${isRTL ? 'md:justify-end' : ''}`}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-nile-teal text-white text-lg font-bold md:relative md:z-10 shadow-md">
                    4
                  </div>
                </div>
                <div className={`mt-3 text-center ${isRTL ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <h3 className="text-xl font-bold text-gray-900">{t('howItWorks.step4.title')}</h3>
                  <p className="mt-2 text-gray-600">
                    {t('howItWorks.step4.description')}
                  </p>
                </div>
              </motion.div>
            </div>
            
            {/* CTA */}
            <div className="mt-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="px-4"
              >
                <a href="#" className="inline-block rounded-md bg-pharaonic-gold px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all">
                 {t('howItWorks.cta')}
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with customer images */}
      <section id="testimonials" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-lg font-medium uppercase tracking-wider text-pharaonic-gold">{t('testimonials.title')}</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-nile-teal sm:text-4xl font-serif">
              {t('testimonials.subtitle')}
            </h2>
          </div>
          
          {/* Success stories imagery */}
          {/* <div className="mt-10 mb-16 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-200 rounded-lg overflow-hidden aspect-[3/2] relative">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
                <p className="text-center font-medium">Customer story 1</p>
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg overflow-hidden aspect-[3/2] relative">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
                <p className="text-center font-medium">Customer story 2</p>
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg overflow-hidden aspect-[3/2] relative">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
                <p className="text-center font-medium">Customer story 3</p>
              </div>
            </div>
          </div> */}
          
          <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col justify-between bg-bg-light p-8 rounded-2xl shadow-lg ring-1 ring-gray-200"
                >
                  <div className="mb-6">
                    <svg className="h-8 w-8 text-pharaonic-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                    </svg>
                  </div>
                  <blockquote className="text-lg leading-relaxed text-gray-700 flex-grow">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-pharaonic-gold">{testimonial.company}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-bg-light py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-base font-medium uppercase tracking-wider text-pharaonic-gold">{t('pricing.title')}</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-nile-teal sm:text-4xl font-serif">
              {t('pricing.subtitle')}
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t('pricing.description')}
            </p>
          </div>
          <div className="isolate mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:mt-20 lg:grid-cols-3">
            {[
              {
                name: t('pricing.free.name'),
                price: t('pricing.free.price'),
                description: t('pricing.free.description'),
                features: [
                  t('pricing.free.features.0'),
                  t('pricing.free.features.1'),
                  t('pricing.free.features.2'),
                  t('pricing.free.features.3')
                ],
                cta: t('pricing.free.cta'),
                highlighted: false
              },
              {
                name: t('pricing.professional.name'),
                price: t('pricing.professional.price'),
                description: t('pricing.professional.description'),
                features: [
                  t('pricing.professional.features.0'),
                  t('pricing.professional.features.1'),
                  t('pricing.professional.features.2'),
                  t('pricing.professional.features.3'),
                  t('pricing.professional.features.4'),
                  t('pricing.professional.features.5')
                ],
                cta: t('pricing.professional.cta'),
                highlighted: true
              },
              {
                name: t('pricing.enterprise.name'),
                price: t('pricing.enterprise.price'),
                description: t('pricing.enterprise.description'),
                features: [
                  t('pricing.enterprise.features.0'),
                  t('pricing.enterprise.features.1'),
                  t('pricing.enterprise.features.2'),
                  t('pricing.enterprise.features.3'),
                  t('pricing.enterprise.features.4'),
                  t('pricing.enterprise.features.5')
                ],
                cta: t('pricing.enterprise.cta'),
                highlighted: false
              }
            ].map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-3xl p-8 ring-1 ring-gray-200 flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  tier.highlighted ? 'bg-nile-teal text-white ring-nile-teal' : 'bg-white'
                }`}
              >
                <div>
                  <h3 className={`text-lg font-semibold leading-8 ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>{tier.name}</h3>
                  <p className={`mt-4 text-sm leading-6 ${tier.highlighted ? 'text-white/80' : 'text-gray-600'}`}>{tier.description}</p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className={`text-4xl font-bold tracking-tight ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>{tier.price}</span>
                    {tier.price !== t('pricing.enterprise.price') && <span className={`text-sm font-semibold leading-6 ${tier.highlighted ? 'text-white/80' : 'text-gray-600'}`}>{t('pricing.oneTime')}</span>}
                  </p>
                </div>
                
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 flex-grow">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon className={`h-6 w-5 flex-none ${tier.highlighted ? 'text-pharaonic-gold' : 'text-pharaonic-gold'}`} aria-hidden="true" />
                      <span className={tier.highlighted ? 'text-white' : ''}>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <a
                  href="/auth/login"
                  className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    tier.highlighted
                      ? 'bg-white text-nile-teal hover:bg-gray-100 focus-visible:outline-white'
                      : 'bg-pharaonic-gold text-white hover:bg-opacity-90 transition-all'
                  }`}
                >
                  {tier.cta}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Try-On Demo Section */}
      <section id="try-on" className="py-24 bg-gradient-to-br from-nile-teal/5 to-pharaonic-gold/5 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column: Text & Controls */}
              <div>
                <span className="inline-block px-3 py-1 text-sm font-medium bg-nile-teal/10 text-nile-teal rounded-full mb-3">
                  Virtual Experience
                </span>
                <h2 className="text-3xl font-bold text-gray-900 font-serif mb-6">
                  Try Before You Buy, <br/>From Anywhere
                </h2>
                <p className="text-gray-600 mb-8">
                  Our advanced AR technology lets you virtually try on Tunisian jewelry pieces. See how different styles look on you before making a purchase or visiting a store.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-nile-teal/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-nile-teal">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Real-Time AR Try-On</h3>
                      <p className="text-sm text-gray-600">
                        Using your device's camera, see jewelry pieces on yourself in real-time with accurate size and proportions.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-nile-teal/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-nile-teal">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Customizable Options</h3>
                      <p className="text-sm text-gray-600">
                        Experiment with different metals, gemstones, and finishes to create your perfect piece.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-nile-teal/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-nile-teal">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Share & Compare</h3>
                      <p className="text-sm text-gray-600">
                        Capture screenshots of your virtual try-ons to share with friends and family for feedback.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Try Different Jewelry Types</h3>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1.5 bg-nile-teal text-white text-sm font-medium rounded-md">Earrings</button>
                    <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">Necklaces</button>
                    <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">Bracelets</button>
                    <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">Rings</button>
                  </div>
                </div>
                
                <Link 
                  href="/try-and-fit" 
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-nile-teal text-white font-medium hover:bg-nile-teal/90 transition-colors shadow-md hover:shadow-lg"
                >
                  Launch Full AR Experience
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
              
              {/* Right Column: Interactive Demo */}
              <div className="relative">
                <div className="aspect-[3/4] bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                  {/* Demo Viewport */}
                  <div className="relative h-full w-full bg-gray-100 overflow-hidden">
                    {/* Placeholder image - would be replaced with actual AR simulation */}
                    <Image 
                      src="/images/ar-try-on-demo.jpg"
                      alt="AR Try-On Demonstration"
                      className="h-full w-full object-cover"
                      width={400}
                      height={600}
                    />
                    
                    {/* AR Controls Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button className="w-10 h-10 rounded-full bg-nile-teal flex items-center justify-center text-white shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                            </svg>
                          </button>
                          
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500">Currently Trying</p>
                            <p className="text-sm font-medium text-gray-900">Tunisian Filigree Earrings</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="p-2 rounded-md bg-white shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                          </button>
                          <button className="p-2 rounded-md bg-white shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* AR Badge */}
                    <div className="absolute top-4 right-4 bg-nile-teal text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      AR DEMO
                    </div>
                  </div>
                </div>
                
                {/* Product Options */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">Quick Try-On Options</p>
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                    <div className="flex-shrink-0 w-16 bg-white rounded-lg shadow-sm border border-gray-200 p-1 cursor-pointer hover:border-nile-teal transition-colors">
                      <Image 
                        src="/images/earring-option-1.jpg" 
                        alt="Jewelry Option 1" 
                        className="w-full aspect-square object-cover rounded"
                        width={64}
                        height={64}
                      />
                    </div>
                    <div className="flex-shrink-0 w-16 bg-white rounded-lg shadow-sm border border-gray-200 p-1 cursor-pointer hover:border-nile-teal transition-colors">
                      <Image 
                        src="/images/earring-option-2.jpg" 
                        alt="Jewelry Option 2" 
                        className="w-full aspect-square object-cover rounded"
                        width={64}
                        height={64}
                      />
                    </div>
                    <div className="flex-shrink-0 w-16 bg-white rounded-lg shadow-sm border border-gray-200 p-1 cursor-pointer hover:border-nile-teal transition-colors">
                      <Image 
                        src="/images/earring-option-3.jpg" 
                        alt="Jewelry Option 3" 
                        className="w-full aspect-square object-cover rounded"
                        width={64}
                        height={64}
                      />
                    </div>
                    <div className="flex-shrink-0 w-16 bg-white rounded-lg shadow-sm border border-gray-200 p-1 cursor-pointer hover:border-nile-teal transition-colors">
                      <Image 
                        src="/images/earring-option-4.jpg" 
                        alt="Jewelry Option 4" 
                        className="w-full aspect-square object-cover rounded"
                        width={64}
                        height={64}
                      />
                    </div>
                    <div className="flex-shrink-0 w-16 bg-white rounded-lg shadow-sm border border-gray-200 p-1 cursor-pointer hover:border-nile-teal transition-colors">
                      <Image 
                        src="/images/earring-option-5.jpg" 
                        alt="Jewelry Option 5" 
                        className="w-full aspect-square object-cover rounded"
                        width={64}
                        height={64}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-pharaonic-gold/10 rounded-full -z-10"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-nile-teal/10 rounded-full -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural AR Experience Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 text-sm font-medium bg-pharaonic-gold/10 text-pharaonic-gold rounded-full mb-3">
                Cultural Heritage
              </span>
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">
                Explore Tunisian Jewelry Heritage Through AR
              </h2>
              <p className="mt-2 text-lg text-gray-600 max-w-3xl mx-auto">
                Discover the stories, symbols, and craftsmanship behind traditional Tunisian jewelry with our interactive AR experience
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Story Feature */}
              <div className="bg-gradient-to-br from-nile-teal/5 to-gray-50 p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                <div className="w-14 h-14 bg-nile-teal/10 rounded-lg flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-nile-teal">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Stories Behind Every Piece</h3>
                <p className="text-gray-600 mb-6">
                  Point your camera at traditional jewelry to unlock stories about its origins, the artisan who created it, and its cultural significance in Tunisian history.
                </p>
                <div className="h-48 bg-white rounded-lg shadow-sm overflow-hidden mb-6 mt-auto">
                  <Image 
                    src="/images/cultural-story.jpg" 
                    alt="Jewelry Story" 
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                  </svg>
                  <span>50+ historical stories available</span>
                </div>
              </div>
              
              {/* Symbols Feature */}
              <div className="bg-gradient-to-br from-pharaonic-gold/5 to-gray-50 p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                <div className="w-14 h-14 bg-pharaonic-gold/10 rounded-lg flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-pharaonic-gold">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Decode Traditional Symbols</h3>
                <p className="text-gray-600 mb-6">
                  Our AR technology recognizes and explains the meaning behind traditional symbols and motifs used in Tunisian jewelry designs throughout history.
                </p>
                <div className="h-48 bg-white rounded-lg shadow-sm overflow-hidden mb-6 mt-auto">
                  <Image 
                    src="/images/symbols-meaning.jpg" 
                    alt="Traditional Symbols" 
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                  </svg>
                  <span>120+ symbols in our database</span>
                </div>
              </div>
              
              {/* Regional Styles Feature */}
              <div className="bg-gradient-to-br from-nile-teal/5 to-pharaonic-gold/5 p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                <div className="w-14 h-14 bg-gradient-to-br from-nile-teal/10 to-pharaonic-gold/10 rounded-lg flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-nile-teal">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Explore Regional Styles</h3>
                <p className="text-gray-600 mb-6">
                  Experience the diverse jewelry styles from different regions of Tunisia, from the coastal cities to the desert communities, each with their unique craftsmanship.
                </p>
                <div className="h-48 bg-white rounded-lg shadow-sm overflow-hidden mb-6 mt-auto">
                  <Image 
                    src="/images/regional-styles.jpg" 
                    alt="Regional Jewelry Styles" 
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m6.115 5.19.319 1.913A6 6 0 0 0 8.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 0 0 2.288-4.042 1.087 1.087 0 0 0-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 0 1-.98-.314l-.295-.295a1.125 1.125 0 0 1 0-1.591l.13-.132a1.125 1.125 0 0 1 1.3-.21l.603.302a.809.809 0 0 0 1.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 0 0 1.528-1.732l.146-.292M6.115 5.19A9 9 0 1 0 17.18 4.64M6.115 5.19A8.965 8.965 0 0 0 3.95 8.05" />
                  </svg>
                  <span>12 regions with distinct styles</span>
                </div>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Link 
                href="/knowledge/cultural-ar"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-nile-teal to-pharaonic-gold text-white font-medium hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
              >
                Launch Cultural AR Experience
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <p className="mt-4 text-sm text-gray-500">Available on mobile and desktop devices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Customization Tool Preview */}
      <section id="customize" className="py-24 bg-gradient-to-br from-gray-50 to-nile-teal/5 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 text-sm font-medium bg-nile-teal/10 text-nile-teal rounded-full mb-3">
                Jewelry Design
              </span>
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">
                Create Your Perfect Piece
              </h2>
              <p className="mt-2 text-lg text-gray-600 max-w-3xl mx-auto">
                Customize and personalize traditional Tunisian jewelry designs with our interactive tools
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Interactive Preview */}
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Filigree Bracelet Customizer</h3>
                      <span className="px-2 py-1 text-xs font-medium bg-pharaonic-gold/10 text-pharaonic-gold rounded-full">
                        Preview
                      </span>
                    </div>
                  </div>
                  
                  <div className="aspect-video bg-gray-50 relative">
                    <Image 
                      src="/images/customizer-preview.jpg" 
                      alt="Jewelry Customizer Interface" 
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Controls Overlay */}
                    <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-white">
                          <p className="text-sm font-medium">Traditional Tunisian Bracelet</p>
                          <p className="text-xs opacity-80">925 Silver with Amber Stone</p>
                        </div>
                        <button className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-900 shadow-sm">
                          Save Design
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Metal Type</label>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 px-3 bg-nile-teal text-white text-sm font-medium rounded-md">Silver</button>
                        <button className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">Gold</button>
                        <button className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">Brass</button>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gemstone</label>
                      <div className="grid grid-cols-5 gap-2">
                        <div className="aspect-square bg-amber-500 rounded-full cursor-pointer ring-2 ring-offset-2 ring-nile-teal"></div>
                        <div className="aspect-square bg-blue-500 rounded-full cursor-pointer"></div>
                        <div className="aspect-square bg-red-500 rounded-full cursor-pointer"></div>
                        <div className="aspect-square bg-green-500 rounded-full cursor-pointer"></div>
                        <div className="aspect-square bg-purple-500 rounded-full cursor-pointer"></div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pattern Style</label>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="border border-gray-200 rounded-md p-1 cursor-pointer">
                          <div className="bg-gray-100 aspect-square rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">Traditional</span>
                          </div>
                        </div>
                        <div className="border border-nile-teal rounded-md p-1 cursor-pointer bg-nile-teal/5">
                          <div className="bg-gray-100 aspect-square rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">Filigree</span>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-md p-1 cursor-pointer">
                          <div className="bg-gray-100 aspect-square rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">Modern</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button className="w-full py-2 px-4 bg-nile-teal text-white text-sm font-medium rounded-md shadow-sm hover:bg-nile-teal/90 hover:shadow-md transition-all">
                        Apply Changes
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-center">
                  <div className="inline-flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-nile-teal/10">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-nile-teal">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span>Changes appear in real-time</span>
                  </div>
                </div>
              </div>
              
              {/* Feature Description */}
              <div className="order-1 lg:order-2">
                <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className="w-12 h-12 rounded-lg bg-nile-teal/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-nile-teal">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Traditional Meets Modern</h3>
                      <p className="text-gray-600">
                        Our customization tools blend traditional Tunisian jewelry designs with modern personalization options, allowing you to preserve cultural elements while adding your own touch.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-5">
                    <div className="w-12 h-12 rounded-lg bg-pharaonic-gold/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-pharaonic-gold">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">3D Modeling in Real-Time</h3>
                      <p className="text-gray-600">
                        See changes instantly with our 3D modeling engine. Adjust materials, gemstones, patterns, and sizes while viewing your piece from any angle.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-5">
                    <div className="w-12 h-12 rounded-lg bg-nile-teal/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-nile-teal">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">From Design to Reality</h3>
                      <p className="text-gray-600">
                        Once you've perfected your design, place an order directly and our partnered Tunisian artisans will handcraft your unique piece using traditional methods.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Link 
                      href="/customize" 
                      className="inline-flex items-center text-nile-teal font-medium hover:text-pharaonic-gold transition-colors"
                    >
                      {t('features.customizeOptions')}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${isRTL ? 'mr-1 transform rotate-180' : 'ml-1'}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Ratings */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 text-sm font-medium bg-pharaonic-gold/10 text-pharaonic-gold rounded-full mb-3">
                Customer Stories
              </span>
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">
                What Tunisians Are Saying
              </h2>
              <p className="mt-2 text-lg text-gray-600 max-w-3xl mx-auto">
                Hear from jewelry enthusiasts and businesses across Tunisia who have embraced the digital revolution
              </p>
              
              {/* Rating Summary */}
              <div className="mt-8 inline-flex items-center justify-center gap-2 bg-nile-teal/5 px-4 py-2 rounded-full">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-pharaonic-gold">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <span className="font-bold text-gray-900">4.9/5</span>
                <span className="text-sm text-gray-500">from 362 verified reviews</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Review Card 1 */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-nile-teal/20 flex items-center justify-center text-nile-teal font-medium mr-3">
                    NA
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Nadia Abdallah</h4>
                    <p className="text-sm text-gray-500">Jewelry Store Owner, Tunis</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-pharaonic-gold">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-600 mb-4 flex-grow">
                  "Since implementing the 3D catalog and virtual try-on features, our online sales have increased by 67%. Customers love being able to see traditional pieces in detail before visiting our store."
                </p>
                
                <div className="flex items-center justify-between text-sm mt-6">
                  <span className="text-gray-500">2 weeks ago</span>
                  <span className="text-nile-teal font-medium">Verified Purchase</span>
                </div>
              </div>
              
              {/* Review Card 2 */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-pharaonic-gold/20 flex items-center justify-center text-pharaonic-gold font-medium mr-3">
                    MB
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Mohamed Ben Salem</h4>
                    <p className="text-sm text-gray-500">Artisan Jeweler, Sfax</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-pharaonic-gold">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-600 mb-4 flex-grow">
                  "As a traditional craftsman, I was hesitant about digital technology. But ReefQ's platform respects our cultural techniques while helping me reach customers I never could before. Their Arabic support has been excellent."
                </p>
                
                <div className="flex items-center justify-between text-sm mt-6">
                  <span className="text-gray-500">1 month ago</span>
                  <span className="text-nile-teal font-medium">Verified Partner</span>
                </div>
              </div>
              
              {/* Review Card 3 */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-nile-teal/20 flex items-center justify-center text-nile-teal font-medium mr-3">
                    FS
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Fatma Souissi</h4>
                    <p className="text-sm text-gray-500">Customer, Sousse</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((star, i) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${i < 4 ? 'text-pharaonic-gold' : 'text-gray-300'}`}>
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-600 mb-4 flex-grow">
                  "I love that I could try on different earrings from home before making my decision. The 3D models were incredibly detailed, showing the traditional filigree work. The sizing tool was accurate too!"
                </p>
                
                <div className="flex items-center justify-between text-sm mt-6">
                  <span className="text-gray-500">3 months ago</span>
                  <span className="text-nile-teal font-medium">Verified Purchase</span>
                </div>
              </div>
            </div>
            
            {/* Brands and Partners */}
            <div className="mt-20">
              <p className="text-center text-sm font-medium text-gray-500 mb-8">TRUSTED BY JEWELRY BUSINESSES ACROSS TUNISIA</p>
              
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
                <div className="h-12 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all">
                  <Image src="/images/partners/partner-1.png" alt="Partner" width={120} height={48} className="h-full w-auto" />
                </div>
                <div className="h-12 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all">
                  <Image src="/images/partners/partner-2.png" alt="Partner" width={120} height={48} className="h-full w-auto" />
                </div>
                <div className="h-12 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all">
                  <Image src="/images/partners/partner-3.png" alt="Partner" width={120} height={48} className="h-full w-auto" />
                </div>
                <div className="h-12 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all">
                  <Image src="/images/partners/partner-4.png" alt="Partner" width={120} height={48} className="h-full w-auto" />
                </div>
                <div className="h-12 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all">
                  <Image src="/images/partners/partner-5.png" alt="Partner" width={120} height={48} className="h-full w-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <p className="text-base font-medium uppercase tracking-wider text-pharaonic-gold">{t('faq.title')}</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-nile-teal sm:text-4xl font-serif">
              {t('faq.subtitle')}
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t('faq.description')}
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl lg:mt-20">
            <div className="divide-y divide-gray-200">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics Section */}
      <section id="performance" className="py-24 bg-gradient-to-br from-gray-50 to-pharaonic-gold/5 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16 items-center">
              {/* Left Side: Performance Stats */}
              <div>
                <span className="inline-block px-3 py-1 text-sm font-medium bg-nile-teal/10 text-nile-teal rounded-full mb-3">
                  {t('performance.badge')}
                </span>
                <h2 className="text-3xl font-bold text-gray-900 font-serif mb-6">
                  {t('performance.title')}
                </h2>
                <p className="text-gray-600 mb-10">
                  {t('performance.description')}
                </p>
                
                <div className="grid grid-cols-2 gap-8">
                  {/* Metric Card 1 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-nile-teal">
                        <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
                      </svg>
                      <h3 className="font-semibold text-gray-900">Loading Speed</h3>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold text-gray-900">0.7s</span>
                      <span className="text-sm text-gray-500 mb-1">avg. load time</span>
                    </div>
                    <div className="mt-3">
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className="h-2 bg-nile-teal rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Industry Avg: 2.1s</span>
                        <span>85% faster</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Metric Card 2 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-pharaonic-gold">
                        <path d="M12 .75a8.25 8.25 0 00-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 00.577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 01-.937-.171.75.75 0 11.374-1.453 5.261 5.261 0 002.626 0 .75.75 0 11.374 1.452 6.712 6.712 0 01-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 00.577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0012 .75z" />
                        <path fillRule="evenodd" d="M9.013 19.9a.75.75 0 01.877-.597 11.319 11.319 0 004.22 0 .75.75 0 11.28 1.473 12.819 12.819 0 01-4.78 0 .75.75 0 01-.597-.876zM9.754 22.344a.75.75 0 01.824-.668 13.682 13.682 0 002.844 0 .75.75 0 11.156 1.492 15.156 15.156 0 01-3.156 0 .75.75 0 01-.668-.824z" clipRule="evenodd" />
                      </svg>
                      <h3 className="font-semibold text-gray-900">AR Accuracy</h3>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold text-gray-900">98.2%</span>
                      <span className="text-sm text-gray-500 mb-1">precision</span>
                    </div>
                    <div className="mt-3">
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className="h-2 bg-pharaonic-gold rounded-full" style={{ width: '98%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Industry Avg: 86%</span>
                        <span>Top tier</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Metric Card 3 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-pharaonic-gold">
                        <path d="M4.08 5.227A3 3 0 016.979 3H17.02a3 3 0 012.9 2.227l2.113 7.926A5.228 5.228 0 0018.75 12H5.25a5.228 5.228 0 00-3.284 1.153L4.08 5.227z" />
                        <path fillRule="evenodd" d="M5.25 13.5a3.75 3.75 0 100 7.5h13.5a3.75 3.75 0 100-7.5H5.25zm0 4.5a.75.75 0 010-1.5h13.5a.75.75 0 010 1.5H5.25z" clipRule="evenodd" />
                      </svg>
                      <h3 className="font-semibold text-gray-900">Data Usage</h3>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold text-gray-900">1.3MB</span>
                      <span className="text-sm text-gray-500 mb-1">avg. per item</span>
                    </div>
                    <div className="mt-3">
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className="h-2 bg-pharaonic-gold rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Industry Avg: 5.8MB</span>
                        <span>75% reduction</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Metric Card 4 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-nile-teal">
                        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      <h3 className="font-semibold text-gray-900">Device Support</h3>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold text-gray-900">96%</span>
                      <span className="text-sm text-gray-500 mb-1">TN devices</span>
                    </div>
                    <div className="mt-3">
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className="h-2 bg-nile-teal rounded-full" style={{ width: '96%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Legacy Support</span>
                        <span>Including older models</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Side: Visual Demo */}
              <div className="relative">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-nile-teal">
                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clipRule="evenodd" />
                      </svg>
                      <h3 className="font-medium text-gray-900">Performance Monitor</h3>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-500">Live</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {/* Performance Simulation */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-700">AR Rendering Performance</h4>
                        <span className="text-xs text-gray-500">Last 24 hours</span>
                      </div>
                      <div className="h-40 flex items-end gap-1">
                        {[35, 45, 60, 50, 70, 65, 80, 90, 85, 70, 75, 65].map((value, index) => (
                          <div 
                            key={index} 
                            className={`w-full ${index === 7 ? 'bg-pharaonic-gold' : 'bg-nile-teal/60'} rounded-t`} 
                            style={{ height: `${value}%` }}
                          ></div>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>10AM</span>
                        <span>12PM</span>
                        <span>2PM</span>
                        <span>4PM</span>
                        <span>6PM</span>
                        <span>8PM</span>
                      </div>
                    </div>
                    
                    {/* Network Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-nile-teal/5 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">Avg. Load Time</span>
                          <span className="text-xs text-green-600 font-medium">-32%</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-gray-900">0.7s</span>
                          <span className="text-xs text-gray-500">from 1.2s last week</span>
                        </div>
                      </div>
                      
                      <div className="bg-pharaonic-gold/5 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">Bandwidth Saved</span>
                          <span className="text-xs text-green-600 font-medium">+12%</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-gray-900">45.3GB</span>
                          <span className="text-xs text-gray-500">this month</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Device Compatibility */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Tunisian Device Compatibility</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Android (Most Common Models)</span>
                            <span className="text-gray-900 font-medium">98%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-nile-teal rounded-full" style={{ width: '98%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">iOS Devices</span>
                            <span className="text-gray-900 font-medium">99%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-nile-teal rounded-full" style={{ width: '99%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Older Devices (4+ years)</span>
                            <span className="text-gray-900 font-medium">92%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-nile-teal rounded-full" style={{ width: '92%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-pharaonic-gold/10 rounded-full -z-10"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-nile-teal/10 rounded-full -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Tool Section */}
      <section id="comparison" className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 text-sm font-medium bg-nile-teal/10 text-nile-teal rounded-full mb-3">
                {t('comparison.badge')}
              </span>
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">
                {t('comparison.title')}
              </h2>
              <p className="mt-2 text-lg text-gray-600 max-w-3xl mx-auto">
                {t('comparison.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Traditional Experience Column */}
              <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="h-64 bg-gray-200 overflow-hidden relative">
                  <Image 
                    src="/images/traditional-jewelry-market.jpg" 
                    alt="Traditional Jewelry Shopping" 
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white text-center px-4">{t('comparison.traditional.title')}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-medium text-gray-600">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Physical Store Visits</h4>
                        <p className="text-sm text-gray-600">Travel to multiple stores in markets like Medina or Berka Souk to browse designs. Time-consuming and limited by store opening hours.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-medium text-gray-600">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Limited Selection Viewing</h4>
                        <p className="text-sm text-gray-600">Only see what's physically available in the showcase. Most pieces kept in storage due to security concerns.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-medium text-gray-600">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Physical Try-On Only</h4>
                        <p className="text-sm text-gray-600">Need to physically try on each piece. Limited by what's available in your size at that location.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-medium text-gray-600">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Craftsmanship Information</h4>
                        <p className="text-sm text-gray-600">Relies on seller's knowledge. Details about techniques and history often limited or not available.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-medium text-gray-600">5</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Customization Process</h4>
                        <p className="text-sm text-gray-600">Lengthy discussions with artisan, hand-drawn sketches, and uncertainty about final result until completion.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Digital Experience Column */}
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-nile-teal/20">
                <div className="h-64 bg-nile-teal/10 overflow-hidden relative">
                  <Image 
                    src="/images/digital-jewelry-experience.jpg" 
                    alt="Digital Jewelry Experience" 
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-nile-teal/40 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white text-center px-4">{t('comparison.digital.title')}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-nile-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-medium text-nile-teal">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Browse From Anywhere</h4>
                        <p className="text-sm text-gray-600">Access thousands of designs from multiple Tunisian artisans 24/7, from the comfort of your home or on the go.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-nile-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-medium text-nile-teal">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Explore Entire Collections</h4>
                        <p className="text-sm text-gray-600">View complete jewelry lines with detailed 3D models that can be rotated and zoomed to see intricate details.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-nile-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-medium text-nile-teal">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Virtual Try-On Technology</h4>
                        <p className="text-sm text-gray-600">Use AR to see exactly how pieces look on you. Try different sizes instantly with precise measurements.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-nile-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-medium text-nile-teal">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Cultural Heritage Information</h4>
                        <p className="text-sm text-gray-600">Access detailed stories about craftsmanship techniques, historical significance, and regional variations.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-nile-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-medium text-nile-teal">5</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Real-Time Customization</h4>
                        <p className="text-sm text-gray-600">Instantly visualize changes to materials, gemstones, and patterns with our 3D customization tool.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Link 
                href="/explore"
                className={`inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-nile-teal hover:bg-nile-teal/90 hover:shadow-lg transition-all group ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {t('comparison.ctaButton')}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${isRTL ? 'mr-2 transform rotate-180' : 'ml-2'} transition-transform group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'}`}>
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-nile-teal text-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {isRTL ? (
            <div className="text-center">
              <div className="flex justify-center relative w-64 h-24 mx-auto items-center">
                <Image 
                  src="/logo.png"
                  alt="ReefQ Logo"
                  width={220}
                  height={75}
                  className="w-auto h-[200%]"
                  priority
                />
              </div>
              <p className="text-lg text-gray-300 mb-6">{t('footer.copyright')}</p>
              <div className="flex justify-center items-center">
                <a href="#" className="text-gray-400 hover:text-pharaonic-gold transition mx-2 transform hover:scale-110">
                  <span className="sr-only">{t('footer.socialMedia.facebook')}</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-pharaonic-gold transition mx-2 transform hover:scale-110">
                  <span className="sr-only">{t('footer.socialMedia.instagram')}</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-pharaonic-gold transition mx-2 transform hover:scale-110">
                  <span className="sr-only">{t('footer.socialMedia.twitter')}</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                <div>
                  <div className="flex items-center mb-4">
                    <span className="text-3xl font-bold text-pharaonic-gold font-serif mr-2">ReefQ</span>
                  </div>
                  <p className="text-gray-300 mt-4 text-sm">
                    Your first draft is our final masterpiece ✨<br />
                    {/* The first jewelry digital ecosystem worldwide */}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-pharaonic-gold">{t('footer.company')}</h3>
                  <ul className="mt-4 space-y-3">
                    <li><a href="#" className="text-gray-300 hover:text-pharaonic-gold transition">{t('footer.about')}</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-pharaonic-gold transition">{t('footer.careers')}</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-pharaonic-gold transition">{t('footer.press')}</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-pharaonic-gold transition">{t('footer.blog')}</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-pharaonic-gold">{t('footer.resources')}</h3>
                  <ul className="mt-4 space-y-3">
                    <li><a href="#" className="text-gray-300 hover:text-pharaonic-gold transition">{t('footer.documentation')}</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-pharaonic-gold transition">{t('footer.help')}</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-pharaonic-gold transition">{t('footer.tutorials')}</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-pharaonic-gold transition">{t('footer.api')}</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-pharaonic-gold">{t('footer.legal')}</h3>
                  <ul className="mt-4 space-y-3">
                    <li><a href="#" className="text-gray-300 hover:text-pharaonic-gold transition">{t('footer.privacy')}</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-pharaonic-gold transition">{t('footer.terms')}</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-pharaonic-gold transition">{t('footer.cookies')}</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-pharaonic-gold transition">{t('footer.licensing')}</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-12 border-t border-teal-700 pt-8 flex justify-between items-center">
                <p className="text-sm text-gray-400">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
                <div className="flex items-center space-x-4">
                  <a href="#" className="text-gray-400 hover:text-pharaonic-gold transition transform hover:scale-110">
                    <span className="sr-only">{t('footer.socialMedia.facebook')}</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-pharaonic-gold transition transform hover:scale-110">
                    <span className="sr-only">{t('footer.socialMedia.instagram')}</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-pharaonic-gold transition transform hover:scale-110">
                    <span className="sr-only">{t('footer.socialMedia.twitter')}</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </footer>
    </main>
  );
}