'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CubeIcon, SparklesIcon, ChartBarIcon, CheckIcon, SquaresPlusIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
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
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(true);
  
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
      statText: t('features.3dVisualization.statText'),
      image: '/images/features/3d-visualization.jpg',
      url: '/features/3d-visualization',
      color: 'from-teal-50'
    },
    {
      name: t('features.arTryOn.name'),
      description: t('features.arTryOn.description'),
      icon: SparklesIcon,
      stat: t('features.arTryOn.stat'),
      statText: t('features.arTryOn.statText'),
      image: '/images/features/virtual-try-on.jpg',
      url: '/features/virtual-try-on',
      color: 'from-purple-50'
    },
    {
      name: t('collections.title') || 'Collections',
      description: t('collections.description') || 'Explore our curated jewelry collections, designed to match your style and occasions.',
      icon: SquaresPlusIcon,
      stat: '+200',
      statText: t('collections.itemCount', { count: 200 }) || '200 unique pieces',
      image: '/images/features/collections.jpg',
      url: '/collections',
      color: 'from-rose-50'
    },
    {
      name: t('header.knowledgeHub') || 'Knowledge Hub',
      description: 'Educational resources to help you understand jewelry craftsmanship and care',
      icon: BookOpenIcon,
      stat: '+50',
      statText: 'jewelry guides and articles',
      image: '/images/features/knowledge-hub.jpg', 
      url: '/knowledge',
      color: 'from-violet-50'
    },
    {
      name: t('features.sizeOptimization.name'),
      description: t('features.sizeOptimization.description'),
      icon: ChartBarIcon,
      stat: t('features.sizeOptimization.stat'),
      statText: t('features.sizeOptimization.statText'),
      image: '/images/features/size-optimization.jpg',
      url: '/features/size-optimization',
      color: 'from-amber-50'
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
              <a href="#" className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-pharaonic-gold' : 'text-gray-800 hover:text-pharaonic-gold'}`}>
                Home
              </a>
              <Link href="/features" className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-pharaonic-gold' : 'text-gray-800 hover:text-pharaonic-gold'}`}>
                Features
              </Link>
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
            
            {/* Right side - Login/SignUp + Language Selector */}
            <div className={`lg:flex-1 flex items-center justify-end gap-x-6 ${isRTL ? 'order-1' : 'order-3'}`}>
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>
              <a href="#" className="hidden lg:block lg:text-sm font-semibold leading-6 text-gray-900">
                {t('header.login')}
              </a>
              <a
                href="#"
                className="hidden lg:block lg:rounded-md lg:px-3 lg:py-2 lg:text-sm lg:font-semibold lg:leading-6 lg:text-white lg:shadow-sm lg:hover:bg-nile-teal/90 lg:bg-nile-teal"
              >
                {t('header.signup')}
              </a>
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 lg:hidden mobile-menu-button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </nav>
        </div>
      
        {/* Mobile Menu */}
        <div className={`lg:hidden mobile-menu ${mobileMenuOpen ? 'block' : 'hidden'}`} aria-hidden={!mobileMenuOpen}>
          <div className="fixed inset-0 z-50"></div>
          <div
            className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm transition-all duration-300 transform ${
              mobileMenuOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Reefq</span>
                <Image src="/logo.png" alt="Reefq Logo" width={120} height={40} className="w-auto h-[300%]" priority />
              </a>
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
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Home
                  </Link>
                  <Link
                    href="/features"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Features
                  </Link>
                  <a
                    href="#features"
                    onClick={(e) => {
                      scrollToSection(e, 'features');
                      setMobileMenuOpen(false);
                    }}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {t('header.features')}
                  </a>
                  <a
                    href="#testimonials"
                    onClick={(e) => {
                      scrollToSection(e, 'testimonials');
                      setMobileMenuOpen(false);
                    }}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {t('header.testimonials')}
                  </a>
                  <a
                    href="#how-it-works"
                    onClick={(e) => {
                      scrollToSection(e, 'how-it-works');
                      setMobileMenuOpen(false);
                    }}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {t('header.howItWorks')}
                  </a>
                  <a
                    href="#pricing"
                    onClick={(e) => {
                      scrollToSection(e, 'pricing');
                      setMobileMenuOpen(false);
                    }}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {t('header.pricing')}
                  </a>
                  <a
                    href="#faq"
                    onClick={(e) => {
                      scrollToSection(e, 'faq');
                      setMobileMenuOpen(false);
                    }}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {t('header.faq')}
                  </a>
                </div>
                <div className="py-6 space-y-2">
                  <div className="mb-4">
                    <LanguageSwitcher />
                  </div>
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {t('header.login')}
                  </a>
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 bg-nile-teal text-white text-center hover:bg-nile-teal/90"
                  >
                    {t('header.signup')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section with 3D jewelry viewer */}
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
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <a
                    href="/auth/login"
                    className="rounded-md bg-nile-teal px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-nile-teal/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nile-teal transition-all hover:shadow-md"
                  >
                    {t('hero.getStarted')}
                  </a>
                  <Link
                    href="/try-and-fit"
                    className="rounded-md bg-pharaonic-gold px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-pharaonic-gold/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pharaonic-gold transition-all hover:shadow-md flex items-center justify-center"
                  >
                    <SparklesIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    {t('hero.tryAndFit') || 'Try & Fit'}
                  </Link>
                </motion.div>
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    The first jewelry digital ecosystem worldwide
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
                  <JewelryViewer metalType="gold" gemType="emerald" />
                </div>
                <div className="flex justify-center mt-4 space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pharaonic-gold/10 text-pharaonic-gold">
                    Pharaonic Gold
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-nile-teal/10 text-nile-teal">
                    Nile Teal
                  </span>
                </div>
                <p className="text-center mt-2 text-sm text-gray-500">
                  AI-powered 3D visualization ✨
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section with images */}
      <section id="features" className="py-20 bg-white">
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
          
          {/* Feature cards with links to feature pages */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${feature.color} opacity-30 z-0`}></div>
                
                <div className="relative z-10 p-6">
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-nile-teal text-white mb-4">
                    <feature.icon className="h-8 w-8" aria-hidden="true" />
                  </div>
                  
                  <h3 className="text-xl font-semibold leading-8 text-gray-900 mb-2">{feature.name}</h3>
                  <p className="text-base leading-7 text-gray-600 mb-6 line-clamp-3">{feature.description}</p>
                  
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-pharaonic-gold">{feature.stat}</span>
                      <span className="ml-2 text-sm text-gray-500">{feature.statText}</span>
                    </div>
                    
                    <Link 
                      href={feature.url}
                      className="inline-flex items-center px-3 py-1.5 rounded-md bg-nile-teal/10 text-nile-teal hover:bg-nile-teal/20 transition-colors text-sm font-medium"
                    >
                      Learn More 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
                
                <div className="absolute top-0 right-0 h-24 w-24 opacity-10 rounded-bl-full bg-nile-teal"></div>
              </motion.div>
            ))}
          </div>
          
          {/* Explore all features button */}
          <div className="mt-12 text-center">
            <Link
              href="/features"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-nile-teal hover:bg-opacity-90 transition-colors"
            >
              Explore All Features
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          {/* Features stats grid */}
          <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div 
                key={`stat-${feature.name}`} 
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
              <div className="flex justify-center items-center space-x-4 rtl:space-x-reverse">
                <a href="#" className="text-gray-400 hover:text-pharaonic-gold transition mx-2 transform hover:scale-110">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-pharaonic-gold transition mx-2 transform hover:scale-110">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-pharaonic-gold transition mx-2 transform hover:scale-110">
                  <span className="sr-only">Twitter</span>
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
            </>
          )}
        </div>
      </footer>
    </main>
  );
}