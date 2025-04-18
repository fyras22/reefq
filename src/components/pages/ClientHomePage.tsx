'use client';

import { useState, useEffect, Suspense, lazy, useMemo } from 'react';
import { useTranslation } from '@/app/i18n-client';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureCardsSection } from '@/components/landing/FeatureCardsSection';
import { CoreFeaturesSection } from '@/components/landing/CoreFeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
// Lazy load non-critical sections
const PricingSection = lazy(() => import('@/components/landing/PricingSection').then(mod => ({ default: mod.PricingSection })));
const VirtualTryOnSection = lazy(() => import('@/components/landing/VirtualTryOnSection'));
const PerformanceSection = lazy(() => import('@/components/landing/PerformanceSection'));
const ComparisonToolSection = lazy(() => import('@/components/landing/ComparisonToolSection'));
const FaqSection = lazy(() => import('@/components/landing/FaqSection'));
import { LandingFooter } from '@/components/landing/LandingFooter';
import { CubeIcon, SparklesIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import AdvancedSEO from '@/components/seo/AdvancedSEO';

interface ClientHomePageProps {
  lang: string;
}

export default function ClientHomePage({ lang }: ClientHomePageProps) {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  
  // Initialize language and load translations
  useEffect(() => {
    const initializeLanguage = async () => {
      if (lang) {
        // Use i18n change language directly instead of loadTranslations
        i18n.changeLanguage(lang);
      } else {
        // Detect language from browser or user preferences
        const detectedLang = 
          (typeof window !== 'undefined' && window.navigator.language?.split('-')[0]) || 
          'en';
          
        i18n.changeLanguage(detectedLang);
      }
      
      // Set RTL status
      setIsRTL(['ar'].includes(i18n.language));
      setIsLoading(false);
    };
    
    initializeLanguage();
  }, [lang, i18n]);

  // Add scroll event listener for header and section highlighting
  useEffect(() => {
    const handleScroll = () => {
      // Handle header transformation
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
      
      // Handle section highlighting
      const sections = [
        'hero',
        'features',
        'core-features',
        'how-it-works',
        'testimonials',
        'pricing',
        'virtual-try-on',
        'performance',
        'comparison',
        'faq'
      ];
      
      // Find the current active section
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current && current !== activeSection) {
        setActiveSection(current);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled, activeSection]);
  
  // Use useMemo to prevent recreation of these arrays on every render
  const features = useMemo(() => [
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
  ], [t]);

  // Generate testimonials array from translations
  const testimonials = useMemo(() => [
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
  ], [t]);

  // Generate faqs array from translations
  const faqs = useMemo(() => [
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
  ], [t]);

  // SEO data
  const seoData = useMemo(() => ({
    title: t('seo.title') || 'Reefq - AI-Powered Jewelry Visualization',
    description: t('seo.description') || 'Revolutionizing jewelry retail with AI-powered 3D visualization. Try, customize, and perfect your jewelry online.',
    openGraph: {
      title: t('seo.ogTitle') || 'Reefq - The Future of Jewelry Shopping',
      description: t('seo.ogDescription') || 'Experience jewelry like never before with our AI-powered 3D visualization.',
      type: 'website',
      site_name: 'Reefq',
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Reefq Jewelry Visualization'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image' as const,
      site: '@reefq',
      image: '/images/twitter-image.jpg'
    }
  }), [t]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-nile-teal/20 border-t-nile-teal rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <>
      <AdvancedSEO
        title={seoData.title}
        description={seoData.description}
        openGraph={seoData.openGraph}
        twitter={seoData.twitter}
      />
      
      <AnimatePresence>
        <motion.main 
          className={`bg-white ${isRTL ? 'rtl' : 'ltr'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
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

          <LandingHeader t={t} isRTL={isRTL} scrolled={scrolled} activeSection={activeSection} />
          
          <div id="hero">
            <HeroSection t={t} isRTL={isRTL} />
          </div>
          
          <div id="features">
            <FeatureCardsSection t={t} isRTL={isRTL} />
          </div>
          
          <div id="core-features">
            <CoreFeaturesSection t={t} isRTL={isRTL} features={features} />
          </div>
          
          <div id="how-it-works">
            <HowItWorksSection t={t} isRTL={isRTL} />
          </div>
          
          <div id="testimonials">
            <TestimonialsSection t={t} isRTL={isRTL} testimonials={testimonials} />
          </div>
          
          {/* Lazy loaded sections */}
          <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-4 border-t-nile-teal border-nile-teal/20 rounded-full animate-spin"></div></div>}>
            <div id="pricing">
              <PricingSection t={t} isRTL={isRTL} />
            </div>
          </Suspense>
          
          <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-4 border-t-nile-teal border-nile-teal/20 rounded-full animate-spin"></div></div>}>
            <div id="virtual-try-on">
              <VirtualTryOnSection t={t} isRTL={isRTL} />
            </div>
          </Suspense>
          
          <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-4 border-t-nile-teal border-nile-teal/20 rounded-full animate-spin"></div></div>}>
            <div id="performance">
              <PerformanceSection t={t} />
            </div>
          </Suspense>
          
          <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-4 border-t-nile-teal border-nile-teal/20 rounded-full animate-spin"></div></div>}>
            <div id="comparison">
              <ComparisonToolSection t={t} isRTL={isRTL} />
            </div>
          </Suspense>
          
          <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-4 border-t-nile-teal border-nile-teal/20 rounded-full animate-spin"></div></div>}>
            <div id="faq">
              <FaqSection t={t} isRTL={isRTL} faqs={faqs} />
            </div>
          </Suspense>
          
          <LandingFooter t={t} isRTL={isRTL} />
          
          {/* Back to top button */}
          <motion.button
            className="fixed bottom-8 right-8 z-50 p-2 rounded-full bg-pharaonic-gold shadow-xl text-white"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            initial={{ opacity: 0, y: 100 }}
            animate={{ 
              opacity: scrolled ? 1 : 0, 
              y: scrolled ? 0 : 100 
            }}
            transition={{ duration: 0.3 }}
            aria-label="Back to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </motion.button>
        </motion.main>
      </AnimatePresence>
    </>
  );
} 