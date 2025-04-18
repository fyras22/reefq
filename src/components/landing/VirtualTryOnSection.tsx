'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TFunction } from 'i18next';
import Image from 'next/image';
import Link from 'next/link';
import { DevicePhoneMobileIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface VirtualTryOnSectionProps {
  t: TFunction;
  isRTL: boolean;
}

export default function VirtualTryOnSection({ t, isRTL }: VirtualTryOnSectionProps) {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col lg:flex-row ${isRTL ? 'lg:flex-row-reverse' : ''} items-center gap-12`}>
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('virtualTryOn.title')}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('virtualTryOn.description')}
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-nile-teal/10 text-nile-teal">
                    <DevicePhoneMobileIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('virtualTryOn.feature1.title')}
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    {t('virtualTryOn.feature1.description')}
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-nile-teal/10 text-nile-teal">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-.244l.586-.886c.217-.433.131-.956-.21-1.298L13.5 6.11a6 6 0 00-3.815-1.872l-.917-.018z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('virtualTryOn.feature2.title')}
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    {t('virtualTryOn.feature2.description')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <Link 
                href="/try-and-fit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-nile-teal hover:bg-nile-teal-dark"
              >
                {t('virtualTryOn.cta')}
                <ArrowRightIcon className={`ml-2 h-5 w-5 ${isRTL ? 'transform rotate-180' : ''}`} />
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/virtual-try-on.webp"
                alt={t('virtualTryOn.imageAlt')}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <p className="text-sm font-medium uppercase tracking-wider mb-2">
                    {t('virtualTryOn.demo')}
                  </p>
                  <div className="h-2.5 w-24 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating UI elements for decoration */}
            <div className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">{t('virtualTryOn.livePreview')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 