'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/app/i18n-client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowsPointingOutIcon, 
  ViewfinderCircleIcon, 
  UserIcon,
  ArrowLongRightIcon,
  HeartIcon,
  ClockIcon,
  CameraIcon,
  ShoppingBagIcon,
  LockClosedIcon,
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  CheckIcon,
  XMarkIcon,
  ChatBubbleBottomCenterTextIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import AnalyticsTracker, { AnalyticsEvents } from '@/components/AnalyticsTracker';

// Import the testimonials section
const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'), {
  loading: () => (
    <div className="w-full h-[400px] bg-gray-50 rounded-lg flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-t-4 border-primary rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading testimonials...</p>
      </div>
    </div>
  )
});

// Dynamically import components with proper loading indicators
const ARViewer = dynamic(() => import('@/components/ARViewer'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-50 rounded-lg flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-t-4 border-primary rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading AR Experience...</p>
      </div>
    </div>
  ) 
});

const SizeCalculator = dynamic(() => import('@/components/SizeCalculator'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-50 rounded-lg flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-t-4 border-primary rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading Size Calculator...</p>
      </div>
    </div>
  )
});

const FeedbackForm = dynamic(() => import('@/components/FeedbackForm'), {
  loading: () => (
    <div className="w-full h-[400px] bg-gray-50 rounded-lg flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-t-4 border-primary rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading feedback form...</p>
      </div>
    </div>
  )
});

