'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { JewelryCustomizer } from '@/components/JewelryCustomizer';
import { JewelryVirtualTryOn } from '@/components/JewelryVirtualTryOn';
import Link from 'next/link';

export default function CustomizePage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('customize');
  const [metalType, setMetalType] = useState('gold');
  const [gemType, setGemType] = useState('emerald');
  const [jewelryType, setJewelryType] = useState('ring');
  const [showTryOn, setShowTryOn] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Callback to receive state from JewelryCustomizer
  const handleCustomizerUpdate = (data) => {
    if (data.metalType) setMetalType(data.metalType);
    if (data.gemType) setGemType(data.gemType);
    if (data.jewelryType) setJewelryType(data.jewelryType);
  };

  if (isLoading) {
    return (
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nile-teal"></div>
        </div>
      </main>
    );
  }
  
  if (showTryOn) {
    return (
      <main className="container mx-auto py-8 px-4">
        <div className="mb-4 flex items-center">
          <button 
            onClick={() => setShowTryOn(false)}
            className="flex items-center text-nile-teal hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Customizer
          </button>
          <h2 className="text-2xl font-bold text-center flex-1 pr-10">Virtual Try-On</h2>
        </div>
        
        <div className="max-w-lg mx-auto">
          <JewelryVirtualTryOn 
            metalType={metalType}
            gemType={gemType}
            jewelryType={jewelryType}
          />
          
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Try-On Tips</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>Make sure you're in a well-lit area</li>
              <li>Hold your device steady for the best results</li>
              <li>You can adjust the position and size after taking the photo</li>
              <li>Save the image to share with friends and family</li>
            </ul>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
      <section className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Customize Your Jewelry
        </h1>
              <p className="text-lg text-gray-600 max-w-3xl">
                Create your perfect piece with our interactive design tool. Customize every detail 
                from metal type to gemstone and setting style, then visualize it in real-time.
              </p>
              
              <button
                onClick={() => setShowTryOn(true)}
                className="mt-4 flex items-center text-nile-teal hover:underline font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Try On Virtually
              </button>
            </div>
            <div className="hidden md:block">
              <Image 
                src="/images/customize-header.jpg" 
                alt="Jewelry customization" 
                width={200} 
                height={200}
                className="rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
          
          {/* Page tabs */}
          <div className="flex border-b border-gray-200 mt-8">
            <button
              onClick={() => setActiveTab('customize')}
              className={`py-2 px-4 font-medium text-sm transition-colors ${
                activeTab === 'customize' 
                  ? 'text-nile-teal border-b-2 border-nile-teal' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Customize
            </button>
            <button
              onClick={() => setActiveTab('inspiration')}
              className={`py-2 px-4 font-medium text-sm transition-colors ${
                activeTab === 'inspiration' 
                  ? 'text-nile-teal border-b-2 border-nile-teal' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Design Inspiration
            </button>
            <button
              onClick={() => setActiveTab('howItWorks')}
              className={`py-2 px-4 font-medium text-sm transition-colors ${
                activeTab === 'howItWorks' 
                  ? 'text-nile-teal border-b-2 border-nile-teal' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              How It Works
            </button>
          </div>
        </section>
        
        {activeTab === 'customize' && (
          <>
            <div className="bg-gray-50 p-4 md:p-8 rounded-2xl">
              <JewelryCustomizer 
                productId={productId || undefined} 
                onUpdate={handleCustomizerUpdate}
              />
            </div>

            <section className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-nile-teal/10 text-nile-teal rounded-full mr-2 font-bold">1</span>
                  <h3 className="text-xl font-semibold text-gray-800">Handcrafted Quality</h3>
                </div>
                <p className="text-gray-600">
                  Each piece is meticulously crafted by our master artisans using the finest materials
                  and time-honored techniques.
                </p>
              </div>

              <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-nile-teal/10 text-nile-teal rounded-full mr-2 font-bold">2</span>
                  <h3 className="text-xl font-semibold text-gray-800">Free Shipping</h3>
                </div>
                <p className="text-gray-600">
                  All custom orders include complimentary secure shipping and a 
                  luxurious gift box for the perfect presentation.
                </p>
              </div>

              <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-nile-teal/10 text-nile-teal rounded-full mr-2 font-bold">3</span>
                  <h3 className="text-xl font-semibold text-gray-800">Lifetime Warranty</h3>
                </div>
                <p className="text-gray-600">
                  Your custom jewelry comes with a lifetime warranty against manufacturing 
                  defects for complete peace of mind.
                </p>
              </div>
      </section>
      
            <section className="mt-12 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                  <h3 className="font-medium text-gray-900">How long does it take to receive my custom jewelry?</h3>
                  <p className="mt-2 text-gray-600">
                    Custom pieces typically take 2-3 weeks to craft. Once completed, shipping takes 2-3 business days.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                  <h3 className="font-medium text-gray-900">Can I modify my design after placing an order?</h3>
                  <p className="mt-2 text-gray-600">
                    Minor modifications can be made within 24 hours of order placement. Contact our customer service team immediately.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                  <h3 className="font-medium text-gray-900">Do you offer resize services after purchase?</h3>
                  <p className="mt-2 text-gray-600">
                    Yes, we offer one complimentary resize within the first year of purchase. Additional resizes are available for a fee.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
        
        {activeTab === 'inspiration' && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Design Inspiration Gallery</h2>
            <p className="text-gray-600 mb-6">Browse through our collection of custom-designed jewelry for inspiration.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="rounded-lg overflow-hidden bg-gray-100 aspect-square flex items-center justify-center hover:opacity-90 transition-opacity">
                  <p className="text-gray-500 text-sm">Inspiration Image {item}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Have a design in mind?</h3>
              <p className="text-gray-600 mb-4">
                Our jewelry experts can help bring your unique vision to life. Schedule a consultation with our design team.
              </p>
              <Link href="/contact" className="inline-block bg-nile-teal text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-nile-teal/90 transition-colors">
                Schedule Consultation
              </Link>
            </div>
          </div>
        )}
        
        {activeTab === 'howItWorks' && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">How Our Customization Process Works</h2>
            
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-16 flex-shrink-0 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-nile-teal/20 flex items-center justify-center text-nile-teal font-bold text-xl">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-gray-800 mb-2">Customize Your Design</h3>
                  <p className="text-gray-600">
                    Use our interactive tool to select your preferred metal, gemstones, setting style, and size. 
                    See your design come to life in real-time with our 3D visualization.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-16 flex-shrink-0 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-nile-teal/20 flex items-center justify-center text-nile-teal font-bold text-xl">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-gray-800 mb-2">Review and Confirm</h3>
                  <p className="text-gray-600">
                    Once you're happy with your design, you can save it or proceed to checkout. 
                    You'll receive a detailed summary of your custom piece, including all specifications.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-16 flex-shrink-0 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-nile-teal/20 flex items-center justify-center text-nile-teal font-bold text-xl">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-gray-800 mb-2">Artisan Crafting</h3>
                  <p className="text-gray-600">
                    Our master jewelers carefully craft your piece by hand, ensuring exquisite attention to detail. 
                    We'll keep you updated on your order's progress throughout the creation process.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-16 flex-shrink-0 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-nile-teal/20 flex items-center justify-center text-nile-teal font-bold text-xl">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-gray-800 mb-2">Delivery and Enjoyment</h3>
                  <p className="text-gray-600">
                    Your custom jewelry arrives in elegant packaging, ready to be cherished for generations. 
                    All custom pieces include our lifetime warranty and satisfaction guarantee.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-gray-50 rounded-lg flex flex-col sm:flex-row items-center justify-between">
              <p className="text-gray-700 font-medium mb-4 sm:mb-0">Ready to create your unique piece?</p>
              <button 
                onClick={() => setActiveTab('customize')}
                className="bg-nile-teal text-white py-2 px-6 rounded-md text-sm font-medium hover:bg-nile-teal/90 transition-colors"
              >
                Start Customizing Now
              </button>
            </div>
      </div>
        )}
      </motion.div>
    </main>
  );
} 