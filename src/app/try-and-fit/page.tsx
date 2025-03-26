'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

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

export default function TryAndFitPage() {
  // State for customization
  const [metalType, setMetalType] = useState<'gold' | 'silver' | 'platinum'>('gold');
  const [gemType, setGemType] = useState<'diamond' | 'ruby' | 'emerald' | 'sapphire'>('diamond');
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);

  // Check for AR support on component mount
  React.useEffect(() => {
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

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <section className="mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-4">Try Before You Buy</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Use augmented reality to see how our jewelry looks on you before making a purchase
          </p>
          {isARSupported === false && (
            <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-md inline-block">
              Your device doesn't seem to support AR. Try using a compatible mobile device.
            </div>
          )}
        </motion.div>
      </section>

      {/* AR Try-on section */}
      <section className="mb-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-[500px] w-full">
            <Suspense fallback={
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            }>
              <ARTryOn 
                selectedMetal={metalType} 
                selectedGem={gemType} 
              />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Controls section */}
      <section className="mb-12">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Customize Your Try-On</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Metal type selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Metal Type</label>
              <div className="flex space-x-2">
                {['gold', 'silver', 'platinum'].map((metal) => (
                  <button
                    key={metal}
                    onClick={() => setMetalType(metal as 'gold' | 'silver' | 'platinum')}
                    className={`px-4 py-2 border rounded-md ${metalType === metal ? 'bg-primary text-white border-primary' : 'border-gray-300'}`}
                  >
                    {metal.charAt(0).toUpperCase() + metal.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Gem type selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gem Type</label>
              <select 
                value={gemType}
                onChange={(e) => setGemType(e.target.value as 'diamond' | 'ruby' | 'emerald' | 'sapphire')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="diamond">Diamond</option>
                <option value="ruby">Ruby</option>
                <option value="emerald">Emerald</option>
                <option value="sapphire">Sapphire</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h3 className="text-xl font-semibold mb-3">Virtual Try-On</h3>
            <p className="text-gray-600">
              See exactly how the jewelry will look on your hand using augmented reality.
            </p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h3 className="text-xl font-semibold mb-3">Realistic Rendering</h3>
            <p className="text-gray-600">
              High-quality 3D models with accurate materials, reflections, and lighting.
            </p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h3 className="text-xl font-semibold mb-3">Easy to Use</h3>
            <p className="text-gray-600">
              Simple controls to adjust and customize your AR experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How it works section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">How It Works</h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">1</div>
              <h3 className="text-lg font-semibold mb-2">Choose Your Jewelry</h3>
              <p className="text-gray-600">Select your preferred metal and gem type</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">2</div>
              <h3 className="text-lg font-semibold mb-2">Grant Camera Access</h3>
              <p className="text-gray-600">Allow the app to use your camera for AR experience</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">3</div>
              <h3 className="text-lg font-semibold mb-2">Try It On</h3>
              <p className="text-gray-600">See the jewelry on your hand in real-time</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 