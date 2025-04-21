'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/app/i18n';

export default function SizeOptimizationFeature() {
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
            {t('features.sizeOptimization.name') || 'Size Optimization'}
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            {t('features.sizeOptimization.description') || 'Advanced algorithms providing accurate size suggestions based on customer data'}
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
                href="/try-and-fit"
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-nile-teal bg-white border-nile-teal hover:bg-gray-50 sm:px-8"
              >
                {t('header.tryAndFit') || 'Try & Fit'}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Feature image */}
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="overflow-hidden rounded-xl shadow-2xl">
            <Image 
              src="/images/features/size-optimization.jpg" 
              alt="Jewelry Size Optimization" 
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
            Our Size Optimization technology ensures perfect fit every time
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">AI-Powered Size Prediction</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Our machine learning algorithms analyze customer data to provide accurate size recommendations for any jewelry piece.
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Computer Vision Measurement</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Using just a photo of a hand or finger, our technology can determine precise ring and bracelet sizes with remarkable accuracy.
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Crowd-Sourced Data</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Our algorithm improves over time by learning from thousands of successful fittings, creating a more accurate sizing system.
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
              Accuracy that drives customer satisfaction
            </h2>
            <p className="mt-3 text-xl text-teal-100">
              Our Size Optimization technology increases fit accuracy and reduces exchanges
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-teal-100">
                Increase in size accuracy
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                +89%
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-teal-100">
                Reduction in size exchanges
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                -53%
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-teal-100">
                Customer satisfaction
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                96%
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
        </div>
      </div>
    </main>
  );
} 