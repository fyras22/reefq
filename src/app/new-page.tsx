'use client';

import { useState, useEffect, useRef } from 'react';
import CircleLoader from '@/components/ui/CircleLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { CubeIcon, SparklesIcon, ChartBarIcon, CheckIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { JewelryViewer } from '../components/JewelryViewer';
import { useTranslation } from '@/app/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';

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
  const [pageLoaded, setPageLoaded] = useState(false);
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Add click outside handler
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
  
  // Get current language
  const isRTL = i18n.dir() === 'rtl';
  
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
  
  return (
    <>
      <CircleLoader onLoadingComplete={() => setPageLoaded(true)} />
      
      {pageLoaded && (
        <main className={`bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
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
                
                {/* Desktop Navigation - Always in the middle */}
                <div className="hidden lg:flex lg:gap-x-8 desktop-nav order-2">
                  <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-pharaonic-gold' : 'text-gray-800 hover:text-pharaonic-gold'}`}>
                    {t('header.features')}
                  </a>
                  <a href="#testimonials" onClick={(e) => scrollToSection(e, 'testimonials')} className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-pharaonic-gold' : 'text-gray-800 hover:text-pharaonic-gold'}`}>
                    {t('header.testimonials')}
                  </a>
                  <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-pharaonic-gold' : 'text-gray-800 hover:text-pharaonic-gold'}`}>
                    {t('header.howItWorks')}
                  </a>
                  <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-pharaonic-gold' : 'text-gray-800 hover:text-pharaonic-gold'}`}>
                    {t('header.pricing')}
                  </a>
                  <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-pharaonic-gold' : 'text-gray-800 hover:text-pharaonic-gold'}`}>
                    {t('header.faq')}
                  </a>
                </div>
                
                {/* Right action buttons - Right in LTR, Left in RTL */}
                <div className={`lg:flex lg:flex-1 lg:justify-end items-center hidden ${isRTL ? 'order-1' : 'order-3'}`}>
                  <LanguageSwitcher />
                  <a href="#" className="ml-4 text-sm font-semibold leading-6 text-gray-900 hover:text-pharaonic-gold transition-colors">
                    {t('button.sign_in')} <span aria-hidden="true">&rarr;</span>
                  </a>
                  <a href="#" className="ml-8 px-4 py-2 rounded-md text-sm font-semibold bg-nile-teal text-white hover:bg-pharaonic-gold transition-colors duration-200">
                    {t('button.get_started')}
                  </a>
                </div>
                
                {/* Mobile menu button */}
                <div className="flex lg:hidden items-center">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-nile-teal hover:bg-gray-100 focus:outline-none"
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
            </div>
            
            {/* Mobile menu, show/hide based on menu state. */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div 
                  ref={menuRef}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="lg:hidden overflow-hidden"
                >
                  <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg bg-white">
                    <a href="#features" onClick={(e) => {scrollToSection(e, 'features'); setMobileMenuOpen(false);}} className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-nile-teal">
                      {t('header.features')}
                    </a>
                    <a href="#testimonials" onClick={(e) => {scrollToSection(e, 'testimonials'); setMobileMenuOpen(false);}} className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-nile-teal">
                      {t('header.testimonials')}
                    </a>
                    <a href="#how-it-works" onClick={(e) => {scrollToSection(e, 'how-it-works'); setMobileMenuOpen(false);}} className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-nile-teal">
                      {t('header.howItWorks')}
                    </a>
                    <a href="#pricing" onClick={(e) => {scrollToSection(e, 'pricing'); setMobileMenuOpen(false);}} className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-nile-teal">
                      {t('header.pricing')}
                    </a>
                    <a href="#faq" onClick={(e) => {scrollToSection(e, 'faq'); setMobileMenuOpen(false);}} className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-nile-teal">
                      {t('header.faq')}
                    </a>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                      <a href="#" className="w-full block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-nile-teal">
                        {t('button.sign_in')}
                      </a>
                      <a href="#" className="w-full block px-3 py-2 rounded-md text-base font-medium bg-nile-teal text-white text-center">
                        {t('button.get_started')}
                      </a>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <LanguageSwitcher />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>
          
          {/* The rest of the landing page content continues here... */}
          
          {/* Hero Section */}
          {/* ... Rest of the page content ... */}
          
        </main>
      )}
    </>
  );
} 