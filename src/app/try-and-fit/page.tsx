'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n';
import { 
  CubeIcon, 
  ArrowRightIcon, 
  DevicePhoneMobileIcon,
  ViewfinderCircleIcon,
  SparklesIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';

// Dynamically import AR component with no SSR
const ARTryOn = dynamic(() => import('@/components/ARTryOn'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Loading AR Experience...</p>
      </div>
    </div>
  )
});

const TryAndFitPage = () => {
  const { t } = useTranslation();

  const features = [
    {
      name: 'AR Virtual Try-On',
      description: 'Try jewelry on your hand using our advanced augmented reality technology.',
      icon: DevicePhoneMobileIcon,
      color: 'bg-nile-teal',
      link: '/try-and-fit/ar'
    },
    {
      name: 'Ring Size Calculator',
      description: 'Find your perfect ring size with our multi-method measurement tools.',
      icon: ViewfinderCircleIcon,
      color: 'bg-pharaonic-gold',
      link: '/try-and-fit/size'
    },
    {
      name: '3D Jewelry Explorer',
      description: 'Examine jewelry pieces in detail with 360° interactive viewing.',
      icon: CubeIcon,
      color: 'bg-nile-teal',
      link: '/try-and-fit/explore'
    },
    {
      name: 'Style Compatibility',
      description: 'See how jewelry pieces match with different styles and outfits.',
      icon: SparklesIcon,
      color: 'bg-pharaonic-gold',
      link: '/try-and-fit/style'
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="bg-bg-light py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 font-serif">
                Try Before You Buy, <span className="text-nile-teal">Virtually</span>
              </h1>
              <p className="mt-4 text-xl text-gray-600 leading-relaxed">
                Experience jewelry like never before with our virtual try-on, precise sizing tools, 
                and interactive 3D visualization technology.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/try-and-fit/ar"
                  className="inline-flex items-center justify-center rounded-md bg-nile-teal px-5 py-3 text-base font-medium text-white shadow-md hover:bg-opacity-90 transition"
                >
                  Try AR Now
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/try-and-fit/size"
                  className="inline-flex items-center justify-center rounded-md bg-white border border-nile-teal px-5 py-3 text-base font-medium text-nile-teal shadow-sm hover:bg-gray-50 transition"
                >
                  Find Your Size
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/try-on-hero.jpg"
                alt="Virtual Try-On Experience"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                <p className="text-white font-medium text-lg">
                  See how it looks on you without leaving home
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-nile-teal font-serif">
                Experience Our Virtual Fitting Room
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Our suite of digital tools lets you experience jewelry in new ways, making purchasing decisions 
                with confidence from anywhere in the world.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={feature.link} className="block h-full">
                    <div className="bg-white shadow-lg rounded-xl p-8 h-full hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
                      <div className={`${feature.color} rounded-full p-3 w-fit mb-6`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{feature.name}</h3>
                      <p className="mt-2 text-gray-600 flex-grow">{feature.description}</p>
                      <div className="mt-6 flex items-center text-nile-teal font-medium">
                        Try Now
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-nile-teal font-serif">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Our technology makes it easy to visualize and try on jewelry from anywhere
              </p>
            </div>
            
            <div className="relative">
              {/* Line connector for desktop */}
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-200 -translate-x-1/2"></div>
              
              <div className="space-y-12 relative">
                {/* Step 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="md:flex items-center"
                >
                  <div className="md:w-1/2 md:pr-12 md:text-right">
                    <div className="bg-white rounded-lg p-6 shadow-md inline-block">
                      <h3 className="text-xl font-bold text-gray-900">
                        Choose Your Jewelry
                      </h3>
                      <p className="mt-2 text-gray-600">
                        Browse our collection and select the piece you'd like to try on or explore in 3D.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex justify-center items-center">
                    <div className="rounded-full bg-nile-teal p-3 relative z-10">
                      <span className="text-white font-bold">1</span>
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pl-12 mt-4 md:mt-0">
                    <Image
                      src="/images/virtual-try-step1.jpg"
                      alt="Choose Your Jewelry"
                      width={320}
                      height={240}
                      className="rounded-lg shadow-md mx-auto md:mx-0"
                    />
                  </div>
                </motion.div>
                
                {/* Step 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="md:flex items-center flex-row-reverse"
                >
                  <div className="md:w-1/2 md:pl-12">
                    <div className="bg-white rounded-lg p-6 shadow-md inline-block">
                      <h3 className="text-xl font-bold text-gray-900">
                        Find Your Size
                      </h3>
                      <p className="mt-2 text-gray-600">
                        Use our ring size calculator or finger measurement tools to find your perfect fit.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex justify-center items-center">
                    <div className="rounded-full bg-nile-teal p-3 relative z-10">
                      <span className="text-white font-bold">2</span>
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pr-12 mt-4 md:mt-0">
                    <Image
                      src="/images/virtual-try-step2.jpg"
                      alt="Find Your Size"
                      width={320}
                      height={240}
                      className="rounded-lg shadow-md mx-auto md:mx-0"
                    />
                  </div>
                </motion.div>
                
                {/* Step 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="md:flex items-center"
                >
                  <div className="md:w-1/2 md:pr-12 md:text-right">
                    <div className="bg-white rounded-lg p-6 shadow-md inline-block">
                      <h3 className="text-xl font-bold text-gray-900">
                        Virtual Try-On
                      </h3>
                      <p className="mt-2 text-gray-600">
                        Use AR technology to see how the jewelry looks on your hand in real-time.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex justify-center items-center">
                    <div className="rounded-full bg-nile-teal p-3 relative z-10">
                      <span className="text-white font-bold">3</span>
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pl-12 mt-4 md:mt-0">
                    <Image
                      src="/images/virtual-try-step3.jpg"
                      alt="Virtual Try-On"
                      width={320}
                      height={240}
                      className="rounded-lg shadow-md mx-auto md:mx-0"
                    />
                  </div>
                </motion.div>
                
                {/* Step 4 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="md:flex items-center flex-row-reverse"
                >
                  <div className="md:w-1/2 md:pl-12">
                    <div className="bg-white rounded-lg p-6 shadow-md inline-block">
                      <h3 className="text-xl font-bold text-gray-900">
                        Make Your Decision
                      </h3>
                      <p className="mt-2 text-gray-600">
                        Purchase with confidence knowing exactly how the piece will look and fit.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex justify-center items-center">
                    <div className="rounded-full bg-nile-teal p-3 relative z-10">
                      <span className="text-white font-bold">4</span>
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pr-12 mt-4 md:mt-0">
                    <Image
                      src="/images/virtual-try-step4.jpg"
                      alt="Make Your Decision"
                      width={320}
                      height={240}
                      className="rounded-lg shadow-md mx-auto md:mx-0"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-nile-teal font-serif">
                Benefits of Virtual Try-On
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Our digital tools provide numerous advantages over traditional shopping methods
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
              >
                <div className="w-12 h-12 bg-nile-teal/10 rounded-full flex items-center justify-center mb-4">
                  <HandRaisedIcon className="h-6 w-6 text-nile-teal" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No Pressure Shopping</h3>
                <p className="mt-2 text-gray-600">
                  Take your time making decisions without the pressure of a salesperson waiting.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
              >
                <div className="w-12 h-12 bg-pharaonic-gold/10 rounded-full flex items-center justify-center mb-4">
                  <DevicePhoneMobileIcon className="h-6 w-6 text-pharaonic-gold" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Shop From Anywhere</h3>
                <p className="mt-2 text-gray-600">
                  Try on and purchase beautiful jewelry from the comfort of your home, anytime.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
              >
                <div className="w-12 h-12 bg-nile-teal/10 rounded-full flex items-center justify-center mb-4">
                  <ViewfinderCircleIcon className="h-6 w-6 text-nile-teal" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Perfect Sizing</h3>
                <p className="mt-2 text-gray-600">
                  Our sizing tools help ensure your jewelry fits perfectly, reducing returns.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-nile-teal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white font-serif">
              Ready to Experience Jewelry Virtually?
            </h2>
            <p className="mt-4 text-xl text-white/80 max-w-3xl mx-auto">
              Try on our collection using our innovative AR technology and find your perfect size today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/try-and-fit/ar"
                className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-base font-medium text-nile-teal shadow-md hover:bg-gray-100 transition"
              >
                Try AR Experience
              </Link>
              <Link
                href="/try-and-fit/size"
                className="inline-flex items-center justify-center rounded-md border border-white bg-transparent px-5 py-3 text-base font-medium text-white shadow-md hover:bg-white/10 transition"
              >
                Find Your Size
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TryAndFitPage; 