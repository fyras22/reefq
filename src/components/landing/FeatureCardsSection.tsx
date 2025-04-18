'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CubeIcon, 
  SparklesIcon, 
  ChartBarIcon, 
  ShieldCheckIcon, 
  DevicePhoneMobileIcon, 
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { TFunction } from 'i18next';
import Image from 'next/image';

interface FeatureCardsSectionProps {
  t: TFunction;
  isRTL: boolean;
}

export function FeatureCardsSection({ t, isRTL }: FeatureCardsSectionProps) {
  // Define feature cards
  const featureCards = [
    {
      id: 'visualization',
      title: t('featureCards.visualization.title'),
      description: t('featureCards.visualization.description'),
      icon: CubeIcon,
      color: 'bg-gradient-to-br from-emerald-500 to-teal-700',
      delay: 0.1
    },
    {
      id: 'tryOn',
      title: t('featureCards.tryOn.title'),
      description: t('featureCards.tryOn.description'),
      icon: DevicePhoneMobileIcon,
      color: 'bg-gradient-to-br from-amber-500 to-yellow-700',
      delay: 0.2
    },
    {
      id: 'customization',
      title: t('featureCards.customization.title'),
      description: t('featureCards.customization.description'),
      icon: SparklesIcon,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-700',
      delay: 0.3
    },
    {
      id: 'sizing',
      title: t('featureCards.sizing.title'),
      description: t('featureCards.sizing.description'),
      icon: ChartBarIcon,
      color: 'bg-gradient-to-br from-purple-500 to-violet-700',
      delay: 0.4
    },
    {
      id: 'security',
      title: t('featureCards.security.title'),
      description: t('featureCards.security.description'),
      icon: ShieldCheckIcon,
      color: 'bg-gradient-to-br from-red-500 to-pink-700',
      delay: 0.5
    },
    {
      id: 'ai',
      title: t('featureCards.ai.title'),
      description: t('featureCards.ai.description'),
      icon: LightBulbIcon,
      color: 'bg-gradient-to-br from-pharaonic-gold to-amber-700',
      delay: 0.6
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            {t('featureCards.sectionTitle')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-2xl text-lg text-gray-600 mx-auto"
          >
            {t('featureCards.sectionDescription')}
          </motion.p>
        </div>

        <motion.div 
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {featureCards.map((feature) => (
            <motion.div
              key={feature.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className={`${feature.color} p-5 h-24 flex items-center justify-center`}>
                <feature.icon className="h-10 w-10 text-white" aria-hidden="true" />
              </div>
              <div className="px-6 py-5">
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured jewelry showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 relative"
        >
          <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/jewelry-showcase.webp"
              alt={t('featureCards.showcaseAlt')}
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-nile-teal/70 to-transparent flex items-center">
              <div className="max-w-lg px-8 py-6">
                <h3 className="text-2xl font-bold text-white mb-3">
                  {t('featureCards.showcase.title')}
                </h3>
                <p className="text-white/90">
                  {t('featureCards.showcase.description')}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pharaonic-gold"
                >
                  {t('featureCards.showcase.cta')}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 