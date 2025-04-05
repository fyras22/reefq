import Link from 'next/link';
import { Suspense } from 'react';
import UserMenu from '@/components/layout/UserMenu';

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-semibold text-indigo-600">ReefQ</span>
              </Link>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8" aria-label="Main navigation">
                <Link
                  href="/demo"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Demo Home
                </Link>
                <Link
                  href="/demo/jewelry"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Jewelry
                </Link>
                <Link
                  href="/demo/jewelry/assets-demo"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Assets Demo
                </Link>
                <Link
                  href="/demo/jewelry/diamond-visualizer"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Diamond Explorer
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <Suspense fallback={
                <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-50">
                  Loading...
                </div>
              }>
                <UserMenu />
              </Suspense>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Demo</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/demo/jewelry" className="text-base text-gray-500 hover:text-gray-900">
                    Jewelry Showcase
                  </Link>
                </li>
                <li>
                  <Link href="/demo/jewelry/assets-demo" className="text-base text-gray-500 hover:text-gray-900">
                    Assets Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/docs/ASSET_GENERATION_GUIDE.md" className="text-base text-gray-500 hover:text-gray-900">
                    Asset Generation Guide
                  </Link>
                </li>
                <li>
                  <Link href="/docs/ASSETS_README.md" className="text-base text-gray-500 hover:text-gray-900">
                    Assets Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Account</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/auth/login" className="text-base text-gray-500 hover:text-gray-900">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="text-base text-gray-500 hover:text-gray-900">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center">
            <p className="text-base text-gray-400">&copy; 2023 ReefQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 