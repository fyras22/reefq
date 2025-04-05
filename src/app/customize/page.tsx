import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';
import JewelryCustomizer from '@/components/JewelryCustomizer';

export const metadata: Metadata = {
  title: 'Customize Your Jewelry | ReefQ Jewelry',
  description: 'Create your perfect piece of jewelry by selecting materials, gemstones, and customizing to your exact specifications.'
};

export default function CustomizePage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-nile-teal/90 to-pharaonic-gold/80 text-white py-12">
        <div className="container mx-auto px-4">
          <Link 
            href="/jewelry" 
            className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Jewelry Collection
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Design Your Perfect Piece</h1>
          <p className="text-white/90 max-w-2xl text-lg">
            Customize your jewelry by selecting metals, gemstones, size, and other options
            to create something uniquely yours.
          </p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden p-1">
          <JewelryCustomizer />
        </div>
      </div>
    </div>
  );
} 