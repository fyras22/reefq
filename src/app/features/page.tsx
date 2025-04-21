'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/app/i18n';

export default function FeaturesIndexPage() {
  const { t } = useTranslation();
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Set RTL status
    setIsRTL(document.documentElement.dir === 'rtl');
  }, []);

  // Features data
  const features = [
    {
      id: '3d-visualization',
      name: t('features.3dVisualization.name') || '3D Visualization',
      description: t('features.3dVisualization.description') || 'Stunning jewelry display allowing customers to see every detail of the piece',
      stat: '+137%',
      statText: t('features.3dVisualization.statText') || 'increase in customer engagement',
      image: '/images/features/3d-visualization.jpg',
      color: 'from-teal-50'
    },
    {
      id: 'virtual-try-on',
      name: t('features.arTryOn.name') || 'Virtual Try-On',
      description: t('features.arTryOn.description') || 'Allows customers to virtually try on jewelry, reducing returns',
      stat: '-42%',
      statText: t('features.arTryOn.statText') || 'reduction in returns',
      image: '/images/features/virtual-try-on.jpg',
      color: 'from-purple-50'
    },
    {
      id: 'size-optimization',
      name: t('features.sizeOptimization.name') || 'Size Optimization',
      description: t('features.sizeOptimization.description') || 'Advanced algorithms providing accurate size suggestions based on customer data',
      stat: '+89%',
      statText: t('features.sizeOptimization.statText') || 'increase in size accuracy',
      image: '/images/features/size-optimization.jpg',
      color: 'from-amber-50'
    }
  ];

  return (
    <main className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {t('features.title') || 'Immersive Jewelry Shopping'}
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            {t('features.subtitle') || 'Transform the customer experience with advanced 3D technologies'}
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
      </div>

      {/* Features section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-24">
          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              className={`relative ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'} lg:flex lg:items-center lg:gap-16`}
            >
              {/* Image side */}
              <div className="lg:w-1/2">
                <div className={`relative bg-gradient-to-b ${feature.color} to-white rounded-2xl overflow-hidden shadow-xl`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <Image
                    src={feature.image}
                    alt={feature.name}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-800">
                      {feature.stat} {feature.statText}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Content side */}
              <div className="mt-12 lg:mt-0 lg:w-1/2">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  {feature.name}
                </h2>
                <p className="mt-4 text-lg text-gray-500">
                  {feature.description}
                </p>
                <div className="mt-8">
                  <Link href={`/features/${feature.id}`} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-nile-teal hover:bg-opacity-90 transition-colors">
                    Learn More
                    <ArrowRightIcon className="ml-2 h-5 w-5 text-white" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits section */}
      <div className="bg-nile-teal">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              The benefits of 3D jewelry visualization
            </h2>
            <p className="mt-3 text-xl text-teal-100">
              Our platform provides tangible benefits for jewelry retailers
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-4 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-teal-100">
                Return rate reduction
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                42%
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-teal-100">
                Increase in engagement
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                137%
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-teal-100">
                Conversion increase
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                58%
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-teal-100">
                Size accuracy improvement
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                89%
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Ready to transform your jewelry shopping experience?
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          Start using our platform today and provide your customers with an immersive jewelry shopping experience
        </p>
        <div className="mt-8">
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-nile-teal hover:bg-opacity-90 transition-colors"
          >
            {t('header.getStarted') || 'Get Started'}
          </Link>
        </div>
      </div>
    </main>
  );
} 