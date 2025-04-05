'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  ChevronDownIcon, 
  Squares2X2Icon, 
  ShoppingBagIcon, 
  UserGroupIcon, 
  CogIcon, 
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  current?: boolean;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navigation: NavItem[] = [
    { 
      name: 'Dashboard', 
      href: '/dashboard/admin', 
      icon: <Squares2X2Icon className="h-6 w-6" aria-hidden="true" />,
      current: pathname === '/dashboard/admin'
    },
    { 
      name: 'Products', 
      href: '/dashboard/admin/products', 
      icon: <ShoppingBagIcon className="h-6 w-6" aria-hidden="true" />,
      current: pathname.startsWith('/dashboard/admin/products')
    },
    { 
      name: 'Customers', 
      href: '/dashboard/admin/customers', 
      icon: <UserGroupIcon className="h-6 w-6" aria-hidden="true" />,
      current: pathname.startsWith('/dashboard/admin/customers')
    },
    { 
      name: 'Settings', 
      href: '/dashboard/admin/settings', 
      icon: <CogIcon className="h-6 w-6" aria-hidden="true" />,
      current: pathname.startsWith('/dashboard/admin/settings')
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 flex z-40">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-nile-teal">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <Link href="/" className="text-white font-serif text-2xl">ReefQ Admin</Link>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        item.current
                          ? 'bg-nile-teal-900 text-white'
                          : 'text-white hover:bg-nile-teal-800'
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-nile-teal-800 p-4">
                <form action="/auth/signout" method="post" className="flex-shrink-0 w-full group block">
                  <button type="submit" className="flex items-center text-white">
                    <ArrowLeftOnRectangleIcon className="h-6 w-6" aria-hidden="true" />
                    <span className="ml-3">Sign out</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
        
        <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-nile-teal"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      
      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-nile-teal">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link href="/" className="text-white font-serif text-2xl">ReefQ Admin</Link>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    item.current
                      ? 'bg-nile-teal-900 text-white'
                      : 'text-white hover:bg-nile-teal-800'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-nile-teal-800 p-4">
            <form action="/auth/signout" method="post" className="flex-shrink-0 w-full group block">
              <button type="submit" className="flex items-center text-white">
                <ArrowLeftOnRectangleIcon className="h-6 w-6" aria-hidden="true" />
                <span className="ml-3">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="lg:pl-64 flex flex-col">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
} 