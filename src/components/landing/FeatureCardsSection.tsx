'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { TFunction } from 'i18next';

interface FeatureCardsSectionProps {
  t: TFunction;
  isRTL: boolean;
}

export function FeatureCardsSection({ t, isRTL }: FeatureCardsSectionProps) {
  return (
    <section className="bg-bg-light py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-nile-teal font-serif">
            {t('features.exploreTitle')}
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            {t('features.exploreSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Jewelry Collection */}
          <Link href="/jewelry" className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow border border-gray-100">
              <div className="h-48 bg-nile-teal/10 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/images/feature-jewelry.jpg"
                    alt={t('features.browseCollection.alt', 'Jewelry Collection')}
                    width={200}
                    height={150}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 200px"
                  />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-nile-teal transition-colors">
                  {t('features.browseCollection.title')}
                </h3>
                <p className="mt-2 text-gray-600">
                  {t('features.browseCollection.description')}
                </p>
                <div className="mt-4 flex items-center text-nile-teal font-medium">
                  {t('features.browseCollection.cta')}
                  <ArrowRightIcon className={`${isRTL ? 'mr-2 transform rotate-180' : 'ml-2'} h-4 w-4 group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`} />
                </div>
              </div>
            </div>
          </Link>

          {/* Virtual Try-On */}
          <Link href="/try-and-fit" className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow border border-gray-100">
              <div className="h-48 bg-pharaonic-gold/10 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/images/feature-try-on.jpg"
                    alt={t('features.virtualTryOnAlt', 'Virtual Try-On')}
                    width={200}
                    height={150}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 200px"
                  />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-pharaonic-gold transition-colors">
                  {t('features.virtualTryOn.title')}
                </h3>
                <p className="mt-2 text-gray-600">
                  {t('features.virtualTryOn.description')}
                </p>
                <div className="mt-4 flex items-center text-pharaonic-gold font-medium">
                  {t('features.virtualTryOn.cta')}
                  <ArrowRightIcon className={`${isRTL ? 'mr-2 transform rotate-180' : 'ml-2'} h-4 w-4 group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`} />
                </div>
              </div>
            </div>
          </Link>

          {/* Customize */}
          <Link href="/customize" className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow border border-gray-100">
              <div className="h-48 bg-nile-teal/10 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/images/feature-customize.jpg"
                    alt={t('features.designYourOwnAlt', 'Customize Jewelry')}
                    width={200}
                    height={150}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 200px"
                  />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-nile-teal transition-colors">
                  {t('features.designYourOwn.title')}
                </h3>
                <p className="mt-2 text-gray-600">
                  {t('features.designYourOwn.description')}
                </p>
                <div className="mt-4 flex items-center text-nile-teal font-medium">
                  {t('features.designYourOwn.cta')}
                  <ArrowRightIcon className={`${isRTL ? 'mr-2 transform rotate-180' : 'ml-2'} h-4 w-4 group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`} />
                </div>
              </div>
            </div>
          </Link>

          {/* Knowledge Hub */}
          <Link href="/knowledge" className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow border border-gray-100">
              <div className="h-48 bg-pharaonic-gold/10 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/images/feature-knowledge.jpg"
                    alt={t('features.knowledgeHubAlt', 'Knowledge Hub')}
                    width={200}
                    height={150}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 200px"
                  />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-pharaonic-gold transition-colors">
                  {t('features.knowledgeHub.title')}
                </h3>
                <p className="mt-2 text-gray-600">
                  {t('features.knowledgeHub.description')}
                </p>
                <div className="mt-4 flex items-center text-pharaonic-gold font-medium">
                  {t('features.knowledgeHub.cta')}
                  <ArrowRightIcon className={`${isRTL ? 'mr-2 transform rotate-180' : 'ml-2'} h-4 w-4 group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`} />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
} 