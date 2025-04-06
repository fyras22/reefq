import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customize Your Jewelry | ReefQ Jewelry',
  description: 'Create your perfect piece of jewelry by selecting materials, gemstones, and customizing to your exact specifications.'
};

export default function CustomizePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-nile-teal text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Design Your Custom Jewelry</h1>
          <p className="mt-2">Create a unique piece that tells your story</p>
        </div>
      </header>

      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden p-1">
          {/* Temporarily replaced with placeholder while fixing component issues */}
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Jewelry Customizer</h2>
            <p className="text-gray-600 mb-6">The customizer is currently being updated with new features.</p>
            <div className="bg-gray-100 rounded-lg p-12 mb-6">
              <p className="text-lg">Customizer Placeholder</p>
            </div>
            <p className="text-sm text-gray-500">Please check back soon for the enhanced jewelry customization experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 