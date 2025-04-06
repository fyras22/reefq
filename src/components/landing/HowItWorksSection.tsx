'use client'; // Uses motion

import { motion } from 'framer-motion';
import { TFunction } from 'i18next';

interface HowItWorksSectionProps {
  t: TFunction;
  isRTL: boolean;
}

export function HowItWorksSection({ t, isRTL }: HowItWorksSectionProps) {
  return (
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
              {/* Using Link for consistency, assuming CTA leads somewhere */}
              <a href="#" className="inline-block rounded-md bg-pharaonic-gold px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all">
                {t('howItWorks.cta')}
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 