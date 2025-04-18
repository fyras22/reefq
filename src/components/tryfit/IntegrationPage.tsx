'use client';

import React from 'react';
import TryFitFeature from './TryFitFeature';
import PageTransition from '@/components/utils/PageTransition';
import CustomCursor from '../utils/CustomCursor';
import Button from '../ui/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface IntegrationPageProps {
  lang?: string;
}

// Simple translation function type that matches what TryFitFeature needs
interface SimpleTranslationFunction {
  (key: string): string;
}

export default function IntegrationPage({ lang = 'en' }: IntegrationPageProps) {
  // Mock translation function
  const mockTranslation: SimpleTranslationFunction = (key: string): string => {
    // Simple translation dictionary
    const translations: Record<string, string> = {
      'tryFit.pageTitle': 'Find Your Perfect Fit',
      'tryFit.pageSubtitle': 'Try on jewelry virtually and determine your exact size',
      'tryFit.methods.title': 'Choose Sizing Method',
      'tryFit.methods.camera.title': 'Camera Sizing',
      'tryFit.methods.camera.description': 'Use your device camera to measure',
      'tryFit.methods.hand.title': 'Hand Measurement',
      'tryFit.methods.hand.description': 'Measure your finger or wrist',
      'tryFit.methods.guide.title': 'Sizing Guide',
      'tryFit.methods.guide.description': 'Follow our step-by-step guide',
      'tryFit.results.title': 'Your Perfect Size',
      'tryFit.results.description': 'Based on your measurements',
      'common.back': 'Back',
      'common.next': 'Next',
      'common.skip': 'Skip',
    };
    
    return translations[key] || key;
  };

  return (
    <PageTransition type="fade">
      <div className="min-h-screen bg-gray-50">
        {/* Enhanced cursor experience */}
        <CustomCursor 
          color="#2A5B5E" 
          ringColor="rgba(196, 162, 101, 0.5)"
          disableOnMobile={true}
        />
        
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center text-nile-teal hover:text-nile-teal/90 transition-colors">
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  <span>{mockTranslation('tryFit.back')}</span>
                </Link>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{mockTranslation('tryFit.pageTitle')}</h1>
              </div>
              <div className="w-24">
                {/* Empty div for balance */}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{mockTranslation('tryFit.pageTitle')}</h2>
                <p className="text-lg text-gray-600">{mockTranslation('tryFit.pageSubtitle')}</p>
              </div>
              
              {/* Try Fit Component */}
              <TryFitFeature t={mockTranslation} />
              
              {/* Additional Information */}
              <div className="mt-16 bg-white rounded-2xl shadow-lg p-6 space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Why Find Your Exact Size?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-nile-teal/10 flex items-center justify-center">
                        <span className="text-nile-teal font-semibold">1</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Perfect Comfort</h4>
                      <p className="mt-1 text-gray-600">Properly sized jewelry ensures all-day comfort without slipping or pinching.</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-pharaonic-gold/10 flex items-center justify-center">
                        <span className="text-pharaonic-gold font-semibold">2</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Reduced Returns</h4>
                      <p className="mt-1 text-gray-600">Finding your size before purchase significantly reduces the need for exchanges.</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-nile-teal/10 flex items-center justify-center">
                        <span className="text-nile-teal font-semibold">3</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Long-Term Value</h4>
                      <p className="mt-1 text-gray-600">Properly fitted jewelry lasts longer and maintains its beauty over time.</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-pharaonic-gold/10 flex items-center justify-center">
                        <span className="text-pharaonic-gold font-semibold">4</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Confidence in Purchase</h4>
                      <p className="mt-1 text-gray-600">Shop with confidence knowing exactly which size to select for your jewelry.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-pharaonic-gold mb-4">Reefq</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Revolutionizing jewelry retail with AI-powered 3D visualization. 
                Try, customize, and perfect your jewelry online.
              </p>
              <div className="mt-8 flex justify-center space-x-6">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
              <p className="mt-8 text-sm text-gray-400">© 2023 Reefq. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
} 