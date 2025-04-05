'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n';
import { DevicePhoneMobileIcon, ArrowLeftIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';

// Dynamically import AR component with no SSR
const ARTryOn = dynamic(() => import('@/components/ARTryOn'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nile-teal"></div>
      <p className="mt-4 text-gray-600">Loading AR experience...</p>
    </div>
  )
});

// Jewelry item type
interface JewelryItem {
  id: string;
  name: string;
  description: string;
  type: 'ring' | 'bracelet' | 'necklace' | 'earring';
  image: string;
  modelPath: string;
  price: number;
  metalOptions: string[];
  gemOptions: string[];
}

// Sample jewelry data
const JEWELRY_ITEMS: JewelryItem[] = [
  {
    id: 'diamond-engagement-ring',
    name: 'Diamond Engagement Ring',
    description: 'A beautiful solitaire diamond ring with a classic design.',
    type: 'ring',
    image: '/images/jewelry/diamond-ring.jpg',
    modelPath: '/models/diamond_engagement_ring.glb',
    price: 1499,
    metalOptions: ['gold', 'silver', 'platinum', 'rosegold', 'whitegold'],
    gemOptions: ['diamond', 'ruby', 'sapphire', 'emerald']
  },
  {
    id: 'tennis-bracelet',
    name: 'Tennis Bracelet',
    description: 'Elegant bracelet featuring a line of diamonds in a fine setting.',
    type: 'bracelet',
    image: '/images/jewelry/tennis-bracelet.jpg',
    modelPath: '/models/tennis_bracelet.glb',
    price: 2499,
    metalOptions: ['gold', 'silver', 'platinum'],
    gemOptions: ['diamond', 'emerald', 'sapphire']
  },
  {
    id: 'pearl-necklace',
    name: 'Pearl Necklace',
    description: 'Timeless pearl necklace with elegant sterling silver clasp.',
    type: 'necklace',
    image: '/images/jewelry/pearl-necklace.jpg',
    modelPath: '/models/pearl_necklace.glb',
    price: 899,
    metalOptions: ['silver', 'gold'],
    gemOptions: []
  }
];