export default function TryAndFitPage({ params }: { params: { lang: string } }) {
  const { t, i18n } = useTranslation(params.lang, 'common');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ar');
  const [measurements, setMeasurements] = useState<any>(null);
  const [recentlyViewedItems, setRecentlyViewedItems] = useState<any[]>([]);
  const [arHistory, setArHistory] = useState<any[]>([]);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRTL = params.lang === 'ar';
  const [translation, setTranslation] = useState<any>({
    title: 'Try & Fit',
    subtitle: 'Try on jewelry virtually and find your perfect size',
    intro: {
      title: 'Experience Jewelry Before You Buy',
      description: 'Our advanced tools help you try on jewelry virtually and find your perfect size from the comfort of your home.'
    },
    tabs: {
      ar: 'AR Try-On',
      sizeCalculator: 'Size Calculator'
    },
    howItWorks: {
      title: 'How It Works',
      step1: {
        title: 'Select a Method',
        description: 'Choose between AR try-on or size calculation based on your needs.'
      },
      step2: {
        title: 'Follow the Instructions',
        description: 'Our tools will guide you through a simple process to get accurate results.'
      },
      step3: {
        title: 'Get Your Results',
        description: 'See how jewelry looks on you or find your perfect size in seconds.'
      }
    },
    measurements: {
      title: 'Your Measurements',
      jewelryType: 'Jewelry Type',
      size: 'Recommended Size',
      method: 'Measurement Method',
      value: 'Measurement Value',
      shopNow: 'Shop Now',
      saveResults: 'Save Results',
      shopSimilar: 'Shop Similar Items'
    },
    shareExperience: {
      title: 'Share Your Experience',
      description: 'Take a screenshot of your try-on and share it with friends or on social media!',
      shareButton: 'Share'
    },
    recentlyViewed: {
      title: 'Recently Viewed',
      viewAll: 'View All'
    },
    emailCapture: {
      title: 'Save Your Measurements',
      description: 'Enter your email to save your measurements and receive personalized recommendations.',
      placeholder: 'Your email address',
      submit: 'Save',
      success: 'Your measurements have been saved!'
    }
  });

  // Handle scroll events for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add event listener to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('language-dropdown');
      const button = document.getElementById('language-button');
      const mobileDropdown = document.getElementById('mobile-language-dropdown');
      const mobileButton = document.getElementById('mobile-language-button');

      if (
        dropdown && 
        !dropdown.contains(event.target as Node) && 
        button && 
        !button.contains(event.target as Node)
      ) {
        dropdown.classList.add('hidden');
      }

      if (
        mobileDropdown && 
        !mobileDropdown.contains(event.target as Node) && 
        mobileButton && 
        !mobileButton.contains(event.target as Node)
      ) {
        mobileDropdown.classList.add('hidden');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize translation
  useEffect(() => {
    const loadTranslation = async () => {
      try {
        // Make sure i18n is initialized with the correct language
        if (params.lang) {
          await i18n.changeLanguage(params.lang);
        }

        // Load recently viewed items from local storage
        const storedItems = localStorage.getItem('recentlyViewedJewelry');
        if (storedItems) {
          setRecentlyViewedItems(JSON.parse(storedItems));
        }

        // Load AR history from local storage
        const storedHistory = localStorage.getItem('arTryOnHistory');
        if (storedHistory) {
          setArHistory(JSON.parse(storedHistory));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading translations:', error);
        setLoading(false);
      }
    };

    loadTranslation();
  }, [params.lang, i18n]);

  // Show feedback form after significant interactions
  useEffect(() => {
    if (measurements || (arHistory && arHistory.length > 0)) {
      // Set a timeout before showing the feedback form
      // This ensures the user has had some time to experience the page
      const timer = setTimeout(() => {
        setShowFeedbackForm(true);
      }, 60000); // Show after 1 minute of engagement
      
      return () => clearTimeout(timer);
    }
  }, [measurements, arHistory]);

  const handleComplete = (data: any) => {
    console.log('Session completed:', data);
    if (data && data.type) {
      // This is measurement data
      setMeasurements(data);
      
      // Track size calculation in analytics
      AnalyticsEvents.trackSizeCalculated(data.type, data.measurements?.method || 'unknown');
      
      // Save to AR history if it's from AR try-on
      if (activeTab === 'ar') {
        const newHistory = [data, ...arHistory.slice(0, 4)];
        setArHistory(newHistory);
        localStorage.setItem('arTryOnHistory', JSON.stringify(newHistory));
      }
      
      // Show email capture after getting measurements
      setTimeout(() => {
        setShowEmailCapture(true);
      }, 2000);
    }
  };

  const handleSaveResults = () => {
    // Track this event
    console.log('Saving measurements:', measurements);
    
    // Track feature engagement
    AnalyticsEvents.trackFeature('save_measurements');
    
    // Show email capture
    setShowEmailCapture(true);
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Start loading state
    setEmailSubmitting(true);
    
    try {
      // Track email capture
      AnalyticsEvents.trackEmailCaptured();
      
      // Send data to API
      const response = await fetch('/api/save-measurements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          measurements,
          preferences: {
            // Any additional preferences the user might have set
            metalType: 'gold', // Example
            gemType: 'diamond', // Example
          }
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Show success message
        setEmailSuccess(true);
        
        // Store recommendations
        if (data.recommendations) {
          setRecommendations(data.recommendations);
          
          // Show recommendations after a brief delay
          setTimeout(() => {
            setShowEmailCapture(false);
            setShowRecommendations(true);
          }, 1500);
        } else {
          // Just close the modal if no recommendations
          setTimeout(() => {
            setShowEmailCapture(false);
          }, 1500);
        }
        
        // Store user ID in localStorage if returned
        if (data.userId) {
          localStorage.setItem('reefqUserId', data.userId);
        }
      } else {
        // Show error
        console.error('Failed to save measurements:', data.message);
        setEmailSuccess(false);
      }
    } catch (error) {
      console.error('Error saving measurements:', error);
      setEmailSuccess(false);
    } finally {
      setEmailSubmitting(false);
    }
  };

  const handleShopNowClick = (source: string) => {
    // Track shop now click
    AnalyticsEvents.trackShopNow(
      source, 
      measurements?.type || 'unknown', 
      measurements?.size || 'unknown'
    );
  };

  const handleARStart = () => {
    // Track AR session start
    AnalyticsEvents.trackARStart();
    setActiveTab('ar');
  };

  const handleFeatureEngagement = (feature: string) => {
    // Track feature engagement
    AnalyticsEvents.trackFeature(feature);
  };

  const mockRecentlyViewed = [
    {
      id: 1,
      name: 'Diamond Solitaire Ring',
      price: '$1,299',
      image: '/images/jewelry/ring-1.jpg'
    },
    {
      id: 2,
      name: 'Gold Bangle Bracelet',
      price: '$899',
      image: '/images/jewelry/bracelet-1.jpg'
    },
    {
      id: 3,
      name: 'Pearl Necklace',
      price: '$699',
      image: '/images/jewelry/necklace-1.jpg'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-t-4 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Custom Header with Language Switcher */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
        isScrolled ? 'bg-white shadow-sm py-2' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            {/* Logo - Left in LTR, Right in RTL */}
            <div className={`flex ${isRTL ? 'order-3' : 'order-1'}`}>
              <Link href="/" className="flex items-center">
                <span className="sr-only">Reefq</span>
                <img 
                  src="/images/logo.svg" 
                  alt="Reefq Logo"
                  className="h-8 w-auto object-contain"
                  width={120}
                  height={40}
                />
              </Link>
            </div>
            
            {/* Center Navigation */}
            <div className={`hidden lg:flex items-center justify-center order-2 flex-1`}>
              <ul className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <li>
                  <Link 
                    href={`/${params.lang}`} 
                    className="px-3 py-2 text-gray-700 hover:text-primary text-sm font-medium"
                  >
                    {t('header.features')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${params.lang}#virtual-try-on`} 
                    className="px-3 py-2 text-gray-700 hover:text-primary text-sm font-medium"
                  >
                    {t('header.tryOn')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${params.lang}#how-it-works`} 
                    className="px-3 py-2 text-gray-700 hover:text-primary text-sm font-medium"
                  >
                    {t('header.customize')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${params.lang}#performance`} 
                    className="px-3 py-2 text-gray-700 hover:text-primary text-sm font-medium"
                  >
                    {t('header.performance')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${params.lang}#comparison`} 
                    className="px-3 py-2 text-gray-700 hover:text-primary text-sm font-medium"
                  >
                    {t('header.comparison')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${params.lang}#pricing`} 
                    className="px-3 py-2 text-gray-700 hover:text-primary text-sm font-medium"
                  >
                    {t('header.pricing')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${params.lang}/try-and-fit`} 
                    className="px-3 py-2 text-primary font-medium text-sm"
                  >
                    {t('header.tryAndFit')}
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Language Switcher - Right in LTR, Left in RTL */}
            <div className={`hidden lg:flex items-center gap-4 ${isRTL ? 'order-1' : 'order-3'}`}>
              <div className="relative inline-block text-left">
                <button 
                  id="language-button"
                  type="button"
                  className={`inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}
                  onClick={() => {
                    // Toggle dropdown
                    const dropdown = document.getElementById('language-dropdown');
                    if (dropdown) {
                      dropdown.classList.toggle('hidden');
                    }
                  }}
                >
                  <span className="mx-1">{params.lang.toUpperCase()}</span>
                  <svg className={`h-5 w-5 ${isRTL ? 'mr-1' : 'ml-1'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div id="language-dropdown" className="hidden origin-top-right absolute mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 right-0">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <a
                      href="/en/try-and-fit"
                      className={`${params.lang === 'en' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block w-full ${isRTL ? 'text-right pr-4' : 'text-left pl-4'} py-2 text-sm hover:bg-gray-100`}
                      role="menuitem"
                    >
                      English
                    </a>
                    <a
                      href="/fr/try-and-fit"
                      className={`${params.lang === 'fr' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block w-full ${isRTL ? 'text-right pr-4' : 'text-left pl-4'} py-2 text-sm hover:bg-gray-100`}
                      role="menuitem"
                    >
                      Français
                    </a>
                    <a
                      href="/ar/try-and-fit"
                      className={`${params.lang === 'ar' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block w-full ${isRTL ? 'text-right pr-4' : 'text-left pl-4'} py-2 text-sm hover:bg-gray-100`}
                      role="menuitem"
                    >
                      العربية
                    </a>
                  </div>
                </div>
              </div>
              <a
                href="/auth/login"
                className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary focus:ring-primary`}
              >
                {t('header.getStarted')}
              </a>
            </div>

            {/* Mobile menu button */}
            <div className={`flex lg:hidden items-center ${isRTL ? 'order-1' : 'order-3'}`}>
              <div className="mr-2">
                <button
                  id="mobile-language-button"
                  className="inline-flex items-center px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-700"
                  onClick={() => {
                    const dropdown = document.getElementById('mobile-language-dropdown');
                    if (dropdown) {
                      dropdown.classList.toggle('hidden');
                    }
                  }}
                >
                  {params.lang.toUpperCase()}
                </button>
                <div id="mobile-language-dropdown" className="hidden absolute mt-2 right-16 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <a href="/en/try-and-fit" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">English</a>
                    <a href="/fr/try-and-fit" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Français</a>
                    <a href="/ar/try-and-fit" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">العربية</a>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </nav>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden pt-2 pb-3 border-t border-gray-200 mt-2">
              <div className="space-y-1">
                <Link 
                  href={`/${params.lang}`}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.features')}
                </Link>
                <Link 
                  href={`/${params.lang}#virtual-try-on`}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.tryOn')}
                </Link>
                <Link 
                  href={`/${params.lang}#how-it-works`}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.customize')}
                </Link>
                <Link 
                  href={`/${params.lang}#performance`}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.performance')}
                </Link>
                <Link 
                  href={`/${params.lang}#comparison`}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.comparison')}
                </Link>
                <Link 
                  href={`/${params.lang}#pricing`}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.pricing')}
                </Link>
                <Link 
                  href={`/${params.lang}/try-and-fit`}
                  className="block px-3 py-2 text-base font-medium text-primary bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.tryAndFit')}
                </Link>
                
                <div className="pt-4 pb-2">
                  <a
                    href="/auth/login"
                    className="block w-full text-center px-4 py-2 text-base font-medium text-white bg-primary hover:bg-primary/90 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('header.getStarted')}
                  </a>
                </div>
              </div>
          </div>
          )}
        </div>
      </header>

      {/* Main Content - Add padding-top to account for fixed header */}
      <main className="pt-20 min-h-screen bg-gray-50">
        {/* Analytics Tracker Component */}
        <AnalyticsTracker />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {translation.title}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {translation.subtitle}
          </p>

        {/* Introduction */}
        <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
            {translation.intro.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
            {translation.intro.description}
            </motion.p>
        </div>

        {/* Feature Tabs */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              <button
                  onClick={() => {
                    setActiveTab('ar');
                    handleFeatureEngagement('ar_tab');
                  }}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'ar'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ViewfinderCircleIcon className="w-5 h-5 inline-block mr-2" />
                {translation.tabs.ar}
              </button>
              <button
                  onClick={() => {
                    setActiveTab('size');
                    handleFeatureEngagement('size_calculator_tab');
                  }}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'size'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ArrowsPointingOutIcon className="w-5 h-5 inline-block mr-2" />
                {translation.tabs.sizeCalculator}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* AR Try-On Experience */}
            {activeTab === 'ar' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ARViewer onSessionComplete={handleComplete} />
                  
                  {/* Share Experience */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{translation.shareExperience.title}</h3>
                        <p className="text-sm text-gray-600">{translation.shareExperience.description}</p>
                      </div>
                      <button
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                        onClick={() => {
                          // This would be connected to the device's sharing functionality
                          console.log('Share functionality triggered');
                          AnalyticsEvents.trackARShare();
                        }}
                      >
                        <CameraIcon className="h-5 w-5 mr-2" />
                        {translation.shareExperience.shareButton}
                      </button>
                    </div>
                  </div>
              </motion.div>
            )}

            {/* Size Calculator */}
            {activeTab === 'size' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <SizeCalculator onMeasurementComplete={handleComplete} />
              </motion.div>
            )}
          </div>
        </div>

        {/* Measurements Results */}
        {measurements && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              className="mb-12 bg-gray-50 rounded-lg p-6 border border-gray-200"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">{translation.measurements.title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="text-sm text-gray-500">{translation.measurements.jewelryType}</div>
                <div className="font-medium text-gray-900 capitalize">{measurements.type}</div>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="text-sm text-gray-500">{translation.measurements.size}</div>
                <div className="font-medium text-gray-900">{measurements.size}</div>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="text-sm text-gray-500">{translation.measurements.method}</div>
                <div className="font-medium text-gray-900 capitalize">{measurements.measurements?.method || ''}</div>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="text-sm text-gray-500">{translation.measurements.value}</div>
                <div className="font-medium text-gray-900">
                  {measurements.measurements?.method === 'circumference'
                    ? measurements.measurements?.circumference
                    : measurements.measurements?.diameter}{' '}
                  {measurements.measurements?.measurementUnit || ''}
                </div>
              </div>
            </div>

              <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link
                  href={`/jewelry?type=${measurements.type}&size=${measurements.size}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
                  onClick={() => handleShopNowClick('measurement_results')}
              >
                {translation.measurements.shopNow} <ArrowLongRightIcon className="ml-2 h-5 w-5" />
              </Link>
                
                <button
                  onClick={handleSaveResults}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  <HeartIcon className="mr-2 h-5 w-5" />
                  {translation.measurements.saveResults}
                </button>
              </div>
            </motion.div>
          )}

          {/* Email Capture Modal - Updated */}
          {showEmailCapture && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                {!emailSuccess ? (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{translation.emailCapture.title}</h3>
                    <p className="text-gray-600 mb-4">{translation.emailCapture.description}</p>
                    
                    <form onSubmit={handleSubmitEmail}>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={translation.emailCapture.placeholder}
                        required
                        disabled={emailSubmitting}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
                      />
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowEmailCapture(false)}
                          disabled={emailSubmitting}
                          className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={emailSubmitting}
                          className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                        >
                          {emailSubmitting ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </span>
                          ) : translation.emailCapture.submit}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                      <CheckIcon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{translation.emailCapture.success}</h3>
                    <p className="text-gray-600">We're preparing your personalized recommendations!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Personalized Recommendations Modal */}
          {showRecommendations && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-lg p-6 max-w-3xl w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Your Perfect Match</h3>
                  <button
                    onClick={() => setShowRecommendations(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Based on your {measurements?.type} size {measurements?.size}, we've selected these pieces just for you:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {recommendations.map((item) => (
                    <Link key={item.id} href={`/jewelry/${item.id}?size=${item.size}`}>
                      <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                        <div className="aspect-square bg-gray-100 relative">
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            {/* Placeholder for image */}
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">Image</div>
                          </div>
                          {item.fitsYou && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              Perfect Fit
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900 group-hover:text-primary">{item.name}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-gray-600">{item.price}</p>
                            <p className="text-sm text-primary">Size: {item.size}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-4">
                    We've sent these recommendations to {email}
                  </p>
                  <button
                    onClick={() => setShowRecommendations(false)}
                    className="px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90"
                  >
                    Continue Shopping
                  </button>
                </div>
            </div>
          </motion.div>
        )}

          {/* Recently Viewed Products */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {translation.recentlyViewed.title}
              </h2>
              <Link href="/jewelry" className="text-primary hover:text-primary/80">
                {translation.recentlyViewed.viewAll}
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {mockRecentlyViewed.map((item) => (
                <Link key={item.id} href={`/jewelry/${item.id}`}>
                  <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gray-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        {/* Placeholder for image */}
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">Image</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 group-hover:text-primary">{item.name}</h3>
                      <p className="text-gray-600">{item.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Customer Testimonials Section */}
          <TestimonialsSection />

          {/* How It Works - Improved with icons and better visual hierarchy */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {translation.howItWorks.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6 text-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                  1
                </div>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <ViewfinderCircleIcon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {translation.howItWorks.step1.title}
              </h3>
              <p className="text-gray-600">
                {translation.howItWorks.step1.description}
              </p>
            </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 text-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                  2
                </div>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <UserIcon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {translation.howItWorks.step2.title}
              </h3>
              <p className="text-gray-600">
                {translation.howItWorks.step2.description}
              </p>
            </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 text-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                  3
                </div>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <ArrowsPointingOutIcon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {translation.howItWorks.step3.title}
              </h3>
              <p className="text-gray-600">
                {translation.howItWorks.step3.description}
              </p>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="mt-12 bg-gradient-to-r from-primary to-secondary rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to find your perfect jewelry?</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Try our AR experience or find your size now and discover jewelry that fits you perfectly.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  handleARStart();
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-white text-primary rounded-md font-medium hover:bg-gray-100"
              >
                Try AR Experience
              </button>
              <button
                onClick={() => {
                  setActiveTab('size');
                  handleFeatureEngagement('size_calculator_cta');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="px-6 py-3 border border-white text-white rounded-md font-medium hover:bg-white/10"
              >
                Calculate Your Size
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">How accurate is the AR try-on feature?</h3>
                <p className="text-gray-600">
                  Our AR try-on uses advanced hand tracking technology to provide a realistic preview of how jewelry will look on you. While it gives a very good approximation, slight variations may occur between the virtual try-on and the actual jewelry.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">How accurate is the size calculator?</h3>
                <p className="text-gray-600">
                  Our size calculator is highly accurate when measurements are taken correctly. For best results, follow the measurement instructions carefully and measure multiple times to ensure consistency.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">What are different ways to measure my ring size?</h3>
                <p className="text-gray-600">
                  We offer several methods for measuring your ring size: 
                  (1) Using a measuring tape for circumference, 
                  (2) Using calipers for diameter measurement, 
                  (3) Placing an existing ring directly on your screen and adjusting our virtual ring sizer, and 
                  (4) Using our virtual ruler to measure a string wrapped around your finger. Each method provides accurate results when used correctly.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Can I save my measurements for future purchases?</h3>
                <p className="text-gray-600">
                  Yes! After using the size calculator, you can save your measurements to your profile. This allows for easier shopping in the future as we'll remember your sizes and can provide personalized recommendations.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Which devices support the AR try-on feature?</h3>
                <p className="text-gray-600">
                  The AR try-on feature works best on newer smartphones and tablets with ARKit (iOS) or ARCore (Android) support. Most devices manufactured in the last 3-4 years should be compatible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Trust Badges Footer */}
      <div className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Shop With Confidence</h2>
            <p className="text-gray-600">We're committed to providing a secure and seamless jewelry shopping experience</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-3">
                <LockClosedIcon className="h-8 w-8" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Secure Shopping</h3>
              <p className="text-xs text-gray-600">256-bit SSL encryption</p>
            </div>
            
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-3">
                <TruckIcon className="h-8 w-8" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Free Shipping</h3>
              <p className="text-xs text-gray-600">On orders over $99</p>
            </div>
            
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-3">
                <ArrowPathIcon className="h-8 w-8" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Easy Returns</h3>
              <p className="text-xs text-gray-600">30-day money back</p>
            </div>
            
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-3">
                <ShieldCheckIcon className="h-8 w-8" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Quality Guarantee</h3>
              <p className="text-xs text-gray-600">1-year warranty</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <FeedbackForm onClose={() => setShowFeedbackForm(false)} />
        </motion.div>
      )}

      {/* Optional Feedback Button in Footer */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setShowFeedbackForm(true)}
          className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90"
          aria-label="Give feedback"
        >
          <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
} 