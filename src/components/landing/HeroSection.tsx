'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { TFunction } from 'i18next';

interface HeroSectionProps {
  t: TFunction;
  isRTL: boolean;
}

export function HeroSection({ t, isRTL }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-32 sm:pb-24 lg:pb-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-0 -mt-16 opacity-30 blur-3xl">
          <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#C4A265" d="M33.5,-52.6C46.6,-44.9,62.1,-41.1,71.9,-31C81.7,-20.8,85.7,-4.3,79.7,8.5C73.6,21.3,57.5,30.5,44.1,41.5C30.8,52.6,20.3,65.6,5.6,70.9C-9.1,76.2,-27.8,73.8,-42.5,64.6C-57.2,55.5,-67.8,39.7,-71.8,23.5C-75.7,7.3,-73,-9.3,-64.9,-21.4C-56.8,-33.5,-43.4,-41.1,-31.1,-49.3C-18.9,-57.4,-7.8,-66.2,1.5,-68.3C10.9,-70.4,20.4,-60.3,33.5,-52.6Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="absolute left-1/4 bottom-0 opacity-20 blur-3xl">
          <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#2A5B5E" d="M42.7,-76.5C56.9,-69.2,71.2,-60.4,79.3,-47.5C87.4,-34.6,89.4,-17.3,88.9,-0.3C88.3,16.8,85.3,33.5,77.2,47.6C69.1,61.7,55.8,73.1,40.6,79.9C25.4,86.8,8.2,89.1,-9.2,87.7C-26.6,86.4,-44.1,81.4,-58.4,71.5C-72.7,61.5,-83.7,46.5,-88.2,30C-92.6,13.4,-90.5,-4.7,-85.2,-21.7C-79.9,-38.7,-71.4,-54.7,-58.7,-62.8C-46,-70.9,-29.2,-71.2,-13.5,-72.9C2.1,-74.5,17.1,-77.5,31.1,-77.6C45.1,-77.7,57.2,-75,70.5,-67.9Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className={`flex flex-col lg:flex-row ${isRTL ? 'lg:flex-row-reverse' : ''} items-center gap-x-8 gap-y-16`}>
          {/* Hero Text Content */}
          <div className="lg:w-1/2 lg:flex-auto text-center lg:text-left">
            {/* Animated greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-nile-teal bg-opacity-10 text-nile-teal ring-1 ring-inset ring-nile-teal/20">
                {t('hero.badge')}
              </span>
            </motion.div>
            
            {/* Animated heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            >
              <span className="block mb-2">{t('hero.title1')}</span>
              <span className="block text-pharaonic-gold">{t('hero.title2')}</span>
            </motion.h1>
            
            {/* Animated description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-gray-600 max-w-xl mx-auto lg:mx-0"
            >
              {t('hero.description')}
            </motion.p>
            
            {/* Animated CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
            >
              <a
                href="#virtual-try-on"
                className="rounded-md bg-nile-teal px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-nile-teal/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nile-teal transition-all duration-200 flex items-center justify-center gap-2"
              >
                {t('hero.ctaPrimary')}
                <ArrowRightIcon className="h-4 w-4" />
              </a>
              <a
                href="#features"
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
              >
                {t('hero.ctaSecondary')}
              </a>
            </motion.div>
            
            {/* Animated Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8"
            >
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-100 p-1">
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-500">{t('hero.trustBadge1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-100 p-1">
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-500">{t('hero.trustBadge2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-100 p-1">
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-500">{t('hero.trustBadge3')}</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 relative"
          >
            <div className="aspect-[4/3] w-full rounded-2xl bg-gray-50 object-cover lg:aspect-[1/1] lg:h-[34rem] overflow-hidden shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/hero-jewelry.webp"
                  alt={t('hero.imageAlt')}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              
              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -top-6 left-10 bg-white rounded-lg shadow-lg p-3 flex items-center gap-3"
              >
                <div className="rounded-full bg-nile-teal/10 p-2">
                  <svg className="h-6 w-6 text-nile-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">{t('hero.badge1Title')}</p>
                  <p className="text-sm font-semibold text-gray-900">{t('hero.badge1Text')}</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute -bottom-6 right-10 bg-white rounded-lg shadow-lg p-3 flex items-center gap-3"
              >
                <div className="rounded-full bg-pharaonic-gold/10 p-2">
                  <svg className="h-6 w-6 text-pharaonic-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">{t('hero.badge2Title')}</p>
                  <p className="text-sm font-semibold text-gray-900">{t('hero.badge2Text')}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 