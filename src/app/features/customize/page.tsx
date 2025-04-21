'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/app/i18n';

export default function CustomizeFeature() {
  const { t } = useTranslation();
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Set RTL status
    setIsRTL(document.documentElement.dir === 'rtl');
  }, []);

  return (
    <main className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {t('features.customize.name') || 'Customize Jewelry'}
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            {t('features.customize.description') || 'Create your dream jewelry with our advanced customization tools'}
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
              <Link
                href="/customize"
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-500 hover:bg-opacity-90 sm:px-8"
              >
                {t('howItWorks.cta') || 'Start Designing Now'}
              </Link>
              <Link
                href="/try-on"
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-amber-500 bg-white border-amber-500 hover:bg-gray-50 sm:px-8"
              >
                {t('collections.tryVirtually') || 'Try Virtually'}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Feature image */}
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="overflow-hidden rounded-xl shadow-2xl">
            <Image 
              src="/images/features/customize.jpg" 
              alt="Jewelry Customization" 
              width={1200} 
              height={675}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* Key capabilities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Key Capabilities
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Our customization platform offers endless possibilities for creating unique jewelry
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Capability 1 */}
            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-amber-500 rounded-md shadow-lg">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Material Selection</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Choose from a wide range of precious metals including gold, silver, platinum, and more with various finishes.
                  </p>
                </div>
              </div>
            </div>

            {/* Capability 2 */}
            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-amber-500 rounded-md shadow-lg">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Gemstone Customization</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Select from diamonds, sapphires, emeralds, rubies, and other precious and semi-precious stones in various cuts and sizes.
                  </p>
                </div>
              </div>
            </div>

            {/* Capability 3 */}
            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-amber-500 rounded-md shadow-lg">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Personal Engraving</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Add a personal touch with custom engravings, including names, dates, or special messages in various fonts and styles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-amber-500">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              The power of personalization
            </h2>
            <p className="mt-3 text-xl text-amber-100">
              Our customization platform creates meaningful connections through personalized jewelry
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-amber-100">
                Unique combinations
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                +1000
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-amber-100">
                Customer satisfaction
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                98%
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-amber-100">
                Return rate
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                {"<1%"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Related features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Explore Related Features
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Discover our complete suite of jewelry tools
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <Link href="/features/3d-visualization" className="group">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <Image
                src="/images/features/3d-visualization.jpg"
                alt="3D Visualization"
                width={600}
                height={400}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse justify-start' : 'justify-between'}`}>
                  <h3 className="text-xl font-bold text-white">
                    3D Visualization
                  </h3>
                  <ArrowRightIcon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/features/collections" className="group">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <Image
                src="/images/features/collections.jpg"
                alt="Jewelry Collections"
                width={600}
                height={400}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse justify-start' : 'justify-between'}`}>
                  <h3 className="text-xl font-bold text-white">
                    Collections
                  </h3>
                  <ArrowRightIcon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
} 