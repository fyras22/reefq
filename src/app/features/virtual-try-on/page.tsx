'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/app/i18n';

export default function VirtualTryOnFeature() {
  const { t } = useTranslation();
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Set RTL status
    setIsRTL(document.documentElement.dir === 'rtl');
  }, []);

  return (
    <main className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {t('features.arTryOn.name') || 'Virtual Try-On'}
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            {t('features.arTryOn.description') || 'Allows customers to virtually try on jewelry, reducing returns'}
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
              <Link
                href="/try-on"
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-nile-teal hover:bg-opacity-90 sm:px-8"
              >
                {t('collections.tryVirtually') || 'Try Virtually'}
              </Link>
              <Link
                href="/customize"
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-nile-teal bg-white border-nile-teal hover:bg-gray-50 sm:px-8"
              >
                {t('howItWorks.cta') || 'Start Designing Now'}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Feature image */}
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="overflow-hidden rounded-xl shadow-2xl">
            <Image 
              src="/images/features/virtual-try-on.jpg" 
              alt="Virtual Jewelry Try-On" 
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
            Our Virtual Try-On technology offers a seamless and realistic experience
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Capability 1 */}
            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-nile-teal rounded-md shadow-lg">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Real-Time AR</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Our augmented reality technology uses your device's camera to provide real-time visualization of jewelry on your body.
                  </p>
                </div>
              </div>
            </div>

            {/* Capability 2 */}
            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-nile-teal rounded-md shadow-lg">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Precise Jewelry Placement</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Advanced tracking technology ensures jewelry appears in the right position, even as you move, for the most realistic experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Capability 3 */}
            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-nile-teal rounded-md shadow-lg">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Instant Customization</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Switch between different jewelry pieces, metals, and gemstones instantly while trying them on virtually.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-nile-teal">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Proven results for jewelry retailers
            </h2>
            <p className="mt-3 text-xl text-teal-100">
              Our Virtual Try-On technology reduces returns and increases purchase confidence
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-teal-100">
                Reduction in returns
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                -42%
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-teal-100">
                Purchase confidence
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                +75%
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-teal-100">
                Time spent on site
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                +64%
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
            Discover our complete suite of jewelry visualization tools
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
          
          <Link href="/features/size-optimization" className="group">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <Image
                src="/images/features/size-optimization.jpg"
                alt="Size Optimization"
                width={600}
                height={400}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse justify-start' : 'justify-between'}`}>
                  <h3 className="text-xl font-bold text-white">
                    Size Optimization
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