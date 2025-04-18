'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Dialog } from '@headlessui/react';
import { 
  CubeTransparentIcon,
  ArrowRightCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ShoppingBagIcon,
  UserIcon,
  GlobeAltIcon,
  RectangleGroupIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Try & Fit', href: '/try-and-fit', highlight: true },
];

export default function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <nav className="flex items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <RectangleGroupIcon className="h-8 w-8 text-nile-teal" />
            <span className="text-xl font-semibold text-gray-900">Reefq</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-semibold leading-6 ${
                item.highlight 
                  ? 'text-pharaonic-gold hover:text-pharaonic-gold/90 flex items-center gap-1' 
                  : 'text-gray-900 hover:text-nile-teal'
              }`}
            >
              {item.highlight && <SparklesIcon className="h-4 w-4 text-pharaonic-gold" />}
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-4">
          <Link 
            href="/login" 
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-nile-teal flex items-center gap-1"
          >
            <UserIcon className="h-5 w-5" />
            <span>Log in</span>
          </Link>
          <Link 
            href="/cart" 
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-nile-teal flex items-center gap-1"
          >
            <ShoppingBagIcon className="h-5 w-5" />
            <span>Cart</span>
          </Link>
          <Link 
            href="/language" 
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-nile-teal flex items-center gap-1"
          >
            <GlobeAltIcon className="h-5 w-5" />
            <span>EN</span>
          </Link>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <RectangleGroupIcon className="h-8 w-8 text-nile-teal" />
              <span className="text-xl font-semibold text-gray-900">Reefq</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                      item.highlight 
                        ? 'text-pharaonic-gold hover:bg-gray-50 flex items-center' 
                        : 'text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.highlight && <SparklesIcon className="h-4 w-4 text-pharaonic-gold mr-2" />}
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  href="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserIcon className="h-5 w-5 mr-2" />
                  Log in
                </Link>
                <Link
                  href="/cart"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingBagIcon className="h-5 w-5 mr-2" />
                  Cart
                </Link>
                <Link
                  href="/language"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <GlobeAltIcon className="h-5 w-5 mr-2" />
                  Language
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
} 