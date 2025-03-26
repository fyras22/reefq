'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CubeIcon, SparklesIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { JewelryViewer } from '../components/JewelryViewer';
import { useTranslation } from '@/app/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';

// Helper function for smooth scrolling
const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  e.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Handle clicks outside mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);
  
  // Track scroll position
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
  
  // Get current language direction
  const isRTL = i18n.dir() === 'rtl';
  
  // Features data
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

  return (
    <main className={`bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header with navigation */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full ${
        scrolled || mobileMenuOpen
          ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between w-full">
            {/* Logo */}
            <div className={`flex lg:flex-1 ${isRTL ? 'order-3' : 'order-1'}`}>
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
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:gap-x-8 order-2">
              <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="font-medium text-gray-800 hover:text-pharaonic-gold transition-colors">
                {t('header.features')}
              </a>
              <a href="#testimonials" onClick={(e) => scrollToSection(e, 'testimonials')} className="font-medium text-gray-800 hover:text-pharaonic-gold transition-colors">
                {t('header.testimonials')}
              </a>
              <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="font-medium text-gray-800 hover:text-pharaonic-gold transition-colors">
                {t('header.howItWorks')}
              </a>
              <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="font-medium text-gray-800 hover:text-pharaonic-gold transition-colors">
                {t('header.pricing')}
              </a>
              <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="font-medium text-gray-800 hover:text-pharaonic-gold transition-colors">
                {t('header.faq')}
              </a>
              <Link href="/demo" className="font-medium text-gray-800 hover:text-pharaonic-gold transition-colors">
                Demo
              </Link>
            </div>
            
            {/* CTA and Language */}
            <div className={`hidden lg:flex lg:flex-1 lg:justify-end gap-4 items-center ${isRTL ? 'order-1' : 'order-3'}`}>
              <LanguageSwitcher />
              <a
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-md bg-nile-teal px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-nile-teal focus:ring-offset-2"
              >
                {t('header.getStarted')}
              </a>
            </div>
            
            {/* Mobile menu button */}
            <div className={`flex lg:hidden ${isRTL ? 'order-1' : 'order-3'}`}>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2.5 text-nile-teal hover:bg-nile-teal/10 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
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
        
        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="lg:hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              ref={menuRef}
            >
              <div className={`bg-white shadow-lg rounded-b-xl mx-4 mt-2 absolute w-64 max-w-xs border border-gray-100 ${isRTL ? 'right-0' : 'left-0'}`}>
                <div className="space-y-2 px-4 py-6">
                  <a href="#features" className="block px-4 py-3 text-gray-900 hover:bg-nile-teal/10 hover:text-nile-teal transition-colors" 
                     onClick={(e) => {scrollToSection(e, 'features'); setMobileMenuOpen(false);}}>
                    {t('header.features')}
                  </a>
                  <a href="#testimonials" className="block px-4 py-3 text-gray-900 hover:bg-nile-teal/10 hover:text-nile-teal transition-colors" 
                     onClick={(e) => {scrollToSection(e, 'testimonials'); setMobileMenuOpen(false);}}>
                    {t('header.testimonials')}
                  </a>
                  <a href="#how-it-works" className="block px-4 py-3 text-gray-900 hover:bg-nile-teal/10 hover:text-nile-teal transition-colors" 
                     onClick={(e) => {scrollToSection(e, 'how-it-works'); setMobileMenuOpen(false);}}>
                    {t('header.howItWorks')}
                  </a>
                  <a href="#pricing" className="block px-4 py-3 text-gray-900 hover:bg-nile-teal/10 hover:text-nile-teal transition-colors" 
                     onClick={(e) => {scrollToSection(e, 'pricing'); setMobileMenuOpen(false);}}>
                    {t('header.pricing')}
                  </a>
                  <a href="#faq" className="block px-4 py-3 text-gray-900 hover:bg-nile-teal/10 hover:text-nile-teal transition-colors" 
                     onClick={(e) => {scrollToSection(e, 'faq'); setMobileMenuOpen(false);}}>
                    {t('header.faq')}
                  </a>
                  <Link href="/demo" className="block px-4 py-3 text-gray-900 hover:bg-nile-teal/10 hover:text-nile-teal transition-colors" 
                        onClick={() => setMobileMenuOpen(false)}>
                    Demo
                  </Link>
                </div>
                <div className="border-t border-gray-200 py-6 px-4 bg-gray-50 rounded-b-xl">
                  <div className="flex items-center justify-between mb-4">
                    <LanguageSwitcher />
                  </div>
                  <a
                    href="/auth/login"
                    className="w-full inline-flex items-center justify-center rounded-md bg-nile-teal px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-90 transition-all"
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

      {/* Hero section */}
      <section className="bg-bg-light pt-24">
        <div className="relative isolate px-6 lg:px-8">
          <div className="mx-auto max-w-7xl py-12 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                className={`text-center lg:text-${isRTL ? 'right' : 'left'}`}
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
                <div className={`mt-8 flex gap-x-4 justify-center lg:justify-${isRTL ? 'end' : 'start'}`}>
                  <a
                    href="#features"
                    className="rounded-md bg-nile-teal px-4 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:bg-opacity-90 transition-all"
                  >
                    {t('hero.exploreFeatures')}
                  </a>
                  <a
                    href="#how-it-works"
                    className="rounded-md border border-pharaonic-gold px-4 py-3 text-sm font-semibold text-pharaonic-gold shadow-sm hover:bg-pharaonic-gold hover:text-white transition-all"
                  >
                    {t('hero.howItWorks')}
                  </a>
                </div>
              </motion.div>
              
              <motion.div 
                className="mt-8 lg:mt-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative h-[400px] sm:h-[500px] overflow-hidden rounded-xl shadow-2xl">
                  <JewelryViewer metalType="gold" gemType="emerald" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-serif font-bold tracking-tight text-nile-teal sm:text-4xl">{t('features.title')}</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t('features.subtitle')}
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name} 
                className="bg-bg-light p-8 rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-nile-teal text-white mb-6">
                  <feature.icon className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold leading-8 text-gray-900 mb-3">{feature.name}</h3>
                <p className="text-base leading-7 text-gray-600 mb-6">{feature.description}</p>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-pharaonic-gold">{feature.stat}</span>
                    <span className="ml-2 text-gray-500">{feature.statText}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works section */}
      <section id="how-it-works" className="py-20 bg-bg-light">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-nile-teal">{t('howItWorks.title')}</h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('howItWorks.subtitle')}
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-auto h-[calc(100%-80px)] w-0.5 bg-pharaonic-gold/30 -translate-x-1/2"></div>
            
            <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
              {/* Step 1 */}
              <motion.div 
                className={`relative flex flex-col items-center ${isRTL ? 'md:items-start' : 'md:items-end md:text-right'}`}
                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
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
              
              {/* Step 2 */}
              <div className="hidden md:block"></div>
              
              <motion.div 
                className={`relative flex flex-col items-center ${isRTL ? 'md:items-end md:text-right' : 'md:items-start'}`}
                initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
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
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-lg font-medium uppercase tracking-wider text-pharaonic-gold">{t('testimonials.title')}</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-nile-teal sm:text-4xl font-serif">
              {t('testimonials.subtitle')}
            </h2>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-bg-light py-24">
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
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-serif font-bold text-nile-teal">{t('faq.title')}</h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('faq.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-pharaonic-gold">{t('footer.company')}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-pharaonic-gold transition-colors">{t('footer.about')}</a></li>
                <li><a href="#" className="hover:text-pharaonic-gold transition-colors">{t('footer.careers')}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-pharaonic-gold">{t('footer.resources')}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-pharaonic-gold transition-colors">{t('footer.documentation')}</a></li>
                <li><a href="#" className="hover:text-pharaonic-gold transition-colors">{t('footer.help')}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-pharaonic-gold">{t('footer.legal')}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-pharaonic-gold transition-colors">{t('footer.privacy')}</a></li>
                <li><a href="#" className="hover:text-pharaonic-gold transition-colors">{t('footer.terms')}</a></li>
              </ul>
            </div>
            <div>
              <div className="mb-6">
                <Image 
                  src="/logo.png"
                  alt="ReefQ Logo"
                  width={150}
                  height={50}
                  className="w-auto h-12"
                />
              </div>
              <p className="text-sm text-gray-400">© 2023 ReefQ{t('footer.copyright')}</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
} 