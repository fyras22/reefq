'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CubeTransparentIcon,
  SparklesIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { 
    name: 'Features', 
    href: '#features',
    icon: <CubeTransparentIcon className="h-5 w-5" />
  },
  { 
    name: 'How It Works', 
    href: '#how-it-works',
    icon: <ChartBarIcon className="h-5 w-5" />
  },
  { 
    name: 'Performance', 
    href: '#performance',
    icon: <SparklesIcon className="h-5 w-5" />
  },
  { 
    name: 'Pricing', 
    href: '#pricing',
    icon: <CurrencyDollarIcon className="h-5 w-5" />
  },
  { 
    name: 'Testimonials', 
    href: '#testimonials',
    icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />
  },
  { 
    name: 'FAQ', 
    href: '#faq',
    icon: <QuestionMarkCircleIcon className="h-5 w-5" />
  },
  { 
    name: 'Try & Fit', 
    href: '/try-and-fit', 
    highlight: true,
    icon: <SparklesIcon className="h-5 w-5 text-pharaonic-gold" />
  },
];

interface LandingSidebarProps {
  isRTL?: boolean;
  activeSection?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LandingSidebar({ isRTL = false, activeSection = 'hero', isOpen, onClose }: LandingSidebarProps) {
  // Helper function for smooth scrolling
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // Account for header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      onClose(); // Close the sidebar after clicking a link
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.aside 
            className={`block lg:hidden fixed top-0 bottom-0 ${isRTL ? 'right-0' : 'left-0'} w-[280px] z-50 bg-white shadow-xl overflow-hidden`}
            initial={{ x: isRTL ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="flex flex-col h-full">
              {/* Header with logo and close button */}
              <div className="p-4 flex items-center justify-between border-b border-gray-200">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/images/logo.svg"
                    alt="Reefq"
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain"
                    priority
                  />
                </Link>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                  aria-label="Close sidebar"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              {/* Navigation */}
              <nav className={`flex-1 overflow-y-auto py-6 px-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                <ul className="space-y-2">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        onClick={(e) => scrollToSection(e, item.href.replace('#', ''))}
                        className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors relative ${
                          activeSection === item.href.replace('#', '')
                            ? 'text-nile-teal bg-nile-teal/10'
                            : 'text-gray-700 hover:text-nile-teal hover:bg-gray-50'
                        } ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                        {activeSection === item.href.replace('#', '') && (
                          <motion.span
                            className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-0 bottom-0 w-1 bg-nile-teal rounded-full`}
                            layoutId="activeSidebarSection"
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                          />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              
              {/* CTA */}
              <div className="p-6 border-t border-gray-200">
                <a
                  href="/auth/login"
                  className="flex items-center justify-center gap-2 rounded-md w-full px-4 py-2.5 text-sm font-medium text-white bg-nile-teal hover:bg-opacity-90 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-teal"
                >
                  Get Started
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
} 