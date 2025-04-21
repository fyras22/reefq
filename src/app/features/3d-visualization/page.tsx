'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/app/i18n';

export default function VisualizationFeature() {
  const { t } = useTranslation();
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Set RTL status
    setIsRTL(document.documentElement.dir === 'rtl');
  }, []);

  return (
    <main className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {t('features.3dVisualization.name') || '3D Visualization'}
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            {t('features.3dVisualization.description') || 'Stunning jewelry display allowing customers to see every detail of the piece'}
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
              <Link
                href="/customize"
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-nile-teal hover:bg-opacity-90 sm:px-8"
              >
                {t('howItWorks.cta') || 'Start Designing Now'}
              </Link>
              <Link
                href="/try-on"
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-nile-teal bg-white border-nile-teal hover:bg-gray-50 sm:px-8"
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
              src="/images/features/3d-visualization.jpg" 
              alt="3D Jewelry Visualization" 
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
            Our 3D visualization technology offers unparalleled detail and interactivity
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Photorealistic Rendering</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Our advanced rendering technology creates lifelike jewelry models that showcase every detail, material finish, and gemstone brilliance.
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">360° Rotation</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Customers can rotate and view jewelry pieces from any angle, enabling a comprehensive understanding of the piece's design and details.
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Material Customization</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Switch between different metals, gemstones, and finishes in real-time to create the perfect piece that matches customer preferences.
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
              Trusted by jewelry retailers worldwide
            </h2>
            <p className="mt-3 text-xl text-teal-100">
              Our 3D visualization technology drives engagement and increases sales
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-teal-100">
                Increase in customer engagement
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                +137%
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-teal-100">
                Reduction in returns
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                -42%
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-teal-100">
                Sales conversion increase
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                +58%
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
          <Link href="/features/virtual-try-on" className="group">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <Image
                src="/images/features/virtual-try-on.jpg"
                alt="Virtual Try-On"
                width={600}
                height={400}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse justify-start' : 'justify-between'}`}>
                  <h3 className="text-xl font-bold text-white">
                    Virtual Try-On
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