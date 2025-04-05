'use client';

import React from 'react';
import { FingerSizeCalculator } from '@/components/FingerSizeCalculator';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function RingSizePage() {
  return (
    <div className="min-h-screen bg-bg-light pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link
              href="/try-and-fit"
              className="inline-flex items-center text-nile-teal hover:text-pharaonic-gold"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Try & Fit
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 font-serif">Find Your Perfect Ring Size</h1>
              <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
                Use our ring size calculator to determine your exact ring size through different measurement methods.
              </p>
            </div>
            
            <FingerSizeCalculator />
            
            <div className="mt-12 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-nile-teal mb-4">Ring Sizing Tips</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Best Time to Measure</h3>
                  <p className="text-gray-600">
                    Measure your finger size at the end of the day when your fingers are at their largest. 
                    Fingers can change size during the day or based on temperature.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Consider Your Knuckle</h3>
                  <p className="text-gray-600">
                    If your knuckle is significantly larger than the base of your finger, measure both and 
                    choose a size in between to ensure the ring can slide over your knuckle but won't be too loose.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Ring Width Matters</h3>
                  <p className="text-gray-600">
                    Wider rings tend to fit more snugly than thin rings. If you're choosing a wide band, 
                    consider sizing up by a half size.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Temperature Effects</h3>
                  <p className="text-gray-600">
                    Cold weather causes fingers to shrink slightly, while heat and humidity can make them swell. 
                    Consider your local climate when choosing your size.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm mb-3">Ready to try on rings with your new size?</p>
              <Link
                href="/try-and-fit/ar" 
                className="inline-block bg-nile-teal text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors"
              >
                Try AR Virtual Try-On
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 