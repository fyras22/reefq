'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TFunction } from 'i18next';
import { CheckIcon } from '@heroicons/react/24/outline';

interface PricingSectionProps {
  t: TFunction;
  isRTL: boolean;
}

export function PricingSection({ t, isRTL }: PricingSectionProps) {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            {t('pricing.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-2xl text-lg text-gray-600 mx-auto"
          >
            {t('pricing.description')}
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {/* Free tier */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="px-6 py-8">
              <h3 className="text-lg font-semibold text-gray-900">{t('pricing.free.name')}</h3>
              <p className="mt-4 text-3xl font-bold text-gray-900">{t('pricing.free.price')}</p>
              <p className="mt-1 text-sm text-gray-500">{t('pricing.oneTime')}</p>
              <p className="mt-4 text-gray-600">{t('pricing.free.description')}</p>
              <ul className="mt-6 space-y-4">
                {[0, 1, 2, 3].map((featureIndex) => (
                  <li key={featureIndex} className="flex">
                    <CheckIcon className="h-5 w-5 text-nile-teal shrink-0" />
                    <span className="ml-3 text-gray-500">
                      {t(`pricing.free.features.${featureIndex}`)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <a
                  href="#"
                  className="block w-full rounded-md border border-nile-teal py-2 text-center text-sm font-semibold text-nile-teal shadow-sm hover:bg-nile-teal hover:text-white"
                >
                  {t('pricing.free.cta')}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Professional tier */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 relative border-2 border-nile-teal"
          >
            <div className="absolute top-0 w-full bg-nile-teal py-1.5 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-white">
                {t('pricing.mostPopular')}
              </p>
            </div>
            <div className="px-6 py-8 pt-12">
              <h3 className="text-lg font-semibold text-gray-900">{t('pricing.professional.name')}</h3>
              <p className="mt-4 text-3xl font-bold text-gray-900">{t('pricing.professional.price')}</p>
              <p className="mt-1 text-sm text-gray-500">{t('pricing.oneTime')}</p>
              <p className="mt-4 text-gray-600">{t('pricing.professional.description')}</p>
              <ul className="mt-6 space-y-4">
                {[0, 1, 2, 3, 4, 5].map((featureIndex) => (
                  <li key={featureIndex} className="flex">
                    <CheckIcon className="h-5 w-5 text-nile-teal shrink-0" />
                    <span className="ml-3 text-gray-500">
                      {t(`pricing.professional.features.${featureIndex}`)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <a
                  href="#"
                  className="block w-full rounded-md bg-nile-teal py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-nile-teal-dark"
                >
                  {t('pricing.professional.cta')}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Enterprise tier */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="px-6 py-8">
              <h3 className="text-lg font-semibold text-gray-900">{t('pricing.enterprise.name')}</h3>
              <p className="mt-4 text-3xl font-bold text-gray-900">{t('pricing.enterprise.price')}</p>
              <p className="mt-1 text-sm text-gray-500">{t('pricing.contactUs')}</p>
              <p className="mt-4 text-gray-600">{t('pricing.enterprise.description')}</p>
              <ul className="mt-6 space-y-4">
                {[0, 1, 2, 3, 4, 5].map((featureIndex) => (
                  <li key={featureIndex} className="flex">
                    <CheckIcon className="h-5 w-5 text-nile-teal shrink-0" />
                    <span className="ml-3 text-gray-500">
                      {t(`pricing.enterprise.features.${featureIndex}`)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <a
                  href="#"
                  className="block w-full rounded-md border border-nile-teal py-2 text-center text-sm font-semibold text-nile-teal shadow-sm hover:bg-nile-teal hover:text-white"
                >
                  {t('pricing.enterprise.cta')}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 