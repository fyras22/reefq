'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import components with no SSR
const JewelryViewer = dynamic(() => import('@/components/JewelryViewer').then(mod => mod.JewelryViewer), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  ),
});

export default function ThreeDModelingPage() {
  const [metalType, setMetalType] = useState<'gold' | 'silver' | 'platinum'>('gold');
  const [gemType, setGemType] = useState<'diamond' | 'ruby' | 'sapphire' | 'emerald'>('diamond');
  const [size, setSize] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            3D Jewelry Modeling
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Explore our collection of intricately detailed 3D jewelry models with customizable materials and settings.
          </motion.p>
        </div>
      </section>

      {/* 3D Viewer Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mx-auto max-w-3xl">
            {/* Jewelry Viewer */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div style={{ height: "500px" }}>
                <JewelryViewer metalType={metalType} gemType={gemType} size={size} />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metal Type
                </label>
                <select
                  value={metalType}
                  onChange={(e) => setMetalType(e.target.value as 'gold' | 'silver' | 'platinum')}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gem Type
                </label>
                <select
                  value={gemType}
                  onChange={(e) => setGemType(e.target.value as 'diamond' | 'ruby' | 'sapphire' | 'emerald')}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="diamond">Diamond</option>
                  <option value="ruby">Ruby</option>
                  <option value="sapphire">Sapphire</option>
                  <option value="emerald">Emerald</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={size}
                  onChange={(e) => setSize(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Small</span>
                  <span>Large</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Realistic Materials',
                description: 'High-quality materials with accurate physical properties',
                icon: '💎',
              },
              {
                title: 'Interactive Controls',
                description: 'Rotate, zoom, and customize your view',
                icon: '🎮',
              },
              {
                title: 'Custom Options',
                description: 'Choose different metals, gems and sizes',
                icon: '✨',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center p-6 bg-gray-50 rounded-lg"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 