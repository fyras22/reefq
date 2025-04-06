'use client'; // Uses motion

import { motion } from 'framer-motion';
import Image from 'next/image';
import { TFunction } from 'i18next';
import React from 'react';

// Define the structure of a feature item, including the Icon component type
interface FeatureItem {
  name: string;
  description: string;
  icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & { title?: string | undefined; titleId?: string | undefined; } & React.RefAttributes<SVGSVGElement>>;
  stat: string;
  statText: string;
}

interface CoreFeaturesSectionProps {
  t: TFunction;
  isRTL: boolean;
  features: FeatureItem[]; // Pass the features array
}

export function CoreFeaturesSection({ t, isRTL, features }: CoreFeaturesSectionProps) {
  return (
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
              alt={t('features.decorativeAlt', 'Featured jewelry showcase')} // Added default alt
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              priority // Keep priority if this image is critical for LCP
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
  );
} 