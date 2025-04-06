'use client'; // Uses motion

import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';
import { TFunction } from 'i18next';

interface PricingSectionProps {
  t: TFunction;
  isRTL: boolean; // Keep for consistency, though not used in this specific JSX
}

export function PricingSection({ t, isRTL }: PricingSectionProps) {
  // Define pricing tiers directly within the component for clarity
  const pricingTiers = [
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
      highlighted: false,
      href: "/auth/signup?plan=free" // Example link
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
      highlighted: true,
      href: "/auth/signup?plan=professional" // Example link
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
      highlighted: false,
      href: "/contact-sales?plan=enterprise" // Example link
    }
  ];

  return (
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
          {pricingTiers.map((tier, index) => (
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
                  {tier.price !== t('pricing.enterprise.price') && <span className={`text-sm font-semibold leading-6 ${tier.highlighted ? 'text-white/80' : 'text-gray-600'}`}>{t('pricing.oneTime', '/ one-time')}</span>} { /* Added default value */}
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
                href={tier.href} // Use defined href
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
  );
} 