'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CubeIcon, SparklesIcon, ChartBarIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { JewelryViewer } from '../components/JewelryViewer';
import { useTranslation } from '@/app/i18n-client';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { FaqItem } from '@/components/landing/FaqItem';
import { LandingFooter } from '@/components/landing/LandingFooter'; // Import the new footer
import { HeroSection } from '@/components/landing/HeroSection'; // Import the new HeroSection
import { FeatureCardsSection } from '@/components/landing/FeatureCardsSection'; // Import the new section
import { CoreFeaturesSection } from '@/components/landing/CoreFeaturesSection'; // Import the new section
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'; // Import the new section
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'; // Import the new section
import { PricingSection } from '@/components/landing/PricingSection'; // Import the new section
import VirtualTryOnSection from '@/components/landing/VirtualTryOnSection'; // Corrected default import
import PerformanceSection from '@/components/landing/PerformanceSection'; // Corrected default import
import ComparisonToolSection from '@/components/landing/ComparisonToolSection'; // Corrected default import
import FaqSection from '@/components/landing/FaqSection'; // Default import

export default function Home() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const isRTL = ['ar'].includes(i18n.language);

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

      {/* Render the new Header component */}
      <LandingHeader t={t} isRTL={isRTL} scrolled={scrolled} />

      {/* Render the new Hero section */}
      <HeroSection t={t} isRTL={isRTL} />

      {/* Render the new Feature Cards section */}
      <FeatureCardsSection t={t} isRTL={isRTL} />

      {/* Render the new Core Features section */}
      <CoreFeaturesSection t={t} isRTL={isRTL} features={features} />

      {/* Render the new How It Works section */}
      <HowItWorksSection t={t} isRTL={isRTL} />

      {/* Render the new Testimonials section */}
      <TestimonialsSection t={t} isRTL={isRTL} testimonials={testimonials} />

      {/* Render the new Pricing section */}
      <PricingSection t={t} isRTL={isRTL} />

      {/* Render the new Virtual Try-On section */}
      <VirtualTryOnSection t={t} isRTL={isRTL} />

      {/* Render the new Performance Metrics section */}
      <PerformanceSection t={t} />
      
      {/* Render the new Comparison Tool section */}
      <ComparisonToolSection t={t} isRTL={isRTL} />

      {/* Render the new FAQ section */}
      <FaqSection t={t} isRTL={isRTL} faqs={faqs} />

      {/* Render the new Footer component */}
      <LandingFooter t={t} isRTL={isRTL} />
    </main>
  );
}