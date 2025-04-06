'use client'; // Hero section uses motion and links, keep client directive if needed?

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { JewelryViewer } from '@/components/JewelryViewer'; // Assuming JewelryViewer exists
import { TFunction } from 'i18next';

interface HeroSectionProps {
  t: TFunction;
  isRTL: boolean;
}

export function HeroSection({ t, isRTL }: HeroSectionProps) {
  return (
    <section className="bg-bg-light pt-16 sm:pt-20 md:pt-24">
      <div className="relative isolate px-6 lg:px-8">
        <div className="mx-auto max-w-7xl py-12 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className={`text-center lg:${isRTL ? 'text-right' : 'text-left'}`}
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
              <div className={`mt-8 flex gap-x-4 ${isRTL ? 'flex-row-reverse' : ''} justify-center lg:${isRTL ? 'justify-end' : 'justify-start'} flex-wrap`}>
                <Link
                  href="/jewelry"
                  className="rounded-md bg-nile-teal px-4 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:bg-opacity-90 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 mb-2 sm:mb-0"
                >
                  {t('hero.browseButton')}
                </Link>
                <Link
                  href="/try-and-fit"
                  className="rounded-md border border-pharaonic-gold px-4 py-3 text-sm font-semibold text-pharaonic-gold shadow-sm hover:bg-pharaonic-gold hover:text-white transition-all group mb-2 sm:mb-0"
                >
                  <span className="group-hover:text-white transition-colors">{t('hero.tryOnButton')}</span>
                </Link>
              </div>
              <div className="mt-6">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  {t('hero.tagline')}
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
                {isRTL && (
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
                    <div className="absolute top-0 left-0 right-0 h-6 bg-pharaonic-gold/10 border-b border-pharaonic-gold/20"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-pharaonic-gold/10 border-t border-pharaonic-gold/20"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-6 bg-pharaonic-gold/10 border-r border-pharaonic-gold/20"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-6 bg-pharaonic-gold/10 border-l border-pharaonic-gold/20"></div>
                    <div className="absolute top-2 left-2 right-2 h-1 bg-pharaonic-gold/30"></div>
                    <div className="absolute bottom-2 left-2 right-2 h-1 bg-pharaonic-gold/30"></div>
                    <div className="absolute left-2 top-2 bottom-2 w-1 bg-pharaonic-gold/30"></div>
                    <div className="absolute right-2 top-2 bottom-2 w-1 bg-pharaonic-gold/30"></div>
                  </div>
                )}
                <JewelryViewer
                  modelPath="/models/diamond_engagement_ring.glb"
                  selectedMetal="gold"
                  selectedGem="diamond"
                />
              </div>
              <div className={`flex justify-center mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pharaonic-gold/10 text-pharaonic-gold ${isRTL ? 'ml-2' : 'mr-2'}`}>
                  {t('hero.colors.pharaonicGold')}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-nile-teal/10 text-nile-teal">
                  {t('hero.colors.nileTeal')}
                </span>
              </div>
              <p className="text-center mt-2 text-sm text-gray-500">
                {t('hero.aiPowered')}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 