export default function ARTryOnPage() {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState<JewelryItem | null>(null);
  const [metalType, setMetalType] = useState<string>('gold');
  const [gemType, setGemType] = useState<string>('diamond');
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);
  const [isARActive, setIsARActive] = useState(false);

  // Check for AR support on component mount
  useEffect(() => {
    // Simple check for WebXR support
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      // @ts-ignore - TypeScript might not know about the isSessionSupported method
      navigator.xr?.isSessionSupported('immersive-ar')
        .then((supported: boolean) => {
          setIsARSupported(supported);
        })
        .catch(() => {
          setIsARSupported(false);
        });
    } else {
      setIsARSupported(false);
    }
  }, []);

  // Select an item and initialize the AR view
  const initiateARExperience = (item: JewelryItem) => {
    setSelectedItem(item);
    
    // Set default options based on the selected item
    if (item.metalOptions.length > 0) {
      setMetalType(item.metalOptions[0]);
    }
    
    if (item.gemOptions.length > 0) {
      setGemType(item.gemOptions[0]);
    }
    
    setIsARActive(true);
    
    // Scroll to AR view
    const arView = document.getElementById('ar-view');
    if (arView) {
      arView.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-900 font-serif">AR Virtual Try-On</h1>
              <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
                Try on jewelry pieces virtually using augmented reality technology
              </p>
            </div>

            {isARSupported === false && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <InformationCircleIcon className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">AR Not Supported</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Your device or browser doesn't seem to support WebXR for augmented reality. 
                        For the best experience, please try using a mobile device with AR capabilities 
                        or a compatible browser.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Jewelry Selection */}
            <div className={`mb-12 ${isARActive ? 'hidden md:block' : ''}`}>
              <h2 className="text-2xl font-bold text-nile-teal mb-6 font-serif">Select Jewelry to Try On</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {JEWELRY_ITEMS.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
                  >
                    <div className="relative h-64">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 mt-2 mb-4">{item.description}</p>
                      <p className="text-pharaonic-gold font-bold mb-4">${item.price.toLocaleString()}</p>
                      <button
                        onClick={() => initiateARExperience(item)}
                        className="w-full bg-nile-teal text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center"
                      >
                        <DevicePhoneMobileIcon className="h-5 w-5 mr-2" />
                        Try On With AR
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AR View */}
            {isARActive && selectedItem && (
              <motion.div
                id="ar-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-12"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                  <div className="md:flex">
                    {/* AR Experience */}
                    <div className="md:w-2/3">
                      <div className="h-[500px] w-full">
                        <Suspense fallback={
                          <div className="h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nile-teal"></div>
                            <span className="ml-2 text-gray-600">Loading AR experience...</span>
                          </div>
                        }>
                          <ARTryOn 
                            selectedMetal={metalType as any} 
                            selectedGem={gemType as any} 
                          />
                        </Suspense>
                      </div>
                    </div>
                    
                    {/* Controls Panel */}
                    <div className="md:w-1/3 p-6 border-t md:border-t-0 md:border-l border-gray-100 bg-bg-light">
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="text-xl font-bold text-gray-900">{selectedItem.name}</h2>
                          <button 
                            onClick={() => setIsARActive(false)}
                            className="text-sm text-nile-teal hover:text-pharaonic-gold"
                          >
                            Change Item
                          </button>
                        </div>
                        <p className="text-gray-600 mb-2">{selectedItem.description}</p>
                        <p className="text-pharaonic-gold font-bold">${selectedItem.price.toLocaleString()}</p>
                      </div>
                      
                      {/* Metal Selection */}
                      {selectedItem.metalOptions.length > 0 && (
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Metal Type
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {selectedItem.metalOptions.map((metal) => (
                              <button
                                key={metal}
                                onClick={() => setMetalType(metal)}
                                className={`px-3 py-2 text-sm border rounded-md ${
                                  metalType === metal 
                                    ? 'bg-nile-teal text-white border-nile-teal' 
                                    : 'border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {metal.charAt(0).toUpperCase() + metal.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Gem Selection */}
                      {selectedItem.gemOptions.length > 0 && (
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gem Type
                          </label>
                          <select
                            value={gemType}
                            onChange={(e) => setGemType(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nile-teal"
                          >
                            {selectedItem.gemOptions.map((gem) => (
                              <option key={gem} value={gem}>
                                {gem.charAt(0).toUpperCase() + gem.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t border-gray-200">
                        <Link
                          href="/try-and-fit/size"
                          className="block text-center mb-4 text-nile-teal hover:text-pharaonic-gold"
                        >
                          Need to find your size?
                        </Link>
                        <button
                          className="w-full bg-pharaonic-gold text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">AR Tips</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-nile-teal/10 text-nile-teal font-medium text-sm">1</span>
                      Position your hand in front of the camera, with your palm facing up
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-nile-teal/10 text-nile-teal font-medium text-sm">2</span>
                      Keep your hand steady for the system to detect your hand position
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-nile-teal/10 text-nile-teal font-medium text-sm">3</span>
                      Try different angles and lighting for the best experience
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-nile-teal/10 text-nile-teal font-medium text-sm">4</span>
                      You can pinch to scale the jewelry if needed
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Mobile Experience Guide */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-nile-teal mb-4 font-serif">For the Best Experience</h2>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Use a Mobile Device</h3>
                  <p className="text-gray-600">
                    AR try-on works best on mobile devices with AR capabilities. Open reefq.com on your smartphone for the full experience.
                  </p>
                </div>
                
                <div className="md:w-1/3">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Good Lighting</h3>
                  <p className="text-gray-600">
                    Find a well-lit environment for the best AR experience and most accurate visualization.
                  </p>
                </div>
                
                <div className="md:w-1/3">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Stable Surface</h3>
                  <p className="text-gray-600">
                    Place your mobile device on a stable surface or have someone hold it while you try on jewelry.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 